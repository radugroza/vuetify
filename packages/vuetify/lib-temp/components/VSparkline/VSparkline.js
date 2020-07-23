// Mixins
import Colorable from '../../mixins/colorable';
// Utilities
import mixins from '../../util/mixins';
import { genPoints, genBars } from './helpers/core';
import { genPath } from './helpers/path';
export default mixins(Colorable).extend({
    name: 'VSparkline',
    inheritAttrs: false,
    props: {
        autoDraw: Boolean,
        autoDrawDuration: {
            type: Number,
            default: 2000,
        },
        autoDrawEasing: {
            type: String,
            default: 'ease',
        },
        autoLineWidth: {
            type: Boolean,
            default: false,
        },
        color: {
            type: String,
            default: 'primary',
        },
        fill: {
            type: Boolean,
            default: false,
        },
        gradient: {
            type: Array,
            default: () => ([]),
        },
        gradientDirection: {
            type: String,
            validator: (val) => ['top', 'bottom', 'left', 'right'].includes(val),
            default: 'top',
        },
        height: {
            type: [String, Number],
            default: 75,
        },
        labels: {
            type: Array,
            default: () => ([]),
        },
        labelSize: {
            type: [Number, String],
            default: 7,
        },
        lineWidth: {
            type: [String, Number],
            default: 4,
        },
        padding: {
            type: [String, Number],
            default: 8,
        },
        showLabels: Boolean,
        smooth: {
            type: [Boolean, Number, String],
            default: false,
        },
        type: {
            type: String,
            default: 'trend',
            validator: (val) => ['trend', 'bar'].includes(val),
        },
        value: {
            type: Array,
            default: () => ([]),
        },
        width: {
            type: [Number, String],
            default: 300,
        },
    },
    data: () => ({
        lastLength: 0,
    }),
    computed: {
        parsedPadding() {
            return Number(this.padding);
        },
        parsedWidth() {
            return Number(this.width);
        },
        parsedHeight() {
            return parseInt(this.height, 10);
        },
        parsedLabelSize() {
            return parseInt(this.labelSize, 10) || 7;
        },
        totalHeight() {
            let height = this.parsedHeight;
            if (this.hasLabels)
                height += parseInt(this.labelSize, 10) * 1.5;
            return height;
        },
        totalWidth() {
            let width = this.parsedWidth;
            if (this.type === 'bar')
                width = Math.max(this.value.length * this._lineWidth, width);
            return width;
        },
        totalValues() {
            return this.value.length;
        },
        _lineWidth() {
            if (this.autoLineWidth && this.type !== 'trend') {
                const totalPadding = this.parsedPadding * (this.totalValues + 1);
                return (this.parsedWidth - totalPadding) / this.totalValues;
            }
            else {
                return parseFloat(this.lineWidth) || 4;
            }
        },
        boundary() {
            if (this.type === 'bar')
                return { minX: 0, maxX: this.totalWidth, minY: 0, maxY: this.parsedHeight };
            const padding = this.parsedPadding;
            return {
                minX: padding,
                maxX: this.totalWidth - padding,
                minY: padding,
                maxY: this.parsedHeight - padding,
            };
        },
        hasLabels() {
            return Boolean(this.showLabels ||
                this.labels.length > 0 ||
                this.$scopedSlots.label);
        },
        parsedLabels() {
            const labels = [];
            const points = this._values;
            const len = points.length;
            for (let i = 0; labels.length < len; i++) {
                const item = points[i];
                let value = this.labels[i];
                if (!value) {
                    value = typeof item === 'object'
                        ? item.value
                        : item;
                }
                labels.push({
                    x: item.x,
                    value: String(value),
                });
            }
            return labels;
        },
        normalizedValues() {
            return this.value.map(item => (typeof item === 'number' ? item : item.value));
        },
        _values() {
            return this.type === 'trend' ? genPoints(this.normalizedValues, this.boundary) : genBars(this.normalizedValues, this.boundary);
        },
        textY() {
            let y = this.parsedHeight;
            if (this.type === 'trend')
                y -= 4;
            return y;
        },
        _radius() {
            return this.smooth === true ? 8 : Number(this.smooth);
        },
    },
    watch: {
        value: {
            immediate: true,
            handler() {
                this.$nextTick(() => {
                    if (!this.autoDraw ||
                        this.type === 'bar' ||
                        !this.$refs.path)
                        return;
                    const path = this.$refs.path;
                    const length = path.getTotalLength();
                    if (!this.fill) {
                        path.style.transition = 'none';
                        path.style.strokeDasharray = length + ' ' + length;
                        path.style.strokeDashoffset = Math.abs(length - (this.lastLength || 0)).toString();
                        path.getBoundingClientRect();
                        path.style.transition = `stroke-dashoffset ${this.autoDrawDuration}ms ${this.autoDrawEasing}`;
                        path.style.strokeDashoffset = '0';
                    }
                    else {
                        path.style.transformOrigin = 'bottom center';
                        path.style.transition = 'none';
                        path.style.transform = `scaleY(0)`;
                        path.getBoundingClientRect();
                        path.style.transition = `transform ${this.autoDrawDuration}ms ${this.autoDrawEasing}`;
                        path.style.transform = `scaleY(1)`;
                    }
                    this.lastLength = length;
                });
            },
        },
    },
    methods: {
        genGradient() {
            const gradientDirection = this.gradientDirection;
            const gradient = this.gradient.slice();
            // Pushes empty string to force
            // a fallback to currentColor
            if (!gradient.length)
                gradient.push('');
            const len = Math.max(gradient.length - 1, 1);
            const stops = gradient.reverse().map((color, index) => this.$createElement('stop', {
                attrs: {
                    offset: index / len,
                    'stop-color': color || 'currentColor',
                },
            }));
            return this.$createElement('defs', [
                this.$createElement('linearGradient', {
                    attrs: {
                        id: this._uid,
                        x1: +(gradientDirection === 'left'),
                        y1: +(gradientDirection === 'top'),
                        x2: +(gradientDirection === 'right'),
                        y2: +(gradientDirection === 'bottom'),
                    },
                }, stops),
            ]);
        },
        genG(children) {
            return this.$createElement('g', {
                style: {
                    fontSize: '8',
                    textAnchor: 'middle',
                    dominantBaseline: 'mathematical',
                    fill: 'currentColor',
                },
            }, children);
        },
        genPath() {
            const points = genPoints(this.normalizedValues, this.boundary);
            return this.$createElement('path', {
                attrs: {
                    d: genPath(points, this._radius, this.fill, this.parsedHeight),
                    fill: this.fill ? `url(#${this._uid})` : 'none',
                    stroke: this.fill ? 'none' : `url(#${this._uid})`,
                },
                ref: 'path',
            });
        },
        genLabels(offsetX) {
            const children = this.parsedLabels.map((item, i) => (this.$createElement('text', {
                attrs: {
                    x: item.x + offsetX + this._lineWidth / 2,
                    y: this.textY + (this.parsedLabelSize * 0.75),
                    'font-size': Number(this.labelSize) || 7,
                },
            }, [this.genLabel(item, i)])));
            return this.genG(children);
        },
        genLabel(item, index) {
            return this.$scopedSlots.label
                ? this.$scopedSlots.label({ index, value: item.value })
                : item.value;
        },
        genBars() {
            if (!this.value || this.totalValues < 2)
                return undefined;
            const bars = genBars(this.normalizedValues, this.boundary);
            const offsetX = (Math.abs(bars[0].x - bars[1].x) - this._lineWidth) / 2;
            return this.$createElement('svg', {
                attrs: {
                    display: 'block',
                    viewBox: `0 0 ${this.totalWidth} ${this.totalHeight}`,
                },
            }, [
                this.genGradient(),
                this.genClipPath(bars, offsetX, this._lineWidth, 'sparkline-bar-' + this._uid),
                this.hasLabels ? this.genLabels(offsetX) : undefined,
                this.$createElement('g', {
                    attrs: {
                        'clip-path': `url(#sparkline-bar-${this._uid}-clip)`,
                        fill: `url(#${this._uid})`,
                    },
                }, [
                    this.$createElement('rect', {
                        attrs: {
                            x: 0,
                            y: 0,
                            width: this.totalWidth,
                            height: this.height,
                        },
                    }),
                ]),
            ]);
        },
        genClipPath(bars, offsetX, lineWidth, id) {
            const rounding = typeof this.smooth === 'number'
                ? this.smooth
                : this.smooth ? 2 : 0;
            return this.$createElement('clipPath', {
                attrs: {
                    id: `${id}-clip`,
                },
            }, bars.map(item => {
                return this.$createElement('rect', {
                    attrs: {
                        x: item.x + offsetX,
                        y: item.y,
                        width: lineWidth,
                        height: item.height,
                        rx: rounding,
                        ry: rounding,
                    },
                }, [
                    this.autoDraw ? this.$createElement('animate', {
                        attrs: {
                            attributeName: 'height',
                            from: 0,
                            to: item.height,
                            dur: `${this.autoDrawDuration}ms`,
                            fill: 'freeze',
                        },
                    }) : undefined,
                ]);
            }));
        },
        genTrend() {
            return this.$createElement('svg', this.setTextColor(this.color, {
                attrs: {
                    ...this.$attrs,
                    display: 'block',
                    'stroke-width': this._lineWidth || 1,
                    viewBox: `0 0 ${this.width} ${this.totalHeight}`,
                },
            }), [
                this.genGradient(),
                this.hasLabels && this.genLabels(-(this._lineWidth / 2)),
                this.genPath(),
            ]);
        },
    },
    render(h) {
        if (this.totalValues < 2)
            return undefined;
        return this.type === 'trend' ? this.genTrend() : this.genBars();
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlNwYXJrbGluZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZTcGFya2xpbmUvVlNwYXJrbGluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFFOUMsWUFBWTtBQUNaLE9BQU8sTUFBc0IsTUFBTSxtQkFBbUIsQ0FBQTtBQUN0RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxNQUFNLGdCQUFnQixDQUFBO0FBQ25ELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQTtBQXVDeEMsZUFBZSxNQUFNLENBT25CLFNBQVMsQ0FDVixDQUFDLE1BQU0sQ0FBQztJQUNQLElBQUksRUFBRSxZQUFZO0lBRWxCLFlBQVksRUFBRSxLQUFLO0lBRW5CLEtBQUssRUFBRTtRQUNMLFFBQVEsRUFBRSxPQUFPO1FBQ2pCLGdCQUFnQixFQUFFO1lBQ2hCLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLElBQUk7U0FDZDtRQUNELGNBQWMsRUFBRTtZQUNkLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLE1BQU07U0FDaEI7UUFDRCxhQUFhLEVBQUU7WUFDYixJQUFJLEVBQUUsT0FBTztZQUNiLE9BQU8sRUFBRSxLQUFLO1NBQ2Y7UUFDRCxLQUFLLEVBQUU7WUFDTCxJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxTQUFTO1NBQ25CO1FBQ0QsSUFBSSxFQUFFO1lBQ0osSUFBSSxFQUFFLE9BQU87WUFDYixPQUFPLEVBQUUsS0FBSztTQUNmO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsSUFBSSxFQUFFLEtBQXVCO1lBQzdCLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztTQUNwQjtRQUNELGlCQUFpQixFQUFFO1lBQ2pCLElBQUksRUFBRSxNQUFtRDtZQUN6RCxTQUFTLEVBQUUsQ0FBQyxH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QyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7SUFDakUsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIE1peGluc1xuaW1wb3J0IENvbG9yYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvY29sb3JhYmxlJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCBtaXhpbnMsIHsgRXh0cmFjdFZ1ZSB9IGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuaW1wb3J0IHsgZ2VuUG9pbnRzLCBnZW5CYXJzIH0gZnJvbSAnLi9oZWxwZXJzL2NvcmUnXG5pbXBvcnQgeyBnZW5QYXRoIH0gZnJvbSAnLi9oZWxwZXJzL3BhdGgnXG5cbi8vIFR5cGVzXG5pbXBvcnQgVnVlLCB7IFZOb2RlIH0gZnJvbSAndnVlJ1xuaW1wb3J0IHsgUHJvcCB9IGZyb20gJ3Z1ZS90eXBlcy9vcHRpb25zJ1xuXG5leHBvcnQgdHlwZSBTcGFya2xpbmVJdGVtID0gbnVtYmVyIHwgeyB2YWx1ZTogbnVtYmVyIH1cblxuZXhwb3J0IHR5cGUgU3BhcmtsaW5lVGV4dCA9IHtcbiAgeDogbnVtYmVyXG4gIHZhbHVlOiBzdHJpbmdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBCb3VuZGFyeSB7XG4gIG1pblg6IG51bWJlclxuICBtaW5ZOiBudW1iZXJcbiAgbWF4WDogbnVtYmVyXG4gIG1heFk6IG51bWJlclxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBvaW50IHtcbiAgeDogbnVtYmVyXG4gIHk6IG51bWJlclxuICB2YWx1ZTogbnVtYmVyXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmFyIHtcbiAgeDogbnVtYmVyXG4gIHk6IG51bWJlclxuICBoZWlnaHQ6IG51bWJlclxuICB2YWx1ZTogbnVtYmVyXG59XG5cbmludGVyZmFjZSBvcHRpb25zIGV4dGVuZHMgVnVlIHtcbiAgJHJlZnM6IHtcbiAgICBwYXRoOiBTVkdQYXRoRWxlbWVudFxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1peGluczxvcHRpb25zICZcbi8qIGVzbGludC1kaXNhYmxlIGluZGVudCAqL1xuICBFeHRyYWN0VnVlPFtcbiAgICB0eXBlb2YgQ29sb3JhYmxlXG4gIF0+XG4vKiBlc2xpbnQtZW5hYmxlIGluZGVudCAqL1xuPihcbiAgQ29sb3JhYmxlXG4pLmV4dGVuZCh7XG4gIG5hbWU6ICdWU3BhcmtsaW5lJyxcblxuICBpbmhlcml0QXR0cnM6IGZhbHNlLFxuXG4gIHByb3BzOiB7XG4gICAgYXV0b0RyYXc6IEJvb2xlYW4sXG4gICAgYXV0b0RyYXdEdXJhdGlvbjoge1xuICAgICAgdHlwZTogTnVtYmVyLFxuICAgICAgZGVmYXVsdDogMjAwMCxcbiAgICB9LFxuICAgIGF1dG9EcmF3RWFzaW5nOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnZWFzZScsXG4gICAgfSxcbiAgICBhdXRvTGluZVdpZHRoOiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgfSxcbiAgICBjb2xvcjoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJ3ByaW1hcnknLFxuICAgIH0sXG4gICAgZmlsbDoge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIH0sXG4gICAgZ3JhZGllbnQ6IHtcbiAgICAgIHR5cGU6IEFycmF5IGFzIFByb3A8c3RyaW5nW10+LFxuICAgICAgZGVmYXVsdDogKCkgPT4gKFtdKSxcbiAgICB9LFxuICAgIGdyYWRpZW50RGlyZWN0aW9uOiB7XG4gICAgICB0eXBlOiBTdHJpbmcgYXMgUHJvcDwndG9wJyB8ICdib3R0b20nIHwgJ2xlZnQnIHwgJ3JpZ2h0Jz4sXG4gICAgICB2YWxpZGF0b3I6ICh2YWw6IHN0cmluZykgPT4gWyd0b3AnLCAnYm90dG9tJywgJ2xlZnQnLCAncmlnaHQnXS5pbmNsdWRlcyh2YWwpLFxuICAgICAgZGVmYXVsdDogJ3RvcCcsXG4gICAgfSxcbiAgICBoZWlnaHQ6IHtcbiAgICAgIHR5cGU6IFtTdHJpbmcsIE51bWJlcl0sXG4gICAgICBkZWZhdWx0OiA3NSxcbiAgICB9LFxuICAgIGxhYmVsczoge1xuICAgICAgdHlwZTogQXJyYXkgYXMgUHJvcDxTcGFya2xpbmVJdGVtW10+LFxuICAgICAgZGVmYXVsdDogKCkgPT4gKFtdKSxcbiAgICB9LFxuICAgIGxhYmVsU2l6ZToge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6IDcsXG4gICAgfSxcbiAgICBsaW5lV2lkdGg6IHtcbiAgICAgIHR5cGU6IFtTdHJpbmcsIE51bWJlcl0sXG4gICAgICBkZWZhdWx0OiA0LFxuICAgIH0sXG4gICAgcGFkZGluZzoge1xuICAgICAgdHlwZTogW1N0cmluZywgTnVtYmVyXSxcbiAgICAgIGRlZmF1bHQ6IDgsXG4gICAgfSxcbiAgICBzaG93TGFiZWxzOiBCb29sZWFuLFxuICAgIHNtb290aDoge1xuICAgICAgdHlwZTogW0Jvb2xlYW4sIE51bWJlciwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIH0sXG4gICAgdHlwZToge1xuICAgICAgdHlwZTogU3RyaW5nIGFzIFByb3A8J3RyZW5kJyB8ICdiYXInPixcbiAgICAgIGRlZmF1bHQ6ICd0cmVuZCcsXG4gICAgICB2YWxpZGF0b3I6ICh2YWw6IHN0cmluZykgPT4gWyd0cmVuZCcsICdiYXInXS5pbmNsdWRlcyh2YWwpLFxuICAgIH0sXG4gICAgdmFsdWU6IHtcbiAgICAgIHR5cGU6IEFycmF5IGFzIFByb3A8U3BhcmtsaW5lSXRlbVtdPixcbiAgICAgIGRlZmF1bHQ6ICgpID0+IChbXSksXG4gICAgfSxcbiAgICB3aWR0aDoge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6IDMwMCxcbiAgICB9LFxuICB9LFxuXG4gIGRhdGE6ICgpID0+ICh7XG4gICAgbGFzdExlbmd0aDogMCxcbiAgfSksXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBwYXJzZWRQYWRkaW5nICgpOiBudW1iZXIge1xuICAgICAgcmV0dXJuIE51bWJlcih0aGlzLnBhZGRpbmcpXG4gICAgfSxcbiAgICBwYXJzZWRXaWR0aCAoKTogbnVtYmVyIHtcbiAgICAgIHJldHVybiBOdW1iZXIodGhpcy53aWR0aClcbiAgICB9LFxuICAgIHBhcnNlZEhlaWdodCAoKTogbnVtYmVyIHtcbiAgICAgIHJldHVybiBwYXJzZUludCh0aGlzLmhlaWdodCwgMTApXG4gICAgfSxcbiAgICBwYXJzZWRMYWJlbFNpemUgKCk6IG51bWJlciB7XG4gICAgICByZXR1cm4gcGFyc2VJbnQodGhpcy5sYWJlbFNpemUsIDEwKSB8fCA3XG4gICAgfSxcbiAgICB0b3RhbEhlaWdodCAoKTogbnVtYmVyIHtcbiAgICAgIGxldCBoZWlnaHQgPSB0aGlzLnBhcnNlZEhlaWdodFxuXG4gICAgICBpZiAodGhpcy5oYXNMYWJlbHMpIGhlaWdodCArPSBwYXJzZUludCh0aGlzLmxhYmVsU2l6ZSwgMTApICogMS41XG5cbiAgICAgIHJldHVybiBoZWlnaHRcbiAgICB9LFxuICAgIHRvdGFsV2lkdGggKCk6IG51bWJlciB7XG4gICAgICBsZXQgd2lkdGggPSB0aGlzLnBhcnNlZFdpZHRoXG4gICAgICBpZiAodGhpcy50eXBlID09PSAnYmFyJykgd2lkdGggPSBNYXRoLm1heCh0aGlzLnZhbHVlLmxlbmd0aCAqIHRoaXMuX2xpbmVXaWR0aCwgd2lkdGgpXG5cbiAgICAgIHJldHVybiB3aWR0aFxuICAgIH0sXG4gICAgdG90YWxWYWx1ZXMgKCk6IG51bWJlciB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZS5sZW5ndGhcbiAgICB9LFxuICAgIF9saW5lV2lkdGggKCk6IG51bWJlciB7XG4gICAgICBpZiAodGhpcy5hdXRvTGluZVdpZHRoICYmIHRoaXMudHlwZSAhPT0gJ3RyZW5kJykge1xuICAgICAgICBjb25zdCB0b3RhbFBhZGRpbmcgPSB0aGlzLnBhcnNlZFBhZGRpbmcgKiAodGhpcy50b3RhbFZhbHVlcyArIDEpXG4gICAgICAgIHJldHVybiAodGhpcy5wYXJzZWRXaWR0aCAtIHRvdGFsUGFkZGluZykgLyB0aGlzLnRvdGFsVmFsdWVzXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCh0aGlzLmxpbmVXaWR0aCkgfHwgNFxuICAgICAgfVxuICAgIH0sXG4gICAgYm91bmRhcnkgKCk6IEJvdW5kYXJ5IHtcbiAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdiYXInKSByZXR1cm4geyBtaW5YOiAwLCBtYXhYOiB0aGlzLnRvdGFsV2lkdGgsIG1pblk6IDAsIG1heFk6IHRoaXMucGFyc2VkSGVpZ2h0IH1cblxuICAgICAgY29uc3QgcGFkZGluZyA9IHRoaXMucGFyc2VkUGFkZGluZ1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBtaW5YOiBwYWRkaW5nLFxuICAgICAgICBtYXhYOiB0aGlzLnRvdGFsV2lkdGggLSBwYWRkaW5nLFxuICAgICAgICBtaW5ZOiBwYWRkaW5nLFxuICAgICAgICBtYXhZOiB0aGlzLnBhcnNlZEhlaWdodCAtIHBhZGRpbmcsXG4gICAgICB9XG4gICAgfSxcbiAgICBoYXNMYWJlbHMgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIEJvb2xlYW4oXG4gICAgICAgIHRoaXMuc2hvd0xhYmVscyB8fFxuICAgICAgICB0aGlzLmxhYmVscy5sZW5ndGggPiAwIHx8XG4gICAgICAgIHRoaXMuJHNjb3BlZFNsb3RzLmxhYmVsXG4gICAgICApXG4gICAgfSxcbiAgICBwYXJzZWRMYWJlbHMgKCk6IFNwYXJrbGluZVRleHRbXSB7XG4gICAgICBjb25zdCBsYWJlbHMgPSBbXVxuICAgICAgY29uc3QgcG9pbnRzID0gdGhpcy5fdmFsdWVzXG4gICAgICBjb25zdCBsZW4gPSBwb2ludHMubGVuZ3RoXG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBsYWJlbHMubGVuZ3RoIDwgbGVuOyBpKyspIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IHBvaW50c1tpXVxuICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLmxhYmVsc1tpXVxuXG4gICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICB2YWx1ZSA9IHR5cGVvZiBpdGVtID09PSAnb2JqZWN0J1xuICAgICAgICAgICAgPyBpdGVtLnZhbHVlXG4gICAgICAgICAgICA6IGl0ZW1cbiAgICAgICAgfVxuXG4gICAgICAgIGxhYmVscy5wdXNoKHtcbiAgICAgICAgICB4OiBpdGVtLngsXG4gICAgICAgICAgdmFsdWU6IFN0cmluZyh2YWx1ZSksXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBsYWJlbHNcbiAgICB9LFxuICAgIG5vcm1hbGl6ZWRWYWx1ZXMgKCk6IG51bWJlcltdIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlLm1hcChpdGVtID0+ICh0eXBlb2YgaXRlbSA9PT0gJ251bWJlcicgPyBpdGVtIDogaXRlbS52YWx1ZSkpXG4gICAgfSxcbiAgICBfdmFsdWVzICgpOiBQb2ludFtdIHwgQmFyW10ge1xuICAgICAgcmV0dXJuIHRoaXMudHlwZSA9PT0gJ3RyZW5kJyA/IGdlblBvaW50cyh0aGlzLm5vcm1hbGl6ZWRWYWx1ZXMsIHRoaXMuYm91bmRhcnkpIDogZ2VuQmFycyh0aGlzLm5vcm1hbGl6ZWRWYWx1ZXMsIHRoaXMuYm91bmRhcnkpXG4gICAgfSxcbiAgICB0ZXh0WSAoKTogbnVtYmVyIHtcbiAgICAgIGxldCB5ID0gdGhpcy5wYXJzZWRIZWlnaHRcbiAgICAgIGlmICh0aGlzLnR5cGUgPT09ICd0cmVuZCcpIHkgLT0gNFxuICAgICAgcmV0dXJuIHlcbiAgICB9LFxuICAgIF9yYWRpdXMgKCk6IG51bWJlciB7XG4gICAgICByZXR1cm4gdGhpcy5zbW9vdGggPT09IHRydWUgPyA4IDogTnVtYmVyKHRoaXMuc21vb3RoKVxuICAgIH0sXG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICB2YWx1ZToge1xuICAgICAgaW1tZWRpYXRlOiB0cnVlLFxuICAgICAgaGFuZGxlciAoKSB7XG4gICAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAhdGhpcy5hdXRvRHJhdyB8fFxuICAgICAgICAgICAgdGhpcy50eXBlID09PSAnYmFyJyB8fFxuICAgICAgICAgICAgIXRoaXMuJHJlZnMucGF0aFxuICAgICAgICAgICkgcmV0dXJuXG5cbiAgICAgICAgICBjb25zdCBwYXRoID0gdGhpcy4kcmVmcy5wYXRoXG4gICAgICAgICAgY29uc3QgbGVuZ3RoID0gcGF0aC5nZXRUb3RhbExlbmd0aCgpXG5cbiAgICAgICAgICBpZiAoIXRoaXMuZmlsbCkge1xuICAgICAgICAgICAgcGF0aC5zdHlsZS50cmFuc2l0aW9uID0gJ25vbmUnXG4gICAgICAgICAgICBwYXRoLnN0eWxlLnN0cm9rZURhc2hhcnJheSA9IGxlbmd0aCArICcgJyArIGxlbmd0aFxuICAgICAgICAgICAgcGF0aC5zdHlsZS5zdHJva2VEYXNob2Zmc2V0ID0gTWF0aC5hYnMobGVuZ3RoIC0gKHRoaXMubGFzdExlbmd0aCB8fCAwKSkudG9TdHJpbmcoKVxuICAgICAgICAgICAgcGF0aC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgICAgICAgcGF0aC5zdHlsZS50cmFuc2l0aW9uID0gYHN0cm9rZS1kYXNob2Zmc2V0ICR7dGhpcy5hdXRvRHJhd0R1cmF0aW9ufW1zICR7dGhpcy5hdXRvRHJhd0Vhc2luZ31gXG4gICAgICAgICAgICBwYXRoLnN0eWxlLnN0cm9rZURhc2hvZmZzZXQgPSAnMCdcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGF0aC5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSAnYm90dG9tIGNlbnRlcidcbiAgICAgICAgICAgIHBhdGguc3R5bGUudHJhbnNpdGlvbiA9ICdub25lJ1xuICAgICAgICAgICAgcGF0aC5zdHlsZS50cmFuc2Zvcm0gPSBgc2NhbGVZKDApYFxuICAgICAgICAgICAgcGF0aC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgICAgICAgcGF0aC5zdHlsZS50cmFuc2l0aW9uID0gYHRyYW5zZm9ybSAke3RoaXMuYXV0b0RyYXdEdXJhdGlvbn1tcyAke3RoaXMuYXV0b0RyYXdFYXNpbmd9YFxuICAgICAgICAgICAgcGF0aC5zdHlsZS50cmFuc2Zvcm0gPSBgc2NhbGVZKDEpYFxuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmxhc3RMZW5ndGggPSBsZW5ndGhcbiAgICAgICAgfSlcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgZ2VuR3JhZGllbnQgKCkge1xuICAgICAgY29uc3QgZ3JhZGllbnREaXJlY3Rpb24gPSB0aGlzLmdyYWRpZW50RGlyZWN0aW9uXG4gICAgICBjb25zdCBncmFkaWVudCA9IHRoaXMuZ3JhZGllbnQuc2xpY2UoKVxuXG4gICAgICAvLyBQdXNoZXMgZW1wdHkgc3RyaW5nIHRvIGZvcmNlXG4gICAgICAvLyBhIGZhbGxiYWNrIHRvIGN1cnJlbnRDb2xvclxuICAgICAgaWYgKCFncmFkaWVudC5sZW5ndGgpIGdyYWRpZW50LnB1c2goJycpXG5cbiAgICAgIGNvbnN0IGxlbiA9IE1hdGgubWF4KGdyYWRpZW50Lmxlbmd0aCAtIDEsIDEpXG4gICAgICBjb25zdCBzdG9wcyA9IGdyYWRpZW50LnJldmVyc2UoKS5tYXAoKGNvbG9yLCBpbmRleCkgPT5cbiAgICAgICAgdGhpcy4kY3JlYXRlRWxlbWVudCgnc3RvcCcsIHtcbiAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgb2Zmc2V0OiBpbmRleCAvIGxlbixcbiAgICAgICAgICAgICdzdG9wLWNvbG9yJzogY29sb3IgfHwgJ2N1cnJlbnRDb2xvcicsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSlcbiAgICAgIClcblxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RlZnMnLCBbXG4gICAgICAgIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2xpbmVhckdyYWRpZW50Jywge1xuICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICBpZDogdGhpcy5fdWlkLFxuICAgICAgICAgICAgeDE6ICsoZ3JhZGllbnREaXJlY3Rpb24gPT09ICdsZWZ0JyksXG4gICAgICAgICAgICB5MTogKyhncmFkaWVudERpcmVjdGlvbiA9PT0gJ3RvcCcpLFxuICAgICAgICAgICAgeDI6ICsoZ3JhZGllbnREaXJlY3Rpb24gPT09ICdyaWdodCcpLFxuICAgICAgICAgICAgeTI6ICsoZ3JhZGllbnREaXJlY3Rpb24gPT09ICdib3R0b20nKSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LCBzdG9wcyksXG4gICAgICBdKVxuICAgIH0sXG4gICAgZ2VuRyAoY2hpbGRyZW46IFZOb2RlW10pIHtcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdnJywge1xuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIGZvbnRTaXplOiAnOCcsXG4gICAgICAgICAgdGV4dEFuY2hvcjogJ21pZGRsZScsXG4gICAgICAgICAgZG9taW5hbnRCYXNlbGluZTogJ21hdGhlbWF0aWNhbCcsXG4gICAgICAgICAgZmlsbDogJ2N1cnJlbnRDb2xvcicsXG4gICAgICAgIH0gYXMgb2JqZWN0LCAvLyBUT0RPOiBUUyAzLjUgaXMgdG9vIGVhZ2VyIHdpdGggdGhlIGFycmF5IHR5cGUgaGVyZVxuICAgICAgfSwgY2hpbGRyZW4pXG4gICAgfSxcbiAgICBnZW5QYXRoICgpIHtcbiAgICAgIGNvbnN0IHBvaW50cyA9IGdlblBvaW50cyh0aGlzLm5vcm1hbGl6ZWRWYWx1ZXMsIHRoaXMuYm91bmRhcnkpXG5cbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdwYXRoJywge1xuICAgICAgICBhdHRyczoge1xuICAgICAgICAgIGQ6IGdlblBhdGgocG9pbnRzLCB0aGlzLl9yYWRpdXMsIHRoaXMuZmlsbCwgdGhpcy5wYXJzZWRIZWlnaHQpLFxuICAgICAgICAgIGZpbGw6IHRoaXMuZmlsbCA/IGB1cmwoIyR7dGhpcy5fdWlkfSlgIDogJ25vbmUnLFxuICAgICAgICAgIHN0cm9rZTogdGhpcy5maWxsID8gJ25vbmUnIDogYHVybCgjJHt0aGlzLl91aWR9KWAsXG4gICAgICAgIH0sXG4gICAgICAgIHJlZjogJ3BhdGgnLFxuICAgICAgfSlcbiAgICB9LFxuICAgIGdlbkxhYmVscyAob2Zmc2V0WDogbnVtYmVyKSB7XG4gICAgICBjb25zdCBjaGlsZHJlbiA9IHRoaXMucGFyc2VkTGFiZWxzLm1hcCgoaXRlbSwgaSkgPT4gKFxuICAgICAgICB0aGlzLiRjcmVhdGVFbGVtZW50KCd0ZXh0Jywge1xuICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICB4OiBpdGVtLnggKyBvZmZzZXRYICsgdGhpcy5fbGluZVdpZHRoIC8gMixcbiAgICAgICAgICAgIHk6IHRoaXMudGV4dFkgKyAodGhpcy5wYXJzZWRMYWJlbFNpemUgKiAwLjc1KSxcbiAgICAgICAgICAgICdmb250LXNpemUnOiBOdW1iZXIodGhpcy5sYWJlbFNpemUpIHx8IDcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSwgW3RoaXMuZ2VuTGFiZWwoaXRlbSwgaSldKVxuICAgICAgKSlcblxuICAgICAgcmV0dXJuIHRoaXMuZ2VuRyhjaGlsZHJlbilcbiAgICB9LFxuICAgIGdlbkxhYmVsIChpdGVtOiBTcGFya2xpbmVUZXh0LCBpbmRleDogbnVtYmVyKSB7XG4gICAgICByZXR1cm4gdGhpcy4kc2NvcGVkU2xvdHMubGFiZWxcbiAgICAgICAgPyB0aGlzLiRzY29wZWRTbG90cy5sYWJlbCh7IGluZGV4LCB2YWx1ZTogaXRlbS52YWx1ZSB9KVxuICAgICAgICA6IGl0ZW0udmFsdWVcbiAgICB9LFxuICAgIGdlbkJhcnMgKCkge1xuICAgICAgaWYgKCF0aGlzLnZhbHVlIHx8IHRoaXMudG90YWxWYWx1ZXMgPCAyKSByZXR1cm4gdW5kZWZpbmVkIGFzIG5ldmVyXG5cbiAgICAgIGNvbnN0IGJhcnMgPSBnZW5CYXJzKHRoaXMubm9ybWFsaXplZFZhbHVlcywgdGhpcy5ib3VuZGFyeSlcbiAgICAgIGNvbnN0IG9mZnNldFggPSAoTWF0aC5hYnMoYmFyc1swXS54IC0gYmFyc1sxXS54KSAtIHRoaXMuX2xpbmVXaWR0aCkgLyAyXG5cbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdzdmcnLCB7XG4gICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgZGlzcGxheTogJ2Jsb2NrJyxcbiAgICAgICAgICB2aWV3Qm94OiBgMCAwICR7dGhpcy50b3RhbFdpZHRofSAke3RoaXMudG90YWxIZWlnaHR9YCxcbiAgICAgICAgfSxcbiAgICAgIH0sIFtcbiAgICAgICAgdGhpcy5nZW5HcmFkaWVudCgpLFxuICAgICAgICB0aGlzLmdlbkNsaXBQYXRoKGJhcnMsIG9mZnNldFgsIHRoaXMuX2xpbmVXaWR0aCwgJ3NwYXJrbGluZS1iYXItJyArIHRoaXMuX3VpZCksXG4gICAgICAgIHRoaXMuaGFzTGFiZWxzID8gdGhpcy5nZW5MYWJlbHMob2Zmc2V0WCkgOiB1bmRlZmluZWQgYXMgbmV2ZXIsXG4gICAgICAgIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2cnLCB7XG4gICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICdjbGlwLXBhdGgnOiBgdXJsKCNzcGFya2xpbmUtYmFyLSR7dGhpcy5fdWlkfS1jbGlwKWAsXG4gICAgICAgICAgICBmaWxsOiBgdXJsKCMke3RoaXMuX3VpZH0pYCxcbiAgICAgICAgICB9LFxuICAgICAgICB9LCBbXG4gICAgICAgICAgdGhpcy4kY3JlYXRlRWxlbWVudCgncmVjdCcsIHtcbiAgICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgICAgIHk6IDAsXG4gICAgICAgICAgICAgIHdpZHRoOiB0aGlzLnRvdGFsV2lkdGgsXG4gICAgICAgICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pLFxuICAgICAgICBdKSxcbiAgICAgIF0pXG4gICAgfSxcbiAgICBnZW5DbGlwUGF0aCAoYmFyczogQmFyW10sIG9mZnNldFg6IG51bWJlciwgbGluZVdpZHRoOiBudW1iZXIsIGlkOiBzdHJpbmcpIHtcbiAgICAgIGNvbnN0IHJvdW5kaW5nID0gdHlwZW9mIHRoaXMuc21vb3RoID09PSAnbnVtYmVyJ1xuICAgICAgICA/IHRoaXMuc21vb3RoXG4gICAgICAgIDogdGhpcy5zbW9vdGggPyAyIDogMFxuXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnY2xpcFBhdGgnLCB7XG4gICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgaWQ6IGAke2lkfS1jbGlwYCxcbiAgICAgICAgfSxcbiAgICAgIH0sIGJhcnMubWFwKGl0ZW0gPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgncmVjdCcsIHtcbiAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgeDogaXRlbS54ICsgb2Zmc2V0WCxcbiAgICAgICAgICAgIHk6IGl0ZW0ueSxcbiAgICAgICAgICAgIHdpZHRoOiBsaW5lV2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IGl0ZW0uaGVpZ2h0LFxuICAgICAgICAgICAgcng6IHJvdW5kaW5nLFxuICAgICAgICAgICAgcnk6IHJvdW5kaW5nLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sIFtcbiAgICAgICAgICB0aGlzLmF1dG9EcmF3ID8gdGhpcy4kY3JlYXRlRWxlbWVudCgnYW5pbWF0ZScsIHtcbiAgICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICAgIGF0dHJpYnV0ZU5hbWU6ICdoZWlnaHQnLFxuICAgICAgICAgICAgICBmcm9tOiAwLFxuICAgICAgICAgICAgICB0bzogaXRlbS5oZWlnaHQsXG4gICAgICAgICAgICAgIGR1cjogYCR7dGhpcy5hdXRvRHJhd0R1cmF0aW9ufW1zYCxcbiAgICAgICAgICAgICAgZmlsbDogJ2ZyZWV6ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pIDogdW5kZWZpbmVkIGFzIG5ldmVyLFxuICAgICAgICBdKVxuICAgICAgfSkpXG4gICAgfSxcbiAgICBnZW5UcmVuZCAoKSB7XG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnc3ZnJywgdGhpcy5zZXRUZXh0Q29sb3IodGhpcy5jb2xvciwge1xuICAgICAgICBhdHRyczoge1xuICAgICAgICAgIC4uLnRoaXMuJGF0dHJzLFxuICAgICAgICAgIGRpc3BsYXk6ICdibG9jaycsXG4gICAgICAgICAgJ3N0cm9rZS13aWR0aCc6IHRoaXMuX2xpbmVXaWR0aCB8fCAxLFxuICAgICAgICAgIHZpZXdCb3g6IGAwIDAgJHt0aGlzLndpZHRofSAke3RoaXMudG90YWxIZWlnaHR9YCxcbiAgICAgICAgfSxcbiAgICAgIH0pLCBbXG4gICAgICAgIHRoaXMuZ2VuR3JhZGllbnQoKSxcbiAgICAgICAgdGhpcy5oYXNMYWJlbHMgJiYgdGhpcy5nZW5MYWJlbHMoLSh0aGlzLl9saW5lV2lkdGggLyAyKSksXG4gICAgICAgIHRoaXMuZ2VuUGF0aCgpLFxuICAgICAgXSlcbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcbiAgICBpZiAodGhpcy50b3RhbFZhbHVlcyA8IDIpIHJldHVybiB1bmRlZmluZWQgYXMgbmV2ZXJcblxuICAgIHJldHVybiB0aGlzLnR5cGUgPT09ICd0cmVuZCcgPyB0aGlzLmdlblRyZW5kKCkgOiB0aGlzLmdlbkJhcnMoKVxuICB9LFxufSlcbiJdfQ==