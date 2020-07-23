// Styles
import './VAppBar.sass';
// Extensions
import VToolbar from '../VToolbar/VToolbar';
// Directives
import Scroll from '../../directives/scroll';
// Mixins
import Applicationable from '../../mixins/applicationable';
import Scrollable from '../../mixins/scrollable';
import SSRBootable from '../../mixins/ssr-bootable';
import Toggleable from '../../mixins/toggleable';
// Utilities
import { convertToUnit } from '../../util/helpers';
import mixins from '../../util/mixins';
const baseMixins = mixins(VToolbar, Scrollable, SSRBootable, Toggleable, Applicationable('top', [
    'clippedLeft',
    'clippedRight',
    'computedHeight',
    'invertedScroll',
    'isExtended',
    'isProminent',
    'value',
]));
/* @vue/component */
export default baseMixins.extend({
    name: 'v-app-bar',
    directives: { Scroll },
    props: {
        clippedLeft: Boolean,
        clippedRight: Boolean,
        collapseOnScroll: Boolean,
        elevateOnScroll: Boolean,
        fadeImgOnScroll: Boolean,
        hideOnScroll: Boolean,
        invertedScroll: Boolean,
        scrollOffScreen: Boolean,
        shrinkOnScroll: Boolean,
        value: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            isActive: this.value,
        };
    },
    computed: {
        applicationProperty() {
            return !this.bottom ? 'top' : 'bottom';
        },
        canScroll() {
            return (Scrollable.options.computed.canScroll.call(this) &&
                (this.invertedScroll ||
                    this.elevateOnScroll ||
                    this.hideOnScroll ||
                    this.collapseOnScroll ||
                    this.isBooted ||
                    // If falsey, user has provided an
                    // explicit value which should
                    // overwrite anything we do
                    !this.value));
        },
        classes() {
            return {
                ...VToolbar.options.computed.classes.call(this),
                'v-toolbar--collapse': this.collapse || this.collapseOnScroll,
                'v-app-bar': true,
                'v-app-bar--clipped': this.clippedLeft || this.clippedRight,
                'v-app-bar--fade-img-on-scroll': this.fadeImgOnScroll,
                'v-app-bar--elevate-on-scroll': this.elevateOnScroll,
                'v-app-bar--fixed': !this.absolute && (this.app || this.fixed),
                'v-app-bar--hide-shadow': this.hideShadow,
                'v-app-bar--is-scrolled': this.currentScroll > 0,
                'v-app-bar--shrink-on-scroll': this.shrinkOnScroll,
            };
        },
        computedContentHeight() {
            if (!this.shrinkOnScroll)
                return VToolbar.options.computed.computedContentHeight.call(this);
            const height = this.computedOriginalHeight;
            const min = this.dense ? 48 : 56;
            const max = height;
            const difference = max - min;
            const iteration = difference / this.computedScrollThreshold;
            const offset = this.currentScroll * iteration;
            return Math.max(min, max - offset);
        },
        computedFontSize() {
            if (!this.isProminent)
                return undefined;
            const max = this.dense ? 96 : 128;
            const difference = max - this.computedContentHeight;
            const increment = 0.00347;
            // 1.5rem to a minimum of 1.25rem
            return Number((1.50 - difference * increment).toFixed(2));
        },
        computedLeft() {
            if (!this.app || this.clippedLeft)
                return 0;
            return this.$vuetify.application.left;
        },
        computedMarginTop() {
            if (!this.app)
                return 0;
            return this.$vuetify.application.bar;
        },
        computedOpacity() {
            if (!this.fadeImgOnScroll)
                return undefined;
            const opacity = Math.max((this.computedScrollThreshold - this.currentScroll) / this.computedScrollThreshold, 0);
            return Number(parseFloat(opacity).toFixed(2));
        },
        computedOriginalHeight() {
            let height = VToolbar.options.computed.computedContentHeight.call(this);
            if (this.isExtended)
                height += parseInt(this.extensionHeight);
            return height;
        },
        computedRight() {
            if (!this.app || this.clippedRight)
                return 0;
            return this.$vuetify.application.right;
        },
        computedScrollThreshold() {
            if (this.scrollThreshold)
                return Number(this.scrollThreshold);
            return this.computedOriginalHeight - (this.dense ? 48 : 56);
        },
        computedTransform() {
            if (!this.canScroll ||
                (this.elevateOnScroll && this.currentScroll === 0 && this.isActive))
                return 0;
            if (this.isActive)
                return 0;
            const scrollOffScreen = this.scrollOffScreen
                ? this.computedHeight
                : this.computedContentHeight;
            return this.bottom ? scrollOffScreen : -scrollOffScreen;
        },
        hideShadow() {
            if (this.elevateOnScroll && this.isExtended) {
                return this.currentScroll < this.computedScrollThreshold;
            }
            if (this.elevateOnScroll) {
                return this.currentScroll === 0 ||
                    this.computedTransform < 0;
            }
            return (!this.isExtended ||
                this.scrollOffScreen) && this.computedTransform !== 0;
        },
        isCollapsed() {
            if (!this.collapseOnScroll) {
                return VToolbar.options.computed.isCollapsed.call(this);
            }
            return this.currentScroll > 0;
        },
        isProminent() {
            return (VToolbar.options.computed.isProminent.call(this) ||
                this.shrinkOnScroll);
        },
        styles() {
            return {
                ...VToolbar.options.computed.styles.call(this),
                fontSize: convertToUnit(this.computedFontSize, 'rem'),
                marginTop: convertToUnit(this.computedMarginTop),
                transform: `translateY(${convertToUnit(this.computedTransform)})`,
                left: convertToUnit(this.computedLeft),
                right: convertToUnit(this.computedRight),
            };
        },
    },
    watch: {
        canScroll: 'onScroll',
        computedTransform() {
            // Normally we do not want the v-app-bar
            // to update the application top value
            // to avoid screen jump. However, in
            // this situation, we must so that
            // the clipped drawer can update
            // its top value when scrolled
            if (!this.canScroll ||
                (!this.clippedLeft && !this.clippedRight))
                return;
            this.callUpdate();
        },
        invertedScroll(val) {
            this.isActive = !val || this.currentScroll !== 0;
        },
    },
    created() {
        if (this.invertedScroll)
            this.isActive = false;
    },
    methods: {
        genBackground() {
            const render = VToolbar.options.methods.genBackground.call(this);
            render.data = this._b(render.data || {}, render.tag, {
                style: { opacity: this.computedOpacity },
            });
            return render;
        },
        updateApplication() {
            return this.invertedScroll
                ? 0
                : this.computedHeight + this.computedTransform;
        },
        thresholdMet() {
            if (this.invertedScroll) {
                this.isActive = this.currentScroll > this.computedScrollThreshold;
                return;
            }
            if (this.hideOnScroll) {
                this.isActive = this.isScrollingUp ||
                    this.currentScroll < this.computedScrollThreshold;
            }
            if (this.currentThreshold < this.computedScrollThreshold)
                return;
            this.savedScroll = this.currentScroll;
        },
    },
    render(h) {
        const render = VToolbar.options.render.call(this, h);
        render.data = render.data || {};
        if (this.canScroll) {
            render.data.directives = render.data.directives || [];
            render.data.directives.push({
                arg: this.scrollTarget,
                name: 'scroll',
                value: this.onScroll,
            });
        }
        return render;
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkFwcEJhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZBcHBCYXIvVkFwcEJhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxnQkFBZ0IsQ0FBQTtBQUV2QixhQUFhO0FBQ2IsT0FBTyxRQUFRLE1BQU0sc0JBQXNCLENBQUE7QUFFM0MsYUFBYTtBQUNiLE9BQU8sTUFBTSxNQUFNLHlCQUF5QixDQUFBO0FBRTVDLFNBQVM7QUFDVCxPQUFPLGVBQWUsTUFBTSw4QkFBOEIsQ0FBQTtBQUMxRCxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUNoRCxPQUFPLFdBQVcsTUFBTSwyQkFBMkIsQ0FBQTtBQUNuRCxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUVoRCxZQUFZO0FBQ1osT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQ2xELE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBS3RDLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FDdkIsUUFBUSxFQUNSLFVBQVUsRUFDVixXQUFXLEVBQ1gsVUFBVSxFQUNWLGVBQWUsQ0FBQyxLQUFLLEVBQUU7SUFDckIsYUFBYTtJQUNiLGNBQWM7SUFDZCxnQkFBZ0I7SUFDaEIsZ0JBQWdCO0lBQ2hCLFlBQVk7SUFDWixhQUFhO0lBQ2IsT0FBTztDQUNSLENBQUMsQ0FDSCxDQUFBO0FBRUQsb0JBQW9CO0FBQ3BCLGVBQWUsVUFBVSxDQUFDLE1BQU0sQ0FBQztJQUMvQixJQUFJLEVBQUUsV0FBVztJQUVqQixVQUFVLEVBQUUsRUFBRSxNQUFNLEVBQUU7SUFFdEIsS0FBSyxFQUFFO1FBQ0wsV0FBVyxFQUFFLE9BQU87UUFDcEIsWUFBWSxFQUFFLE9BQU87UUFDckIsZ0JBQWdCLEVBQUUsT0FBTztRQUN6QixlQUFlLEVBQUUsT0FBTztRQUN4QixlQUFlLEVBQUUsT0FBTztRQUN4QixZQUFZLEVBQUUsT0FB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LEVBQUU7Z0JBQ3ZCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUE7Z0JBQ2pFLE9BQU07YUFDUDtZQUVELElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtnQkFDckIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsYUFBYTtvQkFDaEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUE7YUFDcEQ7WUFFRCxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsdUJBQXVCO2dCQUFFLE9BQU07WUFFaEUsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFBO1FBQ3ZDLENBQUM7S0FDRjtJQUVELE1BQU0sQ0FBRSxDQUFDO1FBQ1AsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUVwRCxNQUFNLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFBO1FBRS9CLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUE7WUFDckQsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO2dCQUMxQixHQUFHLEVBQUUsSUFBSSxDQUFDLFlBQVk7Z0JBQ3RCLElBQUksRUFBRSxRQUFRO2dCQUNkLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUTthQUNyQixDQUFDLENBQUE7U0FDSDtRQUVELE9BQU8sTUFBTSxDQUFBO0lBQ2YsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xuaW1wb3J0ICcuL1ZBcHBCYXIuc2FzcydcblxuLy8gRXh0ZW5zaW9uc1xuaW1wb3J0IFZUb29sYmFyIGZyb20gJy4uL1ZUb29sYmFyL1ZUb29sYmFyJ1xuXG4vLyBEaXJlY3RpdmVzXG5pbXBvcnQgU2Nyb2xsIGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvc2Nyb2xsJ1xuXG4vLyBNaXhpbnNcbmltcG9ydCBBcHBsaWNhdGlvbmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2FwcGxpY2F0aW9uYWJsZSdcbmltcG9ydCBTY3JvbGxhYmxlIGZyb20gJy4uLy4uL21peGlucy9zY3JvbGxhYmxlJ1xuaW1wb3J0IFNTUkJvb3RhYmxlIGZyb20gJy4uLy4uL21peGlucy9zc3ItYm9vdGFibGUnXG5pbXBvcnQgVG9nZ2xlYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdG9nZ2xlYWJsZSdcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgeyBjb252ZXJ0VG9Vbml0IH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcblxuLy8gVHlwZXNcbmltcG9ydCB7IFZOb2RlIH0gZnJvbSAndnVlJ1xuXG5jb25zdCBiYXNlTWl4aW5zID0gbWl4aW5zKFxuICBWVG9vbGJhcixcbiAgU2Nyb2xsYWJsZSxcbiAgU1NSQm9vdGFibGUsXG4gIFRvZ2dsZWFibGUsXG4gIEFwcGxpY2F0aW9uYWJsZSgndG9wJywgW1xuICAgICdjbGlwcGVkTGVmdCcsXG4gICAgJ2NsaXBwZWRSaWdodCcsXG4gICAgJ2NvbXB1dGVkSGVpZ2h0JyxcbiAgICAnaW52ZXJ0ZWRTY3JvbGwnLFxuICAgICdpc0V4dGVuZGVkJyxcbiAgICAnaXNQcm9taW5lbnQnLFxuICAgICd2YWx1ZScsXG4gIF0pXG4pXG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBiYXNlTWl4aW5zLmV4dGVuZCh7XG4gIG5hbWU6ICd2LWFwcC1iYXInLFxuXG4gIGRpcmVjdGl2ZXM6IHsgU2Nyb2xsIH0sXG5cbiAgcHJvcHM6IHtcbiAgICBjbGlwcGVkTGVmdDogQm9vbGVhbixcbiAgICBjbGlwcGVkUmlnaHQ6IEJvb2xlYW4sXG4gICAgY29sbGFwc2VPblNjcm9sbDogQm9vbGVhbixcbiAgICBlbGV2YXRlT25TY3JvbGw6IEJvb2xlYW4sXG4gICAgZmFkZUltZ09uU2Nyb2xsOiBCb29sZWFuLFxuICAgIGhpZGVPblNjcm9sbDogQm9vbGVhbixcbiAgICBpbnZlcnRlZFNjcm9sbDogQm9vbGVhbixcbiAgICBzY3JvbGxPZmZTY3JlZW46IEJvb2xlYW4sXG4gICAgc2hyaW5rT25TY3JvbGw6IEJvb2xlYW4sXG4gICAgdmFsdWU6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBkZWZhdWx0OiB0cnVlLFxuICAgIH0sXG4gIH0sXG5cbiAgZGF0YSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlzQWN0aXZlOiB0aGlzLnZhbHVlLFxuICAgIH1cbiAgfSxcblxuICBjb21wdXRlZDoge1xuICAgIGFwcGxpY2F0aW9uUHJvcGVydHkgKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gIXRoaXMuYm90dG9tID8gJ3RvcCcgOiAnYm90dG9tJ1xuICAgIH0sXG4gICAgY2FuU2Nyb2xsICgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFNjcm9sbGFibGUub3B0aW9ucy5jb21wdXRlZC5jYW5TY3JvbGwuY2FsbCh0aGlzKSAmJlxuICAgICAgICAoXG4gICAgICAgICAgdGhpcy5pbnZlcnRlZFNjcm9sbCB8fFxuICAgICAgICAgIHRoaXMuZWxldmF0ZU9uU2Nyb2xsIHx8XG4gICAgICAgICAgdGhpcy5oaWRlT25TY3JvbGwgfHxcbiAgICAgICAgICB0aGlzLmNvbGxhcHNlT25TY3JvbGwgfHxcbiAgICAgICAgICB0aGlzLmlzQm9vdGVkIHx8XG4gICAgICAgICAgLy8gSWYgZmFsc2V5LCB1c2VyIGhhcyBwcm92aWRlZCBhblxuICAgICAgICAgIC8vIGV4cGxpY2l0IHZhbHVlIHdoaWNoIHNob3VsZFxuICAgICAgICAgIC8vIG92ZXJ3cml0ZSBhbnl0aGluZyB3ZSBkb1xuICAgICAgICAgICF0aGlzLnZhbHVlXG4gICAgICAgIClcbiAgICAgIClcbiAgICB9LFxuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5WVG9vbGJhci5vcHRpb25zLmNvbXB1dGVkLmNsYXNzZXMuY2FsbCh0aGlzKSxcbiAgICAgICAgJ3YtdG9vbGJhci0tY29sbGFwc2UnOiB0aGlzLmNvbGxhcHNlIHx8IHRoaXMuY29sbGFwc2VPblNjcm9sbCxcbiAgICAgICAgJ3YtYXBwLWJhcic6IHRydWUsXG4gICAgICAgICd2LWFwcC1iYXItLWNsaXBwZWQnOiB0aGlzLmNsaXBwZWRMZWZ0IHx8IHRoaXMuY2xpcHBlZFJpZ2h0LFxuICAgICAgICAndi1hcHAtYmFyLS1mYWRlLWltZy1vbi1zY3JvbGwnOiB0aGlzLmZhZGVJbWdPblNjcm9sbCxcbiAgICAgICAgJ3YtYXBwLWJhci0tZWxldmF0ZS1vbi1zY3JvbGwnOiB0aGlzLmVsZXZhdGVPblNjcm9sbCxcbiAgICAgICAgJ3YtYXBwLWJhci0tZml4ZWQnOiAhdGhpcy5hYnNvbHV0ZSAmJiAodGhpcy5hcHAgfHwgdGhpcy5maXhlZCksXG4gICAgICAgICd2LWFwcC1iYXItLWhpZGUtc2hhZG93JzogdGhpcy5oaWRlU2hhZG93LFxuICAgICAgICAndi1hcHAtYmFyLS1pcy1zY3JvbGxlZCc6IHRoaXMuY3VycmVudFNjcm9sbCA+IDAsXG4gICAgICAgICd2LWFwcC1iYXItLXNocmluay1vbi1zY3JvbGwnOiB0aGlzLnNocmlua09uU2Nyb2xsLFxuICAgICAgfVxuICAgIH0sXG4gICAgY29tcHV0ZWRDb250ZW50SGVpZ2h0ICgpOiBudW1iZXIge1xuICAgICAgaWYgKCF0aGlzLnNocmlua09uU2Nyb2xsKSByZXR1cm4gVlRvb2xiYXIub3B0aW9ucy5jb21wdXRlZC5jb21wdXRlZENvbnRlbnRIZWlnaHQuY2FsbCh0aGlzKVxuXG4gICAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmNvbXB1dGVkT3JpZ2luYWxIZWlnaHRcblxuICAgICAgY29uc3QgbWluID0gdGhpcy5kZW5zZSA/IDQ4IDogNTZcbiAgICAgIGNvbnN0IG1heCA9IGhlaWdodFxuICAgICAgY29uc3QgZGlmZmVyZW5jZSA9IG1heCAtIG1pblxuICAgICAgY29uc3QgaXRlcmF0aW9uID0gZGlmZmVyZW5jZSAvIHRoaXMuY29tcHV0ZWRTY3JvbGxUaHJlc2hvbGRcbiAgICAgIGNvbnN0IG9mZnNldCA9IHRoaXMuY3VycmVudFNjcm9sbCAqIGl0ZXJhdGlvblxuXG4gICAgICByZXR1cm4gTWF0aC5tYXgobWluLCBtYXggLSBvZmZzZXQpXG4gICAgfSxcbiAgICBjb21wdXRlZEZvbnRTaXplICgpOiBudW1iZXIgfCB1bmRlZmluZWQge1xuICAgICAgaWYgKCF0aGlzLmlzUHJvbWluZW50KSByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICAgIGNvbnN0IG1heCA9IHRoaXMuZGVuc2UgPyA5NiA6IDEyOFxuICAgICAgY29uc3QgZGlmZmVyZW5jZSA9IG1heCAtIHRoaXMuY29tcHV0ZWRDb250ZW50SGVpZ2h0XG4gICAgICBjb25zdCBpbmNyZW1lbnQgPSAwLjAwMzQ3XG5cbiAgICAgIC8vIDEuNXJlbSB0byBhIG1pbmltdW0gb2YgMS4yNXJlbVxuICAgICAgcmV0dXJuIE51bWJlcigoMS41MCAtIGRpZmZlcmVuY2UgKiBpbmNyZW1lbnQpLnRvRml4ZWQoMikpXG4gICAgfSxcbiAgICBjb21wdXRlZExlZnQgKCk6IG51bWJlciB7XG4gICAgICBpZiAoIXRoaXMuYXBwIHx8IHRoaXMuY2xpcHBlZExlZnQpIHJldHVybiAwXG5cbiAgICAgIHJldHVybiB0aGlzLiR2dWV0aWZ5LmFwcGxpY2F0aW9uLmxlZnRcbiAgICB9LFxuICAgIGNvbXB1dGVkTWFyZ2luVG9wICgpOiBudW1iZXIge1xuICAgICAgaWYgKCF0aGlzLmFwcCkgcmV0dXJuIDBcblxuICAgICAgcmV0dXJuIHRoaXMuJHZ1ZXRpZnkuYXBwbGljYXRpb24uYmFyXG4gICAgfSxcbiAgICBjb21wdXRlZE9wYWNpdHkgKCk6IG51bWJlciB8IHVuZGVmaW5lZCB7XG4gICAgICBpZiAoIXRoaXMuZmFkZUltZ09uU2Nyb2xsKSByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICAgIGNvbnN0IG9wYWNpdHkgPSBNYXRoLm1heChcbiAgICAgICAgKHRoaXMuY29tcHV0ZWRTY3JvbGxUaHJlc2hvbGQgLSB0aGlzLmN1cnJlbnRTY3JvbGwpIC8gdGhpcy5jb21wdXRlZFNjcm9sbFRocmVzaG9sZCxcbiAgICAgICAgMFxuICAgICAgKVxuXG4gICAgICByZXR1cm4gTnVtYmVyKHBhcnNlRmxvYXQob3BhY2l0eSkudG9GaXhlZCgyKSlcbiAgICB9LFxuICAgIGNvbXB1dGVkT3JpZ2luYWxIZWlnaHQgKCk6IG51bWJlciB7XG4gICAgICBsZXQgaGVpZ2h0ID0gVlRvb2xiYXIub3B0aW9ucy5jb21wdXRlZC5jb21wdXRlZENvbnRlbnRIZWlnaHQuY2FsbCh0aGlzKVxuICAgICAgaWYgKHRoaXMuaXNFeHRlbmRlZCkgaGVpZ2h0ICs9IHBhcnNlSW50KHRoaXMuZXh0ZW5zaW9uSGVpZ2h0KVxuICAgICAgcmV0dXJuIGhlaWdodFxuICAgIH0sXG4gICAgY29tcHV0ZWRSaWdodCAoKTogbnVtYmVyIHtcbiAgICAgIGlmICghdGhpcy5hcHAgfHwgdGhpcy5jbGlwcGVkUmlnaHQpIHJldHVybiAwXG5cbiAgICAgIHJldHVybiB0aGlzLiR2dWV0aWZ5LmFwcGxpY2F0aW9uLnJpZ2h0XG4gICAgfSxcbiAgICBjb21wdXRlZFNjcm9sbFRocmVzaG9sZCAoKTogbnVtYmVyIHtcbiAgICAgIGlmICh0aGlzLnNjcm9sbFRocmVzaG9sZCkgcmV0dXJuIE51bWJlcih0aGlzLnNjcm9sbFRocmVzaG9sZClcblxuICAgICAgcmV0dXJuIHRoaXMuY29tcHV0ZWRPcmlnaW5hbEhlaWdodCAtICh0aGlzLmRlbnNlID8gNDggOiA1NilcbiAgICB9LFxuICAgIGNvbXB1dGVkVHJhbnNmb3JtICgpOiBudW1iZXIge1xuICAgICAgaWYgKFxuICAgICAgICAhdGhpcy5jYW5TY3JvbGwgfHxcbiAgICAgICAgKHRoaXMuZWxldmF0ZU9uU2Nyb2xsICYmIHRoaXMuY3VycmVudFNjcm9sbCA9PT0gMCAmJiB0aGlzLmlzQWN0aXZlKVxuICAgICAgKSByZXR1cm4gMFxuXG4gICAgICBpZiAodGhpcy5pc0FjdGl2ZSkgcmV0dXJuIDBcblxuICAgICAgY29uc3Qgc2Nyb2xsT2ZmU2NyZWVuID0gdGhpcy5zY3JvbGxPZmZTY3JlZW5cbiAgICAgICAgPyB0aGlzLmNvbXB1dGVkSGVpZ2h0XG4gICAgICAgIDogdGhpcy5jb21wdXRlZENvbnRlbnRIZWlnaHRcblxuICAgICAgcmV0dXJuIHRoaXMuYm90dG9tID8gc2Nyb2xsT2ZmU2NyZWVuIDogLXNjcm9sbE9mZlNjcmVlblxuICAgIH0sXG4gICAgaGlkZVNoYWRvdyAoKTogYm9vbGVhbiB7XG4gICAgICBpZiAodGhpcy5lbGV2YXRlT25TY3JvbGwgJiYgdGhpcy5pc0V4dGVuZGVkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRTY3JvbGwgPCB0aGlzLmNvbXB1dGVkU2Nyb2xsVGhyZXNob2xkXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmVsZXZhdGVPblNjcm9sbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50U2Nyb2xsID09PSAwIHx8XG4gICAgICAgICAgdGhpcy5jb21wdXRlZFRyYW5zZm9ybSA8IDBcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgIXRoaXMuaXNFeHRlbmRlZCB8fFxuICAgICAgICB0aGlzLnNjcm9sbE9mZlNjcmVlblxuICAgICAgKSAmJiB0aGlzLmNvbXB1dGVkVHJhbnNmb3JtICE9PSAwXG4gICAgfSxcbiAgICBpc0NvbGxhcHNlZCAoKTogYm9vbGVhbiB7XG4gICAgICBpZiAoIXRoaXMuY29sbGFwc2VPblNjcm9sbCkge1xuICAgICAgICByZXR1cm4gVlRvb2xiYXIub3B0aW9ucy5jb21wdXRlZC5pc0NvbGxhcHNlZC5jYWxsKHRoaXMpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRTY3JvbGwgPiAwXG4gICAgfSxcbiAgICBpc1Byb21pbmVudCAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBWVG9vbGJhci5vcHRpb25zLmNvbXB1dGVkLmlzUHJvbWluZW50LmNhbGwodGhpcykgfHxcbiAgICAgICAgdGhpcy5zaHJpbmtPblNjcm9sbFxuICAgICAgKVxuICAgIH0sXG4gICAgc3R5bGVzICgpOiBvYmplY3Qge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uVlRvb2xiYXIub3B0aW9ucy5jb21wdXRlZC5zdHlsZXMuY2FsbCh0aGlzKSxcbiAgICAgICAgZm9udFNpemU6IGNvbnZlcnRUb1VuaXQodGhpcy5jb21wdXRlZEZvbnRTaXplLCAncmVtJyksXG4gICAgICAgIG1hcmdpblRvcDogY29udmVydFRvVW5pdCh0aGlzLmNvbXB1dGVkTWFyZ2luVG9wKSxcbiAgICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlWSgke2NvbnZlcnRUb1VuaXQodGhpcy5jb21wdXRlZFRyYW5zZm9ybSl9KWAsXG4gICAgICAgIGxlZnQ6IGNvbnZlcnRUb1VuaXQodGhpcy5jb21wdXRlZExlZnQpLFxuICAgICAgICByaWdodDogY29udmVydFRvVW5pdCh0aGlzLmNvbXB1dGVkUmlnaHQpLFxuICAgICAgfVxuICAgIH0sXG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICBjYW5TY3JvbGw6ICdvblNjcm9sbCcsXG4gICAgY29tcHV0ZWRUcmFuc2Zvcm0gKCkge1xuICAgICAgLy8gTm9ybWFsbHkgd2UgZG8gbm90IHdhbnQgdGhlIHYtYXBwLWJhclxuICAgICAgLy8gdG8gdXBkYXRlIHRoZSBhcHBsaWNhdGlvbiB0b3AgdmFsdWVcbiAgICAgIC8vIHRvIGF2b2lkIHNjcmVlbiBqdW1wLiBIb3dldmVyLCBpblxuICAgICAgLy8gdGhpcyBzaXR1YXRpb24sIHdlIG11c3Qgc28gdGhhdFxuICAgICAgLy8gdGhlIGNsaXBwZWQgZHJhd2VyIGNhbiB1cGRhdGVcbiAgICAgIC8vIGl0cyB0b3AgdmFsdWUgd2hlbiBzY3JvbGxlZFxuICAgICAgaWYgKFxuICAgICAgICAhdGhpcy5jYW5TY3JvbGwgfHxcbiAgICAgICAgKCF0aGlzLmNsaXBwZWRMZWZ0ICYmICF0aGlzLmNsaXBwZWRSaWdodClcbiAgICAgICkgcmV0dXJuXG5cbiAgICAgIHRoaXMuY2FsbFVwZGF0ZSgpXG4gICAgfSxcbiAgICBpbnZlcnRlZFNjcm9sbCAodmFsOiBib29sZWFuKSB7XG4gICAgICB0aGlzLmlzQWN0aXZlID0gIXZhbCB8fCB0aGlzLmN1cnJlbnRTY3JvbGwgIT09IDBcbiAgICB9LFxuICB9LFxuXG4gIGNyZWF0ZWQgKCkge1xuICAgIGlmICh0aGlzLmludmVydGVkU2Nyb2xsKSB0aGlzLmlzQWN0aXZlID0gZmFsc2VcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgZ2VuQmFja2dyb3VuZCAoKSB7XG4gICAgICBjb25zdCByZW5kZXIgPSBWVG9vbGJhci5vcHRpb25zLm1ldGhvZHMuZ2VuQmFja2dyb3VuZC5jYWxsKHRoaXMpXG5cbiAgICAgIHJlbmRlci5kYXRhID0gdGhpcy5fYihyZW5kZXIuZGF0YSB8fCB7fSwgcmVuZGVyLnRhZyEsIHtcbiAgICAgICAgc3R5bGU6IHsgb3BhY2l0eTogdGhpcy5jb21wdXRlZE9wYWNpdHkgfSxcbiAgICAgIH0pXG5cbiAgICAgIHJldHVybiByZW5kZXJcbiAgICB9LFxuICAgIHVwZGF0ZUFwcGxpY2F0aW9uICgpOiBudW1iZXIge1xuICAgICAgcmV0dXJuIHRoaXMuaW52ZXJ0ZWRTY3JvbGxcbiAgICAgICAgPyAwXG4gICAgICAgIDogdGhpcy5jb21wdXRlZEhlaWdodCArIHRoaXMuY29tcHV0ZWRUcmFuc2Zvcm1cbiAgICB9LFxuICAgIHRocmVzaG9sZE1ldCAoKSB7XG4gICAgICBpZiAodGhpcy5pbnZlcnRlZFNjcm9sbCkge1xuICAgICAgICB0aGlzLmlzQWN0aXZlID0gdGhpcy5jdXJyZW50U2Nyb2xsID4gdGhpcy5jb21wdXRlZFNjcm9sbFRocmVzaG9sZFxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuaGlkZU9uU2Nyb2xsKSB7XG4gICAgICAgIHRoaXMuaXNBY3RpdmUgPSB0aGlzLmlzU2Nyb2xsaW5nVXAgfHxcbiAgICAgICAgICB0aGlzLmN1cnJlbnRTY3JvbGwgPCB0aGlzLmNvbXB1dGVkU2Nyb2xsVGhyZXNob2xkXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmN1cnJlbnRUaHJlc2hvbGQgPCB0aGlzLmNvbXB1dGVkU2Nyb2xsVGhyZXNob2xkKSByZXR1cm5cblxuICAgICAgdGhpcy5zYXZlZFNjcm9sbCA9IHRoaXMuY3VycmVudFNjcm9sbFxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyIChoKTogVk5vZGUge1xuICAgIGNvbnN0IHJlbmRlciA9IFZUb29sYmFyLm9wdGlvbnMucmVuZGVyLmNhbGwodGhpcywgaClcblxuICAgIHJlbmRlci5kYXRhID0gcmVuZGVyLmRhdGEgfHwge31cblxuICAgIGlmICh0aGlzLmNhblNjcm9sbCkge1xuICAgICAgcmVuZGVyLmRhdGEuZGlyZWN0aXZlcyA9IHJlbmRlci5kYXRhLmRpcmVjdGl2ZXMgfHwgW11cbiAgICAgIHJlbmRlci5kYXRhLmRpcmVjdGl2ZXMucHVzaCh7XG4gICAgICAgIGFyZzogdGhpcy5zY3JvbGxUYXJnZXQsXG4gICAgICAgIG5hbWU6ICdzY3JvbGwnLFxuICAgICAgICB2YWx1ZTogdGhpcy5vblNjcm9sbCxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIHJlbmRlclxuICB9LFxufSlcbiJdfQ==