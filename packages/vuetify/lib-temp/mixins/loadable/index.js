import Vue from 'vue';
import VProgressLinear from '../../components/VProgressLinear';
/**
 * Loadable
 *
 * @mixin
 *
 * Used to add linear progress bar to components
 * Can use a default bar with a specific color
 * or designate a custom progress linear bar
 */
/* @vue/component */
export default Vue.extend().extend({
    name: 'loadable',
    props: {
        loading: {
            type: [Boolean, String],
            default: false,
        },
        loaderHeight: {
            type: [Number, String],
            default: 2,
        },
    },
    methods: {
        genProgress() {
            if (this.loading === false)
                return null;
            return this.$slots.progress || this.$createElement(VProgressLinear, {
                props: {
                    absolute: true,
                    color: (this.loading === true || this.loading === '')
                        ? (this.color || 'primary')
                        : this.loading,
                    height: this.loaderHeight,
                    indeterminate: true,
                },
            });
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL2xvYWRhYmxlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sR0FBYyxNQUFNLEtBQUssQ0FBQTtBQUNoQyxPQUFPLGVBQWUsTUFBTSxrQ0FBa0MsQ0FBQTtBQU05RDs7Ozs7Ozs7R0FRRztBQUNILG9CQUFvQjtBQUNwQixlQUFlLEdBQUcsQ0FBQyxNQUFNLEVBQWEsQ0FBQyxNQUFNLENBQUM7SUFDNUMsSUFBSSxFQUFFLFVBQVU7SUFFaEIsS0FBSyxFQUFFO1FBQ0wsT0FBTyxFQUFFO1lBQ1AsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQztZQUN2QixPQUFPLEVBQUUsS0FBSztTQUNmO1FBQ0QsWUFBWSxFQUFFO1lBQ1osSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN0QixPQUFPLEVBQUUsQ0FBQztTQUNYO0tBQ0Y7SUFFRCxPQUFPLEVBQUU7UUFDUCxXQUFXO1lBQ1QsSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLEtBQUs7Z0JBQUUsT0FBTyxJQUFJLENBQUE7WUFFdkMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLGVBQWUsRUFBRTtnQkFDbEUsS0FBSyxFQUFFO29CQUNMLFFBQVEsRUFBRSxJQUFJO29CQUNkLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssRUFBRSxDQUFDO3dCQUNuRCxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLFNBQVMsQ0FBQzt3QkFDM0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPO29CQUNoQixNQUFNLEVBQUUsSUFBSSxDQUFDLFlBQVk7b0JBQ3pCLGFBQWEsRUFBRSxJQUFJO2lCQUNwQjthQUNGLENBQUMsQ0FBQTtRQUNKLENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWdWUsIHsgVk5vZGUgfSBmcm9tICd2dWUnXG5pbXBvcnQgVlByb2dyZXNzTGluZWFyIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvVlByb2dyZXNzTGluZWFyJ1xuXG5pbnRlcmZhY2UgY29sb3JhYmxlIGV4dGVuZHMgVnVlIHtcbiAgY29sb3I/OiBzdHJpbmdcbn1cblxuLyoqXG4gKiBMb2FkYWJsZVxuICpcbiAqIEBtaXhpblxuICpcbiAqIFVzZWQgdG8gYWRkIGxpbmVhciBwcm9ncmVzcyBiYXIgdG8gY29tcG9uZW50c1xuICogQ2FuIHVzZSBhIGRlZmF1bHQgYmFyIHdpdGggYSBzcGVjaWZpYyBjb2xvclxuICogb3IgZGVzaWduYXRlIGEgY3VzdG9tIHByb2dyZXNzIGxpbmVhciBiYXJcbiAqL1xuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IFZ1ZS5leHRlbmQ8Y29sb3JhYmxlPigpLmV4dGVuZCh7XG4gIG5hbWU6ICdsb2FkYWJsZScsXG5cbiAgcHJvcHM6IHtcbiAgICBsb2FkaW5nOiB7XG4gICAgICB0eXBlOiBbQm9vbGVhbiwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIH0sXG4gICAgbG9hZGVySGVpZ2h0OiB7XG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxuICAgICAgZGVmYXVsdDogMixcbiAgICB9LFxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBnZW5Qcm9ncmVzcyAoKTogVk5vZGUgfCBWTm9kZVtdIHwgbnVsbCB7XG4gICAgICBpZiAodGhpcy5sb2FkaW5nID09PSBmYWxzZSkgcmV0dXJuIG51bGxcblxuICAgICAgcmV0dXJuIHRoaXMuJHNsb3RzLnByb2dyZXNzIHx8IHRoaXMuJGNyZWF0ZUVsZW1lbnQoVlByb2dyZXNzTGluZWFyLCB7XG4gICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgYWJzb2x1dGU6IHRydWUsXG4gICAgICAgICAgY29sb3I6ICh0aGlzLmxvYWRpbmcgPT09IHRydWUgfHwgdGhpcy5sb2FkaW5nID09PSAnJylcbiAgICAgICAgICAgID8gKHRoaXMuY29sb3IgfHwgJ3ByaW1hcnknKVxuICAgICAgICAgICAgOiB0aGlzLmxvYWRpbmcsXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLmxvYWRlckhlaWdodCxcbiAgICAgICAgICBpbmRldGVybWluYXRlOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9LFxuICB9LFxufSlcbiJdfQ==