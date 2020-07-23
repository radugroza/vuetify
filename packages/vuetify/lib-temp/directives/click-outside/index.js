function defaultConditional() {
    return true;
}
function directive(e, el, binding) {
    const handler = typeof binding.value === 'function' ? binding.value : binding.value.handler;
    const isActive = (typeof binding.value === 'object' && binding.value.closeConditional) || defaultConditional;
    // The include element callbacks below can be expensive
    // so we should avoid calling them when we're not active.
    // Explicitly check for false to allow fallback compatibility
    // with non-toggleable components
    if (!e || isActive(e) === false)
        return;
    // If click was triggered programmaticaly (domEl.click()) then
    // it shouldn't be treated as click-outside
    // Chrome/Firefox support isTrusted property
    // IE/Edge support pointerType property (empty if not triggered
    // by pointing device)
    if (('isTrusted' in e && !e.isTrusted) ||
        ('pointerType' in e && !e.pointerType))
        return;
    // Check if additional elements were passed to be included in check
    // (click must be outside all included elements, if any)
    const elements = ((typeof binding.value === 'object' && binding.value.include) || (() => []))();
    // Add the root element for the component this directive was defined on
    elements.push(el);
    // Check if it's a click outside our elements, and then if our callback returns true.
    // Non-toggleable components should take action in their callback and return falsy.
    // Toggleable can return true if it wants to deactivate.
    // Note that, because we're in the capture phase, this callback will occur before
    // the bubbling click event on any outside elements.
    !elements.some(el => el.contains(e.target)) && setTimeout(() => {
        isActive(e) && handler && handler(e);
    }, 0);
}
export const ClickOutside = {
    // [data-app] may not be found
    // if using bind, inserted makes
    // sure that the root element is
    // available, iOS does not support
    // clicks on body
    inserted(el, binding) {
        const onClick = (e) => directive(e, el, binding);
        // iOS does not recognize click events on document
        // or body, this is the entire purpose of the v-app
        // component and [data-app], stop removing this
        const app = document.querySelector('[data-app]') ||
            document.body; // This is only for unit tests
        app.addEventListener('click', onClick, true);
        el._clickOutside = onClick;
    },
    unbind(el) {
        if (!el._clickOutside)
            return;
        const app = document.querySelector('[data-app]') ||
            document.body; // This is only for unit tests
        app && app.removeEventListener('click', el._clickOutside, true);
        delete el._clickOutside;
    },
};
export default ClickOutside;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZGlyZWN0aXZlcy9jbGljay1vdXRzaWRlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVlBLFNBQVMsa0JBQWtCO0lBQ3pCLE9BQU8sSUFBSSxDQUFBO0FBQ2IsQ0FBQztBQUVELFNBQVMsU0FBUyxDQUFFLENBQWUsRUFBRSxFQUFlLEVBQUUsT0FBOEI7SUFDbEYsTUFBTSxPQUFPLEdBQUcsT0FBTyxPQUFPLENBQUMsS0FBSyxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQU0sQ0FBQyxPQUFPLENBQUE7SUFFNUYsTUFBTSxRQUFRLEdBQUcsQ0FBQyxPQUFPLE9BQU8sQ0FBQyxLQUFLLEtBQUssUUFBUSxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxrQkFBa0IsQ0FBQTtJQUU1Ryx1REFBdUQ7SUFDdkQseURBQXlEO0lBQ3pELDZEQUE2RDtJQUM3RCxpQ0FBaUM7SUFDakMsSUFBSSxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSztRQUFFLE9BQU07SUFFdkMsOERBQThEO0lBQzlELDJDQUEyQztJQUMzQyw0Q0FBNEM7SUFDNUMsK0RBQStEO0lBQy9ELHNCQUFzQjtJQUN0QixJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDcEMsQ0FBQyxhQUFhLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQztRQUN0QyxPQUFNO0lBRVIsbUVBQW1FO0lBQ25FLHdEQUF3RDtJQUN4RCxNQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsT0FBTyxPQUFPLENBQUMsS0FBSyxLQUFLLFFBQVEsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFBO0lBQy9GLHVFQUF1RTtJQUN2RSxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBRWpCLHFGQUFxRjtJQUNyRixtRkFBbUY7SUFDbkYsd0RBQXdEO0lBQ3hELGlGQUFpRjtJQUNqRixvREFBb0Q7SUFDcEQsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBYyxDQUFDLENBQUMsSUFBSSxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ3JFLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ3RDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUNQLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxZQUFZLEdBQUc7SUFDMUIsOEJBQThCO0lBQzlCLGdDQUFnQztJQUNoQyxnQ0FBZ0M7SUFDaEMsa0NBQWtDO0lBQ2xDLGlCQUFpQjtJQUNqQixRQUFRLENBQUUsRUFBZSxFQUFFLE9BQThCO1FBQ3ZELE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBUSxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBaUIsRUFBRSxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFDdkUsa0RBQWtEO1FBQ2xELG1EQUFtRDtRQUNuRCwrQ0FBK0M7UUFDL0MsTUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUM7WUFDOUMsUUFBUSxDQUFDLElBQUksQ0FBQSxDQUFDLDhCQUE4QjtRQUM5QyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUM1QyxFQUFFLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQTtJQUM1QixDQUFDO0lBRUQsTUFBTSxDQUFFLEVBQWU7UUFDckIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhO1lBQUUsT0FBTTtRQUU3QixNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQztZQUM5QyxRQUFRLENBQUMsSUFBSSxDQUFBLENBQUMsOEJBQThCO1FBQzlDLEdBQUcsSUFBSSxHQUFHLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFDL0QsT0FBTyxFQUFFLENBQUMsYUFBYSxDQUFBO0lBQ3pCLENBQUM7Q0FDRixDQUFBO0FBRUQsZUFBZSxZQUFZLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBWTm9kZURpcmVjdGl2ZSB9IGZyb20gJ3Z1ZS90eXBlcy92bm9kZSdcblxuaW50ZXJmYWNlIENsaWNrT3V0c2lkZUJpbmRpbmdBcmdzIHtcbiAgaGFuZGxlcjogKGU6IEV2ZW50KSA9PiB2b2lkXG4gIGNsb3NlQ29uZGl0aW9uYWw/OiAoZTogRXZlbnQpID0+IGJvb2xlYW5cbiAgaW5jbHVkZT86ICgpID0+IEhUTUxFbGVtZW50W11cbn1cblxuaW50ZXJmYWNlIENsaWNrT3V0c2lkZURpcmVjdGl2ZSBleHRlbmRzIFZOb2RlRGlyZWN0aXZlIHtcbiAgdmFsdWU/OiAoKGU6IEV2ZW50KSA9PiB2b2lkKSB8IENsaWNrT3V0c2lkZUJpbmRpbmdBcmdzXG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRDb25kaXRpb25hbCAoKSB7XG4gIHJldHVybiB0cnVlXG59XG5cbmZ1bmN0aW9uIGRpcmVjdGl2ZSAoZTogUG9pbnRlckV2ZW50LCBlbDogSFRNTEVsZW1lbnQsIGJpbmRpbmc6IENsaWNrT3V0c2lkZURpcmVjdGl2ZSk6IHZvaWQge1xuICBjb25zdCBoYW5kbGVyID0gdHlwZW9mIGJpbmRpbmcudmFsdWUgPT09ICdmdW5jdGlvbicgPyBiaW5kaW5nLnZhbHVlIDogYmluZGluZy52YWx1ZSEuaGFuZGxlclxuXG4gIGNvbnN0IGlzQWN0aXZlID0gKHR5cGVvZiBiaW5kaW5nLnZhbHVlID09PSAnb2JqZWN0JyAmJiBiaW5kaW5nLnZhbHVlLmNsb3NlQ29uZGl0aW9uYWwpIHx8IGRlZmF1bHRDb25kaXRpb25hbFxuXG4gIC8vIFRoZSBpbmNsdWRlIGVsZW1lbnQgY2FsbGJhY2tzIGJlbG93IGNhbiBiZSBleHBlbnNpdmVcbiAgLy8gc28gd2Ugc2hvdWxkIGF2b2lkIGNhbGxpbmcgdGhlbSB3aGVuIHdlJ3JlIG5vdCBhY3RpdmUuXG4gIC8vIEV4cGxpY2l0bHkgY2hlY2sgZm9yIGZhbHNlIHRvIGFsbG93IGZhbGxiYWNrIGNvbXBhdGliaWxpdHlcbiAgLy8gd2l0aCBub24tdG9nZ2xlYWJsZSBjb21wb25lbnRzXG4gIGlmICghZSB8fCBpc0FjdGl2ZShlKSA9PT0gZmFsc2UpIHJldHVyblxuXG4gIC8vIElmIGNsaWNrIHdhcyB0cmlnZ2VyZWQgcHJvZ3JhbW1hdGljYWx5IChkb21FbC5jbGljaygpKSB0aGVuXG4gIC8vIGl0IHNob3VsZG4ndCBiZSB0cmVhdGVkIGFzIGNsaWNrLW91dHNpZGVcbiAgLy8gQ2hyb21lL0ZpcmVmb3ggc3VwcG9ydCBpc1RydXN0ZWQgcHJvcGVydHlcbiAgLy8gSUUvRWRnZSBzdXBwb3J0IHBvaW50ZXJUeXBlIHByb3BlcnR5IChlbXB0eSBpZiBub3QgdHJpZ2dlcmVkXG4gIC8vIGJ5IHBvaW50aW5nIGRldmljZSlcbiAgaWYgKCgnaXNUcnVzdGVkJyBpbiBlICYmICFlLmlzVHJ1c3RlZCkgfHxcbiAgICAoJ3BvaW50ZXJUeXBlJyBpbiBlICYmICFlLnBvaW50ZXJUeXBlKVxuICApIHJldHVyblxuXG4gIC8vIENoZWNrIGlmIGFkZGl0aW9uYWwgZWxlbWVudHMgd2VyZSBwYXNzZWQgdG8gYmUgaW5jbHVkZWQgaW4gY2hlY2tcbiAgLy8gKGNsaWNrIG11c3QgYmUgb3V0c2lkZSBhbGwgaW5jbHVkZWQgZWxlbWVudHMsIGlmIGFueSlcbiAgY29uc3QgZWxlbWVudHMgPSAoKHR5cGVvZiBiaW5kaW5nLnZhbHVlID09PSAnb2JqZWN0JyAmJiBiaW5kaW5nLnZhbHVlLmluY2x1ZGUpIHx8ICgoKSA9PiBbXSkpKClcbiAgLy8gQWRkIHRoZSByb290IGVsZW1lbnQgZm9yIHRoZSBjb21wb25lbnQgdGhpcyBkaXJlY3RpdmUgd2FzIGRlZmluZWQgb25cbiAgZWxlbWVudHMucHVzaChlbClcblxuICAvLyBDaGVjayBpZiBpdCdzIGEgY2xpY2sgb3V0c2lkZSBvdXIgZWxlbWVudHMsIGFuZCB0aGVuIGlmIG91ciBjYWxsYmFjayByZXR1cm5zIHRydWUuXG4gIC8vIE5vbi10b2dnbGVhYmxlIGNvbXBvbmVudHMgc2hvdWxkIHRha2UgYWN0aW9uIGluIHRoZWlyIGNhbGxiYWNrIGFuZCByZXR1cm4gZmFsc3kuXG4gIC8vIFRvZ2dsZWFibGUgY2FuIHJldHVybiB0cnVlIGlmIGl0IHdhbnRzIHRvIGRlYWN0aXZhdGUuXG4gIC8vIE5vdGUgdGhhdCwgYmVjYXVzZSB3ZSdyZSBpbiB0aGUgY2FwdHVyZSBwaGFzZSwgdGhpcyBjYWxsYmFjayB3aWxsIG9jY3VyIGJlZm9yZVxuICAvLyB0aGUgYnViYmxpbmcgY2xpY2sgZXZlbnQgb24gYW55IG91dHNpZGUgZWxlbWVudHMuXG4gICFlbGVtZW50cy5zb21lKGVsID0+IGVsLmNvbnRhaW5zKGUudGFyZ2V0IGFzIE5vZGUpKSAmJiBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBpc0FjdGl2ZShlKSAmJiBoYW5kbGVyICYmIGhhbmRsZXIoZSlcbiAgfSwgMClcbn1cblxuZXhwb3J0IGNvbnN0IENsaWNrT3V0c2lkZSA9IHtcbiAgLy8gW2RhdGEtYXBwXSBtYXkgbm90IGJlIGZvdW5kXG4gIC8vIGlmIHVzaW5nIGJpbmQsIGluc2VydGVkIG1ha2VzXG4gIC8vIHN1cmUgdGhhdCB0aGUgcm9vdCBlbGVtZW50IGlzXG4gIC8vIGF2YWlsYWJsZSwgaU9TIGRvZXMgbm90IHN1cHBvcnRcbiAgLy8gY2xpY2tzIG9uIGJvZHlcbiAgaW5zZXJ0ZWQgKGVsOiBIVE1MRWxlbWVudCwgYmluZGluZzogQ2xpY2tPdXRzaWRlRGlyZWN0aXZlKSB7XG4gICAgY29uc3Qgb25DbGljayA9IChlOiBFdmVudCkgPT4gZGlyZWN0aXZlKGUgYXMgUG9pbnRlckV2ZW50LCBlbCwgYmluZGluZylcbiAgICAvLyBpT1MgZG9lcyBub3QgcmVjb2duaXplIGNsaWNrIGV2ZW50cyBvbiBkb2N1bWVudFxuICAgIC8vIG9yIGJvZHksIHRoaXMgaXMgdGhlIGVudGlyZSBwdXJwb3NlIG9mIHRoZSB2LWFwcFxuICAgIC8vIGNvbXBvbmVudCBhbmQgW2RhdGEtYXBwXSwgc3RvcCByZW1vdmluZyB0aGlzXG4gICAgY29uc3QgYXBwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtYXBwXScpIHx8XG4gICAgICBkb2N1bWVudC5ib2R5IC8vIFRoaXMgaXMgb25seSBmb3IgdW5pdCB0ZXN0c1xuICAgIGFwcC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xpY2ssIHRydWUpXG4gICAgZWwuX2NsaWNrT3V0c2lkZSA9IG9uQ2xpY2tcbiAgfSxcblxuICB1bmJpbmQgKGVsOiBIVE1MRWxlbWVudCkge1xuICAgIGlmICghZWwuX2NsaWNrT3V0c2lkZSkgcmV0dXJuXG5cbiAgICBjb25zdCBhcHAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1hcHBdJykgfHxcbiAgICAgIGRvY3VtZW50LmJvZHkgLy8gVGhpcyBpcyBvbmx5IGZvciB1bml0IHRlc3RzXG4gICAgYXBwICYmIGFwcC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIGVsLl9jbGlja091dHNpZGUsIHRydWUpXG4gICAgZGVsZXRlIGVsLl9jbGlja091dHNpZGVcbiAgfSxcbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2xpY2tPdXRzaWRlXG4iXX0=