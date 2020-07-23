import './VBottomSheet.sass';
// Extensions
import VDialog from '../VDialog/VDialog';
/* @vue/component */
export default VDialog.extend({
    name: 'v-bottom-sheet',
    props: {
        inset: Boolean,
        maxWidth: {
            type: [String, Number],
            default: 'auto',
        },
        transition: {
            type: String,
            default: 'bottom-sheet-transition',
        },
    },
    computed: {
        classes() {
            return {
                ...VDialog.options.computed.classes.call(this),
                'v-bottom-sheet': true,
                'v-bottom-sheet--inset': this.inset,
            };
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkJvdHRvbVNoZWV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkJvdHRvbVNoZWV0L1ZCb3R0b21TaGVldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLHFCQUFxQixDQUFBO0FBRTVCLGFBQWE7QUFDYixPQUFPLE9BQU8sTUFBTSxvQkFBb0IsQ0FBQTtBQUV4QyxvQkFBb0I7QUFDcEIsZUFBZSxPQUFPLENBQUMsTUFBTSxDQUFDO0lBQzVCLElBQUksRUFBRSxnQkFBZ0I7SUFFdEIsS0FBSyxFQUFFO1FBQ0wsS0FBSyxFQUFFLE9BQU87UUFDZCxRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxNQUFNO1NBQ2hCO1FBQ0QsVUFBVSxFQUFFO1lBQ1YsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUseUJBQXlCO1NBQ25DO0tBQ0Y7SUFFRCxRQUFRLEVBQUU7UUFDUixPQUFPO1lBQ0wsT0FBTztnQkFDTCxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUM5QyxnQkFBZ0IsRUFBRSxJQUFJO2dCQUN0Qix1QkFBdUIsRUFBRSxJQUFJLENBQUMsS0FBSzthQUNwQyxDQUFBO1FBQ0gsQ0FBQztLQUNGO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuL1ZCb3R0b21TaGVldC5zYXNzJ1xuXG4vLyBFeHRlbnNpb25zXG5pbXBvcnQgVkRpYWxvZyBmcm9tICcuLi9WRGlhbG9nL1ZEaWFsb2cnXG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBWRGlhbG9nLmV4dGVuZCh7XG4gIG5hbWU6ICd2LWJvdHRvbS1zaGVldCcsXG5cbiAgcHJvcHM6IHtcbiAgICBpbnNldDogQm9vbGVhbixcbiAgICBtYXhXaWR0aDoge1xuICAgICAgdHlwZTogW1N0cmluZywgTnVtYmVyXSxcbiAgICAgIGRlZmF1bHQ6ICdhdXRvJyxcbiAgICB9LFxuICAgIHRyYW5zaXRpb246IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICdib3R0b20tc2hlZXQtdHJhbnNpdGlvbicsXG4gICAgfSxcbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5WRGlhbG9nLm9wdGlvbnMuY29tcHV0ZWQuY2xhc3Nlcy5jYWxsKHRoaXMpLFxuICAgICAgICAndi1ib3R0b20tc2hlZXQnOiB0cnVlLFxuICAgICAgICAndi1ib3R0b20tc2hlZXQtLWluc2V0JzogdGhpcy5pbnNldCxcbiAgICAgIH1cbiAgICB9LFxuICB9LFxufSlcbiJdfQ==