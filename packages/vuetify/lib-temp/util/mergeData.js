import { camelize, wrapInArray } from './helpers';
const pattern = {
    styleList: /;(?![^(]*\))/g,
    styleProp: /:(.*)/,
};
function parseStyle(style) {
    const styleMap = {};
    for (const s of style.split(pattern.styleList)) {
        let [key, val] = s.split(pattern.styleProp);
        key = key.trim();
        if (!key) {
            continue;
        }
        // May be undefined if the `key: value` pair is incomplete.
        if (typeof val === 'string') {
            val = val.trim();
        }
        styleMap[camelize(key)] = val;
    }
    return styleMap;
}
export default function mergeData() {
    const mergeTarget = {};
    let i = arguments.length;
    let prop;
    // Allow for variadic argument length.
    while (i--) {
        // Iterate through the data properties and execute merge strategies
        // Object.keys eliminates need for hasOwnProperty call
        for (prop of Object.keys(arguments[i])) {
            switch (prop) {
                // Array merge strategy (array concatenation)
                case 'class':
                case 'directives':
                    if (arguments[i][prop]) {
                        mergeTarget[prop] = mergeClasses(mergeTarget[prop], arguments[i][prop]);
                    }
                    break;
                case 'style':
                    if (arguments[i][prop]) {
                        mergeTarget[prop] = mergeStyles(mergeTarget[prop], arguments[i][prop]);
                    }
                    break;
                // Space delimited string concatenation strategy
                case 'staticClass':
                    if (!arguments[i][prop]) {
                        break;
                    }
                    if (mergeTarget[prop] === undefined) {
                        mergeTarget[prop] = '';
                    }
                    if (mergeTarget[prop]) {
                        // Not an empty string, so concatenate
                        mergeTarget[prop] += ' ';
                    }
                    mergeTarget[prop] += arguments[i][prop].trim();
                    break;
                // Object, the properties of which to merge via array merge strategy (array concatenation).
                // Callback merge strategy merges callbacks to the beginning of the array,
                // so that the last defined callback will be invoked first.
                // This is done since to mimic how Object.assign merging
                // uses the last given value to assign.
                case 'on':
                case 'nativeOn':
                    if (arguments[i][prop]) {
                        mergeTarget[prop] = mergeListeners(mergeTarget[prop], arguments[i][prop]);
                    }
                    break;
                // Object merge strategy
                case 'attrs':
                case 'props':
                case 'domProps':
                case 'scopedSlots':
                case 'staticStyle':
                case 'hook':
                case 'transition':
                    if (!arguments[i][prop]) {
                        break;
                    }
                    if (!mergeTarget[prop]) {
                        mergeTarget[prop] = {};
                    }
                    mergeTarget[prop] = { ...arguments[i][prop], ...mergeTarget[prop] };
                    break;
                // Reassignment strategy (no merge)
                default: // slot, key, ref, tag, show, keepAlive
                    if (!mergeTarget[prop]) {
                        mergeTarget[prop] = arguments[i][prop];
                    }
            }
        }
    }
    return mergeTarget;
}
export function mergeStyles(target, source) {
    if (!target)
        return source;
    if (!source)
        return target;
    target = wrapInArray(typeof target === 'string' ? parseStyle(target) : target);
    return target.concat(typeof source === 'string' ? parseStyle(source) : source);
}
export function mergeClasses(target, source) {
    if (!source)
        return target;
    if (!target)
        return source;
    return target ? wrapInArray(target).concat(source) : source;
}
export function mergeListeners(target, source) {
    if (!target)
        return source;
    if (!source)
        return target;
    let event;
    for (event of Object.keys(source)) {
        // Concat function to array of functions if callback present.
        if (target[event]) {
            // Insert current iteration data in beginning of merged array.
            target[event] = wrapInArray(target[event]);
            target[event].push(...wrapInArray(source[event]));
        }
        else {
            // Straight assign.
            target[event] = source[event];
        }
    }
    return target;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVyZ2VEYXRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWwvbWVyZ2VEYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLE9BQU8sRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLE1BQU0sV0FBVyxDQUFBO0FBRWpELE1BQU0sT0FBTyxHQUFHO0lBQ2QsU0FBUyxFQUFFLGVBQWU7SUFDMUIsU0FBUyxFQUFFLE9BQU87Q0FDVixDQUFBO0FBRVYsU0FBUyxVQUFVLENBQUUsS0FBYTtJQUNoQyxNQUFNLFFBQVEsR0FBb0IsRUFBRSxDQUFBO0lBRXBDLEtBQUssTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUU7UUFDOUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUMzQyxHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFBO1FBQ2hCLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDUixTQUFRO1NBQ1Q7UUFDRCwyREFBMkQ7UUFDM0QsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7WUFDM0IsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtTQUNqQjtRQUNELFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUE7S0FDOUI7SUFFRCxPQUFPLFFBQVEsQ0FBQTtBQUNqQixDQUFDO0FBUUQsTUFBTSxDQUFDLE9BQU8sVUFBVSxTQUFTO0lBQy9CLE1BQU0sV0FBVyxHQUFnQyxFQUFFLENBQUE7SUFDbkQsSUFBSSxDQUFDLEdBQVcsU0FBUyxDQUFDLE1BQU0sQ0FBQTtJQUNoQyxJQUFJLElBQVksQ0FBQTtJQUVoQixzQ0FBc0M7SUFDdEMsT0FBTyxDQUFDLEVBQUUsRUFBRTtRQUNWLG1FQUFtRTtRQUNu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LEtBQUssQ0FBQyxFQUFFO1lBQ2pCLDhEQUE4RDtZQUM5RCxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUN6QztZQUFDLE1BQU0sQ0FBQyxLQUFLLENBQWdCLENBQUMsSUFBSSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7U0FDbkU7YUFBTTtZQUNMLG1CQUFtQjtZQUNuQixNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO1NBQzlCO0tBQ0Y7SUFFRCxPQUFPLE1BQU0sQ0FBQTtBQUNmLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBjb3B5cmlnaHQgMjAxNyBBbGV4IFJlZ2FuXG4gKiBAbGljZW5zZSBNSVRcbiAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2FsZXhzYXNoYXJlZ2FuL3Z1ZS1mdW5jdGlvbmFsLWRhdGEtbWVyZ2VcbiAqL1xuLyogZXNsaW50LWRpc2FibGUgbWF4LXN0YXRlbWVudHMgKi9cbmltcG9ydCB7IFZOb2RlRGF0YSB9IGZyb20gJ3Z1ZSdcbmltcG9ydCB7IGNhbWVsaXplLCB3cmFwSW5BcnJheSB9IGZyb20gJy4vaGVscGVycydcblxuY29uc3QgcGF0dGVybiA9IHtcbiAgc3R5bGVMaXN0OiAvOyg/IVteKF0qXFwpKS9nLFxuICBzdHlsZVByb3A6IC86KC4qKS8sXG59IGFzIGNvbnN0XG5cbmZ1bmN0aW9uIHBhcnNlU3R5bGUgKHN0eWxlOiBzdHJpbmcpIHtcbiAgY29uc3Qgc3R5bGVNYXA6IERpY3Rpb25hcnk8YW55PiA9IHt9XG5cbiAgZm9yIChjb25zdCBzIG9mIHN0eWxlLnNwbGl0KHBhdHRlcm4uc3R5bGVMaXN0KSkge1xuICAgIGxldCBba2V5LCB2YWxdID0gcy5zcGxpdChwYXR0ZXJuLnN0eWxlUHJvcClcbiAgICBrZXkgPSBrZXkudHJpbSgpXG4gICAgaWYgKCFrZXkpIHtcbiAgICAgIGNvbnRpbnVlXG4gICAgfVxuICAgIC8vIE1heSBiZSB1bmRlZmluZWQgaWYgdGhlIGBrZXk6IHZhbHVlYCBwYWlyIGlzIGluY29tcGxldGUuXG4gICAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICB2YWwgPSB2YWwudHJpbSgpXG4gICAgfVxuICAgIHN0eWxlTWFwW2NhbWVsaXplKGtleSldID0gdmFsXG4gIH1cblxuICByZXR1cm4gc3R5bGVNYXBcbn1cblxuLyoqXG4gKiBJbnRlbGxpZ2VudGx5IG1lcmdlcyBkYXRhIGZvciBjcmVhdGVFbGVtZW50LlxuICogTWVyZ2VzIGFyZ3VtZW50cyBsZWZ0IHRvIHJpZ2h0LCBwcmVmZXJyaW5nIHRoZSByaWdodCBhcmd1bWVudC5cbiAqIFJldHVybnMgbmV3IFZOb2RlRGF0YSBvYmplY3QuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1lcmdlRGF0YSAoLi4udk5vZGVEYXRhOiBWTm9kZURhdGFbXSk6IFZOb2RlRGF0YVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWVyZ2VEYXRhICgpOiBWTm9kZURhdGEge1xuICBjb25zdCBtZXJnZVRhcmdldDogVk5vZGVEYXRhICYgRGljdGlvbmFyeTxhbnk+ID0ge31cbiAgbGV0IGk6IG51bWJlciA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgbGV0IHByb3A6IHN0cmluZ1xuXG4gIC8vIEFsbG93IGZvciB2YXJpYWRpYyBhcmd1bWVudCBsZW5ndGguXG4gIHdoaWxlIChpLS0pIHtcbiAgICAvLyBJdGVyYXRlIHRocm91Z2ggdGhlIGRhdGEgcHJvcGVydGllcyBhbmQgZXhlY3V0ZSBtZXJnZSBzdHJhdGVnaWVzXG4gICAgLy8gT2JqZWN0LmtleXMgZWxpbWluYXRlcyBuZWVkIGZvciBoYXNPd25Qcm9wZXJ0eSBjYWxsXG4gICAgZm9yIChwcm9wIG9mIE9iamVjdC5rZXlzKGFyZ3VtZW50c1tpXSkpIHtcbiAgICAgIHN3aXRjaCAocHJvcCkge1xuICAgICAgICAvLyBBcnJheSBtZXJnZSBzdHJhdGVneSAoYXJyYXkgY29uY2F0ZW5hdGlvbilcbiAgICAgICAgY2FzZSAnY2xhc3MnOlxuICAgICAgICBjYXNlICdkaXJlY3RpdmVzJzpcbiAgICAgICAgICBpZiAoYXJndW1lbnRzW2ldW3Byb3BdKSB7XG4gICAgICAgICAgICBtZXJnZVRhcmdldFtwcm9wXSA9IG1lcmdlQ2xhc3NlcyhtZXJnZVRhcmdldFtwcm9wXSwgYXJndW1lbnRzW2ldW3Byb3BdKVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdzdHlsZSc6XG4gICAgICAgICAgaWYgKGFyZ3VtZW50c1tpXVtwcm9wXSkge1xuICAgICAgICAgICAgbWVyZ2VUYXJnZXRbcHJvcF0gPSBtZXJnZVN0eWxlcyhtZXJnZVRhcmdldFtwcm9wXSwgYXJndW1lbnRzW2ldW3Byb3BdKVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICAvLyBTcGFjZSBkZWxpbWl0ZWQgc3RyaW5nIGNvbmNhdGVuYXRpb24gc3RyYXRlZ3lcbiAgICAgICAgY2FzZSAnc3RhdGljQ2xhc3MnOlxuICAgICAgICAgIGlmICghYXJndW1lbnRzW2ldW3Byb3BdKSB7XG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAobWVyZ2VUYXJnZXRbcHJvcF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbWVyZ2VUYXJnZXRbcHJvcF0gPSAnJ1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAobWVyZ2VUYXJnZXRbcHJvcF0pIHtcbiAgICAgICAgICAgIC8vIE5vdCBhbiBlbXB0eSBzdHJpbmcsIHNvIGNvbmNhdGVuYXRlXG4gICAgICAgICAgICBtZXJnZVRhcmdldFtwcm9wXSArPSAnICdcbiAgICAgICAgICB9XG4gICAgICAgICAgbWVyZ2VUYXJnZXRbcHJvcF0gKz0gYXJndW1lbnRzW2ldW3Byb3BdLnRyaW0oKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIC8vIE9iamVjdCwgdGhlIHByb3BlcnRpZXMgb2Ygd2hpY2ggdG8gbWVyZ2UgdmlhIGFycmF5IG1lcmdlIHN0cmF0ZWd5IChhcnJheSBjb25jYXRlbmF0aW9uKS5cbiAgICAgICAgLy8gQ2FsbGJhY2sgbWVyZ2Ugc3RyYXRlZ3kgbWVyZ2VzIGNhbGxiYWNrcyB0byB0aGUgYmVnaW5uaW5nIG9mIHRoZSBhcnJheSxcbiAgICAgICAgLy8gc28gdGhhdCB0aGUgbGFzdCBkZWZpbmVkIGNhbGxiYWNrIHdpbGwgYmUgaW52b2tlZCBmaXJzdC5cbiAgICAgICAgLy8gVGhpcyBpcyBkb25lIHNpbmNlIHRvIG1pbWljIGhvdyBPYmplY3QuYXNzaWduIG1lcmdpbmdcbiAgICAgICAgLy8gdXNlcyB0aGUgbGFzdCBnaXZlbiB2YWx1ZSB0byBhc3NpZ24uXG4gICAgICAgIGNhc2UgJ29uJzpcbiAgICAgICAgY2FzZSAnbmF0aXZlT24nOlxuICAgICAgICAgIGlmIChhcmd1bWVudHNbaV1bcHJvcF0pIHtcbiAgICAgICAgICAgIG1lcmdlVGFyZ2V0W3Byb3BdID0gbWVyZ2VMaXN0ZW5lcnMobWVyZ2VUYXJnZXRbcHJvcF0sIGFyZ3VtZW50c1tpXVtwcm9wXSlcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgLy8gT2JqZWN0IG1lcmdlIHN0cmF0ZWd5XG4gICAgICAgIGNhc2UgJ2F0dHJzJzpcbiAgICAgICAgY2FzZSAncHJvcHMnOlxuICAgICAgICBjYXNlICdkb21Qcm9wcyc6XG4gICAgICAgIGNhc2UgJ3Njb3BlZFNsb3RzJzpcbiAgICAgICAgY2FzZSAnc3RhdGljU3R5bGUnOlxuICAgICAgICBjYXNlICdob29rJzpcbiAgICAgICAgY2FzZSAndHJhbnNpdGlvbic6XG4gICAgICAgICAgaWYgKCFhcmd1bWVudHNbaV1bcHJvcF0pIHtcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghbWVyZ2VUYXJnZXRbcHJvcF0pIHtcbiAgICAgICAgICAgIG1lcmdlVGFyZ2V0W3Byb3BdID0ge31cbiAgICAgICAgICB9XG4gICAgICAgICAgbWVyZ2VUYXJnZXRbcHJvcF0gPSB7IC4uLmFyZ3VtZW50c1tpXVtwcm9wXSwgLi4ubWVyZ2VUYXJnZXRbcHJvcF0gfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIC8vIFJlYXNzaWdubWVudCBzdHJhdGVneSAobm8gbWVyZ2UpXG4gICAgICAgIGRlZmF1bHQ6IC8vIHNsb3QsIGtleSwgcmVmLCB0YWcsIHNob3csIGtlZXBBbGl2ZVxuICAgICAgICAgIGlmICghbWVyZ2VUYXJnZXRbcHJvcF0pIHtcbiAgICAgICAgICAgIG1lcmdlVGFyZ2V0W3Byb3BdID0gYXJndW1lbnRzW2ldW3Byb3BdXG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBtZXJnZVRhcmdldFxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VTdHlsZXMgKFxuICB0YXJnZXQ6IHVuZGVmaW5lZCB8IHN0cmluZyB8IG9iamVjdFtdIHwgb2JqZWN0LFxuICBzb3VyY2U6IHVuZGVmaW5lZCB8IHN0cmluZyB8IG9iamVjdFtdIHwgb2JqZWN0XG4pIHtcbiAgaWYgKCF0YXJnZXQpIHJldHVybiBzb3VyY2VcbiAgaWYgKCFzb3VyY2UpIHJldHVybiB0YXJnZXRcblxuICB0YXJnZXQgPSB3cmFwSW5BcnJheSh0eXBlb2YgdGFyZ2V0ID09PSAnc3RyaW5nJyA/IHBhcnNlU3R5bGUodGFyZ2V0KSA6IHRhcmdldClcblxuICByZXR1cm4gKHRhcmdldCBhcyBvYmplY3RbXSkuY29uY2F0KHR5cGVvZiBzb3VyY2UgPT09ICdzdHJpbmcnID8gcGFyc2VTdHlsZShzb3VyY2UpIDogc291cmNlKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VDbGFzc2VzICh0YXJnZXQ6IGFueSwgc291cmNlOiBhbnkpIHtcbiAgaWYgKCFzb3VyY2UpIHJldHVybiB0YXJnZXRcbiAgaWYgKCF0YXJnZXQpIHJldHVybiBzb3VyY2VcblxuICByZXR1cm4gdGFyZ2V0ID8gd3JhcEluQXJyYXkodGFyZ2V0KS5jb25jYXQoc291cmNlKSA6IHNvdXJjZVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VMaXN0ZW5lcnMgKFxuICB0YXJnZXQ6IHsgW2tleTogc3RyaW5nXTogRnVuY3Rpb24gfCBGdW5jdGlvbltdIH0gfCB1bmRlZmluZWQsXG4gIHNvdXJjZTogeyBba2V5OiBzdHJpbmddOiBGdW5jdGlvbiB8IEZ1bmN0aW9uW10gfSB8IHVuZGVmaW5lZFxuKSB7XG4gIGlmICghdGFyZ2V0KSByZXR1cm4gc291cmNlXG4gIGlmICghc291cmNlKSByZXR1cm4gdGFyZ2V0XG5cbiAgbGV0IGV2ZW50OiBzdHJpbmdcblxuICBmb3IgKGV2ZW50IG9mIE9iamVjdC5rZXlzKHNvdXJjZSkpIHtcbiAgICAvLyBDb25jYXQgZnVuY3Rpb24gdG8gYXJyYXkgb2YgZnVuY3Rpb25zIGlmIGNhbGxiYWNrIHByZXNlbnQuXG4gICAgaWYgKHRhcmdldFtldmVudF0pIHtcbiAgICAgIC8vIEluc2VydCBjdXJyZW50IGl0ZXJhdGlvbiBkYXRhIGluIGJlZ2lubmluZyBvZiBtZXJnZWQgYXJyYXkuXG4gICAgICB0YXJnZXRbZXZlbnRdID0gd3JhcEluQXJyYXkodGFyZ2V0W2V2ZW50XSlcbiAgICAgIDsodGFyZ2V0W2V2ZW50XSBhcyBGdW5jdGlvbltdKS5wdXNoKC4uLndyYXBJbkFycmF5KHNvdXJjZVtldmVudF0pKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTdHJhaWdodCBhc3NpZ24uXG4gICAgICB0YXJnZXRbZXZlbnRdID0gc291cmNlW2V2ZW50XVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0YXJnZXRcbn1cbiJdfQ==