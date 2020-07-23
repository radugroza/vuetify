// Styles
import './VAlert.sass';
// Extensions
import VSheet from '../VSheet';
// Components
import VBtn from '../VBtn';
import VIcon from '../VIcon';
// Mixins
import Toggleable from '../../mixins/toggleable';
import Themeable from '../../mixins/themeable';
import Transitionable from '../../mixins/transitionable';
// Utilities
import mixins from '../../util/mixins';
import { breaking } from '../../util/console';
/* @vue/component */
export default mixins(VSheet, Toggleable, Transitionable).extend({
    name: 'v-alert',
    props: {
        border: {
            type: String,
            validator(val) {
                return [
                    'top',
                    'right',
                    'bottom',
                    'left',
                ].includes(val);
            },
        },
        closeLabel: {
            type: String,
            default: '$vuetify.close',
        },
        coloredBorder: Boolean,
        dense: Boolean,
        dismissible: Boolean,
        closeIcon: {
            type: String,
            default: '$cancel',
        },
        icon: {
            default: '',
            type: [Boolean, String],
            validator(val) {
                return typeof val === 'string' || val === false;
            },
        },
        outlined: Boolean,
        prominent: Boolean,
        text: Boolean,
        type: {
            type: String,
            validator(val) {
                return [
                    'info',
                    'error',
                    'success',
                    'warning',
                ].includes(val);
            },
        },
        value: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        __cachedBorder() {
            if (!this.border)
                return null;
            let data = {
                staticClass: 'v-alert__border',
                class: {
                    [`v-alert__border--${this.border}`]: true,
                },
            };
            if (this.coloredBorder) {
                data = this.setBackgroundColor(this.computedColor, data);
                data.class['v-alert__border--has-color'] = true;
            }
            return this.$createElement('div', data);
        },
        __cachedDismissible() {
            if (!this.dismissible)
                return null;
            const color = this.iconColor;
            return this.$createElement(VBtn, {
                staticClass: 'v-alert__dismissible',
                props: {
                    color,
                    icon: true,
                    small: true,
                },
                attrs: {
                    'aria-label': this.$vuetify.lang.t(this.closeLabel),
                },
                on: {
                    click: () => (this.isActive = false),
                },
            }, [
                this.$createElement(VIcon, {
                    props: { color },
                }, this.closeIcon),
            ]);
        },
        __cachedIcon() {
            if (!this.computedIcon)
                return null;
            return this.$createElement(VIcon, {
                staticClass: 'v-alert__icon',
                props: { color: this.iconColor },
            }, this.computedIcon);
        },
        classes() {
            const classes = {
                ...VSheet.options.computed.classes.call(this),
                'v-alert--border': Boolean(this.border),
                'v-alert--dense': this.dense,
                'v-alert--outlined': this.outlined,
                'v-alert--prominent': this.prominent,
                'v-alert--text': this.text,
            };
            if (this.border) {
                classes[`v-alert--border-${this.border}`] = true;
            }
            return classes;
        },
        computedColor() {
            return this.color || this.type;
        },
        computedIcon() {
            if (this.icon === false)
                return false;
            if (typeof this.icon === 'string' && this.icon)
                return this.icon;
            if (!['error', 'info', 'success', 'warning'].includes(this.type))
                return false;
            return `$${this.type}`;
        },
        hasColoredIcon() {
            return (this.hasText ||
                (Boolean(this.border) && this.coloredBorder));
        },
        hasText() {
            return this.text || this.outlined;
        },
        iconColor() {
            return this.hasColoredIcon ? this.computedColor : undefined;
        },
        isDark() {
            if (this.type &&
                !this.coloredBorder &&
                !this.outlined)
                return true;
            return Themeable.options.computed.isDark.call(this);
        },
    },
    created() {
        /* istanbul ignore next */
        if (this.$attrs.hasOwnProperty('outline')) {
            breaking('outline', 'outlined', this);
        }
    },
    methods: {
        genWrapper() {
            const children = [
                this.$slots.prepend || this.__cachedIcon,
                this.genContent(),
                this.__cachedBorder,
                this.$slots.append,
                this.$scopedSlots.close
                    ? this.$scopedSlots.close({ toggle: this.toggle })
                    : this.__cachedDismissible,
            ];
            const data = {
                staticClass: 'v-alert__wrapper',
            };
            return this.$createElement('div', data, children);
        },
        genContent() {
            return this.$createElement('div', {
                staticClass: 'v-alert__content',
            }, this.$slots.default);
        },
        genAlert() {
            let data = {
                staticClass: 'v-alert',
                attrs: {
                    role: 'alert',
                },
                class: this.classes,
                style: this.styles,
                directives: [{
                        name: 'show',
                        value: this.isActive,
                    }],
            };
            if (!this.coloredBorder) {
                const setColor = this.hasText ? this.setTextColor : this.setBackgroundColor;
                data = setColor(this.computedColor, data);
            }
            return this.$createElement('div', data, [this.genWrapper()]);
        },
        /** @public */
        toggle() {
            this.isActive = !this.isActive;
        },
    },
    render(h) {
        const render = this.genAlert();
        if (!this.transition)
            return render;
        return h('transition', {
            props: {
                name: this.transition,
                origin: this.origin,
                mode: this.mode,
            },
        }, [render]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkFsZXJ0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkFsZXJ0L1ZBbGVydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxlQUFlLENBQUE7QUFFdEIsYUFBYTtBQUNiLE9BQU8sTUFBTSxNQUFNLFdBQVcsQ0FBQTtBQUU5QixhQUFhO0FBQ2IsT0FBTyxJQUFJLE1BQU0sU0FBUyxDQUFBO0FBQzFCLE9BQU8sS0FBSyxNQUFNLFVBQVUsQ0FBQTtBQUU1QixTQUFTO0FBQ1QsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFDaEQsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxjQUFjLE1BQU0sNkJBQTZCLENBQUE7QUFFeEQsWUFBWTtBQUNaLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBQ3RDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQU03QyxvQkFBb0I7QUFDcEIsZUFBZSxNQUFNLENBQ25CLE1BQU0sRUFDTixVQUFVLEVBQ1YsY0FBYyxDQUNmLENBQUMsTUFBTSxDQUFDO0lBQ1AsSUFBSSxFQUFFLFNBQVM7SUFFZixLQUFLLEVBQUU7UUFDTCxNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsTUFBTTtZQUNaLFNBQVMsQ0FBRSxHQUFXO2dCQUNwQixPQUFPO29CQUNMLEtBQUs7b0JBQ0wsT0FBTztvQkFDUCxRQUFRO29CQUNSLE1BQU07aUJBQ1AsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDakIsQ0FBQztTQUNGO1FBQ0QsVUFBVSxFQUFFO1lBQ1YsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsZ0JBQWdCO1NBQzFCO1FBQ0QsYUFBYSxFQUFFLE9BQU87UUFDdEIsS0FBSyxFQUFFLE9BQU87UUFDZCxXQUFXLEVBQUUsT0FBTztRQUNwQixTQUFTLEVBQUU7WUFDVCxJQUFJLEVBQUUsTUFB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Q0FBQTtRQUU5QixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVU7WUFBRSxPQUFPLE1BQU0sQ0FBQTtRQUVuQyxPQUFPLENBQUMsQ0FBQyxZQUFZLEVBQUU7WUFDckIsS0FBSyxFQUFFO2dCQUNMLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVTtnQkFDckIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO2dCQUNuQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7YUFDaEI7U0FDRixFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtJQUNkLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcbmltcG9ydCAnLi9WQWxlcnQuc2FzcydcblxuLy8gRXh0ZW5zaW9uc1xuaW1wb3J0IFZTaGVldCBmcm9tICcuLi9WU2hlZXQnXG5cbi8vIENvbXBvbmVudHNcbmltcG9ydCBWQnRuIGZyb20gJy4uL1ZCdG4nXG5pbXBvcnQgVkljb24gZnJvbSAnLi4vVkljb24nXG5cbi8vIE1peGluc1xuaW1wb3J0IFRvZ2dsZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RvZ2dsZWFibGUnXG5pbXBvcnQgVGhlbWVhYmxlIGZyb20gJy4uLy4uL21peGlucy90aGVtZWFibGUnXG5pbXBvcnQgVHJhbnNpdGlvbmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RyYW5zaXRpb25hYmxlJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5pbXBvcnQgeyBicmVha2luZyB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcblxuLy8gVHlwZXNcbmltcG9ydCB7IFZOb2RlRGF0YSB9IGZyb20gJ3Z1ZSdcbmltcG9ydCB7IFZOb2RlIH0gZnJvbSAndnVlL3R5cGVzJ1xuXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFxuICBWU2hlZXQsXG4gIFRvZ2dsZWFibGUsXG4gIFRyYW5zaXRpb25hYmxlXG4pLmV4dGVuZCh7XG4gIG5hbWU6ICd2LWFsZXJ0JyxcblxuICBwcm9wczoge1xuICAgIGJvcmRlcjoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgdmFsaWRhdG9yICh2YWw6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICd0b3AnLFxuICAgICAgICAgICdyaWdodCcsXG4gICAgICAgICAgJ2JvdHRvbScsXG4gICAgICAgICAgJ2xlZnQnLFxuICAgICAgICBdLmluY2x1ZGVzKHZhbClcbiAgICAgIH0sXG4gICAgfSxcbiAgICBjbG9zZUxhYmVsOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnJHZ1ZXRpZnkuY2xvc2UnLFxuICAgIH0sXG4gICAgY29sb3JlZEJvcmRlcjogQm9vbGVhbixcbiAgICBkZW5zZTogQm9vbGVhbixcbiAgICBkaXNtaXNzaWJsZTogQm9vbGVhbixcbiAgICBjbG9zZUljb246IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICckY2FuY2VsJyxcbiAgICB9LFxuICAgIGljb246IHtcbiAgICAgIGRlZmF1bHQ6ICcnLFxuICAgICAgdHlwZTogW0Jvb2xlYW4sIFN0cmluZ10sXG4gICAgICB2YWxpZGF0b3IgKHZhbDogYm9vbGVhbiB8IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgfHwgdmFsID09PSBmYWxzZVxuICAgICAgfSxcbiAgICB9LFxuICAgIG91dGxpbmVkOiBCb29sZWFuLFxuICAgIHByb21pbmVudDogQm9vbGVhbixcbiAgICB0ZXh0OiBCb29sZWFuLFxuICAgIHR5cGU6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIHZhbGlkYXRvciAodmFsOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAnaW5mbycsXG4gICAgICAgICAgJ2Vycm9yJyxcbiAgICAgICAgICAnc3VjY2VzcycsXG4gICAgICAgICAgJ3dhcm5pbmcnLFxuICAgICAgICBdLmluY2x1ZGVzKHZhbClcbiAgICAgIH0sXG4gICAgfSxcbiAgICB2YWx1ZToge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgfSxcbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIF9fY2FjaGVkQm9yZGVyICgpOiBWTm9kZSB8IG51bGwge1xuICAgICAgaWYgKCF0aGlzLmJvcmRlcikgcmV0dXJuIG51bGxcblxuICAgICAgbGV0IGRhdGE6IFZOb2RlRGF0YSA9IHtcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWFsZXJ0X19ib3JkZXInLFxuICAgICAgICBjbGFzczoge1xuICAgICAgICAgIFtgdi1hbGVydF9fYm9yZGVyLS0ke3RoaXMuYm9yZGVyfWBdOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5jb2xvcmVkQm9yZGVyKSB7XG4gICAgICAgIGRhdGEgPSB0aGlzLnNldEJhY2tncm91bmRDb2xvcih0aGlzLmNvbXB1dGVkQ29sb3IsIGRhdGEpXG4gICAgICAgIGRhdGEuY2xhc3NbJ3YtYWxlcnRfX2JvcmRlci0taGFzLWNvbG9yJ10gPSB0cnVlXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCBkYXRhKVxuICAgIH0sXG4gICAgX19jYWNoZWREaXNtaXNzaWJsZSAoKTogVk5vZGUgfCBudWxsIHtcbiAgICAgIGlmICghdGhpcy5kaXNtaXNzaWJsZSkgcmV0dXJuIG51bGxcblxuICAgICAgY29uc3QgY29sb3IgPSB0aGlzLmljb25Db2xvclxuXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudChWQnRuLCB7XG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1hbGVydF9fZGlzbWlzc2libGUnLFxuICAgICAgICBwcm9wczoge1xuICAgICAgICAgIGNvbG9yLFxuICAgICAgICAgIGljb246IHRydWUsXG4gICAgICAgICAgc21hbGw6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgJ2FyaWEtbGFiZWwnOiB0aGlzLiR2dWV0aWZ5LmxhbmcudCh0aGlzLmNsb3NlTGFiZWwpLFxuICAgICAgICB9LFxuICAgICAgICBvbjoge1xuICAgICAgICAgIGNsaWNrOiAoKSA9PiAodGhpcy5pc0FjdGl2ZSA9IGZhbHNlKSxcbiAgICAgICAgfSxcbiAgICAgIH0sIFtcbiAgICAgICAgdGhpcy4kY3JlYXRlRWxlbWVudChWSWNvbiwge1xuICAgICAgICAgIHByb3BzOiB7IGNvbG9yIH0sXG4gICAgICAgIH0sIHRoaXMuY2xvc2VJY29uKSxcbiAgICAgIF0pXG4gICAgfSxcbiAgICBfX2NhY2hlZEljb24gKCk6IFZOb2RlIHwgbnVsbCB7XG4gICAgICBpZiAoIXRoaXMuY29tcHV0ZWRJY29uKSByZXR1cm4gbnVsbFxuXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudChWSWNvbiwge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3YtYWxlcnRfX2ljb24nLFxuICAgICAgICBwcm9wczogeyBjb2xvcjogdGhpcy5pY29uQ29sb3IgfSxcbiAgICAgIH0sIHRoaXMuY29tcHV0ZWRJY29uKVxuICAgIH0sXG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIGNvbnN0IGNsYXNzZXM6IFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+ID0ge1xuICAgICAgICAuLi5WU2hlZXQub3B0aW9ucy5jb21wdXRlZC5jbGFzc2VzLmNhbGwodGhpcyksXG4gICAgICAgICd2LWFsZXJ0LS1ib3JkZXInOiBCb29sZWFuKHRoaXMuYm9yZGVyKSxcbiAgICAgICAgJ3YtYWxlcnQtLWRlbnNlJzogdGhpcy5kZW5zZSxcbiAgICAgICAgJ3YtYWxlcnQtLW91dGxpbmVkJzogdGhpcy5vdXRsaW5lZCxcbiAgICAgICAgJ3YtYWxlcnQtLXByb21pbmVudCc6IHRoaXMucHJvbWluZW50LFxuICAgICAgICAndi1hbGVydC0tdGV4dCc6IHRoaXMudGV4dCxcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuYm9yZGVyKSB7XG4gICAgICAgIGNsYXNzZXNbYHYtYWxlcnQtLWJvcmRlci0ke3RoaXMuYm9yZGVyfWBdID0gdHJ1ZVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gY2xhc3Nlc1xuICAgIH0sXG4gICAgY29tcHV0ZWRDb2xvciAoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbG9yIHx8IHRoaXMudHlwZVxuICAgIH0sXG4gICAgY29tcHV0ZWRJY29uICgpOiBzdHJpbmcgfCBib29sZWFuIHtcbiAgICAgIGlmICh0aGlzLmljb24gPT09IGZhbHNlKSByZXR1cm4gZmFsc2VcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5pY29uID09PSAnc3RyaW5nJyAmJiB0aGlzLmljb24pIHJldHVybiB0aGlzLmljb25cbiAgICAgIGlmICghWydlcnJvcicsICdpbmZvJywgJ3N1Y2Nlc3MnLCAnd2FybmluZyddLmluY2x1ZGVzKHRoaXMudHlwZSkpIHJldHVybiBmYWxzZVxuXG4gICAgICByZXR1cm4gYCQke3RoaXMudHlwZX1gXG4gICAgfSxcbiAgICBoYXNDb2xvcmVkSWNvbiAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICB0aGlzLmhhc1RleHQgfHxcbiAgICAgICAgKEJvb2xlYW4odGhpcy5ib3JkZXIpICYmIHRoaXMuY29sb3JlZEJvcmRlcilcbiAgICAgIClcbiAgICB9LFxuICAgIGhhc1RleHQgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dCB8fCB0aGlzLm91dGxpbmVkXG4gICAgfSxcbiAgICBpY29uQ29sb3IgKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICByZXR1cm4gdGhpcy5oYXNDb2xvcmVkSWNvbiA/IHRoaXMuY29tcHV0ZWRDb2xvciA6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgaXNEYXJrICgpOiBib29sZWFuIHtcbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy50eXBlICYmXG4gICAgICAgICF0aGlzLmNvbG9yZWRCb3JkZXIgJiZcbiAgICAgICAgIXRoaXMub3V0bGluZWRcbiAgICAgICkgcmV0dXJuIHRydWVcblxuICAgICAgcmV0dXJuIFRoZW1lYWJsZS5vcHRpb25zLmNvbXB1dGVkLmlzRGFyay5jYWxsKHRoaXMpXG4gICAgfSxcbiAgfSxcblxuICBjcmVhdGVkICgpIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGlmICh0aGlzLiRhdHRycy5oYXNPd25Qcm9wZXJ0eSgnb3V0bGluZScpKSB7XG4gICAgICBicmVha2luZygnb3V0bGluZScsICdvdXRsaW5lZCcsIHRoaXMpXG4gICAgfVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBnZW5XcmFwcGVyICgpOiBWTm9kZSB7XG4gICAgICBjb25zdCBjaGlsZHJlbiA9IFtcbiAgICAgICAgdGhpcy4kc2xvdHMucHJlcGVuZCB8fCB0aGlzLl9fY2FjaGVkSWNvbixcbiAgICAgICAgdGhpcy5nZW5Db250ZW50KCksXG4gICAgICAgIHRoaXMuX19jYWNoZWRCb3JkZXIsXG4gICAgICAgIHRoaXMuJHNsb3RzLmFwcGVuZCxcbiAgICAgICAgdGhpcy4kc2NvcGVkU2xvdHMuY2xvc2VcbiAgICAgICAgICA/IHRoaXMuJHNjb3BlZFNsb3RzLmNsb3NlKHsgdG9nZ2xlOiB0aGlzLnRvZ2dsZSB9KVxuICAgICAgICAgIDogdGhpcy5fX2NhY2hlZERpc21pc3NpYmxlLFxuICAgICAgXVxuXG4gICAgICBjb25zdCBkYXRhOiBWTm9kZURhdGEgPSB7XG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1hbGVydF9fd3JhcHBlcicsXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCBkYXRhLCBjaGlsZHJlbilcbiAgICB9LFxuICAgIGdlbkNvbnRlbnQgKCk6IFZOb2RlIHtcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1hbGVydF9fY29udGVudCcsXG4gICAgICB9LCB0aGlzLiRzbG90cy5kZWZhdWx0KVxuICAgIH0sXG4gICAgZ2VuQWxlcnQgKCk6IFZOb2RlIHtcbiAgICAgIGxldCBkYXRhOiBWTm9kZURhdGEgPSB7XG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1hbGVydCcsXG4gICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgcm9sZTogJ2FsZXJ0JyxcbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3M6IHRoaXMuY2xhc3NlcyxcbiAgICAgICAgc3R5bGU6IHRoaXMuc3R5bGVzLFxuICAgICAgICBkaXJlY3RpdmVzOiBbe1xuICAgICAgICAgIG5hbWU6ICdzaG93JyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5pc0FjdGl2ZSxcbiAgICAgICAgfV0sXG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5jb2xvcmVkQm9yZGVyKSB7XG4gICAgICAgIGNvbnN0IHNldENvbG9yID0gdGhpcy5oYXNUZXh0ID8gdGhpcy5zZXRUZXh0Q29sb3IgOiB0aGlzLnNldEJhY2tncm91bmRDb2xvclxuICAgICAgICBkYXRhID0gc2V0Q29sb3IodGhpcy5jb21wdXRlZENvbG9yLCBkYXRhKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2JywgZGF0YSwgW3RoaXMuZ2VuV3JhcHBlcigpXSlcbiAgICB9LFxuICAgIC8qKiBAcHVibGljICovXG4gICAgdG9nZ2xlICgpIHtcbiAgICAgIHRoaXMuaXNBY3RpdmUgPSAhdGhpcy5pc0FjdGl2ZVxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyIChoKTogVk5vZGUge1xuICAgIGNvbnN0IHJlbmRlciA9IHRoaXMuZ2VuQWxlcnQoKVxuXG4gICAgaWYgKCF0aGlzLnRyYW5zaXRpb24pIHJldHVybiByZW5kZXJcblxuICAgIHJldHVybiBoKCd0cmFuc2l0aW9uJywge1xuICAgICAgcHJvcHM6IHtcbiAgICAgICAgbmFtZTogdGhpcy50cmFuc2l0aW9uLFxuICAgICAgICBvcmlnaW46IHRoaXMub3JpZ2luLFxuICAgICAgICBtb2RlOiB0aGlzLm1vZGUsXG4gICAgICB9LFxuICAgIH0sIFtyZW5kZXJdKVxuICB9LFxufSlcbiJdfQ==