// Styles
import '../VTextField/VTextField.sass';
import './VSelect.sass';
// Components
import VChip from '../VChip';
import VMenu from '../VMenu';
import VSelectList from './VSelectList';
// Extensions
import VInput from '../VInput';
import VTextField from '../VTextField/VTextField';
// Mixins
import Comparable from '../../mixins/comparable';
import Filterable from '../../mixins/filterable';
// Directives
import ClickOutside from '../../directives/click-outside';
// Utilities
import mergeData from '../../util/mergeData';
import { getPropertyFromItem, getObjectValueByPath, keyCodes } from '../../util/helpers';
import { consoleError } from '../../util/console';
// Types
import mixins from '../../util/mixins';
export const defaultMenuProps = {
    closeOnClick: false,
    closeOnContentClick: false,
    disableKeys: true,
    openOnClick: false,
    maxHeight: 304,
};
// Types
const baseMixins = mixins(VTextField, Comparable, Filterable);
/* @vue/component */
export default baseMixins.extend().extend({
    name: 'v-select',
    directives: {
        ClickOutside,
    },
    props: {
        appendIcon: {
            type: String,
            default: '$dropdown',
        },
        attach: {
            type: null,
            default: false,
        },
        cacheItems: Boolean,
        chips: Boolean,
        clearable: Boolean,
        deletableChips: Boolean,
        disableLookup: Boolean,
        eager: Boolean,
        hideSelected: Boolean,
        items: {
            type: Array,
            default: () => [],
        },
        itemColor: {
            type: String,
            default: 'primary',
        },
        itemDisabled: {
            type: [String, Array, Function],
            default: 'disabled',
        },
        itemText: {
            type: [String, Array, Function],
            default: 'text',
        },
        itemValue: {
            type: [String, Array, Function],
            default: 'value',
        },
        menuProps: {
            type: [String, Array, Object],
            default: () => defaultMenuProps,
        },
        multiple: Boolean,
        openOnClear: Boolean,
        returnObject: Boolean,
        smallChips: Boolean,
    },
    data() {
        return {
            cachedItems: this.cacheItems ? this.items : [],
            menuIsBooted: false,
            isMenuActive: false,
            lastItem: 20,
            // As long as a value is defined, show it
            // Otherwise, check if multiple
            // to determine which default to provide
            lazyValue: this.value !== undefined
                ? this.value
                : this.multiple ? [] : undefined,
            selectedIndex: -1,
            selectedItems: [],
            keyboardLookupPrefix: '',
            keyboardLookupLastTime: 0,
        };
    },
    computed: {
        /* All items that the select has */
        allItems() {
            return this.filterDuplicates(this.cachedItems.concat(this.items));
        },
        classes() {
            return {
                ...VTextField.options.computed.classes.call(this),
                'v-select': true,
                'v-select--chips': this.hasChips,
                'v-select--chips--small': this.smallChips,
                'v-select--is-menu-active': this.isMenuActive,
                'v-select--is-multi': this.multiple,
            };
        },
        /* Used by other components to overwrite */
        computedItems() {
            return this.allItems;
        },
        computedOwns() {
            return `list-${this._uid}`;
        },
        computedCounterValue() {
            return this.multiple
                ? this.selectedItems.length
                : (this.getText(this.selectedItems[0]) || '').toString().length;
        },
        directives() {
            return this.isFocused ? [{
                    name: 'click-outside',
                    value: {
                        handler: this.blur,
                        closeConditional: this.closeConditional,
                    },
                }] : undefined;
        },
        dynamicHeight() {
            return 'auto';
        },
        hasChips() {
            return this.chips || this.smallChips;
        },
        hasSlot() {
            return Boolean(this.hasChips || this.$scopedSlots.selection);
        },
        isDirty() {
            return this.selectedItems.length > 0;
        },
        listData() {
            const scopeId = this.$vnode && this.$vnode.context.$options._scopeId;
            const attrs = scopeId ? {
                [scopeId]: true,
            } : {};
            return {
                attrs: {
                    ...attrs,
                    id: this.computedOwns,
                },
                props: {
                    action: this.multiple,
                    color: this.itemColor,
                    dense: this.dense,
                    hideSelected: this.hideSelected,
                    items: this.virtualizedItems,
                    itemDisabled: this.itemDisabled,
                    itemText: this.itemText,
                    itemValue: this.itemValue,
                    noDataText: this.$vuetify.lang.t(this.noDataText),
                    selectedItems: this.selectedItems,
                },
                on: {
                    select: this.selectItem,
                },
                scopedSlots: {
                    item: this.$scopedSlots.item,
                },
            };
        },
        staticList() {
            if (this.$slots['no-data'] || this.$slots['prepend-item'] || this.$slots['append-item']) {
                consoleError('assert: staticList should not be called if slots are used');
            }
            return this.$createElement(VSelectList, this.listData);
        },
        virtualizedItems() {
            return this.$_menuProps.auto
                ? this.computedItems
                : this.computedItems.slice(0, this.lastItem);
        },
        menuCanShow: () => true,
        $_menuProps() {
            let normalisedProps = typeof this.menuProps === 'string'
                ? this.menuProps.split(',')
                : this.menuProps;
            if (Array.isArray(normalisedProps)) {
                normalisedProps = normalisedProps.reduce((acc, p) => {
                    acc[p.trim()] = true;
                    return acc;
                }, {});
            }
            return {
                ...defaultMenuProps,
                eager: this.eager,
                value: this.menuCanShow && this.isMenuActive,
                nudgeBottom: normalisedProps.offsetY ? 1 : 0,
                ...normalisedProps,
            };
        },
    },
    watch: {
        internalValue(val) {
            this.initialValue = val;
            this.setSelectedItems();
        },
        isMenuActive(val) {
            window.setTimeout(() => this.onMenuActiveChange(val));
        },
        items: {
            immediate: true,
            handler(val) {
                if (this.cacheItems) {
                    // Breaks vue-test-utils if
                    // this isn't calculated
                    // on the next tick
                    this.$nextTick(() => {
                        this.cachedItems = this.filterDuplicates(this.cachedItems.concat(val));
                    });
                }
                this.setSelectedItems();
            },
        },
    },
    methods: {
        /** @public */
        blur(e) {
            VTextField.options.methods.blur.call(this, e);
            this.isMenuActive = false;
            this.isFocused = false;
            this.selectedIndex = -1;
        },
        /** @public */
        activateMenu() {
            if (!this.isInteractive ||
                this.isMenuActive)
                return;
            this.isMenuActive = true;
        },
        clearableCallback() {
            this.setValue(this.multiple ? [] : undefined);
            this.setMenuIndex(-1);
            this.$nextTick(() => this.$refs.input && this.$refs.input.focus());
            if (this.openOnClear)
                this.isMenuActive = true;
        },
        closeConditional(e) {
            if (!this.isMenuActive)
                return true;
            return (!this._isDestroyed &&
                // Click originates from outside the menu content
                // Multiple selects don't close when an item is clicked
                (!this.getContent() ||
                    !this.getContent().contains(e.target)) &&
                // Click originates from outside the element
                this.$el &&
                !this.$el.contains(e.target) &&
                e.target !== this.$el);
        },
        filterDuplicates(arr) {
            const uniqueValues = new Map();
            for (let index = 0; index < arr.length; ++index) {
                const item = arr[index];
                const val = this.getValue(item);
                // TODO: comparator
                !uniqueValues.has(val) && uniqueValues.set(val, item);
            }
            return Array.from(uniqueValues.values());
        },
        findExistingIndex(item) {
            const itemValue = this.getValue(item);
            return (this.internalValue || []).findIndex((i) => this.valueComparator(this.getValue(i), itemValue));
        },
        getContent() {
            return this.$refs.menu && this.$refs.menu.$refs.content;
        },
        genChipSelection(item, index) {
            const isDisabled = (!this.isInteractive ||
                this.getDisabled(item));
            return this.$createElement(VChip, {
                staticClass: 'v-chip--select',
                attrs: { tabindex: -1 },
                props: {
                    close: this.deletableChips && !isDisabled,
                    disabled: isDisabled,
                    inputValue: index === this.selectedIndex,
                    small: this.smallChips,
                },
                on: {
                    click: (e) => {
                        if (isDisabled)
                            return;
                        e.stopPropagation();
                        this.selectedIndex = index;
                    },
                    'click:close': () => this.onChipInput(item),
                },
                key: JSON.stringify(this.getValue(item)),
            }, this.getText(item));
        },
        genCommaSelection(item, index, last) {
            const color = index === this.selectedIndex && this.computedColor;
            const isDisabled = (!this.isInteractive ||
                this.getDisabled(item));
            return this.$createElement('div', this.setTextColor(color, {
                staticClass: 'v-select__selection v-select__selection--comma',
                class: {
                    'v-select__selection--disabled': isDisabled,
                },
                key: JSON.stringify(this.getValue(item)),
            }), `${this.getText(item)}${last ? '' : ', '}`);
        },
        genDefaultSlot() {
            const selections = this.genSelections();
            const input = this.genInput();
            // If the return is an empty array
            // push the input
            if (Array.isArray(selections)) {
                selections.push(input);
                // Otherwise push it into children
            }
            else {
                selections.children = selections.children || [];
                selections.children.push(input);
            }
            return [
                this.genFieldset(),
                this.$createElement('div', {
                    staticClass: 'v-select__slot',
                    directives: this.directives,
                }, [
                    this.genLabel(),
                    this.prefix ? this.genAffix('prefix') : null,
                    selections,
                    this.suffix ? this.genAffix('suffix') : null,
                    this.genClearIcon(),
                    this.genIconSlot(),
                    this.genHiddenInput(),
                ]),
                this.genMenu(),
                this.genProgress(),
            ];
        },
        genIcon(type, cb, extraData) {
            const icon = VInput.options.methods.genIcon.call(this, type, cb, extraData);
            if (type === 'append') {
                // Don't allow the dropdown icon to be focused
                icon.children[0].data = mergeData(icon.children[0].data, {
                    attrs: {
                        tabindex: icon.children[0].componentOptions.listeners && '-1',
                        'aria-hidden': 'true',
                        'aria-label': undefined,
                    },
                });
            }
            return icon;
        },
        genInput() {
            const input = VTextField.options.methods.genInput.call(this);
            delete input.data.attrs.name;
            input.data = mergeData(input.data, {
                domProps: { value: null },
                attrs: {
                    readonly: true,
                    type: 'text',
                    'aria-readonly': String(this.isReadonly),
                    'aria-activedescendant': getObjectValueByPath(this.$refs.menu, 'activeTile.id'),
                    autocomplete: getObjectValueByPath(input.data, 'attrs.autocomplete', 'off'),
                },
                on: { keypress: this.onKeyPress },
            });
            return input;
        },
        genHiddenInput() {
            return this.$createElement('input', {
                domProps: { value: this.lazyValue },
                attrs: {
                    type: 'hidden',
                    name: this.attrs$.name,
                },
            });
        },
        genInputSlot() {
            const render = VTextField.options.methods.genInputSlot.call(this);
            render.data.attrs = {
                ...render.data.attrs,
                role: 'button',
                'aria-haspopup': 'listbox',
                'aria-expanded': String(this.isMenuActive),
                'aria-owns': this.computedOwns,
            };
            return render;
        },
        genList() {
            // If there's no slots, we can use a cached VNode to improve performance
            if (this.$slots['no-data'] || this.$slots['prepend-item'] || this.$slots['append-item']) {
                return this.genListWithSlot();
            }
            else {
                return this.staticList;
            }
        },
        genListWithSlot() {
            const slots = ['prepend-item', 'no-data', 'append-item']
                .filter(slotName => this.$slots[slotName])
                .map(slotName => this.$createElement('template', {
                slot: slotName,
            }, this.$slots[slotName]));
            // Requires destructuring due to Vue
            // modifying the `on` property when passed
            // as a referenced object
            return this.$createElement(VSelectList, {
                ...this.listData,
            }, slots);
        },
        genMenu() {
            const props = this.$_menuProps;
            props.activator = this.$refs['input-slot'];
            // Attach to root el so that
            // menu covers prepend/append icons
            if (
            // TODO: make this a computed property or helper or something
            this.attach === '' || // If used as a boolean prop (<v-menu attach>)
                this.attach === true || // If bound to a boolean (<v-menu :attach="true">)
                this.attach === 'attach' // If bound as boolean prop in pug (v-menu(attach))
            ) {
                props.attach = this.$el;
            }
            else {
                props.attach = this.attach;
            }
            return this.$createElement(VMenu, {
                attrs: { role: undefined },
                props,
                on: {
                    input: (val) => {
                        this.isMenuActive = val;
                        this.isFocused = val;
                    },
                    scroll: this.onScroll,
                },
                ref: 'menu',
            }, [this.genList()]);
        },
        genSelections() {
            let length = this.selectedItems.length;
            const children = new Array(length);
            let genSelection;
            if (this.$scopedSlots.selection) {
                genSelection = this.genSlotSelection;
            }
            else if (this.hasChips) {
                genSelection = this.genChipSelection;
            }
            else {
                genSelection = this.genCommaSelection;
            }
            while (length--) {
                children[length] = genSelection(this.selectedItems[length], length, length === children.length - 1);
            }
            return this.$createElement('div', {
                staticClass: 'v-select__selections',
            }, children);
        },
        genSlotSelection(item, index) {
            return this.$scopedSlots.selection({
                attrs: {
                    class: 'v-chip--select',
                },
                parent: this,
                item,
                index,
                select: (e) => {
                    e.stopPropagation();
                    this.selectedIndex = index;
                },
                selected: index === this.selectedIndex,
                disabled: !this.isInteractive,
            });
        },
        getMenuIndex() {
            return this.$refs.menu ? this.$refs.menu.listIndex : -1;
        },
        getDisabled(item) {
            return getPropertyFromItem(item, this.itemDisabled, false);
        },
        getText(item) {
            return getPropertyFromItem(item, this.itemText, item);
        },
        getValue(item) {
            return getPropertyFromItem(item, this.itemValue, this.getText(item));
        },
        onBlur(e) {
            e && this.$emit('blur', e);
        },
        onChipInput(item) {
            if (this.multiple)
                this.selectItem(item);
            else
                this.setValue(null);
            // If all items have been deleted,
            // open `v-menu`
            if (this.selectedItems.length === 0) {
                this.isMenuActive = true;
            }
            else {
                this.isMenuActive = false;
            }
            this.selectedIndex = -1;
        },
        onClick(e) {
            if (!this.isInteractive)
                return;
            if (!this.isAppendInner(e.target)) {
                this.isMenuActive = true;
            }
            if (!this.isFocused) {
                this.isFocused = true;
                this.$emit('focus');
            }
            this.$emit('click', e);
        },
        onEscDown(e) {
            e.preventDefault();
            if (this.isMenuActive) {
                e.stopPropagation();
                this.isMenuActive = false;
            }
        },
        onKeyPress(e) {
            if (this.multiple ||
                !this.isInteractive ||
                this.disableLookup)
                return;
            const KEYBOARD_LOOKUP_THRESHOLD = 1000; // milliseconds
            const now = performance.now();
            if (now - this.keyboardLookupLastTime > KEYBOARD_LOOKUP_THRESHOLD) {
                this.keyboardLookupPrefix = '';
            }
            this.keyboardLookupPrefix += e.key.toLowerCase();
            this.keyboardLookupLastTime = now;
            const index = this.allItems.findIndex(item => {
                const text = (this.getText(item) || '').toString();
                return text.toLowerCase().startsWith(this.keyboardLookupPrefix);
            });
            const item = this.allItems[index];
            if (index !== -1) {
                this.lastItem = Math.max(this.lastItem, index + 5);
                this.setValue(this.returnObject ? item : this.getValue(item));
                this.$nextTick(() => this.$refs.menu.getTiles());
                setTimeout(() => this.setMenuIndex(index));
            }
        },
        onKeyDown(e) {
            if (this.isReadonly && e.keyCode !== keyCodes.tab)
                return;
            const keyCode = e.keyCode;
            const menu = this.$refs.menu;
            // If enter, space, open menu
            if ([
                keyCodes.enter,
                keyCodes.space,
            ].includes(keyCode))
                this.activateMenu();
            this.$emit('keydown', e);
            if (!menu)
                return;
            // If menu is active, allow default
            // listIndex change from menu
            if (this.isMenuActive && keyCode !== keyCodes.tab) {
                this.$nextTick(() => {
                    menu.changeListIndex(e);
                    this.$emit('update:list-index', menu.listIndex);
                });
            }
            // If menu is not active, up and down can do
            // one of 2 things. If multiple, opens the
            // menu, if not, will cycle through all
            // available options
            if (!this.isMenuActive &&
                [keyCodes.up, keyCodes.down].includes(keyCode))
                return this.onUpDown(e);
            // If escape deactivate the menu
            if (keyCode === keyCodes.esc)
                return this.onEscDown(e);
            // If tab - select item or close menu
            if (keyCode === keyCodes.tab)
                return this.onTabDown(e);
            // If space preventDefault
            if (keyCode === keyCodes.space)
                return this.onSpaceDown(e);
        },
        onMenuActiveChange(val) {
            // If menu is closing and mulitple
            // or menuIndex is already set
            // skip menu index recalculation
            if ((this.multiple && !val) ||
                this.getMenuIndex() > -1)
                return;
            const menu = this.$refs.menu;
            if (!menu || !this.isDirty)
                return;
            // When menu opens, set index of first active item
            for (let i = 0; i < menu.tiles.length; i++) {
                if (menu.tiles[i].getAttribute('aria-selected') === 'true') {
                    this.setMenuIndex(i);
                    break;
                }
            }
        },
        onMouseUp(e) {
            if (this.hasMouseDown &&
                e.which !== 3 &&
                this.isInteractive) {
                // If append inner is present
                // and the target is itself
                // or inside, toggle menu
                if (this.isAppendInner(e.target)) {
                    this.$nextTick(() => (this.isMenuActive = !this.isMenuActive));
                    // If user is clicking in the container
                    // and field is enclosed, activate it
                }
                else if (this.isEnclosed) {
                    this.isMenuActive = true;
                }
            }
            VTextField.options.methods.onMouseUp.call(this, e);
        },
        onScroll() {
            if (!this.isMenuActive) {
                requestAnimationFrame(() => (this.getContent().scrollTop = 0));
            }
            else {
                if (this.lastItem > this.computedItems.length)
                    return;
                const showMoreItems = (this.getContent().scrollHeight -
                    (this.getContent().scrollTop +
                        this.getContent().clientHeight)) < 200;
                if (showMoreItems) {
                    this.lastItem += 20;
                }
            }
        },
        onSpaceDown(e) {
            e.preventDefault();
        },
        onTabDown(e) {
            const menu = this.$refs.menu;
            if (!menu)
                return;
            const activeTile = menu.activeTile;
            // An item that is selected by
            // menu-index should toggled
            if (!this.multiple &&
                activeTile &&
                this.isMenuActive) {
                e.preventDefault();
                e.stopPropagation();
                activeTile.click();
            }
            else {
                // If we make it here,
                // the user has no selected indexes
                // and is probably tabbing out
                this.blur(e);
            }
        },
        onUpDown(e) {
            const menu = this.$refs.menu;
            if (!menu)
                return;
            e.preventDefault();
            // Multiple selects do not cycle their value
            // when pressing up or down, instead activate
            // the menu
            if (this.multiple)
                return this.activateMenu();
            const keyCode = e.keyCode;
            // Cycle through available values to achieve
            // select native behavior
            menu.isBooted = true;
            window.requestAnimationFrame(() => {
                menu.getTiles();
                keyCodes.up === keyCode ? menu.prevTile() : menu.nextTile();
                menu.activeTile && menu.activeTile.click();
            });
        },
        selectItem(item) {
            if (!this.multiple) {
                this.setValue(this.returnObject ? item : this.getValue(item));
                this.isMenuActive = false;
            }
            else {
                const internalValue = (this.internalValue || []).slice();
                const i = this.findExistingIndex(item);
                i !== -1 ? internalValue.splice(i, 1) : internalValue.push(item);
                this.setValue(internalValue.map((i) => {
                    return this.returnObject ? i : this.getValue(i);
                }));
                // When selecting multiple
                // adjust menu after each
                // selection
                this.$nextTick(() => {
                    this.$refs.menu &&
                        this.$refs.menu.updateDimensions();
                });
                // We only need to reset list index for multiple
                // to keep highlight when an item is toggled
                // on and off
                if (!this.multiple)
                    return;
                const listIndex = this.getMenuIndex();
                this.setMenuIndex(-1);
                // There is no item to re-highlight
                // when selections are hidden
                if (this.hideSelected)
                    return;
                this.$nextTick(() => this.setMenuIndex(listIndex));
            }
        },
        setMenuIndex(index) {
            this.$refs.menu && (this.$refs.menu.listIndex = index);
        },
        setSelectedItems() {
            const selectedItems = [];
            const values = !this.multiple || !Array.isArray(this.internalValue)
                ? [this.internalValue]
                : this.internalValue;
            for (const value of values) {
                const index = this.allItems.findIndex(v => this.valueComparator(this.getValue(v), this.getValue(value)));
                if (index > -1) {
                    selectedItems.push(this.allItems[index]);
                }
            }
            this.selectedItems = selectedItems;
        },
        setValue(value) {
            const oldValue = this.internalValue;
            this.internalValue = value;
            value !== oldValue && this.$emit('change', value);
        },
        isAppendInner(target) {
            // return true if append inner is present
            // and the target is itself or inside
            const appendInner = this.$refs['append-inner'];
            return appendInner && (appendInner === target || appendInner.contains(target));
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlNlbGVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZTZWxlY3QvVlNlbGVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTywrQkFBK0IsQ0FBQTtBQUN0QyxPQUFPLGdCQUFnQixDQUFBO0FBRXZCLGFBQWE7QUFDYixPQUFPLEtBQUssTUFBTSxVQUFVLENBQUE7QUFDNUIsT0FBTyxLQUFLLE1BQU0sVUFBVSxDQUFBO0FBQzVCLE9BQU8sV0FBVyxNQUFNLGVBQWUsQ0FBQTtBQUV2QyxhQUFhO0FBQ2IsT0FBTyxNQUFNLE1BQU0sV0FBVyxDQUFBO0FBQzlCLE9BQU8sVUFBVSxNQUFNLDBCQUEwQixDQUFBO0FBRWpELFNBQVM7QUFDVCxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUNoRCxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUVoRCxhQUFhO0FBQ2IsT0FBTyxZQUFZLE1BQU0sZ0NBQWdDLENBQUE7QUFFekQsWUFBWTtBQUNaLE9BQU8sU0FBUyxNQUFNLHNCQUFzQixDQUFBO0FBQzVDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxvQkFBb0IsRUFBRSxRQUFRLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUN4RixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFFakQsUUFBUTtBQUNSLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBSXRDLE1BQU0sQ0FBQyxNQUFNLGdCQUFnQixHQUFHO0lBQzlCLFlBQVksRUFBRSxLQUFLO0lBQ25CLG1CQUFtQixFQUFFLEtBQUs7SUFDMUIsV0FBVyxFQUFFLElBQUk7SUFDakIsV0FBVyxFQUFFLEtBQUs7SUFDbEIsU0FBUyxFQUFFLEdBQUc7Q0FDZixDQUFBO0FBRUQsUUFBUTtBQUNSLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FDdkIsVUFBVSxFQUNWLFVBQVUsRUFDVixVQUFVLENBQ1gsQ0FB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Q0FBQTtZQUNuQyxJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQTtZQUMxQixLQUFLLEtBQUssUUFBUSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFBO1FBQ25ELENBQUM7UUFDRCxhQUFhLENBQUUsTUFBVztZQUN4Qix5Q0FBeUM7WUFDekMscUNBQXFDO1lBQ3JDLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUE7WUFFOUMsT0FBTyxXQUFXLElBQUksQ0FBQyxXQUFXLEtBQUssTUFBTSxJQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtRQUNoRixDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcbmltcG9ydCAnLi4vVlRleHRGaWVsZC9WVGV4dEZpZWxkLnNhc3MnXG5pbXBvcnQgJy4vVlNlbGVjdC5zYXNzJ1xuXG4vLyBDb21wb25lbnRzXG5pbXBvcnQgVkNoaXAgZnJvbSAnLi4vVkNoaXAnXG5pbXBvcnQgVk1lbnUgZnJvbSAnLi4vVk1lbnUnXG5pbXBvcnQgVlNlbGVjdExpc3QgZnJvbSAnLi9WU2VsZWN0TGlzdCdcblxuLy8gRXh0ZW5zaW9uc1xuaW1wb3J0IFZJbnB1dCBmcm9tICcuLi9WSW5wdXQnXG5pbXBvcnQgVlRleHRGaWVsZCBmcm9tICcuLi9WVGV4dEZpZWxkL1ZUZXh0RmllbGQnXG5cbi8vIE1peGluc1xuaW1wb3J0IENvbXBhcmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2NvbXBhcmFibGUnXG5pbXBvcnQgRmlsdGVyYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvZmlsdGVyYWJsZSdcblxuLy8gRGlyZWN0aXZlc1xuaW1wb3J0IENsaWNrT3V0c2lkZSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL2NsaWNrLW91dHNpZGUnXG5cbi8vIFV0aWxpdGllc1xuaW1wb3J0IG1lcmdlRGF0YSBmcm9tICcuLi8uLi91dGlsL21lcmdlRGF0YSdcbmltcG9ydCB7IGdldFByb3BlcnR5RnJvbUl0ZW0sIGdldE9iamVjdFZhbHVlQnlQYXRoLCBrZXlDb2RlcyB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcbmltcG9ydCB7IGNvbnNvbGVFcnJvciB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcblxuLy8gVHlwZXNcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5pbXBvcnQgeyBWTm9kZSwgVk5vZGVEaXJlY3RpdmUsIFByb3BUeXBlLCBWTm9kZURhdGEgfSBmcm9tICd2dWUnXG5pbXBvcnQgeyBTZWxlY3RJdGVtS2V5IH0gZnJvbSAndnVldGlmeS90eXBlcydcblxuZXhwb3J0IGNvbnN0IGRlZmF1bHRNZW51UHJvcHMgPSB7XG4gIGNsb3NlT25DbGljazogZmFsc2UsXG4gIGNsb3NlT25Db250ZW50Q2xpY2s6IGZhbHNlLFxuICBkaXNhYmxlS2V5czogdHJ1ZSxcbiAgb3Blbk9uQ2xpY2s6IGZhbHNlLFxuICBtYXhIZWlnaHQ6IDMwNCxcbn1cblxuLy8gVHlwZXNcbmNvbnN0IGJhc2VNaXhpbnMgPSBtaXhpbnMoXG4gIFZUZXh0RmllbGQsXG4gIENvbXBhcmFibGUsXG4gIEZpbHRlcmFibGVcbilcblxuaW50ZXJmYWNlIG9wdGlvbnMgZXh0ZW5kcyBJbnN0YW5jZVR5cGU8dHlwZW9mIGJhc2VNaXhpbnM+IHtcbiAgJHJlZnM6IHtcbiAgICBtZW51OiBJbnN0YW5jZVR5cGU8dHlwZW9mIFZNZW51PlxuICAgIGxhYmVsOiBIVE1MRWxlbWVudFxuICAgIGlucHV0OiBIVE1MSW5wdXRFbGVtZW50XG4gICAgJ3ByZXBlbmQtaW5uZXInOiBIVE1MRWxlbWVudFxuICAgICdhcHBlbmQtaW5uZXInOiBIVE1MRWxlbWVudFxuICAgIHByZWZpeDogSFRNTEVsZW1lbnRcbiAgICBzdWZmaXg6IEhUTUxFbGVtZW50XG4gIH1cbn1cblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IGJhc2VNaXhpbnMuZXh0ZW5kPG9wdGlvbnM+KCkuZXh0ZW5kKHtcbiAgbmFtZTogJ3Ytc2VsZWN0JyxcblxuICBkaXJlY3RpdmVzOiB7XG4gICAgQ2xpY2tPdXRzaWRlLFxuICB9LFxuXG4gIHByb3BzOiB7XG4gICAgYXBwZW5kSWNvbjoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJyRkcm9wZG93bicsXG4gICAgfSxcbiAgICBhdHRhY2g6IHtcbiAgICAgIHR5cGU6IG51bGwgYXMgdW5rbm93biBhcyBQcm9wVHlwZTxzdHJpbmcgfCBib29sZWFuIHwgRWxlbWVudCB8IFZOb2RlPixcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIH0sXG4gICAgY2FjaGVJdGVtczogQm9vbGVhbixcbiAgICBjaGlwczogQm9vbGVhbixcbiAgICBjbGVhcmFibGU6IEJvb2xlYW4sXG4gICAgZGVsZXRhYmxlQ2hpcHM6IEJvb2xlYW4sXG4gICAgZGlzYWJsZUxvb2t1cDogQm9vbGVhbixcbiAgICBlYWdlcjogQm9vbGVhbixcbiAgICBoaWRlU2VsZWN0ZWQ6IEJvb2xlYW4sXG4gICAgaXRlbXM6IHtcbiAgICAgIHR5cGU6IEFycmF5LFxuICAgICAgZGVmYXVsdDogKCkgPT4gW10sXG4gICAgfSxcbiAgICBpdGVtQ29sb3I6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICdwcmltYXJ5JyxcbiAgICB9LFxuICAgIGl0ZW1EaXNhYmxlZDoge1xuICAgICAgdHlwZTogW1N0cmluZywgQXJyYXksIEZ1bmN0aW9uXSBhcyBQcm9wVHlwZTxTZWxlY3RJdGVtS2V5PixcbiAgICAgIGRlZmF1bHQ6ICdkaXNhYmxlZCcsXG4gICAgfSxcbiAgICBpdGVtVGV4dDoge1xuICAgICAgdHlwZTogW1N0cmluZywgQXJyYXksIEZ1bmN0aW9uXSBhcyBQcm9wVHlwZTxTZWxlY3RJdGVtS2V5PixcbiAgICAgIGRlZmF1bHQ6ICd0ZXh0JyxcbiAgICB9LFxuICAgIGl0ZW1WYWx1ZToge1xuICAgICAgdHlwZTogW1N0cmluZywgQXJyYXksIEZ1bmN0aW9uXSBhcyBQcm9wVHlwZTxTZWxlY3RJdGVtS2V5PixcbiAgICAgIGRlZmF1bHQ6ICd2YWx1ZScsXG4gICAgfSxcbiAgICBtZW51UHJvcHM6IHtcbiAgICAgIHR5cGU6IFtTdHJpbmcsIEFycmF5LCBPYmplY3RdLFxuICAgICAgZGVmYXVsdDogKCkgPT4gZGVmYXVsdE1lbnVQcm9wcyxcbiAgICB9LFxuICAgIG11bHRpcGxlOiBCb29sZWFuLFxuICAgIG9wZW5PbkNsZWFyOiBCb29sZWFuLFxuICAgIHJldHVybk9iamVjdDogQm9vbGVhbixcbiAgICBzbWFsbENoaXBzOiBCb29sZWFuLFxuICB9LFxuXG4gIGRhdGEgKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjYWNoZWRJdGVtczogdGhpcy5jYWNoZUl0ZW1zID8gdGhpcy5pdGVtcyA6IFtdLFxuICAgICAgbWVudUlzQm9vdGVkOiBmYWxzZSxcbiAgICAgIGlzTWVudUFjdGl2ZTogZmFsc2UsXG4gICAgICBsYXN0SXRlbTogMjAsXG4gICAgICAvLyBBcyBsb25nIGFzIGEgdmFsdWUgaXMgZGVmaW5lZCwgc2hvdyBpdFxuICAgICAgLy8gT3RoZXJ3aXNlLCBjaGVjayBpZiBtdWx0aXBsZVxuICAgICAgLy8gdG8gZGV0ZXJtaW5lIHdoaWNoIGRlZmF1bHQgdG8gcHJvdmlkZVxuICAgICAgbGF6eVZhbHVlOiB0aGlzLnZhbHVlICE9PSB1bmRlZmluZWRcbiAgICAgICAgPyB0aGlzLnZhbHVlXG4gICAgICAgIDogdGhpcy5tdWx0aXBsZSA/IFtdIDogdW5kZWZpbmVkLFxuICAgICAgc2VsZWN0ZWRJbmRleDogLTEsXG4gICAgICBzZWxlY3RlZEl0ZW1zOiBbXSBhcyBhbnlbXSxcbiAgICAgIGtleWJvYXJkTG9va3VwUHJlZml4OiAnJyxcbiAgICAgIGtleWJvYXJkTG9va3VwTGFzdFRpbWU6IDAsXG4gICAgfVxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgLyogQWxsIGl0ZW1zIHRoYXQgdGhlIHNlbGVjdCBoYXMgKi9cbiAgICBhbGxJdGVtcyAoKTogb2JqZWN0W10ge1xuICAgICAgcmV0dXJuIHRoaXMuZmlsdGVyRHVwbGljYXRlcyh0aGlzLmNhY2hlZEl0ZW1zLmNvbmNhdCh0aGlzLml0ZW1zKSlcbiAgICB9LFxuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5WVGV4dEZpZWxkLm9wdGlvbnMuY29tcHV0ZWQuY2xhc3Nlcy5jYWxsKHRoaXMpLFxuICAgICAgICAndi1zZWxlY3QnOiB0cnVlLFxuICAgICAgICAndi1zZWxlY3QtLWNoaXBzJzogdGhpcy5oYXNDaGlwcyxcbiAgICAgICAgJ3Ytc2VsZWN0LS1jaGlwcy0tc21hbGwnOiB0aGlzLnNtYWxsQ2hpcHMsXG4gICAgICAgICd2LXNlbGVjdC0taXMtbWVudS1hY3RpdmUnOiB0aGlzLmlzTWVudUFjdGl2ZSxcbiAgICAgICAgJ3Ytc2VsZWN0LS1pcy1tdWx0aSc6IHRoaXMubXVsdGlwbGUsXG4gICAgICB9XG4gICAgfSxcbiAgICAvKiBVc2VkIGJ5IG90aGVyIGNvbXBvbmVudHMgdG8gb3ZlcndyaXRlICovXG4gICAgY29tcHV0ZWRJdGVtcyAoKTogb2JqZWN0W10ge1xuICAgICAgcmV0dXJuIHRoaXMuYWxsSXRlbXNcbiAgICB9LFxuICAgIGNvbXB1dGVkT3ducyAoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiBgbGlzdC0ke3RoaXMuX3VpZH1gXG4gICAgfSxcbiAgICBjb21wdXRlZENvdW50ZXJWYWx1ZSAoKTogbnVtYmVyIHtcbiAgICAgIHJldHVybiB0aGlzLm11bHRpcGxlXG4gICAgICAgID8gdGhpcy5zZWxlY3RlZEl0ZW1zLmxlbmd0aFxuICAgICAgICA6ICh0aGlzLmdldFRleHQodGhpcy5zZWxlY3RlZEl0ZW1zWzBdKSB8fCAnJykudG9TdHJpbmcoKS5sZW5ndGhcbiAgICB9LFxuICAgIGRpcmVjdGl2ZXMgKCk6IFZOb2RlRGlyZWN0aXZlW10gfCB1bmRlZmluZWQge1xuICAgICAgcmV0dXJuIHRoaXMuaXNGb2N1c2VkID8gW3tcbiAgICAgICAgbmFtZTogJ2NsaWNrLW91dHNpZGUnLFxuICAgICAgICB2YWx1ZToge1xuICAgICAgICAgIGhhbmRsZXI6IHRoaXMuYmx1cixcbiAgICAgICAgICBjbG9zZUNvbmRpdGlvbmFsOiB0aGlzLmNsb3NlQ29uZGl0aW9uYWwsXG4gICAgICAgIH0sXG4gICAgICB9XSA6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgZHluYW1pY0hlaWdodCAoKSB7XG4gICAgICByZXR1cm4gJ2F1dG8nXG4gICAgfSxcbiAgICBoYXNDaGlwcyAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5jaGlwcyB8fCB0aGlzLnNtYWxsQ2hpcHNcbiAgICB9LFxuICAgIGhhc1Nsb3QgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIEJvb2xlYW4odGhpcy5oYXNDaGlwcyB8fCB0aGlzLiRzY29wZWRTbG90cy5zZWxlY3Rpb24pXG4gICAgfSxcbiAgICBpc0RpcnR5ICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkSXRlbXMubGVuZ3RoID4gMFxuICAgIH0sXG4gICAgbGlzdERhdGEgKCk6IG9iamVjdCB7XG4gICAgICBjb25zdCBzY29wZUlkID0gdGhpcy4kdm5vZGUgJiYgKHRoaXMuJHZub2RlLmNvbnRleHQhLiRvcHRpb25zIGFzIHsgW2tleTogc3RyaW5nXTogYW55IH0pLl9zY29wZUlkXG4gICAgICBjb25zdCBhdHRycyA9IHNjb3BlSWQgPyB7XG4gICAgICAgIFtzY29wZUlkXTogdHJ1ZSxcbiAgICAgIH0gOiB7fVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBhdHRyczoge1xuICAgICAgICAgIC4uLmF0dHJzLFxuICAgICAgICAgIGlkOiB0aGlzLmNvbXB1dGVkT3ducyxcbiAgICAgICAgfSxcbiAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICBhY3Rpb246IHRoaXMubXVsdGlwbGUsXG4gICAgICAgICAgY29sb3I6IHRoaXMuaXRlbUNvbG9yLFxuICAgICAgICAgIGRlbnNlOiB0aGlzLmRlbnNlLFxuICAgICAgICAgIGhpZGVTZWxlY3RlZDogdGhpcy5oaWRlU2VsZWN0ZWQsXG4gICAgICAgICAgaXRlbXM6IHRoaXMudmlydHVhbGl6ZWRJdGVtcyxcbiAgICAgICAgICBpdGVtRGlzYWJsZWQ6IHRoaXMuaXRlbURpc2FibGVkLFxuICAgICAgICAgIGl0ZW1UZXh0OiB0aGlzLml0ZW1UZXh0LFxuICAgICAgICAgIGl0ZW1WYWx1ZTogdGhpcy5pdGVtVmFsdWUsXG4gICAgICAgICAgbm9EYXRhVGV4dDogdGhpcy4kdnVldGlmeS5sYW5nLnQodGhpcy5ub0RhdGFUZXh0KSxcbiAgICAgICAgICBzZWxlY3RlZEl0ZW1zOiB0aGlzLnNlbGVjdGVkSXRlbXMsXG4gICAgICAgIH0sXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgc2VsZWN0OiB0aGlzLnNlbGVjdEl0ZW0sXG4gICAgICAgIH0sXG4gICAgICAgIHNjb3BlZFNsb3RzOiB7XG4gICAgICAgICAgaXRlbTogdGhpcy4kc2NvcGVkU2xvdHMuaXRlbSxcbiAgICAgICAgfSxcbiAgICAgIH1cbiAgICB9LFxuICAgIHN0YXRpY0xpc3QgKCk6IFZOb2RlIHtcbiAgICAgIGlmICh0aGlzLiRzbG90c1snbm8tZGF0YSddIHx8IHRoaXMuJHNsb3RzWydwcmVwZW5kLWl0ZW0nXSB8fCB0aGlzLiRzbG90c1snYXBwZW5kLWl0ZW0nXSkge1xuICAgICAgICBjb25zb2xlRXJyb3IoJ2Fzc2VydDogc3RhdGljTGlzdCBzaG91bGQgbm90IGJlIGNhbGxlZCBpZiBzbG90cyBhcmUgdXNlZCcpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZTZWxlY3RMaXN0LCB0aGlzLmxpc3REYXRhKVxuICAgIH0sXG4gICAgdmlydHVhbGl6ZWRJdGVtcyAoKTogb2JqZWN0W10ge1xuICAgICAgcmV0dXJuICh0aGlzLiRfbWVudVByb3BzIGFzIGFueSkuYXV0b1xuICAgICAgICA/IHRoaXMuY29tcHV0ZWRJdGVtc1xuICAgICAgICA6IHRoaXMuY29tcHV0ZWRJdGVtcy5zbGljZSgwLCB0aGlzLmxhc3RJdGVtKVxuICAgIH0sXG4gICAgbWVudUNhblNob3c6ICgpID0+IHRydWUsXG4gICAgJF9tZW51UHJvcHMgKCk6IG9iamVjdCB7XG4gICAgICBsZXQgbm9ybWFsaXNlZFByb3BzID0gdHlwZW9mIHRoaXMubWVudVByb3BzID09PSAnc3RyaW5nJ1xuICAgICAgICA/IHRoaXMubWVudVByb3BzLnNwbGl0KCcsJylcbiAgICAgICAgOiB0aGlzLm1lbnVQcm9wc1xuXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShub3JtYWxpc2VkUHJvcHMpKSB7XG4gICAgICAgIG5vcm1hbGlzZWRQcm9wcyA9IG5vcm1hbGlzZWRQcm9wcy5yZWR1Y2UoKGFjYywgcCkgPT4ge1xuICAgICAgICAgIGFjY1twLnRyaW0oKV0gPSB0cnVlXG4gICAgICAgICAgcmV0dXJuIGFjY1xuICAgICAgICB9LCB7fSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uZGVmYXVsdE1lbnVQcm9wcyxcbiAgICAgICAgZWFnZXI6IHRoaXMuZWFnZXIsXG4gICAgICAgIHZhbHVlOiB0aGlzLm1lbnVDYW5TaG93ICYmIHRoaXMuaXNNZW51QWN0aXZlLFxuICAgICAgICBudWRnZUJvdHRvbTogbm9ybWFsaXNlZFByb3BzLm9mZnNldFkgPyAxIDogMCwgLy8gY29udmVydCB0byBpbnRcbiAgICAgICAgLi4ubm9ybWFsaXNlZFByb3BzLFxuICAgICAgfVxuICAgIH0sXG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICBpbnRlcm5hbFZhbHVlICh2YWwpIHtcbiAgICAgIHRoaXMuaW5pdGlhbFZhbHVlID0gdmFsXG4gICAgICB0aGlzLnNldFNlbGVjdGVkSXRlbXMoKVxuICAgIH0sXG4gICAgaXNNZW51QWN0aXZlICh2YWwpIHtcbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHRoaXMub25NZW51QWN0aXZlQ2hhbmdlKHZhbCkpXG4gICAgfSxcbiAgICBpdGVtczoge1xuICAgICAgaW1tZWRpYXRlOiB0cnVlLFxuICAgICAgaGFuZGxlciAodmFsKSB7XG4gICAgICAgIGlmICh0aGlzLmNhY2hlSXRlbXMpIHtcbiAgICAgICAgICAvLyBCcmVha3MgdnVlLXRlc3QtdXRpbHMgaWZcbiAgICAgICAgICAvLyB0aGlzIGlzbid0IGNhbGN1bGF0ZWRcbiAgICAgICAgICAvLyBvbiB0aGUgbmV4dCB0aWNrXG4gICAgICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jYWNoZWRJdGVtcyA9IHRoaXMuZmlsdGVyRHVwbGljYXRlcyh0aGlzLmNhY2hlZEl0ZW1zLmNvbmNhdCh2YWwpKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFNlbGVjdGVkSXRlbXMoKVxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICAvKiogQHB1YmxpYyAqL1xuICAgIGJsdXIgKGU/OiBFdmVudCkge1xuICAgICAgVlRleHRGaWVsZC5vcHRpb25zLm1ldGhvZHMuYmx1ci5jYWxsKHRoaXMsIGUpXG4gICAgICB0aGlzLmlzTWVudUFjdGl2ZSA9IGZhbHNlXG4gICAgICB0aGlzLmlzRm9jdXNlZCA9IGZhbHNlXG4gICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSAtMVxuICAgIH0sXG4gICAgLyoqIEBwdWJsaWMgKi9cbiAgICBhY3RpdmF0ZU1lbnUgKCkge1xuICAgICAgaWYgKFxuICAgICAgICAhdGhpcy5pc0ludGVyYWN0aXZlIHx8XG4gICAgICAgIHRoaXMuaXNNZW51QWN0aXZlXG4gICAgICApIHJldHVyblxuXG4gICAgICB0aGlzLmlzTWVudUFjdGl2ZSA9IHRydWVcbiAgICB9LFxuICAgIGNsZWFyYWJsZUNhbGxiYWNrICgpIHtcbiAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy5tdWx0aXBsZSA/IFtdIDogdW5kZWZpbmVkKVxuICAgICAgdGhpcy5zZXRNZW51SW5kZXgoLTEpXG4gICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB0aGlzLiRyZWZzLmlucHV0ICYmIHRoaXMuJHJlZnMuaW5wdXQuZm9jdXMoKSlcblxuICAgICAgaWYgKHRoaXMub3Blbk9uQ2xlYXIpIHRoaXMuaXNNZW51QWN0aXZlID0gdHJ1ZVxuICAgIH0sXG4gICAgY2xvc2VDb25kaXRpb25hbCAoZTogRXZlbnQpIHtcbiAgICAgIGlmICghdGhpcy5pc01lbnVBY3RpdmUpIHJldHVybiB0cnVlXG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgICF0aGlzLl9pc0Rlc3Ryb3llZCAmJlxuXG4gICAgICAgIC8vIENsaWNrIG9yaWdpbmF0ZXMgZnJvbSBvdXRzaWRlIHRoZSBtZW51IGNvbnRlbnRcbiAgICAgICAgLy8gTXVsdGlwbGUgc2VsZWN0cyBkb24ndCBjbG9zZSB3aGVuIGFuIGl0ZW0gaXMgY2xpY2tlZFxuICAgICAgICAoIXRoaXMuZ2V0Q29udGVudCgpIHx8XG4gICAgICAgICF0aGlzLmdldENvbnRlbnQoKS5jb250YWlucyhlLnRhcmdldCBhcyBOb2RlKSkgJiZcblxuICAgICAgICAvLyBDbGljayBvcmlnaW5hdGVzIGZyb20gb3V0c2lkZSB0aGUgZWxlbWVudFxuICAgICAgICB0aGlzLiRlbCAmJlxuICAgICAgICAhdGhpcy4kZWwuY29udGFpbnMoZS50YXJnZXQgYXMgTm9kZSkgJiZcbiAgICAgICAgZS50YXJnZXQgIT09IHRoaXMuJGVsXG4gICAgICApXG4gICAgfSxcbiAgICBmaWx0ZXJEdXBsaWNhdGVzIChhcnI6IGFueVtdKSB7XG4gICAgICBjb25zdCB1bmlxdWVWYWx1ZXMgPSBuZXcgTWFwKClcbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBhcnIubGVuZ3RoOyArK2luZGV4KSB7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSBhcnJbaW5kZXhdXG4gICAgICAgIGNvbnN0IHZhbCA9IHRoaXMuZ2V0VmFsdWUoaXRlbSlcblxuICAgICAgICAvLyBUT0RPOiBjb21wYXJhdG9yXG4gICAgICAgICF1bmlxdWVWYWx1ZXMuaGFzKHZhbCkgJiYgdW5pcXVlVmFsdWVzLnNldCh2YWwsIGl0ZW0pXG4gICAgICB9XG4gICAgICByZXR1cm4gQXJyYXkuZnJvbSh1bmlxdWVWYWx1ZXMudmFsdWVzKCkpXG4gICAgfSxcbiAgICBmaW5kRXhpc3RpbmdJbmRleCAoaXRlbTogb2JqZWN0KSB7XG4gICAgICBjb25zdCBpdGVtVmFsdWUgPSB0aGlzLmdldFZhbHVlKGl0ZW0pXG5cbiAgICAgIHJldHVybiAodGhpcy5pbnRlcm5hbFZhbHVlIHx8IFtdKS5maW5kSW5kZXgoKGk6IG9iamVjdCkgPT4gdGhpcy52YWx1ZUNvbXBhcmF0b3IodGhpcy5nZXRWYWx1ZShpKSwgaXRlbVZhbHVlKSlcbiAgICB9LFxuICAgIGdldENvbnRlbnQgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuJHJlZnMubWVudSAmJiB0aGlzLiRyZWZzLm1lbnUuJHJlZnMuY29udGVudFxuICAgIH0sXG4gICAgZ2VuQ2hpcFNlbGVjdGlvbiAoaXRlbTogb2JqZWN0LCBpbmRleDogbnVtYmVyKSB7XG4gICAgICBjb25zdCBpc0Rpc2FibGVkID0gKFxuICAgICAgICAhdGhpcy5pc0ludGVyYWN0aXZlIHx8XG4gICAgICAgIHRoaXMuZ2V0RGlzYWJsZWQoaXRlbSlcbiAgICAgIClcblxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkNoaXAsIHtcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWNoaXAtLXNlbGVjdCcsXG4gICAgICAgIGF0dHJzOiB7IHRhYmluZGV4OiAtMSB9LFxuICAgICAgICBwcm9wczoge1xuICAgICAgICAgIGNsb3NlOiB0aGlzLmRlbGV0YWJsZUNoaXBzICYmICFpc0Rpc2FibGVkLFxuICAgICAgICAgIGRpc2FibGVkOiBpc0Rpc2FibGVkLFxuICAgICAgICAgIGlucHV0VmFsdWU6IGluZGV4ID09PSB0aGlzLnNlbGVjdGVkSW5kZXgsXG4gICAgICAgICAgc21hbGw6IHRoaXMuc21hbGxDaGlwcyxcbiAgICAgICAgfSxcbiAgICAgICAgb246IHtcbiAgICAgICAgICBjbGljazogKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmIChpc0Rpc2FibGVkKSByZXR1cm5cblxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSBpbmRleFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ2NsaWNrOmNsb3NlJzogKCkgPT4gdGhpcy5vbkNoaXBJbnB1dChpdGVtKSxcbiAgICAgICAgfSxcbiAgICAgICAga2V5OiBKU09OLnN0cmluZ2lmeSh0aGlzLmdldFZhbHVlKGl0ZW0pKSxcbiAgICAgIH0sIHRoaXMuZ2V0VGV4dChpdGVtKSlcbiAgICB9LFxuICAgIGdlbkNvbW1hU2VsZWN0aW9uIChpdGVtOiBvYmplY3QsIGluZGV4OiBudW1iZXIsIGxhc3Q6IGJvb2xlYW4pIHtcbiAgICAgIGNvbnN0IGNvbG9yID0gaW5kZXggPT09IHRoaXMuc2VsZWN0ZWRJbmRleCAmJiB0aGlzLmNvbXB1dGVkQ29sb3JcbiAgICAgIGNvbnN0IGlzRGlzYWJsZWQgPSAoXG4gICAgICAgICF0aGlzLmlzSW50ZXJhY3RpdmUgfHxcbiAgICAgICAgdGhpcy5nZXREaXNhYmxlZChpdGVtKVxuICAgICAgKVxuXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2JywgdGhpcy5zZXRUZXh0Q29sb3IoY29sb3IsIHtcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LXNlbGVjdF9fc2VsZWN0aW9uIHYtc2VsZWN0X19zZWxlY3Rpb24tLWNvbW1hJyxcbiAgICAgICAgY2xhc3M6IHtcbiAgICAgICAgICAndi1zZWxlY3RfX3NlbGVjdGlvbi0tZGlzYWJsZWQnOiBpc0Rpc2FibGVkLFxuICAgICAgICB9LFxuICAgICAgICBrZXk6IEpTT04uc3RyaW5naWZ5KHRoaXMuZ2V0VmFsdWUoaXRlbSkpLFxuICAgICAgfSksIGAke3RoaXMuZ2V0VGV4dChpdGVtKX0ke2xhc3QgPyAnJyA6ICcsICd9YClcbiAgICB9LFxuICAgIGdlbkRlZmF1bHRTbG90ICgpOiAoVk5vZGUgfCBWTm9kZVtdIHwgbnVsbClbXSB7XG4gICAgICBjb25zdCBzZWxlY3Rpb25zID0gdGhpcy5nZW5TZWxlY3Rpb25zKClcbiAgICAgIGNvbnN0IGlucHV0ID0gdGhpcy5nZW5JbnB1dCgpXG5cbiAgICAgIC8vIElmIHRoZSByZXR1cm4gaXMgYW4gZW1wdHkgYXJyYXlcbiAgICAgIC8vIHB1c2ggdGhlIGlucHV0XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShzZWxlY3Rpb25zKSkge1xuICAgICAgICBzZWxlY3Rpb25zLnB1c2goaW5wdXQpXG4gICAgICAvLyBPdGhlcndpc2UgcHVzaCBpdCBpbnRvIGNoaWxkcmVuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxlY3Rpb25zLmNoaWxkcmVuID0gc2VsZWN0aW9ucy5jaGlsZHJlbiB8fCBbXVxuICAgICAgICBzZWxlY3Rpb25zLmNoaWxkcmVuLnB1c2goaW5wdXQpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBbXG4gICAgICAgIHRoaXMuZ2VuRmllbGRzZXQoKSxcbiAgICAgICAgdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICAgIHN0YXRpY0NsYXNzOiAndi1zZWxlY3RfX3Nsb3QnLFxuICAgICAgICAgIGRpcmVjdGl2ZXM6IHRoaXMuZGlyZWN0aXZlcyxcbiAgICAgICAgfSwgW1xuICAgICAgICAgIHRoaXMuZ2VuTGFiZWwoKSxcbiAgICAgICAgICB0aGlzLnByZWZpeCA/IHRoaXMuZ2VuQWZmaXgoJ3ByZWZpeCcpIDogbnVsbCxcbiAgICAgICAgICBzZWxlY3Rpb25zLFxuICAgICAgICAgIHRoaXMuc3VmZml4ID8gdGhpcy5nZW5BZmZpeCgnc3VmZml4JykgOiBudWxsLFxuICAgICAgICAgIHRoaXMuZ2VuQ2xlYXJJY29uKCksXG4gICAgICAgICAgdGhpcy5nZW5JY29uU2xvdCgpLFxuICAgICAgICAgIHRoaXMuZ2VuSGlkZGVuSW5wdXQoKSxcbiAgICAgICAgXSksXG4gICAgICAgIHRoaXMuZ2VuTWVudSgpLFxuICAgICAgICB0aGlzLmdlblByb2dyZXNzKCksXG4gICAgICBdXG4gICAgfSxcbiAgICBnZW5JY29uIChcbiAgICAgIHR5cGU6IHN0cmluZyxcbiAgICAgIGNiPzogKGU6IEV2ZW50KSA9PiB2b2lkLFxuICAgICAgZXh0cmFEYXRhPzogVk5vZGVEYXRhXG4gICAgKSB7XG4gICAgICBjb25zdCBpY29uID0gVklucHV0Lm9wdGlvbnMubWV0aG9kcy5nZW5JY29uLmNhbGwodGhpcywgdHlwZSwgY2IsIGV4dHJhRGF0YSlcblxuICAgICAgaWYgKHR5cGUgPT09ICdhcHBlbmQnKSB7XG4gICAgICAgIC8vIERvbid0IGFsbG93IHRoZSBkcm9wZG93biBpY29uIHRvIGJlIGZvY3VzZWRcbiAgICAgICAgaWNvbi5jaGlsZHJlbiFbMF0uZGF0YSA9IG1lcmdlRGF0YShpY29uLmNoaWxkcmVuIVswXS5kYXRhISwge1xuICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICB0YWJpbmRleDogaWNvbi5jaGlsZHJlbiFbMF0uY29tcG9uZW50T3B0aW9ucyEubGlzdGVuZXJzICYmICctMScsXG4gICAgICAgICAgICAnYXJpYS1oaWRkZW4nOiAndHJ1ZScsXG4gICAgICAgICAgICAnYXJpYS1sYWJlbCc6IHVuZGVmaW5lZCxcbiAgICAgICAgICB9LFxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gaWNvblxuICAgIH0sXG4gICAgZ2VuSW5wdXQgKCk6IFZOb2RlIHtcbiAgICAgIGNvbnN0IGlucHV0ID0gVlRleHRGaWVsZC5vcHRpb25zLm1ldGhvZHMuZ2VuSW5wdXQuY2FsbCh0aGlzKVxuXG4gICAgICBkZWxldGUgaW5wdXQuZGF0YSEuYXR0cnMhLm5hbWVcblxuICAgICAgaW5wdXQuZGF0YSA9IG1lcmdlRGF0YShpbnB1dC5kYXRhISwge1xuICAgICAgICBkb21Qcm9wczogeyB2YWx1ZTogbnVsbCB9LFxuICAgICAgICBhdHRyczoge1xuICAgICAgICAgIHJlYWRvbmx5OiB0cnVlLFxuICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAnYXJpYS1yZWFkb25seSc6IFN0cmluZyh0aGlzLmlzUmVhZG9ubHkpLFxuICAgICAgICAgICdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnOiBnZXRPYmplY3RWYWx1ZUJ5UGF0aCh0aGlzLiRyZWZzLm1lbnUsICdhY3RpdmVUaWxlLmlkJyksXG4gICAgICAgICAgYXV0b2NvbXBsZXRlOiBnZXRPYmplY3RWYWx1ZUJ5UGF0aChpbnB1dC5kYXRhISwgJ2F0dHJzLmF1dG9jb21wbGV0ZScsICdvZmYnKSxcbiAgICAgICAgfSxcbiAgICAgICAgb246IHsga2V5cHJlc3M6IHRoaXMub25LZXlQcmVzcyB9LFxuICAgICAgfSlcblxuICAgICAgcmV0dXJuIGlucHV0XG4gICAgfSxcbiAgICBnZW5IaWRkZW5JbnB1dCAoKTogVk5vZGUge1xuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2lucHV0Jywge1xuICAgICAgICBkb21Qcm9wczogeyB2YWx1ZTogdGhpcy5sYXp5VmFsdWUgfSxcbiAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICB0eXBlOiAnaGlkZGVuJyxcbiAgICAgICAgICBuYW1lOiB0aGlzLmF0dHJzJC5uYW1lLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9LFxuICAgIGdlbklucHV0U2xvdCAoKTogVk5vZGUge1xuICAgICAgY29uc3QgcmVuZGVyID0gVlRleHRGaWVsZC5vcHRpb25zLm1ldGhvZHMuZ2VuSW5wdXRTbG90LmNhbGwodGhpcylcblxuICAgICAgcmVuZGVyLmRhdGEhLmF0dHJzID0ge1xuICAgICAgICAuLi5yZW5kZXIuZGF0YSEuYXR0cnMsXG4gICAgICAgIHJvbGU6ICdidXR0b24nLFxuICAgICAgICAnYXJpYS1oYXNwb3B1cCc6ICdsaXN0Ym94JyxcbiAgICAgICAgJ2FyaWEtZXhwYW5kZWQnOiBTdHJpbmcodGhpcy5pc01lbnVBY3RpdmUpLFxuICAgICAgICAnYXJpYS1vd25zJzogdGhpcy5jb21wdXRlZE93bnMsXG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZW5kZXJcbiAgICB9LFxuICAgIGdlbkxpc3QgKCk6IFZOb2RlIHtcbiAgICAgIC8vIElmIHRoZXJlJ3Mgbm8gc2xvdHMsIHdlIGNhbiB1c2UgYSBjYWNoZWQgVk5vZGUgdG8gaW1wcm92ZSBwZXJmb3JtYW5jZVxuICAgICAgaWYgKHRoaXMuJHNsb3RzWyduby1kYXRhJ10gfHwgdGhpcy4kc2xvdHNbJ3ByZXBlbmQtaXRlbSddIHx8IHRoaXMuJHNsb3RzWydhcHBlbmQtaXRlbSddKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdlbkxpc3RXaXRoU2xvdCgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0aWNMaXN0XG4gICAgICB9XG4gICAgfSxcbiAgICBnZW5MaXN0V2l0aFNsb3QgKCk6IFZOb2RlIHtcbiAgICAgIGNvbnN0IHNsb3RzID0gWydwcmVwZW5kLWl0ZW0nLCAnbm8tZGF0YScsICdhcHBlbmQtaXRlbSddXG4gICAgICAgIC5maWx0ZXIoc2xvdE5hbWUgPT4gdGhpcy4kc2xvdHNbc2xvdE5hbWVdKVxuICAgICAgICAubWFwKHNsb3ROYW1lID0+IHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJywge1xuICAgICAgICAgIHNsb3Q6IHNsb3ROYW1lLFxuICAgICAgICB9LCB0aGlzLiRzbG90c1tzbG90TmFtZV0pKVxuICAgICAgLy8gUmVxdWlyZXMgZGVzdHJ1Y3R1cmluZyBkdWUgdG8gVnVlXG4gICAgICAvLyBtb2RpZnlpbmcgdGhlIGBvbmAgcHJvcGVydHkgd2hlbiBwYXNzZWRcbiAgICAgIC8vIGFzIGEgcmVmZXJlbmNlZCBvYmplY3RcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZTZWxlY3RMaXN0LCB7XG4gICAgICAgIC4uLnRoaXMubGlzdERhdGEsXG4gICAgICB9LCBzbG90cylcbiAgICB9LFxuICAgIGdlbk1lbnUgKCk6IFZOb2RlIHtcbiAgICAgIGNvbnN0IHByb3BzID0gdGhpcy4kX21lbnVQcm9wcyBhcyBhbnlcbiAgICAgIHByb3BzLmFjdGl2YXRvciA9IHRoaXMuJHJlZnNbJ2lucHV0LXNsb3QnXVxuXG4gICAgICAvLyBBdHRhY2ggdG8gcm9vdCBlbCBzbyB0aGF0XG4gICAgICAvLyBtZW51IGNvdmVycyBwcmVwZW5kL2FwcGVuZCBpY29uc1xuICAgICAgaWYgKFxuICAgICAgICAvLyBUT0RPOiBtYWtlIHRoaXMgYSBjb21wdXRlZCBwcm9wZXJ0eSBvciBoZWxwZXIgb3Igc29tZXRoaW5nXG4gICAgICAgIHRoaXMuYXR0YWNoID09PSAnJyB8fCAvLyBJZiB1c2VkIGFzIGEgYm9vbGVhbiBwcm9wICg8di1tZW51IGF0dGFjaD4pXG4gICAgICAgIHRoaXMuYXR0YWNoID09PSB0cnVlIHx8IC8vIElmIGJvdW5kIHRvIGEgYm9vbGVhbiAoPHYtbWVudSA6YXR0YWNoPVwidHJ1ZVwiPilcbiAgICAgICAgdGhpcy5hdHRhY2ggPT09ICdhdHRhY2gnIC8vIElmIGJvdW5kIGFzIGJvb2xlYW4gcHJvcCBpbiBwdWcgKHYtbWVudShhdHRhY2gpKVxuICAgICAgKSB7XG4gICAgICAgIHByb3BzLmF0dGFjaCA9IHRoaXMuJGVsXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwcm9wcy5hdHRhY2ggPSB0aGlzLmF0dGFjaFxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudChWTWVudSwge1xuICAgICAgICBhdHRyczogeyByb2xlOiB1bmRlZmluZWQgfSxcbiAgICAgICAgcHJvcHMsXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgaW5wdXQ6ICh2YWw6IGJvb2xlYW4pID0+IHtcbiAgICAgICAgICAgIHRoaXMuaXNNZW51QWN0aXZlID0gdmFsXG4gICAgICAgICAgICB0aGlzLmlzRm9jdXNlZCA9IHZhbFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2Nyb2xsOiB0aGlzLm9uU2Nyb2xsLFxuICAgICAgICB9LFxuICAgICAgICByZWY6ICdtZW51JyxcbiAgICAgIH0sIFt0aGlzLmdlbkxpc3QoKV0pXG4gICAgfSxcbiAgICBnZW5TZWxlY3Rpb25zICgpOiBWTm9kZSB7XG4gICAgICBsZXQgbGVuZ3RoID0gdGhpcy5zZWxlY3RlZEl0ZW1zLmxlbmd0aFxuICAgICAgY29uc3QgY2hpbGRyZW4gPSBuZXcgQXJyYXkobGVuZ3RoKVxuXG4gICAgICBsZXQgZ2VuU2VsZWN0aW9uXG4gICAgICBpZiAodGhpcy4kc2NvcGVkU2xvdHMuc2VsZWN0aW9uKSB7XG4gICAgICAgIGdlblNlbGVjdGlvbiA9IHRoaXMuZ2VuU2xvdFNlbGVjdGlvblxuICAgICAgfSBlbHNlIGlmICh0aGlzLmhhc0NoaXBzKSB7XG4gICAgICAgIGdlblNlbGVjdGlvbiA9IHRoaXMuZ2VuQ2hpcFNlbGVjdGlvblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZ2VuU2VsZWN0aW9uID0gdGhpcy5nZW5Db21tYVNlbGVjdGlvblxuICAgICAgfVxuXG4gICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgY2hpbGRyZW5bbGVuZ3RoXSA9IGdlblNlbGVjdGlvbihcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXNbbGVuZ3RoXSxcbiAgICAgICAgICBsZW5ndGgsXG4gICAgICAgICAgbGVuZ3RoID09PSBjaGlsZHJlbi5sZW5ndGggLSAxXG4gICAgICAgIClcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LXNlbGVjdF9fc2VsZWN0aW9ucycsXG4gICAgICB9LCBjaGlsZHJlbilcbiAgICB9LFxuICAgIGdlblNsb3RTZWxlY3Rpb24gKGl0ZW06IG9iamVjdCwgaW5kZXg6IG51bWJlcik6IFZOb2RlW10gfCB1bmRlZmluZWQge1xuICAgICAgcmV0dXJuIHRoaXMuJHNjb3BlZFNsb3RzLnNlbGVjdGlvbiEoe1xuICAgICAgICBhdHRyczoge1xuICAgICAgICAgIGNsYXNzOiAndi1jaGlwLS1zZWxlY3QnLFxuICAgICAgICB9LFxuICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgIGl0ZW0sXG4gICAgICAgIGluZGV4LFxuICAgICAgICBzZWxlY3Q6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSBpbmRleFxuICAgICAgICB9LFxuICAgICAgICBzZWxlY3RlZDogaW5kZXggPT09IHRoaXMuc2VsZWN0ZWRJbmRleCxcbiAgICAgICAgZGlzYWJsZWQ6ICF0aGlzLmlzSW50ZXJhY3RpdmUsXG4gICAgICB9KVxuICAgIH0sXG4gICAgZ2V0TWVudUluZGV4ICgpIHtcbiAgICAgIHJldHVybiB0aGlzLiRyZWZzLm1lbnUgPyAodGhpcy4kcmVmcy5tZW51IGFzIHsgW2tleTogc3RyaW5nXTogYW55IH0pLmxpc3RJbmRleCA6IC0xXG4gICAgfSxcbiAgICBnZXREaXNhYmxlZCAoaXRlbTogb2JqZWN0KSB7XG4gICAgICByZXR1cm4gZ2V0UHJvcGVydHlGcm9tSXRlbShpdGVtLCB0aGlzLml0ZW1EaXNhYmxlZCwgZmFsc2UpXG4gICAgfSxcbiAgICBnZXRUZXh0IChpdGVtOiBvYmplY3QpIHtcbiAgICAgIHJldHVybiBnZXRQcm9wZXJ0eUZyb21JdGVtKGl0ZW0sIHRoaXMuaXRlbVRleHQsIGl0ZW0pXG4gICAgfSxcbiAgICBnZXRWYWx1ZSAoaXRlbTogb2JqZWN0KSB7XG4gICAgICByZXR1cm4gZ2V0UHJvcGVydHlGcm9tSXRlbShpdGVtLCB0aGlzLml0ZW1WYWx1ZSwgdGhpcy5nZXRUZXh0KGl0ZW0pKVxuICAgIH0sXG4gICAgb25CbHVyIChlPzogRXZlbnQpIHtcbiAgICAgIGUgJiYgdGhpcy4kZW1pdCgnYmx1cicsIGUpXG4gICAgfSxcbiAgICBvbkNoaXBJbnB1dCAoaXRlbTogb2JqZWN0KSB7XG4gICAgICBpZiAodGhpcy5tdWx0aXBsZSkgdGhpcy5zZWxlY3RJdGVtKGl0ZW0pXG4gICAgICBlbHNlIHRoaXMuc2V0VmFsdWUobnVsbClcbiAgICAgIC8vIElmIGFsbCBpdGVtcyBoYXZlIGJlZW4gZGVsZXRlZCxcbiAgICAgIC8vIG9wZW4gYHYtbWVudWBcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkSXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMuaXNNZW51QWN0aXZlID0gdHJ1ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5pc01lbnVBY3RpdmUgPSBmYWxzZVxuICAgICAgfVxuICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gLTFcbiAgICB9LFxuICAgIG9uQ2xpY2sgKGU6IE1vdXNlRXZlbnQpIHtcbiAgICAgIGlmICghdGhpcy5pc0ludGVyYWN0aXZlKSByZXR1cm5cblxuICAgICAgaWYgKCF0aGlzLmlzQXBwZW5kSW5uZXIoZS50YXJnZXQpKSB7XG4gICAgICAgIHRoaXMuaXNNZW51QWN0aXZlID0gdHJ1ZVxuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuaXNGb2N1c2VkKSB7XG4gICAgICAgIHRoaXMuaXNGb2N1c2VkID0gdHJ1ZVxuICAgICAgICB0aGlzLiRlbWl0KCdmb2N1cycpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuJGVtaXQoJ2NsaWNrJywgZSlcbiAgICB9LFxuICAgIG9uRXNjRG93biAoZTogRXZlbnQpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgaWYgKHRoaXMuaXNNZW51QWN0aXZlKSB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgdGhpcy5pc01lbnVBY3RpdmUgPSBmYWxzZVxuICAgICAgfVxuICAgIH0sXG4gICAgb25LZXlQcmVzcyAoZTogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgaWYgKFxuICAgICAgICB0aGlzLm11bHRpcGxlIHx8XG4gICAgICAgICF0aGlzLmlzSW50ZXJhY3RpdmUgfHxcbiAgICAgICAgdGhpcy5kaXNhYmxlTG9va3VwXG4gICAgICApIHJldHVyblxuXG4gICAgICBjb25zdCBLRVlCT0FSRF9MT09LVVBfVEhSRVNIT0xEID0gMTAwMCAvLyBtaWxsaXNlY29uZHNcbiAgICAgIGNvbnN0IG5vdyA9IHBlcmZvcm1hbmNlLm5vdygpXG4gICAgICBpZiAobm93IC0gdGhpcy5rZXlib2FyZExvb2t1cExhc3RUaW1lID4gS0VZQk9BUkRfTE9PS1VQX1RIUkVTSE9MRCkge1xuICAgICAgICB0aGlzLmtleWJvYXJkTG9va3VwUHJlZml4ID0gJydcbiAgICAgIH1cbiAgICAgIHRoaXMua2V5Ym9hcmRMb29rdXBQcmVmaXggKz0gZS5rZXkudG9Mb3dlckNhc2UoKVxuICAgICAgdGhpcy5rZXlib2FyZExvb2t1cExhc3RUaW1lID0gbm93XG5cbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5hbGxJdGVtcy5maW5kSW5kZXgoaXRlbSA9PiB7XG4gICAgICAgIGNvbnN0IHRleHQgPSAodGhpcy5nZXRUZXh0KGl0ZW0pIHx8ICcnKS50b1N0cmluZygpXG5cbiAgICAgICAgcmV0dXJuIHRleHQudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKHRoaXMua2V5Ym9hcmRMb29rdXBQcmVmaXgpXG4gICAgICB9KVxuICAgICAgY29uc3QgaXRlbSA9IHRoaXMuYWxsSXRlbXNbaW5kZXhdXG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgIHRoaXMubGFzdEl0ZW0gPSBNYXRoLm1heCh0aGlzLmxhc3RJdGVtLCBpbmRleCArIDUpXG4gICAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy5yZXR1cm5PYmplY3QgPyBpdGVtIDogdGhpcy5nZXRWYWx1ZShpdGVtKSlcbiAgICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4gdGhpcy4kcmVmcy5tZW51LmdldFRpbGVzKCkpXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zZXRNZW51SW5kZXgoaW5kZXgpKVxuICAgICAgfVxuICAgIH0sXG4gICAgb25LZXlEb3duIChlOiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICBpZiAodGhpcy5pc1JlYWRvbmx5ICYmIGUua2V5Q29kZSAhPT0ga2V5Q29kZXMudGFiKSByZXR1cm5cblxuICAgICAgY29uc3Qga2V5Q29kZSA9IGUua2V5Q29kZVxuICAgICAgY29uc3QgbWVudSA9IHRoaXMuJHJlZnMubWVudVxuXG4gICAgICAvLyBJZiBlbnRlciwgc3BhY2UsIG9wZW4gbWVudVxuICAgICAgaWYgKFtcbiAgICAgICAga2V5Q29kZXMuZW50ZXIsXG4gICAgICAgIGtleUNvZGVzLnNwYWNlLFxuICAgICAgXS5pbmNsdWRlcyhrZXlDb2RlKSkgdGhpcy5hY3RpdmF0ZU1lbnUoKVxuXG4gICAgICB0aGlzLiRlbWl0KCdrZXlkb3duJywgZSlcblxuICAgICAgaWYgKCFtZW51KSByZXR1cm5cblxuICAgICAgLy8gSWYgbWVudSBpcyBhY3RpdmUsIGFsbG93IGRlZmF1bHRcbiAgICAgIC8vIGxpc3RJbmRleCBjaGFuZ2UgZnJvbSBtZW51XG4gICAgICBpZiAodGhpcy5pc01lbnVBY3RpdmUgJiYga2V5Q29kZSAhPT0ga2V5Q29kZXMudGFiKSB7XG4gICAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgICBtZW51LmNoYW5nZUxpc3RJbmRleChlKVxuICAgICAgICAgIHRoaXMuJGVtaXQoJ3VwZGF0ZTpsaXN0LWluZGV4JywgbWVudS5saXN0SW5kZXgpXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIC8vIElmIG1lbnUgaXMgbm90IGFjdGl2ZSwgdXAgYW5kIGRvd24gY2FuIGRvXG4gICAgICAvLyBvbmUgb2YgMiB0aGluZ3MuIElmIG11bHRpcGxlLCBvcGVucyB0aGVcbiAgICAgIC8vIG1lbnUsIGlmIG5vdCwgd2lsbCBjeWNsZSB0aHJvdWdoIGFsbFxuICAgICAgLy8gYXZhaWxhYmxlIG9wdGlvbnNcbiAgICAgIGlmIChcbiAgICAgICAgIXRoaXMuaXNNZW51QWN0aXZlICYmXG4gICAgICAgIFtrZXlDb2Rlcy51cCwga2V5Q29kZXMuZG93bl0uaW5jbHVkZXMoa2V5Q29kZSlcbiAgICAgICkgcmV0dXJuIHRoaXMub25VcERvd24oZSlcblxuICAgICAgLy8gSWYgZXNjYXBlIGRlYWN0aXZhdGUgdGhlIG1lbnVcbiAgICAgIGlmIChrZXlDb2RlID09PSBrZXlDb2Rlcy5lc2MpIHJldHVybiB0aGlzLm9uRXNjRG93bihlKVxuXG4gICAgICAvLyBJZiB0YWIgLSBzZWxlY3QgaXRlbSBvciBjbG9zZSBtZW51XG4gICAgICBpZiAoa2V5Q29kZSA9PT0ga2V5Q29kZXMudGFiKSByZXR1cm4gdGhpcy5vblRhYkRvd24oZSlcblxuICAgICAgLy8gSWYgc3BhY2UgcHJldmVudERlZmF1bHRcbiAgICAgIGlmIChrZXlDb2RlID09PSBrZXlDb2Rlcy5zcGFjZSkgcmV0dXJuIHRoaXMub25TcGFjZURvd24oZSlcbiAgICB9LFxuICAgIG9uTWVudUFjdGl2ZUNoYW5nZSAodmFsOiBib29sZWFuKSB7XG4gICAgICAvLyBJZiBtZW51IGlzIGNsb3NpbmcgYW5kIG11bGl0cGxlXG4gICAgICAvLyBvciBtZW51SW5kZXggaXMgYWxyZWFkeSBzZXRcbiAgICAgIC8vIHNraXAgbWVudSBpbmRleCByZWNhbGN1bGF0aW9uXG4gICAgICBpZiAoXG4gICAgICAgICh0aGlzLm11bHRpcGxlICYmICF2YWwpIHx8XG4gICAgICAgIHRoaXMuZ2V0TWVudUluZGV4KCkgPiAtMVxuICAgICAgKSByZXR1cm5cblxuICAgICAgY29uc3QgbWVudSA9IHRoaXMuJHJlZnMubWVudVxuXG4gICAgICBpZiAoIW1lbnUgfHwgIXRoaXMuaXNEaXJ0eSkgcmV0dXJuXG5cbiAgICAgIC8vIFdoZW4gbWVudSBvcGVucywgc2V0IGluZGV4IG9mIGZpcnN0IGFjdGl2ZSBpdGVtXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1lbnUudGlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKG1lbnUudGlsZXNbaV0uZ2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJykgPT09ICd0cnVlJykge1xuICAgICAgICAgIHRoaXMuc2V0TWVudUluZGV4KGkpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgb25Nb3VzZVVwIChlOiBNb3VzZUV2ZW50KSB7XG4gICAgICBpZiAoXG4gICAgICAgIHRoaXMuaGFzTW91c2VEb3duICYmXG4gICAgICAgIGUud2hpY2ggIT09IDMgJiZcbiAgICAgICAgdGhpcy5pc0ludGVyYWN0aXZlXG4gICAgICApIHtcbiAgICAgICAgLy8gSWYgYXBwZW5kIGlubmVyIGlzIHByZXNlbnRcbiAgICAgICAgLy8gYW5kIHRoZSB0YXJnZXQgaXMgaXRzZWxmXG4gICAgICAgIC8vIG9yIGluc2lkZSwgdG9nZ2xlIG1lbnVcbiAgICAgICAgaWYgKHRoaXMuaXNBcHBlbmRJbm5lcihlLnRhcmdldCkpIHtcbiAgICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiAodGhpcy5pc01lbnVBY3RpdmUgPSAhdGhpcy5pc01lbnVBY3RpdmUpKVxuICAgICAgICAvLyBJZiB1c2VyIGlzIGNsaWNraW5nIGluIHRoZSBjb250YWluZXJcbiAgICAgICAgLy8gYW5kIGZpZWxkIGlzIGVuY2xvc2VkLCBhY3RpdmF0ZSBpdFxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNFbmNsb3NlZCkge1xuICAgICAgICAgIHRoaXMuaXNNZW51QWN0aXZlID0gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIFZUZXh0RmllbGQub3B0aW9ucy5tZXRob2RzLm9uTW91c2VVcC5jYWxsKHRoaXMsIGUpXG4gICAgfSxcbiAgICBvblNjcm9sbCAoKSB7XG4gICAgICBpZiAoIXRoaXMuaXNNZW51QWN0aXZlKSB7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiAodGhpcy5nZXRDb250ZW50KCkuc2Nyb2xsVG9wID0gMCkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5sYXN0SXRlbSA+IHRoaXMuY29tcHV0ZWRJdGVtcy5sZW5ndGgpIHJldHVyblxuXG4gICAgICAgIGNvbnN0IHNob3dNb3JlSXRlbXMgPSAoXG4gICAgICAgICAgdGhpcy5nZXRDb250ZW50KCkuc2Nyb2xsSGVpZ2h0IC1cbiAgICAgICAgICAodGhpcy5nZXRDb250ZW50KCkuc2Nyb2xsVG9wICtcbiAgICAgICAgICB0aGlzLmdldENvbnRlbnQoKS5jbGllbnRIZWlnaHQpXG4gICAgICAgICkgPCAyMDBcblxuICAgICAgICBpZiAoc2hvd01vcmVJdGVtcykge1xuICAgICAgICAgIHRoaXMubGFzdEl0ZW0gKz0gMjBcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgb25TcGFjZURvd24gKGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIH0sXG4gICAgb25UYWJEb3duIChlOiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICBjb25zdCBtZW51ID0gdGhpcy4kcmVmcy5tZW51XG5cbiAgICAgIGlmICghbWVudSkgcmV0dXJuXG5cbiAgICAgIGNvbnN0IGFjdGl2ZVRpbGUgPSBtZW51LmFjdGl2ZVRpbGVcblxuICAgICAgLy8gQW4gaXRlbSB0aGF0IGlzIHNlbGVjdGVkIGJ5XG4gICAgICAvLyBtZW51LWluZGV4IHNob3VsZCB0b2dnbGVkXG4gICAgICBpZiAoXG4gICAgICAgICF0aGlzLm11bHRpcGxlICYmXG4gICAgICAgIGFjdGl2ZVRpbGUgJiZcbiAgICAgICAgdGhpcy5pc01lbnVBY3RpdmVcbiAgICAgICkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuXG4gICAgICAgIGFjdGl2ZVRpbGUuY2xpY2soKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSWYgd2UgbWFrZSBpdCBoZXJlLFxuICAgICAgICAvLyB0aGUgdXNlciBoYXMgbm8gc2VsZWN0ZWQgaW5kZXhlc1xuICAgICAgICAvLyBhbmQgaXMgcHJvYmFibHkgdGFiYmluZyBvdXRcbiAgICAgICAgdGhpcy5ibHVyKGUpXG4gICAgICB9XG4gICAgfSxcbiAgICBvblVwRG93biAoZTogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgY29uc3QgbWVudSA9IHRoaXMuJHJlZnMubWVudVxuXG4gICAgICBpZiAoIW1lbnUpIHJldHVyblxuXG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcblxuICAgICAgLy8gTXVsdGlwbGUgc2VsZWN0cyBkbyBub3QgY3ljbGUgdGhlaXIgdmFsdWVcbiAgICAgIC8vIHdoZW4gcHJlc3NpbmcgdXAgb3IgZG93biwgaW5zdGVhZCBhY3RpdmF0ZVxuICAgICAgLy8gdGhlIG1lbnVcbiAgICAgIGlmICh0aGlzLm11bHRpcGxlKSByZXR1cm4gdGhpcy5hY3RpdmF0ZU1lbnUoKVxuXG4gICAgICBjb25zdCBrZXlDb2RlID0gZS5rZXlDb2RlXG5cbiAgICAgIC8vIEN5Y2xlIHRocm91Z2ggYXZhaWxhYmxlIHZhbHVlcyB0byBhY2hpZXZlXG4gICAgICAvLyBzZWxlY3QgbmF0aXZlIGJlaGF2aW9yXG4gICAgICBtZW51LmlzQm9vdGVkID0gdHJ1ZVxuXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgbWVudS5nZXRUaWxlcygpXG4gICAgICAgIGtleUNvZGVzLnVwID09PSBrZXlDb2RlID8gbWVudS5wcmV2VGlsZSgpIDogbWVudS5uZXh0VGlsZSgpXG4gICAgICAgIG1lbnUuYWN0aXZlVGlsZSAmJiBtZW51LmFjdGl2ZVRpbGUuY2xpY2soKVxuICAgICAgfSlcbiAgICB9LFxuICAgIHNlbGVjdEl0ZW0gKGl0ZW06IG9iamVjdCkge1xuICAgICAgaWYgKCF0aGlzLm11bHRpcGxlKSB7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy5yZXR1cm5PYmplY3QgPyBpdGVtIDogdGhpcy5nZXRWYWx1ZShpdGVtKSlcbiAgICAgICAgdGhpcy5pc01lbnVBY3RpdmUgPSBmYWxzZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgaW50ZXJuYWxWYWx1ZSA9ICh0aGlzLmludGVybmFsVmFsdWUgfHwgW10pLnNsaWNlKClcbiAgICAgICAgY29uc3QgaSA9IHRoaXMuZmluZEV4aXN0aW5nSW5kZXgoaXRlbSlcblxuICAgICAgICBpICE9PSAtMSA/IGludGVybmFsVmFsdWUuc3BsaWNlKGksIDEpIDogaW50ZXJuYWxWYWx1ZS5wdXNoKGl0ZW0pXG4gICAgICAgIHRoaXMuc2V0VmFsdWUoaW50ZXJuYWxWYWx1ZS5tYXAoKGk6IG9iamVjdCkgPT4ge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJldHVybk9iamVjdCA/IGkgOiB0aGlzLmdldFZhbHVlKGkpXG4gICAgICAgIH0pKVxuXG4gICAgICAgIC8vIFdoZW4gc2VsZWN0aW5nIG11bHRpcGxlXG4gICAgICAgIC8vIGFkanVzdCBtZW51IGFmdGVyIGVhY2hcbiAgICAgICAgLy8gc2VsZWN0aW9uXG4gICAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgICB0aGlzLiRyZWZzLm1lbnUgJiZcbiAgICAgICAgICAgICh0aGlzLiRyZWZzLm1lbnUgYXMgeyBba2V5OiBzdHJpbmddOiBhbnkgfSkudXBkYXRlRGltZW5zaW9ucygpXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gV2Ugb25seSBuZWVkIHRvIHJlc2V0IGxpc3QgaW5kZXggZm9yIG11bHRpcGxlXG4gICAgICAgIC8vIHRvIGtlZXAgaGlnaGxpZ2h0IHdoZW4gYW4gaXRlbSBpcyB0b2dnbGVkXG4gICAgICAgIC8vIG9uIGFuZCBvZmZcbiAgICAgICAgaWYgKCF0aGlzLm11bHRpcGxlKSByZXR1cm5cblxuICAgICAgICBjb25zdCBsaXN0SW5kZXggPSB0aGlzLmdldE1lbnVJbmRleCgpXG5cbiAgICAgICAgdGhpcy5zZXRNZW51SW5kZXgoLTEpXG5cbiAgICAgICAgLy8gVGhlcmUgaXMgbm8gaXRlbSB0byByZS1oaWdobGlnaHRcbiAgICAgICAgLy8gd2hlbiBzZWxlY3Rpb25zIGFyZSBoaWRkZW5cbiAgICAgICAgaWYgKHRoaXMuaGlkZVNlbGVjdGVkKSByZXR1cm5cblxuICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB0aGlzLnNldE1lbnVJbmRleChsaXN0SW5kZXgpKVxuICAgICAgfVxuICAgIH0sXG4gICAgc2V0TWVudUluZGV4IChpbmRleDogbnVtYmVyKSB7XG4gICAgICB0aGlzLiRyZWZzLm1lbnUgJiYgKCh0aGlzLiRyZWZzLm1lbnUgYXMgeyBba2V5OiBzdHJpbmddOiBhbnkgfSkubGlzdEluZGV4ID0gaW5kZXgpXG4gICAgfSxcbiAgICBzZXRTZWxlY3RlZEl0ZW1zICgpIHtcbiAgICAgIGNvbnN0IHNlbGVjdGVkSXRlbXMgPSBbXVxuICAgICAgY29uc3QgdmFsdWVzID0gIXRoaXMubXVsdGlwbGUgfHwgIUFycmF5LmlzQXJyYXkodGhpcy5pbnRlcm5hbFZhbHVlKVxuICAgICAgICA/IFt0aGlzLmludGVybmFsVmFsdWVdXG4gICAgICAgIDogdGhpcy5pbnRlcm5hbFZhbHVlXG5cbiAgICAgIGZvciAoY29uc3QgdmFsdWUgb2YgdmFsdWVzKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5hbGxJdGVtcy5maW5kSW5kZXgodiA9PiB0aGlzLnZhbHVlQ29tcGFyYXRvcihcbiAgICAgICAgICB0aGlzLmdldFZhbHVlKHYpLFxuICAgICAgICAgIHRoaXMuZ2V0VmFsdWUodmFsdWUpXG4gICAgICAgICkpXG5cbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICBzZWxlY3RlZEl0ZW1zLnB1c2godGhpcy5hbGxJdGVtc1tpbmRleF0pXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gc2VsZWN0ZWRJdGVtc1xuICAgIH0sXG4gICAgc2V0VmFsdWUgKHZhbHVlOiBhbnkpIHtcbiAgICAgIGNvbnN0IG9sZFZhbHVlID0gdGhpcy5pbnRlcm5hbFZhbHVlXG4gICAgICB0aGlzLmludGVybmFsVmFsdWUgPSB2YWx1ZVxuICAgICAgdmFsdWUgIT09IG9sZFZhbHVlICYmIHRoaXMuJGVtaXQoJ2NoYW5nZScsIHZhbHVlKVxuICAgIH0sXG4gICAgaXNBcHBlbmRJbm5lciAodGFyZ2V0OiBhbnkpIHtcbiAgICAgIC8vIHJldHVybiB0cnVlIGlmIGFwcGVuZCBpbm5lciBpcyBwcmVzZW50XG4gICAgICAvLyBhbmQgdGhlIHRhcmdldCBpcyBpdHNlbGYgb3IgaW5zaWRlXG4gICAgICBjb25zdCBhcHBlbmRJbm5lciA9IHRoaXMuJHJlZnNbJ2FwcGVuZC1pbm5lciddXG5cbiAgICAgIHJldHVybiBhcHBlbmRJbm5lciAmJiAoYXBwZW5kSW5uZXIgPT09IHRhcmdldCB8fCBhcHBlbmRJbm5lci5jb250YWlucyh0YXJnZXQpKVxuICAgIH0sXG4gIH0sXG59KVxuIl19