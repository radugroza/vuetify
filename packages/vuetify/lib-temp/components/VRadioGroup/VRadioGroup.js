// Styles
import '../../styles/components/_selection-controls.sass';
import './VRadioGroup.sass';
// Extensions
import VInput from '../VInput';
import { BaseItemGroup } from '../VItemGroup/VItemGroup';
// Mixins
import Comparable from '../../mixins/comparable';
// Types
import mixins from '../../util/mixins';
const baseMixins = mixins(Comparable, BaseItemGroup, VInput);
/* @vue/component */
export default baseMixins.extend({
    name: 'v-radio-group',
    provide() {
        return {
            radioGroup: this,
        };
    },
    props: {
        column: {
            type: Boolean,
            default: true,
        },
        height: {
            type: [Number, String],
            default: 'auto',
        },
        name: String,
        row: Boolean,
        // If no value set on VRadio
        // will match valueComparator
        // force default to null
        value: null,
    },
    computed: {
        classes() {
            return {
                ...VInput.options.computed.classes.call(this),
                'v-input--selection-controls v-input--radio-group': true,
                'v-input--radio-group--column': this.column && !this.row,
                'v-input--radio-group--row': this.row,
            };
        },
    },
    methods: {
        genDefaultSlot() {
            return this.$createElement('div', {
                staticClass: 'v-input--radio-group__input',
                attrs: {
                    id: this.id,
                    role: 'radiogroup',
                    'aria-labelledby': this.computedId,
                },
            }, VInput.options.methods.genDefaultSlot.call(this));
        },
        genInputSlot() {
            const render = VInput.options.methods.genInputSlot.call(this);
            delete render.data.on.click;
            return render;
        },
        genLabel() {
            const label = VInput.options.methods.genLabel.call(this);
            if (!label)
                return null;
            label.data.attrs.id = this.computedId;
            // WAI considers this an orphaned label
            delete label.data.attrs.for;
            label.tag = 'legend';
            return label;
        },
        onClick: BaseItemGroup.options.methods.onClick,
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlJhZGlvR3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WUmFkaW9Hcm91cC9WUmFkaW9Hcm91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxrREFBa0QsQ0FBQTtBQUN6RCxPQUFPLG9CQUFvQixDQUFBO0FBRTNCLGFBQWE7QUFDYixPQUFPLE1BQU0sTUFBTSxXQUFXLENBQUE7QUFDOUIsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDBCQUEwQixDQUFBO0FBRXhELFNBQVM7QUFDVCxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUVoRCxRQUFRO0FBQ1IsT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFHdEMsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUN2QixVQUFVLEVBQ1YsYUFBYSxFQUNiLE1BQU0sQ0FDUCxDQUFBO0FBRUQsb0JBQW9CO0FBQ3BCLGVBQWUsVUFBVSxDQUFDLE1BQU0sQ0FBQztJQUMvQixJQUFJLEVBQUUsZUFBZTtJQUVyQixPQUFPO1FBQ0wsT0FBTztZQUNMLFVBQVUsRUFBRSxJQUFJO1NBQ2pCLENBQUE7SUFDSCxDQUFDO0lBRUQsS0FBSyxFQUFFO1FBQ0wsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLE9BQU87WUFDYixPQUFPLEVBQUUsSUFBSTtTQUNkO1FBQ0QsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN0QixPQUFPLEVBQUUsTUFBTTtTQUNoQjtRQUNELElBQUksRUFBRSxNQUFNO1FBQ1osR0FBRyxFQUFFLE9BQU87UUFDWiw0QkFBNEI7UUFDNUIsNkJBQTZCO1FBQzdCLHdCQUF3QjtRQUN4QixLQUFLLEVBQUUsSUFBZ0M7S0FDeEM7SUFFRCxRQUFRLEVBQUU7UUFDUixPQUFPO1lBQ0wsT0FBTztnQkFDTCxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUM3QyxrREFBa0QsRUFBRSxJQUFJO2dCQUN4RCw4QkFBOEIsRUFBRSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUc7Z0JBQ3hELDJCQUEyQixFQUFFLElBQUksQ0FBQyxHQUFHO2FBQ3RDLENBQUE7UUFDSCxDQUFDO0tBQ0Y7SUFFRCxPQUFPLEVBQUU7UUFDUCxjQUFjO1lBQ1osT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRTtnQkFDaEMsV0FBVyxFQUFFLDZCQUE2QjtnQkFDMUMsS0FBSyxFQUFFO29CQUNMLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRTtvQkFDWCxJQUFJLEVBQUUsWUFBWTtvQkFDbEIsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLFVBQVU7aUJBQ25DO2FBQ0YsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7UUFDdEQsQ0FBQztRQUNELFlBQVk7WUFDVixNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1lBRTdELE9BQU8sTUFBTSxDQUFDLElBQUssQ0FBQyxFQUFHLENBQUMsS0FBSyxDQUFBO1lBRTdCLE9BQU8sTUFBTSxDQUFBO1FBQ2YsQ0FBQztRQUNELFFBQVE7WUFDTixNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1lBRXhELElBQUksQ0FBQyxLQUFLO2dCQUFFLE9BQU8sSUFBSSxDQUFBO1lBRXZCLEtBQUssQ0FBQyxJQUFLLENBQUMsS0FBTSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFBO1lBQ3ZDLHVDQUF1QztZQUN2QyxPQUFPLEtBQUssQ0FBQyxJQUFLLENBQUMsS0FBTSxDQUFDLEdBQUcsQ0FBQTtZQUM3QixLQUFLLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQTtZQUVwQixPQUFPLEtBQUssQ0FBQTtRQUNkLENBQUM7UUFDRCxPQUFPLEVBQUUsYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTztLQUMvQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xuaW1wb3J0ICcuLi8uLi9zdHlsZXMvY29tcG9uZW50cy9fc2VsZWN0aW9uLWNvbnRyb2xzLnNhc3MnXG5pbXBvcnQgJy4vVlJhZGlvR3JvdXAuc2FzcydcblxuLy8gRXh0ZW5zaW9uc1xuaW1wb3J0IFZJbnB1dCBmcm9tICcuLi9WSW5wdXQnXG5pbXBvcnQgeyBCYXNlSXRlbUdyb3VwIH0gZnJvbSAnLi4vVkl0ZW1Hcm91cC9WSXRlbUdyb3VwJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBDb21wYXJhYmxlIGZyb20gJy4uLy4uL21peGlucy9jb21wYXJhYmxlJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcbmltcG9ydCB7IFByb3BUeXBlIH0gZnJvbSAndnVlJ1xuXG5jb25zdCBiYXNlTWl4aW5zID0gbWl4aW5zKFxuICBDb21wYXJhYmxlLFxuICBCYXNlSXRlbUdyb3VwLFxuICBWSW5wdXRcbilcblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IGJhc2VNaXhpbnMuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtcmFkaW8tZ3JvdXAnLFxuXG4gIHByb3ZpZGUgKCkge1xuICAgIHJldHVybiB7XG4gICAgICByYWRpb0dyb3VwOiB0aGlzLFxuICAgIH1cbiAgfSxcblxuICBwcm9wczoge1xuICAgIGNvbHVtbjoge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgfSxcbiAgICBoZWlnaHQ6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiAnYXV0bycsXG4gICAgfSxcbiAgICBuYW1lOiBTdHJpbmcsXG4gICAgcm93OiBCb29sZWFuLFxuICAgIC8vIElmIG5vIHZhbHVlIHNldCBvbiBWUmFkaW9cbiAgICAvLyB3aWxsIG1hdGNoIHZhbHVlQ29tcGFyYXRvclxuICAgIC8vIGZvcmNlIGRlZmF1bHQgdG8gbnVsbFxuICAgIHZhbHVlOiBudWxsIGFzIHVua25vd24gYXMgUHJvcFR5cGU8YW55PixcbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5WSW5wdXQub3B0aW9ucy5jb21wdXRlZC5jbGFzc2VzLmNhbGwodGhpcyksXG4gICAgICAgICd2LWlucHV0LS1zZWxlY3Rpb24tY29udHJvbHMgdi1pbnB1dC0tcmFkaW8tZ3JvdXAnOiB0cnVlLFxuICAgICAgICAndi1pbnB1dC0tcmFkaW8tZ3JvdXAtLWNvbHVtbic6IHRoaXMuY29sdW1uICYmICF0aGlzLnJvdyxcbiAgICAgICAgJ3YtaW5wdXQtLXJhZGlvLWdyb3VwLS1yb3cnOiB0aGlzLnJvdyxcbiAgICAgIH1cbiAgICB9LFxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBnZW5EZWZhdWx0U2xvdCAoKSB7XG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3YtaW5wdXQtLXJhZGlvLWdyb3VwX19pbnB1dCcsXG4gICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgICAgcm9sZTogJ3JhZGlvZ3JvdXAnLFxuICAgICAgICAgICdhcmlhLWxhYmVsbGVkYnknOiB0aGlzLmNvbXB1dGVkSWQsXG4gICAgICAgIH0sXG4gICAgICB9LCBWSW5wdXQub3B0aW9ucy5tZXRob2RzLmdlbkRlZmF1bHRTbG90LmNhbGwodGhpcykpXG4gICAgfSxcbiAgICBnZW5JbnB1dFNsb3QgKCkge1xuICAgICAgY29uc3QgcmVuZGVyID0gVklucHV0Lm9wdGlvbnMubWV0aG9kcy5nZW5JbnB1dFNsb3QuY2FsbCh0aGlzKVxuXG4gICAgICBkZWxldGUgcmVuZGVyLmRhdGEhLm9uIS5jbGlja1xuXG4gICAgICByZXR1cm4gcmVuZGVyXG4gICAgfSxcbiAgICBnZW5MYWJlbCAoKSB7XG4gICAgICBjb25zdCBsYWJlbCA9IFZJbnB1dC5vcHRpb25zLm1ldGhvZHMuZ2VuTGFiZWwuY2FsbCh0aGlzKVxuXG4gICAgICBpZiAoIWxhYmVsKSByZXR1cm4gbnVsbFxuXG4gICAgICBsYWJlbC5kYXRhIS5hdHRycyEuaWQgPSB0aGlzLmNvbXB1dGVkSWRcbiAgICAgIC8vIFdBSSBjb25zaWRlcnMgdGhpcyBhbiBvcnBoYW5lZCBsYWJlbFxuICAgICAgZGVsZXRlIGxhYmVsLmRhdGEhLmF0dHJzIS5mb3JcbiAgICAgIGxhYmVsLnRhZyA9ICdsZWdlbmQnXG5cbiAgICAgIHJldHVybiBsYWJlbFxuICAgIH0sXG4gICAgb25DbGljazogQmFzZUl0ZW1Hcm91cC5vcHRpb25zLm1ldGhvZHMub25DbGljayxcbiAgfSxcbn0pXG4iXX0=