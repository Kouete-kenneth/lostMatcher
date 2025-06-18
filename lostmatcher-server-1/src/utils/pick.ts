/**
 * Create an object composed of the picked object properties
 * @param {Object} object - The source object from which properties will be picked
 * @param {string[]} keys - The keys of the properties to pick from the object
 * @returns {Object} - A new object containing only the picked properties
 */
const pick = <T extends object>(object: T, keys: (keyof T)[]): Partial<T> => {
    return keys.reduce((obj, key) => {
        if (object && Object.prototype.hasOwnProperty.call(object, key)) {
            obj[key] = object[key];
        }
        return obj;
    }, {} as Partial<T>);
};

export default pick;
