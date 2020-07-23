// Components
import VInput from '../../components/VInput';
// Mixins
import Rippleable from '../rippleable';
import Comparable from '../comparable';
// Utilities
import mixins from '../../util/mixins';
/* @vue/component */
export default mixins(VInput, Rippleable, Comparable).extend({
    name: 'selectable',
    model: {
        prop: 'inputValue',
        event: 'change',
    },
    props: {
        id: String,
        inputValue: null,
        falseValue: null,
        trueValue: null,
        multiple: {
            type: Boolean,
            default: null,
        },
        label: String,
    },
    data() {
        return {
            hasColor: this.inputValue,
            lazyValue: this.inputValue,
        };
    },
    computed: {
        computedColor() {
            if (!this.isActive)
                return undefined;
            if (this.color)
                return this.color;
            if (this.isDark && !this.appIsDark)
                return 'white';
            return 'primary';
        },
        isMultiple() {
            return this.multiple === true || (this.multiple === null && Array.isArray(this.internalValue));
        },
        isActive() {
            const value = this.value;
            const input = this.internalValue;
            if (this.isMultiple) {
                if (!Array.isArray(input))
                    return false;
                return input.some(item => this.valueComparator(item, value));
            }
            if (this.trueValue === undefined || this.falseValue === undefined) {
                return value
                    ? this.valueComparator(value, input)
                    : Boolean(input);
            }
            return this.valueComparator(input, this.trueValue);
        },
        isDirty() {
            return this.isActive;
        },
        rippleState() {
            return !this.isDisabled && !this.validationState
                ? undefined
                : this.validationState;
        },
    },
    watch: {
        inputValue(val) {
            this.lazyValue = val;
            this.hasColor = val;
        },
    },
    methods: {
        genLabel() {
            const label = VInput.options.methods.genLabel.call(this);
            if (!label)
                return label;
            label.data.on = {
                click: (e) => {
                    // Prevent label from
                    // causing the input
                    // to focus
                    e.preventDefault();
                    this.onChange();
                },
            };
            return label;
        },
        genInput(type, attrs) {
            return this.$createElement('input', {
                attrs: Object.assign({
                    'aria-checked': this.isActive.toString(),
                    disabled: this.isDisabled,
                    id: this.computedId,
                    role: type,
                    type,
                }, attrs),
                domProps: {
                    value: this.value,
                    checked: this.isActive,
                },
                on: {
                    blur: this.onBlur,
                    change: this.onChange,
                    focus: this.onFocus,
                    keydown: this.onKeydown,
                },
                ref: 'input',
            });
        },
        onBlur() {
            this.isFocused = false;
        },
        onChange() {
            if (!this.isInteractive)
                return;
            const value = this.value;
            let input = this.internalValue;
            if (this.isMultiple) {
                if (!Array.isArray(input)) {
                    input = [];
                }
                const length = input.length;
                input = input.filter((item) => !this.valueComparator(item, value));
                if (input.length === length) {
                    input.push(value);
                }
            }
            else if (this.trueValue !== undefined && this.falseValue !== undefined) {
                input = this.valueComparator(input, this.trueValue) ? this.falseValue : this.trueValue;
            }
            else if (value) {
                input = this.valueComparator(input, value) ? null : value;
            }
            else {
                input = !input;
            }
            this.validate(true, input);
            this.internalValue = input;
            this.hasColor = input;
        },
        onFocus() {
            this.isFocused = true;
        },
        /** @abstract */
        onKeydown(e) { },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL3NlbGVjdGFibGUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsYUFBYTtBQUNiLE9BQU8sTUFBTSxNQUFNLHlCQUF5QixDQUFBO0FBRTVDLFNBQVM7QUFDVCxPQUFPLFVBQVUsTUFBTSxlQUFlLENBQUE7QUFDdEMsT0FBTyxVQUFVLE1BQU0sZUFBZSxDQUFBO0FBRXRDLFlBQVk7QUFDWixPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQUV0QyxvQkFBb0I7QUFDcEIsZUFBZSxNQUFNLENBQ25CLE1BQU0sRUFDTixVQUFVLEVBQ1YsVUFBVSxDQUNYLENBQUMsTUFBTSxDQUFDO0lBQ1AsSUFBSSxFQUFFLFlBQVk7SUFFbEIsS0FBSyxFQUFFO1FBQ0wsSUFBSSxFQUFFLFlBQVk7UUFDbEIsS0FBSyxFQUFFLFFBQVE7S0FDaEI7SUFFRCxLQUFLLEVBQUU7UUFDTCxFQUFFLEVBQUUsTUFBTTtRQUNWLFVBQVUsRUFBRSxJQUFXO1FBQ3ZCLFVBQVUsRUFBRSxJQUFXO1FBQ3ZCLFNBQVMsRUFBRSxJQUFXO1FBQ3RCLFFBQVEsRUFBRTtZQUNSLElBQUksRUFBRSxPQUFPO1lBQ2IsT0FBTyxFQUFFLElBQUk7U0FDZDtRQUNELEtBQUssRUFBRSxNQUFNO0tBQ2Q7SUFFRCxJQUFJO1FBQ0YsT0FBTztZQUNMLFFBQVEsRUFBRSxJQUFJLENBQUMsVUFBVTtZQUN6QixTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVU7U0FDM0IsQ0FBQTtJQUNILENBQUM7SUFFRCxRQUFRLEVBQUU7UUFDUixhQUFhO1lBQ1gsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRO2dCQUFFLE9BQU8sU0FBUyxDQUFBO1lBQ3BDLElBQUksSUFBSSxDQUFDLEtBQUs7Z0JBQUUsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFBO1lBQ2pDLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLElB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LElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQTthQUN2RjtpQkFBTSxJQUFJLEtBQUssRUFBRTtnQkFDaEIsS0FBSyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQTthQUMxRDtpQkFBTTtnQkFDTCxLQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUE7YUFDZjtZQUVELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFBO1lBQzFCLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFBO1lBQzFCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFBO1FBQ3ZCLENBQUM7UUFDRCxPQUFPO1lBQ0wsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUE7UUFDdkIsQ0FBQztRQUNELGdCQUFnQjtRQUNoQixTQUFTLENBQUUsQ0FBUSxJQUFHLENBQUM7S0FDeEI7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb21wb25lbnRzXG5pbXBvcnQgVklucHV0IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvVklucHV0J1xuXG4vLyBNaXhpbnNcbmltcG9ydCBSaXBwbGVhYmxlIGZyb20gJy4uL3JpcHBsZWFibGUnXG5pbXBvcnQgQ29tcGFyYWJsZSBmcm9tICcuLi9jb21wYXJhYmxlJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBtaXhpbnMoXG4gIFZJbnB1dCxcbiAgUmlwcGxlYWJsZSxcbiAgQ29tcGFyYWJsZVxuKS5leHRlbmQoe1xuICBuYW1lOiAnc2VsZWN0YWJsZScsXG5cbiAgbW9kZWw6IHtcbiAgICBwcm9wOiAnaW5wdXRWYWx1ZScsXG4gICAgZXZlbnQ6ICdjaGFuZ2UnLFxuICB9LFxuXG4gIHByb3BzOiB7XG4gICAgaWQ6IFN0cmluZyxcbiAgICBpbnB1dFZhbHVlOiBudWxsIGFzIGFueSxcbiAgICBmYWxzZVZhbHVlOiBudWxsIGFzIGFueSxcbiAgICB0cnVlVmFsdWU6IG51bGwgYXMgYW55LFxuICAgIG11bHRpcGxlOiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICB9LFxuICAgIGxhYmVsOiBTdHJpbmcsXG4gIH0sXG5cbiAgZGF0YSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhhc0NvbG9yOiB0aGlzLmlucHV0VmFsdWUsXG4gICAgICBsYXp5VmFsdWU6IHRoaXMuaW5wdXRWYWx1ZSxcbiAgICB9XG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBjb21wdXRlZENvbG9yICgpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgICAgaWYgKCF0aGlzLmlzQWN0aXZlKSByZXR1cm4gdW5kZWZpbmVkXG4gICAgICBpZiAodGhpcy5jb2xvcikgcmV0dXJuIHRoaXMuY29sb3JcbiAgICAgIGlmICh0aGlzLmlzRGFyayAmJiAhdGhpcy5hcHBJc0RhcmspIHJldHVybiAnd2hpdGUnXG4gICAgICByZXR1cm4gJ3ByaW1hcnknXG4gICAgfSxcbiAgICBpc011bHRpcGxlICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLm11bHRpcGxlID09PSB0cnVlIHx8ICh0aGlzLm11bHRpcGxlID09PSBudWxsICYmIEFycmF5LmlzQXJyYXkodGhpcy5pbnRlcm5hbFZhbHVlKSlcbiAgICB9LFxuICAgIGlzQWN0aXZlICgpOiBib29sZWFuIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy52YWx1ZVxuICAgICAgY29uc3QgaW5wdXQgPSB0aGlzLmludGVybmFsVmFsdWVcblxuICAgICAgaWYgKHRoaXMuaXNNdWx0aXBsZSkge1xuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoaW5wdXQpKSByZXR1cm4gZmFsc2VcblxuICAgICAgICByZXR1cm4gaW5wdXQuc29tZShpdGVtID0+IHRoaXMudmFsdWVDb21wYXJhdG9yKGl0ZW0sIHZhbHVlKSlcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMudHJ1ZVZhbHVlID09PSB1bmRlZmluZWQgfHwgdGhpcy5mYWxzZVZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlXG4gICAgICAgICAgPyB0aGlzLnZhbHVlQ29tcGFyYXRvcih2YWx1ZSwgaW5wdXQpXG4gICAgICAgICAgOiBCb29sZWFuKGlucHV0KVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy52YWx1ZUNvbXBhcmF0b3IoaW5wdXQsIHRoaXMudHJ1ZVZhbHVlKVxuICAgIH0sXG4gICAgaXNEaXJ0eSAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5pc0FjdGl2ZVxuICAgIH0sXG4gICAgcmlwcGxlU3RhdGUgKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICByZXR1cm4gIXRoaXMuaXNEaXNhYmxlZCAmJiAhdGhpcy52YWxpZGF0aW9uU3RhdGVcbiAgICAgICAgPyB1bmRlZmluZWRcbiAgICAgICAgOiB0aGlzLnZhbGlkYXRpb25TdGF0ZVxuICAgIH0sXG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICBpbnB1dFZhbHVlICh2YWwpIHtcbiAgICAgIHRoaXMubGF6eVZhbHVlID0gdmFsXG4gICAgICB0aGlzLmhhc0NvbG9yID0gdmFsXG4gICAgfSxcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgZ2VuTGFiZWwgKCkge1xuICAgICAgY29uc3QgbGFiZWwgPSBWSW5wdXQub3B0aW9ucy5tZXRob2RzLmdlbkxhYmVsLmNhbGwodGhpcylcblxuICAgICAgaWYgKCFsYWJlbCkgcmV0dXJuIGxhYmVsXG5cbiAgICAgIGxhYmVsIS5kYXRhIS5vbiA9IHtcbiAgICAgICAgY2xpY2s6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIC8vIFByZXZlbnQgbGFiZWwgZnJvbVxuICAgICAgICAgIC8vIGNhdXNpbmcgdGhlIGlucHV0XG4gICAgICAgICAgLy8gdG8gZm9jdXNcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcblxuICAgICAgICAgIHRoaXMub25DaGFuZ2UoKVxuICAgICAgICB9LFxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbGFiZWxcbiAgICB9LFxuICAgIGdlbklucHV0ICh0eXBlOiBzdHJpbmcsIGF0dHJzOiBvYmplY3QpIHtcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdpbnB1dCcsIHtcbiAgICAgICAgYXR0cnM6IE9iamVjdC5hc3NpZ24oe1xuICAgICAgICAgICdhcmlhLWNoZWNrZWQnOiB0aGlzLmlzQWN0aXZlLnRvU3RyaW5nKCksXG4gICAgICAgICAgZGlzYWJsZWQ6IHRoaXMuaXNEaXNhYmxlZCxcbiAgICAgICAgICBpZDogdGhpcy5jb21wdXRlZElkLFxuICAgICAgICAgIHJvbGU6IHR5cGUsXG4gICAgICAgICAgdHlwZSxcbiAgICAgICAgfSwgYXR0cnMpLFxuICAgICAgICBkb21Qcm9wczoge1xuICAgICAgICAgIHZhbHVlOiB0aGlzLnZhbHVlLFxuICAgICAgICAgIGNoZWNrZWQ6IHRoaXMuaXNBY3RpdmUsXG4gICAgICAgIH0sXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgYmx1cjogdGhpcy5vbkJsdXIsXG4gICAgICAgICAgY2hhbmdlOiB0aGlzLm9uQ2hhbmdlLFxuICAgICAgICAgIGZvY3VzOiB0aGlzLm9uRm9jdXMsXG4gICAgICAgICAga2V5ZG93bjogdGhpcy5vbktleWRvd24sXG4gICAgICAgIH0sXG4gICAgICAgIHJlZjogJ2lucHV0JyxcbiAgICAgIH0pXG4gICAgfSxcbiAgICBvbkJsdXIgKCkge1xuICAgICAgdGhpcy5pc0ZvY3VzZWQgPSBmYWxzZVxuICAgIH0sXG4gICAgb25DaGFuZ2UgKCkge1xuICAgICAgaWYgKCF0aGlzLmlzSW50ZXJhY3RpdmUpIHJldHVyblxuXG4gICAgICBjb25zdCB2YWx1ZSA9IHRoaXMudmFsdWVcbiAgICAgIGxldCBpbnB1dCA9IHRoaXMuaW50ZXJuYWxWYWx1ZVxuXG4gICAgICBpZiAodGhpcy5pc011bHRpcGxlKSB7XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShpbnB1dCkpIHtcbiAgICAgICAgICBpbnB1dCA9IFtdXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBsZW5ndGggPSBpbnB1dC5sZW5ndGhcblxuICAgICAgICBpbnB1dCA9IGlucHV0LmZpbHRlcigoaXRlbTogYW55KSA9PiAhdGhpcy52YWx1ZUNvbXBhcmF0b3IoaXRlbSwgdmFsdWUpKVxuXG4gICAgICAgIGlmIChpbnB1dC5sZW5ndGggPT09IGxlbmd0aCkge1xuICAgICAgICAgIGlucHV0LnB1c2godmFsdWUpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy50cnVlVmFsdWUgIT09IHVuZGVmaW5lZCAmJiB0aGlzLmZhbHNlVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpbnB1dCA9IHRoaXMudmFsdWVDb21wYXJhdG9yKGlucHV0LCB0aGlzLnRydWVWYWx1ZSkgPyB0aGlzLmZhbHNlVmFsdWUgOiB0aGlzLnRydWVWYWx1ZVxuICAgICAgfSBlbHNlIGlmICh2YWx1ZSkge1xuICAgICAgICBpbnB1dCA9IHRoaXMudmFsdWVDb21wYXJhdG9yKGlucHV0LCB2YWx1ZSkgPyBudWxsIDogdmFsdWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlucHV0ID0gIWlucHV0XG4gICAgICB9XG5cbiAgICAgIHRoaXMudmFsaWRhdGUodHJ1ZSwgaW5wdXQpXG4gICAgICB0aGlzLmludGVybmFsVmFsdWUgPSBpbnB1dFxuICAgICAgdGhpcy5oYXNDb2xvciA9IGlucHV0XG4gICAgfSxcbiAgICBvbkZvY3VzICgpIHtcbiAgICAgIHRoaXMuaXNGb2N1c2VkID0gdHJ1ZVxuICAgIH0sXG4gICAgLyoqIEBhYnN0cmFjdCAqL1xuICAgIG9uS2V5ZG93biAoZTogRXZlbnQpIHt9LFxuICB9LFxufSlcbiJdfQ==