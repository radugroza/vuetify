// Utilities
import { removed } from '../../util/console';
// Types
import Vue from 'vue';
/**
 * Bootable
 * @mixin
 *
 * Used to add lazy content functionality to components
 * Looks for change in "isActive" to automatically boot
 * Otherwise can be set manually
 */
/* @vue/component */
export default Vue.extend().extend({
    name: 'bootable',
    props: {
        eager: Boolean,
    },
    data: () => ({
        isBooted: false,
    }),
    computed: {
        hasContent() {
            return this.isBooted || this.eager || this.isActive;
        },
    },
    watch: {
        isActive() {
            this.isBooted = true;
        },
    },
    created() {
        /* istanbul ignore next */
        if ('lazy' in this.$attrs) {
            removed('lazy', this);
        }
    },
    methods: {
        showLazyContent(content) {
            return (this.hasContent && content) ? content() : [this.$createElement()];
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL2Jvb3RhYmxlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVk7QUFDWixPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFFNUMsUUFBUTtBQUNSLE9BQU8sR0FBYyxNQUFNLEtBQUssQ0FBQTtBQUtoQzs7Ozs7OztHQU9HO0FBQ0gsb0JBQW9CO0FBQ3BCLGVBQWUsR0FBRyxDQUFDLE1BQU0sRUFBb0IsQ0FBQyxNQUFNLENBQUM7SUFDbkQsSUFBSSxFQUFFLFVBQVU7SUFFaEIsS0FBSyxFQUFFO1FBQ0wsS0FBSyxFQUFFLE9BQU87S0FDZjtJQUVELElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ1gsUUFBUSxFQUFFLEtBQUs7S0FDaEIsQ0FBQztJQUVGLFFBQVEsRUFBRTtRQUNSLFVBQVU7WUFDUixPQUFPLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFBO1FBQ3JELENBQUM7S0FDRjtJQUVELEtBQUssRUFBRTtRQUNMLFFBQVE7WUFDTixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQTtRQUN0QixDQUFDO0tBQ0Y7SUFFRCxPQUFPO1FBQ0wsMEJBQTBCO1FBQzFCLElBQUksTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDekIsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQTtTQUN0QjtJQUNILENBQUM7SUFFRCxPQUFPLEVBQUU7UUFDUCxlQUFlLENBQUUsT0FBdUI7WUFDdEMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFBO1FBQzNFLENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFV0aWxpdGllc1xuaW1wb3J0IHsgcmVtb3ZlZCB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcblxuLy8gVHlwZXNcbmltcG9ydCBWdWUsIHsgVk5vZGUgfSBmcm9tICd2dWUnXG5pbnRlcmZhY2UgVG9nZ2xlYWJsZSBleHRlbmRzIFZ1ZSB7XG4gIGlzQWN0aXZlPzogYm9vbGVhblxufVxuXG4vKipcbiAqIEJvb3RhYmxlXG4gKiBAbWl4aW5cbiAqXG4gKiBVc2VkIHRvIGFkZCBsYXp5IGNvbnRlbnQgZnVuY3Rpb25hbGl0eSB0byBjb21wb25lbnRzXG4gKiBMb29rcyBmb3IgY2hhbmdlIGluIFwiaXNBY3RpdmVcIiB0byBhdXRvbWF0aWNhbGx5IGJvb3RcbiAqIE90aGVyd2lzZSBjYW4gYmUgc2V0IG1hbnVhbGx5XG4gKi9cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBWdWUuZXh0ZW5kPFZ1ZSAmIFRvZ2dsZWFibGU+KCkuZXh0ZW5kKHtcbiAgbmFtZTogJ2Jvb3RhYmxlJyxcblxuICBwcm9wczoge1xuICAgIGVhZ2VyOiBCb29sZWFuLFxuICB9LFxuXG4gIGRhdGE6ICgpID0+ICh7XG4gICAgaXNCb290ZWQ6IGZhbHNlLFxuICB9KSxcblxuICBjb21wdXRlZDoge1xuICAgIGhhc0NvbnRlbnQgKCk6IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuICAgICAgcmV0dXJuIHRoaXMuaXNCb290ZWQgfHwgdGhpcy5lYWdlciB8fCB0aGlzLmlzQWN0aXZlXG4gICAgfSxcbiAgfSxcblxuICB3YXRjaDoge1xuICAgIGlzQWN0aXZlICgpIHtcbiAgICAgIHRoaXMuaXNCb290ZWQgPSB0cnVlXG4gICAgfSxcbiAgfSxcblxuICBjcmVhdGVkICgpIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGlmICgnbGF6eScgaW4gdGhpcy4kYXR0cnMpIHtcbiAgICAgIHJlbW92ZWQoJ2xhenknLCB0aGlzKVxuICAgIH1cbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgc2hvd0xhenlDb250ZW50IChjb250ZW50PzogKCkgPT4gVk5vZGVbXSk6IFZOb2RlW10ge1xuICAgICAgcmV0dXJuICh0aGlzLmhhc0NvbnRlbnQgJiYgY29udGVudCkgPyBjb250ZW50KCkgOiBbdGhpcy4kY3JlYXRlRWxlbWVudCgpXVxuICAgIH0sXG4gIH0sXG59KVxuIl19