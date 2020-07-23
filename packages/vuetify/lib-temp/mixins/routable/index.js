import Vue from 'vue';
// Directives
import Ripple from '../../directives/ripple';
// Utilities
import { getObjectValueByPath } from '../../util/helpers';
export default Vue.extend({
    name: 'routable',
    directives: {
        Ripple,
    },
    props: {
        activeClass: String,
        append: Boolean,
        disabled: Boolean,
        exact: {
            type: Boolean,
            default: undefined,
        },
        exactActiveClass: String,
        link: Boolean,
        href: [String, Object],
        to: [String, Object],
        nuxt: Boolean,
        replace: Boolean,
        ripple: {
            type: [Boolean, Object],
            default: null,
        },
        tag: String,
        target: String,
    },
    data: () => ({
        isActive: false,
        proxyClass: '',
    }),
    computed: {
        classes() {
            const classes = {};
            if (this.to)
                return classes;
            if (this.activeClass)
                classes[this.activeClass] = this.isActive;
            if (this.proxyClass)
                classes[this.proxyClass] = this.isActive;
            return classes;
        },
        computedRipple() {
            return this.ripple != null ? this.ripple : !this.disabled && this.isClickable;
        },
        isClickable() {
            if (this.disabled)
                return false;
            return Boolean(this.isLink ||
                this.$listeners.click ||
                this.$listeners['!click'] ||
                this.$attrs.tabindex);
        },
        isLink() {
            return this.to || this.href || this.link;
        },
        styles: () => ({}),
    },
    watch: {
        $route: 'onRouteChange',
    },
    methods: {
        click(e) {
            this.$emit('click', e);
        },
        generateRouteLink() {
            let exact = this.exact;
            let tag;
            const data = {
                attrs: {
                    tabindex: 'tabindex' in this.$attrs ? this.$attrs.tabindex : undefined,
                },
                class: this.classes,
                style: this.styles,
                props: {},
                directives: [{
                        name: 'ripple',
                        value: this.computedRipple,
                    }],
                [this.to ? 'nativeOn' : 'on']: {
                    ...this.$listeners,
                    click: this.click,
                },
                ref: 'link',
            };
            if (typeof this.exact === 'undefined') {
                exact = this.to === '/' ||
                    (this.to === Object(this.to) && this.to.path === '/');
            }
            if (this.to) {
                // Add a special activeClass hook
                // for component level styles
                let activeClass = this.activeClass;
                let exactActiveClass = this.exactActiveClass || activeClass;
                if (this.proxyClass) {
                    activeClass = `${activeClass} ${this.proxyClass}`.trim();
                    exactActiveClass = `${exactActiveClass} ${this.proxyClass}`.trim();
                }
                tag = this.nuxt ? 'nuxt-link' : 'router-link';
                Object.assign(data.props, {
                    to: this.to,
                    exact,
                    activeClass,
                    exactActiveClass,
                    append: this.append,
                    replace: this.replace,
                });
            }
            else {
                tag = (this.href && 'a') || this.tag || 'div';
                if (tag === 'a' && this.href)
                    data.attrs.href = this.href;
            }
            if (this.target)
                data.attrs.target = this.target;
            return { tag, data };
        },
        onRouteChange() {
            if (!this.to || !this.$refs.link || !this.$route)
                return;
            const activeClass = `${this.activeClass} ${this.proxyClass || ''}`.trim();
            const path = `_vnode.data.class.${activeClass}`;
            this.$nextTick(() => {
                /* istanbul ignore else */
                if (getObjectValueByPath(this.$refs.link, path)) {
                    this.toggle();
                }
            });
        },
        toggle: () => { },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL3JvdXRhYmxlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sR0FBNEIsTUFBTSxLQUFLLENBQUE7QUFFOUMsYUFBYTtBQUNiLE9BQU8sTUFBeUIsTUFBTSx5QkFBeUIsQ0FBQTtBQUUvRCxZQUFZO0FBQ1osT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFFekQsZUFBZSxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQ3hCLElBQUksRUFBRSxVQUFVO0lBRWhCLFVBQVUsRUFBRTtRQUNWLE1BQU07S0FDUDtJQUVELEtBQUssRUFBRTtRQUNMLFdBQVcsRUFBRSxNQUFNO1FBQ25CLE1BQU0sRUFBRSxPQUFPO1FBQ2YsUUFBUSxFQUFFLE9BQU87UUFDakIsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLE9BQXdDO1lBQzlDLE9BQU8sRUFBRSxTQUFTO1NBQ25CO1FBQ0QsZ0JBQWdCLEVBQUUsTUFBTTtRQUN4QixJQUFJLEVBQUUsT0FBTztRQUNiLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7UUFDdEIsRUFBRSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztRQUNwQixJQUFJLEVBQUUsT0FBTztRQUNiLE9BQU8sRUFBRSxPQUFPO1FBQ2hCLE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUM7WUFDdkIsT0FBTyxFQUFFLElBQUk7U0FDZDtRQUNELEdBQUcsRUFBRSxNQUFNO1FBQ1gsTUFBTSxFQUFFLE1BQU07S0FDZjtJQUVELElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ1gsUUFBUSxFQUFFLEtBQUs7UUFDZixVQUFVLEVBQUUsRUFBRTtLQUNmLENBQUM7SUFFRixRQUFRLEVBQUU7UUFDUixPQUFPO1lBQ0wsTUFBTSxPQUFPLEdBQTRCLEVB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QUMsSUFBSSxDQUFDLE1BQU07Z0JBQUUsT0FBTTtZQUN4RCxNQUFNLFdBQVcsR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtZQUV6RSxNQUFNLElBQUksR0FBRyxxQkFBcUIsV0FBVyxFQUFFLENBQUE7WUFFL0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2xCLDBCQUEwQjtnQkFDMUIsSUFBSSxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRTtvQkFDL0MsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO2lCQUNkO1lBQ0gsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDO1FBQ0QsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFjLENBQUM7S0FDN0I7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVnVlLCB7IFZOb2RlRGF0YSwgUHJvcFR5cGUgfSBmcm9tICd2dWUnXG5cbi8vIERpcmVjdGl2ZXNcbmltcG9ydCBSaXBwbGUsIHsgUmlwcGxlT3B0aW9ucyB9IGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvcmlwcGxlJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCB7IGdldE9iamVjdFZhbHVlQnlQYXRoIH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuXG5leHBvcnQgZGVmYXVsdCBWdWUuZXh0ZW5kKHtcbiAgbmFtZTogJ3JvdXRhYmxlJyxcblxuICBkaXJlY3RpdmVzOiB7XG4gICAgUmlwcGxlLFxuICB9LFxuXG4gIHByb3BzOiB7XG4gICAgYWN0aXZlQ2xhc3M6IFN0cmluZyxcbiAgICBhcHBlbmQ6IEJvb2xlYW4sXG4gICAgZGlzYWJsZWQ6IEJvb2xlYW4sXG4gICAgZXhhY3Q6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4gYXMgUHJvcFR5cGU8Ym9vbGVhbiB8IHVuZGVmaW5lZD4sXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgfSxcbiAgICBleGFjdEFjdGl2ZUNsYXNzOiBTdHJpbmcsXG4gICAgbGluazogQm9vbGVhbixcbiAgICBocmVmOiBbU3RyaW5nLCBPYmplY3RdLFxuICAgIHRvOiBbU3RyaW5nLCBPYmplY3RdLFxuICAgIG51eHQ6IEJvb2xlYW4sXG4gICAgcmVwbGFjZTogQm9vbGVhbixcbiAgICByaXBwbGU6IHtcbiAgICAgIHR5cGU6IFtCb29sZWFuLCBPYmplY3RdLFxuICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICB9LFxuICAgIHRhZzogU3RyaW5nLFxuICAgIHRhcmdldDogU3RyaW5nLFxuICB9LFxuXG4gIGRhdGE6ICgpID0+ICh7XG4gICAgaXNBY3RpdmU6IGZhbHNlLFxuICAgIHByb3h5Q2xhc3M6ICcnLFxuICB9KSxcblxuICBjb21wdXRlZDoge1xuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICBjb25zdCBjbGFzc2VzOiBSZWNvcmQ8c3RyaW5nLCBib29sZWFuPiA9IHt9XG5cbiAgICAgIGlmICh0aGlzLnRvKSByZXR1cm4gY2xhc3Nlc1xuXG4gICAgICBpZiAodGhpcy5hY3RpdmVDbGFzcykgY2xhc3Nlc1t0aGlzLmFjdGl2ZUNsYXNzXSA9IHRoaXMuaXNBY3RpdmVcbiAgICAgIGlmICh0aGlzLnByb3h5Q2xhc3MpIGNsYXNzZXNbdGhpcy5wcm94eUNsYXNzXSA9IHRoaXMuaXNBY3RpdmVcblxuICAgICAgcmV0dXJuIGNsYXNzZXNcbiAgICB9LFxuICAgIGNvbXB1dGVkUmlwcGxlICgpOiBSaXBwbGVPcHRpb25zIHwgYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5yaXBwbGUgIT0gbnVsbCA/IHRoaXMucmlwcGxlIDogIXRoaXMuZGlzYWJsZWQgJiYgdGhpcy5pc0NsaWNrYWJsZVxuICAgIH0sXG4gICAgaXNDbGlja2FibGUgKCk6IGJvb2xlYW4ge1xuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHJldHVybiBmYWxzZVxuXG4gICAgICByZXR1cm4gQm9vbGVhbihcbiAgICAgICAgdGhpcy5pc0xpbmsgfHxcbiAgICAgICAgdGhpcy4kbGlzdGVuZXJzLmNsaWNrIHx8XG4gICAgICAgIHRoaXMuJGxpc3RlbmVyc1snIWNsaWNrJ10gfHxcbiAgICAgICAgdGhpcy4kYXR0cnMudGFiaW5kZXhcbiAgICAgIClcbiAgICB9LFxuICAgIGlzTGluayAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy50byB8fCB0aGlzLmhyZWYgfHwgdGhpcy5saW5rXG4gICAgfSxcbiAgICBzdHlsZXM6ICgpID0+ICh7fSksXG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICAkcm91dGU6ICdvblJvdXRlQ2hhbmdlJyxcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgY2xpY2sgKGU6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICAgIHRoaXMuJGVtaXQoJ2NsaWNrJywgZSlcbiAgICB9LFxuICAgIGdlbmVyYXRlUm91dGVMaW5rICgpIHtcbiAgICAgIGxldCBleGFjdCA9IHRoaXMuZXhhY3RcbiAgICAgIGxldCB0YWdcblxuICAgICAgY29uc3QgZGF0YTogVk5vZGVEYXRhID0ge1xuICAgICAgICBhdHRyczoge1xuICAgICAgICAgIHRhYmluZGV4OiAndGFiaW5kZXgnIGluIHRoaXMuJGF0dHJzID8gdGhpcy4kYXR0cnMudGFiaW5kZXggOiB1bmRlZmluZWQsXG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzOiB0aGlzLmNsYXNzZXMsXG4gICAgICAgIHN0eWxlOiB0aGlzLnN0eWxlcyxcbiAgICAgICAgcHJvcHM6IHt9LFxuICAgICAgICBkaXJlY3RpdmVzOiBbe1xuICAgICAgICAgIG5hbWU6ICdyaXBwbGUnLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLmNvbXB1dGVkUmlwcGxlLFxuICAgICAgICB9XSxcbiAgICAgICAgW3RoaXMudG8gPyAnbmF0aXZlT24nIDogJ29uJ106IHtcbiAgICAgICAgICAuLi50aGlzLiRsaXN0ZW5lcnMsXG4gICAgICAgICAgY2xpY2s6IHRoaXMuY2xpY2ssXG4gICAgICAgIH0sXG4gICAgICAgIHJlZjogJ2xpbmsnLFxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHRoaXMuZXhhY3QgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGV4YWN0ID0gdGhpcy50byA9PT0gJy8nIHx8XG4gICAgICAgICAgKHRoaXMudG8gPT09IE9iamVjdCh0aGlzLnRvKSAmJiB0aGlzLnRvLnBhdGggPT09ICcvJylcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMudG8pIHtcbiAgICAgICAgLy8gQWRkIGEgc3BlY2lhbCBhY3RpdmVDbGFzcyBob29rXG4gICAgICAgIC8vIGZvciBjb21wb25lbnQgbGV2ZWwgc3R5bGVzXG4gICAgICAgIGxldCBhY3RpdmVDbGFzcyA9IHRoaXMuYWN0aXZlQ2xhc3NcbiAgICAgICAgbGV0IGV4YWN0QWN0aXZlQ2xhc3MgPSB0aGlzLmV4YWN0QWN0aXZlQ2xhc3MgfHwgYWN0aXZlQ2xhc3NcblxuICAgICAgICBpZiAodGhpcy5wcm94eUNsYXNzKSB7XG4gICAgICAgICAgYWN0aXZlQ2xhc3MgPSBgJHthY3RpdmVDbGFzc30gJHt0aGlzLnByb3h5Q2xhc3N9YC50cmltKClcbiAgICAgICAgICBleGFjdEFjdGl2ZUNsYXNzID0gYCR7ZXhhY3RBY3RpdmVDbGFzc30gJHt0aGlzLnByb3h5Q2xhc3N9YC50cmltKClcbiAgICAgICAgfVxuXG4gICAgICAgIHRhZyA9IHRoaXMubnV4dCA/ICdudXh0LWxpbmsnIDogJ3JvdXRlci1saW5rJ1xuICAgICAgICBPYmplY3QuYXNzaWduKGRhdGEucHJvcHMsIHtcbiAgICAgICAgICB0bzogdGhpcy50byxcbiAgICAgICAgICBleGFjdCxcbiAgICAgICAgICBhY3RpdmVDbGFzcyxcbiAgICAgICAgICBleGFjdEFjdGl2ZUNsYXNzLFxuICAgICAgICAgIGFwcGVuZDogdGhpcy5hcHBlbmQsXG4gICAgICAgICAgcmVwbGFjZTogdGhpcy5yZXBsYWNlLFxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFnID0gKHRoaXMuaHJlZiAmJiAnYScpIHx8IHRoaXMudGFnIHx8ICdkaXYnXG5cbiAgICAgICAgaWYgKHRhZyA9PT0gJ2EnICYmIHRoaXMuaHJlZikgZGF0YS5hdHRycyEuaHJlZiA9IHRoaXMuaHJlZlxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy50YXJnZXQpIGRhdGEuYXR0cnMhLnRhcmdldCA9IHRoaXMudGFyZ2V0XG5cbiAgICAgIHJldHVybiB7IHRhZywgZGF0YSB9XG4gICAgfSxcbiAgICBvblJvdXRlQ2hhbmdlICgpIHtcbiAgICAgIGlmICghdGhpcy50byB8fCAhdGhpcy4kcmVmcy5saW5rIHx8ICF0aGlzLiRyb3V0ZSkgcmV0dXJuXG4gICAgICBjb25zdCBhY3RpdmVDbGFzcyA9IGAke3RoaXMuYWN0aXZlQ2xhc3N9ICR7dGhpcy5wcm94eUNsYXNzIHx8ICcnfWAudHJpbSgpXG5cbiAgICAgIGNvbnN0IHBhdGggPSBgX3Zub2RlLmRhdGEuY2xhc3MuJHthY3RpdmVDbGFzc31gXG5cbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgICAgaWYgKGdldE9iamVjdFZhbHVlQnlQYXRoKHRoaXMuJHJlZnMubGluaywgcGF0aCkpIHtcbiAgICAgICAgICB0aGlzLnRvZ2dsZSgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSxcbiAgICB0b2dnbGU6ICgpID0+IHsgLyogbm9vcCAqLyB9LFxuICB9LFxufSlcbiJdfQ==