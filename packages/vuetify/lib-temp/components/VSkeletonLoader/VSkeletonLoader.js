// Styles
import './VSkeletonLoader.sass';
// Mixins
import Elevatable from '../../mixins/elevatable';
import Measurable from '../../mixins/measurable';
import Themeable from '../../mixins/themeable';
// Utilities
import mixins from '../../util/mixins';
import { getSlot } from '../../util/helpers';
/* @vue/component */
export default mixins(Elevatable, Measurable, Themeable).extend({
    name: 'VSkeletonLoader',
    props: {
        boilerplate: Boolean,
        loading: Boolean,
        tile: Boolean,
        transition: String,
        type: String,
        types: {
            type: Object,
            default: () => ({}),
        },
    },
    computed: {
        attrs() {
            if (!this.isLoading)
                return this.$attrs;
            return !this.boilerplate ? {
                'aria-busy': true,
                'aria-live': 'polite',
                role: 'alert',
                ...this.$attrs,
            } : {};
        },
        classes() {
            return {
                'v-skeleton-loader--boilerplate': this.boilerplate,
                'v-skeleton-loader--is-loading': this.isLoading,
                'v-skeleton-loader--tile': this.tile,
                ...this.themeClasses,
                ...this.elevationClasses,
            };
        },
        isLoading() {
            return !('default' in this.$scopedSlots) || this.loading;
        },
        rootTypes() {
            return {
                actions: 'button@2',
                article: 'heading, paragraph',
                avatar: 'avatar',
                button: 'button',
                card: 'image, card-heading',
                'card-avatar': 'image, list-item-avatar',
                'card-heading': 'heading',
                chip: 'chip',
                'date-picker': 'list-item, card-heading, divider, date-picker-options, date-picker-days, actions',
                'date-picker-options': 'text, avatar@2',
                'date-picker-days': 'avatar@28',
                heading: 'heading',
                image: 'image',
                'list-item': 'text',
                'list-item-avatar': 'avatar, text',
                'list-item-two-line': 'sentences',
                'list-item-avatar-two-line': 'avatar, sentences',
                'list-item-three-line': 'paragraph',
                'list-item-avatar-three-line': 'avatar, paragraph',
                paragraph: 'text@3',
                sentences: 'text@2',
                table: 'table-heading, table-thead, table-tbody, table-tfoot',
                'table-heading': 'heading, text',
                'table-thead': 'heading@6',
                'table-tbody': 'table-row-divider@6',
                'table-row-divider': 'table-row, divider',
                'table-row': 'table-cell@6',
                'table-cell': 'text',
                'table-tfoot': 'text@2, avatar@2',
                text: 'text',
                ...this.types,
            };
        },
    },
    methods: {
        genBone(text, children) {
            return this.$createElement('div', {
                staticClass: `v-skeleton-loader__${text} v-skeleton-loader__bone`,
            }, children);
        },
        genBones(bone) {
            // e.g. 'text@3'
            const [type, length] = bone.split('@');
            const generator = () => this.genStructure(type);
            // Generate a length array based upon
            // value after @ in the bone string
            return Array.from({ length }).map(generator);
        },
        // Fix type when this is merged
        // https://github.com/microsoft/TypeScript/pull/33050
        genStructure(type) {
            let children = [];
            type = type || this.type || '';
            const bone = this.rootTypes[type] || '';
            // End of recursion, do nothing
            /* eslint-disable-next-line no-empty, brace-style */
            if (type === bone) { }
            // Array of values - e.g. 'heading, paragraph, text@2'
            else if (type.indexOf(',') > -1)
                return this.mapBones(type);
            // Array of values - e.g. 'paragraph@4'
            else if (type.indexOf('@') > -1)
                return this.genBones(type);
            // Array of values - e.g. 'card@2'
            else if (bone.indexOf(',') > -1)
                children = this.mapBones(bone);
            // Array of values - e.g. 'list-item@2'
            else if (bone.indexOf('@') > -1)
                children = this.genBones(bone);
            // Single value - e.g. 'card-heading'
            else if (bone)
                children.push(this.genStructure(bone));
            return [this.genBone(type, children)];
        },
        genSkeleton() {
            const children = [];
            if (!this.isLoading)
                children.push(getSlot(this));
            else
                children.push(this.genStructure());
            /* istanbul ignore else */
            if (!this.transition)
                return children;
            /* istanbul ignore next */
            return this.$createElement('transition', {
                props: {
                    name: this.transition,
                },
                // Only show transition when
                // content has been loaded
                on: {
                    afterEnter: this.resetStyles,
                    beforeEnter: this.onBeforeEnter,
                    beforeLeave: this.onBeforeLeave,
                    leaveCancelled: this.resetStyles,
                },
            }, children);
        },
        mapBones(bones) {
            // Remove spaces and return array of structures
            return bones.replace(/\s/g, '').split(',').map(this.genStructure);
        },
        onBeforeEnter(el) {
            this.resetStyles(el);
            if (!this.isLoading)
                return;
            el._initialStyle = {
                display: el.style.display,
                transition: el.style.transition,
            };
            el.style.setProperty('transition', 'none', 'important');
        },
        onBeforeLeave(el) {
            el.style.setProperty('display', 'none', 'important');
        },
        resetStyles(el) {
            if (!el._initialStyle)
                return;
            el.style.display = el._initialStyle.display || '';
            el.style.transition = el._initialStyle.transition;
            delete el._initialStyle;
        },
    },
    render(h) {
        return h('div', {
            staticClass: 'v-skeleton-loader',
            attrs: this.attrs,
            on: this.$listeners,
            class: this.classes,
            style: this.isLoading ? this.measurableStyles : undefined,
        }, [this.genSkeleton()]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlNrZWxldG9uTG9hZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVlNrZWxldG9uTG9hZGVyL1ZTa2VsZXRvbkxvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyx3QkFBd0IsQ0FBQTtBQUUvQixTQUFTO0FBQ1QsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFDaEQsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFDaEQsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFFOUMsWUFBWTtBQUNaLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBSXRDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQVM1QyxvQkFBb0I7QUFDcEIsZUFBZSxNQUFNLENBQ25CLFVBQVUsRUFDVixVQUFVLEVBQ1YsU0FBUyxDQUNWLENBQUMsTUFBTSxDQUFDO0lBQ1AsSUFBSSxFQUFFLGlCQUFpQjtJQUV2QixLQUFLLEVBQUU7UUFDTCxXQUFXLEVBQUUsT0FBTztRQUNwQixPQUFPLEVBQUUsT0FBTztRQUNoQixJQUFJLEVBQUUsT0FBTztRQUNiLFVBQVUsRUFBRSxNQUFNO1FBQ2xCLElBQUksRUFBRSxNQUFNO1FBQ1osS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLE1BQTBDO1lBQ2hELE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztTQUNwQjtLQUNGO0lBRUQsUUFBUSxFQUFFO1FBQ1IsS0FBSztZQUNILElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUztnQkFBRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUE7WUFFdkMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixXQUFXLEVBQUUsSUFBSTtnQkFDakIsV0FBVyxFQUFFLFFBQVE7Z0JBQ3JCLElBQUksRUFBRSxPQUFPO2dCQUNiLEdB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QUFXLENBQUMsQ0FBQTtRQUN0RCxDQUFDO1FBQ0QsV0FBVyxDQUFFLEVBQTZCO1lBQ3hDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYTtnQkFBRSxPQUFNO1lBRTdCLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQTtZQUNqRCxFQUFFLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQTtZQUVqRCxPQUFPLEVBQUUsQ0FBQyxhQUFhLENBQUE7UUFDekIsQ0FBQztLQUNGO0lBRUQsTUFBTSxDQUFFLENBQUM7UUFDUCxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUU7WUFDZCxXQUFXLEVBQUUsbUJBQW1CO1lBQ2hDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztZQUNqQixFQUFFLEVBQUUsSUFBSSxDQUFDLFVBQVU7WUFDbkIsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ25CLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLFNBQVM7U0FDMUQsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUE7SUFDMUIsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xuaW1wb3J0ICcuL1ZTa2VsZXRvbkxvYWRlci5zYXNzJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBFbGV2YXRhYmxlIGZyb20gJy4uLy4uL21peGlucy9lbGV2YXRhYmxlJ1xuaW1wb3J0IE1lYXN1cmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL21lYXN1cmFibGUnXG5pbXBvcnQgVGhlbWVhYmxlIGZyb20gJy4uLy4uL21peGlucy90aGVtZWFibGUnXG5cbi8vIFV0aWxpdGllc1xuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcblxuLy8gVHlwZXNcbmltcG9ydCB7IFZOb2RlLCBQcm9wVHlwZSB9IGZyb20gJ3Z1ZSdcbmltcG9ydCB7IGdldFNsb3QgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5cbmV4cG9ydCBpbnRlcmZhY2UgSFRNTFNrZWxldG9uTG9hZGVyRWxlbWVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgX2luaXRpYWxTdHlsZT86IHtcbiAgICBkaXNwbGF5OiBzdHJpbmcgfCBudWxsXG4gICAgdHJhbnNpdGlvbjogc3RyaW5nXG4gIH1cbn1cblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IG1peGlucyhcbiAgRWxldmF0YWJsZSxcbiAgTWVhc3VyYWJsZSxcbiAgVGhlbWVhYmxlLFxuKS5leHRlbmQoe1xuICBuYW1lOiAnVlNrZWxldG9uTG9hZGVyJyxcblxuICBwcm9wczoge1xuICAgIGJvaWxlcnBsYXRlOiBCb29sZWFuLFxuICAgIGxvYWRpbmc6IEJvb2xlYW4sXG4gICAgdGlsZTogQm9vbGVhbixcbiAgICB0cmFuc2l0aW9uOiBTdHJpbmcsXG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHR5cGVzOiB7XG4gICAgICB0eXBlOiBPYmplY3QgYXMgUHJvcFR5cGU8UmVjb3JkPHN0cmluZywgc3RyaW5nPj4sXG4gICAgICBkZWZhdWx0OiAoKSA9PiAoe30pLFxuICAgIH0sXG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBhdHRycyAoKTogb2JqZWN0IHtcbiAgICAgIGlmICghdGhpcy5pc0xvYWRpbmcpIHJldHVybiB0aGlzLiRhdHRyc1xuXG4gICAgICByZXR1cm4gIXRoaXMuYm9pbGVycGxhdGUgPyB7XG4gICAgICAgICdhcmlhLWJ1c3knOiB0cnVlLFxuICAgICAgICAnYXJpYS1saXZlJzogJ3BvbGl0ZScsXG4gICAgICAgIHJvbGU6ICdhbGVydCcsXG4gICAgICAgIC4uLnRoaXMuJGF0dHJzLFxuICAgICAgfSA6IHt9XG4gICAgfSxcbiAgICBjbGFzc2VzICgpOiBvYmplY3Qge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgJ3Ytc2tlbGV0b24tbG9hZGVyLS1ib2lsZXJwbGF0ZSc6IHRoaXMuYm9pbGVycGxhdGUsXG4gICAgICAgICd2LXNrZWxldG9uLWxvYWRlci0taXMtbG9hZGluZyc6IHRoaXMuaXNMb2FkaW5nLFxuICAgICAgICAndi1za2VsZXRvbi1sb2FkZXItLXRpbGUnOiB0aGlzLnRpbGUsXG4gICAgICAgIC4uLnRoaXMudGhlbWVDbGFzc2VzLFxuICAgICAgICAuLi50aGlzLmVsZXZhdGlvbkNsYXNzZXMsXG4gICAgICB9XG4gICAgfSxcbiAgICBpc0xvYWRpbmcgKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuICEoJ2RlZmF1bHQnIGluIHRoaXMuJHNjb3BlZFNsb3RzKSB8fCB0aGlzLmxvYWRpbmdcbiAgICB9LFxuICAgIHJvb3RUeXBlcyAoKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBhY3Rpb25zOiAnYnV0dG9uQDInLFxuICAgICAgICBhcnRpY2xlOiAnaGVhZGluZywgcGFyYWdyYXBoJyxcbiAgICAgICAgYXZhdGFyOiAnYXZhdGFyJyxcbiAgICAgICAgYnV0dG9uOiAnYnV0dG9uJyxcbiAgICAgICAgY2FyZDogJ2ltYWdlLCBjYXJkLWhlYWRpbmcnLFxuICAgICAgICAnY2FyZC1hdmF0YXInOiAnaW1hZ2UsIGxpc3QtaXRlbS1hdmF0YXInLFxuICAgICAgICAnY2FyZC1oZWFkaW5nJzogJ2hlYWRpbmcnLFxuICAgICAgICBjaGlwOiAnY2hpcCcsXG4gICAgICAgICdkYXRlLXBpY2tlcic6ICdsaXN0LWl0ZW0sIGNhcmQtaGVhZGluZywgZGl2aWRlciwgZGF0ZS1waWNrZXItb3B0aW9ucywgZGF0ZS1waWNrZXItZGF5cywgYWN0aW9ucycsXG4gICAgICAgICdkYXRlLXBpY2tlci1vcHRpb25zJzogJ3RleHQsIGF2YXRhckAyJyxcbiAgICAgICAgJ2RhdGUtcGlja2VyLWRheXMnOiAnYXZhdGFyQDI4JyxcbiAgICAgICAgaGVhZGluZzogJ2hlYWRpbmcnLFxuICAgICAgICBpbWFnZTogJ2ltYWdlJyxcbiAgICAgICAgJ2xpc3QtaXRlbSc6ICd0ZXh0JyxcbiAgICAgICAgJ2xpc3QtaXRlbS1hdmF0YXInOiAnYXZhdGFyLCB0ZXh0JyxcbiAgICAgICAgJ2xpc3QtaXRlbS10d28tbGluZSc6ICdzZW50ZW5jZXMnLFxuICAgICAgICAnbGlzdC1pdGVtLWF2YXRhci10d28tbGluZSc6ICdhdmF0YXIsIHNlbnRlbmNlcycsXG4gICAgICAgICdsaXN0LWl0ZW0tdGhyZWUtbGluZSc6ICdwYXJhZ3JhcGgnLFxuICAgICAgICAnbGlzdC1pdGVtLWF2YXRhci10aHJlZS1saW5lJzogJ2F2YXRhciwgcGFyYWdyYXBoJyxcbiAgICAgICAgcGFyYWdyYXBoOiAndGV4dEAzJyxcbiAgICAgICAgc2VudGVuY2VzOiAndGV4dEAyJyxcbiAgICAgICAgdGFibGU6ICd0YWJsZS1oZWFkaW5nLCB0YWJsZS10aGVhZCwgdGFibGUtdGJvZHksIHRhYmxlLXRmb290JyxcbiAgICAgICAgJ3RhYmxlLWhlYWRpbmcnOiAnaGVhZGluZywgdGV4dCcsXG4gICAgICAgICd0YWJsZS10aGVhZCc6ICdoZWFkaW5nQDYnLFxuICAgICAgICAndGFibGUtdGJvZHknOiAndGFibGUtcm93LWRpdmlkZXJANicsXG4gICAgICAgICd0YWJsZS1yb3ctZGl2aWRlcic6ICd0YWJsZS1yb3csIGRpdmlkZXInLFxuICAgICAgICAndGFibGUtcm93JzogJ3RhYmxlLWNlbGxANicsXG4gICAgICAgICd0YWJsZS1jZWxsJzogJ3RleHQnLFxuICAgICAgICAndGFibGUtdGZvb3QnOiAndGV4dEAyLCBhdmF0YXJAMicsXG4gICAgICAgIHRleHQ6ICd0ZXh0JyxcbiAgICAgICAgLi4udGhpcy50eXBlcyxcbiAgICAgIH1cbiAgICB9LFxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBnZW5Cb25lICh0ZXh0OiBzdHJpbmcsIGNoaWxkcmVuOiBWTm9kZVtdKSB7XG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICBzdGF0aWNDbGFzczogYHYtc2tlbGV0b24tbG9hZGVyX18ke3RleHR9IHYtc2tlbGV0b24tbG9hZGVyX19ib25lYCxcbiAgICAgIH0sIGNoaWxkcmVuKVxuICAgIH0sXG4gICAgZ2VuQm9uZXMgKGJvbmU6IHN0cmluZyk6IFZOb2RlW10ge1xuICAgICAgLy8gZS5nLiAndGV4dEAzJ1xuICAgICAgY29uc3QgW3R5cGUsIGxlbmd0aF0gPSBib25lLnNwbGl0KCdAJykgYXMgW3N0cmluZywgbnVtYmVyXVxuICAgICAgY29uc3QgZ2VuZXJhdG9yID0gKCkgPT4gdGhpcy5nZW5TdHJ1Y3R1cmUodHlwZSlcblxuICAgICAgLy8gR2VuZXJhdGUgYSBsZW5ndGggYXJyYXkgYmFzZWQgdXBvblxuICAgICAgLy8gdmFsdWUgYWZ0ZXIgQCBpbiB0aGUgYm9uZSBzdHJpbmdcbiAgICAgIHJldHVybiBBcnJheS5mcm9tKHsgbGVuZ3RoIH0pLm1hcChnZW5lcmF0b3IpXG4gICAgfSxcbiAgICAvLyBGaXggdHlwZSB3aGVuIHRoaXMgaXMgbWVyZ2VkXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L3B1bGwvMzMwNTBcbiAgICBnZW5TdHJ1Y3R1cmUgKHR5cGU/OiBzdHJpbmcpOiBhbnkge1xuICAgICAgbGV0IGNoaWxkcmVuID0gW11cbiAgICAgIHR5cGUgPSB0eXBlIHx8IHRoaXMudHlwZSB8fCAnJ1xuICAgICAgY29uc3QgYm9uZSA9IHRoaXMucm9vdFR5cGVzW3R5cGVdIHx8ICcnXG5cbiAgICAgIC8vIEVuZCBvZiByZWN1cnNpb24sIGRvIG5vdGhpbmdcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1lbXB0eSwgYnJhY2Utc3R5bGUgKi9cbiAgICAgIGlmICh0eXBlID09PSBib25lKSB7fVxuICAgICAgLy8gQXJyYXkgb2YgdmFsdWVzIC0gZS5nLiAnaGVhZGluZywgcGFyYWdyYXBoLCB0ZXh0QDInXG4gICAgICBlbHNlIGlmICh0eXBlLmluZGV4T2YoJywnKSA+IC0xKSByZXR1cm4gdGhpcy5tYXBCb25lcyh0eXBlKVxuICAgICAgLy8gQXJyYXkgb2YgdmFsdWVzIC0gZS5nLiAncGFyYWdyYXBoQDQnXG4gICAgICBlbHNlIGlmICh0eXBlLmluZGV4T2YoJ0AnKSA+IC0xKSByZXR1cm4gdGhpcy5nZW5Cb25lcyh0eXBlKVxuICAgICAgLy8gQXJyYXkgb2YgdmFsdWVzIC0gZS5nLiAnY2FyZEAyJ1xuICAgICAgZWxzZSBpZiAoYm9uZS5pbmRleE9mKCcsJykgPiAtMSkgY2hpbGRyZW4gPSB0aGlzLm1hcEJvbmVzKGJvbmUpXG4gICAgICAvLyBBcnJheSBvZiB2YWx1ZXMgLSBlLmcuICdsaXN0LWl0ZW1AMidcbiAgICAgIGVsc2UgaWYgKGJvbmUuaW5kZXhPZignQCcpID4gLTEpIGNoaWxkcmVuID0gdGhpcy5nZW5Cb25lcyhib25lKVxuICAgICAgLy8gU2luZ2xlIHZhbHVlIC0gZS5nLiAnY2FyZC1oZWFkaW5nJ1xuICAgICAgZWxzZSBpZiAoYm9uZSkgY2hpbGRyZW4ucHVzaCh0aGlzLmdlblN0cnVjdHVyZShib25lKSlcblxuICAgICAgcmV0dXJuIFt0aGlzLmdlbkJvbmUodHlwZSwgY2hpbGRyZW4pXVxuICAgIH0sXG4gICAgZ2VuU2tlbGV0b24gKCkge1xuICAgICAgY29uc3QgY2hpbGRyZW4gPSBbXVxuXG4gICAgICBpZiAoIXRoaXMuaXNMb2FkaW5nKSBjaGlsZHJlbi5wdXNoKGdldFNsb3QodGhpcykpXG4gICAgICBlbHNlIGNoaWxkcmVuLnB1c2godGhpcy5nZW5TdHJ1Y3R1cmUoKSlcblxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgIGlmICghdGhpcy50cmFuc2l0aW9uKSByZXR1cm4gY2hpbGRyZW5cblxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCd0cmFuc2l0aW9uJywge1xuICAgICAgICBwcm9wczoge1xuICAgICAgICAgIG5hbWU6IHRoaXMudHJhbnNpdGlvbixcbiAgICAgICAgfSxcbiAgICAgICAgLy8gT25seSBzaG93IHRyYW5zaXRpb24gd2hlblxuICAgICAgICAvLyBjb250ZW50IGhhcyBiZWVuIGxvYWRlZFxuICAgICAgICBvbjoge1xuICAgICAgICAgIGFmdGVyRW50ZXI6IHRoaXMucmVzZXRTdHlsZXMsXG4gICAgICAgICAgYmVmb3JlRW50ZXI6IHRoaXMub25CZWZvcmVFbnRlcixcbiAgICAgICAgICBiZWZvcmVMZWF2ZTogdGhpcy5vbkJlZm9yZUxlYXZlLFxuICAgICAgICAgIGxlYXZlQ2FuY2VsbGVkOiB0aGlzLnJlc2V0U3R5bGVzLFxuICAgICAgICB9LFxuICAgICAgfSwgY2hpbGRyZW4pXG4gICAgfSxcbiAgICBtYXBCb25lcyAoYm9uZXM6IHN0cmluZykge1xuICAgICAgLy8gUmVtb3ZlIHNwYWNlcyBhbmQgcmV0dXJuIGFycmF5IG9mIHN0cnVjdHVyZXNcbiAgICAgIHJldHVybiBib25lcy5yZXBsYWNlKC9cXHMvZywgJycpLnNwbGl0KCcsJykubWFwKHRoaXMuZ2VuU3RydWN0dXJlKVxuICAgIH0sXG4gICAgb25CZWZvcmVFbnRlciAoZWw6IEhUTUxTa2VsZXRvbkxvYWRlckVsZW1lbnQpIHtcbiAgICAgIHRoaXMucmVzZXRTdHlsZXMoZWwpXG5cbiAgICAgIGlmICghdGhpcy5pc0xvYWRpbmcpIHJldHVyblxuXG4gICAgICBlbC5faW5pdGlhbFN0eWxlID0ge1xuICAgICAgICBkaXNwbGF5OiBlbC5zdHlsZS5kaXNwbGF5LFxuICAgICAgICB0cmFuc2l0aW9uOiBlbC5zdHlsZS50cmFuc2l0aW9uLFxuICAgICAgfVxuXG4gICAgICBlbC5zdHlsZS5zZXRQcm9wZXJ0eSgndHJhbnNpdGlvbicsICdub25lJywgJ2ltcG9ydGFudCcpXG4gICAgfSxcbiAgICBvbkJlZm9yZUxlYXZlIChlbDogSFRNTFNrZWxldG9uTG9hZGVyRWxlbWVudCkge1xuICAgICAgZWwuc3R5bGUuc2V0UHJvcGVydHkoJ2Rpc3BsYXknLCAnbm9uZScsICdpbXBvcnRhbnQnKVxuICAgIH0sXG4gICAgcmVzZXRTdHlsZXMgKGVsOiBIVE1MU2tlbGV0b25Mb2FkZXJFbGVtZW50KSB7XG4gICAgICBpZiAoIWVsLl9pbml0aWFsU3R5bGUpIHJldHVyblxuXG4gICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gZWwuX2luaXRpYWxTdHlsZS5kaXNwbGF5IHx8ICcnXG4gICAgICBlbC5zdHlsZS50cmFuc2l0aW9uID0gZWwuX2luaXRpYWxTdHlsZS50cmFuc2l0aW9uXG5cbiAgICAgIGRlbGV0ZSBlbC5faW5pdGlhbFN0eWxlXG4gICAgfSxcbiAgfSxcblxuICByZW5kZXIgKGgpOiBWTm9kZSB7XG4gICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgIHN0YXRpY0NsYXNzOiAndi1za2VsZXRvbi1sb2FkZXInLFxuICAgICAgYXR0cnM6IHRoaXMuYXR0cnMsXG4gICAgICBvbjogdGhpcy4kbGlzdGVuZXJzLFxuICAgICAgY2xhc3M6IHRoaXMuY2xhc3NlcyxcbiAgICAgIHN0eWxlOiB0aGlzLmlzTG9hZGluZyA/IHRoaXMubWVhc3VyYWJsZVN0eWxlcyA6IHVuZGVmaW5lZCxcbiAgICB9LCBbdGhpcy5nZW5Ta2VsZXRvbigpXSlcbiAgfSxcbn0pXG4iXX0=