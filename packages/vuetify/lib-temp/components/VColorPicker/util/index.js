// Utilities
import { HSVAtoRGBA, HSVAtoHex, RGBAtoHSVA, HexToHSVA, HSVAtoHSLA, RGBAtoHex, HSLAtoHSVA, parseHex, } from '../../../util/colorUtils';
export function fromHSVA(hsva) {
    hsva = { ...hsva };
    const hexa = HSVAtoHex(hsva);
    const hsla = HSVAtoHSLA(hsva);
    const rgba = HSVAtoRGBA(hsva);
    return {
        alpha: hsva.a,
        hex: hexa.substr(0, 7),
        hexa,
        hsla,
        hsva,
        hue: hsva.h,
        rgba,
    };
}
export function fromHSLA(hsla) {
    const hsva = HSLAtoHSVA(hsla);
    const hexa = HSVAtoHex(hsva);
    const rgba = HSVAtoRGBA(hsva);
    return {
        alpha: hsva.a,
        hex: hexa.substr(0, 7),
        hexa,
        hsla,
        hsva,
        hue: hsva.h,
        rgba,
    };
}
export function fromRGBA(rgba) {
    const hsva = RGBAtoHSVA(rgba);
    const hexa = RGBAtoHex(rgba);
    const hsla = HSVAtoHSLA(hsva);
    return {
        alpha: hsva.a,
        hex: hexa.substr(0, 7),
        hexa,
        hsla,
        hsva,
        hue: hsva.h,
        rgba,
    };
}
export function fromHexa(hexa) {
    const hsva = HexToHSVA(hexa);
    const hsla = HSVAtoHSLA(hsva);
    const rgba = HSVAtoRGBA(hsva);
    return {
        alpha: hsva.a,
        hex: hexa.substr(0, 7),
        hexa,
        hsla,
        hsva,
        hue: hsva.h,
        rgba,
    };
}
export function fromHex(hex) {
    return fromHexa(parseHex(hex));
}
function has(obj, key) {
    return key.every(k => obj.hasOwnProperty(k));
}
export function parseColor(color, oldColor) {
    if (!color)
        return fromRGBA({ r: 255, g: 0, b: 0, a: 1 });
    if (typeof color === 'string') {
        if (color === 'transparent')
            return fromHexa('#00000000');
        const hex = parseHex(color);
        if (oldColor && hex === oldColor.hexa)
            return oldColor;
        else
            return fromHexa(hex);
    }
    if (typeof color === 'object') {
        if (color.hasOwnProperty('alpha'))
            return color;
        const a = color.hasOwnProperty('a') ? parseFloat(color.a) : 1;
        if (has(color, ['r', 'g', 'b'])) {
            if (oldColor && color === oldColor.rgba)
                return oldColor;
            else
                return fromRGBA({ ...color, a });
        }
        else if (has(color, ['h', 's', 'l'])) {
            if (oldColor && color === oldColor.hsla)
                return oldColor;
            else
                return fromHSLA({ ...color, a });
        }
        else if (has(color, ['h', 's', 'v'])) {
            if (oldColor && color === oldColor.hsva)
                return oldColor;
            else
                return fromHSVA({ ...color, a });
        }
    }
    return fromRGBA({ r: 255, g: 0, b: 0, a: 1 });
}
function stripAlpha(color, stripAlpha) {
    if (stripAlpha) {
        const { a, ...rest } = color;
        return rest;
    }
    return color;
}
export function extractColor(color, input) {
    if (input == null)
        return color;
    if (typeof input === 'string') {
        return input.length === 7 ? color.hex : color.hexa;
    }
    if (typeof input === 'object') {
        if (has(input, ['r', 'g', 'b']))
            return stripAlpha(color.rgba, !input.a);
        else if (has(input, ['h', 's', 'l']))
            return stripAlpha(color.hsla, !input.a);
        else if (has(input, ['h', 's', 'v']))
            return stripAlpha(color.hsva, !input.a);
    }
    return color;
}
export function hasAlpha(color) {
    if (!color)
        return false;
    if (typeof color === 'string') {
        return color.length > 7;
    }
    if (typeof color === 'object') {
        return has(color, ['a']) || has(color, ['alpha']);
    }
    return false;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WQ29sb3JQaWNrZXIvdXRpbC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZO0FBQ1osT0FBTyxFQUVMLFVBQVUsRUFDVixTQUFTLEVBR1QsVUFBVSxFQUNWLFNBQVMsRUFFVCxVQUFVLEVBQ1YsU0FBUyxFQUNULFVBQVUsRUFDVixRQUFRLEdBRVQsTUFBTSwwQkFBMEIsQ0FBQTtBQVlqQyxNQUFNLFVBQVUsUUFBUSxDQUFFLElBQVU7SUFDbEMsSUFBSSxHQUFHLEVBQUUsR0FBRyxJQUFJLEVBQUUsQ0FBQTtJQUNsQixNQUFNLElBQUksR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDNUIsTUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzdCLE1BQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUM3QixPQUFPO1FBQ0wsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2IsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN0QixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDWCxJQUFJO0tBQ0wsQ0FBQTtBQUNILENBQUM7QUFFRCxNQUFNLFVBQVUsUUFBUSxDQUFFLElBQVU7SUFDbEMsTUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzdCLE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUM1QixNQUFNLElBQUksR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDN0IsT0FBTztRQUNMLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNiLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFD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QUFHLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtLQUNsRDtJQUVELE9BQU8sS0FBSyxDQUFBO0FBQ2QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIFV0aWxpdGllc1xuaW1wb3J0IHtcbiAgSFNWQSxcbiAgSFNWQXRvUkdCQSxcbiAgSFNWQXRvSGV4LFxuICBSR0JBLFxuICBIZXgsXG4gIFJHQkF0b0hTVkEsXG4gIEhleFRvSFNWQSxcbiAgSFNMQSxcbiAgSFNWQXRvSFNMQSxcbiAgUkdCQXRvSGV4LFxuICBIU0xBdG9IU1ZBLFxuICBwYXJzZUhleCxcbiAgSGV4YSxcbn0gZnJvbSAnLi4vLi4vLi4vdXRpbC9jb2xvclV0aWxzJ1xuXG5leHBvcnQgaW50ZXJmYWNlIFZDb2xvclBpY2tlckNvbG9yIHtcbiAgYWxwaGE6IG51bWJlclxuICBoZXg6IEhleFxuICBoZXhhOiBIZXhhXG4gIGhzbGE6IEhTTEFcbiAgaHN2YTogSFNWQVxuICBodWU6IG51bWJlclxuICByZ2JhOiBSR0JBXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmcm9tSFNWQSAoaHN2YTogSFNWQSk6IFZDb2xvclBpY2tlckNvbG9yIHtcbiAgaHN2YSA9IHsgLi4uaHN2YSB9XG4gIGNvbnN0IGhleGEgPSBIU1ZBdG9IZXgoaHN2YSlcbiAgY29uc3QgaHNsYSA9IEhTVkF0b0hTTEEoaHN2YSlcbiAgY29uc3QgcmdiYSA9IEhTVkF0b1JHQkEoaHN2YSlcbiAgcmV0dXJuIHtcbiAgICBhbHBoYTogaHN2YS5hLFxuICAgIGhleDogaGV4YS5zdWJzdHIoMCwgNyksXG4gICAgaGV4YSxcbiAgICBoc2xhLFxuICAgIGhzdmEsXG4gICAgaHVlOiBoc3ZhLmgsXG4gICAgcmdiYSxcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZnJvbUhTTEEgKGhzbGE6IEhTTEEpOiBWQ29sb3JQaWNrZXJDb2xvciB7XG4gIGNvbnN0IGhzdmEgPSBIU0xBdG9IU1ZBKGhzbGEpXG4gIGNvbnN0IGhleGEgPSBIU1ZBdG9IZXgoaHN2YSlcbiAgY29uc3QgcmdiYSA9IEhTVkF0b1JHQkEoaHN2YSlcbiAgcmV0dXJuIHtcbiAgICBhbHBoYTogaHN2YS5hLFxuICAgIGhleDogaGV4YS5zdWJzdHIoMCwgNyksXG4gICAgaGV4YSxcbiAgICBoc2xhLFxuICAgIGhzdmEsXG4gICAgaHVlOiBoc3ZhLmgsXG4gICAgcmdiYSxcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZnJvbVJHQkEgKHJnYmE6IFJHQkEpOiBWQ29sb3JQaWNrZXJDb2xvciB7XG4gIGNvbnN0IGhzdmEgPSBSR0JBdG9IU1ZBKHJnYmEpXG4gIGNvbnN0IGhleGEgPSBSR0JBdG9IZXgocmdiYSlcbiAgY29uc3QgaHNsYSA9IEhTVkF0b0hTTEEoaHN2YSlcbiAgcmV0dXJuIHtcbiAgICBhbHBoYTogaHN2YS5hLFxuICAgIGhleDogaGV4YS5zdWJzdHIoMCwgNyksXG4gICAgaGV4YSxcbiAgICBoc2xhLFxuICAgIGhzdmEsXG4gICAgaHVlOiBoc3ZhLmgsXG4gICAgcmdiYSxcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZnJvbUhleGEgKGhleGE6IEhleGEpOiBWQ29sb3JQaWNrZXJDb2xvciB7XG4gIGNvbnN0IGhzdmEgPSBIZXhUb0hTVkEoaGV4YSlcbiAgY29uc3QgaHNsYSA9IEhTVkF0b0hTTEEoaHN2YSlcbiAgY29uc3QgcmdiYSA9IEhTVkF0b1JHQkEoaHN2YSlcbiAgcmV0dXJuIHtcbiAgICBhbHBoYTogaHN2YS5hLFxuICAgIGhleDogaGV4YS5zdWJzdHIoMCwgNyksXG4gICAgaGV4YSxcbiAgICBoc2xhLFxuICAgIGhzdmEsXG4gICAgaHVlOiBoc3ZhLmgsXG4gICAgcmdiYSxcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZnJvbUhleCAoaGV4OiBIZXgpOiBWQ29sb3JQaWNrZXJDb2xvciB7XG4gIHJldHVybiBmcm9tSGV4YShwYXJzZUhleChoZXgpKVxufVxuXG5mdW5jdGlvbiBoYXMgKG9iajogb2JqZWN0LCBrZXk6IHN0cmluZ1tdKSB7XG4gIHJldHVybiBrZXkuZXZlcnkoayA9PiBvYmouaGFzT3duUHJvcGVydHkoaykpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUNvbG9yIChjb2xvcjogYW55LCBvbGRDb2xvcjogVkNvbG9yUGlja2VyQ29sb3IgfCBudWxsKSB7XG4gIGlmICghY29sb3IpIHJldHVybiBmcm9tUkdCQSh7IHI6IDI1NSwgZzogMCwgYjogMCwgYTogMSB9KVxuXG4gIGlmICh0eXBlb2YgY29sb3IgPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKGNvbG9yID09PSAndHJhbnNwYXJlbnQnKSByZXR1cm4gZnJvbUhleGEoJyMwMDAwMDAwMCcpXG5cbiAgICBjb25zdCBoZXggPSBwYXJzZUhleChjb2xvcilcblxuICAgIGlmIChvbGRDb2xvciAmJiBoZXggPT09IG9sZENvbG9yLmhleGEpIHJldHVybiBvbGRDb2xvclxuICAgIGVsc2UgcmV0dXJuIGZyb21IZXhhKGhleClcbiAgfVxuXG4gIGlmICh0eXBlb2YgY29sb3IgPT09ICdvYmplY3QnKSB7XG4gICAgaWYgKGNvbG9yLmhhc093blByb3BlcnR5KCdhbHBoYScpKSByZXR1cm4gY29sb3JcblxuICAgIGNvbnN0IGEgPSBjb2xvci5oYXNPd25Qcm9wZXJ0eSgnYScpID8gcGFyc2VGbG9hdChjb2xvci5hKSA6IDFcblxuICAgIGlmIChoYXMoY29sb3IsIFsncicsICdnJywgJ2InXSkpIHtcbiAgICAgIGlmIChvbGRDb2xvciAmJiBjb2xvciA9PT0gb2xkQ29sb3IucmdiYSkgcmV0dXJuIG9sZENvbG9yXG4gICAgICBlbHNlIHJldHVybiBmcm9tUkdCQSh7IC4uLmNvbG9yLCBhIH0pXG4gICAgfSBlbHNlIGlmIChoYXMoY29sb3IsIFsnaCcsICdzJywgJ2wnXSkpIHtcbiAgICAgIGlmIChvbGRDb2xvciAmJiBjb2xvciA9PT0gb2xkQ29sb3IuaHNsYSkgcmV0dXJuIG9sZENvbG9yXG4gICAgICBlbHNlIHJldHVybiBmcm9tSFNMQSh7IC4uLmNvbG9yLCBhIH0pXG4gICAgfSBlbHNlIGlmIChoYXMoY29sb3IsIFsnaCcsICdzJywgJ3YnXSkpIHtcbiAgICAgIGlmIChvbGRDb2xvciAmJiBjb2xvciA9PT0gb2xkQ29sb3IuaHN2YSkgcmV0dXJuIG9sZENvbG9yXG4gICAgICBlbHNlIHJldHVybiBmcm9tSFNWQSh7IC4uLmNvbG9yLCBhIH0pXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZyb21SR0JBKHsgcjogMjU1LCBnOiAwLCBiOiAwLCBhOiAxIH0pXG59XG5cbmZ1bmN0aW9uIHN0cmlwQWxwaGEgKGNvbG9yOiBhbnksIHN0cmlwQWxwaGE6IGJvb2xlYW4pIHtcbiAgaWYgKHN0cmlwQWxwaGEpIHtcbiAgICBjb25zdCB7IGEsIC4uLnJlc3QgfSA9IGNvbG9yXG5cbiAgICByZXR1cm4gcmVzdFxuICB9XG5cbiAgcmV0dXJuIGNvbG9yXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0Q29sb3IgKGNvbG9yOiBWQ29sb3JQaWNrZXJDb2xvciwgaW5wdXQ6IGFueSkge1xuICBpZiAoaW5wdXQgPT0gbnVsbCkgcmV0dXJuIGNvbG9yXG5cbiAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gaW5wdXQubGVuZ3RoID09PSA3ID8gY29sb3IuaGV4IDogY29sb3IuaGV4YVxuICB9XG5cbiAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ29iamVjdCcpIHtcbiAgICBpZiAoaGFzKGlucHV0LCBbJ3InLCAnZycsICdiJ10pKSByZXR1cm4gc3RyaXBBbHBoYShjb2xvci5yZ2JhLCAhaW5wdXQuYSlcbiAgICBlbHNlIGlmIChoYXMoaW5wdXQsIFsnaCcsICdzJywgJ2wnXSkpIHJldHVybiBzdHJpcEFscGhhKGNvbG9yLmhzbGEsICFpbnB1dC5hKVxuICAgIGVsc2UgaWYgKGhhcyhpbnB1dCwgWydoJywgJ3MnLCAndiddKSkgcmV0dXJuIHN0cmlwQWxwaGEoY29sb3IuaHN2YSwgIWlucHV0LmEpXG4gIH1cblxuICByZXR1cm4gY29sb3Jcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc0FscGhhIChjb2xvcjogYW55KSB7XG4gIGlmICghY29sb3IpIHJldHVybiBmYWxzZVxuXG4gIGlmICh0eXBlb2YgY29sb3IgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGNvbG9yLmxlbmd0aCA+IDdcbiAgfVxuXG4gIGlmICh0eXBlb2YgY29sb3IgPT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIGhhcyhjb2xvciwgWydhJ10pIHx8IGhhcyhjb2xvciwgWydhbHBoYSddKVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlXG59XG4iXX0=