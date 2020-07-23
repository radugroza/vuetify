// Styles
import './VDivider.sass';
// Mixins
import Themeable from '../../mixins/themeable';
export default Themeable.extend({
    name: 'v-divider',
    props: {
        inset: Boolean,
        vertical: Boolean,
    },
    render(h) {
        // WAI-ARIA attributes
        let orientation;
        if (!this.$attrs.role || this.$attrs.role === 'separator') {
            orientation = this.vertical ? 'vertical' : 'horizontal';
        }
        return h('hr', {
            class: {
                'v-divider': true,
                'v-divider--inset': this.inset,
                'v-divider--vertical': this.vertical,
                ...this.themeClasses,
            },
            attrs: {
                role: 'separator',
                'aria-orientation': orientation,
                ...this.$attrs,
            },
            on: this.$listeners,
        });
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkRpdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WRGl2aWRlci9WRGl2aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxpQkFBaUIsQ0FBQTtBQUt4QixTQUFTO0FBQ1QsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFFOUMsZUFBZSxTQUFTLENBQUMsTUFBTSxDQUFDO0lBQzlCLElBQUksRUFBRSxXQUFXO0lBRWpCLEtBQUssRUFBRTtRQUNMLEtBQUssRUFBRSxPQUFPO1FBQ2QsUUFBUSxFQUFFLE9BQU87S0FDbEI7SUFFRCxNQUFNLENBQUUsQ0FBQztRQUNQLHNCQUFzQjtRQUN0QixJQUFJLFdBQVcsQ0FBQTtRQUNmLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxXQUFXLEVBQUU7WUFDekQsV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFBO1NBQ3hEO1FBQ0QsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFO1lBQ2IsS0FBSyxFQUFFO2dCQUNMLFdBQVcsRUFBRSxJQUFJO2dCQUNqQixrQkFBa0IsRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDOUIscUJBQXFCLEVBQUUsSUFBSSxDQUFDLFFBQVE7Z0JBQ3BDLEdBQUcsSUFBSSxDQUFDLFlBQVk7YUFDckI7WUFDRCxLQUFLLEVBQUU7Z0JBQ0wsSUFBSSxFQUFFLFdBQVc7Z0JBQ2pCLGtCQUFrQixFQUFFLFdBQVc7Z0JBQy9CLEdBQUcsSUFBSSxDQUFDLE1BQU07YUFDZjtZQUNELEVBQUUsRUFBRSxJQUFJLENBQUMsVUFBVTtTQUNwQixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXG5pbXBvcnQgJy4vVkRpdmlkZXIuc2FzcydcblxuLy8gVHlwZXNcbmltcG9ydCB7IFZOb2RlIH0gZnJvbSAndnVlJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcblxuZXhwb3J0IGRlZmF1bHQgVGhlbWVhYmxlLmV4dGVuZCh7XG4gIG5hbWU6ICd2LWRpdmlkZXInLFxuXG4gIHByb3BzOiB7XG4gICAgaW5zZXQ6IEJvb2xlYW4sXG4gICAgdmVydGljYWw6IEJvb2xlYW4sXG4gIH0sXG5cbiAgcmVuZGVyIChoKTogVk5vZGUge1xuICAgIC8vIFdBSS1BUklBIGF0dHJpYnV0ZXNcbiAgICBsZXQgb3JpZW50YXRpb25cbiAgICBpZiAoIXRoaXMuJGF0dHJzLnJvbGUgfHwgdGhpcy4kYXR0cnMucm9sZSA9PT0gJ3NlcGFyYXRvcicpIHtcbiAgICAgIG9yaWVudGF0aW9uID0gdGhpcy52ZXJ0aWNhbCA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCdcbiAgICB9XG4gICAgcmV0dXJuIGgoJ2hyJywge1xuICAgICAgY2xhc3M6IHtcbiAgICAgICAgJ3YtZGl2aWRlcic6IHRydWUsXG4gICAgICAgICd2LWRpdmlkZXItLWluc2V0JzogdGhpcy5pbnNldCxcbiAgICAgICAgJ3YtZGl2aWRlci0tdmVydGljYWwnOiB0aGlzLnZlcnRpY2FsLFxuICAgICAgICAuLi50aGlzLnRoZW1lQ2xhc3NlcyxcbiAgICAgIH0sXG4gICAgICBhdHRyczoge1xuICAgICAgICByb2xlOiAnc2VwYXJhdG9yJyxcbiAgICAgICAgJ2FyaWEtb3JpZW50YXRpb24nOiBvcmllbnRhdGlvbixcbiAgICAgICAgLi4udGhpcy4kYXR0cnMsXG4gICAgICB9LFxuICAgICAgb246IHRoaXMuJGxpc3RlbmVycyxcbiAgICB9KVxuICB9LFxufSlcbiJdfQ==