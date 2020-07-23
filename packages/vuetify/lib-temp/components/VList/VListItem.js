// Styles
import './VListItem.sass';
// Mixins
import Colorable from '../../mixins/colorable';
import Routable from '../../mixins/routable';
import { factory as GroupableFactory } from '../../mixins/groupable';
import Themeable from '../../mixins/themeable';
import { factory as ToggleableFactory } from '../../mixins/toggleable';
// Directives
import Ripple from '../../directives/ripple';
// Utilities
import { keyCodes } from './../../util/helpers';
import { removed } from '../../util/console';
// Types
import mixins from '../../util/mixins';
const baseMixins = mixins(Colorable, Routable, Themeable, GroupableFactory('listItemGroup'), ToggleableFactory('inputValue'));
/* @vue/component */
export default baseMixins.extend().extend({
    name: 'v-list-item',
    directives: {
        Ripple,
    },
    inheritAttrs: false,
    inject: {
        isInGroup: {
            default: false,
        },
        isInList: {
            default: false,
        },
        isInMenu: {
            default: false,
        },
        isInNav: {
            default: false,
        },
    },
    props: {
        activeClass: {
            type: String,
            default() {
                if (!this.listItemGroup)
                    return '';
                return this.listItemGroup.activeClass;
            },
        },
        dense: Boolean,
        inactive: Boolean,
        link: Boolean,
        selectable: {
            type: Boolean,
        },
        tag: {
            type: String,
            default: 'div',
        },
        threeLine: Boolean,
        twoLine: Boolean,
        value: null,
    },
    data: () => ({
        proxyClass: 'v-list-item--active',
    }),
    computed: {
        classes() {
            return {
                'v-list-item': true,
                ...Routable.options.computed.classes.call(this),
                'v-list-item--dense': this.dense,
                'v-list-item--disabled': this.disabled,
                'v-list-item--link': this.isClickable && !this.inactive,
                'v-list-item--selectable': this.selectable,
                'v-list-item--three-line': this.threeLine,
                'v-list-item--two-line': this.twoLine,
                ...this.themeClasses,
            };
        },
        isClickable() {
            return Boolean(Routable.options.computed.isClickable.call(this) ||
                this.listItemGroup);
        },
    },
    created() {
        /* istanbul ignore next */
        if (this.$attrs.hasOwnProperty('avatar')) {
            removed('avatar', this);
        }
    },
    methods: {
        click(e) {
            if (e.detail)
                this.$el.blur();
            this.$emit('click', e);
            this.to || this.toggle();
        },
        genAttrs() {
            const attrs = {
                'aria-disabled': this.disabled ? true : undefined,
                tabindex: this.isClickable && !this.disabled ? 0 : -1,
                ...this.$attrs,
            };
            if (this.$attrs.hasOwnProperty('role')) {
                // do nothing, role already provided
            }
            else if (this.isInNav) {
                // do nothing, role is inherit
            }
            else if (this.isInGroup) {
                attrs.role = 'listitem';
                attrs['aria-selected'] = String(this.isActive);
            }
            else if (this.isInMenu) {
                attrs.role = this.isClickable ? 'menuitem' : undefined;
                attrs.id = attrs.id || `list-item-${this._uid}`;
            }
            else if (this.isInList) {
                attrs.role = 'listitem';
            }
            return attrs;
        },
    },
    render(h) {
        let { tag, data } = this.generateRouteLink();
        data.attrs = {
            ...data.attrs,
            ...this.genAttrs(),
        };
        data[this.to ? 'nativeOn' : 'on'] = {
            ...data[this.to ? 'nativeOn' : 'on'],
            keydown: (e) => {
                /* istanbul ignore else */
                if (e.keyCode === keyCodes.enter)
                    this.click(e);
                this.$emit('keydown', e);
            },
        };
        if (this.inactive)
            tag = 'div';
        if (this.inactive && this.to) {
            data.on = data.nativeOn;
            delete data.nativeOn;
        }
        const children = this.$scopedSlots.default
            ? this.$scopedSlots.default({
                active: this.isActive,
                toggle: this.toggle,
            })
            : this.$slots.default;
        return h(tag, this.setTextColor(this.color, data), children);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkxpc3RJdGVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkxpc3QvVkxpc3RJdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFNBQVM7QUFDVCxPQUFPLGtCQUFrQixDQUFBO0FBRXpCLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFFBQVEsTUFBTSx1QkFBdUIsQ0FBQTtBQUM1QyxPQUFPLEVBQUUsT0FBTyxJQUFJLGdCQUFnQixFQUFFLE1BQU0sd0JBQXdCLENBQUE7QUFDcEUsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxFQUFFLE9BQU8sSUFBSSxpQkFBaUIsRUFBRSxNQUFNLHlCQUF5QixDQUFBO0FBRXRFLGFBQWE7QUFDYixPQUFPLE1BQU0sTUFBTSx5QkFBeUIsQ0FBQTtBQUU1QyxZQUFZO0FBQ1osT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHNCQUFzQixDQUFBO0FBRS9DLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUU1QyxRQUFRO0FBQ1IsT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFJdEMsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUN2QixTQUFTLEVBQ1QsUUFBUSxFQUNSLFNBQVMsRUFDVCxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsRUFDakMsaUJBQWlCLENBQUMsWUFBWSxDQUFDLENBQ2hDLENBQUE7QUFVRCxvQkFBb0I7QUFDcEIsZUFBZSxVQUFVLENBQUMsTUFBTSxFQUFXLENBQUMsTUFBTSxDQUFDO0lBQ2pELElBQUksRUFBRSxhQUFhO0lBRW5CLFVBQVUsRUFBRTtRQUNWLE1BQU07S0FDUDtJQUVELFlBQVksRUFBRSxLQUFLO0lBRW5CLE1BQU0sRUFBRTtRQUNOLFNBQVMsRUFBRTtZQUNULE9BQU8sRUFBRSxLQUFLO1NBQ2Y7UUFDRCxRQUFRLEVBQUU7WUFDUixPQUFPLEVB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QUFLLFFBQVEsQ0FBQyxLQUFLO29CQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7Z0JBRS9DLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFBO1lBQzFCLENBQUM7U0FDRixDQUFBO1FBRUQsSUFBSSxJQUFJLENBQUMsUUFBUTtZQUFFLEdBQUcsR0FBRyxLQUFLLENBQUE7UUFDOUIsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxFQUFFLEVBQUU7WUFDNUIsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFBO1lBQ3ZCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQTtTQUNyQjtRQUVELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTztZQUN4QyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUM7Z0JBQzFCLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUTtnQkFDckIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO2FBQ3BCLENBQUM7WUFDRixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUE7UUFFdkIsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQTtJQUM5RCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXG5pbXBvcnQgJy4vVkxpc3RJdGVtLnNhc3MnXG5cbi8vIE1peGluc1xuaW1wb3J0IENvbG9yYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvY29sb3JhYmxlJ1xuaW1wb3J0IFJvdXRhYmxlIGZyb20gJy4uLy4uL21peGlucy9yb3V0YWJsZSdcbmltcG9ydCB7IGZhY3RvcnkgYXMgR3JvdXBhYmxlRmFjdG9yeSB9IGZyb20gJy4uLy4uL21peGlucy9ncm91cGFibGUnXG5pbXBvcnQgVGhlbWVhYmxlIGZyb20gJy4uLy4uL21peGlucy90aGVtZWFibGUnXG5pbXBvcnQgeyBmYWN0b3J5IGFzIFRvZ2dsZWFibGVGYWN0b3J5IH0gZnJvbSAnLi4vLi4vbWl4aW5zL3RvZ2dsZWFibGUnXG5cbi8vIERpcmVjdGl2ZXNcbmltcG9ydCBSaXBwbGUgZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9yaXBwbGUnXG5cbi8vIFV0aWxpdGllc1xuaW1wb3J0IHsga2V5Q29kZXMgfSBmcm9tICcuLy4uLy4uL3V0aWwvaGVscGVycydcbmltcG9ydCB7IEV4dHJhY3RWdWUgfSBmcm9tICcuLy4uLy4uL3V0aWwvbWl4aW5zJ1xuaW1wb3J0IHsgcmVtb3ZlZCB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcblxuLy8gVHlwZXNcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZSdcbmltcG9ydCB7IFByb3BUeXBlLCBQcm9wVmFsaWRhdG9yIH0gZnJvbSAndnVlL3R5cGVzL29wdGlvbnMnXG5cbmNvbnN0IGJhc2VNaXhpbnMgPSBtaXhpbnMoXG4gIENvbG9yYWJsZSxcbiAgUm91dGFibGUsXG4gIFRoZW1lYWJsZSxcbiAgR3JvdXBhYmxlRmFjdG9yeSgnbGlzdEl0ZW1Hcm91cCcpLFxuICBUb2dnbGVhYmxlRmFjdG9yeSgnaW5wdXRWYWx1ZScpXG4pXG5cbmludGVyZmFjZSBvcHRpb25zIGV4dGVuZHMgRXh0cmFjdFZ1ZTx0eXBlb2YgYmFzZU1peGlucz4ge1xuICAkZWw6IEhUTUxFbGVtZW50XG4gIGlzSW5Hcm91cDogYm9vbGVhblxuICBpc0luTGlzdDogYm9vbGVhblxuICBpc0luTWVudTogYm9vbGVhblxuICBpc0luTmF2OiBib29sZWFuXG59XG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBiYXNlTWl4aW5zLmV4dGVuZDxvcHRpb25zPigpLmV4dGVuZCh7XG4gIG5hbWU6ICd2LWxpc3QtaXRlbScsXG5cbiAgZGlyZWN0aXZlczoge1xuICAgIFJpcHBsZSxcbiAgfSxcblxuICBpbmhlcml0QXR0cnM6IGZhbHNlLFxuXG4gIGluamVjdDoge1xuICAgIGlzSW5Hcm91cDoge1xuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgfSxcbiAgICBpc0luTGlzdDoge1xuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgfSxcbiAgICBpc0luTWVudToge1xuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgfSxcbiAgICBpc0luTmF2OiB7XG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB9LFxuICB9LFxuXG4gIHByb3BzOiB7XG4gICAgYWN0aXZlQ2xhc3M6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQgKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGlmICghdGhpcy5saXN0SXRlbUdyb3VwKSByZXR1cm4gJydcblxuICAgICAgICByZXR1cm4gdGhpcy5saXN0SXRlbUdyb3VwLmFjdGl2ZUNsYXNzXG4gICAgICB9LFxuICAgIH0gYXMgYW55IGFzIFByb3BWYWxpZGF0b3I8c3RyaW5nPixcbiAgICBkZW5zZTogQm9vbGVhbixcbiAgICBpbmFjdGl2ZTogQm9vbGVhbixcbiAgICBsaW5rOiBCb29sZWFuLFxuICAgIHNlbGVjdGFibGU6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgfSxcbiAgICB0YWc6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICdkaXYnLFxuICAgIH0sXG4gICAgdGhyZWVMaW5lOiBCb29sZWFuLFxuICAgIHR3b0xpbmU6IEJvb2xlYW4sXG4gICAgdmFsdWU6IG51bGwgYXMgYW55IGFzIFByb3BUeXBlPGFueT4sXG4gIH0sXG5cbiAgZGF0YTogKCkgPT4gKHtcbiAgICBwcm94eUNsYXNzOiAndi1saXN0LWl0ZW0tLWFjdGl2ZScsXG4gIH0pLFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICd2LWxpc3QtaXRlbSc6IHRydWUsXG4gICAgICAgIC4uLlJvdXRhYmxlLm9wdGlvbnMuY29tcHV0ZWQuY2xhc3Nlcy5jYWxsKHRoaXMpLFxuICAgICAgICAndi1saXN0LWl0ZW0tLWRlbnNlJzogdGhpcy5kZW5zZSxcbiAgICAgICAgJ3YtbGlzdC1pdGVtLS1kaXNhYmxlZCc6IHRoaXMuZGlzYWJsZWQsXG4gICAgICAgICd2LWxpc3QtaXRlbS0tbGluayc6IHRoaXMuaXNDbGlja2FibGUgJiYgIXRoaXMuaW5hY3RpdmUsXG4gICAgICAgICd2LWxpc3QtaXRlbS0tc2VsZWN0YWJsZSc6IHRoaXMuc2VsZWN0YWJsZSxcbiAgICAgICAgJ3YtbGlzdC1pdGVtLS10aHJlZS1saW5lJzogdGhpcy50aHJlZUxpbmUsXG4gICAgICAgICd2LWxpc3QtaXRlbS0tdHdvLWxpbmUnOiB0aGlzLnR3b0xpbmUsXG4gICAgICAgIC4uLnRoaXMudGhlbWVDbGFzc2VzLFxuICAgICAgfVxuICAgIH0sXG4gICAgaXNDbGlja2FibGUgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIEJvb2xlYW4oXG4gICAgICAgIFJvdXRhYmxlLm9wdGlvbnMuY29tcHV0ZWQuaXNDbGlja2FibGUuY2FsbCh0aGlzKSB8fFxuICAgICAgICB0aGlzLmxpc3RJdGVtR3JvdXBcbiAgICAgIClcbiAgICB9LFxuICB9LFxuXG4gIGNyZWF0ZWQgKCkge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKHRoaXMuJGF0dHJzLmhhc093blByb3BlcnR5KCdhdmF0YXInKSkge1xuICAgICAgcmVtb3ZlZCgnYXZhdGFyJywgdGhpcylcbiAgICB9XG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGNsaWNrIChlOiBNb3VzZUV2ZW50IHwgS2V5Ym9hcmRFdmVudCkge1xuICAgICAgaWYgKGUuZGV0YWlsKSB0aGlzLiRlbC5ibHVyKClcblxuICAgICAgdGhpcy4kZW1pdCgnY2xpY2snLCBlKVxuXG4gICAgICB0aGlzLnRvIHx8IHRoaXMudG9nZ2xlKClcbiAgICB9LFxuICAgIGdlbkF0dHJzICgpIHtcbiAgICAgIGNvbnN0IGF0dHJzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge1xuICAgICAgICAnYXJpYS1kaXNhYmxlZCc6IHRoaXMuZGlzYWJsZWQgPyB0cnVlIDogdW5kZWZpbmVkLFxuICAgICAgICB0YWJpbmRleDogdGhpcy5pc0NsaWNrYWJsZSAmJiAhdGhpcy5kaXNhYmxlZCA/IDAgOiAtMSxcbiAgICAgICAgLi4udGhpcy4kYXR0cnMsXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLiRhdHRycy5oYXNPd25Qcm9wZXJ0eSgncm9sZScpKSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmcsIHJvbGUgYWxyZWFkeSBwcm92aWRlZFxuICAgICAgfSBlbHNlIGlmICh0aGlzLmlzSW5OYXYpIHtcbiAgICAgICAgLy8gZG8gbm90aGluZywgcm9sZSBpcyBpbmhlcml0XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaXNJbkdyb3VwKSB7XG4gICAgICAgIGF0dHJzLnJvbGUgPSAnbGlzdGl0ZW0nXG4gICAgICAgIGF0dHJzWydhcmlhLXNlbGVjdGVkJ10gPSBTdHJpbmcodGhpcy5pc0FjdGl2ZSlcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0luTWVudSkge1xuICAgICAgICBhdHRycy5yb2xlID0gdGhpcy5pc0NsaWNrYWJsZSA/ICdtZW51aXRlbScgOiB1bmRlZmluZWRcbiAgICAgICAgYXR0cnMuaWQgPSBhdHRycy5pZCB8fCBgbGlzdC1pdGVtLSR7dGhpcy5fdWlkfWBcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0luTGlzdCkge1xuICAgICAgICBhdHRycy5yb2xlID0gJ2xpc3RpdGVtJ1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYXR0cnNcbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcbiAgICBsZXQgeyB0YWcsIGRhdGEgfSA9IHRoaXMuZ2VuZXJhdGVSb3V0ZUxpbmsoKVxuXG4gICAgZGF0YS5hdHRycyA9IHtcbiAgICAgIC4uLmRhdGEuYXR0cnMsXG4gICAgICAuLi50aGlzLmdlbkF0dHJzKCksXG4gICAgfVxuICAgIGRhdGFbdGhpcy50byA/ICduYXRpdmVPbicgOiAnb24nXSA9IHtcbiAgICAgIC4uLmRhdGFbdGhpcy50byA/ICduYXRpdmVPbicgOiAnb24nXSxcbiAgICAgIGtleWRvd246IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICAgIGlmIChlLmtleUNvZGUgPT09IGtleUNvZGVzLmVudGVyKSB0aGlzLmNsaWNrKGUpXG5cbiAgICAgICAgdGhpcy4kZW1pdCgna2V5ZG93bicsIGUpXG4gICAgICB9LFxuICAgIH1cblxuICAgIGlmICh0aGlzLmluYWN0aXZlKSB0YWcgPSAnZGl2J1xuICAgIGlmICh0aGlzLmluYWN0aXZlICYmIHRoaXMudG8pIHtcbiAgICAgIGRhdGEub24gPSBkYXRhLm5hdGl2ZU9uXG4gICAgICBkZWxldGUgZGF0YS5uYXRpdmVPblxuICAgIH1cblxuICAgIGNvbnN0IGNoaWxkcmVuID0gdGhpcy4kc2NvcGVkU2xvdHMuZGVmYXVsdFxuICAgICAgPyB0aGlzLiRzY29wZWRTbG90cy5kZWZhdWx0KHtcbiAgICAgICAgYWN0aXZlOiB0aGlzLmlzQWN0aXZlLFxuICAgICAgICB0b2dnbGU6IHRoaXMudG9nZ2xlLFxuICAgICAgfSlcbiAgICAgIDogdGhpcy4kc2xvdHMuZGVmYXVsdFxuXG4gICAgcmV0dXJuIGgodGFnLCB0aGlzLnNldFRleHRDb2xvcih0aGlzLmNvbG9yLCBkYXRhKSwgY2hpbGRyZW4pXG4gIH0sXG59KVxuIl19