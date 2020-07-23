import Vue from 'vue';
import { deepEqual } from '../../util/helpers';
export default Vue.extend({
    name: 'comparable',
    props: {
        valueComparator: {
            type: Function,
            default: deepEqual,
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL2NvbXBhcmFibGUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxHQUFpQixNQUFNLEtBQUssQ0FBQTtBQUNuQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFFOUMsZUFBZSxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQ3hCLElBQUksRUFBRSxZQUFZO0lBQ2xCLEtBQUssRUFBRTtRQUNMLGVBQWUsRUFBRTtZQUNmLElBQUksRUFBRSxRQUFzQztZQUM1QyxPQUFPLEVBQUUsU0FBUztTQUNuQjtLQUNGO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZ1ZSwgeyBQcm9wVHlwZSB9IGZyb20gJ3Z1ZSdcbmltcG9ydCB7IGRlZXBFcXVhbCB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcblxuZXhwb3J0IGRlZmF1bHQgVnVlLmV4dGVuZCh7XG4gIG5hbWU6ICdjb21wYXJhYmxlJyxcbiAgcHJvcHM6IHtcbiAgICB2YWx1ZUNvbXBhcmF0b3I6IHtcbiAgICAgIHR5cGU6IEZ1bmN0aW9uIGFzIFByb3BUeXBlPHR5cGVvZiBkZWVwRXF1YWw+LFxuICAgICAgZGVmYXVsdDogZGVlcEVxdWFsLFxuICAgIH0sXG4gIH0sXG59KVxuIl19