// Styles
import './VSnackbar.sass';
// Components
import VSheet from '../VSheet/VSheet';
// Mixins
import Colorable from '../../mixins/colorable';
import Themeable from '../../mixins/themeable';
import Toggleable from '../../mixins/toggleable';
import { factory as PositionableFactory } from '../../mixins/positionable';
// Utilities
import mixins from '../../util/mixins';
import { convertToUnit, getSlot } from '../../util/helpers';
import { deprecate, removed } from '../../util/console';
export default mixins(VSheet, Colorable, Toggleable, PositionableFactory([
    'absolute',
    'bottom',
    'left',
    'right',
    'top',
])
/* @vue/component */
).extend({
    name: 'v-snackbar',
    props: {
        app: Boolean,
        centered: Boolean,
        contentClass: {
            type: String,
            default: '',
        },
        multiLine: Boolean,
        text: Boolean,
        timeout: {
            type: [Number, String],
            default: 5000,
        },
        transition: {
            type: [Boolean, String],
            default: 'v-snack-transition',
            validator: v => typeof v === 'string' || v === false,
        },
        vertical: Boolean,
    },
    data: () => ({
        activeTimeout: -1,
    }),
    computed: {
        classes() {
            return {
                'v-snack--absolute': this.absolute,
                'v-snack--active': this.isActive,
                'v-snack--bottom': this.bottom || !this.top,
                'v-snack--centered': this.centered,
                'v-snack--has-background': this.hasBackground,
                'v-snack--left': this.left,
                'v-snack--multi-line': this.multiLine && !this.vertical,
                'v-snack--right': this.right,
                'v-snack--text': this.text,
                'v-snack--top': this.top,
                'v-snack--vertical': this.vertical,
            };
        },
        // Text and outlined styles both
        // use transparent backgrounds
        hasBackground() {
            return (!this.text &&
                !this.outlined);
        },
        // Snackbar is dark by default
        // override themeable logic.
        isDark() {
            return this.hasBackground
                ? !this.light
                : Themeable.options.computed.isDark.call(this);
        },
        styles() {
            // Styles are not needed when
            // using the absolute prop.
            if (this.absolute)
                return {};
            const { bar, bottom, footer, insetFooter, left, right, top, } = this.$vuetify.application;
            // Should always move for y-axis
            // applicationable components.
            return {
                paddingBottom: convertToUnit(bottom + footer + insetFooter),
                paddingLeft: !this.app ? undefined : convertToUnit(left),
                paddingRight: !this.app ? undefined : convertToUnit(right),
                paddingTop: convertToUnit(bar + top),
            };
        },
    },
    watch: {
        isActive: 'setTimeout',
        timeout: 'setTimeout',
    },
    mounted() {
        if (this.isActive)
            this.setTimeout();
    },
    created() {
        /* istanbul ignore next */
        if (this.$attrs.hasOwnProperty('auto-height')) {
            removed('auto-height', this);
        }
        /* istanbul ignore next */
        // eslint-disable-next-line eqeqeq
        if (this.timeout == 0) {
            deprecate('timeout="0"', '-1', this);
        }
    },
    methods: {
        genActions() {
            return this.$createElement('div', {
                staticClass: 'v-snack__action ',
            }, [
                getSlot(this, 'action', {
                    attrs: { class: 'v-snack__btn' },
                }),
            ]);
        },
        genContent() {
            return this.$createElement('div', {
                staticClass: 'v-snack__content',
                class: {
                    [this.contentClass]: true,
                },
                attrs: {
                    role: 'status',
                    'aria-live': 'polite',
                },
            }, [getSlot(this)]);
        },
        genWrapper() {
            const setColor = this.hasBackground
                ? this.setBackgroundColor
                : this.setTextColor;
            const data = setColor(this.color, {
                staticClass: 'v-snack__wrapper',
                class: VSheet.options.computed.classes.call(this),
                directives: [{
                        name: 'show',
                        value: this.isActive,
                    }],
            });
            return this.$createElement('div', data, [
                this.genContent(),
                this.genActions(),
            ]);
        },
        genTransition() {
            return this.$createElement('transition', {
                props: { name: this.transition },
            }, [this.genWrapper()]);
        },
        setTimeout() {
            window.clearTimeout(this.activeTimeout);
            const timeout = Number(this.timeout);
            if (!this.isActive ||
                // TODO: remove 0 in v3
                [0, -1].includes(timeout)) {
                return;
            }
            this.activeTimeout = window.setTimeout(() => {
                this.isActive = false;
            }, timeout);
        },
    },
    render(h) {
        return h('div', {
            staticClass: 'v-snack',
            class: this.classes,
            style: this.styles,
        }, [
            this.transition !== false
                ? this.genTransition()
                : this.genWrapper(),
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlNuYWNrYmFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVlNuYWNrYmFyL1ZTbmFja2Jhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxrQkFBa0IsQ0FBQTtBQUV6QixhQUFhO0FBQ2IsT0FBTyxNQUFNLE1BQU0sa0JBQWtCLENBQUE7QUFFckMsU0FBUztBQUNULE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBQzlDLE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBQzlDLE9BQU8sVUFBVSxNQUFNLHlCQUF5QixDQUFBO0FBQ2hELE9BQU8sRUFBRSxPQUFPLElBQUksbUJBQW1CLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQTtBQUUxRSxZQUFZO0FBQ1osT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFDdEMsT0FBTyxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUMzRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBS3ZELGVBQWUsTUFBTSxDQUNuQixNQUFNLEVBQ04sU0FBUyxFQUNULFVBQVUsRUFDVixtQkFBbUIsQ0FBQztJQUNsQixVQUFVO0lBQ1YsUUFBUTtJQUNSLE1BQU07SUFDTixPQUFPO0lBQ1AsS0FBSztDQUNOLENBQUM7QUFDSixvQkFBb0I7Q0FDbkIsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUsWUFBWTtJQUVsQixLQUFLLEVBQUU7UUFDTCxHQUFHLEVBQUUsT0FBTztRQUNaLFFBQVEsRUFBRSxPQUFPO1FBQ2pCLFlBQVksRUFBRTtZQUNaLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLEVBQUU7U0FDWjtRQUNELFNBQVMsRUFBRSxPQUFPO1FBQ2xCLElBQUksRUFBRSxPQUFPO1FBQ2IsT0FBTyxFQUFFO1lBQ1AsSUFBSSxFQUFFLENBQUMsTUFBTSxF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RTtZQUNkLFdBQVcsRUFBRSxTQUFTO1lBQ3RCLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTztZQUNuQixLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU07U0FDbkIsRUFBRTtZQUNELElBQUksQ0FBQyxVQUFVLEtBQUssS0FBSztnQkFDdkIsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUU7Z0JBQ3RCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO1NBQ3RCLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcbmltcG9ydCAnLi9WU25hY2tiYXIuc2FzcydcblxuLy8gQ29tcG9uZW50c1xuaW1wb3J0IFZTaGVldCBmcm9tICcuLi9WU2hlZXQvVlNoZWV0J1xuXG4vLyBNaXhpbnNcbmltcG9ydCBDb2xvcmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2NvbG9yYWJsZSdcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcbmltcG9ydCBUb2dnbGVhYmxlIGZyb20gJy4uLy4uL21peGlucy90b2dnbGVhYmxlJ1xuaW1wb3J0IHsgZmFjdG9yeSBhcyBQb3NpdGlvbmFibGVGYWN0b3J5IH0gZnJvbSAnLi4vLi4vbWl4aW5zL3Bvc2l0aW9uYWJsZSdcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuaW1wb3J0IHsgY29udmVydFRvVW5pdCwgZ2V0U2xvdCB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcbmltcG9ydCB7IGRlcHJlY2F0ZSwgcmVtb3ZlZCB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcblxuLy8gVHlwZXNcbmltcG9ydCB7IFByb3BUeXBlLCBWTm9kZSB9IGZyb20gJ3Z1ZSdcblxuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFxuICBWU2hlZXQsXG4gIENvbG9yYWJsZSxcbiAgVG9nZ2xlYWJsZSxcbiAgUG9zaXRpb25hYmxlRmFjdG9yeShbXG4gICAgJ2Fic29sdXRlJyxcbiAgICAnYm90dG9tJyxcbiAgICAnbGVmdCcsXG4gICAgJ3JpZ2h0JyxcbiAgICAndG9wJyxcbiAgXSlcbi8qIEB2dWUvY29tcG9uZW50ICovXG4pLmV4dGVuZCh7XG4gIG5hbWU6ICd2LXNuYWNrYmFyJyxcblxuICBwcm9wczoge1xuICAgIGFwcDogQm9vbGVhbixcbiAgICBjZW50ZXJlZDogQm9vbGVhbixcbiAgICBjb250ZW50Q2xhc3M6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICcnLFxuICAgIH0sXG4gICAgbXVsdGlMaW5lOiBCb29sZWFuLFxuICAgIHRleHQ6IEJvb2xlYW4sXG4gICAgdGltZW91dDoge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6IDUwMDAsXG4gICAgfSxcbiAgICB0cmFuc2l0aW9uOiB7XG4gICAgICB0eXBlOiBbQm9vbGVhbiwgU3RyaW5nXSBhcyBQcm9wVHlwZTxmYWxzZSB8IHN0cmluZz4sXG4gICAgICBkZWZhdWx0OiAndi1zbmFjay10cmFuc2l0aW9uJyxcbiAgICAgIHZhbGlkYXRvcjogdiA9PiB0eXBlb2YgdiA9PT0gJ3N0cmluZycgfHwgdiA9PT0gZmFsc2UsXG4gICAgfSxcbiAgICB2ZXJ0aWNhbDogQm9vbGVhbixcbiAgfSxcblxuICBkYXRhOiAoKSA9PiAoe1xuICAgIGFjdGl2ZVRpbWVvdXQ6IC0xLFxuICB9KSxcblxuICBjb21wdXRlZDoge1xuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAndi1zbmFjay0tYWJzb2x1dGUnOiB0aGlzLmFic29sdXRlLFxuICAgICAgICAndi1zbmFjay0tYWN0aXZlJzogdGhpcy5pc0FjdGl2ZSxcbiAgICAgICAgJ3Ytc25hY2stLWJvdHRvbSc6IHRoaXMuYm90dG9tIHx8ICF0aGlzLnRvcCxcbiAgICAgICAgJ3Ytc25hY2stLWNlbnRlcmVkJzogdGhpcy5jZW50ZXJlZCxcbiAgICAgICAgJ3Ytc25hY2stLWhhcy1iYWNrZ3JvdW5kJzogdGhpcy5oYXNCYWNrZ3JvdW5kLFxuICAgICAgICAndi1zbmFjay0tbGVmdCc6IHRoaXMubGVmdCxcbiAgICAgICAgJ3Ytc25hY2stLW11bHRpLWxpbmUnOiB0aGlzLm11bHRpTGluZSAmJiAhdGhpcy52ZXJ0aWNhbCxcbiAgICAgICAgJ3Ytc25hY2stLXJpZ2h0JzogdGhpcy5yaWdodCxcbiAgICAgICAgJ3Ytc25hY2stLXRleHQnOiB0aGlzLnRleHQsXG4gICAgICAgICd2LXNuYWNrLS10b3AnOiB0aGlzLnRvcCxcbiAgICAgICAgJ3Ytc25hY2stLXZlcnRpY2FsJzogdGhpcy52ZXJ0aWNhbCxcbiAgICAgIH1cbiAgICB9LFxuICAgIC8vIFRleHQgYW5kIG91dGxpbmVkIHN0eWxlcyBib3RoXG4gICAgLy8gdXNlIHRyYW5zcGFyZW50IGJhY2tncm91bmRzXG4gICAgaGFzQmFja2dyb3VuZCAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICAhdGhpcy50ZXh0ICYmXG4gICAgICAgICF0aGlzLm91dGxpbmVkXG4gICAgICApXG4gICAgfSxcbiAgICAvLyBTbmFja2JhciBpcyBkYXJrIGJ5IGRlZmF1bHRcbiAgICAvLyBvdmVycmlkZSB0aGVtZWFibGUgbG9naWMuXG4gICAgaXNEYXJrICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLmhhc0JhY2tncm91bmRcbiAgICAgICAgPyAhdGhpcy5saWdodFxuICAgICAgICA6IFRoZW1lYWJsZS5vcHRpb25zLmNvbXB1dGVkLmlzRGFyay5jYWxsKHRoaXMpXG4gICAgfSxcbiAgICBzdHlsZXMgKCk6IG9iamVjdCB7XG4gICAgICAvLyBTdHlsZXMgYXJlIG5vdCBuZWVkZWQgd2hlblxuICAgICAgLy8gdXNpbmcgdGhlIGFic29sdXRlIHByb3AuXG4gICAgICBpZiAodGhpcy5hYnNvbHV0ZSkgcmV0dXJuIHt9XG5cbiAgICAgIGNvbnN0IHtcbiAgICAgICAgYmFyLFxuICAgICAgICBib3R0b20sXG4gICAgICAgIGZvb3RlcixcbiAgICAgICAgaW5zZXRGb290ZXIsXG4gICAgICAgIGxlZnQsXG4gICAgICAgIHJpZ2h0LFxuICAgICAgICB0b3AsXG4gICAgICB9ID0gdGhpcy4kdnVldGlmeS5hcHBsaWNhdGlvblxuXG4gICAgICAvLyBTaG91bGQgYWx3YXlzIG1vdmUgZm9yIHktYXhpc1xuICAgICAgLy8gYXBwbGljYXRpb25hYmxlIGNvbXBvbmVudHMuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBwYWRkaW5nQm90dG9tOiBjb252ZXJ0VG9Vbml0KGJvdHRvbSArIGZvb3RlciArIGluc2V0Rm9vdGVyKSxcbiAgICAgICAgcGFkZGluZ0xlZnQ6ICF0aGlzLmFwcCA/IHVuZGVmaW5lZCA6IGNvbnZlcnRUb1VuaXQobGVmdCksXG4gICAgICAgIHBhZGRpbmdSaWdodDogIXRoaXMuYXBwID8gdW5kZWZpbmVkIDogY29udmVydFRvVW5pdChyaWdodCksXG4gICAgICAgIHBhZGRpbmdUb3A6IGNvbnZlcnRUb1VuaXQoYmFyICsgdG9wKSxcbiAgICAgIH1cbiAgICB9LFxuICB9LFxuXG4gIHdhdGNoOiB7XG4gICAgaXNBY3RpdmU6ICdzZXRUaW1lb3V0JyxcbiAgICB0aW1lb3V0OiAnc2V0VGltZW91dCcsXG4gIH0sXG5cbiAgbW91bnRlZCAoKSB7XG4gICAgaWYgKHRoaXMuaXNBY3RpdmUpIHRoaXMuc2V0VGltZW91dCgpXG4gIH0sXG5cbiAgY3JlYXRlZCAoKSB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBpZiAodGhpcy4kYXR0cnMuaGFzT3duUHJvcGVydHkoJ2F1dG8taGVpZ2h0JykpIHtcbiAgICAgIHJlbW92ZWQoJ2F1dG8taGVpZ2h0JywgdGhpcylcbiAgICB9XG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcbiAgICBpZiAodGhpcy50aW1lb3V0ID09IDApIHtcbiAgICAgIGRlcHJlY2F0ZSgndGltZW91dD1cIjBcIicsICctMScsIHRoaXMpXG4gICAgfVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBnZW5BY3Rpb25zICgpIHtcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1zbmFja19fYWN0aW9uICcsXG4gICAgICB9LCBbXG4gICAgICAgIGdldFNsb3QodGhpcywgJ2FjdGlvbicsIHtcbiAgICAgICAgICBhdHRyczogeyBjbGFzczogJ3Ytc25hY2tfX2J0bicgfSxcbiAgICAgICAgfSksXG4gICAgICBdKVxuICAgIH0sXG4gICAgZ2VuQ29udGVudCAoKSB7XG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3Ytc25hY2tfX2NvbnRlbnQnLFxuICAgICAgICBjbGFzczoge1xuICAgICAgICAgIFt0aGlzLmNvbnRlbnRDbGFzc106IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgcm9sZTogJ3N0YXR1cycsXG4gICAgICAgICAgJ2FyaWEtbGl2ZSc6ICdwb2xpdGUnLFxuICAgICAgICB9LFxuICAgICAgfSwgW2dldFNsb3QodGhpcyldKVxuICAgIH0sXG4gICAgZ2VuV3JhcHBlciAoKSB7XG4gICAgICBjb25zdCBzZXRDb2xvciA9IHRoaXMuaGFzQmFja2dyb3VuZFxuICAgICAgICA/IHRoaXMuc2V0QmFja2dyb3VuZENvbG9yXG4gICAgICAgIDogdGhpcy5zZXRUZXh0Q29sb3JcblxuICAgICAgY29uc3QgZGF0YSA9IHNldENvbG9yKHRoaXMuY29sb3IsIHtcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LXNuYWNrX193cmFwcGVyJyxcbiAgICAgICAgY2xhc3M6IFZTaGVldC5vcHRpb25zLmNvbXB1dGVkLmNsYXNzZXMuY2FsbCh0aGlzKSxcbiAgICAgICAgZGlyZWN0aXZlczogW3tcbiAgICAgICAgICBuYW1lOiAnc2hvdycsXG4gICAgICAgICAgdmFsdWU6IHRoaXMuaXNBY3RpdmUsXG4gICAgICAgIH1dLFxuICAgICAgfSlcblxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIGRhdGEsIFtcbiAgICAgICAgdGhpcy5nZW5Db250ZW50KCksXG4gICAgICAgIHRoaXMuZ2VuQWN0aW9ucygpLFxuICAgICAgXSlcbiAgICB9LFxuICAgIGdlblRyYW5zaXRpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ3RyYW5zaXRpb24nLCB7XG4gICAgICAgIHByb3BzOiB7IG5hbWU6IHRoaXMudHJhbnNpdGlvbiB9LFxuICAgICAgfSwgW3RoaXMuZ2VuV3JhcHBlcigpXSlcbiAgICB9LFxuICAgIHNldFRpbWVvdXQgKCkge1xuICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLmFjdGl2ZVRpbWVvdXQpXG5cbiAgICAgIGNvbnN0IHRpbWVvdXQgPSBOdW1iZXIodGhpcy50aW1lb3V0KVxuXG4gICAgICBpZiAoXG4gICAgICAgICF0aGlzLmlzQWN0aXZlIHx8XG4gICAgICAgIC8vIFRPRE86IHJlbW92ZSAwIGluIHYzXG4gICAgICAgIFswLCAtMV0uaW5jbHVkZXModGltZW91dClcbiAgICAgICkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgdGhpcy5hY3RpdmVUaW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLmlzQWN0aXZlID0gZmFsc2VcbiAgICAgIH0sIHRpbWVvdXQpXG4gICAgfSxcbiAgfSxcblxuICByZW5kZXIgKGgpOiBWTm9kZSB7XG4gICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgIHN0YXRpY0NsYXNzOiAndi1zbmFjaycsXG4gICAgICBjbGFzczogdGhpcy5jbGFzc2VzLFxuICAgICAgc3R5bGU6IHRoaXMuc3R5bGVzLFxuICAgIH0sIFtcbiAgICAgIHRoaXMudHJhbnNpdGlvbiAhPT0gZmFsc2VcbiAgICAgICAgPyB0aGlzLmdlblRyYW5zaXRpb24oKVxuICAgICAgICA6IHRoaXMuZ2VuV3JhcHBlcigpLFxuICAgIF0pXG4gIH0sXG59KVxuIl19