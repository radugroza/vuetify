import Vue from 'vue';
/* @vue/component */
export default Vue.extend({
    name: 'roundable',
    props: {
        rounded: [Boolean, String],
        tile: Boolean,
    },
    computed: {
        roundedClasses() {
            const composite = [];
            const rounded = typeof this.rounded === 'string'
                ? String(this.rounded)
                : this.rounded === true;
            if (this.tile) {
                composite.push('rounded-0');
            }
            else if (typeof rounded === 'string') {
                const values = rounded.split(' ');
                for (const value of values) {
                    composite.push(`rounded-${value}`);
                }
            }
            else if (rounded) {
                composite.push('rounded');
            }
            return composite.length > 0 ? {
                [composite.join(' ')]: true,
            } : {};
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL3JvdW5kYWJsZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEdBQUcsTUFBTSxLQUFLLENBQUE7QUFFckIsb0JBQW9CO0FBQ3BCLGVBQWUsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUN4QixJQUFJLEVBQUUsV0FBVztJQUVqQixLQUFLLEVBQUU7UUFDTCxPQUFPLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDO1FBQzFCLElBQUksRUFBRSxPQUFPO0tBQ2Q7SUFFRCxRQUFRLEVBQUU7UUFDUixjQUFjO1lBQ1osTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFBO1lBQ3BCLE1BQU0sT0FBTyxHQUFHLE9BQU8sSUFBSSxDQUFDLE9BQU8sS0FBSyxRQUFRO2dCQUM5QyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQ3RCLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQTtZQUV6QixJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQ2IsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTthQUM1QjtpQkFBTSxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRTtnQkFDdEMsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFFakMsS0FBSyxNQUFNLEtBQUssSUFBSSxNQUFNLEVBQUU7b0JBQzFCLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxLQUFLLEVBQUUsQ0FBQyxDQUFBO2lCQUNuQzthQUNGO2lCQUFNLElBQUksT0FBTyxFQUFFO2dCQUNsQixTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO2FBQzFCO1lBRUQsT0FBTyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUk7YUFDNUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFBO1FBQ1IsQ0FBQztLQUNGO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZ1ZSBmcm9tICd2dWUnXG5cbi8qIEB2dWUvY29tcG9uZW50ICovXG5leHBvcnQgZGVmYXVsdCBWdWUuZXh0ZW5kKHtcbiAgbmFtZTogJ3JvdW5kYWJsZScsXG5cbiAgcHJvcHM6IHtcbiAgICByb3VuZGVkOiBbQm9vbGVhbiwgU3RyaW5nXSxcbiAgICB0aWxlOiBCb29sZWFuLFxuICB9LFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgcm91bmRlZENsYXNzZXMgKCk6IFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+IHtcbiAgICAgIGNvbnN0IGNvbXBvc2l0ZSA9IFtdXG4gICAgICBjb25zdCByb3VuZGVkID0gdHlwZW9mIHRoaXMucm91bmRlZCA9PT0gJ3N0cmluZydcbiAgICAgICAgPyBTdHJpbmcodGhpcy5yb3VuZGVkKVxuICAgICAgICA6IHRoaXMucm91bmRlZCA9PT0gdHJ1ZVxuXG4gICAgICBpZiAodGhpcy50aWxlKSB7XG4gICAgICAgIGNvbXBvc2l0ZS5wdXNoKCdyb3VuZGVkLTAnKVxuICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygcm91bmRlZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29uc3QgdmFsdWVzID0gcm91bmRlZC5zcGxpdCgnICcpXG5cbiAgICAgICAgZm9yIChjb25zdCB2YWx1ZSBvZiB2YWx1ZXMpIHtcbiAgICAgICAgICBjb21wb3NpdGUucHVzaChgcm91bmRlZC0ke3ZhbHVlfWApXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAocm91bmRlZCkge1xuICAgICAgICBjb21wb3NpdGUucHVzaCgncm91bmRlZCcpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjb21wb3NpdGUubGVuZ3RoID4gMCA/IHtcbiAgICAgICAgW2NvbXBvc2l0ZS5qb2luKCcgJyldOiB0cnVlLFxuICAgICAgfSA6IHt9XG4gICAgfSxcbiAgfSxcbn0pXG4iXX0=