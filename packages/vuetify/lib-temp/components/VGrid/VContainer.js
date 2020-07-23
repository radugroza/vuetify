import './_grid.sass';
import './VGrid.sass';
import Grid from './grid';
import mergeData from '../../util/mergeData';
/* @vue/component */
export default Grid('container').extend({
    name: 'v-container',
    functional: true,
    props: {
        id: String,
        tag: {
            type: String,
            default: 'div',
        },
        fluid: {
            type: Boolean,
            default: false,
        },
    },
    render(h, { props, data, children }) {
        let classes;
        const { attrs } = data;
        if (attrs) {
            // reset attrs to extract utility clases like pa-3
            data.attrs = {};
            classes = Object.keys(attrs).filter(key => {
                // TODO: Remove once resolved
                // https://github.com/vuejs/vue/issues/7841
                if (key === 'slot')
                    return false;
                const value = attrs[key];
                // add back data attributes like data-test="foo" but do not
                // add them as classes
                if (key.startsWith('data-')) {
                    data.attrs[key] = value;
                    return false;
                }
                return value || typeof value === 'string';
            });
        }
        if (props.id) {
            data.domProps = data.domProps || {};
            data.domProps.id = props.id;
        }
        return h(props.tag, mergeData(data, {
            staticClass: 'container',
            class: Array({
                'container--fluid': props.fluid,
            }).concat(classes || []),
        }), children);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkNvbnRhaW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZHcmlkL1ZDb250YWluZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxjQUFjLENBQUE7QUFDckIsT0FBTyxjQUFjLENBQUE7QUFFckIsT0FBTyxJQUFJLE1BQU0sUUFBUSxDQUFBO0FBRXpCLE9BQU8sU0FBUyxNQUFNLHNCQUFzQixDQUFBO0FBRTVDLG9CQUFvQjtBQUNwQixlQUFlLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDdEMsSUFBSSxFQUFFLGFBQWE7SUFDbkIsVUFBVSxFQUFFLElBQUk7SUFDaEIsS0FBSyxFQUFFO1FBQ0wsRUFBRSxFQUFFLE1BQU07UUFDVixHQUFHLEVBQUU7WUFDSCxJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxLQUFLO1NBQ2Y7UUFDRCxLQUFLLEVBQUU7WUFDTCxJQUFJLEVBQUUsT0FBTztZQUNiLE9BQU8sRUFBRSxLQUFLO1NBQ2Y7S0FDRjtJQUNELE1BQU0sQ0FBRSxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtRQUNsQyxJQUFJLE9BQU8sQ0FBQTtRQUNYLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUE7UUFDdEIsSUFBSSxLQUFLLEVBQUU7WUFDVCxrREFBa0Q7WUFDbEQsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUE7WUFDZixPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ3hDLDZCQUE2QjtnQkFDN0IsMkNBQTJDO2dCQUMzQyxJQUFJLEdBQUcsS0FBSyxNQUFNO29CQUFFLE9BQU8sS0FBSyxDQUFBO2dCQUVoQyxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7Z0JBRXhCLDJEQUEyRDtnQkFDM0Qsc0JBQXNCO2dCQUN0QixJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQzNCLElBQUksQ0FBQyxLQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFBO29CQUN4QixPQUFPLEtBQUssQ0FBQTtpQkFDYjtnQkFFRCxPQUFPLEtBQUssSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUE7WUFDM0MsQ0FBQyxDQUFDLENBQUE7U0FDSDtRQUVELElBQUksS0FBSyxDQUFDLEVBQUUsRUFBRTtZQUNaLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUE7WUFDbkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQTtTQUM1QjtRQUVELE9BQU8sQ0FBQyxDQUNOLEtBQUssQ0FBQyxHQUFHLEVBQ1QsU0FBUyxDQUFDLElBQUksRUFBRTtZQUNkLFdBQVcsRUFBRSxXQUFXO1lBQ3hCLEtBQUssRUFBRSxLQUFLLENBQU07Z0JBQ2hCLGtCQUFrQixFQUFFLEtBQUssQ0FBQyxLQUFLO2FBQ2hDLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztTQUN6QixDQUFDLEVBQ0YsUUFBUSxDQUNULENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuL19ncmlkLnNhc3MnXG5pbXBvcnQgJy4vVkdyaWQuc2FzcydcblxuaW1wb3J0IEdyaWQgZnJvbSAnLi9ncmlkJ1xuXG5pbXBvcnQgbWVyZ2VEYXRhIGZyb20gJy4uLy4uL3V0aWwvbWVyZ2VEYXRhJ1xuXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuZXhwb3J0IGRlZmF1bHQgR3JpZCgnY29udGFpbmVyJykuZXh0ZW5kKHtcbiAgbmFtZTogJ3YtY29udGFpbmVyJyxcbiAgZnVuY3Rpb25hbDogdHJ1ZSxcbiAgcHJvcHM6IHtcbiAgICBpZDogU3RyaW5nLFxuICAgIHRhZzoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJ2RpdicsXG4gICAgfSxcbiAgICBmbHVpZDoge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIH0sXG4gIH0sXG4gIHJlbmRlciAoaCwgeyBwcm9wcywgZGF0YSwgY2hpbGRyZW4gfSkge1xuICAgIGxldCBjbGFzc2VzXG4gICAgY29uc3QgeyBhdHRycyB9ID0gZGF0YVxuICAgIGlmIChhdHRycykge1xuICAgICAgLy8gcmVzZXQgYXR0cnMgdG8gZXh0cmFjdCB1dGlsaXR5IGNsYXNlcyBsaWtlIHBhLTNcbiAgICAgIGRhdGEuYXR0cnMgPSB7fVxuICAgICAgY2xhc3NlcyA9IE9iamVjdC5rZXlzKGF0dHJzKS5maWx0ZXIoa2V5ID0+IHtcbiAgICAgICAgLy8gVE9ETzogUmVtb3ZlIG9uY2UgcmVzb2x2ZWRcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3Z1ZWpzL3Z1ZS9pc3N1ZXMvNzg0MVxuICAgICAgICBpZiAoa2V5ID09PSAnc2xvdCcpIHJldHVybiBmYWxzZVxuXG4gICAgICAgIGNvbnN0IHZhbHVlID0gYXR0cnNba2V5XVxuXG4gICAgICAgIC8vIGFkZCBiYWNrIGRhdGEgYXR0cmlidXRlcyBsaWtlIGRhdGEtdGVzdD1cImZvb1wiIGJ1dCBkbyBub3RcbiAgICAgICAgLy8gYWRkIHRoZW0gYXMgY2xhc3Nlc1xuICAgICAgICBpZiAoa2V5LnN0YXJ0c1dpdGgoJ2RhdGEtJykpIHtcbiAgICAgICAgICBkYXRhLmF0dHJzIVtrZXldID0gdmFsdWVcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWx1ZSB8fCB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnXG4gICAgICB9KVxuICAgIH1cblxuICAgIGlmIChwcm9wcy5pZCkge1xuICAgICAgZGF0YS5kb21Qcm9wcyA9IGRhdGEuZG9tUHJvcHMgfHwge31cbiAgICAgIGRhdGEuZG9tUHJvcHMuaWQgPSBwcm9wcy5pZFxuICAgIH1cblxuICAgIHJldHVybiBoKFxuICAgICAgcHJvcHMudGFnLFxuICAgICAgbWVyZ2VEYXRhKGRhdGEsIHtcbiAgICAgICAgc3RhdGljQ2xhc3M6ICdjb250YWluZXInLFxuICAgICAgICBjbGFzczogQXJyYXk8YW55Pih7XG4gICAgICAgICAgJ2NvbnRhaW5lci0tZmx1aWQnOiBwcm9wcy5mbHVpZCxcbiAgICAgICAgfSkuY29uY2F0KGNsYXNzZXMgfHwgW10pLFxuICAgICAgfSksXG4gICAgICBjaGlsZHJlblxuICAgIClcbiAgfSxcbn0pXG4iXX0=