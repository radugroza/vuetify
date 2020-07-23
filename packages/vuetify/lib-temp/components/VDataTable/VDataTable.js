import './VDataTable.sass';
// Components
import { VData } from '../VData';
import { VDataFooter, VDataIterator } from '../VDataIterator';
import VBtn from '../VBtn';
import VDataTableHeader from './VDataTableHeader';
// import VVirtualTable from './VVirtualTable'
import VIcon from '../VIcon';
import Row from './Row';
import RowGroup from './RowGroup';
import VSimpleCheckbox from '../VCheckbox/VSimpleCheckbox';
import VSimpleTable from './VSimpleTable';
import MobileRow from './MobileRow';
// Mixins
import Loadable from '../../mixins/loadable';
// Directives
import ripple from '../../directives/ripple';
// Helpers
import mixins from '../../util/mixins';
import { deepEqual, getObjectValueByPath, getPrefixedScopedSlots, getSlot, defaultFilter, camelizeObjectKeys, getPropertyFromItem } from '../../util/helpers';
import { breaking } from '../../util/console';
import { mergeClasses } from '../../util/mergeData';
function filterFn(item, search, filter) {
    return (header) => {
        const value = getObjectValueByPath(item, header.value);
        return header.filter ? header.filter(value, search, item) : filter(value, search, item);
    };
}
function searchTableItems(items, search, headersWithCustomFilters, headersWithoutCustomFilters, customFilter) {
    search = typeof search === 'string' ? search.trim() : null;
    return items.filter(item => {
        // Headers with custom filters are evaluated whether or not a search term has been provided.
        // We need to match every filter to be included in the results.
        const matchesColumnFilters = headersWithCustomFilters.every(filterFn(item, search, defaultFilter));
        // Headers without custom filters are only filtered by the `search` property if it is defined.
        // We only need a single column to match the search term to be included in the results.
        const matchesSearchTerm = !search || headersWithoutCustomFilters.some(filterFn(item, search, customFilter));
        return matchesColumnFilters && matchesSearchTerm;
    });
}
/* @vue/component */
export default mixins(VDataIterator, Loadable).extend({
    name: 'v-data-table',
    // https://github.com/vuejs/vue/issues/6872
    directives: {
        ripple,
    },
    props: {
        headers: {
            type: Array,
            default: () => [],
        },
        showSelect: Boolean,
        showExpand: Boolean,
        showGroupBy: Boolean,
        // TODO: Fix
        // virtualRows: Boolean,
        height: [Number, String],
        hideDefaultHeader: Boolean,
        caption: String,
        dense: Boolean,
        headerProps: Object,
        calculateWidths: Boolean,
        fixedHeader: Boolean,
        headersLength: Number,
        expandIcon: {
            type: String,
            default: '$expand',
        },
        customFilter: {
            type: Function,
            default: defaultFilter,
        },
        itemClass: {
            type: [String, Function],
            default: () => '',
        },
        loaderHeight: {
            type: [Number, String],
            default: 4,
        },
    },
    data() {
        return {
            internalGroupBy: [],
            openCache: {},
            widths: [],
        };
    },
    computed: {
        computedHeaders() {
            if (!this.headers)
                return [];
            const headers = this.headers.filter(h => h.value === undefined || !this.internalGroupBy.find(v => v === h.value));
            const defaultHeader = { text: '', sortable: false, width: '1px' };
            if (this.showSelect) {
                const index = headers.findIndex(h => h.value === 'data-table-select');
                if (index < 0)
                    headers.unshift({ ...defaultHeader, value: 'data-table-select' });
                else
                    headers.splice(index, 1, { ...defaultHeader, ...headers[index] });
            }
            if (this.showExpand) {
                const index = headers.findIndex(h => h.value === 'data-table-expand');
                if (index < 0)
                    headers.unshift({ ...defaultHeader, value: 'data-table-expand' });
                else
                    headers.splice(index, 1, { ...defaultHeader, ...headers[index] });
            }
            return headers;
        },
        colspanAttrs() {
            return this.isMobile ? undefined : {
                colspan: this.headersLength || this.computedHeaders.length,
            };
        },
        columnSorters() {
            return this.computedHeaders.reduce((acc, header) => {
                if (header.sort)
                    acc[header.value] = header.sort;
                return acc;
            }, {});
        },
        headersWithCustomFilters() {
            return this.headers.filter(header => header.filter && (!header.hasOwnProperty('filterable') || header.filterable === true));
        },
        headersWithoutCustomFilters() {
            return this.headers.filter(header => !header.filter && (!header.hasOwnProperty('filterable') || header.filterable === true));
        },
        sanitizedHeaderProps() {
            return camelizeObjectKeys(this.headerProps);
        },
        computedItemsPerPage() {
            const itemsPerPage = this.options && this.options.itemsPerPage ? this.options.itemsPerPage : this.itemsPerPage;
            const itemsPerPageOptions = this.sanitizedFooterProps.itemsPerPageOptions;
            if (itemsPerPageOptions &&
                !itemsPerPageOptions.find(item => typeof item === 'number' ? item === itemsPerPage : item.value === itemsPerPage)) {
                const firstOption = itemsPerPageOptions[0];
                return typeof firstOption === 'object' ? firstOption.value : firstOption;
            }
            return itemsPerPage;
        },
    },
    created() {
        const breakingProps = [
            ['sort-icon', 'header-props.sort-icon'],
            ['hide-headers', 'hide-default-header'],
            ['select-all', 'show-select'],
        ];
        /* istanbul ignore next */
        breakingProps.forEach(([original, replacement]) => {
            if (this.$attrs.hasOwnProperty(original))
                breaking(original, replacement, this);
        });
    },
    mounted() {
        // if ((!this.sortBy || !this.sortBy.length) && (!this.options.sortBy || !this.options.sortBy.length)) {
        //   const firstSortable = this.headers.find(h => !('sortable' in h) || !!h.sortable)
        //   if (firstSortable) this.updateOptions({ sortBy: [firstSortable.value], sortDesc: [false] })
        // }
        if (this.calculateWidths) {
            window.addEventListener('resize', this.calcWidths);
            this.calcWidths();
        }
    },
    beforeDestroy() {
        if (this.calculateWidths) {
            window.removeEventListener('resize', this.calcWidths);
        }
    },
    methods: {
        calcWidths() {
            this.widths = Array.from(this.$el.querySelectorAll('th')).map(e => e.clientWidth);
        },
        customFilterWithColumns(items, search) {
            return searchTableItems(items, search, this.headersWithCustomFilters, this.headersWithoutCustomFilters, this.customFilter);
        },
        customSortWithHeaders(items, sortBy, sortDesc, locale) {
            return this.customSort(items, sortBy, sortDesc, locale, this.columnSorters);
        },
        createItemProps(item) {
            const props = VDataIterator.options.methods.createItemProps.call(this, item);
            return Object.assign(props, { headers: this.computedHeaders });
        },
        genCaption(props) {
            if (this.caption)
                return [this.$createElement('caption', [this.caption])];
            return getSlot(this, 'caption', props, true);
        },
        genColgroup(props) {
            return this.$createElement('colgroup', this.computedHeaders.map(header => {
                return this.$createElement('col', {
                    class: {
                        divider: header.divider,
                    },
                });
            }));
        },
        genLoading() {
            const th = this.$createElement('th', {
                staticClass: 'column',
                attrs: this.colspanAttrs,
            }, [this.genProgress()]);
            const tr = this.$createElement('tr', {
                staticClass: 'v-data-table__progress',
            }, [th]);
            return this.$createElement('thead', [tr]);
        },
        genHeaders(props) {
            const data = {
                props: {
                    ...this.sanitizedHeaderProps,
                    headers: this.computedHeaders,
                    options: props.options,
                    mobile: this.isMobile,
                    showGroupBy: this.showGroupBy,
                    someItems: this.someItems,
                    everyItem: this.everyItem,
                    singleSelect: this.singleSelect,
                    disableSort: this.disableSort,
                },
                on: {
                    sort: props.sort,
                    group: props.group,
                    'toggle-select-all': this.toggleSelectAll,
                },
            };
            const children = [getSlot(this, 'header', data)];
            if (!this.hideDefaultHeader) {
                const scopedSlots = getPrefixedScopedSlots('header.', this.$scopedSlots);
                children.push(this.$createElement(VDataTableHeader, {
                    ...data,
                    scopedSlots,
                }));
            }
            if (this.loading)
                children.push(this.genLoading());
            return children;
        },
        genEmptyWrapper(content) {
            return this.$createElement('tr', {
                staticClass: 'v-data-table__empty-wrapper',
            }, [
                this.$createElement('td', {
                    attrs: this.colspanAttrs,
                }, content),
            ]);
        },
        genItems(items, props) {
            const empty = this.genEmpty(props.originalItemsLength, props.pagination.itemsLength);
            if (empty)
                return [empty];
            return props.groupedItems
                ? this.genGroupedRows(props.groupedItems, props)
                : this.genRows(items, props);
        },
        genGroupedRows(groupedItems, props) {
            return groupedItems.map(group => {
                if (!this.openCache.hasOwnProperty(group.name))
                    this.$set(this.openCache, group.name, true);
                if (this.$scopedSlots.group) {
                    return this.$scopedSlots.group({
                        group: group.name,
                        options: props.options,
                        items: group.items,
                        headers: this.computedHeaders,
                    });
                }
                else {
                    return this.genDefaultGroupedRow(group.name, group.items, props);
                }
            });
        },
        genDefaultGroupedRow(group, items, props) {
            const isOpen = !!this.openCache[group];
            const children = [
                this.$createElement('template', { slot: 'row.content' }, this.genRows(items, props)),
            ];
            const toggleFn = () => this.$set(this.openCache, group, !this.openCache[group]);
            const removeFn = () => props.updateOptions({ groupBy: [], groupDesc: [] });
            if (this.$scopedSlots['group.header']) {
                children.unshift(this.$createElement('template', { slot: 'column.header' }, [
                    this.$scopedSlots['group.header']({ group, groupBy: props.options.groupBy, items, headers: this.computedHeaders, isOpen, toggle: toggleFn, remove: removeFn }),
                ]));
            }
            else {
                const toggle = this.$createElement(VBtn, {
                    staticClass: 'ma-0',
                    props: {
                        icon: true,
                        small: true,
                    },
                    on: {
                        click: toggleFn,
                    },
                }, [this.$createElement(VIcon, [isOpen ? '$minus' : '$plus'])]);
                const remove = this.$createElement(VBtn, {
                    staticClass: 'ma-0',
                    props: {
                        icon: true,
                        small: true,
                    },
                    on: {
                        click: removeFn,
                    },
                }, [this.$createElement(VIcon, ['$close'])]);
                const column = this.$createElement('td', {
                    staticClass: 'text-start',
                    attrs: this.colspanAttrs,
                }, [toggle, `${props.options.groupBy[0]}: ${group}`, remove]);
                children.unshift(this.$createElement('template', { slot: 'column.header' }, [column]));
            }
            if (this.$scopedSlots['group.summary']) {
                children.push(this.$createElement('template', { slot: 'column.summary' }, [
                    this.$scopedSlots['group.summary']({ group, groupBy: props.options.groupBy, items, headers: this.computedHeaders, isOpen, toggle: toggleFn }),
                ]));
            }
            return this.$createElement(RowGroup, {
                key: group,
                props: {
                    value: isOpen,
                },
            }, children);
        },
        genRows(items, props) {
            return this.$scopedSlots.item ? this.genScopedRows(items, props) : this.genDefaultRows(items, props);
        },
        genScopedRows(items, props) {
            const rows = [];
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                rows.push(this.$scopedSlots.item({
                    ...this.createItemProps(item),
                    index: i,
                }));
                if (this.isExpanded(item)) {
                    rows.push(this.$scopedSlots['expanded-item']({ item, headers: this.computedHeaders }));
                }
            }
            return rows;
        },
        genDefaultRows(items, props) {
            return this.$scopedSlots['expanded-item']
                ? items.map(item => this.genDefaultExpandedRow(item))
                : items.map(item => this.genDefaultSimpleRow(item));
        },
        genDefaultExpandedRow(item) {
            const isExpanded = this.isExpanded(item);
            const classes = {
                'v-data-table__expanded v-data-table__expanded__row': isExpanded,
            };
            const headerRow = this.genDefaultSimpleRow(item, classes);
            const expandedRow = this.$createElement('tr', {
                staticClass: 'v-data-table__expanded v-data-table__expanded__content',
            }, [this.$scopedSlots['expanded-item']({ item, headers: this.computedHeaders })]);
            return this.$createElement(RowGroup, {
                props: {
                    value: isExpanded,
                },
            }, [
                this.$createElement('template', { slot: 'row.header' }, [headerRow]),
                this.$createElement('template', { slot: 'row.content' }, [expandedRow]),
            ]);
        },
        genDefaultSimpleRow(item, classes = {}) {
            const scopedSlots = getPrefixedScopedSlots('item.', this.$scopedSlots);
            const data = this.createItemProps(item);
            if (this.showSelect) {
                const slot = scopedSlots['data-table-select'];
                scopedSlots['data-table-select'] = slot ? () => slot(data) : () => this.$createElement(VSimpleCheckbox, {
                    staticClass: 'v-data-table__checkbox',
                    props: {
                        value: data.isSelected,
                        disabled: !this.isSelectable(item),
                    },
                    on: {
                        input: (val) => data.select(val),
                    },
                });
            }
            if (this.showExpand) {
                const slot = scopedSlots['data-table-expand'];
                scopedSlots['data-table-expand'] = slot ? () => slot(data) : () => this.$createElement(VIcon, {
                    staticClass: 'v-data-table__expand-icon',
                    class: {
                        'v-data-table__expand-icon--active': data.isExpanded,
                    },
                    on: {
                        click: (e) => {
                            e.stopPropagation();
                            data.expand(!data.isExpanded);
                        },
                    },
                }, [this.expandIcon]);
            }
            return this.$createElement(this.isMobile ? MobileRow : Row, {
                key: getObjectValueByPath(item, this.itemKey),
                class: mergeClasses({ ...classes, 'v-data-table__selected': data.isSelected }, getPropertyFromItem(item, this.itemClass)),
                props: {
                    headers: this.computedHeaders,
                    hideDefaultHeader: this.hideDefaultHeader,
                    item,
                    rtl: this.$vuetify.rtl,
                },
                scopedSlots,
                on: {
                    // TODO: for click, the first argument should be the event, and the second argument should be data,
                    // but this is a breaking change so it's for v3
                    click: () => this.$emit('click:row', item, data),
                    contextmenu: (event) => this.$emit('contextmenu:row', event, data),
                    dblclick: (event) => this.$emit('dblclick:row', event, data),
                },
            });
        },
        genBody(props) {
            const data = {
                ...props,
                expand: this.expand,
                headers: this.computedHeaders,
                isExpanded: this.isExpanded,
                isMobile: this.isMobile,
                isSelected: this.isSelected,
                select: this.select,
            };
            if (this.$scopedSlots.body) {
                return this.$scopedSlots.body(data);
            }
            return this.$createElement('tbody', [
                getSlot(this, 'body.prepend', data, true),
                this.genItems(props.items, props),
                getSlot(this, 'body.append', data, true),
            ]);
        },
        genFooters(props) {
            const data = {
                props: {
                    options: props.options,
                    pagination: props.pagination,
                    itemsPerPageText: '$vuetify.dataTable.itemsPerPageText',
                    ...this.sanitizedFooterProps,
                },
                on: {
                    'update:options': (value) => props.updateOptions(value),
                },
                widths: this.widths,
                headers: this.computedHeaders,
            };
            const children = [
                getSlot(this, 'footer', data, true),
            ];
            if (!this.hideDefaultFooter) {
                children.push(this.$createElement(VDataFooter, {
                    ...data,
                    scopedSlots: getPrefixedScopedSlots('footer.', this.$scopedSlots),
                }));
            }
            return children;
        },
        genDefaultScopedSlot(props) {
            const simpleProps = {
                height: this.height,
                fixedHeader: this.fixedHeader,
                dense: this.dense,
            };
            // if (this.virtualRows) {
            //   return this.$createElement(VVirtualTable, {
            //     props: Object.assign(simpleProps, {
            //       items: props.items,
            //       height: this.height,
            //       rowHeight: this.dense ? 24 : 48,
            //       headerHeight: this.dense ? 32 : 48,
            //       // TODO: expose rest of props from virtual table?
            //     }),
            //     scopedSlots: {
            //       items: ({ items }) => this.genItems(items, props) as any,
            //     },
            //   }, [
            //     this.proxySlot('body.before', [this.genCaption(props), this.genHeaders(props)]),
            //     this.proxySlot('bottom', this.genFooters(props)),
            //   ])
            // }
            return this.$createElement(VSimpleTable, {
                props: simpleProps,
            }, [
                this.proxySlot('top', getSlot(this, 'top', props, true)),
                this.genCaption(props),
                this.genColgroup(props),
                this.genHeaders(props),
                this.genBody(props),
                this.proxySlot('bottom', this.genFooters(props)),
            ]);
        },
        proxySlot(slot, content) {
            return this.$createElement('template', { slot }, content);
        },
    },
    render() {
        return this.$createElement(VData, {
            props: {
                ...this.$props,
                customFilter: this.customFilterWithColumns,
                customSort: this.customSortWithHeaders,
                itemsPerPage: this.computedItemsPerPage,
            },
            on: {
                'update:options': (v, old) => {
                    this.internalGroupBy = v.groupBy || [];
                    !deepEqual(v, old) && this.$emit('update:options', v);
                },
                'update:page': (v) => this.$emit('update:page', v),
                'update:items-per-page': (v) => this.$emit('update:items-per-page', v),
                'update:sort-by': (v) => this.$emit('update:sort-by', v),
                'update:sort-desc': (v) => this.$emit('update:sort-desc', v),
                'update:group-by': (v) => this.$emit('update:group-by', v),
                'update:group-desc': (v) => this.$emit('update:group-desc', v),
                pagination: (v, old) => !deepEqual(v, old) && this.$emit('pagination', v),
                'current-items': (v) => {
                    this.internalCurrentItems = v;
                    this.$emit('current-items', v);
                },
                'page-count': (v) => this.$emit('page-count', v),
            },
            scopedSlots: {
                default: this.genDefaultScopedSlot,
            },
        });
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkRhdGFUYWJsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZEYXRhVGFibGUvVkRhdGFUYWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLG1CQUFtQixDQUFBO0FBa0IxQixhQUFhO0FBQ2IsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLFVBQVUsQ0FBQTtBQUNoQyxPQUFPLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtCQUFrQixDQUFBO0FBQzdELE9BQU8sSUFBSSxNQUFNLFNBQVMsQ0FBQTtBQUMxQixPQUFPLGdCQUFnQixNQUFNLG9CQUFvQixDQUFBO0FBQ2pELDhDQUE4QztBQUM5QyxPQUFPLEtBQUssTUFBTSxVQUFVLENBQUE7QUFDNUIsT0FBTyxHQUFHLE1BQU0sT0FBTyxDQUFBO0FBQ3ZCLE9BQU8sUUFBUSxNQUFNLFlBQVksQ0FBQTtBQUNqQyxPQUFPLGVBQWUsTUFBTSw4QkFBOEIsQ0FBQTtBQUMxRCxPQUFPLFlBQVksTUFBTSxnQkFBZ0IsQ0FBQTtBQUN6QyxPQUFPLFNBQVMsTUFBTSxhQUFhLENBQUE7QUFFbkMsU0FBUztBQUNULE9BQU8sUUFBUSxNQUFNLHVCQUF1QixDQUFBO0FBRTVDLGFBQWE7QUFDYixPQUFPLE1BQU0sTUFBTSx5QkFBeUIsQ0FBQTtBQUU1QyxVQUFVO0FBQ1YsT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFDdEMsT0FBTyxFQUFFLFNBQVMsRUFBRSxvQkFBb0IsRUFBRSxzQkFBc0IsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLGtCQUFrQixFQUFFLG1CQUFtQixFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFDN0osT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQzdDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQTtBQUVuRCxTQUFTLFFBQVEsQ0FBRSxJQUFTLEVBQUUsTUFBcUIsRUFB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QUUsQ0FBQyxDQUFvQixFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQztnQkFDM0Usa0JBQWtCLEVBQUUsQ0FBQyxDQUFzQixFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQztnQkFDakYsaUJBQWlCLEVBQUUsQ0FBQyxDQUFvQixFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQztnQkFDN0UsbUJBQW1CLEVBQUUsQ0FBQyxDQUFzQixFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQztnQkFDbkYsVUFBVSxFQUFFLENBQUMsQ0FBaUIsRUFBRSxHQUFtQixFQUFFLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO2dCQUN6RyxlQUFlLEVBQUUsQ0FBQyxDQUFRLEVBQUUsRUFBRTtvQkFDNUIsSUFBSSxDQUFDLG9CQUFvQixHQUFHLENBQUMsQ0FBQTtvQkFDN0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUE7Z0JBQ2hDLENBQUM7Z0JBQ0QsWUFBWSxFQUFFLENBQUMsQ0FBUyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7YUFDekQ7WUFDRCxXQUFXLEVBQUU7Z0JBQ1gsT0FBTyxFQUFFLElBQUksQ0FBQyxvQkFBMkI7YUFDMUM7U0FDRixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuL1ZEYXRhVGFibGUuc2FzcydcblxuLy8gVHlwZXNcbmltcG9ydCB7IFZOb2RlLCBWTm9kZUNoaWxkcmVuQXJyYXlDb250ZW50cywgVk5vZGVDaGlsZHJlbiwgUHJvcFR5cGUgfSBmcm9tICd2dWUnXG5pbXBvcnQge1xuICBEYXRhVGFibGVIZWFkZXIsXG4gIERhdGFUYWJsZUZpbHRlckZ1bmN0aW9uLFxuICBEYXRhU2NvcGVQcm9wcyxcbiAgRGF0YU9wdGlvbnMsXG4gIERhdGFQYWdpbmF0aW9uLFxuICBEYXRhVGFibGVDb21wYXJlRnVuY3Rpb24sXG4gIERhdGFJdGVtc1BlclBhZ2VPcHRpb24sXG4gIEl0ZW1Hcm91cCxcbiAgUm93Q2xhc3NGdW5jdGlvbixcbiAgRGF0YVRhYmxlSXRlbVByb3BzLFxufSBmcm9tICd2dWV0aWZ5L3R5cGVzJ1xuaW1wb3J0IHsgUHJvcFZhbGlkYXRvciB9IGZyb20gJ3Z1ZS90eXBlcy9vcHRpb25zJ1xuXG4vLyBDb21wb25lbnRzXG5pbXBvcnQgeyBWRGF0YSB9IGZyb20gJy4uL1ZEYXRhJ1xuaW1wb3J0IHsgVkRhdGFGb290ZXIsIFZEYXRhSXRlcmF0b3IgfSBmcm9tICcuLi9WRGF0YUl0ZXJhdG9yJ1xuaW1wb3J0IFZCdG4gZnJvbSAnLi4vVkJ0bidcbmltcG9ydCBWRGF0YVRhYmxlSGVhZGVyIGZyb20gJy4vVkRhdGFUYWJsZUhlYWRlcidcbi8vIGltcG9ydCBWVmlydHVhbFRhYmxlIGZyb20gJy4vVlZpcnR1YWxUYWJsZSdcbmltcG9ydCBWSWNvbiBmcm9tICcuLi9WSWNvbidcbmltcG9ydCBSb3cgZnJvbSAnLi9Sb3cnXG5pbXBvcnQgUm93R3JvdXAgZnJvbSAnLi9Sb3dHcm91cCdcbmltcG9ydCBWU2ltcGxlQ2hlY2tib3ggZnJvbSAnLi4vVkNoZWNrYm94L1ZTaW1wbGVDaGVja2JveCdcbmltcG9ydCBWU2ltcGxlVGFibGUgZnJvbSAnLi9WU2ltcGxlVGFibGUnXG5pbXBvcnQgTW9iaWxlUm93IGZyb20gJy4vTW9iaWxlUm93J1xuXG4vLyBNaXhpbnNcbmltcG9ydCBMb2FkYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvbG9hZGFibGUnXG5cbi8vIERpcmVjdGl2ZXNcbmltcG9ydCByaXBwbGUgZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9yaXBwbGUnXG5cbi8vIEhlbHBlcnNcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5pbXBvcnQgeyBkZWVwRXF1YWwsIGdldE9iamVjdFZhbHVlQnlQYXRoLCBnZXRQcmVmaXhlZFNjb3BlZFNsb3RzLCBnZXRTbG90LCBkZWZhdWx0RmlsdGVyLCBjYW1lbGl6ZU9iamVjdEtleXMsIGdldFByb3BlcnR5RnJvbUl0ZW0gfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5pbXBvcnQgeyBicmVha2luZyB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcbmltcG9ydCB7IG1lcmdlQ2xhc3NlcyB9IGZyb20gJy4uLy4uL3V0aWwvbWVyZ2VEYXRhJ1xuXG5mdW5jdGlvbiBmaWx0ZXJGbiAoaXRlbTogYW55LCBzZWFyY2g6IHN0cmluZyB8IG51bGwsIGZpbHRlcjogRGF0YVRhYmxlRmlsdGVyRnVuY3Rpb24pIHtcbiAgcmV0dXJuIChoZWFkZXI6IERhdGFUYWJsZUhlYWRlcikgPT4ge1xuICAgIGNvbnN0IHZhbHVlID0gZ2V0T2JqZWN0VmFsdWVCeVBhdGgoaXRlbSwgaGVhZGVyLnZhbHVlKVxuICAgIHJldHVybiBoZWFkZXIuZmlsdGVyID8gaGVhZGVyLmZpbHRlcih2YWx1ZSwgc2VhcmNoLCBpdGVtKSA6IGZpbHRlcih2YWx1ZSwgc2VhcmNoLCBpdGVtKVxuICB9XG59XG5cbmZ1bmN0aW9uIHNlYXJjaFRhYmxlSXRlbXMgKFxuICBpdGVtczogYW55W10sXG4gIHNlYXJjaDogc3RyaW5nIHwgbnVsbCxcbiAgaGVhZGVyc1dpdGhDdXN0b21GaWx0ZXJzOiBEYXRhVGFibGVIZWFkZXJbXSxcbiAgaGVhZGVyc1dpdGhvdXRDdXN0b21GaWx0ZXJzOiBEYXRhVGFibGVIZWFkZXJbXSxcbiAgY3VzdG9tRmlsdGVyOiBEYXRhVGFibGVGaWx0ZXJGdW5jdGlvblxuKSB7XG4gIHNlYXJjaCA9IHR5cGVvZiBzZWFyY2ggPT09ICdzdHJpbmcnID8gc2VhcmNoLnRyaW0oKSA6IG51bGxcblxuICByZXR1cm4gaXRlbXMuZmlsdGVyKGl0ZW0gPT4ge1xuICAgIC8vIEhlYWRlcnMgd2l0aCBjdXN0b20gZmlsdGVycyBhcmUgZXZhbHVhdGVkIHdoZXRoZXIgb3Igbm90IGEgc2VhcmNoIHRlcm0gaGFzIGJlZW4gcHJvdmlkZWQuXG4gICAgLy8gV2UgbmVlZCB0byBtYXRjaCBldmVyeSBmaWx0ZXIgdG8gYmUgaW5jbHVkZWQgaW4gdGhlIHJlc3VsdHMuXG4gICAgY29uc3QgbWF0Y2hlc0NvbHVtbkZpbHRlcnMgPSBoZWFkZXJzV2l0aEN1c3RvbUZpbHRlcnMuZXZlcnkoZmlsdGVyRm4oaXRlbSwgc2VhcmNoLCBkZWZhdWx0RmlsdGVyKSlcblxuICAgIC8vIEhlYWRlcnMgd2l0aG91dCBjdXN0b20gZmlsdGVycyBhcmUgb25seSBmaWx0ZXJlZCBieSB0aGUgYHNlYXJjaGAgcHJvcGVydHkgaWYgaXQgaXMgZGVmaW5lZC5cbiAgICAvLyBXZSBvbmx5IG5lZWQgYSBzaW5nbGUgY29sdW1uIHRvIG1hdGNoIHRoZSBzZWFyY2ggdGVybSB0byBiZSBpbmNsdWRlZCBpbiB0aGUgcmVzdWx0cy5cbiAgICBjb25zdCBtYXRjaGVzU2VhcmNoVGVybSA9ICFzZWFyY2ggfHwgaGVhZGVyc1dpdGhvdXRDdXN0b21GaWx0ZXJzLnNvbWUoZmlsdGVyRm4oaXRlbSwgc2VhcmNoLCBjdXN0b21GaWx0ZXIpKVxuXG4gICAgcmV0dXJuIG1hdGNoZXNDb2x1bW5GaWx0ZXJzICYmIG1hdGNoZXNTZWFyY2hUZXJtXG4gIH0pXG59XG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBtaXhpbnMoXG4gIFZEYXRhSXRlcmF0b3IsXG4gIExvYWRhYmxlLFxuKS5leHRlbmQoe1xuICBuYW1lOiAndi1kYXRhLXRhYmxlJyxcblxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vdnVlanMvdnVlL2lzc3Vlcy82ODcyXG4gIGRpcmVjdGl2ZXM6IHtcbiAgICByaXBwbGUsXG4gIH0sXG5cbiAgcHJvcHM6IHtcbiAgICBoZWFkZXJzOiB7XG4gICAgICB0eXBlOiBBcnJheSxcbiAgICAgIGRlZmF1bHQ6ICgpID0+IFtdLFxuICAgIH0gYXMgUHJvcFZhbGlkYXRvcjxEYXRhVGFibGVIZWFkZXJbXT4sXG4gICAgc2hvd1NlbGVjdDogQm9vbGVhbixcbiAgICBzaG93RXhwYW5kOiBCb29sZWFuLFxuICAgIHNob3dHcm91cEJ5OiBCb29sZWFuLFxuICAgIC8vIFRPRE86IEZpeFxuICAgIC8vIHZpcnR1YWxSb3dzOiBCb29sZWFuLFxuICAgIGhlaWdodDogW051bWJlciwgU3RyaW5nXSxcbiAgICBoaWRlRGVmYXVsdEhlYWRlcjogQm9vbGVhbixcbiAgICBjYXB0aW9uOiBTdHJpbmcsXG4gICAgZGVuc2U6IEJvb2xlYW4sXG4gICAgaGVhZGVyUHJvcHM6IE9iamVjdCxcbiAgICBjYWxjdWxhdGVXaWR0aHM6IEJvb2xlYW4sXG4gICAgZml4ZWRIZWFkZXI6IEJvb2xlYW4sXG4gICAgaGVhZGVyc0xlbmd0aDogTnVtYmVyLFxuICAgIGV4cGFuZEljb246IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICckZXhwYW5kJyxcbiAgICB9LFxuICAgIGN1c3RvbUZpbHRlcjoge1xuICAgICAgdHlwZTogRnVuY3Rpb24gYXMgUHJvcFR5cGU8dHlwZW9mIGRlZmF1bHRGaWx0ZXI+LFxuICAgICAgZGVmYXVsdDogZGVmYXVsdEZpbHRlcixcbiAgICB9LFxuICAgIGl0ZW1DbGFzczoge1xuICAgICAgdHlwZTogW1N0cmluZywgRnVuY3Rpb25dIGFzIFByb3BUeXBlPFJvd0NsYXNzRnVuY3Rpb24gfCBzdHJpbmc+LFxuICAgICAgZGVmYXVsdDogKCkgPT4gJycsXG4gICAgfSxcbiAgICBsb2FkZXJIZWlnaHQ6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiA0LFxuICAgIH0sXG4gIH0sXG5cbiAgZGF0YSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGludGVybmFsR3JvdXBCeTogW10gYXMgc3RyaW5nW10sXG4gICAgICBvcGVuQ2FjaGU6IHt9IGFzIHsgW2tleTogc3RyaW5nXTogYm9vbGVhbiB9LFxuICAgICAgd2lkdGhzOiBbXSBhcyBudW1iZXJbXSxcbiAgICB9XG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBjb21wdXRlZEhlYWRlcnMgKCk6IERhdGFUYWJsZUhlYWRlcltdIHtcbiAgICAgIGlmICghdGhpcy5oZWFkZXJzKSByZXR1cm4gW11cbiAgICAgIGNvbnN0IGhlYWRlcnMgPSB0aGlzLmhlYWRlcnMuZmlsdGVyKGggPT4gaC52YWx1ZSA9PT0gdW5kZWZpbmVkIHx8ICF0aGlzLmludGVybmFsR3JvdXBCeS5maW5kKHYgPT4gdiA9PT0gaC52YWx1ZSkpXG4gICAgICBjb25zdCBkZWZhdWx0SGVhZGVyID0geyB0ZXh0OiAnJywgc29ydGFibGU6IGZhbHNlLCB3aWR0aDogJzFweCcgfVxuXG4gICAgICBpZiAodGhpcy5zaG93U2VsZWN0KSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gaGVhZGVycy5maW5kSW5kZXgoaCA9PiBoLnZhbHVlID09PSAnZGF0YS10YWJsZS1zZWxlY3QnKVxuICAgICAgICBpZiAoaW5kZXggPCAwKSBoZWFkZXJzLnVuc2hpZnQoeyAuLi5kZWZhdWx0SGVhZGVyLCB2YWx1ZTogJ2RhdGEtdGFibGUtc2VsZWN0JyB9KVxuICAgICAgICBlbHNlIGhlYWRlcnMuc3BsaWNlKGluZGV4LCAxLCB7IC4uLmRlZmF1bHRIZWFkZXIsIC4uLmhlYWRlcnNbaW5kZXhdIH0pXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnNob3dFeHBhbmQpIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSBoZWFkZXJzLmZpbmRJbmRleChoID0+IGgudmFsdWUgPT09ICdkYXRhLXRhYmxlLWV4cGFuZCcpXG4gICAgICAgIGlmIChpbmRleCA8IDApIGhlYWRlcnMudW5zaGlmdCh7IC4uLmRlZmF1bHRIZWFkZXIsIHZhbHVlOiAnZGF0YS10YWJsZS1leHBhbmQnIH0pXG4gICAgICAgIGVsc2UgaGVhZGVycy5zcGxpY2UoaW5kZXgsIDEsIHsgLi4uZGVmYXVsdEhlYWRlciwgLi4uaGVhZGVyc1tpbmRleF0gfSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGhlYWRlcnNcbiAgICB9LFxuICAgIGNvbHNwYW5BdHRycyAoKTogb2JqZWN0IHwgdW5kZWZpbmVkIHtcbiAgICAgIHJldHVybiB0aGlzLmlzTW9iaWxlID8gdW5kZWZpbmVkIDoge1xuICAgICAgICBjb2xzcGFuOiB0aGlzLmhlYWRlcnNMZW5ndGggfHwgdGhpcy5jb21wdXRlZEhlYWRlcnMubGVuZ3RoLFxuICAgICAgfVxuICAgIH0sXG4gICAgY29sdW1uU29ydGVycyAoKTogUmVjb3JkPHN0cmluZywgRGF0YVRhYmxlQ29tcGFyZUZ1bmN0aW9uPiB7XG4gICAgICByZXR1cm4gdGhpcy5jb21wdXRlZEhlYWRlcnMucmVkdWNlPFJlY29yZDxzdHJpbmcsIERhdGFUYWJsZUNvbXBhcmVGdW5jdGlvbj4+KChhY2MsIGhlYWRlcikgPT4ge1xuICAgICAgICBpZiAoaGVhZGVyLnNvcnQpIGFjY1toZWFkZXIudmFsdWVdID0gaGVhZGVyLnNvcnRcbiAgICAgICAgcmV0dXJuIGFjY1xuICAgICAgfSwge30pXG4gICAgfSxcbiAgICBoZWFkZXJzV2l0aEN1c3RvbUZpbHRlcnMgKCk6IERhdGFUYWJsZUhlYWRlcltdIHtcbiAgICAgIHJldHVybiB0aGlzLmhlYWRlcnMuZmlsdGVyKGhlYWRlciA9PiBoZWFkZXIuZmlsdGVyICYmICghaGVhZGVyLmhhc093blByb3BlcnR5KCdmaWx0ZXJhYmxlJykgfHwgaGVhZGVyLmZpbHRlcmFibGUgPT09IHRydWUpKVxuICAgIH0sXG4gICAgaGVhZGVyc1dpdGhvdXRDdXN0b21GaWx0ZXJzICgpOiBEYXRhVGFibGVIZWFkZXJbXSB7XG4gICAgICByZXR1cm4gdGhpcy5oZWFkZXJzLmZpbHRlcihoZWFkZXIgPT4gIWhlYWRlci5maWx0ZXIgJiYgKCFoZWFkZXIuaGFzT3duUHJvcGVydHkoJ2ZpbHRlcmFibGUnKSB8fCBoZWFkZXIuZmlsdGVyYWJsZSA9PT0gdHJ1ZSkpXG4gICAgfSxcbiAgICBzYW5pdGl6ZWRIZWFkZXJQcm9wcyAoKTogUmVjb3JkPHN0cmluZywgYW55PiB7XG4gICAgICByZXR1cm4gY2FtZWxpemVPYmplY3RLZXlzKHRoaXMuaGVhZGVyUHJvcHMpXG4gICAgfSxcbiAgICBjb21wdXRlZEl0ZW1zUGVyUGFnZSAoKTogbnVtYmVyIHtcbiAgICAgIGNvbnN0IGl0ZW1zUGVyUGFnZSA9IHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuaXRlbXNQZXJQYWdlID8gdGhpcy5vcHRpb25zLml0ZW1zUGVyUGFnZSA6IHRoaXMuaXRlbXNQZXJQYWdlXG4gICAgICBjb25zdCBpdGVtc1BlclBhZ2VPcHRpb25zOiBEYXRhSXRlbXNQZXJQYWdlT3B0aW9uW10gfCB1bmRlZmluZWQgPSB0aGlzLnNhbml0aXplZEZvb3RlclByb3BzLml0ZW1zUGVyUGFnZU9wdGlvbnNcblxuICAgICAgaWYgKFxuICAgICAgICBpdGVtc1BlclBhZ2VPcHRpb25zICYmXG4gICAgICAgICFpdGVtc1BlclBhZ2VPcHRpb25zLmZpbmQoaXRlbSA9PiB0eXBlb2YgaXRlbSA9PT0gJ251bWJlcicgPyBpdGVtID09PSBpdGVtc1BlclBhZ2UgOiBpdGVtLnZhbHVlID09PSBpdGVtc1BlclBhZ2UpXG4gICAgICApIHtcbiAgICAgICAgY29uc3QgZmlyc3RPcHRpb24gPSBpdGVtc1BlclBhZ2VPcHRpb25zWzBdXG4gICAgICAgIHJldHVybiB0eXBlb2YgZmlyc3RPcHRpb24gPT09ICdvYmplY3QnID8gZmlyc3RPcHRpb24udmFsdWUgOiBmaXJzdE9wdGlvblxuICAgICAgfVxuXG4gICAgICByZXR1cm4gaXRlbXNQZXJQYWdlXG4gICAgfSxcbiAgfSxcblxuICBjcmVhdGVkICgpIHtcbiAgICBjb25zdCBicmVha2luZ1Byb3BzID0gW1xuICAgICAgWydzb3J0LWljb24nLCAnaGVhZGVyLXByb3BzLnNvcnQtaWNvbiddLFxuICAgICAgWydoaWRlLWhlYWRlcnMnLCAnaGlkZS1kZWZhdWx0LWhlYWRlciddLFxuICAgICAgWydzZWxlY3QtYWxsJywgJ3Nob3ctc2VsZWN0J10sXG4gICAgXVxuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBicmVha2luZ1Byb3BzLmZvckVhY2goKFtvcmlnaW5hbCwgcmVwbGFjZW1lbnRdKSA9PiB7XG4gICAgICBpZiAodGhpcy4kYXR0cnMuaGFzT3duUHJvcGVydHkob3JpZ2luYWwpKSBicmVha2luZyhvcmlnaW5hbCwgcmVwbGFjZW1lbnQsIHRoaXMpXG4gICAgfSlcbiAgfSxcblxuICBtb3VudGVkICgpIHtcbiAgICAvLyBpZiAoKCF0aGlzLnNvcnRCeSB8fCAhdGhpcy5zb3J0QnkubGVuZ3RoKSAmJiAoIXRoaXMub3B0aW9ucy5zb3J0QnkgfHwgIXRoaXMub3B0aW9ucy5zb3J0QnkubGVuZ3RoKSkge1xuICAgIC8vICAgY29uc3QgZmlyc3RTb3J0YWJsZSA9IHRoaXMuaGVhZGVycy5maW5kKGggPT4gISgnc29ydGFibGUnIGluIGgpIHx8ICEhaC5zb3J0YWJsZSlcbiAgICAvLyAgIGlmIChmaXJzdFNvcnRhYmxlKSB0aGlzLnVwZGF0ZU9wdGlvbnMoeyBzb3J0Qnk6IFtmaXJzdFNvcnRhYmxlLnZhbHVlXSwgc29ydERlc2M6IFtmYWxzZV0gfSlcbiAgICAvLyB9XG5cbiAgICBpZiAodGhpcy5jYWxjdWxhdGVXaWR0aHMpIHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLmNhbGNXaWR0aHMpXG4gICAgICB0aGlzLmNhbGNXaWR0aHMoKVxuICAgIH1cbiAgfSxcblxuICBiZWZvcmVEZXN0cm95ICgpIHtcbiAgICBpZiAodGhpcy5jYWxjdWxhdGVXaWR0aHMpIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLmNhbGNXaWR0aHMpXG4gICAgfVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBjYWxjV2lkdGhzICgpIHtcbiAgICAgIHRoaXMud2lkdGhzID0gQXJyYXkuZnJvbSh0aGlzLiRlbC5xdWVyeVNlbGVjdG9yQWxsKCd0aCcpKS5tYXAoZSA9PiBlLmNsaWVudFdpZHRoKVxuICAgIH0sXG4gICAgY3VzdG9tRmlsdGVyV2l0aENvbHVtbnMgKGl0ZW1zOiBhbnlbXSwgc2VhcmNoOiBzdHJpbmcpIHtcbiAgICAgIHJldHVybiBzZWFyY2hUYWJsZUl0ZW1zKGl0ZW1zLCBzZWFyY2gsIHRoaXMuaGVhZGVyc1dpdGhDdXN0b21GaWx0ZXJzLCB0aGlzLmhlYWRlcnNXaXRob3V0Q3VzdG9tRmlsdGVycywgdGhpcy5jdXN0b21GaWx0ZXIpXG4gICAgfSxcbiAgICBjdXN0b21Tb3J0V2l0aEhlYWRlcnMgKGl0ZW1zOiBhbnlbXSwgc29ydEJ5OiBzdHJpbmdbXSwgc29ydERlc2M6IGJvb2xlYW5bXSwgbG9jYWxlOiBzdHJpbmcpIHtcbiAgICAgIHJldHVybiB0aGlzLmN1c3RvbVNvcnQoaXRlbXMsIHNvcnRCeSwgc29ydERlc2MsIGxvY2FsZSwgdGhpcy5jb2x1bW5Tb3J0ZXJzKVxuICAgIH0sXG4gICAgY3JlYXRlSXRlbVByb3BzIChpdGVtOiBhbnkpOiBEYXRhVGFibGVJdGVtUHJvcHMge1xuICAgICAgY29uc3QgcHJvcHMgPSBWRGF0YUl0ZXJhdG9yLm9wdGlvbnMubWV0aG9kcy5jcmVhdGVJdGVtUHJvcHMuY2FsbCh0aGlzLCBpdGVtKVxuXG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihwcm9wcywgeyBoZWFkZXJzOiB0aGlzLmNvbXB1dGVkSGVhZGVycyB9KVxuICAgIH0sXG4gICAgZ2VuQ2FwdGlvbiAocHJvcHM6IERhdGFTY29wZVByb3BzKSB7XG4gICAgICBpZiAodGhpcy5jYXB0aW9uKSByZXR1cm4gW3RoaXMuJGNyZWF0ZUVsZW1lbnQoJ2NhcHRpb24nLCBbdGhpcy5jYXB0aW9uXSldXG5cbiAgICAgIHJldHVybiBnZXRTbG90KHRoaXMsICdjYXB0aW9uJywgcHJvcHMsIHRydWUpXG4gICAgfSxcbiAgICBnZW5Db2xncm91cCAocHJvcHM6IERhdGFTY29wZVByb3BzKSB7XG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnY29sZ3JvdXAnLCB0aGlzLmNvbXB1dGVkSGVhZGVycy5tYXAoaGVhZGVyID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2NvbCcsIHtcbiAgICAgICAgICBjbGFzczoge1xuICAgICAgICAgICAgZGl2aWRlcjogaGVhZGVyLmRpdmlkZXIsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSlcbiAgICAgIH0pKVxuICAgIH0sXG4gICAgZ2VuTG9hZGluZyAoKSB7XG4gICAgICBjb25zdCB0aCA9IHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ3RoJywge1xuICAgICAgICBzdGF0aWNDbGFzczogJ2NvbHVtbicsXG4gICAgICAgIGF0dHJzOiB0aGlzLmNvbHNwYW5BdHRycyxcbiAgICAgIH0sIFt0aGlzLmdlblByb2dyZXNzKCldKVxuXG4gICAgICBjb25zdCB0ciA9IHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ3RyJywge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3YtZGF0YS10YWJsZV9fcHJvZ3Jlc3MnLFxuICAgICAgfSwgW3RoXSlcblxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ3RoZWFkJywgW3RyXSlcbiAgICB9LFxuICAgIGdlbkhlYWRlcnMgKHByb3BzOiBEYXRhU2NvcGVQcm9wcykge1xuICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICAuLi50aGlzLnNhbml0aXplZEhlYWRlclByb3BzLFxuICAgICAgICAgIGhlYWRlcnM6IHRoaXMuY29tcHV0ZWRIZWFkZXJzLFxuICAgICAgICAgIG9wdGlvbnM6IHByb3BzLm9wdGlvbnMsXG4gICAgICAgICAgbW9iaWxlOiB0aGlzLmlzTW9iaWxlLFxuICAgICAgICAgIHNob3dHcm91cEJ5OiB0aGlzLnNob3dHcm91cEJ5LFxuICAgICAgICAgIHNvbWVJdGVtczogdGhpcy5zb21lSXRlbXMsXG4gICAgICAgICAgZXZlcnlJdGVtOiB0aGlzLmV2ZXJ5SXRlbSxcbiAgICAgICAgICBzaW5nbGVTZWxlY3Q6IHRoaXMuc2luZ2xlU2VsZWN0LFxuICAgICAgICAgIGRpc2FibGVTb3J0OiB0aGlzLmRpc2FibGVTb3J0LFxuICAgICAgICB9LFxuICAgICAgICBvbjoge1xuICAgICAgICAgIHNvcnQ6IHByb3BzLnNvcnQsXG4gICAgICAgICAgZ3JvdXA6IHByb3BzLmdyb3VwLFxuICAgICAgICAgICd0b2dnbGUtc2VsZWN0LWFsbCc6IHRoaXMudG9nZ2xlU2VsZWN0QWxsLFxuICAgICAgICB9LFxuICAgICAgfVxuXG4gICAgICBjb25zdCBjaGlsZHJlbjogVk5vZGVDaGlsZHJlbkFycmF5Q29udGVudHMgPSBbZ2V0U2xvdCh0aGlzLCAnaGVhZGVyJywgZGF0YSldXG5cbiAgICAgIGlmICghdGhpcy5oaWRlRGVmYXVsdEhlYWRlcikge1xuICAgICAgICBjb25zdCBzY29wZWRTbG90cyA9IGdldFByZWZpeGVkU2NvcGVkU2xvdHMoJ2hlYWRlci4nLCB0aGlzLiRzY29wZWRTbG90cylcbiAgICAgICAgY2hpbGRyZW4ucHVzaCh0aGlzLiRjcmVhdGVFbGVtZW50KFZEYXRhVGFibGVIZWFkZXIsIHtcbiAgICAgICAgICAuLi5kYXRhLFxuICAgICAgICAgIHNjb3BlZFNsb3RzLFxuICAgICAgICB9KSlcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMubG9hZGluZykgY2hpbGRyZW4ucHVzaCh0aGlzLmdlbkxvYWRpbmcoKSlcblxuICAgICAgcmV0dXJuIGNoaWxkcmVuXG4gICAgfSxcbiAgICBnZW5FbXB0eVdyYXBwZXIgKGNvbnRlbnQ6IFZOb2RlQ2hpbGRyZW5BcnJheUNvbnRlbnRzKSB7XG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgndHInLCB7XG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1kYXRhLXRhYmxlX19lbXB0eS13cmFwcGVyJyxcbiAgICAgIH0sIFtcbiAgICAgICAgdGhpcy4kY3JlYXRlRWxlbWVudCgndGQnLCB7XG4gICAgICAgICAgYXR0cnM6IHRoaXMuY29sc3BhbkF0dHJzLFxuICAgICAgICB9LCBjb250ZW50KSxcbiAgICAgIF0pXG4gICAgfSxcbiAgICBnZW5JdGVtcyAoaXRlbXM6IGFueVtdLCBwcm9wczogRGF0YVNjb3BlUHJvcHMpIHtcbiAgICAgIGNvbnN0IGVtcHR5ID0gdGhpcy5nZW5FbXB0eShwcm9wcy5vcmlnaW5hbEl0ZW1zTGVuZ3RoLCBwcm9wcy5wYWdpbmF0aW9uLml0ZW1zTGVuZ3RoKVxuICAgICAgaWYgKGVtcHR5KSByZXR1cm4gW2VtcHR5XVxuXG4gICAgICByZXR1cm4gcHJvcHMuZ3JvdXBlZEl0ZW1zXG4gICAgICAgID8gdGhpcy5nZW5Hcm91cGVkUm93cyhwcm9wcy5ncm91cGVkSXRlbXMsIHByb3BzKVxuICAgICAgICA6IHRoaXMuZ2VuUm93cyhpdGVtcywgcHJvcHMpXG4gICAgfSxcbiAgICBnZW5Hcm91cGVkUm93cyAoZ3JvdXBlZEl0ZW1zOiBJdGVtR3JvdXA8YW55PltdLCBwcm9wczogRGF0YVNjb3BlUHJvcHMpIHtcbiAgICAgIHJldHVybiBncm91cGVkSXRlbXMubWFwKGdyb3VwID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLm9wZW5DYWNoZS5oYXNPd25Qcm9wZXJ0eShncm91cC5uYW1lKSkgdGhpcy4kc2V0KHRoaXMub3BlbkNhY2hlLCBncm91cC5uYW1lLCB0cnVlKVxuXG4gICAgICAgIGlmICh0aGlzLiRzY29wZWRTbG90cy5ncm91cCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLiRzY29wZWRTbG90cy5ncm91cCh7XG4gICAgICAgICAgICBncm91cDogZ3JvdXAubmFtZSxcbiAgICAgICAgICAgIG9wdGlvbnM6IHByb3BzLm9wdGlvbnMsXG4gICAgICAgICAgICBpdGVtczogZ3JvdXAuaXRlbXMsXG4gICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmNvbXB1dGVkSGVhZGVycyxcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLmdlbkRlZmF1bHRHcm91cGVkUm93KGdyb3VwLm5hbWUsIGdyb3VwLml0ZW1zLCBwcm9wcylcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9LFxuICAgIGdlbkRlZmF1bHRHcm91cGVkUm93IChncm91cDogc3RyaW5nLCBpdGVtczogYW55W10sIHByb3BzOiBEYXRhU2NvcGVQcm9wcykge1xuICAgICAgY29uc3QgaXNPcGVuID0gISF0aGlzLm9wZW5DYWNoZVtncm91cF1cbiAgICAgIGNvbnN0IGNoaWxkcmVuOiBWTm9kZUNoaWxkcmVuID0gW1xuICAgICAgICB0aGlzLiRjcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScsIHsgc2xvdDogJ3Jvdy5jb250ZW50JyB9LCB0aGlzLmdlblJvd3MoaXRlbXMsIHByb3BzKSksXG4gICAgICBdXG4gICAgICBjb25zdCB0b2dnbGVGbiA9ICgpID0+IHRoaXMuJHNldCh0aGlzLm9wZW5DYWNoZSwgZ3JvdXAsICF0aGlzLm9wZW5DYWNoZVtncm91cF0pXG4gICAgICBjb25zdCByZW1vdmVGbiA9ICgpID0+IHByb3BzLnVwZGF0ZU9wdGlvbnMoeyBncm91cEJ5OiBbXSwgZ3JvdXBEZXNjOiBbXSB9KVxuXG4gICAgICBpZiAodGhpcy4kc2NvcGVkU2xvdHNbJ2dyb3VwLmhlYWRlciddKSB7XG4gICAgICAgIGNoaWxkcmVuLnVuc2hpZnQodGhpcy4kY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnLCB7IHNsb3Q6ICdjb2x1bW4uaGVhZGVyJyB9LCBbXG4gICAgICAgICAgdGhpcy4kc2NvcGVkU2xvdHNbJ2dyb3VwLmhlYWRlciddISh7IGdyb3VwLCBncm91cEJ5OiBwcm9wcy5vcHRpb25zLmdyb3VwQnksIGl0ZW1zLCBoZWFkZXJzOiB0aGlzLmNvbXB1dGVkSGVhZGVycywgaXNPcGVuLCB0b2dnbGU6IHRvZ2dsZUZuLCByZW1vdmU6IHJlbW92ZUZuIH0pLFxuICAgICAgICBdKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHRvZ2dsZSA9IHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkJ0biwge1xuICAgICAgICAgIHN0YXRpY0NsYXNzOiAnbWEtMCcsXG4gICAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICAgIGljb246IHRydWUsXG4gICAgICAgICAgICBzbWFsbDogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICBjbGljazogdG9nZ2xlRm4sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSwgW3RoaXMuJGNyZWF0ZUVsZW1lbnQoVkljb24sIFtpc09wZW4gPyAnJG1pbnVzJyA6ICckcGx1cyddKV0pXG5cbiAgICAgICAgY29uc3QgcmVtb3ZlID0gdGhpcy4kY3JlYXRlRWxlbWVudChWQnRuLCB7XG4gICAgICAgICAgc3RhdGljQ2xhc3M6ICdtYS0wJyxcbiAgICAgICAgICBwcm9wczoge1xuICAgICAgICAgICAgaWNvbjogdHJ1ZSxcbiAgICAgICAgICAgIHNtYWxsOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgb246IHtcbiAgICAgICAgICAgIGNsaWNrOiByZW1vdmVGbixcbiAgICAgICAgICB9LFxuICAgICAgICB9LCBbdGhpcy4kY3JlYXRlRWxlbWVudChWSWNvbiwgWyckY2xvc2UnXSldKVxuXG4gICAgICAgIGNvbnN0IGNvbHVtbiA9IHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ3RkJywge1xuICAgICAgICAgIHN0YXRpY0NsYXNzOiAndGV4dC1zdGFydCcsXG4gICAgICAgICAgYXR0cnM6IHRoaXMuY29sc3BhbkF0dHJzLFxuICAgICAgICB9LCBbdG9nZ2xlLCBgJHtwcm9wcy5vcHRpb25zLmdyb3VwQnlbMF19OiAke2dyb3VwfWAsIHJlbW92ZV0pXG5cbiAgICAgICAgY2hpbGRyZW4udW5zaGlmdCh0aGlzLiRjcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScsIHsgc2xvdDogJ2NvbHVtbi5oZWFkZXInIH0sIFtjb2x1bW5dKSlcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuJHNjb3BlZFNsb3RzWydncm91cC5zdW1tYXJ5J10pIHtcbiAgICAgICAgY2hpbGRyZW4ucHVzaCh0aGlzLiRjcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScsIHsgc2xvdDogJ2NvbHVtbi5zdW1tYXJ5JyB9LCBbXG4gICAgICAgICAgdGhpcy4kc2NvcGVkU2xvdHNbJ2dyb3VwLnN1bW1hcnknXSEoeyBncm91cCwgZ3JvdXBCeTogcHJvcHMub3B0aW9ucy5ncm91cEJ5LCBpdGVtcywgaGVhZGVyczogdGhpcy5jb21wdXRlZEhlYWRlcnMsIGlzT3BlbiwgdG9nZ2xlOiB0b2dnbGVGbiB9KSxcbiAgICAgICAgXSkpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFJvd0dyb3VwLCB7XG4gICAgICAgIGtleTogZ3JvdXAsXG4gICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgdmFsdWU6IGlzT3BlbixcbiAgICAgICAgfSxcbiAgICAgIH0sIGNoaWxkcmVuKVxuICAgIH0sXG4gICAgZ2VuUm93cyAoaXRlbXM6IGFueVtdLCBwcm9wczogRGF0YVNjb3BlUHJvcHMpIHtcbiAgICAgIHJldHVybiB0aGlzLiRzY29wZWRTbG90cy5pdGVtID8gdGhpcy5nZW5TY29wZWRSb3dzKGl0ZW1zLCBwcm9wcykgOiB0aGlzLmdlbkRlZmF1bHRSb3dzKGl0ZW1zLCBwcm9wcylcbiAgICB9LFxuICAgIGdlblNjb3BlZFJvd3MgKGl0ZW1zOiBhbnlbXSwgcHJvcHM6IERhdGFTY29wZVByb3BzKSB7XG4gICAgICBjb25zdCByb3dzID0gW11cblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBpdGVtID0gaXRlbXNbaV1cbiAgICAgICAgcm93cy5wdXNoKHRoaXMuJHNjb3BlZFNsb3RzLml0ZW0hKHtcbiAgICAgICAgICAuLi50aGlzLmNyZWF0ZUl0ZW1Qcm9wcyhpdGVtKSxcbiAgICAgICAgICBpbmRleDogaSxcbiAgICAgICAgfSkpXG5cbiAgICAgICAgaWYgKHRoaXMuaXNFeHBhbmRlZChpdGVtKSkge1xuICAgICAgICAgIHJvd3MucHVzaCh0aGlzLiRzY29wZWRTbG90c1snZXhwYW5kZWQtaXRlbSddISh7IGl0ZW0sIGhlYWRlcnM6IHRoaXMuY29tcHV0ZWRIZWFkZXJzIH0pKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByb3dzXG4gICAgfSxcbiAgICBnZW5EZWZhdWx0Um93cyAoaXRlbXM6IGFueVtdLCBwcm9wczogRGF0YVNjb3BlUHJvcHMpIHtcbiAgICAgIHJldHVybiB0aGlzLiRzY29wZWRTbG90c1snZXhwYW5kZWQtaXRlbSddXG4gICAgICAgID8gaXRlbXMubWFwKGl0ZW0gPT4gdGhpcy5nZW5EZWZhdWx0RXhwYW5kZWRSb3coaXRlbSkpXG4gICAgICAgIDogaXRlbXMubWFwKGl0ZW0gPT4gdGhpcy5nZW5EZWZhdWx0U2ltcGxlUm93KGl0ZW0pKVxuICAgIH0sXG4gICAgZ2VuRGVmYXVsdEV4cGFuZGVkUm93IChpdGVtOiBhbnkpOiBWTm9kZSB7XG4gICAgICBjb25zdCBpc0V4cGFuZGVkID0gdGhpcy5pc0V4cGFuZGVkKGl0ZW0pXG4gICAgICBjb25zdCBjbGFzc2VzID0ge1xuICAgICAgICAndi1kYXRhLXRhYmxlX19leHBhbmRlZCB2LWRhdGEtdGFibGVfX2V4cGFuZGVkX19yb3cnOiBpc0V4cGFuZGVkLFxuICAgICAgfVxuICAgICAgY29uc3QgaGVhZGVyUm93ID0gdGhpcy5nZW5EZWZhdWx0U2ltcGxlUm93KGl0ZW0sIGNsYXNzZXMpXG4gICAgICBjb25zdCBleHBhbmRlZFJvdyA9IHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ3RyJywge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3YtZGF0YS10YWJsZV9fZXhwYW5kZWQgdi1kYXRhLXRhYmxlX19leHBhbmRlZF9fY29udGVudCcsXG4gICAgICB9LCBbdGhpcy4kc2NvcGVkU2xvdHNbJ2V4cGFuZGVkLWl0ZW0nXSEoeyBpdGVtLCBoZWFkZXJzOiB0aGlzLmNvbXB1dGVkSGVhZGVycyB9KV0pXG5cbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFJvd0dyb3VwLCB7XG4gICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgdmFsdWU6IGlzRXhwYW5kZWQsXG4gICAgICAgIH0sXG4gICAgICB9LCBbXG4gICAgICAgIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJywgeyBzbG90OiAncm93LmhlYWRlcicgfSwgW2hlYWRlclJvd10pLFxuICAgICAgICB0aGlzLiRjcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScsIHsgc2xvdDogJ3Jvdy5jb250ZW50JyB9LCBbZXhwYW5kZWRSb3ddKSxcbiAgICAgIF0pXG4gICAgfSxcbiAgICBnZW5EZWZhdWx0U2ltcGxlUm93IChpdGVtOiBhbnksIGNsYXNzZXM6IFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+ID0ge30pOiBWTm9kZSB7XG4gICAgICBjb25zdCBzY29wZWRTbG90cyA9IGdldFByZWZpeGVkU2NvcGVkU2xvdHMoJ2l0ZW0uJywgdGhpcy4kc2NvcGVkU2xvdHMpXG5cbiAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmNyZWF0ZUl0ZW1Qcm9wcyhpdGVtKVxuXG4gICAgICBpZiAodGhpcy5zaG93U2VsZWN0KSB7XG4gICAgICAgIGNvbnN0IHNsb3QgPSBzY29wZWRTbG90c1snZGF0YS10YWJsZS1zZWxlY3QnXVxuICAgICAgICBzY29wZWRTbG90c1snZGF0YS10YWJsZS1zZWxlY3QnXSA9IHNsb3QgPyAoKSA9PiBzbG90KGRhdGEpIDogKCkgPT4gdGhpcy4kY3JlYXRlRWxlbWVudChWU2ltcGxlQ2hlY2tib3gsIHtcbiAgICAgICAgICBzdGF0aWNDbGFzczogJ3YtZGF0YS10YWJsZV9fY2hlY2tib3gnLFxuICAgICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgICB2YWx1ZTogZGF0YS5pc1NlbGVjdGVkLFxuICAgICAgICAgICAgZGlzYWJsZWQ6ICF0aGlzLmlzU2VsZWN0YWJsZShpdGVtKSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICBpbnB1dDogKHZhbDogYm9vbGVhbikgPT4gZGF0YS5zZWxlY3QodmFsKSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5zaG93RXhwYW5kKSB7XG4gICAgICAgIGNvbnN0IHNsb3QgPSBzY29wZWRTbG90c1snZGF0YS10YWJsZS1leHBhbmQnXVxuICAgICAgICBzY29wZWRTbG90c1snZGF0YS10YWJsZS1leHBhbmQnXSA9IHNsb3QgPyAoKSA9PiBzbG90KGRhdGEpIDogKCkgPT4gdGhpcy4kY3JlYXRlRWxlbWVudChWSWNvbiwge1xuICAgICAgICAgIHN0YXRpY0NsYXNzOiAndi1kYXRhLXRhYmxlX19leHBhbmQtaWNvbicsXG4gICAgICAgICAgY2xhc3M6IHtcbiAgICAgICAgICAgICd2LWRhdGEtdGFibGVfX2V4cGFuZC1pY29uLS1hY3RpdmUnOiBkYXRhLmlzRXhwYW5kZWQsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgY2xpY2s6IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgICAgZGF0YS5leHBhbmQoIWRhdGEuaXNFeHBhbmRlZClcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSwgW3RoaXMuZXhwYW5kSWNvbl0pXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KHRoaXMuaXNNb2JpbGUgPyBNb2JpbGVSb3cgOiBSb3csIHtcbiAgICAgICAga2V5OiBnZXRPYmplY3RWYWx1ZUJ5UGF0aChpdGVtLCB0aGlzLml0ZW1LZXkpLFxuICAgICAgICBjbGFzczogbWVyZ2VDbGFzc2VzKFxuICAgICAgICAgIHsgLi4uY2xhc3NlcywgJ3YtZGF0YS10YWJsZV9fc2VsZWN0ZWQnOiBkYXRhLmlzU2VsZWN0ZWQgfSxcbiAgICAgICAgICBnZXRQcm9wZXJ0eUZyb21JdGVtKGl0ZW0sIHRoaXMuaXRlbUNsYXNzKVxuICAgICAgICApLFxuICAgICAgICBwcm9wczoge1xuICAgICAgICAgIGhlYWRlcnM6IHRoaXMuY29tcHV0ZWRIZWFkZXJzLFxuICAgICAgICAgIGhpZGVEZWZhdWx0SGVhZGVyOiB0aGlzLmhpZGVEZWZhdWx0SGVhZGVyLFxuICAgICAgICAgIGl0ZW0sXG4gICAgICAgICAgcnRsOiB0aGlzLiR2dWV0aWZ5LnJ0bCxcbiAgICAgICAgfSxcbiAgICAgICAgc2NvcGVkU2xvdHMsXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgLy8gVE9ETzogZm9yIGNsaWNrLCB0aGUgZmlyc3QgYXJndW1lbnQgc2hvdWxkIGJlIHRoZSBldmVudCwgYW5kIHRoZSBzZWNvbmQgYXJndW1lbnQgc2hvdWxkIGJlIGRhdGEsXG4gICAgICAgICAgLy8gYnV0IHRoaXMgaXMgYSBicmVha2luZyBjaGFuZ2Ugc28gaXQncyBmb3IgdjNcbiAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy4kZW1pdCgnY2xpY2s6cm93JywgaXRlbSwgZGF0YSksXG4gICAgICAgICAgY29udGV4dG1lbnU6IChldmVudDogTW91c2VFdmVudCkgPT4gdGhpcy4kZW1pdCgnY29udGV4dG1lbnU6cm93JywgZXZlbnQsIGRhdGEpLFxuICAgICAgICAgIGRibGNsaWNrOiAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHRoaXMuJGVtaXQoJ2RibGNsaWNrOnJvdycsIGV2ZW50LCBkYXRhKSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfSxcbiAgICBnZW5Cb2R5IChwcm9wczogRGF0YVNjb3BlUHJvcHMpOiBWTm9kZSB8IHN0cmluZyB8IFZOb2RlQ2hpbGRyZW4ge1xuICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgLi4ucHJvcHMsXG4gICAgICAgIGV4cGFuZDogdGhpcy5leHBhbmQsXG4gICAgICAgIGhlYWRlcnM6IHRoaXMuY29tcHV0ZWRIZWFkZXJzLFxuICAgICAgICBpc0V4cGFuZGVkOiB0aGlzLmlzRXhwYW5kZWQsXG4gICAgICAgIGlzTW9iaWxlOiB0aGlzLmlzTW9iaWxlLFxuICAgICAgICBpc1NlbGVjdGVkOiB0aGlzLmlzU2VsZWN0ZWQsXG4gICAgICAgIHNlbGVjdDogdGhpcy5zZWxlY3QsXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLiRzY29wZWRTbG90cy5ib2R5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLiRzY29wZWRTbG90cy5ib2R5IShkYXRhKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgndGJvZHknLCBbXG4gICAgICAgIGdldFNsb3QodGhpcywgJ2JvZHkucHJlcGVuZCcsIGRhdGEsIHRydWUpLFxuICAgICAgICB0aGlzLmdlbkl0ZW1zKHByb3BzLml0ZW1zLCBwcm9wcyksXG4gICAgICAgIGdldFNsb3QodGhpcywgJ2JvZHkuYXBwZW5kJywgZGF0YSwgdHJ1ZSksXG4gICAgICBdKVxuICAgIH0sXG4gICAgZ2VuRm9vdGVycyAocHJvcHM6IERhdGFTY29wZVByb3BzKSB7XG4gICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICBwcm9wczoge1xuICAgICAgICAgIG9wdGlvbnM6IHByb3BzLm9wdGlvbnMsXG4gICAgICAgICAgcGFnaW5hdGlvbjogcHJvcHMucGFnaW5hdGlvbixcbiAgICAgICAgICBpdGVtc1BlclBhZ2VUZXh0OiAnJHZ1ZXRpZnkuZGF0YVRhYmxlLml0ZW1zUGVyUGFnZVRleHQnLFxuICAgICAgICAgIC4uLnRoaXMuc2FuaXRpemVkRm9vdGVyUHJvcHMsXG4gICAgICAgIH0sXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgJ3VwZGF0ZTpvcHRpb25zJzogKHZhbHVlOiBhbnkpID0+IHByb3BzLnVwZGF0ZU9wdGlvbnModmFsdWUpLFxuICAgICAgICB9LFxuICAgICAgICB3aWR0aHM6IHRoaXMud2lkdGhzLFxuICAgICAgICBoZWFkZXJzOiB0aGlzLmNvbXB1dGVkSGVhZGVycyxcbiAgICAgIH1cblxuICAgICAgY29uc3QgY2hpbGRyZW46IFZOb2RlQ2hpbGRyZW4gPSBbXG4gICAgICAgIGdldFNsb3QodGhpcywgJ2Zvb3RlcicsIGRhdGEsIHRydWUpLFxuICAgICAgXVxuXG4gICAgICBpZiAoIXRoaXMuaGlkZURlZmF1bHRGb290ZXIpIHtcbiAgICAgICAgY2hpbGRyZW4ucHVzaCh0aGlzLiRjcmVhdGVFbGVtZW50KFZEYXRhRm9vdGVyLCB7XG4gICAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgICBzY29wZWRTbG90czogZ2V0UHJlZml4ZWRTY29wZWRTbG90cygnZm9vdGVyLicsIHRoaXMuJHNjb3BlZFNsb3RzKSxcbiAgICAgICAgfSkpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjaGlsZHJlblxuICAgIH0sXG4gICAgZ2VuRGVmYXVsdFNjb3BlZFNsb3QgKHByb3BzOiBEYXRhU2NvcGVQcm9wcyk6IFZOb2RlIHtcbiAgICAgIGNvbnN0IHNpbXBsZVByb3BzID0ge1xuICAgICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LFxuICAgICAgICBmaXhlZEhlYWRlcjogdGhpcy5maXhlZEhlYWRlcixcbiAgICAgICAgZGVuc2U6IHRoaXMuZGVuc2UsXG4gICAgICB9XG5cbiAgICAgIC8vIGlmICh0aGlzLnZpcnR1YWxSb3dzKSB7XG4gICAgICAvLyAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZWaXJ0dWFsVGFibGUsIHtcbiAgICAgIC8vICAgICBwcm9wczogT2JqZWN0LmFzc2lnbihzaW1wbGVQcm9wcywge1xuICAgICAgLy8gICAgICAgaXRlbXM6IHByb3BzLml0ZW1zLFxuICAgICAgLy8gICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcbiAgICAgIC8vICAgICAgIHJvd0hlaWdodDogdGhpcy5kZW5zZSA/IDI0IDogNDgsXG4gICAgICAvLyAgICAgICBoZWFkZXJIZWlnaHQ6IHRoaXMuZGVuc2UgPyAzMiA6IDQ4LFxuICAgICAgLy8gICAgICAgLy8gVE9ETzogZXhwb3NlIHJlc3Qgb2YgcHJvcHMgZnJvbSB2aXJ0dWFsIHRhYmxlP1xuICAgICAgLy8gICAgIH0pLFxuICAgICAgLy8gICAgIHNjb3BlZFNsb3RzOiB7XG4gICAgICAvLyAgICAgICBpdGVtczogKHsgaXRlbXMgfSkgPT4gdGhpcy5nZW5JdGVtcyhpdGVtcywgcHJvcHMpIGFzIGFueSxcbiAgICAgIC8vICAgICB9LFxuICAgICAgLy8gICB9LCBbXG4gICAgICAvLyAgICAgdGhpcy5wcm94eVNsb3QoJ2JvZHkuYmVmb3JlJywgW3RoaXMuZ2VuQ2FwdGlvbihwcm9wcyksIHRoaXMuZ2VuSGVhZGVycyhwcm9wcyldKSxcbiAgICAgIC8vICAgICB0aGlzLnByb3h5U2xvdCgnYm90dG9tJywgdGhpcy5nZW5Gb290ZXJzKHByb3BzKSksXG4gICAgICAvLyAgIF0pXG4gICAgICAvLyB9XG5cbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZTaW1wbGVUYWJsZSwge1xuICAgICAgICBwcm9wczogc2ltcGxlUHJvcHMsXG4gICAgICB9LCBbXG4gICAgICAgIHRoaXMucHJveHlTbG90KCd0b3AnLCBnZXRTbG90KHRoaXMsICd0b3AnLCBwcm9wcywgdHJ1ZSkpLFxuICAgICAgICB0aGlzLmdlbkNhcHRpb24ocHJvcHMpLFxuICAgICAgICB0aGlzLmdlbkNvbGdyb3VwKHByb3BzKSxcbiAgICAgICAgdGhpcy5nZW5IZWFkZXJzKHByb3BzKSxcbiAgICAgICAgdGhpcy5nZW5Cb2R5KHByb3BzKSxcbiAgICAgICAgdGhpcy5wcm94eVNsb3QoJ2JvdHRvbScsIHRoaXMuZ2VuRm9vdGVycyhwcm9wcykpLFxuICAgICAgXSlcbiAgICB9LFxuICAgIHByb3h5U2xvdCAoc2xvdDogc3RyaW5nLCBjb250ZW50OiBWTm9kZUNoaWxkcmVuKSB7XG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnLCB7IHNsb3QgfSwgY29udGVudClcbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoKTogVk5vZGUge1xuICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZEYXRhLCB7XG4gICAgICBwcm9wczoge1xuICAgICAgICAuLi50aGlzLiRwcm9wcyxcbiAgICAgICAgY3VzdG9tRmlsdGVyOiB0aGlzLmN1c3RvbUZpbHRlcldpdGhDb2x1bW5zLFxuICAgICAgICBjdXN0b21Tb3J0OiB0aGlzLmN1c3RvbVNvcnRXaXRoSGVhZGVycyxcbiAgICAgICAgaXRlbXNQZXJQYWdlOiB0aGlzLmNvbXB1dGVkSXRlbXNQZXJQYWdlLFxuICAgICAgfSxcbiAgICAgIG9uOiB7XG4gICAgICAgICd1cGRhdGU6b3B0aW9ucyc6ICh2OiBEYXRhT3B0aW9ucywgb2xkOiBEYXRhT3B0aW9ucykgPT4ge1xuICAgICAgICAgIHRoaXMuaW50ZXJuYWxHcm91cEJ5ID0gdi5ncm91cEJ5IHx8IFtdXG4gICAgICAgICAgIWRlZXBFcXVhbCh2LCBvbGQpICYmIHRoaXMuJGVtaXQoJ3VwZGF0ZTpvcHRpb25zJywgdilcbiAgICAgICAgfSxcbiAgICAgICAgJ3VwZGF0ZTpwYWdlJzogKHY6IG51bWJlcikgPT4gdGhpcy4kZW1pdCgndXBkYXRlOnBhZ2UnLCB2KSxcbiAgICAgICAgJ3VwZGF0ZTppdGVtcy1wZXItcGFnZSc6ICh2OiBudW1iZXIpID0+IHRoaXMuJGVtaXQoJ3VwZGF0ZTppdGVtcy1wZXItcGFnZScsIHYpLFxuICAgICAgICAndXBkYXRlOnNvcnQtYnknOiAodjogc3RyaW5nIHwgc3RyaW5nW10pID0+IHRoaXMuJGVtaXQoJ3VwZGF0ZTpzb3J0LWJ5JywgdiksXG4gICAgICAgICd1cGRhdGU6c29ydC1kZXNjJzogKHY6IGJvb2xlYW4gfCBib29sZWFuW10pID0+IHRoaXMuJGVtaXQoJ3VwZGF0ZTpzb3J0LWRlc2MnLCB2KSxcbiAgICAgICAgJ3VwZGF0ZTpncm91cC1ieSc6ICh2OiBzdHJpbmcgfCBzdHJpbmdbXSkgPT4gdGhpcy4kZW1pdCgndXBkYXRlOmdyb3VwLWJ5JywgdiksXG4gICAgICAgICd1cGRhdGU6Z3JvdXAtZGVzYyc6ICh2OiBib29sZWFuIHwgYm9vbGVhbltdKSA9PiB0aGlzLiRlbWl0KCd1cGRhdGU6Z3JvdXAtZGVzYycsIHYpLFxuICAgICAgICBwYWdpbmF0aW9uOiAodjogRGF0YVBhZ2luYXRpb24sIG9sZDogRGF0YVBhZ2luYXRpb24pID0+ICFkZWVwRXF1YWwodiwgb2xkKSAmJiB0aGlzLiRlbWl0KCdwYWdpbmF0aW9uJywgdiksXG4gICAgICAgICdjdXJyZW50LWl0ZW1zJzogKHY6IGFueVtdKSA9PiB7XG4gICAgICAgICAgdGhpcy5pbnRlcm5hbEN1cnJlbnRJdGVtcyA9IHZcbiAgICAgICAgICB0aGlzLiRlbWl0KCdjdXJyZW50LWl0ZW1zJywgdilcbiAgICAgICAgfSxcbiAgICAgICAgJ3BhZ2UtY291bnQnOiAodjogbnVtYmVyKSA9PiB0aGlzLiRlbWl0KCdwYWdlLWNvdW50JywgdiksXG4gICAgICB9LFxuICAgICAgc2NvcGVkU2xvdHM6IHtcbiAgICAgICAgZGVmYXVsdDogdGhpcy5nZW5EZWZhdWx0U2NvcGVkU2xvdCBhcyBhbnksXG4gICAgICB9LFxuICAgIH0pXG4gIH0sXG59KVxuIl19