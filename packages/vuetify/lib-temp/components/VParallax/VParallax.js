// Style
import './VParallax.sass';
// Mixins
import Translatable from '../../mixins/translatable';
import mixins from '../../util/mixins';
const baseMixins = mixins(Translatable);
/* @vue/component */
export default baseMixins.extend().extend({
    name: 'v-parallax',
    props: {
        alt: {
            type: String,
            default: '',
        },
        height: {
            type: [String, Number],
            default: 500,
        },
        src: String,
        srcset: String,
    },
    data: () => ({
        isBooted: false,
    }),
    computed: {
        styles() {
            return {
                display: 'block',
                opacity: this.isBooted ? 1 : 0,
                transform: `translate(-50%, ${this.parallax}px)`,
            };
        },
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            const img = this.$refs.img;
            if (!img)
                return;
            if (img.complete) {
                this.translate();
                this.listeners();
            }
            else {
                img.addEventListener('load', () => {
                    this.translate();
                    this.listeners();
                }, false);
            }
            this.isBooted = true;
        },
        objHeight() {
            return this.$refs.img.naturalHeight;
        },
    },
    render(h) {
        const imgData = {
            staticClass: 'v-parallax__image',
            style: this.styles,
            attrs: {
                src: this.src,
                srcset: this.srcset,
                alt: this.alt,
            },
            ref: 'img',
        };
        const container = h('div', {
            staticClass: 'v-parallax__image-container',
        }, [
            h('img', imgData),
        ]);
        const content = h('div', {
            staticClass: 'v-parallax__content',
        }, this.$slots.default);
        return h('div', {
            staticClass: 'v-parallax',
            style: {
                height: `${this.height}px`,
            },
            on: this.$listeners,
        }, [container, content]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlBhcmFsbGF4LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVlBhcmFsbGF4L1ZQYXJhbGxheC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxRQUFRO0FBQ1IsT0FBTyxrQkFBa0IsQ0FBQTtBQUV6QixTQUFTO0FBQ1QsT0FBTyxZQUFZLE1BQU0sMkJBQTJCLENBQUE7QUFJcEQsT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFFdEMsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUN2QixZQUFZLENBQ2IsQ0FBQTtBQU9ELG9CQUFvQjtBQUNwQixlQUFlLFVBQVUsQ0FBQyxNQUFNLEVBQVcsQ0FBQyxNQUFNLENBQUM7SUFDakQsSUFBSSxFQUFFLFlBQVk7SUFFbEIsS0FBSyxFQUFFO1FBQ0wsR0FBRyxFQUFFO1lBQ0gsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsRUFBRTtTQUNaO1FBQ0QsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN0QixPQUFPLEVBQUUsR0FBRztTQUNiO1FBQ0QsR0FBRyxFQUFFLE1BQU07UUFDWCxNQUFNLEVBQUUsTUFBTTtLQUNmO0lBRUQsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDWCxRQUFRLEVBQUUsS0FBSztLQUNoQixDQUFDO0lBRUYsUUFBUSxFQUFFO1FBQ1IsTUFBTTtZQUNKLE9BQU87Z0JBQ0wsT0FBTyxFQUFFLE9BQU87Z0JBQ2hCLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlCLFNBQVMsRUFBRSxtQkFBbUIsSUFBSSxDQUFDLFFBQVEsS0FBSzthQUNqRCxDQUFBO1FBQ0gsQ0FBQztLQUNGO0lBRUQsT0FBTztRQUNMLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUNiLENBQUM7SUFFRCxPQUFPLEVBQUU7UUFDUCxJQUFJO1lBQ0YsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUE7WUFFMUIsSUFBSSxDQUFDLEdBQUc7Z0JBQUUsT0FBTTtZQUVoQixJQUFJLEdBQUcsQ0FBQyxRQUFRLEVBQUU7Z0JBQ2hCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQTtnQkFDaEIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFBO2FBQ2pCO2lCQUFNO2dCQUNMLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO29CQUNoQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUE7b0JBQ2hCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQTtnQkFDbEIsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFBO2FBQ1Y7WUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQTtRQUN0QixDQUFDO1FBQ0QsU0FBUztZQUNQLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFBO1FBQ3JDLENBQUM7S0FDRjtJQUVELE1BQU0sQ0FBRSxDQUFDO1FBQ1AsTUFBTSxPQUFPLEdBQWM7WUFDekIsV0FBVyxFQUFFLG1CQUFtQjtZQUNoQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbEIsS0FBSyxFQUFFO2dCQUNMLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztnQkFDYixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07Z0JBQ25CLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRzthQUNkO1lBQ0QsR0FBRyxFQUFFLEtBQUs7U0FDWCxDQUFBO1FBRUQsTUFBTSxTQUFTLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRTtZQUN6QixXQUFXLEVBQUUsNkJBQTZCO1NBQzNDLEVBQUU7WUFDRCxDQUFDLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQztTQUNsQixDQUFDLENBQUE7UUFFRixNQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFO1lBQ3ZCLFdBQVcsRUFBRSxxQkFBcUI7U0FDbkMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBRXZCLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRTtZQUNkLFdBQVcsRUFBRSxZQUFZO1lBQ3pCLEtBQUssRUFBRTtnQkFDTCxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJO2FBQzNCO1lBQ0QsRUFBRSxFQUFFLElBQUksQ0FBQyxVQUFVO1NBQ3BCLEVBQUUsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQTtJQUMxQixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVcbmltcG9ydCAnLi9WUGFyYWxsYXguc2FzcydcblxuLy8gTWl4aW5zXG5pbXBvcnQgVHJhbnNsYXRhYmxlIGZyb20gJy4uLy4uL21peGlucy90cmFuc2xhdGFibGUnXG5cbi8vIFR5cGVzXG5pbXBvcnQgeyBWTm9kZSwgVk5vZGVEYXRhIH0gZnJvbSAndnVlL3R5cGVzL3Zub2RlJ1xuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcblxuY29uc3QgYmFzZU1peGlucyA9IG1peGlucyhcbiAgVHJhbnNsYXRhYmxlXG4pXG5pbnRlcmZhY2Ugb3B0aW9ucyBleHRlbmRzIEluc3RhbmNlVHlwZTx0eXBlb2YgYmFzZU1peGlucz4ge1xuICAkcmVmczoge1xuICAgIGltZzogSFRNTEltYWdlRWxlbWVudFxuICB9XG59XG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBiYXNlTWl4aW5zLmV4dGVuZDxvcHRpb25zPigpLmV4dGVuZCh7XG4gIG5hbWU6ICd2LXBhcmFsbGF4JyxcblxuICBwcm9wczoge1xuICAgIGFsdDoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJycsXG4gICAgfSxcbiAgICBoZWlnaHQ6IHtcbiAgICAgIHR5cGU6IFtTdHJpbmcsIE51bWJlcl0sXG4gICAgICBkZWZhdWx0OiA1MDAsXG4gICAgfSxcbiAgICBzcmM6IFN0cmluZyxcbiAgICBzcmNzZXQ6IFN0cmluZyxcbiAgfSxcblxuICBkYXRhOiAoKSA9PiAoe1xuICAgIGlzQm9vdGVkOiBmYWxzZSxcbiAgfSksXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBzdHlsZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBkaXNwbGF5OiAnYmxvY2snLFxuICAgICAgICBvcGFjaXR5OiB0aGlzLmlzQm9vdGVkID8gMSA6IDAsXG4gICAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZSgtNTAlLCAke3RoaXMucGFyYWxsYXh9cHgpYCxcbiAgICAgIH1cbiAgICB9LFxuICB9LFxuXG4gIG1vdW50ZWQgKCkge1xuICAgIHRoaXMuaW5pdCgpXG4gIH0sXG5cbiAgbWV0aG9kczoge1xuICAgIGluaXQgKCkge1xuICAgICAgY29uc3QgaW1nID0gdGhpcy4kcmVmcy5pbWdcblxuICAgICAgaWYgKCFpbWcpIHJldHVyblxuXG4gICAgICBpZiAoaW1nLmNvbXBsZXRlKSB7XG4gICAgICAgIHRoaXMudHJhbnNsYXRlKClcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW1nLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gICAgICAgICAgdGhpcy50cmFuc2xhdGUoKVxuICAgICAgICAgIHRoaXMubGlzdGVuZXJzKClcbiAgICAgICAgfSwgZmFsc2UpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuaXNCb290ZWQgPSB0cnVlXG4gICAgfSxcbiAgICBvYmpIZWlnaHQgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuJHJlZnMuaW1nLm5hdHVyYWxIZWlnaHRcbiAgICB9LFxuICB9LFxuXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcbiAgICBjb25zdCBpbWdEYXRhOiBWTm9kZURhdGEgPSB7XG4gICAgICBzdGF0aWNDbGFzczogJ3YtcGFyYWxsYXhfX2ltYWdlJyxcbiAgICAgIHN0eWxlOiB0aGlzLnN0eWxlcyxcbiAgICAgIGF0dHJzOiB7XG4gICAgICAgIHNyYzogdGhpcy5zcmMsXG4gICAgICAgIHNyY3NldDogdGhpcy5zcmNzZXQsXG4gICAgICAgIGFsdDogdGhpcy5hbHQsXG4gICAgICB9LFxuICAgICAgcmVmOiAnaW1nJyxcbiAgICB9XG5cbiAgICBjb25zdCBjb250YWluZXIgPSBoKCdkaXYnLCB7XG4gICAgICBzdGF0aWNDbGFzczogJ3YtcGFyYWxsYXhfX2ltYWdlLWNvbnRhaW5lcicsXG4gICAgfSwgW1xuICAgICAgaCgnaW1nJywgaW1nRGF0YSksXG4gICAgXSlcblxuICAgIGNvbnN0IGNvbnRlbnQgPSBoKCdkaXYnLCB7XG4gICAgICBzdGF0aWNDbGFzczogJ3YtcGFyYWxsYXhfX2NvbnRlbnQnLFxuICAgIH0sIHRoaXMuJHNsb3RzLmRlZmF1bHQpXG5cbiAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgc3RhdGljQ2xhc3M6ICd2LXBhcmFsbGF4JyxcbiAgICAgIHN0eWxlOiB7XG4gICAgICAgIGhlaWdodDogYCR7dGhpcy5oZWlnaHR9cHhgLFxuICAgICAgfSxcbiAgICAgIG9uOiB0aGlzLiRsaXN0ZW5lcnMsXG4gICAgfSwgW2NvbnRhaW5lciwgY29udGVudF0pXG4gIH0sXG59KVxuIl19