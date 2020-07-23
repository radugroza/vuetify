// Types
import mixins from '../../util/mixins';
import VIcon from '../VIcon';
// Mixins
import Themeable from '../../mixins/themeable';
import Colorable from '../../mixins/colorable';
const baseMixins = mixins(Colorable, Themeable
/* @vue/component */
);
export default baseMixins.extend().extend({
    name: 'v-timeline-item',
    inject: ['timeline'],
    props: {
        color: {
            type: String,
            default: 'primary',
        },
        fillDot: Boolean,
        hideDot: Boolean,
        icon: String,
        iconColor: String,
        large: Boolean,
        left: Boolean,
        right: Boolean,
        small: Boolean,
    },
    computed: {
        hasIcon() {
            return !!this.icon || !!this.$slots.icon;
        },
    },
    methods: {
        genBody() {
            return this.$createElement('div', {
                staticClass: 'v-timeline-item__body',
            }, this.$slots.default);
        },
        genIcon() {
            if (this.$slots.icon) {
                return this.$slots.icon;
            }
            return this.$createElement(VIcon, {
                props: {
                    color: this.iconColor,
                    dark: !this.theme.isDark,
                    small: this.small,
                },
            }, this.icon);
        },
        genInnerDot() {
            const data = this.setBackgroundColor(this.color);
            return this.$createElement('div', {
                staticClass: 'v-timeline-item__inner-dot',
                ...data,
            }, [this.hasIcon && this.genIcon()]);
        },
        genDot() {
            return this.$createElement('div', {
                staticClass: 'v-timeline-item__dot',
                class: {
                    'v-timeline-item__dot--small': this.small,
                    'v-timeline-item__dot--large': this.large,
                },
            }, [this.genInnerDot()]);
        },
        genDivider() {
            const children = [];
            if (!this.hideDot)
                children.push(this.genDot());
            return this.$createElement('div', {
                staticClass: 'v-timeline-item__divider',
            }, children);
        },
        genOpposite() {
            return this.$createElement('div', {
                staticClass: 'v-timeline-item__opposite',
            }, this.$slots.opposite);
        },
    },
    render(h) {
        const children = [
            this.genBody(),
            this.genDivider(),
        ];
        if (this.$slots.opposite)
            children.push(this.genOpposite());
        return h('div', {
            staticClass: 'v-timeline-item',
            class: {
                'v-timeline-item--fill-dot': this.fillDot,
                'v-timeline-item--before': this.timeline.reverse ? this.right : this.left,
                'v-timeline-item--after': this.timeline.reverse ? this.left : this.right,
                ...this.themeClasses,
            },
        }, children);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlRpbWVsaW5lSXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZUaW1lbGluZS9WVGltZWxpbmVJdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFFBQVE7QUFDUixPQUFPLE1BQXNCLE1BQU0sbUJBQW1CLENBQUE7QUFLdEQsT0FBTyxLQUFLLE1BQU0sVUFBVSxDQUFBO0FBRTVCLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUU5QyxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQ3ZCLFNBQVMsRUFDVCxTQUFTO0FBQ1gsb0JBQW9CO0NBQ25CLENBQUE7QUFRRCxlQUFlLFVBQVUsQ0FBQyxNQUFNLEVBQVcsQ0FBQyxNQUFNLENBQUM7SUFDakQsSUFBSSxFQUFFLGlCQUFpQjtJQUV2QixNQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUM7SUFFcEIsS0FBSyxFQUFFO1FBQ0wsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsU0FBUztTQUNuQjtRQUNELE9BQU8sRUFBRSxPQUFPO1FBQ2hCLE9BQU8sRUFBRSxPQUFPO1FBQ2hCLElBQUksRUFBRSxNQUFNO1FBQ1osU0FBUyxFQUFFLE1BQU07UUFDakIsS0FBSyxFQUFFLE9BQU87UUFDZCxJQUFJLEVBQUUsT0FBTztRQUNiLEtBQUssRUFBRSxPQUFPO1FBQ2QsS0FBSyxFQUFFLE9BQU87S0FDZjtJQUVELFFBQVEsRUFBRTtRQUNSLE9BQU87WUFDTCxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQTtRQUMxQyxDQUFDO0tBQ0Y7SUFFRCxPQUFPLEVBQUU7UUFDUCxPQUFPO1lBQ0wsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRTtnQkFDaEMs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Q0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFR5cGVzXG5pbXBvcnQgbWl4aW5zLCB7IEV4dHJhY3RWdWUgfSBmcm9tICcuLi8uLi91dGlsL21peGlucydcbmltcG9ydCB7IFZOb2RlLCBWTm9kZURhdGEgfSBmcm9tICd2dWUnXG5cbi8vIENvbXBvbmVudHNcbmltcG9ydCBWVGltZWxpbmUgZnJvbSAnLi9WVGltZWxpbmUnXG5pbXBvcnQgVkljb24gZnJvbSAnLi4vVkljb24nXG5cbi8vIE1peGluc1xuaW1wb3J0IFRoZW1lYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdGhlbWVhYmxlJ1xuaW1wb3J0IENvbG9yYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvY29sb3JhYmxlJ1xuXG5jb25zdCBiYXNlTWl4aW5zID0gbWl4aW5zKFxuICBDb2xvcmFibGUsXG4gIFRoZW1lYWJsZVxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbilcblxudHlwZSBWVGltZWxpbmVJbnN0YW5jZSA9IEluc3RhbmNlVHlwZTx0eXBlb2YgVlRpbWVsaW5lPlxuXG5pbnRlcmZhY2Ugb3B0aW9ucyBleHRlbmRzIEV4dHJhY3RWdWU8dHlwZW9mIGJhc2VNaXhpbnM+IHtcbiAgdGltZWxpbmU6IFZUaW1lbGluZUluc3RhbmNlXG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VNaXhpbnMuZXh0ZW5kPG9wdGlvbnM+KCkuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtdGltZWxpbmUtaXRlbScsXG5cbiAgaW5qZWN0OiBbJ3RpbWVsaW5lJ10sXG5cbiAgcHJvcHM6IHtcbiAgICBjb2xvcjoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJ3ByaW1hcnknLFxuICAgIH0sXG4gICAgZmlsbERvdDogQm9vbGVhbixcbiAgICBoaWRlRG90OiBCb29sZWFuLFxuICAgIGljb246IFN0cmluZyxcbiAgICBpY29uQ29sb3I6IFN0cmluZyxcbiAgICBsYXJnZTogQm9vbGVhbixcbiAgICBsZWZ0OiBCb29sZWFuLFxuICAgIHJpZ2h0OiBCb29sZWFuLFxuICAgIHNtYWxsOiBCb29sZWFuLFxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgaGFzSWNvbiAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gISF0aGlzLmljb24gfHwgISF0aGlzLiRzbG90cy5pY29uXG4gICAgfSxcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgZ2VuQm9keSAoKSB7XG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3YtdGltZWxpbmUtaXRlbV9fYm9keScsXG4gICAgICB9LCB0aGlzLiRzbG90cy5kZWZhdWx0KVxuICAgIH0sXG4gICAgZ2VuSWNvbiAoKTogVk5vZGUgfCBWTm9kZVtdIHtcbiAgICAgIGlmICh0aGlzLiRzbG90cy5pY29uKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiRzbG90cy5pY29uXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZJY29uLCB7XG4gICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgY29sb3I6IHRoaXMuaWNvbkNvbG9yLFxuICAgICAgICAgIGRhcms6ICF0aGlzLnRoZW1lLmlzRGFyayxcbiAgICAgICAgICBzbWFsbDogdGhpcy5zbWFsbCxcbiAgICAgICAgfSxcbiAgICAgIH0sIHRoaXMuaWNvbilcbiAgICB9LFxuICAgIGdlbklubmVyRG90ICgpIHtcbiAgICAgIGNvbnN0IGRhdGE6IFZOb2RlRGF0YSA9IHRoaXMuc2V0QmFja2dyb3VuZENvbG9yKHRoaXMuY29sb3IpXG5cbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi10aW1lbGluZS1pdGVtX19pbm5lci1kb3QnLFxuICAgICAgICAuLi5kYXRhLFxuICAgICAgfSwgW3RoaXMuaGFzSWNvbiAmJiB0aGlzLmdlbkljb24oKV0pXG4gICAgfSxcbiAgICBnZW5Eb3QgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LXRpbWVsaW5lLWl0ZW1fX2RvdCcsXG4gICAgICAgIGNsYXNzOiB7XG4gICAgICAgICAgJ3YtdGltZWxpbmUtaXRlbV9fZG90LS1zbWFsbCc6IHRoaXMuc21hbGwsXG4gICAgICAgICAgJ3YtdGltZWxpbmUtaXRlbV9fZG90LS1sYXJnZSc6IHRoaXMubGFyZ2UsXG4gICAgICAgIH0sXG4gICAgICB9LCBbdGhpcy5nZW5Jbm5lckRvdCgpXSlcbiAgICB9LFxuICAgIGdlbkRpdmlkZXIgKCkge1xuICAgICAgY29uc3QgY2hpbGRyZW4gPSBbXVxuXG4gICAgICBpZiAoIXRoaXMuaGlkZURvdCkgY2hpbGRyZW4ucHVzaCh0aGlzLmdlbkRvdCgpKVxuXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3YtdGltZWxpbmUtaXRlbV9fZGl2aWRlcicsXG4gICAgICB9LCBjaGlsZHJlbilcbiAgICB9LFxuICAgIGdlbk9wcG9zaXRlICgpIHtcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi10aW1lbGluZS1pdGVtX19vcHBvc2l0ZScsXG4gICAgICB9LCB0aGlzLiRzbG90cy5vcHBvc2l0ZSlcbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcbiAgICBjb25zdCBjaGlsZHJlbiA9IFtcbiAgICAgIHRoaXMuZ2VuQm9keSgpLFxuICAgICAgdGhpcy5nZW5EaXZpZGVyKCksXG4gICAgXVxuXG4gICAgaWYgKHRoaXMuJHNsb3RzLm9wcG9zaXRlKSBjaGlsZHJlbi5wdXNoKHRoaXMuZ2VuT3Bwb3NpdGUoKSlcblxuICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICBzdGF0aWNDbGFzczogJ3YtdGltZWxpbmUtaXRlbScsXG4gICAgICBjbGFzczoge1xuICAgICAgICAndi10aW1lbGluZS1pdGVtLS1maWxsLWRvdCc6IHRoaXMuZmlsbERvdCxcbiAgICAgICAgJ3YtdGltZWxpbmUtaXRlbS0tYmVmb3JlJzogdGhpcy50aW1lbGluZS5yZXZlcnNlID8gdGhpcy5yaWdodCA6IHRoaXMubGVmdCxcbiAgICAgICAgJ3YtdGltZWxpbmUtaXRlbS0tYWZ0ZXInOiB0aGlzLnRpbWVsaW5lLnJldmVyc2UgPyB0aGlzLmxlZnQgOiB0aGlzLnJpZ2h0LFxuICAgICAgICAuLi50aGlzLnRoZW1lQ2xhc3NlcyxcbiAgICAgIH0sXG4gICAgfSwgY2hpbGRyZW4pXG4gIH0sXG59KVxuIl19