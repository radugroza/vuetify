// Styles
import './VListGroup.sass';
// Components
import VIcon from '../VIcon';
import VListItem from './VListItem';
import VListItemIcon from './VListItemIcon';
// Mixins
import BindsAttrs from '../../mixins/binds-attrs';
import Bootable from '../../mixins/bootable';
import Colorable from '../../mixins/colorable';
import Toggleable from '../../mixins/toggleable';
import { inject as RegistrableInject } from '../../mixins/registrable';
// Directives
import ripple from '../../directives/ripple';
// Transitions
import { VExpandTransition } from '../transitions';
// Utils
import mixins from '../../util/mixins';
import { getSlot } from '../../util/helpers';
const baseMixins = mixins(BindsAttrs, Bootable, Colorable, RegistrableInject('list'), Toggleable);
export default baseMixins.extend().extend({
    name: 'v-list-group',
    directives: { ripple },
    props: {
        activeClass: {
            type: String,
            default: '',
        },
        appendIcon: {
            type: String,
            default: '$expand',
        },
        color: {
            type: String,
            default: 'primary',
        },
        disabled: Boolean,
        group: String,
        noAction: Boolean,
        prependIcon: String,
        ripple: {
            type: [Boolean, Object],
            default: true,
        },
        subGroup: Boolean,
    },
    computed: {
        classes() {
            return {
                'v-list-group--active': this.isActive,
                'v-list-group--disabled': this.disabled,
                'v-list-group--no-action': this.noAction,
                'v-list-group--sub-group': this.subGroup,
            };
        },
    },
    watch: {
        isActive(val) {
            /* istanbul ignore else */
            if (!this.subGroup && val) {
                this.list && this.list.listClick(this._uid);
            }
        },
        $route: 'onRouteChange',
    },
    created() {
        this.list && this.list.register(this);
        if (this.group &&
            this.$route &&
            this.value == null) {
            this.isActive = this.matchRoute(this.$route.path);
        }
    },
    beforeDestroy() {
        this.list && this.list.unregister(this);
    },
    methods: {
        click(e) {
            if (this.disabled)
                return;
            this.isBooted = true;
            this.$emit('click', e);
            this.$nextTick(() => (this.isActive = !this.isActive));
        },
        genIcon(icon) {
            return this.$createElement(VIcon, icon);
        },
        genAppendIcon() {
            const icon = !this.subGroup ? this.appendIcon : false;
            if (!icon && !this.$slots.appendIcon)
                return null;
            return this.$createElement(VListItemIcon, {
                staticClass: 'v-list-group__header__append-icon',
            }, [
                this.$slots.appendIcon || this.genIcon(icon),
            ]);
        },
        genHeader() {
            return this.$createElement(VListItem, {
                staticClass: 'v-list-group__header',
                attrs: {
                    'aria-expanded': String(this.isActive),
                    role: 'button',
                },
                class: {
                    [this.activeClass]: this.isActive,
                },
                props: {
                    inputValue: this.isActive,
                },
                directives: [{
                        name: 'ripple',
                        value: this.ripple,
                    }],
                on: {
                    ...this.listeners$,
                    click: this.click,
                },
            }, [
                this.genPrependIcon(),
                this.$slots.activator,
                this.genAppendIcon(),
            ]);
        },
        genItems() {
            return this.showLazyContent(() => [
                this.$createElement('div', {
                    staticClass: 'v-list-group__items',
                    directives: [{
                            name: 'show',
                            value: this.isActive,
                        }],
                }, getSlot(this)),
            ]);
        },
        genPrependIcon() {
            const icon = this.subGroup && this.prependIcon == null
                ? '$subgroup'
                : this.prependIcon;
            if (!icon && !this.$slots.prependIcon)
                return null;
            return this.$createElement(VListItemIcon, {
                staticClass: 'v-list-group__header__prepend-icon',
            }, [
                this.$slots.prependIcon || this.genIcon(icon),
            ]);
        },
        onRouteChange(to) {
            /* istanbul ignore if */
            if (!this.group)
                return;
            const isActive = this.matchRoute(to.path);
            /* istanbul ignore else */
            if (isActive && this.isActive !== isActive) {
                this.list && this.list.listClick(this._uid);
            }
            this.isActive = isActive;
        },
        toggle(uid) {
            const isActive = this._uid === uid;
            if (isActive)
                this.isBooted = true;
            this.$nextTick(() => (this.isActive = isActive));
        },
        matchRoute(to) {
            return to.match(this.group) !== null;
        },
    },
    render(h) {
        return h('div', this.setTextColor(this.isActive && this.color, {
            staticClass: 'v-list-group',
            class: this.classes,
        }), [
            this.genHeader(),
            h(VExpandTransition, this.genItems()),
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkxpc3RHcm91cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZMaXN0L1ZMaXN0R3JvdXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsU0FBUztBQUNULE9BQU8sbUJBQW1CLENBQUE7QUFFMUIsYUFBYTtBQUNiLE9BQU8sS0FBSyxNQUFNLFVBQVUsQ0FBQTtBQUU1QixPQUFPLFNBQVMsTUFBTSxhQUFhLENBQUE7QUFDbkMsT0FBTyxhQUFhLE1BQU0saUJBQWlCLENBQUE7QUFFM0MsU0FBUztBQUNULE9BQU8sVUFBVSxNQUFNLDBCQUEwQixDQUFBO0FBQ2pELE9BQU8sUUFBUSxNQUFNLHVCQUF1QixDQUFBO0FBQzVDLE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBQzlDLE9BQU8sVUFBVSxNQUFNLHlCQUF5QixDQUFBO0FBQ2hELE9BQU8sRUFBRSxNQUFNLElBQUksaUJBQWlCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQTtBQUV0RSxhQUFhO0FBQ2IsT0FBTyxNQUFNLE1BQU0seUJBQXlCLENBQUE7QUFFNUMsY0FBYztBQUNkLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFBO0FBRWxELFFBQVE7QUFDUixPQUFPLE1BQXNCLE1BQU0sbUJBQW1CLENBQUE7QUFDdEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBTTVDLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FDdkIsVUFBVSxFQUNWLFFBQVEsRUFDUixTQUFTLEVBQ1QsaUJBQWlCLENBQUMsTUFBTSxDQUFDLEVBQ3pCLFVBQVUsQ0FDWCxDQUFBO0FBWUQsZUFBZSxVQUFVLENBQUMsTUFBTSxFQUFXLENBQUMsTUFBTSxDQUFDO0lBQ2pELElBQUksRUFBRSxjQUFjO0lBRXBCLFVBQVUsRUFBRSxFQUFFLE1BQU0sRUFBRTtJQUV0QixLQUFLLEVBQUU7UUFDTCxXQUFXLEVBQUU7WUFDWCxJQUFJLEVBQUUs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QUFVLENBQUUsRUFBVTtZQUNwQixPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksQ0FBQTtRQUN0QyxDQUFDO0tBQ0Y7SUFFRCxNQUFNLENBQUUsQ0FBQztRQUNQLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUM3RCxXQUFXLEVBQUUsY0FBYztZQUMzQixLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU87U0FDcEIsQ0FBQyxFQUFFO1lBQ0YsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNoQixDQUFDLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ3RDLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcbmltcG9ydCAnLi9WTGlzdEdyb3VwLnNhc3MnXG5cbi8vIENvbXBvbmVudHNcbmltcG9ydCBWSWNvbiBmcm9tICcuLi9WSWNvbidcbmltcG9ydCBWTGlzdCBmcm9tICcuL1ZMaXN0J1xuaW1wb3J0IFZMaXN0SXRlbSBmcm9tICcuL1ZMaXN0SXRlbSdcbmltcG9ydCBWTGlzdEl0ZW1JY29uIGZyb20gJy4vVkxpc3RJdGVtSWNvbidcblxuLy8gTWl4aW5zXG5pbXBvcnQgQmluZHNBdHRycyBmcm9tICcuLi8uLi9taXhpbnMvYmluZHMtYXR0cnMnXG5pbXBvcnQgQm9vdGFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2Jvb3RhYmxlJ1xuaW1wb3J0IENvbG9yYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvY29sb3JhYmxlJ1xuaW1wb3J0IFRvZ2dsZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RvZ2dsZWFibGUnXG5pbXBvcnQgeyBpbmplY3QgYXMgUmVnaXN0cmFibGVJbmplY3QgfSBmcm9tICcuLi8uLi9taXhpbnMvcmVnaXN0cmFibGUnXG5cbi8vIERpcmVjdGl2ZXNcbmltcG9ydCByaXBwbGUgZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9yaXBwbGUnXG5cbi8vIFRyYW5zaXRpb25zXG5pbXBvcnQgeyBWRXhwYW5kVHJhbnNpdGlvbiB9IGZyb20gJy4uL3RyYW5zaXRpb25zJ1xuXG4vLyBVdGlsc1xuaW1wb3J0IG1peGlucywgeyBFeHRyYWN0VnVlIH0gZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5pbXBvcnQgeyBnZXRTbG90IH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgVk5vZGUgfSBmcm9tICd2dWUnXG5pbXBvcnQgeyBSb3V0ZSB9IGZyb20gJ3Z1ZS1yb3V0ZXInXG5cbmNvbnN0IGJhc2VNaXhpbnMgPSBtaXhpbnMoXG4gIEJpbmRzQXR0cnMsXG4gIEJvb3RhYmxlLFxuICBDb2xvcmFibGUsXG4gIFJlZ2lzdHJhYmxlSW5qZWN0KCdsaXN0JyksXG4gIFRvZ2dsZWFibGVcbilcblxudHlwZSBWTGlzdEluc3RhbmNlID0gSW5zdGFuY2VUeXBlPHR5cGVvZiBWTGlzdD5cblxuaW50ZXJmYWNlIG9wdGlvbnMgZXh0ZW5kcyBFeHRyYWN0VnVlPHR5cGVvZiBiYXNlTWl4aW5zPiB7XG4gIGxpc3Q6IFZMaXN0SW5zdGFuY2VcbiAgJHJlZnM6IHtcbiAgICBncm91cDogSFRNTEVsZW1lbnRcbiAgfVxuICAkcm91dGU6IFJvdXRlXG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VNaXhpbnMuZXh0ZW5kPG9wdGlvbnM+KCkuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtbGlzdC1ncm91cCcsXG5cbiAgZGlyZWN0aXZlczogeyByaXBwbGUgfSxcblxuICBwcm9wczoge1xuICAgIGFjdGl2ZUNsYXNzOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnJyxcbiAgICB9LFxuICAgIGFwcGVuZEljb246IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICckZXhwYW5kJyxcbiAgICB9LFxuICAgIGNvbG9yOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAncHJpbWFyeScsXG4gICAgfSxcbiAgICBkaXNhYmxlZDogQm9vbGVhbixcbiAgICBncm91cDogU3RyaW5nLFxuICAgIG5vQWN0aW9uOiBCb29sZWFuLFxuICAgIHByZXBlbmRJY29uOiBTdHJpbmcsXG4gICAgcmlwcGxlOiB7XG4gICAgICB0eXBlOiBbQm9vbGVhbiwgT2JqZWN0XSxcbiAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgfSxcbiAgICBzdWJHcm91cDogQm9vbGVhbixcbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAndi1saXN0LWdyb3VwLS1hY3RpdmUnOiB0aGlzLmlzQWN0aXZlLFxuICAgICAgICAndi1saXN0LWdyb3VwLS1kaXNhYmxlZCc6IHRoaXMuZGlzYWJsZWQsXG4gICAgICAgICd2LWxpc3QtZ3JvdXAtLW5vLWFjdGlvbic6IHRoaXMubm9BY3Rpb24sXG4gICAgICAgICd2LWxpc3QtZ3JvdXAtLXN1Yi1ncm91cCc6IHRoaXMuc3ViR3JvdXAsXG4gICAgICB9XG4gICAgfSxcbiAgfSxcblxuICB3YXRjaDoge1xuICAgIGlzQWN0aXZlICh2YWw6IGJvb2xlYW4pIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAoIXRoaXMuc3ViR3JvdXAgJiYgdmFsKSB7XG4gICAgICAgIHRoaXMubGlzdCAmJiB0aGlzLmxpc3QubGlzdENsaWNrKHRoaXMuX3VpZClcbiAgICAgIH1cbiAgICB9LFxuICAgICRyb3V0ZTogJ29uUm91dGVDaGFuZ2UnLFxuICB9LFxuXG4gIGNyZWF0ZWQgKCkge1xuICAgIHRoaXMubGlzdCAmJiB0aGlzLmxpc3QucmVnaXN0ZXIodGhpcylcblxuICAgIGlmICh0aGlzLmdyb3VwICYmXG4gICAgICB0aGlzLiRyb3V0ZSAmJlxuICAgICAgdGhpcy52YWx1ZSA9PSBudWxsXG4gICAgKSB7XG4gICAgICB0aGlzLmlzQWN0aXZlID0gdGhpcy5tYXRjaFJvdXRlKHRoaXMuJHJvdXRlLnBhdGgpXG4gICAgfVxuICB9LFxuXG4gIGJlZm9yZURlc3Ryb3kgKCkge1xuICAgIHRoaXMubGlzdCAmJiB0aGlzLmxpc3QudW5yZWdpc3Rlcih0aGlzKVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBjbGljayAoZTogRXZlbnQpIHtcbiAgICAgIGlmICh0aGlzLmRpc2FibGVkKSByZXR1cm5cblxuICAgICAgdGhpcy5pc0Jvb3RlZCA9IHRydWVcblxuICAgICAgdGhpcy4kZW1pdCgnY2xpY2snLCBlKVxuICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4gKHRoaXMuaXNBY3RpdmUgPSAhdGhpcy5pc0FjdGl2ZSkpXG4gICAgfSxcbiAgICBnZW5JY29uIChpY29uOiBzdHJpbmcgfCBmYWxzZSk6IFZOb2RlIHtcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZJY29uLCBpY29uKVxuICAgIH0sXG4gICAgZ2VuQXBwZW5kSWNvbiAoKTogVk5vZGUgfCBudWxsIHtcbiAgICAgIGNvbnN0IGljb24gPSAhdGhpcy5zdWJHcm91cCA/IHRoaXMuYXBwZW5kSWNvbiA6IGZhbHNlXG5cbiAgICAgIGlmICghaWNvbiAmJiAhdGhpcy4kc2xvdHMuYXBwZW5kSWNvbikgcmV0dXJuIG51bGxcblxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkxpc3RJdGVtSWNvbiwge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3YtbGlzdC1ncm91cF9faGVhZGVyX19hcHBlbmQtaWNvbicsXG4gICAgICB9LCBbXG4gICAgICAgIHRoaXMuJHNsb3RzLmFwcGVuZEljb24gfHwgdGhpcy5nZW5JY29uKGljb24pLFxuICAgICAgXSlcbiAgICB9LFxuICAgIGdlbkhlYWRlciAoKTogVk5vZGUge1xuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkxpc3RJdGVtLCB7XG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1saXN0LWdyb3VwX19oZWFkZXInLFxuICAgICAgICBhdHRyczoge1xuICAgICAgICAgICdhcmlhLWV4cGFuZGVkJzogU3RyaW5nKHRoaXMuaXNBY3RpdmUpLFxuICAgICAgICAgIHJvbGU6ICdidXR0b24nLFxuICAgICAgICB9LFxuICAgICAgICBjbGFzczoge1xuICAgICAgICAgIFt0aGlzLmFjdGl2ZUNsYXNzXTogdGhpcy5pc0FjdGl2ZSxcbiAgICAgICAgfSxcbiAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICBpbnB1dFZhbHVlOiB0aGlzLmlzQWN0aXZlLFxuICAgICAgICB9LFxuICAgICAgICBkaXJlY3RpdmVzOiBbe1xuICAgICAgICAgIG5hbWU6ICdyaXBwbGUnLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLnJpcHBsZSxcbiAgICAgICAgfV0sXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgLi4udGhpcy5saXN0ZW5lcnMkLFxuICAgICAgICAgIGNsaWNrOiB0aGlzLmNsaWNrLFxuICAgICAgICB9LFxuICAgICAgfSwgW1xuICAgICAgICB0aGlzLmdlblByZXBlbmRJY29uKCksXG4gICAgICAgIHRoaXMuJHNsb3RzLmFjdGl2YXRvcixcbiAgICAgICAgdGhpcy5nZW5BcHBlbmRJY29uKCksXG4gICAgICBdKVxuICAgIH0sXG4gICAgZ2VuSXRlbXMgKCk6IFZOb2RlW10ge1xuICAgICAgcmV0dXJuIHRoaXMuc2hvd0xhenlDb250ZW50KCgpID0+IFtcbiAgICAgICAgdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICAgIHN0YXRpY0NsYXNzOiAndi1saXN0LWdyb3VwX19pdGVtcycsXG4gICAgICAgICAgZGlyZWN0aXZlczogW3tcbiAgICAgICAgICAgIG5hbWU6ICdzaG93JyxcbiAgICAgICAgICAgIHZhbHVlOiB0aGlzLmlzQWN0aXZlLFxuICAgICAgICAgIH1dLFxuICAgICAgICB9LCBnZXRTbG90KHRoaXMpKSxcbiAgICAgIF0pXG4gICAgfSxcbiAgICBnZW5QcmVwZW5kSWNvbiAoKTogVk5vZGUgfCBudWxsIHtcbiAgICAgIGNvbnN0IGljb24gPSB0aGlzLnN1Ykdyb3VwICYmIHRoaXMucHJlcGVuZEljb24gPT0gbnVsbFxuICAgICAgICA/ICckc3ViZ3JvdXAnXG4gICAgICAgIDogdGhpcy5wcmVwZW5kSWNvblxuXG4gICAgICBpZiAoIWljb24gJiYgIXRoaXMuJHNsb3RzLnByZXBlbmRJY29uKSByZXR1cm4gbnVsbFxuXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudChWTGlzdEl0ZW1JY29uLCB7XG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1saXN0LWdyb3VwX19oZWFkZXJfX3ByZXBlbmQtaWNvbicsXG4gICAgICB9LCBbXG4gICAgICAgIHRoaXMuJHNsb3RzLnByZXBlbmRJY29uIHx8IHRoaXMuZ2VuSWNvbihpY29uKSxcbiAgICAgIF0pXG4gICAgfSxcbiAgICBvblJvdXRlQ2hhbmdlICh0bzogUm91dGUpIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgaWYgKCF0aGlzLmdyb3VwKSByZXR1cm5cblxuICAgICAgY29uc3QgaXNBY3RpdmUgPSB0aGlzLm1hdGNoUm91dGUodG8ucGF0aClcblxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgIGlmIChpc0FjdGl2ZSAmJiB0aGlzLmlzQWN0aXZlICE9PSBpc0FjdGl2ZSkge1xuICAgICAgICB0aGlzLmxpc3QgJiYgdGhpcy5saXN0Lmxpc3RDbGljayh0aGlzLl91aWQpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuaXNBY3RpdmUgPSBpc0FjdGl2ZVxuICAgIH0sXG4gICAgdG9nZ2xlICh1aWQ6IG51bWJlcikge1xuICAgICAgY29uc3QgaXNBY3RpdmUgPSB0aGlzLl91aWQgPT09IHVpZFxuXG4gICAgICBpZiAoaXNBY3RpdmUpIHRoaXMuaXNCb290ZWQgPSB0cnVlXG4gICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiAodGhpcy5pc0FjdGl2ZSA9IGlzQWN0aXZlKSlcbiAgICB9LFxuICAgIG1hdGNoUm91dGUgKHRvOiBzdHJpbmcpIHtcbiAgICAgIHJldHVybiB0by5tYXRjaCh0aGlzLmdyb3VwKSAhPT0gbnVsbFxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyIChoKTogVk5vZGUge1xuICAgIHJldHVybiBoKCdkaXYnLCB0aGlzLnNldFRleHRDb2xvcih0aGlzLmlzQWN0aXZlICYmIHRoaXMuY29sb3IsIHtcbiAgICAgIHN0YXRpY0NsYXNzOiAndi1saXN0LWdyb3VwJyxcbiAgICAgIGNsYXNzOiB0aGlzLmNsYXNzZXMsXG4gICAgfSksIFtcbiAgICAgIHRoaXMuZ2VuSGVhZGVyKCksXG4gICAgICBoKFZFeHBhbmRUcmFuc2l0aW9uLCB0aGlzLmdlbkl0ZW1zKCkpLFxuICAgIF0pXG4gIH0sXG59KVxuIl19