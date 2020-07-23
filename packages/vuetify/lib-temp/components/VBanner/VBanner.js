// Styles
import './VBanner.sass';
// Extensions
import VSheet from '../VSheet';
// Components
import VAvatar from '../VAvatar';
import VIcon from '../VIcon';
import { VExpandTransition } from '../transitions';
// Mixins
import Mobile from '../../mixins/mobile';
import Toggleable from '../../mixins/toggleable';
// Utilities
import mixins from '../../util/mixins';
import { convertToUnit, getSlot, } from '../../util/helpers';
/* @vue/component */
export default mixins(VSheet, Mobile, Toggleable).extend({
    name: 'v-banner',
    inheritAttrs: false,
    props: {
        app: Boolean,
        icon: String,
        iconColor: String,
        singleLine: Boolean,
        sticky: Boolean,
        value: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        classes() {
            return {
                ...VSheet.options.computed.classes.call(this),
                'v-banner--has-icon': this.hasIcon,
                'v-banner--is-mobile': this.isMobile,
                'v-banner--single-line': this.singleLine,
                'v-banner--sticky': this.isSticky,
            };
        },
        hasIcon() {
            return Boolean(this.icon || this.$slots.icon);
        },
        isSticky() {
            return this.sticky || this.app;
        },
        styles() {
            const styles = { ...VSheet.options.computed.styles.call(this) };
            if (this.isSticky) {
                const top = !this.app
                    ? 0
                    : (this.$vuetify.application.bar + this.$vuetify.application.top);
                styles.top = convertToUnit(top);
                styles.position = 'sticky';
                styles.zIndex = 1;
            }
            return styles;
        },
    },
    methods: {
        /** @public */
        toggle() {
            this.isActive = !this.isActive;
        },
        iconClick(e) {
            this.$emit('click:icon', e);
        },
        genIcon() {
            if (!this.hasIcon)
                return undefined;
            let content;
            if (this.icon) {
                content = this.$createElement(VIcon, {
                    props: {
                        color: this.iconColor,
                        size: 28,
                    },
                }, [this.icon]);
            }
            else {
                content = this.$slots.icon;
            }
            return this.$createElement(VAvatar, {
                staticClass: 'v-banner__icon',
                props: {
                    color: this.color,
                    size: 40,
                },
                on: {
                    click: this.iconClick,
                },
            }, [content]);
        },
        genText() {
            return this.$createElement('div', {
                staticClass: 'v-banner__text',
            }, this.$slots.default);
        },
        genActions() {
            const children = getSlot(this, 'actions', {
                dismiss: () => this.isActive = false,
            });
            if (!children)
                return undefined;
            return this.$createElement('div', {
                staticClass: 'v-banner__actions',
            }, children);
        },
        genContent() {
            return this.$createElement('div', {
                staticClass: 'v-banner__content',
            }, [
                this.genIcon(),
                this.genText(),
            ]);
        },
        genWrapper() {
            return this.$createElement('div', {
                staticClass: 'v-banner__wrapper',
            }, [
                this.genContent(),
                this.genActions(),
            ]);
        },
    },
    render(h) {
        return h(VExpandTransition, [
            h('div', this.setBackgroundColor(this.color, {
                staticClass: 'v-banner',
                attrs: this.attrs$,
                class: this.classes,
                style: this.styles,
                directives: [{
                        name: 'show',
                        value: this.isActive,
                    }],
            }), [this.genWrapper()]),
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkJhbm5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZCYW5uZXIvVkJhbm5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxnQkFBZ0IsQ0FBQTtBQUV2QixhQUFhO0FBQ2IsT0FBTyxNQUFNLE1BQU0sV0FBVyxDQUFBO0FBRTlCLGFBQWE7QUFDYixPQUFPLE9BQU8sTUFBTSxZQUFZLENBQUE7QUFDaEMsT0FBTyxLQUFLLE1BQU0sVUFBVSxDQUFBO0FBQzVCLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFBO0FBRWxELFNBQVM7QUFDVCxPQUFPLE1BQU0sTUFBTSxxQkFBcUIsQ0FBQTtBQUN4QyxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUVoRCxZQUFZO0FBQ1osT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFDdEMsT0FBTyxFQUNMLGFBQWEsRUFDYixPQUFPLEdBQ1IsTUFBTSxvQkFBb0IsQ0FBQTtBQUszQixvQkFBb0I7QUFDcEIsZUFBZSxNQUFNLENBQ25CLE1BQU0sRUFDTixNQUFNLEVBQ04sVUFBVSxDQUNYLENBQUMsTUFBTSxDQUFDO0lBQ1AsSUFBSSxFQUFFLFVBQVU7SUFFaEIsWUFBWSxFQUFFLEtBQUs7SUFFbkIsS0FBSyxFQUFFO1FBQ0wsR0FBRyxFQUFFLE9BQU87UUFDWixJQUFJLEVBQUUsTUFBTTtRQUNaLFNBQVMsRUFBRSxNQUFNO1FBQ2pCLFVBQVUsRUFBRSxPQUFPO1FBQ25CLE1BQU0sRUFBRSxPQUFPO1FBQ2YsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLE9BQU87WUFDYixPQUFPLEVBQUUsSUFBSTtTQUNkO0tBQ0Y7SUFFRCxRQUFRLEVBQUU7UUFDUixPQUFPO1lBQ0wsT0FBTztnQkFDTCxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUM3QyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsT0FBTztnQkFDbEMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLFFBQVE7Z0JBQ3BDLHVCQUF1QixFQUFFLElBQUksQ0FBQyxVQUFVO2dCQUN4QyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsUUFBUTthQUNsQyxDQUFBO1FBQ0gsQ0FBQztRQUNELE9BQU87WUFDTCxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDL0MsQ0FBQztRQUNELFFBQVE7WUFDTixPQUFPLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQTtRQUNoQyxDQUFDO1FBQ0QsTUFBTTtZQUNKLE1BQU0sTUFBTSxHQUF3QixFQUFFLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFBO1lBRXBGLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDakIsTUFBTSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRztvQkFDbkIsQ0FBQyxDQUFDLENBQUM7b0JBQ0gsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFBO2dCQUVuRSxNQUFNLENBQUMsR0FBRyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFDL0IsTUFBTSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7Z0JBQzFCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFBO2FBQ2xCO1lBRUQsT0FBTyxNQUFNLENBQUE7UUFDZixDQUFDO0tBQ0Y7SUFFRCxPQUFPLEVBQUU7UUFDUCxjQUFjO1FBQ2QsTUFBTTtZQUNKLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFBO1FBQ2hDLENBQUM7UUFDRCxTQUFTLENBQUUsQ0FBYTtZQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUM3QixDQUFDO1FBQ0QsT0FBTztZQUNMLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTztnQkFBRSxPQUFPLFNBQVMsQ0FBQTtZQUVuQyxJQUFJLE9BQU8sQ0FBQTtZQUVYLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDYixPQUFPLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUU7b0JBQ25DLEtBQUssRUFBRTt3QkFDTCxLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVM7d0JBQ3JCLElBQUksRUFBRSxFQUFFO3FCQUNUO2lCQUNGLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTthQUNoQjtpQkFBTTtnQkFDTCxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUE7YUFDM0I7WUFFRCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFO2dCQUNsQyxXQUFXLEVBQUUsZ0JBQWdCO2dCQUM3QixLQUFLLEVBQUU7b0JBQ0wsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO29CQUNqQixJQUFJLEVBQUUsRUFBRTtpQkFDVDtnQkFDRCxFQUFFLEVBQUU7b0JBQ0YsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTO2lCQUN0QjthQUNGLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO1FBQ2YsQ0FBQztRQUNELE9BQU87WUFDTCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFO2dCQUNoQyxXQUFXLEVBQUUsZ0JBQWdCO2FBQzlCLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUN6QixDQUFDO1FBQ0QsVUFBVTtZQUNSLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO2dCQUN4QyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLO2FBQ3JDLENBQUMsQ0FBQTtZQUVGLElBQUksQ0FBQyxRQUFRO2dCQUFFLE9BQU8sU0FBUyxDQUFBO1lBRS9CLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2hDLFdBQVcsRUFBRSxtQkFBbUI7YUFDakMsRUFBRSxRQUFRLENBQUMsQ0FBQTtRQUNkLENBQUM7UUFDRCxVQUFVO1lBQ1IsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRTtnQkFDaEMsV0FBVyxFQUFFLG1CQUFtQjthQUNqQyxFQUFFO2dCQUNELElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLE9BQU8sRUFBRTthQUNmLENBQUMsQ0FBQTtRQUNKLENBQUM7UUFDRCxVQUFVO1lBQ1IsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRTtnQkFDaEMsV0FBVyxFQUFFLG1CQUFtQjthQUNqQyxFQUFFO2dCQUNELElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ2pCLElBQUksQ0FBQyxVQUFVLEVBQUU7YUFDbEIsQ0FBQyxDQUFBO1FBQ0osQ0FBQztLQUNGO0lBRUQsTUFBTSxDQUFFLENBQUM7UUFDUCxPQUFPLENBQUMsQ0FBQyxpQkFBaUIsRUFBRTtZQUMxQixDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUMzQyxXQUFXLEVBQUUsVUFBVTtnQkFDdkIsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNO2dCQUNsQixLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU87Z0JBQ25CLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTTtnQkFDbEIsVUFBVSxFQUFFLENBQUM7d0JBQ1gsSUFBSSxFQUFFLE1BQU07d0JBQ1osS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRO3FCQUNyQixDQUFDO2FBQ0gsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7U0FDekIsQ0FBQyxDQUFBO0lBQ0osQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xuaW1wb3J0ICcuL1ZCYW5uZXIuc2FzcydcblxuLy8gRXh0ZW5zaW9uc1xuaW1wb3J0IFZTaGVldCBmcm9tICcuLi9WU2hlZXQnXG5cbi8vIENvbXBvbmVudHNcbmltcG9ydCBWQXZhdGFyIGZyb20gJy4uL1ZBdmF0YXInXG5pbXBvcnQgVkljb24gZnJvbSAnLi4vVkljb24nXG5pbXBvcnQgeyBWRXhwYW5kVHJhbnNpdGlvbiB9IGZyb20gJy4uL3RyYW5zaXRpb25zJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBNb2JpbGUgZnJvbSAnLi4vLi4vbWl4aW5zL21vYmlsZSdcbmltcG9ydCBUb2dnbGVhYmxlIGZyb20gJy4uLy4uL21peGlucy90b2dnbGVhYmxlJ1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXG5pbXBvcnQge1xuICBjb252ZXJ0VG9Vbml0LFxuICBnZXRTbG90LFxufSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5cbi8vIFR5cGVzbGludFxuaW1wb3J0IHsgVk5vZGUgfSBmcm9tICd2dWUnXG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBtaXhpbnMoXG4gIFZTaGVldCxcbiAgTW9iaWxlLFxuICBUb2dnbGVhYmxlXG4pLmV4dGVuZCh7XG4gIG5hbWU6ICd2LWJhbm5lcicsXG5cbiAgaW5oZXJpdEF0dHJzOiBmYWxzZSxcblxuICBwcm9wczoge1xuICAgIGFwcDogQm9vbGVhbixcbiAgICBpY29uOiBTdHJpbmcsXG4gICAgaWNvbkNvbG9yOiBTdHJpbmcsXG4gICAgc2luZ2xlTGluZTogQm9vbGVhbixcbiAgICBzdGlja3k6IEJvb2xlYW4sXG4gICAgdmFsdWU6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiB0cnVlLFxuICAgIH0sXG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBjbGFzc2VzICgpOiBvYmplY3Qge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uVlNoZWV0Lm9wdGlvbnMuY29tcHV0ZWQuY2xhc3Nlcy5jYWxsKHRoaXMpLFxuICAgICAgICAndi1iYW5uZXItLWhhcy1pY29uJzogdGhpcy5oYXNJY29uLFxuICAgICAgICAndi1iYW5uZXItLWlzLW1vYmlsZSc6IHRoaXMuaXNNb2JpbGUsXG4gICAgICAgICd2LWJhbm5lci0tc2luZ2xlLWxpbmUnOiB0aGlzLnNpbmdsZUxpbmUsXG4gICAgICAgICd2LWJhbm5lci0tc3RpY2t5JzogdGhpcy5pc1N0aWNreSxcbiAgICAgIH1cbiAgICB9LFxuICAgIGhhc0ljb24gKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIEJvb2xlYW4odGhpcy5pY29uIHx8IHRoaXMuJHNsb3RzLmljb24pXG4gICAgfSxcbiAgICBpc1N0aWNreSAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5zdGlja3kgfHwgdGhpcy5hcHBcbiAgICB9LFxuICAgIHN0eWxlcyAoKTogb2JqZWN0IHtcbiAgICAgIGNvbnN0IHN0eWxlczogUmVjb3JkPHN0cmluZywgYW55PiA9IHsgLi4uVlNoZWV0Lm9wdGlvbnMuY29tcHV0ZWQuc3R5bGVzLmNhbGwodGhpcykgfVxuXG4gICAgICBpZiAodGhpcy5pc1N0aWNreSkge1xuICAgICAgICBjb25zdCB0b3AgPSAhdGhpcy5hcHBcbiAgICAgICAgICA/IDBcbiAgICAgICAgICA6ICh0aGlzLiR2dWV0aWZ5LmFwcGxpY2F0aW9uLmJhciArIHRoaXMuJHZ1ZXRpZnkuYXBwbGljYXRpb24udG9wKVxuXG4gICAgICAgIHN0eWxlcy50b3AgPSBjb252ZXJ0VG9Vbml0KHRvcClcbiAgICAgICAgc3R5bGVzLnBvc2l0aW9uID0gJ3N0aWNreSdcbiAgICAgICAgc3R5bGVzLnpJbmRleCA9IDFcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0eWxlc1xuICAgIH0sXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIC8qKiBAcHVibGljICovXG4gICAgdG9nZ2xlICgpIHtcbiAgICAgIHRoaXMuaXNBY3RpdmUgPSAhdGhpcy5pc0FjdGl2ZVxuICAgIH0sXG4gICAgaWNvbkNsaWNrIChlOiBNb3VzZUV2ZW50KSB7XG4gICAgICB0aGlzLiRlbWl0KCdjbGljazppY29uJywgZSlcbiAgICB9LFxuICAgIGdlbkljb24gKCkge1xuICAgICAgaWYgKCF0aGlzLmhhc0ljb24pIHJldHVybiB1bmRlZmluZWRcblxuICAgICAgbGV0IGNvbnRlbnRcblxuICAgICAgaWYgKHRoaXMuaWNvbikge1xuICAgICAgICBjb250ZW50ID0gdGhpcy4kY3JlYXRlRWxlbWVudChWSWNvbiwge1xuICAgICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgICBjb2xvcjogdGhpcy5pY29uQ29sb3IsXG4gICAgICAgICAgICBzaXplOiAyOCxcbiAgICAgICAgICB9LFxuICAgICAgICB9LCBbdGhpcy5pY29uXSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnRlbnQgPSB0aGlzLiRzbG90cy5pY29uXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZBdmF0YXIsIHtcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWJhbm5lcl9faWNvbicsXG4gICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgY29sb3I6IHRoaXMuY29sb3IsXG4gICAgICAgICAgc2l6ZTogNDAsXG4gICAgICAgIH0sXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgY2xpY2s6IHRoaXMuaWNvbkNsaWNrLFxuICAgICAgICB9LFxuICAgICAgfSwgW2NvbnRlbnRdKVxuICAgIH0sXG4gICAgZ2VuVGV4dCAoKSB7XG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3YtYmFubmVyX190ZXh0JyxcbiAgICAgIH0sIHRoaXMuJHNsb3RzLmRlZmF1bHQpXG4gICAgfSxcbiAgICBnZW5BY3Rpb25zICgpIHtcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gZ2V0U2xvdCh0aGlzLCAnYWN0aW9ucycsIHtcbiAgICAgICAgZGlzbWlzczogKCkgPT4gdGhpcy5pc0FjdGl2ZSA9IGZhbHNlLFxuICAgICAgfSlcblxuICAgICAgaWYgKCFjaGlsZHJlbikgcmV0dXJuIHVuZGVmaW5lZFxuXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3YtYmFubmVyX19hY3Rpb25zJyxcbiAgICAgIH0sIGNoaWxkcmVuKVxuICAgIH0sXG4gICAgZ2VuQ29udGVudCAoKSB7XG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICBzdGF0aWNDbGFzczogJ3YtYmFubmVyX19jb250ZW50JyxcbiAgICAgIH0sIFtcbiAgICAgICAgdGhpcy5nZW5JY29uKCksXG4gICAgICAgIHRoaXMuZ2VuVGV4dCgpLFxuICAgICAgXSlcbiAgICB9LFxuICAgIGdlbldyYXBwZXIgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWJhbm5lcl9fd3JhcHBlcicsXG4gICAgICB9LCBbXG4gICAgICAgIHRoaXMuZ2VuQ29udGVudCgpLFxuICAgICAgICB0aGlzLmdlbkFjdGlvbnMoKSxcbiAgICAgIF0pXG4gICAgfSxcbiAgfSxcblxuICByZW5kZXIgKGgpOiBWTm9kZSB7XG4gICAgcmV0dXJuIGgoVkV4cGFuZFRyYW5zaXRpb24sIFtcbiAgICAgIGgoJ2RpdicsIHRoaXMuc2V0QmFja2dyb3VuZENvbG9yKHRoaXMuY29sb3IsIHtcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWJhbm5lcicsXG4gICAgICAgIGF0dHJzOiB0aGlzLmF0dHJzJCxcbiAgICAgICAgY2xhc3M6IHRoaXMuY2xhc3NlcyxcbiAgICAgICAgc3R5bGU6IHRoaXMuc3R5bGVzLFxuICAgICAgICBkaXJlY3RpdmVzOiBbe1xuICAgICAgICAgIG5hbWU6ICdzaG93JyxcbiAgICAgICAgICB2YWx1ZTogdGhpcy5pc0FjdGl2ZSxcbiAgICAgICAgfV0sXG4gICAgICB9KSwgW3RoaXMuZ2VuV3JhcHBlcigpXSksXG4gICAgXSlcbiAgfSxcbn0pXG4iXX0=