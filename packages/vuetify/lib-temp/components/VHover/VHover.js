// Mixins
import Delayable from '../../mixins/delayable';
import Toggleable from '../../mixins/toggleable';
// Utilities
import mixins from '../../util/mixins';
import { consoleWarn } from '../../util/console';
export default mixins(Delayable, Toggleable
/* @vue/component */
).extend({
    name: 'v-hover',
    props: {
        disabled: {
            type: Boolean,
            default: false,
        },
        value: {
            type: Boolean,
            default: undefined,
        },
    },
    methods: {
        onMouseEnter() {
            this.runDelay('open');
        },
        onMouseLeave() {
            this.runDelay('close');
        },
    },
    render() {
        if (!this.$scopedSlots.default && this.value === undefined) {
            consoleWarn('v-hover is missing a default scopedSlot or bound value', this);
            return null;
        }
        let element;
        /* istanbul ignore else */
        if (this.$scopedSlots.default) {
            element = this.$scopedSlots.default({ hover: this.isActive });
        }
        if (Array.isArray(element) && element.length === 1) {
            element = element[0];
        }
        if (!element || Array.isArray(element) || !element.tag) {
            consoleWarn('v-hover should only contain a single element', this);
            return element;
        }
        if (!this.disabled) {
            element.data = element.data || {};
            this._g(element.data, {
                mouseenter: this.onMouseEnter,
                mouseleave: this.onMouseLeave,
            });
        }
        return element;
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkhvdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkhvdmVyL1ZIb3Zlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFFaEQsWUFBWTtBQUNaLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBQ3RDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUtoRCxlQUFlLE1BQU0sQ0FDbkIsU0FBUyxFQUNULFVBQVU7QUFDVixvQkFBb0I7Q0FDckIsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUsU0FBUztJQUVmLEtBQUssRUFBRTtRQUNMLFFBQVEsRUFBRTtZQUNSLElBQUksRUFBRSxPQUFPO1lBQ2IsT0FBTyxFQUFFLEtBQUs7U0FDZjtRQUNELEtBQUssRUFBRTtZQUNMLElBQUksRUFBRSxPQUFPO1lBQ2IsT0FBTyxFQUFFLFNBQVM7U0FDbkI7S0FDRjtJQUVELE9BQU8sRUFBRTtRQUNQLFlBQVk7WUFDVixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ3ZCLENBQUM7UUFDRCxZQUFZO1lBQ1YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUN4QixDQUFDO0tBQ0Y7SUFFRCxNQUFNO1FBQ0osSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQzFELFdBQVcsQ0FBQyx3REFBd0QsRUFBRSxJQUFJLENBQUMsQ0FBQTtZQUUzRSxPQUFPLElBQVcsQ0FBQTtTQUNuQjtRQUVELElBQUksT0FBbUMsQ0FBQTtRQUV2QywwQkFBMEI7UUFDMUIsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRTtZQUM3QixPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7U0FDOUQ7UUFFRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDbEQsT0FBTyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQTtTQUNyQjtRQUVELElBQUksQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUU7WUFDdEQsV0FBVyxDQUFDLDhDQUE4QyxFQUFFLElBQUksQ0FBQyxDQUFBO1lBRWpFLE9BQU8sT0FBYyxDQUFBO1NBQ3RCO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEIsT0FBTyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQTtZQUNqQyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUU7Z0JBQ3BCLFVBQVUsRUFBRSxJQUFJLENBQUMsWUFBWTtnQkFDN0IsVUFBVSxFQUFFLElBQUksQ0FBQyxZQUFZO2FBQzlCLENBQUMsQ0FBQTtTQUNIO1FBRUQsT0FBTyxPQUFPLENBQUE7SUFDaEIsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIE1peGluc1xuaW1wb3J0IERlbGF5YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvZGVsYXlhYmxlJ1xuaW1wb3J0IFRvZ2dsZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RvZ2dsZWFibGUnXG5cbi8vIFV0aWxpdGllc1xuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcbmltcG9ydCB7IGNvbnNvbGVXYXJuIH0gZnJvbSAnLi4vLi4vdXRpbC9jb25zb2xlJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgVk5vZGUsIFNjb3BlZFNsb3RDaGlsZHJlbiB9IGZyb20gJ3Z1ZS90eXBlcy92bm9kZSdcblxuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFxuICBEZWxheWFibGUsXG4gIFRvZ2dsZWFibGVcbiAgLyogQHZ1ZS9jb21wb25lbnQgKi9cbikuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtaG92ZXInLFxuXG4gIHByb3BzOiB7XG4gICAgZGlzYWJsZWQ6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB9LFxuICAgIHZhbHVlOiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgIH0sXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIG9uTW91c2VFbnRlciAoKSB7XG4gICAgICB0aGlzLnJ1bkRlbGF5KCdvcGVuJylcbiAgICB9LFxuICAgIG9uTW91c2VMZWF2ZSAoKSB7XG4gICAgICB0aGlzLnJ1bkRlbGF5KCdjbG9zZScpXG4gICAgfSxcbiAgfSxcblxuICByZW5kZXIgKCk6IFZOb2RlIHtcbiAgICBpZiAoIXRoaXMuJHNjb3BlZFNsb3RzLmRlZmF1bHQgJiYgdGhpcy52YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zb2xlV2Fybigndi1ob3ZlciBpcyBtaXNzaW5nIGEgZGVmYXVsdCBzY29wZWRTbG90IG9yIGJvdW5kIHZhbHVlJywgdGhpcylcblxuICAgICAgcmV0dXJuIG51bGwgYXMgYW55XG4gICAgfVxuXG4gICAgbGV0IGVsZW1lbnQ6IFZOb2RlIHwgU2NvcGVkU2xvdENoaWxkcmVuXG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgIGlmICh0aGlzLiRzY29wZWRTbG90cy5kZWZhdWx0KSB7XG4gICAgICBlbGVtZW50ID0gdGhpcy4kc2NvcGVkU2xvdHMuZGVmYXVsdCh7IGhvdmVyOiB0aGlzLmlzQWN0aXZlIH0pXG4gICAgfVxuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZWxlbWVudCkgJiYgZWxlbWVudC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGVsZW1lbnQgPSBlbGVtZW50WzBdXG4gICAgfVxuXG4gICAgaWYgKCFlbGVtZW50IHx8IEFycmF5LmlzQXJyYXkoZWxlbWVudCkgfHwgIWVsZW1lbnQudGFnKSB7XG4gICAgICBjb25zb2xlV2Fybigndi1ob3ZlciBzaG91bGQgb25seSBjb250YWluIGEgc2luZ2xlIGVsZW1lbnQnLCB0aGlzKVxuXG4gICAgICByZXR1cm4gZWxlbWVudCBhcyBhbnlcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIGVsZW1lbnQuZGF0YSA9IGVsZW1lbnQuZGF0YSB8fCB7fVxuICAgICAgdGhpcy5fZyhlbGVtZW50LmRhdGEsIHtcbiAgICAgICAgbW91c2VlbnRlcjogdGhpcy5vbk1vdXNlRW50ZXIsXG4gICAgICAgIG1vdXNlbGVhdmU6IHRoaXMub25Nb3VzZUxlYXZlLFxuICAgICAgfSlcbiAgICB9XG5cbiAgICByZXR1cm4gZWxlbWVudFxuICB9LFxufSlcbiJdfQ==