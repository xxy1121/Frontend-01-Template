/**
 * 
 * 目前实现：
 * 十进制：识别小数、正负数
 * 识别以0b、0o、0x开头的2进制、8进制、16进制
 * 还未实现：
 * 小数转成其他进制
 */

function convertStringToNumber(string, radix) {
    if (!/\d|[+-]/.test(string[0])) return NaN;
    const table = {b: 2, o: 8, x: 16};
    let type = 10;
    if (string[0] === '0') {
        type = table[string[1]] || 10;
    }
    const hexadecimal = { a: 10, b: 11, c: 12, d: 13, e: 14, f: 15 }
    const hexadecimal_rev = { 10: 'a', 11: 'b', 12: 'c', 13: 'd', 14: 'e', 15: 'f' }
    if (type === 10) {
        const match = string.match(/^([+-])?((?:(?:0|[1-9]\d*)\.?\d*?)|\.\d+)(?:[eE]([+-]?)(\d+))?$/);
        const sign_digit = match[1];
        const digit = +match[2];
        const sign_exponent = match[3];
        const exponent = +match[4];
        if (!Number.isSafeInteger(parseInt(digit))) throw new Error('不能超出最大安全整数');
        if (radix === 10) {
            if (exponent) {
                if (!sign_exponent || sign_exponent === '+') {
                    while (exponent--) {
                        digit *= 10
                    }
                } else {
                    while (exponent--) {
                        digit /= 10
                    }
                }
            }
            return sign_digit === '+' ? +digit : -digit;
        } else {
            let integer = +String(digit).split('.')[0]; //先完成整数部分的进制转换，小数部分还没思路
            if (integer) {
                const result = []
                while (integer) {
                    result.push(integer % radix);
                    integer = parseInt(integer / radix);
                }
                return result.reverse().map(d => d > 9 ? hexadecimal_rev[d] : d).join("");
            }
        }
    } else {
        let index = 2;
        const length = string.length;
        if (length <= index) return NaN;
        let integer = 0;
        while (index < length) {
            if (/\d/.test(string[index])) {
                integer += string[index] * 1;
            } else {
                integer += hexadecimal[string[index]] * 1;
            }
            integer *= (index === length - 1 ? 1 : type);
            index++
        }
        if (radix === 10) return integer;
        if (integer) {
            const result = []
            while (integer) {
                result.push(integer % radix);
                integer = parseInt(integer / radix);
            }
            return result.reverse().map(d => d > 9 ? hexadecimal_rev[d] : d).join("");
        }
    }
    
}


// let test = '-3.14E-12';
// let test = '3.14E+12';
// let test = '+.123e-123';
// let test = '+.123e123';
// let test = '10.10';
// let test = '23';
// let test = '31.31'
// let test = '0b0011';
// let test = '0o341';
// let test = '0xaa';
// console.log(convertStringToNumber(test, 8))
