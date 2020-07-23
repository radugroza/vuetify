// Components
import VDatePickerTitle from './VDatePickerTitle';
import VDatePickerHeader from './VDatePickerHeader';
import VDatePickerDateTable from './VDatePickerDateTable';
import VDatePickerMonthTable from './VDatePickerMonthTable';
import VDatePickerYears from './VDatePickerYears';
// Mixins
import Localable from '../../mixins/localable';
import Picker from '../../mixins/picker';
// Utils
import isDateAllowed from './util/isDateAllowed';
import mixins from '../../util/mixins';
import { wrapInArray } from '../../util/helpers';
import { daysInMonth } from '../VCalendar/util/timestamp';
import { consoleWarn } from '../../util/console';
import { createItemTypeListeners, createNativeLocaleFormatter, pad, } from './util';
// Adds leading zero to month/day if necessary, returns 'YYYY' if type = 'year',
// 'YYYY-MM' if 'month' and 'YYYY-MM-DD' if 'date'
function sanitizeDateString(dateString, type) {
    const [year, month = 1, date = 1] = dateString.split('-');
    return `${year}-${pad(month)}-${pad(date)}`.substr(0, { date: 10, month: 7, year: 4 }[type]);
}
export default mixins(Localable, Picker).extend({
    name: 'v-date-picker',
    props: {
        allowedDates: Function,
        // Function formatting the day in date picker table
        dayFormat: Function,
        disabled: Boolean,
        events: {
            type: [Array, Function, Object],
            default: () => null,
        },
        eventColor: {
            type: [Array, Function, Object, String],
            default: () => 'warning',
        },
        firstDayOfWeek: {
            type: [String, Number],
            default: 0,
        },
        // Function formatting the tableDate in the day/month table header
        headerDateFormat: Function,
        localeFirstDayOfYear: {
            type: [String, Number],
            default: 0,
        },
        max: String,
        min: String,
        // Function formatting month in the months table
        monthFormat: Function,
        multiple: Boolean,
        nextIcon: {
            type: String,
            default: '$next',
        },
        nextMonthAriaLabel: {
            type: String,
            default: '$vuetify.datePicker.nextMonthAriaLabel',
        },
        nextYearAriaLabel: {
            type: String,
            default: '$vuetify.datePicker.nextYearAriaLabel',
        },
        pickerDate: String,
        prevIcon: {
            type: String,
            default: '$prev',
        },
        prevMonthAriaLabel: {
            type: String,
            default: '$vuetify.datePicker.prevMonthAriaLabel',
        },
        prevYearAriaLabel: {
            type: String,
            default: '$vuetify.datePicker.prevYearAriaLabel',
        },
        range: Boolean,
        reactive: Boolean,
        readonly: Boolean,
        scrollable: Boolean,
        showCurrent: {
            type: [Boolean, String],
            default: true,
        },
        selectedItemsText: {
            type: String,
            default: '$vuetify.datePicker.itemsSelected',
        },
        showWeek: Boolean,
        // Function formatting currently selected date in the picker title
        titleDateFormat: Function,
        type: {
            type: String,
            default: 'date',
            validator: (type) => ['date', 'month'].includes(type),
        },
        value: [Array, String],
        weekdayFormat: Function,
        // Function formatting the year in table header and pickup title
        yearFormat: Function,
        yearIcon: String,
    },
    data() {
        const now = new Date();
        return {
            activePicker: this.type.toUpperCase(),
            inputDay: null,
            inputMonth: null,
            inputYear: null,
            isReversing: false,
            now,
            // tableDate is a string in 'YYYY' / 'YYYY-M' format (leading zero for month is not required)
            tableDate: (() => {
                if (this.pickerDate) {
                    return this.pickerDate;
                }
                const multipleValue = wrapInArray(this.value);
                const date = multipleValue[multipleValue.length - 1] ||
                    (typeof this.showCurrent === 'string' ? this.showCurrent : `${now.getFullYear()}-${now.getMonth() + 1}`);
                return sanitizeDateString(date, this.type === 'date' ? 'month' : 'year');
            })(),
        };
    },
    computed: {
        multipleValue() {
            return wrapInArray(this.value);
        },
        isMultiple() {
            return this.multiple || this.range;
        },
        lastValue() {
            return this.isMultiple ? this.multipleValue[this.multipleValue.length - 1] : this.value;
        },
        selectedMonths() {
            if (!this.value || this.type === 'month') {
                return this.value;
            }
            else if (this.isMultiple) {
                return this.multipleValue.map(val => val.substr(0, 7));
            }
            else {
                return this.value.substr(0, 7);
            }
        },
        current() {
            if (this.showCurrent === true) {
                return sanitizeDateString(`${this.now.getFullYear()}-${this.now.getMonth() + 1}-${this.now.getDate()}`, this.type);
            }
            return this.showCurrent || null;
        },
        inputDate() {
            return this.type === 'date'
                ? `${this.inputYear}-${pad(this.inputMonth + 1)}-${pad(this.inputDay)}`
                : `${this.inputYear}-${pad(this.inputMonth + 1)}`;
        },
        tableMonth() {
            return Number((this.pickerDate || this.tableDate).split('-')[1]) - 1;
        },
        tableYear() {
            return Number((this.pickerDate || this.tableDate).split('-')[0]);
        },
        minMonth() {
            return this.min ? sanitizeDateString(this.min, 'month') : null;
        },
        maxMonth() {
            return this.max ? sanitizeDateString(this.max, 'month') : null;
        },
        minYear() {
            return this.min ? sanitizeDateString(this.min, 'year') : null;
        },
        maxYear() {
            return this.max ? sanitizeDateString(this.max, 'year') : null;
        },
        formatters() {
            return {
                year: this.yearFormat || createNativeLocaleFormatter(this.currentLocale, { year: 'numeric', timeZone: 'UTC' }, { length: 4 }),
                titleDate: this.titleDateFormat ||
                    (this.isMultiple ? this.defaultTitleMultipleDateFormatter : this.defaultTitleDateFormatter),
            };
        },
        defaultTitleMultipleDateFormatter() {
            return dates => {
                if (!dates.length) {
                    return '-';
                }
                if (dates.length === 1) {
                    return this.defaultTitleDateFormatter(dates[0]);
                }
                return this.$vuetify.lang.t(this.selectedItemsText, dates.length);
            };
        },
        defaultTitleDateFormatter() {
            const titleFormats = {
                year: { year: 'numeric', timeZone: 'UTC' },
                month: { month: 'long', timeZone: 'UTC' },
                date: { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' },
            };
            const titleDateFormatter = createNativeLocaleFormatter(this.currentLocale, titleFormats[this.type], {
                start: 0,
                length: { date: 10, month: 7, year: 4 }[this.type],
            });
            const landscapeFormatter = (date) => titleDateFormatter(date)
                .replace(/([^\d\s])([\d])/g, (match, nonDigit, digit) => `${nonDigit} ${digit}`)
                .replace(', ', ',<br>');
            return this.landscape ? landscapeFormatter : titleDateFormatter;
        },
    },
    watch: {
        tableDate(val, prev) {
            // Make a ISO 8601 strings from val and prev for comparision, otherwise it will incorrectly
            // compare for example '2000-9' and '2000-10'
            const sanitizeType = this.type === 'month' ? 'year' : 'month';
            this.isReversing = sanitizeDateString(val, sanitizeType) < sanitizeDateString(prev, sanitizeType);
            this.$emit('update:picker-date', val);
        },
        pickerDate(val) {
            if (val) {
                this.tableDate = val;
            }
            else if (this.lastValue && this.type === 'date') {
                this.tableDate = sanitizeDateString(this.lastValue, 'month');
            }
            else if (this.lastValue && this.type === 'month') {
                this.tableDate = sanitizeDateString(this.lastValue, 'year');
            }
        },
        value(newValue, oldValue) {
            this.checkMultipleProp();
            this.setInputDate();
            if (!this.isMultiple && this.value && !this.pickerDate) {
                this.tableDate = sanitizeDateString(this.inputDate, this.type === 'month' ? 'year' : 'month');
            }
            else if (this.isMultiple && this.multipleValue.length && (!oldValue || !oldValue.length) && !this.pickerDate) {
                this.tableDate = sanitizeDateString(this.inputDate, this.type === 'month' ? 'year' : 'month');
            }
        },
        type(type) {
            this.activePicker = type.toUpperCase();
            if (this.value && this.value.length) {
                const output = this.multipleValue
                    .map((val) => sanitizeDateString(val, type))
                    .filter(this.isDateAllowed);
                this.$emit('input', this.isMultiple ? output : output[0]);
            }
        },
    },
    created() {
        this.checkMultipleProp();
        if (this.pickerDate !== this.tableDate) {
            this.$emit('update:picker-date', this.tableDate);
        }
        this.setInputDate();
    },
    methods: {
        emitInput(newInput) {
            if (this.range) {
                if (this.multipleValue.length !== 1) {
                    this.$emit('input', [newInput]);
                }
                else {
                    const output = [this.multipleValue[0], newInput];
                    this.$emit('input', output);
                    this.$emit('change', output);
                }
                return;
            }
            const output = this.multiple
                ? (this.multipleValue.indexOf(newInput) === -1
                    ? this.multipleValue.concat([newInput])
                    : this.multipleValue.filter(x => x !== newInput))
                : newInput;
            this.$emit('input', output);
            this.multiple || this.$emit('change', newInput);
        },
        checkMultipleProp() {
            if (this.value == null)
                return;
            const valueType = this.value.constructor.name;
            const expected = this.isMultiple ? 'Array' : 'String';
            if (valueType !== expected) {
                consoleWarn(`Value must be ${this.isMultiple ? 'an' : 'a'} ${expected}, got ${valueType}`, this);
            }
        },
        isDateAllowed(value) {
            return isDateAllowed(value, this.min, this.max, this.allowedDates);
        },
        yearClick(value) {
            this.inputYear = value;
            if (this.type === 'month') {
                this.tableDate = `${value}`;
            }
            else {
                this.tableDate = `${value}-${pad((this.tableMonth || 0) + 1)}`;
            }
            this.activePicker = 'MONTH';
            if (this.reactive && !this.readonly && !this.isMultiple && this.isDateAllowed(this.inputDate)) {
                this.$emit('input', this.inputDate);
            }
        },
        monthClick(value) {
            this.inputYear = parseInt(value.split('-')[0], 10);
            this.inputMonth = parseInt(value.split('-')[1], 10) - 1;
            if (this.type === 'date') {
                if (this.inputDay) {
                    this.inputDay = Math.min(this.inputDay, daysInMonth(this.inputYear, this.inputMonth + 1));
                }
                this.tableDate = value;
                this.activePicker = 'DATE';
                if (this.reactive && !this.readonly && !this.isMultiple && this.isDateAllowed(this.inputDate)) {
                    this.$emit('input', this.inputDate);
                }
            }
            else {
                this.emitInput(this.inputDate);
            }
        },
        dateClick(value) {
            this.inputYear = parseInt(value.split('-')[0], 10);
            this.inputMonth = parseInt(value.split('-')[1], 10) - 1;
            this.inputDay = parseInt(value.split('-')[2], 10);
            this.emitInput(this.inputDate);
        },
        genPickerTitle() {
            return this.$createElement(VDatePickerTitle, {
                props: {
                    date: this.value ? this.formatters.titleDate(this.isMultiple ? this.multipleValue : this.value) : '',
                    disabled: this.disabled,
                    readonly: this.readonly,
                    selectingYear: this.activePicker === 'YEAR',
                    year: this.formatters.year(this.multipleValue.length ? `${this.inputYear}` : this.tableDate),
                    yearIcon: this.yearIcon,
                    value: this.multipleValue[0],
                },
                slot: 'title',
                on: {
                    'update:selecting-year': (value) => this.activePicker = value ? 'YEAR' : this.type.toUpperCase(),
                },
            });
        },
        genTableHeader() {
            return this.$createElement(VDatePickerHeader, {
                props: {
                    nextIcon: this.nextIcon,
                    color: this.color,
                    dark: this.dark,
                    disabled: this.disabled,
                    format: this.headerDateFormat,
                    light: this.light,
                    locale: this.locale,
                    min: this.activePicker === 'DATE' ? this.minMonth : this.minYear,
                    max: this.activePicker === 'DATE' ? this.maxMonth : this.maxYear,
                    nextAriaLabel: this.activePicker === 'DATE' ? this.nextMonthAriaLabel : this.nextYearAriaLabel,
                    prevAriaLabel: this.activePicker === 'DATE' ? this.prevMonthAriaLabel : this.prevYearAriaLabel,
                    prevIcon: this.prevIcon,
                    readonly: this.readonly,
                    value: this.activePicker === 'DATE' ? `${pad(this.tableYear, 4)}-${pad(this.tableMonth + 1)}` : `${pad(this.tableYear, 4)}`,
                },
                on: {
                    toggle: () => this.activePicker = (this.activePicker === 'DATE' ? 'MONTH' : 'YEAR'),
                    input: (value) => this.tableDate = value,
                },
            });
        },
        genDateTable() {
            return this.$createElement(VDatePickerDateTable, {
                props: {
                    allowedDates: this.allowedDates,
                    color: this.color,
                    current: this.current,
                    dark: this.dark,
                    disabled: this.disabled,
                    events: this.events,
                    eventColor: this.eventColor,
                    firstDayOfWeek: this.firstDayOfWeek,
                    format: this.dayFormat,
                    light: this.light,
                    locale: this.locale,
                    localeFirstDayOfYear: this.localeFirstDayOfYear,
                    min: this.min,
                    max: this.max,
                    range: this.range,
                    readonly: this.readonly,
                    scrollable: this.scrollable,
                    showWeek: this.showWeek,
                    tableDate: `${pad(this.tableYear, 4)}-${pad(this.tableMonth + 1)}`,
                    value: this.value,
                    weekdayFormat: this.weekdayFormat,
                },
                ref: 'table',
                on: {
                    input: this.dateClick,
                    'update:table-date': (value) => this.tableDate = value,
                    ...createItemTypeListeners(this, ':date'),
                },
            });
        },
        genMonthTable() {
            return this.$createElement(VDatePickerMonthTable, {
                props: {
                    allowedDates: this.type === 'month' ? this.allowedDates : null,
                    color: this.color,
                    current: this.current ? sanitizeDateString(this.current, 'month') : null,
                    dark: this.dark,
                    disabled: this.disabled,
                    events: this.type === 'month' ? this.events : null,
                    eventColor: this.type === 'month' ? this.eventColor : null,
                    format: this.monthFormat,
                    light: this.light,
                    locale: this.locale,
                    min: this.minMonth,
                    max: this.maxMonth,
                    range: this.range,
                    readonly: this.readonly && this.type === 'month',
                    scrollable: this.scrollable,
                    value: this.selectedMonths,
                    tableDate: `${pad(this.tableYear, 4)}`,
                },
                ref: 'table',
                on: {
                    input: this.monthClick,
                    'update:table-date': (value) => this.tableDate = value,
                    ...createItemTypeListeners(this, ':month'),
                },
            });
        },
        genYears() {
            return this.$createElement(VDatePickerYears, {
                props: {
                    color: this.color,
                    format: this.yearFormat,
                    locale: this.locale,
                    min: this.minYear,
                    max: this.maxYear,
                    value: this.tableYear,
                },
                on: {
                    input: this.yearClick,
                    ...createItemTypeListeners(this, ':year'),
                },
            });
        },
        genPickerBody() {
            const children = this.activePicker === 'YEAR' ? [
                this.genYears(),
            ] : [
                this.genTableHeader(),
                this.activePicker === 'DATE' ? this.genDateTable() : this.genMonthTable(),
            ];
            return this.$createElement('div', {
                key: this.activePicker,
            }, children);
        },
        setInputDate() {
            if (this.lastValue) {
                const array = this.lastValue.split('-');
                this.inputYear = parseInt(array[0], 10);
                this.inputMonth = parseInt(array[1], 10) - 1;
                if (this.type === 'date') {
                    this.inputDay = parseInt(array[2], 10);
                }
            }
            else {
                this.inputYear = this.inputYear || this.now.getFullYear();
                this.inputMonth = this.inputMonth == null ? this.inputMonth : this.now.getMonth();
                this.inputDay = this.inputDay || this.now.getDate();
            }
        },
    },
    render() {
        return this.genPicker('v-picker--date');
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkRhdGVQaWNrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WRGF0ZVBpY2tlci9WRGF0ZVBpY2tlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxhQUFhO0FBQ2IsT0FBTyxnQkFBZ0IsTUFBTSxvQkFBb0IsQ0FBQTtBQUNqRCxPQUFPLGlCQUFpQixNQUFNLHFCQUFxQixDQUFBO0FBQ25ELE9BQU8sb0JBQW9CLE1BQU0sd0JBQXdCLENBQUE7QUFDekQsT0FBTyxxQkFBcUIsTUFBTSx5QkFBeUIsQ0FBQTtBQUMzRCxPQUFPLGdCQUFnQixNQUFNLG9CQUFvQixDQUFBO0FBRWpELFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLE1BQU0sTUFBTSxxQkFBcUIsQ0FBQTtBQUV4QyxRQUFRO0FBQ1IsT0FBTyxhQUFhLE1BQU0sc0JBQXNCLENBQUE7QUFDaEQsT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFDdEMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQ2hELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQTtBQUN6RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFDaEQsT0FBTyxFQUNMLHVCQUF1QixFQUN2QiwyQkFBMkIsRUFDM0IsR0FBRyxHQUNKLE1BQU0sUUFBUSxDQUFBO0FBdUJmLGdGQUFnRjtBQUNoRixrREFBa0Q7QUFDbEQsU0FBUyxrQkFBa0IsQ0FBRSxVQUFrQixFQUFFLElBQStCO0lBQzlFLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUN6RCxPQUFPLEdBQUcsSUFBSSxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFH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QyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFBO2dCQUM1QyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTSxFQUFFO29CQUN4QixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7aUJBQ3ZDO2FBQ0Y7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUE7Z0JBQ3pELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUE7Z0JBQ2pGLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFBO2FBQ3BEO1FBQ0gsQ0FBQztLQUNGO0lBRUQsTUFBTTtRQUNKLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0lBQ3pDLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb21wb25lbnRzXG5pbXBvcnQgVkRhdGVQaWNrZXJUaXRsZSBmcm9tICcuL1ZEYXRlUGlja2VyVGl0bGUnXG5pbXBvcnQgVkRhdGVQaWNrZXJIZWFkZXIgZnJvbSAnLi9WRGF0ZVBpY2tlckhlYWRlcidcbmltcG9ydCBWRGF0ZVBpY2tlckRhdGVUYWJsZSBmcm9tICcuL1ZEYXRlUGlja2VyRGF0ZVRhYmxlJ1xuaW1wb3J0IFZEYXRlUGlja2VyTW9udGhUYWJsZSBmcm9tICcuL1ZEYXRlUGlja2VyTW9udGhUYWJsZSdcbmltcG9ydCBWRGF0ZVBpY2tlclllYXJzIGZyb20gJy4vVkRhdGVQaWNrZXJZZWFycydcblxuLy8gTWl4aW5zXG5pbXBvcnQgTG9jYWxhYmxlIGZyb20gJy4uLy4uL21peGlucy9sb2NhbGFibGUnXG5pbXBvcnQgUGlja2VyIGZyb20gJy4uLy4uL21peGlucy9waWNrZXInXG5cbi8vIFV0aWxzXG5pbXBvcnQgaXNEYXRlQWxsb3dlZCBmcm9tICcuL3V0aWwvaXNEYXRlQWxsb3dlZCdcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5pbXBvcnQgeyB3cmFwSW5BcnJheSB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcbmltcG9ydCB7IGRheXNJbk1vbnRoIH0gZnJvbSAnLi4vVkNhbGVuZGFyL3V0aWwvdGltZXN0YW1wJ1xuaW1wb3J0IHsgY29uc29sZVdhcm4gfSBmcm9tICcuLi8uLi91dGlsL2NvbnNvbGUnXG5pbXBvcnQge1xuICBjcmVhdGVJdGVtVHlwZUxpc3RlbmVycyxcbiAgY3JlYXRlTmF0aXZlTG9jYWxlRm9ybWF0dGVyLFxuICBwYWQsXG59IGZyb20gJy4vdXRpbCdcblxuLy8gVHlwZXNcbmltcG9ydCB7XG4gIFByb3BUeXBlLFxuICBQcm9wVmFsaWRhdG9yLFxufSBmcm9tICd2dWUvdHlwZXMvb3B0aW9ucydcbmltcG9ydCB7IFZOb2RlIH0gZnJvbSAndnVlJ1xuaW1wb3J0IHtcbiAgRGF0ZVBpY2tlckZvcm1hdHRlcixcbiAgRGF0ZVBpY2tlck11bHRpcGxlRm9ybWF0dGVyLFxuICBEYXRlUGlja2VyQWxsb3dlZERhdGVzRnVuY3Rpb24sXG4gIERhdGVQaWNrZXJFdmVudENvbG9ycyxcbiAgRGF0ZVBpY2tlckV2ZW50cyxcbiAgRGF0ZVBpY2tlclR5cGUsXG59IGZyb20gJ3Z1ZXRpZnkvdHlwZXMnXG5cbnR5cGUgRGF0ZVBpY2tlclZhbHVlID0gc3RyaW5nIHwgc3RyaW5nW10gfCB1bmRlZmluZWRcbmludGVyZmFjZSBGb3JtYXR0ZXJzIHtcbiAgeWVhcjogRGF0ZVBpY2tlckZvcm1hdHRlclxuICB0aXRsZURhdGU6IERhdGVQaWNrZXJGb3JtYXR0ZXIgfCBEYXRlUGlja2VyTXVsdGlwbGVGb3JtYXR0ZXJcbn1cblxuLy8gQWRkcyBsZWFkaW5nIHplcm8gdG8gbW9udGgvZGF5IGlmIG5lY2Vzc2FyeSwgcmV0dXJucyAnWVlZWScgaWYgdHlwZSA9ICd5ZWFyJyxcbi8vICdZWVlZLU1NJyBpZiAnbW9udGgnIGFuZCAnWVlZWS1NTS1ERCcgaWYgJ2RhdGUnXG5mdW5jdGlvbiBzYW5pdGl6ZURhdGVTdHJpbmcgKGRhdGVTdHJpbmc6IHN0cmluZywgdHlwZTogJ2RhdGUnIHwgJ21vbnRoJyB8ICd5ZWFyJyk6IHN0cmluZyB7XG4gIGNvbnN0IFt5ZWFyLCBtb250aCA9IDEsIGRhdGUgPSAxXSA9IGRhdGVTdHJpbmcuc3BsaXQoJy0nKVxuICByZXR1cm4gYCR7eWVhcn0tJHtwYWQobW9udGgpfS0ke3BhZChkYXRlKX1gLnN1YnN0cigwLCB7IGRhdGU6IDEwLCBtb250aDogNywgeWVhcjogNCB9W3R5cGVdKVxufVxuXG5leHBvcnQgZGVmYXVsdCBtaXhpbnMoXG4gIExvY2FsYWJsZSxcbiAgUGlja2VyLFxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbikuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtZGF0ZS1waWNrZXInLFxuXG4gIHByb3BzOiB7XG4gICAgYWxsb3dlZERhdGVzOiBGdW5jdGlvbiBhcyBQcm9wVHlwZTxEYXRlUGlja2VyQWxsb3dlZERhdGVzRnVuY3Rpb24gfCB1bmRlZmluZWQ+LFxuICAgIC8vIEZ1bmN0aW9uIGZvcm1hdHRpbmcgdGhlIGRheSBpbiBkYXRlIHBpY2tlciB0YWJsZVxuICAgIGRheUZvcm1hdDogRnVuY3Rpb24gYXMgUHJvcFR5cGU8RGF0ZVBpY2tlckFsbG93ZWREYXRlc0Z1bmN0aW9uIHwgdW5kZWZpbmVkPixcbiAgICBkaXNhYmxlZDogQm9vbGVhbixcbiAgICBldmVudHM6IHtcbiAgICAgIHR5cGU6IFtBcnJheSwgRnVuY3Rpb24sIE9iamVjdF0gYXMgUHJvcFR5cGU8RGF0ZVBpY2tlckV2ZW50cz4sXG4gICAgICBkZWZhdWx0OiAoKSA9PiBudWxsLFxuICAgIH0sXG4gICAgZXZlbnRDb2xvcjoge1xuICAgICAgdHlwZTogW0FycmF5LCBGdW5jdGlvbiwgT2JqZWN0LCBTdHJpbmddIGFzIFByb3BUeXBlPERhdGVQaWNrZXJFdmVudENvbG9ycz4sXG4gICAgICBkZWZhdWx0OiAoKSA9PiAnd2FybmluZycsXG4gICAgfSxcbiAgICBmaXJzdERheU9mV2Vlazoge1xuICAgICAgdHlwZTogW1N0cmluZywgTnVtYmVyXSxcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgICAvLyBGdW5jdGlvbiBmb3JtYXR0aW5nIHRoZSB0YWJsZURhdGUgaW4gdGhlIGRheS9tb250aCB0YWJsZSBoZWFkZXJcbiAgICBoZWFkZXJEYXRlRm9ybWF0OiBGdW5jdGlvbiBhcyBQcm9wVHlwZTxEYXRlUGlja2VyRm9ybWF0dGVyIHwgdW5kZWZpbmVkPixcbiAgICBsb2NhbGVGaXJzdERheU9mWWVhcjoge1xuICAgICAgdHlwZTogW1N0cmluZywgTnVtYmVyXSxcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSxcbiAgICBtYXg6IFN0cmluZyxcbiAgICBtaW46IFN0cmluZyxcbiAgICAvLyBGdW5jdGlvbiBmb3JtYXR0aW5nIG1vbnRoIGluIHRoZSBtb250aHMgdGFibGVcbiAgICBtb250aEZvcm1hdDogRnVuY3Rpb24gYXMgUHJvcFR5cGU8RGF0ZVBpY2tlckZvcm1hdHRlciB8IHVuZGVmaW5lZD4sXG4gICAgbXVsdGlwbGU6IEJvb2xlYW4sXG4gICAgbmV4dEljb246IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICckbmV4dCcsXG4gICAgfSxcbiAgICBuZXh0TW9udGhBcmlhTGFiZWw6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICckdnVldGlmeS5kYXRlUGlja2VyLm5leHRNb250aEFyaWFMYWJlbCcsXG4gICAgfSxcbiAgICBuZXh0WWVhckFyaWFMYWJlbDoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJyR2dWV0aWZ5LmRhdGVQaWNrZXIubmV4dFllYXJBcmlhTGFiZWwnLFxuICAgIH0sXG4gICAgcGlja2VyRGF0ZTogU3RyaW5nLFxuICAgIHByZXZJY29uOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnJHByZXYnLFxuICAgIH0sXG4gICAgcHJldk1vbnRoQXJpYUxhYmVsOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnJHZ1ZXRpZnkuZGF0ZVBpY2tlci5wcmV2TW9udGhBcmlhTGFiZWwnLFxuICAgIH0sXG4gICAgcHJldlllYXJBcmlhTGFiZWw6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICckdnVldGlmeS5kYXRlUGlja2VyLnByZXZZZWFyQXJpYUxhYmVsJyxcbiAgICB9LFxuICAgIHJhbmdlOiBCb29sZWFuLFxuICAgIHJlYWN0aXZlOiBCb29sZWFuLFxuICAgIHJlYWRvbmx5OiBCb29sZWFuLFxuICAgIHNjcm9sbGFibGU6IEJvb2xlYW4sXG4gICAgc2hvd0N1cnJlbnQ6IHtcbiAgICAgIHR5cGU6IFtCb29sZWFuLCBTdHJpbmddLFxuICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB9LFxuICAgIHNlbGVjdGVkSXRlbXNUZXh0OiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnJHZ1ZXRpZnkuZGF0ZVBpY2tlci5pdGVtc1NlbGVjdGVkJyxcbiAgICB9LFxuICAgIHNob3dXZWVrOiBCb29sZWFuLFxuICAgIC8vIEZ1bmN0aW9uIGZvcm1hdHRpbmcgY3VycmVudGx5IHNlbGVjdGVkIGRhdGUgaW4gdGhlIHBpY2tlciB0aXRsZVxuICAgIHRpdGxlRGF0ZUZvcm1hdDogRnVuY3Rpb24gYXMgUHJvcFR5cGU8RGF0ZVBpY2tlckZvcm1hdHRlciB8IERhdGVQaWNrZXJNdWx0aXBsZUZvcm1hdHRlciB8IHVuZGVmaW5lZD4sXG4gICAgdHlwZToge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJ2RhdGUnLFxuICAgICAgdmFsaWRhdG9yOiAodHlwZTogYW55KSA9PiBbJ2RhdGUnLCAnbW9udGgnXS5pbmNsdWRlcyh0eXBlKSwgLy8gVE9ETzogeWVhclxuICAgIH0gYXMgUHJvcFZhbGlkYXRvcjxEYXRlUGlja2VyVHlwZT4sXG4gICAgdmFsdWU6IFtBcnJheSwgU3RyaW5nXSBhcyBQcm9wVHlwZTxEYXRlUGlja2VyVmFsdWU+LFxuICAgIHdlZWtkYXlGb3JtYXQ6IEZ1bmN0aW9uIGFzIFByb3BUeXBlPERhdGVQaWNrZXJGb3JtYXR0ZXIgfCB1bmRlZmluZWQ+LFxuICAgIC8vIEZ1bmN0aW9uIGZvcm1hdHRpbmcgdGhlIHllYXIgaW4gdGFibGUgaGVhZGVyIGFuZCBwaWNrdXAgdGl0bGVcbiAgICB5ZWFyRm9ybWF0OiBGdW5jdGlvbiBhcyBQcm9wVHlwZTxEYXRlUGlja2VyRm9ybWF0dGVyIHwgdW5kZWZpbmVkPixcbiAgICB5ZWFySWNvbjogU3RyaW5nLFxuICB9LFxuXG4gIGRhdGEgKCkge1xuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKClcbiAgICByZXR1cm4ge1xuICAgICAgYWN0aXZlUGlja2VyOiB0aGlzLnR5cGUudG9VcHBlckNhc2UoKSxcbiAgICAgIGlucHV0RGF5OiBudWxsIGFzIG51bWJlciB8IG51bGwsXG4gICAgICBpbnB1dE1vbnRoOiBudWxsIGFzIG51bWJlciB8IG51bGwsXG4gICAgICBpbnB1dFllYXI6IG51bGwgYXMgbnVtYmVyIHwgbnVsbCxcbiAgICAgIGlzUmV2ZXJzaW5nOiBmYWxzZSxcbiAgICAgIG5vdyxcbiAgICAgIC8vIHRhYmxlRGF0ZSBpcyBhIHN0cmluZyBpbiAnWVlZWScgLyAnWVlZWS1NJyBmb3JtYXQgKGxlYWRpbmcgemVybyBmb3IgbW9udGggaXMgbm90IHJlcXVpcmVkKVxuICAgICAgdGFibGVEYXRlOiAoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5waWNrZXJEYXRlKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucGlja2VyRGF0ZVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbXVsdGlwbGVWYWx1ZSA9IHdyYXBJbkFycmF5KHRoaXMudmFsdWUpXG4gICAgICAgIGNvbnN0IGRhdGUgPSBtdWx0aXBsZVZhbHVlW211bHRpcGxlVmFsdWUubGVuZ3RoIC0gMV0gfHxcbiAgICAgICAgICAodHlwZW9mIHRoaXMuc2hvd0N1cnJlbnQgPT09ICdzdHJpbmcnID8gdGhpcy5zaG93Q3VycmVudCA6IGAke25vdy5nZXRGdWxsWWVhcigpfS0ke25vdy5nZXRNb250aCgpICsgMX1gKVxuICAgICAgICByZXR1cm4gc2FuaXRpemVEYXRlU3RyaW5nKGRhdGUgYXMgc3RyaW5nLCB0aGlzLnR5cGUgPT09ICdkYXRlJyA/ICdtb250aCcgOiAneWVhcicpXG4gICAgICB9KSgpLFxuICAgIH1cbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIG11bHRpcGxlVmFsdWUgKCk6IHN0cmluZ1tdIHtcbiAgICAgIHJldHVybiB3cmFwSW5BcnJheSh0aGlzLnZhbHVlKVxuICAgIH0sXG4gICAgaXNNdWx0aXBsZSAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5tdWx0aXBsZSB8fCB0aGlzLnJhbmdlXG4gICAgfSxcbiAgICBsYXN0VmFsdWUgKCk6IHN0cmluZyB8IG51bGwge1xuICAgICAgcmV0dXJuIHRoaXMuaXNNdWx0aXBsZSA/IHRoaXMubXVsdGlwbGVWYWx1ZVt0aGlzLm11bHRpcGxlVmFsdWUubGVuZ3RoIC0gMV0gOiAodGhpcy52YWx1ZSBhcyBzdHJpbmcgfCBudWxsKVxuICAgIH0sXG4gICAgc2VsZWN0ZWRNb250aHMgKCk6IHN0cmluZyB8IHN0cmluZ1tdIHwgdW5kZWZpbmVkIHtcbiAgICAgIGlmICghdGhpcy52YWx1ZSB8fCB0aGlzLnR5cGUgPT09ICdtb250aCcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc011bHRpcGxlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm11bHRpcGxlVmFsdWUubWFwKHZhbCA9PiB2YWwuc3Vic3RyKDAsIDcpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLnZhbHVlIGFzIHN0cmluZykuc3Vic3RyKDAsIDcpXG4gICAgICB9XG4gICAgfSxcbiAgICBjdXJyZW50ICgpOiBzdHJpbmcgfCBudWxsIHtcbiAgICAgIGlmICh0aGlzLnNob3dDdXJyZW50ID09PSB0cnVlKSB7XG4gICAgICAgIHJldHVybiBzYW5pdGl6ZURhdGVTdHJpbmcoYCR7dGhpcy5ub3cuZ2V0RnVsbFllYXIoKX0tJHt0aGlzLm5vdy5nZXRNb250aCgpICsgMX0tJHt0aGlzLm5vdy5nZXREYXRlKCl9YCwgdGhpcy50eXBlKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5zaG93Q3VycmVudCB8fCBudWxsXG4gICAgfSxcbiAgICBpbnB1dERhdGUgKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gdGhpcy50eXBlID09PSAnZGF0ZSdcbiAgICAgICAgPyBgJHt0aGlzLmlucHV0WWVhcn0tJHtwYWQodGhpcy5pbnB1dE1vbnRoISArIDEpfS0ke3BhZCh0aGlzLmlucHV0RGF5ISl9YFxuICAgICAgICA6IGAke3RoaXMuaW5wdXRZZWFyfS0ke3BhZCh0aGlzLmlucHV0TW9udGghICsgMSl9YFxuICAgIH0sXG4gICAgdGFibGVNb250aCAoKTogbnVtYmVyIHtcbiAgICAgIHJldHVybiBOdW1iZXIoKHRoaXMucGlja2VyRGF0ZSB8fCB0aGlzLnRhYmxlRGF0ZSkuc3BsaXQoJy0nKVsxXSkgLSAxXG4gICAgfSxcbiAgICB0YWJsZVllYXIgKCk6IG51bWJlciB7XG4gICAgICByZXR1cm4gTnVtYmVyKCh0aGlzLnBpY2tlckRhdGUgfHwgdGhpcy50YWJsZURhdGUpLnNwbGl0KCctJylbMF0pXG4gICAgfSxcbiAgICBtaW5Nb250aCAoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgICByZXR1cm4gdGhpcy5taW4gPyBzYW5pdGl6ZURhdGVTdHJpbmcodGhpcy5taW4sICdtb250aCcpIDogbnVsbFxuICAgIH0sXG4gICAgbWF4TW9udGggKCk6IHN0cmluZyB8IG51bGwge1xuICAgICAgcmV0dXJuIHRoaXMubWF4ID8gc2FuaXRpemVEYXRlU3RyaW5nKHRoaXMubWF4LCAnbW9udGgnKSA6IG51bGxcbiAgICB9LFxuICAgIG1pblllYXIgKCk6IHN0cmluZyB8IG51bGwge1xuICAgICAgcmV0dXJuIHRoaXMubWluID8gc2FuaXRpemVEYXRlU3RyaW5nKHRoaXMubWluLCAneWVhcicpIDogbnVsbFxuICAgIH0sXG4gICAgbWF4WWVhciAoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgICByZXR1cm4gdGhpcy5tYXggPyBzYW5pdGl6ZURhdGVTdHJpbmcodGhpcy5tYXgsICd5ZWFyJykgOiBudWxsXG4gICAgfSxcbiAgICBmb3JtYXR0ZXJzICgpOiBGb3JtYXR0ZXJzIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHllYXI6IHRoaXMueWVhckZvcm1hdCB8fCBjcmVhdGVOYXRpdmVMb2NhbGVGb3JtYXR0ZXIodGhpcy5jdXJyZW50TG9jYWxlLCB7IHllYXI6ICdudW1lcmljJywgdGltZVpvbmU6ICdVVEMnIH0sIHsgbGVuZ3RoOiA0IH0pLFxuICAgICAgICB0aXRsZURhdGU6IHRoaXMudGl0bGVEYXRlRm9ybWF0IHx8XG4gICAgICAgICAgKHRoaXMuaXNNdWx0aXBsZSA/IHRoaXMuZGVmYXVsdFRpdGxlTXVsdGlwbGVEYXRlRm9ybWF0dGVyIDogdGhpcy5kZWZhdWx0VGl0bGVEYXRlRm9ybWF0dGVyKSxcbiAgICAgIH1cbiAgICB9LFxuICAgIGRlZmF1bHRUaXRsZU11bHRpcGxlRGF0ZUZvcm1hdHRlciAoKTogRGF0ZVBpY2tlck11bHRpcGxlRm9ybWF0dGVyIHtcbiAgICAgIHJldHVybiBkYXRlcyA9PiB7XG4gICAgICAgIGlmICghZGF0ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgcmV0dXJuICctJ1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRhdGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmRlZmF1bHRUaXRsZURhdGVGb3JtYXR0ZXIoZGF0ZXNbMF0pXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy4kdnVldGlmeS5sYW5nLnQodGhpcy5zZWxlY3RlZEl0ZW1zVGV4dCwgZGF0ZXMubGVuZ3RoKVxuICAgICAgfVxuICAgIH0sXG4gICAgZGVmYXVsdFRpdGxlRGF0ZUZvcm1hdHRlciAoKTogRGF0ZVBpY2tlckZvcm1hdHRlciB7XG4gICAgICBjb25zdCB0aXRsZUZvcm1hdHMgPSB7XG4gICAgICAgIHllYXI6IHsgeWVhcjogJ251bWVyaWMnLCB0aW1lWm9uZTogJ1VUQycgfSxcbiAgICAgICAgbW9udGg6IHsgbW9udGg6ICdsb25nJywgdGltZVpvbmU6ICdVVEMnIH0sXG4gICAgICAgIGRhdGU6IHsgd2Vla2RheTogJ3Nob3J0JywgbW9udGg6ICdzaG9ydCcsIGRheTogJ251bWVyaWMnLCB0aW1lWm9uZTogJ1VUQycgfSxcbiAgICAgIH1cblxuICAgICAgY29uc3QgdGl0bGVEYXRlRm9ybWF0dGVyID0gY3JlYXRlTmF0aXZlTG9jYWxlRm9ybWF0dGVyKHRoaXMuY3VycmVudExvY2FsZSwgdGl0bGVGb3JtYXRzW3RoaXMudHlwZV0sIHtcbiAgICAgICAgc3RhcnQ6IDAsXG4gICAgICAgIGxlbmd0aDogeyBkYXRlOiAxMCwgbW9udGg6IDcsIHllYXI6IDQgfVt0aGlzLnR5cGVdLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgbGFuZHNjYXBlRm9ybWF0dGVyID0gKGRhdGU6IHN0cmluZykgPT4gdGl0bGVEYXRlRm9ybWF0dGVyKGRhdGUpXG4gICAgICAgIC5yZXBsYWNlKC8oW15cXGRcXHNdKShbXFxkXSkvZywgKG1hdGNoLCBub25EaWdpdCwgZGlnaXQpID0+IGAke25vbkRpZ2l0fSAke2RpZ2l0fWApXG4gICAgICAgIC5yZXBsYWNlKCcsICcsICcsPGJyPicpXG5cbiAgICAgIHJldHVybiB0aGlzLmxhbmRzY2FwZSA/IGxhbmRzY2FwZUZvcm1hdHRlciA6IHRpdGxlRGF0ZUZvcm1hdHRlclxuICAgIH0sXG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICB0YWJsZURhdGUgKHZhbDogc3RyaW5nLCBwcmV2OiBzdHJpbmcpIHtcbiAgICAgIC8vIE1ha2UgYSBJU08gODYwMSBzdHJpbmdzIGZyb20gdmFsIGFuZCBwcmV2IGZvciBjb21wYXJpc2lvbiwgb3RoZXJ3aXNlIGl0IHdpbGwgaW5jb3JyZWN0bHlcbiAgICAgIC8vIGNvbXBhcmUgZm9yIGV4YW1wbGUgJzIwMDAtOScgYW5kICcyMDAwLTEwJ1xuICAgICAgY29uc3Qgc2FuaXRpemVUeXBlID0gdGhpcy50eXBlID09PSAnbW9udGgnID8gJ3llYXInIDogJ21vbnRoJ1xuICAgICAgdGhpcy5pc1JldmVyc2luZyA9IHNhbml0aXplRGF0ZVN0cmluZyh2YWwsIHNhbml0aXplVHlwZSkgPCBzYW5pdGl6ZURhdGVTdHJpbmcocHJldiwgc2FuaXRpemVUeXBlKVxuICAgICAgdGhpcy4kZW1pdCgndXBkYXRlOnBpY2tlci1kYXRlJywgdmFsKVxuICAgIH0sXG4gICAgcGlja2VyRGF0ZSAodmFsOiBzdHJpbmcgfCBudWxsKSB7XG4gICAgICBpZiAodmFsKSB7XG4gICAgICAgIHRoaXMudGFibGVEYXRlID0gdmFsXG4gICAgICB9IGVsc2UgaWYgKHRoaXMubGFzdFZhbHVlICYmIHRoaXMudHlwZSA9PT0gJ2RhdGUnKSB7XG4gICAgICAgIHRoaXMudGFibGVEYXRlID0gc2FuaXRpemVEYXRlU3RyaW5nKHRoaXMubGFzdFZhbHVlLCAnbW9udGgnKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmxhc3RWYWx1ZSAmJiB0aGlzLnR5cGUgPT09ICdtb250aCcpIHtcbiAgICAgICAgdGhpcy50YWJsZURhdGUgPSBzYW5pdGl6ZURhdGVTdHJpbmcodGhpcy5sYXN0VmFsdWUsICd5ZWFyJylcbiAgICAgIH1cbiAgICB9LFxuICAgIHZhbHVlIChuZXdWYWx1ZTogRGF0ZVBpY2tlclZhbHVlLCBvbGRWYWx1ZTogRGF0ZVBpY2tlclZhbHVlKSB7XG4gICAgICB0aGlzLmNoZWNrTXVsdGlwbGVQcm9wKClcbiAgICAgIHRoaXMuc2V0SW5wdXREYXRlKClcblxuICAgICAgaWYgKCF0aGlzLmlzTXVsdGlwbGUgJiYgdGhpcy52YWx1ZSAmJiAhdGhpcy5waWNrZXJEYXRlKSB7XG4gICAgICAgIHRoaXMudGFibGVEYXRlID0gc2FuaXRpemVEYXRlU3RyaW5nKHRoaXMuaW5wdXREYXRlLCB0aGlzLnR5cGUgPT09ICdtb250aCcgPyAneWVhcicgOiAnbW9udGgnKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmlzTXVsdGlwbGUgJiYgdGhpcy5tdWx0aXBsZVZhbHVlLmxlbmd0aCAmJiAoIW9sZFZhbHVlIHx8ICEob2xkVmFsdWUgYXMgc3RyaW5nW10pLmxlbmd0aCkgJiYgIXRoaXMucGlja2VyRGF0ZSkge1xuICAgICAgICB0aGlzLnRhYmxlRGF0ZSA9IHNhbml0aXplRGF0ZVN0cmluZyh0aGlzLmlucHV0RGF0ZSwgdGhpcy50eXBlID09PSAnbW9udGgnID8gJ3llYXInIDogJ21vbnRoJylcbiAgICAgIH1cbiAgICB9LFxuICAgIHR5cGUgKHR5cGU6IERhdGVQaWNrZXJUeXBlKSB7XG4gICAgICB0aGlzLmFjdGl2ZVBpY2tlciA9IHR5cGUudG9VcHBlckNhc2UoKVxuXG4gICAgICBpZiAodGhpcy52YWx1ZSAmJiB0aGlzLnZhbHVlLmxlbmd0aCkge1xuICAgICAgICBjb25zdCBvdXRwdXQgPSB0aGlzLm11bHRpcGxlVmFsdWVcbiAgICAgICAgICAubWFwKCh2YWw6IHN0cmluZykgPT4gc2FuaXRpemVEYXRlU3RyaW5nKHZhbCwgdHlwZSkpXG4gICAgICAgICAgLmZpbHRlcih0aGlzLmlzRGF0ZUFsbG93ZWQpXG4gICAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgdGhpcy5pc011bHRpcGxlID8gb3V0cHV0IDogb3V0cHV0WzBdKVxuICAgICAgfVxuICAgIH0sXG4gIH0sXG5cbiAgY3JlYXRlZCAoKSB7XG4gICAgdGhpcy5jaGVja011bHRpcGxlUHJvcCgpXG5cbiAgICBpZiAodGhpcy5waWNrZXJEYXRlICE9PSB0aGlzLnRhYmxlRGF0ZSkge1xuICAgICAgdGhpcy4kZW1pdCgndXBkYXRlOnBpY2tlci1kYXRlJywgdGhpcy50YWJsZURhdGUpXG4gICAgfVxuICAgIHRoaXMuc2V0SW5wdXREYXRlKClcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgZW1pdElucHV0IChuZXdJbnB1dDogc3RyaW5nKSB7XG4gICAgICBpZiAodGhpcy5yYW5nZSkge1xuICAgICAgICBpZiAodGhpcy5tdWx0aXBsZVZhbHVlLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgW25ld0lucHV0XSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBvdXRwdXQgPSBbdGhpcy5tdWx0aXBsZVZhbHVlWzBdLCBuZXdJbnB1dF1cbiAgICAgICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIG91dHB1dClcbiAgICAgICAgICB0aGlzLiRlbWl0KCdjaGFuZ2UnLCBvdXRwdXQpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG91dHB1dCA9IHRoaXMubXVsdGlwbGVcbiAgICAgICAgPyAoXG4gICAgICAgICAgdGhpcy5tdWx0aXBsZVZhbHVlLmluZGV4T2YobmV3SW5wdXQpID09PSAtMVxuICAgICAgICAgICAgPyB0aGlzLm11bHRpcGxlVmFsdWUuY29uY2F0KFtuZXdJbnB1dF0pXG4gICAgICAgICAgICA6IHRoaXMubXVsdGlwbGVWYWx1ZS5maWx0ZXIoeCA9PiB4ICE9PSBuZXdJbnB1dClcbiAgICAgICAgKVxuICAgICAgICA6IG5ld0lucHV0XG5cbiAgICAgIHRoaXMuJGVtaXQoJ2lucHV0Jywgb3V0cHV0KVxuICAgICAgdGhpcy5tdWx0aXBsZSB8fCB0aGlzLiRlbWl0KCdjaGFuZ2UnLCBuZXdJbnB1dClcbiAgICB9LFxuICAgIGNoZWNrTXVsdGlwbGVQcm9wICgpIHtcbiAgICAgIGlmICh0aGlzLnZhbHVlID09IG51bGwpIHJldHVyblxuICAgICAgY29uc3QgdmFsdWVUeXBlID0gdGhpcy52YWx1ZS5jb25zdHJ1Y3Rvci5uYW1lXG4gICAgICBjb25zdCBleHBlY3RlZCA9IHRoaXMuaXNNdWx0aXBsZSA/ICdBcnJheScgOiAnU3RyaW5nJ1xuICAgICAgaWYgKHZhbHVlVHlwZSAhPT0gZXhwZWN0ZWQpIHtcbiAgICAgICAgY29uc29sZVdhcm4oYFZhbHVlIG11c3QgYmUgJHt0aGlzLmlzTXVsdGlwbGUgPyAnYW4nIDogJ2EnfSAke2V4cGVjdGVkfSwgZ290ICR7dmFsdWVUeXBlfWAsIHRoaXMpXG4gICAgICB9XG4gICAgfSxcbiAgICBpc0RhdGVBbGxvd2VkICh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICByZXR1cm4gaXNEYXRlQWxsb3dlZCh2YWx1ZSwgdGhpcy5taW4sIHRoaXMubWF4LCB0aGlzLmFsbG93ZWREYXRlcylcbiAgICB9LFxuICAgIHllYXJDbGljayAodmFsdWU6IG51bWJlcikge1xuICAgICAgdGhpcy5pbnB1dFllYXIgPSB2YWx1ZVxuICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ21vbnRoJykge1xuICAgICAgICB0aGlzLnRhYmxlRGF0ZSA9IGAke3ZhbHVlfWBcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudGFibGVEYXRlID0gYCR7dmFsdWV9LSR7cGFkKCh0aGlzLnRhYmxlTW9udGggfHwgMCkgKyAxKX1gXG4gICAgICB9XG4gICAgICB0aGlzLmFjdGl2ZVBpY2tlciA9ICdNT05USCdcbiAgICAgIGlmICh0aGlzLnJlYWN0aXZlICYmICF0aGlzLnJlYWRvbmx5ICYmICF0aGlzLmlzTXVsdGlwbGUgJiYgdGhpcy5pc0RhdGVBbGxvd2VkKHRoaXMuaW5wdXREYXRlKSkge1xuICAgICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIHRoaXMuaW5wdXREYXRlKVxuICAgICAgfVxuICAgIH0sXG4gICAgbW9udGhDbGljayAodmFsdWU6IHN0cmluZykge1xuICAgICAgdGhpcy5pbnB1dFllYXIgPSBwYXJzZUludCh2YWx1ZS5zcGxpdCgnLScpWzBdLCAxMClcbiAgICAgIHRoaXMuaW5wdXRNb250aCA9IHBhcnNlSW50KHZhbHVlLnNwbGl0KCctJylbMV0sIDEwKSAtIDFcbiAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdkYXRlJykge1xuICAgICAgICBpZiAodGhpcy5pbnB1dERheSkge1xuICAgICAgICAgIHRoaXMuaW5wdXREYXkgPSBNYXRoLm1pbih0aGlzLmlucHV0RGF5LCBkYXlzSW5Nb250aCh0aGlzLmlucHV0WWVhciwgdGhpcy5pbnB1dE1vbnRoICsgMSkpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRhYmxlRGF0ZSA9IHZhbHVlXG4gICAgICAgIHRoaXMuYWN0aXZlUGlja2VyID0gJ0RBVEUnXG4gICAgICAgIGlmICh0aGlzLnJlYWN0aXZlICYmICF0aGlzLnJlYWRvbmx5ICYmICF0aGlzLmlzTXVsdGlwbGUgJiYgdGhpcy5pc0RhdGVBbGxvd2VkKHRoaXMuaW5wdXREYXRlKSkge1xuICAgICAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgdGhpcy5pbnB1dERhdGUpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZW1pdElucHV0KHRoaXMuaW5wdXREYXRlKVxuICAgICAgfVxuICAgIH0sXG4gICAgZGF0ZUNsaWNrICh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICB0aGlzLmlucHV0WWVhciA9IHBhcnNlSW50KHZhbHVlLnNwbGl0KCctJylbMF0sIDEwKVxuICAgICAgdGhpcy5pbnB1dE1vbnRoID0gcGFyc2VJbnQodmFsdWUuc3BsaXQoJy0nKVsxXSwgMTApIC0gMVxuICAgICAgdGhpcy5pbnB1dERheSA9IHBhcnNlSW50KHZhbHVlLnNwbGl0KCctJylbMl0sIDEwKVxuICAgICAgdGhpcy5lbWl0SW5wdXQodGhpcy5pbnB1dERhdGUpXG4gICAgfSxcbiAgICBnZW5QaWNrZXJUaXRsZSAoKSB7XG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudChWRGF0ZVBpY2tlclRpdGxlLCB7XG4gICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgZGF0ZTogdGhpcy52YWx1ZSA/ICh0aGlzLmZvcm1hdHRlcnMudGl0bGVEYXRlIGFzICh2YWx1ZTogYW55KSA9PiBzdHJpbmcpKHRoaXMuaXNNdWx0aXBsZSA/IHRoaXMubXVsdGlwbGVWYWx1ZSA6IHRoaXMudmFsdWUpIDogJycsXG4gICAgICAgICAgZGlzYWJsZWQ6IHRoaXMuZGlzYWJsZWQsXG4gICAgICAgICAgcmVhZG9ubHk6IHRoaXMucmVhZG9ubHksXG4gICAgICAgICAgc2VsZWN0aW5nWWVhcjogdGhpcy5hY3RpdmVQaWNrZXIgPT09ICdZRUFSJyxcbiAgICAgICAgICB5ZWFyOiB0aGlzLmZvcm1hdHRlcnMueWVhcih0aGlzLm11bHRpcGxlVmFsdWUubGVuZ3RoID8gYCR7dGhpcy5pbnB1dFllYXJ9YCA6IHRoaXMudGFibGVEYXRlKSxcbiAgICAgICAgICB5ZWFySWNvbjogdGhpcy55ZWFySWNvbixcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tdWx0aXBsZVZhbHVlWzBdLFxuICAgICAgICB9LFxuICAgICAgICBzbG90OiAndGl0bGUnLFxuICAgICAgICBvbjoge1xuICAgICAgICAgICd1cGRhdGU6c2VsZWN0aW5nLXllYXInOiAodmFsdWU6IGJvb2xlYW4pID0+IHRoaXMuYWN0aXZlUGlja2VyID0gdmFsdWUgPyAnWUVBUicgOiB0aGlzLnR5cGUudG9VcHBlckNhc2UoKSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfSxcbiAgICBnZW5UYWJsZUhlYWRlciAoKSB7XG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudChWRGF0ZVBpY2tlckhlYWRlciwge1xuICAgICAgICBwcm9wczoge1xuICAgICAgICAgIG5leHRJY29uOiB0aGlzLm5leHRJY29uLFxuICAgICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yLFxuICAgICAgICAgIGRhcms6IHRoaXMuZGFyayxcbiAgICAgICAgICBkaXNhYmxlZDogdGhpcy5kaXNhYmxlZCxcbiAgICAgICAgICBmb3JtYXQ6IHRoaXMuaGVhZGVyRGF0ZUZvcm1hdCxcbiAgICAgICAgICBsaWdodDogdGhpcy5saWdodCxcbiAgICAgICAgICBsb2NhbGU6IHRoaXMubG9jYWxlLFxuICAgICAgICAgIG1pbjogdGhpcy5hY3RpdmVQaWNrZXIgPT09ICdEQVRFJyA/IHRoaXMubWluTW9udGggOiB0aGlzLm1pblllYXIsXG4gICAgICAgICAgbWF4OiB0aGlzLmFjdGl2ZVBpY2tlciA9PT0gJ0RBVEUnID8gdGhpcy5tYXhNb250aCA6IHRoaXMubWF4WWVhcixcbiAgICAgICAgICBuZXh0QXJpYUxhYmVsOiB0aGlzLmFjdGl2ZVBpY2tlciA9PT0gJ0RBVEUnID8gdGhpcy5uZXh0TW9udGhBcmlhTGFiZWwgOiB0aGlzLm5leHRZZWFyQXJpYUxhYmVsLFxuICAgICAgICAgIHByZXZBcmlhTGFiZWw6IHRoaXMuYWN0aXZlUGlja2VyID09PSAnREFURScgPyB0aGlzLnByZXZNb250aEFyaWFMYWJlbCA6IHRoaXMucHJldlllYXJBcmlhTGFiZWwsXG4gICAgICAgICAgcHJldkljb246IHRoaXMucHJldkljb24sXG4gICAgICAgICAgcmVhZG9ubHk6IHRoaXMucmVhZG9ubHksXG4gICAgICAgICAgdmFsdWU6IHRoaXMuYWN0aXZlUGlja2VyID09PSAnREFURScgPyBgJHtwYWQodGhpcy50YWJsZVllYXIsIDQpfS0ke3BhZCh0aGlzLnRhYmxlTW9udGggKyAxKX1gIDogYCR7cGFkKHRoaXMudGFibGVZZWFyLCA0KX1gLFxuICAgICAgICB9LFxuICAgICAgICBvbjoge1xuICAgICAgICAgIHRvZ2dsZTogKCkgPT4gdGhpcy5hY3RpdmVQaWNrZXIgPSAodGhpcy5hY3RpdmVQaWNrZXIgPT09ICdEQVRFJyA/ICdNT05USCcgOiAnWUVBUicpLFxuICAgICAgICAgIGlucHV0OiAodmFsdWU6IHN0cmluZykgPT4gdGhpcy50YWJsZURhdGUgPSB2YWx1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfSxcbiAgICBnZW5EYXRlVGFibGUgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkRhdGVQaWNrZXJEYXRlVGFibGUsIHtcbiAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICBhbGxvd2VkRGF0ZXM6IHRoaXMuYWxsb3dlZERhdGVzLFxuICAgICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yLFxuICAgICAgICAgIGN1cnJlbnQ6IHRoaXMuY3VycmVudCxcbiAgICAgICAgICBkYXJrOiB0aGlzLmRhcmssXG4gICAgICAgICAgZGlzYWJsZWQ6IHRoaXMuZGlzYWJsZWQsXG4gICAgICAgICAgZXZlbnRzOiB0aGlzLmV2ZW50cyxcbiAgICAgICAgICBldmVudENvbG9yOiB0aGlzLmV2ZW50Q29sb3IsXG4gICAgICAgICAgZmlyc3REYXlPZldlZWs6IHRoaXMuZmlyc3REYXlPZldlZWssXG4gICAgICAgICAgZm9ybWF0OiB0aGlzLmRheUZvcm1hdCxcbiAgICAgICAgICBsaWdodDogdGhpcy5saWdodCxcbiAgICAgICAgICBsb2NhbGU6IHRoaXMubG9jYWxlLFxuICAgICAgICAgIGxvY2FsZUZpcnN0RGF5T2ZZZWFyOiB0aGlzLmxvY2FsZUZpcnN0RGF5T2ZZZWFyLFxuICAgICAgICAgIG1pbjogdGhpcy5taW4sXG4gICAgICAgICAgbWF4OiB0aGlzLm1heCxcbiAgICAgICAgICByYW5nZTogdGhpcy5yYW5nZSxcbiAgICAgICAgICByZWFkb25seTogdGhpcy5yZWFkb25seSxcbiAgICAgICAgICBzY3JvbGxhYmxlOiB0aGlzLnNjcm9sbGFibGUsXG4gICAgICAgICAgc2hvd1dlZWs6IHRoaXMuc2hvd1dlZWssXG4gICAgICAgICAgdGFibGVEYXRlOiBgJHtwYWQodGhpcy50YWJsZVllYXIsIDQpfS0ke3BhZCh0aGlzLnRhYmxlTW9udGggKyAxKX1gLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLnZhbHVlLFxuICAgICAgICAgIHdlZWtkYXlGb3JtYXQ6IHRoaXMud2Vla2RheUZvcm1hdCxcbiAgICAgICAgfSxcbiAgICAgICAgcmVmOiAndGFibGUnLFxuICAgICAgICBvbjoge1xuICAgICAgICAgIGlucHV0OiB0aGlzLmRhdGVDbGljayxcbiAgICAgICAgICAndXBkYXRlOnRhYmxlLWRhdGUnOiAodmFsdWU6IHN0cmluZykgPT4gdGhpcy50YWJsZURhdGUgPSB2YWx1ZSxcbiAgICAgICAgICAuLi5jcmVhdGVJdGVtVHlwZUxpc3RlbmVycyh0aGlzLCAnOmRhdGUnKSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfSxcbiAgICBnZW5Nb250aFRhYmxlICgpIHtcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZEYXRlUGlja2VyTW9udGhUYWJsZSwge1xuICAgICAgICBwcm9wczoge1xuICAgICAgICAgIGFsbG93ZWREYXRlczogdGhpcy50eXBlID09PSAnbW9udGgnID8gdGhpcy5hbGxvd2VkRGF0ZXMgOiBudWxsLFxuICAgICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yLFxuICAgICAgICAgIGN1cnJlbnQ6IHRoaXMuY3VycmVudCA/IHNhbml0aXplRGF0ZVN0cmluZyh0aGlzLmN1cnJlbnQsICdtb250aCcpIDogbnVsbCxcbiAgICAgICAgICBkYXJrOiB0aGlzLmRhcmssXG4gICAgICAgICAgZGlzYWJsZWQ6IHRoaXMuZGlzYWJsZWQsXG4gICAgICAgICAgZXZlbnRzOiB0aGlzLnR5cGUgPT09ICdtb250aCcgPyB0aGlzLmV2ZW50cyA6IG51bGwsXG4gICAgICAgICAgZXZlbnRDb2xvcjogdGhpcy50eXBlID09PSAnbW9udGgnID8gdGhpcy5ldmVudENvbG9yIDogbnVsbCxcbiAgICAgICAgICBmb3JtYXQ6IHRoaXMubW9udGhGb3JtYXQsXG4gICAgICAgICAgbGlnaHQ6IHRoaXMubGlnaHQsXG4gICAgICAgICAgbG9jYWxlOiB0aGlzLmxvY2FsZSxcbiAgICAgICAgICBtaW46IHRoaXMubWluTW9udGgsXG4gICAgICAgICAgbWF4OiB0aGlzLm1heE1vbnRoLFxuICAgICAgICAgIHJhbmdlOiB0aGlzLnJhbmdlLFxuICAgICAgICAgIHJlYWRvbmx5OiB0aGlzLnJlYWRvbmx5ICYmIHRoaXMudHlwZSA9PT0gJ21vbnRoJyxcbiAgICAgICAgICBzY3JvbGxhYmxlOiB0aGlzLnNjcm9sbGFibGUsXG4gICAgICAgICAgdmFsdWU6IHRoaXMuc2VsZWN0ZWRNb250aHMsXG4gICAgICAgICAgdGFibGVEYXRlOiBgJHtwYWQodGhpcy50YWJsZVllYXIsIDQpfWAsXG4gICAgICAgIH0sXG4gICAgICAgIHJlZjogJ3RhYmxlJyxcbiAgICAgICAgb246IHtcbiAgICAgICAgICBpbnB1dDogdGhpcy5tb250aENsaWNrLFxuICAgICAgICAgICd1cGRhdGU6dGFibGUtZGF0ZSc6ICh2YWx1ZTogc3RyaW5nKSA9PiB0aGlzLnRhYmxlRGF0ZSA9IHZhbHVlLFxuICAgICAgICAgIC4uLmNyZWF0ZUl0ZW1UeXBlTGlzdGVuZXJzKHRoaXMsICc6bW9udGgnKSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfSxcbiAgICBnZW5ZZWFycyAoKSB7XG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudChWRGF0ZVBpY2tlclllYXJzLCB7XG4gICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgY29sb3I6IHRoaXMuY29sb3IsXG4gICAgICAgICAgZm9ybWF0OiB0aGlzLnllYXJGb3JtYXQsXG4gICAgICAgICAgbG9jYWxlOiB0aGlzLmxvY2FsZSxcbiAgICAgICAgICBtaW46IHRoaXMubWluWWVhcixcbiAgICAgICAgICBtYXg6IHRoaXMubWF4WWVhcixcbiAgICAgICAgICB2YWx1ZTogdGhpcy50YWJsZVllYXIsXG4gICAgICAgIH0sXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgaW5wdXQ6IHRoaXMueWVhckNsaWNrLFxuICAgICAgICAgIC4uLmNyZWF0ZUl0ZW1UeXBlTGlzdGVuZXJzKHRoaXMsICc6eWVhcicpLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9LFxuICAgIGdlblBpY2tlckJvZHkgKCkge1xuICAgICAgY29uc3QgY2hpbGRyZW4gPSB0aGlzLmFjdGl2ZVBpY2tlciA9PT0gJ1lFQVInID8gW1xuICAgICAgICB0aGlzLmdlblllYXJzKCksXG4gICAgICBdIDogW1xuICAgICAgICB0aGlzLmdlblRhYmxlSGVhZGVyKCksXG4gICAgICAgIHRoaXMuYWN0aXZlUGlja2VyID09PSAnREFURScgPyB0aGlzLmdlbkRhdGVUYWJsZSgpIDogdGhpcy5nZW5Nb250aFRhYmxlKCksXG4gICAgICBdXG5cbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgIGtleTogdGhpcy5hY3RpdmVQaWNrZXIsXG4gICAgICB9LCBjaGlsZHJlbilcbiAgICB9LFxuICAgIHNldElucHV0RGF0ZSAoKSB7XG4gICAgICBpZiAodGhpcy5sYXN0VmFsdWUpIHtcbiAgICAgICAgY29uc3QgYXJyYXkgPSB0aGlzLmxhc3RWYWx1ZS5zcGxpdCgnLScpXG4gICAgICAgIHRoaXMuaW5wdXRZZWFyID0gcGFyc2VJbnQoYXJyYXlbMF0sIDEwKVxuICAgICAgICB0aGlzLmlucHV0TW9udGggPSBwYXJzZUludChhcnJheVsxXSwgMTApIC0gMVxuICAgICAgICBpZiAodGhpcy50eXBlID09PSAnZGF0ZScpIHtcbiAgICAgICAgICB0aGlzLmlucHV0RGF5ID0gcGFyc2VJbnQoYXJyYXlbMl0sIDEwKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmlucHV0WWVhciA9IHRoaXMuaW5wdXRZZWFyIHx8IHRoaXMubm93LmdldEZ1bGxZZWFyKClcbiAgICAgICAgdGhpcy5pbnB1dE1vbnRoID0gdGhpcy5pbnB1dE1vbnRoID09IG51bGwgPyB0aGlzLmlucHV0TW9udGggOiB0aGlzLm5vdy5nZXRNb250aCgpXG4gICAgICAgIHRoaXMuaW5wdXREYXkgPSB0aGlzLmlucHV0RGF5IHx8IHRoaXMubm93LmdldERhdGUoKVxuICAgICAgfVxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyICgpOiBWTm9kZSB7XG4gICAgcmV0dXJuIHRoaXMuZ2VuUGlja2VyKCd2LXBpY2tlci0tZGF0ZScpXG4gIH0sXG59KVxuIl19