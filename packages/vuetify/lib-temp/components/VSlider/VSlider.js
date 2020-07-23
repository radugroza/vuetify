import './VSlider.sass';
// Components
import VInput from '../VInput';
import { VScaleTransition } from '../transitions';
// Mixins
import mixins from '../../util/mixins';
import Loadable from '../../mixins/loadable';
// Directives
import ClickOutside from '../../directives/click-outside';
// Helpers
import { addOnceEventListener, deepEqual, keyCodes, createRange, convertToUnit, passiveSupported } from '../../util/helpers';
import { consoleWarn } from '../../util/console';
export default mixins(VInput, Loadable
/* @vue/component */
).extend({
    name: 'v-slider',
    directives: {
        ClickOutside,
    },
    mixins: [Loadable],
    props: {
        disabled: Boolean,
        inverseLabel: Boolean,
        max: {
            type: [Number, String],
            default: 100,
        },
        min: {
            type: [Number, String],
            default: 0,
        },
        step: {
            type: [Number, String],
            default: 1,
        },
        thumbColor: String,
        thumbLabel: {
            type: [Boolean, String],
            default: undefined,
            validator: v => typeof v === 'boolean' || v === 'always',
        },
        thumbSize: {
            type: [Number, String],
            default: 32,
        },
        tickLabels: {
            type: Array,
            default: () => ([]),
        },
        ticks: {
            type: [Boolean, String],
            default: false,
            validator: v => typeof v === 'boolean' || v === 'always',
        },
        tickSize: {
            type: [Number, String],
            default: 2,
        },
        trackColor: String,
        trackFillColor: String,
        value: [Number, String],
        vertical: Boolean,
    },
    data: () => ({
        app: null,
        oldValue: null,
        keyPressed: 0,
        isFocused: false,
        isActive: false,
        noClick: false,
    }),
    computed: {
        classes() {
            return {
                ...VInput.options.computed.classes.call(this),
                'v-input__slider': true,
                'v-input__slider--vertical': this.vertical,
                'v-input__slider--inverse-label': this.inverseLabel,
            };
        },
        internalValue: {
            get() {
                return this.lazyValue;
            },
            set(val) {
                val = isNaN(val) ? this.minValue : val;
                // Round value to ensure the
                // entire slider range can
                // be selected with step
                const value = this.roundValue(Math.min(Math.max(val, this.minValue), this.maxValue));
                if (value === this.lazyValue)
                    return;
                this.lazyValue = value;
                this.$emit('input', value);
            },
        },
        trackTransition() {
            return this.keyPressed >= 2 ? 'none' : '';
        },
        minValue() {
            return parseFloat(this.min);
        },
        maxValue() {
            return parseFloat(this.max);
        },
        stepNumeric() {
            return this.step > 0 ? parseFloat(this.step) : 0;
        },
        inputWidth() {
            const value = (this.roundValue(this.internalValue) - this.minValue) / (this.maxValue - this.minValue) * 100;
            return value;
        },
        trackFillStyles() {
            const startDir = this.vertical ? 'bottom' : 'left';
            const endDir = this.vertical ? 'top' : 'right';
            const valueDir = this.vertical ? 'height' : 'width';
            const start = this.$vuetify.rtl ? 'auto' : '0';
            const end = this.$vuetify.rtl ? '0' : 'auto';
            const value = this.isDisabled ? `calc(${this.inputWidth}% - 10px)` : `${this.inputWidth}%`;
            return {
                transition: this.trackTransition,
                [startDir]: start,
                [endDir]: end,
                [valueDir]: value,
            };
        },
        trackStyles() {
            const startDir = this.vertical ? this.$vuetify.rtl ? 'bottom' : 'top' : this.$vuetify.rtl ? 'left' : 'right';
            const endDir = this.vertical ? 'height' : 'width';
            const start = '0px';
            const end = this.isDisabled ? `calc(${100 - this.inputWidth}% - 10px)` : `calc(${100 - this.inputWidth}%)`;
            return {
                transition: this.trackTransition,
                [startDir]: start,
                [endDir]: end,
            };
        },
        showTicks() {
            return this.tickLabels.length > 0 ||
                !!(!this.isDisabled && this.stepNumeric && this.ticks);
        },
        numTicks() {
            return Math.ceil((this.maxValue - this.minValue) / this.stepNumeric);
        },
        showThumbLabel() {
            return !this.isDisabled && !!(this.thumbLabel ||
                this.$scopedSlots['thumb-label']);
        },
        computedTrackColor() {
            if (this.isDisabled)
                return undefined;
            if (this.trackColor)
                return this.trackColor;
            if (this.isDark)
                return this.validationState;
            return this.validationState || 'primary lighten-3';
        },
        computedTrackFillColor() {
            if (this.isDisabled)
                return undefined;
            if (this.trackFillColor)
                return this.trackFillColor;
            return this.validationState || this.computedColor;
        },
        computedThumbColor() {
            if (this.thumbColor)
                return this.thumbColor;
            return this.validationState || this.computedColor;
        },
    },
    watch: {
        min(val) {
            const parsed = parseFloat(val);
            parsed > this.internalValue && this.$emit('input', parsed);
        },
        max(val) {
            const parsed = parseFloat(val);
            parsed < this.internalValue && this.$emit('input', parsed);
        },
        value: {
            handler(v) {
                this.internalValue = v;
            },
        },
    },
    // If done in as immediate in
    // value watcher, causes issues
    // with vue-test-utils
    beforeMount() {
        this.internalValue = this.value;
    },
    mounted() {
        // Without a v-app, iOS does not work with body selectors
        this.app = document.querySelector('[data-app]') ||
            consoleWarn('Missing v-app or a non-body wrapping element with the [data-app] attribute', this);
    },
    methods: {
        genDefaultSlot() {
            const children = [this.genLabel()];
            const slider = this.genSlider();
            this.inverseLabel
                ? children.unshift(slider)
                : children.push(slider);
            children.push(this.genProgress());
            return children;
        },
        genSlider() {
            return this.$createElement('div', {
                class: {
                    'v-slider': true,
                    'v-slider--horizontal': !this.vertical,
                    'v-slider--vertical': this.vertical,
                    'v-slider--focused': this.isFocused,
                    'v-slider--active': this.isActive,
                    'v-slider--disabled': this.isDisabled,
                    'v-slider--readonly': this.isReadonly,
                    ...this.themeClasses,
                },
                directives: [{
                        name: 'click-outside',
                        value: this.onBlur,
                    }],
                on: {
                    click: this.onSliderClick,
                },
            }, this.genChildren());
        },
        genChildren() {
            return [
                this.genInput(),
                this.genTrackContainer(),
                this.genSteps(),
                this.genThumbContainer(this.internalValue, this.inputWidth, this.isActive, this.isFocused, this.onThumbMouseDown, this.onFocus, this.onBlur),
            ];
        },
        genInput() {
            return this.$createElement('input', {
                attrs: {
                    value: this.internalValue,
                    id: this.computedId,
                    disabled: this.isDisabled,
                    readonly: true,
                    tabindex: -1,
                    ...this.$attrs,
                },
            });
        },
        genTrackContainer() {
            const children = [
                this.$createElement('div', this.setBackgroundColor(this.computedTrackColor, {
                    staticClass: 'v-slider__track-background',
                    style: this.trackStyles,
                })),
                this.$createElement('div', this.setBackgroundColor(this.computedTrackFillColor, {
                    staticClass: 'v-slider__track-fill',
                    style: this.trackFillStyles,
                })),
            ];
            return this.$createElement('div', {
                staticClass: 'v-slider__track-container',
                ref: 'track',
            }, children);
        },
        genSteps() {
            if (!this.step || !this.showTicks)
                return null;
            const tickSize = parseFloat(this.tickSize);
            const range = createRange(this.numTicks + 1);
            const direction = this.vertical ? 'bottom' : (this.$vuetify.rtl ? 'right' : 'left');
            const offsetDirection = this.vertical ? (this.$vuetify.rtl ? 'left' : 'right') : 'top';
            if (this.vertical)
                range.reverse();
            const ticks = range.map(index => {
                const children = [];
                if (this.tickLabels[index]) {
                    children.push(this.$createElement('div', {
                        staticClass: 'v-slider__tick-label',
                    }, this.tickLabels[index]));
                }
                const width = index * (100 / this.numTicks);
                const filled = this.$vuetify.rtl ? (100 - this.inputWidth) < width : width < this.inputWidth;
                return this.$createElement('span', {
                    key: index,
                    staticClass: 'v-slider__tick',
                    class: {
                        'v-slider__tick--filled': filled,
                    },
                    style: {
                        width: `${tickSize}px`,
                        height: `${tickSize}px`,
                        [direction]: `calc(${width}% - ${tickSize / 2}px)`,
                        [offsetDirection]: `calc(50% - ${tickSize / 2}px)`,
                    },
                }, children);
            });
            return this.$createElement('div', {
                staticClass: 'v-slider__ticks-container',
                class: {
                    'v-slider__ticks-container--always-show': this.ticks === 'always' || this.tickLabels.length > 0,
                },
            }, ticks);
        },
        genThumbContainer(value, valueWidth, isActive, isFocused, onDrag, onFocus, onBlur, ref = 'thumb') {
            const children = [this.genThumb()];
            const thumbLabelContent = this.genThumbLabelContent(value);
            this.showThumbLabel && children.push(this.genThumbLabel(thumbLabelContent));
            return this.$createElement('div', this.setTextColor(this.computedThumbColor, {
                ref,
                key: ref,
                staticClass: 'v-slider__thumb-container',
                class: {
                    'v-slider__thumb-container--active': isActive,
                    'v-slider__thumb-container--focused': isFocused,
                    'v-slider__thumb-container--show-label': this.showThumbLabel,
                },
                style: this.getThumbContainerStyles(valueWidth),
                attrs: {
                    role: 'slider',
                    tabindex: this.isDisabled ? -1 : this.$attrs.tabindex ? this.$attrs.tabindex : 0,
                    'aria-label': this.label,
                    'aria-valuemin': this.min,
                    'aria-valuemax': this.max,
                    'aria-valuenow': this.internalValue,
                    'aria-readonly': String(this.isReadonly),
                    'aria-orientation': this.vertical ? 'vertical' : 'horizontal',
                    ...this.$attrs,
                },
                on: {
                    focus: onFocus,
                    blur: onBlur,
                    keydown: this.onKeyDown,
                    keyup: this.onKeyUp,
                    touchstart: onDrag,
                    mousedown: onDrag,
                },
            }), children);
        },
        genThumbLabelContent(value) {
            return this.$scopedSlots['thumb-label']
                ? this.$scopedSlots['thumb-label']({ value })
                : [this.$createElement('span', [String(value)])];
        },
        genThumbLabel(content) {
            const size = convertToUnit(this.thumbSize);
            const transform = this.vertical
                ? `translateY(20%) translateY(${(Number(this.thumbSize) / 3) - 1}px) translateX(55%) rotate(135deg)`
                : `translateY(-20%) translateY(-12px) translateX(-50%) rotate(45deg)`;
            return this.$createElement(VScaleTransition, {
                props: { origin: 'bottom center' },
            }, [
                this.$createElement('div', {
                    staticClass: 'v-slider__thumb-label-container',
                    directives: [{
                            name: 'show',
                            value: this.isFocused || this.isActive || this.thumbLabel === 'always',
                        }],
                }, [
                    this.$createElement('div', this.setBackgroundColor(this.computedThumbColor, {
                        staticClass: 'v-slider__thumb-label',
                        style: {
                            height: size,
                            width: size,
                            transform,
                        },
                    }), [this.$createElement('div', content)]),
                ]),
            ]);
        },
        genThumb() {
            return this.$createElement('div', this.setBackgroundColor(this.computedThumbColor, {
                staticClass: 'v-slider__thumb',
            }));
        },
        getThumbContainerStyles(width) {
            const direction = this.vertical ? 'top' : 'left';
            let value = this.$vuetify.rtl ? 100 - width : width;
            value = this.vertical ? 100 - value : value;
            return {
                transition: this.trackTransition,
                [direction]: `${value}%`,
            };
        },
        onThumbMouseDown(e) {
            e.preventDefault();
            this.oldValue = this.internalValue;
            this.keyPressed = 2;
            this.isActive = true;
            const mouseUpOptions = passiveSupported ? { passive: true, capture: true } : true;
            const mouseMoveOptions = passiveSupported ? { passive: true } : false;
            if ('touches' in e) {
                this.app.addEventListener('touchmove', this.onMouseMove, mouseMoveOptions);
                addOnceEventListener(this.app, 'touchend', this.onSliderMouseUp, mouseUpOptions);
            }
            else {
                this.app.addEventListener('mousemove', this.onMouseMove, mouseMoveOptions);
                addOnceEventListener(this.app, 'mouseup', this.onSliderMouseUp, mouseUpOptions);
            }
            this.$emit('start', this.internalValue);
        },
        onSliderMouseUp(e) {
            e.stopPropagation();
            this.keyPressed = 0;
            const mouseMoveOptions = passiveSupported ? { passive: true } : false;
            this.app.removeEventListener('touchmove', this.onMouseMove, mouseMoveOptions);
            this.app.removeEventListener('mousemove', this.onMouseMove, mouseMoveOptions);
            this.$emit('mouseup', e);
            this.$emit('end', this.internalValue);
            if (!deepEqual(this.oldValue, this.internalValue)) {
                this.$emit('change', this.internalValue);
                this.noClick = true;
            }
            this.isActive = false;
        },
        onMouseMove(e) {
            const { value } = this.parseMouseMove(e);
            this.internalValue = value;
        },
        onKeyDown(e) {
            if (!this.isInteractive)
                return;
            const value = this.parseKeyDown(e, this.internalValue);
            if (value == null ||
                value < this.minValue ||
                value > this.maxValue)
                return;
            this.internalValue = value;
            this.$emit('change', value);
        },
        onKeyUp() {
            this.keyPressed = 0;
        },
        onSliderClick(e) {
            if (this.noClick) {
                this.noClick = false;
                return;
            }
            const thumb = this.$refs.thumb;
            thumb.focus();
            this.onMouseMove(e);
            this.$emit('change', this.internalValue);
        },
        onBlur(e) {
            this.isFocused = false;
            this.$emit('blur', e);
        },
        onFocus(e) {
            this.isFocused = true;
            this.$emit('focus', e);
        },
        parseMouseMove(e) {
            const start = this.vertical ? 'top' : 'left';
            const length = this.vertical ? 'height' : 'width';
            const click = this.vertical ? 'clientY' : 'clientX';
            const { [start]: trackStart, [length]: trackLength, } = this.$refs.track.getBoundingClientRect();
            const clickOffset = 'touches' in e ? e.touches[0][click] : e[click]; // Can we get rid of any here?
            // It is possible for left to be NaN, force to number
            let clickPos = Math.min(Math.max((clickOffset - trackStart) / trackLength, 0), 1) || 0;
            if (this.vertical)
                clickPos = 1 - clickPos;
            if (this.$vuetify.rtl)
                clickPos = 1 - clickPos;
            const isInsideTrack = clickOffset >= trackStart && clickOffset <= trackStart + trackLength;
            const value = parseFloat(this.min) + clickPos * (this.maxValue - this.minValue);
            return { value, isInsideTrack };
        },
        parseKeyDown(e, value) {
            if (!this.isInteractive)
                return;
            const { pageup, pagedown, end, home, left, right, down, up } = keyCodes;
            if (![pageup, pagedown, end, home, left, right, down, up].includes(e.keyCode))
                return;
            e.preventDefault();
            const step = this.stepNumeric || 1;
            const steps = (this.maxValue - this.minValue) / step;
            if ([left, right, down, up].includes(e.keyCode)) {
                this.keyPressed += 1;
                const increase = this.$vuetify.rtl ? [left, up] : [right, up];
                const direction = increase.includes(e.keyCode) ? 1 : -1;
                const multiplier = e.shiftKey ? 3 : (e.ctrlKey ? 2 : 1);
                value = value + (direction * step * multiplier);
            }
            else if (e.keyCode === home) {
                value = this.minValue;
            }
            else if (e.keyCode === end) {
                value = this.maxValue;
            }
            else {
                const direction = e.keyCode === pagedown ? 1 : -1;
                value = value - (direction * step * (steps > 100 ? steps / 10 : 10));
            }
            return value;
        },
        roundValue(value) {
            if (!this.stepNumeric)
                return value;
            // Format input value using the same number
            // of decimals places as in the step prop
            const trimmedStep = this.step.toString().trim();
            const decimals = trimmedStep.indexOf('.') > -1
                ? (trimmedStep.length - trimmedStep.indexOf('.') - 1)
                : 0;
            const offset = this.minValue % this.stepNumeric;
            const newValue = Math.round((value - offset) / this.stepNumeric) * this.stepNumeric + offset;
            return parseFloat(Math.min(newValue, this.maxValue).toFixed(decimals));
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlNsaWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZTbGlkZXIvVlNsaWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLGdCQUFnQixDQUFBO0FBRXZCLGFBQWE7QUFDYixPQUFPLE1BQU0sTUFBTSxXQUFXLENBQUE7QUFDOUIsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sZ0JBQWdCLENBQUE7QUFFakQsU0FBUztBQUNULE9BQU8sTUFBc0IsTUFBTSxtQkFBbUIsQ0FBQTtBQUN0RCxPQUFPLFFBQVEsTUFBTSx1QkFBdUIsQ0FBQTtBQUU1QyxhQUFhO0FBQ2IsT0FBTyxZQUFZLE1BQU0sZ0NBQWdDLENBQUE7QUFFekQsVUFBVTtBQUNWLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUM1SCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFZaEQsZUFBZSxNQUFNLENBUW5CLE1BQU0sRUFDTixRQUFRO0FBQ1Ysb0JBQW9CO0NBQ25CLENBQUMsTUFBTSxDQUFDO0lBQ1AsSUFBSSxFQUFFLFVBQVU7SUFFaEIsVUFBVSxFQUFFO1FBQ1YsWUFBWTtLQUNiO0lBRUQsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDO0lBRWxCLEtBQUssRUFBRTtRQUNMLFFBQVEsRUFBRSxPQUFPO1FBQ2pCLFlBQVksRUFBRSxPQUFPO1FBQ3JCLEdBQUcsRUFBRTtZQUNILElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxFQUFFLEdBQUc7U0FDYjtRQUNELEdBQUcsRUFBRTtZQUNILElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxFQUFFLENBQUM7U0FDWDtRQUNELElBQUksRUFBRTtZQUNKLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxFQUFFLENBQUM7U0FDWDtRQUNELFVBQVUsRUFBRSxNQUFNO1FBQ2xCLFVBQVUsRUFBRTtZQUNWLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQTZDO1lBQ25FLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLFNBQVMsSUFBSSxDQUFDLEtBQUssUUFBUTtTQUN6RDtRQUNELFNBQVMsRUFBRTtZQUNULElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxFQUFFLEVBQUU7U0FDWjtRQUNELFVBQVUsRUFBRTtZQUNWLElBQUksRUFBRSxLQUEyQjtZQUNqQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7U0FDcEI7UUFDRCxLQUFLLEVBQUU7WUFDTCxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFpQztZQUN2RCxPQUFPLEVBQUUsS0FBSztZQUNkLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLFNBQVMsSUFBSSxDQUFDLEtBQUssUUFBUTtTQUN6RDtRQUNELFFBQVEsRUFBRTtZQUNSLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxFQUFFLENBQUM7U0FDWDtRQUNELFVBQVUsRUFBRSxNQUFNO1FBQ2xCLGNBQWMsRUFBRSxNQUFNO1FBQ3RCLEtBQUssRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7UUFDdkIsUUFBUSxFQUFFLE9BQU87S0FDbEI7SUFFRCxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNYLEdBQUcsRUFBRSxJQUFXO1FBQ2hCLFFBQVEsRUFBRSxJQUFXO1FBQ3JCLFVBQVUsRUFBRSxDQUFDO1FBQ2IsU0FBUyxFQUFFLEtBQUs7UUFDaEIsUUFBUSxFQUFFLEtBQUs7UUFDZixPQUFPLEVBQUUsS0FBSztLQUNmLENBQUM7SUFFRixRQUFRLEVBQUU7UUFDUixPQUFPO1lBQ0wsT0FBTztnQkFDTCxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUM3QyxpQkFBaUIsRUFBRSxJQUFJO2dCQUN2QiwyQkFBMkIsRUFBRSxJQUFJLENBQUMsUUFBUTtnQkFDMUMsZ0NBQWdDLEVBQUUsSUFBSSxDQUFDLFlBQVk7YUFDcEQsQ0FBQTtRQUNILENBQUM7UUFDRCxhQUFhLEVBQUU7WUFDYixHQUFHO2dCQUNELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQTtZQUN2QixDQUFDO1lBQ0QsR0FBRyxDQUFFLEdBQVc7Z0JBQ2QsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFBO2dCQUN0Qyw0QkFBNEI7Z0JBQzVCLDBCQUEwQjtnQkFDMUIsd0JBQXdCO2dCQUN4QixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO2dCQUVwRixJQUFJLEtBQUssS0FBSyxJQUFJLENBQUMsU0FBUztvQkFBRSxPQUFNO2dCQUVwQyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQTtnQkFFdEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUE7WUFDNUIsQ0FBQztTQUNGO1FBQ0QsZUFBZTtZQUNiLE9BQU8sSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFBO1FBQzNDLENBQUM7UUFDRCxRQUFRO1lBQ04sT0FBTyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQzdCLENBQUM7UUFDRCxRQUFRO1lBQ04sT0FBTyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQzdCLENBQUM7UUFDRCxXQUFXO1lBQ1QsT0FBTyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2xELENBQUM7UUFDRCxVQUFVO1lBQ1IsTUFBTSxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLENBQUE7WUFFM0csT0FBTyxLQUFLLENBQUE7UUFDZCxDQUFDO1FBQ0QsZUFBZTtZQUNiLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFBO1lBQ2xELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFBO1lBQzlDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFBO1lBRW5ELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQTtZQUM5QyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUE7WUFDNUMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENB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QyxDQUFDLENBQUMsQ0FBQTtZQUNMLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQTtZQUUvQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQTtZQUU1RixPQUFPLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUE7UUFDeEUsQ0FBQztLQUNGO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuL1ZTbGlkZXIuc2FzcydcblxuLy8gQ29tcG9uZW50c1xuaW1wb3J0IFZJbnB1dCBmcm9tICcuLi9WSW5wdXQnXG5pbXBvcnQgeyBWU2NhbGVUcmFuc2l0aW9uIH0gZnJvbSAnLi4vdHJhbnNpdGlvbnMnXG5cbi8vIE1peGluc1xuaW1wb3J0IG1peGlucywgeyBFeHRyYWN0VnVlIH0gZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5pbXBvcnQgTG9hZGFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2xvYWRhYmxlJ1xuXG4vLyBEaXJlY3RpdmVzXG5pbXBvcnQgQ2xpY2tPdXRzaWRlIGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvY2xpY2stb3V0c2lkZSdcblxuLy8gSGVscGVyc1xuaW1wb3J0IHsgYWRkT25jZUV2ZW50TGlzdGVuZXIsIGRlZXBFcXVhbCwga2V5Q29kZXMsIGNyZWF0ZVJhbmdlLCBjb252ZXJ0VG9Vbml0LCBwYXNzaXZlU3VwcG9ydGVkIH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuaW1wb3J0IHsgY29uc29sZVdhcm4gfSBmcm9tICcuLi8uLi91dGlsL2NvbnNvbGUnXG5cbi8vIFR5cGVzXG5pbXBvcnQgVnVlLCB7IFZOb2RlLCBWTm9kZUNoaWxkcmVuQXJyYXlDb250ZW50cywgUHJvcFR5cGUgfSBmcm9tICd2dWUnXG5pbXBvcnQgeyBTY29wZWRTbG90Q2hpbGRyZW4gfSBmcm9tICd2dWUvdHlwZXMvdm5vZGUnXG5cbmludGVyZmFjZSBvcHRpb25zIGV4dGVuZHMgVnVlIHtcbiAgJHJlZnM6IHtcbiAgICB0cmFjazogSFRNTEVsZW1lbnRcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBtaXhpbnM8b3B0aW9ucyAmXG4vKiBlc2xpbnQtZGlzYWJsZSBpbmRlbnQgKi9cbiAgRXh0cmFjdFZ1ZTxbXG4gICAgdHlwZW9mIFZJbnB1dCxcbiAgICB0eXBlb2YgTG9hZGFibGVcbiAgXT5cbi8qIGVzbGludC1lbmFibGUgaW5kZW50ICovXG4+KFxuICBWSW5wdXQsXG4gIExvYWRhYmxlXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuKS5leHRlbmQoe1xuICBuYW1lOiAndi1zbGlkZXInLFxuXG4gIGRpcmVjdGl2ZXM6IHtcbiAgICBDbGlja091dHNpZGUsXG4gIH0sXG5cbiAgbWl4aW5zOiBbTG9hZGFibGVdLFxuXG4gIHByb3BzOiB7XG4gICAgZGlzYWJsZWQ6IEJvb2xlYW4sXG4gICAgaW52ZXJzZUxhYmVsOiBCb29sZWFuLFxuICAgIG1heDoge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6IDEwMCxcbiAgICB9LFxuICAgIG1pbjoge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgICBzdGVwOiB7XG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxuICAgICAgZGVmYXVsdDogMSxcbiAgICB9LFxuICAgIHRodW1iQ29sb3I6IFN0cmluZyxcbiAgICB0aHVtYkxhYmVsOiB7XG4gICAgICB0eXBlOiBbQm9vbGVhbiwgU3RyaW5nXSBhcyBQcm9wVHlwZTxib29sZWFuIHwgJ2Fsd2F5cycgfCB1bmRlZmluZWQ+LFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgdmFsaWRhdG9yOiB2ID0+IHR5cGVvZiB2ID09PSAnYm9vbGVhbicgfHwgdiA9PT0gJ2Fsd2F5cycsXG4gICAgfSxcbiAgICB0aHVtYlNpemU6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiAzMixcbiAgICB9LFxuICAgIHRpY2tMYWJlbHM6IHtcbiAgICAgIHR5cGU6IEFycmF5IGFzIFByb3BUeXBlPHN0cmluZ1tdPixcbiAgICAgIGRlZmF1bHQ6ICgpID0+IChbXSksXG4gICAgfSxcbiAgICB0aWNrczoge1xuICAgICAgdHlwZTogW0Jvb2xlYW4sIFN0cmluZ10gYXMgUHJvcFR5cGU8Ym9vbGVhbiB8ICdhbHdheXMnPixcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgdmFsaWRhdG9yOiB2ID0+IHR5cGVvZiB2ID09PSAnYm9vbGVhbicgfHwgdiA9PT0gJ2Fsd2F5cycsXG4gICAgfSxcbiAgICB0aWNrU2l6ZToge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6IDIsXG4gICAgfSxcbiAgICB0cmFja0NvbG9yOiBTdHJpbmcsXG4gICAgdHJhY2tGaWxsQ29sb3I6IFN0cmluZyxcbiAgICB2YWx1ZTogW051bWJlciwgU3RyaW5nXSxcbiAgICB2ZXJ0aWNhbDogQm9vbGVhbixcbiAgfSxcblxuICBkYXRhOiAoKSA9PiAoe1xuICAgIGFwcDogbnVsbCBhcyBhbnksXG4gICAgb2xkVmFsdWU6IG51bGwgYXMgYW55LFxuICAgIGtleVByZXNzZWQ6IDAsXG4gICAgaXNGb2N1c2VkOiBmYWxzZSxcbiAgICBpc0FjdGl2ZTogZmFsc2UsXG4gICAgbm9DbGljazogZmFsc2UsIC8vIFByZXZlbnQgY2xpY2sgZXZlbnQgaWYgZHJhZ2dpbmcgdG9vayBwbGFjZSwgaGFjayBmb3IgIzc5MTVcbiAgfSksXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBjbGFzc2VzICgpOiBvYmplY3Qge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uVklucHV0Lm9wdGlvbnMuY29tcHV0ZWQuY2xhc3Nlcy5jYWxsKHRoaXMpLFxuICAgICAgICAndi1pbnB1dF9fc2xpZGVyJzogdHJ1ZSxcbiAgICAgICAgJ3YtaW5wdXRfX3NsaWRlci0tdmVydGljYWwnOiB0aGlzLnZlcnRpY2FsLFxuICAgICAgICAndi1pbnB1dF9fc2xpZGVyLS1pbnZlcnNlLWxhYmVsJzogdGhpcy5pbnZlcnNlTGFiZWwsXG4gICAgICB9XG4gICAgfSxcbiAgICBpbnRlcm5hbFZhbHVlOiB7XG4gICAgICBnZXQgKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmxhenlWYWx1ZVxuICAgICAgfSxcbiAgICAgIHNldCAodmFsOiBudW1iZXIpIHtcbiAgICAgICAgdmFsID0gaXNOYU4odmFsKSA/IHRoaXMubWluVmFsdWUgOiB2YWxcbiAgICAgICAgLy8gUm91bmQgdmFsdWUgdG8gZW5zdXJlIHRoZVxuICAgICAgICAvLyBlbnRpcmUgc2xpZGVyIHJhbmdlIGNhblxuICAgICAgICAvLyBiZSBzZWxlY3RlZCB3aXRoIHN0ZXBcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnJvdW5kVmFsdWUoTWF0aC5taW4oTWF0aC5tYXgodmFsLCB0aGlzLm1pblZhbHVlKSwgdGhpcy5tYXhWYWx1ZSkpXG5cbiAgICAgICAgaWYgKHZhbHVlID09PSB0aGlzLmxhenlWYWx1ZSkgcmV0dXJuXG5cbiAgICAgICAgdGhpcy5sYXp5VmFsdWUgPSB2YWx1ZVxuXG4gICAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgdmFsdWUpXG4gICAgICB9LFxuICAgIH0sXG4gICAgdHJhY2tUcmFuc2l0aW9uICgpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuIHRoaXMua2V5UHJlc3NlZCA+PSAyID8gJ25vbmUnIDogJydcbiAgICB9LFxuICAgIG1pblZhbHVlICgpOiBudW1iZXIge1xuICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodGhpcy5taW4pXG4gICAgfSxcbiAgICBtYXhWYWx1ZSAoKTogbnVtYmVyIHtcbiAgICAgIHJldHVybiBwYXJzZUZsb2F0KHRoaXMubWF4KVxuICAgIH0sXG4gICAgc3RlcE51bWVyaWMgKCk6IG51bWJlciB7XG4gICAgICByZXR1cm4gdGhpcy5zdGVwID4gMCA/IHBhcnNlRmxvYXQodGhpcy5zdGVwKSA6IDBcbiAgICB9LFxuICAgIGlucHV0V2lkdGggKCk6IG51bWJlciB7XG4gICAgICBjb25zdCB2YWx1ZSA9ICh0aGlzLnJvdW5kVmFsdWUodGhpcy5pbnRlcm5hbFZhbHVlKSAtIHRoaXMubWluVmFsdWUpIC8gKHRoaXMubWF4VmFsdWUgLSB0aGlzLm1pblZhbHVlKSAqIDEwMFxuXG4gICAgICByZXR1cm4gdmFsdWVcbiAgICB9LFxuICAgIHRyYWNrRmlsbFN0eWxlcyAoKTogUGFydGlhbDxDU1NTdHlsZURlY2xhcmF0aW9uPiB7XG4gICAgICBjb25zdCBzdGFydERpciA9IHRoaXMudmVydGljYWwgPyAnYm90dG9tJyA6ICdsZWZ0J1xuICAgICAgY29uc3QgZW5kRGlyID0gdGhpcy52ZXJ0aWNhbCA/ICd0b3AnIDogJ3JpZ2h0J1xuICAgICAgY29uc3QgdmFsdWVEaXIgPSB0aGlzLnZlcnRpY2FsID8gJ2hlaWdodCcgOiAnd2lkdGgnXG5cbiAgICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy4kdnVldGlmeS5ydGwgPyAnYXV0bycgOiAnMCdcbiAgICAgIGNvbnN0IGVuZCA9IHRoaXMuJHZ1ZXRpZnkucnRsID8gJzAnIDogJ2F1dG8nXG4gICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuaXNEaXNhYmxlZCA/IGBjYWxjKCR7dGhpcy5pbnB1dFdpZHRofSUgLSAxMHB4KWAgOiBgJHt0aGlzLmlucHV0V2lkdGh9JWBcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHJhbnNpdGlvbjogdGhpcy50cmFja1RyYW5zaXRpb24sXG4gICAgICAgIFtzdGFydERpcl06IHN0YXJ0LFxuICAgICAgICBbZW5kRGlyXTogZW5kLFxuICAgICAgICBbdmFsdWVEaXJdOiB2YWx1ZSxcbiAgICAgIH1cbiAgICB9LFxuICAgIHRyYWNrU3R5bGVzICgpOiBQYXJ0aWFsPENTU1N0eWxlRGVjbGFyYXRpb24+IHtcbiAgICAgIGNvbnN0IHN0YXJ0RGlyID0gdGhpcy52ZXJ0aWNhbCA/IHRoaXMuJHZ1ZXRpZnkucnRsID8gJ2JvdHRvbScgOiAndG9wJyA6IHRoaXMuJHZ1ZXRpZnkucnRsID8gJ2xlZnQnIDogJ3JpZ2h0J1xuICAgICAgY29uc3QgZW5kRGlyID0gdGhpcy52ZXJ0aWNhbCA/ICdoZWlnaHQnIDogJ3dpZHRoJ1xuXG4gICAgICBjb25zdCBzdGFydCA9ICcwcHgnXG4gICAgICBjb25zdCBlbmQgPSB0aGlzLmlzRGlzYWJsZWQgPyBgY2FsYygkezEwMCAtIHRoaXMuaW5wdXRXaWR0aH0lIC0gMTBweClgIDogYGNhbGMoJHsxMDAgLSB0aGlzLmlucHV0V2lkdGh9JSlgXG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRyYW5zaXRpb246IHRoaXMudHJhY2tUcmFuc2l0aW9uLFxuICAgICAgICBbc3RhcnREaXJdOiBzdGFydCxcbiAgICAgICAgW2VuZERpcl06IGVuZCxcbiAgICAgIH1cbiAgICB9LFxuICAgIHNob3dUaWNrcyAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy50aWNrTGFiZWxzLmxlbmd0aCA+IDAgfHxcbiAgICAgICAgISEoIXRoaXMuaXNEaXNhYmxlZCAmJiB0aGlzLnN0ZXBOdW1lcmljICYmIHRoaXMudGlja3MpXG4gICAgfSxcbiAgICBudW1UaWNrcyAoKTogbnVtYmVyIHtcbiAgICAgIHJldHVybiBNYXRoLmNlaWwoKHRoaXMubWF4VmFsdWUgLSB0aGlzLm1pblZhbHVlKSAvIHRoaXMuc3RlcE51bWVyaWMpXG4gICAgfSxcbiAgICBzaG93VGh1bWJMYWJlbCAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gIXRoaXMuaXNEaXNhYmxlZCAmJiAhIShcbiAgICAgICAgdGhpcy50aHVtYkxhYmVsIHx8XG4gICAgICAgIHRoaXMuJHNjb3BlZFNsb3RzWyd0aHVtYi1sYWJlbCddXG4gICAgICApXG4gICAgfSxcbiAgICBjb21wdXRlZFRyYWNrQ29sb3IgKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICBpZiAodGhpcy5pc0Rpc2FibGVkKSByZXR1cm4gdW5kZWZpbmVkXG4gICAgICBpZiAodGhpcy50cmFja0NvbG9yKSByZXR1cm4gdGhpcy50cmFja0NvbG9yXG4gICAgICBpZiAodGhpcy5pc0RhcmspIHJldHVybiB0aGlzLnZhbGlkYXRpb25TdGF0ZVxuICAgICAgcmV0dXJuIHRoaXMudmFsaWRhdGlvblN0YXRlIHx8ICdwcmltYXJ5IGxpZ2h0ZW4tMydcbiAgICB9LFxuICAgIGNvbXB1dGVkVHJhY2tGaWxsQ29sb3IgKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICBpZiAodGhpcy5pc0Rpc2FibGVkKSByZXR1cm4gdW5kZWZpbmVkXG4gICAgICBpZiAodGhpcy50cmFja0ZpbGxDb2xvcikgcmV0dXJuIHRoaXMudHJhY2tGaWxsQ29sb3JcbiAgICAgIHJldHVybiB0aGlzLnZhbGlkYXRpb25TdGF0ZSB8fCB0aGlzLmNvbXB1dGVkQ29sb3JcbiAgICB9LFxuICAgIGNvbXB1dGVkVGh1bWJDb2xvciAoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgIGlmICh0aGlzLnRodW1iQ29sb3IpIHJldHVybiB0aGlzLnRodW1iQ29sb3JcbiAgICAgIHJldHVybiB0aGlzLnZhbGlkYXRpb25TdGF0ZSB8fCB0aGlzLmNvbXB1dGVkQ29sb3JcbiAgICB9LFxuICB9LFxuXG4gIHdhdGNoOiB7XG4gICAgbWluICh2YWwpIHtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlRmxvYXQodmFsKVxuICAgICAgcGFyc2VkID4gdGhpcy5pbnRlcm5hbFZhbHVlICYmIHRoaXMuJGVtaXQoJ2lucHV0JywgcGFyc2VkKVxuICAgIH0sXG4gICAgbWF4ICh2YWwpIHtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlRmxvYXQodmFsKVxuICAgICAgcGFyc2VkIDwgdGhpcy5pbnRlcm5hbFZhbHVlICYmIHRoaXMuJGVtaXQoJ2lucHV0JywgcGFyc2VkKVxuICAgIH0sXG4gICAgdmFsdWU6IHtcbiAgICAgIGhhbmRsZXIgKHY6IG51bWJlcikge1xuICAgICAgICB0aGlzLmludGVybmFsVmFsdWUgPSB2XG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG5cbiAgLy8gSWYgZG9uZSBpbiBhcyBpbW1lZGlhdGUgaW5cbiAgLy8gdmFsdWUgd2F0Y2hlciwgY2F1c2VzIGlzc3Vlc1xuICAvLyB3aXRoIHZ1ZS10ZXN0LXV0aWxzXG4gIGJlZm9yZU1vdW50ICgpIHtcbiAgICB0aGlzLmludGVybmFsVmFsdWUgPSB0aGlzLnZhbHVlXG4gIH0sXG5cbiAgbW91bnRlZCAoKSB7XG4gICAgLy8gV2l0aG91dCBhIHYtYXBwLCBpT1MgZG9lcyBub3Qgd29yayB3aXRoIGJvZHkgc2VsZWN0b3JzXG4gICAgdGhpcy5hcHAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1hcHBdJykgfHxcbiAgICAgIGNvbnNvbGVXYXJuKCdNaXNzaW5nIHYtYXBwIG9yIGEgbm9uLWJvZHkgd3JhcHBpbmcgZWxlbWVudCB3aXRoIHRoZSBbZGF0YS1hcHBdIGF0dHJpYnV0ZScsIHRoaXMpXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGdlbkRlZmF1bHRTbG90ICgpOiBWTm9kZUNoaWxkcmVuQXJyYXlDb250ZW50cyB7XG4gICAgICBjb25zdCBjaGlsZHJlbjogVk5vZGVDaGlsZHJlbkFycmF5Q29udGVudHMgPSBbdGhpcy5nZW5MYWJlbCgpXVxuICAgICAgY29uc3Qgc2xpZGVyID0gdGhpcy5nZW5TbGlkZXIoKVxuICAgICAgdGhpcy5pbnZlcnNlTGFiZWxcbiAgICAgICAgPyBjaGlsZHJlbi51bnNoaWZ0KHNsaWRlcilcbiAgICAgICAgOiBjaGlsZHJlbi5wdXNoKHNsaWRlcilcblxuICAgICAgY2hpbGRyZW4ucHVzaCh0aGlzLmdlblByb2dyZXNzKCkpXG5cbiAgICAgIHJldHVybiBjaGlsZHJlblxuICAgIH0sXG4gICAgZ2VuU2xpZGVyICgpOiBWTm9kZSB7XG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICBjbGFzczoge1xuICAgICAgICAgICd2LXNsaWRlcic6IHRydWUsXG4gICAgICAgICAgJ3Ytc2xpZGVyLS1ob3Jpem9udGFsJzogIXRoaXMudmVydGljYWwsXG4gICAgICAgICAgJ3Ytc2xpZGVyLS12ZXJ0aWNhbCc6IHRoaXMudmVydGljYWwsXG4gICAgICAgICAgJ3Ytc2xpZGVyLS1mb2N1c2VkJzogdGhpcy5pc0ZvY3VzZWQsXG4gICAgICAgICAgJ3Ytc2xpZGVyLS1hY3RpdmUnOiB0aGlzLmlzQWN0aXZlLFxuICAgICAgICAgICd2LXNsaWRlci0tZGlzYWJsZWQnOiB0aGlzLmlzRGlzYWJsZWQsXG4gICAgICAgICAgJ3Ytc2xpZGVyLS1yZWFkb25seSc6IHRoaXMuaXNSZWFkb25seSxcbiAgICAgICAgICAuLi50aGlzLnRoZW1lQ2xhc3NlcyxcbiAgICAgICAgfSxcbiAgICAgICAgZGlyZWN0aXZlczogW3tcbiAgICAgICAgICBuYW1lOiAnY2xpY2stb3V0c2lkZScsXG4gICAgICAgICAgdmFsdWU6IHRoaXMub25CbHVyLFxuICAgICAgICB9XSxcbiAgICAgICAgb246IHtcbiAgICAgICAgICBjbGljazogdGhpcy5vblNsaWRlckNsaWNrLFxuICAgICAgICB9LFxuICAgICAgfSwgdGhpcy5nZW5DaGlsZHJlbigpKVxuICAgIH0sXG4gICAgZ2VuQ2hpbGRyZW4gKCk6IFZOb2RlQ2hpbGRyZW5BcnJheUNvbnRlbnRzIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIHRoaXMuZ2VuSW5wdXQoKSxcbiAgICAgICAgdGhpcy5nZW5UcmFja0NvbnRhaW5lcigpLFxuICAgICAgICB0aGlzLmdlblN0ZXBzKCksXG4gICAgICAgIHRoaXMuZ2VuVGh1bWJDb250YWluZXIoXG4gICAgICAgICAgdGhpcy5pbnRlcm5hbFZhbHVlLFxuICAgICAgICAgIHRoaXMuaW5wdXRXaWR0aCxcbiAgICAgICAgICB0aGlzLmlzQWN0aXZlLFxuICAgICAgICAgIHRoaXMuaXNGb2N1c2VkLFxuICAgICAgICAgIHRoaXMub25UaHVtYk1vdXNlRG93bixcbiAgICAgICAgICB0aGlzLm9uRm9jdXMsXG4gICAgICAgICAgdGhpcy5vbkJsdXIsXG4gICAgICAgICksXG4gICAgICBdXG4gICAgfSxcbiAgICBnZW5JbnB1dCAoKTogVk5vZGUge1xuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2lucHV0Jywge1xuICAgICAgICBhdHRyczoge1xuICAgICAgICAgIHZhbHVlOiB0aGlzLmludGVybmFsVmFsdWUsXG4gICAgICAgICAgaWQ6IHRoaXMuY29tcHV0ZWRJZCxcbiAgICAgICAgICBkaXNhYmxlZDogdGhpcy5pc0Rpc2FibGVkLFxuICAgICAgICAgIHJlYWRvbmx5OiB0cnVlLFxuICAgICAgICAgIHRhYmluZGV4OiAtMSxcbiAgICAgICAgICAuLi50aGlzLiRhdHRycyxcbiAgICAgICAgfSxcbiAgICAgICAgLy8gb246IHRoaXMuZ2VuTGlzdGVuZXJzKCksIC8vIFRPRE86IGRvIHdlIG5lZWQgdG8gYXR0YWNoIHRoZSBsaXN0ZW5lcnMgdG8gaW5wdXQ/XG4gICAgICB9KVxuICAgIH0sXG4gICAgZ2VuVHJhY2tDb250YWluZXIgKCk6IFZOb2RlIHtcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gW1xuICAgICAgICB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB0aGlzLnNldEJhY2tncm91bmRDb2xvcih0aGlzLmNvbXB1dGVkVHJhY2tDb2xvciwge1xuICAgICAgICAgIHN0YXRpY0NsYXNzOiAndi1zbGlkZXJfX3RyYWNrLWJhY2tncm91bmQnLFxuICAgICAgICAgIHN0eWxlOiB0aGlzLnRyYWNrU3R5bGVzLFxuICAgICAgICB9KSksXG4gICAgICAgIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHRoaXMuc2V0QmFja2dyb3VuZENvbG9yKHRoaXMuY29tcHV0ZWRUcmFja0ZpbGxDb2xvciwge1xuICAgICAgICAgIHN0YXRpY0NsYXNzOiAndi1zbGlkZXJfX3RyYWNrLWZpbGwnLFxuICAgICAgICAgIHN0eWxlOiB0aGlzLnRyYWNrRmlsbFN0eWxlcyxcbiAgICAgICAgfSkpLFxuICAgICAgXVxuXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3Ytc2xpZGVyX190cmFjay1jb250YWluZXInLFxuICAgICAgICByZWY6ICd0cmFjaycsXG4gICAgICB9LCBjaGlsZHJlbilcbiAgICB9LFxuICAgIGdlblN0ZXBzICgpOiBWTm9kZSB8IG51bGwge1xuICAgICAgaWYgKCF0aGlzLnN0ZXAgfHwgIXRoaXMuc2hvd1RpY2tzKSByZXR1cm4gbnVsbFxuXG4gICAgICBjb25zdCB0aWNrU2l6ZSA9IHBhcnNlRmxvYXQodGhpcy50aWNrU2l6ZSlcbiAgICAgIGNvbnN0IHJhbmdlID0gY3JlYXRlUmFuZ2UodGhpcy5udW1UaWNrcyArIDEpXG4gICAgICBjb25zdCBkaXJlY3Rpb24gPSB0aGlzLnZlcnRpY2FsID8gJ2JvdHRvbScgOiAodGhpcy4kdnVldGlmeS5ydGwgPyAncmlnaHQnIDogJ2xlZnQnKVxuICAgICAgY29uc3Qgb2Zmc2V0RGlyZWN0aW9uID0gdGhpcy52ZXJ0aWNhbCA/ICh0aGlzLiR2dWV0aWZ5LnJ0bCA/ICdsZWZ0JyA6ICdyaWdodCcpIDogJ3RvcCdcblxuICAgICAgaWYgKHRoaXMudmVydGljYWwpIHJhbmdlLnJldmVyc2UoKVxuXG4gICAgICBjb25zdCB0aWNrcyA9IHJhbmdlLm1hcChpbmRleCA9PiB7XG4gICAgICAgIGNvbnN0IGNoaWxkcmVuID0gW11cblxuICAgICAgICBpZiAodGhpcy50aWNrTGFiZWxzW2luZGV4XSkge1xuICAgICAgICAgIGNoaWxkcmVuLnB1c2godGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICAgICAgc3RhdGljQ2xhc3M6ICd2LXNsaWRlcl9fdGljay1sYWJlbCcsXG4gICAgICAgICAgfSwgdGhpcy50aWNrTGFiZWxzW2luZGV4XSkpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB3aWR0aCA9IGluZGV4ICogKDEwMCAvIHRoaXMubnVtVGlja3MpXG4gICAgICAgIGNvbnN0IGZpbGxlZCA9IHRoaXMuJHZ1ZXRpZnkucnRsID8gKDEwMCAtIHRoaXMuaW5wdXRXaWR0aCkgPCB3aWR0aCA6IHdpZHRoIDwgdGhpcy5pbnB1dFdpZHRoXG5cbiAgICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7XG4gICAgICAgICAga2V5OiBpbmRleCxcbiAgICAgICAgICBzdGF0aWNDbGFzczogJ3Ytc2xpZGVyX190aWNrJyxcbiAgICAgICAgICBjbGFzczoge1xuICAgICAgICAgICAgJ3Ytc2xpZGVyX190aWNrLS1maWxsZWQnOiBmaWxsZWQsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgd2lkdGg6IGAke3RpY2tTaXplfXB4YCxcbiAgICAgICAgICAgIGhlaWdodDogYCR7dGlja1NpemV9cHhgLFxuICAgICAgICAgICAgW2RpcmVjdGlvbl06IGBjYWxjKCR7d2lkdGh9JSAtICR7dGlja1NpemUgLyAyfXB4KWAsXG4gICAgICAgICAgICBbb2Zmc2V0RGlyZWN0aW9uXTogYGNhbGMoNTAlIC0gJHt0aWNrU2l6ZSAvIDJ9cHgpYCxcbiAgICAgICAgICB9LFxuICAgICAgICB9LCBjaGlsZHJlbilcbiAgICAgIH0pXG5cbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1zbGlkZXJfX3RpY2tzLWNvbnRhaW5lcicsXG4gICAgICAgIGNsYXNzOiB7XG4gICAgICAgICAgJ3Ytc2xpZGVyX190aWNrcy1jb250YWluZXItLWFsd2F5cy1zaG93JzogdGhpcy50aWNrcyA9PT0gJ2Fsd2F5cycgfHwgdGhpcy50aWNrTGFiZWxzLmxlbmd0aCA+IDAsXG4gICAgICAgIH0sXG4gICAgICB9LCB0aWNrcylcbiAgICB9LFxuICAgIGdlblRodW1iQ29udGFpbmVyIChcbiAgICAgIHZhbHVlOiBudW1iZXIsXG4gICAgICB2YWx1ZVdpZHRoOiBudW1iZXIsXG4gICAgICBpc0FjdGl2ZTogYm9vbGVhbixcbiAgICAgIGlzRm9jdXNlZDogYm9vbGVhbixcbiAgICAgIG9uRHJhZzogRnVuY3Rpb24sXG4gICAgICBvbkZvY3VzOiBGdW5jdGlvbixcbiAgICAgIG9uQmx1cjogRnVuY3Rpb24sXG4gICAgICByZWYgPSAndGh1bWInXG4gICAgKTogVk5vZGUge1xuICAgICAgY29uc3QgY2hpbGRyZW4gPSBbdGhpcy5nZW5UaHVtYigpXVxuXG4gICAgICBjb25zdCB0aHVtYkxhYmVsQ29udGVudCA9IHRoaXMuZ2VuVGh1bWJMYWJlbENvbnRlbnQodmFsdWUpXG4gICAgICB0aGlzLnNob3dUaHVtYkxhYmVsICYmIGNoaWxkcmVuLnB1c2godGhpcy5nZW5UaHVtYkxhYmVsKHRodW1iTGFiZWxDb250ZW50KSlcblxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHRoaXMuc2V0VGV4dENvbG9yKHRoaXMuY29tcHV0ZWRUaHVtYkNvbG9yLCB7XG4gICAgICAgIHJlZixcbiAgICAgICAga2V5OiByZWYsXG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1zbGlkZXJfX3RodW1iLWNvbnRhaW5lcicsXG4gICAgICAgIGNsYXNzOiB7XG4gICAgICAgICAgJ3Ytc2xpZGVyX190aHVtYi1jb250YWluZXItLWFjdGl2ZSc6IGlzQWN0aXZlLFxuICAgICAgICAgICd2LXNsaWRlcl9fdGh1bWItY29udGFpbmVyLS1mb2N1c2VkJzogaXNGb2N1c2VkLFxuICAgICAgICAgICd2LXNsaWRlcl9fdGh1bWItY29udGFpbmVyLS1zaG93LWxhYmVsJzogdGhpcy5zaG93VGh1bWJMYWJlbCxcbiAgICAgICAgfSxcbiAgICAgICAgc3R5bGU6IHRoaXMuZ2V0VGh1bWJDb250YWluZXJTdHlsZXModmFsdWVXaWR0aCksXG4gICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgcm9sZTogJ3NsaWRlcicsXG4gICAgICAgICAgdGFiaW5kZXg6IHRoaXMuaXNEaXNhYmxlZCA/IC0xIDogdGhpcy4kYXR0cnMudGFiaW5kZXggPyB0aGlzLiRhdHRycy50YWJpbmRleCA6IDAsXG4gICAgICAgICAgJ2FyaWEtbGFiZWwnOiB0aGlzLmxhYmVsLFxuICAgICAgICAgICdhcmlhLXZhbHVlbWluJzogdGhpcy5taW4sXG4gICAgICAgICAgJ2FyaWEtdmFsdWVtYXgnOiB0aGlzLm1heCxcbiAgICAgICAgICAnYXJpYS12YWx1ZW5vdyc6IHRoaXMuaW50ZXJuYWxWYWx1ZSxcbiAgICAgICAgICAnYXJpYS1yZWFkb25seSc6IFN0cmluZyh0aGlzLmlzUmVhZG9ubHkpLFxuICAgICAgICAgICdhcmlhLW9yaWVudGF0aW9uJzogdGhpcy52ZXJ0aWNhbCA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCcsXG4gICAgICAgICAgLi4udGhpcy4kYXR0cnMsXG4gICAgICAgIH0sXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgZm9jdXM6IG9uRm9jdXMsXG4gICAgICAgICAgYmx1cjogb25CbHVyLFxuICAgICAgICAgIGtleWRvd246IHRoaXMub25LZXlEb3duLFxuICAgICAgICAgIGtleXVwOiB0aGlzLm9uS2V5VXAsXG4gICAgICAgICAgdG91Y2hzdGFydDogb25EcmFnLFxuICAgICAgICAgIG1vdXNlZG93bjogb25EcmFnLFxuICAgICAgICB9LFxuICAgICAgfSksIGNoaWxkcmVuKVxuICAgIH0sXG4gICAgZ2VuVGh1bWJMYWJlbENvbnRlbnQgKHZhbHVlOiBudW1iZXIgfCBzdHJpbmcpOiBTY29wZWRTbG90Q2hpbGRyZW4ge1xuICAgICAgcmV0dXJuIHRoaXMuJHNjb3BlZFNsb3RzWyd0aHVtYi1sYWJlbCddXG4gICAgICAgID8gdGhpcy4kc2NvcGVkU2xvdHNbJ3RodW1iLWxhYmVsJ10hKHsgdmFsdWUgfSlcbiAgICAgICAgOiBbdGhpcy4kY3JlYXRlRWxlbWVudCgnc3BhbicsIFtTdHJpbmcodmFsdWUpXSldXG4gICAgfSxcbiAgICBnZW5UaHVtYkxhYmVsIChjb250ZW50OiBTY29wZWRTbG90Q2hpbGRyZW4pOiBWTm9kZSB7XG4gICAgICBjb25zdCBzaXplID0gY29udmVydFRvVW5pdCh0aGlzLnRodW1iU2l6ZSlcblxuICAgICAgY29uc3QgdHJhbnNmb3JtID0gdGhpcy52ZXJ0aWNhbFxuICAgICAgICA/IGB0cmFuc2xhdGVZKDIwJSkgdHJhbnNsYXRlWSgkeyhOdW1iZXIodGhpcy50aHVtYlNpemUpIC8gMykgLSAxfXB4KSB0cmFuc2xhdGVYKDU1JSkgcm90YXRlKDEzNWRlZylgXG4gICAgICAgIDogYHRyYW5zbGF0ZVkoLTIwJSkgdHJhbnNsYXRlWSgtMTJweCkgdHJhbnNsYXRlWCgtNTAlKSByb3RhdGUoNDVkZWcpYFxuXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudChWU2NhbGVUcmFuc2l0aW9uLCB7XG4gICAgICAgIHByb3BzOiB7IG9yaWdpbjogJ2JvdHRvbSBjZW50ZXInIH0sXG4gICAgICB9LCBbXG4gICAgICAgIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgICAgICBzdGF0aWNDbGFzczogJ3Ytc2xpZGVyX190aHVtYi1sYWJlbC1jb250YWluZXInLFxuICAgICAgICAgIGRpcmVjdGl2ZXM6IFt7XG4gICAgICAgICAgICBuYW1lOiAnc2hvdycsXG4gICAgICAgICAgICB2YWx1ZTogdGhpcy5pc0ZvY3VzZWQgfHwgdGhpcy5pc0FjdGl2ZSB8fCB0aGlzLnRodW1iTGFiZWwgPT09ICdhbHdheXMnLFxuICAgICAgICAgIH1dLFxuICAgICAgICB9LCBbXG4gICAgICAgICAgdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2JywgdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IodGhpcy5jb21wdXRlZFRodW1iQ29sb3IsIHtcbiAgICAgICAgICAgIHN0YXRpY0NsYXNzOiAndi1zbGlkZXJfX3RodW1iLWxhYmVsJyxcbiAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgIGhlaWdodDogc2l6ZSxcbiAgICAgICAgICAgICAgd2lkdGg6IHNpemUsXG4gICAgICAgICAgICAgIHRyYW5zZm9ybSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSksIFt0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCBjb250ZW50KV0pLFxuICAgICAgICBdKSxcbiAgICAgIF0pXG4gICAgfSxcbiAgICBnZW5UaHVtYiAoKTogVk5vZGUge1xuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHRoaXMuc2V0QmFja2dyb3VuZENvbG9yKHRoaXMuY29tcHV0ZWRUaHVtYkNvbG9yLCB7XG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1zbGlkZXJfX3RodW1iJyxcbiAgICAgIH0pKVxuICAgIH0sXG4gICAgZ2V0VGh1bWJDb250YWluZXJTdHlsZXMgKHdpZHRoOiBudW1iZXIpOiBvYmplY3Qge1xuICAgICAgY29uc3QgZGlyZWN0aW9uID0gdGhpcy52ZXJ0aWNhbCA/ICd0b3AnIDogJ2xlZnQnXG4gICAgICBsZXQgdmFsdWUgPSB0aGlzLiR2dWV0aWZ5LnJ0bCA/IDEwMCAtIHdpZHRoIDogd2lkdGhcbiAgICAgIHZhbHVlID0gdGhpcy52ZXJ0aWNhbCA/IDEwMCAtIHZhbHVlIDogdmFsdWVcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHJhbnNpdGlvbjogdGhpcy50cmFja1RyYW5zaXRpb24sXG4gICAgICAgIFtkaXJlY3Rpb25dOiBgJHt2YWx1ZX0lYCxcbiAgICAgIH1cbiAgICB9LFxuICAgIG9uVGh1bWJNb3VzZURvd24gKGU6IE1vdXNlRXZlbnQpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgICB0aGlzLm9sZFZhbHVlID0gdGhpcy5pbnRlcm5hbFZhbHVlXG4gICAgICB0aGlzLmtleVByZXNzZWQgPSAyXG4gICAgICB0aGlzLmlzQWN0aXZlID0gdHJ1ZVxuXG4gICAgICBjb25zdCBtb3VzZVVwT3B0aW9ucyA9IHBhc3NpdmVTdXBwb3J0ZWQgPyB7IHBhc3NpdmU6IHRydWUsIGNhcHR1cmU6IHRydWUgfSA6IHRydWVcbiAgICAgIGNvbnN0IG1vdXNlTW92ZU9wdGlvbnMgPSBwYXNzaXZlU3VwcG9ydGVkID8geyBwYXNzaXZlOiB0cnVlIH0gOiBmYWxzZVxuICAgICAgaWYgKCd0b3VjaGVzJyBpbiBlKSB7XG4gICAgICAgIHRoaXMuYXBwLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMub25Nb3VzZU1vdmUsIG1vdXNlTW92ZU9wdGlvbnMpXG4gICAgICAgIGFkZE9uY2VFdmVudExpc3RlbmVyKHRoaXMuYXBwLCAndG91Y2hlbmQnLCB0aGlzLm9uU2xpZGVyTW91c2VVcCwgbW91c2VVcE9wdGlvbnMpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmFwcC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm9uTW91c2VNb3ZlLCBtb3VzZU1vdmVPcHRpb25zKVxuICAgICAgICBhZGRPbmNlRXZlbnRMaXN0ZW5lcih0aGlzLmFwcCwgJ21vdXNldXAnLCB0aGlzLm9uU2xpZGVyTW91c2VVcCwgbW91c2VVcE9wdGlvbnMpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuJGVtaXQoJ3N0YXJ0JywgdGhpcy5pbnRlcm5hbFZhbHVlKVxuICAgIH0sXG4gICAgb25TbGlkZXJNb3VzZVVwIChlOiBFdmVudCkge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgdGhpcy5rZXlQcmVzc2VkID0gMFxuICAgICAgY29uc3QgbW91c2VNb3ZlT3B0aW9ucyA9IHBhc3NpdmVTdXBwb3J0ZWQgPyB7IHBhc3NpdmU6IHRydWUgfSA6IGZhbHNlXG4gICAgICB0aGlzLmFwcC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLm9uTW91c2VNb3ZlLCBtb3VzZU1vdmVPcHRpb25zKVxuICAgICAgdGhpcy5hcHAucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5vbk1vdXNlTW92ZSwgbW91c2VNb3ZlT3B0aW9ucylcblxuICAgICAgdGhpcy4kZW1pdCgnbW91c2V1cCcsIGUpXG4gICAgICB0aGlzLiRlbWl0KCdlbmQnLCB0aGlzLmludGVybmFsVmFsdWUpXG4gICAgICBpZiAoIWRlZXBFcXVhbCh0aGlzLm9sZFZhbHVlLCB0aGlzLmludGVybmFsVmFsdWUpKSB7XG4gICAgICAgIHRoaXMuJGVtaXQoJ2NoYW5nZScsIHRoaXMuaW50ZXJuYWxWYWx1ZSlcbiAgICAgICAgdGhpcy5ub0NsaWNrID0gdHJ1ZVxuICAgICAgfVxuXG4gICAgICB0aGlzLmlzQWN0aXZlID0gZmFsc2VcbiAgICB9LFxuICAgIG9uTW91c2VNb3ZlIChlOiBNb3VzZUV2ZW50KSB7XG4gICAgICBjb25zdCB7IHZhbHVlIH0gPSB0aGlzLnBhcnNlTW91c2VNb3ZlKGUpXG4gICAgICB0aGlzLmludGVybmFsVmFsdWUgPSB2YWx1ZVxuICAgIH0sXG4gICAgb25LZXlEb3duIChlOiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICBpZiAoIXRoaXMuaXNJbnRlcmFjdGl2ZSkgcmV0dXJuXG5cbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5wYXJzZUtleURvd24oZSwgdGhpcy5pbnRlcm5hbFZhbHVlKVxuXG4gICAgICBpZiAoXG4gICAgICAgIHZhbHVlID09IG51bGwgfHxcbiAgICAgICAgdmFsdWUgPCB0aGlzLm1pblZhbHVlIHx8XG4gICAgICAgIHZhbHVlID4gdGhpcy5tYXhWYWx1ZVxuICAgICAgKSByZXR1cm5cblxuICAgICAgdGhpcy5pbnRlcm5hbFZhbHVlID0gdmFsdWVcbiAgICAgIHRoaXMuJGVtaXQoJ2NoYW5nZScsIHZhbHVlKVxuICAgIH0sXG4gICAgb25LZXlVcCAoKSB7XG4gICAgICB0aGlzLmtleVByZXNzZWQgPSAwXG4gICAgfSxcbiAgICBvblNsaWRlckNsaWNrIChlOiBNb3VzZUV2ZW50KSB7XG4gICAgICBpZiAodGhpcy5ub0NsaWNrKSB7XG4gICAgICAgIHRoaXMubm9DbGljayA9IGZhbHNlXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgY29uc3QgdGh1bWIgPSB0aGlzLiRyZWZzLnRodW1iIGFzIEhUTUxFbGVtZW50XG4gICAgICB0aHVtYi5mb2N1cygpXG5cbiAgICAgIHRoaXMub25Nb3VzZU1vdmUoZSlcbiAgICAgIHRoaXMuJGVtaXQoJ2NoYW5nZScsIHRoaXMuaW50ZXJuYWxWYWx1ZSlcbiAgICB9LFxuICAgIG9uQmx1ciAoZTogRXZlbnQpIHtcbiAgICAgIHRoaXMuaXNGb2N1c2VkID0gZmFsc2VcblxuICAgICAgdGhpcy4kZW1pdCgnYmx1cicsIGUpXG4gICAgfSxcbiAgICBvbkZvY3VzIChlOiBFdmVudCkge1xuICAgICAgdGhpcy5pc0ZvY3VzZWQgPSB0cnVlXG5cbiAgICAgIHRoaXMuJGVtaXQoJ2ZvY3VzJywgZSlcbiAgICB9LFxuICAgIHBhcnNlTW91c2VNb3ZlIChlOiBNb3VzZUV2ZW50KSB7XG4gICAgICBjb25zdCBzdGFydCA9IHRoaXMudmVydGljYWwgPyAndG9wJyA6ICdsZWZ0J1xuICAgICAgY29uc3QgbGVuZ3RoID0gdGhpcy52ZXJ0aWNhbCA/ICdoZWlnaHQnIDogJ3dpZHRoJ1xuICAgICAgY29uc3QgY2xpY2sgPSB0aGlzLnZlcnRpY2FsID8gJ2NsaWVudFknIDogJ2NsaWVudFgnXG5cbiAgICAgIGNvbnN0IHtcbiAgICAgICAgW3N0YXJ0XTogdHJhY2tTdGFydCxcbiAgICAgICAgW2xlbmd0aF06IHRyYWNrTGVuZ3RoLFxuICAgICAgfSA9IHRoaXMuJHJlZnMudHJhY2suZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkgYXMgYW55XG4gICAgICBjb25zdCBjbGlja09mZnNldCA9ICd0b3VjaGVzJyBpbiBlID8gKGUgYXMgYW55KS50b3VjaGVzWzBdW2NsaWNrXSA6IGVbY2xpY2tdIC8vIENhbiB3ZSBnZXQgcmlkIG9mIGFueSBoZXJlP1xuXG4gICAgICAvLyBJdCBpcyBwb3NzaWJsZSBmb3IgbGVmdCB0byBiZSBOYU4sIGZvcmNlIHRvIG51bWJlclxuICAgICAgbGV0IGNsaWNrUG9zID0gTWF0aC5taW4oTWF0aC5tYXgoKGNsaWNrT2Zmc2V0IC0gdHJhY2tTdGFydCkgLyB0cmFja0xlbmd0aCwgMCksIDEpIHx8IDBcblxuICAgICAgaWYgKHRoaXMudmVydGljYWwpIGNsaWNrUG9zID0gMSAtIGNsaWNrUG9zXG4gICAgICBpZiAodGhpcy4kdnVldGlmeS5ydGwpIGNsaWNrUG9zID0gMSAtIGNsaWNrUG9zXG5cbiAgICAgIGNvbnN0IGlzSW5zaWRlVHJhY2sgPSBjbGlja09mZnNldCA+PSB0cmFja1N0YXJ0ICYmIGNsaWNrT2Zmc2V0IDw9IHRyYWNrU3RhcnQgKyB0cmFja0xlbmd0aFxuICAgICAgY29uc3QgdmFsdWUgPSBwYXJzZUZsb2F0KHRoaXMubWluKSArIGNsaWNrUG9zICogKHRoaXMubWF4VmFsdWUgLSB0aGlzLm1pblZhbHVlKVxuXG4gICAgICByZXR1cm4geyB2YWx1ZSwgaXNJbnNpZGVUcmFjayB9XG4gICAgfSxcbiAgICBwYXJzZUtleURvd24gKGU6IEtleWJvYXJkRXZlbnQsIHZhbHVlOiBudW1iZXIpIHtcbiAgICAgIGlmICghdGhpcy5pc0ludGVyYWN0aXZlKSByZXR1cm5cblxuICAgICAgY29uc3QgeyBwYWdldXAsIHBhZ2Vkb3duLCBlbmQsIGhvbWUsIGxlZnQsIHJpZ2h0LCBkb3duLCB1cCB9ID0ga2V5Q29kZXNcblxuICAgICAgaWYgKCFbcGFnZXVwLCBwYWdlZG93biwgZW5kLCBob21lLCBsZWZ0LCByaWdodCwgZG93biwgdXBdLmluY2x1ZGVzKGUua2V5Q29kZSkpIHJldHVyblxuXG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIGNvbnN0IHN0ZXAgPSB0aGlzLnN0ZXBOdW1lcmljIHx8IDFcbiAgICAgIGNvbnN0IHN0ZXBzID0gKHRoaXMubWF4VmFsdWUgLSB0aGlzLm1pblZhbHVlKSAvIHN0ZXBcbiAgICAgIGlmIChbbGVmdCwgcmlnaHQsIGRvd24sIHVwXS5pbmNsdWRlcyhlLmtleUNvZGUpKSB7XG4gICAgICAgIHRoaXMua2V5UHJlc3NlZCArPSAxXG5cbiAgICAgICAgY29uc3QgaW5jcmVhc2UgPSB0aGlzLiR2dWV0aWZ5LnJ0bCA/IFtsZWZ0LCB1cF0gOiBbcmlnaHQsIHVwXVxuICAgICAgICBjb25zdCBkaXJlY3Rpb24gPSBpbmNyZWFzZS5pbmNsdWRlcyhlLmtleUNvZGUpID8gMSA6IC0xXG4gICAgICAgIGNvbnN0IG11bHRpcGxpZXIgPSBlLnNoaWZ0S2V5ID8gMyA6IChlLmN0cmxLZXkgPyAyIDogMSlcblxuICAgICAgICB2YWx1ZSA9IHZhbHVlICsgKGRpcmVjdGlvbiAqIHN0ZXAgKiBtdWx0aXBsaWVyKVxuICAgICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT09IGhvbWUpIHtcbiAgICAgICAgdmFsdWUgPSB0aGlzLm1pblZhbHVlXG4gICAgICB9IGVsc2UgaWYgKGUua2V5Q29kZSA9PT0gZW5kKSB7XG4gICAgICAgIHZhbHVlID0gdGhpcy5tYXhWYWx1ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZGlyZWN0aW9uID0gZS5rZXlDb2RlID09PSBwYWdlZG93biA/IDEgOiAtMVxuICAgICAgICB2YWx1ZSA9IHZhbHVlIC0gKGRpcmVjdGlvbiAqIHN0ZXAgKiAoc3RlcHMgPiAxMDAgPyBzdGVwcyAvIDEwIDogMTApKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdmFsdWVcbiAgICB9LFxuICAgIHJvdW5kVmFsdWUgKHZhbHVlOiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgaWYgKCF0aGlzLnN0ZXBOdW1lcmljKSByZXR1cm4gdmFsdWVcbiAgICAgIC8vIEZvcm1hdCBpbnB1dCB2YWx1ZSB1c2luZyB0aGUgc2FtZSBudW1iZXJcbiAgICAgIC8vIG9mIGRlY2ltYWxzIHBsYWNlcyBhcyBpbiB0aGUgc3RlcCBwcm9wXG4gICAgICBjb25zdCB0cmltbWVkU3RlcCA9IHRoaXMuc3RlcC50b1N0cmluZygpLnRyaW0oKVxuICAgICAgY29uc3QgZGVjaW1hbHMgPSB0cmltbWVkU3RlcC5pbmRleE9mKCcuJykgPiAtMVxuICAgICAgICA/ICh0cmltbWVkU3RlcC5sZW5ndGggLSB0cmltbWVkU3RlcC5pbmRleE9mKCcuJykgLSAxKVxuICAgICAgICA6IDBcbiAgICAgIGNvbnN0IG9mZnNldCA9IHRoaXMubWluVmFsdWUgJSB0aGlzLnN0ZXBOdW1lcmljXG5cbiAgICAgIGNvbnN0IG5ld1ZhbHVlID0gTWF0aC5yb3VuZCgodmFsdWUgLSBvZmZzZXQpIC8gdGhpcy5zdGVwTnVtZXJpYykgKiB0aGlzLnN0ZXBOdW1lcmljICsgb2Zmc2V0XG5cbiAgICAgIHJldHVybiBwYXJzZUZsb2F0KE1hdGgubWluKG5ld1ZhbHVlLCB0aGlzLm1heFZhbHVlKS50b0ZpeGVkKGRlY2ltYWxzKSlcbiAgICB9LFxuICB9LFxufSlcbiJdfQ==