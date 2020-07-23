import Vue from 'vue';
import { consoleError } from '../../util/console';
import { isCssColor } from '../../util/colorUtils';
export default Vue.extend({
    name: 'colorable',
    props: {
        color: String,
    },
    methods: {
        setBackgroundColor(color, data = {}) {
            if (typeof data.style === 'string') {
                // istanbul ignore next
                consoleError('style must be an object', this);
                // istanbul ignore next
                return data;
            }
            if (typeof data.class === 'string') {
                // istanbul ignore next
                consoleError('class must be an object', this);
                // istanbul ignore next
                return data;
            }
            if (isCssColor(color)) {
                data.style = {
                    ...data.style,
                    'background-color': `${color}`,
                    'border-color': `${color}`,
                };
            }
            else if (color) {
                data.class = {
                    ...data.class,
                    [color]: true,
                };
            }
            return data;
        },
        setTextColor(color, data = {}) {
            if (typeof data.style === 'string') {
                // istanbul ignore next
                consoleError('style must be an object', this);
                // istanbul ignore next
                return data;
            }
            if (typeof data.class === 'string') {
                // istanbul ignore next
                consoleError('class must be an object', this);
                // istanbul ignore next
                return data;
            }
            if (isCssColor(color)) {
                data.style = {
                    ...data.style,
                    color: `${color}`,
                    'caret-color': `${color}`,
                };
            }
            else if (color) {
                const [colorName, colorModifier] = color.toString().trim().split(' ', 2);
                data.class = {
                    ...data.class,
                    [colorName + '--text']: true,
                };
                if (colorModifier) {
                    data.class['text--' + colorModifier] = true;
                }
            }
            return data;
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL2NvbG9yYWJsZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEdBQUcsTUFBTSxLQUFLLENBQUE7QUFFckIsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQ2pELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQTtBQUVsRCxlQUFlLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFDeEIsSUFBSSxFQUFFLFdBQVc7SUFFakIsS0FBSyxFQUFFO1FBQ0wsS0FBSyxFQUFFLE1BQU07S0FDZDtJQUVELE9BQU8sRUFBRTtRQUNQLGtCQUFrQixDQUFFLEtBQXNCLEVBQUUsT0FBa0IsRUFBRTtZQUM5RCxJQUFJLE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBSyxRQUFRLEVBQUU7Z0JBQ2xDLHVCQUF1QjtnQkFDdkIsWUFBWSxDQUFDLHlCQUF5QixFQUFFLElBQUksQ0FBQyxDQUFBO2dCQUM3Qyx1QkFBdUI7Z0JBQ3ZCLE9BQU8sSUFBSSxDQUFBO2FBQ1o7WUFDRCxJQUFJLE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBSyxRQUFRLEVBQUU7Z0JBQ2xDLHVCQUF1QjtnQkFDdkIsWUFBWSxDQUFDLHlCQUF5QixFQUFFLElBQUksQ0FBQyxDQUFBO2dCQUM3Qyx1QkFBdUI7Z0JBQ3ZCLE9BQU8sSUFBSSxDQUFBO2FBQ1o7WUFDRCxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDckIsSUFBSSxDQUFDLEtBQUssR0FBRztvQkFDWCxHQUFHLElBQUksQ0FBQyxLQUFlO29CQUN2QixrQkFBa0IsRUFBRSxHQUFHLEtBQUssRUFBRTtvQkFDOUIsY0FBYyxFQUFFLEdBQUcsS0FBSyxFQUFFO2lCQUMzQixDQUFBO2FBQ0Y7aUJBQU0sSUFBSSxLQUFLLEVBQUU7Z0JBQ2hCLElBQUksQ0FBQyxLQUFLLEdBQUc7b0JBQ1gsR0FBRyxJQUFJLENBQUMsS0FBSztvQkFDYixDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUk7aUJBQ2QsQ0FBQTthQUNGO1lBRUQsT0FBTyxJQUFJLENBQUE7UUFDYixDQUFDO1FBRUQsWUFBWSxDQUFFLEtBQXNCLEVBQUUsT0FBa0IsRUFBRTtZQUN4RCxJQUFJLE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBSyxRQUFRLEVBQUU7Z0JBQ2xDLHVCQUF1QjtnQkFDdkIsWUFBWSxDQUFDLHlCQUF5QixFQUFFLElBQUksQ0FBQyxDQUFBO2dCQUM3Qyx1QkFBdUI7Z0JBQ3ZCLE9BQU8sSUFBSSxDQUFBO2FBQ1o7WUFDRCxJQUFJLE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBSyxRQUFRLEVBQUU7Z0JBQ2xDLHVCQUF1QjtnQkFDdkIsWUFBWSxDQUFDLHlCQUF5QixFQUFFLElBQUksQ0FBQyxDQUFBO2dCQUM3Qyx1QkFBdUI7Z0JBQ3ZCLE9BQU8sSUFBSSxDQUFBO2FBQ1o7WUFDRCxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDckIsSUFBSSxDQUFDLEtBQUssR0FBRztvQkFDWCxHQUFHLElBQUksQ0FBQyxLQUFlO29CQUN2QixLQUFLLEVBQUUsR0FBRyxLQUFLLEVBQUU7b0JBQ2pCLGFBQWEsRUFBRSxHQUFHLEtBQUssRUFBRTtpQkFDMUIsQ0FBQTthQUNGO2lCQUFNLElBQUksS0FBSyxFQUFFO2dCQUNoQixNQUFNLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxHQUFHLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBMkIsQ0FBQTtnQkFDbEcsSUFBSSxDQUFDLEtBQUssR0FBRztvQkFDWCxHQUFHLElBQUksQ0FBQyxLQUFLO29CQUNiLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxFQUFFLElBQUk7aUJBQzdCLENBQUE7Z0JBQ0QsSUFBSSxhQUFhLEVBQUU7b0JBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLGFBQWEsQ0FBQyxHQUFHLElBQUksQ0FBQTtpQkFDNUM7YUFDRjtZQUNELE9BQU8sSUFBSSxDQUFBO1FBQ2IsQ0FBQztLQUNGO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZ1ZSBmcm9tICd2dWUnXG5pbXBvcnQgeyBWTm9kZURhdGEgfSBmcm9tICd2dWUvdHlwZXMvdm5vZGUnXG5pbXBvcnQgeyBjb25zb2xlRXJyb3IgfSBmcm9tICcuLi8uLi91dGlsL2NvbnNvbGUnXG5pbXBvcnQgeyBpc0Nzc0NvbG9yIH0gZnJvbSAnLi4vLi4vdXRpbC9jb2xvclV0aWxzJ1xuXG5leHBvcnQgZGVmYXVsdCBWdWUuZXh0ZW5kKHtcbiAgbmFtZTogJ2NvbG9yYWJsZScsXG5cbiAgcHJvcHM6IHtcbiAgICBjb2xvcjogU3RyaW5nLFxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBzZXRCYWNrZ3JvdW5kQ29sb3IgKGNvbG9yPzogc3RyaW5nIHwgZmFsc2UsIGRhdGE6IFZOb2RlRGF0YSA9IHt9KTogVk5vZGVEYXRhIHtcbiAgICAgIGlmICh0eXBlb2YgZGF0YS5zdHlsZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgY29uc29sZUVycm9yKCdzdHlsZSBtdXN0IGJlIGFuIG9iamVjdCcsIHRoaXMpXG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHJldHVybiBkYXRhXG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGRhdGEuY2xhc3MgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIGNvbnNvbGVFcnJvcignY2xhc3MgbXVzdCBiZSBhbiBvYmplY3QnLCB0aGlzKVxuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICByZXR1cm4gZGF0YVxuICAgICAgfVxuICAgICAgaWYgKGlzQ3NzQ29sb3IoY29sb3IpKSB7XG4gICAgICAgIGRhdGEuc3R5bGUgPSB7XG4gICAgICAgICAgLi4uZGF0YS5zdHlsZSBhcyBvYmplY3QsXG4gICAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiBgJHtjb2xvcn1gLFxuICAgICAgICAgICdib3JkZXItY29sb3InOiBgJHtjb2xvcn1gLFxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGNvbG9yKSB7XG4gICAgICAgIGRhdGEuY2xhc3MgPSB7XG4gICAgICAgICAgLi4uZGF0YS5jbGFzcyxcbiAgICAgICAgICBbY29sb3JdOiB0cnVlLFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkYXRhXG4gICAgfSxcblxuICAgIHNldFRleHRDb2xvciAoY29sb3I/OiBzdHJpbmcgfCBmYWxzZSwgZGF0YTogVk5vZGVEYXRhID0ge30pOiBWTm9kZURhdGEge1xuICAgICAgaWYgKHR5cGVvZiBkYXRhLnN0eWxlID09PSAnc3RyaW5nJykge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBjb25zb2xlRXJyb3IoJ3N0eWxlIG11c3QgYmUgYW4gb2JqZWN0JywgdGhpcylcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgcmV0dXJuIGRhdGFcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgZGF0YS5jbGFzcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgY29uc29sZUVycm9yKCdjbGFzcyBtdXN0IGJlIGFuIG9iamVjdCcsIHRoaXMpXG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHJldHVybiBkYXRhXG4gICAgICB9XG4gICAgICBpZiAoaXNDc3NDb2xvcihjb2xvcikpIHtcbiAgICAgICAgZGF0YS5zdHlsZSA9IHtcbiAgICAgICAgICAuLi5kYXRhLnN0eWxlIGFzIG9iamVjdCxcbiAgICAgICAgICBjb2xvcjogYCR7Y29sb3J9YCxcbiAgICAgICAgICAnY2FyZXQtY29sb3InOiBgJHtjb2xvcn1gLFxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGNvbG9yKSB7XG4gICAgICAgIGNvbnN0IFtjb2xvck5hbWUsIGNvbG9yTW9kaWZpZXJdID0gY29sb3IudG9TdHJpbmcoKS50cmltKCkuc3BsaXQoJyAnLCAyKSBhcyAoc3RyaW5nIHwgdW5kZWZpbmVkKVtdXG4gICAgICAgIGRhdGEuY2xhc3MgPSB7XG4gICAgICAgICAgLi4uZGF0YS5jbGFzcyxcbiAgICAgICAgICBbY29sb3JOYW1lICsgJy0tdGV4dCddOiB0cnVlLFxuICAgICAgICB9XG4gICAgICAgIGlmIChjb2xvck1vZGlmaWVyKSB7XG4gICAgICAgICAgZGF0YS5jbGFzc1sndGV4dC0tJyArIGNvbG9yTW9kaWZpZXJdID0gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZGF0YVxuICAgIH0sXG4gIH0sXG59KVxuIl19