function int (a, b) {
    return isNaN(a) ? b: a;
}
function dist(p1, p2) {
    if (p1 instanceof Array && p2 instanceof Array) {
        return sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
    }
}