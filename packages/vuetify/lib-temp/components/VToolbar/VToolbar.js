// Styles
import './VToolbar.sass';
// Extensions
import VSheet from '../VSheet/VSheet';
// Components
import VImg from '../VImg/VImg';
// Utilities
import { convertToUnit, getSlot } from '../../util/helpers';
import { breaking } from '../../util/console';
/* @vue/component */
export default VSheet.extend({
    name: 'v-toolbar',
    props: {
        absolute: Boolean,
        bottom: Boolean,
        collapse: Boolean,
        dense: Boolean,
        extended: Boolean,
        extensionHeight: {
            default: 48,
            type: [Number, String],
        },
        flat: Boolean,
        floating: Boolean,
        prominent: Boolean,
        short: Boolean,
        src: {
            type: [String, Object],
            default: '',
        },
        tag: {
            type: String,
            default: 'header',
        },
    },
    data: () => ({
        isExtended: false,
    }),
    computed: {
        computedHeight() {
            const height = this.computedContentHeight;
            if (!this.isExtended)
                return height;
            const extensionHeight = parseInt(this.extensionHeight);
            return this.isCollapsed
                ? height
                : height + (!isNaN(extensionHeight) ? extensionHeight : 0);
        },
        computedContentHeight() {
            if (this.height)
                return parseInt(this.height);
            if (this.isProminent && this.dense)
                return 96;
            if (this.isProminent && this.short)
                return 112;
            if (this.isProminent)
                return 128;
            if (this.dense)
                return 48;
            if (this.short || this.$vuetify.breakpoint.smAndDown)
                return 56;
            return 64;
        },
        classes() {
            return {
                ...VSheet.options.computed.classes.call(this),
                'v-toolbar': true,
                'v-toolbar--absolute': this.absolute,
                'v-toolbar--bottom': this.bottom,
                'v-toolbar--collapse': this.collapse,
                'v-toolbar--collapsed': this.isCollapsed,
                'v-toolbar--dense': this.dense,
                'v-toolbar--extended': this.isExtended,
                'v-toolbar--flat': this.flat,
                'v-toolbar--floating': this.floating,
                'v-toolbar--prominent': this.isProminent,
            };
        },
        isCollapsed() {
            return this.collapse;
        },
        isProminent() {
            return this.prominent;
        },
        styles() {
            return {
                ...this.measurableStyles,
                height: convertToUnit(this.computedHeight),
            };
        },
    },
    created() {
        const breakingProps = [
            ['app', '<v-app-bar app>'],
            ['manual-scroll', '<v-app-bar :value="false">'],
            ['clipped-left', '<v-app-bar clipped-left>'],
            ['clipped-right', '<v-app-bar clipped-right>'],
            ['inverted-scroll', '<v-app-bar inverted-scroll>'],
            ['scroll-off-screen', '<v-app-bar scroll-off-screen>'],
            ['scroll-target', '<v-app-bar scroll-target>'],
            ['scroll-threshold', '<v-app-bar scroll-threshold>'],
            ['card', '<v-app-bar flat>'],
        ];
        /* istanbul ignore next */
        breakingProps.forEach(([original, replacement]) => {
            if (this.$attrs.hasOwnProperty(original))
                breaking(original, replacement, this);
        });
    },
    methods: {
        genBackground() {
            const props = {
                height: convertToUnit(this.computedHeight),
                src: this.src,
            };
            const image = this.$scopedSlots.img
                ? this.$scopedSlots.img({ props })
                : this.$createElement(VImg, { props });
            return this.$createElement('div', {
                staticClass: 'v-toolbar__image',
            }, [image]);
        },
        genContent() {
            return this.$createElement('div', {
                staticClass: 'v-toolbar__content',
                style: {
                    height: convertToUnit(this.computedContentHeight),
                },
            }, getSlot(this));
        },
        genExtension() {
            return this.$createElement('div', {
                staticClass: 'v-toolbar__extension',
                style: {
                    height: convertToUnit(this.extensionHeight),
                },
            }, getSlot(this, 'extension'));
        },
    },
    render(h) {
        this.isExtended = this.extended || !!this.$scopedSlots.extension;
        const children = [this.genContent()];
        const data = this.setBackgroundColor(this.color, {
            class: this.classes,
            style: this.styles,
            on: this.$listeners,
        });
        if (this.isExtended)
            children.push(this.genExtension());
        if (this.src || this.$scopedSlots.img)
            children.unshift(this.genBackground());
        return h(this.tag, data, children);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlRvb2xiYXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WVG9vbGJhci9WVG9vbGJhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxpQkFBaUIsQ0FBQTtBQUV4QixhQUFhO0FBQ2IsT0FBTyxNQUFNLE1BQU0sa0JBQWtCLENBQUE7QUFFckMsYUFBYTtBQUNiLE9BQU8sSUFBbUIsTUFBTSxjQUFjLENBQUE7QUFFOUMsWUFBWTtBQUNaLE9BQU8sRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFDM0QsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBSzdDLG9CQUFvQjtBQUNwQixlQUFlLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDM0IsSUFBSSxFQUFFLFdBQVc7SUFFakIsS0FBSyxFQUFFO1FBQ0wsUUFBUSxFQUFFLE9BQU87UUFDakIsTUFBTSxFQUFFLE9BQU87UUFDZixRQUFRLEVBQUUsT0FBTztRQUNqQixLQUFLLEVBQUUsT0FBTztRQUNkLFFBQVEsRUFBRSxPQUFPO1FBQ2pCLGVBQWUsRUFBRTtZQUNmLE9BQU8sRUFBRSxFQUFFO1lBQ1gsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztTQUN2QjtRQUNELElBQUksRUFBRSxPQUFPO1FBQ2IsUUFBUSxFQUFFLE9BQU87UUFDakIsU0FBUyxFQUFFLE9BQU87UUFDbEIsS0FBSyxFQUFFLE9BQU87UUFDZCxHQUFHLEVBQUU7WUFDSCxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFpQztZQUN0RCxPQUFPLEVBQUUsRUFBRTtTQUNaO1FBQ0QsR0FBRyxFQUFFO1lBQ0gsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsUUFBUTtTQUNsQjtLQUNGO0lBRUQsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDWCxVQUFVLEVBQUUs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c0I7Z0JBQ25DLEtBQUssRUFBRTtvQkFDTCxNQUFNLEVBQUUsYUFBYSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUM7aUJBQzVDO2FBQ0YsRUFBRSxPQUFPLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUE7UUFDaEMsQ0FBQztLQUNGO0lBRUQsTUFBTSxDQUFFLENBQUM7UUFDUCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFBO1FBRWhFLE1BQU0sUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUE7UUFDcEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDL0MsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ25CLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTTtZQUNsQixFQUFFLEVBQUUsSUFBSSxDQUFDLFVBQVU7U0FDcEIsQ0FBQyxDQUFBO1FBRUYsSUFBSSxJQUFJLENBQUMsVUFBVTtZQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUE7UUFDdkQsSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRztZQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUE7UUFFN0UsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUE7SUFDcEMsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xuaW1wb3J0ICcuL1ZUb29sYmFyLnNhc3MnXG5cbi8vIEV4dGVuc2lvbnNcbmltcG9ydCBWU2hlZXQgZnJvbSAnLi4vVlNoZWV0L1ZTaGVldCdcblxuLy8gQ29tcG9uZW50c1xuaW1wb3J0IFZJbWcsIHsgc3JjT2JqZWN0IH0gZnJvbSAnLi4vVkltZy9WSW1nJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCB7IGNvbnZlcnRUb1VuaXQsIGdldFNsb3QgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5pbXBvcnQgeyBicmVha2luZyB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcblxuLy8gVHlwZXNcbmltcG9ydCB7IFZOb2RlLCBQcm9wVHlwZSB9IGZyb20gJ3Z1ZSdcblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IFZTaGVldC5leHRlbmQoe1xuICBuYW1lOiAndi10b29sYmFyJyxcblxuICBwcm9wczoge1xuICAgIGFic29sdXRlOiBCb29sZWFuLFxuICAgIGJvdHRvbTogQm9vbGVhbixcbiAgICBjb2xsYXBzZTogQm9vbGVhbixcbiAgICBkZW5zZTogQm9vbGVhbixcbiAgICBleHRlbmRlZDogQm9vbGVhbixcbiAgICBleHRlbnNpb25IZWlnaHQ6IHtcbiAgICAgIGRlZmF1bHQ6IDQ4LFxuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICB9LFxuICAgIGZsYXQ6IEJvb2xlYW4sXG4gICAgZmxvYXRpbmc6IEJvb2xlYW4sXG4gICAgcHJvbWluZW50OiBCb29sZWFuLFxuICAgIHNob3J0OiBCb29sZWFuLFxuICAgIHNyYzoge1xuICAgICAgdHlwZTogW1N0cmluZywgT2JqZWN0XSBhcyBQcm9wVHlwZTxzdHJpbmcgfCBzcmNPYmplY3Q+LFxuICAgICAgZGVmYXVsdDogJycsXG4gICAgfSxcbiAgICB0YWc6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICdoZWFkZXInLFxuICAgIH0sXG4gIH0sXG5cbiAgZGF0YTogKCkgPT4gKHtcbiAgICBpc0V4dGVuZGVkOiBmYWxzZSxcbiAgfSksXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBjb21wdXRlZEhlaWdodCAoKTogbnVtYmVyIHtcbiAgICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuY29tcHV0ZWRDb250ZW50SGVpZ2h0XG5cbiAgICAgIGlmICghdGhpcy5pc0V4dGVuZGVkKSByZXR1cm4gaGVpZ2h0XG5cbiAgICAgIGNvbnN0IGV4dGVuc2lvbkhlaWdodCA9IHBhcnNlSW50KHRoaXMuZXh0ZW5zaW9uSGVpZ2h0KVxuXG4gICAgICByZXR1cm4gdGhpcy5pc0NvbGxhcHNlZFxuICAgICAgICA/IGhlaWdodFxuICAgICAgICA6IGhlaWdodCArICghaXNOYU4oZXh0ZW5zaW9uSGVpZ2h0KSA/IGV4dGVuc2lvbkhlaWdodCA6IDApXG4gICAgfSxcbiAgICBjb21wdXRlZENvbnRlbnRIZWlnaHQgKCk6IG51bWJlciB7XG4gICAgICBpZiAodGhpcy5oZWlnaHQpIHJldHVybiBwYXJzZUludCh0aGlzLmhlaWdodClcbiAgICAgIGlmICh0aGlzLmlzUHJvbWluZW50ICYmIHRoaXMuZGVuc2UpIHJldHVybiA5NlxuICAgICAgaWYgKHRoaXMuaXNQcm9taW5lbnQgJiYgdGhpcy5zaG9ydCkgcmV0dXJuIDExMlxuICAgICAgaWYgKHRoaXMuaXNQcm9taW5lbnQpIHJldHVybiAxMjhcbiAgICAgIGlmICh0aGlzLmRlbnNlKSByZXR1cm4gNDhcbiAgICAgIGlmICh0aGlzLnNob3J0IHx8IHRoaXMuJHZ1ZXRpZnkuYnJlYWtwb2ludC5zbUFuZERvd24pIHJldHVybiA1NlxuICAgICAgcmV0dXJuIDY0XG4gICAgfSxcbiAgICBjbGFzc2VzICgpOiBvYmplY3Qge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uVlNoZWV0Lm9wdGlvbnMuY29tcHV0ZWQuY2xhc3Nlcy5jYWxsKHRoaXMpLFxuICAgICAgICAndi10b29sYmFyJzogdHJ1ZSxcbiAgICAgICAgJ3YtdG9vbGJhci0tYWJzb2x1dGUnOiB0aGlzLmFic29sdXRlLFxuICAgICAgICAndi10b29sYmFyLS1ib3R0b20nOiB0aGlzLmJvdHRvbSxcbiAgICAgICAgJ3YtdG9vbGJhci0tY29sbGFwc2UnOiB0aGlzLmNvbGxhcHNlLFxuICAgICAgICAndi10b29sYmFyLS1jb2xsYXBzZWQnOiB0aGlzLmlzQ29sbGFwc2VkLFxuICAgICAgICAndi10b29sYmFyLS1kZW5zZSc6IHRoaXMuZGVuc2UsXG4gICAgICAgICd2LXRvb2xiYXItLWV4dGVuZGVkJzogdGhpcy5pc0V4dGVuZGVkLFxuICAgICAgICAndi10b29sYmFyLS1mbGF0JzogdGhpcy5mbGF0LFxuICAgICAgICAndi10b29sYmFyLS1mbG9hdGluZyc6IHRoaXMuZmxvYXRpbmcsXG4gICAgICAgICd2LXRvb2xiYXItLXByb21pbmVudCc6IHRoaXMuaXNQcm9taW5lbnQsXG4gICAgICB9XG4gICAgfSxcbiAgICBpc0NvbGxhcHNlZCAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5jb2xsYXBzZVxuICAgIH0sXG4gICAgaXNQcm9taW5lbnQgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMucHJvbWluZW50XG4gICAgfSxcbiAgICBzdHlsZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi50aGlzLm1lYXN1cmFibGVTdHlsZXMsXG4gICAgICAgIGhlaWdodDogY29udmVydFRvVW5pdCh0aGlzLmNvbXB1dGVkSGVpZ2h0KSxcbiAgICAgIH1cbiAgICB9LFxuICB9LFxuXG4gIGNyZWF0ZWQgKCkge1xuICAgIGNvbnN0IGJyZWFraW5nUHJvcHMgPSBbXG4gICAgICBbJ2FwcCcsICc8di1hcHAtYmFyIGFwcD4nXSxcbiAgICAgIFsnbWFudWFsLXNjcm9sbCcsICc8di1hcHAtYmFyIDp2YWx1ZT1cImZhbHNlXCI+J10sXG4gICAgICBbJ2NsaXBwZWQtbGVmdCcsICc8di1hcHAtYmFyIGNsaXBwZWQtbGVmdD4nXSxcbiAgICAgIFsnY2xpcHBlZC1yaWdodCcsICc8di1hcHAtYmFyIGNsaXBwZWQtcmlnaHQ+J10sXG4gICAgICBbJ2ludmVydGVkLXNjcm9sbCcsICc8di1hcHAtYmFyIGludmVydGVkLXNjcm9sbD4nXSxcbiAgICAgIFsnc2Nyb2xsLW9mZi1zY3JlZW4nLCAnPHYtYXBwLWJhciBzY3JvbGwtb2ZmLXNjcmVlbj4nXSxcbiAgICAgIFsnc2Nyb2xsLXRhcmdldCcsICc8di1hcHAtYmFyIHNjcm9sbC10YXJnZXQ+J10sXG4gICAgICBbJ3Njcm9sbC10aHJlc2hvbGQnLCAnPHYtYXBwLWJhciBzY3JvbGwtdGhyZXNob2xkPiddLFxuICAgICAgWydjYXJkJywgJzx2LWFwcC1iYXIgZmxhdD4nXSxcbiAgICBdXG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGJyZWFraW5nUHJvcHMuZm9yRWFjaCgoW29yaWdpbmFsLCByZXBsYWNlbWVudF0pID0+IHtcbiAgICAgIGlmICh0aGlzLiRhdHRycy5oYXNPd25Qcm9wZXJ0eShvcmlnaW5hbCkpIGJyZWFraW5nKG9yaWdpbmFsLCByZXBsYWNlbWVudCwgdGhpcylcbiAgICB9KVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBnZW5CYWNrZ3JvdW5kICgpIHtcbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICBoZWlnaHQ6IGNvbnZlcnRUb1VuaXQodGhpcy5jb21wdXRlZEhlaWdodCksXG4gICAgICAgIHNyYzogdGhpcy5zcmMsXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGltYWdlID0gdGhpcy4kc2NvcGVkU2xvdHMuaW1nXG4gICAgICAgID8gdGhpcy4kc2NvcGVkU2xvdHMuaW1nKHsgcHJvcHMgfSlcbiAgICAgICAgOiB0aGlzLiRjcmVhdGVFbGVtZW50KFZJbWcsIHsgcHJvcHMgfSlcblxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LXRvb2xiYXJfX2ltYWdlJyxcbiAgICAgIH0sIFtpbWFnZV0pXG4gICAgfSxcbiAgICBnZW5Db250ZW50ICgpIHtcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi10b29sYmFyX19jb250ZW50JyxcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICBoZWlnaHQ6IGNvbnZlcnRUb1VuaXQodGhpcy5jb21wdXRlZENvbnRlbnRIZWlnaHQpLFxuICAgICAgICB9LFxuICAgICAgfSwgZ2V0U2xvdCh0aGlzKSlcbiAgICB9LFxuICAgIGdlbkV4dGVuc2lvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3YtdG9vbGJhcl9fZXh0ZW5zaW9uJyxcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICBoZWlnaHQ6IGNvbnZlcnRUb1VuaXQodGhpcy5leHRlbnNpb25IZWlnaHQpLFxuICAgICAgICB9LFxuICAgICAgfSwgZ2V0U2xvdCh0aGlzLCAnZXh0ZW5zaW9uJykpXG4gICAgfSxcbiAgfSxcblxuICByZW5kZXIgKGgpOiBWTm9kZSB7XG4gICAgdGhpcy5pc0V4dGVuZGVkID0gdGhpcy5leHRlbmRlZCB8fCAhIXRoaXMuJHNjb3BlZFNsb3RzLmV4dGVuc2lvblxuXG4gICAgY29uc3QgY2hpbGRyZW4gPSBbdGhpcy5nZW5Db250ZW50KCldXG4gICAgY29uc3QgZGF0YSA9IHRoaXMuc2V0QmFja2dyb3VuZENvbG9yKHRoaXMuY29sb3IsIHtcbiAgICAgIGNsYXNzOiB0aGlzLmNsYXNzZXMsXG4gICAgICBzdHlsZTogdGhpcy5zdHlsZXMsXG4gICAgICBvbjogdGhpcy4kbGlzdGVuZXJzLFxuICAgIH0pXG5cbiAgICBpZiAodGhpcy5pc0V4dGVuZGVkKSBjaGlsZHJlbi5wdXNoKHRoaXMuZ2VuRXh0ZW5zaW9uKCkpXG4gICAgaWYgKHRoaXMuc3JjIHx8IHRoaXMuJHNjb3BlZFNsb3RzLmltZykgY2hpbGRyZW4udW5zaGlmdCh0aGlzLmdlbkJhY2tncm91bmQoKSlcblxuICAgIHJldHVybiBoKHRoaXMudGFnLCBkYXRhLCBjaGlsZHJlbilcbiAgfSxcbn0pXG4iXX0=