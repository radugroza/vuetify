// Styles
import './VFileInput.sass';
// Extensions
import VTextField from '../VTextField';
// Components
import { VChip } from '../VChip';
// Utilities
import { deepEqual, humanReadableFileSize, wrapInArray } from '../../util/helpers';
import { consoleError } from '../../util/console';
import { mergeStyles } from '../../util/mergeData';
export default VTextField.extend({
    name: 'v-file-input',
    model: {
        prop: 'value',
        event: 'change',
    },
    props: {
        chips: Boolean,
        clearable: {
            type: Boolean,
            default: true,
        },
        counterSizeString: {
            type: String,
            default: '$vuetify.fileInput.counterSize',
        },
        counterString: {
            type: String,
            default: '$vuetify.fileInput.counter',
        },
        hideInput: Boolean,
        placeholder: String,
        prependIcon: {
            type: String,
            default: '$file',
        },
        readonly: {
            type: Boolean,
            default: false,
        },
        showSize: {
            type: [Boolean, Number],
            default: false,
            validator: (v) => {
                return (typeof v === 'boolean' ||
                    [1000, 1024].includes(v));
            },
        },
        smallChips: Boolean,
        truncateLength: {
            type: [Number, String],
            default: 22,
        },
        type: {
            type: String,
            default: 'file',
        },
        value: {
            default: undefined,
            validator: val => {
                return wrapInArray(val).every(v => v != null && typeof v === 'object');
            },
        },
    },
    computed: {
        classes() {
            return {
                ...VTextField.options.computed.classes.call(this),
                'v-file-input': true,
            };
        },
        computedCounterValue() {
            const fileCount = (this.isMultiple && this.lazyValue)
                ? this.lazyValue.length
                : (this.lazyValue instanceof File) ? 1 : 0;
            if (!this.showSize)
                return this.$vuetify.lang.t(this.counterString, fileCount);
            const bytes = this.internalArrayValue.reduce((bytes, { size = 0 }) => {
                return bytes + size;
            }, 0);
            return this.$vuetify.lang.t(this.counterSizeString, fileCount, humanReadableFileSize(bytes, this.base === 1024));
        },
        internalArrayValue() {
            return wrapInArray(this.internalValue);
        },
        internalValue: {
            get() {
                return this.lazyValue;
            },
            set(val) {
                this.lazyValue = val;
                this.$emit('change', this.lazyValue);
            },
        },
        isDirty() {
            return this.internalArrayValue.length > 0;
        },
        isLabelActive() {
            return this.isDirty;
        },
        isMultiple() {
            return this.$attrs.hasOwnProperty('multiple');
        },
        text() {
            if (!this.isDirty)
                return [this.placeholder];
            return this.internalArrayValue.map((file) => {
                const { name = '', size = 0, } = file;
                const truncatedText = this.truncateText(name);
                return !this.showSize
                    ? truncatedText
                    : `${truncatedText} (${humanReadableFileSize(size, this.base === 1024)})`;
            });
        },
        base() {
            return typeof this.showSize !== 'boolean' ? this.showSize : undefined;
        },
        hasChips() {
            return this.chips || this.smallChips;
        },
    },
    watch: {
        readonly: {
            handler(v) {
                if (v === true)
                    consoleError('readonly is not supported on <v-file-input>', this);
            },
            immediate: true,
        },
        value(v) {
            const value = this.isMultiple ? v : v ? [v] : [];
            if (!deepEqual(value, this.$refs.input.files)) {
                // When the input value is changed programatically, clear the
                // internal input's value so that the `onInput` handler
                // can be triggered again if the user re-selects the exact
                // same file(s). Ideally, `input.files` should be
                // manipulated directly but that property is readonly.
                this.$refs.input.value = '';
            }
        },
    },
    methods: {
        clearableCallback() {
            this.internalValue = this.isMultiple ? [] : undefined;
            this.$refs.input.value = '';
        },
        genChips() {
            if (!this.isDirty)
                return [];
            return this.text.map((text, index) => this.$createElement(VChip, {
                props: { small: this.smallChips },
                on: {
                    'click:close': () => {
                        const internalValue = this.internalValue;
                        internalValue.splice(index, 1);
                        this.internalValue = internalValue; // Trigger the watcher
                    },
                },
            }, [text]));
        },
        genControl() {
            const render = VTextField.options.methods.genControl.call(this);
            if (this.hideInput) {
                render.data.style = mergeStyles(render.data.style, { display: 'none' });
            }
            return render;
        },
        genInput() {
            const input = VTextField.options.methods.genInput.call(this);
            // We should not be setting value
            // programmatically on the input
            // when it is using type="file"
            delete input.data.domProps.value;
            // This solves an issue in Safari where
            // nothing happens when adding a file
            // do to the input event not firing
            // https://github.com/vuetifyjs/vuetify/issues/7941
            delete input.data.on.input;
            input.data.on.change = this.onInput;
            return [this.genSelections(), input];
        },
        genPrependSlot() {
            if (!this.prependIcon)
                return null;
            const icon = this.genIcon('prepend', () => {
                this.$refs.input.click();
            });
            return this.genSlot('prepend', 'outer', [icon]);
        },
        genSelectionText() {
            const length = this.text.length;
            if (length < 2)
                return this.text;
            if (this.showSize && !this.counter)
                return [this.computedCounterValue];
            return [this.$vuetify.lang.t(this.counterString, length)];
        },
        genSelections() {
            const children = [];
            if (this.isDirty && this.$scopedSlots.selection) {
                this.internalArrayValue.forEach((file, index) => {
                    if (!this.$scopedSlots.selection)
                        return;
                    children.push(this.$scopedSlots.selection({
                        text: this.text[index],
                        file,
                        index,
                    }));
                });
            }
            else {
                children.push(this.hasChips && this.isDirty ? this.genChips() : this.genSelectionText());
            }
            return this.$createElement('div', {
                staticClass: 'v-file-input__text',
                class: {
                    'v-file-input__text--placeholder': this.placeholder && !this.isDirty,
                    'v-file-input__text--chips': this.hasChips && !this.$scopedSlots.selection,
                },
            }, children);
        },
        genTextFieldSlot() {
            const node = VTextField.options.methods.genTextFieldSlot.call(this);
            node.data.on = {
                ...(node.data.on || {}),
                click: () => this.$refs.input.click(),
            };
            return node;
        },
        onInput(e) {
            const files = [...e.target.files || []];
            this.internalValue = this.isMultiple ? files : files[0];
            // Set initialValue here otherwise isFocused
            // watcher in VTextField will emit a change
            // event whenever the component is blurred
            this.initialValue = this.internalValue;
        },
        onKeyDown(e) {
            this.$emit('keydown', e);
        },
        truncateText(str) {
            if (str.length < Number(this.truncateLength))
                return str;
            const charsKeepOneSide = Math.floor((Number(this.truncateLength) - 1) / 2);
            return `${str.slice(0, charsKeepOneSide)}…${str.slice(str.length - charsKeepOneSide)}`;
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkZpbGVJbnB1dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZGaWxlSW5wdXQvVkZpbGVJbnB1dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxtQkFBbUIsQ0FBQTtBQUUxQixhQUFhO0FBQ2IsT0FBTyxVQUFVLE1BQU0sZUFBZSxDQUFBO0FBRXRDLGFBQWE7QUFDYixPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sVUFBVSxDQUFBO0FBS2hDLFlBQVk7QUFDWixPQUFPLEVBQUUsU0FBUyxFQUFFLHFCQUFxQixFQUFFLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQ2xGLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUNqRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sc0JBQXNCLENBQUE7QUFFbEQsZUFBZSxVQUFVLENBQUMsTUFBTSxDQUFDO0lBQy9CLElBQUksRUFBRSxjQUFjO0lBRXBCLEtBQUssRUFBRTtRQUNMLElBQUksRUFBRSxPQUFPO1FBQ2IsS0FBSyxFQUFFLFFBQVE7S0FDaEI7SUFFRCxLQUFLLEVBQUU7UUFDTCxLQUFLLEVBQUUsT0FBTztRQUNkLFNBQVMsRUFBRTtZQUNULElBQUksRUFBRSxPQUFPO1lBQ2IsT0FBTyxFQUFFLElBQUk7U0FDZDtRQUNELGlCQUFpQixFQUFFO1lBQ2pCLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLGdDQUFnQztTQUMxQztRQUNELGFBQWEsRUFBRTtZQUNiLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLDRCQUE0QjtTQUN0QztRQUNELFNBQVMsRUFBRSxPQUFPO1FBQ2xCLFdBQVcsRUFBRSxNQUFNO1FBQ25CLFdBQVcsRUFBRTtZQUNYLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLE9BQU87U0FDakI7UUFDRCxRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsT0FBTztZ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QUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBRXZELDRDQUE0QztZQUM1QywyQ0FBMkM7WUFDM0MsMENBQTBDO1lBQzFDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQTtRQUN4QyxDQUFDO1FBQ0QsU0FBUyxDQUFFLENBQWdCO1lBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQzFCLENBQUM7UUFDRCxZQUFZLENBQUUsR0FBVztZQUN2QixJQUFJLEdBQUcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7Z0JBQUUsT0FBTyxHQUFHLENBQUE7WUFDeEQsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtZQUMxRSxPQUFPLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsZ0JBQWdCLENBQUMsRUFBRSxDQUFBO1FBQ3hGLENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xuaW1wb3J0ICcuL1ZGaWxlSW5wdXQuc2FzcydcblxuLy8gRXh0ZW5zaW9uc1xuaW1wb3J0IFZUZXh0RmllbGQgZnJvbSAnLi4vVlRleHRGaWVsZCdcblxuLy8gQ29tcG9uZW50c1xuaW1wb3J0IHsgVkNoaXAgfSBmcm9tICcuLi9WQ2hpcCdcblxuLy8gVHlwZXNcbmltcG9ydCB7IFByb3BWYWxpZGF0b3IgfSBmcm9tICd2dWUvdHlwZXMvb3B0aW9ucydcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgeyBkZWVwRXF1YWwsIGh1bWFuUmVhZGFibGVGaWxlU2l6ZSwgd3JhcEluQXJyYXkgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5pbXBvcnQgeyBjb25zb2xlRXJyb3IgfSBmcm9tICcuLi8uLi91dGlsL2NvbnNvbGUnXG5pbXBvcnQgeyBtZXJnZVN0eWxlcyB9IGZyb20gJy4uLy4uL3V0aWwvbWVyZ2VEYXRhJ1xuXG5leHBvcnQgZGVmYXVsdCBWVGV4dEZpZWxkLmV4dGVuZCh7XG4gIG5hbWU6ICd2LWZpbGUtaW5wdXQnLFxuXG4gIG1vZGVsOiB7XG4gICAgcHJvcDogJ3ZhbHVlJyxcbiAgICBldmVudDogJ2NoYW5nZScsXG4gIH0sXG5cbiAgcHJvcHM6IHtcbiAgICBjaGlwczogQm9vbGVhbixcbiAgICBjbGVhcmFibGU6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiB0cnVlLFxuICAgIH0sXG4gICAgY291bnRlclNpemVTdHJpbmc6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICckdnVldGlmeS5maWxlSW5wdXQuY291bnRlclNpemUnLFxuICAgIH0sXG4gICAgY291bnRlclN0cmluZzoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJyR2dWV0aWZ5LmZpbGVJbnB1dC5jb3VudGVyJyxcbiAgICB9LFxuICAgIGhpZGVJbnB1dDogQm9vbGVhbixcbiAgICBwbGFjZWhvbGRlcjogU3RyaW5nLFxuICAgIHByZXBlbmRJY29uOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnJGZpbGUnLFxuICAgIH0sXG4gICAgcmVhZG9ubHk6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB9LFxuICAgIHNob3dTaXplOiB7XG4gICAgICB0eXBlOiBbQm9vbGVhbiwgTnVtYmVyXSxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgdmFsaWRhdG9yOiAodjogYm9vbGVhbiB8IG51bWJlcikgPT4ge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIHR5cGVvZiB2ID09PSAnYm9vbGVhbicgfHxcbiAgICAgICAgICBbMTAwMCwgMTAyNF0uaW5jbHVkZXModilcbiAgICAgICAgKVxuICAgICAgfSxcbiAgICB9IGFzIFByb3BWYWxpZGF0b3I8Ym9vbGVhbiB8IDEwMDAgfCAxMDI0PixcbiAgICBzbWFsbENoaXBzOiBCb29sZWFuLFxuICAgIHRydW5jYXRlTGVuZ3RoOiB7XG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxuICAgICAgZGVmYXVsdDogMjIsXG4gICAgfSxcbiAgICB0eXBlOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnZmlsZScsXG4gICAgfSxcbiAgICB2YWx1ZToge1xuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgdmFsaWRhdG9yOiB2YWwgPT4ge1xuICAgICAgICByZXR1cm4gd3JhcEluQXJyYXkodmFsKS5ldmVyeSh2ID0+IHYgIT0gbnVsbCAmJiB0eXBlb2YgdiA9PT0gJ29iamVjdCcpXG4gICAgICB9LFxuICAgIH0gYXMgUHJvcFZhbGlkYXRvcjxGaWxlIHwgRmlsZVtdPixcbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5WVGV4dEZpZWxkLm9wdGlvbnMuY29tcHV0ZWQuY2xhc3Nlcy5jYWxsKHRoaXMpLFxuICAgICAgICAndi1maWxlLWlucHV0JzogdHJ1ZSxcbiAgICAgIH1cbiAgICB9LFxuICAgIGNvbXB1dGVkQ291bnRlclZhbHVlICgpOiBzdHJpbmcge1xuICAgICAgY29uc3QgZmlsZUNvdW50ID0gKHRoaXMuaXNNdWx0aXBsZSAmJiB0aGlzLmxhenlWYWx1ZSlcbiAgICAgICAgPyB0aGlzLmxhenlWYWx1ZS5sZW5ndGhcbiAgICAgICAgOiAodGhpcy5sYXp5VmFsdWUgaW5zdGFuY2VvZiBGaWxlKSA/IDEgOiAwXG5cbiAgICAgIGlmICghdGhpcy5zaG93U2l6ZSkgcmV0dXJuIHRoaXMuJHZ1ZXRpZnkubGFuZy50KHRoaXMuY291bnRlclN0cmluZywgZmlsZUNvdW50KVxuXG4gICAgICBjb25zdCBieXRlcyA9IHRoaXMuaW50ZXJuYWxBcnJheVZhbHVlLnJlZHVjZSgoYnl0ZXM6IG51bWJlciwgeyBzaXplID0gMCB9OiBGaWxlKSA9PiB7XG4gICAgICAgIHJldHVybiBieXRlcyArIHNpemVcbiAgICAgIH0sIDApXG5cbiAgICAgIHJldHVybiB0aGlzLiR2dWV0aWZ5LmxhbmcudChcbiAgICAgICAgdGhpcy5jb3VudGVyU2l6ZVN0cmluZyxcbiAgICAgICAgZmlsZUNvdW50LFxuICAgICAgICBodW1hblJlYWRhYmxlRmlsZVNpemUoYnl0ZXMsIHRoaXMuYmFzZSA9PT0gMTAyNClcbiAgICAgIClcbiAgICB9LFxuICAgIGludGVybmFsQXJyYXlWYWx1ZSAoKTogRmlsZVtdIHtcbiAgICAgIHJldHVybiB3cmFwSW5BcnJheSh0aGlzLmludGVybmFsVmFsdWUpXG4gICAgfSxcbiAgICBpbnRlcm5hbFZhbHVlOiB7XG4gICAgICBnZXQgKCk6IEZpbGVbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxhenlWYWx1ZVxuICAgICAgfSxcbiAgICAgIHNldCAodmFsOiBGaWxlIHwgRmlsZVtdKSB7XG4gICAgICAgIHRoaXMubGF6eVZhbHVlID0gdmFsXG4gICAgICAgIHRoaXMuJGVtaXQoJ2NoYW5nZScsIHRoaXMubGF6eVZhbHVlKVxuICAgICAgfSxcbiAgICB9LFxuICAgIGlzRGlydHkgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxBcnJheVZhbHVlLmxlbmd0aCA+IDBcbiAgICB9LFxuICAgIGlzTGFiZWxBY3RpdmUgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMuaXNEaXJ0eVxuICAgIH0sXG4gICAgaXNNdWx0aXBsZSAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy4kYXR0cnMuaGFzT3duUHJvcGVydHkoJ211bHRpcGxlJylcbiAgICB9LFxuICAgIHRleHQgKCk6IHN0cmluZ1tdIHtcbiAgICAgIGlmICghdGhpcy5pc0RpcnR5KSByZXR1cm4gW3RoaXMucGxhY2Vob2xkZXJdXG5cbiAgICAgIHJldHVybiB0aGlzLmludGVybmFsQXJyYXlWYWx1ZS5tYXAoKGZpbGU6IEZpbGUpID0+IHtcbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgIG5hbWUgPSAnJyxcbiAgICAgICAgICBzaXplID0gMCxcbiAgICAgICAgfSA9IGZpbGVcblxuICAgICAgICBjb25zdCB0cnVuY2F0ZWRUZXh0ID0gdGhpcy50cnVuY2F0ZVRleHQobmFtZSlcblxuICAgICAgICByZXR1cm4gIXRoaXMuc2hvd1NpemVcbiAgICAgICAgICA/IHRydW5jYXRlZFRleHRcbiAgICAgICAgICA6IGAke3RydW5jYXRlZFRleHR9ICgke2h1bWFuUmVhZGFibGVGaWxlU2l6ZShzaXplLCB0aGlzLmJhc2UgPT09IDEwMjQpfSlgXG4gICAgICB9KVxuICAgIH0sXG4gICAgYmFzZSAoKTogMTAwMCB8IDEwMjQgfCB1bmRlZmluZWQge1xuICAgICAgcmV0dXJuIHR5cGVvZiB0aGlzLnNob3dTaXplICE9PSAnYm9vbGVhbicgPyB0aGlzLnNob3dTaXplIDogdW5kZWZpbmVkXG4gICAgfSxcbiAgICBoYXNDaGlwcyAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5jaGlwcyB8fCB0aGlzLnNtYWxsQ2hpcHNcbiAgICB9LFxuICB9LFxuXG4gIHdhdGNoOiB7XG4gICAgcmVhZG9ubHk6IHtcbiAgICAgIGhhbmRsZXIgKHYpIHtcbiAgICAgICAgaWYgKHYgPT09IHRydWUpIGNvbnNvbGVFcnJvcigncmVhZG9ubHkgaXMgbm90IHN1cHBvcnRlZCBvbiA8di1maWxlLWlucHV0PicsIHRoaXMpXG4gICAgICB9LFxuICAgICAgaW1tZWRpYXRlOiB0cnVlLFxuICAgIH0sXG4gICAgdmFsdWUgKHYpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5pc011bHRpcGxlID8gdiA6IHYgPyBbdl0gOiBbXVxuICAgICAgaWYgKCFkZWVwRXF1YWwodmFsdWUsIHRoaXMuJHJlZnMuaW5wdXQuZmlsZXMpKSB7XG4gICAgICAgIC8vIFdoZW4gdGhlIGlucHV0IHZhbHVlIGlzIGNoYW5nZWQgcHJvZ3JhbWF0aWNhbGx5LCBjbGVhciB0aGVcbiAgICAgICAgLy8gaW50ZXJuYWwgaW5wdXQncyB2YWx1ZSBzbyB0aGF0IHRoZSBgb25JbnB1dGAgaGFuZGxlclxuICAgICAgICAvLyBjYW4gYmUgdHJpZ2dlcmVkIGFnYWluIGlmIHRoZSB1c2VyIHJlLXNlbGVjdHMgdGhlIGV4YWN0XG4gICAgICAgIC8vIHNhbWUgZmlsZShzKS4gSWRlYWxseSwgYGlucHV0LmZpbGVzYCBzaG91bGQgYmVcbiAgICAgICAgLy8gbWFuaXB1bGF0ZWQgZGlyZWN0bHkgYnV0IHRoYXQgcHJvcGVydHkgaXMgcmVhZG9ubHkuXG4gICAgICAgIHRoaXMuJHJlZnMuaW5wdXQudmFsdWUgPSAnJ1xuICAgICAgfVxuICAgIH0sXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGNsZWFyYWJsZUNhbGxiYWNrICgpIHtcbiAgICAgIHRoaXMuaW50ZXJuYWxWYWx1ZSA9IHRoaXMuaXNNdWx0aXBsZSA/IFtdIDogdW5kZWZpbmVkXG4gICAgICB0aGlzLiRyZWZzLmlucHV0LnZhbHVlID0gJydcbiAgICB9LFxuICAgIGdlbkNoaXBzICgpIHtcbiAgICAgIGlmICghdGhpcy5pc0RpcnR5KSByZXR1cm4gW11cblxuICAgICAgcmV0dXJuIHRoaXMudGV4dC5tYXAoKHRleHQsIGluZGV4KSA9PiB0aGlzLiRjcmVhdGVFbGVtZW50KFZDaGlwLCB7XG4gICAgICAgIHByb3BzOiB7IHNtYWxsOiB0aGlzLnNtYWxsQ2hpcHMgfSxcbiAgICAgICAgb246IHtcbiAgICAgICAgICAnY2xpY2s6Y2xvc2UnOiAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbnRlcm5hbFZhbHVlID0gdGhpcy5pbnRlcm5hbFZhbHVlXG4gICAgICAgICAgICBpbnRlcm5hbFZhbHVlLnNwbGljZShpbmRleCwgMSlcbiAgICAgICAgICAgIHRoaXMuaW50ZXJuYWxWYWx1ZSA9IGludGVybmFsVmFsdWUgLy8gVHJpZ2dlciB0aGUgd2F0Y2hlclxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LCBbdGV4dF0pKVxuICAgIH0sXG4gICAgZ2VuQ29udHJvbCAoKSB7XG4gICAgICBjb25zdCByZW5kZXIgPSBWVGV4dEZpZWxkLm9wdGlvbnMubWV0aG9kcy5nZW5Db250cm9sLmNhbGwodGhpcylcblxuICAgICAgaWYgKHRoaXMuaGlkZUlucHV0KSB7XG4gICAgICAgIHJlbmRlci5kYXRhIS5zdHlsZSA9IG1lcmdlU3R5bGVzKFxuICAgICAgICAgIHJlbmRlci5kYXRhIS5zdHlsZSxcbiAgICAgICAgICB7IGRpc3BsYXk6ICdub25lJyB9XG4gICAgICAgIClcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlbmRlclxuICAgIH0sXG4gICAgZ2VuSW5wdXQgKCkge1xuICAgICAgY29uc3QgaW5wdXQgPSBWVGV4dEZpZWxkLm9wdGlvbnMubWV0aG9kcy5nZW5JbnB1dC5jYWxsKHRoaXMpXG5cbiAgICAgIC8vIFdlIHNob3VsZCBub3QgYmUgc2V0dGluZyB2YWx1ZVxuICAgICAgLy8gcHJvZ3JhbW1hdGljYWxseSBvbiB0aGUgaW5wdXRcbiAgICAgIC8vIHdoZW4gaXQgaXMgdXNpbmcgdHlwZT1cImZpbGVcIlxuICAgICAgZGVsZXRlIGlucHV0LmRhdGEhLmRvbVByb3BzIS52YWx1ZVxuXG4gICAgICAvLyBUaGlzIHNvbHZlcyBhbiBpc3N1ZSBpbiBTYWZhcmkgd2hlcmVcbiAgICAgIC8vIG5vdGhpbmcgaGFwcGVucyB3aGVuIGFkZGluZyBhIGZpbGVcbiAgICAgIC8vIGRvIHRvIHRoZSBpbnB1dCBldmVudCBub3QgZmlyaW5nXG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdnVldGlmeWpzL3Z1ZXRpZnkvaXNzdWVzLzc5NDFcbiAgICAgIGRlbGV0ZSBpbnB1dC5kYXRhIS5vbiEuaW5wdXRcbiAgICAgIGlucHV0LmRhdGEhLm9uIS5jaGFuZ2UgPSB0aGlzLm9uSW5wdXRcblxuICAgICAgcmV0dXJuIFt0aGlzLmdlblNlbGVjdGlvbnMoKSwgaW5wdXRdXG4gICAgfSxcbiAgICBnZW5QcmVwZW5kU2xvdCAoKSB7XG4gICAgICBpZiAoIXRoaXMucHJlcGVuZEljb24pIHJldHVybiBudWxsXG5cbiAgICAgIGNvbnN0IGljb24gPSB0aGlzLmdlbkljb24oJ3ByZXBlbmQnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuJHJlZnMuaW5wdXQuY2xpY2soKVxuICAgICAgfSlcblxuICAgICAgcmV0dXJuIHRoaXMuZ2VuU2xvdCgncHJlcGVuZCcsICdvdXRlcicsIFtpY29uXSlcbiAgICB9LFxuICAgIGdlblNlbGVjdGlvblRleHQgKCk6IHN0cmluZ1tdIHtcbiAgICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMudGV4dC5sZW5ndGhcblxuICAgICAgaWYgKGxlbmd0aCA8IDIpIHJldHVybiB0aGlzLnRleHRcbiAgICAgIGlmICh0aGlzLnNob3dTaXplICYmICF0aGlzLmNvdW50ZXIpIHJldHVybiBbdGhpcy5jb21wdXRlZENvdW50ZXJWYWx1ZV1cbiAgICAgIHJldHVybiBbdGhpcy4kdnVldGlmeS5sYW5nLnQodGhpcy5jb3VudGVyU3RyaW5nLCBsZW5ndGgpXVxuICAgIH0sXG4gICAgZ2VuU2VsZWN0aW9ucyAoKSB7XG4gICAgICBjb25zdCBjaGlsZHJlbiA9IFtdXG5cbiAgICAgIGlmICh0aGlzLmlzRGlydHkgJiYgdGhpcy4kc2NvcGVkU2xvdHMuc2VsZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuaW50ZXJuYWxBcnJheVZhbHVlLmZvckVhY2goKGZpbGU6IEZpbGUsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgICAgICBpZiAoIXRoaXMuJHNjb3BlZFNsb3RzLnNlbGVjdGlvbikgcmV0dXJuXG5cbiAgICAgICAgICBjaGlsZHJlbi5wdXNoKFxuICAgICAgICAgICAgdGhpcy4kc2NvcGVkU2xvdHMuc2VsZWN0aW9uKHtcbiAgICAgICAgICAgICAgdGV4dDogdGhpcy50ZXh0W2luZGV4XSxcbiAgICAgICAgICAgICAgZmlsZSxcbiAgICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIClcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNoaWxkcmVuLnB1c2godGhpcy5oYXNDaGlwcyAmJiB0aGlzLmlzRGlydHkgPyB0aGlzLmdlbkNoaXBzKCkgOiB0aGlzLmdlblNlbGVjdGlvblRleHQoKSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWZpbGUtaW5wdXRfX3RleHQnLFxuICAgICAgICBjbGFzczoge1xuICAgICAgICAgICd2LWZpbGUtaW5wdXRfX3RleHQtLXBsYWNlaG9sZGVyJzogdGhpcy5wbGFjZWhvbGRlciAmJiAhdGhpcy5pc0RpcnR5LFxuICAgICAgICAgICd2LWZpbGUtaW5wdXRfX3RleHQtLWNoaXBzJzogdGhpcy5oYXNDaGlwcyAmJiAhdGhpcy4kc2NvcGVkU2xvdHMuc2VsZWN0aW9uLFxuICAgICAgICB9LFxuICAgICAgfSwgY2hpbGRyZW4pXG4gICAgfSxcbiAgICBnZW5UZXh0RmllbGRTbG90ICgpIHtcbiAgICAgIGNvbnN0IG5vZGUgPSBWVGV4dEZpZWxkLm9wdGlvbnMubWV0aG9kcy5nZW5UZXh0RmllbGRTbG90LmNhbGwodGhpcylcblxuICAgICAgbm9kZS5kYXRhIS5vbiA9IHtcbiAgICAgICAgLi4uKG5vZGUuZGF0YSEub24gfHwge30pLFxuICAgICAgICBjbGljazogKCkgPT4gdGhpcy4kcmVmcy5pbnB1dC5jbGljaygpLFxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbm9kZVxuICAgIH0sXG4gICAgb25JbnB1dCAoZTogRXZlbnQpIHtcbiAgICAgIGNvbnN0IGZpbGVzID0gWy4uLihlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS5maWxlcyB8fCBbXV1cblxuICAgICAgdGhpcy5pbnRlcm5hbFZhbHVlID0gdGhpcy5pc011bHRpcGxlID8gZmlsZXMgOiBmaWxlc1swXVxuXG4gICAgICAvLyBTZXQgaW5pdGlhbFZhbHVlIGhlcmUgb3RoZXJ3aXNlIGlzRm9jdXNlZFxuICAgICAgLy8gd2F0Y2hlciBpbiBWVGV4dEZpZWxkIHdpbGwgZW1pdCBhIGNoYW5nZVxuICAgICAgLy8gZXZlbnQgd2hlbmV2ZXIgdGhlIGNvbXBvbmVudCBpcyBibHVycmVkXG4gICAgICB0aGlzLmluaXRpYWxWYWx1ZSA9IHRoaXMuaW50ZXJuYWxWYWx1ZVxuICAgIH0sXG4gICAgb25LZXlEb3duIChlOiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICB0aGlzLiRlbWl0KCdrZXlkb3duJywgZSlcbiAgICB9LFxuICAgIHRydW5jYXRlVGV4dCAoc3RyOiBzdHJpbmcpIHtcbiAgICAgIGlmIChzdHIubGVuZ3RoIDwgTnVtYmVyKHRoaXMudHJ1bmNhdGVMZW5ndGgpKSByZXR1cm4gc3RyXG4gICAgICBjb25zdCBjaGFyc0tlZXBPbmVTaWRlID0gTWF0aC5mbG9vcigoTnVtYmVyKHRoaXMudHJ1bmNhdGVMZW5ndGgpIC0gMSkgLyAyKVxuICAgICAgcmV0dXJuIGAke3N0ci5zbGljZSgwLCBjaGFyc0tlZXBPbmVTaWRlKX3igKYke3N0ci5zbGljZShzdHIubGVuZ3RoIC0gY2hhcnNLZWVwT25lU2lkZSl9YFxuICAgIH0sXG4gIH0sXG59KVxuIl19