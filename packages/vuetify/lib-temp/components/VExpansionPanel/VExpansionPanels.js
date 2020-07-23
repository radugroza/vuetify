// Styles
import './VExpansionPanel.sass';
// Components
import { BaseItemGroup } from '../VItemGroup/VItemGroup';
// Utilities
import { breaking } from '../../util/console';
/* @vue/component */
export default BaseItemGroup.extend({
    name: 'v-expansion-panels',
    provide() {
        return {
            expansionPanels: this,
        };
    },
    props: {
        accordion: Boolean,
        disabled: Boolean,
        flat: Boolean,
        hover: Boolean,
        focusable: Boolean,
        inset: Boolean,
        popout: Boolean,
        readonly: Boolean,
        tile: Boolean,
    },
    computed: {
        classes() {
            return {
                ...BaseItemGroup.options.computed.classes.call(this),
                'v-expansion-panels': true,
                'v-expansion-panels--accordion': this.accordion,
                'v-expansion-panels--flat': this.flat,
                'v-expansion-panels--hover': this.hover,
                'v-expansion-panels--focusable': this.focusable,
                'v-expansion-panels--inset': this.inset,
                'v-expansion-panels--popout': this.popout,
                'v-expansion-panels--tile': this.tile,
            };
        },
    },
    created() {
        /* istanbul ignore next */
        if (this.$attrs.hasOwnProperty('expand')) {
            breaking('expand', 'multiple', this);
        }
        /* istanbul ignore next */
        if (Array.isArray(this.value) &&
            this.value.length > 0 &&
            typeof this.value[0] === 'boolean') {
            breaking(':value="[true, false, true]"', ':value="[0, 2]"', this);
        }
    },
    methods: {
        updateItem(item, index) {
            const value = this.getValue(item, index);
            const nextValue = this.getValue(item, index + 1);
            item.isActive = this.toggleMethod(value);
            item.nextIsActive = this.toggleMethod(nextValue);
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkV4cGFuc2lvblBhbmVscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZFeHBhbnNpb25QYW5lbC9WRXhwYW5zaW9uUGFuZWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFNBQVM7QUFDVCxPQUFPLHdCQUF3QixDQUFBO0FBRS9CLGFBQWE7QUFDYixPQUFPLEVBQUUsYUFBYSxFQUFxQixNQUFNLDBCQUEwQixDQUFBO0FBRzNFLFlBQVk7QUFDWixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFLN0Msb0JBQW9CO0FBQ3BCLGVBQWUsYUFBYSxDQUFDLE1BQU0sQ0FBQztJQUNsQyxJQUFJLEVBQUUsb0JBQW9CO0lBRTFCLE9BQU87UUFDTCxPQUFPO1lBQ0wsZUFBZSxFQUFFLElBQUk7U0FDdEIsQ0FBQTtJQUNILENBQUM7SUFFRCxLQUFLLEVBQUU7UUFDTCxTQUFTLEVBQUUsT0FBTztRQUNsQixRQUFRLEVBQUUsT0FBTztRQUNqQixJQUFJLEVBQUUsT0FBTztRQUNiLEtBQUssRUFBRSxPQUFPO1FBQ2QsU0FBUyxFQUFFLE9BQU87UUFDbEIsS0FBSyxFQUFFLE9BQU87UUFDZCxNQUFNLEVBQUUsT0FBTztRQUNmLFFBQVEsRUFBRSxPQUFPO1FBQ2pCLElBQUksRUFBRSxPQUFPO0tBQ2Q7SUFFRCxRQUFRLEVBQUU7UUFDUixPQUFPO1lBQ0wsT0FBTztnQkFDTCxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUNwRCxvQkFBb0IsRUFBRSxJQUFJO2dCQUMxQiwrQkFBK0IsRUFBRSxJQUFJLENBQUMsU0FBUztnQkFDL0MsMEJBQTBCLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ3JDLDJCQUEyQixFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUN2QywrQkFBK0IsRUFBRSxJQUFJLENBQUMsU0FBUztnQkFDL0MsMkJBQTJCLEVBQUUsSUFBSSxDQUFDLEtBQUs7Z0JBQ3ZDLDRCQUE0QixFQUFFLElBQUksQ0FBQyxNQUFNO2dCQUN6QywwQkFBMEIsRUFBRSxJQUFJLENBQUMsSUFBSTthQUN0QyxDQUFBO1FBQ0gsQ0FBQztLQUNGO0lBRUQsT0FBTztRQUNMLDBCQUEwQjtRQUMxQixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ3hDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFBO1NBQ3JDO1FBRUQsMEJBQTBCO1FBQzFCLElBQ0UsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUM7WUFDckIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsRUFDbEM7WUFDQSxRQUFRLENBQUMsOEJBQThCLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLENBQUE7U0FDbEU7SUFDSCxDQUFDO0lBRUQsT0FBTyxFQUFFO1FBQ1AsVUFBVSxDQUFFLElBQWlELEVBQUUsS0FBYTtZQUMxRSxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQTtZQUN4QyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUE7WUFFaEQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQ3hDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUNsRCxDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcbmltcG9ydCAnLi9WRXhwYW5zaW9uUGFuZWwuc2FzcydcblxuLy8gQ29tcG9uZW50c1xuaW1wb3J0IHsgQmFzZUl0ZW1Hcm91cCwgR3JvdXBhYmxlSW5zdGFuY2UgfSBmcm9tICcuLi9WSXRlbUdyb3VwL1ZJdGVtR3JvdXAnXG5pbXBvcnQgVkV4cGFuc2lvblBhbmVsIGZyb20gJy4vVkV4cGFuc2lvblBhbmVsJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCB7IGJyZWFraW5nIH0gZnJvbSAnLi4vLi4vdXRpbC9jb25zb2xlJ1xuXG4vLyBUeXBlc1xuaW50ZXJmYWNlIFZFeHBhbnNpb25QYW5lbEluc3RhbmNlIGV4dGVuZHMgSW5zdGFuY2VUeXBlPHR5cGVvZiBWRXhwYW5zaW9uUGFuZWw+IHt9XG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBCYXNlSXRlbUdyb3VwLmV4dGVuZCh7XG4gIG5hbWU6ICd2LWV4cGFuc2lvbi1wYW5lbHMnLFxuXG4gIHByb3ZpZGUgKCk6IG9iamVjdCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGV4cGFuc2lvblBhbmVsczogdGhpcyxcbiAgICB9XG4gIH0sXG5cbiAgcHJvcHM6IHtcbiAgICBhY2NvcmRpb246IEJvb2xlYW4sXG4gICAgZGlzYWJsZWQ6IEJvb2xlYW4sXG4gICAgZmxhdDogQm9vbGVhbixcbiAgICBob3ZlcjogQm9vbGVhbixcbiAgICBmb2N1c2FibGU6IEJvb2xlYW4sXG4gICAgaW5zZXQ6IEJvb2xlYW4sXG4gICAgcG9wb3V0OiBCb29sZWFuLFxuICAgIHJlYWRvbmx5OiBCb29sZWFuLFxuICAgIHRpbGU6IEJvb2xlYW4sXG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBjbGFzc2VzICgpOiBvYmplY3Qge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uQmFzZUl0ZW1Hcm91cC5vcHRpb25zLmNvbXB1dGVkLmNsYXNzZXMuY2FsbCh0aGlzKSxcbiAgICAgICAgJ3YtZXhwYW5zaW9uLXBhbmVscyc6IHRydWUsXG4gICAgICAgICd2LWV4cGFuc2lvbi1wYW5lbHMtLWFjY29yZGlvbic6IHRoaXMuYWNjb3JkaW9uLFxuICAgICAgICAndi1leHBhbnNpb24tcGFuZWxzLS1mbGF0JzogdGhpcy5mbGF0LFxuICAgICAgICAndi1leHBhbnNpb24tcGFuZWxzLS1ob3Zlcic6IHRoaXMuaG92ZXIsXG4gICAgICAgICd2LWV4cGFuc2lvbi1wYW5lbHMtLWZvY3VzYWJsZSc6IHRoaXMuZm9jdXNhYmxlLFxuICAgICAgICAndi1leHBhbnNpb24tcGFuZWxzLS1pbnNldCc6IHRoaXMuaW5zZXQsXG4gICAgICAgICd2LWV4cGFuc2lvbi1wYW5lbHMtLXBvcG91dCc6IHRoaXMucG9wb3V0LFxuICAgICAgICAndi1leHBhbnNpb24tcGFuZWxzLS10aWxlJzogdGhpcy50aWxlLFxuICAgICAgfVxuICAgIH0sXG4gIH0sXG5cbiAgY3JlYXRlZCAoKSB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBpZiAodGhpcy4kYXR0cnMuaGFzT3duUHJvcGVydHkoJ2V4cGFuZCcpKSB7XG4gICAgICBicmVha2luZygnZXhwYW5kJywgJ211bHRpcGxlJywgdGhpcylcbiAgICB9XG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGlmIChcbiAgICAgIEFycmF5LmlzQXJyYXkodGhpcy52YWx1ZSkgJiZcbiAgICAgIHRoaXMudmFsdWUubGVuZ3RoID4gMCAmJlxuICAgICAgdHlwZW9mIHRoaXMudmFsdWVbMF0gPT09ICdib29sZWFuJ1xuICAgICkge1xuICAgICAgYnJlYWtpbmcoJzp2YWx1ZT1cIlt0cnVlLCBmYWxzZSwgdHJ1ZV1cIicsICc6dmFsdWU9XCJbMCwgMl1cIicsIHRoaXMpXG4gICAgfVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICB1cGRhdGVJdGVtIChpdGVtOiBHcm91cGFibGVJbnN0YW5jZSAmIFZFeHBhbnNpb25QYW5lbEluc3RhbmNlLCBpbmRleDogbnVtYmVyKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZ2V0VmFsdWUoaXRlbSwgaW5kZXgpXG4gICAgICBjb25zdCBuZXh0VmFsdWUgPSB0aGlzLmdldFZhbHVlKGl0ZW0sIGluZGV4ICsgMSlcblxuICAgICAgaXRlbS5pc0FjdGl2ZSA9IHRoaXMudG9nZ2xlTWV0aG9kKHZhbHVlKVxuICAgICAgaXRlbS5uZXh0SXNBY3RpdmUgPSB0aGlzLnRvZ2dsZU1ldGhvZChuZXh0VmFsdWUpXG4gICAgfSxcbiAgfSxcbn0pXG4iXX0=