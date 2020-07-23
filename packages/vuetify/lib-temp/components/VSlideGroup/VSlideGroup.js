// Styles
import './VSlideGroup.sass';
// Components
import VIcon from '../VIcon';
import { VFadeTransition } from '../transitions';
// Extensions
import { BaseItemGroup } from '../VItemGroup/VItemGroup';
// Mixins
import Mobile from '../../mixins/mobile';
// Directives
import Resize from '../../directives/resize';
import Touch from '../../directives/touch';
// Utilities
import mixins from '../../util/mixins';
export const BaseSlideGroup = mixins(BaseItemGroup, Mobile).extend({
    name: 'base-slide-group',
    directives: {
        Resize,
        Touch,
    },
    props: {
        activeClass: {
            type: String,
            default: 'v-slide-item--active',
        },
        centerActive: Boolean,
        nextIcon: {
            type: String,
            default: '$next',
        },
        prevIcon: {
            type: String,
            default: '$prev',
        },
        showArrows: {
            type: [Boolean, String],
            validator: v => (typeof v === 'boolean' || [
                'always',
                'desktop',
                'mobile',
            ].includes(v)),
        },
    },
    data: () => ({
        internalItemsLength: 0,
        isOverflowing: false,
        resizeTimeout: 0,
        startX: 0,
        scrollOffset: 0,
        widths: {
            content: 0,
            wrapper: 0,
        },
    }),
    computed: {
        __cachedNext() {
            return this.genTransition('next');
        },
        __cachedPrev() {
            return this.genTransition('prev');
        },
        classes() {
            return {
                ...BaseItemGroup.options.computed.classes.call(this),
                'v-slide-group': true,
                'v-slide-group--has-affixes': this.hasAffixes,
                'v-slide-group--is-overflowing': this.isOverflowing,
            };
        },
        hasAffixes() {
            switch (this.showArrows) {
                // Always show arrows on desktop & mobile
                case 'always': return true;
                // Always show arrows on desktop
                case 'desktop': return !this.isMobile;
                // Show arrows on mobile when overflowing.
                // This matches the default 2.2 behavior
                case true: return this.isOverflowing;
                // Always show on mobile
                case 'mobile': return (this.isMobile ||
                    this.isOverflowing);
                // https://material.io/components/tabs#scrollable-tabs
                // Always show arrows when
                // overflowed on desktop
                default: return (!this.isMobile &&
                    this.isOverflowing);
            }
        },
        hasNext() {
            if (!this.hasAffixes)
                return false;
            const { content, wrapper } = this.widths;
            // Check one scroll ahead to know the width of right-most item
            return content > Math.abs(this.scrollOffset) + wrapper;
        },
        hasPrev() {
            return this.hasAffixes && this.scrollOffset !== 0;
        },
    },
    watch: {
        internalValue: 'setWidths',
        // When overflow changes, the arrows alter
        // the widths of the content and wrapper
        // and need to be recalculated
        isOverflowing: 'setWidths',
        scrollOffset(val) {
            this.$refs.content.style.transform = `translateX(${-val}px)`;
        },
    },
    beforeUpdate() {
        this.internalItemsLength = (this.$children || []).length;
    },
    updated() {
        if (this.internalItemsLength === (this.$children || []).length)
            return;
        this.setWidths();
    },
    methods: {
        // Always generate next for scrollable hint
        genNext() {
            const slot = this.$scopedSlots.next
                ? this.$scopedSlots.next({})
                : this.$slots.next || this.__cachedNext;
            return this.$createElement('div', {
                staticClass: 'v-slide-group__next',
                class: {
                    'v-slide-group__next--disabled': !this.hasNext,
                },
                on: {
                    click: () => this.onAffixClick('next'),
                },
                key: 'next',
            }, [slot]);
        },
        genContent() {
            return this.$createElement('div', {
                staticClass: 'v-slide-group__content',
                ref: 'content',
            }, this.$slots.default);
        },
        genData() {
            return {
                class: this.classes,
                directives: [{
                        name: 'resize',
                        value: this.onResize,
                    }],
            };
        },
        genIcon(location) {
            let icon = location;
            if (this.$vuetify.rtl && location === 'prev') {
                icon = 'next';
            }
            else if (this.$vuetify.rtl && location === 'next') {
                icon = 'prev';
            }
            const upperLocation = `${location[0].toUpperCase()}${location.slice(1)}`;
            const hasAffix = this[`has${upperLocation}`];
            if (!this.showArrows &&
                !hasAffix)
                return null;
            return this.$createElement(VIcon, {
                props: {
                    disabled: !hasAffix,
                },
            }, this[`${icon}Icon`]);
        },
        // Always generate prev for scrollable hint
        genPrev() {
            const slot = this.$scopedSlots.prev
                ? this.$scopedSlots.prev({})
                : this.$slots.prev || this.__cachedPrev;
            return this.$createElement('div', {
                staticClass: 'v-slide-group__prev',
                class: {
                    'v-slide-group__prev--disabled': !this.hasPrev,
                },
                on: {
                    click: () => this.onAffixClick('prev'),
                },
                key: 'prev',
            }, [slot]);
        },
        genTransition(location) {
            return this.$createElement(VFadeTransition, [this.genIcon(location)]);
        },
        genWrapper() {
            return this.$createElement('div', {
                staticClass: 'v-slide-group__wrapper',
                directives: [{
                        name: 'touch',
                        value: {
                            start: (e) => this.overflowCheck(e, this.onTouchStart),
                            move: (e) => this.overflowCheck(e, this.onTouchMove),
                            end: (e) => this.overflowCheck(e, this.onTouchEnd),
                        },
                    }],
                ref: 'wrapper',
            }, [this.genContent()]);
        },
        calculateNewOffset(direction, widths, rtl, currentScrollOffset) {
            const sign = rtl ? -1 : 1;
            const newAbosluteOffset = sign * currentScrollOffset +
                (direction === 'prev' ? -1 : 1) * widths.wrapper;
            return sign * Math.max(Math.min(newAbosluteOffset, widths.content - widths.wrapper), 0);
        },
        onAffixClick(location) {
            this.$emit(`click:${location}`);
            this.scrollTo(location);
        },
        onResize() {
            /* istanbul ignore next */
            if (this._isDestroyed)
                return;
            this.setWidths();
        },
        onTouchStart(e) {
            const { content } = this.$refs;
            this.startX = this.scrollOffset + e.touchstartX;
            content.style.setProperty('transition', 'none');
            content.style.setProperty('willChange', 'transform');
        },
        onTouchMove(e) {
            this.scrollOffset = this.startX - e.touchmoveX;
        },
        onTouchEnd() {
            const { content, wrapper } = this.$refs;
            const maxScrollOffset = content.clientWidth - wrapper.clientWidth;
            content.style.setProperty('transition', null);
            content.style.setProperty('willChange', null);
            if (this.$vuetify.rtl) {
                /* istanbul ignore else */
                if (this.scrollOffset > 0 || !this.isOverflowing) {
                    this.scrollOffset = 0;
                }
                else if (this.scrollOffset <= -maxScrollOffset) {
                    this.scrollOffset = -maxScrollOffset;
                }
            }
            else {
                /* istanbul ignore else */
                if (this.scrollOffset < 0 || !this.isOverflowing) {
                    this.scrollOffset = 0;
                }
                else if (this.scrollOffset >= maxScrollOffset) {
                    this.scrollOffset = maxScrollOffset;
                }
            }
        },
        overflowCheck(e, fn) {
            e.stopPropagation();
            this.isOverflowing && fn(e);
        },
        scrollIntoView /* istanbul ignore next */() {
            if (!this.selectedItem) {
                return;
            }
            if (this.selectedIndex === 0 ||
                (!this.centerActive && !this.isOverflowing)) {
                this.scrollOffset = 0;
            }
            else if (this.centerActive) {
                this.scrollOffset = this.calculateCenteredOffset(this.selectedItem.$el, this.widths, this.$vuetify.rtl);
            }
            else if (this.isOverflowing) {
                this.scrollOffset = this.calculateUpdatedOffset(this.selectedItem.$el, this.widths, this.$vuetify.rtl, this.scrollOffset);
            }
        },
        calculateUpdatedOffset(selectedElement, widths, rtl, currentScrollOffset) {
            const clientWidth = selectedElement.clientWidth;
            const offsetLeft = rtl
                ? (widths.content - selectedElement.offsetLeft - clientWidth)
                : selectedElement.offsetLeft;
            if (rtl) {
                currentScrollOffset = -currentScrollOffset;
            }
            const totalWidth = widths.wrapper + currentScrollOffset;
            const itemOffset = clientWidth + offsetLeft;
            const additionalOffset = clientWidth * 0.4;
            if (offsetLeft < currentScrollOffset) {
                currentScrollOffset = Math.max(offsetLeft - additionalOffset, 0);
            }
            else if (totalWidth < itemOffset) {
                currentScrollOffset = Math.min(currentScrollOffset - (totalWidth - itemOffset - additionalOffset), widths.content - widths.wrapper);
            }
            return rtl ? -currentScrollOffset : currentScrollOffset;
        },
        calculateCenteredOffset(selectedElement, widths, rtl) {
            const { offsetLeft, clientWidth } = selectedElement;
            if (rtl) {
                const offsetCentered = widths.content - offsetLeft - clientWidth / 2 - widths.wrapper / 2;
                return -Math.min(widths.content - widths.wrapper, Math.max(0, offsetCentered));
            }
            else {
                const offsetCentered = offsetLeft + clientWidth / 2 - widths.wrapper / 2;
                return Math.min(widths.content - widths.wrapper, Math.max(0, offsetCentered));
            }
        },
        scrollTo /* istanbul ignore next */(location) {
            this.scrollOffset = this.calculateNewOffset(location, {
                // Force reflow
                content: this.$refs.content ? this.$refs.content.clientWidth : 0,
                wrapper: this.$refs.wrapper ? this.$refs.wrapper.clientWidth : 0,
            }, this.$vuetify.rtl, this.scrollOffset);
        },
        setWidths /* istanbul ignore next */() {
            window.requestAnimationFrame(() => {
                const { content, wrapper } = this.$refs;
                this.widths = {
                    content: content ? content.clientWidth : 0,
                    wrapper: wrapper ? wrapper.clientWidth : 0,
                };
                this.isOverflowing = this.widths.wrapper < this.widths.content;
                this.scrollIntoView();
            });
        },
    },
    render(h) {
        return h('div', this.genData(), [
            this.genPrev(),
            this.genWrapper(),
            this.genNext(),
        ]);
    },
});
export default BaseSlideGroup.extend({
    name: 'v-slide-group',
    provide() {
        return {
            slideGroup: this,
        };
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlNsaWRlR3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WU2xpZGVHcm91cC9WU2xpZGVHcm91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxvQkFBb0IsQ0FBQTtBQUUzQixhQUFhO0FBQ2IsT0FBTyxLQUFLLE1BQU0sVUFBVSxDQUFBO0FBQzVCLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQTtBQUVoRCxhQUFhO0FBQ2IsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDBCQUEwQixDQUFBO0FBRXhELFNBQVM7QUFDVCxPQUFPLE1BQU0sTUFBTSxxQkFBcUIsQ0FBQTtBQUV4QyxhQUFhO0FBQ2IsT0FBTyxNQUFNLE1BQU0seUJBQXlCLENBQUE7QUFDNUMsT0FBTyxLQUFLLE1BQU0sd0JBQXdCLENBQUE7QUFFMUMsWUFBWTtBQUNaLE9BQU8sTUFBc0IsTUFBTSxtQkFBbUIsQ0FBQTtBQXVCdEQsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFHLE1BQU0sQ0FRbEMsYUFBYSxFQUNiLE1BQU0sQ0FFUCxDQUFDLE1BQU0sQ0FBQztJQUNQLElBQUksRUFBRSxrQkFBa0I7SUFFeEIsVUFBVSxFQUFFO1FBQ1YsTUFBTTtRQUNOLEtBQUs7S0FDTjtJQUVELEtBQUssRUFBRTtRQUNMLFdBQVcsRUFBRTtZQUNYLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLHNCQUFzQjtTQUNoQztRQUNELFlBQVksRUFBRSxPQUFPO1FBQ3JCLFFBQVEsRUFBRTtZQUNSLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLE9BQU87U0FDakI7UUFDRCxRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxPQUFPO1NBQ2pCO1FBQ0QsVUFBVSxFQUFFO1lBQ1YsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQztZQUN2QixTQUFT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QkFDM0MsQ0FBQTtnQkFFRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFBO2dCQUU5RCxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUE7WUFDdkIsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDO0tBQ0Y7SUFFRCxNQUFNLENBQUUsQ0FBQztRQUNQLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDOUIsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNkLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDakIsSUFBSSxDQUFDLE9BQU8sRUFBRTtTQUNmLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRixDQUFDLENBQUE7QUFFRixlQUFlLGNBQWMsQ0FBQyxNQUFNLENBQUM7SUFDbkMsSUFBSSxFQUFFLGVBQWU7SUFFckIsT0FBTztRQUNMLE9BQU87WUFDTCxVQUFVLEVBQUUsSUFBSTtTQUNqQixDQUFBO0lBQ0gsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xuaW1wb3J0ICcuL1ZTbGlkZUdyb3VwLnNhc3MnXG5cbi8vIENvbXBvbmVudHNcbmltcG9ydCBWSWNvbiBmcm9tICcuLi9WSWNvbidcbmltcG9ydCB7IFZGYWRlVHJhbnNpdGlvbiB9IGZyb20gJy4uL3RyYW5zaXRpb25zJ1xuXG4vLyBFeHRlbnNpb25zXG5pbXBvcnQgeyBCYXNlSXRlbUdyb3VwIH0gZnJvbSAnLi4vVkl0ZW1Hcm91cC9WSXRlbUdyb3VwJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBNb2JpbGUgZnJvbSAnLi4vLi4vbWl4aW5zL21vYmlsZSdcblxuLy8gRGlyZWN0aXZlc1xuaW1wb3J0IFJlc2l6ZSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL3Jlc2l6ZSdcbmltcG9ydCBUb3VjaCBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL3RvdWNoJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCBtaXhpbnMsIHsgRXh0cmFjdFZ1ZSB9IGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IFZ1ZSwgeyBWTm9kZSB9IGZyb20gJ3Z1ZSdcblxuaW50ZXJmYWNlIFRvdWNoRXZlbnQge1xuICB0b3VjaHN0YXJ0WDogbnVtYmVyXG4gIHRvdWNobW92ZVg6IG51bWJlclxuICBzdG9wUHJvcGFnYXRpb246IEZ1bmN0aW9uXG59XG5cbmludGVyZmFjZSBXaWR0aHMge1xuICBjb250ZW50OiBudW1iZXJcbiAgd3JhcHBlcjogbnVtYmVyXG59XG5cbmludGVyZmFjZSBvcHRpb25zIGV4dGVuZHMgVnVlIHtcbiAgJHJlZnM6IHtcbiAgICBjb250ZW50OiBIVE1MRWxlbWVudFxuICAgIHdyYXBwZXI6IEhUTUxFbGVtZW50XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IEJhc2VTbGlkZUdyb3VwID0gbWl4aW5zPG9wdGlvbnMgJlxuLyogZXNsaW50LWRpc2FibGUgaW5kZW50ICovXG4gIEV4dHJhY3RWdWU8W1xuICAgIHR5cGVvZiBCYXNlSXRlbUdyb3VwLFxuICAgIHR5cGVvZiBNb2JpbGUsXG4gIF0+XG4vKiBlc2xpbnQtZW5hYmxlIGluZGVudCAqL1xuPihcbiAgQmFzZUl0ZW1Hcm91cCxcbiAgTW9iaWxlLFxuICAvKiBAdnVlL2NvbXBvbmVudCAqL1xuKS5leHRlbmQoe1xuICBuYW1lOiAnYmFzZS1zbGlkZS1ncm91cCcsXG5cbiAgZGlyZWN0aXZlczoge1xuICAgIFJlc2l6ZSxcbiAgICBUb3VjaCxcbiAgfSxcblxuICBwcm9wczoge1xuICAgIGFjdGl2ZUNsYXNzOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAndi1zbGlkZS1pdGVtLS1hY3RpdmUnLFxuICAgIH0sXG4gICAgY2VudGVyQWN0aXZlOiBCb29sZWFuLFxuICAgIG5leHRJY29uOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnJG5leHQnLFxuICAgIH0sXG4gICAgcHJldkljb246IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICckcHJldicsXG4gICAgfSxcbiAgICBzaG93QXJyb3dzOiB7XG4gICAgICB0eXBlOiBbQm9vbGVhbiwgU3RyaW5nXSxcbiAgICAgIHZhbGlkYXRvcjogdiA9PiAoXG4gICAgICAgIHR5cGVvZiB2ID09PSAnYm9vbGVhbicgfHwgW1xuICAgICAgICAgICdhbHdheXMnLFxuICAgICAgICAgICdkZXNrdG9wJyxcbiAgICAgICAgICAnbW9iaWxlJyxcbiAgICAgICAgXS5pbmNsdWRlcyh2KVxuICAgICAgKSxcbiAgICB9LFxuICB9LFxuXG4gIGRhdGE6ICgpID0+ICh7XG4gICAgaW50ZXJuYWxJdGVtc0xlbmd0aDogMCxcbiAgICBpc092ZXJmbG93aW5nOiBmYWxzZSxcbiAgICByZXNpemVUaW1lb3V0OiAwLFxuICAgIHN0YXJ0WDogMCxcbiAgICBzY3JvbGxPZmZzZXQ6IDAsXG4gICAgd2lkdGhzOiB7XG4gICAgICBjb250ZW50OiAwLFxuICAgICAgd3JhcHBlcjogMCxcbiAgICB9LFxuICB9KSxcblxuICBjb21wdXRlZDoge1xuICAgIF9fY2FjaGVkTmV4dCAoKTogVk5vZGUge1xuICAgICAgcmV0dXJuIHRoaXMuZ2VuVHJhbnNpdGlvbignbmV4dCcpXG4gICAgfSxcbiAgICBfX2NhY2hlZFByZXYgKCk6IFZOb2RlIHtcbiAgICAgIHJldHVybiB0aGlzLmdlblRyYW5zaXRpb24oJ3ByZXYnKVxuICAgIH0sXG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLkJhc2VJdGVtR3JvdXAub3B0aW9ucy5jb21wdXRlZC5jbGFzc2VzLmNhbGwodGhpcyksXG4gICAgICAgICd2LXNsaWRlLWdyb3VwJzogdHJ1ZSxcbiAgICAgICAgJ3Ytc2xpZGUtZ3JvdXAtLWhhcy1hZmZpeGVzJzogdGhpcy5oYXNBZmZpeGVzLFxuICAgICAgICAndi1zbGlkZS1ncm91cC0taXMtb3ZlcmZsb3dpbmcnOiB0aGlzLmlzT3ZlcmZsb3dpbmcsXG4gICAgICB9XG4gICAgfSxcbiAgICBoYXNBZmZpeGVzICgpOiBCb29sZWFuIHtcbiAgICAgIHN3aXRjaCAodGhpcy5zaG93QXJyb3dzKSB7XG4gICAgICAgIC8vIEFsd2F5cyBzaG93IGFycm93cyBvbiBkZXNrdG9wICYgbW9iaWxlXG4gICAgICAgIGNhc2UgJ2Fsd2F5cyc6IHJldHVybiB0cnVlXG5cbiAgICAgICAgLy8gQWx3YXlzIHNob3cgYXJyb3dzIG9uIGRlc2t0b3BcbiAgICAgICAgY2FzZSAnZGVza3RvcCc6IHJldHVybiAhdGhpcy5pc01vYmlsZVxuXG4gICAgICAgIC8vIFNob3cgYXJyb3dzIG9uIG1vYmlsZSB3aGVuIG92ZXJmbG93aW5nLlxuICAgICAgICAvLyBUaGlzIG1hdGNoZXMgdGhlIGRlZmF1bHQgMi4yIGJlaGF2aW9yXG4gICAgICAgIGNhc2UgdHJ1ZTogcmV0dXJuIHRoaXMuaXNPdmVyZmxvd2luZ1xuXG4gICAgICAgIC8vIEFsd2F5cyBzaG93IG9uIG1vYmlsZVxuICAgICAgICBjYXNlICdtb2JpbGUnOiByZXR1cm4gKFxuICAgICAgICAgIHRoaXMuaXNNb2JpbGUgfHxcbiAgICAgICAgICB0aGlzLmlzT3ZlcmZsb3dpbmdcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIGh0dHBzOi8vbWF0ZXJpYWwuaW8vY29tcG9uZW50cy90YWJzI3Njcm9sbGFibGUtdGFic1xuICAgICAgICAvLyBBbHdheXMgc2hvdyBhcnJvd3Mgd2hlblxuICAgICAgICAvLyBvdmVyZmxvd2VkIG9uIGRlc2t0b3BcbiAgICAgICAgZGVmYXVsdDogcmV0dXJuIChcbiAgICAgICAgICAhdGhpcy5pc01vYmlsZSAmJlxuICAgICAgICAgIHRoaXMuaXNPdmVyZmxvd2luZ1xuICAgICAgICApXG4gICAgICB9XG4gICAgfSxcbiAgICBoYXNOZXh0ICgpOiBib29sZWFuIHtcbiAgICAgIGlmICghdGhpcy5oYXNBZmZpeGVzKSByZXR1cm4gZmFsc2VcblxuICAgICAgY29uc3QgeyBjb250ZW50LCB3cmFwcGVyIH0gPSB0aGlzLndpZHRoc1xuXG4gICAgICAvLyBDaGVjayBvbmUgc2Nyb2xsIGFoZWFkIHRvIGtub3cgdGhlIHdpZHRoIG9mIHJpZ2h0LW1vc3QgaXRlbVxuICAgICAgcmV0dXJuIGNvbnRlbnQgPiBNYXRoLmFicyh0aGlzLnNjcm9sbE9mZnNldCkgKyB3cmFwcGVyXG4gICAgfSxcbiAgICBoYXNQcmV2ICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLmhhc0FmZml4ZXMgJiYgdGhpcy5zY3JvbGxPZmZzZXQgIT09IDBcbiAgICB9LFxuICB9LFxuXG4gIHdhdGNoOiB7XG4gICAgaW50ZXJuYWxWYWx1ZTogJ3NldFdpZHRocycsXG4gICAgLy8gV2hlbiBvdmVyZmxvdyBjaGFuZ2VzLCB0aGUgYXJyb3dzIGFsdGVyXG4gICAgLy8gdGhlIHdpZHRocyBvZiB0aGUgY29udGVudCBhbmQgd3JhcHBlclxuICAgIC8vIGFuZCBuZWVkIHRvIGJlIHJlY2FsY3VsYXRlZFxuICAgIGlzT3ZlcmZsb3dpbmc6ICdzZXRXaWR0aHMnLFxuICAgIHNjcm9sbE9mZnNldCAodmFsKSB7XG4gICAgICB0aGlzLiRyZWZzLmNvbnRlbnQuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHstdmFsfXB4KWBcbiAgICB9LFxuICB9LFxuXG4gIGJlZm9yZVVwZGF0ZSAoKSB7XG4gICAgdGhpcy5pbnRlcm5hbEl0ZW1zTGVuZ3RoID0gKHRoaXMuJGNoaWxkcmVuIHx8IFtdKS5sZW5ndGhcbiAgfSxcblxuICB1cGRhdGVkICgpIHtcbiAgICBpZiAodGhpcy5pbnRlcm5hbEl0ZW1zTGVuZ3RoID09PSAodGhpcy4kY2hpbGRyZW4gfHwgW10pLmxlbmd0aCkgcmV0dXJuXG4gICAgdGhpcy5zZXRXaWR0aHMoKVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICAvLyBBbHdheXMgZ2VuZXJhdGUgbmV4dCBmb3Igc2Nyb2xsYWJsZSBoaW50XG4gICAgZ2VuTmV4dCAoKTogVk5vZGUgfCBudWxsIHtcbiAgICAgIGNvbnN0IHNsb3QgPSB0aGlzLiRzY29wZWRTbG90cy5uZXh0XG4gICAgICAgID8gdGhpcy4kc2NvcGVkU2xvdHMubmV4dCh7fSlcbiAgICAgICAgOiB0aGlzLiRzbG90cy5uZXh0IHx8IHRoaXMuX19jYWNoZWROZXh0XG5cbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1zbGlkZS1ncm91cF9fbmV4dCcsXG4gICAgICAgIGNsYXNzOiB7XG4gICAgICAgICAgJ3Ytc2xpZGUtZ3JvdXBfX25leHQtLWRpc2FibGVkJzogIXRoaXMuaGFzTmV4dCxcbiAgICAgICAgfSxcbiAgICAgICAgb246IHtcbiAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5vbkFmZml4Q2xpY2soJ25leHQnKSxcbiAgICAgICAgfSxcbiAgICAgICAga2V5OiAnbmV4dCcsXG4gICAgICB9LCBbc2xvdF0pXG4gICAgfSxcbiAgICBnZW5Db250ZW50ICgpOiBWTm9kZSB7XG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3Ytc2xpZGUtZ3JvdXBfX2NvbnRlbnQnLFxuICAgICAgICByZWY6ICdjb250ZW50JyxcbiAgICAgIH0sIHRoaXMuJHNsb3RzLmRlZmF1bHQpXG4gICAgfSxcbiAgICBnZW5EYXRhICgpOiBvYmplY3Qge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY2xhc3M6IHRoaXMuY2xhc3NlcyxcbiAgICAgICAgZGlyZWN0aXZlczogW3tcbiAgICAgICAgICBuYW1lOiAncmVzaXplJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5vblJlc2l6ZSxcbiAgICAgICAgfV0sXG4gICAgICB9XG4gICAgfSxcbiAgICBnZW5JY29uIChsb2NhdGlvbjogJ3ByZXYnIHwgJ25leHQnKTogVk5vZGUgfCBudWxsIHtcbiAgICAgIGxldCBpY29uID0gbG9jYXRpb25cblxuICAgICAgaWYgKHRoaXMuJHZ1ZXRpZnkucnRsICYmIGxvY2F0aW9uID09PSAncHJldicpIHtcbiAgICAgICAgaWNvbiA9ICduZXh0J1xuICAgICAgfSBlbHNlIGlmICh0aGlzLiR2dWV0aWZ5LnJ0bCAmJiBsb2NhdGlvbiA9PT0gJ25leHQnKSB7XG4gICAgICAgIGljb24gPSAncHJldidcbiAgICAgIH1cblxuICAgICAgY29uc3QgdXBwZXJMb2NhdGlvbiA9IGAke2xvY2F0aW9uWzBdLnRvVXBwZXJDYXNlKCl9JHtsb2NhdGlvbi5zbGljZSgxKX1gXG4gICAgICBjb25zdCBoYXNBZmZpeCA9ICh0aGlzIGFzIGFueSlbYGhhcyR7dXBwZXJMb2NhdGlvbn1gXVxuXG4gICAgICBpZiAoXG4gICAgICAgICF0aGlzLnNob3dBcnJvd3MgJiZcbiAgICAgICAgIWhhc0FmZml4XG4gICAgICApIHJldHVybiBudWxsXG5cbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZJY29uLCB7XG4gICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgZGlzYWJsZWQ6ICFoYXNBZmZpeCxcbiAgICAgICAgfSxcbiAgICAgIH0sICh0aGlzIGFzIGFueSlbYCR7aWNvbn1JY29uYF0pXG4gICAgfSxcbiAgICAvLyBBbHdheXMgZ2VuZXJhdGUgcHJldiBmb3Igc2Nyb2xsYWJsZSBoaW50XG4gICAgZ2VuUHJldiAoKTogVk5vZGUgfCBudWxsIHtcbiAgICAgIGNvbnN0IHNsb3QgPSB0aGlzLiRzY29wZWRTbG90cy5wcmV2XG4gICAgICAgID8gdGhpcy4kc2NvcGVkU2xvdHMucHJldih7fSlcbiAgICAgICAgOiB0aGlzLiRzbG90cy5wcmV2IHx8IHRoaXMuX19jYWNoZWRQcmV2XG5cbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1zbGlkZS1ncm91cF9fcHJldicsXG4gICAgICAgIGNsYXNzOiB7XG4gICAgICAgICAgJ3Ytc2xpZGUtZ3JvdXBfX3ByZXYtLWRpc2FibGVkJzogIXRoaXMuaGFzUHJldixcbiAgICAgICAgfSxcbiAgICAgICAgb246IHtcbiAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5vbkFmZml4Q2xpY2soJ3ByZXYnKSxcbiAgICAgICAgfSxcbiAgICAgICAga2V5OiAncHJldicsXG4gICAgICB9LCBbc2xvdF0pXG4gICAgfSxcbiAgICBnZW5UcmFuc2l0aW9uIChsb2NhdGlvbjogJ3ByZXYnIHwgJ25leHQnKSB7XG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudChWRmFkZVRyYW5zaXRpb24sIFt0aGlzLmdlbkljb24obG9jYXRpb24pXSlcbiAgICB9LFxuICAgIGdlbldyYXBwZXIgKCk6IFZOb2RlIHtcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1zbGlkZS1ncm91cF9fd3JhcHBlcicsXG4gICAgICAgIGRpcmVjdGl2ZXM6IFt7XG4gICAgICAgICAgbmFtZTogJ3RvdWNoJyxcbiAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgc3RhcnQ6IChlOiBUb3VjaEV2ZW50KSA9PiB0aGlzLm92ZXJmbG93Q2hlY2soZSwgdGhpcy5vblRvdWNoU3RhcnQpLFxuICAgICAgICAgICAgbW92ZTogKGU6IFRvdWNoRXZlbnQpID0+IHRoaXMub3ZlcmZsb3dDaGVjayhlLCB0aGlzLm9uVG91Y2hNb3ZlKSxcbiAgICAgICAgICAgIGVuZDogKGU6IFRvdWNoRXZlbnQpID0+IHRoaXMub3ZlcmZsb3dDaGVjayhlLCB0aGlzLm9uVG91Y2hFbmQpLFxuICAgICAgICAgIH0sXG4gICAgICAgIH1dLFxuICAgICAgICByZWY6ICd3cmFwcGVyJyxcbiAgICAgIH0sIFt0aGlzLmdlbkNvbnRlbnQoKV0pXG4gICAgfSxcbiAgICBjYWxjdWxhdGVOZXdPZmZzZXQgKGRpcmVjdGlvbjogJ3ByZXYnIHwgJ25leHQnLCB3aWR0aHM6IFdpZHRocywgcnRsOiBib29sZWFuLCBjdXJyZW50U2Nyb2xsT2Zmc2V0OiBudW1iZXIpIHtcbiAgICAgIGNvbnN0IHNpZ24gPSBydGwgPyAtMSA6IDFcbiAgICAgIGNvbnN0IG5ld0Fib3NsdXRlT2Zmc2V0ID0gc2lnbiAqIGN1cnJlbnRTY3JvbGxPZmZzZXQgK1xuICAgICAgICAoZGlyZWN0aW9uID09PSAncHJldicgPyAtMSA6IDEpICogd2lkdGhzLndyYXBwZXJcblxuICAgICAgcmV0dXJuIHNpZ24gKiBNYXRoLm1heChNYXRoLm1pbihuZXdBYm9zbHV0ZU9mZnNldCwgd2lkdGhzLmNvbnRlbnQgLSB3aWR0aHMud3JhcHBlciksIDApXG4gICAgfSxcbiAgICBvbkFmZml4Q2xpY2sgKGxvY2F0aW9uOiAncHJldicgfCAnbmV4dCcpIHtcbiAgICAgIHRoaXMuJGVtaXQoYGNsaWNrOiR7bG9jYXRpb259YClcbiAgICAgIHRoaXMuc2Nyb2xsVG8obG9jYXRpb24pXG4gICAgfSxcbiAgICBvblJlc2l6ZSAoKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgaWYgKHRoaXMuX2lzRGVzdHJveWVkKSByZXR1cm5cblxuICAgICAgdGhpcy5zZXRXaWR0aHMoKVxuICAgIH0sXG4gICAgb25Ub3VjaFN0YXJ0IChlOiBUb3VjaEV2ZW50KSB7XG4gICAgICBjb25zdCB7IGNvbnRlbnQgfSA9IHRoaXMuJHJlZnNcblxuICAgICAgdGhpcy5zdGFydFggPSB0aGlzLnNjcm9sbE9mZnNldCArIGUudG91Y2hzdGFydFggYXMgbnVtYmVyXG5cbiAgICAgIGNvbnRlbnQuc3R5bGUuc2V0UHJvcGVydHkoJ3RyYW5zaXRpb24nLCAnbm9uZScpXG4gICAgICBjb250ZW50LnN0eWxlLnNldFByb3BlcnR5KCd3aWxsQ2hhbmdlJywgJ3RyYW5zZm9ybScpXG4gICAgfSxcbiAgICBvblRvdWNoTW92ZSAoZTogVG91Y2hFdmVudCkge1xuICAgICAgdGhpcy5zY3JvbGxPZmZzZXQgPSB0aGlzLnN0YXJ0WCAtIGUudG91Y2htb3ZlWFxuICAgIH0sXG4gICAgb25Ub3VjaEVuZCAoKSB7XG4gICAgICBjb25zdCB7IGNvbnRlbnQsIHdyYXBwZXIgfSA9IHRoaXMuJHJlZnNcbiAgICAgIGNvbnN0IG1heFNjcm9sbE9mZnNldCA9IGNvbnRlbnQuY2xpZW50V2lkdGggLSB3cmFwcGVyLmNsaWVudFdpZHRoXG5cbiAgICAgIGNvbnRlbnQuc3R5bGUuc2V0UHJvcGVydHkoJ3RyYW5zaXRpb24nLCBudWxsKVxuICAgICAgY29udGVudC5zdHlsZS5zZXRQcm9wZXJ0eSgnd2lsbENoYW5nZScsIG51bGwpXG5cbiAgICAgIGlmICh0aGlzLiR2dWV0aWZ5LnJ0bCkge1xuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgICBpZiAodGhpcy5zY3JvbGxPZmZzZXQgPiAwIHx8ICF0aGlzLmlzT3ZlcmZsb3dpbmcpIHtcbiAgICAgICAgICB0aGlzLnNjcm9sbE9mZnNldCA9IDBcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnNjcm9sbE9mZnNldCA8PSAtbWF4U2Nyb2xsT2Zmc2V0KSB7XG4gICAgICAgICAgdGhpcy5zY3JvbGxPZmZzZXQgPSAtbWF4U2Nyb2xsT2Zmc2V0XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICAgIGlmICh0aGlzLnNjcm9sbE9mZnNldCA8IDAgfHwgIXRoaXMuaXNPdmVyZmxvd2luZykge1xuICAgICAgICAgIHRoaXMuc2Nyb2xsT2Zmc2V0ID0gMFxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc2Nyb2xsT2Zmc2V0ID49IG1heFNjcm9sbE9mZnNldCkge1xuICAgICAgICAgIHRoaXMuc2Nyb2xsT2Zmc2V0ID0gbWF4U2Nyb2xsT2Zmc2V0XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIG92ZXJmbG93Q2hlY2sgKGU6IFRvdWNoRXZlbnQsIGZuOiAoZTogVG91Y2hFdmVudCkgPT4gdm9pZCkge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgdGhpcy5pc092ZXJmbG93aW5nICYmIGZuKGUpXG4gICAgfSxcbiAgICBzY3JvbGxJbnRvVmlldyAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyAoKSB7XG4gICAgICBpZiAoIXRoaXMuc2VsZWN0ZWRJdGVtKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAoXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9PT0gMCB8fFxuICAgICAgICAoIXRoaXMuY2VudGVyQWN0aXZlICYmICF0aGlzLmlzT3ZlcmZsb3dpbmcpXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5zY3JvbGxPZmZzZXQgPSAwXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2VudGVyQWN0aXZlKSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsT2Zmc2V0ID0gdGhpcy5jYWxjdWxhdGVDZW50ZXJlZE9mZnNldChcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbS4kZWwgYXMgSFRNTEVsZW1lbnQsXG4gICAgICAgICAgdGhpcy53aWR0aHMsXG4gICAgICAgICAgdGhpcy4kdnVldGlmeS5ydGxcbiAgICAgICAgKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmlzT3ZlcmZsb3dpbmcpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxPZmZzZXQgPSB0aGlzLmNhbGN1bGF0ZVVwZGF0ZWRPZmZzZXQoXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW0uJGVsIGFzIEhUTUxFbGVtZW50LFxuICAgICAgICAgIHRoaXMud2lkdGhzLFxuICAgICAgICAgIHRoaXMuJHZ1ZXRpZnkucnRsLFxuICAgICAgICAgIHRoaXMuc2Nyb2xsT2Zmc2V0XG4gICAgICAgIClcbiAgICAgIH1cbiAgICB9LFxuICAgIGNhbGN1bGF0ZVVwZGF0ZWRPZmZzZXQgKHNlbGVjdGVkRWxlbWVudDogSFRNTEVsZW1lbnQsIHdpZHRoczogV2lkdGhzLCBydGw6IGJvb2xlYW4sIGN1cnJlbnRTY3JvbGxPZmZzZXQ6IG51bWJlcik6IG51bWJlciB7XG4gICAgICBjb25zdCBjbGllbnRXaWR0aCA9IHNlbGVjdGVkRWxlbWVudC5jbGllbnRXaWR0aFxuICAgICAgY29uc3Qgb2Zmc2V0TGVmdCA9IHJ0bFxuICAgICAgICA/ICh3aWR0aHMuY29udGVudCAtIHNlbGVjdGVkRWxlbWVudC5vZmZzZXRMZWZ0IC0gY2xpZW50V2lkdGgpXG4gICAgICAgIDogc2VsZWN0ZWRFbGVtZW50Lm9mZnNldExlZnRcblxuICAgICAgaWYgKHJ0bCkge1xuICAgICAgICBjdXJyZW50U2Nyb2xsT2Zmc2V0ID0gLWN1cnJlbnRTY3JvbGxPZmZzZXRcbiAgICAgIH1cblxuICAgICAgY29uc3QgdG90YWxXaWR0aCA9IHdpZHRocy53cmFwcGVyICsgY3VycmVudFNjcm9sbE9mZnNldFxuICAgICAgY29uc3QgaXRlbU9mZnNldCA9IGNsaWVudFdpZHRoICsgb2Zmc2V0TGVmdFxuICAgICAgY29uc3QgYWRkaXRpb25hbE9mZnNldCA9IGNsaWVudFdpZHRoICogMC40XG5cbiAgICAgIGlmIChvZmZzZXRMZWZ0IDwgY3VycmVudFNjcm9sbE9mZnNldCkge1xuICAgICAgICBjdXJyZW50U2Nyb2xsT2Zmc2V0ID0gTWF0aC5tYXgob2Zmc2V0TGVmdCAtIGFkZGl0aW9uYWxPZmZzZXQsIDApXG4gICAgICB9IGVsc2UgaWYgKHRvdGFsV2lkdGggPCBpdGVtT2Zmc2V0KSB7XG4gICAgICAgIGN1cnJlbnRTY3JvbGxPZmZzZXQgPSBNYXRoLm1pbihjdXJyZW50U2Nyb2xsT2Zmc2V0IC0gKHRvdGFsV2lkdGggLSBpdGVtT2Zmc2V0IC0gYWRkaXRpb25hbE9mZnNldCksIHdpZHRocy5jb250ZW50IC0gd2lkdGhzLndyYXBwZXIpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBydGwgPyAtY3VycmVudFNjcm9sbE9mZnNldCA6IGN1cnJlbnRTY3JvbGxPZmZzZXRcbiAgICB9LFxuICAgIGNhbGN1bGF0ZUNlbnRlcmVkT2Zmc2V0IChzZWxlY3RlZEVsZW1lbnQ6IEhUTUxFbGVtZW50LCB3aWR0aHM6IFdpZHRocywgcnRsOiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgIGNvbnN0IHsgb2Zmc2V0TGVmdCwgY2xpZW50V2lkdGggfSA9IHNlbGVjdGVkRWxlbWVudFxuXG4gICAgICBpZiAocnRsKSB7XG4gICAgICAgIGNvbnN0IG9mZnNldENlbnRlcmVkID0gd2lkdGhzLmNvbnRlbnQgLSBvZmZzZXRMZWZ0IC0gY2xpZW50V2lkdGggLyAyIC0gd2lkdGhzLndyYXBwZXIgLyAyXG4gICAgICAgIHJldHVybiAtTWF0aC5taW4od2lkdGhzLmNvbnRlbnQgLSB3aWR0aHMud3JhcHBlciwgTWF0aC5tYXgoMCwgb2Zmc2V0Q2VudGVyZWQpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qgb2Zmc2V0Q2VudGVyZWQgPSBvZmZzZXRMZWZ0ICsgY2xpZW50V2lkdGggLyAyIC0gd2lkdGhzLndyYXBwZXIgLyAyXG4gICAgICAgIHJldHVybiBNYXRoLm1pbih3aWR0aHMuY29udGVudCAtIHdpZHRocy53cmFwcGVyLCBNYXRoLm1heCgwLCBvZmZzZXRDZW50ZXJlZCkpXG4gICAgICB9XG4gICAgfSxcbiAgICBzY3JvbGxUbyAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyAobG9jYXRpb246ICdwcmV2JyB8ICduZXh0Jykge1xuICAgICAgdGhpcy5zY3JvbGxPZmZzZXQgPSB0aGlzLmNhbGN1bGF0ZU5ld09mZnNldChsb2NhdGlvbiwge1xuICAgICAgICAvLyBGb3JjZSByZWZsb3dcbiAgICAgICAgY29udGVudDogdGhpcy4kcmVmcy5jb250ZW50ID8gdGhpcy4kcmVmcy5jb250ZW50LmNsaWVudFdpZHRoIDogMCxcbiAgICAgICAgd3JhcHBlcjogdGhpcy4kcmVmcy53cmFwcGVyID8gdGhpcy4kcmVmcy53cmFwcGVyLmNsaWVudFdpZHRoIDogMCxcbiAgICAgIH0sIHRoaXMuJHZ1ZXRpZnkucnRsLCB0aGlzLnNjcm9sbE9mZnNldClcbiAgICB9LFxuICAgIHNldFdpZHRocyAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyAgKCkge1xuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIGNvbnN0IHsgY29udGVudCwgd3JhcHBlciB9ID0gdGhpcy4kcmVmc1xuXG4gICAgICAgIHRoaXMud2lkdGhzID0ge1xuICAgICAgICAgIGNvbnRlbnQ6IGNvbnRlbnQgPyBjb250ZW50LmNsaWVudFdpZHRoIDogMCxcbiAgICAgICAgICB3cmFwcGVyOiB3cmFwcGVyID8gd3JhcHBlci5jbGllbnRXaWR0aCA6IDAsXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmlzT3ZlcmZsb3dpbmcgPSB0aGlzLndpZHRocy53cmFwcGVyIDwgdGhpcy53aWR0aHMuY29udGVudFxuXG4gICAgICAgIHRoaXMuc2Nyb2xsSW50b1ZpZXcoKVxuICAgICAgfSlcbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcbiAgICByZXR1cm4gaCgnZGl2JywgdGhpcy5nZW5EYXRhKCksIFtcbiAgICAgIHRoaXMuZ2VuUHJldigpLFxuICAgICAgdGhpcy5nZW5XcmFwcGVyKCksXG4gICAgICB0aGlzLmdlbk5leHQoKSxcbiAgICBdKVxuICB9LFxufSlcblxuZXhwb3J0IGRlZmF1bHQgQmFzZVNsaWRlR3JvdXAuZXh0ZW5kKHtcbiAgbmFtZTogJ3Ytc2xpZGUtZ3JvdXAnLFxuXG4gIHByb3ZpZGUgKCk6IG9iamVjdCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNsaWRlR3JvdXA6IHRoaXMsXG4gICAgfVxuICB9LFxufSlcbiJdfQ==