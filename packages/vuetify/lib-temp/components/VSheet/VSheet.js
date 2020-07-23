// Styles
import './VSheet.sass';
// Mixins
import BindsAttrs from '../../mixins/binds-attrs';
import Colorable from '../../mixins/colorable';
import Elevatable from '../../mixins/elevatable';
import Measurable from '../../mixins/measurable';
import Roundable from '../../mixins/roundable';
import Themeable from '../../mixins/themeable';
// Helpers
import mixins from '../../util/mixins';
/* @vue/component */
export default mixins(BindsAttrs, Colorable, Elevatable, Measurable, Roundable, Themeable).extend({
    name: 'v-sheet',
    props: {
        outlined: Boolean,
        shaped: Boolean,
        tag: {
            type: String,
            default: 'div',
        },
    },
    computed: {
        classes() {
            return {
                'v-sheet': true,
                'v-sheet--outlined': this.outlined,
                'v-sheet--shaped': this.shaped,
                ...this.themeClasses,
                ...this.elevationClasses,
                ...this.roundedClasses,
            };
        },
        styles() {
            return this.measurableStyles;
        },
    },
    render(h) {
        const data = {
            class: this.classes,
            style: this.styles,
            on: this.listeners$,
        };
        return h(this.tag, this.setBackgroundColor(this.color, data), this.$slots.default);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlNoZWV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVlNoZWV0L1ZTaGVldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxlQUFlLENBQUE7QUFFdEIsU0FBUztBQUNULE9BQU8sVUFBVSxNQUFNLDBCQUEwQixDQUFBO0FBQ2pELE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBQzlDLE9BQU8sVUFBVSxNQUFNLHlCQUF5QixDQUFBO0FBQ2hELE9BQU8sVUFBVSxNQUFNLHlCQUF5QixDQUFBO0FBQ2hELE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBQzlDLE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBRTlDLFVBQVU7QUFDVixPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQUt0QyxvQkFBb0I7QUFDcEIsZUFBZSxNQUFNLENBQ25CLFVBQVUsRUFDVixTQUFTLEVBQ1QsVUFBVSxFQUNWLFVBQVUsRUFDVixTQUFTLEVBQ1QsU0FBUyxDQUNWLENBQUMsTUFBTSxDQUFDO0lBQ1AsSUFBSSxFQUFFLFNBQVM7SUFFZixLQUFLLEVBQUU7UUFDTCxRQUFRLEVBQUUsT0FBTztRQUNqQixNQUFNLEVBQUUsT0FBTztRQUNmLEdBQUcsRUFBRTtZQUNILElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLEtBQUs7U0FDZjtLQUNGO0lBRUQsUUFBUSxFQUFFO1FBQ1IsT0FBTztZQUNMLE9BQU87Z0JBQ0wsU0FBUyxFQUFFLElBQUk7Z0JBQ2YsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLFFBQVE7Z0JBQ2xDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxNQUFNO2dCQUM5QixHQUFHLElBQUksQ0FBQyxZQUFZO2dCQUNwQixHQUFHLElBQUksQ0FBQyxnQkFBZ0I7Z0JBQ3hCLEdBQUcsSUFBSSxDQUFDLGNBQWM7YUFDdkIsQ0FBQTtRQUNILENBQUM7UUFDRCxNQUFNO1lBQ0osT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUE7UUFDOUIsQ0FBQztLQUNGO0lBRUQsTUFBTSxDQUFFLENBQUM7UUFDUCxNQUFNLElBQUksR0FBRztZQUNYLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTztZQUNuQixLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbEIsRUFBRSxFQUFFLElBQUksQ0FBQyxVQUFVO1NBQ3BCLENBQUE7UUFFRCxPQUFPLENBQUMsQ0FDTixJQUFJLENBQUMsR0FBRyxFQUNSLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUN6QyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FDcEIsQ0FBQTtJQUNILENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcbmltcG9ydCAnLi9WU2hlZXQuc2FzcydcblxuLy8gTWl4aW5zXG5pbXBvcnQgQmluZHNBdHRycyBmcm9tICcuLi8uLi9taXhpbnMvYmluZHMtYXR0cnMnXG5pbXBvcnQgQ29sb3JhYmxlIGZyb20gJy4uLy4uL21peGlucy9jb2xvcmFibGUnXG5pbXBvcnQgRWxldmF0YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvZWxldmF0YWJsZSdcbmltcG9ydCBNZWFzdXJhYmxlIGZyb20gJy4uLy4uL21peGlucy9tZWFzdXJhYmxlJ1xuaW1wb3J0IFJvdW5kYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvcm91bmRhYmxlJ1xuaW1wb3J0IFRoZW1lYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdGhlbWVhYmxlJ1xuXG4vLyBIZWxwZXJzXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgVk5vZGUgfSBmcm9tICd2dWUnXG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBtaXhpbnMoXG4gIEJpbmRzQXR0cnMsXG4gIENvbG9yYWJsZSxcbiAgRWxldmF0YWJsZSxcbiAgTWVhc3VyYWJsZSxcbiAgUm91bmRhYmxlLFxuICBUaGVtZWFibGVcbikuZXh0ZW5kKHtcbiAgbmFtZTogJ3Ytc2hlZXQnLFxuXG4gIHByb3BzOiB7XG4gICAgb3V0bGluZWQ6IEJvb2xlYW4sXG4gICAgc2hhcGVkOiBCb29sZWFuLFxuICAgIHRhZzoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJ2RpdicsXG4gICAgfSxcbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAndi1zaGVldCc6IHRydWUsXG4gICAgICAgICd2LXNoZWV0LS1vdXRsaW5lZCc6IHRoaXMub3V0bGluZWQsXG4gICAgICAgICd2LXNoZWV0LS1zaGFwZWQnOiB0aGlzLnNoYXBlZCxcbiAgICAgICAgLi4udGhpcy50aGVtZUNsYXNzZXMsXG4gICAgICAgIC4uLnRoaXMuZWxldmF0aW9uQ2xhc3NlcyxcbiAgICAgICAgLi4udGhpcy5yb3VuZGVkQ2xhc3NlcyxcbiAgICAgIH1cbiAgICB9LFxuICAgIHN0eWxlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB0aGlzLm1lYXN1cmFibGVTdHlsZXNcbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcbiAgICBjb25zdCBkYXRhID0ge1xuICAgICAgY2xhc3M6IHRoaXMuY2xhc3NlcyxcbiAgICAgIHN0eWxlOiB0aGlzLnN0eWxlcyxcbiAgICAgIG9uOiB0aGlzLmxpc3RlbmVycyQsXG4gICAgfVxuXG4gICAgcmV0dXJuIGgoXG4gICAgICB0aGlzLnRhZyxcbiAgICAgIHRoaXMuc2V0QmFja2dyb3VuZENvbG9yKHRoaXMuY29sb3IsIGRhdGEpLFxuICAgICAgdGhpcy4kc2xvdHMuZGVmYXVsdFxuICAgIClcbiAgfSxcbn0pXG4iXX0=