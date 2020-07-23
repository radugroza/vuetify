// Styles
import './VNavigationDrawer.sass';
// Components
import VImg from '../VImg/VImg';
// Mixins
import Applicationable from '../../mixins/applicationable';
import Colorable from '../../mixins/colorable';
import Dependent from '../../mixins/dependent';
import Mobile from '../../mixins/mobile';
import Overlayable from '../../mixins/overlayable';
import SSRBootable from '../../mixins/ssr-bootable';
import Themeable from '../../mixins/themeable';
// Directives
import ClickOutside from '../../directives/click-outside';
import Resize from '../../directives/resize';
import Touch from '../../directives/touch';
// Utilities
import { convertToUnit, getSlot } from '../../util/helpers';
import mixins from '../../util/mixins';
const baseMixins = mixins(Applicationable('left', [
    'isActive',
    'isMobile',
    'miniVariant',
    'expandOnHover',
    'permanent',
    'right',
    'temporary',
    'width',
]), Colorable, Dependent, Mobile, Overlayable, SSRBootable, Themeable);
/* @vue/component */
export default baseMixins.extend({
    name: 'v-navigation-drawer',
    provide() {
        return {
            isInNav: this.tag === 'nav',
        };
    },
    directives: {
        ClickOutside,
        Resize,
        Touch,
    },
    props: {
        bottom: Boolean,
        clipped: Boolean,
        disableResizeWatcher: Boolean,
        disableRouteWatcher: Boolean,
        expandOnHover: Boolean,
        floating: Boolean,
        height: {
            type: [Number, String],
            default() {
                return this.app ? '100vh' : '100%';
            },
        },
        miniVariant: Boolean,
        miniVariantWidth: {
            type: [Number, String],
            default: 56,
        },
        permanent: Boolean,
        right: Boolean,
        src: {
            type: [String, Object],
            default: '',
        },
        stateless: Boolean,
        tag: {
            type: String,
            default() {
                return this.app ? 'nav' : 'aside';
            },
        },
        temporary: Boolean,
        touchless: Boolean,
        width: {
            type: [Number, String],
            default: 256,
        },
        value: null,
    },
    data: () => ({
        isMouseover: false,
        touchArea: {
            left: 0,
            right: 0,
        },
        stackMinZIndex: 6,
    }),
    computed: {
        /**
         * Used for setting an app value from a dynamic
         * property. Called from applicationable.js
         */
        applicationProperty() {
            return this.right ? 'right' : 'left';
        },
        classes() {
            return {
                'v-navigation-drawer': true,
                'v-navigation-drawer--absolute': this.absolute,
                'v-navigation-drawer--bottom': this.bottom,
                'v-navigation-drawer--clipped': this.clipped,
                'v-navigation-drawer--close': !this.isActive,
                'v-navigation-drawer--fixed': !this.absolute && (this.app || this.fixed),
                'v-navigation-drawer--floating': this.floating,
                'v-navigation-drawer--is-mobile': this.isMobile,
                'v-navigation-drawer--is-mouseover': this.isMouseover,
                'v-navigation-drawer--mini-variant': this.isMiniVariant,
                'v-navigation-drawer--custom-mini-variant': Number(this.miniVariantWidth) !== 56,
                'v-navigation-drawer--open': this.isActive,
                'v-navigation-drawer--open-on-hover': this.expandOnHover,
                'v-navigation-drawer--right': this.right,
                'v-navigation-drawer--temporary': this.temporary,
                ...this.themeClasses,
            };
        },
        computedMaxHeight() {
            if (!this.hasApp)
                return null;
            const computedMaxHeight = (this.$vuetify.application.bottom +
                this.$vuetify.application.footer +
                this.$vuetify.application.bar);
            if (!this.clipped)
                return computedMaxHeight;
            return computedMaxHeight + this.$vuetify.application.top;
        },
        computedTop() {
            if (!this.hasApp)
                return 0;
            let computedTop = this.$vuetify.application.bar;
            computedTop += this.clipped
                ? this.$vuetify.application.top
                : 0;
            return computedTop;
        },
        computedTransform() {
            if (this.isActive)
                return 0;
            if (this.isBottom)
                return 100;
            return this.right ? 100 : -100;
        },
        computedWidth() {
            return this.isMiniVariant ? this.miniVariantWidth : this.width;
        },
        hasApp() {
            return (this.app &&
                (!this.isMobile && !this.temporary));
        },
        isBottom() {
            return this.bottom && this.isMobile;
        },
        isMiniVariant() {
            return (!this.expandOnHover &&
                this.miniVariant) || (this.expandOnHover &&
                !this.isMouseover);
        },
        isMobile() {
            return (!this.stateless &&
                !this.permanent &&
                Mobile.options.computed.isMobile.call(this));
        },
        reactsToClick() {
            return (!this.stateless &&
                !this.permanent &&
                (this.isMobile || this.temporary));
        },
        reactsToMobile() {
            return (this.app &&
                !this.disableResizeWatcher &&
                !this.permanent &&
                !this.stateless &&
                !this.temporary);
        },
        reactsToResize() {
            return !this.disableResizeWatcher && !this.stateless;
        },
        reactsToRoute() {
            return (!this.disableRouteWatcher &&
                !this.stateless &&
                (this.temporary || this.isMobile));
        },
        showOverlay() {
            return (!this.hideOverlay &&
                this.isActive &&
                (this.isMobile || this.temporary));
        },
        styles() {
            const translate = this.isBottom ? 'translateY' : 'translateX';
            const styles = {
                height: convertToUnit(this.height),
                top: !this.isBottom ? convertToUnit(this.computedTop) : 'auto',
                maxHeight: this.computedMaxHeight != null
                    ? `calc(100% - ${convertToUnit(this.computedMaxHeight)})`
                    : undefined,
                transform: `${translate}(${convertToUnit(this.computedTransform, '%')})`,
                width: convertToUnit(this.computedWidth),
            };
            return styles;
        },
    },
    watch: {
        $route: 'onRouteChange',
        isActive(val) {
            this.$emit('input', val);
        },
        /**
         * When mobile changes, adjust the active state
         * only when there has been a previous value
         */
        isMobile(val, prev) {
            !val &&
                this.isActive &&
                !this.temporary &&
                this.removeOverlay();
            if (prev == null ||
                !this.reactsToResize ||
                !this.reactsToMobile)
                return;
            this.isActive = !val;
        },
        permanent(val) {
            // If enabling prop enable the drawer
            if (val)
                this.isActive = true;
        },
        showOverlay(val) {
            if (val)
                this.genOverlay();
            else
                this.removeOverlay();
        },
        value(val) {
            if (this.permanent)
                return;
            if (val == null) {
                this.init();
                return;
            }
            if (val !== this.isActive)
                this.isActive = val;
        },
        expandOnHover: 'updateMiniVariant',
        isMouseover(val) {
            this.updateMiniVariant(!val);
        },
    },
    beforeMount() {
        this.init();
    },
    methods: {
        calculateTouchArea() {
            const parent = this.$el.parentNode;
            if (!parent)
                return;
            const parentRect = parent.getBoundingClientRect();
            this.touchArea = {
                left: parentRect.left + 50,
                right: parentRect.right - 50,
            };
        },
        closeConditional() {
            return this.isActive && !this._isDestroyed && this.reactsToClick;
        },
        genAppend() {
            return this.genPosition('append');
        },
        genBackground() {
            const props = {
                height: '100%',
                width: '100%',
                src: this.src,
            };
            const image = this.$scopedSlots.img
                ? this.$scopedSlots.img(props)
                : this.$createElement(VImg, { props });
            return this.$createElement('div', {
                staticClass: 'v-navigation-drawer__image',
            }, [image]);
        },
        genDirectives() {
            const directives = [{
                    name: 'click-outside',
                    value: {
                        handler: () => { this.isActive = false; },
                        closeConditional: this.closeConditional,
                        include: this.getOpenDependentElements,
                    },
                }];
            if (!this.touchless && !this.stateless) {
                directives.push({
                    name: 'touch',
                    value: {
                        parent: true,
                        left: this.swipeLeft,
                        right: this.swipeRight,
                    },
                });
            }
            return directives;
        },
        genListeners() {
            const on = {
                transitionend: (e) => {
                    if (e.target !== e.currentTarget)
                        return;
                    this.$emit('transitionend', e);
                    // IE11 does not support new Event('resize')
                    const resizeEvent = document.createEvent('UIEvents');
                    resizeEvent.initUIEvent('resize', true, false, window, 0);
                    window.dispatchEvent(resizeEvent);
                },
            };
            if (this.miniVariant) {
                on.click = () => this.$emit('update:mini-variant', false);
            }
            if (this.expandOnHover) {
                on.mouseenter = () => (this.isMouseover = true);
                on.mouseleave = () => (this.isMouseover = false);
            }
            return on;
        },
        genPosition(name) {
            const slot = getSlot(this, name);
            if (!slot)
                return slot;
            return this.$createElement('div', {
                staticClass: `v-navigation-drawer__${name}`,
            }, slot);
        },
        genPrepend() {
            return this.genPosition('prepend');
        },
        genContent() {
            return this.$createElement('div', {
                staticClass: 'v-navigation-drawer__content',
            }, this.$slots.default);
        },
        genBorder() {
            return this.$createElement('div', {
                staticClass: 'v-navigation-drawer__border',
            });
        },
        init() {
            if (this.permanent) {
                this.isActive = true;
            }
            else if (this.stateless ||
                this.value != null) {
                this.isActive = this.value;
            }
            else if (!this.temporary) {
                this.isActive = !this.isMobile;
            }
        },
        onRouteChange() {
            if (this.reactsToRoute && this.closeConditional()) {
                this.isActive = false;
            }
        },
        swipeLeft(e) {
            if (this.isActive && this.right)
                return;
            this.calculateTouchArea();
            if (Math.abs(e.touchendX - e.touchstartX) < 100)
                return;
            if (this.right &&
                e.touchstartX >= this.touchArea.right)
                this.isActive = true;
            else if (!this.right && this.isActive)
                this.isActive = false;
        },
        swipeRight(e) {
            if (this.isActive && !this.right)
                return;
            this.calculateTouchArea();
            if (Math.abs(e.touchendX - e.touchstartX) < 100)
                return;
            if (!this.right &&
                e.touchstartX <= this.touchArea.left)
                this.isActive = true;
            else if (this.right && this.isActive)
                this.isActive = false;
        },
        /**
         * Update the application layout
         */
        updateApplication() {
            if (!this.isActive ||
                this.isMobile ||
                this.temporary ||
                !this.$el)
                return 0;
            const width = Number(this.computedWidth);
            return isNaN(width) ? this.$el.clientWidth : width;
        },
        updateMiniVariant(val) {
            if (this.miniVariant !== val)
                this.$emit('update:mini-variant', val);
        },
    },
    render(h) {
        const children = [
            this.genPrepend(),
            this.genContent(),
            this.genAppend(),
            this.genBorder(),
        ];
        if (this.src || getSlot(this, 'img'))
            children.unshift(this.genBackground());
        return h(this.tag, this.setBackgroundColor(this.color, {
            class: this.classes,
            style: this.styles,
            directives: this.genDirectives(),
            on: this.genListeners(),
        }), children);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVk5hdmlnYXRpb25EcmF3ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WTmF2aWdhdGlvbkRyYXdlci9WTmF2aWdhdGlvbkRyYXdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTywwQkFBMEIsQ0FBQTtBQUVqQyxhQUFhO0FBQ2IsT0FBTyxJQUFtQixNQUFNLGNBQWMsQ0FBQTtBQUU5QyxTQUFTO0FBQ1QsT0FBTyxlQUFlLE1BQU0sOEJBQThCLENBQUE7QUFDMUQsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxNQUFNLE1BQU0scUJBQXFCLENBQUE7QUFDeEMsT0FBTyxXQUFXLE1BQU0sMEJBQTBCLENBQUE7QUFDbEQsT0FBTyxXQUFXLE1BQU0sMkJBQTJCLENBQUE7QUFDbkQsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFFOUMsYUFBYTtBQUNiLE9BQU8sWUFBWSxNQUFNLGdDQUFnQyxDQUFBO0FBQ3pELE9BQU8sTUFBTSxNQUFNLHlCQUF5QixDQUFBO0FBQzVDLE9BQU8sS0FBSyxNQUFNLHdCQUF3QixDQUFBO0FBRTFDLFlBQVk7QUFDWixPQUFPLEVBQUUsYUFBYSxFQUFFLE9BQU8sRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQzNELE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBTXRDLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FDdkIsZUFBZSxDQUFDLE1BQU0sRUFBRTtJQUN0QixVQUFVO0lBQ1YsVUFBVTtJQUNWLGFBQWE7SUFDYixlQUFlO0lBQ2YsV0FBVztJQUNYLE9BQU87SUFDUCxXQUFXO0lBQ1gsT0FBTztDQUNSLENBQUMsRUFDRixTQUFTLEVBQ1QsU0FBUyxFQUNULE1BQU0sRUFDTixXQUFXLEVBQ1gsV0FBVyxFQUNYLFNBQVMsQ0FDVixDQUFBO0FBRUQsb0JB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QztRQUNQLE1BQU0sUUFBUSxHQUFHO1lBQ2YsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNqQixJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDaEIsSUFBSSxDQUFDLFNBQVMsRUFBRTtTQUNqQixDQUFBO1FBRUQsSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDO1lBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQTtRQUU1RSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ3JELEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTztZQUNuQixLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbEIsVUFBVSxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDaEMsRUFBRSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUU7U0FDeEIsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0lBQ2YsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xuaW1wb3J0ICcuL1ZOYXZpZ2F0aW9uRHJhd2VyLnNhc3MnXG5cbi8vIENvbXBvbmVudHNcbmltcG9ydCBWSW1nLCB7IHNyY09iamVjdCB9IGZyb20gJy4uL1ZJbWcvVkltZydcblxuLy8gTWl4aW5zXG5pbXBvcnQgQXBwbGljYXRpb25hYmxlIGZyb20gJy4uLy4uL21peGlucy9hcHBsaWNhdGlvbmFibGUnXG5pbXBvcnQgQ29sb3JhYmxlIGZyb20gJy4uLy4uL21peGlucy9jb2xvcmFibGUnXG5pbXBvcnQgRGVwZW5kZW50IGZyb20gJy4uLy4uL21peGlucy9kZXBlbmRlbnQnXG5pbXBvcnQgTW9iaWxlIGZyb20gJy4uLy4uL21peGlucy9tb2JpbGUnXG5pbXBvcnQgT3ZlcmxheWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL292ZXJsYXlhYmxlJ1xuaW1wb3J0IFNTUkJvb3RhYmxlIGZyb20gJy4uLy4uL21peGlucy9zc3ItYm9vdGFibGUnXG5pbXBvcnQgVGhlbWVhYmxlIGZyb20gJy4uLy4uL21peGlucy90aGVtZWFibGUnXG5cbi8vIERpcmVjdGl2ZXNcbmltcG9ydCBDbGlja091dHNpZGUgZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9jbGljay1vdXRzaWRlJ1xuaW1wb3J0IFJlc2l6ZSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL3Jlc2l6ZSdcbmltcG9ydCBUb3VjaCBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL3RvdWNoJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCB7IGNvbnZlcnRUb1VuaXQsIGdldFNsb3QgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgVk5vZGUsIFZOb2RlRGlyZWN0aXZlLCBQcm9wVHlwZSB9IGZyb20gJ3Z1ZSdcbmltcG9ydCB7IFRvdWNoV3JhcHBlciB9IGZyb20gJ3Z1ZXRpZnkvdHlwZXMnXG5cbmNvbnN0IGJhc2VNaXhpbnMgPSBtaXhpbnMoXG4gIEFwcGxpY2F0aW9uYWJsZSgnbGVmdCcsIFtcbiAgICAnaXNBY3RpdmUnLFxuICAgICdpc01vYmlsZScsXG4gICAgJ21pbmlWYXJpYW50JyxcbiAgICAnZXhwYW5kT25Ib3ZlcicsXG4gICAgJ3Blcm1hbmVudCcsXG4gICAgJ3JpZ2h0JyxcbiAgICAndGVtcG9yYXJ5JyxcbiAgICAnd2lkdGgnLFxuICBdKSxcbiAgQ29sb3JhYmxlLFxuICBEZXBlbmRlbnQsXG4gIE1vYmlsZSxcbiAgT3ZlcmxheWFibGUsXG4gIFNTUkJvb3RhYmxlLFxuICBUaGVtZWFibGVcbilcblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IGJhc2VNaXhpbnMuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtbmF2aWdhdGlvbi1kcmF3ZXInLFxuXG4gIHByb3ZpZGUgKCk6IG9iamVjdCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlzSW5OYXY6IHRoaXMudGFnID09PSAnbmF2JyxcbiAgICB9XG4gIH0sXG5cbiAgZGlyZWN0aXZlczoge1xuICAgIENsaWNrT3V0c2lkZSxcbiAgICBSZXNpemUsXG4gICAgVG91Y2gsXG4gIH0sXG5cbiAgcHJvcHM6IHtcbiAgICBib3R0b206IEJvb2xlYW4sXG4gICAgY2xpcHBlZDogQm9vbGVhbixcbiAgICBkaXNhYmxlUmVzaXplV2F0Y2hlcjogQm9vbGVhbixcbiAgICBkaXNhYmxlUm91dGVXYXRjaGVyOiBCb29sZWFuLFxuICAgIGV4cGFuZE9uSG92ZXI6IEJvb2xlYW4sXG4gICAgZmxvYXRpbmc6IEJvb2xlYW4sXG4gICAgaGVpZ2h0OiB7XG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxuICAgICAgZGVmYXVsdCAoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwID8gJzEwMHZoJyA6ICcxMDAlJ1xuICAgICAgfSxcbiAgICB9LFxuICAgIG1pbmlWYXJpYW50OiBCb29sZWFuLFxuICAgIG1pbmlWYXJpYW50V2lkdGg6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiA1NixcbiAgICB9LFxuICAgIHBlcm1hbmVudDogQm9vbGVhbixcbiAgICByaWdodDogQm9vbGVhbixcbiAgICBzcmM6IHtcbiAgICAgIHR5cGU6IFtTdHJpbmcsIE9iamVjdF0gYXMgUHJvcFR5cGU8c3RyaW5nIHwgc3JjT2JqZWN0PixcbiAgICAgIGRlZmF1bHQ6ICcnLFxuICAgIH0sXG4gICAgc3RhdGVsZXNzOiBCb29sZWFuLFxuICAgIHRhZzoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdCAoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwID8gJ25hdicgOiAnYXNpZGUnXG4gICAgICB9LFxuICAgIH0sXG4gICAgdGVtcG9yYXJ5OiBCb29sZWFuLFxuICAgIHRvdWNobGVzczogQm9vbGVhbixcbiAgICB3aWR0aDoge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6IDI1NixcbiAgICB9LFxuICAgIHZhbHVlOiBudWxsIGFzIHVua25vd24gYXMgUHJvcFR5cGU8YW55PixcbiAgfSxcblxuICBkYXRhOiAoKSA9PiAoe1xuICAgIGlzTW91c2VvdmVyOiBmYWxzZSxcbiAgICB0b3VjaEFyZWE6IHtcbiAgICAgIGxlZnQ6IDAsXG4gICAgICByaWdodDogMCxcbiAgICB9LFxuICAgIHN0YWNrTWluWkluZGV4OiA2LFxuICB9KSxcblxuICBjb21wdXRlZDoge1xuICAgIC8qKlxuICAgICAqIFVzZWQgZm9yIHNldHRpbmcgYW4gYXBwIHZhbHVlIGZyb20gYSBkeW5hbWljXG4gICAgICogcHJvcGVydHkuIENhbGxlZCBmcm9tIGFwcGxpY2F0aW9uYWJsZS5qc1xuICAgICAqL1xuICAgIGFwcGxpY2F0aW9uUHJvcGVydHkgKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gdGhpcy5yaWdodCA/ICdyaWdodCcgOiAnbGVmdCdcbiAgICB9LFxuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAndi1uYXZpZ2F0aW9uLWRyYXdlcic6IHRydWUsXG4gICAgICAgICd2LW5hdmlnYXRpb24tZHJhd2VyLS1hYnNvbHV0ZSc6IHRoaXMuYWJzb2x1dGUsXG4gICAgICAgICd2LW5hdmlnYXRpb24tZHJhd2VyLS1ib3R0b20nOiB0aGlzLmJvdHRvbSxcbiAgICAgICAgJ3YtbmF2aWdhdGlvbi1kcmF3ZXItLWNsaXBwZWQnOiB0aGlzLmNsaXBwZWQsXG4gICAgICAgICd2LW5hdmlnYXRpb24tZHJhd2VyLS1jbG9zZSc6ICF0aGlzLmlzQWN0aXZlLFxuICAgICAgICAndi1uYXZpZ2F0aW9uLWRyYXdlci0tZml4ZWQnOiAhdGhpcy5hYnNvbHV0ZSAmJiAodGhpcy5hcHAgfHwgdGhpcy5maXhlZCksXG4gICAgICAgICd2LW5hdmlnYXRpb24tZHJhd2VyLS1mbG9hdGluZyc6IHRoaXMuZmxvYXRpbmcsXG4gICAgICAgICd2LW5hdmlnYXRpb24tZHJhd2VyLS1pcy1tb2JpbGUnOiB0aGlzLmlzTW9iaWxlLFxuICAgICAgICAndi1uYXZpZ2F0aW9uLWRyYXdlci0taXMtbW91c2VvdmVyJzogdGhpcy5pc01vdXNlb3ZlcixcbiAgICAgICAgJ3YtbmF2aWdhdGlvbi1kcmF3ZXItLW1pbmktdmFyaWFudCc6IHRoaXMuaXNNaW5pVmFyaWFudCxcbiAgICAgICAgJ3YtbmF2aWdhdGlvbi1kcmF3ZXItLWN1c3RvbS1taW5pLXZhcmlhbnQnOiBOdW1iZXIodGhpcy5taW5pVmFyaWFudFdpZHRoKSAhPT0gNTYsXG4gICAgICAgICd2LW5hdmlnYXRpb24tZHJhd2VyLS1vcGVuJzogdGhpcy5pc0FjdGl2ZSxcbiAgICAgICAgJ3YtbmF2aWdhdGlvbi1kcmF3ZXItLW9wZW4tb24taG92ZXInOiB0aGlzLmV4cGFuZE9uSG92ZXIsXG4gICAgICAgICd2LW5hdmlnYXRpb24tZHJhd2VyLS1yaWdodCc6IHRoaXMucmlnaHQsXG4gICAgICAgICd2LW5hdmlnYXRpb24tZHJhd2VyLS10ZW1wb3JhcnknOiB0aGlzLnRlbXBvcmFyeSxcbiAgICAgICAgLi4udGhpcy50aGVtZUNsYXNzZXMsXG4gICAgICB9XG4gICAgfSxcbiAgICBjb21wdXRlZE1heEhlaWdodCAoKTogbnVtYmVyIHwgbnVsbCB7XG4gICAgICBpZiAoIXRoaXMuaGFzQXBwKSByZXR1cm4gbnVsbFxuXG4gICAgICBjb25zdCBjb21wdXRlZE1heEhlaWdodCA9IChcbiAgICAgICAgdGhpcy4kdnVldGlmeS5hcHBsaWNhdGlvbi5ib3R0b20gK1xuICAgICAgICB0aGlzLiR2dWV0aWZ5LmFwcGxpY2F0aW9uLmZvb3RlciArXG4gICAgICAgIHRoaXMuJHZ1ZXRpZnkuYXBwbGljYXRpb24uYmFyXG4gICAgICApXG5cbiAgICAgIGlmICghdGhpcy5jbGlwcGVkKSByZXR1cm4gY29tcHV0ZWRNYXhIZWlnaHRcblxuICAgICAgcmV0dXJuIGNvbXB1dGVkTWF4SGVpZ2h0ICsgdGhpcy4kdnVldGlmeS5hcHBsaWNhdGlvbi50b3BcbiAgICB9LFxuICAgIGNvbXB1dGVkVG9wICgpOiBudW1iZXIge1xuICAgICAgaWYgKCF0aGlzLmhhc0FwcCkgcmV0dXJuIDBcblxuICAgICAgbGV0IGNvbXB1dGVkVG9wID0gdGhpcy4kdnVldGlmeS5hcHBsaWNhdGlvbi5iYXJcblxuICAgICAgY29tcHV0ZWRUb3AgKz0gdGhpcy5jbGlwcGVkXG4gICAgICAgID8gdGhpcy4kdnVldGlmeS5hcHBsaWNhdGlvbi50b3BcbiAgICAgICAgOiAwXG5cbiAgICAgIHJldHVybiBjb21wdXRlZFRvcFxuICAgIH0sXG4gICAgY29tcHV0ZWRUcmFuc2Zvcm0gKCk6IG51bWJlciB7XG4gICAgICBpZiAodGhpcy5pc0FjdGl2ZSkgcmV0dXJuIDBcbiAgICAgIGlmICh0aGlzLmlzQm90dG9tKSByZXR1cm4gMTAwXG4gICAgICByZXR1cm4gdGhpcy5yaWdodCA/IDEwMCA6IC0xMDBcbiAgICB9LFxuICAgIGNvbXB1dGVkV2lkdGggKCk6IHN0cmluZyB8IG51bWJlciB7XG4gICAgICByZXR1cm4gdGhpcy5pc01pbmlWYXJpYW50ID8gdGhpcy5taW5pVmFyaWFudFdpZHRoIDogdGhpcy53aWR0aFxuICAgIH0sXG4gICAgaGFzQXBwICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIHRoaXMuYXBwICYmXG4gICAgICAgICghdGhpcy5pc01vYmlsZSAmJiAhdGhpcy50ZW1wb3JhcnkpXG4gICAgICApXG4gICAgfSxcbiAgICBpc0JvdHRvbSAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5ib3R0b20gJiYgdGhpcy5pc01vYmlsZVxuICAgIH0sXG4gICAgaXNNaW5pVmFyaWFudCAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICAhdGhpcy5leHBhbmRPbkhvdmVyICYmXG4gICAgICAgIHRoaXMubWluaVZhcmlhbnRcbiAgICAgICkgfHwgKFxuICAgICAgICB0aGlzLmV4cGFuZE9uSG92ZXIgJiZcbiAgICAgICAgIXRoaXMuaXNNb3VzZW92ZXJcbiAgICAgIClcbiAgICB9LFxuICAgIGlzTW9iaWxlICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgICF0aGlzLnN0YXRlbGVzcyAmJlxuICAgICAgICAhdGhpcy5wZXJtYW5lbnQgJiZcbiAgICAgICAgTW9iaWxlLm9wdGlvbnMuY29tcHV0ZWQuaXNNb2JpbGUuY2FsbCh0aGlzKVxuICAgICAgKVxuICAgIH0sXG4gICAgcmVhY3RzVG9DbGljayAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICAhdGhpcy5zdGF0ZWxlc3MgJiZcbiAgICAgICAgIXRoaXMucGVybWFuZW50ICYmXG4gICAgICAgICh0aGlzLmlzTW9iaWxlIHx8IHRoaXMudGVtcG9yYXJ5KVxuICAgICAgKVxuICAgIH0sXG4gICAgcmVhY3RzVG9Nb2JpbGUgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgdGhpcy5hcHAgJiZcbiAgICAgICAgIXRoaXMuZGlzYWJsZVJlc2l6ZVdhdGNoZXIgJiZcbiAgICAgICAgIXRoaXMucGVybWFuZW50ICYmXG4gICAgICAgICF0aGlzLnN0YXRlbGVzcyAmJlxuICAgICAgICAhdGhpcy50ZW1wb3JhcnlcbiAgICAgIClcbiAgICB9LFxuICAgIHJlYWN0c1RvUmVzaXplICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiAhdGhpcy5kaXNhYmxlUmVzaXplV2F0Y2hlciAmJiAhdGhpcy5zdGF0ZWxlc3NcbiAgICB9LFxuICAgIHJlYWN0c1RvUm91dGUgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgIXRoaXMuZGlzYWJsZVJvdXRlV2F0Y2hlciAmJlxuICAgICAgICAhdGhpcy5zdGF0ZWxlc3MgJiZcbiAgICAgICAgKHRoaXMudGVtcG9yYXJ5IHx8IHRoaXMuaXNNb2JpbGUpXG4gICAgICApXG4gICAgfSxcbiAgICBzaG93T3ZlcmxheSAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICAhdGhpcy5oaWRlT3ZlcmxheSAmJlxuICAgICAgICB0aGlzLmlzQWN0aXZlICYmXG4gICAgICAgICh0aGlzLmlzTW9iaWxlIHx8IHRoaXMudGVtcG9yYXJ5KVxuICAgICAgKVxuICAgIH0sXG4gICAgc3R5bGVzICgpOiBvYmplY3Qge1xuICAgICAgY29uc3QgdHJhbnNsYXRlID0gdGhpcy5pc0JvdHRvbSA/ICd0cmFuc2xhdGVZJyA6ICd0cmFuc2xhdGVYJ1xuICAgICAgY29uc3Qgc3R5bGVzID0ge1xuICAgICAgICBoZWlnaHQ6IGNvbnZlcnRUb1VuaXQodGhpcy5oZWlnaHQpLFxuICAgICAgICB0b3A6ICF0aGlzLmlzQm90dG9tID8gY29udmVydFRvVW5pdCh0aGlzLmNvbXB1dGVkVG9wKSA6ICdhdXRvJyxcbiAgICAgICAgbWF4SGVpZ2h0OiB0aGlzLmNvbXB1dGVkTWF4SGVpZ2h0ICE9IG51bGxcbiAgICAgICAgICA/IGBjYWxjKDEwMCUgLSAke2NvbnZlcnRUb1VuaXQodGhpcy5jb21wdXRlZE1heEhlaWdodCl9KWBcbiAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgdHJhbnNmb3JtOiBgJHt0cmFuc2xhdGV9KCR7Y29udmVydFRvVW5pdCh0aGlzLmNvbXB1dGVkVHJhbnNmb3JtLCAnJScpfSlgLFxuICAgICAgICB3aWR0aDogY29udmVydFRvVW5pdCh0aGlzLmNvbXB1dGVkV2lkdGgpLFxuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3R5bGVzXG4gICAgfSxcbiAgfSxcblxuICB3YXRjaDoge1xuICAgICRyb3V0ZTogJ29uUm91dGVDaGFuZ2UnLFxuICAgIGlzQWN0aXZlICh2YWwpIHtcbiAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgdmFsKVxuICAgIH0sXG4gICAgLyoqXG4gICAgICogV2hlbiBtb2JpbGUgY2hhbmdlcywgYWRqdXN0IHRoZSBhY3RpdmUgc3RhdGVcbiAgICAgKiBvbmx5IHdoZW4gdGhlcmUgaGFzIGJlZW4gYSBwcmV2aW91cyB2YWx1ZVxuICAgICAqL1xuICAgIGlzTW9iaWxlICh2YWwsIHByZXYpIHtcbiAgICAgICF2YWwgJiZcbiAgICAgICAgdGhpcy5pc0FjdGl2ZSAmJlxuICAgICAgICAhdGhpcy50ZW1wb3JhcnkgJiZcbiAgICAgICAgdGhpcy5yZW1vdmVPdmVybGF5KClcblxuICAgICAgaWYgKHByZXYgPT0gbnVsbCB8fFxuICAgICAgICAhdGhpcy5yZWFjdHNUb1Jlc2l6ZSB8fFxuICAgICAgICAhdGhpcy5yZWFjdHNUb01vYmlsZVxuICAgICAgKSByZXR1cm5cblxuICAgICAgdGhpcy5pc0FjdGl2ZSA9ICF2YWxcbiAgICB9LFxuICAgIHBlcm1hbmVudCAodmFsKSB7XG4gICAgICAvLyBJZiBlbmFibGluZyBwcm9wIGVuYWJsZSB0aGUgZHJhd2VyXG4gICAgICBpZiAodmFsKSB0aGlzLmlzQWN0aXZlID0gdHJ1ZVxuICAgIH0sXG4gICAgc2hvd092ZXJsYXkgKHZhbCkge1xuICAgICAgaWYgKHZhbCkgdGhpcy5nZW5PdmVybGF5KClcbiAgICAgIGVsc2UgdGhpcy5yZW1vdmVPdmVybGF5KClcbiAgICB9LFxuICAgIHZhbHVlICh2YWwpIHtcbiAgICAgIGlmICh0aGlzLnBlcm1hbmVudCkgcmV0dXJuXG5cbiAgICAgIGlmICh2YWwgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLmluaXQoKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYgKHZhbCAhPT0gdGhpcy5pc0FjdGl2ZSkgdGhpcy5pc0FjdGl2ZSA9IHZhbFxuICAgIH0sXG4gICAgZXhwYW5kT25Ib3ZlcjogJ3VwZGF0ZU1pbmlWYXJpYW50JyxcbiAgICBpc01vdXNlb3ZlciAodmFsKSB7XG4gICAgICB0aGlzLnVwZGF0ZU1pbmlWYXJpYW50KCF2YWwpXG4gICAgfSxcbiAgfSxcblxuICBiZWZvcmVNb3VudCAoKSB7XG4gICAgdGhpcy5pbml0KClcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgY2FsY3VsYXRlVG91Y2hBcmVhICgpIHtcbiAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuJGVsLnBhcmVudE5vZGUgYXMgRWxlbWVudFxuXG4gICAgICBpZiAoIXBhcmVudCkgcmV0dXJuXG5cbiAgICAgIGNvbnN0IHBhcmVudFJlY3QgPSBwYXJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICAgICAgdGhpcy50b3VjaEFyZWEgPSB7XG4gICAgICAgIGxlZnQ6IHBhcmVudFJlY3QubGVmdCArIDUwLFxuICAgICAgICByaWdodDogcGFyZW50UmVjdC5yaWdodCAtIDUwLFxuICAgICAgfVxuICAgIH0sXG4gICAgY2xvc2VDb25kaXRpb25hbCAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5pc0FjdGl2ZSAmJiAhdGhpcy5faXNEZXN0cm95ZWQgJiYgdGhpcy5yZWFjdHNUb0NsaWNrXG4gICAgfSxcbiAgICBnZW5BcHBlbmQgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2VuUG9zaXRpb24oJ2FwcGVuZCcpXG4gICAgfSxcbiAgICBnZW5CYWNrZ3JvdW5kICgpIHtcbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgc3JjOiB0aGlzLnNyYyxcbiAgICAgIH1cblxuICAgICAgY29uc3QgaW1hZ2UgPSB0aGlzLiRzY29wZWRTbG90cy5pbWdcbiAgICAgICAgPyB0aGlzLiRzY29wZWRTbG90cy5pbWcocHJvcHMpXG4gICAgICAgIDogdGhpcy4kY3JlYXRlRWxlbWVudChWSW1nLCB7IHByb3BzIH0pXG5cbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1uYXZpZ2F0aW9uLWRyYXdlcl9faW1hZ2UnLFxuICAgICAgfSwgW2ltYWdlXSlcbiAgICB9LFxuICAgIGdlbkRpcmVjdGl2ZXMgKCk6IFZOb2RlRGlyZWN0aXZlW10ge1xuICAgICAgY29uc3QgZGlyZWN0aXZlcyA9IFt7XG4gICAgICAgIG5hbWU6ICdjbGljay1vdXRzaWRlJyxcbiAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICBoYW5kbGVyOiAoKSA9PiB7IHRoaXMuaXNBY3RpdmUgPSBmYWxzZSB9LFxuICAgICAgICAgIGNsb3NlQ29uZGl0aW9uYWw6IHRoaXMuY2xvc2VDb25kaXRpb25hbCxcbiAgICAgICAgICBpbmNsdWRlOiB0aGlzLmdldE9wZW5EZXBlbmRlbnRFbGVtZW50cyxcbiAgICAgICAgfSxcbiAgICAgIH1dXG5cbiAgICAgIGlmICghdGhpcy50b3VjaGxlc3MgJiYgIXRoaXMuc3RhdGVsZXNzKSB7XG4gICAgICAgIGRpcmVjdGl2ZXMucHVzaCh7XG4gICAgICAgICAgbmFtZTogJ3RvdWNoJyxcbiAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgcGFyZW50OiB0cnVlLFxuICAgICAgICAgICAgbGVmdDogdGhpcy5zd2lwZUxlZnQsXG4gICAgICAgICAgICByaWdodDogdGhpcy5zd2lwZVJpZ2h0LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0gYXMgYW55KVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZGlyZWN0aXZlc1xuICAgIH0sXG4gICAgZ2VuTGlzdGVuZXJzICgpIHtcbiAgICAgIGNvbnN0IG9uOiBSZWNvcmQ8c3RyaW5nLCAoZTogRXZlbnQpID0+IHZvaWQ+ID0ge1xuICAgICAgICB0cmFuc2l0aW9uZW5kOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBpZiAoZS50YXJnZXQgIT09IGUuY3VycmVudFRhcmdldCkgcmV0dXJuXG4gICAgICAgICAgdGhpcy4kZW1pdCgndHJhbnNpdGlvbmVuZCcsIGUpXG5cbiAgICAgICAgICAvLyBJRTExIGRvZXMgbm90IHN1cHBvcnQgbmV3IEV2ZW50KCdyZXNpemUnKVxuICAgICAgICAgIGNvbnN0IHJlc2l6ZUV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ1VJRXZlbnRzJylcbiAgICAgICAgICByZXNpemVFdmVudC5pbml0VUlFdmVudCgncmVzaXplJywgdHJ1ZSwgZmFsc2UsIHdpbmRvdywgMClcbiAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChyZXNpemVFdmVudClcbiAgICAgICAgfSxcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMubWluaVZhcmlhbnQpIHtcbiAgICAgICAgb24uY2xpY2sgPSAoKSA9PiB0aGlzLiRlbWl0KCd1cGRhdGU6bWluaS12YXJpYW50JywgZmFsc2UpXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmV4cGFuZE9uSG92ZXIpIHtcbiAgICAgICAgb24ubW91c2VlbnRlciA9ICgpID0+ICh0aGlzLmlzTW91c2VvdmVyID0gdHJ1ZSlcbiAgICAgICAgb24ubW91c2VsZWF2ZSA9ICgpID0+ICh0aGlzLmlzTW91c2VvdmVyID0gZmFsc2UpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvblxuICAgIH0sXG4gICAgZ2VuUG9zaXRpb24gKG5hbWU6ICdwcmVwZW5kJyB8ICdhcHBlbmQnKSB7XG4gICAgICBjb25zdCBzbG90ID0gZ2V0U2xvdCh0aGlzLCBuYW1lKVxuXG4gICAgICBpZiAoIXNsb3QpIHJldHVybiBzbG90XG5cbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgIHN0YXRpY0NsYXNzOiBgdi1uYXZpZ2F0aW9uLWRyYXdlcl9fJHtuYW1lfWAsXG4gICAgICB9LCBzbG90KVxuICAgIH0sXG4gICAgZ2VuUHJlcGVuZCAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZW5Qb3NpdGlvbigncHJlcGVuZCcpXG4gICAgfSxcbiAgICBnZW5Db250ZW50ICgpIHtcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1uYXZpZ2F0aW9uLWRyYXdlcl9fY29udGVudCcsXG4gICAgICB9LCB0aGlzLiRzbG90cy5kZWZhdWx0KVxuICAgIH0sXG4gICAgZ2VuQm9yZGVyICgpIHtcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1uYXZpZ2F0aW9uLWRyYXdlcl9fYm9yZGVyJyxcbiAgICAgIH0pXG4gICAgfSxcbiAgICBpbml0ICgpIHtcbiAgICAgIGlmICh0aGlzLnBlcm1hbmVudCkge1xuICAgICAgICB0aGlzLmlzQWN0aXZlID0gdHJ1ZVxuICAgICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlbGVzcyB8fFxuICAgICAgICB0aGlzLnZhbHVlICE9IG51bGxcbiAgICAgICkge1xuICAgICAgICB0aGlzLmlzQWN0aXZlID0gdGhpcy52YWx1ZVxuICAgICAgfSBlbHNlIGlmICghdGhpcy50ZW1wb3JhcnkpIHtcbiAgICAgICAgdGhpcy5pc0FjdGl2ZSA9ICF0aGlzLmlzTW9iaWxlXG4gICAgICB9XG4gICAgfSxcbiAgICBvblJvdXRlQ2hhbmdlICgpIHtcbiAgICAgIGlmICh0aGlzLnJlYWN0c1RvUm91dGUgJiYgdGhpcy5jbG9zZUNvbmRpdGlvbmFsKCkpIHtcbiAgICAgICAgdGhpcy5pc0FjdGl2ZSA9IGZhbHNlXG4gICAgICB9XG4gICAgfSxcbiAgICBzd2lwZUxlZnQgKGU6IFRvdWNoV3JhcHBlcikge1xuICAgICAgaWYgKHRoaXMuaXNBY3RpdmUgJiYgdGhpcy5yaWdodCkgcmV0dXJuXG4gICAgICB0aGlzLmNhbGN1bGF0ZVRvdWNoQXJlYSgpXG5cbiAgICAgIGlmIChNYXRoLmFicyhlLnRvdWNoZW5kWCAtIGUudG91Y2hzdGFydFgpIDwgMTAwKSByZXR1cm5cbiAgICAgIGlmICh0aGlzLnJpZ2h0ICYmXG4gICAgICAgIGUudG91Y2hzdGFydFggPj0gdGhpcy50b3VjaEFyZWEucmlnaHRcbiAgICAgICkgdGhpcy5pc0FjdGl2ZSA9IHRydWVcbiAgICAgIGVsc2UgaWYgKCF0aGlzLnJpZ2h0ICYmIHRoaXMuaXNBY3RpdmUpIHRoaXMuaXNBY3RpdmUgPSBmYWxzZVxuICAgIH0sXG4gICAgc3dpcGVSaWdodCAoZTogVG91Y2hXcmFwcGVyKSB7XG4gICAgICBpZiAodGhpcy5pc0FjdGl2ZSAmJiAhdGhpcy5yaWdodCkgcmV0dXJuXG4gICAgICB0aGlzLmNhbGN1bGF0ZVRvdWNoQXJlYSgpXG5cbiAgICAgIGlmIChNYXRoLmFicyhlLnRvdWNoZW5kWCAtIGUudG91Y2hzdGFydFgpIDwgMTAwKSByZXR1cm5cbiAgICAgIGlmICghdGhpcy5yaWdodCAmJlxuICAgICAgICBlLnRvdWNoc3RhcnRYIDw9IHRoaXMudG91Y2hBcmVhLmxlZnRcbiAgICAgICkgdGhpcy5pc0FjdGl2ZSA9IHRydWVcbiAgICAgIGVsc2UgaWYgKHRoaXMucmlnaHQgJiYgdGhpcy5pc0FjdGl2ZSkgdGhpcy5pc0FjdGl2ZSA9IGZhbHNlXG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBVcGRhdGUgdGhlIGFwcGxpY2F0aW9uIGxheW91dFxuICAgICAqL1xuICAgIHVwZGF0ZUFwcGxpY2F0aW9uICgpIHtcbiAgICAgIGlmIChcbiAgICAgICAgIXRoaXMuaXNBY3RpdmUgfHxcbiAgICAgICAgdGhpcy5pc01vYmlsZSB8fFxuICAgICAgICB0aGlzLnRlbXBvcmFyeSB8fFxuICAgICAgICAhdGhpcy4kZWxcbiAgICAgICkgcmV0dXJuIDBcblxuICAgICAgY29uc3Qgd2lkdGggPSBOdW1iZXIodGhpcy5jb21wdXRlZFdpZHRoKVxuXG4gICAgICByZXR1cm4gaXNOYU4od2lkdGgpID8gdGhpcy4kZWwuY2xpZW50V2lkdGggOiB3aWR0aFxuICAgIH0sXG4gICAgdXBkYXRlTWluaVZhcmlhbnQgKHZhbDogYm9vbGVhbikge1xuICAgICAgaWYgKHRoaXMubWluaVZhcmlhbnQgIT09IHZhbCkgdGhpcy4kZW1pdCgndXBkYXRlOm1pbmktdmFyaWFudCcsIHZhbClcbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcbiAgICBjb25zdCBjaGlsZHJlbiA9IFtcbiAgICAgIHRoaXMuZ2VuUHJlcGVuZCgpLFxuICAgICAgdGhpcy5nZW5Db250ZW50KCksXG4gICAgICB0aGlzLmdlbkFwcGVuZCgpLFxuICAgICAgdGhpcy5nZW5Cb3JkZXIoKSxcbiAgICBdXG5cbiAgICBpZiAodGhpcy5zcmMgfHwgZ2V0U2xvdCh0aGlzLCAnaW1nJykpIGNoaWxkcmVuLnVuc2hpZnQodGhpcy5nZW5CYWNrZ3JvdW5kKCkpXG5cbiAgICByZXR1cm4gaCh0aGlzLnRhZywgdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IodGhpcy5jb2xvciwge1xuICAgICAgY2xhc3M6IHRoaXMuY2xhc3NlcyxcbiAgICAgIHN0eWxlOiB0aGlzLnN0eWxlcyxcbiAgICAgIGRpcmVjdGl2ZXM6IHRoaXMuZ2VuRGlyZWN0aXZlcygpLFxuICAgICAgb246IHRoaXMuZ2VuTGlzdGVuZXJzKCksXG4gICAgfSksIGNoaWxkcmVuKVxuICB9LFxufSlcbiJdfQ==