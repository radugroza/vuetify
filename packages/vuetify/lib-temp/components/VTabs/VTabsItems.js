// Extensions
import VWindow from '../VWindow/VWindow';
// Types & Components
import { BaseItemGroup } from './../VItemGroup/VItemGroup';
/* @vue/component */
export default VWindow.extend({
    name: 'v-tabs-items',
    props: {
        mandatory: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        classes() {
            return {
                ...VWindow.options.computed.classes.call(this),
                'v-tabs-items': true,
            };
        },
        isDark() {
            return this.rootIsDark;
        },
    },
    methods: {
        getValue(item, i) {
            return item.id || BaseItemGroup.options.methods.getValue.call(this, item, i);
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlRhYnNJdGVtcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZUYWJzL1ZUYWJzSXRlbXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsYUFBYTtBQUNiLE9BQU8sT0FBTyxNQUFNLG9CQUFvQixDQUFBO0FBRXhDLHFCQUFxQjtBQUNyQixPQUFPLEVBQUUsYUFBYSxFQUFxQixNQUFNLDRCQUE0QixDQUFBO0FBRTdFLG9CQUFvQjtBQUNwQixlQUFlLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFDNUIsSUFBSSxFQUFFLGNBQWM7SUFFcEIsS0FBSyxFQUFFO1FBQ0wsU0FBUyxFQUFFO1lBQ1QsSUFBSSxFQUFFLE9BQU87WUFDYixPQUFPLEVBQUUsS0FBSztTQUNmO0tBQ0Y7SUFFRCxRQUFRLEVBQUU7UUFDUixPQUFPO1lBQ0wsT0FBTztnQkFDTCxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUM5QyxjQUFjLEVBQUUsSUFBSTthQUNyQixDQUFBO1FBQ0gsQ0FBQztRQUNELE1BQU07WUFDSixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUE7UUFDeEIsQ0FBQztLQUNGO0lBRUQsT0FBTyxFQUFFO1FBQ1AsUUFBUSxDQUFFLElBQXVCLEVBQUUsQ0FBUztZQUMxQyxPQUFPLElBQUksQ0FBQyxFQUFFLElBQUksYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQzlFLENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIEV4dGVuc2lvbnNcbmltcG9ydCBWV2luZG93IGZyb20gJy4uL1ZXaW5kb3cvVldpbmRvdydcblxuLy8gVHlwZXMgJiBDb21wb25lbnRzXG5pbXBvcnQgeyBCYXNlSXRlbUdyb3VwLCBHcm91cGFibGVJbnN0YW5jZSB9IGZyb20gJy4vLi4vVkl0ZW1Hcm91cC9WSXRlbUdyb3VwJ1xuXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuZXhwb3J0IGRlZmF1bHQgVldpbmRvdy5leHRlbmQoe1xuICBuYW1lOiAndi10YWJzLWl0ZW1zJyxcblxuICBwcm9wczoge1xuICAgIG1hbmRhdG9yeToge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIH0sXG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBjbGFzc2VzICgpOiBvYmplY3Qge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uVldpbmRvdy5vcHRpb25zLmNvbXB1dGVkLmNsYXNzZXMuY2FsbCh0aGlzKSxcbiAgICAgICAgJ3YtdGFicy1pdGVtcyc6IHRydWUsXG4gICAgICB9XG4gICAgfSxcbiAgICBpc0RhcmsgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMucm9vdElzRGFya1xuICAgIH0sXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGdldFZhbHVlIChpdGVtOiBHcm91cGFibGVJbnN0YW5jZSwgaTogbnVtYmVyKSB7XG4gICAgICByZXR1cm4gaXRlbS5pZCB8fCBCYXNlSXRlbUdyb3VwLm9wdGlvbnMubWV0aG9kcy5nZXRWYWx1ZS5jYWxsKHRoaXMsIGl0ZW0sIGkpXG4gICAgfSxcbiAgfSxcbn0pXG4iXX0=