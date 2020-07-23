import './VVirtualTable.sass';
// Components
import VSimpleTable from './VSimpleTable';
import mixins from '../../util/mixins';
// Utiltiies
import { convertToUnit, debounce } from '../../util/helpers';
// Types
const baseMixins = mixins(VSimpleTable);
export default baseMixins.extend().extend({
    name: 'v-virtual-table',
    props: {
        chunkSize: {
            type: Number,
            default: 25,
        },
        headerHeight: {
            type: Number,
            default: 48,
        },
        items: {
            type: Array,
            default: () => ([]),
        },
        rowHeight: {
            type: Number,
            default: 48,
        },
    },
    data: () => ({
        scrollTop: 0,
        oldChunk: 0,
        scrollDebounce: null,
        invalidateCache: false,
    }),
    computed: {
        itemsLength() {
            return this.items.length;
        },
        totalHeight() {
            return (this.itemsLength * this.rowHeight) + this.headerHeight;
        },
        topIndex() {
            return Math.floor(this.scrollTop / this.rowHeight);
        },
        chunkIndex() {
            return Math.floor(this.topIndex / this.chunkSize);
        },
        startIndex() {
            return Math.max(0, (this.chunkIndex * this.chunkSize) - this.chunkSize);
        },
        offsetTop() {
            return Math.max(0, this.startIndex * this.rowHeight);
        },
        stopIndex() {
            return Math.min(this.startIndex + (this.chunkSize * 3), this.itemsLength);
        },
        offsetBottom() {
            return Math.max(0, (this.itemsLength - this.stopIndex - this.startIndex) * this.rowHeight);
        },
    },
    watch: {
        chunkIndex(newValue, oldValue) {
            this.oldChunk = oldValue;
        },
        items() {
            this.cachedItems = null;
            this.$refs.table.scrollTop = 0;
        },
    },
    created() {
        this.cachedItems = null;
    },
    mounted() {
        this.scrollDebounce = debounce(this.onScroll, 50);
        this.$refs.table.addEventListener('scroll', this.scrollDebounce, { passive: true });
    },
    beforeDestroy() {
        this.$refs.table.removeEventListener('scroll', this.scrollDebounce);
    },
    methods: {
        createStyleHeight(height) {
            return {
                height: `${height}px`,
            };
        },
        genBody() {
            if (this.cachedItems === null || this.chunkIndex !== this.oldChunk) {
                this.cachedItems = this.genItems();
                this.oldChunk = this.chunkIndex;
            }
            return this.$createElement('tbody', [
                this.$createElement('tr', { style: this.createStyleHeight(this.offsetTop) }),
                this.cachedItems,
                this.$createElement('tr', { style: this.createStyleHeight(this.offsetBottom) }),
            ]);
        },
        genItems() {
            return this.$scopedSlots.items({ items: this.items.slice(this.startIndex, this.stopIndex) });
        },
        onScroll(e) {
            const target = e.target;
            this.scrollTop = target.scrollTop;
        },
        genTable() {
            return this.$createElement('div', {
                ref: 'table',
                staticClass: 'v-virtual-table__table',
            }, [
                this.$createElement('table', [
                    this.$slots['body.before'],
                    this.genBody(),
                    this.$slots['body.after'],
                ]),
            ]);
        },
        genWrapper() {
            return this.$createElement('div', {
                staticClass: 'v-virtual-table__wrapper',
                style: {
                    height: convertToUnit(this.height),
                },
            }, [
                this.genTable(),
            ]);
        },
    },
    render(h) {
        return h('div', {
            staticClass: 'v-data-table v-virtual-table',
            class: this.classes,
        }, [
            this.$slots.top,
            this.genWrapper(),
            this.$slots.bottom,
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlZpcnR1YWxUYWJsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZEYXRhVGFibGUvVlZpcnR1YWxUYWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLHNCQUFzQixDQUFBO0FBRTdCLGFBQWE7QUFDYixPQUFPLFlBQVksTUFBTSxnQkFBZ0IsQ0FBQTtBQUl6QyxPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQUV0QyxZQUFZO0FBQ1osT0FBTyxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUU1RCxRQUFRO0FBQ1IsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFBO0FBU3ZDLGVBQWUsVUFBVSxDQUFDLE1BQU0sRUFBVyxDQUFDLE1BQU0sQ0FBQztJQUNqRCxJQUFJLEVBQUUsaUJBQWlCO0lBRXZCLEtBQUssRUFBRTtRQUNMLFNBQVMsRUFBRTtZQUNULElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLEVBQUU7U0FDWjtRQUNELFlBQVksRUFBRTtZQUNaLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLEVBQUU7U0FDWjtRQUNELEtBQUssRUFBRTtZQUNMLElBQUksRUFBRSxLQUF3QjtZQUM5QixPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7U0FDcEI7UUFDRCxTQUFTLEVBQUU7WUFDVCxJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxFQUFFO1NBQ1o7S0FDRjtJQUVELElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ1gsU0FBUyxFQUFFLENBQUM7UUFDWixRQUFRLEVBQUUsQ0FBQztRQUNYLGNBQWMsRUFBRSxJQUFXO1FBQzNCLGVBQWUsRUFBRSxLQUFLO0tBQ3ZCLENBQUM7SUFFRixRQUFRLEVBQUU7UUFDUixXQUFXO1lBQ1QsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFD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QUMsTUFBTSxDQUFDO2lCQUNuQzthQUNGLEVBQUU7Z0JBQ0QsSUFBSSxDQUFDLFFBQVEsRUFBRTthQUNoQixDQUFDLENBQUE7UUFDSixDQUFDO0tBQ0Y7SUFFRCxNQUFNLENBQUUsQ0FBQztRQUNQLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRTtZQUNkLFdBQVcsRUFBRSw4QkFBOEI7WUFDM0MsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPO1NBQ3BCLEVBQUU7WUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUc7WUFDZixJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTTtTQUNuQixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuL1ZWaXJ0dWFsVGFibGUuc2FzcydcblxuLy8gQ29tcG9uZW50c1xuaW1wb3J0IFZTaW1wbGVUYWJsZSBmcm9tICcuL1ZTaW1wbGVUYWJsZSdcblxuLy8gVHlwZXNcbmltcG9ydCB7IFZOb2RlLCBWTm9kZUNoaWxkcmVuLCBQcm9wVHlwZSB9IGZyb20gJ3Z1ZSdcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5cbi8vIFV0aWx0aWllc1xuaW1wb3J0IHsgY29udmVydFRvVW5pdCwgZGVib3VuY2UgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5cbi8vIFR5cGVzXG5jb25zdCBiYXNlTWl4aW5zID0gbWl4aW5zKFZTaW1wbGVUYWJsZSlcblxuaW50ZXJmYWNlIG9wdGlvbnMgZXh0ZW5kcyBJbnN0YW5jZVR5cGU8dHlwZW9mIGJhc2VNaXhpbnM+IHtcbiAgJHJlZnM6IHtcbiAgICB0YWJsZTogSFRNTEVsZW1lbnRcbiAgfVxuICBjYWNoZWRJdGVtczogVk5vZGVDaGlsZHJlblxufVxuXG5leHBvcnQgZGVmYXVsdCBiYXNlTWl4aW5zLmV4dGVuZDxvcHRpb25zPigpLmV4dGVuZCh7XG4gIG5hbWU6ICd2LXZpcnR1YWwtdGFibGUnLFxuXG4gIHByb3BzOiB7XG4gICAgY2h1bmtTaXplOiB7XG4gICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICBkZWZhdWx0OiAyNSxcbiAgICB9LFxuICAgIGhlYWRlckhlaWdodDoge1xuICAgICAgdHlwZTogTnVtYmVyLFxuICAgICAgZGVmYXVsdDogNDgsXG4gICAgfSxcbiAgICBpdGVtczoge1xuICAgICAgdHlwZTogQXJyYXkgYXMgUHJvcFR5cGU8YW55W10+LFxuICAgICAgZGVmYXVsdDogKCkgPT4gKFtdKSxcbiAgICB9LFxuICAgIHJvd0hlaWdodDoge1xuICAgICAgdHlwZTogTnVtYmVyLFxuICAgICAgZGVmYXVsdDogNDgsXG4gICAgfSxcbiAgfSxcblxuICBkYXRhOiAoKSA9PiAoe1xuICAgIHNjcm9sbFRvcDogMCxcbiAgICBvbGRDaHVuazogMCxcbiAgICBzY3JvbGxEZWJvdW5jZTogbnVsbCBhcyBhbnksXG4gICAgaW52YWxpZGF0ZUNhY2hlOiBmYWxzZSxcbiAgfSksXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBpdGVtc0xlbmd0aCAoKTogbnVtYmVyIHtcbiAgICAgIHJldHVybiB0aGlzLml0ZW1zLmxlbmd0aFxuICAgIH0sXG4gICAgdG90YWxIZWlnaHQgKCk6IG51bWJlciB7XG4gICAgICByZXR1cm4gKHRoaXMuaXRlbXNMZW5ndGggKiB0aGlzLnJvd0hlaWdodCkgKyB0aGlzLmhlYWRlckhlaWdodFxuICAgIH0sXG4gICAgdG9wSW5kZXggKCk6IG51bWJlciB7XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcih0aGlzLnNjcm9sbFRvcCAvIHRoaXMucm93SGVpZ2h0KVxuICAgIH0sXG4gICAgY2h1bmtJbmRleCAoKTogbnVtYmVyIHtcbiAgICAgIHJldHVybiBNYXRoLmZsb29yKHRoaXMudG9wSW5kZXggLyB0aGlzLmNodW5rU2l6ZSlcbiAgICB9LFxuICAgIHN0YXJ0SW5kZXggKCk6IG51bWJlciB7XG4gICAgICByZXR1cm4gTWF0aC5tYXgoMCwgKHRoaXMuY2h1bmtJbmRleCAqIHRoaXMuY2h1bmtTaXplKSAtIHRoaXMuY2h1bmtTaXplKVxuICAgIH0sXG4gICAgb2Zmc2V0VG9wICgpOiBudW1iZXIge1xuICAgICAgcmV0dXJuIE1hdGgubWF4KDAsIHRoaXMuc3RhcnRJbmRleCAqIHRoaXMucm93SGVpZ2h0KVxuICAgIH0sXG4gICAgc3RvcEluZGV4ICgpOiBudW1iZXIge1xuICAgICAgcmV0dXJuIE1hdGgubWluKHRoaXMuc3RhcnRJbmRleCArICh0aGlzLmNodW5rU2l6ZSAqIDMpLCB0aGlzLml0ZW1zTGVuZ3RoKVxuICAgIH0sXG4gICAgb2Zmc2V0Qm90dG9tICgpOiBudW1iZXIge1xuICAgICAgcmV0dXJuIE1hdGgubWF4KDAsICh0aGlzLml0ZW1zTGVuZ3RoIC0gdGhpcy5zdG9wSW5kZXggLSB0aGlzLnN0YXJ0SW5kZXgpICogdGhpcy5yb3dIZWlnaHQpXG4gICAgfSxcbiAgfSxcblxuICB3YXRjaDoge1xuICAgIGNodW5rSW5kZXggKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuICAgICAgdGhpcy5vbGRDaHVuayA9IG9sZFZhbHVlXG4gICAgfSxcbiAgICBpdGVtcyAoKSB7XG4gICAgICB0aGlzLmNhY2hlZEl0ZW1zID0gbnVsbFxuICAgICAgdGhpcy4kcmVmcy50YWJsZS5zY3JvbGxUb3AgPSAwXG4gICAgfSxcbiAgfSxcblxuICBjcmVhdGVkICgpIHtcbiAgICB0aGlzLmNhY2hlZEl0ZW1zID0gbnVsbFxuICB9LFxuXG4gIG1vdW50ZWQgKCkge1xuICAgIHRoaXMuc2Nyb2xsRGVib3VuY2UgPSBkZWJvdW5jZSh0aGlzLm9uU2Nyb2xsLCA1MClcblxuICAgIHRoaXMuJHJlZnMudGFibGUuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5zY3JvbGxEZWJvdW5jZSwgeyBwYXNzaXZlOiB0cnVlIH0pXG4gIH0sXG5cbiAgYmVmb3JlRGVzdHJveSAoKSB7XG4gICAgdGhpcy4kcmVmcy50YWJsZS5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLnNjcm9sbERlYm91bmNlKVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBjcmVhdGVTdHlsZUhlaWdodCAoaGVpZ2h0OiBudW1iZXIpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGhlaWdodDogYCR7aGVpZ2h0fXB4YCxcbiAgICAgIH1cbiAgICB9LFxuICAgIGdlbkJvZHkgKCkge1xuICAgICAgaWYgKHRoaXMuY2FjaGVkSXRlbXMgPT09IG51bGwgfHwgdGhpcy5jaHVua0luZGV4ICE9PSB0aGlzLm9sZENodW5rKSB7XG4gICAgICAgIHRoaXMuY2FjaGVkSXRlbXMgPSB0aGlzLmdlbkl0ZW1zKClcbiAgICAgICAgdGhpcy5vbGRDaHVuayA9IHRoaXMuY2h1bmtJbmRleFxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgndGJvZHknLCBbXG4gICAgICAgIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ3RyJywgeyBzdHlsZTogdGhpcy5jcmVhdGVTdHlsZUhlaWdodCh0aGlzLm9mZnNldFRvcCkgfSksXG4gICAgICAgIHRoaXMuY2FjaGVkSXRlbXMsXG4gICAgICAgIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ3RyJywgeyBzdHlsZTogdGhpcy5jcmVhdGVTdHlsZUhlaWdodCh0aGlzLm9mZnNldEJvdHRvbSkgfSksXG4gICAgICBdKVxuICAgIH0sXG4gICAgZ2VuSXRlbXMgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuJHNjb3BlZFNsb3RzLml0ZW1zISh7IGl0ZW1zOiB0aGlzLml0ZW1zLnNsaWNlKHRoaXMuc3RhcnRJbmRleCwgdGhpcy5zdG9wSW5kZXgpIH0pXG4gICAgfSxcbiAgICBvblNjcm9sbCAoZTogRXZlbnQpIHtcbiAgICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEVsZW1lbnRcbiAgICAgIHRoaXMuc2Nyb2xsVG9wID0gdGFyZ2V0LnNjcm9sbFRvcFxuICAgIH0sXG4gICAgZ2VuVGFibGUgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgICAgcmVmOiAndGFibGUnLFxuICAgICAgICBzdGF0aWNDbGFzczogJ3YtdmlydHVhbC10YWJsZV9fdGFibGUnLFxuICAgICAgfSwgW1xuICAgICAgICB0aGlzLiRjcmVhdGVFbGVtZW50KCd0YWJsZScsIFtcbiAgICAgICAgICB0aGlzLiRzbG90c1snYm9keS5iZWZvcmUnXSxcbiAgICAgICAgICB0aGlzLmdlbkJvZHkoKSxcbiAgICAgICAgICB0aGlzLiRzbG90c1snYm9keS5hZnRlciddLFxuICAgICAgICBdKSxcbiAgICAgIF0pXG4gICAgfSxcbiAgICBnZW5XcmFwcGVyICgpIHtcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi12aXJ0dWFsLXRhYmxlX193cmFwcGVyJyxcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICBoZWlnaHQ6IGNvbnZlcnRUb1VuaXQodGhpcy5oZWlnaHQpLFxuICAgICAgICB9LFxuICAgICAgfSwgW1xuICAgICAgICB0aGlzLmdlblRhYmxlKCksXG4gICAgICBdKVxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyIChoKTogVk5vZGUge1xuICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICBzdGF0aWNDbGFzczogJ3YtZGF0YS10YWJsZSB2LXZpcnR1YWwtdGFibGUnLFxuICAgICAgY2xhc3M6IHRoaXMuY2xhc3NlcyxcbiAgICB9LCBbXG4gICAgICB0aGlzLiRzbG90cy50b3AsXG4gICAgICB0aGlzLmdlbldyYXBwZXIoKSxcbiAgICAgIHRoaXMuJHNsb3RzLmJvdHRvbSxcbiAgICBdKVxuICB9LFxufSlcbiJdfQ==