// Mixins
import Colorable from '../colorable';
import Themeable from '../themeable';
import { inject as RegistrableInject } from '../registrable';
// Utilities
import { deepEqual } from '../../util/helpers';
import { consoleError } from '../../util/console';
import mixins from '../../util/mixins';
const baseMixins = mixins(Colorable, RegistrableInject('form'), Themeable);
/* @vue/component */
export default baseMixins.extend({
    name: 'validatable',
    props: {
        disabled: Boolean,
        error: Boolean,
        errorCount: {
            type: [Number, String],
            default: 1,
        },
        errorMessages: {
            type: [String, Array],
            default: () => [],
        },
        messages: {
            type: [String, Array],
            default: () => [],
        },
        readonly: Boolean,
        rules: {
            type: Array,
            default: () => [],
        },
        success: Boolean,
        successMessages: {
            type: [String, Array],
            default: () => [],
        },
        validateOnBlur: Boolean,
        value: { required: false },
    },
    data() {
        return {
            errorBucket: [],
            hasColor: false,
            hasFocused: false,
            hasInput: false,
            isFocused: false,
            isResetting: false,
            lazyValue: this.value,
            valid: false,
        };
    },
    computed: {
        computedColor() {
            if (this.isDisabled)
                return undefined;
            if (this.color)
                return this.color;
            // It's assumed that if the input is on a
            // dark background, the user will want to
            // have a white color. If the entire app
            // is setup to be dark, then they will
            // like want to use their primary color
            if (this.isDark && !this.appIsDark)
                return 'white';
            else
                return 'primary';
        },
        hasError() {
            return (this.internalErrorMessages.length > 0 ||
                this.errorBucket.length > 0 ||
                this.error);
        },
        // TODO: Add logic that allows the user to enable based
        // upon a good validation
        hasSuccess() {
            return (this.internalSuccessMessages.length > 0 ||
                this.success);
        },
        externalError() {
            return this.internalErrorMessages.length > 0 || this.error;
        },
        hasMessages() {
            return this.validationTarget.length > 0;
        },
        hasState() {
            if (this.isDisabled)
                return false;
            return (this.hasSuccess ||
                (this.shouldValidate && this.hasError));
        },
        internalErrorMessages() {
            return this.genInternalMessages(this.errorMessages);
        },
        internalMessages() {
            return this.genInternalMessages(this.messages);
        },
        internalSuccessMessages() {
            return this.genInternalMessages(this.successMessages);
        },
        internalValue: {
            get() {
                return this.lazyValue;
            },
            set(val) {
                this.lazyValue = val;
                this.$emit('input', val);
            },
        },
        isDisabled() {
            return this.disabled || (!!this.form &&
                this.form.disabled);
        },
        isInteractive() {
            return !this.isDisabled && !this.isReadonly;
        },
        isReadonly() {
            return this.readonly || (!!this.form &&
                this.form.readonly);
        },
        shouldValidate() {
            if (this.externalError)
                return true;
            if (this.isResetting)
                return false;
            return this.validateOnBlur
                ? this.hasFocused && !this.isFocused
                : (this.hasInput || this.hasFocused);
        },
        validations() {
            return this.validationTarget.slice(0, Number(this.errorCount));
        },
        validationState() {
            if (this.isDisabled)
                return undefined;
            if (this.hasError && this.shouldValidate)
                return 'error';
            if (this.hasSuccess)
                return 'success';
            if (this.hasColor)
                return this.computedColor;
            return undefined;
        },
        validationTarget() {
            if (this.internalErrorMessages.length > 0) {
                return this.internalErrorMessages;
            }
            else if (this.successMessages.length > 0) {
                return this.internalSuccessMessages;
            }
            else if (this.messages.length > 0) {
                return this.internalMessages;
            }
            else if (this.shouldValidate) {
                return this.errorBucket;
            }
            else
                return [];
        },
    },
    watch: {
        rules: {
            handler(newVal, oldVal) {
                if (deepEqual(newVal, oldVal))
                    return;
                this.validate();
            },
            deep: true,
        },
        internalValue() {
            // If it's the first time we're setting input,
            // mark it with hasInput
            this.hasInput = true;
            this.validateOnBlur || this.$nextTick(this.validate);
        },
        isFocused(val) {
            // Should not check validation
            // if disabled
            if (!val &&
                !this.isDisabled) {
                this.hasFocused = true;
                this.validateOnBlur && this.$nextTick(this.validate);
            }
        },
        isResetting() {
            setTimeout(() => {
                this.hasInput = false;
                this.hasFocused = false;
                this.isResetting = false;
                this.validate();
            }, 0);
        },
        hasError(val) {
            if (this.shouldValidate) {
                this.$emit('update:error', val);
            }
        },
        value(val) {
            this.lazyValue = val;
        },
    },
    beforeMount() {
        this.validate();
    },
    created() {
        this.form && this.form.register(this);
    },
    beforeDestroy() {
        this.form && this.form.unregister(this);
    },
    methods: {
        genInternalMessages(messages) {
            if (!messages)
                return [];
            else if (Array.isArray(messages))
                return messages;
            else
                return [messages];
        },
        /** @public */
        reset() {
            this.isResetting = true;
            this.internalValue = Array.isArray(this.internalValue)
                ? []
                : undefined;
        },
        /** @public */
        resetValidation() {
            this.isResetting = true;
        },
        /** @public */
        validate(force = false, value) {
            const errorBucket = [];
            value = value || this.internalValue;
            if (force)
                this.hasInput = this.hasFocused = true;
            for (let index = 0; index < this.rules.length; index++) {
                const rule = this.rules[index];
                const valid = typeof rule === 'function' ? rule(value) : rule;
                if (valid === false || typeof valid === 'string') {
                    errorBucket.push(valid || '');
                }
                else if (typeof valid !== 'boolean') {
                    consoleError(`Rules should return a string or boolean, received '${typeof valid}' instead`, this);
                }
            }
            this.errorBucket = errorBucket;
            this.valid = errorBucket.length === 0;
            return this.valid;
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL3ZhbGlkYXRhYmxlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSxjQUFjLENBQUE7QUFDcEMsT0FBTyxTQUFTLE1BQU0sY0FBYyxDQUFBO0FBQ3BDLE9BQU8sRUFBRSxNQUFNLElBQUksaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQTtBQUU1RCxZQUFZO0FBQ1osT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQzlDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUNqRCxPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQU10QyxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQ3ZCLFNBQVMsRUFDVCxpQkFBaUIsQ0FBYyxNQUFNLENBQUMsRUFDdEMsU0FBUyxDQUNWLENBQUE7QUFFRCxvQkFBb0I7QUFDcEIsZUFBZSxVQUFVLENBQUMsTUFBTSxDQUFDO0lBQy9CLElBQUksRUFBRSxhQUFhO0lBRW5CLEtBQUssRUFBRTtRQUNMLFFBQVEsRUFBRSxPQUFPO1FBQ2pCLEtBQUssRUFBRSxPQUFPO1FBQ2QsVUFBVSxFQUFFO1lBQ1YsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN0QixPQUFPLEVBQUUsQ0FBQztTQUNYO1FBQ0QsYUFBYSxFQUFFO1lBQ2IsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBMkI7WUFDL0MsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUU7U0FDbEI7UUFDRCxRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUEyQjtZQUMvQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRTtTQUNsQjtRQUNELFFBQVEsRUFBRSxPQUFPO1FBQ2pCLEtBQUssRUFBRTtZ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RCxPQUFPLEtBQUssV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFBO2lCQUNsRzthQUNGO1lBRUQsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUE7WUFDOUIsSUFBSSxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQTtZQUVyQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUE7UUFDbkIsQ0FBQztLQUNGO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gTWl4aW5zXG5pbXBvcnQgQ29sb3JhYmxlIGZyb20gJy4uL2NvbG9yYWJsZSdcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vdGhlbWVhYmxlJ1xuaW1wb3J0IHsgaW5qZWN0IGFzIFJlZ2lzdHJhYmxlSW5qZWN0IH0gZnJvbSAnLi4vcmVnaXN0cmFibGUnXG5cbi8vIFV0aWxpdGllc1xuaW1wb3J0IHsgZGVlcEVxdWFsIH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuaW1wb3J0IHsgY29uc29sZUVycm9yIH0gZnJvbSAnLi4vLi4vdXRpbC9jb25zb2xlJ1xuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcblxuLy8gVHlwZXNcbmltcG9ydCB7IFByb3BUeXBlIH0gZnJvbSAndnVlJ1xuaW1wb3J0IHsgSW5wdXRNZXNzYWdlLCBJbnB1dFZhbGlkYXRpb25SdWxlcyB9IGZyb20gJ3Z1ZXRpZnkvdHlwZXMnXG5cbmNvbnN0IGJhc2VNaXhpbnMgPSBtaXhpbnMoXG4gIENvbG9yYWJsZSxcbiAgUmVnaXN0cmFibGVJbmplY3Q8J2Zvcm0nLCBhbnk+KCdmb3JtJyksXG4gIFRoZW1lYWJsZSxcbilcblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IGJhc2VNaXhpbnMuZXh0ZW5kKHtcbiAgbmFtZTogJ3ZhbGlkYXRhYmxlJyxcblxuICBwcm9wczoge1xuICAgIGRpc2FibGVkOiBCb29sZWFuLFxuICAgIGVycm9yOiBCb29sZWFuLFxuICAgIGVycm9yQ291bnQ6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiAxLFxuICAgIH0sXG4gICAgZXJyb3JNZXNzYWdlczoge1xuICAgICAgdHlwZTogW1N0cmluZywgQXJyYXldIGFzIFByb3BUeXBlPElucHV0TWVzc2FnZT4sXG4gICAgICBkZWZhdWx0OiAoKSA9PiBbXSxcbiAgICB9LFxuICAgIG1lc3NhZ2VzOiB7XG4gICAgICB0eXBlOiBbU3RyaW5nLCBBcnJheV0gYXMgUHJvcFR5cGU8SW5wdXRNZXNzYWdlPixcbiAgICAgIGRlZmF1bHQ6ICgpID0+IFtdLFxuICAgIH0sXG4gICAgcmVhZG9ubHk6IEJvb2xlYW4sXG4gICAgcnVsZXM6IHtcbiAgICAgIHR5cGU6IEFycmF5IGFzIFByb3BUeXBlPElucHV0VmFsaWRhdGlvblJ1bGVzPixcbiAgICAgIGRlZmF1bHQ6ICgpID0+IFtdLFxuICAgIH0sXG4gICAgc3VjY2VzczogQm9vbGVhbixcbiAgICBzdWNjZXNzTWVzc2FnZXM6IHtcbiAgICAgIHR5cGU6IFtTdHJpbmcsIEFycmF5XSBhcyBQcm9wVHlwZTxJbnB1dE1lc3NhZ2U+LFxuICAgICAgZGVmYXVsdDogKCkgPT4gW10sXG4gICAgfSxcbiAgICB2YWxpZGF0ZU9uQmx1cjogQm9vbGVhbixcbiAgICB2YWx1ZTogeyByZXF1aXJlZDogZmFsc2UgfSxcbiAgfSxcblxuICBkYXRhICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXJyb3JCdWNrZXQ6IFtdIGFzIHN0cmluZ1tdLFxuICAgICAgaGFzQ29sb3I6IGZhbHNlLFxuICAgICAgaGFzRm9jdXNlZDogZmFsc2UsXG4gICAgICBoYXNJbnB1dDogZmFsc2UsXG4gICAgICBpc0ZvY3VzZWQ6IGZhbHNlLFxuICAgICAgaXNSZXNldHRpbmc6IGZhbHNlLFxuICAgICAgbGF6eVZhbHVlOiB0aGlzLnZhbHVlLFxuICAgICAgdmFsaWQ6IGZhbHNlLFxuICAgIH1cbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGNvbXB1dGVkQ29sb3IgKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICBpZiAodGhpcy5pc0Rpc2FibGVkKSByZXR1cm4gdW5kZWZpbmVkXG4gICAgICBpZiAodGhpcy5jb2xvcikgcmV0dXJuIHRoaXMuY29sb3JcbiAgICAgIC8vIEl0J3MgYXNzdW1lZCB0aGF0IGlmIHRoZSBpbnB1dCBpcyBvbiBhXG4gICAgICAvLyBkYXJrIGJhY2tncm91bmQsIHRoZSB1c2VyIHdpbGwgd2FudCB0b1xuICAgICAgLy8gaGF2ZSBhIHdoaXRlIGNvbG9yLiBJZiB0aGUgZW50aXJlIGFwcFxuICAgICAgLy8gaXMgc2V0dXAgdG8gYmUgZGFyaywgdGhlbiB0aGV5IHdpbGxcbiAgICAgIC8vIGxpa2Ugd2FudCB0byB1c2UgdGhlaXIgcHJpbWFyeSBjb2xvclxuICAgICAgaWYgKHRoaXMuaXNEYXJrICYmICF0aGlzLmFwcElzRGFyaykgcmV0dXJuICd3aGl0ZSdcbiAgICAgIGVsc2UgcmV0dXJuICdwcmltYXJ5J1xuICAgIH0sXG4gICAgaGFzRXJyb3IgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgdGhpcy5pbnRlcm5hbEVycm9yTWVzc2FnZXMubGVuZ3RoID4gMCB8fFxuICAgICAgICB0aGlzLmVycm9yQnVja2V0Lmxlbmd0aCA+IDAgfHxcbiAgICAgICAgdGhpcy5lcnJvclxuICAgICAgKVxuICAgIH0sXG4gICAgLy8gVE9ETzogQWRkIGxvZ2ljIHRoYXQgYWxsb3dzIHRoZSB1c2VyIHRvIGVuYWJsZSBiYXNlZFxuICAgIC8vIHVwb24gYSBnb29kIHZhbGlkYXRpb25cbiAgICBoYXNTdWNjZXNzICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIHRoaXMuaW50ZXJuYWxTdWNjZXNzTWVzc2FnZXMubGVuZ3RoID4gMCB8fFxuICAgICAgICB0aGlzLnN1Y2Nlc3NcbiAgICAgIClcbiAgICB9LFxuICAgIGV4dGVybmFsRXJyb3IgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxFcnJvck1lc3NhZ2VzLmxlbmd0aCA+IDAgfHwgdGhpcy5lcnJvclxuICAgIH0sXG4gICAgaGFzTWVzc2FnZXMgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMudmFsaWRhdGlvblRhcmdldC5sZW5ndGggPiAwXG4gICAgfSxcbiAgICBoYXNTdGF0ZSAoKTogYm9vbGVhbiB7XG4gICAgICBpZiAodGhpcy5pc0Rpc2FibGVkKSByZXR1cm4gZmFsc2VcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgdGhpcy5oYXNTdWNjZXNzIHx8XG4gICAgICAgICh0aGlzLnNob3VsZFZhbGlkYXRlICYmIHRoaXMuaGFzRXJyb3IpXG4gICAgICApXG4gICAgfSxcbiAgICBpbnRlcm5hbEVycm9yTWVzc2FnZXMgKCk6IElucHV0VmFsaWRhdGlvblJ1bGVzIHtcbiAgICAgIHJldHVybiB0aGlzLmdlbkludGVybmFsTWVzc2FnZXModGhpcy5lcnJvck1lc3NhZ2VzKVxuICAgIH0sXG4gICAgaW50ZXJuYWxNZXNzYWdlcyAoKTogSW5wdXRWYWxpZGF0aW9uUnVsZXMge1xuICAgICAgcmV0dXJuIHRoaXMuZ2VuSW50ZXJuYWxNZXNzYWdlcyh0aGlzLm1lc3NhZ2VzKVxuICAgIH0sXG4gICAgaW50ZXJuYWxTdWNjZXNzTWVzc2FnZXMgKCk6IElucHV0VmFsaWRhdGlvblJ1bGVzIHtcbiAgICAgIHJldHVybiB0aGlzLmdlbkludGVybmFsTWVzc2FnZXModGhpcy5zdWNjZXNzTWVzc2FnZXMpXG4gICAgfSxcbiAgICBpbnRlcm5hbFZhbHVlOiB7XG4gICAgICBnZXQgKCk6IHVua25vd24ge1xuICAgICAgICByZXR1cm4gdGhpcy5sYXp5VmFsdWVcbiAgICAgIH0sXG4gICAgICBzZXQgKHZhbDogYW55KSB7XG4gICAgICAgIHRoaXMubGF6eVZhbHVlID0gdmFsXG5cbiAgICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCB2YWwpXG4gICAgICB9LFxuICAgIH0sXG4gICAgaXNEaXNhYmxlZCAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCB8fCAoXG4gICAgICAgICEhdGhpcy5mb3JtICYmXG4gICAgICAgIHRoaXMuZm9ybS5kaXNhYmxlZFxuICAgICAgKVxuICAgIH0sXG4gICAgaXNJbnRlcmFjdGl2ZSAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gIXRoaXMuaXNEaXNhYmxlZCAmJiAhdGhpcy5pc1JlYWRvbmx5XG4gICAgfSxcbiAgICBpc1JlYWRvbmx5ICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLnJlYWRvbmx5IHx8IChcbiAgICAgICAgISF0aGlzLmZvcm0gJiZcbiAgICAgICAgdGhpcy5mb3JtLnJlYWRvbmx5XG4gICAgICApXG4gICAgfSxcbiAgICBzaG91bGRWYWxpZGF0ZSAoKTogYm9vbGVhbiB7XG4gICAgICBpZiAodGhpcy5leHRlcm5hbEVycm9yKSByZXR1cm4gdHJ1ZVxuICAgICAgaWYgKHRoaXMuaXNSZXNldHRpbmcpIHJldHVybiBmYWxzZVxuXG4gICAgICByZXR1cm4gdGhpcy52YWxpZGF0ZU9uQmx1clxuICAgICAgICA/IHRoaXMuaGFzRm9jdXNlZCAmJiAhdGhpcy5pc0ZvY3VzZWRcbiAgICAgICAgOiAodGhpcy5oYXNJbnB1dCB8fCB0aGlzLmhhc0ZvY3VzZWQpXG4gICAgfSxcbiAgICB2YWxpZGF0aW9ucyAoKTogSW5wdXRWYWxpZGF0aW9uUnVsZXMge1xuICAgICAgcmV0dXJuIHRoaXMudmFsaWRhdGlvblRhcmdldC5zbGljZSgwLCBOdW1iZXIodGhpcy5lcnJvckNvdW50KSlcbiAgICB9LFxuICAgIHZhbGlkYXRpb25TdGF0ZSAoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgIGlmICh0aGlzLmlzRGlzYWJsZWQpIHJldHVybiB1bmRlZmluZWRcbiAgICAgIGlmICh0aGlzLmhhc0Vycm9yICYmIHRoaXMuc2hvdWxkVmFsaWRhdGUpIHJldHVybiAnZXJyb3InXG4gICAgICBpZiAodGhpcy5oYXNTdWNjZXNzKSByZXR1cm4gJ3N1Y2Nlc3MnXG4gICAgICBpZiAodGhpcy5oYXNDb2xvcikgcmV0dXJuIHRoaXMuY29tcHV0ZWRDb2xvclxuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH0sXG4gICAgdmFsaWRhdGlvblRhcmdldCAoKTogSW5wdXRWYWxpZGF0aW9uUnVsZXMge1xuICAgICAgaWYgKHRoaXMuaW50ZXJuYWxFcnJvck1lc3NhZ2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxFcnJvck1lc3NhZ2VzXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc3VjY2Vzc01lc3NhZ2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxTdWNjZXNzTWVzc2FnZXNcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5tZXNzYWdlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmludGVybmFsTWVzc2FnZXNcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zaG91bGRWYWxpZGF0ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5lcnJvckJ1Y2tldFxuICAgICAgfSBlbHNlIHJldHVybiBbXVxuICAgIH0sXG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICBydWxlczoge1xuICAgICAgaGFuZGxlciAobmV3VmFsLCBvbGRWYWwpIHtcbiAgICAgICAgaWYgKGRlZXBFcXVhbChuZXdWYWwsIG9sZFZhbCkpIHJldHVyblxuICAgICAgICB0aGlzLnZhbGlkYXRlKClcbiAgICAgIH0sXG4gICAgICBkZWVwOiB0cnVlLFxuICAgIH0sXG4gICAgaW50ZXJuYWxWYWx1ZSAoKSB7XG4gICAgICAvLyBJZiBpdCdzIHRoZSBmaXJzdCB0aW1lIHdlJ3JlIHNldHRpbmcgaW5wdXQsXG4gICAgICAvLyBtYXJrIGl0IHdpdGggaGFzSW5wdXRcbiAgICAgIHRoaXMuaGFzSW5wdXQgPSB0cnVlXG4gICAgICB0aGlzLnZhbGlkYXRlT25CbHVyIHx8IHRoaXMuJG5leHRUaWNrKHRoaXMudmFsaWRhdGUpXG4gICAgfSxcbiAgICBpc0ZvY3VzZWQgKHZhbCkge1xuICAgICAgLy8gU2hvdWxkIG5vdCBjaGVjayB2YWxpZGF0aW9uXG4gICAgICAvLyBpZiBkaXNhYmxlZFxuICAgICAgaWYgKFxuICAgICAgICAhdmFsICYmXG4gICAgICAgICF0aGlzLmlzRGlzYWJsZWRcbiAgICAgICkge1xuICAgICAgICB0aGlzLmhhc0ZvY3VzZWQgPSB0cnVlXG4gICAgICAgIHRoaXMudmFsaWRhdGVPbkJsdXIgJiYgdGhpcy4kbmV4dFRpY2sodGhpcy52YWxpZGF0ZSlcbiAgICAgIH1cbiAgICB9LFxuICAgIGlzUmVzZXR0aW5nICgpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLmhhc0lucHV0ID0gZmFsc2VcbiAgICAgICAgdGhpcy5oYXNGb2N1c2VkID0gZmFsc2VcbiAgICAgICAgdGhpcy5pc1Jlc2V0dGluZyA9IGZhbHNlXG4gICAgICAgIHRoaXMudmFsaWRhdGUoKVxuICAgICAgfSwgMClcbiAgICB9LFxuICAgIGhhc0Vycm9yICh2YWwpIHtcbiAgICAgIGlmICh0aGlzLnNob3VsZFZhbGlkYXRlKSB7XG4gICAgICAgIHRoaXMuJGVtaXQoJ3VwZGF0ZTplcnJvcicsIHZhbClcbiAgICAgIH1cbiAgICB9LFxuICAgIHZhbHVlICh2YWwpIHtcbiAgICAgIHRoaXMubGF6eVZhbHVlID0gdmFsXG4gICAgfSxcbiAgfSxcblxuICBiZWZvcmVNb3VudCAoKSB7XG4gICAgdGhpcy52YWxpZGF0ZSgpXG4gIH0sXG5cbiAgY3JlYXRlZCAoKSB7XG4gICAgdGhpcy5mb3JtICYmIHRoaXMuZm9ybS5yZWdpc3Rlcih0aGlzKVxuICB9LFxuXG4gIGJlZm9yZURlc3Ryb3kgKCkge1xuICAgIHRoaXMuZm9ybSAmJiB0aGlzLmZvcm0udW5yZWdpc3Rlcih0aGlzKVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBnZW5JbnRlcm5hbE1lc3NhZ2VzIChtZXNzYWdlczogSW5wdXRNZXNzYWdlKTogSW5wdXRWYWxpZGF0aW9uUnVsZXMge1xuICAgICAgaWYgKCFtZXNzYWdlcykgcmV0dXJuIFtdXG4gICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KG1lc3NhZ2VzKSkgcmV0dXJuIG1lc3NhZ2VzXG4gICAgICBlbHNlIHJldHVybiBbbWVzc2FnZXNdXG4gICAgfSxcbiAgICAvKiogQHB1YmxpYyAqL1xuICAgIHJlc2V0ICgpIHtcbiAgICAgIHRoaXMuaXNSZXNldHRpbmcgPSB0cnVlXG4gICAgICB0aGlzLmludGVybmFsVmFsdWUgPSBBcnJheS5pc0FycmF5KHRoaXMuaW50ZXJuYWxWYWx1ZSlcbiAgICAgICAgPyBbXVxuICAgICAgICA6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgLyoqIEBwdWJsaWMgKi9cbiAgICByZXNldFZhbGlkYXRpb24gKCkge1xuICAgICAgdGhpcy5pc1Jlc2V0dGluZyA9IHRydWVcbiAgICB9LFxuICAgIC8qKiBAcHVibGljICovXG4gICAgdmFsaWRhdGUgKGZvcmNlID0gZmFsc2UsIHZhbHVlPzogYW55KTogYm9vbGVhbiB7XG4gICAgICBjb25zdCBlcnJvckJ1Y2tldCA9IFtdXG4gICAgICB2YWx1ZSA9IHZhbHVlIHx8IHRoaXMuaW50ZXJuYWxWYWx1ZVxuXG4gICAgICBpZiAoZm9yY2UpIHRoaXMuaGFzSW5wdXQgPSB0aGlzLmhhc0ZvY3VzZWQgPSB0cnVlXG5cbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnJ1bGVzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICBjb25zdCBydWxlID0gdGhpcy5ydWxlc1tpbmRleF1cbiAgICAgICAgY29uc3QgdmFsaWQgPSB0eXBlb2YgcnVsZSA9PT0gJ2Z1bmN0aW9uJyA/IHJ1bGUodmFsdWUpIDogcnVsZVxuXG4gICAgICAgIGlmICh2YWxpZCA9PT0gZmFsc2UgfHwgdHlwZW9mIHZhbGlkID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGVycm9yQnVja2V0LnB1c2godmFsaWQgfHwgJycpXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbGlkICE9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICBjb25zb2xlRXJyb3IoYFJ1bGVzIHNob3VsZCByZXR1cm4gYSBzdHJpbmcgb3IgYm9vbGVhbiwgcmVjZWl2ZWQgJyR7dHlwZW9mIHZhbGlkfScgaW5zdGVhZGAsIHRoaXMpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5lcnJvckJ1Y2tldCA9IGVycm9yQnVja2V0XG4gICAgICB0aGlzLnZhbGlkID0gZXJyb3JCdWNrZXQubGVuZ3RoID09PSAwXG5cbiAgICAgIHJldHVybiB0aGlzLnZhbGlkXG4gICAgfSxcbiAgfSxcbn0pXG4iXX0=