// Styles
import './VChip.sass';
import mixins from '../../util/mixins';
// Components
import { VExpandXTransition } from '../transitions';
import VIcon from '../VIcon';
// Mixins
import Colorable from '../../mixins/colorable';
import { factory as GroupableFactory } from '../../mixins/groupable';
import Themeable from '../../mixins/themeable';
import { factory as ToggleableFactory } from '../../mixins/toggleable';
import Routable from '../../mixins/routable';
import Sizeable from '../../mixins/sizeable';
// Utilities
import { breaking } from '../../util/console';
/* @vue/component */
export default mixins(Colorable, Sizeable, Routable, Themeable, GroupableFactory('chipGroup'), ToggleableFactory('inputValue')).extend({
    name: 'v-chip',
    props: {
        active: {
            type: Boolean,
            default: true,
        },
        activeClass: {
            type: String,
            default() {
                if (!this.chipGroup)
                    return '';
                return this.chipGroup.activeClass;
            },
        },
        close: Boolean,
        closeIcon: {
            type: String,
            default: '$delete',
        },
        disabled: Boolean,
        draggable: Boolean,
        filter: Boolean,
        filterIcon: {
            type: String,
            default: '$complete',
        },
        label: Boolean,
        link: Boolean,
        outlined: Boolean,
        pill: Boolean,
        tag: {
            type: String,
            default: 'span',
        },
        textColor: String,
        value: null,
    },
    data: () => ({
        proxyClass: 'v-chip--active',
    }),
    computed: {
        classes() {
            return {
                'v-chip': true,
                ...Routable.options.computed.classes.call(this),
                'v-chip--clickable': this.isClickable,
                'v-chip--disabled': this.disabled,
                'v-chip--draggable': this.draggable,
                'v-chip--label': this.label,
                'v-chip--link': this.isLink,
                'v-chip--no-color': !this.color,
                'v-chip--outlined': this.outlined,
                'v-chip--pill': this.pill,
                'v-chip--removable': this.hasClose,
                ...this.themeClasses,
                ...this.sizeableClasses,
                ...this.groupClasses,
            };
        },
        hasClose() {
            return Boolean(this.close);
        },
        isClickable() {
            return Boolean(Routable.options.computed.isClickable.call(this) ||
                this.chipGroup);
        },
    },
    created() {
        const breakingProps = [
            ['outline', 'outlined'],
            ['selected', 'input-value'],
            ['value', 'active'],
            ['@input', '@active.sync'],
        ];
        /* istanbul ignore next */
        breakingProps.forEach(([original, replacement]) => {
            if (this.$attrs.hasOwnProperty(original))
                breaking(original, replacement, this);
        });
    },
    methods: {
        click(e) {
            this.$emit('click', e);
            this.chipGroup && this.toggle();
        },
        genFilter() {
            const children = [];
            if (this.isActive) {
                children.push(this.$createElement(VIcon, {
                    staticClass: 'v-chip__filter',
                    props: { left: true },
                }, this.filterIcon));
            }
            return this.$createElement(VExpandXTransition, children);
        },
        genClose() {
            return this.$createElement(VIcon, {
                staticClass: 'v-chip__close',
                props: {
                    right: true,
                    size: 18,
                },
                on: {
                    click: (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        this.$emit('click:close');
                        this.$emit('update:active', false);
                    },
                },
            }, this.closeIcon);
        },
        genContent() {
            return this.$createElement('span', {
                staticClass: 'v-chip__content',
            }, [
                this.filter && this.genFilter(),
                this.$slots.default,
                this.hasClose && this.genClose(),
            ]);
        },
    },
    render(h) {
        const children = [this.genContent()];
        let { tag, data } = this.generateRouteLink();
        data.attrs = {
            ...data.attrs,
            draggable: this.draggable ? 'true' : undefined,
            tabindex: this.chipGroup && !this.disabled ? 0 : data.attrs.tabindex,
        };
        data.directives.push({
            name: 'show',
            value: this.active,
        });
        data = this.setBackgroundColor(this.color, data);
        const color = this.textColor || (this.outlined && this.color);
        return h(tag, this.setTextColor(color, data), children);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkNoaXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WQ2hpcC9WQ2hpcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxjQUFjLENBQUE7QUFJckIsT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFFdEMsYUFBYTtBQUNiLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGdCQUFnQixDQUFBO0FBQ25ELE9BQU8sS0FBSyxNQUFNLFVBQVUsQ0FBQTtBQUU1QixTQUFTO0FBQ1QsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxFQUFFLE9BQU8sSUFBSSxnQkFBZ0IsRUFBRSxNQUFNLHdCQUF3QixDQUFBO0FBQ3BFLE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBQzlDLE9BQU8sRUFBRSxPQUFPLElBQUksaUJBQWlCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQTtBQUN0RSxPQUFPLFFBQVEsTUFBTSx1QkFBdUIsQ0FBQTtBQUM1QyxPQUFPLFFBQVEsTUFBTSx1QkFBdUIsQ0FBQTtBQUU1QyxZQUFZO0FBQ1osT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBSzdDLG9CQUFvQjtBQUNwQixlQUFlLE1BQU0sQ0FDbkIsU0FBUyxFQUNULFFBQVEsRUFDUixRQUFRLEVBQ1IsU0FBUyxFQUNULGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxFQUM3QixpQkFBaUIsQ0FBQyxZQUFZLENBQUMsQ0FDaEMsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUsUUFBUTtJQUVkLEtBQUssRUFBRTtRQUNMLE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSxPQUFPO1lBQ2IsT0FBTyxFQUFFLElBQUk7U0FDZDtRQUNELFdBQVcsRUFBRTtZQUNYLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTztnQkFDTCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVM7b0JBQUUs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QUFRLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTthQUNqQyxDQUFDLENBQUE7UUFDSixDQUFDO0tBQ0Y7SUFFRCxNQUFNLENBQUUsQ0FBQztRQUNQLE1BQU0sUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUE7UUFDcEMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUU1QyxJQUFJLENBQUMsS0FBSyxHQUFHO1lBQ1gsR0FBRyxJQUFJLENBQUMsS0FBSztZQUNiLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVM7WUFDOUMsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFNLENBQUMsUUFBUTtTQUN0RSxDQUFBO1FBQ0QsSUFBSSxDQUFDLFVBQVcsQ0FBQyxJQUFJLENBQUM7WUFDcEIsSUFBSSxFQUFFLE1BQU07WUFDWixLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU07U0FDbkIsQ0FBQyxDQUFBO1FBQ0YsSUFBSSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFBO1FBRWhELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUU3RCxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUE7SUFDekQsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xuaW1wb3J0ICcuL1ZDaGlwLnNhc3MnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZSdcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5cbi8vIENvbXBvbmVudHNcbmltcG9ydCB7IFZFeHBhbmRYVHJhbnNpdGlvbiB9IGZyb20gJy4uL3RyYW5zaXRpb25zJ1xuaW1wb3J0IFZJY29uIGZyb20gJy4uL1ZJY29uJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBDb2xvcmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2NvbG9yYWJsZSdcbmltcG9ydCB7IGZhY3RvcnkgYXMgR3JvdXBhYmxlRmFjdG9yeSB9IGZyb20gJy4uLy4uL21peGlucy9ncm91cGFibGUnXG5pbXBvcnQgVGhlbWVhYmxlIGZyb20gJy4uLy4uL21peGlucy90aGVtZWFibGUnXG5pbXBvcnQgeyBmYWN0b3J5IGFzIFRvZ2dsZWFibGVGYWN0b3J5IH0gZnJvbSAnLi4vLi4vbWl4aW5zL3RvZ2dsZWFibGUnXG5pbXBvcnQgUm91dGFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3JvdXRhYmxlJ1xuaW1wb3J0IFNpemVhYmxlIGZyb20gJy4uLy4uL21peGlucy9zaXplYWJsZSdcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgeyBicmVha2luZyB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcblxuLy8gVHlwZXNcbmltcG9ydCB7IFByb3BWYWxpZGF0b3IsIFByb3BUeXBlIH0gZnJvbSAndnVlL3R5cGVzL29wdGlvbnMnXG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBtaXhpbnMoXG4gIENvbG9yYWJsZSxcbiAgU2l6ZWFibGUsXG4gIFJvdXRhYmxlLFxuICBUaGVtZWFibGUsXG4gIEdyb3VwYWJsZUZhY3RvcnkoJ2NoaXBHcm91cCcpLFxuICBUb2dnbGVhYmxlRmFjdG9yeSgnaW5wdXRWYWx1ZScpXG4pLmV4dGVuZCh7XG4gIG5hbWU6ICd2LWNoaXAnLFxuXG4gIHByb3BzOiB7XG4gICAgYWN0aXZlOiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB9LFxuICAgIGFjdGl2ZUNsYXNzOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0ICgpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgICAgICBpZiAoIXRoaXMuY2hpcEdyb3VwKSByZXR1cm4gJydcblxuICAgICAgICByZXR1cm4gdGhpcy5jaGlwR3JvdXAuYWN0aXZlQ2xhc3NcbiAgICAgIH0sXG4gICAgfSBhcyBhbnkgYXMgUHJvcFZhbGlkYXRvcjxzdHJpbmc+LFxuICAgIGNsb3NlOiBCb29sZWFuLFxuICAgIGNsb3NlSWNvbjoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJyRkZWxldGUnLFxuICAgIH0sXG4gICAgZGlzYWJsZWQ6IEJvb2xlYW4sXG4gICAgZHJhZ2dhYmxlOiBCb29sZWFuLFxuICAgIGZpbHRlcjogQm9vbGVhbixcbiAgICBmaWx0ZXJJY29uOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnJGNvbXBsZXRlJyxcbiAgICB9LFxuICAgIGxhYmVsOiBCb29sZWFuLFxuICAgIGxpbms6IEJvb2xlYW4sXG4gICAgb3V0bGluZWQ6IEJvb2xlYW4sXG4gICAgcGlsbDogQm9vbGVhbixcbiAgICB0YWc6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICdzcGFuJyxcbiAgICB9LFxuICAgIHRleHRDb2xvcjogU3RyaW5nLFxuICAgIHZhbHVlOiBudWxsIGFzIGFueSBhcyBQcm9wVHlwZTxhbnk+LFxuICB9LFxuXG4gIGRhdGE6ICgpID0+ICh7XG4gICAgcHJveHlDbGFzczogJ3YtY2hpcC0tYWN0aXZlJyxcbiAgfSksXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBjbGFzc2VzICgpOiBvYmplY3Qge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgJ3YtY2hpcCc6IHRydWUsXG4gICAgICAgIC4uLlJvdXRhYmxlLm9wdGlvbnMuY29tcHV0ZWQuY2xhc3Nlcy5jYWxsKHRoaXMpLFxuICAgICAgICAndi1jaGlwLS1jbGlja2FibGUnOiB0aGlzLmlzQ2xpY2thYmxlLFxuICAgICAgICAndi1jaGlwLS1kaXNhYmxlZCc6IHRoaXMuZGlzYWJsZWQsXG4gICAgICAgICd2LWNoaXAtLWRyYWdnYWJsZSc6IHRoaXMuZHJhZ2dhYmxlLFxuICAgICAgICAndi1jaGlwLS1sYWJlbCc6IHRoaXMubGFiZWwsXG4gICAgICAgICd2LWNoaXAtLWxpbmsnOiB0aGlzLmlzTGluayxcbiAgICAgICAgJ3YtY2hpcC0tbm8tY29sb3InOiAhdGhpcy5jb2xvcixcbiAgICAgICAgJ3YtY2hpcC0tb3V0bGluZWQnOiB0aGlzLm91dGxpbmVkLFxuICAgICAgICAndi1jaGlwLS1waWxsJzogdGhpcy5waWxsLFxuICAgICAgICAndi1jaGlwLS1yZW1vdmFibGUnOiB0aGlzLmhhc0Nsb3NlLFxuICAgICAgICAuLi50aGlzLnRoZW1lQ2xhc3NlcyxcbiAgICAgICAgLi4udGhpcy5zaXplYWJsZUNsYXNzZXMsXG4gICAgICAgIC4uLnRoaXMuZ3JvdXBDbGFzc2VzLFxuICAgICAgfVxuICAgIH0sXG4gICAgaGFzQ2xvc2UgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIEJvb2xlYW4odGhpcy5jbG9zZSlcbiAgICB9LFxuICAgIGlzQ2xpY2thYmxlICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiBCb29sZWFuKFxuICAgICAgICBSb3V0YWJsZS5vcHRpb25zLmNvbXB1dGVkLmlzQ2xpY2thYmxlLmNhbGwodGhpcykgfHxcbiAgICAgICAgdGhpcy5jaGlwR3JvdXBcbiAgICAgIClcbiAgICB9LFxuICB9LFxuXG4gIGNyZWF0ZWQgKCkge1xuICAgIGNvbnN0IGJyZWFraW5nUHJvcHMgPSBbXG4gICAgICBbJ291dGxpbmUnLCAnb3V0bGluZWQnXSxcbiAgICAgIFsnc2VsZWN0ZWQnLCAnaW5wdXQtdmFsdWUnXSxcbiAgICAgIFsndmFsdWUnLCAnYWN0aXZlJ10sXG4gICAgICBbJ0BpbnB1dCcsICdAYWN0aXZlLnN5bmMnXSxcbiAgICBdXG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGJyZWFraW5nUHJvcHMuZm9yRWFjaCgoW29yaWdpbmFsLCByZXBsYWNlbWVudF0pID0+IHtcbiAgICAgIGlmICh0aGlzLiRhdHRycy5oYXNPd25Qcm9wZXJ0eShvcmlnaW5hbCkpIGJyZWFraW5nKG9yaWdpbmFsLCByZXBsYWNlbWVudCwgdGhpcylcbiAgICB9KVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBjbGljayAoZTogTW91c2VFdmVudCk6IHZvaWQge1xuICAgICAgdGhpcy4kZW1pdCgnY2xpY2snLCBlKVxuXG4gICAgICB0aGlzLmNoaXBHcm91cCAmJiB0aGlzLnRvZ2dsZSgpXG4gICAgfSxcbiAgICBnZW5GaWx0ZXIgKCk6IFZOb2RlIHtcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gW11cblxuICAgICAgaWYgKHRoaXMuaXNBY3RpdmUpIHtcbiAgICAgICAgY2hpbGRyZW4ucHVzaChcbiAgICAgICAgICB0aGlzLiRjcmVhdGVFbGVtZW50KFZJY29uLCB7XG4gICAgICAgICAgICBzdGF0aWNDbGFzczogJ3YtY2hpcF9fZmlsdGVyJyxcbiAgICAgICAgICAgIHByb3BzOiB7IGxlZnQ6IHRydWUgfSxcbiAgICAgICAgICB9LCB0aGlzLmZpbHRlckljb24pXG4gICAgICAgIClcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkV4cGFuZFhUcmFuc2l0aW9uLCBjaGlsZHJlbilcbiAgICB9LFxuICAgIGdlbkNsb3NlICgpOiBWTm9kZSB7XG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudChWSWNvbiwge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3YtY2hpcF9fY2xvc2UnLFxuICAgICAgICBwcm9wczoge1xuICAgICAgICAgIHJpZ2h0OiB0cnVlLFxuICAgICAgICAgIHNpemU6IDE4LFxuICAgICAgICB9LFxuICAgICAgICBvbjoge1xuICAgICAgICAgIGNsaWNrOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgICAgICAgICB0aGlzLiRlbWl0KCdjbGljazpjbG9zZScpXG4gICAgICAgICAgICB0aGlzLiRlbWl0KCd1cGRhdGU6YWN0aXZlJywgZmFsc2UpXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sIHRoaXMuY2xvc2VJY29uKVxuICAgIH0sXG4gICAgZ2VuQ29udGVudCAoKTogVk5vZGUge1xuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7XG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1jaGlwX19jb250ZW50JyxcbiAgICAgIH0sIFtcbiAgICAgICAgdGhpcy5maWx0ZXIgJiYgdGhpcy5nZW5GaWx0ZXIoKSxcbiAgICAgICAgdGhpcy4kc2xvdHMuZGVmYXVsdCxcbiAgICAgICAgdGhpcy5oYXNDbG9zZSAmJiB0aGlzLmdlbkNsb3NlKCksXG4gICAgICBdKVxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyIChoKTogVk5vZGUge1xuICAgIGNvbnN0IGNoaWxkcmVuID0gW3RoaXMuZ2VuQ29udGVudCgpXVxuICAgIGxldCB7IHRhZywgZGF0YSB9ID0gdGhpcy5nZW5lcmF0ZVJvdXRlTGluaygpXG5cbiAgICBkYXRhLmF0dHJzID0ge1xuICAgICAgLi4uZGF0YS5hdHRycyxcbiAgICAgIGRyYWdnYWJsZTogdGhpcy5kcmFnZ2FibGUgPyAndHJ1ZScgOiB1bmRlZmluZWQsXG4gICAgICB0YWJpbmRleDogdGhpcy5jaGlwR3JvdXAgJiYgIXRoaXMuZGlzYWJsZWQgPyAwIDogZGF0YS5hdHRycyEudGFiaW5kZXgsXG4gICAgfVxuICAgIGRhdGEuZGlyZWN0aXZlcyEucHVzaCh7XG4gICAgICBuYW1lOiAnc2hvdycsXG4gICAgICB2YWx1ZTogdGhpcy5hY3RpdmUsXG4gICAgfSlcbiAgICBkYXRhID0gdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IodGhpcy5jb2xvciwgZGF0YSlcblxuICAgIGNvbnN0IGNvbG9yID0gdGhpcy50ZXh0Q29sb3IgfHwgKHRoaXMub3V0bGluZWQgJiYgdGhpcy5jb2xvcilcblxuICAgIHJldHVybiBoKHRhZywgdGhpcy5zZXRUZXh0Q29sb3IoY29sb3IsIGRhdGEpLCBjaGlsZHJlbilcbiAgfSxcbn0pXG4iXX0=