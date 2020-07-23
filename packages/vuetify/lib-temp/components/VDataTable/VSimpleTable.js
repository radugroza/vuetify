import './VSimpleTable.sass';
import { convertToUnit } from '../../util/helpers';
import Themeable from '../../mixins/themeable';
import mixins from '../../util/mixins';
export default mixins(Themeable).extend({
    name: 'v-simple-table',
    props: {
        dense: Boolean,
        fixedHeader: Boolean,
        height: [Number, String],
    },
    computed: {
        classes() {
            return {
                'v-data-table--dense': this.dense,
                'v-data-table--fixed-height': !!this.height && !this.fixedHeader,
                'v-data-table--fixed-header': this.fixedHeader,
                ...this.themeClasses,
            };
        },
    },
    methods: {
        genWrapper() {
            return this.$slots.wrapper || this.$createElement('div', {
                staticClass: 'v-data-table__wrapper',
                style: {
                    height: convertToUnit(this.height),
                },
            }, [
                this.$createElement('table', this.$slots.default),
            ]);
        },
    },
    render(h) {
        return h('div', {
            staticClass: 'v-data-table',
            class: this.classes,
        }, [
            this.$slots.top,
            this.genWrapper(),
            this.$slots.bottom,
        ]);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlNpbXBsZVRhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkRhdGFUYWJsZS9WU2ltcGxlVGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxxQkFBcUIsQ0FBQTtBQUU1QixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFDbEQsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFHdEMsZUFBZSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDO0lBQ3RDLElBQUksRUFBRSxnQkFBZ0I7SUFFdEIsS0FBSyxFQUFFO1FBQ0wsS0FBSyxFQUFFLE9BQU87UUFDZCxXQUFXLEVBQUUsT0FBTztRQUNwQixNQUFNLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO0tBQ3pCO0lBRUQsUUFBUSxFQUFFO1FBQ1IsT0FBTztZQUNMLE9BQU87Z0JBQ0wscUJBQXFCLEVBQUUsSUFBSSxDQUFDLEtBQUs7Z0JBQ2pDLDRCQUE0QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVc7Z0JBQ2hFLDRCQUE0QixFQUFFLElBQUksQ0FBQyxXQUFXO2dCQUM5QyxHQUFHLElBQUksQ0FBQyxZQUFZO2FBQ3JCLENBQUE7UUFDSCxDQUFDO0tBQ0Y7SUFFRCxPQUFPLEVBQUU7UUFDUCxVQUFVO1lBQ1IsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRTtnQkFDdkQsV0FBVyxFQUFFLHVCQUF1QjtnQkFDcEMsS0FBSyxFQUFFO29CQUNMLE1BQU0sRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztpQkFDbkM7YUFDRixFQUFFO2dCQUNELElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO2FBQ2xELENBQUMsQ0FBQTtRQUNKLENBQUM7S0FDRjtJQUVELE1BQU0sQ0FBRSxDQUFDO1FBQ1AsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFO1lBQ2QsV0FBVyxFQUFFLGNBQWM7WUFDM0IsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPO1NBQ3BCLEVBQUU7WUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUc7WUFDZixJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTTtTQUNuQixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuL1ZTaW1wbGVUYWJsZS5zYXNzJ1xuXG5pbXBvcnQgeyBjb252ZXJ0VG9Vbml0IH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xuaW1wb3J0IFRoZW1lYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdGhlbWVhYmxlJ1xuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcbmltcG9ydCB7IFZOb2RlIH0gZnJvbSAndnVlJ1xuXG5leHBvcnQgZGVmYXVsdCBtaXhpbnMoVGhlbWVhYmxlKS5leHRlbmQoe1xuICBuYW1lOiAndi1zaW1wbGUtdGFibGUnLFxuXG4gIHByb3BzOiB7XG4gICAgZGVuc2U6IEJvb2xlYW4sXG4gICAgZml4ZWRIZWFkZXI6IEJvb2xlYW4sXG4gICAgaGVpZ2h0OiBbTnVtYmVyLCBTdHJpbmddLFxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgY2xhc3NlcyAoKTogUmVjb3JkPHN0cmluZywgYm9vbGVhbj4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgJ3YtZGF0YS10YWJsZS0tZGVuc2UnOiB0aGlzLmRlbnNlLFxuICAgICAgICAndi1kYXRhLXRhYmxlLS1maXhlZC1oZWlnaHQnOiAhIXRoaXMuaGVpZ2h0ICYmICF0aGlzLmZpeGVkSGVhZGVyLFxuICAgICAgICAndi1kYXRhLXRhYmxlLS1maXhlZC1oZWFkZXInOiB0aGlzLmZpeGVkSGVhZGVyLFxuICAgICAgICAuLi50aGlzLnRoZW1lQ2xhc3NlcyxcbiAgICAgIH1cbiAgICB9LFxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBnZW5XcmFwcGVyICgpIHtcbiAgICAgIHJldHVybiB0aGlzLiRzbG90cy53cmFwcGVyIHx8IHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWRhdGEtdGFibGVfX3dyYXBwZXInLFxuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIGhlaWdodDogY29udmVydFRvVW5pdCh0aGlzLmhlaWdodCksXG4gICAgICAgIH0sXG4gICAgICB9LCBbXG4gICAgICAgIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ3RhYmxlJywgdGhpcy4kc2xvdHMuZGVmYXVsdCksXG4gICAgICBdKVxuICAgIH0sXG4gIH0sXG5cbiAgcmVuZGVyIChoKTogVk5vZGUge1xuICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICBzdGF0aWNDbGFzczogJ3YtZGF0YS10YWJsZScsXG4gICAgICBjbGFzczogdGhpcy5jbGFzc2VzLFxuICAgIH0sIFtcbiAgICAgIHRoaXMuJHNsb3RzLnRvcCxcbiAgICAgIHRoaXMuZ2VuV3JhcHBlcigpLFxuICAgICAgdGhpcy4kc2xvdHMuYm90dG9tLFxuICAgIF0pXG4gIH0sXG59KVxuIl19