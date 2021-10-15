((global) => {
    const _wrap = (fn, cb) => {
        setTimeout(() => {
            cb(fn());
        }, Math.random() * 20);
    };

    const AsyncArray = function (initial) {
        if (initial && !(initial instanceof Array)) {
            throw new Error('initial value is not an array');
        }

        const a = initial ? Array.from(initial) : [];

        this.set = (index, value, cb) => _wrap(() => { a[index] = value }, cb);
        this.push = (value, cb) => _wrap(() => { a.push(value) }, cb);

        this.get = (index, cb) => _wrap(() => a[index], cb);
        this.pop = (cb) => _wrap(() => a.pop(), cb);
        this.length = (cb) => _wrap(() => a.length, cb);

        this.print = () => { console.log(a.toString()); };
    }

    const add = (a, b, cb) => _wrap(() => a + b, cb);
    const subtract = (a, b, cb) => _wrap(() => a - b, cb);
    const multiply = (a, b, cb) => _wrap(() => a * b, cb);
    const divide = (a, b, cb) => _wrap(() => a / b, cb);

    const less = (a, b, cb) => _wrap(() => a < b, cb);
    const equal = (a, b, cb) => _wrap(() => a == b, cb);
    const lessOrEqual = (a, b, cb) => _wrap(() => a <= b, cb);

    global.Homework = {
        AsyncArray,
        add,
        subtract,
        multiply,
        divide,
        less,
        equal,
        lessOrEqual,
    };

    Object.freeze(global.Homework);
})(typeof window === 'undefined' ? global : window);

const { AsyncArray, add, subtract, multiply, divide, less, equal, lessOrEqual } = Homework;

// const a = new AsyncArray([1, 2, 3]);

// a.push(4, () => {
//     console.log('добавление элемента выполнено');
//     a.print();

//     a.set(2, 999, () => {
//         console.log('присваивание элемента по индексу выполнено');
//         a.print();

//         a.get(0, (result) => {
//             console.log('получение элемента по индексу выполнено, результат', result);
//             a.print();

//             a.pop((result) => {
//                 console.log('получение последнего элемента выполнено, результат', result);
//                 a.print();

//                 a.length((result) => {
//                     console.log('получение длины массива выполнено, результат', result);
//                     a.print();
//                 });
//             });
//         });
//     });
// });

// add(5, 2, (result) => console.log('результат сложения', result));

// subtract(11, 7, (result) => console.log('результат вычитания', result));

// multiply(6, 7, (result) => console.log('результат умножения', result));

// divide(13, 7, (result) => console.log('результат деления', result));

// less(5, 3, (result) => console.log('результат операции МЕНЬШЕ', result));

// equal(1, 1, (result) => console.log('результат операции РАВНО', result));

// lessOrEqual(12, 19, (result) => console.log('результат операции МЕНЬШЕ ИЛИ РАВНО', result));

// const asyncArray = new Homework.AsyncArray([1, 2, 3, 4]);
// const reducerSum = (acc, curr, i, src, cb) => Homework.add(acc, curr, cb);

// reduce(asyncArray, reducerSum, 0, (res) => {
//     console.log(res); // 10
// });

const testArr = new AsyncArray([2, 4, 5, 3]);

async function reducer (asyncArray, fn, initialValue, cb) {
    let acc = initialValue ? initialValue : 0;
    let index = 0;
    const asyncArrayLength = await new Promise(function(resolve) {
        asyncArray.length(resolve)
    });
    let lessBool = await new Promise(function(resolve) {
        less(index, asyncArrayLength, resolve)
    });

    while (lessBool) {
        let curr = await new Promise(function(resolve) {
            asyncArray.get(index, resolve)
        });
        console.log(curr, 'CURRENT');
        acc = await new Promise(function(resolve) {
            fn(acc, curr, index, asyncArray, resolve)
        });
        console.log(acc, 'ACC');
        index = await new Promise(function(resolve) {
            add(index, 1, resolve)
        });
        lessBool = await new Promise(function(resolve) {
            // console.log(index, 'index');
            less(index, asyncArrayLength, resolve)
        });
    }
    return acc;
}

function reduce(asyncArray, fn, initialValue, cb) {
    reducer(asyncArray, fn, initialValue).then(result => cb(result));
};

const testMulty = (acc, curr, index, src, cb) => {
    multiply(acc, curr, cb);
};

const testFnSum = (acc, curr, index, src, cb) => {
    add(acc, curr, cb);
};

reduce(testArr, testMulty, 1, (res) => {
    console.log(res);
});

reduce(testArr, testFnSum, 0, (res) => {
    console.log(res);
});