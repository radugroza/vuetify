// Directives
import Intersect from '../../directives/intersect';
// Utilities
import { consoleWarn } from '../../util/console';
// Types
import Vue from 'vue';
export default function intersectable(options) {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
        // do nothing because intersection observer is not available
        return Vue.extend({ name: 'intersectable' });
    }
    return Vue.extend({
        name: 'intersectable',
        mounted() {
            Intersect.inserted(this.$el, {
                name: 'intersect',
                value: this.onObserve,
            });
        },
        destroyed() {
            Intersect.unbind(this.$el);
        },
        methods: {
            onObserve(entries, observer, isIntersecting) {
                if (!isIntersecting)
                    return;
                for (let i = 0, length = options.onVisible.length; i < length; i++) {
                    const callback = this[options.onVisible[i]];
                    if (typeof callback === 'function') {
                        callback();
                        continue;
                    }
                    consoleWarn(options.onVisible[i] + ' method is not available on the instance but referenced in intersectable mixin options');
                }
            },
        },
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL2ludGVyc2VjdGFibGUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsYUFBYTtBQUNiLE9BQU8sU0FBUyxNQUFNLDRCQUE0QixDQUFBO0FBRWxELFlBQVk7QUFDWixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFFaEQsUUFBUTtBQUNSLE9BQU8sR0FBRyxNQUFNLEtBQUssQ0FBQTtBQUVyQixNQUFNLENBQUMsT0FBTyxVQUFVLGFBQWEsQ0FBRSxPQUFnQztJQUNyRSxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsSUFBSSxDQUFDLENBQUMsc0JBQXNCLElBQUksTUFBTSxDQUFDLEVBQUU7UUFDeEUsNERBQTREO1FBQzVELE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxlQUFlLEVBQUUsQ0FBQyxDQUFBO0tBQzdDO0lBRUQsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQ2hCLElBQUksRUFBRSxlQUFlO1FBRXJCLE9BQU87WUFDTCxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFrQixFQUFFO2dCQUMxQyxJQUFJLEVBQUUsV0FBVztnQkFDakIsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTO2FBQ3RCLENBQUMsQ0FBQTtRQUNKLENBQUM7UUFFRCxTQUFTO1lBQ1AsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBa0IsQ0FBQyxDQUFBO1FBQzNDLENBQUM7UUFFRCxPQUFPLEVBQUU7WUFDUCxTQUFTLENBQUUsT0FBb0MsRUFBRSxRQUE4QixFQUFFLGNBQXVCO2dCQUN0RyxJQUFJLENBQUMsY0FBYztvQkFBRSxPQUFNO2dCQUUzQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDbEUsTUFBTSxRQUFRLEdBQUksSUFBWSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtvQkFFcEQsSUFBSSxPQUFPLFFBQVEsS0FBSyxVQUFVLEVBQUU7d0JBQ2xDLFFBQVEsRUFBRSxDQUFBO3dCQUNWLFNBQVE7cUJBQ1Q7b0JBRUQsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsd0ZBQXdGLENBQUMsQ0FBQTtpQkFDN0g7WUFDSCxDQUFDO1NBQ0Y7S0FDRixDQUFDLENBQUE7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRGlyZWN0aXZlc1xuaW1wb3J0IEludGVyc2VjdCBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL2ludGVyc2VjdCdcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgeyBjb25zb2xlV2FybiB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcblxuLy8gVHlwZXNcbmltcG9ydCBWdWUgZnJvbSAndnVlJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpbnRlcnNlY3RhYmxlIChvcHRpb25zOiB7IG9uVmlzaWJsZTogc3RyaW5nW10gfSkge1xuICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgfHwgISgnSW50ZXJzZWN0aW9uT2JzZXJ2ZXInIGluIHdpbmRvdykpIHtcbiAgICAvLyBkbyBub3RoaW5nIGJlY2F1c2UgaW50ZXJzZWN0aW9uIG9ic2VydmVyIGlzIG5vdCBhdmFpbGFibGVcbiAgICByZXR1cm4gVnVlLmV4dGVuZCh7IG5hbWU6ICdpbnRlcnNlY3RhYmxlJyB9KVxuICB9XG5cbiAgcmV0dXJuIFZ1ZS5leHRlbmQoe1xuICAgIG5hbWU6ICdpbnRlcnNlY3RhYmxlJyxcblxuICAgIG1vdW50ZWQgKCkge1xuICAgICAgSW50ZXJzZWN0Lmluc2VydGVkKHRoaXMuJGVsIGFzIEhUTUxFbGVtZW50LCB7XG4gICAgICAgIG5hbWU6ICdpbnRlcnNlY3QnLFxuICAgICAgICB2YWx1ZTogdGhpcy5vbk9ic2VydmUsXG4gICAgICB9KVxuICAgIH0sXG5cbiAgICBkZXN0cm95ZWQgKCkge1xuICAgICAgSW50ZXJzZWN0LnVuYmluZCh0aGlzLiRlbCBhcyBIVE1MRWxlbWVudClcbiAgICB9LFxuXG4gICAgbWV0aG9kczoge1xuICAgICAgb25PYnNlcnZlIChlbnRyaWVzOiBJbnRlcnNlY3Rpb25PYnNlcnZlckVudHJ5W10sIG9ic2VydmVyOiBJbnRlcnNlY3Rpb25PYnNlcnZlciwgaXNJbnRlcnNlY3Rpbmc6IGJvb2xlYW4pIHtcbiAgICAgICAgaWYgKCFpc0ludGVyc2VjdGluZykgcmV0dXJuXG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IG9wdGlvbnMub25WaXNpYmxlLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgY2FsbGJhY2sgPSAodGhpcyBhcyBhbnkpW29wdGlvbnMub25WaXNpYmxlW2ldXVxuXG4gICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FsbGJhY2soKVxuICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zb2xlV2FybihvcHRpb25zLm9uVmlzaWJsZVtpXSArICcgbWV0aG9kIGlzIG5vdCBhdmFpbGFibGUgb24gdGhlIGluc3RhbmNlIGJ1dCByZWZlcmVuY2VkIGluIGludGVyc2VjdGFibGUgbWl4aW4gb3B0aW9ucycpXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSxcbiAgfSlcbn1cbiJdfQ==