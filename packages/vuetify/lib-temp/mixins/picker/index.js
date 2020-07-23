// Components
import VPicker from '../../components/VPicker';
// Mixins
import Colorable from '../colorable';
import Elevatable from '../../mixins/elevatable';
import Themeable from '../themeable';
// Utils
import mixins from '../../util/mixins';
export default mixins(Colorable, Elevatable, Themeable
/* @vue/component */
).extend({
    name: 'picker',
    props: {
        flat: Boolean,
        fullWidth: Boolean,
        headerColor: String,
        landscape: Boolean,
        noTitle: Boolean,
        width: {
            type: [Number, String],
            default: 290,
        },
    },
    methods: {
        genPickerTitle() {
            return null;
        },
        genPickerBody() {
            return null;
        },
        genPickerActionsSlot() {
            return this.$scopedSlots.default ? this.$scopedSlots.default({
                save: this.save,
                cancel: this.cancel,
            }) : this.$slots.default;
        },
        genPicker(staticClass) {
            const children = [];
            if (!this.noTitle) {
                const title = this.genPickerTitle();
                title && children.push(title);
            }
            const body = this.genPickerBody();
            body && children.push(body);
            children.push(this.$createElement('template', { slot: 'actions' }, [this.genPickerActionsSlot()]));
            return this.$createElement(VPicker, {
                staticClass,
                props: {
                    color: this.headerColor || this.color,
                    dark: this.dark,
                    elevation: this.elevation,
                    flat: this.flat,
                    fullWidth: this.fullWidth,
                    landscape: this.landscape,
                    light: this.light,
                    width: this.width,
                    noTitle: this.noTitle,
                },
            }, children);
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL3BpY2tlci9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxhQUFhO0FBQ2IsT0FBTyxPQUFPLE1BQU0sMEJBQTBCLENBQUE7QUFFOUMsU0FBUztBQUNULE9BQU8sU0FBUyxNQUFNLGNBQWMsQ0FBQTtBQUNwQyxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUNoRCxPQUFPLFNBQVMsTUFBTSxjQUFjLENBQUE7QUFFcEMsUUFBUTtBQUNSLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBS3RDLGVBQWUsTUFBTSxDQUNuQixTQUFTLEVBQ1QsVUFBVSxFQUNWLFNBQVM7QUFDWCxvQkFBb0I7Q0FDbkIsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUsUUFBUTtJQUVkLEtBQUssRUFBRTtRQUNMLElBQUksRUFBRSxPQUFPO1FBQ2IsU0FBUyxFQUFFLE9BQU87UUFDbEIsV0FBVyxFQUFFLE1BQU07UUFDbkIsU0FBUyxFQUFFLE9BQU87UUFDbEIsT0FBTyxFQUFFLE9BQU87UUFDaEIsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN0QixPQUFPLEVBQUUsR0FBRztTQUNiO0tBQ0Y7SUFFRCxPQUFPLEVBQUU7UUFDUCxjQUFjO1lBQ1osT0FBTyxJQUFJLENBQUE7UUFDYixDQUFDO1FBQ0QsYUFBYTtZQUNYLE9BQU8sSUFBSSxDQUFBO1FBQ2IsQ0FBQztRQUNELG9CQUFvQjtZQUNsQixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQztnQkFDM0QsSUFBSSxFQUFHLElBQVksQ0FBQyxJQUFJO2dCQUN4QixNQUFNLEVBQUcsSUFBWSxDQUFDLE1BQU07YUFDN0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQTtRQUMxQixDQUFDO1FBQ0QsU0FBUyxDQUFFLFdBQW1CO1lBQzVCLE1BQU0sUUFBUSxHQUFZLEVBQUUsQ0FBQTtZQUU1QixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDakIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFBO2dCQUNuQyxLQUFLLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTthQUM5QjtZQUVELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQTtZQUNqQyxJQUFJLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUUzQixRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFFbEcsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRTtnQkFDbEMsV0FBVztnQkFDWCxLQUFLLEVBQUU7b0JBQ0wsS0FBSyxFQUFFLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLEtBQUs7b0JBQ3JDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtvQkFDZixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7b0JBQ3pCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtvQkFDZixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7b0JBQ3pCLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztvQkFDekIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO29CQUNqQixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7b0JBQ2pCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztpQkFDdEI7YUFDRixFQUFFLFFBQVEsQ0FBQyxDQUFBO1FBQ2QsQ0FBQztLQUNGO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29tcG9uZW50c1xuaW1wb3J0IFZQaWNrZXIgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9WUGlja2VyJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBDb2xvcmFibGUgZnJvbSAnLi4vY29sb3JhYmxlJ1xuaW1wb3J0IEVsZXZhdGFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2VsZXZhdGFibGUnXG5pbXBvcnQgVGhlbWVhYmxlIGZyb20gJy4uL3RoZW1lYWJsZSdcblxuLy8gVXRpbHNcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZSdcblxuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFxuICBDb2xvcmFibGUsXG4gIEVsZXZhdGFibGUsXG4gIFRoZW1lYWJsZVxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbikuZXh0ZW5kKHtcbiAgbmFtZTogJ3BpY2tlcicsXG5cbiAgcHJvcHM6IHtcbiAgICBmbGF0OiBCb29sZWFuLFxuICAgIGZ1bGxXaWR0aDogQm9vbGVhbixcbiAgICBoZWFkZXJDb2xvcjogU3RyaW5nLFxuICAgIGxhbmRzY2FwZTogQm9vbGVhbixcbiAgICBub1RpdGxlOiBCb29sZWFuLFxuICAgIHdpZHRoOiB7XG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxuICAgICAgZGVmYXVsdDogMjkwLFxuICAgIH0sXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGdlblBpY2tlclRpdGxlICgpOiBWTm9kZSB8IG51bGwge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9LFxuICAgIGdlblBpY2tlckJvZHkgKCk6IFZOb2RlIHwgbnVsbCB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH0sXG4gICAgZ2VuUGlja2VyQWN0aW9uc1Nsb3QgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuJHNjb3BlZFNsb3RzLmRlZmF1bHQgPyB0aGlzLiRzY29wZWRTbG90cy5kZWZhdWx0KHtcbiAgICAgICAgc2F2ZTogKHRoaXMgYXMgYW55KS5zYXZlLFxuICAgICAgICBjYW5jZWw6ICh0aGlzIGFzIGFueSkuY2FuY2VsLFxuICAgICAgfSkgOiB0aGlzLiRzbG90cy5kZWZhdWx0XG4gICAgfSxcbiAgICBnZW5QaWNrZXIgKHN0YXRpY0NsYXNzOiBzdHJpbmcpIHtcbiAgICAgIGNvbnN0IGNoaWxkcmVuOiBWTm9kZVtdID0gW11cblxuICAgICAgaWYgKCF0aGlzLm5vVGl0bGUpIHtcbiAgICAgICAgY29uc3QgdGl0bGUgPSB0aGlzLmdlblBpY2tlclRpdGxlKClcbiAgICAgICAgdGl0bGUgJiYgY2hpbGRyZW4ucHVzaCh0aXRsZSlcbiAgICAgIH1cblxuICAgICAgY29uc3QgYm9keSA9IHRoaXMuZ2VuUGlja2VyQm9keSgpXG4gICAgICBib2R5ICYmIGNoaWxkcmVuLnB1c2goYm9keSlcblxuICAgICAgY2hpbGRyZW4ucHVzaCh0aGlzLiRjcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScsIHsgc2xvdDogJ2FjdGlvbnMnIH0sIFt0aGlzLmdlblBpY2tlckFjdGlvbnNTbG90KCldKSlcblxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVlBpY2tlciwge1xuICAgICAgICBzdGF0aWNDbGFzcyxcbiAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICBjb2xvcjogdGhpcy5oZWFkZXJDb2xvciB8fCB0aGlzLmNvbG9yLFxuICAgICAgICAgIGRhcms6IHRoaXMuZGFyayxcbiAgICAgICAgICBlbGV2YXRpb246IHRoaXMuZWxldmF0aW9uLFxuICAgICAgICAgIGZsYXQ6IHRoaXMuZmxhdCxcbiAgICAgICAgICBmdWxsV2lkdGg6IHRoaXMuZnVsbFdpZHRoLFxuICAgICAgICAgIGxhbmRzY2FwZTogdGhpcy5sYW5kc2NhcGUsXG4gICAgICAgICAgbGlnaHQ6IHRoaXMubGlnaHQsXG4gICAgICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXG4gICAgICAgICAgbm9UaXRsZTogdGhpcy5ub1RpdGxlLFxuICAgICAgICB9LFxuICAgICAgfSwgY2hpbGRyZW4pXG4gICAgfSxcbiAgfSxcbn0pXG4iXX0=