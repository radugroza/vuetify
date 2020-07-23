// Styles
import './VBtn.sass';
// Extensions
import VSheet from '../VSheet';
// Components
import VProgressCircular from '../VProgressCircular';
// Mixins
import { factory as GroupableFactory } from '../../mixins/groupable';
import { factory as ToggleableFactory } from '../../mixins/toggleable';
import Positionable from '../../mixins/positionable';
import Routable from '../../mixins/routable';
import Sizeable from '../../mixins/sizeable';
// Utilities
import mixins from '../../util/mixins';
import { breaking } from '../../util/console';
const baseMixins = mixins(VSheet, Routable, Positionable, Sizeable, GroupableFactory('btnToggle'), ToggleableFactory('inputValue')
/* @vue/component */
);
export default baseMixins.extend().extend({
    name: 'v-btn',
    props: {
        activeClass: {
            type: String,
            default() {
                if (!this.btnToggle)
                    return '';
                return this.btnToggle.activeClass;
            },
        },
        block: Boolean,
        depressed: Boolean,
        fab: Boolean,
        icon: Boolean,
        loading: Boolean,
        outlined: Boolean,
        retainFocusOnClick: Boolean,
        rounded: Boolean,
        tag: {
            type: String,
            default: 'button',
        },
        text: Boolean,
        tile: Boolean,
        type: {
            type: String,
            default: 'button',
        },
        value: null,
    },
    data: () => ({
        proxyClass: 'v-btn--active',
    }),
    computed: {
        classes() {
            return {
                'v-btn': true,
                ...Routable.options.computed.classes.call(this),
                'v-btn--absolute': this.absolute,
                'v-btn--block': this.block,
                'v-btn--bottom': this.bottom,
                'v-btn--contained': this.contained,
                'v-btn--depressed': (this.depressed) || this.outlined,
                'v-btn--disabled': this.disabled,
                'v-btn--fab': this.fab,
                'v-btn--fixed': this.fixed,
                'v-btn--flat': this.isFlat,
                'v-btn--icon': this.icon,
                'v-btn--left': this.left,
                'v-btn--loading': this.loading,
                'v-btn--outlined': this.outlined,
                'v-btn--right': this.right,
                'v-btn--round': this.isRound,
                'v-btn--rounded': this.rounded,
                'v-btn--router': this.to,
                'v-btn--text': this.text,
                'v-btn--tile': this.tile,
                'v-btn--top': this.top,
                ...this.themeClasses,
                ...this.groupClasses,
                ...this.elevationClasses,
                ...this.sizeableClasses,
            };
        },
        contained() {
            return Boolean(!this.isFlat &&
                !this.depressed &&
                // Contained class only adds elevation
                // is not needed if user provides value
                !this.elevation);
        },
        computedRipple() {
            const defaultRipple = this.icon || this.fab ? { circle: true } : true;
            if (this.disabled)
                return false;
            else
                return this.ripple != null ? this.ripple : defaultRipple;
        },
        isFlat() {
            return Boolean(this.icon ||
                this.text ||
                this.outlined);
        },
        isRound() {
            return Boolean(this.icon ||
                this.fab);
        },
        styles() {
            return {
                ...this.measurableStyles,
            };
        },
    },
    created() {
        const breakingProps = [
            ['flat', 'text'],
            ['outline', 'outlined'],
            ['round', 'rounded'],
        ];
        /* istanbul ignore next */
        breakingProps.forEach(([original, replacement]) => {
            if (this.$attrs.hasOwnProperty(original))
                breaking(original, replacement, this);
        });
    },
    methods: {
        click(e) {
            // TODO: Remove this in v3
            !this.retainFocusOnClick && !this.fab && e.detail && this.$el.blur();
            this.$emit('click', e);
            this.btnToggle && this.toggle();
        },
        genContent() {
            return this.$createElement('span', {
                staticClass: 'v-btn__content',
            }, this.$slots.default);
        },
        genLoader() {
            return this.$createElement('span', {
                class: 'v-btn__loader',
            }, this.$slots.loader || [this.$createElement(VProgressCircular, {
                    props: {
                        indeterminate: true,
                        size: 23,
                        width: 2,
                    },
                })]);
        },
    },
    render(h) {
        const children = [
            this.genContent(),
            this.loading && this.genLoader(),
        ];
        const setColor = !this.isFlat ? this.setBackgroundColor : this.setTextColor;
        const { tag, data } = this.generateRouteLink();
        if (tag === 'button') {
            data.attrs.type = this.type;
            data.attrs.disabled = this.disabled;
        }
        data.attrs.value = ['string', 'number'].includes(typeof this.value)
            ? this.value
            : JSON.stringify(this.value);
        return h(tag, this.disabled ? data : setColor(this.color, data), children);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkJ0bi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZCdG4vVkJ0bi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxhQUFhLENBQUE7QUFFcEIsYUFBYTtBQUNiLE9BQU8sTUFBTSxNQUFNLFdBQVcsQ0FBQTtBQUU5QixhQUFhO0FBQ2IsT0FBTyxpQkFBaUIsTUFBTSxzQkFBc0IsQ0FBQTtBQUVwRCxTQUFTO0FBQ1QsT0FBTyxFQUFFLE9BQU8sSUFBSSxnQkFBZ0IsRUFBRSxNQUFNLHdCQUF3QixDQUFBO0FBQ3BFLE9BQU8sRUFBRSxPQUFPLElBQUksaUJBQWlCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQTtBQUN0RSxPQUFPLFlBQVksTUFBTSwyQkFBMkIsQ0FBQTtBQUNwRCxPQUFPLFFBQVEsTUFBTSx1QkFBdUIsQ0FBQTtBQUM1QyxPQUFPLFFBQVEsTUFBTSx1QkFBdUIsQ0FBQTtBQUU1QyxZQUFZO0FBQ1osT0FBTyxNQUFzQixNQUFNLG1CQUFtQixDQUFBO0FBQ3RELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQU83QyxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQ3ZCLE1BQU0sRUFDTixRQUFRLEVBQ1IsWUFBWSxFQUNaLFFBQVEsRUFDUixnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsRUFDN0IsaUJBQWlCLENBQUMsWUFBWSxDQUFDO0FBQy9CLG9CQUFvQjtDQUNyQixDQUFBO0FBS0QsZUFBZSxVQUFVLENBQUMsTUFBTSxFQUFXLENBQUMsTUFBTSxDQUFDO0lBQ2pELElBQUksRUFBRSxPQUFPO0lBRWIsS0FBSyxFQUFFO1FBQ0wsV0FBVyxFQUFFO1lBQ1gsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPO2dCQUNMLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUztvQkFBRSxPQUFPLEVBQUUsQ0FBQTtnQkFFOUIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFdB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QUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDbEUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLO1lBQ1osQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBRTlCLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0lBQzVFLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcbmltcG9ydCAnLi9WQnRuLnNhc3MnXG5cbi8vIEV4dGVuc2lvbnNcbmltcG9ydCBWU2hlZXQgZnJvbSAnLi4vVlNoZWV0J1xuXG4vLyBDb21wb25lbnRzXG5pbXBvcnQgVlByb2dyZXNzQ2lyY3VsYXIgZnJvbSAnLi4vVlByb2dyZXNzQ2lyY3VsYXInXG5cbi8vIE1peGluc1xuaW1wb3J0IHsgZmFjdG9yeSBhcyBHcm91cGFibGVGYWN0b3J5IH0gZnJvbSAnLi4vLi4vbWl4aW5zL2dyb3VwYWJsZSdcbmltcG9ydCB7IGZhY3RvcnkgYXMgVG9nZ2xlYWJsZUZhY3RvcnkgfSBmcm9tICcuLi8uLi9taXhpbnMvdG9nZ2xlYWJsZSdcbmltcG9ydCBQb3NpdGlvbmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3Bvc2l0aW9uYWJsZSdcbmltcG9ydCBSb3V0YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvcm91dGFibGUnXG5pbXBvcnQgU2l6ZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3NpemVhYmxlJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCBtaXhpbnMsIHsgRXh0cmFjdFZ1ZSB9IGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuaW1wb3J0IHsgYnJlYWtpbmcgfSBmcm9tICcuLi8uLi91dGlsL2NvbnNvbGUnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZSdcbmltcG9ydCB7IFByb3BWYWxpZGF0b3IsIFByb3BUeXBlIH0gZnJvbSAndnVlL3R5cGVzL29wdGlvbnMnXG5pbXBvcnQgeyBSaXBwbGVPcHRpb25zIH0gZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9yaXBwbGUnXG5cbmNvbnN0IGJhc2VNaXhpbnMgPSBtaXhpbnMoXG4gIFZTaGVldCxcbiAgUm91dGFibGUsXG4gIFBvc2l0aW9uYWJsZSxcbiAgU2l6ZWFibGUsXG4gIEdyb3VwYWJsZUZhY3RvcnkoJ2J0blRvZ2dsZScpLFxuICBUb2dnbGVhYmxlRmFjdG9yeSgnaW5wdXRWYWx1ZScpXG4gIC8qIEB2dWUvY29tcG9uZW50ICovXG4pXG5pbnRlcmZhY2Ugb3B0aW9ucyBleHRlbmRzIEV4dHJhY3RWdWU8dHlwZW9mIGJhc2VNaXhpbnM+IHtcbiAgJGVsOiBIVE1MRWxlbWVudFxufVxuXG5leHBvcnQgZGVmYXVsdCBiYXNlTWl4aW5zLmV4dGVuZDxvcHRpb25zPigpLmV4dGVuZCh7XG4gIG5hbWU6ICd2LWJ0bicsXG5cbiAgcHJvcHM6IHtcbiAgICBhY3RpdmVDbGFzczoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdCAoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgaWYgKCF0aGlzLmJ0blRvZ2dsZSkgcmV0dXJuICcnXG5cbiAgICAgICAgcmV0dXJuIHRoaXMuYnRuVG9nZ2xlLmFjdGl2ZUNsYXNzXG4gICAgICB9LFxuICAgIH0gYXMgYW55IGFzIFByb3BWYWxpZGF0b3I8c3RyaW5nPixcbiAgICBibG9jazogQm9vbGVhbixcbiAgICBkZXByZXNzZWQ6IEJvb2xlYW4sXG4gICAgZmFiOiBCb29sZWFuLFxuICAgIGljb246IEJvb2xlYW4sXG4gICAgbG9hZGluZzogQm9vbGVhbixcbiAgICBvdXRsaW5lZDogQm9vbGVhbixcbiAgICByZXRhaW5Gb2N1c09uQ2xpY2s6IEJvb2xlYW4sXG4gICAgcm91bmRlZDogQm9vbGVhbixcbiAgICB0YWc6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICdidXR0b24nLFxuICAgIH0sXG4gICAgdGV4dDogQm9vbGVhbixcbiAgICB0aWxlOiBCb29sZWFuLFxuICAgIHR5cGU6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICdidXR0b24nLFxuICAgIH0sXG4gICAgdmFsdWU6IG51bGwgYXMgYW55IGFzIFByb3BUeXBlPGFueT4sXG4gIH0sXG5cbiAgZGF0YTogKCkgPT4gKHtcbiAgICBwcm94eUNsYXNzOiAndi1idG4tLWFjdGl2ZScsXG4gIH0pLFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgY2xhc3NlcyAoKTogYW55IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICd2LWJ0bic6IHRydWUsXG4gICAgICAgIC4uLlJvdXRhYmxlLm9wdGlvbnMuY29tcHV0ZWQuY2xhc3Nlcy5jYWxsKHRoaXMpLFxuICAgICAgICAndi1idG4tLWFic29sdXRlJzogdGhpcy5hYnNvbHV0ZSxcbiAgICAgICAgJ3YtYnRuLS1ibG9jayc6IHRoaXMuYmxvY2ssXG4gICAgICAgICd2LWJ0bi0tYm90dG9tJzogdGhpcy5ib3R0b20sXG4gICAgICAgICd2LWJ0bi0tY29udGFpbmVkJzogdGhpcy5jb250YWluZWQsXG4gICAgICAgICd2LWJ0bi0tZGVwcmVzc2VkJzogKHRoaXMuZGVwcmVzc2VkKSB8fCB0aGlzLm91dGxpbmVkLFxuICAgICAgICAndi1idG4tLWRpc2FibGVkJzogdGhpcy5kaXNhYmxlZCxcbiAgICAgICAgJ3YtYnRuLS1mYWInOiB0aGlzLmZhYixcbiAgICAgICAgJ3YtYnRuLS1maXhlZCc6IHRoaXMuZml4ZWQsXG4gICAgICAgICd2LWJ0bi0tZmxhdCc6IHRoaXMuaXNGbGF0LFxuICAgICAgICAndi1idG4tLWljb24nOiB0aGlzLmljb24sXG4gICAgICAgICd2LWJ0bi0tbGVmdCc6IHRoaXMubGVmdCxcbiAgICAgICAgJ3YtYnRuLS1sb2FkaW5nJzogdGhpcy5sb2FkaW5nLFxuICAgICAgICAndi1idG4tLW91dGxpbmVkJzogdGhpcy5vdXRsaW5lZCxcbiAgICAgICAgJ3YtYnRuLS1yaWdodCc6IHRoaXMucmlnaHQsXG4gICAgICAgICd2LWJ0bi0tcm91bmQnOiB0aGlzLmlzUm91bmQsXG4gICAgICAgICd2LWJ0bi0tcm91bmRlZCc6IHRoaXMucm91bmRlZCxcbiAgICAgICAgJ3YtYnRuLS1yb3V0ZXInOiB0aGlzLnRvLFxuICAgICAgICAndi1idG4tLXRleHQnOiB0aGlzLnRleHQsXG4gICAgICAgICd2LWJ0bi0tdGlsZSc6IHRoaXMudGlsZSxcbiAgICAgICAgJ3YtYnRuLS10b3AnOiB0aGlzLnRvcCxcbiAgICAgICAgLi4udGhpcy50aGVtZUNsYXNzZXMsXG4gICAgICAgIC4uLnRoaXMuZ3JvdXBDbGFzc2VzLFxuICAgICAgICAuLi50aGlzLmVsZXZhdGlvbkNsYXNzZXMsXG4gICAgICAgIC4uLnRoaXMuc2l6ZWFibGVDbGFzc2VzLFxuICAgICAgfVxuICAgIH0sXG4gICAgY29udGFpbmVkICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiBCb29sZWFuKFxuICAgICAgICAhdGhpcy5pc0ZsYXQgJiZcbiAgICAgICAgIXRoaXMuZGVwcmVzc2VkICYmXG4gICAgICAgIC8vIENvbnRhaW5lZCBjbGFzcyBvbmx5IGFkZHMgZWxldmF0aW9uXG4gICAgICAgIC8vIGlzIG5vdCBuZWVkZWQgaWYgdXNlciBwcm92aWRlcyB2YWx1ZVxuICAgICAgICAhdGhpcy5lbGV2YXRpb25cbiAgICAgIClcbiAgICB9LFxuICAgIGNvbXB1dGVkUmlwcGxlICgpOiBSaXBwbGVPcHRpb25zIHwgYm9vbGVhbiB7XG4gICAgICBjb25zdCBkZWZhdWx0UmlwcGxlID0gdGhpcy5pY29uIHx8IHRoaXMuZmFiID8geyBjaXJjbGU6IHRydWUgfSA6IHRydWVcbiAgICAgIGlmICh0aGlzLmRpc2FibGVkKSByZXR1cm4gZmFsc2VcbiAgICAgIGVsc2UgcmV0dXJuIHRoaXMucmlwcGxlICE9IG51bGwgPyB0aGlzLnJpcHBsZSA6IGRlZmF1bHRSaXBwbGVcbiAgICB9LFxuICAgIGlzRmxhdCAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gQm9vbGVhbihcbiAgICAgICAgdGhpcy5pY29uIHx8XG4gICAgICAgIHRoaXMudGV4dCB8fFxuICAgICAgICB0aGlzLm91dGxpbmVkXG4gICAgICApXG4gICAgfSxcbiAgICBpc1JvdW5kICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiBCb29sZWFuKFxuICAgICAgICB0aGlzLmljb24gfHxcbiAgICAgICAgdGhpcy5mYWJcbiAgICAgIClcbiAgICB9LFxuICAgIHN0eWxlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnRoaXMubWVhc3VyYWJsZVN0eWxlcyxcbiAgICAgIH1cbiAgICB9LFxuICB9LFxuXG4gIGNyZWF0ZWQgKCkge1xuICAgIGNvbnN0IGJyZWFraW5nUHJvcHMgPSBbXG4gICAgICBbJ2ZsYXQnLCAndGV4dCddLFxuICAgICAgWydvdXRsaW5lJywgJ291dGxpbmVkJ10sXG4gICAgICBbJ3JvdW5kJywgJ3JvdW5kZWQnXSxcbiAgICBdXG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGJyZWFraW5nUHJvcHMuZm9yRWFjaCgoW29yaWdpbmFsLCByZXBsYWNlbWVudF0pID0+IHtcbiAgICAgIGlmICh0aGlzLiRhdHRycy5oYXNPd25Qcm9wZXJ0eShvcmlnaW5hbCkpIGJyZWFraW5nKG9yaWdpbmFsLCByZXBsYWNlbWVudCwgdGhpcylcbiAgICB9KVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBjbGljayAoZTogTW91c2VFdmVudCk6IHZvaWQge1xuICAgICAgLy8gVE9ETzogUmVtb3ZlIHRoaXMgaW4gdjNcbiAgICAgICF0aGlzLnJldGFpbkZvY3VzT25DbGljayAmJiAhdGhpcy5mYWIgJiYgZS5kZXRhaWwgJiYgdGhpcy4kZWwuYmx1cigpXG4gICAgICB0aGlzLiRlbWl0KCdjbGljaycsIGUpXG5cbiAgICAgIHRoaXMuYnRuVG9nZ2xlICYmIHRoaXMudG9nZ2xlKClcbiAgICB9LFxuICAgIGdlbkNvbnRlbnQgKCk6IFZOb2RlIHtcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdzcGFuJywge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3YtYnRuX19jb250ZW50JyxcbiAgICAgIH0sIHRoaXMuJHNsb3RzLmRlZmF1bHQpXG4gICAgfSxcbiAgICBnZW5Mb2FkZXIgKCk6IFZOb2RlIHtcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdzcGFuJywge1xuICAgICAgICBjbGFzczogJ3YtYnRuX19sb2FkZXInLFxuICAgICAgfSwgdGhpcy4kc2xvdHMubG9hZGVyIHx8IFt0aGlzLiRjcmVhdGVFbGVtZW50KFZQcm9ncmVzc0NpcmN1bGFyLCB7XG4gICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgaW5kZXRlcm1pbmF0ZTogdHJ1ZSxcbiAgICAgICAgICBzaXplOiAyMyxcbiAgICAgICAgICB3aWR0aDogMixcbiAgICAgICAgfSxcbiAgICAgIH0pXSlcbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcbiAgICBjb25zdCBjaGlsZHJlbiA9IFtcbiAgICAgIHRoaXMuZ2VuQ29udGVudCgpLFxuICAgICAgdGhpcy5sb2FkaW5nICYmIHRoaXMuZ2VuTG9hZGVyKCksXG4gICAgXVxuICAgIGNvbnN0IHNldENvbG9yID0gIXRoaXMuaXNGbGF0ID8gdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IgOiB0aGlzLnNldFRleHRDb2xvclxuICAgIGNvbnN0IHsgdGFnLCBkYXRhIH0gPSB0aGlzLmdlbmVyYXRlUm91dGVMaW5rKClcblxuICAgIGlmICh0YWcgPT09ICdidXR0b24nKSB7XG4gICAgICBkYXRhLmF0dHJzIS50eXBlID0gdGhpcy50eXBlXG4gICAgICBkYXRhLmF0dHJzIS5kaXNhYmxlZCA9IHRoaXMuZGlzYWJsZWRcbiAgICB9XG4gICAgZGF0YS5hdHRycyEudmFsdWUgPSBbJ3N0cmluZycsICdudW1iZXInXS5pbmNsdWRlcyh0eXBlb2YgdGhpcy52YWx1ZSlcbiAgICAgID8gdGhpcy52YWx1ZVxuICAgICAgOiBKU09OLnN0cmluZ2lmeSh0aGlzLnZhbHVlKVxuXG4gICAgcmV0dXJuIGgodGFnLCB0aGlzLmRpc2FibGVkID8gZGF0YSA6IHNldENvbG9yKHRoaXMuY29sb3IsIGRhdGEpLCBjaGlsZHJlbilcbiAgfSxcbn0pXG4iXX0=