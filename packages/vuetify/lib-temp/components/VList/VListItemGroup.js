// Styles
import './VListItemGroup.sass';
// Extensions
import { BaseItemGroup } from '../VItemGroup/VItemGroup';
// Mixins
import Colorable from '../../mixins/colorable';
// Utilities
import mixins from '../../util/mixins';
export default mixins(BaseItemGroup, Colorable).extend({
    name: 'v-list-item-group',
    provide() {
        return {
            isInGroup: true,
            listItemGroup: this,
        };
    },
    computed: {
        classes() {
            return {
                ...BaseItemGroup.options.computed.classes.call(this),
                'v-list-item-group': true,
            };
        },
    },
    methods: {
        genData() {
            return this.setTextColor(this.color, {
                ...BaseItemGroup.options.methods.genData.call(this),
                attrs: {
                    role: 'listbox',
                },
            });
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkxpc3RJdGVtR3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WTGlzdC9WTGlzdEl0ZW1Hcm91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyx1QkFBdUIsQ0FBQTtBQUU5QixhQUFhO0FBQ2IsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDBCQUEwQixDQUFBO0FBRXhELFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUU5QyxZQUFZO0FBQ1osT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFFdEMsZUFBZSxNQUFNLENBQ25CLGFBQWEsRUFDYixTQUFTLENBQ1YsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUsbUJBQW1CO0lBRXpCLE9BQU87UUFDTCxPQUFPO1lBQ0wsU0FBUyxFQUFFLElBQUk7WUFDZixhQUFhLEVBQUUsSUFBSTtTQUNwQixDQUFBO0lBQ0gsQ0FBQztJQUVELFFBQVEsRUFBRTtRQUNSLE9BQU87WUFDTCxPQUFPO2dCQUNMLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQ3BELG1CQUFtQixFQUFFLElBQUk7YUFDMUIsQ0FBQTtRQUNILENBQUM7S0FDRjtJQUVELE9BQU8sRUFBRTtRQUNQLE9BQU87WUFDTCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDbkMsR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDbkQsS0FBSyxFQUFFO29CQUNMLElBQUksRUFBRSxTQUFTO2lCQUNoQjthQUNGLENBQUMsQ0FBQTtRQUNKLENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xuaW1wb3J0ICcuL1ZMaXN0SXRlbUdyb3VwLnNhc3MnXG5cbi8vIEV4dGVuc2lvbnNcbmltcG9ydCB7IEJhc2VJdGVtR3JvdXAgfSBmcm9tICcuLi9WSXRlbUdyb3VwL1ZJdGVtR3JvdXAnXG5cbi8vIE1peGluc1xuaW1wb3J0IENvbG9yYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvY29sb3JhYmxlJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5cbmV4cG9ydCBkZWZhdWx0IG1peGlucyhcbiAgQmFzZUl0ZW1Hcm91cCxcbiAgQ29sb3JhYmxlXG4pLmV4dGVuZCh7XG4gIG5hbWU6ICd2LWxpc3QtaXRlbS1ncm91cCcsXG5cbiAgcHJvdmlkZSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlzSW5Hcm91cDogdHJ1ZSxcbiAgICAgIGxpc3RJdGVtR3JvdXA6IHRoaXMsXG4gICAgfVxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLkJhc2VJdGVtR3JvdXAub3B0aW9ucy5jb21wdXRlZC5jbGFzc2VzLmNhbGwodGhpcyksXG4gICAgICAgICd2LWxpc3QtaXRlbS1ncm91cCc6IHRydWUsXG4gICAgICB9XG4gICAgfSxcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgZ2VuRGF0YSAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB0aGlzLnNldFRleHRDb2xvcih0aGlzLmNvbG9yLCB7XG4gICAgICAgIC4uLkJhc2VJdGVtR3JvdXAub3B0aW9ucy5tZXRob2RzLmdlbkRhdGEuY2FsbCh0aGlzKSxcbiAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICByb2xlOiAnbGlzdGJveCcsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH0sXG4gIH0sXG59KVxuIl19