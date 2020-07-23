// Styles
import '../VAutocomplete/VAutocomplete.sass';
// Extensions
import VSelect from '../VSelect/VSelect';
import VAutocomplete from '../VAutocomplete/VAutocomplete';
// Utils
import { keyCodes } from '../../util/helpers';
/* @vue/component */
export default VAutocomplete.extend({
    name: 'v-combobox',
    props: {
        delimiters: {
            type: Array,
            default: () => ([]),
        },
        returnObject: {
            type: Boolean,
            default: true,
        },
    },
    data: () => ({
        editingIndex: -1,
    }),
    computed: {
        computedCounterValue() {
            return this.multiple
                ? this.selectedItems.length
                : (this.internalSearch || '').toString().length;
        },
        hasSlot() {
            return VSelect.options.computed.hasSlot.call(this) || this.multiple;
        },
        isAnyValueAllowed() {
            return true;
        },
        menuCanShow() {
            if (!this.isFocused)
                return false;
            return this.hasDisplayedItems ||
                (!!this.$slots['no-data'] && !this.hideNoData);
        },
    },
    methods: {
        onInternalSearchChanged(val) {
            if (val &&
                this.multiple &&
                this.delimiters.length) {
                const delimiter = this.delimiters.find(d => val.endsWith(d));
                if (delimiter != null) {
                    this.internalSearch = val.slice(0, val.length - delimiter.length);
                    this.updateTags();
                }
            }
            this.updateMenuDimensions();
        },
        genInput() {
            const input = VAutocomplete.options.methods.genInput.call(this);
            delete input.data.attrs.name;
            input.data.on.paste = this.onPaste;
            return input;
        },
        genChipSelection(item, index) {
            const chip = VSelect.options.methods.genChipSelection.call(this, item, index);
            // Allow user to update an existing value
            if (this.multiple) {
                chip.componentOptions.listeners = {
                    ...chip.componentOptions.listeners,
                    dblclick: () => {
                        this.editingIndex = index;
                        this.internalSearch = this.getText(item);
                        this.selectedIndex = -1;
                    },
                };
            }
            return chip;
        },
        onChipInput(item) {
            VSelect.options.methods.onChipInput.call(this, item);
            this.editingIndex = -1;
        },
        // Requires a manual definition
        // to overwrite removal in v-autocomplete
        onEnterDown(e) {
            e.preventDefault();
            // If has menu index, let v-select-list handle
            if (this.getMenuIndex() > -1)
                return;
            this.$nextTick(this.updateSelf);
        },
        onFilteredItemsChanged(val, oldVal) {
            if (!this.autoSelectFirst)
                return;
            VAutocomplete.options.methods.onFilteredItemsChanged.call(this, val, oldVal);
        },
        onKeyDown(e) {
            const keyCode = e.keyCode;
            VSelect.options.methods.onKeyDown.call(this, e);
            // If user is at selection index of 0
            // create a new tag
            if (this.multiple &&
                keyCode === keyCodes.left &&
                this.$refs.input.selectionStart === 0) {
                this.updateSelf();
            }
            else if (keyCode === keyCodes.enter) {
                this.onEnterDown(e);
            }
            // The ordering is important here
            // allows new value to be updated
            // and then moves the index to the
            // proper location
            this.changeSelectedIndex(keyCode);
        },
        onTabDown(e) {
            // When adding tags, if searching and
            // there is not a filtered options,
            // add the value to the tags list
            if (this.multiple &&
                this.internalSearch &&
                this.getMenuIndex() === -1) {
                e.preventDefault();
                e.stopPropagation();
                return this.updateTags();
            }
            VAutocomplete.options.methods.onTabDown.call(this, e);
        },
        selectItem(item) {
            // Currently only supports items:<string[]>
            if (this.editingIndex > -1) {
                this.updateEditing();
            }
            else {
                VAutocomplete.options.methods.selectItem.call(this, item);
            }
        },
        setSelectedItems() {
            if (this.internalValue == null ||
                this.internalValue === '') {
                this.selectedItems = [];
            }
            else {
                this.selectedItems = this.multiple ? this.internalValue : [this.internalValue];
            }
        },
        setValue(value) {
            VSelect.options.methods.setValue.call(this, value != null ? value : this.internalSearch);
        },
        updateEditing() {
            const value = this.internalValue.slice();
            value[this.editingIndex] = this.internalSearch;
            this.setValue(value);
            this.editingIndex = -1;
        },
        updateCombobox() {
            const isUsingSlot = Boolean(this.$scopedSlots.selection) || this.hasChips;
            // If search is not dirty and is
            // using slot, do nothing
            if (isUsingSlot && !this.searchIsDirty)
                return;
            // The internal search is not matching
            // the internal value, update the input
            if (this.internalSearch !== this.getText(this.internalValue))
                this.setValue();
            // Reset search if using slot
            // to avoid a double input
            if (isUsingSlot)
                this.internalSearch = undefined;
        },
        updateSelf() {
            this.multiple ? this.updateTags() : this.updateCombobox();
        },
        updateTags() {
            const menuIndex = this.getMenuIndex();
            // If the user is not searching
            // and no menu item is selected
            // do nothing
            if (menuIndex < 0 &&
                !this.searchIsDirty)
                return;
            if (this.editingIndex > -1) {
                return this.updateEditing();
            }
            const index = this.selectedItems.indexOf(this.internalSearch);
            // If it already exists, do nothing
            // this might need to change to bring
            // the duplicated item to the last entered
            if (index > -1) {
                const internalValue = this.internalValue.slice();
                internalValue.splice(index, 1);
                this.setValue(internalValue);
            }
            // If menu index is greater than 1
            // the selection is handled elsewhere
            // TODO: find out where
            if (menuIndex > -1)
                return (this.internalSearch = null);
            this.selectItem(this.internalSearch);
            this.internalSearch = null;
        },
        onPaste(event) {
            if (!this.multiple || this.searchIsDirty)
                return;
            const pastedItemText = event.clipboardData.getData('text/vnd.vuetify.autocomplete.item+plain');
            if (pastedItemText && this.findExistingIndex(pastedItemText) === -1) {
                event.preventDefault();
                VSelect.options.methods.selectItem.call(this, pastedItemText);
            }
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkNvbWJvYm94LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkNvbWJvYm94L1ZDb21ib2JveC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxxQ0FBcUMsQ0FBQTtBQUU1QyxhQUFhO0FBQ2IsT0FBTyxPQUFPLE1BQU0sb0JBQW9CLENBQUE7QUFDeEMsT0FBTyxhQUFhLE1BQU0sZ0NBQWdDLENBQUE7QUFFMUQsUUFBUTtBQUNSLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUs3QyxvQkFBb0I7QUFDcEIsZUFBZSxhQUFhLENBQUMsTUFBTSxDQUFDO0lBQ2xDLElBQUksRUFBRSxZQUFZO0lBRWxCLEtBQUssRUFBRTtRQUNMLFVBQVUsRUFBRTtZQUNWLElBQUksRUFBRSxLQUEyQjtZQUNqQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7U0FDcEI7UUFDRCxZQUFZLEVBQUU7WUFDWixJQUFJLEVBQUUsT0FBTztZQUNiLE9BQU8sRUFBRSxJQUFJO1NBQ2Q7S0FDRjtJQUVELElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ1gsWUFBWSxFQUFFLENBQUMsQ0FBQztLQUNqQixDQUFDO0lBRUYsUUFBUSxFQUFFO1FBQ1Isb0JBQW9CO1lBQ2xCLE9BQU8sSUFBSSxDQUFDLFFBQVE7Z0JBQ2xCLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU07Z0JBQzNCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxDQUFBO1FBQ25ELENBQUM7UUFDRCxPQUFPO1lBQ0wsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUE7UUFDckUs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VkF1dG9jb21wbGV0ZS5zYXNzJ1xuXG4vLyBFeHRlbnNpb25zXG5pbXBvcnQgVlNlbGVjdCBmcm9tICcuLi9WU2VsZWN0L1ZTZWxlY3QnXG5pbXBvcnQgVkF1dG9jb21wbGV0ZSBmcm9tICcuLi9WQXV0b2NvbXBsZXRlL1ZBdXRvY29tcGxldGUnXG5cbi8vIFV0aWxzXG5pbXBvcnQgeyBrZXlDb2RlcyB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcblxuLy8gVHlwZXNcbmltcG9ydCB7IFByb3BUeXBlIH0gZnJvbSAndnVlJ1xuXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuZXhwb3J0IGRlZmF1bHQgVkF1dG9jb21wbGV0ZS5leHRlbmQoe1xuICBuYW1lOiAndi1jb21ib2JveCcsXG5cbiAgcHJvcHM6IHtcbiAgICBkZWxpbWl0ZXJzOiB7XG4gICAgICB0eXBlOiBBcnJheSBhcyBQcm9wVHlwZTxzdHJpbmdbXT4sXG4gICAgICBkZWZhdWx0OiAoKSA9PiAoW10pLFxuICAgIH0sXG4gICAgcmV0dXJuT2JqZWN0OiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB9LFxuICB9LFxuXG4gIGRhdGE6ICgpID0+ICh7XG4gICAgZWRpdGluZ0luZGV4OiAtMSxcbiAgfSksXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBjb21wdXRlZENvdW50ZXJWYWx1ZSAoKTogbnVtYmVyIHtcbiAgICAgIHJldHVybiB0aGlzLm11bHRpcGxlXG4gICAgICAgID8gdGhpcy5zZWxlY3RlZEl0ZW1zLmxlbmd0aFxuICAgICAgICA6ICh0aGlzLmludGVybmFsU2VhcmNoIHx8ICcnKS50b1N0cmluZygpLmxlbmd0aFxuICAgIH0sXG4gICAgaGFzU2xvdCAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gVlNlbGVjdC5vcHRpb25zLmNvbXB1dGVkLmhhc1Nsb3QuY2FsbCh0aGlzKSB8fCB0aGlzLm11bHRpcGxlXG4gICAgfSxcbiAgICBpc0FueVZhbHVlQWxsb3dlZCAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH0sXG4gICAgbWVudUNhblNob3cgKCk6IGJvb2xlYW4ge1xuICAgICAgaWYgKCF0aGlzLmlzRm9jdXNlZCkgcmV0dXJuIGZhbHNlXG5cbiAgICAgIHJldHVybiB0aGlzLmhhc0Rpc3BsYXllZEl0ZW1zIHx8XG4gICAgICAgICghIXRoaXMuJHNsb3RzWyduby1kYXRhJ10gJiYgIXRoaXMuaGlkZU5vRGF0YSlcbiAgICB9LFxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBvbkludGVybmFsU2VhcmNoQ2hhbmdlZCAodmFsOiBhbnkpIHtcbiAgICAgIGlmIChcbiAgICAgICAgdmFsICYmXG4gICAgICAgIHRoaXMubXVsdGlwbGUgJiZcbiAgICAgICAgdGhpcy5kZWxpbWl0ZXJzLmxlbmd0aFxuICAgICAgKSB7XG4gICAgICAgIGNvbnN0IGRlbGltaXRlciA9IHRoaXMuZGVsaW1pdGVycy5maW5kKGQgPT4gdmFsLmVuZHNXaXRoKGQpKVxuICAgICAgICBpZiAoZGVsaW1pdGVyICE9IG51bGwpIHtcbiAgICAgICAgICB0aGlzLmludGVybmFsU2VhcmNoID0gdmFsLnNsaWNlKDAsIHZhbC5sZW5ndGggLSBkZWxpbWl0ZXIubGVuZ3RoKVxuICAgICAgICAgIHRoaXMudXBkYXRlVGFncygpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy51cGRhdGVNZW51RGltZW5zaW9ucygpXG4gICAgfSxcbiAgICBnZW5JbnB1dCAoKSB7XG4gICAgICBjb25zdCBpbnB1dCA9IFZBdXRvY29tcGxldGUub3B0aW9ucy5tZXRob2RzLmdlbklucHV0LmNhbGwodGhpcylcblxuICAgICAgZGVsZXRlIGlucHV0LmRhdGEhLmF0dHJzIS5uYW1lXG4gICAgICBpbnB1dC5kYXRhIS5vbiEucGFzdGUgPSB0aGlzLm9uUGFzdGVcblxuICAgICAgcmV0dXJuIGlucHV0XG4gICAgfSxcbiAgICBnZW5DaGlwU2VsZWN0aW9uIChpdGVtOiBvYmplY3QsIGluZGV4OiBudW1iZXIpIHtcbiAgICAgIGNvbnN0IGNoaXAgPSBWU2VsZWN0Lm9wdGlvbnMubWV0aG9kcy5nZW5DaGlwU2VsZWN0aW9uLmNhbGwodGhpcywgaXRlbSwgaW5kZXgpXG5cbiAgICAgIC8vIEFsbG93IHVzZXIgdG8gdXBkYXRlIGFuIGV4aXN0aW5nIHZhbHVlXG4gICAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xuICAgICAgICBjaGlwLmNvbXBvbmVudE9wdGlvbnMhLmxpc3RlbmVycyEgPSB7XG4gICAgICAgICAgLi4uY2hpcC5jb21wb25lbnRPcHRpb25zIS5saXN0ZW5lcnMhLFxuICAgICAgICAgIGRibGNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVkaXRpbmdJbmRleCA9IGluZGV4XG4gICAgICAgICAgICB0aGlzLmludGVybmFsU2VhcmNoID0gdGhpcy5nZXRUZXh0KGl0ZW0pXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSAtMVxuICAgICAgICAgIH0sXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNoaXBcbiAgICB9LFxuICAgIG9uQ2hpcElucHV0IChpdGVtOiBvYmplY3QpIHtcbiAgICAgIFZTZWxlY3Qub3B0aW9ucy5tZXRob2RzLm9uQ2hpcElucHV0LmNhbGwodGhpcywgaXRlbSlcblxuICAgICAgdGhpcy5lZGl0aW5nSW5kZXggPSAtMVxuICAgIH0sXG4gICAgLy8gUmVxdWlyZXMgYSBtYW51YWwgZGVmaW5pdGlvblxuICAgIC8vIHRvIG92ZXJ3cml0ZSByZW1vdmFsIGluIHYtYXV0b2NvbXBsZXRlXG4gICAgb25FbnRlckRvd24gKGU6IEV2ZW50KSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIC8vIElmIGhhcyBtZW51IGluZGV4LCBsZXQgdi1zZWxlY3QtbGlzdCBoYW5kbGVcbiAgICAgIGlmICh0aGlzLmdldE1lbnVJbmRleCgpID4gLTEpIHJldHVyblxuXG4gICAgICB0aGlzLiRuZXh0VGljayh0aGlzLnVwZGF0ZVNlbGYpXG4gICAgfSxcbiAgICBvbkZpbHRlcmVkSXRlbXNDaGFuZ2VkICh2YWw6IG5ldmVyW10sIG9sZFZhbDogbmV2ZXJbXSkge1xuICAgICAgaWYgKCF0aGlzLmF1dG9TZWxlY3RGaXJzdCkgcmV0dXJuXG5cbiAgICAgIFZBdXRvY29tcGxldGUub3B0aW9ucy5tZXRob2RzLm9uRmlsdGVyZWRJdGVtc0NoYW5nZWQuY2FsbCh0aGlzLCB2YWwsIG9sZFZhbClcbiAgICB9LFxuICAgIG9uS2V5RG93biAoZTogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgY29uc3Qga2V5Q29kZSA9IGUua2V5Q29kZVxuXG4gICAgICBWU2VsZWN0Lm9wdGlvbnMubWV0aG9kcy5vbktleURvd24uY2FsbCh0aGlzLCBlKVxuXG4gICAgICAvLyBJZiB1c2VyIGlzIGF0IHNlbGVjdGlvbiBpbmRleCBvZiAwXG4gICAgICAvLyBjcmVhdGUgYSBuZXcgdGFnXG4gICAgICBpZiAodGhpcy5tdWx0aXBsZSAmJlxuICAgICAgICBrZXlDb2RlID09PSBrZXlDb2Rlcy5sZWZ0ICYmXG4gICAgICAgIHRoaXMuJHJlZnMuaW5wdXQuc2VsZWN0aW9uU3RhcnQgPT09IDBcbiAgICAgICkge1xuICAgICAgICB0aGlzLnVwZGF0ZVNlbGYoKVxuICAgICAgfSBlbHNlIGlmIChrZXlDb2RlID09PSBrZXlDb2Rlcy5lbnRlcikge1xuICAgICAgICB0aGlzLm9uRW50ZXJEb3duKGUpXG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBvcmRlcmluZyBpcyBpbXBvcnRhbnQgaGVyZVxuICAgICAgLy8gYWxsb3dzIG5ldyB2YWx1ZSB0byBiZSB1cGRhdGVkXG4gICAgICAvLyBhbmQgdGhlbiBtb3ZlcyB0aGUgaW5kZXggdG8gdGhlXG4gICAgICAvLyBwcm9wZXIgbG9jYXRpb25cbiAgICAgIHRoaXMuY2hhbmdlU2VsZWN0ZWRJbmRleChrZXlDb2RlKVxuICAgIH0sXG4gICAgb25UYWJEb3duIChlOiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAvLyBXaGVuIGFkZGluZyB0YWdzLCBpZiBzZWFyY2hpbmcgYW5kXG4gICAgICAvLyB0aGVyZSBpcyBub3QgYSBmaWx0ZXJlZCBvcHRpb25zLFxuICAgICAgLy8gYWRkIHRoZSB2YWx1ZSB0byB0aGUgdGFncyBsaXN0XG4gICAgICBpZiAodGhpcy5tdWx0aXBsZSAmJlxuICAgICAgICB0aGlzLmludGVybmFsU2VhcmNoICYmXG4gICAgICAgIHRoaXMuZ2V0TWVudUluZGV4KCkgPT09IC0xXG4gICAgICApIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcblxuICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVUYWdzKClcbiAgICAgIH1cblxuICAgICAgVkF1dG9jb21wbGV0ZS5vcHRpb25zLm1ldGhvZHMub25UYWJEb3duLmNhbGwodGhpcywgZSlcbiAgICB9LFxuICAgIHNlbGVjdEl0ZW0gKGl0ZW06IG9iamVjdCkge1xuICAgICAgLy8gQ3VycmVudGx5IG9ubHkgc3VwcG9ydHMgaXRlbXM6PHN0cmluZ1tdPlxuICAgICAgaWYgKHRoaXMuZWRpdGluZ0luZGV4ID4gLTEpIHtcbiAgICAgICAgdGhpcy51cGRhdGVFZGl0aW5nKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFZBdXRvY29tcGxldGUub3B0aW9ucy5tZXRob2RzLnNlbGVjdEl0ZW0uY2FsbCh0aGlzLCBpdGVtKVxuICAgICAgfVxuICAgIH0sXG4gICAgc2V0U2VsZWN0ZWRJdGVtcyAoKSB7XG4gICAgICBpZiAodGhpcy5pbnRlcm5hbFZhbHVlID09IG51bGwgfHxcbiAgICAgICAgdGhpcy5pbnRlcm5hbFZhbHVlID09PSAnJ1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcyA9IFtdXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXMgPSB0aGlzLm11bHRpcGxlID8gdGhpcy5pbnRlcm5hbFZhbHVlIDogW3RoaXMuaW50ZXJuYWxWYWx1ZV1cbiAgICAgIH1cbiAgICB9LFxuICAgIHNldFZhbHVlICh2YWx1ZT86IGFueSkge1xuICAgICAgVlNlbGVjdC5vcHRpb25zLm1ldGhvZHMuc2V0VmFsdWUuY2FsbCh0aGlzLCB2YWx1ZSAhPSBudWxsID8gdmFsdWUgOiB0aGlzLmludGVybmFsU2VhcmNoKVxuICAgIH0sXG4gICAgdXBkYXRlRWRpdGluZyAoKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuaW50ZXJuYWxWYWx1ZS5zbGljZSgpXG4gICAgICB2YWx1ZVt0aGlzLmVkaXRpbmdJbmRleF0gPSB0aGlzLmludGVybmFsU2VhcmNoXG5cbiAgICAgIHRoaXMuc2V0VmFsdWUodmFsdWUpXG5cbiAgICAgIHRoaXMuZWRpdGluZ0luZGV4ID0gLTFcbiAgICB9LFxuICAgIHVwZGF0ZUNvbWJvYm94ICgpIHtcbiAgICAgIGNvbnN0IGlzVXNpbmdTbG90ID0gQm9vbGVhbih0aGlzLiRzY29wZWRTbG90cy5zZWxlY3Rpb24pIHx8IHRoaXMuaGFzQ2hpcHNcblxuICAgICAgLy8gSWYgc2VhcmNoIGlzIG5vdCBkaXJ0eSBhbmQgaXNcbiAgICAgIC8vIHVzaW5nIHNsb3QsIGRvIG5vdGhpbmdcbiAgICAgIGlmIChpc1VzaW5nU2xvdCAmJiAhdGhpcy5zZWFyY2hJc0RpcnR5KSByZXR1cm5cblxuICAgICAgLy8gVGhlIGludGVybmFsIHNlYXJjaCBpcyBub3QgbWF0Y2hpbmdcbiAgICAgIC8vIHRoZSBpbnRlcm5hbCB2YWx1ZSwgdXBkYXRlIHRoZSBpbnB1dFxuICAgICAgaWYgKHRoaXMuaW50ZXJuYWxTZWFyY2ggIT09IHRoaXMuZ2V0VGV4dCh0aGlzLmludGVybmFsVmFsdWUpKSB0aGlzLnNldFZhbHVlKClcblxuICAgICAgLy8gUmVzZXQgc2VhcmNoIGlmIHVzaW5nIHNsb3RcbiAgICAgIC8vIHRvIGF2b2lkIGEgZG91YmxlIGlucHV0XG4gICAgICBpZiAoaXNVc2luZ1Nsb3QpIHRoaXMuaW50ZXJuYWxTZWFyY2ggPSB1bmRlZmluZWRcbiAgICB9LFxuICAgIHVwZGF0ZVNlbGYgKCkge1xuICAgICAgdGhpcy5tdWx0aXBsZSA/IHRoaXMudXBkYXRlVGFncygpIDogdGhpcy51cGRhdGVDb21ib2JveCgpXG4gICAgfSxcbiAgICB1cGRhdGVUYWdzICgpIHtcbiAgICAgIGNvbnN0IG1lbnVJbmRleCA9IHRoaXMuZ2V0TWVudUluZGV4KClcblxuICAgICAgLy8gSWYgdGhlIHVzZXIgaXMgbm90IHNlYXJjaGluZ1xuICAgICAgLy8gYW5kIG5vIG1lbnUgaXRlbSBpcyBzZWxlY3RlZFxuICAgICAgLy8gZG8gbm90aGluZ1xuICAgICAgaWYgKG1lbnVJbmRleCA8IDAgJiZcbiAgICAgICAgIXRoaXMuc2VhcmNoSXNEaXJ0eVxuICAgICAgKSByZXR1cm5cblxuICAgICAgaWYgKHRoaXMuZWRpdGluZ0luZGV4ID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlRWRpdGluZygpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5zZWxlY3RlZEl0ZW1zLmluZGV4T2YodGhpcy5pbnRlcm5hbFNlYXJjaClcbiAgICAgIC8vIElmIGl0IGFscmVhZHkgZXhpc3RzLCBkbyBub3RoaW5nXG4gICAgICAvLyB0aGlzIG1pZ2h0IG5lZWQgdG8gY2hhbmdlIHRvIGJyaW5nXG4gICAgICAvLyB0aGUgZHVwbGljYXRlZCBpdGVtIHRvIHRoZSBsYXN0IGVudGVyZWRcbiAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgIGNvbnN0IGludGVybmFsVmFsdWUgPSB0aGlzLmludGVybmFsVmFsdWUuc2xpY2UoKVxuICAgICAgICBpbnRlcm5hbFZhbHVlLnNwbGljZShpbmRleCwgMSlcblxuICAgICAgICB0aGlzLnNldFZhbHVlKGludGVybmFsVmFsdWUpXG4gICAgICB9XG5cbiAgICAgIC8vIElmIG1lbnUgaW5kZXggaXMgZ3JlYXRlciB0aGFuIDFcbiAgICAgIC8vIHRoZSBzZWxlY3Rpb24gaXMgaGFuZGxlZCBlbHNld2hlcmVcbiAgICAgIC8vIFRPRE86IGZpbmQgb3V0IHdoZXJlXG4gICAgICBpZiAobWVudUluZGV4ID4gLTEpIHJldHVybiAodGhpcy5pbnRlcm5hbFNlYXJjaCA9IG51bGwpXG5cbiAgICAgIHRoaXMuc2VsZWN0SXRlbSh0aGlzLmludGVybmFsU2VhcmNoKVxuICAgICAgdGhpcy5pbnRlcm5hbFNlYXJjaCA9IG51bGxcbiAgICB9LFxuICAgIG9uUGFzdGUgKGV2ZW50OiBDbGlwYm9hcmRFdmVudCkge1xuICAgICAgaWYgKCF0aGlzLm11bHRpcGxlIHx8IHRoaXMuc2VhcmNoSXNEaXJ0eSkgcmV0dXJuXG5cbiAgICAgIGNvbnN0IHBhc3RlZEl0ZW1UZXh0ID0gZXZlbnQuY2xpcGJvYXJkRGF0YSEuZ2V0RGF0YSgndGV4dC92bmQudnVldGlmeS5hdXRvY29tcGxldGUuaXRlbStwbGFpbicpXG4gICAgICBpZiAocGFzdGVkSXRlbVRleHQgJiYgdGhpcy5maW5kRXhpc3RpbmdJbmRleChwYXN0ZWRJdGVtVGV4dCBhcyBhbnkpID09PSAtMSkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIFZTZWxlY3Qub3B0aW9ucy5tZXRob2RzLnNlbGVjdEl0ZW0uY2FsbCh0aGlzLCBwYXN0ZWRJdGVtVGV4dCBhcyBhbnkpXG4gICAgICB9XG4gICAgfSxcbiAgfSxcbn0pXG4iXX0=