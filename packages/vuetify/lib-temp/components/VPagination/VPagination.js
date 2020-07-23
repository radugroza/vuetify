import './VPagination.sass';
import VIcon from '../VIcon';
// Directives
import Resize from '../../directives/resize';
// Mixins
import Colorable from '../../mixins/colorable';
import Intersectable from '../../mixins/intersectable';
import Themeable from '../../mixins/themeable';
// Utilities
import mixins from '../../util/mixins';
/* @vue/component */
export default mixins(Colorable, Intersectable({ onVisible: ['init'] }), Themeable).extend({
    name: 'v-pagination',
    directives: { Resize },
    props: {
        circle: Boolean,
        disabled: Boolean,
        length: {
            type: Number,
            default: 0,
            validator: (val) => val % 1 === 0,
        },
        nextIcon: {
            type: String,
            default: '$next',
        },
        prevIcon: {
            type: String,
            default: '$prev',
        },
        totalVisible: [Number, String],
        value: {
            type: Number,
            default: 0,
        },
        pageAriaLabel: {
            type: String,
            default: '$vuetify.pagination.ariaLabel.page',
        },
        currentPageAriaLabel: {
            type: String,
            default: '$vuetify.pagination.ariaLabel.currentPage',
        },
        previousAriaLabel: {
            type: String,
            default: '$vuetify.pagination.ariaLabel.previous',
        },
        nextAriaLabel: {
            type: String,
            default: '$vuetify.pagination.ariaLabel.next',
        },
        wrapperAriaLabel: {
            type: String,
            default: '$vuetify.pagination.ariaLabel.wrapper',
        },
    },
    data() {
        return {
            maxButtons: 0,
            selected: null,
        };
    },
    computed: {
        classes() {
            return {
                'v-pagination': true,
                'v-pagination--circle': this.circle,
                'v-pagination--disabled': this.disabled,
                ...this.themeClasses,
            };
        },
        items() {
            const totalVisible = parseInt(this.totalVisible, 10);
            const maxLength = Math.min(Math.max(0, totalVisible) || this.length, Math.max(0, this.maxButtons) || this.length, this.length);
            if (this.length <= maxLength) {
                return this.range(1, this.length);
            }
            const even = maxLength % 2 === 0 ? 1 : 0;
            const left = Math.floor(maxLength / 2);
            const right = this.length - left + 1 + even;
            if (this.value > left && this.value < right) {
                const start = this.value - left + 2;
                const end = this.value + left - 2 - even;
                return [1, '...', ...this.range(start, end), '...', this.length];
            }
            else if (this.value === left) {
                const end = this.value + left - 1 - even;
                return [...this.range(1, end), '...', this.length];
            }
            else if (this.value === right) {
                const start = this.value - left + 1;
                return [1, '...', ...this.range(start, this.length)];
            }
            else {
                return [
                    ...this.range(1, left),
                    '...',
                    ...this.range(right, this.length),
                ];
            }
        },
    },
    watch: {
        value() {
            this.init();
        },
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.selected = null;
            this.$nextTick(this.onResize);
            // TODO: Change this (f75dee3a, cbdf7caa)
            setTimeout(() => (this.selected = this.value), 100);
        },
        onResize() {
            const width = this.$el && this.$el.parentElement
                ? this.$el.parentElement.clientWidth
                : window.innerWidth;
            this.maxButtons = Math.floor((width - 96) / 42);
        },
        next(e) {
            e.preventDefault();
            this.$emit('input', this.value + 1);
            this.$emit('next');
        },
        previous(e) {
            e.preventDefault();
            this.$emit('input', this.value - 1);
            this.$emit('previous');
        },
        range(from, to) {
            const range = [];
            from = from > 0 ? from : 1;
            for (let i = from; i <= to; i++) {
                range.push(i);
            }
            return range;
        },
        genIcon(h, icon, disabled, fn, label) {
            return h('li', [
                h('button', {
                    staticClass: 'v-pagination__navigation',
                    class: {
                        'v-pagination__navigation--disabled': disabled,
                    },
                    attrs: {
                        type: 'button',
                        'aria-label': label,
                    },
                    on: disabled ? {} : { click: fn },
                }, [h(VIcon, [icon])]),
            ]);
        },
        genItem(h, i) {
            const color = (i === this.value) && (this.color || 'primary');
            const isCurrentPage = i === this.value;
            const ariaLabel = isCurrentPage ? this.currentPageAriaLabel : this.pageAriaLabel;
            return h('button', this.setBackgroundColor(color, {
                staticClass: 'v-pagination__item',
                class: {
                    'v-pagination__item--active': i === this.value,
                },
                attrs: {
                    type: 'button',
                    'aria-current': isCurrentPage,
                    'aria-label': this.$vuetify.lang.t(ariaLabel, i),
                },
                on: {
                    click: () => this.$emit('input', i),
                },
            }), [i.toString()]);
        },
        genItems(h) {
            return this.items.map((i, index) => {
                return h('li', { key: index }, [
                    isNaN(Number(i)) ? h('span', { class: 'v-pagination__more' }, [i.toString()]) : this.genItem(h, i),
                ]);
            });
        },
        genList(h, children) {
            return h('ul', {
                directives: [{
                        modifiers: { quiet: true },
                        name: 'resize',
                        value: this.onResize,
                    }],
                class: this.classes,
            }, children);
        },
    },
    render(h) {
        const children = [
            this.genIcon(h, this.$vuetify.rtl ? this.nextIcon : this.prevIcon, this.value <= 1, this.previous, this.$vuetify.lang.t(this.previousAriaLabel)),
            this.genItems(h),
            this.genIcon(h, this.$vuetify.rtl ? this.prevIcon : this.nextIcon, this.value >= this.length, this.next, this.$vuetify.lang.t(this.nextAriaLabel)),
        ];
        return h('nav', {
            attrs: {
                role: 'navigation',
                'aria-label': this.$vuetify.lang.t(this.wrapperAriaLabel),
            },
        }, [this.genList(h, children)]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlBhZ2luYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WUGFnaW5hdGlvbi9WUGFnaW5hdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLG9CQUFvQixDQUFBO0FBRTNCLE9BQU8sS0FBSyxNQUFNLFVBQVUsQ0FBQTtBQUU1QixhQUFhO0FBQ2IsT0FBTyxNQUFNLE1BQU0seUJBQXlCLENBQUE7QUFFNUMsU0FBUztBQUNULE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBQzlDLE9BQU8sYUFBYSxNQUFNLDRCQUE0QixDQUFBO0FBQ3RELE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBRTlDLFlBQVk7QUFDWixPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQUt0QyxvQkFBb0I7QUFDcEIsZUFBZSxNQUFNLENBQ25CLFNBQVMsRUFDVCxhQUFhLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQ3RDLFNBQVMsQ0FDVixDQUFDLE1BQU0sQ0FBQztJQUNQLElBQUksRUFBRSxjQUFjO0lBRXBCLFVBQVUsRUFBRSxFQUFFLE1BQU0sRUFBRTtJQUV0QixLQUFLLEVBQUU7UUFDTCxNQUFNLEVBQUUsT0FBTztRQUNmLFFBQVEsRUFBRSxPQUFPO1FBQ2pCLE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLENBQUM7WUFDVixTQUFTLEVBQUUsQ0FBQyxHQUFXLEVBQUUsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztTQUMxQztRQUNELFFBQVEsRUFBRTtZQUNSLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLE9BQU87U0FDakI7UUFDRCxRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxPQUFPO1NBQ2pCO1FBQ0QsWUFBWSxFQUFFLENBQUMsTUFBTSxFQUFF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LENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFDakQsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLEVBQ2YsSUFBSSxDQUFDLFFBQVEsRUFDYixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDL0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDaEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQ1osSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQ2pELElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLE1BQU0sRUFDekIsSUFBSSxDQUFDLElBQUksRUFDVCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQzVDLENBQUE7UUFFRCxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUU7WUFDZCxLQUFLLEVBQUU7Z0JBQ0wsSUFBSSxFQUFFLFlBQVk7Z0JBQ2xCLFlBQVksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDO2FBQzFEO1NBQ0YsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNqQyxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuL1ZQYWdpbmF0aW9uLnNhc3MnXG5cbmltcG9ydCBWSWNvbiBmcm9tICcuLi9WSWNvbidcblxuLy8gRGlyZWN0aXZlc1xuaW1wb3J0IFJlc2l6ZSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL3Jlc2l6ZSdcblxuLy8gTWl4aW5zXG5pbXBvcnQgQ29sb3JhYmxlIGZyb20gJy4uLy4uL21peGlucy9jb2xvcmFibGUnXG5pbXBvcnQgSW50ZXJzZWN0YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvaW50ZXJzZWN0YWJsZSdcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgVk5vZGUsIENyZWF0ZUVsZW1lbnQsIFZOb2RlQ2hpbGRyZW5BcnJheUNvbnRlbnRzIH0gZnJvbSAndnVlJ1xuXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFxuICBDb2xvcmFibGUsXG4gIEludGVyc2VjdGFibGUoeyBvblZpc2libGU6IFsnaW5pdCddIH0pLFxuICBUaGVtZWFibGVcbikuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtcGFnaW5hdGlvbicsXG5cbiAgZGlyZWN0aXZlczogeyBSZXNpemUgfSxcblxuICBwcm9wczoge1xuICAgIGNpcmNsZTogQm9vbGVhbixcbiAgICBkaXNhYmxlZDogQm9vbGVhbixcbiAgICBsZW5ndGg6IHtcbiAgICAgIHR5cGU6IE51bWJlcixcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgICB2YWxpZGF0b3I6ICh2YWw6IG51bWJlcikgPT4gdmFsICUgMSA9PT0gMCxcbiAgICB9LFxuICAgIG5leHRJY29uOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnJG5leHQnLFxuICAgIH0sXG4gICAgcHJldkljb246IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICckcHJldicsXG4gICAgfSxcbiAgICB0b3RhbFZpc2libGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgdmFsdWU6IHtcbiAgICAgIHR5cGU6IE51bWJlcixcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgICBwYWdlQXJpYUxhYmVsOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnJHZ1ZXRpZnkucGFnaW5hdGlvbi5hcmlhTGFiZWwucGFnZScsXG4gICAgfSxcbiAgICBjdXJyZW50UGFnZUFyaWFMYWJlbDoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJyR2dWV0aWZ5LnBhZ2luYXRpb24uYXJpYUxhYmVsLmN1cnJlbnRQYWdlJyxcbiAgICB9LFxuICAgIHByZXZpb3VzQXJpYUxhYmVsOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnJHZ1ZXRpZnkucGFnaW5hdGlvbi5hcmlhTGFiZWwucHJldmlvdXMnLFxuICAgIH0sXG4gICAgbmV4dEFyaWFMYWJlbDoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJyR2dWV0aWZ5LnBhZ2luYXRpb24uYXJpYUxhYmVsLm5leHQnLFxuICAgIH0sXG4gICAgd3JhcHBlckFyaWFMYWJlbDoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJyR2dWV0aWZ5LnBhZ2luYXRpb24uYXJpYUxhYmVsLndyYXBwZXInLFxuICAgIH0sXG4gIH0sXG5cbiAgZGF0YSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1heEJ1dHRvbnM6IDAsXG4gICAgICBzZWxlY3RlZDogbnVsbCBhcyBudW1iZXIgfCBudWxsLFxuICAgIH1cbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAndi1wYWdpbmF0aW9uJzogdHJ1ZSxcbiAgICAgICAgJ3YtcGFnaW5hdGlvbi0tY2lyY2xlJzogdGhpcy5jaXJjbGUsXG4gICAgICAgICd2LXBhZ2luYXRpb24tLWRpc2FibGVkJzogdGhpcy5kaXNhYmxlZCxcbiAgICAgICAgLi4udGhpcy50aGVtZUNsYXNzZXMsXG4gICAgICB9XG4gICAgfSxcblxuICAgIGl0ZW1zICgpOiAoc3RyaW5nIHwgbnVtYmVyKVtdIHtcbiAgICAgIGNvbnN0IHRvdGFsVmlzaWJsZSA9IHBhcnNlSW50KHRoaXMudG90YWxWaXNpYmxlLCAxMClcblxuICAgICAgY29uc3QgbWF4TGVuZ3RoID0gTWF0aC5taW4oXG4gICAgICAgIE1hdGgubWF4KDAsIHRvdGFsVmlzaWJsZSkgfHwgdGhpcy5sZW5ndGgsXG4gICAgICAgIE1hdGgubWF4KDAsIHRoaXMubWF4QnV0dG9ucykgfHwgdGhpcy5sZW5ndGgsXG4gICAgICAgIHRoaXMubGVuZ3RoXG4gICAgICApXG5cbiAgICAgIGlmICh0aGlzLmxlbmd0aCA8PSBtYXhMZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmFuZ2UoMSwgdGhpcy5sZW5ndGgpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGV2ZW4gPSBtYXhMZW5ndGggJSAyID09PSAwID8gMSA6IDBcbiAgICAgIGNvbnN0IGxlZnQgPSBNYXRoLmZsb29yKG1heExlbmd0aCAvIDIpXG4gICAgICBjb25zdCByaWdodCA9IHRoaXMubGVuZ3RoIC0gbGVmdCArIDEgKyBldmVuXG5cbiAgICAgIGlmICh0aGlzLnZhbHVlID4gbGVmdCAmJiB0aGlzLnZhbHVlIDwgcmlnaHQpIHtcbiAgICAgICAgY29uc3Qgc3RhcnQgPSB0aGlzLnZhbHVlIC0gbGVmdCArIDJcbiAgICAgICAgY29uc3QgZW5kID0gdGhpcy52YWx1ZSArIGxlZnQgLSAyIC0gZXZlblxuXG4gICAgICAgIHJldHVybiBbMSwgJy4uLicsIC4uLnRoaXMucmFuZ2Uoc3RhcnQsIGVuZCksICcuLi4nLCB0aGlzLmxlbmd0aF1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy52YWx1ZSA9PT0gbGVmdCkge1xuICAgICAgICBjb25zdCBlbmQgPSB0aGlzLnZhbHVlICsgbGVmdCAtIDEgLSBldmVuXG4gICAgICAgIHJldHVybiBbLi4udGhpcy5yYW5nZSgxLCBlbmQpLCAnLi4uJywgdGhpcy5sZW5ndGhdXG4gICAgICB9IGVsc2UgaWYgKHRoaXMudmFsdWUgPT09IHJpZ2h0KSB7XG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy52YWx1ZSAtIGxlZnQgKyAxXG4gICAgICAgIHJldHVybiBbMSwgJy4uLicsIC4uLnRoaXMucmFuZ2Uoc3RhcnQsIHRoaXMubGVuZ3RoKV1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgLi4udGhpcy5yYW5nZSgxLCBsZWZ0KSxcbiAgICAgICAgICAnLi4uJyxcbiAgICAgICAgICAuLi50aGlzLnJhbmdlKHJpZ2h0LCB0aGlzLmxlbmd0aCksXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9LFxuICB9LFxuXG4gIHdhdGNoOiB7XG4gICAgdmFsdWUgKCkge1xuICAgICAgdGhpcy5pbml0KClcbiAgICB9LFxuICB9LFxuXG4gIG1vdW50ZWQgKCkge1xuICAgIHRoaXMuaW5pdCgpXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGluaXQgKCkge1xuICAgICAgdGhpcy5zZWxlY3RlZCA9IG51bGxcblxuICAgICAgdGhpcy4kbmV4dFRpY2sodGhpcy5vblJlc2l6ZSlcbiAgICAgIC8vIFRPRE86IENoYW5nZSB0aGlzIChmNzVkZWUzYSwgY2JkZjdjYWEpXG4gICAgICBzZXRUaW1lb3V0KCgpID0+ICh0aGlzLnNlbGVjdGVkID0gdGhpcy52YWx1ZSksIDEwMClcbiAgICB9LFxuICAgIG9uUmVzaXplICgpIHtcbiAgICAgIGNvbnN0IHdpZHRoID0gdGhpcy4kZWwgJiYgdGhpcy4kZWwucGFyZW50RWxlbWVudFxuICAgICAgICA/IHRoaXMuJGVsLnBhcmVudEVsZW1lbnQuY2xpZW50V2lkdGhcbiAgICAgICAgOiB3aW5kb3cuaW5uZXJXaWR0aFxuXG4gICAgICB0aGlzLm1heEJ1dHRvbnMgPSBNYXRoLmZsb29yKCh3aWR0aCAtIDk2KSAvIDQyKVxuICAgIH0sXG4gICAgbmV4dCAoZTogRXZlbnQpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCB0aGlzLnZhbHVlICsgMSlcbiAgICAgIHRoaXMuJGVtaXQoJ25leHQnKVxuICAgIH0sXG4gICAgcHJldmlvdXMgKGU6IEV2ZW50KSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgdGhpcy52YWx1ZSAtIDEpXG4gICAgICB0aGlzLiRlbWl0KCdwcmV2aW91cycpXG4gICAgfSxcbiAgICByYW5nZSAoZnJvbTogbnVtYmVyLCB0bzogbnVtYmVyKSB7XG4gICAgICBjb25zdCByYW5nZSA9IFtdXG5cbiAgICAgIGZyb20gPSBmcm9tID4gMCA/IGZyb20gOiAxXG5cbiAgICAgIGZvciAobGV0IGkgPSBmcm9tOyBpIDw9IHRvOyBpKyspIHtcbiAgICAgICAgcmFuZ2UucHVzaChpKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmFuZ2VcbiAgICB9LFxuICAgIGdlbkljb24gKGg6IENyZWF0ZUVsZW1lbnQsIGljb246IHN0cmluZywgZGlzYWJsZWQ6IGJvb2xlYW4sIGZuOiBFdmVudExpc3RlbmVyLCBsYWJlbDogU3RyaW5nKTogVk5vZGUge1xuICAgICAgcmV0dXJuIGgoJ2xpJywgW1xuICAgICAgICBoKCdidXR0b24nLCB7XG4gICAgICAgICAgc3RhdGljQ2xhc3M6ICd2LXBhZ2luYXRpb25fX25hdmlnYXRpb24nLFxuICAgICAgICAgIGNsYXNzOiB7XG4gICAgICAgICAgICAndi1wYWdpbmF0aW9uX19uYXZpZ2F0aW9uLS1kaXNhYmxlZCc6IGRpc2FibGVkLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdidXR0b24nLFxuICAgICAgICAgICAgJ2FyaWEtbGFiZWwnOiBsYWJlbCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIG9uOiBkaXNhYmxlZCA/IHt9IDogeyBjbGljazogZm4gfSxcbiAgICAgICAgfSwgW2goVkljb24sIFtpY29uXSldKSxcbiAgICAgIF0pXG4gICAgfSxcbiAgICBnZW5JdGVtIChoOiBDcmVhdGVFbGVtZW50LCBpOiBzdHJpbmcgfCBudW1iZXIpOiBWTm9kZSB7XG4gICAgICBjb25zdCBjb2xvcjogc3RyaW5nIHwgZmFsc2UgPSAoaSA9PT0gdGhpcy52YWx1ZSkgJiYgKHRoaXMuY29sb3IgfHwgJ3ByaW1hcnknKVxuICAgICAgY29uc3QgaXNDdXJyZW50UGFnZSA9IGkgPT09IHRoaXMudmFsdWVcbiAgICAgIGNvbnN0IGFyaWFMYWJlbCA9IGlzQ3VycmVudFBhZ2UgPyB0aGlzLmN1cnJlbnRQYWdlQXJpYUxhYmVsIDogdGhpcy5wYWdlQXJpYUxhYmVsXG5cbiAgICAgIHJldHVybiBoKCdidXR0b24nLCB0aGlzLnNldEJhY2tncm91bmRDb2xvcihjb2xvciwge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3YtcGFnaW5hdGlvbl9faXRlbScsXG4gICAgICAgIGNsYXNzOiB7XG4gICAgICAgICAgJ3YtcGFnaW5hdGlvbl9faXRlbS0tYWN0aXZlJzogaSA9PT0gdGhpcy52YWx1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICB0eXBlOiAnYnV0dG9uJyxcbiAgICAgICAgICAnYXJpYS1jdXJyZW50JzogaXNDdXJyZW50UGFnZSxcbiAgICAgICAgICAnYXJpYS1sYWJlbCc6IHRoaXMuJHZ1ZXRpZnkubGFuZy50KGFyaWFMYWJlbCwgaSksXG4gICAgICAgIH0sXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuJGVtaXQoJ2lucHV0JywgaSksXG4gICAgICAgIH0sXG4gICAgICB9KSwgW2kudG9TdHJpbmcoKV0pXG4gICAgfSxcbiAgICBnZW5JdGVtcyAoaDogQ3JlYXRlRWxlbWVudCk6IFZOb2RlW10ge1xuICAgICAgcmV0dXJuIHRoaXMuaXRlbXMubWFwKChpLCBpbmRleCkgPT4ge1xuICAgICAgICByZXR1cm4gaCgnbGknLCB7IGtleTogaW5kZXggfSwgW1xuICAgICAgICAgIGlzTmFOKE51bWJlcihpKSkgPyBoKCdzcGFuJywgeyBjbGFzczogJ3YtcGFnaW5hdGlvbl9fbW9yZScgfSwgW2kudG9TdHJpbmcoKV0pIDogdGhpcy5nZW5JdGVtKGgsIGkpLFxuICAgICAgICBdKVxuICAgICAgfSlcbiAgICB9LFxuICAgIGdlbkxpc3QgKGg6IENyZWF0ZUVsZW1lbnQsIGNoaWxkcmVuOiBWTm9kZUNoaWxkcmVuQXJyYXlDb250ZW50cyk6IFZOb2RlIHtcbiAgICAgIHJldHVybiBoKCd1bCcsIHtcbiAgICAgICAgZGlyZWN0aXZlczogW3tcbiAgICAgICAgICBtb2RpZmllcnM6IHsgcXVpZXQ6IHRydWUgfSxcbiAgICAgICAgICBuYW1lOiAncmVzaXplJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5vblJlc2l6ZSxcbiAgICAgICAgfV0sXG4gICAgICAgIGNsYXNzOiB0aGlzLmNsYXNzZXMsXG4gICAgICB9LCBjaGlsZHJlbilcbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcbiAgICBjb25zdCBjaGlsZHJlbiA9IFtcbiAgICAgIHRoaXMuZ2VuSWNvbihoLFxuICAgICAgICB0aGlzLiR2dWV0aWZ5LnJ0bCA/IHRoaXMubmV4dEljb24gOiB0aGlzLnByZXZJY29uLFxuICAgICAgICB0aGlzLnZhbHVlIDw9IDEsXG4gICAgICAgIHRoaXMucHJldmlvdXMsXG4gICAgICAgIHRoaXMuJHZ1ZXRpZnkubGFuZy50KHRoaXMucHJldmlvdXNBcmlhTGFiZWwpKSxcbiAgICAgIHRoaXMuZ2VuSXRlbXMoaCksXG4gICAgICB0aGlzLmdlbkljb24oaCxcbiAgICAgICAgdGhpcy4kdnVldGlmeS5ydGwgPyB0aGlzLnByZXZJY29uIDogdGhpcy5uZXh0SWNvbixcbiAgICAgICAgdGhpcy52YWx1ZSA+PSB0aGlzLmxlbmd0aCxcbiAgICAgICAgdGhpcy5uZXh0LFxuICAgICAgICB0aGlzLiR2dWV0aWZ5LmxhbmcudCh0aGlzLm5leHRBcmlhTGFiZWwpKSxcbiAgICBdXG5cbiAgICByZXR1cm4gaCgnbmF2Jywge1xuICAgICAgYXR0cnM6IHtcbiAgICAgICAgcm9sZTogJ25hdmlnYXRpb24nLFxuICAgICAgICAnYXJpYS1sYWJlbCc6IHRoaXMuJHZ1ZXRpZnkubGFuZy50KHRoaXMud3JhcHBlckFyaWFMYWJlbCksXG4gICAgICB9LFxuICAgIH0sIFt0aGlzLmdlbkxpc3QoaCwgY2hpbGRyZW4pXSlcbiAgfSxcbn0pXG4iXX0=