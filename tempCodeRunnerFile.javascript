/**
 * @param {number[]} original
 * @param {number} m
 * @param {number} n
 * @return {number[][]}
 */
var construct2DArray = function(original, m, n) {
    let twoDArray = [];
    let k = 0;
    for(let i = 0; i<m; i++){
        twoDArray.push([])
        for(let j = 0; j<n; j++){
            twoDArray[i].push(original[k++])
        }
    }
    return twoDArray;
};

console.log(construct2DArray([1,2,3,4], 2, 2))