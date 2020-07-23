import Vue from 'vue';
export default Vue.extend({
    name: 'row-group',
    functional: true,
    props: {
        value: {
            type: Boolean,
            default: true,
        },
        headerClass: {
            type: String,
            default: 'v-row-group__header',
        },
        contentClass: String,
        summaryClass: {
            type: String,
            default: 'v-row-group__summary',
        },
    },
    render(h, { slots, props }) {
        const computedSlots = slots();
        const children = [];
        if (computedSlots['column.header']) {
            children.push(h('tr', {
                staticClass: props.headerClass,
            }, computedSlots['column.header']));
        }
        else if (computedSlots['row.header']) {
            children.push(...computedSlots['row.header']);
        }
        if (computedSlots['row.content'] && props.value)
            children.push(...computedSlots['row.content']);
        if (computedSlots['column.summary']) {
            children.push(h('tr', {
                staticClass: props.summaryClass,
            }, computedSlots['column.summary']));
        }
        else if (computedSlots['row.summary']) {
            children.push(...computedSlots['row.summary']);
        }
        return children;
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm93R3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WRGF0YVRhYmxlL1Jvd0dyb3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sR0FBYyxNQUFNLEtBQUssQ0FBQTtBQUVoQyxlQUFlLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFDeEIsSUFBSSxFQUFFLFdBQVc7SUFFakIsVUFBVSxFQUFFLElBQUk7SUFFaEIsS0FBSyxFQUFFO1FBQ0wsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLE9BQU87WUFDYixPQUFPLEVBQUUsSUFBSTtTQUNkO1FBQ0QsV0FBVyxFQUFFO1lBQ1gsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUscUJBQXFCO1NBQy9CO1FBQ0QsWUFBWSxFQUFFLE1BQU07UUFDcEIsWUFBWSxFQUFFO1lBQ1osSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsc0JBQXNCO1NBQ2hDO0tBQ0Y7SUFFRCxNQUFNLENBQUUsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtRQUN6QixNQUFNLGFBQWEsR0FBRyxLQUFLLEVBQUUsQ0FBQTtRQUM3QixNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUE7UUFFbkIsSUFBSSxhQUFhLENBQUMsZUFBZSxDQUFDLEVBQUU7WUFDbEMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFO2dCQUNwQixXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7YUFDL0IsRUFBRSxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFBO1NBQ3BDO2FBQU0sSUFBSSxhQUFhLENBQUMsWUFBWSxDQUFDLEVBQUU7WUFDdEMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFBO1NBQzlDO1FBRUQsSUFBSSxhQUFhLENBQUMsYUFBYSxDQUFDLElBQUksS0FBSyxDQUFDLEtBQUs7WUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUE7UUFFL0YsSUFBSSxhQUFhLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtZQUNuQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUU7Z0JBQ3BCLFdBQVcsRUFBRSxLQUFLLENBQUMsWUFBWTthQUNoQyxFQUFFLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQTtTQUNyQzthQUFNLElBQUksYUFBYSxDQUFDLGFBQWEsQ0FBQyxFQUFFO1lBQ3ZDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQTtTQUMvQztRQUVELE9BQU8sUUFBZSxDQUFBO0lBQ3hCLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVnVlLCB7IFZOb2RlIH0gZnJvbSAndnVlJ1xuXG5leHBvcnQgZGVmYXVsdCBWdWUuZXh0ZW5kKHtcbiAgbmFtZTogJ3Jvdy1ncm91cCcsXG5cbiAgZnVuY3Rpb25hbDogdHJ1ZSxcblxuICBwcm9wczoge1xuICAgIHZhbHVlOiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB9LFxuICAgIGhlYWRlckNsYXNzOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAndi1yb3ctZ3JvdXBfX2hlYWRlcicsXG4gICAgfSxcbiAgICBjb250ZW50Q2xhc3M6IFN0cmluZyxcbiAgICBzdW1tYXJ5Q2xhc3M6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICd2LXJvdy1ncm91cF9fc3VtbWFyeScsXG4gICAgfSxcbiAgfSxcblxuICByZW5kZXIgKGgsIHsgc2xvdHMsIHByb3BzIH0pOiBWTm9kZSB7XG4gICAgY29uc3QgY29tcHV0ZWRTbG90cyA9IHNsb3RzKClcbiAgICBjb25zdCBjaGlsZHJlbiA9IFtdXG5cbiAgICBpZiAoY29tcHV0ZWRTbG90c1snY29sdW1uLmhlYWRlciddKSB7XG4gICAgICBjaGlsZHJlbi5wdXNoKGgoJ3RyJywge1xuICAgICAgICBzdGF0aWNDbGFzczogcHJvcHMuaGVhZGVyQ2xhc3MsXG4gICAgICB9LCBjb21wdXRlZFNsb3RzWydjb2x1bW4uaGVhZGVyJ10pKVxuICAgIH0gZWxzZSBpZiAoY29tcHV0ZWRTbG90c1sncm93LmhlYWRlciddKSB7XG4gICAgICBjaGlsZHJlbi5wdXNoKC4uLmNvbXB1dGVkU2xvdHNbJ3Jvdy5oZWFkZXInXSlcbiAgICB9XG5cbiAgICBpZiAoY29tcHV0ZWRTbG90c1sncm93LmNvbnRlbnQnXSAmJiBwcm9wcy52YWx1ZSkgY2hpbGRyZW4ucHVzaCguLi5jb21wdXRlZFNsb3RzWydyb3cuY29udGVudCddKVxuXG4gICAgaWYgKGNvbXB1dGVkU2xvdHNbJ2NvbHVtbi5zdW1tYXJ5J10pIHtcbiAgICAgIGNoaWxkcmVuLnB1c2goaCgndHInLCB7XG4gICAgICAgIHN0YXRpY0NsYXNzOiBwcm9wcy5zdW1tYXJ5Q2xhc3MsXG4gICAgICB9LCBjb21wdXRlZFNsb3RzWydjb2x1bW4uc3VtbWFyeSddKSlcbiAgICB9IGVsc2UgaWYgKGNvbXB1dGVkU2xvdHNbJ3Jvdy5zdW1tYXJ5J10pIHtcbiAgICAgIGNoaWxkcmVuLnB1c2goLi4uY29tcHV0ZWRTbG90c1sncm93LnN1bW1hcnknXSlcbiAgICB9XG5cbiAgICByZXR1cm4gY2hpbGRyZW4gYXMgYW55XG4gIH0sXG59KVxuIl19