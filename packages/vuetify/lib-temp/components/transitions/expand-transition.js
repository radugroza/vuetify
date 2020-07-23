import { upperFirst } from '../../util/helpers';
export default function (expandedParentClass = '', x = false) {
    const sizeProperty = x ? 'width' : 'height';
    const offsetProperty = `offset${upperFirst(sizeProperty)}`;
    return {
        beforeEnter(el) {
            el._parent = el.parentNode;
            el._initialStyle = {
                transition: el.style.transition,
                visibility: el.style.visibility,
                overflow: el.style.overflow,
                [sizeProperty]: el.style[sizeProperty],
            };
        },
        enter(el) {
            const initialStyle = el._initialStyle;
            const offset = `${el[offsetProperty]}px`;
            el.style.setProperty('transition', 'none', 'important');
            el.style.visibility = 'hidden';
            el.style.visibility = initialStyle.visibility;
            el.style.overflow = 'hidden';
            el.style[sizeProperty] = '0';
            void el.offsetHeight; // force reflow
            el.style.transition = initialStyle.transition;
            if (expandedParentClass && el._parent) {
                el._parent.classList.add(expandedParentClass);
            }
            requestAnimationFrame(() => {
                el.style[sizeProperty] = offset;
            });
        },
        afterEnter: resetStyles,
        enterCancelled: resetStyles,
        leave(el) {
            el._initialStyle = {
                transition: '',
                visibility: '',
                overflow: el.style.overflow,
                [sizeProperty]: el.style[sizeProperty],
            };
            el.style.overflow = 'hidden';
            el.style[sizeProperty] = `${el[offsetProperty]}px`;
            void el.offsetHeight; // force reflow
            requestAnimationFrame(() => (el.style[sizeProperty] = '0'));
        },
        afterLeave,
        leaveCancelled: afterLeave,
    };
    function afterLeave(el) {
        if (expandedParentClass && el._parent) {
            el._parent.classList.remove(expandedParentClass);
        }
        resetStyles(el);
    }
    function resetStyles(el) {
        const size = el._initialStyle[sizeProperty];
        el.style.overflow = el._initialStyle.overflow;
        if (size != null)
            el.style[sizeProperty] = size;
        delete el._initialStyle;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5kLXRyYW5zaXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy90cmFuc2l0aW9ucy9leHBhbmQtdHJhbnNpdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFhL0MsTUFBTSxDQUFDLE9BQU8sV0FBVyxtQkFBbUIsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEtBQUs7SUFDMUQsTUFBTSxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFFBQThCLENBQUE7SUFDakUsTUFBTSxjQUFjLEdBQUcsU0FBUyxVQUFVLENBQUMsWUFBWSxDQUFDLEVBQW9DLENBQUE7SUFFNUYsT0FBTztRQUNMLFdBQVcsQ0FBRSxFQUFxQjtZQUNoQyxFQUFFLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxVQUFzRCxDQUFBO1lBQ3RFLEVBQUUsQ0FBQyxhQUFhLEdBQUc7Z0JBQ2pCLFVBQVUsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLFVBQVU7Z0JBQy9CLFVBQVUsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLFVBQVU7Z0JBQy9CLFFBQVEsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVE7Z0JBQzNCLENBQUMsWUFBWSxDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUM7YUFDdkMsQ0FBQTtRQUNILENBQUM7UUFFRCxLQUFLLENBQUUsRUFBcUI7WUFDMUIsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQTtZQUNyQyxNQUFNLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFBO1lBRXhDLEVBQUUsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUE7WUFDdkQsRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFBO1lBQzlCLEVBQUUsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLFlBQVksQ0FBQyxVQUFVLENBQUE7WUFDN0MsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO1lBQzVCLEVBQUUsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEdBQUcsR0FBRyxDQUFBO1lBRTVCLEtBQUssRUFBRSxDQUFDLFlBQVksQ0FBQSxDQUFDLGVBQWU7WUFFcEMsRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsWUFBWSxDQUFDLFVBQVUsQ0FBQTtZQUU3QyxJQUFJLG1CQUFtQixJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUU7Z0JBQ3JDLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO2FBQzlDO1lBRUQscUJBQXFCLENBQUMsR0FBRyxFQUFFO2dCQUN6QixFQUFFLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxHQUFHLE1BQU0sQ0FBQTtZQUNqQyxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUM7UUFFRCxVQUFVLEVBQUUsV0FBVztRQUN2QixjQUFjLEVBQUUsV0FBVztRQUUzQixLQUFLLENBQUUsRUFBcUI7WUFDMUIsRUFBRSxDQUFDLGFBQWEsR0FBRztnQkFDakIsVUFBVSxFQUFFLEVBQUU7Z0JBQ2QsVUFBVSxFQUFFLEVBQUU7Z0JBQ2QsUUFBUSxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUTtnQkFDM0IsQ0FBQyxZQUFZLENBQUMsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQzthQUN2QyxDQUFBO1lBRUQsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO1lBQzVCLEVBQUUsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQTtZQUNsRCxLQUFLLEVBQUUsQ0FBQyxZQUFZLENBQUEsQ0FBQyxlQUFlO1lBRXBDLHFCQUFxQixDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQzdELENBQUM7UUFFRCxVQUFVO1FBQ1YsY0FBYyxFQUFFLFVBQVU7S0FDM0IsQ0FBQTtJQUVELFNBQVMsVUFBVSxDQUFFLEVBQXFCO1FBQ3hDLElBQUksbUJBQW1CLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRTtZQUNyQyxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtTQUNqRDtRQUNELFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUNqQixDQUFDO0lBRUQsU0FBUyxXQUFXLENBQUUsRUFBcUI7UUFDekMsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQTtRQUMzQyxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQTtRQUM3QyxJQUFJLElBQUksSUFBSSxJQUFJO1lBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsR0FBRyxJQUFJLENBQUE7UUFDL0MsT0FBTyxFQUFFLENBQUMsYUFBYSxDQUFBO0lBQ3pCLENBQUM7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXBwZXJGaXJzdCB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcblxuaW50ZXJmYWNlIEhUTUxFeHBhbmRFbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICBfcGFyZW50PzogKE5vZGUgJiBQYXJlbnROb2RlICYgSFRNTEVsZW1lbnQpIHwgbnVsbFxuICBfaW5pdGlhbFN0eWxlOiB7XG4gICAgdHJhbnNpdGlvbjogc3RyaW5nXG4gICAgdmlzaWJpbGl0eTogc3RyaW5nIHwgbnVsbFxuICAgIG92ZXJmbG93OiBzdHJpbmcgfCBudWxsXG4gICAgaGVpZ2h0Pzogc3RyaW5nIHwgbnVsbFxuICAgIHdpZHRoPzogc3RyaW5nIHwgbnVsbFxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChleHBhbmRlZFBhcmVudENsYXNzID0gJycsIHggPSBmYWxzZSkge1xuICBjb25zdCBzaXplUHJvcGVydHkgPSB4ID8gJ3dpZHRoJyA6ICdoZWlnaHQnIGFzICd3aWR0aCcgfCAnaGVpZ2h0J1xuICBjb25zdCBvZmZzZXRQcm9wZXJ0eSA9IGBvZmZzZXQke3VwcGVyRmlyc3Qoc2l6ZVByb3BlcnR5KX1gIGFzICdvZmZzZXRIZWlnaHQnIHwgJ29mZnNldFdpZHRoJ1xuXG4gIHJldHVybiB7XG4gICAgYmVmb3JlRW50ZXIgKGVsOiBIVE1MRXhwYW5kRWxlbWVudCkge1xuICAgICAgZWwuX3BhcmVudCA9IGVsLnBhcmVudE5vZGUgYXMgKE5vZGUgJiBQYXJlbnROb2RlICYgSFRNTEVsZW1lbnQpIHwgbnVsbFxuICAgICAgZWwuX2luaXRpYWxTdHlsZSA9IHtcbiAgICAgICAgdHJhbnNpdGlvbjogZWwuc3R5bGUudHJhbnNpdGlvbixcbiAgICAgICAgdmlzaWJpbGl0eTogZWwuc3R5bGUudmlzaWJpbGl0eSxcbiAgICAgICAgb3ZlcmZsb3c6IGVsLnN0eWxlLm92ZXJmbG93LFxuICAgICAgICBbc2l6ZVByb3BlcnR5XTogZWwuc3R5bGVbc2l6ZVByb3BlcnR5XSxcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZW50ZXIgKGVsOiBIVE1MRXhwYW5kRWxlbWVudCkge1xuICAgICAgY29uc3QgaW5pdGlhbFN0eWxlID0gZWwuX2luaXRpYWxTdHlsZVxuICAgICAgY29uc3Qgb2Zmc2V0ID0gYCR7ZWxbb2Zmc2V0UHJvcGVydHldfXB4YFxuXG4gICAgICBlbC5zdHlsZS5zZXRQcm9wZXJ0eSgndHJhbnNpdGlvbicsICdub25lJywgJ2ltcG9ydGFudCcpXG4gICAgICBlbC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbidcbiAgICAgIGVsLnN0eWxlLnZpc2liaWxpdHkgPSBpbml0aWFsU3R5bGUudmlzaWJpbGl0eVxuICAgICAgZWwuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJ1xuICAgICAgZWwuc3R5bGVbc2l6ZVByb3BlcnR5XSA9ICcwJ1xuXG4gICAgICB2b2lkIGVsLm9mZnNldEhlaWdodCAvLyBmb3JjZSByZWZsb3dcblxuICAgICAgZWwuc3R5bGUudHJhbnNpdGlvbiA9IGluaXRpYWxTdHlsZS50cmFuc2l0aW9uXG5cbiAgICAgIGlmIChleHBhbmRlZFBhcmVudENsYXNzICYmIGVsLl9wYXJlbnQpIHtcbiAgICAgICAgZWwuX3BhcmVudC5jbGFzc0xpc3QuYWRkKGV4cGFuZGVkUGFyZW50Q2xhc3MpXG4gICAgICB9XG5cbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIGVsLnN0eWxlW3NpemVQcm9wZXJ0eV0gPSBvZmZzZXRcbiAgICAgIH0pXG4gICAgfSxcblxuICAgIGFmdGVyRW50ZXI6IHJlc2V0U3R5bGVzLFxuICAgIGVudGVyQ2FuY2VsbGVkOiByZXNldFN0eWxlcyxcblxuICAgIGxlYXZlIChlbDogSFRNTEV4cGFuZEVsZW1lbnQpIHtcbiAgICAgIGVsLl9pbml0aWFsU3R5bGUgPSB7XG4gICAgICAgIHRyYW5zaXRpb246ICcnLFxuICAgICAgICB2aXNpYmlsaXR5OiAnJyxcbiAgICAgICAgb3ZlcmZsb3c6IGVsLnN0eWxlLm92ZXJmbG93LFxuICAgICAgICBbc2l6ZVByb3BlcnR5XTogZWwuc3R5bGVbc2l6ZVByb3BlcnR5XSxcbiAgICAgIH1cblxuICAgICAgZWwuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJ1xuICAgICAgZWwuc3R5bGVbc2l6ZVByb3BlcnR5XSA9IGAke2VsW29mZnNldFByb3BlcnR5XX1weGBcbiAgICAgIHZvaWQgZWwub2Zmc2V0SGVpZ2h0IC8vIGZvcmNlIHJlZmxvd1xuXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gKGVsLnN0eWxlW3NpemVQcm9wZXJ0eV0gPSAnMCcpKVxuICAgIH0sXG5cbiAgICBhZnRlckxlYXZlLFxuICAgIGxlYXZlQ2FuY2VsbGVkOiBhZnRlckxlYXZlLFxuICB9XG5cbiAgZnVuY3Rpb24gYWZ0ZXJMZWF2ZSAoZWw6IEhUTUxFeHBhbmRFbGVtZW50KSB7XG4gICAgaWYgKGV4cGFuZGVkUGFyZW50Q2xhc3MgJiYgZWwuX3BhcmVudCkge1xuICAgICAgZWwuX3BhcmVudC5jbGFzc0xpc3QucmVtb3ZlKGV4cGFuZGVkUGFyZW50Q2xhc3MpXG4gICAgfVxuICAgIHJlc2V0U3R5bGVzKGVsKVxuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXRTdHlsZXMgKGVsOiBIVE1MRXhwYW5kRWxlbWVudCkge1xuICAgIGNvbnN0IHNpemUgPSBlbC5faW5pdGlhbFN0eWxlW3NpemVQcm9wZXJ0eV1cbiAgICBlbC5zdHlsZS5vdmVyZmxvdyA9IGVsLl9pbml0aWFsU3R5bGUub3ZlcmZsb3dcbiAgICBpZiAoc2l6ZSAhPSBudWxsKSBlbC5zdHlsZVtzaXplUHJvcGVydHldID0gc2l6ZVxuICAgIGRlbGV0ZSBlbC5faW5pdGlhbFN0eWxlXG4gIH1cbn1cbiJdfQ==