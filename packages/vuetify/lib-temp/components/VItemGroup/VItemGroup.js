// Styles
import './VItemGroup.sass';
import Proxyable from '../../mixins/proxyable';
import Themeable from '../../mixins/themeable';
// Utilities
import mixins from '../../util/mixins';
import { consoleWarn } from '../../util/console';
export const BaseItemGroup = mixins(Proxyable, Themeable).extend({
    name: 'base-item-group',
    props: {
        activeClass: {
            type: String,
            default: 'v-item--active',
        },
        mandatory: Boolean,
        max: {
            type: [Number, String],
            default: null,
        },
        multiple: Boolean,
    },
    data() {
        return {
            // As long as a value is defined, show it
            // Otherwise, check if multiple
            // to determine which default to provide
            internalLazyValue: this.value !== undefined
                ? this.value
                : this.multiple ? [] : undefined,
            items: [],
        };
    },
    computed: {
        classes() {
            return {
                'v-item-group': true,
                ...this.themeClasses,
            };
        },
        selectedIndex() {
            return (this.selectedItem && this.items.indexOf(this.selectedItem)) || -1;
        },
        selectedItem() {
            if (this.multiple)
                return undefined;
            return this.selectedItems[0];
        },
        selectedItems() {
            return this.items.filter((item, index) => {
                return this.toggleMethod(this.getValue(item, index));
            });
        },
        selectedValues() {
            if (this.internalValue == null)
                return [];
            return Array.isArray(this.internalValue)
                ? this.internalValue
                : [this.internalValue];
        },
        toggleMethod() {
            if (!this.multiple) {
                return (v) => this.internalValue === v;
            }
            const internalValue = this.internalValue;
            if (Array.isArray(internalValue)) {
                return (v) => internalValue.includes(v);
            }
            return () => false;
        },
    },
    watch: {
        internalValue: 'updateItemsState',
        items: 'updateItemsState',
    },
    created() {
        if (this.multiple && !Array.isArray(this.internalValue)) {
            consoleWarn('Model must be bound to an array if the multiple property is true.', this);
        }
    },
    methods: {
        genData() {
            return {
                class: this.classes,
            };
        },
        getValue(item, i) {
            return item.value == null || item.value === ''
                ? i
                : item.value;
        },
        onClick(item) {
            this.updateInternalValue(this.getValue(item, this.items.indexOf(item)));
        },
        register(item) {
            const index = this.items.push(item) - 1;
            item.$on('change', () => this.onClick(item));
            // If no value provided and mandatory,
            // assign first registered item
            if (this.mandatory && !this.selectedValues.length) {
                this.updateMandatory();
            }
            this.updateItem(item, index);
        },
        unregister(item) {
            if (this._isDestroyed)
                return;
            const index = this.items.indexOf(item);
            const value = this.getValue(item, index);
            this.items.splice(index, 1);
            const valueIndex = this.selectedValues.indexOf(value);
            // Items is not selected, do nothing
            if (valueIndex < 0)
                return;
            // If not mandatory, use regular update process
            if (!this.mandatory) {
                return this.updateInternalValue(value);
            }
            // Remove the value
            if (this.multiple && Array.isArray(this.internalValue)) {
                this.internalValue = this.internalValue.filter(v => v !== value);
            }
            else {
                this.internalValue = undefined;
            }
            // If mandatory and we have no selection
            // add the last item as value
            /* istanbul ignore else */
            if (!this.selectedItems.length) {
                this.updateMandatory(true);
            }
        },
        updateItem(item, index) {
            const value = this.getValue(item, index);
            item.isActive = this.toggleMethod(value);
        },
        // https://github.com/vuetifyjs/vuetify/issues/5352
        updateItemsState() {
            this.$nextTick(() => {
                if (this.mandatory &&
                    !this.selectedItems.length) {
                    return this.updateMandatory();
                }
                // TODO: Make this smarter so it
                // doesn't have to iterate every
                // child in an update
                this.items.forEach(this.updateItem);
            });
        },
        updateInternalValue(value) {
            this.multiple
                ? this.updateMultiple(value)
                : this.updateSingle(value);
        },
        updateMandatory(last) {
            if (!this.items.length)
                return;
            const items = this.items.slice();
            if (last)
                items.reverse();
            const item = items.find(item => !item.disabled);
            // If no tabs are available
            // aborts mandatory value
            if (!item)
                return;
            const index = this.items.indexOf(item);
            this.updateInternalValue(this.getValue(item, index));
        },
        updateMultiple(value) {
            const defaultValue = Array.isArray(this.internalValue)
                ? this.internalValue
                : [];
            const internalValue = defaultValue.slice();
            const index = internalValue.findIndex(val => val === value);
            if (this.mandatory &&
                // Item already exists
                index > -1 &&
                // value would be reduced below min
                internalValue.length - 1 < 1)
                return;
            if (
            // Max is set
            this.max != null &&
                // Item doesn't exist
                index < 0 &&
                // value would be increased above max
                internalValue.length + 1 > this.max)
                return;
            index > -1
                ? internalValue.splice(index, 1)
                : internalValue.push(value);
            this.internalValue = internalValue;
        },
        updateSingle(value) {
            const isSame = value === this.internalValue;
            if (this.mandatory && isSame)
                return;
            this.internalValue = isSame ? undefined : value;
        },
    },
    render(h) {
        return h('div', this.genData(), this.$slots.default);
    },
});
export default BaseItemGroup.extend({
    name: 'v-item-group',
    provide() {
        return {
            itemGroup: this,
        };
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkl0ZW1Hcm91cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZJdGVtR3JvdXAvVkl0ZW1Hcm91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxtQkFBbUIsQ0FBQTtBQUkxQixPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUU5QyxZQUFZO0FBQ1osT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFDdEMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBV2hELE1BQU0sQ0FBQyxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQ2pDLFNBQVMsRUFDVCxTQUFTLENBQ1YsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUsaUJBQWlCO0lBRXZCLEtBQUssRUFBRTtRQUNMLFdBQVcsRUFBRTtZQUNYLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLGdCQUFnQjtTQUMxQjtRQUNELFNBQVMsRUFBRSxPQUFPO1FBQ2xCLEdBQUcsRUFBRTtZQUNILElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxFQUFFLElBQUk7U0FDZDtRQUNELFFBQVEsRUFBRSxPQUFPO0tBQ2xCO0lBRUQsSUFBSTtRQUNGLE9BQU87WUFDTCx5Q0FBeUM7WUFDekMsK0JBQStCO1lBQy9CLHdDQUF3QztZQUN4QyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVM7Z0JBQ3pDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSztnQkFDWixDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTO1lBQ2xDLEtBQUssRUFBRSxFQUF5QjtTQUNqQyxDQUFBO0lBQ0gsQ0FBQztJQUVELFFBQVEsRUFBRTtRQUNSLE9BQU87WUFDTCxPQUFPO2dCQUNMLGNBQWMsRUFBRSxJQUFJO2dCQUNwQixHQUFHLElBQUksQ0FBQyxZQUFZO2FBQ3JCLENBQUE7UUFDSCxDQUFDO1FBQ0QsYUFBYTtZQUNYLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1FBQzNFLENBQUM7UUFDRCxZQUFZO1lBQ1YsSUFBSSxJQUFJLENBQUMsUUFBUTtnQkFBRSxPQUFPLFNBQVMsQ0FBQTtZQUVuQyxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDOUIsQ0FBQztRQUNELGFBQWE7WUFDWCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUN2QyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQTtZQUN0RCxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUM7UUFDRCxjQUFjO1lBQ1osSUFBSSxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUk7Z0JBQUUsT0FBTyxFQUFFLENBQUE7WUFFekMsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7Z0JBQ3RDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYTtnQkFDcEIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBO1FBQzFCLENBQUM7UUFDRCxZQUFZO1lBQ1YsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2xCLE9BQU8sQ0FBQyxDQUFNLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLEtBQUssQ0FBQyxDQUFBO2FBQzVDO1lBRUQsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQTtZQUN4QyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEVBQUU7Z0JBQ2hDLE9BQU8sQ0FBQyxDQUFNLEVBQUUsRUFBRSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUE7YUFDN0M7WUFFRCxPQUFPLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQTtRQUNwQixDQUFDO0tBQ0Y7SUFFRCxLQUFLLEVBQUU7UUFDTCxhQUFhLEVBQUUsa0JBQWtCO1FBQ2pDLEtBQUssRUFBRSxrQkFBa0I7S0FDMUI7SUFFRCxPQUFPO1FBQ0wsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUU7WUFDdkQsV0FBVyxDQUFDLG1FQUFtRSxFQUFFLElBQUksQ0FBQyxDQUFBO1NBQ3ZGO0lBQ0gsQ0FBQztJQUVELE9BQU8sRUFBRTtRQUVQLE9BQU87WUFDTCxPQUFPO2dCQUNMLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTzthQUNwQixDQUFBO1FBQ0gsQ0FBQztRQUNELFFBQVEsQ0FBRSxJQUF1QixFQUFFLENBQVM7WUFDMUMsT0FBTyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLEVBQUU7Z0JBQzVDLENBQUMsQ0FBQyxDQUFDO2dCQUNILENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFBO1FBQ2hCLENBQUM7UUFDRCxPQUFPLENBQUUsSUFBdUI7WUFDOUIsSUFBSSxDQUFDLG1CQUFtQixDQUN0QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUM5QyxDQUFBO1FBQ0gsQ0FBQztRQUNELFFBQVEsQ0FBRSxJQUF1QjtZQUMvQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7WUFFdkMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1lBRTVDLHNDQUFzQztZQUN0QywrQkFBK0I7WUFDL0IsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUU7Z0JBQ2pELElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQTthQUN2QjtZQUVELElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFBO1FBQzlCLENBQUM7UUFDRCxVQUFVLENBQUUsSUFBdUI7WUFDakMsSUFBSSxJQUFJLENBQUMsWUFBWTtnQkFBRSxPQUFNO1lBRTdCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ3RDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFBO1lBRXhDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQTtZQUUzQixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUVyRCxvQ0FBb0M7WUFDcEMsSUFBSSxVQUFVLEdBQUcsQ0FBQztnQkFBRSxPQUFNO1lBRTFCLCtDQUErQztZQUMvQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDbkIsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUE7YUFDdkM7WUFFRCxtQkFBbUI7WUFDbkIsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFO2dCQUN0RCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFBO2FBQ2pFO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxhQUFhLEdBQUcsU0FBUyxDQUFBO2FBQy9CO1lBRUQsd0NBQXdDO1lBQ3hDLDZCQUE2QjtZQUM3QiwwQkFBMEI7WUFDMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFO2dCQUM5QixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFBO2FBQzNCO1FBQ0gsQ0FBQztRQUNELFVBQVUsQ0FBRSxJQUF1QixFQUFFLEtBQWE7WUFDaEQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUE7WUFFeEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQzFDLENBQUM7UUFDRCxtREFBbUQ7UUFDbkQsZ0JBQWdCO1lBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2xCLElBQUksSUFBSSxDQUFDLFNBQVM7b0JBQ2hCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQzFCO29CQUNBLE9BQU8sSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFBO2lCQUM5QjtnQkFFRCxnQ0FBZ0M7Z0JBQ2hDLGdDQUFnQztnQkFDaEMscUJBQXFCO2dCQUNyQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7WUFDckMsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDO1FBQ0QsbUJBQW1CLENBQUUsS0FBVTtZQUM3QixJQUFJLENBQUMsUUFBUTtnQkFDWCxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUM7Z0JBQzVCLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQzlCLENBQUM7UUFDRCxlQUFlLENBQUUsSUFBYztZQUM3QixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNO2dCQUFFLE9BQU07WUFFOUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQTtZQUVoQyxJQUFJLElBQUk7Z0JBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFBO1lBRXpCLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUUvQywyQkFBMkI7WUFDM0IseUJBQXlCO1lBQ3pCLElBQUksQ0FBQyxJQUFJO2dCQUFFLE9BQU07WUFFakIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7WUFFdEMsSUFBSSxDQUFDLG1CQUFtQixDQUN0QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FDM0IsQ0FBQTtRQUNILENBQUM7UUFDRCxjQUFjLENBQUUsS0FBVTtZQUN4QixNQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7Z0JBQ3BELENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYTtnQkFDcEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtZQUNOLE1BQU0sYUFBYSxHQUFHLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQTtZQUMxQyxNQUFNLEtBQUssR0FBRyxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEtBQUssQ0FBQyxDQUFBO1lBRTNELElBQ0UsSUFBSSxDQUFDLFNBQVM7Z0JBQ2Qsc0JBQXNCO2dCQUN0QixLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUNWLG1DQUFtQztnQkFDbkMsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQztnQkFDNUIsT0FBTTtZQUVSO1lBQ0UsYUFBYTtZQUNiLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSTtnQkFDaEIscUJBQXFCO2dCQUNyQixLQUFLLEdBQUcsQ0FBQztnQkFDVCxxQ0FBcUM7Z0JBQ3JDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHO2dCQUNuQyxPQUFNO1lBRVIsS0FBSyxHQUFHLENBQUMsQ0FBQztnQkFDUixDQUFDLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUNoQyxDQUFDLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUU3QixJQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQTtRQUNwQyxDQUFDO1FBQ0QsWUFBWSxDQUFFLEtBQVU7WUFDdEIsTUFBTSxNQUFNLEdBQUcsS0FBSyxLQUFLLElBQUksQ0FBQyxhQUFhLENBQUE7WUFFM0MsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLE1BQU07Z0JBQUUsT0FBTTtZQUVwQyxJQUFJLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUE7UUFDakQsQ0FBQztLQUNGO0lBRUQsTUFBTSxDQUFFLENBQUM7UUFDUCxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDdEQsQ0FBQztDQUNGLENBQUMsQ0FBQTtBQUVGLGVBQWUsYUFBYSxDQUFDLE1BQU0sQ0FBQztJQUNsQyxJQUFJLEVBQUUsY0FBYztJQUVwQixPQUFPO1FBQ0wsT0FBTztZQUNMLFNBQVMsRUFBRSxJQUFJO1NBQ2hCLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXG5pbXBvcnQgJy4vVkl0ZW1Hcm91cC5zYXNzJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBHcm91cGFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2dyb3VwYWJsZSdcbmltcG9ydCBQcm94eWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3Byb3h5YWJsZSdcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuaW1wb3J0IHsgY29uc29sZVdhcm4gfSBmcm9tICcuLi8uLi91dGlsL2NvbnNvbGUnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZS90eXBlcydcblxuZXhwb3J0IHR5cGUgR3JvdXBhYmxlSW5zdGFuY2UgPSBJbnN0YW5jZVR5cGU8dHlwZW9mIEdyb3VwYWJsZT4gJiB7XG4gIGlkPzogc3RyaW5nXG4gIHRvPzogYW55XG4gIHZhbHVlPzogYW55XG4gfVxuXG5leHBvcnQgY29uc3QgQmFzZUl0ZW1Hcm91cCA9IG1peGlucyhcbiAgUHJveHlhYmxlLFxuICBUaGVtZWFibGVcbikuZXh0ZW5kKHtcbiAgbmFtZTogJ2Jhc2UtaXRlbS1ncm91cCcsXG5cbiAgcHJvcHM6IHtcbiAgICBhY3RpdmVDbGFzczoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJ3YtaXRlbS0tYWN0aXZlJyxcbiAgICB9LFxuICAgIG1hbmRhdG9yeTogQm9vbGVhbixcbiAgICBtYXg6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiBudWxsLFxuICAgIH0sXG4gICAgbXVsdGlwbGU6IEJvb2xlYW4sXG4gIH0sXG5cbiAgZGF0YSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC8vIEFzIGxvbmcgYXMgYSB2YWx1ZSBpcyBkZWZpbmVkLCBzaG93IGl0XG4gICAgICAvLyBPdGhlcndpc2UsIGNoZWNrIGlmIG11bHRpcGxlXG4gICAgICAvLyB0byBkZXRlcm1pbmUgd2hpY2ggZGVmYXVsdCB0byBwcm92aWRlXG4gICAgICBpbnRlcm5hbExhenlWYWx1ZTogdGhpcy52YWx1ZSAhPT0gdW5kZWZpbmVkXG4gICAgICAgID8gdGhpcy52YWx1ZVxuICAgICAgICA6IHRoaXMubXVsdGlwbGUgPyBbXSA6IHVuZGVmaW5lZCxcbiAgICAgIGl0ZW1zOiBbXSBhcyBHcm91cGFibGVJbnN0YW5jZVtdLFxuICAgIH1cbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGNsYXNzZXMgKCk6IFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICd2LWl0ZW0tZ3JvdXAnOiB0cnVlLFxuICAgICAgICAuLi50aGlzLnRoZW1lQ2xhc3NlcyxcbiAgICAgIH1cbiAgICB9LFxuICAgIHNlbGVjdGVkSW5kZXggKCk6IG51bWJlciB7XG4gICAgICByZXR1cm4gKHRoaXMuc2VsZWN0ZWRJdGVtICYmIHRoaXMuaXRlbXMuaW5kZXhPZih0aGlzLnNlbGVjdGVkSXRlbSkpIHx8IC0xXG4gICAgfSxcbiAgICBzZWxlY3RlZEl0ZW0gKCk6IEdyb3VwYWJsZUluc3RhbmNlIHwgdW5kZWZpbmVkIHtcbiAgICAgIGlmICh0aGlzLm11bHRpcGxlKSByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkSXRlbXNbMF1cbiAgICB9LFxuICAgIHNlbGVjdGVkSXRlbXMgKCk6IEdyb3VwYWJsZUluc3RhbmNlW10ge1xuICAgICAgcmV0dXJuIHRoaXMuaXRlbXMuZmlsdGVyKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy50b2dnbGVNZXRob2QodGhpcy5nZXRWYWx1ZShpdGVtLCBpbmRleCkpXG4gICAgICB9KVxuICAgIH0sXG4gICAgc2VsZWN0ZWRWYWx1ZXMgKCk6IGFueVtdIHtcbiAgICAgIGlmICh0aGlzLmludGVybmFsVmFsdWUgPT0gbnVsbCkgcmV0dXJuIFtdXG5cbiAgICAgIHJldHVybiBBcnJheS5pc0FycmF5KHRoaXMuaW50ZXJuYWxWYWx1ZSlcbiAgICAgICAgPyB0aGlzLmludGVybmFsVmFsdWVcbiAgICAgICAgOiBbdGhpcy5pbnRlcm5hbFZhbHVlXVxuICAgIH0sXG4gICAgdG9nZ2xlTWV0aG9kICgpOiAodjogYW55KSA9PiBib29sZWFuIHtcbiAgICAgIGlmICghdGhpcy5tdWx0aXBsZSkge1xuICAgICAgICByZXR1cm4gKHY6IGFueSkgPT4gdGhpcy5pbnRlcm5hbFZhbHVlID09PSB2XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGludGVybmFsVmFsdWUgPSB0aGlzLmludGVybmFsVmFsdWVcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGludGVybmFsVmFsdWUpKSB7XG4gICAgICAgIHJldHVybiAodjogYW55KSA9PiBpbnRlcm5hbFZhbHVlLmluY2x1ZGVzKHYpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiAoKSA9PiBmYWxzZVxuICAgIH0sXG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICBpbnRlcm5hbFZhbHVlOiAndXBkYXRlSXRlbXNTdGF0ZScsXG4gICAgaXRlbXM6ICd1cGRhdGVJdGVtc1N0YXRlJyxcbiAgfSxcblxuICBjcmVhdGVkICgpIHtcbiAgICBpZiAodGhpcy5tdWx0aXBsZSAmJiAhQXJyYXkuaXNBcnJheSh0aGlzLmludGVybmFsVmFsdWUpKSB7XG4gICAgICBjb25zb2xlV2FybignTW9kZWwgbXVzdCBiZSBib3VuZCB0byBhbiBhcnJheSBpZiB0aGUgbXVsdGlwbGUgcHJvcGVydHkgaXMgdHJ1ZS4nLCB0aGlzKVxuICAgIH1cbiAgfSxcblxuICBtZXRob2RzOiB7XG5cbiAgICBnZW5EYXRhICgpOiBvYmplY3Qge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY2xhc3M6IHRoaXMuY2xhc3NlcyxcbiAgICAgIH1cbiAgICB9LFxuICAgIGdldFZhbHVlIChpdGVtOiBHcm91cGFibGVJbnN0YW5jZSwgaTogbnVtYmVyKTogdW5rbm93biB7XG4gICAgICByZXR1cm4gaXRlbS52YWx1ZSA9PSBudWxsIHx8IGl0ZW0udmFsdWUgPT09ICcnXG4gICAgICAgID8gaVxuICAgICAgICA6IGl0ZW0udmFsdWVcbiAgICB9LFxuICAgIG9uQ2xpY2sgKGl0ZW06IEdyb3VwYWJsZUluc3RhbmNlKSB7XG4gICAgICB0aGlzLnVwZGF0ZUludGVybmFsVmFsdWUoXG4gICAgICAgIHRoaXMuZ2V0VmFsdWUoaXRlbSwgdGhpcy5pdGVtcy5pbmRleE9mKGl0ZW0pKVxuICAgICAgKVxuICAgIH0sXG4gICAgcmVnaXN0ZXIgKGl0ZW06IEdyb3VwYWJsZUluc3RhbmNlKSB7XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuaXRlbXMucHVzaChpdGVtKSAtIDFcblxuICAgICAgaXRlbS4kb24oJ2NoYW5nZScsICgpID0+IHRoaXMub25DbGljayhpdGVtKSlcblxuICAgICAgLy8gSWYgbm8gdmFsdWUgcHJvdmlkZWQgYW5kIG1hbmRhdG9yeSxcbiAgICAgIC8vIGFzc2lnbiBmaXJzdCByZWdpc3RlcmVkIGl0ZW1cbiAgICAgIGlmICh0aGlzLm1hbmRhdG9yeSAmJiAhdGhpcy5zZWxlY3RlZFZhbHVlcy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy51cGRhdGVNYW5kYXRvcnkoKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnVwZGF0ZUl0ZW0oaXRlbSwgaW5kZXgpXG4gICAgfSxcbiAgICB1bnJlZ2lzdGVyIChpdGVtOiBHcm91cGFibGVJbnN0YW5jZSkge1xuICAgICAgaWYgKHRoaXMuX2lzRGVzdHJveWVkKSByZXR1cm5cblxuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLml0ZW1zLmluZGV4T2YoaXRlbSlcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5nZXRWYWx1ZShpdGVtLCBpbmRleClcblxuICAgICAgdGhpcy5pdGVtcy5zcGxpY2UoaW5kZXgsIDEpXG5cbiAgICAgIGNvbnN0IHZhbHVlSW5kZXggPSB0aGlzLnNlbGVjdGVkVmFsdWVzLmluZGV4T2YodmFsdWUpXG5cbiAgICAgIC8vIEl0ZW1zIGlzIG5vdCBzZWxlY3RlZCwgZG8gbm90aGluZ1xuICAgICAgaWYgKHZhbHVlSW5kZXggPCAwKSByZXR1cm5cblxuICAgICAgLy8gSWYgbm90IG1hbmRhdG9yeSwgdXNlIHJlZ3VsYXIgdXBkYXRlIHByb2Nlc3NcbiAgICAgIGlmICghdGhpcy5tYW5kYXRvcnkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlSW50ZXJuYWxWYWx1ZSh2YWx1ZSlcbiAgICAgIH1cblxuICAgICAgLy8gUmVtb3ZlIHRoZSB2YWx1ZVxuICAgICAgaWYgKHRoaXMubXVsdGlwbGUgJiYgQXJyYXkuaXNBcnJheSh0aGlzLmludGVybmFsVmFsdWUpKSB7XG4gICAgICAgIHRoaXMuaW50ZXJuYWxWYWx1ZSA9IHRoaXMuaW50ZXJuYWxWYWx1ZS5maWx0ZXIodiA9PiB2ICE9PSB2YWx1ZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaW50ZXJuYWxWYWx1ZSA9IHVuZGVmaW5lZFxuICAgICAgfVxuXG4gICAgICAvLyBJZiBtYW5kYXRvcnkgYW5kIHdlIGhhdmUgbm8gc2VsZWN0aW9uXG4gICAgICAvLyBhZGQgdGhlIGxhc3QgaXRlbSBhcyB2YWx1ZVxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgIGlmICghdGhpcy5zZWxlY3RlZEl0ZW1zLmxlbmd0aCkge1xuICAgICAgICB0aGlzLnVwZGF0ZU1hbmRhdG9yeSh0cnVlKVxuICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlSXRlbSAoaXRlbTogR3JvdXBhYmxlSW5zdGFuY2UsIGluZGV4OiBudW1iZXIpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5nZXRWYWx1ZShpdGVtLCBpbmRleClcblxuICAgICAgaXRlbS5pc0FjdGl2ZSA9IHRoaXMudG9nZ2xlTWV0aG9kKHZhbHVlKVxuICAgIH0sXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3Z1ZXRpZnlqcy92dWV0aWZ5L2lzc3Vlcy81MzUyXG4gICAgdXBkYXRlSXRlbXNTdGF0ZSAoKSB7XG4gICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLm1hbmRhdG9yeSAmJlxuICAgICAgICAgICF0aGlzLnNlbGVjdGVkSXRlbXMubGVuZ3RoXG4gICAgICAgICkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZU1hbmRhdG9yeSgpXG4gICAgICAgIH1cblxuICAgICAgICAvLyBUT0RPOiBNYWtlIHRoaXMgc21hcnRlciBzbyBpdFxuICAgICAgICAvLyBkb2Vzbid0IGhhdmUgdG8gaXRlcmF0ZSBldmVyeVxuICAgICAgICAvLyBjaGlsZCBpbiBhbiB1cGRhdGVcbiAgICAgICAgdGhpcy5pdGVtcy5mb3JFYWNoKHRoaXMudXBkYXRlSXRlbSlcbiAgICAgIH0pXG4gICAgfSxcbiAgICB1cGRhdGVJbnRlcm5hbFZhbHVlICh2YWx1ZTogYW55KSB7XG4gICAgICB0aGlzLm11bHRpcGxlXG4gICAgICAgID8gdGhpcy51cGRhdGVNdWx0aXBsZSh2YWx1ZSlcbiAgICAgICAgOiB0aGlzLnVwZGF0ZVNpbmdsZSh2YWx1ZSlcbiAgICB9LFxuICAgIHVwZGF0ZU1hbmRhdG9yeSAobGFzdD86IGJvb2xlYW4pIHtcbiAgICAgIGlmICghdGhpcy5pdGVtcy5sZW5ndGgpIHJldHVyblxuXG4gICAgICBjb25zdCBpdGVtcyA9IHRoaXMuaXRlbXMuc2xpY2UoKVxuXG4gICAgICBpZiAobGFzdCkgaXRlbXMucmV2ZXJzZSgpXG5cbiAgICAgIGNvbnN0IGl0ZW0gPSBpdGVtcy5maW5kKGl0ZW0gPT4gIWl0ZW0uZGlzYWJsZWQpXG5cbiAgICAgIC8vIElmIG5vIHRhYnMgYXJlIGF2YWlsYWJsZVxuICAgICAgLy8gYWJvcnRzIG1hbmRhdG9yeSB2YWx1ZVxuICAgICAgaWYgKCFpdGVtKSByZXR1cm5cblxuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLml0ZW1zLmluZGV4T2YoaXRlbSlcblxuICAgICAgdGhpcy51cGRhdGVJbnRlcm5hbFZhbHVlKFxuICAgICAgICB0aGlzLmdldFZhbHVlKGl0ZW0sIGluZGV4KVxuICAgICAgKVxuICAgIH0sXG4gICAgdXBkYXRlTXVsdGlwbGUgKHZhbHVlOiBhbnkpIHtcbiAgICAgIGNvbnN0IGRlZmF1bHRWYWx1ZSA9IEFycmF5LmlzQXJyYXkodGhpcy5pbnRlcm5hbFZhbHVlKVxuICAgICAgICA/IHRoaXMuaW50ZXJuYWxWYWx1ZVxuICAgICAgICA6IFtdXG4gICAgICBjb25zdCBpbnRlcm5hbFZhbHVlID0gZGVmYXVsdFZhbHVlLnNsaWNlKClcbiAgICAgIGNvbnN0IGluZGV4ID0gaW50ZXJuYWxWYWx1ZS5maW5kSW5kZXgodmFsID0+IHZhbCA9PT0gdmFsdWUpXG5cbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy5tYW5kYXRvcnkgJiZcbiAgICAgICAgLy8gSXRlbSBhbHJlYWR5IGV4aXN0c1xuICAgICAgICBpbmRleCA+IC0xICYmXG4gICAgICAgIC8vIHZhbHVlIHdvdWxkIGJlIHJlZHVjZWQgYmVsb3cgbWluXG4gICAgICAgIGludGVybmFsVmFsdWUubGVuZ3RoIC0gMSA8IDFcbiAgICAgICkgcmV0dXJuXG5cbiAgICAgIGlmIChcbiAgICAgICAgLy8gTWF4IGlzIHNldFxuICAgICAgICB0aGlzLm1heCAhPSBudWxsICYmXG4gICAgICAgIC8vIEl0ZW0gZG9lc24ndCBleGlzdFxuICAgICAgICBpbmRleCA8IDAgJiZcbiAgICAgICAgLy8gdmFsdWUgd291bGQgYmUgaW5jcmVhc2VkIGFib3ZlIG1heFxuICAgICAgICBpbnRlcm5hbFZhbHVlLmxlbmd0aCArIDEgPiB0aGlzLm1heFxuICAgICAgKSByZXR1cm5cblxuICAgICAgaW5kZXggPiAtMVxuICAgICAgICA/IGludGVybmFsVmFsdWUuc3BsaWNlKGluZGV4LCAxKVxuICAgICAgICA6IGludGVybmFsVmFsdWUucHVzaCh2YWx1ZSlcblxuICAgICAgdGhpcy5pbnRlcm5hbFZhbHVlID0gaW50ZXJuYWxWYWx1ZVxuICAgIH0sXG4gICAgdXBkYXRlU2luZ2xlICh2YWx1ZTogYW55KSB7XG4gICAgICBjb25zdCBpc1NhbWUgPSB2YWx1ZSA9PT0gdGhpcy5pbnRlcm5hbFZhbHVlXG5cbiAgICAgIGlmICh0aGlzLm1hbmRhdG9yeSAmJiBpc1NhbWUpIHJldHVyblxuXG4gICAgICB0aGlzLmludGVybmFsVmFsdWUgPSBpc1NhbWUgPyB1bmRlZmluZWQgOiB2YWx1ZVxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyIChoKTogVk5vZGUge1xuICAgIHJldHVybiBoKCdkaXYnLCB0aGlzLmdlbkRhdGEoKSwgdGhpcy4kc2xvdHMuZGVmYXVsdClcbiAgfSxcbn0pXG5cbmV4cG9ydCBkZWZhdWx0IEJhc2VJdGVtR3JvdXAuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtaXRlbS1ncm91cCcsXG5cbiAgcHJvdmlkZSAoKTogb2JqZWN0IHtcbiAgICByZXR1cm4ge1xuICAgICAgaXRlbUdyb3VwOiB0aGlzLFxuICAgIH1cbiAgfSxcbn0pXG4iXX0=