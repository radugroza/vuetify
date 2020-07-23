// Styles
import './VTimeline.sass';
import mixins from '../../util/mixins';
// Mixins
import Themeable from '../../mixins/themeable';
export default mixins(Themeable
/* @vue/component */
).extend({
    name: 'v-timeline',
    provide() {
        return { timeline: this };
    },
    props: {
        alignTop: Boolean,
        dense: Boolean,
        reverse: Boolean,
    },
    computed: {
        classes() {
            return {
                'v-timeline--align-top': this.alignTop,
                'v-timeline--dense': this.dense,
                'v-timeline--reverse': this.reverse,
                ...this.themeClasses,
            };
        },
    },
    render(h) {
        return h('div', {
            staticClass: 'v-timeline',
            class: this.classes,
        }, this.$slots.default);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlRpbWVsaW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVlRpbWVsaW5lL1ZUaW1lbGluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxrQkFBa0IsQ0FBQTtBQUl6QixPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQUV0QyxTQUFTO0FBQ1QsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFFOUMsZUFBZSxNQUFNLENBQ25CLFNBQVM7QUFDWCxvQkFBb0I7Q0FDbkIsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUsWUFBWTtJQUVsQixPQUFPO1FBQ0wsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQTtJQUMzQixDQUFDO0lBRUQsS0FBSyxFQUFFO1FBQ0wsUUFBUSxFQUFFLE9BQU87UUFDakIsS0FBSyxFQUFFLE9BQU87UUFDZCxPQUFPLEVBQUUsT0FBTztLQUNqQjtJQUVELFFBQVEsRUFBRTtRQUNSLE9BQU87WUFDTCxPQUFPO2dCQUNMLHVCQUF1QixFQUFFLElBQUksQ0FBQyxRQUFRO2dCQUN0QyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDL0IscUJBQXFCLEVBQUUsSUFBSSxDQUFDLE9BQU87Z0JBQ25DLEdBQUcsSUFBSSxDQUFDLFlBQVk7YUFDckIsQ0FBQTtRQUNILENBQUM7S0FDRjtJQUVELE1BQU0sQ0FBRSxDQUFDO1FBQ1AsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFO1lBQ2QsV0FBVyxFQUFFLFlBQVk7WUFDekIsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPO1NBQ3BCLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUN6QixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXG5pbXBvcnQgJy4vVlRpbWVsaW5lLnNhc3MnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZSdcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5cbi8vIE1peGluc1xuaW1wb3J0IFRoZW1lYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdGhlbWVhYmxlJ1xuXG5leHBvcnQgZGVmYXVsdCBtaXhpbnMoXG4gIFRoZW1lYWJsZVxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbikuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtdGltZWxpbmUnLFxuXG4gIHByb3ZpZGUgKCk6IG9iamVjdCB7XG4gICAgcmV0dXJuIHsgdGltZWxpbmU6IHRoaXMgfVxuICB9LFxuXG4gIHByb3BzOiB7XG4gICAgYWxpZ25Ub3A6IEJvb2xlYW4sXG4gICAgZGVuc2U6IEJvb2xlYW4sXG4gICAgcmV2ZXJzZTogQm9vbGVhbixcbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGNsYXNzZXMgKCk6IHt9IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICd2LXRpbWVsaW5lLS1hbGlnbi10b3AnOiB0aGlzLmFsaWduVG9wLFxuICAgICAgICAndi10aW1lbGluZS0tZGVuc2UnOiB0aGlzLmRlbnNlLFxuICAgICAgICAndi10aW1lbGluZS0tcmV2ZXJzZSc6IHRoaXMucmV2ZXJzZSxcbiAgICAgICAgLi4udGhpcy50aGVtZUNsYXNzZXMsXG4gICAgICB9XG4gICAgfSxcbiAgfSxcblxuICByZW5kZXIgKGgpOiBWTm9kZSB7XG4gICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgIHN0YXRpY0NsYXNzOiAndi10aW1lbGluZScsXG4gICAgICBjbGFzczogdGhpcy5jbGFzc2VzLFxuICAgIH0sIHRoaXMuJHNsb3RzLmRlZmF1bHQpXG4gIH0sXG59KVxuIl19