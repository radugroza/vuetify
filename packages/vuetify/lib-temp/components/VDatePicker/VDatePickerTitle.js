import './VDatePickerTitle.sass';
// Components
import VIcon from '../VIcon';
// Mixins
import PickerButton from '../../mixins/picker-button';
// Utils
import mixins from '../../util/mixins';
export default mixins(PickerButton
/* @vue/component */
).extend({
    name: 'v-date-picker-title',
    props: {
        date: {
            type: String,
            default: '',
        },
        disabled: Boolean,
        readonly: Boolean,
        selectingYear: Boolean,
        value: {
            type: String,
        },
        year: {
            type: [Number, String],
            default: '',
        },
        yearIcon: {
            type: String,
        },
    },
    data: () => ({
        isReversing: false,
    }),
    computed: {
        computedTransition() {
            return this.isReversing ? 'picker-reverse-transition' : 'picker-transition';
        },
    },
    watch: {
        value(val, prev) {
            this.isReversing = val < prev;
        },
    },
    methods: {
        genYearIcon() {
            return this.$createElement(VIcon, {
                props: {
                    dark: true,
                },
            }, this.yearIcon);
        },
        getYearBtn() {
            return this.genPickerButton('selectingYear', true, [
                String(this.year),
                this.yearIcon ? this.genYearIcon() : null,
            ], false, 'v-date-picker-title__year');
        },
        genTitleText() {
            return this.$createElement('transition', {
                props: {
                    name: this.computedTransition,
                },
            }, [
                this.$createElement('div', {
                    domProps: { innerHTML: this.date || '&nbsp;' },
                    key: this.value,
                }),
            ]);
        },
        genTitleDate() {
            return this.genPickerButton('selectingYear', false, [this.genTitleText()], false, 'v-date-picker-title__date');
        },
    },
    render(h) {
        return h('div', {
            staticClass: 'v-date-picker-title',
            class: {
                'v-date-picker-title--disabled': this.disabled,
            },
        }, [
            this.getYearBtn(),
            this.genTitleDate(),
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkRhdGVQaWNrZXJUaXRsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZEYXRlUGlja2VyL1ZEYXRlUGlja2VyVGl0bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyx5QkFBeUIsQ0FBQTtBQUVoQyxhQUFhO0FBQ2IsT0FBTyxLQUFLLE1BQU0sVUFBVSxDQUFBO0FBRTVCLFNBQVM7QUFDVCxPQUFPLFlBQVksTUFBTSw0QkFBNEIsQ0FBQTtBQUVyRCxRQUFRO0FBQ1IsT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFLdEMsZUFBZSxNQUFNLENBQ25CLFlBQVk7QUFDZCxvQkFBb0I7Q0FDbkIsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUscUJBQXFCO0lBRTNCLEtBQUssRUFBRTtRQUNMLElBQUksRUFBRTtZQUNKLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLEVBQUU7U0FDWjtRQUNELFFBQVEsRUFBRSxPQUFPO1FBQ2pCLFFBQVEsRUFBRSxPQUFPO1FBQ2pCLGFBQWEsRUFBRSxPQUFPO1FBQ3RCLEtBQUssRUFBRTtZQUNMLElBQUksRUFBRSxNQUFNO1NBQ2I7UUFDRCxJQUFJLEVBQUU7WUFDSixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxFQUFFO1NBQ1o7UUFDRCxRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsTUFBTTtTQUNiO0tBQ0Y7SUFFRCxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNYLFdBQVcsRUFBRSxLQUFLO0tBQ25CLENBQUM7SUFFRixRQUFRLEVBQUU7UUFDUixrQkFBa0I7WUFDaEIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUE7UUFDN0UsQ0FBQztLQUNGO0lBRUQsS0FBSyxFQUFFO1FBQ0wsS0FBSyxDQUFFLEdBQVcsRUFBRSxJQUFZO1lBQzlCLElBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQTtRQUMvQixDQUFDO0tBQ0Y7SUFFRCxPQUFPLEVBQUU7UUFDUCxXQUFXO1lBQ1QsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRTtnQkFDaEMsS0FBSyxFQUFFO29CQUNMLElBQUksRUFBRSxJQUFJO2lCQUNYO2FBQ0YsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDbkIsQ0FBQztRQUNELFVBQVU7WUFDUixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsZUFBZSxFQUFFLElBQUksRUFBRTtnQkFDakQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQ2pCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSTthQUMxQyxFQUFFLEtBQUssRUFBRSwyQkFBMkIsQ0FBQyxDQUFBO1FBQ3hDLENBQUM7UUFDRCxZQUFZO1lBQ1YsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksRUFBRTtnQkFDdkMsS0FBSyxFQUFFO29CQUNMLElBQUksRUFBRSxJQUFJLENBQUMsa0JBQWtCO2lCQUM5QjthQUNGLEVBQUU7Z0JBQ0QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUU7b0JBQ3pCLFFBQVEsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSSxJQUFJLFFBQVEsRUFBRTtvQkFDOUMsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLO2lCQUNoQixDQUFDO2FBQ0gsQ0FBQyxDQUFBO1FBQ0osQ0FBQztRQUNELFlBQVk7WUFDVixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsZUFBZSxFQUFFLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSwyQkFBMkIsQ0FBQyxDQUFBO1FBQ2hILENBQUM7S0FDRjtJQUVELE1BQU0sQ0FBRSxDQUFDO1FBQ1AsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFO1lBQ2QsV0FBVyxFQUFFLHFCQUFxQjtZQUNsQyxLQUFLLEVBQUU7Z0JBQ0wsK0JBQStCLEVBQUUsSUFBSSxDQUFDLFFBQVE7YUFDL0M7U0FDRixFQUFFO1lBQ0QsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNqQixJQUFJLENBQUMsWUFBWSxFQUFFO1NBQ3BCLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4vVkRhdGVQaWNrZXJUaXRsZS5zYXNzJ1xuXG4vLyBDb21wb25lbnRzXG5pbXBvcnQgVkljb24gZnJvbSAnLi4vVkljb24nXG5cbi8vIE1peGluc1xuaW1wb3J0IFBpY2tlckJ1dHRvbiBmcm9tICcuLi8uLi9taXhpbnMvcGlja2VyLWJ1dHRvbidcblxuLy8gVXRpbHNcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZSdcblxuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFxuICBQaWNrZXJCdXR0b25cbi8qIEB2dWUvY29tcG9uZW50ICovXG4pLmV4dGVuZCh7XG4gIG5hbWU6ICd2LWRhdGUtcGlja2VyLXRpdGxlJyxcblxuICBwcm9wczoge1xuICAgIGRhdGU6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICcnLFxuICAgIH0sXG4gICAgZGlzYWJsZWQ6IEJvb2xlYW4sXG4gICAgcmVhZG9ubHk6IEJvb2xlYW4sXG4gICAgc2VsZWN0aW5nWWVhcjogQm9vbGVhbixcbiAgICB2YWx1ZToge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgIH0sXG4gICAgeWVhcjoge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6ICcnLFxuICAgIH0sXG4gICAgeWVhckljb246IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICB9LFxuICB9LFxuXG4gIGRhdGE6ICgpID0+ICh7XG4gICAgaXNSZXZlcnNpbmc6IGZhbHNlLFxuICB9KSxcblxuICBjb21wdXRlZDoge1xuICAgIGNvbXB1dGVkVHJhbnNpdGlvbiAoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiB0aGlzLmlzUmV2ZXJzaW5nID8gJ3BpY2tlci1yZXZlcnNlLXRyYW5zaXRpb24nIDogJ3BpY2tlci10cmFuc2l0aW9uJ1xuICAgIH0sXG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICB2YWx1ZSAodmFsOiBzdHJpbmcsIHByZXY6IHN0cmluZykge1xuICAgICAgdGhpcy5pc1JldmVyc2luZyA9IHZhbCA8IHByZXZcbiAgICB9LFxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBnZW5ZZWFySWNvbiAoKTogVk5vZGUge1xuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkljb24sIHtcbiAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICBkYXJrOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSwgdGhpcy55ZWFySWNvbilcbiAgICB9LFxuICAgIGdldFllYXJCdG4gKCk6IFZOb2RlIHtcbiAgICAgIHJldHVybiB0aGlzLmdlblBpY2tlckJ1dHRvbignc2VsZWN0aW5nWWVhcicsIHRydWUsIFtcbiAgICAgICAgU3RyaW5nKHRoaXMueWVhciksXG4gICAgICAgIHRoaXMueWVhckljb24gPyB0aGlzLmdlblllYXJJY29uKCkgOiBudWxsLFxuICAgICAgXSwgZmFsc2UsICd2LWRhdGUtcGlja2VyLXRpdGxlX195ZWFyJylcbiAgICB9LFxuICAgIGdlblRpdGxlVGV4dCAoKTogVk5vZGUge1xuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ3RyYW5zaXRpb24nLCB7XG4gICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgbmFtZTogdGhpcy5jb21wdXRlZFRyYW5zaXRpb24sXG4gICAgICAgIH0sXG4gICAgICB9LCBbXG4gICAgICAgIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgICAgICBkb21Qcm9wczogeyBpbm5lckhUTUw6IHRoaXMuZGF0ZSB8fCAnJm5ic3A7JyB9LFxuICAgICAgICAgIGtleTogdGhpcy52YWx1ZSxcbiAgICAgICAgfSksXG4gICAgICBdKVxuICAgIH0sXG4gICAgZ2VuVGl0bGVEYXRlICgpOiBWTm9kZSB7XG4gICAgICByZXR1cm4gdGhpcy5nZW5QaWNrZXJCdXR0b24oJ3NlbGVjdGluZ1llYXInLCBmYWxzZSwgW3RoaXMuZ2VuVGl0bGVUZXh0KCldLCBmYWxzZSwgJ3YtZGF0ZS1waWNrZXItdGl0bGVfX2RhdGUnKVxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyIChoKTogVk5vZGUge1xuICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICBzdGF0aWNDbGFzczogJ3YtZGF0ZS1waWNrZXItdGl0bGUnLFxuICAgICAgY2xhc3M6IHtcbiAgICAgICAgJ3YtZGF0ZS1waWNrZXItdGl0bGUtLWRpc2FibGVkJzogdGhpcy5kaXNhYmxlZCxcbiAgICAgIH0sXG4gICAgfSwgW1xuICAgICAgdGhpcy5nZXRZZWFyQnRuKCksXG4gICAgICB0aGlzLmdlblRpdGxlRGF0ZSgpLFxuICAgIF0pXG4gIH0sXG59KVxuIl19