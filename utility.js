// return an array from an object
exports.makeArray = function makeArray(obj){
    var arr = [];
    for (var a in obj){
        arr.push({'site': a, 'count': obj[a] });
    }
    return arr;
}
    
// tally up the array by count.  got this from stackoverflow
exports.rank = function rank(array){
    var result = array.reduce(function(p, c){
        if (c in p) {
           p[c]++;
        } else {
            p[c]=1;
        }
        return p;
    }, {});
    return result;
}




