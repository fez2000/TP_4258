export function replaceAllBy(s, d, text) {
    let index = text.indexOf(s);
    while (index != -1) {
        text = text.replace(s, d);
        index = text.indexOf(s, index + d.length);
    }
    return text;
}

export function insertTextAtIndices(text, obj) {
    return text.replace(/./g, function(character, index) {
        return obj[index] ? obj[index] + character : character;
    });
}
export function blockHtml(positions, text) {
    let i = 0;
    let resul = "";

    if (positions.length == 0) {
        while (i < text.length) {
            if (text.codePointAt(i) > 256) {
                resul += `${text[i] + text[i + 1]}`;
                i += 2;
            } else {
                if (text[i] == "<" || text[i] == ">") {
                    resul += `<em>${text[i++]}</em>`;
                } else {
                    resul += text[i++];
                }
            }
        }
        return resul;
    }

    let position = positions[0];
    let j = 1;
    if (positions.length == 0) {
        while (i < text.length) {
            if (text.codePointAt(i) > 256) {
                resul += `<em>${text.charAt(i)}</em>`;
                i += 2;
            } else {
                if (text[i] == "<" || text[i] == ">") {
                    resul += `<em>${text[i++]}</em>`;
                } else {
                    resul += text[i++];
                }
            }
        }
        return resul;
    }
    console.log(positions);
    while (i < position.startIndex) {
        if (text.codePointAt(i) > 256) {
            resul += `<em>${text.charAt(i)}</em>`;
            i += 2;
        } else {
            if (text[i] == "<" || text[i] == ">") {
                resul += `<em>${text[i++]}</em>`;
            } else {
                resul += text[i++];
            }
        }
    }
    i = position.startIndex + position.nb;
    resul += text.substr(position.startIndex, position.nb);

    while (j++ < positions.length) {
        let position = positions[j];
        while (i < position.startIndex) {
            if (text.codePointAt(i) > 256) {
                resul += `${text[i] + text[i + 1]}`;
                i += 2;
            } else {
                if (text[i] == "<" || text[i] == ">") {
                    resul += `<em>${text[i++]}</em>`;
                } else {
                    resul += text[i++];
                }
            }
        }
        i = position.startIndex + position.nb;
        resul += text.substr(position.startIndex, position.nb);
    }
    while (i < text.length) {
        if (text.codePointAt(i) > 256) {
            resul += `${text[i] + text[i + 1]}`;
            i += 2;
        } else {
            if (text[i] == "<" || text[i] == ">") {
                resul += `<em>${text[i++]}</em>`;
            } else {
                resul += text[i++];
            }
        }
    }
    return resul;
}

export function traitement_text(text) {
    var urlMatches = [];
    let positions = [];
    urlMatches =
        text.match(
            /((?:\+|00)[17](?: |\-)?|(?:\+|00)[1-9]\d{0,2}(?: |\-)?|(?:\+|00)1\-\d{3}(?: |\-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?: |\-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |\-)[0-9]{3}(?: |\-)[0-9]{4})|([0-9]{7}))/g
        ) || [];
    urlMatches.forEach(tel => {
        const startIndex = text.indexOf(tel);
        const endIndex = startIndex + tel.length;
        const telLink = `<a href="tel:${this.replaceAllBy(
            " ",
            "-",
            tel
        )}"  rel="noopener noreferrer" class="embedded-link">`;
        const nb = telLink.length + tel.length + 4;
        positions.push({
            startIndex,
            nb
        });
        text = this.insertTextAtIndices(text, {
            [startIndex]: telLink,
            [endIndex]: "</a>"
        });
    });

    urlMatches = text.match(/\b(http|https)?:\/\/\S+/gi) || [];
    urlMatches.forEach(link => {
        const startIndex = text.indexOf(link);
        const endIndex = startIndex + link.length;
        const startLink = `<a url="${link}" target="_blank" rel="noopener noreferrer" class="embedded-link">`;
        const nb = startLink.length + link.length + 4;
        let upPosition = [];
        for (let position of positions) {
            if (positions.startIndex > startIndex) {
                positions.startIndex += nb;
            }
            upPosition.push(position);
        }

        positions.push({
            startIndex,
            nb
        });
        text = this.insertTextAtIndices(text, {
            [startIndex]: startLink,
            [endIndex]: "</a>"
        });
    });

    text = this.replaceAllBy("\n", "<br/>", text);
    return text;
}
