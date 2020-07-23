// Types
import Vue from 'vue';
export default function VGrid(name) {
    /* @vue/component */
    return Vue.extend({
        name: `v-${name}`,
        functional: true,
        props: {
            id: String,
            tag: {
                type: String,
                default: 'div',
            },
        },
        render(h, { props, data, children }) {
            data.staticClass = (`${name} ${data.staticClass || ''}`).trim();
            const { attrs } = data;
            if (attrs) {
                // reset attrs to extract utility clases like pa-3
                data.attrs = {};
                const classes = Object.keys(attrs).filter(key => {
                    // TODO: Remove once resolved
                    // https://github.com/vuejs/vue/issues/7841
                    if (key === 'slot')
                        return false;
                    const value = attrs[key];
                    // add back data attributes like data-test="foo" but do not
                    // add them as classes
                    if (key.startsWith('data-')) {
                        data.attrs[key] = value;
                        return false;
                    }
                    return value || typeof value === 'string';
                });
                if (classes.length)
                    data.staticClass += ` ${classes.join(' ')}`;
            }
            if (props.id) {
                data.domProps = data.domProps || {};
                data.domProps.id = props.id;
            }
            return h(props.tag, data, children);
        },
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZHcmlkL2dyaWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsUUFBUTtBQUNSLE9BQU8sR0FBYyxNQUFNLEtBQUssQ0FBQTtBQUVoQyxNQUFNLENBQUMsT0FBTyxVQUFVLEtBQUssQ0FBRSxJQUFZO0lBQ3pDLG9CQUFvQjtJQUNwQixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFDaEIsSUFBSSxFQUFFLEtBQUssSUFBSSxFQUFFO1FBRWpCLFVBQVUsRUFBRSxJQUFJO1FBRWhCLEtBQUssRUFBRTtZQUNMLEVBQUUsRUFBRSxNQUFNO1lBQ1YsR0FBRyxFQUFFO2dCQUNILElBQUksRUFBRSxNQUFNO2dCQUNaLE9BQU8sRUFBRSxLQUFLO2FBQ2Y7U0FDRjtRQUVELE1BQU0sQ0FBRSxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUNsQyxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsR0FBRyxJQUFJLElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBO1lBRS9ELE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUE7WUFDdEIsSUFBSSxLQUFLLEVBQUU7Z0JBQ1Qsa0RBQWtEO2dCQUNsRCxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQTtnQkFDZixNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDOUMsNkJBQTZCO29CQUM3QiwyQ0FBMkM7b0JBQzNDLElBQUksR0FBRyxLQUFLLE1BQU07d0JBQUUsT0FBTyxLQUFLLENBQUE7b0JBRWhDLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtvQkFFeEIsMkRBQTJEO29CQUMzRCxzQkFBc0I7b0JBQ3RCLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRTt3QkFDM0IsSUFBSSxDQUFDLEtBQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUE7d0JBQ3hCLE9BQU8sS0FBSyxDQUFBO3FCQUNiO29CQUVELE9BQU8sS0FBSyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQTtnQkFDM0MsQ0FBQyxDQUFDLENBQUE7Z0JBRUYsSUFBSSxPQUFPLENBQUMsTUFBTTtvQkFBRSxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFBO2FBQ2hFO1lBRUQsSUFBSSxLQUFLLENBQUMsRUFBRSxFQUFFO2dCQUNaLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUE7Z0JBQ25DLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUE7YUFDNUI7WUFFRCxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQTtRQUNyQyxDQUFDO0tBQ0YsQ0FBQyxDQUFBO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIFR5cGVzXG5pbXBvcnQgVnVlLCB7IFZOb2RlIH0gZnJvbSAndnVlJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBWR3JpZCAobmFtZTogc3RyaW5nKSB7XG4gIC8qIEB2dWUvY29tcG9uZW50ICovXG4gIHJldHVybiBWdWUuZXh0ZW5kKHtcbiAgICBuYW1lOiBgdi0ke25hbWV9YCxcblxuICAgIGZ1bmN0aW9uYWw6IHRydWUsXG5cbiAgICBwcm9wczoge1xuICAgICAgaWQ6IFN0cmluZyxcbiAgICAgIHRhZzoge1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIGRlZmF1bHQ6ICdkaXYnLFxuICAgICAgfSxcbiAgICB9LFxuXG4gICAgcmVuZGVyIChoLCB7IHByb3BzLCBkYXRhLCBjaGlsZHJlbiB9KTogVk5vZGUge1xuICAgICAgZGF0YS5zdGF0aWNDbGFzcyA9IChgJHtuYW1lfSAke2RhdGEuc3RhdGljQ2xhc3MgfHwgJyd9YCkudHJpbSgpXG5cbiAgICAgIGNvbnN0IHsgYXR0cnMgfSA9IGRhdGFcbiAgICAgIGlmIChhdHRycykge1xuICAgICAgICAvLyByZXNldCBhdHRycyB0byBleHRyYWN0IHV0aWxpdHkgY2xhc2VzIGxpa2UgcGEtM1xuICAgICAgICBkYXRhLmF0dHJzID0ge31cbiAgICAgICAgY29uc3QgY2xhc3NlcyA9IE9iamVjdC5rZXlzKGF0dHJzKS5maWx0ZXIoa2V5ID0+IHtcbiAgICAgICAgICAvLyBUT0RPOiBSZW1vdmUgb25jZSByZXNvbHZlZFxuICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS92dWVqcy92dWUvaXNzdWVzLzc4NDFcbiAgICAgICAgICBpZiAoa2V5ID09PSAnc2xvdCcpIHJldHVybiBmYWxzZVxuXG4gICAgICAgICAgY29uc3QgdmFsdWUgPSBhdHRyc1trZXldXG5cbiAgICAgICAgICAvLyBhZGQgYmFjayBkYXRhIGF0dHJpYnV0ZXMgbGlrZSBkYXRhLXRlc3Q9XCJmb29cIiBidXQgZG8gbm90XG4gICAgICAgICAgLy8gYWRkIHRoZW0gYXMgY2xhc3Nlc1xuICAgICAgICAgIGlmIChrZXkuc3RhcnRzV2l0aCgnZGF0YS0nKSkge1xuICAgICAgICAgICAgZGF0YS5hdHRycyFba2V5XSA9IHZhbHVlXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gdmFsdWUgfHwgdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJ1xuICAgICAgICB9KVxuXG4gICAgICAgIGlmIChjbGFzc2VzLmxlbmd0aCkgZGF0YS5zdGF0aWNDbGFzcyArPSBgICR7Y2xhc3Nlcy5qb2luKCcgJyl9YFxuICAgICAgfVxuXG4gICAgICBpZiAocHJvcHMuaWQpIHtcbiAgICAgICAgZGF0YS5kb21Qcm9wcyA9IGRhdGEuZG9tUHJvcHMgfHwge31cbiAgICAgICAgZGF0YS5kb21Qcm9wcy5pZCA9IHByb3BzLmlkXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBoKHByb3BzLnRhZywgZGF0YSwgY2hpbGRyZW4pXG4gICAgfSxcbiAgfSlcbn1cbiJdfQ==