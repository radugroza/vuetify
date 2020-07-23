import './VPicker.sass';
import '../VCard/VCard.sass';
// Mixins
import Colorable from '../../mixins/colorable';
import Elevatable from '../../mixins/elevatable';
import Themeable from '../../mixins/themeable';
// Helpers
import { convertToUnit } from '../../util/helpers';
import mixins from '../../util/mixins';
/* @vue/component */
export default mixins(Colorable, Elevatable, Themeable).extend({
    name: 'v-picker',
    props: {
        flat: Boolean,
        fullWidth: Boolean,
        landscape: Boolean,
        noTitle: Boolean,
        transition: {
            type: String,
            default: 'fade-transition',
        },
        width: {
            type: [Number, String],
            default: 290,
        },
    },
    computed: {
        computedTitleColor() {
            const defaultTitleColor = this.isDark ? false : (this.color || 'primary');
            return this.color || defaultTitleColor;
        },
    },
    methods: {
        genTitle() {
            return this.$createElement('div', this.setBackgroundColor(this.computedTitleColor, {
                staticClass: 'v-picker__title',
                class: {
                    'v-picker__title--landscape': this.landscape,
                },
            }), this.$slots.title);
        },
        genBodyTransition() {
            return this.$createElement('transition', {
                props: {
                    name: this.transition,
                },
            }, this.$slots.default);
        },
        genBody() {
            return this.$createElement('div', {
                staticClass: 'v-picker__body',
                class: {
                    'v-picker__body--no-title': this.noTitle,
                    ...this.themeClasses,
                },
                style: this.fullWidth ? undefined : {
                    width: convertToUnit(this.width),
                },
            }, [
                this.genBodyTransition(),
            ]);
        },
        genActions() {
            return this.$createElement('div', {
                staticClass: 'v-picker__actions v-card__actions',
                class: {
                    'v-picker__actions--no-title': this.noTitle,
                },
            }, this.$slots.actions);
        },
    },
    render(h) {
        return h('div', {
            staticClass: 'v-picker v-card',
            class: {
                'v-picker--flat': this.flat,
                'v-picker--landscape': this.landscape,
                'v-picker--full-width': this.fullWidth,
                ...this.themeClasses,
                ...this.elevationClasses,
            },
        }, [
            this.$slots.title ? this.genTitle() : null,
            this.genBody(),
            this.$slots.actions ? this.genActions() : null,
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlBpY2tlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZQaWNrZXIvVlBpY2tlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLGdCQUFnQixDQUFBO0FBQ3ZCLE9BQU8scUJBQXFCLENBQUE7QUFFNUIsU0FBUztBQUNULE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBQzlDLE9BQU8sVUFBVSxNQUFNLHlCQUF5QixDQUFBO0FBQ2hELE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBRTlDLFVBQVU7QUFDVixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFJbEQsT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFFdEMsb0JBQW9CO0FBQ3BCLGVBQWUsTUFBTSxDQUNuQixTQUFTLEVBQ1QsVUFBVSxFQUNWLFNBQVMsQ0FDVixDQUFDLE1BQU0sQ0FBQztJQUNQLElBQUksRUFBRSxVQUFVO0lBRWhCLEtBQUssRUFBRTtRQUNMLElBQUksRUFBRSxPQUFPO1FBQ2IsU0FBUyxFQUFFLE9BQU87UUFDbEIsU0FBUyxFQUFFLE9BQU87UUFDbEIsT0FBTyxFQUFFLE9BQU87UUFDaEIsVUFBVSxFQUFFO1lBQ1YsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsaUJBQWlCO1NBQzNCO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN0QixPQUFPLEVBQUUsR0FBRztTQUNiO0tBQ0Y7SUFFRCxRQUFRLEVBQUU7UUFDUixrQkFBa0I7WUFDaEIsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxTQUFTLENBQUMsQ0FBQTtZQUN6RSxPQUFPLElBQUksQ0FBQyxLQUFLLElBQUksaUJBQWlCLENBQUE7UUFDeEMsQ0FBQztLQUNGO0lBRUQsT0FBTyxFQUFFO1FBQ1AsUUFBUTtZQUNOLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtnQkFDakYsV0FBVyxFQUFFLGlCQUFpQjtnQkFDOUIsS0FBSyxFQUFFO29CQUNMLDRCQUE0QixFQUFFLElBQUksQ0FBQyxTQUFTO2lCQUM3QzthQUNGLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3hCLENBQUM7UUFDRCxpQkFBaUI7WUFDZixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxFQUFFO2dCQUN2QyxLQUFLLEVBQUU7b0JBQ0wsSUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVO2lCQUN0QjthQUNGLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUN6QixDQUFDO1FBQ0QsT0FBTztZQUNMLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2hDLFdBQVcsRUFBRSxnQkFBZ0I7Z0JBQzdCLEtBQUssRUFBRTtvQkFDTCwwQkFBMEIsRUFBRSxJQUFJLENBQUMsT0FBTztvQkFDeEMsR0FBRyxJQUFJLENBQUMsWUFBWTtpQkFDckI7Z0JBQ0QsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ2xDLEtBQUssRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztpQkFDakM7YUFDRixFQUFFO2dCQUNELElBQUksQ0FBQyxpQkFBaUIsRUFBRTthQUN6QixDQUFDLENBQUE7UUFDSixDQUFDO1FBQ0QsVUFBVTtZQUNSLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2hDLFdBQVcsRUFBRSxtQ0FBbUM7Z0JBQ2hELEtBQUssRUFBRTtvQkFDTCw2QkFBNkIsRUFBRSxJQUFJLENBQUMsT0FBTztpQkFDNUM7YUFDRixFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDekIsQ0FBQztLQUNGO0lBRUQsTUFBTSxDQUFFLENBQUM7UUFDUCxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUU7WUFDZCxXQUFXLEVBQUUsaUJBQWlCO1lBQzlCLEtBQUssRUFBRTtnQkFDTCxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDM0IscUJBQXFCLEVBQUUsSUFBSSxDQUFDLFNBQVM7Z0JBQ3JDLHNCQUFzQixFQUFFLElBQUksQ0FBQyxTQUFTO2dCQUN0QyxHQUFHLElBQUksQ0FBQyxZQUFZO2dCQUNwQixHQUFHLElBQUksQ0FBQyxnQkFBZ0I7YUFDekI7U0FDRixFQUFFO1lBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSTtZQUMxQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSTtTQUMvQyxDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuL1ZQaWNrZXIuc2FzcydcbmltcG9ydCAnLi4vVkNhcmQvVkNhcmQuc2FzcydcblxuLy8gTWl4aW5zXG5pbXBvcnQgQ29sb3JhYmxlIGZyb20gJy4uLy4uL21peGlucy9jb2xvcmFibGUnXG5pbXBvcnQgRWxldmF0YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvZWxldmF0YWJsZSdcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcblxuLy8gSGVscGVyc1xuaW1wb3J0IHsgY29udmVydFRvVW5pdCB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcblxuLy8gVHlwZXNcbmltcG9ydCB7IFZOb2RlIH0gZnJvbSAndnVlL3R5cGVzJ1xuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IG1peGlucyhcbiAgQ29sb3JhYmxlLFxuICBFbGV2YXRhYmxlLFxuICBUaGVtZWFibGVcbikuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtcGlja2VyJyxcblxuICBwcm9wczoge1xuICAgIGZsYXQ6IEJvb2xlYW4sXG4gICAgZnVsbFdpZHRoOiBCb29sZWFuLFxuICAgIGxhbmRzY2FwZTogQm9vbGVhbixcbiAgICBub1RpdGxlOiBCb29sZWFuLFxuICAgIHRyYW5zaXRpb246IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICdmYWRlLXRyYW5zaXRpb24nLFxuICAgIH0sXG4gICAgd2lkdGg6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiAyOTAsXG4gICAgfSxcbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGNvbXB1dGVkVGl0bGVDb2xvciAoKTogc3RyaW5nIHwgZmFsc2Uge1xuICAgICAgY29uc3QgZGVmYXVsdFRpdGxlQ29sb3IgPSB0aGlzLmlzRGFyayA/IGZhbHNlIDogKHRoaXMuY29sb3IgfHwgJ3ByaW1hcnknKVxuICAgICAgcmV0dXJuIHRoaXMuY29sb3IgfHwgZGVmYXVsdFRpdGxlQ29sb3JcbiAgICB9LFxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBnZW5UaXRsZSAoKSB7XG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2JywgdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IodGhpcy5jb21wdXRlZFRpdGxlQ29sb3IsIHtcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LXBpY2tlcl9fdGl0bGUnLFxuICAgICAgICBjbGFzczoge1xuICAgICAgICAgICd2LXBpY2tlcl9fdGl0bGUtLWxhbmRzY2FwZSc6IHRoaXMubGFuZHNjYXBlLFxuICAgICAgICB9LFxuICAgICAgfSksIHRoaXMuJHNsb3RzLnRpdGxlKVxuICAgIH0sXG4gICAgZ2VuQm9keVRyYW5zaXRpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ3RyYW5zaXRpb24nLCB7XG4gICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgbmFtZTogdGhpcy50cmFuc2l0aW9uLFxuICAgICAgICB9LFxuICAgICAgfSwgdGhpcy4kc2xvdHMuZGVmYXVsdClcbiAgICB9LFxuICAgIGdlbkJvZHkgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LXBpY2tlcl9fYm9keScsXG4gICAgICAgIGNsYXNzOiB7XG4gICAgICAgICAgJ3YtcGlja2VyX19ib2R5LS1uby10aXRsZSc6IHRoaXMubm9UaXRsZSxcbiAgICAgICAgICAuLi50aGlzLnRoZW1lQ2xhc3NlcyxcbiAgICAgICAgfSxcbiAgICAgICAgc3R5bGU6IHRoaXMuZnVsbFdpZHRoID8gdW5kZWZpbmVkIDoge1xuICAgICAgICAgIHdpZHRoOiBjb252ZXJ0VG9Vbml0KHRoaXMud2lkdGgpLFxuICAgICAgICB9LFxuICAgICAgfSwgW1xuICAgICAgICB0aGlzLmdlbkJvZHlUcmFuc2l0aW9uKCksXG4gICAgICBdKVxuICAgIH0sXG4gICAgZ2VuQWN0aW9ucyAoKSB7XG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3YtcGlja2VyX19hY3Rpb25zIHYtY2FyZF9fYWN0aW9ucycsXG4gICAgICAgIGNsYXNzOiB7XG4gICAgICAgICAgJ3YtcGlja2VyX19hY3Rpb25zLS1uby10aXRsZSc6IHRoaXMubm9UaXRsZSxcbiAgICAgICAgfSxcbiAgICAgIH0sIHRoaXMuJHNsb3RzLmFjdGlvbnMpXG4gICAgfSxcbiAgfSxcblxuICByZW5kZXIgKGgpOiBWTm9kZSB7XG4gICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgIHN0YXRpY0NsYXNzOiAndi1waWNrZXIgdi1jYXJkJyxcbiAgICAgIGNsYXNzOiB7XG4gICAgICAgICd2LXBpY2tlci0tZmxhdCc6IHRoaXMuZmxhdCxcbiAgICAgICAgJ3YtcGlja2VyLS1sYW5kc2NhcGUnOiB0aGlzLmxhbmRzY2FwZSxcbiAgICAgICAgJ3YtcGlja2VyLS1mdWxsLXdpZHRoJzogdGhpcy5mdWxsV2lkdGgsXG4gICAgICAgIC4uLnRoaXMudGhlbWVDbGFzc2VzLFxuICAgICAgICAuLi50aGlzLmVsZXZhdGlvbkNsYXNzZXMsXG4gICAgICB9LFxuICAgIH0sIFtcbiAgICAgIHRoaXMuJHNsb3RzLnRpdGxlID8gdGhpcy5nZW5UaXRsZSgpIDogbnVsbCxcbiAgICAgIHRoaXMuZ2VuQm9keSgpLFxuICAgICAgdGhpcy4kc2xvdHMuYWN0aW9ucyA/IHRoaXMuZ2VuQWN0aW9ucygpIDogbnVsbCxcbiAgICBdKVxuICB9LFxufSlcbiJdfQ==