/* eslint-disable no-multi-spaces */
// Extensions
import { Service } from '../service';
// Utilities
import * as ThemeUtils from './utils';
import { getNestedValue } from '../../util/helpers';
// Types
import Vue from 'vue';
export class Theme extends Service {
    constructor(preset) {
        super();
        this.disabled = false;
        this.isDark = null;
        this.unwatch = null;
        this.vueMeta = null;
        const { dark, disable, options, themes, } = preset[Theme.property];
        this.dark = Boolean(dark);
        this.defaults = this.themes = themes;
        this.options = options;
        if (disable) {
            this.disabled = true;
            return;
        }
        this.themes = {
            dark: this.fillVariant(themes.dark, true),
            light: this.fillVariant(themes.light, false),
        };
    }
    // When setting css, check for element
    // and apply new values
    set css(val) {
        if (this.vueMeta) {
            if (this.isVueMeta23) {
                this.applyVueMeta23();
            }
            return;
        }
        this.checkOrCreateStyleElement() && (this.styleEl.innerHTML = val);
    }
    set dark(val) {
        const oldDark = this.isDark;
        this.isDark = val;
        // Only apply theme after dark
        // has already been set before
        oldDark != null && this.applyTheme();
    }
    get dark() {
        return Boolean(this.isDark);
    }
    // Apply current theme default
    // only called on client side
    applyTheme() {
        if (this.disabled)
            return this.clearCss();
        this.css = this.generatedStyles;
    }
    clearCss() {
        this.css = '';
    }
    // Initialize theme for SSR and SPA
    // Attach to ssrContext head or
    // apply new theme to document
    init(root, ssrContext) {
        if (this.disabled)
            return;
        /* istanbul ignore else */
        if (root.$meta) {
            this.initVueMeta(root);
        }
        else if (ssrContext) {
            this.initSSR(ssrContext);
        }
        this.initTheme(root);
    }
    // Allows for you to set target theme
    setTheme(theme, value) {
        this.themes[theme] = Object.assign(this.themes[theme], value);
        this.applyTheme();
    }
    // Reset theme defaults
    resetThemes() {
        this.themes.light = Object.assign({}, this.defaults.light);
        this.themes.dark = Object.assign({}, this.defaults.dark);
        this.applyTheme();
    }
    // Check for existence of style element
    checkOrCreateStyleElement() {
        this.styleEl = document.getElementById('vuetify-theme-stylesheet');
        /* istanbul ignore next */
        if (this.styleEl)
            return true;
        this.genStyleElement(); // If doesn't have it, create it
        return Boolean(this.styleEl);
    }
    fillVariant(theme = {}, dark) {
        const defaultTheme = this.themes[dark ? 'dark' : 'light'];
        return Object.assign({}, defaultTheme, theme);
    }
    // Generate the style element
    // if applicable
    genStyleElement() {
        /* istanbul ignore if */
        if (typeof document === 'undefined')
            return;
        /* istanbul ignore next */
        this.styleEl = document.createElement('style');
        this.styleEl.type = 'text/css';
        this.styleEl.id = 'vuetify-theme-stylesheet';
        if (this.options.cspNonce) {
            this.styleEl.setAttribute('nonce', this.options.cspNonce);
        }
        document.head.appendChild(this.styleEl);
    }
    initVueMeta(root) {
        this.vueMeta = root.$meta();
        if (this.isVueMeta23) {
            // vue-meta needs to apply after mounted()
            root.$nextTick(() => {
                this.applyVueMeta23();
            });
            return;
        }
        const metaKeyName = typeof this.vueMeta.getOptions === 'function' ? this.vueMeta.getOptions().keyName : 'metaInfo';
        const metaInfo = root.$options[metaKeyName] || {};
        root.$options[metaKeyName] = () => {
            metaInfo.style = metaInfo.style || [];
            const vuetifyStylesheet = metaInfo.style.find((s) => s.id === 'vuetify-theme-stylesheet');
            if (!vuetifyStylesheet) {
                metaInfo.style.push({
                    cssText: this.generatedStyles,
                    type: 'text/css',
                    id: 'vuetify-theme-stylesheet',
                    nonce: (this.options || {}).cspNonce,
                });
            }
            else {
                vuetifyStylesheet.cssText = this.generatedStyles;
            }
            return metaInfo;
        };
    }
    applyVueMeta23() {
        const { set } = this.vueMeta.addApp('vuetify');
        set({
            style: [{
                    cssText: this.generatedStyles,
                    type: 'text/css',
                    id: 'vuetify-theme-stylesheet',
                    nonce: this.options.cspNonce,
                }],
        });
    }
    initSSR(ssrContext) {
        // SSR
        const nonce = this.options.cspNonce ? ` nonce="${this.options.cspNonce}"` : '';
        ssrContext.head = ssrContext.head || '';
        ssrContext.head += `<style type="text/css" id="vuetify-theme-stylesheet"${nonce}>${this.generatedStyles}</style>`;
    }
    initTheme(root) {
        // Only watch for reactivity on client side
        if (typeof document === 'undefined')
            return;
        // If we get here somehow, ensure
        // existing instance is removed
        if (this.unwatch) {
            this.unwatch();
            this.unwatch = null;
        }
        // TODO: Update to use RFC if merged
        // https://github.com/vuejs/rfcs/blob/advanced-reactivity-api/active-rfcs/0000-advanced-reactivity-api.md
        root.$once('hook:created', () => {
            const obs = Vue.observable({ themes: this.themes });
            this.unwatch = root.$watch(() => obs.themes, () => this.applyTheme(), { deep: true });
        });
        this.applyTheme();
    }
    get currentTheme() {
        const target = this.dark ? 'dark' : 'light';
        return this.themes[target];
    }
    get generatedStyles() {
        const theme = this.parsedTheme;
        /* istanbul ignore next */
        const options = this.options || {};
        let css;
        if (options.themeCache != null) {
            css = options.themeCache.get(theme);
            /* istanbul ignore if */
            if (css != null)
                return css;
        }
        css = ThemeUtils.genStyles(theme, options.customProperties);
        if (options.minifyTheme != null) {
            css = options.minifyTheme(css);
        }
        if (options.themeCache != null) {
            options.themeCache.set(theme, css);
        }
        return css;
    }
    get parsedTheme() {
        return ThemeUtils.parse(this.currentTheme || {}, undefined, getNestedValue(this.options, ['variations'], true));
    }
    // Is using v2.3 of vue-meta
    // https://github.com/nuxt/vue-meta/releases/tag/v2.3.0
    get isVueMeta23() {
        return typeof this.vueMeta.addApp === 'function';
    }
}
Theme.property = 'theme';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2VydmljZXMvdGhlbWUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsb0NBQW9DO0FBQ3BDLGFBQWE7QUFDYixPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sWUFBWSxDQUFBO0FBRXBDLFlBQVk7QUFDWixPQUFPLEtBQUssVUFBVSxNQUFNLFNBQVMsQ0FBQTtBQUNyQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFFbkQsUUFBUTtBQUNSLE9BQU8sR0FBRyxNQUFNLEtBQUssQ0FBQTtBQVNyQixNQUFNLE9BQU8sS0FBTSxTQUFRLE9BQU87SUFtQmhDLFlBQWEsTUFBcUI7UUFDaEMsS0FBSyxFQUFFLENBQUE7UUFqQkYsYUFBUSxHQUFHLEtBQUssQ0FBQTtRQVVmLFdBQU0sR0FBRyxJQUFzQixDQUFBO1FBRS9CLFlBQU8sR0FBRyxJQUEyQixDQUFBO1FBRXJDLFlBQU8sR0FBRyxJQUFrQixDQUFBO1FBS2xDLE1BQU0sRUFDSixJQUFJLEVBQ0osT0FBTyxFQUNQLE9BQU8sRUFDUCxNQUFNLEdBQ1AsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBRTFCLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7UUFDcEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7UUFFdEIsSUFBSSxPQUFPLEVBQUU7WUFDWCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQTtZQUVwQixPQUFNO1NBQ1A7UUFFRCxJQUFJLENBQUMsTUFBTSxHQUFHO1lBQ1osSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7WUFDekMsS0FBSyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7U0FDN0MsQ0FBQTtJQUNILENBQUM7SUFFRCxzQ0FBc0M7SUFDdEMsdUJBQXVCO0lBQ3ZCLElBQUksR0FBRyxDQUFFLEdBQVc7UUFDbEIsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2hCLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDcEIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFBO2FBQ3RCO1lBQ0QsT0FBTTtTQUNQO1FBQ0QsSUFBSSxDQUFDLHlCQUF5QixFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBUSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsQ0FBQTtJQUNyRSxDQUFDO0lBRUQsSUFBSSxJQUFJLENBQUUsR0FBWTtRQUNwQixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFBO1FBRTNCLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFBO1FBQ2pCLDhCQUE4QjtRQUM5Qiw4QkFBOEI7UUFDOUIsT0FBTyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7SUFDdEMsQ0FBQztJQUVELElBQUksSUFBSTtRQUNOLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUM3QixDQUFDO0lBRUQsOEJBQThCO0lBQzlCLDZCQUE2QjtJQUN0QixVQUFVO1FBQ2YsSUFBSSxJQUFJLENBQUMsUUFBUTtZQUFFLE9BQU8sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBRXpDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQTtJQUNqQyxDQUFDO0lBRU0sUUFBUTtRQUNiLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFBO0lBQ2YsQ0FBQztJQUVELG1DQUFtQztJQUNuQywrQkFBK0I7SUFDL0IsOEJBQThCO0lBQ3ZCLElBQUksQ0FBRSxJQUFTLEVBQUUsVUFBZ0I7UUFDdEMsSUFBSSxJQUFJLENBQUMsUUFBUTtZQUFFLE9BQU07UUFFekIsMEJBQTBCO1FBQzFCLElBQUssSUFBWSxDQUFDLEtBQUssRUFBRTtZQUN2QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFBO1NBQ3ZCO2FBQU0sSUFBSSxVQUFVLEVBQUU7WUFDckIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQTtTQUN6QjtRQUVELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDdEIsQ0FBQztJQUVELHFDQUFxQztJQUM5QixRQUFRLENBQUUsS0FBdUIsRUFBRSxLQUFhO1FBQ3JELElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFBO1FBQzdELElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtJQUNuQixDQUFDO0lBRUQsdUJBQXVCO0lBQ2hCLFdBQVc7UUFDaEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUMxRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3hELElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtJQUNuQixDQUFDO0lBRUQsdUNBQXVDO0lBQy9CLHlCQUF5QjtRQUMvQixJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsMEJBQTBCLENBQXFCLENBQUE7UUFFdEYsMEJBQTBCO1FBQzFCLElBQUksSUFBSSxDQUFDLE9BQU87WUFBRSxPQUFPLElBQUksQ0FBQTtRQUU3QixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUEsQ0FBQyxnQ0FBZ0M7UUFFdkQsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQzlCLENBQUM7SUFFTyxXQUFXLENBQ2pCLFFBQXNDLEVBQUUsRUFDeEMsSUFBYTtRQUViLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBRXpELE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQ3JCLFlBQVksRUFDWixLQUFLLENBQ04sQ0FBQTtJQUNILENBQUM7SUFFRCw2QkFBNkI7SUFDN0IsZ0JBQWdCO0lBQ1IsZUFBZTtRQUNyQix3QkFBd0I7UUFDeEIsSUFBSSxPQUFPLFFBQVEsS0FBSyxXQUFXO1lBQUUsT0FBTTtRQUUzQywwQkFBMEI7UUFDMUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQzlDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQTtRQUM5QixJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRywwQkFBMEIsQ0FBQTtRQUU1QyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFO1lBQ3pCLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1NBQzFEO1FBRUQsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ3pDLENBQUM7SUFFTyxXQUFXLENBQUUsSUFBUztRQUM1QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUMzQixJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDcEIsMENBQTBDO1lBQzFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO2dCQUNsQixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUE7WUFDdkIsQ0FBQyxDQUFDLENBQUE7WUFDRixPQUFNO1NBQ1A7UUFFRCxNQUFNLFdBQVcsR0FBRyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQTtRQUNsSCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtRQUVqRCxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEdBQUcsRUFBRTtZQUNoQyxRQUFRLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFBO1lBRXJDLE1BQU0saUJBQWlCLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssMEJBQTBCLENBQUMsQ0FBQTtZQUU5RixJQUFJLENBQUMsaUJBQWlCLEVBQUU7Z0JBQ3RCLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO29CQUNsQixPQUFPLEVBQUUsSUFBSSxDQUFDLGVBQWU7b0JBQzdCLElBQUksRUFBRSxVQUFVO29CQUNoQixFQUFFLEVBQUUsMEJBQTBCO29CQUM5QixLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVE7aUJBQ3JDLENBQUMsQ0FBQTthQUNIO2lCQUFNO2dCQUNMLGlCQUFpQixDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFBO2FBQ2pEO1lBRUQsT0FBTyxRQUFRLENBQUE7UUFDakIsQ0FBQyxDQUFBO0lBQ0gsQ0FBQztJQUVPLGNBQWM7UUFDcEIsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBRTlDLEdBQUcsQ0FBQztZQUNGLEtBQUssRUFBRSxDQUFDO29CQUNOLE9BQU8sRUFBRSxJQUFJLENBQUMsZUFBZTtvQkFDN0IsSUFBSSxFQUFFLFVBQVU7b0JBQ2hCLEVBQUUsRUFBRSwwQkFBMEI7b0JBQzlCLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVE7aUJBQzdCLENBQUM7U0FDSCxDQUFDLENBQUE7SUFDSixDQUFDO0lBRU8sT0FBTyxDQUFFLFVBQWdCO1FBQy9CLE1BQU07UUFDTixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsV0FBVyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUE7UUFDOUUsVUFBVSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQTtRQUN2QyxVQUFVLENBQUMsSUFBSSxJQUFJLHVEQUF1RCxLQUFLLElBQUksSUFBSSxDQUFDLGVBQWUsVUFBVSxDQUFBO0lBQ25ILENBQUM7SUFFTyxTQUFTLENBQUUsSUFBUztRQUMxQiwyQ0FBMkM7UUFDM0MsSUFBSSxPQUFPLFFBQVEsS0FBSyxXQUFXO1lBQUUsT0FBTTtRQUUzQyxpQ0FBaUM7UUFDakMsK0JBQStCO1FBQy9CLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNoQixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7WUFDZCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTtTQUNwQjtRQUVELG9DQUFvQztRQUNwQyx5R0FBeUc7UUFDekcsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFO1lBQzlCLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUE7WUFDbkQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7UUFDdkYsQ0FBQyxDQUFDLENBQUE7UUFDRixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7SUFDbkIsQ0FBQztJQUVELElBQUksWUFBWTtRQUNkLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFBO1FBRTNDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUM1QixDQUFDO0lBRUQsSUFBSSxlQUFlO1FBQ2pCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUE7UUFDOUIsMEJBQTBCO1FBQzFCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFBO1FBQ2xDLElBQUksR0FBRyxDQUFBO1FBRVAsSUFBSSxPQUFPLENBQUMsVUFBVSxJQUFJLElBQUksRUFBRTtZQUM5QixHQUFHLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDbkMsd0JBQXdCO1lBQ3hCLElBQUksR0FBRyxJQUFJLElBQUk7Z0JBQUUsT0FBTyxHQUFHLENBQUE7U0FDNUI7UUFFRCxHQUFHLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUE7UUFFM0QsSUFBSSxPQUFPLENBQUMsV0FBVyxJQUFJLElBQUksRUFBRTtZQUMvQixHQUFHLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtTQUMvQjtRQUVELElBQUksT0FBTyxDQUFDLFVBQVUsSUFBSSxJQUFJLEVBQUU7WUFDOUIsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFBO1NBQ25DO1FBRUQsT0FBTyxHQUFHLENBQUE7SUFDWixDQUFDO0lBRUQsSUFBSSxXQUFXO1FBQ2IsT0FBTyxVQUFVLENBQUMsS0FBSyxDQUNyQixJQUFJLENBQUMsWUFBWSxJQUFJLEVBQUUsRUFDdkIsU0FBUyxFQUNULGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQ25ELENBQUE7SUFDSCxDQUFDO0lBRUQsNEJBQTRCO0lBQzVCLHVEQUF1RDtJQUN2RCxJQUFZLFdBQVc7UUFDckIsT0FBTyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxLQUFLLFVBQVUsQ0FBQTtJQUNsRCxDQUFDOztBQTVRTSxjQUFRLEdBQVksT0FBTyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbm8tbXVsdGktc3BhY2VzICovXG4vLyBFeHRlbnNpb25zXG5pbXBvcnQgeyBTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZSdcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgKiBhcyBUaGVtZVV0aWxzIGZyb20gJy4vdXRpbHMnXG5pbXBvcnQgeyBnZXROZXN0ZWRWYWx1ZSB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcblxuLy8gVHlwZXNcbmltcG9ydCBWdWUgZnJvbSAndnVlJ1xuaW1wb3J0IHsgVnVldGlmeVByZXNldCB9IGZyb20gJ3Z1ZXRpZnkvdHlwZXMvc2VydmljZXMvcHJlc2V0cydcbmltcG9ydCB7XG4gIFZ1ZXRpZnlQYXJzZWRUaGVtZSxcbiAgVnVldGlmeVRoZW1lcyxcbiAgVnVldGlmeVRoZW1lVmFyaWFudCxcbiAgVGhlbWUgYXMgSVRoZW1lLFxufSBmcm9tICd2dWV0aWZ5L3R5cGVzL3NlcnZpY2VzL3RoZW1lJ1xuXG5leHBvcnQgY2xhc3MgVGhlbWUgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgc3RhdGljIHByb3BlcnR5OiAndGhlbWUnID0gJ3RoZW1lJ1xuXG4gIHB1YmxpYyBkaXNhYmxlZCA9IGZhbHNlXG5cbiAgcHVibGljIG9wdGlvbnM6IElUaGVtZVsnb3B0aW9ucyddXG5cbiAgcHVibGljIHN0eWxlRWw/OiBIVE1MU3R5bGVFbGVtZW50XG5cbiAgcHVibGljIHRoZW1lczogVnVldGlmeVRoZW1lc1xuXG4gIHB1YmxpYyBkZWZhdWx0czogVnVldGlmeVRoZW1lc1xuXG4gIHByaXZhdGUgaXNEYXJrID0gbnVsbCBhcyBib29sZWFuIHwgbnVsbFxuXG4gIHByaXZhdGUgdW53YXRjaCA9IG51bGwgYXMgKCgpID0+IHZvaWQpIHwgbnVsbFxuXG4gIHByaXZhdGUgdnVlTWV0YSA9IG51bGwgYXMgYW55IHwgbnVsbFxuXG4gIGNvbnN0cnVjdG9yIChwcmVzZXQ6IFZ1ZXRpZnlQcmVzZXQpIHtcbiAgICBzdXBlcigpXG5cbiAgICBjb25zdCB7XG4gICAgICBkYXJrLFxuICAgICAgZGlzYWJsZSxcbiAgICAgIG9wdGlvbnMsXG4gICAgICB0aGVtZXMsXG4gICAgfSA9IHByZXNldFtUaGVtZS5wcm9wZXJ0eV1cblxuICAgIHRoaXMuZGFyayA9IEJvb2xlYW4oZGFyaylcbiAgICB0aGlzLmRlZmF1bHRzID0gdGhpcy50aGVtZXMgPSB0aGVtZXNcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG5cbiAgICBpZiAoZGlzYWJsZSkge1xuICAgICAgdGhpcy5kaXNhYmxlZCA9IHRydWVcblxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy50aGVtZXMgPSB7XG4gICAgICBkYXJrOiB0aGlzLmZpbGxWYXJpYW50KHRoZW1lcy5kYXJrLCB0cnVlKSxcbiAgICAgIGxpZ2h0OiB0aGlzLmZpbGxWYXJpYW50KHRoZW1lcy5saWdodCwgZmFsc2UpLFxuICAgIH1cbiAgfVxuXG4gIC8vIFdoZW4gc2V0dGluZyBjc3MsIGNoZWNrIGZvciBlbGVtZW50XG4gIC8vIGFuZCBhcHBseSBuZXcgdmFsdWVzXG4gIHNldCBjc3MgKHZhbDogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMudnVlTWV0YSkge1xuICAgICAgaWYgKHRoaXMuaXNWdWVNZXRhMjMpIHtcbiAgICAgICAgdGhpcy5hcHBseVZ1ZU1ldGEyMygpXG4gICAgICB9XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy5jaGVja09yQ3JlYXRlU3R5bGVFbGVtZW50KCkgJiYgKHRoaXMuc3R5bGVFbCEuaW5uZXJIVE1MID0gdmFsKVxuICB9XG5cbiAgc2V0IGRhcmsgKHZhbDogYm9vbGVhbikge1xuICAgIGNvbnN0IG9sZERhcmsgPSB0aGlzLmlzRGFya1xuXG4gICAgdGhpcy5pc0RhcmsgPSB2YWxcbiAgICAvLyBPbmx5IGFwcGx5IHRoZW1lIGFmdGVyIGRhcmtcbiAgICAvLyBoYXMgYWxyZWFkeSBiZWVuIHNldCBiZWZvcmVcbiAgICBvbGREYXJrICE9IG51bGwgJiYgdGhpcy5hcHBseVRoZW1lKClcbiAgfVxuXG4gIGdldCBkYXJrICgpIHtcbiAgICByZXR1cm4gQm9vbGVhbih0aGlzLmlzRGFyaylcbiAgfVxuXG4gIC8vIEFwcGx5IGN1cnJlbnQgdGhlbWUgZGVmYXVsdFxuICAvLyBvbmx5IGNhbGxlZCBvbiBjbGllbnQgc2lkZVxuICBwdWJsaWMgYXBwbHlUaGVtZSAoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQpIHJldHVybiB0aGlzLmNsZWFyQ3NzKClcblxuICAgIHRoaXMuY3NzID0gdGhpcy5nZW5lcmF0ZWRTdHlsZXNcbiAgfVxuXG4gIHB1YmxpYyBjbGVhckNzcyAoKTogdm9pZCB7XG4gICAgdGhpcy5jc3MgPSAnJ1xuICB9XG5cbiAgLy8gSW5pdGlhbGl6ZSB0aGVtZSBmb3IgU1NSIGFuZCBTUEFcbiAgLy8gQXR0YWNoIHRvIHNzckNvbnRleHQgaGVhZCBvclxuICAvLyBhcHBseSBuZXcgdGhlbWUgdG8gZG9jdW1lbnRcbiAgcHVibGljIGluaXQgKHJvb3Q6IFZ1ZSwgc3NyQ29udGV4dD86IGFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSByZXR1cm5cblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgaWYgKChyb290IGFzIGFueSkuJG1ldGEpIHtcbiAgICAgIHRoaXMuaW5pdFZ1ZU1ldGEocm9vdClcbiAgICB9IGVsc2UgaWYgKHNzckNvbnRleHQpIHtcbiAgICAgIHRoaXMuaW5pdFNTUihzc3JDb250ZXh0KVxuICAgIH1cblxuICAgIHRoaXMuaW5pdFRoZW1lKHJvb3QpXG4gIH1cblxuICAvLyBBbGxvd3MgZm9yIHlvdSB0byBzZXQgdGFyZ2V0IHRoZW1lXG4gIHB1YmxpYyBzZXRUaGVtZSAodGhlbWU6ICdsaWdodCcgfCAnZGFyaycsIHZhbHVlOiBvYmplY3QpIHtcbiAgICB0aGlzLnRoZW1lc1t0aGVtZV0gPSBPYmplY3QuYXNzaWduKHRoaXMudGhlbWVzW3RoZW1lXSwgdmFsdWUpXG4gICAgdGhpcy5hcHBseVRoZW1lKClcbiAgfVxuXG4gIC8vIFJlc2V0IHRoZW1lIGRlZmF1bHRzXG4gIHB1YmxpYyByZXNldFRoZW1lcyAoKSB7XG4gICAgdGhpcy50aGVtZXMubGlnaHQgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRzLmxpZ2h0KVxuICAgIHRoaXMudGhlbWVzLmRhcmsgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRzLmRhcmspXG4gICAgdGhpcy5hcHBseVRoZW1lKClcbiAgfVxuXG4gIC8vIENoZWNrIGZvciBleGlzdGVuY2Ugb2Ygc3R5bGUgZWxlbWVudFxuICBwcml2YXRlIGNoZWNrT3JDcmVhdGVTdHlsZUVsZW1lbnQgKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMuc3R5bGVFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2dWV0aWZ5LXRoZW1lLXN0eWxlc2hlZXQnKSBhcyBIVE1MU3R5bGVFbGVtZW50XG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGlmICh0aGlzLnN0eWxlRWwpIHJldHVybiB0cnVlXG5cbiAgICB0aGlzLmdlblN0eWxlRWxlbWVudCgpIC8vIElmIGRvZXNuJ3QgaGF2ZSBpdCwgY3JlYXRlIGl0XG5cbiAgICByZXR1cm4gQm9vbGVhbih0aGlzLnN0eWxlRWwpXG4gIH1cblxuICBwcml2YXRlIGZpbGxWYXJpYW50IChcbiAgICB0aGVtZTogUGFydGlhbDxWdWV0aWZ5VGhlbWVWYXJpYW50PiA9IHt9LFxuICAgIGRhcms6IGJvb2xlYW5cbiAgKTogVnVldGlmeVRoZW1lVmFyaWFudCB7XG4gICAgY29uc3QgZGVmYXVsdFRoZW1lID0gdGhpcy50aGVtZXNbZGFyayA/ICdkYXJrJyA6ICdsaWdodCddXG5cbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSxcbiAgICAgIGRlZmF1bHRUaGVtZSxcbiAgICAgIHRoZW1lXG4gICAgKVxuICB9XG5cbiAgLy8gR2VuZXJhdGUgdGhlIHN0eWxlIGVsZW1lbnRcbiAgLy8gaWYgYXBwbGljYWJsZVxuICBwcml2YXRlIGdlblN0eWxlRWxlbWVudCAoKTogdm9pZCB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHJldHVyblxuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICB0aGlzLnN0eWxlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpXG4gICAgdGhpcy5zdHlsZUVsLnR5cGUgPSAndGV4dC9jc3MnXG4gICAgdGhpcy5zdHlsZUVsLmlkID0gJ3Z1ZXRpZnktdGhlbWUtc3R5bGVzaGVldCdcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuY3NwTm9uY2UpIHtcbiAgICAgIHRoaXMuc3R5bGVFbC5zZXRBdHRyaWJ1dGUoJ25vbmNlJywgdGhpcy5vcHRpb25zLmNzcE5vbmNlKVxuICAgIH1cblxuICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQodGhpcy5zdHlsZUVsKVxuICB9XG5cbiAgcHJpdmF0ZSBpbml0VnVlTWV0YSAocm9vdDogYW55KSB7XG4gICAgdGhpcy52dWVNZXRhID0gcm9vdC4kbWV0YSgpXG4gICAgaWYgKHRoaXMuaXNWdWVNZXRhMjMpIHtcbiAgICAgIC8vIHZ1ZS1tZXRhIG5lZWRzIHRvIGFwcGx5IGFmdGVyIG1vdW50ZWQoKVxuICAgICAgcm9vdC4kbmV4dFRpY2soKCkgPT4ge1xuICAgICAgICB0aGlzLmFwcGx5VnVlTWV0YTIzKClcbiAgICAgIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBtZXRhS2V5TmFtZSA9IHR5cGVvZiB0aGlzLnZ1ZU1ldGEuZ2V0T3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJyA/IHRoaXMudnVlTWV0YS5nZXRPcHRpb25zKCkua2V5TmFtZSA6ICdtZXRhSW5mbydcbiAgICBjb25zdCBtZXRhSW5mbyA9IHJvb3QuJG9wdGlvbnNbbWV0YUtleU5hbWVdIHx8IHt9XG5cbiAgICByb290LiRvcHRpb25zW21ldGFLZXlOYW1lXSA9ICgpID0+IHtcbiAgICAgIG1ldGFJbmZvLnN0eWxlID0gbWV0YUluZm8uc3R5bGUgfHwgW11cblxuICAgICAgY29uc3QgdnVldGlmeVN0eWxlc2hlZXQgPSBtZXRhSW5mby5zdHlsZS5maW5kKChzOiBhbnkpID0+IHMuaWQgPT09ICd2dWV0aWZ5LXRoZW1lLXN0eWxlc2hlZXQnKVxuXG4gICAgICBpZiAoIXZ1ZXRpZnlTdHlsZXNoZWV0KSB7XG4gICAgICAgIG1ldGFJbmZvLnN0eWxlLnB1c2goe1xuICAgICAgICAgIGNzc1RleHQ6IHRoaXMuZ2VuZXJhdGVkU3R5bGVzLFxuICAgICAgICAgIHR5cGU6ICd0ZXh0L2NzcycsXG4gICAgICAgICAgaWQ6ICd2dWV0aWZ5LXRoZW1lLXN0eWxlc2hlZXQnLFxuICAgICAgICAgIG5vbmNlOiAodGhpcy5vcHRpb25zIHx8IHt9KS5jc3BOb25jZSxcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZ1ZXRpZnlTdHlsZXNoZWV0LmNzc1RleHQgPSB0aGlzLmdlbmVyYXRlZFN0eWxlc1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbWV0YUluZm9cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFwcGx5VnVlTWV0YTIzICgpIHtcbiAgICBjb25zdCB7IHNldCB9ID0gdGhpcy52dWVNZXRhLmFkZEFwcCgndnVldGlmeScpXG5cbiAgICBzZXQoe1xuICAgICAgc3R5bGU6IFt7XG4gICAgICAgIGNzc1RleHQ6IHRoaXMuZ2VuZXJhdGVkU3R5bGVzLFxuICAgICAgICB0eXBlOiAndGV4dC9jc3MnLFxuICAgICAgICBpZDogJ3Z1ZXRpZnktdGhlbWUtc3R5bGVzaGVldCcsXG4gICAgICAgIG5vbmNlOiB0aGlzLm9wdGlvbnMuY3NwTm9uY2UsXG4gICAgICB9XSxcbiAgICB9KVxuICB9XG5cbiAgcHJpdmF0ZSBpbml0U1NSIChzc3JDb250ZXh0PzogYW55KSB7XG4gICAgLy8gU1NSXG4gICAgY29uc3Qgbm9uY2UgPSB0aGlzLm9wdGlvbnMuY3NwTm9uY2UgPyBgIG5vbmNlPVwiJHt0aGlzLm9wdGlvbnMuY3NwTm9uY2V9XCJgIDogJydcbiAgICBzc3JDb250ZXh0LmhlYWQgPSBzc3JDb250ZXh0LmhlYWQgfHwgJydcbiAgICBzc3JDb250ZXh0LmhlYWQgKz0gYDxzdHlsZSB0eXBlPVwidGV4dC9jc3NcIiBpZD1cInZ1ZXRpZnktdGhlbWUtc3R5bGVzaGVldFwiJHtub25jZX0+JHt0aGlzLmdlbmVyYXRlZFN0eWxlc308L3N0eWxlPmBcbiAgfVxuXG4gIHByaXZhdGUgaW5pdFRoZW1lIChyb290OiBWdWUpIHtcbiAgICAvLyBPbmx5IHdhdGNoIGZvciByZWFjdGl2aXR5IG9uIGNsaWVudCBzaWRlXG4gICAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHJldHVyblxuXG4gICAgLy8gSWYgd2UgZ2V0IGhlcmUgc29tZWhvdywgZW5zdXJlXG4gICAgLy8gZXhpc3RpbmcgaW5zdGFuY2UgaXMgcmVtb3ZlZFxuICAgIGlmICh0aGlzLnVud2F0Y2gpIHtcbiAgICAgIHRoaXMudW53YXRjaCgpXG4gICAgICB0aGlzLnVud2F0Y2ggPSBudWxsXG4gICAgfVxuXG4gICAgLy8gVE9ETzogVXBkYXRlIHRvIHVzZSBSRkMgaWYgbWVyZ2VkXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3Z1ZWpzL3JmY3MvYmxvYi9hZHZhbmNlZC1yZWFjdGl2aXR5LWFwaS9hY3RpdmUtcmZjcy8wMDAwLWFkdmFuY2VkLXJlYWN0aXZpdHktYXBpLm1kXG4gICAgcm9vdC4kb25jZSgnaG9vazpjcmVhdGVkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb2JzID0gVnVlLm9ic2VydmFibGUoeyB0aGVtZXM6IHRoaXMudGhlbWVzIH0pXG4gICAgICB0aGlzLnVud2F0Y2ggPSByb290LiR3YXRjaCgoKSA9PiBvYnMudGhlbWVzLCAoKSA9PiB0aGlzLmFwcGx5VGhlbWUoKSwgeyBkZWVwOiB0cnVlIH0pXG4gICAgfSlcbiAgICB0aGlzLmFwcGx5VGhlbWUoKVxuICB9XG5cbiAgZ2V0IGN1cnJlbnRUaGVtZSAoKSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5kYXJrID8gJ2RhcmsnIDogJ2xpZ2h0J1xuXG4gICAgcmV0dXJuIHRoaXMudGhlbWVzW3RhcmdldF1cbiAgfVxuXG4gIGdldCBnZW5lcmF0ZWRTdHlsZXMgKCk6IHN0cmluZyB7XG4gICAgY29uc3QgdGhlbWUgPSB0aGlzLnBhcnNlZFRoZW1lXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zIHx8IHt9XG4gICAgbGV0IGNzc1xuXG4gICAgaWYgKG9wdGlvbnMudGhlbWVDYWNoZSAhPSBudWxsKSB7XG4gICAgICBjc3MgPSBvcHRpb25zLnRoZW1lQ2FjaGUuZ2V0KHRoZW1lKVxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICBpZiAoY3NzICE9IG51bGwpIHJldHVybiBjc3NcbiAgICB9XG5cbiAgICBjc3MgPSBUaGVtZVV0aWxzLmdlblN0eWxlcyh0aGVtZSwgb3B0aW9ucy5jdXN0b21Qcm9wZXJ0aWVzKVxuXG4gICAgaWYgKG9wdGlvbnMubWluaWZ5VGhlbWUgIT0gbnVsbCkge1xuICAgICAgY3NzID0gb3B0aW9ucy5taW5pZnlUaGVtZShjc3MpXG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMudGhlbWVDYWNoZSAhPSBudWxsKSB7XG4gICAgICBvcHRpb25zLnRoZW1lQ2FjaGUuc2V0KHRoZW1lLCBjc3MpXG4gICAgfVxuXG4gICAgcmV0dXJuIGNzc1xuICB9XG5cbiAgZ2V0IHBhcnNlZFRoZW1lICgpOiBWdWV0aWZ5UGFyc2VkVGhlbWUge1xuICAgIHJldHVybiBUaGVtZVV0aWxzLnBhcnNlKFxuICAgICAgdGhpcy5jdXJyZW50VGhlbWUgfHwge30sXG4gICAgICB1bmRlZmluZWQsXG4gICAgICBnZXROZXN0ZWRWYWx1ZSh0aGlzLm9wdGlvbnMsIFsndmFyaWF0aW9ucyddLCB0cnVlKVxuICAgIClcbiAgfVxuXG4gIC8vIElzIHVzaW5nIHYyLjMgb2YgdnVlLW1ldGFcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL251eHQvdnVlLW1ldGEvcmVsZWFzZXMvdGFnL3YyLjMuMFxuICBwcml2YXRlIGdldCBpc1Z1ZU1ldGEyMyAoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHR5cGVvZiB0aGlzLnZ1ZU1ldGEuYWRkQXBwID09PSAnZnVuY3Rpb24nXG4gIH1cbn1cbiJdfQ==