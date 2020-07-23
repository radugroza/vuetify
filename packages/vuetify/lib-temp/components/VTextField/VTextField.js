// Styles
import './VTextField.sass';
// Extensions
import VInput from '../VInput';
// Components
import VCounter from '../VCounter';
import VLabel from '../VLabel';
// Mixins
import Intersectable from '../../mixins/intersectable';
import Loadable from '../../mixins/loadable';
import Validatable from '../../mixins/validatable';
// Directives
import ripple from '../../directives/ripple';
// Utilities
import { convertToUnit, keyCodes } from '../../util/helpers';
import { breaking, consoleWarn } from '../../util/console';
// Types
import mixins from '../../util/mixins';
const baseMixins = mixins(VInput, Intersectable({
    onVisible: [
        'setLabelWidth',
        'setPrefixWidth',
        'setPrependWidth',
        'tryAutofocus',
    ],
}), Loadable);
const dirtyTypes = ['color', 'file', 'time', 'date', 'datetime-local', 'week', 'month'];
/* @vue/component */
export default baseMixins.extend().extend({
    name: 'v-text-field',
    directives: { ripple },
    inheritAttrs: false,
    props: {
        appendOuterIcon: String,
        autofocus: Boolean,
        clearable: Boolean,
        clearIcon: {
            type: String,
            default: '$clear',
        },
        counter: [Boolean, Number, String],
        counterValue: Function,
        filled: Boolean,
        flat: Boolean,
        fullWidth: Boolean,
        label: String,
        outlined: Boolean,
        placeholder: String,
        prefix: String,
        prependInnerIcon: String,
        reverse: Boolean,
        rounded: Boolean,
        shaped: Boolean,
        singleLine: Boolean,
        solo: Boolean,
        soloInverted: Boolean,
        suffix: String,
        type: {
            type: String,
            default: 'text',
        },
    },
    data: () => ({
        badInput: false,
        labelWidth: 0,
        prefixWidth: 0,
        prependWidth: 0,
        initialValue: null,
        isBooted: false,
        isClearing: false,
    }),
    computed: {
        classes() {
            return {
                ...VInput.options.computed.classes.call(this),
                'v-text-field': true,
                'v-text-field--full-width': this.fullWidth,
                'v-text-field--prefix': this.prefix,
                'v-text-field--single-line': this.isSingle,
                'v-text-field--solo': this.isSolo,
                'v-text-field--solo-inverted': this.soloInverted,
                'v-text-field--solo-flat': this.flat,
                'v-text-field--filled': this.filled,
                'v-text-field--is-booted': this.isBooted,
                'v-text-field--enclosed': this.isEnclosed,
                'v-text-field--reverse': this.reverse,
                'v-text-field--outlined': this.outlined,
                'v-text-field--placeholder': this.placeholder,
                'v-text-field--rounded': this.rounded,
                'v-text-field--shaped': this.shaped,
            };
        },
        computedColor() {
            const computedColor = Validatable.options.computed.computedColor.call(this);
            if (!this.soloInverted || !this.isFocused)
                return computedColor;
            return this.color || 'primary';
        },
        computedCounterValue() {
            if (typeof this.counterValue === 'function') {
                return this.counterValue(this.internalValue);
            }
            return (this.internalValue || '').toString().length;
        },
        hasCounter() {
            return this.counter !== false && this.counter != null;
        },
        hasDetails() {
            return VInput.options.computed.hasDetails.call(this) || this.hasCounter;
        },
        internalValue: {
            get() {
                return this.lazyValue;
            },
            set(val) {
                this.lazyValue = val;
                this.$emit('input', this.lazyValue);
            },
        },
        isDirty() {
            return (this.lazyValue != null &&
                this.lazyValue.toString().length > 0) ||
                this.badInput;
        },
        isEnclosed() {
            return (this.filled ||
                this.isSolo ||
                this.outlined);
        },
        isLabelActive() {
            return this.isDirty || dirtyTypes.includes(this.type);
        },
        isSingle() {
            return (this.isSolo ||
                this.singleLine ||
                this.fullWidth ||
                // https://material.io/components/text-fields/#filled-text-field
                (this.filled && !this.hasLabel));
        },
        isSolo() {
            return this.solo || this.soloInverted;
        },
        labelPosition() {
            let offset = (this.prefix && !this.labelValue) ? this.prefixWidth : 0;
            if (this.labelValue && this.prependWidth)
                offset -= this.prependWidth;
            return (this.$vuetify.rtl === this.reverse) ? {
                left: offset,
                right: 'auto',
            } : {
                left: 'auto',
                right: offset,
            };
        },
        showLabel() {
            return this.hasLabel && (!this.isSingle || (!this.isLabelActive && !this.placeholder));
        },
        labelValue() {
            return !this.isSingle &&
                Boolean(this.isFocused || this.isLabelActive || this.placeholder);
        },
    },
    watch: {
        labelValue: 'setLabelWidth',
        outlined: 'setLabelWidth',
        label() {
            this.$nextTick(this.setLabelWidth);
        },
        prefix() {
            this.$nextTick(this.setPrefixWidth);
        },
        isFocused: 'updateValue',
        value(val) {
            this.lazyValue = val;
        },
    },
    created() {
        /* istanbul ignore next */
        if (this.$attrs.hasOwnProperty('box')) {
            breaking('box', 'filled', this);
        }
        /* istanbul ignore next */
        if (this.$attrs.hasOwnProperty('browser-autocomplete')) {
            breaking('browser-autocomplete', 'autocomplete', this);
        }
        /* istanbul ignore if */
        if (this.shaped && !(this.filled || this.outlined || this.isSolo)) {
            consoleWarn('shaped should be used with either filled or outlined', this);
        }
    },
    mounted() {
        this.autofocus && this.tryAutofocus();
        this.setLabelWidth();
        this.setPrefixWidth();
        this.setPrependWidth();
        requestAnimationFrame(() => (this.isBooted = true));
    },
    methods: {
        /** @public */
        focus() {
            this.onFocus();
        },
        /** @public */
        blur(e) {
            // https://github.com/vuetifyjs/vuetify/issues/5913
            // Safari tab order gets broken if called synchronous
            window.requestAnimationFrame(() => {
                this.$refs.input && this.$refs.input.blur();
            });
        },
        clearableCallback() {
            this.$refs.input && this.$refs.input.focus();
            this.$nextTick(() => this.internalValue = null);
        },
        genAppendSlot() {
            const slot = [];
            if (this.$slots['append-outer']) {
                slot.push(this.$slots['append-outer']);
            }
            else if (this.appendOuterIcon) {
                slot.push(this.genIcon('appendOuter'));
            }
            return this.genSlot('append', 'outer', slot);
        },
        genPrependInnerSlot() {
            const slot = [];
            if (this.$slots['prepend-inner']) {
                slot.push(this.$slots['prepend-inner']);
            }
            else if (this.prependInnerIcon) {
                slot.push(this.genIcon('prependInner'));
            }
            return this.genSlot('prepend', 'inner', slot);
        },
        genIconSlot() {
            const slot = [];
            if (this.$slots['append']) {
                slot.push(this.$slots['append']);
            }
            else if (this.appendIcon) {
                slot.push(this.genIcon('append'));
            }
            return this.genSlot('append', 'inner', slot);
        },
        genInputSlot() {
            const input = VInput.options.methods.genInputSlot.call(this);
            const prepend = this.genPrependInnerSlot();
            if (prepend) {
                input.children = input.children || [];
                input.children.unshift(prepend);
            }
            return input;
        },
        genClearIcon() {
            if (!this.clearable)
                return null;
            const data = this.isDirty ? undefined : { attrs: { disabled: true } };
            return this.genSlot('append', 'inner', [
                this.genIcon('clear', this.clearableCallback, data),
            ]);
        },
        genCounter() {
            if (!this.hasCounter)
                return null;
            const max = this.counter === true ? this.attrs$.maxlength : this.counter;
            return this.$createElement(VCounter, {
                props: {
                    dark: this.dark,
                    light: this.light,
                    max,
                    value: this.computedCounterValue,
                },
            });
        },
        genControl() {
            return VInput.options.methods.genControl.call(this);
        },
        genDefaultSlot() {
            return [
                this.genFieldset(),
                this.genTextFieldSlot(),
                this.genClearIcon(),
                this.genIconSlot(),
                this.genProgress(),
            ];
        },
        genFieldset() {
            if (!this.outlined)
                return null;
            return this.$createElement('fieldset', {
                attrs: {
                    'aria-hidden': true,
                },
            }, [this.genLegend()]);
        },
        genLabel() {
            if (!this.showLabel)
                return null;
            const data = {
                props: {
                    absolute: true,
                    color: this.validationState,
                    dark: this.dark,
                    disabled: this.isDisabled,
                    focused: !this.isSingle && (this.isFocused || !!this.validationState),
                    for: this.computedId,
                    left: this.labelPosition.left,
                    light: this.light,
                    right: this.labelPosition.right,
                    value: this.labelValue,
                },
            };
            return this.$createElement(VLabel, data, this.$slots.label || this.label);
        },
        genLegend() {
            const width = !this.singleLine && (this.labelValue || this.isDirty) ? this.labelWidth : 0;
            const span = this.$createElement('span', {
                domProps: { innerHTML: '&#8203;' },
            });
            return this.$createElement('legend', {
                style: {
                    width: !this.isSingle ? convertToUnit(width) : undefined,
                },
            }, [span]);
        },
        genInput() {
            const listeners = Object.assign({}, this.listeners$);
            delete listeners['change']; // Change should not be bound externally
            return this.$createElement('input', {
                style: {},
                domProps: {
                    value: (this.type === 'number' && Object.is(this.lazyValue, -0)) ? '-0' : this.lazyValue,
                },
                attrs: {
                    ...this.attrs$,
                    autofocus: this.autofocus,
                    disabled: this.isDisabled,
                    id: this.computedId,
                    placeholder: this.placeholder,
                    readonly: this.isReadonly,
                    type: this.type,
                },
                on: Object.assign(listeners, {
                    blur: this.onBlur,
                    input: this.onInput,
                    focus: this.onFocus,
                    keydown: this.onKeyDown,
                }),
                ref: 'input',
            });
        },
        genMessages() {
            if (!this.showDetails)
                return null;
            const messagesNode = VInput.options.methods.genMessages.call(this);
            const counterNode = this.genCounter();
            return this.$createElement('div', {
                staticClass: 'v-text-field__details',
            }, [
                messagesNode,
                counterNode,
            ]);
        },
        genTextFieldSlot() {
            return this.$createElement('div', {
                staticClass: 'v-text-field__slot',
            }, [
                this.genLabel(),
                this.prefix ? this.genAffix('prefix') : null,
                this.genInput(),
                this.suffix ? this.genAffix('suffix') : null,
            ]);
        },
        genAffix(type) {
            return this.$createElement('div', {
                class: `v-text-field__${type}`,
                ref: type,
            }, this[type]);
        },
        onBlur(e) {
            this.isFocused = false;
            e && this.$nextTick(() => this.$emit('blur', e));
        },
        onClick() {
            if (this.isFocused || this.isDisabled || !this.$refs.input)
                return;
            this.$refs.input.focus();
        },
        onFocus(e) {
            if (!this.$refs.input)
                return;
            if (document.activeElement !== this.$refs.input) {
                return this.$refs.input.focus();
            }
            if (!this.isFocused) {
                this.isFocused = true;
                e && this.$emit('focus', e);
            }
        },
        onInput(e) {
            const target = e.target;
            this.internalValue = target.value;
            this.badInput = target.validity && target.validity.badInput;
        },
        onKeyDown(e) {
            if (e.keyCode === keyCodes.enter)
                this.$emit('change', this.internalValue);
            this.$emit('keydown', e);
        },
        onMouseDown(e) {
            // Prevent input from being blurred
            if (e.target !== this.$refs.input) {
                e.preventDefault();
                e.stopPropagation();
            }
            VInput.options.methods.onMouseDown.call(this, e);
        },
        onMouseUp(e) {
            if (this.hasMouseDown)
                this.focus();
            VInput.options.methods.onMouseUp.call(this, e);
        },
        setLabelWidth() {
            if (!this.outlined)
                return;
            this.labelWidth = this.$refs.label
                ? Math.min(this.$refs.label.scrollWidth * 0.75 + 6, this.$el.offsetWidth - 24)
                : 0;
        },
        setPrefixWidth() {
            if (!this.$refs.prefix)
                return;
            this.prefixWidth = this.$refs.prefix.offsetWidth;
        },
        setPrependWidth() {
            if (!this.outlined || !this.$refs['prepend-inner'])
                return;
            this.prependWidth = this.$refs['prepend-inner'].offsetWidth;
        },
        tryAutofocus() {
            if (!this.autofocus ||
                typeof document === 'undefined' ||
                !this.$refs.input ||
                document.activeElement === this.$refs.input)
                return false;
            this.$refs.input.focus();
            return true;
        },
        updateValue(val) {
            // Sets validationState from validatable
            this.hasColor = val;
            if (val) {
                this.initialValue = this.lazyValue;
            }
            else if (this.initialValue !== this.lazyValue) {
                this.$emit('change', this.lazyValue);
            }
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlRleHRGaWVsZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZUZXh0RmllbGQvVlRleHRGaWVsZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxtQkFBbUIsQ0FBQTtBQUUxQixhQUFhO0FBQ2IsT0FBTyxNQUFNLE1BQU0sV0FBVyxDQUFBO0FBRTlCLGFBQWE7QUFDYixPQUFPLFFBQVEsTUFBTSxhQUFhLENBQUE7QUFDbEMsT0FBTyxNQUFNLE1BQU0sV0FBVyxDQUFBO0FBRTlCLFNBQVM7QUFDVCxPQUFPLGFBQWEsTUFBTSw0QkFBNEIsQ0FBQTtBQUN0RCxPQUFPLFFBQVEsTUFBTSx1QkFBdUIsQ0FBQTtBQUM1QyxPQUFPLFdBQVcsTUFBTSwwQkFBMEIsQ0FBQTtBQUVsRCxhQUFhO0FBQ2IsT0FBTyxNQUFNLE1BQU0seUJBQXlCLENBQUE7QUFFNUMsWUFBWTtBQUNaLE9BQU8sRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFDNUQsT0FBTyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUUxRCxRQUFRO0FBQ1IsT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFHdEMsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUN2QixNQUFNLEVBQ04sYUFBYSxDQUFDO0lBQ1osU0FBUyxFQUFFO1FBQ1QsZUFBZTtRQUNmLGdCQUFnQjtRQUNoQixpQkFBaUI7UUFDakIsY0FBYztLQUNmO0NBQ0YsQ0FBQyxFQUNGLFFBQVEsQ0FDVCxDQUFBO0FBV0QsTUFBTSxVQUFVLEdBQUcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFBO0FBRXZGLG9CQUFvQjtBQUNwQixlQUFlLFVBQVUsQ0FBQyxNQUFNLEVBQVcsQ0FBQyxNQUFNLENB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LEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQTtZQUV4QixPQUFPLElBQUksQ0FBQTtRQUNiLENBQUM7UUFDRCxXQUFXLENBQUUsR0FBWTtZQUN2Qix3Q0FBd0M7WUFDeEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUE7WUFFbkIsSUFBSSxHQUFHLEVBQUU7Z0JBQ1AsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFBO2FBQ25DO2lCQUFNLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUMvQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7YUFDckM7UUFDSCxDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcbmltcG9ydCAnLi9WVGV4dEZpZWxkLnNhc3MnXG5cbi8vIEV4dGVuc2lvbnNcbmltcG9ydCBWSW5wdXQgZnJvbSAnLi4vVklucHV0J1xuXG4vLyBDb21wb25lbnRzXG5pbXBvcnQgVkNvdW50ZXIgZnJvbSAnLi4vVkNvdW50ZXInXG5pbXBvcnQgVkxhYmVsIGZyb20gJy4uL1ZMYWJlbCdcblxuLy8gTWl4aW5zXG5pbXBvcnQgSW50ZXJzZWN0YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvaW50ZXJzZWN0YWJsZSdcbmltcG9ydCBMb2FkYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvbG9hZGFibGUnXG5pbXBvcnQgVmFsaWRhdGFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3ZhbGlkYXRhYmxlJ1xuXG4vLyBEaXJlY3RpdmVzXG5pbXBvcnQgcmlwcGxlIGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvcmlwcGxlJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCB7IGNvbnZlcnRUb1VuaXQsIGtleUNvZGVzIH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuaW1wb3J0IHsgYnJlYWtpbmcsIGNvbnNvbGVXYXJuIH0gZnJvbSAnLi4vLi4vdXRpbC9jb25zb2xlJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcbmltcG9ydCB7IFZOb2RlLCBQcm9wVHlwZSB9IGZyb20gJ3Z1ZS90eXBlcydcblxuY29uc3QgYmFzZU1peGlucyA9IG1peGlucyhcbiAgVklucHV0LFxuICBJbnRlcnNlY3RhYmxlKHtcbiAgICBvblZpc2libGU6IFtcbiAgICAgICdzZXRMYWJlbFdpZHRoJyxcbiAgICAgICdzZXRQcmVmaXhXaWR0aCcsXG4gICAgICAnc2V0UHJlcGVuZFdpZHRoJyxcbiAgICAgICd0cnlBdXRvZm9jdXMnLFxuICAgIF0sXG4gIH0pLFxuICBMb2FkYWJsZSxcbilcbmludGVyZmFjZSBvcHRpb25zIGV4dGVuZHMgSW5zdGFuY2VUeXBlPHR5cGVvZiBiYXNlTWl4aW5zPiB7XG4gICRyZWZzOiB7XG4gICAgbGFiZWw6IEhUTUxFbGVtZW50XG4gICAgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnRcbiAgICAncHJlcGVuZC1pbm5lcic6IEhUTUxFbGVtZW50XG4gICAgcHJlZml4OiBIVE1MRWxlbWVudFxuICAgIHN1ZmZpeDogSFRNTEVsZW1lbnRcbiAgfVxufVxuXG5jb25zdCBkaXJ0eVR5cGVzID0gWydjb2xvcicsICdmaWxlJywgJ3RpbWUnLCAnZGF0ZScsICdkYXRldGltZS1sb2NhbCcsICd3ZWVrJywgJ21vbnRoJ11cblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IGJhc2VNaXhpbnMuZXh0ZW5kPG9wdGlvbnM+KCkuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtdGV4dC1maWVsZCcsXG5cbiAgZGlyZWN0aXZlczogeyByaXBwbGUgfSxcblxuICBpbmhlcml0QXR0cnM6IGZhbHNlLFxuXG4gIHByb3BzOiB7XG4gICAgYXBwZW5kT3V0ZXJJY29uOiBTdHJpbmcsXG4gICAgYXV0b2ZvY3VzOiBCb29sZWFuLFxuICAgIGNsZWFyYWJsZTogQm9vbGVhbixcbiAgICBjbGVhckljb246IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICckY2xlYXInLFxuICAgIH0sXG4gICAgY291bnRlcjogW0Jvb2xlYW4sIE51bWJlciwgU3RyaW5nXSxcbiAgICBjb3VudGVyVmFsdWU6IEZ1bmN0aW9uIGFzIFByb3BUeXBlPCh2YWx1ZTogYW55KSA9PiBudW1iZXI+LFxuICAgIGZpbGxlZDogQm9vbGVhbixcbiAgICBmbGF0OiBCb29sZWFuLFxuICAgIGZ1bGxXaWR0aDogQm9vbGVhbixcbiAgICBsYWJlbDogU3RyaW5nLFxuICAgIG91dGxpbmVkOiBCb29sZWFuLFxuICAgIHBsYWNlaG9sZGVyOiBTdHJpbmcsXG4gICAgcHJlZml4OiBTdHJpbmcsXG4gICAgcHJlcGVuZElubmVySWNvbjogU3RyaW5nLFxuICAgIHJldmVyc2U6IEJvb2xlYW4sXG4gICAgcm91bmRlZDogQm9vbGVhbixcbiAgICBzaGFwZWQ6IEJvb2xlYW4sXG4gICAgc2luZ2xlTGluZTogQm9vbGVhbixcbiAgICBzb2xvOiBCb29sZWFuLFxuICAgIHNvbG9JbnZlcnRlZDogQm9vbGVhbixcbiAgICBzdWZmaXg6IFN0cmluZyxcbiAgICB0eXBlOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAndGV4dCcsXG4gICAgfSxcbiAgfSxcblxuICBkYXRhOiAoKSA9PiAoe1xuICAgIGJhZElucHV0OiBmYWxzZSxcbiAgICBsYWJlbFdpZHRoOiAwLFxuICAgIHByZWZpeFdpZHRoOiAwLFxuICAgIHByZXBlbmRXaWR0aDogMCxcbiAgICBpbml0aWFsVmFsdWU6IG51bGwsXG4gICAgaXNCb290ZWQ6IGZhbHNlLFxuICAgIGlzQ2xlYXJpbmc6IGZhbHNlLFxuICB9KSxcblxuICBjb21wdXRlZDoge1xuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5WSW5wdXQub3B0aW9ucy5jb21wdXRlZC5jbGFzc2VzLmNhbGwodGhpcyksXG4gICAgICAgICd2LXRleHQtZmllbGQnOiB0cnVlLFxuICAgICAgICAndi10ZXh0LWZpZWxkLS1mdWxsLXdpZHRoJzogdGhpcy5mdWxsV2lkdGgsXG4gICAgICAgICd2LXRleHQtZmllbGQtLXByZWZpeCc6IHRoaXMucHJlZml4LFxuICAgICAgICAndi10ZXh0LWZpZWxkLS1zaW5nbGUtbGluZSc6IHRoaXMuaXNTaW5nbGUsXG4gICAgICAgICd2LXRleHQtZmllbGQtLXNvbG8nOiB0aGlzLmlzU29sbyxcbiAgICAgICAgJ3YtdGV4dC1maWVsZC0tc29sby1pbnZlcnRlZCc6IHRoaXMuc29sb0ludmVydGVkLFxuICAgICAgICAndi10ZXh0LWZpZWxkLS1zb2xvLWZsYXQnOiB0aGlzLmZsYXQsXG4gICAgICAgICd2LXRleHQtZmllbGQtLWZpbGxlZCc6IHRoaXMuZmlsbGVkLFxuICAgICAgICAndi10ZXh0LWZpZWxkLS1pcy1ib290ZWQnOiB0aGlzLmlzQm9vdGVkLFxuICAgICAgICAndi10ZXh0LWZpZWxkLS1lbmNsb3NlZCc6IHRoaXMuaXNFbmNsb3NlZCxcbiAgICAgICAgJ3YtdGV4dC1maWVsZC0tcmV2ZXJzZSc6IHRoaXMucmV2ZXJzZSxcbiAgICAgICAgJ3YtdGV4dC1maWVsZC0tb3V0bGluZWQnOiB0aGlzLm91dGxpbmVkLFxuICAgICAgICAndi10ZXh0LWZpZWxkLS1wbGFjZWhvbGRlcic6IHRoaXMucGxhY2Vob2xkZXIsXG4gICAgICAgICd2LXRleHQtZmllbGQtLXJvdW5kZWQnOiB0aGlzLnJvdW5kZWQsXG4gICAgICAgICd2LXRleHQtZmllbGQtLXNoYXBlZCc6IHRoaXMuc2hhcGVkLFxuICAgICAgfVxuICAgIH0sXG4gICAgY29tcHV0ZWRDb2xvciAoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgIGNvbnN0IGNvbXB1dGVkQ29sb3IgPSBWYWxpZGF0YWJsZS5vcHRpb25zLmNvbXB1dGVkLmNvbXB1dGVkQ29sb3IuY2FsbCh0aGlzKVxuXG4gICAgICBpZiAoIXRoaXMuc29sb0ludmVydGVkIHx8ICF0aGlzLmlzRm9jdXNlZCkgcmV0dXJuIGNvbXB1dGVkQ29sb3JcblxuICAgICAgcmV0dXJuIHRoaXMuY29sb3IgfHwgJ3ByaW1hcnknXG4gICAgfSxcbiAgICBjb21wdXRlZENvdW50ZXJWYWx1ZSAoKTogbnVtYmVyIHtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5jb3VudGVyVmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY291bnRlclZhbHVlKHRoaXMuaW50ZXJuYWxWYWx1ZSlcbiAgICAgIH1cbiAgICAgIHJldHVybiAodGhpcy5pbnRlcm5hbFZhbHVlIHx8ICcnKS50b1N0cmluZygpLmxlbmd0aFxuICAgIH0sXG4gICAgaGFzQ291bnRlciAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5jb3VudGVyICE9PSBmYWxzZSAmJiB0aGlzLmNvdW50ZXIgIT0gbnVsbFxuICAgIH0sXG4gICAgaGFzRGV0YWlscyAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gVklucHV0Lm9wdGlvbnMuY29tcHV0ZWQuaGFzRGV0YWlscy5jYWxsKHRoaXMpIHx8IHRoaXMuaGFzQ291bnRlclxuICAgIH0sXG4gICAgaW50ZXJuYWxWYWx1ZToge1xuICAgICAgZ2V0ICgpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5sYXp5VmFsdWVcbiAgICAgIH0sXG4gICAgICBzZXQgKHZhbDogYW55KSB7XG4gICAgICAgIHRoaXMubGF6eVZhbHVlID0gdmFsXG4gICAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgdGhpcy5sYXp5VmFsdWUpXG4gICAgICB9LFxuICAgIH0sXG4gICAgaXNEaXJ0eSAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gKHRoaXMubGF6eVZhbHVlICE9IG51bGwgJiZcbiAgICAgICAgdGhpcy5sYXp5VmFsdWUudG9TdHJpbmcoKS5sZW5ndGggPiAwKSB8fFxuICAgICAgICB0aGlzLmJhZElucHV0XG4gICAgfSxcbiAgICBpc0VuY2xvc2VkICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIHRoaXMuZmlsbGVkIHx8XG4gICAgICAgIHRoaXMuaXNTb2xvIHx8XG4gICAgICAgIHRoaXMub3V0bGluZWRcbiAgICAgIClcbiAgICB9LFxuICAgIGlzTGFiZWxBY3RpdmUgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMuaXNEaXJ0eSB8fCBkaXJ0eVR5cGVzLmluY2x1ZGVzKHRoaXMudHlwZSlcbiAgICB9LFxuICAgIGlzU2luZ2xlICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIHRoaXMuaXNTb2xvIHx8XG4gICAgICAgIHRoaXMuc2luZ2xlTGluZSB8fFxuICAgICAgICB0aGlzLmZ1bGxXaWR0aCB8fFxuICAgICAgICAvLyBodHRwczovL21hdGVyaWFsLmlvL2NvbXBvbmVudHMvdGV4dC1maWVsZHMvI2ZpbGxlZC10ZXh0LWZpZWxkXG4gICAgICAgICh0aGlzLmZpbGxlZCAmJiAhdGhpcy5oYXNMYWJlbClcbiAgICAgIClcbiAgICB9LFxuICAgIGlzU29sbyAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5zb2xvIHx8IHRoaXMuc29sb0ludmVydGVkXG4gICAgfSxcbiAgICBsYWJlbFBvc2l0aW9uICgpOiBSZWNvcmQ8J2xlZnQnIHwgJ3JpZ2h0Jywgc3RyaW5nIHwgbnVtYmVyIHwgdW5kZWZpbmVkPiB7XG4gICAgICBsZXQgb2Zmc2V0ID0gKHRoaXMucHJlZml4ICYmICF0aGlzLmxhYmVsVmFsdWUpID8gdGhpcy5wcmVmaXhXaWR0aCA6IDBcblxuICAgICAgaWYgKHRoaXMubGFiZWxWYWx1ZSAmJiB0aGlzLnByZXBlbmRXaWR0aCkgb2Zmc2V0IC09IHRoaXMucHJlcGVuZFdpZHRoXG5cbiAgICAgIHJldHVybiAodGhpcy4kdnVldGlmeS5ydGwgPT09IHRoaXMucmV2ZXJzZSkgPyB7XG4gICAgICAgIGxlZnQ6IG9mZnNldCxcbiAgICAgICAgcmlnaHQ6ICdhdXRvJyxcbiAgICAgIH0gOiB7XG4gICAgICAgIGxlZnQ6ICdhdXRvJyxcbiAgICAgICAgcmlnaHQ6IG9mZnNldCxcbiAgICAgIH1cbiAgICB9LFxuICAgIHNob3dMYWJlbCAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5oYXNMYWJlbCAmJiAoIXRoaXMuaXNTaW5nbGUgfHwgKCF0aGlzLmlzTGFiZWxBY3RpdmUgJiYgIXRoaXMucGxhY2Vob2xkZXIpKVxuICAgIH0sXG4gICAgbGFiZWxWYWx1ZSAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gIXRoaXMuaXNTaW5nbGUgJiZcbiAgICAgICAgQm9vbGVhbih0aGlzLmlzRm9jdXNlZCB8fCB0aGlzLmlzTGFiZWxBY3RpdmUgfHwgdGhpcy5wbGFjZWhvbGRlcilcbiAgICB9LFxuICB9LFxuXG4gIHdhdGNoOiB7XG4gICAgbGFiZWxWYWx1ZTogJ3NldExhYmVsV2lkdGgnLFxuICAgIG91dGxpbmVkOiAnc2V0TGFiZWxXaWR0aCcsXG4gICAgbGFiZWwgKCkge1xuICAgICAgdGhpcy4kbmV4dFRpY2sodGhpcy5zZXRMYWJlbFdpZHRoKVxuICAgIH0sXG4gICAgcHJlZml4ICgpIHtcbiAgICAgIHRoaXMuJG5leHRUaWNrKHRoaXMuc2V0UHJlZml4V2lkdGgpXG4gICAgfSxcbiAgICBpc0ZvY3VzZWQ6ICd1cGRhdGVWYWx1ZScsXG4gICAgdmFsdWUgKHZhbCkge1xuICAgICAgdGhpcy5sYXp5VmFsdWUgPSB2YWxcbiAgICB9LFxuICB9LFxuXG4gIGNyZWF0ZWQgKCkge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKHRoaXMuJGF0dHJzLmhhc093blByb3BlcnR5KCdib3gnKSkge1xuICAgICAgYnJlYWtpbmcoJ2JveCcsICdmaWxsZWQnLCB0aGlzKVxuICAgIH1cblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKHRoaXMuJGF0dHJzLmhhc093blByb3BlcnR5KCdicm93c2VyLWF1dG9jb21wbGV0ZScpKSB7XG4gICAgICBicmVha2luZygnYnJvd3Nlci1hdXRvY29tcGxldGUnLCAnYXV0b2NvbXBsZXRlJywgdGhpcylcbiAgICB9XG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAodGhpcy5zaGFwZWQgJiYgISh0aGlzLmZpbGxlZCB8fCB0aGlzLm91dGxpbmVkIHx8IHRoaXMuaXNTb2xvKSkge1xuICAgICAgY29uc29sZVdhcm4oJ3NoYXBlZCBzaG91bGQgYmUgdXNlZCB3aXRoIGVpdGhlciBmaWxsZWQgb3Igb3V0bGluZWQnLCB0aGlzKVxuICAgIH1cbiAgfSxcblxuICBtb3VudGVkICgpIHtcbiAgICB0aGlzLmF1dG9mb2N1cyAmJiB0aGlzLnRyeUF1dG9mb2N1cygpXG4gICAgdGhpcy5zZXRMYWJlbFdpZHRoKClcbiAgICB0aGlzLnNldFByZWZpeFdpZHRoKClcbiAgICB0aGlzLnNldFByZXBlbmRXaWR0aCgpXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+ICh0aGlzLmlzQm9vdGVkID0gdHJ1ZSkpXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIC8qKiBAcHVibGljICovXG4gICAgZm9jdXMgKCkge1xuICAgICAgdGhpcy5vbkZvY3VzKClcbiAgICB9LFxuICAgIC8qKiBAcHVibGljICovXG4gICAgYmx1ciAoZT86IEV2ZW50KSB7XG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdnVldGlmeWpzL3Z1ZXRpZnkvaXNzdWVzLzU5MTNcbiAgICAgIC8vIFNhZmFyaSB0YWIgb3JkZXIgZ2V0cyBicm9rZW4gaWYgY2FsbGVkIHN5bmNocm9ub3VzXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgdGhpcy4kcmVmcy5pbnB1dCAmJiB0aGlzLiRyZWZzLmlucHV0LmJsdXIoKVxuICAgICAgfSlcbiAgICB9LFxuICAgIGNsZWFyYWJsZUNhbGxiYWNrICgpIHtcbiAgICAgIHRoaXMuJHJlZnMuaW5wdXQgJiYgdGhpcy4kcmVmcy5pbnB1dC5mb2N1cygpXG4gICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB0aGlzLmludGVybmFsVmFsdWUgPSBudWxsKVxuICAgIH0sXG4gICAgZ2VuQXBwZW5kU2xvdCAoKSB7XG4gICAgICBjb25zdCBzbG90ID0gW11cblxuICAgICAgaWYgKHRoaXMuJHNsb3RzWydhcHBlbmQtb3V0ZXInXSkge1xuICAgICAgICBzbG90LnB1c2godGhpcy4kc2xvdHNbJ2FwcGVuZC1vdXRlciddIGFzIFZOb2RlW10pXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuYXBwZW5kT3V0ZXJJY29uKSB7XG4gICAgICAgIHNsb3QucHVzaCh0aGlzLmdlbkljb24oJ2FwcGVuZE91dGVyJykpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmdlblNsb3QoJ2FwcGVuZCcsICdvdXRlcicsIHNsb3QpXG4gICAgfSxcbiAgICBnZW5QcmVwZW5kSW5uZXJTbG90ICgpIHtcbiAgICAgIGNvbnN0IHNsb3QgPSBbXVxuXG4gICAgICBpZiAodGhpcy4kc2xvdHNbJ3ByZXBlbmQtaW5uZXInXSkge1xuICAgICAgICBzbG90LnB1c2godGhpcy4kc2xvdHNbJ3ByZXBlbmQtaW5uZXInXSBhcyBWTm9kZVtdKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXBlbmRJbm5lckljb24pIHtcbiAgICAgICAgc2xvdC5wdXNoKHRoaXMuZ2VuSWNvbigncHJlcGVuZElubmVyJykpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmdlblNsb3QoJ3ByZXBlbmQnLCAnaW5uZXInLCBzbG90KVxuICAgIH0sXG4gICAgZ2VuSWNvblNsb3QgKCkge1xuICAgICAgY29uc3Qgc2xvdCA9IFtdXG5cbiAgICAgIGlmICh0aGlzLiRzbG90c1snYXBwZW5kJ10pIHtcbiAgICAgICAgc2xvdC5wdXNoKHRoaXMuJHNsb3RzWydhcHBlbmQnXSBhcyBWTm9kZVtdKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmFwcGVuZEljb24pIHtcbiAgICAgICAgc2xvdC5wdXNoKHRoaXMuZ2VuSWNvbignYXBwZW5kJykpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmdlblNsb3QoJ2FwcGVuZCcsICdpbm5lcicsIHNsb3QpXG4gICAgfSxcbiAgICBnZW5JbnB1dFNsb3QgKCkge1xuICAgICAgY29uc3QgaW5wdXQgPSBWSW5wdXQub3B0aW9ucy5tZXRob2RzLmdlbklucHV0U2xvdC5jYWxsKHRoaXMpXG5cbiAgICAgIGNvbnN0IHByZXBlbmQgPSB0aGlzLmdlblByZXBlbmRJbm5lclNsb3QoKVxuXG4gICAgICBpZiAocHJlcGVuZCkge1xuICAgICAgICBpbnB1dC5jaGlsZHJlbiA9IGlucHV0LmNoaWxkcmVuIHx8IFtdXG4gICAgICAgIGlucHV0LmNoaWxkcmVuLnVuc2hpZnQocHJlcGVuZClcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGlucHV0XG4gICAgfSxcbiAgICBnZW5DbGVhckljb24gKCkge1xuICAgICAgaWYgKCF0aGlzLmNsZWFyYWJsZSkgcmV0dXJuIG51bGxcblxuICAgICAgY29uc3QgZGF0YSA9IHRoaXMuaXNEaXJ0eSA/IHVuZGVmaW5lZCA6IHsgYXR0cnM6IHsgZGlzYWJsZWQ6IHRydWUgfSB9XG5cbiAgICAgIHJldHVybiB0aGlzLmdlblNsb3QoJ2FwcGVuZCcsICdpbm5lcicsIFtcbiAgICAgICAgdGhpcy5nZW5JY29uKCdjbGVhcicsIHRoaXMuY2xlYXJhYmxlQ2FsbGJhY2ssIGRhdGEpLFxuICAgICAgXSlcbiAgICB9LFxuICAgIGdlbkNvdW50ZXIgKCkge1xuICAgICAgaWYgKCF0aGlzLmhhc0NvdW50ZXIpIHJldHVybiBudWxsXG5cbiAgICAgIGNvbnN0IG1heCA9IHRoaXMuY291bnRlciA9PT0gdHJ1ZSA/IHRoaXMuYXR0cnMkLm1heGxlbmd0aCA6IHRoaXMuY291bnRlclxuXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudChWQ291bnRlciwge1xuICAgICAgICBwcm9wczoge1xuICAgICAgICAgIGRhcms6IHRoaXMuZGFyayxcbiAgICAgICAgICBsaWdodDogdGhpcy5saWdodCxcbiAgICAgICAgICBtYXgsXG4gICAgICAgICAgdmFsdWU6IHRoaXMuY29tcHV0ZWRDb3VudGVyVmFsdWUsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH0sXG4gICAgZ2VuQ29udHJvbCAoKSB7XG4gICAgICByZXR1cm4gVklucHV0Lm9wdGlvbnMubWV0aG9kcy5nZW5Db250cm9sLmNhbGwodGhpcylcbiAgICB9LFxuICAgIGdlbkRlZmF1bHRTbG90ICgpIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIHRoaXMuZ2VuRmllbGRzZXQoKSxcbiAgICAgICAgdGhpcy5nZW5UZXh0RmllbGRTbG90KCksXG4gICAgICAgIHRoaXMuZ2VuQ2xlYXJJY29uKCksXG4gICAgICAgIHRoaXMuZ2VuSWNvblNsb3QoKSxcbiAgICAgICAgdGhpcy5nZW5Qcm9ncmVzcygpLFxuICAgICAgXVxuICAgIH0sXG4gICAgZ2VuRmllbGRzZXQgKCkge1xuICAgICAgaWYgKCF0aGlzLm91dGxpbmVkKSByZXR1cm4gbnVsbFxuXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZmllbGRzZXQnLCB7XG4gICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgJ2FyaWEtaGlkZGVuJzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0sIFt0aGlzLmdlbkxlZ2VuZCgpXSlcbiAgICB9LFxuICAgIGdlbkxhYmVsICgpIHtcbiAgICAgIGlmICghdGhpcy5zaG93TGFiZWwpIHJldHVybiBudWxsXG5cbiAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgYWJzb2x1dGU6IHRydWUsXG4gICAgICAgICAgY29sb3I6IHRoaXMudmFsaWRhdGlvblN0YXRlLFxuICAgICAgICAgIGRhcms6IHRoaXMuZGFyayxcbiAgICAgICAgICBkaXNhYmxlZDogdGhpcy5pc0Rpc2FibGVkLFxuICAgICAgICAgIGZvY3VzZWQ6ICF0aGlzLmlzU2luZ2xlICYmICh0aGlzLmlzRm9jdXNlZCB8fCAhIXRoaXMudmFsaWRhdGlvblN0YXRlKSxcbiAgICAgICAgICBmb3I6IHRoaXMuY29tcHV0ZWRJZCxcbiAgICAgICAgICBsZWZ0OiB0aGlzLmxhYmVsUG9zaXRpb24ubGVmdCxcbiAgICAgICAgICBsaWdodDogdGhpcy5saWdodCxcbiAgICAgICAgICByaWdodDogdGhpcy5sYWJlbFBvc2l0aW9uLnJpZ2h0LFxuICAgICAgICAgIHZhbHVlOiB0aGlzLmxhYmVsVmFsdWUsXG4gICAgICAgIH0sXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZMYWJlbCwgZGF0YSwgdGhpcy4kc2xvdHMubGFiZWwgfHwgdGhpcy5sYWJlbClcbiAgICB9LFxuICAgIGdlbkxlZ2VuZCAoKSB7XG4gICAgICBjb25zdCB3aWR0aCA9ICF0aGlzLnNpbmdsZUxpbmUgJiYgKHRoaXMubGFiZWxWYWx1ZSB8fCB0aGlzLmlzRGlydHkpID8gdGhpcy5sYWJlbFdpZHRoIDogMFxuICAgICAgY29uc3Qgc3BhbiA9IHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7XG4gICAgICAgIGRvbVByb3BzOiB7IGlubmVySFRNTDogJyYjODIwMzsnIH0sXG4gICAgICB9KVxuXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnbGVnZW5kJywge1xuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIHdpZHRoOiAhdGhpcy5pc1NpbmdsZSA/IGNvbnZlcnRUb1VuaXQod2lkdGgpIDogdW5kZWZpbmVkLFxuICAgICAgICB9LFxuICAgICAgfSwgW3NwYW5dKVxuICAgIH0sXG4gICAgZ2VuSW5wdXQgKCkge1xuICAgICAgY29uc3QgbGlzdGVuZXJzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5saXN0ZW5lcnMkKVxuICAgICAgZGVsZXRlIGxpc3RlbmVyc1snY2hhbmdlJ10gLy8gQ2hhbmdlIHNob3VsZCBub3QgYmUgYm91bmQgZXh0ZXJuYWxseVxuXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnaW5wdXQnLCB7XG4gICAgICAgIHN0eWxlOiB7fSxcbiAgICAgICAgZG9tUHJvcHM6IHtcbiAgICAgICAgICB2YWx1ZTogKHRoaXMudHlwZSA9PT0gJ251bWJlcicgJiYgT2JqZWN0LmlzKHRoaXMubGF6eVZhbHVlLCAtMCkpID8gJy0wJyA6IHRoaXMubGF6eVZhbHVlLFxuICAgICAgICB9LFxuICAgICAgICBhdHRyczoge1xuICAgICAgICAgIC4uLnRoaXMuYXR0cnMkLFxuICAgICAgICAgIGF1dG9mb2N1czogdGhpcy5hdXRvZm9jdXMsXG4gICAgICAgICAgZGlzYWJsZWQ6IHRoaXMuaXNEaXNhYmxlZCxcbiAgICAgICAgICBpZDogdGhpcy5jb21wdXRlZElkLFxuICAgICAgICAgIHBsYWNlaG9sZGVyOiB0aGlzLnBsYWNlaG9sZGVyLFxuICAgICAgICAgIHJlYWRvbmx5OiB0aGlzLmlzUmVhZG9ubHksXG4gICAgICAgICAgdHlwZTogdGhpcy50eXBlLFxuICAgICAgICB9LFxuICAgICAgICBvbjogT2JqZWN0LmFzc2lnbihsaXN0ZW5lcnMsIHtcbiAgICAgICAgICBibHVyOiB0aGlzLm9uQmx1cixcbiAgICAgICAgICBpbnB1dDogdGhpcy5vbklucHV0LFxuICAgICAgICAgIGZvY3VzOiB0aGlzLm9uRm9jdXMsXG4gICAgICAgICAga2V5ZG93bjogdGhpcy5vbktleURvd24sXG4gICAgICAgIH0pLFxuICAgICAgICByZWY6ICdpbnB1dCcsXG4gICAgICB9KVxuICAgIH0sXG4gICAgZ2VuTWVzc2FnZXMgKCkge1xuICAgICAgaWYgKCF0aGlzLnNob3dEZXRhaWxzKSByZXR1cm4gbnVsbFxuXG4gICAgICBjb25zdCBtZXNzYWdlc05vZGUgPSBWSW5wdXQub3B0aW9ucy5tZXRob2RzLmdlbk1lc3NhZ2VzLmNhbGwodGhpcylcbiAgICAgIGNvbnN0IGNvdW50ZXJOb2RlID0gdGhpcy5nZW5Db3VudGVyKClcblxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LXRleHQtZmllbGRfX2RldGFpbHMnLFxuICAgICAgfSwgW1xuICAgICAgICBtZXNzYWdlc05vZGUsXG4gICAgICAgIGNvdW50ZXJOb2RlLFxuICAgICAgXSlcbiAgICB9LFxuICAgIGdlblRleHRGaWVsZFNsb3QgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LXRleHQtZmllbGRfX3Nsb3QnLFxuICAgICAgfSwgW1xuICAgICAgICB0aGlzLmdlbkxhYmVsKCksXG4gICAgICAgIHRoaXMucHJlZml4ID8gdGhpcy5nZW5BZmZpeCgncHJlZml4JykgOiBudWxsLFxuICAgICAgICB0aGlzLmdlbklucHV0KCksXG4gICAgICAgIHRoaXMuc3VmZml4ID8gdGhpcy5nZW5BZmZpeCgnc3VmZml4JykgOiBudWxsLFxuICAgICAgXSlcbiAgICB9LFxuICAgIGdlbkFmZml4ICh0eXBlOiAncHJlZml4JyB8ICdzdWZmaXgnKSB7XG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICBjbGFzczogYHYtdGV4dC1maWVsZF9fJHt0eXBlfWAsXG4gICAgICAgIHJlZjogdHlwZSxcbiAgICAgIH0sIHRoaXNbdHlwZV0pXG4gICAgfSxcbiAgICBvbkJsdXIgKGU/OiBFdmVudCkge1xuICAgICAgdGhpcy5pc0ZvY3VzZWQgPSBmYWxzZVxuICAgICAgZSAmJiB0aGlzLiRuZXh0VGljaygoKSA9PiB0aGlzLiRlbWl0KCdibHVyJywgZSkpXG4gICAgfSxcbiAgICBvbkNsaWNrICgpIHtcbiAgICAgIGlmICh0aGlzLmlzRm9jdXNlZCB8fCB0aGlzLmlzRGlzYWJsZWQgfHwgIXRoaXMuJHJlZnMuaW5wdXQpIHJldHVyblxuXG4gICAgICB0aGlzLiRyZWZzLmlucHV0LmZvY3VzKClcbiAgICB9LFxuICAgIG9uRm9jdXMgKGU/OiBFdmVudCkge1xuICAgICAgaWYgKCF0aGlzLiRyZWZzLmlucHV0KSByZXR1cm5cblxuICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IHRoaXMuJHJlZnMuaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJHJlZnMuaW5wdXQuZm9jdXMoKVxuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuaXNGb2N1c2VkKSB7XG4gICAgICAgIHRoaXMuaXNGb2N1c2VkID0gdHJ1ZVxuICAgICAgICBlICYmIHRoaXMuJGVtaXQoJ2ZvY3VzJywgZSlcbiAgICAgIH1cbiAgICB9LFxuICAgIG9uSW5wdXQgKGU6IEV2ZW50KSB7XG4gICAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50XG4gICAgICB0aGlzLmludGVybmFsVmFsdWUgPSB0YXJnZXQudmFsdWVcbiAgICAgIHRoaXMuYmFkSW5wdXQgPSB0YXJnZXQudmFsaWRpdHkgJiYgdGFyZ2V0LnZhbGlkaXR5LmJhZElucHV0XG4gICAgfSxcbiAgICBvbktleURvd24gKGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgIGlmIChlLmtleUNvZGUgPT09IGtleUNvZGVzLmVudGVyKSB0aGlzLiRlbWl0KCdjaGFuZ2UnLCB0aGlzLmludGVybmFsVmFsdWUpXG5cbiAgICAgIHRoaXMuJGVtaXQoJ2tleWRvd24nLCBlKVxuICAgIH0sXG4gICAgb25Nb3VzZURvd24gKGU6IEV2ZW50KSB7XG4gICAgICAvLyBQcmV2ZW50IGlucHV0IGZyb20gYmVpbmcgYmx1cnJlZFxuICAgICAgaWYgKGUudGFyZ2V0ICE9PSB0aGlzLiRyZWZzLmlucHV0KSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICB9XG5cbiAgICAgIFZJbnB1dC5vcHRpb25zLm1ldGhvZHMub25Nb3VzZURvd24uY2FsbCh0aGlzLCBlKVxuICAgIH0sXG4gICAgb25Nb3VzZVVwIChlOiBFdmVudCkge1xuICAgICAgaWYgKHRoaXMuaGFzTW91c2VEb3duKSB0aGlzLmZvY3VzKClcblxuICAgICAgVklucHV0Lm9wdGlvbnMubWV0aG9kcy5vbk1vdXNlVXAuY2FsbCh0aGlzLCBlKVxuICAgIH0sXG4gICAgc2V0TGFiZWxXaWR0aCAoKSB7XG4gICAgICBpZiAoIXRoaXMub3V0bGluZWQpIHJldHVyblxuXG4gICAgICB0aGlzLmxhYmVsV2lkdGggPSB0aGlzLiRyZWZzLmxhYmVsXG4gICAgICAgID8gTWF0aC5taW4odGhpcy4kcmVmcy5sYWJlbC5zY3JvbGxXaWR0aCAqIDAuNzUgKyA2LCAodGhpcy4kZWwgYXMgSFRNTEVsZW1lbnQpLm9mZnNldFdpZHRoIC0gMjQpXG4gICAgICAgIDogMFxuICAgIH0sXG4gICAgc2V0UHJlZml4V2lkdGggKCkge1xuICAgICAgaWYgKCF0aGlzLiRyZWZzLnByZWZpeCkgcmV0dXJuXG5cbiAgICAgIHRoaXMucHJlZml4V2lkdGggPSB0aGlzLiRyZWZzLnByZWZpeC5vZmZzZXRXaWR0aFxuICAgIH0sXG4gICAgc2V0UHJlcGVuZFdpZHRoICgpIHtcbiAgICAgIGlmICghdGhpcy5vdXRsaW5lZCB8fCAhdGhpcy4kcmVmc1sncHJlcGVuZC1pbm5lciddKSByZXR1cm5cblxuICAgICAgdGhpcy5wcmVwZW5kV2lkdGggPSB0aGlzLiRyZWZzWydwcmVwZW5kLWlubmVyJ10ub2Zmc2V0V2lkdGhcbiAgICB9LFxuICAgIHRyeUF1dG9mb2N1cyAoKSB7XG4gICAgICBpZiAoXG4gICAgICAgICF0aGlzLmF1dG9mb2N1cyB8fFxuICAgICAgICB0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnIHx8XG4gICAgICAgICF0aGlzLiRyZWZzLmlucHV0IHx8XG4gICAgICAgIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IHRoaXMuJHJlZnMuaW5wdXRcbiAgICAgICkgcmV0dXJuIGZhbHNlXG5cbiAgICAgIHRoaXMuJHJlZnMuaW5wdXQuZm9jdXMoKVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH0sXG4gICAgdXBkYXRlVmFsdWUgKHZhbDogYm9vbGVhbikge1xuICAgICAgLy8gU2V0cyB2YWxpZGF0aW9uU3RhdGUgZnJvbSB2YWxpZGF0YWJsZVxuICAgICAgdGhpcy5oYXNDb2xvciA9IHZhbFxuXG4gICAgICBpZiAodmFsKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbFZhbHVlID0gdGhpcy5sYXp5VmFsdWVcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pbml0aWFsVmFsdWUgIT09IHRoaXMubGF6eVZhbHVlKSB7XG4gICAgICAgIHRoaXMuJGVtaXQoJ2NoYW5nZScsIHRoaXMubGF6eVZhbHVlKVxuICAgICAgfVxuICAgIH0sXG4gIH0sXG59KVxuIl19