// Mixins
import Measurable from '../../mixins/measurable';
import Toggleable from '../../mixins/toggleable';
// Directives
import intersect from '../../directives/intersect';
// Utilities
import mixins from '../../util/mixins';
import { getSlot } from '../../util/helpers';
export default mixins(Measurable, Toggleable).extend({
    name: 'VLazy',
    directives: { intersect },
    props: {
        options: {
            type: Object,
            // For more information on types, navigate to:
            // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
            default: () => ({
                root: undefined,
                rootMargin: undefined,
                threshold: undefined,
            }),
        },
        tag: {
            type: String,
            default: 'div',
        },
        transition: {
            type: String,
            default: 'fade-transition',
        },
    },
    computed: {
        styles() {
            return {
                ...this.measurableStyles,
            };
        },
    },
    methods: {
        genContent() {
            const slot = getSlot(this);
            /* istanbul ignore if */
            if (!this.transition)
                return slot;
            const children = [];
            if (this.isActive)
                children.push(slot);
            return this.$createElement('transition', {
                props: { name: this.transition },
            }, children);
        },
        onObserve(entries, observer, isIntersecting) {
            if (this.isActive)
                return;
            this.isActive = isIntersecting;
        },
    },
    render(h) {
        return h(this.tag, {
            staticClass: 'v-lazy',
            attrs: this.$attrs,
            directives: [{
                    name: 'intersect',
                    value: {
                        handler: this.onObserve,
                        options: this.options,
                    },
                }],
            on: this.$listeners,
            style: this.styles,
        }, [this.genContent()]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkxhenkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WTGF6eS9WTGF6eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFDaEQsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFFaEQsYUFBYTtBQUNiLE9BQU8sU0FBUyxNQUFNLDRCQUE0QixDQUFBO0FBRWxELFlBQVk7QUFDWixPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQUN0QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFNNUMsZUFBZSxNQUFNLENBQ25CLFVBQVUsRUFDVixVQUFVLENBQ1gsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUsT0FBTztJQUViLFVBQVUsRUFBRSxFQUFFLFNBQVMsRUFBRTtJQUV6QixLQUFLLEVBQUU7UUFDTCxPQUFPLEVBQUU7WUFDUCxJQUFJLEVBQUUsTUFBTTtZQUNaLDhDQUE4QztZQUM5Qyw2RUFBNkU7WUFDN0UsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBQ2QsSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsVUFBVSxFQUFFLFNBQVM7Z0JBQ3JCLFNBQVMsRUFBRSxTQUFTO2FBQ3JCLENBQUM7U0FDd0M7UUFDNUMsR0FBRyxFQUFFO1lBQ0gsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsS0FBSztTQUNmO1FBQ0QsVUFBVSxFQUFFO1lBQ1YsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsaUJBQWlCO1NBQzNCO0tBQ0Y7SUFFRCxRQUFRLEVBQUU7UUFDUixNQUFNO1lBQ0osT0FBTztnQkFDTCxHQUFHLElBQUksQ0FBQyxnQkFBZ0I7YUFDekIsQ0FBQTtRQUNILENBQUM7S0FDRjtJQUVELE9BQU8sRUFBRTtRQUNQLFVBQVU7WUFDUixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7WUFFMUIsd0JBQXdCO1lBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVTtnQkFBRSxPQUFPLElBQUksQ0FBQTtZQUVqQyxNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUE7WUFFbkIsSUFBSSxJQUFJLENBQUMsUUFBUTtnQkFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1lBRXRDLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUU7Z0JBQ3ZDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFO2FBQ2pDLEVBQUUsUUFBUSxDQUFDLENBQUE7UUFDZCxDQUFDO1FBQ0QsU0FBUyxDQUNQLE9BQW9DLEVBQ3BDLFFBQThCLEVBQzlCLGNBQXVCO1lBRXZCLElBQUksSUFBSSxDQUFDLFFBQVE7Z0JBQUUsT0FBTTtZQUV6QixJQUFJLENBQUMsUUFBUSxHQUFHLGNBQWMsQ0FBQTtRQUNoQyxDQUFDO0tBQ0Y7SUFFRCxNQUFNLENBQUUsQ0FBQztRQUNQLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDakIsV0FBVyxFQUFFLFFBQVE7WUFDckIsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNO1lBQ2xCLFVBQVUsRUFBRSxDQUFDO29CQUNYLElBQUksRUFBRSxXQUFXO29CQUNqQixLQUFLLEVBQUU7d0JBQ0wsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTO3dCQUN2QixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87cUJBQ3RCO2lCQUNGLENBQUM7WUFDRixFQUFFLEVBQUUsSUFBSSxDQUFDLFVBQVU7WUFDbkIsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNO1NBQ25CLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFBO0lBQ3pCLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBNaXhpbnNcbmltcG9ydCBNZWFzdXJhYmxlIGZyb20gJy4uLy4uL21peGlucy9tZWFzdXJhYmxlJ1xuaW1wb3J0IFRvZ2dsZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RvZ2dsZWFibGUnXG5cbi8vIERpcmVjdGl2ZXNcbmltcG9ydCBpbnRlcnNlY3QgZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9pbnRlcnNlY3QnXG5cbi8vIFV0aWxpdGllc1xuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcbmltcG9ydCB7IGdldFNsb3QgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZSdcbmltcG9ydCB7IFByb3BWYWxpZGF0b3IgfSBmcm9tICd2dWUvdHlwZXMvb3B0aW9ucydcblxuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFxuICBNZWFzdXJhYmxlLFxuICBUb2dnbGVhYmxlXG4pLmV4dGVuZCh7XG4gIG5hbWU6ICdWTGF6eScsXG5cbiAgZGlyZWN0aXZlczogeyBpbnRlcnNlY3QgfSxcblxuICBwcm9wczoge1xuICAgIG9wdGlvbnM6IHtcbiAgICAgIHR5cGU6IE9iamVjdCxcbiAgICAgIC8vIEZvciBtb3JlIGluZm9ybWF0aW9uIG9uIHR5cGVzLCBuYXZpZ2F0ZSB0bzpcbiAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9JbnRlcnNlY3Rpb25fT2JzZXJ2ZXJfQVBJXG4gICAgICBkZWZhdWx0OiAoKSA9PiAoe1xuICAgICAgICByb290OiB1bmRlZmluZWQsXG4gICAgICAgIHJvb3RNYXJnaW46IHVuZGVmaW5lZCxcbiAgICAgICAgdGhyZXNob2xkOiB1bmRlZmluZWQsXG4gICAgICB9KSxcbiAgICB9IGFzIFByb3BWYWxpZGF0b3I8SW50ZXJzZWN0aW9uT2JzZXJ2ZXJJbml0PixcbiAgICB0YWc6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICdkaXYnLFxuICAgIH0sXG4gICAgdHJhbnNpdGlvbjoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJ2ZhZGUtdHJhbnNpdGlvbicsXG4gICAgfSxcbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIHN0eWxlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnRoaXMubWVhc3VyYWJsZVN0eWxlcyxcbiAgICAgIH1cbiAgICB9LFxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBnZW5Db250ZW50ICgpIHtcbiAgICAgIGNvbnN0IHNsb3QgPSBnZXRTbG90KHRoaXMpXG5cbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgaWYgKCF0aGlzLnRyYW5zaXRpb24pIHJldHVybiBzbG90XG5cbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gW11cblxuICAgICAgaWYgKHRoaXMuaXNBY3RpdmUpIGNoaWxkcmVuLnB1c2goc2xvdClcblxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ3RyYW5zaXRpb24nLCB7XG4gICAgICAgIHByb3BzOiB7IG5hbWU6IHRoaXMudHJhbnNpdGlvbiB9LFxuICAgICAgfSwgY2hpbGRyZW4pXG4gICAgfSxcbiAgICBvbk9ic2VydmUgKFxuICAgICAgZW50cmllczogSW50ZXJzZWN0aW9uT2JzZXJ2ZXJFbnRyeVtdLFxuICAgICAgb2JzZXJ2ZXI6IEludGVyc2VjdGlvbk9ic2VydmVyLFxuICAgICAgaXNJbnRlcnNlY3Rpbmc6IGJvb2xlYW4sXG4gICAgKSB7XG4gICAgICBpZiAodGhpcy5pc0FjdGl2ZSkgcmV0dXJuXG5cbiAgICAgIHRoaXMuaXNBY3RpdmUgPSBpc0ludGVyc2VjdGluZ1xuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyIChoKTogVk5vZGUge1xuICAgIHJldHVybiBoKHRoaXMudGFnLCB7XG4gICAgICBzdGF0aWNDbGFzczogJ3YtbGF6eScsXG4gICAgICBhdHRyczogdGhpcy4kYXR0cnMsXG4gICAgICBkaXJlY3RpdmVzOiBbe1xuICAgICAgICBuYW1lOiAnaW50ZXJzZWN0JyxcbiAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICBoYW5kbGVyOiB0aGlzLm9uT2JzZXJ2ZSxcbiAgICAgICAgICBvcHRpb25zOiB0aGlzLm9wdGlvbnMsXG4gICAgICAgIH0sXG4gICAgICB9XSxcbiAgICAgIG9uOiB0aGlzLiRsaXN0ZW5lcnMsXG4gICAgICBzdHlsZTogdGhpcy5zdHlsZXMsXG4gICAgfSwgW3RoaXMuZ2VuQ29udGVudCgpXSlcbiAgfSxcbn0pXG4iXX0=