import Vue from 'vue';
export default Vue.extend({
    name: 'sizeable',
    props: {
        large: Boolean,
        small: Boolean,
        xLarge: Boolean,
        xSmall: Boolean,
    },
    computed: {
        medium() {
            return Boolean(!this.xSmall &&
                !this.small &&
                !this.large &&
                !this.xLarge);
        },
        sizeableClasses() {
            return {
                'v-size--x-small': this.xSmall,
                'v-size--small': this.small,
                'v-size--default': this.medium,
                'v-size--large': this.large,
                'v-size--x-large': this.xLarge,
            };
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL3NpemVhYmxlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sR0FBRyxNQUFNLEtBQUssQ0FBQTtBQUVyQixlQUFlLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFDeEIsSUFBSSxFQUFFLFVBQVU7SUFFaEIsS0FBSyxFQUFFO1FBQ0wsS0FBSyxFQUFFLE9BQU87UUFDZCxLQUFLLEVBQUUsT0FBTztRQUNkLE1BQU0sRUFBRSxPQUFPO1FBQ2YsTUFBTSxFQUFFLE9BQU87S0FDaEI7SUFFRCxRQUFRLEVBQUU7UUFDUixNQUFNO1lBQ0osT0FBTyxPQUFPLENBQ1osQ0FBQyxJQUFJLENBQUMsTUFBTTtnQkFDWixDQUFDLElBQUksQ0FBQyxLQUFLO2dCQUNYLENBQUMsSUFBSSxDQUFDLEtBQUs7Z0JBQ1gsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUNiLENBQUE7UUFDSCxDQUFDO1FBQ0QsZUFBZTtZQUNiLE9BQU87Z0JBQ0wsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLE1BQU07Z0JBQzlCLGVBQWUsRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDM0IsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLE1BQU07Z0JBQzlCLGVBQWUsRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDM0IsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLE1BQU07YUFDL0IsQ0FBQTtRQUNILENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWdWUgZnJvbSAndnVlJ1xuXG5leHBvcnQgZGVmYXVsdCBWdWUuZXh0ZW5kKHtcbiAgbmFtZTogJ3NpemVhYmxlJyxcblxuICBwcm9wczoge1xuICAgIGxhcmdlOiBCb29sZWFuLFxuICAgIHNtYWxsOiBCb29sZWFuLFxuICAgIHhMYXJnZTogQm9vbGVhbixcbiAgICB4U21hbGw6IEJvb2xlYW4sXG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBtZWRpdW0gKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIEJvb2xlYW4oXG4gICAgICAgICF0aGlzLnhTbWFsbCAmJlxuICAgICAgICAhdGhpcy5zbWFsbCAmJlxuICAgICAgICAhdGhpcy5sYXJnZSAmJlxuICAgICAgICAhdGhpcy54TGFyZ2VcbiAgICAgIClcbiAgICB9LFxuICAgIHNpemVhYmxlQ2xhc3NlcyAoKTogb2JqZWN0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICd2LXNpemUtLXgtc21hbGwnOiB0aGlzLnhTbWFsbCxcbiAgICAgICAgJ3Ytc2l6ZS0tc21hbGwnOiB0aGlzLnNtYWxsLFxuICAgICAgICAndi1zaXplLS1kZWZhdWx0JzogdGhpcy5tZWRpdW0sXG4gICAgICAgICd2LXNpemUtLWxhcmdlJzogdGhpcy5sYXJnZSxcbiAgICAgICAgJ3Ytc2l6ZS0teC1sYXJnZSc6IHRoaXMueExhcmdlLFxuICAgICAgfVxuICAgIH0sXG4gIH0sXG59KVxuIl19