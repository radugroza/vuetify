// Styles
// import '../../stylus/components/_calendar-daily.styl'
// Mixins
import CalendarWithEvents from './mixins/calendar-with-events';
// Util
import props from './util/props';
import { DAYS_IN_MONTH_MAX, DAY_MIN, DAYS_IN_WEEK, parseTimestamp, validateTimestamp, relativeDays, nextDay, prevDay, copyTimestamp, updateFormatted, updateWeekday, updateRelative, getStartOfMonth, getEndOfMonth, timestampToDate, } from './util/timestamp';
// Calendars
import VCalendarMonthly from './VCalendarMonthly';
import VCalendarDaily from './VCalendarDaily';
import VCalendarWeekly from './VCalendarWeekly';
import VCalendarCategory from './VCalendarCategory';
/* @vue/component */
export default CalendarWithEvents.extend({
    name: 'v-calendar',
    props: {
        ...props.calendar,
        ...props.weeks,
        ...props.intervals,
        ...props.category,
    },
    data: () => ({
        lastStart: null,
        lastEnd: null,
    }),
    computed: {
        parsedValue() {
            return (validateTimestamp(this.value)
                ? parseTimestamp(this.value, true)
                : (this.parsedStart || this.times.today));
        },
        parsedCategoryDays() {
            return parseInt(this.categoryDays) || 1;
        },
        renderProps() {
            const around = this.parsedValue;
            let component = null;
            let maxDays = this.maxDays;
            let weekdays = this.parsedWeekdays;
            let categories = this.parsedCategories;
            let start = around;
            let end = around;
            switch (this.type) {
                case 'month':
                    component = VCalendarMonthly;
                    start = getStartOfMonth(around);
                    end = getEndOfMonth(around);
                    break;
                case 'week':
                    component = VCalendarDaily;
                    start = this.getStartOfWeek(around);
                    end = this.getEndOfWeek(around);
                    maxDays = 7;
                    break;
                case 'day':
                    component = VCalendarDaily;
                    maxDays = 1;
                    weekdays = [start.weekday];
                    break;
                case '4day':
                    component = VCalendarDaily;
                    end = relativeDays(copyTimestamp(end), nextDay, 4);
                    updateFormatted(end);
                    maxDays = 4;
                    weekdays = [
                        start.weekday,
                        (start.weekday + 1) % 7,
                        (start.weekday + 2) % 7,
                        (start.weekday + 3) % 7,
                    ];
                    break;
                case 'custom-weekly':
                    component = VCalendarWeekly;
                    start = this.parsedStart || around;
                    end = this.parsedEnd;
                    break;
                case 'custom-daily':
                    component = VCalendarDaily;
                    start = this.parsedStart || around;
                    end = this.parsedEnd;
                    break;
                case 'category':
                    const days = this.parsedCategoryDays;
                    component = VCalendarCategory;
                    end = relativeDays(copyTimestamp(end), nextDay, days);
                    updateFormatted(end);
                    maxDays = days;
                    weekdays = [];
                    for (let i = 0; i < days; i++) {
                        weekdays.push((start.weekday + i) % 7);
                    }
                    categories = this.getCategoryList(categories);
                    break;
                default:
                    throw new Error(this.type + ' is not a valid Calendar type');
            }
            return { component, start, end, maxDays, weekdays, categories };
        },
        eventWeekdays() {
            return this.renderProps.weekdays;
        },
        categoryMode() {
            return this.type === 'category';
        },
        title() {
            const { start, end } = this.renderProps;
            const spanYears = start.year !== end.year;
            const spanMonths = spanYears || start.month !== end.month;
            if (spanYears) {
                return this.monthShortFormatter(start, true) + ' ' + start.year + ' - ' + this.monthShortFormatter(end, true) + ' ' + end.year;
            }
            if (spanMonths) {
                return this.monthShortFormatter(start, true) + ' - ' + this.monthShortFormatter(end, true) + ' ' + end.year;
            }
            else {
                return this.monthLongFormatter(start, false) + ' ' + start.year;
            }
        },
        monthLongFormatter() {
            return this.getFormatter({
                timeZone: 'UTC', month: 'long',
            });
        },
        monthShortFormatter() {
            return this.getFormatter({
                timeZone: 'UTC', month: 'short',
            });
        },
        parsedCategories() {
            return typeof this.categories === 'string' && this.categories
                ? this.categories.split(/\s*,\s*/)
                : Array.isArray(this.categories)
                    ? this.categories
                    : [];
        },
    },
    watch: {
        renderProps: 'checkChange',
    },
    mounted() {
        this.updateEventVisibility();
        this.checkChange();
    },
    updated() {
        window.requestAnimationFrame(this.updateEventVisibility);
    },
    methods: {
        checkChange() {
            const { lastStart, lastEnd } = this;
            const { start, end } = this.renderProps;
            if (!lastStart || !lastEnd ||
                start.date !== lastStart.date ||
                end.date !== lastEnd.date) {
                this.lastStart = start;
                this.lastEnd = end;
                this.$emit('change', { start, end });
            }
        },
        move(amount = 1) {
            const moved = copyTimestamp(this.parsedValue);
            const forward = amount > 0;
            const mover = forward ? nextDay : prevDay;
            const limit = forward ? DAYS_IN_MONTH_MAX : DAY_MIN;
            let times = forward ? amount : -amount;
            while (--times >= 0) {
                switch (this.type) {
                    case 'month':
                        moved.day = limit;
                        mover(moved);
                        break;
                    case 'week':
                        relativeDays(moved, mover, DAYS_IN_WEEK);
                        break;
                    case 'day':
                        relativeDays(moved, mover, 1);
                        break;
                    case '4day':
                        relativeDays(moved, mover, 4);
                        break;
                    case 'category':
                        relativeDays(moved, mover, this.parsedCategoryDays);
                        break;
                }
            }
            updateWeekday(moved);
            updateFormatted(moved);
            updateRelative(moved, this.times.now);
            if (this.value instanceof Date) {
                this.$emit('input', timestampToDate(moved));
            }
            else if (typeof this.value === 'number') {
                this.$emit('input', timestampToDate(moved).getTime());
            }
            else {
                this.$emit('input', moved.date);
            }
            this.$emit('moved', moved);
        },
        next(amount = 1) {
            this.move(amount);
        },
        prev(amount = 1) {
            this.move(-amount);
        },
        timeToY(time, clamp = true) {
            const c = this.$children[0];
            if (c && c.timeToY) {
                return c.timeToY(time, clamp);
            }
            else {
                return false;
            }
        },
        timeDelta(time) {
            const c = this.$children[0];
            if (c && c.timeDelta) {
                return c.timeDelta(time);
            }
            else {
                return false;
            }
        },
        minutesToPixels(minutes) {
            const c = this.$children[0];
            if (c && c.minutesToPixels) {
                return c.minutesToPixels(minutes);
            }
            else {
                return -1;
            }
        },
        scrollToTime(time) {
            const c = this.$children[0];
            if (c && c.scrollToTime) {
                return c.scrollToTime(time);
            }
            else {
                return false;
            }
        },
        parseTimestamp(input, required) {
            return parseTimestamp(input, required, this.times.now);
        },
        timestampToDate(timestamp) {
            return timestampToDate(timestamp);
        },
        getCategoryList(categories) {
            if (!this.noEvents) {
                const categoryMap = categories.reduce((map, category, index) => {
                    map[category] = { index, count: 0 };
                    return map;
                }, Object.create(null));
                if (!this.categoryHideDynamic || !this.categoryShowAll) {
                    let categoryLength = categories.length;
                    this.parsedEvents.forEach(ev => {
                        let category = ev.category;
                        if (typeof category !== 'string') {
                            category = this.categoryForInvalid;
                        }
                        if (!category) {
                            return;
                        }
                        if (category in categoryMap) {
                            categoryMap[category].count++;
                        }
                        else if (!this.categoryHideDynamic) {
                            categoryMap[category] = {
                                index: categoryLength++,
                                count: 1,
                            };
                        }
                    });
                }
                if (!this.categoryShowAll) {
                    for (const category in categoryMap) {
                        if (categoryMap[category].count === 0) {
                            delete categoryMap[category];
                        }
                    }
                }
                categories = Object.keys(categoryMap);
            }
            return categories;
        },
    },
    render(h) {
        const { start, end, maxDays, component, weekdays, categories } = this.renderProps;
        return h(component, {
            staticClass: 'v-calendar',
            class: {
                'v-calendar-events': !this.noEvents,
            },
            props: {
                ...this.$props,
                start: start.date,
                end: end.date,
                maxDays,
                weekdays,
                categories,
            },
            directives: [{
                    modifiers: { quiet: true },
                    name: 'resize',
                    value: this.updateEventVisibility,
                }],
            on: {
                ...this.$listeners,
                'click:date': (day) => {
                    if (this.$listeners['input']) {
                        this.$emit('input', day.date);
                    }
                    if (this.$listeners['click:date']) {
                        this.$emit('click:date', day);
                    }
                },
            },
            scopedSlots: this.getScopedSlots(),
        });
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkNhbGVuZGFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkNhbGVuZGFyL1ZDYWxlbmRhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1Qsd0RBQXdEO0FBS3hELFNBQVM7QUFDVCxPQUFPLGtCQUFrQixNQUFNLCtCQUErQixDQUFBO0FBRTlELE9BQU87QUFDUCxPQUFPLEtBQUssTUFBTSxjQUFjLENBQUE7QUFDaEMsT0FBTyxFQUNMLGlCQUFpQixFQUNqQixPQUFPLEVBQ1AsWUFBWSxFQUNaLGNBQWMsRUFDZCxpQkFBaUIsRUFDakIsWUFBWSxFQUNaLE9BQU8sRUFDUCxPQUFPLEVBQ1AsYUFBYSxFQUNiLGVBQWUsRUFDZixhQUFhLEVBQ2IsY0FBYyxFQUNkLGVBQWUsRUFDZixhQUFhLEVBR2IsZUFBZSxHQUNoQixNQUFNLGtCQUFrQixDQUFBO0FBRXpCLFlBQVk7QUFDWixPQUFPLGdCQUFnQixNQUFNLG9CQUFvQixDQUFBO0FBQ2pELE9BQU8sY0FBYyxNQUFNLGtCQUFrQixDQUFBO0FBQzdDLE9BQU8sZUFBZSxNQUFNLG1CQUFtQixDQUFBO0FBQy9DLE9BQU8saUJBQWlCLE1BQU0scUJBQXFCLENBQUE7QUFhbkQsb0JBQW9CO0FBQ3BCLGVBQWUsa0JBQWtCLENBQUMsTUFBTSxDQUFDO0lBQ3ZDLElBQUksRUFBRSxZQUFZO0lBRWxCLEtBQUssRUFBRTtRQUNMLEdBQUcsS0FBSyxDQUFDLFFBQVE7UUFDakIsR0FBRyxLQUFLLENBQUMsS0FBSztRQUNkLEdBQUcsS0FBSyxDQUFDLFNBQVM7UUFDbEIsR0FBRyxLQUFLLENBQUMsUUFBUTtLQUNsQjtJQUVELElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ1gsU0FBUyxFQUFFLElBQWdDO1FBQzNDLE9BQU8sRUFBRSxJQUFnQztLQUMxQyxDQUFDO0lBRUYsUUFBUSxFQUFFO1FBQ1IsV0FBVztZQUNULE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUNuQyxDQUFDLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDO2dCQUNsQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtRQUM3QyxDQUFDO1FBQ0Qsa0JBQWtCO1lBQ2hCLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDekMsQ0FBQztRQUNELFdBQVc7WUFDVCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFBO1lBQy9CLElBQUksU0FBUyxHQUFRLElBQUksQ0FBQTtZQUN6QixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFBO1lBQzFCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUE7WUFDbEMsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFBO1lBQ3RDLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQTtZQUNsQixJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUE7WUFDaEIsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNqQixLQUFLLE9BQU87b0JBQ1YsU0FBUyxHQUFHLGdCQUFnQixDQUFBO29CQUM1QixLQUFLLEdBQUcsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFBO29CQUMvQixHQUFHLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFBO29CQUMzQixNQUFLO2dCQUNQLEtBQUssTUFBTTtvQkFDVCxTQUFTLEdBQUcsY0FBYyxDQUFBO29CQUMxQixLQUFLLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtvQkFDbkMsR0FBRyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUE7b0JBQy9CLE9BQU8sR0FBRyxDQUFDLENBQUE7b0JBQ1gsTUFBSztnQkFDUCxLQUFLLEtBQUs7b0JBQ1IsU0FBUyxHQUFHLGNBQWMsQ0FBQTtvQkFDMUIsT0FBTyxHQUFHLENBQUMsQ0FBQTtvQkFDWCxRQUFRLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7b0JBQzFCLE1BQUs7Z0JBQ1AsS0FBSyxNQUFNO29CQUNULFNBQVMsR0FBRyxjQUFjLENBQUE7b0JBQzFCLEdBQUcsR0FBRyxZQUFZLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQTtvQkFDbEQsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFBO29CQUNwQixPQUFPLEdBQUcsQ0FBQyxDQUFBO29CQUNYLFFBQVEsR0FBRzt3QkFDVCxLQUFLLENBQUMsT0FBTzt3QkFDYixDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQzt3QkFDdkIsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUM7d0JBQ3ZCLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDO3FCQUN4QixDQUFBO29CQUNELE1BQUs7Z0JBQ1AsS0FBSyxlQUFlO29CQUNsQixTQUFTLEdBQUcsZUFBZSxDQUFBO29CQUMzQixLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsSUFBSSxNQUFNLENBQUE7b0JBQ2xDLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFBO29CQUNwQixNQUFLO2dCQUNQLEtBQUssY0FBYztvQkFDakIsU0FBUyxHQUFHLGNBQWMsQ0FBQTtvQkFDMUIsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLElBQUksTUFBTSxDQUFBO29CQUNsQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQTtvQkFDcEIsTUFBSztnQkFDUCxLQUFLLFVBQVU7b0JBQ2IsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFBO29CQUVwQyxTQUFTLEdBQUcsaUJBQWlCLENBQUE7b0JBQzdCLEdBQUcsR0FBRyxZQUFZLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQTtvQkFDckQsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFBO29CQUNwQixPQUFPLEdBQUcsSUFBSSxDQUFBO29CQUNkLFFBQVEsR0FBRyxFQUFFLENBQUE7b0JBRWIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDN0IsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7cUJBQ3ZDO29CQUVELFVBQVUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFBO29CQUM3QyxNQUFLO2dCQUNQO29CQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRywrQkFBK0IsQ0FBQyxDQUFBO2FBQy9EO1lBRUQsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLENBQUE7UUFDakUsQ0FBQztRQUNELGFBQWE7WUFDWCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFBO1FBQ2xDLENBQUM7UUFDRCxZQUFZO1lBQ1YsT0FBTyxJQUFJLENBQUMsSUFBSSxLQUFLLFVBQVUsQ0FBQTtRQUNqQyxDQUFDO1FBQ0QsS0FBSztZQUNILE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQTtZQUN2QyxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUE7WUFDekMsTUFBTSxVQUFVLEdBQUcsU0FBUyxJQUFJLEtBQUssQ0FBQyxLQUFLLEtBQUssR0FBRyxDQUFDLEtBQUssQ0FBQTtZQUV6RCxJQUFJLFNBQVMsRUFBRTtnQkFDYixPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxJQUFJLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUE7YUFDL0g7WUFFRCxJQUFJLFVBQVUsRUFBRTtnQkFDZCxPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUE7YUFDNUc7aUJBQU07Z0JBQ0wsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFBO2FBQ2hFO1FBQ0gsQ0FBQztRQUNELGtCQUFrQjtZQUNoQixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7Z0JBQ3ZCLFFBQVEsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQU07YUFDL0IsQ0FBQyxDQUFBO1FBQ0osQ0FBQztRQUNELG1CQUFtQjtZQUNqQixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7Z0JBQ3ZCLFFBQVEsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLE9BQU87YUFDaEMsQ0FBQyxDQUFBO1FBQ0osQ0FBQztRQUNELGdCQUFnQjtZQUNkLE9BQU8sT0FBTyxJQUFJLENBQUMsVUFBVSxLQUFLLFFBQVEsSUFBSSxJQUFJLENBQUMsVUFBVTtnQkFDM0QsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQztnQkFDbEMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztvQkFDOUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFzQjtvQkFDN0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtRQUNWLENBQUM7S0FDRjtJQUVELEtBQUssRUFBRTtRQUNMLFdBQVcsRUFBRSxhQUFhO0tBQzNCO0lBRUQsT0FBTztRQUNMLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFBO1FBQzVCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQTtJQUNwQixDQUFDO0lBRUQsT0FBTztRQUNMLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQTtJQUMxRCxDQUFDO0lBRUQsT0FBTyxFQUFFO1FBQ1AsV0FBVztZQUNULE1BQU0sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFBO1lBQ25DLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQTtZQUN2QyxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsT0FBTztnQkFDeEIsS0FBSyxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsSUFBSTtnQkFDN0IsR0FBRyxDQUFDLElBQUksS0FBSyxPQUFPLENBQUMsSUFBSSxFQUFFO2dCQUMzQixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQTtnQkFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUE7Z0JBQ2xCLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUE7YUFDckM7UUFDSCxDQUFDO1FBQ0QsSUFBSSxDQUFFLE1BQU0sR0FBRyxDQUFDO1lBQ2QsTUFBTSxLQUFLLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTtZQUM3QyxNQUFNLE9BQU8sR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFBO1lBQzFCLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUE7WUFDekMsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFBO1lBQ25ELElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQTtZQUV0QyxPQUFPLEVBQUUsS0FBSyxJQUFJLENBQUMsRUFBRTtnQkFDbkIsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFO29CQUNqQixLQUFLLE9BQU87d0JBQ1YsS0FBSyxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUE7d0JBQ2pCLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQTt3QkFDWixNQUFLO29CQUNQLEtBQUssTUFBTTt3QkFDVCxZQUFZLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQTt3QkFDeEMsTUFBSztvQkFDUCxLQUFLLEtBQUs7d0JBQ1IsWUFBWSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUE7d0JBQzdCLE1BQUs7b0JBQ1AsS0FBSyxNQUFNO3dCQUNULFlBQVksQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFBO3dCQUM3QixNQUFLO29CQUNQLEtBQUssVUFBVTt3QkFDYixZQUFZLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQTt3QkFDbkQsTUFBSztpQkFDUjthQUNGO1lBRUQsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQ3BCLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUN0QixjQUFjLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7WUFFckMsSUFBSSxJQUFJLENBQUMsS0FBSyxZQUFZLElBQUksRUFBRTtnQkFDOUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7YUFDNUM7aUJBQU0sSUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLLEtBQUssUUFBUSxFQUFFO2dCQUN6QyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQTthQUN0RDtpQkFBTTtnQkFDTCxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7YUFDaEM7WUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUM1QixDQUFDO1FBQ0QsSUFBSSxDQUFFLE1BQU0sR0FBRyxDQUFDO1lBQ2QsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUNuQixDQUFDO1FBQ0QsSUFBSSxDQUFFLE1BQU0sR0FBRyxDQUFDO1lBQ2QsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ3BCLENBQUM7UUFDRCxPQUFPLENBQUUsSUFBVyxFQUFFLEtBQUssR0FBRyxJQUFJO1lBQ2hDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFRLENBQUE7WUFFbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRTtnQkFDbEIsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQTthQUM5QjtpQkFBTTtnQkFDTCxPQUFPLEtBQUssQ0FBQTthQUNiO1FBQ0gsQ0FBQztRQUNELFNBQVMsQ0FBRSxJQUFXO1lBQ3BCLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFRLENBQUE7WUFFbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRTtnQkFDcEIsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFBO2FBQ3pCO2lCQUFNO2dCQUNMLE9BQU8sS0FBSyxDQUFBO2FBQ2I7UUFDSCxDQUFDO1FBQ0QsZUFBZSxDQUFFLE9BQWU7WUFDOUIsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQVEsQ0FBQTtZQUVsQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsZUFBZSxFQUFFO2dCQUMxQixPQUFPLENBQUMsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUE7YUFDbEM7aUJBQU07Z0JBQ0wsT0FBTyxDQUFDLENBQUMsQ0FBQTthQUNWO1FBQ0gsQ0FBQztRQUNELFlBQVksQ0FBRSxJQUFXO1lBQ3ZCLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFRLENBQUE7WUFFbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksRUFBRTtnQkFDdkIsT0FBTyxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFBO2FBQzVCO2lCQUFNO2dCQUNMLE9BQU8sS0FBSyxDQUFBO2FBQ2I7UUFDSCxDQUFDO1FBQ0QsY0FBYyxDQUFFLEtBQXNCLEVBQUUsUUFBZ0I7WUFDdEQsT0FBTyxjQUFjLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3hELENBQUM7UUFDRCxlQUFlLENBQUUsU0FBNEI7WUFDM0MsT0FBTyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUE7UUFDbkMsQ0FBQztRQUNELGVBQWUsQ0FBRSxVQUFvQjtZQUNuQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDbEIsTUFBTSxXQUFXLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLEVBQUU7b0JBQzdELEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUE7b0JBRW5DLE9BQU8sR0FBRyxDQUFBO2dCQUNaLENBQUMsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7Z0JBRXZCLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFO29CQUN0RCxJQUFJLGNBQWMsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFBO29CQUV0QyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRTt3QkFDN0IsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQTt3QkFFMUIsSUFBSSxPQUFPLFFBQVEsS0FBSyxRQUFRLEVBQUU7NEJBQ2hDLFFBQVEsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUE7eUJBQ25DO3dCQUVELElBQUksQ0FBQyxRQUFRLEVBQUU7NEJBQ2IsT0FBTTt5QkFDUDt3QkFFRCxJQUFJLFFBQVEsSUFBSSxXQUFXLEVBQUU7NEJBQzNCLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTt5QkFDOUI7NkJBQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRTs0QkFDcEMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxHQUFHO2dDQUN0QixLQUFLLEVBQUUsY0FBYyxFQUFFO2dDQUN2QixLQUFLLEVBQUUsQ0FBQzs2QkFDVCxDQUFBO3lCQUNGO29CQUNILENBQUMsQ0FBQyxDQUFBO2lCQUNIO2dCQUVELElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFO29CQUN6QixLQUFLLE1BQU0sUUFBUSxJQUFJLFdBQVcsRUFBRTt3QkFDbEMsSUFBSSxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsRUFBRTs0QkFDckMsT0FBTyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUE7eUJBQzdCO3FCQUNGO2lCQUNGO2dCQUVELFVBQVUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO2FBQ3RDO1lBRUQsT0FBTyxVQUFVLENBQUE7UUFDbkIsQ0FBQztLQUNGO0lBRUQsTUFBTSxDQUFFLENBQUM7UUFDUCxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFBO1FBRWpGLE9BQU8sQ0FBQyxDQUFDLFNBQVMsRUFBRTtZQUNsQixXQUFXLEVBQUUsWUFBWTtZQUN6QixLQUFLLEVBQUU7Z0JBQ0wsbUJBQW1CLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUTthQUNwQztZQUNELEtBQUssRUFBRTtnQkFDTCxHQUFHLElBQUksQ0FBQyxNQUFNO2dCQUNkLEtBQUssRUFBRSxLQUFLLENBQUMsSUFBSTtnQkFDakIsR0FBRyxFQUFFLEdBQUcsQ0FBQyxJQUFJO2dCQUNiLE9BQU87Z0JBQ1AsUUFBUTtnQkFDUixVQUFVO2FBQ1g7WUFDRCxVQUFVLEVBQUUsQ0FBQztvQkFDWCxTQUFTLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO29CQUMxQixJQUFJLEVBQUUsUUFBUTtvQkFDZCxLQUFLLEVBQUUsSUFBSSxDQUFDLHFCQUFxQjtpQkFDbEMsQ0FBQztZQUNGLEVBQUUsRUFBRTtnQkFDRixHQUFHLElBQUksQ0FBQyxVQUFVO2dCQUNsQixZQUFZLEVBQUUsQ0FBQyxHQUFzQixFQUFFLEVBQUU7b0JBQ3ZDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRTt3QkFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO3FCQUM5QjtvQkFDRCxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLEVBQUU7d0JBQ2pDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxDQUFBO3FCQUM5QjtnQkFDSCxDQUFDO2FBQ0Y7WUFDRCxXQUFXLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRTtTQUNuQyxDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXG4vLyBpbXBvcnQgJy4uLy4uL3N0eWx1cy9jb21wb25lbnRzL19jYWxlbmRhci1kYWlseS5zdHlsJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgVk5vZGUsIENvbXBvbmVudCB9IGZyb20gJ3Z1ZSdcblxuLy8gTWl4aW5zXG5pbXBvcnQgQ2FsZW5kYXJXaXRoRXZlbnRzIGZyb20gJy4vbWl4aW5zL2NhbGVuZGFyLXdpdGgtZXZlbnRzJ1xuXG4vLyBVdGlsXG5pbXBvcnQgcHJvcHMgZnJvbSAnLi91dGlsL3Byb3BzJ1xuaW1wb3J0IHtcbiAgREFZU19JTl9NT05USF9NQVgsXG4gIERBWV9NSU4sXG4gIERBWVNfSU5fV0VFSyxcbiAgcGFyc2VUaW1lc3RhbXAsXG4gIHZhbGlkYXRlVGltZXN0YW1wLFxuICByZWxhdGl2ZURheXMsXG4gIG5leHREYXksXG4gIHByZXZEYXksXG4gIGNvcHlUaW1lc3RhbXAsXG4gIHVwZGF0ZUZvcm1hdHRlZCxcbiAgdXBkYXRlV2Vla2RheSxcbiAgdXBkYXRlUmVsYXRpdmUsXG4gIGdldFN0YXJ0T2ZNb250aCxcbiAgZ2V0RW5kT2ZNb250aCxcbiAgVlRpbWUsXG4gIFZUaW1lc3RhbXBJbnB1dCxcbiAgdGltZXN0YW1wVG9EYXRlLFxufSBmcm9tICcuL3V0aWwvdGltZXN0YW1wJ1xuXG4vLyBDYWxlbmRhcnNcbmltcG9ydCBWQ2FsZW5kYXJNb250aGx5IGZyb20gJy4vVkNhbGVuZGFyTW9udGhseSdcbmltcG9ydCBWQ2FsZW5kYXJEYWlseSBmcm9tICcuL1ZDYWxlbmRhckRhaWx5J1xuaW1wb3J0IFZDYWxlbmRhcldlZWtseSBmcm9tICcuL1ZDYWxlbmRhcldlZWtseSdcbmltcG9ydCBWQ2FsZW5kYXJDYXRlZ29yeSBmcm9tICcuL1ZDYWxlbmRhckNhdGVnb3J5J1xuaW1wb3J0IHsgQ2FsZW5kYXJUaW1lc3RhbXAsIENhbGVuZGFyRm9ybWF0dGVyIH0gZnJvbSAndnVldGlmeS90eXBlcydcblxuLy8gVHlwZXNcbmludGVyZmFjZSBWQ2FsZW5kYXJSZW5kZXJQcm9wcyB7XG4gIHN0YXJ0OiBDYWxlbmRhclRpbWVzdGFtcFxuICBlbmQ6IENhbGVuZGFyVGltZXN0YW1wXG4gIGNvbXBvbmVudDogc3RyaW5nIHwgQ29tcG9uZW50XG4gIG1heERheXM6IG51bWJlclxuICB3ZWVrZGF5czogbnVtYmVyW11cbiAgY2F0ZWdvcmllczogc3RyaW5nW11cbn1cblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IENhbGVuZGFyV2l0aEV2ZW50cy5leHRlbmQoe1xuICBuYW1lOiAndi1jYWxlbmRhcicsXG5cbiAgcHJvcHM6IHtcbiAgICAuLi5wcm9wcy5jYWxlbmRhcixcbiAgICAuLi5wcm9wcy53ZWVrcyxcbiAgICAuLi5wcm9wcy5pbnRlcnZhbHMsXG4gICAgLi4ucHJvcHMuY2F0ZWdvcnksXG4gIH0sXG5cbiAgZGF0YTogKCkgPT4gKHtcbiAgICBsYXN0U3RhcnQ6IG51bGwgYXMgQ2FsZW5kYXJUaW1lc3RhbXAgfCBudWxsLFxuICAgIGxhc3RFbmQ6IG51bGwgYXMgQ2FsZW5kYXJUaW1lc3RhbXAgfCBudWxsLFxuICB9KSxcblxuICBjb21wdXRlZDoge1xuICAgIHBhcnNlZFZhbHVlICgpOiBDYWxlbmRhclRpbWVzdGFtcCB7XG4gICAgICByZXR1cm4gKHZhbGlkYXRlVGltZXN0YW1wKHRoaXMudmFsdWUpXG4gICAgICAgID8gcGFyc2VUaW1lc3RhbXAodGhpcy52YWx1ZSwgdHJ1ZSlcbiAgICAgICAgOiAodGhpcy5wYXJzZWRTdGFydCB8fCB0aGlzLnRpbWVzLnRvZGF5KSlcbiAgICB9LFxuICAgIHBhcnNlZENhdGVnb3J5RGF5cyAoKTogbnVtYmVyIHtcbiAgICAgIHJldHVybiBwYXJzZUludCh0aGlzLmNhdGVnb3J5RGF5cykgfHwgMVxuICAgIH0sXG4gICAgcmVuZGVyUHJvcHMgKCk6IFZDYWxlbmRhclJlbmRlclByb3BzIHtcbiAgICAgIGNvbnN0IGFyb3VuZCA9IHRoaXMucGFyc2VkVmFsdWVcbiAgICAgIGxldCBjb21wb25lbnQ6IGFueSA9IG51bGxcbiAgICAgIGxldCBtYXhEYXlzID0gdGhpcy5tYXhEYXlzXG4gICAgICBsZXQgd2Vla2RheXMgPSB0aGlzLnBhcnNlZFdlZWtkYXlzXG4gICAgICBsZXQgY2F0ZWdvcmllcyA9IHRoaXMucGFyc2VkQ2F0ZWdvcmllc1xuICAgICAgbGV0IHN0YXJ0ID0gYXJvdW5kXG4gICAgICBsZXQgZW5kID0gYXJvdW5kXG4gICAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgICAgICBjYXNlICdtb250aCc6XG4gICAgICAgICAgY29tcG9uZW50ID0gVkNhbGVuZGFyTW9udGhseVxuICAgICAgICAgIHN0YXJ0ID0gZ2V0U3RhcnRPZk1vbnRoKGFyb3VuZClcbiAgICAgICAgICBlbmQgPSBnZXRFbmRPZk1vbnRoKGFyb3VuZClcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICd3ZWVrJzpcbiAgICAgICAgICBjb21wb25lbnQgPSBWQ2FsZW5kYXJEYWlseVxuICAgICAgICAgIHN0YXJ0ID0gdGhpcy5nZXRTdGFydE9mV2Vlayhhcm91bmQpXG4gICAgICAgICAgZW5kID0gdGhpcy5nZXRFbmRPZldlZWsoYXJvdW5kKVxuICAgICAgICAgIG1heERheXMgPSA3XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnZGF5JzpcbiAgICAgICAgICBjb21wb25lbnQgPSBWQ2FsZW5kYXJEYWlseVxuICAgICAgICAgIG1heERheXMgPSAxXG4gICAgICAgICAgd2Vla2RheXMgPSBbc3RhcnQud2Vla2RheV1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICc0ZGF5JzpcbiAgICAgICAgICBjb21wb25lbnQgPSBWQ2FsZW5kYXJEYWlseVxuICAgICAgICAgIGVuZCA9IHJlbGF0aXZlRGF5cyhjb3B5VGltZXN0YW1wKGVuZCksIG5leHREYXksIDQpXG4gICAgICAgICAgdXBkYXRlRm9ybWF0dGVkKGVuZClcbiAgICAgICAgICBtYXhEYXlzID0gNFxuICAgICAgICAgIHdlZWtkYXlzID0gW1xuICAgICAgICAgICAgc3RhcnQud2Vla2RheSxcbiAgICAgICAgICAgIChzdGFydC53ZWVrZGF5ICsgMSkgJSA3LFxuICAgICAgICAgICAgKHN0YXJ0LndlZWtkYXkgKyAyKSAlIDcsXG4gICAgICAgICAgICAoc3RhcnQud2Vla2RheSArIDMpICUgNyxcbiAgICAgICAgICBdXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnY3VzdG9tLXdlZWtseSc6XG4gICAgICAgICAgY29tcG9uZW50ID0gVkNhbGVuZGFyV2Vla2x5XG4gICAgICAgICAgc3RhcnQgPSB0aGlzLnBhcnNlZFN0YXJ0IHx8IGFyb3VuZFxuICAgICAgICAgIGVuZCA9IHRoaXMucGFyc2VkRW5kXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnY3VzdG9tLWRhaWx5JzpcbiAgICAgICAgICBjb21wb25lbnQgPSBWQ2FsZW5kYXJEYWlseVxuICAgICAgICAgIHN0YXJ0ID0gdGhpcy5wYXJzZWRTdGFydCB8fCBhcm91bmRcbiAgICAgICAgICBlbmQgPSB0aGlzLnBhcnNlZEVuZFxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2NhdGVnb3J5JzpcbiAgICAgICAgICBjb25zdCBkYXlzID0gdGhpcy5wYXJzZWRDYXRlZ29yeURheXNcblxuICAgICAgICAgIGNvbXBvbmVudCA9IFZDYWxlbmRhckNhdGVnb3J5XG4gICAgICAgICAgZW5kID0gcmVsYXRpdmVEYXlzKGNvcHlUaW1lc3RhbXAoZW5kKSwgbmV4dERheSwgZGF5cylcbiAgICAgICAgICB1cGRhdGVGb3JtYXR0ZWQoZW5kKVxuICAgICAgICAgIG1heERheXMgPSBkYXlzXG4gICAgICAgICAgd2Vla2RheXMgPSBbXVxuXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXlzOyBpKyspIHtcbiAgICAgICAgICAgIHdlZWtkYXlzLnB1c2goKHN0YXJ0LndlZWtkYXkgKyBpKSAlIDcpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY2F0ZWdvcmllcyA9IHRoaXMuZ2V0Q2F0ZWdvcnlMaXN0KGNhdGVnb3JpZXMpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IodGhpcy50eXBlICsgJyBpcyBub3QgYSB2YWxpZCBDYWxlbmRhciB0eXBlJylcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHsgY29tcG9uZW50LCBzdGFydCwgZW5kLCBtYXhEYXlzLCB3ZWVrZGF5cywgY2F0ZWdvcmllcyB9XG4gICAgfSxcbiAgICBldmVudFdlZWtkYXlzICgpOiBudW1iZXJbXSB7XG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJQcm9wcy53ZWVrZGF5c1xuICAgIH0sXG4gICAgY2F0ZWdvcnlNb2RlICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLnR5cGUgPT09ICdjYXRlZ29yeSdcbiAgICB9LFxuICAgIHRpdGxlICgpOiBzdHJpbmcge1xuICAgICAgY29uc3QgeyBzdGFydCwgZW5kIH0gPSB0aGlzLnJlbmRlclByb3BzXG4gICAgICBjb25zdCBzcGFuWWVhcnMgPSBzdGFydC55ZWFyICE9PSBlbmQueWVhclxuICAgICAgY29uc3Qgc3Bhbk1vbnRocyA9IHNwYW5ZZWFycyB8fCBzdGFydC5tb250aCAhPT0gZW5kLm1vbnRoXG5cbiAgICAgIGlmIChzcGFuWWVhcnMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9udGhTaG9ydEZvcm1hdHRlcihzdGFydCwgdHJ1ZSkgKyAnICcgKyBzdGFydC55ZWFyICsgJyAtICcgKyB0aGlzLm1vbnRoU2hvcnRGb3JtYXR0ZXIoZW5kLCB0cnVlKSArICcgJyArIGVuZC55ZWFyXG4gICAgICB9XG5cbiAgICAgIGlmIChzcGFuTW9udGhzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1vbnRoU2hvcnRGb3JtYXR0ZXIoc3RhcnQsIHRydWUpICsgJyAtICcgKyB0aGlzLm1vbnRoU2hvcnRGb3JtYXR0ZXIoZW5kLCB0cnVlKSArICcgJyArIGVuZC55ZWFyXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5tb250aExvbmdGb3JtYXR0ZXIoc3RhcnQsIGZhbHNlKSArICcgJyArIHN0YXJ0LnllYXJcbiAgICAgIH1cbiAgICB9LFxuICAgIG1vbnRoTG9uZ0Zvcm1hdHRlciAoKTogQ2FsZW5kYXJGb3JtYXR0ZXIge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0Rm9ybWF0dGVyKHtcbiAgICAgICAgdGltZVpvbmU6ICdVVEMnLCBtb250aDogJ2xvbmcnLFxuICAgICAgfSlcbiAgICB9LFxuICAgIG1vbnRoU2hvcnRGb3JtYXR0ZXIgKCk6IENhbGVuZGFyRm9ybWF0dGVyIHtcbiAgICAgIHJldHVybiB0aGlzLmdldEZvcm1hdHRlcih7XG4gICAgICAgIHRpbWVab25lOiAnVVRDJywgbW9udGg6ICdzaG9ydCcsXG4gICAgICB9KVxuICAgIH0sXG4gICAgcGFyc2VkQ2F0ZWdvcmllcyAoKTogc3RyaW5nW10ge1xuICAgICAgcmV0dXJuIHR5cGVvZiB0aGlzLmNhdGVnb3JpZXMgPT09ICdzdHJpbmcnICYmIHRoaXMuY2F0ZWdvcmllc1xuICAgICAgICA/IHRoaXMuY2F0ZWdvcmllcy5zcGxpdCgvXFxzKixcXHMqLylcbiAgICAgICAgOiBBcnJheS5pc0FycmF5KHRoaXMuY2F0ZWdvcmllcylcbiAgICAgICAgICA/IHRoaXMuY2F0ZWdvcmllcyBhcyBzdHJpbmdbXVxuICAgICAgICAgIDogW11cbiAgICB9LFxuICB9LFxuXG4gIHdhdGNoOiB7XG4gICAgcmVuZGVyUHJvcHM6ICdjaGVja0NoYW5nZScsXG4gIH0sXG5cbiAgbW91bnRlZCAoKSB7XG4gICAgdGhpcy51cGRhdGVFdmVudFZpc2liaWxpdHkoKVxuICAgIHRoaXMuY2hlY2tDaGFuZ2UoKVxuICB9LFxuXG4gIHVwZGF0ZWQgKCkge1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy51cGRhdGVFdmVudFZpc2liaWxpdHkpXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGNoZWNrQ2hhbmdlICgpOiB2b2lkIHtcbiAgICAgIGNvbnN0IHsgbGFzdFN0YXJ0LCBsYXN0RW5kIH0gPSB0aGlzXG4gICAgICBjb25zdCB7IHN0YXJ0LCBlbmQgfSA9IHRoaXMucmVuZGVyUHJvcHNcbiAgICAgIGlmICghbGFzdFN0YXJ0IHx8ICFsYXN0RW5kIHx8XG4gICAgICAgIHN0YXJ0LmRhdGUgIT09IGxhc3RTdGFydC5kYXRlIHx8XG4gICAgICAgIGVuZC5kYXRlICE9PSBsYXN0RW5kLmRhdGUpIHtcbiAgICAgICAgdGhpcy5sYXN0U3RhcnQgPSBzdGFydFxuICAgICAgICB0aGlzLmxhc3RFbmQgPSBlbmRcbiAgICAgICAgdGhpcy4kZW1pdCgnY2hhbmdlJywgeyBzdGFydCwgZW5kIH0pXG4gICAgICB9XG4gICAgfSxcbiAgICBtb3ZlIChhbW91bnQgPSAxKTogdm9pZCB7XG4gICAgICBjb25zdCBtb3ZlZCA9IGNvcHlUaW1lc3RhbXAodGhpcy5wYXJzZWRWYWx1ZSlcbiAgICAgIGNvbnN0IGZvcndhcmQgPSBhbW91bnQgPiAwXG4gICAgICBjb25zdCBtb3ZlciA9IGZvcndhcmQgPyBuZXh0RGF5IDogcHJldkRheVxuICAgICAgY29uc3QgbGltaXQgPSBmb3J3YXJkID8gREFZU19JTl9NT05USF9NQVggOiBEQVlfTUlOXG4gICAgICBsZXQgdGltZXMgPSBmb3J3YXJkID8gYW1vdW50IDogLWFtb3VudFxuXG4gICAgICB3aGlsZSAoLS10aW1lcyA+PSAwKSB7XG4gICAgICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICAgICAgY2FzZSAnbW9udGgnOlxuICAgICAgICAgICAgbW92ZWQuZGF5ID0gbGltaXRcbiAgICAgICAgICAgIG1vdmVyKG1vdmVkKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBjYXNlICd3ZWVrJzpcbiAgICAgICAgICAgIHJlbGF0aXZlRGF5cyhtb3ZlZCwgbW92ZXIsIERBWVNfSU5fV0VFSylcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgY2FzZSAnZGF5JzpcbiAgICAgICAgICAgIHJlbGF0aXZlRGF5cyhtb3ZlZCwgbW92ZXIsIDEpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgJzRkYXknOlxuICAgICAgICAgICAgcmVsYXRpdmVEYXlzKG1vdmVkLCBtb3ZlciwgNClcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgY2FzZSAnY2F0ZWdvcnknOlxuICAgICAgICAgICAgcmVsYXRpdmVEYXlzKG1vdmVkLCBtb3ZlciwgdGhpcy5wYXJzZWRDYXRlZ29yeURheXMpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHVwZGF0ZVdlZWtkYXkobW92ZWQpXG4gICAgICB1cGRhdGVGb3JtYXR0ZWQobW92ZWQpXG4gICAgICB1cGRhdGVSZWxhdGl2ZShtb3ZlZCwgdGhpcy50aW1lcy5ub3cpXG5cbiAgICAgIGlmICh0aGlzLnZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIHRpbWVzdGFtcFRvRGF0ZShtb3ZlZCkpXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzLnZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIHRpbWVzdGFtcFRvRGF0ZShtb3ZlZCkuZ2V0VGltZSgpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCBtb3ZlZC5kYXRlKVxuICAgICAgfVxuXG4gICAgICB0aGlzLiRlbWl0KCdtb3ZlZCcsIG1vdmVkKVxuICAgIH0sXG4gICAgbmV4dCAoYW1vdW50ID0gMSk6IHZvaWQge1xuICAgICAgdGhpcy5tb3ZlKGFtb3VudClcbiAgICB9LFxuICAgIHByZXYgKGFtb3VudCA9IDEpOiB2b2lkIHtcbiAgICAgIHRoaXMubW92ZSgtYW1vdW50KVxuICAgIH0sXG4gICAgdGltZVRvWSAodGltZTogVlRpbWUsIGNsYW1wID0gdHJ1ZSk6IG51bWJlciB8IGZhbHNlIHtcbiAgICAgIGNvbnN0IGMgPSB0aGlzLiRjaGlsZHJlblswXSBhcyBhbnlcblxuICAgICAgaWYgKGMgJiYgYy50aW1lVG9ZKSB7XG4gICAgICAgIHJldHVybiBjLnRpbWVUb1kodGltZSwgY2xhbXApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9LFxuICAgIHRpbWVEZWx0YSAodGltZTogVlRpbWUpOiBudW1iZXIgfCBmYWxzZSB7XG4gICAgICBjb25zdCBjID0gdGhpcy4kY2hpbGRyZW5bMF0gYXMgYW55XG5cbiAgICAgIGlmIChjICYmIGMudGltZURlbHRhKSB7XG4gICAgICAgIHJldHVybiBjLnRpbWVEZWx0YSh0aW1lKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfSxcbiAgICBtaW51dGVzVG9QaXhlbHMgKG1pbnV0ZXM6IG51bWJlcik6IG51bWJlciB7XG4gICAgICBjb25zdCBjID0gdGhpcy4kY2hpbGRyZW5bMF0gYXMgYW55XG5cbiAgICAgIGlmIChjICYmIGMubWludXRlc1RvUGl4ZWxzKSB7XG4gICAgICAgIHJldHVybiBjLm1pbnV0ZXNUb1BpeGVscyhtaW51dGVzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIC0xXG4gICAgICB9XG4gICAgfSxcbiAgICBzY3JvbGxUb1RpbWUgKHRpbWU6IFZUaW1lKTogYm9vbGVhbiB7XG4gICAgICBjb25zdCBjID0gdGhpcy4kY2hpbGRyZW5bMF0gYXMgYW55XG5cbiAgICAgIGlmIChjICYmIGMuc2Nyb2xsVG9UaW1lKSB7XG4gICAgICAgIHJldHVybiBjLnNjcm9sbFRvVGltZSh0aW1lKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfSxcbiAgICBwYXJzZVRpbWVzdGFtcCAoaW5wdXQ6IFZUaW1lc3RhbXBJbnB1dCwgcmVxdWlyZWQ/OiBmYWxzZSk6IENhbGVuZGFyVGltZXN0YW1wIHwgbnVsbCB7XG4gICAgICByZXR1cm4gcGFyc2VUaW1lc3RhbXAoaW5wdXQsIHJlcXVpcmVkLCB0aGlzLnRpbWVzLm5vdylcbiAgICB9LFxuICAgIHRpbWVzdGFtcFRvRGF0ZSAodGltZXN0YW1wOiBDYWxlbmRhclRpbWVzdGFtcCk6IERhdGUge1xuICAgICAgcmV0dXJuIHRpbWVzdGFtcFRvRGF0ZSh0aW1lc3RhbXApXG4gICAgfSxcbiAgICBnZXRDYXRlZ29yeUxpc3QgKGNhdGVnb3JpZXM6IHN0cmluZ1tdKTogc3RyaW5nW10ge1xuICAgICAgaWYgKCF0aGlzLm5vRXZlbnRzKSB7XG4gICAgICAgIGNvbnN0IGNhdGVnb3J5TWFwID0gY2F0ZWdvcmllcy5yZWR1Y2UoKG1hcCwgY2F0ZWdvcnksIGluZGV4KSA9PiB7XG4gICAgICAgICAgbWFwW2NhdGVnb3J5XSA9IHsgaW5kZXgsIGNvdW50OiAwIH1cblxuICAgICAgICAgIHJldHVybiBtYXBcbiAgICAgICAgfSwgT2JqZWN0LmNyZWF0ZShudWxsKSlcblxuICAgICAgICBpZiAoIXRoaXMuY2F0ZWdvcnlIaWRlRHluYW1pYyB8fCAhdGhpcy5jYXRlZ29yeVNob3dBbGwpIHtcbiAgICAgICAgICBsZXQgY2F0ZWdvcnlMZW5ndGggPSBjYXRlZ29yaWVzLmxlbmd0aFxuXG4gICAgICAgICAgdGhpcy5wYXJzZWRFdmVudHMuZm9yRWFjaChldiA9PiB7XG4gICAgICAgICAgICBsZXQgY2F0ZWdvcnkgPSBldi5jYXRlZ29yeVxuXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNhdGVnb3J5ICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICBjYXRlZ29yeSA9IHRoaXMuY2F0ZWdvcnlGb3JJbnZhbGlkXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghY2F0ZWdvcnkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjYXRlZ29yeSBpbiBjYXRlZ29yeU1hcCkge1xuICAgICAgICAgICAgICBjYXRlZ29yeU1hcFtjYXRlZ29yeV0uY291bnQrK1xuICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5jYXRlZ29yeUhpZGVEeW5hbWljKSB7XG4gICAgICAgICAgICAgIGNhdGVnb3J5TWFwW2NhdGVnb3J5XSA9IHtcbiAgICAgICAgICAgICAgICBpbmRleDogY2F0ZWdvcnlMZW5ndGgrKyxcbiAgICAgICAgICAgICAgICBjb3VudDogMSxcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuY2F0ZWdvcnlTaG93QWxsKSB7XG4gICAgICAgICAgZm9yIChjb25zdCBjYXRlZ29yeSBpbiBjYXRlZ29yeU1hcCkge1xuICAgICAgICAgICAgaWYgKGNhdGVnb3J5TWFwW2NhdGVnb3J5XS5jb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICBkZWxldGUgY2F0ZWdvcnlNYXBbY2F0ZWdvcnldXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY2F0ZWdvcmllcyA9IE9iamVjdC5rZXlzKGNhdGVnb3J5TWFwKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gY2F0ZWdvcmllc1xuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyIChoKTogVk5vZGUge1xuICAgIGNvbnN0IHsgc3RhcnQsIGVuZCwgbWF4RGF5cywgY29tcG9uZW50LCB3ZWVrZGF5cywgY2F0ZWdvcmllcyB9ID0gdGhpcy5yZW5kZXJQcm9wc1xuXG4gICAgcmV0dXJuIGgoY29tcG9uZW50LCB7XG4gICAgICBzdGF0aWNDbGFzczogJ3YtY2FsZW5kYXInLFxuICAgICAgY2xhc3M6IHtcbiAgICAgICAgJ3YtY2FsZW5kYXItZXZlbnRzJzogIXRoaXMubm9FdmVudHMsXG4gICAgICB9LFxuICAgICAgcHJvcHM6IHtcbiAgICAgICAgLi4udGhpcy4kcHJvcHMsXG4gICAgICAgIHN0YXJ0OiBzdGFydC5kYXRlLFxuICAgICAgICBlbmQ6IGVuZC5kYXRlLFxuICAgICAgICBtYXhEYXlzLFxuICAgICAgICB3ZWVrZGF5cyxcbiAgICAgICAgY2F0ZWdvcmllcyxcbiAgICAgIH0sXG4gICAgICBkaXJlY3RpdmVzOiBbe1xuICAgICAgICBtb2RpZmllcnM6IHsgcXVpZXQ6IHRydWUgfSxcbiAgICAgICAgbmFtZTogJ3Jlc2l6ZScsXG4gICAgICAgIHZhbHVlOiB0aGlzLnVwZGF0ZUV2ZW50VmlzaWJpbGl0eSxcbiAgICAgIH1dLFxuICAgICAgb246IHtcbiAgICAgICAgLi4udGhpcy4kbGlzdGVuZXJzLFxuICAgICAgICAnY2xpY2s6ZGF0ZSc6IChkYXk6IENhbGVuZGFyVGltZXN0YW1wKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuJGxpc3RlbmVyc1snaW5wdXQnXSkge1xuICAgICAgICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCBkYXkuZGF0ZSlcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRoaXMuJGxpc3RlbmVyc1snY2xpY2s6ZGF0ZSddKSB7XG4gICAgICAgICAgICB0aGlzLiRlbWl0KCdjbGljazpkYXRlJywgZGF5KVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBzY29wZWRTbG90czogdGhpcy5nZXRTY29wZWRTbG90cygpLFxuICAgIH0pXG4gIH0sXG59KVxuIl19