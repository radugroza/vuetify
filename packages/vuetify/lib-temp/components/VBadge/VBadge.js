// Styles
import './VBadge.sass';
// Components
import VIcon from '../VIcon/VIcon';
// Mixins
import Colorable from '../../mixins/colorable';
import Themeable from '../../mixins/themeable';
import Toggleable from '../../mixins/toggleable';
import Transitionable from '../../mixins/transitionable';
import { factory as PositionableFactory } from '../../mixins/positionable';
// Utilities
import mixins from '../../util/mixins';
import { convertToUnit, getSlot, } from '../../util/helpers';
export default mixins(Colorable, PositionableFactory(['left', 'bottom']), Themeable, Toggleable, Transitionable).extend({
    name: 'v-badge',
    props: {
        avatar: Boolean,
        bordered: Boolean,
        color: {
            type: String,
            default: 'primary',
        },
        content: { required: false },
        dot: Boolean,
        label: {
            type: String,
            default: '$vuetify.badge',
        },
        icon: String,
        inline: Boolean,
        offsetX: [Number, String],
        offsetY: [Number, String],
        overlap: Boolean,
        tile: Boolean,
        transition: {
            type: String,
            default: 'scale-rotate-transition',
        },
        value: { default: true },
    },
    computed: {
        classes() {
            return {
                'v-badge--avatar': this.avatar,
                'v-badge--bordered': this.bordered,
                'v-badge--bottom': this.bottom,
                'v-badge--dot': this.dot,
                'v-badge--icon': this.icon != null,
                'v-badge--inline': this.inline,
                'v-badge--left': this.left,
                'v-badge--overlap': this.overlap,
                'v-badge--tile': this.tile,
                ...this.themeClasses,
            };
        },
        computedBottom() {
            return this.bottom ? 'auto' : this.computedYOffset;
        },
        computedLeft() {
            if (this.isRtl) {
                return this.left ? this.computedXOffset : 'auto';
            }
            return this.left ? 'auto' : this.computedXOffset;
        },
        computedRight() {
            if (this.isRtl) {
                return this.left ? 'auto' : this.computedXOffset;
            }
            return !this.left ? 'auto' : this.computedXOffset;
        },
        computedTop() {
            return this.bottom ? this.computedYOffset : 'auto';
        },
        computedXOffset() {
            return this.calcPosition(this.offsetX);
        },
        computedYOffset() {
            return this.calcPosition(this.offsetY);
        },
        isRtl() {
            return this.$vuetify.rtl;
        },
        // Default fallback if offsetX
        // or offsetY are undefined.
        offset() {
            if (this.overlap)
                return this.dot ? 8 : 12;
            return this.dot ? 2 : 4;
        },
        styles() {
            if (this.inline)
                return {};
            return {
                bottom: this.computedBottom,
                left: this.computedLeft,
                right: this.computedRight,
                top: this.computedTop,
            };
        },
    },
    methods: {
        calcPosition(offset) {
            return `calc(100% - ${convertToUnit(offset || this.offset)})`;
        },
        genBadge() {
            const lang = this.$vuetify.lang;
            const label = this.$attrs['aria-label'] || lang.t(this.label);
            const data = this.setBackgroundColor(this.color, {
                staticClass: 'v-badge__badge',
                style: this.styles,
                attrs: {
                    'aria-atomic': this.$attrs['aria-atomic'] || 'true',
                    'aria-label': label,
                    'aria-live': this.$attrs['aria-live'] || 'polite',
                    title: this.$attrs.title,
                    role: this.$attrs.role || 'status',
                },
                directives: [{
                        name: 'show',
                        value: this.isActive,
                    }],
            });
            const badge = this.$createElement('span', data, [this.genBadgeContent()]);
            if (!this.transition)
                return badge;
            return this.$createElement('transition', {
                props: {
                    name: this.transition,
                    origin: this.origin,
                    mode: this.mode,
                },
            }, [badge]);
        },
        genBadgeContent() {
            // Dot prop shows no content
            if (this.dot)
                return undefined;
            const slot = getSlot(this, 'badge');
            if (slot)
                return slot;
            if (this.content)
                return String(this.content);
            if (this.icon)
                return this.$createElement(VIcon, this.icon);
            return undefined;
        },
        genBadgeWrapper() {
            return this.$createElement('span', {
                staticClass: 'v-badge__wrapper',
            }, [this.genBadge()]);
        },
    },
    render(h) {
        const badge = [this.genBadgeWrapper()];
        const children = [getSlot(this)];
        const { 'aria-atomic': _x, 'aria-label': _y, 'aria-live': _z, role, title, ...attrs } = this.$attrs;
        if (this.inline && this.left)
            children.unshift(badge);
        else
            children.push(badge);
        return h('span', {
            staticClass: 'v-badge',
            attrs,
            class: this.classes,
        }, children);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkJhZGdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkJhZGdlL1ZCYWRnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxlQUFlLENBQUE7QUFFdEIsYUFBYTtBQUNiLE9BQU8sS0FBSyxNQUFNLGdCQUFnQixDQUFBO0FBRWxDLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUNoRCxPQUFPLGNBQWMsTUFBTSw2QkFBNkIsQ0FBQTtBQUN4RCxPQUFPLEVBQUUsT0FBTyxJQUFJLG1CQUFtQixFQUFFLE1BQU0sMkJBQTJCLENBQUE7QUFFMUUsWUFBWTtBQUNaLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBQ3RDLE9BQU8sRUFDTCxhQUFhLEVBQ2IsT0FBTyxHQUNSLE1BQU0sb0JBQW9CLENBQUE7QUFLM0IsZUFBZSxNQUFNLENBQ25CLFNBQVMsRUFDVCxtQkFBbUIsQ0FBQyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUN2QyxTQUFTLEVBQ1QsVUFBVSxFQUNWLGNBQWMsQ0FFZixDQUFDLE1BQU0sQ0FBQztJQUNQLElBQUksRUFBRSxTQUFTO0lBRWYsS0FBSyxFQUFFO1FBQ0wsTUFBTSxFQUFFLE9BQU87UUFDZixRQUFRLEVBQUUsT0FBTztRQUNqQixLQUFLLEVBQUU7WUFDTCxJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxTQUFTO1NBQ25CO1FBQ0QsT0FBTyxFQUFFLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtRQUM1QixHQUFHLEVBQUUsT0FBTztRQUNaLEtBQUssRUFBRTtZQUNMLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLGdCQUFnQjtTQUMxQjtRQUNELElBQUksRUFBRSxNQUFNO1FB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QyxDQUFBO1FBQ3RDLE1BQU0sUUFBUSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7UUFDaEMsTUFBTSxFQUNKLGFBQWEsRUFBRSxFQUFFLEVBQ2pCLFlBQVksRUFBRSxFQUFFLEVBQ2hCLFdBQVcsRUFBRSxFQUFFLEVBQ2YsSUFBSSxFQUNKLEtBQUssRUFDTCxHQUFHLEtBQUssRUFDVCxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUE7UUFFZixJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLElBQUk7WUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBOztZQUNoRCxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBRXpCLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRTtZQUNmLFdBQVcsRUFBRSxTQUFTO1lBQ3RCLEtBQUs7WUFDTCxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU87U0FDcEIsRUFBRSxRQUFRLENBQUMsQ0FBQTtJQUNkLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcbmltcG9ydCAnLi9WQmFkZ2Uuc2FzcydcblxuLy8gQ29tcG9uZW50c1xuaW1wb3J0IFZJY29uIGZyb20gJy4uL1ZJY29uL1ZJY29uJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBDb2xvcmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2NvbG9yYWJsZSdcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcbmltcG9ydCBUb2dnbGVhYmxlIGZyb20gJy4uLy4uL21peGlucy90b2dnbGVhYmxlJ1xuaW1wb3J0IFRyYW5zaXRpb25hYmxlIGZyb20gJy4uLy4uL21peGlucy90cmFuc2l0aW9uYWJsZSdcbmltcG9ydCB7IGZhY3RvcnkgYXMgUG9zaXRpb25hYmxlRmFjdG9yeSB9IGZyb20gJy4uLy4uL21peGlucy9wb3NpdGlvbmFibGUnXG5cbi8vIFV0aWxpdGllc1xuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcbmltcG9ydCB7XG4gIGNvbnZlcnRUb1VuaXQsXG4gIGdldFNsb3QsXG59IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcblxuLy8gVHlwZXNcbmltcG9ydCB7IFZOb2RlIH0gZnJvbSAndnVlJ1xuXG5leHBvcnQgZGVmYXVsdCBtaXhpbnMoXG4gIENvbG9yYWJsZSxcbiAgUG9zaXRpb25hYmxlRmFjdG9yeShbJ2xlZnQnLCAnYm90dG9tJ10pLFxuICBUaGVtZWFibGUsXG4gIFRvZ2dsZWFibGUsXG4gIFRyYW5zaXRpb25hYmxlLFxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbikuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtYmFkZ2UnLFxuXG4gIHByb3BzOiB7XG4gICAgYXZhdGFyOiBCb29sZWFuLFxuICAgIGJvcmRlcmVkOiBCb29sZWFuLFxuICAgIGNvbG9yOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAncHJpbWFyeScsXG4gICAgfSxcbiAgICBjb250ZW50OiB7IHJlcXVpcmVkOiBmYWxzZSB9LFxuICAgIGRvdDogQm9vbGVhbixcbiAgICBsYWJlbDoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJyR2dWV0aWZ5LmJhZGdlJyxcbiAgICB9LFxuICAgIGljb246IFN0cmluZyxcbiAgICBpbmxpbmU6IEJvb2xlYW4sXG4gICAgb2Zmc2V0WDogW051bWJlciwgU3RyaW5nXSxcbiAgICBvZmZzZXRZOiBbTnVtYmVyLCBTdHJpbmddLFxuICAgIG92ZXJsYXA6IEJvb2xlYW4sXG4gICAgdGlsZTogQm9vbGVhbixcbiAgICB0cmFuc2l0aW9uOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnc2NhbGUtcm90YXRlLXRyYW5zaXRpb24nLFxuICAgIH0sXG4gICAgdmFsdWU6IHsgZGVmYXVsdDogdHJ1ZSB9LFxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICd2LWJhZGdlLS1hdmF0YXInOiB0aGlzLmF2YXRhcixcbiAgICAgICAgJ3YtYmFkZ2UtLWJvcmRlcmVkJzogdGhpcy5ib3JkZXJlZCxcbiAgICAgICAgJ3YtYmFkZ2UtLWJvdHRvbSc6IHRoaXMuYm90dG9tLFxuICAgICAgICAndi1iYWRnZS0tZG90JzogdGhpcy5kb3QsXG4gICAgICAgICd2LWJhZGdlLS1pY29uJzogdGhpcy5pY29uICE9IG51bGwsXG4gICAgICAgICd2LWJhZGdlLS1pbmxpbmUnOiB0aGlzLmlubGluZSxcbiAgICAgICAgJ3YtYmFkZ2UtLWxlZnQnOiB0aGlzLmxlZnQsXG4gICAgICAgICd2LWJhZGdlLS1vdmVybGFwJzogdGhpcy5vdmVybGFwLFxuICAgICAgICAndi1iYWRnZS0tdGlsZSc6IHRoaXMudGlsZSxcbiAgICAgICAgLi4udGhpcy50aGVtZUNsYXNzZXMsXG4gICAgICB9XG4gICAgfSxcbiAgICBjb21wdXRlZEJvdHRvbSAoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiB0aGlzLmJvdHRvbSA/ICdhdXRvJyA6IHRoaXMuY29tcHV0ZWRZT2Zmc2V0XG4gICAgfSxcbiAgICBjb21wdXRlZExlZnQgKCk6IHN0cmluZyB7XG4gICAgICBpZiAodGhpcy5pc1J0bCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sZWZ0ID8gdGhpcy5jb21wdXRlZFhPZmZzZXQgOiAnYXV0bydcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMubGVmdCA/ICdhdXRvJyA6IHRoaXMuY29tcHV0ZWRYT2Zmc2V0XG4gICAgfSxcbiAgICBjb21wdXRlZFJpZ2h0ICgpOiBzdHJpbmcge1xuICAgICAgaWYgKHRoaXMuaXNSdGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGVmdCA/ICdhdXRvJyA6IHRoaXMuY29tcHV0ZWRYT2Zmc2V0XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAhdGhpcy5sZWZ0ID8gJ2F1dG8nIDogdGhpcy5jb21wdXRlZFhPZmZzZXRcbiAgICB9LFxuICAgIGNvbXB1dGVkVG9wICgpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuIHRoaXMuYm90dG9tID8gdGhpcy5jb21wdXRlZFlPZmZzZXQgOiAnYXV0bydcbiAgICB9LFxuICAgIGNvbXB1dGVkWE9mZnNldCAoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiB0aGlzLmNhbGNQb3NpdGlvbih0aGlzLm9mZnNldFgpXG4gICAgfSxcbiAgICBjb21wdXRlZFlPZmZzZXQgKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gdGhpcy5jYWxjUG9zaXRpb24odGhpcy5vZmZzZXRZKVxuICAgIH0sXG4gICAgaXNSdGwgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMuJHZ1ZXRpZnkucnRsXG4gICAgfSxcbiAgICAvLyBEZWZhdWx0IGZhbGxiYWNrIGlmIG9mZnNldFhcbiAgICAvLyBvciBvZmZzZXRZIGFyZSB1bmRlZmluZWQuXG4gICAgb2Zmc2V0ICgpOiBudW1iZXIge1xuICAgICAgaWYgKHRoaXMub3ZlcmxhcCkgcmV0dXJuIHRoaXMuZG90ID8gOCA6IDEyXG4gICAgICByZXR1cm4gdGhpcy5kb3QgPyAyIDogNFxuICAgIH0sXG4gICAgc3R5bGVzICgpOiBvYmplY3Qge1xuICAgICAgaWYgKHRoaXMuaW5saW5lKSByZXR1cm4ge31cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgYm90dG9tOiB0aGlzLmNvbXB1dGVkQm90dG9tLFxuICAgICAgICBsZWZ0OiB0aGlzLmNvbXB1dGVkTGVmdCxcbiAgICAgICAgcmlnaHQ6IHRoaXMuY29tcHV0ZWRSaWdodCxcbiAgICAgICAgdG9wOiB0aGlzLmNvbXB1dGVkVG9wLFxuICAgICAgfVxuICAgIH0sXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGNhbGNQb3NpdGlvbiAob2Zmc2V0OiBzdHJpbmcgfCBudW1iZXIpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuIGBjYWxjKDEwMCUgLSAke2NvbnZlcnRUb1VuaXQob2Zmc2V0IHx8IHRoaXMub2Zmc2V0KX0pYFxuICAgIH0sXG4gICAgZ2VuQmFkZ2UgKCkge1xuICAgICAgY29uc3QgbGFuZyA9IHRoaXMuJHZ1ZXRpZnkubGFuZ1xuICAgICAgY29uc3QgbGFiZWwgPSB0aGlzLiRhdHRyc1snYXJpYS1sYWJlbCddIHx8IGxhbmcudCh0aGlzLmxhYmVsKVxuXG4gICAgICBjb25zdCBkYXRhID0gdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IodGhpcy5jb2xvciwge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3YtYmFkZ2VfX2JhZGdlJyxcbiAgICAgICAgc3R5bGU6IHRoaXMuc3R5bGVzLFxuICAgICAgICBhdHRyczoge1xuICAgICAgICAgICdhcmlhLWF0b21pYyc6IHRoaXMuJGF0dHJzWydhcmlhLWF0b21pYyddIHx8ICd0cnVlJyxcbiAgICAgICAgICAnYXJpYS1sYWJlbCc6IGxhYmVsLFxuICAgICAgICAgICdhcmlhLWxpdmUnOiB0aGlzLiRhdHRyc1snYXJpYS1saXZlJ10gfHwgJ3BvbGl0ZScsXG4gICAgICAgICAgdGl0bGU6IHRoaXMuJGF0dHJzLnRpdGxlLFxuICAgICAgICAgIHJvbGU6IHRoaXMuJGF0dHJzLnJvbGUgfHwgJ3N0YXR1cycsXG4gICAgICAgIH0sXG4gICAgICAgIGRpcmVjdGl2ZXM6IFt7XG4gICAgICAgICAgbmFtZTogJ3Nob3cnLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLmlzQWN0aXZlLFxuICAgICAgICB9XSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGJhZGdlID0gdGhpcy4kY3JlYXRlRWxlbWVudCgnc3BhbicsIGRhdGEsIFt0aGlzLmdlbkJhZGdlQ29udGVudCgpXSlcblxuICAgICAgaWYgKCF0aGlzLnRyYW5zaXRpb24pIHJldHVybiBiYWRnZVxuXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgndHJhbnNpdGlvbicsIHtcbiAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICBuYW1lOiB0aGlzLnRyYW5zaXRpb24sXG4gICAgICAgICAgb3JpZ2luOiB0aGlzLm9yaWdpbixcbiAgICAgICAgICBtb2RlOiB0aGlzLm1vZGUsXG4gICAgICAgIH0sXG4gICAgICB9LCBbYmFkZ2VdKVxuICAgIH0sXG4gICAgZ2VuQmFkZ2VDb250ZW50ICgpIHtcbiAgICAgIC8vIERvdCBwcm9wIHNob3dzIG5vIGNvbnRlbnRcbiAgICAgIGlmICh0aGlzLmRvdCkgcmV0dXJuIHVuZGVmaW5lZFxuXG4gICAgICBjb25zdCBzbG90ID0gZ2V0U2xvdCh0aGlzLCAnYmFkZ2UnKVxuXG4gICAgICBpZiAoc2xvdCkgcmV0dXJuIHNsb3RcbiAgICAgIGlmICh0aGlzLmNvbnRlbnQpIHJldHVybiBTdHJpbmcodGhpcy5jb250ZW50KVxuICAgICAgaWYgKHRoaXMuaWNvbikgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkljb24sIHRoaXMuaWNvbilcblxuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH0sXG4gICAgZ2VuQmFkZ2VXcmFwcGVyICgpIHtcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdzcGFuJywge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3YtYmFkZ2VfX3dyYXBwZXInLFxuICAgICAgfSwgW3RoaXMuZ2VuQmFkZ2UoKV0pXG4gICAgfSxcbiAgfSxcblxuICByZW5kZXIgKGgpOiBWTm9kZSB7XG4gICAgY29uc3QgYmFkZ2UgPSBbdGhpcy5nZW5CYWRnZVdyYXBwZXIoKV1cbiAgICBjb25zdCBjaGlsZHJlbiA9IFtnZXRTbG90KHRoaXMpXVxuICAgIGNvbnN0IHtcbiAgICAgICdhcmlhLWF0b21pYyc6IF94LFxuICAgICAgJ2FyaWEtbGFiZWwnOiBfeSxcbiAgICAgICdhcmlhLWxpdmUnOiBfeixcbiAgICAgIHJvbGUsXG4gICAgICB0aXRsZSxcbiAgICAgIC4uLmF0dHJzXG4gICAgfSA9IHRoaXMuJGF0dHJzXG5cbiAgICBpZiAodGhpcy5pbmxpbmUgJiYgdGhpcy5sZWZ0KSBjaGlsZHJlbi51bnNoaWZ0KGJhZGdlKVxuICAgIGVsc2UgY2hpbGRyZW4ucHVzaChiYWRnZSlcblxuICAgIHJldHVybiBoKCdzcGFuJywge1xuICAgICAgc3RhdGljQ2xhc3M6ICd2LWJhZGdlJyxcbiAgICAgIGF0dHJzLFxuICAgICAgY2xhc3M6IHRoaXMuY2xhc3NlcyxcbiAgICB9LCBjaGlsZHJlbilcbiAgfSxcbn0pXG4iXX0=