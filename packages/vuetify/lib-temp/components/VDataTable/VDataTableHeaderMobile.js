import mixins from '../../util/mixins';
import VSelect from '../VSelect/VSelect';
import VChip from '../VChip';
import header from './mixins/header';
import { wrapInArray } from '../../util/helpers';
export default mixins(header).extend({
    name: 'v-data-table-header-mobile',
    props: {
        sortByText: {
            type: String,
            default: '$vuetify.dataTable.sortBy',
        },
    },
    methods: {
        genSortChip(props) {
            const children = [props.item.text];
            const sortIndex = this.options.sortBy.findIndex(k => k === props.item.value);
            const beingSorted = sortIndex >= 0;
            const isDesc = this.options.sortDesc[sortIndex];
            children.push(this.$createElement('div', {
                staticClass: 'v-chip__close',
                class: {
                    sortable: true,
                    active: beingSorted,
                    asc: beingSorted && !isDesc,
                    desc: beingSorted && isDesc,
                },
            }, [this.genSortIcon()]));
            return this.$createElement(VChip, {
                staticClass: 'sortable',
                on: {
                    click: (e) => {
                        e.stopPropagation();
                        this.$emit('sort', props.item.value);
                    },
                },
            }, children);
        },
        genSortSelect(items) {
            return this.$createElement(VSelect, {
                props: {
                    label: this.$vuetify.lang.t(this.sortByText),
                    items,
                    hideDetails: true,
                    multiple: this.options.multiSort,
                    value: this.options.multiSort ? this.options.sortBy : this.options.sortBy[0],
                    menuProps: { closeOnContentClick: true },
                },
                on: {
                    change: (v) => this.$emit('sort', v),
                },
                scopedSlots: {
                    selection: props => this.genSortChip(props),
                },
            });
        },
    },
    render(h) {
        const children = [];
        const header = this.headers.find(h => h.value === 'data-table-select');
        if (header && !this.singleSelect) {
            children.push(this.$createElement('div', {
                class: [
                    'v-data-table-header-mobile__select',
                    ...wrapInArray(header.class),
                ],
                attrs: {
                    width: header.width,
                },
            }, [this.genSelectAll()]));
        }
        const sortHeaders = this.headers
            .filter(h => h.sortable !== false && h.value !== 'data-table-select')
            .map(h => ({
            text: h.text,
            value: h.value,
        }));
        if (!this.disableSort && sortHeaders.length) {
            children.push(this.genSortSelect(sortHeaders));
        }
        const th = h('th', [h('div', { staticClass: 'v-data-table-header-mobile__wrapper' }, children)]);
        const tr = h('tr', [th]);
        return h('thead', {
            staticClass: 'v-data-table-header v-data-table-header-mobile',
        }, [tr]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkRhdGFUYWJsZUhlYWRlck1vYmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZEYXRhVGFibGUvVkRhdGFUYWJsZUhlYWRlck1vYmlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQUN0QyxPQUFPLE9BQU8sTUFBTSxvQkFBb0IsQ0FBQTtBQUN4QyxPQUFPLEtBQUssTUFBTSxVQUFVLENBQUE7QUFDNUIsT0FBTyxNQUFNLE1BQU0saUJBQWlCLENBQUE7QUFDcEMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBRWhELGVBQWUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUNuQyxJQUFJLEVBQUUsNEJBQTRCO0lBRWxDLEtBQUssRUFBRTtRQUNMLFVBQVUsRUFBRTtZQUNWLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLDJCQUEyQjtTQUNyQztLQUNGO0lBRUQsT0FBTyxFQUFFO1FBQ1AsV0FBVyxDQUFFLEtBQVU7WUFDckIsTUFBTSxRQUFRLEdBQStCLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUU5RCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUM1RSxNQUFNLFdBQVcsR0FBRyxTQUFTLElBQUksQ0FBQyxDQUFBO1lBQ2xDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1lBRS9DLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUU7Z0JBQ3ZDLFdBQVcsRUFBRSxlQUFlO2dCQUM1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QUMsQ0FBQTtRQUVMLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUU7WUFDM0MsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUE7U0FDL0M7UUFFRCxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLFdBQVcsRUFBRSxxQ0FBcUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUVoRyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUV4QixPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUU7WUFDaEIsV0FBVyxFQUFFLGdEQUFnRDtTQUM5RCxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtJQUNWLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBWTm9kZSwgVk5vZGVDaGlsZHJlbkFycmF5Q29udGVudHMgfSBmcm9tICd2dWUnXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuaW1wb3J0IFZTZWxlY3QgZnJvbSAnLi4vVlNlbGVjdC9WU2VsZWN0J1xuaW1wb3J0IFZDaGlwIGZyb20gJy4uL1ZDaGlwJ1xuaW1wb3J0IGhlYWRlciBmcm9tICcuL21peGlucy9oZWFkZXInXG5pbXBvcnQgeyB3cmFwSW5BcnJheSB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcblxuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKGhlYWRlcikuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtZGF0YS10YWJsZS1oZWFkZXItbW9iaWxlJyxcblxuICBwcm9wczoge1xuICAgIHNvcnRCeVRleHQ6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICckdnVldGlmeS5kYXRhVGFibGUuc29ydEJ5JyxcbiAgICB9LFxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBnZW5Tb3J0Q2hpcCAocHJvcHM6IGFueSkge1xuICAgICAgY29uc3QgY2hpbGRyZW46IFZOb2RlQ2hpbGRyZW5BcnJheUNvbnRlbnRzID0gW3Byb3BzLml0ZW0udGV4dF1cblxuICAgICAgY29uc3Qgc29ydEluZGV4ID0gdGhpcy5vcHRpb25zLnNvcnRCeS5maW5kSW5kZXgoayA9PiBrID09PSBwcm9wcy5pdGVtLnZhbHVlKVxuICAgICAgY29uc3QgYmVpbmdTb3J0ZWQgPSBzb3J0SW5kZXggPj0gMFxuICAgICAgY29uc3QgaXNEZXNjID0gdGhpcy5vcHRpb25zLnNvcnREZXNjW3NvcnRJbmRleF1cblxuICAgICAgY2hpbGRyZW4ucHVzaCh0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1jaGlwX19jbG9zZScsXG4gICAgICAgIGNsYXNzOiB7XG4gICAgICAgICAgc29ydGFibGU6IHRydWUsXG4gICAgICAgICAgYWN0aXZlOiBiZWluZ1NvcnRlZCxcbiAgICAgICAgICBhc2M6IGJlaW5nU29ydGVkICYmICFpc0Rlc2MsXG4gICAgICAgICAgZGVzYzogYmVpbmdTb3J0ZWQgJiYgaXNEZXNjLFxuICAgICAgICB9LFxuICAgICAgfSwgW3RoaXMuZ2VuU29ydEljb24oKV0pKVxuXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudChWQ2hpcCwge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3NvcnRhYmxlJyxcbiAgICAgICAgb246IHtcbiAgICAgICAgICBjbGljazogKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgIHRoaXMuJGVtaXQoJ3NvcnQnLCBwcm9wcy5pdGVtLnZhbHVlKVxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LCBjaGlsZHJlbilcbiAgICB9LFxuICAgIGdlblNvcnRTZWxlY3QgKGl0ZW1zOiBhbnlbXSkge1xuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVlNlbGVjdCwge1xuICAgICAgICBwcm9wczoge1xuICAgICAgICAgIGxhYmVsOiB0aGlzLiR2dWV0aWZ5LmxhbmcudCh0aGlzLnNvcnRCeVRleHQpLFxuICAgICAgICAgIGl0ZW1zLFxuICAgICAgICAgIGhpZGVEZXRhaWxzOiB0cnVlLFxuICAgICAgICAgIG11bHRpcGxlOiB0aGlzLm9wdGlvbnMubXVsdGlTb3J0LFxuICAgICAgICAgIHZhbHVlOiB0aGlzLm9wdGlvbnMubXVsdGlTb3J0ID8gdGhpcy5vcHRpb25zLnNvcnRCeSA6IHRoaXMub3B0aW9ucy5zb3J0QnlbMF0sXG4gICAgICAgICAgbWVudVByb3BzOiB7IGNsb3NlT25Db250ZW50Q2xpY2s6IHRydWUgfSxcbiAgICAgICAgfSxcbiAgICAgICAgb246IHtcbiAgICAgICAgICBjaGFuZ2U6ICh2OiBzdHJpbmcgfCBzdHJpbmdbXSkgPT4gdGhpcy4kZW1pdCgnc29ydCcsIHYpLFxuICAgICAgICB9LFxuICAgICAgICBzY29wZWRTbG90czoge1xuICAgICAgICAgIHNlbGVjdGlvbjogcHJvcHMgPT4gdGhpcy5nZW5Tb3J0Q2hpcChwcm9wcyksXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyIChoKTogVk5vZGUge1xuICAgIGNvbnN0IGNoaWxkcmVuOiBWTm9kZUNoaWxkcmVuQXJyYXlDb250ZW50cyA9IFtdXG5cbiAgICBjb25zdCBoZWFkZXIgPSB0aGlzLmhlYWRlcnMuZmluZChoID0+IGgudmFsdWUgPT09ICdkYXRhLXRhYmxlLXNlbGVjdCcpXG4gICAgaWYgKGhlYWRlciAmJiAhdGhpcy5zaW5nbGVTZWxlY3QpIHtcbiAgICAgIGNoaWxkcmVuLnB1c2godGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICBjbGFzczogW1xuICAgICAgICAgICd2LWRhdGEtdGFibGUtaGVhZGVyLW1vYmlsZV9fc2VsZWN0JyxcbiAgICAgICAgICAuLi53cmFwSW5BcnJheShoZWFkZXIuY2xhc3MpLFxuICAgICAgICBdLFxuICAgICAgICBhdHRyczoge1xuICAgICAgICAgIHdpZHRoOiBoZWFkZXIud2lkdGgsXG4gICAgICAgIH0sXG4gICAgICB9LCBbdGhpcy5nZW5TZWxlY3RBbGwoKV0pKVxuICAgIH1cblxuICAgIGNvbnN0IHNvcnRIZWFkZXJzID0gdGhpcy5oZWFkZXJzXG4gICAgICAuZmlsdGVyKGggPT4gaC5zb3J0YWJsZSAhPT0gZmFsc2UgJiYgaC52YWx1ZSAhPT0gJ2RhdGEtdGFibGUtc2VsZWN0JylcbiAgICAgIC5tYXAoaCA9PiAoe1xuICAgICAgICB0ZXh0OiBoLnRleHQsXG4gICAgICAgIHZhbHVlOiBoLnZhbHVlLFxuICAgICAgfSkpXG5cbiAgICBpZiAoIXRoaXMuZGlzYWJsZVNvcnQgJiYgc29ydEhlYWRlcnMubGVuZ3RoKSB7XG4gICAgICBjaGlsZHJlbi5wdXNoKHRoaXMuZ2VuU29ydFNlbGVjdChzb3J0SGVhZGVycykpXG4gICAgfVxuXG4gICAgY29uc3QgdGggPSBoKCd0aCcsIFtoKCdkaXYnLCB7IHN0YXRpY0NsYXNzOiAndi1kYXRhLXRhYmxlLWhlYWRlci1tb2JpbGVfX3dyYXBwZXInIH0sIGNoaWxkcmVuKV0pXG5cbiAgICBjb25zdCB0ciA9IGgoJ3RyJywgW3RoXSlcblxuICAgIHJldHVybiBoKCd0aGVhZCcsIHtcbiAgICAgIHN0YXRpY0NsYXNzOiAndi1kYXRhLXRhYmxlLWhlYWRlciB2LWRhdGEtdGFibGUtaGVhZGVyLW1vYmlsZScsXG4gICAgfSwgW3RyXSlcbiAgfSxcbn0pXG4iXX0=