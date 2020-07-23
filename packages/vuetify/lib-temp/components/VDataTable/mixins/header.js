import VIcon from '../../VIcon';
import VSimpleCheckbox from '../../VCheckbox/VSimpleCheckbox';
import ripple from '../../../directives/ripple';
import mixins from '../../../util/mixins';
export default mixins().extend({
    // https://github.com/vuejs/vue/issues/6872
    directives: {
        ripple,
    },
    props: {
        headers: {
            type: Array,
            default: () => ([]),
        },
        options: {
            type: Object,
            default: () => ({
                page: 1,
                itemsPerPage: 10,
                sortBy: [],
                sortDesc: [],
                groupBy: [],
                groupDesc: [],
                multiSort: false,
                mustSort: false,
            }),
        },
        sortIcon: {
            type: String,
            default: '$sort',
        },
        everyItem: Boolean,
        someItems: Boolean,
        showGroupBy: Boolean,
        singleSelect: Boolean,
        disableSort: Boolean,
    },
    methods: {
        genSelectAll() {
            const data = {
                props: {
                    value: this.everyItem,
                    indeterminate: !this.everyItem && this.someItems,
                },
                on: {
                    input: (v) => this.$emit('toggle-select-all', v),
                },
            };
            if (this.$scopedSlots['data-table-select']) {
                return this.$scopedSlots['data-table-select'](data);
            }
            return this.$createElement(VSimpleCheckbox, {
                staticClass: 'v-data-table__checkbox',
                ...data,
            });
        },
        genSortIcon() {
            return this.$createElement(VIcon, {
                staticClass: 'v-data-table-header__icon',
                props: {
                    size: 18,
                },
            }, [this.sortIcon]);
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkRhdGFUYWJsZS9taXhpbnMvaGVhZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sS0FBSyxNQUFNLGFBQWEsQ0FBQTtBQUMvQixPQUFPLGVBQWUsTUFBTSxpQ0FBaUMsQ0FBQTtBQUM3RCxPQUFPLE1BQU0sTUFBTSw0QkFBNEIsQ0FBQTtBQUcvQyxPQUFPLE1BQU0sTUFBTSxzQkFBc0IsQ0FBQTtBQVN6QyxlQUFlLE1BQU0sRUFBVyxDQUFDLE1BQU0sQ0FBQztJQUN0QywyQ0FBMkM7SUFDM0MsVUFBVSxFQUFFO1FBQ1YsTUFBTTtLQUNQO0lBRUQsS0FBSyxFQUFFO1FBQ0wsT0FBTyxFQUFFO1lBQ1AsSUFBSSxFQUFFLEtBQW9DO1lBQzFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztTQUNwQjtRQUNELE9BQU8sRUFBRTtZQUNQLElBQUksRUFBRSxNQUErQjtZQUNyQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztnQkFDZCxJQUFJLEVBQUUsQ0FBQztnQkFDUCxZQUFZLEVBQUUsRUFBRTtnQkFDaEIsTUFBTSxFQUFFLEVBQUU7Z0JBQ1YsUUFBUSxFQUFFLEVBQUU7Z0JBQ1osT0FBTyxFQUFFLEVBQUU7Z0JBQ1gsU0FBUyxFQUFFLEVBQUU7Z0JBQ2IsU0FBUyxFQUFFLEtBQUs7Z0JBQ2hCLFFBQVEsRUFBRSxLQUFLO2FBQ2hCLENBQUM7U0FDSDtRQUNELFFBQVEsRUFBRTtZQUNSLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLE9BQU87U0FDakI7UUFDRCxTQUFTLEVBQUUsT0FBTztRQUNsQixTQUFTLEVBQUUsT0FBTztRQUNsQixXQUFXLEVBQUUsT0FBTztRQUNwQixZQUFZLEVBQUUsT0FBTztRQUNyQixXQUFXLEVBQUUsT0FBTztLQUNyQjtJQUVELE9BQU8sRUFBRTtRQUNQLFlBQVk7WUFDVixNQUFNLElBQUksR0FBRztnQkFDWCxLQUFLLEVBQUU7b0JBQ0wsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTO29CQUNyQixhQUFhLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTO2lCQUNqRDtnQkFDRCxFQUFFLEVBQUU7b0JBQ0YsS0FBSyxFQUFFLENBQUMsQ0FBVSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQztpQkFDMUQ7YUFDRixDQUFBO1lBRUQsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLG1CQUFtQixDQUFDLEVBQUU7Z0JBQzFDLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsQ0FBRSxDQUFDLElBQUksQ0FBQyxDQUFBO2FBQ3JEO1lBRUQsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLGVBQWUsRUFBRTtnQkFDMUMsV0FBVyxFQUFFLHdCQUF3QjtnQkFDckMsR0FBRyxJQUFJO2FBQ1IsQ0FBQyxDQUFBO1FBQ0osQ0FBQztRQUNELFdBQVc7WUFDVCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFO2dCQUNoQyxXQUFXLEVBQUUsMkJBQTJCO2dCQUN4QyxLQUFLLEVBQUU7b0JBQ0wsSUFBSSxFQUFFLEVBQUU7aUJBQ1Q7YUFDRixFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUE7UUFDckIsQ0FBQztLQUNGO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVkRhdGFUYWJsZSB9IGZyb20gJy4uLydcbmltcG9ydCBWSWNvbiBmcm9tICcuLi8uLi9WSWNvbidcbmltcG9ydCBWU2ltcGxlQ2hlY2tib3ggZnJvbSAnLi4vLi4vVkNoZWNrYm94L1ZTaW1wbGVDaGVja2JveCdcbmltcG9ydCByaXBwbGUgZnJvbSAnLi4vLi4vLi4vZGlyZWN0aXZlcy9yaXBwbGUnXG5cbmltcG9ydCBWdWUsIHsgUHJvcFR5cGUgfSBmcm9tICd2dWUnXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uLy4uL3V0aWwvbWl4aW5zJ1xuaW1wb3J0IHsgRGF0YU9wdGlvbnMsIERhdGFUYWJsZUhlYWRlciB9IGZyb20gJ3Z1ZXRpZnkvdHlwZXMnXG5cbnR5cGUgVkRhdGFUYWJsZUluc3RhbmNlID0gSW5zdGFuY2VUeXBlPHR5cGVvZiBWRGF0YVRhYmxlPlxuXG5pbnRlcmZhY2Ugb3B0aW9ucyBleHRlbmRzIFZ1ZSB7XG4gIGRhdGFUYWJsZTogVkRhdGFUYWJsZUluc3RhbmNlXG59XG5cbmV4cG9ydCBkZWZhdWx0IG1peGluczxvcHRpb25zPigpLmV4dGVuZCh7XG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS92dWVqcy92dWUvaXNzdWVzLzY4NzJcbiAgZGlyZWN0aXZlczoge1xuICAgIHJpcHBsZSxcbiAgfSxcblxuICBwcm9wczoge1xuICAgIGhlYWRlcnM6IHtcbiAgICAgIHR5cGU6IEFycmF5IGFzIFByb3BUeXBlPERhdGFUYWJsZUhlYWRlcltdPixcbiAgICAgIGRlZmF1bHQ6ICgpID0+IChbXSksXG4gICAgfSxcbiAgICBvcHRpb25zOiB7XG4gICAgICB0eXBlOiBPYmplY3QgYXMgUHJvcFR5cGU8RGF0YU9wdGlvbnM+LFxuICAgICAgZGVmYXVsdDogKCkgPT4gKHtcbiAgICAgICAgcGFnZTogMSxcbiAgICAgICAgaXRlbXNQZXJQYWdlOiAxMCxcbiAgICAgICAgc29ydEJ5OiBbXSxcbiAgICAgICAgc29ydERlc2M6IFtdLFxuICAgICAgICBncm91cEJ5OiBbXSxcbiAgICAgICAgZ3JvdXBEZXNjOiBbXSxcbiAgICAgICAgbXVsdGlTb3J0OiBmYWxzZSxcbiAgICAgICAgbXVzdFNvcnQ6IGZhbHNlLFxuICAgICAgfSksXG4gICAgfSxcbiAgICBzb3J0SWNvbjoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJyRzb3J0JyxcbiAgICB9LFxuICAgIGV2ZXJ5SXRlbTogQm9vbGVhbixcbiAgICBzb21lSXRlbXM6IEJvb2xlYW4sXG4gICAgc2hvd0dyb3VwQnk6IEJvb2xlYW4sXG4gICAgc2luZ2xlU2VsZWN0OiBCb29sZWFuLFxuICAgIGRpc2FibGVTb3J0OiBCb29sZWFuLFxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBnZW5TZWxlY3RBbGwgKCkge1xuICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICB2YWx1ZTogdGhpcy5ldmVyeUl0ZW0sXG4gICAgICAgICAgaW5kZXRlcm1pbmF0ZTogIXRoaXMuZXZlcnlJdGVtICYmIHRoaXMuc29tZUl0ZW1zLFxuICAgICAgICB9LFxuICAgICAgICBvbjoge1xuICAgICAgICAgIGlucHV0OiAodjogYm9vbGVhbikgPT4gdGhpcy4kZW1pdCgndG9nZ2xlLXNlbGVjdC1hbGwnLCB2KSxcbiAgICAgICAgfSxcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuJHNjb3BlZFNsb3RzWydkYXRhLXRhYmxlLXNlbGVjdCddKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiRzY29wZWRTbG90c1snZGF0YS10YWJsZS1zZWxlY3QnXSEoZGF0YSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVlNpbXBsZUNoZWNrYm94LCB7XG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1kYXRhLXRhYmxlX19jaGVja2JveCcsXG4gICAgICAgIC4uLmRhdGEsXG4gICAgICB9KVxuICAgIH0sXG4gICAgZ2VuU29ydEljb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkljb24sIHtcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWRhdGEtdGFibGUtaGVhZGVyX19pY29uJyxcbiAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICBzaXplOiAxOCxcbiAgICAgICAgfSxcbiAgICAgIH0sIFt0aGlzLnNvcnRJY29uXSlcbiAgICB9LFxuICB9LFxufSlcbiJdfQ==