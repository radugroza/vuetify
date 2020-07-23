// Styles
import './VMenu.sass';
// Components
import { VThemeProvider } from '../VThemeProvider';
// Mixins
import Activatable from '../../mixins/activatable';
import Delayable from '../../mixins/delayable';
import Dependent from '../../mixins/dependent';
import Detachable from '../../mixins/detachable';
import Menuable from '../../mixins/menuable';
import Returnable from '../../mixins/returnable';
import Roundable from '../../mixins/roundable';
import Toggleable from '../../mixins/toggleable';
import Themeable from '../../mixins/themeable';
// Directives
import ClickOutside from '../../directives/click-outside';
import Resize from '../../directives/resize';
// Utilities
import mixins from '../../util/mixins';
import { removed } from '../../util/console';
import { convertToUnit, keyCodes, } from '../../util/helpers';
const baseMixins = mixins(Dependent, Delayable, Detachable, Menuable, Returnable, Roundable, Toggleable, Themeable);
/* @vue/component */
export default baseMixins.extend({
    name: 'v-menu',
    provide() {
        return {
            isInMenu: true,
            // Pass theme through to default slot
            theme: this.theme,
        };
    },
    directives: {
        ClickOutside,
        Resize,
    },
    props: {
        auto: Boolean,
        closeOnClick: {
            type: Boolean,
            default: true,
        },
        closeOnContentClick: {
            type: Boolean,
            default: true,
        },
        disabled: Boolean,
        disableKeys: Boolean,
        maxHeight: {
            type: [Number, String],
            default: 'auto',
        },
        offsetX: Boolean,
        offsetY: Boolean,
        openOnClick: {
            type: Boolean,
            default: true,
        },
        openOnHover: Boolean,
        origin: {
            type: String,
            default: 'top left',
        },
        transition: {
            type: [Boolean, String],
            default: 'v-menu-transition',
        },
    },
    data() {
        return {
            calculatedTopAuto: 0,
            defaultOffset: 8,
            hasJustFocused: false,
            listIndex: -1,
            resizeTimeout: 0,
            selectedIndex: null,
            tiles: [],
        };
    },
    computed: {
        activeTile() {
            return this.tiles[this.listIndex];
        },
        calculatedLeft() {
            const menuWidth = Math.max(this.dimensions.content.width, parseFloat(this.calculatedMinWidth));
            if (!this.auto)
                return this.calcLeft(menuWidth) || '0';
            return convertToUnit(this.calcXOverflow(this.calcLeftAuto(), menuWidth)) || '0';
        },
        calculatedMaxHeight() {
            const height = this.auto
                ? '200px'
                : convertToUnit(this.maxHeight);
            return height || '0';
        },
        calculatedMaxWidth() {
            return convertToUnit(this.maxWidth) || '0';
        },
        calculatedMinWidth() {
            if (this.minWidth) {
                return convertToUnit(this.minWidth) || '0';
            }
            const minWidth = Math.min(this.dimensions.activator.width +
                Number(this.nudgeWidth) +
                (this.auto ? 16 : 0), Math.max(this.pageWidth - 24, 0));
            const calculatedMaxWidth = isNaN(parseInt(this.calculatedMaxWidth))
                ? minWidth
                : parseInt(this.calculatedMaxWidth);
            return convertToUnit(Math.min(calculatedMaxWidth, minWidth)) || '0';
        },
        calculatedTop() {
            const top = !this.auto
                ? this.calcTop()
                : convertToUnit(this.calcYOverflow(this.calculatedTopAuto));
            return top || '0';
        },
        hasClickableTiles() {
            return Boolean(this.tiles.find(tile => tile.tabIndex > -1));
        },
        styles() {
            return {
                maxHeight: this.calculatedMaxHeight,
                minWidth: this.calculatedMinWidth,
                maxWidth: this.calculatedMaxWidth,
                top: this.calculatedTop,
                left: this.calculatedLeft,
                transformOrigin: this.origin,
                zIndex: this.zIndex || this.activeZIndex,
            };
        },
    },
    watch: {
        isActive(val) {
            if (!val)
                this.listIndex = -1;
        },
        isContentActive(val) {
            this.hasJustFocused = val;
        },
        listIndex(next, prev) {
            if (next in this.tiles) {
                const tile = this.tiles[next];
                tile.classList.add('v-list-item--highlighted');
                this.$refs.content.scrollTop = tile.offsetTop - tile.clientHeight;
            }
            prev in this.tiles &&
                this.tiles[prev].classList.remove('v-list-item--highlighted');
        },
    },
    created() {
        /* istanbul ignore next */
        if (this.$attrs.hasOwnProperty('full-width')) {
            removed('full-width', this);
        }
    },
    mounted() {
        this.isActive && this.callActivate();
    },
    methods: {
        activate() {
            // Update coordinates and dimensions of menu
            // and its activator
            this.updateDimensions();
            // Start the transition
            requestAnimationFrame(() => {
                // Once transitioning, calculate scroll and top position
                this.startTransition().then(() => {
                    if (this.$refs.content) {
                        this.calculatedTopAuto = this.calcTopAuto();
                        this.auto && (this.$refs.content.scrollTop = this.calcScrollPosition());
                    }
                });
            });
        },
        calcScrollPosition() {
            const $el = this.$refs.content;
            const activeTile = $el.querySelector('.v-list-item--active');
            const maxScrollTop = $el.scrollHeight - $el.offsetHeight;
            return activeTile
                ? Math.min(maxScrollTop, Math.max(0, activeTile.offsetTop - $el.offsetHeight / 2 + activeTile.offsetHeight / 2))
                : $el.scrollTop;
        },
        calcLeftAuto() {
            return parseInt(this.dimensions.activator.left - this.defaultOffset * 2);
        },
        calcTopAuto() {
            const $el = this.$refs.content;
            const activeTile = $el.querySelector('.v-list-item--active');
            if (!activeTile) {
                this.selectedIndex = null;
            }
            if (this.offsetY || !activeTile) {
                return this.computedTop;
            }
            this.selectedIndex = Array.from(this.tiles).indexOf(activeTile);
            const tileDistanceFromMenuTop = activeTile.offsetTop - this.calcScrollPosition();
            const firstTileOffsetTop = $el.querySelector('.v-list-item').offsetTop;
            return this.computedTop - tileDistanceFromMenuTop - firstTileOffsetTop - 1;
        },
        changeListIndex(e) {
            // For infinite scroll and autocomplete, re-evaluate children
            this.getTiles();
            if (!this.isActive || !this.hasClickableTiles) {
                return;
            }
            else if (e.keyCode === keyCodes.tab) {
                this.isActive = false;
                return;
            }
            else if (e.keyCode === keyCodes.down) {
                this.nextTile();
            }
            else if (e.keyCode === keyCodes.up) {
                this.prevTile();
            }
            else if (e.keyCode === keyCodes.enter && this.listIndex !== -1) {
                this.tiles[this.listIndex].click();
            }
            else {
                return;
            }
            // One of the conditions was met, prevent default action (#2988)
            e.preventDefault();
        },
        closeConditional(e) {
            const target = e.target;
            return this.isActive &&
                !this._isDestroyed &&
                this.closeOnClick &&
                !this.$refs.content.contains(target);
        },
        genActivatorAttributes() {
            const attributes = Activatable.options.methods.genActivatorAttributes.call(this);
            if (this.activeTile && this.activeTile.id) {
                return {
                    ...attributes,
                    'aria-activedescendant': this.activeTile.id,
                };
            }
            return attributes;
        },
        genActivatorListeners() {
            const listeners = Menuable.options.methods.genActivatorListeners.call(this);
            if (!this.disableKeys) {
                listeners.keydown = this.onKeyDown;
            }
            return listeners;
        },
        genTransition() {
            const content = this.genContent();
            if (!this.transition)
                return content;
            return this.$createElement('transition', {
                props: {
                    name: this.transition,
                },
            }, [content]);
        },
        genDirectives() {
            const directives = [{
                    name: 'show',
                    value: this.isContentActive,
                }];
            // Do not add click outside for hover menu
            if (!this.openOnHover && this.closeOnClick) {
                directives.push({
                    name: 'click-outside',
                    value: {
                        handler: () => { this.isActive = false; },
                        closeConditional: this.closeConditional,
                        include: () => [this.$el, ...this.getOpenDependentElements()],
                    },
                });
            }
            return directives;
        },
        genContent() {
            const options = {
                attrs: {
                    ...this.getScopeIdAttrs(),
                    role: 'role' in this.$attrs ? this.$attrs.role : 'menu',
                },
                staticClass: 'v-menu__content',
                class: {
                    ...this.rootThemeClasses,
                    ...this.roundedClasses,
                    'v-menu__content--auto': this.auto,
                    'v-menu__content--fixed': this.activatorFixed,
                    menuable__content__active: this.isActive,
                    [this.contentClass.trim()]: true,
                },
                style: this.styles,
                directives: this.genDirectives(),
                ref: 'content',
                on: {
                    click: (e) => {
                        const target = e.target;
                        if (target.getAttribute('disabled'))
                            return;
                        if (this.closeOnContentClick)
                            this.isActive = false;
                    },
                    keydown: this.onKeyDown,
                },
            };
            if (this.$listeners.scroll) {
                options.on = options.on || {};
                options.on.scroll = this.$listeners.scroll;
            }
            if (!this.disabled && this.openOnHover) {
                options.on = options.on || {};
                options.on.mouseenter = this.mouseEnterHandler;
            }
            if (this.openOnHover) {
                options.on = options.on || {};
                options.on.mouseleave = this.mouseLeaveHandler;
            }
            return this.$createElement('div', options, this.getContentSlot());
        },
        getTiles() {
            if (!this.$refs.content)
                return;
            this.tiles = Array.from(this.$refs.content.querySelectorAll('.v-list-item'));
        },
        mouseEnterHandler() {
            this.runDelay('open', () => {
                if (this.hasJustFocused)
                    return;
                this.hasJustFocused = true;
                this.isActive = true;
            });
        },
        mouseLeaveHandler(e) {
            // Prevent accidental re-activation
            this.runDelay('close', () => {
                if (this.$refs.content.contains(e.relatedTarget))
                    return;
                requestAnimationFrame(() => {
                    this.isActive = false;
                    this.callDeactivate();
                });
            });
        },
        nextTile() {
            const tile = this.tiles[this.listIndex + 1];
            if (!tile) {
                if (!this.tiles.length)
                    return;
                this.listIndex = -1;
                this.nextTile();
                return;
            }
            this.listIndex++;
            if (tile.tabIndex === -1)
                this.nextTile();
        },
        prevTile() {
            const tile = this.tiles[this.listIndex - 1];
            if (!tile) {
                if (!this.tiles.length)
                    return;
                this.listIndex = this.tiles.length;
                this.prevTile();
                return;
            }
            this.listIndex--;
            if (tile.tabIndex === -1)
                this.prevTile();
        },
        onKeyDown(e) {
            if (e.keyCode === keyCodes.esc) {
                // Wait for dependent elements to close first
                setTimeout(() => { this.isActive = false; });
                const activator = this.getActivator();
                this.$nextTick(() => activator && activator.focus());
            }
            else if (!this.isActive &&
                [keyCodes.up, keyCodes.down].includes(e.keyCode)) {
                this.isActive = true;
            }
            // Allow for isActive watcher to generate tile list
            this.$nextTick(() => this.changeListIndex(e));
        },
        onResize() {
            if (!this.isActive)
                return;
            // Account for screen resize
            // and orientation change
            // eslint-disable-next-line no-unused-expressions
            this.$refs.content.offsetWidth;
            this.updateDimensions();
            // When resizing to a smaller width
            // content width is evaluated before
            // the new activator width has been
            // set, causing it to not size properly
            // hacky but will revisit in the future
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = window.setTimeout(this.updateDimensions, 100);
        },
    },
    render(h) {
        const data = {
            staticClass: 'v-menu',
            class: {
                'v-menu--attached': this.attach === '' ||
                    this.attach === true ||
                    this.attach === 'attach',
            },
            directives: [{
                    arg: '500',
                    name: 'resize',
                    value: this.onResize,
                }],
        };
        return h('div', data, [
            !this.activator && this.genActivator(),
            this.showLazyContent(() => [
                this.$createElement(VThemeProvider, {
                    props: {
                        root: true,
                        light: this.light,
                        dark: this.dark,
                    },
                }, [this.genTransition()]),
            ]),
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVk1lbnUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WTWVudS9WTWVudS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxjQUFjLENBQUE7QUFFckIsYUFBYTtBQUNiLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUVsRCxTQUFTO0FBQ1QsT0FBTyxXQUFXLE1BQU0sMEJBQTBCLENBQUE7QUFDbEQsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFDaEQsT0FBTyxRQUFRLE1BQU0sdUJBQXVCLENBQUE7QUFDNUMsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFDaEQsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFDaEQsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFFOUMsYUFBYTtBQUNiLE9BQU8sWUFBWSxNQUFNLGdDQUFnQyxDQUFBO0FBQ3pELE9BQU8sTUFBTSxNQUFNLHlCQUF5QixDQUFBO0FBRTVDLFlBQVk7QUFDWixPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQUN0QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFDNUMsT0FBTyxFQUNMLGFBQWEsRUFDYixRQUFRLEdBQ1QsTUFBTSxvQkFBb0IsQ0FBQTtBQUszQixNQUFNLFVBQVUsR0FBRyxNQUFNLENBQ3ZCLFNBQVMsRUFDVCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFFBQVEsRUFDUixVQUFVLEVBQ1YsU0FBUyxFQUNULFVBQVUsRUFDVixTQUFTLENBQ1YsQ0FBQTtBQUVELG9CQUFvQjtBQUNwQixlQUFlLFVBQVUsQ0FBQyxNQUFNLENBQUM7SUFDL0IsSUFBSSxF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LENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXG5pbXBvcnQgJy4vVk1lbnUuc2FzcydcblxuLy8gQ29tcG9uZW50c1xuaW1wb3J0IHsgVlRoZW1lUHJvdmlkZXIgfSBmcm9tICcuLi9WVGhlbWVQcm92aWRlcidcblxuLy8gTWl4aW5zXG5pbXBvcnQgQWN0aXZhdGFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2FjdGl2YXRhYmxlJ1xuaW1wb3J0IERlbGF5YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvZGVsYXlhYmxlJ1xuaW1wb3J0IERlcGVuZGVudCBmcm9tICcuLi8uLi9taXhpbnMvZGVwZW5kZW50J1xuaW1wb3J0IERldGFjaGFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2RldGFjaGFibGUnXG5pbXBvcnQgTWVudWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL21lbnVhYmxlJ1xuaW1wb3J0IFJldHVybmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3JldHVybmFibGUnXG5pbXBvcnQgUm91bmRhYmxlIGZyb20gJy4uLy4uL21peGlucy9yb3VuZGFibGUnXG5pbXBvcnQgVG9nZ2xlYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdG9nZ2xlYWJsZSdcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcblxuLy8gRGlyZWN0aXZlc1xuaW1wb3J0IENsaWNrT3V0c2lkZSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL2NsaWNrLW91dHNpZGUnXG5pbXBvcnQgUmVzaXplIGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvcmVzaXplJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5pbXBvcnQgeyByZW1vdmVkIH0gZnJvbSAnLi4vLi4vdXRpbC9jb25zb2xlJ1xuaW1wb3J0IHtcbiAgY29udmVydFRvVW5pdCxcbiAga2V5Q29kZXMsXG59IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcblxuLy8gVHlwZXNcbmltcG9ydCB7IFZOb2RlLCBWTm9kZURpcmVjdGl2ZSwgVk5vZGVEYXRhIH0gZnJvbSAndnVlJ1xuXG5jb25zdCBiYXNlTWl4aW5zID0gbWl4aW5zKFxuICBEZXBlbmRlbnQsXG4gIERlbGF5YWJsZSxcbiAgRGV0YWNoYWJsZSxcbiAgTWVudWFibGUsXG4gIFJldHVybmFibGUsXG4gIFJvdW5kYWJsZSxcbiAgVG9nZ2xlYWJsZSxcbiAgVGhlbWVhYmxlXG4pXG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBiYXNlTWl4aW5zLmV4dGVuZCh7XG4gIG5hbWU6ICd2LW1lbnUnLFxuXG4gIHByb3ZpZGUgKCk6IG9iamVjdCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlzSW5NZW51OiB0cnVlLFxuICAgICAgLy8gUGFzcyB0aGVtZSB0aHJvdWdoIHRvIGRlZmF1bHQgc2xvdFxuICAgICAgdGhlbWU6IHRoaXMudGhlbWUsXG4gICAgfVxuICB9LFxuXG4gIGRpcmVjdGl2ZXM6IHtcbiAgICBDbGlja091dHNpZGUsXG4gICAgUmVzaXplLFxuICB9LFxuXG4gIHByb3BzOiB7XG4gICAgYXV0bzogQm9vbGVhbixcbiAgICBjbG9zZU9uQ2xpY2s6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiB0cnVlLFxuICAgIH0sXG4gICAgY2xvc2VPbkNvbnRlbnRDbGljazoge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgfSxcbiAgICBkaXNhYmxlZDogQm9vbGVhbixcbiAgICBkaXNhYmxlS2V5czogQm9vbGVhbixcbiAgICBtYXhIZWlnaHQ6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiAnYXV0bycsXG4gICAgfSxcbiAgICBvZmZzZXRYOiBCb29sZWFuLFxuICAgIG9mZnNldFk6IEJvb2xlYW4sXG4gICAgb3Blbk9uQ2xpY2s6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiB0cnVlLFxuICAgIH0sXG4gICAgb3Blbk9uSG92ZXI6IEJvb2xlYW4sXG4gICAgb3JpZ2luOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAndG9wIGxlZnQnLFxuICAgIH0sXG4gICAgdHJhbnNpdGlvbjoge1xuICAgICAgdHlwZTogW0Jvb2xlYW4sIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiAndi1tZW51LXRyYW5zaXRpb24nLFxuICAgIH0sXG4gIH0sXG5cbiAgZGF0YSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNhbGN1bGF0ZWRUb3BBdXRvOiAwLFxuICAgICAgZGVmYXVsdE9mZnNldDogOCxcbiAgICAgIGhhc0p1c3RGb2N1c2VkOiBmYWxzZSxcbiAgICAgIGxpc3RJbmRleDogLTEsXG4gICAgICByZXNpemVUaW1lb3V0OiAwLFxuICAgICAgc2VsZWN0ZWRJbmRleDogbnVsbCBhcyBudWxsIHwgbnVtYmVyLFxuICAgICAgdGlsZXM6IFtdIGFzIEhUTUxFbGVtZW50W10sXG4gICAgfVxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgYWN0aXZlVGlsZSAoKTogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQge1xuICAgICAgcmV0dXJuIHRoaXMudGlsZXNbdGhpcy5saXN0SW5kZXhdXG4gICAgfSxcbiAgICBjYWxjdWxhdGVkTGVmdCAoKTogc3RyaW5nIHtcbiAgICAgIGNvbnN0IG1lbnVXaWR0aCA9IE1hdGgubWF4KHRoaXMuZGltZW5zaW9ucy5jb250ZW50LndpZHRoLCBwYXJzZUZsb2F0KHRoaXMuY2FsY3VsYXRlZE1pbldpZHRoKSlcblxuICAgICAgaWYgKCF0aGlzLmF1dG8pIHJldHVybiB0aGlzLmNhbGNMZWZ0KG1lbnVXaWR0aCkgfHwgJzAnXG5cbiAgICAgIHJldHVybiBjb252ZXJ0VG9Vbml0KHRoaXMuY2FsY1hPdmVyZmxvdyh0aGlzLmNhbGNMZWZ0QXV0bygpLCBtZW51V2lkdGgpKSB8fCAnMCdcbiAgICB9LFxuICAgIGNhbGN1bGF0ZWRNYXhIZWlnaHQgKCk6IHN0cmluZyB7XG4gICAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmF1dG9cbiAgICAgICAgPyAnMjAwcHgnXG4gICAgICAgIDogY29udmVydFRvVW5pdCh0aGlzLm1heEhlaWdodClcblxuICAgICAgcmV0dXJuIGhlaWdodCB8fCAnMCdcbiAgICB9LFxuICAgIGNhbGN1bGF0ZWRNYXhXaWR0aCAoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiBjb252ZXJ0VG9Vbml0KHRoaXMubWF4V2lkdGgpIHx8ICcwJ1xuICAgIH0sXG4gICAgY2FsY3VsYXRlZE1pbldpZHRoICgpOiBzdHJpbmcge1xuICAgICAgaWYgKHRoaXMubWluV2lkdGgpIHtcbiAgICAgICAgcmV0dXJuIGNvbnZlcnRUb1VuaXQodGhpcy5taW5XaWR0aCkgfHwgJzAnXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1pbldpZHRoID0gTWF0aC5taW4oXG4gICAgICAgIHRoaXMuZGltZW5zaW9ucy5hY3RpdmF0b3Iud2lkdGggK1xuICAgICAgICBOdW1iZXIodGhpcy5udWRnZVdpZHRoKSArXG4gICAgICAgICh0aGlzLmF1dG8gPyAxNiA6IDApLFxuICAgICAgICBNYXRoLm1heCh0aGlzLnBhZ2VXaWR0aCAtIDI0LCAwKVxuICAgICAgKVxuXG4gICAgICBjb25zdCBjYWxjdWxhdGVkTWF4V2lkdGggPSBpc05hTihwYXJzZUludCh0aGlzLmNhbGN1bGF0ZWRNYXhXaWR0aCkpXG4gICAgICAgID8gbWluV2lkdGhcbiAgICAgICAgOiBwYXJzZUludCh0aGlzLmNhbGN1bGF0ZWRNYXhXaWR0aClcblxuICAgICAgcmV0dXJuIGNvbnZlcnRUb1VuaXQoTWF0aC5taW4oXG4gICAgICAgIGNhbGN1bGF0ZWRNYXhXaWR0aCxcbiAgICAgICAgbWluV2lkdGhcbiAgICAgICkpIHx8ICcwJ1xuICAgIH0sXG4gICAgY2FsY3VsYXRlZFRvcCAoKTogc3RyaW5nIHtcbiAgICAgIGNvbnN0IHRvcCA9ICF0aGlzLmF1dG9cbiAgICAgICAgPyB0aGlzLmNhbGNUb3AoKVxuICAgICAgICA6IGNvbnZlcnRUb1VuaXQodGhpcy5jYWxjWU92ZXJmbG93KHRoaXMuY2FsY3VsYXRlZFRvcEF1dG8pKVxuXG4gICAgICByZXR1cm4gdG9wIHx8ICcwJ1xuICAgIH0sXG4gICAgaGFzQ2xpY2thYmxlVGlsZXMgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIEJvb2xlYW4odGhpcy50aWxlcy5maW5kKHRpbGUgPT4gdGlsZS50YWJJbmRleCA+IC0xKSlcbiAgICB9LFxuICAgIHN0eWxlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1heEhlaWdodDogdGhpcy5jYWxjdWxhdGVkTWF4SGVpZ2h0LFxuICAgICAgICBtaW5XaWR0aDogdGhpcy5jYWxjdWxhdGVkTWluV2lkdGgsXG4gICAgICAgIG1heFdpZHRoOiB0aGlzLmNhbGN1bGF0ZWRNYXhXaWR0aCxcbiAgICAgICAgdG9wOiB0aGlzLmNhbGN1bGF0ZWRUb3AsXG4gICAgICAgIGxlZnQ6IHRoaXMuY2FsY3VsYXRlZExlZnQsXG4gICAgICAgIHRyYW5zZm9ybU9yaWdpbjogdGhpcy5vcmlnaW4sXG4gICAgICAgIHpJbmRleDogdGhpcy56SW5kZXggfHwgdGhpcy5hY3RpdmVaSW5kZXgsXG4gICAgICB9XG4gICAgfSxcbiAgfSxcblxuICB3YXRjaDoge1xuICAgIGlzQWN0aXZlICh2YWwpIHtcbiAgICAgIGlmICghdmFsKSB0aGlzLmxpc3RJbmRleCA9IC0xXG4gICAgfSxcbiAgICBpc0NvbnRlbnRBY3RpdmUgKHZhbCkge1xuICAgICAgdGhpcy5oYXNKdXN0Rm9jdXNlZCA9IHZhbFxuICAgIH0sXG4gICAgbGlzdEluZGV4IChuZXh0LCBwcmV2KSB7XG4gICAgICBpZiAobmV4dCBpbiB0aGlzLnRpbGVzKSB7XG4gICAgICAgIGNvbnN0IHRpbGUgPSB0aGlzLnRpbGVzW25leHRdXG4gICAgICAgIHRpbGUuY2xhc3NMaXN0LmFkZCgndi1saXN0LWl0ZW0tLWhpZ2hsaWdodGVkJylcbiAgICAgICAgdGhpcy4kcmVmcy5jb250ZW50LnNjcm9sbFRvcCA9IHRpbGUub2Zmc2V0VG9wIC0gdGlsZS5jbGllbnRIZWlnaHRcbiAgICAgIH1cblxuICAgICAgcHJldiBpbiB0aGlzLnRpbGVzICYmXG4gICAgICAgIHRoaXMudGlsZXNbcHJldl0uY2xhc3NMaXN0LnJlbW92ZSgndi1saXN0LWl0ZW0tLWhpZ2hsaWdodGVkJylcbiAgICB9LFxuICB9LFxuXG4gIGNyZWF0ZWQgKCkge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKHRoaXMuJGF0dHJzLmhhc093blByb3BlcnR5KCdmdWxsLXdpZHRoJykpIHtcbiAgICAgIHJlbW92ZWQoJ2Z1bGwtd2lkdGgnLCB0aGlzKVxuICAgIH1cbiAgfSxcblxuICBtb3VudGVkICgpIHtcbiAgICB0aGlzLmlzQWN0aXZlICYmIHRoaXMuY2FsbEFjdGl2YXRlKClcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgYWN0aXZhdGUgKCkge1xuICAgICAgLy8gVXBkYXRlIGNvb3JkaW5hdGVzIGFuZCBkaW1lbnNpb25zIG9mIG1lbnVcbiAgICAgIC8vIGFuZCBpdHMgYWN0aXZhdG9yXG4gICAgICB0aGlzLnVwZGF0ZURpbWVuc2lvbnMoKVxuICAgICAgLy8gU3RhcnQgdGhlIHRyYW5zaXRpb25cbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIC8vIE9uY2UgdHJhbnNpdGlvbmluZywgY2FsY3VsYXRlIHNjcm9sbCBhbmQgdG9wIHBvc2l0aW9uXG4gICAgICAgIHRoaXMuc3RhcnRUcmFuc2l0aW9uKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuJHJlZnMuY29udGVudCkge1xuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVkVG9wQXV0byA9IHRoaXMuY2FsY1RvcEF1dG8oKVxuICAgICAgICAgICAgdGhpcy5hdXRvICYmICh0aGlzLiRyZWZzLmNvbnRlbnQuc2Nyb2xsVG9wID0gdGhpcy5jYWxjU2Nyb2xsUG9zaXRpb24oKSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0sXG4gICAgY2FsY1Njcm9sbFBvc2l0aW9uICgpIHtcbiAgICAgIGNvbnN0ICRlbCA9IHRoaXMuJHJlZnMuY29udGVudFxuICAgICAgY29uc3QgYWN0aXZlVGlsZSA9ICRlbC5xdWVyeVNlbGVjdG9yKCcudi1saXN0LWl0ZW0tLWFjdGl2ZScpIGFzIEhUTUxFbGVtZW50XG4gICAgICBjb25zdCBtYXhTY3JvbGxUb3AgPSAkZWwuc2Nyb2xsSGVpZ2h0IC0gJGVsLm9mZnNldEhlaWdodFxuXG4gICAgICByZXR1cm4gYWN0aXZlVGlsZVxuICAgICAgICA/IE1hdGgubWluKG1heFNjcm9sbFRvcCwgTWF0aC5tYXgoMCwgYWN0aXZlVGlsZS5vZmZzZXRUb3AgLSAkZWwub2Zmc2V0SGVpZ2h0IC8gMiArIGFjdGl2ZVRpbGUub2Zmc2V0SGVpZ2h0IC8gMikpXG4gICAgICAgIDogJGVsLnNjcm9sbFRvcFxuICAgIH0sXG4gICAgY2FsY0xlZnRBdXRvICgpIHtcbiAgICAgIHJldHVybiBwYXJzZUludCh0aGlzLmRpbWVuc2lvbnMuYWN0aXZhdG9yLmxlZnQgLSB0aGlzLmRlZmF1bHRPZmZzZXQgKiAyKVxuICAgIH0sXG4gICAgY2FsY1RvcEF1dG8gKCkge1xuICAgICAgY29uc3QgJGVsID0gdGhpcy4kcmVmcy5jb250ZW50XG4gICAgICBjb25zdCBhY3RpdmVUaWxlID0gJGVsLnF1ZXJ5U2VsZWN0b3IoJy52LWxpc3QtaXRlbS0tYWN0aXZlJykgYXMgSFRNTEVsZW1lbnQgfCBudWxsXG5cbiAgICAgIGlmICghYWN0aXZlVGlsZSkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSBudWxsXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9mZnNldFkgfHwgIWFjdGl2ZVRpbGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29tcHV0ZWRUb3BcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gQXJyYXkuZnJvbSh0aGlzLnRpbGVzKS5pbmRleE9mKGFjdGl2ZVRpbGUpXG5cbiAgICAgIGNvbnN0IHRpbGVEaXN0YW5jZUZyb21NZW51VG9wID0gYWN0aXZlVGlsZS5vZmZzZXRUb3AgLSB0aGlzLmNhbGNTY3JvbGxQb3NpdGlvbigpXG4gICAgICBjb25zdCBmaXJzdFRpbGVPZmZzZXRUb3AgPSAoJGVsLnF1ZXJ5U2VsZWN0b3IoJy52LWxpc3QtaXRlbScpIGFzIEhUTUxFbGVtZW50KS5vZmZzZXRUb3BcblxuICAgICAgcmV0dXJuIHRoaXMuY29tcHV0ZWRUb3AgLSB0aWxlRGlzdGFuY2VGcm9tTWVudVRvcCAtIGZpcnN0VGlsZU9mZnNldFRvcCAtIDFcbiAgICB9LFxuICAgIGNoYW5nZUxpc3RJbmRleCAoZTogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgLy8gRm9yIGluZmluaXRlIHNjcm9sbCBhbmQgYXV0b2NvbXBsZXRlLCByZS1ldmFsdWF0ZSBjaGlsZHJlblxuICAgICAgdGhpcy5nZXRUaWxlcygpXG5cbiAgICAgIGlmICghdGhpcy5pc0FjdGl2ZSB8fCAhdGhpcy5oYXNDbGlja2FibGVUaWxlcykge1xuICAgICAgICByZXR1cm5cbiAgICAgIH0gZWxzZSBpZiAoZS5rZXlDb2RlID09PSBrZXlDb2Rlcy50YWIpIHtcbiAgICAgICAgdGhpcy5pc0FjdGl2ZSA9IGZhbHNlXG4gICAgICAgIHJldHVyblxuICAgICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT09IGtleUNvZGVzLmRvd24pIHtcbiAgICAgICAgdGhpcy5uZXh0VGlsZSgpXG4gICAgICB9IGVsc2UgaWYgKGUua2V5Q29kZSA9PT0ga2V5Q29kZXMudXApIHtcbiAgICAgICAgdGhpcy5wcmV2VGlsZSgpXG4gICAgICB9IGVsc2UgaWYgKGUua2V5Q29kZSA9PT0ga2V5Q29kZXMuZW50ZXIgJiYgdGhpcy5saXN0SW5kZXggIT09IC0xKSB7XG4gICAgICAgIHRoaXMudGlsZXNbdGhpcy5saXN0SW5kZXhdLmNsaWNrKClcbiAgICAgIH0gZWxzZSB7IHJldHVybiB9XG4gICAgICAvLyBPbmUgb2YgdGhlIGNvbmRpdGlvbnMgd2FzIG1ldCwgcHJldmVudCBkZWZhdWx0IGFjdGlvbiAoIzI5ODgpXG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICB9LFxuICAgIGNsb3NlQ29uZGl0aW9uYWwgKGU6IEV2ZW50KSB7XG4gICAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRWxlbWVudFxuXG4gICAgICByZXR1cm4gdGhpcy5pc0FjdGl2ZSAmJlxuICAgICAgICAhdGhpcy5faXNEZXN0cm95ZWQgJiZcbiAgICAgICAgdGhpcy5jbG9zZU9uQ2xpY2sgJiZcbiAgICAgICAgIXRoaXMuJHJlZnMuY29udGVudC5jb250YWlucyh0YXJnZXQpXG4gICAgfSxcbiAgICBnZW5BY3RpdmF0b3JBdHRyaWJ1dGVzICgpIHtcbiAgICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBBY3RpdmF0YWJsZS5vcHRpb25zLm1ldGhvZHMuZ2VuQWN0aXZhdG9yQXR0cmlidXRlcy5jYWxsKHRoaXMpXG5cbiAgICAgIGlmICh0aGlzLmFjdGl2ZVRpbGUgJiYgdGhpcy5hY3RpdmVUaWxlLmlkKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uYXR0cmlidXRlcyxcbiAgICAgICAgICAnYXJpYS1hY3RpdmVkZXNjZW5kYW50JzogdGhpcy5hY3RpdmVUaWxlLmlkLFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhdHRyaWJ1dGVzXG4gICAgfSxcbiAgICBnZW5BY3RpdmF0b3JMaXN0ZW5lcnMgKCkge1xuICAgICAgY29uc3QgbGlzdGVuZXJzID0gTWVudWFibGUub3B0aW9ucy5tZXRob2RzLmdlbkFjdGl2YXRvckxpc3RlbmVycy5jYWxsKHRoaXMpXG5cbiAgICAgIGlmICghdGhpcy5kaXNhYmxlS2V5cykge1xuICAgICAgICBsaXN0ZW5lcnMua2V5ZG93biA9IHRoaXMub25LZXlEb3duXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBsaXN0ZW5lcnNcbiAgICB9LFxuICAgIGdlblRyYW5zaXRpb24gKCk6IFZOb2RlIHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLmdlbkNvbnRlbnQoKVxuXG4gICAgICBpZiAoIXRoaXMudHJhbnNpdGlvbikgcmV0dXJuIGNvbnRlbnRcblxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ3RyYW5zaXRpb24nLCB7XG4gICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgbmFtZTogdGhpcy50cmFuc2l0aW9uLFxuICAgICAgICB9LFxuICAgICAgfSwgW2NvbnRlbnRdKVxuICAgIH0sXG4gICAgZ2VuRGlyZWN0aXZlcyAoKTogVk5vZGVEaXJlY3RpdmVbXSB7XG4gICAgICBjb25zdCBkaXJlY3RpdmVzOiBWTm9kZURpcmVjdGl2ZVtdID0gW3tcbiAgICAgICAgbmFtZTogJ3Nob3cnLFxuICAgICAgICB2YWx1ZTogdGhpcy5pc0NvbnRlbnRBY3RpdmUsXG4gICAgICB9XVxuXG4gICAgICAvLyBEbyBub3QgYWRkIGNsaWNrIG91dHNpZGUgZm9yIGhvdmVyIG1lbnVcbiAgICAgIGlmICghdGhpcy5vcGVuT25Ib3ZlciAmJiB0aGlzLmNsb3NlT25DbGljaykge1xuICAgICAgICBkaXJlY3RpdmVzLnB1c2goe1xuICAgICAgICAgIG5hbWU6ICdjbGljay1vdXRzaWRlJyxcbiAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgaGFuZGxlcjogKCkgPT4geyB0aGlzLmlzQWN0aXZlID0gZmFsc2UgfSxcbiAgICAgICAgICAgIGNsb3NlQ29uZGl0aW9uYWw6IHRoaXMuY2xvc2VDb25kaXRpb25hbCxcbiAgICAgICAgICAgIGluY2x1ZGU6ICgpID0+IFt0aGlzLiRlbCwgLi4udGhpcy5nZXRPcGVuRGVwZW5kZW50RWxlbWVudHMoKV0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRpcmVjdGl2ZXNcbiAgICB9LFxuICAgIGdlbkNvbnRlbnQgKCk6IFZOb2RlIHtcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgLi4udGhpcy5nZXRTY29wZUlkQXR0cnMoKSxcbiAgICAgICAgICByb2xlOiAncm9sZScgaW4gdGhpcy4kYXR0cnMgPyB0aGlzLiRhdHRycy5yb2xlIDogJ21lbnUnLFxuICAgICAgICB9LFxuICAgICAgICBzdGF0aWNDbGFzczogJ3YtbWVudV9fY29udGVudCcsXG4gICAgICAgIGNsYXNzOiB7XG4gICAgICAgICAgLi4udGhpcy5yb290VGhlbWVDbGFzc2VzLFxuICAgICAgICAgIC4uLnRoaXMucm91bmRlZENsYXNzZXMsXG4gICAgICAgICAgJ3YtbWVudV9fY29udGVudC0tYXV0byc6IHRoaXMuYXV0byxcbiAgICAgICAgICAndi1tZW51X19jb250ZW50LS1maXhlZCc6IHRoaXMuYWN0aXZhdG9yRml4ZWQsXG4gICAgICAgICAgbWVudWFibGVfX2NvbnRlbnRfX2FjdGl2ZTogdGhpcy5pc0FjdGl2ZSxcbiAgICAgICAgICBbdGhpcy5jb250ZW50Q2xhc3MudHJpbSgpXTogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgc3R5bGU6IHRoaXMuc3R5bGVzLFxuICAgICAgICBkaXJlY3RpdmVzOiB0aGlzLmdlbkRpcmVjdGl2ZXMoKSxcbiAgICAgICAgcmVmOiAnY29udGVudCcsXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgY2xpY2s6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTEVsZW1lbnRcblxuICAgICAgICAgICAgaWYgKHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJykpIHJldHVyblxuICAgICAgICAgICAgaWYgKHRoaXMuY2xvc2VPbkNvbnRlbnRDbGljaykgdGhpcy5pc0FjdGl2ZSA9IGZhbHNlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBrZXlkb3duOiB0aGlzLm9uS2V5RG93bixcbiAgICAgICAgfSxcbiAgICAgIH0gYXMgVk5vZGVEYXRhXG5cbiAgICAgIGlmICh0aGlzLiRsaXN0ZW5lcnMuc2Nyb2xsKSB7XG4gICAgICAgIG9wdGlvbnMub24gPSBvcHRpb25zLm9uIHx8IHt9XG4gICAgICAgIG9wdGlvbnMub24uc2Nyb2xsID0gdGhpcy4kbGlzdGVuZXJzLnNjcm9sbFxuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuZGlzYWJsZWQgJiYgdGhpcy5vcGVuT25Ib3Zlcikge1xuICAgICAgICBvcHRpb25zLm9uID0gb3B0aW9ucy5vbiB8fCB7fVxuICAgICAgICBvcHRpb25zLm9uLm1vdXNlZW50ZXIgPSB0aGlzLm1vdXNlRW50ZXJIYW5kbGVyXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9wZW5PbkhvdmVyKSB7XG4gICAgICAgIG9wdGlvbnMub24gPSBvcHRpb25zLm9uIHx8IHt9XG4gICAgICAgIG9wdGlvbnMub24ubW91c2VsZWF2ZSA9IHRoaXMubW91c2VMZWF2ZUhhbmRsZXJcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIG9wdGlvbnMsIHRoaXMuZ2V0Q29udGVudFNsb3QoKSlcbiAgICB9LFxuICAgIGdldFRpbGVzICgpIHtcbiAgICAgIGlmICghdGhpcy4kcmVmcy5jb250ZW50KSByZXR1cm5cblxuICAgICAgdGhpcy50aWxlcyA9IEFycmF5LmZyb20odGhpcy4kcmVmcy5jb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy52LWxpc3QtaXRlbScpKVxuICAgIH0sXG4gICAgbW91c2VFbnRlckhhbmRsZXIgKCkge1xuICAgICAgdGhpcy5ydW5EZWxheSgnb3BlbicsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaGFzSnVzdEZvY3VzZWQpIHJldHVyblxuXG4gICAgICAgIHRoaXMuaGFzSnVzdEZvY3VzZWQgPSB0cnVlXG4gICAgICAgIHRoaXMuaXNBY3RpdmUgPSB0cnVlXG4gICAgICB9KVxuICAgIH0sXG4gICAgbW91c2VMZWF2ZUhhbmRsZXIgKGU6IE1vdXNlRXZlbnQpIHtcbiAgICAgIC8vIFByZXZlbnQgYWNjaWRlbnRhbCByZS1hY3RpdmF0aW9uXG4gICAgICB0aGlzLnJ1bkRlbGF5KCdjbG9zZScsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuJHJlZnMuY29udGVudC5jb250YWlucyhlLnJlbGF0ZWRUYXJnZXQgYXMgSFRNTEVsZW1lbnQpKSByZXR1cm5cblxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuaXNBY3RpdmUgPSBmYWxzZVxuICAgICAgICAgIHRoaXMuY2FsbERlYWN0aXZhdGUoKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9LFxuICAgIG5leHRUaWxlICgpIHtcbiAgICAgIGNvbnN0IHRpbGUgPSB0aGlzLnRpbGVzW3RoaXMubGlzdEluZGV4ICsgMV1cblxuICAgICAgaWYgKCF0aWxlKSB7XG4gICAgICAgIGlmICghdGhpcy50aWxlcy5sZW5ndGgpIHJldHVyblxuXG4gICAgICAgIHRoaXMubGlzdEluZGV4ID0gLTFcbiAgICAgICAgdGhpcy5uZXh0VGlsZSgpXG5cbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIHRoaXMubGlzdEluZGV4KytcbiAgICAgIGlmICh0aWxlLnRhYkluZGV4ID09PSAtMSkgdGhpcy5uZXh0VGlsZSgpXG4gICAgfSxcbiAgICBwcmV2VGlsZSAoKSB7XG4gICAgICBjb25zdCB0aWxlID0gdGhpcy50aWxlc1t0aGlzLmxpc3RJbmRleCAtIDFdXG5cbiAgICAgIGlmICghdGlsZSkge1xuICAgICAgICBpZiAoIXRoaXMudGlsZXMubGVuZ3RoKSByZXR1cm5cblxuICAgICAgICB0aGlzLmxpc3RJbmRleCA9IHRoaXMudGlsZXMubGVuZ3RoXG4gICAgICAgIHRoaXMucHJldlRpbGUoKVxuXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICB0aGlzLmxpc3RJbmRleC0tXG4gICAgICBpZiAodGlsZS50YWJJbmRleCA9PT0gLTEpIHRoaXMucHJldlRpbGUoKVxuICAgIH0sXG4gICAgb25LZXlEb3duIChlOiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICBpZiAoZS5rZXlDb2RlID09PSBrZXlDb2Rlcy5lc2MpIHtcbiAgICAgICAgLy8gV2FpdCBmb3IgZGVwZW5kZW50IGVsZW1lbnRzIHRvIGNsb3NlIGZpcnN0XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyB0aGlzLmlzQWN0aXZlID0gZmFsc2UgfSlcbiAgICAgICAgY29uc3QgYWN0aXZhdG9yID0gdGhpcy5nZXRBY3RpdmF0b3IoKVxuICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiBhY3RpdmF0b3IgJiYgYWN0aXZhdG9yLmZvY3VzKCkpXG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAhdGhpcy5pc0FjdGl2ZSAmJlxuICAgICAgICBba2V5Q29kZXMudXAsIGtleUNvZGVzLmRvd25dLmluY2x1ZGVzKGUua2V5Q29kZSlcbiAgICAgICkge1xuICAgICAgICB0aGlzLmlzQWN0aXZlID0gdHJ1ZVxuICAgICAgfVxuXG4gICAgICAvLyBBbGxvdyBmb3IgaXNBY3RpdmUgd2F0Y2hlciB0byBnZW5lcmF0ZSB0aWxlIGxpc3RcbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHRoaXMuY2hhbmdlTGlzdEluZGV4KGUpKVxuICAgIH0sXG4gICAgb25SZXNpemUgKCkge1xuICAgICAgaWYgKCF0aGlzLmlzQWN0aXZlKSByZXR1cm5cblxuICAgICAgLy8gQWNjb3VudCBmb3Igc2NyZWVuIHJlc2l6ZVxuICAgICAgLy8gYW5kIG9yaWVudGF0aW9uIGNoYW5nZVxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC1leHByZXNzaW9uc1xuICAgICAgdGhpcy4kcmVmcy5jb250ZW50Lm9mZnNldFdpZHRoXG4gICAgICB0aGlzLnVwZGF0ZURpbWVuc2lvbnMoKVxuXG4gICAgICAvLyBXaGVuIHJlc2l6aW5nIHRvIGEgc21hbGxlciB3aWR0aFxuICAgICAgLy8gY29udGVudCB3aWR0aCBpcyBldmFsdWF0ZWQgYmVmb3JlXG4gICAgICAvLyB0aGUgbmV3IGFjdGl2YXRvciB3aWR0aCBoYXMgYmVlblxuICAgICAgLy8gc2V0LCBjYXVzaW5nIGl0IHRvIG5vdCBzaXplIHByb3Blcmx5XG4gICAgICAvLyBoYWNreSBidXQgd2lsbCByZXZpc2l0IGluIHRoZSBmdXR1cmVcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnJlc2l6ZVRpbWVvdXQpXG4gICAgICB0aGlzLnJlc2l6ZVRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dCh0aGlzLnVwZGF0ZURpbWVuc2lvbnMsIDEwMClcbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcbiAgICBjb25zdCBkYXRhID0ge1xuICAgICAgc3RhdGljQ2xhc3M6ICd2LW1lbnUnLFxuICAgICAgY2xhc3M6IHtcbiAgICAgICAgJ3YtbWVudS0tYXR0YWNoZWQnOlxuICAgICAgICAgIHRoaXMuYXR0YWNoID09PSAnJyB8fFxuICAgICAgICAgIHRoaXMuYXR0YWNoID09PSB0cnVlIHx8XG4gICAgICAgICAgdGhpcy5hdHRhY2ggPT09ICdhdHRhY2gnLFxuICAgICAgfSxcbiAgICAgIGRpcmVjdGl2ZXM6IFt7XG4gICAgICAgIGFyZzogJzUwMCcsXG4gICAgICAgIG5hbWU6ICdyZXNpemUnLFxuICAgICAgICB2YWx1ZTogdGhpcy5vblJlc2l6ZSxcbiAgICAgIH1dLFxuICAgIH1cblxuICAgIHJldHVybiBoKCdkaXYnLCBkYXRhLCBbXG4gICAgICAhdGhpcy5hY3RpdmF0b3IgJiYgdGhpcy5nZW5BY3RpdmF0b3IoKSxcbiAgICAgIHRoaXMuc2hvd0xhenlDb250ZW50KCgpID0+IFtcbiAgICAgICAgdGhpcy4kY3JlYXRlRWxlbWVudChWVGhlbWVQcm92aWRlciwge1xuICAgICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgICByb290OiB0cnVlLFxuICAgICAgICAgICAgbGlnaHQ6IHRoaXMubGlnaHQsXG4gICAgICAgICAgICBkYXJrOiB0aGlzLmRhcmssXG4gICAgICAgICAgfSxcbiAgICAgICAgfSwgW3RoaXMuZ2VuVHJhbnNpdGlvbigpXSksXG4gICAgICBdKSxcbiAgICBdKVxuICB9LFxufSlcbiJdfQ==