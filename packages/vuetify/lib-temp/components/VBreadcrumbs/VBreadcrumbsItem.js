import Routable from '../../mixins/routable';
import mixins from '../../util/mixins';
/* @vue/component */
export default mixins(Routable).extend({
    name: 'v-breadcrumbs-item',
    props: {
        // In a breadcrumb, the currently
        // active item should be dimmed
        activeClass: {
            type: String,
            default: 'v-breadcrumbs__item--disabled',
        },
        ripple: {
            type: [Boolean, Object],
            default: false,
        },
    },
    computed: {
        classes() {
            return {
                'v-breadcrumbs__item': true,
                [this.activeClass]: this.disabled,
            };
        },
    },
    render(h) {
        const { tag, data } = this.generateRouteLink();
        return h('li', [
            h(tag, {
                ...data,
                attrs: {
                    ...data.attrs,
                    'aria-current': this.isActive && this.isLink ? 'page' : undefined,
                },
            }, this.$slots.default),
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkJyZWFkY3J1bWJzSXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZCcmVhZGNydW1icy9WQnJlYWRjcnVtYnNJdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sUUFBUSxNQUFNLHVCQUF1QixDQUFBO0FBRTVDLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBR3RDLG9CQUFvQjtBQUNwQixlQUFlLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDckMsSUFBSSxFQUFFLG9CQUFvQjtJQUUxQixLQUFLLEVBQUU7UUFDTCxpQ0FBaUM7UUFDakMsK0JBQStCO1FBQy9CLFdBQVcsRUFBRTtZQUNYLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLCtCQUErQjtTQUN6QztRQUNELE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUM7WUFDdkIsT0FBTyxFQUFFLEtBQUs7U0FDZjtLQUNGO0lBRUQsUUFBUSxFQUFFO1FBQ1IsT0FBTztZQUNMLE9BQU87Z0JBQ0wscUJBQXFCLEVBQUUsSUFBSTtnQkFDM0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVE7YUFDbEMsQ0FBQTtRQUNILENBQUM7S0FDRjtJQUVELE1BQU0sQ0FBRSxDQUFDO1FBQ1AsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUU5QyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUU7WUFDYixDQUFDLENBQUMsR0FBRyxFQUFFO2dCQUNMLEdBQUcsSUFBSTtnQkFDUCxLQUFLLEVBQUU7b0JBQ0wsR0FBRyxJQUFJLENBQUMsS0FBSztvQkFDYixjQUFjLEVBQUUsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVM7aUJBQ2xFO2FBQ0YsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztTQUN4QixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJvdXRhYmxlIGZyb20gJy4uLy4uL21peGlucy9yb3V0YWJsZSdcblxuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcbmltcG9ydCB7IFZOb2RlIH0gZnJvbSAndnVlJ1xuXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFJvdXRhYmxlKS5leHRlbmQoe1xuICBuYW1lOiAndi1icmVhZGNydW1icy1pdGVtJyxcblxuICBwcm9wczoge1xuICAgIC8vIEluIGEgYnJlYWRjcnVtYiwgdGhlIGN1cnJlbnRseVxuICAgIC8vIGFjdGl2ZSBpdGVtIHNob3VsZCBiZSBkaW1tZWRcbiAgICBhY3RpdmVDbGFzczoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJ3YtYnJlYWRjcnVtYnNfX2l0ZW0tLWRpc2FibGVkJyxcbiAgICB9LFxuICAgIHJpcHBsZToge1xuICAgICAgdHlwZTogW0Jvb2xlYW4sIE9iamVjdF0sXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB9LFxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICd2LWJyZWFkY3J1bWJzX19pdGVtJzogdHJ1ZSxcbiAgICAgICAgW3RoaXMuYWN0aXZlQ2xhc3NdOiB0aGlzLmRpc2FibGVkLFxuICAgICAgfVxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyIChoKTogVk5vZGUge1xuICAgIGNvbnN0IHsgdGFnLCBkYXRhIH0gPSB0aGlzLmdlbmVyYXRlUm91dGVMaW5rKClcblxuICAgIHJldHVybiBoKCdsaScsIFtcbiAgICAgIGgodGFnLCB7XG4gICAgICAgIC4uLmRhdGEsXG4gICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgLi4uZGF0YS5hdHRycyxcbiAgICAgICAgICAnYXJpYS1jdXJyZW50JzogdGhpcy5pc0FjdGl2ZSAmJiB0aGlzLmlzTGluayA/ICdwYWdlJyA6IHVuZGVmaW5lZCxcbiAgICAgICAgfSxcbiAgICAgIH0sIHRoaXMuJHNsb3RzLmRlZmF1bHQpLFxuICAgIF0pXG4gIH0sXG59KVxuIl19