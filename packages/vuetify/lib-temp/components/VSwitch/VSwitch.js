// Styles
import '../../styles/components/_selection-controls.sass';
import './VSwitch.sass';
// Mixins
import Selectable from '../../mixins/selectable';
import VInput from '../VInput';
// Directives
import Touch from '../../directives/touch';
// Components
import { VFabTransition } from '../transitions';
import VProgressCircular from '../VProgressCircular/VProgressCircular';
// Helpers
import { keyCodes } from '../../util/helpers';
/* @vue/component */
export default Selectable.extend({
    name: 'v-switch',
    directives: { Touch },
    props: {
        inset: Boolean,
        loading: {
            type: [Boolean, String],
            default: false,
        },
        flat: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        classes() {
            return {
                ...VInput.options.computed.classes.call(this),
                'v-input--selection-controls v-input--switch': true,
                'v-input--switch--flat': this.flat,
                'v-input--switch--inset': this.inset,
            };
        },
        attrs() {
            return {
                'aria-checked': String(this.isActive),
                'aria-disabled': String(this.isDisabled),
                role: 'switch',
            };
        },
        // Do not return undefined if disabled,
        // according to spec, should still show
        // a color when disabled and active
        validationState() {
            if (this.hasError && this.shouldValidate)
                return 'error';
            if (this.hasSuccess)
                return 'success';
            if (this.hasColor !== null)
                return this.computedColor;
            return undefined;
        },
        switchData() {
            return this.setTextColor(this.loading ? undefined : this.validationState, {
                class: this.themeClasses,
            });
        },
    },
    methods: {
        genDefaultSlot() {
            return [
                this.genSwitch(),
                this.genLabel(),
            ];
        },
        genSwitch() {
            return this.$createElement('div', {
                staticClass: 'v-input--selection-controls__input',
            }, [
                this.genInput('checkbox', {
                    ...this.attrs,
                    ...this.attrs$,
                }),
                this.genRipple(this.setTextColor(this.validationState, {
                    directives: [{
                            name: 'touch',
                            value: {
                                left: this.onSwipeLeft,
                                right: this.onSwipeRight,
                            },
                        }],
                })),
                this.$createElement('div', {
                    staticClass: 'v-input--switch__track',
                    ...this.switchData,
                }),
                this.$createElement('div', {
                    staticClass: 'v-input--switch__thumb',
                    ...this.switchData,
                }, [this.genProgress()]),
            ]);
        },
        genProgress() {
            return this.$createElement(VFabTransition, {}, [
                this.loading === false
                    ? null
                    : this.$slots.progress || this.$createElement(VProgressCircular, {
                        props: {
                            color: (this.loading === true || this.loading === '')
                                ? (this.color || 'primary')
                                : this.loading,
                            size: 16,
                            width: 2,
                            indeterminate: true,
                        },
                    }),
            ]);
        },
        onSwipeLeft() {
            if (this.isActive)
                this.onChange();
        },
        onSwipeRight() {
            if (!this.isActive)
                this.onChange();
        },
        onKeydown(e) {
            if ((e.keyCode === keyCodes.left && this.isActive) ||
                (e.keyCode === keyCodes.right && !this.isActive))
                this.onChange();
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlN3aXRjaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZTd2l0Y2gvVlN3aXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxrREFBa0QsQ0FBQTtBQUN6RCxPQUFPLGdCQUFnQixDQUFBO0FBRXZCLFNBQVM7QUFDVCxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUNoRCxPQUFPLE1BQU0sTUFBTSxXQUFXLENBQUE7QUFFOUIsYUFBYTtBQUNiLE9BQU8sS0FBSyxNQUFNLHdCQUF3QixDQUFBO0FBRTFDLGFBQWE7QUFDYixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZ0JBQWdCLENBQUE7QUFDL0MsT0FBTyxpQkFBaUIsTUFBTSx3Q0FBd0MsQ0FBQTtBQUV0RSxVQUFVO0FBQ1YsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBSzdDLG9CQUFvQjtBQUNwQixlQUFlLFVBQVUsQ0FBQyxNQUFNLENBQUM7SUFDL0IsSUFBSSxFQUFFLFVBQVU7SUFFaEIsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFO0lBRXJCLEtBQUssRUFBRTtRQUNMLEtBQUssRUFBRSxPQUFPO1FBQ2QsT0FBTyxFQUFFO1lBQ1AsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQztZQUN2QixPQUFPLEVBQUUsS0FBSztTQUNmO1FBQ0QsSUFBSSxFQUFFO1lBQ0osSUFBSSxFQUFFLE9BQU87WUFDYixPQUFPLEVBQUUsS0FBSztTQUNmO0tBQ0Y7SUFFRCxRQUFRLEVBQUU7UUFDUixPQUFPO1lBQ0wsT0FBTztnQkFDTCxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUM3Qyw2Q0FBNkMsRUFBRSxJQUFJO2dCQUNuRCx1QkFBdUIsRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDbEMsd0JBQXdCLEVB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QkFDUixLQUFLLEVBQUUsQ0FBQzs0QkFDUixhQUFhLEVBQUUsSUFBSTt5QkFDcEI7cUJBQ0YsQ0FBQzthQUNMLENBQUMsQ0FBQTtRQUNKLENBQUM7UUFDRCxXQUFXO1lBQ1QsSUFBSSxJQUFJLENBQUMsUUFBUTtnQkFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUE7UUFDcEMsQ0FBQztRQUNELFlBQVk7WUFDVixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVE7Z0JBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBQ3JDLENBQUM7UUFDRCxTQUFTLENBQUUsQ0FBZ0I7WUFDekIsSUFDRSxDQUFDLENBQUMsQ0FBQyxPQUFPLEtBQUssUUFBUSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUM5QyxDQUFDLENBQUMsQ0FBQyxPQUFPLEtBQUssUUFBUSxDQUFDLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQ2hELElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUNuQixDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcbmltcG9ydCAnLi4vLi4vc3R5bGVzL2NvbXBvbmVudHMvX3NlbGVjdGlvbi1jb250cm9scy5zYXNzJ1xuaW1wb3J0ICcuL1ZTd2l0Y2guc2FzcydcblxuLy8gTWl4aW5zXG5pbXBvcnQgU2VsZWN0YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvc2VsZWN0YWJsZSdcbmltcG9ydCBWSW5wdXQgZnJvbSAnLi4vVklucHV0J1xuXG4vLyBEaXJlY3RpdmVzXG5pbXBvcnQgVG91Y2ggZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy90b3VjaCdcblxuLy8gQ29tcG9uZW50c1xuaW1wb3J0IHsgVkZhYlRyYW5zaXRpb24gfSBmcm9tICcuLi90cmFuc2l0aW9ucydcbmltcG9ydCBWUHJvZ3Jlc3NDaXJjdWxhciBmcm9tICcuLi9WUHJvZ3Jlc3NDaXJjdWxhci9WUHJvZ3Jlc3NDaXJjdWxhcidcblxuLy8gSGVscGVyc1xuaW1wb3J0IHsga2V5Q29kZXMgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBWTm9kZSwgVk5vZGVEYXRhIH0gZnJvbSAndnVlJ1xuXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuZXhwb3J0IGRlZmF1bHQgU2VsZWN0YWJsZS5leHRlbmQoe1xuICBuYW1lOiAndi1zd2l0Y2gnLFxuXG4gIGRpcmVjdGl2ZXM6IHsgVG91Y2ggfSxcblxuICBwcm9wczoge1xuICAgIGluc2V0OiBCb29sZWFuLFxuICAgIGxvYWRpbmc6IHtcbiAgICAgIHR5cGU6IFtCb29sZWFuLCBTdHJpbmddLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgfSxcbiAgICBmbGF0OiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgfSxcbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5WSW5wdXQub3B0aW9ucy5jb21wdXRlZC5jbGFzc2VzLmNhbGwodGhpcyksXG4gICAgICAgICd2LWlucHV0LS1zZWxlY3Rpb24tY29udHJvbHMgdi1pbnB1dC0tc3dpdGNoJzogdHJ1ZSxcbiAgICAgICAgJ3YtaW5wdXQtLXN3aXRjaC0tZmxhdCc6IHRoaXMuZmxhdCxcbiAgICAgICAgJ3YtaW5wdXQtLXN3aXRjaC0taW5zZXQnOiB0aGlzLmluc2V0LFxuICAgICAgfVxuICAgIH0sXG4gICAgYXR0cnMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAnYXJpYS1jaGVja2VkJzogU3RyaW5nKHRoaXMuaXNBY3RpdmUpLFxuICAgICAgICAnYXJpYS1kaXNhYmxlZCc6IFN0cmluZyh0aGlzLmlzRGlzYWJsZWQpLFxuICAgICAgICByb2xlOiAnc3dpdGNoJyxcbiAgICAgIH1cbiAgICB9LFxuICAgIC8vIERvIG5vdCByZXR1cm4gdW5kZWZpbmVkIGlmIGRpc2FibGVkLFxuICAgIC8vIGFjY29yZGluZyB0byBzcGVjLCBzaG91bGQgc3RpbGwgc2hvd1xuICAgIC8vIGEgY29sb3Igd2hlbiBkaXNhYmxlZCBhbmQgYWN0aXZlXG4gICAgdmFsaWRhdGlvblN0YXRlICgpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgICAgaWYgKHRoaXMuaGFzRXJyb3IgJiYgdGhpcy5zaG91bGRWYWxpZGF0ZSkgcmV0dXJuICdlcnJvcidcbiAgICAgIGlmICh0aGlzLmhhc1N1Y2Nlc3MpIHJldHVybiAnc3VjY2VzcydcbiAgICAgIGlmICh0aGlzLmhhc0NvbG9yICE9PSBudWxsKSByZXR1cm4gdGhpcy5jb21wdXRlZENvbG9yXG4gICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfSxcbiAgICBzd2l0Y2hEYXRhICgpOiBWTm9kZURhdGEge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0VGV4dENvbG9yKHRoaXMubG9hZGluZyA/IHVuZGVmaW5lZCA6IHRoaXMudmFsaWRhdGlvblN0YXRlLCB7XG4gICAgICAgIGNsYXNzOiB0aGlzLnRoZW1lQ2xhc3NlcyxcbiAgICAgIH0pXG4gICAgfSxcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgZ2VuRGVmYXVsdFNsb3QgKCk6IChWTm9kZSB8IG51bGwpW10ge1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAgdGhpcy5nZW5Td2l0Y2goKSxcbiAgICAgICAgdGhpcy5nZW5MYWJlbCgpLFxuICAgICAgXVxuICAgIH0sXG4gICAgZ2VuU3dpdGNoICgpOiBWTm9kZSB7XG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3YtaW5wdXQtLXNlbGVjdGlvbi1jb250cm9sc19faW5wdXQnLFxuICAgICAgfSwgW1xuICAgICAgICB0aGlzLmdlbklucHV0KCdjaGVja2JveCcsIHtcbiAgICAgICAgICAuLi50aGlzLmF0dHJzLFxuICAgICAgICAgIC4uLnRoaXMuYXR0cnMkLFxuICAgICAgICB9KSxcbiAgICAgICAgdGhpcy5nZW5SaXBwbGUodGhpcy5zZXRUZXh0Q29sb3IodGhpcy52YWxpZGF0aW9uU3RhdGUsIHtcbiAgICAgICAgICBkaXJlY3RpdmVzOiBbe1xuICAgICAgICAgICAgbmFtZTogJ3RvdWNoJyxcbiAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgIGxlZnQ6IHRoaXMub25Td2lwZUxlZnQsXG4gICAgICAgICAgICAgIHJpZ2h0OiB0aGlzLm9uU3dpcGVSaWdodCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfV0sXG4gICAgICAgIH0pKSxcbiAgICAgICAgdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICAgIHN0YXRpY0NsYXNzOiAndi1pbnB1dC0tc3dpdGNoX190cmFjaycsXG4gICAgICAgICAgLi4udGhpcy5zd2l0Y2hEYXRhLFxuICAgICAgICB9KSxcbiAgICAgICAgdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICAgIHN0YXRpY0NsYXNzOiAndi1pbnB1dC0tc3dpdGNoX190aHVtYicsXG4gICAgICAgICAgLi4udGhpcy5zd2l0Y2hEYXRhLFxuICAgICAgICB9LCBbdGhpcy5nZW5Qcm9ncmVzcygpXSksXG4gICAgICBdKVxuICAgIH0sXG4gICAgZ2VuUHJvZ3Jlc3MgKCk6IFZOb2RlIHtcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZGYWJUcmFuc2l0aW9uLCB7fSwgW1xuICAgICAgICB0aGlzLmxvYWRpbmcgPT09IGZhbHNlXG4gICAgICAgICAgPyBudWxsXG4gICAgICAgICAgOiB0aGlzLiRzbG90cy5wcm9ncmVzcyB8fCB0aGlzLiRjcmVhdGVFbGVtZW50KFZQcm9ncmVzc0NpcmN1bGFyLCB7XG4gICAgICAgICAgICBwcm9wczoge1xuICAgICAgICAgICAgICBjb2xvcjogKHRoaXMubG9hZGluZyA9PT0gdHJ1ZSB8fCB0aGlzLmxvYWRpbmcgPT09ICcnKVxuICAgICAgICAgICAgICAgID8gKHRoaXMuY29sb3IgfHwgJ3ByaW1hcnknKVxuICAgICAgICAgICAgICAgIDogdGhpcy5sb2FkaW5nLFxuICAgICAgICAgICAgICBzaXplOiAxNixcbiAgICAgICAgICAgICAgd2lkdGg6IDIsXG4gICAgICAgICAgICAgIGluZGV0ZXJtaW5hdGU6IHRydWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pLFxuICAgICAgXSlcbiAgICB9LFxuICAgIG9uU3dpcGVMZWZ0ICgpIHtcbiAgICAgIGlmICh0aGlzLmlzQWN0aXZlKSB0aGlzLm9uQ2hhbmdlKClcbiAgICB9LFxuICAgIG9uU3dpcGVSaWdodCAoKSB7XG4gICAgICBpZiAoIXRoaXMuaXNBY3RpdmUpIHRoaXMub25DaGFuZ2UoKVxuICAgIH0sXG4gICAgb25LZXlkb3duIChlOiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICBpZiAoXG4gICAgICAgIChlLmtleUNvZGUgPT09IGtleUNvZGVzLmxlZnQgJiYgdGhpcy5pc0FjdGl2ZSkgfHxcbiAgICAgICAgKGUua2V5Q29kZSA9PT0ga2V5Q29kZXMucmlnaHQgJiYgIXRoaXMuaXNBY3RpdmUpXG4gICAgICApIHRoaXMub25DaGFuZ2UoKVxuICAgIH0sXG4gIH0sXG59KVxuIl19