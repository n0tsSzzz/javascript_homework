function makeAdder(x) {
    return (xx) => xx + x;
}

function arrayDifference(arr1, arr2) {
    let differece = []
    for (let i = 0; i < arr1.length; i++) {
        if (arr2.indexOf(arr1[i]) === -1) {
            differece.push(arr1[i]);
        }
    }
    for (let i = 0; i < arr2.length; i++) {
        if ((arr1.indexOf(arr2[i]) === -1) && (differece.indexOf(arr1[i]))) {
            differece.push(arr2[i]);
        }
    }
    return differece;
};

const arr1 = [1, 2, 3, 4, 5]
const arr2 = [2, 3, 4, 4, 5, 6]

console.log(makeAdder(1)(3));
console.log(arrayDifference(arr1, arr2));
