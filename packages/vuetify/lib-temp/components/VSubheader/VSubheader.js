// Styles
import './VSubheader.sass';
// Mixins
import Themeable from '../../mixins/themeable';
import mixins from '../../util/mixins';
export default mixins(Themeable
/* @vue/component */
).extend({
    name: 'v-subheader',
    props: {
        inset: Boolean,
    },
    render(h) {
        return h('div', {
            staticClass: 'v-subheader',
            class: {
                'v-subheader--inset': this.inset,
                ...this.themeClasses,
            },
            attrs: this.$attrs,
            on: this.$listeners,
        }, this.$slots.default);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlN1YmhlYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZTdWJoZWFkZXIvVlN1YmhlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxtQkFBbUIsQ0FBQTtBQUUxQixTQUFTO0FBQ1QsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFLdEMsZUFBZSxNQUFNLENBQ25CLFNBQVM7QUFDVCxvQkFBb0I7Q0FDckIsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUsYUFBYTtJQUVuQixLQUFLLEVBQUU7UUFDTCxLQUFLLEVBQUUsT0FBTztLQUNmO0lBRUQsTUFBTSxDQUFFLENBQUM7UUFDUCxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUU7WUFDZCxXQUFXLEVBQUUsYUFBYTtZQUMxQixLQUFLLEVBQUU7Z0JBQ0wsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLEtBQUs7Z0JBQ2hDLEdBQUcsSUFBSSxDQUFDLFlBQVk7YUFDckI7WUFDRCxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbEIsRUFBRSxFQUFFLElBQUksQ0FBQyxVQUFVO1NBQ3BCLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUN6QixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXG5pbXBvcnQgJy4vVlN1YmhlYWRlci5zYXNzJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZSdcblxuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFxuICBUaGVtZWFibGVcbiAgLyogQHZ1ZS9jb21wb25lbnQgKi9cbikuZXh0ZW5kKHtcbiAgbmFtZTogJ3Ytc3ViaGVhZGVyJyxcblxuICBwcm9wczoge1xuICAgIGluc2V0OiBCb29sZWFuLFxuICB9LFxuXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcbiAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgc3RhdGljQ2xhc3M6ICd2LXN1YmhlYWRlcicsXG4gICAgICBjbGFzczoge1xuICAgICAgICAndi1zdWJoZWFkZXItLWluc2V0JzogdGhpcy5pbnNldCxcbiAgICAgICAgLi4udGhpcy50aGVtZUNsYXNzZXMsXG4gICAgICB9LFxuICAgICAgYXR0cnM6IHRoaXMuJGF0dHJzLFxuICAgICAgb246IHRoaXMuJGxpc3RlbmVycyxcbiAgICB9LCB0aGlzLiRzbG90cy5kZWZhdWx0KVxuICB9LFxufSlcbiJdfQ==