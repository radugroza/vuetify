// Styles
import './VOverlay.sass';
// Mixins
import Colorable from './../../mixins/colorable';
import Themeable from '../../mixins/themeable';
import Toggleable from './../../mixins/toggleable';
// Utilities
import mixins from '../../util/mixins';
/* @vue/component */
export default mixins(Colorable, Themeable, Toggleable).extend({
    name: 'v-overlay',
    props: {
        absolute: Boolean,
        color: {
            type: String,
            default: '#212121',
        },
        dark: {
            type: Boolean,
            default: true,
        },
        opacity: {
            type: [Number, String],
            default: 0.46,
        },
        value: {
            default: true,
        },
        zIndex: {
            type: [Number, String],
            default: 5,
        },
    },
    computed: {
        __scrim() {
            const data = this.setBackgroundColor(this.color, {
                staticClass: 'v-overlay__scrim',
                style: {
                    opacity: this.computedOpacity,
                },
            });
            return this.$createElement('div', data);
        },
        classes() {
            return {
                'v-overlay--absolute': this.absolute,
                'v-overlay--active': this.isActive,
                ...this.themeClasses,
            };
        },
        computedOpacity() {
            return Number(this.isActive ? this.opacity : 0);
        },
        styles() {
            return {
                zIndex: this.zIndex,
            };
        },
    },
    methods: {
        genContent() {
            return this.$createElement('div', {
                staticClass: 'v-overlay__content',
            }, this.$slots.default);
        },
    },
    render(h) {
        const children = [this.__scrim];
        if (this.isActive)
            children.push(this.genContent());
        return h('div', {
            staticClass: 'v-overlay',
            class: this.classes,
            style: this.styles,
        }, children);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVk92ZXJsYXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WT3ZlcmxheS9WT3ZlcmxheS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxpQkFBaUIsQ0FBQTtBQUV4QixTQUFTO0FBQ1QsT0FBTyxTQUFTLE1BQU0sMEJBQTBCLENBQUE7QUFDaEQsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxVQUFVLE1BQU0sMkJBQTJCLENBQUE7QUFFbEQsWUFBWTtBQUNaLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBS3RDLG9CQUFvQjtBQUNwQixlQUFlLE1BQU0sQ0FDbkIsU0FBUyxFQUNULFNBQVMsRUFDVCxVQUFVLENBQ1gsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUsV0FBVztJQUVqQixLQUFLLEVBQUU7UUFDTCxRQUFRLEVBQUUsT0FBTztRQUNqQixLQUFLLEVBQUU7WUFDTCxJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxTQUFTO1NBQ25CO1FBQ0QsSUFBSSxFQUFFO1lBQ0osSUFBSSxFQUFFLE9BQU87WUFDYixPQUFPLEVBQUUsSUFBSTtTQUNkO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN0QixPQUFPLEVBQUUsSUFBSTtTQUNkO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsT0FBTyxFQUFFLElBQUk7U0FDZDtRQUNELE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxFQUFFLENBQUM7U0FDWDtLQUNGO0lBRUQsUUFBUSxFQUFFO1FBQ1IsT0FBTztZQUNMLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUMvQyxXQUFXLEVBQUUsa0JBQWtCO2dCQUMvQixLQUFLLEVBQUU7b0JBQ0wsT0FBTyxFQUFFLElBQUksQ0FBQyxlQUFlO2lCQUM5QjthQUNGLENBQUMsQ0FBQTtZQUVGLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFDekMsQ0FBQztRQUNELE9BQU87WUFDTCxPQUFPO2dCQUNMLHFCQUFxQixFQUFFLElBQUksQ0FBQyxRQUFRO2dCQUNwQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsUUFBUTtnQkFDbEMsR0FBRyxJQUFJLENBQUMsWUFBWTthQUNyQixDQUFBO1FBQ0gsQ0FBQztRQUNELGVBQWU7WUFDYixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNqRCxDQUFDO1FBQ0QsTUFBTTtZQUNKLE9BQU87Z0JBQ0wsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO2FBQ3BCLENBQUE7UUFDSCxDQUFDO0tBQ0Y7SUFFRCxPQUFPLEVBQUU7UUFDUCxVQUFVO1lBQ1IsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRTtnQkFDaEMsV0FBVyxFQUFFLG9CQUFvQjthQUNsQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDekIsQ0FBQztLQUNGO0lBRUQsTUFBTSxDQUFFLENBQUM7UUFDUCxNQUFNLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUUvQixJQUFJLElBQUksQ0FBQyxRQUFRO1lBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQTtRQUVuRCxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUU7WUFDZCxXQUFXLEVBQUUsV0FBVztZQUN4QixLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU87WUFDbkIsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNO1NBQ25CLEVBQUUsUUFBUSxDQUFDLENBQUE7SUFDZCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXG5pbXBvcnQgJy4vVk92ZXJsYXkuc2FzcydcblxuLy8gTWl4aW5zXG5pbXBvcnQgQ29sb3JhYmxlIGZyb20gJy4vLi4vLi4vbWl4aW5zL2NvbG9yYWJsZSdcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcbmltcG9ydCBUb2dnbGVhYmxlIGZyb20gJy4vLi4vLi4vbWl4aW5zL3RvZ2dsZWFibGUnXG5cbi8vIFV0aWxpdGllc1xuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcblxuLy8gVHlwZXNcbmltcG9ydCB7IFZOb2RlIH0gZnJvbSAndnVlJ1xuXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFxuICBDb2xvcmFibGUsXG4gIFRoZW1lYWJsZSxcbiAgVG9nZ2xlYWJsZVxuKS5leHRlbmQoe1xuICBuYW1lOiAndi1vdmVybGF5JyxcblxuICBwcm9wczoge1xuICAgIGFic29sdXRlOiBCb29sZWFuLFxuICAgIGNvbG9yOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnIzIxMjEyMScsXG4gICAgfSxcbiAgICBkYXJrOiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB9LFxuICAgIG9wYWNpdHk6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiAwLjQ2LFxuICAgIH0sXG4gICAgdmFsdWU6IHtcbiAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgfSxcbiAgICB6SW5kZXg6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiA1LFxuICAgIH0sXG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBfX3NjcmltICgpOiBWTm9kZSB7XG4gICAgICBjb25zdCBkYXRhID0gdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IodGhpcy5jb2xvciwge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3Ytb3ZlcmxheV9fc2NyaW0nLFxuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIG9wYWNpdHk6IHRoaXMuY29tcHV0ZWRPcGFjaXR5LFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIGRhdGEpXG4gICAgfSxcbiAgICBjbGFzc2VzICgpOiBvYmplY3Qge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgJ3Ytb3ZlcmxheS0tYWJzb2x1dGUnOiB0aGlzLmFic29sdXRlLFxuICAgICAgICAndi1vdmVybGF5LS1hY3RpdmUnOiB0aGlzLmlzQWN0aXZlLFxuICAgICAgICAuLi50aGlzLnRoZW1lQ2xhc3NlcyxcbiAgICAgIH1cbiAgICB9LFxuICAgIGNvbXB1dGVkT3BhY2l0eSAoKTogbnVtYmVyIHtcbiAgICAgIHJldHVybiBOdW1iZXIodGhpcy5pc0FjdGl2ZSA/IHRoaXMub3BhY2l0eSA6IDApXG4gICAgfSxcbiAgICBzdHlsZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB6SW5kZXg6IHRoaXMuekluZGV4LFxuICAgICAgfVxuICAgIH0sXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGdlbkNvbnRlbnQgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LW92ZXJsYXlfX2NvbnRlbnQnLFxuICAgICAgfSwgdGhpcy4kc2xvdHMuZGVmYXVsdClcbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcbiAgICBjb25zdCBjaGlsZHJlbiA9IFt0aGlzLl9fc2NyaW1dXG5cbiAgICBpZiAodGhpcy5pc0FjdGl2ZSkgY2hpbGRyZW4ucHVzaCh0aGlzLmdlbkNvbnRlbnQoKSlcblxuICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICBzdGF0aWNDbGFzczogJ3Ytb3ZlcmxheScsXG4gICAgICBjbGFzczogdGhpcy5jbGFzc2VzLFxuICAgICAgc3R5bGU6IHRoaXMuc3R5bGVzLFxuICAgIH0sIGNoaWxkcmVuKVxuICB9LFxufSlcbiJdfQ==