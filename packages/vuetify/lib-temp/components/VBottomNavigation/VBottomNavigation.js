// Styles
import './VBottomNavigation.sass';
// Mixins
import Applicationable from '../../mixins/applicationable';
import ButtonGroup from '../../mixins/button-group';
import Colorable from '../../mixins/colorable';
import Measurable from '../../mixins/measurable';
import Proxyable from '../../mixins/proxyable';
import Scrollable from '../../mixins/scrollable';
import Themeable from '../../mixins/themeable';
import { factory as ToggleableFactory } from '../../mixins/toggleable';
// Utilities
import mixins from '../../util/mixins';
import { breaking } from '../../util/console';
export default mixins(Applicationable('bottom', [
    'height',
    'inputValue',
]), Colorable, Measurable, ToggleableFactory('inputValue'), Proxyable, Scrollable, Themeable
/* @vue/component */
).extend({
    name: 'v-bottom-navigation',
    props: {
        activeClass: {
            type: String,
            default: 'v-btn--active',
        },
        backgroundColor: String,
        grow: Boolean,
        height: {
            type: [Number, String],
            default: 56,
        },
        hideOnScroll: Boolean,
        horizontal: Boolean,
        inputValue: {
            type: Boolean,
            default: true,
        },
        mandatory: Boolean,
        shift: Boolean,
    },
    data() {
        return {
            isActive: this.inputValue,
        };
    },
    computed: {
        canScroll() {
            return (Scrollable.options.computed.canScroll.call(this) &&
                (this.hideOnScroll ||
                    !this.inputValue));
        },
        classes() {
            return {
                'v-bottom-navigation--absolute': this.absolute,
                'v-bottom-navigation--grow': this.grow,
                'v-bottom-navigation--fixed': !this.absolute && (this.app || this.fixed),
                'v-bottom-navigation--horizontal': this.horizontal,
                'v-bottom-navigation--shift': this.shift,
            };
        },
        styles() {
            return {
                ...this.measurableStyles,
                transform: this.isActive ? 'none' : 'translateY(100%)',
            };
        },
    },
    created() {
        /* istanbul ignore next */
        if (this.$attrs.hasOwnProperty('active')) {
            breaking('active.sync', 'value or v-model', this);
        }
    },
    methods: {
        thresholdMet() {
            this.isActive = !this.isScrollingUp;
            this.$emit('update:input-value', this.isActive);
        },
        updateApplication() {
            return this.$el
                ? this.$el.clientHeight
                : 0;
        },
        updateValue(val) {
            this.$emit('change', val);
        },
    },
    render(h) {
        const data = this.setBackgroundColor(this.backgroundColor, {
            staticClass: 'v-bottom-navigation',
            class: this.classes,
            style: this.styles,
            props: {
                activeClass: this.activeClass,
                mandatory: Boolean(this.mandatory ||
                    this.value !== undefined),
                value: this.internalValue,
            },
            on: { change: this.updateValue },
        });
        if (this.canScroll) {
            data.directives = data.directives || [];
            data.directives.push({
                arg: this.scrollTarget,
                name: 'scroll',
                value: this.onScroll,
            });
        }
        return h(ButtonGroup, this.setTextColor(this.color, data), this.$slots.default);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkJvdHRvbU5hdmlnYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WQm90dG9tTmF2aWdhdGlvbi9WQm90dG9tTmF2aWdhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTywwQkFBMEIsQ0FBQTtBQUVqQyxTQUFTO0FBQ1QsT0FBTyxlQUFlLE1BQU0sOEJBQThCLENBQUE7QUFDMUQsT0FBTyxXQUFXLE1BQU0sMkJBQTJCLENBQUE7QUFDbkQsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFDaEQsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFDaEQsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxFQUFFLE9BQU8sSUFBSSxpQkFBaUIsRUFBRSxNQUFNLHlCQUF5QixDQUFBO0FBRXRFLFlBQVk7QUFDWixPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQUN0QyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFLN0MsZUFBZSxNQUFNLENBQ25CLGVBQWUsQ0FBQyxRQUFRLEVBQUU7SUFDeEIsUUFBUTtJQUNSLFlBQVk7Q0FDYixDQUFDLEVBQ0YsU0FBUyxFQUNULFVBQVUsRUFDVixpQkFBaUIsQ0FBQyxZQUFZLENBQUMsRUFDL0IsU0FBUyxFQUNULFVBQVUsRUFDVixTQUFTO0FBQ1Qsb0JBQW9CO0NBQ3JCLENBQUMsTUFBTSxDQUFDO0lBQ1AsSUFBSSxFQUFFLHFCQUFxQjtJQUUzQixLQUFLLEVBQUU7UUFDTCxXQUFXLEVBQUU7WUFDWCxJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxlQUFlO1NBQ3pCO1FBQ0QsZUFBZSxFQUFFLE1BQU07UUFDdkIsSUFBSSxFQUFFLE9BQU87UUFD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Q0FBQyxTQUFTLEVBQUU7WUFDbEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQTtZQUV2QyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztnQkFDbkIsR0FBRyxFQUFFLElBQUksQ0FBQyxZQUFZO2dCQUN0QixJQUFJLEVBQUUsUUFBUTtnQkFDZCxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVE7YUFDckIsQ0FBQyxDQUFBO1NBQ0g7UUFFRCxPQUFPLENBQUMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDakYsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xuaW1wb3J0ICcuL1ZCb3R0b21OYXZpZ2F0aW9uLnNhc3MnXG5cbi8vIE1peGluc1xuaW1wb3J0IEFwcGxpY2F0aW9uYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvYXBwbGljYXRpb25hYmxlJ1xuaW1wb3J0IEJ1dHRvbkdyb3VwIGZyb20gJy4uLy4uL21peGlucy9idXR0b24tZ3JvdXAnXG5pbXBvcnQgQ29sb3JhYmxlIGZyb20gJy4uLy4uL21peGlucy9jb2xvcmFibGUnXG5pbXBvcnQgTWVhc3VyYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvbWVhc3VyYWJsZSdcbmltcG9ydCBQcm94eWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3Byb3h5YWJsZSdcbmltcG9ydCBTY3JvbGxhYmxlIGZyb20gJy4uLy4uL21peGlucy9zY3JvbGxhYmxlJ1xuaW1wb3J0IFRoZW1lYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdGhlbWVhYmxlJ1xuaW1wb3J0IHsgZmFjdG9yeSBhcyBUb2dnbGVhYmxlRmFjdG9yeSB9IGZyb20gJy4uLy4uL21peGlucy90b2dnbGVhYmxlJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5pbXBvcnQgeyBicmVha2luZyB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcblxuLy8gVHlwZXNcbmltcG9ydCB7IFZOb2RlIH0gZnJvbSAndnVlJ1xuXG5leHBvcnQgZGVmYXVsdCBtaXhpbnMoXG4gIEFwcGxpY2F0aW9uYWJsZSgnYm90dG9tJywgW1xuICAgICdoZWlnaHQnLFxuICAgICdpbnB1dFZhbHVlJyxcbiAgXSksXG4gIENvbG9yYWJsZSxcbiAgTWVhc3VyYWJsZSxcbiAgVG9nZ2xlYWJsZUZhY3RvcnkoJ2lucHV0VmFsdWUnKSxcbiAgUHJveHlhYmxlLFxuICBTY3JvbGxhYmxlLFxuICBUaGVtZWFibGVcbiAgLyogQHZ1ZS9jb21wb25lbnQgKi9cbikuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtYm90dG9tLW5hdmlnYXRpb24nLFxuXG4gIHByb3BzOiB7XG4gICAgYWN0aXZlQ2xhc3M6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICd2LWJ0bi0tYWN0aXZlJyxcbiAgICB9LFxuICAgIGJhY2tncm91bmRDb2xvcjogU3RyaW5nLFxuICAgIGdyb3c6IEJvb2xlYW4sXG4gICAgaGVpZ2h0OiB7XG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxuICAgICAgZGVmYXVsdDogNTYsXG4gICAgfSxcbiAgICBoaWRlT25TY3JvbGw6IEJvb2xlYW4sXG4gICAgaG9yaXpvbnRhbDogQm9vbGVhbixcbiAgICBpbnB1dFZhbHVlOiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB9LFxuICAgIG1hbmRhdG9yeTogQm9vbGVhbixcbiAgICBzaGlmdDogQm9vbGVhbixcbiAgfSxcblxuICBkYXRhICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaXNBY3RpdmU6IHRoaXMuaW5wdXRWYWx1ZSxcbiAgICB9XG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBjYW5TY3JvbGwgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgU2Nyb2xsYWJsZS5vcHRpb25zLmNvbXB1dGVkLmNhblNjcm9sbC5jYWxsKHRoaXMpICYmXG4gICAgICAgIChcbiAgICAgICAgICB0aGlzLmhpZGVPblNjcm9sbCB8fFxuICAgICAgICAgICF0aGlzLmlucHV0VmFsdWVcbiAgICAgICAgKVxuICAgICAgKVxuICAgIH0sXG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICd2LWJvdHRvbS1uYXZpZ2F0aW9uLS1hYnNvbHV0ZSc6IHRoaXMuYWJzb2x1dGUsXG4gICAgICAgICd2LWJvdHRvbS1uYXZpZ2F0aW9uLS1ncm93JzogdGhpcy5ncm93LFxuICAgICAgICAndi1ib3R0b20tbmF2aWdhdGlvbi0tZml4ZWQnOiAhdGhpcy5hYnNvbHV0ZSAmJiAodGhpcy5hcHAgfHwgdGhpcy5maXhlZCksXG4gICAgICAgICd2LWJvdHRvbS1uYXZpZ2F0aW9uLS1ob3Jpem9udGFsJzogdGhpcy5ob3Jpem9udGFsLFxuICAgICAgICAndi1ib3R0b20tbmF2aWdhdGlvbi0tc2hpZnQnOiB0aGlzLnNoaWZ0LFxuICAgICAgfVxuICAgIH0sXG4gICAgc3R5bGVzICgpOiBvYmplY3Qge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4udGhpcy5tZWFzdXJhYmxlU3R5bGVzLFxuICAgICAgICB0cmFuc2Zvcm06IHRoaXMuaXNBY3RpdmUgPyAnbm9uZScgOiAndHJhbnNsYXRlWSgxMDAlKScsXG4gICAgICB9XG4gICAgfSxcbiAgfSxcblxuICBjcmVhdGVkICgpIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGlmICh0aGlzLiRhdHRycy5oYXNPd25Qcm9wZXJ0eSgnYWN0aXZlJykpIHtcbiAgICAgIGJyZWFraW5nKCdhY3RpdmUuc3luYycsICd2YWx1ZSBvciB2LW1vZGVsJywgdGhpcylcbiAgICB9XG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIHRocmVzaG9sZE1ldCAoKSB7XG4gICAgICB0aGlzLmlzQWN0aXZlID0gIXRoaXMuaXNTY3JvbGxpbmdVcFxuICAgICAgdGhpcy4kZW1pdCgndXBkYXRlOmlucHV0LXZhbHVlJywgdGhpcy5pc0FjdGl2ZSlcbiAgICB9LFxuICAgIHVwZGF0ZUFwcGxpY2F0aW9uICgpOiBudW1iZXIge1xuICAgICAgcmV0dXJuIHRoaXMuJGVsXG4gICAgICAgID8gdGhpcy4kZWwuY2xpZW50SGVpZ2h0XG4gICAgICAgIDogMFxuICAgIH0sXG4gICAgdXBkYXRlVmFsdWUgKHZhbDogYW55KSB7XG4gICAgICB0aGlzLiRlbWl0KCdjaGFuZ2UnLCB2YWwpXG4gICAgfSxcbiAgfSxcblxuICByZW5kZXIgKGgpOiBWTm9kZSB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuc2V0QmFja2dyb3VuZENvbG9yKHRoaXMuYmFja2dyb3VuZENvbG9yLCB7XG4gICAgICBzdGF0aWNDbGFzczogJ3YtYm90dG9tLW5hdmlnYXRpb24nLFxuICAgICAgY2xhc3M6IHRoaXMuY2xhc3NlcyxcbiAgICAgIHN0eWxlOiB0aGlzLnN0eWxlcyxcbiAgICAgIHByb3BzOiB7XG4gICAgICAgIGFjdGl2ZUNsYXNzOiB0aGlzLmFjdGl2ZUNsYXNzLFxuICAgICAgICBtYW5kYXRvcnk6IEJvb2xlYW4oXG4gICAgICAgICAgdGhpcy5tYW5kYXRvcnkgfHxcbiAgICAgICAgICB0aGlzLnZhbHVlICE9PSB1bmRlZmluZWRcbiAgICAgICAgKSxcbiAgICAgICAgdmFsdWU6IHRoaXMuaW50ZXJuYWxWYWx1ZSxcbiAgICAgIH0sXG4gICAgICBvbjogeyBjaGFuZ2U6IHRoaXMudXBkYXRlVmFsdWUgfSxcbiAgICB9KVxuXG4gICAgaWYgKHRoaXMuY2FuU2Nyb2xsKSB7XG4gICAgICBkYXRhLmRpcmVjdGl2ZXMgPSBkYXRhLmRpcmVjdGl2ZXMgfHwgW11cblxuICAgICAgZGF0YS5kaXJlY3RpdmVzLnB1c2goe1xuICAgICAgICBhcmc6IHRoaXMuc2Nyb2xsVGFyZ2V0LFxuICAgICAgICBuYW1lOiAnc2Nyb2xsJyxcbiAgICAgICAgdmFsdWU6IHRoaXMub25TY3JvbGwsXG4gICAgICB9KVxuICAgIH1cblxuICAgIHJldHVybiBoKEJ1dHRvbkdyb3VwLCB0aGlzLnNldFRleHRDb2xvcih0aGlzLmNvbG9yLCBkYXRhKSwgdGhpcy4kc2xvdHMuZGVmYXVsdClcbiAgfSxcbn0pXG4iXX0=