import '../VDatePickerTable.sass';
// Directives
import Touch from '../../../directives/touch';
// Mixins
import Colorable from '../../../mixins/colorable';
import Localable from '../../../mixins/localable';
import Themeable from '../../../mixins/themeable';
// Utils
import { createItemTypeNativeListeners } from '../util';
import isDateAllowed from '../util/isDateAllowed';
import { mergeListeners } from '../../../util/mergeData';
import mixins from '../../../util/mixins';
import { throttle } from '../../../util/helpers';
export default mixins(Colorable, Localable, Themeable
/* @vue/component */
).extend({
    directives: { Touch },
    props: {
        allowedDates: Function,
        current: String,
        disabled: Boolean,
        format: Function,
        events: {
            type: [Array, Function, Object],
            default: () => null,
        },
        eventColor: {
            type: [Array, Function, Object, String],
            default: () => 'warning',
        },
        min: String,
        max: String,
        range: Boolean,
        readonly: Boolean,
        scrollable: Boolean,
        tableDate: {
            type: String,
            required: true,
        },
        value: [String, Array],
    },
    data: () => ({
        isReversing: false,
        wheelThrottle: null,
    }),
    computed: {
        computedTransition() {
            return (this.isReversing === !this.$vuetify.rtl) ? 'tab-reverse-transition' : 'tab-transition';
        },
        displayedMonth() {
            return Number(this.tableDate.split('-')[1]) - 1;
        },
        displayedYear() {
            return Number(this.tableDate.split('-')[0]);
        },
    },
    watch: {
        tableDate(newVal, oldVal) {
            this.isReversing = newVal < oldVal;
        },
    },
    mounted() {
        this.wheelThrottle = throttle(this.wheel, 250);
    },
    methods: {
        genButtonClasses(isAllowed, isFloating, isSelected, isCurrent) {
            return {
                'v-size--default': !isFloating,
                'v-date-picker-table__current': isCurrent,
                'v-btn--active': isSelected,
                'v-btn--flat': !isAllowed || this.disabled,
                'v-btn--text': isSelected === isCurrent,
                'v-btn--rounded': isFloating,
                'v-btn--disabled': !isAllowed || this.disabled,
                'v-btn--outlined': isCurrent && !isSelected,
                ...this.themeClasses,
            };
        },
        genButtonEvents(value, isAllowed, mouseEventType) {
            if (this.disabled)
                return undefined;
            return mergeListeners({
                click: () => {
                    if (isAllowed && !this.readonly)
                        this.$emit('input', value);
                },
            }, createItemTypeNativeListeners(this, `:${mouseEventType}`, value));
        },
        genButton(value, isFloating, mouseEventType, formatter) {
            const isAllowed = isDateAllowed(value, this.min, this.max, this.allowedDates);
            const isSelected = this.isSelected(value) && isAllowed;
            const isCurrent = value === this.current;
            const setColor = isSelected ? this.setBackgroundColor : this.setTextColor;
            const color = (isSelected || isCurrent) && (this.color || 'accent');
            return this.$createElement('button', setColor(color, {
                staticClass: 'v-btn',
                class: this.genButtonClasses(isAllowed, isFloating, isSelected, isCurrent),
                attrs: {
                    type: 'button',
                },
                domProps: {
                    disabled: this.disabled || !isAllowed,
                },
                on: this.genButtonEvents(value, isAllowed, mouseEventType),
            }), [
                this.$createElement('div', {
                    staticClass: 'v-btn__content',
                }, [formatter(value)]),
                this.genEvents(value),
            ]);
        },
        getEventColors(date) {
            const arrayize = (v) => Array.isArray(v) ? v : [v];
            let eventData;
            let eventColors = [];
            if (Array.isArray(this.events)) {
                eventData = this.events.includes(date);
            }
            else if (this.events instanceof Function) {
                eventData = this.events(date) || false;
            }
            else if (this.events) {
                eventData = this.events[date] || false;
            }
            else {
                eventData = false;
            }
            if (!eventData) {
                return [];
            }
            else if (eventData !== true) {
                eventColors = arrayize(eventData);
            }
            else if (typeof this.eventColor === 'string') {
                eventColors = [this.eventColor];
            }
            else if (typeof this.eventColor === 'function') {
                eventColors = arrayize(this.eventColor(date));
            }
            else if (Array.isArray(this.eventColor)) {
                eventColors = this.eventColor;
            }
            else {
                eventColors = arrayize(this.eventColor[date]);
            }
            return eventColors.filter(v => v);
        },
        genEvents(date) {
            const eventColors = this.getEventColors(date);
            return eventColors.length ? this.$createElement('div', {
                staticClass: 'v-date-picker-table__events',
            }, eventColors.map(color => this.$createElement('div', this.setBackgroundColor(color)))) : null;
        },
        wheel(e, calculateTableDate) {
            this.$emit('update:table-date', calculateTableDate(e.deltaY));
        },
        touch(value, calculateTableDate) {
            this.$emit('update:table-date', calculateTableDate(value));
        },
        genTable(staticClass, children, calculateTableDate) {
            const transition = this.$createElement('transition', {
                props: { name: this.computedTransition },
            }, [this.$createElement('table', { key: this.tableDate }, children)]);
            const touchDirective = {
                name: 'touch',
                value: {
                    left: (e) => (e.offsetX < -15) && this.touch(1, calculateTableDate),
                    right: (e) => (e.offsetX > 15) && this.touch(-1, calculateTableDate),
                },
            };
            return this.$createElement('div', {
                staticClass,
                class: {
                    'v-date-picker-table--disabled': this.disabled,
                    ...this.themeClasses,
                },
                on: (!this.disabled && this.scrollable) ? {
                    wheel: (e) => {
                        e.preventDefault();
                        this.wheelThrottle(e, calculateTableDate);
                    },
                } : undefined,
                directives: [touchDirective],
            }, [transition]);
        },
        isSelected(value) {
            if (Array.isArray(this.value)) {
                if (this.range && this.value.length === 2) {
                    const [from, to] = [...this.value].sort();
                    return from <= value && value <= to;
                }
                else {
                    return this.value.indexOf(value) !== -1;
                }
            }
            return value === this.value;
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1waWNrZXItdGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WRGF0ZVBpY2tlci9taXhpbnMvZGF0ZS1waWNrZXItdGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTywwQkFBMEIsQ0FBQTtBQUVqQyxhQUFhO0FBQ2IsT0FBTyxLQUFLLE1BQU0sMkJBQTJCLENBQUE7QUFFN0MsU0FBUztBQUNULE9BQU8sU0FBUyxNQUFNLDJCQUEyQixDQUFBO0FBQ2pELE9BQU8sU0FBUyxNQUFNLDJCQUEyQixDQUFBO0FBQ2pELE9BQU8sU0FBUyxNQUFNLDJCQUEyQixDQUFBO0FBRWpELFFBQVE7QUFDUixPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSxTQUFTLENBQUE7QUFDdkQsT0FBTyxhQUFhLE1BQU0sdUJBQXVCLENBQUE7QUFDakQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHlCQUF5QixDQUFBO0FBQ3hELE9BQU8sTUFBTSxNQUFNLHNCQUFzQixDQUFBO0FBQ3pDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQTtBQWtCaEQsZUFBZSxNQUFNLENBQ25CLFNBQVMsRUFDVCxTQUFTLEVBQ1QsU0FBUztBQUNYLG9CQUFvQjtDQUNuQixDQUFDLE1BQU0sQ0FBQztJQUNQLFVBQVUsRUFBRSxFQUFFLEtBQUssRUFBRTtJQUVyQixLQUFLLEVBQUU7UUFDTCxZQUFZLEVBQUUsUUFBZ0U7UUFDOUUsT0FBTyxFQUFFLE1BQU07UUFDZixRQUFRLEVBQUUsT0FBTztRQUNqQixNQUFNLEVBQUUsUUFBcUQ7UUFDN0QsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQStCO1lBQzdELE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJO1NBQ3BCO1FBQ0QsVUFBVSxFQUFFO1lBQ1YsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFvQztZQUMxRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsU0FBUztTQUN6QjtRQUNELEdBQUcsRUFBRSxNQUFNO1FBQ1gsR0FBRyxFQUFFLE1BQU07UUFDWCxLQUFLLEVBQUUsT0FBTztRQUNkLFFBQVEsRUFBRSxPQUFPO1FBQ2pCLFVBQVUsRUFBRSxPQUFPO1FBQ25CLFNBQVMsRUFBRTtZQUNULElBQUksRUFBRSxNQUFNO1lBQ1osUUFBUSxFQUFFLElBQUk7U0FDZjtRQUNELEtBQUssRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQWdDO0tBQ3REO0lBRUQsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDWCxXQUFXLEVBQUUsS0FBSztRQUNsQixhQUFhLEVBQUUsSUFBVztLQUMzQixDQUFDO0lBRUYsUUFBUSxFQUFFO1FBQ1Isa0JBQWtCO1lBQ2hCLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFBO1FBQ2hHLENBQUM7UUFDRCxjQUFjO1lBQ1osT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDakQsQ0FBQztRQUNELGFBQWE7WUFDWCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzdDLENBQUM7S0FDRjtJQUVELEtBQUssRUFBRTtRQUNMLFNBQVMsQ0FBRSxNQUFjLEVBQUUsTUFBYztZQUN2QyxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sR0FBRyxNQUFNLENBQUE7UUFDcEMsQ0FBQztLQUNGO0lBRUQsT0FBTztRQUNMLElBQUksQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUE7SUFDaEQsQ0FBQztJQUVELE9BQU8sRUFBRTtRQUNQLGdCQUFnQixDQUFFLFNBQWtCLEVBQUUsVUFBbUIsRUFBRSxVQUFtQixFQUFFLFNBQWtCO1lBQ2hHLE9BQU87Z0JBQ0wsaUJBQWlCLEVBQUUsQ0FBQyxVQUFVO2dCQUM5Qiw4QkFBOEIsRUFBRSxTQUFTO2dCQUN6QyxlQUFlLEVBQUUsVUFBVTtnQkFDM0IsYUFBYSxFQUFFLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxRQUFRO2dCQUMxQyxhQUFhLEVBQUUsVUFBVSxLQUFLLFNBQVM7Z0JBQ3ZDLGdCQUFnQixFQUFFLFVBQVU7Z0JBQzVCLGlCQUFpQixFQUFFLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxRQUFRO2dCQUM5QyxpQkFBaUIsRUFBRSxTQUFTLElBQUksQ0FBQyxVQUFVO2dCQUMzQyxHQUFHLElBQUksQ0FBQyxZQUFZO2FBQ3JCLENBQUE7UUFDSCxDQUFDO1FBQ0QsZUFBZSxDQUFFLEtBQWEsRUFBRSxTQUFrQixFQUFFLGNBQXNCO1lBQ3hFLElBQUksSUFBSSxDQUFDLFFBQVE7Z0JBQUUsT0FBTyxTQUFTLENBQUE7WUFFbkMsT0FBTyxjQUFjLENBQUM7Z0JBQ3BCLEtBQUssRUFBRSxHQUFHLEVBQUU7b0JBQ1YsSUFBSSxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUTt3QkFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQTtnQkFDN0QsQ0FBQzthQUNGLEVBQUUsNkJBQTZCLENBQUMsSUFBSSxFQUFFLElBQUksY0FBYyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQTtRQUN0RSxDQUFDO1FBQ0QsU0FBUyxDQUFFLEtBQWEsRUFBRSxVQUFtQixFQUFFLGNBQXNCLEVBQUUsU0FBOEI7WUFDbkcsTUFBTSxTQUFTLEdBQUcsYUFBYSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBO1lBQzdFLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksU0FBUyxDQUFBO1lBQ3RELE1BQU0sU0FBUyxHQUFHLEtBQUssS0FBSyxJQUFJLENBQUMsT0FBTyxDQUFBO1lBQ3hDLE1BQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFBO1lBQ3pFLE1BQU0sS0FBSyxHQUFHLENBQUMsVUFBVSxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxRQUFRLENBQUMsQ0FBQTtZQUVuRSxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUU7Z0JBQ25ELFdBQVcsRUFBRSxPQUFPO2dCQUNwQixLQUFLLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFNBQVMsQ0FBQztnQkFDMUUsS0FBSyxFQUFFO29CQUNMLElBQUksRUFBRSxRQUFRO2lCQUNmO2dCQUNELFFBQVEsRUFBRTtvQkFDUixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLFNBQVM7aUJBQ3RDO2dCQUNELEVBQUUsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsY0FBYyxDQUFDO2FBQzNELENBQUMsRUFBRTtnQkFDRixJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRTtvQkFDekIsV0FBVyxFQUFFLGdCQUFnQjtpQkFDOUIsRUFBRSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQzthQUN0QixDQUFDLENBQUE7UUFDSixDQUFDO1FBQ0QsY0FBYyxDQUFFLElBQVk7WUFDMUIsTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFvQixFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDckUsSUFBSSxTQUE4QyxDQUFBO1lBQ2xELElBQUksV0FBVyxHQUFhLEVBQUUsQ0FBQTtZQUU5QixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUM5QixTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUE7YUFDdkM7aUJBQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxZQUFZLFFBQVEsRUFBRTtnQkFDMUMsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFBO2FBQ3ZDO2lCQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDdEIsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFBO2FBQ3ZDO2lCQUFNO2dCQUNMLFNBQVMsR0FBRyxLQUFLLENBQUE7YUFDbEI7WUFFRCxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNkLE9BQU8sRUFBRSxDQUFBO2FBQ1Y7aUJBQU0sSUFBSSxTQUFTLEtBQUssSUFBSSxFQUFFO2dCQUM3QixXQUFXLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFBO2FBQ2xDO2lCQUFNLElBQUksT0FBTyxJQUFJLENBQUMsVUFBVSxLQUFLLFFBQVEsRUFBRTtnQkFDOUMsV0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO2FBQ2hDO2lCQUFNLElBQUksT0FBTyxJQUFJLENBQUMsVUFBVSxLQUFLLFVBQVUsRUFBRTtnQkFDaEQsV0FBVyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7YUFDOUM7aUJBQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRTtnQkFDekMsV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUE7YUFDOUI7aUJBQU07Z0JBQ0wsV0FBVyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7YUFDOUM7WUFFRCxPQUFPLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNuQyxDQUFDO1FBQ0QsU0FBUyxDQUFFLElBQVk7WUFDckIsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUU3QyxPQUFPLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFO2dCQUNyRCxXQUFXLEVBQUUsNkJBQTZCO2FBQzNDLEVBQUUsV0FBVyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFBO1FBQ2pHLENBQUM7UUFDRCxLQUFLLENBQUUsQ0FBYSxFQUFFLGtCQUE4QztZQUNsRSxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixFQUFFLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO1FBQy9ELENBQUM7UUFDRCxLQUFLLENBQUUsS0FBYSxFQUFFLGtCQUE4QztZQUNsRSxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixFQUFFLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7UUFDNUQsQ0FBQztRQUNELFFBQVEsQ0FBRSxXQUFtQixFQUFFLFFBQXVCLEVBQUUsa0JBQThDO1lBQ3BHLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxFQUFFO2dCQUNuRCxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixFQUFFO2FBQ3pDLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBRXJFLE1BQU0sY0FBYyxHQUFHO2dCQUNyQixJQUFJLEVBQUUsT0FBTztnQkFDYixLQUFLLEVBQUU7b0JBQ0wsSUFBSSxFQUFFLENBQUMsQ0FBZSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxrQkFBa0IsQ0FBQztvQkFDakYsS0FBSyxFQUFFLENBQUMsQ0FBZSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxrQkFBa0IsQ0FBQztpQkFDbkY7YUFDRixDQUFBO1lBRUQsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRTtnQkFDaEMsV0FBVztnQkFDWCxLQUFLLEVBQUU7b0JBQ0wsK0JBQStCLEVBQUUsSUFBSSxDQUFDLFFBQVE7b0JBQzlDLEdBQUcsSUFBSSxDQUFDLFlBQVk7aUJBQ3JCO2dCQUNELEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN4QyxLQUFLLEVBQUUsQ0FBQyxDQUFhLEVBQUUsRUFBRTt3QkFDdkIsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFBO3dCQUNsQixJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFBO29CQUMzQyxDQUFDO2lCQUNGLENBQUMsQ0FBQyxDQUFDLFNBQVM7Z0JBQ2IsVUFBVSxFQUFFLENBQUMsY0FBYyxDQUFDO2FBQzdCLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFBO1FBQ2xCLENBQUM7UUFDRCxVQUFVLENBQUUsS0FBYTtZQUN2QixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUM3QixJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO29CQUN6QyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUE7b0JBQ3pDLE9BQU8sSUFBSSxJQUFJLEtBQUssSUFBSSxLQUFLLElBQUksRUFBRSxDQUFBO2lCQUNwQztxQkFBTTtvQkFDTCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFBO2lCQUN4QzthQUNGO1lBRUQsT0FBTyxLQUFLLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQTtRQUM3QixDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4uL1ZEYXRlUGlja2VyVGFibGUuc2FzcydcblxuLy8gRGlyZWN0aXZlc1xuaW1wb3J0IFRvdWNoIGZyb20gJy4uLy4uLy4uL2RpcmVjdGl2ZXMvdG91Y2gnXG5cbi8vIE1peGluc1xuaW1wb3J0IENvbG9yYWJsZSBmcm9tICcuLi8uLi8uLi9taXhpbnMvY29sb3JhYmxlJ1xuaW1wb3J0IExvY2FsYWJsZSBmcm9tICcuLi8uLi8uLi9taXhpbnMvbG9jYWxhYmxlJ1xuaW1wb3J0IFRoZW1lYWJsZSBmcm9tICcuLi8uLi8uLi9taXhpbnMvdGhlbWVhYmxlJ1xuXG4vLyBVdGlsc1xuaW1wb3J0IHsgY3JlYXRlSXRlbVR5cGVOYXRpdmVMaXN0ZW5lcnMgfSBmcm9tICcuLi91dGlsJ1xuaW1wb3J0IGlzRGF0ZUFsbG93ZWQgZnJvbSAnLi4vdXRpbC9pc0RhdGVBbGxvd2VkJ1xuaW1wb3J0IHsgbWVyZ2VMaXN0ZW5lcnMgfSBmcm9tICcuLi8uLi8uLi91dGlsL21lcmdlRGF0YSdcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vLi4vdXRpbC9taXhpbnMnXG5pbXBvcnQgeyB0aHJvdHRsZSB9IGZyb20gJy4uLy4uLy4uL3V0aWwvaGVscGVycydcblxuLy8gVHlwZXNcbmltcG9ydCB7XG4gIFByb3BUeXBlLFxuICBWTm9kZUNoaWxkcmVuLFxufSBmcm9tICd2dWUnXG5pbXBvcnQge1xuICBEYXRlUGlja2VyQWxsb3dlZERhdGVzRnVuY3Rpb24sXG4gIERhdGVQaWNrZXJFdmVudENvbG9ycyxcbiAgRGF0ZVBpY2tlckV2ZW50Q29sb3JWYWx1ZSxcbiAgRGF0ZVBpY2tlckV2ZW50cyxcbiAgRGF0ZVBpY2tlckZvcm1hdHRlcixcbiAgVG91Y2hXcmFwcGVyLFxufSBmcm9tICd2dWV0aWZ5L3R5cGVzJ1xuXG50eXBlIENhbGN1bGF0ZVRhYmxlRGF0ZUZ1bmN0aW9uID0gKHY6IG51bWJlcikgPT4gc3RyaW5nXG5cbmV4cG9ydCBkZWZhdWx0IG1peGlucyhcbiAgQ29sb3JhYmxlLFxuICBMb2NhbGFibGUsXG4gIFRoZW1lYWJsZVxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbikuZXh0ZW5kKHtcbiAgZGlyZWN0aXZlczogeyBUb3VjaCB9LFxuXG4gIHByb3BzOiB7XG4gICAgYWxsb3dlZERhdGVzOiBGdW5jdGlvbiBhcyBQcm9wVHlwZTxEYXRlUGlja2VyQWxsb3dlZERhdGVzRnVuY3Rpb24gfCB1bmRlZmluZWQ+LFxuICAgIGN1cnJlbnQ6IFN0cmluZyxcbiAgICBkaXNhYmxlZDogQm9vbGVhbixcbiAgICBmb3JtYXQ6IEZ1bmN0aW9uIGFzIFByb3BUeXBlPERhdGVQaWNrZXJGb3JtYXR0ZXIgfCB1bmRlZmluZWQ+LFxuICAgIGV2ZW50czoge1xuICAgICAgdHlwZTogW0FycmF5LCBGdW5jdGlvbiwgT2JqZWN0XSBhcyBQcm9wVHlwZTxEYXRlUGlja2VyRXZlbnRzPixcbiAgICAgIGRlZmF1bHQ6ICgpID0+IG51bGwsXG4gICAgfSxcbiAgICBldmVudENvbG9yOiB7XG4gICAgICB0eXBlOiBbQXJyYXksIEZ1bmN0aW9uLCBPYmplY3QsIFN0cmluZ10gYXMgUHJvcFR5cGU8RGF0ZVBpY2tlckV2ZW50Q29sb3JzPixcbiAgICAgIGRlZmF1bHQ6ICgpID0+ICd3YXJuaW5nJyxcbiAgICB9LFxuICAgIG1pbjogU3RyaW5nLFxuICAgIG1heDogU3RyaW5nLFxuICAgIHJhbmdlOiBCb29sZWFuLFxuICAgIHJlYWRvbmx5OiBCb29sZWFuLFxuICAgIHNjcm9sbGFibGU6IEJvb2xlYW4sXG4gICAgdGFibGVEYXRlOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICB9LFxuICAgIHZhbHVlOiBbU3RyaW5nLCBBcnJheV0gYXMgUHJvcFR5cGU8c3RyaW5nIHwgc3RyaW5nW10+LFxuICB9LFxuXG4gIGRhdGE6ICgpID0+ICh7XG4gICAgaXNSZXZlcnNpbmc6IGZhbHNlLFxuICAgIHdoZWVsVGhyb3R0bGU6IG51bGwgYXMgYW55LFxuICB9KSxcblxuICBjb21wdXRlZDoge1xuICAgIGNvbXB1dGVkVHJhbnNpdGlvbiAoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiAodGhpcy5pc1JldmVyc2luZyA9PT0gIXRoaXMuJHZ1ZXRpZnkucnRsKSA/ICd0YWItcmV2ZXJzZS10cmFuc2l0aW9uJyA6ICd0YWItdHJhbnNpdGlvbidcbiAgICB9LFxuICAgIGRpc3BsYXllZE1vbnRoICgpOiBudW1iZXIge1xuICAgICAgcmV0dXJuIE51bWJlcih0aGlzLnRhYmxlRGF0ZS5zcGxpdCgnLScpWzFdKSAtIDFcbiAgICB9LFxuICAgIGRpc3BsYXllZFllYXIgKCk6IG51bWJlciB7XG4gICAgICByZXR1cm4gTnVtYmVyKHRoaXMudGFibGVEYXRlLnNwbGl0KCctJylbMF0pXG4gICAgfSxcbiAgfSxcblxuICB3YXRjaDoge1xuICAgIHRhYmxlRGF0ZSAobmV3VmFsOiBzdHJpbmcsIG9sZFZhbDogc3RyaW5nKSB7XG4gICAgICB0aGlzLmlzUmV2ZXJzaW5nID0gbmV3VmFsIDwgb2xkVmFsXG4gICAgfSxcbiAgfSxcblxuICBtb3VudGVkICgpIHtcbiAgICB0aGlzLndoZWVsVGhyb3R0bGUgPSB0aHJvdHRsZSh0aGlzLndoZWVsLCAyNTApXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGdlbkJ1dHRvbkNsYXNzZXMgKGlzQWxsb3dlZDogYm9vbGVhbiwgaXNGbG9hdGluZzogYm9vbGVhbiwgaXNTZWxlY3RlZDogYm9vbGVhbiwgaXNDdXJyZW50OiBib29sZWFuKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAndi1zaXplLS1kZWZhdWx0JzogIWlzRmxvYXRpbmcsXG4gICAgICAgICd2LWRhdGUtcGlja2VyLXRhYmxlX19jdXJyZW50JzogaXNDdXJyZW50LFxuICAgICAgICAndi1idG4tLWFjdGl2ZSc6IGlzU2VsZWN0ZWQsXG4gICAgICAgICd2LWJ0bi0tZmxhdCc6ICFpc0FsbG93ZWQgfHwgdGhpcy5kaXNhYmxlZCxcbiAgICAgICAgJ3YtYnRuLS10ZXh0JzogaXNTZWxlY3RlZCA9PT0gaXNDdXJyZW50LFxuICAgICAgICAndi1idG4tLXJvdW5kZWQnOiBpc0Zsb2F0aW5nLFxuICAgICAgICAndi1idG4tLWRpc2FibGVkJzogIWlzQWxsb3dlZCB8fCB0aGlzLmRpc2FibGVkLFxuICAgICAgICAndi1idG4tLW91dGxpbmVkJzogaXNDdXJyZW50ICYmICFpc1NlbGVjdGVkLFxuICAgICAgICAuLi50aGlzLnRoZW1lQ2xhc3NlcyxcbiAgICAgIH1cbiAgICB9LFxuICAgIGdlbkJ1dHRvbkV2ZW50cyAodmFsdWU6IHN0cmluZywgaXNBbGxvd2VkOiBib29sZWFuLCBtb3VzZUV2ZW50VHlwZTogc3RyaW5nKSB7XG4gICAgICBpZiAodGhpcy5kaXNhYmxlZCkgcmV0dXJuIHVuZGVmaW5lZFxuXG4gICAgICByZXR1cm4gbWVyZ2VMaXN0ZW5lcnMoe1xuICAgICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICAgIGlmIChpc0FsbG93ZWQgJiYgIXRoaXMucmVhZG9ubHkpIHRoaXMuJGVtaXQoJ2lucHV0JywgdmFsdWUpXG4gICAgICAgIH0sXG4gICAgICB9LCBjcmVhdGVJdGVtVHlwZU5hdGl2ZUxpc3RlbmVycyh0aGlzLCBgOiR7bW91c2VFdmVudFR5cGV9YCwgdmFsdWUpKVxuICAgIH0sXG4gICAgZ2VuQnV0dG9uICh2YWx1ZTogc3RyaW5nLCBpc0Zsb2F0aW5nOiBib29sZWFuLCBtb3VzZUV2ZW50VHlwZTogc3RyaW5nLCBmb3JtYXR0ZXI6IERhdGVQaWNrZXJGb3JtYXR0ZXIpIHtcbiAgICAgIGNvbnN0IGlzQWxsb3dlZCA9IGlzRGF0ZUFsbG93ZWQodmFsdWUsIHRoaXMubWluLCB0aGlzLm1heCwgdGhpcy5hbGxvd2VkRGF0ZXMpXG4gICAgICBjb25zdCBpc1NlbGVjdGVkID0gdGhpcy5pc1NlbGVjdGVkKHZhbHVlKSAmJiBpc0FsbG93ZWRcbiAgICAgIGNvbnN0IGlzQ3VycmVudCA9IHZhbHVlID09PSB0aGlzLmN1cnJlbnRcbiAgICAgIGNvbnN0IHNldENvbG9yID0gaXNTZWxlY3RlZCA/IHRoaXMuc2V0QmFja2dyb3VuZENvbG9yIDogdGhpcy5zZXRUZXh0Q29sb3JcbiAgICAgIGNvbnN0IGNvbG9yID0gKGlzU2VsZWN0ZWQgfHwgaXNDdXJyZW50KSAmJiAodGhpcy5jb2xvciB8fCAnYWNjZW50JylcblxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicsIHNldENvbG9yKGNvbG9yLCB7XG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1idG4nLFxuICAgICAgICBjbGFzczogdGhpcy5nZW5CdXR0b25DbGFzc2VzKGlzQWxsb3dlZCwgaXNGbG9hdGluZywgaXNTZWxlY3RlZCwgaXNDdXJyZW50KSxcbiAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICB0eXBlOiAnYnV0dG9uJyxcbiAgICAgICAgfSxcbiAgICAgICAgZG9tUHJvcHM6IHtcbiAgICAgICAgICBkaXNhYmxlZDogdGhpcy5kaXNhYmxlZCB8fCAhaXNBbGxvd2VkLFxuICAgICAgICB9LFxuICAgICAgICBvbjogdGhpcy5nZW5CdXR0b25FdmVudHModmFsdWUsIGlzQWxsb3dlZCwgbW91c2VFdmVudFR5cGUpLFxuICAgICAgfSksIFtcbiAgICAgICAgdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICAgIHN0YXRpY0NsYXNzOiAndi1idG5fX2NvbnRlbnQnLFxuICAgICAgICB9LCBbZm9ybWF0dGVyKHZhbHVlKV0pLFxuICAgICAgICB0aGlzLmdlbkV2ZW50cyh2YWx1ZSksXG4gICAgICBdKVxuICAgIH0sXG4gICAgZ2V0RXZlbnRDb2xvcnMgKGRhdGU6IHN0cmluZykge1xuICAgICAgY29uc3QgYXJyYXlpemUgPSAodjogc3RyaW5nIHwgc3RyaW5nW10pID0+IEFycmF5LmlzQXJyYXkodikgPyB2IDogW3ZdXG4gICAgICBsZXQgZXZlbnREYXRhOiBib29sZWFuIHwgRGF0ZVBpY2tlckV2ZW50Q29sb3JWYWx1ZVxuICAgICAgbGV0IGV2ZW50Q29sb3JzOiBzdHJpbmdbXSA9IFtdXG5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMuZXZlbnRzKSkge1xuICAgICAgICBldmVudERhdGEgPSB0aGlzLmV2ZW50cy5pbmNsdWRlcyhkYXRlKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmV2ZW50cyBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICAgIGV2ZW50RGF0YSA9IHRoaXMuZXZlbnRzKGRhdGUpIHx8IGZhbHNlXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuZXZlbnRzKSB7XG4gICAgICAgIGV2ZW50RGF0YSA9IHRoaXMuZXZlbnRzW2RhdGVdIHx8IGZhbHNlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBldmVudERhdGEgPSBmYWxzZVxuICAgICAgfVxuXG4gICAgICBpZiAoIWV2ZW50RGF0YSkge1xuICAgICAgICByZXR1cm4gW11cbiAgICAgIH0gZWxzZSBpZiAoZXZlbnREYXRhICE9PSB0cnVlKSB7XG4gICAgICAgIGV2ZW50Q29sb3JzID0gYXJyYXlpemUoZXZlbnREYXRhKVxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5ldmVudENvbG9yID09PSAnc3RyaW5nJykge1xuICAgICAgICBldmVudENvbG9ycyA9IFt0aGlzLmV2ZW50Q29sb3JdXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzLmV2ZW50Q29sb3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZXZlbnRDb2xvcnMgPSBhcnJheWl6ZSh0aGlzLmV2ZW50Q29sb3IoZGF0ZSkpXG4gICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5ldmVudENvbG9yKSkge1xuICAgICAgICBldmVudENvbG9ycyA9IHRoaXMuZXZlbnRDb2xvclxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXZlbnRDb2xvcnMgPSBhcnJheWl6ZSh0aGlzLmV2ZW50Q29sb3JbZGF0ZV0pXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBldmVudENvbG9ycy5maWx0ZXIodiA9PiB2KVxuICAgIH0sXG4gICAgZ2VuRXZlbnRzIChkYXRlOiBzdHJpbmcpIHtcbiAgICAgIGNvbnN0IGV2ZW50Q29sb3JzID0gdGhpcy5nZXRFdmVudENvbG9ycyhkYXRlKVxuXG4gICAgICByZXR1cm4gZXZlbnRDb2xvcnMubGVuZ3RoID8gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3YtZGF0ZS1waWNrZXItdGFibGVfX2V2ZW50cycsXG4gICAgICB9LCBldmVudENvbG9ycy5tYXAoY29sb3IgPT4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2JywgdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IoY29sb3IpKSkpIDogbnVsbFxuICAgIH0sXG4gICAgd2hlZWwgKGU6IFdoZWVsRXZlbnQsIGNhbGN1bGF0ZVRhYmxlRGF0ZTogQ2FsY3VsYXRlVGFibGVEYXRlRnVuY3Rpb24pIHtcbiAgICAgIHRoaXMuJGVtaXQoJ3VwZGF0ZTp0YWJsZS1kYXRlJywgY2FsY3VsYXRlVGFibGVEYXRlKGUuZGVsdGFZKSlcbiAgICB9LFxuICAgIHRvdWNoICh2YWx1ZTogbnVtYmVyLCBjYWxjdWxhdGVUYWJsZURhdGU6IENhbGN1bGF0ZVRhYmxlRGF0ZUZ1bmN0aW9uKSB7XG4gICAgICB0aGlzLiRlbWl0KCd1cGRhdGU6dGFibGUtZGF0ZScsIGNhbGN1bGF0ZVRhYmxlRGF0ZSh2YWx1ZSkpXG4gICAgfSxcbiAgICBnZW5UYWJsZSAoc3RhdGljQ2xhc3M6IHN0cmluZywgY2hpbGRyZW46IFZOb2RlQ2hpbGRyZW4sIGNhbGN1bGF0ZVRhYmxlRGF0ZTogQ2FsY3VsYXRlVGFibGVEYXRlRnVuY3Rpb24pIHtcbiAgICAgIGNvbnN0IHRyYW5zaXRpb24gPSB0aGlzLiRjcmVhdGVFbGVtZW50KCd0cmFuc2l0aW9uJywge1xuICAgICAgICBwcm9wczogeyBuYW1lOiB0aGlzLmNvbXB1dGVkVHJhbnNpdGlvbiB9LFxuICAgICAgfSwgW3RoaXMuJGNyZWF0ZUVsZW1lbnQoJ3RhYmxlJywgeyBrZXk6IHRoaXMudGFibGVEYXRlIH0sIGNoaWxkcmVuKV0pXG5cbiAgICAgIGNvbnN0IHRvdWNoRGlyZWN0aXZlID0ge1xuICAgICAgICBuYW1lOiAndG91Y2gnLFxuICAgICAgICB2YWx1ZToge1xuICAgICAgICAgIGxlZnQ6IChlOiBUb3VjaFdyYXBwZXIpID0+IChlLm9mZnNldFggPCAtMTUpICYmIHRoaXMudG91Y2goMSwgY2FsY3VsYXRlVGFibGVEYXRlKSxcbiAgICAgICAgICByaWdodDogKGU6IFRvdWNoV3JhcHBlcikgPT4gKGUub2Zmc2V0WCA+IDE1KSAmJiB0aGlzLnRvdWNoKC0xLCBjYWxjdWxhdGVUYWJsZURhdGUpLFxuICAgICAgICB9LFxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICBzdGF0aWNDbGFzcyxcbiAgICAgICAgY2xhc3M6IHtcbiAgICAgICAgICAndi1kYXRlLXBpY2tlci10YWJsZS0tZGlzYWJsZWQnOiB0aGlzLmRpc2FibGVkLFxuICAgICAgICAgIC4uLnRoaXMudGhlbWVDbGFzc2VzLFxuICAgICAgICB9LFxuICAgICAgICBvbjogKCF0aGlzLmRpc2FibGVkICYmIHRoaXMuc2Nyb2xsYWJsZSkgPyB7XG4gICAgICAgICAgd2hlZWw6IChlOiBXaGVlbEV2ZW50KSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgIHRoaXMud2hlZWxUaHJvdHRsZShlLCBjYWxjdWxhdGVUYWJsZURhdGUpXG4gICAgICAgICAgfSxcbiAgICAgICAgfSA6IHVuZGVmaW5lZCxcbiAgICAgICAgZGlyZWN0aXZlczogW3RvdWNoRGlyZWN0aXZlXSxcbiAgICAgIH0sIFt0cmFuc2l0aW9uXSlcbiAgICB9LFxuICAgIGlzU2VsZWN0ZWQgKHZhbHVlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMudmFsdWUpKSB7XG4gICAgICAgIGlmICh0aGlzLnJhbmdlICYmIHRoaXMudmFsdWUubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgY29uc3QgW2Zyb20sIHRvXSA9IFsuLi50aGlzLnZhbHVlXS5zb3J0KClcbiAgICAgICAgICByZXR1cm4gZnJvbSA8PSB2YWx1ZSAmJiB2YWx1ZSA8PSB0b1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLnZhbHVlLmluZGV4T2YodmFsdWUpICE9PSAtMVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gdGhpcy52YWx1ZVxuICAgIH0sXG4gIH0sXG59KVxuIl19