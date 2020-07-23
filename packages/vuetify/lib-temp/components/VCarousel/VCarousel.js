// Styles
import './VCarousel.sass';
// Extensions
import VWindow from '../VWindow/VWindow';
// Components
import VBtn from '../VBtn';
import VIcon from '../VIcon';
import VProgressLinear from '../VProgressLinear';
// Mixins
// TODO: Move this into core components v2.0
import ButtonGroup from '../../mixins/button-group';
// Utilities
import { convertToUnit } from '../../util/helpers';
import { breaking } from '../../util/console';
export default VWindow.extend({
    name: 'v-carousel',
    props: {
        continuous: {
            type: Boolean,
            default: true,
        },
        cycle: Boolean,
        delimiterIcon: {
            type: String,
            default: '$delimiter',
        },
        height: {
            type: [Number, String],
            default: 500,
        },
        hideDelimiters: Boolean,
        hideDelimiterBackground: Boolean,
        interval: {
            type: [Number, String],
            default: 6000,
            validator: (value) => value > 0,
        },
        mandatory: {
            type: Boolean,
            default: true,
        },
        progress: Boolean,
        progressColor: String,
        showArrows: {
            type: Boolean,
            default: true,
        },
        verticalDelimiters: {
            type: String,
            default: undefined,
        },
    },
    data() {
        return {
            internalHeight: this.height,
            slideTimeout: undefined,
        };
    },
    computed: {
        classes() {
            return {
                ...VWindow.options.computed.classes.call(this),
                'v-carousel': true,
                'v-carousel--hide-delimiter-background': this.hideDelimiterBackground,
                'v-carousel--vertical-delimiters': this.isVertical,
            };
        },
        isDark() {
            return this.dark || !this.light;
        },
        isVertical() {
            return this.verticalDelimiters != null;
        },
    },
    watch: {
        internalValue: 'restartTimeout',
        interval: 'restartTimeout',
        height(val, oldVal) {
            if (val === oldVal || !val)
                return;
            this.internalHeight = val;
        },
        cycle(val) {
            if (val) {
                this.restartTimeout();
            }
            else {
                clearTimeout(this.slideTimeout);
                this.slideTimeout = undefined;
            }
        },
    },
    created() {
        /* istanbul ignore next */
        if (this.$attrs.hasOwnProperty('hide-controls')) {
            breaking('hide-controls', ':show-arrows="false"', this);
        }
    },
    mounted() {
        this.startTimeout();
    },
    methods: {
        genControlIcons() {
            if (this.isVertical)
                return null;
            return VWindow.options.methods.genControlIcons.call(this);
        },
        genDelimiters() {
            return this.$createElement('div', {
                staticClass: 'v-carousel__controls',
                style: {
                    left: this.verticalDelimiters === 'left' && this.isVertical ? 0 : 'auto',
                    right: this.verticalDelimiters === 'right' ? 0 : 'auto',
                },
            }, [this.genItems()]);
        },
        genItems() {
            const length = this.items.length;
            const children = [];
            for (let i = 0; i < length; i++) {
                const child = this.$createElement(VBtn, {
                    staticClass: 'v-carousel__controls__item',
                    attrs: {
                        'aria-label': this.$vuetify.lang.t('$vuetify.carousel.ariaLabel.delimiter', i + 1, length),
                    },
                    props: {
                        icon: true,
                        small: true,
                        value: this.getValue(this.items[i], i),
                    },
                }, [
                    this.$createElement(VIcon, {
                        props: { size: 18 },
                    }, this.delimiterIcon),
                ]);
                children.push(child);
            }
            return this.$createElement(ButtonGroup, {
                props: {
                    value: this.internalValue,
                    mandatory: this.mandatory,
                },
                on: {
                    change: (val) => {
                        this.internalValue = val;
                    },
                },
            }, children);
        },
        genProgress() {
            return this.$createElement(VProgressLinear, {
                staticClass: 'v-carousel__progress',
                props: {
                    color: this.progressColor,
                    value: (this.internalIndex + 1) / this.items.length * 100,
                },
            });
        },
        restartTimeout() {
            this.slideTimeout && clearTimeout(this.slideTimeout);
            this.slideTimeout = undefined;
            window.requestAnimationFrame(this.startTimeout);
        },
        startTimeout() {
            if (!this.cycle)
                return;
            this.slideTimeout = window.setTimeout(this.next, +this.interval > 0 ? +this.interval : 6000);
        },
    },
    render(h) {
        const render = VWindow.options.render.call(this, h);
        render.data.style = `height: ${convertToUnit(this.height)};`;
        /* istanbul ignore else */
        if (!this.hideDelimiters) {
            render.children.push(this.genDelimiters());
        }
        /* istanbul ignore else */
        if (this.progress || this.progressColor) {
            render.children.push(this.genProgress());
        }
        return render;
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkNhcm91c2VsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkNhcm91c2VsL1ZDYXJvdXNlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxrQkFBa0IsQ0FBQTtBQUV6QixhQUFhO0FBQ2IsT0FBTyxPQUFPLE1BQU0sb0JBQW9CLENBQUE7QUFFeEMsYUFBYTtBQUNiLE9BQU8sSUFBSSxNQUFNLFNBQVMsQ0FBQTtBQUMxQixPQUFPLEtBQUssTUFBTSxVQUFVLENBQUE7QUFDNUIsT0FBTyxlQUFlLE1BQU0sb0JBQW9CLENBQUE7QUFFaEQsU0FBUztBQUNULDRDQUE0QztBQUM1QyxPQUFPLFdBQVcsTUFBTSwyQkFBMkIsQ0FBQTtBQUVuRCxZQUFZO0FBQ1osT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQ2xELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUs3QyxlQUFlLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFDNUIsSUFBSSxFQUFFLFlBQVk7SUFFbEIsS0FBSyxFQUFFO1FBQ0wsVUFBVSxFQUFFO1lBQ1YsSUFBSSxFQUFFLE9BQU87WUFDYixPQUFPLEVBQUUsSUFBSTtTQUNkO1FBQ0QsS0FBSyxFQUFFLE9BQU87UUFDZCxhQUFhLEVBQUU7WUFDYixJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxZQUFZO1NBQ3RCO1FBQ0QsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN0QixPQUFPLEVBQUUsR0FBRztTQUNiO1FBQ0QsY0FBYyxFQUFFLE9BQU87UUFDdkIsdUJBQXVCLEVBQUUsT0FBTztRQUNoQyxRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxJQUFJO1lBQ2IsU0FBUyxFQUFFLENBQUMsS0FB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QUEwQjtRQUMxQixJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUN4QixNQUFNLENBQUMsUUFBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQTtTQUM1QztRQUVELDBCQUEwQjtRQUMxQixJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN2QyxNQUFNLENBQUMsUUFBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQTtTQUMxQztRQUVELE9BQU8sTUFBTSxDQUFBO0lBQ2YsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xuaW1wb3J0ICcuL1ZDYXJvdXNlbC5zYXNzJ1xuXG4vLyBFeHRlbnNpb25zXG5pbXBvcnQgVldpbmRvdyBmcm9tICcuLi9WV2luZG93L1ZXaW5kb3cnXG5cbi8vIENvbXBvbmVudHNcbmltcG9ydCBWQnRuIGZyb20gJy4uL1ZCdG4nXG5pbXBvcnQgVkljb24gZnJvbSAnLi4vVkljb24nXG5pbXBvcnQgVlByb2dyZXNzTGluZWFyIGZyb20gJy4uL1ZQcm9ncmVzc0xpbmVhcidcblxuLy8gTWl4aW5zXG4vLyBUT0RPOiBNb3ZlIHRoaXMgaW50byBjb3JlIGNvbXBvbmVudHMgdjIuMFxuaW1wb3J0IEJ1dHRvbkdyb3VwIGZyb20gJy4uLy4uL21peGlucy9idXR0b24tZ3JvdXAnXG5cbi8vIFV0aWxpdGllc1xuaW1wb3J0IHsgY29udmVydFRvVW5pdCB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcbmltcG9ydCB7IGJyZWFraW5nIH0gZnJvbSAnLi4vLi4vdXRpbC9jb25zb2xlJ1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgVk5vZGUsIFByb3BUeXBlIH0gZnJvbSAndnVlJ1xuXG5leHBvcnQgZGVmYXVsdCBWV2luZG93LmV4dGVuZCh7XG4gIG5hbWU6ICd2LWNhcm91c2VsJyxcblxuICBwcm9wczoge1xuICAgIGNvbnRpbnVvdXM6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiB0cnVlLFxuICAgIH0sXG4gICAgY3ljbGU6IEJvb2xlYW4sXG4gICAgZGVsaW1pdGVySWNvbjoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJyRkZWxpbWl0ZXInLFxuICAgIH0sXG4gICAgaGVpZ2h0OiB7XG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxuICAgICAgZGVmYXVsdDogNTAwLFxuICAgIH0sXG4gICAgaGlkZURlbGltaXRlcnM6IEJvb2xlYW4sXG4gICAgaGlkZURlbGltaXRlckJhY2tncm91bmQ6IEJvb2xlYW4sXG4gICAgaW50ZXJ2YWw6IHtcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXG4gICAgICBkZWZhdWx0OiA2MDAwLFxuICAgICAgdmFsaWRhdG9yOiAodmFsdWU6IHN0cmluZyB8IG51bWJlcikgPT4gdmFsdWUgPiAwLFxuICAgIH0sXG4gICAgbWFuZGF0b3J5OiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB9LFxuICAgIHByb2dyZXNzOiBCb29sZWFuLFxuICAgIHByb2dyZXNzQ29sb3I6IFN0cmluZyxcbiAgICBzaG93QXJyb3dzOiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB9LFxuICAgIHZlcnRpY2FsRGVsaW1pdGVyczoge1xuICAgICAgdHlwZTogU3RyaW5nIGFzIFByb3BUeXBlPCcnIHwgJ2xlZnQnIHwgJ3JpZ2h0Jz4sXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgfSxcbiAgfSxcblxuICBkYXRhICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaW50ZXJuYWxIZWlnaHQ6IHRoaXMuaGVpZ2h0LFxuICAgICAgc2xpZGVUaW1lb3V0OiB1bmRlZmluZWQgYXMgbnVtYmVyIHwgdW5kZWZpbmVkLFxuICAgIH1cbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5WV2luZG93Lm9wdGlvbnMuY29tcHV0ZWQuY2xhc3Nlcy5jYWxsKHRoaXMpLFxuICAgICAgICAndi1jYXJvdXNlbCc6IHRydWUsXG4gICAgICAgICd2LWNhcm91c2VsLS1oaWRlLWRlbGltaXRlci1iYWNrZ3JvdW5kJzogdGhpcy5oaWRlRGVsaW1pdGVyQmFja2dyb3VuZCxcbiAgICAgICAgJ3YtY2Fyb3VzZWwtLXZlcnRpY2FsLWRlbGltaXRlcnMnOiB0aGlzLmlzVmVydGljYWwsXG4gICAgICB9XG4gICAgfSxcbiAgICBpc0RhcmsgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMuZGFyayB8fCAhdGhpcy5saWdodFxuICAgIH0sXG4gICAgaXNWZXJ0aWNhbCAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy52ZXJ0aWNhbERlbGltaXRlcnMgIT0gbnVsbFxuICAgIH0sXG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICBpbnRlcm5hbFZhbHVlOiAncmVzdGFydFRpbWVvdXQnLFxuICAgIGludGVydmFsOiAncmVzdGFydFRpbWVvdXQnLFxuICAgIGhlaWdodCAodmFsLCBvbGRWYWwpIHtcbiAgICAgIGlmICh2YWwgPT09IG9sZFZhbCB8fCAhdmFsKSByZXR1cm5cbiAgICAgIHRoaXMuaW50ZXJuYWxIZWlnaHQgPSB2YWxcbiAgICB9LFxuICAgIGN5Y2xlICh2YWwpIHtcbiAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgdGhpcy5yZXN0YXJ0VGltZW91dCgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5zbGlkZVRpbWVvdXQpXG4gICAgICAgIHRoaXMuc2xpZGVUaW1lb3V0ID0gdW5kZWZpbmVkXG4gICAgICB9XG4gICAgfSxcbiAgfSxcblxuICBjcmVhdGVkICgpIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGlmICh0aGlzLiRhdHRycy5oYXNPd25Qcm9wZXJ0eSgnaGlkZS1jb250cm9scycpKSB7XG4gICAgICBicmVha2luZygnaGlkZS1jb250cm9scycsICc6c2hvdy1hcnJvd3M9XCJmYWxzZVwiJywgdGhpcylcbiAgICB9XG4gIH0sXG5cbiAgbW91bnRlZCAoKSB7XG4gICAgdGhpcy5zdGFydFRpbWVvdXQoKVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBnZW5Db250cm9sSWNvbnMgKCkge1xuICAgICAgaWYgKHRoaXMuaXNWZXJ0aWNhbCkgcmV0dXJuIG51bGxcblxuICAgICAgcmV0dXJuIFZXaW5kb3cub3B0aW9ucy5tZXRob2RzLmdlbkNvbnRyb2xJY29ucy5jYWxsKHRoaXMpXG4gICAgfSxcbiAgICBnZW5EZWxpbWl0ZXJzICgpOiBWTm9kZSB7XG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3YtY2Fyb3VzZWxfX2NvbnRyb2xzJyxcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICBsZWZ0OiB0aGlzLnZlcnRpY2FsRGVsaW1pdGVycyA9PT0gJ2xlZnQnICYmIHRoaXMuaXNWZXJ0aWNhbCA/IDAgOiAnYXV0bycsXG4gICAgICAgICAgcmlnaHQ6IHRoaXMudmVydGljYWxEZWxpbWl0ZXJzID09PSAncmlnaHQnID8gMCA6ICdhdXRvJyxcbiAgICAgICAgfSxcbiAgICAgIH0sIFt0aGlzLmdlbkl0ZW1zKCldKVxuICAgIH0sXG4gICAgZ2VuSXRlbXMgKCk6IFZOb2RlIHtcbiAgICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMuaXRlbXMubGVuZ3RoXG4gICAgICBjb25zdCBjaGlsZHJlbiA9IFtdXG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgY2hpbGQgPSB0aGlzLiRjcmVhdGVFbGVtZW50KFZCdG4sIHtcbiAgICAgICAgICBzdGF0aWNDbGFzczogJ3YtY2Fyb3VzZWxfX2NvbnRyb2xzX19pdGVtJyxcbiAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgJ2FyaWEtbGFiZWwnOiB0aGlzLiR2dWV0aWZ5LmxhbmcudCgnJHZ1ZXRpZnkuY2Fyb3VzZWwuYXJpYUxhYmVsLmRlbGltaXRlcicsIGkgKyAxLCBsZW5ndGgpLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICAgIGljb246IHRydWUsXG4gICAgICAgICAgICBzbWFsbDogdHJ1ZSxcbiAgICAgICAgICAgIHZhbHVlOiB0aGlzLmdldFZhbHVlKHRoaXMuaXRlbXNbaV0sIGkpLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sIFtcbiAgICAgICAgICB0aGlzLiRjcmVhdGVFbGVtZW50KFZJY29uLCB7XG4gICAgICAgICAgICBwcm9wczogeyBzaXplOiAxOCB9LFxuICAgICAgICAgIH0sIHRoaXMuZGVsaW1pdGVySWNvbiksXG4gICAgICAgIF0pXG5cbiAgICAgICAgY2hpbGRyZW4ucHVzaChjaGlsZClcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoQnV0dG9uR3JvdXAsIHtcbiAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICB2YWx1ZTogdGhpcy5pbnRlcm5hbFZhbHVlLFxuICAgICAgICAgIG1hbmRhdG9yeTogdGhpcy5tYW5kYXRvcnksXG4gICAgICAgIH0sXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgY2hhbmdlOiAodmFsOiBhbnkpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaW50ZXJuYWxWYWx1ZSA9IHZhbFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LCBjaGlsZHJlbilcbiAgICB9LFxuICAgIGdlblByb2dyZXNzICgpIHtcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZQcm9ncmVzc0xpbmVhciwge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3YtY2Fyb3VzZWxfX3Byb2dyZXNzJyxcbiAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICBjb2xvcjogdGhpcy5wcm9ncmVzc0NvbG9yLFxuICAgICAgICAgIHZhbHVlOiAodGhpcy5pbnRlcm5hbEluZGV4ICsgMSkgLyB0aGlzLml0ZW1zLmxlbmd0aCAqIDEwMCxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfSxcbiAgICByZXN0YXJ0VGltZW91dCAoKSB7XG4gICAgICB0aGlzLnNsaWRlVGltZW91dCAmJiBjbGVhclRpbWVvdXQodGhpcy5zbGlkZVRpbWVvdXQpXG4gICAgICB0aGlzLnNsaWRlVGltZW91dCA9IHVuZGVmaW5lZFxuXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuc3RhcnRUaW1lb3V0KVxuICAgIH0sXG4gICAgc3RhcnRUaW1lb3V0ICgpIHtcbiAgICAgIGlmICghdGhpcy5jeWNsZSkgcmV0dXJuXG5cbiAgICAgIHRoaXMuc2xpZGVUaW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQodGhpcy5uZXh0LCArdGhpcy5pbnRlcnZhbCA+IDAgPyArdGhpcy5pbnRlcnZhbCA6IDYwMDApXG4gICAgfSxcbiAgfSxcblxuICByZW5kZXIgKGgpOiBWTm9kZSB7XG4gICAgY29uc3QgcmVuZGVyID0gVldpbmRvdy5vcHRpb25zLnJlbmRlci5jYWxsKHRoaXMsIGgpXG5cbiAgICByZW5kZXIuZGF0YSEuc3R5bGUgPSBgaGVpZ2h0OiAke2NvbnZlcnRUb1VuaXQodGhpcy5oZWlnaHQpfTtgXG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgIGlmICghdGhpcy5oaWRlRGVsaW1pdGVycykge1xuICAgICAgcmVuZGVyLmNoaWxkcmVuIS5wdXNoKHRoaXMuZ2VuRGVsaW1pdGVycygpKVxuICAgIH1cblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgaWYgKHRoaXMucHJvZ3Jlc3MgfHwgdGhpcy5wcm9ncmVzc0NvbG9yKSB7XG4gICAgICByZW5kZXIuY2hpbGRyZW4hLnB1c2godGhpcy5nZW5Qcm9ncmVzcygpKVxuICAgIH1cblxuICAgIHJldHVybiByZW5kZXJcbiAgfSxcbn0pXG4iXX0=