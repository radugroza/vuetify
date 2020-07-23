// Extensions
import { BaseItemGroup } from '../../components/VItemGroup/VItemGroup';
/* @vue/component */
export default BaseItemGroup.extend({
    name: 'button-group',
    provide() {
        return {
            btnToggle: this,
        };
    },
    computed: {
        classes() {
            return BaseItemGroup.options.computed.classes.call(this);
        },
    },
    methods: {
        // Isn't being passed down through types
        genData: BaseItemGroup.options.methods.genData,
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL2J1dHRvbi1ncm91cC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxhQUFhO0FBQ2IsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdDQUF3QyxDQUFBO0FBRXRFLG9CQUFvQjtBQUNwQixlQUFlLGFBQWEsQ0FBQyxNQUFNLENBQUM7SUFDbEMsSUFBSSxFQUFFLGNBQWM7SUFFcEIsT0FBTztRQUNMLE9BQU87WUFDTCxTQUFTLEVBQUUsSUFBSTtTQUNoQixDQUFBO0lBQ0gsQ0FBQztJQUVELFFBQVEsRUFBRTtRQUNSLE9BQU87WUFDTCxPQUFPLGFBQWEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDMUQsQ0FBQztLQUNGO0lBRUQsT0FBTyxFQUFFO1FBQ1Asd0NBQXdDO1FBQ3hDLE9BQU8sRUFBRSxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPO0tBQy9DO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRXh0ZW5zaW9uc1xuaW1wb3J0IHsgQmFzZUl0ZW1Hcm91cCB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvVkl0ZW1Hcm91cC9WSXRlbUdyb3VwJ1xuXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuZXhwb3J0IGRlZmF1bHQgQmFzZUl0ZW1Hcm91cC5leHRlbmQoe1xuICBuYW1lOiAnYnV0dG9uLWdyb3VwJyxcblxuICBwcm92aWRlICgpOiBvYmplY3Qge1xuICAgIHJldHVybiB7XG4gICAgICBidG5Ub2dnbGU6IHRoaXMsXG4gICAgfVxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiBCYXNlSXRlbUdyb3VwLm9wdGlvbnMuY29tcHV0ZWQuY2xhc3Nlcy5jYWxsKHRoaXMpXG4gICAgfSxcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgLy8gSXNuJ3QgYmVpbmcgcGFzc2VkIGRvd24gdGhyb3VnaCB0eXBlc1xuICAgIGdlbkRhdGE6IEJhc2VJdGVtR3JvdXAub3B0aW9ucy5tZXRob2RzLmdlbkRhdGEsXG4gIH0sXG59KVxuIl19