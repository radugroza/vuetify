// Styles
import './VAutocomplete.sass';
// Extensions
import VSelect, { defaultMenuProps as VSelectMenuProps } from '../VSelect/VSelect';
import VTextField from '../VTextField/VTextField';
// Utilities
import mergeData from '../../util/mergeData';
import { getObjectValueByPath, getPropertyFromItem, keyCodes, } from '../../util/helpers';
const defaultMenuProps = {
    ...VSelectMenuProps,
    offsetY: true,
    offsetOverflow: true,
    transition: false,
};
/* @vue/component */
export default VSelect.extend({
    name: 'v-autocomplete',
    props: {
        allowOverflow: {
            type: Boolean,
            default: true,
        },
        autoSelectFirst: {
            type: Boolean,
            default: false,
        },
        filter: {
            type: Function,
            default: (item, queryText, itemText) => {
                return itemText.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1;
            },
        },
        hideNoData: Boolean,
        menuProps: {
            type: VSelect.options.props.menuProps.type,
            default: () => defaultMenuProps,
        },
        noFilter: Boolean,
        searchInput: {
            type: String,
            default: undefined,
        },
    },
    data() {
        return {
            lazySearch: this.searchInput,
        };
    },
    computed: {
        classes() {
            return {
                ...VSelect.options.computed.classes.call(this),
                'v-autocomplete': true,
                'v-autocomplete--is-selecting-index': this.selectedIndex > -1,
            };
        },
        computedItems() {
            return this.filteredItems;
        },
        selectedValues() {
            return this.selectedItems.map(item => this.getValue(item));
        },
        hasDisplayedItems() {
            return this.hideSelected
                ? this.filteredItems.some(item => !this.hasItem(item))
                : this.filteredItems.length > 0;
        },
        currentRange() {
            if (this.selectedItem == null)
                return 0;
            return String(this.getText(this.selectedItem)).length;
        },
        filteredItems() {
            if (!this.isSearching || this.noFilter || this.internalSearch == null)
                return this.allItems;
            return this.allItems.filter(item => {
                const value = getPropertyFromItem(item, this.itemText);
                const text = value != null ? String(value) : '';
                return this.filter(item, String(this.internalSearch), text);
            });
        },
        internalSearch: {
            get() {
                return this.lazySearch;
            },
            set(val) {
                this.lazySearch = val;
                this.$emit('update:search-input', val);
            },
        },
        isAnyValueAllowed() {
            return false;
        },
        isDirty() {
            return this.searchIsDirty || this.selectedItems.length > 0;
        },
        isSearching() {
            return (this.multiple &&
                this.searchIsDirty) || (this.searchIsDirty &&
                this.internalSearch !== this.getText(this.selectedItem));
        },
        menuCanShow() {
            if (!this.isFocused)
                return false;
            return this.hasDisplayedItems || !this.hideNoData;
        },
        $_menuProps() {
            const props = VSelect.options.computed.$_menuProps.call(this);
            props.contentClass = `v-autocomplete__content ${props.contentClass || ''}`.trim();
            return {
                ...defaultMenuProps,
                ...props,
            };
        },
        searchIsDirty() {
            return this.internalSearch != null &&
                this.internalSearch !== '';
        },
        selectedItem() {
            if (this.multiple)
                return null;
            return this.selectedItems.find(i => {
                return this.valueComparator(this.getValue(i), this.getValue(this.internalValue));
            });
        },
        listData() {
            const data = VSelect.options.computed.listData.call(this);
            data.props = {
                ...data.props,
                items: this.virtualizedItems,
                noFilter: (this.noFilter ||
                    !this.isSearching ||
                    !this.filteredItems.length),
                searchInput: this.internalSearch,
            };
            return data;
        },
    },
    watch: {
        filteredItems: 'onFilteredItemsChanged',
        internalValue: 'setSearch',
        isFocused(val) {
            if (val) {
                document.addEventListener('copy', this.onCopy);
                this.$refs.input && this.$refs.input.select();
            }
            else {
                document.removeEventListener('copy', this.onCopy);
                this.updateSelf();
            }
        },
        isMenuActive(val) {
            if (val || !this.hasSlot)
                return;
            this.lazySearch = undefined;
        },
        items(val, oldVal) {
            // If we are focused, the menu
            // is not active, hide no data is enabled,
            // and items change
            // User is probably async loading
            // items, try to activate the menu
            if (!(oldVal && oldVal.length) &&
                this.hideNoData &&
                this.isFocused &&
                !this.isMenuActive &&
                val.length)
                this.activateMenu();
        },
        searchInput(val) {
            this.lazySearch = val;
        },
        internalSearch: 'onInternalSearchChanged',
        itemText: 'updateSelf',
    },
    created() {
        this.setSearch();
    },
    destroyed() {
        document.removeEventListener('copy', this.onCopy);
    },
    methods: {
        onFilteredItemsChanged(val, oldVal) {
            // TODO: How is the watcher triggered
            // for duplicate items? no idea
            if (val === oldVal)
                return;
            this.setMenuIndex(-1);
            this.$nextTick(() => {
                if (!this.internalSearch ||
                    (val.length !== 1 &&
                        !this.autoSelectFirst))
                    return;
                this.$refs.menu.getTiles();
                this.setMenuIndex(0);
            });
        },
        onInternalSearchChanged() {
            this.updateMenuDimensions();
        },
        updateMenuDimensions() {
            // Type from menuable is not making it through
            this.isMenuActive && this.$refs.menu && this.$refs.menu.updateDimensions();
        },
        changeSelectedIndex(keyCode) {
            // Do not allow changing of selectedIndex
            // when search is dirty
            if (this.searchIsDirty)
                return;
            if (this.multiple && keyCode === keyCodes.left) {
                if (this.selectedIndex === -1) {
                    this.selectedIndex = this.selectedItems.length - 1;
                }
                else {
                    this.selectedIndex--;
                }
            }
            else if (this.multiple && keyCode === keyCodes.right) {
                if (this.selectedIndex >= this.selectedItems.length - 1) {
                    this.selectedIndex = -1;
                }
                else {
                    this.selectedIndex++;
                }
            }
            else if (keyCode === keyCodes.backspace || keyCode === keyCodes.delete) {
                this.deleteCurrentItem();
            }
        },
        deleteCurrentItem() {
            const curIndex = this.selectedIndex;
            const curItem = this.selectedItems[curIndex];
            // Do nothing if input or item is disabled
            if (!this.isInteractive ||
                this.getDisabled(curItem))
                return;
            const lastIndex = this.selectedItems.length - 1;
            // Select the last item if
            // there is no selection
            if (this.selectedIndex === -1 &&
                lastIndex !== 0) {
                this.selectedIndex = lastIndex;
                return;
            }
            const length = this.selectedItems.length;
            const nextIndex = curIndex !== length - 1
                ? curIndex
                : curIndex - 1;
            const nextItem = this.selectedItems[nextIndex];
            if (!nextItem) {
                this.setValue(this.multiple ? [] : undefined);
            }
            else {
                this.selectItem(curItem);
            }
            this.selectedIndex = nextIndex;
        },
        clearableCallback() {
            this.internalSearch = undefined;
            VSelect.options.methods.clearableCallback.call(this);
        },
        genInput() {
            const input = VTextField.options.methods.genInput.call(this);
            input.data = mergeData(input.data, {
                attrs: {
                    'aria-activedescendant': getObjectValueByPath(this.$refs.menu, 'activeTile.id'),
                    autocomplete: getObjectValueByPath(input.data, 'attrs.autocomplete', 'off'),
                },
                domProps: { value: this.internalSearch },
            });
            return input;
        },
        genInputSlot() {
            const slot = VSelect.options.methods.genInputSlot.call(this);
            slot.data.attrs.role = 'combobox';
            return slot;
        },
        genSelections() {
            return this.hasSlot || this.multiple
                ? VSelect.options.methods.genSelections.call(this)
                : [];
        },
        onClick(e) {
            if (!this.isInteractive)
                return;
            this.selectedIndex > -1
                ? (this.selectedIndex = -1)
                : this.onFocus();
            if (!this.isAppendInner(e.target))
                this.activateMenu();
        },
        onInput(e) {
            if (this.selectedIndex > -1 ||
                !e.target)
                return;
            const target = e.target;
            const value = target.value;
            // If typing and menu is not currently active
            if (target.value)
                this.activateMenu();
            this.internalSearch = value;
            this.badInput = target.validity && target.validity.badInput;
        },
        onKeyDown(e) {
            const keyCode = e.keyCode;
            VSelect.options.methods.onKeyDown.call(this, e);
            // The ordering is important here
            // allows new value to be updated
            // and then moves the index to the
            // proper location
            this.changeSelectedIndex(keyCode);
        },
        onSpaceDown(e) { },
        onTabDown(e) {
            VSelect.options.methods.onTabDown.call(this, e);
            this.updateSelf();
        },
        onUpDown(e) {
            // Prevent screen from scrolling
            e.preventDefault();
            // For autocomplete / combobox, cycling
            // interfers with native up/down behavior
            // instead activate the menu
            this.activateMenu();
        },
        selectItem(item) {
            VSelect.options.methods.selectItem.call(this, item);
            this.setSearch();
        },
        setSelectedItems() {
            VSelect.options.methods.setSelectedItems.call(this);
            // #4273 Don't replace if searching
            // #4403 Don't replace if focused
            if (!this.isFocused)
                this.setSearch();
        },
        setSearch() {
            // Wait for nextTick so selectedItem
            // has had time to update
            this.$nextTick(() => {
                if (!this.multiple ||
                    !this.internalSearch ||
                    !this.isMenuActive) {
                    this.internalSearch = (!this.selectedItems.length ||
                        this.multiple ||
                        this.hasSlot)
                        ? null
                        : this.getText(this.selectedItem);
                }
            });
        },
        updateSelf() {
            if (!this.searchIsDirty &&
                !this.internalValue)
                return;
            if (!this.valueComparator(this.internalSearch, this.getValue(this.internalValue))) {
                this.setSearch();
            }
        },
        hasItem(item) {
            return this.selectedValues.indexOf(this.getValue(item)) > -1;
        },
        onCopy(event) {
            if (this.selectedIndex === -1)
                return;
            const currentItem = this.selectedItems[this.selectedIndex];
            const currentItemText = this.getText(currentItem);
            event.clipboardData.setData('text/plain', currentItemText);
            event.clipboardData.setData('text/vnd.vuetify.autocomplete.item+plain', currentItemText);
            event.preventDefault();
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkF1dG9jb21wbGV0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZBdXRvY29tcGxldGUvVkF1dG9jb21wbGV0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxzQkFBc0IsQ0FBQTtBQUU3QixhQUFhO0FBQ2IsT0FBTyxPQUFPLEVBQUUsRUFBRSxnQkFBZ0IsSUFBSSxnQkFBZ0IsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQ2xGLE9BQU8sVUFBVSxNQUFNLDBCQUEwQixDQUFBO0FBRWpELFlBQVk7QUFDWixPQUFPLFNBQVMsTUFBTSxzQkFBc0IsQ0FBQTtBQUM1QyxPQUFPLEVBQ0wsb0JBQW9CLEVBQ3BCLG1CQUFtQixFQUNuQixRQUFRLEdBQ1QsTUFBTSxvQkFBb0IsQ0FBQTtBQUszQixNQUFNLGdCQUFnQixHQUFHO0lBQ3ZCLEdBQUcsZ0JBQWdCO0lBQ25CLE9BQU8sRUFBRSxJQUFJO0lBQ2IsY0FBYyxFQUFFLElBQUk7SUFDcEIsVUFBVSxFQUFFLEtBQUs7Q0FDbEIsQ0FBQTtBQUVELG9CQUFvQjtBQUNwQixlQUFlLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFDNUIsSUFBSSxFQUFFLGdCQUFnQjtJQUV0QixLQUFLLEVBQUU7UUFDTCxhQUFhLEVBQUU7WUFDYixJQUFJLEVBQUUsT0FBTztZQUNiLE9BQU8sRUFBRSxJQUFJO1NBQ2Q7UUFDRCxlQUFlLEVBQUU7WUFDZixJQUFJLEVBQUUsT0FBTztZQUNiLE9BQU8sRUFBRSxLQUFLO1NBQ2Y7UUFDRCxNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsUUFBUTtZQUNkLE9BQU8sRUFBRSxDQUFDLElBQVMsRUFBRSxTQUFpQixFQUFFLFFBQWdCLEVBQUUsRUFBRTtnQkFDMUQsT0FBTyxRQUFRLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLGlCQUFpQixFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMs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Jy4vVkF1dG9jb21wbGV0ZS5zYXNzJ1xuXG4vLyBFeHRlbnNpb25zXG5pbXBvcnQgVlNlbGVjdCwgeyBkZWZhdWx0TWVudVByb3BzIGFzIFZTZWxlY3RNZW51UHJvcHMgfSBmcm9tICcuLi9WU2VsZWN0L1ZTZWxlY3QnXG5pbXBvcnQgVlRleHRGaWVsZCBmcm9tICcuLi9WVGV4dEZpZWxkL1ZUZXh0RmllbGQnXG5cbi8vIFV0aWxpdGllc1xuaW1wb3J0IG1lcmdlRGF0YSBmcm9tICcuLi8uLi91dGlsL21lcmdlRGF0YSdcbmltcG9ydCB7XG4gIGdldE9iamVjdFZhbHVlQnlQYXRoLFxuICBnZXRQcm9wZXJ0eUZyb21JdGVtLFxuICBrZXlDb2Rlcyxcbn0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgUHJvcFR5cGUgfSBmcm9tICd2dWUnXG5cbmNvbnN0IGRlZmF1bHRNZW51UHJvcHMgPSB7XG4gIC4uLlZTZWxlY3RNZW51UHJvcHMsXG4gIG9mZnNldFk6IHRydWUsXG4gIG9mZnNldE92ZXJmbG93OiB0cnVlLFxuICB0cmFuc2l0aW9uOiBmYWxzZSxcbn1cblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IFZTZWxlY3QuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtYXV0b2NvbXBsZXRlJyxcblxuICBwcm9wczoge1xuICAgIGFsbG93T3ZlcmZsb3c6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiB0cnVlLFxuICAgIH0sXG4gICAgYXV0b1NlbGVjdEZpcnN0OiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgfSxcbiAgICBmaWx0ZXI6IHtcbiAgICAgIHR5cGU6IEZ1bmN0aW9uLFxuICAgICAgZGVmYXVsdDogKGl0ZW06IGFueSwgcXVlcnlUZXh0OiBzdHJpbmcsIGl0ZW1UZXh0OiBzdHJpbmcpID0+IHtcbiAgICAgICAgcmV0dXJuIGl0ZW1UZXh0LnRvTG9jYWxlTG93ZXJDYXNlKCkuaW5kZXhPZihxdWVyeVRleHQudG9Mb2NhbGVMb3dlckNhc2UoKSkgPiAtMVxuICAgICAgfSxcbiAgICB9LFxuICAgIGhpZGVOb0RhdGE6IEJvb2xlYW4sXG4gICAgbWVudVByb3BzOiB7XG4gICAgICB0eXBlOiBWU2VsZWN0Lm9wdGlvbnMucHJvcHMubWVudVByb3BzLnR5cGUsXG4gICAgICBkZWZhdWx0OiAoKSA9PiBkZWZhdWx0TWVudVByb3BzLFxuICAgIH0sXG4gICAgbm9GaWx0ZXI6IEJvb2xlYW4sXG4gICAgc2VhcmNoSW5wdXQ6IHtcbiAgICAgIHR5cGU6IFN0cmluZyBhcyBQcm9wVHlwZTxzdHJpbmcgfCB1bmRlZmluZWQ+LFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgIH0sXG4gIH0sXG5cbiAgZGF0YSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhenlTZWFyY2g6IHRoaXMuc2VhcmNoSW5wdXQsXG4gICAgfVxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLlZTZWxlY3Qub3B0aW9ucy5jb21wdXRlZC5jbGFzc2VzLmNhbGwodGhpcyksXG4gICAgICAgICd2LWF1dG9jb21wbGV0ZSc6IHRydWUsXG4gICAgICAgICd2LWF1dG9jb21wbGV0ZS0taXMtc2VsZWN0aW5nLWluZGV4JzogdGhpcy5zZWxlY3RlZEluZGV4ID4gLTEsXG4gICAgICB9XG4gICAgfSxcbiAgICBjb21wdXRlZEl0ZW1zICgpOiBvYmplY3RbXSB7XG4gICAgICByZXR1cm4gdGhpcy5maWx0ZXJlZEl0ZW1zXG4gICAgfSxcbiAgICBzZWxlY3RlZFZhbHVlcyAoKTogb2JqZWN0W10ge1xuICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRJdGVtcy5tYXAoaXRlbSA9PiB0aGlzLmdldFZhbHVlKGl0ZW0pKVxuICAgIH0sXG4gICAgaGFzRGlzcGxheWVkSXRlbXMgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMuaGlkZVNlbGVjdGVkXG4gICAgICAgID8gdGhpcy5maWx0ZXJlZEl0ZW1zLnNvbWUoaXRlbSA9PiAhdGhpcy5oYXNJdGVtKGl0ZW0pKVxuICAgICAgICA6IHRoaXMuZmlsdGVyZWRJdGVtcy5sZW5ndGggPiAwXG4gICAgfSxcbiAgICBjdXJyZW50UmFuZ2UgKCk6IG51bWJlciB7XG4gICAgICBpZiAodGhpcy5zZWxlY3RlZEl0ZW0gPT0gbnVsbCkgcmV0dXJuIDBcblxuICAgICAgcmV0dXJuIFN0cmluZyh0aGlzLmdldFRleHQodGhpcy5zZWxlY3RlZEl0ZW0pKS5sZW5ndGhcbiAgICB9LFxuICAgIGZpbHRlcmVkSXRlbXMgKCk6IG9iamVjdFtdIHtcbiAgICAgIGlmICghdGhpcy5pc1NlYXJjaGluZyB8fCB0aGlzLm5vRmlsdGVyIHx8IHRoaXMuaW50ZXJuYWxTZWFyY2ggPT0gbnVsbCkgcmV0dXJuIHRoaXMuYWxsSXRlbXNcblxuICAgICAgcmV0dXJuIHRoaXMuYWxsSXRlbXMuZmlsdGVyKGl0ZW0gPT4ge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGdldFByb3BlcnR5RnJvbUl0ZW0oaXRlbSwgdGhpcy5pdGVtVGV4dClcbiAgICAgICAgY29uc3QgdGV4dCA9IHZhbHVlICE9IG51bGwgPyBTdHJpbmcodmFsdWUpIDogJydcblxuICAgICAgICByZXR1cm4gdGhpcy5maWx0ZXIoaXRlbSwgU3RyaW5nKHRoaXMuaW50ZXJuYWxTZWFyY2gpLCB0ZXh0KVxuICAgICAgfSlcbiAgICB9LFxuICAgIGludGVybmFsU2VhcmNoOiB7XG4gICAgICBnZXQgKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLmxhenlTZWFyY2hcbiAgICAgIH0sXG4gICAgICBzZXQgKHZhbDogYW55KSB7XG4gICAgICAgIHRoaXMubGF6eVNlYXJjaCA9IHZhbFxuXG4gICAgICAgIHRoaXMuJGVtaXQoJ3VwZGF0ZTpzZWFyY2gtaW5wdXQnLCB2YWwpXG4gICAgICB9LFxuICAgIH0sXG4gICAgaXNBbnlWYWx1ZUFsbG93ZWQgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfSxcbiAgICBpc0RpcnR5ICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLnNlYXJjaElzRGlydHkgfHwgdGhpcy5zZWxlY3RlZEl0ZW1zLmxlbmd0aCA+IDBcbiAgICB9LFxuICAgIGlzU2VhcmNoaW5nICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIHRoaXMubXVsdGlwbGUgJiZcbiAgICAgICAgdGhpcy5zZWFyY2hJc0RpcnR5XG4gICAgICApIHx8IChcbiAgICAgICAgdGhpcy5zZWFyY2hJc0RpcnR5ICYmXG4gICAgICAgIHRoaXMuaW50ZXJuYWxTZWFyY2ggIT09IHRoaXMuZ2V0VGV4dCh0aGlzLnNlbGVjdGVkSXRlbSlcbiAgICAgIClcbiAgICB9LFxuICAgIG1lbnVDYW5TaG93ICgpOiBib29sZWFuIHtcbiAgICAgIGlmICghdGhpcy5pc0ZvY3VzZWQpIHJldHVybiBmYWxzZVxuXG4gICAgICByZXR1cm4gdGhpcy5oYXNEaXNwbGF5ZWRJdGVtcyB8fCAhdGhpcy5oaWRlTm9EYXRhXG4gICAgfSxcbiAgICAkX21lbnVQcm9wcyAoKTogb2JqZWN0IHtcbiAgICAgIGNvbnN0IHByb3BzID0gVlNlbGVjdC5vcHRpb25zLmNvbXB1dGVkLiRfbWVudVByb3BzLmNhbGwodGhpcyk7XG4gICAgICAocHJvcHMgYXMgYW55KS5jb250ZW50Q2xhc3MgPSBgdi1hdXRvY29tcGxldGVfX2NvbnRlbnQgJHsocHJvcHMgYXMgYW55KS5jb250ZW50Q2xhc3MgfHwgJyd9YC50cmltKClcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLmRlZmF1bHRNZW51UHJvcHMsXG4gICAgICAgIC4uLnByb3BzLFxuICAgICAgfVxuICAgIH0sXG4gICAgc2VhcmNoSXNEaXJ0eSAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5pbnRlcm5hbFNlYXJjaCAhPSBudWxsICYmXG4gICAgICAgIHRoaXMuaW50ZXJuYWxTZWFyY2ggIT09ICcnXG4gICAgfSxcbiAgICBzZWxlY3RlZEl0ZW0gKCk6IGFueSB7XG4gICAgICBpZiAodGhpcy5tdWx0aXBsZSkgcmV0dXJuIG51bGxcblxuICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRJdGVtcy5maW5kKGkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZUNvbXBhcmF0b3IodGhpcy5nZXRWYWx1ZShpKSwgdGhpcy5nZXRWYWx1ZSh0aGlzLmludGVybmFsVmFsdWUpKVxuICAgICAgfSlcbiAgICB9LFxuICAgIGxpc3REYXRhICgpIHtcbiAgICAgIGNvbnN0IGRhdGEgPSBWU2VsZWN0Lm9wdGlvbnMuY29tcHV0ZWQubGlzdERhdGEuY2FsbCh0aGlzKSBhcyBhbnlcblxuICAgICAgZGF0YS5wcm9wcyA9IHtcbiAgICAgICAgLi4uZGF0YS5wcm9wcyxcbiAgICAgICAgaXRlbXM6IHRoaXMudmlydHVhbGl6ZWRJdGVtcyxcbiAgICAgICAgbm9GaWx0ZXI6IChcbiAgICAgICAgICB0aGlzLm5vRmlsdGVyIHx8XG4gICAgICAgICAgIXRoaXMuaXNTZWFyY2hpbmcgfHxcbiAgICAgICAgICAhdGhpcy5maWx0ZXJlZEl0ZW1zLmxlbmd0aFxuICAgICAgICApLFxuICAgICAgICBzZWFyY2hJbnB1dDogdGhpcy5pbnRlcm5hbFNlYXJjaCxcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRhdGFcbiAgICB9LFxuICB9LFxuXG4gIHdhdGNoOiB7XG4gICAgZmlsdGVyZWRJdGVtczogJ29uRmlsdGVyZWRJdGVtc0NoYW5nZWQnLFxuICAgIGludGVybmFsVmFsdWU6ICdzZXRTZWFyY2gnLFxuICAgIGlzRm9jdXNlZCAodmFsKSB7XG4gICAgICBpZiAodmFsKSB7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NvcHknLCB0aGlzLm9uQ29weSlcbiAgICAgICAgdGhpcy4kcmVmcy5pbnB1dCAmJiB0aGlzLiRyZWZzLmlucHV0LnNlbGVjdCgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjb3B5JywgdGhpcy5vbkNvcHkpXG4gICAgICAgIHRoaXMudXBkYXRlU2VsZigpXG4gICAgICB9XG4gICAgfSxcbiAgICBpc01lbnVBY3RpdmUgKHZhbCkge1xuICAgICAgaWYgKHZhbCB8fCAhdGhpcy5oYXNTbG90KSByZXR1cm5cblxuICAgICAgdGhpcy5sYXp5U2VhcmNoID0gdW5kZWZpbmVkXG4gICAgfSxcbiAgICBpdGVtcyAodmFsLCBvbGRWYWwpIHtcbiAgICAgIC8vIElmIHdlIGFyZSBmb2N1c2VkLCB0aGUgbWVudVxuICAgICAgLy8gaXMgbm90IGFjdGl2ZSwgaGlkZSBubyBkYXRhIGlzIGVuYWJsZWQsXG4gICAgICAvLyBhbmQgaXRlbXMgY2hhbmdlXG4gICAgICAvLyBVc2VyIGlzIHByb2JhYmx5IGFzeW5jIGxvYWRpbmdcbiAgICAgIC8vIGl0ZW1zLCB0cnkgdG8gYWN0aXZhdGUgdGhlIG1lbnVcbiAgICAgIGlmIChcbiAgICAgICAgIShvbGRWYWwgJiYgb2xkVmFsLmxlbmd0aCkgJiZcbiAgICAgICAgdGhpcy5oaWRlTm9EYXRhICYmXG4gICAgICAgIHRoaXMuaXNGb2N1c2VkICYmXG4gICAgICAgICF0aGlzLmlzTWVudUFjdGl2ZSAmJlxuICAgICAgICB2YWwubGVuZ3RoXG4gICAgICApIHRoaXMuYWN0aXZhdGVNZW51KClcbiAgICB9LFxuICAgIHNlYXJjaElucHV0ICh2YWw6IHN0cmluZykge1xuICAgICAgdGhpcy5sYXp5U2VhcmNoID0gdmFsXG4gICAgfSxcbiAgICBpbnRlcm5hbFNlYXJjaDogJ29uSW50ZXJuYWxTZWFyY2hDaGFuZ2VkJyxcbiAgICBpdGVtVGV4dDogJ3VwZGF0ZVNlbGYnLFxuICB9LFxuXG4gIGNyZWF0ZWQgKCkge1xuICAgIHRoaXMuc2V0U2VhcmNoKClcbiAgfSxcblxuICBkZXN0cm95ZWQgKCkge1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NvcHknLCB0aGlzLm9uQ29weSlcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgb25GaWx0ZXJlZEl0ZW1zQ2hhbmdlZCAodmFsOiBuZXZlcltdLCBvbGRWYWw6IG5ldmVyW10pIHtcbiAgICAgIC8vIFRPRE86IEhvdyBpcyB0aGUgd2F0Y2hlciB0cmlnZ2VyZWRcbiAgICAgIC8vIGZvciBkdXBsaWNhdGUgaXRlbXM/IG5vIGlkZWFcbiAgICAgIGlmICh2YWwgPT09IG9sZFZhbCkgcmV0dXJuXG5cbiAgICAgIHRoaXMuc2V0TWVudUluZGV4KC0xKVxuXG4gICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAhdGhpcy5pbnRlcm5hbFNlYXJjaCB8fFxuICAgICAgICAgICh2YWwubGVuZ3RoICE9PSAxICYmXG4gICAgICAgICAgICAhdGhpcy5hdXRvU2VsZWN0Rmlyc3QpXG4gICAgICAgICkgcmV0dXJuXG5cbiAgICAgICAgdGhpcy4kcmVmcy5tZW51LmdldFRpbGVzKClcbiAgICAgICAgdGhpcy5zZXRNZW51SW5kZXgoMClcbiAgICAgIH0pXG4gICAgfSxcbiAgICBvbkludGVybmFsU2VhcmNoQ2hhbmdlZCAoKSB7XG4gICAgICB0aGlzLnVwZGF0ZU1lbnVEaW1lbnNpb25zKClcbiAgICB9LFxuICAgIHVwZGF0ZU1lbnVEaW1lbnNpb25zICgpIHtcbiAgICAgIC8vIFR5cGUgZnJvbSBtZW51YWJsZSBpcyBub3QgbWFraW5nIGl0IHRocm91Z2hcbiAgICAgIHRoaXMuaXNNZW51QWN0aXZlICYmIHRoaXMuJHJlZnMubWVudSAmJiB0aGlzLiRyZWZzLm1lbnUudXBkYXRlRGltZW5zaW9ucygpXG4gICAgfSxcbiAgICBjaGFuZ2VTZWxlY3RlZEluZGV4IChrZXlDb2RlOiBudW1iZXIpIHtcbiAgICAgIC8vIERvIG5vdCBhbGxvdyBjaGFuZ2luZyBvZiBzZWxlY3RlZEluZGV4XG4gICAgICAvLyB3aGVuIHNlYXJjaCBpcyBkaXJ0eVxuICAgICAgaWYgKHRoaXMuc2VhcmNoSXNEaXJ0eSkgcmV0dXJuXG5cbiAgICAgIGlmICh0aGlzLm11bHRpcGxlICYmIGtleUNvZGUgPT09IGtleUNvZGVzLmxlZnQpIHtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRJbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSB0aGlzLnNlbGVjdGVkSXRlbXMubGVuZ3RoIC0gMVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleC0tXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5tdWx0aXBsZSAmJiBrZXlDb2RlID09PSBrZXlDb2Rlcy5yaWdodCkge1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEluZGV4ID49IHRoaXMuc2VsZWN0ZWRJdGVtcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gLTFcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXgrK1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGtleUNvZGUgPT09IGtleUNvZGVzLmJhY2tzcGFjZSB8fCBrZXlDb2RlID09PSBrZXlDb2Rlcy5kZWxldGUpIHtcbiAgICAgICAgdGhpcy5kZWxldGVDdXJyZW50SXRlbSgpXG4gICAgICB9XG4gICAgfSxcbiAgICBkZWxldGVDdXJyZW50SXRlbSAoKSB7XG4gICAgICBjb25zdCBjdXJJbmRleCA9IHRoaXMuc2VsZWN0ZWRJbmRleFxuICAgICAgY29uc3QgY3VySXRlbSA9IHRoaXMuc2VsZWN0ZWRJdGVtc1tjdXJJbmRleF1cblxuICAgICAgLy8gRG8gbm90aGluZyBpZiBpbnB1dCBvciBpdGVtIGlzIGRpc2FibGVkXG4gICAgICBpZiAoXG4gICAgICAgICF0aGlzLmlzSW50ZXJhY3RpdmUgfHxcbiAgICAgICAgdGhpcy5nZXREaXNhYmxlZChjdXJJdGVtKVxuICAgICAgKSByZXR1cm5cblxuICAgICAgY29uc3QgbGFzdEluZGV4ID0gdGhpcy5zZWxlY3RlZEl0ZW1zLmxlbmd0aCAtIDFcblxuICAgICAgLy8gU2VsZWN0IHRoZSBsYXN0IGl0ZW0gaWZcbiAgICAgIC8vIHRoZXJlIGlzIG5vIHNlbGVjdGlvblxuICAgICAgaWYgKFxuICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPT09IC0xICYmXG4gICAgICAgIGxhc3RJbmRleCAhPT0gMFxuICAgICAgKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IGxhc3RJbmRleFxuXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCBsZW5ndGggPSB0aGlzLnNlbGVjdGVkSXRlbXMubGVuZ3RoXG4gICAgICBjb25zdCBuZXh0SW5kZXggPSBjdXJJbmRleCAhPT0gbGVuZ3RoIC0gMVxuICAgICAgICA/IGN1ckluZGV4XG4gICAgICAgIDogY3VySW5kZXggLSAxXG4gICAgICBjb25zdCBuZXh0SXRlbSA9IHRoaXMuc2VsZWN0ZWRJdGVtc1tuZXh0SW5kZXhdXG5cbiAgICAgIGlmICghbmV4dEl0ZW0pIHtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLm11bHRpcGxlID8gW10gOiB1bmRlZmluZWQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNlbGVjdEl0ZW0oY3VySXRlbSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gbmV4dEluZGV4XG4gICAgfSxcbiAgICBjbGVhcmFibGVDYWxsYmFjayAoKSB7XG4gICAgICB0aGlzLmludGVybmFsU2VhcmNoID0gdW5kZWZpbmVkXG5cbiAgICAgIFZTZWxlY3Qub3B0aW9ucy5tZXRob2RzLmNsZWFyYWJsZUNhbGxiYWNrLmNhbGwodGhpcylcbiAgICB9LFxuICAgIGdlbklucHV0ICgpIHtcbiAgICAgIGNvbnN0IGlucHV0ID0gVlRleHRGaWVsZC5vcHRpb25zLm1ldGhvZHMuZ2VuSW5wdXQuY2FsbCh0aGlzKVxuXG4gICAgICBpbnB1dC5kYXRhID0gbWVyZ2VEYXRhKGlucHV0LmRhdGEhLCB7XG4gICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgJ2FyaWEtYWN0aXZlZGVzY2VuZGFudCc6IGdldE9iamVjdFZhbHVlQnlQYXRoKHRoaXMuJHJlZnMubWVudSwgJ2FjdGl2ZVRpbGUuaWQnKSxcbiAgICAgICAgICBhdXRvY29tcGxldGU6IGdldE9iamVjdFZhbHVlQnlQYXRoKGlucHV0LmRhdGEhLCAnYXR0cnMuYXV0b2NvbXBsZXRlJywgJ29mZicpLFxuICAgICAgICB9LFxuICAgICAgICBkb21Qcm9wczogeyB2YWx1ZTogdGhpcy5pbnRlcm5hbFNlYXJjaCB9LFxuICAgICAgfSlcblxuICAgICAgcmV0dXJuIGlucHV0XG4gICAgfSxcbiAgICBnZW5JbnB1dFNsb3QgKCkge1xuICAgICAgY29uc3Qgc2xvdCA9IFZTZWxlY3Qub3B0aW9ucy5tZXRob2RzLmdlbklucHV0U2xvdC5jYWxsKHRoaXMpXG5cbiAgICAgIHNsb3QuZGF0YSEuYXR0cnMhLnJvbGUgPSAnY29tYm9ib3gnXG5cbiAgICAgIHJldHVybiBzbG90XG4gICAgfSxcbiAgICBnZW5TZWxlY3Rpb25zICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhc1Nsb3QgfHwgdGhpcy5tdWx0aXBsZVxuICAgICAgICA/IFZTZWxlY3Qub3B0aW9ucy5tZXRob2RzLmdlblNlbGVjdGlvbnMuY2FsbCh0aGlzKVxuICAgICAgICA6IFtdXG4gICAgfSxcbiAgICBvbkNsaWNrIChlOiBNb3VzZUV2ZW50KSB7XG4gICAgICBpZiAoIXRoaXMuaXNJbnRlcmFjdGl2ZSkgcmV0dXJuXG5cbiAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA+IC0xXG4gICAgICAgID8gKHRoaXMuc2VsZWN0ZWRJbmRleCA9IC0xKVxuICAgICAgICA6IHRoaXMub25Gb2N1cygpXG5cbiAgICAgIGlmICghdGhpcy5pc0FwcGVuZElubmVyKGUudGFyZ2V0KSkgdGhpcy5hY3RpdmF0ZU1lbnUoKVxuICAgIH0sXG4gICAgb25JbnB1dCAoZTogRXZlbnQpIHtcbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID4gLTEgfHxcbiAgICAgICAgIWUudGFyZ2V0XG4gICAgICApIHJldHVyblxuXG4gICAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50XG4gICAgICBjb25zdCB2YWx1ZSA9IHRhcmdldC52YWx1ZVxuXG4gICAgICAvLyBJZiB0eXBpbmcgYW5kIG1lbnUgaXMgbm90IGN1cnJlbnRseSBhY3RpdmVcbiAgICAgIGlmICh0YXJnZXQudmFsdWUpIHRoaXMuYWN0aXZhdGVNZW51KClcblxuICAgICAgdGhpcy5pbnRlcm5hbFNlYXJjaCA9IHZhbHVlXG4gICAgICB0aGlzLmJhZElucHV0ID0gdGFyZ2V0LnZhbGlkaXR5ICYmIHRhcmdldC52YWxpZGl0eS5iYWRJbnB1dFxuICAgIH0sXG4gICAgb25LZXlEb3duIChlOiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICBjb25zdCBrZXlDb2RlID0gZS5rZXlDb2RlXG5cbiAgICAgIFZTZWxlY3Qub3B0aW9ucy5tZXRob2RzLm9uS2V5RG93bi5jYWxsKHRoaXMsIGUpXG5cbiAgICAgIC8vIFRoZSBvcmRlcmluZyBpcyBpbXBvcnRhbnQgaGVyZVxuICAgICAgLy8gYWxsb3dzIG5ldyB2YWx1ZSB0byBiZSB1cGRhdGVkXG4gICAgICAvLyBhbmQgdGhlbiBtb3ZlcyB0aGUgaW5kZXggdG8gdGhlXG4gICAgICAvLyBwcm9wZXIgbG9jYXRpb25cbiAgICAgIHRoaXMuY2hhbmdlU2VsZWN0ZWRJbmRleChrZXlDb2RlKVxuICAgIH0sXG4gICAgb25TcGFjZURvd24gKGU6IEtleWJvYXJkRXZlbnQpIHsgLyogbm9vcCAqLyB9LFxuICAgIG9uVGFiRG93biAoZTogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgVlNlbGVjdC5vcHRpb25zLm1ldGhvZHMub25UYWJEb3duLmNhbGwodGhpcywgZSlcbiAgICAgIHRoaXMudXBkYXRlU2VsZigpXG4gICAgfSxcbiAgICBvblVwRG93biAoZTogRXZlbnQpIHtcbiAgICAgIC8vIFByZXZlbnQgc2NyZWVuIGZyb20gc2Nyb2xsaW5nXG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcblxuICAgICAgLy8gRm9yIGF1dG9jb21wbGV0ZSAvIGNvbWJvYm94LCBjeWNsaW5nXG4gICAgICAvLyBpbnRlcmZlcnMgd2l0aCBuYXRpdmUgdXAvZG93biBiZWhhdmlvclxuICAgICAgLy8gaW5zdGVhZCBhY3RpdmF0ZSB0aGUgbWVudVxuICAgICAgdGhpcy5hY3RpdmF0ZU1lbnUoKVxuICAgIH0sXG4gICAgc2VsZWN0SXRlbSAoaXRlbTogb2JqZWN0KSB7XG4gICAgICBWU2VsZWN0Lm9wdGlvbnMubWV0aG9kcy5zZWxlY3RJdGVtLmNhbGwodGhpcywgaXRlbSlcbiAgICAgIHRoaXMuc2V0U2VhcmNoKClcbiAgICB9LFxuICAgIHNldFNlbGVjdGVkSXRlbXMgKCkge1xuICAgICAgVlNlbGVjdC5vcHRpb25zLm1ldGhvZHMuc2V0U2VsZWN0ZWRJdGVtcy5jYWxsKHRoaXMpXG5cbiAgICAgIC8vICM0MjczIERvbid0IHJlcGxhY2UgaWYgc2VhcmNoaW5nXG4gICAgICAvLyAjNDQwMyBEb24ndCByZXBsYWNlIGlmIGZvY3VzZWRcbiAgICAgIGlmICghdGhpcy5pc0ZvY3VzZWQpIHRoaXMuc2V0U2VhcmNoKClcbiAgICB9LFxuICAgIHNldFNlYXJjaCAoKSB7XG4gICAgICAvLyBXYWl0IGZvciBuZXh0VGljayBzbyBzZWxlY3RlZEl0ZW1cbiAgICAgIC8vIGhhcyBoYWQgdGltZSB0byB1cGRhdGVcbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICF0aGlzLm11bHRpcGxlIHx8XG4gICAgICAgICAgIXRoaXMuaW50ZXJuYWxTZWFyY2ggfHxcbiAgICAgICAgICAhdGhpcy5pc01lbnVBY3RpdmVcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5pbnRlcm5hbFNlYXJjaCA9IChcbiAgICAgICAgICAgICF0aGlzLnNlbGVjdGVkSXRlbXMubGVuZ3RoIHx8XG4gICAgICAgICAgICB0aGlzLm11bHRpcGxlIHx8XG4gICAgICAgICAgICB0aGlzLmhhc1Nsb3RcbiAgICAgICAgICApXG4gICAgICAgICAgICA/IG51bGxcbiAgICAgICAgICAgIDogdGhpcy5nZXRUZXh0KHRoaXMuc2VsZWN0ZWRJdGVtKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0sXG4gICAgdXBkYXRlU2VsZiAoKSB7XG4gICAgICBpZiAoIXRoaXMuc2VhcmNoSXNEaXJ0eSAmJlxuICAgICAgICAhdGhpcy5pbnRlcm5hbFZhbHVlXG4gICAgICApIHJldHVyblxuXG4gICAgICBpZiAoIXRoaXMudmFsdWVDb21wYXJhdG9yKFxuICAgICAgICB0aGlzLmludGVybmFsU2VhcmNoLFxuICAgICAgICB0aGlzLmdldFZhbHVlKHRoaXMuaW50ZXJuYWxWYWx1ZSlcbiAgICAgICkpIHtcbiAgICAgICAgdGhpcy5zZXRTZWFyY2goKVxuICAgICAgfVxuICAgIH0sXG4gICAgaGFzSXRlbSAoaXRlbTogYW55KSB7XG4gICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZFZhbHVlcy5pbmRleE9mKHRoaXMuZ2V0VmFsdWUoaXRlbSkpID4gLTFcbiAgICB9LFxuICAgIG9uQ29weSAoZXZlbnQ6IENsaXBib2FyZEV2ZW50KSB7XG4gICAgICBpZiAodGhpcy5zZWxlY3RlZEluZGV4ID09PSAtMSkgcmV0dXJuXG5cbiAgICAgIGNvbnN0IGN1cnJlbnRJdGVtID0gdGhpcy5zZWxlY3RlZEl0ZW1zW3RoaXMuc2VsZWN0ZWRJbmRleF1cbiAgICAgIGNvbnN0IGN1cnJlbnRJdGVtVGV4dCA9IHRoaXMuZ2V0VGV4dChjdXJyZW50SXRlbSlcbiAgICAgIGV2ZW50LmNsaXBib2FyZERhdGEhLnNldERhdGEoJ3RleHQvcGxhaW4nLCBjdXJyZW50SXRlbVRleHQpXG4gICAgICBldmVudC5jbGlwYm9hcmREYXRhIS5zZXREYXRhKCd0ZXh0L3ZuZC52dWV0aWZ5LmF1dG9jb21wbGV0ZS5pdGVtK3BsYWluJywgY3VycmVudEl0ZW1UZXh0KVxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIH0sXG4gIH0sXG59KVxuIl19