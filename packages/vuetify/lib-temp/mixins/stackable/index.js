import Vue from 'vue';
import { getZIndex } from '../../util/helpers';
/* @vue/component */
export default Vue.extend().extend({
    name: 'stackable',
    data() {
        return {
            stackElement: null,
            stackExclude: null,
            stackMinZIndex: 0,
            isActive: false,
        };
    },
    computed: {
        activeZIndex() {
            if (typeof window === 'undefined')
                return 0;
            const content = this.stackElement || this.$refs.content;
            // Return current zindex if not active
            const index = !this.isActive
                ? getZIndex(content)
                : this.getMaxZIndex(this.stackExclude || [content]) + 2;
            if (index == null)
                return index;
            // Return max current z-index (excluding self) + 2
            // (2 to leave room for an overlay below, if needed)
            return parseInt(index);
        },
    },
    methods: {
        getMaxZIndex(exclude = []) {
            const base = this.$el;
            // Start with lowest allowed z-index or z-index of
            // base component's element, whichever is greater
            const zis = [this.stackMinZIndex, getZIndex(base)];
            // Convert the NodeList to an array to
            // prevent an Edge bug with Symbol.iterator
            // https://github.com/vuetifyjs/vuetify/issues/2146
            const activeElements = [
                ...document.getElementsByClassName('v-menu__content--active'),
                ...document.getElementsByClassName('v-dialog__content--active'),
            ];
            // Get z-index for all active dialogs
            for (let index = 0; index < activeElements.length; index++) {
                if (!exclude.includes(activeElements[index])) {
                    zis.push(getZIndex(activeElements[index]));
                }
            }
            return Math.max(...zis);
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL3N0YWNrYWJsZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEdBQUcsTUFBTSxLQUFLLENBQUE7QUFFckIsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBUTlDLG9CQUFvQjtBQUNwQixlQUFlLEdBQUcsQ0FBQyxNQUFNLEVBQVcsQ0FBQyxNQUFNLENBQUM7SUFDMUMsSUFBSSxFQUFFLFdBQVc7SUFFakIsSUFBSTtRQUNGLE9BQU87WUFDTCxZQUFZLEVBQUUsSUFBc0I7WUFDcEMsWUFBWSxFQUFFLElBQXdCO1lBQ3RDLGNBQWMsRUFBRSxDQUFDO1lBQ2pCLFFBQVEsRUFBRSxLQUFLO1NBQ2hCLENBQUE7SUFDSCxDQUFDO0lBQ0QsUUFBUSxFQUFFO1FBQ1IsWUFBWTtZQUNWLElBQUksT0FBTyxNQUFNLEtBQUssV0FBVztnQkFBRSxPQUFPLENBQUMsQ0FBQTtZQUUzQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFBO1lBQ3ZELHNDQUFzQztZQUV0QyxNQUFNLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRO2dCQUMxQixDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztnQkFDcEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBRXpELElBQUksS0FBSyxJQUFJLElBQUk7Z0JBQUUsT0FBTyxLQUFLLENBQUE7WUFFL0Isa0RBQWtEO1lBQ2xELG9EQUFvRDtZQUNwRCxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUN4QixDQUFDO0tBQ0Y7SUFDRCxPQUFPLEVBQUU7UUFDUCxZQUFZLENBQUUsVUFBcUIsRUFBRTtZQUNuQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFBO1lBQ3JCLGtEQUFrRDtZQUNsRCxpREFBaUQ7WUFDakQsTUFBTSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1lBQ2xELHNDQUFzQztZQUN0QywyQ0FBMkM7WUFDM0MsbURBQW1EO1lBQ25ELE1BQU0sY0FBYyxHQUFHO2dCQUNyQixHQUFHLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyx5QkFBeUIsQ0FBQztnQkFDN0QsR0FBRyxRQUFRLENBQUMsc0JBQXNCLENBQUMsMkJBQTJCLENBQUM7YUFDaEUsQ0FBQTtZQUVELHFDQUFxQztZQUNyQyxLQUFLLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsY0FBYyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTtnQkFDMUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7b0JBQzVDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7aUJBQzNDO2FBQ0Y7WUFFRCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQTtRQUN6QixDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVnVlIGZyb20gJ3Z1ZSdcblxuaW1wb3J0IHsgZ2V0WkluZGV4IH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuXG5pbnRlcmZhY2Ugb3B0aW9ucyBleHRlbmRzIFZ1ZSB7XG4gICRyZWZzOiB7XG4gICAgY29udGVudDogRWxlbWVudFxuICB9XG59XG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBWdWUuZXh0ZW5kPG9wdGlvbnM+KCkuZXh0ZW5kKHtcbiAgbmFtZTogJ3N0YWNrYWJsZScsXG5cbiAgZGF0YSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YWNrRWxlbWVudDogbnVsbCBhcyBFbGVtZW50IHwgbnVsbCxcbiAgICAgIHN0YWNrRXhjbHVkZTogbnVsbCBhcyBFbGVtZW50W10gfCBudWxsLFxuICAgICAgc3RhY2tNaW5aSW5kZXg6IDAsXG4gICAgICBpc0FjdGl2ZTogZmFsc2UsXG4gICAgfVxuICB9LFxuICBjb21wdXRlZDoge1xuICAgIGFjdGl2ZVpJbmRleCAoKTogbnVtYmVyIHtcbiAgICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykgcmV0dXJuIDBcblxuICAgICAgY29uc3QgY29udGVudCA9IHRoaXMuc3RhY2tFbGVtZW50IHx8IHRoaXMuJHJlZnMuY29udGVudFxuICAgICAgLy8gUmV0dXJuIGN1cnJlbnQgemluZGV4IGlmIG5vdCBhY3RpdmVcblxuICAgICAgY29uc3QgaW5kZXggPSAhdGhpcy5pc0FjdGl2ZVxuICAgICAgICA/IGdldFpJbmRleChjb250ZW50KVxuICAgICAgICA6IHRoaXMuZ2V0TWF4WkluZGV4KHRoaXMuc3RhY2tFeGNsdWRlIHx8IFtjb250ZW50XSkgKyAyXG5cbiAgICAgIGlmIChpbmRleCA9PSBudWxsKSByZXR1cm4gaW5kZXhcblxuICAgICAgLy8gUmV0dXJuIG1heCBjdXJyZW50IHotaW5kZXggKGV4Y2x1ZGluZyBzZWxmKSArIDJcbiAgICAgIC8vICgyIHRvIGxlYXZlIHJvb20gZm9yIGFuIG92ZXJsYXkgYmVsb3csIGlmIG5lZWRlZClcbiAgICAgIHJldHVybiBwYXJzZUludChpbmRleClcbiAgICB9LFxuICB9LFxuICBtZXRob2RzOiB7XG4gICAgZ2V0TWF4WkluZGV4IChleGNsdWRlOiBFbGVtZW50W10gPSBbXSkge1xuICAgICAgY29uc3QgYmFzZSA9IHRoaXMuJGVsXG4gICAgICAvLyBTdGFydCB3aXRoIGxvd2VzdCBhbGxvd2VkIHotaW5kZXggb3Igei1pbmRleCBvZlxuICAgICAgLy8gYmFzZSBjb21wb25lbnQncyBlbGVtZW50LCB3aGljaGV2ZXIgaXMgZ3JlYXRlclxuICAgICAgY29uc3QgemlzID0gW3RoaXMuc3RhY2tNaW5aSW5kZXgsIGdldFpJbmRleChiYXNlKV1cbiAgICAgIC8vIENvbnZlcnQgdGhlIE5vZGVMaXN0IHRvIGFuIGFycmF5IHRvXG4gICAgICAvLyBwcmV2ZW50IGFuIEVkZ2UgYnVnIHdpdGggU3ltYm9sLml0ZXJhdG9yXG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdnVldGlmeWpzL3Z1ZXRpZnkvaXNzdWVzLzIxNDZcbiAgICAgIGNvbnN0IGFjdGl2ZUVsZW1lbnRzID0gW1xuICAgICAgICAuLi5kb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd2LW1lbnVfX2NvbnRlbnQtLWFjdGl2ZScpLFxuICAgICAgICAuLi5kb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd2LWRpYWxvZ19fY29udGVudC0tYWN0aXZlJyksXG4gICAgICBdXG5cbiAgICAgIC8vIEdldCB6LWluZGV4IGZvciBhbGwgYWN0aXZlIGRpYWxvZ3NcbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBhY3RpdmVFbGVtZW50cy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgaWYgKCFleGNsdWRlLmluY2x1ZGVzKGFjdGl2ZUVsZW1lbnRzW2luZGV4XSkpIHtcbiAgICAgICAgICB6aXMucHVzaChnZXRaSW5kZXgoYWN0aXZlRWxlbWVudHNbaW5kZXhdKSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gTWF0aC5tYXgoLi4uemlzKVxuICAgIH0sXG4gIH0sXG59KVxuIl19