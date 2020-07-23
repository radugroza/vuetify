// Styles
import './VCheckbox.sass';
import '../../styles/components/_selection-controls.sass';
// Components
import VIcon from '../VIcon';
import VInput from '../VInput';
// Mixins
import Selectable from '../../mixins/selectable';
/* @vue/component */
export default Selectable.extend({
    name: 'v-checkbox',
    props: {
        indeterminate: Boolean,
        indeterminateIcon: {
            type: String,
            default: '$checkboxIndeterminate',
        },
        offIcon: {
            type: String,
            default: '$checkboxOff',
        },
        onIcon: {
            type: String,
            default: '$checkboxOn',
        },
    },
    data() {
        return {
            inputIndeterminate: this.indeterminate,
        };
    },
    computed: {
        classes() {
            return {
                ...VInput.options.computed.classes.call(this),
                'v-input--selection-controls': true,
                'v-input--checkbox': true,
                'v-input--indeterminate': this.inputIndeterminate,
            };
        },
        computedIcon() {
            if (this.inputIndeterminate) {
                return this.indeterminateIcon;
            }
            else if (this.isActive) {
                return this.onIcon;
            }
            else {
                return this.offIcon;
            }
        },
        // Do not return undefined if disabled,
        // according to spec, should still show
        // a color when disabled and active
        validationState() {
            if (this.isDisabled && !this.inputIndeterminate)
                return undefined;
            if (this.hasError && this.shouldValidate)
                return 'error';
            if (this.hasSuccess)
                return 'success';
            if (this.hasColor !== null)
                return this.computedColor;
            return undefined;
        },
    },
    watch: {
        indeterminate(val) {
            // https://github.com/vuetifyjs/vuetify/issues/8270
            this.$nextTick(() => (this.inputIndeterminate = val));
        },
        inputIndeterminate(val) {
            this.$emit('update:indeterminate', val);
        },
        isActive() {
            if (!this.indeterminate)
                return;
            this.inputIndeterminate = false;
        },
    },
    methods: {
        genCheckbox() {
            return this.$createElement('div', {
                staticClass: 'v-input--selection-controls__input',
            }, [
                this.$createElement(VIcon, this.setTextColor(this.validationState, {
                    props: {
                        dense: this.dense,
                        dark: this.dark,
                        light: this.light,
                    },
                }), this.computedIcon),
                this.genInput('checkbox', {
                    ...this.attrs$,
                    'aria-checked': this.inputIndeterminate
                        ? 'mixed'
                        : this.isActive.toString(),
                }),
                this.genRipple(this.setTextColor(this.rippleState)),
            ]);
        },
        genDefaultSlot() {
            return [
                this.genCheckbox(),
                this.genLabel(),
            ];
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkNoZWNrYm94LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkNoZWNrYm94L1ZDaGVja2JveC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxrQkFBa0IsQ0FBQTtBQUN6QixPQUFPLGtEQUFrRCxDQUFBO0FBRXpELGFBQWE7QUFDYixPQUFPLEtBQUssTUFBTSxVQUFVLENBQUE7QUFDNUIsT0FBTyxNQUFNLE1BQU0sV0FBVyxDQUFBO0FBRTlCLFNBQVM7QUFDVCxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUVoRCxvQkFBb0I7QUFDcEIsZUFBZSxVQUFVLENBQUMsTUFBTSxDQUFDO0lBQy9CLElBQUksRUFBRSxZQUFZO0lBRWxCLEtBQUssRUFBRTtRQUNMLGFBQWEsRUFBRSxPQUFPO1FBQ3RCLGlCQUFpQixFQUFFO1lBQ2pCLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLHdCQUF3QjtTQUNsQztRQUNELE9BQU8sRUFBRTtZQUNQLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLGNBQWM7U0FDeEI7UUFDRCxNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxhQUFhO1NBQ3ZCO0tBQ0Y7SUFFRCxJQUFJO1FBQ0YsT0FBTztZQUNMLGtCQUFrQixFQUFFLElBQUksQ0FBQyxhQUFhO1NBQ3ZDLENBQUE7SUFDSCxDQUFDO0lBRUQsUUFBUSxFQUFFO1FBQ1IsT0FBTztZQUNMLE9BQU87Z0JBQ0wsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDN0MsNkJBQTZCLEVBQUUsSUFBSTtnQkFDbkMsbUJBQW1CLEVBQUUsSUFBSTtnQkFDekIsd0JBQXdCLEVBQUUsSUFBSSxDQUFDLGtCQUFrQjthQUNsRCxDQUFBO1FBQ0gsQ0FBQztRQUNELFlBQVk7WUFDVixJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtnQkFDM0IsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUE7YUFDOUI7aUJBQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUN4QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUE7YUFDbkI7aUJBQU07Z0JBQ0wsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFBO2FBQ3BCO1FBQ0gsQ0FBQztRQUNELHVDQUF1QztRQUN2Qyx1Q0FBdUM7UUFDdkMsbUNBQW1DO1FBQ25DLGVBQWU7WUFDYixJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCO2dCQUFFLE9BQU8sU0FBUyxDQUFBO1lBQ2pFLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsY0FBYztnQkFBRSxPQUFPLE9BQU8sQ0FBQTtZQUN4RCxJQUFJLElBQUksQ0FBQyxVQUFVO2dCQUFFLE9BQU8sU0FBUyxDQUFBO1lBQ3JDLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxJQUFJO2dCQUFFLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQTtZQUNyRCxPQUFPLFNBQVMsQ0FBQTtRQUNsQixDQUFDO0tBQ0Y7SUFFRCxLQUFLLEVBQUU7UUFDTCxhQUFhLENBQUUsR0FBRztZQUNoQixtREFBbUQ7WUFDbkQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQ3ZELENBQUM7UUFDRCxrQkFBa0IsQ0FBRSxHQUFHO1lBQ3JCLElBQUksQ0FBQyxLQUFLLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxDQUFDLENBQUE7UUFDekMsQ0FBQztRQUNELFFBQVE7WUFDTixJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWE7Z0JBQUUsT0FBTTtZQUMvQixJQUFJLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFBO1FBQ2pDLENBQUM7S0FDRjtJQUVELE9BQU8sRUFBRTtRQUNQLFdBQVc7WUFDVCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFO2dCQUNoQyxXQUFXLEVBQUUsb0NBQW9DO2FBQ2xELEVBQUU7Z0JBQ0QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFO29CQUNqRSxLQUFLLEVBQUU7d0JBQ0wsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO3dCQUNqQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7d0JBQ2YsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO3FCQUNsQjtpQkFDRixDQUFDLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQztnQkFDdEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUU7b0JBQ3hCLEdBQUcsSUFBSSxDQUFDLE1BQU07b0JBQ2QsY0FBYyxFQUFFLElBQUksQ0FBQyxrQkFBa0I7d0JBQ3JDLENBQUMsQ0FBQyxPQUFPO3dCQUNULENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRTtpQkFDN0IsQ0FBQztnQkFDRixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQ3BELENBQUMsQ0FBQTtRQUNKLENBQUM7UUFDRCxjQUFjO1lBQ1osT0FBTztnQkFDTCxJQUFJLENBQUMsV0FBVyxFQUFFO2dCQUNsQixJQUFJLENBQUMsUUFBUSxFQUFFO2FBQ2hCLENBQUE7UUFDSCxDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcbmltcG9ydCAnLi9WQ2hlY2tib3guc2FzcydcbmltcG9ydCAnLi4vLi4vc3R5bGVzL2NvbXBvbmVudHMvX3NlbGVjdGlvbi1jb250cm9scy5zYXNzJ1xuXG4vLyBDb21wb25lbnRzXG5pbXBvcnQgVkljb24gZnJvbSAnLi4vVkljb24nXG5pbXBvcnQgVklucHV0IGZyb20gJy4uL1ZJbnB1dCdcblxuLy8gTWl4aW5zXG5pbXBvcnQgU2VsZWN0YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvc2VsZWN0YWJsZSdcblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IFNlbGVjdGFibGUuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtY2hlY2tib3gnLFxuXG4gIHByb3BzOiB7XG4gICAgaW5kZXRlcm1pbmF0ZTogQm9vbGVhbixcbiAgICBpbmRldGVybWluYXRlSWNvbjoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJyRjaGVja2JveEluZGV0ZXJtaW5hdGUnLFxuICAgIH0sXG4gICAgb2ZmSWNvbjoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJyRjaGVja2JveE9mZicsXG4gICAgfSxcbiAgICBvbkljb246IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICckY2hlY2tib3hPbicsXG4gICAgfSxcbiAgfSxcblxuICBkYXRhICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaW5wdXRJbmRldGVybWluYXRlOiB0aGlzLmluZGV0ZXJtaW5hdGUsXG4gICAgfVxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLlZJbnB1dC5vcHRpb25zLmNvbXB1dGVkLmNsYXNzZXMuY2FsbCh0aGlzKSxcbiAgICAgICAgJ3YtaW5wdXQtLXNlbGVjdGlvbi1jb250cm9scyc6IHRydWUsXG4gICAgICAgICd2LWlucHV0LS1jaGVja2JveCc6IHRydWUsXG4gICAgICAgICd2LWlucHV0LS1pbmRldGVybWluYXRlJzogdGhpcy5pbnB1dEluZGV0ZXJtaW5hdGUsXG4gICAgICB9XG4gICAgfSxcbiAgICBjb21wdXRlZEljb24gKCk6IHN0cmluZyB7XG4gICAgICBpZiAodGhpcy5pbnB1dEluZGV0ZXJtaW5hdGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5kZXRlcm1pbmF0ZUljb25cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0FjdGl2ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5vbkljb25cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9mZkljb25cbiAgICAgIH1cbiAgICB9LFxuICAgIC8vIERvIG5vdCByZXR1cm4gdW5kZWZpbmVkIGlmIGRpc2FibGVkLFxuICAgIC8vIGFjY29yZGluZyB0byBzcGVjLCBzaG91bGQgc3RpbGwgc2hvd1xuICAgIC8vIGEgY29sb3Igd2hlbiBkaXNhYmxlZCBhbmQgYWN0aXZlXG4gICAgdmFsaWRhdGlvblN0YXRlICgpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgICAgaWYgKHRoaXMuaXNEaXNhYmxlZCAmJiAhdGhpcy5pbnB1dEluZGV0ZXJtaW5hdGUpIHJldHVybiB1bmRlZmluZWRcbiAgICAgIGlmICh0aGlzLmhhc0Vycm9yICYmIHRoaXMuc2hvdWxkVmFsaWRhdGUpIHJldHVybiAnZXJyb3InXG4gICAgICBpZiAodGhpcy5oYXNTdWNjZXNzKSByZXR1cm4gJ3N1Y2Nlc3MnXG4gICAgICBpZiAodGhpcy5oYXNDb2xvciAhPT0gbnVsbCkgcmV0dXJuIHRoaXMuY29tcHV0ZWRDb2xvclxuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH0sXG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICBpbmRldGVybWluYXRlICh2YWwpIHtcbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS92dWV0aWZ5anMvdnVldGlmeS9pc3N1ZXMvODI3MFxuICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4gKHRoaXMuaW5wdXRJbmRldGVybWluYXRlID0gdmFsKSlcbiAgICB9LFxuICAgIGlucHV0SW5kZXRlcm1pbmF0ZSAodmFsKSB7XG4gICAgICB0aGlzLiRlbWl0KCd1cGRhdGU6aW5kZXRlcm1pbmF0ZScsIHZhbClcbiAgICB9LFxuICAgIGlzQWN0aXZlICgpIHtcbiAgICAgIGlmICghdGhpcy5pbmRldGVybWluYXRlKSByZXR1cm5cbiAgICAgIHRoaXMuaW5wdXRJbmRldGVybWluYXRlID0gZmFsc2VcbiAgICB9LFxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBnZW5DaGVja2JveCAoKSB7XG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3YtaW5wdXQtLXNlbGVjdGlvbi1jb250cm9sc19faW5wdXQnLFxuICAgICAgfSwgW1xuICAgICAgICB0aGlzLiRjcmVhdGVFbGVtZW50KFZJY29uLCB0aGlzLnNldFRleHRDb2xvcih0aGlzLnZhbGlkYXRpb25TdGF0ZSwge1xuICAgICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgICBkZW5zZTogdGhpcy5kZW5zZSxcbiAgICAgICAgICAgIGRhcms6IHRoaXMuZGFyayxcbiAgICAgICAgICAgIGxpZ2h0OiB0aGlzLmxpZ2h0LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLCB0aGlzLmNvbXB1dGVkSWNvbiksXG4gICAgICAgIHRoaXMuZ2VuSW5wdXQoJ2NoZWNrYm94Jywge1xuICAgICAgICAgIC4uLnRoaXMuYXR0cnMkLFxuICAgICAgICAgICdhcmlhLWNoZWNrZWQnOiB0aGlzLmlucHV0SW5kZXRlcm1pbmF0ZVxuICAgICAgICAgICAgPyAnbWl4ZWQnXG4gICAgICAgICAgICA6IHRoaXMuaXNBY3RpdmUudG9TdHJpbmcoKSxcbiAgICAgICAgfSksXG4gICAgICAgIHRoaXMuZ2VuUmlwcGxlKHRoaXMuc2V0VGV4dENvbG9yKHRoaXMucmlwcGxlU3RhdGUpKSxcbiAgICAgIF0pXG4gICAgfSxcbiAgICBnZW5EZWZhdWx0U2xvdCAoKSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICB0aGlzLmdlbkNoZWNrYm94KCksXG4gICAgICAgIHRoaXMuZ2VuTGFiZWwoKSxcbiAgICAgIF1cbiAgICB9LFxuICB9LFxufSlcbiJdfQ==