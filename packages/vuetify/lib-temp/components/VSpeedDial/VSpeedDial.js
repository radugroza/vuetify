// Styles
import './VSpeedDial.sass';
// Mixins
import Toggleable from '../../mixins/toggleable';
import Positionable from '../../mixins/positionable';
import Transitionable from '../../mixins/transitionable';
// Directives
import ClickOutside from '../../directives/click-outside';
// Types
import mixins from '../../util/mixins';
/* @vue/component */
export default mixins(Positionable, Toggleable, Transitionable).extend({
    name: 'v-speed-dial',
    directives: { ClickOutside },
    props: {
        direction: {
            type: String,
            default: 'top',
            validator: (val) => {
                return ['top', 'right', 'bottom', 'left'].includes(val);
            },
        },
        openOnHover: Boolean,
        transition: {
            type: String,
            default: 'scale-transition',
        },
    },
    computed: {
        classes() {
            return {
                'v-speed-dial': true,
                'v-speed-dial--top': this.top,
                'v-speed-dial--right': this.right,
                'v-speed-dial--bottom': this.bottom,
                'v-speed-dial--left': this.left,
                'v-speed-dial--absolute': this.absolute,
                'v-speed-dial--fixed': this.fixed,
                [`v-speed-dial--direction-${this.direction}`]: true,
                'v-speed-dial--is-active': this.isActive,
            };
        },
    },
    render(h) {
        let children = [];
        const data = {
            class: this.classes,
            directives: [{
                    name: 'click-outside',
                    value: () => (this.isActive = false),
                }],
            on: {
                click: () => (this.isActive = !this.isActive),
            },
        };
        if (this.openOnHover) {
            data.on.mouseenter = () => (this.isActive = true);
            data.on.mouseleave = () => (this.isActive = false);
        }
        if (this.isActive) {
            let btnCount = 0;
            children = (this.$slots.default || []).map((b, i) => {
                if (b.tag && typeof b.componentOptions !== 'undefined' && (b.componentOptions.Ctor.options.name === 'v-btn' || b.componentOptions.Ctor.options.name === 'v-tooltip')) {
                    btnCount++;
                    return h('div', {
                        style: {
                            transitionDelay: btnCount * 0.05 + 's',
                        },
                        key: i,
                    }, [b]);
                }
                else {
                    b.key = i;
                    return b;
                }
            });
        }
        const list = h('transition-group', {
            class: 'v-speed-dial__list',
            props: {
                name: this.transition,
                mode: this.mode,
                origin: this.origin,
                tag: 'div',
            },
        }, children);
        return h('div', data, [this.$slots.activator, list]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlNwZWVkRGlhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZTcGVlZERpYWwvVlNwZWVkRGlhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxtQkFBbUIsQ0FBQTtBQUUxQixTQUFTO0FBQ1QsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFDaEQsT0FBTyxZQUFZLE1BQU0sMkJBQTJCLENBQUE7QUFDcEQsT0FBTyxjQUFjLE1BQU0sNkJBQTZCLENBQUE7QUFFeEQsYUFBYTtBQUNiLE9BQU8sWUFBWSxNQUFNLGdDQUFnQyxDQUFBO0FBRXpELFFBQVE7QUFDUixPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQUl0QyxvQkFBb0I7QUFDcEIsZUFBZSxNQUFNLENBQUMsWUFBWSxFQUFFLFVBQVUsRUFBRSxjQUFjLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDckUsSUFBSSxFQUFFLGNBQWM7SUFFcEIsVUFBVSxFQUFFLEVBQUUsWUFBWSxFQUFFO0lBRTVCLEtBQUssRUFBRTtRQUNMLFNBQVMsRUFBRTtZQUNULElBQUksRUFBRSxNQUFtRDtZQUN6RCxPQUFPLEVBQUUsS0FBSztZQUNkLFNBQVMsRUFBRSxDQUFDLEdBQVcsRUFBRSxFQUFFO2dCQUN6QixPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQ3pELENBQUM7U0FDRjtRQUNELFdBQVcsRUFBRSxPQUFPO1FBQ3BCLFVBQVUsRUFBRTtZQUNWLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLGtCQUFrQjtTQUM1QjtLQUNGO0lBRUQsUUFBUSxFQUFFO1FBQ1IsT0FBTztZQUNMLE9BQU87Z0JBQ0wsY0FBYyxFQUFFLElBQUk7Z0JBQ3BCLG1CQUFtQixFQUFFLElBQUksQ0FBQyxHQUFHO2dCQUM3QixxQkFBcUIs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Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcbmltcG9ydCAnLi9WU3BlZWREaWFsLnNhc3MnXG5cbi8vIE1peGluc1xuaW1wb3J0IFRvZ2dsZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RvZ2dsZWFibGUnXG5pbXBvcnQgUG9zaXRpb25hYmxlIGZyb20gJy4uLy4uL21peGlucy9wb3NpdGlvbmFibGUnXG5pbXBvcnQgVHJhbnNpdGlvbmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RyYW5zaXRpb25hYmxlJ1xuXG4vLyBEaXJlY3RpdmVzXG5pbXBvcnQgQ2xpY2tPdXRzaWRlIGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvY2xpY2stb3V0c2lkZSdcblxuLy8gVHlwZXNcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5pbXBvcnQgeyBWTm9kZSwgVk5vZGVEYXRhIH0gZnJvbSAndnVlJ1xuaW1wb3J0IHsgUHJvcCB9IGZyb20gJ3Z1ZS90eXBlcy9vcHRpb25zJ1xuXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFBvc2l0aW9uYWJsZSwgVG9nZ2xlYWJsZSwgVHJhbnNpdGlvbmFibGUpLmV4dGVuZCh7XG4gIG5hbWU6ICd2LXNwZWVkLWRpYWwnLFxuXG4gIGRpcmVjdGl2ZXM6IHsgQ2xpY2tPdXRzaWRlIH0sXG5cbiAgcHJvcHM6IHtcbiAgICBkaXJlY3Rpb246IHtcbiAgICAgIHR5cGU6IFN0cmluZyBhcyBQcm9wPCd0b3AnIHwgJ3JpZ2h0JyB8ICdib3R0b20nIHwgJ2xlZnQnPixcbiAgICAgIGRlZmF1bHQ6ICd0b3AnLFxuICAgICAgdmFsaWRhdG9yOiAodmFsOiBzdHJpbmcpID0+IHtcbiAgICAgICAgcmV0dXJuIFsndG9wJywgJ3JpZ2h0JywgJ2JvdHRvbScsICdsZWZ0J10uaW5jbHVkZXModmFsKVxuICAgICAgfSxcbiAgICB9LFxuICAgIG9wZW5PbkhvdmVyOiBCb29sZWFuLFxuICAgIHRyYW5zaXRpb246IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICdzY2FsZS10cmFuc2l0aW9uJyxcbiAgICB9LFxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICd2LXNwZWVkLWRpYWwnOiB0cnVlLFxuICAgICAgICAndi1zcGVlZC1kaWFsLS10b3AnOiB0aGlzLnRvcCxcbiAgICAgICAgJ3Ytc3BlZWQtZGlhbC0tcmlnaHQnOiB0aGlzLnJpZ2h0LFxuICAgICAgICAndi1zcGVlZC1kaWFsLS1ib3R0b20nOiB0aGlzLmJvdHRvbSxcbiAgICAgICAgJ3Ytc3BlZWQtZGlhbC0tbGVmdCc6IHRoaXMubGVmdCxcbiAgICAgICAgJ3Ytc3BlZWQtZGlhbC0tYWJzb2x1dGUnOiB0aGlzLmFic29sdXRlLFxuICAgICAgICAndi1zcGVlZC1kaWFsLS1maXhlZCc6IHRoaXMuZml4ZWQsXG4gICAgICAgIFtgdi1zcGVlZC1kaWFsLS1kaXJlY3Rpb24tJHt0aGlzLmRpcmVjdGlvbn1gXTogdHJ1ZSxcbiAgICAgICAgJ3Ytc3BlZWQtZGlhbC0taXMtYWN0aXZlJzogdGhpcy5pc0FjdGl2ZSxcbiAgICAgIH1cbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcbiAgICBsZXQgY2hpbGRyZW46IFZOb2RlW10gPSBbXVxuICAgIGNvbnN0IGRhdGE6IFZOb2RlRGF0YSA9IHtcbiAgICAgIGNsYXNzOiB0aGlzLmNsYXNzZXMsXG4gICAgICBkaXJlY3RpdmVzOiBbe1xuICAgICAgICBuYW1lOiAnY2xpY2stb3V0c2lkZScsXG4gICAgICAgIHZhbHVlOiAoKSA9PiAodGhpcy5pc0FjdGl2ZSA9IGZhbHNlKSxcbiAgICAgIH1dLFxuICAgICAgb246IHtcbiAgICAgICAgY2xpY2s6ICgpID0+ICh0aGlzLmlzQWN0aXZlID0gIXRoaXMuaXNBY3RpdmUpLFxuICAgICAgfSxcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcGVuT25Ib3Zlcikge1xuICAgICAgZGF0YS5vbiEubW91c2VlbnRlciA9ICgpID0+ICh0aGlzLmlzQWN0aXZlID0gdHJ1ZSlcbiAgICAgIGRhdGEub24hLm1vdXNlbGVhdmUgPSAoKSA9PiAodGhpcy5pc0FjdGl2ZSA9IGZhbHNlKVxuICAgIH1cblxuICAgIGlmICh0aGlzLmlzQWN0aXZlKSB7XG4gICAgICBsZXQgYnRuQ291bnQgPSAwXG4gICAgICBjaGlsZHJlbiA9ICh0aGlzLiRzbG90cy5kZWZhdWx0IHx8IFtdKS5tYXAoKGIsIGkpID0+IHtcbiAgICAgICAgaWYgKGIudGFnICYmIHR5cGVvZiBiLmNvbXBvbmVudE9wdGlvbnMgIT09ICd1bmRlZmluZWQnICYmIChiLmNvbXBvbmVudE9wdGlvbnMuQ3Rvci5vcHRpb25zLm5hbWUgPT09ICd2LWJ0bicgfHwgYi5jb21wb25lbnRPcHRpb25zLkN0b3Iub3B0aW9ucy5uYW1lID09PSAndi10b29sdGlwJykpIHtcbiAgICAgICAgICBidG5Db3VudCsrXG4gICAgICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgIHRyYW5zaXRpb25EZWxheTogYnRuQ291bnQgKiAwLjA1ICsgJ3MnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGtleTogaSxcbiAgICAgICAgICB9LCBbYl0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYi5rZXkgPSBpXG4gICAgICAgICAgcmV0dXJuIGJcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCBsaXN0ID0gaCgndHJhbnNpdGlvbi1ncm91cCcsIHtcbiAgICAgIGNsYXNzOiAndi1zcGVlZC1kaWFsX19saXN0JyxcbiAgICAgIHByb3BzOiB7XG4gICAgICAgIG5hbWU6IHRoaXMudHJhbnNpdGlvbixcbiAgICAgICAgbW9kZTogdGhpcy5tb2RlLFxuICAgICAgICBvcmlnaW46IHRoaXMub3JpZ2luLFxuICAgICAgICB0YWc6ICdkaXYnLFxuICAgICAgfSxcbiAgICB9LCBjaGlsZHJlbilcblxuICAgIHJldHVybiBoKCdkaXYnLCBkYXRhLCBbdGhpcy4kc2xvdHMuYWN0aXZhdG9yLCBsaXN0XSlcbiAgfSxcbn0pXG4iXX0=