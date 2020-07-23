import { deprecate } from '../../util/console';
import Vue from 'vue';
/* @vue/component */
export default Vue.extend({
    name: 'mobile',
    props: {
        mobileBreakpoint: {
            type: [Number, String],
            default() {
                // Avoid destroying unit
                // tests for users
                return this.$vuetify
                    ? this.$vuetify.breakpoint.mobileBreakpoint
                    : undefined;
            },
            validator: v => (!isNaN(Number(v)) ||
                ['xs', 'sm', 'md', 'lg', 'xl'].includes(String(v))),
        },
    },
    computed: {
        isMobile() {
            const { mobile, width, name, mobileBreakpoint, } = this.$vuetify.breakpoint;
            // Check if local mobileBreakpoint matches
            // the application's mobileBreakpoint
            if (mobileBreakpoint === this.mobileBreakpoint)
                return mobile;
            const mobileWidth = parseInt(this.mobileBreakpoint, 10);
            const isNumber = !isNaN(mobileWidth);
            return isNumber
                ? width < mobileWidth
                : name === this.mobileBreakpoint;
        },
    },
    created() {
        /* istanbul ignore next */
        if (this.$attrs.hasOwnProperty('mobile-break-point')) {
            deprecate('mobile-break-point', 'mobile-breakpoint', this);
        }
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL21vYmlsZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFDOUMsT0FBTyxHQUFpQixNQUFNLEtBQUssQ0FBQTtBQUVuQyxvQkFBb0I7QUFDcEIsZUFBZSxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQ3hCLElBQUksRUFBRSxRQUFRO0lBRWQsS0FBSyxFQUFFO1FBQ0wsZ0JBQWdCLEVBQUU7WUFDaEIsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBNkI7WUFDbEQsT0FBTztnQkFDTCx3QkFBd0I7Z0JBQ3hCLGtCQUFrQjtnQkFDbEIsT0FBTyxJQUFJLENBQUMsUUFBUTtvQkFDbEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLGdCQUFnQjtvQkFDM0MsQ0FBQyxDQUFDLFNBQVMsQ0FBQTtZQUNmLENBQUM7WUFDRCxTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUNkLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNuRDtTQUNGO0tBQ0Y7SUFFRCxRQUFRLEVBQUU7UUFDUixRQUFRO1lBQ04sTUFBTSxFQUNKLE1BQU0sRUFDTixLQUFLLEVBQ0wsSUFBSSxFQUNKLGdCQUFnQixHQUNqQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFBO1lBRTVCLDBDQUEwQztZQUMxQyxxQ0FBcUM7WUFDckMsSUFBSSxnQkFBZ0IsS0FBSyxJQUFJLENBQUMsZ0JBQWdCO2dCQUFFLE9BQU8sTUFBTSxDQUFBO1lBRTdELE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxDQUFDLENBQUE7WUFDdkQsTUFBTSxRQUFRLEdBQUcsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUE7WUFFcEMsT0FBTyxRQUFRO2dCQUNiLENBQUMsQ0FBQyxLQUFLLEdBQUcsV0FBVztnQkFDckIsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsZ0JBQWdCLENBQUE7UUFDcEMsQ0FBQztLQUNGO0lBRUQsT0FBTztRQUNMLDBCQUEwQjtRQUMxQixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLG9CQUFvQixDQUFDLEVBQUU7WUFDcEQsU0FBUyxDQUFDLG9CQUFvQixFQUFFLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFBO1NBQzNEO0lBQ0gsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFR5cGVzXG5pbXBvcnQgeyBCcmVha3BvaW50TmFtZSB9IGZyb20gJ3Z1ZXRpZnkvdHlwZXMvc2VydmljZXMvYnJlYWtwb2ludCdcbmltcG9ydCB7IGRlcHJlY2F0ZSB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcbmltcG9ydCBWdWUsIHsgUHJvcFR5cGUgfSBmcm9tICd2dWUnXG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBWdWUuZXh0ZW5kKHtcbiAgbmFtZTogJ21vYmlsZScsXG5cbiAgcHJvcHM6IHtcbiAgICBtb2JpbGVCcmVha3BvaW50OiB7XG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddIGFzIFByb3BUeXBlPEJyZWFrcG9pbnROYW1lPixcbiAgICAgIGRlZmF1bHQgKCk6IEJyZWFrcG9pbnROYW1lIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgLy8gQXZvaWQgZGVzdHJveWluZyB1bml0XG4gICAgICAgIC8vIHRlc3RzIGZvciB1c2Vyc1xuICAgICAgICByZXR1cm4gdGhpcy4kdnVldGlmeVxuICAgICAgICAgID8gdGhpcy4kdnVldGlmeS5icmVha3BvaW50Lm1vYmlsZUJyZWFrcG9pbnRcbiAgICAgICAgICA6IHVuZGVmaW5lZFxuICAgICAgfSxcbiAgICAgIHZhbGlkYXRvcjogdiA9PiAoXG4gICAgICAgICFpc05hTihOdW1iZXIodikpIHx8XG4gICAgICAgIFsneHMnLCAnc20nLCAnbWQnLCAnbGcnLCAneGwnXS5pbmNsdWRlcyhTdHJpbmcodikpXG4gICAgICApLFxuICAgIH0sXG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBpc01vYmlsZSAoKTogYm9vbGVhbiB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIG1vYmlsZSxcbiAgICAgICAgd2lkdGgsXG4gICAgICAgIG5hbWUsXG4gICAgICAgIG1vYmlsZUJyZWFrcG9pbnQsXG4gICAgICB9ID0gdGhpcy4kdnVldGlmeS5icmVha3BvaW50XG5cbiAgICAgIC8vIENoZWNrIGlmIGxvY2FsIG1vYmlsZUJyZWFrcG9pbnQgbWF0Y2hlc1xuICAgICAgLy8gdGhlIGFwcGxpY2F0aW9uJ3MgbW9iaWxlQnJlYWtwb2ludFxuICAgICAgaWYgKG1vYmlsZUJyZWFrcG9pbnQgPT09IHRoaXMubW9iaWxlQnJlYWtwb2ludCkgcmV0dXJuIG1vYmlsZVxuXG4gICAgICBjb25zdCBtb2JpbGVXaWR0aCA9IHBhcnNlSW50KHRoaXMubW9iaWxlQnJlYWtwb2ludCwgMTApXG4gICAgICBjb25zdCBpc051bWJlciA9ICFpc05hTihtb2JpbGVXaWR0aClcblxuICAgICAgcmV0dXJuIGlzTnVtYmVyXG4gICAgICAgID8gd2lkdGggPCBtb2JpbGVXaWR0aFxuICAgICAgICA6IG5hbWUgPT09IHRoaXMubW9iaWxlQnJlYWtwb2ludFxuICAgIH0sXG4gIH0sXG5cbiAgY3JlYXRlZCAoKSB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBpZiAodGhpcy4kYXR0cnMuaGFzT3duUHJvcGVydHkoJ21vYmlsZS1icmVhay1wb2ludCcpKSB7XG4gICAgICBkZXByZWNhdGUoJ21vYmlsZS1icmVhay1wb2ludCcsICdtb2JpbGUtYnJlYWtwb2ludCcsIHRoaXMpXG4gICAgfVxuICB9LFxufSlcbiJdfQ==