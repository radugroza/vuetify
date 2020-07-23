// Styles
import './VEditDialog.sass';
// Mixins
import Returnable from '../../mixins/returnable';
import Themeable from '../../mixins/themeable';
// Utils
import { keyCodes } from '../../util/helpers';
// Component
import VBtn from '../VBtn';
import VMenu from '../VMenu';
import mixins from '../../util/mixins';
/* @vue/component */
export default mixins(Returnable, Themeable).extend({
    name: 'v-edit-dialog',
    props: {
        cancelText: {
            default: 'Cancel',
        },
        large: Boolean,
        eager: Boolean,
        persistent: Boolean,
        saveText: {
            default: 'Save',
        },
        transition: {
            type: String,
            default: 'slide-x-reverse-transition',
        },
    },
    data() {
        return {
            isActive: false,
        };
    },
    watch: {
        isActive(val) {
            if (val) {
                this.$emit('open');
                setTimeout(this.focus, 50); // Give DOM time to paint
            }
            else {
                this.$emit('close');
            }
        },
    },
    methods: {
        cancel() {
            this.isActive = false;
            this.$emit('cancel');
        },
        focus() {
            const input = this.$refs.content.querySelector('input');
            input && input.focus();
        },
        genButton(fn, text) {
            return this.$createElement(VBtn, {
                props: {
                    text: true,
                    color: 'primary',
                    light: true,
                },
                on: { click: fn },
            }, text);
        },
        genActions() {
            return this.$createElement('div', {
                class: 'v-small-dialog__actions',
            }, [
                this.genButton(this.cancel, this.cancelText),
                this.genButton(() => {
                    this.save(this.returnValue);
                    this.$emit('save');
                }, this.saveText),
            ]);
        },
        genContent() {
            return this.$createElement('div', {
                staticClass: 'v-small-dialog__content',
                on: {
                    keydown: (e) => {
                        const input = this.$refs.content.querySelector('input');
                        e.keyCode === keyCodes.esc && this.cancel();
                        if (e.keyCode === keyCodes.enter && input) {
                            this.save(input.value);
                            this.$emit('save');
                        }
                    },
                },
                ref: 'content',
            }, [this.$slots.input]);
        },
    },
    render(h) {
        return h(VMenu, {
            staticClass: 'v-small-dialog',
            class: this.themeClasses,
            props: {
                contentClass: 'v-small-dialog__menu-content',
                transition: this.transition,
                origin: 'top right',
                right: true,
                value: this.isActive,
                closeOnClick: !this.persistent,
                closeOnContentClick: false,
                eager: this.eager,
                light: this.light,
                dark: this.dark,
            },
            on: {
                input: (val) => (this.isActive = val),
            },
            scopedSlots: {
                activator: ({ on }) => {
                    return h('div', {
                        staticClass: 'v-small-dialog__activator',
                        on,
                    }, [
                        h('span', {
                            staticClass: 'v-small-dialog__activator__content',
                        }, this.$slots.default),
                    ]);
                },
            },
        }, [
            this.genContent(),
            this.large ? this.genActions() : null,
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkVkaXREaWFsb2cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WRGF0YVRhYmxlL1ZFZGl0RGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFNBQVM7QUFDVCxPQUFPLG9CQUFvQixDQUFBO0FBRTNCLFNBQVM7QUFDVCxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUNoRCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUU5QyxRQUFRO0FBQ1IsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBRTdDLFlBQVk7QUFDWixPQUFPLElBQUksTUFBTSxTQUFTLENBQUE7QUFDMUIsT0FBTyxLQUFLLE1BQU0sVUFBVSxDQUFBO0FBSTVCLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBRXRDLG9CQUFvQjtBQUNwQixlQUFlLE1BQU0sQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDO0lBQ2xELElBQUksRUFBRSxlQUFlO0lBRXJCLEtBQUssRUFBRTtRQUNMLFVBQVUsRUFBRTtZQUNWLE9BQU8sRUFBRSxRQUFRO1NBQ2xCO1FBQ0QsS0FBSyxFQUFFLE9BQU87UUFDZCxLQUFLLEVBQUUsT0FBTztRQUNkLFVBQVUsRUFBRSxPQUFPO1FBQ25CLFFBQVEsRUFBRTtZQUNSLE9BQU8sRUFBRSxNQUFNO1NBQ2hCO1FBQ0QsVUFBVSxFQUFFO1lBQ1YsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsNEJBQTRCO1NBQ3RDO0tBQ0Y7SUFFRCxJQUFJO1FBQ0YsT0FBTztZQUNMLFFBQVEsRUFBRSxLQUFLO1NBQ2hCLENBQUE7SUFDSCxDQUFDO0lBRUQsS0FBSyxFQUFFO1FBQ0wsUUFBUSxDQUFFLEdBQUc7WUFDWCxJQUFJLEdBQUcsRUFBRTtnQkFDUCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFBO2dCQUNsQixVQUFVLENBQUMsSUFB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QUFFLEtBQUs7Z0JBQzFCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDakIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUNqQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7YUFDaEI7WUFDRCxFQUFFLEVBQUU7Z0JBQ0YsS0FBSyxFQUFFLENBQUMsR0FBWSxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO2FBQy9DO1lBQ0QsV0FBVyxFQUFFO2dCQUNYLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtvQkFDcEIsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFO3dCQUNkLFdBQVcsRUFBRSwyQkFBMkI7d0JBQ3hDLEVBQUU7cUJBQ0gsRUFBRTt3QkFDRCxDQUFDLENBQUMsTUFBTSxFQUFFOzRCQUNSLFdBQVcsRUFBRSxvQ0FBb0M7eUJBQ2xELEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7cUJBQ3hCLENBQUMsQ0FBQTtnQkFDSixDQUFDO2FBQ0Y7U0FDRixFQUFFO1lBQ0QsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUk7U0FDdEMsQ0FBQyxDQUFBO0lBQ0osQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xuaW1wb3J0ICcuL1ZFZGl0RGlhbG9nLnNhc3MnXG5cbi8vIE1peGluc1xuaW1wb3J0IFJldHVybmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3JldHVybmFibGUnXG5pbXBvcnQgVGhlbWVhYmxlIGZyb20gJy4uLy4uL21peGlucy90aGVtZWFibGUnXG5cbi8vIFV0aWxzXG5pbXBvcnQgeyBrZXlDb2RlcyB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcblxuLy8gQ29tcG9uZW50XG5pbXBvcnQgVkJ0biBmcm9tICcuLi9WQnRuJ1xuaW1wb3J0IFZNZW51IGZyb20gJy4uL1ZNZW51J1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgVk5vZGUsIFZOb2RlQ2hpbGRyZW4gfSBmcm9tICd2dWUnXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFJldHVybmFibGUsIFRoZW1lYWJsZSkuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtZWRpdC1kaWFsb2cnLFxuXG4gIHByb3BzOiB7XG4gICAgY2FuY2VsVGV4dDoge1xuICAgICAgZGVmYXVsdDogJ0NhbmNlbCcsXG4gICAgfSxcbiAgICBsYXJnZTogQm9vbGVhbixcbiAgICBlYWdlcjogQm9vbGVhbixcbiAgICBwZXJzaXN0ZW50OiBCb29sZWFuLFxuICAgIHNhdmVUZXh0OiB7XG4gICAgICBkZWZhdWx0OiAnU2F2ZScsXG4gICAgfSxcbiAgICB0cmFuc2l0aW9uOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnc2xpZGUteC1yZXZlcnNlLXRyYW5zaXRpb24nLFxuICAgIH0sXG4gIH0sXG5cbiAgZGF0YSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlzQWN0aXZlOiBmYWxzZSxcbiAgICB9XG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICBpc0FjdGl2ZSAodmFsKSB7XG4gICAgICBpZiAodmFsKSB7XG4gICAgICAgIHRoaXMuJGVtaXQoJ29wZW4nKVxuICAgICAgICBzZXRUaW1lb3V0KHRoaXMuZm9jdXMsIDUwKSAvLyBHaXZlIERPTSB0aW1lIHRvIHBhaW50XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLiRlbWl0KCdjbG9zZScpXG4gICAgICB9XG4gICAgfSxcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgY2FuY2VsICgpIHtcbiAgICAgIHRoaXMuaXNBY3RpdmUgPSBmYWxzZVxuICAgICAgdGhpcy4kZW1pdCgnY2FuY2VsJylcbiAgICB9LFxuICAgIGZvY3VzICgpIHtcbiAgICAgIGNvbnN0IGlucHV0ID0gKHRoaXMuJHJlZnMuY29udGVudCBhcyBFbGVtZW50KS5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpXG4gICAgICBpbnB1dCAmJiBpbnB1dC5mb2N1cygpXG4gICAgfSxcbiAgICBnZW5CdXR0b24gKGZuOiBGdW5jdGlvbiwgdGV4dDogVk5vZGVDaGlsZHJlbik6IFZOb2RlIHtcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZCdG4sIHtcbiAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICB0ZXh0OiB0cnVlLFxuICAgICAgICAgIGNvbG9yOiAncHJpbWFyeScsXG4gICAgICAgICAgbGlnaHQ6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIG9uOiB7IGNsaWNrOiBmbiB9LFxuICAgICAgfSwgdGV4dClcbiAgICB9LFxuICAgIGdlbkFjdGlvbnMgKCk6IFZOb2RlIHtcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgIGNsYXNzOiAndi1zbWFsbC1kaWFsb2dfX2FjdGlvbnMnLFxuICAgICAgfSwgW1xuICAgICAgICB0aGlzLmdlbkJ1dHRvbih0aGlzLmNhbmNlbCwgdGhpcy5jYW5jZWxUZXh0KSxcbiAgICAgICAgdGhpcy5nZW5CdXR0b24oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuc2F2ZSh0aGlzLnJldHVyblZhbHVlKVxuICAgICAgICAgIHRoaXMuJGVtaXQoJ3NhdmUnKVxuICAgICAgICB9LCB0aGlzLnNhdmVUZXh0KSxcbiAgICAgIF0pXG4gICAgfSxcbiAgICBnZW5Db250ZW50ICgpOiBWTm9kZSB7XG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3Ytc21hbGwtZGlhbG9nX19jb250ZW50JyxcbiAgICAgICAgb246IHtcbiAgICAgICAgICBrZXlkb3duOiAoZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5wdXQgPSAodGhpcy4kcmVmcy5jb250ZW50IGFzIEVsZW1lbnQpLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JylcbiAgICAgICAgICAgIGUua2V5Q29kZSA9PT0ga2V5Q29kZXMuZXNjICYmIHRoaXMuY2FuY2VsKClcbiAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT09IGtleUNvZGVzLmVudGVyICYmIGlucHV0KSB7XG4gICAgICAgICAgICAgIHRoaXMuc2F2ZShpbnB1dC52YWx1ZSlcbiAgICAgICAgICAgICAgdGhpcy4kZW1pdCgnc2F2ZScpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgcmVmOiAnY29udGVudCcsXG4gICAgICB9LCBbdGhpcy4kc2xvdHMuaW5wdXRdKVxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyIChoKTogVk5vZGUge1xuICAgIHJldHVybiBoKFZNZW51LCB7XG4gICAgICBzdGF0aWNDbGFzczogJ3Ytc21hbGwtZGlhbG9nJyxcbiAgICAgIGNsYXNzOiB0aGlzLnRoZW1lQ2xhc3NlcyxcbiAgICAgIHByb3BzOiB7XG4gICAgICAgIGNvbnRlbnRDbGFzczogJ3Ytc21hbGwtZGlhbG9nX19tZW51LWNvbnRlbnQnLFxuICAgICAgICB0cmFuc2l0aW9uOiB0aGlzLnRyYW5zaXRpb24sXG4gICAgICAgIG9yaWdpbjogJ3RvcCByaWdodCcsXG4gICAgICAgIHJpZ2h0OiB0cnVlLFxuICAgICAgICB2YWx1ZTogdGhpcy5pc0FjdGl2ZSxcbiAgICAgICAgY2xvc2VPbkNsaWNrOiAhdGhpcy5wZXJzaXN0ZW50LFxuICAgICAgICBjbG9zZU9uQ29udGVudENsaWNrOiBmYWxzZSxcbiAgICAgICAgZWFnZXI6IHRoaXMuZWFnZXIsXG4gICAgICAgIGxpZ2h0OiB0aGlzLmxpZ2h0LFxuICAgICAgICBkYXJrOiB0aGlzLmRhcmssXG4gICAgICB9LFxuICAgICAgb246IHtcbiAgICAgICAgaW5wdXQ6ICh2YWw6IGJvb2xlYW4pID0+ICh0aGlzLmlzQWN0aXZlID0gdmFsKSxcbiAgICAgIH0sXG4gICAgICBzY29wZWRTbG90czoge1xuICAgICAgICBhY3RpdmF0b3I6ICh7IG9uIH0pID0+IHtcbiAgICAgICAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgICAgICAgc3RhdGljQ2xhc3M6ICd2LXNtYWxsLWRpYWxvZ19fYWN0aXZhdG9yJyxcbiAgICAgICAgICAgIG9uLFxuICAgICAgICAgIH0sIFtcbiAgICAgICAgICAgIGgoJ3NwYW4nLCB7XG4gICAgICAgICAgICAgIHN0YXRpY0NsYXNzOiAndi1zbWFsbC1kaWFsb2dfX2FjdGl2YXRvcl9fY29udGVudCcsXG4gICAgICAgICAgICB9LCB0aGlzLiRzbG90cy5kZWZhdWx0KSxcbiAgICAgICAgICBdKVxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LCBbXG4gICAgICB0aGlzLmdlbkNvbnRlbnQoKSxcbiAgICAgIHRoaXMubGFyZ2UgPyB0aGlzLmdlbkFjdGlvbnMoKSA6IG51bGwsXG4gICAgXSlcbiAgfSxcbn0pXG4iXX0=