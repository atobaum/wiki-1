/**
 * Created by Le Reveur on 2017-10-16.
 */
import {BlockToken, InlineToken, IToken, Macro} from "../Components";
import {TOC} from "./TOC";
export class Text extends InlineToken {
    constructor(text) {
        super([text]);
    }

    render() {
        return this.params[0];
    }

    plainText() {
        return this.params[0]
    }
}

export class SelfClosingSimpleTag extends InlineToken {
    constructor(tag: string, param: string) {
        super([tag, param]);
    }

    render() {
        return `<${this.params[0]}${this.params[1] ? ' ' + this.params[1] : ''}>`;
    }

    plainText() {
        return '';
    }
}

export class SimpleTag extends InlineToken {
    constructor(tag: string, param: string, text: string) {
        super([tag, param, text]);
    }

    plainText() {
        return this.params[2];
    };

    render() {
        return `<${this.params[0]}${this.params[1] ? ' ' + this.params[1] : ''}>${this.params[2]}</${this.params[0]}>`;
    }
}

export class TagDecorator extends InlineToken {
    innerTok: IToken;

    constructor(tag: string, param: string, innerTok: IToken) {
        super([tag, param]);
        this.innerTok = innerTok;
    }

    plainText() {
        return this.innerTok.plainText();
    }

    render() {
        return `<${this.params[0]}${this.params[1] ? ' ' + this.params[1] : ''}>${this.innerTok.render()}</${this.params[0]}>`;
    }
}

export class Line extends BlockToken {
    constructor(toks) {
        super(toks);
    }

    render() {
        return this.renderContent();
    }
}

export class EmptyLine extends Macro {
    render() {
        return '';
    }

    plainText() {
        return '';
    }

}

export class Section extends BlockToken {
    private _toc: TOC;

    constructor(toks) {
        super(toks);
    }

    set toc(toc: TOC) {
        this._toc = toc;
    }

    render() {
        let indexList = this._toc.indexList;
        let formattedLevel = indexList.join('_');
        return '<h'
            + indexList.length
            + ' class="ui dividing header" id="'
            + "h_" + formattedLevel
            + '">'
            + `<a href="#rh_${formattedLevel}">${indexList.join('.')}</a> `
            + this.renderContent()
            + '</h'
            + indexList.length
            + '>';
    }
}

export class Error extends InlineToken {
    constructor(title, text) {
        super([title, text]);
    }

    render() {
        return `<div class="ui negative message"><div class="header">${this.params[0]}</div><p>${this.params[1]}</p></div>`
    }

    plainText() {
        return ''
    }
}