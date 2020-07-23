// Components
import { VFadeTransition } from '../transitions';
import VIcon from '../VIcon';
// Mixins
import Colorable from '../../mixins/colorable';
import { inject as RegistrableInject } from '../../mixins/registrable';
// Directives
import ripple from '../../directives/ripple';
// Utilities
import { getSlot } from '../../util/helpers';
import mixins from '../../util/mixins';
const baseMixins = mixins(Colorable, RegistrableInject('expansionPanel', 'v-expansion-panel-header', 'v-expansion-panel'));
export default baseMixins.extend().extend({
    name: 'v-expansion-panel-header',
    directives: { ripple },
    props: {
        disableIconRotate: Boolean,
        expandIcon: {
            type: String,
            default: '$expand',
        },
        hideActions: Boolean,
        ripple: {
            type: [Boolean, Object],
            default: false,
        },
    },
    data: () => ({
        hasMousedown: false,
    }),
    computed: {
        classes() {
            return {
                'v-expansion-panel-header--active': this.isActive,
                'v-expansion-panel-header--mousedown': this.hasMousedown,
            };
        },
        isActive() {
            return this.expansionPanel.isActive;
        },
        isDisabled() {
            return this.expansionPanel.isDisabled;
        },
        isReadonly() {
            return this.expansionPanel.isReadonly;
        },
    },
    created() {
        this.expansionPanel.registerHeader(this);
    },
    beforeDestroy() {
        this.expansionPanel.unregisterHeader();
    },
    methods: {
        onClick(e) {
            this.$emit('click', e);
        },
        genIcon() {
            const icon = getSlot(this, 'actions') ||
                [this.$createElement(VIcon, this.expandIcon)];
            return this.$createElement(VFadeTransition, [
                this.$createElement('div', {
                    staticClass: 'v-expansion-panel-header__icon',
                    class: {
                        'v-expansion-panel-header__icon--disable-rotate': this.disableIconRotate,
                    },
                    directives: [{
                            name: 'show',
                            value: !this.isDisabled,
                        }],
                }, icon),
            ]);
        },
    },
    render(h) {
        return h('button', this.setBackgroundColor(this.color, {
            staticClass: 'v-expansion-panel-header',
            class: this.classes,
            attrs: {
                tabindex: this.isDisabled ? -1 : null,
                type: 'button',
            },
            directives: [{
                    name: 'ripple',
                    value: this.ripple,
                }],
            on: {
                ...this.$listeners,
                click: this.onClick,
                mousedown: () => (this.hasMousedown = true),
                mouseup: () => (this.hasMousedown = false),
            },
        }), [
            getSlot(this, 'default', { open: this.isActive }, true),
            this.hideActions || this.genIcon(),
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkV4cGFuc2lvblBhbmVsSGVhZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkV4cGFuc2lvblBhbmVsL1ZFeHBhbnNpb25QYW5lbEhlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxhQUFhO0FBQ2IsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGdCQUFnQixDQUFBO0FBRWhELE9BQU8sS0FBSyxNQUFNLFVBQVUsQ0FBQTtBQUU1QixTQUFTO0FBQ1QsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxFQUFFLE1BQU0sSUFBSSxpQkFBaUIsRUFBRSxNQUFNLDBCQUEwQixDQUFBO0FBRXRFLGFBQWE7QUFDYixPQUFPLE1BQU0sTUFBTSx5QkFBeUIsQ0FBQTtBQUU1QyxZQUFZO0FBQ1osT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQzVDLE9BQU8sTUFBc0IsTUFBTSxtQkFBbUIsQ0FBQTtBQUt0RCxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQ3ZCLFNBQVMsRUFDVCxpQkFBaUIsQ0FBd0MsZ0JBQWdCLEVBQUUsMEJBQTBCLEVBQUUsbUJBQW1CLENBQUMsQ0FDNUgsQ0FBQTtBQU9ELGVBQWUsVUFBVSxDQUFDLE1BQU0sRUFBVyxDQUFDLE1BQU0sQ0FBQztJQUNqRCxJQUFJLEVBQUUsMEJBQTBCO0lBRWhDLFVBQVUsRUFBRSxFQUFFLE1BQU0sRUFBRTtJQUV0QixLQUFLLEVBQUU7UUFDTCxpQkFBaUIsRUFBRSxPQUFPO1FBQzFCLFVBQVUsRUFBRTtZQUNWLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLFNBQVM7U0FDbkI7UUFDRCxXQUFXLEVBQUUsT0FBTztRQUNwQixNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDO1lBQ3ZCLE9BQU8sRUFBRSxLQUFLO1NBQ2Y7S0FDRjtJQUVELElBQUksRUFBRSxH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bXBvbmVudHNcbmltcG9ydCB7IFZGYWRlVHJhbnNpdGlvbiB9IGZyb20gJy4uL3RyYW5zaXRpb25zJ1xuaW1wb3J0IFZFeHBhbnNpb25QYW5lbCBmcm9tICcuL1ZFeHBhbnNpb25QYW5lbCdcbmltcG9ydCBWSWNvbiBmcm9tICcuLi9WSWNvbidcblxuLy8gTWl4aW5zXG5pbXBvcnQgQ29sb3JhYmxlIGZyb20gJy4uLy4uL21peGlucy9jb2xvcmFibGUnXG5pbXBvcnQgeyBpbmplY3QgYXMgUmVnaXN0cmFibGVJbmplY3QgfSBmcm9tICcuLi8uLi9taXhpbnMvcmVnaXN0cmFibGUnXG5cbi8vIERpcmVjdGl2ZXNcbmltcG9ydCByaXBwbGUgZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9yaXBwbGUnXG5cbi8vIFV0aWxpdGllc1xuaW1wb3J0IHsgZ2V0U2xvdCB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcbmltcG9ydCBtaXhpbnMsIHsgRXh0cmFjdFZ1ZSB9IGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IFZ1ZSwgeyBWTm9kZSwgVnVlQ29uc3RydWN0b3IgfSBmcm9tICd2dWUnXG5cbmNvbnN0IGJhc2VNaXhpbnMgPSBtaXhpbnMoXG4gIENvbG9yYWJsZSxcbiAgUmVnaXN0cmFibGVJbmplY3Q8J2V4cGFuc2lvblBhbmVsJywgVnVlQ29uc3RydWN0b3I8VnVlPj4oJ2V4cGFuc2lvblBhbmVsJywgJ3YtZXhwYW5zaW9uLXBhbmVsLWhlYWRlcicsICd2LWV4cGFuc2lvbi1wYW5lbCcpXG4pXG5cbmludGVyZmFjZSBvcHRpb25zIGV4dGVuZHMgRXh0cmFjdFZ1ZTx0eXBlb2YgYmFzZU1peGlucz4ge1xuICAkZWw6IEhUTUxFbGVtZW50XG4gIGV4cGFuc2lvblBhbmVsOiBJbnN0YW5jZVR5cGU8dHlwZW9mIFZFeHBhbnNpb25QYW5lbD5cbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZU1peGlucy5leHRlbmQ8b3B0aW9ucz4oKS5leHRlbmQoe1xuICBuYW1lOiAndi1leHBhbnNpb24tcGFuZWwtaGVhZGVyJyxcblxuICBkaXJlY3RpdmVzOiB7IHJpcHBsZSB9LFxuXG4gIHByb3BzOiB7XG4gICAgZGlzYWJsZUljb25Sb3RhdGU6IEJvb2xlYW4sXG4gICAgZXhwYW5kSWNvbjoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJyRleHBhbmQnLFxuICAgIH0sXG4gICAgaGlkZUFjdGlvbnM6IEJvb2xlYW4sXG4gICAgcmlwcGxlOiB7XG4gICAgICB0eXBlOiBbQm9vbGVhbiwgT2JqZWN0XSxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIH0sXG4gIH0sXG5cbiAgZGF0YTogKCkgPT4gKHtcbiAgICBoYXNNb3VzZWRvd246IGZhbHNlLFxuICB9KSxcblxuICBjb21wdXRlZDoge1xuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAndi1leHBhbnNpb24tcGFuZWwtaGVhZGVyLS1hY3RpdmUnOiB0aGlzLmlzQWN0aXZlLFxuICAgICAgICAndi1leHBhbnNpb24tcGFuZWwtaGVhZGVyLS1tb3VzZWRvd24nOiB0aGlzLmhhc01vdXNlZG93bixcbiAgICAgIH1cbiAgICB9LFxuICAgIGlzQWN0aXZlICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLmV4cGFuc2lvblBhbmVsLmlzQWN0aXZlXG4gICAgfSxcbiAgICBpc0Rpc2FibGVkICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLmV4cGFuc2lvblBhbmVsLmlzRGlzYWJsZWRcbiAgICB9LFxuICAgIGlzUmVhZG9ubHkgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMuZXhwYW5zaW9uUGFuZWwuaXNSZWFkb25seVxuICAgIH0sXG4gIH0sXG5cbiAgY3JlYXRlZCAoKSB7XG4gICAgdGhpcy5leHBhbnNpb25QYW5lbC5yZWdpc3RlckhlYWRlcih0aGlzKVxuICB9LFxuXG4gIGJlZm9yZURlc3Ryb3kgKCkge1xuICAgIHRoaXMuZXhwYW5zaW9uUGFuZWwudW5yZWdpc3RlckhlYWRlcigpXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIG9uQ2xpY2sgKGU6IE1vdXNlRXZlbnQpIHtcbiAgICAgIHRoaXMuJGVtaXQoJ2NsaWNrJywgZSlcbiAgICB9LFxuICAgIGdlbkljb24gKCkge1xuICAgICAgY29uc3QgaWNvbiA9IGdldFNsb3QodGhpcywgJ2FjdGlvbnMnKSB8fFxuICAgICAgICBbdGhpcy4kY3JlYXRlRWxlbWVudChWSWNvbiwgdGhpcy5leHBhbmRJY29uKV1cblxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkZhZGVUcmFuc2l0aW9uLCBbXG4gICAgICAgIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgICAgICBzdGF0aWNDbGFzczogJ3YtZXhwYW5zaW9uLXBhbmVsLWhlYWRlcl9faWNvbicsXG4gICAgICAgICAgY2xhc3M6IHtcbiAgICAgICAgICAgICd2LWV4cGFuc2lvbi1wYW5lbC1oZWFkZXJfX2ljb24tLWRpc2FibGUtcm90YXRlJzogdGhpcy5kaXNhYmxlSWNvblJvdGF0ZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRpcmVjdGl2ZXM6IFt7XG4gICAgICAgICAgICBuYW1lOiAnc2hvdycsXG4gICAgICAgICAgICB2YWx1ZTogIXRoaXMuaXNEaXNhYmxlZCxcbiAgICAgICAgICB9XSxcbiAgICAgICAgfSwgaWNvbiksXG4gICAgICBdKVxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyIChoKTogVk5vZGUge1xuICAgIHJldHVybiBoKCdidXR0b24nLCB0aGlzLnNldEJhY2tncm91bmRDb2xvcih0aGlzLmNvbG9yLCB7XG4gICAgICBzdGF0aWNDbGFzczogJ3YtZXhwYW5zaW9uLXBhbmVsLWhlYWRlcicsXG4gICAgICBjbGFzczogdGhpcy5jbGFzc2VzLFxuICAgICAgYXR0cnM6IHtcbiAgICAgICAgdGFiaW5kZXg6IHRoaXMuaXNEaXNhYmxlZCA/IC0xIDogbnVsbCxcbiAgICAgICAgdHlwZTogJ2J1dHRvbicsXG4gICAgICB9LFxuICAgICAgZGlyZWN0aXZlczogW3tcbiAgICAgICAgbmFtZTogJ3JpcHBsZScsXG4gICAgICAgIHZhbHVlOiB0aGlzLnJpcHBsZSxcbiAgICAgIH1dLFxuICAgICAgb246IHtcbiAgICAgICAgLi4udGhpcy4kbGlzdGVuZXJzLFxuICAgICAgICBjbGljazogdGhpcy5vbkNsaWNrLFxuICAgICAgICBtb3VzZWRvd246ICgpID0+ICh0aGlzLmhhc01vdXNlZG93biA9IHRydWUpLFxuICAgICAgICBtb3VzZXVwOiAoKSA9PiAodGhpcy5oYXNNb3VzZWRvd24gPSBmYWxzZSksXG4gICAgICB9LFxuICAgIH0pLCBbXG4gICAgICBnZXRTbG90KHRoaXMsICdkZWZhdWx0JywgeyBvcGVuOiB0aGlzLmlzQWN0aXZlIH0sIHRydWUpLFxuICAgICAgdGhpcy5oaWRlQWN0aW9ucyB8fCB0aGlzLmdlbkljb24oKSxcbiAgICBdKVxuICB9LFxufSlcbiJdfQ==