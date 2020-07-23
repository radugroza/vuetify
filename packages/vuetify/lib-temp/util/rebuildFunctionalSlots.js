export default function rebuildFunctionalSlots(slots, h) {
    const children = [];
    for (const slot in slots) {
        if (slots.hasOwnProperty(slot)) {
            children.push(h('template', { slot }, slots[slot]));
        }
    }
    return children;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVidWlsZEZ1bmN0aW9uYWxTbG90cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL3JlYnVpbGRGdW5jdGlvbmFsU2xvdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsTUFBTSxDQUFDLE9BQU8sVUFBVSxzQkFBc0IsQ0FBRSxLQUE2QyxFQUFFLENBQWdCO0lBQzdHLE1BQU0sUUFBUSxHQUFZLEVBQUUsQ0FBQTtJQUU1QixLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssRUFBRTtRQUN4QixJQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDOUIsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtTQUNwRDtLQUNGO0lBRUQsT0FBTyxRQUFRLENBQUE7QUFDakIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENyZWF0ZUVsZW1lbnQsIFZOb2RlIH0gZnJvbSAndnVlJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZWJ1aWxkRnVuY3Rpb25hbFNsb3RzIChzbG90czogeyBba2V5OiBzdHJpbmddOiBWTm9kZVtdIHwgdW5kZWZpbmVkIH0sIGg6IENyZWF0ZUVsZW1lbnQpIHtcbiAgY29uc3QgY2hpbGRyZW46IFZOb2RlW10gPSBbXVxuXG4gIGZvciAoY29uc3Qgc2xvdCBpbiBzbG90cykge1xuICAgIGlmIChzbG90cy5oYXNPd25Qcm9wZXJ0eShzbG90KSkge1xuICAgICAgY2hpbGRyZW4ucHVzaChoKCd0ZW1wbGF0ZScsIHsgc2xvdCB9LCBzbG90c1tzbG90XSkpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNoaWxkcmVuXG59XG4iXX0=