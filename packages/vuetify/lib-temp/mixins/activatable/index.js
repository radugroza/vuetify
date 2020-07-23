// Mixins
import Delayable from '../delayable';
import Toggleable from '../toggleable';
// Utilities
import mixins from '../../util/mixins';
import { getSlot, getSlotType } from '../../util/helpers';
import { consoleError } from '../../util/console';
const baseMixins = mixins(Delayable, Toggleable);
/* @vue/component */
export default baseMixins.extend({
    name: 'activatable',
    props: {
        activator: {
            default: null,
            validator: (val) => {
                return ['string', 'object'].includes(typeof val);
            },
        },
        disabled: Boolean,
        internalActivator: Boolean,
        openOnHover: Boolean,
        openOnFocus: Boolean,
    },
    data: () => ({
        // Do not use this directly, call getActivator() instead
        activatorElement: null,
        activatorNode: [],
        events: ['click', 'mouseenter', 'mouseleave', 'focus'],
        listeners: {},
    }),
    watch: {
        activator: 'resetActivator',
        openOnFocus: 'resetActivator',
        openOnHover: 'resetActivator',
    },
    mounted() {
        const slotType = getSlotType(this, 'activator', true);
        if (slotType && ['v-slot', 'normal'].includes(slotType)) {
            consoleError(`The activator slot must be bound, try '<template v-slot:activator="{ on }"><v-btn v-on="on">'`, this);
        }
        this.addActivatorEvents();
    },
    beforeDestroy() {
        this.removeActivatorEvents();
    },
    methods: {
        addActivatorEvents() {
            if (!this.activator ||
                this.disabled ||
                !this.getActivator())
                return;
            this.listeners = this.genActivatorListeners();
            const keys = Object.keys(this.listeners);
            for (const key of keys) {
                this.getActivator().addEventListener(key, this.listeners[key]);
            }
        },
        genActivator() {
            const node = getSlot(this, 'activator', Object.assign(this.getValueProxy(), {
                on: this.genActivatorListeners(),
                attrs: this.genActivatorAttributes(),
            })) || [];
            this.activatorNode = node;
            return node;
        },
        genActivatorAttributes() {
            return {
                role: 'button',
                'aria-haspopup': true,
                'aria-expanded': String(this.isActive),
            };
        },
        genActivatorListeners() {
            if (this.disabled)
                return {};
            const listeners = {};
            if (this.openOnHover) {
                listeners.mouseenter = (e) => {
                    this.getActivator(e);
                    this.runDelay('open');
                };
                listeners.mouseleave = (e) => {
                    this.getActivator(e);
                    this.runDelay('close');
                };
            }
            else {
                listeners.click = (e) => {
                    const activator = this.getActivator(e);
                    if (activator)
                        activator.focus();
                    e.stopPropagation();
                    this.isActive = !this.isActive;
                };
            }
            if (this.openOnFocus) {
                listeners.focus = (e) => {
                    this.getActivator(e);
                    e.stopPropagation();
                    this.isActive = !this.isActive;
                };
            }
            return listeners;
        },
        getActivator(e) {
            // If we've already fetched the activator, re-use
            if (this.activatorElement)
                return this.activatorElement;
            let activator = null;
            if (this.activator) {
                const target = this.internalActivator ? this.$el : document;
                if (typeof this.activator === 'string') {
                    // Selector
                    activator = target.querySelector(this.activator);
                }
                else if (this.activator.$el) {
                    // Component (ref)
                    activator = this.activator.$el;
                }
                else {
                    // HTMLElement | Element
                    activator = this.activator;
                }
            }
            else if (this.activatorNode.length === 1 || (this.activatorNode.length && !e)) {
                // Use the contents of the activator slot
                // There's either only one element in it or we
                // don't have a click event to use as a last resort
                const vm = this.activatorNode[0].componentInstance;
                if (vm &&
                    vm.$options.mixins && //                         Activatable is indirectly used via Menuable
                    vm.$options.mixins.some((m) => m.options && ['activatable', 'menuable'].includes(m.options.name))) {
                    // Activator is actually another activatible component, use its activator (#8846)
                    activator = vm.getActivator();
                }
                else {
                    activator = this.activatorNode[0].elm;
                }
            }
            else if (e) {
                // Activated by a click or focus event
                activator = (e.currentTarget || e.target);
            }
            this.activatorElement = activator;
            return this.activatorElement;
        },
        getContentSlot() {
            return getSlot(this, 'default', this.getValueProxy(), true);
        },
        getValueProxy() {
            const self = this;
            return {
                get value() {
                    return self.isActive;
                },
                set value(isActive) {
                    self.isActive = isActive;
                },
            };
        },
        removeActivatorEvents() {
            if (!this.activator ||
                !this.activatorElement)
                return;
            const keys = Object.keys(this.listeners);
            for (const key of keys) {
                this.activatorElement.removeEventListener(key, this.listeners[key]);
            }
            this.listeners = {};
        },
        resetActivator() {
            this.removeActivatorEvents();
            this.activatorElement = null;
            this.getActivator();
            this.addActivatorEvents();
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL2FjdGl2YXRhYmxlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSxjQUFjLENBQUE7QUFDcEMsT0FBTyxVQUFVLE1BQU0sZUFBZSxDQUFBO0FBRXRDLFlBQVk7QUFDWixPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQUN0QyxPQUFPLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQ3pELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQU9qRCxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQ3ZCLFNBQVMsRUFDVCxVQUFVLENBQ1gsQ0FBQTtBQUVELG9CQUFvQjtBQUNwQixlQUFlLFVBQVUsQ0FBQyxNQUFNLENBQUM7SUFDL0IsSUFBSSxFQUFFLGFBQWE7SUFFbkIsS0FBSyxFQUFFO1FBQ0wsU0FBUyxFQUFFO1lBQ1QsT0FBTyxFQUFFLElBQTBFO1lBQ25GLFNBQVMsRUFBRSxDQUFDLEdBQW9CLEVBQUUsRUFBRTtnQkFDbEMsT0FBTyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQTtZQUNsRCxDQUFDO1NBQ0Y7UUFDRCxRQUFRLEVBQUUsT0FBTztRQUNqQixpQkFBaUIsRUFBRSxPQUFPO1FBQzFCLFdBQVcsRUFBRSxPQUFPO1FBQ3BCLFdBQVcsRUFBRSxPQUFPO0tBQ3JCO0lBRUQsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDWCx3REFBd0Q7UUFDeEQsZ0JBQWdCLEVBQUUsSUFBMEI7UUFDNUMsYUFBYSxFQUFFLEVBQWE7UUFDNUIsTUFBTSxFQUFFLENBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsT0FBTyxDQUFDO1FBQ3RELFNBQVMsRUFBRSxFQUFlO0tB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LElBQUksQ0FBQTtZQUNqQixPQUFPO2dCQUNMLElBQUksS0FBSztvQkFDUCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUE7Z0JBQ3RCLENBQUM7Z0JBQ0QsSUFBSSxLQUFLLENBQUUsUUFBaUI7b0JBQzFCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO2dCQUMxQixDQUFDO2FBQ0YsQ0FBQTtRQUNILENBQUM7UUFDRCxxQkFBcUI7WUFDbkIsSUFDRSxDQUFDLElBQUksQ0FBQyxTQUFTO2dCQUNmLENBQUMsSUFBSSxDQUFDLGdCQUFnQjtnQkFDdEIsT0FBTTtZQUVSLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1lBRXhDLEtBQUssTUFBTSxHQUFHLElBQUksSUFBSSxFQUFFO2dCQUNyQixJQUFJLENBQUMsZ0JBQXdCLENBQUMsbUJBQW1CLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTthQUM3RTtZQUVELElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFBO1FBQ3JCLENBQUM7UUFDRCxjQUFjO1lBQ1osSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUE7WUFDNUIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQTtZQUM1QixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUE7WUFDbkIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUE7UUFDM0IsQ0FBQztLQUNGO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gTWl4aW5zXG5pbXBvcnQgRGVsYXlhYmxlIGZyb20gJy4uL2RlbGF5YWJsZSdcbmltcG9ydCBUb2dnbGVhYmxlIGZyb20gJy4uL3RvZ2dsZWFibGUnXG5cbi8vIFV0aWxpdGllc1xuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcbmltcG9ydCB7IGdldFNsb3QsIGdldFNsb3RUeXBlIH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuaW1wb3J0IHsgY29uc29sZUVycm9yIH0gZnJvbSAnLi4vLi4vdXRpbC9jb25zb2xlJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgVk5vZGUsIFByb3BUeXBlIH0gZnJvbSAndnVlJ1xuXG50eXBlIExpc3RlbmVycyA9IERpY3Rpb25hcnk8KGU6IE1vdXNlRXZlbnQgJiBLZXlib2FyZEV2ZW50ICYgRm9jdXNFdmVudCkgPT4gdm9pZD5cblxuY29uc3QgYmFzZU1peGlucyA9IG1peGlucyhcbiAgRGVsYXlhYmxlLFxuICBUb2dnbGVhYmxlXG4pXG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBiYXNlTWl4aW5zLmV4dGVuZCh7XG4gIG5hbWU6ICdhY3RpdmF0YWJsZScsXG5cbiAgcHJvcHM6IHtcbiAgICBhY3RpdmF0b3I6IHtcbiAgICAgIGRlZmF1bHQ6IG51bGwgYXMgdW5rbm93biBhcyBQcm9wVHlwZTxzdHJpbmcgfCBIVE1MRWxlbWVudCB8IFZOb2RlIHwgRWxlbWVudCB8IG51bGw+LFxuICAgICAgdmFsaWRhdG9yOiAodmFsOiBzdHJpbmcgfCBvYmplY3QpID0+IHtcbiAgICAgICAgcmV0dXJuIFsnc3RyaW5nJywgJ29iamVjdCddLmluY2x1ZGVzKHR5cGVvZiB2YWwpXG4gICAgICB9LFxuICAgIH0sXG4gICAgZGlzYWJsZWQ6IEJvb2xlYW4sXG4gICAgaW50ZXJuYWxBY3RpdmF0b3I6IEJvb2xlYW4sXG4gICAgb3Blbk9uSG92ZXI6IEJvb2xlYW4sXG4gICAgb3Blbk9uRm9jdXM6IEJvb2xlYW4sXG4gIH0sXG5cbiAgZGF0YTogKCkgPT4gKHtcbiAgICAvLyBEbyBub3QgdXNlIHRoaXMgZGlyZWN0bHksIGNhbGwgZ2V0QWN0aXZhdG9yKCkgaW5zdGVhZFxuICAgIGFjdGl2YXRvckVsZW1lbnQ6IG51bGwgYXMgSFRNTEVsZW1lbnQgfCBudWxsLFxuICAgIGFjdGl2YXRvck5vZGU6IFtdIGFzIFZOb2RlW10sXG4gICAgZXZlbnRzOiBbJ2NsaWNrJywgJ21vdXNlZW50ZXInLCAnbW91c2VsZWF2ZScsICdmb2N1cyddLFxuICAgIGxpc3RlbmVyczoge30gYXMgTGlzdGVuZXJzLFxuICB9KSxcblxuICB3YXRjaDoge1xuICAgIGFjdGl2YXRvcjogJ3Jlc2V0QWN0aXZhdG9yJyxcbiAgICBvcGVuT25Gb2N1czogJ3Jlc2V0QWN0aXZhdG9yJyxcbiAgICBvcGVuT25Ib3ZlcjogJ3Jlc2V0QWN0aXZhdG9yJyxcbiAgfSxcblxuICBtb3VudGVkICgpIHtcbiAgICBjb25zdCBzbG90VHlwZSA9IGdldFNsb3RUeXBlKHRoaXMsICdhY3RpdmF0b3InLCB0cnVlKVxuXG4gICAgaWYgKHNsb3RUeXBlICYmIFsndi1zbG90JywgJ25vcm1hbCddLmluY2x1ZGVzKHNsb3RUeXBlKSkge1xuICAgICAgY29uc29sZUVycm9yKGBUaGUgYWN0aXZhdG9yIHNsb3QgbXVzdCBiZSBib3VuZCwgdHJ5ICc8dGVtcGxhdGUgdi1zbG90OmFjdGl2YXRvcj1cInsgb24gfVwiPjx2LWJ0biB2LW9uPVwib25cIj4nYCwgdGhpcylcbiAgICB9XG5cbiAgICB0aGlzLmFkZEFjdGl2YXRvckV2ZW50cygpXG4gIH0sXG5cbiAgYmVmb3JlRGVzdHJveSAoKSB7XG4gICAgdGhpcy5yZW1vdmVBY3RpdmF0b3JFdmVudHMoKVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBhZGRBY3RpdmF0b3JFdmVudHMgKCkge1xuICAgICAgaWYgKFxuICAgICAgICAhdGhpcy5hY3RpdmF0b3IgfHxcbiAgICAgICAgdGhpcy5kaXNhYmxlZCB8fFxuICAgICAgICAhdGhpcy5nZXRBY3RpdmF0b3IoKVxuICAgICAgKSByZXR1cm5cblxuICAgICAgdGhpcy5saXN0ZW5lcnMgPSB0aGlzLmdlbkFjdGl2YXRvckxpc3RlbmVycygpXG4gICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXModGhpcy5saXN0ZW5lcnMpXG5cbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcbiAgICAgICAgdGhpcy5nZXRBY3RpdmF0b3IoKSEuYWRkRXZlbnRMaXN0ZW5lcihrZXksIHRoaXMubGlzdGVuZXJzW2tleV0gYXMgYW55KVxuICAgICAgfVxuICAgIH0sXG4gICAgZ2VuQWN0aXZhdG9yICgpIHtcbiAgICAgIGNvbnN0IG5vZGUgPSBnZXRTbG90KHRoaXMsICdhY3RpdmF0b3InLCBPYmplY3QuYXNzaWduKHRoaXMuZ2V0VmFsdWVQcm94eSgpLCB7XG4gICAgICAgIG9uOiB0aGlzLmdlbkFjdGl2YXRvckxpc3RlbmVycygpLFxuICAgICAgICBhdHRyczogdGhpcy5nZW5BY3RpdmF0b3JBdHRyaWJ1dGVzKCksXG4gICAgICB9KSkgfHwgW11cblxuICAgICAgdGhpcy5hY3RpdmF0b3JOb2RlID0gbm9kZVxuXG4gICAgICByZXR1cm4gbm9kZVxuICAgIH0sXG4gICAgZ2VuQWN0aXZhdG9yQXR0cmlidXRlcyAoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICByb2xlOiAnYnV0dG9uJyxcbiAgICAgICAgJ2FyaWEtaGFzcG9wdXAnOiB0cnVlLFxuICAgICAgICAnYXJpYS1leHBhbmRlZCc6IFN0cmluZyh0aGlzLmlzQWN0aXZlKSxcbiAgICAgIH1cbiAgICB9LFxuICAgIGdlbkFjdGl2YXRvckxpc3RlbmVycyAoKSB7XG4gICAgICBpZiAodGhpcy5kaXNhYmxlZCkgcmV0dXJuIHt9XG5cbiAgICAgIGNvbnN0IGxpc3RlbmVyczogTGlzdGVuZXJzID0ge31cblxuICAgICAgaWYgKHRoaXMub3Blbk9uSG92ZXIpIHtcbiAgICAgICAgbGlzdGVuZXJzLm1vdXNlZW50ZXIgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgIHRoaXMuZ2V0QWN0aXZhdG9yKGUpXG4gICAgICAgICAgdGhpcy5ydW5EZWxheSgnb3BlbicpXG4gICAgICAgIH1cbiAgICAgICAgbGlzdGVuZXJzLm1vdXNlbGVhdmUgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgIHRoaXMuZ2V0QWN0aXZhdG9yKGUpXG4gICAgICAgICAgdGhpcy5ydW5EZWxheSgnY2xvc2UnKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaXN0ZW5lcnMuY2xpY2sgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGFjdGl2YXRvciA9IHRoaXMuZ2V0QWN0aXZhdG9yKGUpXG4gICAgICAgICAgaWYgKGFjdGl2YXRvcikgYWN0aXZhdG9yLmZvY3VzKClcblxuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcblxuICAgICAgICAgIHRoaXMuaXNBY3RpdmUgPSAhdGhpcy5pc0FjdGl2ZVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9wZW5PbkZvY3VzKSB7XG4gICAgICAgIGxpc3RlbmVycy5mb2N1cyA9IChlOiBGb2N1c0V2ZW50KSA9PiB7XG4gICAgICAgICAgdGhpcy5nZXRBY3RpdmF0b3IoZSlcblxuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcblxuICAgICAgICAgIHRoaXMuaXNBY3RpdmUgPSAhdGhpcy5pc0FjdGl2ZVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBsaXN0ZW5lcnNcbiAgICB9LFxuICAgIGdldEFjdGl2YXRvciAoZT86IEV2ZW50KTogSFRNTEVsZW1lbnQgfCBudWxsIHtcbiAgICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZmV0Y2hlZCB0aGUgYWN0aXZhdG9yLCByZS11c2VcbiAgICAgIGlmICh0aGlzLmFjdGl2YXRvckVsZW1lbnQpIHJldHVybiB0aGlzLmFjdGl2YXRvckVsZW1lbnRcblxuICAgICAgbGV0IGFjdGl2YXRvciA9IG51bGxcblxuICAgICAgaWYgKHRoaXMuYWN0aXZhdG9yKSB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuaW50ZXJuYWxBY3RpdmF0b3IgPyB0aGlzLiRlbCA6IGRvY3VtZW50XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmFjdGl2YXRvciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAvLyBTZWxlY3RvclxuICAgICAgICAgIGFjdGl2YXRvciA9IHRhcmdldC5xdWVyeVNlbGVjdG9yKHRoaXMuYWN0aXZhdG9yKVxuICAgICAgICB9IGVsc2UgaWYgKCh0aGlzLmFjdGl2YXRvciBhcyBhbnkpLiRlbCkge1xuICAgICAgICAgIC8vIENvbXBvbmVudCAocmVmKVxuICAgICAgICAgIGFjdGl2YXRvciA9ICh0aGlzLmFjdGl2YXRvciBhcyBhbnkpLiRlbFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIEhUTUxFbGVtZW50IHwgRWxlbWVudFxuICAgICAgICAgIGFjdGl2YXRvciA9IHRoaXMuYWN0aXZhdG9yXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5hY3RpdmF0b3JOb2RlLmxlbmd0aCA9PT0gMSB8fCAodGhpcy5hY3RpdmF0b3JOb2RlLmxlbmd0aCAmJiAhZSkpIHtcbiAgICAgICAgLy8gVXNlIHRoZSBjb250ZW50cyBvZiB0aGUgYWN0aXZhdG9yIHNsb3RcbiAgICAgICAgLy8gVGhlcmUncyBlaXRoZXIgb25seSBvbmUgZWxlbWVudCBpbiBpdCBvciB3ZVxuICAgICAgICAvLyBkb24ndCBoYXZlIGEgY2xpY2sgZXZlbnQgdG8gdXNlIGFzIGEgbGFzdCByZXNvcnRcbiAgICAgICAgY29uc3Qgdm0gPSB0aGlzLmFjdGl2YXRvck5vZGVbMF0uY29tcG9uZW50SW5zdGFuY2VcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHZtICYmXG4gICAgICAgICAgdm0uJG9wdGlvbnMubWl4aW5zICYmIC8vICAgICAgICAgICAgICAgICAgICAgICAgIEFjdGl2YXRhYmxlIGlzIGluZGlyZWN0bHkgdXNlZCB2aWEgTWVudWFibGVcbiAgICAgICAgICB2bS4kb3B0aW9ucy5taXhpbnMuc29tZSgobTogYW55KSA9PiBtLm9wdGlvbnMgJiYgWydhY3RpdmF0YWJsZScsICdtZW51YWJsZSddLmluY2x1ZGVzKG0ub3B0aW9ucy5uYW1lKSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgLy8gQWN0aXZhdG9yIGlzIGFjdHVhbGx5IGFub3RoZXIgYWN0aXZhdGlibGUgY29tcG9uZW50LCB1c2UgaXRzIGFjdGl2YXRvciAoIzg4NDYpXG4gICAgICAgICAgYWN0aXZhdG9yID0gKHZtIGFzIGFueSkuZ2V0QWN0aXZhdG9yKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhY3RpdmF0b3IgPSB0aGlzLmFjdGl2YXRvck5vZGVbMF0uZWxtIGFzIEhUTUxFbGVtZW50XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoZSkge1xuICAgICAgICAvLyBBY3RpdmF0ZWQgYnkgYSBjbGljayBvciBmb2N1cyBldmVudFxuICAgICAgICBhY3RpdmF0b3IgPSAoZS5jdXJyZW50VGFyZ2V0IHx8IGUudGFyZ2V0KSBhcyBIVE1MRWxlbWVudFxuICAgICAgfVxuXG4gICAgICB0aGlzLmFjdGl2YXRvckVsZW1lbnQgPSBhY3RpdmF0b3JcblxuICAgICAgcmV0dXJuIHRoaXMuYWN0aXZhdG9yRWxlbWVudFxuICAgIH0sXG4gICAgZ2V0Q29udGVudFNsb3QgKCkge1xuICAgICAgcmV0dXJuIGdldFNsb3QodGhpcywgJ2RlZmF1bHQnLCB0aGlzLmdldFZhbHVlUHJveHkoKSwgdHJ1ZSlcbiAgICB9LFxuICAgIGdldFZhbHVlUHJveHkgKCk6IG9iamVjdCB7XG4gICAgICBjb25zdCBzZWxmID0gdGhpc1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0IHZhbHVlICgpIHtcbiAgICAgICAgICByZXR1cm4gc2VsZi5pc0FjdGl2ZVxuICAgICAgICB9LFxuICAgICAgICBzZXQgdmFsdWUgKGlzQWN0aXZlOiBib29sZWFuKSB7XG4gICAgICAgICAgc2VsZi5pc0FjdGl2ZSA9IGlzQWN0aXZlXG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgfSxcbiAgICByZW1vdmVBY3RpdmF0b3JFdmVudHMgKCkge1xuICAgICAgaWYgKFxuICAgICAgICAhdGhpcy5hY3RpdmF0b3IgfHxcbiAgICAgICAgIXRoaXMuYWN0aXZhdG9yRWxlbWVudFxuICAgICAgKSByZXR1cm5cblxuICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMubGlzdGVuZXJzKVxuXG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBrZXlzKSB7XG4gICAgICAgICh0aGlzLmFjdGl2YXRvckVsZW1lbnQgYXMgYW55KS5yZW1vdmVFdmVudExpc3RlbmVyKGtleSwgdGhpcy5saXN0ZW5lcnNba2V5XSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5saXN0ZW5lcnMgPSB7fVxuICAgIH0sXG4gICAgcmVzZXRBY3RpdmF0b3IgKCkge1xuICAgICAgdGhpcy5yZW1vdmVBY3RpdmF0b3JFdmVudHMoKVxuICAgICAgdGhpcy5hY3RpdmF0b3JFbGVtZW50ID0gbnVsbFxuICAgICAgdGhpcy5nZXRBY3RpdmF0b3IoKVxuICAgICAgdGhpcy5hZGRBY3RpdmF0b3JFdmVudHMoKVxuICAgIH0sXG4gIH0sXG59KVxuIl19