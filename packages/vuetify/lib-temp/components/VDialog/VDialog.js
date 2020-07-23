// Styles
import './VDialog.sass';
// Components
import { VThemeProvider } from '../VThemeProvider';
// Mixins
import Activatable from '../../mixins/activatable';
import Dependent from '../../mixins/dependent';
import Detachable from '../../mixins/detachable';
import Overlayable from '../../mixins/overlayable';
import Returnable from '../../mixins/returnable';
import Stackable from '../../mixins/stackable';
import Toggleable from '../../mixins/toggleable';
// Directives
import ClickOutside from '../../directives/click-outside';
// Helpers
import mixins from '../../util/mixins';
import { removed } from '../../util/console';
import { convertToUnit, keyCodes, } from '../../util/helpers';
const baseMixins = mixins(Activatable, Dependent, Detachable, Overlayable, Returnable, Stackable, Toggleable);
/* @vue/component */
export default baseMixins.extend({
    name: 'v-dialog',
    directives: { ClickOutside },
    props: {
        dark: Boolean,
        disabled: Boolean,
        fullscreen: Boolean,
        light: Boolean,
        maxWidth: {
            type: [String, Number],
            default: 'none',
        },
        noClickAnimation: Boolean,
        origin: {
            type: String,
            default: 'center center',
        },
        persistent: Boolean,
        retainFocus: {
            type: Boolean,
            default: true,
        },
        scrollable: Boolean,
        transition: {
            type: [String, Boolean],
            default: 'dialog-transition',
        },
        width: {
            type: [String, Number],
            default: 'auto',
        },
    },
    data() {
        return {
            activatedBy: null,
            animate: false,
            animateTimeout: -1,
            isActive: !!this.value,
            stackMinZIndex: 200,
        };
    },
    computed: {
        classes() {
            return {
                [(`v-dialog ${this.contentClass}`).trim()]: true,
                'v-dialog--active': this.isActive,
                'v-dialog--persistent': this.persistent,
                'v-dialog--fullscreen': this.fullscreen,
                'v-dialog--scrollable': this.scrollable,
                'v-dialog--animated': this.animate,
            };
        },
        contentClasses() {
            return {
                'v-dialog__content': true,
                'v-dialog__content--active': this.isActive,
            };
        },
        hasActivator() {
            return Boolean(!!this.$slots.activator ||
                !!this.$scopedSlots.activator);
        },
    },
    watch: {
        isActive(val) {
            if (val) {
                this.show();
                this.hideScroll();
            }
            else {
                this.removeOverlay();
                this.unbind();
            }
        },
        fullscreen(val) {
            if (!this.isActive)
                return;
            if (val) {
                this.hideScroll();
                this.removeOverlay(false);
            }
            else {
                this.showScroll();
                this.genOverlay();
            }
        },
    },
    created() {
        /* istanbul ignore next */
        if (this.$attrs.hasOwnProperty('full-width')) {
            removed('full-width', this);
        }
    },
    beforeMount() {
        this.$nextTick(() => {
            this.isBooted = this.isActive;
            this.isActive && this.show();
        });
    },
    beforeDestroy() {
        if (typeof window !== 'undefined')
            this.unbind();
    },
    methods: {
        animateClick() {
            this.animate = false;
            // Needed for when clicking very fast
            // outside of the dialog
            this.$nextTick(() => {
                this.animate = true;
                window.clearTimeout(this.animateTimeout);
                this.animateTimeout = window.setTimeout(() => (this.animate = false), 150);
            });
        },
        closeConditional(e) {
            const target = e.target;
            // Ignore the click if the dialog is closed or destroyed,
            // if it was on an element inside the content,
            // if it was dragged onto the overlay (#6969),
            // or if this isn't the topmost dialog (#9907)
            return !(this._isDestroyed ||
                !this.isActive ||
                this.$refs.content.contains(target) ||
                (this.overlay && target && !this.overlay.$el.contains(target))) && this.activeZIndex >= this.getMaxZIndex();
        },
        hideScroll() {
            if (this.fullscreen) {
                document.documentElement.classList.add('overflow-y-hidden');
            }
            else {
                Overlayable.options.methods.hideScroll.call(this);
            }
        },
        show() {
            !this.fullscreen && !this.hideOverlay && this.genOverlay();
            this.$nextTick(() => {
                this.$refs.content.focus();
                this.bind();
            });
        },
        bind() {
            window.addEventListener('focusin', this.onFocusin);
        },
        unbind() {
            window.removeEventListener('focusin', this.onFocusin);
        },
        onClickOutside(e) {
            this.$emit('click:outside', e);
            if (this.persistent) {
                this.noClickAnimation || this.animateClick();
            }
            else {
                this.isActive = false;
            }
        },
        onKeydown(e) {
            if (e.keyCode === keyCodes.esc && !this.getOpenDependents().length) {
                if (!this.persistent) {
                    this.isActive = false;
                    const activator = this.getActivator();
                    this.$nextTick(() => activator && activator.focus());
                }
                else if (!this.noClickAnimation) {
                    this.animateClick();
                }
            }
            this.$emit('keydown', e);
        },
        // On focus change, wrap focus to stay inside the dialog
        // https://github.com/vuetifyjs/vuetify/issues/6892
        onFocusin(e) {
            if (!e || !this.retainFocus)
                return;
            const target = e.target;
            if (!!target &&
                // It isn't the document or the dialog body
                ![document, this.$refs.content].includes(target) &&
                // It isn't inside the dialog body
                !this.$refs.content.contains(target) &&
                // We're the topmost dialog
                this.activeZIndex >= this.getMaxZIndex() &&
                // It isn't inside a dependent element (like a menu)
                !this.getOpenDependentElements().some(el => el.contains(target))
            // So we must have focused something outside the dialog and its children
            ) {
                // Find and focus the first available element inside the dialog
                const focusable = this.$refs.content.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const el = [...focusable].find(el => !el.hasAttribute('disabled'));
                el && el.focus();
            }
        },
        genContent() {
            return this.showLazyContent(() => [
                this.$createElement(VThemeProvider, {
                    props: {
                        root: true,
                        light: this.light,
                        dark: this.dark,
                    },
                }, [
                    this.$createElement('div', {
                        class: this.contentClasses,
                        attrs: {
                            role: 'document',
                            tabindex: this.isActive ? 0 : undefined,
                            ...this.getScopeIdAttrs(),
                        },
                        on: { keydown: this.onKeydown },
                        style: { zIndex: this.activeZIndex },
                        ref: 'content',
                    }, [this.genTransition()]),
                ]),
            ]);
        },
        genTransition() {
            const content = this.genInnerContent();
            if (!this.transition)
                return content;
            return this.$createElement('transition', {
                props: {
                    name: this.transition,
                    origin: this.origin,
                    appear: true,
                },
            }, [content]);
        },
        genInnerContent() {
            const data = {
                class: this.classes,
                ref: 'dialog',
                directives: [
                    {
                        name: 'click-outside',
                        value: {
                            handler: this.onClickOutside,
                            closeConditional: this.closeConditional,
                            include: this.getOpenDependentElements,
                        },
                    },
                    { name: 'show', value: this.isActive },
                ],
                style: {
                    transformOrigin: this.origin,
                },
            };
            if (!this.fullscreen) {
                data.style = {
                    ...data.style,
                    maxWidth: this.maxWidth === 'none' ? undefined : convertToUnit(this.maxWidth),
                    width: this.width === 'auto' ? undefined : convertToUnit(this.width),
                };
            }
            return this.$createElement('div', data, this.getContentSlot());
        },
    },
    render(h) {
        return h('div', {
            staticClass: 'v-dialog__container',
            class: {
                'v-dialog__container--attached': this.attach === '' ||
                    this.attach === true ||
                    this.attach === 'attach',
            },
            attrs: { role: 'dialog' },
        }, [
            this.genActivator(),
            this.genContent(),
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkRpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZEaWFsb2cvVkRpYWxvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxnQkFBZ0IsQ0FBQTtBQUV2QixhQUFhO0FBQ2IsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG1CQUFtQixDQUFBO0FBRWxELFNBQVM7QUFDVCxPQUFPLFdBQVcsTUFBTSwwQkFBMEIsQ0FBQTtBQUNsRCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUNoRCxPQUFPLFdBQVcsTUFBTSwwQkFBMEIsQ0FBQTtBQUNsRCxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUNoRCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUVoRCxhQUFhO0FBQ2IsT0FBTyxZQUFZLE1BQU0sZ0NBQWdDLENBQUE7QUFFekQsVUFBVTtBQUNWLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBQ3RDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUM1QyxPQUFPLEVBQ0wsYUFBYSxFQUNiLFFBQVEsR0FDVCxNQUFNLG9CQUFvQixDQUFBO0FBSzNCLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FDdkIsV0FBVyxFQUNYLFNBQVMsRUFDVCxVQUFVLEVBQ1YsV0FBVyxFQUNYLFVBQVUsRUFDVixTQUFTLEVBQ1QsVUFBVSxDQUNYLENBQUE7QUFFRCxvQkFBb0I7QUFDcEIsZUFBZSxVQUFVLENBQUMsTUFBTSxDQUFDO0lBQy9CLElBQUksRUFBRSxVQUFVO0lBRWhCLFVBQVUsRUFBRSxFQUFFLFlBQVksRUFBRTtJQUU1QixLQUFLLEVBQUU7UUFDTCxJQUFJLEVBQUUsT0FBTztRQUNiLFFBQVEsRUFBRSxPQUFPO1FBQ2pC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LElBQUksQ0FBQyxLQUFlO29CQUN2QixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7b0JBQzdFLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztpQkFDckUsQ0FBQTthQUNGO1lBRUQsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUE7UUFDaEUsQ0FBQztLQUNGO0lBRUQsTUFBTSxDQUFFLENBQUM7UUFDUCxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUU7WUFDZCxXQUFXLEVBQUUscUJBQXFCO1lBQ2xDLEtBQUssRUFBRTtnQkFDTCwrQkFBK0IsRUFDN0IsSUFBSSxDQUFDLE1BQU0sS0FBSyxFQUFFO29CQUNsQixJQUFJLENBQUMsTUFBTSxLQUFLLElBQUk7b0JBQ3BCLElBQUksQ0FBQyxNQUFNLEtBQUssUUFBUTthQUMzQjtZQUNELEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7U0FDMUIsRUFBRTtZQUNELElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFVBQVUsRUFBRTtTQUNsQixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXG5pbXBvcnQgJy4vVkRpYWxvZy5zYXNzJ1xuXG4vLyBDb21wb25lbnRzXG5pbXBvcnQgeyBWVGhlbWVQcm92aWRlciB9IGZyb20gJy4uL1ZUaGVtZVByb3ZpZGVyJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBBY3RpdmF0YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvYWN0aXZhdGFibGUnXG5pbXBvcnQgRGVwZW5kZW50IGZyb20gJy4uLy4uL21peGlucy9kZXBlbmRlbnQnXG5pbXBvcnQgRGV0YWNoYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvZGV0YWNoYWJsZSdcbmltcG9ydCBPdmVybGF5YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvb3ZlcmxheWFibGUnXG5pbXBvcnQgUmV0dXJuYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvcmV0dXJuYWJsZSdcbmltcG9ydCBTdGFja2FibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3N0YWNrYWJsZSdcbmltcG9ydCBUb2dnbGVhYmxlIGZyb20gJy4uLy4uL21peGlucy90b2dnbGVhYmxlJ1xuXG4vLyBEaXJlY3RpdmVzXG5pbXBvcnQgQ2xpY2tPdXRzaWRlIGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvY2xpY2stb3V0c2lkZSdcblxuLy8gSGVscGVyc1xuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcbmltcG9ydCB7IHJlbW92ZWQgfSBmcm9tICcuLi8uLi91dGlsL2NvbnNvbGUnXG5pbXBvcnQge1xuICBjb252ZXJ0VG9Vbml0LFxuICBrZXlDb2Rlcyxcbn0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgVk5vZGUsIFZOb2RlRGF0YSB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgYmFzZU1peGlucyA9IG1peGlucyhcbiAgQWN0aXZhdGFibGUsXG4gIERlcGVuZGVudCxcbiAgRGV0YWNoYWJsZSxcbiAgT3ZlcmxheWFibGUsXG4gIFJldHVybmFibGUsXG4gIFN0YWNrYWJsZSxcbiAgVG9nZ2xlYWJsZVxuKVxuXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuZXhwb3J0IGRlZmF1bHQgYmFzZU1peGlucy5leHRlbmQoe1xuICBuYW1lOiAndi1kaWFsb2cnLFxuXG4gIGRpcmVjdGl2ZXM6IHsgQ2xpY2tPdXRzaWRlIH0sXG5cbiAgcHJvcHM6IHtcbiAgICBkYXJrOiBCb29sZWFuLFxuICAgIGRpc2FibGVkOiBCb29sZWFuLFxuICAgIGZ1bGxzY3JlZW46IEJvb2xlYW4sXG4gICAgbGlnaHQ6IEJvb2xlYW4sXG4gICAgbWF4V2lkdGg6IHtcbiAgICAgIHR5cGU6IFtTdHJpbmcsIE51bWJlcl0sXG4gICAgICBkZWZhdWx0OiAnbm9uZScsXG4gICAgfSxcbiAgICBub0NsaWNrQW5pbWF0aW9uOiBCb29sZWFuLFxuICAgIG9yaWdpbjoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJ2NlbnRlciBjZW50ZXInLFxuICAgIH0sXG4gICAgcGVyc2lzdGVudDogQm9vbGVhbixcbiAgICByZXRhaW5Gb2N1czoge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgfSxcbiAgICBzY3JvbGxhYmxlOiBCb29sZWFuLFxuICAgIHRyYW5zaXRpb246IHtcbiAgICAgIHR5cGU6IFtTdHJpbmcsIEJvb2xlYW5dLFxuICAgICAgZGVmYXVsdDogJ2RpYWxvZy10cmFuc2l0aW9uJyxcbiAgICB9LFxuICAgIHdpZHRoOiB7XG4gICAgICB0eXBlOiBbU3RyaW5nLCBOdW1iZXJdLFxuICAgICAgZGVmYXVsdDogJ2F1dG8nLFxuICAgIH0sXG4gIH0sXG5cbiAgZGF0YSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjdGl2YXRlZEJ5OiBudWxsIGFzIEV2ZW50VGFyZ2V0IHwgbnVsbCxcbiAgICAgIGFuaW1hdGU6IGZhbHNlLFxuICAgICAgYW5pbWF0ZVRpbWVvdXQ6IC0xLFxuICAgICAgaXNBY3RpdmU6ICEhdGhpcy52YWx1ZSxcbiAgICAgIHN0YWNrTWluWkluZGV4OiAyMDAsXG4gICAgfVxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIFsoYHYtZGlhbG9nICR7dGhpcy5jb250ZW50Q2xhc3N9YCkudHJpbSgpXTogdHJ1ZSxcbiAgICAgICAgJ3YtZGlhbG9nLS1hY3RpdmUnOiB0aGlzLmlzQWN0aXZlLFxuICAgICAgICAndi1kaWFsb2ctLXBlcnNpc3RlbnQnOiB0aGlzLnBlcnNpc3RlbnQsXG4gICAgICAgICd2LWRpYWxvZy0tZnVsbHNjcmVlbic6IHRoaXMuZnVsbHNjcmVlbixcbiAgICAgICAgJ3YtZGlhbG9nLS1zY3JvbGxhYmxlJzogdGhpcy5zY3JvbGxhYmxlLFxuICAgICAgICAndi1kaWFsb2ctLWFuaW1hdGVkJzogdGhpcy5hbmltYXRlLFxuICAgICAgfVxuICAgIH0sXG4gICAgY29udGVudENsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAndi1kaWFsb2dfX2NvbnRlbnQnOiB0cnVlLFxuICAgICAgICAndi1kaWFsb2dfX2NvbnRlbnQtLWFjdGl2ZSc6IHRoaXMuaXNBY3RpdmUsXG4gICAgICB9XG4gICAgfSxcbiAgICBoYXNBY3RpdmF0b3IgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIEJvb2xlYW4oXG4gICAgICAgICEhdGhpcy4kc2xvdHMuYWN0aXZhdG9yIHx8XG4gICAgICAgICEhdGhpcy4kc2NvcGVkU2xvdHMuYWN0aXZhdG9yXG4gICAgICApXG4gICAgfSxcbiAgfSxcblxuICB3YXRjaDoge1xuICAgIGlzQWN0aXZlICh2YWwpIHtcbiAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgdGhpcy5zaG93KClcbiAgICAgICAgdGhpcy5oaWRlU2Nyb2xsKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucmVtb3ZlT3ZlcmxheSgpXG4gICAgICAgIHRoaXMudW5iaW5kKClcbiAgICAgIH1cbiAgICB9LFxuICAgIGZ1bGxzY3JlZW4gKHZhbCkge1xuICAgICAgaWYgKCF0aGlzLmlzQWN0aXZlKSByZXR1cm5cblxuICAgICAgaWYgKHZhbCkge1xuICAgICAgICB0aGlzLmhpZGVTY3JvbGwoKVxuICAgICAgICB0aGlzLnJlbW92ZU92ZXJsYXkoZmFsc2UpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNob3dTY3JvbGwoKVxuICAgICAgICB0aGlzLmdlbk92ZXJsYXkoKVxuICAgICAgfVxuICAgIH0sXG4gIH0sXG5cbiAgY3JlYXRlZCAoKSB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBpZiAodGhpcy4kYXR0cnMuaGFzT3duUHJvcGVydHkoJ2Z1bGwtd2lkdGgnKSkge1xuICAgICAgcmVtb3ZlZCgnZnVsbC13aWR0aCcsIHRoaXMpXG4gICAgfVxuICB9LFxuXG4gIGJlZm9yZU1vdW50ICgpIHtcbiAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XG4gICAgICB0aGlzLmlzQm9vdGVkID0gdGhpcy5pc0FjdGl2ZVxuICAgICAgdGhpcy5pc0FjdGl2ZSAmJiB0aGlzLnNob3coKVxuICAgIH0pXG4gIH0sXG5cbiAgYmVmb3JlRGVzdHJveSAoKSB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB0aGlzLnVuYmluZCgpXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGFuaW1hdGVDbGljayAoKSB7XG4gICAgICB0aGlzLmFuaW1hdGUgPSBmYWxzZVxuICAgICAgLy8gTmVlZGVkIGZvciB3aGVuIGNsaWNraW5nIHZlcnkgZmFzdFxuICAgICAgLy8gb3V0c2lkZSBvZiB0aGUgZGlhbG9nXG4gICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XG4gICAgICAgIHRoaXMuYW5pbWF0ZSA9IHRydWVcbiAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLmFuaW1hdGVUaW1lb3V0KVxuICAgICAgICB0aGlzLmFuaW1hdGVUaW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4gKHRoaXMuYW5pbWF0ZSA9IGZhbHNlKSwgMTUwKVxuICAgICAgfSlcbiAgICB9LFxuICAgIGNsb3NlQ29uZGl0aW9uYWwgKGU6IEV2ZW50KSB7XG4gICAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRWxlbWVudFxuICAgICAgLy8gSWdub3JlIHRoZSBjbGljayBpZiB0aGUgZGlhbG9nIGlzIGNsb3NlZCBvciBkZXN0cm95ZWQsXG4gICAgICAvLyBpZiBpdCB3YXMgb24gYW4gZWxlbWVudCBpbnNpZGUgdGhlIGNvbnRlbnQsXG4gICAgICAvLyBpZiBpdCB3YXMgZHJhZ2dlZCBvbnRvIHRoZSBvdmVybGF5ICgjNjk2OSksXG4gICAgICAvLyBvciBpZiB0aGlzIGlzbid0IHRoZSB0b3Btb3N0IGRpYWxvZyAoIzk5MDcpXG4gICAgICByZXR1cm4gIShcbiAgICAgICAgdGhpcy5faXNEZXN0cm95ZWQgfHxcbiAgICAgICAgIXRoaXMuaXNBY3RpdmUgfHxcbiAgICAgICAgdGhpcy4kcmVmcy5jb250ZW50LmNvbnRhaW5zKHRhcmdldCkgfHxcbiAgICAgICAgKHRoaXMub3ZlcmxheSAmJiB0YXJnZXQgJiYgIXRoaXMub3ZlcmxheS4kZWwuY29udGFpbnModGFyZ2V0KSlcbiAgICAgICkgJiYgdGhpcy5hY3RpdmVaSW5kZXggPj0gdGhpcy5nZXRNYXhaSW5kZXgoKVxuICAgIH0sXG4gICAgaGlkZVNjcm9sbCAoKSB7XG4gICAgICBpZiAodGhpcy5mdWxsc2NyZWVuKSB7XG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdvdmVyZmxvdy15LWhpZGRlbicpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBPdmVybGF5YWJsZS5vcHRpb25zLm1ldGhvZHMuaGlkZVNjcm9sbC5jYWxsKHRoaXMpXG4gICAgICB9XG4gICAgfSxcbiAgICBzaG93ICgpIHtcbiAgICAgICF0aGlzLmZ1bGxzY3JlZW4gJiYgIXRoaXMuaGlkZU92ZXJsYXkgJiYgdGhpcy5nZW5PdmVybGF5KClcbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgdGhpcy4kcmVmcy5jb250ZW50LmZvY3VzKClcbiAgICAgICAgdGhpcy5iaW5kKClcbiAgICAgIH0pXG4gICAgfSxcbiAgICBiaW5kICgpIHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdmb2N1c2luJywgdGhpcy5vbkZvY3VzaW4pXG4gICAgfSxcbiAgICB1bmJpbmQgKCkge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZvY3VzaW4nLCB0aGlzLm9uRm9jdXNpbilcbiAgICB9LFxuICAgIG9uQ2xpY2tPdXRzaWRlIChlOiBFdmVudCkge1xuICAgICAgdGhpcy4kZW1pdCgnY2xpY2s6b3V0c2lkZScsIGUpXG5cbiAgICAgIGlmICh0aGlzLnBlcnNpc3RlbnQpIHtcbiAgICAgICAgdGhpcy5ub0NsaWNrQW5pbWF0aW9uIHx8IHRoaXMuYW5pbWF0ZUNsaWNrKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaXNBY3RpdmUgPSBmYWxzZVxuICAgICAgfVxuICAgIH0sXG4gICAgb25LZXlkb3duIChlOiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICBpZiAoZS5rZXlDb2RlID09PSBrZXlDb2Rlcy5lc2MgJiYgIXRoaXMuZ2V0T3BlbkRlcGVuZGVudHMoKS5sZW5ndGgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnBlcnNpc3RlbnQpIHtcbiAgICAgICAgICB0aGlzLmlzQWN0aXZlID0gZmFsc2VcbiAgICAgICAgICBjb25zdCBhY3RpdmF0b3IgPSB0aGlzLmdldEFjdGl2YXRvcigpXG4gICAgICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4gYWN0aXZhdG9yICYmIChhY3RpdmF0b3IgYXMgSFRNTEVsZW1lbnQpLmZvY3VzKCkpXG4gICAgICAgIH0gZWxzZSBpZiAoIXRoaXMubm9DbGlja0FuaW1hdGlvbikge1xuICAgICAgICAgIHRoaXMuYW5pbWF0ZUNsaWNrKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy4kZW1pdCgna2V5ZG93bicsIGUpXG4gICAgfSxcbiAgICAvLyBPbiBmb2N1cyBjaGFuZ2UsIHdyYXAgZm9jdXMgdG8gc3RheSBpbnNpZGUgdGhlIGRpYWxvZ1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS92dWV0aWZ5anMvdnVldGlmeS9pc3N1ZXMvNjg5MlxuICAgIG9uRm9jdXNpbiAoZTogRXZlbnQpIHtcbiAgICAgIGlmICghZSB8fCAhdGhpcy5yZXRhaW5Gb2N1cykgcmV0dXJuXG5cbiAgICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50XG5cbiAgICAgIGlmIChcbiAgICAgICAgISF0YXJnZXQgJiZcbiAgICAgICAgLy8gSXQgaXNuJ3QgdGhlIGRvY3VtZW50IG9yIHRoZSBkaWFsb2cgYm9keVxuICAgICAgICAhW2RvY3VtZW50LCB0aGlzLiRyZWZzLmNvbnRlbnRdLmluY2x1ZGVzKHRhcmdldCkgJiZcbiAgICAgICAgLy8gSXQgaXNuJ3QgaW5zaWRlIHRoZSBkaWFsb2cgYm9keVxuICAgICAgICAhdGhpcy4kcmVmcy5jb250ZW50LmNvbnRhaW5zKHRhcmdldCkgJiZcbiAgICAgICAgLy8gV2UncmUgdGhlIHRvcG1vc3QgZGlhbG9nXG4gICAgICAgIHRoaXMuYWN0aXZlWkluZGV4ID49IHRoaXMuZ2V0TWF4WkluZGV4KCkgJiZcbiAgICAgICAgLy8gSXQgaXNuJ3QgaW5zaWRlIGEgZGVwZW5kZW50IGVsZW1lbnQgKGxpa2UgYSBtZW51KVxuICAgICAgICAhdGhpcy5nZXRPcGVuRGVwZW5kZW50RWxlbWVudHMoKS5zb21lKGVsID0+IGVsLmNvbnRhaW5zKHRhcmdldCkpXG4gICAgICAgIC8vIFNvIHdlIG11c3QgaGF2ZSBmb2N1c2VkIHNvbWV0aGluZyBvdXRzaWRlIHRoZSBkaWFsb2cgYW5kIGl0cyBjaGlsZHJlblxuICAgICAgKSB7XG4gICAgICAgIC8vIEZpbmQgYW5kIGZvY3VzIHRoZSBmaXJzdCBhdmFpbGFibGUgZWxlbWVudCBpbnNpZGUgdGhlIGRpYWxvZ1xuICAgICAgICBjb25zdCBmb2N1c2FibGUgPSB0aGlzLiRyZWZzLmNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnYnV0dG9uLCBbaHJlZl0sIGlucHV0LCBzZWxlY3QsIHRleHRhcmVhLCBbdGFiaW5kZXhdOm5vdChbdGFiaW5kZXg9XCItMVwiXSknKVxuICAgICAgICBjb25zdCBlbCA9IFsuLi5mb2N1c2FibGVdLmZpbmQoZWwgPT4gIWVsLmhhc0F0dHJpYnV0ZSgnZGlzYWJsZWQnKSkgYXMgSFRNTEVsZW1lbnQgfCB1bmRlZmluZWRcbiAgICAgICAgZWwgJiYgZWwuZm9jdXMoKVxuICAgICAgfVxuICAgIH0sXG4gICAgZ2VuQ29udGVudCAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zaG93TGF6eUNvbnRlbnQoKCkgPT4gW1xuICAgICAgICB0aGlzLiRjcmVhdGVFbGVtZW50KFZUaGVtZVByb3ZpZGVyLCB7XG4gICAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICAgIHJvb3Q6IHRydWUsXG4gICAgICAgICAgICBsaWdodDogdGhpcy5saWdodCxcbiAgICAgICAgICAgIGRhcms6IHRoaXMuZGFyayxcbiAgICAgICAgICB9LFxuICAgICAgICB9LCBbXG4gICAgICAgICAgdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICAgICAgY2xhc3M6IHRoaXMuY29udGVudENsYXNzZXMsXG4gICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICByb2xlOiAnZG9jdW1lbnQnLFxuICAgICAgICAgICAgICB0YWJpbmRleDogdGhpcy5pc0FjdGl2ZSA/IDAgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgIC4uLnRoaXMuZ2V0U2NvcGVJZEF0dHJzKCksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb246IHsga2V5ZG93bjogdGhpcy5vbktleWRvd24gfSxcbiAgICAgICAgICAgIHN0eWxlOiB7IHpJbmRleDogdGhpcy5hY3RpdmVaSW5kZXggfSxcbiAgICAgICAgICAgIHJlZjogJ2NvbnRlbnQnLFxuICAgICAgICAgIH0sIFt0aGlzLmdlblRyYW5zaXRpb24oKV0pLFxuICAgICAgICBdKSxcbiAgICAgIF0pXG4gICAgfSxcbiAgICBnZW5UcmFuc2l0aW9uICgpIHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLmdlbklubmVyQ29udGVudCgpXG5cbiAgICAgIGlmICghdGhpcy50cmFuc2l0aW9uKSByZXR1cm4gY29udGVudFxuXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgndHJhbnNpdGlvbicsIHtcbiAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICBuYW1lOiB0aGlzLnRyYW5zaXRpb24sXG4gICAgICAgICAgb3JpZ2luOiB0aGlzLm9yaWdpbixcbiAgICAgICAgICBhcHBlYXI6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9LCBbY29udGVudF0pXG4gICAgfSxcbiAgICBnZW5Jbm5lckNvbnRlbnQgKCkge1xuICAgICAgY29uc3QgZGF0YTogVk5vZGVEYXRhID0ge1xuICAgICAgICBjbGFzczogdGhpcy5jbGFzc2VzLFxuICAgICAgICByZWY6ICdkaWFsb2cnLFxuICAgICAgICBkaXJlY3RpdmVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ2NsaWNrLW91dHNpZGUnLFxuICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgaGFuZGxlcjogdGhpcy5vbkNsaWNrT3V0c2lkZSxcbiAgICAgICAgICAgICAgY2xvc2VDb25kaXRpb25hbDogdGhpcy5jbG9zZUNvbmRpdGlvbmFsLFxuICAgICAgICAgICAgICBpbmNsdWRlOiB0aGlzLmdldE9wZW5EZXBlbmRlbnRFbGVtZW50cyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7IG5hbWU6ICdzaG93JywgdmFsdWU6IHRoaXMuaXNBY3RpdmUgfSxcbiAgICAgICAgXSxcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICB0cmFuc2Zvcm1PcmlnaW46IHRoaXMub3JpZ2luLFxuICAgICAgICB9LFxuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuZnVsbHNjcmVlbikge1xuICAgICAgICBkYXRhLnN0eWxlID0ge1xuICAgICAgICAgIC4uLmRhdGEuc3R5bGUgYXMgb2JqZWN0LFxuICAgICAgICAgIG1heFdpZHRoOiB0aGlzLm1heFdpZHRoID09PSAnbm9uZScgPyB1bmRlZmluZWQgOiBjb252ZXJ0VG9Vbml0KHRoaXMubWF4V2lkdGgpLFxuICAgICAgICAgIHdpZHRoOiB0aGlzLndpZHRoID09PSAnYXV0bycgPyB1bmRlZmluZWQgOiBjb252ZXJ0VG9Vbml0KHRoaXMud2lkdGgpLFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCBkYXRhLCB0aGlzLmdldENvbnRlbnRTbG90KCkpXG4gICAgfSxcbiAgfSxcblxuICByZW5kZXIgKGgpOiBWTm9kZSB7XG4gICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgIHN0YXRpY0NsYXNzOiAndi1kaWFsb2dfX2NvbnRhaW5lcicsXG4gICAgICBjbGFzczoge1xuICAgICAgICAndi1kaWFsb2dfX2NvbnRhaW5lci0tYXR0YWNoZWQnOlxuICAgICAgICAgIHRoaXMuYXR0YWNoID09PSAnJyB8fFxuICAgICAgICAgIHRoaXMuYXR0YWNoID09PSB0cnVlIHx8XG4gICAgICAgICAgdGhpcy5hdHRhY2ggPT09ICdhdHRhY2gnLFxuICAgICAgfSxcbiAgICAgIGF0dHJzOiB7IHJvbGU6ICdkaWFsb2cnIH0sXG4gICAgfSwgW1xuICAgICAgdGhpcy5nZW5BY3RpdmF0b3IoKSxcbiAgICAgIHRoaXMuZ2VuQ29udGVudCgpLFxuICAgIF0pXG4gIH0sXG59KVxuIl19