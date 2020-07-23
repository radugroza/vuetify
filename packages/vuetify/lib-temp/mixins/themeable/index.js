import Vue from 'vue';
export function functionalThemeClasses(context) {
    const vm = {
        ...context.props,
        ...context.injections,
    };
    const isDark = Themeable.options.computed.isDark.call(vm);
    return Themeable.options.computed.themeClasses.call({ isDark });
}
/* @vue/component */
const Themeable = Vue.extend().extend({
    name: 'themeable',
    provide() {
        return {
            theme: this.themeableProvide,
        };
    },
    inject: {
        theme: {
            default: {
                isDark: false,
            },
        },
    },
    props: {
        dark: {
            type: Boolean,
            default: null,
        },
        light: {
            type: Boolean,
            default: null,
        },
    },
    data() {
        return {
            themeableProvide: {
                isDark: false,
            },
        };
    },
    computed: {
        appIsDark() {
            return this.$vuetify.theme.dark || false;
        },
        isDark() {
            if (this.dark === true) {
                // explicitly dark
                return true;
            }
            else if (this.light === true) {
                // explicitly light
                return false;
            }
            else {
                // inherit from parent, or default false if there is none
                return this.theme.isDark;
            }
        },
        themeClasses() {
            return {
                'theme--dark': this.isDark,
                'theme--light': !this.isDark,
            };
        },
        /** Used by menus and dialogs, inherits from v-app instead of the parent */
        rootIsDark() {
            if (this.dark === true) {
                // explicitly dark
                return true;
            }
            else if (this.light === true) {
                // explicitly light
                return false;
            }
            else {
                // inherit from v-app
                return this.appIsDark;
            }
        },
        rootThemeClasses() {
            return {
                'theme--dark': this.rootIsDark,
                'theme--light': !this.rootIsDark,
            };
        },
    },
    watch: {
        isDark: {
            handler(newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.themeableProvide.isDark = this.isDark;
                }
            },
            immediate: true,
        },
    },
});
export default Themeable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL3RoZW1lYWJsZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEdBQUcsTUFBTSxLQUFLLENBQUE7QUFVckIsTUFBTSxVQUFVLHNCQUFzQixDQUFFLE9BQXNCO0lBQzVELE1BQU0sRUFBRSxHQUFHO1FBQ1QsR0FBRyxPQUFPLENBQUMsS0FBSztRQUNoQixHQUFHLE9BQU8sQ0FBQyxVQUFVO0tBQ3RCLENBQUE7SUFDRCxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQ3pELE9BQU8sU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUE7QUFDakUsQ0FBQztBQUVELG9CQUFvQjtBQUNwQixNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFhLENBQUMsTUFBTSxDQUFDO0lBQy9DLElBQUksRUFBRSxXQUFXO0lBRWpCLE9BQU87UUFDTCxPQUFPO1lBQ0wsS0FBSyxFQUFFLElBQUksQ0FBQyxnQkFBZ0I7U0FDN0IsQ0FBQTtJQUNILENBQUM7SUFFRCxNQUFNLEVBQUU7UUFDTixLQUFLLEVBQUU7WUFDTCxPQUFPLEVBQUU7Z0JBQ1AsTUFBTSxFQUFFLEtBQUs7YUFDZDtTQUNGO0tBQ0Y7SUFFRCxLQUFLLEVBQUU7UUFDTCxJQUFJLEVBQUU7WUFDSixJQUFJLEVBQUUsT0FBbUM7WUFDekMsT0FBTyxFQUFFLElBQUk7U0FDZDtRQUNELEtBQUssRUFBRTtZQUNMLElBQUksRUFBRSxPQUFtQztZQUN6QyxPQUFPLEVBQUUsSUFBSTtTQUNkO0tBQ0Y7SUFFRCxJQUFJO1FBQ0YsT0FBTztZQUNMLGdCQUFnQixFQUFFO2dCQUNoQixNQUFNLEVBQUUsS0FBSzthQUNkO1NBQ0YsQ0FBQTtJQUNILENBQUM7SUFFRCxRQUFRLEVBQUU7UUFDUixTQUFTO1lBQ1AsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFBO1FBQzFDLENBQUM7UUFDRCxNQUFNO1lBQ0osSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRTtnQkFDdEIsa0JBQWtCO2dCQUNsQixPQUFPLElBQUksQ0FBQTthQUNaO2lCQUFNLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLEVBQUU7Z0JBQzlCLG1CQUFtQjtnQkFDbkIsT0FBTyxLQUFLLENBQUE7YUFDYjtpQkFBTTtnQkFDTCx5REFBeUQ7Z0JBQ3pELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUE7YUFDekI7UUFDSCxDQUFDO1FBQ0QsWUFBWTtZQUNWLE9BQU87Z0JBQ0wsYUFBYSxFQUFFLElBQUksQ0FBQyxNQUFNO2dCQUMxQixjQUFjLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTTthQUM3QixDQUFBO1FBQ0gsQ0FBQztRQUNELDJFQUEyRTtRQUMzRSxVQUFVO1lBQ1IsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRTtnQkFDdEIsa0JBQWtCO2dCQUNsQixPQUFPLElBQUksQ0FBQTthQUNaO2lCQUFNLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLEVBQUU7Z0JBQzlCLG1CQUFtQjtnQkFDbkIsT0FBTyxLQUFLLENBQUE7YUFDYjtpQkFBTTtnQkFDTCxxQkFBcUI7Z0JBQ3JCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQTthQUN0QjtRQUNILENBQUM7UUFDRCxnQkFBZ0I7WUFDZCxPQUFPO2dCQUNMLGFBQWEsRUFBRSxJQUFJLENBQUMsVUFBVTtnQkFDOUIsY0FBYyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVU7YUFDakMsQ0FBQTtRQUNILENBQUM7S0FDRjtJQUVELEtBQUssRUFBRTtRQUNMLE1BQU0sRUFBRTtZQUNOLE9BQU8sQ0FBRSxNQUFNLEVBQUUsTUFBTTtnQkFDckIsSUFBSSxNQUFNLEtBQUssTUFBTSxFQUFFO29CQUNyQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUE7aUJBQzNDO1lBQ0gsQ0FBQztZQUNELFNBQVMsRUFBRSxJQUFJO1NBQ2hCO0tBQ0Y7Q0FDRixDQUFDLENBQUE7QUFFRixlQUFlLFNBQVMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWdWUgZnJvbSAndnVlJ1xuaW1wb3J0IHsgUHJvcFR5cGUsIFJlbmRlckNvbnRleHQgfSBmcm9tICd2dWUvdHlwZXMvb3B0aW9ucydcblxuLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVzZS1iZWZvcmUtZGVmaW5lICovXG5pbnRlcmZhY2UgVGhlbWVhYmxlIGV4dGVuZHMgVnVlIHtcbiAgdGhlbWU6IHtcbiAgICBpc0Rhcms6IGJvb2xlYW5cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZnVuY3Rpb25hbFRoZW1lQ2xhc3NlcyAoY29udGV4dDogUmVuZGVyQ29udGV4dCk6IG9iamVjdCB7XG4gIGNvbnN0IHZtID0ge1xuICAgIC4uLmNvbnRleHQucHJvcHMsXG4gICAgLi4uY29udGV4dC5pbmplY3Rpb25zLFxuICB9XG4gIGNvbnN0IGlzRGFyayA9IFRoZW1lYWJsZS5vcHRpb25zLmNvbXB1dGVkLmlzRGFyay5jYWxsKHZtKVxuICByZXR1cm4gVGhlbWVhYmxlLm9wdGlvbnMuY29tcHV0ZWQudGhlbWVDbGFzc2VzLmNhbGwoeyBpc0RhcmsgfSlcbn1cblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmNvbnN0IFRoZW1lYWJsZSA9IFZ1ZS5leHRlbmQ8VGhlbWVhYmxlPigpLmV4dGVuZCh7XG4gIG5hbWU6ICd0aGVtZWFibGUnLFxuXG4gIHByb3ZpZGUgKCk6IG9iamVjdCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRoZW1lOiB0aGlzLnRoZW1lYWJsZVByb3ZpZGUsXG4gICAgfVxuICB9LFxuXG4gIGluamVjdDoge1xuICAgIHRoZW1lOiB7XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIGlzRGFyazogZmFsc2UsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG5cbiAgcHJvcHM6IHtcbiAgICBkYXJrOiB7XG4gICAgICB0eXBlOiBCb29sZWFuIGFzIFByb3BUeXBlPGJvb2xlYW4gfCBudWxsPixcbiAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgfSxcbiAgICBsaWdodDoge1xuICAgICAgdHlwZTogQm9vbGVhbiBhcyBQcm9wVHlwZTxib29sZWFuIHwgbnVsbD4sXG4gICAgICBkZWZhdWx0OiBudWxsLFxuICAgIH0sXG4gIH0sXG5cbiAgZGF0YSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRoZW1lYWJsZVByb3ZpZGU6IHtcbiAgICAgICAgaXNEYXJrOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfVxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgYXBwSXNEYXJrICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLiR2dWV0aWZ5LnRoZW1lLmRhcmsgfHwgZmFsc2VcbiAgICB9LFxuICAgIGlzRGFyayAoKTogYm9vbGVhbiB7XG4gICAgICBpZiAodGhpcy5kYXJrID09PSB0cnVlKSB7XG4gICAgICAgIC8vIGV4cGxpY2l0bHkgZGFya1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmxpZ2h0ID09PSB0cnVlKSB7XG4gICAgICAgIC8vIGV4cGxpY2l0bHkgbGlnaHRcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBpbmhlcml0IGZyb20gcGFyZW50LCBvciBkZWZhdWx0IGZhbHNlIGlmIHRoZXJlIGlzIG5vbmVcbiAgICAgICAgcmV0dXJuIHRoaXMudGhlbWUuaXNEYXJrXG4gICAgICB9XG4gICAgfSxcbiAgICB0aGVtZUNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAndGhlbWUtLWRhcmsnOiB0aGlzLmlzRGFyayxcbiAgICAgICAgJ3RoZW1lLS1saWdodCc6ICF0aGlzLmlzRGFyayxcbiAgICAgIH1cbiAgICB9LFxuICAgIC8qKiBVc2VkIGJ5IG1lbnVzIGFuZCBkaWFsb2dzLCBpbmhlcml0cyBmcm9tIHYtYXBwIGluc3RlYWQgb2YgdGhlIHBhcmVudCAqL1xuICAgIHJvb3RJc0RhcmsgKCk6IGJvb2xlYW4ge1xuICAgICAgaWYgKHRoaXMuZGFyayA9PT0gdHJ1ZSkge1xuICAgICAgICAvLyBleHBsaWNpdGx5IGRhcmtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5saWdodCA9PT0gdHJ1ZSkge1xuICAgICAgICAvLyBleHBsaWNpdGx5IGxpZ2h0XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gaW5oZXJpdCBmcm9tIHYtYXBwXG4gICAgICAgIHJldHVybiB0aGlzLmFwcElzRGFya1xuICAgICAgfVxuICAgIH0sXG4gICAgcm9vdFRoZW1lQ2xhc3NlcyAoKTogRGljdGlvbmFyeTxib29sZWFuPiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAndGhlbWUtLWRhcmsnOiB0aGlzLnJvb3RJc0RhcmssXG4gICAgICAgICd0aGVtZS0tbGlnaHQnOiAhdGhpcy5yb290SXNEYXJrLFxuICAgICAgfVxuICAgIH0sXG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICBpc0Rhcms6IHtcbiAgICAgIGhhbmRsZXIgKG5ld1ZhbCwgb2xkVmFsKSB7XG4gICAgICAgIGlmIChuZXdWYWwgIT09IG9sZFZhbCkge1xuICAgICAgICAgIHRoaXMudGhlbWVhYmxlUHJvdmlkZS5pc0RhcmsgPSB0aGlzLmlzRGFya1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgaW1tZWRpYXRlOiB0cnVlLFxuICAgIH0sXG4gIH0sXG59KVxuXG5leHBvcnQgZGVmYXVsdCBUaGVtZWFibGVcbiJdfQ==