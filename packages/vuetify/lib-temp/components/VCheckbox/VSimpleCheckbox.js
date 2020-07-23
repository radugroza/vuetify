import './VSimpleCheckbox.sass';
import ripple from '../../directives/ripple';
import Vue from 'vue';
import { VIcon } from '../VIcon';
// Mixins
import Colorable from '../../mixins/colorable';
import Themeable from '../../mixins/themeable';
// Utilities
import mergeData from '../../util/mergeData';
import { wrapInArray } from '../../util/helpers';
export default Vue.extend({
    name: 'v-simple-checkbox',
    functional: true,
    directives: {
        ripple,
    },
    props: {
        ...Colorable.options.props,
        ...Themeable.options.props,
        disabled: Boolean,
        ripple: {
            type: Boolean,
            default: true,
        },
        value: Boolean,
        indeterminate: Boolean,
        indeterminateIcon: {
            type: String,
            default: '$checkboxIndeterminate',
        },
        onIcon: {
            type: String,
            default: '$checkboxOn',
        },
        offIcon: {
            type: String,
            default: '$checkboxOff',
        },
    },
    render(h, { props, data, listeners }) {
        const children = [];
        if (props.ripple && !props.disabled) {
            const ripple = h('div', Colorable.options.methods.setTextColor(props.color, {
                staticClass: 'v-input--selection-controls__ripple',
                directives: [{
                        name: 'ripple',
                        value: { center: true },
                    }],
            }));
            children.push(ripple);
        }
        let icon = props.offIcon;
        if (props.indeterminate)
            icon = props.indeterminateIcon;
        else if (props.value)
            icon = props.onIcon;
        children.push(h(VIcon, Colorable.options.methods.setTextColor(props.value && props.color, {
            props: {
                disabled: props.disabled,
                dark: props.dark,
                light: props.light,
            },
        }), icon));
        const classes = {
            'v-simple-checkbox': true,
            'v-simple-checkbox--disabled': props.disabled,
        };
        return h('div', mergeData(data, {
            class: classes,
            on: {
                click: (e) => {
                    e.stopPropagation();
                    if (data.on && data.on.input && !props.disabled) {
                        wrapInArray(data.on.input).forEach(f => f(!props.value));
                    }
                },
            },
        }), children);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlNpbXBsZUNoZWNrYm94LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkNoZWNrYm94L1ZTaW1wbGVDaGVja2JveC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLHdCQUF3QixDQUFBO0FBRS9CLE9BQU8sTUFBTSxNQUFNLHlCQUF5QixDQUFBO0FBRTVDLE9BQU8sR0FBOEIsTUFBTSxLQUFLLENBQUE7QUFDaEQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLFVBQVUsQ0FBQTtBQUVoQyxTQUFTO0FBQ1QsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFFOUMsWUFBWTtBQUNaLE9BQU8sU0FBUyxNQUFNLHNCQUFzQixDQUFBO0FBQzVDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUVoRCxlQUFlLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFDeEIsSUFBSSxFQUFFLG1CQUFtQjtJQUV6QixVQUFVLEVBQUUsSUFBSTtJQUVoQixVQUFVLEVBQUU7UUFDVixNQUFNO0tBQ1A7SUFFRCxLQUFLLEVBQUU7UUFDTCxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSztRQUMxQixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSztRQUMxQixRQUFRLEVBQUUsT0FBTztRQUNqQixNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsT0FBTztZQUNiLE9BQU8sRUFBRSxJQUFJO1NBQ2Q7UUFDRCxLQUFLLEVBQUUsT0FBTztRQUNkLGFBQWEsRUFBRSxPQUFPO1FBQ3RCLGlCQUFpQixFQUFFO1lBQ2pCLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLHdCQUF3QjtTQUNsQztRQUNELE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLGFBQWE7U0FDdkI7UUFDRCxPQUFPLEVBQUU7WUFDUCxJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxjQUFjO1NBQ3hCO0tBQ0Y7SUFFRCxNQUFNLENBQUUsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUU7UUFDbkMsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFBO1FBRW5CLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFDbkMsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRTtnQkFDMUUsV0FBVyxFQUFFLHFDQUFxQztnQkFDbEQsVUFBVSxFQUFFLENBQUM7d0JBQ1gsSUFBSSxFQUFFLFFBQVE7d0JBQ2QsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtxQkFDeEIsQ0FBcUI7YUFDdkIsQ0FBQyxDQUFDLENBQUE7WUFFSCxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1NBQ3RCO1FBRUQsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQTtRQUN4QixJQUFJLEtBQUssQ0FBQyxhQUFhO1lBQUUsSUFBSSxHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQTthQUNsRCxJQUFJLEtBQUssQ0FBQyxLQUFLO1lBQUUsSUFBSSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUE7UUFFekMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUU7WUFDeEYsS0FBSyxFQUFFO2dCQUNMLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTtnQkFDeEIsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO2dCQUNoQixLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUs7YUFDbkI7U0FDRixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQTtRQUVWLE1BQU0sT0FBTyxHQUFHO1lBQ2QsbUJBQW1CLEVBQUUsSUFBSTtZQUN6Qiw2QkFBNkIsRUFBRSxLQUFLLENBQUMsUUFBUTtTQUM5QyxDQUFBO1FBRUQsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUNaLFNBQVMsQ0FBQyxJQUFJLEVBQUU7WUFDZCxLQUFLLEVBQUUsT0FBTztZQUNkLEVBQUUsRUFBRTtnQkFDRixLQUFLLEVBQUUsQ0FBQyxDQUFhLEVBQUUsRUFBRTtvQkFDdkIsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFBO29CQUVuQixJQUFJLElBQUksQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFO3dCQUMvQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtxQkFDekQ7Z0JBQ0gsQ0FBQzthQUNGO1NBQ0YsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0lBQ2pCLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4vVlNpbXBsZUNoZWNrYm94LnNhc3MnXG5cbmltcG9ydCByaXBwbGUgZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9yaXBwbGUnXG5cbmltcG9ydCBWdWUsIHsgVk5vZGUsIFZOb2RlRGlyZWN0aXZlIH0gZnJvbSAndnVlJ1xuaW1wb3J0IHsgVkljb24gfSBmcm9tICcuLi9WSWNvbidcblxuLy8gTWl4aW5zXG5pbXBvcnQgQ29sb3JhYmxlIGZyb20gJy4uLy4uL21peGlucy9jb2xvcmFibGUnXG5pbXBvcnQgVGhlbWVhYmxlIGZyb20gJy4uLy4uL21peGlucy90aGVtZWFibGUnXG5cbi8vIFV0aWxpdGllc1xuaW1wb3J0IG1lcmdlRGF0YSBmcm9tICcuLi8uLi91dGlsL21lcmdlRGF0YSdcbmltcG9ydCB7IHdyYXBJbkFycmF5IH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuXG5leHBvcnQgZGVmYXVsdCBWdWUuZXh0ZW5kKHtcbiAgbmFtZTogJ3Ytc2ltcGxlLWNoZWNrYm94JyxcblxuICBmdW5jdGlvbmFsOiB0cnVlLFxuXG4gIGRpcmVjdGl2ZXM6IHtcbiAgICByaXBwbGUsXG4gIH0sXG5cbiAgcHJvcHM6IHtcbiAgICAuLi5Db2xvcmFibGUub3B0aW9ucy5wcm9wcyxcbiAgICAuLi5UaGVtZWFibGUub3B0aW9ucy5wcm9wcyxcbiAgICBkaXNhYmxlZDogQm9vbGVhbixcbiAgICByaXBwbGU6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiB0cnVlLFxuICAgIH0sXG4gICAgdmFsdWU6IEJvb2xlYW4sXG4gICAgaW5kZXRlcm1pbmF0ZTogQm9vbGVhbixcbiAgICBpbmRldGVybWluYXRlSWNvbjoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJyRjaGVja2JveEluZGV0ZXJtaW5hdGUnLFxuICAgIH0sXG4gICAgb25JY29uOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnJGNoZWNrYm94T24nLFxuICAgIH0sXG4gICAgb2ZmSWNvbjoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJyRjaGVja2JveE9mZicsXG4gICAgfSxcbiAgfSxcblxuICByZW5kZXIgKGgsIHsgcHJvcHMsIGRhdGEsIGxpc3RlbmVycyB9KTogVk5vZGUge1xuICAgIGNvbnN0IGNoaWxkcmVuID0gW11cblxuICAgIGlmIChwcm9wcy5yaXBwbGUgJiYgIXByb3BzLmRpc2FibGVkKSB7XG4gICAgICBjb25zdCByaXBwbGUgPSBoKCdkaXYnLCBDb2xvcmFibGUub3B0aW9ucy5tZXRob2RzLnNldFRleHRDb2xvcihwcm9wcy5jb2xvciwge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3YtaW5wdXQtLXNlbGVjdGlvbi1jb250cm9sc19fcmlwcGxlJyxcbiAgICAgICAgZGlyZWN0aXZlczogW3tcbiAgICAgICAgICBuYW1lOiAncmlwcGxlJyxcbiAgICAgICAgICB2YWx1ZTogeyBjZW50ZXI6IHRydWUgfSxcbiAgICAgICAgfV0gYXMgVk5vZGVEaXJlY3RpdmVbXSxcbiAgICAgIH0pKVxuXG4gICAgICBjaGlsZHJlbi5wdXNoKHJpcHBsZSlcbiAgICB9XG5cbiAgICBsZXQgaWNvbiA9IHByb3BzLm9mZkljb25cbiAgICBpZiAocHJvcHMuaW5kZXRlcm1pbmF0ZSkgaWNvbiA9IHByb3BzLmluZGV0ZXJtaW5hdGVJY29uXG4gICAgZWxzZSBpZiAocHJvcHMudmFsdWUpIGljb24gPSBwcm9wcy5vbkljb25cblxuICAgIGNoaWxkcmVuLnB1c2goaChWSWNvbiwgQ29sb3JhYmxlLm9wdGlvbnMubWV0aG9kcy5zZXRUZXh0Q29sb3IocHJvcHMudmFsdWUgJiYgcHJvcHMuY29sb3IsIHtcbiAgICAgIHByb3BzOiB7XG4gICAgICAgIGRpc2FibGVkOiBwcm9wcy5kaXNhYmxlZCxcbiAgICAgICAgZGFyazogcHJvcHMuZGFyayxcbiAgICAgICAgbGlnaHQ6IHByb3BzLmxpZ2h0LFxuICAgICAgfSxcbiAgICB9KSwgaWNvbikpXG5cbiAgICBjb25zdCBjbGFzc2VzID0ge1xuICAgICAgJ3Ytc2ltcGxlLWNoZWNrYm94JzogdHJ1ZSxcbiAgICAgICd2LXNpbXBsZS1jaGVja2JveC0tZGlzYWJsZWQnOiBwcm9wcy5kaXNhYmxlZCxcbiAgICB9XG5cbiAgICByZXR1cm4gaCgnZGl2JyxcbiAgICAgIG1lcmdlRGF0YShkYXRhLCB7XG4gICAgICAgIGNsYXNzOiBjbGFzc2VzLFxuICAgICAgICBvbjoge1xuICAgICAgICAgIGNsaWNrOiAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuXG4gICAgICAgICAgICBpZiAoZGF0YS5vbiAmJiBkYXRhLm9uLmlucHV0ICYmICFwcm9wcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgICB3cmFwSW5BcnJheShkYXRhLm9uLmlucHV0KS5mb3JFYWNoKGYgPT4gZighcHJvcHMudmFsdWUpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KSwgY2hpbGRyZW4pXG4gIH0sXG59KVxuIl19