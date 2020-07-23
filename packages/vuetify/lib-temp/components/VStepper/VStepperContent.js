// Components
import { VTabTransition, VTabReverseTransition, } from '../transitions';
// Mixins
import { inject as RegistrableInject } from '../../mixins/registrable';
// Helpers
import { convertToUnit } from '../../util/helpers';
// Utilities
import mixins from '../../util/mixins';
const baseMixins = mixins(RegistrableInject('stepper', 'v-stepper-content', 'v-stepper'));
/* @vue/component */
export default baseMixins.extend().extend({
    name: 'v-stepper-content',
    inject: {
        isVerticalProvided: {
            from: 'isVertical',
        },
    },
    props: {
        step: {
            type: [Number, String],
            required: true,
        },
    },
    data() {
        return {
            height: 0,
            // Must be null to allow
            // previous comparison
            isActive: null,
            isReverse: false,
            isVertical: this.isVerticalProvided,
        };
    },
    computed: {
        computedTransition() {
            // Fix for #8978
            const reverse = this.$vuetify.rtl ? !this.isReverse : this.isReverse;
            return reverse
                ? VTabReverseTransition
                : VTabTransition;
        },
        styles() {
            if (!this.isVertical)
                return {};
            return {
                height: convertToUnit(this.height),
            };
        },
    },
    watch: {
        isActive(current, previous) {
            // If active and the previous state
            // was null, is just booting up
            if (current && previous == null) {
                this.height = 'auto';
                return;
            }
            if (!this.isVertical)
                return;
            if (this.isActive)
                this.enter();
            else
                this.leave();
        },
    },
    mounted() {
        this.$refs.wrapper.addEventListener('transitionend', this.onTransition, false);
        this.stepper && this.stepper.register(this);
    },
    beforeDestroy() {
        this.$refs.wrapper.removeEventListener('transitionend', this.onTransition, false);
        this.stepper && this.stepper.unregister(this);
    },
    methods: {
        onTransition(e) {
            if (!this.isActive ||
                e.propertyName !== 'height')
                return;
            this.height = 'auto';
        },
        enter() {
            let scrollHeight = 0;
            // Render bug with height
            requestAnimationFrame(() => {
                scrollHeight = this.$refs.wrapper.scrollHeight;
            });
            this.height = 0;
            // Give the collapsing element time to collapse
            setTimeout(() => this.isActive && (this.height = (scrollHeight || 'auto')), 450);
        },
        leave() {
            this.height = this.$refs.wrapper.clientHeight;
            setTimeout(() => (this.height = 0), 10);
        },
        toggle(step, reverse) {
            this.isActive = step.toString() === this.step.toString();
            this.isReverse = reverse;
        },
    },
    render(h) {
        const contentData = {
            staticClass: 'v-stepper__content',
        };
        const wrapperData = {
            staticClass: 'v-stepper__wrapper',
            style: this.styles,
            ref: 'wrapper',
        };
        if (!this.isVertical) {
            contentData.directives = [{
                    name: 'show',
                    value: this.isActive,
                }];
        }
        const wrapper = h('div', wrapperData, [this.$slots.default]);
        const content = h('div', contentData, [wrapper]);
        return h(this.computedTransition, {
            on: this.$listeners,
        }, [content]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlN0ZXBwZXJDb250ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVlN0ZXBwZXIvVlN0ZXBwZXJDb250ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGFBQWE7QUFDYixPQUFPLEVBQ0wsY0FBYyxFQUNkLHFCQUFxQixHQUN0QixNQUFNLGdCQUFnQixDQUFBO0FBRXZCLFNBQVM7QUFDVCxPQUFPLEVBQUUsTUFBTSxJQUFJLGlCQUFpQixFQUFFLE1BQU0sMEJBQTBCLENBQUE7QUFFdEUsVUFBVTtBQUNWLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUVsRCxZQUFZO0FBQ1osT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFLdEMsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUN2QixpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsbUJBQW1CLEVBQUUsV0FBVyxDQUFDLENBQy9ELENBQUE7QUFTRCxvQkFBb0I7QUFDcEIsZUFBZSxVQUFVLENBQUMsTUFBTSxFQUFXLENBQUMsTUFBTSxDQUFDO0lBQ2pELElBQUksRUFBRSxtQkFBbUI7SUFFekIsTUFBTSxFQUFFO1FBQ04sa0JBQWtCLEVBQUU7WUFDbEIsSUFBSSxFQUFFLFlBQVk7U0FDbkI7S0FDRjtJQUVELEtBQUssRUFBRTtRQUNMLElBQUksRUFBRTtZQUNKLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsUUFBUSxFQUFFLElBQUk7U0FDZjtLQUNGO0lBRUQsSUFBSTtRQUNGLE9BQU87WUFDTCxNQUFNLEVBQUUsQ0FBb0I7WUFDNUIsd0JBQXdCO1lBQ3hCLHNCQUFzQjtZQUN0QixRQUFRLEVBQUUsSUFBc0I7WUFDaEMsU0FBUyxFQUFFLEtBQUs7WUFDaEIsVUFBVSxFQUFFLElBQUksQ0FBQyxrQkFBa0I7U0FDcEMsQ0FBQTtJQUNILENBQUM7SUFFRCxRQUFRLEVBQUU7UUFDUixrQkFBa0I7WUFD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Q0FBQyxRQUFRLEVBQUUsQ0FBQTtZQUN4RCxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQTtRQUMxQixDQUFDO0tBQ0Y7SUFFRCxNQUFNLENBQUUsQ0FBQztRQUNQLE1BQU0sV0FBVyxHQUFHO1lBQ2xCLFdBQVcsRUFBRSxvQkFBb0I7U0FDckIsQ0FBQTtRQUNkLE1BQU0sV0FBVyxHQUFHO1lBQ2xCLFdBQVcsRUFBRSxvQkFBb0I7WUFDakMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNO1lBQ2xCLEdBQUcsRUFBRSxTQUFTO1NBQ2YsQ0FBQTtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ3BCLFdBQVcsQ0FBQyxVQUFVLEdBQUcsQ0FBQztvQkFDeEIsSUFBSSxFQUFFLE1BQU07b0JBQ1osS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRO2lCQUNyQixDQUFDLENBQUE7U0FDSDtRQUVELE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO1FBQzVELE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtRQUVoRCxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUU7WUFDaEMsRUFBRSxFQUFFLElBQUksQ0FBQyxVQUFVO1NBQ3BCLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0lBQ2YsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvbXBvbmVudHNcbmltcG9ydCB7XG4gIFZUYWJUcmFuc2l0aW9uLFxuICBWVGFiUmV2ZXJzZVRyYW5zaXRpb24sXG59IGZyb20gJy4uL3RyYW5zaXRpb25zJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCB7IGluamVjdCBhcyBSZWdpc3RyYWJsZUluamVjdCB9IGZyb20gJy4uLy4uL21peGlucy9yZWdpc3RyYWJsZSdcblxuLy8gSGVscGVyc1xuaW1wb3J0IHsgY29udmVydFRvVW5pdCB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgVk5vZGUsIEZ1bmN0aW9uYWxDb21wb25lbnRPcHRpb25zLCBWTm9kZURhdGEgfSBmcm9tICd2dWUnXG5cbmNvbnN0IGJhc2VNaXhpbnMgPSBtaXhpbnMoXG4gIFJlZ2lzdHJhYmxlSW5qZWN0KCdzdGVwcGVyJywgJ3Ytc3RlcHBlci1jb250ZW50JywgJ3Ytc3RlcHBlcicpXG4pXG5cbmludGVyZmFjZSBvcHRpb25zIGV4dGVuZHMgSW5zdGFuY2VUeXBlPHR5cGVvZiBiYXNlTWl4aW5zPiB7XG4gICRyZWZzOiB7XG4gICAgd3JhcHBlcjogSFRNTEVsZW1lbnRcbiAgfVxuICBpc1ZlcnRpY2FsUHJvdmlkZWQ6IGJvb2xlYW5cbn1cblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IGJhc2VNaXhpbnMuZXh0ZW5kPG9wdGlvbnM+KCkuZXh0ZW5kKHtcbiAgbmFtZTogJ3Ytc3RlcHBlci1jb250ZW50JyxcblxuICBpbmplY3Q6IHtcbiAgICBpc1ZlcnRpY2FsUHJvdmlkZWQ6IHtcbiAgICAgIGZyb206ICdpc1ZlcnRpY2FsJyxcbiAgICB9LFxuICB9LFxuXG4gIHByb3BzOiB7XG4gICAgc3RlcDoge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgIH0sXG4gIH0sXG5cbiAgZGF0YSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhlaWdodDogMCBhcyBudW1iZXIgfCBzdHJpbmcsXG4gICAgICAvLyBNdXN0IGJlIG51bGwgdG8gYWxsb3dcbiAgICAgIC8vIHByZXZpb3VzIGNvbXBhcmlzb25cbiAgICAgIGlzQWN0aXZlOiBudWxsIGFzIGJvb2xlYW4gfCBudWxsLFxuICAgICAgaXNSZXZlcnNlOiBmYWxzZSxcbiAgICAgIGlzVmVydGljYWw6IHRoaXMuaXNWZXJ0aWNhbFByb3ZpZGVkLFxuICAgIH1cbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGNvbXB1dGVkVHJhbnNpdGlvbiAoKTogRnVuY3Rpb25hbENvbXBvbmVudE9wdGlvbnMge1xuICAgICAgLy8gRml4IGZvciAjODk3OFxuICAgICAgY29uc3QgcmV2ZXJzZSA9IHRoaXMuJHZ1ZXRpZnkucnRsID8gIXRoaXMuaXNSZXZlcnNlIDogdGhpcy5pc1JldmVyc2VcblxuICAgICAgcmV0dXJuIHJldmVyc2VcbiAgICAgICAgPyBWVGFiUmV2ZXJzZVRyYW5zaXRpb25cbiAgICAgICAgOiBWVGFiVHJhbnNpdGlvblxuICAgIH0sXG4gICAgc3R5bGVzICgpOiBvYmplY3Qge1xuICAgICAgaWYgKCF0aGlzLmlzVmVydGljYWwpIHJldHVybiB7fVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBoZWlnaHQ6IGNvbnZlcnRUb1VuaXQodGhpcy5oZWlnaHQpLFxuICAgICAgfVxuICAgIH0sXG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICBpc0FjdGl2ZSAoY3VycmVudCwgcHJldmlvdXMpIHtcbiAgICAgIC8vIElmIGFjdGl2ZSBhbmQgdGhlIHByZXZpb3VzIHN0YXRlXG4gICAgICAvLyB3YXMgbnVsbCwgaXMganVzdCBib290aW5nIHVwXG4gICAgICBpZiAoY3VycmVudCAmJiBwcmV2aW91cyA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gJ2F1dG8nXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuaXNWZXJ0aWNhbCkgcmV0dXJuXG5cbiAgICAgIGlmICh0aGlzLmlzQWN0aXZlKSB0aGlzLmVudGVyKClcbiAgICAgIGVsc2UgdGhpcy5sZWF2ZSgpXG4gICAgfSxcbiAgfSxcblxuICBtb3VudGVkICgpIHtcbiAgICB0aGlzLiRyZWZzLndyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICd0cmFuc2l0aW9uZW5kJyxcbiAgICAgIHRoaXMub25UcmFuc2l0aW9uLFxuICAgICAgZmFsc2VcbiAgICApXG4gICAgdGhpcy5zdGVwcGVyICYmIHRoaXMuc3RlcHBlci5yZWdpc3Rlcih0aGlzKVxuICB9LFxuXG4gIGJlZm9yZURlc3Ryb3kgKCkge1xuICAgIHRoaXMuJHJlZnMud3JhcHBlci5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgJ3RyYW5zaXRpb25lbmQnLFxuICAgICAgdGhpcy5vblRyYW5zaXRpb24sXG4gICAgICBmYWxzZVxuICAgIClcbiAgICB0aGlzLnN0ZXBwZXIgJiYgdGhpcy5zdGVwcGVyLnVucmVnaXN0ZXIodGhpcylcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgb25UcmFuc2l0aW9uIChlOiBUcmFuc2l0aW9uRXZlbnQpIHtcbiAgICAgIGlmICghdGhpcy5pc0FjdGl2ZSB8fFxuICAgICAgICBlLnByb3BlcnR5TmFtZSAhPT0gJ2hlaWdodCdcbiAgICAgICkgcmV0dXJuXG5cbiAgICAgIHRoaXMuaGVpZ2h0ID0gJ2F1dG8nXG4gICAgfSxcbiAgICBlbnRlciAoKSB7XG4gICAgICBsZXQgc2Nyb2xsSGVpZ2h0ID0gMFxuXG4gICAgICAvLyBSZW5kZXIgYnVnIHdpdGggaGVpZ2h0XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICBzY3JvbGxIZWlnaHQgPSB0aGlzLiRyZWZzLndyYXBwZXIuc2Nyb2xsSGVpZ2h0XG4gICAgICB9KVxuXG4gICAgICB0aGlzLmhlaWdodCA9IDBcblxuICAgICAgLy8gR2l2ZSB0aGUgY29sbGFwc2luZyBlbGVtZW50IHRpbWUgdG8gY29sbGFwc2VcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5pc0FjdGl2ZSAmJiAodGhpcy5oZWlnaHQgPSAoc2Nyb2xsSGVpZ2h0IHx8ICdhdXRvJykpLCA0NTApXG4gICAgfSxcbiAgICBsZWF2ZSAoKSB7XG4gICAgICB0aGlzLmhlaWdodCA9IHRoaXMuJHJlZnMud3JhcHBlci5jbGllbnRIZWlnaHRcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gKHRoaXMuaGVpZ2h0ID0gMCksIDEwKVxuICAgIH0sXG4gICAgdG9nZ2xlIChzdGVwOiBzdHJpbmcgfCBudW1iZXIsIHJldmVyc2U6IGJvb2xlYW4pIHtcbiAgICAgIHRoaXMuaXNBY3RpdmUgPSBzdGVwLnRvU3RyaW5nKCkgPT09IHRoaXMuc3RlcC50b1N0cmluZygpXG4gICAgICB0aGlzLmlzUmV2ZXJzZSA9IHJldmVyc2VcbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcbiAgICBjb25zdCBjb250ZW50RGF0YSA9IHtcbiAgICAgIHN0YXRpY0NsYXNzOiAndi1zdGVwcGVyX19jb250ZW50JyxcbiAgICB9IGFzIFZOb2RlRGF0YVxuICAgIGNvbnN0IHdyYXBwZXJEYXRhID0ge1xuICAgICAgc3RhdGljQ2xhc3M6ICd2LXN0ZXBwZXJfX3dyYXBwZXInLFxuICAgICAgc3R5bGU6IHRoaXMuc3R5bGVzLFxuICAgICAgcmVmOiAnd3JhcHBlcicsXG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmlzVmVydGljYWwpIHtcbiAgICAgIGNvbnRlbnREYXRhLmRpcmVjdGl2ZXMgPSBbe1xuICAgICAgICBuYW1lOiAnc2hvdycsXG4gICAgICAgIHZhbHVlOiB0aGlzLmlzQWN0aXZlLFxuICAgICAgfV1cbiAgICB9XG5cbiAgICBjb25zdCB3cmFwcGVyID0gaCgnZGl2Jywgd3JhcHBlckRhdGEsIFt0aGlzLiRzbG90cy5kZWZhdWx0XSlcbiAgICBjb25zdCBjb250ZW50ID0gaCgnZGl2JywgY29udGVudERhdGEsIFt3cmFwcGVyXSlcblxuICAgIHJldHVybiBoKHRoaXMuY29tcHV0ZWRUcmFuc2l0aW9uLCB7XG4gICAgICBvbjogdGhpcy4kbGlzdGVuZXJzLFxuICAgIH0sIFtjb250ZW50XSlcbiAgfSxcbn0pXG4iXX0=