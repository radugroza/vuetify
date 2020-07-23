// Styles
import './VCard.sass';
// Extensions
import VSheet from '../VSheet';
// Mixins
import Loadable from '../../mixins/loadable';
import Routable from '../../mixins/routable';
// Helpers
import mixins from '../../util/mixins';
/* @vue/component */
export default mixins(Loadable, Routable, VSheet).extend({
    name: 'v-card',
    props: {
        flat: Boolean,
        hover: Boolean,
        img: String,
        link: Boolean,
        loaderHeight: {
            type: [Number, String],
            default: 4,
        },
        raised: Boolean,
    },
    computed: {
        classes() {
            return {
                'v-card': true,
                ...Routable.options.computed.classes.call(this),
                'v-card--flat': this.flat,
                'v-card--hover': this.hover,
                'v-card--link': this.isClickable,
                'v-card--loading': this.loading,
                'v-card--disabled': this.disabled,
                'v-card--raised': this.raised,
                ...VSheet.options.computed.classes.call(this),
            };
        },
        styles() {
            const style = {
                ...VSheet.options.computed.styles.call(this),
            };
            if (this.img) {
                style.background = `url("${this.img}") center center / cover no-repeat`;
            }
            return style;
        },
    },
    methods: {
        genProgress() {
            const render = Loadable.options.methods.genProgress.call(this);
            if (!render)
                return null;
            return this.$createElement('div', {
                staticClass: 'v-card__progress',
                key: 'progress',
            }, [render]);
        },
    },
    render(h) {
        const { tag, data } = this.generateRouteLink();
        data.style = this.styles;
        if (this.isClickable) {
            data.attrs = data.attrs || {};
            data.attrs.tabindex = 0;
        }
        return h(tag, this.setBackgroundColor(this.color, data), [
            this.genProgress(),
            this.$slots.default,
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkNhcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WQ2FyZC9WQ2FyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxjQUFjLENBQUE7QUFFckIsYUFBYTtBQUNiLE9BQU8sTUFBTSxNQUFNLFdBQVcsQ0FBQTtBQUU5QixTQUFTO0FBQ1QsT0FBTyxRQUFRLE1BQU0sdUJBQXVCLENBQUE7QUFDNUMsT0FBTyxRQUFRLE1BQU0sdUJBQXVCLENBQUE7QUFFNUMsVUFBVTtBQUNWLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBS3RDLG9CQUFvQjtBQUNwQixlQUFlLE1BQU0sQ0FDbkIsUUFBUSxFQUNSLFFBQVEsRUFDUixNQUFNLENBQ1AsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUsUUFBUTtJQUVkLEtBQUssRUFBRTtRQUNMLElBQUksRUFBRSxPQUFPO1FBQ2IsS0FBSyxFQUFFLE9BQU87UUFDZCxHQUFHLEVBQUUsTUFBTTtRQUNYLElBQUksRUFBRSxPQUFPO1FBQ2IsWUFBWSxFQUFFO1lBQ1osSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN0QixPQUFPLEVBQUUsQ0FBQztTQUNYO1FBQ0QsTUFBTSxFQUFFLE9BQU87S0FDaEI7SUFFRCxRQUFRLEVBQUU7UUFDUixPQUFPO1lBQ0wsT0FBTztnQkFDTCxRQUFRLEVBQUUsSUFBSTtnQkFDZCxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUMvQyxjQUFjLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ3pCLGVBQWUsRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDM0IsY0FBYyxFQUFFLElBQUksQ0FBQyxXQUFXO2dCQUNoQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsT0FBTztnQkFDL0Isa0JBQWtCLEVBQUUsSUFBSSxDQUFDLFFBQVE7Z0JBQ2pDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxNQUFNO2dCQUM3QixHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQzlDLENBQUE7UUFDSCxDQUFDO1FBQ0QsTUFBTTtZQUNKLE1BQU0sS0FBSyxHQUF1QjtnQkFDaEMsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUM3QyxDQUFBO1lBRUQsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUNaLEtBQUssQ0FBQyxVQUFVLEdBQUcsUUFBUSxJQUFJLENBQUMsR0FBRyxvQ0FBb0MsQ0FBQTthQUN4RTtZQUVELE9BQU8sS0FBSyxDQUFBO1FBQ2QsQ0FBQztLQUNGO0lBRUQsT0FBTyxFQUFFO1FBQ1AsV0FBVztZQUNULE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7WUFFOUQsSUFBSSxDQUFDLE1BQU07Z0JBQUUsT0FBTyxJQUFJLENBQUE7WUFFeEIsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRTtnQkFDaEMsV0FBVyxFQUFFLGtCQUFrQjtnQkFDL0IsR0FBRyxFQUFFLFVBQVU7YUFDaEIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7UUFDZCxDQUFDO0tBQ0Y7SUFFRCxNQUFNLENBQUUsQ0FBQztRQUNQLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFFOUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFBO1FBRXhCLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNwQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFBO1lBQzdCLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQTtTQUN4QjtRQUVELE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRTtZQUN2RCxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTztTQUNwQixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXG5pbXBvcnQgJy4vVkNhcmQuc2FzcydcblxuLy8gRXh0ZW5zaW9uc1xuaW1wb3J0IFZTaGVldCBmcm9tICcuLi9WU2hlZXQnXG5cbi8vIE1peGluc1xuaW1wb3J0IExvYWRhYmxlIGZyb20gJy4uLy4uL21peGlucy9sb2FkYWJsZSdcbmltcG9ydCBSb3V0YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvcm91dGFibGUnXG5cbi8vIEhlbHBlcnNcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZSdcblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IG1peGlucyhcbiAgTG9hZGFibGUsXG4gIFJvdXRhYmxlLFxuICBWU2hlZXRcbikuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtY2FyZCcsXG5cbiAgcHJvcHM6IHtcbiAgICBmbGF0OiBCb29sZWFuLFxuICAgIGhvdmVyOiBCb29sZWFuLFxuICAgIGltZzogU3RyaW5nLFxuICAgIGxpbms6IEJvb2xlYW4sXG4gICAgbG9hZGVySGVpZ2h0OiB7XG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxuICAgICAgZGVmYXVsdDogNCxcbiAgICB9LFxuICAgIHJhaXNlZDogQm9vbGVhbixcbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAndi1jYXJkJzogdHJ1ZSxcbiAgICAgICAgLi4uUm91dGFibGUub3B0aW9ucy5jb21wdXRlZC5jbGFzc2VzLmNhbGwodGhpcyksXG4gICAgICAgICd2LWNhcmQtLWZsYXQnOiB0aGlzLmZsYXQsXG4gICAgICAgICd2LWNhcmQtLWhvdmVyJzogdGhpcy5ob3ZlcixcbiAgICAgICAgJ3YtY2FyZC0tbGluayc6IHRoaXMuaXNDbGlja2FibGUsXG4gICAgICAgICd2LWNhcmQtLWxvYWRpbmcnOiB0aGlzLmxvYWRpbmcsXG4gICAgICAgICd2LWNhcmQtLWRpc2FibGVkJzogdGhpcy5kaXNhYmxlZCxcbiAgICAgICAgJ3YtY2FyZC0tcmFpc2VkJzogdGhpcy5yYWlzZWQsXG4gICAgICAgIC4uLlZTaGVldC5vcHRpb25zLmNvbXB1dGVkLmNsYXNzZXMuY2FsbCh0aGlzKSxcbiAgICAgIH1cbiAgICB9LFxuICAgIHN0eWxlcyAoKTogb2JqZWN0IHtcbiAgICAgIGNvbnN0IHN0eWxlOiBEaWN0aW9uYXJ5PHN0cmluZz4gPSB7XG4gICAgICAgIC4uLlZTaGVldC5vcHRpb25zLmNvbXB1dGVkLnN0eWxlcy5jYWxsKHRoaXMpLFxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5pbWcpIHtcbiAgICAgICAgc3R5bGUuYmFja2dyb3VuZCA9IGB1cmwoXCIke3RoaXMuaW1nfVwiKSBjZW50ZXIgY2VudGVyIC8gY292ZXIgbm8tcmVwZWF0YFxuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3R5bGVcbiAgICB9LFxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBnZW5Qcm9ncmVzcyAoKSB7XG4gICAgICBjb25zdCByZW5kZXIgPSBMb2FkYWJsZS5vcHRpb25zLm1ldGhvZHMuZ2VuUHJvZ3Jlc3MuY2FsbCh0aGlzKVxuXG4gICAgICBpZiAoIXJlbmRlcikgcmV0dXJuIG51bGxcblxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWNhcmRfX3Byb2dyZXNzJyxcbiAgICAgICAga2V5OiAncHJvZ3Jlc3MnLFxuICAgICAgfSwgW3JlbmRlcl0pXG4gICAgfSxcbiAgfSxcblxuICByZW5kZXIgKGgpOiBWTm9kZSB7XG4gICAgY29uc3QgeyB0YWcsIGRhdGEgfSA9IHRoaXMuZ2VuZXJhdGVSb3V0ZUxpbmsoKVxuXG4gICAgZGF0YS5zdHlsZSA9IHRoaXMuc3R5bGVzXG5cbiAgICBpZiAodGhpcy5pc0NsaWNrYWJsZSkge1xuICAgICAgZGF0YS5hdHRycyA9IGRhdGEuYXR0cnMgfHwge31cbiAgICAgIGRhdGEuYXR0cnMudGFiaW5kZXggPSAwXG4gICAgfVxuXG4gICAgcmV0dXJuIGgodGFnLCB0aGlzLnNldEJhY2tncm91bmRDb2xvcih0aGlzLmNvbG9yLCBkYXRhKSwgW1xuICAgICAgdGhpcy5nZW5Qcm9ncmVzcygpLFxuICAgICAgdGhpcy4kc2xvdHMuZGVmYXVsdCxcbiAgICBdKVxuICB9LFxufSlcbiJdfQ==