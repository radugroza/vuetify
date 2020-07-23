import Vue from 'vue';
/**
 * SSRBootable
 *
 * @mixin
 *
 * Used in layout components (drawer, toolbar, content)
 * to avoid an entry animation when using SSR
 */
export default Vue.extend({
    name: 'ssr-bootable',
    data: () => ({
        isBooted: false,
    }),
    mounted() {
        // Use setAttribute instead of dataset
        // because dataset does not work well
        // with unit tests
        window.requestAnimationFrame(() => {
            this.$el.setAttribute('data-booted', 'true');
            this.isBooted = true;
        });
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL3Nzci1ib290YWJsZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEdBQUcsTUFBTSxLQUFLLENBQUE7QUFFckI7Ozs7Ozs7R0FPRztBQUNILGVBQWUsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUN4QixJQUFJLEVBQUUsY0FBYztJQUVwQixJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNYLFFBQVEsRUFBRSxLQUFLO0tBQ2hCLENBQUM7SUFFRixPQUFPO1FBQ0wsc0NBQXNDO1FBQ3RDLHFDQUFxQztRQUNyQyxrQkFBa0I7UUFDbEIsTUFBTSxDQUFDLHFCQUFxQixDQUFDLEdBQUcsRUFBRTtZQUNoQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUE7WUFDNUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUE7UUFDdEIsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZ1ZSBmcm9tICd2dWUnXG5cbi8qKlxuICogU1NSQm9vdGFibGVcbiAqXG4gKiBAbWl4aW5cbiAqXG4gKiBVc2VkIGluIGxheW91dCBjb21wb25lbnRzIChkcmF3ZXIsIHRvb2xiYXIsIGNvbnRlbnQpXG4gKiB0byBhdm9pZCBhbiBlbnRyeSBhbmltYXRpb24gd2hlbiB1c2luZyBTU1JcbiAqL1xuZXhwb3J0IGRlZmF1bHQgVnVlLmV4dGVuZCh7XG4gIG5hbWU6ICdzc3ItYm9vdGFibGUnLFxuXG4gIGRhdGE6ICgpID0+ICh7XG4gICAgaXNCb290ZWQ6IGZhbHNlLFxuICB9KSxcblxuICBtb3VudGVkICgpIHtcbiAgICAvLyBVc2Ugc2V0QXR0cmlidXRlIGluc3RlYWQgb2YgZGF0YXNldFxuICAgIC8vIGJlY2F1c2UgZGF0YXNldCBkb2VzIG5vdCB3b3JrIHdlbGxcbiAgICAvLyB3aXRoIHVuaXQgdGVzdHNcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHRoaXMuJGVsLnNldEF0dHJpYnV0ZSgnZGF0YS1ib290ZWQnLCAndHJ1ZScpXG4gICAgICB0aGlzLmlzQm9vdGVkID0gdHJ1ZVxuICAgIH0pXG4gIH0sXG59KVxuIl19