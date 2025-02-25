// Mixins
import DatePickerTable from './mixins/date-picker-table';
// Utils
import { pad, createNativeLocaleFormatter } from './util';
import mixins from '../../util/mixins';
export default mixins(DatePickerTable
/* @vue/component */
).extend({
    name: 'v-date-picker-month-table',
    computed: {
        formatter() {
            return this.format || createNativeLocaleFormatter(this.currentLocale, { month: 'short', timeZone: 'UTC' }, { start: 5, length: 2 });
        },
    },
    methods: {
        calculateTableDate(delta) {
            return `${parseInt(this.tableDate, 10) + Math.sign(delta || 1)}`;
        },
        genTBody() {
            const children = [];
            const cols = Array(3).fill(null);
            const rows = 12 / cols.length;
            for (let row = 0; row < rows; row++) {
                const tds = cols.map((_, col) => {
                    const month = row * cols.length + col;
                    const date = `${this.displayedYear}-${pad(month + 1)}`;
                    return this.$createElement('td', {
                        key: month,
                    }, [
                        this.genButton(date, false, 'month', this.formatter),
                    ]);
                });
                children.push(this.$createElement('tr', {
                    key: row,
                }, tds));
            }
            return this.$createElement('tbody', children);
        },
    },
    render() {
        return this.genTable('v-date-picker-table v-date-picker-table--month', [
            this.genTBody(),
        ], this.calculateTableDate);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkRhdGVQaWNrZXJNb250aFRhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkRhdGVQaWNrZXIvVkRhdGVQaWNrZXJNb250aFRhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFNBQVM7QUFDVCxPQUFPLGVBQWUsTUFBTSw0QkFBNEIsQ0FBQTtBQUV4RCxRQUFRO0FBQ1IsT0FBTyxFQUFFLEdBQUcsRUFBRSwyQkFBMkIsRUFBRSxNQUFNLFFBQVEsQ0FBQTtBQUN6RCxPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQU10QyxlQUFlLE1BQU0sQ0FDbkIsZUFBZTtBQUNqQixvQkFBb0I7Q0FDbkIsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUsMkJBQTJCO0lBRWpDLFFBQVEsRUFBRTtRQUNSLFNBQVM7WUFDUCxPQUFPLElBQUksQ0FBQyxNQUFNLElBQUksMkJBQTJCLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUNySSxDQUFDO0tBQ0Y7SUFFRCxPQUFPLEVBQUU7UUFDUCxrQkFBa0IsQ0FBRSxLQUFhO1lBQy9CLE9BQU8sR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFBO1FBQ2xFLENBQUM7UUFDRCxRQUFRO1lBQ04sTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFBO1lBQ25CLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDaEMsTUFBTSxJQUFJLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUE7WUFFN0IsS0FBSyxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRTtnQkFDbkMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRTtvQkFDOUIsTUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFBO29CQUNyQyxNQUFNLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxhQUFhLElBQUksR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFBO29CQUN0RCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFO3dCQUMvQixHQUFHLEVBQUUsS0FBSztxQkFDWCxFQUFFO3dCQUNELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztxQkFDckQsQ0FBQyxDQUFBO2dCQUNKLENBQUMsQ0FBQyxDQUFBO2dCQUVGLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUU7b0JBQ3RDLEdBQUcsRUFBRSxHQUFHO2lCQUNULEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQTthQUNUO1lBRUQsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQTtRQUMvQyxDQUFDO0tBQ0Y7SUFFRCxNQUFNO1FBQ0osT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGdEQUFnRCxFQUFFO1lBQ3JFLElBQUksQ0FBQyxRQUFRLEVBQUU7U0FDaEIsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQTtJQUM3QixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gTWl4aW5zXG5pbXBvcnQgRGF0ZVBpY2tlclRhYmxlIGZyb20gJy4vbWl4aW5zL2RhdGUtcGlja2VyLXRhYmxlJ1xuXG4vLyBVdGlsc1xuaW1wb3J0IHsgcGFkLCBjcmVhdGVOYXRpdmVMb2NhbGVGb3JtYXR0ZXIgfSBmcm9tICcuL3V0aWwnXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgVk5vZGUgfSBmcm9tICd2dWUnXG5pbXBvcnQgeyBEYXRlUGlja2VyRm9ybWF0dGVyIH0gZnJvbSAndnVldGlmeS90eXBlcydcblxuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFxuICBEYXRlUGlja2VyVGFibGVcbi8qIEB2dWUvY29tcG9uZW50ICovXG4pLmV4dGVuZCh7XG4gIG5hbWU6ICd2LWRhdGUtcGlja2VyLW1vbnRoLXRhYmxlJyxcblxuICBjb21wdXRlZDoge1xuICAgIGZvcm1hdHRlciAoKTogRGF0ZVBpY2tlckZvcm1hdHRlciB7XG4gICAgICByZXR1cm4gdGhpcy5mb3JtYXQgfHwgY3JlYXRlTmF0aXZlTG9jYWxlRm9ybWF0dGVyKHRoaXMuY3VycmVudExvY2FsZSwgeyBtb250aDogJ3Nob3J0JywgdGltZVpvbmU6ICdVVEMnIH0sIHsgc3RhcnQ6IDUsIGxlbmd0aDogMiB9KVxuICAgIH0sXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGNhbGN1bGF0ZVRhYmxlRGF0ZSAoZGVsdGE6IG51bWJlcikge1xuICAgICAgcmV0dXJuIGAke3BhcnNlSW50KHRoaXMudGFibGVEYXRlLCAxMCkgKyBNYXRoLnNpZ24oZGVsdGEgfHwgMSl9YFxuICAgIH0sXG4gICAgZ2VuVEJvZHkgKCkge1xuICAgICAgY29uc3QgY2hpbGRyZW4gPSBbXVxuICAgICAgY29uc3QgY29scyA9IEFycmF5KDMpLmZpbGwobnVsbClcbiAgICAgIGNvbnN0IHJvd3MgPSAxMiAvIGNvbHMubGVuZ3RoXG5cbiAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHJvd3M7IHJvdysrKSB7XG4gICAgICAgIGNvbnN0IHRkcyA9IGNvbHMubWFwKChfLCBjb2wpID0+IHtcbiAgICAgICAgICBjb25zdCBtb250aCA9IHJvdyAqIGNvbHMubGVuZ3RoICsgY29sXG4gICAgICAgICAgY29uc3QgZGF0ZSA9IGAke3RoaXMuZGlzcGxheWVkWWVhcn0tJHtwYWQobW9udGggKyAxKX1gXG4gICAgICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ3RkJywge1xuICAgICAgICAgICAga2V5OiBtb250aCxcbiAgICAgICAgICB9LCBbXG4gICAgICAgICAgICB0aGlzLmdlbkJ1dHRvbihkYXRlLCBmYWxzZSwgJ21vbnRoJywgdGhpcy5mb3JtYXR0ZXIpLFxuICAgICAgICAgIF0pXG4gICAgICAgIH0pXG5cbiAgICAgICAgY2hpbGRyZW4ucHVzaCh0aGlzLiRjcmVhdGVFbGVtZW50KCd0cicsIHtcbiAgICAgICAgICBrZXk6IHJvdyxcbiAgICAgICAgfSwgdGRzKSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ3Rib2R5JywgY2hpbGRyZW4pXG4gICAgfSxcbiAgfSxcblxuICByZW5kZXIgKCk6IFZOb2RlIHtcbiAgICByZXR1cm4gdGhpcy5nZW5UYWJsZSgndi1kYXRlLXBpY2tlci10YWJsZSB2LWRhdGUtcGlja2VyLXRhYmxlLS1tb250aCcsIFtcbiAgICAgIHRoaXMuZ2VuVEJvZHkoKSxcbiAgICBdLCB0aGlzLmNhbGN1bGF0ZVRhYmxlRGF0ZSlcbiAgfSxcbn0pXG4iXX0=