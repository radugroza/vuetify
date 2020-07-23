// Extensions
import VWindowItem from '../VWindow/VWindowItem';
// Components
import { VImg } from '../VImg';
// Utilities
import mixins from '../../util/mixins';
import { getSlot } from '../../util/helpers';
import Routable from '../../mixins/routable';
// Types
const baseMixins = mixins(VWindowItem, Routable);
/* @vue/component */
export default baseMixins.extend({
    name: 'v-carousel-item',
    inheritAttrs: false,
    methods: {
        genDefaultSlot() {
            return [
                this.$createElement(VImg, {
                    staticClass: 'v-carousel__item',
                    props: {
                        ...this.$attrs,
                        height: this.windowGroup.internalHeight,
                    },
                    on: this.$listeners,
                    scopedSlots: {
                        placeholder: this.$scopedSlots.placeholder,
                    },
                }, getSlot(this)),
            ];
        },
        genWindowItem() {
            const { tag, data } = this.generateRouteLink();
            data.staticClass = 'v-window-item';
            data.directives.push({
                name: 'show',
                value: this.isActive,
            });
            return this.$createElement(tag, data, this.genDefaultSlot());
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkNhcm91c2VsSXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZDYXJvdXNlbC9WQ2Fyb3VzZWxJdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGFBQWE7QUFDYixPQUFPLFdBQVcsTUFBTSx3QkFBd0IsQ0FBQTtBQUVoRCxhQUFhO0FBQ2IsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUU5QixZQUFZO0FBQ1osT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFDdEMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQzVDLE9BQU8sUUFBUSxNQUFNLHVCQUF1QixDQUFBO0FBRTVDLFFBQVE7QUFDUixNQUFNLFVBQVUsR0FBRyxNQUFNLENBQ3ZCLFdBQVcsRUFDWCxRQUFRLENBQ1QsQ0FBQTtBQUVELG9CQUFvQjtBQUNwQixlQUFlLFVBQVUsQ0FBQyxNQUFNLENBQUM7SUFDL0IsSUFBSSxFQUFFLGlCQUFpQjtJQUV2QixZQUFZLEVBQUUsS0FBSztJQUVuQixPQUFPLEVBQUU7UUFDUCxjQUFjO1lBQ1osT0FBTztnQkFDTCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRTtvQkFDeEIsV0FBVyxFQUFFLGtCQUFrQjtvQkFDL0IsS0FBSyxFQUFFO3dCQUNMLEdBQUcsSUFBSSxDQUFDLE1BQU07d0JBQ2QsTUFBTSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYztxQkFDeEM7b0JBQ0QsRUFBRSxFQUFFLElBQUksQ0FBQyxVQUFVO29CQUNuQixXQUFXLEVBQUU7d0JBQ1gsV0FBVyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVztxQkFDM0M7aUJBQ0YsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDbEIsQ0FBQTtRQUNILENBQUM7UUFDRCxhQUFhO1lBQ1gsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUU5QyxJQUFJLENBQUMsV0FBVyxHQUFHLGVBQWUsQ0FBQTtZQUNsQyxJQUFJLENBQUMsVUFBVyxDQUFDLElBQUksQ0FBQztnQkFDcEIsSUFBSSxFQUFFLE1BQU07Z0JBQ1osS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRO2FBQ3JCLENBQUMsQ0FBQTtZQUVGLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFBO1FBQzlELENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIEV4dGVuc2lvbnNcbmltcG9ydCBWV2luZG93SXRlbSBmcm9tICcuLi9WV2luZG93L1ZXaW5kb3dJdGVtJ1xuXG4vLyBDb21wb25lbnRzXG5pbXBvcnQgeyBWSW1nIH0gZnJvbSAnLi4vVkltZydcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuaW1wb3J0IHsgZ2V0U2xvdCB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcbmltcG9ydCBSb3V0YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvcm91dGFibGUnXG5cbi8vIFR5cGVzXG5jb25zdCBiYXNlTWl4aW5zID0gbWl4aW5zKFxuICBWV2luZG93SXRlbSxcbiAgUm91dGFibGVcbilcblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IGJhc2VNaXhpbnMuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtY2Fyb3VzZWwtaXRlbScsXG5cbiAgaW5oZXJpdEF0dHJzOiBmYWxzZSxcblxuICBtZXRob2RzOiB7XG4gICAgZ2VuRGVmYXVsdFNsb3QgKCkge1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAgdGhpcy4kY3JlYXRlRWxlbWVudChWSW1nLCB7XG4gICAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWNhcm91c2VsX19pdGVtJyxcbiAgICAgICAgICBwcm9wczoge1xuICAgICAgICAgICAgLi4udGhpcy4kYXR0cnMsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMud2luZG93R3JvdXAuaW50ZXJuYWxIZWlnaHQsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBvbjogdGhpcy4kbGlzdGVuZXJzLFxuICAgICAgICAgIHNjb3BlZFNsb3RzOiB7XG4gICAgICAgICAgICBwbGFjZWhvbGRlcjogdGhpcy4kc2NvcGVkU2xvdHMucGxhY2Vob2xkZXIsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSwgZ2V0U2xvdCh0aGlzKSksXG4gICAgICBdXG4gICAgfSxcbiAgICBnZW5XaW5kb3dJdGVtICgpIHtcbiAgICAgIGNvbnN0IHsgdGFnLCBkYXRhIH0gPSB0aGlzLmdlbmVyYXRlUm91dGVMaW5rKClcblxuICAgICAgZGF0YS5zdGF0aWNDbGFzcyA9ICd2LXdpbmRvdy1pdGVtJ1xuICAgICAgZGF0YS5kaXJlY3RpdmVzIS5wdXNoKHtcbiAgICAgICAgbmFtZTogJ3Nob3cnLFxuICAgICAgICB2YWx1ZTogdGhpcy5pc0FjdGl2ZSxcbiAgICAgIH0pXG5cbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KHRhZywgZGF0YSwgdGhpcy5nZW5EZWZhdWx0U2xvdCgpKVxuICAgIH0sXG4gIH0sXG59KVxuIl19