import Vue from 'vue';
/**
 * Delayable
 *
 * @mixin
 *
 * Changes the open or close delay time for elements
 */
export default Vue.extend().extend({
    name: 'delayable',
    props: {
        openDelay: {
            type: [Number, String],
            default: 0,
        },
        closeDelay: {
            type: [Number, String],
            default: 0,
        },
    },
    data: () => ({
        openTimeout: undefined,
        closeTimeout: undefined,
    }),
    methods: {
        /**
         * Clear any pending delay timers from executing
         */
        clearDelay() {
            clearTimeout(this.openTimeout);
            clearTimeout(this.closeTimeout);
        },
        /**
         * Runs callback after a specified delay
         */
        runDelay(type, cb) {
            this.clearDelay();
            const delay = parseInt(this[`${type}Delay`], 10);
            this[`${type}Timeout`] = setTimeout(cb || (() => {
                this.isActive = { open: true, close: false }[type];
            }), delay);
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL2RlbGF5YWJsZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEdBQUcsTUFBTSxLQUFLLENBQUE7QUFFckI7Ozs7OztHQU1HO0FBQ0gsZUFBZSxHQUFHLENBQUMsTUFBTSxFQUFnQyxDQUFDLE1BQU0sQ0FBQztJQUMvRCxJQUFJLEVBQUUsV0FBVztJQUVqQixLQUFLLEVBQUU7UUFDTCxTQUFTLEVBQUU7WUFDVCxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxDQUFDO1NBQ1g7UUFDRCxVQUFVLEVBQUU7WUFDVixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxDQUFDO1NBQ1g7S0FDRjtJQUVELElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ1gsV0FBVyxFQUFFLFNBQStCO1FBQzVDLFlBQVksRUFBRSxTQUErQjtLQUM5QyxDQUFDO0lBRUYsT0FBTyxFQUFFO1FBQ1A7O1dBRUc7UUFDSCxVQUFVO1lBQ1IsWUFBWSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTtZQUM5QixZQUFZLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBO1FBQ2pDLENBQUM7UUFDRDs7V0FFRztRQUNILFFBQVEsQ0FBRSxJQUFzQixFQUFFLEVBQWU7WUFDL0MsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO1lBRWpCLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBRSxJQUFZLENBQUMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUV4RDtZQUFDLElBQVksQ0FBQyxHQUFHLElBQUksU0FBUyxDQUFDLEdBQUcsVUFBVSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDeEQsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ3BELENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFBO1FBQ1osQ0FBQztLQUNGO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZ1ZSBmcm9tICd2dWUnXG5cbi8qKlxuICogRGVsYXlhYmxlXG4gKlxuICogQG1peGluXG4gKlxuICogQ2hhbmdlcyB0aGUgb3BlbiBvciBjbG9zZSBkZWxheSB0aW1lIGZvciBlbGVtZW50c1xuICovXG5leHBvcnQgZGVmYXVsdCBWdWUuZXh0ZW5kPFZ1ZSAmIHsgaXNBY3RpdmU/OiBib29sZWFuIH0+KCkuZXh0ZW5kKHtcbiAgbmFtZTogJ2RlbGF5YWJsZScsXG5cbiAgcHJvcHM6IHtcbiAgICBvcGVuRGVsYXk6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gICAgY2xvc2VEZWxheToge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgfSxcblxuICBkYXRhOiAoKSA9PiAoe1xuICAgIG9wZW5UaW1lb3V0OiB1bmRlZmluZWQgYXMgbnVtYmVyIHwgdW5kZWZpbmVkLFxuICAgIGNsb3NlVGltZW91dDogdW5kZWZpbmVkIGFzIG51bWJlciB8IHVuZGVmaW5lZCxcbiAgfSksXG5cbiAgbWV0aG9kczoge1xuICAgIC8qKlxuICAgICAqIENsZWFyIGFueSBwZW5kaW5nIGRlbGF5IHRpbWVycyBmcm9tIGV4ZWN1dGluZ1xuICAgICAqL1xuICAgIGNsZWFyRGVsYXkgKCk6IHZvaWQge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMub3BlblRpbWVvdXQpXG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5jbG9zZVRpbWVvdXQpXG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBSdW5zIGNhbGxiYWNrIGFmdGVyIGEgc3BlY2lmaWVkIGRlbGF5XG4gICAgICovXG4gICAgcnVuRGVsYXkgKHR5cGU6ICdvcGVuJyB8ICdjbG9zZScsIGNiPzogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgICAgdGhpcy5jbGVhckRlbGF5KClcblxuICAgICAgY29uc3QgZGVsYXkgPSBwYXJzZUludCgodGhpcyBhcyBhbnkpW2Ake3R5cGV9RGVsYXlgXSwgMTApXG5cbiAgICAgIDsodGhpcyBhcyBhbnkpW2Ake3R5cGV9VGltZW91dGBdID0gc2V0VGltZW91dChjYiB8fCAoKCkgPT4ge1xuICAgICAgICB0aGlzLmlzQWN0aXZlID0geyBvcGVuOiB0cnVlLCBjbG9zZTogZmFsc2UgfVt0eXBlXVxuICAgICAgfSksIGRlbGF5KVxuICAgIH0sXG4gIH0sXG59KVxuIl19