import mixins from '../../util/mixins';
import header from './mixins/header';
import { wrapInArray, convertToUnit } from '../../util/helpers';
export default mixins(header).extend({
    name: 'v-data-table-header-desktop',
    methods: {
        genGroupByToggle(header) {
            return this.$createElement('span', {
                on: {
                    click: (e) => {
                        e.stopPropagation();
                        this.$emit('group', header.value);
                    },
                },
            }, ['group']);
        },
        getAria(beingSorted, isDesc) {
            const $t = (key) => this.$vuetify.lang.t(`$vuetify.dataTable.ariaLabel.${key}`);
            let ariaSort = 'none';
            let ariaLabel = [
                $t('sortNone'),
                $t('activateAscending'),
            ];
            if (!beingSorted) {
                return { ariaSort, ariaLabel: ariaLabel.join(' ') };
            }
            if (isDesc) {
                ariaSort = 'descending';
                ariaLabel = [
                    $t('sortDescending'),
                    $t(this.options.mustSort ? 'activateAscending' : 'activateNone'),
                ];
            }
            else {
                ariaSort = 'ascending';
                ariaLabel = [
                    $t('sortAscending'),
                    $t('activateDescending'),
                ];
            }
            return { ariaSort, ariaLabel: ariaLabel.join(' ') };
        },
        genHeader(header) {
            const data = {
                attrs: {
                    role: 'columnheader',
                    scope: 'col',
                    'aria-label': header.text || '',
                },
                style: {
                    width: convertToUnit(header.width),
                    minWidth: convertToUnit(header.width),
                },
                class: [
                    `text-${header.align || 'start'}`,
                    ...wrapInArray(header.class),
                    header.divider && 'v-data-table__divider',
                ],
                on: {},
            };
            const children = [];
            if (header.value === 'data-table-select' && !this.singleSelect) {
                return this.$createElement('th', data, [this.genSelectAll()]);
            }
            children.push(this.$scopedSlots[header.value]
                ? this.$scopedSlots[header.value]({ header })
                : this.$createElement('span', [header.text]));
            if (!this.disableSort && (header.sortable || !header.hasOwnProperty('sortable'))) {
                data.on['click'] = () => this.$emit('sort', header.value);
                const sortIndex = this.options.sortBy.findIndex(k => k === header.value);
                const beingSorted = sortIndex >= 0;
                const isDesc = this.options.sortDesc[sortIndex];
                data.class.push('sortable');
                const { ariaLabel, ariaSort } = this.getAria(beingSorted, isDesc);
                data.attrs['aria-label'] += `${header.text ? ': ' : ''}${ariaLabel}`;
                data.attrs['aria-sort'] = ariaSort;
                if (beingSorted) {
                    data.class.push('active');
                    data.class.push(isDesc ? 'desc' : 'asc');
                }
                if (header.align === 'end')
                    children.unshift(this.genSortIcon());
                else
                    children.push(this.genSortIcon());
                if (this.options.multiSort && beingSorted) {
                    children.push(this.$createElement('span', { class: 'v-data-table-header__sort-badge' }, [String(sortIndex + 1)]));
                }
            }
            if (this.showGroupBy && header.groupable !== false)
                children.push(this.genGroupByToggle(header));
            return this.$createElement('th', data, children);
        },
    },
    render() {
        return this.$createElement('thead', {
            staticClass: 'v-data-table-header',
        }, [
            this.$createElement('tr', this.headers.map(header => this.genHeader(header))),
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkRhdGFUYWJsZUhlYWRlckRlc2t0b3AuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WRGF0YVRhYmxlL1ZEYXRhVGFibGVIZWFkZXJEZXNrdG9wLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBQ3RDLE9BQU8sTUFBTSxNQUFNLGlCQUFpQixDQUFBO0FBQ3BDLE9BQU8sRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFHL0QsZUFBZSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDO0lBQ25DLElBQUksRUFBRSw2QkFBNkI7SUFFbkMsT0FBTyxFQUFFO1FBQ1AsZ0JBQWdCLENBQUUsTUFBdUI7WUFDdkMsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRTtnQkFDakMsRUFBRSxFQUFFO29CQUNGLEtBQUssRUFBRSxDQUFDLENBQWEsRUFBRSxFQUFFO3dCQUN2QixDQUFDLENBQUMsZUFBZSxFQUFFLENBQUE7d0JBQ25CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQTtvQkFDbkMsQ0FBQztpQkFDRjthQUNGLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO1FBQ2YsQ0FBQztRQUNELE9BQU8sQ0FBRSxXQUFvQixFQUFFLE1BQWU7WUFDNUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFXLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxnQ0FBZ0MsR0FBRyxFQUFFLENBQUMsQ0FBQTtZQUV2RixJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUE7WUFDckIsSUFBSSxTQUFTLEdBQUc7Z0JBQ2QsRUFBRSxDQUFDLFVBQVUsQ0FBQztnQkFDZCxFQUFFLENBQUMsbUJBQW1CLENBQUM7YUFDeEIsQ0FB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QUFNLENBQUMsU0FBUyxLQUFLLEtBQUs7Z0JBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtZQUVoRyxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQTtRQUNsRCxDQUFDO0tBQ0Y7SUFFRCxNQUFNO1FBQ0osT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRTtZQUNsQyxXQUFXLEVBQUUscUJBQXFCO1NBQ25DLEVBQUU7WUFDRCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztTQUM5RSxDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gSGVscGVyc1xuaW1wb3J0IHsgVk5vZGUsIFZOb2RlRGF0YSB9IGZyb20gJ3Z1ZSdcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5pbXBvcnQgaGVhZGVyIGZyb20gJy4vbWl4aW5zL2hlYWRlcidcbmltcG9ydCB7IHdyYXBJbkFycmF5LCBjb252ZXJ0VG9Vbml0IH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuaW1wb3J0IHsgRGF0YVRhYmxlSGVhZGVyIH0gZnJvbSAndnVldGlmeS90eXBlcydcblxuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKGhlYWRlcikuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtZGF0YS10YWJsZS1oZWFkZXItZGVza3RvcCcsXG5cbiAgbWV0aG9kczoge1xuICAgIGdlbkdyb3VwQnlUb2dnbGUgKGhlYWRlcjogRGF0YVRhYmxlSGVhZGVyKSB7XG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnc3BhbicsIHtcbiAgICAgICAgb246IHtcbiAgICAgICAgICBjbGljazogKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgIHRoaXMuJGVtaXQoJ2dyb3VwJywgaGVhZGVyLnZhbHVlKVxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LCBbJ2dyb3VwJ10pXG4gICAgfSxcbiAgICBnZXRBcmlhIChiZWluZ1NvcnRlZDogYm9vbGVhbiwgaXNEZXNjOiBib29sZWFuKSB7XG4gICAgICBjb25zdCAkdCA9IChrZXk6IHN0cmluZykgPT4gdGhpcy4kdnVldGlmeS5sYW5nLnQoYCR2dWV0aWZ5LmRhdGFUYWJsZS5hcmlhTGFiZWwuJHtrZXl9YClcblxuICAgICAgbGV0IGFyaWFTb3J0ID0gJ25vbmUnXG4gICAgICBsZXQgYXJpYUxhYmVsID0gW1xuICAgICAgICAkdCgnc29ydE5vbmUnKSxcbiAgICAgICAgJHQoJ2FjdGl2YXRlQXNjZW5kaW5nJyksXG4gICAgICBdXG5cbiAgICAgIGlmICghYmVpbmdTb3J0ZWQpIHtcbiAgICAgICAgcmV0dXJuIHsgYXJpYVNvcnQsIGFyaWFMYWJlbDogYXJpYUxhYmVsLmpvaW4oJyAnKSB9XG4gICAgICB9XG5cbiAgICAgIGlmIChpc0Rlc2MpIHtcbiAgICAgICAgYXJpYVNvcnQgPSAnZGVzY2VuZGluZydcbiAgICAgICAgYXJpYUxhYmVsID0gW1xuICAgICAgICAgICR0KCdzb3J0RGVzY2VuZGluZycpLFxuICAgICAgICAgICR0KHRoaXMub3B0aW9ucy5tdXN0U29ydCA/ICdhY3RpdmF0ZUFzY2VuZGluZycgOiAnYWN0aXZhdGVOb25lJyksXG4gICAgICAgIF1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFyaWFTb3J0ID0gJ2FzY2VuZGluZydcbiAgICAgICAgYXJpYUxhYmVsID0gW1xuICAgICAgICAgICR0KCdzb3J0QXNjZW5kaW5nJyksXG4gICAgICAgICAgJHQoJ2FjdGl2YXRlRGVzY2VuZGluZycpLFxuICAgICAgICBdXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7IGFyaWFTb3J0LCBhcmlhTGFiZWw6IGFyaWFMYWJlbC5qb2luKCcgJykgfVxuICAgIH0sXG4gICAgZ2VuSGVhZGVyIChoZWFkZXI6IERhdGFUYWJsZUhlYWRlcikge1xuICAgICAgY29uc3QgZGF0YTogUmVxdWlyZWQ8UGljazxWTm9kZURhdGEsICdhdHRycycgfCAnb24nIHwgJ2NsYXNzJyB8ICdzdHlsZSc+PiA9IHtcbiAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICByb2xlOiAnY29sdW1uaGVhZGVyJyxcbiAgICAgICAgICBzY29wZTogJ2NvbCcsXG4gICAgICAgICAgJ2FyaWEtbGFiZWwnOiBoZWFkZXIudGV4dCB8fCAnJyxcbiAgICAgICAgfSxcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICB3aWR0aDogY29udmVydFRvVW5pdChoZWFkZXIud2lkdGgpLFxuICAgICAgICAgIG1pbldpZHRoOiBjb252ZXJ0VG9Vbml0KGhlYWRlci53aWR0aCksXG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzOiBbXG4gICAgICAgICAgYHRleHQtJHtoZWFkZXIuYWxpZ24gfHwgJ3N0YXJ0J31gLFxuICAgICAgICAgIC4uLndyYXBJbkFycmF5KGhlYWRlci5jbGFzcyksXG4gICAgICAgICAgaGVhZGVyLmRpdmlkZXIgJiYgJ3YtZGF0YS10YWJsZV9fZGl2aWRlcicsXG4gICAgICAgIF0sXG4gICAgICAgIG9uOiB7fSxcbiAgICAgIH1cbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gW11cblxuICAgICAgaWYgKGhlYWRlci52YWx1ZSA9PT0gJ2RhdGEtdGFibGUtc2VsZWN0JyAmJiAhdGhpcy5zaW5nbGVTZWxlY3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ3RoJywgZGF0YSwgW3RoaXMuZ2VuU2VsZWN0QWxsKCldKVxuICAgICAgfVxuXG4gICAgICBjaGlsZHJlbi5wdXNoKFxuICAgICAgICB0aGlzLiRzY29wZWRTbG90c1toZWFkZXIudmFsdWVdXG4gICAgICAgICAgPyB0aGlzLiRzY29wZWRTbG90c1toZWFkZXIudmFsdWVdISh7IGhlYWRlciB9KVxuICAgICAgICAgIDogdGhpcy4kY3JlYXRlRWxlbWVudCgnc3BhbicsIFtoZWFkZXIudGV4dF0pXG4gICAgICApXG5cbiAgICAgIGlmICghdGhpcy5kaXNhYmxlU29ydCAmJiAoaGVhZGVyLnNvcnRhYmxlIHx8ICFoZWFkZXIuaGFzT3duUHJvcGVydHkoJ3NvcnRhYmxlJykpKSB7XG4gICAgICAgIGRhdGEub25bJ2NsaWNrJ10gPSAoKSA9PiB0aGlzLiRlbWl0KCdzb3J0JywgaGVhZGVyLnZhbHVlKVxuXG4gICAgICAgIGNvbnN0IHNvcnRJbmRleCA9IHRoaXMub3B0aW9ucy5zb3J0QnkuZmluZEluZGV4KGsgPT4gayA9PT0gaGVhZGVyLnZhbHVlKVxuICAgICAgICBjb25zdCBiZWluZ1NvcnRlZCA9IHNvcnRJbmRleCA+PSAwXG4gICAgICAgIGNvbnN0IGlzRGVzYyA9IHRoaXMub3B0aW9ucy5zb3J0RGVzY1tzb3J0SW5kZXhdXG5cbiAgICAgICAgZGF0YS5jbGFzcy5wdXNoKCdzb3J0YWJsZScpXG5cbiAgICAgICAgY29uc3QgeyBhcmlhTGFiZWwsIGFyaWFTb3J0IH0gPSB0aGlzLmdldEFyaWEoYmVpbmdTb3J0ZWQsIGlzRGVzYylcblxuICAgICAgICBkYXRhLmF0dHJzWydhcmlhLWxhYmVsJ10gKz0gYCR7aGVhZGVyLnRleHQgPyAnOiAnIDogJyd9JHthcmlhTGFiZWx9YFxuICAgICAgICBkYXRhLmF0dHJzWydhcmlhLXNvcnQnXSA9IGFyaWFTb3J0XG5cbiAgICAgICAgaWYgKGJlaW5nU29ydGVkKSB7XG4gICAgICAgICAgZGF0YS5jbGFzcy5wdXNoKCdhY3RpdmUnKVxuICAgICAgICAgIGRhdGEuY2xhc3MucHVzaChpc0Rlc2MgPyAnZGVzYycgOiAnYXNjJylcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoZWFkZXIuYWxpZ24gPT09ICdlbmQnKSBjaGlsZHJlbi51bnNoaWZ0KHRoaXMuZ2VuU29ydEljb24oKSlcbiAgICAgICAgZWxzZSBjaGlsZHJlbi5wdXNoKHRoaXMuZ2VuU29ydEljb24oKSlcblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLm11bHRpU29ydCAmJiBiZWluZ1NvcnRlZCkge1xuICAgICAgICAgIGNoaWxkcmVuLnB1c2godGhpcy4kY3JlYXRlRWxlbWVudCgnc3BhbicsIHsgY2xhc3M6ICd2LWRhdGEtdGFibGUtaGVhZGVyX19zb3J0LWJhZGdlJyB9LCBbU3RyaW5nKHNvcnRJbmRleCArIDEpXSkpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuc2hvd0dyb3VwQnkgJiYgaGVhZGVyLmdyb3VwYWJsZSAhPT0gZmFsc2UpIGNoaWxkcmVuLnB1c2godGhpcy5nZW5Hcm91cEJ5VG9nZ2xlKGhlYWRlcikpXG5cbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCd0aCcsIGRhdGEsIGNoaWxkcmVuKVxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyICgpOiBWTm9kZSB7XG4gICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ3RoZWFkJywge1xuICAgICAgc3RhdGljQ2xhc3M6ICd2LWRhdGEtdGFibGUtaGVhZGVyJyxcbiAgICB9LCBbXG4gICAgICB0aGlzLiRjcmVhdGVFbGVtZW50KCd0cicsIHRoaXMuaGVhZGVycy5tYXAoaGVhZGVyID0+IHRoaXMuZ2VuSGVhZGVyKGhlYWRlcikpKSxcbiAgICBdKVxuICB9LFxufSlcbiJdfQ==