// Styles
import './VColorPicker.sass';
// Components
import VSheet from '../VSheet/VSheet';
import VColorPickerPreview from './VColorPickerPreview';
import VColorPickerCanvas from './VColorPickerCanvas';
import VColorPickerEdit, { modes } from './VColorPickerEdit';
import VColorPickerSwatches from './VColorPickerSwatches';
// Helpers
import { parseColor, fromRGBA, extractColor, hasAlpha } from './util';
import mixins from '../../util/mixins';
import { deepEqual } from '../../util/helpers';
// Mixins
import Elevatable from '../../mixins/elevatable';
import Themeable from '../../mixins/themeable';
export default mixins(Elevatable, Themeable).extend({
    name: 'v-color-picker',
    props: {
        canvasHeight: {
            type: [String, Number],
            default: 150,
        },
        disabled: Boolean,
        dotSize: {
            type: [Number, String],
            default: 10,
        },
        flat: Boolean,
        hideCanvas: Boolean,
        hideInputs: Boolean,
        hideModeSwitch: Boolean,
        mode: {
            type: String,
            default: 'rgba',
            validator: (v) => Object.keys(modes).includes(v),
        },
        showSwatches: Boolean,
        swatches: Array,
        swatchesMaxHeight: {
            type: [Number, String],
            default: 150,
        },
        value: {
            type: [Object, String],
        },
        width: {
            type: [Number, String],
            default: 300,
        },
    },
    data: () => ({
        internalValue: fromRGBA({ r: 255, g: 0, b: 0, a: 1 }),
    }),
    computed: {
        hideAlpha() {
            if (!this.value)
                return false;
            return !hasAlpha(this.value);
        },
    },
    watch: {
        value: {
            handler(color) {
                this.updateColor(parseColor(color, this.internalValue));
            },
            immediate: true,
        },
    },
    methods: {
        updateColor(color) {
            this.internalValue = color;
            const value = extractColor(this.internalValue, this.value);
            if (!deepEqual(value, this.value)) {
                this.$emit('input', value);
                this.$emit('update:color', this.internalValue);
            }
        },
        genCanvas() {
            return this.$createElement(VColorPickerCanvas, {
                props: {
                    color: this.internalValue,
                    disabled: this.disabled,
                    dotSize: this.dotSize,
                    width: this.width,
                    height: this.canvasHeight,
                },
                on: {
                    'update:color': this.updateColor,
                },
            });
        },
        genControls() {
            return this.$createElement('div', {
                staticClass: 'v-color-picker__controls',
            }, [
                this.genPreview(),
                !this.hideInputs && this.genEdit(),
            ]);
        },
        genEdit() {
            return this.$createElement(VColorPickerEdit, {
                props: {
                    color: this.internalValue,
                    disabled: this.disabled,
                    hideAlpha: this.hideAlpha,
                    hideModeSwitch: this.hideModeSwitch,
                    mode: this.mode,
                },
                on: {
                    'update:color': this.updateColor,
                    'update:mode': (v) => this.$emit('update:mode', v),
                },
            });
        },
        genPreview() {
            return this.$createElement(VColorPickerPreview, {
                props: {
                    color: this.internalValue,
                    disabled: this.disabled,
                    hideAlpha: this.hideAlpha,
                },
                on: {
                    'update:color': this.updateColor,
                },
            });
        },
        genSwatches() {
            return this.$createElement(VColorPickerSwatches, {
                props: {
                    dark: this.dark,
                    light: this.light,
                    swatches: this.swatches,
                    color: this.internalValue,
                    maxHeight: this.swatchesMaxHeight,
                },
                on: {
                    'update:color': this.updateColor,
                },
            });
        },
    },
    render(h) {
        return h(VSheet, {
            staticClass: 'v-color-picker',
            class: {
                'v-color-picker--flat': this.flat,
                ...this.themeClasses,
                ...this.elevationClasses,
            },
            props: {
                maxWidth: this.width,
            },
        }, [
            !this.hideCanvas && this.genCanvas(),
            this.genControls(),
            this.showSwatches && this.genSwatches(),
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkNvbG9yUGlja2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkNvbG9yUGlja2VyL1ZDb2xvclBpY2tlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxxQkFBcUIsQ0FBQTtBQUU1QixhQUFhO0FBQ2IsT0FBTyxNQUFNLE1BQU0sa0JBQWtCLENBQUE7QUFDckMsT0FBTyxtQkFBbUIsTUFBTSx1QkFBdUIsQ0FBQTtBQUN2RCxPQUFPLGtCQUFrQixNQUFNLHNCQUFzQixDQUFBO0FBQ3JELE9BQU8sZ0JBQWdCLEVBQUUsRUFBUSxLQUFLLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUNsRSxPQUFPLG9CQUFvQixNQUFNLHdCQUF3QixDQUFBO0FBRXpELFVBQVU7QUFDVixPQUFPLEVBQXFCLFVBQVUsRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxNQUFNLFFBQVEsQ0FBQTtBQUN4RixPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQUN0QyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFFOUMsU0FBUztBQUNULE9BQU8sVUFBVSxNQUFNLHlCQUF5QixDQUFBO0FBQ2hELE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBSzlDLGVBQWUsTUFBTSxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDbEQsSUFBSSxFQUFFLGdCQUFnQjtJQUV0QixLQUFLLEVBQUU7UUFDTCxZQUFZLEVBQUU7WUFDWixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxHQUFHO1NBQ2I7UUFDRCxRQUFRLEVBQUUsT0FBTztRQUNqQixPQUFPLEVBQUU7WUFDUCxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxFQUFFO1NBQ1o7UUFDRCxJQUFJ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O2dCQUNELEVBQUUsRUFBRTtvQkFDRixjQUFjLEVBQUUsSUFBSSxDQUFDLFdBQVc7aUJBQ2pDO2FBQ0YsQ0FBQyxDQUFBO1FBQ0osQ0FBQztLQUNGO0lBRUQsTUFBTSxDQUFFLENBQUM7UUFDUCxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUU7WUFDZixXQUFXLEVBQUUsZ0JBQWdCO1lBQzdCLEtBQUssRUFBRTtnQkFDTCxzQkFBc0IsRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDakMsR0FBRyxJQUFJLENBQUMsWUFBWTtnQkFDcEIsR0FBRyxJQUFJLENBQUMsZ0JBQWdCO2FBQ3pCO1lBQ0QsS0FBSyxFQUFFO2dCQUNMLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSzthQUNyQjtTQUNGLEVBQUU7WUFDRCxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNwQyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtTQUN4QyxDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXG5pbXBvcnQgJy4vVkNvbG9yUGlja2VyLnNhc3MnXG5cbi8vIENvbXBvbmVudHNcbmltcG9ydCBWU2hlZXQgZnJvbSAnLi4vVlNoZWV0L1ZTaGVldCdcbmltcG9ydCBWQ29sb3JQaWNrZXJQcmV2aWV3IGZyb20gJy4vVkNvbG9yUGlja2VyUHJldmlldydcbmltcG9ydCBWQ29sb3JQaWNrZXJDYW52YXMgZnJvbSAnLi9WQ29sb3JQaWNrZXJDYW52YXMnXG5pbXBvcnQgVkNvbG9yUGlja2VyRWRpdCwgeyBNb2RlLCBtb2RlcyB9IGZyb20gJy4vVkNvbG9yUGlja2VyRWRpdCdcbmltcG9ydCBWQ29sb3JQaWNrZXJTd2F0Y2hlcyBmcm9tICcuL1ZDb2xvclBpY2tlclN3YXRjaGVzJ1xuXG4vLyBIZWxwZXJzXG5pbXBvcnQgeyBWQ29sb3JQaWNrZXJDb2xvciwgcGFyc2VDb2xvciwgZnJvbVJHQkEsIGV4dHJhY3RDb2xvciwgaGFzQWxwaGEgfSBmcm9tICcuL3V0aWwnXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuaW1wb3J0IHsgZGVlcEVxdWFsIH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBFbGV2YXRhYmxlIGZyb20gJy4uLy4uL21peGlucy9lbGV2YXRhYmxlJ1xuaW1wb3J0IFRoZW1lYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdGhlbWVhYmxlJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgVk5vZGUsIFByb3BUeXBlIH0gZnJvbSAndnVlJ1xuXG5leHBvcnQgZGVmYXVsdCBtaXhpbnMoRWxldmF0YWJsZSwgVGhlbWVhYmxlKS5leHRlbmQoe1xuICBuYW1lOiAndi1jb2xvci1waWNrZXInLFxuXG4gIHByb3BzOiB7XG4gICAgY2FudmFzSGVpZ2h0OiB7XG4gICAgICB0eXBlOiBbU3RyaW5nLCBOdW1iZXJdLFxuICAgICAgZGVmYXVsdDogMTUwLFxuICAgIH0sXG4gICAgZGlzYWJsZWQ6IEJvb2xlYW4sXG4gICAgZG90U2l6ZToge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6IDEwLFxuICAgIH0sXG4gICAgZmxhdDogQm9vbGVhbixcbiAgICBoaWRlQ2FudmFzOiBCb29sZWFuLFxuICAgIGhpZGVJbnB1dHM6IEJvb2xlYW4sXG4gICAgaGlkZU1vZGVTd2l0Y2g6IEJvb2xlYW4sXG4gICAgbW9kZToge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJ3JnYmEnLFxuICAgICAgdmFsaWRhdG9yOiAodjogc3RyaW5nKSA9PiBPYmplY3Qua2V5cyhtb2RlcykuaW5jbHVkZXModiksXG4gICAgfSxcbiAgICBzaG93U3dhdGNoZXM6IEJvb2xlYW4sXG4gICAgc3dhdGNoZXM6IEFycmF5IGFzIFByb3BUeXBlPHN0cmluZ1tdW10+LFxuICAgIHN3YXRjaGVzTWF4SGVpZ2h0OiB7XG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxuICAgICAgZGVmYXVsdDogMTUwLFxuICAgIH0sXG4gICAgdmFsdWU6IHtcbiAgICAgIHR5cGU6IFtPYmplY3QsIFN0cmluZ10sXG4gICAgfSxcbiAgICB3aWR0aDoge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6IDMwMCxcbiAgICB9LFxuICB9LFxuXG4gIGRhdGE6ICgpID0+ICh7XG4gICAgaW50ZXJuYWxWYWx1ZTogZnJvbVJHQkEoeyByOiAyNTUsIGc6IDAsIGI6IDAsIGE6IDEgfSksXG4gIH0pLFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgaGlkZUFscGhhICgpOiBib29sZWFuIHtcbiAgICAgIGlmICghdGhpcy52YWx1ZSkgcmV0dXJuIGZhbHNlXG5cbiAgICAgIHJldHVybiAhaGFzQWxwaGEodGhpcy52YWx1ZSlcbiAgICB9LFxuICB9LFxuXG4gIHdhdGNoOiB7XG4gICAgdmFsdWU6IHtcbiAgICAgIGhhbmRsZXIgKGNvbG9yOiBhbnkpIHtcbiAgICAgICAgdGhpcy51cGRhdGVDb2xvcihwYXJzZUNvbG9yKGNvbG9yLCB0aGlzLmludGVybmFsVmFsdWUpKVxuICAgICAgfSxcbiAgICAgIGltbWVkaWF0ZTogdHJ1ZSxcbiAgICB9LFxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICB1cGRhdGVDb2xvciAoY29sb3I6IFZDb2xvclBpY2tlckNvbG9yKSB7XG4gICAgICB0aGlzLmludGVybmFsVmFsdWUgPSBjb2xvclxuICAgICAgY29uc3QgdmFsdWUgPSBleHRyYWN0Q29sb3IodGhpcy5pbnRlcm5hbFZhbHVlLCB0aGlzLnZhbHVlKVxuXG4gICAgICBpZiAoIWRlZXBFcXVhbCh2YWx1ZSwgdGhpcy52YWx1ZSkpIHtcbiAgICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCB2YWx1ZSlcbiAgICAgICAgdGhpcy4kZW1pdCgndXBkYXRlOmNvbG9yJywgdGhpcy5pbnRlcm5hbFZhbHVlKVxuICAgICAgfVxuICAgIH0sXG4gICAgZ2VuQ2FudmFzICgpOiBWTm9kZSB7XG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudChWQ29sb3JQaWNrZXJDYW52YXMsIHtcbiAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICBjb2xvcjogdGhpcy5pbnRlcm5hbFZhbHVlLFxuICAgICAgICAgIGRpc2FibGVkOiB0aGlzLmRpc2FibGVkLFxuICAgICAgICAgIGRvdFNpemU6IHRoaXMuZG90U2l6ZSxcbiAgICAgICAgICB3aWR0aDogdGhpcy53aWR0aCxcbiAgICAgICAgICBoZWlnaHQ6IHRoaXMuY2FudmFzSGVpZ2h0LFxuICAgICAgICB9LFxuICAgICAgICBvbjoge1xuICAgICAgICAgICd1cGRhdGU6Y29sb3InOiB0aGlzLnVwZGF0ZUNvbG9yLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9LFxuICAgIGdlbkNvbnRyb2xzICgpOiBWTm9kZSB7XG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3YtY29sb3ItcGlja2VyX19jb250cm9scycsXG4gICAgICB9LCBbXG4gICAgICAgIHRoaXMuZ2VuUHJldmlldygpLFxuICAgICAgICAhdGhpcy5oaWRlSW5wdXRzICYmIHRoaXMuZ2VuRWRpdCgpLFxuICAgICAgXSlcbiAgICB9LFxuICAgIGdlbkVkaXQgKCk6IFZOb2RlIHtcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZDb2xvclBpY2tlckVkaXQsIHtcbiAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICBjb2xvcjogdGhpcy5pbnRlcm5hbFZhbHVlLFxuICAgICAgICAgIGRpc2FibGVkOiB0aGlzLmRpc2FibGVkLFxuICAgICAgICAgIGhpZGVBbHBoYTogdGhpcy5oaWRlQWxwaGEsXG4gICAgICAgICAgaGlkZU1vZGVTd2l0Y2g6IHRoaXMuaGlkZU1vZGVTd2l0Y2gsXG4gICAgICAgICAgbW9kZTogdGhpcy5tb2RlLFxuICAgICAgICB9LFxuICAgICAgICBvbjoge1xuICAgICAgICAgICd1cGRhdGU6Y29sb3InOiB0aGlzLnVwZGF0ZUNvbG9yLFxuICAgICAgICAgICd1cGRhdGU6bW9kZSc6ICh2OiBNb2RlKSA9PiB0aGlzLiRlbWl0KCd1cGRhdGU6bW9kZScsIHYpLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9LFxuICAgIGdlblByZXZpZXcgKCk6IFZOb2RlIHtcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZDb2xvclBpY2tlclByZXZpZXcsIHtcbiAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICBjb2xvcjogdGhpcy5pbnRlcm5hbFZhbHVlLFxuICAgICAgICAgIGRpc2FibGVkOiB0aGlzLmRpc2FibGVkLFxuICAgICAgICAgIGhpZGVBbHBoYTogdGhpcy5oaWRlQWxwaGEsXG4gICAgICAgIH0sXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgJ3VwZGF0ZTpjb2xvcic6IHRoaXMudXBkYXRlQ29sb3IsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH0sXG4gICAgZ2VuU3dhdGNoZXMgKCk6IFZOb2RlIHtcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZDb2xvclBpY2tlclN3YXRjaGVzLCB7XG4gICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgZGFyazogdGhpcy5kYXJrLFxuICAgICAgICAgIGxpZ2h0OiB0aGlzLmxpZ2h0LFxuICAgICAgICAgIHN3YXRjaGVzOiB0aGlzLnN3YXRjaGVzLFxuICAgICAgICAgIGNvbG9yOiB0aGlzLmludGVybmFsVmFsdWUsXG4gICAgICAgICAgbWF4SGVpZ2h0OiB0aGlzLnN3YXRjaGVzTWF4SGVpZ2h0LFxuICAgICAgICB9LFxuICAgICAgICBvbjoge1xuICAgICAgICAgICd1cGRhdGU6Y29sb3InOiB0aGlzLnVwZGF0ZUNvbG9yLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcbiAgICByZXR1cm4gaChWU2hlZXQsIHtcbiAgICAgIHN0YXRpY0NsYXNzOiAndi1jb2xvci1waWNrZXInLFxuICAgICAgY2xhc3M6IHtcbiAgICAgICAgJ3YtY29sb3ItcGlja2VyLS1mbGF0JzogdGhpcy5mbGF0LFxuICAgICAgICAuLi50aGlzLnRoZW1lQ2xhc3NlcyxcbiAgICAgICAgLi4udGhpcy5lbGV2YXRpb25DbGFzc2VzLFxuICAgICAgfSxcbiAgICAgIHByb3BzOiB7XG4gICAgICAgIG1heFdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgfSxcbiAgICB9LCBbXG4gICAgICAhdGhpcy5oaWRlQ2FudmFzICYmIHRoaXMuZ2VuQ2FudmFzKCksXG4gICAgICB0aGlzLmdlbkNvbnRyb2xzKCksXG4gICAgICB0aGlzLnNob3dTd2F0Y2hlcyAmJiB0aGlzLmdlblN3YXRjaGVzKCksXG4gICAgXSlcbiAgfSxcbn0pXG4iXX0=