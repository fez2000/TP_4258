exports.removeSpace = text => {
    let r = "";
    if (!text) text = "";
    for (let j = 0; j < text.length; j++) {
        if (text[j] === " ") {
            r += "_";
        } else {
            r += text[j];
        }
    }

    return this.cleanUnValidSym(r);
};
exports.cleanUnValidSym = text => {
    let reg = new RegExp(/[A-Za-z0-9_-]*/);

    while (!reg.test(text)) {
        text = text.replace(/[^A-Za-z0-9_-]/, "");
    }
    return text;
};
exports.timeToString = date =>
    `_${this.removeSpace(
        process.env.APP_NAME
    )}_${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate() +
        1}_${date.getHours()}_${date.getMinutes()}_${date.getMilliseconds()}`;
