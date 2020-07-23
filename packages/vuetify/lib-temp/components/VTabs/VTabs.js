// Styles
import './VTabs.sass';
// Components
import VTabsBar from './VTabsBar';
import VTabsItems from './VTabsItems';
import VTabsSlider from './VTabsSlider';
// Mixins
import Colorable from '../../mixins/colorable';
import Proxyable from '../../mixins/proxyable';
import Themeable from '../../mixins/themeable';
// Directives
import Resize from '../../directives/resize';
// Utilities
import { convertToUnit } from '../../util/helpers';
import mixins from '../../util/mixins';
const baseMixins = mixins(Colorable, Proxyable, Themeable);
export default baseMixins.extend().extend({
    name: 'v-tabs',
    directives: {
        Resize,
    },
    props: {
        activeClass: {
            type: String,
            default: '',
        },
        alignWithTitle: Boolean,
        backgroundColor: String,
        centerActive: Boolean,
        centered: Boolean,
        fixedTabs: Boolean,
        grow: Boolean,
        height: {
            type: [Number, String],
            default: undefined,
        },
        hideSlider: Boolean,
        iconsAndText: Boolean,
        mobileBreakpoint: [String, Number],
        nextIcon: {
            type: String,
            default: '$next',
        },
        optional: Boolean,
        prevIcon: {
            type: String,
            default: '$prev',
        },
        right: Boolean,
        showArrows: [Boolean, String],
        sliderColor: String,
        sliderSize: {
            type: [Number, String],
            default: 2,
        },
        vertical: Boolean,
    },
    data() {
        return {
            resizeTimeout: 0,
            slider: {
                height: null,
                left: null,
                right: null,
                top: null,
                width: null,
            },
            transitionTime: 300,
        };
    },
    computed: {
        classes() {
            return {
                'v-tabs--align-with-title': this.alignWithTitle,
                'v-tabs--centered': this.centered,
                'v-tabs--fixed-tabs': this.fixedTabs,
                'v-tabs--grow': this.grow,
                'v-tabs--icons-and-text': this.iconsAndText,
                'v-tabs--right': this.right,
                'v-tabs--vertical': this.vertical,
                ...this.themeClasses,
            };
        },
        isReversed() {
            return this.$vuetify.rtl && this.vertical;
        },
        sliderStyles() {
            return {
                height: convertToUnit(this.slider.height),
                left: this.isReversed ? undefined : convertToUnit(this.slider.left),
                right: this.isReversed ? convertToUnit(this.slider.right) : undefined,
                top: this.vertical ? convertToUnit(this.slider.top) : undefined,
                transition: this.slider.left != null ? null : 'none',
                width: convertToUnit(this.slider.width),
            };
        },
        computedColor() {
            if (this.color)
                return this.color;
            else if (this.isDark && !this.appIsDark)
                return 'white';
            else
                return 'primary';
        },
    },
    watch: {
        alignWithTitle: 'callSlider',
        centered: 'callSlider',
        centerActive: 'callSlider',
        fixedTabs: 'callSlider',
        grow: 'callSlider',
        right: 'callSlider',
        showArrows: 'callSlider',
        vertical: 'callSlider',
        '$vuetify.application.left': 'onResize',
        '$vuetify.application.right': 'onResize',
        '$vuetify.rtl': 'onResize',
    },
    mounted() {
        this.$nextTick(() => {
            window.setTimeout(this.callSlider, 30);
        });
    },
    methods: {
        callSlider() {
            if (this.hideSlider ||
                !this.$refs.items ||
                !this.$refs.items.selectedItems.length) {
                this.slider.width = 0;
                return false;
            }
            this.$nextTick(() => {
                // Give screen time to paint
                const activeTab = this.$refs.items.selectedItems[0];
                /* istanbul ignore if */
                if (!activeTab || !activeTab.$el) {
                    this.slider.width = 0;
                    this.slider.left = 0;
                    return;
                }
                const el = activeTab.$el;
                this.slider = {
                    height: !this.vertical ? Number(this.sliderSize) : el.scrollHeight,
                    left: this.vertical ? 0 : el.offsetLeft,
                    right: this.vertical ? 0 : el.offsetLeft + el.offsetWidth,
                    top: el.offsetTop,
                    width: this.vertical ? Number(this.sliderSize) : el.scrollWidth,
                };
            });
            return true;
        },
        genBar(items, slider) {
            const data = {
                style: {
                    height: convertToUnit(this.height),
                },
                props: {
                    activeClass: this.activeClass,
                    centerActive: this.centerActive,
                    dark: this.dark,
                    light: this.light,
                    mandatory: !this.optional,
                    mobileBreakpoint: this.mobileBreakpoint,
                    nextIcon: this.nextIcon,
                    prevIcon: this.prevIcon,
                    showArrows: this.showArrows,
                    value: this.internalValue,
                },
                on: {
                    'call:slider': this.callSlider,
                    change: (val) => {
                        this.internalValue = val;
                    },
                },
                ref: 'items',
            };
            this.setTextColor(this.computedColor, data);
            this.setBackgroundColor(this.backgroundColor, data);
            return this.$createElement(VTabsBar, data, [
                this.genSlider(slider),
                items,
            ]);
        },
        genItems(items, item) {
            // If user provides items
            // opt to use theirs
            if (items)
                return items;
            // If no tabs are provided
            // render nothing
            if (!item.length)
                return null;
            return this.$createElement(VTabsItems, {
                props: {
                    value: this.internalValue,
                },
                on: {
                    change: (val) => {
                        this.internalValue = val;
                    },
                },
            }, item);
        },
        genSlider(slider) {
            if (this.hideSlider)
                return null;
            if (!slider) {
                slider = this.$createElement(VTabsSlider, {
                    props: { color: this.sliderColor },
                });
            }
            return this.$createElement('div', {
                staticClass: 'v-tabs-slider-wrapper',
                style: this.sliderStyles,
            }, [slider]);
        },
        onResize() {
            if (this._isDestroyed)
                return;
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = window.setTimeout(this.callSlider, 0);
        },
        parseNodes() {
            let items = null;
            let slider = null;
            const item = [];
            const tab = [];
            const slot = this.$slots.default || [];
            const length = slot.length;
            for (let i = 0; i < length; i++) {
                const vnode = slot[i];
                if (vnode.componentOptions) {
                    switch (vnode.componentOptions.Ctor.options.name) {
                        case 'v-tabs-slider':
                            slider = vnode;
                            break;
                        case 'v-tabs-items':
                            items = vnode;
                            break;
                        case 'v-tab-item':
                            item.push(vnode);
                            break;
                        // case 'v-tab' - intentionally omitted
                        default: tab.push(vnode);
                    }
                }
                else {
                    tab.push(vnode);
                }
            }
            /**
             * tab: array of `v-tab`
             * slider: single `v-tabs-slider`
             * items: single `v-tabs-items`
             * item: array of `v-tab-item`
             */
            return { tab, slider, items, item };
        },
    },
    render(h) {
        const { tab, slider, items, item } = this.parseNodes();
        return h('div', {
            staticClass: 'v-tabs',
            class: this.classes,
            directives: [{
                    name: 'resize',
                    modifiers: { quiet: true },
                    value: this.onResize,
                }],
        }, [
            this.genBar(tab, slider),
            this.genItems(items, item),
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlRhYnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WVGFicy9WVGFicy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxjQUFjLENBQUE7QUFFckIsYUFBYTtBQUNiLE9BQU8sUUFBUSxNQUFNLFlBQVksQ0FBQTtBQUNqQyxPQUFPLFVBQVUsTUFBTSxjQUFjLENBQUE7QUFDckMsT0FBTyxXQUFXLE1BQU0sZUFBZSxDQUFBO0FBRXZDLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUU5QyxhQUFhO0FBQ2IsT0FBTyxNQUFNLE1BQU0seUJBQXlCLENBQUE7QUFFNUMsWUFBWTtBQUNaLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUVsRCxPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQUt0QyxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQ3ZCLFNBQVMsRUFDVCxTQUFTLEVBQ1QsU0FBUyxDQUNWLENBQUE7QUFRRCxlQUFlLFVBQVUsQ0FBQyxNQUFNLEVBQVcsQ0FBQyxNQUFNLENBQUM7SUFDakQsSUFBSSxFQUFFLFFBQVE7SUFFZCxVQUFVLEVBQUU7UUFDVixNQUFNO0tBQ1A7SUFFRCxLQUFLLEVBQUU7UUFDTCxXQUFXLEVBQUU7WUFDWCxJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxFQUFFO1NBQ1o7UUFDRCxjQUFjLEVBQUUsT0FBTztRQUN2QixlQUFlLEVBQUUsTUFBTTtRQUN2QixZQUFZLEVBQUUsT0FBTztRQUNyQixRQUFRLEVBQUUsT0FBTztRQUNqQixTQUFTLEVBQUUsT0FBTztRQUNsQixJQUFJLEVBQUUsT0FBTztRQUNiLE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSxDQUFDLE1BQU0sRUFB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Q0FBQztTQUNILEVBQUU7WUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUM7WUFDeEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDO1NBQzNCLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcbmltcG9ydCAnLi9WVGFicy5zYXNzJ1xuXG4vLyBDb21wb25lbnRzXG5pbXBvcnQgVlRhYnNCYXIgZnJvbSAnLi9WVGFic0JhcidcbmltcG9ydCBWVGFic0l0ZW1zIGZyb20gJy4vVlRhYnNJdGVtcydcbmltcG9ydCBWVGFic1NsaWRlciBmcm9tICcuL1ZUYWJzU2xpZGVyJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBDb2xvcmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2NvbG9yYWJsZSdcbmltcG9ydCBQcm94eWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3Byb3h5YWJsZSdcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcblxuLy8gRGlyZWN0aXZlc1xuaW1wb3J0IFJlc2l6ZSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL3Jlc2l6ZSdcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgeyBjb252ZXJ0VG9Vbml0IH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuaW1wb3J0IHsgRXh0cmFjdFZ1ZSB9IGZyb20gJy4vLi4vLi4vdXRpbC9taXhpbnMnXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgVk5vZGUgfSBmcm9tICd2dWUvdHlwZXMnXG5cbmNvbnN0IGJhc2VNaXhpbnMgPSBtaXhpbnMoXG4gIENvbG9yYWJsZSxcbiAgUHJveHlhYmxlLFxuICBUaGVtZWFibGVcbilcblxuaW50ZXJmYWNlIG9wdGlvbnMgZXh0ZW5kcyBFeHRyYWN0VnVlPHR5cGVvZiBiYXNlTWl4aW5zPiB7XG4gICRyZWZzOiB7XG4gICAgaXRlbXM6IEluc3RhbmNlVHlwZTx0eXBlb2YgVlRhYnNCYXI+XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZU1peGlucy5leHRlbmQ8b3B0aW9ucz4oKS5leHRlbmQoe1xuICBuYW1lOiAndi10YWJzJyxcblxuICBkaXJlY3RpdmVzOiB7XG4gICAgUmVzaXplLFxuICB9LFxuXG4gIHByb3BzOiB7XG4gICAgYWN0aXZlQ2xhc3M6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICcnLFxuICAgIH0sXG4gICAgYWxpZ25XaXRoVGl0bGU6IEJvb2xlYW4sXG4gICAgYmFja2dyb3VuZENvbG9yOiBTdHJpbmcsXG4gICAgY2VudGVyQWN0aXZlOiBCb29sZWFuLFxuICAgIGNlbnRlcmVkOiBCb29sZWFuLFxuICAgIGZpeGVkVGFiczogQm9vbGVhbixcbiAgICBncm93OiBCb29sZWFuLFxuICAgIGhlaWdodDoge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICB9LFxuICAgIGhpZGVTbGlkZXI6IEJvb2xlYW4sXG4gICAgaWNvbnNBbmRUZXh0OiBCb29sZWFuLFxuICAgIG1vYmlsZUJyZWFrcG9pbnQ6IFtTdHJpbmcsIE51bWJlcl0sXG4gICAgbmV4dEljb246IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICckbmV4dCcsXG4gICAgfSxcbiAgICBvcHRpb25hbDogQm9vbGVhbixcbiAgICBwcmV2SWNvbjoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJyRwcmV2JyxcbiAgICB9LFxuICAgIHJpZ2h0OiBCb29sZWFuLFxuICAgIHNob3dBcnJvd3M6IFtCb29sZWFuLCBTdHJpbmddLFxuICAgIHNsaWRlckNvbG9yOiBTdHJpbmcsXG4gICAgc2xpZGVyU2l6ZToge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6IDIsXG4gICAgfSxcbiAgICB2ZXJ0aWNhbDogQm9vbGVhbixcbiAgfSxcblxuICBkYXRhICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzaXplVGltZW91dDogMCxcbiAgICAgIHNsaWRlcjoge1xuICAgICAgICBoZWlnaHQ6IG51bGwgYXMgbnVsbCB8IG51bWJlcixcbiAgICAgICAgbGVmdDogbnVsbCBhcyBudWxsIHwgbnVtYmVyLFxuICAgICAgICByaWdodDogbnVsbCBhcyBudWxsIHwgbnVtYmVyLFxuICAgICAgICB0b3A6IG51bGwgYXMgbnVsbCB8IG51bWJlcixcbiAgICAgICAgd2lkdGg6IG51bGwgYXMgbnVsbCB8IG51bWJlcixcbiAgICAgIH0sXG4gICAgICB0cmFuc2l0aW9uVGltZTogMzAwLFxuICAgIH1cbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAndi10YWJzLS1hbGlnbi13aXRoLXRpdGxlJzogdGhpcy5hbGlnbldpdGhUaXRsZSxcbiAgICAgICAgJ3YtdGFicy0tY2VudGVyZWQnOiB0aGlzLmNlbnRlcmVkLFxuICAgICAgICAndi10YWJzLS1maXhlZC10YWJzJzogdGhpcy5maXhlZFRhYnMsXG4gICAgICAgICd2LXRhYnMtLWdyb3cnOiB0aGlzLmdyb3csXG4gICAgICAgICd2LXRhYnMtLWljb25zLWFuZC10ZXh0JzogdGhpcy5pY29uc0FuZFRleHQsXG4gICAgICAgICd2LXRhYnMtLXJpZ2h0JzogdGhpcy5yaWdodCxcbiAgICAgICAgJ3YtdGFicy0tdmVydGljYWwnOiB0aGlzLnZlcnRpY2FsLFxuICAgICAgICAuLi50aGlzLnRoZW1lQ2xhc3NlcyxcbiAgICAgIH1cbiAgICB9LFxuICAgIGlzUmV2ZXJzZWQgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMuJHZ1ZXRpZnkucnRsICYmIHRoaXMudmVydGljYWxcbiAgICB9LFxuICAgIHNsaWRlclN0eWxlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGhlaWdodDogY29udmVydFRvVW5pdCh0aGlzLnNsaWRlci5oZWlnaHQpLFxuICAgICAgICBsZWZ0OiB0aGlzLmlzUmV2ZXJzZWQgPyB1bmRlZmluZWQgOiBjb252ZXJ0VG9Vbml0KHRoaXMuc2xpZGVyLmxlZnQpLFxuICAgICAgICByaWdodDogdGhpcy5pc1JldmVyc2VkID8gY29udmVydFRvVW5pdCh0aGlzLnNsaWRlci5yaWdodCkgOiB1bmRlZmluZWQsXG4gICAgICAgIHRvcDogdGhpcy52ZXJ0aWNhbCA/IGNvbnZlcnRUb1VuaXQodGhpcy5zbGlkZXIudG9wKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgdHJhbnNpdGlvbjogdGhpcy5zbGlkZXIubGVmdCAhPSBudWxsID8gbnVsbCA6ICdub25lJyxcbiAgICAgICAgd2lkdGg6IGNvbnZlcnRUb1VuaXQodGhpcy5zbGlkZXIud2lkdGgpLFxuICAgICAgfVxuICAgIH0sXG4gICAgY29tcHV0ZWRDb2xvciAoKTogc3RyaW5nIHtcbiAgICAgIGlmICh0aGlzLmNvbG9yKSByZXR1cm4gdGhpcy5jb2xvclxuICAgICAgZWxzZSBpZiAodGhpcy5pc0RhcmsgJiYgIXRoaXMuYXBwSXNEYXJrKSByZXR1cm4gJ3doaXRlJ1xuICAgICAgZWxzZSByZXR1cm4gJ3ByaW1hcnknXG4gICAgfSxcbiAgfSxcblxuICB3YXRjaDoge1xuICAgIGFsaWduV2l0aFRpdGxlOiAnY2FsbFNsaWRlcicsXG4gICAgY2VudGVyZWQ6ICdjYWxsU2xpZGVyJyxcbiAgICBjZW50ZXJBY3RpdmU6ICdjYWxsU2xpZGVyJyxcbiAgICBmaXhlZFRhYnM6ICdjYWxsU2xpZGVyJyxcbiAgICBncm93OiAnY2FsbFNsaWRlcicsXG4gICAgcmlnaHQ6ICdjYWxsU2xpZGVyJyxcbiAgICBzaG93QXJyb3dzOiAnY2FsbFNsaWRlcicsXG4gICAgdmVydGljYWw6ICdjYWxsU2xpZGVyJyxcbiAgICAnJHZ1ZXRpZnkuYXBwbGljYXRpb24ubGVmdCc6ICdvblJlc2l6ZScsXG4gICAgJyR2dWV0aWZ5LmFwcGxpY2F0aW9uLnJpZ2h0JzogJ29uUmVzaXplJyxcbiAgICAnJHZ1ZXRpZnkucnRsJzogJ29uUmVzaXplJyxcbiAgfSxcblxuICBtb3VudGVkICgpIHtcbiAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dCh0aGlzLmNhbGxTbGlkZXIsIDMwKVxuICAgIH0pXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGNhbGxTbGlkZXIgKCkge1xuICAgICAgaWYgKFxuICAgICAgICB0aGlzLmhpZGVTbGlkZXIgfHxcbiAgICAgICAgIXRoaXMuJHJlZnMuaXRlbXMgfHxcbiAgICAgICAgIXRoaXMuJHJlZnMuaXRlbXMuc2VsZWN0ZWRJdGVtcy5sZW5ndGhcbiAgICAgICkge1xuICAgICAgICB0aGlzLnNsaWRlci53aWR0aCA9IDBcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgLy8gR2l2ZSBzY3JlZW4gdGltZSB0byBwYWludFxuICAgICAgICBjb25zdCBhY3RpdmVUYWIgPSB0aGlzLiRyZWZzLml0ZW1zLnNlbGVjdGVkSXRlbXNbMF1cbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgIGlmICghYWN0aXZlVGFiIHx8ICFhY3RpdmVUYWIuJGVsKSB7XG4gICAgICAgICAgdGhpcy5zbGlkZXIud2lkdGggPSAwXG4gICAgICAgICAgdGhpcy5zbGlkZXIubGVmdCA9IDBcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBlbCA9IGFjdGl2ZVRhYi4kZWwgYXMgSFRNTEVsZW1lbnRcblxuICAgICAgICB0aGlzLnNsaWRlciA9IHtcbiAgICAgICAgICBoZWlnaHQ6ICF0aGlzLnZlcnRpY2FsID8gTnVtYmVyKHRoaXMuc2xpZGVyU2l6ZSkgOiBlbC5zY3JvbGxIZWlnaHQsXG4gICAgICAgICAgbGVmdDogdGhpcy52ZXJ0aWNhbCA/IDAgOiBlbC5vZmZzZXRMZWZ0LFxuICAgICAgICAgIHJpZ2h0OiB0aGlzLnZlcnRpY2FsID8gMCA6IGVsLm9mZnNldExlZnQgKyBlbC5vZmZzZXRXaWR0aCxcbiAgICAgICAgICB0b3A6IGVsLm9mZnNldFRvcCxcbiAgICAgICAgICB3aWR0aDogdGhpcy52ZXJ0aWNhbCA/IE51bWJlcih0aGlzLnNsaWRlclNpemUpIDogZWwuc2Nyb2xsV2lkdGgsXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfSxcbiAgICBnZW5CYXIgKGl0ZW1zOiBWTm9kZVtdLCBzbGlkZXI6IFZOb2RlIHwgbnVsbCkge1xuICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICBoZWlnaHQ6IGNvbnZlcnRUb1VuaXQodGhpcy5oZWlnaHQpLFxuICAgICAgICB9LFxuICAgICAgICBwcm9wczoge1xuICAgICAgICAgIGFjdGl2ZUNsYXNzOiB0aGlzLmFjdGl2ZUNsYXNzLFxuICAgICAgICAgIGNlbnRlckFjdGl2ZTogdGhpcy5jZW50ZXJBY3RpdmUsXG4gICAgICAgICAgZGFyazogdGhpcy5kYXJrLFxuICAgICAgICAgIGxpZ2h0OiB0aGlzLmxpZ2h0LFxuICAgICAgICAgIG1hbmRhdG9yeTogIXRoaXMub3B0aW9uYWwsXG4gICAgICAgICAgbW9iaWxlQnJlYWtwb2ludDogdGhpcy5tb2JpbGVCcmVha3BvaW50LFxuICAgICAgICAgIG5leHRJY29uOiB0aGlzLm5leHRJY29uLFxuICAgICAgICAgIHByZXZJY29uOiB0aGlzLnByZXZJY29uLFxuICAgICAgICAgIHNob3dBcnJvd3M6IHRoaXMuc2hvd0Fycm93cyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5pbnRlcm5hbFZhbHVlLFxuICAgICAgICB9LFxuICAgICAgICBvbjoge1xuICAgICAgICAgICdjYWxsOnNsaWRlcic6IHRoaXMuY2FsbFNsaWRlcixcbiAgICAgICAgICBjaGFuZ2U6ICh2YWw6IGFueSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pbnRlcm5hbFZhbHVlID0gdmFsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgcmVmOiAnaXRlbXMnLFxuICAgICAgfVxuXG4gICAgICB0aGlzLnNldFRleHRDb2xvcih0aGlzLmNvbXB1dGVkQ29sb3IsIGRhdGEpXG4gICAgICB0aGlzLnNldEJhY2tncm91bmRDb2xvcih0aGlzLmJhY2tncm91bmRDb2xvciwgZGF0YSlcblxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVlRhYnNCYXIsIGRhdGEsIFtcbiAgICAgICAgdGhpcy5nZW5TbGlkZXIoc2xpZGVyKSxcbiAgICAgICAgaXRlbXMsXG4gICAgICBdKVxuICAgIH0sXG4gICAgZ2VuSXRlbXMgKGl0ZW1zOiBWTm9kZSB8IG51bGwsIGl0ZW06IFZOb2RlW10pIHtcbiAgICAgIC8vIElmIHVzZXIgcHJvdmlkZXMgaXRlbXNcbiAgICAgIC8vIG9wdCB0byB1c2UgdGhlaXJzXG4gICAgICBpZiAoaXRlbXMpIHJldHVybiBpdGVtc1xuXG4gICAgICAvLyBJZiBubyB0YWJzIGFyZSBwcm92aWRlZFxuICAgICAgLy8gcmVuZGVyIG5vdGhpbmdcbiAgICAgIGlmICghaXRlbS5sZW5ndGgpIHJldHVybiBudWxsXG5cbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZUYWJzSXRlbXMsIHtcbiAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICB2YWx1ZTogdGhpcy5pbnRlcm5hbFZhbHVlLFxuICAgICAgICB9LFxuICAgICAgICBvbjoge1xuICAgICAgICAgIGNoYW5nZTogKHZhbDogYW55KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmludGVybmFsVmFsdWUgPSB2YWxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSwgaXRlbSlcbiAgICB9LFxuICAgIGdlblNsaWRlciAoc2xpZGVyOiBWTm9kZSB8IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmhpZGVTbGlkZXIpIHJldHVybiBudWxsXG5cbiAgICAgIGlmICghc2xpZGVyKSB7XG4gICAgICAgIHNsaWRlciA9IHRoaXMuJGNyZWF0ZUVsZW1lbnQoVlRhYnNTbGlkZXIsIHtcbiAgICAgICAgICBwcm9wczogeyBjb2xvcjogdGhpcy5zbGlkZXJDb2xvciB9LFxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3YtdGFicy1zbGlkZXItd3JhcHBlcicsXG4gICAgICAgIHN0eWxlOiB0aGlzLnNsaWRlclN0eWxlcyxcbiAgICAgIH0sIFtzbGlkZXJdKVxuICAgIH0sXG4gICAgb25SZXNpemUgKCkge1xuICAgICAgaWYgKHRoaXMuX2lzRGVzdHJveWVkKSByZXR1cm5cblxuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMucmVzaXplVGltZW91dClcbiAgICAgIHRoaXMucmVzaXplVGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KHRoaXMuY2FsbFNsaWRlciwgMClcbiAgICB9LFxuICAgIHBhcnNlTm9kZXMgKCkge1xuICAgICAgbGV0IGl0ZW1zID0gbnVsbFxuICAgICAgbGV0IHNsaWRlciA9IG51bGxcbiAgICAgIGNvbnN0IGl0ZW0gPSBbXVxuICAgICAgY29uc3QgdGFiID0gW11cbiAgICAgIGNvbnN0IHNsb3QgPSB0aGlzLiRzbG90cy5kZWZhdWx0IHx8IFtdXG4gICAgICBjb25zdCBsZW5ndGggPSBzbG90Lmxlbmd0aFxuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHZub2RlID0gc2xvdFtpXVxuXG4gICAgICAgIGlmICh2bm9kZS5jb21wb25lbnRPcHRpb25zKSB7XG4gICAgICAgICAgc3dpdGNoICh2bm9kZS5jb21wb25lbnRPcHRpb25zLkN0b3Iub3B0aW9ucy5uYW1lKSB7XG4gICAgICAgICAgICBjYXNlICd2LXRhYnMtc2xpZGVyJzogc2xpZGVyID0gdm5vZGVcbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3YtdGFicy1pdGVtcyc6IGl0ZW1zID0gdm5vZGVcbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3YtdGFiLWl0ZW0nOiBpdGVtLnB1c2godm5vZGUpXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAvLyBjYXNlICd2LXRhYicgLSBpbnRlbnRpb25hbGx5IG9taXR0ZWRcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRhYi5wdXNoKHZub2RlKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0YWIucHVzaCh2bm9kZSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIHRhYjogYXJyYXkgb2YgYHYtdGFiYFxuICAgICAgICogc2xpZGVyOiBzaW5nbGUgYHYtdGFicy1zbGlkZXJgXG4gICAgICAgKiBpdGVtczogc2luZ2xlIGB2LXRhYnMtaXRlbXNgXG4gICAgICAgKiBpdGVtOiBhcnJheSBvZiBgdi10YWItaXRlbWBcbiAgICAgICAqL1xuICAgICAgcmV0dXJuIHsgdGFiLCBzbGlkZXIsIGl0ZW1zLCBpdGVtIH1cbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcbiAgICBjb25zdCB7IHRhYiwgc2xpZGVyLCBpdGVtcywgaXRlbSB9ID0gdGhpcy5wYXJzZU5vZGVzKClcblxuICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICBzdGF0aWNDbGFzczogJ3YtdGFicycsXG4gICAgICBjbGFzczogdGhpcy5jbGFzc2VzLFxuICAgICAgZGlyZWN0aXZlczogW3tcbiAgICAgICAgbmFtZTogJ3Jlc2l6ZScsXG4gICAgICAgIG1vZGlmaWVyczogeyBxdWlldDogdHJ1ZSB9LFxuICAgICAgICB2YWx1ZTogdGhpcy5vblJlc2l6ZSxcbiAgICAgIH1dLFxuICAgIH0sIFtcbiAgICAgIHRoaXMuZ2VuQmFyKHRhYiwgc2xpZGVyKSxcbiAgICAgIHRoaXMuZ2VuSXRlbXMoaXRlbXMsIGl0ZW0pLFxuICAgIF0pXG4gIH0sXG59KVxuIl19