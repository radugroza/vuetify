import { factory as PositionableFactory } from '../positionable';
// Util
import mixins from '../../util/mixins';
export default function applicationable(value, events = []) {
    /* @vue/component */
    return mixins(PositionableFactory(['absolute', 'fixed'])).extend({
        name: 'applicationable',
        props: {
            app: Boolean,
        },
        computed: {
            applicationProperty() {
                return value;
            },
        },
        watch: {
            // If previous value was app
            // reset the provided prop
            app(x, prev) {
                prev
                    ? this.removeApplication(true)
                    : this.callUpdate();
            },
            applicationProperty(newVal, oldVal) {
                this.$vuetify.application.unregister(this._uid, oldVal);
            },
        },
        activated() {
            this.callUpdate();
        },
        created() {
            for (let i = 0, length = events.length; i < length; i++) {
                this.$watch(events[i], this.callUpdate);
            }
            this.callUpdate();
        },
        mounted() {
            this.callUpdate();
        },
        deactivated() {
            this.removeApplication();
        },
        destroyed() {
            this.removeApplication();
        },
        methods: {
            callUpdate() {
                if (!this.app)
                    return;
                this.$vuetify.application.register(this._uid, this.applicationProperty, this.updateApplication());
            },
            removeApplication(force = false) {
                if (!force && !this.app)
                    return;
                this.$vuetify.application.unregister(this._uid, this.applicationProperty);
            },
            updateApplication: () => 0,
        },
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL2FwcGxpY2F0aW9uYWJsZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsT0FBTyxJQUFJLG1CQUFtQixFQUFFLE1BQU0saUJBQWlCLENBQUE7QUFHaEUsT0FBTztBQUNQLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBRXRDLE1BQU0sQ0FBQyxPQUFPLFVBQVUsZUFBZSxDQUFFLEtBQWlCLEVBQUUsU0FBbUIsRUFBRTtJQUMvRSxvQkFBb0I7SUFDcEIsT0FBTyxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUMvRCxJQUFJLEVBQUUsaUJBQWlCO1FBRXZCLEtBQUssRUFBRTtZQUNMLEdBQUcsRUFBRSxPQUFPO1NBQ2I7UUFFRCxRQUFRLEVBQUU7WUFDUixtQkFBbUI7Z0JBQ2pCLE9BQU8sS0FBSyxDQUFBO1lBQ2QsQ0FBQztTQUNGO1FBRUQsS0FBSyxFQUFFO1lBQ0wsNEJBQTRCO1lBQzVCLDBCQUEwQjtZQUMxQixHQUFHLENBQUUsQ0FBVSxFQUFFLElBQWE7Z0JBQzVCLElBQUk7b0JBQ0YsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUM7b0JBQzlCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7WUFDdkIsQ0FBQztZQUNELG1CQUFtQixDQUFFLE1BQU0sRUFBRSxNQUFNO2dCQUNqQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQTtZQUN6RCxDQUFDO1NBQ0Y7UUFFRCxTQUFTO1lBQ1AsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO1FBQ25CLENBQUM7UUFFRCxPQUFPO1lBQ0wsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDdkQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO2FBQ3hDO1lBQ0QsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO1FBQ25CLENBQUM7UUFFRCxPQUFPO1lBQ0wsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO1FBQ25CLENBQUM7UUFFRCxXQUFXO1lBQ1QsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDMUIsQ0FBQztRQUVELFNBQVM7WUFDUCxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUMxQixDQUFDO1FBRUQsT0FBTyxFQUFFO1lBQ1AsVUFBVTtnQkFDUixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUc7b0JBQUUsT0FBTTtnQkFFckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUNoQyxJQUFJLENBQUMsSUFBSSxFQUNULElBQUksQ0FBQyxtQkFBbUIsRUFDeEIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQ3pCLENBQUE7WUFDSCxDQUFDO1lBQ0QsaUJBQWlCLENBQUUsS0FBSyxHQUFHLEtBQUs7Z0JBQzlCLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRztvQkFBRSxPQUFNO2dCQUUvQixJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQ2xDLElBQUksQ0FBQyxJQUFJLEVBQ1QsSUFBSSxDQUFDLG1CQUFtQixDQUN6QixDQUFBO1lBQ0gsQ0FBQztZQUNELGlCQUFpQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7U0FDM0I7S0FDRixDQUFDLENBQUE7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZmFjdG9yeSBhcyBQb3NpdGlvbmFibGVGYWN0b3J5IH0gZnJvbSAnLi4vcG9zaXRpb25hYmxlJ1xuaW1wb3J0IHsgVGFyZ2V0UHJvcCB9IGZyb20gJ3Z1ZXRpZnkvdHlwZXMvc2VydmljZXMvYXBwbGljYXRpb24nXG5cbi8vIFV0aWxcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFwcGxpY2F0aW9uYWJsZSAodmFsdWU6IFRhcmdldFByb3AsIGV2ZW50czogc3RyaW5nW10gPSBbXSkge1xuICAvKiBAdnVlL2NvbXBvbmVudCAqL1xuICByZXR1cm4gbWl4aW5zKFBvc2l0aW9uYWJsZUZhY3RvcnkoWydhYnNvbHV0ZScsICdmaXhlZCddKSkuZXh0ZW5kKHtcbiAgICBuYW1lOiAnYXBwbGljYXRpb25hYmxlJyxcblxuICAgIHByb3BzOiB7XG4gICAgICBhcHA6IEJvb2xlYW4sXG4gICAgfSxcblxuICAgIGNvbXB1dGVkOiB7XG4gICAgICBhcHBsaWNhdGlvblByb3BlcnR5ICgpOiBUYXJnZXRQcm9wIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlXG4gICAgICB9LFxuICAgIH0sXG5cbiAgICB3YXRjaDoge1xuICAgICAgLy8gSWYgcHJldmlvdXMgdmFsdWUgd2FzIGFwcFxuICAgICAgLy8gcmVzZXQgdGhlIHByb3ZpZGVkIHByb3BcbiAgICAgIGFwcCAoeDogYm9vbGVhbiwgcHJldjogYm9vbGVhbikge1xuICAgICAgICBwcmV2XG4gICAgICAgICAgPyB0aGlzLnJlbW92ZUFwcGxpY2F0aW9uKHRydWUpXG4gICAgICAgICAgOiB0aGlzLmNhbGxVcGRhdGUoKVxuICAgICAgfSxcbiAgICAgIGFwcGxpY2F0aW9uUHJvcGVydHkgKG5ld1ZhbCwgb2xkVmFsKSB7XG4gICAgICAgIHRoaXMuJHZ1ZXRpZnkuYXBwbGljYXRpb24udW5yZWdpc3Rlcih0aGlzLl91aWQsIG9sZFZhbClcbiAgICAgIH0sXG4gICAgfSxcblxuICAgIGFjdGl2YXRlZCAoKSB7XG4gICAgICB0aGlzLmNhbGxVcGRhdGUoKVxuICAgIH0sXG5cbiAgICBjcmVhdGVkICgpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSBldmVudHMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy4kd2F0Y2goZXZlbnRzW2ldLCB0aGlzLmNhbGxVcGRhdGUpXG4gICAgICB9XG4gICAgICB0aGlzLmNhbGxVcGRhdGUoKVxuICAgIH0sXG5cbiAgICBtb3VudGVkICgpIHtcbiAgICAgIHRoaXMuY2FsbFVwZGF0ZSgpXG4gICAgfSxcblxuICAgIGRlYWN0aXZhdGVkICgpIHtcbiAgICAgIHRoaXMucmVtb3ZlQXBwbGljYXRpb24oKVxuICAgIH0sXG5cbiAgICBkZXN0cm95ZWQgKCkge1xuICAgICAgdGhpcy5yZW1vdmVBcHBsaWNhdGlvbigpXG4gICAgfSxcblxuICAgIG1ldGhvZHM6IHtcbiAgICAgIGNhbGxVcGRhdGUgKCkge1xuICAgICAgICBpZiAoIXRoaXMuYXBwKSByZXR1cm5cblxuICAgICAgICB0aGlzLiR2dWV0aWZ5LmFwcGxpY2F0aW9uLnJlZ2lzdGVyKFxuICAgICAgICAgIHRoaXMuX3VpZCxcbiAgICAgICAgICB0aGlzLmFwcGxpY2F0aW9uUHJvcGVydHksXG4gICAgICAgICAgdGhpcy51cGRhdGVBcHBsaWNhdGlvbigpXG4gICAgICAgIClcbiAgICAgIH0sXG4gICAgICByZW1vdmVBcHBsaWNhdGlvbiAoZm9yY2UgPSBmYWxzZSkge1xuICAgICAgICBpZiAoIWZvcmNlICYmICF0aGlzLmFwcCkgcmV0dXJuXG5cbiAgICAgICAgdGhpcy4kdnVldGlmeS5hcHBsaWNhdGlvbi51bnJlZ2lzdGVyKFxuICAgICAgICAgIHRoaXMuX3VpZCxcbiAgICAgICAgICB0aGlzLmFwcGxpY2F0aW9uUHJvcGVydHlcbiAgICAgICAgKVxuICAgICAgfSxcbiAgICAgIHVwZGF0ZUFwcGxpY2F0aW9uOiAoKSA9PiAwLFxuICAgIH0sXG4gIH0pXG59XG4iXX0=