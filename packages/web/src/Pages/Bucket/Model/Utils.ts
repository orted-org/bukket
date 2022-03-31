function compareTwoStringArrays(arr1: string[], arr2: string[]) {
    if (arr1.length !== arr2.length) return false
    let counter = 0
    for (let i = 0; i < arr1.length; i++) {
        if (arr2.includes(arr1[i])) counter++;
    }
    if (counter === arr1.length) return true
    return false
}
function getArrayByValue(arr: string[]) {
    const returnArr: string[] = []
    for (let i = 0; i < arr.length; i++) {
        returnArr.push(arr[i]);
    }
    return (returnArr)
}
export { compareTwoStringArrays, getArrayByValue }