// Styles
import './VColorPickerPreview.sass';
// Components
import VSlider from '../VSlider/VSlider';
// Utilities
import { RGBtoCSS, RGBAtoCSS } from '../../util/colorUtils';
// Types
import Vue from 'vue';
import { fromHSVA } from './util';
export default Vue.extend({
    name: 'v-color-picker-preview',
    props: {
        color: Object,
        disabled: Boolean,
        hideAlpha: Boolean,
    },
    methods: {
        genAlpha() {
            return this.genTrack({
                staticClass: 'v-color-picker__alpha',
                props: {
                    thumbColor: 'grey lighten-2',
                    hideDetails: true,
                    value: this.color.alpha,
                    step: 0,
                    min: 0,
                    max: 1,
                },
                style: {
                    backgroundImage: this.disabled
                        ? undefined
                        : `linear-gradient(to ${this.$vuetify.rtl ? 'left' : 'right'}, transparent, ${RGBtoCSS(this.color.rgba)})`,
                },
                on: {
                    input: (val) => this.color.alpha !== val && this.$emit('update:color', fromHSVA({ ...this.color.hsva, a: val })),
                },
            });
        },
        genSliders() {
            return this.$createElement('div', {
                staticClass: 'v-color-picker__sliders',
            }, [
                this.genHue(),
                !this.hideAlpha && this.genAlpha(),
            ]);
        },
        genDot() {
            return this.$createElement('div', {
                staticClass: 'v-color-picker__dot',
            }, [
                this.$createElement('div', {
                    style: {
                        background: RGBAtoCSS(this.color.rgba),
                    },
                }),
            ]);
        },
        genHue() {
            return this.genTrack({
                staticClass: 'v-color-picker__hue',
                props: {
                    thumbColor: 'grey lighten-2',
                    hideDetails: true,
                    value: this.color.hue,
                    step: 0,
                    min: 0,
                    max: 360,
                },
                on: {
                    input: (val) => this.color.hue !== val && this.$emit('update:color', fromHSVA({ ...this.color.hsva, h: val })),
                },
            });
        },
        genTrack(options) {
            return this.$createElement(VSlider, {
                class: 'v-color-picker__track',
                ...options,
                props: {
                    disabled: this.disabled,
                    ...options.props,
                },
            });
        },
    },
    render(h) {
        return h('div', {
            staticClass: 'v-color-picker__preview',
            class: {
                'v-color-picker__preview--hide-alpha': this.hideAlpha,
            },
        }, [
            this.genDot(),
            this.genSliders(),
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkNvbG9yUGlja2VyUHJldmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZDb2xvclBpY2tlci9WQ29sb3JQaWNrZXJQcmV2aWV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFNBQVM7QUFDVCxPQUFPLDRCQUE0QixDQUFBO0FBRW5DLGFBQWE7QUFDYixPQUFPLE9BQU8sTUFBTSxvQkFBb0IsQ0FBQTtBQUV4QyxZQUFZO0FBQ1osT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQTtBQUUzRCxRQUFRO0FBQ1IsT0FBTyxHQUFtQyxNQUFNLEtBQUssQ0FBQTtBQUNyRCxPQUFPLEVBQXFCLFFBQVEsRUFBRSxNQUFNLFFBQVEsQ0FBQTtBQUVwRCxlQUFlLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFDeEIsSUFBSSxFQUFFLHdCQUF3QjtJQUU5QixLQUFLLEVBQUU7UUFDTCxLQUFLLEVBQUUsTUFBcUM7UUFDNUMsUUFBUSxFQUFFLE9BQU87UUFDakIsU0FBUyxFQUFFLE9BQU87S0FDbkI7SUFFRCxPQUFPLEVBQUU7UUFDUCxRQUFRO1lBQ04sT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUNuQixXQUFXLEVBQUUsdUJBQXVCO2dCQUNwQyxLQUFLLEVBQUU7b0JBQ0wsVUFBVSxFQUFFLGdCQUFnQjtvQkFDNUIsV0FBVyxFQUFFLElBQUk7b0JBQ2pCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUs7b0JBQ3ZCLElBQUksRUFBRSxDQUFDO29CQUNQLEdBQUcsRUFBRSxDQUFDO29CQUNOLEdBQUcsRUFBRSxDQUFDO2lCQUNQO2dCQUNELEtBQUssRUFBRTtvQkFDTCxlQUFlLEVBQUUsSUFBSSxDQUFDLFFBQVE7d0JBQzVCLENBQUMsQ0FBQyxTQUFTO3dCQUNYLENBQUMsQ0FBQyxzQkFBc0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxrQkFBa0IsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUc7aUJBQzdHO2dCQUNELEVBQUUsRUFBRTtvQkFDRixLQUFLLEVBQUUsQ0FBQyxHQUFXLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxRQUFRLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO2lCQUN6SDthQUNGLENBQUMsQ0FBQTtRQUNKLENBQUM7UUFDRCxVQUFVO1lBQ1IsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRTtnQkFDaEMsV0FBVyxFQUFFLHlCQUF5QjthQUN2QyxFQUFFO2dCQUNELElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ2IsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7YUFDbkMsQ0FBQyxDQUFBO1FBQ0osQ0FBQztRQUNELE1BQU07WUFDSixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFO2dCQUNoQyxXQUFXLEVBQUUscUJBQXFCO2FBQ25DLEVBQUU7Z0JBQ0QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUU7b0JBQ3pCLEtBQUssRUFBRTt3QkFDTCxVQUFVLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO3FCQUN2QztpQkFDRixDQUFDO2FBQ0gsQ0FBQyxDQUFBO1FBQ0osQ0FBQztRQUNELE1BQU07WUFDSixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQ25CLFdBQVcsRUFBRSxxQkFBcUI7Z0JBQ2xDLEtBQUssRUFBRTtvQkFDTCxVQUFVLEVBQUUsZ0JBQWdCO29CQUM1QixXQUFXLEVBQUUsSUFBSTtvQkFDakIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRztvQkFDckIsSUFBSSxFQUFFLENBQUM7b0JBQ1AsR0FBRyxFQUFFLENBQUM7b0JBQ04sR0FBRyxFQUFFLEdBQUc7aUJBQ1Q7Z0JBQ0QsRUFBRSxFQUFFO29CQUNGLEtBQUssRUFBRSxDQUFDLEdBQVcsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLFFBQVEsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7aUJBQ3ZIO2FBQ0YsQ0FBQyxDQUFBO1FBQ0osQ0FBQztRQUNELFFBQVEsQ0FBRSxPQUFrQjtZQUMxQixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFO2dCQUNsQyxLQUFLLEVBQUUsdUJBQXVCO2dCQUM5QixHQUFHLE9BQU87Z0JBQ1YsS0FBSyxFQUFFO29CQUNMLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtvQkFDdkIsR0FBRyxPQUFPLENBQUMsS0FBSztpQkFDakI7YUFDRixDQUFDLENBQUE7UUFDSixDQUFDO0tBQ0Y7SUFFRCxNQUFNLENBQUUsQ0FBQztRQUNQLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRTtZQUNkLFdBQVcsRUFBRSx5QkFBeUI7WUFDdEMsS0FBSyxFQUFFO2dCQUNMLHFDQUFxQyxFQUFFLElBQUksQ0FBQyxTQUFTO2FBQ3REO1NBQ0YsRUFBRTtZQUNELElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDYixJQUFJLENBQUMsVUFBVSxFQUFFO1NBQ2xCLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcbmltcG9ydCAnLi9WQ29sb3JQaWNrZXJQcmV2aWV3LnNhc3MnXG5cbi8vIENvbXBvbmVudHNcbmltcG9ydCBWU2xpZGVyIGZyb20gJy4uL1ZTbGlkZXIvVlNsaWRlcidcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgeyBSR0J0b0NTUywgUkdCQXRvQ1NTIH0gZnJvbSAnLi4vLi4vdXRpbC9jb2xvclV0aWxzJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IFZ1ZSwgeyBWTm9kZSwgVk5vZGVEYXRhLCBQcm9wVHlwZSB9IGZyb20gJ3Z1ZSdcbmltcG9ydCB7IFZDb2xvclBpY2tlckNvbG9yLCBmcm9tSFNWQSB9IGZyb20gJy4vdXRpbCdcblxuZXhwb3J0IGRlZmF1bHQgVnVlLmV4dGVuZCh7XG4gIG5hbWU6ICd2LWNvbG9yLXBpY2tlci1wcmV2aWV3JyxcblxuICBwcm9wczoge1xuICAgIGNvbG9yOiBPYmplY3QgYXMgUHJvcFR5cGU8VkNvbG9yUGlja2VyQ29sb3I+LFxuICAgIGRpc2FibGVkOiBCb29sZWFuLFxuICAgIGhpZGVBbHBoYTogQm9vbGVhbixcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgZ2VuQWxwaGEgKCk6IFZOb2RlIHtcbiAgICAgIHJldHVybiB0aGlzLmdlblRyYWNrKHtcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWNvbG9yLXBpY2tlcl9fYWxwaGEnLFxuICAgICAgICBwcm9wczoge1xuICAgICAgICAgIHRodW1iQ29sb3I6ICdncmV5IGxpZ2h0ZW4tMicsXG4gICAgICAgICAgaGlkZURldGFpbHM6IHRydWUsXG4gICAgICAgICAgdmFsdWU6IHRoaXMuY29sb3IuYWxwaGEsXG4gICAgICAgICAgc3RlcDogMCxcbiAgICAgICAgICBtaW46IDAsXG4gICAgICAgICAgbWF4OiAxLFxuICAgICAgICB9LFxuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIGJhY2tncm91bmRJbWFnZTogdGhpcy5kaXNhYmxlZFxuICAgICAgICAgICAgPyB1bmRlZmluZWRcbiAgICAgICAgICAgIDogYGxpbmVhci1ncmFkaWVudCh0byAke3RoaXMuJHZ1ZXRpZnkucnRsID8gJ2xlZnQnIDogJ3JpZ2h0J30sIHRyYW5zcGFyZW50LCAke1JHQnRvQ1NTKHRoaXMuY29sb3IucmdiYSl9KWAsXG4gICAgICAgIH0sXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgaW5wdXQ6ICh2YWw6IG51bWJlcikgPT4gdGhpcy5jb2xvci5hbHBoYSAhPT0gdmFsICYmIHRoaXMuJGVtaXQoJ3VwZGF0ZTpjb2xvcicsIGZyb21IU1ZBKHsgLi4udGhpcy5jb2xvci5oc3ZhLCBhOiB2YWwgfSkpLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9LFxuICAgIGdlblNsaWRlcnMgKCk6IFZOb2RlIHtcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1jb2xvci1waWNrZXJfX3NsaWRlcnMnLFxuICAgICAgfSwgW1xuICAgICAgICB0aGlzLmdlbkh1ZSgpLFxuICAgICAgICAhdGhpcy5oaWRlQWxwaGEgJiYgdGhpcy5nZW5BbHBoYSgpLFxuICAgICAgXSlcbiAgICB9LFxuICAgIGdlbkRvdCAoKTogVk5vZGUge1xuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWNvbG9yLXBpY2tlcl9fZG90JyxcbiAgICAgIH0sIFtcbiAgICAgICAgdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBSR0JBdG9DU1ModGhpcy5jb2xvci5yZ2JhKSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgIF0pXG4gICAgfSxcbiAgICBnZW5IdWUgKCk6IFZOb2RlIHtcbiAgICAgIHJldHVybiB0aGlzLmdlblRyYWNrKHtcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWNvbG9yLXBpY2tlcl9faHVlJyxcbiAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICB0aHVtYkNvbG9yOiAnZ3JleSBsaWdodGVuLTInLFxuICAgICAgICAgIGhpZGVEZXRhaWxzOiB0cnVlLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLmNvbG9yLmh1ZSxcbiAgICAgICAgICBzdGVwOiAwLFxuICAgICAgICAgIG1pbjogMCxcbiAgICAgICAgICBtYXg6IDM2MCxcbiAgICAgICAgfSxcbiAgICAgICAgb246IHtcbiAgICAgICAgICBpbnB1dDogKHZhbDogbnVtYmVyKSA9PiB0aGlzLmNvbG9yLmh1ZSAhPT0gdmFsICYmIHRoaXMuJGVtaXQoJ3VwZGF0ZTpjb2xvcicsIGZyb21IU1ZBKHsgLi4udGhpcy5jb2xvci5oc3ZhLCBoOiB2YWwgfSkpLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9LFxuICAgIGdlblRyYWNrIChvcHRpb25zOiBWTm9kZURhdGEpOiBWTm9kZSB7XG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudChWU2xpZGVyLCB7XG4gICAgICAgIGNsYXNzOiAndi1jb2xvci1waWNrZXJfX3RyYWNrJyxcbiAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICBkaXNhYmxlZDogdGhpcy5kaXNhYmxlZCxcbiAgICAgICAgICAuLi5vcHRpb25zLnByb3BzLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcbiAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgc3RhdGljQ2xhc3M6ICd2LWNvbG9yLXBpY2tlcl9fcHJldmlldycsXG4gICAgICBjbGFzczoge1xuICAgICAgICAndi1jb2xvci1waWNrZXJfX3ByZXZpZXctLWhpZGUtYWxwaGEnOiB0aGlzLmhpZGVBbHBoYSxcbiAgICAgIH0sXG4gICAgfSwgW1xuICAgICAgdGhpcy5nZW5Eb3QoKSxcbiAgICAgIHRoaXMuZ2VuU2xpZGVycygpLFxuICAgIF0pXG4gIH0sXG59KVxuIl19