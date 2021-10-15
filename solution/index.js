module.exports = function (Homework) {
    const { AsyncArray, add, subtract, multiply, divide, less, equal, lessOrEqual } = Homework;

    async function reducer (asyncArray, fn, initialValue, cb) {
        let index = 0;
        let acc = initialValue ? initialValue : 0;
        const asyncArrayLength = await new Promise(resolve => asyncArray.length(resolve));
        let lessBool = await new Promise(resolve => less(index, asyncArrayLength, resolve));
    
        while (lessBool) {
            let curr = await new Promise(resolve => asyncArray.get(index, resolve));
            acc = await new Promise(resolve => {fn(acc, curr, index, asyncArray, resolve)});
            index = await new Promise(resolve => add(index, 1, resolve));
            lessBool = await new Promise(resolve => less(index, asyncArrayLength, resolve))
        }
        return acc;
    }

    return (asyncArray, fn, initialValue, cb) => {
        reducer(asyncArray, fn, initialValue).then(result => cb(result))
    }
}