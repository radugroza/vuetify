// Mixins
import { inject as RegistrableInject } from '../registrable';
export function factory(namespace, child, parent) {
    // TODO: ts 3.4 broke directly returning this
    const R = RegistrableInject(namespace, child, parent).extend({
        name: 'groupable',
        props: {
            activeClass: {
                type: String,
                default() {
                    if (!this[namespace])
                        return undefined;
                    return this[namespace].activeClass;
                },
            },
            disabled: Boolean,
        },
        data() {
            return {
                isActive: false,
            };
        },
        computed: {
            groupClasses() {
                if (!this.activeClass)
                    return {};
                return {
                    [this.activeClass]: this.isActive,
                };
            },
        },
        created() {
            this[namespace] && this[namespace].register(this);
        },
        beforeDestroy() {
            this[namespace] && this[namespace].unregister(this);
        },
        methods: {
            toggle() {
                this.$emit('change');
            },
        },
    });
    return R;
}
/* eslint-disable-next-line no-redeclare */
const Groupable = factory('itemGroup');
export default Groupable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL2dyb3VwYWJsZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxFQUFlLE1BQU0sSUFBSSxpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFBO0FBZ0J6RSxNQUFNLFVBQVUsT0FBTyxDQUNyQixTQUFZLEVBQ1osS0FBYyxFQUNkLE1BQWU7SUFFZiw2Q0FBNkM7SUFDN0MsTUFBTSxDQUFDLEdBQUcsaUJBQWlCLENBQU8sU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDakUsSUFBSSxFQUFFLFdBQVc7UUFFakIsS0FBSyxFQUFFO1lBQ0wsV0FBVyxFQUFFO2dCQUNYLElBQUksRUFBRSxNQUFNO2dCQUNaLE9BQU87b0JBQ0wsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7d0JBQUUsT0FBTyxTQUFTLENBQUE7b0JBRXRDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQTtnQkFDcEMsQ0FBQzthQUM4QjtZQUNqQyxRQUFRLEVBQUUsT0FBTztTQUNsQjtRQUVELElBQUk7WUFDRixPQUFPO2dCQUNMLFFBQVEsRUFBRSxLQUFLO2FBQ2hCLENBQUE7UUFDSCxDQUFDO1FBRUQsUUFBUSxFQUFFO1lBQ1IsWUFBWTtnQkFDVixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVc7b0JBQUUsT0FBTyxFQUFFLENBQUE7Z0JBRWhDLE9BQU87b0JBQ0wsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVE7aUJBQ2xDLENBQUE7WUFDSCxDQUFDO1NBQ0Y7UUFFRCxPQUFPO1lBQ0wsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFLLElBQUksQ0FBQyxTQUFTLENBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDNUQsQ0FBQztRQUVELGFBQWE7WUFDWCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUssSUFBSSxDQUFDLFNBQVMsQ0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUM5RCxDQUFDO1FBRUQsT0FBTyxFQUFFO1lBQ1AsTUFBTTtnQkFDSixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQ3RCLENBQUM7U0FDRjtLQUNGLENBQUMsQ0FBQTtJQUVGLE9BQU8sQ0FBQyxDQUFBO0FBQ1YsQ0FBQztBQUVELDJDQUEyQztBQUMzQyxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7QUFFdEMsZUFBZSxTQUFTLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBNaXhpbnNcbmltcG9ydCB7IFJlZ2lzdHJhYmxlLCBpbmplY3QgYXMgUmVnaXN0cmFibGVJbmplY3QgfSBmcm9tICcuLi9yZWdpc3RyYWJsZSdcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgeyBFeHRyYWN0VnVlIH0gZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5pbXBvcnQgeyBWdWVDb25zdHJ1Y3RvciB9IGZyb20gJ3Z1ZSdcbmltcG9ydCB7IFByb3BWYWxpZGF0b3IgfSBmcm9tICd2dWUvdHlwZXMvb3B0aW9ucydcblxuLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVzZS1iZWZvcmUtZGVmaW5lICovXG5leHBvcnQgdHlwZSBHcm91cGFibGU8VCBleHRlbmRzIHN0cmluZywgQyBleHRlbmRzIFZ1ZUNvbnN0cnVjdG9yIHwgbnVsbCA9IG51bGw+ID0gVnVlQ29uc3RydWN0b3I8RXh0cmFjdFZ1ZTxSZWdpc3RyYWJsZTxULCBDPj4gJiB7XG4gIGFjdGl2ZUNsYXNzOiBzdHJpbmdcbiAgaXNBY3RpdmU6IGJvb2xlYW5cbiAgZGlzYWJsZWQ6IGJvb2xlYW5cbiAgZ3JvdXBDbGFzc2VzOiBvYmplY3RcbiAgdG9nZ2xlICgpOiB2b2lkXG59PlxuXG5leHBvcnQgZnVuY3Rpb24gZmFjdG9yeTxUIGV4dGVuZHMgc3RyaW5nLCBDIGV4dGVuZHMgVnVlQ29uc3RydWN0b3IgfCBudWxsID0gbnVsbD4gKFxuICBuYW1lc3BhY2U6IFQsXG4gIGNoaWxkPzogc3RyaW5nLFxuICBwYXJlbnQ/OiBzdHJpbmdcbik6IEdyb3VwYWJsZTxULCBDPiB7XG4gIC8vIFRPRE86IHRzIDMuNCBicm9rZSBkaXJlY3RseSByZXR1cm5pbmcgdGhpc1xuICBjb25zdCBSID0gUmVnaXN0cmFibGVJbmplY3Q8VCwgQz4obmFtZXNwYWNlLCBjaGlsZCwgcGFyZW50KS5leHRlbmQoe1xuICAgIG5hbWU6ICdncm91cGFibGUnLFxuXG4gICAgcHJvcHM6IHtcbiAgICAgIGFjdGl2ZUNsYXNzOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgZGVmYXVsdCAoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgICBpZiAoIXRoaXNbbmFtZXNwYWNlXSkgcmV0dXJuIHVuZGVmaW5lZFxuXG4gICAgICAgICAgcmV0dXJuIHRoaXNbbmFtZXNwYWNlXS5hY3RpdmVDbGFzc1xuICAgICAgICB9LFxuICAgICAgfSBhcyBhbnkgYXMgUHJvcFZhbGlkYXRvcjxzdHJpbmc+LFxuICAgICAgZGlzYWJsZWQ6IEJvb2xlYW4sXG4gICAgfSxcblxuICAgIGRhdGEgKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaXNBY3RpdmU6IGZhbHNlLFxuICAgICAgfVxuICAgIH0sXG5cbiAgICBjb21wdXRlZDoge1xuICAgICAgZ3JvdXBDbGFzc2VzICgpOiBvYmplY3Qge1xuICAgICAgICBpZiAoIXRoaXMuYWN0aXZlQ2xhc3MpIHJldHVybiB7fVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgW3RoaXMuYWN0aXZlQ2xhc3NdOiB0aGlzLmlzQWN0aXZlLFxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0sXG5cbiAgICBjcmVhdGVkICgpIHtcbiAgICAgIHRoaXNbbmFtZXNwYWNlXSAmJiAodGhpc1tuYW1lc3BhY2VdIGFzIGFueSkucmVnaXN0ZXIodGhpcylcbiAgICB9LFxuXG4gICAgYmVmb3JlRGVzdHJveSAoKSB7XG4gICAgICB0aGlzW25hbWVzcGFjZV0gJiYgKHRoaXNbbmFtZXNwYWNlXSBhcyBhbnkpLnVucmVnaXN0ZXIodGhpcylcbiAgICB9LFxuXG4gICAgbWV0aG9kczoge1xuICAgICAgdG9nZ2xlICgpIHtcbiAgICAgICAgdGhpcy4kZW1pdCgnY2hhbmdlJylcbiAgICAgIH0sXG4gICAgfSxcbiAgfSlcblxuICByZXR1cm4gUlxufVxuXG4vKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmVkZWNsYXJlICovXG5jb25zdCBHcm91cGFibGUgPSBmYWN0b3J5KCdpdGVtR3JvdXAnKVxuXG5leHBvcnQgZGVmYXVsdCBHcm91cGFibGVcbiJdfQ==