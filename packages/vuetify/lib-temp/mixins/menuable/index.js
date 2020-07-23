// Mixins
import Positionable from '../positionable';
import Stackable from '../stackable';
import Activatable from '../activatable';
// Utilities
import mixins from '../../util/mixins';
import { convertToUnit } from '../../util/helpers';
// Types
const baseMixins = mixins(Stackable, Positionable, Activatable);
/* @vue/component */
export default baseMixins.extend().extend({
    name: 'menuable',
    props: {
        allowOverflow: Boolean,
        light: Boolean,
        dark: Boolean,
        maxWidth: {
            type: [Number, String],
            default: 'auto',
        },
        minWidth: [Number, String],
        nudgeBottom: {
            type: [Number, String],
            default: 0,
        },
        nudgeLeft: {
            type: [Number, String],
            default: 0,
        },
        nudgeRight: {
            type: [Number, String],
            default: 0,
        },
        nudgeTop: {
            type: [Number, String],
            default: 0,
        },
        nudgeWidth: {
            type: [Number, String],
            default: 0,
        },
        offsetOverflow: Boolean,
        openOnClick: Boolean,
        positionX: {
            type: Number,
            default: null,
        },
        positionY: {
            type: Number,
            default: null,
        },
        zIndex: {
            type: [Number, String],
            default: null,
        },
    },
    data: () => ({
        absoluteX: 0,
        absoluteY: 0,
        activatedBy: null,
        activatorFixed: false,
        dimensions: {
            activator: {
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                width: 0,
                height: 0,
                offsetTop: 0,
                scrollHeight: 0,
                offsetLeft: 0,
            },
            content: {
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                width: 0,
                height: 0,
                offsetTop: 0,
                scrollHeight: 0,
            },
        },
        hasJustFocused: false,
        hasWindow: false,
        inputActivator: false,
        isContentActive: false,
        pageWidth: 0,
        pageYOffset: 0,
        stackClass: 'v-menu__content--active',
        stackMinZIndex: 6,
    }),
    computed: {
        computedLeft() {
            const a = this.dimensions.activator;
            const c = this.dimensions.content;
            const activatorLeft = (this.attach !== false ? a.offsetLeft : a.left) || 0;
            const minWidth = Math.max(a.width, c.width);
            let left = 0;
            left += this.left ? activatorLeft - (minWidth - a.width) : activatorLeft;
            if (this.offsetX) {
                const maxWidth = isNaN(Number(this.maxWidth))
                    ? a.width
                    : Math.min(a.width, Number(this.maxWidth));
                left += this.left ? -maxWidth : a.width;
            }
            if (this.nudgeLeft)
                left -= parseInt(this.nudgeLeft);
            if (this.nudgeRight)
                left += parseInt(this.nudgeRight);
            return left;
        },
        computedTop() {
            const a = this.dimensions.activator;
            const c = this.dimensions.content;
            let top = 0;
            if (this.top)
                top += a.height - c.height;
            if (this.attach !== false)
                top += a.offsetTop;
            else
                top += a.top + this.pageYOffset;
            if (this.offsetY)
                top += this.top ? -a.height : a.height;
            if (this.nudgeTop)
                top -= parseInt(this.nudgeTop);
            if (this.nudgeBottom)
                top += parseInt(this.nudgeBottom);
            return top;
        },
        hasActivator() {
            return !!this.$slots.activator || !!this.$scopedSlots.activator || !!this.activator || !!this.inputActivator;
        },
    },
    watch: {
        disabled(val) {
            val && this.callDeactivate();
        },
        isActive(val) {
            if (this.disabled)
                return;
            val ? this.callActivate() : this.callDeactivate();
        },
        positionX: 'updateDimensions',
        positionY: 'updateDimensions',
    },
    beforeMount() {
        this.hasWindow = typeof window !== 'undefined';
    },
    methods: {
        absolutePosition() {
            return {
                offsetTop: 0,
                offsetLeft: 0,
                scrollHeight: 0,
                top: this.positionY || this.absoluteY,
                bottom: this.positionY || this.absoluteY,
                left: this.positionX || this.absoluteX,
                right: this.positionX || this.absoluteX,
                height: 0,
                width: 0,
            };
        },
        activate() { },
        calcLeft(menuWidth) {
            return convertToUnit(this.attach !== false
                ? this.computedLeft
                : this.calcXOverflow(this.computedLeft, menuWidth));
        },
        calcTop() {
            return convertToUnit(this.attach !== false
                ? this.computedTop
                : this.calcYOverflow(this.computedTop));
        },
        calcXOverflow(left, menuWidth) {
            const xOverflow = left + menuWidth - this.pageWidth + 12;
            if ((!this.left || this.right) && xOverflow > 0) {
                left = Math.max(left - xOverflow, 0);
            }
            else {
                left = Math.max(left, 12);
            }
            return left + this.getOffsetLeft();
        },
        calcYOverflow(top) {
            const documentHeight = this.getInnerHeight();
            const toTop = this.pageYOffset + documentHeight;
            const activator = this.dimensions.activator;
            const contentHeight = this.dimensions.content.height;
            const totalHeight = top + contentHeight;
            const isOverflowing = toTop < totalHeight;
            // If overflowing bottom and offset
            // TODO: set 'bottom' position instead of 'top'
            if (isOverflowing &&
                this.offsetOverflow &&
                // If we don't have enough room to offset
                // the overflow, don't offset
                activator.top > contentHeight) {
                top = this.pageYOffset + (activator.top - contentHeight);
                // If overflowing bottom
            }
            else if (isOverflowing && !this.allowOverflow) {
                top = toTop - contentHeight - 12;
                // If overflowing top
            }
            else if (top < this.pageYOffset && !this.allowOverflow) {
                top = this.pageYOffset + 12;
            }
            return top < 12 ? 12 : top;
        },
        callActivate() {
            if (!this.hasWindow)
                return;
            this.activate();
        },
        callDeactivate() {
            this.isContentActive = false;
            this.deactivate();
        },
        checkForPageYOffset() {
            if (this.hasWindow) {
                this.pageYOffset = this.activatorFixed ? 0 : this.getOffsetTop();
            }
        },
        checkActivatorFixed() {
            if (this.attach !== false)
                return;
            let el = this.getActivator();
            while (el) {
                if (window.getComputedStyle(el).position === 'fixed') {
                    this.activatorFixed = true;
                    return;
                }
                el = el.offsetParent;
            }
            this.activatorFixed = false;
        },
        deactivate() { },
        genActivatorListeners() {
            const listeners = Activatable.options.methods.genActivatorListeners.call(this);
            const onClick = listeners.click;
            listeners.click = (e) => {
                if (this.openOnClick) {
                    onClick && onClick(e);
                }
                this.absoluteX = e.clientX;
                this.absoluteY = e.clientY;
            };
            return listeners;
        },
        getInnerHeight() {
            if (!this.hasWindow)
                return 0;
            return window.innerHeight ||
                document.documentElement.clientHeight;
        },
        getOffsetLeft() {
            if (!this.hasWindow)
                return 0;
            return window.pageXOffset ||
                document.documentElement.scrollLeft;
        },
        getOffsetTop() {
            if (!this.hasWindow)
                return 0;
            return window.pageYOffset ||
                document.documentElement.scrollTop;
        },
        getRoundedBoundedClientRect(el) {
            const rect = el.getBoundingClientRect();
            return {
                top: Math.round(rect.top),
                left: Math.round(rect.left),
                bottom: Math.round(rect.bottom),
                right: Math.round(rect.right),
                width: Math.round(rect.width),
                height: Math.round(rect.height),
            };
        },
        measure(el) {
            if (!el || !this.hasWindow)
                return null;
            const rect = this.getRoundedBoundedClientRect(el);
            // Account for activator margin
            if (this.attach !== false) {
                const style = window.getComputedStyle(el);
                rect.left = parseInt(style.marginLeft);
                rect.top = parseInt(style.marginTop);
            }
            return rect;
        },
        sneakPeek(cb) {
            requestAnimationFrame(() => {
                const el = this.$refs.content;
                if (!el || el.style.display !== 'none') {
                    cb();
                    return;
                }
                el.style.display = 'inline-block';
                cb();
                el.style.display = 'none';
            });
        },
        startTransition() {
            return new Promise(resolve => requestAnimationFrame(() => {
                this.isContentActive = this.hasJustFocused = this.isActive;
                resolve();
            }));
        },
        updateDimensions() {
            this.hasWindow = typeof window !== 'undefined';
            this.checkActivatorFixed();
            this.checkForPageYOffset();
            this.pageWidth = document.documentElement.clientWidth;
            const dimensions = {
                activator: { ...this.dimensions.activator },
                content: { ...this.dimensions.content },
            };
            // Activator should already be shown
            if (!this.hasActivator || this.absolute) {
                dimensions.activator = this.absolutePosition();
            }
            else {
                const activator = this.getActivator();
                if (!activator)
                    return;
                dimensions.activator = this.measure(activator);
                dimensions.activator.offsetLeft = activator.offsetLeft;
                if (this.attach !== false) {
                    // account for css padding causing things to not line up
                    // this is mostly for v-autocomplete, hopefully it won't break anything
                    dimensions.activator.offsetTop = activator.offsetTop;
                }
                else {
                    dimensions.activator.offsetTop = 0;
                }
            }
            // Display and hide to get dimensions
            this.sneakPeek(() => {
                this.$refs.content && (dimensions.content = this.measure(this.$refs.content));
                this.dimensions = dimensions;
            });
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL21lbnVhYmxlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFNBQVM7QUFDVCxPQUFPLFlBQVksTUFBTSxpQkFBaUIsQ0FBQTtBQUMxQyxPQUFPLFNBQVMsTUFBTSxjQUFjLENBQUE7QUFDcEMsT0FBTyxXQUFXLE1BQU0sZ0JBQWdCLENBQUE7QUFFeEMsWUFBWTtBQUNaLE9BQU8sTUFBc0IsTUFBTSxtQkFBbUIsQ0FBQTtBQUN0RCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFFbEQsUUFBUTtBQUNSLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FDdkIsU0FBUyxFQUNULFlBQVksRUFDWixXQUFXLENBQ1osQ0FBQTtBQVlELG9CQUFvQjtBQUNwQixlQUFlLFVBQVUsQ0FBQyxNQUFNLEVBQVcsQ0FBQyxNQUFNLENBQUM7SUFDakQsSUFBSSxFQUFFLFVBQVU7SUFFaEIsS0FBSyxFQUFFO1FBQ0wsYUFBYSxFQUFFLE9BQU87UUFDdEIsS0FBSyxFQUFFLE9BQU87UUFDZCxJQUFJLEVBQUUsT0FBTztRQUNiLFFBQVEsRUFBRTtZQUNSLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxFQUFFLE1BQU07U0FDaEI7UUFDRCxRQUFRLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1FBQzFCLFdBQVcsRUFBRTtZQUNYLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxFQUFFLENBQUM7U0FDWDtRQUNELFNBQVMsRUFBRTtZQUNULElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxFQUFFLENBQUM7U0FDWDtRQUNELFVBQVUsRUFBRTtZQUNWLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxF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QUFTLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUE7aUJBQ3JEO3FCQUFNO29CQUNMLFVBQVUsQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQTtpQkFDbkM7YUFDRjtZQUVELHFDQUFxQztZQUNyQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtnQkFDbEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO2dCQUU3RSxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQTtZQUM5QixDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIE1peGluc1xuaW1wb3J0IFBvc2l0aW9uYWJsZSBmcm9tICcuLi9wb3NpdGlvbmFibGUnXG5pbXBvcnQgU3RhY2thYmxlIGZyb20gJy4uL3N0YWNrYWJsZSdcbmltcG9ydCBBY3RpdmF0YWJsZSBmcm9tICcuLi9hY3RpdmF0YWJsZSdcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgbWl4aW5zLCB7IEV4dHJhY3RWdWUgfSBmcm9tICcuLi8uLi91dGlsL21peGlucydcbmltcG9ydCB7IGNvbnZlcnRUb1VuaXQgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5cbi8vIFR5cGVzXG5jb25zdCBiYXNlTWl4aW5zID0gbWl4aW5zKFxuICBTdGFja2FibGUsXG4gIFBvc2l0aW9uYWJsZSxcbiAgQWN0aXZhdGFibGVcbilcblxuaW50ZXJmYWNlIG9wdGlvbnMgZXh0ZW5kcyBFeHRyYWN0VnVlPHR5cGVvZiBiYXNlTWl4aW5zPiB7XG4gIGF0dGFjaDogYm9vbGVhbiB8IHN0cmluZyB8IEVsZW1lbnRcbiAgb2Zmc2V0WTogYm9vbGVhblxuICBvZmZzZXRYOiBib29sZWFuXG4gICRyZWZzOiB7XG4gICAgY29udGVudDogSFRNTEVsZW1lbnRcbiAgICBhY3RpdmF0b3I6IEhUTUxFbGVtZW50XG4gIH1cbn1cblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IGJhc2VNaXhpbnMuZXh0ZW5kPG9wdGlvbnM+KCkuZXh0ZW5kKHtcbiAgbmFtZTogJ21lbnVhYmxlJyxcblxuICBwcm9wczoge1xuICAgIGFsbG93T3ZlcmZsb3c6IEJvb2xlYW4sXG4gICAgbGlnaHQ6IEJvb2xlYW4sXG4gICAgZGFyazogQm9vbGVhbixcbiAgICBtYXhXaWR0aDoge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6ICdhdXRvJyxcbiAgICB9LFxuICAgIG1pbldpZHRoOiBbTnVtYmVyLCBTdHJpbmddLFxuICAgIG51ZGdlQm90dG9tOiB7XG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxuICAgICAgZGVmYXVsdDogMCxcbiAgICB9LFxuICAgIG51ZGdlTGVmdDoge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgICBudWRnZVJpZ2h0OiB7XG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxuICAgICAgZGVmYXVsdDogMCxcbiAgICB9LFxuICAgIG51ZGdlVG9wOiB7XG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxuICAgICAgZGVmYXVsdDogMCxcbiAgICB9LFxuICAgIG51ZGdlV2lkdGg6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gICAgb2Zmc2V0T3ZlcmZsb3c6IEJvb2xlYW4sXG4gICAgb3Blbk9uQ2xpY2s6IEJvb2xlYW4sXG4gICAgcG9zaXRpb25YOiB7XG4gICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICBkZWZhdWx0OiBudWxsLFxuICAgIH0sXG4gICAgcG9zaXRpb25ZOiB7XG4gICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICBkZWZhdWx0OiBudWxsLFxuICAgIH0sXG4gICAgekluZGV4OiB7XG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxuICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICB9LFxuICB9LFxuXG4gIGRhdGE6ICgpID0+ICh7XG4gICAgYWJzb2x1dGVYOiAwLFxuICAgIGFic29sdXRlWTogMCxcbiAgICBhY3RpdmF0ZWRCeTogbnVsbCBhcyBFdmVudFRhcmdldCB8IG51bGwsXG4gICAgYWN0aXZhdG9yRml4ZWQ6IGZhbHNlLFxuICAgIGRpbWVuc2lvbnM6IHtcbiAgICAgIGFjdGl2YXRvcjoge1xuICAgICAgICB0b3A6IDAsXG4gICAgICAgIGxlZnQ6IDAsXG4gICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgIHdpZHRoOiAwLFxuICAgICAgICBoZWlnaHQ6IDAsXG4gICAgICAgIG9mZnNldFRvcDogMCxcbiAgICAgICAgc2Nyb2xsSGVpZ2h0OiAwLFxuICAgICAgICBvZmZzZXRMZWZ0OiAwLFxuICAgICAgfSxcbiAgICAgIGNvbnRlbnQ6IHtcbiAgICAgICAgdG9wOiAwLFxuICAgICAgICBsZWZ0OiAwLFxuICAgICAgICBib3R0b206IDAsXG4gICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgaGVpZ2h0OiAwLFxuICAgICAgICBvZmZzZXRUb3A6IDAsXG4gICAgICAgIHNjcm9sbEhlaWdodDogMCxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBoYXNKdXN0Rm9jdXNlZDogZmFsc2UsXG4gICAgaGFzV2luZG93OiBmYWxzZSxcbiAgICBpbnB1dEFjdGl2YXRvcjogZmFsc2UsXG4gICAgaXNDb250ZW50QWN0aXZlOiBmYWxzZSxcbiAgICBwYWdlV2lkdGg6IDAsXG4gICAgcGFnZVlPZmZzZXQ6IDAsXG4gICAgc3RhY2tDbGFzczogJ3YtbWVudV9fY29udGVudC0tYWN0aXZlJyxcbiAgICBzdGFja01pblpJbmRleDogNixcbiAgfSksXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBjb21wdXRlZExlZnQgKCkge1xuICAgICAgY29uc3QgYSA9IHRoaXMuZGltZW5zaW9ucy5hY3RpdmF0b3JcbiAgICAgIGNvbnN0IGMgPSB0aGlzLmRpbWVuc2lvbnMuY29udGVudFxuICAgICAgY29uc3QgYWN0aXZhdG9yTGVmdCA9ICh0aGlzLmF0dGFjaCAhPT0gZmFsc2UgPyBhLm9mZnNldExlZnQgOiBhLmxlZnQpIHx8IDBcbiAgICAgIGNvbnN0IG1pbldpZHRoID0gTWF0aC5tYXgoYS53aWR0aCwgYy53aWR0aClcbiAgICAgIGxldCBsZWZ0ID0gMFxuICAgICAgbGVmdCArPSB0aGlzLmxlZnQgPyBhY3RpdmF0b3JMZWZ0IC0gKG1pbldpZHRoIC0gYS53aWR0aCkgOiBhY3RpdmF0b3JMZWZ0XG4gICAgICBpZiAodGhpcy5vZmZzZXRYKSB7XG4gICAgICAgIGNvbnN0IG1heFdpZHRoID0gaXNOYU4oTnVtYmVyKHRoaXMubWF4V2lkdGgpKVxuICAgICAgICAgID8gYS53aWR0aFxuICAgICAgICAgIDogTWF0aC5taW4oYS53aWR0aCwgTnVtYmVyKHRoaXMubWF4V2lkdGgpKVxuXG4gICAgICAgIGxlZnQgKz0gdGhpcy5sZWZ0ID8gLW1heFdpZHRoIDogYS53aWR0aFxuICAgICAgfVxuICAgICAgaWYgKHRoaXMubnVkZ2VMZWZ0KSBsZWZ0IC09IHBhcnNlSW50KHRoaXMubnVkZ2VMZWZ0KVxuICAgICAgaWYgKHRoaXMubnVkZ2VSaWdodCkgbGVmdCArPSBwYXJzZUludCh0aGlzLm51ZGdlUmlnaHQpXG5cbiAgICAgIHJldHVybiBsZWZ0XG4gICAgfSxcbiAgICBjb21wdXRlZFRvcCAoKSB7XG4gICAgICBjb25zdCBhID0gdGhpcy5kaW1lbnNpb25zLmFjdGl2YXRvclxuICAgICAgY29uc3QgYyA9IHRoaXMuZGltZW5zaW9ucy5jb250ZW50XG4gICAgICBsZXQgdG9wID0gMFxuXG4gICAgICBpZiAodGhpcy50b3ApIHRvcCArPSBhLmhlaWdodCAtIGMuaGVpZ2h0XG4gICAgICBpZiAodGhpcy5hdHRhY2ggIT09IGZhbHNlKSB0b3AgKz0gYS5vZmZzZXRUb3BcbiAgICAgIGVsc2UgdG9wICs9IGEudG9wICsgdGhpcy5wYWdlWU9mZnNldFxuICAgICAgaWYgKHRoaXMub2Zmc2V0WSkgdG9wICs9IHRoaXMudG9wID8gLWEuaGVpZ2h0IDogYS5oZWlnaHRcbiAgICAgIGlmICh0aGlzLm51ZGdlVG9wKSB0b3AgLT0gcGFyc2VJbnQodGhpcy5udWRnZVRvcClcbiAgICAgIGlmICh0aGlzLm51ZGdlQm90dG9tKSB0b3AgKz0gcGFyc2VJbnQodGhpcy5udWRnZUJvdHRvbSlcblxuICAgICAgcmV0dXJuIHRvcFxuICAgIH0sXG4gICAgaGFzQWN0aXZhdG9yICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiAhIXRoaXMuJHNsb3RzLmFjdGl2YXRvciB8fCAhIXRoaXMuJHNjb3BlZFNsb3RzLmFjdGl2YXRvciB8fCAhIXRoaXMuYWN0aXZhdG9yIHx8ICEhdGhpcy5pbnB1dEFjdGl2YXRvclxuICAgIH0sXG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICBkaXNhYmxlZCAodmFsKSB7XG4gICAgICB2YWwgJiYgdGhpcy5jYWxsRGVhY3RpdmF0ZSgpXG4gICAgfSxcbiAgICBpc0FjdGl2ZSAodmFsKSB7XG4gICAgICBpZiAodGhpcy5kaXNhYmxlZCkgcmV0dXJuXG5cbiAgICAgIHZhbCA/IHRoaXMuY2FsbEFjdGl2YXRlKCkgOiB0aGlzLmNhbGxEZWFjdGl2YXRlKClcbiAgICB9LFxuICAgIHBvc2l0aW9uWDogJ3VwZGF0ZURpbWVuc2lvbnMnLFxuICAgIHBvc2l0aW9uWTogJ3VwZGF0ZURpbWVuc2lvbnMnLFxuICB9LFxuXG4gIGJlZm9yZU1vdW50ICgpIHtcbiAgICB0aGlzLmhhc1dpbmRvdyA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGFic29sdXRlUG9zaXRpb24gKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgb2Zmc2V0VG9wOiAwLFxuICAgICAgICBvZmZzZXRMZWZ0OiAwLFxuICAgICAgICBzY3JvbGxIZWlnaHQ6IDAsXG4gICAgICAgIHRvcDogdGhpcy5wb3NpdGlvblkgfHwgdGhpcy5hYnNvbHV0ZVksXG4gICAgICAgIGJvdHRvbTogdGhpcy5wb3NpdGlvblkgfHwgdGhpcy5hYnNvbHV0ZVksXG4gICAgICAgIGxlZnQ6IHRoaXMucG9zaXRpb25YIHx8IHRoaXMuYWJzb2x1dGVYLFxuICAgICAgICByaWdodDogdGhpcy5wb3NpdGlvblggfHwgdGhpcy5hYnNvbHV0ZVgsXG4gICAgICAgIGhlaWdodDogMCxcbiAgICAgICAgd2lkdGg6IDAsXG4gICAgICB9XG4gICAgfSxcbiAgICBhY3RpdmF0ZSAoKSB7fSxcbiAgICBjYWxjTGVmdCAobWVudVdpZHRoOiBudW1iZXIpIHtcbiAgICAgIHJldHVybiBjb252ZXJ0VG9Vbml0KHRoaXMuYXR0YWNoICE9PSBmYWxzZVxuICAgICAgICA/IHRoaXMuY29tcHV0ZWRMZWZ0XG4gICAgICAgIDogdGhpcy5jYWxjWE92ZXJmbG93KHRoaXMuY29tcHV0ZWRMZWZ0LCBtZW51V2lkdGgpKVxuICAgIH0sXG4gICAgY2FsY1RvcCAoKSB7XG4gICAgICByZXR1cm4gY29udmVydFRvVW5pdCh0aGlzLmF0dGFjaCAhPT0gZmFsc2VcbiAgICAgICAgPyB0aGlzLmNvbXB1dGVkVG9wXG4gICAgICAgIDogdGhpcy5jYWxjWU92ZXJmbG93KHRoaXMuY29tcHV0ZWRUb3ApKVxuICAgIH0sXG4gICAgY2FsY1hPdmVyZmxvdyAobGVmdDogbnVtYmVyLCBtZW51V2lkdGg6IG51bWJlcikge1xuICAgICAgY29uc3QgeE92ZXJmbG93ID0gbGVmdCArIG1lbnVXaWR0aCAtIHRoaXMucGFnZVdpZHRoICsgMTJcblxuICAgICAgaWYgKCghdGhpcy5sZWZ0IHx8IHRoaXMucmlnaHQpICYmIHhPdmVyZmxvdyA+IDApIHtcbiAgICAgICAgbGVmdCA9IE1hdGgubWF4KGxlZnQgLSB4T3ZlcmZsb3csIDApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZWZ0ID0gTWF0aC5tYXgobGVmdCwgMTIpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBsZWZ0ICsgdGhpcy5nZXRPZmZzZXRMZWZ0KClcbiAgICB9LFxuICAgIGNhbGNZT3ZlcmZsb3cgKHRvcDogbnVtYmVyKSB7XG4gICAgICBjb25zdCBkb2N1bWVudEhlaWdodCA9IHRoaXMuZ2V0SW5uZXJIZWlnaHQoKVxuICAgICAgY29uc3QgdG9Ub3AgPSB0aGlzLnBhZ2VZT2Zmc2V0ICsgZG9jdW1lbnRIZWlnaHRcbiAgICAgIGNvbnN0IGFjdGl2YXRvciA9IHRoaXMuZGltZW5zaW9ucy5hY3RpdmF0b3JcbiAgICAgIGNvbnN0IGNvbnRlbnRIZWlnaHQgPSB0aGlzLmRpbWVuc2lvbnMuY29udGVudC5oZWlnaHRcbiAgICAgIGNvbnN0IHRvdGFsSGVpZ2h0ID0gdG9wICsgY29udGVudEhlaWdodFxuICAgICAgY29uc3QgaXNPdmVyZmxvd2luZyA9IHRvVG9wIDwgdG90YWxIZWlnaHRcblxuICAgICAgLy8gSWYgb3ZlcmZsb3dpbmcgYm90dG9tIGFuZCBvZmZzZXRcbiAgICAgIC8vIFRPRE86IHNldCAnYm90dG9tJyBwb3NpdGlvbiBpbnN0ZWFkIG9mICd0b3AnXG4gICAgICBpZiAoaXNPdmVyZmxvd2luZyAmJlxuICAgICAgICB0aGlzLm9mZnNldE92ZXJmbG93ICYmXG4gICAgICAgIC8vIElmIHdlIGRvbid0IGhhdmUgZW5vdWdoIHJvb20gdG8gb2Zmc2V0XG4gICAgICAgIC8vIHRoZSBvdmVyZmxvdywgZG9uJ3Qgb2Zmc2V0XG4gICAgICAgIGFjdGl2YXRvci50b3AgPiBjb250ZW50SGVpZ2h0XG4gICAgICApIHtcbiAgICAgICAgdG9wID0gdGhpcy5wYWdlWU9mZnNldCArIChhY3RpdmF0b3IudG9wIC0gY29udGVudEhlaWdodClcbiAgICAgIC8vIElmIG92ZXJmbG93aW5nIGJvdHRvbVxuICAgICAgfSBlbHNlIGlmIChpc092ZXJmbG93aW5nICYmICF0aGlzLmFsbG93T3ZlcmZsb3cpIHtcbiAgICAgICAgdG9wID0gdG9Ub3AgLSBjb250ZW50SGVpZ2h0IC0gMTJcbiAgICAgIC8vIElmIG92ZXJmbG93aW5nIHRvcFxuICAgICAgfSBlbHNlIGlmICh0b3AgPCB0aGlzLnBhZ2VZT2Zmc2V0ICYmICF0aGlzLmFsbG93T3ZlcmZsb3cpIHtcbiAgICAgICAgdG9wID0gdGhpcy5wYWdlWU9mZnNldCArIDEyXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0b3AgPCAxMiA/IDEyIDogdG9wXG4gICAgfSxcbiAgICBjYWxsQWN0aXZhdGUgKCkge1xuICAgICAgaWYgKCF0aGlzLmhhc1dpbmRvdykgcmV0dXJuXG5cbiAgICAgIHRoaXMuYWN0aXZhdGUoKVxuICAgIH0sXG4gICAgY2FsbERlYWN0aXZhdGUgKCkge1xuICAgICAgdGhpcy5pc0NvbnRlbnRBY3RpdmUgPSBmYWxzZVxuXG4gICAgICB0aGlzLmRlYWN0aXZhdGUoKVxuICAgIH0sXG4gICAgY2hlY2tGb3JQYWdlWU9mZnNldCAoKSB7XG4gICAgICBpZiAodGhpcy5oYXNXaW5kb3cpIHtcbiAgICAgICAgdGhpcy5wYWdlWU9mZnNldCA9IHRoaXMuYWN0aXZhdG9yRml4ZWQgPyAwIDogdGhpcy5nZXRPZmZzZXRUb3AoKVxuICAgICAgfVxuICAgIH0sXG4gICAgY2hlY2tBY3RpdmF0b3JGaXhlZCAoKSB7XG4gICAgICBpZiAodGhpcy5hdHRhY2ggIT09IGZhbHNlKSByZXR1cm5cbiAgICAgIGxldCBlbCA9IHRoaXMuZ2V0QWN0aXZhdG9yKClcbiAgICAgIHdoaWxlIChlbCkge1xuICAgICAgICBpZiAod2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpLnBvc2l0aW9uID09PSAnZml4ZWQnKSB7XG4gICAgICAgICAgdGhpcy5hY3RpdmF0b3JGaXhlZCA9IHRydWVcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBlbCA9IGVsLm9mZnNldFBhcmVudCBhcyBIVE1MRWxlbWVudFxuICAgICAgfVxuICAgICAgdGhpcy5hY3RpdmF0b3JGaXhlZCA9IGZhbHNlXG4gICAgfSxcbiAgICBkZWFjdGl2YXRlICgpIHt9LFxuICAgIGdlbkFjdGl2YXRvckxpc3RlbmVycyAoKSB7XG4gICAgICBjb25zdCBsaXN0ZW5lcnMgPSBBY3RpdmF0YWJsZS5vcHRpb25zLm1ldGhvZHMuZ2VuQWN0aXZhdG9yTGlzdGVuZXJzLmNhbGwodGhpcylcblxuICAgICAgY29uc3Qgb25DbGljayA9IGxpc3RlbmVycy5jbGlja1xuXG4gICAgICBsaXN0ZW5lcnMuY2xpY2sgPSAoZTogTW91c2VFdmVudCAmIEtleWJvYXJkRXZlbnQgJiBGb2N1c0V2ZW50KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLm9wZW5PbkNsaWNrKSB7XG4gICAgICAgICAgb25DbGljayAmJiBvbkNsaWNrKGUpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFic29sdXRlWCA9IGUuY2xpZW50WFxuICAgICAgICB0aGlzLmFic29sdXRlWSA9IGUuY2xpZW50WVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbGlzdGVuZXJzXG4gICAgfSxcbiAgICBnZXRJbm5lckhlaWdodCAoKSB7XG4gICAgICBpZiAoIXRoaXMuaGFzV2luZG93KSByZXR1cm4gMFxuXG4gICAgICByZXR1cm4gd2luZG93LmlubmVySGVpZ2h0IHx8XG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHRcbiAgICB9LFxuICAgIGdldE9mZnNldExlZnQgKCkge1xuICAgICAgaWYgKCF0aGlzLmhhc1dpbmRvdykgcmV0dXJuIDBcblxuICAgICAgcmV0dXJuIHdpbmRvdy5wYWdlWE9mZnNldCB8fFxuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdFxuICAgIH0sXG4gICAgZ2V0T2Zmc2V0VG9wICgpIHtcbiAgICAgIGlmICghdGhpcy5oYXNXaW5kb3cpIHJldHVybiAwXG5cbiAgICAgIHJldHVybiB3aW5kb3cucGFnZVlPZmZzZXQgfHxcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcFxuICAgIH0sXG4gICAgZ2V0Um91bmRlZEJvdW5kZWRDbGllbnRSZWN0IChlbDogRWxlbWVudCkge1xuICAgICAgY29uc3QgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICByZXR1cm4ge1xuICAgICAgICB0b3A6IE1hdGgucm91bmQocmVjdC50b3ApLFxuICAgICAgICBsZWZ0OiBNYXRoLnJvdW5kKHJlY3QubGVmdCksXG4gICAgICAgIGJvdHRvbTogTWF0aC5yb3VuZChyZWN0LmJvdHRvbSksXG4gICAgICAgIHJpZ2h0OiBNYXRoLnJvdW5kKHJlY3QucmlnaHQpLFxuICAgICAgICB3aWR0aDogTWF0aC5yb3VuZChyZWN0LndpZHRoKSxcbiAgICAgICAgaGVpZ2h0OiBNYXRoLnJvdW5kKHJlY3QuaGVpZ2h0KSxcbiAgICAgIH1cbiAgICB9LFxuICAgIG1lYXN1cmUgKGVsOiBIVE1MRWxlbWVudCkge1xuICAgICAgaWYgKCFlbCB8fCAhdGhpcy5oYXNXaW5kb3cpIHJldHVybiBudWxsXG5cbiAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLmdldFJvdW5kZWRCb3VuZGVkQ2xpZW50UmVjdChlbClcblxuICAgICAgLy8gQWNjb3VudCBmb3IgYWN0aXZhdG9yIG1hcmdpblxuICAgICAgaWYgKHRoaXMuYXR0YWNoICE9PSBmYWxzZSkge1xuICAgICAgICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKVxuXG4gICAgICAgIHJlY3QubGVmdCA9IHBhcnNlSW50KHN0eWxlLm1hcmdpbkxlZnQhKVxuICAgICAgICByZWN0LnRvcCA9IHBhcnNlSW50KHN0eWxlLm1hcmdpblRvcCEpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZWN0XG4gICAgfSxcbiAgICBzbmVha1BlZWsgKGNiOiAoKSA9PiB2b2lkKSB7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICBjb25zdCBlbCA9IHRoaXMuJHJlZnMuY29udGVudFxuXG4gICAgICAgIGlmICghZWwgfHwgZWwuc3R5bGUuZGlzcGxheSAhPT0gJ25vbmUnKSB7XG4gICAgICAgICAgY2IoKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUtYmxvY2snXG4gICAgICAgIGNiKClcbiAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgfSlcbiAgICB9LFxuICAgIHN0YXJ0VHJhbnNpdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4ocmVzb2x2ZSA9PiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICB0aGlzLmlzQ29udGVudEFjdGl2ZSA9IHRoaXMuaGFzSnVzdEZvY3VzZWQgPSB0aGlzLmlzQWN0aXZlXG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgfSkpXG4gICAgfSxcbiAgICB1cGRhdGVEaW1lbnNpb25zICgpIHtcbiAgICAgIHRoaXMuaGFzV2luZG93ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgIHRoaXMuY2hlY2tBY3RpdmF0b3JGaXhlZCgpXG4gICAgICB0aGlzLmNoZWNrRm9yUGFnZVlPZmZzZXQoKVxuICAgICAgdGhpcy5wYWdlV2lkdGggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGhcblxuICAgICAgY29uc3QgZGltZW5zaW9uczogYW55ID0ge1xuICAgICAgICBhY3RpdmF0b3I6IHsgLi4udGhpcy5kaW1lbnNpb25zLmFjdGl2YXRvciB9LFxuICAgICAgICBjb250ZW50OiB7IC4uLnRoaXMuZGltZW5zaW9ucy5jb250ZW50IH0sXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdGl2YXRvciBzaG91bGQgYWxyZWFkeSBiZSBzaG93blxuICAgICAgaWYgKCF0aGlzLmhhc0FjdGl2YXRvciB8fCB0aGlzLmFic29sdXRlKSB7XG4gICAgICAgIGRpbWVuc2lvbnMuYWN0aXZhdG9yID0gdGhpcy5hYnNvbHV0ZVBvc2l0aW9uKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGFjdGl2YXRvciA9IHRoaXMuZ2V0QWN0aXZhdG9yKClcbiAgICAgICAgaWYgKCFhY3RpdmF0b3IpIHJldHVyblxuXG4gICAgICAgIGRpbWVuc2lvbnMuYWN0aXZhdG9yID0gdGhpcy5tZWFzdXJlKGFjdGl2YXRvcilcbiAgICAgICAgZGltZW5zaW9ucy5hY3RpdmF0b3Iub2Zmc2V0TGVmdCA9IGFjdGl2YXRvci5vZmZzZXRMZWZ0XG4gICAgICAgIGlmICh0aGlzLmF0dGFjaCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAvLyBhY2NvdW50IGZvciBjc3MgcGFkZGluZyBjYXVzaW5nIHRoaW5ncyB0byBub3QgbGluZSB1cFxuICAgICAgICAgIC8vIHRoaXMgaXMgbW9zdGx5IGZvciB2LWF1dG9jb21wbGV0ZSwgaG9wZWZ1bGx5IGl0IHdvbid0IGJyZWFrIGFueXRoaW5nXG4gICAgICAgICAgZGltZW5zaW9ucy5hY3RpdmF0b3Iub2Zmc2V0VG9wID0gYWN0aXZhdG9yLm9mZnNldFRvcFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRpbWVuc2lvbnMuYWN0aXZhdG9yLm9mZnNldFRvcCA9IDBcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBEaXNwbGF5IGFuZCBoaWRlIHRvIGdldCBkaW1lbnNpb25zXG4gICAgICB0aGlzLnNuZWFrUGVlaygoKSA9PiB7XG4gICAgICAgIHRoaXMuJHJlZnMuY29udGVudCAmJiAoZGltZW5zaW9ucy5jb250ZW50ID0gdGhpcy5tZWFzdXJlKHRoaXMuJHJlZnMuY29udGVudCkpXG5cbiAgICAgICAgdGhpcy5kaW1lbnNpb25zID0gZGltZW5zaW9uc1xuICAgICAgfSlcbiAgICB9LFxuICB9LFxufSlcbiJdfQ==