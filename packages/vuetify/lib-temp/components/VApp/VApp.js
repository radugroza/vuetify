// Styles
import './VApp.sass';
// Mixins
import Themeable from '../../mixins/themeable';
// Utilities
import mixins from '../../util/mixins';
/* @vue/component */
export default mixins(Themeable).extend({
    name: 'v-app',
    props: {
        dark: {
            type: Boolean,
            default: undefined,
        },
        id: {
            type: String,
            default: 'app',
        },
        light: {
            type: Boolean,
            default: undefined,
        },
    },
    computed: {
        isDark() {
            return this.$vuetify.theme.dark;
        },
    },
    beforeCreate() {
        if (!this.$vuetify || (this.$vuetify === this.$root)) {
            throw new Error('Vuetify is not properly initialized, see https://vuetifyjs.com/getting-started/quick-start#bootstrapping-the-vuetify-object');
        }
    },
    render(h) {
        const wrapper = h('div', { staticClass: 'v-application--wrap' }, this.$slots.default);
        return h('div', {
            staticClass: 'v-application',
            class: {
                'v-application--is-rtl': this.$vuetify.rtl,
                'v-application--is-ltr': !this.$vuetify.rtl,
                ...this.themeClasses,
            },
            attrs: { 'data-app': true },
            domProps: { id: this.id },
        }, [wrapper]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkFwcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZBcHAvVkFwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxhQUFhLENBQUE7QUFFcEIsU0FBUztBQUNULE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBRTlDLFlBQVk7QUFDWixPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQUV0QyxvQkFBb0I7QUFDcEIsZUFBZSxNQUFNLENBQ25CLFNBQVMsQ0FDVixDQUFDLE1BQU0sQ0FBQztJQUNQLElBQUksRUFBRSxPQUFPO0lBRWIsS0FBSyxFQUFFO1FBQ0wsSUFBSSxFQUFFO1lBQ0osSUFBSSxFQUFFLE9BQU87WUFDYixPQUFPLEVBQUUsU0FBUztTQUNuQjtRQUNELEVBQUUsRUFBRTtZQUNGLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLEtBQUs7U0FDZjtRQUNELEtBQUssRUFBRTtZQUNMLElBQUksRUFBRSxPQUFPO1lBQ2IsT0FBTyxFQUFFLFNBQVM7U0FDbkI7S0FDRjtJQUVELFFBQVEsRUFBRTtRQUNSLE1BQU07WUFDSixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQTtRQUNqQyxDQUFDO0tBQ0Y7SUFFRCxZQUFZO1FBQ1YsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQyxLQUFZLENBQUMsRUFBRTtZQUMzRCxNQUFNLElBQUksS0FBSyxDQUFDLDZIQUE2SCxDQUFDLENBQUE7U0FDL0k7SUFDSCxDQUFDO0lBRUQsTUFBTSxDQUFFLENBQUM7UUFDUCxNQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsV0FBVyxFQUFFLHFCQUFxQixFQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUVyRixPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUU7WUFDZCxXQUFXLEVBQUUsZUFBZTtZQUM1QixLQUFLLEVBQUU7Z0JBQ0wsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHO2dCQUMxQyx1QkFBdUIsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRztnQkFDM0MsR0FBRyxJQUFJLENBQUMsWUFBWTthQUNyQjtZQUNELEtBQUssRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUU7WUFDM0IsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUU7U0FDMUIsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUE7SUFDZixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXG5pbXBvcnQgJy4vVkFwcC5zYXNzJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFxuICBUaGVtZWFibGVcbikuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtYXBwJyxcblxuICBwcm9wczoge1xuICAgIGRhcms6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgfSxcbiAgICBpZDoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJ2FwcCcsXG4gICAgfSxcbiAgICBsaWdodDoge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICB9LFxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgaXNEYXJrICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLiR2dWV0aWZ5LnRoZW1lLmRhcmtcbiAgICB9LFxuICB9LFxuXG4gIGJlZm9yZUNyZWF0ZSAoKSB7XG4gICAgaWYgKCF0aGlzLiR2dWV0aWZ5IHx8ICh0aGlzLiR2dWV0aWZ5ID09PSB0aGlzLiRyb290IGFzIGFueSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVnVldGlmeSBpcyBub3QgcHJvcGVybHkgaW5pdGlhbGl6ZWQsIHNlZSBodHRwczovL3Z1ZXRpZnlqcy5jb20vZ2V0dGluZy1zdGFydGVkL3F1aWNrLXN0YXJ0I2Jvb3RzdHJhcHBpbmctdGhlLXZ1ZXRpZnktb2JqZWN0JylcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyIChoKSB7XG4gICAgY29uc3Qgd3JhcHBlciA9IGgoJ2RpdicsIHsgc3RhdGljQ2xhc3M6ICd2LWFwcGxpY2F0aW9uLS13cmFwJyB9LCB0aGlzLiRzbG90cy5kZWZhdWx0KVxuXG4gICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgIHN0YXRpY0NsYXNzOiAndi1hcHBsaWNhdGlvbicsXG4gICAgICBjbGFzczoge1xuICAgICAgICAndi1hcHBsaWNhdGlvbi0taXMtcnRsJzogdGhpcy4kdnVldGlmeS5ydGwsXG4gICAgICAgICd2LWFwcGxpY2F0aW9uLS1pcy1sdHInOiAhdGhpcy4kdnVldGlmeS5ydGwsXG4gICAgICAgIC4uLnRoaXMudGhlbWVDbGFzc2VzLFxuICAgICAgfSxcbiAgICAgIGF0dHJzOiB7ICdkYXRhLWFwcCc6IHRydWUgfSxcbiAgICAgIGRvbVByb3BzOiB7IGlkOiB0aGlzLmlkIH0sXG4gICAgfSwgW3dyYXBwZXJdKVxuICB9LFxufSlcbiJdfQ==