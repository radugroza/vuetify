// Styles
import './VProgressCircular.sass';
// Mixins
import Colorable from '../../mixins/colorable';
// Utils
import { convertToUnit } from '../../util/helpers';
/* @vue/component */
export default Colorable.extend({
    name: 'v-progress-circular',
    props: {
        button: Boolean,
        indeterminate: Boolean,
        rotate: {
            type: [Number, String],
            default: 0,
        },
        size: {
            type: [Number, String],
            default: 32,
        },
        width: {
            type: [Number, String],
            default: 4,
        },
        value: {
            type: [Number, String],
            default: 0,
        },
    },
    data: () => ({
        radius: 20,
    }),
    computed: {
        calculatedSize() {
            return Number(this.size) + (this.button ? 8 : 0);
        },
        circumference() {
            return 2 * Math.PI * this.radius;
        },
        classes() {
            return {
                'v-progress-circular--indeterminate': this.indeterminate,
                'v-progress-circular--button': this.button,
            };
        },
        normalizedValue() {
            if (this.value < 0) {
                return 0;
            }
            if (this.value > 100) {
                return 100;
            }
            return parseFloat(this.value);
        },
        strokeDashArray() {
            return Math.round(this.circumference * 1000) / 1000;
        },
        strokeDashOffset() {
            return ((100 - this.normalizedValue) / 100) * this.circumference + 'px';
        },
        strokeWidth() {
            return Number(this.width) / +this.size * this.viewBoxSize * 2;
        },
        styles() {
            return {
                height: convertToUnit(this.calculatedSize),
                width: convertToUnit(this.calculatedSize),
            };
        },
        svgStyles() {
            return {
                transform: `rotate(${Number(this.rotate)}deg)`,
            };
        },
        viewBoxSize() {
            return this.radius / (1 - Number(this.width) / +this.size);
        },
    },
    methods: {
        genCircle(name, offset) {
            return this.$createElement('circle', {
                class: `v-progress-circular__${name}`,
                attrs: {
                    fill: 'transparent',
                    cx: 2 * this.viewBoxSize,
                    cy: 2 * this.viewBoxSize,
                    r: this.radius,
                    'stroke-width': this.strokeWidth,
                    'stroke-dasharray': this.strokeDashArray,
                    'stroke-dashoffset': offset,
                },
            });
        },
        genSvg() {
            const children = [
                this.indeterminate || this.genCircle('underlay', 0),
                this.genCircle('overlay', this.strokeDashOffset),
            ];
            return this.$createElement('svg', {
                style: this.svgStyles,
                attrs: {
                    xmlns: 'http://www.w3.org/2000/svg',
                    viewBox: `${this.viewBoxSize} ${this.viewBoxSize} ${2 * this.viewBoxSize} ${2 * this.viewBoxSize}`,
                },
            }, children);
        },
        genInfo() {
            return this.$createElement('div', {
                staticClass: 'v-progress-circular__info',
            }, this.$slots.default);
        },
    },
    render(h) {
        return h('div', this.setTextColor(this.color, {
            staticClass: 'v-progress-circular',
            attrs: {
                role: 'progressbar',
                'aria-valuemin': 0,
                'aria-valuemax': 100,
                'aria-valuenow': this.indeterminate ? undefined : this.normalizedValue,
            },
            class: this.classes,
            style: this.styles,
            on: this.$listeners,
        }), [
            this.genSvg(),
            this.genInfo(),
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlByb2dyZXNzQ2lyY3VsYXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WUHJvZ3Jlc3NDaXJjdWxhci9WUHJvZ3Jlc3NDaXJjdWxhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTywwQkFBMEIsQ0FBQTtBQUVqQyxTQUFTO0FBQ1QsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFFOUMsUUFBUTtBQUNSLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUtsRCxvQkFBb0I7QUFDcEIsZUFBZSxTQUFTLENBQUMsTUFBTSxDQUFDO0lBQzlCLElBQUksRUFBRSxxQkFBcUI7SUFFM0IsS0FBSyxFQUFFO1FBQ0wsTUFBTSxFQUFFLE9BQU87UUFDZixhQUFhLEVBQUUsT0FBTztRQUN0QixNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxDQUFDO1NBQ1g7UUFDRCxJQUFJLEVBQUU7WUFDSixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxFQUFFO1NBQ1o7UUFDRCxLQUFLLEVBQUU7WUFDTCxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxDQUFDO1NBQ1g7UUFDRCxLQUFLLEVBQUU7WUFDTCxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxDQUFDO1NBQ1g7S0FDRjtJQUVELElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ1gsTUFBTSxFQUFFLEVBQUU7S0FDWCxDQUFDO0lBRUYsUUFBUSxFQUFFO1FBQ1IsY0FBYztZQUNaLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMs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QUFFO29CQUNMLEtBQUssRUFBRSw0QkFBNEI7b0JBQ25DLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRTtpQkFDbkc7YUFDRixFQUFFLFFBQVEsQ0FBQyxDQUFBO1FBQ2QsQ0FBQztRQUNELE9BQU87WUFDTCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFO2dCQUNoQyxXQUFXLEVBQUUsMkJBQTJCO2FBQ3pDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUN6QixDQUFDO0tBQ0Y7SUFFRCxNQUFNLENBQUUsQ0FBQztRQUNQLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDNUMsV0FBVyxFQUFFLHFCQUFxQjtZQUNsQyxLQUFLLEVBQUU7Z0JBQ0wsSUFBSSxFQUFFLGFBQWE7Z0JBQ25CLGVBQWUsRUFBRSxDQUFDO2dCQUNsQixlQUFlLEVBQUUsR0FBRztnQkFDcEIsZUFBZSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWU7YUFDdkU7WUFDRCxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU87WUFDbkIsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNO1lBQ2xCLEVBQUUsRUFBRSxJQUFJLENBQUMsVUFBVTtTQUNwQixDQUFDLEVBQUU7WUFDRixJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2IsSUFBSSxDQUFDLE9BQU8sRUFBRTtTQUNmLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcbmltcG9ydCAnLi9WUHJvZ3Jlc3NDaXJjdWxhci5zYXNzJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBDb2xvcmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2NvbG9yYWJsZSdcblxuLy8gVXRpbHNcbmltcG9ydCB7IGNvbnZlcnRUb1VuaXQgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBWTm9kZSwgVk5vZGVDaGlsZHJlbiB9IGZyb20gJ3Z1ZSdcblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IENvbG9yYWJsZS5leHRlbmQoe1xuICBuYW1lOiAndi1wcm9ncmVzcy1jaXJjdWxhcicsXG5cbiAgcHJvcHM6IHtcbiAgICBidXR0b246IEJvb2xlYW4sXG4gICAgaW5kZXRlcm1pbmF0ZTogQm9vbGVhbixcbiAgICByb3RhdGU6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gICAgc2l6ZToge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6IDMyLFxuICAgIH0sXG4gICAgd2lkdGg6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiA0LFxuICAgIH0sXG4gICAgdmFsdWU6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gIH0sXG5cbiAgZGF0YTogKCkgPT4gKHtcbiAgICByYWRpdXM6IDIwLFxuICB9KSxcblxuICBjb21wdXRlZDoge1xuICAgIGNhbGN1bGF0ZWRTaXplICgpOiBudW1iZXIge1xuICAgICAgcmV0dXJuIE51bWJlcih0aGlzLnNpemUpICsgKHRoaXMuYnV0dG9uID8gOCA6IDApXG4gICAgfSxcblxuICAgIGNpcmN1bWZlcmVuY2UgKCk6IG51bWJlciB7XG4gICAgICByZXR1cm4gMiAqIE1hdGguUEkgKiB0aGlzLnJhZGl1c1xuICAgIH0sXG5cbiAgICBjbGFzc2VzICgpOiBvYmplY3Qge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgJ3YtcHJvZ3Jlc3MtY2lyY3VsYXItLWluZGV0ZXJtaW5hdGUnOiB0aGlzLmluZGV0ZXJtaW5hdGUsXG4gICAgICAgICd2LXByb2dyZXNzLWNpcmN1bGFyLS1idXR0b24nOiB0aGlzLmJ1dHRvbixcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgbm9ybWFsaXplZFZhbHVlICgpOiBudW1iZXIge1xuICAgICAgaWYgKHRoaXMudmFsdWUgPCAwKSB7XG4gICAgICAgIHJldHVybiAwXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnZhbHVlID4gMTAwKSB7XG4gICAgICAgIHJldHVybiAxMDBcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodGhpcy52YWx1ZSlcbiAgICB9LFxuXG4gICAgc3Ryb2tlRGFzaEFycmF5ICgpOiBudW1iZXIge1xuICAgICAgcmV0dXJuIE1hdGgucm91bmQodGhpcy5jaXJjdW1mZXJlbmNlICogMTAwMCkgLyAxMDAwXG4gICAgfSxcblxuICAgIHN0cm9rZURhc2hPZmZzZXQgKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gKCgxMDAgLSB0aGlzLm5vcm1hbGl6ZWRWYWx1ZSkgLyAxMDApICogdGhpcy5jaXJjdW1mZXJlbmNlICsgJ3B4J1xuICAgIH0sXG5cbiAgICBzdHJva2VXaWR0aCAoKTogbnVtYmVyIHtcbiAgICAgIHJldHVybiBOdW1iZXIodGhpcy53aWR0aCkgLyArdGhpcy5zaXplICogdGhpcy52aWV3Qm94U2l6ZSAqIDJcbiAgICB9LFxuXG4gICAgc3R5bGVzICgpOiBvYmplY3Qge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaGVpZ2h0OiBjb252ZXJ0VG9Vbml0KHRoaXMuY2FsY3VsYXRlZFNpemUpLFxuICAgICAgICB3aWR0aDogY29udmVydFRvVW5pdCh0aGlzLmNhbGN1bGF0ZWRTaXplKSxcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc3ZnU3R5bGVzICgpOiBvYmplY3Qge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHJhbnNmb3JtOiBgcm90YXRlKCR7TnVtYmVyKHRoaXMucm90YXRlKX1kZWcpYCxcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgdmlld0JveFNpemUgKCk6IG51bWJlciB7XG4gICAgICByZXR1cm4gdGhpcy5yYWRpdXMgLyAoMSAtIE51bWJlcih0aGlzLndpZHRoKSAvICt0aGlzLnNpemUpXG4gICAgfSxcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgZ2VuQ2lyY2xlIChuYW1lOiBzdHJpbmcsIG9mZnNldDogc3RyaW5nIHwgbnVtYmVyKTogVk5vZGUge1xuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2NpcmNsZScsIHtcbiAgICAgICAgY2xhc3M6IGB2LXByb2dyZXNzLWNpcmN1bGFyX18ke25hbWV9YCxcbiAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICBmaWxsOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICAgIGN4OiAyICogdGhpcy52aWV3Qm94U2l6ZSxcbiAgICAgICAgICBjeTogMiAqIHRoaXMudmlld0JveFNpemUsXG4gICAgICAgICAgcjogdGhpcy5yYWRpdXMsXG4gICAgICAgICAgJ3N0cm9rZS13aWR0aCc6IHRoaXMuc3Ryb2tlV2lkdGgsXG4gICAgICAgICAgJ3N0cm9rZS1kYXNoYXJyYXknOiB0aGlzLnN0cm9rZURhc2hBcnJheSxcbiAgICAgICAgICAnc3Ryb2tlLWRhc2hvZmZzZXQnOiBvZmZzZXQsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH0sXG4gICAgZ2VuU3ZnICgpOiBWTm9kZSB7XG4gICAgICBjb25zdCBjaGlsZHJlbiA9IFtcbiAgICAgICAgdGhpcy5pbmRldGVybWluYXRlIHx8IHRoaXMuZ2VuQ2lyY2xlKCd1bmRlcmxheScsIDApLFxuICAgICAgICB0aGlzLmdlbkNpcmNsZSgnb3ZlcmxheScsIHRoaXMuc3Ryb2tlRGFzaE9mZnNldCksXG4gICAgICBdIGFzIFZOb2RlQ2hpbGRyZW5cblxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ3N2ZycsIHtcbiAgICAgICAgc3R5bGU6IHRoaXMuc3ZnU3R5bGVzLFxuICAgICAgICBhdHRyczoge1xuICAgICAgICAgIHhtbG5zOiAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLFxuICAgICAgICAgIHZpZXdCb3g6IGAke3RoaXMudmlld0JveFNpemV9ICR7dGhpcy52aWV3Qm94U2l6ZX0gJHsyICogdGhpcy52aWV3Qm94U2l6ZX0gJHsyICogdGhpcy52aWV3Qm94U2l6ZX1gLFxuICAgICAgICB9LFxuICAgICAgfSwgY2hpbGRyZW4pXG4gICAgfSxcbiAgICBnZW5JbmZvICgpOiBWTm9kZSB7XG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3YtcHJvZ3Jlc3MtY2lyY3VsYXJfX2luZm8nLFxuICAgICAgfSwgdGhpcy4kc2xvdHMuZGVmYXVsdClcbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcbiAgICByZXR1cm4gaCgnZGl2JywgdGhpcy5zZXRUZXh0Q29sb3IodGhpcy5jb2xvciwge1xuICAgICAgc3RhdGljQ2xhc3M6ICd2LXByb2dyZXNzLWNpcmN1bGFyJyxcbiAgICAgIGF0dHJzOiB7XG4gICAgICAgIHJvbGU6ICdwcm9ncmVzc2JhcicsXG4gICAgICAgICdhcmlhLXZhbHVlbWluJzogMCxcbiAgICAgICAgJ2FyaWEtdmFsdWVtYXgnOiAxMDAsXG4gICAgICAgICdhcmlhLXZhbHVlbm93JzogdGhpcy5pbmRldGVybWluYXRlID8gdW5kZWZpbmVkIDogdGhpcy5ub3JtYWxpemVkVmFsdWUsXG4gICAgICB9LFxuICAgICAgY2xhc3M6IHRoaXMuY2xhc3NlcyxcbiAgICAgIHN0eWxlOiB0aGlzLnN0eWxlcyxcbiAgICAgIG9uOiB0aGlzLiRsaXN0ZW5lcnMsXG4gICAgfSksIFtcbiAgICAgIHRoaXMuZ2VuU3ZnKCksXG4gICAgICB0aGlzLmdlbkluZm8oKSxcbiAgICBdKVxuICB9LFxufSlcbiJdfQ==