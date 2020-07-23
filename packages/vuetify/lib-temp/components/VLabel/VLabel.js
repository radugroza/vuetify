// Styles
import './VLabel.sass';
// Mixins
import Colorable from '../../mixins/colorable';
import Themeable, { functionalThemeClasses } from '../../mixins/themeable';
import mixins from '../../util/mixins';
// Helpers
import { convertToUnit } from '../../util/helpers';
/* @vue/component */
export default mixins(Themeable).extend({
    name: 'v-label',
    functional: true,
    props: {
        absolute: Boolean,
        color: {
            type: String,
            default: 'primary',
        },
        disabled: Boolean,
        focused: Boolean,
        for: String,
        left: {
            type: [Number, String],
            default: 0,
        },
        right: {
            type: [Number, String],
            default: 'auto',
        },
        value: Boolean,
    },
    render(h, ctx) {
        const { children, listeners, props } = ctx;
        const data = {
            staticClass: 'v-label',
            class: {
                'v-label--active': props.value,
                'v-label--is-disabled': props.disabled,
                ...functionalThemeClasses(ctx),
            },
            attrs: {
                for: props.for,
                'aria-hidden': !props.for,
            },
            on: listeners,
            style: {
                left: convertToUnit(props.left),
                right: convertToUnit(props.right),
                position: props.absolute ? 'absolute' : 'relative',
            },
            ref: 'label',
        };
        return h('label', Colorable.options.methods.setTextColor(props.focused && props.color, data), children);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkxhYmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkxhYmVsL1ZMYWJlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxlQUFlLENBQUE7QUFFdEIsU0FBUztBQUNULE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBQzlDLE9BQU8sU0FBUyxFQUFFLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQTtBQUkxRSxPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQUV0QyxVQUFVO0FBQ1YsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBRWxELG9CQUFvQjtBQUNwQixlQUFlLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDdEMsSUFBSSxFQUFFLFNBQVM7SUFFZixVQUFVLEVBQUUsSUFBSTtJQUVoQixLQUFLLEVBQUU7UUFDTCxRQUFRLEVBQUUsT0FBTztRQUNqQixLQUFLLEVBQUU7WUFDTCxJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxTQUFTO1NBQ25CO1FBQ0QsUUFBUSxFQUFFLE9BQU87UUFDakIsT0FBTyxFQUFFLE9BQU87UUFDaEIsR0FBRyxFQUFFLE1BQU07UUFDWCxJQUFJLEVBQUU7WUFDSixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxDQUFDO1NBQ1g7UUFDRCxLQUFLLEVBQUU7WUFDTCxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxNQUFNO1NBQ2hCO1FBQ0QsS0FBSyxFQUFFLE9BQU87S0FDZjtJQUVELE1BQU0sQ0FBRSxDQUFDLEVBQUUsR0FBRztRQUNaLE1BQU0sRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxHQUFHLEdBQUcsQ0FBQTtRQUMxQyxNQUFNLElBQUksR0FBRztZQUNYLFdBQVcsRUFBRSxTQUFTO1lBQ3RCLEtBQUssRUFBRTtnQkFDTCxpQkFBaUIsRUFBRSxLQUFLLENBQUMsS0FBSztnQkFDOUIsc0JBQXNCLEVBQUUsS0FBSyxDQUFDLFFBQVE7Z0JBQ3RDLEdBQUcsc0JBQXNCLENBQUMsR0FBRyxDQUFDO2FBQy9CO1lBQ0QsS0FBSyxFQUFFO2dCQUNMLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztnQkFDZCxhQUFhLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRzthQUMxQjtZQUNELEVBQUUsRUFBRSxTQUFTO1lBQ2IsS0FBSyxFQUFFO2dCQUNMLElBQUksRUFBRSxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztnQkFDL0IsS0FBSyxFQUFFLGFBQWEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO2dCQUNqQyxRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxVQUFVO2FBQ25EO1lBQ0QsR0FBRyxFQUFFLE9BQU87U0FDYixDQUFBO1FBRUQsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsT0FBTyxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUE7SUFDekcsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xuaW1wb3J0ICcuL1ZMYWJlbC5zYXNzJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBDb2xvcmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2NvbG9yYWJsZSdcbmltcG9ydCBUaGVtZWFibGUsIHsgZnVuY3Rpb25hbFRoZW1lQ2xhc3NlcyB9IGZyb20gJy4uLy4uL21peGlucy90aGVtZWFibGUnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZSdcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5cbi8vIEhlbHBlcnNcbmltcG9ydCB7IGNvbnZlcnRUb1VuaXQgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBtaXhpbnMoVGhlbWVhYmxlKS5leHRlbmQoe1xuICBuYW1lOiAndi1sYWJlbCcsXG5cbiAgZnVuY3Rpb25hbDogdHJ1ZSxcblxuICBwcm9wczoge1xuICAgIGFic29sdXRlOiBCb29sZWFuLFxuICAgIGNvbG9yOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAncHJpbWFyeScsXG4gICAgfSxcbiAgICBkaXNhYmxlZDogQm9vbGVhbixcbiAgICBmb2N1c2VkOiBCb29sZWFuLFxuICAgIGZvcjogU3RyaW5nLFxuICAgIGxlZnQ6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiAwLFxuICAgIH0sXG4gICAgcmlnaHQ6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiAnYXV0bycsXG4gICAgfSxcbiAgICB2YWx1ZTogQm9vbGVhbixcbiAgfSxcblxuICByZW5kZXIgKGgsIGN0eCk6IFZOb2RlIHtcbiAgICBjb25zdCB7IGNoaWxkcmVuLCBsaXN0ZW5lcnMsIHByb3BzIH0gPSBjdHhcbiAgICBjb25zdCBkYXRhID0ge1xuICAgICAgc3RhdGljQ2xhc3M6ICd2LWxhYmVsJyxcbiAgICAgIGNsYXNzOiB7XG4gICAgICAgICd2LWxhYmVsLS1hY3RpdmUnOiBwcm9wcy52YWx1ZSxcbiAgICAgICAgJ3YtbGFiZWwtLWlzLWRpc2FibGVkJzogcHJvcHMuZGlzYWJsZWQsXG4gICAgICAgIC4uLmZ1bmN0aW9uYWxUaGVtZUNsYXNzZXMoY3R4KSxcbiAgICAgIH0sXG4gICAgICBhdHRyczoge1xuICAgICAgICBmb3I6IHByb3BzLmZvcixcbiAgICAgICAgJ2FyaWEtaGlkZGVuJzogIXByb3BzLmZvcixcbiAgICAgIH0sXG4gICAgICBvbjogbGlzdGVuZXJzLFxuICAgICAgc3R5bGU6IHtcbiAgICAgICAgbGVmdDogY29udmVydFRvVW5pdChwcm9wcy5sZWZ0KSxcbiAgICAgICAgcmlnaHQ6IGNvbnZlcnRUb1VuaXQocHJvcHMucmlnaHQpLFxuICAgICAgICBwb3NpdGlvbjogcHJvcHMuYWJzb2x1dGUgPyAnYWJzb2x1dGUnIDogJ3JlbGF0aXZlJyxcbiAgICAgIH0sXG4gICAgICByZWY6ICdsYWJlbCcsXG4gICAgfVxuXG4gICAgcmV0dXJuIGgoJ2xhYmVsJywgQ29sb3JhYmxlLm9wdGlvbnMubWV0aG9kcy5zZXRUZXh0Q29sb3IocHJvcHMuZm9jdXNlZCAmJiBwcm9wcy5jb2xvciwgZGF0YSksIGNoaWxkcmVuKVxuICB9LFxufSlcbiJdfQ==