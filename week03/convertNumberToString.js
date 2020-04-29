function convertNumberToString(number, radix) {
    if (arguments.length < 2) {
        radix = 10;
    }
    var integer = Math.floor(number);
    var fractionPos = ('' + number).indexOf('.');
    var fractionLength = ('' + number).length - fractionPos - 1;
    var fraction = (number - integer).toFixed(fractionLength);
    var string = '';
    while (integer > 0) {
        string = integer % radix + string;
        integer = Math.floor(integer / radix);
    }
    if (fractionPos > -1) {
        string += '.';
        while (fractionLength > 0) {
            fraction *= radix;
            string += Math.floor(fraction % radix);
            fractionLength--;
        }
    }
    return string;
}