import Vue from 'vue';
export default Vue.extend({
    name: 'elevatable',
    props: {
        elevation: [Number, String],
    },
    computed: {
        computedElevation() {
            return this.elevation;
        },
        elevationClasses() {
            const elevation = this.computedElevation;
            if (elevation == null)
                return {};
            if (isNaN(parseInt(elevation)))
                return {};
            return { [`elevation-${this.elevation}`]: true };
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL2VsZXZhdGFibGUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxHQUFHLE1BQU0sS0FBSyxDQUFBO0FBRXJCLGVBQWUsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUN4QixJQUFJLEVBQUUsWUFBWTtJQUVsQixLQUFLLEVBQUU7UUFDTCxTQUFTLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO0tBQzVCO0lBRUQsUUFBUSxFQUFFO1FBQ1IsaUJBQWlCO1lBQ2YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFBO1FBQ3ZCLENBQUM7UUFDRCxnQkFBZ0I7WUFDZCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUE7WUFFeEMsSUFBSSxTQUFTLElBQUksSUFBSTtnQkFBRSxPQUFPLEVBQUUsQ0FBQTtZQUNoQyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQUUsT0FBTyxFQUFFLENBQUE7WUFDekMsT0FBTyxFQUFFLENBQUMsYUFBYSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQTtRQUNsRCxDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVnVlIGZyb20gJ3Z1ZSdcblxuZXhwb3J0IGRlZmF1bHQgVnVlLmV4dGVuZCh7XG4gIG5hbWU6ICdlbGV2YXRhYmxlJyxcblxuICBwcm9wczoge1xuICAgIGVsZXZhdGlvbjogW051bWJlciwgU3RyaW5nXSxcbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGNvbXB1dGVkRWxldmF0aW9uICgpOiBzdHJpbmcgfCBudW1iZXIgfCB1bmRlZmluZWQge1xuICAgICAgcmV0dXJuIHRoaXMuZWxldmF0aW9uXG4gICAgfSxcbiAgICBlbGV2YXRpb25DbGFzc2VzICgpOiBSZWNvcmQ8c3RyaW5nLCBib29sZWFuPiB7XG4gICAgICBjb25zdCBlbGV2YXRpb24gPSB0aGlzLmNvbXB1dGVkRWxldmF0aW9uXG5cbiAgICAgIGlmIChlbGV2YXRpb24gPT0gbnVsbCkgcmV0dXJuIHt9XG4gICAgICBpZiAoaXNOYU4ocGFyc2VJbnQoZWxldmF0aW9uKSkpIHJldHVybiB7fVxuICAgICAgcmV0dXJuIHsgW2BlbGV2YXRpb24tJHt0aGlzLmVsZXZhdGlvbn1gXTogdHJ1ZSB9XG4gICAgfSxcbiAgfSxcbn0pXG4iXX0=