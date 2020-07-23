// Styles
import './VBtnToggle.sass';
// Mixins
import ButtonGroup from '../../mixins/button-group';
import Colorable from '../../mixins/colorable';
// Utilities
import mixins from '../../util/mixins';
/* @vue/component */
export default mixins(ButtonGroup, Colorable).extend({
    name: 'v-btn-toggle',
    props: {
        backgroundColor: String,
        borderless: Boolean,
        dense: Boolean,
        group: Boolean,
        rounded: Boolean,
        shaped: Boolean,
        tile: Boolean,
    },
    computed: {
        classes() {
            return {
                ...ButtonGroup.options.computed.classes.call(this),
                'v-btn-toggle': true,
                'v-btn-toggle--borderless': this.borderless,
                'v-btn-toggle--dense': this.dense,
                'v-btn-toggle--group': this.group,
                'v-btn-toggle--rounded': this.rounded,
                'v-btn-toggle--shaped': this.shaped,
                'v-btn-toggle--tile': this.tile,
                ...this.themeClasses,
            };
        },
    },
    methods: {
        genData() {
            const data = this.setTextColor(this.color, {
                ...ButtonGroup.options.methods.genData.call(this),
            });
            if (this.group)
                return data;
            return this.setBackgroundColor(this.backgroundColor, data);
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkJ0blRvZ2dsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZCdG5Ub2dnbGUvVkJ0blRvZ2dsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxtQkFBbUIsQ0FBQTtBQUUxQixTQUFTO0FBQ1QsT0FBTyxXQUFXLE1BQU0sMkJBQTJCLENBQUE7QUFDbkQsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFFOUMsWUFBWTtBQUNaLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBRXRDLG9CQUFvQjtBQUNwQixlQUFlLE1BQU0sQ0FDbkIsV0FBVyxFQUNYLFNBQVMsQ0FDVixDQUFDLE1BQU0sQ0FBQztJQUNQLElBQUksRUFBRSxjQUFjO0lBRXBCLEtBQUssRUFBRTtRQUNMLGVBQWUsRUFBRSxNQUFNO1FBQ3ZCLFVBQVUsRUFBRSxPQUFPO1FBQ25CLEtBQUssRUFBRSxPQUFPO1FBQ2QsS0FBSyxFQUFFLE9BQU87UUFDZCxPQUFPLEVBQUUsT0FBTztRQUNoQixNQUFNLEVBQUUsT0FBTztRQUNmLElBQUksRUFBRSxPQUFPO0tBQ2Q7SUFFRCxRQUFRLEVBQUU7UUFDUixPQUFPO1lBQ0wsT0FBTztnQkFDTCxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUNsRCxjQUFjLEVBQUUsSUFBSTtnQkFDcEIsMEJBQTBCLEVBQUUsSUFBSSxDQUFDLFVBQVU7Z0JBQzNDLHFCQUFxQixFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUNqQyxxQkFBcUIsRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDakMsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLE9BQU87Z0JBQ3JDLHNCQUFzQixFQUFFLElBQUksQ0FBQyxNQUFNO2dCQUNuQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDL0IsR0FBRyxJQUFJLENBQUMsWUFBWTthQUNyQixDQUFBO1FBQ0gsQ0FBQztLQUNGO0lBRUQsT0FBTyxFQUFFO1FBQ1AsT0FBTztZQUNMLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDekMsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUNsRCxDQUFDLENBQUE7WUFFRixJQUFJLElBQUksQ0FBQyxLQUFLO2dCQUFFLE9BQU8sSUFBSSxDQUFBO1lBRTNCLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFDNUQsQ0FBQztLQUNGO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXG5pbXBvcnQgJy4vVkJ0blRvZ2dsZS5zYXNzJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBCdXR0b25Hcm91cCBmcm9tICcuLi8uLi9taXhpbnMvYnV0dG9uLWdyb3VwJ1xuaW1wb3J0IENvbG9yYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvY29sb3JhYmxlJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBtaXhpbnMoXG4gIEJ1dHRvbkdyb3VwLFxuICBDb2xvcmFibGVcbikuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtYnRuLXRvZ2dsZScsXG5cbiAgcHJvcHM6IHtcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFN0cmluZyxcbiAgICBib3JkZXJsZXNzOiBCb29sZWFuLFxuICAgIGRlbnNlOiBCb29sZWFuLFxuICAgIGdyb3VwOiBCb29sZWFuLFxuICAgIHJvdW5kZWQ6IEJvb2xlYW4sXG4gICAgc2hhcGVkOiBCb29sZWFuLFxuICAgIHRpbGU6IEJvb2xlYW4sXG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBjbGFzc2VzICgpOiBvYmplY3Qge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uQnV0dG9uR3JvdXAub3B0aW9ucy5jb21wdXRlZC5jbGFzc2VzLmNhbGwodGhpcyksXG4gICAgICAgICd2LWJ0bi10b2dnbGUnOiB0cnVlLFxuICAgICAgICAndi1idG4tdG9nZ2xlLS1ib3JkZXJsZXNzJzogdGhpcy5ib3JkZXJsZXNzLFxuICAgICAgICAndi1idG4tdG9nZ2xlLS1kZW5zZSc6IHRoaXMuZGVuc2UsXG4gICAgICAgICd2LWJ0bi10b2dnbGUtLWdyb3VwJzogdGhpcy5ncm91cCxcbiAgICAgICAgJ3YtYnRuLXRvZ2dsZS0tcm91bmRlZCc6IHRoaXMucm91bmRlZCxcbiAgICAgICAgJ3YtYnRuLXRvZ2dsZS0tc2hhcGVkJzogdGhpcy5zaGFwZWQsXG4gICAgICAgICd2LWJ0bi10b2dnbGUtLXRpbGUnOiB0aGlzLnRpbGUsXG4gICAgICAgIC4uLnRoaXMudGhlbWVDbGFzc2VzLFxuICAgICAgfVxuICAgIH0sXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGdlbkRhdGEgKCkge1xuICAgICAgY29uc3QgZGF0YSA9IHRoaXMuc2V0VGV4dENvbG9yKHRoaXMuY29sb3IsIHtcbiAgICAgICAgLi4uQnV0dG9uR3JvdXAub3B0aW9ucy5tZXRob2RzLmdlbkRhdGEuY2FsbCh0aGlzKSxcbiAgICAgIH0pXG5cbiAgICAgIGlmICh0aGlzLmdyb3VwKSByZXR1cm4gZGF0YVxuXG4gICAgICByZXR1cm4gdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IodGhpcy5iYWNrZ3JvdW5kQ29sb3IsIGRhdGEpXG4gICAgfSxcbiAgfSxcbn0pXG4iXX0=