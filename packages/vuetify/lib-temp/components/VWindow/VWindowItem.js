// Mixins
import Bootable from '../../mixins/bootable';
import { factory as GroupableFactory } from '../../mixins/groupable';
// Directives
import Touch from '../../directives/touch';
// Utilities
import { convertToUnit } from '../../util/helpers';
import mixins from '../../util/mixins';
const baseMixins = mixins(Bootable, GroupableFactory('windowGroup', 'v-window-item', 'v-window'));
export default baseMixins.extend().extend(
/* @vue/component */
).extend({
    name: 'v-window-item',
    directives: {
        Touch,
    },
    props: {
        disabled: Boolean,
        reverseTransition: {
            type: [Boolean, String],
            default: undefined,
        },
        transition: {
            type: [Boolean, String],
            default: undefined,
        },
        value: {
            required: false,
        },
    },
    data() {
        return {
            isActive: false,
            inTransition: false,
        };
    },
    computed: {
        classes() {
            return this.groupClasses;
        },
        computedTransition() {
            if (!this.windowGroup.internalReverse) {
                return typeof this.transition !== 'undefined'
                    ? this.transition || ''
                    : this.windowGroup.computedTransition;
            }
            return typeof this.reverseTransition !== 'undefined'
                ? this.reverseTransition || ''
                : this.windowGroup.computedTransition;
        },
    },
    methods: {
        genDefaultSlot() {
            return this.$slots.default;
        },
        genWindowItem() {
            return this.$createElement('div', {
                staticClass: 'v-window-item',
                class: this.classes,
                directives: [{
                        name: 'show',
                        value: this.isActive,
                    }],
                on: this.$listeners,
            }, this.genDefaultSlot());
        },
        onAfterTransition() {
            if (!this.inTransition) {
                return;
            }
            // Finalize transition state.
            this.inTransition = false;
            if (this.windowGroup.transitionCount > 0) {
                this.windowGroup.transitionCount--;
                // Remove container height if we are out of transition.
                if (this.windowGroup.transitionCount === 0) {
                    this.windowGroup.transitionHeight = undefined;
                }
            }
        },
        onBeforeTransition() {
            if (this.inTransition) {
                return;
            }
            // Initialize transition state here.
            this.inTransition = true;
            if (this.windowGroup.transitionCount === 0) {
                // Set initial height for height transition.
                this.windowGroup.transitionHeight = convertToUnit(this.windowGroup.$el.clientHeight);
            }
            this.windowGroup.transitionCount++;
        },
        onTransitionCancelled() {
            this.onAfterTransition(); // This should have the same path as normal transition end.
        },
        onEnter(el) {
            if (!this.inTransition) {
                return;
            }
            this.$nextTick(() => {
                // Do not set height if no transition or cancelled.
                if (!this.computedTransition || !this.inTransition) {
                    return;
                }
                // Set transition target height.
                this.windowGroup.transitionHeight = convertToUnit(el.clientHeight);
            });
        },
    },
    render(h) {
        return h('transition', {
            props: {
                name: this.computedTransition,
            },
            on: {
                // Handlers for enter windows.
                beforeEnter: this.onBeforeTransition,
                afterEnter: this.onAfterTransition,
                enterCancelled: this.onTransitionCancelled,
                // Handlers for leave windows.
                beforeLeave: this.onBeforeTransition,
                afterLeave: this.onAfterTransition,
                leaveCancelled: this.onTransitionCancelled,
                // Enter handler for height transition.
                enter: this.onEnter,
            },
        }, this.showLazyContent(() => [this.genWindowItem()]));
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVldpbmRvd0l0ZW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WV2luZG93L1ZXaW5kb3dJdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBLFNBQVM7QUFDVCxPQUFPLFFBQVEsTUFBTSx1QkFBdUIsQ0FBQTtBQUM1QyxPQUFPLEVBQUUsT0FBTyxJQUFJLGdCQUFnQixFQUFFLE1BQU0sd0JBQXdCLENBQUE7QUFFcEUsYUFBYTtBQUNiLE9BQU8sS0FBSyxNQUFNLHdCQUF3QixDQUFBO0FBRTFDLFlBQVk7QUFDWixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFDbEQsT0FBTyxNQUFzQixNQUFNLG1CQUFtQixDQUFBO0FBS3RELE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FDdkIsUUFBUSxFQUNSLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxlQUFlLEVBQUUsVUFBVSxDQUFDLENBQzdELENBQUE7QUFPRCxlQUFlLFVBQVUsQ0FBQyxNQUFNLEVBQVcsQ0FBQyxNQUFNO0FBQ2hELG9CQUFvQjtDQUNyQixDQUFDLE1BQU0sQ0FBQztJQUNQLElBQUksRUFBRSxlQUFlO0lBRXJCLFVBQVUsRUFBRTtRQUNWLEtBQUs7S0FDTjtJQUVELEtBQUssRUFBRTtRQUNMLFFBQVEsRUFBRSxPQUFPO1FBQ2pCLGlCQUFpQixFQUFFO1lBQ2pCLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUM7WUFDdkIsT0FBTyxFQUFFLFNBQVM7U0FDbkI7UUFDRCxVQUFVLEVBQUU7WUFDVixJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDO1lBQ3ZCLE9BQU8sRUFBRSxTQUFTO1NBQ25CO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsUUFBUSxFQUFFLEtBQUs7U0FDaEI7S0FDRjtJQUVELElBQUk7UUFDRixPQUFPO1lBQ0wsUUFBUSxFQUFFLEtBQUs7WUFDZixZQUFZLEVBQUUsS0FBSztTQUNwQixD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QTtZQUNwRSxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUM7S0FDRjtJQUVELE1BQU0sQ0FBRSxDQUFDO1FBQ1AsT0FBTyxDQUFDLENBQUMsWUFBWSxFQUFFO1lBQ3JCLEtBQUssRUFBRTtnQkFDTCxJQUFJLEVBQUUsSUFBSSxDQUFDLGtCQUFrQjthQUM5QjtZQUNELEVBQUUsRUFBRTtnQkFDRiw4QkFBOEI7Z0JBQzlCLFdBQVcsRUFBRSxJQUFJLENBQUMsa0JBQWtCO2dCQUNwQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGlCQUFpQjtnQkFDbEMsY0FBYyxFQUFFLElBQUksQ0FBQyxxQkFBcUI7Z0JBRTFDLDhCQUE4QjtnQkFDOUIsV0FBVyxFQUFFLElBQUksQ0FBQyxrQkFBa0I7Z0JBQ3BDLFVBQVUsRUFBRSxJQUFJLENBQUMsaUJBQWlCO2dCQUNsQyxjQUFjLEVBQUUsSUFBSSxDQUFDLHFCQUFxQjtnQkFFMUMsdUNBQXVDO2dCQUN2QyxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU87YUFDcEI7U0FDRixFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDeEQsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvbXBvbmVudHNcbmltcG9ydCBWV2luZG93IGZyb20gJy4vVldpbmRvdydcblxuLy8gTWl4aW5zXG5pbXBvcnQgQm9vdGFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2Jvb3RhYmxlJ1xuaW1wb3J0IHsgZmFjdG9yeSBhcyBHcm91cGFibGVGYWN0b3J5IH0gZnJvbSAnLi4vLi4vbWl4aW5zL2dyb3VwYWJsZSdcblxuLy8gRGlyZWN0aXZlc1xuaW1wb3J0IFRvdWNoIGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvdG91Y2gnXG5cbi8vIFV0aWxpdGllc1xuaW1wb3J0IHsgY29udmVydFRvVW5pdCB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcbmltcG9ydCBtaXhpbnMsIHsgRXh0cmFjdFZ1ZSB9IGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgVk5vZGUgfSBmcm9tICd2dWUnXG5cbmNvbnN0IGJhc2VNaXhpbnMgPSBtaXhpbnMoXG4gIEJvb3RhYmxlLFxuICBHcm91cGFibGVGYWN0b3J5KCd3aW5kb3dHcm91cCcsICd2LXdpbmRvdy1pdGVtJywgJ3Ytd2luZG93JylcbilcblxuaW50ZXJmYWNlIG9wdGlvbnMgZXh0ZW5kcyBFeHRyYWN0VnVlPHR5cGVvZiBiYXNlTWl4aW5zPiB7XG4gICRlbDogSFRNTEVsZW1lbnRcbiAgd2luZG93R3JvdXA6IEluc3RhbmNlVHlwZTx0eXBlb2YgVldpbmRvdz5cbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZU1peGlucy5leHRlbmQ8b3B0aW9ucz4oKS5leHRlbmQoXG4gIC8qIEB2dWUvY29tcG9uZW50ICovXG4pLmV4dGVuZCh7XG4gIG5hbWU6ICd2LXdpbmRvdy1pdGVtJyxcblxuICBkaXJlY3RpdmVzOiB7XG4gICAgVG91Y2gsXG4gIH0sXG5cbiAgcHJvcHM6IHtcbiAgICBkaXNhYmxlZDogQm9vbGVhbixcbiAgICByZXZlcnNlVHJhbnNpdGlvbjoge1xuICAgICAgdHlwZTogW0Jvb2xlYW4sIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgfSxcbiAgICB0cmFuc2l0aW9uOiB7XG4gICAgICB0eXBlOiBbQm9vbGVhbiwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICB9LFxuICAgIHZhbHVlOiB7XG4gICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgfSxcbiAgfSxcblxuICBkYXRhICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaXNBY3RpdmU6IGZhbHNlLFxuICAgICAgaW5UcmFuc2l0aW9uOiBmYWxzZSxcbiAgICB9XG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBjbGFzc2VzICgpOiBvYmplY3Qge1xuICAgICAgcmV0dXJuIHRoaXMuZ3JvdXBDbGFzc2VzXG4gICAgfSxcbiAgICBjb21wdXRlZFRyYW5zaXRpb24gKCk6IHN0cmluZyB8IGJvb2xlYW4ge1xuICAgICAgaWYgKCF0aGlzLndpbmRvd0dyb3VwLmludGVybmFsUmV2ZXJzZSkge1xuICAgICAgICByZXR1cm4gdHlwZW9mIHRoaXMudHJhbnNpdGlvbiAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICA/IHRoaXMudHJhbnNpdGlvbiB8fCAnJ1xuICAgICAgICAgIDogdGhpcy53aW5kb3dHcm91cC5jb21wdXRlZFRyYW5zaXRpb25cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHR5cGVvZiB0aGlzLnJldmVyc2VUcmFuc2l0aW9uICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICA/IHRoaXMucmV2ZXJzZVRyYW5zaXRpb24gfHwgJydcbiAgICAgICAgOiB0aGlzLndpbmRvd0dyb3VwLmNvbXB1dGVkVHJhbnNpdGlvblxuICAgIH0sXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGdlbkRlZmF1bHRTbG90ICgpIHtcbiAgICAgIHJldHVybiB0aGlzLiRzbG90cy5kZWZhdWx0XG4gICAgfSxcbiAgICBnZW5XaW5kb3dJdGVtICgpIHtcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi13aW5kb3ctaXRlbScsXG4gICAgICAgIGNsYXNzOiB0aGlzLmNsYXNzZXMsXG4gICAgICAgIGRpcmVjdGl2ZXM6IFt7XG4gICAgICAgICAgbmFtZTogJ3Nob3cnLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLmlzQWN0aXZlLFxuICAgICAgICB9XSxcbiAgICAgICAgb246IHRoaXMuJGxpc3RlbmVycyxcbiAgICAgIH0sIHRoaXMuZ2VuRGVmYXVsdFNsb3QoKSlcbiAgICB9LFxuICAgIG9uQWZ0ZXJUcmFuc2l0aW9uICgpIHtcbiAgICAgIGlmICghdGhpcy5pblRyYW5zaXRpb24pIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIC8vIEZpbmFsaXplIHRyYW5zaXRpb24gc3RhdGUuXG4gICAgICB0aGlzLmluVHJhbnNpdGlvbiA9IGZhbHNlXG4gICAgICBpZiAodGhpcy53aW5kb3dHcm91cC50cmFuc2l0aW9uQ291bnQgPiAwKSB7XG4gICAgICAgIHRoaXMud2luZG93R3JvdXAudHJhbnNpdGlvbkNvdW50LS1cblxuICAgICAgICAvLyBSZW1vdmUgY29udGFpbmVyIGhlaWdodCBpZiB3ZSBhcmUgb3V0IG9mIHRyYW5zaXRpb24uXG4gICAgICAgIGlmICh0aGlzLndpbmRvd0dyb3VwLnRyYW5zaXRpb25Db3VudCA9PT0gMCkge1xuICAgICAgICAgIHRoaXMud2luZG93R3JvdXAudHJhbnNpdGlvbkhlaWdodCA9IHVuZGVmaW5lZFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBvbkJlZm9yZVRyYW5zaXRpb24gKCkge1xuICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICAvLyBJbml0aWFsaXplIHRyYW5zaXRpb24gc3RhdGUgaGVyZS5cbiAgICAgIHRoaXMuaW5UcmFuc2l0aW9uID0gdHJ1ZVxuICAgICAgaWYgKHRoaXMud2luZG93R3JvdXAudHJhbnNpdGlvbkNvdW50ID09PSAwKSB7XG4gICAgICAgIC8vIFNldCBpbml0aWFsIGhlaWdodCBmb3IgaGVpZ2h0IHRyYW5zaXRpb24uXG4gICAgICAgIHRoaXMud2luZG93R3JvdXAudHJhbnNpdGlvbkhlaWdodCA9IGNvbnZlcnRUb1VuaXQodGhpcy53aW5kb3dHcm91cC4kZWwuY2xpZW50SGVpZ2h0KVxuICAgICAgfVxuICAgICAgdGhpcy53aW5kb3dHcm91cC50cmFuc2l0aW9uQ291bnQrK1xuICAgIH0sXG4gICAgb25UcmFuc2l0aW9uQ2FuY2VsbGVkICgpIHtcbiAgICAgIHRoaXMub25BZnRlclRyYW5zaXRpb24oKSAvLyBUaGlzIHNob3VsZCBoYXZlIHRoZSBzYW1lIHBhdGggYXMgbm9ybWFsIHRyYW5zaXRpb24gZW5kLlxuICAgIH0sXG4gICAgb25FbnRlciAoZWw6IEhUTUxFbGVtZW50KSB7XG4gICAgICBpZiAoIXRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XG4gICAgICAgIC8vIERvIG5vdCBzZXQgaGVpZ2h0IGlmIG5vIHRyYW5zaXRpb24gb3IgY2FuY2VsbGVkLlxuICAgICAgICBpZiAoIXRoaXMuY29tcHV0ZWRUcmFuc2l0aW9uIHx8ICF0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2V0IHRyYW5zaXRpb24gdGFyZ2V0IGhlaWdodC5cbiAgICAgICAgdGhpcy53aW5kb3dHcm91cC50cmFuc2l0aW9uSGVpZ2h0ID0gY29udmVydFRvVW5pdChlbC5jbGllbnRIZWlnaHQpXG4gICAgICB9KVxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyIChoKTogVk5vZGUge1xuICAgIHJldHVybiBoKCd0cmFuc2l0aW9uJywge1xuICAgICAgcHJvcHM6IHtcbiAgICAgICAgbmFtZTogdGhpcy5jb21wdXRlZFRyYW5zaXRpb24sXG4gICAgICB9LFxuICAgICAgb246IHtcbiAgICAgICAgLy8gSGFuZGxlcnMgZm9yIGVudGVyIHdpbmRvd3MuXG4gICAgICAgIGJlZm9yZUVudGVyOiB0aGlzLm9uQmVmb3JlVHJhbnNpdGlvbixcbiAgICAgICAgYWZ0ZXJFbnRlcjogdGhpcy5vbkFmdGVyVHJhbnNpdGlvbixcbiAgICAgICAgZW50ZXJDYW5jZWxsZWQ6IHRoaXMub25UcmFuc2l0aW9uQ2FuY2VsbGVkLFxuXG4gICAgICAgIC8vIEhhbmRsZXJzIGZvciBsZWF2ZSB3aW5kb3dzLlxuICAgICAgICBiZWZvcmVMZWF2ZTogdGhpcy5vbkJlZm9yZVRyYW5zaXRpb24sXG4gICAgICAgIGFmdGVyTGVhdmU6IHRoaXMub25BZnRlclRyYW5zaXRpb24sXG4gICAgICAgIGxlYXZlQ2FuY2VsbGVkOiB0aGlzLm9uVHJhbnNpdGlvbkNhbmNlbGxlZCxcblxuICAgICAgICAvLyBFbnRlciBoYW5kbGVyIGZvciBoZWlnaHQgdHJhbnNpdGlvbi5cbiAgICAgICAgZW50ZXI6IHRoaXMub25FbnRlcixcbiAgICAgIH0sXG4gICAgfSwgdGhpcy5zaG93TGF6eUNvbnRlbnQoKCkgPT4gW3RoaXMuZ2VuV2luZG93SXRlbSgpXSkpXG4gIH0sXG59KVxuIl19