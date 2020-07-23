// Styles
import './VSystemBar.sass';
// Mixins
import Applicationable from '../../mixins/applicationable';
import Colorable from '../../mixins/colorable';
import Themeable from '../../mixins/themeable';
// Utilities
import mixins from '../../util/mixins';
import { convertToUnit, getSlot } from '../../util/helpers';
export default mixins(Applicationable('bar', [
    'height',
    'window',
]), Colorable, Themeable
/* @vue/component */
).extend({
    name: 'v-system-bar',
    props: {
        height: [Number, String],
        lightsOut: Boolean,
        window: Boolean,
    },
    computed: {
        classes() {
            return {
                'v-system-bar--lights-out': this.lightsOut,
                'v-system-bar--absolute': this.absolute,
                'v-system-bar--fixed': !this.absolute && (this.app || this.fixed),
                'v-system-bar--window': this.window,
                ...this.themeClasses,
            };
        },
        computedHeight() {
            if (this.height) {
                return isNaN(parseInt(this.height)) ? this.height : parseInt(this.height);
            }
            return this.window ? 32 : 24;
        },
        styles() {
            return {
                height: convertToUnit(this.computedHeight),
            };
        },
    },
    methods: {
        updateApplication() {
            return this.$el
                ? this.$el.clientHeight
                : this.computedHeight;
        },
    },
    render(h) {
        const data = {
            staticClass: 'v-system-bar',
            class: this.classes,
            style: this.styles,
            on: this.$listeners,
        };
        return h('div', this.setBackgroundColor(this.color, data), getSlot(this));
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlN5c3RlbUJhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZTeXN0ZW1CYXIvVlN5c3RlbUJhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxtQkFBbUIsQ0FBQTtBQUUxQixTQUFTO0FBQ1QsT0FBTyxlQUFlLE1BQU0sOEJBQThCLENBQUE7QUFDMUQsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFFOUMsWUFBWTtBQUNaLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBQ3RDLE9BQU8sRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFLM0QsZUFBZSxNQUFNLENBQ25CLGVBQWUsQ0FBQyxLQUFLLEVBQUU7SUFDckIsUUFBUTtJQUNSLFFBQVE7Q0FDVCxDQUFDLEVBQ0YsU0FBUyxFQUNULFNBQVM7QUFDWCxvQkFBb0I7Q0FDbkIsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUsY0FBYztJQUVwQixLQUFLLEVBQUU7UUFDTCxNQUFNLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1FBQ3hCLFNBQVMsRUFBRSxPQUFPO1FBQ2xCLE1BQU0sRUFBRSxPQUFPO0tBQ2hCO0lBRUQsUUFBUSxFQUFFO1FBQ1IsT0FBTztZQUNMLE9BQU87Z0JBQ0wsMEJBQTBCLEVBQUUsSUFBSSxDQUFDLFNBQVM7Z0JBQzFDLHdCQUF3QixFQUFFLElBQUksQ0FBQyxRQUFRO2dCQUN2QyxxQkFBcUIsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQ2pFLHNCQUFzQixFQUFFLElBQUksQ0FBQyxNQUFNO2dCQUNuQyxHQUFHLElBQUksQ0FBQyxZQUFZO2FBQ3JCLENBQUE7UUFDSCxDQUFDO1FBQ0QsY0FBYztZQUNaLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDZixPQUFPLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7YUFDMUU7WUFFRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFBO1FBQzlCLENBQUM7UUFDRCxNQUFNO1lBQ0osT0FBTztnQkFDTCxNQUFNLEVBQUUsYUFBYSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7YUFDM0MsQ0FBQTtRQUNILENBQUM7S0FDRjtJQUVELE9BQU8sRUFBRTtRQUNQLGlCQUFpQjtZQUNmLE9BQU8sSUFBSSxDQUFDLEdBQUc7Z0JBQ2IsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWTtnQkFDdkIsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUE7UUFDekIsQ0FBQztLQUNGO0lBRUQsTUFBTSxDQUFFLENBQUM7UUFDUCxNQUFNLElBQUksR0FBRztZQUNYLFdBQVcsRUFBRSxjQUFjO1lBQzNCLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTztZQUNuQixLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbEIsRUFBRSxFQUFFLElBQUksQ0FBQyxVQUFVO1NBQ3BCLENBQUE7UUFFRCxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7SUFDM0UsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xuaW1wb3J0ICcuL1ZTeXN0ZW1CYXIuc2FzcydcblxuLy8gTWl4aW5zXG5pbXBvcnQgQXBwbGljYXRpb25hYmxlIGZyb20gJy4uLy4uL21peGlucy9hcHBsaWNhdGlvbmFibGUnXG5pbXBvcnQgQ29sb3JhYmxlIGZyb20gJy4uLy4uL21peGlucy9jb2xvcmFibGUnXG5pbXBvcnQgVGhlbWVhYmxlIGZyb20gJy4uLy4uL21peGlucy90aGVtZWFibGUnXG5cbi8vIFV0aWxpdGllc1xuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcbmltcG9ydCB7IGNvbnZlcnRUb1VuaXQsIGdldFNsb3QgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZS90eXBlcydcblxuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFxuICBBcHBsaWNhdGlvbmFibGUoJ2JhcicsIFtcbiAgICAnaGVpZ2h0JyxcbiAgICAnd2luZG93JyxcbiAgXSksXG4gIENvbG9yYWJsZSxcbiAgVGhlbWVhYmxlXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuKS5leHRlbmQoe1xuICBuYW1lOiAndi1zeXN0ZW0tYmFyJyxcblxuICBwcm9wczoge1xuICAgIGhlaWdodDogW051bWJlciwgU3RyaW5nXSxcbiAgICBsaWdodHNPdXQ6IEJvb2xlYW4sXG4gICAgd2luZG93OiBCb29sZWFuLFxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICd2LXN5c3RlbS1iYXItLWxpZ2h0cy1vdXQnOiB0aGlzLmxpZ2h0c091dCxcbiAgICAgICAgJ3Ytc3lzdGVtLWJhci0tYWJzb2x1dGUnOiB0aGlzLmFic29sdXRlLFxuICAgICAgICAndi1zeXN0ZW0tYmFyLS1maXhlZCc6ICF0aGlzLmFic29sdXRlICYmICh0aGlzLmFwcCB8fCB0aGlzLmZpeGVkKSxcbiAgICAgICAgJ3Ytc3lzdGVtLWJhci0td2luZG93JzogdGhpcy53aW5kb3csXG4gICAgICAgIC4uLnRoaXMudGhlbWVDbGFzc2VzLFxuICAgICAgfVxuICAgIH0sXG4gICAgY29tcHV0ZWRIZWlnaHQgKCk6IG51bWJlciB8IHN0cmluZyB7XG4gICAgICBpZiAodGhpcy5oZWlnaHQpIHtcbiAgICAgICAgcmV0dXJuIGlzTmFOKHBhcnNlSW50KHRoaXMuaGVpZ2h0KSkgPyB0aGlzLmhlaWdodCA6IHBhcnNlSW50KHRoaXMuaGVpZ2h0KVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy53aW5kb3cgPyAzMiA6IDI0XG4gICAgfSxcbiAgICBzdHlsZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBoZWlnaHQ6IGNvbnZlcnRUb1VuaXQodGhpcy5jb21wdXRlZEhlaWdodCksXG4gICAgICB9XG4gICAgfSxcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgdXBkYXRlQXBwbGljYXRpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXMuJGVsXG4gICAgICAgID8gdGhpcy4kZWwuY2xpZW50SGVpZ2h0XG4gICAgICAgIDogdGhpcy5jb21wdXRlZEhlaWdodFxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyIChoKTogVk5vZGUge1xuICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICBzdGF0aWNDbGFzczogJ3Ytc3lzdGVtLWJhcicsXG4gICAgICBjbGFzczogdGhpcy5jbGFzc2VzLFxuICAgICAgc3R5bGU6IHRoaXMuc3R5bGVzLFxuICAgICAgb246IHRoaXMuJGxpc3RlbmVycyxcbiAgICB9XG5cbiAgICByZXR1cm4gaCgnZGl2JywgdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IodGhpcy5jb2xvciwgZGF0YSksIGdldFNsb3QodGhpcykpXG4gIH0sXG59KVxuIl19