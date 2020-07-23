// Mixins
import { factory as GroupableFactory } from '../../mixins/groupable';
import { provide as RegistrableProvide } from '../../mixins/registrable';
// Utilities
import { getSlot } from '../../util/helpers';
import mixins from '../../util/mixins';
export default mixins(GroupableFactory('expansionPanels', 'v-expansion-panel', 'v-expansion-panels'), RegistrableProvide('expansionPanel', true)
/* @vue/component */
).extend({
    name: 'v-expansion-panel',
    props: {
        disabled: Boolean,
        readonly: Boolean,
    },
    data() {
        return {
            content: null,
            header: null,
            nextIsActive: false,
        };
    },
    computed: {
        classes() {
            return {
                'v-expansion-panel--active': this.isActive,
                'v-expansion-panel--next-active': this.nextIsActive,
                'v-expansion-panel--disabled': this.isDisabled,
                ...this.groupClasses,
            };
        },
        isDisabled() {
            return this.expansionPanels.disabled || this.disabled;
        },
        isReadonly() {
            return this.expansionPanels.readonly || this.readonly;
        },
    },
    methods: {
        registerContent(vm) {
            this.content = vm;
        },
        unregisterContent() {
            this.content = null;
        },
        registerHeader(vm) {
            this.header = vm;
            vm.$on('click', this.onClick);
        },
        unregisterHeader() {
            this.header = null;
        },
        onClick(e) {
            if (e.detail)
                this.header.$el.blur();
            this.$emit('click', e);
            this.isReadonly || this.isDisabled || this.toggle();
        },
        toggle() {
            /* istanbul ignore else */
            if (this.content)
                this.content.isBooted = true;
            this.$nextTick(() => this.$emit('change'));
        },
    },
    render(h) {
        return h('div', {
            staticClass: 'v-expansion-panel',
            class: this.classes,
            attrs: {
                'aria-expanded': String(this.isActive),
            },
        }, getSlot(this));
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkV4cGFuc2lvblBhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkV4cGFuc2lvblBhbmVsL1ZFeHBhbnNpb25QYW5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFLQSxTQUFTO0FBQ1QsT0FBTyxFQUFFLE9BQU8sSUFBSSxnQkFBZ0IsRUFBRSxNQUFNLHdCQUF3QixDQUFBO0FBQ3BFLE9BQU8sRUFBRSxPQUFPLElBQUksa0JBQWtCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQTtBQUV4RSxZQUFZO0FBQ1osT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQzVDLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBUXRDLGVBQWUsTUFBTSxDQUNuQixnQkFBZ0IsQ0FBNkMsaUJBQWlCLEVBQUUsbUJBQW1CLEVBQUUsb0JBQW9CLENBQUMsRUFDMUgsa0JBQWtCLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDO0FBQzFDLG9CQUFvQjtDQUNyQixDQUFDLE1BQU0sQ0FBQztJQUNQLElBQUksRUFBRSxtQkFBbUI7SUFFekIsS0FBSyxFQUFFO1FBQ0wsUUFBUSxFQUFFLE9BQU87UUFDakIsUUFBUSxFQUFFLE9BQU87S0FDbEI7SUFFRCxJQUFJO1FBQ0YsT0FBTztZQUNMLE9BQU8sRUFBRSxJQUE2QztZQUN0RCxNQUFNLEVBQUUsSUFBNEM7WUFDcEQsWUFBWSxFQUFFLEtBQUs7U0FDcEIsQ0FBQTtJQUNILENBQUM7SUFFRCxRQUFRLEVBQUU7UUFDUixPQUFPO1lBQ0wsT0FBTztnQkFDTCwyQkFBMkIsRUFBRSxJQUFJLENBQUMsUUFBUTtnQkFDMUMsZ0NBQWdDLEVBQUUsSUFBSSxDQUFDLFlBQVk7Z0JBQ25ELDZCQUE2QixFQUFFLElBQUksQ0FBQyxVQUFVO2dCQUM5QyxHQUFHLElBQUksQ0FBQyxZQUFZO2FBQ3JCLENBQUE7UUFDSCxDQUFDO1FBQ0QsVUFBVTtZQUNSLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQTtRQUN2RCxDQUFDO1FBQ0QsVUFBVTtZQUNSLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQTtRQUN2RCxDQUFDO0tBQ0Y7SUFFRCxPQUFPLEVBQUU7UUFDUCxlQUFlLENBQUUsRUFBa0M7WUFDakQsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUE7UUFDbkIsQ0FBQztRQUNELGlCQUFpQjtZQUNmLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFBO1FBQ3JCLENBQUM7UUFDRCxjQUFjLENBQUUsRUFBaUM7WUFDL0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUE7WUFDaEIsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQy9CLENBQUM7UUFDRCxnQkFBZ0I7WUFDZCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQTtRQUNwQixDQUFDO1FBQ0QsT0FBTyxDQUFFLENBQWE7WUFDcEIsSUFBSSxDQUFDLENBQUMsTUFBTTtnQkFBRSxJQUFJLENBQUMsTUFBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtZQUVyQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQTtZQUV0QixJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO1FBQ3JELENBQUM7UUFDRCxNQUFNO1lBQ0osMEJBQTBCO1lBQzFCLElBQUksSUFBSSxDQUFDLE9BQU87Z0JBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO1lBQzlDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO1FBQzVDLENBQUM7S0FDRjtJQUVELE1BQU0sQ0FBRSxDQUFDO1FBQ1AsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFO1lBQ2QsV0FBVyxFQUFFLG1CQUFtQjtZQUNoQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU87WUFDbkIsS0FBSyxFQUFFO2dCQUNMLGVBQWUsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQzthQUN2QztTQUNGLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7SUFDbkIsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvbXBvbmVudHNcbmltcG9ydCBWRXhwYW5zaW9uUGFuZWxzIGZyb20gJy4vVkV4cGFuc2lvblBhbmVscydcbmltcG9ydCBWRXhwYW5zaW9uUGFuZWxIZWFkZXIgZnJvbSAnLi9WRXhwYW5zaW9uUGFuZWxIZWFkZXInXG5pbXBvcnQgVkV4cGFuc2lvblBhbmVsQ29udGVudCBmcm9tICcuL1ZFeHBhbnNpb25QYW5lbENvbnRlbnQnXG5cbi8vIE1peGluc1xuaW1wb3J0IHsgZmFjdG9yeSBhcyBHcm91cGFibGVGYWN0b3J5IH0gZnJvbSAnLi4vLi4vbWl4aW5zL2dyb3VwYWJsZSdcbmltcG9ydCB7IHByb3ZpZGUgYXMgUmVnaXN0cmFibGVQcm92aWRlIH0gZnJvbSAnLi4vLi4vbWl4aW5zL3JlZ2lzdHJhYmxlJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCB7IGdldFNsb3QgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgVk5vZGUgfSBmcm9tICd2dWUnXG5cbnR5cGUgVkV4cGFuc2lvblBhbmVsSGVhZGVySW5zdGFuY2UgPSBJbnN0YW5jZVR5cGU8dHlwZW9mIFZFeHBhbnNpb25QYW5lbEhlYWRlcj5cbnR5cGUgVkV4cGFuc2lvblBhbmVsQ29udGVudEluc3RhbmNlID0gSW5zdGFuY2VUeXBlPHR5cGVvZiBWRXhwYW5zaW9uUGFuZWxDb250ZW50PlxuXG5leHBvcnQgZGVmYXVsdCBtaXhpbnMoXG4gIEdyb3VwYWJsZUZhY3Rvcnk8J2V4cGFuc2lvblBhbmVscycsIHR5cGVvZiBWRXhwYW5zaW9uUGFuZWxzPignZXhwYW5zaW9uUGFuZWxzJywgJ3YtZXhwYW5zaW9uLXBhbmVsJywgJ3YtZXhwYW5zaW9uLXBhbmVscycpLFxuICBSZWdpc3RyYWJsZVByb3ZpZGUoJ2V4cGFuc2lvblBhbmVsJywgdHJ1ZSlcbiAgLyogQHZ1ZS9jb21wb25lbnQgKi9cbikuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtZXhwYW5zaW9uLXBhbmVsJyxcblxuICBwcm9wczoge1xuICAgIGRpc2FibGVkOiBCb29sZWFuLFxuICAgIHJlYWRvbmx5OiBCb29sZWFuLFxuICB9LFxuXG4gIGRhdGEgKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjb250ZW50OiBudWxsIGFzIFZFeHBhbnNpb25QYW5lbENvbnRlbnRJbnN0YW5jZSB8IG51bGwsXG4gICAgICBoZWFkZXI6IG51bGwgYXMgVkV4cGFuc2lvblBhbmVsSGVhZGVySW5zdGFuY2UgfCBudWxsLFxuICAgICAgbmV4dElzQWN0aXZlOiBmYWxzZSxcbiAgICB9XG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBjbGFzc2VzICgpOiBvYmplY3Qge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgJ3YtZXhwYW5zaW9uLXBhbmVsLS1hY3RpdmUnOiB0aGlzLmlzQWN0aXZlLFxuICAgICAgICAndi1leHBhbnNpb24tcGFuZWwtLW5leHQtYWN0aXZlJzogdGhpcy5uZXh0SXNBY3RpdmUsXG4gICAgICAgICd2LWV4cGFuc2lvbi1wYW5lbC0tZGlzYWJsZWQnOiB0aGlzLmlzRGlzYWJsZWQsXG4gICAgICAgIC4uLnRoaXMuZ3JvdXBDbGFzc2VzLFxuICAgICAgfVxuICAgIH0sXG4gICAgaXNEaXNhYmxlZCAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5leHBhbnNpb25QYW5lbHMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlZFxuICAgIH0sXG4gICAgaXNSZWFkb25seSAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5leHBhbnNpb25QYW5lbHMucmVhZG9ubHkgfHwgdGhpcy5yZWFkb25seVxuICAgIH0sXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIHJlZ2lzdGVyQ29udGVudCAodm06IFZFeHBhbnNpb25QYW5lbENvbnRlbnRJbnN0YW5jZSkge1xuICAgICAgdGhpcy5jb250ZW50ID0gdm1cbiAgICB9LFxuICAgIHVucmVnaXN0ZXJDb250ZW50ICgpIHtcbiAgICAgIHRoaXMuY29udGVudCA9IG51bGxcbiAgICB9LFxuICAgIHJlZ2lzdGVySGVhZGVyICh2bTogVkV4cGFuc2lvblBhbmVsSGVhZGVySW5zdGFuY2UpIHtcbiAgICAgIHRoaXMuaGVhZGVyID0gdm1cbiAgICAgIHZtLiRvbignY2xpY2snLCB0aGlzLm9uQ2xpY2spXG4gICAgfSxcbiAgICB1bnJlZ2lzdGVySGVhZGVyICgpIHtcbiAgICAgIHRoaXMuaGVhZGVyID0gbnVsbFxuICAgIH0sXG4gICAgb25DbGljayAoZTogTW91c2VFdmVudCkge1xuICAgICAgaWYgKGUuZGV0YWlsKSB0aGlzLmhlYWRlciEuJGVsLmJsdXIoKVxuXG4gICAgICB0aGlzLiRlbWl0KCdjbGljaycsIGUpXG5cbiAgICAgIHRoaXMuaXNSZWFkb25seSB8fCB0aGlzLmlzRGlzYWJsZWQgfHwgdGhpcy50b2dnbGUoKVxuICAgIH0sXG4gICAgdG9nZ2xlICgpIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAodGhpcy5jb250ZW50KSB0aGlzLmNvbnRlbnQuaXNCb290ZWQgPSB0cnVlXG4gICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB0aGlzLiRlbWl0KCdjaGFuZ2UnKSlcbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcbiAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgc3RhdGljQ2xhc3M6ICd2LWV4cGFuc2lvbi1wYW5lbCcsXG4gICAgICBjbGFzczogdGhpcy5jbGFzc2VzLFxuICAgICAgYXR0cnM6IHtcbiAgICAgICAgJ2FyaWEtZXhwYW5kZWQnOiBTdHJpbmcodGhpcy5pc0FjdGl2ZSksXG4gICAgICB9LFxuICAgIH0sIGdldFNsb3QodGhpcykpXG4gIH0sXG59KVxuIl19