import { VExpandTransition } from '../transitions';
// Mixins
import Bootable from '../../mixins/bootable';
import Colorable from '../../mixins/colorable';
import { inject as RegistrableInject } from '../../mixins/registrable';
// Utilities
import { getSlot } from '../../util/helpers';
import mixins from '../../util/mixins';
const baseMixins = mixins(Bootable, Colorable, RegistrableInject('expansionPanel', 'v-expansion-panel-content', 'v-expansion-panel'));
/* @vue/component */
export default baseMixins.extend().extend({
    name: 'v-expansion-panel-content',
    computed: {
        isActive() {
            return this.expansionPanel.isActive;
        },
    },
    created() {
        this.expansionPanel.registerContent(this);
    },
    beforeDestroy() {
        this.expansionPanel.unregisterContent();
    },
    render(h) {
        return h(VExpandTransition, this.showLazyContent(() => [
            h('div', this.setBackgroundColor(this.color, {
                staticClass: 'v-expansion-panel-content',
                directives: [{
                        name: 'show',
                        value: this.isActive,
                    }],
            }), [
                h('div', { class: 'v-expansion-panel-content__wrap' }, getSlot(this)),
            ]),
        ]));
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkV4cGFuc2lvblBhbmVsQ29udGVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZFeHBhbnNpb25QYW5lbC9WRXhwYW5zaW9uUGFuZWxDb250ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFBO0FBRWxELFNBQVM7QUFDVCxPQUFPLFFBQVEsTUFBTSx1QkFBdUIsQ0FBQTtBQUM1QyxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLEVBQUUsTUFBTSxJQUFJLGlCQUFpQixFQUFFLE1BQU0sMEJBQTBCLENBQUE7QUFFdEUsWUFBWTtBQUNaLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUM1QyxPQUFPLE1BQXNCLE1BQU0sbUJBQW1CLENBQUE7QUFLdEQsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUN2QixRQUFRLEVBQ1IsU0FBUyxFQUNULGlCQUFpQixDQUF3QyxnQkFBZ0IsRUFBRSwyQkFBMkIsRUFBRSxtQkFBbUIsQ0FBQyxDQUM3SCxDQUFBO0FBTUQsb0JBQW9CO0FBQ3BCLGVBQWUsVUFBVSxDQUFDLE1BQU0sRUFBVyxDQUFDLE1BQU0sQ0FBQztJQUNqRCxJQUFJLEVBQUUsMkJBQTJCO0lBRWpDLFFBQVEsRUFBRTtRQUNSLFFBQVE7WUFDTixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFBO1FBQ3JDLENBQUM7S0FDRjtJQUVELE9BQU87UUFDTCxJQUFJLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUMzQyxDQUFDO0lBRUQsYUFBYTtRQUNYLElBQUksQ0FBQyxjQUFjLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtJQUN6QyxDQUFDO0lBRUQsTUFBTSxDQUFFLENBQUM7UUFDUCxPQUFPLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3JELENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQzNDLFdBQVcsRUFBRSwyQkFBMkI7Z0JBQ3hDLFVBQVUsRUFBRSxDQUFDO3dCQUNYLElBQUksRUFBRSxNQUFNO3dCQUNaLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUTtxQkFDckIsQ0FBQzthQUNILENBQUMsRUFBRTtnQkFDRixDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLGlDQUFpQyxFQUFFLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3RFLENBQUM7U0FDSCxDQUFDLENBQUMsQ0FBQTtJQUNMLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb21wb25lbnRzXG5pbXBvcnQgVkV4cGFuc2lvblBhbmVsIGZyb20gJy4vVkV4cGFuc2lvblBhbmVsJ1xuaW1wb3J0IHsgVkV4cGFuZFRyYW5zaXRpb24gfSBmcm9tICcuLi90cmFuc2l0aW9ucydcblxuLy8gTWl4aW5zXG5pbXBvcnQgQm9vdGFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2Jvb3RhYmxlJ1xuaW1wb3J0IENvbG9yYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvY29sb3JhYmxlJ1xuaW1wb3J0IHsgaW5qZWN0IGFzIFJlZ2lzdHJhYmxlSW5qZWN0IH0gZnJvbSAnLi4vLi4vbWl4aW5zL3JlZ2lzdHJhYmxlJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCB7IGdldFNsb3QgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5pbXBvcnQgbWl4aW5zLCB7IEV4dHJhY3RWdWUgfSBmcm9tICcuLi8uLi91dGlsL21peGlucydcblxuLy8gVHlwZXNcbmltcG9ydCBWdWUsIHsgVk5vZGUsIFZ1ZUNvbnN0cnVjdG9yIH0gZnJvbSAndnVlJ1xuXG5jb25zdCBiYXNlTWl4aW5zID0gbWl4aW5zKFxuICBCb290YWJsZSxcbiAgQ29sb3JhYmxlLFxuICBSZWdpc3RyYWJsZUluamVjdDwnZXhwYW5zaW9uUGFuZWwnLCBWdWVDb25zdHJ1Y3RvcjxWdWU+PignZXhwYW5zaW9uUGFuZWwnLCAndi1leHBhbnNpb24tcGFuZWwtY29udGVudCcsICd2LWV4cGFuc2lvbi1wYW5lbCcpXG4pXG5cbmludGVyZmFjZSBvcHRpb25zIGV4dGVuZHMgRXh0cmFjdFZ1ZTx0eXBlb2YgYmFzZU1peGlucz4ge1xuICBleHBhbnNpb25QYW5lbDogSW5zdGFuY2VUeXBlPHR5cGVvZiBWRXhwYW5zaW9uUGFuZWw+XG59XG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBiYXNlTWl4aW5zLmV4dGVuZDxvcHRpb25zPigpLmV4dGVuZCh7XG4gIG5hbWU6ICd2LWV4cGFuc2lvbi1wYW5lbC1jb250ZW50JyxcblxuICBjb21wdXRlZDoge1xuICAgIGlzQWN0aXZlICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLmV4cGFuc2lvblBhbmVsLmlzQWN0aXZlXG4gICAgfSxcbiAgfSxcblxuICBjcmVhdGVkICgpIHtcbiAgICB0aGlzLmV4cGFuc2lvblBhbmVsLnJlZ2lzdGVyQ29udGVudCh0aGlzKVxuICB9LFxuXG4gIGJlZm9yZURlc3Ryb3kgKCkge1xuICAgIHRoaXMuZXhwYW5zaW9uUGFuZWwudW5yZWdpc3RlckNvbnRlbnQoKVxuICB9LFxuXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcbiAgICByZXR1cm4gaChWRXhwYW5kVHJhbnNpdGlvbiwgdGhpcy5zaG93TGF6eUNvbnRlbnQoKCkgPT4gW1xuICAgICAgaCgnZGl2JywgdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IodGhpcy5jb2xvciwge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3YtZXhwYW5zaW9uLXBhbmVsLWNvbnRlbnQnLFxuICAgICAgICBkaXJlY3RpdmVzOiBbe1xuICAgICAgICAgIG5hbWU6ICdzaG93JyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5pc0FjdGl2ZSxcbiAgICAgICAgfV0sXG4gICAgICB9KSwgW1xuICAgICAgICBoKCdkaXYnLCB7IGNsYXNzOiAndi1leHBhbnNpb24tcGFuZWwtY29udGVudF9fd3JhcCcgfSwgZ2V0U2xvdCh0aGlzKSksXG4gICAgICBdKSxcbiAgICBdKSlcbiAgfSxcbn0pXG4iXX0=