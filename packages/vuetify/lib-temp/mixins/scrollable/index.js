// Directives
import { Scroll } from '../../directives';
// Utilities
import { consoleWarn } from '../../util/console';
// Types
import Vue from 'vue';
/**
 * Scrollable
 *
 * Used for monitoring scrolling and
 * invoking functions based upon
 * scrolling thresholds being
 * met.
 */
/* @vue/component */
export default Vue.extend({
    name: 'scrollable',
    directives: { Scroll },
    props: {
        scrollTarget: String,
        scrollThreshold: [String, Number],
    },
    data: () => ({
        currentScroll: 0,
        currentThreshold: 0,
        isActive: false,
        isScrollingUp: false,
        previousScroll: 0,
        savedScroll: 0,
        target: null,
    }),
    computed: {
        /**
         * A computed property that returns
         * whether scrolling features are
         * enabled or disabled
         */
        canScroll() {
            return typeof window !== 'undefined';
        },
        /**
         * The threshold that must be met before
         * thresholdMet function is invoked
         */
        computedScrollThreshold() {
            return this.scrollThreshold
                ? Number(this.scrollThreshold)
                : 300;
        },
    },
    watch: {
        isScrollingUp() {
            this.savedScroll = this.savedScroll || this.currentScroll;
        },
        isActive() {
            this.savedScroll = 0;
        },
    },
    mounted() {
        if (this.scrollTarget) {
            this.target = document.querySelector(this.scrollTarget);
            if (!this.target) {
                consoleWarn(`Unable to locate element with identifier ${this.scrollTarget}`, this);
            }
        }
    },
    methods: {
        onScroll() {
            if (!this.canScroll)
                return;
            this.previousScroll = this.currentScroll;
            this.currentScroll = this.target
                ? this.target.scrollTop
                : window.pageYOffset;
            this.isScrollingUp = this.currentScroll < this.previousScroll;
            this.currentThreshold = Math.abs(this.currentScroll - this.computedScrollThreshold);
            this.$nextTick(() => {
                if (Math.abs(this.currentScroll - this.savedScroll) >
                    this.computedScrollThreshold)
                    this.thresholdMet();
            });
        },
        /**
         * The method invoked when
         * scrolling in any direction
         * has exceeded the threshold
         */
        thresholdMet() { },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL3Njcm9sbGFibGUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsYUFBYTtBQUNiLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQTtBQUV6QyxZQUFZO0FBQ1osT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBRWhELFFBQVE7QUFDUixPQUFPLEdBQUcsTUFBTSxLQUFLLENBQUE7QUFFckI7Ozs7Ozs7R0FPRztBQUNILG9CQUFvQjtBQUNwQixlQUFlLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFDeEIsSUFBSSxFQUFFLFlBQVk7SUFFbEIsVUFBVSxFQUFFLEVBQUUsTUFBTSxFQUFFO0lBRXRCLEtBQUssRUFBRTtRQUNMLFlBQVksRUFBRSxNQUFNO1FBQ3BCLGVBQWUsRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7S0FDbEM7SUFFRCxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNYLGFBQWEsRUFBRSxDQUFDO1FBQ2hCLGdCQUFnQixFQUFFLENBQUM7UUFDbkIsUUFBUSxFQUFFLEtBQUs7UUFDZixhQUFhLEVBQUUsS0FBSztRQUNwQixjQUFjLEVBQUUsQ0FBQztRQUNqQixXQUFXLEVBQUUsQ0FBQztRQUNkLE1BQU0sRUFBRSxJQUFzQjtLQUMvQixDQUFDO0lBRUYsUUFBUSxFQUFFO1FBQ1I7Ozs7V0FJRztRQUNILFNBQVM7WUFDUCxPQUFPLE9BQU8sTUFBTSxLQUFLLFdBQVcsQ0FBQTtRQUN0QyxDQUFDO1FBQ0Q7OztXQUdHO1FBQ0gsdUJBQXVCO1lBQ3JCLE9BQU8sSUFBSSxDQUFDLGVBQWU7Z0JBQ3pCLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztnQkFDOUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQTtRQUNULENBQUM7S0FDRjtJQUVELEtBQUssRUFBRTtRQUNMLGFBQWE7WUFDWCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQTtRQUMzRCxDQUFDO1FBQ0QsUUFBUTtZQUNOLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFBO1FBQ3RCLENBQUM7S0FDRjtJQUVELE9BQU87UUFDTCxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQTtZQUV2RCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDaEIsV0FBVyxDQUFDLDRDQUE0QyxJQUFJLENBQUMsWUFBWSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUE7YUFDbkY7U0FDRjtJQUNILENBQUM7SUFFRCxPQUFPLEVBQUU7UUFDUCxRQUFRO1lBQ04sSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTO2dCQUFFLE9BQU07WUFFM0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFBO1lBQ3hDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLE1BQU07Z0JBQzlCLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVM7Z0JBQ3ZCLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFBO1lBRXRCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFBO1lBQzdELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUE7WUFFbkYsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2xCLElBQ0UsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7b0JBQy9DLElBQUksQ0FBQyx1QkFBdUI7b0JBQzVCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQTtZQUN2QixDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUM7UUFDRDs7OztXQUlHO1FBQ0gsWUFBWSxLQUFpQixDQUFDO0tBQy9CO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRGlyZWN0aXZlc1xuaW1wb3J0IHsgU2Nyb2xsIH0gZnJvbSAnLi4vLi4vZGlyZWN0aXZlcydcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgeyBjb25zb2xlV2FybiB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcblxuLy8gVHlwZXNcbmltcG9ydCBWdWUgZnJvbSAndnVlJ1xuXG4vKipcbiAqIFNjcm9sbGFibGVcbiAqXG4gKiBVc2VkIGZvciBtb25pdG9yaW5nIHNjcm9sbGluZyBhbmRcbiAqIGludm9raW5nIGZ1bmN0aW9ucyBiYXNlZCB1cG9uXG4gKiBzY3JvbGxpbmcgdGhyZXNob2xkcyBiZWluZ1xuICogbWV0LlxuICovXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuZXhwb3J0IGRlZmF1bHQgVnVlLmV4dGVuZCh7XG4gIG5hbWU6ICdzY3JvbGxhYmxlJyxcblxuICBkaXJlY3RpdmVzOiB7IFNjcm9sbCB9LFxuXG4gIHByb3BzOiB7XG4gICAgc2Nyb2xsVGFyZ2V0OiBTdHJpbmcsXG4gICAgc2Nyb2xsVGhyZXNob2xkOiBbU3RyaW5nLCBOdW1iZXJdLFxuICB9LFxuXG4gIGRhdGE6ICgpID0+ICh7XG4gICAgY3VycmVudFNjcm9sbDogMCxcbiAgICBjdXJyZW50VGhyZXNob2xkOiAwLFxuICAgIGlzQWN0aXZlOiBmYWxzZSxcbiAgICBpc1Njcm9sbGluZ1VwOiBmYWxzZSxcbiAgICBwcmV2aW91c1Njcm9sbDogMCxcbiAgICBzYXZlZFNjcm9sbDogMCxcbiAgICB0YXJnZXQ6IG51bGwgYXMgRWxlbWVudCB8IG51bGwsXG4gIH0pLFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgLyoqXG4gICAgICogQSBjb21wdXRlZCBwcm9wZXJ0eSB0aGF0IHJldHVybnNcbiAgICAgKiB3aGV0aGVyIHNjcm9sbGluZyBmZWF0dXJlcyBhcmVcbiAgICAgKiBlbmFibGVkIG9yIGRpc2FibGVkXG4gICAgICovXG4gICAgY2FuU2Nyb2xsICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogVGhlIHRocmVzaG9sZCB0aGF0IG11c3QgYmUgbWV0IGJlZm9yZVxuICAgICAqIHRocmVzaG9sZE1ldCBmdW5jdGlvbiBpcyBpbnZva2VkXG4gICAgICovXG4gICAgY29tcHV0ZWRTY3JvbGxUaHJlc2hvbGQgKCk6IG51bWJlciB7XG4gICAgICByZXR1cm4gdGhpcy5zY3JvbGxUaHJlc2hvbGRcbiAgICAgICAgPyBOdW1iZXIodGhpcy5zY3JvbGxUaHJlc2hvbGQpXG4gICAgICAgIDogMzAwXG4gICAgfSxcbiAgfSxcblxuICB3YXRjaDoge1xuICAgIGlzU2Nyb2xsaW5nVXAgKCkge1xuICAgICAgdGhpcy5zYXZlZFNjcm9sbCA9IHRoaXMuc2F2ZWRTY3JvbGwgfHwgdGhpcy5jdXJyZW50U2Nyb2xsXG4gICAgfSxcbiAgICBpc0FjdGl2ZSAoKSB7XG4gICAgICB0aGlzLnNhdmVkU2Nyb2xsID0gMFxuICAgIH0sXG4gIH0sXG5cbiAgbW91bnRlZCAoKSB7XG4gICAgaWYgKHRoaXMuc2Nyb2xsVGFyZ2V0KSB7XG4gICAgICB0aGlzLnRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5zY3JvbGxUYXJnZXQpXG5cbiAgICAgIGlmICghdGhpcy50YXJnZXQpIHtcbiAgICAgICAgY29uc29sZVdhcm4oYFVuYWJsZSB0byBsb2NhdGUgZWxlbWVudCB3aXRoIGlkZW50aWZpZXIgJHt0aGlzLnNjcm9sbFRhcmdldH1gLCB0aGlzKVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgb25TY3JvbGwgKCkge1xuICAgICAgaWYgKCF0aGlzLmNhblNjcm9sbCkgcmV0dXJuXG5cbiAgICAgIHRoaXMucHJldmlvdXNTY3JvbGwgPSB0aGlzLmN1cnJlbnRTY3JvbGxcbiAgICAgIHRoaXMuY3VycmVudFNjcm9sbCA9IHRoaXMudGFyZ2V0XG4gICAgICAgID8gdGhpcy50YXJnZXQuc2Nyb2xsVG9wXG4gICAgICAgIDogd2luZG93LnBhZ2VZT2Zmc2V0XG5cbiAgICAgIHRoaXMuaXNTY3JvbGxpbmdVcCA9IHRoaXMuY3VycmVudFNjcm9sbCA8IHRoaXMucHJldmlvdXNTY3JvbGxcbiAgICAgIHRoaXMuY3VycmVudFRocmVzaG9sZCA9IE1hdGguYWJzKHRoaXMuY3VycmVudFNjcm9sbCAtIHRoaXMuY29tcHV0ZWRTY3JvbGxUaHJlc2hvbGQpXG5cbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIE1hdGguYWJzKHRoaXMuY3VycmVudFNjcm9sbCAtIHRoaXMuc2F2ZWRTY3JvbGwpID5cbiAgICAgICAgICB0aGlzLmNvbXB1dGVkU2Nyb2xsVGhyZXNob2xkXG4gICAgICAgICkgdGhpcy50aHJlc2hvbGRNZXQoKVxuICAgICAgfSlcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFRoZSBtZXRob2QgaW52b2tlZCB3aGVuXG4gICAgICogc2Nyb2xsaW5nIGluIGFueSBkaXJlY3Rpb25cbiAgICAgKiBoYXMgZXhjZWVkZWQgdGhlIHRocmVzaG9sZFxuICAgICAqL1xuICAgIHRocmVzaG9sZE1ldCAoKSB7IC8qIG5vb3AgKi8gfSxcbiAgfSxcbn0pXG4iXX0=