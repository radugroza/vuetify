// Extensions
import { BaseSlideGroup } from '../VSlideGroup/VSlideGroup';
// Mixins
import Themeable from '../../mixins/themeable';
import SSRBootable from '../../mixins/ssr-bootable';
// Utilities
import mixins from '../../util/mixins';
export default mixins(BaseSlideGroup, SSRBootable, Themeable
/* @vue/component */
).extend({
    name: 'v-tabs-bar',
    provide() {
        return {
            tabsBar: this,
        };
    },
    computed: {
        classes() {
            return {
                ...BaseSlideGroup.options.computed.classes.call(this),
                'v-tabs-bar': true,
                'v-tabs-bar--is-mobile': this.isMobile,
                // TODO: Remove this and move to v-slide-group
                'v-tabs-bar--show-arrows': this.showArrows,
                ...this.themeClasses,
            };
        },
    },
    watch: {
        items: 'callSlider',
        internalValue: 'callSlider',
        $route: 'onRouteChange',
    },
    methods: {
        callSlider() {
            if (!this.isBooted)
                return;
            this.$emit('call:slider');
        },
        genContent() {
            const render = BaseSlideGroup.options.methods.genContent.call(this);
            render.data = render.data || {};
            render.data.staticClass += ' v-tabs-bar__content';
            return render;
        },
        onRouteChange(val, oldVal) {
            /* istanbul ignore next */
            if (this.mandatory)
                return;
            const items = this.items;
            const newPath = val.path;
            const oldPath = oldVal.path;
            let hasNew = false;
            let hasOld = false;
            for (const item of items) {
                if (item.to === newPath)
                    hasNew = true;
                else if (item.to === oldPath)
                    hasOld = true;
                if (hasNew && hasOld)
                    break;
            }
            // If we have an old item and not a new one
            // it's assumed that the user navigated to
            // a path that is not present in the items
            if (!hasNew && hasOld)
                this.internalValue = undefined;
        },
    },
    render(h) {
        const render = BaseSlideGroup.options.render.call(this, h);
        render.data.attrs = {
            role: 'tablist',
        };
        return render;
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlRhYnNCYXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WVGFicy9WVGFic0Jhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxhQUFhO0FBQ2IsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDRCQUE0QixDQUFBO0FBSzNELFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFdBQVcsTUFBTSwyQkFBMkIsQ0FBQTtBQUVuRCxZQUFZO0FBQ1osT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFRdEMsZUFBZSxNQUFNLENBQ25CLGNBQWMsRUFDZCxXQUFXLEVBQ1gsU0FBUztBQUNULG9CQUFvQjtDQUNyQixDQUFDLE1BQU0sQ0FBQztJQUNQLElBQUksRUFBRSxZQUFZO0lBRWxCLE9BQU87UUFDTCxPQUFPO1lBQ0wsT0FBTyxFQUFFLElBQUk7U0FDZCxDQUFBO0lBQ0gsQ0FBQztJQUVELFFBQVEsRUFBRTtRQUNSLE9BQU87WUFDTCxPQUFPO2dCQUNMLEdBQUcsY0FBYyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQ3JELFlBQVksRUFBRSxJQUFJO2dCQUNsQix1QkFBdUIsRUFBRSxJQUFJLENBQUMsUUFBUTtnQkFDdEMsOENBQThDO2dCQUM5Qyx5QkFBeUIsRUFBRSxJQUFJLENBQUMsVUFBVTtnQkFDMUMsR0FBRyxJQUFJLENBQUMsWUFBWTthQUNyQixDQUFBO1FBQ0gsQ0FBQztLQUNGO0lBRUQsS0FBSyxFQUFFO1FBQ0wsS0FBSyxFQUFFLFlBQVk7UUFDbkIsYUFBYSxFQUFFLFlBQVk7UUFDM0IsTUFBTSxFQUFFLGVBQWU7S0FDeEI7SUFFRCxPQUFPLEVBQUU7UUFDUCxVQUFVO1lBQ1IsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRO2dCQUFFLE9BQU07WUFFMUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQTtRQUMzQixDQUFDO1FBQ0QsVUFBVTtZQUNSLE1BQU0sTUFBTSxHQUFHLGNBQWMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7WUFFbkUsTUFBTSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQTtZQUMvQixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxzQkFBc0IsQ0FBQTtZQUVqRCxPQUFPLE1BQU0sQ0FBQTtRQUNmLENBQUM7UUFDRCxhQUFhLENBQUUsR0FBVSxFQUFFLE1BQWE7WUFDdEMsMEJBQTBCO1lBQzFCLElBQUksSUFBSSxDQUFDLFNBQVM7Z0JBQUUsT0FBTTtZQUUxQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBdUIsQ0FBQTtZQUMxQyxNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFBO1lBQ3hCLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUE7WUFFM0IsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFBO1lBQ2xCLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQTtZQUVsQixLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssRUFBRTtnQkFDeEIsSUFBSSxJQUFJLENBQUMsRUFBRSxLQUFLLE9BQU87b0JBQUUsTUFBTSxHQUFHLElBQUksQ0FBQTtxQkFDakMsSUFBSSxJQUFJLENBQUMsRUFBRSxLQUFLLE9BQU87b0JBQUUsTUFBTSxHQUFHLElBQUksQ0FBQTtnQkFFM0MsSUFBSSxNQUFNLElBQUksTUFBTTtvQkFBRSxNQUFLO2FBQzVCO1lBRUQsMkNBQTJDO1lBQzNDLDBDQUEwQztZQUMxQywwQ0FBMEM7WUFDMUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxNQUFNO2dCQUFFLElBQUksQ0FBQyxhQUFhLEdBQUcsU0FBUyxDQUFBO1FBQ3ZELENBQUM7S0FDRjtJQUVELE1BQU0sQ0FBRSxDQUFDO1FBQ1AsTUFBTSxNQUFNLEdBQUcsY0FBYyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUUxRCxNQUFNLENBQUMsSUFBSyxDQUFDLEtBQUssR0FBRztZQUNuQixJQUFJLEVBQUUsU0FBUztTQUNoQixDQUFBO1FBRUQsT0FBTyxNQUFNLENBQUE7SUFDZixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRXh0ZW5zaW9uc1xuaW1wb3J0IHsgQmFzZVNsaWRlR3JvdXAgfSBmcm9tICcuLi9WU2xpZGVHcm91cC9WU2xpZGVHcm91cCdcblxuLy8gQ29tcG9uZW50c1xuaW1wb3J0IFZUYWIgZnJvbSAnLi9WVGFiJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcbmltcG9ydCBTU1JCb290YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvc3NyLWJvb3RhYmxlJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBSb3V0ZSB9IGZyb20gJ3Z1ZS1yb3V0ZXInXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZSdcblxudHlwZSBWVGFiSW5zdGFuY2UgPSBJbnN0YW5jZVR5cGU8dHlwZW9mIFZUYWI+XG5cbmV4cG9ydCBkZWZhdWx0IG1peGlucyhcbiAgQmFzZVNsaWRlR3JvdXAsXG4gIFNTUkJvb3RhYmxlLFxuICBUaGVtZWFibGVcbiAgLyogQHZ1ZS9jb21wb25lbnQgKi9cbikuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtdGFicy1iYXInLFxuXG4gIHByb3ZpZGUgKCkge1xuICAgIHJldHVybiB7XG4gICAgICB0YWJzQmFyOiB0aGlzLFxuICAgIH1cbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGNsYXNzZXMgKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uQmFzZVNsaWRlR3JvdXAub3B0aW9ucy5jb21wdXRlZC5jbGFzc2VzLmNhbGwodGhpcyksXG4gICAgICAgICd2LXRhYnMtYmFyJzogdHJ1ZSxcbiAgICAgICAgJ3YtdGFicy1iYXItLWlzLW1vYmlsZSc6IHRoaXMuaXNNb2JpbGUsXG4gICAgICAgIC8vIFRPRE86IFJlbW92ZSB0aGlzIGFuZCBtb3ZlIHRvIHYtc2xpZGUtZ3JvdXBcbiAgICAgICAgJ3YtdGFicy1iYXItLXNob3ctYXJyb3dzJzogdGhpcy5zaG93QXJyb3dzLFxuICAgICAgICAuLi50aGlzLnRoZW1lQ2xhc3NlcyxcbiAgICAgIH1cbiAgICB9LFxuICB9LFxuXG4gIHdhdGNoOiB7XG4gICAgaXRlbXM6ICdjYWxsU2xpZGVyJyxcbiAgICBpbnRlcm5hbFZhbHVlOiAnY2FsbFNsaWRlcicsXG4gICAgJHJvdXRlOiAnb25Sb3V0ZUNoYW5nZScsXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGNhbGxTbGlkZXIgKCkge1xuICAgICAgaWYgKCF0aGlzLmlzQm9vdGVkKSByZXR1cm5cblxuICAgICAgdGhpcy4kZW1pdCgnY2FsbDpzbGlkZXInKVxuICAgIH0sXG4gICAgZ2VuQ29udGVudCAoKSB7XG4gICAgICBjb25zdCByZW5kZXIgPSBCYXNlU2xpZGVHcm91cC5vcHRpb25zLm1ldGhvZHMuZ2VuQ29udGVudC5jYWxsKHRoaXMpXG5cbiAgICAgIHJlbmRlci5kYXRhID0gcmVuZGVyLmRhdGEgfHwge31cbiAgICAgIHJlbmRlci5kYXRhLnN0YXRpY0NsYXNzICs9ICcgdi10YWJzLWJhcl9fY29udGVudCdcblxuICAgICAgcmV0dXJuIHJlbmRlclxuICAgIH0sXG4gICAgb25Sb3V0ZUNoYW5nZSAodmFsOiBSb3V0ZSwgb2xkVmFsOiBSb3V0ZSkge1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgIGlmICh0aGlzLm1hbmRhdG9yeSkgcmV0dXJuXG5cbiAgICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5pdGVtcyBhcyBWVGFiSW5zdGFuY2VbXVxuICAgICAgY29uc3QgbmV3UGF0aCA9IHZhbC5wYXRoXG4gICAgICBjb25zdCBvbGRQYXRoID0gb2xkVmFsLnBhdGhcblxuICAgICAgbGV0IGhhc05ldyA9IGZhbHNlXG4gICAgICBsZXQgaGFzT2xkID0gZmFsc2VcblxuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgICAgIGlmIChpdGVtLnRvID09PSBuZXdQYXRoKSBoYXNOZXcgPSB0cnVlXG4gICAgICAgIGVsc2UgaWYgKGl0ZW0udG8gPT09IG9sZFBhdGgpIGhhc09sZCA9IHRydWVcblxuICAgICAgICBpZiAoaGFzTmV3ICYmIGhhc09sZCkgYnJlYWtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgd2UgaGF2ZSBhbiBvbGQgaXRlbSBhbmQgbm90IGEgbmV3IG9uZVxuICAgICAgLy8gaXQncyBhc3N1bWVkIHRoYXQgdGhlIHVzZXIgbmF2aWdhdGVkIHRvXG4gICAgICAvLyBhIHBhdGggdGhhdCBpcyBub3QgcHJlc2VudCBpbiB0aGUgaXRlbXNcbiAgICAgIGlmICghaGFzTmV3ICYmIGhhc09sZCkgdGhpcy5pbnRlcm5hbFZhbHVlID0gdW5kZWZpbmVkXG4gICAgfSxcbiAgfSxcblxuICByZW5kZXIgKGgpOiBWTm9kZSB7XG4gICAgY29uc3QgcmVuZGVyID0gQmFzZVNsaWRlR3JvdXAub3B0aW9ucy5yZW5kZXIuY2FsbCh0aGlzLCBoKVxuXG4gICAgcmVuZGVyLmRhdGEhLmF0dHJzID0ge1xuICAgICAgcm9sZTogJ3RhYmxpc3QnLFxuICAgIH1cblxuICAgIHJldHVybiByZW5kZXJcbiAgfSxcbn0pXG4iXX0=