import './VResponsive.sass';
// Mixins
import Measurable from '../../mixins/measurable';
// Utils
import mixins from '../../util/mixins';
/* @vue/component */
export default mixins(Measurable).extend({
    name: 'v-responsive',
    props: {
        aspectRatio: [String, Number],
    },
    computed: {
        computedAspectRatio() {
            return Number(this.aspectRatio);
        },
        aspectStyle() {
            return this.computedAspectRatio
                ? { paddingBottom: (1 / this.computedAspectRatio) * 100 + '%' }
                : undefined;
        },
        __cachedSizer() {
            if (!this.aspectStyle)
                return [];
            return this.$createElement('div', {
                style: this.aspectStyle,
                staticClass: 'v-responsive__sizer',
            });
        },
    },
    methods: {
        genContent() {
            return this.$createElement('div', {
                staticClass: 'v-responsive__content',
            }, this.$slots.default);
        },
    },
    render(h) {
        return h('div', {
            staticClass: 'v-responsive',
            style: this.measurableStyles,
            on: this.$listeners,
        }, [
            this.__cachedSizer,
            this.genContent(),
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlJlc3BvbnNpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WUmVzcG9uc2l2ZS9WUmVzcG9uc2l2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLG9CQUFvQixDQUFBO0FBRTNCLFNBQVM7QUFDVCxPQUFPLFVBQW9DLE1BQU0seUJBQXlCLENBQUE7QUFLMUUsUUFBUTtBQUNSLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBRXRDLG9CQUFvQjtBQUNwQixlQUFlLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDdkMsSUFBSSxFQUFFLGNBQWM7SUFFcEIsS0FBSyxFQUFFO1FBQ0wsV0FBVyxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBeUI7S0FDdEQ7SUFFRCxRQUFRLEVBQUU7UUFDUixtQkFBbUI7WUFDakIsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ2pDLENBQUM7UUFDRCxXQUFXO1lBQ1QsT0FBTyxJQUFJLENBQUMsbUJBQW1CO2dCQUM3QixDQUFDLENBQUMsRUFBRSxhQUFhLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsRUFBRTtnQkFDL0QsQ0FBQyxDQUFDLFNBQVMsQ0FBQTtRQUNmLENBQUM7UUFDRCxhQUFhO1lBQ1gsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXO2dCQUFFLE9BQU8sRUFBRSxDQUFBO1lBRWhDLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2hDLEtBQUssRUFBRSxJQUFJLENBQUMsV0FBVztnQkFDdkIsV0FBVyxFQUFFLHFCQUFxQjthQUNuQyxDQUFDLENBQUE7UUFDSixDQUFDO0tBQ0Y7SUFFRCxPQUFPLEVBQUU7UUFDUCxVQUFVO1lBQ1IsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRTtnQkFDaEMsV0FBVyxFQUFFLHVCQUF1QjthQUNyQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDekIsQ0FBQztLQUNGO0lBRUQsTUFBTSxDQUFFLENBQUM7UUFDUCxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUU7WUFDZCxXQUFXLEVBQUUsY0FBYztZQUMzQixLQUFLLEVBQUUsSUFBSSxDQUFDLGdCQUFnQjtZQUM1QixFQUFFLEVBQUUsSUFBSSxDQUFDLFVBQVU7U0FDcEIsRUFBRTtZQUNELElBQUksQ0FBQyxhQUFhO1lBQ2xCLElBQUksQ0FBQyxVQUFVLEVBQUU7U0FDbEIsQ0FBQyxDQUFBO0lBQ0osQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi9WUmVzcG9uc2l2ZS5zYXNzJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBNZWFzdXJhYmxlLCB7IE51bWJlck9yTnVtYmVyU3RyaW5nIH0gZnJvbSAnLi4vLi4vbWl4aW5zL21lYXN1cmFibGUnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZSdcblxuLy8gVXRpbHNcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBtaXhpbnMoTWVhc3VyYWJsZSkuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtcmVzcG9uc2l2ZScsXG5cbiAgcHJvcHM6IHtcbiAgICBhc3BlY3RSYXRpbzogW1N0cmluZywgTnVtYmVyXSBhcyBOdW1iZXJPck51bWJlclN0cmluZyxcbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGNvbXB1dGVkQXNwZWN0UmF0aW8gKCk6IG51bWJlciB7XG4gICAgICByZXR1cm4gTnVtYmVyKHRoaXMuYXNwZWN0UmF0aW8pXG4gICAgfSxcbiAgICBhc3BlY3RTdHlsZSAoKTogb2JqZWN0IHwgdW5kZWZpbmVkIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbXB1dGVkQXNwZWN0UmF0aW9cbiAgICAgICAgPyB7IHBhZGRpbmdCb3R0b206ICgxIC8gdGhpcy5jb21wdXRlZEFzcGVjdFJhdGlvKSAqIDEwMCArICclJyB9XG4gICAgICAgIDogdW5kZWZpbmVkXG4gICAgfSxcbiAgICBfX2NhY2hlZFNpemVyICgpOiBWTm9kZSB8IFtdIHtcbiAgICAgIGlmICghdGhpcy5hc3BlY3RTdHlsZSkgcmV0dXJuIFtdXG5cbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgIHN0eWxlOiB0aGlzLmFzcGVjdFN0eWxlLFxuICAgICAgICBzdGF0aWNDbGFzczogJ3YtcmVzcG9uc2l2ZV9fc2l6ZXInLFxuICAgICAgfSlcbiAgICB9LFxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBnZW5Db250ZW50ICgpOiBWTm9kZSB7XG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3YtcmVzcG9uc2l2ZV9fY29udGVudCcsXG4gICAgICB9LCB0aGlzLiRzbG90cy5kZWZhdWx0KVxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyIChoKTogVk5vZGUge1xuICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICBzdGF0aWNDbGFzczogJ3YtcmVzcG9uc2l2ZScsXG4gICAgICBzdHlsZTogdGhpcy5tZWFzdXJhYmxlU3R5bGVzLFxuICAgICAgb246IHRoaXMuJGxpc3RlbmVycyxcbiAgICB9LCBbXG4gICAgICB0aGlzLl9fY2FjaGVkU2l6ZXIsXG4gICAgICB0aGlzLmdlbkNvbnRlbnQoKSxcbiAgICBdKVxuICB9LFxufSlcbiJdfQ==