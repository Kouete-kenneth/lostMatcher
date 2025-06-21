/**
 * Creates a new object composed of the picked object properties.
 * @param object The source object from which properties will be picked.
 * @param keys The keys of the properties to pick from the object.
 * @returns A new object containing only the picked properties.
 */
const pick = <T extends object, K extends keyof T>(
    object: T,
    keys: K[]
): Pick<T, K> => {
    return keys.reduce((obj, key) => {
        if (object && Object.prototype.hasOwnProperty.call(object, key)) {
            obj[key] = object[key];
        }
        return obj;
    }, {} as Pick<T, K>);
};

export default pick;
