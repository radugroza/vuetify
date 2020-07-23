// Styles
import './calendar-with-events.sass';
// Directives
import ripple from '../../../directives/ripple';
// Mixins
import CalendarBase from './calendar-base';
// Helpers
import { escapeHTML } from '../../../util/helpers';
// Util
import props from '../util/props';
import { CalendarEventOverlapModes, } from '../modes';
import { getDayIdentifier, diffMinutes, } from '../util/timestamp';
import { parseEvent, isEventStart, isEventOn, isEventOverlapping, } from '../util/events';
const WIDTH_FULL = 100;
const WIDTH_START = 95;
const MINUTES_IN_DAY = 1440;
/* @vue/component */
export default CalendarBase.extend({
    name: 'calendar-with-events',
    directives: {
        ripple,
    },
    props: props.events,
    computed: {
        noEvents() {
            return this.events.length === 0;
        },
        parsedEvents() {
            return this.events.map(this.parseEvent);
        },
        parsedEventOverlapThreshold() {
            return parseInt(this.eventOverlapThreshold);
        },
        eventColorFunction() {
            return typeof this.eventColor === 'function'
                ? this.eventColor
                : () => this.eventColor;
        },
        eventTimedFunction() {
            return typeof this.eventTimed === 'function'
                ? this.eventTimed
                : event => !!event[this.eventTimed];
        },
        eventCategoryFunction() {
            return typeof this.eventCategory === 'function'
                ? this.eventCategory
                : event => event[this.eventCategory];
        },
        eventTextColorFunction() {
            return typeof this.eventTextColor === 'function'
                ? this.eventTextColor
                : () => this.eventTextColor;
        },
        eventNameFunction() {
            return typeof this.eventName === 'function'
                ? this.eventName
                : (event, timedEvent) => escapeHTML(event.input[this.eventName]);
        },
        eventModeFunction() {
            return typeof this.eventOverlapMode === 'function'
                ? this.eventOverlapMode
                : CalendarEventOverlapModes[this.eventOverlapMode];
        },
        eventWeekdays() {
            return this.parsedWeekdays;
        },
        categoryMode() {
            return false;
        },
    },
    methods: {
        parseEvent(input, index = 0) {
            return parseEvent(input, index, this.eventStart, this.eventEnd, this.eventTimedFunction(input), this.categoryMode ? this.eventCategoryFunction(input) : false);
        },
        formatTime(withTime, ampm) {
            const formatter = this.getFormatter({
                timeZone: 'UTC',
                hour: 'numeric',
                minute: withTime.minute > 0 ? 'numeric' : undefined,
            });
            return formatter(withTime, true);
        },
        updateEventVisibility() {
            if (this.noEvents || !this.eventMore) {
                return;
            }
            const eventHeight = this.eventHeight;
            const eventsMap = this.getEventsMap();
            for (const date in eventsMap) {
                const { parent, events, more } = eventsMap[date];
                if (!more) {
                    break;
                }
                const parentBounds = parent.getBoundingClientRect();
                const last = events.length - 1;
                let hide = false;
                let hidden = 0;
                for (let i = 0; i <= last; i++) {
                    if (!hide) {
                        const eventBounds = events[i].getBoundingClientRect();
                        hide = i === last
                            ? (eventBounds.bottom > parentBounds.bottom)
                            : (eventBounds.bottom + eventHeight > parentBounds.bottom);
                    }
                    if (hide) {
                        events[i].style.display = 'none';
                        hidden++;
                    }
                }
                if (hide) {
                    more.style.display = '';
                    more.innerHTML = this.$vuetify.lang.t(this.eventMoreText, hidden);
                }
                else {
                    more.style.display = 'none';
                }
            }
        },
        getEventsMap() {
            const eventsMap = {};
            const elements = this.$refs.events;
            if (!elements || !elements.forEach) {
                return eventsMap;
            }
            elements.forEach(el => {
                const date = el.getAttribute('data-date');
                if (el.parentElement && date) {
                    if (!(date in eventsMap)) {
                        eventsMap[date] = {
                            parent: el.parentElement,
                            more: null,
                            events: [],
                        };
                    }
                    if (el.getAttribute('data-more')) {
                        eventsMap[date].more = el;
                    }
                    else {
                        eventsMap[date].events.push(el);
                        el.style.display = '';
                    }
                }
            });
            return eventsMap;
        },
        genDayEvent({ event }, day) {
            const eventHeight = this.eventHeight;
            const eventMarginBottom = this.eventMarginBottom;
            const dayIdentifier = getDayIdentifier(day);
            const week = day.week;
            const start = dayIdentifier === event.startIdentifier;
            let end = dayIdentifier === event.endIdentifier;
            let width = WIDTH_START;
            if (!this.categoryMode) {
                for (let i = day.index + 1; i < week.length; i++) {
                    const weekdayIdentifier = getDayIdentifier(week[i]);
                    if (event.endIdentifier >= weekdayIdentifier) {
                        width += WIDTH_FULL;
                        end = end || weekdayIdentifier === event.endIdentifier;
                    }
                    else {
                        end = true;
                        break;
                    }
                }
            }
            const scope = { eventParsed: event, day, start, end, timed: false };
            return this.genEvent(event, scope, false, {
                staticClass: 'v-event',
                class: {
                    'v-event-start': start,
                    'v-event-end': end,
                },
                style: {
                    height: `${eventHeight}px`,
                    width: `${width}%`,
                    'margin-bottom': `${eventMarginBottom}px`,
                },
                attrs: {
                    'data-date': day.date,
                },
                key: event.index,
                ref: 'events',
                refInFor: true,
            });
        },
        genTimedEvent({ event, left, width }, day) {
            if (day.timeDelta(event.end) <= 0 || day.timeDelta(event.start) >= 1) {
                return false;
            }
            const dayIdentifier = getDayIdentifier(day);
            const start = event.startIdentifier >= dayIdentifier;
            const end = event.endIdentifier > dayIdentifier;
            const top = start ? day.timeToY(event.start) : 0;
            const bottom = end ? day.timeToY(MINUTES_IN_DAY) : day.timeToY(event.end);
            const height = Math.max(this.eventHeight, bottom - top);
            const scope = { eventParsed: event, day, start, end, timed: true };
            return this.genEvent(event, scope, true, {
                staticClass: 'v-event-timed',
                style: {
                    top: `${top}px`,
                    height: `${height}px`,
                    left: `${left}%`,
                    width: `${width}%`,
                },
            });
        },
        genEvent(event, scopeInput, timedEvent, data) {
            const slot = this.$scopedSlots.event;
            const text = this.eventTextColorFunction(event.input);
            const background = this.eventColorFunction(event.input);
            const overlapsNoon = event.start.hour < 12 && event.end.hour >= 12;
            const singline = diffMinutes(event.start, event.end) <= this.parsedEventOverlapThreshold;
            const formatTime = this.formatTime;
            const timeSummary = () => formatTime(event.start, overlapsNoon) + ' - ' + formatTime(event.end, true);
            const eventSummary = () => {
                const name = this.eventNameFunction(event, timedEvent);
                if (event.start.hasTime) {
                    if (timedEvent) {
                        const time = timeSummary();
                        const delimiter = singline ? ', ' : '<br>';
                        return `<strong>${name}</strong>${delimiter}${time}`;
                    }
                    else {
                        const time = formatTime(event.start, true);
                        return `<strong>${time}</strong> ${name}`;
                    }
                }
                return name;
            };
            const scope = {
                ...scopeInput,
                event: event.input,
                outside: scopeInput.day.outside,
                singline,
                overlapsNoon,
                formatTime,
                timeSummary,
                eventSummary,
            };
            return this.$createElement('div', this.setTextColor(text, this.setBackgroundColor(background, {
                on: this.getDefaultMouseEventHandlers(':event', nativeEvent => ({ ...scope, nativeEvent })),
                directives: [{
                        name: 'ripple',
                        value: this.eventRipple != null ? this.eventRipple : true,
                    }],
                ...data,
            })), slot
                ? slot(scope)
                : [this.genName(eventSummary)]);
        },
        genName(eventSummary) {
            return this.$createElement('div', {
                staticClass: 'pl-1',
                domProps: {
                    innerHTML: eventSummary(),
                },
            });
        },
        genPlaceholder(day) {
            const height = this.eventHeight + this.eventMarginBottom;
            return this.$createElement('div', {
                style: {
                    height: `${height}px`,
                },
                attrs: {
                    'data-date': day.date,
                },
                ref: 'events',
                refInFor: true,
            });
        },
        genMore(day) {
            const eventHeight = this.eventHeight;
            const eventMarginBottom = this.eventMarginBottom;
            return this.$createElement('div', {
                staticClass: 'v-event-more pl-1',
                class: {
                    'v-outside': day.outside,
                },
                attrs: {
                    'data-date': day.date,
                    'data-more': 1,
                },
                directives: [{
                        name: 'ripple',
                        value: this.eventRipple != null ? this.eventRipple : true,
                    }],
                on: {
                    click: () => this.$emit('click:more', day),
                },
                style: {
                    display: 'none',
                    height: `${eventHeight}px`,
                    'margin-bottom': `${eventMarginBottom}px`,
                },
                ref: 'events',
                refInFor: true,
            });
        },
        getVisibleEvents() {
            const start = getDayIdentifier(this.days[0]);
            const end = getDayIdentifier(this.days[this.days.length - 1]);
            return this.parsedEvents.filter(event => isEventOverlapping(event, start, end));
        },
        isEventForCategory(event, category) {
            return !this.categoryMode ||
                category === event.category ||
                (typeof event.category !== 'string' && category === null);
        },
        getEventsForDay(day) {
            const identifier = getDayIdentifier(day);
            const firstWeekday = this.eventWeekdays[0];
            return this.parsedEvents.filter(event => isEventStart(event, day, identifier, firstWeekday));
        },
        getEventsForDayAll(day) {
            const identifier = getDayIdentifier(day);
            const firstWeekday = this.eventWeekdays[0];
            return this.parsedEvents.filter(event => event.allDay &&
                (this.categoryMode ? isEventOn(event, identifier) : isEventStart(event, day, identifier, firstWeekday)) &&
                this.isEventForCategory(event, day.category));
        },
        getEventsForDayTimed(day) {
            const identifier = getDayIdentifier(day);
            return this.parsedEvents.filter(event => !event.allDay &&
                isEventOn(event, identifier) &&
                this.isEventForCategory(event, day.category));
        },
        getScopedSlots() {
            if (this.noEvents) {
                return { ...this.$scopedSlots };
            }
            const mode = this.eventModeFunction(this.parsedEvents, this.eventWeekdays[0], this.parsedEventOverlapThreshold);
            const isNode = (input) => !!input;
            const getSlotChildren = (day, getter, mapper, timed) => {
                const events = getter(day);
                const visuals = mode(day, events, timed, this.categoryMode);
                if (timed) {
                    return visuals.map(visual => mapper(visual, day)).filter(isNode);
                }
                const children = [];
                visuals.forEach((visual, index) => {
                    while (children.length < visual.column) {
                        children.push(this.genPlaceholder(day));
                    }
                    const mapped = mapper(visual, day);
                    if (mapped) {
                        children.push(mapped);
                    }
                });
                return children;
            };
            const slots = this.$scopedSlots;
            const slotDay = slots.day;
            const slotDayHeader = slots['day-header'];
            const slotDayBody = slots['day-body'];
            return {
                ...slots,
                day: (day) => {
                    let children = getSlotChildren(day, this.getEventsForDay, this.genDayEvent, false);
                    if (children && children.length > 0 && this.eventMore) {
                        children.push(this.genMore(day));
                    }
                    if (slotDay) {
                        const slot = slotDay(day);
                        if (slot) {
                            children = children ? children.concat(slot) : slot;
                        }
                    }
                    return children;
                },
                'day-header': (day) => {
                    let children = getSlotChildren(day, this.getEventsForDayAll, this.genDayEvent, false);
                    if (slotDayHeader) {
                        const slot = slotDayHeader(day);
                        if (slot) {
                            children = children ? children.concat(slot) : slot;
                        }
                    }
                    return children;
                },
                'day-body': (day) => {
                    const events = getSlotChildren(day, this.getEventsForDayTimed, this.genTimedEvent, true);
                    let children = [
                        this.$createElement('div', {
                            staticClass: 'v-event-timed-container',
                        }, events),
                    ];
                    if (slotDayBody) {
                        const slot = slotDayBody(day);
                        if (slot) {
                            children = children.concat(slot);
                        }
                    }
                    return children;
                },
            };
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItd2l0aC1ldmVudHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WQ2FsZW5kYXIvbWl4aW5zL2NhbGVuZGFyLXdpdGgtZXZlbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFNBQVM7QUFDVCxPQUFPLDZCQUE2QixDQUFBO0FBS3BDLGFBQWE7QUFDYixPQUFPLE1BQU0sTUFBTSw0QkFBNEIsQ0FBQTtBQUUvQyxTQUFTO0FBQ1QsT0FBTyxZQUFZLE1BQU0saUJBQWlCLENBQUE7QUFFMUMsVUFBVTtBQUNWLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQTtBQUVsRCxPQUFPO0FBQ1AsT0FBTyxLQUFLLE1BQU0sZUFBZSxDQUFBO0FBQ2pDLE9BQU8sRUFDTCx5QkFBeUIsR0FDMUIsTUFBTSxVQUFVLENBQUE7QUFDakIsT0FBTyxFQUNMLGdCQUFnQixFQUFFLFdBQVcsR0FDOUIsTUFBTSxtQkFBbUIsQ0FBQTtBQUMxQixPQUFPLEVBQ0wsVUFBVSxFQUNWLFlBQVksRUFDWixTQUFTLEVBQ1Qsa0JBQWtCLEdBQ25CLE1BQU0sZ0JBQWdCLENBQUE7QUEwQ3ZCLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQTtBQUN0QixNQUFNLFdBQVcsR0FBRyxFQUFFLENBQUE7QUFDdEIsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFBO0FBRTNCLG9CQUFvQjtBQUNwQixlQUFlLFlBQVksQ0FBQyxNQUFNLENBQUM7SUFDakMsSUFBSSxFQUFFLHNCQUFzQjtJQUU1QixVQUFVLEVBQUU7UUFDVixNQUFNO0tBQ1A7SUFFRCxLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU07SUFFbkIsUUFBUSxFQUFFO1FBQ1IsUUFBUTtZQUNOLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFBO1FBQ2pDLENBQUM7UUFDRCxZQUFZO1lBQ1YsT0FBTyxJQUFJLENBQUMsTUFBTSxD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RSxDQUFDLEdBQTZCLEVBQUUsRUFBRTtvQkFDNUMsTUFBTSxNQUFNLEdBQUcsZUFBZSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQTtvQkFDeEYsSUFBSSxRQUFRLEdBQVk7d0JBQ3RCLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFOzRCQUN6QixXQUFXLEVBQUUseUJBQXlCO3lCQUN2QyxFQUFFLE1BQU0sQ0FBQztxQkFDWCxDQUFBO29CQUVELElBQUksV0FBVyxFQUFFO3dCQUNmLE1BQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQTt3QkFDN0IsSUFBSSxJQUFJLEVBQUU7NEJBQ1IsUUFBUSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7eUJBQ2pDO3FCQUNGO29CQUNELE9BQU8sUUFBUSxDQUFBO2dCQUNqQixDQUFDO2FBQ0YsQ0FBQTtRQUNILENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xuaW1wb3J0ICcuL2NhbGVuZGFyLXdpdGgtZXZlbnRzLnNhc3MnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBWTm9kZSwgVk5vZGVEYXRhIH0gZnJvbSAndnVlJ1xuXG4vLyBEaXJlY3RpdmVzXG5pbXBvcnQgcmlwcGxlIGZyb20gJy4uLy4uLy4uL2RpcmVjdGl2ZXMvcmlwcGxlJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBDYWxlbmRhckJhc2UgZnJvbSAnLi9jYWxlbmRhci1iYXNlJ1xuXG4vLyBIZWxwZXJzXG5pbXBvcnQgeyBlc2NhcGVIVE1MIH0gZnJvbSAnLi4vLi4vLi4vdXRpbC9oZWxwZXJzJ1xuXG4vLyBVdGlsXG5pbXBvcnQgcHJvcHMgZnJvbSAnLi4vdXRpbC9wcm9wcydcbmltcG9ydCB7XG4gIENhbGVuZGFyRXZlbnRPdmVybGFwTW9kZXMsXG59IGZyb20gJy4uL21vZGVzJ1xuaW1wb3J0IHtcbiAgZ2V0RGF5SWRlbnRpZmllciwgZGlmZk1pbnV0ZXMsXG59IGZyb20gJy4uL3V0aWwvdGltZXN0YW1wJ1xuaW1wb3J0IHtcbiAgcGFyc2VFdmVudCxcbiAgaXNFdmVudFN0YXJ0LFxuICBpc0V2ZW50T24sXG4gIGlzRXZlbnRPdmVybGFwcGluZyxcbn0gZnJvbSAnLi4vdXRpbC9ldmVudHMnXG5pbXBvcnQge1xuICBDYWxlbmRhclRpbWVzdGFtcCxcbiAgQ2FsZW5kYXJFdmVudFBhcnNlZCxcbiAgQ2FsZW5kYXJFdmVudFZpc3VhbCxcbiAgQ2FsZW5kYXJFdmVudENvbG9yRnVuY3Rpb24sXG4gIENhbGVuZGFyRXZlbnROYW1lRnVuY3Rpb24sXG4gIENhbGVuZGFyRXZlbnRUaW1lZEZ1bmN0aW9uLFxuICBDYWxlbmRhckRheVNsb3RTY29wZSxcbiAgQ2FsZW5kYXJEYXlCb2R5U2xvdFNjb3BlLFxuICBDYWxlbmRhckV2ZW50T3ZlcmxhcE1vZGUsXG4gIENhbGVuZGFyRXZlbnQsXG4gIENhbGVuZGFyRXZlbnRDYXRlZ29yeUZ1bmN0aW9uLFxufSBmcm9tICd2dWV0aWZ5L3R5cGVzJ1xuXG4vLyBUeXBlc1xudHlwZSBWRXZlbnRHZXR0ZXI8RD4gPSAoZGF5OiBEKSA9PiBDYWxlbmRhckV2ZW50UGFyc2VkW11cblxudHlwZSBWRXZlbnRWaXN1YWxUb05vZGU8RD4gPSAodmlzdWFsOiBDYWxlbmRhckV2ZW50VmlzdWFsLCBkYXk6IEQpID0+IFZOb2RlIHwgZmFsc2VcblxudHlwZSBWRXZlbnRzVG9Ob2RlcyA9IDxEIGV4dGVuZHMgQ2FsZW5kYXJEYXlTbG90U2NvcGU+KFxuICBkYXk6IEQsXG4gIGdldHRlcjogVkV2ZW50R2V0dGVyPEQ+LFxuICBtYXBwZXI6IFZFdmVudFZpc3VhbFRvTm9kZTxEPixcbiAgdGltZWQ6IGJvb2xlYW4pID0+IFZOb2RlW10gfCB1bmRlZmluZWRcblxudHlwZSBWRGFpbHlFdmVudHNNYXAgPSB7XG4gIFtkYXRlOiBzdHJpbmddOiB7XG4gICAgcGFyZW50OiBIVE1MRWxlbWVudFxuICAgIG1vcmU6IEhUTUxFbGVtZW50IHwgbnVsbFxuICAgIGV2ZW50czogSFRNTEVsZW1lbnRbXVxuICB9XG59XG5cbmludGVyZmFjZSBWRXZlbnRTY29wZUlucHV0IHtcbiAgZXZlbnRQYXJzZWQ6IENhbGVuZGFyRXZlbnRQYXJzZWRcbiAgZGF5OiBDYWxlbmRhckRheVNsb3RTY29wZVxuICBzdGFydDogYm9vbGVhblxuICBlbmQ6IGJvb2xlYW5cbiAgdGltZWQ6IGJvb2xlYW5cbn1cblxuY29uc3QgV0lEVEhfRlVMTCA9IDEwMFxuY29uc3QgV0lEVEhfU1RBUlQgPSA5NVxuY29uc3QgTUlOVVRFU19JTl9EQVkgPSAxNDQwXG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBDYWxlbmRhckJhc2UuZXh0ZW5kKHtcbiAgbmFtZTogJ2NhbGVuZGFyLXdpdGgtZXZlbnRzJyxcblxuICBkaXJlY3RpdmVzOiB7XG4gICAgcmlwcGxlLFxuICB9LFxuXG4gIHByb3BzOiBwcm9wcy5ldmVudHMsXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBub0V2ZW50cyAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5ldmVudHMubGVuZ3RoID09PSAwXG4gICAgfSxcbiAgICBwYXJzZWRFdmVudHMgKCk6IENhbGVuZGFyRXZlbnRQYXJzZWRbXSB7XG4gICAgICByZXR1cm4gdGhpcy5ldmVudHMubWFwKHRoaXMucGFyc2VFdmVudClcbiAgICB9LFxuICAgIHBhcnNlZEV2ZW50T3ZlcmxhcFRocmVzaG9sZCAoKTogbnVtYmVyIHtcbiAgICAgIHJldHVybiBwYXJzZUludCh0aGlzLmV2ZW50T3ZlcmxhcFRocmVzaG9sZClcbiAgICB9LFxuICAgIGV2ZW50Q29sb3JGdW5jdGlvbiAoKTogQ2FsZW5kYXJFdmVudENvbG9yRnVuY3Rpb24ge1xuICAgICAgcmV0dXJuIHR5cGVvZiB0aGlzLmV2ZW50Q29sb3IgPT09ICdmdW5jdGlvbidcbiAgICAgICAgPyB0aGlzLmV2ZW50Q29sb3JcbiAgICAgICAgOiAoKSA9PiAodGhpcy5ldmVudENvbG9yIGFzIHN0cmluZylcbiAgICB9LFxuICAgIGV2ZW50VGltZWRGdW5jdGlvbiAoKTogQ2FsZW5kYXJFdmVudFRpbWVkRnVuY3Rpb24ge1xuICAgICAgcmV0dXJuIHR5cGVvZiB0aGlzLmV2ZW50VGltZWQgPT09ICdmdW5jdGlvbidcbiAgICAgICAgPyB0aGlzLmV2ZW50VGltZWRcbiAgICAgICAgOiBldmVudCA9PiAhIWV2ZW50W3RoaXMuZXZlbnRUaW1lZCBhcyBzdHJpbmddXG4gICAgfSxcbiAgICBldmVudENhdGVnb3J5RnVuY3Rpb24gKCk6IENhbGVuZGFyRXZlbnRDYXRlZ29yeUZ1bmN0aW9uIHtcbiAgICAgIHJldHVybiB0eXBlb2YgdGhpcy5ldmVudENhdGVnb3J5ID09PSAnZnVuY3Rpb24nXG4gICAgICAgID8gdGhpcy5ldmVudENhdGVnb3J5XG4gICAgICAgIDogZXZlbnQgPT4gZXZlbnRbdGhpcy5ldmVudENhdGVnb3J5IGFzIHN0cmluZ11cbiAgICB9LFxuICAgIGV2ZW50VGV4dENvbG9yRnVuY3Rpb24gKCk6IENhbGVuZGFyRXZlbnRDb2xvckZ1bmN0aW9uIHtcbiAgICAgIHJldHVybiB0eXBlb2YgdGhpcy5ldmVudFRleHRDb2xvciA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgICA/IHRoaXMuZXZlbnRUZXh0Q29sb3JcbiAgICAgICAgOiAoKSA9PiB0aGlzLmV2ZW50VGV4dENvbG9yIGFzIHN0cmluZ1xuICAgIH0sXG4gICAgZXZlbnROYW1lRnVuY3Rpb24gKCk6IENhbGVuZGFyRXZlbnROYW1lRnVuY3Rpb24ge1xuICAgICAgcmV0dXJuIHR5cGVvZiB0aGlzLmV2ZW50TmFtZSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgICA/IHRoaXMuZXZlbnROYW1lXG4gICAgICAgIDogKGV2ZW50LCB0aW1lZEV2ZW50KSA9PiBlc2NhcGVIVE1MKGV2ZW50LmlucHV0W3RoaXMuZXZlbnROYW1lIGFzIHN0cmluZ10gYXMgc3RyaW5nKVxuICAgIH0sXG4gICAgZXZlbnRNb2RlRnVuY3Rpb24gKCk6IENhbGVuZGFyRXZlbnRPdmVybGFwTW9kZSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHRoaXMuZXZlbnRPdmVybGFwTW9kZSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgICA/IHRoaXMuZXZlbnRPdmVybGFwTW9kZVxuICAgICAgICA6IENhbGVuZGFyRXZlbnRPdmVybGFwTW9kZXNbdGhpcy5ldmVudE92ZXJsYXBNb2RlXVxuICAgIH0sXG4gICAgZXZlbnRXZWVrZGF5cyAoKTogbnVtYmVyW10ge1xuICAgICAgcmV0dXJuIHRoaXMucGFyc2VkV2Vla2RheXNcbiAgICB9LFxuICAgIGNhdGVnb3J5TW9kZSAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9LFxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBwYXJzZUV2ZW50IChpbnB1dDogQ2FsZW5kYXJFdmVudCwgaW5kZXggPSAwKTogQ2FsZW5kYXJFdmVudFBhcnNlZCB7XG4gICAgICByZXR1cm4gcGFyc2VFdmVudChcbiAgICAgICAgaW5wdXQsXG4gICAgICAgIGluZGV4LFxuICAgICAgICB0aGlzLmV2ZW50U3RhcnQsXG4gICAgICAgIHRoaXMuZXZlbnRFbmQsXG4gICAgICAgIHRoaXMuZXZlbnRUaW1lZEZ1bmN0aW9uKGlucHV0KSxcbiAgICAgICAgdGhpcy5jYXRlZ29yeU1vZGUgPyB0aGlzLmV2ZW50Q2F0ZWdvcnlGdW5jdGlvbihpbnB1dCkgOiBmYWxzZSxcbiAgICAgIClcbiAgICB9LFxuICAgIGZvcm1hdFRpbWUgKHdpdGhUaW1lOiBDYWxlbmRhclRpbWVzdGFtcCwgYW1wbTogYm9vbGVhbik6IHN0cmluZyB7XG4gICAgICBjb25zdCBmb3JtYXR0ZXIgPSB0aGlzLmdldEZvcm1hdHRlcih7XG4gICAgICAgIHRpbWVab25lOiAnVVRDJyxcbiAgICAgICAgaG91cjogJ251bWVyaWMnLFxuICAgICAgICBtaW51dGU6IHdpdGhUaW1lLm1pbnV0ZSA+IDAgPyAnbnVtZXJpYycgOiB1bmRlZmluZWQsXG4gICAgICB9KVxuXG4gICAgICByZXR1cm4gZm9ybWF0dGVyKHdpdGhUaW1lLCB0cnVlKVxuICAgIH0sXG4gICAgdXBkYXRlRXZlbnRWaXNpYmlsaXR5ICgpIHtcbiAgICAgIGlmICh0aGlzLm5vRXZlbnRzIHx8ICF0aGlzLmV2ZW50TW9yZSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29uc3QgZXZlbnRIZWlnaHQgPSB0aGlzLmV2ZW50SGVpZ2h0XG4gICAgICBjb25zdCBldmVudHNNYXAgPSB0aGlzLmdldEV2ZW50c01hcCgpXG5cbiAgICAgIGZvciAoY29uc3QgZGF0ZSBpbiBldmVudHNNYXApIHtcbiAgICAgICAgY29uc3QgeyBwYXJlbnQsIGV2ZW50cywgbW9yZSB9ID0gZXZlbnRzTWFwW2RhdGVdXG4gICAgICAgIGlmICghbW9yZSkge1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwYXJlbnRCb3VuZHMgPSBwYXJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgICAgY29uc3QgbGFzdCA9IGV2ZW50cy5sZW5ndGggLSAxXG4gICAgICAgIGxldCBoaWRlID0gZmFsc2VcbiAgICAgICAgbGV0IGhpZGRlbiA9IDBcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBsYXN0OyBpKyspIHtcbiAgICAgICAgICBpZiAoIWhpZGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50Qm91bmRzID0gZXZlbnRzW2ldLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgICAgICBoaWRlID0gaSA9PT0gbGFzdFxuICAgICAgICAgICAgICA/IChldmVudEJvdW5kcy5ib3R0b20gPiBwYXJlbnRCb3VuZHMuYm90dG9tKVxuICAgICAgICAgICAgICA6IChldmVudEJvdW5kcy5ib3R0b20gKyBldmVudEhlaWdodCA+IHBhcmVudEJvdW5kcy5ib3R0b20pXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChoaWRlKSB7XG4gICAgICAgICAgICBldmVudHNbaV0uc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgICAgICAgaGlkZGVuKytcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGlkZSkge1xuICAgICAgICAgIG1vcmUuc3R5bGUuZGlzcGxheSA9ICcnXG4gICAgICAgICAgbW9yZS5pbm5lckhUTUwgPSB0aGlzLiR2dWV0aWZ5LmxhbmcudCh0aGlzLmV2ZW50TW9yZVRleHQsIGhpZGRlbilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtb3JlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0RXZlbnRzTWFwICgpOiBWRGFpbHlFdmVudHNNYXAge1xuICAgICAgY29uc3QgZXZlbnRzTWFwOiBWRGFpbHlFdmVudHNNYXAgPSB7fVxuICAgICAgY29uc3QgZWxlbWVudHMgPSB0aGlzLiRyZWZzLmV2ZW50cyBhcyBIVE1MRWxlbWVudFtdXG5cbiAgICAgIGlmICghZWxlbWVudHMgfHwgIWVsZW1lbnRzLmZvckVhY2gpIHtcbiAgICAgICAgcmV0dXJuIGV2ZW50c01hcFxuICAgICAgfVxuXG4gICAgICBlbGVtZW50cy5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgY29uc3QgZGF0ZSA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1kYXRlJylcbiAgICAgICAgaWYgKGVsLnBhcmVudEVsZW1lbnQgJiYgZGF0ZSkge1xuICAgICAgICAgIGlmICghKGRhdGUgaW4gZXZlbnRzTWFwKSkge1xuICAgICAgICAgICAgZXZlbnRzTWFwW2RhdGVdID0ge1xuICAgICAgICAgICAgICBwYXJlbnQ6IGVsLnBhcmVudEVsZW1lbnQsXG4gICAgICAgICAgICAgIG1vcmU6IG51bGwsXG4gICAgICAgICAgICAgIGV2ZW50czogW10sXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbW9yZScpKSB7XG4gICAgICAgICAgICBldmVudHNNYXBbZGF0ZV0ubW9yZSA9IGVsXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGV2ZW50c01hcFtkYXRlXS5ldmVudHMucHVzaChlbClcbiAgICAgICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSAnJ1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgcmV0dXJuIGV2ZW50c01hcFxuICAgIH0sXG4gICAgZ2VuRGF5RXZlbnQgKHsgZXZlbnQgfTogQ2FsZW5kYXJFdmVudFZpc3VhbCwgZGF5OiBDYWxlbmRhckRheVNsb3RTY29wZSk6IFZOb2RlIHtcbiAgICAgIGNvbnN0IGV2ZW50SGVpZ2h0ID0gdGhpcy5ldmVudEhlaWdodFxuICAgICAgY29uc3QgZXZlbnRNYXJnaW5Cb3R0b20gPSB0aGlzLmV2ZW50TWFyZ2luQm90dG9tXG4gICAgICBjb25zdCBkYXlJZGVudGlmaWVyID0gZ2V0RGF5SWRlbnRpZmllcihkYXkpXG4gICAgICBjb25zdCB3ZWVrID0gZGF5LndlZWtcbiAgICAgIGNvbnN0IHN0YXJ0ID0gZGF5SWRlbnRpZmllciA9PT0gZXZlbnQuc3RhcnRJZGVudGlmaWVyXG4gICAgICBsZXQgZW5kID0gZGF5SWRlbnRpZmllciA9PT0gZXZlbnQuZW5kSWRlbnRpZmllclxuICAgICAgbGV0IHdpZHRoID0gV0lEVEhfU1RBUlRcblxuICAgICAgaWYgKCF0aGlzLmNhdGVnb3J5TW9kZSkge1xuICAgICAgICBmb3IgKGxldCBpID0gZGF5LmluZGV4ICsgMTsgaSA8IHdlZWsubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCB3ZWVrZGF5SWRlbnRpZmllciA9IGdldERheUlkZW50aWZpZXIod2Vla1tpXSlcbiAgICAgICAgICBpZiAoZXZlbnQuZW5kSWRlbnRpZmllciA+PSB3ZWVrZGF5SWRlbnRpZmllcikge1xuICAgICAgICAgICAgd2lkdGggKz0gV0lEVEhfRlVMTFxuICAgICAgICAgICAgZW5kID0gZW5kIHx8IHdlZWtkYXlJZGVudGlmaWVyID09PSBldmVudC5lbmRJZGVudGlmaWVyXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVuZCA9IHRydWVcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCBzY29wZSA9IHsgZXZlbnRQYXJzZWQ6IGV2ZW50LCBkYXksIHN0YXJ0LCBlbmQsIHRpbWVkOiBmYWxzZSB9XG5cbiAgICAgIHJldHVybiB0aGlzLmdlbkV2ZW50KGV2ZW50LCBzY29wZSwgZmFsc2UsIHtcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWV2ZW50JyxcbiAgICAgICAgY2xhc3M6IHtcbiAgICAgICAgICAndi1ldmVudC1zdGFydCc6IHN0YXJ0LFxuICAgICAgICAgICd2LWV2ZW50LWVuZCc6IGVuZCxcbiAgICAgICAgfSxcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICBoZWlnaHQ6IGAke2V2ZW50SGVpZ2h0fXB4YCxcbiAgICAgICAgICB3aWR0aDogYCR7d2lkdGh9JWAsXG4gICAgICAgICAgJ21hcmdpbi1ib3R0b20nOiBgJHtldmVudE1hcmdpbkJvdHRvbX1weGAsXG4gICAgICAgIH0sXG4gICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgJ2RhdGEtZGF0ZSc6IGRheS5kYXRlLFxuICAgICAgICB9LFxuICAgICAgICBrZXk6IGV2ZW50LmluZGV4LFxuICAgICAgICByZWY6ICdldmVudHMnLFxuICAgICAgICByZWZJbkZvcjogdHJ1ZSxcbiAgICAgIH0pXG4gICAgfSxcbiAgICBnZW5UaW1lZEV2ZW50ICh7IGV2ZW50LCBsZWZ0LCB3aWR0aCB9OiBDYWxlbmRhckV2ZW50VmlzdWFsLCBkYXk6IENhbGVuZGFyRGF5Qm9keVNsb3RTY29wZSk6IFZOb2RlIHwgZmFsc2Uge1xuICAgICAgaWYgKGRheS50aW1lRGVsdGEoZXZlbnQuZW5kKSA8PSAwIHx8IGRheS50aW1lRGVsdGEoZXZlbnQuc3RhcnQpID49IDEpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGRheUlkZW50aWZpZXIgPSBnZXREYXlJZGVudGlmaWVyKGRheSlcbiAgICAgIGNvbnN0IHN0YXJ0ID0gZXZlbnQuc3RhcnRJZGVudGlmaWVyID49IGRheUlkZW50aWZpZXJcbiAgICAgIGNvbnN0IGVuZCA9IGV2ZW50LmVuZElkZW50aWZpZXIgPiBkYXlJZGVudGlmaWVyXG4gICAgICBjb25zdCB0b3AgPSBzdGFydCA/IGRheS50aW1lVG9ZKGV2ZW50LnN0YXJ0KSA6IDBcbiAgICAgIGNvbnN0IGJvdHRvbSA9IGVuZCA/IGRheS50aW1lVG9ZKE1JTlVURVNfSU5fREFZKSA6IGRheS50aW1lVG9ZKGV2ZW50LmVuZClcbiAgICAgIGNvbnN0IGhlaWdodCA9IE1hdGgubWF4KHRoaXMuZXZlbnRIZWlnaHQsIGJvdHRvbSAtIHRvcClcbiAgICAgIGNvbnN0IHNjb3BlID0geyBldmVudFBhcnNlZDogZXZlbnQsIGRheSwgc3RhcnQsIGVuZCwgdGltZWQ6IHRydWUgfVxuXG4gICAgICByZXR1cm4gdGhpcy5nZW5FdmVudChldmVudCwgc2NvcGUsIHRydWUsIHtcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWV2ZW50LXRpbWVkJyxcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICB0b3A6IGAke3RvcH1weGAsXG4gICAgICAgICAgaGVpZ2h0OiBgJHtoZWlnaHR9cHhgLFxuICAgICAgICAgIGxlZnQ6IGAke2xlZnR9JWAsXG4gICAgICAgICAgd2lkdGg6IGAke3dpZHRofSVgLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9LFxuICAgIGdlbkV2ZW50IChldmVudDogQ2FsZW5kYXJFdmVudFBhcnNlZCwgc2NvcGVJbnB1dDogVkV2ZW50U2NvcGVJbnB1dCwgdGltZWRFdmVudDogYm9vbGVhbiwgZGF0YTogVk5vZGVEYXRhKTogVk5vZGUge1xuICAgICAgY29uc3Qgc2xvdCA9IHRoaXMuJHNjb3BlZFNsb3RzLmV2ZW50XG4gICAgICBjb25zdCB0ZXh0ID0gdGhpcy5ldmVudFRleHRDb2xvckZ1bmN0aW9uKGV2ZW50LmlucHV0KVxuICAgICAgY29uc3QgYmFja2dyb3VuZCA9IHRoaXMuZXZlbnRDb2xvckZ1bmN0aW9uKGV2ZW50LmlucHV0KVxuICAgICAgY29uc3Qgb3ZlcmxhcHNOb29uID0gZXZlbnQuc3RhcnQuaG91ciA8IDEyICYmIGV2ZW50LmVuZC5ob3VyID49IDEyXG4gICAgICBjb25zdCBzaW5nbGluZSA9IGRpZmZNaW51dGVzKGV2ZW50LnN0YXJ0LCBldmVudC5lbmQpIDw9IHRoaXMucGFyc2VkRXZlbnRPdmVybGFwVGhyZXNob2xkXG4gICAgICBjb25zdCBmb3JtYXRUaW1lID0gdGhpcy5mb3JtYXRUaW1lXG4gICAgICBjb25zdCB0aW1lU3VtbWFyeSA9ICgpID0+IGZvcm1hdFRpbWUoZXZlbnQuc3RhcnQsIG92ZXJsYXBzTm9vbikgKyAnIC0gJyArIGZvcm1hdFRpbWUoZXZlbnQuZW5kLCB0cnVlKVxuICAgICAgY29uc3QgZXZlbnRTdW1tYXJ5ID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBuYW1lID0gdGhpcy5ldmVudE5hbWVGdW5jdGlvbihldmVudCwgdGltZWRFdmVudClcblxuICAgICAgICBpZiAoZXZlbnQuc3RhcnQuaGFzVGltZSkge1xuICAgICAgICAgIGlmICh0aW1lZEV2ZW50KSB7XG4gICAgICAgICAgICBjb25zdCB0aW1lID0gdGltZVN1bW1hcnkoKVxuICAgICAgICAgICAgY29uc3QgZGVsaW1pdGVyID0gc2luZ2xpbmUgPyAnLCAnIDogJzxicj4nXG5cbiAgICAgICAgICAgIHJldHVybiBgPHN0cm9uZz4ke25hbWV9PC9zdHJvbmc+JHtkZWxpbWl0ZXJ9JHt0aW1lfWBcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgdGltZSA9IGZvcm1hdFRpbWUoZXZlbnQuc3RhcnQsIHRydWUpXG5cbiAgICAgICAgICAgIHJldHVybiBgPHN0cm9uZz4ke3RpbWV9PC9zdHJvbmc+ICR7bmFtZX1gXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5hbWVcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2NvcGUgPSB7XG4gICAgICAgIC4uLnNjb3BlSW5wdXQsXG4gICAgICAgIGV2ZW50OiBldmVudC5pbnB1dCxcbiAgICAgICAgb3V0c2lkZTogc2NvcGVJbnB1dC5kYXkub3V0c2lkZSxcbiAgICAgICAgc2luZ2xpbmUsXG4gICAgICAgIG92ZXJsYXBzTm9vbixcbiAgICAgICAgZm9ybWF0VGltZSxcbiAgICAgICAgdGltZVN1bW1hcnksXG4gICAgICAgIGV2ZW50U3VtbWFyeSxcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsXG4gICAgICAgIHRoaXMuc2V0VGV4dENvbG9yKHRleHQsXG4gICAgICAgICAgdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IoYmFja2dyb3VuZCwge1xuICAgICAgICAgICAgb246IHRoaXMuZ2V0RGVmYXVsdE1vdXNlRXZlbnRIYW5kbGVycygnOmV2ZW50JywgbmF0aXZlRXZlbnQgPT4gKHsgLi4uc2NvcGUsIG5hdGl2ZUV2ZW50IH0pKSxcbiAgICAgICAgICAgIGRpcmVjdGl2ZXM6IFt7XG4gICAgICAgICAgICAgIG5hbWU6ICdyaXBwbGUnLFxuICAgICAgICAgICAgICB2YWx1ZTogdGhpcy5ldmVudFJpcHBsZSAhPSBudWxsID8gdGhpcy5ldmVudFJpcHBsZSA6IHRydWUsXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICAgIC4uLmRhdGEsXG4gICAgICAgICAgfSlcbiAgICAgICAgKSwgc2xvdFxuICAgICAgICAgID8gc2xvdChzY29wZSlcbiAgICAgICAgICA6IFt0aGlzLmdlbk5hbWUoZXZlbnRTdW1tYXJ5KV1cbiAgICAgIClcbiAgICB9LFxuICAgIGdlbk5hbWUgKGV2ZW50U3VtbWFyeTogKCkgPT4gc3RyaW5nKTogVk5vZGUge1xuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgICAgc3RhdGljQ2xhc3M6ICdwbC0xJyxcbiAgICAgICAgZG9tUHJvcHM6IHtcbiAgICAgICAgICBpbm5lckhUTUw6IGV2ZW50U3VtbWFyeSgpLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9LFxuICAgIGdlblBsYWNlaG9sZGVyIChkYXk6IENhbGVuZGFyVGltZXN0YW1wKTogVk5vZGUge1xuICAgICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5ldmVudEhlaWdodCArIHRoaXMuZXZlbnRNYXJnaW5Cb3R0b21cblxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICBoZWlnaHQ6IGAke2hlaWdodH1weGAsXG4gICAgICAgIH0sXG4gICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgJ2RhdGEtZGF0ZSc6IGRheS5kYXRlLFxuICAgICAgICB9LFxuICAgICAgICByZWY6ICdldmVudHMnLFxuICAgICAgICByZWZJbkZvcjogdHJ1ZSxcbiAgICAgIH0pXG4gICAgfSxcbiAgICBnZW5Nb3JlIChkYXk6IENhbGVuZGFyRGF5U2xvdFNjb3BlKTogVk5vZGUge1xuICAgICAgY29uc3QgZXZlbnRIZWlnaHQgPSB0aGlzLmV2ZW50SGVpZ2h0XG4gICAgICBjb25zdCBldmVudE1hcmdpbkJvdHRvbSA9IHRoaXMuZXZlbnRNYXJnaW5Cb3R0b21cblxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWV2ZW50LW1vcmUgcGwtMScsXG4gICAgICAgIGNsYXNzOiB7XG4gICAgICAgICAgJ3Ytb3V0c2lkZSc6IGRheS5vdXRzaWRlLFxuICAgICAgICB9LFxuICAgICAgICBhdHRyczoge1xuICAgICAgICAgICdkYXRhLWRhdGUnOiBkYXkuZGF0ZSxcbiAgICAgICAgICAnZGF0YS1tb3JlJzogMSxcbiAgICAgICAgfSxcbiAgICAgICAgZGlyZWN0aXZlczogW3tcbiAgICAgICAgICBuYW1lOiAncmlwcGxlJyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5ldmVudFJpcHBsZSAhPSBudWxsID8gdGhpcy5ldmVudFJpcHBsZSA6IHRydWUsXG4gICAgICAgIH1dLFxuICAgICAgICBvbjoge1xuICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLiRlbWl0KCdjbGljazptb3JlJywgZGF5KSxcbiAgICAgICAgfSxcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICBkaXNwbGF5OiAnbm9uZScsXG4gICAgICAgICAgaGVpZ2h0OiBgJHtldmVudEhlaWdodH1weGAsXG4gICAgICAgICAgJ21hcmdpbi1ib3R0b20nOiBgJHtldmVudE1hcmdpbkJvdHRvbX1weGAsXG4gICAgICAgIH0sXG4gICAgICAgIHJlZjogJ2V2ZW50cycsXG4gICAgICAgIHJlZkluRm9yOiB0cnVlLFxuICAgICAgfSlcbiAgICB9LFxuICAgIGdldFZpc2libGVFdmVudHMgKCk6IENhbGVuZGFyRXZlbnRQYXJzZWRbXSB7XG4gICAgICBjb25zdCBzdGFydCA9IGdldERheUlkZW50aWZpZXIodGhpcy5kYXlzWzBdKVxuICAgICAgY29uc3QgZW5kID0gZ2V0RGF5SWRlbnRpZmllcih0aGlzLmRheXNbdGhpcy5kYXlzLmxlbmd0aCAtIDFdKVxuXG4gICAgICByZXR1cm4gdGhpcy5wYXJzZWRFdmVudHMuZmlsdGVyKFxuICAgICAgICBldmVudCA9PiBpc0V2ZW50T3ZlcmxhcHBpbmcoZXZlbnQsIHN0YXJ0LCBlbmQpXG4gICAgICApXG4gICAgfSxcbiAgICBpc0V2ZW50Rm9yQ2F0ZWdvcnkgKGV2ZW50OiBDYWxlbmRhckV2ZW50UGFyc2VkLCBjYXRlZ29yeTogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuICF0aGlzLmNhdGVnb3J5TW9kZSB8fFxuICAgICAgICBjYXRlZ29yeSA9PT0gZXZlbnQuY2F0ZWdvcnkgfHxcbiAgICAgICAgKHR5cGVvZiBldmVudC5jYXRlZ29yeSAhPT0gJ3N0cmluZycgJiYgY2F0ZWdvcnkgPT09IG51bGwpXG4gICAgfSxcbiAgICBnZXRFdmVudHNGb3JEYXkgKGRheTogQ2FsZW5kYXJEYXlTbG90U2NvcGUpOiBDYWxlbmRhckV2ZW50UGFyc2VkW10ge1xuICAgICAgY29uc3QgaWRlbnRpZmllciA9IGdldERheUlkZW50aWZpZXIoZGF5KVxuICAgICAgY29uc3QgZmlyc3RXZWVrZGF5ID0gdGhpcy5ldmVudFdlZWtkYXlzWzBdXG5cbiAgICAgIHJldHVybiB0aGlzLnBhcnNlZEV2ZW50cy5maWx0ZXIoXG4gICAgICAgIGV2ZW50ID0+IGlzRXZlbnRTdGFydChldmVudCwgZGF5LCBpZGVudGlmaWVyLCBmaXJzdFdlZWtkYXkpXG4gICAgICApXG4gICAgfSxcbiAgICBnZXRFdmVudHNGb3JEYXlBbGwgKGRheTogQ2FsZW5kYXJEYXlTbG90U2NvcGUpOiBDYWxlbmRhckV2ZW50UGFyc2VkW10ge1xuICAgICAgY29uc3QgaWRlbnRpZmllciA9IGdldERheUlkZW50aWZpZXIoZGF5KVxuICAgICAgY29uc3QgZmlyc3RXZWVrZGF5ID0gdGhpcy5ldmVudFdlZWtkYXlzWzBdXG5cbiAgICAgIHJldHVybiB0aGlzLnBhcnNlZEV2ZW50cy5maWx0ZXIoXG4gICAgICAgIGV2ZW50ID0+IGV2ZW50LmFsbERheSAmJlxuICAgICAgICAgICh0aGlzLmNhdGVnb3J5TW9kZSA/IGlzRXZlbnRPbihldmVudCwgaWRlbnRpZmllcikgOiBpc0V2ZW50U3RhcnQoZXZlbnQsIGRheSwgaWRlbnRpZmllciwgZmlyc3RXZWVrZGF5KSkgJiZcbiAgICAgICAgICB0aGlzLmlzRXZlbnRGb3JDYXRlZ29yeShldmVudCwgZGF5LmNhdGVnb3J5KVxuICAgICAgKVxuICAgIH0sXG4gICAgZ2V0RXZlbnRzRm9yRGF5VGltZWQgKGRheTogQ2FsZW5kYXJEYXlTbG90U2NvcGUpOiBDYWxlbmRhckV2ZW50UGFyc2VkW10ge1xuICAgICAgY29uc3QgaWRlbnRpZmllciA9IGdldERheUlkZW50aWZpZXIoZGF5KVxuXG4gICAgICByZXR1cm4gdGhpcy5wYXJzZWRFdmVudHMuZmlsdGVyKFxuICAgICAgICBldmVudCA9PiAhZXZlbnQuYWxsRGF5ICYmXG4gICAgICAgICAgaXNFdmVudE9uKGV2ZW50LCBpZGVudGlmaWVyKSAmJlxuICAgICAgICAgIHRoaXMuaXNFdmVudEZvckNhdGVnb3J5KGV2ZW50LCBkYXkuY2F0ZWdvcnkpXG4gICAgICApXG4gICAgfSxcbiAgICBnZXRTY29wZWRTbG90cyAoKSB7XG4gICAgICBpZiAodGhpcy5ub0V2ZW50cykge1xuICAgICAgICByZXR1cm4geyAuLi50aGlzLiRzY29wZWRTbG90cyB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1vZGUgPSB0aGlzLmV2ZW50TW9kZUZ1bmN0aW9uKFxuICAgICAgICB0aGlzLnBhcnNlZEV2ZW50cyxcbiAgICAgICAgdGhpcy5ldmVudFdlZWtkYXlzWzBdLFxuICAgICAgICB0aGlzLnBhcnNlZEV2ZW50T3ZlcmxhcFRocmVzaG9sZFxuICAgICAgKVxuXG4gICAgICBjb25zdCBpc05vZGUgPSAoaW5wdXQ6IFZOb2RlIHwgZmFsc2UpOiBpbnB1dCBpcyBWTm9kZSA9PiAhIWlucHV0XG4gICAgICBjb25zdCBnZXRTbG90Q2hpbGRyZW46IFZFdmVudHNUb05vZGVzID0gKGRheSwgZ2V0dGVyLCBtYXBwZXIsIHRpbWVkKSA9PiB7XG4gICAgICAgIGNvbnN0IGV2ZW50cyA9IGdldHRlcihkYXkpXG4gICAgICAgIGNvbnN0IHZpc3VhbHMgPSBtb2RlKGRheSwgZXZlbnRzLCB0aW1lZCwgdGhpcy5jYXRlZ29yeU1vZGUpXG5cbiAgICAgICAgaWYgKHRpbWVkKSB7XG4gICAgICAgICAgcmV0dXJuIHZpc3VhbHMubWFwKHZpc3VhbCA9PiBtYXBwZXIodmlzdWFsLCBkYXkpKS5maWx0ZXIoaXNOb2RlKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY2hpbGRyZW46IFZOb2RlW10gPSBbXVxuXG4gICAgICAgIHZpc3VhbHMuZm9yRWFjaCgodmlzdWFsLCBpbmRleCkgPT4ge1xuICAgICAgICAgIHdoaWxlIChjaGlsZHJlbi5sZW5ndGggPCB2aXN1YWwuY29sdW1uKSB7XG4gICAgICAgICAgICBjaGlsZHJlbi5wdXNoKHRoaXMuZ2VuUGxhY2Vob2xkZXIoZGF5KSlcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBtYXBwZWQgPSBtYXBwZXIodmlzdWFsLCBkYXkpXG4gICAgICAgICAgaWYgKG1hcHBlZCkge1xuICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChtYXBwZWQpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiBjaGlsZHJlblxuICAgICAgfVxuXG4gICAgICBjb25zdCBzbG90cyA9IHRoaXMuJHNjb3BlZFNsb3RzXG4gICAgICBjb25zdCBzbG90RGF5ID0gc2xvdHMuZGF5XG4gICAgICBjb25zdCBzbG90RGF5SGVhZGVyID0gc2xvdHNbJ2RheS1oZWFkZXInXVxuICAgICAgY29uc3Qgc2xvdERheUJvZHkgPSBzbG90c1snZGF5LWJvZHknXVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5zbG90cyxcbiAgICAgICAgZGF5OiAoZGF5OiBDYWxlbmRhckRheVNsb3RTY29wZSkgPT4ge1xuICAgICAgICAgIGxldCBjaGlsZHJlbiA9IGdldFNsb3RDaGlsZHJlbihkYXksIHRoaXMuZ2V0RXZlbnRzRm9yRGF5LCB0aGlzLmdlbkRheUV2ZW50LCBmYWxzZSlcbiAgICAgICAgICBpZiAoY2hpbGRyZW4gJiYgY2hpbGRyZW4ubGVuZ3RoID4gMCAmJiB0aGlzLmV2ZW50TW9yZSkge1xuICAgICAgICAgICAgY2hpbGRyZW4ucHVzaCh0aGlzLmdlbk1vcmUoZGF5KSlcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHNsb3REYXkpIHtcbiAgICAgICAgICAgIGNvbnN0IHNsb3QgPSBzbG90RGF5KGRheSlcbiAgICAgICAgICAgIGlmIChzbG90KSB7XG4gICAgICAgICAgICAgIGNoaWxkcmVuID0gY2hpbGRyZW4gPyBjaGlsZHJlbi5jb25jYXQoc2xvdCkgOiBzbG90XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBjaGlsZHJlblxuICAgICAgICB9LFxuICAgICAgICAnZGF5LWhlYWRlcic6IChkYXk6IENhbGVuZGFyRGF5U2xvdFNjb3BlKSA9PiB7XG4gICAgICAgICAgbGV0IGNoaWxkcmVuID0gZ2V0U2xvdENoaWxkcmVuKGRheSwgdGhpcy5nZXRFdmVudHNGb3JEYXlBbGwsIHRoaXMuZ2VuRGF5RXZlbnQsIGZhbHNlKVxuXG4gICAgICAgICAgaWYgKHNsb3REYXlIZWFkZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IHNsb3QgPSBzbG90RGF5SGVhZGVyKGRheSlcbiAgICAgICAgICAgIGlmIChzbG90KSB7XG4gICAgICAgICAgICAgIGNoaWxkcmVuID0gY2hpbGRyZW4gPyBjaGlsZHJlbi5jb25jYXQoc2xvdCkgOiBzbG90XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBjaGlsZHJlblxuICAgICAgICB9LFxuICAgICAgICAnZGF5LWJvZHknOiAoZGF5OiBDYWxlbmRhckRheUJvZHlTbG90U2NvcGUpID0+IHtcbiAgICAgICAgICBjb25zdCBldmVudHMgPSBnZXRTbG90Q2hpbGRyZW4oZGF5LCB0aGlzLmdldEV2ZW50c0ZvckRheVRpbWVkLCB0aGlzLmdlblRpbWVkRXZlbnQsIHRydWUpXG4gICAgICAgICAgbGV0IGNoaWxkcmVuOiBWTm9kZVtdID0gW1xuICAgICAgICAgICAgdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICAgICAgICBzdGF0aWNDbGFzczogJ3YtZXZlbnQtdGltZWQtY29udGFpbmVyJyxcbiAgICAgICAgICAgIH0sIGV2ZW50cyksXG4gICAgICAgICAgXVxuXG4gICAgICAgICAgaWYgKHNsb3REYXlCb2R5KSB7XG4gICAgICAgICAgICBjb25zdCBzbG90ID0gc2xvdERheUJvZHkoZGF5KVxuICAgICAgICAgICAgaWYgKHNsb3QpIHtcbiAgICAgICAgICAgICAgY2hpbGRyZW4gPSBjaGlsZHJlbi5jb25jYXQoc2xvdClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGNoaWxkcmVuXG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgfSxcbiAgfSxcbn0pXG4iXX0=