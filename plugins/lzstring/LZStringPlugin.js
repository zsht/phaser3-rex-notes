'use strict'

import LZString from './../utils/lzstring/lz-string.min.js';
import Phaser from 'phaser';
const GetFastValue = Phaser.Utils.Objects.GetFastValue;

class LZStringPlugin {
    constructor(scene, config) {
        this.resetFromJSON(config);
    }

    /**
     * Reset status by JSON object
     * @param {object} o JSON object
     * @returns {object} this object
     */
    resetFromJSON(o) {
        this.setEncoding(GetFastValue(o, 'encoding', 0));
        return this;
    }

    /**
     * Return status in JSON object
     * @returns JSON object
     */
    toJSON() {
        return {
            encoding: this.encoding
        };
    }

    setEncoding(m) {
        if (m === undefined) {
            m = 0;
        } else if (typeof (m) === 'string') {
            m = ENCODINGMAP[m.toLowerCase()] || 0;
        }
        this.encoding = m;
    }

    compress(s) {
        var fnName = COMPRESSFNNAME[this.encoding];
        return LZString[fnName](s);
    }

    decompress(s) {
        var fnName = DECOMPRESSFNNAME[this.encoding];
        return LZString[fnName](s);
    }
}

const ENCODINGMAP = {
    none: 0,
    base64: 1,
    utf16: 2,
    uri: 3
};

const COMPRESSFNNAME = [
    'compress',
    'compressToBase64',
    'compressToUTF16',
    'compressToEncodedURIComponent'
];
const DECOMPRESSFNNAME = [
    'decompress',
    'decompressFromBase64',
    'decompressFromUTF16',
    'decompressFromEncodedURIComponent'
];

export default LZStringPlugin;