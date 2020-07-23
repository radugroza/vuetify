// Components
import { VExpandTransition } from '../transitions';
import { VIcon } from '../VIcon';
// Mixins
import { inject as RegistrableInject } from '../../mixins/registrable';
import Colorable from '../../mixins/colorable';
// Utils
import mixins from '../../util/mixins';
import { getObjectValueByPath, createRange } from '../../util/helpers';
const baseMixins = mixins(Colorable, RegistrableInject('treeview'));
export const VTreeviewNodeProps = {
    activatable: Boolean,
    activeClass: {
        type: String,
        default: 'v-treeview-node--active',
    },
    color: {
        type: String,
        default: 'primary',
    },
    expandIcon: {
        type: String,
        default: '$subgroup',
    },
    indeterminateIcon: {
        type: String,
        default: '$checkboxIndeterminate',
    },
    itemChildren: {
        type: String,
        default: 'children',
    },
    itemDisabled: {
        type: String,
        default: 'disabled',
    },
    itemKey: {
        type: String,
        default: 'id',
    },
    itemText: {
        type: String,
        default: 'name',
    },
    loadChildren: Function,
    loadingIcon: {
        type: String,
        default: '$loading',
    },
    offIcon: {
        type: String,
        default: '$checkboxOff',
    },
    onIcon: {
        type: String,
        default: '$checkboxOn',
    },
    openOnClick: Boolean,
    rounded: Boolean,
    selectable: Boolean,
    selectedColor: {
        type: String,
        default: 'accent',
    },
    shaped: Boolean,
    transition: Boolean,
    selectionType: {
        type: String,
        default: 'leaf',
        validator: (v) => ['leaf', 'independent'].includes(v),
    },
};
/* @vue/component */
const VTreeviewNode = baseMixins.extend().extend({
    name: 'v-treeview-node',
    inject: {
        treeview: {
            default: null,
        },
    },
    props: {
        level: Number,
        item: {
            type: Object,
            default: () => null,
        },
        parentIsDisabled: Boolean,
        ...VTreeviewNodeProps,
    },
    data: () => ({
        hasLoaded: false,
        isActive: false,
        isIndeterminate: false,
        isLoading: false,
        isOpen: false,
        isSelected: false,
    }),
    computed: {
        disabled() {
            return (getObjectValueByPath(this.item, this.itemDisabled) ||
                (this.parentIsDisabled && this.selectionType === 'leaf'));
        },
        key() {
            return getObjectValueByPath(this.item, this.itemKey);
        },
        children() {
            return getObjectValueByPath(this.item, this.itemChildren);
        },
        text() {
            return getObjectValueByPath(this.item, this.itemText);
        },
        scopedProps() {
            return {
                item: this.item,
                leaf: !this.children,
                selected: this.isSelected,
                indeterminate: this.isIndeterminate,
                active: this.isActive,
                open: this.isOpen,
            };
        },
        computedIcon() {
            if (this.isIndeterminate)
                return this.indeterminateIcon;
            else if (this.isSelected)
                return this.onIcon;
            else
                return this.offIcon;
        },
        hasChildren() {
            return !!this.children && (!!this.children.length || !!this.loadChildren);
        },
    },
    created() {
        this.treeview.register(this);
    },
    beforeDestroy() {
        this.treeview.unregister(this);
    },
    methods: {
        checkChildren() {
            return new Promise(resolve => {
                // TODO: Potential issue with always trying
                // to load children if response is empty?
                if (!this.children || this.children.length || !this.loadChildren || this.hasLoaded)
                    return resolve();
                this.isLoading = true;
                resolve(this.loadChildren(this.item));
            }).then(() => {
                this.isLoading = false;
                this.hasLoaded = true;
            });
        },
        open() {
            this.isOpen = !this.isOpen;
            this.treeview.updateOpen(this.key, this.isOpen);
            this.treeview.emitOpen();
        },
        genLabel() {
            const children = [];
            if (this.$scopedSlots.label)
                children.push(this.$scopedSlots.label(this.scopedProps));
            else
                children.push(this.text);
            return this.$createElement('div', {
                slot: 'label',
                staticClass: 'v-treeview-node__label',
            }, children);
        },
        genPrependSlot() {
            if (!this.$scopedSlots.prepend)
                return null;
            return this.$createElement('div', {
                staticClass: 'v-treeview-node__prepend',
            }, this.$scopedSlots.prepend(this.scopedProps));
        },
        genAppendSlot() {
            if (!this.$scopedSlots.append)
                return null;
            return this.$createElement('div', {
                staticClass: 'v-treeview-node__append',
            }, this.$scopedSlots.append(this.scopedProps));
        },
        genContent() {
            const children = [
                this.genPrependSlot(),
                this.genLabel(),
                this.genAppendSlot(),
            ];
            return this.$createElement('div', {
                staticClass: 'v-treeview-node__content',
            }, children);
        },
        genToggle() {
            return this.$createElement(VIcon, {
                staticClass: 'v-treeview-node__toggle',
                class: {
                    'v-treeview-node__toggle--open': this.isOpen,
                    'v-treeview-node__toggle--loading': this.isLoading,
                },
                slot: 'prepend',
                on: {
                    click: (e) => {
                        e.stopPropagation();
                        if (this.isLoading)
                            return;
                        this.checkChildren().then(() => this.open());
                    },
                },
            }, [this.isLoading ? this.loadingIcon : this.expandIcon]);
        },
        genCheckbox() {
            return this.$createElement(VIcon, {
                staticClass: 'v-treeview-node__checkbox',
                props: {
                    color: this.isSelected || this.isIndeterminate ? this.selectedColor : undefined,
                    disabled: this.disabled,
                },
                on: {
                    click: (e) => {
                        e.stopPropagation();
                        if (this.isLoading)
                            return;
                        this.checkChildren().then(() => {
                            // We nextTick here so that items watch in VTreeview has a chance to run first
                            this.$nextTick(() => {
                                this.isSelected = !this.isSelected;
                                this.isIndeterminate = false;
                                this.treeview.updateSelected(this.key, this.isSelected);
                                this.treeview.emitSelected();
                            });
                        });
                    },
                },
            }, [this.computedIcon]);
        },
        genLevel(level) {
            return createRange(level).map(() => this.$createElement('div', {
                staticClass: 'v-treeview-node__level',
            }));
        },
        genNode() {
            const children = [this.genContent()];
            if (this.selectable)
                children.unshift(this.genCheckbox());
            if (this.hasChildren) {
                children.unshift(this.genToggle());
            }
            else {
                children.unshift(...this.genLevel(1));
            }
            children.unshift(...this.genLevel(this.level));
            return this.$createElement('div', this.setTextColor(this.isActive && this.color, {
                staticClass: 'v-treeview-node__root',
                class: {
                    [this.activeClass]: this.isActive,
                },
                on: {
                    click: () => {
                        if (this.openOnClick && this.hasChildren) {
                            this.checkChildren().then(this.open);
                        }
                        else if (this.activatable && !this.disabled) {
                            this.isActive = !this.isActive;
                            this.treeview.updateActive(this.key, this.isActive);
                            this.treeview.emitActive();
                        }
                    },
                },
            }), children);
        },
        genChild(item, parentIsDisabled) {
            return this.$createElement(VTreeviewNode, {
                key: getObjectValueByPath(item, this.itemKey),
                props: {
                    activatable: this.activatable,
                    activeClass: this.activeClass,
                    item,
                    selectable: this.selectable,
                    selectedColor: this.selectedColor,
                    color: this.color,
                    expandIcon: this.expandIcon,
                    indeterminateIcon: this.indeterminateIcon,
                    offIcon: this.offIcon,
                    onIcon: this.onIcon,
                    loadingIcon: this.loadingIcon,
                    itemKey: this.itemKey,
                    itemText: this.itemText,
                    itemDisabled: this.itemDisabled,
                    itemChildren: this.itemChildren,
                    loadChildren: this.loadChildren,
                    transition: this.transition,
                    openOnClick: this.openOnClick,
                    rounded: this.rounded,
                    shaped: this.shaped,
                    level: this.level + 1,
                    selectionType: this.selectionType,
                    parentIsDisabled,
                },
                scopedSlots: this.$scopedSlots,
            });
        },
        genChildrenWrapper() {
            if (!this.isOpen || !this.children)
                return null;
            const children = [this.children.map(c => this.genChild(c, this.disabled))];
            return this.$createElement('div', {
                staticClass: 'v-treeview-node__children',
            }, children);
        },
        genTransition() {
            return this.$createElement(VExpandTransition, [this.genChildrenWrapper()]);
        },
    },
    render(h) {
        const children = [this.genNode()];
        if (this.transition)
            children.push(this.genTransition());
        else
            children.push(this.genChildrenWrapper());
        return h('div', {
            staticClass: 'v-treeview-node',
            class: {
                'v-treeview-node--leaf': !this.hasChildren,
                'v-treeview-node--click': this.openOnClick,
                'v-treeview-node--disabled': this.disabled,
                'v-treeview-node--rounded': this.rounded,
                'v-treeview-node--shaped': this.shaped,
                'v-treeview-node--selected': this.isSelected,
                'v-treeview-node--excluded': this.treeview.isExcluded(this.key),
            },
            attrs: {
                'aria-expanded': String(this.isOpen),
            },
        }, children);
    },
});
export default VTreeviewNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlRyZWV2aWV3Tm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZUcmVldmlldy9WVHJlZXZpZXdOb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGFBQWE7QUFDYixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQTtBQUNsRCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sVUFBVSxDQUFBO0FBR2hDLFNBQVM7QUFDVCxPQUFPLEVBQUUsTUFBTSxJQUFJLGlCQUFpQixFQUFFLE1BQU0sMEJBQTBCLENBQUE7QUFDdEUsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFFOUMsUUFBUTtBQUNSLE9BQU8sTUFBc0IsTUFBTSxtQkFBbUIsQ0FBQTtBQUN0RCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsV0FBVyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFPdEUsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUN2QixTQUFTLEVBQ1QsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQzlCLENBQUE7QUFNRCxNQUFNLENBQUMsTUFBTSxrQkFBa0IsR0FBRztJQUNoQyxXQUFXLEVBQUUsT0FBTztJQUNwQixXQUFXLEVBQUU7UUFDWCxJQUFJLEVBQUUsTUFBTTtRQUNaLE9BQU8sRUFBRSx5QkFBeUI7S0FDbkM7SUFDRCxLQUFLLEVBQUU7UUFDTCxJQUFJLEVBQUUsTUFBTTtRQUNaLE9BQU8sRUFBRSxTQUFTO0tBQ25CO0lBQ0QsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFLE1BQU07UUFDWixPQUFPLEVBQUUsV0FBVztLQUNyQjtJQUNELGlCQUFpQixFQUFFO1FBQ2pCLElBQUksRUFBRSxNQUFNO1FBQ1osT0FBTyxFQUFFLHdCQUF3QjtLQUNsQztJQUNELFlBQVksRUFBRTtRQUNaLElBQUksRUFBRSxNQUFNO1FBQ1osT0FBTyxFQUFFLFVBQVU7S0FDcEI7SUFDRCxZQUFZLEVBQUU7UUFDWixJQUFJ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TyxDQUFDLENBQUMsS0FBSyxFQUFFO1lBQ2QsV0FBVyxFQUFFLGlCQUFpQjtZQUM5QixLQUFLLEVBQUU7Z0JBQ0wsdUJBQXVCLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVztnQkFDMUMsd0JBQXdCLEVBQUUsSUFBSSxDQUFDLFdBQVc7Z0JBQzFDLDJCQUEyQixFQUFFLElBQUksQ0FBQyxRQUFRO2dCQUMxQywwQkFBMEIsRUFBRSxJQUFJLENBQUMsT0FBTztnQkFDeEMseUJBQXlCLEVBQUUsSUFBSSxDQUFDLE1BQU07Z0JBQ3RDLDJCQUEyQixFQUFFLElBQUksQ0FBQyxVQUFVO2dCQUM1QywyQkFBMkIsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2FBQ2hFO1lBQ0QsS0FBSyxFQUFFO2dCQUNMLGVBQWUsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzthQUNyQztTQUNGLEVBQUUsUUFBUSxDQUFDLENBQUE7SUFDZCxDQUFDO0NBQ0YsQ0FBQyxDQUFBO0FBRUYsZUFBZSxhQUFhLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb21wb25lbnRzXG5pbXBvcnQgeyBWRXhwYW5kVHJhbnNpdGlvbiB9IGZyb20gJy4uL3RyYW5zaXRpb25zJ1xuaW1wb3J0IHsgVkljb24gfSBmcm9tICcuLi9WSWNvbidcbmltcG9ydCBWVHJlZXZpZXcgZnJvbSAnLi9WVHJlZXZpZXcnXG5cbi8vIE1peGluc1xuaW1wb3J0IHsgaW5qZWN0IGFzIFJlZ2lzdHJhYmxlSW5qZWN0IH0gZnJvbSAnLi4vLi4vbWl4aW5zL3JlZ2lzdHJhYmxlJ1xuaW1wb3J0IENvbG9yYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvY29sb3JhYmxlJ1xuXG4vLyBVdGlsc1xuaW1wb3J0IG1peGlucywgeyBFeHRyYWN0VnVlIH0gZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5pbXBvcnQgeyBnZXRPYmplY3RWYWx1ZUJ5UGF0aCwgY3JlYXRlUmFuZ2UgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBWTm9kZSwgUHJvcFR5cGUgfSBmcm9tICd2dWUnXG5cbnR5cGUgVlRyZWVWaWV3SW5zdGFuY2UgPSBJbnN0YW5jZVR5cGU8dHlwZW9mIFZUcmVldmlldz5cblxuY29uc3QgYmFzZU1peGlucyA9IG1peGlucyhcbiAgQ29sb3JhYmxlLFxuICBSZWdpc3RyYWJsZUluamVjdCgndHJlZXZpZXcnKVxuKVxuXG5pbnRlcmZhY2Ugb3B0aW9ucyBleHRlbmRzIEV4dHJhY3RWdWU8dHlwZW9mIGJhc2VNaXhpbnM+IHtcbiAgdHJlZXZpZXc6IFZUcmVlVmlld0luc3RhbmNlXG59XG5cbmV4cG9ydCBjb25zdCBWVHJlZXZpZXdOb2RlUHJvcHMgPSB7XG4gIGFjdGl2YXRhYmxlOiBCb29sZWFuLFxuICBhY3RpdmVDbGFzczoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBkZWZhdWx0OiAndi10cmVldmlldy1ub2RlLS1hY3RpdmUnLFxuICB9LFxuICBjb2xvcjoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBkZWZhdWx0OiAncHJpbWFyeScsXG4gIH0sXG4gIGV4cGFuZEljb246IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgZGVmYXVsdDogJyRzdWJncm91cCcsXG4gIH0sXG4gIGluZGV0ZXJtaW5hdGVJY29uOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGRlZmF1bHQ6ICckY2hlY2tib3hJbmRldGVybWluYXRlJyxcbiAgfSxcbiAgaXRlbUNoaWxkcmVuOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGRlZmF1bHQ6ICdjaGlsZHJlbicsXG4gIH0sXG4gIGl0ZW1EaXNhYmxlZDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBkZWZhdWx0OiAnZGlzYWJsZWQnLFxuICB9LFxuICBpdGVtS2V5OiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGRlZmF1bHQ6ICdpZCcsXG4gIH0sXG4gIGl0ZW1UZXh0OiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGRlZmF1bHQ6ICduYW1lJyxcbiAgfSxcbiAgbG9hZENoaWxkcmVuOiBGdW5jdGlvbiBhcyBQcm9wVHlwZTwoaXRlbTogYW55KSA9PiBQcm9taXNlPHZvaWQ+PixcbiAgbG9hZGluZ0ljb246IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgZGVmYXVsdDogJyRsb2FkaW5nJyxcbiAgfSxcbiAgb2ZmSWNvbjoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBkZWZhdWx0OiAnJGNoZWNrYm94T2ZmJyxcbiAgfSxcbiAgb25JY29uOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGRlZmF1bHQ6ICckY2hlY2tib3hPbicsXG4gIH0sXG4gIG9wZW5PbkNsaWNrOiBCb29sZWFuLFxuICByb3VuZGVkOiBCb29sZWFuLFxuICBzZWxlY3RhYmxlOiBCb29sZWFuLFxuICBzZWxlY3RlZENvbG9yOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGRlZmF1bHQ6ICdhY2NlbnQnLFxuICB9LFxuICBzaGFwZWQ6IEJvb2xlYW4sXG4gIHRyYW5zaXRpb246IEJvb2xlYW4sXG4gIHNlbGVjdGlvblR5cGU6IHtcbiAgICB0eXBlOiBTdHJpbmcgYXMgUHJvcFR5cGU8J2xlYWYnIHwgJ2luZGVwZW5kZW50Jz4sXG4gICAgZGVmYXVsdDogJ2xlYWYnLFxuICAgIHZhbGlkYXRvcjogKHY6IHN0cmluZykgPT4gWydsZWFmJywgJ2luZGVwZW5kZW50J10uaW5jbHVkZXModiksXG4gIH0sXG59XG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5jb25zdCBWVHJlZXZpZXdOb2RlID0gYmFzZU1peGlucy5leHRlbmQ8b3B0aW9ucz4oKS5leHRlbmQoe1xuICBuYW1lOiAndi10cmVldmlldy1ub2RlJyxcblxuICBpbmplY3Q6IHtcbiAgICB0cmVldmlldzoge1xuICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICB9LFxuICB9LFxuXG4gIHByb3BzOiB7XG4gICAgbGV2ZWw6IE51bWJlcixcbiAgICBpdGVtOiB7XG4gICAgICB0eXBlOiBPYmplY3QsXG4gICAgICBkZWZhdWx0OiAoKSA9PiBudWxsLFxuICAgIH0sXG4gICAgcGFyZW50SXNEaXNhYmxlZDogQm9vbGVhbixcbiAgICAuLi5WVHJlZXZpZXdOb2RlUHJvcHMsXG4gIH0sXG5cbiAgZGF0YTogKCkgPT4gKHtcbiAgICBoYXNMb2FkZWQ6IGZhbHNlLFxuICAgIGlzQWN0aXZlOiBmYWxzZSwgLy8gTm9kZSBpcyBzZWxlY3RlZCAocm93KVxuICAgIGlzSW5kZXRlcm1pbmF0ZTogZmFsc2UsIC8vIE5vZGUgaGFzIGF0IGxlYXN0IG9uZSBzZWxlY3RlZCBjaGlsZFxuICAgIGlzTG9hZGluZzogZmFsc2UsXG4gICAgaXNPcGVuOiBmYWxzZSwgLy8gTm9kZSBpcyBvcGVuL2V4cGFuZGVkXG4gICAgaXNTZWxlY3RlZDogZmFsc2UsIC8vIE5vZGUgaXMgc2VsZWN0ZWQgKGNoZWNrYm94KVxuICB9KSxcblxuICBjb21wdXRlZDoge1xuICAgIGRpc2FibGVkICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIGdldE9iamVjdFZhbHVlQnlQYXRoKHRoaXMuaXRlbSwgdGhpcy5pdGVtRGlzYWJsZWQpIHx8XG4gICAgICAgICh0aGlzLnBhcmVudElzRGlzYWJsZWQgJiYgdGhpcy5zZWxlY3Rpb25UeXBlID09PSAnbGVhZicpXG4gICAgICApXG4gICAgfSxcbiAgICBrZXkgKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gZ2V0T2JqZWN0VmFsdWVCeVBhdGgodGhpcy5pdGVtLCB0aGlzLml0ZW1LZXkpXG4gICAgfSxcbiAgICBjaGlsZHJlbiAoKTogYW55W10gfCBudWxsIHtcbiAgICAgIHJldHVybiBnZXRPYmplY3RWYWx1ZUJ5UGF0aCh0aGlzLml0ZW0sIHRoaXMuaXRlbUNoaWxkcmVuKVxuICAgIH0sXG4gICAgdGV4dCAoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiBnZXRPYmplY3RWYWx1ZUJ5UGF0aCh0aGlzLml0ZW0sIHRoaXMuaXRlbVRleHQpXG4gICAgfSxcbiAgICBzY29wZWRQcm9wcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGl0ZW06IHRoaXMuaXRlbSxcbiAgICAgICAgbGVhZjogIXRoaXMuY2hpbGRyZW4sXG4gICAgICAgIHNlbGVjdGVkOiB0aGlzLmlzU2VsZWN0ZWQsXG4gICAgICAgIGluZGV0ZXJtaW5hdGU6IHRoaXMuaXNJbmRldGVybWluYXRlLFxuICAgICAgICBhY3RpdmU6IHRoaXMuaXNBY3RpdmUsXG4gICAgICAgIG9wZW46IHRoaXMuaXNPcGVuLFxuICAgICAgfVxuICAgIH0sXG4gICAgY29tcHV0ZWRJY29uICgpOiBzdHJpbmcge1xuICAgICAgaWYgKHRoaXMuaXNJbmRldGVybWluYXRlKSByZXR1cm4gdGhpcy5pbmRldGVybWluYXRlSWNvblxuICAgICAgZWxzZSBpZiAodGhpcy5pc1NlbGVjdGVkKSByZXR1cm4gdGhpcy5vbkljb25cbiAgICAgIGVsc2UgcmV0dXJuIHRoaXMub2ZmSWNvblxuICAgIH0sXG4gICAgaGFzQ2hpbGRyZW4gKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuICEhdGhpcy5jaGlsZHJlbiAmJiAoISF0aGlzLmNoaWxkcmVuLmxlbmd0aCB8fCAhIXRoaXMubG9hZENoaWxkcmVuKVxuICAgIH0sXG4gIH0sXG5cbiAgY3JlYXRlZCAoKSB7XG4gICAgdGhpcy50cmVldmlldy5yZWdpc3Rlcih0aGlzKVxuICB9LFxuXG4gIGJlZm9yZURlc3Ryb3kgKCkge1xuICAgIHRoaXMudHJlZXZpZXcudW5yZWdpc3Rlcih0aGlzKVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBjaGVja0NoaWxkcmVuICgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPihyZXNvbHZlID0+IHtcbiAgICAgICAgLy8gVE9ETzogUG90ZW50aWFsIGlzc3VlIHdpdGggYWx3YXlzIHRyeWluZ1xuICAgICAgICAvLyB0byBsb2FkIGNoaWxkcmVuIGlmIHJlc3BvbnNlIGlzIGVtcHR5P1xuICAgICAgICBpZiAoIXRoaXMuY2hpbGRyZW4gfHwgdGhpcy5jaGlsZHJlbi5sZW5ndGggfHwgIXRoaXMubG9hZENoaWxkcmVuIHx8IHRoaXMuaGFzTG9hZGVkKSByZXR1cm4gcmVzb2x2ZSgpXG5cbiAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlXG4gICAgICAgIHJlc29sdmUodGhpcy5sb2FkQ2hpbGRyZW4odGhpcy5pdGVtKSlcbiAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlXG4gICAgICAgIHRoaXMuaGFzTG9hZGVkID0gdHJ1ZVxuICAgICAgfSlcbiAgICB9LFxuICAgIG9wZW4gKCkge1xuICAgICAgdGhpcy5pc09wZW4gPSAhdGhpcy5pc09wZW5cbiAgICAgIHRoaXMudHJlZXZpZXcudXBkYXRlT3Blbih0aGlzLmtleSwgdGhpcy5pc09wZW4pXG4gICAgICB0aGlzLnRyZWV2aWV3LmVtaXRPcGVuKClcbiAgICB9LFxuICAgIGdlbkxhYmVsICgpIHtcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gW11cblxuICAgICAgaWYgKHRoaXMuJHNjb3BlZFNsb3RzLmxhYmVsKSBjaGlsZHJlbi5wdXNoKHRoaXMuJHNjb3BlZFNsb3RzLmxhYmVsKHRoaXMuc2NvcGVkUHJvcHMpKVxuICAgICAgZWxzZSBjaGlsZHJlbi5wdXNoKHRoaXMudGV4dClcblxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgICAgc2xvdDogJ2xhYmVsJyxcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LXRyZWV2aWV3LW5vZGVfX2xhYmVsJyxcbiAgICAgIH0sIGNoaWxkcmVuKVxuICAgIH0sXG4gICAgZ2VuUHJlcGVuZFNsb3QgKCkge1xuICAgICAgaWYgKCF0aGlzLiRzY29wZWRTbG90cy5wcmVwZW5kKSByZXR1cm4gbnVsbFxuXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3YtdHJlZXZpZXctbm9kZV9fcHJlcGVuZCcsXG4gICAgICB9LCB0aGlzLiRzY29wZWRTbG90cy5wcmVwZW5kKHRoaXMuc2NvcGVkUHJvcHMpKVxuICAgIH0sXG4gICAgZ2VuQXBwZW5kU2xvdCAoKSB7XG4gICAgICBpZiAoIXRoaXMuJHNjb3BlZFNsb3RzLmFwcGVuZCkgcmV0dXJuIG51bGxcblxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LXRyZWV2aWV3LW5vZGVfX2FwcGVuZCcsXG4gICAgICB9LCB0aGlzLiRzY29wZWRTbG90cy5hcHBlbmQodGhpcy5zY29wZWRQcm9wcykpXG4gICAgfSxcbiAgICBnZW5Db250ZW50ICgpIHtcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gW1xuICAgICAgICB0aGlzLmdlblByZXBlbmRTbG90KCksXG4gICAgICAgIHRoaXMuZ2VuTGFiZWwoKSxcbiAgICAgICAgdGhpcy5nZW5BcHBlbmRTbG90KCksXG4gICAgICBdXG5cbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi10cmVldmlldy1ub2RlX19jb250ZW50JyxcbiAgICAgIH0sIGNoaWxkcmVuKVxuICAgIH0sXG4gICAgZ2VuVG9nZ2xlICgpIHtcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZJY29uLCB7XG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi10cmVldmlldy1ub2RlX190b2dnbGUnLFxuICAgICAgICBjbGFzczoge1xuICAgICAgICAgICd2LXRyZWV2aWV3LW5vZGVfX3RvZ2dsZS0tb3Blbic6IHRoaXMuaXNPcGVuLFxuICAgICAgICAgICd2LXRyZWV2aWV3LW5vZGVfX3RvZ2dsZS0tbG9hZGluZyc6IHRoaXMuaXNMb2FkaW5nLFxuICAgICAgICB9LFxuICAgICAgICBzbG90OiAncHJlcGVuZCcsXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgY2xpY2s6IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzTG9hZGluZykgcmV0dXJuXG5cbiAgICAgICAgICAgIHRoaXMuY2hlY2tDaGlsZHJlbigpLnRoZW4oKCkgPT4gdGhpcy5vcGVuKCkpXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sIFt0aGlzLmlzTG9hZGluZyA/IHRoaXMubG9hZGluZ0ljb24gOiB0aGlzLmV4cGFuZEljb25dKVxuICAgIH0sXG4gICAgZ2VuQ2hlY2tib3ggKCkge1xuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkljb24sIHtcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LXRyZWV2aWV3LW5vZGVfX2NoZWNrYm94JyxcbiAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICBjb2xvcjogdGhpcy5pc1NlbGVjdGVkIHx8IHRoaXMuaXNJbmRldGVybWluYXRlID8gdGhpcy5zZWxlY3RlZENvbG9yIDogdW5kZWZpbmVkLFxuICAgICAgICAgIGRpc2FibGVkOiB0aGlzLmRpc2FibGVkLFxuICAgICAgICB9LFxuICAgICAgICBvbjoge1xuICAgICAgICAgIGNsaWNrOiAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuXG4gICAgICAgICAgICBpZiAodGhpcy5pc0xvYWRpbmcpIHJldHVyblxuXG4gICAgICAgICAgICB0aGlzLmNoZWNrQ2hpbGRyZW4oKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgLy8gV2UgbmV4dFRpY2sgaGVyZSBzbyB0aGF0IGl0ZW1zIHdhdGNoIGluIFZUcmVldmlldyBoYXMgYSBjaGFuY2UgdG8gcnVuIGZpcnN0XG4gICAgICAgICAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmlzU2VsZWN0ZWQgPSAhdGhpcy5pc1NlbGVjdGVkXG4gICAgICAgICAgICAgICAgdGhpcy5pc0luZGV0ZXJtaW5hdGUgPSBmYWxzZVxuXG4gICAgICAgICAgICAgICAgdGhpcy50cmVldmlldy51cGRhdGVTZWxlY3RlZCh0aGlzLmtleSwgdGhpcy5pc1NlbGVjdGVkKVxuICAgICAgICAgICAgICAgIHRoaXMudHJlZXZpZXcuZW1pdFNlbGVjdGVkKClcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sIFt0aGlzLmNvbXB1dGVkSWNvbl0pXG4gICAgfSxcbiAgICBnZW5MZXZlbCAobGV2ZWw6IG51bWJlcikge1xuICAgICAgcmV0dXJuIGNyZWF0ZVJhbmdlKGxldmVsKS5tYXAoKCkgPT4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3YtdHJlZXZpZXctbm9kZV9fbGV2ZWwnLFxuICAgICAgfSkpXG4gICAgfSxcbiAgICBnZW5Ob2RlICgpOiBWTm9kZSB7XG4gICAgICBjb25zdCBjaGlsZHJlbiA9IFt0aGlzLmdlbkNvbnRlbnQoKV1cblxuICAgICAgaWYgKHRoaXMuc2VsZWN0YWJsZSkgY2hpbGRyZW4udW5zaGlmdCh0aGlzLmdlbkNoZWNrYm94KCkpXG5cbiAgICAgIGlmICh0aGlzLmhhc0NoaWxkcmVuKSB7XG4gICAgICAgIGNoaWxkcmVuLnVuc2hpZnQodGhpcy5nZW5Ub2dnbGUoKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNoaWxkcmVuLnVuc2hpZnQoLi4udGhpcy5nZW5MZXZlbCgxKSlcbiAgICAgIH1cblxuICAgICAgY2hpbGRyZW4udW5zaGlmdCguLi50aGlzLmdlbkxldmVsKHRoaXMubGV2ZWwpKVxuXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2JywgdGhpcy5zZXRUZXh0Q29sb3IodGhpcy5pc0FjdGl2ZSAmJiB0aGlzLmNvbG9yLCB7XG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi10cmVldmlldy1ub2RlX19yb290JyxcbiAgICAgICAgY2xhc3M6IHtcbiAgICAgICAgICBbdGhpcy5hY3RpdmVDbGFzc106IHRoaXMuaXNBY3RpdmUsXG4gICAgICAgIH0sXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgY2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLm9wZW5PbkNsaWNrICYmIHRoaXMuaGFzQ2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgdGhpcy5jaGVja0NoaWxkcmVuKCkudGhlbih0aGlzLm9wZW4pXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYWN0aXZhdGFibGUgJiYgIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgdGhpcy5pc0FjdGl2ZSA9ICF0aGlzLmlzQWN0aXZlXG4gICAgICAgICAgICAgIHRoaXMudHJlZXZpZXcudXBkYXRlQWN0aXZlKHRoaXMua2V5LCB0aGlzLmlzQWN0aXZlKVxuICAgICAgICAgICAgICB0aGlzLnRyZWV2aWV3LmVtaXRBY3RpdmUoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KSwgY2hpbGRyZW4pXG4gICAgfSxcbiAgICBnZW5DaGlsZCAoaXRlbTogYW55LCBwYXJlbnRJc0Rpc2FibGVkOiBib29sZWFuKTogVk5vZGUge1xuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVlRyZWV2aWV3Tm9kZSwge1xuICAgICAgICBrZXk6IGdldE9iamVjdFZhbHVlQnlQYXRoKGl0ZW0sIHRoaXMuaXRlbUtleSksXG4gICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgYWN0aXZhdGFibGU6IHRoaXMuYWN0aXZhdGFibGUsXG4gICAgICAgICAgYWN0aXZlQ2xhc3M6IHRoaXMuYWN0aXZlQ2xhc3MsXG4gICAgICAgICAgaXRlbSxcbiAgICAgICAgICBzZWxlY3RhYmxlOiB0aGlzLnNlbGVjdGFibGUsXG4gICAgICAgICAgc2VsZWN0ZWRDb2xvcjogdGhpcy5zZWxlY3RlZENvbG9yLFxuICAgICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yLFxuICAgICAgICAgIGV4cGFuZEljb246IHRoaXMuZXhwYW5kSWNvbixcbiAgICAgICAgICBpbmRldGVybWluYXRlSWNvbjogdGhpcy5pbmRldGVybWluYXRlSWNvbixcbiAgICAgICAgICBvZmZJY29uOiB0aGlzLm9mZkljb24sXG4gICAgICAgICAgb25JY29uOiB0aGlzLm9uSWNvbixcbiAgICAgICAgICBsb2FkaW5nSWNvbjogdGhpcy5sb2FkaW5nSWNvbixcbiAgICAgICAgICBpdGVtS2V5OiB0aGlzLml0ZW1LZXksXG4gICAgICAgICAgaXRlbVRleHQ6IHRoaXMuaXRlbVRleHQsXG4gICAgICAgICAgaXRlbURpc2FibGVkOiB0aGlzLml0ZW1EaXNhYmxlZCxcbiAgICAgICAgICBpdGVtQ2hpbGRyZW46IHRoaXMuaXRlbUNoaWxkcmVuLFxuICAgICAgICAgIGxvYWRDaGlsZHJlbjogdGhpcy5sb2FkQ2hpbGRyZW4sXG4gICAgICAgICAgdHJhbnNpdGlvbjogdGhpcy50cmFuc2l0aW9uLFxuICAgICAgICAgIG9wZW5PbkNsaWNrOiB0aGlzLm9wZW5PbkNsaWNrLFxuICAgICAgICAgIHJvdW5kZWQ6IHRoaXMucm91bmRlZCxcbiAgICAgICAgICBzaGFwZWQ6IHRoaXMuc2hhcGVkLFxuICAgICAgICAgIGxldmVsOiB0aGlzLmxldmVsICsgMSxcbiAgICAgICAgICBzZWxlY3Rpb25UeXBlOiB0aGlzLnNlbGVjdGlvblR5cGUsXG4gICAgICAgICAgcGFyZW50SXNEaXNhYmxlZCxcbiAgICAgICAgfSxcbiAgICAgICAgc2NvcGVkU2xvdHM6IHRoaXMuJHNjb3BlZFNsb3RzLFxuICAgICAgfSlcbiAgICB9LFxuICAgIGdlbkNoaWxkcmVuV3JhcHBlciAoKTogYW55IHtcbiAgICAgIGlmICghdGhpcy5pc09wZW4gfHwgIXRoaXMuY2hpbGRyZW4pIHJldHVybiBudWxsXG5cbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gW3RoaXMuY2hpbGRyZW4ubWFwKGMgPT4gdGhpcy5nZW5DaGlsZChjLCB0aGlzLmRpc2FibGVkKSldXG5cbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi10cmVldmlldy1ub2RlX19jaGlsZHJlbicsXG4gICAgICB9LCBjaGlsZHJlbilcbiAgICB9LFxuICAgIGdlblRyYW5zaXRpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkV4cGFuZFRyYW5zaXRpb24sIFt0aGlzLmdlbkNoaWxkcmVuV3JhcHBlcigpXSlcbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcbiAgICBjb25zdCBjaGlsZHJlbiA9IFt0aGlzLmdlbk5vZGUoKV1cblxuICAgIGlmICh0aGlzLnRyYW5zaXRpb24pIGNoaWxkcmVuLnB1c2godGhpcy5nZW5UcmFuc2l0aW9uKCkpXG4gICAgZWxzZSBjaGlsZHJlbi5wdXNoKHRoaXMuZ2VuQ2hpbGRyZW5XcmFwcGVyKCkpXG5cbiAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgc3RhdGljQ2xhc3M6ICd2LXRyZWV2aWV3LW5vZGUnLFxuICAgICAgY2xhc3M6IHtcbiAgICAgICAgJ3YtdHJlZXZpZXctbm9kZS0tbGVhZic6ICF0aGlzLmhhc0NoaWxkcmVuLFxuICAgICAgICAndi10cmVldmlldy1ub2RlLS1jbGljayc6IHRoaXMub3Blbk9uQ2xpY2ssXG4gICAgICAgICd2LXRyZWV2aWV3LW5vZGUtLWRpc2FibGVkJzogdGhpcy5kaXNhYmxlZCxcbiAgICAgICAgJ3YtdHJlZXZpZXctbm9kZS0tcm91bmRlZCc6IHRoaXMucm91bmRlZCxcbiAgICAgICAgJ3YtdHJlZXZpZXctbm9kZS0tc2hhcGVkJzogdGhpcy5zaGFwZWQsXG4gICAgICAgICd2LXRyZWV2aWV3LW5vZGUtLXNlbGVjdGVkJzogdGhpcy5pc1NlbGVjdGVkLFxuICAgICAgICAndi10cmVldmlldy1ub2RlLS1leGNsdWRlZCc6IHRoaXMudHJlZXZpZXcuaXNFeGNsdWRlZCh0aGlzLmtleSksXG4gICAgICB9LFxuICAgICAgYXR0cnM6IHtcbiAgICAgICAgJ2FyaWEtZXhwYW5kZWQnOiBTdHJpbmcodGhpcy5pc09wZW4pLFxuICAgICAgfSxcbiAgICB9LCBjaGlsZHJlbilcbiAgfSxcbn0pXG5cbmV4cG9ydCBkZWZhdWx0IFZUcmVldmlld05vZGVcbiJdfQ==