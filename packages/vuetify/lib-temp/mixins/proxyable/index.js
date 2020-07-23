import Vue from 'vue';
export function factory(prop = 'value', event = 'change') {
    return Vue.extend({
        name: 'proxyable',
        model: {
            prop,
            event,
        },
        props: {
            [prop]: {
                required: false,
            },
        },
        data() {
            return {
                internalLazyValue: this[prop],
            };
        },
        computed: {
            internalValue: {
                get() {
                    return this.internalLazyValue;
                },
                set(val) {
                    if (val === this.internalLazyValue)
                        return;
                    this.internalLazyValue = val;
                    this.$emit(event, val);
                },
            },
        },
        watch: {
            [prop](val) {
                this.internalLazyValue = val;
            },
        },
    });
}
/* eslint-disable-next-line no-redeclare */
const Proxyable = factory();
export default Proxyable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL3Byb3h5YWJsZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEdBQXVCLE1BQU0sS0FBSyxDQUFBO0FBU3pDLE1BQU0sVUFBVSxPQUFPLENBQ3JCLElBQUksR0FBRyxPQUFPLEVBQ2QsS0FBSyxHQUFHLFFBQVE7SUFFaEIsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQ2hCLElBQUksRUFBRSxXQUFXO1FBRWpCLEtBQUssRUFBRTtZQUNMLElBQUk7WUFDSixLQUFLO1NBQ047UUFFRCxLQUFLLEVBQUU7WUFDTCxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNOLFFBQVEsRUFBRSxLQUFLO2FBQ2hCO1NBQ0Y7UUFFRCxJQUFJO1lBQ0YsT0FBTztnQkFDTCxpQkFBaUIsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFZO2FBQ3pDLENBQUE7UUFDSCxDQUFDO1FBRUQsUUFBUSxFQUFFO1lBQ1IsYUFBYSxFQUFFO2dCQUNiLEdBQUc7b0JBQ0QsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUE7Z0JBQy9CLENBQUM7Z0JBQ0QsR0FBRyxDQUFFLEdBQVE7b0JBQ1gsSUFBSSxHQUFHLEtBQUssSUFBSSxDQUFDLGlCQUFpQjt3QkFBRSxPQUFNO29CQUUxQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsR0FBRyxDQUFBO29CQUU1QixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQTtnQkFDeEIsQ0FBQzthQUNGO1NBQ0Y7UUFFRCxLQUFLLEVBQUU7WUFDTCxDQUFDLElBQUksQ0FBQyxDQUFFLEdBQUc7Z0JBQ1QsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEdBQUcsQ0FBQTtZQUM5QixDQUFDO1NBQ0Y7S0FDRixDQUFDLENBQUE7QUFDSixDQUFDO0FBRUQsMkNBQTJDO0FBQzNDLE1BQU0sU0FBUyxHQUFHLE9BQU8sRUFBRSxDQUFBO0FBRTNCLGVBQWUsU0FBUyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZ1ZSwgeyBWdWVDb25zdHJ1Y3RvciB9IGZyb20gJ3Z1ZSdcblxuLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVzZS1iZWZvcmUtZGVmaW5lICovXG5leHBvcnQgdHlwZSBQcm94eWFibGU8VCBleHRlbmRzIHN0cmluZyA9ICd2YWx1ZSc+ID0gVnVlQ29uc3RydWN0b3I8VnVlICYge1xuICBpbnRlcm5hbExhenlWYWx1ZTogdW5rbm93blxuICBpbnRlcm5hbFZhbHVlOiB1bmtub3duXG59ICYgUmVjb3JkPFQsIGFueT4+XG5cbmV4cG9ydCBmdW5jdGlvbiBmYWN0b3J5PFQgZXh0ZW5kcyBzdHJpbmcgPSAndmFsdWUnPiAocHJvcD86IFQsIGV2ZW50Pzogc3RyaW5nKTogUHJveHlhYmxlPFQ+XG5leHBvcnQgZnVuY3Rpb24gZmFjdG9yeSAoXG4gIHByb3AgPSAndmFsdWUnLFxuICBldmVudCA9ICdjaGFuZ2UnXG4pIHtcbiAgcmV0dXJuIFZ1ZS5leHRlbmQoe1xuICAgIG5hbWU6ICdwcm94eWFibGUnLFxuXG4gICAgbW9kZWw6IHtcbiAgICAgIHByb3AsXG4gICAgICBldmVudCxcbiAgICB9LFxuXG4gICAgcHJvcHM6IHtcbiAgICAgIFtwcm9wXToge1xuICAgICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICB9LFxuICAgIH0sXG5cbiAgICBkYXRhICgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGludGVybmFsTGF6eVZhbHVlOiB0aGlzW3Byb3BdIGFzIHVua25vd24sXG4gICAgICB9XG4gICAgfSxcblxuICAgIGNvbXB1dGVkOiB7XG4gICAgICBpbnRlcm5hbFZhbHVlOiB7XG4gICAgICAgIGdldCAoKTogdW5rbm93biB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxMYXp5VmFsdWVcbiAgICAgICAgfSxcbiAgICAgICAgc2V0ICh2YWw6IGFueSkge1xuICAgICAgICAgIGlmICh2YWwgPT09IHRoaXMuaW50ZXJuYWxMYXp5VmFsdWUpIHJldHVyblxuXG4gICAgICAgICAgdGhpcy5pbnRlcm5hbExhenlWYWx1ZSA9IHZhbFxuXG4gICAgICAgICAgdGhpcy4kZW1pdChldmVudCwgdmFsKVxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuXG4gICAgd2F0Y2g6IHtcbiAgICAgIFtwcm9wXSAodmFsKSB7XG4gICAgICAgIHRoaXMuaW50ZXJuYWxMYXp5VmFsdWUgPSB2YWxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSlcbn1cblxuLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlZGVjbGFyZSAqL1xuY29uc3QgUHJveHlhYmxlID0gZmFjdG9yeSgpXG5cbmV4cG9ydCBkZWZhdWx0IFByb3h5YWJsZVxuIl19