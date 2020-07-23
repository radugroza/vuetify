import './VProgressLinear.sass';
// Components
import { VFadeTransition, VSlideXTransition, } from '../transitions';
// Mixins
import Colorable from '../../mixins/colorable';
import { factory as PositionableFactory } from '../../mixins/positionable';
import Proxyable from '../../mixins/proxyable';
import Themeable from '../../mixins/themeable';
// Utilities
import { convertToUnit, getSlot } from '../../util/helpers';
import mixins from '../../util/mixins';
const baseMixins = mixins(Colorable, PositionableFactory(['absolute', 'fixed', 'top', 'bottom']), Proxyable, Themeable);
/* @vue/component */
export default baseMixins.extend({
    name: 'v-progress-linear',
    props: {
        active: {
            type: Boolean,
            default: true,
        },
        backgroundColor: {
            type: String,
            default: null,
        },
        backgroundOpacity: {
            type: [Number, String],
            default: null,
        },
        bufferValue: {
            type: [Number, String],
            default: 100,
        },
        color: {
            type: String,
            default: 'primary',
        },
        height: {
            type: [Number, String],
            default: 4,
        },
        indeterminate: Boolean,
        query: Boolean,
        reverse: Boolean,
        rounded: Boolean,
        stream: Boolean,
        striped: Boolean,
        value: {
            type: [Number, String],
            default: 0,
        },
    },
    data() {
        return {
            internalLazyValue: this.value || 0,
        };
    },
    computed: {
        __cachedBackground() {
            return this.$createElement('div', this.setBackgroundColor(this.backgroundColor || this.color, {
                staticClass: 'v-progress-linear__background',
                style: this.backgroundStyle,
            }));
        },
        __cachedBar() {
            return this.$createElement(this.computedTransition, [this.__cachedBarType]);
        },
        __cachedBarType() {
            return this.indeterminate ? this.__cachedIndeterminate : this.__cachedDeterminate;
        },
        __cachedBuffer() {
            return this.$createElement('div', {
                staticClass: 'v-progress-linear__buffer',
                style: this.styles,
            });
        },
        __cachedDeterminate() {
            return this.$createElement('div', this.setBackgroundColor(this.color, {
                staticClass: `v-progress-linear__determinate`,
                style: {
                    width: convertToUnit(this.normalizedValue, '%'),
                },
            }));
        },
        __cachedIndeterminate() {
            return this.$createElement('div', {
                staticClass: 'v-progress-linear__indeterminate',
                class: {
                    'v-progress-linear__indeterminate--active': this.active,
                },
            }, [
                this.genProgressBar('long'),
                this.genProgressBar('short'),
            ]);
        },
        __cachedStream() {
            if (!this.stream)
                return null;
            return this.$createElement('div', this.setTextColor(this.color, {
                staticClass: 'v-progress-linear__stream',
                style: {
                    width: convertToUnit(100 - this.normalizedBuffer, '%'),
                },
            }));
        },
        backgroundStyle() {
            const backgroundOpacity = this.backgroundOpacity == null
                ? (this.backgroundColor ? 1 : 0.3)
                : parseFloat(this.backgroundOpacity);
            return {
                opacity: backgroundOpacity,
                [this.isReversed ? 'right' : 'left']: convertToUnit(this.normalizedValue, '%'),
                width: convertToUnit(this.normalizedBuffer - this.normalizedValue, '%'),
            };
        },
        classes() {
            return {
                'v-progress-linear--absolute': this.absolute,
                'v-progress-linear--fixed': this.fixed,
                'v-progress-linear--query': this.query,
                'v-progress-linear--reactive': this.reactive,
                'v-progress-linear--reverse': this.isReversed,
                'v-progress-linear--rounded': this.rounded,
                'v-progress-linear--striped': this.striped,
                ...this.themeClasses,
            };
        },
        computedTransition() {
            return this.indeterminate ? VFadeTransition : VSlideXTransition;
        },
        isReversed() {
            return this.$vuetify.rtl !== this.reverse;
        },
        normalizedBuffer() {
            return this.normalize(this.bufferValue);
        },
        normalizedValue() {
            return this.normalize(this.internalLazyValue);
        },
        reactive() {
            return Boolean(this.$listeners.change);
        },
        styles() {
            const styles = {};
            if (!this.active) {
                styles.height = 0;
            }
            if (!this.indeterminate && parseFloat(this.normalizedBuffer) !== 100) {
                styles.width = convertToUnit(this.normalizedBuffer, '%');
            }
            return styles;
        },
    },
    methods: {
        genContent() {
            const slot = getSlot(this, 'default', { value: this.internalLazyValue });
            if (!slot)
                return null;
            return this.$createElement('div', {
                staticClass: 'v-progress-linear__content',
            }, slot);
        },
        genListeners() {
            const listeners = this.$listeners;
            if (this.reactive) {
                listeners.click = this.onClick;
            }
            return listeners;
        },
        genProgressBar(name) {
            return this.$createElement('div', this.setBackgroundColor(this.color, {
                staticClass: 'v-progress-linear__indeterminate',
                class: {
                    [name]: true,
                },
            }));
        },
        onClick(e) {
            if (!this.reactive)
                return;
            const { width } = this.$el.getBoundingClientRect();
            this.internalValue = e.offsetX / width * 100;
        },
        normalize(value) {
            if (value < 0)
                return 0;
            if (value > 100)
                return 100;
            return parseFloat(value);
        },
    },
    render(h) {
        const data = {
            staticClass: 'v-progress-linear',
            attrs: {
                role: 'progressbar',
                'aria-valuemin': 0,
                'aria-valuemax': this.normalizedBuffer,
                'aria-valuenow': this.indeterminate ? undefined : this.normalizedValue,
            },
            class: this.classes,
            style: {
                bottom: this.bottom ? 0 : undefined,
                height: this.active ? convertToUnit(this.height) : 0,
                top: this.top ? 0 : undefined,
            },
            on: this.genListeners(),
        };
        return h('div', data, [
            this.__cachedStream,
            this.__cachedBackground,
            this.__cachedBuffer,
            this.__cachedBar,
            this.genContent(),
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlByb2dyZXNzTGluZWFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVlByb2dyZXNzTGluZWFyL1ZQcm9ncmVzc0xpbmVhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLHdCQUF3QixDQUFBO0FBRS9CLGFBQWE7QUFDYixPQUFPLEVBQ0wsZUFBZSxFQUNmLGlCQUFpQixHQUNsQixNQUFNLGdCQUFnQixDQUFBO0FBRXZCLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLEVBQUUsT0FBTyxJQUFJLG1CQUFtQixFQUFFLE1BQU0sMkJBQTJCLENBQUE7QUFDMUUsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFFOUMsWUFBWTtBQUNaLE9BQU8sRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFDM0QsT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFNdEMsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUN2QixTQUFTLEVBQ1QsbUJBQW1CLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUMzRCxTQUFTLEVBQ1QsU0FBUyxDQUNWLENBQUE7QUFFRCxvQkFBb0I7QUFDcEIsZUFBZSxVQUFVLENBQUMsTUFBTSxDQUFDO0lBQy9CLElBQUksRUFBRSxtQkFBbUI7SUFFekIsS0FBSyxFQUFFO1FBQ0wsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLE9BQU87WUFDYixPQUFPLEVBQUUsSUFBSTtTQUNkO1FBQ0QsZUFBZSxFQUFFO1lBQ2YsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsSUFBSTtTQUNkO1FBQ0QsaUJBQWlCLEVBQUU7WUFDakIsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN0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LElBQUksQ0FBQyxnQkFBZ0I7Z0JBQ3RDLGVBQWUsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlO2FBQ3ZFO1lBQ0QsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ25CLEtBQUssRUFBRTtnQkFDTCxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO2dCQUNuQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEQsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUzthQUM5QjtZQUNELEVBQUUsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFO1NBQ3hCLENBQUE7UUFFRCxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFO1lBQ3BCLElBQUksQ0FBQyxjQUFjO1lBQ25CLElBQUksQ0FBQyxrQkFBa0I7WUFDdkIsSUFBSSxDQUFDLGNBQWM7WUFDbkIsSUFBSSxDQUFDLFdBQVc7WUFDaEIsSUFBSSxDQUFDLFVBQVUsRUFBRTtTQUNsQixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuL1ZQcm9ncmVzc0xpbmVhci5zYXNzJ1xuXG4vLyBDb21wb25lbnRzXG5pbXBvcnQge1xuICBWRmFkZVRyYW5zaXRpb24sXG4gIFZTbGlkZVhUcmFuc2l0aW9uLFxufSBmcm9tICcuLi90cmFuc2l0aW9ucydcblxuLy8gTWl4aW5zXG5pbXBvcnQgQ29sb3JhYmxlIGZyb20gJy4uLy4uL21peGlucy9jb2xvcmFibGUnXG5pbXBvcnQgeyBmYWN0b3J5IGFzIFBvc2l0aW9uYWJsZUZhY3RvcnkgfSBmcm9tICcuLi8uLi9taXhpbnMvcG9zaXRpb25hYmxlJ1xuaW1wb3J0IFByb3h5YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvcHJveHlhYmxlJ1xuaW1wb3J0IFRoZW1lYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdGhlbWVhYmxlJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCB7IGNvbnZlcnRUb1VuaXQsIGdldFNsb3QgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgRnVuY3Rpb25hbENvbXBvbmVudE9wdGlvbnMgfSBmcm9tICd2dWUvdHlwZXMnXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgYmFzZU1peGlucyA9IG1peGlucyhcbiAgQ29sb3JhYmxlLFxuICBQb3NpdGlvbmFibGVGYWN0b3J5KFsnYWJzb2x1dGUnLCAnZml4ZWQnLCAndG9wJywgJ2JvdHRvbSddKSxcbiAgUHJveHlhYmxlLFxuICBUaGVtZWFibGVcbilcblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IGJhc2VNaXhpbnMuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtcHJvZ3Jlc3MtbGluZWFyJyxcblxuICBwcm9wczoge1xuICAgIGFjdGl2ZToge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgfSxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgfSxcbiAgICBiYWNrZ3JvdW5kT3BhY2l0eToge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgfSxcbiAgICBidWZmZXJWYWx1ZToge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6IDEwMCxcbiAgICB9LFxuICAgIGNvbG9yOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAncHJpbWFyeScsXG4gICAgfSxcbiAgICBoZWlnaHQ6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiA0LFxuICAgIH0sXG4gICAgaW5kZXRlcm1pbmF0ZTogQm9vbGVhbixcbiAgICBxdWVyeTogQm9vbGVhbixcbiAgICByZXZlcnNlOiBCb29sZWFuLFxuICAgIHJvdW5kZWQ6IEJvb2xlYW4sXG4gICAgc3RyZWFtOiBCb29sZWFuLFxuICAgIHN0cmlwZWQ6IEJvb2xlYW4sXG4gICAgdmFsdWU6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gIH0sXG5cbiAgZGF0YSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGludGVybmFsTGF6eVZhbHVlOiB0aGlzLnZhbHVlIHx8IDAsXG4gICAgfVxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgX19jYWNoZWRCYWNrZ3JvdW5kICgpOiBWTm9kZSB7XG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2JywgdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IodGhpcy5iYWNrZ3JvdW5kQ29sb3IgfHwgdGhpcy5jb2xvciwge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3YtcHJvZ3Jlc3MtbGluZWFyX19iYWNrZ3JvdW5kJyxcbiAgICAgICAgc3R5bGU6IHRoaXMuYmFja2dyb3VuZFN0eWxlLFxuICAgICAgfSkpXG4gICAgfSxcbiAgICBfX2NhY2hlZEJhciAoKTogVk5vZGUge1xuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQodGhpcy5jb21wdXRlZFRyYW5zaXRpb24sIFt0aGlzLl9fY2FjaGVkQmFyVHlwZV0pXG4gICAgfSxcbiAgICBfX2NhY2hlZEJhclR5cGUgKCk6IFZOb2RlIHtcbiAgICAgIHJldHVybiB0aGlzLmluZGV0ZXJtaW5hdGUgPyB0aGlzLl9fY2FjaGVkSW5kZXRlcm1pbmF0ZSA6IHRoaXMuX19jYWNoZWREZXRlcm1pbmF0ZVxuICAgIH0sXG4gICAgX19jYWNoZWRCdWZmZXIgKCk6IFZOb2RlIHtcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1wcm9ncmVzcy1saW5lYXJfX2J1ZmZlcicsXG4gICAgICAgIHN0eWxlOiB0aGlzLnN0eWxlcyxcbiAgICAgIH0pXG4gICAgfSxcbiAgICBfX2NhY2hlZERldGVybWluYXRlICgpOiBWTm9kZSB7XG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2JywgdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IodGhpcy5jb2xvciwge1xuICAgICAgICBzdGF0aWNDbGFzczogYHYtcHJvZ3Jlc3MtbGluZWFyX19kZXRlcm1pbmF0ZWAsXG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgd2lkdGg6IGNvbnZlcnRUb1VuaXQodGhpcy5ub3JtYWxpemVkVmFsdWUsICclJyksXG4gICAgICAgIH0sXG4gICAgICB9KSlcbiAgICB9LFxuICAgIF9fY2FjaGVkSW5kZXRlcm1pbmF0ZSAoKTogVk5vZGUge1xuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LXByb2dyZXNzLWxpbmVhcl9faW5kZXRlcm1pbmF0ZScsXG4gICAgICAgIGNsYXNzOiB7XG4gICAgICAgICAgJ3YtcHJvZ3Jlc3MtbGluZWFyX19pbmRldGVybWluYXRlLS1hY3RpdmUnOiB0aGlzLmFjdGl2ZSxcbiAgICAgICAgfSxcbiAgICAgIH0sIFtcbiAgICAgICAgdGhpcy5nZW5Qcm9ncmVzc0JhcignbG9uZycpLFxuICAgICAgICB0aGlzLmdlblByb2dyZXNzQmFyKCdzaG9ydCcpLFxuICAgICAgXSlcbiAgICB9LFxuICAgIF9fY2FjaGVkU3RyZWFtICgpOiBWTm9kZSB8IG51bGwge1xuICAgICAgaWYgKCF0aGlzLnN0cmVhbSkgcmV0dXJuIG51bGxcblxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHRoaXMuc2V0VGV4dENvbG9yKHRoaXMuY29sb3IsIHtcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LXByb2dyZXNzLWxpbmVhcl9fc3RyZWFtJyxcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICB3aWR0aDogY29udmVydFRvVW5pdCgxMDAgLSB0aGlzLm5vcm1hbGl6ZWRCdWZmZXIsICclJyksXG4gICAgICAgIH0sXG4gICAgICB9KSlcbiAgICB9LFxuICAgIGJhY2tncm91bmRTdHlsZSAoKTogb2JqZWN0IHtcbiAgICAgIGNvbnN0IGJhY2tncm91bmRPcGFjaXR5ID0gdGhpcy5iYWNrZ3JvdW5kT3BhY2l0eSA9PSBudWxsXG4gICAgICAgID8gKHRoaXMuYmFja2dyb3VuZENvbG9yID8gMSA6IDAuMylcbiAgICAgICAgOiBwYXJzZUZsb2F0KHRoaXMuYmFja2dyb3VuZE9wYWNpdHkpXG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIG9wYWNpdHk6IGJhY2tncm91bmRPcGFjaXR5LFxuICAgICAgICBbdGhpcy5pc1JldmVyc2VkID8gJ3JpZ2h0JyA6ICdsZWZ0J106IGNvbnZlcnRUb1VuaXQodGhpcy5ub3JtYWxpemVkVmFsdWUsICclJyksXG4gICAgICAgIHdpZHRoOiBjb252ZXJ0VG9Vbml0KHRoaXMubm9ybWFsaXplZEJ1ZmZlciAtIHRoaXMubm9ybWFsaXplZFZhbHVlLCAnJScpLFxuICAgICAgfVxuICAgIH0sXG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICd2LXByb2dyZXNzLWxpbmVhci0tYWJzb2x1dGUnOiB0aGlzLmFic29sdXRlLFxuICAgICAgICAndi1wcm9ncmVzcy1saW5lYXItLWZpeGVkJzogdGhpcy5maXhlZCxcbiAgICAgICAgJ3YtcHJvZ3Jlc3MtbGluZWFyLS1xdWVyeSc6IHRoaXMucXVlcnksXG4gICAgICAgICd2LXByb2dyZXNzLWxpbmVhci0tcmVhY3RpdmUnOiB0aGlzLnJlYWN0aXZlLFxuICAgICAgICAndi1wcm9ncmVzcy1saW5lYXItLXJldmVyc2UnOiB0aGlzLmlzUmV2ZXJzZWQsXG4gICAgICAgICd2LXByb2dyZXNzLWxpbmVhci0tcm91bmRlZCc6IHRoaXMucm91bmRlZCxcbiAgICAgICAgJ3YtcHJvZ3Jlc3MtbGluZWFyLS1zdHJpcGVkJzogdGhpcy5zdHJpcGVkLFxuICAgICAgICAuLi50aGlzLnRoZW1lQ2xhc3NlcyxcbiAgICAgIH1cbiAgICB9LFxuICAgIGNvbXB1dGVkVHJhbnNpdGlvbiAoKTogRnVuY3Rpb25hbENvbXBvbmVudE9wdGlvbnMge1xuICAgICAgcmV0dXJuIHRoaXMuaW5kZXRlcm1pbmF0ZSA/IFZGYWRlVHJhbnNpdGlvbiA6IFZTbGlkZVhUcmFuc2l0aW9uXG4gICAgfSxcbiAgICBpc1JldmVyc2VkICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLiR2dWV0aWZ5LnJ0bCAhPT0gdGhpcy5yZXZlcnNlXG4gICAgfSxcbiAgICBub3JtYWxpemVkQnVmZmVyICgpOiBudW1iZXIge1xuICAgICAgcmV0dXJuIHRoaXMubm9ybWFsaXplKHRoaXMuYnVmZmVyVmFsdWUpXG4gICAgfSxcbiAgICBub3JtYWxpemVkVmFsdWUgKCk6IG51bWJlciB7XG4gICAgICByZXR1cm4gdGhpcy5ub3JtYWxpemUodGhpcy5pbnRlcm5hbExhenlWYWx1ZSlcbiAgICB9LFxuICAgIHJlYWN0aXZlICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiBCb29sZWFuKHRoaXMuJGxpc3RlbmVycy5jaGFuZ2UpXG4gICAgfSxcbiAgICBzdHlsZXMgKCk6IG9iamVjdCB7XG4gICAgICBjb25zdCBzdHlsZXM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fVxuXG4gICAgICBpZiAoIXRoaXMuYWN0aXZlKSB7XG4gICAgICAgIHN0eWxlcy5oZWlnaHQgPSAwXG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5pbmRldGVybWluYXRlICYmIHBhcnNlRmxvYXQodGhpcy5ub3JtYWxpemVkQnVmZmVyKSAhPT0gMTAwKSB7XG4gICAgICAgIHN0eWxlcy53aWR0aCA9IGNvbnZlcnRUb1VuaXQodGhpcy5ub3JtYWxpemVkQnVmZmVyLCAnJScpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdHlsZXNcbiAgICB9LFxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBnZW5Db250ZW50ICgpIHtcbiAgICAgIGNvbnN0IHNsb3QgPSBnZXRTbG90KHRoaXMsICdkZWZhdWx0JywgeyB2YWx1ZTogdGhpcy5pbnRlcm5hbExhenlWYWx1ZSB9KVxuXG4gICAgICBpZiAoIXNsb3QpIHJldHVybiBudWxsXG5cbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1wcm9ncmVzcy1saW5lYXJfX2NvbnRlbnQnLFxuICAgICAgfSwgc2xvdClcbiAgICB9LFxuICAgIGdlbkxpc3RlbmVycyAoKSB7XG4gICAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLiRsaXN0ZW5lcnNcblxuICAgICAgaWYgKHRoaXMucmVhY3RpdmUpIHtcbiAgICAgICAgbGlzdGVuZXJzLmNsaWNrID0gdGhpcy5vbkNsaWNrXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBsaXN0ZW5lcnNcbiAgICB9LFxuICAgIGdlblByb2dyZXNzQmFyIChuYW1lOiAnbG9uZycgfCAnc2hvcnQnKSB7XG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2JywgdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IodGhpcy5jb2xvciwge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3YtcHJvZ3Jlc3MtbGluZWFyX19pbmRldGVybWluYXRlJyxcbiAgICAgICAgY2xhc3M6IHtcbiAgICAgICAgICBbbmFtZV06IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9KSlcbiAgICB9LFxuICAgIG9uQ2xpY2sgKGU6IE1vdXNlRXZlbnQpIHtcbiAgICAgIGlmICghdGhpcy5yZWFjdGl2ZSkgcmV0dXJuXG5cbiAgICAgIGNvbnN0IHsgd2lkdGggfSA9IHRoaXMuJGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgICAgIHRoaXMuaW50ZXJuYWxWYWx1ZSA9IGUub2Zmc2V0WCAvIHdpZHRoICogMTAwXG4gICAgfSxcbiAgICBub3JtYWxpemUgKHZhbHVlOiBzdHJpbmcgfCBudW1iZXIpIHtcbiAgICAgIGlmICh2YWx1ZSA8IDApIHJldHVybiAwXG4gICAgICBpZiAodmFsdWUgPiAxMDApIHJldHVybiAxMDBcbiAgICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlKVxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyIChoKTogVk5vZGUge1xuICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICBzdGF0aWNDbGFzczogJ3YtcHJvZ3Jlc3MtbGluZWFyJyxcbiAgICAgIGF0dHJzOiB7XG4gICAgICAgIHJvbGU6ICdwcm9ncmVzc2JhcicsXG4gICAgICAgICdhcmlhLXZhbHVlbWluJzogMCxcbiAgICAgICAgJ2FyaWEtdmFsdWVtYXgnOiB0aGlzLm5vcm1hbGl6ZWRCdWZmZXIsXG4gICAgICAgICdhcmlhLXZhbHVlbm93JzogdGhpcy5pbmRldGVybWluYXRlID8gdW5kZWZpbmVkIDogdGhpcy5ub3JtYWxpemVkVmFsdWUsXG4gICAgICB9LFxuICAgICAgY2xhc3M6IHRoaXMuY2xhc3NlcyxcbiAgICAgIHN0eWxlOiB7XG4gICAgICAgIGJvdHRvbTogdGhpcy5ib3R0b20gPyAwIDogdW5kZWZpbmVkLFxuICAgICAgICBoZWlnaHQ6IHRoaXMuYWN0aXZlID8gY29udmVydFRvVW5pdCh0aGlzLmhlaWdodCkgOiAwLFxuICAgICAgICB0b3A6IHRoaXMudG9wID8gMCA6IHVuZGVmaW5lZCxcbiAgICAgIH0sXG4gICAgICBvbjogdGhpcy5nZW5MaXN0ZW5lcnMoKSxcbiAgICB9XG5cbiAgICByZXR1cm4gaCgnZGl2JywgZGF0YSwgW1xuICAgICAgdGhpcy5fX2NhY2hlZFN0cmVhbSxcbiAgICAgIHRoaXMuX19jYWNoZWRCYWNrZ3JvdW5kLFxuICAgICAgdGhpcy5fX2NhY2hlZEJ1ZmZlcixcbiAgICAgIHRoaXMuX19jYWNoZWRCYXIsXG4gICAgICB0aGlzLmdlbkNvbnRlbnQoKSxcbiAgICBdKVxuICB9LFxufSlcbiJdfQ==