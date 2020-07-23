import './VAvatar.sass';
// Mixins
import Colorable from '../../mixins/colorable';
import Measurable from '../../mixins/measurable';
import Roundable from '../../mixins/roundable';
// Utilities
import { convertToUnit } from '../../util/helpers';
import mixins from '../../util/mixins';
export default mixins(Colorable, Measurable, Roundable).extend({
    name: 'v-avatar',
    props: {
        left: Boolean,
        right: Boolean,
        size: {
            type: [Number, String],
            default: 48,
        },
    },
    computed: {
        classes() {
            return {
                'v-avatar--left': this.left,
                'v-avatar--right': this.right,
                ...this.roundedClasses,
            };
        },
        styles() {
            return {
                height: convertToUnit(this.size),
                minWidth: convertToUnit(this.size),
                width: convertToUnit(this.size),
                ...this.measurableStyles,
            };
        },
    },
    render(h) {
        const data = {
            staticClass: 'v-avatar',
            class: this.classes,
            style: this.styles,
            on: this.$listeners,
        };
        return h('div', this.setBackgroundColor(this.color, data), this.$slots.default);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkF2YXRhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZBdmF0YXIvVkF2YXRhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLGdCQUFnQixDQUFBO0FBRXZCLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUNoRCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUU5QyxZQUFZO0FBQ1osT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBSWxELE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBRXRDLGVBQWUsTUFBTSxDQUNuQixTQUFTLEVBQ1QsVUFBVSxFQUNWLFNBQVMsQ0FFVixDQUFDLE1BQU0sQ0FBQztJQUNQLElBQUksRUFBRSxVQUFVO0lBRWhCLEtBQUssRUFBRTtRQUNMLElBQUksRUFBRSxPQUFPO1FBQ2IsS0FBSyxFQUFFLE9BQU87UUFDZCxJQUFJLEVBQUU7WUFDSixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxFQUFFO1NBQ1o7S0FDRjtJQUVELFFBQVEsRUFBRTtRQUNSLE9BQU87WUFDTCxPQUFPO2dCQUNMLGdCQUFnQixFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUMzQixpQkFBaUIsRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDN0IsR0FBRyxJQUFJLENBQUMsY0FBYzthQUN2QixDQUFBO1FBQ0gsQ0FBQztRQUNELE1BQU07WUFDSixPQUFPO2dCQUNMLE1BQU0sRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDaEMsUUFBUSxFQUFFLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUNsQyxLQUFLLEVBQUUsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQy9CLEdBQUcsSUFBSSxDQUFDLGdCQUFnQjthQUN6QixDQUFBO1FBQ0gsQ0FBQztLQUNGO0lBRUQsTUFBTSxDQUFFLENBQUM7UUFDUCxNQUFNLElBQUksR0FBRztZQUNYLFdBQVcsRUFBRSxVQUFVO1lBQ3ZCLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTztZQUNuQixLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbEIsRUFBRSxFQUFFLElBQUksQ0FBQyxVQUFVO1NBQ3BCLENBQUE7UUFFRCxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUNqRixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuL1ZBdmF0YXIuc2FzcydcblxuLy8gTWl4aW5zXG5pbXBvcnQgQ29sb3JhYmxlIGZyb20gJy4uLy4uL21peGlucy9jb2xvcmFibGUnXG5pbXBvcnQgTWVhc3VyYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvbWVhc3VyYWJsZSdcbmltcG9ydCBSb3VuZGFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3JvdW5kYWJsZSdcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgeyBjb252ZXJ0VG9Vbml0IH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgVk5vZGUgfSBmcm9tICd2dWUnXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuXG5leHBvcnQgZGVmYXVsdCBtaXhpbnMoXG4gIENvbG9yYWJsZSxcbiAgTWVhc3VyYWJsZSxcbiAgUm91bmRhYmxlLFxuICAvKiBAdnVlL2NvbXBvbmVudCAqL1xuKS5leHRlbmQoe1xuICBuYW1lOiAndi1hdmF0YXInLFxuXG4gIHByb3BzOiB7XG4gICAgbGVmdDogQm9vbGVhbixcbiAgICByaWdodDogQm9vbGVhbixcbiAgICBzaXplOiB7XG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxuICAgICAgZGVmYXVsdDogNDgsXG4gICAgfSxcbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAndi1hdmF0YXItLWxlZnQnOiB0aGlzLmxlZnQsXG4gICAgICAgICd2LWF2YXRhci0tcmlnaHQnOiB0aGlzLnJpZ2h0LFxuICAgICAgICAuLi50aGlzLnJvdW5kZWRDbGFzc2VzLFxuICAgICAgfVxuICAgIH0sXG4gICAgc3R5bGVzICgpOiBvYmplY3Qge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaGVpZ2h0OiBjb252ZXJ0VG9Vbml0KHRoaXMuc2l6ZSksXG4gICAgICAgIG1pbldpZHRoOiBjb252ZXJ0VG9Vbml0KHRoaXMuc2l6ZSksXG4gICAgICAgIHdpZHRoOiBjb252ZXJ0VG9Vbml0KHRoaXMuc2l6ZSksXG4gICAgICAgIC4uLnRoaXMubWVhc3VyYWJsZVN0eWxlcyxcbiAgICAgIH1cbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcbiAgICBjb25zdCBkYXRhID0ge1xuICAgICAgc3RhdGljQ2xhc3M6ICd2LWF2YXRhcicsXG4gICAgICBjbGFzczogdGhpcy5jbGFzc2VzLFxuICAgICAgc3R5bGU6IHRoaXMuc3R5bGVzLFxuICAgICAgb246IHRoaXMuJGxpc3RlbmVycyxcbiAgICB9XG5cbiAgICByZXR1cm4gaCgnZGl2JywgdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IodGhpcy5jb2xvciwgZGF0YSksIHRoaXMuJHNsb3RzLmRlZmF1bHQpXG4gIH0sXG59KVxuIl19