import OurVue from 'vue';
import { consoleError } from './util/console';
export function install(Vue, args = {}) {
    if (install.installed)
        return;
    install.installed = true;
    if (OurVue !== Vue) {
        consoleError('Multiple instances of Vue detected\nSee https://github.com/vuetifyjs/vuetify/issues/4068\n\nIf you\'re seeing "$attrs is readonly", it\'s caused by this');
    }
    const components = args.components || {};
    const directives = args.directives || {};
    for (const name in directives) {
        const directive = directives[name];
        Vue.directive(name, directive);
    }
    (function registerComponents(components) {
        if (components) {
            for (const key in components) {
                const component = components[key];
                if (component && !registerComponents(component.$_vuetify_subcomponents)) {
                    Vue.component(key, component);
                }
            }
            return true;
        }
        return false;
    })(components);
    // Used to avoid multiple mixins being setup
    // when in dev mode and hot module reload
    // https://github.com/vuejs/vue/issues/5089#issuecomment-284260111
    if (Vue.$_vuetify_installed)
        return;
    Vue.$_vuetify_installed = true;
    Vue.mixin({
        beforeCreate() {
            const options = this.$options;
            if (options.vuetify) {
                options.vuetify.init(this, options.ssrContext);
                this.$vuetify = Vue.observable(options.vuetify.framework);
            }
            else {
                this.$vuetify = (options.parent && options.parent.$vuetify) || this;
            }
        },
        beforeMount() {
            // @ts-ignore
            if (this.$options.vuetify && this.$el && this.$el.hasAttribute('data-server-rendered')) {
                // @ts-ignore
                this.$vuetify.isHydrating = true;
                // @ts-ignore
                this.$vuetify.breakpoint.update(true);
            }
        },
        mounted() {
            // @ts-ignore
            if (this.$options.vuetify && this.$vuetify.isHydrating) {
                // @ts-ignore
                this.$vuetify.isHydrating = false;
                // @ts-ignore
                this.$vuetify.breakpoint.update();
            }
        },
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9pbnN0YWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sTUFBMEIsTUFBTSxLQUFLLENBQUE7QUFFNUMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFBO0FBRTdDLE1BQU0sVUFBVSxPQUFPLENBQUUsR0FBbUIsRUFBRSxPQUEwQixFQUFFO0lBQ3hFLElBQUssT0FBZSxDQUFDLFNBQVM7UUFBRSxPQUFNO0lBQ3JDLE9BQWUsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFBO0lBRWpDLElBQUksTUFBTSxLQUFLLEdBQUcsRUFBRTtRQUNsQixZQUFZLENBQUMsMEpBQTBKLENBQUMsQ0FBQTtLQUN6SztJQUVELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFBO0lBQ3hDLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFBO0lBRXhDLEtBQUssTUFBTSxJQUFJLElBQUksVUFBVSxFQUFFO1FBQzdCLE1BQU0sU0FBUyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUVsQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQTtLQUMvQjtJQUVELENBQUMsU0FBUyxrQkFBa0IsQ0FBRSxVQUFlO1FBQzNDLElBQUksVUFBVSxFQUFFO1lBQ2QsS0FBSyxNQUFNLEdBQUcsSUFBSSxVQUFVLEVBQUU7Z0JBQzVCLE1BQU0sU0FBUyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFDakMsSUFBSSxTQUFTLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQUMsRUFBRTtvQkFDdkUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsU0FBdUIsQ0FBQyxDQUFBO2lCQUM1QzthQUNGO1lBQ0QsT0FBTyxJQUFJLENBQUE7U0FDWjtRQUNELE9BQU8sS0FBSyxDQUFBO0lBQ2QsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUE7SUFFZCw0Q0FBNEM7SUFDNUMseUNBQXlDO0lBQ3pDLGtFQUFrRTtJQUNsRSxJQUFJLEdBQUcsQ0FBQyxtQkFBbUI7UUFBRSxPQUFNO0lBQ25DLEdBQUcsQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUE7SUFFOUIsR0FBRyxDQUFDLEtBQUssQ0FBQztRQUNSLFlBQVk7WUFDVixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBZSxDQUFBO1lBRXBDLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTtnQkFDbkIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQTtnQkFDOUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7YUFDMUQ7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUE7YUFDcEU7UUFDSCxDQUFDO1FBQ0QsV0FBVztZQUNULGFBQWE7WUFDYixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsc0JBQXNCLENBQUMsRUFBRTtnQkFDdEYsYUFBYTtnQkFDYixJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUE7Z0JBQ2hDLGFBQWE7Z0JBQ2IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO2FBQ3RDO1FBQ0gsQ0FBQztRQUNELE9BQU87WUFDTCxhQUFhO1lBQ2IsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRTtnQkFDdEQsYUFBYTtnQkFDYixJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUE7Z0JBQ2pDLGFBQWE7Z0JBQ2IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUE7YUFDbEM7UUFDSCxDQUFDO0tBQ0YsQ0FBQyxDQUFBO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBPdXJWdWUsIHsgVnVlQ29uc3RydWN0b3IgfSBmcm9tICd2dWUnXG5pbXBvcnQgeyBWdWV0aWZ5VXNlT3B0aW9ucyB9IGZyb20gJ3Z1ZXRpZnkvdHlwZXMnXG5pbXBvcnQgeyBjb25zb2xlRXJyb3IgfSBmcm9tICcuL3V0aWwvY29uc29sZSdcblxuZXhwb3J0IGZ1bmN0aW9uIGluc3RhbGwgKFZ1ZTogVnVlQ29uc3RydWN0b3IsIGFyZ3M6IFZ1ZXRpZnlVc2VPcHRpb25zID0ge30pIHtcbiAgaWYgKChpbnN0YWxsIGFzIGFueSkuaW5zdGFsbGVkKSByZXR1cm5cbiAgKGluc3RhbGwgYXMgYW55KS5pbnN0YWxsZWQgPSB0cnVlXG5cbiAgaWYgKE91clZ1ZSAhPT0gVnVlKSB7XG4gICAgY29uc29sZUVycm9yKCdNdWx0aXBsZSBpbnN0YW5jZXMgb2YgVnVlIGRldGVjdGVkXFxuU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS92dWV0aWZ5anMvdnVldGlmeS9pc3N1ZXMvNDA2OFxcblxcbklmIHlvdVxcJ3JlIHNlZWluZyBcIiRhdHRycyBpcyByZWFkb25seVwiLCBpdFxcJ3MgY2F1c2VkIGJ5IHRoaXMnKVxuICB9XG5cbiAgY29uc3QgY29tcG9uZW50cyA9IGFyZ3MuY29tcG9uZW50cyB8fCB7fVxuICBjb25zdCBkaXJlY3RpdmVzID0gYXJncy5kaXJlY3RpdmVzIHx8IHt9XG5cbiAgZm9yIChjb25zdCBuYW1lIGluIGRpcmVjdGl2ZXMpIHtcbiAgICBjb25zdCBkaXJlY3RpdmUgPSBkaXJlY3RpdmVzW25hbWVdXG5cbiAgICBWdWUuZGlyZWN0aXZlKG5hbWUsIGRpcmVjdGl2ZSlcbiAgfVxuXG4gIChmdW5jdGlvbiByZWdpc3RlckNvbXBvbmVudHMgKGNvbXBvbmVudHM6IGFueSkge1xuICAgIGlmIChjb21wb25lbnRzKSB7XG4gICAgICBmb3IgKGNvbnN0IGtleSBpbiBjb21wb25lbnRzKSB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGNvbXBvbmVudHNba2V5XVxuICAgICAgICBpZiAoY29tcG9uZW50ICYmICFyZWdpc3RlckNvbXBvbmVudHMoY29tcG9uZW50LiRfdnVldGlmeV9zdWJjb21wb25lbnRzKSkge1xuICAgICAgICAgIFZ1ZS5jb21wb25lbnQoa2V5LCBjb21wb25lbnQgYXMgdHlwZW9mIFZ1ZSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH0pKGNvbXBvbmVudHMpXG5cbiAgLy8gVXNlZCB0byBhdm9pZCBtdWx0aXBsZSBtaXhpbnMgYmVpbmcgc2V0dXBcbiAgLy8gd2hlbiBpbiBkZXYgbW9kZSBhbmQgaG90IG1vZHVsZSByZWxvYWRcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3Z1ZWpzL3Z1ZS9pc3N1ZXMvNTA4OSNpc3N1ZWNvbW1lbnQtMjg0MjYwMTExXG4gIGlmIChWdWUuJF92dWV0aWZ5X2luc3RhbGxlZCkgcmV0dXJuXG4gIFZ1ZS4kX3Z1ZXRpZnlfaW5zdGFsbGVkID0gdHJ1ZVxuXG4gIFZ1ZS5taXhpbih7XG4gICAgYmVmb3JlQ3JlYXRlICgpIHtcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLiRvcHRpb25zIGFzIGFueVxuXG4gICAgICBpZiAob3B0aW9ucy52dWV0aWZ5KSB7XG4gICAgICAgIG9wdGlvbnMudnVldGlmeS5pbml0KHRoaXMsIG9wdGlvbnMuc3NyQ29udGV4dClcbiAgICAgICAgdGhpcy4kdnVldGlmeSA9IFZ1ZS5vYnNlcnZhYmxlKG9wdGlvbnMudnVldGlmeS5mcmFtZXdvcmspXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLiR2dWV0aWZ5ID0gKG9wdGlvbnMucGFyZW50ICYmIG9wdGlvbnMucGFyZW50LiR2dWV0aWZ5KSB8fCB0aGlzXG4gICAgICB9XG4gICAgfSxcbiAgICBiZWZvcmVNb3VudCAoKSB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBpZiAodGhpcy4kb3B0aW9ucy52dWV0aWZ5ICYmIHRoaXMuJGVsICYmIHRoaXMuJGVsLmhhc0F0dHJpYnV0ZSgnZGF0YS1zZXJ2ZXItcmVuZGVyZWQnKSkge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHRoaXMuJHZ1ZXRpZnkuaXNIeWRyYXRpbmcgPSB0cnVlXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgdGhpcy4kdnVldGlmeS5icmVha3BvaW50LnVwZGF0ZSh0cnVlKVxuICAgICAgfVxuICAgIH0sXG4gICAgbW91bnRlZCAoKSB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBpZiAodGhpcy4kb3B0aW9ucy52dWV0aWZ5ICYmIHRoaXMuJHZ1ZXRpZnkuaXNIeWRyYXRpbmcpIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICB0aGlzLiR2dWV0aWZ5LmlzSHlkcmF0aW5nID0gZmFsc2VcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICB0aGlzLiR2dWV0aWZ5LmJyZWFrcG9pbnQudXBkYXRlKClcbiAgICAgIH1cbiAgICB9LFxuICB9KVxufVxuIl19