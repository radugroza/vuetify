import Vuetify from '../framework';
function createMessage(message, vm, parent) {
    if (Vuetify.config.silent)
        return;
    if (parent) {
        vm = {
            _isVue: true,
            $parent: parent,
            $options: vm,
        };
    }
    if (vm) {
        // Only show each message once per instance
        vm.$_alreadyWarned = vm.$_alreadyWarned || [];
        if (vm.$_alreadyWarned.includes(message))
            return;
        vm.$_alreadyWarned.push(message);
    }
    return `[Vuetify] ${message}` + (vm ? generateComponentTrace(vm) : '');
}
export function consoleInfo(message, vm, parent) {
    const newMessage = createMessage(message, vm, parent);
    newMessage != null && console.info(newMessage);
}
export function consoleWarn(message, vm, parent) {
    const newMessage = createMessage(message, vm, parent);
    newMessage != null && console.warn(newMessage);
}
export function consoleError(message, vm, parent) {
    const newMessage = createMessage(message, vm, parent);
    newMessage != null && console.error(newMessage);
}
export function deprecate(original, replacement, vm, parent) {
    consoleWarn(`[UPGRADE] '${original}' is deprecated, use '${replacement}' instead.`, vm, parent);
}
export function breaking(original, replacement, vm, parent) {
    consoleError(`[BREAKING] '${original}' has been removed, use '${replacement}' instead. For more information, see the upgrade guide https://github.com/vuetifyjs/vuetify/releases/tag/v2.0.0#user-content-upgrade-guide`, vm, parent);
}
export function removed(original, vm, parent) {
    consoleWarn(`[REMOVED] '${original}' has been removed. You can safely omit it.`, vm, parent);
}
/**
 * Shamelessly stolen from vuejs/vue/blob/dev/src/core/util/debug.js
 */
const classifyRE = /(?:^|[-_])(\w)/g;
const classify = (str) => str
    .replace(classifyRE, c => c.toUpperCase())
    .replace(/[-_]/g, '');
function formatComponentName(vm, includeFile) {
    if (vm.$root === vm) {
        return '<Root>';
    }
    const options = typeof vm === 'function' && vm.cid != null
        ? vm.options
        : vm._isVue
            ? vm.$options || vm.constructor.options
            : vm || {};
    let name = options.name || options._componentTag;
    const file = options.__file;
    if (!name && file) {
        const match = file.match(/([^/\\]+)\.vue$/);
        name = match && match[1];
    }
    return ((name ? `<${classify(name)}>` : `<Anonymous>`) +
        (file && includeFile !== false ? ` at ${file}` : ''));
}
function generateComponentTrace(vm) {
    if (vm._isVue && vm.$parent) {
        const tree = [];
        let currentRecursiveSequence = 0;
        while (vm) {
            if (tree.length > 0) {
                const last = tree[tree.length - 1];
                if (last.constructor === vm.constructor) {
                    currentRecursiveSequence++;
                    vm = vm.$parent;
                    continue;
                }
                else if (currentRecursiveSequence > 0) {
                    tree[tree.length - 1] = [last, currentRecursiveSequence];
                    currentRecursiveSequence = 0;
                }
            }
            tree.push(vm);
            vm = vm.$parent;
        }
        return '\n\nfound in\n\n' + tree
            .map((vm, i) => `${i === 0 ? '---> ' : ' '.repeat(5 + i * 2)}${Array.isArray(vm)
            ? `${formatComponentName(vm[0])}... (${vm[1]} recursive calls)`
            : formatComponentName(vm)}`)
            .join('\n');
    }
    else {
        return `\n\n(found in ${formatComponentName(vm)})`;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc29sZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL2NvbnNvbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxPQUFPLE1BQU0sY0FBYyxDQUFBO0FBRWxDLFNBQVMsYUFBYSxDQUFFLE9BQWUsRUFBRSxFQUFRLEVBQUUsTUFBWTtJQUM3RCxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTTtRQUFFLE9BQU07SUFFakMsSUFBSSxNQUFNLEVBQUU7UUFDVixFQUFFLEdBQUc7WUFDSCxNQUFNLEVBQUUsSUFBSTtZQUNaLE9BQU8sRUFBRSxNQUFNO1lBQ2YsUUFBUSxFQUFFLEVBQUU7U0FDYixDQUFBO0tBQ0Y7SUFFRCxJQUFJLEVBQUUsRUFBRTtRQUNOLDJDQUEyQztRQUMzQyxFQUFFLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQyxlQUFlLElBQUksRUFBRSxDQUFBO1FBQzdDLElBQUksRUFBRSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO1lBQUUsT0FBTTtRQUNoRCxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtLQUNqQztJQUVELE9BQU8sYUFBYSxPQUFPLEVBQUUsR0FBRyxDQUM5QixFQUFFLENBQUMsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQ3JDLENBQUE7QUFDSCxDQUFDO0FBRUQsTUFBTSxVQUFVLFdBQVcsQ0FBRSxPQUFlLEVBQUUsRUFBUSxFQUFFLE1BQVk7SUFDbEUsTUFBTSxVQUFVLEdBQUcsYUFBYSxDQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUE7SUFDckQsVUFBVSxJQUFJLElBQUksSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQ2hELENBQUM7QUFFRCxNQUFNLFVBQVUsV0FBVyxDQUFFLE9BQWUsRUFBRSxFQUFRLEVB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QUMvRCxDQUFDLENBQUMsbUJBQW1CLENBQUMsRUFBRSxDQUM1QixFQUFFLENBQUM7YUFDRixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDZDtTQUFNO1FBQ0wsT0FBTyxpQkFBaUIsbUJBQW1CLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQTtLQUNuRDtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVnVldGlmeSBmcm9tICcuLi9mcmFtZXdvcmsnXG5cbmZ1bmN0aW9uIGNyZWF0ZU1lc3NhZ2UgKG1lc3NhZ2U6IHN0cmluZywgdm0/OiBhbnksIHBhcmVudD86IGFueSk6IHN0cmluZyB8IHZvaWQge1xuICBpZiAoVnVldGlmeS5jb25maWcuc2lsZW50KSByZXR1cm5cblxuICBpZiAocGFyZW50KSB7XG4gICAgdm0gPSB7XG4gICAgICBfaXNWdWU6IHRydWUsXG4gICAgICAkcGFyZW50OiBwYXJlbnQsXG4gICAgICAkb3B0aW9uczogdm0sXG4gICAgfVxuICB9XG5cbiAgaWYgKHZtKSB7XG4gICAgLy8gT25seSBzaG93IGVhY2ggbWVzc2FnZSBvbmNlIHBlciBpbnN0YW5jZVxuICAgIHZtLiRfYWxyZWFkeVdhcm5lZCA9IHZtLiRfYWxyZWFkeVdhcm5lZCB8fCBbXVxuICAgIGlmICh2bS4kX2FscmVhZHlXYXJuZWQuaW5jbHVkZXMobWVzc2FnZSkpIHJldHVyblxuICAgIHZtLiRfYWxyZWFkeVdhcm5lZC5wdXNoKG1lc3NhZ2UpXG4gIH1cblxuICByZXR1cm4gYFtWdWV0aWZ5XSAke21lc3NhZ2V9YCArIChcbiAgICB2bSA/IGdlbmVyYXRlQ29tcG9uZW50VHJhY2Uodm0pIDogJydcbiAgKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29uc29sZUluZm8gKG1lc3NhZ2U6IHN0cmluZywgdm0/OiBhbnksIHBhcmVudD86IGFueSk6IHZvaWQge1xuICBjb25zdCBuZXdNZXNzYWdlID0gY3JlYXRlTWVzc2FnZShtZXNzYWdlLCB2bSwgcGFyZW50KVxuICBuZXdNZXNzYWdlICE9IG51bGwgJiYgY29uc29sZS5pbmZvKG5ld01lc3NhZ2UpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb25zb2xlV2FybiAobWVzc2FnZTogc3RyaW5nLCB2bT86IGFueSwgcGFyZW50PzogYW55KTogdm9pZCB7XG4gIGNvbnN0IG5ld01lc3NhZ2UgPSBjcmVhdGVNZXNzYWdlKG1lc3NhZ2UsIHZtLCBwYXJlbnQpXG4gIG5ld01lc3NhZ2UgIT0gbnVsbCAmJiBjb25zb2xlLndhcm4obmV3TWVzc2FnZSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnNvbGVFcnJvciAobWVzc2FnZTogc3RyaW5nLCB2bT86IGFueSwgcGFyZW50PzogYW55KTogdm9pZCB7XG4gIGNvbnN0IG5ld01lc3NhZ2UgPSBjcmVhdGVNZXNzYWdlKG1lc3NhZ2UsIHZtLCBwYXJlbnQpXG4gIG5ld01lc3NhZ2UgIT0gbnVsbCAmJiBjb25zb2xlLmVycm9yKG5ld01lc3NhZ2UpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXByZWNhdGUgKG9yaWdpbmFsOiBzdHJpbmcsIHJlcGxhY2VtZW50OiBzdHJpbmcsIHZtPzogYW55LCBwYXJlbnQ/OiBhbnkpIHtcbiAgY29uc29sZVdhcm4oYFtVUEdSQURFXSAnJHtvcmlnaW5hbH0nIGlzIGRlcHJlY2F0ZWQsIHVzZSAnJHtyZXBsYWNlbWVudH0nIGluc3RlYWQuYCwgdm0sIHBhcmVudClcbn1cbmV4cG9ydCBmdW5jdGlvbiBicmVha2luZyAob3JpZ2luYWw6IHN0cmluZywgcmVwbGFjZW1lbnQ6IHN0cmluZywgdm0/OiBhbnksIHBhcmVudD86IGFueSkge1xuICBjb25zb2xlRXJyb3IoYFtCUkVBS0lOR10gJyR7b3JpZ2luYWx9JyBoYXMgYmVlbiByZW1vdmVkLCB1c2UgJyR7cmVwbGFjZW1lbnR9JyBpbnN0ZWFkLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIHRoZSB1cGdyYWRlIGd1aWRlIGh0dHBzOi8vZ2l0aHViLmNvbS92dWV0aWZ5anMvdnVldGlmeS9yZWxlYXNlcy90YWcvdjIuMC4wI3VzZXItY29udGVudC11cGdyYWRlLWd1aWRlYCwgdm0sIHBhcmVudClcbn1cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVkIChvcmlnaW5hbDogc3RyaW5nLCB2bT86IGFueSwgcGFyZW50PzogYW55KSB7XG4gIGNvbnNvbGVXYXJuKGBbUkVNT1ZFRF0gJyR7b3JpZ2luYWx9JyBoYXMgYmVlbiByZW1vdmVkLiBZb3UgY2FuIHNhZmVseSBvbWl0IGl0LmAsIHZtLCBwYXJlbnQpXG59XG5cbi8qKlxuICogU2hhbWVsZXNzbHkgc3RvbGVuIGZyb20gdnVlanMvdnVlL2Jsb2IvZGV2L3NyYy9jb3JlL3V0aWwvZGVidWcuanNcbiAqL1xuXG5jb25zdCBjbGFzc2lmeVJFID0gLyg/Ol58Wy1fXSkoXFx3KS9nXG5jb25zdCBjbGFzc2lmeSA9IChzdHI6IHN0cmluZykgPT4gc3RyXG4gIC5yZXBsYWNlKGNsYXNzaWZ5UkUsIGMgPT4gYy50b1VwcGVyQ2FzZSgpKVxuICAucmVwbGFjZSgvWy1fXS9nLCAnJylcblxuZnVuY3Rpb24gZm9ybWF0Q29tcG9uZW50TmFtZSAodm06IGFueSwgaW5jbHVkZUZpbGU/OiBib29sZWFuKTogc3RyaW5nIHtcbiAgaWYgKHZtLiRyb290ID09PSB2bSkge1xuICAgIHJldHVybiAnPFJvb3Q+J1xuICB9XG4gIGNvbnN0IG9wdGlvbnMgPSB0eXBlb2Ygdm0gPT09ICdmdW5jdGlvbicgJiYgdm0uY2lkICE9IG51bGxcbiAgICA/IHZtLm9wdGlvbnNcbiAgICA6IHZtLl9pc1Z1ZVxuICAgICAgPyB2bS4kb3B0aW9ucyB8fCB2bS5jb25zdHJ1Y3Rvci5vcHRpb25zXG4gICAgICA6IHZtIHx8IHt9XG4gIGxldCBuYW1lID0gb3B0aW9ucy5uYW1lIHx8IG9wdGlvbnMuX2NvbXBvbmVudFRhZ1xuICBjb25zdCBmaWxlID0gb3B0aW9ucy5fX2ZpbGVcbiAgaWYgKCFuYW1lICYmIGZpbGUpIHtcbiAgICBjb25zdCBtYXRjaCA9IGZpbGUubWF0Y2goLyhbXi9cXFxcXSspXFwudnVlJC8pXG4gICAgbmFtZSA9IG1hdGNoICYmIG1hdGNoWzFdXG4gIH1cblxuICByZXR1cm4gKFxuICAgIChuYW1lID8gYDwke2NsYXNzaWZ5KG5hbWUpfT5gIDogYDxBbm9ueW1vdXM+YCkgK1xuICAgIChmaWxlICYmIGluY2x1ZGVGaWxlICE9PSBmYWxzZSA/IGAgYXQgJHtmaWxlfWAgOiAnJylcbiAgKVxufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZUNvbXBvbmVudFRyYWNlICh2bTogYW55KTogc3RyaW5nIHtcbiAgaWYgKHZtLl9pc1Z1ZSAmJiB2bS4kcGFyZW50KSB7XG4gICAgY29uc3QgdHJlZTogYW55W10gPSBbXVxuICAgIGxldCBjdXJyZW50UmVjdXJzaXZlU2VxdWVuY2UgPSAwXG4gICAgd2hpbGUgKHZtKSB7XG4gICAgICBpZiAodHJlZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IGxhc3Q6IGFueSA9IHRyZWVbdHJlZS5sZW5ndGggLSAxXVxuICAgICAgICBpZiAobGFzdC5jb25zdHJ1Y3RvciA9PT0gdm0uY29uc3RydWN0b3IpIHtcbiAgICAgICAgICBjdXJyZW50UmVjdXJzaXZlU2VxdWVuY2UrK1xuICAgICAgICAgIHZtID0gdm0uJHBhcmVudFxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudFJlY3Vyc2l2ZVNlcXVlbmNlID4gMCkge1xuICAgICAgICAgIHRyZWVbdHJlZS5sZW5ndGggLSAxXSA9IFtsYXN0LCBjdXJyZW50UmVjdXJzaXZlU2VxdWVuY2VdXG4gICAgICAgICAgY3VycmVudFJlY3Vyc2l2ZVNlcXVlbmNlID0gMFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0cmVlLnB1c2godm0pXG4gICAgICB2bSA9IHZtLiRwYXJlbnRcbiAgICB9XG4gICAgcmV0dXJuICdcXG5cXG5mb3VuZCBpblxcblxcbicgKyB0cmVlXG4gICAgICAubWFwKCh2bSwgaSkgPT4gYCR7XG4gICAgICAgIGkgPT09IDAgPyAnLS0tPiAnIDogJyAnLnJlcGVhdCg1ICsgaSAqIDIpXG4gICAgICB9JHtcbiAgICAgICAgQXJyYXkuaXNBcnJheSh2bSlcbiAgICAgICAgICA/IGAke2Zvcm1hdENvbXBvbmVudE5hbWUodm1bMF0pfS4uLiAoJHt2bVsxXX0gcmVjdXJzaXZlIGNhbGxzKWBcbiAgICAgICAgICA6IGZvcm1hdENvbXBvbmVudE5hbWUodm0pXG4gICAgICB9YClcbiAgICAgIC5qb2luKCdcXG4nKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBgXFxuXFxuKGZvdW5kIGluICR7Zm9ybWF0Q29tcG9uZW50TmFtZSh2bSl9KWBcbiAgfVxufVxuIl19