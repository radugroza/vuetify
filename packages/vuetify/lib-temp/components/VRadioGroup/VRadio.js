// Styles
import './VRadio.sass';
import VLabel from '../VLabel';
import VIcon from '../VIcon';
import VInput from '../VInput';
// Mixins
import BindsAttrs from '../../mixins/binds-attrs';
import Colorable from '../../mixins/colorable';
import { factory as GroupableFactory } from '../../mixins/groupable';
import Rippleable from '../../mixins/rippleable';
import Themeable from '../../mixins/themeable';
import Selectable from '../../mixins/selectable';
// Utilities
import { getSlot } from '../../util/helpers';
import mixins from '../../util/mixins';
const baseMixins = mixins(BindsAttrs, Colorable, Rippleable, GroupableFactory('radioGroup'), Themeable);
/* @vue/component */
export default baseMixins.extend().extend({
    name: 'v-radio',
    inheritAttrs: false,
    props: {
        disabled: Boolean,
        id: String,
        label: String,
        name: String,
        offIcon: {
            type: String,
            default: '$radioOff',
        },
        onIcon: {
            type: String,
            default: '$radioOn',
        },
        readonly: Boolean,
        value: {
            default: null,
        },
    },
    data: () => ({
        isFocused: false,
    }),
    computed: {
        classes() {
            return {
                'v-radio--is-disabled': this.isDisabled,
                'v-radio--is-focused': this.isFocused,
                ...this.themeClasses,
                ...this.groupClasses,
            };
        },
        computedColor() {
            return Selectable.options.computed.computedColor.call(this);
        },
        computedIcon() {
            return this.isActive
                ? this.onIcon
                : this.offIcon;
        },
        computedId() {
            return VInput.options.computed.computedId.call(this);
        },
        hasLabel: VInput.options.computed.hasLabel,
        hasState() {
            return (this.radioGroup || {}).hasState;
        },
        isDisabled() {
            return this.disabled || (!!this.radioGroup &&
                this.radioGroup.isDisabled);
        },
        isReadonly() {
            return this.readonly || (!!this.radioGroup &&
                this.radioGroup.isReadonly);
        },
        computedName() {
            if (this.name || !this.radioGroup) {
                return this.name;
            }
            return this.radioGroup.name || `radio-${this.radioGroup._uid}`;
        },
        rippleState() {
            return Selectable.options.computed.rippleState.call(this);
        },
        validationState() {
            return (this.radioGroup || {}).validationState || this.computedColor;
        },
    },
    methods: {
        genInput(args) {
            // We can't actually use the mixin directly because
            // it's made for standalone components, but its
            // genInput method is exactly what we need
            return Selectable.options.methods.genInput.call(this, 'radio', args);
        },
        genLabel() {
            if (!this.hasLabel)
                return null;
            return this.$createElement(VLabel, {
                on: {
                    click: (e) => {
                        // Prevent label from
                        // causing the input
                        // to focus
                        e.preventDefault();
                        this.onChange();
                    },
                },
                attrs: {
                    for: this.computedId,
                },
                props: {
                    color: this.validationState,
                    focused: this.hasState,
                },
            }, getSlot(this, 'label') || this.label);
        },
        genRadio() {
            return this.$createElement('div', {
                staticClass: 'v-input--selection-controls__input',
            }, [
                this.$createElement(VIcon, this.setTextColor(this.validationState, {
                    props: {
                        dense: this.radioGroup && this.radioGroup.dense,
                    },
                }), this.computedIcon),
                this.genInput({
                    name: this.computedName,
                    value: this.value,
                    ...this.attrs$,
                }),
                this.genRipple(this.setTextColor(this.rippleState)),
            ]);
        },
        onFocus(e) {
            this.isFocused = true;
            this.$emit('focus', e);
        },
        onBlur(e) {
            this.isFocused = false;
            this.$emit('blur', e);
        },
        onChange() {
            if (this.isDisabled || this.isReadonly || this.isActive)
                return;
            this.toggle();
        },
        onKeydown: () => { },
    },
    render(h) {
        const data = {
            staticClass: 'v-radio',
            class: this.classes,
        };
        return h('div', data, [
            this.genRadio(),
            this.genLabel(),
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlJhZGlvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVlJhZGlvR3JvdXAvVlJhZGlvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFNBQVM7QUFDVCxPQUFPLGVBQWUsQ0FBQTtBQUl0QixPQUFPLE1BQU0sTUFBTSxXQUFXLENBQUE7QUFDOUIsT0FBTyxLQUFLLE1BQU0sVUFBVSxDQUFBO0FBQzVCLE9BQU8sTUFBTSxNQUFNLFdBQVcsQ0FBQTtBQUU5QixTQUFTO0FBQ1QsT0FBTyxVQUFVLE1BQU0sMEJBQTBCLENBQUE7QUFDakQsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxFQUFFLE9BQU8sSUFBSSxnQkFBZ0IsRUFBRSxNQUFNLHdCQUF3QixDQUFBO0FBQ3BFLE9BQU8sVUFBVSxNQUFNLHlCQUF5QixDQUFBO0FBQ2hELE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBQzlDLE9BQU8sVUFBVSxNQUFNLHlCQUF5QixDQUFBO0FBRWhELFlBQVk7QUFDWixPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFJNUMsT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFFdEMsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUN2QixVQUFVLEVBQ1YsU0FBUyxFQUNULFVBQVUsRUFDVixnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsRUFDOUIsU0FBUyxDQUNWLENBQUE7QUFNRCxvQkFBb0I7QUFDcEIsZUFBZSxVQUFVLENBQUMsTUFBTSxFQUFXLENBQUMsTUFBTSxDQUFDO0lBQ2pELElBQUksRUFBRSxTQUFTO0lBRWYsWUFBWSxFQUFFLEtBQUs7SUFFbkIsS0FBSyxFQUFFO1FBQ0wsUUFBUSxFQUFFLE9BQU87UUFDakIsRUFBRSxFQUFFLE1BQU07UUFDVixLQUFLLEVBQUUsTUFBTTtRQUNiLElBQUksRUFBRSxNQUFNO1FBQ1osT0FBTyxFQUFFO1lBQ1AsSUFBSSxFQUFF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QUFDLFNBQVMsR0FBRyxJQUFJLENBQUE7WUFDckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDeEIsQ0FBQztRQUNELE1BQU0sQ0FBRSxDQUFRO1lBQ2QsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUE7WUFDdEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDdkIsQ0FBQztRQUNELFFBQVE7WUFDTixJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsUUFBUTtnQkFBRSxPQUFNO1lBRS9ELElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQTtRQUNmLENBQUM7UUFDRCxTQUFTLEVBQUUsR0FBRyxFQUFFLEdBQUUsQ0FBQztLQUNwQjtJQUVELE1BQU0sQ0FBRSxDQUFDO1FBQ1AsTUFBTSxJQUFJLEdBQUc7WUFDWCxXQUFXLEVBQUUsU0FBUztZQUN0QixLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU87U0FDUCxDQUFBO1FBRWQsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRTtZQUNwQixJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2YsSUFBSSxDQUFDLFFBQVEsRUFBRTtTQUNoQixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXG5pbXBvcnQgJy4vVlJhZGlvLnNhc3MnXG5cbi8vIENvbXBvbmVudHNcbmltcG9ydCBWUmFkaW9Hcm91cCBmcm9tICcuL1ZSYWRpb0dyb3VwJ1xuaW1wb3J0IFZMYWJlbCBmcm9tICcuLi9WTGFiZWwnXG5pbXBvcnQgVkljb24gZnJvbSAnLi4vVkljb24nXG5pbXBvcnQgVklucHV0IGZyb20gJy4uL1ZJbnB1dCdcblxuLy8gTWl4aW5zXG5pbXBvcnQgQmluZHNBdHRycyBmcm9tICcuLi8uLi9taXhpbnMvYmluZHMtYXR0cnMnXG5pbXBvcnQgQ29sb3JhYmxlIGZyb20gJy4uLy4uL21peGlucy9jb2xvcmFibGUnXG5pbXBvcnQgeyBmYWN0b3J5IGFzIEdyb3VwYWJsZUZhY3RvcnkgfSBmcm9tICcuLi8uLi9taXhpbnMvZ3JvdXBhYmxlJ1xuaW1wb3J0IFJpcHBsZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3JpcHBsZWFibGUnXG5pbXBvcnQgVGhlbWVhYmxlIGZyb20gJy4uLy4uL21peGlucy90aGVtZWFibGUnXG5pbXBvcnQgU2VsZWN0YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvc2VsZWN0YWJsZSdcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgeyBnZXRTbG90IH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgVk5vZGUsIFZOb2RlRGF0YSB9IGZyb20gJ3Z1ZSdcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5cbmNvbnN0IGJhc2VNaXhpbnMgPSBtaXhpbnMoXG4gIEJpbmRzQXR0cnMsXG4gIENvbG9yYWJsZSxcbiAgUmlwcGxlYWJsZSxcbiAgR3JvdXBhYmxlRmFjdG9yeSgncmFkaW9Hcm91cCcpLFxuICBUaGVtZWFibGVcbilcblxuaW50ZXJmYWNlIG9wdGlvbnMgZXh0ZW5kcyBJbnN0YW5jZVR5cGU8dHlwZW9mIGJhc2VNaXhpbnM+IHtcbiAgcmFkaW9Hcm91cDogSW5zdGFuY2VUeXBlPHR5cGVvZiBWUmFkaW9Hcm91cD5cbn1cblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IGJhc2VNaXhpbnMuZXh0ZW5kPG9wdGlvbnM+KCkuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtcmFkaW8nLFxuXG4gIGluaGVyaXRBdHRyczogZmFsc2UsXG5cbiAgcHJvcHM6IHtcbiAgICBkaXNhYmxlZDogQm9vbGVhbixcbiAgICBpZDogU3RyaW5nLFxuICAgIGxhYmVsOiBTdHJpbmcsXG4gICAgbmFtZTogU3RyaW5nLFxuICAgIG9mZkljb246IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICckcmFkaW9PZmYnLFxuICAgIH0sXG4gICAgb25JY29uOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnJHJhZGlvT24nLFxuICAgIH0sXG4gICAgcmVhZG9ubHk6IEJvb2xlYW4sXG4gICAgdmFsdWU6IHtcbiAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgfSxcbiAgfSxcblxuICBkYXRhOiAoKSA9PiAoe1xuICAgIGlzRm9jdXNlZDogZmFsc2UsXG4gIH0pLFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICd2LXJhZGlvLS1pcy1kaXNhYmxlZCc6IHRoaXMuaXNEaXNhYmxlZCxcbiAgICAgICAgJ3YtcmFkaW8tLWlzLWZvY3VzZWQnOiB0aGlzLmlzRm9jdXNlZCxcbiAgICAgICAgLi4udGhpcy50aGVtZUNsYXNzZXMsXG4gICAgICAgIC4uLnRoaXMuZ3JvdXBDbGFzc2VzLFxuICAgICAgfVxuICAgIH0sXG4gICAgY29tcHV0ZWRDb2xvciAoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgIHJldHVybiBTZWxlY3RhYmxlLm9wdGlvbnMuY29tcHV0ZWQuY29tcHV0ZWRDb2xvci5jYWxsKHRoaXMpXG4gICAgfSxcbiAgICBjb21wdXRlZEljb24gKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gdGhpcy5pc0FjdGl2ZVxuICAgICAgICA/IHRoaXMub25JY29uXG4gICAgICAgIDogdGhpcy5vZmZJY29uXG4gICAgfSxcbiAgICBjb21wdXRlZElkICgpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuIFZJbnB1dC5vcHRpb25zLmNvbXB1dGVkLmNvbXB1dGVkSWQuY2FsbCh0aGlzKVxuICAgIH0sXG4gICAgaGFzTGFiZWw6IFZJbnB1dC5vcHRpb25zLmNvbXB1dGVkLmhhc0xhYmVsLFxuICAgIGhhc1N0YXRlICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiAodGhpcy5yYWRpb0dyb3VwIHx8IHt9KS5oYXNTdGF0ZVxuICAgIH0sXG4gICAgaXNEaXNhYmxlZCAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCB8fCAoXG4gICAgICAgICEhdGhpcy5yYWRpb0dyb3VwICYmXG4gICAgICAgIHRoaXMucmFkaW9Hcm91cC5pc0Rpc2FibGVkXG4gICAgICApXG4gICAgfSxcbiAgICBpc1JlYWRvbmx5ICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLnJlYWRvbmx5IHx8IChcbiAgICAgICAgISF0aGlzLnJhZGlvR3JvdXAgJiZcbiAgICAgICAgdGhpcy5yYWRpb0dyb3VwLmlzUmVhZG9ubHlcbiAgICAgIClcbiAgICB9LFxuICAgIGNvbXB1dGVkTmFtZSAoKTogc3RyaW5nIHtcbiAgICAgIGlmICh0aGlzLm5hbWUgfHwgIXRoaXMucmFkaW9Hcm91cCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uYW1lXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJhZGlvR3JvdXAubmFtZSB8fCBgcmFkaW8tJHt0aGlzLnJhZGlvR3JvdXAuX3VpZH1gXG4gICAgfSxcbiAgICByaXBwbGVTdGF0ZSAoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgIHJldHVybiBTZWxlY3RhYmxlLm9wdGlvbnMuY29tcHV0ZWQucmlwcGxlU3RhdGUuY2FsbCh0aGlzKVxuICAgIH0sXG4gICAgdmFsaWRhdGlvblN0YXRlICgpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgICAgcmV0dXJuICh0aGlzLnJhZGlvR3JvdXAgfHwge30pLnZhbGlkYXRpb25TdGF0ZSB8fCB0aGlzLmNvbXB1dGVkQ29sb3JcbiAgICB9LFxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBnZW5JbnB1dCAoYXJnczogYW55KSB7XG4gICAgICAvLyBXZSBjYW4ndCBhY3R1YWxseSB1c2UgdGhlIG1peGluIGRpcmVjdGx5IGJlY2F1c2VcbiAgICAgIC8vIGl0J3MgbWFkZSBmb3Igc3RhbmRhbG9uZSBjb21wb25lbnRzLCBidXQgaXRzXG4gICAgICAvLyBnZW5JbnB1dCBtZXRob2QgaXMgZXhhY3RseSB3aGF0IHdlIG5lZWRcbiAgICAgIHJldHVybiBTZWxlY3RhYmxlLm9wdGlvbnMubWV0aG9kcy5nZW5JbnB1dC5jYWxsKHRoaXMsICdyYWRpbycsIGFyZ3MpXG4gICAgfSxcbiAgICBnZW5MYWJlbCAoKSB7XG4gICAgICBpZiAoIXRoaXMuaGFzTGFiZWwpIHJldHVybiBudWxsXG5cbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZMYWJlbCwge1xuICAgICAgICBvbjoge1xuICAgICAgICAgIGNsaWNrOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICAgIC8vIFByZXZlbnQgbGFiZWwgZnJvbVxuICAgICAgICAgICAgLy8gY2F1c2luZyB0aGUgaW5wdXRcbiAgICAgICAgICAgIC8vIHRvIGZvY3VzXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcblxuICAgICAgICAgICAgdGhpcy5vbkNoYW5nZSgpXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICBmb3I6IHRoaXMuY29tcHV0ZWRJZCxcbiAgICAgICAgfSxcbiAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICBjb2xvcjogdGhpcy52YWxpZGF0aW9uU3RhdGUsXG4gICAgICAgICAgZm9jdXNlZDogdGhpcy5oYXNTdGF0ZSxcbiAgICAgICAgfSxcbiAgICAgIH0sIGdldFNsb3QodGhpcywgJ2xhYmVsJykgfHwgdGhpcy5sYWJlbClcbiAgICB9LFxuICAgIGdlblJhZGlvICgpIHtcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1pbnB1dC0tc2VsZWN0aW9uLWNvbnRyb2xzX19pbnB1dCcsXG4gICAgICB9LCBbXG4gICAgICAgIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkljb24sIHRoaXMuc2V0VGV4dENvbG9yKHRoaXMudmFsaWRhdGlvblN0YXRlLCB7XG4gICAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICAgIGRlbnNlOiB0aGlzLnJhZGlvR3JvdXAgJiYgdGhpcy5yYWRpb0dyb3VwLmRlbnNlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLCB0aGlzLmNvbXB1dGVkSWNvbiksXG4gICAgICAgIHRoaXMuZ2VuSW5wdXQoe1xuICAgICAgICAgIG5hbWU6IHRoaXMuY29tcHV0ZWROYW1lLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLnZhbHVlLFxuICAgICAgICAgIC4uLnRoaXMuYXR0cnMkLFxuICAgICAgICB9KSxcbiAgICAgICAgdGhpcy5nZW5SaXBwbGUodGhpcy5zZXRUZXh0Q29sb3IodGhpcy5yaXBwbGVTdGF0ZSkpLFxuICAgICAgXSlcbiAgICB9LFxuICAgIG9uRm9jdXMgKGU6IEV2ZW50KSB7XG4gICAgICB0aGlzLmlzRm9jdXNlZCA9IHRydWVcbiAgICAgIHRoaXMuJGVtaXQoJ2ZvY3VzJywgZSlcbiAgICB9LFxuICAgIG9uQmx1ciAoZTogRXZlbnQpIHtcbiAgICAgIHRoaXMuaXNGb2N1c2VkID0gZmFsc2VcbiAgICAgIHRoaXMuJGVtaXQoJ2JsdXInLCBlKVxuICAgIH0sXG4gICAgb25DaGFuZ2UgKCkge1xuICAgICAgaWYgKHRoaXMuaXNEaXNhYmxlZCB8fCB0aGlzLmlzUmVhZG9ubHkgfHwgdGhpcy5pc0FjdGl2ZSkgcmV0dXJuXG5cbiAgICAgIHRoaXMudG9nZ2xlKClcbiAgICB9LFxuICAgIG9uS2V5ZG93bjogKCkgPT4ge30sIC8vIE92ZXJyaWRlIGRlZmF1bHQgd2l0aCBub29wXG4gIH0sXG5cbiAgcmVuZGVyIChoKTogVk5vZGUge1xuICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICBzdGF0aWNDbGFzczogJ3YtcmFkaW8nLFxuICAgICAgY2xhc3M6IHRoaXMuY2xhc3NlcyxcbiAgICB9IGFzIFZOb2RlRGF0YVxuXG4gICAgcmV0dXJuIGgoJ2RpdicsIGRhdGEsIFtcbiAgICAgIHRoaXMuZ2VuUmFkaW8oKSxcbiAgICAgIHRoaXMuZ2VuTGFiZWwoKSxcbiAgICBdKVxuICB9LFxufSlcbiJdfQ==