// Styles
import './VImg.sass';
// Directives
import intersect from '../../directives/intersect';
// Components
import VResponsive from '../VResponsive';
// Mixins
import Themeable from '../../mixins/themeable';
// Utils
import mixins from '../../util/mixins';
import mergeData from '../../util/mergeData';
import { consoleWarn } from '../../util/console';
const hasIntersect = typeof window !== 'undefined' && 'IntersectionObserver' in window;
/* @vue/component */
export default mixins(VResponsive, Themeable).extend({
    name: 'v-img',
    directives: { intersect },
    props: {
        alt: String,
        contain: Boolean,
        eager: Boolean,
        gradient: String,
        lazySrc: String,
        options: {
            type: Object,
            // For more information on types, navigate to:
            // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
            default: () => ({
                root: undefined,
                rootMargin: undefined,
                threshold: undefined,
            }),
        },
        position: {
            type: String,
            default: 'center center',
        },
        sizes: String,
        src: {
            type: [String, Object],
            default: '',
        },
        srcset: String,
        transition: {
            type: [Boolean, String],
            default: 'fade-transition',
        },
    },
    data() {
        return {
            currentSrc: '',
            image: null,
            isLoading: true,
            calculatedAspectRatio: undefined,
            naturalWidth: undefined,
            hasError: false,
        };
    },
    computed: {
        computedAspectRatio() {
            return Number(this.normalisedSrc.aspect || this.calculatedAspectRatio);
        },
        normalisedSrc() {
            return this.src && typeof this.src === 'object'
                ? {
                    src: this.src.src,
                    srcset: this.srcset || this.src.srcset,
                    lazySrc: this.lazySrc || this.src.lazySrc,
                    aspect: Number(this.aspectRatio || this.src.aspect),
                } : {
                src: this.src,
                srcset: this.srcset,
                lazySrc: this.lazySrc,
                aspect: Number(this.aspectRatio || 0),
            };
        },
        __cachedImage() {
            if (!(this.normalisedSrc.src || this.normalisedSrc.lazySrc || this.gradient))
                return [];
            const backgroundImage = [];
            const src = this.isLoading ? this.normalisedSrc.lazySrc : this.currentSrc;
            if (this.gradient)
                backgroundImage.push(`linear-gradient(${this.gradient})`);
            if (src)
                backgroundImage.push(`url("${src}")`);
            const image = this.$createElement('div', {
                staticClass: 'v-image__image',
                class: {
                    'v-image__image--preload': this.isLoading,
                    'v-image__image--contain': this.contain,
                    'v-image__image--cover': !this.contain,
                },
                style: {
                    backgroundImage: backgroundImage.join(', '),
                    backgroundPosition: this.position,
                },
                key: +this.isLoading,
            });
            /* istanbul ignore if */
            if (!this.transition)
                return image;
            return this.$createElement('transition', {
                attrs: {
                    name: this.transition,
                    mode: 'in-out',
                },
            }, [image]);
        },
    },
    watch: {
        src() {
            // Force re-init when src changes
            if (!this.isLoading)
                this.init(undefined, undefined, true);
            else
                this.loadImage();
        },
        '$vuetify.breakpoint.width': 'getSrc',
    },
    mounted() {
        this.init();
    },
    methods: {
        init(entries, observer, isIntersecting) {
            // If the current browser supports the intersection
            // observer api, the image is not observable, and
            // the eager prop isn't being used, do not load
            if (hasIntersect &&
                !isIntersecting &&
                !this.eager)
                return;
            if (this.normalisedSrc.lazySrc) {
                const lazyImg = new Image();
                lazyImg.src = this.normalisedSrc.lazySrc;
                this.pollForSize(lazyImg, null);
            }
            /* istanbul ignore else */
            if (this.normalisedSrc.src)
                this.loadImage();
        },
        onLoad() {
            this.getSrc();
            this.isLoading = false;
            this.$emit('load', this.src);
        },
        onError() {
            this.hasError = true;
            this.$emit('error', this.src);
        },
        getSrc() {
            /* istanbul ignore else */
            if (this.image)
                this.currentSrc = this.image.currentSrc || this.image.src;
        },
        loadImage() {
            const image = new Image();
            this.image = image;
            image.onload = () => {
                /* istanbul ignore if */
                if (image.decode) {
                    image.decode().catch((err) => {
                        consoleWarn(`Failed to decode image, trying to render anyway\n\n` +
                            `src: ${this.normalisedSrc.src}` +
                            (err.message ? `\nOriginal error: ${err.message}` : ''), this);
                    }).then(this.onLoad);
                }
                else {
                    this.onLoad();
                }
            };
            image.onerror = this.onError;
            this.hasError = false;
            image.src = this.normalisedSrc.src;
            this.sizes && (image.sizes = this.sizes);
            this.normalisedSrc.srcset && (image.srcset = this.normalisedSrc.srcset);
            this.aspectRatio || this.pollForSize(image);
            this.getSrc();
        },
        pollForSize(img, timeout = 100) {
            const poll = () => {
                const { naturalHeight, naturalWidth } = img;
                if (naturalHeight || naturalWidth) {
                    this.naturalWidth = naturalWidth;
                    this.calculatedAspectRatio = naturalWidth / naturalHeight;
                }
                else {
                    timeout != null && !this.hasError && setTimeout(poll, timeout);
                }
            };
            poll();
        },
        genContent() {
            const content = VResponsive.options.methods.genContent.call(this);
            if (this.naturalWidth) {
                this._b(content.data, 'div', {
                    style: { width: `${this.naturalWidth}px` },
                });
            }
            return content;
        },
        __genPlaceholder() {
            if (this.$slots.placeholder) {
                const placeholder = this.isLoading
                    ? [this.$createElement('div', {
                            staticClass: 'v-image__placeholder',
                        }, this.$slots.placeholder)]
                    : [];
                if (!this.transition)
                    return placeholder[0];
                return this.$createElement('transition', {
                    props: {
                        appear: true,
                        name: this.transition,
                    },
                }, placeholder);
            }
        },
    },
    render(h) {
        const node = VResponsive.options.render.call(this, h);
        const data = mergeData(node.data, {
            staticClass: 'v-image',
            attrs: {
                'aria-label': this.alt,
                role: this.alt ? 'img' : undefined,
            },
            class: this.themeClasses,
            // Only load intersect directive if it
            // will work in the current browser.
            directives: hasIntersect
                ? [{
                        name: 'intersect',
                        modifiers: { once: true },
                        value: {
                            handler: this.init,
                            options: this.options,
                        },
                    }]
                : undefined,
        });
        node.children = [
            this.__cachedSizer,
            this.__cachedImage,
            this.__genPlaceholder(),
            this.genContent(),
        ];
        return h(node.tag, data, node.children);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkltZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZJbWcvVkltZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxhQUFhLENBQUE7QUFFcEIsYUFBYTtBQUNiLE9BQU8sU0FBUyxNQUFNLDRCQUE0QixDQUFBO0FBTWxELGFBQWE7QUFDYixPQUFPLFdBQVcsTUFBTSxnQkFBZ0IsQ0FBQTtBQUV4QyxTQUFTO0FBQ1QsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFFOUMsUUFBUTtBQUNSLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBQ3RDLE9BQU8sU0FBUyxNQUFNLHNCQUFzQixDQUFBO0FBQzVDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQVVoRCxNQUFNLFlBQVksR0FBRyxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksc0JBQXNCLElBQUksTUFBTSxDQUFBO0FBRXRGLG9CQUFvQjtBQUNwQixlQUFlLE1BQU0sQ0FDbkIsV0FBVyxFQUNYLFNBQVMsQ0FDVixDQUFDLE1BQU0sQ0FBQztJQUNQLElBQUksRUFBRSxPQUFPO0lBRWIsVUFBVSxFQUFFLEVBQUUsU0FBUyxFQUFFO0lBRXpCLEtBQUssRUFBRTtRQUNMLEdBQUcsRUFBRSxNQUFNO1FBQ1gsT0FBTyxFQUFFLE9BQU87UUFDaEIsS0FBSyxFQUFFLE9BQU87UUFDZCxRQUFRLEVBQUUsTUFBTTtRQUNoQixPQUFPLEVBQUUsTUFBTTtRQUNmLE9BQU8sRUFBRTtZQUNQLElBQUksRUFBRSxNQUFNO1lBQ1osOENBQThDO1lBQzlDLDZFQUE2RTtZQUM3RSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztnQkFDZCxJQUFJLEVBQUUsU0FBUztnQkFDZixVQUFVLEVBQUUsU0FBUztnQkFDckIsU0FBUyxFQUFFLFNBQVM7YUFDckIsQ0FBQztTQUNIO1FBQ0QsUUFBUSxFQUFFO1lBQ1Is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QUE7UUFFckQsTUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFLLEVBQUU7WUFDakMsV0FBVyxFQUFFLFNBQVM7WUFDdEIsS0FBSyxFQUFFO2dCQUNMLFlBQVksRUFBRSxJQUFJLENBQUMsR0FBRztnQkFDdEIsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUzthQUNuQztZQUNELEtBQUssRUFBRSxJQUFJLENBQUMsWUFBWTtZQUN4QixzQ0FBc0M7WUFDdEMsb0NBQW9DO1lBQ3BDLFVBQVUsRUFBRSxZQUFZO2dCQUN0QixDQUFDLENBQUMsQ0FBQzt3QkFDRCxJQUFJLEVBQUUsV0FBVzt3QkFDakIsU0FBUyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTt3QkFDekIsS0FBSyxFQUFFOzRCQUNMLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSTs0QkFDbEIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO3lCQUN0QjtxQkFDRixDQUFDO2dCQUNGLENBQUMsQ0FBQyxTQUFTO1NBQ2QsQ0FBQyxDQUFBO1FBRUYsSUFBSSxDQUFDLFFBQVEsR0FBRztZQUNkLElBQUksQ0FBQyxhQUFhO1lBQ2xCLElBQUksQ0FBQyxhQUFhO1lBQ2xCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUN2QixJQUFJLENBQUMsVUFBVSxFQUFFO1NBQ1AsQ0FBQTtRQUVaLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUN6QyxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXG5pbXBvcnQgJy4vVkltZy5zYXNzJ1xuXG4vLyBEaXJlY3RpdmVzXG5pbXBvcnQgaW50ZXJzZWN0IGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvaW50ZXJzZWN0J1xuXG4vLyBUeXBlc1xuaW1wb3J0IHsgVk5vZGUgfSBmcm9tICd2dWUnXG5pbXBvcnQgeyBQcm9wVmFsaWRhdG9yIH0gZnJvbSAndnVlL3R5cGVzL29wdGlvbnMnXG5cbi8vIENvbXBvbmVudHNcbmltcG9ydCBWUmVzcG9uc2l2ZSBmcm9tICcuLi9WUmVzcG9uc2l2ZSdcblxuLy8gTWl4aW5zXG5pbXBvcnQgVGhlbWVhYmxlIGZyb20gJy4uLy4uL21peGlucy90aGVtZWFibGUnXG5cbi8vIFV0aWxzXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xuaW1wb3J0IG1lcmdlRGF0YSBmcm9tICcuLi8uLi91dGlsL21lcmdlRGF0YSdcbmltcG9ydCB7IGNvbnNvbGVXYXJuIH0gZnJvbSAnLi4vLi4vdXRpbC9jb25zb2xlJ1xuXG4vLyBub3QgaW50ZW5kZWQgZm9yIHB1YmxpYyB1c2UsIHRoaXMgaXMgcGFzc2VkIGluIGJ5IHZ1ZXRpZnktbG9hZGVyXG5leHBvcnQgaW50ZXJmYWNlIHNyY09iamVjdCB7XG4gIHNyYzogc3RyaW5nXG4gIHNyY3NldD86IHN0cmluZ1xuICBsYXp5U3JjOiBzdHJpbmdcbiAgYXNwZWN0OiBudW1iZXJcbn1cblxuY29uc3QgaGFzSW50ZXJzZWN0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgJ0ludGVyc2VjdGlvbk9ic2VydmVyJyBpbiB3aW5kb3dcblxuLyogQHZ1ZS9jb21wb25lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IG1peGlucyhcbiAgVlJlc3BvbnNpdmUsXG4gIFRoZW1lYWJsZSxcbikuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtaW1nJyxcblxuICBkaXJlY3RpdmVzOiB7IGludGVyc2VjdCB9LFxuXG4gIHByb3BzOiB7XG4gICAgYWx0OiBTdHJpbmcsXG4gICAgY29udGFpbjogQm9vbGVhbixcbiAgICBlYWdlcjogQm9vbGVhbixcbiAgICBncmFkaWVudDogU3RyaW5nLFxuICAgIGxhenlTcmM6IFN0cmluZyxcbiAgICBvcHRpb25zOiB7XG4gICAgICB0eXBlOiBPYmplY3QsXG4gICAgICAvLyBGb3IgbW9yZSBpbmZvcm1hdGlvbiBvbiB0eXBlcywgbmF2aWdhdGUgdG86XG4gICAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvSW50ZXJzZWN0aW9uX09ic2VydmVyX0FQSVxuICAgICAgZGVmYXVsdDogKCkgPT4gKHtcbiAgICAgICAgcm9vdDogdW5kZWZpbmVkLFxuICAgICAgICByb290TWFyZ2luOiB1bmRlZmluZWQsXG4gICAgICAgIHRocmVzaG9sZDogdW5kZWZpbmVkLFxuICAgICAgfSksXG4gICAgfSxcbiAgICBwb3NpdGlvbjoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJ2NlbnRlciBjZW50ZXInLFxuICAgIH0sXG4gICAgc2l6ZXM6IFN0cmluZyxcbiAgICBzcmM6IHtcbiAgICAgIHR5cGU6IFtTdHJpbmcsIE9iamVjdF0sXG4gICAgICBkZWZhdWx0OiAnJyxcbiAgICB9IGFzIFByb3BWYWxpZGF0b3I8c3RyaW5nIHwgc3JjT2JqZWN0PixcbiAgICBzcmNzZXQ6IFN0cmluZyxcbiAgICB0cmFuc2l0aW9uOiB7XG4gICAgICB0eXBlOiBbQm9vbGVhbiwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6ICdmYWRlLXRyYW5zaXRpb24nLFxuICAgIH0sXG4gIH0sXG5cbiAgZGF0YSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGN1cnJlbnRTcmM6ICcnLCAvLyBTZXQgZnJvbSBzcmNzZXRcbiAgICAgIGltYWdlOiBudWxsIGFzIEhUTUxJbWFnZUVsZW1lbnQgfCBudWxsLFxuICAgICAgaXNMb2FkaW5nOiB0cnVlLFxuICAgICAgY2FsY3VsYXRlZEFzcGVjdFJhdGlvOiB1bmRlZmluZWQgYXMgbnVtYmVyIHwgdW5kZWZpbmVkLFxuICAgICAgbmF0dXJhbFdpZHRoOiB1bmRlZmluZWQgYXMgbnVtYmVyIHwgdW5kZWZpbmVkLFxuICAgICAgaGFzRXJyb3I6IGZhbHNlLFxuICAgIH1cbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGNvbXB1dGVkQXNwZWN0UmF0aW8gKCk6IG51bWJlciB7XG4gICAgICByZXR1cm4gTnVtYmVyKHRoaXMubm9ybWFsaXNlZFNyYy5hc3BlY3QgfHwgdGhpcy5jYWxjdWxhdGVkQXNwZWN0UmF0aW8pXG4gICAgfSxcbiAgICBub3JtYWxpc2VkU3JjICgpOiBzcmNPYmplY3Qge1xuICAgICAgcmV0dXJuIHRoaXMuc3JjICYmIHR5cGVvZiB0aGlzLnNyYyA9PT0gJ29iamVjdCdcbiAgICAgICAgPyB7XG4gICAgICAgICAgc3JjOiB0aGlzLnNyYy5zcmMsXG4gICAgICAgICAgc3Jjc2V0OiB0aGlzLnNyY3NldCB8fCB0aGlzLnNyYy5zcmNzZXQsXG4gICAgICAgICAgbGF6eVNyYzogdGhpcy5sYXp5U3JjIHx8IHRoaXMuc3JjLmxhenlTcmMsXG4gICAgICAgICAgYXNwZWN0OiBOdW1iZXIodGhpcy5hc3BlY3RSYXRpbyB8fCB0aGlzLnNyYy5hc3BlY3QpLFxuICAgICAgICB9IDoge1xuICAgICAgICAgIHNyYzogdGhpcy5zcmMsXG4gICAgICAgICAgc3Jjc2V0OiB0aGlzLnNyY3NldCxcbiAgICAgICAgICBsYXp5U3JjOiB0aGlzLmxhenlTcmMsXG4gICAgICAgICAgYXNwZWN0OiBOdW1iZXIodGhpcy5hc3BlY3RSYXRpbyB8fCAwKSxcbiAgICAgICAgfVxuICAgIH0sXG4gICAgX19jYWNoZWRJbWFnZSAoKTogVk5vZGUgfCBbXSB7XG4gICAgICBpZiAoISh0aGlzLm5vcm1hbGlzZWRTcmMuc3JjIHx8IHRoaXMubm9ybWFsaXNlZFNyYy5sYXp5U3JjIHx8IHRoaXMuZ3JhZGllbnQpKSByZXR1cm4gW11cblxuICAgICAgY29uc3QgYmFja2dyb3VuZEltYWdlOiBzdHJpbmdbXSA9IFtdXG4gICAgICBjb25zdCBzcmMgPSB0aGlzLmlzTG9hZGluZyA/IHRoaXMubm9ybWFsaXNlZFNyYy5sYXp5U3JjIDogdGhpcy5jdXJyZW50U3JjXG5cbiAgICAgIGlmICh0aGlzLmdyYWRpZW50KSBiYWNrZ3JvdW5kSW1hZ2UucHVzaChgbGluZWFyLWdyYWRpZW50KCR7dGhpcy5ncmFkaWVudH0pYClcbiAgICAgIGlmIChzcmMpIGJhY2tncm91bmRJbWFnZS5wdXNoKGB1cmwoXCIke3NyY31cIilgKVxuXG4gICAgICBjb25zdCBpbWFnZSA9IHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWltYWdlX19pbWFnZScsXG4gICAgICAgIGNsYXNzOiB7XG4gICAgICAgICAgJ3YtaW1hZ2VfX2ltYWdlLS1wcmVsb2FkJzogdGhpcy5pc0xvYWRpbmcsXG4gICAgICAgICAgJ3YtaW1hZ2VfX2ltYWdlLS1jb250YWluJzogdGhpcy5jb250YWluLFxuICAgICAgICAgICd2LWltYWdlX19pbWFnZS0tY292ZXInOiAhdGhpcy5jb250YWluLFxuICAgICAgICB9LFxuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIGJhY2tncm91bmRJbWFnZTogYmFja2dyb3VuZEltYWdlLmpvaW4oJywgJyksXG4gICAgICAgICAgYmFja2dyb3VuZFBvc2l0aW9uOiB0aGlzLnBvc2l0aW9uLFxuICAgICAgICB9LFxuICAgICAgICBrZXk6ICt0aGlzLmlzTG9hZGluZyxcbiAgICAgIH0pXG5cbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgaWYgKCF0aGlzLnRyYW5zaXRpb24pIHJldHVybiBpbWFnZVxuXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgndHJhbnNpdGlvbicsIHtcbiAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICBuYW1lOiB0aGlzLnRyYW5zaXRpb24sXG4gICAgICAgICAgbW9kZTogJ2luLW91dCcsXG4gICAgICAgIH0sXG4gICAgICB9LCBbaW1hZ2VdKVxuICAgIH0sXG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICBzcmMgKCkge1xuICAgICAgLy8gRm9yY2UgcmUtaW5pdCB3aGVuIHNyYyBjaGFuZ2VzXG4gICAgICBpZiAoIXRoaXMuaXNMb2FkaW5nKSB0aGlzLmluaXQodW5kZWZpbmVkLCB1bmRlZmluZWQsIHRydWUpXG4gICAgICBlbHNlIHRoaXMubG9hZEltYWdlKClcbiAgICB9LFxuICAgICckdnVldGlmeS5icmVha3BvaW50LndpZHRoJzogJ2dldFNyYycsXG4gIH0sXG5cbiAgbW91bnRlZCAoKSB7XG4gICAgdGhpcy5pbml0KClcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgaW5pdCAoXG4gICAgICBlbnRyaWVzPzogSW50ZXJzZWN0aW9uT2JzZXJ2ZXJFbnRyeVtdLFxuICAgICAgb2JzZXJ2ZXI/OiBJbnRlcnNlY3Rpb25PYnNlcnZlcixcbiAgICAgIGlzSW50ZXJzZWN0aW5nPzogYm9vbGVhblxuICAgICkge1xuICAgICAgLy8gSWYgdGhlIGN1cnJlbnQgYnJvd3NlciBzdXBwb3J0cyB0aGUgaW50ZXJzZWN0aW9uXG4gICAgICAvLyBvYnNlcnZlciBhcGksIHRoZSBpbWFnZSBpcyBub3Qgb2JzZXJ2YWJsZSwgYW5kXG4gICAgICAvLyB0aGUgZWFnZXIgcHJvcCBpc24ndCBiZWluZyB1c2VkLCBkbyBub3QgbG9hZFxuICAgICAgaWYgKFxuICAgICAgICBoYXNJbnRlcnNlY3QgJiZcbiAgICAgICAgIWlzSW50ZXJzZWN0aW5nICYmXG4gICAgICAgICF0aGlzLmVhZ2VyXG4gICAgICApIHJldHVyblxuXG4gICAgICBpZiAodGhpcy5ub3JtYWxpc2VkU3JjLmxhenlTcmMpIHtcbiAgICAgICAgY29uc3QgbGF6eUltZyA9IG5ldyBJbWFnZSgpXG4gICAgICAgIGxhenlJbWcuc3JjID0gdGhpcy5ub3JtYWxpc2VkU3JjLmxhenlTcmNcbiAgICAgICAgdGhpcy5wb2xsRm9yU2l6ZShsYXp5SW1nLCBudWxsKVxuICAgICAgfVxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgIGlmICh0aGlzLm5vcm1hbGlzZWRTcmMuc3JjKSB0aGlzLmxvYWRJbWFnZSgpXG4gICAgfSxcbiAgICBvbkxvYWQgKCkge1xuICAgICAgdGhpcy5nZXRTcmMoKVxuICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZVxuICAgICAgdGhpcy4kZW1pdCgnbG9hZCcsIHRoaXMuc3JjKVxuICAgIH0sXG4gICAgb25FcnJvciAoKSB7XG4gICAgICB0aGlzLmhhc0Vycm9yID0gdHJ1ZVxuICAgICAgdGhpcy4kZW1pdCgnZXJyb3InLCB0aGlzLnNyYylcbiAgICB9LFxuICAgIGdldFNyYyAoKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgaWYgKHRoaXMuaW1hZ2UpIHRoaXMuY3VycmVudFNyYyA9IHRoaXMuaW1hZ2UuY3VycmVudFNyYyB8fCB0aGlzLmltYWdlLnNyY1xuICAgIH0sXG4gICAgbG9hZEltYWdlICgpIHtcbiAgICAgIGNvbnN0IGltYWdlID0gbmV3IEltYWdlKClcbiAgICAgIHRoaXMuaW1hZ2UgPSBpbWFnZVxuXG4gICAgICBpbWFnZS5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICBpZiAoaW1hZ2UuZGVjb2RlKSB7XG4gICAgICAgICAgaW1hZ2UuZGVjb2RlKCkuY2F0Y2goKGVycjogRE9NRXhjZXB0aW9uKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlV2FybihcbiAgICAgICAgICAgICAgYEZhaWxlZCB0byBkZWNvZGUgaW1hZ2UsIHRyeWluZyB0byByZW5kZXIgYW55d2F5XFxuXFxuYCArXG4gICAgICAgICAgICAgIGBzcmM6ICR7dGhpcy5ub3JtYWxpc2VkU3JjLnNyY31gICtcbiAgICAgICAgICAgICAgKGVyci5tZXNzYWdlID8gYFxcbk9yaWdpbmFsIGVycm9yOiAke2Vyci5tZXNzYWdlfWAgOiAnJyksXG4gICAgICAgICAgICAgIHRoaXNcbiAgICAgICAgICAgIClcbiAgICAgICAgICB9KS50aGVuKHRoaXMub25Mb2FkKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMub25Mb2FkKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaW1hZ2Uub25lcnJvciA9IHRoaXMub25FcnJvclxuXG4gICAgICB0aGlzLmhhc0Vycm9yID0gZmFsc2VcbiAgICAgIGltYWdlLnNyYyA9IHRoaXMubm9ybWFsaXNlZFNyYy5zcmNcbiAgICAgIHRoaXMuc2l6ZXMgJiYgKGltYWdlLnNpemVzID0gdGhpcy5zaXplcylcbiAgICAgIHRoaXMubm9ybWFsaXNlZFNyYy5zcmNzZXQgJiYgKGltYWdlLnNyY3NldCA9IHRoaXMubm9ybWFsaXNlZFNyYy5zcmNzZXQpXG5cbiAgICAgIHRoaXMuYXNwZWN0UmF0aW8gfHwgdGhpcy5wb2xsRm9yU2l6ZShpbWFnZSlcbiAgICAgIHRoaXMuZ2V0U3JjKClcbiAgICB9LFxuICAgIHBvbGxGb3JTaXplIChpbWc6IEhUTUxJbWFnZUVsZW1lbnQsIHRpbWVvdXQ6IG51bWJlciB8IG51bGwgPSAxMDApIHtcbiAgICAgIGNvbnN0IHBvbGwgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHsgbmF0dXJhbEhlaWdodCwgbmF0dXJhbFdpZHRoIH0gPSBpbWdcblxuICAgICAgICBpZiAobmF0dXJhbEhlaWdodCB8fCBuYXR1cmFsV2lkdGgpIHtcbiAgICAgICAgICB0aGlzLm5hdHVyYWxXaWR0aCA9IG5hdHVyYWxXaWR0aFxuICAgICAgICAgIHRoaXMuY2FsY3VsYXRlZEFzcGVjdFJhdGlvID0gbmF0dXJhbFdpZHRoIC8gbmF0dXJhbEhlaWdodFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRpbWVvdXQgIT0gbnVsbCAmJiAhdGhpcy5oYXNFcnJvciAmJiBzZXRUaW1lb3V0KHBvbGwsIHRpbWVvdXQpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcG9sbCgpXG4gICAgfSxcbiAgICBnZW5Db250ZW50ICgpIHtcbiAgICAgIGNvbnN0IGNvbnRlbnQ6IFZOb2RlID0gVlJlc3BvbnNpdmUub3B0aW9ucy5tZXRob2RzLmdlbkNvbnRlbnQuY2FsbCh0aGlzKVxuICAgICAgaWYgKHRoaXMubmF0dXJhbFdpZHRoKSB7XG4gICAgICAgIHRoaXMuX2IoY29udGVudC5kYXRhISwgJ2RpdicsIHtcbiAgICAgICAgICBzdHlsZTogeyB3aWR0aDogYCR7dGhpcy5uYXR1cmFsV2lkdGh9cHhgIH0sXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjb250ZW50XG4gICAgfSxcbiAgICBfX2dlblBsYWNlaG9sZGVyICgpOiBWTm9kZSB8IHZvaWQge1xuICAgICAgaWYgKHRoaXMuJHNsb3RzLnBsYWNlaG9sZGVyKSB7XG4gICAgICAgIGNvbnN0IHBsYWNlaG9sZGVyID0gdGhpcy5pc0xvYWRpbmdcbiAgICAgICAgICA/IFt0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgICAgICBzdGF0aWNDbGFzczogJ3YtaW1hZ2VfX3BsYWNlaG9sZGVyJyxcbiAgICAgICAgICB9LCB0aGlzLiRzbG90cy5wbGFjZWhvbGRlcildXG4gICAgICAgICAgOiBbXVxuXG4gICAgICAgIGlmICghdGhpcy50cmFuc2l0aW9uKSByZXR1cm4gcGxhY2Vob2xkZXJbMF1cblxuICAgICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgndHJhbnNpdGlvbicsIHtcbiAgICAgICAgICBwcm9wczoge1xuICAgICAgICAgICAgYXBwZWFyOiB0cnVlLFxuICAgICAgICAgICAgbmFtZTogdGhpcy50cmFuc2l0aW9uLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sIHBsYWNlaG9sZGVyKVxuICAgICAgfVxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyIChoKTogVk5vZGUge1xuICAgIGNvbnN0IG5vZGUgPSBWUmVzcG9uc2l2ZS5vcHRpb25zLnJlbmRlci5jYWxsKHRoaXMsIGgpXG5cbiAgICBjb25zdCBkYXRhID0gbWVyZ2VEYXRhKG5vZGUuZGF0YSEsIHtcbiAgICAgIHN0YXRpY0NsYXNzOiAndi1pbWFnZScsXG4gICAgICBhdHRyczoge1xuICAgICAgICAnYXJpYS1sYWJlbCc6IHRoaXMuYWx0LFxuICAgICAgICByb2xlOiB0aGlzLmFsdCA/ICdpbWcnIDogdW5kZWZpbmVkLFxuICAgICAgfSxcbiAgICAgIGNsYXNzOiB0aGlzLnRoZW1lQ2xhc3NlcyxcbiAgICAgIC8vIE9ubHkgbG9hZCBpbnRlcnNlY3QgZGlyZWN0aXZlIGlmIGl0XG4gICAgICAvLyB3aWxsIHdvcmsgaW4gdGhlIGN1cnJlbnQgYnJvd3Nlci5cbiAgICAgIGRpcmVjdGl2ZXM6IGhhc0ludGVyc2VjdFxuICAgICAgICA/IFt7XG4gICAgICAgICAgbmFtZTogJ2ludGVyc2VjdCcsXG4gICAgICAgICAgbW9kaWZpZXJzOiB7IG9uY2U6IHRydWUgfSxcbiAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgaGFuZGxlcjogdGhpcy5pbml0LFxuICAgICAgICAgICAgb3B0aW9uczogdGhpcy5vcHRpb25zLFxuICAgICAgICAgIH0sXG4gICAgICAgIH1dXG4gICAgICAgIDogdW5kZWZpbmVkLFxuICAgIH0pXG5cbiAgICBub2RlLmNoaWxkcmVuID0gW1xuICAgICAgdGhpcy5fX2NhY2hlZFNpemVyLFxuICAgICAgdGhpcy5fX2NhY2hlZEltYWdlLFxuICAgICAgdGhpcy5fX2dlblBsYWNlaG9sZGVyKCksXG4gICAgICB0aGlzLmdlbkNvbnRlbnQoKSxcbiAgICBdIGFzIFZOb2RlW11cblxuICAgIHJldHVybiBoKG5vZGUudGFnLCBkYXRhLCBub2RlLmNoaWxkcmVuKVxuICB9LFxufSlcbiJdfQ==