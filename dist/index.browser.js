var __create = Object.create
var __defProp = Object.defineProperty
var __getOwnPropDesc = Object.getOwnPropertyDescriptor
var __getOwnPropNames = Object.getOwnPropertyNames
var __getProtoOf = Object.getPrototypeOf
var __hasOwnProp = Object.prototype.hasOwnProperty
var __markAsModule = (target) =>
  __defProp(target, '__esModule', { value: true })
var __require = /* @__PURE__ */ ((x) =>
  typeof require !== 'undefined'
    ? require
    : typeof Proxy !== 'undefined'
    ? new Proxy(x, {
        get: (a, b) => (typeof require !== 'undefined' ? require : a)[b],
      })
    : x)(function (x) {
  if (typeof require !== 'undefined') return require.apply(this, arguments)
  throw new Error('Dynamic require of "' + x + '" is not supported')
})
var __esm = (fn, res) =>
  function __init() {
    return fn && (res = (0, fn[Object.keys(fn)[0]])((fn = 0))), res
  }
var __commonJS = (cb, mod2) =>
  function __require2() {
    return (
      mod2 ||
        (0, cb[Object.keys(cb)[0]])((mod2 = { exports: {} }).exports, mod2),
      mod2.exports
    )
  }
var __export = (target, all4) => {
  __markAsModule(target)
  for (var name6 in all4)
    __defProp(target, name6, { get: all4[name6], enumerable: true })
}
var __reExport = (target, module2, desc) => {
  if (
    (module2 && typeof module2 === 'object') ||
    typeof module2 === 'function'
  ) {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== 'default')
        __defProp(target, key, {
          get: () => module2[key],
          enumerable:
            !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable,
        })
  }
  return target
}
var __toModule = (module2) => {
  return __reExport(
    __markAsModule(
      __defProp(
        module2 != null ? __create(__getProtoOf(module2)) : {},
        'default',
        module2 && module2.__esModule && 'default' in module2
          ? { get: () => module2.default, enumerable: true }
          : { value: module2, enumerable: true }
      )
    ),
    module2
  )
}

// node_modules/multiformats/esm/vendor/base-x.js
function base(ALPHABET, name6) {
  if (ALPHABET.length >= 255) {
    throw new TypeError('Alphabet too long')
  }
  var BASE_MAP = new Uint8Array(256)
  for (var j = 0; j < BASE_MAP.length; j++) {
    BASE_MAP[j] = 255
  }
  for (var i = 0; i < ALPHABET.length; i++) {
    var x = ALPHABET.charAt(i)
    var xc = x.charCodeAt(0)
    if (BASE_MAP[xc] !== 255) {
      throw new TypeError(x + ' is ambiguous')
    }
    BASE_MAP[xc] = i
  }
  var BASE = ALPHABET.length
  var LEADER = ALPHABET.charAt(0)
  var FACTOR = Math.log(BASE) / Math.log(256)
  var iFACTOR = Math.log(256) / Math.log(BASE)
  function encode12(source) {
    if (source instanceof Uint8Array);
    else if (ArrayBuffer.isView(source)) {
      source = new Uint8Array(
        source.buffer,
        source.byteOffset,
        source.byteLength
      )
    } else if (Array.isArray(source)) {
      source = Uint8Array.from(source)
    }
    if (!(source instanceof Uint8Array)) {
      throw new TypeError('Expected Uint8Array')
    }
    if (source.length === 0) {
      return ''
    }
    var zeroes = 0
    var length2 = 0
    var pbegin = 0
    var pend = source.length
    while (pbegin !== pend && source[pbegin] === 0) {
      pbegin++
      zeroes++
    }
    var size = ((pend - pbegin) * iFACTOR + 1) >>> 0
    var b58 = new Uint8Array(size)
    while (pbegin !== pend) {
      var carry = source[pbegin]
      var i2 = 0
      for (
        var it1 = size - 1;
        (carry !== 0 || i2 < length2) && it1 !== -1;
        it1--, i2++
      ) {
        carry += (256 * b58[it1]) >>> 0
        b58[it1] = carry % BASE >>> 0
        carry = (carry / BASE) >>> 0
      }
      if (carry !== 0) {
        throw new Error('Non-zero carry')
      }
      length2 = i2
      pbegin++
    }
    var it2 = size - length2
    while (it2 !== size && b58[it2] === 0) {
      it2++
    }
    var str = LEADER.repeat(zeroes)
    for (; it2 < size; ++it2) {
      str += ALPHABET.charAt(b58[it2])
    }
    return str
  }
  function decodeUnsafe(source) {
    if (typeof source !== 'string') {
      throw new TypeError('Expected String')
    }
    if (source.length === 0) {
      return new Uint8Array()
    }
    var psz = 0
    if (source[psz] === ' ') {
      return
    }
    var zeroes = 0
    var length2 = 0
    while (source[psz] === LEADER) {
      zeroes++
      psz++
    }
    var size = ((source.length - psz) * FACTOR + 1) >>> 0
    var b256 = new Uint8Array(size)
    while (source[psz]) {
      var carry = BASE_MAP[source.charCodeAt(psz)]
      if (carry === 255) {
        return
      }
      var i2 = 0
      for (
        var it3 = size - 1;
        (carry !== 0 || i2 < length2) && it3 !== -1;
        it3--, i2++
      ) {
        carry += (BASE * b256[it3]) >>> 0
        b256[it3] = carry % 256 >>> 0
        carry = (carry / 256) >>> 0
      }
      if (carry !== 0) {
        throw new Error('Non-zero carry')
      }
      length2 = i2
      psz++
    }
    if (source[psz] === ' ') {
      return
    }
    var it4 = size - length2
    while (it4 !== size && b256[it4] === 0) {
      it4++
    }
    var vch = new Uint8Array(zeroes + (size - it4))
    var j2 = zeroes
    while (it4 !== size) {
      vch[j2++] = b256[it4++]
    }
    return vch
  }
  function decode11(string3) {
    var buffer2 = decodeUnsafe(string3)
    if (buffer2) {
      return buffer2
    }
    throw new Error(`Non-${name6} character`)
  }
  return {
    encode: encode12,
    decodeUnsafe,
    decode: decode11,
  }
}
var src, _brrp__multiformats_scope_baseX, base_x_default
var init_base_x = __esm({
  'node_modules/multiformats/esm/vendor/base-x.js'() {
    src = base
    _brrp__multiformats_scope_baseX = src
    base_x_default = _brrp__multiformats_scope_baseX
  },
})

// node_modules/multiformats/esm/src/bytes.js
var bytes_exports = {}
__export(bytes_exports, {
  coerce: () => coerce,
  empty: () => empty,
  equals: () => equals,
  fromHex: () => fromHex,
  fromString: () => fromString,
  isBinary: () => isBinary,
  toHex: () => toHex,
  toString: () => toString,
})
var empty, toHex, fromHex, equals, coerce, isBinary, fromString, toString
var init_bytes = __esm({
  'node_modules/multiformats/esm/src/bytes.js'() {
    empty = new Uint8Array(0)
    toHex = (d) =>
      d.reduce((hex, byte) => hex + byte.toString(16).padStart(2, '0'), '')
    fromHex = (hex) => {
      const hexes = hex.match(/../g)
      return hexes ? new Uint8Array(hexes.map((b) => parseInt(b, 16))) : empty
    }
    equals = (aa, bb) => {
      if (aa === bb) return true
      if (aa.byteLength !== bb.byteLength) {
        return false
      }
      for (let ii = 0; ii < aa.byteLength; ii++) {
        if (aa[ii] !== bb[ii]) {
          return false
        }
      }
      return true
    }
    coerce = (o) => {
      if (o instanceof Uint8Array && o.constructor.name === 'Uint8Array')
        return o
      if (o instanceof ArrayBuffer) return new Uint8Array(o)
      if (ArrayBuffer.isView(o)) {
        return new Uint8Array(o.buffer, o.byteOffset, o.byteLength)
      }
      throw new Error('Unknown type, must be binary type')
    }
    isBinary = (o) => o instanceof ArrayBuffer || ArrayBuffer.isView(o)
    fromString = (str) => new TextEncoder().encode(str)
    toString = (b) => new TextDecoder().decode(b)
  },
})

// node_modules/multiformats/esm/src/bases/base.js
var Encoder,
  Decoder,
  ComposedDecoder,
  or,
  Codec,
  from,
  baseX,
  decode,
  encode,
  rfc4648
var init_base = __esm({
  'node_modules/multiformats/esm/src/bases/base.js'() {
    init_base_x()
    init_bytes()
    Encoder = class {
      constructor(name6, prefix, baseEncode) {
        this.name = name6
        this.prefix = prefix
        this.baseEncode = baseEncode
      }
      encode(bytes2) {
        if (bytes2 instanceof Uint8Array) {
          return `${this.prefix}${this.baseEncode(bytes2)}`
        } else {
          throw Error('Unknown type, must be binary type')
        }
      }
    }
    Decoder = class {
      constructor(name6, prefix, baseDecode) {
        this.name = name6
        this.prefix = prefix
        this.baseDecode = baseDecode
      }
      decode(text) {
        if (typeof text === 'string') {
          switch (text[0]) {
            case this.prefix: {
              return this.baseDecode(text.slice(1))
            }
            default: {
              throw Error(
                `Unable to decode multibase string ${JSON.stringify(text)}, ${
                  this.name
                } decoder only supports inputs prefixed with ${this.prefix}`
              )
            }
          }
        } else {
          throw Error('Can only multibase decode strings')
        }
      }
      or(decoder) {
        return or(this, decoder)
      }
    }
    ComposedDecoder = class {
      constructor(decoders) {
        this.decoders = decoders
      }
      or(decoder) {
        return or(this, decoder)
      }
      decode(input) {
        const prefix = input[0]
        const decoder = this.decoders[prefix]
        if (decoder) {
          return decoder.decode(input)
        } else {
          throw RangeError(
            `Unable to decode multibase string ${JSON.stringify(
              input
            )}, only inputs prefixed with ${Object.keys(
              this.decoders
            )} are supported`
          )
        }
      }
    }
    or = (left, right) =>
      new ComposedDecoder({
        ...(left.decoders || { [left.prefix]: left }),
        ...(right.decoders || { [right.prefix]: right }),
      })
    Codec = class {
      constructor(name6, prefix, baseEncode, baseDecode) {
        this.name = name6
        this.prefix = prefix
        this.baseEncode = baseEncode
        this.baseDecode = baseDecode
        this.encoder = new Encoder(name6, prefix, baseEncode)
        this.decoder = new Decoder(name6, prefix, baseDecode)
      }
      encode(input) {
        return this.encoder.encode(input)
      }
      decode(input) {
        return this.decoder.decode(input)
      }
    }
    from = ({ name: name6, prefix, encode: encode12, decode: decode11 }) =>
      new Codec(name6, prefix, encode12, decode11)
    baseX = ({ prefix, name: name6, alphabet }) => {
      const { encode: encode12, decode: decode11 } = base_x_default(
        alphabet,
        name6
      )
      return from({
        prefix,
        name: name6,
        encode: encode12,
        decode: (text) => coerce(decode11(text)),
      })
    }
    decode = (string3, alphabet, bitsPerChar, name6) => {
      const codes = {}
      for (let i = 0; i < alphabet.length; ++i) {
        codes[alphabet[i]] = i
      }
      let end = string3.length
      while (string3[end - 1] === '=') {
        --end
      }
      const out = new Uint8Array(((end * bitsPerChar) / 8) | 0)
      let bits = 0
      let buffer2 = 0
      let written = 0
      for (let i = 0; i < end; ++i) {
        const value = codes[string3[i]]
        if (value === void 0) {
          throw new SyntaxError(`Non-${name6} character`)
        }
        buffer2 = (buffer2 << bitsPerChar) | value
        bits += bitsPerChar
        if (bits >= 8) {
          bits -= 8
          out[written++] = 255 & (buffer2 >> bits)
        }
      }
      if (bits >= bitsPerChar || 255 & (buffer2 << (8 - bits))) {
        throw new SyntaxError('Unexpected end of data')
      }
      return out
    }
    encode = (data, alphabet, bitsPerChar) => {
      const pad = alphabet[alphabet.length - 1] === '='
      const mask = (1 << bitsPerChar) - 1
      let out = ''
      let bits = 0
      let buffer2 = 0
      for (let i = 0; i < data.length; ++i) {
        buffer2 = (buffer2 << 8) | data[i]
        bits += 8
        while (bits > bitsPerChar) {
          bits -= bitsPerChar
          out += alphabet[mask & (buffer2 >> bits)]
        }
      }
      if (bits) {
        out += alphabet[mask & (buffer2 << (bitsPerChar - bits))]
      }
      if (pad) {
        while ((out.length * bitsPerChar) & 7) {
          out += '='
        }
      }
      return out
    }
    rfc4648 = ({ name: name6, prefix, bitsPerChar, alphabet }) => {
      return from({
        prefix,
        name: name6,
        encode(input) {
          return encode(input, alphabet, bitsPerChar)
        },
        decode(input) {
          return decode(input, alphabet, bitsPerChar, name6)
        },
      })
    }
  },
})

// node_modules/multiformats/esm/src/bases/base58.js
var base58_exports = {}
__export(base58_exports, {
  base58btc: () => base58btc,
  base58flickr: () => base58flickr,
})
var base58btc, base58flickr
var init_base58 = __esm({
  'node_modules/multiformats/esm/src/bases/base58.js'() {
    init_base()
    base58btc = baseX({
      name: 'base58btc',
      prefix: 'z',
      alphabet: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
    })
    base58flickr = baseX({
      name: 'base58flickr',
      prefix: 'Z',
      alphabet: '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ',
    })
  },
})

// node_modules/varint/encode.js
var require_encode = __commonJS({
  'node_modules/varint/encode.js'(exports2, module2) {
    module2.exports = encode12
    var MSB2 = 128
    var REST2 = 127
    var MSBALL2 = ~REST2
    var INT2 = Math.pow(2, 31)
    function encode12(num, out, offset) {
      if (Number.MAX_SAFE_INTEGER && num > Number.MAX_SAFE_INTEGER) {
        encode12.bytes = 0
        throw new RangeError('Could not encode varint')
      }
      out = out || []
      offset = offset || 0
      var oldOffset = offset
      while (num >= INT2) {
        out[offset++] = (num & 255) | MSB2
        num /= 128
      }
      while (num & MSBALL2) {
        out[offset++] = (num & 255) | MSB2
        num >>>= 7
      }
      out[offset] = num | 0
      encode12.bytes = offset - oldOffset + 1
      return out
    }
  },
})

// node_modules/varint/decode.js
var require_decode = __commonJS({
  'node_modules/varint/decode.js'(exports2, module2) {
    module2.exports = read2
    var MSB2 = 128
    var REST2 = 127
    function read2(buf2, offset) {
      var res = 0,
        offset = offset || 0,
        shift = 0,
        counter = offset,
        b,
        l = buf2.length
      do {
        if (counter >= l || shift > 49) {
          read2.bytes = 0
          throw new RangeError('Could not decode varint')
        }
        b = buf2[counter++]
        res +=
          shift < 28 ? (b & REST2) << shift : (b & REST2) * Math.pow(2, shift)
        shift += 7
      } while (b >= MSB2)
      read2.bytes = counter - offset
      return res
    }
  },
})

// node_modules/varint/length.js
var require_length = __commonJS({
  'node_modules/varint/length.js'(exports2, module2) {
    var N12 = Math.pow(2, 7)
    var N22 = Math.pow(2, 14)
    var N32 = Math.pow(2, 21)
    var N42 = Math.pow(2, 28)
    var N52 = Math.pow(2, 35)
    var N62 = Math.pow(2, 42)
    var N72 = Math.pow(2, 49)
    var N82 = Math.pow(2, 56)
    var N92 = Math.pow(2, 63)
    module2.exports = function (value) {
      return value < N12
        ? 1
        : value < N22
        ? 2
        : value < N32
        ? 3
        : value < N42
        ? 4
        : value < N52
        ? 5
        : value < N62
        ? 6
        : value < N72
        ? 7
        : value < N82
        ? 8
        : value < N92
        ? 9
        : 10
    }
  },
})

// node_modules/varint/index.js
var require_varint = __commonJS({
  'node_modules/varint/index.js'(exports2, module2) {
    module2.exports = {
      encode: require_encode(),
      decode: require_decode(),
      encodingLength: require_length(),
    }
  },
})

// (disabled):crypto
var require_crypto = __commonJS({
  '(disabled):crypto'() {},
})

// node_modules/@dashkite/tweetnacl/nacl-fast.js
var require_nacl_fast = __commonJS({
  'node_modules/@dashkite/tweetnacl/nacl-fast.js'(exports2, module2) {
    ;(function (nacl2) {
      'use strict'
      var gf = function (init) {
        var i,
          r = new Float64Array(16)
        if (init) for (i = 0; i < init.length; i++) r[i] = init[i]
        return r
      }
      var randombytes = function () {
        throw new Error('no PRNG')
      }
      var _0 = new Uint8Array(16)
      var _9 = new Uint8Array(32)
      _9[0] = 9
      var gf0 = gf(),
        gf1 = gf([1]),
        _121665 = gf([56129, 1]),
        D = gf([
          30883, 4953, 19914, 30187, 55467, 16705, 2637, 112, 59544, 30585,
          16505, 36039, 65139, 11119, 27886, 20995,
        ]),
        D2 = gf([
          61785, 9906, 39828, 60374, 45398, 33411, 5274, 224, 53552, 61171,
          33010, 6542, 64743, 22239, 55772, 9222,
        ]),
        X = gf([
          54554, 36645, 11616, 51542, 42930, 38181, 51040, 26924, 56412, 64982,
          57905, 49316, 21502, 52590, 14035, 8553,
        ]),
        Y = gf([
          26200, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214,
          26214, 26214, 26214, 26214, 26214, 26214,
        ]),
        I = gf([
          41136, 18958, 6951, 50414, 58488, 44335, 6150, 12099, 55207, 15867,
          153, 11085, 57099, 20417, 9344, 11139,
        ])
      function ts64(x, i, h, l) {
        x[i] = (h >> 24) & 255
        x[i + 1] = (h >> 16) & 255
        x[i + 2] = (h >> 8) & 255
        x[i + 3] = h & 255
        x[i + 4] = (l >> 24) & 255
        x[i + 5] = (l >> 16) & 255
        x[i + 6] = (l >> 8) & 255
        x[i + 7] = l & 255
      }
      function vn(x, xi, y, yi, n) {
        var i,
          d = 0
        for (i = 0; i < n; i++) d |= x[xi + i] ^ y[yi + i]
        return (1 & ((d - 1) >>> 8)) - 1
      }
      function crypto_verify_16(x, xi, y, yi) {
        return vn(x, xi, y, yi, 16)
      }
      function crypto_verify_32(x, xi, y, yi) {
        return vn(x, xi, y, yi, 32)
      }
      function core_salsa20(o, p, k, c) {
        var j0 =
            (c[0] & 255) |
            ((c[1] & 255) << 8) |
            ((c[2] & 255) << 16) |
            ((c[3] & 255) << 24),
          j1 =
            (k[0] & 255) |
            ((k[1] & 255) << 8) |
            ((k[2] & 255) << 16) |
            ((k[3] & 255) << 24),
          j2 =
            (k[4] & 255) |
            ((k[5] & 255) << 8) |
            ((k[6] & 255) << 16) |
            ((k[7] & 255) << 24),
          j3 =
            (k[8] & 255) |
            ((k[9] & 255) << 8) |
            ((k[10] & 255) << 16) |
            ((k[11] & 255) << 24),
          j4 =
            (k[12] & 255) |
            ((k[13] & 255) << 8) |
            ((k[14] & 255) << 16) |
            ((k[15] & 255) << 24),
          j5 =
            (c[4] & 255) |
            ((c[5] & 255) << 8) |
            ((c[6] & 255) << 16) |
            ((c[7] & 255) << 24),
          j6 =
            (p[0] & 255) |
            ((p[1] & 255) << 8) |
            ((p[2] & 255) << 16) |
            ((p[3] & 255) << 24),
          j7 =
            (p[4] & 255) |
            ((p[5] & 255) << 8) |
            ((p[6] & 255) << 16) |
            ((p[7] & 255) << 24),
          j8 =
            (p[8] & 255) |
            ((p[9] & 255) << 8) |
            ((p[10] & 255) << 16) |
            ((p[11] & 255) << 24),
          j9 =
            (p[12] & 255) |
            ((p[13] & 255) << 8) |
            ((p[14] & 255) << 16) |
            ((p[15] & 255) << 24),
          j10 =
            (c[8] & 255) |
            ((c[9] & 255) << 8) |
            ((c[10] & 255) << 16) |
            ((c[11] & 255) << 24),
          j11 =
            (k[16] & 255) |
            ((k[17] & 255) << 8) |
            ((k[18] & 255) << 16) |
            ((k[19] & 255) << 24),
          j12 =
            (k[20] & 255) |
            ((k[21] & 255) << 8) |
            ((k[22] & 255) << 16) |
            ((k[23] & 255) << 24),
          j13 =
            (k[24] & 255) |
            ((k[25] & 255) << 8) |
            ((k[26] & 255) << 16) |
            ((k[27] & 255) << 24),
          j14 =
            (k[28] & 255) |
            ((k[29] & 255) << 8) |
            ((k[30] & 255) << 16) |
            ((k[31] & 255) << 24),
          j15 =
            (c[12] & 255) |
            ((c[13] & 255) << 8) |
            ((c[14] & 255) << 16) |
            ((c[15] & 255) << 24)
        var x0 = j0,
          x1 = j1,
          x2 = j2,
          x3 = j3,
          x4 = j4,
          x5 = j5,
          x6 = j6,
          x7 = j7,
          x8 = j8,
          x9 = j9,
          x10 = j10,
          x11 = j11,
          x12 = j12,
          x13 = j13,
          x14 = j14,
          x15 = j15,
          u
        for (var i = 0; i < 20; i += 2) {
          u = (x0 + x12) | 0
          x4 ^= (u << 7) | (u >>> (32 - 7))
          u = (x4 + x0) | 0
          x8 ^= (u << 9) | (u >>> (32 - 9))
          u = (x8 + x4) | 0
          x12 ^= (u << 13) | (u >>> (32 - 13))
          u = (x12 + x8) | 0
          x0 ^= (u << 18) | (u >>> (32 - 18))
          u = (x5 + x1) | 0
          x9 ^= (u << 7) | (u >>> (32 - 7))
          u = (x9 + x5) | 0
          x13 ^= (u << 9) | (u >>> (32 - 9))
          u = (x13 + x9) | 0
          x1 ^= (u << 13) | (u >>> (32 - 13))
          u = (x1 + x13) | 0
          x5 ^= (u << 18) | (u >>> (32 - 18))
          u = (x10 + x6) | 0
          x14 ^= (u << 7) | (u >>> (32 - 7))
          u = (x14 + x10) | 0
          x2 ^= (u << 9) | (u >>> (32 - 9))
          u = (x2 + x14) | 0
          x6 ^= (u << 13) | (u >>> (32 - 13))
          u = (x6 + x2) | 0
          x10 ^= (u << 18) | (u >>> (32 - 18))
          u = (x15 + x11) | 0
          x3 ^= (u << 7) | (u >>> (32 - 7))
          u = (x3 + x15) | 0
          x7 ^= (u << 9) | (u >>> (32 - 9))
          u = (x7 + x3) | 0
          x11 ^= (u << 13) | (u >>> (32 - 13))
          u = (x11 + x7) | 0
          x15 ^= (u << 18) | (u >>> (32 - 18))
          u = (x0 + x3) | 0
          x1 ^= (u << 7) | (u >>> (32 - 7))
          u = (x1 + x0) | 0
          x2 ^= (u << 9) | (u >>> (32 - 9))
          u = (x2 + x1) | 0
          x3 ^= (u << 13) | (u >>> (32 - 13))
          u = (x3 + x2) | 0
          x0 ^= (u << 18) | (u >>> (32 - 18))
          u = (x5 + x4) | 0
          x6 ^= (u << 7) | (u >>> (32 - 7))
          u = (x6 + x5) | 0
          x7 ^= (u << 9) | (u >>> (32 - 9))
          u = (x7 + x6) | 0
          x4 ^= (u << 13) | (u >>> (32 - 13))
          u = (x4 + x7) | 0
          x5 ^= (u << 18) | (u >>> (32 - 18))
          u = (x10 + x9) | 0
          x11 ^= (u << 7) | (u >>> (32 - 7))
          u = (x11 + x10) | 0
          x8 ^= (u << 9) | (u >>> (32 - 9))
          u = (x8 + x11) | 0
          x9 ^= (u << 13) | (u >>> (32 - 13))
          u = (x9 + x8) | 0
          x10 ^= (u << 18) | (u >>> (32 - 18))
          u = (x15 + x14) | 0
          x12 ^= (u << 7) | (u >>> (32 - 7))
          u = (x12 + x15) | 0
          x13 ^= (u << 9) | (u >>> (32 - 9))
          u = (x13 + x12) | 0
          x14 ^= (u << 13) | (u >>> (32 - 13))
          u = (x14 + x13) | 0
          x15 ^= (u << 18) | (u >>> (32 - 18))
        }
        x0 = (x0 + j0) | 0
        x1 = (x1 + j1) | 0
        x2 = (x2 + j2) | 0
        x3 = (x3 + j3) | 0
        x4 = (x4 + j4) | 0
        x5 = (x5 + j5) | 0
        x6 = (x6 + j6) | 0
        x7 = (x7 + j7) | 0
        x8 = (x8 + j8) | 0
        x9 = (x9 + j9) | 0
        x10 = (x10 + j10) | 0
        x11 = (x11 + j11) | 0
        x12 = (x12 + j12) | 0
        x13 = (x13 + j13) | 0
        x14 = (x14 + j14) | 0
        x15 = (x15 + j15) | 0
        o[0] = (x0 >>> 0) & 255
        o[1] = (x0 >>> 8) & 255
        o[2] = (x0 >>> 16) & 255
        o[3] = (x0 >>> 24) & 255
        o[4] = (x1 >>> 0) & 255
        o[5] = (x1 >>> 8) & 255
        o[6] = (x1 >>> 16) & 255
        o[7] = (x1 >>> 24) & 255
        o[8] = (x2 >>> 0) & 255
        o[9] = (x2 >>> 8) & 255
        o[10] = (x2 >>> 16) & 255
        o[11] = (x2 >>> 24) & 255
        o[12] = (x3 >>> 0) & 255
        o[13] = (x3 >>> 8) & 255
        o[14] = (x3 >>> 16) & 255
        o[15] = (x3 >>> 24) & 255
        o[16] = (x4 >>> 0) & 255
        o[17] = (x4 >>> 8) & 255
        o[18] = (x4 >>> 16) & 255
        o[19] = (x4 >>> 24) & 255
        o[20] = (x5 >>> 0) & 255
        o[21] = (x5 >>> 8) & 255
        o[22] = (x5 >>> 16) & 255
        o[23] = (x5 >>> 24) & 255
        o[24] = (x6 >>> 0) & 255
        o[25] = (x6 >>> 8) & 255
        o[26] = (x6 >>> 16) & 255
        o[27] = (x6 >>> 24) & 255
        o[28] = (x7 >>> 0) & 255
        o[29] = (x7 >>> 8) & 255
        o[30] = (x7 >>> 16) & 255
        o[31] = (x7 >>> 24) & 255
        o[32] = (x8 >>> 0) & 255
        o[33] = (x8 >>> 8) & 255
        o[34] = (x8 >>> 16) & 255
        o[35] = (x8 >>> 24) & 255
        o[36] = (x9 >>> 0) & 255
        o[37] = (x9 >>> 8) & 255
        o[38] = (x9 >>> 16) & 255
        o[39] = (x9 >>> 24) & 255
        o[40] = (x10 >>> 0) & 255
        o[41] = (x10 >>> 8) & 255
        o[42] = (x10 >>> 16) & 255
        o[43] = (x10 >>> 24) & 255
        o[44] = (x11 >>> 0) & 255
        o[45] = (x11 >>> 8) & 255
        o[46] = (x11 >>> 16) & 255
        o[47] = (x11 >>> 24) & 255
        o[48] = (x12 >>> 0) & 255
        o[49] = (x12 >>> 8) & 255
        o[50] = (x12 >>> 16) & 255
        o[51] = (x12 >>> 24) & 255
        o[52] = (x13 >>> 0) & 255
        o[53] = (x13 >>> 8) & 255
        o[54] = (x13 >>> 16) & 255
        o[55] = (x13 >>> 24) & 255
        o[56] = (x14 >>> 0) & 255
        o[57] = (x14 >>> 8) & 255
        o[58] = (x14 >>> 16) & 255
        o[59] = (x14 >>> 24) & 255
        o[60] = (x15 >>> 0) & 255
        o[61] = (x15 >>> 8) & 255
        o[62] = (x15 >>> 16) & 255
        o[63] = (x15 >>> 24) & 255
      }
      function core_hsalsa20(o, p, k, c) {
        var j0 =
            (c[0] & 255) |
            ((c[1] & 255) << 8) |
            ((c[2] & 255) << 16) |
            ((c[3] & 255) << 24),
          j1 =
            (k[0] & 255) |
            ((k[1] & 255) << 8) |
            ((k[2] & 255) << 16) |
            ((k[3] & 255) << 24),
          j2 =
            (k[4] & 255) |
            ((k[5] & 255) << 8) |
            ((k[6] & 255) << 16) |
            ((k[7] & 255) << 24),
          j3 =
            (k[8] & 255) |
            ((k[9] & 255) << 8) |
            ((k[10] & 255) << 16) |
            ((k[11] & 255) << 24),
          j4 =
            (k[12] & 255) |
            ((k[13] & 255) << 8) |
            ((k[14] & 255) << 16) |
            ((k[15] & 255) << 24),
          j5 =
            (c[4] & 255) |
            ((c[5] & 255) << 8) |
            ((c[6] & 255) << 16) |
            ((c[7] & 255) << 24),
          j6 =
            (p[0] & 255) |
            ((p[1] & 255) << 8) |
            ((p[2] & 255) << 16) |
            ((p[3] & 255) << 24),
          j7 =
            (p[4] & 255) |
            ((p[5] & 255) << 8) |
            ((p[6] & 255) << 16) |
            ((p[7] & 255) << 24),
          j8 =
            (p[8] & 255) |
            ((p[9] & 255) << 8) |
            ((p[10] & 255) << 16) |
            ((p[11] & 255) << 24),
          j9 =
            (p[12] & 255) |
            ((p[13] & 255) << 8) |
            ((p[14] & 255) << 16) |
            ((p[15] & 255) << 24),
          j10 =
            (c[8] & 255) |
            ((c[9] & 255) << 8) |
            ((c[10] & 255) << 16) |
            ((c[11] & 255) << 24),
          j11 =
            (k[16] & 255) |
            ((k[17] & 255) << 8) |
            ((k[18] & 255) << 16) |
            ((k[19] & 255) << 24),
          j12 =
            (k[20] & 255) |
            ((k[21] & 255) << 8) |
            ((k[22] & 255) << 16) |
            ((k[23] & 255) << 24),
          j13 =
            (k[24] & 255) |
            ((k[25] & 255) << 8) |
            ((k[26] & 255) << 16) |
            ((k[27] & 255) << 24),
          j14 =
            (k[28] & 255) |
            ((k[29] & 255) << 8) |
            ((k[30] & 255) << 16) |
            ((k[31] & 255) << 24),
          j15 =
            (c[12] & 255) |
            ((c[13] & 255) << 8) |
            ((c[14] & 255) << 16) |
            ((c[15] & 255) << 24)
        var x0 = j0,
          x1 = j1,
          x2 = j2,
          x3 = j3,
          x4 = j4,
          x5 = j5,
          x6 = j6,
          x7 = j7,
          x8 = j8,
          x9 = j9,
          x10 = j10,
          x11 = j11,
          x12 = j12,
          x13 = j13,
          x14 = j14,
          x15 = j15,
          u
        for (var i = 0; i < 20; i += 2) {
          u = (x0 + x12) | 0
          x4 ^= (u << 7) | (u >>> (32 - 7))
          u = (x4 + x0) | 0
          x8 ^= (u << 9) | (u >>> (32 - 9))
          u = (x8 + x4) | 0
          x12 ^= (u << 13) | (u >>> (32 - 13))
          u = (x12 + x8) | 0
          x0 ^= (u << 18) | (u >>> (32 - 18))
          u = (x5 + x1) | 0
          x9 ^= (u << 7) | (u >>> (32 - 7))
          u = (x9 + x5) | 0
          x13 ^= (u << 9) | (u >>> (32 - 9))
          u = (x13 + x9) | 0
          x1 ^= (u << 13) | (u >>> (32 - 13))
          u = (x1 + x13) | 0
          x5 ^= (u << 18) | (u >>> (32 - 18))
          u = (x10 + x6) | 0
          x14 ^= (u << 7) | (u >>> (32 - 7))
          u = (x14 + x10) | 0
          x2 ^= (u << 9) | (u >>> (32 - 9))
          u = (x2 + x14) | 0
          x6 ^= (u << 13) | (u >>> (32 - 13))
          u = (x6 + x2) | 0
          x10 ^= (u << 18) | (u >>> (32 - 18))
          u = (x15 + x11) | 0
          x3 ^= (u << 7) | (u >>> (32 - 7))
          u = (x3 + x15) | 0
          x7 ^= (u << 9) | (u >>> (32 - 9))
          u = (x7 + x3) | 0
          x11 ^= (u << 13) | (u >>> (32 - 13))
          u = (x11 + x7) | 0
          x15 ^= (u << 18) | (u >>> (32 - 18))
          u = (x0 + x3) | 0
          x1 ^= (u << 7) | (u >>> (32 - 7))
          u = (x1 + x0) | 0
          x2 ^= (u << 9) | (u >>> (32 - 9))
          u = (x2 + x1) | 0
          x3 ^= (u << 13) | (u >>> (32 - 13))
          u = (x3 + x2) | 0
          x0 ^= (u << 18) | (u >>> (32 - 18))
          u = (x5 + x4) | 0
          x6 ^= (u << 7) | (u >>> (32 - 7))
          u = (x6 + x5) | 0
          x7 ^= (u << 9) | (u >>> (32 - 9))
          u = (x7 + x6) | 0
          x4 ^= (u << 13) | (u >>> (32 - 13))
          u = (x4 + x7) | 0
          x5 ^= (u << 18) | (u >>> (32 - 18))
          u = (x10 + x9) | 0
          x11 ^= (u << 7) | (u >>> (32 - 7))
          u = (x11 + x10) | 0
          x8 ^= (u << 9) | (u >>> (32 - 9))
          u = (x8 + x11) | 0
          x9 ^= (u << 13) | (u >>> (32 - 13))
          u = (x9 + x8) | 0
          x10 ^= (u << 18) | (u >>> (32 - 18))
          u = (x15 + x14) | 0
          x12 ^= (u << 7) | (u >>> (32 - 7))
          u = (x12 + x15) | 0
          x13 ^= (u << 9) | (u >>> (32 - 9))
          u = (x13 + x12) | 0
          x14 ^= (u << 13) | (u >>> (32 - 13))
          u = (x14 + x13) | 0
          x15 ^= (u << 18) | (u >>> (32 - 18))
        }
        o[0] = (x0 >>> 0) & 255
        o[1] = (x0 >>> 8) & 255
        o[2] = (x0 >>> 16) & 255
        o[3] = (x0 >>> 24) & 255
        o[4] = (x5 >>> 0) & 255
        o[5] = (x5 >>> 8) & 255
        o[6] = (x5 >>> 16) & 255
        o[7] = (x5 >>> 24) & 255
        o[8] = (x10 >>> 0) & 255
        o[9] = (x10 >>> 8) & 255
        o[10] = (x10 >>> 16) & 255
        o[11] = (x10 >>> 24) & 255
        o[12] = (x15 >>> 0) & 255
        o[13] = (x15 >>> 8) & 255
        o[14] = (x15 >>> 16) & 255
        o[15] = (x15 >>> 24) & 255
        o[16] = (x6 >>> 0) & 255
        o[17] = (x6 >>> 8) & 255
        o[18] = (x6 >>> 16) & 255
        o[19] = (x6 >>> 24) & 255
        o[20] = (x7 >>> 0) & 255
        o[21] = (x7 >>> 8) & 255
        o[22] = (x7 >>> 16) & 255
        o[23] = (x7 >>> 24) & 255
        o[24] = (x8 >>> 0) & 255
        o[25] = (x8 >>> 8) & 255
        o[26] = (x8 >>> 16) & 255
        o[27] = (x8 >>> 24) & 255
        o[28] = (x9 >>> 0) & 255
        o[29] = (x9 >>> 8) & 255
        o[30] = (x9 >>> 16) & 255
        o[31] = (x9 >>> 24) & 255
      }
      function crypto_core_salsa20(out, inp, k, c) {
        core_salsa20(out, inp, k, c)
      }
      function crypto_core_hsalsa20(out, inp, k, c) {
        core_hsalsa20(out, inp, k, c)
      }
      var sigma = new Uint8Array([
        101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107,
      ])
      function crypto_stream_salsa20_xor(c, cpos, m, mpos, b, n, k) {
        var z = new Uint8Array(16),
          x = new Uint8Array(64)
        var u, i
        for (i = 0; i < 16; i++) z[i] = 0
        for (i = 0; i < 8; i++) z[i] = n[i]
        while (b >= 64) {
          crypto_core_salsa20(x, z, k, sigma)
          for (i = 0; i < 64; i++) c[cpos + i] = m[mpos + i] ^ x[i]
          u = 1
          for (i = 8; i < 16; i++) {
            u = (u + (z[i] & 255)) | 0
            z[i] = u & 255
            u >>>= 8
          }
          b -= 64
          cpos += 64
          mpos += 64
        }
        if (b > 0) {
          crypto_core_salsa20(x, z, k, sigma)
          for (i = 0; i < b; i++) c[cpos + i] = m[mpos + i] ^ x[i]
        }
        return 0
      }
      function crypto_stream_salsa20(c, cpos, b, n, k) {
        var z = new Uint8Array(16),
          x = new Uint8Array(64)
        var u, i
        for (i = 0; i < 16; i++) z[i] = 0
        for (i = 0; i < 8; i++) z[i] = n[i]
        while (b >= 64) {
          crypto_core_salsa20(x, z, k, sigma)
          for (i = 0; i < 64; i++) c[cpos + i] = x[i]
          u = 1
          for (i = 8; i < 16; i++) {
            u = (u + (z[i] & 255)) | 0
            z[i] = u & 255
            u >>>= 8
          }
          b -= 64
          cpos += 64
        }
        if (b > 0) {
          crypto_core_salsa20(x, z, k, sigma)
          for (i = 0; i < b; i++) c[cpos + i] = x[i]
        }
        return 0
      }
      function crypto_stream(c, cpos, d, n, k) {
        var s = new Uint8Array(32)
        crypto_core_hsalsa20(s, n, k, sigma)
        var sn = new Uint8Array(8)
        for (var i = 0; i < 8; i++) sn[i] = n[i + 16]
        return crypto_stream_salsa20(c, cpos, d, sn, s)
      }
      function crypto_stream_xor(c, cpos, m, mpos, d, n, k) {
        var s = new Uint8Array(32)
        crypto_core_hsalsa20(s, n, k, sigma)
        var sn = new Uint8Array(8)
        for (var i = 0; i < 8; i++) sn[i] = n[i + 16]
        return crypto_stream_salsa20_xor(c, cpos, m, mpos, d, sn, s)
      }
      var poly1305 = function (key) {
        this.buffer = new Uint8Array(16)
        this.r = new Uint16Array(10)
        this.h = new Uint16Array(10)
        this.pad = new Uint16Array(8)
        this.leftover = 0
        this.fin = 0
        var t0, t1, t2, t3, t4, t5, t6, t7
        t0 = (key[0] & 255) | ((key[1] & 255) << 8)
        this.r[0] = t0 & 8191
        t1 = (key[2] & 255) | ((key[3] & 255) << 8)
        this.r[1] = ((t0 >>> 13) | (t1 << 3)) & 8191
        t2 = (key[4] & 255) | ((key[5] & 255) << 8)
        this.r[2] = ((t1 >>> 10) | (t2 << 6)) & 7939
        t3 = (key[6] & 255) | ((key[7] & 255) << 8)
        this.r[3] = ((t2 >>> 7) | (t3 << 9)) & 8191
        t4 = (key[8] & 255) | ((key[9] & 255) << 8)
        this.r[4] = ((t3 >>> 4) | (t4 << 12)) & 255
        this.r[5] = (t4 >>> 1) & 8190
        t5 = (key[10] & 255) | ((key[11] & 255) << 8)
        this.r[6] = ((t4 >>> 14) | (t5 << 2)) & 8191
        t6 = (key[12] & 255) | ((key[13] & 255) << 8)
        this.r[7] = ((t5 >>> 11) | (t6 << 5)) & 8065
        t7 = (key[14] & 255) | ((key[15] & 255) << 8)
        this.r[8] = ((t6 >>> 8) | (t7 << 8)) & 8191
        this.r[9] = (t7 >>> 5) & 127
        this.pad[0] = (key[16] & 255) | ((key[17] & 255) << 8)
        this.pad[1] = (key[18] & 255) | ((key[19] & 255) << 8)
        this.pad[2] = (key[20] & 255) | ((key[21] & 255) << 8)
        this.pad[3] = (key[22] & 255) | ((key[23] & 255) << 8)
        this.pad[4] = (key[24] & 255) | ((key[25] & 255) << 8)
        this.pad[5] = (key[26] & 255) | ((key[27] & 255) << 8)
        this.pad[6] = (key[28] & 255) | ((key[29] & 255) << 8)
        this.pad[7] = (key[30] & 255) | ((key[31] & 255) << 8)
      }
      poly1305.prototype.blocks = function (m, mpos, bytes2) {
        var hibit = this.fin ? 0 : 1 << 11
        var t0, t1, t2, t3, t4, t5, t6, t7, c
        var d0, d1, d2, d3, d4, d5, d6, d7, d8, d9
        var h0 = this.h[0],
          h1 = this.h[1],
          h2 = this.h[2],
          h3 = this.h[3],
          h4 = this.h[4],
          h5 = this.h[5],
          h6 = this.h[6],
          h7 = this.h[7],
          h8 = this.h[8],
          h9 = this.h[9]
        var r0 = this.r[0],
          r1 = this.r[1],
          r2 = this.r[2],
          r3 = this.r[3],
          r4 = this.r[4],
          r5 = this.r[5],
          r6 = this.r[6],
          r7 = this.r[7],
          r8 = this.r[8],
          r9 = this.r[9]
        while (bytes2 >= 16) {
          t0 = (m[mpos + 0] & 255) | ((m[mpos + 1] & 255) << 8)
          h0 += t0 & 8191
          t1 = (m[mpos + 2] & 255) | ((m[mpos + 3] & 255) << 8)
          h1 += ((t0 >>> 13) | (t1 << 3)) & 8191
          t2 = (m[mpos + 4] & 255) | ((m[mpos + 5] & 255) << 8)
          h2 += ((t1 >>> 10) | (t2 << 6)) & 8191
          t3 = (m[mpos + 6] & 255) | ((m[mpos + 7] & 255) << 8)
          h3 += ((t2 >>> 7) | (t3 << 9)) & 8191
          t4 = (m[mpos + 8] & 255) | ((m[mpos + 9] & 255) << 8)
          h4 += ((t3 >>> 4) | (t4 << 12)) & 8191
          h5 += (t4 >>> 1) & 8191
          t5 = (m[mpos + 10] & 255) | ((m[mpos + 11] & 255) << 8)
          h6 += ((t4 >>> 14) | (t5 << 2)) & 8191
          t6 = (m[mpos + 12] & 255) | ((m[mpos + 13] & 255) << 8)
          h7 += ((t5 >>> 11) | (t6 << 5)) & 8191
          t7 = (m[mpos + 14] & 255) | ((m[mpos + 15] & 255) << 8)
          h8 += ((t6 >>> 8) | (t7 << 8)) & 8191
          h9 += (t7 >>> 5) | hibit
          c = 0
          d0 = c
          d0 += h0 * r0
          d0 += h1 * (5 * r9)
          d0 += h2 * (5 * r8)
          d0 += h3 * (5 * r7)
          d0 += h4 * (5 * r6)
          c = d0 >>> 13
          d0 &= 8191
          d0 += h5 * (5 * r5)
          d0 += h6 * (5 * r4)
          d0 += h7 * (5 * r3)
          d0 += h8 * (5 * r2)
          d0 += h9 * (5 * r1)
          c += d0 >>> 13
          d0 &= 8191
          d1 = c
          d1 += h0 * r1
          d1 += h1 * r0
          d1 += h2 * (5 * r9)
          d1 += h3 * (5 * r8)
          d1 += h4 * (5 * r7)
          c = d1 >>> 13
          d1 &= 8191
          d1 += h5 * (5 * r6)
          d1 += h6 * (5 * r5)
          d1 += h7 * (5 * r4)
          d1 += h8 * (5 * r3)
          d1 += h9 * (5 * r2)
          c += d1 >>> 13
          d1 &= 8191
          d2 = c
          d2 += h0 * r2
          d2 += h1 * r1
          d2 += h2 * r0
          d2 += h3 * (5 * r9)
          d2 += h4 * (5 * r8)
          c = d2 >>> 13
          d2 &= 8191
          d2 += h5 * (5 * r7)
          d2 += h6 * (5 * r6)
          d2 += h7 * (5 * r5)
          d2 += h8 * (5 * r4)
          d2 += h9 * (5 * r3)
          c += d2 >>> 13
          d2 &= 8191
          d3 = c
          d3 += h0 * r3
          d3 += h1 * r2
          d3 += h2 * r1
          d3 += h3 * r0
          d3 += h4 * (5 * r9)
          c = d3 >>> 13
          d3 &= 8191
          d3 += h5 * (5 * r8)
          d3 += h6 * (5 * r7)
          d3 += h7 * (5 * r6)
          d3 += h8 * (5 * r5)
          d3 += h9 * (5 * r4)
          c += d3 >>> 13
          d3 &= 8191
          d4 = c
          d4 += h0 * r4
          d4 += h1 * r3
          d4 += h2 * r2
          d4 += h3 * r1
          d4 += h4 * r0
          c = d4 >>> 13
          d4 &= 8191
          d4 += h5 * (5 * r9)
          d4 += h6 * (5 * r8)
          d4 += h7 * (5 * r7)
          d4 += h8 * (5 * r6)
          d4 += h9 * (5 * r5)
          c += d4 >>> 13
          d4 &= 8191
          d5 = c
          d5 += h0 * r5
          d5 += h1 * r4
          d5 += h2 * r3
          d5 += h3 * r2
          d5 += h4 * r1
          c = d5 >>> 13
          d5 &= 8191
          d5 += h5 * r0
          d5 += h6 * (5 * r9)
          d5 += h7 * (5 * r8)
          d5 += h8 * (5 * r7)
          d5 += h9 * (5 * r6)
          c += d5 >>> 13
          d5 &= 8191
          d6 = c
          d6 += h0 * r6
          d6 += h1 * r5
          d6 += h2 * r4
          d6 += h3 * r3
          d6 += h4 * r2
          c = d6 >>> 13
          d6 &= 8191
          d6 += h5 * r1
          d6 += h6 * r0
          d6 += h7 * (5 * r9)
          d6 += h8 * (5 * r8)
          d6 += h9 * (5 * r7)
          c += d6 >>> 13
          d6 &= 8191
          d7 = c
          d7 += h0 * r7
          d7 += h1 * r6
          d7 += h2 * r5
          d7 += h3 * r4
          d7 += h4 * r3
          c = d7 >>> 13
          d7 &= 8191
          d7 += h5 * r2
          d7 += h6 * r1
          d7 += h7 * r0
          d7 += h8 * (5 * r9)
          d7 += h9 * (5 * r8)
          c += d7 >>> 13
          d7 &= 8191
          d8 = c
          d8 += h0 * r8
          d8 += h1 * r7
          d8 += h2 * r6
          d8 += h3 * r5
          d8 += h4 * r4
          c = d8 >>> 13
          d8 &= 8191
          d8 += h5 * r3
          d8 += h6 * r2
          d8 += h7 * r1
          d8 += h8 * r0
          d8 += h9 * (5 * r9)
          c += d8 >>> 13
          d8 &= 8191
          d9 = c
          d9 += h0 * r9
          d9 += h1 * r8
          d9 += h2 * r7
          d9 += h3 * r6
          d9 += h4 * r5
          c = d9 >>> 13
          d9 &= 8191
          d9 += h5 * r4
          d9 += h6 * r3
          d9 += h7 * r2
          d9 += h8 * r1
          d9 += h9 * r0
          c += d9 >>> 13
          d9 &= 8191
          c = ((c << 2) + c) | 0
          c = (c + d0) | 0
          d0 = c & 8191
          c = c >>> 13
          d1 += c
          h0 = d0
          h1 = d1
          h2 = d2
          h3 = d3
          h4 = d4
          h5 = d5
          h6 = d6
          h7 = d7
          h8 = d8
          h9 = d9
          mpos += 16
          bytes2 -= 16
        }
        this.h[0] = h0
        this.h[1] = h1
        this.h[2] = h2
        this.h[3] = h3
        this.h[4] = h4
        this.h[5] = h5
        this.h[6] = h6
        this.h[7] = h7
        this.h[8] = h8
        this.h[9] = h9
      }
      poly1305.prototype.finish = function (mac, macpos) {
        var g = new Uint16Array(10)
        var c, mask, f, i
        if (this.leftover) {
          i = this.leftover
          this.buffer[i++] = 1
          for (; i < 16; i++) this.buffer[i] = 0
          this.fin = 1
          this.blocks(this.buffer, 0, 16)
        }
        c = this.h[1] >>> 13
        this.h[1] &= 8191
        for (i = 2; i < 10; i++) {
          this.h[i] += c
          c = this.h[i] >>> 13
          this.h[i] &= 8191
        }
        this.h[0] += c * 5
        c = this.h[0] >>> 13
        this.h[0] &= 8191
        this.h[1] += c
        c = this.h[1] >>> 13
        this.h[1] &= 8191
        this.h[2] += c
        g[0] = this.h[0] + 5
        c = g[0] >>> 13
        g[0] &= 8191
        for (i = 1; i < 10; i++) {
          g[i] = this.h[i] + c
          c = g[i] >>> 13
          g[i] &= 8191
        }
        g[9] -= 1 << 13
        mask = (c ^ 1) - 1
        for (i = 0; i < 10; i++) g[i] &= mask
        mask = ~mask
        for (i = 0; i < 10; i++) this.h[i] = (this.h[i] & mask) | g[i]
        this.h[0] = (this.h[0] | (this.h[1] << 13)) & 65535
        this.h[1] = ((this.h[1] >>> 3) | (this.h[2] << 10)) & 65535
        this.h[2] = ((this.h[2] >>> 6) | (this.h[3] << 7)) & 65535
        this.h[3] = ((this.h[3] >>> 9) | (this.h[4] << 4)) & 65535
        this.h[4] =
          ((this.h[4] >>> 12) | (this.h[5] << 1) | (this.h[6] << 14)) & 65535
        this.h[5] = ((this.h[6] >>> 2) | (this.h[7] << 11)) & 65535
        this.h[6] = ((this.h[7] >>> 5) | (this.h[8] << 8)) & 65535
        this.h[7] = ((this.h[8] >>> 8) | (this.h[9] << 5)) & 65535
        f = this.h[0] + this.pad[0]
        this.h[0] = f & 65535
        for (i = 1; i < 8; i++) {
          f = (((this.h[i] + this.pad[i]) | 0) + (f >>> 16)) | 0
          this.h[i] = f & 65535
        }
        mac[macpos + 0] = (this.h[0] >>> 0) & 255
        mac[macpos + 1] = (this.h[0] >>> 8) & 255
        mac[macpos + 2] = (this.h[1] >>> 0) & 255
        mac[macpos + 3] = (this.h[1] >>> 8) & 255
        mac[macpos + 4] = (this.h[2] >>> 0) & 255
        mac[macpos + 5] = (this.h[2] >>> 8) & 255
        mac[macpos + 6] = (this.h[3] >>> 0) & 255
        mac[macpos + 7] = (this.h[3] >>> 8) & 255
        mac[macpos + 8] = (this.h[4] >>> 0) & 255
        mac[macpos + 9] = (this.h[4] >>> 8) & 255
        mac[macpos + 10] = (this.h[5] >>> 0) & 255
        mac[macpos + 11] = (this.h[5] >>> 8) & 255
        mac[macpos + 12] = (this.h[6] >>> 0) & 255
        mac[macpos + 13] = (this.h[6] >>> 8) & 255
        mac[macpos + 14] = (this.h[7] >>> 0) & 255
        mac[macpos + 15] = (this.h[7] >>> 8) & 255
      }
      poly1305.prototype.update = function (m, mpos, bytes2) {
        var i, want
        if (this.leftover) {
          want = 16 - this.leftover
          if (want > bytes2) want = bytes2
          for (i = 0; i < want; i++)
            this.buffer[this.leftover + i] = m[mpos + i]
          bytes2 -= want
          mpos += want
          this.leftover += want
          if (this.leftover < 16) return
          this.blocks(this.buffer, 0, 16)
          this.leftover = 0
        }
        if (bytes2 >= 16) {
          want = bytes2 - (bytes2 % 16)
          this.blocks(m, mpos, want)
          mpos += want
          bytes2 -= want
        }
        if (bytes2) {
          for (i = 0; i < bytes2; i++)
            this.buffer[this.leftover + i] = m[mpos + i]
          this.leftover += bytes2
        }
      }
      function crypto_onetimeauth(out, outpos, m, mpos, n, k) {
        var s = new poly1305(k)
        s.update(m, mpos, n)
        s.finish(out, outpos)
        return 0
      }
      function crypto_onetimeauth_verify(h, hpos, m, mpos, n, k) {
        var x = new Uint8Array(16)
        crypto_onetimeauth(x, 0, m, mpos, n, k)
        return crypto_verify_16(h, hpos, x, 0)
      }
      function crypto_secretbox(c, m, d, n, k) {
        var i
        if (d < 32) return -1
        crypto_stream_xor(c, 0, m, 0, d, n, k)
        crypto_onetimeauth(c, 16, c, 32, d - 32, c)
        for (i = 0; i < 16; i++) c[i] = 0
        return 0
      }
      function crypto_secretbox_open(m, c, d, n, k) {
        var i
        var x = new Uint8Array(32)
        if (d < 32) return -1
        crypto_stream(x, 0, 32, n, k)
        if (crypto_onetimeauth_verify(c, 16, c, 32, d - 32, x) !== 0) return -1
        crypto_stream_xor(m, 0, c, 0, d, n, k)
        for (i = 0; i < 32; i++) m[i] = 0
        return 0
      }
      function set25519(r, a) {
        var i
        for (i = 0; i < 16; i++) r[i] = a[i] | 0
      }
      function car25519(o) {
        var i,
          v,
          c = 1
        for (i = 0; i < 16; i++) {
          v = o[i] + c + 65535
          c = Math.floor(v / 65536)
          o[i] = v - c * 65536
        }
        o[0] += c - 1 + 37 * (c - 1)
      }
      function sel25519(p, q, b) {
        var t,
          c = ~(b - 1)
        for (var i = 0; i < 16; i++) {
          t = c & (p[i] ^ q[i])
          p[i] ^= t
          q[i] ^= t
        }
      }
      function pack25519(o, n) {
        var i, j, b
        var m = gf(),
          t = gf()
        for (i = 0; i < 16; i++) t[i] = n[i]
        car25519(t)
        car25519(t)
        car25519(t)
        for (j = 0; j < 2; j++) {
          m[0] = t[0] - 65517
          for (i = 1; i < 15; i++) {
            m[i] = t[i] - 65535 - ((m[i - 1] >> 16) & 1)
            m[i - 1] &= 65535
          }
          m[15] = t[15] - 32767 - ((m[14] >> 16) & 1)
          b = (m[15] >> 16) & 1
          m[14] &= 65535
          sel25519(t, m, 1 - b)
        }
        for (i = 0; i < 16; i++) {
          o[2 * i] = t[i] & 255
          o[2 * i + 1] = t[i] >> 8
        }
      }
      function neq25519(a, b) {
        var c = new Uint8Array(32),
          d = new Uint8Array(32)
        pack25519(c, a)
        pack25519(d, b)
        return crypto_verify_32(c, 0, d, 0)
      }
      function par25519(a) {
        var d = new Uint8Array(32)
        pack25519(d, a)
        return d[0] & 1
      }
      function unpack25519(o, n) {
        var i
        for (i = 0; i < 16; i++) o[i] = n[2 * i] + (n[2 * i + 1] << 8)
        o[15] &= 32767
      }
      function A(o, a, b) {
        for (var i = 0; i < 16; i++) o[i] = a[i] + b[i]
      }
      function Z(o, a, b) {
        for (var i = 0; i < 16; i++) o[i] = a[i] - b[i]
      }
      function M(o, a, b) {
        var v,
          c,
          t0 = 0,
          t1 = 0,
          t2 = 0,
          t3 = 0,
          t4 = 0,
          t5 = 0,
          t6 = 0,
          t7 = 0,
          t8 = 0,
          t9 = 0,
          t10 = 0,
          t11 = 0,
          t12 = 0,
          t13 = 0,
          t14 = 0,
          t15 = 0,
          t16 = 0,
          t17 = 0,
          t18 = 0,
          t19 = 0,
          t20 = 0,
          t21 = 0,
          t22 = 0,
          t23 = 0,
          t24 = 0,
          t25 = 0,
          t26 = 0,
          t27 = 0,
          t28 = 0,
          t29 = 0,
          t30 = 0,
          b0 = b[0],
          b1 = b[1],
          b2 = b[2],
          b3 = b[3],
          b4 = b[4],
          b5 = b[5],
          b6 = b[6],
          b7 = b[7],
          b8 = b[8],
          b9 = b[9],
          b10 = b[10],
          b11 = b[11],
          b12 = b[12],
          b13 = b[13],
          b14 = b[14],
          b15 = b[15]
        v = a[0]
        t0 += v * b0
        t1 += v * b1
        t2 += v * b2
        t3 += v * b3
        t4 += v * b4
        t5 += v * b5
        t6 += v * b6
        t7 += v * b7
        t8 += v * b8
        t9 += v * b9
        t10 += v * b10
        t11 += v * b11
        t12 += v * b12
        t13 += v * b13
        t14 += v * b14
        t15 += v * b15
        v = a[1]
        t1 += v * b0
        t2 += v * b1
        t3 += v * b2
        t4 += v * b3
        t5 += v * b4
        t6 += v * b5
        t7 += v * b6
        t8 += v * b7
        t9 += v * b8
        t10 += v * b9
        t11 += v * b10
        t12 += v * b11
        t13 += v * b12
        t14 += v * b13
        t15 += v * b14
        t16 += v * b15
        v = a[2]
        t2 += v * b0
        t3 += v * b1
        t4 += v * b2
        t5 += v * b3
        t6 += v * b4
        t7 += v * b5
        t8 += v * b6
        t9 += v * b7
        t10 += v * b8
        t11 += v * b9
        t12 += v * b10
        t13 += v * b11
        t14 += v * b12
        t15 += v * b13
        t16 += v * b14
        t17 += v * b15
        v = a[3]
        t3 += v * b0
        t4 += v * b1
        t5 += v * b2
        t6 += v * b3
        t7 += v * b4
        t8 += v * b5
        t9 += v * b6
        t10 += v * b7
        t11 += v * b8
        t12 += v * b9
        t13 += v * b10
        t14 += v * b11
        t15 += v * b12
        t16 += v * b13
        t17 += v * b14
        t18 += v * b15
        v = a[4]
        t4 += v * b0
        t5 += v * b1
        t6 += v * b2
        t7 += v * b3
        t8 += v * b4
        t9 += v * b5
        t10 += v * b6
        t11 += v * b7
        t12 += v * b8
        t13 += v * b9
        t14 += v * b10
        t15 += v * b11
        t16 += v * b12
        t17 += v * b13
        t18 += v * b14
        t19 += v * b15
        v = a[5]
        t5 += v * b0
        t6 += v * b1
        t7 += v * b2
        t8 += v * b3
        t9 += v * b4
        t10 += v * b5
        t11 += v * b6
        t12 += v * b7
        t13 += v * b8
        t14 += v * b9
        t15 += v * b10
        t16 += v * b11
        t17 += v * b12
        t18 += v * b13
        t19 += v * b14
        t20 += v * b15
        v = a[6]
        t6 += v * b0
        t7 += v * b1
        t8 += v * b2
        t9 += v * b3
        t10 += v * b4
        t11 += v * b5
        t12 += v * b6
        t13 += v * b7
        t14 += v * b8
        t15 += v * b9
        t16 += v * b10
        t17 += v * b11
        t18 += v * b12
        t19 += v * b13
        t20 += v * b14
        t21 += v * b15
        v = a[7]
        t7 += v * b0
        t8 += v * b1
        t9 += v * b2
        t10 += v * b3
        t11 += v * b4
        t12 += v * b5
        t13 += v * b6
        t14 += v * b7
        t15 += v * b8
        t16 += v * b9
        t17 += v * b10
        t18 += v * b11
        t19 += v * b12
        t20 += v * b13
        t21 += v * b14
        t22 += v * b15
        v = a[8]
        t8 += v * b0
        t9 += v * b1
        t10 += v * b2
        t11 += v * b3
        t12 += v * b4
        t13 += v * b5
        t14 += v * b6
        t15 += v * b7
        t16 += v * b8
        t17 += v * b9
        t18 += v * b10
        t19 += v * b11
        t20 += v * b12
        t21 += v * b13
        t22 += v * b14
        t23 += v * b15
        v = a[9]
        t9 += v * b0
        t10 += v * b1
        t11 += v * b2
        t12 += v * b3
        t13 += v * b4
        t14 += v * b5
        t15 += v * b6
        t16 += v * b7
        t17 += v * b8
        t18 += v * b9
        t19 += v * b10
        t20 += v * b11
        t21 += v * b12
        t22 += v * b13
        t23 += v * b14
        t24 += v * b15
        v = a[10]
        t10 += v * b0
        t11 += v * b1
        t12 += v * b2
        t13 += v * b3
        t14 += v * b4
        t15 += v * b5
        t16 += v * b6
        t17 += v * b7
        t18 += v * b8
        t19 += v * b9
        t20 += v * b10
        t21 += v * b11
        t22 += v * b12
        t23 += v * b13
        t24 += v * b14
        t25 += v * b15
        v = a[11]
        t11 += v * b0
        t12 += v * b1
        t13 += v * b2
        t14 += v * b3
        t15 += v * b4
        t16 += v * b5
        t17 += v * b6
        t18 += v * b7
        t19 += v * b8
        t20 += v * b9
        t21 += v * b10
        t22 += v * b11
        t23 += v * b12
        t24 += v * b13
        t25 += v * b14
        t26 += v * b15
        v = a[12]
        t12 += v * b0
        t13 += v * b1
        t14 += v * b2
        t15 += v * b3
        t16 += v * b4
        t17 += v * b5
        t18 += v * b6
        t19 += v * b7
        t20 += v * b8
        t21 += v * b9
        t22 += v * b10
        t23 += v * b11
        t24 += v * b12
        t25 += v * b13
        t26 += v * b14
        t27 += v * b15
        v = a[13]
        t13 += v * b0
        t14 += v * b1
        t15 += v * b2
        t16 += v * b3
        t17 += v * b4
        t18 += v * b5
        t19 += v * b6
        t20 += v * b7
        t21 += v * b8
        t22 += v * b9
        t23 += v * b10
        t24 += v * b11
        t25 += v * b12
        t26 += v * b13
        t27 += v * b14
        t28 += v * b15
        v = a[14]
        t14 += v * b0
        t15 += v * b1
        t16 += v * b2
        t17 += v * b3
        t18 += v * b4
        t19 += v * b5
        t20 += v * b6
        t21 += v * b7
        t22 += v * b8
        t23 += v * b9
        t24 += v * b10
        t25 += v * b11
        t26 += v * b12
        t27 += v * b13
        t28 += v * b14
        t29 += v * b15
        v = a[15]
        t15 += v * b0
        t16 += v * b1
        t17 += v * b2
        t18 += v * b3
        t19 += v * b4
        t20 += v * b5
        t21 += v * b6
        t22 += v * b7
        t23 += v * b8
        t24 += v * b9
        t25 += v * b10
        t26 += v * b11
        t27 += v * b12
        t28 += v * b13
        t29 += v * b14
        t30 += v * b15
        t0 += 38 * t16
        t1 += 38 * t17
        t2 += 38 * t18
        t3 += 38 * t19
        t4 += 38 * t20
        t5 += 38 * t21
        t6 += 38 * t22
        t7 += 38 * t23
        t8 += 38 * t24
        t9 += 38 * t25
        t10 += 38 * t26
        t11 += 38 * t27
        t12 += 38 * t28
        t13 += 38 * t29
        t14 += 38 * t30
        c = 1
        v = t0 + c + 65535
        c = Math.floor(v / 65536)
        t0 = v - c * 65536
        v = t1 + c + 65535
        c = Math.floor(v / 65536)
        t1 = v - c * 65536
        v = t2 + c + 65535
        c = Math.floor(v / 65536)
        t2 = v - c * 65536
        v = t3 + c + 65535
        c = Math.floor(v / 65536)
        t3 = v - c * 65536
        v = t4 + c + 65535
        c = Math.floor(v / 65536)
        t4 = v - c * 65536
        v = t5 + c + 65535
        c = Math.floor(v / 65536)
        t5 = v - c * 65536
        v = t6 + c + 65535
        c = Math.floor(v / 65536)
        t6 = v - c * 65536
        v = t7 + c + 65535
        c = Math.floor(v / 65536)
        t7 = v - c * 65536
        v = t8 + c + 65535
        c = Math.floor(v / 65536)
        t8 = v - c * 65536
        v = t9 + c + 65535
        c = Math.floor(v / 65536)
        t9 = v - c * 65536
        v = t10 + c + 65535
        c = Math.floor(v / 65536)
        t10 = v - c * 65536
        v = t11 + c + 65535
        c = Math.floor(v / 65536)
        t11 = v - c * 65536
        v = t12 + c + 65535
        c = Math.floor(v / 65536)
        t12 = v - c * 65536
        v = t13 + c + 65535
        c = Math.floor(v / 65536)
        t13 = v - c * 65536
        v = t14 + c + 65535
        c = Math.floor(v / 65536)
        t14 = v - c * 65536
        v = t15 + c + 65535
        c = Math.floor(v / 65536)
        t15 = v - c * 65536
        t0 += c - 1 + 37 * (c - 1)
        c = 1
        v = t0 + c + 65535
        c = Math.floor(v / 65536)
        t0 = v - c * 65536
        v = t1 + c + 65535
        c = Math.floor(v / 65536)
        t1 = v - c * 65536
        v = t2 + c + 65535
        c = Math.floor(v / 65536)
        t2 = v - c * 65536
        v = t3 + c + 65535
        c = Math.floor(v / 65536)
        t3 = v - c * 65536
        v = t4 + c + 65535
        c = Math.floor(v / 65536)
        t4 = v - c * 65536
        v = t5 + c + 65535
        c = Math.floor(v / 65536)
        t5 = v - c * 65536
        v = t6 + c + 65535
        c = Math.floor(v / 65536)
        t6 = v - c * 65536
        v = t7 + c + 65535
        c = Math.floor(v / 65536)
        t7 = v - c * 65536
        v = t8 + c + 65535
        c = Math.floor(v / 65536)
        t8 = v - c * 65536
        v = t9 + c + 65535
        c = Math.floor(v / 65536)
        t9 = v - c * 65536
        v = t10 + c + 65535
        c = Math.floor(v / 65536)
        t10 = v - c * 65536
        v = t11 + c + 65535
        c = Math.floor(v / 65536)
        t11 = v - c * 65536
        v = t12 + c + 65535
        c = Math.floor(v / 65536)
        t12 = v - c * 65536
        v = t13 + c + 65535
        c = Math.floor(v / 65536)
        t13 = v - c * 65536
        v = t14 + c + 65535
        c = Math.floor(v / 65536)
        t14 = v - c * 65536
        v = t15 + c + 65535
        c = Math.floor(v / 65536)
        t15 = v - c * 65536
        t0 += c - 1 + 37 * (c - 1)
        o[0] = t0
        o[1] = t1
        o[2] = t2
        o[3] = t3
        o[4] = t4
        o[5] = t5
        o[6] = t6
        o[7] = t7
        o[8] = t8
        o[9] = t9
        o[10] = t10
        o[11] = t11
        o[12] = t12
        o[13] = t13
        o[14] = t14
        o[15] = t15
      }
      function S(o, a) {
        M(o, a, a)
      }
      function inv25519(o, i) {
        var c = gf()
        var a
        for (a = 0; a < 16; a++) c[a] = i[a]
        for (a = 253; a >= 0; a--) {
          S(c, c)
          if (a !== 2 && a !== 4) M(c, c, i)
        }
        for (a = 0; a < 16; a++) o[a] = c[a]
      }
      function pow2523(o, i) {
        var c = gf()
        var a
        for (a = 0; a < 16; a++) c[a] = i[a]
        for (a = 250; a >= 0; a--) {
          S(c, c)
          if (a !== 1) M(c, c, i)
        }
        for (a = 0; a < 16; a++) o[a] = c[a]
      }
      function crypto_scalarmult(q, n, p) {
        var z = new Uint8Array(32)
        var x = new Float64Array(80),
          r,
          i
        var a = gf(),
          b = gf(),
          c = gf(),
          d = gf(),
          e = gf(),
          f = gf()
        for (i = 0; i < 31; i++) z[i] = n[i]
        z[31] = (n[31] & 127) | 64
        z[0] &= 248
        unpack25519(x, p)
        for (i = 0; i < 16; i++) {
          b[i] = x[i]
          d[i] = a[i] = c[i] = 0
        }
        a[0] = d[0] = 1
        for (i = 254; i >= 0; --i) {
          r = (z[i >>> 3] >>> (i & 7)) & 1
          sel25519(a, b, r)
          sel25519(c, d, r)
          A(e, a, c)
          Z(a, a, c)
          A(c, b, d)
          Z(b, b, d)
          S(d, e)
          S(f, a)
          M(a, c, a)
          M(c, b, e)
          A(e, a, c)
          Z(a, a, c)
          S(b, a)
          Z(c, d, f)
          M(a, c, _121665)
          A(a, a, d)
          M(c, c, a)
          M(a, d, f)
          M(d, b, x)
          S(b, e)
          sel25519(a, b, r)
          sel25519(c, d, r)
        }
        for (i = 0; i < 16; i++) {
          x[i + 16] = a[i]
          x[i + 32] = c[i]
          x[i + 48] = b[i]
          x[i + 64] = d[i]
        }
        var x32 = x.subarray(32)
        var x16 = x.subarray(16)
        inv25519(x32, x32)
        M(x16, x16, x32)
        pack25519(q, x16)
        return 0
      }
      function crypto_scalarmult_base(q, n) {
        return crypto_scalarmult(q, n, _9)
      }
      function crypto_box_keypair(y, x) {
        randombytes(x, 32)
        return crypto_scalarmult_base(y, x)
      }
      function crypto_box_beforenm(k, y, x) {
        var s = new Uint8Array(32)
        crypto_scalarmult(s, x, y)
        return crypto_core_hsalsa20(k, _0, s, sigma)
      }
      var crypto_box_afternm = crypto_secretbox
      var crypto_box_open_afternm = crypto_secretbox_open
      function crypto_box(c, m, d, n, y, x) {
        var k = new Uint8Array(32)
        crypto_box_beforenm(k, y, x)
        return crypto_box_afternm(c, m, d, n, k)
      }
      function crypto_box_open(m, c, d, n, y, x) {
        var k = new Uint8Array(32)
        crypto_box_beforenm(k, y, x)
        return crypto_box_open_afternm(m, c, d, n, k)
      }
      var K = [
        1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399,
        3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265,
        2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394,
        310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994,
        1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317,
        3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139,
        264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901,
        1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837,
        2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879,
        3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901,
        113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964,
        773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823,
        1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142,
        2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273,
        3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344,
        3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720,
        430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593,
        883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403,
        1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012,
        2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044,
        2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573,
        3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711,
        3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554,
        174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315,
        685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100,
        1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866,
        1607167915, 987167468, 1816402316, 1246189591,
      ]
      function crypto_hashblocks_hl(hh, hl, m, n) {
        var wh = new Int32Array(16),
          wl = new Int32Array(16),
          bh0,
          bh1,
          bh2,
          bh3,
          bh4,
          bh5,
          bh6,
          bh7,
          bl0,
          bl1,
          bl2,
          bl3,
          bl4,
          bl5,
          bl6,
          bl7,
          th,
          tl,
          i,
          j,
          h,
          l,
          a,
          b,
          c,
          d
        var ah0 = hh[0],
          ah1 = hh[1],
          ah2 = hh[2],
          ah3 = hh[3],
          ah4 = hh[4],
          ah5 = hh[5],
          ah6 = hh[6],
          ah7 = hh[7],
          al0 = hl[0],
          al1 = hl[1],
          al2 = hl[2],
          al3 = hl[3],
          al4 = hl[4],
          al5 = hl[5],
          al6 = hl[6],
          al7 = hl[7]
        var pos = 0
        while (n >= 128) {
          for (i = 0; i < 16; i++) {
            j = 8 * i + pos
            wh[i] =
              (m[j + 0] << 24) | (m[j + 1] << 16) | (m[j + 2] << 8) | m[j + 3]
            wl[i] =
              (m[j + 4] << 24) | (m[j + 5] << 16) | (m[j + 6] << 8) | m[j + 7]
          }
          for (i = 0; i < 80; i++) {
            bh0 = ah0
            bh1 = ah1
            bh2 = ah2
            bh3 = ah3
            bh4 = ah4
            bh5 = ah5
            bh6 = ah6
            bh7 = ah7
            bl0 = al0
            bl1 = al1
            bl2 = al2
            bl3 = al3
            bl4 = al4
            bl5 = al5
            bl6 = al6
            bl7 = al7
            h = ah7
            l = al7
            a = l & 65535
            b = l >>> 16
            c = h & 65535
            d = h >>> 16
            h =
              ((ah4 >>> 14) | (al4 << (32 - 14))) ^
              ((ah4 >>> 18) | (al4 << (32 - 18))) ^
              ((al4 >>> (41 - 32)) | (ah4 << (32 - (41 - 32))))
            l =
              ((al4 >>> 14) | (ah4 << (32 - 14))) ^
              ((al4 >>> 18) | (ah4 << (32 - 18))) ^
              ((ah4 >>> (41 - 32)) | (al4 << (32 - (41 - 32))))
            a += l & 65535
            b += l >>> 16
            c += h & 65535
            d += h >>> 16
            h = (ah4 & ah5) ^ (~ah4 & ah6)
            l = (al4 & al5) ^ (~al4 & al6)
            a += l & 65535
            b += l >>> 16
            c += h & 65535
            d += h >>> 16
            h = K[i * 2]
            l = K[i * 2 + 1]
            a += l & 65535
            b += l >>> 16
            c += h & 65535
            d += h >>> 16
            h = wh[i % 16]
            l = wl[i % 16]
            a += l & 65535
            b += l >>> 16
            c += h & 65535
            d += h >>> 16
            b += a >>> 16
            c += b >>> 16
            d += c >>> 16
            th = (c & 65535) | (d << 16)
            tl = (a & 65535) | (b << 16)
            h = th
            l = tl
            a = l & 65535
            b = l >>> 16
            c = h & 65535
            d = h >>> 16
            h =
              ((ah0 >>> 28) | (al0 << (32 - 28))) ^
              ((al0 >>> (34 - 32)) | (ah0 << (32 - (34 - 32)))) ^
              ((al0 >>> (39 - 32)) | (ah0 << (32 - (39 - 32))))
            l =
              ((al0 >>> 28) | (ah0 << (32 - 28))) ^
              ((ah0 >>> (34 - 32)) | (al0 << (32 - (34 - 32)))) ^
              ((ah0 >>> (39 - 32)) | (al0 << (32 - (39 - 32))))
            a += l & 65535
            b += l >>> 16
            c += h & 65535
            d += h >>> 16
            h = (ah0 & ah1) ^ (ah0 & ah2) ^ (ah1 & ah2)
            l = (al0 & al1) ^ (al0 & al2) ^ (al1 & al2)
            a += l & 65535
            b += l >>> 16
            c += h & 65535
            d += h >>> 16
            b += a >>> 16
            c += b >>> 16
            d += c >>> 16
            bh7 = (c & 65535) | (d << 16)
            bl7 = (a & 65535) | (b << 16)
            h = bh3
            l = bl3
            a = l & 65535
            b = l >>> 16
            c = h & 65535
            d = h >>> 16
            h = th
            l = tl
            a += l & 65535
            b += l >>> 16
            c += h & 65535
            d += h >>> 16
            b += a >>> 16
            c += b >>> 16
            d += c >>> 16
            bh3 = (c & 65535) | (d << 16)
            bl3 = (a & 65535) | (b << 16)
            ah1 = bh0
            ah2 = bh1
            ah3 = bh2
            ah4 = bh3
            ah5 = bh4
            ah6 = bh5
            ah7 = bh6
            ah0 = bh7
            al1 = bl0
            al2 = bl1
            al3 = bl2
            al4 = bl3
            al5 = bl4
            al6 = bl5
            al7 = bl6
            al0 = bl7
            if (i % 16 === 15) {
              for (j = 0; j < 16; j++) {
                h = wh[j]
                l = wl[j]
                a = l & 65535
                b = l >>> 16
                c = h & 65535
                d = h >>> 16
                h = wh[(j + 9) % 16]
                l = wl[(j + 9) % 16]
                a += l & 65535
                b += l >>> 16
                c += h & 65535
                d += h >>> 16
                th = wh[(j + 1) % 16]
                tl = wl[(j + 1) % 16]
                h =
                  ((th >>> 1) | (tl << (32 - 1))) ^
                  ((th >>> 8) | (tl << (32 - 8))) ^
                  (th >>> 7)
                l =
                  ((tl >>> 1) | (th << (32 - 1))) ^
                  ((tl >>> 8) | (th << (32 - 8))) ^
                  ((tl >>> 7) | (th << (32 - 7)))
                a += l & 65535
                b += l >>> 16
                c += h & 65535
                d += h >>> 16
                th = wh[(j + 14) % 16]
                tl = wl[(j + 14) % 16]
                h =
                  ((th >>> 19) | (tl << (32 - 19))) ^
                  ((tl >>> (61 - 32)) | (th << (32 - (61 - 32)))) ^
                  (th >>> 6)
                l =
                  ((tl >>> 19) | (th << (32 - 19))) ^
                  ((th >>> (61 - 32)) | (tl << (32 - (61 - 32)))) ^
                  ((tl >>> 6) | (th << (32 - 6)))
                a += l & 65535
                b += l >>> 16
                c += h & 65535
                d += h >>> 16
                b += a >>> 16
                c += b >>> 16
                d += c >>> 16
                wh[j] = (c & 65535) | (d << 16)
                wl[j] = (a & 65535) | (b << 16)
              }
            }
          }
          h = ah0
          l = al0
          a = l & 65535
          b = l >>> 16
          c = h & 65535
          d = h >>> 16
          h = hh[0]
          l = hl[0]
          a += l & 65535
          b += l >>> 16
          c += h & 65535
          d += h >>> 16
          b += a >>> 16
          c += b >>> 16
          d += c >>> 16
          hh[0] = ah0 = (c & 65535) | (d << 16)
          hl[0] = al0 = (a & 65535) | (b << 16)
          h = ah1
          l = al1
          a = l & 65535
          b = l >>> 16
          c = h & 65535
          d = h >>> 16
          h = hh[1]
          l = hl[1]
          a += l & 65535
          b += l >>> 16
          c += h & 65535
          d += h >>> 16
          b += a >>> 16
          c += b >>> 16
          d += c >>> 16
          hh[1] = ah1 = (c & 65535) | (d << 16)
          hl[1] = al1 = (a & 65535) | (b << 16)
          h = ah2
          l = al2
          a = l & 65535
          b = l >>> 16
          c = h & 65535
          d = h >>> 16
          h = hh[2]
          l = hl[2]
          a += l & 65535
          b += l >>> 16
          c += h & 65535
          d += h >>> 16
          b += a >>> 16
          c += b >>> 16
          d += c >>> 16
          hh[2] = ah2 = (c & 65535) | (d << 16)
          hl[2] = al2 = (a & 65535) | (b << 16)
          h = ah3
          l = al3
          a = l & 65535
          b = l >>> 16
          c = h & 65535
          d = h >>> 16
          h = hh[3]
          l = hl[3]
          a += l & 65535
          b += l >>> 16
          c += h & 65535
          d += h >>> 16
          b += a >>> 16
          c += b >>> 16
          d += c >>> 16
          hh[3] = ah3 = (c & 65535) | (d << 16)
          hl[3] = al3 = (a & 65535) | (b << 16)
          h = ah4
          l = al4
          a = l & 65535
          b = l >>> 16
          c = h & 65535
          d = h >>> 16
          h = hh[4]
          l = hl[4]
          a += l & 65535
          b += l >>> 16
          c += h & 65535
          d += h >>> 16
          b += a >>> 16
          c += b >>> 16
          d += c >>> 16
          hh[4] = ah4 = (c & 65535) | (d << 16)
          hl[4] = al4 = (a & 65535) | (b << 16)
          h = ah5
          l = al5
          a = l & 65535
          b = l >>> 16
          c = h & 65535
          d = h >>> 16
          h = hh[5]
          l = hl[5]
          a += l & 65535
          b += l >>> 16
          c += h & 65535
          d += h >>> 16
          b += a >>> 16
          c += b >>> 16
          d += c >>> 16
          hh[5] = ah5 = (c & 65535) | (d << 16)
          hl[5] = al5 = (a & 65535) | (b << 16)
          h = ah6
          l = al6
          a = l & 65535
          b = l >>> 16
          c = h & 65535
          d = h >>> 16
          h = hh[6]
          l = hl[6]
          a += l & 65535
          b += l >>> 16
          c += h & 65535
          d += h >>> 16
          b += a >>> 16
          c += b >>> 16
          d += c >>> 16
          hh[6] = ah6 = (c & 65535) | (d << 16)
          hl[6] = al6 = (a & 65535) | (b << 16)
          h = ah7
          l = al7
          a = l & 65535
          b = l >>> 16
          c = h & 65535
          d = h >>> 16
          h = hh[7]
          l = hl[7]
          a += l & 65535
          b += l >>> 16
          c += h & 65535
          d += h >>> 16
          b += a >>> 16
          c += b >>> 16
          d += c >>> 16
          hh[7] = ah7 = (c & 65535) | (d << 16)
          hl[7] = al7 = (a & 65535) | (b << 16)
          pos += 128
          n -= 128
        }
        return n
      }
      function crypto_hash(out, m, n) {
        var hh = new Int32Array(8),
          hl = new Int32Array(8),
          x = new Uint8Array(256),
          i,
          b = n
        hh[0] = 1779033703
        hh[1] = 3144134277
        hh[2] = 1013904242
        hh[3] = 2773480762
        hh[4] = 1359893119
        hh[5] = 2600822924
        hh[6] = 528734635
        hh[7] = 1541459225
        hl[0] = 4089235720
        hl[1] = 2227873595
        hl[2] = 4271175723
        hl[3] = 1595750129
        hl[4] = 2917565137
        hl[5] = 725511199
        hl[6] = 4215389547
        hl[7] = 327033209
        crypto_hashblocks_hl(hh, hl, m, n)
        n %= 128
        for (i = 0; i < n; i++) x[i] = m[b - n + i]
        x[n] = 128
        n = 256 - 128 * (n < 112 ? 1 : 0)
        x[n - 9] = 0
        ts64(x, n - 8, (b / 536870912) | 0, b << 3)
        crypto_hashblocks_hl(hh, hl, x, n)
        for (i = 0; i < 8; i++) ts64(out, 8 * i, hh[i], hl[i])
        return 0
      }
      function add(p, q) {
        var a = gf(),
          b = gf(),
          c = gf(),
          d = gf(),
          e = gf(),
          f = gf(),
          g = gf(),
          h = gf(),
          t = gf()
        Z(a, p[1], p[0])
        Z(t, q[1], q[0])
        M(a, a, t)
        A(b, p[0], p[1])
        A(t, q[0], q[1])
        M(b, b, t)
        M(c, p[3], q[3])
        M(c, c, D2)
        M(d, p[2], q[2])
        A(d, d, d)
        Z(e, b, a)
        Z(f, d, c)
        A(g, d, c)
        A(h, b, a)
        M(p[0], e, f)
        M(p[1], h, g)
        M(p[2], g, f)
        M(p[3], e, h)
      }
      function cswap(p, q, b) {
        var i
        for (i = 0; i < 4; i++) {
          sel25519(p[i], q[i], b)
        }
      }
      function pack2(r, p) {
        var tx = gf(),
          ty = gf(),
          zi = gf()
        inv25519(zi, p[2])
        M(tx, p[0], zi)
        M(ty, p[1], zi)
        pack25519(r, ty)
        r[31] ^= par25519(tx) << 7
      }
      function scalarmult(p, q, s) {
        var b, i
        set25519(p[0], gf0)
        set25519(p[1], gf1)
        set25519(p[2], gf1)
        set25519(p[3], gf0)
        for (i = 255; i >= 0; --i) {
          b = (s[(i / 8) | 0] >> (i & 7)) & 1
          cswap(p, q, b)
          add(q, p)
          add(p, p)
          cswap(p, q, b)
        }
      }
      function scalarbase(p, s) {
        var q = [gf(), gf(), gf(), gf()]
        set25519(q[0], X)
        set25519(q[1], Y)
        set25519(q[2], gf1)
        M(q[3], X, Y)
        scalarmult(p, q, s)
      }
      function crypto_sign_keypair(pk, sk, seeded) {
        var d = new Uint8Array(64)
        var p = [gf(), gf(), gf(), gf()]
        var i
        if (!seeded) randombytes(sk, 32)
        crypto_hash(d, sk, 32)
        d[0] &= 248
        d[31] &= 127
        d[31] |= 64
        scalarbase(p, d)
        pack2(pk, p)
        for (i = 0; i < 32; i++) sk[i + 32] = pk[i]
        return 0
      }
      var L = new Float64Array([
        237, 211, 245, 92, 26, 99, 18, 88, 214, 156, 247, 162, 222, 249, 222,
        20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16,
      ])
      function modL(r, x) {
        var carry, i, j, k
        for (i = 63; i >= 32; --i) {
          carry = 0
          for (j = i - 32, k = i - 12; j < k; ++j) {
            x[j] += carry - 16 * x[i] * L[j - (i - 32)]
            carry = Math.floor((x[j] + 128) / 256)
            x[j] -= carry * 256
          }
          x[j] += carry
          x[i] = 0
        }
        carry = 0
        for (j = 0; j < 32; j++) {
          x[j] += carry - (x[31] >> 4) * L[j]
          carry = x[j] >> 8
          x[j] &= 255
        }
        for (j = 0; j < 32; j++) x[j] -= carry * L[j]
        for (i = 0; i < 32; i++) {
          x[i + 1] += x[i] >> 8
          r[i] = x[i] & 255
        }
      }
      function reduce2(r) {
        var x = new Float64Array(64),
          i
        for (i = 0; i < 64; i++) x[i] = r[i]
        for (i = 0; i < 64; i++) r[i] = 0
        modL(r, x)
      }
      function crypto_sign(sm, m, n, sk) {
        var d = new Uint8Array(64),
          h = new Uint8Array(64),
          r = new Uint8Array(64)
        var i,
          j,
          x = new Float64Array(64)
        var p = [gf(), gf(), gf(), gf()]
        crypto_hash(d, sk, 32)
        d[0] &= 248
        d[31] &= 127
        d[31] |= 64
        var smlen = n + 64
        for (i = 0; i < n; i++) sm[64 + i] = m[i]
        for (i = 0; i < 32; i++) sm[32 + i] = d[32 + i]
        crypto_hash(r, sm.subarray(32), n + 32)
        reduce2(r)
        scalarbase(p, r)
        pack2(sm, p)
        for (i = 32; i < 64; i++) sm[i] = sk[i]
        crypto_hash(h, sm, n + 64)
        reduce2(h)
        for (i = 0; i < 64; i++) x[i] = 0
        for (i = 0; i < 32; i++) x[i] = r[i]
        for (i = 0; i < 32; i++) {
          for (j = 0; j < 32; j++) {
            x[i + j] += h[i] * d[j]
          }
        }
        modL(sm.subarray(32), x)
        return smlen
      }
      function unpackneg(r, p) {
        var t = gf(),
          chk = gf(),
          num = gf(),
          den = gf(),
          den2 = gf(),
          den4 = gf(),
          den6 = gf()
        set25519(r[2], gf1)
        unpack25519(r[1], p)
        S(num, r[1])
        M(den, num, D)
        Z(num, num, r[2])
        A(den, r[2], den)
        S(den2, den)
        S(den4, den2)
        M(den6, den4, den2)
        M(t, den6, num)
        M(t, t, den)
        pow2523(t, t)
        M(t, t, num)
        M(t, t, den)
        M(t, t, den)
        M(r[0], t, den)
        S(chk, r[0])
        M(chk, chk, den)
        if (neq25519(chk, num)) M(r[0], r[0], I)
        S(chk, r[0])
        M(chk, chk, den)
        if (neq25519(chk, num)) return -1
        if (par25519(r[0]) === p[31] >> 7) Z(r[0], gf0, r[0])
        M(r[3], r[0], r[1])
        return 0
      }
      function crypto_sign_open(m, sm, n, pk) {
        var i
        var t = new Uint8Array(32),
          h = new Uint8Array(64)
        var p = [gf(), gf(), gf(), gf()],
          q = [gf(), gf(), gf(), gf()]
        if (n < 64) return -1
        if (unpackneg(q, pk)) return -1
        for (i = 0; i < n; i++) m[i] = sm[i]
        for (i = 0; i < 32; i++) m[i + 32] = pk[i]
        crypto_hash(h, m, n)
        reduce2(h)
        scalarmult(p, q, h)
        scalarbase(q, sm.subarray(32))
        add(p, q)
        pack2(t, p)
        n -= 64
        if (crypto_verify_32(sm, 0, t, 0)) {
          for (i = 0; i < n; i++) m[i] = 0
          return -1
        }
        for (i = 0; i < n; i++) m[i] = sm[i + 64]
        return n
      }
      var crypto_secretbox_KEYBYTES = 32,
        crypto_secretbox_NONCEBYTES = 24,
        crypto_secretbox_ZEROBYTES = 32,
        crypto_secretbox_BOXZEROBYTES = 16,
        crypto_scalarmult_BYTES = 32,
        crypto_scalarmult_SCALARBYTES = 32,
        crypto_box_PUBLICKEYBYTES = 32,
        crypto_box_SECRETKEYBYTES = 32,
        crypto_box_BEFORENMBYTES = 32,
        crypto_box_NONCEBYTES = crypto_secretbox_NONCEBYTES,
        crypto_box_ZEROBYTES = crypto_secretbox_ZEROBYTES,
        crypto_box_BOXZEROBYTES = crypto_secretbox_BOXZEROBYTES,
        crypto_sign_BYTES = 64,
        crypto_sign_PUBLICKEYBYTES = 32,
        crypto_sign_SECRETKEYBYTES = 64,
        crypto_sign_SEEDBYTES = 32,
        crypto_hash_BYTES = 64
      nacl2.lowlevel = {
        crypto_core_hsalsa20,
        crypto_stream_xor,
        crypto_stream,
        crypto_stream_salsa20_xor,
        crypto_stream_salsa20,
        crypto_onetimeauth,
        crypto_onetimeauth_verify,
        crypto_verify_16,
        crypto_verify_32,
        crypto_secretbox,
        crypto_secretbox_open,
        crypto_scalarmult,
        crypto_scalarmult_base,
        crypto_box_beforenm,
        crypto_box_afternm,
        crypto_box,
        crypto_box_open,
        crypto_box_keypair,
        crypto_hash,
        crypto_sign,
        crypto_sign_keypair,
        crypto_sign_open,
        crypto_secretbox_KEYBYTES,
        crypto_secretbox_NONCEBYTES,
        crypto_secretbox_ZEROBYTES,
        crypto_secretbox_BOXZEROBYTES,
        crypto_scalarmult_BYTES,
        crypto_scalarmult_SCALARBYTES,
        crypto_box_PUBLICKEYBYTES,
        crypto_box_SECRETKEYBYTES,
        crypto_box_BEFORENMBYTES,
        crypto_box_NONCEBYTES,
        crypto_box_ZEROBYTES,
        crypto_box_BOXZEROBYTES,
        crypto_sign_BYTES,
        crypto_sign_PUBLICKEYBYTES,
        crypto_sign_SECRETKEYBYTES,
        crypto_sign_SEEDBYTES,
        crypto_hash_BYTES,
        gf,
        D,
        L,
        pack25519,
        unpack25519,
        M,
        A,
        S,
        Z,
        pow2523,
        add,
        set25519,
        modL,
        scalarmult,
        scalarbase,
      }
      function checkLengths(k, n) {
        if (k.length !== crypto_secretbox_KEYBYTES)
          throw new Error('bad key size')
        if (n.length !== crypto_secretbox_NONCEBYTES)
          throw new Error('bad nonce size')
      }
      function checkBoxLengths(pk, sk) {
        if (pk.length !== crypto_box_PUBLICKEYBYTES)
          throw new Error('bad public key size')
        if (sk.length !== crypto_box_SECRETKEYBYTES)
          throw new Error('bad secret key size')
      }
      function checkArrayTypes() {
        for (var i = 0; i < arguments.length; i++) {
          if (!(arguments[i] instanceof Uint8Array))
            throw new TypeError('unexpected type, use Uint8Array')
        }
      }
      function cleanup(arr) {
        for (var i = 0; i < arr.length; i++) arr[i] = 0
      }
      nacl2.randomBytes = function (n) {
        var b = new Uint8Array(n)
        randombytes(b, n)
        return b
      }
      nacl2.secretbox = function (msg, nonce, key) {
        checkArrayTypes(msg, nonce, key)
        checkLengths(key, nonce)
        var m = new Uint8Array(crypto_secretbox_ZEROBYTES + msg.length)
        var c = new Uint8Array(m.length)
        for (var i = 0; i < msg.length; i++)
          m[i + crypto_secretbox_ZEROBYTES] = msg[i]
        crypto_secretbox(c, m, m.length, nonce, key)
        return c.subarray(crypto_secretbox_BOXZEROBYTES)
      }
      nacl2.secretbox.open = function (box, nonce, key) {
        checkArrayTypes(box, nonce, key)
        checkLengths(key, nonce)
        var c = new Uint8Array(crypto_secretbox_BOXZEROBYTES + box.length)
        var m = new Uint8Array(c.length)
        for (var i = 0; i < box.length; i++)
          c[i + crypto_secretbox_BOXZEROBYTES] = box[i]
        if (c.length < 32) return null
        if (crypto_secretbox_open(m, c, c.length, nonce, key) !== 0) return null
        return m.subarray(crypto_secretbox_ZEROBYTES)
      }
      nacl2.secretbox.keyLength = crypto_secretbox_KEYBYTES
      nacl2.secretbox.nonceLength = crypto_secretbox_NONCEBYTES
      nacl2.secretbox.overheadLength = crypto_secretbox_BOXZEROBYTES
      nacl2.scalarMult = function (n, p) {
        checkArrayTypes(n, p)
        if (n.length !== crypto_scalarmult_SCALARBYTES)
          throw new Error('bad n size')
        if (p.length !== crypto_scalarmult_BYTES) throw new Error('bad p size')
        var q = new Uint8Array(crypto_scalarmult_BYTES)
        crypto_scalarmult(q, n, p)
        return q
      }
      nacl2.scalarMult.base = function (n) {
        checkArrayTypes(n)
        if (n.length !== crypto_scalarmult_SCALARBYTES)
          throw new Error('bad n size')
        var q = new Uint8Array(crypto_scalarmult_BYTES)
        crypto_scalarmult_base(q, n)
        return q
      }
      nacl2.scalarMult.scalarLength = crypto_scalarmult_SCALARBYTES
      nacl2.scalarMult.groupElementLength = crypto_scalarmult_BYTES
      nacl2.box = function (msg, nonce, publicKey, secretKey) {
        var k = nacl2.box.before(publicKey, secretKey)
        return nacl2.secretbox(msg, nonce, k)
      }
      nacl2.box.before = function (publicKey, secretKey) {
        checkArrayTypes(publicKey, secretKey)
        checkBoxLengths(publicKey, secretKey)
        var k = new Uint8Array(crypto_box_BEFORENMBYTES)
        crypto_box_beforenm(k, publicKey, secretKey)
        return k
      }
      nacl2.box.after = nacl2.secretbox
      nacl2.box.open = function (msg, nonce, publicKey, secretKey) {
        var k = nacl2.box.before(publicKey, secretKey)
        return nacl2.secretbox.open(msg, nonce, k)
      }
      nacl2.box.open.after = nacl2.secretbox.open
      nacl2.box.keyPair = function () {
        var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES)
        var sk = new Uint8Array(crypto_box_SECRETKEYBYTES)
        crypto_box_keypair(pk, sk)
        return { publicKey: pk, secretKey: sk }
      }
      nacl2.box.keyPair.fromSecretKey = function (secretKey) {
        checkArrayTypes(secretKey)
        if (secretKey.length !== crypto_box_SECRETKEYBYTES)
          throw new Error('bad secret key size')
        var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES)
        crypto_scalarmult_base(pk, secretKey)
        return { publicKey: pk, secretKey: new Uint8Array(secretKey) }
      }
      nacl2.box.publicKeyLength = crypto_box_PUBLICKEYBYTES
      nacl2.box.secretKeyLength = crypto_box_SECRETKEYBYTES
      nacl2.box.sharedKeyLength = crypto_box_BEFORENMBYTES
      nacl2.box.nonceLength = crypto_box_NONCEBYTES
      nacl2.box.overheadLength = nacl2.secretbox.overheadLength
      nacl2.sign = function (msg, secretKey) {
        checkArrayTypes(msg, secretKey)
        if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
          throw new Error('bad secret key size')
        var signedMsg = new Uint8Array(crypto_sign_BYTES + msg.length)
        crypto_sign(signedMsg, msg, msg.length, secretKey)
        return signedMsg
      }
      nacl2.sign.open = function (signedMsg, publicKey) {
        checkArrayTypes(signedMsg, publicKey)
        if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
          throw new Error('bad public key size')
        var tmp = new Uint8Array(signedMsg.length)
        var mlen = crypto_sign_open(tmp, signedMsg, signedMsg.length, publicKey)
        if (mlen < 0) return null
        var m = new Uint8Array(mlen)
        for (var i = 0; i < m.length; i++) m[i] = tmp[i]
        return m
      }
      nacl2.sign.detached = function (msg, secretKey) {
        var signedMsg = nacl2.sign(msg, secretKey)
        var sig = new Uint8Array(crypto_sign_BYTES)
        for (var i = 0; i < sig.length; i++) sig[i] = signedMsg[i]
        return sig
      }
      nacl2.sign.detached.verify = function (msg, sig, publicKey) {
        checkArrayTypes(msg, sig, publicKey)
        if (sig.length !== crypto_sign_BYTES)
          throw new Error('bad signature size')
        if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
          throw new Error('bad public key size')
        var sm = new Uint8Array(crypto_sign_BYTES + msg.length)
        var m = new Uint8Array(crypto_sign_BYTES + msg.length)
        var i
        for (i = 0; i < crypto_sign_BYTES; i++) sm[i] = sig[i]
        for (i = 0; i < msg.length; i++) sm[i + crypto_sign_BYTES] = msg[i]
        return crypto_sign_open(m, sm, sm.length, publicKey) >= 0
      }
      nacl2.sign.keyPair = function () {
        var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES)
        var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES)
        crypto_sign_keypair(pk, sk)
        return { publicKey: pk, secretKey: sk }
      }
      nacl2.sign.keyPair.fromSecretKey = function (secretKey) {
        checkArrayTypes(secretKey)
        if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
          throw new Error('bad secret key size')
        var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES)
        for (var i = 0; i < pk.length; i++) pk[i] = secretKey[32 + i]
        return { publicKey: pk, secretKey: new Uint8Array(secretKey) }
      }
      nacl2.sign.keyPair.fromSeed = function (seed) {
        checkArrayTypes(seed)
        if (seed.length !== crypto_sign_SEEDBYTES)
          throw new Error('bad seed size')
        var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES)
        var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES)
        for (var i = 0; i < 32; i++) sk[i] = seed[i]
        crypto_sign_keypair(pk, sk, true)
        return { publicKey: pk, secretKey: sk }
      }
      nacl2.sign.publicKeyLength = crypto_sign_PUBLICKEYBYTES
      nacl2.sign.secretKeyLength = crypto_sign_SECRETKEYBYTES
      nacl2.sign.seedLength = crypto_sign_SEEDBYTES
      nacl2.sign.signatureLength = crypto_sign_BYTES
      nacl2.hash = function (msg) {
        checkArrayTypes(msg)
        var h = new Uint8Array(crypto_hash_BYTES)
        crypto_hash(h, msg, msg.length)
        return h
      }
      nacl2.hash.hashLength = crypto_hash_BYTES
      nacl2.verify = function (x, y) {
        checkArrayTypes(x, y)
        if (x.length === 0 || y.length === 0) return false
        if (x.length !== y.length) return false
        return vn(x, 0, y, 0, x.length) === 0 ? true : false
      }
      nacl2.setPRNG = function (fn) {
        randombytes = fn
      }
      ;(function () {
        var crypto2 =
          typeof self !== 'undefined' ? self.crypto || self.msCrypto : null
        if (crypto2 && crypto2.getRandomValues) {
          var QUOTA = 65536
          nacl2.setPRNG(function (x, n) {
            var i,
              v = new Uint8Array(n)
            for (i = 0; i < n; i += QUOTA) {
              crypto2.getRandomValues(v.subarray(i, i + Math.min(n - i, QUOTA)))
            }
            for (i = 0; i < n; i++) x[i] = v[i]
            cleanup(v)
          })
        } else if (typeof __require !== 'undefined') {
          crypto2 = require_crypto()
          if (crypto2 && crypto2.randomBytes) {
            nacl2.setPRNG(function (x, n) {
              var i,
                v = crypto2.randomBytes(n)
              for (i = 0; i < n; i++) x[i] = v[i]
              cleanup(v)
            })
          }
        }
      })()
    })(
      typeof module2 !== 'undefined' && module2.exports
        ? module2.exports
        : (self.nacl = self.nacl || {})
    )
  },
})

// node_modules/retry/lib/retry_operation.js
var require_retry_operation = __commonJS({
  'node_modules/retry/lib/retry_operation.js'(exports2, module2) {
    function RetryOperation(timeouts, options) {
      if (typeof options === 'boolean') {
        options = { forever: options }
      }
      this._originalTimeouts = JSON.parse(JSON.stringify(timeouts))
      this._timeouts = timeouts
      this._options = options || {}
      this._maxRetryTime = (options && options.maxRetryTime) || Infinity
      this._fn = null
      this._errors = []
      this._attempts = 1
      this._operationTimeout = null
      this._operationTimeoutCb = null
      this._timeout = null
      this._operationStart = null
      this._timer = null
      if (this._options.forever) {
        this._cachedTimeouts = this._timeouts.slice(0)
      }
    }
    module2.exports = RetryOperation
    RetryOperation.prototype.reset = function () {
      this._attempts = 1
      this._timeouts = this._originalTimeouts.slice(0)
    }
    RetryOperation.prototype.stop = function () {
      if (this._timeout) {
        clearTimeout(this._timeout)
      }
      if (this._timer) {
        clearTimeout(this._timer)
      }
      this._timeouts = []
      this._cachedTimeouts = null
    }
    RetryOperation.prototype.retry = function (err) {
      if (this._timeout) {
        clearTimeout(this._timeout)
      }
      if (!err) {
        return false
      }
      var currentTime = new Date().getTime()
      if (err && currentTime - this._operationStart >= this._maxRetryTime) {
        this._errors.push(err)
        this._errors.unshift(new Error('RetryOperation timeout occurred'))
        return false
      }
      this._errors.push(err)
      var timeout = this._timeouts.shift()
      if (timeout === void 0) {
        if (this._cachedTimeouts) {
          this._errors.splice(0, this._errors.length - 1)
          timeout = this._cachedTimeouts.slice(-1)
        } else {
          return false
        }
      }
      var self2 = this
      this._timer = setTimeout(function () {
        self2._attempts++
        if (self2._operationTimeoutCb) {
          self2._timeout = setTimeout(function () {
            self2._operationTimeoutCb(self2._attempts)
          }, self2._operationTimeout)
          if (self2._options.unref) {
            self2._timeout.unref()
          }
        }
        self2._fn(self2._attempts)
      }, timeout)
      if (this._options.unref) {
        this._timer.unref()
      }
      return true
    }
    RetryOperation.prototype.attempt = function (fn, timeoutOps) {
      this._fn = fn
      if (timeoutOps) {
        if (timeoutOps.timeout) {
          this._operationTimeout = timeoutOps.timeout
        }
        if (timeoutOps.cb) {
          this._operationTimeoutCb = timeoutOps.cb
        }
      }
      var self2 = this
      if (this._operationTimeoutCb) {
        this._timeout = setTimeout(function () {
          self2._operationTimeoutCb()
        }, self2._operationTimeout)
      }
      this._operationStart = new Date().getTime()
      this._fn(this._attempts)
    }
    RetryOperation.prototype.try = function (fn) {
      console.log('Using RetryOperation.try() is deprecated')
      this.attempt(fn)
    }
    RetryOperation.prototype.start = function (fn) {
      console.log('Using RetryOperation.start() is deprecated')
      this.attempt(fn)
    }
    RetryOperation.prototype.start = RetryOperation.prototype.try
    RetryOperation.prototype.errors = function () {
      return this._errors
    }
    RetryOperation.prototype.attempts = function () {
      return this._attempts
    }
    RetryOperation.prototype.mainError = function () {
      if (this._errors.length === 0) {
        return null
      }
      var counts = {}
      var mainError = null
      var mainErrorCount = 0
      for (var i = 0; i < this._errors.length; i++) {
        var error = this._errors[i]
        var message = error.message
        var count = (counts[message] || 0) + 1
        counts[message] = count
        if (count >= mainErrorCount) {
          mainError = error
          mainErrorCount = count
        }
      }
      return mainError
    }
  },
})

// node_modules/retry/lib/retry.js
var require_retry = __commonJS({
  'node_modules/retry/lib/retry.js'(exports2) {
    var RetryOperation = require_retry_operation()
    exports2.operation = function (options) {
      var timeouts = exports2.timeouts(options)
      return new RetryOperation(timeouts, {
        forever: options && (options.forever || options.retries === Infinity),
        unref: options && options.unref,
        maxRetryTime: options && options.maxRetryTime,
      })
    }
    exports2.timeouts = function (options) {
      if (options instanceof Array) {
        return [].concat(options)
      }
      var opts = {
        retries: 10,
        factor: 2,
        minTimeout: 1 * 1e3,
        maxTimeout: Infinity,
        randomize: false,
      }
      for (var key in options) {
        opts[key] = options[key]
      }
      if (opts.minTimeout > opts.maxTimeout) {
        throw new Error('minTimeout is greater than maxTimeout')
      }
      var timeouts = []
      for (var i = 0; i < opts.retries; i++) {
        timeouts.push(this.createTimeout(i, opts))
      }
      if (options && options.forever && !timeouts.length) {
        timeouts.push(this.createTimeout(i, opts))
      }
      timeouts.sort(function (a, b) {
        return a - b
      })
      return timeouts
    }
    exports2.createTimeout = function (attempt, opts) {
      var random = opts.randomize ? Math.random() + 1 : 1
      var timeout = Math.round(
        random * Math.max(opts.minTimeout, 1) * Math.pow(opts.factor, attempt)
      )
      timeout = Math.min(timeout, opts.maxTimeout)
      return timeout
    }
    exports2.wrap = function (obj, options, methods) {
      if (options instanceof Array) {
        methods = options
        options = null
      }
      if (!methods) {
        methods = []
        for (var key in obj) {
          if (typeof obj[key] === 'function') {
            methods.push(key)
          }
        }
      }
      for (var i = 0; i < methods.length; i++) {
        var method = methods[i]
        var original = obj[method]
        obj[method] = function retryWrapper(original2) {
          var op = exports2.operation(options)
          var args = Array.prototype.slice.call(arguments, 1)
          var callback = args.pop()
          args.push(function (err) {
            if (op.retry(err)) {
              return
            }
            if (err) {
              arguments[0] = op.mainError()
            }
            callback.apply(this, arguments)
          })
          op.attempt(function () {
            original2.apply(obj, args)
          })
        }.bind(obj, original)
        obj[method].options = options
      }
    }
  },
})

// node_modules/retry/index.js
var require_retry2 = __commonJS({
  'node_modules/retry/index.js'(exports2, module2) {
    module2.exports = require_retry()
  },
})

// node_modules/nft.storage/node_modules/p-retry/index.js
var require_p_retry = __commonJS({
  'node_modules/nft.storage/node_modules/p-retry/index.js'(exports2, module2) {
    'use strict'
    var retry = require_retry2()
    var networkErrorMsgs = [
      'Failed to fetch',
      'NetworkError when attempting to fetch resource.',
      'The Internet connection appears to be offline.',
      'Network request failed',
    ]
    var AbortError2 = class extends Error {
      constructor(message) {
        super()
        if (message instanceof Error) {
          this.originalError = message
          ;({ message } = message)
        } else {
          this.originalError = new Error(message)
          this.originalError.stack = this.stack
        }
        this.name = 'AbortError'
        this.message = message
      }
    }
    var decorateErrorWithCounts = (error, attemptNumber, options) => {
      const retriesLeft = options.retries - (attemptNumber - 1)
      error.attemptNumber = attemptNumber
      error.retriesLeft = retriesLeft
      return error
    }
    var isNetworkError = (errorMessage) =>
      networkErrorMsgs.includes(errorMessage)
    var pRetry2 = (input, options) =>
      new Promise((resolve, reject) => {
        options = {
          onFailedAttempt: () => {},
          retries: 10,
          ...options,
        }
        const operation = retry.operation(options)
        operation.attempt(async (attemptNumber) => {
          try {
            resolve(await input(attemptNumber))
          } catch (error) {
            if (!(error instanceof Error)) {
              reject(
                new TypeError(
                  `Non-error was thrown: "${error}". You should only throw errors.`
                )
              )
              return
            }
            if (error instanceof AbortError2) {
              operation.stop()
              reject(error.originalError)
            } else if (
              error instanceof TypeError &&
              !isNetworkError(error.message)
            ) {
              operation.stop()
              reject(error)
            } else {
              decorateErrorWithCounts(error, attemptNumber, options)
              try {
                await options.onFailedAttempt(error)
              } catch (error2) {
                reject(error2)
                return
              }
              if (!operation.retry(error)) {
                reject(operation.mainError())
              }
            }
          }
        })
      })
    module2.exports = pRetry2
    module2.exports.default = pRetry2
    module2.exports.AbortError = AbortError2
  },
})

// node_modules/multiformats/esm/vendor/varint.js
function encode3(num, out, offset) {
  out = out || []
  offset = offset || 0
  var oldOffset = offset
  while (num >= INT) {
    out[offset++] = (num & 255) | MSB
    num /= 128
  }
  while (num & MSBALL) {
    out[offset++] = (num & 255) | MSB
    num >>>= 7
  }
  out[offset] = num | 0
  encode3.bytes = offset - oldOffset + 1
  return out
}
function read(buf2, offset) {
  var res = 0,
    offset = offset || 0,
    shift = 0,
    counter = offset,
    b,
    l = buf2.length
  do {
    if (counter >= l) {
      read.bytes = 0
      throw new RangeError('Could not decode varint')
    }
    b = buf2[counter++]
    res +=
      shift < 28 ? (b & REST$1) << shift : (b & REST$1) * Math.pow(2, shift)
    shift += 7
  } while (b >= MSB$1)
  read.bytes = counter - offset
  return res
}
var encode_1,
  MSB,
  REST,
  MSBALL,
  INT,
  decode2,
  MSB$1,
  REST$1,
  N1,
  N2,
  N3,
  N4,
  N5,
  N6,
  N7,
  N8,
  N9,
  length,
  varint2,
  _brrp_varint,
  varint_default
var init_varint = __esm({
  'node_modules/multiformats/esm/vendor/varint.js'() {
    encode_1 = encode3
    MSB = 128
    REST = 127
    MSBALL = ~REST
    INT = Math.pow(2, 31)
    decode2 = read
    MSB$1 = 128
    REST$1 = 127
    N1 = Math.pow(2, 7)
    N2 = Math.pow(2, 14)
    N3 = Math.pow(2, 21)
    N4 = Math.pow(2, 28)
    N5 = Math.pow(2, 35)
    N6 = Math.pow(2, 42)
    N7 = Math.pow(2, 49)
    N8 = Math.pow(2, 56)
    N9 = Math.pow(2, 63)
    length = function (value) {
      return value < N1
        ? 1
        : value < N2
        ? 2
        : value < N3
        ? 3
        : value < N4
        ? 4
        : value < N5
        ? 5
        : value < N6
        ? 6
        : value < N7
        ? 7
        : value < N8
        ? 8
        : value < N9
        ? 9
        : 10
    }
    varint2 = {
      encode: encode_1,
      decode: decode2,
      encodingLength: length,
    }
    _brrp_varint = varint2
    varint_default = _brrp_varint
  },
})

// node_modules/multiformats/esm/src/varint.js
var decode3, encodeTo, encodingLength
var init_varint2 = __esm({
  'node_modules/multiformats/esm/src/varint.js'() {
    init_varint()
    decode3 = (data) => {
      const code6 = varint_default.decode(data)
      return [code6, varint_default.decode.bytes]
    }
    encodeTo = (int, target, offset = 0) => {
      varint_default.encode(int, target, offset)
      return target
    }
    encodingLength = (int) => {
      return varint_default.encodingLength(int)
    }
  },
})

// node_modules/multiformats/esm/src/hashes/digest.js
var create, decode4, equals2, Digest
var init_digest = __esm({
  'node_modules/multiformats/esm/src/hashes/digest.js'() {
    init_bytes()
    init_varint2()
    create = (code6, digest2) => {
      const size = digest2.byteLength
      const sizeOffset = encodingLength(code6)
      const digestOffset = sizeOffset + encodingLength(size)
      const bytes2 = new Uint8Array(digestOffset + size)
      encodeTo(code6, bytes2, 0)
      encodeTo(size, bytes2, sizeOffset)
      bytes2.set(digest2, digestOffset)
      return new Digest(code6, size, digest2, bytes2)
    }
    decode4 = (multihash) => {
      const bytes2 = coerce(multihash)
      const [code6, sizeOffset] = decode3(bytes2)
      const [size, digestOffset] = decode3(bytes2.subarray(sizeOffset))
      const digest2 = bytes2.subarray(sizeOffset + digestOffset)
      if (digest2.byteLength !== size) {
        throw new Error('Incorrect length')
      }
      return new Digest(code6, size, digest2, bytes2)
    }
    equals2 = (a, b) => {
      if (a === b) {
        return true
      } else {
        return (
          a.code === b.code && a.size === b.size && equals(a.bytes, b.bytes)
        )
      }
    }
    Digest = class {
      constructor(code6, size, digest2, bytes2) {
        this.code = code6
        this.size = size
        this.digest = digest2
        this.bytes = bytes2
      }
    }
  },
})

// node_modules/multiformats/esm/src/bases/base32.js
var base32_exports = {}
__export(base32_exports, {
  base32: () => base32,
  base32hex: () => base32hex,
  base32hexpad: () => base32hexpad,
  base32hexpadupper: () => base32hexpadupper,
  base32hexupper: () => base32hexupper,
  base32pad: () => base32pad,
  base32padupper: () => base32padupper,
  base32upper: () => base32upper,
  base32z: () => base32z,
})
var base32,
  base32upper,
  base32pad,
  base32padupper,
  base32hex,
  base32hexupper,
  base32hexpad,
  base32hexpadupper,
  base32z
var init_base32 = __esm({
  'node_modules/multiformats/esm/src/bases/base32.js'() {
    init_base()
    base32 = rfc4648({
      prefix: 'b',
      name: 'base32',
      alphabet: 'abcdefghijklmnopqrstuvwxyz234567',
      bitsPerChar: 5,
    })
    base32upper = rfc4648({
      prefix: 'B',
      name: 'base32upper',
      alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
      bitsPerChar: 5,
    })
    base32pad = rfc4648({
      prefix: 'c',
      name: 'base32pad',
      alphabet: 'abcdefghijklmnopqrstuvwxyz234567=',
      bitsPerChar: 5,
    })
    base32padupper = rfc4648({
      prefix: 'C',
      name: 'base32padupper',
      alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=',
      bitsPerChar: 5,
    })
    base32hex = rfc4648({
      prefix: 'v',
      name: 'base32hex',
      alphabet: '0123456789abcdefghijklmnopqrstuv',
      bitsPerChar: 5,
    })
    base32hexupper = rfc4648({
      prefix: 'V',
      name: 'base32hexupper',
      alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUV',
      bitsPerChar: 5,
    })
    base32hexpad = rfc4648({
      prefix: 't',
      name: 'base32hexpad',
      alphabet: '0123456789abcdefghijklmnopqrstuv=',
      bitsPerChar: 5,
    })
    base32hexpadupper = rfc4648({
      prefix: 'T',
      name: 'base32hexpadupper',
      alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUV=',
      bitsPerChar: 5,
    })
    base32z = rfc4648({
      prefix: 'h',
      name: 'base32z',
      alphabet: 'ybndrfg8ejkmcpqxot1uwisza345h769',
      bitsPerChar: 5,
    })
  },
})

// node_modules/multiformats/esm/src/cid.js
var CID,
  parseCIDtoBytes,
  toStringV0,
  toStringV1,
  DAG_PB_CODE,
  SHA_256_CODE,
  encodeCID,
  cidSymbol,
  readonly,
  hidden,
  version,
  deprecate,
  IS_CID_DEPRECATION
var init_cid = __esm({
  'node_modules/multiformats/esm/src/cid.js'() {
    init_varint2()
    init_digest()
    init_base58()
    init_base32()
    init_bytes()
    CID = class {
      constructor(version2, code6, multihash, bytes2) {
        this.code = code6
        this.version = version2
        this.multihash = multihash
        this.bytes = bytes2
        this.byteOffset = bytes2.byteOffset
        this.byteLength = bytes2.byteLength
        this.asCID = this
        this._baseCache = new Map()
        Object.defineProperties(this, {
          byteOffset: hidden,
          byteLength: hidden,
          code: readonly,
          version: readonly,
          multihash: readonly,
          bytes: readonly,
          _baseCache: hidden,
          asCID: hidden,
        })
      }
      toV0() {
        switch (this.version) {
          case 0: {
            return this
          }
          default: {
            const { code: code6, multihash } = this
            if (code6 !== DAG_PB_CODE) {
              throw new Error('Cannot convert a non dag-pb CID to CIDv0')
            }
            if (multihash.code !== SHA_256_CODE) {
              throw new Error(
                'Cannot convert non sha2-256 multihash CID to CIDv0'
              )
            }
            return CID.createV0(multihash)
          }
        }
      }
      toV1() {
        switch (this.version) {
          case 0: {
            const { code: code6, digest: digest2 } = this.multihash
            const multihash = create(code6, digest2)
            return CID.createV1(this.code, multihash)
          }
          case 1: {
            return this
          }
          default: {
            throw Error(
              `Can not convert CID version ${this.version} to version 0. This is a bug please report`
            )
          }
        }
      }
      equals(other) {
        return (
          other &&
          this.code === other.code &&
          this.version === other.version &&
          equals2(this.multihash, other.multihash)
        )
      }
      toString(base3) {
        const { bytes: bytes2, version: version2, _baseCache } = this
        switch (version2) {
          case 0:
            return toStringV0(bytes2, _baseCache, base3 || base58btc.encoder)
          default:
            return toStringV1(bytes2, _baseCache, base3 || base32.encoder)
        }
      }
      toJSON() {
        return {
          code: this.code,
          version: this.version,
          hash: this.multihash.bytes,
        }
      }
      get [Symbol.toStringTag]() {
        return 'CID'
      }
      [Symbol.for('nodejs.util.inspect.custom')]() {
        return 'CID(' + this.toString() + ')'
      }
      static isCID(value) {
        deprecate(/^0\.0/, IS_CID_DEPRECATION)
        return !!(value && (value[cidSymbol] || value.asCID === value))
      }
      get toBaseEncodedString() {
        throw new Error('Deprecated, use .toString()')
      }
      get codec() {
        throw new Error(
          '"codec" property is deprecated, use integer "code" property instead'
        )
      }
      get buffer() {
        throw new Error(
          'Deprecated .buffer property, use .bytes to get Uint8Array instead'
        )
      }
      get multibaseName() {
        throw new Error('"multibaseName" property is deprecated')
      }
      get prefix() {
        throw new Error('"prefix" property is deprecated')
      }
      static asCID(value) {
        if (value instanceof CID) {
          return value
        } else if (value != null && value.asCID === value) {
          const {
            version: version2,
            code: code6,
            multihash,
            bytes: bytes2,
          } = value
          return new CID(
            version2,
            code6,
            multihash,
            bytes2 || encodeCID(version2, code6, multihash.bytes)
          )
        } else if (value != null && value[cidSymbol] === true) {
          const { version: version2, multihash, code: code6 } = value
          const digest2 = decode4(multihash)
          return CID.create(version2, code6, digest2)
        } else {
          return null
        }
      }
      static create(version2, code6, digest2) {
        if (typeof code6 !== 'number') {
          throw new Error('String codecs are no longer supported')
        }
        switch (version2) {
          case 0: {
            if (code6 !== DAG_PB_CODE) {
              throw new Error(
                `Version 0 CID must use dag-pb (code: ${DAG_PB_CODE}) block encoding`
              )
            } else {
              return new CID(version2, code6, digest2, digest2.bytes)
            }
          }
          case 1: {
            const bytes2 = encodeCID(version2, code6, digest2.bytes)
            return new CID(version2, code6, digest2, bytes2)
          }
          default: {
            throw new Error('Invalid version')
          }
        }
      }
      static createV0(digest2) {
        return CID.create(0, DAG_PB_CODE, digest2)
      }
      static createV1(code6, digest2) {
        return CID.create(1, code6, digest2)
      }
      static decode(bytes2) {
        const [cid, remainder] = CID.decodeFirst(bytes2)
        if (remainder.length) {
          throw new Error('Incorrect length')
        }
        return cid
      }
      static decodeFirst(bytes2) {
        const specs = CID.inspectBytes(bytes2)
        const prefixSize = specs.size - specs.multihashSize
        const multihashBytes = coerce(
          bytes2.subarray(prefixSize, prefixSize + specs.multihashSize)
        )
        if (multihashBytes.byteLength !== specs.multihashSize) {
          throw new Error('Incorrect length')
        }
        const digestBytes = multihashBytes.subarray(
          specs.multihashSize - specs.digestSize
        )
        const digest2 = new Digest(
          specs.multihashCode,
          specs.digestSize,
          digestBytes,
          multihashBytes
        )
        const cid =
          specs.version === 0
            ? CID.createV0(digest2)
            : CID.createV1(specs.codec, digest2)
        return [cid, bytes2.subarray(specs.size)]
      }
      static inspectBytes(initialBytes) {
        let offset = 0
        const next = () => {
          const [i, length2] = decode3(initialBytes.subarray(offset))
          offset += length2
          return i
        }
        let version2 = next()
        let codec = DAG_PB_CODE
        if (version2 === 18) {
          version2 = 0
          offset = 0
        } else if (version2 === 1) {
          codec = next()
        }
        if (version2 !== 0 && version2 !== 1) {
          throw new RangeError(`Invalid CID version ${version2}`)
        }
        const prefixSize = offset
        const multihashCode = next()
        const digestSize = next()
        const size = offset + digestSize
        const multihashSize = size - prefixSize
        return {
          version: version2,
          codec,
          multihashCode,
          digestSize,
          multihashSize,
          size,
        }
      }
      static parse(source, base3) {
        const [prefix, bytes2] = parseCIDtoBytes(source, base3)
        const cid = CID.decode(bytes2)
        cid._baseCache.set(prefix, source)
        return cid
      }
    }
    parseCIDtoBytes = (source, base3) => {
      switch (source[0]) {
        case 'Q': {
          const decoder = base3 || base58btc
          return [
            base58btc.prefix,
            decoder.decode(`${base58btc.prefix}${source}`),
          ]
        }
        case base58btc.prefix: {
          const decoder = base3 || base58btc
          return [base58btc.prefix, decoder.decode(source)]
        }
        case base32.prefix: {
          const decoder = base3 || base32
          return [base32.prefix, decoder.decode(source)]
        }
        default: {
          if (base3 == null) {
            throw Error(
              'To parse non base32 or base58btc encoded CID multibase decoder must be provided'
            )
          }
          return [source[0], base3.decode(source)]
        }
      }
    }
    toStringV0 = (bytes2, cache, base3) => {
      const { prefix } = base3
      if (prefix !== base58btc.prefix) {
        throw Error(`Cannot string encode V0 in ${base3.name} encoding`)
      }
      const cid = cache.get(prefix)
      if (cid == null) {
        const cid2 = base3.encode(bytes2).slice(1)
        cache.set(prefix, cid2)
        return cid2
      } else {
        return cid
      }
    }
    toStringV1 = (bytes2, cache, base3) => {
      const { prefix } = base3
      const cid = cache.get(prefix)
      if (cid == null) {
        const cid2 = base3.encode(bytes2)
        cache.set(prefix, cid2)
        return cid2
      } else {
        return cid
      }
    }
    DAG_PB_CODE = 112
    SHA_256_CODE = 18
    encodeCID = (version2, code6, multihash) => {
      const codeOffset = encodingLength(version2)
      const hashOffset = codeOffset + encodingLength(code6)
      const bytes2 = new Uint8Array(hashOffset + multihash.byteLength)
      encodeTo(version2, bytes2, 0)
      encodeTo(code6, bytes2, codeOffset)
      bytes2.set(multihash, hashOffset)
      return bytes2
    }
    cidSymbol = Symbol.for('@ipld/js-cid/CID')
    readonly = {
      writable: false,
      configurable: false,
      enumerable: true,
    }
    hidden = {
      writable: false,
      enumerable: false,
      configurable: false,
    }
    version = '0.0.0-dev'
    deprecate = (range, message) => {
      if (range.test(version)) {
        console.warn(message)
      } else {
        throw new Error(message)
      }
    }
    IS_CID_DEPRECATION = `CID.isCID(v) is deprecated and will be removed in the next major release.
Following code pattern:

if (CID.isCID(value)) {
  doSomethingWithCID(value)
}

Is replaced with:

const cid = CID.asCID(value)
if (cid) {
  // Make sure to use cid instead of value
  doSomethingWithCID(cid)
}
`
  },
})

// node_modules/multiformats/esm/src/hashes/hasher.js
var from2, Hasher
var init_hasher = __esm({
  'node_modules/multiformats/esm/src/hashes/hasher.js'() {
    init_digest()
    from2 = ({ name: name6, code: code6, encode: encode12 }) =>
      new Hasher(name6, code6, encode12)
    Hasher = class {
      constructor(name6, code6, encode12) {
        this.name = name6
        this.code = code6
        this.encode = encode12
      }
      digest(input) {
        if (input instanceof Uint8Array) {
          const result = this.encode(input)
          return result instanceof Uint8Array
            ? create(this.code, result)
            : result.then((digest2) => create(this.code, digest2))
        } else {
          throw Error('Unknown type, must be binary type')
        }
      }
    }
  },
})

// node_modules/multiformats/esm/src/index.js
var init_src = __esm({
  'node_modules/multiformats/esm/src/index.js'() {
    init_cid()
    init_varint2()
    init_bytes()
    init_hasher()
    init_digest()
  },
})

// node_modules/multiformats/esm/src/codecs/raw.js
var raw_exports = {}
__export(raw_exports, {
  code: () => code,
  decode: () => decode7,
  encode: () => encode7,
  name: () => name,
})
var name, code, encode7, decode7
var init_raw = __esm({
  'node_modules/multiformats/esm/src/codecs/raw.js'() {
    init_bytes()
    name = 'raw'
    code = 85
    encode7 = (node) => coerce(node)
    decode7 = (data) => coerce(data)
  },
})

// node_modules/it-last/index.js
var require_it_last = __commonJS({
  'node_modules/it-last/index.js'(exports2, module2) {
    'use strict'
    var last2 = async (source) => {
      let res
      for await (const entry of source) {
        res = entry
      }
      return res
    }
    module2.exports = last2
  },
})

// node_modules/it-pipe/index.js
var require_it_pipe = __commonJS({
  'node_modules/it-pipe/index.js'(exports2, module2) {
    var rawPipe = (...fns) => {
      let res
      while (fns.length) {
        res = fns.shift()(res)
      }
      return res
    }
    var isIterable2 = (obj) =>
      obj &&
      (typeof obj[Symbol.asyncIterator] === 'function' ||
        typeof obj[Symbol.iterator] === 'function' ||
        typeof obj.next === 'function')
    var isDuplex = (obj) =>
      obj && typeof obj.sink === 'function' && isIterable2(obj.source)
    var duplexPipelineFn = (duplex) => (source) => {
      duplex.sink(source)
      return duplex.source
    }
    var pipe2 = (...fns) => {
      if (isDuplex(fns[0])) {
        const duplex = fns[0]
        fns[0] = () => duplex.source
      } else if (isIterable2(fns[0])) {
        const source = fns[0]
        fns[0] = () => source
      }
      if (fns.length > 1) {
        if (isDuplex(fns[fns.length - 1])) {
          fns[fns.length - 1] = fns[fns.length - 1].sink
        }
      }
      if (fns.length > 2) {
        for (let i = 1; i < fns.length - 1; i++) {
          if (isDuplex(fns[i])) {
            fns[i] = duplexPipelineFn(fns[i])
          }
        }
      }
      return rawPipe(...fns)
    }
    module2.exports = pipe2
    module2.exports.pipe = pipe2
    module2.exports.rawPipe = rawPipe
    module2.exports.isIterable = isIterable2
    module2.exports.isDuplex = isDuplex
  },
})

// node_modules/it-batch/index.js
var require_it_batch = __commonJS({
  'node_modules/it-batch/index.js'(exports2, module2) {
    'use strict'
    async function* batch3(source, size = 1) {
      let things = []
      if (size < 1) {
        size = 1
      }
      for await (const thing of source) {
        things.push(thing)
        while (things.length >= size) {
          yield things.slice(0, size)
          things = things.slice(size)
        }
      }
      while (things.length) {
        yield things.slice(0, size)
        things = things.slice(size)
      }
    }
    module2.exports = batch3
  },
})

// node_modules/it-parallel-batch/index.js
var require_it_parallel_batch = __commonJS({
  'node_modules/it-parallel-batch/index.js'(exports2, module2) {
    'use strict'
    var batch3 = require_it_batch()
    async function* parallelBatch3(source, size = 1) {
      for await (const tasks of batch3(source, size)) {
        const things = tasks.map((p) => {
          return p().then(
            (value) => ({ ok: true, value }),
            (err) => ({ ok: false, err })
          )
        })
        for (let i = 0; i < things.length; i++) {
          const result = await things[i]
          if (result.ok) {
            yield result.value
          } else {
            throw result.err
          }
        }
      }
    }
    module2.exports = parallelBatch3
  },
})

// node_modules/is-plain-obj/index.js
var require_is_plain_obj = __commonJS({
  'node_modules/is-plain-obj/index.js'(exports2, module2) {
    'use strict'
    module2.exports = (value) => {
      if (Object.prototype.toString.call(value) !== '[object Object]') {
        return false
      }
      const prototype = Object.getPrototypeOf(value)
      return prototype === null || prototype === Object.prototype
    }
  },
})

// node_modules/merge-options/index.js
var require_merge_options = __commonJS({
  'node_modules/merge-options/index.js'(exports2, module2) {
    'use strict'
    var isOptionObject = require_is_plain_obj()
    var { hasOwnProperty } = Object.prototype
    var { propertyIsEnumerable } = Object
    var defineProperty = (object, name6, value) =>
      Object.defineProperty(object, name6, {
        value,
        writable: true,
        enumerable: true,
        configurable: true,
      })
    var globalThis2 = exports2
    var defaultMergeOptions = {
      concatArrays: false,
      ignoreUndefined: false,
    }
    var getEnumerableOwnPropertyKeys = (value) => {
      const keys = []
      for (const key in value) {
        if (hasOwnProperty.call(value, key)) {
          keys.push(key)
        }
      }
      if (Object.getOwnPropertySymbols) {
        const symbols = Object.getOwnPropertySymbols(value)
        for (const symbol of symbols) {
          if (propertyIsEnumerable.call(value, symbol)) {
            keys.push(symbol)
          }
        }
      }
      return keys
    }
    function clone(value) {
      if (Array.isArray(value)) {
        return cloneArray(value)
      }
      if (isOptionObject(value)) {
        return cloneOptionObject(value)
      }
      return value
    }
    function cloneArray(array2) {
      const result = array2.slice(0, 0)
      getEnumerableOwnPropertyKeys(array2).forEach((key) => {
        defineProperty(result, key, clone(array2[key]))
      })
      return result
    }
    function cloneOptionObject(object) {
      const result =
        Object.getPrototypeOf(object) === null ? Object.create(null) : {}
      getEnumerableOwnPropertyKeys(object).forEach((key) => {
        defineProperty(result, key, clone(object[key]))
      })
      return result
    }
    var mergeKeys = (merged, source, keys, config) => {
      keys.forEach((key) => {
        if (typeof source[key] === 'undefined' && config.ignoreUndefined) {
          return
        }
        if (key in merged && merged[key] !== Object.getPrototypeOf(merged)) {
          defineProperty(merged, key, merge(merged[key], source[key], config))
        } else {
          defineProperty(merged, key, clone(source[key]))
        }
      })
      return merged
    }
    var concatArrays = (merged, source, config) => {
      let result = merged.slice(0, 0)
      let resultIndex = 0
      ;[merged, source].forEach((array2) => {
        const indices = []
        for (let k = 0; k < array2.length; k++) {
          if (!hasOwnProperty.call(array2, k)) {
            continue
          }
          indices.push(String(k))
          if (array2 === merged) {
            defineProperty(result, resultIndex++, array2[k])
          } else {
            defineProperty(result, resultIndex++, clone(array2[k]))
          }
        }
        result = mergeKeys(
          result,
          array2,
          getEnumerableOwnPropertyKeys(array2).filter(
            (key) => !indices.includes(key)
          ),
          config
        )
      })
      return result
    }
    function merge(merged, source, config) {
      if (
        config.concatArrays &&
        Array.isArray(merged) &&
        Array.isArray(source)
      ) {
        return concatArrays(merged, source, config)
      }
      if (!isOptionObject(source) || !isOptionObject(merged)) {
        return clone(source)
      }
      return mergeKeys(
        merged,
        source,
        getEnumerableOwnPropertyKeys(source),
        config
      )
    }
    module2.exports = function (...options) {
      const config = merge(
        clone(defaultMergeOptions),
        (this !== globalThis2 && this) || {},
        defaultMergeOptions
      )
      let merged = { _: {} }
      for (const option of options) {
        if (option === void 0) {
          continue
        }
        if (!isOptionObject(option)) {
          throw new TypeError('`' + option + '` is not an Option Object')
        }
        merged = merge(merged, { _: option }, config)
      }
      return merged._
    }
  },
})

// node_modules/multiformats/esm/src/hashes/sha2-browser.js
var sha2_browser_exports = {}
__export(sha2_browser_exports, {
  sha256: () => sha256,
  sha512: () => sha512,
})
var sha, sha256, sha512
var init_sha2_browser = __esm({
  'node_modules/multiformats/esm/src/hashes/sha2-browser.js'() {
    init_hasher()
    sha = (name6) => async (data) =>
      new Uint8Array(await crypto.subtle.digest(name6, data))
    sha256 = from2({
      name: 'sha2-256',
      code: 18,
      encode: sha('SHA-256'),
    })
    sha512 = from2({
      name: 'sha2-512',
      code: 19,
      encode: sha('SHA-512'),
    })
  },
})

// node_modules/murmurhash3js-revisited/lib/murmurHash3js.js
var require_murmurHash3js = __commonJS({
  'node_modules/murmurhash3js-revisited/lib/murmurHash3js.js'(
    exports2,
    module2
  ) {
    ;(function (root, undefined2) {
      'use strict'
      var library = {
        version: '3.0.0',
        x86: {},
        x64: {},
        inputValidation: true,
      }
      function _validBytes(bytes2) {
        if (!Array.isArray(bytes2) && !ArrayBuffer.isView(bytes2)) {
          return false
        }
        for (var i = 0; i < bytes2.length; i++) {
          if (
            !Number.isInteger(bytes2[i]) ||
            bytes2[i] < 0 ||
            bytes2[i] > 255
          ) {
            return false
          }
        }
        return true
      }
      function _x86Multiply(m, n) {
        return (m & 65535) * n + ((((m >>> 16) * n) & 65535) << 16)
      }
      function _x86Rotl(m, n) {
        return (m << n) | (m >>> (32 - n))
      }
      function _x86Fmix(h) {
        h ^= h >>> 16
        h = _x86Multiply(h, 2246822507)
        h ^= h >>> 13
        h = _x86Multiply(h, 3266489909)
        h ^= h >>> 16
        return h
      }
      function _x64Add(m, n) {
        m = [m[0] >>> 16, m[0] & 65535, m[1] >>> 16, m[1] & 65535]
        n = [n[0] >>> 16, n[0] & 65535, n[1] >>> 16, n[1] & 65535]
        var o = [0, 0, 0, 0]
        o[3] += m[3] + n[3]
        o[2] += o[3] >>> 16
        o[3] &= 65535
        o[2] += m[2] + n[2]
        o[1] += o[2] >>> 16
        o[2] &= 65535
        o[1] += m[1] + n[1]
        o[0] += o[1] >>> 16
        o[1] &= 65535
        o[0] += m[0] + n[0]
        o[0] &= 65535
        return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]]
      }
      function _x64Multiply(m, n) {
        m = [m[0] >>> 16, m[0] & 65535, m[1] >>> 16, m[1] & 65535]
        n = [n[0] >>> 16, n[0] & 65535, n[1] >>> 16, n[1] & 65535]
        var o = [0, 0, 0, 0]
        o[3] += m[3] * n[3]
        o[2] += o[3] >>> 16
        o[3] &= 65535
        o[2] += m[2] * n[3]
        o[1] += o[2] >>> 16
        o[2] &= 65535
        o[2] += m[3] * n[2]
        o[1] += o[2] >>> 16
        o[2] &= 65535
        o[1] += m[1] * n[3]
        o[0] += o[1] >>> 16
        o[1] &= 65535
        o[1] += m[2] * n[2]
        o[0] += o[1] >>> 16
        o[1] &= 65535
        o[1] += m[3] * n[1]
        o[0] += o[1] >>> 16
        o[1] &= 65535
        o[0] += m[0] * n[3] + m[1] * n[2] + m[2] * n[1] + m[3] * n[0]
        o[0] &= 65535
        return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]]
      }
      function _x64Rotl(m, n) {
        n %= 64
        if (n === 32) {
          return [m[1], m[0]]
        } else if (n < 32) {
          return [
            (m[0] << n) | (m[1] >>> (32 - n)),
            (m[1] << n) | (m[0] >>> (32 - n)),
          ]
        } else {
          n -= 32
          return [
            (m[1] << n) | (m[0] >>> (32 - n)),
            (m[0] << n) | (m[1] >>> (32 - n)),
          ]
        }
      }
      function _x64LeftShift(m, n) {
        n %= 64
        if (n === 0) {
          return m
        } else if (n < 32) {
          return [(m[0] << n) | (m[1] >>> (32 - n)), m[1] << n]
        } else {
          return [m[1] << (n - 32), 0]
        }
      }
      function _x64Xor(m, n) {
        return [m[0] ^ n[0], m[1] ^ n[1]]
      }
      function _x64Fmix(h) {
        h = _x64Xor(h, [0, h[0] >>> 1])
        h = _x64Multiply(h, [4283543511, 3981806797])
        h = _x64Xor(h, [0, h[0] >>> 1])
        h = _x64Multiply(h, [3301882366, 444984403])
        h = _x64Xor(h, [0, h[0] >>> 1])
        return h
      }
      library.x86.hash32 = function (bytes2, seed) {
        if (library.inputValidation && !_validBytes(bytes2)) {
          return undefined2
        }
        seed = seed || 0
        var remainder = bytes2.length % 4
        var blocks = bytes2.length - remainder
        var h1 = seed
        var k1 = 0
        var c1 = 3432918353
        var c2 = 461845907
        for (var i = 0; i < blocks; i = i + 4) {
          k1 =
            bytes2[i] |
            (bytes2[i + 1] << 8) |
            (bytes2[i + 2] << 16) |
            (bytes2[i + 3] << 24)
          k1 = _x86Multiply(k1, c1)
          k1 = _x86Rotl(k1, 15)
          k1 = _x86Multiply(k1, c2)
          h1 ^= k1
          h1 = _x86Rotl(h1, 13)
          h1 = _x86Multiply(h1, 5) + 3864292196
        }
        k1 = 0
        switch (remainder) {
          case 3:
            k1 ^= bytes2[i + 2] << 16
          case 2:
            k1 ^= bytes2[i + 1] << 8
          case 1:
            k1 ^= bytes2[i]
            k1 = _x86Multiply(k1, c1)
            k1 = _x86Rotl(k1, 15)
            k1 = _x86Multiply(k1, c2)
            h1 ^= k1
        }
        h1 ^= bytes2.length
        h1 = _x86Fmix(h1)
        return h1 >>> 0
      }
      library.x86.hash128 = function (bytes2, seed) {
        if (library.inputValidation && !_validBytes(bytes2)) {
          return undefined2
        }
        seed = seed || 0
        var remainder = bytes2.length % 16
        var blocks = bytes2.length - remainder
        var h1 = seed
        var h2 = seed
        var h3 = seed
        var h4 = seed
        var k1 = 0
        var k2 = 0
        var k3 = 0
        var k4 = 0
        var c1 = 597399067
        var c2 = 2869860233
        var c3 = 951274213
        var c4 = 2716044179
        for (var i = 0; i < blocks; i = i + 16) {
          k1 =
            bytes2[i] |
            (bytes2[i + 1] << 8) |
            (bytes2[i + 2] << 16) |
            (bytes2[i + 3] << 24)
          k2 =
            bytes2[i + 4] |
            (bytes2[i + 5] << 8) |
            (bytes2[i + 6] << 16) |
            (bytes2[i + 7] << 24)
          k3 =
            bytes2[i + 8] |
            (bytes2[i + 9] << 8) |
            (bytes2[i + 10] << 16) |
            (bytes2[i + 11] << 24)
          k4 =
            bytes2[i + 12] |
            (bytes2[i + 13] << 8) |
            (bytes2[i + 14] << 16) |
            (bytes2[i + 15] << 24)
          k1 = _x86Multiply(k1, c1)
          k1 = _x86Rotl(k1, 15)
          k1 = _x86Multiply(k1, c2)
          h1 ^= k1
          h1 = _x86Rotl(h1, 19)
          h1 += h2
          h1 = _x86Multiply(h1, 5) + 1444728091
          k2 = _x86Multiply(k2, c2)
          k2 = _x86Rotl(k2, 16)
          k2 = _x86Multiply(k2, c3)
          h2 ^= k2
          h2 = _x86Rotl(h2, 17)
          h2 += h3
          h2 = _x86Multiply(h2, 5) + 197830471
          k3 = _x86Multiply(k3, c3)
          k3 = _x86Rotl(k3, 17)
          k3 = _x86Multiply(k3, c4)
          h3 ^= k3
          h3 = _x86Rotl(h3, 15)
          h3 += h4
          h3 = _x86Multiply(h3, 5) + 2530024501
          k4 = _x86Multiply(k4, c4)
          k4 = _x86Rotl(k4, 18)
          k4 = _x86Multiply(k4, c1)
          h4 ^= k4
          h4 = _x86Rotl(h4, 13)
          h4 += h1
          h4 = _x86Multiply(h4, 5) + 850148119
        }
        k1 = 0
        k2 = 0
        k3 = 0
        k4 = 0
        switch (remainder) {
          case 15:
            k4 ^= bytes2[i + 14] << 16
          case 14:
            k4 ^= bytes2[i + 13] << 8
          case 13:
            k4 ^= bytes2[i + 12]
            k4 = _x86Multiply(k4, c4)
            k4 = _x86Rotl(k4, 18)
            k4 = _x86Multiply(k4, c1)
            h4 ^= k4
          case 12:
            k3 ^= bytes2[i + 11] << 24
          case 11:
            k3 ^= bytes2[i + 10] << 16
          case 10:
            k3 ^= bytes2[i + 9] << 8
          case 9:
            k3 ^= bytes2[i + 8]
            k3 = _x86Multiply(k3, c3)
            k3 = _x86Rotl(k3, 17)
            k3 = _x86Multiply(k3, c4)
            h3 ^= k3
          case 8:
            k2 ^= bytes2[i + 7] << 24
          case 7:
            k2 ^= bytes2[i + 6] << 16
          case 6:
            k2 ^= bytes2[i + 5] << 8
          case 5:
            k2 ^= bytes2[i + 4]
            k2 = _x86Multiply(k2, c2)
            k2 = _x86Rotl(k2, 16)
            k2 = _x86Multiply(k2, c3)
            h2 ^= k2
          case 4:
            k1 ^= bytes2[i + 3] << 24
          case 3:
            k1 ^= bytes2[i + 2] << 16
          case 2:
            k1 ^= bytes2[i + 1] << 8
          case 1:
            k1 ^= bytes2[i]
            k1 = _x86Multiply(k1, c1)
            k1 = _x86Rotl(k1, 15)
            k1 = _x86Multiply(k1, c2)
            h1 ^= k1
        }
        h1 ^= bytes2.length
        h2 ^= bytes2.length
        h3 ^= bytes2.length
        h4 ^= bytes2.length
        h1 += h2
        h1 += h3
        h1 += h4
        h2 += h1
        h3 += h1
        h4 += h1
        h1 = _x86Fmix(h1)
        h2 = _x86Fmix(h2)
        h3 = _x86Fmix(h3)
        h4 = _x86Fmix(h4)
        h1 += h2
        h1 += h3
        h1 += h4
        h2 += h1
        h3 += h1
        h4 += h1
        return (
          ('00000000' + (h1 >>> 0).toString(16)).slice(-8) +
          ('00000000' + (h2 >>> 0).toString(16)).slice(-8) +
          ('00000000' + (h3 >>> 0).toString(16)).slice(-8) +
          ('00000000' + (h4 >>> 0).toString(16)).slice(-8)
        )
      }
      library.x64.hash128 = function (bytes2, seed) {
        if (library.inputValidation && !_validBytes(bytes2)) {
          return undefined2
        }
        seed = seed || 0
        var remainder = bytes2.length % 16
        var blocks = bytes2.length - remainder
        var h1 = [0, seed]
        var h2 = [0, seed]
        var k1 = [0, 0]
        var k2 = [0, 0]
        var c1 = [2277735313, 289559509]
        var c2 = [1291169091, 658871167]
        for (var i = 0; i < blocks; i = i + 16) {
          k1 = [
            bytes2[i + 4] |
              (bytes2[i + 5] << 8) |
              (bytes2[i + 6] << 16) |
              (bytes2[i + 7] << 24),
            bytes2[i] |
              (bytes2[i + 1] << 8) |
              (bytes2[i + 2] << 16) |
              (bytes2[i + 3] << 24),
          ]
          k2 = [
            bytes2[i + 12] |
              (bytes2[i + 13] << 8) |
              (bytes2[i + 14] << 16) |
              (bytes2[i + 15] << 24),
            bytes2[i + 8] |
              (bytes2[i + 9] << 8) |
              (bytes2[i + 10] << 16) |
              (bytes2[i + 11] << 24),
          ]
          k1 = _x64Multiply(k1, c1)
          k1 = _x64Rotl(k1, 31)
          k1 = _x64Multiply(k1, c2)
          h1 = _x64Xor(h1, k1)
          h1 = _x64Rotl(h1, 27)
          h1 = _x64Add(h1, h2)
          h1 = _x64Add(_x64Multiply(h1, [0, 5]), [0, 1390208809])
          k2 = _x64Multiply(k2, c2)
          k2 = _x64Rotl(k2, 33)
          k2 = _x64Multiply(k2, c1)
          h2 = _x64Xor(h2, k2)
          h2 = _x64Rotl(h2, 31)
          h2 = _x64Add(h2, h1)
          h2 = _x64Add(_x64Multiply(h2, [0, 5]), [0, 944331445])
        }
        k1 = [0, 0]
        k2 = [0, 0]
        switch (remainder) {
          case 15:
            k2 = _x64Xor(k2, _x64LeftShift([0, bytes2[i + 14]], 48))
          case 14:
            k2 = _x64Xor(k2, _x64LeftShift([0, bytes2[i + 13]], 40))
          case 13:
            k2 = _x64Xor(k2, _x64LeftShift([0, bytes2[i + 12]], 32))
          case 12:
            k2 = _x64Xor(k2, _x64LeftShift([0, bytes2[i + 11]], 24))
          case 11:
            k2 = _x64Xor(k2, _x64LeftShift([0, bytes2[i + 10]], 16))
          case 10:
            k2 = _x64Xor(k2, _x64LeftShift([0, bytes2[i + 9]], 8))
          case 9:
            k2 = _x64Xor(k2, [0, bytes2[i + 8]])
            k2 = _x64Multiply(k2, c2)
            k2 = _x64Rotl(k2, 33)
            k2 = _x64Multiply(k2, c1)
            h2 = _x64Xor(h2, k2)
          case 8:
            k1 = _x64Xor(k1, _x64LeftShift([0, bytes2[i + 7]], 56))
          case 7:
            k1 = _x64Xor(k1, _x64LeftShift([0, bytes2[i + 6]], 48))
          case 6:
            k1 = _x64Xor(k1, _x64LeftShift([0, bytes2[i + 5]], 40))
          case 5:
            k1 = _x64Xor(k1, _x64LeftShift([0, bytes2[i + 4]], 32))
          case 4:
            k1 = _x64Xor(k1, _x64LeftShift([0, bytes2[i + 3]], 24))
          case 3:
            k1 = _x64Xor(k1, _x64LeftShift([0, bytes2[i + 2]], 16))
          case 2:
            k1 = _x64Xor(k1, _x64LeftShift([0, bytes2[i + 1]], 8))
          case 1:
            k1 = _x64Xor(k1, [0, bytes2[i]])
            k1 = _x64Multiply(k1, c1)
            k1 = _x64Rotl(k1, 31)
            k1 = _x64Multiply(k1, c2)
            h1 = _x64Xor(h1, k1)
        }
        h1 = _x64Xor(h1, [0, bytes2.length])
        h2 = _x64Xor(h2, [0, bytes2.length])
        h1 = _x64Add(h1, h2)
        h2 = _x64Add(h2, h1)
        h1 = _x64Fmix(h1)
        h2 = _x64Fmix(h2)
        h1 = _x64Add(h1, h2)
        h2 = _x64Add(h2, h1)
        return (
          ('00000000' + (h1[0] >>> 0).toString(16)).slice(-8) +
          ('00000000' + (h1[1] >>> 0).toString(16)).slice(-8) +
          ('00000000' + (h2[0] >>> 0).toString(16)).slice(-8) +
          ('00000000' + (h2[1] >>> 0).toString(16)).slice(-8)
        )
      }
      if (typeof exports2 !== 'undefined') {
        if (typeof module2 !== 'undefined' && module2.exports) {
          exports2 = module2.exports = library
        }
        exports2.murmurHash3 = library
      } else if (typeof define === 'function' && define.amd) {
        define([], function () {
          return library
        })
      } else {
        library._murmurHash3 = root.murmurHash3
        library.noConflict = function () {
          root.murmurHash3 = library._murmurHash3
          library._murmurHash3 = undefined2
          library.noConflict = undefined2
          return library
        }
        root.murmurHash3 = library
      }
    })(exports2)
  },
})

// node_modules/murmurhash3js-revisited/index.js
var require_murmurhash3js_revisited = __commonJS({
  'node_modules/murmurhash3js-revisited/index.js'(exports2, module2) {
    module2.exports = require_murmurHash3js()
  },
})

// node_modules/err-code/index.js
var require_err_code = __commonJS({
  'node_modules/err-code/index.js'(exports2, module2) {
    'use strict'
    function assign(obj, props) {
      for (const key in props) {
        Object.defineProperty(obj, key, {
          value: props[key],
          enumerable: true,
          configurable: true,
        })
      }
      return obj
    }
    function createError(err, code6, props) {
      if (!err || typeof err === 'string') {
        throw new TypeError('Please pass an Error to err-code')
      }
      if (!props) {
        props = {}
      }
      if (typeof code6 === 'object') {
        props = code6
        code6 = ''
      }
      if (code6) {
        props.code = code6
      }
      try {
        return assign(err, props)
      } catch (_) {
        props.message = err.message
        props.stack = err.stack
        const ErrClass = function () {}
        ErrClass.prototype = Object.create(Object.getPrototypeOf(err))
        const output = assign(new ErrClass(), props)
        return output
      }
    }
    module2.exports = createError
  },
})

// node_modules/@protobufjs/aspromise/index.js
var require_aspromise = __commonJS({
  'node_modules/@protobufjs/aspromise/index.js'(exports2, module2) {
    'use strict'
    module2.exports = asPromise
    function asPromise(fn, ctx) {
      var params = new Array(arguments.length - 1),
        offset = 0,
        index = 2,
        pending = true
      while (index < arguments.length) params[offset++] = arguments[index++]
      return new Promise(function executor(resolve, reject) {
        params[offset] = function callback(err) {
          if (pending) {
            pending = false
            if (err) reject(err)
            else {
              var params2 = new Array(arguments.length - 1),
                offset2 = 0
              while (offset2 < params2.length)
                params2[offset2++] = arguments[offset2]
              resolve.apply(null, params2)
            }
          }
        }
        try {
          fn.apply(ctx || null, params)
        } catch (err) {
          if (pending) {
            pending = false
            reject(err)
          }
        }
      })
    }
  },
})

// node_modules/@protobufjs/base64/index.js
var require_base64 = __commonJS({
  'node_modules/@protobufjs/base64/index.js'(exports2) {
    'use strict'
    var base642 = exports2
    base642.length = function length2(string3) {
      var p = string3.length
      if (!p) return 0
      var n = 0
      while (--p % 4 > 1 && string3.charAt(p) === '=') ++n
      return Math.ceil(string3.length * 3) / 4 - n
    }
    var b64 = new Array(64)
    var s64 = new Array(123)
    for (i = 0; i < 64; )
      s64[
        (b64[i] =
          i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : (i - 59) | 43)
      ] = i++
    var i
    base642.encode = function encode12(buffer2, start, end) {
      var parts = null,
        chunk = []
      var i2 = 0,
        j = 0,
        t
      while (start < end) {
        var b = buffer2[start++]
        switch (j) {
          case 0:
            chunk[i2++] = b64[b >> 2]
            t = (b & 3) << 4
            j = 1
            break
          case 1:
            chunk[i2++] = b64[t | (b >> 4)]
            t = (b & 15) << 2
            j = 2
            break
          case 2:
            chunk[i2++] = b64[t | (b >> 6)]
            chunk[i2++] = b64[b & 63]
            j = 0
            break
        }
        if (i2 > 8191) {
          ;(parts || (parts = [])).push(
            String.fromCharCode.apply(String, chunk)
          )
          i2 = 0
        }
      }
      if (j) {
        chunk[i2++] = b64[t]
        chunk[i2++] = 61
        if (j === 1) chunk[i2++] = 61
      }
      if (parts) {
        if (i2)
          parts.push(String.fromCharCode.apply(String, chunk.slice(0, i2)))
        return parts.join('')
      }
      return String.fromCharCode.apply(String, chunk.slice(0, i2))
    }
    var invalidEncoding = 'invalid encoding'
    base642.decode = function decode11(string3, buffer2, offset) {
      var start = offset
      var j = 0,
        t
      for (var i2 = 0; i2 < string3.length; ) {
        var c = string3.charCodeAt(i2++)
        if (c === 61 && j > 1) break
        if ((c = s64[c]) === void 0) throw Error(invalidEncoding)
        switch (j) {
          case 0:
            t = c
            j = 1
            break
          case 1:
            buffer2[offset++] = (t << 2) | ((c & 48) >> 4)
            t = c
            j = 2
            break
          case 2:
            buffer2[offset++] = ((t & 15) << 4) | ((c & 60) >> 2)
            t = c
            j = 3
            break
          case 3:
            buffer2[offset++] = ((t & 3) << 6) | c
            j = 0
            break
        }
      }
      if (j === 1) throw Error(invalidEncoding)
      return offset - start
    }
    base642.test = function test(string3) {
      return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
        string3
      )
    }
  },
})

// node_modules/@protobufjs/eventemitter/index.js
var require_eventemitter = __commonJS({
  'node_modules/@protobufjs/eventemitter/index.js'(exports2, module2) {
    'use strict'
    module2.exports = EventEmitter
    function EventEmitter() {
      this._listeners = {}
    }
    EventEmitter.prototype.on = function on(evt, fn, ctx) {
      ;(this._listeners[evt] || (this._listeners[evt] = [])).push({
        fn,
        ctx: ctx || this,
      })
      return this
    }
    EventEmitter.prototype.off = function off(evt, fn) {
      if (evt === void 0) this._listeners = {}
      else {
        if (fn === void 0) this._listeners[evt] = []
        else {
          var listeners = this._listeners[evt]
          for (var i = 0; i < listeners.length; )
            if (listeners[i].fn === fn) listeners.splice(i, 1)
            else ++i
        }
      }
      return this
    }
    EventEmitter.prototype.emit = function emit(evt) {
      var listeners = this._listeners[evt]
      if (listeners) {
        var args = [],
          i = 1
        for (; i < arguments.length; ) args.push(arguments[i++])
        for (i = 0; i < listeners.length; )
          listeners[i].fn.apply(listeners[i++].ctx, args)
      }
      return this
    }
  },
})

// node_modules/@protobufjs/float/index.js
var require_float = __commonJS({
  'node_modules/@protobufjs/float/index.js'(exports2, module2) {
    'use strict'
    module2.exports = factory(factory)
    function factory(exports3) {
      if (typeof Float32Array !== 'undefined')
        (function () {
          var f32 = new Float32Array([-0]),
            f8b = new Uint8Array(f32.buffer),
            le = f8b[3] === 128
          function writeFloat_f32_cpy(val, buf2, pos) {
            f32[0] = val
            buf2[pos] = f8b[0]
            buf2[pos + 1] = f8b[1]
            buf2[pos + 2] = f8b[2]
            buf2[pos + 3] = f8b[3]
          }
          function writeFloat_f32_rev(val, buf2, pos) {
            f32[0] = val
            buf2[pos] = f8b[3]
            buf2[pos + 1] = f8b[2]
            buf2[pos + 2] = f8b[1]
            buf2[pos + 3] = f8b[0]
          }
          exports3.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev
          exports3.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy
          function readFloat_f32_cpy(buf2, pos) {
            f8b[0] = buf2[pos]
            f8b[1] = buf2[pos + 1]
            f8b[2] = buf2[pos + 2]
            f8b[3] = buf2[pos + 3]
            return f32[0]
          }
          function readFloat_f32_rev(buf2, pos) {
            f8b[3] = buf2[pos]
            f8b[2] = buf2[pos + 1]
            f8b[1] = buf2[pos + 2]
            f8b[0] = buf2[pos + 3]
            return f32[0]
          }
          exports3.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev
          exports3.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy
        })()
      else
        (function () {
          function writeFloat_ieee754(writeUint, val, buf2, pos) {
            var sign = val < 0 ? 1 : 0
            if (sign) val = -val
            if (val === 0) writeUint(1 / val > 0 ? 0 : 2147483648, buf2, pos)
            else if (isNaN(val)) writeUint(2143289344, buf2, pos)
            else if (val > 34028234663852886e22)
              writeUint(((sign << 31) | 2139095040) >>> 0, buf2, pos)
            else if (val < 11754943508222875e-54)
              writeUint(
                ((sign << 31) | Math.round(val / 1401298464324817e-60)) >>> 0,
                buf2,
                pos
              )
            else {
              var exponent = Math.floor(Math.log(val) / Math.LN2),
                mantissa =
                  Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607
              writeUint(
                ((sign << 31) | ((exponent + 127) << 23) | mantissa) >>> 0,
                buf2,
                pos
              )
            }
          }
          exports3.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE)
          exports3.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE)
          function readFloat_ieee754(readUint, buf2, pos) {
            var uint8 = readUint(buf2, pos),
              sign = (uint8 >> 31) * 2 + 1,
              exponent = (uint8 >>> 23) & 255,
              mantissa = uint8 & 8388607
            return exponent === 255
              ? mantissa
                ? NaN
                : sign * Infinity
              : exponent === 0
              ? sign * 1401298464324817e-60 * mantissa
              : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608)
          }
          exports3.readFloatLE = readFloat_ieee754.bind(null, readUintLE)
          exports3.readFloatBE = readFloat_ieee754.bind(null, readUintBE)
        })()
      if (typeof Float64Array !== 'undefined')
        (function () {
          var f64 = new Float64Array([-0]),
            f8b = new Uint8Array(f64.buffer),
            le = f8b[7] === 128
          function writeDouble_f64_cpy(val, buf2, pos) {
            f64[0] = val
            buf2[pos] = f8b[0]
            buf2[pos + 1] = f8b[1]
            buf2[pos + 2] = f8b[2]
            buf2[pos + 3] = f8b[3]
            buf2[pos + 4] = f8b[4]
            buf2[pos + 5] = f8b[5]
            buf2[pos + 6] = f8b[6]
            buf2[pos + 7] = f8b[7]
          }
          function writeDouble_f64_rev(val, buf2, pos) {
            f64[0] = val
            buf2[pos] = f8b[7]
            buf2[pos + 1] = f8b[6]
            buf2[pos + 2] = f8b[5]
            buf2[pos + 3] = f8b[4]
            buf2[pos + 4] = f8b[3]
            buf2[pos + 5] = f8b[2]
            buf2[pos + 6] = f8b[1]
            buf2[pos + 7] = f8b[0]
          }
          exports3.writeDoubleLE = le
            ? writeDouble_f64_cpy
            : writeDouble_f64_rev
          exports3.writeDoubleBE = le
            ? writeDouble_f64_rev
            : writeDouble_f64_cpy
          function readDouble_f64_cpy(buf2, pos) {
            f8b[0] = buf2[pos]
            f8b[1] = buf2[pos + 1]
            f8b[2] = buf2[pos + 2]
            f8b[3] = buf2[pos + 3]
            f8b[4] = buf2[pos + 4]
            f8b[5] = buf2[pos + 5]
            f8b[6] = buf2[pos + 6]
            f8b[7] = buf2[pos + 7]
            return f64[0]
          }
          function readDouble_f64_rev(buf2, pos) {
            f8b[7] = buf2[pos]
            f8b[6] = buf2[pos + 1]
            f8b[5] = buf2[pos + 2]
            f8b[4] = buf2[pos + 3]
            f8b[3] = buf2[pos + 4]
            f8b[2] = buf2[pos + 5]
            f8b[1] = buf2[pos + 6]
            f8b[0] = buf2[pos + 7]
            return f64[0]
          }
          exports3.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev
          exports3.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy
        })()
      else
        (function () {
          function writeDouble_ieee754(writeUint, off0, off1, val, buf2, pos) {
            var sign = val < 0 ? 1 : 0
            if (sign) val = -val
            if (val === 0) {
              writeUint(0, buf2, pos + off0)
              writeUint(1 / val > 0 ? 0 : 2147483648, buf2, pos + off1)
            } else if (isNaN(val)) {
              writeUint(0, buf2, pos + off0)
              writeUint(2146959360, buf2, pos + off1)
            } else if (val > 17976931348623157e292) {
              writeUint(0, buf2, pos + off0)
              writeUint(((sign << 31) | 2146435072) >>> 0, buf2, pos + off1)
            } else {
              var mantissa
              if (val < 22250738585072014e-324) {
                mantissa = val / 5e-324
                writeUint(mantissa >>> 0, buf2, pos + off0)
                writeUint(
                  ((sign << 31) | (mantissa / 4294967296)) >>> 0,
                  buf2,
                  pos + off1
                )
              } else {
                var exponent = Math.floor(Math.log(val) / Math.LN2)
                if (exponent === 1024) exponent = 1023
                mantissa = val * Math.pow(2, -exponent)
                writeUint((mantissa * 4503599627370496) >>> 0, buf2, pos + off0)
                writeUint(
                  ((sign << 31) |
                    ((exponent + 1023) << 20) |
                    ((mantissa * 1048576) & 1048575)) >>>
                    0,
                  buf2,
                  pos + off1
                )
              }
            }
          }
          exports3.writeDoubleLE = writeDouble_ieee754.bind(
            null,
            writeUintLE,
            0,
            4
          )
          exports3.writeDoubleBE = writeDouble_ieee754.bind(
            null,
            writeUintBE,
            4,
            0
          )
          function readDouble_ieee754(readUint, off0, off1, buf2, pos) {
            var lo = readUint(buf2, pos + off0),
              hi = readUint(buf2, pos + off1)
            var sign = (hi >> 31) * 2 + 1,
              exponent = (hi >>> 20) & 2047,
              mantissa = 4294967296 * (hi & 1048575) + lo
            return exponent === 2047
              ? mantissa
                ? NaN
                : sign * Infinity
              : exponent === 0
              ? sign * 5e-324 * mantissa
              : sign *
                Math.pow(2, exponent - 1075) *
                (mantissa + 4503599627370496)
          }
          exports3.readDoubleLE = readDouble_ieee754.bind(
            null,
            readUintLE,
            0,
            4
          )
          exports3.readDoubleBE = readDouble_ieee754.bind(
            null,
            readUintBE,
            4,
            0
          )
        })()
      return exports3
    }
    function writeUintLE(val, buf2, pos) {
      buf2[pos] = val & 255
      buf2[pos + 1] = (val >>> 8) & 255
      buf2[pos + 2] = (val >>> 16) & 255
      buf2[pos + 3] = val >>> 24
    }
    function writeUintBE(val, buf2, pos) {
      buf2[pos] = val >>> 24
      buf2[pos + 1] = (val >>> 16) & 255
      buf2[pos + 2] = (val >>> 8) & 255
      buf2[pos + 3] = val & 255
    }
    function readUintLE(buf2, pos) {
      return (
        (buf2[pos] |
          (buf2[pos + 1] << 8) |
          (buf2[pos + 2] << 16) |
          (buf2[pos + 3] << 24)) >>>
        0
      )
    }
    function readUintBE(buf2, pos) {
      return (
        ((buf2[pos] << 24) |
          (buf2[pos + 1] << 16) |
          (buf2[pos + 2] << 8) |
          buf2[pos + 3]) >>>
        0
      )
    }
  },
})

// node_modules/@protobufjs/inquire/index.js
var require_inquire = __commonJS({
  'node_modules/@protobufjs/inquire/index.js'(exports, module) {
    'use strict'
    module.exports = inquire
    function inquire(moduleName) {
      try {
        var mod = eval('quire'.replace(/^/, 're'))(moduleName)
        if (mod && (mod.length || Object.keys(mod).length)) return mod
      } catch (e) {}
      return null
    }
  },
})

// node_modules/@protobufjs/utf8/index.js
var require_utf8 = __commonJS({
  'node_modules/@protobufjs/utf8/index.js'(exports2) {
    'use strict'
    var utf8 = exports2
    utf8.length = function utf8_length(string3) {
      var len = 0,
        c = 0
      for (var i = 0; i < string3.length; ++i) {
        c = string3.charCodeAt(i)
        if (c < 128) len += 1
        else if (c < 2048) len += 2
        else if (
          (c & 64512) === 55296 &&
          (string3.charCodeAt(i + 1) & 64512) === 56320
        ) {
          ++i
          len += 4
        } else len += 3
      }
      return len
    }
    utf8.read = function utf8_read(buffer2, start, end) {
      var len = end - start
      if (len < 1) return ''
      var parts = null,
        chunk = [],
        i = 0,
        t
      while (start < end) {
        t = buffer2[start++]
        if (t < 128) chunk[i++] = t
        else if (t > 191 && t < 224)
          chunk[i++] = ((t & 31) << 6) | (buffer2[start++] & 63)
        else if (t > 239 && t < 365) {
          t =
            (((t & 7) << 18) |
              ((buffer2[start++] & 63) << 12) |
              ((buffer2[start++] & 63) << 6) |
              (buffer2[start++] & 63)) -
            65536
          chunk[i++] = 55296 + (t >> 10)
          chunk[i++] = 56320 + (t & 1023)
        } else
          chunk[i++] =
            ((t & 15) << 12) |
            ((buffer2[start++] & 63) << 6) |
            (buffer2[start++] & 63)
        if (i > 8191) {
          ;(parts || (parts = [])).push(
            String.fromCharCode.apply(String, chunk)
          )
          i = 0
        }
      }
      if (parts) {
        if (i) parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)))
        return parts.join('')
      }
      return String.fromCharCode.apply(String, chunk.slice(0, i))
    }
    utf8.write = function utf8_write(string3, buffer2, offset) {
      var start = offset,
        c1,
        c2
      for (var i = 0; i < string3.length; ++i) {
        c1 = string3.charCodeAt(i)
        if (c1 < 128) {
          buffer2[offset++] = c1
        } else if (c1 < 2048) {
          buffer2[offset++] = (c1 >> 6) | 192
          buffer2[offset++] = (c1 & 63) | 128
        } else if (
          (c1 & 64512) === 55296 &&
          ((c2 = string3.charCodeAt(i + 1)) & 64512) === 56320
        ) {
          c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023)
          ++i
          buffer2[offset++] = (c1 >> 18) | 240
          buffer2[offset++] = ((c1 >> 12) & 63) | 128
          buffer2[offset++] = ((c1 >> 6) & 63) | 128
          buffer2[offset++] = (c1 & 63) | 128
        } else {
          buffer2[offset++] = (c1 >> 12) | 224
          buffer2[offset++] = ((c1 >> 6) & 63) | 128
          buffer2[offset++] = (c1 & 63) | 128
        }
      }
      return offset - start
    }
  },
})

// node_modules/@protobufjs/pool/index.js
var require_pool = __commonJS({
  'node_modules/@protobufjs/pool/index.js'(exports2, module2) {
    'use strict'
    module2.exports = pool
    function pool(alloc2, slice2, size) {
      var SIZE = size || 8192
      var MAX = SIZE >>> 1
      var slab = null
      var offset = SIZE
      return function pool_alloc(size2) {
        if (size2 < 1 || size2 > MAX) return alloc2(size2)
        if (offset + size2 > SIZE) {
          slab = alloc2(SIZE)
          offset = 0
        }
        var buf2 = slice2.call(slab, offset, (offset += size2))
        if (offset & 7) offset = (offset | 7) + 1
        return buf2
      }
    }
  },
})

// node_modules/protobufjs/src/util/longbits.js
var require_longbits = __commonJS({
  'node_modules/protobufjs/src/util/longbits.js'(exports2, module2) {
    'use strict'
    module2.exports = LongBits
    var util = require_minimal()
    function LongBits(lo, hi) {
      this.lo = lo >>> 0
      this.hi = hi >>> 0
    }
    var zero = (LongBits.zero = new LongBits(0, 0))
    zero.toNumber = function () {
      return 0
    }
    zero.zzEncode = zero.zzDecode = function () {
      return this
    }
    zero.length = function () {
      return 1
    }
    var zeroHash = (LongBits.zeroHash = '\0\0\0\0\0\0\0\0')
    LongBits.fromNumber = function fromNumber(value) {
      if (value === 0) return zero
      var sign = value < 0
      if (sign) value = -value
      var lo = value >>> 0,
        hi = ((value - lo) / 4294967296) >>> 0
      if (sign) {
        hi = ~hi >>> 0
        lo = ~lo >>> 0
        if (++lo > 4294967295) {
          lo = 0
          if (++hi > 4294967295) hi = 0
        }
      }
      return new LongBits(lo, hi)
    }
    LongBits.from = function from3(value) {
      if (typeof value === 'number') return LongBits.fromNumber(value)
      if (util.isString(value)) {
        if (util.Long) value = util.Long.fromString(value)
        else return LongBits.fromNumber(parseInt(value, 10))
      }
      return value.low || value.high
        ? new LongBits(value.low >>> 0, value.high >>> 0)
        : zero
    }
    LongBits.prototype.toNumber = function toNumber(unsigned) {
      if (!unsigned && this.hi >>> 31) {
        var lo = (~this.lo + 1) >>> 0,
          hi = ~this.hi >>> 0
        if (!lo) hi = (hi + 1) >>> 0
        return -(lo + hi * 4294967296)
      }
      return this.lo + this.hi * 4294967296
    }
    LongBits.prototype.toLong = function toLong(unsigned) {
      return util.Long
        ? new util.Long(this.lo | 0, this.hi | 0, Boolean(unsigned))
        : { low: this.lo | 0, high: this.hi | 0, unsigned: Boolean(unsigned) }
    }
    var charCodeAt = String.prototype.charCodeAt
    LongBits.fromHash = function fromHash(hash) {
      if (hash === zeroHash) return zero
      return new LongBits(
        (charCodeAt.call(hash, 0) |
          (charCodeAt.call(hash, 1) << 8) |
          (charCodeAt.call(hash, 2) << 16) |
          (charCodeAt.call(hash, 3) << 24)) >>>
          0,
        (charCodeAt.call(hash, 4) |
          (charCodeAt.call(hash, 5) << 8) |
          (charCodeAt.call(hash, 6) << 16) |
          (charCodeAt.call(hash, 7) << 24)) >>>
          0
      )
    }
    LongBits.prototype.toHash = function toHash() {
      return String.fromCharCode(
        this.lo & 255,
        (this.lo >>> 8) & 255,
        (this.lo >>> 16) & 255,
        this.lo >>> 24,
        this.hi & 255,
        (this.hi >>> 8) & 255,
        (this.hi >>> 16) & 255,
        this.hi >>> 24
      )
    }
    LongBits.prototype.zzEncode = function zzEncode() {
      var mask = this.hi >> 31
      this.hi = (((this.hi << 1) | (this.lo >>> 31)) ^ mask) >>> 0
      this.lo = ((this.lo << 1) ^ mask) >>> 0
      return this
    }
    LongBits.prototype.zzDecode = function zzDecode() {
      var mask = -(this.lo & 1)
      this.lo = (((this.lo >>> 1) | (this.hi << 31)) ^ mask) >>> 0
      this.hi = ((this.hi >>> 1) ^ mask) >>> 0
      return this
    }
    LongBits.prototype.length = function length2() {
      var part0 = this.lo,
        part1 = ((this.lo >>> 28) | (this.hi << 4)) >>> 0,
        part2 = this.hi >>> 24
      return part2 === 0
        ? part1 === 0
          ? part0 < 16384
            ? part0 < 128
              ? 1
              : 2
            : part0 < 2097152
            ? 3
            : 4
          : part1 < 16384
          ? part1 < 128
            ? 5
            : 6
          : part1 < 2097152
          ? 7
          : 8
        : part2 < 128
        ? 9
        : 10
    }
  },
})

// node_modules/protobufjs/src/util/minimal.js
var require_minimal = __commonJS({
  'node_modules/protobufjs/src/util/minimal.js'(exports2) {
    'use strict'
    var util = exports2
    util.asPromise = require_aspromise()
    util.base64 = require_base64()
    util.EventEmitter = require_eventemitter()
    util.float = require_float()
    util.inquire = require_inquire()
    util.utf8 = require_utf8()
    util.pool = require_pool()
    util.LongBits = require_longbits()
    util.isNode = Boolean(
      typeof global !== 'undefined' &&
        global &&
        global.process &&
        global.process.versions &&
        global.process.versions.node
    )
    util.global =
      (util.isNode && global) ||
      (typeof window !== 'undefined' && window) ||
      (typeof self !== 'undefined' && self) ||
      exports2
    util.emptyArray = Object.freeze ? Object.freeze([]) : []
    util.emptyObject = Object.freeze ? Object.freeze({}) : {}
    util.isInteger =
      Number.isInteger ||
      function isInteger(value) {
        return (
          typeof value === 'number' &&
          isFinite(value) &&
          Math.floor(value) === value
        )
      }
    util.isString = function isString(value) {
      return typeof value === 'string' || value instanceof String
    }
    util.isObject = function isObject2(value) {
      return value && typeof value === 'object'
    }
    util.isset = util.isSet = function isSet(obj, prop) {
      var value = obj[prop]
      if (value != null && obj.hasOwnProperty(prop))
        return (
          typeof value !== 'object' ||
          (Array.isArray(value) ? value.length : Object.keys(value).length) > 0
        )
      return false
    }
    util.Buffer = (function () {
      try {
        var Buffer2 = util.inquire('buffer').Buffer
        return Buffer2.prototype.utf8Write ? Buffer2 : null
      } catch (e) {
        return null
      }
    })()
    util._Buffer_from = null
    util._Buffer_allocUnsafe = null
    util.newBuffer = function newBuffer(sizeOrArray) {
      return typeof sizeOrArray === 'number'
        ? util.Buffer
          ? util._Buffer_allocUnsafe(sizeOrArray)
          : new util.Array(sizeOrArray)
        : util.Buffer
        ? util._Buffer_from(sizeOrArray)
        : typeof Uint8Array === 'undefined'
        ? sizeOrArray
        : new Uint8Array(sizeOrArray)
    }
    util.Array = typeof Uint8Array !== 'undefined' ? Uint8Array : Array
    util.Long =
      (util.global.dcodeIO && util.global.dcodeIO.Long) ||
      util.global.Long ||
      util.inquire('long')
    util.key2Re = /^true|false|0|1$/
    util.key32Re = /^-?(?:0|[1-9][0-9]*)$/
    util.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/
    util.longToHash = function longToHash(value) {
      return value ? util.LongBits.from(value).toHash() : util.LongBits.zeroHash
    }
    util.longFromHash = function longFromHash(hash, unsigned) {
      var bits = util.LongBits.fromHash(hash)
      if (util.Long) return util.Long.fromBits(bits.lo, bits.hi, unsigned)
      return bits.toNumber(Boolean(unsigned))
    }
    function merge(dst, src2, ifNotSet) {
      for (var keys = Object.keys(src2), i = 0; i < keys.length; ++i)
        if (dst[keys[i]] === void 0 || !ifNotSet) dst[keys[i]] = src2[keys[i]]
      return dst
    }
    util.merge = merge
    util.lcFirst = function lcFirst(str) {
      return str.charAt(0).toLowerCase() + str.substring(1)
    }
    function newError(name6) {
      function CustomError(message, properties) {
        if (!(this instanceof CustomError))
          return new CustomError(message, properties)
        Object.defineProperty(this, 'message', {
          get: function () {
            return message
          },
        })
        if (Error.captureStackTrace) Error.captureStackTrace(this, CustomError)
        else
          Object.defineProperty(this, 'stack', {
            value: new Error().stack || '',
          })
        if (properties) merge(this, properties)
      }
      ;(CustomError.prototype = Object.create(Error.prototype)).constructor =
        CustomError
      Object.defineProperty(CustomError.prototype, 'name', {
        get: function () {
          return name6
        },
      })
      CustomError.prototype.toString = function toString3() {
        return this.name + ': ' + this.message
      }
      return CustomError
    }
    util.newError = newError
    util.ProtocolError = newError('ProtocolError')
    util.oneOfGetter = function getOneOf(fieldNames) {
      var fieldMap = {}
      for (var i = 0; i < fieldNames.length; ++i) fieldMap[fieldNames[i]] = 1
      return function () {
        for (var keys = Object.keys(this), i2 = keys.length - 1; i2 > -1; --i2)
          if (
            fieldMap[keys[i2]] === 1 &&
            this[keys[i2]] !== void 0 &&
            this[keys[i2]] !== null
          )
            return keys[i2]
      }
    }
    util.oneOfSetter = function setOneOf(fieldNames) {
      return function (name6) {
        for (var i = 0; i < fieldNames.length; ++i)
          if (fieldNames[i] !== name6) delete this[fieldNames[i]]
      }
    }
    util.toJSONOptions = {
      longs: String,
      enums: String,
      bytes: String,
      json: true,
    }
    util._configure = function () {
      var Buffer2 = util.Buffer
      if (!Buffer2) {
        util._Buffer_from = util._Buffer_allocUnsafe = null
        return
      }
      util._Buffer_from =
        (Buffer2.from !== Uint8Array.from && Buffer2.from) ||
        function Buffer_from(value, encoding) {
          return new Buffer2(value, encoding)
        }
      util._Buffer_allocUnsafe =
        Buffer2.allocUnsafe ||
        function Buffer_allocUnsafe(size) {
          return new Buffer2(size)
        }
    }
  },
})

// node_modules/protobufjs/src/writer.js
var require_writer = __commonJS({
  'node_modules/protobufjs/src/writer.js'(exports2, module2) {
    'use strict'
    module2.exports = Writer
    var util = require_minimal()
    var BufferWriter
    var LongBits = util.LongBits
    var base642 = util.base64
    var utf8 = util.utf8
    function Op(fn, len, val) {
      this.fn = fn
      this.len = len
      this.next = void 0
      this.val = val
    }
    function noop2() {}
    function State(writer) {
      this.head = writer.head
      this.tail = writer.tail
      this.len = writer.len
      this.next = writer.states
    }
    function Writer() {
      this.len = 0
      this.head = new Op(noop2, 0, 0)
      this.tail = this.head
      this.states = null
    }
    var create4 = function create5() {
      return util.Buffer
        ? function create_buffer_setup() {
            return (Writer.create = function create_buffer() {
              return new BufferWriter()
            })()
          }
        : function create_array() {
            return new Writer()
          }
    }
    Writer.create = create4()
    Writer.alloc = function alloc2(size) {
      return new util.Array(size)
    }
    if (util.Array !== Array)
      Writer.alloc = util.pool(Writer.alloc, util.Array.prototype.subarray)
    Writer.prototype._push = function push(fn, len, val) {
      this.tail = this.tail.next = new Op(fn, len, val)
      this.len += len
      return this
    }
    function writeByte(val, buf2, pos) {
      buf2[pos] = val & 255
    }
    function writeVarint32(val, buf2, pos) {
      while (val > 127) {
        buf2[pos++] = (val & 127) | 128
        val >>>= 7
      }
      buf2[pos] = val
    }
    function VarintOp(len, val) {
      this.len = len
      this.next = void 0
      this.val = val
    }
    VarintOp.prototype = Object.create(Op.prototype)
    VarintOp.prototype.fn = writeVarint32
    Writer.prototype.uint32 = function write_uint32(value) {
      this.len += (this.tail = this.tail.next =
        new VarintOp(
          (value = value >>> 0) < 128
            ? 1
            : value < 16384
            ? 2
            : value < 2097152
            ? 3
            : value < 268435456
            ? 4
            : 5,
          value
        )).len
      return this
    }
    Writer.prototype.int32 = function write_int32(value) {
      return value < 0
        ? this._push(writeVarint64, 10, LongBits.fromNumber(value))
        : this.uint32(value)
    }
    Writer.prototype.sint32 = function write_sint32(value) {
      return this.uint32(((value << 1) ^ (value >> 31)) >>> 0)
    }
    function writeVarint64(val, buf2, pos) {
      while (val.hi) {
        buf2[pos++] = (val.lo & 127) | 128
        val.lo = ((val.lo >>> 7) | (val.hi << 25)) >>> 0
        val.hi >>>= 7
      }
      while (val.lo > 127) {
        buf2[pos++] = (val.lo & 127) | 128
        val.lo = val.lo >>> 7
      }
      buf2[pos++] = val.lo
    }
    Writer.prototype.uint64 = function write_uint64(value) {
      var bits = LongBits.from(value)
      return this._push(writeVarint64, bits.length(), bits)
    }
    Writer.prototype.int64 = Writer.prototype.uint64
    Writer.prototype.sint64 = function write_sint64(value) {
      var bits = LongBits.from(value).zzEncode()
      return this._push(writeVarint64, bits.length(), bits)
    }
    Writer.prototype.bool = function write_bool(value) {
      return this._push(writeByte, 1, value ? 1 : 0)
    }
    function writeFixed32(val, buf2, pos) {
      buf2[pos] = val & 255
      buf2[pos + 1] = (val >>> 8) & 255
      buf2[pos + 2] = (val >>> 16) & 255
      buf2[pos + 3] = val >>> 24
    }
    Writer.prototype.fixed32 = function write_fixed32(value) {
      return this._push(writeFixed32, 4, value >>> 0)
    }
    Writer.prototype.sfixed32 = Writer.prototype.fixed32
    Writer.prototype.fixed64 = function write_fixed64(value) {
      var bits = LongBits.from(value)
      return this._push(writeFixed32, 4, bits.lo)._push(
        writeFixed32,
        4,
        bits.hi
      )
    }
    Writer.prototype.sfixed64 = Writer.prototype.fixed64
    Writer.prototype.float = function write_float(value) {
      return this._push(util.float.writeFloatLE, 4, value)
    }
    Writer.prototype.double = function write_double(value) {
      return this._push(util.float.writeDoubleLE, 8, value)
    }
    var writeBytes = util.Array.prototype.set
      ? function writeBytes_set(val, buf2, pos) {
          buf2.set(val, pos)
        }
      : function writeBytes_for(val, buf2, pos) {
          for (var i = 0; i < val.length; ++i) buf2[pos + i] = val[i]
        }
    Writer.prototype.bytes = function write_bytes(value) {
      var len = value.length >>> 0
      if (!len) return this._push(writeByte, 1, 0)
      if (util.isString(value)) {
        var buf2 = Writer.alloc((len = base642.length(value)))
        base642.decode(value, buf2, 0)
        value = buf2
      }
      return this.uint32(len)._push(writeBytes, len, value)
    }
    Writer.prototype.string = function write_string(value) {
      var len = utf8.length(value)
      return len
        ? this.uint32(len)._push(utf8.write, len, value)
        : this._push(writeByte, 1, 0)
    }
    Writer.prototype.fork = function fork() {
      this.states = new State(this)
      this.head = this.tail = new Op(noop2, 0, 0)
      this.len = 0
      return this
    }
    Writer.prototype.reset = function reset() {
      if (this.states) {
        this.head = this.states.head
        this.tail = this.states.tail
        this.len = this.states.len
        this.states = this.states.next
      } else {
        this.head = this.tail = new Op(noop2, 0, 0)
        this.len = 0
      }
      return this
    }
    Writer.prototype.ldelim = function ldelim() {
      var head = this.head,
        tail = this.tail,
        len = this.len
      this.reset().uint32(len)
      if (len) {
        this.tail.next = head.next
        this.tail = tail
        this.len += len
      }
      return this
    }
    Writer.prototype.finish = function finish() {
      var head = this.head.next,
        buf2 = this.constructor.alloc(this.len),
        pos = 0
      while (head) {
        head.fn(head.val, buf2, pos)
        pos += head.len
        head = head.next
      }
      return buf2
    }
    Writer._configure = function (BufferWriter_) {
      BufferWriter = BufferWriter_
      Writer.create = create4()
      BufferWriter._configure()
    }
  },
})

// node_modules/protobufjs/src/writer_buffer.js
var require_writer_buffer = __commonJS({
  'node_modules/protobufjs/src/writer_buffer.js'(exports2, module2) {
    'use strict'
    module2.exports = BufferWriter
    var Writer = require_writer()
    ;(BufferWriter.prototype = Object.create(Writer.prototype)).constructor =
      BufferWriter
    var util = require_minimal()
    function BufferWriter() {
      Writer.call(this)
    }
    BufferWriter._configure = function () {
      BufferWriter.alloc = util._Buffer_allocUnsafe
      BufferWriter.writeBytesBuffer =
        util.Buffer &&
        util.Buffer.prototype instanceof Uint8Array &&
        util.Buffer.prototype.set.name === 'set'
          ? function writeBytesBuffer_set(val, buf2, pos) {
              buf2.set(val, pos)
            }
          : function writeBytesBuffer_copy(val, buf2, pos) {
              if (val.copy) val.copy(buf2, pos, 0, val.length)
              else for (var i = 0; i < val.length; ) buf2[pos++] = val[i++]
            }
    }
    BufferWriter.prototype.bytes = function write_bytes_buffer(value) {
      if (util.isString(value)) value = util._Buffer_from(value, 'base64')
      var len = value.length >>> 0
      this.uint32(len)
      if (len) this._push(BufferWriter.writeBytesBuffer, len, value)
      return this
    }
    function writeStringBuffer(val, buf2, pos) {
      if (val.length < 40) util.utf8.write(val, buf2, pos)
      else if (buf2.utf8Write) buf2.utf8Write(val, pos)
      else buf2.write(val, pos)
    }
    BufferWriter.prototype.string = function write_string_buffer(value) {
      var len = util.Buffer.byteLength(value)
      this.uint32(len)
      if (len) this._push(writeStringBuffer, len, value)
      return this
    }
    BufferWriter._configure()
  },
})

// node_modules/protobufjs/src/reader.js
var require_reader = __commonJS({
  'node_modules/protobufjs/src/reader.js'(exports2, module2) {
    'use strict'
    module2.exports = Reader
    var util = require_minimal()
    var BufferReader
    var LongBits = util.LongBits
    var utf8 = util.utf8
    function indexOutOfRange(reader, writeLength) {
      return RangeError(
        'index out of range: ' +
          reader.pos +
          ' + ' +
          (writeLength || 1) +
          ' > ' +
          reader.len
      )
    }
    function Reader(buffer2) {
      this.buf = buffer2
      this.pos = 0
      this.len = buffer2.length
    }
    var create_array =
      typeof Uint8Array !== 'undefined'
        ? function create_typed_array(buffer2) {
            if (buffer2 instanceof Uint8Array || Array.isArray(buffer2))
              return new Reader(buffer2)
            throw Error('illegal buffer')
          }
        : function create_array2(buffer2) {
            if (Array.isArray(buffer2)) return new Reader(buffer2)
            throw Error('illegal buffer')
          }
    var create4 = function create5() {
      return util.Buffer
        ? function create_buffer_setup(buffer2) {
            return (Reader.create = function create_buffer(buffer3) {
              return util.Buffer.isBuffer(buffer3)
                ? new BufferReader(buffer3)
                : create_array(buffer3)
            })(buffer2)
          }
        : create_array
    }
    Reader.create = create4()
    Reader.prototype._slice =
      util.Array.prototype.subarray || util.Array.prototype.slice
    Reader.prototype.uint32 = (function read_uint32_setup() {
      var value = 4294967295
      return function read_uint32() {
        value = (this.buf[this.pos] & 127) >>> 0
        if (this.buf[this.pos++] < 128) return value
        value = (value | ((this.buf[this.pos] & 127) << 7)) >>> 0
        if (this.buf[this.pos++] < 128) return value
        value = (value | ((this.buf[this.pos] & 127) << 14)) >>> 0
        if (this.buf[this.pos++] < 128) return value
        value = (value | ((this.buf[this.pos] & 127) << 21)) >>> 0
        if (this.buf[this.pos++] < 128) return value
        value = (value | ((this.buf[this.pos] & 15) << 28)) >>> 0
        if (this.buf[this.pos++] < 128) return value
        if ((this.pos += 5) > this.len) {
          this.pos = this.len
          throw indexOutOfRange(this, 10)
        }
        return value
      }
    })()
    Reader.prototype.int32 = function read_int32() {
      return this.uint32() | 0
    }
    Reader.prototype.sint32 = function read_sint32() {
      var value = this.uint32()
      return ((value >>> 1) ^ -(value & 1)) | 0
    }
    function readLongVarint() {
      var bits = new LongBits(0, 0)
      var i = 0
      if (this.len - this.pos > 4) {
        for (; i < 4; ++i) {
          bits.lo = (bits.lo | ((this.buf[this.pos] & 127) << (i * 7))) >>> 0
          if (this.buf[this.pos++] < 128) return bits
        }
        bits.lo = (bits.lo | ((this.buf[this.pos] & 127) << 28)) >>> 0
        bits.hi = (bits.hi | ((this.buf[this.pos] & 127) >> 4)) >>> 0
        if (this.buf[this.pos++] < 128) return bits
        i = 0
      } else {
        for (; i < 3; ++i) {
          if (this.pos >= this.len) throw indexOutOfRange(this)
          bits.lo = (bits.lo | ((this.buf[this.pos] & 127) << (i * 7))) >>> 0
          if (this.buf[this.pos++] < 128) return bits
        }
        bits.lo = (bits.lo | ((this.buf[this.pos++] & 127) << (i * 7))) >>> 0
        return bits
      }
      if (this.len - this.pos > 4) {
        for (; i < 5; ++i) {
          bits.hi =
            (bits.hi | ((this.buf[this.pos] & 127) << (i * 7 + 3))) >>> 0
          if (this.buf[this.pos++] < 128) return bits
        }
      } else {
        for (; i < 5; ++i) {
          if (this.pos >= this.len) throw indexOutOfRange(this)
          bits.hi =
            (bits.hi | ((this.buf[this.pos] & 127) << (i * 7 + 3))) >>> 0
          if (this.buf[this.pos++] < 128) return bits
        }
      }
      throw Error('invalid varint encoding')
    }
    Reader.prototype.bool = function read_bool() {
      return this.uint32() !== 0
    }
    function readFixed32_end(buf2, end) {
      return (
        (buf2[end - 4] |
          (buf2[end - 3] << 8) |
          (buf2[end - 2] << 16) |
          (buf2[end - 1] << 24)) >>>
        0
      )
    }
    Reader.prototype.fixed32 = function read_fixed32() {
      if (this.pos + 4 > this.len) throw indexOutOfRange(this, 4)
      return readFixed32_end(this.buf, (this.pos += 4))
    }
    Reader.prototype.sfixed32 = function read_sfixed32() {
      if (this.pos + 4 > this.len) throw indexOutOfRange(this, 4)
      return readFixed32_end(this.buf, (this.pos += 4)) | 0
    }
    function readFixed64() {
      if (this.pos + 8 > this.len) throw indexOutOfRange(this, 8)
      return new LongBits(
        readFixed32_end(this.buf, (this.pos += 4)),
        readFixed32_end(this.buf, (this.pos += 4))
      )
    }
    Reader.prototype.float = function read_float() {
      if (this.pos + 4 > this.len) throw indexOutOfRange(this, 4)
      var value = util.float.readFloatLE(this.buf, this.pos)
      this.pos += 4
      return value
    }
    Reader.prototype.double = function read_double() {
      if (this.pos + 8 > this.len) throw indexOutOfRange(this, 4)
      var value = util.float.readDoubleLE(this.buf, this.pos)
      this.pos += 8
      return value
    }
    Reader.prototype.bytes = function read_bytes() {
      var length2 = this.uint32(),
        start = this.pos,
        end = this.pos + length2
      if (end > this.len) throw indexOutOfRange(this, length2)
      this.pos += length2
      if (Array.isArray(this.buf)) return this.buf.slice(start, end)
      return start === end
        ? new this.buf.constructor(0)
        : this._slice.call(this.buf, start, end)
    }
    Reader.prototype.string = function read_string() {
      var bytes2 = this.bytes()
      return utf8.read(bytes2, 0, bytes2.length)
    }
    Reader.prototype.skip = function skip(length2) {
      if (typeof length2 === 'number') {
        if (this.pos + length2 > this.len) throw indexOutOfRange(this, length2)
        this.pos += length2
      } else {
        do {
          if (this.pos >= this.len) throw indexOutOfRange(this)
        } while (this.buf[this.pos++] & 128)
      }
      return this
    }
    Reader.prototype.skipType = function (wireType) {
      switch (wireType) {
        case 0:
          this.skip()
          break
        case 1:
          this.skip(8)
          break
        case 2:
          this.skip(this.uint32())
          break
        case 3:
          while ((wireType = this.uint32() & 7) !== 4) {
            this.skipType(wireType)
          }
          break
        case 5:
          this.skip(4)
          break
        default:
          throw Error(
            'invalid wire type ' + wireType + ' at offset ' + this.pos
          )
      }
      return this
    }
    Reader._configure = function (BufferReader_) {
      BufferReader = BufferReader_
      Reader.create = create4()
      BufferReader._configure()
      var fn = util.Long ? 'toLong' : 'toNumber'
      util.merge(Reader.prototype, {
        int64: function read_int64() {
          return readLongVarint.call(this)[fn](false)
        },
        uint64: function read_uint64() {
          return readLongVarint.call(this)[fn](true)
        },
        sint64: function read_sint64() {
          return readLongVarint.call(this).zzDecode()[fn](false)
        },
        fixed64: function read_fixed64() {
          return readFixed64.call(this)[fn](true)
        },
        sfixed64: function read_sfixed64() {
          return readFixed64.call(this)[fn](false)
        },
      })
    }
  },
})

// node_modules/protobufjs/src/reader_buffer.js
var require_reader_buffer = __commonJS({
  'node_modules/protobufjs/src/reader_buffer.js'(exports2, module2) {
    'use strict'
    module2.exports = BufferReader
    var Reader = require_reader()
    ;(BufferReader.prototype = Object.create(Reader.prototype)).constructor =
      BufferReader
    var util = require_minimal()
    function BufferReader(buffer2) {
      Reader.call(this, buffer2)
    }
    BufferReader._configure = function () {
      if (util.Buffer)
        BufferReader.prototype._slice = util.Buffer.prototype.slice
    }
    BufferReader.prototype.string = function read_string_buffer() {
      var len = this.uint32()
      return this.buf.utf8Slice
        ? this.buf.utf8Slice(
            this.pos,
            (this.pos = Math.min(this.pos + len, this.len))
          )
        : this.buf.toString(
            'utf-8',
            this.pos,
            (this.pos = Math.min(this.pos + len, this.len))
          )
    }
    BufferReader._configure()
  },
})

// node_modules/protobufjs/src/rpc/service.js
var require_service = __commonJS({
  'node_modules/protobufjs/src/rpc/service.js'(exports2, module2) {
    'use strict'
    module2.exports = Service
    var util = require_minimal()
    ;(Service.prototype = Object.create(
      util.EventEmitter.prototype
    )).constructor = Service
    function Service(rpcImpl, requestDelimited, responseDelimited) {
      if (typeof rpcImpl !== 'function')
        throw TypeError('rpcImpl must be a function')
      util.EventEmitter.call(this)
      this.rpcImpl = rpcImpl
      this.requestDelimited = Boolean(requestDelimited)
      this.responseDelimited = Boolean(responseDelimited)
    }
    Service.prototype.rpcCall = function rpcCall(
      method,
      requestCtor,
      responseCtor,
      request,
      callback
    ) {
      if (!request) throw TypeError('request must be specified')
      var self2 = this
      if (!callback)
        return util.asPromise(
          rpcCall,
          self2,
          method,
          requestCtor,
          responseCtor,
          request
        )
      if (!self2.rpcImpl) {
        setTimeout(function () {
          callback(Error('already ended'))
        }, 0)
        return void 0
      }
      try {
        return self2.rpcImpl(
          method,
          requestCtor[self2.requestDelimited ? 'encodeDelimited' : 'encode'](
            request
          ).finish(),
          function rpcCallback(err, response) {
            if (err) {
              self2.emit('error', err, method)
              return callback(err)
            }
            if (response === null) {
              self2.end(true)
              return void 0
            }
            if (!(response instanceof responseCtor)) {
              try {
                response =
                  responseCtor[
                    self2.responseDelimited ? 'decodeDelimited' : 'decode'
                  ](response)
              } catch (err2) {
                self2.emit('error', err2, method)
                return callback(err2)
              }
            }
            self2.emit('data', response, method)
            return callback(null, response)
          }
        )
      } catch (err) {
        self2.emit('error', err, method)
        setTimeout(function () {
          callback(err)
        }, 0)
        return void 0
      }
    }
    Service.prototype.end = function end(endedByRPC) {
      if (this.rpcImpl) {
        if (!endedByRPC) this.rpcImpl(null, null, null)
        this.rpcImpl = null
        this.emit('end').off()
      }
      return this
    }
  },
})

// node_modules/protobufjs/src/rpc.js
var require_rpc = __commonJS({
  'node_modules/protobufjs/src/rpc.js'(exports2) {
    'use strict'
    var rpc = exports2
    rpc.Service = require_service()
  },
})

// node_modules/protobufjs/src/roots.js
var require_roots = __commonJS({
  'node_modules/protobufjs/src/roots.js'(exports2, module2) {
    'use strict'
    module2.exports = {}
  },
})

// node_modules/protobufjs/src/index-minimal.js
var require_index_minimal = __commonJS({
  'node_modules/protobufjs/src/index-minimal.js'(exports2) {
    'use strict'
    var protobuf = exports2
    protobuf.build = 'minimal'
    protobuf.Writer = require_writer()
    protobuf.BufferWriter = require_writer_buffer()
    protobuf.Reader = require_reader()
    protobuf.BufferReader = require_reader_buffer()
    protobuf.util = require_minimal()
    protobuf.rpc = require_rpc()
    protobuf.roots = require_roots()
    protobuf.configure = configure
    function configure() {
      protobuf.util._configure()
      protobuf.Writer._configure(protobuf.BufferWriter)
      protobuf.Reader._configure(protobuf.BufferReader)
    }
    configure()
  },
})

// node_modules/protobufjs/minimal.js
var require_minimal2 = __commonJS({
  'node_modules/protobufjs/minimal.js'(exports2, module2) {
    'use strict'
    module2.exports = require_index_minimal()
  },
})

// node_modules/it-all/index.js
var require_it_all = __commonJS({
  'node_modules/it-all/index.js'(exports2, module2) {
    'use strict'
    var all4 = async (source) => {
      const arr = []
      for await (const entry of source) {
        arr.push(entry)
      }
      return arr
    }
    module2.exports = all4
  },
})

// node_modules/base64-js/index.js
var require_base64_js = __commonJS({
  'node_modules/base64-js/index.js'(exports2) {
    'use strict'
    exports2.byteLength = byteLength
    exports2.toByteArray = toByteArray
    exports2.fromByteArray = fromByteArray
    var lookup = []
    var revLookup = []
    var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array
    var code6 =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    for (i = 0, len = code6.length; i < len; ++i) {
      lookup[i] = code6[i]
      revLookup[code6.charCodeAt(i)] = i
    }
    var i
    var len
    revLookup['-'.charCodeAt(0)] = 62
    revLookup['_'.charCodeAt(0)] = 63
    function getLens(b64) {
      var len2 = b64.length
      if (len2 % 4 > 0) {
        throw new Error('Invalid string. Length must be a multiple of 4')
      }
      var validLen = b64.indexOf('=')
      if (validLen === -1) validLen = len2
      var placeHoldersLen = validLen === len2 ? 0 : 4 - (validLen % 4)
      return [validLen, placeHoldersLen]
    }
    function byteLength(b64) {
      var lens = getLens(b64)
      var validLen = lens[0]
      var placeHoldersLen = lens[1]
      return ((validLen + placeHoldersLen) * 3) / 4 - placeHoldersLen
    }
    function _byteLength(b64, validLen, placeHoldersLen) {
      return ((validLen + placeHoldersLen) * 3) / 4 - placeHoldersLen
    }
    function toByteArray(b64) {
      var tmp
      var lens = getLens(b64)
      var validLen = lens[0]
      var placeHoldersLen = lens[1]
      var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))
      var curByte = 0
      var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen
      var i2
      for (i2 = 0; i2 < len2; i2 += 4) {
        tmp =
          (revLookup[b64.charCodeAt(i2)] << 18) |
          (revLookup[b64.charCodeAt(i2 + 1)] << 12) |
          (revLookup[b64.charCodeAt(i2 + 2)] << 6) |
          revLookup[b64.charCodeAt(i2 + 3)]
        arr[curByte++] = (tmp >> 16) & 255
        arr[curByte++] = (tmp >> 8) & 255
        arr[curByte++] = tmp & 255
      }
      if (placeHoldersLen === 2) {
        tmp =
          (revLookup[b64.charCodeAt(i2)] << 2) |
          (revLookup[b64.charCodeAt(i2 + 1)] >> 4)
        arr[curByte++] = tmp & 255
      }
      if (placeHoldersLen === 1) {
        tmp =
          (revLookup[b64.charCodeAt(i2)] << 10) |
          (revLookup[b64.charCodeAt(i2 + 1)] << 4) |
          (revLookup[b64.charCodeAt(i2 + 2)] >> 2)
        arr[curByte++] = (tmp >> 8) & 255
        arr[curByte++] = tmp & 255
      }
      return arr
    }
    function tripletToBase64(num) {
      return (
        lookup[(num >> 18) & 63] +
        lookup[(num >> 12) & 63] +
        lookup[(num >> 6) & 63] +
        lookup[num & 63]
      )
    }
    function encodeChunk(uint8, start, end) {
      var tmp
      var output = []
      for (var i2 = start; i2 < end; i2 += 3) {
        tmp =
          ((uint8[i2] << 16) & 16711680) +
          ((uint8[i2 + 1] << 8) & 65280) +
          (uint8[i2 + 2] & 255)
        output.push(tripletToBase64(tmp))
      }
      return output.join('')
    }
    function fromByteArray(uint8) {
      var tmp
      var len2 = uint8.length
      var extraBytes = len2 % 3
      var parts = []
      var maxChunkLength = 16383
      for (
        var i2 = 0, len22 = len2 - extraBytes;
        i2 < len22;
        i2 += maxChunkLength
      ) {
        parts.push(
          encodeChunk(
            uint8,
            i2,
            i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength
          )
        )
      }
      if (extraBytes === 1) {
        tmp = uint8[len2 - 1]
        parts.push(lookup[tmp >> 2] + lookup[(tmp << 4) & 63] + '==')
      } else if (extraBytes === 2) {
        tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1]
        parts.push(
          lookup[tmp >> 10] +
            lookup[(tmp >> 4) & 63] +
            lookup[(tmp << 2) & 63] +
            '='
        )
      }
      return parts.join('')
    }
  },
})

// node_modules/ieee754/index.js
var require_ieee754 = __commonJS({
  'node_modules/ieee754/index.js'(exports2) {
    exports2.read = function (buffer2, offset, isLE, mLen, nBytes) {
      var e, m
      var eLen = nBytes * 8 - mLen - 1
      var eMax = (1 << eLen) - 1
      var eBias = eMax >> 1
      var nBits = -7
      var i = isLE ? nBytes - 1 : 0
      var d = isLE ? -1 : 1
      var s = buffer2[offset + i]
      i += d
      e = s & ((1 << -nBits) - 1)
      s >>= -nBits
      nBits += eLen
      for (
        ;
        nBits > 0;
        e = e * 256 + buffer2[offset + i], i += d, nBits -= 8
      ) {}
      m = e & ((1 << -nBits) - 1)
      e >>= -nBits
      nBits += mLen
      for (
        ;
        nBits > 0;
        m = m * 256 + buffer2[offset + i], i += d, nBits -= 8
      ) {}
      if (e === 0) {
        e = 1 - eBias
      } else if (e === eMax) {
        return m ? NaN : (s ? -1 : 1) * Infinity
      } else {
        m = m + Math.pow(2, mLen)
        e = e - eBias
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
    }
    exports2.write = function (buffer2, value, offset, isLE, mLen, nBytes) {
      var e, m, c
      var eLen = nBytes * 8 - mLen - 1
      var eMax = (1 << eLen) - 1
      var eBias = eMax >> 1
      var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0
      var i = isLE ? 0 : nBytes - 1
      var d = isLE ? 1 : -1
      var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0
      value = Math.abs(value)
      if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0
        e = eMax
      } else {
        e = Math.floor(Math.log(value) / Math.LN2)
        if (value * (c = Math.pow(2, -e)) < 1) {
          e--
          c *= 2
        }
        if (e + eBias >= 1) {
          value += rt / c
        } else {
          value += rt * Math.pow(2, 1 - eBias)
        }
        if (value * c >= 2) {
          e++
          c /= 2
        }
        if (e + eBias >= eMax) {
          m = 0
          e = eMax
        } else if (e + eBias >= 1) {
          m = (value * c - 1) * Math.pow(2, mLen)
          e = e + eBias
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
          e = 0
        }
      }
      for (
        ;
        mLen >= 8;
        buffer2[offset + i] = m & 255, i += d, m /= 256, mLen -= 8
      ) {}
      e = (e << mLen) | m
      eLen += mLen
      for (
        ;
        eLen > 0;
        buffer2[offset + i] = e & 255, i += d, e /= 256, eLen -= 8
      ) {}
      buffer2[offset + i - d] |= s * 128
    }
  },
})

// node_modules/bl/node_modules/buffer/index.js
var require_buffer = __commonJS({
  'node_modules/bl/node_modules/buffer/index.js'(exports2) {
    'use strict'
    var base642 = require_base64_js()
    var ieee754 = require_ieee754()
    var customInspectSymbol =
      typeof Symbol === 'function' && typeof Symbol['for'] === 'function'
        ? Symbol['for']('nodejs.util.inspect.custom')
        : null
    exports2.Buffer = Buffer2
    exports2.SlowBuffer = SlowBuffer
    exports2.INSPECT_MAX_BYTES = 50
    var K_MAX_LENGTH = 2147483647
    exports2.kMaxLength = K_MAX_LENGTH
    Buffer2.TYPED_ARRAY_SUPPORT = typedArraySupport()
    if (
      !Buffer2.TYPED_ARRAY_SUPPORT &&
      typeof console !== 'undefined' &&
      typeof console.error === 'function'
    ) {
      console.error(
        'This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
      )
    }
    function typedArraySupport() {
      try {
        const arr = new Uint8Array(1)
        const proto = {
          foo: function () {
            return 42
          },
        }
        Object.setPrototypeOf(proto, Uint8Array.prototype)
        Object.setPrototypeOf(arr, proto)
        return arr.foo() === 42
      } catch (e) {
        return false
      }
    }
    Object.defineProperty(Buffer2.prototype, 'parent', {
      enumerable: true,
      get: function () {
        if (!Buffer2.isBuffer(this)) return void 0
        return this.buffer
      },
    })
    Object.defineProperty(Buffer2.prototype, 'offset', {
      enumerable: true,
      get: function () {
        if (!Buffer2.isBuffer(this)) return void 0
        return this.byteOffset
      },
    })
    function createBuffer(length2) {
      if (length2 > K_MAX_LENGTH) {
        throw new RangeError(
          'The value "' + length2 + '" is invalid for option "size"'
        )
      }
      const buf2 = new Uint8Array(length2)
      Object.setPrototypeOf(buf2, Buffer2.prototype)
      return buf2
    }
    function Buffer2(arg, encodingOrOffset, length2) {
      if (typeof arg === 'number') {
        if (typeof encodingOrOffset === 'string') {
          throw new TypeError(
            'The "string" argument must be of type string. Received type number'
          )
        }
        return allocUnsafe(arg)
      }
      return from3(arg, encodingOrOffset, length2)
    }
    Buffer2.poolSize = 8192
    function from3(value, encodingOrOffset, length2) {
      if (typeof value === 'string') {
        return fromString4(value, encodingOrOffset)
      }
      if (ArrayBuffer.isView(value)) {
        return fromArrayView(value)
      }
      if (value == null) {
        throw new TypeError(
          'The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type ' +
            typeof value
        )
      }
      if (
        isInstance(value, ArrayBuffer) ||
        (value && isInstance(value.buffer, ArrayBuffer))
      ) {
        return fromArrayBuffer(value, encodingOrOffset, length2)
      }
      if (
        typeof SharedArrayBuffer !== 'undefined' &&
        (isInstance(value, SharedArrayBuffer) ||
          (value && isInstance(value.buffer, SharedArrayBuffer)))
      ) {
        return fromArrayBuffer(value, encodingOrOffset, length2)
      }
      if (typeof value === 'number') {
        throw new TypeError(
          'The "value" argument must not be of type number. Received type number'
        )
      }
      const valueOf = value.valueOf && value.valueOf()
      if (valueOf != null && valueOf !== value) {
        return Buffer2.from(valueOf, encodingOrOffset, length2)
      }
      const b = fromObject(value)
      if (b) return b
      if (
        typeof Symbol !== 'undefined' &&
        Symbol.toPrimitive != null &&
        typeof value[Symbol.toPrimitive] === 'function'
      ) {
        return Buffer2.from(
          value[Symbol.toPrimitive]('string'),
          encodingOrOffset,
          length2
        )
      }
      throw new TypeError(
        'The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type ' +
          typeof value
      )
    }
    Buffer2.from = function (value, encodingOrOffset, length2) {
      return from3(value, encodingOrOffset, length2)
    }
    Object.setPrototypeOf(Buffer2.prototype, Uint8Array.prototype)
    Object.setPrototypeOf(Buffer2, Uint8Array)
    function assertSize(size) {
      if (typeof size !== 'number') {
        throw new TypeError('"size" argument must be of type number')
      } else if (size < 0) {
        throw new RangeError(
          'The value "' + size + '" is invalid for option "size"'
        )
      }
    }
    function alloc2(size, fill, encoding) {
      assertSize(size)
      if (size <= 0) {
        return createBuffer(size)
      }
      if (fill !== void 0) {
        return typeof encoding === 'string'
          ? createBuffer(size).fill(fill, encoding)
          : createBuffer(size).fill(fill)
      }
      return createBuffer(size)
    }
    Buffer2.alloc = function (size, fill, encoding) {
      return alloc2(size, fill, encoding)
    }
    function allocUnsafe(size) {
      assertSize(size)
      return createBuffer(size < 0 ? 0 : checked(size) | 0)
    }
    Buffer2.allocUnsafe = function (size) {
      return allocUnsafe(size)
    }
    Buffer2.allocUnsafeSlow = function (size) {
      return allocUnsafe(size)
    }
    function fromString4(string3, encoding) {
      if (typeof encoding !== 'string' || encoding === '') {
        encoding = 'utf8'
      }
      if (!Buffer2.isEncoding(encoding)) {
        throw new TypeError('Unknown encoding: ' + encoding)
      }
      const length2 = byteLength(string3, encoding) | 0
      let buf2 = createBuffer(length2)
      const actual = buf2.write(string3, encoding)
      if (actual !== length2) {
        buf2 = buf2.slice(0, actual)
      }
      return buf2
    }
    function fromArrayLike(array2) {
      const length2 = array2.length < 0 ? 0 : checked(array2.length) | 0
      const buf2 = createBuffer(length2)
      for (let i = 0; i < length2; i += 1) {
        buf2[i] = array2[i] & 255
      }
      return buf2
    }
    function fromArrayView(arrayView) {
      if (isInstance(arrayView, Uint8Array)) {
        const copy = new Uint8Array(arrayView)
        return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength)
      }
      return fromArrayLike(arrayView)
    }
    function fromArrayBuffer(array2, byteOffset, length2) {
      if (byteOffset < 0 || array2.byteLength < byteOffset) {
        throw new RangeError('"offset" is outside of buffer bounds')
      }
      if (array2.byteLength < byteOffset + (length2 || 0)) {
        throw new RangeError('"length" is outside of buffer bounds')
      }
      let buf2
      if (byteOffset === void 0 && length2 === void 0) {
        buf2 = new Uint8Array(array2)
      } else if (length2 === void 0) {
        buf2 = new Uint8Array(array2, byteOffset)
      } else {
        buf2 = new Uint8Array(array2, byteOffset, length2)
      }
      Object.setPrototypeOf(buf2, Buffer2.prototype)
      return buf2
    }
    function fromObject(obj) {
      if (Buffer2.isBuffer(obj)) {
        const len = checked(obj.length) | 0
        const buf2 = createBuffer(len)
        if (buf2.length === 0) {
          return buf2
        }
        obj.copy(buf2, 0, 0, len)
        return buf2
      }
      if (obj.length !== void 0) {
        if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
          return createBuffer(0)
        }
        return fromArrayLike(obj)
      }
      if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
        return fromArrayLike(obj.data)
      }
    }
    function checked(length2) {
      if (length2 >= K_MAX_LENGTH) {
        throw new RangeError(
          'Attempt to allocate Buffer larger than maximum size: 0x' +
            K_MAX_LENGTH.toString(16) +
            ' bytes'
        )
      }
      return length2 | 0
    }
    function SlowBuffer(length2) {
      if (+length2 != length2) {
        length2 = 0
      }
      return Buffer2.alloc(+length2)
    }
    Buffer2.isBuffer = function isBuffer3(b) {
      return b != null && b._isBuffer === true && b !== Buffer2.prototype
    }
    Buffer2.compare = function compare2(a, b) {
      if (isInstance(a, Uint8Array)) a = Buffer2.from(a, a.offset, a.byteLength)
      if (isInstance(b, Uint8Array)) b = Buffer2.from(b, b.offset, b.byteLength)
      if (!Buffer2.isBuffer(a) || !Buffer2.isBuffer(b)) {
        throw new TypeError(
          'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
        )
      }
      if (a === b) return 0
      let x = a.length
      let y = b.length
      for (let i = 0, len = Math.min(x, y); i < len; ++i) {
        if (a[i] !== b[i]) {
          x = a[i]
          y = b[i]
          break
        }
      }
      if (x < y) return -1
      if (y < x) return 1
      return 0
    }
    Buffer2.isEncoding = function isEncoding(encoding) {
      switch (String(encoding).toLowerCase()) {
        case 'hex':
        case 'utf8':
        case 'utf-8':
        case 'ascii':
        case 'latin1':
        case 'binary':
        case 'base64':
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return true
        default:
          return false
      }
    }
    Buffer2.concat = function concat3(list, length2) {
      if (!Array.isArray(list)) {
        throw new TypeError('"list" argument must be an Array of Buffers')
      }
      if (list.length === 0) {
        return Buffer2.alloc(0)
      }
      let i
      if (length2 === void 0) {
        length2 = 0
        for (i = 0; i < list.length; ++i) {
          length2 += list[i].length
        }
      }
      const buffer2 = Buffer2.allocUnsafe(length2)
      let pos = 0
      for (i = 0; i < list.length; ++i) {
        let buf2 = list[i]
        if (isInstance(buf2, Uint8Array)) {
          if (pos + buf2.length > buffer2.length) {
            if (!Buffer2.isBuffer(buf2)) buf2 = Buffer2.from(buf2)
            buf2.copy(buffer2, pos)
          } else {
            Uint8Array.prototype.set.call(buffer2, buf2, pos)
          }
        } else if (!Buffer2.isBuffer(buf2)) {
          throw new TypeError('"list" argument must be an Array of Buffers')
        } else {
          buf2.copy(buffer2, pos)
        }
        pos += buf2.length
      }
      return buffer2
    }
    function byteLength(string3, encoding) {
      if (Buffer2.isBuffer(string3)) {
        return string3.length
      }
      if (ArrayBuffer.isView(string3) || isInstance(string3, ArrayBuffer)) {
        return string3.byteLength
      }
      if (typeof string3 !== 'string') {
        throw new TypeError(
          'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' +
            typeof string3
        )
      }
      const len = string3.length
      const mustMatch = arguments.length > 2 && arguments[2] === true
      if (!mustMatch && len === 0) return 0
      let loweredCase = false
      for (;;) {
        switch (encoding) {
          case 'ascii':
          case 'latin1':
          case 'binary':
            return len
          case 'utf8':
          case 'utf-8':
            return utf8ToBytes2(string3).length
          case 'ucs2':
          case 'ucs-2':
          case 'utf16le':
          case 'utf-16le':
            return len * 2
          case 'hex':
            return len >>> 1
          case 'base64':
            return base64ToBytes(string3).length
          default:
            if (loweredCase) {
              return mustMatch ? -1 : utf8ToBytes2(string3).length
            }
            encoding = ('' + encoding).toLowerCase()
            loweredCase = true
        }
      }
    }
    Buffer2.byteLength = byteLength
    function slowToString(encoding, start, end) {
      let loweredCase = false
      if (start === void 0 || start < 0) {
        start = 0
      }
      if (start > this.length) {
        return ''
      }
      if (end === void 0 || end > this.length) {
        end = this.length
      }
      if (end <= 0) {
        return ''
      }
      end >>>= 0
      start >>>= 0
      if (end <= start) {
        return ''
      }
      if (!encoding) encoding = 'utf8'
      while (true) {
        switch (encoding) {
          case 'hex':
            return hexSlice(this, start, end)
          case 'utf8':
          case 'utf-8':
            return utf8Slice2(this, start, end)
          case 'ascii':
            return asciiSlice(this, start, end)
          case 'latin1':
          case 'binary':
            return latin1Slice(this, start, end)
          case 'base64':
            return base64Slice(this, start, end)
          case 'ucs2':
          case 'ucs-2':
          case 'utf16le':
          case 'utf-16le':
            return utf16leSlice(this, start, end)
          default:
            if (loweredCase)
              throw new TypeError('Unknown encoding: ' + encoding)
            encoding = (encoding + '').toLowerCase()
            loweredCase = true
        }
      }
    }
    Buffer2.prototype._isBuffer = true
    function swap(b, n, m) {
      const i = b[n]
      b[n] = b[m]
      b[m] = i
    }
    Buffer2.prototype.swap16 = function swap16() {
      const len = this.length
      if (len % 2 !== 0) {
        throw new RangeError('Buffer size must be a multiple of 16-bits')
      }
      for (let i = 0; i < len; i += 2) {
        swap(this, i, i + 1)
      }
      return this
    }
    Buffer2.prototype.swap32 = function swap32() {
      const len = this.length
      if (len % 4 !== 0) {
        throw new RangeError('Buffer size must be a multiple of 32-bits')
      }
      for (let i = 0; i < len; i += 4) {
        swap(this, i, i + 3)
        swap(this, i + 1, i + 2)
      }
      return this
    }
    Buffer2.prototype.swap64 = function swap64() {
      const len = this.length
      if (len % 8 !== 0) {
        throw new RangeError('Buffer size must be a multiple of 64-bits')
      }
      for (let i = 0; i < len; i += 8) {
        swap(this, i, i + 7)
        swap(this, i + 1, i + 6)
        swap(this, i + 2, i + 5)
        swap(this, i + 3, i + 4)
      }
      return this
    }
    Buffer2.prototype.toString = function toString3() {
      const length2 = this.length
      if (length2 === 0) return ''
      if (arguments.length === 0) return utf8Slice2(this, 0, length2)
      return slowToString.apply(this, arguments)
    }
    Buffer2.prototype.toLocaleString = Buffer2.prototype.toString
    Buffer2.prototype.equals = function equals3(b) {
      if (!Buffer2.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
      if (this === b) return true
      return Buffer2.compare(this, b) === 0
    }
    Buffer2.prototype.inspect = function inspect() {
      let str = ''
      const max = exports2.INSPECT_MAX_BYTES
      str = this.toString('hex', 0, max)
        .replace(/(.{2})/g, '$1 ')
        .trim()
      if (this.length > max) str += ' ... '
      return '<Buffer ' + str + '>'
    }
    if (customInspectSymbol) {
      Buffer2.prototype[customInspectSymbol] = Buffer2.prototype.inspect
    }
    Buffer2.prototype.compare = function compare2(
      target,
      start,
      end,
      thisStart,
      thisEnd
    ) {
      if (isInstance(target, Uint8Array)) {
        target = Buffer2.from(target, target.offset, target.byteLength)
      }
      if (!Buffer2.isBuffer(target)) {
        throw new TypeError(
          'The "target" argument must be one of type Buffer or Uint8Array. Received type ' +
            typeof target
        )
      }
      if (start === void 0) {
        start = 0
      }
      if (end === void 0) {
        end = target ? target.length : 0
      }
      if (thisStart === void 0) {
        thisStart = 0
      }
      if (thisEnd === void 0) {
        thisEnd = this.length
      }
      if (
        start < 0 ||
        end > target.length ||
        thisStart < 0 ||
        thisEnd > this.length
      ) {
        throw new RangeError('out of range index')
      }
      if (thisStart >= thisEnd && start >= end) {
        return 0
      }
      if (thisStart >= thisEnd) {
        return -1
      }
      if (start >= end) {
        return 1
      }
      start >>>= 0
      end >>>= 0
      thisStart >>>= 0
      thisEnd >>>= 0
      if (this === target) return 0
      let x = thisEnd - thisStart
      let y = end - start
      const len = Math.min(x, y)
      const thisCopy = this.slice(thisStart, thisEnd)
      const targetCopy = target.slice(start, end)
      for (let i = 0; i < len; ++i) {
        if (thisCopy[i] !== targetCopy[i]) {
          x = thisCopy[i]
          y = targetCopy[i]
          break
        }
      }
      if (x < y) return -1
      if (y < x) return 1
      return 0
    }
    function bidirectionalIndexOf(buffer2, val, byteOffset, encoding, dir) {
      if (buffer2.length === 0) return -1
      if (typeof byteOffset === 'string') {
        encoding = byteOffset
        byteOffset = 0
      } else if (byteOffset > 2147483647) {
        byteOffset = 2147483647
      } else if (byteOffset < -2147483648) {
        byteOffset = -2147483648
      }
      byteOffset = +byteOffset
      if (numberIsNaN(byteOffset)) {
        byteOffset = dir ? 0 : buffer2.length - 1
      }
      if (byteOffset < 0) byteOffset = buffer2.length + byteOffset
      if (byteOffset >= buffer2.length) {
        if (dir) return -1
        else byteOffset = buffer2.length - 1
      } else if (byteOffset < 0) {
        if (dir) byteOffset = 0
        else return -1
      }
      if (typeof val === 'string') {
        val = Buffer2.from(val, encoding)
      }
      if (Buffer2.isBuffer(val)) {
        if (val.length === 0) {
          return -1
        }
        return arrayIndexOf(buffer2, val, byteOffset, encoding, dir)
      } else if (typeof val === 'number') {
        val = val & 255
        if (typeof Uint8Array.prototype.indexOf === 'function') {
          if (dir) {
            return Uint8Array.prototype.indexOf.call(buffer2, val, byteOffset)
          } else {
            return Uint8Array.prototype.lastIndexOf.call(
              buffer2,
              val,
              byteOffset
            )
          }
        }
        return arrayIndexOf(buffer2, [val], byteOffset, encoding, dir)
      }
      throw new TypeError('val must be string, number or Buffer')
    }
    function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
      let indexSize = 1
      let arrLength = arr.length
      let valLength = val.length
      if (encoding !== void 0) {
        encoding = String(encoding).toLowerCase()
        if (
          encoding === 'ucs2' ||
          encoding === 'ucs-2' ||
          encoding === 'utf16le' ||
          encoding === 'utf-16le'
        ) {
          if (arr.length < 2 || val.length < 2) {
            return -1
          }
          indexSize = 2
          arrLength /= 2
          valLength /= 2
          byteOffset /= 2
        }
      }
      function read2(buf2, i2) {
        if (indexSize === 1) {
          return buf2[i2]
        } else {
          return buf2.readUInt16BE(i2 * indexSize)
        }
      }
      let i
      if (dir) {
        let foundIndex = -1
        for (i = byteOffset; i < arrLength; i++) {
          if (
            read2(arr, i) === read2(val, foundIndex === -1 ? 0 : i - foundIndex)
          ) {
            if (foundIndex === -1) foundIndex = i
            if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
          } else {
            if (foundIndex !== -1) i -= i - foundIndex
            foundIndex = -1
          }
        }
      } else {
        if (byteOffset + valLength > arrLength)
          byteOffset = arrLength - valLength
        for (i = byteOffset; i >= 0; i--) {
          let found = true
          for (let j = 0; j < valLength; j++) {
            if (read2(arr, i + j) !== read2(val, j)) {
              found = false
              break
            }
          }
          if (found) return i
        }
      }
      return -1
    }
    Buffer2.prototype.includes = function includes(val, byteOffset, encoding) {
      return this.indexOf(val, byteOffset, encoding) !== -1
    }
    Buffer2.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
    }
    Buffer2.prototype.lastIndexOf = function lastIndexOf(
      val,
      byteOffset,
      encoding
    ) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
    }
    function hexWrite(buf2, string3, offset, length2) {
      offset = Number(offset) || 0
      const remaining = buf2.length - offset
      if (!length2) {
        length2 = remaining
      } else {
        length2 = Number(length2)
        if (length2 > remaining) {
          length2 = remaining
        }
      }
      const strLen = string3.length
      if (length2 > strLen / 2) {
        length2 = strLen / 2
      }
      let i
      for (i = 0; i < length2; ++i) {
        const parsed = parseInt(string3.substr(i * 2, 2), 16)
        if (numberIsNaN(parsed)) return i
        buf2[offset + i] = parsed
      }
      return i
    }
    function utf8Write(buf2, string3, offset, length2) {
      return blitBuffer(
        utf8ToBytes2(string3, buf2.length - offset),
        buf2,
        offset,
        length2
      )
    }
    function asciiWrite(buf2, string3, offset, length2) {
      return blitBuffer(asciiToBytes(string3), buf2, offset, length2)
    }
    function base64Write(buf2, string3, offset, length2) {
      return blitBuffer(base64ToBytes(string3), buf2, offset, length2)
    }
    function ucs2Write(buf2, string3, offset, length2) {
      return blitBuffer(
        utf16leToBytes(string3, buf2.length - offset),
        buf2,
        offset,
        length2
      )
    }
    Buffer2.prototype.write = function write(
      string3,
      offset,
      length2,
      encoding
    ) {
      if (offset === void 0) {
        encoding = 'utf8'
        length2 = this.length
        offset = 0
      } else if (length2 === void 0 && typeof offset === 'string') {
        encoding = offset
        length2 = this.length
        offset = 0
      } else if (isFinite(offset)) {
        offset = offset >>> 0
        if (isFinite(length2)) {
          length2 = length2 >>> 0
          if (encoding === void 0) encoding = 'utf8'
        } else {
          encoding = length2
          length2 = void 0
        }
      } else {
        throw new Error(
          'Buffer.write(string, encoding, offset[, length]) is no longer supported'
        )
      }
      const remaining = this.length - offset
      if (length2 === void 0 || length2 > remaining) length2 = remaining
      if (
        (string3.length > 0 && (length2 < 0 || offset < 0)) ||
        offset > this.length
      ) {
        throw new RangeError('Attempt to write outside buffer bounds')
      }
      if (!encoding) encoding = 'utf8'
      let loweredCase = false
      for (;;) {
        switch (encoding) {
          case 'hex':
            return hexWrite(this, string3, offset, length2)
          case 'utf8':
          case 'utf-8':
            return utf8Write(this, string3, offset, length2)
          case 'ascii':
          case 'latin1':
          case 'binary':
            return asciiWrite(this, string3, offset, length2)
          case 'base64':
            return base64Write(this, string3, offset, length2)
          case 'ucs2':
          case 'ucs-2':
          case 'utf16le':
          case 'utf-16le':
            return ucs2Write(this, string3, offset, length2)
          default:
            if (loweredCase)
              throw new TypeError('Unknown encoding: ' + encoding)
            encoding = ('' + encoding).toLowerCase()
            loweredCase = true
        }
      }
    }
    Buffer2.prototype.toJSON = function toJSON() {
      return {
        type: 'Buffer',
        data: Array.prototype.slice.call(this._arr || this, 0),
      }
    }
    function base64Slice(buf2, start, end) {
      if (start === 0 && end === buf2.length) {
        return base642.fromByteArray(buf2)
      } else {
        return base642.fromByteArray(buf2.slice(start, end))
      }
    }
    function utf8Slice2(buf2, start, end) {
      end = Math.min(buf2.length, end)
      const res = []
      let i = start
      while (i < end) {
        const firstByte = buf2[i]
        let codePoint = null
        let bytesPerSequence =
          firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1
        if (i + bytesPerSequence <= end) {
          let secondByte, thirdByte, fourthByte, tempCodePoint
          switch (bytesPerSequence) {
            case 1:
              if (firstByte < 128) {
                codePoint = firstByte
              }
              break
            case 2:
              secondByte = buf2[i + 1]
              if ((secondByte & 192) === 128) {
                tempCodePoint = ((firstByte & 31) << 6) | (secondByte & 63)
                if (tempCodePoint > 127) {
                  codePoint = tempCodePoint
                }
              }
              break
            case 3:
              secondByte = buf2[i + 1]
              thirdByte = buf2[i + 2]
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                tempCodePoint =
                  ((firstByte & 15) << 12) |
                  ((secondByte & 63) << 6) |
                  (thirdByte & 63)
                if (
                  tempCodePoint > 2047 &&
                  (tempCodePoint < 55296 || tempCodePoint > 57343)
                ) {
                  codePoint = tempCodePoint
                }
              }
              break
            case 4:
              secondByte = buf2[i + 1]
              thirdByte = buf2[i + 2]
              fourthByte = buf2[i + 3]
              if (
                (secondByte & 192) === 128 &&
                (thirdByte & 192) === 128 &&
                (fourthByte & 192) === 128
              ) {
                tempCodePoint =
                  ((firstByte & 15) << 18) |
                  ((secondByte & 63) << 12) |
                  ((thirdByte & 63) << 6) |
                  (fourthByte & 63)
                if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                  codePoint = tempCodePoint
                }
              }
          }
        }
        if (codePoint === null) {
          codePoint = 65533
          bytesPerSequence = 1
        } else if (codePoint > 65535) {
          codePoint -= 65536
          res.push(((codePoint >>> 10) & 1023) | 55296)
          codePoint = 56320 | (codePoint & 1023)
        }
        res.push(codePoint)
        i += bytesPerSequence
      }
      return decodeCodePointsArray2(res)
    }
    var MAX_ARGUMENTS_LENGTH2 = 4096
    function decodeCodePointsArray2(codePoints) {
      const len = codePoints.length
      if (len <= MAX_ARGUMENTS_LENGTH2) {
        return String.fromCharCode.apply(String, codePoints)
      }
      let res = ''
      let i = 0
      while (i < len) {
        res += String.fromCharCode.apply(
          String,
          codePoints.slice(i, (i += MAX_ARGUMENTS_LENGTH2))
        )
      }
      return res
    }
    function asciiSlice(buf2, start, end) {
      let ret = ''
      end = Math.min(buf2.length, end)
      for (let i = start; i < end; ++i) {
        ret += String.fromCharCode(buf2[i] & 127)
      }
      return ret
    }
    function latin1Slice(buf2, start, end) {
      let ret = ''
      end = Math.min(buf2.length, end)
      for (let i = start; i < end; ++i) {
        ret += String.fromCharCode(buf2[i])
      }
      return ret
    }
    function hexSlice(buf2, start, end) {
      const len = buf2.length
      if (!start || start < 0) start = 0
      if (!end || end < 0 || end > len) end = len
      let out = ''
      for (let i = start; i < end; ++i) {
        out += hexSliceLookupTable[buf2[i]]
      }
      return out
    }
    function utf16leSlice(buf2, start, end) {
      const bytes2 = buf2.slice(start, end)
      let res = ''
      for (let i = 0; i < bytes2.length - 1; i += 2) {
        res += String.fromCharCode(bytes2[i] + bytes2[i + 1] * 256)
      }
      return res
    }
    Buffer2.prototype.slice = function slice2(start, end) {
      const len = this.length
      start = ~~start
      end = end === void 0 ? len : ~~end
      if (start < 0) {
        start += len
        if (start < 0) start = 0
      } else if (start > len) {
        start = len
      }
      if (end < 0) {
        end += len
        if (end < 0) end = 0
      } else if (end > len) {
        end = len
      }
      if (end < start) end = start
      const newBuf = this.subarray(start, end)
      Object.setPrototypeOf(newBuf, Buffer2.prototype)
      return newBuf
    }
    function checkOffset(offset, ext, length2) {
      if (offset % 1 !== 0 || offset < 0)
        throw new RangeError('offset is not uint')
      if (offset + ext > length2)
        throw new RangeError('Trying to access beyond buffer length')
    }
    Buffer2.prototype.readUintLE = Buffer2.prototype.readUIntLE =
      function readUIntLE(offset, byteLength2, noAssert) {
        offset = offset >>> 0
        byteLength2 = byteLength2 >>> 0
        if (!noAssert) checkOffset(offset, byteLength2, this.length)
        let val = this[offset]
        let mul = 1
        let i = 0
        while (++i < byteLength2 && (mul *= 256)) {
          val += this[offset + i] * mul
        }
        return val
      }
    Buffer2.prototype.readUintBE = Buffer2.prototype.readUIntBE =
      function readUIntBE(offset, byteLength2, noAssert) {
        offset = offset >>> 0
        byteLength2 = byteLength2 >>> 0
        if (!noAssert) {
          checkOffset(offset, byteLength2, this.length)
        }
        let val = this[offset + --byteLength2]
        let mul = 1
        while (byteLength2 > 0 && (mul *= 256)) {
          val += this[offset + --byteLength2] * mul
        }
        return val
      }
    Buffer2.prototype.readUint8 = Buffer2.prototype.readUInt8 =
      function readUInt8(offset, noAssert) {
        offset = offset >>> 0
        if (!noAssert) checkOffset(offset, 1, this.length)
        return this[offset]
      }
    Buffer2.prototype.readUint16LE = Buffer2.prototype.readUInt16LE =
      function readUInt16LE(offset, noAssert) {
        offset = offset >>> 0
        if (!noAssert) checkOffset(offset, 2, this.length)
        return this[offset] | (this[offset + 1] << 8)
      }
    Buffer2.prototype.readUint16BE = Buffer2.prototype.readUInt16BE =
      function readUInt16BE(offset, noAssert) {
        offset = offset >>> 0
        if (!noAssert) checkOffset(offset, 2, this.length)
        return (this[offset] << 8) | this[offset + 1]
      }
    Buffer2.prototype.readUint32LE = Buffer2.prototype.readUInt32LE =
      function readUInt32LE(offset, noAssert) {
        offset = offset >>> 0
        if (!noAssert) checkOffset(offset, 4, this.length)
        return (
          (this[offset] | (this[offset + 1] << 8) | (this[offset + 2] << 16)) +
          this[offset + 3] * 16777216
        )
      }
    Buffer2.prototype.readUint32BE = Buffer2.prototype.readUInt32BE =
      function readUInt32BE(offset, noAssert) {
        offset = offset >>> 0
        if (!noAssert) checkOffset(offset, 4, this.length)
        return (
          this[offset] * 16777216 +
          ((this[offset + 1] << 16) |
            (this[offset + 2] << 8) |
            this[offset + 3])
        )
      }
    Buffer2.prototype.readBigUInt64LE = defineBigIntMethod(
      function readBigUInt64LE(offset) {
        offset = offset >>> 0
        validateNumber(offset, 'offset')
        const first = this[offset]
        const last2 = this[offset + 7]
        if (first === void 0 || last2 === void 0) {
          boundsError(offset, this.length - 8)
        }
        const lo =
          first +
          this[++offset] * 2 ** 8 +
          this[++offset] * 2 ** 16 +
          this[++offset] * 2 ** 24
        const hi =
          this[++offset] +
          this[++offset] * 2 ** 8 +
          this[++offset] * 2 ** 16 +
          last2 * 2 ** 24
        return BigInt(lo) + (BigInt(hi) << BigInt(32))
      }
    )
    Buffer2.prototype.readBigUInt64BE = defineBigIntMethod(
      function readBigUInt64BE(offset) {
        offset = offset >>> 0
        validateNumber(offset, 'offset')
        const first = this[offset]
        const last2 = this[offset + 7]
        if (first === void 0 || last2 === void 0) {
          boundsError(offset, this.length - 8)
        }
        const hi =
          first * 2 ** 24 +
          this[++offset] * 2 ** 16 +
          this[++offset] * 2 ** 8 +
          this[++offset]
        const lo =
          this[++offset] * 2 ** 24 +
          this[++offset] * 2 ** 16 +
          this[++offset] * 2 ** 8 +
          last2
        return (BigInt(hi) << BigInt(32)) + BigInt(lo)
      }
    )
    Buffer2.prototype.readIntLE = function readIntLE(
      offset,
      byteLength2,
      noAssert
    ) {
      offset = offset >>> 0
      byteLength2 = byteLength2 >>> 0
      if (!noAssert) checkOffset(offset, byteLength2, this.length)
      let val = this[offset]
      let mul = 1
      let i = 0
      while (++i < byteLength2 && (mul *= 256)) {
        val += this[offset + i] * mul
      }
      mul *= 128
      if (val >= mul) val -= Math.pow(2, 8 * byteLength2)
      return val
    }
    Buffer2.prototype.readIntBE = function readIntBE(
      offset,
      byteLength2,
      noAssert
    ) {
      offset = offset >>> 0
      byteLength2 = byteLength2 >>> 0
      if (!noAssert) checkOffset(offset, byteLength2, this.length)
      let i = byteLength2
      let mul = 1
      let val = this[offset + --i]
      while (i > 0 && (mul *= 256)) {
        val += this[offset + --i] * mul
      }
      mul *= 128
      if (val >= mul) val -= Math.pow(2, 8 * byteLength2)
      return val
    }
    Buffer2.prototype.readInt8 = function readInt8(offset, noAssert) {
      offset = offset >>> 0
      if (!noAssert) checkOffset(offset, 1, this.length)
      if (!(this[offset] & 128)) return this[offset]
      return (255 - this[offset] + 1) * -1
    }
    Buffer2.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
      offset = offset >>> 0
      if (!noAssert) checkOffset(offset, 2, this.length)
      const val = this[offset] | (this[offset + 1] << 8)
      return val & 32768 ? val | 4294901760 : val
    }
    Buffer2.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
      offset = offset >>> 0
      if (!noAssert) checkOffset(offset, 2, this.length)
      const val = this[offset + 1] | (this[offset] << 8)
      return val & 32768 ? val | 4294901760 : val
    }
    Buffer2.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
      offset = offset >>> 0
      if (!noAssert) checkOffset(offset, 4, this.length)
      return (
        this[offset] |
        (this[offset + 1] << 8) |
        (this[offset + 2] << 16) |
        (this[offset + 3] << 24)
      )
    }
    Buffer2.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
      offset = offset >>> 0
      if (!noAssert) checkOffset(offset, 4, this.length)
      return (
        (this[offset] << 24) |
        (this[offset + 1] << 16) |
        (this[offset + 2] << 8) |
        this[offset + 3]
      )
    }
    Buffer2.prototype.readBigInt64LE = defineBigIntMethod(
      function readBigInt64LE(offset) {
        offset = offset >>> 0
        validateNumber(offset, 'offset')
        const first = this[offset]
        const last2 = this[offset + 7]
        if (first === void 0 || last2 === void 0) {
          boundsError(offset, this.length - 8)
        }
        const val =
          this[offset + 4] +
          this[offset + 5] * 2 ** 8 +
          this[offset + 6] * 2 ** 16 +
          (last2 << 24)
        return (
          (BigInt(val) << BigInt(32)) +
          BigInt(
            first +
              this[++offset] * 2 ** 8 +
              this[++offset] * 2 ** 16 +
              this[++offset] * 2 ** 24
          )
        )
      }
    )
    Buffer2.prototype.readBigInt64BE = defineBigIntMethod(
      function readBigInt64BE(offset) {
        offset = offset >>> 0
        validateNumber(offset, 'offset')
        const first = this[offset]
        const last2 = this[offset + 7]
        if (first === void 0 || last2 === void 0) {
          boundsError(offset, this.length - 8)
        }
        const val =
          (first << 24) +
          this[++offset] * 2 ** 16 +
          this[++offset] * 2 ** 8 +
          this[++offset]
        return (
          (BigInt(val) << BigInt(32)) +
          BigInt(
            this[++offset] * 2 ** 24 +
              this[++offset] * 2 ** 16 +
              this[++offset] * 2 ** 8 +
              last2
          )
        )
      }
    )
    Buffer2.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
      offset = offset >>> 0
      if (!noAssert) checkOffset(offset, 4, this.length)
      return ieee754.read(this, offset, true, 23, 4)
    }
    Buffer2.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
      offset = offset >>> 0
      if (!noAssert) checkOffset(offset, 4, this.length)
      return ieee754.read(this, offset, false, 23, 4)
    }
    Buffer2.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
      offset = offset >>> 0
      if (!noAssert) checkOffset(offset, 8, this.length)
      return ieee754.read(this, offset, true, 52, 8)
    }
    Buffer2.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
      offset = offset >>> 0
      if (!noAssert) checkOffset(offset, 8, this.length)
      return ieee754.read(this, offset, false, 52, 8)
    }
    function checkInt(buf2, value, offset, ext, max, min) {
      if (!Buffer2.isBuffer(buf2))
        throw new TypeError('"buffer" argument must be a Buffer instance')
      if (value > max || value < min)
        throw new RangeError('"value" argument is out of bounds')
      if (offset + ext > buf2.length) throw new RangeError('Index out of range')
    }
    Buffer2.prototype.writeUintLE = Buffer2.prototype.writeUIntLE =
      function writeUIntLE(value, offset, byteLength2, noAssert) {
        value = +value
        offset = offset >>> 0
        byteLength2 = byteLength2 >>> 0
        if (!noAssert) {
          const maxBytes = Math.pow(2, 8 * byteLength2) - 1
          checkInt(this, value, offset, byteLength2, maxBytes, 0)
        }
        let mul = 1
        let i = 0
        this[offset] = value & 255
        while (++i < byteLength2 && (mul *= 256)) {
          this[offset + i] = (value / mul) & 255
        }
        return offset + byteLength2
      }
    Buffer2.prototype.writeUintBE = Buffer2.prototype.writeUIntBE =
      function writeUIntBE(value, offset, byteLength2, noAssert) {
        value = +value
        offset = offset >>> 0
        byteLength2 = byteLength2 >>> 0
        if (!noAssert) {
          const maxBytes = Math.pow(2, 8 * byteLength2) - 1
          checkInt(this, value, offset, byteLength2, maxBytes, 0)
        }
        let i = byteLength2 - 1
        let mul = 1
        this[offset + i] = value & 255
        while (--i >= 0 && (mul *= 256)) {
          this[offset + i] = (value / mul) & 255
        }
        return offset + byteLength2
      }
    Buffer2.prototype.writeUint8 = Buffer2.prototype.writeUInt8 =
      function writeUInt8(value, offset, noAssert) {
        value = +value
        offset = offset >>> 0
        if (!noAssert) checkInt(this, value, offset, 1, 255, 0)
        this[offset] = value & 255
        return offset + 1
      }
    Buffer2.prototype.writeUint16LE = Buffer2.prototype.writeUInt16LE =
      function writeUInt16LE(value, offset, noAssert) {
        value = +value
        offset = offset >>> 0
        if (!noAssert) checkInt(this, value, offset, 2, 65535, 0)
        this[offset] = value & 255
        this[offset + 1] = value >>> 8
        return offset + 2
      }
    Buffer2.prototype.writeUint16BE = Buffer2.prototype.writeUInt16BE =
      function writeUInt16BE(value, offset, noAssert) {
        value = +value
        offset = offset >>> 0
        if (!noAssert) checkInt(this, value, offset, 2, 65535, 0)
        this[offset] = value >>> 8
        this[offset + 1] = value & 255
        return offset + 2
      }
    Buffer2.prototype.writeUint32LE = Buffer2.prototype.writeUInt32LE =
      function writeUInt32LE(value, offset, noAssert) {
        value = +value
        offset = offset >>> 0
        if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0)
        this[offset + 3] = value >>> 24
        this[offset + 2] = value >>> 16
        this[offset + 1] = value >>> 8
        this[offset] = value & 255
        return offset + 4
      }
    Buffer2.prototype.writeUint32BE = Buffer2.prototype.writeUInt32BE =
      function writeUInt32BE(value, offset, noAssert) {
        value = +value
        offset = offset >>> 0
        if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0)
        this[offset] = value >>> 24
        this[offset + 1] = value >>> 16
        this[offset + 2] = value >>> 8
        this[offset + 3] = value & 255
        return offset + 4
      }
    function wrtBigUInt64LE(buf2, value, offset, min, max) {
      checkIntBI(value, min, max, buf2, offset, 7)
      let lo = Number(value & BigInt(4294967295))
      buf2[offset++] = lo
      lo = lo >> 8
      buf2[offset++] = lo
      lo = lo >> 8
      buf2[offset++] = lo
      lo = lo >> 8
      buf2[offset++] = lo
      let hi = Number((value >> BigInt(32)) & BigInt(4294967295))
      buf2[offset++] = hi
      hi = hi >> 8
      buf2[offset++] = hi
      hi = hi >> 8
      buf2[offset++] = hi
      hi = hi >> 8
      buf2[offset++] = hi
      return offset
    }
    function wrtBigUInt64BE(buf2, value, offset, min, max) {
      checkIntBI(value, min, max, buf2, offset, 7)
      let lo = Number(value & BigInt(4294967295))
      buf2[offset + 7] = lo
      lo = lo >> 8
      buf2[offset + 6] = lo
      lo = lo >> 8
      buf2[offset + 5] = lo
      lo = lo >> 8
      buf2[offset + 4] = lo
      let hi = Number((value >> BigInt(32)) & BigInt(4294967295))
      buf2[offset + 3] = hi
      hi = hi >> 8
      buf2[offset + 2] = hi
      hi = hi >> 8
      buf2[offset + 1] = hi
      hi = hi >> 8
      buf2[offset] = hi
      return offset + 8
    }
    Buffer2.prototype.writeBigUInt64LE = defineBigIntMethod(
      function writeBigUInt64LE(value, offset = 0) {
        return wrtBigUInt64LE(
          this,
          value,
          offset,
          BigInt(0),
          BigInt('0xffffffffffffffff')
        )
      }
    )
    Buffer2.prototype.writeBigUInt64BE = defineBigIntMethod(
      function writeBigUInt64BE(value, offset = 0) {
        return wrtBigUInt64BE(
          this,
          value,
          offset,
          BigInt(0),
          BigInt('0xffffffffffffffff')
        )
      }
    )
    Buffer2.prototype.writeIntLE = function writeIntLE(
      value,
      offset,
      byteLength2,
      noAssert
    ) {
      value = +value
      offset = offset >>> 0
      if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength2 - 1)
        checkInt(this, value, offset, byteLength2, limit - 1, -limit)
      }
      let i = 0
      let mul = 1
      let sub = 0
      this[offset] = value & 255
      while (++i < byteLength2 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
          sub = 1
        }
        this[offset + i] = (((value / mul) >> 0) - sub) & 255
      }
      return offset + byteLength2
    }
    Buffer2.prototype.writeIntBE = function writeIntBE(
      value,
      offset,
      byteLength2,
      noAssert
    ) {
      value = +value
      offset = offset >>> 0
      if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength2 - 1)
        checkInt(this, value, offset, byteLength2, limit - 1, -limit)
      }
      let i = byteLength2 - 1
      let mul = 1
      let sub = 0
      this[offset + i] = value & 255
      while (--i >= 0 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
          sub = 1
        }
        this[offset + i] = (((value / mul) >> 0) - sub) & 255
      }
      return offset + byteLength2
    }
    Buffer2.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
      value = +value
      offset = offset >>> 0
      if (!noAssert) checkInt(this, value, offset, 1, 127, -128)
      if (value < 0) value = 255 + value + 1
      this[offset] = value & 255
      return offset + 1
    }
    Buffer2.prototype.writeInt16LE = function writeInt16LE(
      value,
      offset,
      noAssert
    ) {
      value = +value
      offset = offset >>> 0
      if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768)
      this[offset] = value & 255
      this[offset + 1] = value >>> 8
      return offset + 2
    }
    Buffer2.prototype.writeInt16BE = function writeInt16BE(
      value,
      offset,
      noAssert
    ) {
      value = +value
      offset = offset >>> 0
      if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768)
      this[offset] = value >>> 8
      this[offset + 1] = value & 255
      return offset + 2
    }
    Buffer2.prototype.writeInt32LE = function writeInt32LE(
      value,
      offset,
      noAssert
    ) {
      value = +value
      offset = offset >>> 0
      if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648)
      this[offset] = value & 255
      this[offset + 1] = value >>> 8
      this[offset + 2] = value >>> 16
      this[offset + 3] = value >>> 24
      return offset + 4
    }
    Buffer2.prototype.writeInt32BE = function writeInt32BE(
      value,
      offset,
      noAssert
    ) {
      value = +value
      offset = offset >>> 0
      if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648)
      if (value < 0) value = 4294967295 + value + 1
      this[offset] = value >>> 24
      this[offset + 1] = value >>> 16
      this[offset + 2] = value >>> 8
      this[offset + 3] = value & 255
      return offset + 4
    }
    Buffer2.prototype.writeBigInt64LE = defineBigIntMethod(
      function writeBigInt64LE(value, offset = 0) {
        return wrtBigUInt64LE(
          this,
          value,
          offset,
          -BigInt('0x8000000000000000'),
          BigInt('0x7fffffffffffffff')
        )
      }
    )
    Buffer2.prototype.writeBigInt64BE = defineBigIntMethod(
      function writeBigInt64BE(value, offset = 0) {
        return wrtBigUInt64BE(
          this,
          value,
          offset,
          -BigInt('0x8000000000000000'),
          BigInt('0x7fffffffffffffff')
        )
      }
    )
    function checkIEEE754(buf2, value, offset, ext, max, min) {
      if (offset + ext > buf2.length) throw new RangeError('Index out of range')
      if (offset < 0) throw new RangeError('Index out of range')
    }
    function writeFloat(buf2, value, offset, littleEndian, noAssert) {
      value = +value
      offset = offset >>> 0
      if (!noAssert) {
        checkIEEE754(
          buf2,
          value,
          offset,
          4,
          34028234663852886e22,
          -34028234663852886e22
        )
      }
      ieee754.write(buf2, value, offset, littleEndian, 23, 4)
      return offset + 4
    }
    Buffer2.prototype.writeFloatLE = function writeFloatLE(
      value,
      offset,
      noAssert
    ) {
      return writeFloat(this, value, offset, true, noAssert)
    }
    Buffer2.prototype.writeFloatBE = function writeFloatBE(
      value,
      offset,
      noAssert
    ) {
      return writeFloat(this, value, offset, false, noAssert)
    }
    function writeDouble(buf2, value, offset, littleEndian, noAssert) {
      value = +value
      offset = offset >>> 0
      if (!noAssert) {
        checkIEEE754(
          buf2,
          value,
          offset,
          8,
          17976931348623157e292,
          -17976931348623157e292
        )
      }
      ieee754.write(buf2, value, offset, littleEndian, 52, 8)
      return offset + 8
    }
    Buffer2.prototype.writeDoubleLE = function writeDoubleLE(
      value,
      offset,
      noAssert
    ) {
      return writeDouble(this, value, offset, true, noAssert)
    }
    Buffer2.prototype.writeDoubleBE = function writeDoubleBE(
      value,
      offset,
      noAssert
    ) {
      return writeDouble(this, value, offset, false, noAssert)
    }
    Buffer2.prototype.copy = function copy(target, targetStart, start, end) {
      if (!Buffer2.isBuffer(target))
        throw new TypeError('argument should be a Buffer')
      if (!start) start = 0
      if (!end && end !== 0) end = this.length
      if (targetStart >= target.length) targetStart = target.length
      if (!targetStart) targetStart = 0
      if (end > 0 && end < start) end = start
      if (end === start) return 0
      if (target.length === 0 || this.length === 0) return 0
      if (targetStart < 0) {
        throw new RangeError('targetStart out of bounds')
      }
      if (start < 0 || start >= this.length)
        throw new RangeError('Index out of range')
      if (end < 0) throw new RangeError('sourceEnd out of bounds')
      if (end > this.length) end = this.length
      if (target.length - targetStart < end - start) {
        end = target.length - targetStart + start
      }
      const len = end - start
      if (
        this === target &&
        typeof Uint8Array.prototype.copyWithin === 'function'
      ) {
        this.copyWithin(targetStart, start, end)
      } else {
        Uint8Array.prototype.set.call(
          target,
          this.subarray(start, end),
          targetStart
        )
      }
      return len
    }
    Buffer2.prototype.fill = function fill(val, start, end, encoding) {
      if (typeof val === 'string') {
        if (typeof start === 'string') {
          encoding = start
          start = 0
          end = this.length
        } else if (typeof end === 'string') {
          encoding = end
          end = this.length
        }
        if (encoding !== void 0 && typeof encoding !== 'string') {
          throw new TypeError('encoding must be a string')
        }
        if (typeof encoding === 'string' && !Buffer2.isEncoding(encoding)) {
          throw new TypeError('Unknown encoding: ' + encoding)
        }
        if (val.length === 1) {
          const code6 = val.charCodeAt(0)
          if ((encoding === 'utf8' && code6 < 128) || encoding === 'latin1') {
            val = code6
          }
        }
      } else if (typeof val === 'number') {
        val = val & 255
      } else if (typeof val === 'boolean') {
        val = Number(val)
      }
      if (start < 0 || this.length < start || this.length < end) {
        throw new RangeError('Out of range index')
      }
      if (end <= start) {
        return this
      }
      start = start >>> 0
      end = end === void 0 ? this.length : end >>> 0
      if (!val) val = 0
      let i
      if (typeof val === 'number') {
        for (i = start; i < end; ++i) {
          this[i] = val
        }
      } else {
        const bytes2 = Buffer2.isBuffer(val) ? val : Buffer2.from(val, encoding)
        const len = bytes2.length
        if (len === 0) {
          throw new TypeError(
            'The value "' + val + '" is invalid for argument "value"'
          )
        }
        for (i = 0; i < end - start; ++i) {
          this[i + start] = bytes2[i % len]
        }
      }
      return this
    }
    var errors = {}
    function E(sym, getMessage, Base) {
      errors[sym] = class NodeError extends Base {
        constructor() {
          super()
          Object.defineProperty(this, 'message', {
            value: getMessage.apply(this, arguments),
            writable: true,
            configurable: true,
          })
          this.name = `${this.name} [${sym}]`
          this.stack
          delete this.name
        }
        get code() {
          return sym
        }
        set code(value) {
          Object.defineProperty(this, 'code', {
            configurable: true,
            enumerable: true,
            value,
            writable: true,
          })
        }
        toString() {
          return `${this.name} [${sym}]: ${this.message}`
        }
      }
    }
    E(
      'ERR_BUFFER_OUT_OF_BOUNDS',
      function (name6) {
        if (name6) {
          return `${name6} is outside of buffer bounds`
        }
        return 'Attempt to access memory outside buffer bounds'
      },
      RangeError
    )
    E(
      'ERR_INVALID_ARG_TYPE',
      function (name6, actual) {
        return `The "${name6}" argument must be of type number. Received type ${typeof actual}`
      },
      TypeError
    )
    E(
      'ERR_OUT_OF_RANGE',
      function (str, range, input) {
        let msg = `The value of "${str}" is out of range.`
        let received = input
        if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
          received = addNumericalSeparator(String(input))
        } else if (typeof input === 'bigint') {
          received = String(input)
          if (
            input > BigInt(2) ** BigInt(32) ||
            input < -(BigInt(2) ** BigInt(32))
          ) {
            received = addNumericalSeparator(received)
          }
          received += 'n'
        }
        msg += ` It must be ${range}. Received ${received}`
        return msg
      },
      RangeError
    )
    function addNumericalSeparator(val) {
      let res = ''
      let i = val.length
      const start = val[0] === '-' ? 1 : 0
      for (; i >= start + 4; i -= 3) {
        res = `_${val.slice(i - 3, i)}${res}`
      }
      return `${val.slice(0, i)}${res}`
    }
    function checkBounds(buf2, offset, byteLength2) {
      validateNumber(offset, 'offset')
      if (buf2[offset] === void 0 || buf2[offset + byteLength2] === void 0) {
        boundsError(offset, buf2.length - (byteLength2 + 1))
      }
    }
    function checkIntBI(value, min, max, buf2, offset, byteLength2) {
      if (value > max || value < min) {
        const n = typeof min === 'bigint' ? 'n' : ''
        let range
        if (byteLength2 > 3) {
          if (min === 0 || min === BigInt(0)) {
            range = `>= 0${n} and < 2${n} ** ${(byteLength2 + 1) * 8}${n}`
          } else {
            range = `>= -(2${n} ** ${
              (byteLength2 + 1) * 8 - 1
            }${n}) and < 2 ** ${(byteLength2 + 1) * 8 - 1}${n}`
          }
        } else {
          range = `>= ${min}${n} and <= ${max}${n}`
        }
        throw new errors.ERR_OUT_OF_RANGE('value', range, value)
      }
      checkBounds(buf2, offset, byteLength2)
    }
    function validateNumber(value, name6) {
      if (typeof value !== 'number') {
        throw new errors.ERR_INVALID_ARG_TYPE(name6, 'number', value)
      }
    }
    function boundsError(value, length2, type) {
      if (Math.floor(value) !== value) {
        validateNumber(value, type)
        throw new errors.ERR_OUT_OF_RANGE(type || 'offset', 'an integer', value)
      }
      if (length2 < 0) {
        throw new errors.ERR_BUFFER_OUT_OF_BOUNDS()
      }
      throw new errors.ERR_OUT_OF_RANGE(
        type || 'offset',
        `>= ${type ? 1 : 0} and <= ${length2}`,
        value
      )
    }
    var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g
    function base64clean(str) {
      str = str.split('=')[0]
      str = str.trim().replace(INVALID_BASE64_RE, '')
      if (str.length < 2) return ''
      while (str.length % 4 !== 0) {
        str = str + '='
      }
      return str
    }
    function utf8ToBytes2(string3, units) {
      units = units || Infinity
      let codePoint
      const length2 = string3.length
      let leadSurrogate = null
      const bytes2 = []
      for (let i = 0; i < length2; ++i) {
        codePoint = string3.charCodeAt(i)
        if (codePoint > 55295 && codePoint < 57344) {
          if (!leadSurrogate) {
            if (codePoint > 56319) {
              if ((units -= 3) > -1) bytes2.push(239, 191, 189)
              continue
            } else if (i + 1 === length2) {
              if ((units -= 3) > -1) bytes2.push(239, 191, 189)
              continue
            }
            leadSurrogate = codePoint
            continue
          }
          if (codePoint < 56320) {
            if ((units -= 3) > -1) bytes2.push(239, 191, 189)
            leadSurrogate = codePoint
            continue
          }
          codePoint =
            (((leadSurrogate - 55296) << 10) | (codePoint - 56320)) + 65536
        } else if (leadSurrogate) {
          if ((units -= 3) > -1) bytes2.push(239, 191, 189)
        }
        leadSurrogate = null
        if (codePoint < 128) {
          if ((units -= 1) < 0) break
          bytes2.push(codePoint)
        } else if (codePoint < 2048) {
          if ((units -= 2) < 0) break
          bytes2.push((codePoint >> 6) | 192, (codePoint & 63) | 128)
        } else if (codePoint < 65536) {
          if ((units -= 3) < 0) break
          bytes2.push(
            (codePoint >> 12) | 224,
            ((codePoint >> 6) & 63) | 128,
            (codePoint & 63) | 128
          )
        } else if (codePoint < 1114112) {
          if ((units -= 4) < 0) break
          bytes2.push(
            (codePoint >> 18) | 240,
            ((codePoint >> 12) & 63) | 128,
            ((codePoint >> 6) & 63) | 128,
            (codePoint & 63) | 128
          )
        } else {
          throw new Error('Invalid code point')
        }
      }
      return bytes2
    }
    function asciiToBytes(str) {
      const byteArray = []
      for (let i = 0; i < str.length; ++i) {
        byteArray.push(str.charCodeAt(i) & 255)
      }
      return byteArray
    }
    function utf16leToBytes(str, units) {
      let c, hi, lo
      const byteArray = []
      for (let i = 0; i < str.length; ++i) {
        if ((units -= 2) < 0) break
        c = str.charCodeAt(i)
        hi = c >> 8
        lo = c % 256
        byteArray.push(lo)
        byteArray.push(hi)
      }
      return byteArray
    }
    function base64ToBytes(str) {
      return base642.toByteArray(base64clean(str))
    }
    function blitBuffer(src2, dst, offset, length2) {
      let i
      for (i = 0; i < length2; ++i) {
        if (i + offset >= dst.length || i >= src2.length) break
        dst[i + offset] = src2[i]
      }
      return i
    }
    function isInstance(obj, type) {
      return (
        obj instanceof type ||
        (obj != null &&
          obj.constructor != null &&
          obj.constructor.name != null &&
          obj.constructor.name === type.name)
      )
    }
    function numberIsNaN(obj) {
      return obj !== obj
    }
    var hexSliceLookupTable = (function () {
      const alphabet = '0123456789abcdef'
      const table = new Array(256)
      for (let i = 0; i < 16; ++i) {
        const i16 = i * 16
        for (let j = 0; j < 16; ++j) {
          table[i16 + j] = alphabet[i] + alphabet[j]
        }
      }
      return table
    })()
    function defineBigIntMethod(fn) {
      return typeof BigInt === 'undefined' ? BufferBigIntNotDefined : fn
    }
    function BufferBigIntNotDefined() {
      throw new Error('BigInt not supported')
    }
  },
})

// node_modules/bl/BufferList.js
var require_BufferList = __commonJS({
  'node_modules/bl/BufferList.js'(exports2, module2) {
    'use strict'
    var { Buffer: Buffer2 } = require_buffer()
    var symbol = Symbol.for('BufferList')
    function BufferList3(buf2) {
      if (!(this instanceof BufferList3)) {
        return new BufferList3(buf2)
      }
      BufferList3._init.call(this, buf2)
    }
    BufferList3._init = function _init(buf2) {
      Object.defineProperty(this, symbol, { value: true })
      this._bufs = []
      this.length = 0
      if (buf2) {
        this.append(buf2)
      }
    }
    BufferList3.prototype._new = function _new(buf2) {
      return new BufferList3(buf2)
    }
    BufferList3.prototype._offset = function _offset(offset) {
      if (offset === 0) {
        return [0, 0]
      }
      let tot = 0
      for (let i = 0; i < this._bufs.length; i++) {
        const _t = tot + this._bufs[i].length
        if (offset < _t || i === this._bufs.length - 1) {
          return [i, offset - tot]
        }
        tot = _t
      }
    }
    BufferList3.prototype._reverseOffset = function (blOffset) {
      const bufferId = blOffset[0]
      let offset = blOffset[1]
      for (let i = 0; i < bufferId; i++) {
        offset += this._bufs[i].length
      }
      return offset
    }
    BufferList3.prototype.get = function get2(index) {
      if (index > this.length || index < 0) {
        return void 0
      }
      const offset = this._offset(index)
      return this._bufs[offset[0]][offset[1]]
    }
    BufferList3.prototype.slice = function slice2(start, end) {
      if (typeof start === 'number' && start < 0) {
        start += this.length
      }
      if (typeof end === 'number' && end < 0) {
        end += this.length
      }
      return this.copy(null, 0, start, end)
    }
    BufferList3.prototype.copy = function copy(
      dst,
      dstStart,
      srcStart,
      srcEnd
    ) {
      if (typeof srcStart !== 'number' || srcStart < 0) {
        srcStart = 0
      }
      if (typeof srcEnd !== 'number' || srcEnd > this.length) {
        srcEnd = this.length
      }
      if (srcStart >= this.length) {
        return dst || Buffer2.alloc(0)
      }
      if (srcEnd <= 0) {
        return dst || Buffer2.alloc(0)
      }
      const copy2 = !!dst
      const off = this._offset(srcStart)
      const len = srcEnd - srcStart
      let bytes2 = len
      let bufoff = (copy2 && dstStart) || 0
      let start = off[1]
      if (srcStart === 0 && srcEnd === this.length) {
        if (!copy2) {
          return this._bufs.length === 1
            ? this._bufs[0]
            : Buffer2.concat(this._bufs, this.length)
        }
        for (let i = 0; i < this._bufs.length; i++) {
          this._bufs[i].copy(dst, bufoff)
          bufoff += this._bufs[i].length
        }
        return dst
      }
      if (bytes2 <= this._bufs[off[0]].length - start) {
        return copy2
          ? this._bufs[off[0]].copy(dst, dstStart, start, start + bytes2)
          : this._bufs[off[0]].slice(start, start + bytes2)
      }
      if (!copy2) {
        dst = Buffer2.allocUnsafe(len)
      }
      for (let i = off[0]; i < this._bufs.length; i++) {
        const l = this._bufs[i].length - start
        if (bytes2 > l) {
          this._bufs[i].copy(dst, bufoff, start)
          bufoff += l
        } else {
          this._bufs[i].copy(dst, bufoff, start, start + bytes2)
          bufoff += l
          break
        }
        bytes2 -= l
        if (start) {
          start = 0
        }
      }
      if (dst.length > bufoff) return dst.slice(0, bufoff)
      return dst
    }
    BufferList3.prototype.shallowSlice = function shallowSlice(start, end) {
      start = start || 0
      end = typeof end !== 'number' ? this.length : end
      if (start < 0) {
        start += this.length
      }
      if (end < 0) {
        end += this.length
      }
      if (start === end) {
        return this._new()
      }
      const startOffset = this._offset(start)
      const endOffset = this._offset(end)
      const buffers = this._bufs.slice(startOffset[0], endOffset[0] + 1)
      if (endOffset[1] === 0) {
        buffers.pop()
      } else {
        buffers[buffers.length - 1] = buffers[buffers.length - 1].slice(
          0,
          endOffset[1]
        )
      }
      if (startOffset[1] !== 0) {
        buffers[0] = buffers[0].slice(startOffset[1])
      }
      return this._new(buffers)
    }
    BufferList3.prototype.toString = function toString3(encoding, start, end) {
      return this.slice(start, end).toString(encoding)
    }
    BufferList3.prototype.consume = function consume(bytes2) {
      bytes2 = Math.trunc(bytes2)
      if (Number.isNaN(bytes2) || bytes2 <= 0) return this
      while (this._bufs.length) {
        if (bytes2 >= this._bufs[0].length) {
          bytes2 -= this._bufs[0].length
          this.length -= this._bufs[0].length
          this._bufs.shift()
        } else {
          this._bufs[0] = this._bufs[0].slice(bytes2)
          this.length -= bytes2
          break
        }
      }
      return this
    }
    BufferList3.prototype.duplicate = function duplicate() {
      const copy = this._new()
      for (let i = 0; i < this._bufs.length; i++) {
        copy.append(this._bufs[i])
      }
      return copy
    }
    BufferList3.prototype.append = function append(buf2) {
      if (buf2 == null) {
        return this
      }
      if (buf2.buffer) {
        this._appendBuffer(
          Buffer2.from(buf2.buffer, buf2.byteOffset, buf2.byteLength)
        )
      } else if (Array.isArray(buf2)) {
        for (let i = 0; i < buf2.length; i++) {
          this.append(buf2[i])
        }
      } else if (this._isBufferList(buf2)) {
        for (let i = 0; i < buf2._bufs.length; i++) {
          this.append(buf2._bufs[i])
        }
      } else {
        if (typeof buf2 === 'number') {
          buf2 = buf2.toString()
        }
        this._appendBuffer(Buffer2.from(buf2))
      }
      return this
    }
    BufferList3.prototype._appendBuffer = function appendBuffer(buf2) {
      this._bufs.push(buf2)
      this.length += buf2.length
    }
    BufferList3.prototype.indexOf = function (search, offset, encoding) {
      if (encoding === void 0 && typeof offset === 'string') {
        encoding = offset
        offset = void 0
      }
      if (typeof search === 'function' || Array.isArray(search)) {
        throw new TypeError(
          'The "value" argument must be one of type string, Buffer, BufferList, or Uint8Array.'
        )
      } else if (typeof search === 'number') {
        search = Buffer2.from([search])
      } else if (typeof search === 'string') {
        search = Buffer2.from(search, encoding)
      } else if (this._isBufferList(search)) {
        search = search.slice()
      } else if (Array.isArray(search.buffer)) {
        search = Buffer2.from(
          search.buffer,
          search.byteOffset,
          search.byteLength
        )
      } else if (!Buffer2.isBuffer(search)) {
        search = Buffer2.from(search)
      }
      offset = Number(offset || 0)
      if (isNaN(offset)) {
        offset = 0
      }
      if (offset < 0) {
        offset = this.length + offset
      }
      if (offset < 0) {
        offset = 0
      }
      if (search.length === 0) {
        return offset > this.length ? this.length : offset
      }
      const blOffset = this._offset(offset)
      let blIndex = blOffset[0]
      let buffOffset = blOffset[1]
      for (; blIndex < this._bufs.length; blIndex++) {
        const buff = this._bufs[blIndex]
        while (buffOffset < buff.length) {
          const availableWindow = buff.length - buffOffset
          if (availableWindow >= search.length) {
            const nativeSearchResult = buff.indexOf(search, buffOffset)
            if (nativeSearchResult !== -1) {
              return this._reverseOffset([blIndex, nativeSearchResult])
            }
            buffOffset = buff.length - search.length + 1
          } else {
            const revOffset = this._reverseOffset([blIndex, buffOffset])
            if (this._match(revOffset, search)) {
              return revOffset
            }
            buffOffset++
          }
        }
        buffOffset = 0
      }
      return -1
    }
    BufferList3.prototype._match = function (offset, search) {
      if (this.length - offset < search.length) {
        return false
      }
      for (let searchOffset = 0; searchOffset < search.length; searchOffset++) {
        if (this.get(offset + searchOffset) !== search[searchOffset]) {
          return false
        }
      }
      return true
    }
    ;(function () {
      const methods = {
        readDoubleBE: 8,
        readDoubleLE: 8,
        readFloatBE: 4,
        readFloatLE: 4,
        readInt32BE: 4,
        readInt32LE: 4,
        readUInt32BE: 4,
        readUInt32LE: 4,
        readInt16BE: 2,
        readInt16LE: 2,
        readUInt16BE: 2,
        readUInt16LE: 2,
        readInt8: 1,
        readUInt8: 1,
        readIntBE: null,
        readIntLE: null,
        readUIntBE: null,
        readUIntLE: null,
      }
      for (const m in methods) {
        ;(function (m2) {
          if (methods[m2] === null) {
            BufferList3.prototype[m2] = function (offset, byteLength) {
              return this.slice(offset, offset + byteLength)[m2](0, byteLength)
            }
          } else {
            BufferList3.prototype[m2] = function (offset = 0) {
              return this.slice(offset, offset + methods[m2])[m2](0)
            }
          }
        })(m)
      }
    })()
    BufferList3.prototype._isBufferList = function _isBufferList(b) {
      return b instanceof BufferList3 || BufferList3.isBufferList(b)
    }
    BufferList3.isBufferList = function isBufferList(b) {
      return b != null && b[symbol]
    }
    module2.exports = BufferList3
  },
})

// node_modules/rabin-wasm/src/rabin.js
var require_rabin = __commonJS({
  'node_modules/rabin-wasm/src/rabin.js'(exports2, module2) {
    var Rabin = class {
      constructor(
        asModule,
        bits = 12,
        min = 8 * 1024,
        max = 32 * 1024,
        windowSize = 64,
        polynomial
      ) {
        this.bits = bits
        this.min = min
        this.max = max
        this.asModule = asModule
        this.rabin = new asModule.Rabin(bits, min, max, windowSize, polynomial)
        this.polynomial = polynomial
      }
      fingerprint(buf2) {
        const {
          __retain,
          __release,
          __allocArray,
          __getInt32Array,
          Int32Array_ID,
          Uint8Array_ID,
        } = this.asModule
        const lengths = new Int32Array(Math.ceil(buf2.length / this.min))
        const lengthsPtr = __retain(__allocArray(Int32Array_ID, lengths))
        const pointer = __retain(__allocArray(Uint8Array_ID, buf2))
        const out = this.rabin.fingerprint(pointer, lengthsPtr)
        const processed = __getInt32Array(out)
        __release(pointer)
        __release(lengthsPtr)
        const end = processed.indexOf(0)
        return end >= 0 ? processed.subarray(0, end) : processed
      }
    }
    module2.exports = Rabin
  },
})

// node_modules/@assemblyscript/loader/index.js
var require_loader = __commonJS({
  'node_modules/@assemblyscript/loader/index.js'(exports2) {
    'use strict'
    var ID_OFFSET = -8
    var SIZE_OFFSET = -4
    var ARRAYBUFFER_ID = 0
    var STRING_ID = 1
    var ARRAYBUFFERVIEW = 1 << 0
    var ARRAY = 1 << 1
    var SET = 1 << 2
    var MAP = 1 << 3
    var VAL_ALIGN_OFFSET = 5
    var VAL_ALIGN = 1 << VAL_ALIGN_OFFSET
    var VAL_SIGNED = 1 << 10
    var VAL_FLOAT = 1 << 11
    var VAL_NULLABLE = 1 << 12
    var VAL_MANAGED = 1 << 13
    var KEY_ALIGN_OFFSET = 14
    var KEY_ALIGN = 1 << KEY_ALIGN_OFFSET
    var KEY_SIGNED = 1 << 19
    var KEY_FLOAT = 1 << 20
    var KEY_NULLABLE = 1 << 21
    var KEY_MANAGED = 1 << 22
    var ARRAYBUFFERVIEW_BUFFER_OFFSET = 0
    var ARRAYBUFFERVIEW_DATASTART_OFFSET = 4
    var ARRAYBUFFERVIEW_DATALENGTH_OFFSET = 8
    var ARRAYBUFFERVIEW_SIZE = 12
    var ARRAY_LENGTH_OFFSET = 12
    var ARRAY_SIZE = 16
    var BIGINT = typeof BigUint64Array !== 'undefined'
    var THIS = Symbol()
    var CHUNKSIZE = 1024
    function getStringImpl(buffer2, ptr) {
      const U32 = new Uint32Array(buffer2)
      const U16 = new Uint16Array(buffer2)
      var length2 = U32[(ptr + SIZE_OFFSET) >>> 2] >>> 1
      var offset = ptr >>> 1
      if (length2 <= CHUNKSIZE)
        return String.fromCharCode.apply(
          String,
          U16.subarray(offset, offset + length2)
        )
      const parts = []
      do {
        const last2 = U16[offset + CHUNKSIZE - 1]
        const size = last2 >= 55296 && last2 < 56320 ? CHUNKSIZE - 1 : CHUNKSIZE
        parts.push(
          String.fromCharCode.apply(
            String,
            U16.subarray(offset, (offset += size))
          )
        )
        length2 -= size
      } while (length2 > CHUNKSIZE)
      return (
        parts.join('') +
        String.fromCharCode.apply(
          String,
          U16.subarray(offset, offset + length2)
        )
      )
    }
    function preInstantiate(imports) {
      const baseModule = {}
      function getString(memory, ptr) {
        if (!memory) return '<yet unknown>'
        return getStringImpl(memory.buffer, ptr)
      }
      const env = (imports.env = imports.env || {})
      env.abort =
        env.abort ||
        function abort(mesg, file2, line, colm) {
          const memory = baseModule.memory || env.memory
          throw Error(
            'abort: ' +
              getString(memory, mesg) +
              ' at ' +
              getString(memory, file2) +
              ':' +
              line +
              ':' +
              colm
          )
        }
      env.trace =
        env.trace ||
        function trace(mesg, n) {
          const memory = baseModule.memory || env.memory
          console.log(
            'trace: ' +
              getString(memory, mesg) +
              (n ? ' ' : '') +
              Array.prototype.slice.call(arguments, 2, 2 + n).join(', ')
          )
        }
      imports.Math = imports.Math || Math
      imports.Date = imports.Date || Date
      return baseModule
    }
    function postInstantiate(baseModule, instance) {
      const rawExports = instance.exports
      const memory = rawExports.memory
      const table = rawExports.table
      const alloc2 = rawExports['__alloc']
      const retain = rawExports['__retain']
      const rttiBase = rawExports['__rtti_base'] || ~0
      function getInfo(id) {
        const U32 = new Uint32Array(memory.buffer)
        const count = U32[rttiBase >>> 2]
        if ((id >>>= 0) >= count) throw Error('invalid id: ' + id)
        return U32[((rttiBase + 4) >>> 2) + id * 2]
      }
      function getBase(id) {
        const U32 = new Uint32Array(memory.buffer)
        const count = U32[rttiBase >>> 2]
        if ((id >>>= 0) >= count) throw Error('invalid id: ' + id)
        return U32[((rttiBase + 4) >>> 2) + id * 2 + 1]
      }
      function getValueAlign(info) {
        return 31 - Math.clz32((info >>> VAL_ALIGN_OFFSET) & 31)
      }
      function getKeyAlign(info) {
        return 31 - Math.clz32((info >>> KEY_ALIGN_OFFSET) & 31)
      }
      function __allocString(str) {
        const length2 = str.length
        const ptr = alloc2(length2 << 1, STRING_ID)
        const U16 = new Uint16Array(memory.buffer)
        for (var i = 0, p = ptr >>> 1; i < length2; ++i)
          U16[p + i] = str.charCodeAt(i)
        return ptr
      }
      baseModule.__allocString = __allocString
      function __getString(ptr) {
        const buffer2 = memory.buffer
        const id = new Uint32Array(buffer2)[(ptr + ID_OFFSET) >>> 2]
        if (id !== STRING_ID) throw Error('not a string: ' + ptr)
        return getStringImpl(buffer2, ptr)
      }
      baseModule.__getString = __getString
      function getView(alignLog2, signed, float2) {
        const buffer2 = memory.buffer
        if (float2) {
          switch (alignLog2) {
            case 2:
              return new Float32Array(buffer2)
            case 3:
              return new Float64Array(buffer2)
          }
        } else {
          switch (alignLog2) {
            case 0:
              return new (signed ? Int8Array : Uint8Array)(buffer2)
            case 1:
              return new (signed ? Int16Array : Uint16Array)(buffer2)
            case 2:
              return new (signed ? Int32Array : Uint32Array)(buffer2)
            case 3:
              return new (signed ? BigInt64Array : BigUint64Array)(buffer2)
          }
        }
        throw Error('unsupported align: ' + alignLog2)
      }
      function __allocArray(id, values) {
        const info = getInfo(id)
        if (!(info & (ARRAYBUFFERVIEW | ARRAY)))
          throw Error('not an array: ' + id + ' @ ' + info)
        const align = getValueAlign(info)
        const length2 = values.length
        const buf2 = alloc2(length2 << align, ARRAYBUFFER_ID)
        const arr = alloc2(info & ARRAY ? ARRAY_SIZE : ARRAYBUFFERVIEW_SIZE, id)
        const U32 = new Uint32Array(memory.buffer)
        U32[(arr + ARRAYBUFFERVIEW_BUFFER_OFFSET) >>> 2] = retain(buf2)
        U32[(arr + ARRAYBUFFERVIEW_DATASTART_OFFSET) >>> 2] = buf2
        U32[(arr + ARRAYBUFFERVIEW_DATALENGTH_OFFSET) >>> 2] = length2 << align
        if (info & ARRAY) U32[(arr + ARRAY_LENGTH_OFFSET) >>> 2] = length2
        const view = getView(align, info & VAL_SIGNED, info & VAL_FLOAT)
        if (info & VAL_MANAGED) {
          for (let i = 0; i < length2; ++i)
            view[(buf2 >>> align) + i] = retain(values[i])
        } else {
          view.set(values, buf2 >>> align)
        }
        return arr
      }
      baseModule.__allocArray = __allocArray
      function __getArrayView(arr) {
        const U32 = new Uint32Array(memory.buffer)
        const id = U32[(arr + ID_OFFSET) >>> 2]
        const info = getInfo(id)
        if (!(info & ARRAYBUFFERVIEW)) throw Error('not an array: ' + id)
        const align = getValueAlign(info)
        var buf2 = U32[(arr + ARRAYBUFFERVIEW_DATASTART_OFFSET) >>> 2]
        const length2 =
          info & ARRAY
            ? U32[(arr + ARRAY_LENGTH_OFFSET) >>> 2]
            : U32[(buf2 + SIZE_OFFSET) >>> 2] >>> align
        return getView(align, info & VAL_SIGNED, info & VAL_FLOAT).subarray(
          (buf2 >>>= align),
          buf2 + length2
        )
      }
      baseModule.__getArrayView = __getArrayView
      function __getArray(arr) {
        const input = __getArrayView(arr)
        const len = input.length
        const out = new Array(len)
        for (let i = 0; i < len; i++) out[i] = input[i]
        return out
      }
      baseModule.__getArray = __getArray
      function __getArrayBuffer(ptr) {
        const buffer2 = memory.buffer
        const length2 = new Uint32Array(buffer2)[(ptr + SIZE_OFFSET) >>> 2]
        return buffer2.slice(ptr, ptr + length2)
      }
      baseModule.__getArrayBuffer = __getArrayBuffer
      function getTypedArray(Type2, alignLog2, ptr) {
        return new Type2(getTypedArrayView(Type2, alignLog2, ptr))
      }
      function getTypedArrayView(Type2, alignLog2, ptr) {
        const buffer2 = memory.buffer
        const U32 = new Uint32Array(buffer2)
        const bufPtr = U32[(ptr + ARRAYBUFFERVIEW_DATASTART_OFFSET) >>> 2]
        return new Type2(
          buffer2,
          bufPtr,
          U32[(bufPtr + SIZE_OFFSET) >>> 2] >>> alignLog2
        )
      }
      baseModule.__getInt8Array = getTypedArray.bind(null, Int8Array, 0)
      baseModule.__getInt8ArrayView = getTypedArrayView.bind(null, Int8Array, 0)
      baseModule.__getUint8Array = getTypedArray.bind(null, Uint8Array, 0)
      baseModule.__getUint8ArrayView = getTypedArrayView.bind(
        null,
        Uint8Array,
        0
      )
      baseModule.__getUint8ClampedArray = getTypedArray.bind(
        null,
        Uint8ClampedArray,
        0
      )
      baseModule.__getUint8ClampedArrayView = getTypedArrayView.bind(
        null,
        Uint8ClampedArray,
        0
      )
      baseModule.__getInt16Array = getTypedArray.bind(null, Int16Array, 1)
      baseModule.__getInt16ArrayView = getTypedArrayView.bind(
        null,
        Int16Array,
        1
      )
      baseModule.__getUint16Array = getTypedArray.bind(null, Uint16Array, 1)
      baseModule.__getUint16ArrayView = getTypedArrayView.bind(
        null,
        Uint16Array,
        1
      )
      baseModule.__getInt32Array = getTypedArray.bind(null, Int32Array, 2)
      baseModule.__getInt32ArrayView = getTypedArrayView.bind(
        null,
        Int32Array,
        2
      )
      baseModule.__getUint32Array = getTypedArray.bind(null, Uint32Array, 2)
      baseModule.__getUint32ArrayView = getTypedArrayView.bind(
        null,
        Uint32Array,
        2
      )
      if (BIGINT) {
        baseModule.__getInt64Array = getTypedArray.bind(null, BigInt64Array, 3)
        baseModule.__getInt64ArrayView = getTypedArrayView.bind(
          null,
          BigInt64Array,
          3
        )
        baseModule.__getUint64Array = getTypedArray.bind(
          null,
          BigUint64Array,
          3
        )
        baseModule.__getUint64ArrayView = getTypedArrayView.bind(
          null,
          BigUint64Array,
          3
        )
      }
      baseModule.__getFloat32Array = getTypedArray.bind(null, Float32Array, 2)
      baseModule.__getFloat32ArrayView = getTypedArrayView.bind(
        null,
        Float32Array,
        2
      )
      baseModule.__getFloat64Array = getTypedArray.bind(null, Float64Array, 3)
      baseModule.__getFloat64ArrayView = getTypedArrayView.bind(
        null,
        Float64Array,
        3
      )
      function __instanceof(ptr, baseId) {
        const U32 = new Uint32Array(memory.buffer)
        var id = U32[(ptr + ID_OFFSET) >>> 2]
        if (id <= U32[rttiBase >>> 2]) {
          do if (id == baseId) return true
          while ((id = getBase(id)))
        }
        return false
      }
      baseModule.__instanceof = __instanceof
      baseModule.memory = baseModule.memory || memory
      baseModule.table = baseModule.table || table
      return demangle(rawExports, baseModule)
    }
    function isResponse(o) {
      return typeof Response !== 'undefined' && o instanceof Response
    }
    async function instantiate(source, imports) {
      if (isResponse((source = await source)))
        return instantiateStreaming(source, imports)
      return postInstantiate(
        preInstantiate(imports || (imports = {})),
        await WebAssembly.instantiate(
          source instanceof WebAssembly.Module
            ? source
            : await WebAssembly.compile(source),
          imports
        )
      )
    }
    exports2.instantiate = instantiate
    function instantiateSync(source, imports) {
      return postInstantiate(
        preInstantiate(imports || (imports = {})),
        new WebAssembly.Instance(
          source instanceof WebAssembly.Module
            ? source
            : new WebAssembly.Module(source),
          imports
        )
      )
    }
    exports2.instantiateSync = instantiateSync
    async function instantiateStreaming(source, imports) {
      if (!WebAssembly.instantiateStreaming) {
        return instantiate(
          isResponse((source = await source)) ? source.arrayBuffer() : source,
          imports
        )
      }
      return postInstantiate(
        preInstantiate(imports || (imports = {})),
        (await WebAssembly.instantiateStreaming(source, imports)).instance
      )
    }
    exports2.instantiateStreaming = instantiateStreaming
    function demangle(exports3, baseModule) {
      var module3 = baseModule ? Object.create(baseModule) : {}
      var setArgumentsLength = exports3['__argumentsLength']
        ? function (length2) {
            exports3['__argumentsLength'].value = length2
          }
        : exports3['__setArgumentsLength'] ||
          exports3['__setargc'] ||
          function () {}
      for (let internalName in exports3) {
        if (!Object.prototype.hasOwnProperty.call(exports3, internalName))
          continue
        const elem = exports3[internalName]
        let parts = internalName.split('.')
        let curr = module3
        while (parts.length > 1) {
          let part = parts.shift()
          if (!Object.prototype.hasOwnProperty.call(curr, part)) curr[part] = {}
          curr = curr[part]
        }
        let name6 = parts[0]
        let hash = name6.indexOf('#')
        if (hash >= 0) {
          let className = name6.substring(0, hash)
          let classElem = curr[className]
          if (typeof classElem === 'undefined' || !classElem.prototype) {
            let ctor = function (...args) {
              return ctor.wrap(ctor.prototype.constructor(0, ...args))
            }
            ctor.prototype = {
              valueOf: function valueOf() {
                return this[THIS]
              },
            }
            ctor.wrap = function (thisValue) {
              return Object.create(ctor.prototype, {
                [THIS]: { value: thisValue, writable: false },
              })
            }
            if (classElem)
              Object.getOwnPropertyNames(classElem).forEach((name7) =>
                Object.defineProperty(
                  ctor,
                  name7,
                  Object.getOwnPropertyDescriptor(classElem, name7)
                )
              )
            curr[className] = ctor
          }
          name6 = name6.substring(hash + 1)
          curr = curr[className].prototype
          if (/^(get|set):/.test(name6)) {
            if (
              !Object.prototype.hasOwnProperty.call(
                curr,
                (name6 = name6.substring(4))
              )
            ) {
              let getter = exports3[internalName.replace('set:', 'get:')]
              let setter = exports3[internalName.replace('get:', 'set:')]
              Object.defineProperty(curr, name6, {
                get: function () {
                  return getter(this[THIS])
                },
                set: function (value) {
                  setter(this[THIS], value)
                },
                enumerable: true,
              })
            }
          } else {
            if (name6 === 'constructor') {
              ;(curr[name6] = (...args) => {
                setArgumentsLength(args.length)
                return elem(...args)
              }).original = elem
            } else {
              ;(curr[name6] = function (...args) {
                setArgumentsLength(args.length)
                return elem(this[THIS], ...args)
              }).original = elem
            }
          }
        } else {
          if (/^(get|set):/.test(name6)) {
            if (
              !Object.prototype.hasOwnProperty.call(
                curr,
                (name6 = name6.substring(4))
              )
            ) {
              Object.defineProperty(curr, name6, {
                get: exports3[internalName.replace('set:', 'get:')],
                set: exports3[internalName.replace('get:', 'set:')],
                enumerable: true,
              })
            }
          } else if (
            typeof elem === 'function' &&
            elem !== setArgumentsLength
          ) {
            ;(curr[name6] = (...args) => {
              setArgumentsLength(args.length)
              return elem(...args)
            }).original = elem
          } else {
            curr[name6] = elem
          }
        }
      }
      return module3
    }
    exports2.demangle = demangle
  },
})

// node_modules/rabin-wasm/dist/rabin-wasm.js
var require_rabin_wasm = __commonJS({
  'node_modules/rabin-wasm/dist/rabin-wasm.js'(exports2, module2) {
    var { instantiate } = require_loader()
    loadWebAssembly.supported = typeof WebAssembly !== 'undefined'
    function loadWebAssembly(imp = {}) {
      if (!loadWebAssembly.supported) return null
      var wasm = new Uint8Array([
        0, 97, 115, 109, 1, 0, 0, 0, 1, 78, 14, 96, 2, 127, 126, 0, 96, 1, 127,
        1, 126, 96, 2, 127, 127, 0, 96, 1, 127, 1, 127, 96, 1, 127, 0, 96, 2,
        127, 127, 1, 127, 96, 3, 127, 127, 127, 1, 127, 96, 0, 0, 96, 3, 127,
        127, 127, 0, 96, 0, 1, 127, 96, 4, 127, 127, 127, 127, 0, 96, 5, 127,
        127, 127, 127, 127, 1, 127, 96, 1, 126, 1, 127, 96, 2, 126, 126, 1, 126,
        2, 13, 1, 3, 101, 110, 118, 5, 97, 98, 111, 114, 116, 0, 10, 3, 54, 53,
        2, 2, 8, 9, 3, 5, 2, 8, 6, 5, 3, 4, 2, 6, 9, 12, 13, 2, 5, 11, 3, 2, 3,
        2, 3, 2, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
        0, 6, 7, 7, 4, 4, 5, 3, 1, 0, 1, 6, 47, 9, 127, 1, 65, 0, 11, 127, 1,
        65, 0, 11, 127, 0, 65, 3, 11, 127, 0, 65, 4, 11, 127, 1, 65, 0, 11, 127,
        1, 65, 0, 11, 127, 1, 65, 0, 11, 127, 0, 65, 240, 2, 11, 127, 0, 65, 6,
        11, 7, 240, 5, 41, 6, 109, 101, 109, 111, 114, 121, 2, 0, 7, 95, 95, 97,
        108, 108, 111, 99, 0, 10, 8, 95, 95, 114, 101, 116, 97, 105, 110, 0, 11,
        9, 95, 95, 114, 101, 108, 101, 97, 115, 101, 0, 12, 9, 95, 95, 99, 111,
        108, 108, 101, 99, 116, 0, 51, 11, 95, 95, 114, 116, 116, 105, 95, 98,
        97, 115, 101, 3, 7, 13, 73, 110, 116, 51, 50, 65, 114, 114, 97, 121, 95,
        73, 68, 3, 2, 13, 85, 105, 110, 116, 56, 65, 114, 114, 97, 121, 95, 73,
        68, 3, 3, 6, 100, 101, 103, 114, 101, 101, 0, 16, 3, 109, 111, 100, 0,
        17, 5, 82, 97, 98, 105, 110, 3, 8, 16, 82, 97, 98, 105, 110, 35, 103,
        101, 116, 58, 119, 105, 110, 100, 111, 119, 0, 21, 16, 82, 97, 98, 105,
        110, 35, 115, 101, 116, 58, 119, 105, 110, 100, 111, 119, 0, 22, 21, 82,
        97, 98, 105, 110, 35, 103, 101, 116, 58, 119, 105, 110, 100, 111, 119,
        95, 115, 105, 122, 101, 0, 23, 21, 82, 97, 98, 105, 110, 35, 115, 101,
        116, 58, 119, 105, 110, 100, 111, 119, 95, 115, 105, 122, 101, 0, 24,
        14, 82, 97, 98, 105, 110, 35, 103, 101, 116, 58, 119, 112, 111, 115, 0,
        25, 14, 82, 97, 98, 105, 110, 35, 115, 101, 116, 58, 119, 112, 111, 115,
        0, 26, 15, 82, 97, 98, 105, 110, 35, 103, 101, 116, 58, 99, 111, 117,
        110, 116, 0, 27, 15, 82, 97, 98, 105, 110, 35, 115, 101, 116, 58, 99,
        111, 117, 110, 116, 0, 28, 13, 82, 97, 98, 105, 110, 35, 103, 101, 116,
        58, 112, 111, 115, 0, 29, 13, 82, 97, 98, 105, 110, 35, 115, 101, 116,
        58, 112, 111, 115, 0, 30, 15, 82, 97, 98, 105, 110, 35, 103, 101, 116,
        58, 115, 116, 97, 114, 116, 0, 31, 15, 82, 97, 98, 105, 110, 35, 115,
        101, 116, 58, 115, 116, 97, 114, 116, 0, 32, 16, 82, 97, 98, 105, 110,
        35, 103, 101, 116, 58, 100, 105, 103, 101, 115, 116, 0, 33, 16, 82, 97,
        98, 105, 110, 35, 115, 101, 116, 58, 100, 105, 103, 101, 115, 116, 0,
        34, 21, 82, 97, 98, 105, 110, 35, 103, 101, 116, 58, 99, 104, 117, 110,
        107, 95, 115, 116, 97, 114, 116, 0, 35, 21, 82, 97, 98, 105, 110, 35,
        115, 101, 116, 58, 99, 104, 117, 110, 107, 95, 115, 116, 97, 114, 116,
        0, 36, 22, 82, 97, 98, 105, 110, 35, 103, 101, 116, 58, 99, 104, 117,
        110, 107, 95, 108, 101, 110, 103, 116, 104, 0, 37, 22, 82, 97, 98, 105,
        110, 35, 115, 101, 116, 58, 99, 104, 117, 110, 107, 95, 108, 101, 110,
        103, 116, 104, 0, 38, 31, 82, 97, 98, 105, 110, 35, 103, 101, 116, 58,
        99, 104, 117, 110, 107, 95, 99, 117, 116, 95, 102, 105, 110, 103, 101,
        114, 112, 114, 105, 110, 116, 0, 39, 31, 82, 97, 98, 105, 110, 35, 115,
        101, 116, 58, 99, 104, 117, 110, 107, 95, 99, 117, 116, 95, 102, 105,
        110, 103, 101, 114, 112, 114, 105, 110, 116, 0, 40, 20, 82, 97, 98, 105,
        110, 35, 103, 101, 116, 58, 112, 111, 108, 121, 110, 111, 109, 105, 97,
        108, 0, 41, 20, 82, 97, 98, 105, 110, 35, 115, 101, 116, 58, 112, 111,
        108, 121, 110, 111, 109, 105, 97, 108, 0, 42, 17, 82, 97, 98, 105, 110,
        35, 103, 101, 116, 58, 109, 105, 110, 115, 105, 122, 101, 0, 43, 17, 82,
        97, 98, 105, 110, 35, 115, 101, 116, 58, 109, 105, 110, 115, 105, 122,
        101, 0, 44, 17, 82, 97, 98, 105, 110, 35, 103, 101, 116, 58, 109, 97,
        120, 115, 105, 122, 101, 0, 45, 17, 82, 97, 98, 105, 110, 35, 115, 101,
        116, 58, 109, 97, 120, 115, 105, 122, 101, 0, 46, 14, 82, 97, 98, 105,
        110, 35, 103, 101, 116, 58, 109, 97, 115, 107, 0, 47, 14, 82, 97, 98,
        105, 110, 35, 115, 101, 116, 58, 109, 97, 115, 107, 0, 48, 17, 82, 97,
        98, 105, 110, 35, 99, 111, 110, 115, 116, 114, 117, 99, 116, 111, 114,
        0, 20, 17, 82, 97, 98, 105, 110, 35, 102, 105, 110, 103, 101, 114, 112,
        114, 105, 110, 116, 0, 49, 8, 1, 50, 10, 165, 31, 53, 199, 1, 1, 4, 127,
        32, 1, 40, 2, 0, 65, 124, 113, 34, 2, 65, 128, 2, 73, 4, 127, 32, 2, 65,
        4, 118, 33, 4, 65, 0, 5, 32, 2, 65, 31, 32, 2, 103, 107, 34, 3, 65, 4,
        107, 118, 65, 16, 115, 33, 4, 32, 3, 65, 7, 107, 11, 33, 3, 32, 1, 40,
        2, 20, 33, 2, 32, 1, 40, 2, 16, 34, 5, 4, 64, 32, 5, 32, 2, 54, 2, 20,
        11, 32, 2, 4, 64, 32, 2, 32, 5, 54, 2, 16, 11, 32, 1, 32, 0, 32, 4, 32,
        3, 65, 4, 116, 106, 65, 2, 116, 106, 40, 2, 96, 70, 4, 64, 32, 0, 32, 4,
        32, 3, 65, 4, 116, 106, 65, 2, 116, 106, 32, 2, 54, 2, 96, 32, 2, 69, 4,
        64, 32, 0, 32, 3, 65, 2, 116, 106, 32, 0, 32, 3, 65, 2, 116, 106, 40, 2,
        4, 65, 1, 32, 4, 116, 65, 127, 115, 113, 34, 1, 54, 2, 4, 32, 1, 69, 4,
        64, 32, 0, 32, 0, 40, 2, 0, 65, 1, 32, 3, 116, 65, 127, 115, 113, 54, 2,
        0, 11, 11, 11, 11, 226, 2, 1, 6, 127, 32, 1, 40, 2, 0, 33, 3, 32, 1, 65,
        16, 106, 32, 1, 40, 2, 0, 65, 124, 113, 106, 34, 4, 40, 2, 0, 34, 5, 65,
        1, 113, 4, 64, 32, 3, 65, 124, 113, 65, 16, 106, 32, 5, 65, 124, 113,
        106, 34, 2, 65, 240, 255, 255, 255, 3, 73, 4, 64, 32, 0, 32, 4, 16, 1,
        32, 1, 32, 2, 32, 3, 65, 3, 113, 114, 34, 3, 54, 2, 0, 32, 1, 65, 16,
        106, 32, 1, 40, 2, 0, 65, 124, 113, 106, 34, 4, 40, 2, 0, 33, 5, 11, 11,
        32, 3, 65, 2, 113, 4, 64, 32, 1, 65, 4, 107, 40, 2, 0, 34, 2, 40, 2, 0,
        34, 6, 65, 124, 113, 65, 16, 106, 32, 3, 65, 124, 113, 106, 34, 7, 65,
        240, 255, 255, 255, 3, 73, 4, 64, 32, 0, 32, 2, 16, 1, 32, 2, 32, 7, 32,
        6, 65, 3, 113, 114, 34, 3, 54, 2, 0, 32, 2, 33, 1, 11, 11, 32, 4, 32, 5,
        65, 2, 114, 54, 2, 0, 32, 4, 65, 4, 107, 32, 1, 54, 2, 0, 32, 0, 32, 3,
        65, 124, 113, 34, 2, 65, 128, 2, 73, 4, 127, 32, 2, 65, 4, 118, 33, 4,
        65, 0, 5, 32, 2, 65, 31, 32, 2, 103, 107, 34, 2, 65, 4, 107, 118, 65,
        16, 115, 33, 4, 32, 2, 65, 7, 107, 11, 34, 3, 65, 4, 116, 32, 4, 106,
        65, 2, 116, 106, 40, 2, 96, 33, 2, 32, 1, 65, 0, 54, 2, 16, 32, 1, 32,
        2, 54, 2, 20, 32, 2, 4, 64, 32, 2, 32, 1, 54, 2, 16, 11, 32, 0, 32, 4,
        32, 3, 65, 4, 116, 106, 65, 2, 116, 106, 32, 1, 54, 2, 96, 32, 0, 32, 0,
        40, 2, 0, 65, 1, 32, 3, 116, 114, 54, 2, 0, 32, 0, 32, 3, 65, 2, 116,
        106, 32, 0, 32, 3, 65, 2, 116, 106, 40, 2, 4, 65, 1, 32, 4, 116, 114,
        54, 2, 4, 11, 119, 1, 1, 127, 32, 2, 2, 127, 32, 0, 40, 2, 160, 12, 34,
        2, 4, 64, 32, 2, 32, 1, 65, 16, 107, 70, 4, 64, 32, 2, 40, 2, 0, 33, 3,
        32, 1, 65, 16, 107, 33, 1, 11, 11, 32, 1, 11, 107, 34, 2, 65, 48, 73, 4,
        64, 15, 11, 32, 1, 32, 3, 65, 2, 113, 32, 2, 65, 32, 107, 65, 1, 114,
        114, 54, 2, 0, 32, 1, 65, 0, 54, 2, 16, 32, 1, 65, 0, 54, 2, 20, 32, 1,
        32, 2, 106, 65, 16, 107, 34, 2, 65, 2, 54, 2, 0, 32, 0, 32, 2, 54, 2,
        160, 12, 32, 0, 32, 1, 16, 2, 11, 155, 1, 1, 3, 127, 35, 0, 34, 0, 69,
        4, 64, 65, 1, 63, 0, 34, 0, 74, 4, 127, 65, 1, 32, 0, 107, 64, 0, 65, 0,
        72, 5, 65, 0, 11, 4, 64, 0, 11, 65, 176, 3, 34, 0, 65, 0, 54, 2, 0, 65,
        208, 15, 65, 0, 54, 2, 0, 3, 64, 32, 1, 65, 23, 73, 4, 64, 32, 1, 65, 2,
        116, 65, 176, 3, 106, 65, 0, 54, 2, 4, 65, 0, 33, 2, 3, 64, 32, 2, 65,
        16, 73, 4, 64, 32, 1, 65, 4, 116, 32, 2, 106, 65, 2, 116, 65, 176, 3,
        106, 65, 0, 54, 2, 96, 32, 2, 65, 1, 106, 33, 2, 12, 1, 11, 11, 32, 1,
        65, 1, 106, 33, 1, 12, 1, 11, 11, 65, 176, 3, 65, 224, 15, 63, 0, 65,
        16, 116, 16, 3, 65, 176, 3, 36, 0, 11, 32, 0, 11, 45, 0, 32, 0, 65, 240,
        255, 255, 255, 3, 79, 4, 64, 65, 32, 65, 224, 0, 65, 201, 3, 65, 29, 16,
        0, 0, 11, 32, 0, 65, 15, 106, 65, 112, 113, 34, 0, 65, 16, 32, 0, 65,
        16, 75, 27, 11, 169, 1, 1, 1, 127, 32, 0, 32, 1, 65, 128, 2, 73, 4, 127,
        32, 1, 65, 4, 118, 33, 1, 65, 0, 5, 32, 1, 65, 248, 255, 255, 255, 1,
        73, 4, 64, 32, 1, 65, 1, 65, 27, 32, 1, 103, 107, 116, 106, 65, 1, 107,
        33, 1, 11, 32, 1, 65, 31, 32, 1, 103, 107, 34, 2, 65, 4, 107, 118, 65,
        16, 115, 33, 1, 32, 2, 65, 7, 107, 11, 34, 2, 65, 2, 116, 106, 40, 2, 4,
        65, 127, 32, 1, 116, 113, 34, 1, 4, 127, 32, 0, 32, 1, 104, 32, 2, 65,
        4, 116, 106, 65, 2, 116, 106, 40, 2, 96, 5, 32, 0, 40, 2, 0, 65, 127,
        32, 2, 65, 1, 106, 116, 113, 34, 1, 4, 127, 32, 0, 32, 0, 32, 1, 104,
        34, 0, 65, 2, 116, 106, 40, 2, 4, 104, 32, 0, 65, 4, 116, 106, 65, 2,
        116, 106, 40, 2, 96, 5, 65, 0, 11, 11, 11, 111, 1, 1, 127, 63, 0, 34, 2,
        32, 1, 65, 248, 255, 255, 255, 1, 73, 4, 127, 32, 1, 65, 1, 65, 27, 32,
        1, 103, 107, 116, 65, 1, 107, 106, 5, 32, 1, 11, 65, 16, 32, 0, 40, 2,
        160, 12, 32, 2, 65, 16, 116, 65, 16, 107, 71, 116, 106, 65, 255, 255, 3,
        106, 65, 128, 128, 124, 113, 65, 16, 118, 34, 1, 32, 2, 32, 1, 74, 27,
        64, 0, 65, 0, 72, 4, 64, 32, 1, 64, 0, 65, 0, 72, 4, 64, 0, 11, 11, 32,
        0, 32, 2, 65, 16, 116, 63, 0, 65, 16, 116, 16, 3, 11, 113, 1, 2, 127,
        32, 1, 40, 2, 0, 34, 3, 65, 124, 113, 32, 2, 107, 34, 4, 65, 32, 79, 4,
        64, 32, 1, 32, 2, 32, 3, 65, 2, 113, 114, 54, 2, 0, 32, 2, 32, 1, 65,
        16, 106, 106, 34, 1, 32, 4, 65, 16, 107, 65, 1, 114, 54, 2, 0, 32, 0,
        32, 1, 16, 2, 5, 32, 1, 32, 3, 65, 126, 113, 54, 2, 0, 32, 1, 65, 16,
        106, 32, 1, 40, 2, 0, 65, 124, 113, 106, 32, 1, 65, 16, 106, 32, 1, 40,
        2, 0, 65, 124, 113, 106, 40, 2, 0, 65, 125, 113, 54, 2, 0, 11, 11, 91,
        1, 2, 127, 32, 0, 32, 1, 16, 5, 34, 4, 16, 6, 34, 3, 69, 4, 64, 65, 1,
        36, 1, 65, 0, 36, 1, 32, 0, 32, 4, 16, 6, 34, 3, 69, 4, 64, 32, 0, 32,
        4, 16, 7, 32, 0, 32, 4, 16, 6, 33, 3, 11, 11, 32, 3, 65, 0, 54, 2, 4,
        32, 3, 32, 2, 54, 2, 8, 32, 3, 32, 1, 54, 2, 12, 32, 0, 32, 3, 16, 1,
        32, 0, 32, 3, 32, 4, 16, 8, 32, 3, 11, 13, 0, 16, 4, 32, 0, 32, 1, 16,
        9, 65, 16, 106, 11, 33, 1, 1, 127, 32, 0, 65, 172, 3, 75, 4, 64, 32, 0,
        65, 16, 107, 34, 1, 32, 1, 40, 2, 4, 65, 1, 106, 54, 2, 4, 11, 32, 0,
        11, 18, 0, 32, 0, 65, 172, 3, 75, 4, 64, 32, 0, 65, 16, 107, 16, 52, 11,
        11, 140, 3, 1, 1, 127, 2, 64, 32, 1, 69, 13, 0, 32, 0, 65, 0, 58, 0, 0,
        32, 0, 32, 1, 106, 65, 1, 107, 65, 0, 58, 0, 0, 32, 1, 65, 2, 77, 13, 0,
        32, 0, 65, 1, 106, 65, 0, 58, 0, 0, 32, 0, 65, 2, 106, 65, 0, 58, 0, 0,
        32, 0, 32, 1, 106, 34, 2, 65, 2, 107, 65, 0, 58, 0, 0, 32, 2, 65, 3,
        107, 65, 0, 58, 0, 0, 32, 1, 65, 6, 77, 13, 0, 32, 0, 65, 3, 106, 65, 0,
        58, 0, 0, 32, 0, 32, 1, 106, 65, 4, 107, 65, 0, 58, 0, 0, 32, 1, 65, 8,
        77, 13, 0, 32, 1, 65, 0, 32, 0, 107, 65, 3, 113, 34, 1, 107, 33, 2, 32,
        0, 32, 1, 106, 34, 0, 65, 0, 54, 2, 0, 32, 0, 32, 2, 65, 124, 113, 34,
        1, 106, 65, 4, 107, 65, 0, 54, 2, 0, 32, 1, 65, 8, 77, 13, 0, 32, 0, 65,
        4, 106, 65, 0, 54, 2, 0, 32, 0, 65, 8, 106, 65, 0, 54, 2, 0, 32, 0, 32,
        1, 106, 34, 2, 65, 12, 107, 65, 0, 54, 2, 0, 32, 2, 65, 8, 107, 65, 0,
        54, 2, 0, 32, 1, 65, 24, 77, 13, 0, 32, 0, 65, 12, 106, 65, 0, 54, 2, 0,
        32, 0, 65, 16, 106, 65, 0, 54, 2, 0, 32, 0, 65, 20, 106, 65, 0, 54, 2,
        0, 32, 0, 65, 24, 106, 65, 0, 54, 2, 0, 32, 0, 32, 1, 106, 34, 2, 65,
        28, 107, 65, 0, 54, 2, 0, 32, 2, 65, 24, 107, 65, 0, 54, 2, 0, 32, 2,
        65, 20, 107, 65, 0, 54, 2, 0, 32, 2, 65, 16, 107, 65, 0, 54, 2, 0, 32,
        0, 32, 0, 65, 4, 113, 65, 24, 106, 34, 2, 106, 33, 0, 32, 1, 32, 2, 107,
        33, 1, 3, 64, 32, 1, 65, 32, 79, 4, 64, 32, 0, 66, 0, 55, 3, 0, 32, 0,
        65, 8, 106, 66, 0, 55, 3, 0, 32, 0, 65, 16, 106, 66, 0, 55, 3, 0, 32, 0,
        65, 24, 106, 66, 0, 55, 3, 0, 32, 1, 65, 32, 107, 33, 1, 32, 0, 65, 32,
        106, 33, 0, 12, 1, 11, 11, 11, 11, 178, 1, 1, 3, 127, 32, 1, 65, 240,
        255, 255, 255, 3, 32, 2, 118, 75, 4, 64, 65, 144, 1, 65, 192, 1, 65, 23,
        65, 56, 16, 0, 0, 11, 32, 1, 32, 2, 116, 34, 3, 65, 0, 16, 10, 34, 2,
        32, 3, 16, 13, 32, 0, 69, 4, 64, 65, 12, 65, 2, 16, 10, 34, 0, 65, 172,
        3, 75, 4, 64, 32, 0, 65, 16, 107, 34, 1, 32, 1, 40, 2, 4, 65, 1, 106,
        54, 2, 4, 11, 11, 32, 0, 65, 0, 54, 2, 0, 32, 0, 65, 0, 54, 2, 4, 32, 0,
        65, 0, 54, 2, 8, 32, 2, 34, 1, 32, 0, 40, 2, 0, 34, 4, 71, 4, 64, 32, 1,
        65, 172, 3, 75, 4, 64, 32, 1, 65, 16, 107, 34, 5, 32, 5, 40, 2, 4, 65,
        1, 106, 54, 2, 4, 11, 32, 4, 16, 12, 11, 32, 0, 32, 1, 54, 2, 0, 32, 0,
        32, 2, 54, 2, 4, 32, 0, 32, 3, 54, 2, 8, 32, 0, 11, 46, 1, 2, 127, 65,
        12, 65, 5, 16, 10, 34, 0, 65, 172, 3, 75, 4, 64, 32, 0, 65, 16, 107, 34,
        1, 32, 1, 40, 2, 4, 65, 1, 106, 54, 2, 4, 11, 32, 0, 65, 128, 2, 65, 3,
        16, 14, 11, 9, 0, 65, 63, 32, 0, 121, 167, 107, 11, 49, 1, 2, 127, 65,
        63, 32, 1, 121, 167, 107, 33, 2, 3, 64, 65, 63, 32, 0, 121, 167, 107,
        32, 2, 107, 34, 3, 65, 0, 78, 4, 64, 32, 0, 32, 1, 32, 3, 172, 134, 133,
        33, 0, 12, 1, 11, 11, 32, 0, 11, 40, 0, 32, 1, 32, 0, 40, 2, 8, 79, 4,
        64, 65, 128, 2, 65, 192, 2, 65, 163, 1, 65, 44, 16, 0, 0, 11, 32, 1, 32,
        0, 40, 2, 4, 106, 65, 0, 58, 0, 0, 11, 38, 0, 32, 1, 32, 0, 40, 2, 8,
        79, 4, 64, 65, 128, 2, 65, 192, 2, 65, 152, 1, 65, 44, 16, 0, 0, 11, 32,
        1, 32, 0, 40, 2, 4, 106, 45, 0, 0, 11, 254, 5, 2, 1, 127, 4, 126, 32, 0,
        69, 4, 64, 65, 232, 0, 65, 6, 16, 10, 34, 0, 65, 172, 3, 75, 4, 64, 32,
        0, 65, 16, 107, 34, 5, 32, 5, 40, 2, 4, 65, 1, 106, 54, 2, 4, 11, 11,
        32, 0, 65, 0, 54, 2, 0, 32, 0, 65, 0, 54, 2, 4, 32, 0, 65, 0, 54, 2, 8,
        32, 0, 66, 0, 55, 3, 16, 32, 0, 66, 0, 55, 3, 24, 32, 0, 66, 0, 55, 3,
        32, 32, 0, 66, 0, 55, 3, 40, 32, 0, 66, 0, 55, 3, 48, 32, 0, 66, 0, 55,
        3, 56, 32, 0, 66, 0, 55, 3, 64, 32, 0, 66, 0, 55, 3, 72, 32, 0, 66, 0,
        55, 3, 80, 32, 0, 66, 0, 55, 3, 88, 32, 0, 66, 0, 55, 3, 96, 32, 0, 32,
        2, 173, 55, 3, 80, 32, 0, 32, 3, 173, 55, 3, 88, 65, 12, 65, 4, 16, 10,
        34, 2, 65, 172, 3, 75, 4, 64, 32, 2, 65, 16, 107, 34, 3, 32, 3, 40, 2,
        4, 65, 1, 106, 54, 2, 4, 11, 32, 2, 32, 4, 65, 0, 16, 14, 33, 2, 32, 0,
        40, 2, 0, 16, 12, 32, 0, 32, 2, 54, 2, 0, 32, 0, 32, 4, 54, 2, 4, 32, 0,
        66, 1, 32, 1, 173, 134, 66, 1, 125, 55, 3, 96, 32, 0, 66, 243, 130, 183,
        218, 216, 230, 232, 30, 55, 3, 72, 35, 4, 69, 4, 64, 65, 0, 33, 2, 3,
        64, 32, 2, 65, 128, 2, 72, 4, 64, 32, 2, 65, 255, 1, 113, 173, 33, 6,
        32, 0, 41, 3, 72, 34, 7, 33, 8, 65, 63, 32, 7, 121, 167, 107, 33, 1, 3,
        64, 65, 63, 32, 6, 121, 167, 107, 32, 1, 107, 34, 3, 65, 0, 78, 4, 64,
        32, 6, 32, 8, 32, 3, 172, 134, 133, 33, 6, 12, 1, 11, 11, 65, 0, 33, 4,
        3, 64, 32, 4, 32, 0, 40, 2, 4, 65, 1, 107, 72, 4, 64, 32, 6, 66, 8, 134,
        33, 6, 32, 0, 41, 3, 72, 34, 7, 33, 8, 65, 63, 32, 7, 121, 167, 107, 33,
        1, 3, 64, 65, 63, 32, 6, 121, 167, 107, 32, 1, 107, 34, 3, 65, 0, 78, 4,
        64, 32, 6, 32, 8, 32, 3, 172, 134, 133, 33, 6, 12, 1, 11, 11, 32, 4, 65,
        1, 106, 33, 4, 12, 1, 11, 11, 35, 6, 40, 2, 4, 32, 2, 65, 3, 116, 106,
        32, 6, 55, 3, 0, 32, 2, 65, 1, 106, 33, 2, 12, 1, 11, 11, 65, 63, 32, 0,
        41, 3, 72, 121, 167, 107, 172, 33, 7, 65, 0, 33, 2, 3, 64, 32, 2, 65,
        128, 2, 72, 4, 64, 35, 5, 33, 1, 32, 2, 172, 32, 7, 134, 34, 8, 33, 6,
        65, 63, 32, 0, 41, 3, 72, 34, 9, 121, 167, 107, 33, 3, 3, 64, 65, 63,
        32, 6, 121, 167, 107, 32, 3, 107, 34, 4, 65, 0, 78, 4, 64, 32, 6, 32, 9,
        32, 4, 172, 134, 133, 33, 6, 12, 1, 11, 11, 32, 1, 40, 2, 4, 32, 2, 65,
        3, 116, 106, 32, 6, 32, 8, 132, 55, 3, 0, 32, 2, 65, 1, 106, 33, 2, 12,
        1, 11, 11, 65, 1, 36, 4, 11, 32, 0, 66, 0, 55, 3, 24, 32, 0, 66, 0, 55,
        3, 32, 65, 0, 33, 2, 3, 64, 32, 2, 32, 0, 40, 2, 4, 72, 4, 64, 32, 0,
        40, 2, 0, 32, 2, 16, 18, 32, 2, 65, 1, 106, 33, 2, 12, 1, 11, 11, 32, 0,
        66, 0, 55, 3, 40, 32, 0, 65, 0, 54, 2, 8, 32, 0, 66, 0, 55, 3, 16, 32,
        0, 66, 0, 55, 3, 40, 32, 0, 40, 2, 0, 32, 0, 40, 2, 8, 16, 19, 33, 1,
        32, 0, 40, 2, 8, 32, 0, 40, 2, 0, 40, 2, 4, 106, 65, 1, 58, 0, 0, 32, 0,
        32, 0, 41, 3, 40, 35, 6, 40, 2, 4, 32, 1, 65, 3, 116, 106, 41, 3, 0,
        133, 55, 3, 40, 32, 0, 32, 0, 40, 2, 8, 65, 1, 106, 32, 0, 40, 2, 4,
        111, 54, 2, 8, 32, 0, 35, 5, 40, 2, 4, 32, 0, 41, 3, 40, 34, 6, 66, 45,
        136, 167, 65, 3, 116, 106, 41, 3, 0, 32, 6, 66, 8, 134, 66, 1, 132, 133,
        55, 3, 40, 32, 0, 11, 38, 1, 1, 127, 32, 0, 40, 2, 0, 34, 0, 65, 172, 3,
        75, 4, 64, 32, 0, 65, 16, 107, 34, 1, 32, 1, 40, 2, 4, 65, 1, 106, 54,
        2, 4, 11, 32, 0, 11, 55, 1, 2, 127, 32, 1, 32, 0, 40, 2, 0, 34, 2, 71,
        4, 64, 32, 1, 65, 172, 3, 75, 4, 64, 32, 1, 65, 16, 107, 34, 3, 32, 3,
        40, 2, 4, 65, 1, 106, 54, 2, 4, 11, 32, 2, 16, 12, 11, 32, 0, 32, 1, 54,
        2, 0, 11, 7, 0, 32, 0, 40, 2, 4, 11, 9, 0, 32, 0, 32, 1, 54, 2, 4, 11,
        7, 0, 32, 0, 40, 2, 8, 11, 9, 0, 32, 0, 32, 1, 54, 2, 8, 11, 7, 0, 32,
        0, 41, 3, 16, 11, 9, 0, 32, 0, 32, 1, 55, 3, 16, 11, 7, 0, 32, 0, 41, 3,
        24, 11, 9, 0, 32, 0, 32, 1, 55, 3, 24, 11, 7, 0, 32, 0, 41, 3, 32, 11,
        9, 0, 32, 0, 32, 1, 55, 3, 32, 11, 7, 0, 32, 0, 41, 3, 40, 11, 9, 0, 32,
        0, 32, 1, 55, 3, 40, 11, 7, 0, 32, 0, 41, 3, 48, 11, 9, 0, 32, 0, 32, 1,
        55, 3, 48, 11, 7, 0, 32, 0, 41, 3, 56, 11, 9, 0, 32, 0, 32, 1, 55, 3,
        56, 11, 7, 0, 32, 0, 41, 3, 64, 11, 9, 0, 32, 0, 32, 1, 55, 3, 64, 11,
        7, 0, 32, 0, 41, 3, 72, 11, 9, 0, 32, 0, 32, 1, 55, 3, 72, 11, 7, 0, 32,
        0, 41, 3, 80, 11, 9, 0, 32, 0, 32, 1, 55, 3, 80, 11, 7, 0, 32, 0, 41, 3,
        88, 11, 9, 0, 32, 0, 32, 1, 55, 3, 88, 11, 7, 0, 32, 0, 41, 3, 96, 11,
        9, 0, 32, 0, 32, 1, 55, 3, 96, 11, 172, 4, 2, 5, 127, 1, 126, 32, 2, 65,
        172, 3, 75, 4, 64, 32, 2, 65, 16, 107, 34, 4, 32, 4, 40, 2, 4, 65, 1,
        106, 54, 2, 4, 11, 32, 2, 33, 4, 65, 0, 33, 2, 32, 1, 40, 2, 8, 33, 5,
        32, 1, 40, 2, 4, 33, 6, 3, 64, 2, 127, 65, 0, 33, 3, 3, 64, 32, 3, 32,
        5, 72, 4, 64, 32, 3, 32, 6, 106, 45, 0, 0, 33, 1, 32, 0, 40, 2, 0, 32,
        0, 40, 2, 8, 16, 19, 33, 7, 32, 0, 40, 2, 8, 32, 0, 40, 2, 0, 40, 2, 4,
        106, 32, 1, 58, 0, 0, 32, 0, 32, 0, 41, 3, 40, 35, 6, 40, 2, 4, 32, 7,
        65, 3, 116, 106, 41, 3, 0, 133, 55, 3, 40, 32, 0, 32, 0, 40, 2, 8, 65,
        1, 106, 32, 0, 40, 2, 4, 111, 54, 2, 8, 32, 0, 35, 5, 40, 2, 4, 32, 0,
        41, 3, 40, 34, 8, 66, 45, 136, 167, 65, 3, 116, 106, 41, 3, 0, 32, 1,
        173, 32, 8, 66, 8, 134, 132, 133, 55, 3, 40, 32, 0, 32, 0, 41, 3, 16,
        66, 1, 124, 55, 3, 16, 32, 0, 32, 0, 41, 3, 24, 66, 1, 124, 55, 3, 24,
        32, 0, 41, 3, 16, 32, 0, 41, 3, 80, 90, 4, 127, 32, 0, 41, 3, 40, 32, 0,
        41, 3, 96, 131, 80, 5, 65, 0, 11, 4, 127, 65, 1, 5, 32, 0, 41, 3, 16,
        32, 0, 41, 3, 88, 90, 11, 4, 64, 32, 0, 32, 0, 41, 3, 32, 55, 3, 48, 32,
        0, 32, 0, 41, 3, 16, 55, 3, 56, 32, 0, 32, 0, 41, 3, 40, 55, 3, 64, 65,
        0, 33, 1, 3, 64, 32, 1, 32, 0, 40, 2, 4, 72, 4, 64, 32, 0, 40, 2, 0, 32,
        1, 16, 18, 32, 1, 65, 1, 106, 33, 1, 12, 1, 11, 11, 32, 0, 66, 0, 55, 3,
        40, 32, 0, 65, 0, 54, 2, 8, 32, 0, 66, 0, 55, 3, 16, 32, 0, 66, 0, 55,
        3, 40, 32, 0, 40, 2, 0, 32, 0, 40, 2, 8, 16, 19, 33, 1, 32, 0, 40, 2, 8,
        32, 0, 40, 2, 0, 40, 2, 4, 106, 65, 1, 58, 0, 0, 32, 0, 32, 0, 41, 3,
        40, 35, 6, 40, 2, 4, 32, 1, 65, 3, 116, 106, 41, 3, 0, 133, 55, 3, 40,
        32, 0, 32, 0, 40, 2, 8, 65, 1, 106, 32, 0, 40, 2, 4, 111, 54, 2, 8, 32,
        0, 35, 5, 40, 2, 4, 32, 0, 41, 3, 40, 34, 8, 66, 45, 136, 167, 65, 3,
        116, 106, 41, 3, 0, 32, 8, 66, 8, 134, 66, 1, 132, 133, 55, 3, 40, 32,
        3, 65, 1, 106, 12, 3, 11, 32, 3, 65, 1, 106, 33, 3, 12, 1, 11, 11, 65,
        127, 11, 34, 1, 65, 0, 78, 4, 64, 32, 5, 32, 1, 107, 33, 5, 32, 1, 32,
        6, 106, 33, 6, 32, 2, 34, 1, 65, 1, 106, 33, 2, 32, 4, 40, 2, 4, 32, 1,
        65, 2, 116, 106, 32, 0, 41, 3, 56, 62, 2, 0, 12, 1, 11, 11, 32, 4, 11,
        10, 0, 16, 15, 36, 5, 16, 15, 36, 6, 11, 3, 0, 1, 11, 73, 1, 2, 127, 32,
        0, 40, 2, 4, 34, 1, 65, 255, 255, 255, 255, 0, 113, 34, 2, 65, 1, 70, 4,
        64, 32, 0, 65, 16, 106, 16, 53, 32, 0, 32, 0, 40, 2, 0, 65, 1, 114, 54,
        2, 0, 35, 0, 32, 0, 16, 2, 5, 32, 0, 32, 2, 65, 1, 107, 32, 1, 65, 128,
        128, 128, 128, 127, 113, 114, 54, 2, 4, 11, 11, 58, 0, 2, 64, 2, 64, 2,
        64, 32, 0, 65, 8, 107, 40, 2, 0, 14, 7, 0, 0, 1, 1, 1, 1, 1, 2, 11, 15,
        11, 32, 0, 40, 2, 0, 34, 0, 4, 64, 32, 0, 65, 172, 3, 79, 4, 64, 32, 0,
        65, 16, 107, 16, 52, 11, 11, 15, 11, 0, 11, 11, 137, 3, 7, 0, 65, 16,
        11, 55, 40, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 40, 0, 0, 0, 97, 0, 108, 0,
        108, 0, 111, 0, 99, 0, 97, 0, 116, 0, 105, 0, 111, 0, 110, 0, 32, 0,
        116, 0, 111, 0, 111, 0, 32, 0, 108, 0, 97, 0, 114, 0, 103, 0, 101, 0,
        65, 208, 0, 11, 45, 30, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 30, 0, 0, 0,
        126, 0, 108, 0, 105, 0, 98, 0, 47, 0, 114, 0, 116, 0, 47, 0, 116, 0,
        108, 0, 115, 0, 102, 0, 46, 0, 116, 0, 115, 0, 65, 128, 1, 11, 43, 28,
        0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 28, 0, 0, 0, 73, 0, 110, 0, 118, 0, 97,
        0, 108, 0, 105, 0, 100, 0, 32, 0, 108, 0, 101, 0, 110, 0, 103, 0, 116,
        0, 104, 0, 65, 176, 1, 11, 53, 38, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 38,
        0, 0, 0, 126, 0, 108, 0, 105, 0, 98, 0, 47, 0, 97, 0, 114, 0, 114, 0,
        97, 0, 121, 0, 98, 0, 117, 0, 102, 0, 102, 0, 101, 0, 114, 0, 46, 0,
        116, 0, 115, 0, 65, 240, 1, 11, 51, 36, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0,
        36, 0, 0, 0, 73, 0, 110, 0, 100, 0, 101, 0, 120, 0, 32, 0, 111, 0, 117,
        0, 116, 0, 32, 0, 111, 0, 102, 0, 32, 0, 114, 0, 97, 0, 110, 0, 103, 0,
        101, 0, 65, 176, 2, 11, 51, 36, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 36, 0,
        0, 0, 126, 0, 108, 0, 105, 0, 98, 0, 47, 0, 116, 0, 121, 0, 112, 0, 101,
        0, 100, 0, 97, 0, 114, 0, 114, 0, 97, 0, 121, 0, 46, 0, 116, 0, 115, 0,
        65, 240, 2, 11, 53, 7, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0,
        0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 0, 145, 4, 0, 0, 2, 0, 0, 0, 49, 0, 0, 0,
        2, 0, 0, 0, 17, 1, 0, 0, 2, 0, 0, 0, 16, 0, 34, 16, 115, 111, 117, 114,
        99, 101, 77, 97, 112, 112, 105, 110, 103, 85, 82, 76, 16, 46, 47, 114,
        97, 98, 105, 110, 46, 119, 97, 115, 109, 46, 109, 97, 112,
      ])
      return instantiate(
        new Response(new Blob([wasm], { type: 'application/wasm' })),
        imp
      )
    }
    module2.exports = loadWebAssembly
  },
})

// node_modules/rabin-wasm/src/index.js
var require_src = __commonJS({
  'node_modules/rabin-wasm/src/index.js'(exports2, module2) {
    var Rabin = require_rabin()
    var getRabin = require_rabin_wasm()
    var create4 = async (avg, min, max, windowSize, polynomial) => {
      const compiled = await getRabin()
      return new Rabin(compiled, avg, min, max, windowSize, polynomial)
    }
    module2.exports = {
      Rabin,
      create: create4,
    }
  },
})

// node_modules/multiformats/esm/src/bases/identity.js
var identity_exports = {}
__export(identity_exports, {
  identity: () => identity,
})
var identity
var init_identity = __esm({
  'node_modules/multiformats/esm/src/bases/identity.js'() {
    init_base()
    init_bytes()
    identity = from({
      prefix: '\0',
      name: 'identity',
      encode: (buf2) => toString(buf2),
      decode: (str) => fromString(str),
    })
  },
})

// node_modules/multiformats/esm/src/bases/base2.js
var base2_exports = {}
__export(base2_exports, {
  base2: () => base2,
})
var base2
var init_base2 = __esm({
  'node_modules/multiformats/esm/src/bases/base2.js'() {
    init_base()
    base2 = rfc4648({
      prefix: '0',
      name: 'base2',
      alphabet: '01',
      bitsPerChar: 1,
    })
  },
})

// node_modules/multiformats/esm/src/bases/base8.js
var base8_exports = {}
__export(base8_exports, {
  base8: () => base8,
})
var base8
var init_base8 = __esm({
  'node_modules/multiformats/esm/src/bases/base8.js'() {
    init_base()
    base8 = rfc4648({
      prefix: '7',
      name: 'base8',
      alphabet: '01234567',
      bitsPerChar: 3,
    })
  },
})

// node_modules/multiformats/esm/src/bases/base10.js
var base10_exports = {}
__export(base10_exports, {
  base10: () => base10,
})
var base10
var init_base10 = __esm({
  'node_modules/multiformats/esm/src/bases/base10.js'() {
    init_base()
    base10 = baseX({
      prefix: '9',
      name: 'base10',
      alphabet: '0123456789',
    })
  },
})

// node_modules/multiformats/esm/src/bases/base16.js
var base16_exports = {}
__export(base16_exports, {
  base16: () => base16,
  base16upper: () => base16upper,
})
var base16, base16upper
var init_base16 = __esm({
  'node_modules/multiformats/esm/src/bases/base16.js'() {
    init_base()
    base16 = rfc4648({
      prefix: 'f',
      name: 'base16',
      alphabet: '0123456789abcdef',
      bitsPerChar: 4,
    })
    base16upper = rfc4648({
      prefix: 'F',
      name: 'base16upper',
      alphabet: '0123456789ABCDEF',
      bitsPerChar: 4,
    })
  },
})

// node_modules/multiformats/esm/src/bases/base36.js
var base36_exports = {}
__export(base36_exports, {
  base36: () => base36,
  base36upper: () => base36upper,
})
var base36, base36upper
var init_base36 = __esm({
  'node_modules/multiformats/esm/src/bases/base36.js'() {
    init_base()
    base36 = baseX({
      prefix: 'k',
      name: 'base36',
      alphabet: '0123456789abcdefghijklmnopqrstuvwxyz',
    })
    base36upper = baseX({
      prefix: 'K',
      name: 'base36upper',
      alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    })
  },
})

// node_modules/multiformats/esm/src/bases/base64.js
var base64_exports = {}
__export(base64_exports, {
  base64: () => base64,
  base64pad: () => base64pad,
  base64url: () => base64url,
  base64urlpad: () => base64urlpad,
})
var base64, base64pad, base64url, base64urlpad
var init_base64 = __esm({
  'node_modules/multiformats/esm/src/bases/base64.js'() {
    init_base()
    base64 = rfc4648({
      prefix: 'm',
      name: 'base64',
      alphabet:
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
      bitsPerChar: 6,
    })
    base64pad = rfc4648({
      prefix: 'M',
      name: 'base64pad',
      alphabet:
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
      bitsPerChar: 6,
    })
    base64url = rfc4648({
      prefix: 'u',
      name: 'base64url',
      alphabet:
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
      bitsPerChar: 6,
    })
    base64urlpad = rfc4648({
      prefix: 'U',
      name: 'base64urlpad',
      alphabet:
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=',
      bitsPerChar: 6,
    })
  },
})

// node_modules/multiformats/esm/src/hashes/identity.js
var identity_exports2 = {}
__export(identity_exports2, {
  identity: () => identity2,
})
var code4, name4, encode10, digest, identity2
var init_identity2 = __esm({
  'node_modules/multiformats/esm/src/hashes/identity.js'() {
    init_bytes()
    init_digest()
    code4 = 0
    name4 = 'identity'
    encode10 = coerce
    digest = (input) => create(code4, encode10(input))
    identity2 = {
      code: code4,
      name: name4,
      encode: encode10,
      digest,
    }
  },
})

// node_modules/multiformats/esm/src/codecs/json.js
var textEncoder4, textDecoder3
var init_json = __esm({
  'node_modules/multiformats/esm/src/codecs/json.js'() {
    textEncoder4 = new TextEncoder()
    textDecoder3 = new TextDecoder()
  },
})

// node_modules/multiformats/esm/src/basics.js
var bases, hashes
var init_basics = __esm({
  'node_modules/multiformats/esm/src/basics.js'() {
    init_identity()
    init_base2()
    init_base8()
    init_base10()
    init_base16()
    init_base32()
    init_base36()
    init_base58()
    init_base64()
    init_sha2_browser()
    init_identity2()
    init_raw()
    init_json()
    init_src()
    bases = {
      ...identity_exports,
      ...base2_exports,
      ...base8_exports,
      ...base10_exports,
      ...base16_exports,
      ...base32_exports,
      ...base36_exports,
      ...base58_exports,
      ...base64_exports,
    }
    hashes = {
      ...sha2_browser_exports,
      ...identity_exports2,
    }
  },
})

// node_modules/uint8arrays/esm/src/util/bases.js
function createCodec(name6, prefix, encode12, decode11) {
  return {
    name: name6,
    prefix,
    encoder: {
      name: name6,
      prefix,
      encode: encode12,
    },
    decoder: { decode: decode11 },
  }
}
var string2, ascii, BASES, bases_default
var init_bases = __esm({
  'node_modules/uint8arrays/esm/src/util/bases.js'() {
    init_basics()
    string2 = createCodec(
      'utf8',
      'u',
      (buf2) => {
        const decoder = new TextDecoder('utf8')
        return 'u' + decoder.decode(buf2)
      },
      (str) => {
        const encoder = new TextEncoder()
        return encoder.encode(str.substring(1))
      }
    )
    ascii = createCodec(
      'ascii',
      'a',
      (buf2) => {
        let string3 = 'a'
        for (let i = 0; i < buf2.length; i++) {
          string3 += String.fromCharCode(buf2[i])
        }
        return string3
      },
      (str) => {
        str = str.substring(1)
        const buf2 = new Uint8Array(str.length)
        for (let i = 0; i < str.length; i++) {
          buf2[i] = str.charCodeAt(i)
        }
        return buf2
      }
    )
    BASES = {
      utf8: string2,
      'utf-8': string2,
      hex: bases.base16,
      latin1: ascii,
      ascii,
      binary: ascii,
      ...bases,
    }
    bases_default = BASES
  },
})

// node_modules/uint8arrays/esm/src/from-string.js
var from_string_exports = {}
__export(from_string_exports, {
  fromString: () => fromString3,
})
function fromString3(string3, encoding = 'utf8') {
  const base3 = bases_default[encoding]
  if (!base3) {
    throw new Error(`Unsupported encoding "${encoding}"`)
  }
  return base3.decoder.decode(`${base3.prefix}${string3}`)
}
var init_from_string = __esm({
  'node_modules/uint8arrays/esm/src/from-string.js'() {
    init_bases()
  },
})

// node_modules/sparse-array/index.js
var require_sparse_array = __commonJS({
  'node_modules/sparse-array/index.js'(exports2, module2) {
    'use strict'
    var BITS_PER_BYTE = 7
    module2.exports = class SparseArray {
      constructor() {
        this._bitArrays = []
        this._data = []
        this._length = 0
        this._changedLength = false
        this._changedData = false
      }
      set(index, value) {
        let pos = this._internalPositionFor(index, false)
        if (value === void 0) {
          if (pos !== -1) {
            this._unsetInternalPos(pos)
            this._unsetBit(index)
            this._changedLength = true
            this._changedData = true
          }
        } else {
          let needsSort = false
          if (pos === -1) {
            pos = this._data.length
            this._setBit(index)
            this._changedData = true
          } else {
            needsSort = true
          }
          this._setInternalPos(pos, index, value, needsSort)
          this._changedLength = true
        }
      }
      unset(index) {
        this.set(index, void 0)
      }
      get(index) {
        this._sortData()
        const pos = this._internalPositionFor(index, true)
        if (pos === -1) {
          return void 0
        }
        return this._data[pos][1]
      }
      push(value) {
        this.set(this.length, value)
        return this.length
      }
      get length() {
        this._sortData()
        if (this._changedLength) {
          const last2 = this._data[this._data.length - 1]
          this._length = last2 ? last2[0] + 1 : 0
          this._changedLength = false
        }
        return this._length
      }
      forEach(iterator) {
        let i = 0
        while (i < this.length) {
          iterator(this.get(i), i, this)
          i++
        }
      }
      map(iterator) {
        let i = 0
        let mapped = new Array(this.length)
        while (i < this.length) {
          mapped[i] = iterator(this.get(i), i, this)
          i++
        }
        return mapped
      }
      reduce(reducer, initialValue) {
        let i = 0
        let acc = initialValue
        while (i < this.length) {
          const value = this.get(i)
          acc = reducer(acc, value, i)
          i++
        }
        return acc
      }
      find(finder) {
        let i = 0,
          found,
          last2
        while (i < this.length && !found) {
          last2 = this.get(i)
          found = finder(last2)
          i++
        }
        return found ? last2 : void 0
      }
      _internalPositionFor(index, noCreate) {
        const bytePos = this._bytePosFor(index, noCreate)
        if (bytePos >= this._bitArrays.length) {
          return -1
        }
        const byte = this._bitArrays[bytePos]
        const bitPos = index - bytePos * BITS_PER_BYTE
        const exists = (byte & (1 << bitPos)) > 0
        if (!exists) {
          return -1
        }
        const previousPopCount = this._bitArrays
          .slice(0, bytePos)
          .reduce(popCountReduce, 0)
        const mask = ~(4294967295 << (bitPos + 1))
        const bytePopCount = popCount(byte & mask)
        const arrayPos = previousPopCount + bytePopCount - 1
        return arrayPos
      }
      _bytePosFor(index, noCreate) {
        const bytePos = Math.floor(index / BITS_PER_BYTE)
        const targetLength = bytePos + 1
        while (!noCreate && this._bitArrays.length < targetLength) {
          this._bitArrays.push(0)
        }
        return bytePos
      }
      _setBit(index) {
        const bytePos = this._bytePosFor(index, false)
        this._bitArrays[bytePos] |= 1 << (index - bytePos * BITS_PER_BYTE)
      }
      _unsetBit(index) {
        const bytePos = this._bytePosFor(index, false)
        this._bitArrays[bytePos] &= ~(1 << (index - bytePos * BITS_PER_BYTE))
      }
      _setInternalPos(pos, index, value, needsSort) {
        const data = this._data
        const elem = [index, value]
        if (needsSort) {
          this._sortData()
          data[pos] = elem
        } else {
          if (data.length) {
            if (data[data.length - 1][0] >= index) {
              data.push(elem)
            } else if (data[0][0] <= index) {
              data.unshift(elem)
            } else {
              const randomIndex = Math.round(data.length / 2)
              this._data = data
                .slice(0, randomIndex)
                .concat(elem)
                .concat(data.slice(randomIndex))
            }
          } else {
            this._data.push(elem)
          }
          this._changedData = true
          this._changedLength = true
        }
      }
      _unsetInternalPos(pos) {
        this._data.splice(pos, 1)
      }
      _sortData() {
        if (this._changedData) {
          this._data.sort(sortInternal)
        }
        this._changedData = false
      }
      bitField() {
        const bytes2 = []
        let pendingBitsForResultingByte = 8
        let pendingBitsForNewByte = 0
        let resultingByte = 0
        let newByte
        const pending = this._bitArrays.slice()
        while (pending.length || pendingBitsForNewByte) {
          if (pendingBitsForNewByte === 0) {
            newByte = pending.shift()
            pendingBitsForNewByte = 7
          }
          const usingBits = Math.min(
            pendingBitsForNewByte,
            pendingBitsForResultingByte
          )
          const mask = ~(255 << usingBits)
          const masked = newByte & mask
          resultingByte |= masked << (8 - pendingBitsForResultingByte)
          newByte = newByte >>> usingBits
          pendingBitsForNewByte -= usingBits
          pendingBitsForResultingByte -= usingBits
          if (
            !pendingBitsForResultingByte ||
            (!pendingBitsForNewByte && !pending.length)
          ) {
            bytes2.push(resultingByte)
            resultingByte = 0
            pendingBitsForResultingByte = 8
          }
        }
        for (var i = bytes2.length - 1; i > 0; i--) {
          const value = bytes2[i]
          if (value === 0) {
            bytes2.pop()
          } else {
            break
          }
        }
        return bytes2
      }
      compactArray() {
        this._sortData()
        return this._data.map(valueOnly)
      }
    }
    function popCountReduce(count, byte) {
      return count + popCount(byte)
    }
    function popCount(_v) {
      let v = _v
      v = v - ((v >> 1) & 1431655765)
      v = (v & 858993459) + ((v >> 2) & 858993459)
      return (((v + (v >> 4)) & 252645135) * 16843009) >> 24
    }
    function sortInternal(a, b) {
      return a[0] - b[0]
    }
    function valueOnly(elem) {
      return elem[1]
    }
  },
})

// node_modules/hamt-sharding/src/bucket.js
var require_bucket = __commonJS({
  'node_modules/hamt-sharding/src/bucket.js'(exports2, module2) {
    'use strict'
    var SparseArray = require_sparse_array()
    var { fromString: uint8ArrayFromString } =
      (init_from_string(), from_string_exports)
    var Bucket2 = class {
      constructor(options, parent, posAtParent = 0) {
        this._options = options
        this._popCount = 0
        this._parent = parent
        this._posAtParent = posAtParent
        this._children = new SparseArray()
        this.key = null
      }
      async put(key, value) {
        const place = await this._findNewBucketAndPos(key)
        await place.bucket._putAt(place, key, value)
      }
      async get(key) {
        const child = await this._findChild(key)
        if (child) {
          return child.value
        }
      }
      async del(key) {
        const place = await this._findPlace(key)
        const child = place.bucket._at(place.pos)
        if (child && child.key === key) {
          place.bucket._delAt(place.pos)
        }
      }
      leafCount() {
        const children = this._children.compactArray()
        return children.reduce((acc, child) => {
          if (child instanceof Bucket2) {
            return acc + child.leafCount()
          }
          return acc + 1
        }, 0)
      }
      childrenCount() {
        return this._children.length
      }
      onlyChild() {
        return this._children.get(0)
      }
      *eachLeafSeries() {
        const children = this._children.compactArray()
        for (const child of children) {
          if (child instanceof Bucket2) {
            yield* child.eachLeafSeries()
          } else {
            yield child
          }
        }
        return []
      }
      serialize(map4, reduce2) {
        const acc = []
        return reduce2(
          this._children.reduce((acc2, child, index) => {
            if (child) {
              if (child instanceof Bucket2) {
                acc2.push(child.serialize(map4, reduce2))
              } else {
                acc2.push(map4(child, index))
              }
            }
            return acc2
          }, acc)
        )
      }
      asyncTransform(asyncMap, asyncReduce) {
        return asyncTransformBucket(this, asyncMap, asyncReduce)
      }
      toJSON() {
        return this.serialize(mapNode, reduceNodes)
      }
      prettyPrint() {
        return JSON.stringify(this.toJSON(), null, '  ')
      }
      tableSize() {
        return Math.pow(2, this._options.bits)
      }
      async _findChild(key) {
        const result = await this._findPlace(key)
        const child = result.bucket._at(result.pos)
        if (child instanceof Bucket2) {
          return void 0
        }
        if (child && child.key === key) {
          return child
        }
      }
      async _findPlace(key) {
        const hashValue = this._options.hash(
          typeof key === 'string' ? uint8ArrayFromString(key) : key
        )
        const index = await hashValue.take(this._options.bits)
        const child = this._children.get(index)
        if (child instanceof Bucket2) {
          return child._findPlace(hashValue)
        }
        return {
          bucket: this,
          pos: index,
          hash: hashValue,
          existingChild: child,
        }
      }
      async _findNewBucketAndPos(key) {
        const place = await this._findPlace(key)
        if (place.existingChild && place.existingChild.key !== key) {
          const bucket = new Bucket2(this._options, place.bucket, place.pos)
          place.bucket._putObjectAt(place.pos, bucket)
          const newPlace = await bucket._findPlace(place.existingChild.hash)
          newPlace.bucket._putAt(
            newPlace,
            place.existingChild.key,
            place.existingChild.value
          )
          return bucket._findNewBucketAndPos(place.hash)
        }
        return place
      }
      _putAt(place, key, value) {
        this._putObjectAt(place.pos, {
          key,
          value,
          hash: place.hash,
        })
      }
      _putObjectAt(pos, object) {
        if (!this._children.get(pos)) {
          this._popCount++
        }
        this._children.set(pos, object)
      }
      _delAt(pos) {
        if (pos === -1) {
          throw new Error('Invalid position')
        }
        if (this._children.get(pos)) {
          this._popCount--
        }
        this._children.unset(pos)
        this._level()
      }
      _level() {
        if (this._parent && this._popCount <= 1) {
          if (this._popCount === 1) {
            const onlyChild = this._children.find(exists)
            if (onlyChild && !(onlyChild instanceof Bucket2)) {
              const hash = onlyChild.hash
              hash.untake(this._options.bits)
              const place = {
                pos: this._posAtParent,
                hash,
                bucket: this._parent,
              }
              this._parent._putAt(place, onlyChild.key, onlyChild.value)
            }
          } else {
            this._parent._delAt(this._posAtParent)
          }
        }
      }
      _at(index) {
        return this._children.get(index)
      }
    }
    function exists(o) {
      return Boolean(o)
    }
    function mapNode(node, index) {
      return node.key
    }
    function reduceNodes(nodes) {
      return nodes
    }
    async function asyncTransformBucket(bucket, asyncMap, asyncReduce) {
      const output = []
      for (const child of bucket._children.compactArray()) {
        if (child instanceof Bucket2) {
          await asyncTransformBucket(child, asyncMap, asyncReduce)
        } else {
          const mappedChildren = await asyncMap(child)
          output.push({
            bitField: bucket._children.bitField(),
            children: mappedChildren,
          })
        }
      }
      return asyncReduce(output)
    }
    module2.exports = Bucket2
  },
})

// node_modules/hamt-sharding/src/consumable-buffer.js
var require_consumable_buffer = __commonJS({
  'node_modules/hamt-sharding/src/consumable-buffer.js'(exports2, module2) {
    'use strict'
    var START_MASKS = [255, 254, 252, 248, 240, 224, 192, 128]
    var STOP_MASKS = [1, 3, 7, 15, 31, 63, 127, 255]
    module2.exports = class ConsumableBuffer {
      constructor(value) {
        this._value = value
        this._currentBytePos = value.length - 1
        this._currentBitPos = 7
      }
      availableBits() {
        return this._currentBitPos + 1 + this._currentBytePos * 8
      }
      totalBits() {
        return this._value.length * 8
      }
      take(bits) {
        let pendingBits = bits
        let result = 0
        while (pendingBits && this._haveBits()) {
          const byte = this._value[this._currentBytePos]
          const availableBits = this._currentBitPos + 1
          const taking = Math.min(availableBits, pendingBits)
          const value = byteBitsToInt(byte, availableBits - taking, taking)
          result = (result << taking) + value
          pendingBits -= taking
          this._currentBitPos -= taking
          if (this._currentBitPos < 0) {
            this._currentBitPos = 7
            this._currentBytePos--
          }
        }
        return result
      }
      untake(bits) {
        this._currentBitPos += bits
        while (this._currentBitPos > 7) {
          this._currentBitPos -= 8
          this._currentBytePos += 1
        }
      }
      _haveBits() {
        return this._currentBytePos >= 0
      }
    }
    function byteBitsToInt(byte, start, length2) {
      const mask = maskFor(start, length2)
      return (byte & mask) >>> start
    }
    function maskFor(start, length2) {
      return START_MASKS[start] & STOP_MASKS[Math.min(length2 + start - 1, 7)]
    }
  },
})

// node_modules/uint8arrays/esm/src/concat.js
var concat_exports = {}
__export(concat_exports, {
  concat: () => concat2,
})
function concat2(arrays, length2) {
  if (!length2) {
    length2 = arrays.reduce((acc, curr) => acc + curr.length, 0)
  }
  const output = new Uint8Array(length2)
  let offset = 0
  for (const arr of arrays) {
    output.set(arr, offset)
    offset += arr.length
  }
  return output
}
var init_concat = __esm({
  'node_modules/uint8arrays/esm/src/concat.js'() {},
})

// node_modules/hamt-sharding/src/consumable-hash.js
var require_consumable_hash = __commonJS({
  'node_modules/hamt-sharding/src/consumable-hash.js'(exports2, module2) {
    'use strict'
    var ConsumableBuffer = require_consumable_buffer()
    var { concat: uint8ArrayConcat } = (init_concat(), concat_exports)
    function wrapHash(hashFn) {
      function hashing(value) {
        if (value instanceof InfiniteHash) {
          return value
        } else {
          return new InfiniteHash(value, hashFn)
        }
      }
      return hashing
    }
    var InfiniteHash = class {
      constructor(value, hashFn) {
        if (!(value instanceof Uint8Array)) {
          throw new Error('can only hash Uint8Arrays')
        }
        this._value = value
        this._hashFn = hashFn
        this._depth = -1
        this._availableBits = 0
        this._currentBufferIndex = 0
        this._buffers = []
      }
      async take(bits) {
        let pendingBits = bits
        while (this._availableBits < pendingBits) {
          await this._produceMoreBits()
        }
        let result = 0
        while (pendingBits > 0) {
          const hash = this._buffers[this._currentBufferIndex]
          const available = Math.min(hash.availableBits(), pendingBits)
          const took = hash.take(available)
          result = (result << available) + took
          pendingBits -= available
          this._availableBits -= available
          if (hash.availableBits() === 0) {
            this._currentBufferIndex++
          }
        }
        return result
      }
      untake(bits) {
        let pendingBits = bits
        while (pendingBits > 0) {
          const hash = this._buffers[this._currentBufferIndex]
          const availableForUntake = Math.min(
            hash.totalBits() - hash.availableBits(),
            pendingBits
          )
          hash.untake(availableForUntake)
          pendingBits -= availableForUntake
          this._availableBits += availableForUntake
          if (
            this._currentBufferIndex > 0 &&
            hash.totalBits() === hash.availableBits()
          ) {
            this._depth--
            this._currentBufferIndex--
          }
        }
      }
      async _produceMoreBits() {
        this._depth++
        const value = this._depth
          ? uint8ArrayConcat([this._value, Uint8Array.from([this._depth])])
          : this._value
        const hashValue = await this._hashFn(value)
        const buffer2 = new ConsumableBuffer(hashValue)
        this._buffers.push(buffer2)
        this._availableBits += buffer2.availableBits()
      }
    }
    module2.exports = wrapHash
    module2.exports.InfiniteHash = InfiniteHash
  },
})

// node_modules/hamt-sharding/src/index.js
var require_src2 = __commonJS({
  'node_modules/hamt-sharding/src/index.js'(exports2, module2) {
    'use strict'
    var Bucket2 = require_bucket()
    var wrapHash = require_consumable_hash()
    function createHAMT2(options) {
      if (!options || !options.hashFn) {
        throw new Error('please define an options.hashFn')
      }
      const bucketOptions = {
        bits: options.bits || 8,
        hash: wrapHash(options.hashFn),
      }
      return new Bucket2(bucketOptions)
    }
    module2.exports = {
      createHAMT: createHAMT2,
      Bucket: Bucket2,
    }
  },
})

// node_modules/browser-readablestream-to-it/index.js
var require_browser_readablestream_to_it = __commonJS({
  'node_modules/browser-readablestream-to-it/index.js'(exports2, module2) {
    'use strict'
    async function* browserReadableStreamToIt(stream, options = {}) {
      const reader = stream.getReader()
      try {
        while (true) {
          const result = await reader.read()
          if (result.done) {
            return
          }
          yield result.value
        }
      } finally {
        if (options.preventCancel !== true) {
          reader.cancel()
        }
        reader.releaseLock()
      }
    }
    module2.exports = browserReadableStreamToIt
  },
})

// node_modules/blob-to-it/index.js
var require_blob_to_it = __commonJS({
  'node_modules/blob-to-it/index.js'(exports2, module2) {
    'use strict'
    var browserReadableStreamToIt = require_browser_readablestream_to_it()
    function blobToIt2(blob2) {
      if (typeof blob2.stream === 'function') {
        return browserReadableStreamToIt(blob2.stream())
      }
      return browserReadableStreamToIt(new Response(blob2).body)
    }
    module2.exports = blobToIt2
  },
})

// node_modules/it-peekable/index.js
var require_it_peekable = __commonJS({
  'node_modules/it-peekable/index.js'(exports2, module2) {
    'use strict'
    function peekableIterator(iterable) {
      const [iterator, symbol] = iterable[Symbol.asyncIterator]
        ? [iterable[Symbol.asyncIterator](), Symbol.asyncIterator]
        : [iterable[Symbol.iterator](), Symbol.iterator]
      const queue = []
      return {
        peek: () => {
          return iterator.next()
        },
        push: (value) => {
          queue.push(value)
        },
        next: () => {
          if (queue.length) {
            return {
              done: false,
              value: queue.shift(),
            }
          }
          return iterator.next()
        },
        [symbol]() {
          return this
        },
      }
    }
    module2.exports = peekableIterator
  },
})

// node_modules/it-map/index.js
var require_it_map = __commonJS({
  'node_modules/it-map/index.js'(exports2, module2) {
    'use strict'
    var map4 = async function* (source, func) {
      for await (const val of source) {
        yield func(val)
      }
    }
    module2.exports = map4
  },
})

// node_modules/it-drain/index.js
var require_it_drain = __commonJS({
  'node_modules/it-drain/index.js'(exports2, module2) {
    'use strict'
    var drain2 = async (source) => {
      for await (const _ of source) {
      }
    }
    module2.exports = drain2
  },
})

// node_modules/it-filter/index.js
var require_it_filter = __commonJS({
  'node_modules/it-filter/index.js'(exports2, module2) {
    'use strict'
    var filter2 = async function* (source, fn) {
      for await (const entry of source) {
        if (await fn(entry)) {
          yield entry
        }
      }
    }
    module2.exports = filter2
  },
})

// node_modules/it-take/index.js
var require_it_take = __commonJS({
  'node_modules/it-take/index.js'(exports2, module2) {
    'use strict'
    var take2 = async function* (source, limit) {
      let items = 0
      if (limit < 1) {
        return
      }
      for await (const entry of source) {
        yield entry
        items++
        if (items === limit) {
          return
        }
      }
    }
    module2.exports = take2
  },
})

// node_modules/path-browserify/index.js
var require_path_browserify = __commonJS({
  'node_modules/path-browserify/index.js'(exports2, module2) {
    'use strict'
    function assertPath(path) {
      if (typeof path !== 'string') {
        throw new TypeError(
          'Path must be a string. Received ' + JSON.stringify(path)
        )
      }
    }
    function normalizeStringPosix(path, allowAboveRoot) {
      var res = ''
      var lastSegmentLength = 0
      var lastSlash = -1
      var dots = 0
      var code6
      for (var i = 0; i <= path.length; ++i) {
        if (i < path.length) code6 = path.charCodeAt(i)
        else if (code6 === 47) break
        else code6 = 47
        if (code6 === 47) {
          if (lastSlash === i - 1 || dots === 1) {
          } else if (lastSlash !== i - 1 && dots === 2) {
            if (
              res.length < 2 ||
              lastSegmentLength !== 2 ||
              res.charCodeAt(res.length - 1) !== 46 ||
              res.charCodeAt(res.length - 2) !== 46
            ) {
              if (res.length > 2) {
                var lastSlashIndex = res.lastIndexOf('/')
                if (lastSlashIndex !== res.length - 1) {
                  if (lastSlashIndex === -1) {
                    res = ''
                    lastSegmentLength = 0
                  } else {
                    res = res.slice(0, lastSlashIndex)
                    lastSegmentLength = res.length - 1 - res.lastIndexOf('/')
                  }
                  lastSlash = i
                  dots = 0
                  continue
                }
              } else if (res.length === 2 || res.length === 1) {
                res = ''
                lastSegmentLength = 0
                lastSlash = i
                dots = 0
                continue
              }
            }
            if (allowAboveRoot) {
              if (res.length > 0) res += '/..'
              else res = '..'
              lastSegmentLength = 2
            }
          } else {
            if (res.length > 0) res += '/' + path.slice(lastSlash + 1, i)
            else res = path.slice(lastSlash + 1, i)
            lastSegmentLength = i - lastSlash - 1
          }
          lastSlash = i
          dots = 0
        } else if (code6 === 46 && dots !== -1) {
          ++dots
        } else {
          dots = -1
        }
      }
      return res
    }
    function _format(sep, pathObject) {
      var dir = pathObject.dir || pathObject.root
      var base3 =
        pathObject.base || (pathObject.name || '') + (pathObject.ext || '')
      if (!dir) {
        return base3
      }
      if (dir === pathObject.root) {
        return dir + base3
      }
      return dir + sep + base3
    }
    var posix = {
      resolve: function resolve() {
        var resolvedPath = ''
        var resolvedAbsolute = false
        var cwd
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path
          if (i >= 0) path = arguments[i]
          else {
            if (cwd === void 0) cwd = process.cwd()
            path = cwd
          }
          assertPath(path)
          if (path.length === 0) {
            continue
          }
          resolvedPath = path + '/' + resolvedPath
          resolvedAbsolute = path.charCodeAt(0) === 47
        }
        resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute)
        if (resolvedAbsolute) {
          if (resolvedPath.length > 0) return '/' + resolvedPath
          else return '/'
        } else if (resolvedPath.length > 0) {
          return resolvedPath
        } else {
          return '.'
        }
      },
      normalize: function normalize(path) {
        assertPath(path)
        if (path.length === 0) return '.'
        var isAbsolute = path.charCodeAt(0) === 47
        var trailingSeparator = path.charCodeAt(path.length - 1) === 47
        path = normalizeStringPosix(path, !isAbsolute)
        if (path.length === 0 && !isAbsolute) path = '.'
        if (path.length > 0 && trailingSeparator) path += '/'
        if (isAbsolute) return '/' + path
        return path
      },
      isAbsolute: function isAbsolute(path) {
        assertPath(path)
        return path.length > 0 && path.charCodeAt(0) === 47
      },
      join: function join() {
        if (arguments.length === 0) return '.'
        var joined
        for (var i = 0; i < arguments.length; ++i) {
          var arg = arguments[i]
          assertPath(arg)
          if (arg.length > 0) {
            if (joined === void 0) joined = arg
            else joined += '/' + arg
          }
        }
        if (joined === void 0) return '.'
        return posix.normalize(joined)
      },
      relative: function relative(from3, to) {
        assertPath(from3)
        assertPath(to)
        if (from3 === to) return ''
        from3 = posix.resolve(from3)
        to = posix.resolve(to)
        if (from3 === to) return ''
        var fromStart = 1
        for (; fromStart < from3.length; ++fromStart) {
          if (from3.charCodeAt(fromStart) !== 47) break
        }
        var fromEnd = from3.length
        var fromLen = fromEnd - fromStart
        var toStart = 1
        for (; toStart < to.length; ++toStart) {
          if (to.charCodeAt(toStart) !== 47) break
        }
        var toEnd = to.length
        var toLen = toEnd - toStart
        var length2 = fromLen < toLen ? fromLen : toLen
        var lastCommonSep = -1
        var i = 0
        for (; i <= length2; ++i) {
          if (i === length2) {
            if (toLen > length2) {
              if (to.charCodeAt(toStart + i) === 47) {
                return to.slice(toStart + i + 1)
              } else if (i === 0) {
                return to.slice(toStart + i)
              }
            } else if (fromLen > length2) {
              if (from3.charCodeAt(fromStart + i) === 47) {
                lastCommonSep = i
              } else if (i === 0) {
                lastCommonSep = 0
              }
            }
            break
          }
          var fromCode = from3.charCodeAt(fromStart + i)
          var toCode = to.charCodeAt(toStart + i)
          if (fromCode !== toCode) break
          else if (fromCode === 47) lastCommonSep = i
        }
        var out = ''
        for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
          if (i === fromEnd || from3.charCodeAt(i) === 47) {
            if (out.length === 0) out += '..'
            else out += '/..'
          }
        }
        if (out.length > 0) return out + to.slice(toStart + lastCommonSep)
        else {
          toStart += lastCommonSep
          if (to.charCodeAt(toStart) === 47) ++toStart
          return to.slice(toStart)
        }
      },
      _makeLong: function _makeLong(path) {
        return path
      },
      dirname: function dirname(path) {
        assertPath(path)
        if (path.length === 0) return '.'
        var code6 = path.charCodeAt(0)
        var hasRoot = code6 === 47
        var end = -1
        var matchedSlash = true
        for (var i = path.length - 1; i >= 1; --i) {
          code6 = path.charCodeAt(i)
          if (code6 === 47) {
            if (!matchedSlash) {
              end = i
              break
            }
          } else {
            matchedSlash = false
          }
        }
        if (end === -1) return hasRoot ? '/' : '.'
        if (hasRoot && end === 1) return '//'
        return path.slice(0, end)
      },
      basename: function basename(path, ext) {
        if (ext !== void 0 && typeof ext !== 'string')
          throw new TypeError('"ext" argument must be a string')
        assertPath(path)
        var start = 0
        var end = -1
        var matchedSlash = true
        var i
        if (ext !== void 0 && ext.length > 0 && ext.length <= path.length) {
          if (ext.length === path.length && ext === path) return ''
          var extIdx = ext.length - 1
          var firstNonSlashEnd = -1
          for (i = path.length - 1; i >= 0; --i) {
            var code6 = path.charCodeAt(i)
            if (code6 === 47) {
              if (!matchedSlash) {
                start = i + 1
                break
              }
            } else {
              if (firstNonSlashEnd === -1) {
                matchedSlash = false
                firstNonSlashEnd = i + 1
              }
              if (extIdx >= 0) {
                if (code6 === ext.charCodeAt(extIdx)) {
                  if (--extIdx === -1) {
                    end = i
                  }
                } else {
                  extIdx = -1
                  end = firstNonSlashEnd
                }
              }
            }
          }
          if (start === end) end = firstNonSlashEnd
          else if (end === -1) end = path.length
          return path.slice(start, end)
        } else {
          for (i = path.length - 1; i >= 0; --i) {
            if (path.charCodeAt(i) === 47) {
              if (!matchedSlash) {
                start = i + 1
                break
              }
            } else if (end === -1) {
              matchedSlash = false
              end = i + 1
            }
          }
          if (end === -1) return ''
          return path.slice(start, end)
        }
      },
      extname: function extname(path) {
        assertPath(path)
        var startDot = -1
        var startPart = 0
        var end = -1
        var matchedSlash = true
        var preDotState = 0
        for (var i = path.length - 1; i >= 0; --i) {
          var code6 = path.charCodeAt(i)
          if (code6 === 47) {
            if (!matchedSlash) {
              startPart = i + 1
              break
            }
            continue
          }
          if (end === -1) {
            matchedSlash = false
            end = i + 1
          }
          if (code6 === 46) {
            if (startDot === -1) startDot = i
            else if (preDotState !== 1) preDotState = 1
          } else if (startDot !== -1) {
            preDotState = -1
          }
        }
        if (
          startDot === -1 ||
          end === -1 ||
          preDotState === 0 ||
          (preDotState === 1 &&
            startDot === end - 1 &&
            startDot === startPart + 1)
        ) {
          return ''
        }
        return path.slice(startDot, end)
      },
      format: function format(pathObject) {
        if (pathObject === null || typeof pathObject !== 'object') {
          throw new TypeError(
            'The "pathObject" argument must be of type Object. Received type ' +
              typeof pathObject
          )
        }
        return _format('/', pathObject)
      },
      parse: function parse(path) {
        assertPath(path)
        var ret = { root: '', dir: '', base: '', ext: '', name: '' }
        if (path.length === 0) return ret
        var code6 = path.charCodeAt(0)
        var isAbsolute = code6 === 47
        var start
        if (isAbsolute) {
          ret.root = '/'
          start = 1
        } else {
          start = 0
        }
        var startDot = -1
        var startPart = 0
        var end = -1
        var matchedSlash = true
        var i = path.length - 1
        var preDotState = 0
        for (; i >= start; --i) {
          code6 = path.charCodeAt(i)
          if (code6 === 47) {
            if (!matchedSlash) {
              startPart = i + 1
              break
            }
            continue
          }
          if (end === -1) {
            matchedSlash = false
            end = i + 1
          }
          if (code6 === 46) {
            if (startDot === -1) startDot = i
            else if (preDotState !== 1) preDotState = 1
          } else if (startDot !== -1) {
            preDotState = -1
          }
        }
        if (
          startDot === -1 ||
          end === -1 ||
          preDotState === 0 ||
          (preDotState === 1 &&
            startDot === end - 1 &&
            startDot === startPart + 1)
        ) {
          if (end !== -1) {
            if (startPart === 0 && isAbsolute)
              ret.base = ret.name = path.slice(1, end)
            else ret.base = ret.name = path.slice(startPart, end)
          }
        } else {
          if (startPart === 0 && isAbsolute) {
            ret.name = path.slice(1, startDot)
            ret.base = path.slice(1, end)
          } else {
            ret.name = path.slice(startPart, startDot)
            ret.base = path.slice(startPart, end)
          }
          ret.ext = path.slice(startDot, end)
        }
        if (startPart > 0) ret.dir = path.slice(0, startPart - 1)
        else if (isAbsolute) ret.dir = '/'
        return ret
      },
      sep: '/',
      delimiter: ':',
      win32: null,
      posix: null,
    }
    posix.posix = posix
    module2.exports = posix
  },
})

// node_modules/ajv/dist/compile/codegen/code.js
var require_code = __commonJS({
  'node_modules/ajv/dist/compile/codegen/code.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    exports2.regexpCode =
      exports2.getEsmExportName =
      exports2.getProperty =
      exports2.safeStringify =
      exports2.stringify =
      exports2.strConcat =
      exports2.addCodeArg =
      exports2.str =
      exports2._ =
      exports2.nil =
      exports2._Code =
      exports2.Name =
      exports2.IDENTIFIER =
      exports2._CodeOrName =
        void 0
    var _CodeOrName = class {}
    exports2._CodeOrName = _CodeOrName
    exports2.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i
    var Name = class extends _CodeOrName {
      constructor(s) {
        super()
        if (!exports2.IDENTIFIER.test(s))
          throw new Error('CodeGen: name must be a valid identifier')
        this.str = s
      }
      toString() {
        return this.str
      }
      emptyStr() {
        return false
      }
      get names() {
        return { [this.str]: 1 }
      }
    }
    exports2.Name = Name
    var _Code = class extends _CodeOrName {
      constructor(code6) {
        super()
        this._items = typeof code6 === 'string' ? [code6] : code6
      }
      toString() {
        return this.str
      }
      emptyStr() {
        if (this._items.length > 1) return false
        const item = this._items[0]
        return item === '' || item === '""'
      }
      get str() {
        var _a
        return (_a = this._str) !== null && _a !== void 0
          ? _a
          : (this._str = this._items.reduce((s, c) => `${s}${c}`, ''))
      }
      get names() {
        var _a
        return (_a = this._names) !== null && _a !== void 0
          ? _a
          : (this._names = this._items.reduce((names, c) => {
              if (c instanceof Name) names[c.str] = (names[c.str] || 0) + 1
              return names
            }, {}))
      }
    }
    exports2._Code = _Code
    exports2.nil = new _Code('')
    function _(strs, ...args) {
      const code6 = [strs[0]]
      let i = 0
      while (i < args.length) {
        addCodeArg(code6, args[i])
        code6.push(strs[++i])
      }
      return new _Code(code6)
    }
    exports2._ = _
    var plus = new _Code('+')
    function str(strs, ...args) {
      const expr = [safeStringify(strs[0])]
      let i = 0
      while (i < args.length) {
        expr.push(plus)
        addCodeArg(expr, args[i])
        expr.push(plus, safeStringify(strs[++i]))
      }
      optimize(expr)
      return new _Code(expr)
    }
    exports2.str = str
    function addCodeArg(code6, arg) {
      if (arg instanceof _Code) code6.push(...arg._items)
      else if (arg instanceof Name) code6.push(arg)
      else code6.push(interpolate(arg))
    }
    exports2.addCodeArg = addCodeArg
    function optimize(expr) {
      let i = 1
      while (i < expr.length - 1) {
        if (expr[i] === plus) {
          const res = mergeExprItems(expr[i - 1], expr[i + 1])
          if (res !== void 0) {
            expr.splice(i - 1, 3, res)
            continue
          }
          expr[i++] = '+'
        }
        i++
      }
    }
    function mergeExprItems(a, b) {
      if (b === '""') return a
      if (a === '""') return b
      if (typeof a == 'string') {
        if (b instanceof Name || a[a.length - 1] !== '"') return
        if (typeof b != 'string') return `${a.slice(0, -1)}${b}"`
        if (b[0] === '"') return a.slice(0, -1) + b.slice(1)
        return
      }
      if (typeof b == 'string' && b[0] === '"' && !(a instanceof Name))
        return `"${a}${b.slice(1)}`
      return
    }
    function strConcat(c1, c2) {
      return c2.emptyStr() ? c1 : c1.emptyStr() ? c2 : str`${c1}${c2}`
    }
    exports2.strConcat = strConcat
    function interpolate(x) {
      return typeof x == 'number' || typeof x == 'boolean' || x === null
        ? x
        : safeStringify(Array.isArray(x) ? x.join(',') : x)
    }
    function stringify(x) {
      return new _Code(safeStringify(x))
    }
    exports2.stringify = stringify
    function safeStringify(x) {
      return JSON.stringify(x)
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029')
    }
    exports2.safeStringify = safeStringify
    function getProperty(key) {
      return typeof key == 'string' && exports2.IDENTIFIER.test(key)
        ? new _Code(`.${key}`)
        : _`[${key}]`
    }
    exports2.getProperty = getProperty
    function getEsmExportName(key) {
      if (typeof key == 'string' && exports2.IDENTIFIER.test(key)) {
        return new _Code(`${key}`)
      }
      throw new Error(
        `CodeGen: invalid export name: ${key}, use explicit $id name mapping`
      )
    }
    exports2.getEsmExportName = getEsmExportName
    function regexpCode(rx) {
      return new _Code(rx.toString())
    }
    exports2.regexpCode = regexpCode
  },
})

// node_modules/ajv/dist/compile/codegen/scope.js
var require_scope = __commonJS({
  'node_modules/ajv/dist/compile/codegen/scope.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    exports2.ValueScope =
      exports2.ValueScopeName =
      exports2.Scope =
      exports2.varKinds =
      exports2.UsedValueState =
        void 0
    var code_1 = require_code()
    var ValueError = class extends Error {
      constructor(name6) {
        super(`CodeGen: "code" for ${name6} not defined`)
        this.value = name6.value
      }
    }
    var UsedValueState
    ;(function (UsedValueState2) {
      UsedValueState2[(UsedValueState2['Started'] = 0)] = 'Started'
      UsedValueState2[(UsedValueState2['Completed'] = 1)] = 'Completed'
    })(
      (UsedValueState =
        exports2.UsedValueState || (exports2.UsedValueState = {}))
    )
    exports2.varKinds = {
      const: new code_1.Name('const'),
      let: new code_1.Name('let'),
      var: new code_1.Name('var'),
    }
    var Scope = class {
      constructor({ prefixes, parent } = {}) {
        this._names = {}
        this._prefixes = prefixes
        this._parent = parent
      }
      toName(nameOrPrefix) {
        return nameOrPrefix instanceof code_1.Name
          ? nameOrPrefix
          : this.name(nameOrPrefix)
      }
      name(prefix) {
        return new code_1.Name(this._newName(prefix))
      }
      _newName(prefix) {
        const ng = this._names[prefix] || this._nameGroup(prefix)
        return `${prefix}${ng.index++}`
      }
      _nameGroup(prefix) {
        var _a, _b
        if (
          ((_b =
            (_a = this._parent) === null || _a === void 0
              ? void 0
              : _a._prefixes) === null || _b === void 0
            ? void 0
            : _b.has(prefix)) ||
          (this._prefixes && !this._prefixes.has(prefix))
        ) {
          throw new Error(
            `CodeGen: prefix "${prefix}" is not allowed in this scope`
          )
        }
        return (this._names[prefix] = { prefix, index: 0 })
      }
    }
    exports2.Scope = Scope
    var ValueScopeName = class extends code_1.Name {
      constructor(prefix, nameStr) {
        super(nameStr)
        this.prefix = prefix
      }
      setValue(value, { property, itemIndex }) {
        this.value = value
        this.scopePath = (0, code_1._)`.${new code_1.Name(
          property
        )}[${itemIndex}]`
      }
    }
    exports2.ValueScopeName = ValueScopeName
    var line = (0, code_1._)`\n`
    var ValueScope = class extends Scope {
      constructor(opts) {
        super(opts)
        this._values = {}
        this._scope = opts.scope
        this.opts = { ...opts, _n: opts.lines ? line : code_1.nil }
      }
      get() {
        return this._scope
      }
      name(prefix) {
        return new ValueScopeName(prefix, this._newName(prefix))
      }
      value(nameOrPrefix, value) {
        var _a
        if (value.ref === void 0)
          throw new Error('CodeGen: ref must be passed in value')
        const name6 = this.toName(nameOrPrefix)
        const { prefix } = name6
        const valueKey =
          (_a = value.key) !== null && _a !== void 0 ? _a : value.ref
        let vs = this._values[prefix]
        if (vs) {
          const _name = vs.get(valueKey)
          if (_name) return _name
        } else {
          vs = this._values[prefix] = new Map()
        }
        vs.set(valueKey, name6)
        const s = this._scope[prefix] || (this._scope[prefix] = [])
        const itemIndex = s.length
        s[itemIndex] = value.ref
        name6.setValue(value, { property: prefix, itemIndex })
        return name6
      }
      getValue(prefix, keyOrRef) {
        const vs = this._values[prefix]
        if (!vs) return
        return vs.get(keyOrRef)
      }
      scopeRefs(scopeName, values = this._values) {
        return this._reduceValues(values, (name6) => {
          if (name6.scopePath === void 0)
            throw new Error(`CodeGen: name "${name6}" has no value`)
          return (0, code_1._)`${scopeName}${name6.scopePath}`
        })
      }
      scopeCode(values = this._values, usedValues, getCode) {
        return this._reduceValues(
          values,
          (name6) => {
            if (name6.value === void 0)
              throw new Error(`CodeGen: name "${name6}" has no value`)
            return name6.value.code
          },
          usedValues,
          getCode
        )
      }
      _reduceValues(values, valueCode, usedValues = {}, getCode) {
        let code6 = code_1.nil
        for (const prefix in values) {
          const vs = values[prefix]
          if (!vs) continue
          const nameSet = (usedValues[prefix] = usedValues[prefix] || new Map())
          vs.forEach((name6) => {
            if (nameSet.has(name6)) return
            nameSet.set(name6, UsedValueState.Started)
            let c = valueCode(name6)
            if (c) {
              const def = this.opts.es5
                ? exports2.varKinds.var
                : exports2.varKinds.const
              code6 = (0,
              code_1._)`${code6}${def} ${name6} = ${c};${this.opts._n}`
            } else if (
              (c =
                getCode === null || getCode === void 0
                  ? void 0
                  : getCode(name6))
            ) {
              code6 = (0, code_1._)`${code6}${c}${this.opts._n}`
            } else {
              throw new ValueError(name6)
            }
            nameSet.set(name6, UsedValueState.Completed)
          })
        }
        return code6
      }
    }
    exports2.ValueScope = ValueScope
  },
})

// node_modules/ajv/dist/compile/codegen/index.js
var require_codegen = __commonJS({
  'node_modules/ajv/dist/compile/codegen/index.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    exports2.or =
      exports2.and =
      exports2.not =
      exports2.CodeGen =
      exports2.operators =
      exports2.varKinds =
      exports2.ValueScopeName =
      exports2.ValueScope =
      exports2.Scope =
      exports2.Name =
      exports2.regexpCode =
      exports2.stringify =
      exports2.getProperty =
      exports2.nil =
      exports2.strConcat =
      exports2.str =
      exports2._ =
        void 0
    var code_1 = require_code()
    var scope_1 = require_scope()
    var code_2 = require_code()
    Object.defineProperty(exports2, '_', {
      enumerable: true,
      get: function () {
        return code_2._
      },
    })
    Object.defineProperty(exports2, 'str', {
      enumerable: true,
      get: function () {
        return code_2.str
      },
    })
    Object.defineProperty(exports2, 'strConcat', {
      enumerable: true,
      get: function () {
        return code_2.strConcat
      },
    })
    Object.defineProperty(exports2, 'nil', {
      enumerable: true,
      get: function () {
        return code_2.nil
      },
    })
    Object.defineProperty(exports2, 'getProperty', {
      enumerable: true,
      get: function () {
        return code_2.getProperty
      },
    })
    Object.defineProperty(exports2, 'stringify', {
      enumerable: true,
      get: function () {
        return code_2.stringify
      },
    })
    Object.defineProperty(exports2, 'regexpCode', {
      enumerable: true,
      get: function () {
        return code_2.regexpCode
      },
    })
    Object.defineProperty(exports2, 'Name', {
      enumerable: true,
      get: function () {
        return code_2.Name
      },
    })
    var scope_2 = require_scope()
    Object.defineProperty(exports2, 'Scope', {
      enumerable: true,
      get: function () {
        return scope_2.Scope
      },
    })
    Object.defineProperty(exports2, 'ValueScope', {
      enumerable: true,
      get: function () {
        return scope_2.ValueScope
      },
    })
    Object.defineProperty(exports2, 'ValueScopeName', {
      enumerable: true,
      get: function () {
        return scope_2.ValueScopeName
      },
    })
    Object.defineProperty(exports2, 'varKinds', {
      enumerable: true,
      get: function () {
        return scope_2.varKinds
      },
    })
    exports2.operators = {
      GT: new code_1._Code('>'),
      GTE: new code_1._Code('>='),
      LT: new code_1._Code('<'),
      LTE: new code_1._Code('<='),
      EQ: new code_1._Code('==='),
      NEQ: new code_1._Code('!=='),
      NOT: new code_1._Code('!'),
      OR: new code_1._Code('||'),
      AND: new code_1._Code('&&'),
      ADD: new code_1._Code('+'),
    }
    var Node = class {
      optimizeNodes() {
        return this
      }
      optimizeNames(_names, _constants) {
        return this
      }
    }
    var Def = class extends Node {
      constructor(varKind, name6, rhs) {
        super()
        this.varKind = varKind
        this.name = name6
        this.rhs = rhs
      }
      render({ es5, _n }) {
        const varKind = es5 ? scope_1.varKinds.var : this.varKind
        const rhs = this.rhs === void 0 ? '' : ` = ${this.rhs}`
        return `${varKind} ${this.name}${rhs};` + _n
      }
      optimizeNames(names, constants) {
        if (!names[this.name.str]) return
        if (this.rhs) this.rhs = optimizeExpr(this.rhs, names, constants)
        return this
      }
      get names() {
        return this.rhs instanceof code_1._CodeOrName ? this.rhs.names : {}
      }
    }
    var Assign = class extends Node {
      constructor(lhs, rhs, sideEffects) {
        super()
        this.lhs = lhs
        this.rhs = rhs
        this.sideEffects = sideEffects
      }
      render({ _n }) {
        return `${this.lhs} = ${this.rhs};` + _n
      }
      optimizeNames(names, constants) {
        if (
          this.lhs instanceof code_1.Name &&
          !names[this.lhs.str] &&
          !this.sideEffects
        )
          return
        this.rhs = optimizeExpr(this.rhs, names, constants)
        return this
      }
      get names() {
        const names =
          this.lhs instanceof code_1.Name ? {} : { ...this.lhs.names }
        return addExprNames(names, this.rhs)
      }
    }
    var AssignOp = class extends Assign {
      constructor(lhs, op, rhs, sideEffects) {
        super(lhs, rhs, sideEffects)
        this.op = op
      }
      render({ _n }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + _n
      }
    }
    var Label = class extends Node {
      constructor(label) {
        super()
        this.label = label
        this.names = {}
      }
      render({ _n }) {
        return `${this.label}:` + _n
      }
    }
    var Break = class extends Node {
      constructor(label) {
        super()
        this.label = label
        this.names = {}
      }
      render({ _n }) {
        const label = this.label ? ` ${this.label}` : ''
        return `break${label};` + _n
      }
    }
    var Throw = class extends Node {
      constructor(error) {
        super()
        this.error = error
      }
      render({ _n }) {
        return `throw ${this.error};` + _n
      }
      get names() {
        return this.error.names
      }
    }
    var AnyCode = class extends Node {
      constructor(code6) {
        super()
        this.code = code6
      }
      render({ _n }) {
        return `${this.code};` + _n
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0
      }
      optimizeNames(names, constants) {
        this.code = optimizeExpr(this.code, names, constants)
        return this
      }
      get names() {
        return this.code instanceof code_1._CodeOrName ? this.code.names : {}
      }
    }
    var ParentNode = class extends Node {
      constructor(nodes = []) {
        super()
        this.nodes = nodes
      }
      render(opts) {
        return this.nodes.reduce((code6, n) => code6 + n.render(opts), '')
      }
      optimizeNodes() {
        const { nodes } = this
        let i = nodes.length
        while (i--) {
          const n = nodes[i].optimizeNodes()
          if (Array.isArray(n)) nodes.splice(i, 1, ...n)
          else if (n) nodes[i] = n
          else nodes.splice(i, 1)
        }
        return nodes.length > 0 ? this : void 0
      }
      optimizeNames(names, constants) {
        const { nodes } = this
        let i = nodes.length
        while (i--) {
          const n = nodes[i]
          if (n.optimizeNames(names, constants)) continue
          subtractNames(names, n.names)
          nodes.splice(i, 1)
        }
        return nodes.length > 0 ? this : void 0
      }
      get names() {
        return this.nodes.reduce((names, n) => addNames(names, n.names), {})
      }
    }
    var BlockNode = class extends ParentNode {
      render(opts) {
        return '{' + opts._n + super.render(opts) + '}' + opts._n
      }
    }
    var Root2 = class extends ParentNode {}
    var Else = class extends BlockNode {}
    Else.kind = 'else'
    var If = class extends BlockNode {
      constructor(condition, nodes) {
        super(nodes)
        this.condition = condition
      }
      render(opts) {
        let code6 = `if(${this.condition})` + super.render(opts)
        if (this.else) code6 += 'else ' + this.else.render(opts)
        return code6
      }
      optimizeNodes() {
        super.optimizeNodes()
        const cond = this.condition
        if (cond === true) return this.nodes
        let e = this.else
        if (e) {
          const ns = e.optimizeNodes()
          e = this.else = Array.isArray(ns) ? new Else(ns) : ns
        }
        if (e) {
          if (cond === false) return e instanceof If ? e : e.nodes
          if (this.nodes.length) return this
          return new If(not(cond), e instanceof If ? [e] : e.nodes)
        }
        if (cond === false || !this.nodes.length) return void 0
        return this
      }
      optimizeNames(names, constants) {
        var _a
        this.else =
          (_a = this.else) === null || _a === void 0
            ? void 0
            : _a.optimizeNames(names, constants)
        if (!(super.optimizeNames(names, constants) || this.else)) return
        this.condition = optimizeExpr(this.condition, names, constants)
        return this
      }
      get names() {
        const names = super.names
        addExprNames(names, this.condition)
        if (this.else) addNames(names, this.else.names)
        return names
      }
    }
    If.kind = 'if'
    var For = class extends BlockNode {}
    For.kind = 'for'
    var ForLoop = class extends For {
      constructor(iteration) {
        super()
        this.iteration = iteration
      }
      render(opts) {
        return `for(${this.iteration})` + super.render(opts)
      }
      optimizeNames(names, constants) {
        if (!super.optimizeNames(names, constants)) return
        this.iteration = optimizeExpr(this.iteration, names, constants)
        return this
      }
      get names() {
        return addNames(super.names, this.iteration.names)
      }
    }
    var ForRange = class extends For {
      constructor(varKind, name6, from3, to) {
        super()
        this.varKind = varKind
        this.name = name6
        this.from = from3
        this.to = to
      }
      render(opts) {
        const varKind = opts.es5 ? scope_1.varKinds.var : this.varKind
        const { name: name6, from: from3, to } = this
        return (
          `for(${varKind} ${name6}=${from3}; ${name6}<${to}; ${name6}++)` +
          super.render(opts)
        )
      }
      get names() {
        const names = addExprNames(super.names, this.from)
        return addExprNames(names, this.to)
      }
    }
    var ForIter = class extends For {
      constructor(loop, varKind, name6, iterable) {
        super()
        this.loop = loop
        this.varKind = varKind
        this.name = name6
        this.iterable = iterable
      }
      render(opts) {
        return (
          `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` +
          super.render(opts)
        )
      }
      optimizeNames(names, constants) {
        if (!super.optimizeNames(names, constants)) return
        this.iterable = optimizeExpr(this.iterable, names, constants)
        return this
      }
      get names() {
        return addNames(super.names, this.iterable.names)
      }
    }
    var Func = class extends BlockNode {
      constructor(name6, args, async) {
        super()
        this.name = name6
        this.args = args
        this.async = async
      }
      render(opts) {
        const _async = this.async ? 'async ' : ''
        return (
          `${_async}function ${this.name}(${this.args})` + super.render(opts)
        )
      }
    }
    Func.kind = 'func'
    var Return = class extends ParentNode {
      render(opts) {
        return 'return ' + super.render(opts)
      }
    }
    Return.kind = 'return'
    var Try = class extends BlockNode {
      render(opts) {
        let code6 = 'try' + super.render(opts)
        if (this.catch) code6 += this.catch.render(opts)
        if (this.finally) code6 += this.finally.render(opts)
        return code6
      }
      optimizeNodes() {
        var _a, _b
        super.optimizeNodes()
        ;(_a = this.catch) === null || _a === void 0
          ? void 0
          : _a.optimizeNodes()
        ;(_b = this.finally) === null || _b === void 0
          ? void 0
          : _b.optimizeNodes()
        return this
      }
      optimizeNames(names, constants) {
        var _a, _b
        super.optimizeNames(names, constants)
        ;(_a = this.catch) === null || _a === void 0
          ? void 0
          : _a.optimizeNames(names, constants)
        ;(_b = this.finally) === null || _b === void 0
          ? void 0
          : _b.optimizeNames(names, constants)
        return this
      }
      get names() {
        const names = super.names
        if (this.catch) addNames(names, this.catch.names)
        if (this.finally) addNames(names, this.finally.names)
        return names
      }
    }
    var Catch = class extends BlockNode {
      constructor(error) {
        super()
        this.error = error
      }
      render(opts) {
        return `catch(${this.error})` + super.render(opts)
      }
    }
    Catch.kind = 'catch'
    var Finally = class extends BlockNode {
      render(opts) {
        return 'finally' + super.render(opts)
      }
    }
    Finally.kind = 'finally'
    var CodeGen = class {
      constructor(extScope, opts = {}) {
        this._values = {}
        this._blockStarts = []
        this._constants = {}
        this.opts = { ...opts, _n: opts.lines ? '\n' : '' }
        this._extScope = extScope
        this._scope = new scope_1.Scope({ parent: extScope })
        this._nodes = [new Root2()]
      }
      toString() {
        return this._root.render(this.opts)
      }
      name(prefix) {
        return this._scope.name(prefix)
      }
      scopeName(prefix) {
        return this._extScope.name(prefix)
      }
      scopeValue(prefixOrName, value) {
        const name6 = this._extScope.value(prefixOrName, value)
        const vs =
          this._values[name6.prefix] || (this._values[name6.prefix] = new Set())
        vs.add(name6)
        return name6
      }
      getScopeValue(prefix, keyOrRef) {
        return this._extScope.getValue(prefix, keyOrRef)
      }
      scopeRefs(scopeName) {
        return this._extScope.scopeRefs(scopeName, this._values)
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values)
      }
      _def(varKind, nameOrPrefix, rhs, constant) {
        const name6 = this._scope.toName(nameOrPrefix)
        if (rhs !== void 0 && constant) this._constants[name6.str] = rhs
        this._leafNode(new Def(varKind, name6, rhs))
        return name6
      }
      const(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.const, nameOrPrefix, rhs, _constant)
      }
      let(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.let, nameOrPrefix, rhs, _constant)
      }
      var(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.var, nameOrPrefix, rhs, _constant)
      }
      assign(lhs, rhs, sideEffects) {
        return this._leafNode(new Assign(lhs, rhs, sideEffects))
      }
      add(lhs, rhs) {
        return this._leafNode(new AssignOp(lhs, exports2.operators.ADD, rhs))
      }
      code(c) {
        if (typeof c == 'function') c()
        else if (c !== code_1.nil) this._leafNode(new AnyCode(c))
        return this
      }
      object(...keyValues) {
        const code6 = ['{']
        for (const [key, value] of keyValues) {
          if (code6.length > 1) code6.push(',')
          code6.push(key)
          if (key !== value || this.opts.es5) {
            code6.push(':')
            ;(0, code_1.addCodeArg)(code6, value)
          }
        }
        code6.push('}')
        return new code_1._Code(code6)
      }
      if(condition, thenBody, elseBody) {
        this._blockNode(new If(condition))
        if (thenBody && elseBody) {
          this.code(thenBody).else().code(elseBody).endIf()
        } else if (thenBody) {
          this.code(thenBody).endIf()
        } else if (elseBody) {
          throw new Error('CodeGen: "else" body without "then" body')
        }
        return this
      }
      elseIf(condition) {
        return this._elseNode(new If(condition))
      }
      else() {
        return this._elseNode(new Else())
      }
      endIf() {
        return this._endBlockNode(If, Else)
      }
      _for(node, forBody) {
        this._blockNode(node)
        if (forBody) this.code(forBody).endFor()
        return this
      }
      for(iteration, forBody) {
        return this._for(new ForLoop(iteration), forBody)
      }
      forRange(
        nameOrPrefix,
        from3,
        to,
        forBody,
        varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.let
      ) {
        const name6 = this._scope.toName(nameOrPrefix)
        return this._for(new ForRange(varKind, name6, from3, to), () =>
          forBody(name6)
        )
      }
      forOf(nameOrPrefix, iterable, forBody, varKind = scope_1.varKinds.const) {
        const name6 = this._scope.toName(nameOrPrefix)
        if (this.opts.es5) {
          const arr =
            iterable instanceof code_1.Name
              ? iterable
              : this.var('_arr', iterable)
          return this.forRange('_i', 0, (0, code_1._)`${arr}.length`, (i) => {
            this.var(name6, (0, code_1._)`${arr}[${i}]`)
            forBody(name6)
          })
        }
        return this._for(new ForIter('of', varKind, name6, iterable), () =>
          forBody(name6)
        )
      }
      forIn(
        nameOrPrefix,
        obj,
        forBody,
        varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.const
      ) {
        if (this.opts.ownProperties) {
          return this.forOf(
            nameOrPrefix,
            (0, code_1._)`Object.keys(${obj})`,
            forBody
          )
        }
        const name6 = this._scope.toName(nameOrPrefix)
        return this._for(new ForIter('in', varKind, name6, obj), () =>
          forBody(name6)
        )
      }
      endFor() {
        return this._endBlockNode(For)
      }
      label(label) {
        return this._leafNode(new Label(label))
      }
      break(label) {
        return this._leafNode(new Break(label))
      }
      return(value) {
        const node = new Return()
        this._blockNode(node)
        this.code(value)
        if (node.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node')
        return this._endBlockNode(Return)
      }
      try(tryBody, catchCode, finallyCode) {
        if (!catchCode && !finallyCode)
          throw new Error('CodeGen: "try" without "catch" and "finally"')
        const node = new Try()
        this._blockNode(node)
        this.code(tryBody)
        if (catchCode) {
          const error = this.name('e')
          this._currNode = node.catch = new Catch(error)
          catchCode(error)
        }
        if (finallyCode) {
          this._currNode = node.finally = new Finally()
          this.code(finallyCode)
        }
        return this._endBlockNode(Catch, Finally)
      }
      throw(error) {
        return this._leafNode(new Throw(error))
      }
      block(body, nodeCount) {
        this._blockStarts.push(this._nodes.length)
        if (body) this.code(body).endBlock(nodeCount)
        return this
      }
      endBlock(nodeCount) {
        const len = this._blockStarts.pop()
        if (len === void 0)
          throw new Error('CodeGen: not in self-balancing block')
        const toClose = this._nodes.length - len
        if (toClose < 0 || (nodeCount !== void 0 && toClose !== nodeCount)) {
          throw new Error(
            `CodeGen: wrong number of nodes: ${toClose} vs ${nodeCount} expected`
          )
        }
        this._nodes.length = len
        return this
      }
      func(name6, args = code_1.nil, async, funcBody) {
        this._blockNode(new Func(name6, args, async))
        if (funcBody) this.code(funcBody).endFunc()
        return this
      }
      endFunc() {
        return this._endBlockNode(Func)
      }
      optimize(n = 1) {
        while (n-- > 0) {
          this._root.optimizeNodes()
          this._root.optimizeNames(this._root.names, this._constants)
        }
      }
      _leafNode(node) {
        this._currNode.nodes.push(node)
        return this
      }
      _blockNode(node) {
        this._currNode.nodes.push(node)
        this._nodes.push(node)
      }
      _endBlockNode(N12, N22) {
        const n = this._currNode
        if (n instanceof N12 || (N22 && n instanceof N22)) {
          this._nodes.pop()
          return this
        }
        throw new Error(
          `CodeGen: not in block "${
            N22 ? `${N12.kind}/${N22.kind}` : N12.kind
          }"`
        )
      }
      _elseNode(node) {
        const n = this._currNode
        if (!(n instanceof If)) {
          throw new Error('CodeGen: "else" without "if"')
        }
        this._currNode = n.else = node
        return this
      }
      get _root() {
        return this._nodes[0]
      }
      get _currNode() {
        const ns = this._nodes
        return ns[ns.length - 1]
      }
      set _currNode(node) {
        const ns = this._nodes
        ns[ns.length - 1] = node
      }
    }
    exports2.CodeGen = CodeGen
    function addNames(names, from3) {
      for (const n in from3) names[n] = (names[n] || 0) + (from3[n] || 0)
      return names
    }
    function addExprNames(names, from3) {
      return from3 instanceof code_1._CodeOrName
        ? addNames(names, from3.names)
        : names
    }
    function optimizeExpr(expr, names, constants) {
      if (expr instanceof code_1.Name) return replaceName(expr)
      if (!canOptimize(expr)) return expr
      return new code_1._Code(
        expr._items.reduce((items, c) => {
          if (c instanceof code_1.Name) c = replaceName(c)
          if (c instanceof code_1._Code) items.push(...c._items)
          else items.push(c)
          return items
        }, [])
      )
      function replaceName(n) {
        const c = constants[n.str]
        if (c === void 0 || names[n.str] !== 1) return n
        delete names[n.str]
        return c
      }
      function canOptimize(e) {
        return (
          e instanceof code_1._Code &&
          e._items.some(
            (c) =>
              c instanceof code_1.Name &&
              names[c.str] === 1 &&
              constants[c.str] !== void 0
          )
        )
      }
    }
    function subtractNames(names, from3) {
      for (const n in from3) names[n] = (names[n] || 0) - (from3[n] || 0)
    }
    function not(x) {
      return typeof x == 'boolean' || typeof x == 'number' || x === null
        ? !x
        : (0, code_1._)`!${par(x)}`
    }
    exports2.not = not
    var andCode = mappend(exports2.operators.AND)
    function and(...args) {
      return args.reduce(andCode)
    }
    exports2.and = and
    var orCode = mappend(exports2.operators.OR)
    function or2(...args) {
      return args.reduce(orCode)
    }
    exports2.or = or2
    function mappend(op) {
      return (x, y) =>
        x === code_1.nil
          ? y
          : y === code_1.nil
          ? x
          : (0, code_1._)`${par(x)} ${op} ${par(y)}`
    }
    function par(x) {
      return x instanceof code_1.Name ? x : (0, code_1._)`(${x})`
    }
  },
})

// node_modules/ajv/dist/compile/util.js
var require_util = __commonJS({
  'node_modules/ajv/dist/compile/util.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    exports2.checkStrictMode =
      exports2.getErrorPath =
      exports2.Type =
      exports2.useFunc =
      exports2.setEvaluated =
      exports2.evaluatedPropsToName =
      exports2.mergeEvaluated =
      exports2.eachItem =
      exports2.unescapeJsonPointer =
      exports2.escapeJsonPointer =
      exports2.escapeFragment =
      exports2.unescapeFragment =
      exports2.schemaRefOrVal =
      exports2.schemaHasRulesButRef =
      exports2.schemaHasRules =
      exports2.checkUnknownRules =
      exports2.alwaysValidSchema =
      exports2.toHash =
        void 0
    var codegen_1 = require_codegen()
    var code_1 = require_code()
    function toHash(arr) {
      const hash = {}
      for (const item of arr) hash[item] = true
      return hash
    }
    exports2.toHash = toHash
    function alwaysValidSchema(it, schema) {
      if (typeof schema == 'boolean') return schema
      if (Object.keys(schema).length === 0) return true
      checkUnknownRules(it, schema)
      return !schemaHasRules(schema, it.self.RULES.all)
    }
    exports2.alwaysValidSchema = alwaysValidSchema
    function checkUnknownRules(it, schema = it.schema) {
      const { opts, self: self2 } = it
      if (!opts.strictSchema) return
      if (typeof schema === 'boolean') return
      const rules = self2.RULES.keywords
      for (const key in schema) {
        if (!rules[key]) checkStrictMode(it, `unknown keyword: "${key}"`)
      }
    }
    exports2.checkUnknownRules = checkUnknownRules
    function schemaHasRules(schema, rules) {
      if (typeof schema == 'boolean') return !schema
      for (const key in schema) if (rules[key]) return true
      return false
    }
    exports2.schemaHasRules = schemaHasRules
    function schemaHasRulesButRef(schema, RULES) {
      if (typeof schema == 'boolean') return !schema
      for (const key in schema)
        if (key !== '$ref' && RULES.all[key]) return true
      return false
    }
    exports2.schemaHasRulesButRef = schemaHasRulesButRef
    function schemaRefOrVal(
      { topSchemaRef, schemaPath },
      schema,
      keyword,
      $data
    ) {
      if (!$data) {
        if (typeof schema == 'number' || typeof schema == 'boolean')
          return schema
        if (typeof schema == 'string') return (0, codegen_1._)`${schema}`
      }
      return (0, codegen_1._)`${topSchemaRef}${schemaPath}${(0,
      codegen_1.getProperty)(keyword)}`
    }
    exports2.schemaRefOrVal = schemaRefOrVal
    function unescapeFragment(str) {
      return unescapeJsonPointer(decodeURIComponent(str))
    }
    exports2.unescapeFragment = unescapeFragment
    function escapeFragment(str) {
      return encodeURIComponent(escapeJsonPointer(str))
    }
    exports2.escapeFragment = escapeFragment
    function escapeJsonPointer(str) {
      if (typeof str == 'number') return `${str}`
      return str.replace(/~/g, '~0').replace(/\//g, '~1')
    }
    exports2.escapeJsonPointer = escapeJsonPointer
    function unescapeJsonPointer(str) {
      return str.replace(/~1/g, '/').replace(/~0/g, '~')
    }
    exports2.unescapeJsonPointer = unescapeJsonPointer
    function eachItem(xs, f) {
      if (Array.isArray(xs)) {
        for (const x of xs) f(x)
      } else {
        f(xs)
      }
    }
    exports2.eachItem = eachItem
    function makeMergeEvaluated({
      mergeNames,
      mergeToName,
      mergeValues,
      resultToName,
    }) {
      return (gen, from3, to, toName) => {
        const res =
          to === void 0
            ? from3
            : to instanceof codegen_1.Name
            ? (from3 instanceof codegen_1.Name
                ? mergeNames(gen, from3, to)
                : mergeToName(gen, from3, to),
              to)
            : from3 instanceof codegen_1.Name
            ? (mergeToName(gen, to, from3), from3)
            : mergeValues(from3, to)
        return toName === codegen_1.Name && !(res instanceof codegen_1.Name)
          ? resultToName(gen, res)
          : res
      }
    }
    exports2.mergeEvaluated = {
      props: makeMergeEvaluated({
        mergeNames: (gen, from3, to) =>
          gen.if(
            (0, codegen_1._)`${to} !== true && ${from3} !== undefined`,
            () => {
              gen.if(
                (0, codegen_1._)`${from3} === true`,
                () => gen.assign(to, true),
                () =>
                  gen
                    .assign(to, (0, codegen_1._)`${to} || {}`)
                    .code((0, codegen_1._)`Object.assign(${to}, ${from3})`)
              )
            }
          ),
        mergeToName: (gen, from3, to) =>
          gen.if((0, codegen_1._)`${to} !== true`, () => {
            if (from3 === true) {
              gen.assign(to, true)
            } else {
              gen.assign(to, (0, codegen_1._)`${to} || {}`)
              setEvaluated(gen, to, from3)
            }
          }),
        mergeValues: (from3, to) =>
          from3 === true ? true : { ...from3, ...to },
        resultToName: evaluatedPropsToName,
      }),
      items: makeMergeEvaluated({
        mergeNames: (gen, from3, to) =>
          gen.if(
            (0, codegen_1._)`${to} !== true && ${from3} !== undefined`,
            () =>
              gen.assign(
                to,
                (0,
                codegen_1._)`${from3} === true ? true : ${to} > ${from3} ? ${to} : ${from3}`
              )
          ),
        mergeToName: (gen, from3, to) =>
          gen.if((0, codegen_1._)`${to} !== true`, () =>
            gen.assign(
              to,
              from3 === true
                ? true
                : (0, codegen_1._)`${to} > ${from3} ? ${to} : ${from3}`
            )
          ),
        mergeValues: (from3, to) =>
          from3 === true ? true : Math.max(from3, to),
        resultToName: (gen, items) => gen.var('items', items),
      }),
    }
    function evaluatedPropsToName(gen, ps) {
      if (ps === true) return gen.var('props', true)
      const props = gen.var('props', (0, codegen_1._)`{}`)
      if (ps !== void 0) setEvaluated(gen, props, ps)
      return props
    }
    exports2.evaluatedPropsToName = evaluatedPropsToName
    function setEvaluated(gen, props, ps) {
      Object.keys(ps).forEach((p) =>
        gen.assign(
          (0, codegen_1._)`${props}${(0, codegen_1.getProperty)(p)}`,
          true
        )
      )
    }
    exports2.setEvaluated = setEvaluated
    var snippets = {}
    function useFunc(gen, f) {
      return gen.scopeValue('func', {
        ref: f,
        code: snippets[f.code] || (snippets[f.code] = new code_1._Code(f.code)),
      })
    }
    exports2.useFunc = useFunc
    var Type2
    ;(function (Type3) {
      Type3[(Type3['Num'] = 0)] = 'Num'
      Type3[(Type3['Str'] = 1)] = 'Str'
    })((Type2 = exports2.Type || (exports2.Type = {})))
    function getErrorPath(dataProp, dataPropType, jsPropertySyntax) {
      if (dataProp instanceof codegen_1.Name) {
        const isNumber = dataPropType === Type2.Num
        return jsPropertySyntax
          ? isNumber
            ? (0, codegen_1._)`"[" + ${dataProp} + "]"`
            : (0, codegen_1._)`"['" + ${dataProp} + "']"`
          : isNumber
          ? (0, codegen_1._)`"/" + ${dataProp}`
          : (0,
            codegen_1._)`"/" + ${dataProp}.replace(/~/g, "~0").replace(/\\//g, "~1")`
      }
      return jsPropertySyntax
        ? (0, codegen_1.getProperty)(dataProp).toString()
        : '/' + escapeJsonPointer(dataProp)
    }
    exports2.getErrorPath = getErrorPath
    function checkStrictMode(it, msg, mode = it.opts.strictSchema) {
      if (!mode) return
      msg = `strict mode: ${msg}`
      if (mode === true) throw new Error(msg)
      it.self.logger.warn(msg)
    }
    exports2.checkStrictMode = checkStrictMode
  },
})

// node_modules/ajv/dist/compile/names.js
var require_names = __commonJS({
  'node_modules/ajv/dist/compile/names.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var codegen_1 = require_codegen()
    var names = {
      data: new codegen_1.Name('data'),
      valCxt: new codegen_1.Name('valCxt'),
      instancePath: new codegen_1.Name('instancePath'),
      parentData: new codegen_1.Name('parentData'),
      parentDataProperty: new codegen_1.Name('parentDataProperty'),
      rootData: new codegen_1.Name('rootData'),
      dynamicAnchors: new codegen_1.Name('dynamicAnchors'),
      vErrors: new codegen_1.Name('vErrors'),
      errors: new codegen_1.Name('errors'),
      this: new codegen_1.Name('this'),
      self: new codegen_1.Name('self'),
      scope: new codegen_1.Name('scope'),
      json: new codegen_1.Name('json'),
      jsonPos: new codegen_1.Name('jsonPos'),
      jsonLen: new codegen_1.Name('jsonLen'),
      jsonPart: new codegen_1.Name('jsonPart'),
    }
    exports2.default = names
  },
})

// node_modules/ajv/dist/compile/errors.js
var require_errors = __commonJS({
  'node_modules/ajv/dist/compile/errors.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    exports2.extendErrors =
      exports2.resetErrorsCount =
      exports2.reportExtraError =
      exports2.reportError =
      exports2.keyword$DataError =
      exports2.keywordError =
        void 0
    var codegen_1 = require_codegen()
    var util_1 = require_util()
    var names_1 = require_names()
    exports2.keywordError = {
      message: ({ keyword }) =>
        (0, codegen_1.str)`must pass "${keyword}" keyword validation`,
    }
    exports2.keyword$DataError = {
      message: ({ keyword, schemaType }) =>
        schemaType
          ? (0,
            codegen_1.str)`"${keyword}" keyword must be ${schemaType} ($data)`
          : (0, codegen_1.str)`"${keyword}" keyword is invalid ($data)`,
    }
    function reportError(
      cxt,
      error = exports2.keywordError,
      errorPaths,
      overrideAllErrors
    ) {
      const { it } = cxt
      const { gen, compositeRule, allErrors } = it
      const errObj = errorObjectCode(cxt, error, errorPaths)
      if (
        overrideAllErrors !== null && overrideAllErrors !== void 0
          ? overrideAllErrors
          : compositeRule || allErrors
      ) {
        addError(gen, errObj)
      } else {
        returnErrors(it, (0, codegen_1._)`[${errObj}]`)
      }
    }
    exports2.reportError = reportError
    function reportExtraError(cxt, error = exports2.keywordError, errorPaths) {
      const { it } = cxt
      const { gen, compositeRule, allErrors } = it
      const errObj = errorObjectCode(cxt, error, errorPaths)
      addError(gen, errObj)
      if (!(compositeRule || allErrors)) {
        returnErrors(it, names_1.default.vErrors)
      }
    }
    exports2.reportExtraError = reportExtraError
    function resetErrorsCount(gen, errsCount) {
      gen.assign(names_1.default.errors, errsCount)
      gen.if((0, codegen_1._)`${names_1.default.vErrors} !== null`, () =>
        gen.if(
          errsCount,
          () =>
            gen.assign(
              (0, codegen_1._)`${names_1.default.vErrors}.length`,
              errsCount
            ),
          () => gen.assign(names_1.default.vErrors, null)
        )
      )
    }
    exports2.resetErrorsCount = resetErrorsCount
    function extendErrors({ gen, keyword, schemaValue, data, errsCount, it }) {
      if (errsCount === void 0) throw new Error('ajv implementation error')
      const err = gen.name('err')
      gen.forRange('i', errsCount, names_1.default.errors, (i) => {
        gen.const(err, (0, codegen_1._)`${names_1.default.vErrors}[${i}]`)
        gen.if((0, codegen_1._)`${err}.instancePath === undefined`, () =>
          gen.assign(
            (0, codegen_1._)`${err}.instancePath`,
            (0, codegen_1.strConcat)(names_1.default.instancePath, it.errorPath)
          )
        )
        gen.assign(
          (0, codegen_1._)`${err}.schemaPath`,
          (0, codegen_1.str)`${it.errSchemaPath}/${keyword}`
        )
        if (it.opts.verbose) {
          gen.assign((0, codegen_1._)`${err}.schema`, schemaValue)
          gen.assign((0, codegen_1._)`${err}.data`, data)
        }
      })
    }
    exports2.extendErrors = extendErrors
    function addError(gen, errObj) {
      const err = gen.const('err', errObj)
      gen.if(
        (0, codegen_1._)`${names_1.default.vErrors} === null`,
        () => gen.assign(names_1.default.vErrors, (0, codegen_1._)`[${err}]`),
        (0, codegen_1._)`${names_1.default.vErrors}.push(${err})`
      )
      gen.code((0, codegen_1._)`${names_1.default.errors}++`)
    }
    function returnErrors(it, errs) {
      const { gen, validateName, schemaEnv } = it
      if (schemaEnv.$async) {
        gen.throw((0, codegen_1._)`new ${it.ValidationError}(${errs})`)
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, errs)
        gen.return(false)
      }
    }
    var E = {
      keyword: new codegen_1.Name('keyword'),
      schemaPath: new codegen_1.Name('schemaPath'),
      params: new codegen_1.Name('params'),
      propertyName: new codegen_1.Name('propertyName'),
      message: new codegen_1.Name('message'),
      schema: new codegen_1.Name('schema'),
      parentSchema: new codegen_1.Name('parentSchema'),
    }
    function errorObjectCode(cxt, error, errorPaths) {
      const { createErrors } = cxt.it
      if (createErrors === false) return (0, codegen_1._)`{}`
      return errorObject(cxt, error, errorPaths)
    }
    function errorObject(cxt, error, errorPaths = {}) {
      const { gen, it } = cxt
      const keyValues = [
        errorInstancePath(it, errorPaths),
        errorSchemaPath(cxt, errorPaths),
      ]
      extraErrorProps(cxt, error, keyValues)
      return gen.object(...keyValues)
    }
    function errorInstancePath({ errorPath }, { instancePath }) {
      const instPath = instancePath
        ? (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(
            instancePath,
            util_1.Type.Str
          )}`
        : errorPath
      return [
        names_1.default.instancePath,
        (0, codegen_1.strConcat)(names_1.default.instancePath, instPath),
      ]
    }
    function errorSchemaPath(
      { keyword, it: { errSchemaPath } },
      { schemaPath, parentSchema }
    ) {
      let schPath = parentSchema
        ? errSchemaPath
        : (0, codegen_1.str)`${errSchemaPath}/${keyword}`
      if (schemaPath) {
        schPath = (0, codegen_1.str)`${schPath}${(0, util_1.getErrorPath)(
          schemaPath,
          util_1.Type.Str
        )}`
      }
      return [E.schemaPath, schPath]
    }
    function extraErrorProps(cxt, { params, message }, keyValues) {
      const { keyword, data, schemaValue, it } = cxt
      const { opts, propertyName, topSchemaRef, schemaPath } = it
      keyValues.push(
        [E.keyword, keyword],
        [
          E.params,
          typeof params == 'function'
            ? params(cxt)
            : params || (0, codegen_1._)`{}`,
        ]
      )
      if (opts.messages) {
        keyValues.push([
          E.message,
          typeof message == 'function' ? message(cxt) : message,
        ])
      }
      if (opts.verbose) {
        keyValues.push(
          [E.schema, schemaValue],
          [E.parentSchema, (0, codegen_1._)`${topSchemaRef}${schemaPath}`],
          [names_1.default.data, data]
        )
      }
      if (propertyName) keyValues.push([E.propertyName, propertyName])
    }
  },
})

// node_modules/ajv/dist/compile/validate/boolSchema.js
var require_boolSchema = __commonJS({
  'node_modules/ajv/dist/compile/validate/boolSchema.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    exports2.boolOrEmptySchema = exports2.topBoolOrEmptySchema = void 0
    var errors_1 = require_errors()
    var codegen_1 = require_codegen()
    var names_1 = require_names()
    var boolError = {
      message: 'boolean schema is false',
    }
    function topBoolOrEmptySchema(it) {
      const { gen, schema, validateName } = it
      if (schema === false) {
        falseSchemaError(it, false)
      } else if (typeof schema == 'object' && schema.$async === true) {
        gen.return(names_1.default.data)
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, null)
        gen.return(true)
      }
    }
    exports2.topBoolOrEmptySchema = topBoolOrEmptySchema
    function boolOrEmptySchema(it, valid) {
      const { gen, schema } = it
      if (schema === false) {
        gen.var(valid, false)
        falseSchemaError(it)
      } else {
        gen.var(valid, true)
      }
    }
    exports2.boolOrEmptySchema = boolOrEmptySchema
    function falseSchemaError(it, overrideAllErrors) {
      const { gen, data } = it
      const cxt = {
        gen,
        keyword: 'false schema',
        data,
        schema: false,
        schemaCode: false,
        schemaValue: false,
        params: {},
        it,
      }
      ;(0, errors_1.reportError)(cxt, boolError, void 0, overrideAllErrors)
    }
  },
})

// node_modules/ajv/dist/compile/rules.js
var require_rules = __commonJS({
  'node_modules/ajv/dist/compile/rules.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    exports2.getRules = exports2.isJSONType = void 0
    var _jsonTypes = [
      'string',
      'number',
      'integer',
      'boolean',
      'null',
      'object',
      'array',
    ]
    var jsonTypes = new Set(_jsonTypes)
    function isJSONType(x) {
      return typeof x == 'string' && jsonTypes.has(x)
    }
    exports2.isJSONType = isJSONType
    function getRules() {
      const groups = {
        number: { type: 'number', rules: [] },
        string: { type: 'string', rules: [] },
        array: { type: 'array', rules: [] },
        object: { type: 'object', rules: [] },
      }
      return {
        types: { ...groups, integer: true, boolean: true, null: true },
        rules: [
          { rules: [] },
          groups.number,
          groups.string,
          groups.array,
          groups.object,
        ],
        post: { rules: [] },
        all: {},
        keywords: {},
      }
    }
    exports2.getRules = getRules
  },
})

// node_modules/ajv/dist/compile/validate/applicability.js
var require_applicability = __commonJS({
  'node_modules/ajv/dist/compile/validate/applicability.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    exports2.shouldUseRule =
      exports2.shouldUseGroup =
      exports2.schemaHasRulesForType =
        void 0
    function schemaHasRulesForType({ schema, self: self2 }, type) {
      const group = self2.RULES.types[type]
      return group && group !== true && shouldUseGroup(schema, group)
    }
    exports2.schemaHasRulesForType = schemaHasRulesForType
    function shouldUseGroup(schema, group) {
      return group.rules.some((rule) => shouldUseRule(schema, rule))
    }
    exports2.shouldUseGroup = shouldUseGroup
    function shouldUseRule(schema, rule) {
      var _a
      return (
        schema[rule.keyword] !== void 0 ||
        ((_a = rule.definition.implements) === null || _a === void 0
          ? void 0
          : _a.some((kwd) => schema[kwd] !== void 0))
      )
    }
    exports2.shouldUseRule = shouldUseRule
  },
})

// node_modules/ajv/dist/compile/validate/dataType.js
var require_dataType = __commonJS({
  'node_modules/ajv/dist/compile/validate/dataType.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    exports2.reportTypeError =
      exports2.checkDataTypes =
      exports2.checkDataType =
      exports2.coerceAndCheckDataType =
      exports2.getJSONTypes =
      exports2.getSchemaTypes =
      exports2.DataType =
        void 0
    var rules_1 = require_rules()
    var applicability_1 = require_applicability()
    var errors_1 = require_errors()
    var codegen_1 = require_codegen()
    var util_1 = require_util()
    var DataType
    ;(function (DataType2) {
      DataType2[(DataType2['Correct'] = 0)] = 'Correct'
      DataType2[(DataType2['Wrong'] = 1)] = 'Wrong'
    })((DataType = exports2.DataType || (exports2.DataType = {})))
    function getSchemaTypes(schema) {
      const types2 = getJSONTypes(schema.type)
      const hasNull = types2.includes('null')
      if (hasNull) {
        if (schema.nullable === false)
          throw new Error('type: null contradicts nullable: false')
      } else {
        if (!types2.length && schema.nullable !== void 0) {
          throw new Error('"nullable" cannot be used without "type"')
        }
        if (schema.nullable === true) types2.push('null')
      }
      return types2
    }
    exports2.getSchemaTypes = getSchemaTypes
    function getJSONTypes(ts) {
      const types2 = Array.isArray(ts) ? ts : ts ? [ts] : []
      if (types2.every(rules_1.isJSONType)) return types2
      throw new Error(
        'type must be JSONType or JSONType[]: ' + types2.join(',')
      )
    }
    exports2.getJSONTypes = getJSONTypes
    function coerceAndCheckDataType(it, types2) {
      const { gen, data, opts } = it
      const coerceTo = coerceToTypes(types2, opts.coerceTypes)
      const checkTypes =
        types2.length > 0 &&
        !(
          coerceTo.length === 0 &&
          types2.length === 1 &&
          (0, applicability_1.schemaHasRulesForType)(it, types2[0])
        )
      if (checkTypes) {
        const wrongType = checkDataTypes(
          types2,
          data,
          opts.strictNumbers,
          DataType.Wrong
        )
        gen.if(wrongType, () => {
          if (coerceTo.length) coerceData(it, types2, coerceTo)
          else reportTypeError(it)
        })
      }
      return checkTypes
    }
    exports2.coerceAndCheckDataType = coerceAndCheckDataType
    var COERCIBLE = new Set(['string', 'number', 'integer', 'boolean', 'null'])
    function coerceToTypes(types2, coerceTypes) {
      return coerceTypes
        ? types2.filter(
            (t) =>
              COERCIBLE.has(t) || (coerceTypes === 'array' && t === 'array')
          )
        : []
    }
    function coerceData(it, types2, coerceTo) {
      const { gen, data, opts } = it
      const dataType = gen.let('dataType', (0, codegen_1._)`typeof ${data}`)
      const coerced = gen.let('coerced', (0, codegen_1._)`undefined`)
      if (opts.coerceTypes === 'array') {
        gen.if(
          (0,
          codegen_1._)`${dataType} == 'object' && Array.isArray(${data}) && ${data}.length == 1`,
          () =>
            gen
              .assign(data, (0, codegen_1._)`${data}[0]`)
              .assign(dataType, (0, codegen_1._)`typeof ${data}`)
              .if(checkDataTypes(types2, data, opts.strictNumbers), () =>
                gen.assign(coerced, data)
              )
        )
      }
      gen.if((0, codegen_1._)`${coerced} !== undefined`)
      for (const t of coerceTo) {
        if (
          COERCIBLE.has(t) ||
          (t === 'array' && opts.coerceTypes === 'array')
        ) {
          coerceSpecificType(t)
        }
      }
      gen.else()
      reportTypeError(it)
      gen.endIf()
      gen.if((0, codegen_1._)`${coerced} !== undefined`, () => {
        gen.assign(data, coerced)
        assignParentData(it, coerced)
      })
      function coerceSpecificType(t) {
        switch (t) {
          case 'string':
            gen
              .elseIf(
                (0,
                codegen_1._)`${dataType} == "number" || ${dataType} == "boolean"`
              )
              .assign(coerced, (0, codegen_1._)`"" + ${data}`)
              .elseIf((0, codegen_1._)`${data} === null`)
              .assign(coerced, (0, codegen_1._)`""`)
            return
          case 'number':
            gen
              .elseIf(
                (0, codegen_1._)`${dataType} == "boolean" || ${data} === null
              || (${dataType} == "string" && ${data} && ${data} == +${data})`
              )
              .assign(coerced, (0, codegen_1._)`+${data}`)
            return
          case 'integer':
            gen
              .elseIf(
                (0, codegen_1._)`${dataType} === "boolean" || ${data} === null
              || (${dataType} === "string" && ${data} && ${data} == +${data} && !(${data} % 1))`
              )
              .assign(coerced, (0, codegen_1._)`+${data}`)
            return
          case 'boolean':
            gen
              .elseIf(
                (0,
                codegen_1._)`${data} === "false" || ${data} === 0 || ${data} === null`
              )
              .assign(coerced, false)
              .elseIf((0, codegen_1._)`${data} === "true" || ${data} === 1`)
              .assign(coerced, true)
            return
          case 'null':
            gen.elseIf(
              (0,
              codegen_1._)`${data} === "" || ${data} === 0 || ${data} === false`
            )
            gen.assign(coerced, null)
            return
          case 'array':
            gen
              .elseIf(
                (0,
                codegen_1._)`${dataType} === "string" || ${dataType} === "number"
              || ${dataType} === "boolean" || ${data} === null`
              )
              .assign(coerced, (0, codegen_1._)`[${data}]`)
        }
      }
    }
    function assignParentData({ gen, parentData, parentDataProperty }, expr) {
      gen.if((0, codegen_1._)`${parentData} !== undefined`, () =>
        gen.assign((0, codegen_1._)`${parentData}[${parentDataProperty}]`, expr)
      )
    }
    function checkDataType(
      dataType,
      data,
      strictNums,
      correct = DataType.Correct
    ) {
      const EQ =
        correct === DataType.Correct
          ? codegen_1.operators.EQ
          : codegen_1.operators.NEQ
      let cond
      switch (dataType) {
        case 'null':
          return (0, codegen_1._)`${data} ${EQ} null`
        case 'array':
          cond = (0, codegen_1._)`Array.isArray(${data})`
          break
        case 'object':
          cond = (0,
          codegen_1._)`${data} && typeof ${data} == "object" && !Array.isArray(${data})`
          break
        case 'integer':
          cond = numCond((0, codegen_1._)`!(${data} % 1) && !isNaN(${data})`)
          break
        case 'number':
          cond = numCond()
          break
        default:
          return (0, codegen_1._)`typeof ${data} ${EQ} ${dataType}`
      }
      return correct === DataType.Correct ? cond : (0, codegen_1.not)(cond)
      function numCond(_cond = codegen_1.nil) {
        return (0, codegen_1.and)(
          (0, codegen_1._)`typeof ${data} == "number"`,
          _cond,
          strictNums ? (0, codegen_1._)`isFinite(${data})` : codegen_1.nil
        )
      }
    }
    exports2.checkDataType = checkDataType
    function checkDataTypes(dataTypes, data, strictNums, correct) {
      if (dataTypes.length === 1) {
        return checkDataType(dataTypes[0], data, strictNums, correct)
      }
      let cond
      const types2 = (0, util_1.toHash)(dataTypes)
      if (types2.array && types2.object) {
        const notObj = (0, codegen_1._)`typeof ${data} != "object"`
        cond = types2.null ? notObj : (0, codegen_1._)`!${data} || ${notObj}`
        delete types2.null
        delete types2.array
        delete types2.object
      } else {
        cond = codegen_1.nil
      }
      if (types2.number) delete types2.integer
      for (const t in types2)
        cond = (0, codegen_1.and)(
          cond,
          checkDataType(t, data, strictNums, correct)
        )
      return cond
    }
    exports2.checkDataTypes = checkDataTypes
    var typeError = {
      message: ({ schema }) => `must be ${schema}`,
      params: ({ schema, schemaValue }) =>
        typeof schema == 'string'
          ? (0, codegen_1._)`{type: ${schema}}`
          : (0, codegen_1._)`{type: ${schemaValue}}`,
    }
    function reportTypeError(it) {
      const cxt = getTypeErrorContext(it)
      ;(0, errors_1.reportError)(cxt, typeError)
    }
    exports2.reportTypeError = reportTypeError
    function getTypeErrorContext(it) {
      const { gen, data, schema } = it
      const schemaCode = (0, util_1.schemaRefOrVal)(it, schema, 'type')
      return {
        gen,
        keyword: 'type',
        data,
        schema: schema.type,
        schemaCode,
        schemaValue: schemaCode,
        parentSchema: schema,
        params: {},
        it,
      }
    }
  },
})

// node_modules/ajv/dist/compile/validate/defaults.js
var require_defaults = __commonJS({
  'node_modules/ajv/dist/compile/validate/defaults.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    exports2.assignDefaults = void 0
    var codegen_1 = require_codegen()
    var util_1 = require_util()
    function assignDefaults(it, ty) {
      const { properties, items } = it.schema
      if (ty === 'object' && properties) {
        for (const key in properties) {
          assignDefault(it, key, properties[key].default)
        }
      } else if (ty === 'array' && Array.isArray(items)) {
        items.forEach((sch, i) => assignDefault(it, i, sch.default))
      }
    }
    exports2.assignDefaults = assignDefaults
    function assignDefault(it, prop, defaultValue) {
      const { gen, compositeRule, data, opts } = it
      if (defaultValue === void 0) return
      const childData = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(
        prop
      )}`
      if (compositeRule) {
        ;(0, util_1.checkStrictMode)(it, `default is ignored for: ${childData}`)
        return
      }
      let condition = (0, codegen_1._)`${childData} === undefined`
      if (opts.useDefaults === 'empty') {
        condition = (0,
        codegen_1._)`${condition} || ${childData} === null || ${childData} === ""`
      }
      gen.if(
        condition,
        (0, codegen_1._)`${childData} = ${(0, codegen_1.stringify)(
          defaultValue
        )}`
      )
    }
  },
})

// node_modules/ajv/dist/vocabularies/code.js
var require_code2 = __commonJS({
  'node_modules/ajv/dist/vocabularies/code.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    exports2.validateUnion =
      exports2.validateArray =
      exports2.usePattern =
      exports2.callValidateCode =
      exports2.schemaProperties =
      exports2.allSchemaProperties =
      exports2.noPropertyInData =
      exports2.propertyInData =
      exports2.isOwnProperty =
      exports2.hasPropFunc =
      exports2.reportMissingProp =
      exports2.checkMissingProp =
      exports2.checkReportMissingProp =
        void 0
    var codegen_1 = require_codegen()
    var util_1 = require_util()
    var names_1 = require_names()
    var util_2 = require_util()
    function checkReportMissingProp(cxt, prop) {
      const { gen, data, it } = cxt
      gen.if(noPropertyInData(gen, data, prop, it.opts.ownProperties), () => {
        cxt.setParams({ missingProperty: (0, codegen_1._)`${prop}` }, true)
        cxt.error()
      })
    }
    exports2.checkReportMissingProp = checkReportMissingProp
    function checkMissingProp(
      { gen, data, it: { opts } },
      properties,
      missing
    ) {
      return (0, codegen_1.or)(
        ...properties.map((prop) =>
          (0, codegen_1.and)(
            noPropertyInData(gen, data, prop, opts.ownProperties),
            (0, codegen_1._)`${missing} = ${prop}`
          )
        )
      )
    }
    exports2.checkMissingProp = checkMissingProp
    function reportMissingProp(cxt, missing) {
      cxt.setParams({ missingProperty: missing }, true)
      cxt.error()
    }
    exports2.reportMissingProp = reportMissingProp
    function hasPropFunc(gen) {
      return gen.scopeValue('func', {
        ref: Object.prototype.hasOwnProperty,
        code: (0, codegen_1._)`Object.prototype.hasOwnProperty`,
      })
    }
    exports2.hasPropFunc = hasPropFunc
    function isOwnProperty(gen, data, property) {
      return (0, codegen_1._)`${hasPropFunc(gen)}.call(${data}, ${property})`
    }
    exports2.isOwnProperty = isOwnProperty
    function propertyInData(gen, data, property, ownProperties) {
      const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(
        property
      )} !== undefined`
      return ownProperties
        ? (0, codegen_1._)`${cond} && ${isOwnProperty(gen, data, property)}`
        : cond
    }
    exports2.propertyInData = propertyInData
    function noPropertyInData(gen, data, property, ownProperties) {
      const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(
        property
      )} === undefined`
      return ownProperties
        ? (0, codegen_1.or)(
            cond,
            (0, codegen_1.not)(isOwnProperty(gen, data, property))
          )
        : cond
    }
    exports2.noPropertyInData = noPropertyInData
    function allSchemaProperties(schemaMap) {
      return schemaMap
        ? Object.keys(schemaMap).filter((p) => p !== '__proto__')
        : []
    }
    exports2.allSchemaProperties = allSchemaProperties
    function schemaProperties(it, schemaMap) {
      return allSchemaProperties(schemaMap).filter(
        (p) => !(0, util_1.alwaysValidSchema)(it, schemaMap[p])
      )
    }
    exports2.schemaProperties = schemaProperties
    function callValidateCode(
      {
        schemaCode,
        data,
        it: { gen, topSchemaRef, schemaPath, errorPath },
        it,
      },
      func,
      context,
      passSchema
    ) {
      const dataAndSchema = passSchema
        ? (0, codegen_1._)`${schemaCode}, ${data}, ${topSchemaRef}${schemaPath}`
        : data
      const valCxt = [
        [
          names_1.default.instancePath,
          (0, codegen_1.strConcat)(names_1.default.instancePath, errorPath),
        ],
        [names_1.default.parentData, it.parentData],
        [names_1.default.parentDataProperty, it.parentDataProperty],
        [names_1.default.rootData, names_1.default.rootData],
      ]
      if (it.opts.dynamicRef)
        valCxt.push([
          names_1.default.dynamicAnchors,
          names_1.default.dynamicAnchors,
        ])
      const args = (0, codegen_1._)`${dataAndSchema}, ${gen.object(...valCxt)}`
      return context !== codegen_1.nil
        ? (0, codegen_1._)`${func}.call(${context}, ${args})`
        : (0, codegen_1._)`${func}(${args})`
    }
    exports2.callValidateCode = callValidateCode
    var newRegExp = (0, codegen_1._)`new RegExp`
    function usePattern({ gen, it: { opts } }, pattern) {
      const u = opts.unicodeRegExp ? 'u' : ''
      const { regExp } = opts.code
      const rx = regExp(pattern, u)
      return gen.scopeValue('pattern', {
        key: rx.toString(),
        ref: rx,
        code: (0, codegen_1._)`${
          regExp.code === 'new RegExp'
            ? newRegExp
            : (0, util_2.useFunc)(gen, regExp)
        }(${pattern}, ${u})`,
      })
    }
    exports2.usePattern = usePattern
    function validateArray(cxt) {
      const { gen, data, keyword, it } = cxt
      const valid = gen.name('valid')
      if (it.allErrors) {
        const validArr = gen.let('valid', true)
        validateItems(() => gen.assign(validArr, false))
        return validArr
      }
      gen.var(valid, true)
      validateItems(() => gen.break())
      return valid
      function validateItems(notValid) {
        const len = gen.const('len', (0, codegen_1._)`${data}.length`)
        gen.forRange('i', 0, len, (i) => {
          cxt.subschema(
            {
              keyword,
              dataProp: i,
              dataPropType: util_1.Type.Num,
            },
            valid
          )
          gen.if((0, codegen_1.not)(valid), notValid)
        })
      }
    }
    exports2.validateArray = validateArray
    function validateUnion(cxt) {
      const { gen, schema, keyword, it } = cxt
      if (!Array.isArray(schema)) throw new Error('ajv implementation error')
      const alwaysValid = schema.some((sch) =>
        (0, util_1.alwaysValidSchema)(it, sch)
      )
      if (alwaysValid && !it.opts.unevaluated) return
      const valid = gen.let('valid', false)
      const schValid = gen.name('_valid')
      gen.block(() =>
        schema.forEach((_sch, i) => {
          const schCxt = cxt.subschema(
            {
              keyword,
              schemaProp: i,
              compositeRule: true,
            },
            schValid
          )
          gen.assign(valid, (0, codegen_1._)`${valid} || ${schValid}`)
          const merged = cxt.mergeValidEvaluated(schCxt, schValid)
          if (!merged) gen.if((0, codegen_1.not)(valid))
        })
      )
      cxt.result(
        valid,
        () => cxt.reset(),
        () => cxt.error(true)
      )
    }
    exports2.validateUnion = validateUnion
  },
})

// node_modules/ajv/dist/compile/validate/keyword.js
var require_keyword = __commonJS({
  'node_modules/ajv/dist/compile/validate/keyword.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    exports2.validateKeywordUsage =
      exports2.validSchemaType =
      exports2.funcKeywordCode =
      exports2.macroKeywordCode =
        void 0
    var codegen_1 = require_codegen()
    var names_1 = require_names()
    var code_1 = require_code2()
    var errors_1 = require_errors()
    function macroKeywordCode(cxt, def) {
      const { gen, keyword, schema, parentSchema, it } = cxt
      const macroSchema = def.macro.call(it.self, schema, parentSchema, it)
      const schemaRef = useKeyword(gen, keyword, macroSchema)
      if (it.opts.validateSchema !== false)
        it.self.validateSchema(macroSchema, true)
      const valid = gen.name('valid')
      cxt.subschema(
        {
          schema: macroSchema,
          schemaPath: codegen_1.nil,
          errSchemaPath: `${it.errSchemaPath}/${keyword}`,
          topSchemaRef: schemaRef,
          compositeRule: true,
        },
        valid
      )
      cxt.pass(valid, () => cxt.error(true))
    }
    exports2.macroKeywordCode = macroKeywordCode
    function funcKeywordCode(cxt, def) {
      var _a
      const { gen, keyword, schema, parentSchema, $data, it } = cxt
      checkAsyncKeyword(it, def)
      const validate2 =
        !$data && def.compile
          ? def.compile.call(it.self, schema, parentSchema, it)
          : def.validate
      const validateRef = useKeyword(gen, keyword, validate2)
      const valid = gen.let('valid')
      cxt.block$data(valid, validateKeyword)
      cxt.ok((_a = def.valid) !== null && _a !== void 0 ? _a : valid)
      function validateKeyword() {
        if (def.errors === false) {
          assignValid()
          if (def.modifying) modifyData(cxt)
          reportErrs(() => cxt.error())
        } else {
          const ruleErrs = def.async ? validateAsync() : validateSync()
          if (def.modifying) modifyData(cxt)
          reportErrs(() => addErrs(cxt, ruleErrs))
        }
      }
      function validateAsync() {
        const ruleErrs = gen.let('ruleErrs', null)
        gen.try(
          () => assignValid((0, codegen_1._)`await `),
          (e) =>
            gen.assign(valid, false).if(
              (0, codegen_1._)`${e} instanceof ${it.ValidationError}`,
              () => gen.assign(ruleErrs, (0, codegen_1._)`${e}.errors`),
              () => gen.throw(e)
            )
        )
        return ruleErrs
      }
      function validateSync() {
        const validateErrs = (0, codegen_1._)`${validateRef}.errors`
        gen.assign(validateErrs, null)
        assignValid(codegen_1.nil)
        return validateErrs
      }
      function assignValid(
        _await = def.async ? (0, codegen_1._)`await ` : codegen_1.nil
      ) {
        const passCxt = it.opts.passContext
          ? names_1.default.this
          : names_1.default.self
        const passSchema = !(
          ('compile' in def && !$data) ||
          def.schema === false
        )
        gen.assign(
          valid,
          (0, codegen_1._)`${_await}${(0, code_1.callValidateCode)(
            cxt,
            validateRef,
            passCxt,
            passSchema
          )}`,
          def.modifying
        )
      }
      function reportErrs(errors) {
        var _a2
        gen.if(
          (0, codegen_1.not)(
            (_a2 = def.valid) !== null && _a2 !== void 0 ? _a2 : valid
          ),
          errors
        )
      }
    }
    exports2.funcKeywordCode = funcKeywordCode
    function modifyData(cxt) {
      const { gen, data, it } = cxt
      gen.if(it.parentData, () =>
        gen.assign(
          data,
          (0, codegen_1._)`${it.parentData}[${it.parentDataProperty}]`
        )
      )
    }
    function addErrs(cxt, errs) {
      const { gen } = cxt
      gen.if(
        (0, codegen_1._)`Array.isArray(${errs})`,
        () => {
          gen
            .assign(
              names_1.default.vErrors,
              (0,
              codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`
            )
            .assign(
              names_1.default.errors,
              (0, codegen_1._)`${names_1.default.vErrors}.length`
            )
          ;(0, errors_1.extendErrors)(cxt)
        },
        () => cxt.error()
      )
    }
    function checkAsyncKeyword({ schemaEnv }, def) {
      if (def.async && !schemaEnv.$async)
        throw new Error('async keyword in sync schema')
    }
    function useKeyword(gen, keyword, result) {
      if (result === void 0)
        throw new Error(`keyword "${keyword}" failed to compile`)
      return gen.scopeValue(
        'keyword',
        typeof result == 'function'
          ? { ref: result }
          : { ref: result, code: (0, codegen_1.stringify)(result) }
      )
    }
    function validSchemaType(schema, schemaType, allowUndefined = false) {
      return (
        !schemaType.length ||
        schemaType.some((st) =>
          st === 'array'
            ? Array.isArray(schema)
            : st === 'object'
            ? schema && typeof schema == 'object' && !Array.isArray(schema)
            : typeof schema == st ||
              (allowUndefined && typeof schema == 'undefined')
        )
      )
    }
    exports2.validSchemaType = validSchemaType
    function validateKeywordUsage(
      { schema, opts, self: self2, errSchemaPath },
      def,
      keyword
    ) {
      if (
        Array.isArray(def.keyword)
          ? !def.keyword.includes(keyword)
          : def.keyword !== keyword
      ) {
        throw new Error('ajv implementation error')
      }
      const deps = def.dependencies
      if (
        deps === null || deps === void 0
          ? void 0
          : deps.some(
              (kwd) => !Object.prototype.hasOwnProperty.call(schema, kwd)
            )
      ) {
        throw new Error(
          `parent schema must have dependencies of ${keyword}: ${deps.join(
            ','
          )}`
        )
      }
      if (def.validateSchema) {
        const valid = def.validateSchema(schema[keyword])
        if (!valid) {
          const msg =
            `keyword "${keyword}" value is invalid at path "${errSchemaPath}": ` +
            self2.errorsText(def.validateSchema.errors)
          if (opts.validateSchema === 'log') self2.logger.error(msg)
          else throw new Error(msg)
        }
      }
    }
    exports2.validateKeywordUsage = validateKeywordUsage
  },
})

// node_modules/ajv/dist/compile/validate/subschema.js
var require_subschema = __commonJS({
  'node_modules/ajv/dist/compile/validate/subschema.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    exports2.extendSubschemaMode =
      exports2.extendSubschemaData =
      exports2.getSubschema =
        void 0
    var codegen_1 = require_codegen()
    var util_1 = require_util()
    function getSubschema(
      it,
      { keyword, schemaProp, schema, schemaPath, errSchemaPath, topSchemaRef }
    ) {
      if (keyword !== void 0 && schema !== void 0) {
        throw new Error('both "keyword" and "schema" passed, only one allowed')
      }
      if (keyword !== void 0) {
        const sch = it.schema[keyword]
        return schemaProp === void 0
          ? {
              schema: sch,
              schemaPath: (0, codegen_1._)`${it.schemaPath}${(0,
              codegen_1.getProperty)(keyword)}`,
              errSchemaPath: `${it.errSchemaPath}/${keyword}`,
            }
          : {
              schema: sch[schemaProp],
              schemaPath: (0, codegen_1._)`${it.schemaPath}${(0,
              codegen_1.getProperty)(keyword)}${(0, codegen_1.getProperty)(
                schemaProp
              )}`,
              errSchemaPath: `${it.errSchemaPath}/${keyword}/${(0,
              util_1.escapeFragment)(schemaProp)}`,
            }
      }
      if (schema !== void 0) {
        if (
          schemaPath === void 0 ||
          errSchemaPath === void 0 ||
          topSchemaRef === void 0
        ) {
          throw new Error(
            '"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"'
          )
        }
        return {
          schema,
          schemaPath,
          topSchemaRef,
          errSchemaPath,
        }
      }
      throw new Error('either "keyword" or "schema" must be passed')
    }
    exports2.getSubschema = getSubschema
    function extendSubschemaData(
      subschema,
      it,
      { dataProp, dataPropType: dpType, data, dataTypes, propertyName }
    ) {
      if (data !== void 0 && dataProp !== void 0) {
        throw new Error('both "data" and "dataProp" passed, only one allowed')
      }
      const { gen } = it
      if (dataProp !== void 0) {
        const { errorPath, dataPathArr, opts } = it
        const nextData = gen.let(
          'data',
          (0, codegen_1._)`${it.data}${(0, codegen_1.getProperty)(dataProp)}`,
          true
        )
        dataContextProps(nextData)
        subschema.errorPath = (0, codegen_1.str)`${errorPath}${(0,
        util_1.getErrorPath)(dataProp, dpType, opts.jsPropertySyntax)}`
        subschema.parentDataProperty = (0, codegen_1._)`${dataProp}`
        subschema.dataPathArr = [...dataPathArr, subschema.parentDataProperty]
      }
      if (data !== void 0) {
        const nextData =
          data instanceof codegen_1.Name ? data : gen.let('data', data, true)
        dataContextProps(nextData)
        if (propertyName !== void 0) subschema.propertyName = propertyName
      }
      if (dataTypes) subschema.dataTypes = dataTypes
      function dataContextProps(_nextData) {
        subschema.data = _nextData
        subschema.dataLevel = it.dataLevel + 1
        subschema.dataTypes = []
        it.definedProperties = new Set()
        subschema.parentData = it.data
        subschema.dataNames = [...it.dataNames, _nextData]
      }
    }
    exports2.extendSubschemaData = extendSubschemaData
    function extendSubschemaMode(
      subschema,
      { jtdDiscriminator, jtdMetadata, compositeRule, createErrors, allErrors }
    ) {
      if (compositeRule !== void 0) subschema.compositeRule = compositeRule
      if (createErrors !== void 0) subschema.createErrors = createErrors
      if (allErrors !== void 0) subschema.allErrors = allErrors
      subschema.jtdDiscriminator = jtdDiscriminator
      subschema.jtdMetadata = jtdMetadata
    }
    exports2.extendSubschemaMode = extendSubschemaMode
  },
})

// node_modules/fast-deep-equal/index.js
var require_fast_deep_equal = __commonJS({
  'node_modules/fast-deep-equal/index.js'(exports2, module2) {
    'use strict'
    module2.exports = function equal(a, b) {
      if (a === b) return true
      if (a && b && typeof a == 'object' && typeof b == 'object') {
        if (a.constructor !== b.constructor) return false
        var length2, i, keys
        if (Array.isArray(a)) {
          length2 = a.length
          if (length2 != b.length) return false
          for (i = length2; i-- !== 0; ) if (!equal(a[i], b[i])) return false
          return true
        }
        if (a.constructor === RegExp)
          return a.source === b.source && a.flags === b.flags
        if (a.valueOf !== Object.prototype.valueOf)
          return a.valueOf() === b.valueOf()
        if (a.toString !== Object.prototype.toString)
          return a.toString() === b.toString()
        keys = Object.keys(a)
        length2 = keys.length
        if (length2 !== Object.keys(b).length) return false
        for (i = length2; i-- !== 0; )
          if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false
        for (i = length2; i-- !== 0; ) {
          var key = keys[i]
          if (!equal(a[key], b[key])) return false
        }
        return true
      }
      return a !== a && b !== b
    }
  },
})

// node_modules/json-schema-traverse/index.js
var require_json_schema_traverse = __commonJS({
  'node_modules/json-schema-traverse/index.js'(exports2, module2) {
    'use strict'
    var traverse = (module2.exports = function (schema, opts, cb) {
      if (typeof opts == 'function') {
        cb = opts
        opts = {}
      }
      cb = opts.cb || cb
      var pre = typeof cb == 'function' ? cb : cb.pre || function () {}
      var post = cb.post || function () {}
      _traverse(opts, pre, post, schema, '', schema)
    })
    traverse.keywords = {
      additionalItems: true,
      items: true,
      contains: true,
      additionalProperties: true,
      propertyNames: true,
      not: true,
      if: true,
      then: true,
      else: true,
    }
    traverse.arrayKeywords = {
      items: true,
      allOf: true,
      anyOf: true,
      oneOf: true,
    }
    traverse.propsKeywords = {
      $defs: true,
      definitions: true,
      properties: true,
      patternProperties: true,
      dependencies: true,
    }
    traverse.skipKeywords = {
      default: true,
      enum: true,
      const: true,
      required: true,
      maximum: true,
      minimum: true,
      exclusiveMaximum: true,
      exclusiveMinimum: true,
      multipleOf: true,
      maxLength: true,
      minLength: true,
      pattern: true,
      format: true,
      maxItems: true,
      minItems: true,
      uniqueItems: true,
      maxProperties: true,
      minProperties: true,
    }
    function _traverse(
      opts,
      pre,
      post,
      schema,
      jsonPtr,
      rootSchema,
      parentJsonPtr,
      parentKeyword,
      parentSchema,
      keyIndex
    ) {
      if (schema && typeof schema == 'object' && !Array.isArray(schema)) {
        pre(
          schema,
          jsonPtr,
          rootSchema,
          parentJsonPtr,
          parentKeyword,
          parentSchema,
          keyIndex
        )
        for (var key in schema) {
          var sch = schema[key]
          if (Array.isArray(sch)) {
            if (key in traverse.arrayKeywords) {
              for (var i = 0; i < sch.length; i++)
                _traverse(
                  opts,
                  pre,
                  post,
                  sch[i],
                  jsonPtr + '/' + key + '/' + i,
                  rootSchema,
                  jsonPtr,
                  key,
                  schema,
                  i
                )
            }
          } else if (key in traverse.propsKeywords) {
            if (sch && typeof sch == 'object') {
              for (var prop in sch)
                _traverse(
                  opts,
                  pre,
                  post,
                  sch[prop],
                  jsonPtr + '/' + key + '/' + escapeJsonPtr(prop),
                  rootSchema,
                  jsonPtr,
                  key,
                  schema,
                  prop
                )
            }
          } else if (
            key in traverse.keywords ||
            (opts.allKeys && !(key in traverse.skipKeywords))
          ) {
            _traverse(
              opts,
              pre,
              post,
              sch,
              jsonPtr + '/' + key,
              rootSchema,
              jsonPtr,
              key,
              schema
            )
          }
        }
        post(
          schema,
          jsonPtr,
          rootSchema,
          parentJsonPtr,
          parentKeyword,
          parentSchema,
          keyIndex
        )
      }
    }
    function escapeJsonPtr(str) {
      return str.replace(/~/g, '~0').replace(/\//g, '~1')
    }
  },
})

// node_modules/ajv/dist/compile/resolve.js
var require_resolve = __commonJS({
  'node_modules/ajv/dist/compile/resolve.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    exports2.getSchemaRefs =
      exports2.resolveUrl =
      exports2.normalizeId =
      exports2._getFullPath =
      exports2.getFullPath =
      exports2.inlineRef =
        void 0
    var util_1 = require_util()
    var equal = require_fast_deep_equal()
    var traverse = require_json_schema_traverse()
    var SIMPLE_INLINED = new Set([
      'type',
      'format',
      'pattern',
      'maxLength',
      'minLength',
      'maxProperties',
      'minProperties',
      'maxItems',
      'minItems',
      'maximum',
      'minimum',
      'uniqueItems',
      'multipleOf',
      'required',
      'enum',
      'const',
    ])
    function inlineRef(schema, limit = true) {
      if (typeof schema == 'boolean') return true
      if (limit === true) return !hasRef(schema)
      if (!limit) return false
      return countKeys(schema) <= limit
    }
    exports2.inlineRef = inlineRef
    var REF_KEYWORDS = new Set([
      '$ref',
      '$recursiveRef',
      '$recursiveAnchor',
      '$dynamicRef',
      '$dynamicAnchor',
    ])
    function hasRef(schema) {
      for (const key in schema) {
        if (REF_KEYWORDS.has(key)) return true
        const sch = schema[key]
        if (Array.isArray(sch) && sch.some(hasRef)) return true
        if (typeof sch == 'object' && hasRef(sch)) return true
      }
      return false
    }
    function countKeys(schema) {
      let count = 0
      for (const key in schema) {
        if (key === '$ref') return Infinity
        count++
        if (SIMPLE_INLINED.has(key)) continue
        if (typeof schema[key] == 'object') {
          ;(0, util_1.eachItem)(schema[key], (sch) => (count += countKeys(sch)))
        }
        if (count === Infinity) return Infinity
      }
      return count
    }
    function getFullPath(resolver, id = '', normalize) {
      if (normalize !== false) id = normalizeId(id)
      const p = resolver.parse(id)
      return _getFullPath(resolver, p)
    }
    exports2.getFullPath = getFullPath
    function _getFullPath(resolver, p) {
      const serialized = resolver.serialize(p)
      return serialized.split('#')[0] + '#'
    }
    exports2._getFullPath = _getFullPath
    var TRAILING_SLASH_HASH = /#\/?$/
    function normalizeId(id) {
      return id ? id.replace(TRAILING_SLASH_HASH, '') : ''
    }
    exports2.normalizeId = normalizeId
    function resolveUrl(resolver, baseId, id) {
      id = normalizeId(id)
      return resolver.resolve(baseId, id)
    }
    exports2.resolveUrl = resolveUrl
    var ANCHOR = /^[a-z_][-a-z0-9._]*$/i
    function getSchemaRefs(schema, baseId) {
      if (typeof schema == 'boolean') return {}
      const { schemaId, uriResolver } = this.opts
      const schId = normalizeId(schema[schemaId] || baseId)
      const baseIds = { '': schId }
      const pathPrefix = getFullPath(uriResolver, schId, false)
      const localRefs = {}
      const schemaRefs = new Set()
      traverse(schema, { allKeys: true }, (sch, jsonPtr, _, parentJsonPtr) => {
        if (parentJsonPtr === void 0) return
        const fullPath = pathPrefix + jsonPtr
        let baseId2 = baseIds[parentJsonPtr]
        if (typeof sch[schemaId] == 'string')
          baseId2 = addRef.call(this, sch[schemaId])
        addAnchor.call(this, sch.$anchor)
        addAnchor.call(this, sch.$dynamicAnchor)
        baseIds[jsonPtr] = baseId2
        function addRef(ref) {
          const _resolve = this.opts.uriResolver.resolve
          ref = normalizeId(baseId2 ? _resolve(baseId2, ref) : ref)
          if (schemaRefs.has(ref)) throw ambiguos(ref)
          schemaRefs.add(ref)
          let schOrRef = this.refs[ref]
          if (typeof schOrRef == 'string') schOrRef = this.refs[schOrRef]
          if (typeof schOrRef == 'object') {
            checkAmbiguosRef(sch, schOrRef.schema, ref)
          } else if (ref !== normalizeId(fullPath)) {
            if (ref[0] === '#') {
              checkAmbiguosRef(sch, localRefs[ref], ref)
              localRefs[ref] = sch
            } else {
              this.refs[ref] = fullPath
            }
          }
          return ref
        }
        function addAnchor(anchor) {
          if (typeof anchor == 'string') {
            if (!ANCHOR.test(anchor))
              throw new Error(`invalid anchor "${anchor}"`)
            addRef.call(this, `#${anchor}`)
          }
        }
      })
      return localRefs
      function checkAmbiguosRef(sch1, sch2, ref) {
        if (sch2 !== void 0 && !equal(sch1, sch2)) throw ambiguos(ref)
      }
      function ambiguos(ref) {
        return new Error(`reference "${ref}" resolves to more than one schema`)
      }
    }
    exports2.getSchemaRefs = getSchemaRefs
  },
})

// node_modules/ajv/dist/compile/validate/index.js
var require_validate = __commonJS({
  'node_modules/ajv/dist/compile/validate/index.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    exports2.getData =
      exports2.KeywordCxt =
      exports2.validateFunctionCode =
        void 0
    var boolSchema_1 = require_boolSchema()
    var dataType_1 = require_dataType()
    var applicability_1 = require_applicability()
    var dataType_2 = require_dataType()
    var defaults_1 = require_defaults()
    var keyword_1 = require_keyword()
    var subschema_1 = require_subschema()
    var codegen_1 = require_codegen()
    var names_1 = require_names()
    var resolve_1 = require_resolve()
    var util_1 = require_util()
    var errors_1 = require_errors()
    function validateFunctionCode(it) {
      if (isSchemaObj(it)) {
        checkKeywords(it)
        if (schemaCxtHasRules(it)) {
          topSchemaObjCode(it)
          return
        }
      }
      validateFunction(it, () => (0, boolSchema_1.topBoolOrEmptySchema)(it))
    }
    exports2.validateFunctionCode = validateFunctionCode
    function validateFunction(
      { gen, validateName, schema, schemaEnv, opts },
      body
    ) {
      if (opts.code.es5) {
        gen.func(
          validateName,
          (0, codegen_1._)`${names_1.default.data}, ${names_1.default.valCxt}`,
          schemaEnv.$async,
          () => {
            gen.code(
              (0, codegen_1._)`"use strict"; ${funcSourceUrl(schema, opts)}`
            )
            destructureValCxtES5(gen, opts)
            gen.code(body)
          }
        )
      } else {
        gen.func(
          validateName,
          (0, codegen_1._)`${names_1.default.data}, ${destructureValCxt(opts)}`,
          schemaEnv.$async,
          () => gen.code(funcSourceUrl(schema, opts)).code(body)
        )
      }
    }
    function destructureValCxt(opts) {
      return (0, codegen_1._)`{${names_1.default.instancePath}="", ${
        names_1.default.parentData
      }, ${names_1.default.parentDataProperty}, ${names_1.default.rootData}=${
        names_1.default.data
      }${
        opts.dynamicRef
          ? (0, codegen_1._)`, ${names_1.default.dynamicAnchors}={}`
          : codegen_1.nil
      }}={}`
    }
    function destructureValCxtES5(gen, opts) {
      gen.if(
        names_1.default.valCxt,
        () => {
          gen.var(
            names_1.default.instancePath,
            (0,
            codegen_1._)`${names_1.default.valCxt}.${names_1.default.instancePath}`
          )
          gen.var(
            names_1.default.parentData,
            (0,
            codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentData}`
          )
          gen.var(
            names_1.default.parentDataProperty,
            (0,
            codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentDataProperty}`
          )
          gen.var(
            names_1.default.rootData,
            (0,
            codegen_1._)`${names_1.default.valCxt}.${names_1.default.rootData}`
          )
          if (opts.dynamicRef)
            gen.var(
              names_1.default.dynamicAnchors,
              (0,
              codegen_1._)`${names_1.default.valCxt}.${names_1.default.dynamicAnchors}`
            )
        },
        () => {
          gen.var(names_1.default.instancePath, (0, codegen_1._)`""`)
          gen.var(names_1.default.parentData, (0, codegen_1._)`undefined`)
          gen.var(
            names_1.default.parentDataProperty,
            (0, codegen_1._)`undefined`
          )
          gen.var(names_1.default.rootData, names_1.default.data)
          if (opts.dynamicRef)
            gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`{}`)
        }
      )
    }
    function topSchemaObjCode(it) {
      const { schema, opts, gen } = it
      validateFunction(it, () => {
        if (opts.$comment && schema.$comment) commentKeyword(it)
        checkNoDefault(it)
        gen.let(names_1.default.vErrors, null)
        gen.let(names_1.default.errors, 0)
        if (opts.unevaluated) resetEvaluated(it)
        typeAndKeywords(it)
        returnResults(it)
      })
      return
    }
    function resetEvaluated(it) {
      const { gen, validateName } = it
      it.evaluated = gen.const(
        'evaluated',
        (0, codegen_1._)`${validateName}.evaluated`
      )
      gen.if((0, codegen_1._)`${it.evaluated}.dynamicProps`, () =>
        gen.assign(
          (0, codegen_1._)`${it.evaluated}.props`,
          (0, codegen_1._)`undefined`
        )
      )
      gen.if((0, codegen_1._)`${it.evaluated}.dynamicItems`, () =>
        gen.assign(
          (0, codegen_1._)`${it.evaluated}.items`,
          (0, codegen_1._)`undefined`
        )
      )
    }
    function funcSourceUrl(schema, opts) {
      const schId = typeof schema == 'object' && schema[opts.schemaId]
      return schId && (opts.code.source || opts.code.process)
        ? (0, codegen_1._)`/*# sourceURL=${schId} */`
        : codegen_1.nil
    }
    function subschemaCode(it, valid) {
      if (isSchemaObj(it)) {
        checkKeywords(it)
        if (schemaCxtHasRules(it)) {
          subSchemaObjCode(it, valid)
          return
        }
      }
      ;(0, boolSchema_1.boolOrEmptySchema)(it, valid)
    }
    function schemaCxtHasRules({ schema, self: self2 }) {
      if (typeof schema == 'boolean') return !schema
      for (const key in schema) if (self2.RULES.all[key]) return true
      return false
    }
    function isSchemaObj(it) {
      return typeof it.schema != 'boolean'
    }
    function subSchemaObjCode(it, valid) {
      const { schema, gen, opts } = it
      if (opts.$comment && schema.$comment) commentKeyword(it)
      updateContext(it)
      checkAsyncSchema(it)
      const errsCount = gen.const('_errs', names_1.default.errors)
      typeAndKeywords(it, errsCount)
      gen.var(
        valid,
        (0, codegen_1._)`${errsCount} === ${names_1.default.errors}`
      )
    }
    function checkKeywords(it) {
      ;(0, util_1.checkUnknownRules)(it)
      checkRefsAndKeywords(it)
    }
    function typeAndKeywords(it, errsCount) {
      if (it.opts.jtd) return schemaKeywords(it, [], false, errsCount)
      const types2 = (0, dataType_1.getSchemaTypes)(it.schema)
      const checkedTypes = (0, dataType_1.coerceAndCheckDataType)(it, types2)
      schemaKeywords(it, types2, !checkedTypes, errsCount)
    }
    function checkRefsAndKeywords(it) {
      const { schema, errSchemaPath, opts, self: self2 } = it
      if (
        schema.$ref &&
        opts.ignoreKeywordsWithRef &&
        (0, util_1.schemaHasRulesButRef)(schema, self2.RULES)
      ) {
        self2.logger.warn(
          `$ref: keywords ignored in schema at path "${errSchemaPath}"`
        )
      }
    }
    function checkNoDefault(it) {
      const { schema, opts } = it
      if (schema.default !== void 0 && opts.useDefaults && opts.strictSchema) {
        ;(0, util_1.checkStrictMode)(
          it,
          'default is ignored in the schema root'
        )
      }
    }
    function updateContext(it) {
      const schId = it.schema[it.opts.schemaId]
      if (schId)
        it.baseId = (0, resolve_1.resolveUrl)(
          it.opts.uriResolver,
          it.baseId,
          schId
        )
    }
    function checkAsyncSchema(it) {
      if (it.schema.$async && !it.schemaEnv.$async)
        throw new Error('async schema in sync schema')
    }
    function commentKeyword({ gen, schemaEnv, schema, errSchemaPath, opts }) {
      const msg = schema.$comment
      if (opts.$comment === true) {
        gen.code((0, codegen_1._)`${names_1.default.self}.logger.log(${msg})`)
      } else if (typeof opts.$comment == 'function') {
        const schemaPath = (0, codegen_1.str)`${errSchemaPath}/$comment`
        const rootName = gen.scopeValue('root', { ref: schemaEnv.root })
        gen.code(
          (0,
          codegen_1._)`${names_1.default.self}.opts.$comment(${msg}, ${schemaPath}, ${rootName}.schema)`
        )
      }
    }
    function returnResults(it) {
      const {
        gen,
        schemaEnv,
        validateName,
        ValidationError: ValidationError2,
        opts,
      } = it
      if (schemaEnv.$async) {
        gen.if(
          (0, codegen_1._)`${names_1.default.errors} === 0`,
          () => gen.return(names_1.default.data),
          () =>
            gen.throw(
              (0,
              codegen_1._)`new ${ValidationError2}(${names_1.default.vErrors})`
            )
        )
      } else {
        gen.assign(
          (0, codegen_1._)`${validateName}.errors`,
          names_1.default.vErrors
        )
        if (opts.unevaluated) assignEvaluated(it)
        gen.return((0, codegen_1._)`${names_1.default.errors} === 0`)
      }
    }
    function assignEvaluated({ gen, evaluated, props, items }) {
      if (props instanceof codegen_1.Name)
        gen.assign((0, codegen_1._)`${evaluated}.props`, props)
      if (items instanceof codegen_1.Name)
        gen.assign((0, codegen_1._)`${evaluated}.items`, items)
    }
    function schemaKeywords(it, types2, typeErrors, errsCount) {
      const { gen, schema, data, allErrors, opts, self: self2 } = it
      const { RULES } = self2
      if (
        schema.$ref &&
        (opts.ignoreKeywordsWithRef ||
          !(0, util_1.schemaHasRulesButRef)(schema, RULES))
      ) {
        gen.block(() => keywordCode(it, '$ref', RULES.all.$ref.definition))
        return
      }
      if (!opts.jtd) checkStrictTypes(it, types2)
      gen.block(() => {
        for (const group of RULES.rules) groupKeywords(group)
        groupKeywords(RULES.post)
      })
      function groupKeywords(group) {
        if (!(0, applicability_1.shouldUseGroup)(schema, group)) return
        if (group.type) {
          gen.if(
            (0, dataType_2.checkDataType)(group.type, data, opts.strictNumbers)
          )
          iterateKeywords(it, group)
          if (types2.length === 1 && types2[0] === group.type && typeErrors) {
            gen.else()
            ;(0, dataType_2.reportTypeError)(it)
          }
          gen.endIf()
        } else {
          iterateKeywords(it, group)
        }
        if (!allErrors)
          gen.if(
            (0, codegen_1._)`${names_1.default.errors} === ${errsCount || 0}`
          )
      }
    }
    function iterateKeywords(it, group) {
      const {
        gen,
        schema,
        opts: { useDefaults },
      } = it
      if (useDefaults) (0, defaults_1.assignDefaults)(it, group.type)
      gen.block(() => {
        for (const rule of group.rules) {
          if ((0, applicability_1.shouldUseRule)(schema, rule)) {
            keywordCode(it, rule.keyword, rule.definition, group.type)
          }
        }
      })
    }
    function checkStrictTypes(it, types2) {
      if (it.schemaEnv.meta || !it.opts.strictTypes) return
      checkContextTypes(it, types2)
      if (!it.opts.allowUnionTypes) checkMultipleTypes(it, types2)
      checkKeywordTypes(it, it.dataTypes)
    }
    function checkContextTypes(it, types2) {
      if (!types2.length) return
      if (!it.dataTypes.length) {
        it.dataTypes = types2
        return
      }
      types2.forEach((t) => {
        if (!includesType(it.dataTypes, t)) {
          strictTypesError(
            it,
            `type "${t}" not allowed by context "${it.dataTypes.join(',')}"`
          )
        }
      })
      it.dataTypes = it.dataTypes.filter((t) => includesType(types2, t))
    }
    function checkMultipleTypes(it, ts) {
      if (ts.length > 1 && !(ts.length === 2 && ts.includes('null'))) {
        strictTypesError(it, 'use allowUnionTypes to allow union type keyword')
      }
    }
    function checkKeywordTypes(it, ts) {
      const rules = it.self.RULES.all
      for (const keyword in rules) {
        const rule = rules[keyword]
        if (
          typeof rule == 'object' &&
          (0, applicability_1.shouldUseRule)(it.schema, rule)
        ) {
          const { type } = rule.definition
          if (type.length && !type.some((t) => hasApplicableType(ts, t))) {
            strictTypesError(
              it,
              `missing type "${type.join(',')}" for keyword "${keyword}"`
            )
          }
        }
      }
    }
    function hasApplicableType(schTs, kwdT) {
      return (
        schTs.includes(kwdT) || (kwdT === 'number' && schTs.includes('integer'))
      )
    }
    function includesType(ts, t) {
      return ts.includes(t) || (t === 'integer' && ts.includes('number'))
    }
    function strictTypesError(it, msg) {
      const schemaPath = it.schemaEnv.baseId + it.errSchemaPath
      msg += ` at "${schemaPath}" (strictTypes)`
      ;(0, util_1.checkStrictMode)(it, msg, it.opts.strictTypes)
    }
    var KeywordCxt = class {
      constructor(it, def, keyword) {
        ;(0, keyword_1.validateKeywordUsage)(it, def, keyword)
        this.gen = it.gen
        this.allErrors = it.allErrors
        this.keyword = keyword
        this.data = it.data
        this.schema = it.schema[keyword]
        this.$data =
          def.$data && it.opts.$data && this.schema && this.schema.$data
        this.schemaValue = (0, util_1.schemaRefOrVal)(
          it,
          this.schema,
          keyword,
          this.$data
        )
        this.schemaType = def.schemaType
        this.parentSchema = it.schema
        this.params = {}
        this.it = it
        this.def = def
        if (this.$data) {
          this.schemaCode = it.gen.const('vSchema', getData(this.$data, it))
        } else {
          this.schemaCode = this.schemaValue
          if (
            !(0, keyword_1.validSchemaType)(
              this.schema,
              def.schemaType,
              def.allowUndefined
            )
          ) {
            throw new Error(
              `${keyword} value must be ${JSON.stringify(def.schemaType)}`
            )
          }
        }
        if ('code' in def ? def.trackErrors : def.errors !== false) {
          this.errsCount = it.gen.const('_errs', names_1.default.errors)
        }
      }
      result(condition, successAction, failAction) {
        this.failResult(
          (0, codegen_1.not)(condition),
          successAction,
          failAction
        )
      }
      failResult(condition, successAction, failAction) {
        this.gen.if(condition)
        if (failAction) failAction()
        else this.error()
        if (successAction) {
          this.gen.else()
          successAction()
          if (this.allErrors) this.gen.endIf()
        } else {
          if (this.allErrors) this.gen.endIf()
          else this.gen.else()
        }
      }
      pass(condition, failAction) {
        this.failResult((0, codegen_1.not)(condition), void 0, failAction)
      }
      fail(condition) {
        if (condition === void 0) {
          this.error()
          if (!this.allErrors) this.gen.if(false)
          return
        }
        this.gen.if(condition)
        this.error()
        if (this.allErrors) this.gen.endIf()
        else this.gen.else()
      }
      fail$data(condition) {
        if (!this.$data) return this.fail(condition)
        const { schemaCode } = this
        this.fail(
          (0, codegen_1._)`${schemaCode} !== undefined && (${(0, codegen_1.or)(
            this.invalid$data(),
            condition
          )})`
        )
      }
      error(append, errorParams, errorPaths) {
        if (errorParams) {
          this.setParams(errorParams)
          this._error(append, errorPaths)
          this.setParams({})
          return
        }
        this._error(append, errorPaths)
      }
      _error(append, errorPaths) {
        ;(append ? errors_1.reportExtraError : errors_1.reportError)(
          this,
          this.def.error,
          errorPaths
        )
      }
      $dataError() {
        ;(0, errors_1.reportError)(
          this,
          this.def.$dataError || errors_1.keyword$DataError
        )
      }
      reset() {
        if (this.errsCount === void 0)
          throw new Error('add "trackErrors" to keyword definition')
        ;(0, errors_1.resetErrorsCount)(this.gen, this.errsCount)
      }
      ok(cond) {
        if (!this.allErrors) this.gen.if(cond)
      }
      setParams(obj, assign) {
        if (assign) Object.assign(this.params, obj)
        else this.params = obj
      }
      block$data(valid, codeBlock, $dataValid = codegen_1.nil) {
        this.gen.block(() => {
          this.check$data(valid, $dataValid)
          codeBlock()
        })
      }
      check$data(valid = codegen_1.nil, $dataValid = codegen_1.nil) {
        if (!this.$data) return
        const { gen, schemaCode, schemaType, def } = this
        gen.if(
          (0, codegen_1.or)(
            (0, codegen_1._)`${schemaCode} === undefined`,
            $dataValid
          )
        )
        if (valid !== codegen_1.nil) gen.assign(valid, true)
        if (schemaType.length || def.validateSchema) {
          gen.elseIf(this.invalid$data())
          this.$dataError()
          if (valid !== codegen_1.nil) gen.assign(valid, false)
        }
        gen.else()
      }
      invalid$data() {
        const { gen, schemaCode, schemaType, def, it } = this
        return (0, codegen_1.or)(wrong$DataType(), invalid$DataSchema())
        function wrong$DataType() {
          if (schemaType.length) {
            if (!(schemaCode instanceof codegen_1.Name))
              throw new Error('ajv implementation error')
            const st = Array.isArray(schemaType) ? schemaType : [schemaType]
            return (0, codegen_1._)`${(0, dataType_2.checkDataTypes)(
              st,
              schemaCode,
              it.opts.strictNumbers,
              dataType_2.DataType.Wrong
            )}`
          }
          return codegen_1.nil
        }
        function invalid$DataSchema() {
          if (def.validateSchema) {
            const validateSchemaRef = gen.scopeValue('validate$data', {
              ref: def.validateSchema,
            })
            return (0, codegen_1._)`!${validateSchemaRef}(${schemaCode})`
          }
          return codegen_1.nil
        }
      }
      subschema(appl, valid) {
        const subschema = (0, subschema_1.getSubschema)(this.it, appl)
        ;(0, subschema_1.extendSubschemaData)(subschema, this.it, appl)
        ;(0, subschema_1.extendSubschemaMode)(subschema, appl)
        const nextContext = {
          ...this.it,
          ...subschema,
          items: void 0,
          props: void 0,
        }
        subschemaCode(nextContext, valid)
        return nextContext
      }
      mergeEvaluated(schemaCxt, toName) {
        const { it, gen } = this
        if (!it.opts.unevaluated) return
        if (it.props !== true && schemaCxt.props !== void 0) {
          it.props = util_1.mergeEvaluated.props(
            gen,
            schemaCxt.props,
            it.props,
            toName
          )
        }
        if (it.items !== true && schemaCxt.items !== void 0) {
          it.items = util_1.mergeEvaluated.items(
            gen,
            schemaCxt.items,
            it.items,
            toName
          )
        }
      }
      mergeValidEvaluated(schemaCxt, valid) {
        const { it, gen } = this
        if (it.opts.unevaluated && (it.props !== true || it.items !== true)) {
          gen.if(valid, () => this.mergeEvaluated(schemaCxt, codegen_1.Name))
          return true
        }
      }
    }
    exports2.KeywordCxt = KeywordCxt
    function keywordCode(it, keyword, def, ruleType) {
      const cxt = new KeywordCxt(it, def, keyword)
      if ('code' in def) {
        def.code(cxt, ruleType)
      } else if (cxt.$data && def.validate) {
        ;(0, keyword_1.funcKeywordCode)(cxt, def)
      } else if ('macro' in def) {
        ;(0, keyword_1.macroKeywordCode)(cxt, def)
      } else if (def.compile || def.validate) {
        ;(0, keyword_1.funcKeywordCode)(cxt, def)
      }
    }
    var JSON_POINTER = /^\/(?:[^~]|~0|~1)*$/
    var RELATIVE_JSON_POINTER = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/
    function getData($data, { dataLevel, dataNames, dataPathArr }) {
      let jsonPointer
      let data
      if ($data === '') return names_1.default.rootData
      if ($data[0] === '/') {
        if (!JSON_POINTER.test($data))
          throw new Error(`Invalid JSON-pointer: ${$data}`)
        jsonPointer = $data
        data = names_1.default.rootData
      } else {
        const matches = RELATIVE_JSON_POINTER.exec($data)
        if (!matches) throw new Error(`Invalid JSON-pointer: ${$data}`)
        const up = +matches[1]
        jsonPointer = matches[2]
        if (jsonPointer === '#') {
          if (up >= dataLevel) throw new Error(errorMsg('property/index', up))
          return dataPathArr[dataLevel - up]
        }
        if (up > dataLevel) throw new Error(errorMsg('data', up))
        data = dataNames[dataLevel - up]
        if (!jsonPointer) return data
      }
      let expr = data
      const segments = jsonPointer.split('/')
      for (const segment of segments) {
        if (segment) {
          data = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(
            (0, util_1.unescapeJsonPointer)(segment)
          )}`
          expr = (0, codegen_1._)`${expr} && ${data}`
        }
      }
      return expr
      function errorMsg(pointerType, up) {
        return `Cannot access ${pointerType} ${up} levels up, current level is ${dataLevel}`
      }
    }
    exports2.getData = getData
  },
})

// node_modules/ajv/dist/runtime/validation_error.js
var require_validation_error = __commonJS({
  'node_modules/ajv/dist/runtime/validation_error.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var ValidationError2 = class extends Error {
      constructor(errors) {
        super('validation failed')
        this.errors = errors
        this.ajv = this.validation = true
      }
    }
    exports2.default = ValidationError2
  },
})

// node_modules/ajv/dist/compile/ref_error.js
var require_ref_error = __commonJS({
  'node_modules/ajv/dist/compile/ref_error.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var resolve_1 = require_resolve()
    var MissingRefError = class extends Error {
      constructor(resolver, baseId, ref, msg) {
        super(msg || `can't resolve reference ${ref} from id ${baseId}`)
        this.missingRef = (0, resolve_1.resolveUrl)(resolver, baseId, ref)
        this.missingSchema = (0, resolve_1.normalizeId)(
          (0, resolve_1.getFullPath)(resolver, this.missingRef)
        )
      }
    }
    exports2.default = MissingRefError
  },
})

// node_modules/ajv/dist/compile/index.js
var require_compile = __commonJS({
  'node_modules/ajv/dist/compile/index.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    exports2.resolveSchema =
      exports2.getCompilingSchema =
      exports2.resolveRef =
      exports2.compileSchema =
      exports2.SchemaEnv =
        void 0
    var codegen_1 = require_codegen()
    var validation_error_1 = require_validation_error()
    var names_1 = require_names()
    var resolve_1 = require_resolve()
    var util_1 = require_util()
    var validate_1 = require_validate()
    var SchemaEnv = class {
      constructor(env) {
        var _a
        this.refs = {}
        this.dynamicAnchors = {}
        let schema
        if (typeof env.schema == 'object') schema = env.schema
        this.schema = env.schema
        this.schemaId = env.schemaId
        this.root = env.root || this
        this.baseId =
          (_a = env.baseId) !== null && _a !== void 0
            ? _a
            : (0, resolve_1.normalizeId)(
                schema === null || schema === void 0
                  ? void 0
                  : schema[env.schemaId || '$id']
              )
        this.schemaPath = env.schemaPath
        this.localRefs = env.localRefs
        this.meta = env.meta
        this.$async =
          schema === null || schema === void 0 ? void 0 : schema.$async
        this.refs = {}
      }
    }
    exports2.SchemaEnv = SchemaEnv
    function compileSchema(sch) {
      const _sch = getCompilingSchema.call(this, sch)
      if (_sch) return _sch
      const rootId = (0, resolve_1.getFullPath)(
        this.opts.uriResolver,
        sch.root.baseId
      )
      const { es5, lines } = this.opts.code
      const { ownProperties } = this.opts
      const gen = new codegen_1.CodeGen(this.scope, {
        es5,
        lines,
        ownProperties,
      })
      let _ValidationError
      if (sch.$async) {
        _ValidationError = gen.scopeValue('Error', {
          ref: validation_error_1.default,
          code: (0,
          codegen_1._)`require("ajv/dist/runtime/validation_error").default`,
        })
      }
      const validateName = gen.scopeName('validate')
      sch.validateName = validateName
      const schemaCxt = {
        gen,
        allErrors: this.opts.allErrors,
        data: names_1.default.data,
        parentData: names_1.default.parentData,
        parentDataProperty: names_1.default.parentDataProperty,
        dataNames: [names_1.default.data],
        dataPathArr: [codegen_1.nil],
        dataLevel: 0,
        dataTypes: [],
        definedProperties: new Set(),
        topSchemaRef: gen.scopeValue(
          'schema',
          this.opts.code.source === true
            ? { ref: sch.schema, code: (0, codegen_1.stringify)(sch.schema) }
            : { ref: sch.schema }
        ),
        validateName,
        ValidationError: _ValidationError,
        schema: sch.schema,
        schemaEnv: sch,
        rootId,
        baseId: sch.baseId || rootId,
        schemaPath: codegen_1.nil,
        errSchemaPath: sch.schemaPath || (this.opts.jtd ? '' : '#'),
        errorPath: (0, codegen_1._)`""`,
        opts: this.opts,
        self: this,
      }
      let sourceCode
      try {
        this._compilations.add(sch)
        ;(0, validate_1.validateFunctionCode)(schemaCxt)
        gen.optimize(this.opts.code.optimize)
        const validateCode = gen.toString()
        sourceCode = `${gen.scopeRefs(
          names_1.default.scope
        )}return ${validateCode}`
        if (this.opts.code.process)
          sourceCode = this.opts.code.process(sourceCode, sch)
        const makeValidate = new Function(
          `${names_1.default.self}`,
          `${names_1.default.scope}`,
          sourceCode
        )
        const validate2 = makeValidate(this, this.scope.get())
        this.scope.value(validateName, { ref: validate2 })
        validate2.errors = null
        validate2.schema = sch.schema
        validate2.schemaEnv = sch
        if (sch.$async) validate2.$async = true
        if (this.opts.code.source === true) {
          validate2.source = {
            validateName,
            validateCode,
            scopeValues: gen._values,
          }
        }
        if (this.opts.unevaluated) {
          const { props, items } = schemaCxt
          validate2.evaluated = {
            props: props instanceof codegen_1.Name ? void 0 : props,
            items: items instanceof codegen_1.Name ? void 0 : items,
            dynamicProps: props instanceof codegen_1.Name,
            dynamicItems: items instanceof codegen_1.Name,
          }
          if (validate2.source)
            validate2.source.evaluated = (0, codegen_1.stringify)(
              validate2.evaluated
            )
        }
        sch.validate = validate2
        return sch
      } catch (e) {
        delete sch.validate
        delete sch.validateName
        if (sourceCode)
          this.logger.error(
            'Error compiling schema, function code:',
            sourceCode
          )
        throw e
      } finally {
        this._compilations.delete(sch)
      }
    }
    exports2.compileSchema = compileSchema
    function resolveRef(root, baseId, ref) {
      var _a
      ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, ref)
      const schOrFunc = root.refs[ref]
      if (schOrFunc) return schOrFunc
      let _sch = resolve.call(this, root, ref)
      if (_sch === void 0) {
        const schema =
          (_a = root.localRefs) === null || _a === void 0 ? void 0 : _a[ref]
        const { schemaId } = this.opts
        if (schema) _sch = new SchemaEnv({ schema, schemaId, root, baseId })
      }
      if (_sch === void 0) return
      return (root.refs[ref] = inlineOrCompile.call(this, _sch))
    }
    exports2.resolveRef = resolveRef
    function inlineOrCompile(sch) {
      if ((0, resolve_1.inlineRef)(sch.schema, this.opts.inlineRefs))
        return sch.schema
      return sch.validate ? sch : compileSchema.call(this, sch)
    }
    function getCompilingSchema(schEnv) {
      for (const sch of this._compilations) {
        if (sameSchemaEnv(sch, schEnv)) return sch
      }
    }
    exports2.getCompilingSchema = getCompilingSchema
    function sameSchemaEnv(s1, s2) {
      return (
        s1.schema === s2.schema &&
        s1.root === s2.root &&
        s1.baseId === s2.baseId
      )
    }
    function resolve(root, ref) {
      let sch
      while (typeof (sch = this.refs[ref]) == 'string') ref = sch
      return sch || this.schemas[ref] || resolveSchema.call(this, root, ref)
    }
    function resolveSchema(root, ref) {
      const p = this.opts.uriResolver.parse(ref)
      const refPath = (0, resolve_1._getFullPath)(this.opts.uriResolver, p)
      let baseId = (0, resolve_1.getFullPath)(
        this.opts.uriResolver,
        root.baseId,
        void 0
      )
      if (Object.keys(root.schema).length > 0 && refPath === baseId) {
        return getJsonPointer.call(this, p, root)
      }
      const id = (0, resolve_1.normalizeId)(refPath)
      const schOrRef = this.refs[id] || this.schemas[id]
      if (typeof schOrRef == 'string') {
        const sch = resolveSchema.call(this, root, schOrRef)
        if (
          typeof (sch === null || sch === void 0 ? void 0 : sch.schema) !==
          'object'
        )
          return
        return getJsonPointer.call(this, p, sch)
      }
      if (
        typeof (schOrRef === null || schOrRef === void 0
          ? void 0
          : schOrRef.schema) !== 'object'
      )
        return
      if (!schOrRef.validate) compileSchema.call(this, schOrRef)
      if (id === (0, resolve_1.normalizeId)(ref)) {
        const { schema } = schOrRef
        const { schemaId } = this.opts
        const schId = schema[schemaId]
        if (schId)
          baseId = (0, resolve_1.resolveUrl)(
            this.opts.uriResolver,
            baseId,
            schId
          )
        return new SchemaEnv({ schema, schemaId, root, baseId })
      }
      return getJsonPointer.call(this, p, schOrRef)
    }
    exports2.resolveSchema = resolveSchema
    var PREVENT_SCOPE_CHANGE = new Set([
      'properties',
      'patternProperties',
      'enum',
      'dependencies',
      'definitions',
    ])
    function getJsonPointer(parsedRef, { baseId, schema, root }) {
      var _a
      if (
        ((_a = parsedRef.fragment) === null || _a === void 0
          ? void 0
          : _a[0]) !== '/'
      )
        return
      for (const part of parsedRef.fragment.slice(1).split('/')) {
        if (typeof schema === 'boolean') return
        const partSchema = schema[(0, util_1.unescapeFragment)(part)]
        if (partSchema === void 0) return
        schema = partSchema
        const schId = typeof schema === 'object' && schema[this.opts.schemaId]
        if (!PREVENT_SCOPE_CHANGE.has(part) && schId) {
          baseId = (0, resolve_1.resolveUrl)(
            this.opts.uriResolver,
            baseId,
            schId
          )
        }
      }
      let env
      if (
        typeof schema != 'boolean' &&
        schema.$ref &&
        !(0, util_1.schemaHasRulesButRef)(schema, this.RULES)
      ) {
        const $ref = (0, resolve_1.resolveUrl)(
          this.opts.uriResolver,
          baseId,
          schema.$ref
        )
        env = resolveSchema.call(this, root, $ref)
      }
      const { schemaId } = this.opts
      env = env || new SchemaEnv({ schema, schemaId, root, baseId })
      if (env.schema !== env.root.schema) return env
      return void 0
    }
  },
})

// node_modules/ajv/dist/refs/data.json
var require_data = __commonJS({
  'node_modules/ajv/dist/refs/data.json'(exports2, module2) {
    module2.exports = {
      $id: 'https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#',
      description:
        'Meta-schema for $data reference (JSON AnySchema extension proposal)',
      type: 'object',
      required: ['$data'],
      properties: {
        $data: {
          type: 'string',
          anyOf: [
            { format: 'relative-json-pointer' },
            { format: 'json-pointer' },
          ],
        },
      },
      additionalProperties: false,
    }
  },
})

// node_modules/uri-js/dist/es5/uri.all.js
var require_uri_all = __commonJS({
  'node_modules/uri-js/dist/es5/uri.all.js'(exports2, module2) {
    ;(function (global2, factory) {
      typeof exports2 === 'object' && typeof module2 !== 'undefined'
        ? factory(exports2)
        : typeof define === 'function' && define.amd
        ? define(['exports'], factory)
        : factory((global2.URI = global2.URI || {}))
    })(exports2, function (exports3) {
      'use strict'
      function merge() {
        for (
          var _len = arguments.length, sets = Array(_len), _key = 0;
          _key < _len;
          _key++
        ) {
          sets[_key] = arguments[_key]
        }
        if (sets.length > 1) {
          sets[0] = sets[0].slice(0, -1)
          var xl = sets.length - 1
          for (var x = 1; x < xl; ++x) {
            sets[x] = sets[x].slice(1, -1)
          }
          sets[xl] = sets[xl].slice(1)
          return sets.join('')
        } else {
          return sets[0]
        }
      }
      function subexp(str) {
        return '(?:' + str + ')'
      }
      function typeOf(o) {
        return o === void 0
          ? 'undefined'
          : o === null
          ? 'null'
          : Object.prototype.toString
              .call(o)
              .split(' ')
              .pop()
              .split(']')
              .shift()
              .toLowerCase()
      }
      function toUpperCase(str) {
        return str.toUpperCase()
      }
      function toArray(obj) {
        return obj !== void 0 && obj !== null
          ? obj instanceof Array
            ? obj
            : typeof obj.length !== 'number' ||
              obj.split ||
              obj.setInterval ||
              obj.call
            ? [obj]
            : Array.prototype.slice.call(obj)
          : []
      }
      function assign(target, source) {
        var obj = target
        if (source) {
          for (var key in source) {
            obj[key] = source[key]
          }
        }
        return obj
      }
      function buildExps(isIRI2) {
        var ALPHA$$ = '[A-Za-z]',
          CR$ = '[\\x0D]',
          DIGIT$$ = '[0-9]',
          DQUOTE$$ = '[\\x22]',
          HEXDIG$$2 = merge(DIGIT$$, '[A-Fa-f]'),
          LF$$ = '[\\x0A]',
          SP$$ = '[\\x20]',
          PCT_ENCODED$2 = subexp(
            subexp(
              '%[EFef]' +
                HEXDIG$$2 +
                '%' +
                HEXDIG$$2 +
                HEXDIG$$2 +
                '%' +
                HEXDIG$$2 +
                HEXDIG$$2
            ) +
              '|' +
              subexp('%[89A-Fa-f]' + HEXDIG$$2 + '%' + HEXDIG$$2 + HEXDIG$$2) +
              '|' +
              subexp('%' + HEXDIG$$2 + HEXDIG$$2)
          ),
          GEN_DELIMS$$ = '[\\:\\/\\?\\#\\[\\]\\@]',
          SUB_DELIMS$$ = "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]",
          RESERVED$$ = merge(GEN_DELIMS$$, SUB_DELIMS$$),
          UCSCHAR$$ = isIRI2
            ? '[\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]'
            : '[]',
          IPRIVATE$$ = isIRI2 ? '[\\uE000-\\uF8FF]' : '[]',
          UNRESERVED$$2 = merge(ALPHA$$, DIGIT$$, '[\\-\\.\\_\\~]', UCSCHAR$$),
          SCHEME$ = subexp(
            ALPHA$$ + merge(ALPHA$$, DIGIT$$, '[\\+\\-\\.]') + '*'
          ),
          USERINFO$ = subexp(
            subexp(
              PCT_ENCODED$2 + '|' + merge(UNRESERVED$$2, SUB_DELIMS$$, '[\\:]')
            ) + '*'
          ),
          DEC_OCTET$ = subexp(
            subexp('25[0-5]') +
              '|' +
              subexp('2[0-4]' + DIGIT$$) +
              '|' +
              subexp('1' + DIGIT$$ + DIGIT$$) +
              '|' +
              subexp('[1-9]' + DIGIT$$) +
              '|' +
              DIGIT$$
          ),
          DEC_OCTET_RELAXED$ = subexp(
            subexp('25[0-5]') +
              '|' +
              subexp('2[0-4]' + DIGIT$$) +
              '|' +
              subexp('1' + DIGIT$$ + DIGIT$$) +
              '|' +
              subexp('0?[1-9]' + DIGIT$$) +
              '|0?0?' +
              DIGIT$$
          ),
          IPV4ADDRESS$ = subexp(
            DEC_OCTET_RELAXED$ +
              '\\.' +
              DEC_OCTET_RELAXED$ +
              '\\.' +
              DEC_OCTET_RELAXED$ +
              '\\.' +
              DEC_OCTET_RELAXED$
          ),
          H16$ = subexp(HEXDIG$$2 + '{1,4}'),
          LS32$ = subexp(subexp(H16$ + '\\:' + H16$) + '|' + IPV4ADDRESS$),
          IPV6ADDRESS1$ = subexp(subexp(H16$ + '\\:') + '{6}' + LS32$),
          IPV6ADDRESS2$ = subexp(
            '\\:\\:' + subexp(H16$ + '\\:') + '{5}' + LS32$
          ),
          IPV6ADDRESS3$ = subexp(
            subexp(H16$) + '?\\:\\:' + subexp(H16$ + '\\:') + '{4}' + LS32$
          ),
          IPV6ADDRESS4$ = subexp(
            subexp(subexp(H16$ + '\\:') + '{0,1}' + H16$) +
              '?\\:\\:' +
              subexp(H16$ + '\\:') +
              '{3}' +
              LS32$
          ),
          IPV6ADDRESS5$ = subexp(
            subexp(subexp(H16$ + '\\:') + '{0,2}' + H16$) +
              '?\\:\\:' +
              subexp(H16$ + '\\:') +
              '{2}' +
              LS32$
          ),
          IPV6ADDRESS6$ = subexp(
            subexp(subexp(H16$ + '\\:') + '{0,3}' + H16$) +
              '?\\:\\:' +
              H16$ +
              '\\:' +
              LS32$
          ),
          IPV6ADDRESS7$ = subexp(
            subexp(subexp(H16$ + '\\:') + '{0,4}' + H16$) + '?\\:\\:' + LS32$
          ),
          IPV6ADDRESS8$ = subexp(
            subexp(subexp(H16$ + '\\:') + '{0,5}' + H16$) + '?\\:\\:' + H16$
          ),
          IPV6ADDRESS9$ = subexp(
            subexp(subexp(H16$ + '\\:') + '{0,6}' + H16$) + '?\\:\\:'
          ),
          IPV6ADDRESS$ = subexp(
            [
              IPV6ADDRESS1$,
              IPV6ADDRESS2$,
              IPV6ADDRESS3$,
              IPV6ADDRESS4$,
              IPV6ADDRESS5$,
              IPV6ADDRESS6$,
              IPV6ADDRESS7$,
              IPV6ADDRESS8$,
              IPV6ADDRESS9$,
            ].join('|')
          ),
          ZONEID$ = subexp(subexp(UNRESERVED$$2 + '|' + PCT_ENCODED$2) + '+'),
          IPV6ADDRZ$ = subexp(IPV6ADDRESS$ + '\\%25' + ZONEID$),
          IPV6ADDRZ_RELAXED$ = subexp(
            IPV6ADDRESS$ + subexp('\\%25|\\%(?!' + HEXDIG$$2 + '{2})') + ZONEID$
          ),
          IPVFUTURE$ = subexp(
            '[vV]' +
              HEXDIG$$2 +
              '+\\.' +
              merge(UNRESERVED$$2, SUB_DELIMS$$, '[\\:]') +
              '+'
          ),
          IP_LITERAL$ = subexp(
            '\\[' +
              subexp(
                IPV6ADDRZ_RELAXED$ + '|' + IPV6ADDRESS$ + '|' + IPVFUTURE$
              ) +
              '\\]'
          ),
          REG_NAME$ = subexp(
            subexp(PCT_ENCODED$2 + '|' + merge(UNRESERVED$$2, SUB_DELIMS$$)) +
              '*'
          ),
          HOST$ = subexp(
            IP_LITERAL$ +
              '|' +
              IPV4ADDRESS$ +
              '(?!' +
              REG_NAME$ +
              ')|' +
              REG_NAME$
          ),
          PORT$ = subexp(DIGIT$$ + '*'),
          AUTHORITY$ = subexp(
            subexp(USERINFO$ + '@') + '?' + HOST$ + subexp('\\:' + PORT$) + '?'
          ),
          PCHAR$ = subexp(
            PCT_ENCODED$2 + '|' + merge(UNRESERVED$$2, SUB_DELIMS$$, '[\\:\\@]')
          ),
          SEGMENT$ = subexp(PCHAR$ + '*'),
          SEGMENT_NZ$ = subexp(PCHAR$ + '+'),
          SEGMENT_NZ_NC$ = subexp(
            subexp(
              PCT_ENCODED$2 + '|' + merge(UNRESERVED$$2, SUB_DELIMS$$, '[\\@]')
            ) + '+'
          ),
          PATH_ABEMPTY$ = subexp(subexp('\\/' + SEGMENT$) + '*'),
          PATH_ABSOLUTE$ = subexp(
            '\\/' + subexp(SEGMENT_NZ$ + PATH_ABEMPTY$) + '?'
          ),
          PATH_NOSCHEME$ = subexp(SEGMENT_NZ_NC$ + PATH_ABEMPTY$),
          PATH_ROOTLESS$ = subexp(SEGMENT_NZ$ + PATH_ABEMPTY$),
          PATH_EMPTY$ = '(?!' + PCHAR$ + ')',
          PATH$ = subexp(
            PATH_ABEMPTY$ +
              '|' +
              PATH_ABSOLUTE$ +
              '|' +
              PATH_NOSCHEME$ +
              '|' +
              PATH_ROOTLESS$ +
              '|' +
              PATH_EMPTY$
          ),
          QUERY$ = subexp(
            subexp(PCHAR$ + '|' + merge('[\\/\\?]', IPRIVATE$$)) + '*'
          ),
          FRAGMENT$ = subexp(subexp(PCHAR$ + '|[\\/\\?]') + '*'),
          HIER_PART$ = subexp(
            subexp('\\/\\/' + AUTHORITY$ + PATH_ABEMPTY$) +
              '|' +
              PATH_ABSOLUTE$ +
              '|' +
              PATH_ROOTLESS$ +
              '|' +
              PATH_EMPTY$
          ),
          URI$ = subexp(
            SCHEME$ +
              '\\:' +
              HIER_PART$ +
              subexp('\\?' + QUERY$) +
              '?' +
              subexp('\\#' + FRAGMENT$) +
              '?'
          ),
          RELATIVE_PART$ = subexp(
            subexp('\\/\\/' + AUTHORITY$ + PATH_ABEMPTY$) +
              '|' +
              PATH_ABSOLUTE$ +
              '|' +
              PATH_NOSCHEME$ +
              '|' +
              PATH_EMPTY$
          ),
          RELATIVE$ = subexp(
            RELATIVE_PART$ +
              subexp('\\?' + QUERY$) +
              '?' +
              subexp('\\#' + FRAGMENT$) +
              '?'
          ),
          URI_REFERENCE$ = subexp(URI$ + '|' + RELATIVE$),
          ABSOLUTE_URI$ = subexp(
            SCHEME$ + '\\:' + HIER_PART$ + subexp('\\?' + QUERY$) + '?'
          ),
          GENERIC_REF$ =
            '^(' +
            SCHEME$ +
            ')\\:' +
            subexp(
              subexp(
                '\\/\\/(' +
                  subexp('(' + USERINFO$ + ')@') +
                  '?(' +
                  HOST$ +
                  ')' +
                  subexp('\\:(' + PORT$ + ')') +
                  '?)'
              ) +
                '?(' +
                PATH_ABEMPTY$ +
                '|' +
                PATH_ABSOLUTE$ +
                '|' +
                PATH_ROOTLESS$ +
                '|' +
                PATH_EMPTY$ +
                ')'
            ) +
            subexp('\\?(' + QUERY$ + ')') +
            '?' +
            subexp('\\#(' + FRAGMENT$ + ')') +
            '?$',
          RELATIVE_REF$ =
            '^(){0}' +
            subexp(
              subexp(
                '\\/\\/(' +
                  subexp('(' + USERINFO$ + ')@') +
                  '?(' +
                  HOST$ +
                  ')' +
                  subexp('\\:(' + PORT$ + ')') +
                  '?)'
              ) +
                '?(' +
                PATH_ABEMPTY$ +
                '|' +
                PATH_ABSOLUTE$ +
                '|' +
                PATH_NOSCHEME$ +
                '|' +
                PATH_EMPTY$ +
                ')'
            ) +
            subexp('\\?(' + QUERY$ + ')') +
            '?' +
            subexp('\\#(' + FRAGMENT$ + ')') +
            '?$',
          ABSOLUTE_REF$ =
            '^(' +
            SCHEME$ +
            ')\\:' +
            subexp(
              subexp(
                '\\/\\/(' +
                  subexp('(' + USERINFO$ + ')@') +
                  '?(' +
                  HOST$ +
                  ')' +
                  subexp('\\:(' + PORT$ + ')') +
                  '?)'
              ) +
                '?(' +
                PATH_ABEMPTY$ +
                '|' +
                PATH_ABSOLUTE$ +
                '|' +
                PATH_ROOTLESS$ +
                '|' +
                PATH_EMPTY$ +
                ')'
            ) +
            subexp('\\?(' + QUERY$ + ')') +
            '?$',
          SAMEDOC_REF$ = '^' + subexp('\\#(' + FRAGMENT$ + ')') + '?$',
          AUTHORITY_REF$ =
            '^' +
            subexp('(' + USERINFO$ + ')@') +
            '?(' +
            HOST$ +
            ')' +
            subexp('\\:(' + PORT$ + ')') +
            '?$'
        return {
          NOT_SCHEME: new RegExp(
            merge('[^]', ALPHA$$, DIGIT$$, '[\\+\\-\\.]'),
            'g'
          ),
          NOT_USERINFO: new RegExp(
            merge('[^\\%\\:]', UNRESERVED$$2, SUB_DELIMS$$),
            'g'
          ),
          NOT_HOST: new RegExp(
            merge('[^\\%\\[\\]\\:]', UNRESERVED$$2, SUB_DELIMS$$),
            'g'
          ),
          NOT_PATH: new RegExp(
            merge('[^\\%\\/\\:\\@]', UNRESERVED$$2, SUB_DELIMS$$),
            'g'
          ),
          NOT_PATH_NOSCHEME: new RegExp(
            merge('[^\\%\\/\\@]', UNRESERVED$$2, SUB_DELIMS$$),
            'g'
          ),
          NOT_QUERY: new RegExp(
            merge(
              '[^\\%]',
              UNRESERVED$$2,
              SUB_DELIMS$$,
              '[\\:\\@\\/\\?]',
              IPRIVATE$$
            ),
            'g'
          ),
          NOT_FRAGMENT: new RegExp(
            merge('[^\\%]', UNRESERVED$$2, SUB_DELIMS$$, '[\\:\\@\\/\\?]'),
            'g'
          ),
          ESCAPE: new RegExp(merge('[^]', UNRESERVED$$2, SUB_DELIMS$$), 'g'),
          UNRESERVED: new RegExp(UNRESERVED$$2, 'g'),
          OTHER_CHARS: new RegExp(
            merge('[^\\%]', UNRESERVED$$2, RESERVED$$),
            'g'
          ),
          PCT_ENCODED: new RegExp(PCT_ENCODED$2, 'g'),
          IPV4ADDRESS: new RegExp('^(' + IPV4ADDRESS$ + ')$'),
          IPV6ADDRESS: new RegExp(
            '^\\[?(' +
              IPV6ADDRESS$ +
              ')' +
              subexp(
                subexp('\\%25|\\%(?!' + HEXDIG$$2 + '{2})') +
                  '(' +
                  ZONEID$ +
                  ')'
              ) +
              '?\\]?$'
          ),
        }
      }
      var URI_PROTOCOL = buildExps(false)
      var IRI_PROTOCOL = buildExps(true)
      var slicedToArray = (function () {
        function sliceIterator(arr, i) {
          var _arr = []
          var _n = true
          var _d = false
          var _e = void 0
          try {
            for (
              var _i = arr[Symbol.iterator](), _s;
              !(_n = (_s = _i.next()).done);
              _n = true
            ) {
              _arr.push(_s.value)
              if (i && _arr.length === i) break
            }
          } catch (err) {
            _d = true
            _e = err
          } finally {
            try {
              if (!_n && _i['return']) _i['return']()
            } finally {
              if (_d) throw _e
            }
          }
          return _arr
        }
        return function (arr, i) {
          if (Array.isArray(arr)) {
            return arr
          } else if (Symbol.iterator in Object(arr)) {
            return sliceIterator(arr, i)
          } else {
            throw new TypeError(
              'Invalid attempt to destructure non-iterable instance'
            )
          }
        }
      })()
      var toConsumableArray = function (arr) {
        if (Array.isArray(arr)) {
          for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++)
            arr2[i] = arr[i]
          return arr2
        } else {
          return Array.from(arr)
        }
      }
      var maxInt = 2147483647
      var base3 = 36
      var tMin = 1
      var tMax = 26
      var skew = 38
      var damp = 700
      var initialBias = 72
      var initialN = 128
      var delimiter = '-'
      var regexPunycode = /^xn--/
      var regexNonASCII = /[^\0-\x7E]/
      var regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g
      var errors = {
        overflow: 'Overflow: input needs wider integers to process',
        'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
        'invalid-input': 'Invalid input',
      }
      var baseMinusTMin = base3 - tMin
      var floor = Math.floor
      var stringFromCharCode = String.fromCharCode
      function error$1(type) {
        throw new RangeError(errors[type])
      }
      function map4(array2, fn) {
        var result = []
        var length2 = array2.length
        while (length2--) {
          result[length2] = fn(array2[length2])
        }
        return result
      }
      function mapDomain(string3, fn) {
        var parts = string3.split('@')
        var result = ''
        if (parts.length > 1) {
          result = parts[0] + '@'
          string3 = parts[1]
        }
        string3 = string3.replace(regexSeparators, '.')
        var labels = string3.split('.')
        var encoded = map4(labels, fn).join('.')
        return result + encoded
      }
      function ucs2decode(string3) {
        var output = []
        var counter = 0
        var length2 = string3.length
        while (counter < length2) {
          var value = string3.charCodeAt(counter++)
          if (value >= 55296 && value <= 56319 && counter < length2) {
            var extra = string3.charCodeAt(counter++)
            if ((extra & 64512) == 56320) {
              output.push(((value & 1023) << 10) + (extra & 1023) + 65536)
            } else {
              output.push(value)
              counter--
            }
          } else {
            output.push(value)
          }
        }
        return output
      }
      var ucs2encode = function ucs2encode2(array2) {
        return String.fromCodePoint.apply(String, toConsumableArray(array2))
      }
      var basicToDigit = function basicToDigit2(codePoint) {
        if (codePoint - 48 < 10) {
          return codePoint - 22
        }
        if (codePoint - 65 < 26) {
          return codePoint - 65
        }
        if (codePoint - 97 < 26) {
          return codePoint - 97
        }
        return base3
      }
      var digitToBasic = function digitToBasic2(digit, flag) {
        return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5)
      }
      var adapt = function adapt2(delta, numPoints, firstTime) {
        var k = 0
        delta = firstTime ? floor(delta / damp) : delta >> 1
        delta += floor(delta / numPoints)
        for (; delta > (baseMinusTMin * tMax) >> 1; k += base3) {
          delta = floor(delta / baseMinusTMin)
        }
        return floor(k + ((baseMinusTMin + 1) * delta) / (delta + skew))
      }
      var decode11 = function decode12(input) {
        var output = []
        var inputLength = input.length
        var i = 0
        var n = initialN
        var bias = initialBias
        var basic = input.lastIndexOf(delimiter)
        if (basic < 0) {
          basic = 0
        }
        for (var j = 0; j < basic; ++j) {
          if (input.charCodeAt(j) >= 128) {
            error$1('not-basic')
          }
          output.push(input.charCodeAt(j))
        }
        for (var index = basic > 0 ? basic + 1 : 0; index < inputLength; ) {
          var oldi = i
          for (var w = 1, k = base3; ; k += base3) {
            if (index >= inputLength) {
              error$1('invalid-input')
            }
            var digit = basicToDigit(input.charCodeAt(index++))
            if (digit >= base3 || digit > floor((maxInt - i) / w)) {
              error$1('overflow')
            }
            i += digit * w
            var t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias
            if (digit < t) {
              break
            }
            var baseMinusT = base3 - t
            if (w > floor(maxInt / baseMinusT)) {
              error$1('overflow')
            }
            w *= baseMinusT
          }
          var out = output.length + 1
          bias = adapt(i - oldi, out, oldi == 0)
          if (floor(i / out) > maxInt - n) {
            error$1('overflow')
          }
          n += floor(i / out)
          i %= out
          output.splice(i++, 0, n)
        }
        return String.fromCodePoint.apply(String, output)
      }
      var encode12 = function encode13(input) {
        var output = []
        input = ucs2decode(input)
        var inputLength = input.length
        var n = initialN
        var delta = 0
        var bias = initialBias
        var _iteratorNormalCompletion = true
        var _didIteratorError = false
        var _iteratorError = void 0
        try {
          for (
            var _iterator = input[Symbol.iterator](), _step;
            !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
            _iteratorNormalCompletion = true
          ) {
            var _currentValue2 = _step.value
            if (_currentValue2 < 128) {
              output.push(stringFromCharCode(_currentValue2))
            }
          }
        } catch (err) {
          _didIteratorError = true
          _iteratorError = err
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return()
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError
            }
          }
        }
        var basicLength = output.length
        var handledCPCount = basicLength
        if (basicLength) {
          output.push(delimiter)
        }
        while (handledCPCount < inputLength) {
          var m = maxInt
          var _iteratorNormalCompletion2 = true
          var _didIteratorError2 = false
          var _iteratorError2 = void 0
          try {
            for (
              var _iterator2 = input[Symbol.iterator](), _step2;
              !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done);
              _iteratorNormalCompletion2 = true
            ) {
              var currentValue = _step2.value
              if (currentValue >= n && currentValue < m) {
                m = currentValue
              }
            }
          } catch (err) {
            _didIteratorError2 = true
            _iteratorError2 = err
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return()
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2
              }
            }
          }
          var handledCPCountPlusOne = handledCPCount + 1
          if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
            error$1('overflow')
          }
          delta += (m - n) * handledCPCountPlusOne
          n = m
          var _iteratorNormalCompletion3 = true
          var _didIteratorError3 = false
          var _iteratorError3 = void 0
          try {
            for (
              var _iterator3 = input[Symbol.iterator](), _step3;
              !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done);
              _iteratorNormalCompletion3 = true
            ) {
              var _currentValue = _step3.value
              if (_currentValue < n && ++delta > maxInt) {
                error$1('overflow')
              }
              if (_currentValue == n) {
                var q = delta
                for (var k = base3; ; k += base3) {
                  var t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias
                  if (q < t) {
                    break
                  }
                  var qMinusT = q - t
                  var baseMinusT = base3 - t
                  output.push(
                    stringFromCharCode(
                      digitToBasic(t + (qMinusT % baseMinusT), 0)
                    )
                  )
                  q = floor(qMinusT / baseMinusT)
                }
                output.push(stringFromCharCode(digitToBasic(q, 0)))
                bias = adapt(
                  delta,
                  handledCPCountPlusOne,
                  handledCPCount == basicLength
                )
                delta = 0
                ++handledCPCount
              }
            }
          } catch (err) {
            _didIteratorError3 = true
            _iteratorError3 = err
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return()
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3
              }
            }
          }
          ++delta
          ++n
        }
        return output.join('')
      }
      var toUnicode = function toUnicode2(input) {
        return mapDomain(input, function (string3) {
          return regexPunycode.test(string3)
            ? decode11(string3.slice(4).toLowerCase())
            : string3
        })
      }
      var toASCII = function toASCII2(input) {
        return mapDomain(input, function (string3) {
          return regexNonASCII.test(string3)
            ? 'xn--' + encode12(string3)
            : string3
        })
      }
      var punycode = {
        version: '2.1.0',
        ucs2: {
          decode: ucs2decode,
          encode: ucs2encode,
        },
        decode: decode11,
        encode: encode12,
        toASCII: toASCII,
        toUnicode: toUnicode,
      }
      var SCHEMES = {}
      function pctEncChar(chr) {
        var c = chr.charCodeAt(0)
        var e = void 0
        if (c < 16) e = '%0' + c.toString(16).toUpperCase()
        else if (c < 128) e = '%' + c.toString(16).toUpperCase()
        else if (c < 2048)
          e =
            '%' +
            ((c >> 6) | 192).toString(16).toUpperCase() +
            '%' +
            ((c & 63) | 128).toString(16).toUpperCase()
        else
          e =
            '%' +
            ((c >> 12) | 224).toString(16).toUpperCase() +
            '%' +
            (((c >> 6) & 63) | 128).toString(16).toUpperCase() +
            '%' +
            ((c & 63) | 128).toString(16).toUpperCase()
        return e
      }
      function pctDecChars(str) {
        var newStr = ''
        var i = 0
        var il = str.length
        while (i < il) {
          var c = parseInt(str.substr(i + 1, 2), 16)
          if (c < 128) {
            newStr += String.fromCharCode(c)
            i += 3
          } else if (c >= 194 && c < 224) {
            if (il - i >= 6) {
              var c2 = parseInt(str.substr(i + 4, 2), 16)
              newStr += String.fromCharCode(((c & 31) << 6) | (c2 & 63))
            } else {
              newStr += str.substr(i, 6)
            }
            i += 6
          } else if (c >= 224) {
            if (il - i >= 9) {
              var _c = parseInt(str.substr(i + 4, 2), 16)
              var c3 = parseInt(str.substr(i + 7, 2), 16)
              newStr += String.fromCharCode(
                ((c & 15) << 12) | ((_c & 63) << 6) | (c3 & 63)
              )
            } else {
              newStr += str.substr(i, 9)
            }
            i += 9
          } else {
            newStr += str.substr(i, 3)
            i += 3
          }
        }
        return newStr
      }
      function _normalizeComponentEncoding(components, protocol) {
        function decodeUnreserved2(str) {
          var decStr = pctDecChars(str)
          return !decStr.match(protocol.UNRESERVED) ? str : decStr
        }
        if (components.scheme)
          components.scheme = String(components.scheme)
            .replace(protocol.PCT_ENCODED, decodeUnreserved2)
            .toLowerCase()
            .replace(protocol.NOT_SCHEME, '')
        if (components.userinfo !== void 0)
          components.userinfo = String(components.userinfo)
            .replace(protocol.PCT_ENCODED, decodeUnreserved2)
            .replace(protocol.NOT_USERINFO, pctEncChar)
            .replace(protocol.PCT_ENCODED, toUpperCase)
        if (components.host !== void 0)
          components.host = String(components.host)
            .replace(protocol.PCT_ENCODED, decodeUnreserved2)
            .toLowerCase()
            .replace(protocol.NOT_HOST, pctEncChar)
            .replace(protocol.PCT_ENCODED, toUpperCase)
        if (components.path !== void 0)
          components.path = String(components.path)
            .replace(protocol.PCT_ENCODED, decodeUnreserved2)
            .replace(
              components.scheme
                ? protocol.NOT_PATH
                : protocol.NOT_PATH_NOSCHEME,
              pctEncChar
            )
            .replace(protocol.PCT_ENCODED, toUpperCase)
        if (components.query !== void 0)
          components.query = String(components.query)
            .replace(protocol.PCT_ENCODED, decodeUnreserved2)
            .replace(protocol.NOT_QUERY, pctEncChar)
            .replace(protocol.PCT_ENCODED, toUpperCase)
        if (components.fragment !== void 0)
          components.fragment = String(components.fragment)
            .replace(protocol.PCT_ENCODED, decodeUnreserved2)
            .replace(protocol.NOT_FRAGMENT, pctEncChar)
            .replace(protocol.PCT_ENCODED, toUpperCase)
        return components
      }
      function _stripLeadingZeros(str) {
        return str.replace(/^0*(.*)/, '$1') || '0'
      }
      function _normalizeIPv4(host, protocol) {
        var matches = host.match(protocol.IPV4ADDRESS) || []
        var _matches = slicedToArray(matches, 2),
          address = _matches[1]
        if (address) {
          return address.split('.').map(_stripLeadingZeros).join('.')
        } else {
          return host
        }
      }
      function _normalizeIPv6(host, protocol) {
        var matches = host.match(protocol.IPV6ADDRESS) || []
        var _matches2 = slicedToArray(matches, 3),
          address = _matches2[1],
          zone = _matches2[2]
        if (address) {
          var _address$toLowerCase$ = address
              .toLowerCase()
              .split('::')
              .reverse(),
            _address$toLowerCase$2 = slicedToArray(_address$toLowerCase$, 2),
            last2 = _address$toLowerCase$2[0],
            first = _address$toLowerCase$2[1]
          var firstFields = first
            ? first.split(':').map(_stripLeadingZeros)
            : []
          var lastFields = last2.split(':').map(_stripLeadingZeros)
          var isLastFieldIPv4Address = protocol.IPV4ADDRESS.test(
            lastFields[lastFields.length - 1]
          )
          var fieldCount = isLastFieldIPv4Address ? 7 : 8
          var lastFieldsStart = lastFields.length - fieldCount
          var fields = Array(fieldCount)
          for (var x = 0; x < fieldCount; ++x) {
            fields[x] = firstFields[x] || lastFields[lastFieldsStart + x] || ''
          }
          if (isLastFieldIPv4Address) {
            fields[fieldCount - 1] = _normalizeIPv4(
              fields[fieldCount - 1],
              protocol
            )
          }
          var allZeroFields = fields.reduce(function (acc, field, index) {
            if (!field || field === '0') {
              var lastLongest = acc[acc.length - 1]
              if (
                lastLongest &&
                lastLongest.index + lastLongest.length === index
              ) {
                lastLongest.length++
              } else {
                acc.push({ index, length: 1 })
              }
            }
            return acc
          }, [])
          var longestZeroFields = allZeroFields.sort(function (a, b) {
            return b.length - a.length
          })[0]
          var newHost = void 0
          if (longestZeroFields && longestZeroFields.length > 1) {
            var newFirst = fields.slice(0, longestZeroFields.index)
            var newLast = fields.slice(
              longestZeroFields.index + longestZeroFields.length
            )
            newHost = newFirst.join(':') + '::' + newLast.join(':')
          } else {
            newHost = fields.join(':')
          }
          if (zone) {
            newHost += '%' + zone
          }
          return newHost
        } else {
          return host
        }
      }
      var URI_PARSE =
        /^(?:([^:\/?#]+):)?(?:\/\/((?:([^\/?#@]*)@)?(\[[^\/?#\]]+\]|[^\/?#:]*)(?:\:(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#((?:.|\n|\r)*))?/i
      var NO_MATCH_IS_UNDEFINED = ''.match(/(){0}/)[1] === void 0
      function parse(uriString) {
        var options =
          arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}
        var components = {}
        var protocol = options.iri !== false ? IRI_PROTOCOL : URI_PROTOCOL
        if (options.reference === 'suffix')
          uriString =
            (options.scheme ? options.scheme + ':' : '') + '//' + uriString
        var matches = uriString.match(URI_PARSE)
        if (matches) {
          if (NO_MATCH_IS_UNDEFINED) {
            components.scheme = matches[1]
            components.userinfo = matches[3]
            components.host = matches[4]
            components.port = parseInt(matches[5], 10)
            components.path = matches[6] || ''
            components.query = matches[7]
            components.fragment = matches[8]
            if (isNaN(components.port)) {
              components.port = matches[5]
            }
          } else {
            components.scheme = matches[1] || void 0
            components.userinfo =
              uriString.indexOf('@') !== -1 ? matches[3] : void 0
            components.host =
              uriString.indexOf('//') !== -1 ? matches[4] : void 0
            components.port = parseInt(matches[5], 10)
            components.path = matches[6] || ''
            components.query =
              uriString.indexOf('?') !== -1 ? matches[7] : void 0
            components.fragment =
              uriString.indexOf('#') !== -1 ? matches[8] : void 0
            if (isNaN(components.port)) {
              components.port = uriString.match(/\/\/(?:.|\n)*\:(?:\/|\?|\#|$)/)
                ? matches[4]
                : void 0
            }
          }
          if (components.host) {
            components.host = _normalizeIPv6(
              _normalizeIPv4(components.host, protocol),
              protocol
            )
          }
          if (
            components.scheme === void 0 &&
            components.userinfo === void 0 &&
            components.host === void 0 &&
            components.port === void 0 &&
            !components.path &&
            components.query === void 0
          ) {
            components.reference = 'same-document'
          } else if (components.scheme === void 0) {
            components.reference = 'relative'
          } else if (components.fragment === void 0) {
            components.reference = 'absolute'
          } else {
            components.reference = 'uri'
          }
          if (
            options.reference &&
            options.reference !== 'suffix' &&
            options.reference !== components.reference
          ) {
            components.error =
              components.error ||
              'URI is not a ' + options.reference + ' reference.'
          }
          var schemeHandler =
            SCHEMES[(options.scheme || components.scheme || '').toLowerCase()]
          if (
            !options.unicodeSupport &&
            (!schemeHandler || !schemeHandler.unicodeSupport)
          ) {
            if (
              components.host &&
              (options.domainHost ||
                (schemeHandler && schemeHandler.domainHost))
            ) {
              try {
                components.host = punycode.toASCII(
                  components.host
                    .replace(protocol.PCT_ENCODED, pctDecChars)
                    .toLowerCase()
                )
              } catch (e) {
                components.error =
                  components.error ||
                  "Host's domain name can not be converted to ASCII via punycode: " +
                    e
              }
            }
            _normalizeComponentEncoding(components, URI_PROTOCOL)
          } else {
            _normalizeComponentEncoding(components, protocol)
          }
          if (schemeHandler && schemeHandler.parse) {
            schemeHandler.parse(components, options)
          }
        } else {
          components.error = components.error || 'URI can not be parsed.'
        }
        return components
      }
      function _recomposeAuthority(components, options) {
        var protocol = options.iri !== false ? IRI_PROTOCOL : URI_PROTOCOL
        var uriTokens = []
        if (components.userinfo !== void 0) {
          uriTokens.push(components.userinfo)
          uriTokens.push('@')
        }
        if (components.host !== void 0) {
          uriTokens.push(
            _normalizeIPv6(
              _normalizeIPv4(String(components.host), protocol),
              protocol
            ).replace(protocol.IPV6ADDRESS, function (_, $1, $2) {
              return '[' + $1 + ($2 ? '%25' + $2 : '') + ']'
            })
          )
        }
        if (
          typeof components.port === 'number' ||
          typeof components.port === 'string'
        ) {
          uriTokens.push(':')
          uriTokens.push(String(components.port))
        }
        return uriTokens.length ? uriTokens.join('') : void 0
      }
      var RDS1 = /^\.\.?\//
      var RDS2 = /^\/\.(\/|$)/
      var RDS3 = /^\/\.\.(\/|$)/
      var RDS5 = /^\/?(?:.|\n)*?(?=\/|$)/
      function removeDotSegments(input) {
        var output = []
        while (input.length) {
          if (input.match(RDS1)) {
            input = input.replace(RDS1, '')
          } else if (input.match(RDS2)) {
            input = input.replace(RDS2, '/')
          } else if (input.match(RDS3)) {
            input = input.replace(RDS3, '/')
            output.pop()
          } else if (input === '.' || input === '..') {
            input = ''
          } else {
            var im = input.match(RDS5)
            if (im) {
              var s = im[0]
              input = input.slice(s.length)
              output.push(s)
            } else {
              throw new Error('Unexpected dot segment condition')
            }
          }
        }
        return output.join('')
      }
      function serialize(components) {
        var options =
          arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}
        var protocol = options.iri ? IRI_PROTOCOL : URI_PROTOCOL
        var uriTokens = []
        var schemeHandler =
          SCHEMES[(options.scheme || components.scheme || '').toLowerCase()]
        if (schemeHandler && schemeHandler.serialize)
          schemeHandler.serialize(components, options)
        if (components.host) {
          if (protocol.IPV6ADDRESS.test(components.host)) {
          } else if (
            options.domainHost ||
            (schemeHandler && schemeHandler.domainHost)
          ) {
            try {
              components.host = !options.iri
                ? punycode.toASCII(
                    components.host
                      .replace(protocol.PCT_ENCODED, pctDecChars)
                      .toLowerCase()
                  )
                : punycode.toUnicode(components.host)
            } catch (e) {
              components.error =
                components.error ||
                "Host's domain name can not be converted to " +
                  (!options.iri ? 'ASCII' : 'Unicode') +
                  ' via punycode: ' +
                  e
            }
          }
        }
        _normalizeComponentEncoding(components, protocol)
        if (options.reference !== 'suffix' && components.scheme) {
          uriTokens.push(components.scheme)
          uriTokens.push(':')
        }
        var authority = _recomposeAuthority(components, options)
        if (authority !== void 0) {
          if (options.reference !== 'suffix') {
            uriTokens.push('//')
          }
          uriTokens.push(authority)
          if (components.path && components.path.charAt(0) !== '/') {
            uriTokens.push('/')
          }
        }
        if (components.path !== void 0) {
          var s = components.path
          if (
            !options.absolutePath &&
            (!schemeHandler || !schemeHandler.absolutePath)
          ) {
            s = removeDotSegments(s)
          }
          if (authority === void 0) {
            s = s.replace(/^\/\//, '/%2F')
          }
          uriTokens.push(s)
        }
        if (components.query !== void 0) {
          uriTokens.push('?')
          uriTokens.push(components.query)
        }
        if (components.fragment !== void 0) {
          uriTokens.push('#')
          uriTokens.push(components.fragment)
        }
        return uriTokens.join('')
      }
      function resolveComponents(base4, relative) {
        var options =
          arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}
        var skipNormalization = arguments[3]
        var target = {}
        if (!skipNormalization) {
          base4 = parse(serialize(base4, options), options)
          relative = parse(serialize(relative, options), options)
        }
        options = options || {}
        if (!options.tolerant && relative.scheme) {
          target.scheme = relative.scheme
          target.userinfo = relative.userinfo
          target.host = relative.host
          target.port = relative.port
          target.path = removeDotSegments(relative.path || '')
          target.query = relative.query
        } else {
          if (
            relative.userinfo !== void 0 ||
            relative.host !== void 0 ||
            relative.port !== void 0
          ) {
            target.userinfo = relative.userinfo
            target.host = relative.host
            target.port = relative.port
            target.path = removeDotSegments(relative.path || '')
            target.query = relative.query
          } else {
            if (!relative.path) {
              target.path = base4.path
              if (relative.query !== void 0) {
                target.query = relative.query
              } else {
                target.query = base4.query
              }
            } else {
              if (relative.path.charAt(0) === '/') {
                target.path = removeDotSegments(relative.path)
              } else {
                if (
                  (base4.userinfo !== void 0 ||
                    base4.host !== void 0 ||
                    base4.port !== void 0) &&
                  !base4.path
                ) {
                  target.path = '/' + relative.path
                } else if (!base4.path) {
                  target.path = relative.path
                } else {
                  target.path =
                    base4.path.slice(0, base4.path.lastIndexOf('/') + 1) +
                    relative.path
                }
                target.path = removeDotSegments(target.path)
              }
              target.query = relative.query
            }
            target.userinfo = base4.userinfo
            target.host = base4.host
            target.port = base4.port
          }
          target.scheme = base4.scheme
        }
        target.fragment = relative.fragment
        return target
      }
      function resolve(baseURI, relativeURI, options) {
        var schemelessOptions = assign({ scheme: 'null' }, options)
        return serialize(
          resolveComponents(
            parse(baseURI, schemelessOptions),
            parse(relativeURI, schemelessOptions),
            schemelessOptions,
            true
          ),
          schemelessOptions
        )
      }
      function normalize(uri, options) {
        if (typeof uri === 'string') {
          uri = serialize(parse(uri, options), options)
        } else if (typeOf(uri) === 'object') {
          uri = parse(serialize(uri, options), options)
        }
        return uri
      }
      function equal(uriA, uriB, options) {
        if (typeof uriA === 'string') {
          uriA = serialize(parse(uriA, options), options)
        } else if (typeOf(uriA) === 'object') {
          uriA = serialize(uriA, options)
        }
        if (typeof uriB === 'string') {
          uriB = serialize(parse(uriB, options), options)
        } else if (typeOf(uriB) === 'object') {
          uriB = serialize(uriB, options)
        }
        return uriA === uriB
      }
      function escapeComponent(str, options) {
        return (
          str &&
          str
            .toString()
            .replace(
              !options || !options.iri
                ? URI_PROTOCOL.ESCAPE
                : IRI_PROTOCOL.ESCAPE,
              pctEncChar
            )
        )
      }
      function unescapeComponent(str, options) {
        return (
          str &&
          str
            .toString()
            .replace(
              !options || !options.iri
                ? URI_PROTOCOL.PCT_ENCODED
                : IRI_PROTOCOL.PCT_ENCODED,
              pctDecChars
            )
        )
      }
      var handler = {
        scheme: 'http',
        domainHost: true,
        parse: function parse2(components, options) {
          if (!components.host) {
            components.error = components.error || 'HTTP URIs must have a host.'
          }
          return components
        },
        serialize: function serialize2(components, options) {
          var secure = String(components.scheme).toLowerCase() === 'https'
          if (
            components.port === (secure ? 443 : 80) ||
            components.port === ''
          ) {
            components.port = void 0
          }
          if (!components.path) {
            components.path = '/'
          }
          return components
        },
      }
      var handler$1 = {
        scheme: 'https',
        domainHost: handler.domainHost,
        parse: handler.parse,
        serialize: handler.serialize,
      }
      function isSecure(wsComponents) {
        return typeof wsComponents.secure === 'boolean'
          ? wsComponents.secure
          : String(wsComponents.scheme).toLowerCase() === 'wss'
      }
      var handler$2 = {
        scheme: 'ws',
        domainHost: true,
        parse: function parse2(components, options) {
          var wsComponents = components
          wsComponents.secure = isSecure(wsComponents)
          wsComponents.resourceName =
            (wsComponents.path || '/') +
            (wsComponents.query ? '?' + wsComponents.query : '')
          wsComponents.path = void 0
          wsComponents.query = void 0
          return wsComponents
        },
        serialize: function serialize2(wsComponents, options) {
          if (
            wsComponents.port === (isSecure(wsComponents) ? 443 : 80) ||
            wsComponents.port === ''
          ) {
            wsComponents.port = void 0
          }
          if (typeof wsComponents.secure === 'boolean') {
            wsComponents.scheme = wsComponents.secure ? 'wss' : 'ws'
            wsComponents.secure = void 0
          }
          if (wsComponents.resourceName) {
            var _wsComponents$resourc = wsComponents.resourceName.split('?'),
              _wsComponents$resourc2 = slicedToArray(_wsComponents$resourc, 2),
              path = _wsComponents$resourc2[0],
              query = _wsComponents$resourc2[1]
            wsComponents.path = path && path !== '/' ? path : void 0
            wsComponents.query = query
            wsComponents.resourceName = void 0
          }
          wsComponents.fragment = void 0
          return wsComponents
        },
      }
      var handler$3 = {
        scheme: 'wss',
        domainHost: handler$2.domainHost,
        parse: handler$2.parse,
        serialize: handler$2.serialize,
      }
      var O = {}
      var isIRI = true
      var UNRESERVED$$ =
        '[A-Za-z0-9\\-\\.\\_\\~' +
        (isIRI
          ? '\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF'
          : '') +
        ']'
      var HEXDIG$$ = '[0-9A-Fa-f]'
      var PCT_ENCODED$ = subexp(
        subexp(
          '%[EFef]' +
            HEXDIG$$ +
            '%' +
            HEXDIG$$ +
            HEXDIG$$ +
            '%' +
            HEXDIG$$ +
            HEXDIG$$
        ) +
          '|' +
          subexp('%[89A-Fa-f]' + HEXDIG$$ + '%' + HEXDIG$$ + HEXDIG$$) +
          '|' +
          subexp('%' + HEXDIG$$ + HEXDIG$$)
      )
      var ATEXT$$ = "[A-Za-z0-9\\!\\$\\%\\'\\*\\+\\-\\^\\_\\`\\{\\|\\}\\~]"
      var QTEXT$$ = "[\\!\\$\\%\\'\\(\\)\\*\\+\\,\\-\\.0-9\\<\\>A-Z\\x5E-\\x7E]"
      var VCHAR$$ = merge(QTEXT$$, '[\\"\\\\]')
      var SOME_DELIMS$$ = "[\\!\\$\\'\\(\\)\\*\\+\\,\\;\\:\\@]"
      var UNRESERVED = new RegExp(UNRESERVED$$, 'g')
      var PCT_ENCODED = new RegExp(PCT_ENCODED$, 'g')
      var NOT_LOCAL_PART = new RegExp(
        merge('[^]', ATEXT$$, '[\\.]', '[\\"]', VCHAR$$),
        'g'
      )
      var NOT_HFNAME = new RegExp(
        merge('[^]', UNRESERVED$$, SOME_DELIMS$$),
        'g'
      )
      var NOT_HFVALUE = NOT_HFNAME
      function decodeUnreserved(str) {
        var decStr = pctDecChars(str)
        return !decStr.match(UNRESERVED) ? str : decStr
      }
      var handler$4 = {
        scheme: 'mailto',
        parse: function parse$$1(components, options) {
          var mailtoComponents = components
          var to = (mailtoComponents.to = mailtoComponents.path
            ? mailtoComponents.path.split(',')
            : [])
          mailtoComponents.path = void 0
          if (mailtoComponents.query) {
            var unknownHeaders = false
            var headers = {}
            var hfields = mailtoComponents.query.split('&')
            for (var x = 0, xl = hfields.length; x < xl; ++x) {
              var hfield = hfields[x].split('=')
              switch (hfield[0]) {
                case 'to':
                  var toAddrs = hfield[1].split(',')
                  for (var _x = 0, _xl = toAddrs.length; _x < _xl; ++_x) {
                    to.push(toAddrs[_x])
                  }
                  break
                case 'subject':
                  mailtoComponents.subject = unescapeComponent(
                    hfield[1],
                    options
                  )
                  break
                case 'body':
                  mailtoComponents.body = unescapeComponent(hfield[1], options)
                  break
                default:
                  unknownHeaders = true
                  headers[unescapeComponent(hfield[0], options)] =
                    unescapeComponent(hfield[1], options)
                  break
              }
            }
            if (unknownHeaders) mailtoComponents.headers = headers
          }
          mailtoComponents.query = void 0
          for (var _x2 = 0, _xl2 = to.length; _x2 < _xl2; ++_x2) {
            var addr = to[_x2].split('@')
            addr[0] = unescapeComponent(addr[0])
            if (!options.unicodeSupport) {
              try {
                addr[1] = punycode.toASCII(
                  unescapeComponent(addr[1], options).toLowerCase()
                )
              } catch (e) {
                mailtoComponents.error =
                  mailtoComponents.error ||
                  "Email address's domain name can not be converted to ASCII via punycode: " +
                    e
              }
            } else {
              addr[1] = unescapeComponent(addr[1], options).toLowerCase()
            }
            to[_x2] = addr.join('@')
          }
          return mailtoComponents
        },
        serialize: function serialize$$1(mailtoComponents, options) {
          var components = mailtoComponents
          var to = toArray(mailtoComponents.to)
          if (to) {
            for (var x = 0, xl = to.length; x < xl; ++x) {
              var toAddr = String(to[x])
              var atIdx = toAddr.lastIndexOf('@')
              var localPart = toAddr
                .slice(0, atIdx)
                .replace(PCT_ENCODED, decodeUnreserved)
                .replace(PCT_ENCODED, toUpperCase)
                .replace(NOT_LOCAL_PART, pctEncChar)
              var domain = toAddr.slice(atIdx + 1)
              try {
                domain = !options.iri
                  ? punycode.toASCII(
                      unescapeComponent(domain, options).toLowerCase()
                    )
                  : punycode.toUnicode(domain)
              } catch (e) {
                components.error =
                  components.error ||
                  "Email address's domain name can not be converted to " +
                    (!options.iri ? 'ASCII' : 'Unicode') +
                    ' via punycode: ' +
                    e
              }
              to[x] = localPart + '@' + domain
            }
            components.path = to.join(',')
          }
          var headers = (mailtoComponents.headers =
            mailtoComponents.headers || {})
          if (mailtoComponents.subject)
            headers['subject'] = mailtoComponents.subject
          if (mailtoComponents.body) headers['body'] = mailtoComponents.body
          var fields = []
          for (var name6 in headers) {
            if (headers[name6] !== O[name6]) {
              fields.push(
                name6
                  .replace(PCT_ENCODED, decodeUnreserved)
                  .replace(PCT_ENCODED, toUpperCase)
                  .replace(NOT_HFNAME, pctEncChar) +
                  '=' +
                  headers[name6]
                    .replace(PCT_ENCODED, decodeUnreserved)
                    .replace(PCT_ENCODED, toUpperCase)
                    .replace(NOT_HFVALUE, pctEncChar)
              )
            }
          }
          if (fields.length) {
            components.query = fields.join('&')
          }
          return components
        },
      }
      var URN_PARSE = /^([^\:]+)\:(.*)/
      var handler$5 = {
        scheme: 'urn',
        parse: function parse$$1(components, options) {
          var matches = components.path && components.path.match(URN_PARSE)
          var urnComponents = components
          if (matches) {
            var scheme = options.scheme || urnComponents.scheme || 'urn'
            var nid = matches[1].toLowerCase()
            var nss = matches[2]
            var urnScheme = scheme + ':' + (options.nid || nid)
            var schemeHandler = SCHEMES[urnScheme]
            urnComponents.nid = nid
            urnComponents.nss = nss
            urnComponents.path = void 0
            if (schemeHandler) {
              urnComponents = schemeHandler.parse(urnComponents, options)
            }
          } else {
            urnComponents.error =
              urnComponents.error || 'URN can not be parsed.'
          }
          return urnComponents
        },
        serialize: function serialize$$1(urnComponents, options) {
          var scheme = options.scheme || urnComponents.scheme || 'urn'
          var nid = urnComponents.nid
          var urnScheme = scheme + ':' + (options.nid || nid)
          var schemeHandler = SCHEMES[urnScheme]
          if (schemeHandler) {
            urnComponents = schemeHandler.serialize(urnComponents, options)
          }
          var uriComponents = urnComponents
          var nss = urnComponents.nss
          uriComponents.path = (nid || options.nid) + ':' + nss
          return uriComponents
        },
      }
      var UUID = /^[0-9A-Fa-f]{8}(?:\-[0-9A-Fa-f]{4}){3}\-[0-9A-Fa-f]{12}$/
      var handler$6 = {
        scheme: 'urn:uuid',
        parse: function parse2(urnComponents, options) {
          var uuidComponents = urnComponents
          uuidComponents.uuid = uuidComponents.nss
          uuidComponents.nss = void 0
          if (
            !options.tolerant &&
            (!uuidComponents.uuid || !uuidComponents.uuid.match(UUID))
          ) {
            uuidComponents.error = uuidComponents.error || 'UUID is not valid.'
          }
          return uuidComponents
        },
        serialize: function serialize2(uuidComponents, options) {
          var urnComponents = uuidComponents
          urnComponents.nss = (uuidComponents.uuid || '').toLowerCase()
          return urnComponents
        },
      }
      SCHEMES[handler.scheme] = handler
      SCHEMES[handler$1.scheme] = handler$1
      SCHEMES[handler$2.scheme] = handler$2
      SCHEMES[handler$3.scheme] = handler$3
      SCHEMES[handler$4.scheme] = handler$4
      SCHEMES[handler$5.scheme] = handler$5
      SCHEMES[handler$6.scheme] = handler$6
      exports3.SCHEMES = SCHEMES
      exports3.pctEncChar = pctEncChar
      exports3.pctDecChars = pctDecChars
      exports3.parse = parse
      exports3.removeDotSegments = removeDotSegments
      exports3.serialize = serialize
      exports3.resolveComponents = resolveComponents
      exports3.resolve = resolve
      exports3.normalize = normalize
      exports3.equal = equal
      exports3.escapeComponent = escapeComponent
      exports3.unescapeComponent = unescapeComponent
      Object.defineProperty(exports3, '__esModule', { value: true })
    })
  },
})

// node_modules/ajv/dist/runtime/uri.js
var require_uri = __commonJS({
  'node_modules/ajv/dist/runtime/uri.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var uri = require_uri_all()
    uri.code = 'require("ajv/dist/runtime/uri").default'
    exports2.default = uri
  },
})

// node_modules/ajv/dist/core.js
var require_core = __commonJS({
  'node_modules/ajv/dist/core.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    exports2.CodeGen =
      exports2.Name =
      exports2.nil =
      exports2.stringify =
      exports2.str =
      exports2._ =
      exports2.KeywordCxt =
        void 0
    var validate_1 = require_validate()
    Object.defineProperty(exports2, 'KeywordCxt', {
      enumerable: true,
      get: function () {
        return validate_1.KeywordCxt
      },
    })
    var codegen_1 = require_codegen()
    Object.defineProperty(exports2, '_', {
      enumerable: true,
      get: function () {
        return codegen_1._
      },
    })
    Object.defineProperty(exports2, 'str', {
      enumerable: true,
      get: function () {
        return codegen_1.str
      },
    })
    Object.defineProperty(exports2, 'stringify', {
      enumerable: true,
      get: function () {
        return codegen_1.stringify
      },
    })
    Object.defineProperty(exports2, 'nil', {
      enumerable: true,
      get: function () {
        return codegen_1.nil
      },
    })
    Object.defineProperty(exports2, 'Name', {
      enumerable: true,
      get: function () {
        return codegen_1.Name
      },
    })
    Object.defineProperty(exports2, 'CodeGen', {
      enumerable: true,
      get: function () {
        return codegen_1.CodeGen
      },
    })
    var validation_error_1 = require_validation_error()
    var ref_error_1 = require_ref_error()
    var rules_1 = require_rules()
    var compile_1 = require_compile()
    var codegen_2 = require_codegen()
    var resolve_1 = require_resolve()
    var dataType_1 = require_dataType()
    var util_1 = require_util()
    var $dataRefSchema = require_data()
    var uri_1 = require_uri()
    var defaultRegExp = (str, flags) => new RegExp(str, flags)
    defaultRegExp.code = 'new RegExp'
    var META_IGNORE_OPTIONS = ['removeAdditional', 'useDefaults', 'coerceTypes']
    var EXT_SCOPE_NAMES = new Set([
      'validate',
      'serialize',
      'parse',
      'wrapper',
      'root',
      'schema',
      'keyword',
      'pattern',
      'formats',
      'validate$data',
      'func',
      'obj',
      'Error',
    ])
    var removedOptions = {
      errorDataPath: '',
      format: '`validateFormats: false` can be used instead.',
      nullable: '"nullable" keyword is supported by default.',
      jsonPointers: 'Deprecated jsPropertySyntax can be used instead.',
      extendRefs: 'Deprecated ignoreKeywordsWithRef can be used instead.',
      missingRefs:
        'Pass empty schema with $id that should be ignored to ajv.addSchema.',
      processCode:
        'Use option `code: {process: (code, schemaEnv: object) => string}`',
      sourceCode: 'Use option `code: {source: true}`',
      strictDefaults: 'It is default now, see option `strict`.',
      strictKeywords: 'It is default now, see option `strict`.',
      uniqueItems: '"uniqueItems" keyword is always validated.',
      unknownFormats:
        'Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).',
      cache: 'Map is used as cache, schema object as key.',
      serialize: 'Map is used as cache, schema object as key.',
      ajvErrors: 'It is default now.',
    }
    var deprecatedOptions = {
      ignoreKeywordsWithRef: '',
      jsPropertySyntax: '',
      unicode:
        '"minLength"/"maxLength" account for unicode characters by default.',
    }
    var MAX_EXPRESSION = 200
    function requiredOptions(o) {
      var _a,
        _b,
        _c,
        _d,
        _e,
        _f,
        _g,
        _h,
        _j,
        _k,
        _l,
        _m,
        _o,
        _p,
        _q,
        _r,
        _s,
        _t,
        _u,
        _v,
        _w,
        _x,
        _y,
        _z,
        _0
      const s = o.strict
      const _optz =
        (_a = o.code) === null || _a === void 0 ? void 0 : _a.optimize
      const optimize = _optz === true || _optz === void 0 ? 1 : _optz || 0
      const regExp =
        (_c = (_b = o.code) === null || _b === void 0 ? void 0 : _b.regExp) !==
          null && _c !== void 0
          ? _c
          : defaultRegExp
      const uriResolver =
        (_d = o.uriResolver) !== null && _d !== void 0 ? _d : uri_1.default
      return {
        strictSchema:
          (_f = (_e = o.strictSchema) !== null && _e !== void 0 ? _e : s) !==
            null && _f !== void 0
            ? _f
            : true,
        strictNumbers:
          (_h = (_g = o.strictNumbers) !== null && _g !== void 0 ? _g : s) !==
            null && _h !== void 0
            ? _h
            : true,
        strictTypes:
          (_k = (_j = o.strictTypes) !== null && _j !== void 0 ? _j : s) !==
            null && _k !== void 0
            ? _k
            : 'log',
        strictTuples:
          (_m = (_l = o.strictTuples) !== null && _l !== void 0 ? _l : s) !==
            null && _m !== void 0
            ? _m
            : 'log',
        strictRequired:
          (_p = (_o = o.strictRequired) !== null && _o !== void 0 ? _o : s) !==
            null && _p !== void 0
            ? _p
            : false,
        code: o.code ? { ...o.code, optimize, regExp } : { optimize, regExp },
        loopRequired:
          (_q = o.loopRequired) !== null && _q !== void 0 ? _q : MAX_EXPRESSION,
        loopEnum:
          (_r = o.loopEnum) !== null && _r !== void 0 ? _r : MAX_EXPRESSION,
        meta: (_s = o.meta) !== null && _s !== void 0 ? _s : true,
        messages: (_t = o.messages) !== null && _t !== void 0 ? _t : true,
        inlineRefs: (_u = o.inlineRefs) !== null && _u !== void 0 ? _u : true,
        schemaId: (_v = o.schemaId) !== null && _v !== void 0 ? _v : '$id',
        addUsedSchema:
          (_w = o.addUsedSchema) !== null && _w !== void 0 ? _w : true,
        validateSchema:
          (_x = o.validateSchema) !== null && _x !== void 0 ? _x : true,
        validateFormats:
          (_y = o.validateFormats) !== null && _y !== void 0 ? _y : true,
        unicodeRegExp:
          (_z = o.unicodeRegExp) !== null && _z !== void 0 ? _z : true,
        int32range: (_0 = o.int32range) !== null && _0 !== void 0 ? _0 : true,
        uriResolver,
      }
    }
    var Ajv2 = class {
      constructor(opts = {}) {
        this.schemas = {}
        this.refs = {}
        this.formats = {}
        this._compilations = new Set()
        this._loading = {}
        this._cache = new Map()
        opts = this.opts = { ...opts, ...requiredOptions(opts) }
        const { es5, lines } = this.opts.code
        this.scope = new codegen_2.ValueScope({
          scope: {},
          prefixes: EXT_SCOPE_NAMES,
          es5,
          lines,
        })
        this.logger = getLogger(opts.logger)
        const formatOpt = opts.validateFormats
        opts.validateFormats = false
        this.RULES = (0, rules_1.getRules)()
        checkOptions.call(this, removedOptions, opts, 'NOT SUPPORTED')
        checkOptions.call(this, deprecatedOptions, opts, 'DEPRECATED', 'warn')
        this._metaOpts = getMetaSchemaOptions.call(this)
        if (opts.formats) addInitialFormats.call(this)
        this._addVocabularies()
        this._addDefaultMetaSchema()
        if (opts.keywords) addInitialKeywords.call(this, opts.keywords)
        if (typeof opts.meta == 'object') this.addMetaSchema(opts.meta)
        addInitialSchemas.call(this)
        opts.validateFormats = formatOpt
      }
      _addVocabularies() {
        this.addKeyword('$async')
      }
      _addDefaultMetaSchema() {
        const { $data, meta, schemaId } = this.opts
        let _dataRefSchema = $dataRefSchema
        if (schemaId === 'id') {
          _dataRefSchema = { ...$dataRefSchema }
          _dataRefSchema.id = _dataRefSchema.$id
          delete _dataRefSchema.$id
        }
        if (meta && $data)
          this.addMetaSchema(_dataRefSchema, _dataRefSchema[schemaId], false)
      }
      defaultMeta() {
        const { meta, schemaId } = this.opts
        return (this.opts.defaultMeta =
          typeof meta == 'object' ? meta[schemaId] || meta : void 0)
      }
      validate(schemaKeyRef, data) {
        let v
        if (typeof schemaKeyRef == 'string') {
          v = this.getSchema(schemaKeyRef)
          if (!v) throw new Error(`no schema with key or ref "${schemaKeyRef}"`)
        } else {
          v = this.compile(schemaKeyRef)
        }
        const valid = v(data)
        if (!('$async' in v)) this.errors = v.errors
        return valid
      }
      compile(schema, _meta) {
        const sch = this._addSchema(schema, _meta)
        return sch.validate || this._compileSchemaEnv(sch)
      }
      compileAsync(schema, meta) {
        if (typeof this.opts.loadSchema != 'function') {
          throw new Error('options.loadSchema should be a function')
        }
        const { loadSchema } = this.opts
        return runCompileAsync.call(this, schema, meta)
        async function runCompileAsync(_schema, _meta) {
          await loadMetaSchema.call(this, _schema.$schema)
          const sch = this._addSchema(_schema, _meta)
          return sch.validate || _compileAsync.call(this, sch)
        }
        async function loadMetaSchema($ref) {
          if ($ref && !this.getSchema($ref)) {
            await runCompileAsync.call(this, { $ref }, true)
          }
        }
        async function _compileAsync(sch) {
          try {
            return this._compileSchemaEnv(sch)
          } catch (e) {
            if (!(e instanceof ref_error_1.default)) throw e
            checkLoaded.call(this, e)
            await loadMissingSchema.call(this, e.missingSchema)
            return _compileAsync.call(this, sch)
          }
        }
        function checkLoaded({ missingSchema: ref, missingRef }) {
          if (this.refs[ref]) {
            throw new Error(
              `AnySchema ${ref} is loaded but ${missingRef} cannot be resolved`
            )
          }
        }
        async function loadMissingSchema(ref) {
          const _schema = await _loadSchema.call(this, ref)
          if (!this.refs[ref]) await loadMetaSchema.call(this, _schema.$schema)
          if (!this.refs[ref]) this.addSchema(_schema, ref, meta)
        }
        async function _loadSchema(ref) {
          const p = this._loading[ref]
          if (p) return p
          try {
            return await (this._loading[ref] = loadSchema(ref))
          } finally {
            delete this._loading[ref]
          }
        }
      }
      addSchema(
        schema,
        key,
        _meta,
        _validateSchema = this.opts.validateSchema
      ) {
        if (Array.isArray(schema)) {
          for (const sch of schema)
            this.addSchema(sch, void 0, _meta, _validateSchema)
          return this
        }
        let id
        if (typeof schema === 'object') {
          const { schemaId } = this.opts
          id = schema[schemaId]
          if (id !== void 0 && typeof id != 'string') {
            throw new Error(`schema ${schemaId} must be string`)
          }
        }
        key = (0, resolve_1.normalizeId)(key || id)
        this._checkUnique(key)
        this.schemas[key] = this._addSchema(
          schema,
          _meta,
          key,
          _validateSchema,
          true
        )
        return this
      }
      addMetaSchema(schema, key, _validateSchema = this.opts.validateSchema) {
        this.addSchema(schema, key, true, _validateSchema)
        return this
      }
      validateSchema(schema, throwOrLogError) {
        if (typeof schema == 'boolean') return true
        let $schema
        $schema = schema.$schema
        if ($schema !== void 0 && typeof $schema != 'string') {
          throw new Error('$schema must be a string')
        }
        $schema = $schema || this.opts.defaultMeta || this.defaultMeta()
        if (!$schema) {
          this.logger.warn('meta-schema not available')
          this.errors = null
          return true
        }
        const valid = this.validate($schema, schema)
        if (!valid && throwOrLogError) {
          const message = 'schema is invalid: ' + this.errorsText()
          if (this.opts.validateSchema === 'log') this.logger.error(message)
          else throw new Error(message)
        }
        return valid
      }
      getSchema(keyRef) {
        let sch
        while (typeof (sch = getSchEnv.call(this, keyRef)) == 'string')
          keyRef = sch
        if (sch === void 0) {
          const { schemaId } = this.opts
          const root = new compile_1.SchemaEnv({ schema: {}, schemaId })
          sch = compile_1.resolveSchema.call(this, root, keyRef)
          if (!sch) return
          this.refs[keyRef] = sch
        }
        return sch.validate || this._compileSchemaEnv(sch)
      }
      removeSchema(schemaKeyRef) {
        if (schemaKeyRef instanceof RegExp) {
          this._removeAllSchemas(this.schemas, schemaKeyRef)
          this._removeAllSchemas(this.refs, schemaKeyRef)
          return this
        }
        switch (typeof schemaKeyRef) {
          case 'undefined':
            this._removeAllSchemas(this.schemas)
            this._removeAllSchemas(this.refs)
            this._cache.clear()
            return this
          case 'string': {
            const sch = getSchEnv.call(this, schemaKeyRef)
            if (typeof sch == 'object') this._cache.delete(sch.schema)
            delete this.schemas[schemaKeyRef]
            delete this.refs[schemaKeyRef]
            return this
          }
          case 'object': {
            const cacheKey = schemaKeyRef
            this._cache.delete(cacheKey)
            let id = schemaKeyRef[this.opts.schemaId]
            if (id) {
              id = (0, resolve_1.normalizeId)(id)
              delete this.schemas[id]
              delete this.refs[id]
            }
            return this
          }
          default:
            throw new Error('ajv.removeSchema: invalid parameter')
        }
      }
      addVocabulary(definitions) {
        for (const def of definitions) this.addKeyword(def)
        return this
      }
      addKeyword(kwdOrDef, def) {
        let keyword
        if (typeof kwdOrDef == 'string') {
          keyword = kwdOrDef
          if (typeof def == 'object') {
            this.logger.warn(
              'these parameters are deprecated, see docs for addKeyword'
            )
            def.keyword = keyword
          }
        } else if (typeof kwdOrDef == 'object' && def === void 0) {
          def = kwdOrDef
          keyword = def.keyword
          if (Array.isArray(keyword) && !keyword.length) {
            throw new Error(
              'addKeywords: keyword must be string or non-empty array'
            )
          }
        } else {
          throw new Error('invalid addKeywords parameters')
        }
        checkKeyword.call(this, keyword, def)
        if (!def) {
          ;(0, util_1.eachItem)(keyword, (kwd) => addRule.call(this, kwd))
          return this
        }
        keywordMetaschema.call(this, def)
        const definition = {
          ...def,
          type: (0, dataType_1.getJSONTypes)(def.type),
          schemaType: (0, dataType_1.getJSONTypes)(def.schemaType),
        }
        ;(0, util_1.eachItem)(
          keyword,
          definition.type.length === 0
            ? (k) => addRule.call(this, k, definition)
            : (k) =>
                definition.type.forEach((t) =>
                  addRule.call(this, k, definition, t)
                )
        )
        return this
      }
      getKeyword(keyword) {
        const rule = this.RULES.all[keyword]
        return typeof rule == 'object' ? rule.definition : !!rule
      }
      removeKeyword(keyword) {
        const { RULES } = this
        delete RULES.keywords[keyword]
        delete RULES.all[keyword]
        for (const group of RULES.rules) {
          const i = group.rules.findIndex((rule) => rule.keyword === keyword)
          if (i >= 0) group.rules.splice(i, 1)
        }
        return this
      }
      addFormat(name6, format) {
        if (typeof format == 'string') format = new RegExp(format)
        this.formats[name6] = format
        return this
      }
      errorsText(
        errors = this.errors,
        { separator = ', ', dataVar = 'data' } = {}
      ) {
        if (!errors || errors.length === 0) return 'No errors'
        return errors
          .map((e) => `${dataVar}${e.instancePath} ${e.message}`)
          .reduce((text, msg) => text + separator + msg)
      }
      $dataMetaSchema(metaSchema, keywordsJsonPointers) {
        const rules = this.RULES.all
        metaSchema = JSON.parse(JSON.stringify(metaSchema))
        for (const jsonPointer of keywordsJsonPointers) {
          const segments = jsonPointer.split('/').slice(1)
          let keywords = metaSchema
          for (const seg of segments) keywords = keywords[seg]
          for (const key in rules) {
            const rule = rules[key]
            if (typeof rule != 'object') continue
            const { $data } = rule.definition
            const schema = keywords[key]
            if ($data && schema) keywords[key] = schemaOrData(schema)
          }
        }
        return metaSchema
      }
      _removeAllSchemas(schemas, regex) {
        for (const keyRef in schemas) {
          const sch = schemas[keyRef]
          if (!regex || regex.test(keyRef)) {
            if (typeof sch == 'string') {
              delete schemas[keyRef]
            } else if (sch && !sch.meta) {
              this._cache.delete(sch.schema)
              delete schemas[keyRef]
            }
          }
        }
      }
      _addSchema(
        schema,
        meta,
        baseId,
        validateSchema = this.opts.validateSchema,
        addSchema = this.opts.addUsedSchema
      ) {
        let id
        const { schemaId } = this.opts
        if (typeof schema == 'object') {
          id = schema[schemaId]
        } else {
          if (this.opts.jtd) throw new Error('schema must be object')
          else if (typeof schema != 'boolean')
            throw new Error('schema must be object or boolean')
        }
        let sch = this._cache.get(schema)
        if (sch !== void 0) return sch
        baseId = (0, resolve_1.normalizeId)(id || baseId)
        const localRefs = resolve_1.getSchemaRefs.call(this, schema, baseId)
        sch = new compile_1.SchemaEnv({
          schema,
          schemaId,
          meta,
          baseId,
          localRefs,
        })
        this._cache.set(sch.schema, sch)
        if (addSchema && !baseId.startsWith('#')) {
          if (baseId) this._checkUnique(baseId)
          this.refs[baseId] = sch
        }
        if (validateSchema) this.validateSchema(schema, true)
        return sch
      }
      _checkUnique(id) {
        if (this.schemas[id] || this.refs[id]) {
          throw new Error(`schema with key or id "${id}" already exists`)
        }
      }
      _compileSchemaEnv(sch) {
        if (sch.meta) this._compileMetaSchema(sch)
        else compile_1.compileSchema.call(this, sch)
        if (!sch.validate) throw new Error('ajv implementation error')
        return sch.validate
      }
      _compileMetaSchema(sch) {
        const currentOpts = this.opts
        this.opts = this._metaOpts
        try {
          compile_1.compileSchema.call(this, sch)
        } finally {
          this.opts = currentOpts
        }
      }
    }
    exports2.default = Ajv2
    Ajv2.ValidationError = validation_error_1.default
    Ajv2.MissingRefError = ref_error_1.default
    function checkOptions(checkOpts, options, msg, log = 'error') {
      for (const key in checkOpts) {
        const opt = key
        if (opt in options)
          this.logger[log](`${msg}: option ${key}. ${checkOpts[opt]}`)
      }
    }
    function getSchEnv(keyRef) {
      keyRef = (0, resolve_1.normalizeId)(keyRef)
      return this.schemas[keyRef] || this.refs[keyRef]
    }
    function addInitialSchemas() {
      const optsSchemas = this.opts.schemas
      if (!optsSchemas) return
      if (Array.isArray(optsSchemas)) this.addSchema(optsSchemas)
      else for (const key in optsSchemas) this.addSchema(optsSchemas[key], key)
    }
    function addInitialFormats() {
      for (const name6 in this.opts.formats) {
        const format = this.opts.formats[name6]
        if (format) this.addFormat(name6, format)
      }
    }
    function addInitialKeywords(defs) {
      if (Array.isArray(defs)) {
        this.addVocabulary(defs)
        return
      }
      this.logger.warn('keywords option as map is deprecated, pass array')
      for (const keyword in defs) {
        const def = defs[keyword]
        if (!def.keyword) def.keyword = keyword
        this.addKeyword(def)
      }
    }
    function getMetaSchemaOptions() {
      const metaOpts = { ...this.opts }
      for (const opt of META_IGNORE_OPTIONS) delete metaOpts[opt]
      return metaOpts
    }
    var noLogs = { log() {}, warn() {}, error() {} }
    function getLogger(logger) {
      if (logger === false) return noLogs
      if (logger === void 0) return console
      if (logger.log && logger.warn && logger.error) return logger
      throw new Error('logger must implement log, warn and error methods')
    }
    var KEYWORD_NAME = /^[a-z_$][a-z0-9_$:-]*$/i
    function checkKeyword(keyword, def) {
      const { RULES } = this
      ;(0, util_1.eachItem)(keyword, (kwd) => {
        if (RULES.keywords[kwd])
          throw new Error(`Keyword ${kwd} is already defined`)
        if (!KEYWORD_NAME.test(kwd))
          throw new Error(`Keyword ${kwd} has invalid name`)
      })
      if (!def) return
      if (def.$data && !('code' in def || 'validate' in def)) {
        throw new Error('$data keyword must have "code" or "validate" function')
      }
    }
    function addRule(keyword, definition, dataType) {
      var _a
      const post =
        definition === null || definition === void 0 ? void 0 : definition.post
      if (dataType && post)
        throw new Error('keyword with "post" flag cannot have "type"')
      const { RULES } = this
      let ruleGroup = post
        ? RULES.post
        : RULES.rules.find(({ type: t }) => t === dataType)
      if (!ruleGroup) {
        ruleGroup = { type: dataType, rules: [] }
        RULES.rules.push(ruleGroup)
      }
      RULES.keywords[keyword] = true
      if (!definition) return
      const rule = {
        keyword,
        definition: {
          ...definition,
          type: (0, dataType_1.getJSONTypes)(definition.type),
          schemaType: (0, dataType_1.getJSONTypes)(definition.schemaType),
        },
      }
      if (definition.before)
        addBeforeRule.call(this, ruleGroup, rule, definition.before)
      else ruleGroup.rules.push(rule)
      RULES.all[keyword] = rule
      ;(_a = definition.implements) === null || _a === void 0
        ? void 0
        : _a.forEach((kwd) => this.addKeyword(kwd))
    }
    function addBeforeRule(ruleGroup, rule, before) {
      const i = ruleGroup.rules.findIndex((_rule) => _rule.keyword === before)
      if (i >= 0) {
        ruleGroup.rules.splice(i, 0, rule)
      } else {
        ruleGroup.rules.push(rule)
        this.logger.warn(`rule ${before} is not defined`)
      }
    }
    function keywordMetaschema(def) {
      let { metaSchema } = def
      if (metaSchema === void 0) return
      if (def.$data && this.opts.$data) metaSchema = schemaOrData(metaSchema)
      def.validateSchema = this.compile(metaSchema, true)
    }
    var $dataRef = {
      $ref: 'https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#',
    }
    function schemaOrData(schema) {
      return { anyOf: [schema, $dataRef] }
    }
  },
})

// node_modules/ajv/dist/vocabularies/core/id.js
var require_id = __commonJS({
  'node_modules/ajv/dist/vocabularies/core/id.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var def = {
      keyword: 'id',
      code() {
        throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID')
      },
    }
    exports2.default = def
  },
})

// node_modules/ajv/dist/vocabularies/core/ref.js
var require_ref = __commonJS({
  'node_modules/ajv/dist/vocabularies/core/ref.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    exports2.callRef = exports2.getValidate = void 0
    var ref_error_1 = require_ref_error()
    var code_1 = require_code2()
    var codegen_1 = require_codegen()
    var names_1 = require_names()
    var compile_1 = require_compile()
    var util_1 = require_util()
    var def = {
      keyword: '$ref',
      schemaType: 'string',
      code(cxt) {
        const { gen, schema: $ref, it } = cxt
        const { baseId, schemaEnv: env, validateName, opts, self: self2 } = it
        const { root } = env
        if (($ref === '#' || $ref === '#/') && baseId === root.baseId)
          return callRootRef()
        const schOrEnv = compile_1.resolveRef.call(self2, root, baseId, $ref)
        if (schOrEnv === void 0)
          throw new ref_error_1.default(it.opts.uriResolver, baseId, $ref)
        if (schOrEnv instanceof compile_1.SchemaEnv)
          return callValidate(schOrEnv)
        return inlineRefSchema(schOrEnv)
        function callRootRef() {
          if (env === root) return callRef(cxt, validateName, env, env.$async)
          const rootName = gen.scopeValue('root', { ref: root })
          return callRef(
            cxt,
            (0, codegen_1._)`${rootName}.validate`,
            root,
            root.$async
          )
        }
        function callValidate(sch) {
          const v = getValidate(cxt, sch)
          callRef(cxt, v, sch, sch.$async)
        }
        function inlineRefSchema(sch) {
          const schName = gen.scopeValue(
            'schema',
            opts.code.source === true
              ? { ref: sch, code: (0, codegen_1.stringify)(sch) }
              : { ref: sch }
          )
          const valid = gen.name('valid')
          const schCxt = cxt.subschema(
            {
              schema: sch,
              dataTypes: [],
              schemaPath: codegen_1.nil,
              topSchemaRef: schName,
              errSchemaPath: $ref,
            },
            valid
          )
          cxt.mergeEvaluated(schCxt)
          cxt.ok(valid)
        }
      },
    }
    function getValidate(cxt, sch) {
      const { gen } = cxt
      return sch.validate
        ? gen.scopeValue('validate', { ref: sch.validate })
        : (0, codegen_1._)`${gen.scopeValue('wrapper', { ref: sch })}.validate`
    }
    exports2.getValidate = getValidate
    function callRef(cxt, v, sch, $async) {
      const { gen, it } = cxt
      const { allErrors, schemaEnv: env, opts } = it
      const passCxt = opts.passContext ? names_1.default.this : codegen_1.nil
      if ($async) callAsyncRef()
      else callSyncRef()
      function callAsyncRef() {
        if (!env.$async)
          throw new Error('async schema referenced by sync schema')
        const valid = gen.let('valid')
        gen.try(
          () => {
            gen.code(
              (0, codegen_1._)`await ${(0, code_1.callValidateCode)(
                cxt,
                v,
                passCxt
              )}`
            )
            addEvaluatedFrom(v)
            if (!allErrors) gen.assign(valid, true)
          },
          (e) => {
            gen.if(
              (0, codegen_1._)`!(${e} instanceof ${it.ValidationError})`,
              () => gen.throw(e)
            )
            addErrorsFrom(e)
            if (!allErrors) gen.assign(valid, false)
          }
        )
        cxt.ok(valid)
      }
      function callSyncRef() {
        cxt.result(
          (0, code_1.callValidateCode)(cxt, v, passCxt),
          () => addEvaluatedFrom(v),
          () => addErrorsFrom(v)
        )
      }
      function addErrorsFrom(source) {
        const errs = (0, codegen_1._)`${source}.errors`
        gen.assign(
          names_1.default.vErrors,
          (0,
          codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`
        )
        gen.assign(
          names_1.default.errors,
          (0, codegen_1._)`${names_1.default.vErrors}.length`
        )
      }
      function addEvaluatedFrom(source) {
        var _a
        if (!it.opts.unevaluated) return
        const schEvaluated =
          (_a = sch === null || sch === void 0 ? void 0 : sch.validate) ===
            null || _a === void 0
            ? void 0
            : _a.evaluated
        if (it.props !== true) {
          if (schEvaluated && !schEvaluated.dynamicProps) {
            if (schEvaluated.props !== void 0) {
              it.props = util_1.mergeEvaluated.props(
                gen,
                schEvaluated.props,
                it.props
              )
            }
          } else {
            const props = gen.var(
              'props',
              (0, codegen_1._)`${source}.evaluated.props`
            )
            it.props = util_1.mergeEvaluated.props(
              gen,
              props,
              it.props,
              codegen_1.Name
            )
          }
        }
        if (it.items !== true) {
          if (schEvaluated && !schEvaluated.dynamicItems) {
            if (schEvaluated.items !== void 0) {
              it.items = util_1.mergeEvaluated.items(
                gen,
                schEvaluated.items,
                it.items
              )
            }
          } else {
            const items = gen.var(
              'items',
              (0, codegen_1._)`${source}.evaluated.items`
            )
            it.items = util_1.mergeEvaluated.items(
              gen,
              items,
              it.items,
              codegen_1.Name
            )
          }
        }
      }
    }
    exports2.callRef = callRef
    exports2.default = def
  },
})

// node_modules/ajv/dist/vocabularies/core/index.js
var require_core2 = __commonJS({
  'node_modules/ajv/dist/vocabularies/core/index.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var id_1 = require_id()
    var ref_1 = require_ref()
    var core = [
      '$schema',
      '$id',
      '$defs',
      '$vocabulary',
      { keyword: '$comment' },
      'definitions',
      id_1.default,
      ref_1.default,
    ]
    exports2.default = core
  },
})

// node_modules/ajv/dist/vocabularies/validation/limitNumber.js
var require_limitNumber = __commonJS({
  'node_modules/ajv/dist/vocabularies/validation/limitNumber.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var codegen_1 = require_codegen()
    var ops = codegen_1.operators
    var KWDs = {
      maximum: { okStr: '<=', ok: ops.LTE, fail: ops.GT },
      minimum: { okStr: '>=', ok: ops.GTE, fail: ops.LT },
      exclusiveMaximum: { okStr: '<', ok: ops.LT, fail: ops.GTE },
      exclusiveMinimum: { okStr: '>', ok: ops.GT, fail: ops.LTE },
    }
    var error = {
      message: ({ keyword, schemaCode }) =>
        (0, codegen_1.str)`must be ${KWDs[keyword].okStr} ${schemaCode}`,
      params: ({ keyword, schemaCode }) =>
        (0,
        codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`,
    }
    var def = {
      keyword: Object.keys(KWDs),
      type: 'number',
      schemaType: 'number',
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt
        cxt.fail$data(
          (0,
          codegen_1._)`${data} ${KWDs[keyword].fail} ${schemaCode} || isNaN(${data})`
        )
      },
    }
    exports2.default = def
  },
})

// node_modules/ajv/dist/vocabularies/validation/multipleOf.js
var require_multipleOf = __commonJS({
  'node_modules/ajv/dist/vocabularies/validation/multipleOf.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var codegen_1 = require_codegen()
    var error = {
      message: ({ schemaCode }) =>
        (0, codegen_1.str)`must be multiple of ${schemaCode}`,
      params: ({ schemaCode }) => (0, codegen_1._)`{multipleOf: ${schemaCode}}`,
    }
    var def = {
      keyword: 'multipleOf',
      type: 'number',
      schemaType: 'number',
      $data: true,
      error,
      code(cxt) {
        const { gen, data, schemaCode, it } = cxt
        const prec = it.opts.multipleOfPrecision
        const res = gen.let('res')
        const invalid = prec
          ? (0, codegen_1._)`Math.abs(Math.round(${res}) - ${res}) > 1e-${prec}`
          : (0, codegen_1._)`${res} !== parseInt(${res})`
        cxt.fail$data(
          (0,
          codegen_1._)`(${schemaCode} === 0 || (${res} = ${data}/${schemaCode}, ${invalid}))`
        )
      },
    }
    exports2.default = def
  },
})

// node_modules/ajv/dist/runtime/ucs2length.js
var require_ucs2length = __commonJS({
  'node_modules/ajv/dist/runtime/ucs2length.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    function ucs2length(str) {
      const len = str.length
      let length2 = 0
      let pos = 0
      let value
      while (pos < len) {
        length2++
        value = str.charCodeAt(pos++)
        if (value >= 55296 && value <= 56319 && pos < len) {
          value = str.charCodeAt(pos)
          if ((value & 64512) === 56320) pos++
        }
      }
      return length2
    }
    exports2.default = ucs2length
    ucs2length.code = 'require("ajv/dist/runtime/ucs2length").default'
  },
})

// node_modules/ajv/dist/vocabularies/validation/limitLength.js
var require_limitLength = __commonJS({
  'node_modules/ajv/dist/vocabularies/validation/limitLength.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var codegen_1 = require_codegen()
    var util_1 = require_util()
    var ucs2length_1 = require_ucs2length()
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === 'maxLength' ? 'more' : 'fewer'
        return (0,
        codegen_1.str)`must NOT have ${comp} than ${schemaCode} characters`
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`,
    }
    var def = {
      keyword: ['maxLength', 'minLength'],
      type: 'string',
      schemaType: 'number',
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode, it } = cxt
        const op =
          keyword === 'maxLength'
            ? codegen_1.operators.GT
            : codegen_1.operators.LT
        const len =
          it.opts.unicode === false
            ? (0, codegen_1._)`${data}.length`
            : (0, codegen_1._)`${(0, util_1.useFunc)(
                cxt.gen,
                ucs2length_1.default
              )}(${data})`
        cxt.fail$data((0, codegen_1._)`${len} ${op} ${schemaCode}`)
      },
    }
    exports2.default = def
  },
})

// node_modules/ajv/dist/vocabularies/validation/pattern.js
var require_pattern = __commonJS({
  'node_modules/ajv/dist/vocabularies/validation/pattern.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var code_1 = require_code2()
    var codegen_1 = require_codegen()
    var error = {
      message: ({ schemaCode }) =>
        (0, codegen_1.str)`must match pattern "${schemaCode}"`,
      params: ({ schemaCode }) => (0, codegen_1._)`{pattern: ${schemaCode}}`,
    }
    var def = {
      keyword: 'pattern',
      type: 'string',
      schemaType: 'string',
      $data: true,
      error,
      code(cxt) {
        const { data, $data, schema, schemaCode, it } = cxt
        const u = it.opts.unicodeRegExp ? 'u' : ''
        const regExp = $data
          ? (0, codegen_1._)`(new RegExp(${schemaCode}, ${u}))`
          : (0, code_1.usePattern)(cxt, schema)
        cxt.fail$data((0, codegen_1._)`!${regExp}.test(${data})`)
      },
    }
    exports2.default = def
  },
})

// node_modules/ajv/dist/vocabularies/validation/limitProperties.js
var require_limitProperties = __commonJS({
  'node_modules/ajv/dist/vocabularies/validation/limitProperties.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var codegen_1 = require_codegen()
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === 'maxProperties' ? 'more' : 'fewer'
        return (0,
        codegen_1.str)`must NOT have ${comp} than ${schemaCode} properties`
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`,
    }
    var def = {
      keyword: ['maxProperties', 'minProperties'],
      type: 'object',
      schemaType: 'number',
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt
        const op =
          keyword === 'maxProperties'
            ? codegen_1.operators.GT
            : codegen_1.operators.LT
        cxt.fail$data(
          (0, codegen_1._)`Object.keys(${data}).length ${op} ${schemaCode}`
        )
      },
    }
    exports2.default = def
  },
})

// node_modules/ajv/dist/vocabularies/validation/required.js
var require_required = __commonJS({
  'node_modules/ajv/dist/vocabularies/validation/required.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var code_1 = require_code2()
    var codegen_1 = require_codegen()
    var util_1 = require_util()
    var error = {
      message: ({ params: { missingProperty } }) =>
        (0, codegen_1.str)`must have required property '${missingProperty}'`,
      params: ({ params: { missingProperty } }) =>
        (0, codegen_1._)`{missingProperty: ${missingProperty}}`,
    }
    var def = {
      keyword: 'required',
      type: 'object',
      schemaType: 'array',
      $data: true,
      error,
      code(cxt) {
        const { gen, schema, schemaCode, data, $data, it } = cxt
        const { opts } = it
        if (!$data && schema.length === 0) return
        const useLoop = schema.length >= opts.loopRequired
        if (it.allErrors) allErrorsMode()
        else exitOnErrorMode()
        if (opts.strictRequired) {
          const props = cxt.parentSchema.properties
          const { definedProperties } = cxt.it
          for (const requiredKey of schema) {
            if (
              (props === null || props === void 0
                ? void 0
                : props[requiredKey]) === void 0 &&
              !definedProperties.has(requiredKey)
            ) {
              const schemaPath = it.schemaEnv.baseId + it.errSchemaPath
              const msg = `required property "${requiredKey}" is not defined at "${schemaPath}" (strictRequired)`
              ;(0, util_1.checkStrictMode)(it, msg, it.opts.strictRequired)
            }
          }
        }
        function allErrorsMode() {
          if (useLoop || $data) {
            cxt.block$data(codegen_1.nil, loopAllRequired)
          } else {
            for (const prop of schema) {
              ;(0, code_1.checkReportMissingProp)(cxt, prop)
            }
          }
        }
        function exitOnErrorMode() {
          const missing = gen.let('missing')
          if (useLoop || $data) {
            const valid = gen.let('valid', true)
            cxt.block$data(valid, () => loopUntilMissing(missing, valid))
            cxt.ok(valid)
          } else {
            gen.if((0, code_1.checkMissingProp)(cxt, schema, missing))
            ;(0, code_1.reportMissingProp)(cxt, missing)
            gen.else()
          }
        }
        function loopAllRequired() {
          gen.forOf('prop', schemaCode, (prop) => {
            cxt.setParams({ missingProperty: prop })
            gen.if(
              (0, code_1.noPropertyInData)(gen, data, prop, opts.ownProperties),
              () => cxt.error()
            )
          })
        }
        function loopUntilMissing(missing, valid) {
          cxt.setParams({ missingProperty: missing })
          gen.forOf(
            missing,
            schemaCode,
            () => {
              gen.assign(
                valid,
                (0, code_1.propertyInData)(
                  gen,
                  data,
                  missing,
                  opts.ownProperties
                )
              )
              gen.if((0, codegen_1.not)(valid), () => {
                cxt.error()
                gen.break()
              })
            },
            codegen_1.nil
          )
        }
      },
    }
    exports2.default = def
  },
})

// node_modules/ajv/dist/vocabularies/validation/limitItems.js
var require_limitItems = __commonJS({
  'node_modules/ajv/dist/vocabularies/validation/limitItems.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var codegen_1 = require_codegen()
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === 'maxItems' ? 'more' : 'fewer'
        return (0,
        codegen_1.str)`must NOT have ${comp} than ${schemaCode} items`
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`,
    }
    var def = {
      keyword: ['maxItems', 'minItems'],
      type: 'array',
      schemaType: 'number',
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt
        const op =
          keyword === 'maxItems'
            ? codegen_1.operators.GT
            : codegen_1.operators.LT
        cxt.fail$data((0, codegen_1._)`${data}.length ${op} ${schemaCode}`)
      },
    }
    exports2.default = def
  },
})

// node_modules/ajv/dist/runtime/equal.js
var require_equal = __commonJS({
  'node_modules/ajv/dist/runtime/equal.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var equal = require_fast_deep_equal()
    equal.code = 'require("ajv/dist/runtime/equal").default'
    exports2.default = equal
  },
})

// node_modules/ajv/dist/vocabularies/validation/uniqueItems.js
var require_uniqueItems = __commonJS({
  'node_modules/ajv/dist/vocabularies/validation/uniqueItems.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var dataType_1 = require_dataType()
    var codegen_1 = require_codegen()
    var util_1 = require_util()
    var equal_1 = require_equal()
    var error = {
      message: ({ params: { i, j } }) =>
        (0,
        codegen_1.str)`must NOT have duplicate items (items ## ${j} and ${i} are identical)`,
      params: ({ params: { i, j } }) => (0, codegen_1._)`{i: ${i}, j: ${j}}`,
    }
    var def = {
      keyword: 'uniqueItems',
      type: 'array',
      schemaType: 'boolean',
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schema, parentSchema, schemaCode, it } = cxt
        if (!$data && !schema) return
        const valid = gen.let('valid')
        const itemTypes = parentSchema.items
          ? (0, dataType_1.getSchemaTypes)(parentSchema.items)
          : []
        cxt.block$data(
          valid,
          validateUniqueItems,
          (0, codegen_1._)`${schemaCode} === false`
        )
        cxt.ok(valid)
        function validateUniqueItems() {
          const i = gen.let('i', (0, codegen_1._)`${data}.length`)
          const j = gen.let('j')
          cxt.setParams({ i, j })
          gen.assign(valid, true)
          gen.if((0, codegen_1._)`${i} > 1`, () =>
            (canOptimize() ? loopN : loopN2)(i, j)
          )
        }
        function canOptimize() {
          return (
            itemTypes.length > 0 &&
            !itemTypes.some((t) => t === 'object' || t === 'array')
          )
        }
        function loopN(i, j) {
          const item = gen.name('item')
          const wrongType = (0, dataType_1.checkDataTypes)(
            itemTypes,
            item,
            it.opts.strictNumbers,
            dataType_1.DataType.Wrong
          )
          const indices = gen.const('indices', (0, codegen_1._)`{}`)
          gen.for((0, codegen_1._)`;${i}--;`, () => {
            gen.let(item, (0, codegen_1._)`${data}[${i}]`)
            gen.if(wrongType, (0, codegen_1._)`continue`)
            if (itemTypes.length > 1)
              gen.if(
                (0, codegen_1._)`typeof ${item} == "string"`,
                (0, codegen_1._)`${item} += "_"`
              )
            gen
              .if(
                (0, codegen_1._)`typeof ${indices}[${item}] == "number"`,
                () => {
                  gen.assign(j, (0, codegen_1._)`${indices}[${item}]`)
                  cxt.error()
                  gen.assign(valid, false).break()
                }
              )
              .code((0, codegen_1._)`${indices}[${item}] = ${i}`)
          })
        }
        function loopN2(i, j) {
          const eql = (0, util_1.useFunc)(gen, equal_1.default)
          const outer = gen.name('outer')
          gen.label(outer).for((0, codegen_1._)`;${i}--;`, () =>
            gen.for((0, codegen_1._)`${j} = ${i}; ${j}--;`, () =>
              gen.if(
                (0, codegen_1._)`${eql}(${data}[${i}], ${data}[${j}])`,
                () => {
                  cxt.error()
                  gen.assign(valid, false).break(outer)
                }
              )
            )
          )
        }
      },
    }
    exports2.default = def
  },
})

// node_modules/ajv/dist/vocabularies/validation/const.js
var require_const = __commonJS({
  'node_modules/ajv/dist/vocabularies/validation/const.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var codegen_1 = require_codegen()
    var util_1 = require_util()
    var equal_1 = require_equal()
    var error = {
      message: 'must be equal to constant',
      params: ({ schemaCode }) =>
        (0, codegen_1._)`{allowedValue: ${schemaCode}}`,
    }
    var def = {
      keyword: 'const',
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schemaCode, schema } = cxt
        if ($data || (schema && typeof schema == 'object')) {
          cxt.fail$data(
            (0, codegen_1._)`!${(0, util_1.useFunc)(
              gen,
              equal_1.default
            )}(${data}, ${schemaCode})`
          )
        } else {
          cxt.fail((0, codegen_1._)`${schema} !== ${data}`)
        }
      },
    }
    exports2.default = def
  },
})

// node_modules/ajv/dist/vocabularies/validation/enum.js
var require_enum = __commonJS({
  'node_modules/ajv/dist/vocabularies/validation/enum.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var codegen_1 = require_codegen()
    var util_1 = require_util()
    var equal_1 = require_equal()
    var error = {
      message: 'must be equal to one of the allowed values',
      params: ({ schemaCode }) =>
        (0, codegen_1._)`{allowedValues: ${schemaCode}}`,
    }
    var def = {
      keyword: 'enum',
      schemaType: 'array',
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schema, schemaCode, it } = cxt
        if (!$data && schema.length === 0)
          throw new Error('enum must have non-empty array')
        const useLoop = schema.length >= it.opts.loopEnum
        let eql
        const getEql = () =>
          eql !== null && eql !== void 0
            ? eql
            : (eql = (0, util_1.useFunc)(gen, equal_1.default))
        let valid
        if (useLoop || $data) {
          valid = gen.let('valid')
          cxt.block$data(valid, loopEnum)
        } else {
          if (!Array.isArray(schema))
            throw new Error('ajv implementation error')
          const vSchema = gen.const('vSchema', schemaCode)
          valid = (0, codegen_1.or)(
            ...schema.map((_x, i) => equalCode(vSchema, i))
          )
        }
        cxt.pass(valid)
        function loopEnum() {
          gen.assign(valid, false)
          gen.forOf('v', schemaCode, (v) =>
            gen.if((0, codegen_1._)`${getEql()}(${data}, ${v})`, () =>
              gen.assign(valid, true).break()
            )
          )
        }
        function equalCode(vSchema, i) {
          const sch = schema[i]
          return typeof sch === 'object' && sch !== null
            ? (0, codegen_1._)`${getEql()}(${data}, ${vSchema}[${i}])`
            : (0, codegen_1._)`${data} === ${sch}`
        }
      },
    }
    exports2.default = def
  },
})

// node_modules/ajv/dist/vocabularies/validation/index.js
var require_validation = __commonJS({
  'node_modules/ajv/dist/vocabularies/validation/index.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var limitNumber_1 = require_limitNumber()
    var multipleOf_1 = require_multipleOf()
    var limitLength_1 = require_limitLength()
    var pattern_1 = require_pattern()
    var limitProperties_1 = require_limitProperties()
    var required_1 = require_required()
    var limitItems_1 = require_limitItems()
    var uniqueItems_1 = require_uniqueItems()
    var const_1 = require_const()
    var enum_1 = require_enum()
    var validation = [
      limitNumber_1.default,
      multipleOf_1.default,
      limitLength_1.default,
      pattern_1.default,
      limitProperties_1.default,
      required_1.default,
      limitItems_1.default,
      uniqueItems_1.default,
      { keyword: 'type', schemaType: ['string', 'array'] },
      { keyword: 'nullable', schemaType: 'boolean' },
      const_1.default,
      enum_1.default,
    ]
    exports2.default = validation
  },
})

// node_modules/ajv/dist/vocabularies/applicator/additionalItems.js
var require_additionalItems = __commonJS({
  'node_modules/ajv/dist/vocabularies/applicator/additionalItems.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    exports2.validateAdditionalItems = void 0
    var codegen_1 = require_codegen()
    var util_1 = require_util()
    var error = {
      message: ({ params: { len } }) =>
        (0, codegen_1.str)`must NOT have more than ${len} items`,
      params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`,
    }
    var def = {
      keyword: 'additionalItems',
      type: 'array',
      schemaType: ['boolean', 'object'],
      before: 'uniqueItems',
      error,
      code(cxt) {
        const { parentSchema, it } = cxt
        const { items } = parentSchema
        if (!Array.isArray(items)) {
          ;(0, util_1.checkStrictMode)(
            it,
            '"additionalItems" is ignored when "items" is not an array of schemas'
          )
          return
        }
        validateAdditionalItems(cxt, items)
      },
    }
    function validateAdditionalItems(cxt, items) {
      const { gen, schema, data, keyword, it } = cxt
      it.items = true
      const len = gen.const('len', (0, codegen_1._)`${data}.length`)
      if (schema === false) {
        cxt.setParams({ len: items.length })
        cxt.pass((0, codegen_1._)`${len} <= ${items.length}`)
      } else if (
        typeof schema == 'object' &&
        !(0, util_1.alwaysValidSchema)(it, schema)
      ) {
        const valid = gen.var(
          'valid',
          (0, codegen_1._)`${len} <= ${items.length}`
        )
        gen.if((0, codegen_1.not)(valid), () => validateItems(valid))
        cxt.ok(valid)
      }
      function validateItems(valid) {
        gen.forRange('i', items.length, len, (i) => {
          cxt.subschema(
            { keyword, dataProp: i, dataPropType: util_1.Type.Num },
            valid
          )
          if (!it.allErrors)
            gen.if((0, codegen_1.not)(valid), () => gen.break())
        })
      }
    }
    exports2.validateAdditionalItems = validateAdditionalItems
    exports2.default = def
  },
})

// node_modules/ajv/dist/vocabularies/applicator/items.js
var require_items = __commonJS({
  'node_modules/ajv/dist/vocabularies/applicator/items.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    exports2.validateTuple = void 0
    var codegen_1 = require_codegen()
    var util_1 = require_util()
    var code_1 = require_code2()
    var def = {
      keyword: 'items',
      type: 'array',
      schemaType: ['object', 'array', 'boolean'],
      before: 'uniqueItems',
      code(cxt) {
        const { schema, it } = cxt
        if (Array.isArray(schema))
          return validateTuple(cxt, 'additionalItems', schema)
        it.items = true
        if ((0, util_1.alwaysValidSchema)(it, schema)) return
        cxt.ok((0, code_1.validateArray)(cxt))
      },
    }
    function validateTuple(cxt, extraItems, schArr = cxt.schema) {
      const { gen, parentSchema, data, keyword, it } = cxt
      checkStrictTuple(parentSchema)
      if (it.opts.unevaluated && schArr.length && it.items !== true) {
        it.items = util_1.mergeEvaluated.items(gen, schArr.length, it.items)
      }
      const valid = gen.name('valid')
      const len = gen.const('len', (0, codegen_1._)`${data}.length`)
      schArr.forEach((sch, i) => {
        if ((0, util_1.alwaysValidSchema)(it, sch)) return
        gen.if((0, codegen_1._)`${len} > ${i}`, () =>
          cxt.subschema(
            {
              keyword,
              schemaProp: i,
              dataProp: i,
            },
            valid
          )
        )
        cxt.ok(valid)
      })
      function checkStrictTuple(sch) {
        const { opts, errSchemaPath } = it
        const l = schArr.length
        const fullTuple =
          l === sch.minItems &&
          (l === sch.maxItems || sch[extraItems] === false)
        if (opts.strictTuples && !fullTuple) {
          const msg = `"${keyword}" is ${l}-tuple, but minItems or maxItems/${extraItems} are not specified or different at path "${errSchemaPath}"`
          ;(0, util_1.checkStrictMode)(it, msg, opts.strictTuples)
        }
      }
    }
    exports2.validateTuple = validateTuple
    exports2.default = def
  },
})

// node_modules/ajv/dist/vocabularies/applicator/prefixItems.js
var require_prefixItems = __commonJS({
  'node_modules/ajv/dist/vocabularies/applicator/prefixItems.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var items_1 = require_items()
    var def = {
      keyword: 'prefixItems',
      type: 'array',
      schemaType: ['array'],
      before: 'uniqueItems',
      code: (cxt) => (0, items_1.validateTuple)(cxt, 'items'),
    }
    exports2.default = def
  },
})

// node_modules/ajv/dist/vocabularies/applicator/items2020.js
var require_items2020 = __commonJS({
  'node_modules/ajv/dist/vocabularies/applicator/items2020.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var codegen_1 = require_codegen()
    var util_1 = require_util()
    var code_1 = require_code2()
    var additionalItems_1 = require_additionalItems()
    var error = {
      message: ({ params: { len } }) =>
        (0, codegen_1.str)`must NOT have more than ${len} items`,
      params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`,
    }
    var def = {
      keyword: 'items',
      type: 'array',
      schemaType: ['object', 'boolean'],
      before: 'uniqueItems',
      error,
      code(cxt) {
        const { schema, parentSchema, it } = cxt
        const { prefixItems } = parentSchema
        it.items = true
        if ((0, util_1.alwaysValidSchema)(it, schema)) return
        if (prefixItems)
          (0, additionalItems_1.validateAdditionalItems)(cxt, prefixItems)
        else cxt.ok((0, code_1.validateArray)(cxt))
      },
    }
    exports2.default = def
  },
})

// node_modules/ajv/dist/vocabularies/applicator/contains.js
var require_contains = __commonJS({
  'node_modules/ajv/dist/vocabularies/applicator/contains.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var codegen_1 = require_codegen()
    var util_1 = require_util()
    var error = {
      message: ({ params: { min, max } }) =>
        max === void 0
          ? (0, codegen_1.str)`must contain at least ${min} valid item(s)`
          : (0,
            codegen_1.str)`must contain at least ${min} and no more than ${max} valid item(s)`,
      params: ({ params: { min, max } }) =>
        max === void 0
          ? (0, codegen_1._)`{minContains: ${min}}`
          : (0, codegen_1._)`{minContains: ${min}, maxContains: ${max}}`,
    }
    var def = {
      keyword: 'contains',
      type: 'array',
      schemaType: ['object', 'boolean'],
      before: 'uniqueItems',
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, parentSchema, data, it } = cxt
        let min
        let max
        const { minContains, maxContains } = parentSchema
        if (it.opts.next) {
          min = minContains === void 0 ? 1 : minContains
          max = maxContains
        } else {
          min = 1
        }
        const len = gen.const('len', (0, codegen_1._)`${data}.length`)
        cxt.setParams({ min, max })
        if (max === void 0 && min === 0) {
          ;(0, util_1.checkStrictMode)(
            it,
            `"minContains" == 0 without "maxContains": "contains" keyword ignored`
          )
          return
        }
        if (max !== void 0 && min > max) {
          ;(0, util_1.checkStrictMode)(
            it,
            `"minContains" > "maxContains" is always invalid`
          )
          cxt.fail()
          return
        }
        if ((0, util_1.alwaysValidSchema)(it, schema)) {
          let cond = (0, codegen_1._)`${len} >= ${min}`
          if (max !== void 0)
            cond = (0, codegen_1._)`${cond} && ${len} <= ${max}`
          cxt.pass(cond)
          return
        }
        it.items = true
        const valid = gen.name('valid')
        if (max === void 0 && min === 1) {
          validateItems(valid, () => gen.if(valid, () => gen.break()))
        } else if (min === 0) {
          gen.let(valid, true)
          if (max !== void 0)
            gen.if((0, codegen_1._)`${data}.length > 0`, validateItemsWithCount)
        } else {
          gen.let(valid, false)
          validateItemsWithCount()
        }
        cxt.result(valid, () => cxt.reset())
        function validateItemsWithCount() {
          const schValid = gen.name('_valid')
          const count = gen.let('count', 0)
          validateItems(schValid, () =>
            gen.if(schValid, () => checkLimits(count))
          )
        }
        function validateItems(_valid, block) {
          gen.forRange('i', 0, len, (i) => {
            cxt.subschema(
              {
                keyword: 'contains',
                dataProp: i,
                dataPropType: util_1.Type.Num,
                compositeRule: true,
              },
              _valid
            )
            block()
          })
        }
        function checkLimits(count) {
          gen.code((0, codegen_1._)`${count}++`)
          if (max === void 0) {
            gen.if((0, codegen_1._)`${count} >= ${min}`, () =>
              gen.assign(valid, true).break()
            )
          } else {
            gen.if((0, codegen_1._)`${count} > ${max}`, () =>
              gen.assign(valid, false).break()
            )
            if (min === 1) gen.assign(valid, true)
            else
              gen.if((0, codegen_1._)`${count} >= ${min}`, () =>
                gen.assign(valid, true)
              )
          }
        }
      },
    }
    exports2.default = def
  },
})

// node_modules/ajv/dist/vocabularies/applicator/dependencies.js
var require_dependencies = __commonJS({
  'node_modules/ajv/dist/vocabularies/applicator/dependencies.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    exports2.validateSchemaDeps =
      exports2.validatePropertyDeps =
      exports2.error =
        void 0
    var codegen_1 = require_codegen()
    var util_1 = require_util()
    var code_1 = require_code2()
    exports2.error = {
      message: ({ params: { property, depsCount, deps } }) => {
        const property_ies = depsCount === 1 ? 'property' : 'properties'
        return (0,
        codegen_1.str)`must have ${property_ies} ${deps} when property ${property} is present`
      },
      params: ({
        params: { property, depsCount, deps, missingProperty },
      }) => (0, codegen_1._)`{property: ${property},
    missingProperty: ${missingProperty},
    depsCount: ${depsCount},
    deps: ${deps}}`,
    }
    var def = {
      keyword: 'dependencies',
      type: 'object',
      schemaType: 'object',
      error: exports2.error,
      code(cxt) {
        const [propDeps, schDeps] = splitDependencies(cxt)
        validatePropertyDeps(cxt, propDeps)
        validateSchemaDeps(cxt, schDeps)
      },
    }
    function splitDependencies({ schema }) {
      const propertyDeps = {}
      const schemaDeps = {}
      for (const key in schema) {
        if (key === '__proto__') continue
        const deps = Array.isArray(schema[key]) ? propertyDeps : schemaDeps
        deps[key] = schema[key]
      }
      return [propertyDeps, schemaDeps]
    }
    function validatePropertyDeps(cxt, propertyDeps = cxt.schema) {
      const { gen, data, it } = cxt
      if (Object.keys(propertyDeps).length === 0) return
      const missing = gen.let('missing')
      for (const prop in propertyDeps) {
        const deps = propertyDeps[prop]
        if (deps.length === 0) continue
        const hasProperty = (0, code_1.propertyInData)(
          gen,
          data,
          prop,
          it.opts.ownProperties
        )
        cxt.setParams({
          property: prop,
          depsCount: deps.length,
          deps: deps.join(', '),
        })
        if (it.allErrors) {
          gen.if(hasProperty, () => {
            for (const depProp of deps) {
              ;(0, code_1.checkReportMissingProp)(cxt, depProp)
            }
          })
        } else {
          gen.if(
            (0, codegen_1._)`${hasProperty} && (${(0, code_1.checkMissingProp)(
              cxt,
              deps,
              missing
            )})`
          )
          ;(0, code_1.reportMissingProp)(cxt, missing)
          gen.else()
        }
      }
    }
    exports2.validatePropertyDeps = validatePropertyDeps
    function validateSchemaDeps(cxt, schemaDeps = cxt.schema) {
      const { gen, data, keyword, it } = cxt
      const valid = gen.name('valid')
      for (const prop in schemaDeps) {
        if ((0, util_1.alwaysValidSchema)(it, schemaDeps[prop])) continue
        gen.if(
          (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties),
          () => {
            const schCxt = cxt.subschema({ keyword, schemaProp: prop }, valid)
            cxt.mergeValidEvaluated(schCxt, valid)
          },
          () => gen.var(valid, true)
        )
        cxt.ok(valid)
      }
    }
    exports2.validateSchemaDeps = validateSchemaDeps
    exports2.default = def
  },
})

// node_modules/ajv/dist/vocabularies/applicator/propertyNames.js
var require_propertyNames = __commonJS({
  'node_modules/ajv/dist/vocabularies/applicator/propertyNames.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var codegen_1 = require_codegen()
    var util_1 = require_util()
    var error = {
      message: 'property name must be valid',
      params: ({ params }) =>
        (0, codegen_1._)`{propertyName: ${params.propertyName}}`,
    }
    var def = {
      keyword: 'propertyNames',
      type: 'object',
      schemaType: ['object', 'boolean'],
      error,
      code(cxt) {
        const { gen, schema, data, it } = cxt
        if ((0, util_1.alwaysValidSchema)(it, schema)) return
        const valid = gen.name('valid')
        gen.forIn('key', data, (key) => {
          cxt.setParams({ propertyName: key })
          cxt.subschema(
            {
              keyword: 'propertyNames',
              data: key,
              dataTypes: ['string'],
              propertyName: key,
              compositeRule: true,
            },
            valid
          )
          gen.if((0, codegen_1.not)(valid), () => {
            cxt.error(true)
            if (!it.allErrors) gen.break()
          })
        })
        cxt.ok(valid)
      },
    }
    exports2.default = def
  },
})

// node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js
var require_additionalProperties = __commonJS({
  'node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js'(
    exports2
  ) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var code_1 = require_code2()
    var codegen_1 = require_codegen()
    var names_1 = require_names()
    var util_1 = require_util()
    var error = {
      message: 'must NOT have additional properties',
      params: ({ params }) =>
        (0, codegen_1._)`{additionalProperty: ${params.additionalProperty}}`,
    }
    var def = {
      keyword: 'additionalProperties',
      type: ['object'],
      schemaType: ['boolean', 'object'],
      allowUndefined: true,
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, parentSchema, data, errsCount, it } = cxt
        if (!errsCount) throw new Error('ajv implementation error')
        const { allErrors, opts } = it
        it.props = true
        if (
          opts.removeAdditional !== 'all' &&
          (0, util_1.alwaysValidSchema)(it, schema)
        )
          return
        const props = (0, code_1.allSchemaProperties)(parentSchema.properties)
        const patProps = (0, code_1.allSchemaProperties)(
          parentSchema.patternProperties
        )
        checkAdditionalProperties()
        cxt.ok((0, codegen_1._)`${errsCount} === ${names_1.default.errors}`)
        function checkAdditionalProperties() {
          gen.forIn('key', data, (key) => {
            if (!props.length && !patProps.length) additionalPropertyCode(key)
            else gen.if(isAdditional(key), () => additionalPropertyCode(key))
          })
        }
        function isAdditional(key) {
          let definedProp
          if (props.length > 8) {
            const propsSchema = (0, util_1.schemaRefOrVal)(
              it,
              parentSchema.properties,
              'properties'
            )
            definedProp = (0, code_1.isOwnProperty)(gen, propsSchema, key)
          } else if (props.length) {
            definedProp = (0, codegen_1.or)(
              ...props.map((p) => (0, codegen_1._)`${key} === ${p}`)
            )
          } else {
            definedProp = codegen_1.nil
          }
          if (patProps.length) {
            definedProp = (0, codegen_1.or)(
              definedProp,
              ...patProps.map(
                (p) =>
                  (0, codegen_1._)`${(0, code_1.usePattern)(
                    cxt,
                    p
                  )}.test(${key})`
              )
            )
          }
          return (0, codegen_1.not)(definedProp)
        }
        function deleteAdditional(key) {
          gen.code((0, codegen_1._)`delete ${data}[${key}]`)
        }
        function additionalPropertyCode(key) {
          if (
            opts.removeAdditional === 'all' ||
            (opts.removeAdditional && schema === false)
          ) {
            deleteAdditional(key)
            return
          }
          if (schema === false) {
            cxt.setParams({ additionalProperty: key })
            cxt.error()
            if (!allErrors) gen.break()
            return
          }
          if (
            typeof schema == 'object' &&
            !(0, util_1.alwaysValidSchema)(it, schema)
          ) {
            const valid = gen.name('valid')
            if (opts.removeAdditional === 'failing') {
              applyAdditionalSchema(key, valid, false)
              gen.if((0, codegen_1.not)(valid), () => {
                cxt.reset()
                deleteAdditional(key)
              })
            } else {
              applyAdditionalSchema(key, valid)
              if (!allErrors)
                gen.if((0, codegen_1.not)(valid), () => gen.break())
            }
          }
        }
        function applyAdditionalSchema(key, valid, errors) {
          const subschema = {
            keyword: 'additionalProperties',
            dataProp: key,
            dataPropType: util_1.Type.Str,
          }
          if (errors === false) {
            Object.assign(subschema, {
              compositeRule: true,
              createErrors: false,
              allErrors: false,
            })
          }
          cxt.subschema(subschema, valid)
        }
      },
    }
    exports2.default = def
  },
})

// node_modules/ajv/dist/vocabularies/applicator/properties.js
var require_properties = __commonJS({
  'node_modules/ajv/dist/vocabularies/applicator/properties.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var validate_1 = require_validate()
    var code_1 = require_code2()
    var util_1 = require_util()
    var additionalProperties_1 = require_additionalProperties()
    var def = {
      keyword: 'properties',
      type: 'object',
      schemaType: 'object',
      code(cxt) {
        const { gen, schema, parentSchema, data, it } = cxt
        if (
          it.opts.removeAdditional === 'all' &&
          parentSchema.additionalProperties === void 0
        ) {
          additionalProperties_1.default.code(
            new validate_1.KeywordCxt(
              it,
              additionalProperties_1.default,
              'additionalProperties'
            )
          )
        }
        const allProps = (0, code_1.allSchemaProperties)(schema)
        for (const prop of allProps) {
          it.definedProperties.add(prop)
        }
        if (it.opts.unevaluated && allProps.length && it.props !== true) {
          it.props = util_1.mergeEvaluated.props(
            gen,
            (0, util_1.toHash)(allProps),
            it.props
          )
        }
        const properties = allProps.filter(
          (p) => !(0, util_1.alwaysValidSchema)(it, schema[p])
        )
        if (properties.length === 0) return
        const valid = gen.name('valid')
        for (const prop of properties) {
          if (hasDefault(prop)) {
            applyPropertySchema(prop)
          } else {
            gen.if(
              (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties)
            )
            applyPropertySchema(prop)
            if (!it.allErrors) gen.else().var(valid, true)
            gen.endIf()
          }
          cxt.it.definedProperties.add(prop)
          cxt.ok(valid)
        }
        function hasDefault(prop) {
          return (
            it.opts.useDefaults &&
            !it.compositeRule &&
            schema[prop].default !== void 0
          )
        }
        function applyPropertySchema(prop) {
          cxt.subschema(
            {
              keyword: 'properties',
              schemaProp: prop,
              dataProp: prop,
            },
            valid
          )
        }
      },
    }
    exports2.default = def
  },
})

// node_modules/ajv/dist/vocabularies/applicator/patternProperties.js
var require_patternProperties = __commonJS({
  'node_modules/ajv/dist/vocabularies/applicator/patternProperties.js'(
    exports2
  ) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var code_1 = require_code2()
    var codegen_1 = require_codegen()
    var util_1 = require_util()
    var util_2 = require_util()
    var def = {
      keyword: 'patternProperties',
      type: 'object',
      schemaType: 'object',
      code(cxt) {
        const { gen, schema, data, parentSchema, it } = cxt
        const { opts } = it
        const patterns = (0, code_1.allSchemaProperties)(schema)
        const alwaysValidPatterns = patterns.filter((p) =>
          (0, util_1.alwaysValidSchema)(it, schema[p])
        )
        if (
          patterns.length === 0 ||
          (alwaysValidPatterns.length === patterns.length &&
            (!it.opts.unevaluated || it.props === true))
        ) {
          return
        }
        const checkProperties =
          opts.strictSchema &&
          !opts.allowMatchingProperties &&
          parentSchema.properties
        const valid = gen.name('valid')
        if (it.props !== true && !(it.props instanceof codegen_1.Name)) {
          it.props = (0, util_2.evaluatedPropsToName)(gen, it.props)
        }
        const { props } = it
        validatePatternProperties()
        function validatePatternProperties() {
          for (const pat of patterns) {
            if (checkProperties) checkMatchingProperties(pat)
            if (it.allErrors) {
              validateProperties(pat)
            } else {
              gen.var(valid, true)
              validateProperties(pat)
              gen.if(valid)
            }
          }
        }
        function checkMatchingProperties(pat) {
          for (const prop in checkProperties) {
            if (new RegExp(pat).test(prop)) {
              ;(0, util_1.checkStrictMode)(
                it,
                `property ${prop} matches pattern ${pat} (use allowMatchingProperties)`
              )
            }
          }
        }
        function validateProperties(pat) {
          gen.forIn('key', data, (key) => {
            gen.if(
              (0, codegen_1._)`${(0, code_1.usePattern)(
                cxt,
                pat
              )}.test(${key})`,
              () => {
                const alwaysValid = alwaysValidPatterns.includes(pat)
                if (!alwaysValid) {
                  cxt.subschema(
                    {
                      keyword: 'patternProperties',
                      schemaProp: pat,
                      dataProp: key,
                      dataPropType: util_2.Type.Str,
                    },
                    valid
                  )
                }
                if (it.opts.unevaluated && props !== true) {
                  gen.assign((0, codegen_1._)`${props}[${key}]`, true)
                } else if (!alwaysValid && !it.allErrors) {
                  gen.if((0, codegen_1.not)(valid), () => gen.break())
                }
              }
            )
          })
        }
      },
    }
    exports2.default = def
  },
})

// node_modules/ajv/dist/vocabularies/applicator/not.js
var require_not = __commonJS({
  'node_modules/ajv/dist/vocabularies/applicator/not.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var util_1 = require_util()
    var def = {
      keyword: 'not',
      schemaType: ['object', 'boolean'],
      trackErrors: true,
      code(cxt) {
        const { gen, schema, it } = cxt
        if ((0, util_1.alwaysValidSchema)(it, schema)) {
          cxt.fail()
          return
        }
        const valid = gen.name('valid')
        cxt.subschema(
          {
            keyword: 'not',
            compositeRule: true,
            createErrors: false,
            allErrors: false,
          },
          valid
        )
        cxt.failResult(
          valid,
          () => cxt.reset(),
          () => cxt.error()
        )
      },
      error: { message: 'must NOT be valid' },
    }
    exports2.default = def
  },
})

// node_modules/ajv/dist/vocabularies/applicator/anyOf.js
var require_anyOf = __commonJS({
  'node_modules/ajv/dist/vocabularies/applicator/anyOf.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var code_1 = require_code2()
    var def = {
      keyword: 'anyOf',
      schemaType: 'array',
      trackErrors: true,
      code: code_1.validateUnion,
      error: { message: 'must match a schema in anyOf' },
    }
    exports2.default = def
  },
})

// node_modules/ajv/dist/vocabularies/applicator/oneOf.js
var require_oneOf = __commonJS({
  'node_modules/ajv/dist/vocabularies/applicator/oneOf.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var codegen_1 = require_codegen()
    var util_1 = require_util()
    var error = {
      message: 'must match exactly one schema in oneOf',
      params: ({ params }) =>
        (0, codegen_1._)`{passingSchemas: ${params.passing}}`,
    }
    var def = {
      keyword: 'oneOf',
      schemaType: 'array',
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, parentSchema, it } = cxt
        if (!Array.isArray(schema)) throw new Error('ajv implementation error')
        if (it.opts.discriminator && parentSchema.discriminator) return
        const schArr = schema
        const valid = gen.let('valid', false)
        const passing = gen.let('passing', null)
        const schValid = gen.name('_valid')
        cxt.setParams({ passing })
        gen.block(validateOneOf)
        cxt.result(
          valid,
          () => cxt.reset(),
          () => cxt.error(true)
        )
        function validateOneOf() {
          schArr.forEach((sch, i) => {
            let schCxt
            if ((0, util_1.alwaysValidSchema)(it, sch)) {
              gen.var(schValid, true)
            } else {
              schCxt = cxt.subschema(
                {
                  keyword: 'oneOf',
                  schemaProp: i,
                  compositeRule: true,
                },
                schValid
              )
            }
            if (i > 0) {
              gen
                .if((0, codegen_1._)`${schValid} && ${valid}`)
                .assign(valid, false)
                .assign(passing, (0, codegen_1._)`[${passing}, ${i}]`)
                .else()
            }
            gen.if(schValid, () => {
              gen.assign(valid, true)
              gen.assign(passing, i)
              if (schCxt) cxt.mergeEvaluated(schCxt, codegen_1.Name)
            })
          })
        }
      },
    }
    exports2.default = def
  },
})

// node_modules/ajv/dist/vocabularies/applicator/allOf.js
var require_allOf = __commonJS({
  'node_modules/ajv/dist/vocabularies/applicator/allOf.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var util_1 = require_util()
    var def = {
      keyword: 'allOf',
      schemaType: 'array',
      code(cxt) {
        const { gen, schema, it } = cxt
        if (!Array.isArray(schema)) throw new Error('ajv implementation error')
        const valid = gen.name('valid')
        schema.forEach((sch, i) => {
          if ((0, util_1.alwaysValidSchema)(it, sch)) return
          const schCxt = cxt.subschema(
            { keyword: 'allOf', schemaProp: i },
            valid
          )
          cxt.ok(valid)
          cxt.mergeEvaluated(schCxt)
        })
      },
    }
    exports2.default = def
  },
})

// node_modules/ajv/dist/vocabularies/applicator/if.js
var require_if = __commonJS({
  'node_modules/ajv/dist/vocabularies/applicator/if.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var codegen_1 = require_codegen()
    var util_1 = require_util()
    var error = {
      message: ({ params }) =>
        (0, codegen_1.str)`must match "${params.ifClause}" schema`,
      params: ({ params }) =>
        (0, codegen_1._)`{failingKeyword: ${params.ifClause}}`,
    }
    var def = {
      keyword: 'if',
      schemaType: ['object', 'boolean'],
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, parentSchema, it } = cxt
        if (parentSchema.then === void 0 && parentSchema.else === void 0) {
          ;(0, util_1.checkStrictMode)(
            it,
            '"if" without "then" and "else" is ignored'
          )
        }
        const hasThen = hasSchema(it, 'then')
        const hasElse = hasSchema(it, 'else')
        if (!hasThen && !hasElse) return
        const valid = gen.let('valid', true)
        const schValid = gen.name('_valid')
        validateIf()
        cxt.reset()
        if (hasThen && hasElse) {
          const ifClause = gen.let('ifClause')
          cxt.setParams({ ifClause })
          gen.if(
            schValid,
            validateClause('then', ifClause),
            validateClause('else', ifClause)
          )
        } else if (hasThen) {
          gen.if(schValid, validateClause('then'))
        } else {
          gen.if((0, codegen_1.not)(schValid), validateClause('else'))
        }
        cxt.pass(valid, () => cxt.error(true))
        function validateIf() {
          const schCxt = cxt.subschema(
            {
              keyword: 'if',
              compositeRule: true,
              createErrors: false,
              allErrors: false,
            },
            schValid
          )
          cxt.mergeEvaluated(schCxt)
        }
        function validateClause(keyword, ifClause) {
          return () => {
            const schCxt = cxt.subschema({ keyword }, schValid)
            gen.assign(valid, schValid)
            cxt.mergeValidEvaluated(schCxt, valid)
            if (ifClause) gen.assign(ifClause, (0, codegen_1._)`${keyword}`)
            else cxt.setParams({ ifClause: keyword })
          }
        }
      },
    }
    function hasSchema(it, keyword) {
      const schema = it.schema[keyword]
      return schema !== void 0 && !(0, util_1.alwaysValidSchema)(it, schema)
    }
    exports2.default = def
  },
})

// node_modules/ajv/dist/vocabularies/applicator/thenElse.js
var require_thenElse = __commonJS({
  'node_modules/ajv/dist/vocabularies/applicator/thenElse.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var util_1 = require_util()
    var def = {
      keyword: ['then', 'else'],
      schemaType: ['object', 'boolean'],
      code({ keyword, parentSchema, it }) {
        if (parentSchema.if === void 0)
          (0, util_1.checkStrictMode)(
            it,
            `"${keyword}" without "if" is ignored`
          )
      },
    }
    exports2.default = def
  },
})

// node_modules/ajv/dist/vocabularies/applicator/index.js
var require_applicator = __commonJS({
  'node_modules/ajv/dist/vocabularies/applicator/index.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var additionalItems_1 = require_additionalItems()
    var prefixItems_1 = require_prefixItems()
    var items_1 = require_items()
    var items2020_1 = require_items2020()
    var contains_1 = require_contains()
    var dependencies_1 = require_dependencies()
    var propertyNames_1 = require_propertyNames()
    var additionalProperties_1 = require_additionalProperties()
    var properties_1 = require_properties()
    var patternProperties_1 = require_patternProperties()
    var not_1 = require_not()
    var anyOf_1 = require_anyOf()
    var oneOf_1 = require_oneOf()
    var allOf_1 = require_allOf()
    var if_1 = require_if()
    var thenElse_1 = require_thenElse()
    function getApplicator(draft2020 = false) {
      const applicator = [
        not_1.default,
        anyOf_1.default,
        oneOf_1.default,
        allOf_1.default,
        if_1.default,
        thenElse_1.default,
        propertyNames_1.default,
        additionalProperties_1.default,
        dependencies_1.default,
        properties_1.default,
        patternProperties_1.default,
      ]
      if (draft2020) applicator.push(prefixItems_1.default, items2020_1.default)
      else applicator.push(additionalItems_1.default, items_1.default)
      applicator.push(contains_1.default)
      return applicator
    }
    exports2.default = getApplicator
  },
})

// node_modules/ajv/dist/vocabularies/format/format.js
var require_format = __commonJS({
  'node_modules/ajv/dist/vocabularies/format/format.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var codegen_1 = require_codegen()
    var error = {
      message: ({ schemaCode }) =>
        (0, codegen_1.str)`must match format "${schemaCode}"`,
      params: ({ schemaCode }) => (0, codegen_1._)`{format: ${schemaCode}}`,
    }
    var def = {
      keyword: 'format',
      type: ['number', 'string'],
      schemaType: 'string',
      $data: true,
      error,
      code(cxt, ruleType) {
        const { gen, data, $data, schema, schemaCode, it } = cxt
        const { opts, errSchemaPath, schemaEnv, self: self2 } = it
        if (!opts.validateFormats) return
        if ($data) validate$DataFormat()
        else validateFormat()
        function validate$DataFormat() {
          const fmts = gen.scopeValue('formats', {
            ref: self2.formats,
            code: opts.code.formats,
          })
          const fDef = gen.const(
            'fDef',
            (0, codegen_1._)`${fmts}[${schemaCode}]`
          )
          const fType = gen.let('fType')
          const format = gen.let('format')
          gen.if(
            (0,
            codegen_1._)`typeof ${fDef} == "object" && !(${fDef} instanceof RegExp)`,
            () =>
              gen
                .assign(fType, (0, codegen_1._)`${fDef}.type || "string"`)
                .assign(format, (0, codegen_1._)`${fDef}.validate`),
            () =>
              gen.assign(fType, (0, codegen_1._)`"string"`).assign(format, fDef)
          )
          cxt.fail$data((0, codegen_1.or)(unknownFmt(), invalidFmt()))
          function unknownFmt() {
            if (opts.strictSchema === false) return codegen_1.nil
            return (0, codegen_1._)`${schemaCode} && !${format}`
          }
          function invalidFmt() {
            const callFormat = schemaEnv.$async
              ? (0,
                codegen_1._)`(${fDef}.async ? await ${format}(${data}) : ${format}(${data}))`
              : (0, codegen_1._)`${format}(${data})`
            const validData = (0,
            codegen_1._)`(typeof ${format} == "function" ? ${callFormat} : ${format}.test(${data}))`
            return (0,
            codegen_1._)`${format} && ${format} !== true && ${fType} === ${ruleType} && !${validData}`
          }
        }
        function validateFormat() {
          const formatDef = self2.formats[schema]
          if (!formatDef) {
            unknownFormat()
            return
          }
          if (formatDef === true) return
          const [fmtType, format, fmtRef] = getFormat(formatDef)
          if (fmtType === ruleType) cxt.pass(validCondition())
          function unknownFormat() {
            if (opts.strictSchema === false) {
              self2.logger.warn(unknownMsg())
              return
            }
            throw new Error(unknownMsg())
            function unknownMsg() {
              return `unknown format "${schema}" ignored in schema at path "${errSchemaPath}"`
            }
          }
          function getFormat(fmtDef) {
            const code6 =
              fmtDef instanceof RegExp
                ? (0, codegen_1.regexpCode)(fmtDef)
                : opts.code.formats
                ? (0, codegen_1._)`${opts.code.formats}${(0,
                  codegen_1.getProperty)(schema)}`
                : void 0
            const fmt = gen.scopeValue('formats', {
              key: schema,
              ref: fmtDef,
              code: code6,
            })
            if (typeof fmtDef == 'object' && !(fmtDef instanceof RegExp)) {
              return [
                fmtDef.type || 'string',
                fmtDef.validate,
                (0, codegen_1._)`${fmt}.validate`,
              ]
            }
            return ['string', fmtDef, fmt]
          }
          function validCondition() {
            if (
              typeof formatDef == 'object' &&
              !(formatDef instanceof RegExp) &&
              formatDef.async
            ) {
              if (!schemaEnv.$async)
                throw new Error('async format in sync schema')
              return (0, codegen_1._)`await ${fmtRef}(${data})`
            }
            return typeof format == 'function'
              ? (0, codegen_1._)`${fmtRef}(${data})`
              : (0, codegen_1._)`${fmtRef}.test(${data})`
          }
        }
      },
    }
    exports2.default = def
  },
})

// node_modules/ajv/dist/vocabularies/format/index.js
var require_format2 = __commonJS({
  'node_modules/ajv/dist/vocabularies/format/index.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var format_1 = require_format()
    var format = [format_1.default]
    exports2.default = format
  },
})

// node_modules/ajv/dist/vocabularies/metadata.js
var require_metadata = __commonJS({
  'node_modules/ajv/dist/vocabularies/metadata.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    exports2.contentVocabulary = exports2.metadataVocabulary = void 0
    exports2.metadataVocabulary = [
      'title',
      'description',
      'default',
      'deprecated',
      'readOnly',
      'writeOnly',
      'examples',
    ]
    exports2.contentVocabulary = [
      'contentMediaType',
      'contentEncoding',
      'contentSchema',
    ]
  },
})

// node_modules/ajv/dist/vocabularies/draft7.js
var require_draft7 = __commonJS({
  'node_modules/ajv/dist/vocabularies/draft7.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var core_1 = require_core2()
    var validation_1 = require_validation()
    var applicator_1 = require_applicator()
    var format_1 = require_format2()
    var metadata_1 = require_metadata()
    var draft7Vocabularies = [
      core_1.default,
      validation_1.default,
      (0, applicator_1.default)(),
      format_1.default,
      metadata_1.metadataVocabulary,
      metadata_1.contentVocabulary,
    ]
    exports2.default = draft7Vocabularies
  },
})

// node_modules/ajv/dist/vocabularies/discriminator/types.js
var require_types = __commonJS({
  'node_modules/ajv/dist/vocabularies/discriminator/types.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    exports2.DiscrError = void 0
    var DiscrError
    ;(function (DiscrError2) {
      DiscrError2['Tag'] = 'tag'
      DiscrError2['Mapping'] = 'mapping'
    })((DiscrError = exports2.DiscrError || (exports2.DiscrError = {})))
  },
})

// node_modules/ajv/dist/vocabularies/discriminator/index.js
var require_discriminator = __commonJS({
  'node_modules/ajv/dist/vocabularies/discriminator/index.js'(exports2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    var codegen_1 = require_codegen()
    var types_1 = require_types()
    var compile_1 = require_compile()
    var util_1 = require_util()
    var error = {
      message: ({ params: { discrError, tagName } }) =>
        discrError === types_1.DiscrError.Tag
          ? `tag "${tagName}" must be string`
          : `value of tag "${tagName}" must be in oneOf`,
      params: ({ params: { discrError, tag: tag2, tagName } }) =>
        (0,
        codegen_1._)`{error: ${discrError}, tag: ${tagName}, tagValue: ${tag2}}`,
    }
    var def = {
      keyword: 'discriminator',
      type: 'object',
      schemaType: 'object',
      error,
      code(cxt) {
        const { gen, data, schema, parentSchema, it } = cxt
        const { oneOf } = parentSchema
        if (!it.opts.discriminator) {
          throw new Error('discriminator: requires discriminator option')
        }
        const tagName = schema.propertyName
        if (typeof tagName != 'string')
          throw new Error('discriminator: requires propertyName')
        if (schema.mapping)
          throw new Error('discriminator: mapping is not supported')
        if (!oneOf) throw new Error('discriminator: requires oneOf keyword')
        const valid = gen.let('valid', false)
        const tag2 = gen.const(
          'tag',
          (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(tagName)}`
        )
        gen.if(
          (0, codegen_1._)`typeof ${tag2} == "string"`,
          () => validateMapping(),
          () =>
            cxt.error(false, {
              discrError: types_1.DiscrError.Tag,
              tag: tag2,
              tagName,
            })
        )
        cxt.ok(valid)
        function validateMapping() {
          const mapping = getMapping()
          gen.if(false)
          for (const tagValue in mapping) {
            gen.elseIf((0, codegen_1._)`${tag2} === ${tagValue}`)
            gen.assign(valid, applyTagSchema(mapping[tagValue]))
          }
          gen.else()
          cxt.error(false, {
            discrError: types_1.DiscrError.Mapping,
            tag: tag2,
            tagName,
          })
          gen.endIf()
        }
        function applyTagSchema(schemaProp) {
          const _valid = gen.name('valid')
          const schCxt = cxt.subschema({ keyword: 'oneOf', schemaProp }, _valid)
          cxt.mergeEvaluated(schCxt, codegen_1.Name)
          return _valid
        }
        function getMapping() {
          var _a
          const oneOfMapping = {}
          const topRequired = hasRequired(parentSchema)
          let tagRequired = true
          for (let i = 0; i < oneOf.length; i++) {
            let sch = oneOf[i]
            if (
              (sch === null || sch === void 0 ? void 0 : sch.$ref) &&
              !(0, util_1.schemaHasRulesButRef)(sch, it.self.RULES)
            ) {
              sch = compile_1.resolveRef.call(
                it.self,
                it.schemaEnv.root,
                it.baseId,
                sch === null || sch === void 0 ? void 0 : sch.$ref
              )
              if (sch instanceof compile_1.SchemaEnv) sch = sch.schema
            }
            const propSch =
              (_a =
                sch === null || sch === void 0 ? void 0 : sch.properties) ===
                null || _a === void 0
                ? void 0
                : _a[tagName]
            if (typeof propSch != 'object') {
              throw new Error(
                `discriminator: oneOf subschemas (or referenced schemas) must have "properties/${tagName}"`
              )
            }
            tagRequired = tagRequired && (topRequired || hasRequired(sch))
            addMappings(propSch, i)
          }
          if (!tagRequired)
            throw new Error(`discriminator: "${tagName}" must be required`)
          return oneOfMapping
          function hasRequired({ required }) {
            return Array.isArray(required) && required.includes(tagName)
          }
          function addMappings(sch, i) {
            if (sch.const) {
              addMapping(sch.const, i)
            } else if (sch.enum) {
              for (const tagValue of sch.enum) {
                addMapping(tagValue, i)
              }
            } else {
              throw new Error(
                `discriminator: "properties/${tagName}" must have "const" or "enum"`
              )
            }
          }
          function addMapping(tagValue, i) {
            if (typeof tagValue != 'string' || tagValue in oneOfMapping) {
              throw new Error(
                `discriminator: "${tagName}" values must be unique strings`
              )
            }
            oneOfMapping[tagValue] = i
          }
        }
      },
    }
    exports2.default = def
  },
})

// node_modules/ajv/dist/refs/json-schema-draft-07.json
var require_json_schema_draft_07 = __commonJS({
  'node_modules/ajv/dist/refs/json-schema-draft-07.json'(exports2, module2) {
    module2.exports = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      $id: 'http://json-schema.org/draft-07/schema#',
      title: 'Core schema meta-schema',
      definitions: {
        schemaArray: {
          type: 'array',
          minItems: 1,
          items: { $ref: '#' },
        },
        nonNegativeInteger: {
          type: 'integer',
          minimum: 0,
        },
        nonNegativeIntegerDefault0: {
          allOf: [{ $ref: '#/definitions/nonNegativeInteger' }, { default: 0 }],
        },
        simpleTypes: {
          enum: [
            'array',
            'boolean',
            'integer',
            'null',
            'number',
            'object',
            'string',
          ],
        },
        stringArray: {
          type: 'array',
          items: { type: 'string' },
          uniqueItems: true,
          default: [],
        },
      },
      type: ['object', 'boolean'],
      properties: {
        $id: {
          type: 'string',
          format: 'uri-reference',
        },
        $schema: {
          type: 'string',
          format: 'uri',
        },
        $ref: {
          type: 'string',
          format: 'uri-reference',
        },
        $comment: {
          type: 'string',
        },
        title: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        default: true,
        readOnly: {
          type: 'boolean',
          default: false,
        },
        examples: {
          type: 'array',
          items: true,
        },
        multipleOf: {
          type: 'number',
          exclusiveMinimum: 0,
        },
        maximum: {
          type: 'number',
        },
        exclusiveMaximum: {
          type: 'number',
        },
        minimum: {
          type: 'number',
        },
        exclusiveMinimum: {
          type: 'number',
        },
        maxLength: { $ref: '#/definitions/nonNegativeInteger' },
        minLength: { $ref: '#/definitions/nonNegativeIntegerDefault0' },
        pattern: {
          type: 'string',
          format: 'regex',
        },
        additionalItems: { $ref: '#' },
        items: {
          anyOf: [{ $ref: '#' }, { $ref: '#/definitions/schemaArray' }],
          default: true,
        },
        maxItems: { $ref: '#/definitions/nonNegativeInteger' },
        minItems: { $ref: '#/definitions/nonNegativeIntegerDefault0' },
        uniqueItems: {
          type: 'boolean',
          default: false,
        },
        contains: { $ref: '#' },
        maxProperties: { $ref: '#/definitions/nonNegativeInteger' },
        minProperties: { $ref: '#/definitions/nonNegativeIntegerDefault0' },
        required: { $ref: '#/definitions/stringArray' },
        additionalProperties: { $ref: '#' },
        definitions: {
          type: 'object',
          additionalProperties: { $ref: '#' },
          default: {},
        },
        properties: {
          type: 'object',
          additionalProperties: { $ref: '#' },
          default: {},
        },
        patternProperties: {
          type: 'object',
          additionalProperties: { $ref: '#' },
          propertyNames: { format: 'regex' },
          default: {},
        },
        dependencies: {
          type: 'object',
          additionalProperties: {
            anyOf: [{ $ref: '#' }, { $ref: '#/definitions/stringArray' }],
          },
        },
        propertyNames: { $ref: '#' },
        const: true,
        enum: {
          type: 'array',
          items: true,
          minItems: 1,
          uniqueItems: true,
        },
        type: {
          anyOf: [
            { $ref: '#/definitions/simpleTypes' },
            {
              type: 'array',
              items: { $ref: '#/definitions/simpleTypes' },
              minItems: 1,
              uniqueItems: true,
            },
          ],
        },
        format: { type: 'string' },
        contentMediaType: { type: 'string' },
        contentEncoding: { type: 'string' },
        if: { $ref: '#' },
        then: { $ref: '#' },
        else: { $ref: '#' },
        allOf: { $ref: '#/definitions/schemaArray' },
        anyOf: { $ref: '#/definitions/schemaArray' },
        oneOf: { $ref: '#/definitions/schemaArray' },
        not: { $ref: '#' },
      },
      default: true,
    }
  },
})

// node_modules/ajv/dist/ajv.js
var require_ajv = __commonJS({
  'node_modules/ajv/dist/ajv.js'(exports2, module2) {
    'use strict'
    Object.defineProperty(exports2, '__esModule', { value: true })
    exports2.CodeGen =
      exports2.Name =
      exports2.nil =
      exports2.stringify =
      exports2.str =
      exports2._ =
      exports2.KeywordCxt =
        void 0
    var core_1 = require_core()
    var draft7_1 = require_draft7()
    var discriminator_1 = require_discriminator()
    var draft7MetaSchema = require_json_schema_draft_07()
    var META_SUPPORT_DATA = ['/properties']
    var META_SCHEMA_ID = 'http://json-schema.org/draft-07/schema'
    var Ajv2 = class extends core_1.default {
      _addVocabularies() {
        super._addVocabularies()
        draft7_1.default.forEach((v) => this.addVocabulary(v))
        if (this.opts.discriminator) this.addKeyword(discriminator_1.default)
      }
      _addDefaultMetaSchema() {
        super._addDefaultMetaSchema()
        if (!this.opts.meta) return
        const metaSchema = this.opts.$data
          ? this.$dataMetaSchema(draft7MetaSchema, META_SUPPORT_DATA)
          : draft7MetaSchema
        this.addMetaSchema(metaSchema, META_SCHEMA_ID, false)
        this.refs['http://json-schema.org/schema'] = META_SCHEMA_ID
      }
      defaultMeta() {
        return (this.opts.defaultMeta =
          super.defaultMeta() ||
          (this.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : void 0))
      }
    }
    module2.exports = exports2 = Ajv2
    Object.defineProperty(exports2, '__esModule', { value: true })
    exports2.default = Ajv2
    var validate_1 = require_validate()
    Object.defineProperty(exports2, 'KeywordCxt', {
      enumerable: true,
      get: function () {
        return validate_1.KeywordCxt
      },
    })
    var codegen_1 = require_codegen()
    Object.defineProperty(exports2, '_', {
      enumerable: true,
      get: function () {
        return codegen_1._
      },
    })
    Object.defineProperty(exports2, 'str', {
      enumerable: true,
      get: function () {
        return codegen_1.str
      },
    })
    Object.defineProperty(exports2, 'stringify', {
      enumerable: true,
      get: function () {
        return codegen_1.stringify
      },
    })
    Object.defineProperty(exports2, 'nil', {
      enumerable: true,
      get: function () {
        return codegen_1.nil
      },
    })
    Object.defineProperty(exports2, 'Name', {
      enumerable: true,
      get: function () {
        return codegen_1.Name
      },
    })
    Object.defineProperty(exports2, 'CodeGen', {
      enumerable: true,
      get: function () {
        return codegen_1.CodeGen
      },
    })
  },
})

// src/auth.ts
init_base58()
var varint = __toModule(require_varint())
var import_tweetnacl = __toModule(require_nacl_fast())
var TagChain = 'chain'
var TagSolanaCluster = 'solanaCluster'
var TagMintingAgent = 'mintingAgent'
var TagMintingAgentVersion = 'agentVersion'
var DEFAULT_CLUSTER = 'devnet'
var MulticodecEd25519Pubkey = varint.encode(237)
function MetaplexAuthWithSigner(signMessage, publicKey, opts) {
  const chain = 'solana'
  const solanaCluster = opts.solanaCluster || DEFAULT_CLUSTER
  const { mintingAgent, agentVersion } = opts
  if (!mintingAgent) {
    throw new Error('required option "mintingAgent" not provided')
  }
  return {
    chain,
    solanaCluster,
    mintingAgent,
    agentVersion,
    signMessage,
    publicKey,
  }
}
function MetaplexAuthWithSecretKey(privkey, opts) {
  const { publicKey, secretKey } =
    import_tweetnacl.default.sign.keyPair.fromSecretKey(privkey)
  const signMessage = async (message) => {
    return import_tweetnacl.default.sign.detached(message, secretKey)
  }
  return MetaplexAuthWithSigner(signMessage, publicKey, opts)
}
async function makeMetaplexUploadToken(auth, rootCID) {
  const tags = {
    [TagChain]: auth.chain,
    [TagSolanaCluster]: auth.solanaCluster,
    [TagMintingAgent]: auth.mintingAgent,
    [TagMintingAgentVersion]: auth.agentVersion,
  }
  const req = {
    put: {
      rootCID,
      tags,
    },
  }
  const iss = keyDID(auth.publicKey)
  const payload = {
    iss,
    req,
  }
  const headerB64 = objectToB64URL({ alg: 'EdDSA', typ: 'JWT' })
  const payloadB64 = objectToB64URL(payload)
  const encoded = headerB64 + '.' + payloadB64
  const encodedBytes = new TextEncoder().encode(encoded)
  const sig = await auth.signMessage(encodedBytes)
  const sigB64 = b64urlEncode(sig)
  const token = encoded + '.' + sigB64
  return token
}
function keyDID(pubkey) {
  const keyWithCodec = new Uint8Array([...MulticodecEd25519Pubkey, ...pubkey])
  const mb = base58btc.encode(keyWithCodec)
  return `did:key:${mb}`
}
function objectToB64URL(o) {
  const s = new TextEncoder().encode(JSON.stringify(o))
  return b64urlEncode(s)
}
function b64urlEncode(bytes2) {
  const s = b64Encode(bytes2)
  return s.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}
function b64Encode(bytes2) {
  if (Buffer !== void 0) {
    return Buffer.from(bytes2).toString('base64')
  }
  return btoa(String.fromCharCode.apply(null, [...bytes2]))
}

// node_modules/streaming-iterables/dist/index.mjs
var TIMEOUT = Symbol('TIMEOUT')
function getIterator(iterable) {
  if (typeof iterable.next === 'function') {
    return iterable
  }
  if (typeof iterable[Symbol.iterator] === 'function') {
    return iterable[Symbol.iterator]()
  }
  if (typeof iterable[Symbol.asyncIterator] === 'function') {
    return iterable[Symbol.asyncIterator]()
  }
  throw new TypeError(
    '"values" does not to conform to any of the iterator or iterable protocols'
  )
}
function defer() {
  let reject
  let resolve
  const promise = new Promise((resolveFunc, rejectFunc) => {
    resolve = resolveFunc
    reject = rejectFunc
  })
  return {
    promise,
    reject,
    resolve,
  }
}
function _transform(concurrency, func, iterable) {
  const iterator = getIterator(iterable)
  const resultQueue = []
  const readQueue = []
  let ended = false
  let reading = false
  let inflightCount = 0
  let lastError = null
  function fulfillReadQueue() {
    while (readQueue.length > 0 && resultQueue.length > 0) {
      const { resolve } = readQueue.shift()
      const value = resultQueue.shift()
      resolve({ done: false, value })
    }
    while (readQueue.length > 0 && inflightCount === 0 && ended) {
      const { resolve, reject } = readQueue.shift()
      if (lastError) {
        reject(lastError)
        lastError = null
      } else {
        resolve({ done: true, value: void 0 })
      }
    }
  }
  async function fillQueue() {
    if (ended) {
      fulfillReadQueue()
      return
    }
    if (reading) {
      return
    }
    if (inflightCount + resultQueue.length >= concurrency) {
      return
    }
    reading = true
    inflightCount++
    try {
      const { done, value } = await iterator.next()
      if (done) {
        ended = true
        inflightCount--
        fulfillReadQueue()
      } else {
        mapAndQueue(value)
      }
    } catch (error) {
      ended = true
      inflightCount--
      lastError = error
      fulfillReadQueue()
    }
    reading = false
    fillQueue()
  }
  async function mapAndQueue(itrValue) {
    try {
      const value = await func(itrValue)
      resultQueue.push(value)
    } catch (error) {
      ended = true
      lastError = error
    }
    inflightCount--
    fulfillReadQueue()
    fillQueue()
  }
  async function next() {
    if (resultQueue.length === 0) {
      const deferred = defer()
      readQueue.push(deferred)
      fillQueue()
      return deferred.promise
    }
    const value = resultQueue.shift()
    fillQueue()
    return { done: false, value }
  }
  const asyncIterableIterator = {
    next,
    [Symbol.asyncIterator]: () => asyncIterableIterator,
  }
  return asyncIterableIterator
}
function transform(concurrency, func, iterable) {
  if (func === void 0) {
    return (curriedFunc, curriedIterable) =>
      curriedIterable
        ? transform(concurrency, curriedFunc, curriedIterable)
        : transform(concurrency, curriedFunc)
  }
  if (iterable === void 0) {
    return (curriedIterable) => transform(concurrency, func, curriedIterable)
  }
  return _transform(concurrency, func, iterable)
}

// node_modules/nft.storage/src/lib.js
var import_p_retry = __toModule(require_p_retry())

// node_modules/@ipld/car/esm/lib/decoder.js
var import_varint2 = __toModule(require_varint())
init_cid()
init_digest()

// node_modules/cborg/esm/lib/is.js
var typeofs = ['string', 'number', 'bigint', 'symbol']
var objectTypeNames = [
  'Function',
  'Generator',
  'AsyncGenerator',
  'GeneratorFunction',
  'AsyncGeneratorFunction',
  'AsyncFunction',
  'Observable',
  'Array',
  'Buffer',
  'Object',
  'RegExp',
  'Date',
  'Error',
  'Map',
  'Set',
  'WeakMap',
  'WeakSet',
  'ArrayBuffer',
  'SharedArrayBuffer',
  'DataView',
  'Promise',
  'URL',
  'HTMLElement',
  'Int8Array',
  'Uint8Array',
  'Uint8ClampedArray',
  'Int16Array',
  'Uint16Array',
  'Int32Array',
  'Uint32Array',
  'Float32Array',
  'Float64Array',
  'BigInt64Array',
  'BigUint64Array',
]
function is(value) {
  if (value === null) {
    return 'null'
  }
  if (value === void 0) {
    return 'undefined'
  }
  if (value === true || value === false) {
    return 'boolean'
  }
  const typeOf = typeof value
  if (typeofs.includes(typeOf)) {
    return typeOf
  }
  if (typeOf === 'function') {
    return 'Function'
  }
  if (Array.isArray(value)) {
    return 'Array'
  }
  if (isBuffer(value)) {
    return 'Buffer'
  }
  const objectType = getObjectType(value)
  if (objectType) {
    return objectType
  }
  return 'Object'
}
function isBuffer(value) {
  return (
    value &&
    value.constructor &&
    value.constructor.isBuffer &&
    value.constructor.isBuffer.call(null, value)
  )
}
function getObjectType(value) {
  const objectTypeName = Object.prototype.toString.call(value).slice(8, -1)
  if (objectTypeNames.includes(objectTypeName)) {
    return objectTypeName
  }
  return void 0
}

// node_modules/cborg/esm/lib/token.js
var Type = class {
  constructor(major, name6, terminal) {
    this.major = major
    this.majorEncoded = major << 5
    this.name = name6
    this.terminal = terminal
  }
  toString() {
    return `Type[${this.major}].${this.name}`
  }
  compare(typ) {
    return this.major < typ.major ? -1 : this.major > typ.major ? 1 : 0
  }
}
Type.uint = new Type(0, 'uint', true)
Type.negint = new Type(1, 'negint', true)
Type.bytes = new Type(2, 'bytes', true)
Type.string = new Type(3, 'string', true)
Type.array = new Type(4, 'array', false)
Type.map = new Type(5, 'map', false)
Type.tag = new Type(6, 'tag', false)
Type.float = new Type(7, 'float', true)
Type.false = new Type(7, 'false', true)
Type.true = new Type(7, 'true', true)
Type.null = new Type(7, 'null', true)
Type.undefined = new Type(7, 'undefined', true)
Type.break = new Type(7, 'break', true)
var Token = class {
  constructor(type, value, encodedLength) {
    this.type = type
    this.value = value
    this.encodedLength = encodedLength
    this.encodedBytes = void 0
    this.byteValue = void 0
  }
  toString() {
    return `Token[${this.type}].${this.value}`
  }
}

// node_modules/cborg/esm/lib/byte-utils.js
var useBuffer =
  globalThis.process &&
  !globalThis.process.browser &&
  globalThis.Buffer &&
  typeof globalThis.Buffer.isBuffer === 'function'
var textDecoder = new TextDecoder()
var textEncoder = new TextEncoder()
function isBuffer2(buf2) {
  return useBuffer && globalThis.Buffer.isBuffer(buf2)
}
function asU8A(buf2) {
  if (!(buf2 instanceof Uint8Array)) {
    return Uint8Array.from(buf2)
  }
  return isBuffer2(buf2)
    ? new Uint8Array(buf2.buffer, buf2.byteOffset, buf2.byteLength)
    : buf2
}
var toString2 = useBuffer
  ? (bytes2, start, end) => {
      return end - start > 64
        ? globalThis.Buffer.from(bytes2.subarray(start, end)).toString('utf8')
        : utf8Slice(bytes2, start, end)
    }
  : (bytes2, start, end) => {
      return end - start > 64
        ? textDecoder.decode(bytes2.subarray(start, end))
        : utf8Slice(bytes2, start, end)
    }
var fromString2 = useBuffer
  ? (string3) => {
      return string3.length > 64
        ? globalThis.Buffer.from(string3)
        : utf8ToBytes(string3)
    }
  : (string3) => {
      return string3.length > 64
        ? textEncoder.encode(string3)
        : utf8ToBytes(string3)
    }
var fromArray = (arr) => {
  return Uint8Array.from(arr)
}
var slice = useBuffer
  ? (bytes2, start, end) => {
      if (isBuffer2(bytes2)) {
        return new Uint8Array(bytes2.subarray(start, end))
      }
      return bytes2.slice(start, end)
    }
  : (bytes2, start, end) => {
      return bytes2.slice(start, end)
    }
var concat = useBuffer
  ? (chunks, length2) => {
      chunks = chunks.map((c) =>
        c instanceof Uint8Array ? c : globalThis.Buffer.from(c)
      )
      return asU8A(globalThis.Buffer.concat(chunks, length2))
    }
  : (chunks, length2) => {
      const out = new Uint8Array(length2)
      let off = 0
      for (let b of chunks) {
        if (off + b.length > out.length) {
          b = b.subarray(0, out.length - off)
        }
        out.set(b, off)
        off += b.length
      }
      return out
    }
var alloc = useBuffer
  ? (size) => {
      return globalThis.Buffer.allocUnsafe(size)
    }
  : (size) => {
      return new Uint8Array(size)
    }
function compare(b1, b2) {
  if (isBuffer2(b1) && isBuffer2(b2)) {
    return b1.compare(b2)
  }
  for (let i = 0; i < b1.length; i++) {
    if (b1[i] === b2[i]) {
      continue
    }
    return b1[i] < b2[i] ? -1 : 1
  }
  return 0
}
function utf8ToBytes(string3, units = Infinity) {
  let codePoint
  const length2 = string3.length
  let leadSurrogate = null
  const bytes2 = []
  for (let i = 0; i < length2; ++i) {
    codePoint = string3.charCodeAt(i)
    if (codePoint > 55295 && codePoint < 57344) {
      if (!leadSurrogate) {
        if (codePoint > 56319) {
          if ((units -= 3) > -1) bytes2.push(239, 191, 189)
          continue
        } else if (i + 1 === length2) {
          if ((units -= 3) > -1) bytes2.push(239, 191, 189)
          continue
        }
        leadSurrogate = codePoint
        continue
      }
      if (codePoint < 56320) {
        if ((units -= 3) > -1) bytes2.push(239, 191, 189)
        leadSurrogate = codePoint
        continue
      }
      codePoint =
        (((leadSurrogate - 55296) << 10) | (codePoint - 56320)) + 65536
    } else if (leadSurrogate) {
      if ((units -= 3) > -1) bytes2.push(239, 191, 189)
    }
    leadSurrogate = null
    if (codePoint < 128) {
      if ((units -= 1) < 0) break
      bytes2.push(codePoint)
    } else if (codePoint < 2048) {
      if ((units -= 2) < 0) break
      bytes2.push((codePoint >> 6) | 192, (codePoint & 63) | 128)
    } else if (codePoint < 65536) {
      if ((units -= 3) < 0) break
      bytes2.push(
        (codePoint >> 12) | 224,
        ((codePoint >> 6) & 63) | 128,
        (codePoint & 63) | 128
      )
    } else if (codePoint < 1114112) {
      if ((units -= 4) < 0) break
      bytes2.push(
        (codePoint >> 18) | 240,
        ((codePoint >> 12) & 63) | 128,
        ((codePoint >> 6) & 63) | 128,
        (codePoint & 63) | 128
      )
    } else {
      throw new Error('Invalid code point')
    }
  }
  return bytes2
}
function utf8Slice(buf2, offset, end) {
  const res = []
  while (offset < end) {
    const firstByte = buf2[offset]
    let codePoint = null
    let bytesPerSequence =
      firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1
    if (offset + bytesPerSequence <= end) {
      let secondByte, thirdByte, fourthByte, tempCodePoint
      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 128) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf2[offset + 1]
          if ((secondByte & 192) === 128) {
            tempCodePoint = ((firstByte & 31) << 6) | (secondByte & 63)
            if (tempCodePoint > 127) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf2[offset + 1]
          thirdByte = buf2[offset + 2]
          if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
            tempCodePoint =
              ((firstByte & 15) << 12) |
              ((secondByte & 63) << 6) |
              (thirdByte & 63)
            if (
              tempCodePoint > 2047 &&
              (tempCodePoint < 55296 || tempCodePoint > 57343)
            ) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf2[offset + 1]
          thirdByte = buf2[offset + 2]
          fourthByte = buf2[offset + 3]
          if (
            (secondByte & 192) === 128 &&
            (thirdByte & 192) === 128 &&
            (fourthByte & 192) === 128
          ) {
            tempCodePoint =
              ((firstByte & 15) << 18) |
              ((secondByte & 63) << 12) |
              ((thirdByte & 63) << 6) |
              (fourthByte & 63)
            if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
              codePoint = tempCodePoint
            }
          }
      }
    }
    if (codePoint === null) {
      codePoint = 65533
      bytesPerSequence = 1
    } else if (codePoint > 65535) {
      codePoint -= 65536
      res.push(((codePoint >>> 10) & 1023) | 55296)
      codePoint = 56320 | (codePoint & 1023)
    }
    res.push(codePoint)
    offset += bytesPerSequence
  }
  return decodeCodePointsArray(res)
}
var MAX_ARGUMENTS_LENGTH = 4096
function decodeCodePointsArray(codePoints) {
  const len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints)
  }
  let res = ''
  let i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, (i += MAX_ARGUMENTS_LENGTH))
    )
  }
  return res
}

// node_modules/cborg/esm/lib/bl.js
var defaultChunkSize = 256
var Bl = class {
  constructor(chunkSize = defaultChunkSize) {
    this.chunkSize = chunkSize
    this.cursor = 0
    this.maxCursor = -1
    this.chunks = []
    this._initReuseChunk = null
  }
  reset() {
    this.cursor = 0
    this.maxCursor = -1
    if (this.chunks.length) {
      this.chunks = []
    }
    if (this._initReuseChunk !== null) {
      this.chunks.push(this._initReuseChunk)
      this.maxCursor = this._initReuseChunk.length - 1
    }
  }
  push(bytes2) {
    let topChunk = this.chunks[this.chunks.length - 1]
    const newMax = this.cursor + bytes2.length
    if (newMax <= this.maxCursor + 1) {
      const chunkPos = topChunk.length - (this.maxCursor - this.cursor) - 1
      topChunk.set(bytes2, chunkPos)
    } else {
      if (topChunk) {
        const chunkPos = topChunk.length - (this.maxCursor - this.cursor) - 1
        if (chunkPos < topChunk.length) {
          this.chunks[this.chunks.length - 1] = topChunk.subarray(0, chunkPos)
          this.maxCursor = this.cursor - 1
        }
      }
      if (bytes2.length < 64 && bytes2.length < this.chunkSize) {
        topChunk = alloc(this.chunkSize)
        this.chunks.push(topChunk)
        this.maxCursor += topChunk.length
        if (this._initReuseChunk === null) {
          this._initReuseChunk = topChunk
        }
        topChunk.set(bytes2, 0)
      } else {
        this.chunks.push(bytes2)
        this.maxCursor += bytes2.length
      }
    }
    this.cursor += bytes2.length
  }
  toBytes(reset = false) {
    let byts
    if (this.chunks.length === 1) {
      const chunk = this.chunks[0]
      if (reset && this.cursor > chunk.length / 2) {
        byts =
          this.cursor === chunk.length ? chunk : chunk.subarray(0, this.cursor)
        this._initReuseChunk = null
        this.chunks = []
      } else {
        byts = slice(chunk, 0, this.cursor)
      }
    } else {
      byts = concat(this.chunks, this.cursor)
    }
    if (reset) {
      this.reset()
    }
    return byts
  }
}

// node_modules/cborg/esm/lib/common.js
var decodeErrPrefix = 'CBOR decode error:'
var encodeErrPrefix = 'CBOR encode error:'
var uintMinorPrefixBytes = []
uintMinorPrefixBytes[23] = 1
uintMinorPrefixBytes[24] = 2
uintMinorPrefixBytes[25] = 3
uintMinorPrefixBytes[26] = 5
uintMinorPrefixBytes[27] = 9
function assertEnoughData(data, pos, need) {
  if (data.length - pos < need) {
    throw new Error(`${decodeErrPrefix} not enough data for type`)
  }
}

// node_modules/cborg/esm/lib/0uint.js
var uintBoundaries = [
  24,
  256,
  65536,
  4294967296,
  BigInt('18446744073709551616'),
]
function readUint8(data, offset, options) {
  assertEnoughData(data, offset, 1)
  const value = data[offset]
  if (options.strict === true && value < uintBoundaries[0]) {
    throw new Error(
      `${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`
    )
  }
  return value
}
function readUint16(data, offset, options) {
  assertEnoughData(data, offset, 2)
  const value = (data[offset] << 8) | data[offset + 1]
  if (options.strict === true && value < uintBoundaries[1]) {
    throw new Error(
      `${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`
    )
  }
  return value
}
function readUint32(data, offset, options) {
  assertEnoughData(data, offset, 4)
  const value =
    data[offset] * 16777216 +
    (data[offset + 1] << 16) +
    (data[offset + 2] << 8) +
    data[offset + 3]
  if (options.strict === true && value < uintBoundaries[2]) {
    throw new Error(
      `${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`
    )
  }
  return value
}
function readUint64(data, offset, options) {
  assertEnoughData(data, offset, 8)
  const hi =
    data[offset] * 16777216 +
    (data[offset + 1] << 16) +
    (data[offset + 2] << 8) +
    data[offset + 3]
  const lo =
    data[offset + 4] * 16777216 +
    (data[offset + 5] << 16) +
    (data[offset + 6] << 8) +
    data[offset + 7]
  const value = (BigInt(hi) << BigInt(32)) + BigInt(lo)
  if (options.strict === true && value < uintBoundaries[3]) {
    throw new Error(
      `${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`
    )
  }
  if (value <= Number.MAX_SAFE_INTEGER) {
    return Number(value)
  }
  if (options.allowBigInt === true) {
    return value
  }
  throw new Error(
    `${decodeErrPrefix} integers outside of the safe integer range are not supported`
  )
}
function decodeUint8(data, pos, _minor, options) {
  return new Token(Type.uint, readUint8(data, pos + 1, options), 2)
}
function decodeUint16(data, pos, _minor, options) {
  return new Token(Type.uint, readUint16(data, pos + 1, options), 3)
}
function decodeUint32(data, pos, _minor, options) {
  return new Token(Type.uint, readUint32(data, pos + 1, options), 5)
}
function decodeUint64(data, pos, _minor, options) {
  return new Token(Type.uint, readUint64(data, pos + 1, options), 9)
}
function encodeUint(buf2, token) {
  return encodeUintValue(buf2, 0, token.value)
}
function encodeUintValue(buf2, major, uint8) {
  if (uint8 < uintBoundaries[0]) {
    const nuint = Number(uint8)
    buf2.push([major | nuint])
  } else if (uint8 < uintBoundaries[1]) {
    const nuint = Number(uint8)
    buf2.push([major | 24, nuint])
  } else if (uint8 < uintBoundaries[2]) {
    const nuint = Number(uint8)
    buf2.push([major | 25, nuint >>> 8, nuint & 255])
  } else if (uint8 < uintBoundaries[3]) {
    const nuint = Number(uint8)
    buf2.push([
      major | 26,
      (nuint >>> 24) & 255,
      (nuint >>> 16) & 255,
      (nuint >>> 8) & 255,
      nuint & 255,
    ])
  } else {
    const buint = BigInt(uint8)
    if (buint < uintBoundaries[4]) {
      const set = [major | 27, 0, 0, 0, 0, 0, 0, 0]
      let lo = Number(buint & BigInt(4294967295))
      let hi = Number((buint >> BigInt(32)) & BigInt(4294967295))
      set[8] = lo & 255
      lo = lo >> 8
      set[7] = lo & 255
      lo = lo >> 8
      set[6] = lo & 255
      lo = lo >> 8
      set[5] = lo & 255
      set[4] = hi & 255
      hi = hi >> 8
      set[3] = hi & 255
      hi = hi >> 8
      set[2] = hi & 255
      hi = hi >> 8
      set[1] = hi & 255
      buf2.push(set)
    } else {
      throw new Error(
        `${decodeErrPrefix} encountered BigInt larger than allowable range`
      )
    }
  }
}
encodeUint.encodedSize = function encodedSize(token) {
  return encodeUintValue.encodedSize(token.value)
}
encodeUintValue.encodedSize = function encodedSize2(uint8) {
  if (uint8 < uintBoundaries[0]) {
    return 1
  }
  if (uint8 < uintBoundaries[1]) {
    return 2
  }
  if (uint8 < uintBoundaries[2]) {
    return 3
  }
  if (uint8 < uintBoundaries[3]) {
    return 5
  }
  return 9
}
encodeUint.compareTokens = function compareTokens(tok1, tok2) {
  return tok1.value < tok2.value ? -1 : tok1.value > tok2.value ? 1 : 0
}

// node_modules/cborg/esm/lib/1negint.js
function decodeNegint8(data, pos, _minor, options) {
  return new Token(Type.negint, -1 - readUint8(data, pos + 1, options), 2)
}
function decodeNegint16(data, pos, _minor, options) {
  return new Token(Type.negint, -1 - readUint16(data, pos + 1, options), 3)
}
function decodeNegint32(data, pos, _minor, options) {
  return new Token(Type.negint, -1 - readUint32(data, pos + 1, options), 5)
}
var neg1b = BigInt(-1)
var pos1b = BigInt(1)
function decodeNegint64(data, pos, _minor, options) {
  const int = readUint64(data, pos + 1, options)
  if (typeof int !== 'bigint') {
    const value = -1 - int
    if (value >= Number.MIN_SAFE_INTEGER) {
      return new Token(Type.negint, value, 9)
    }
  }
  if (options.allowBigInt !== true) {
    throw new Error(
      `${decodeErrPrefix} integers outside of the safe integer range are not supported`
    )
  }
  return new Token(Type.negint, neg1b - BigInt(int), 9)
}
function encodeNegint(buf2, token) {
  const negint2 = token.value
  const unsigned =
    typeof negint2 === 'bigint' ? negint2 * neg1b - pos1b : negint2 * -1 - 1
  encodeUintValue(buf2, token.type.majorEncoded, unsigned)
}
encodeNegint.encodedSize = function encodedSize3(token) {
  const negint2 = token.value
  const unsigned =
    typeof negint2 === 'bigint' ? negint2 * neg1b - pos1b : negint2 * -1 - 1
  if (unsigned < uintBoundaries[0]) {
    return 1
  }
  if (unsigned < uintBoundaries[1]) {
    return 2
  }
  if (unsigned < uintBoundaries[2]) {
    return 3
  }
  if (unsigned < uintBoundaries[3]) {
    return 5
  }
  return 9
}
encodeNegint.compareTokens = function compareTokens2(tok1, tok2) {
  return tok1.value < tok2.value ? 1 : tok1.value > tok2.value ? -1 : 0
}

// node_modules/cborg/esm/lib/2bytes.js
function toToken(data, pos, prefix, length2) {
  assertEnoughData(data, pos, prefix + length2)
  const buf2 = slice(data, pos + prefix, pos + prefix + length2)
  return new Token(Type.bytes, buf2, prefix + length2)
}
function decodeBytesCompact(data, pos, minor, _options) {
  return toToken(data, pos, 1, minor)
}
function decodeBytes8(data, pos, _minor, options) {
  return toToken(data, pos, 2, readUint8(data, pos + 1, options))
}
function decodeBytes16(data, pos, _minor, options) {
  return toToken(data, pos, 3, readUint16(data, pos + 1, options))
}
function decodeBytes32(data, pos, _minor, options) {
  return toToken(data, pos, 5, readUint32(data, pos + 1, options))
}
function decodeBytes64(data, pos, _minor, options) {
  const l = readUint64(data, pos + 1, options)
  if (typeof l === 'bigint') {
    throw new Error(
      `${decodeErrPrefix} 64-bit integer bytes lengths not supported`
    )
  }
  return toToken(data, pos, 9, l)
}
function tokenBytes(token) {
  if (token.encodedBytes === void 0) {
    token.encodedBytes =
      token.type === Type.string ? fromString2(token.value) : token.value
  }
  return token.encodedBytes
}
function encodeBytes(buf2, token) {
  const bytes2 = tokenBytes(token)
  encodeUintValue(buf2, token.type.majorEncoded, bytes2.length)
  buf2.push(bytes2)
}
encodeBytes.encodedSize = function encodedSize4(token) {
  const bytes2 = tokenBytes(token)
  return encodeUintValue.encodedSize(bytes2.length) + bytes2.length
}
encodeBytes.compareTokens = function compareTokens3(tok1, tok2) {
  return compareBytes(tokenBytes(tok1), tokenBytes(tok2))
}
function compareBytes(b1, b2) {
  return b1.length < b2.length
    ? -1
    : b1.length > b2.length
    ? 1
    : compare(b1, b2)
}

// node_modules/cborg/esm/lib/3string.js
function toToken2(data, pos, prefix, length2, options) {
  const totLength = prefix + length2
  assertEnoughData(data, pos, totLength)
  const tok = new Token(
    Type.string,
    toString2(data, pos + prefix, pos + totLength),
    totLength
  )
  if (options.retainStringBytes === true) {
    tok.byteValue = slice(data, pos + prefix, pos + totLength)
  }
  return tok
}
function decodeStringCompact(data, pos, minor, options) {
  return toToken2(data, pos, 1, minor, options)
}
function decodeString8(data, pos, _minor, options) {
  return toToken2(data, pos, 2, readUint8(data, pos + 1, options), options)
}
function decodeString16(data, pos, _minor, options) {
  return toToken2(data, pos, 3, readUint16(data, pos + 1, options), options)
}
function decodeString32(data, pos, _minor, options) {
  return toToken2(data, pos, 5, readUint32(data, pos + 1, options), options)
}
function decodeString64(data, pos, _minor, options) {
  const l = readUint64(data, pos + 1, options)
  if (typeof l === 'bigint') {
    throw new Error(
      `${decodeErrPrefix} 64-bit integer string lengths not supported`
    )
  }
  return toToken2(data, pos, 9, l, options)
}
var encodeString = encodeBytes

// node_modules/cborg/esm/lib/4array.js
function toToken3(_data, _pos, prefix, length2) {
  return new Token(Type.array, length2, prefix)
}
function decodeArrayCompact(data, pos, minor, _options) {
  return toToken3(data, pos, 1, minor)
}
function decodeArray8(data, pos, _minor, options) {
  return toToken3(data, pos, 2, readUint8(data, pos + 1, options))
}
function decodeArray16(data, pos, _minor, options) {
  return toToken3(data, pos, 3, readUint16(data, pos + 1, options))
}
function decodeArray32(data, pos, _minor, options) {
  return toToken3(data, pos, 5, readUint32(data, pos + 1, options))
}
function decodeArray64(data, pos, _minor, options) {
  const l = readUint64(data, pos + 1, options)
  if (typeof l === 'bigint') {
    throw new Error(
      `${decodeErrPrefix} 64-bit integer array lengths not supported`
    )
  }
  return toToken3(data, pos, 9, l)
}
function decodeArrayIndefinite(data, pos, _minor, options) {
  if (options.allowIndefinite === false) {
    throw new Error(`${decodeErrPrefix} indefinite length items not allowed`)
  }
  return toToken3(data, pos, 1, Infinity)
}
function encodeArray(buf2, token) {
  encodeUintValue(buf2, Type.array.majorEncoded, token.value)
}
encodeArray.compareTokens = encodeUint.compareTokens
encodeArray.encodedSize = function encodedSize5(token) {
  return encodeUintValue.encodedSize(token.value)
}

// node_modules/cborg/esm/lib/5map.js
function toToken4(_data, _pos, prefix, length2) {
  return new Token(Type.map, length2, prefix)
}
function decodeMapCompact(data, pos, minor, _options) {
  return toToken4(data, pos, 1, minor)
}
function decodeMap8(data, pos, _minor, options) {
  return toToken4(data, pos, 2, readUint8(data, pos + 1, options))
}
function decodeMap16(data, pos, _minor, options) {
  return toToken4(data, pos, 3, readUint16(data, pos + 1, options))
}
function decodeMap32(data, pos, _minor, options) {
  return toToken4(data, pos, 5, readUint32(data, pos + 1, options))
}
function decodeMap64(data, pos, _minor, options) {
  const l = readUint64(data, pos + 1, options)
  if (typeof l === 'bigint') {
    throw new Error(
      `${decodeErrPrefix} 64-bit integer map lengths not supported`
    )
  }
  return toToken4(data, pos, 9, l)
}
function decodeMapIndefinite(data, pos, _minor, options) {
  if (options.allowIndefinite === false) {
    throw new Error(`${decodeErrPrefix} indefinite length items not allowed`)
  }
  return toToken4(data, pos, 1, Infinity)
}
function encodeMap(buf2, token) {
  encodeUintValue(buf2, Type.map.majorEncoded, token.value)
}
encodeMap.compareTokens = encodeUint.compareTokens
encodeMap.encodedSize = function encodedSize6(token) {
  return encodeUintValue.encodedSize(token.value)
}

// node_modules/cborg/esm/lib/6tag.js
function decodeTagCompact(_data, _pos, minor, _options) {
  return new Token(Type.tag, minor, 1)
}
function decodeTag8(data, pos, _minor, options) {
  return new Token(Type.tag, readUint8(data, pos + 1, options), 2)
}
function decodeTag16(data, pos, _minor, options) {
  return new Token(Type.tag, readUint16(data, pos + 1, options), 3)
}
function decodeTag32(data, pos, _minor, options) {
  return new Token(Type.tag, readUint32(data, pos + 1, options), 5)
}
function decodeTag64(data, pos, _minor, options) {
  return new Token(Type.tag, readUint64(data, pos + 1, options), 9)
}
function encodeTag(buf2, token) {
  encodeUintValue(buf2, Type.tag.majorEncoded, token.value)
}
encodeTag.compareTokens = encodeUint.compareTokens
encodeTag.encodedSize = function encodedSize7(token) {
  return encodeUintValue.encodedSize(token.value)
}

// node_modules/cborg/esm/lib/7float.js
var MINOR_FALSE = 20
var MINOR_TRUE = 21
var MINOR_NULL = 22
var MINOR_UNDEFINED = 23
function decodeUndefined(_data, _pos, _minor, options) {
  if (options.allowUndefined === false) {
    throw new Error(`${decodeErrPrefix} undefined values are not supported`)
  } else if (options.coerceUndefinedToNull === true) {
    return new Token(Type.null, null, 1)
  }
  return new Token(Type.undefined, void 0, 1)
}
function decodeBreak(_data, _pos, _minor, options) {
  if (options.allowIndefinite === false) {
    throw new Error(`${decodeErrPrefix} indefinite length items not allowed`)
  }
  return new Token(Type.break, void 0, 1)
}
function createToken(value, bytes2, options) {
  if (options) {
    if (options.allowNaN === false && Number.isNaN(value)) {
      throw new Error(`${decodeErrPrefix} NaN values are not supported`)
    }
    if (
      options.allowInfinity === false &&
      (value === Infinity || value === -Infinity)
    ) {
      throw new Error(`${decodeErrPrefix} Infinity values are not supported`)
    }
  }
  return new Token(Type.float, value, bytes2)
}
function decodeFloat16(data, pos, _minor, options) {
  return createToken(readFloat16(data, pos + 1), 3, options)
}
function decodeFloat32(data, pos, _minor, options) {
  return createToken(readFloat32(data, pos + 1), 5, options)
}
function decodeFloat64(data, pos, _minor, options) {
  return createToken(readFloat64(data, pos + 1), 9, options)
}
function encodeFloat(buf2, token, options) {
  const float2 = token.value
  if (float2 === false) {
    buf2.push([Type.float.majorEncoded | MINOR_FALSE])
  } else if (float2 === true) {
    buf2.push([Type.float.majorEncoded | MINOR_TRUE])
  } else if (float2 === null) {
    buf2.push([Type.float.majorEncoded | MINOR_NULL])
  } else if (float2 === void 0) {
    buf2.push([Type.float.majorEncoded | MINOR_UNDEFINED])
  } else {
    let decoded
    let success = false
    if (!options || options.float64 !== true) {
      encodeFloat16(float2)
      decoded = readFloat16(ui8a, 1)
      if (float2 === decoded || Number.isNaN(float2)) {
        ui8a[0] = 249
        buf2.push(ui8a.slice(0, 3))
        success = true
      } else {
        encodeFloat32(float2)
        decoded = readFloat32(ui8a, 1)
        if (float2 === decoded) {
          ui8a[0] = 250
          buf2.push(ui8a.slice(0, 5))
          success = true
        }
      }
    }
    if (!success) {
      encodeFloat64(float2)
      decoded = readFloat64(ui8a, 1)
      ui8a[0] = 251
      buf2.push(ui8a.slice(0, 9))
    }
  }
}
encodeFloat.encodedSize = function encodedSize8(token, options) {
  const float2 = token.value
  if (
    float2 === false ||
    float2 === true ||
    float2 === null ||
    float2 === void 0
  ) {
    return 1
  }
  if (!options || options.float64 !== true) {
    encodeFloat16(float2)
    let decoded = readFloat16(ui8a, 1)
    if (float2 === decoded || Number.isNaN(float2)) {
      return 3
    }
    encodeFloat32(float2)
    decoded = readFloat32(ui8a, 1)
    if (float2 === decoded) {
      return 5
    }
  }
  return 9
}
var buffer = new ArrayBuffer(9)
var dataView = new DataView(buffer, 1)
var ui8a = new Uint8Array(buffer, 0)
function encodeFloat16(inp) {
  if (inp === Infinity) {
    dataView.setUint16(0, 31744, false)
  } else if (inp === -Infinity) {
    dataView.setUint16(0, 64512, false)
  } else if (Number.isNaN(inp)) {
    dataView.setUint16(0, 32256, false)
  } else {
    dataView.setFloat32(0, inp)
    const valu32 = dataView.getUint32(0)
    const exponent = (valu32 & 2139095040) >> 23
    const mantissa = valu32 & 8388607
    if (exponent === 255) {
      dataView.setUint16(0, 31744, false)
    } else if (exponent === 0) {
      dataView.setUint16(
        0,
        ((inp & 2147483648) >> 16) | (mantissa >> 13),
        false
      )
    } else {
      const logicalExponent = exponent - 127
      if (logicalExponent < -24) {
        dataView.setUint16(0, 0)
      } else if (logicalExponent < -14) {
        dataView.setUint16(
          0,
          ((valu32 & 2147483648) >> 16) | (1 << (24 + logicalExponent)),
          false
        )
      } else {
        dataView.setUint16(
          0,
          ((valu32 & 2147483648) >> 16) |
            ((logicalExponent + 15) << 10) |
            (mantissa >> 13),
          false
        )
      }
    }
  }
}
function readFloat16(ui8a2, pos) {
  if (ui8a2.length - pos < 2) {
    throw new Error(`${decodeErrPrefix} not enough data for float16`)
  }
  const half = (ui8a2[pos] << 8) + ui8a2[pos + 1]
  if (half === 31744) {
    return Infinity
  }
  if (half === 64512) {
    return -Infinity
  }
  if (half === 32256) {
    return NaN
  }
  const exp = (half >> 10) & 31
  const mant = half & 1023
  let val
  if (exp === 0) {
    val = mant * 2 ** -24
  } else if (exp !== 31) {
    val = (mant + 1024) * 2 ** (exp - 25)
  } else {
    val = mant === 0 ? Infinity : NaN
  }
  return half & 32768 ? -val : val
}
function encodeFloat32(inp) {
  dataView.setFloat32(0, inp, false)
}
function readFloat32(ui8a2, pos) {
  if (ui8a2.length - pos < 4) {
    throw new Error(`${decodeErrPrefix} not enough data for float32`)
  }
  const offset = (ui8a2.byteOffset || 0) + pos
  return new DataView(ui8a2.buffer, offset, 4).getFloat32(0, false)
}
function encodeFloat64(inp) {
  dataView.setFloat64(0, inp, false)
}
function readFloat64(ui8a2, pos) {
  if (ui8a2.length - pos < 8) {
    throw new Error(`${decodeErrPrefix} not enough data for float64`)
  }
  const offset = (ui8a2.byteOffset || 0) + pos
  return new DataView(ui8a2.buffer, offset, 8).getFloat64(0, false)
}
encodeFloat.compareTokens = encodeUint.compareTokens

// node_modules/cborg/esm/lib/jump.js
function invalidMinor(data, pos, minor) {
  throw new Error(
    `${decodeErrPrefix} encountered invalid minor (${minor}) for major ${
      data[pos] >>> 5
    }`
  )
}
function errorer(msg) {
  return () => {
    throw new Error(`${decodeErrPrefix} ${msg}`)
  }
}
var jump = []
for (let i = 0; i <= 23; i++) {
  jump[i] = invalidMinor
}
jump[24] = decodeUint8
jump[25] = decodeUint16
jump[26] = decodeUint32
jump[27] = decodeUint64
jump[28] = invalidMinor
jump[29] = invalidMinor
jump[30] = invalidMinor
jump[31] = invalidMinor
for (let i = 32; i <= 55; i++) {
  jump[i] = invalidMinor
}
jump[56] = decodeNegint8
jump[57] = decodeNegint16
jump[58] = decodeNegint32
jump[59] = decodeNegint64
jump[60] = invalidMinor
jump[61] = invalidMinor
jump[62] = invalidMinor
jump[63] = invalidMinor
for (let i = 64; i <= 87; i++) {
  jump[i] = decodeBytesCompact
}
jump[88] = decodeBytes8
jump[89] = decodeBytes16
jump[90] = decodeBytes32
jump[91] = decodeBytes64
jump[92] = invalidMinor
jump[93] = invalidMinor
jump[94] = invalidMinor
jump[95] = errorer('indefinite length bytes/strings are not supported')
for (let i = 96; i <= 119; i++) {
  jump[i] = decodeStringCompact
}
jump[120] = decodeString8
jump[121] = decodeString16
jump[122] = decodeString32
jump[123] = decodeString64
jump[124] = invalidMinor
jump[125] = invalidMinor
jump[126] = invalidMinor
jump[127] = errorer('indefinite length bytes/strings are not supported')
for (let i = 128; i <= 151; i++) {
  jump[i] = decodeArrayCompact
}
jump[152] = decodeArray8
jump[153] = decodeArray16
jump[154] = decodeArray32
jump[155] = decodeArray64
jump[156] = invalidMinor
jump[157] = invalidMinor
jump[158] = invalidMinor
jump[159] = decodeArrayIndefinite
for (let i = 160; i <= 183; i++) {
  jump[i] = decodeMapCompact
}
jump[184] = decodeMap8
jump[185] = decodeMap16
jump[186] = decodeMap32
jump[187] = decodeMap64
jump[188] = invalidMinor
jump[189] = invalidMinor
jump[190] = invalidMinor
jump[191] = decodeMapIndefinite
for (let i = 192; i <= 215; i++) {
  jump[i] = decodeTagCompact
}
jump[216] = decodeTag8
jump[217] = decodeTag16
jump[218] = decodeTag32
jump[219] = decodeTag64
jump[220] = invalidMinor
jump[221] = invalidMinor
jump[222] = invalidMinor
jump[223] = invalidMinor
for (let i = 224; i <= 243; i++) {
  jump[i] = errorer('simple values are not supported')
}
jump[244] = invalidMinor
jump[245] = invalidMinor
jump[246] = invalidMinor
jump[247] = decodeUndefined
jump[248] = errorer('simple values are not supported')
jump[249] = decodeFloat16
jump[250] = decodeFloat32
jump[251] = decodeFloat64
jump[252] = invalidMinor
jump[253] = invalidMinor
jump[254] = invalidMinor
jump[255] = decodeBreak
var quick = []
for (let i = 0; i < 24; i++) {
  quick[i] = new Token(Type.uint, i, 1)
}
for (let i = -1; i >= -24; i--) {
  quick[31 - i] = new Token(Type.negint, i, 1)
}
quick[64] = new Token(Type.bytes, new Uint8Array(0), 1)
quick[96] = new Token(Type.string, '', 1)
quick[128] = new Token(Type.array, 0, 1)
quick[160] = new Token(Type.map, 0, 1)
quick[244] = new Token(Type.false, false, 1)
quick[245] = new Token(Type.true, true, 1)
quick[246] = new Token(Type.null, null, 1)
function quickEncodeToken(token) {
  switch (token.type) {
    case Type.false:
      return fromArray([244])
    case Type.true:
      return fromArray([245])
    case Type.null:
      return fromArray([246])
    case Type.bytes:
      if (!token.value.length) {
        return fromArray([64])
      }
      return
    case Type.string:
      if (token.value === '') {
        return fromArray([96])
      }
      return
    case Type.array:
      if (token.value === 0) {
        return fromArray([128])
      }
      return
    case Type.map:
      if (token.value === 0) {
        return fromArray([160])
      }
      return
    case Type.uint:
      if (token.value < 24) {
        return fromArray([Number(token.value)])
      }
      return
    case Type.negint:
      if (token.value >= -24) {
        return fromArray([31 - Number(token.value)])
      }
  }
}

// node_modules/cborg/esm/lib/encode.js
var defaultEncodeOptions = {
  float64: false,
  mapSorter,
  quickEncodeToken,
}
function makeCborEncoders() {
  const encoders = []
  encoders[Type.uint.major] = encodeUint
  encoders[Type.negint.major] = encodeNegint
  encoders[Type.bytes.major] = encodeBytes
  encoders[Type.string.major] = encodeString
  encoders[Type.array.major] = encodeArray
  encoders[Type.map.major] = encodeMap
  encoders[Type.tag.major] = encodeTag
  encoders[Type.float.major] = encodeFloat
  return encoders
}
var cborEncoders = makeCborEncoders()
var buf = new Bl()
var Ref = class {
  constructor(obj, parent) {
    this.obj = obj
    this.parent = parent
  }
  includes(obj) {
    let p = this
    do {
      if (p.obj === obj) {
        return true
      }
    } while ((p = p.parent))
    return false
  }
  static createCheck(stack, obj) {
    if (stack && stack.includes(obj)) {
      throw new Error(`${encodeErrPrefix} object contains circular references`)
    }
    return new Ref(obj, stack)
  }
}
var simpleTokens = {
  null: new Token(Type.null, null),
  undefined: new Token(Type.undefined, void 0),
  true: new Token(Type.true, true),
  false: new Token(Type.false, false),
  emptyArray: new Token(Type.array, 0),
  emptyMap: new Token(Type.map, 0),
}
var typeEncoders = {
  number(obj, _typ, _options, _refStack) {
    if (!Number.isInteger(obj) || !Number.isSafeInteger(obj)) {
      return new Token(Type.float, obj)
    } else if (obj >= 0) {
      return new Token(Type.uint, obj)
    } else {
      return new Token(Type.negint, obj)
    }
  },
  bigint(obj, _typ, _options, _refStack) {
    if (obj >= BigInt(0)) {
      return new Token(Type.uint, obj)
    } else {
      return new Token(Type.negint, obj)
    }
  },
  Uint8Array(obj, _typ, _options, _refStack) {
    return new Token(Type.bytes, obj)
  },
  string(obj, _typ, _options, _refStack) {
    return new Token(Type.string, obj)
  },
  boolean(obj, _typ, _options, _refStack) {
    return obj ? simpleTokens.true : simpleTokens.false
  },
  null(_obj, _typ, _options, _refStack) {
    return simpleTokens.null
  },
  undefined(_obj, _typ, _options, _refStack) {
    return simpleTokens.undefined
  },
  ArrayBuffer(obj, _typ, _options, _refStack) {
    return new Token(Type.bytes, new Uint8Array(obj))
  },
  DataView(obj, _typ, _options, _refStack) {
    return new Token(
      Type.bytes,
      new Uint8Array(obj.buffer, obj.byteOffset, obj.byteLength)
    )
  },
  Array(obj, _typ, options, refStack) {
    if (!obj.length) {
      if (options.addBreakTokens === true) {
        return [simpleTokens.emptyArray, new Token(Type.break)]
      }
      return simpleTokens.emptyArray
    }
    refStack = Ref.createCheck(refStack, obj)
    const entries = []
    let i = 0
    for (const e of obj) {
      entries[i++] = objectToTokens(e, options, refStack)
    }
    if (options.addBreakTokens) {
      return [new Token(Type.array, obj.length), entries, new Token(Type.break)]
    }
    return [new Token(Type.array, obj.length), entries]
  },
  Object(obj, typ, options, refStack) {
    const isMap = typ !== 'Object'
    const keys = isMap ? obj.keys() : Object.keys(obj)
    const length2 = isMap ? obj.size : keys.length
    if (!length2) {
      if (options.addBreakTokens === true) {
        return [simpleTokens.emptyMap, new Token(Type.break)]
      }
      return simpleTokens.emptyMap
    }
    refStack = Ref.createCheck(refStack, obj)
    const entries = []
    let i = 0
    for (const key of keys) {
      entries[i++] = [
        objectToTokens(key, options, refStack),
        objectToTokens(isMap ? obj.get(key) : obj[key], options, refStack),
      ]
    }
    sortMapEntries(entries, options)
    if (options.addBreakTokens) {
      return [new Token(Type.map, length2), entries, new Token(Type.break)]
    }
    return [new Token(Type.map, length2), entries]
  },
}
typeEncoders.Map = typeEncoders.Object
typeEncoders.Buffer = typeEncoders.Uint8Array
for (const typ of 'Uint8Clamped Uint16 Uint32 Int8 Int16 Int32 BigUint64 BigInt64 Float32 Float64'.split(
  ' '
)) {
  typeEncoders[`${typ}Array`] = typeEncoders.DataView
}
function objectToTokens(obj, options = {}, refStack) {
  const typ = is(obj)
  const customTypeEncoder =
    (options && options.typeEncoders && options.typeEncoders[typ]) ||
    typeEncoders[typ]
  if (typeof customTypeEncoder === 'function') {
    const tokens = customTypeEncoder(obj, typ, options, refStack)
    if (tokens != null) {
      return tokens
    }
  }
  const typeEncoder = typeEncoders[typ]
  if (!typeEncoder) {
    throw new Error(`${encodeErrPrefix} unsupported type: ${typ}`)
  }
  return typeEncoder(obj, typ, options, refStack)
}
function sortMapEntries(entries, options) {
  if (options.mapSorter) {
    entries.sort(options.mapSorter)
  }
}
function mapSorter(e1, e2) {
  const keyToken1 = Array.isArray(e1[0]) ? e1[0][0] : e1[0]
  const keyToken2 = Array.isArray(e2[0]) ? e2[0][0] : e2[0]
  if (keyToken1.type !== keyToken2.type) {
    return keyToken1.type.compare(keyToken2.type)
  }
  const major = keyToken1.type.major
  const tcmp = cborEncoders[major].compareTokens(keyToken1, keyToken2)
  if (tcmp === 0) {
    console.warn(
      'WARNING: complex key types used, CBOR key sorting guarantees are gone'
    )
  }
  return tcmp
}
function tokensToEncoded(buf2, tokens, encoders, options) {
  if (Array.isArray(tokens)) {
    for (const token of tokens) {
      tokensToEncoded(buf2, token, encoders, options)
    }
  } else {
    encoders[tokens.type.major](buf2, tokens, options)
  }
}
function encodeCustom(data, encoders, options) {
  const tokens = objectToTokens(data, options)
  if (!Array.isArray(tokens) && options.quickEncodeToken) {
    const quickBytes = options.quickEncodeToken(tokens)
    if (quickBytes) {
      return quickBytes
    }
    const encoder = encoders[tokens.type.major]
    if (encoder.encodedSize) {
      const size = encoder.encodedSize(tokens, options)
      const buf2 = new Bl(size)
      encoder(buf2, tokens, options)
      if (buf2.chunks.length !== 1) {
        throw new Error(
          `Unexpected error: pre-calculated length for ${tokens} was wrong`
        )
      }
      return asU8A(buf2.chunks[0])
    }
  }
  buf.reset()
  tokensToEncoded(buf, tokens, encoders, options)
  return buf.toBytes(true)
}
function encode4(data, options) {
  options = Object.assign({}, defaultEncodeOptions, options)
  return encodeCustom(data, cborEncoders, options)
}

// node_modules/cborg/esm/lib/decode.js
var defaultDecodeOptions = {
  strict: false,
  allowIndefinite: true,
  allowUndefined: true,
  allowBigInt: true,
}
var Tokeniser = class {
  constructor(data, options = {}) {
    this.pos = 0
    this.data = data
    this.options = options
  }
  done() {
    return this.pos >= this.data.length
  }
  next() {
    const byt = this.data[this.pos]
    let token = quick[byt]
    if (token === void 0) {
      const decoder = jump[byt]
      if (!decoder) {
        throw new Error(
          `${decodeErrPrefix} no decoder for major type ${
            byt >>> 5
          } (byte 0x${byt.toString(16).padStart(2, '0')})`
        )
      }
      const minor = byt & 31
      token = decoder(this.data, this.pos, minor, this.options)
    }
    this.pos += token.encodedLength
    return token
  }
}
var DONE = Symbol.for('DONE')
var BREAK = Symbol.for('BREAK')
function tokenToArray(token, tokeniser, options) {
  const arr = []
  for (let i = 0; i < token.value; i++) {
    const value = tokensToObject(tokeniser, options)
    if (value === BREAK) {
      if (token.value === Infinity) {
        break
      }
      throw new Error(
        `${decodeErrPrefix} got unexpected break to lengthed array`
      )
    }
    if (value === DONE) {
      throw new Error(
        `${decodeErrPrefix} found array but not enough entries (got ${i}, expected ${token.value})`
      )
    }
    arr[i] = value
  }
  return arr
}
function tokenToMap(token, tokeniser, options) {
  const useMaps = options.useMaps === true
  const obj = useMaps ? void 0 : {}
  const m = useMaps ? new Map() : void 0
  for (let i = 0; i < token.value; i++) {
    const key = tokensToObject(tokeniser, options)
    if (key === BREAK) {
      if (token.value === Infinity) {
        break
      }
      throw new Error(`${decodeErrPrefix} got unexpected break to lengthed map`)
    }
    if (key === DONE) {
      throw new Error(
        `${decodeErrPrefix} found map but not enough entries (got ${i} [no key], expected ${token.value})`
      )
    }
    if (useMaps !== true && typeof key !== 'string') {
      throw new Error(
        `${decodeErrPrefix} non-string keys not supported (got ${typeof key})`
      )
    }
    const value = tokensToObject(tokeniser, options)
    if (value === DONE) {
      throw new Error(
        `${decodeErrPrefix} found map but not enough entries (got ${i} [no value], expected ${token.value})`
      )
    }
    if (useMaps) {
      m.set(key, value)
    } else {
      obj[key] = value
    }
  }
  return useMaps ? m : obj
}
function tokensToObject(tokeniser, options) {
  if (tokeniser.done()) {
    return DONE
  }
  const token = tokeniser.next()
  if (token.type === Type.break) {
    return BREAK
  }
  if (token.type.terminal) {
    return token.value
  }
  if (token.type === Type.array) {
    return tokenToArray(token, tokeniser, options)
  }
  if (token.type === Type.map) {
    return tokenToMap(token, tokeniser, options)
  }
  if (token.type === Type.tag) {
    if (options.tags && typeof options.tags[token.value] === 'function') {
      const tagged = tokensToObject(tokeniser, options)
      return options.tags[token.value](tagged)
    }
    throw new Error(`${decodeErrPrefix} tag not supported (${token.value})`)
  }
  throw new Error('unsupported')
}
function decode5(data, options) {
  if (!(data instanceof Uint8Array)) {
    throw new Error(`${decodeErrPrefix} data to decode must be a Uint8Array`)
  }
  options = Object.assign({}, defaultDecodeOptions, options)
  const tokeniser = options.tokenizer || new Tokeniser(data, options)
  const decoded = tokensToObject(tokeniser, options)
  if (decoded === DONE) {
    throw new Error(`${decodeErrPrefix} did not find any content to decode`)
  }
  if (decoded === BREAK) {
    throw new Error(`${decodeErrPrefix} got unexpected break`)
  }
  if (!tokeniser.done()) {
    throw new Error(
      `${decodeErrPrefix} too many terminals, data makes no sense`
    )
  }
  return decoded
}

// node_modules/@ipld/dag-cbor/esm/index.js
init_cid()
var CID_CBOR_TAG = 42
function cidEncoder(obj) {
  if (obj.asCID !== obj) {
    return null
  }
  const cid = CID.asCID(obj)
  if (!cid) {
    return null
  }
  const bytes2 = new Uint8Array(cid.bytes.byteLength + 1)
  bytes2.set(cid.bytes, 1)
  return [new Token(Type.tag, CID_CBOR_TAG), new Token(Type.bytes, bytes2)]
}
function undefinedEncoder() {
  throw new Error(
    '`undefined` is not supported by the IPLD Data Model and cannot be encoded'
  )
}
function numberEncoder(num) {
  if (Number.isNaN(num)) {
    throw new Error(
      '`NaN` is not supported by the IPLD Data Model and cannot be encoded'
    )
  }
  if (num === Infinity || num === -Infinity) {
    throw new Error(
      '`Infinity` and `-Infinity` is not supported by the IPLD Data Model and cannot be encoded'
    )
  }
  return null
}
var encodeOptions = {
  float64: true,
  typeEncoders: {
    Object: cidEncoder,
    undefined: undefinedEncoder,
    number: numberEncoder,
  },
}
function cidDecoder(bytes2) {
  if (bytes2[0] !== 0) {
    throw new Error('Invalid CID for CBOR tag 42; expected leading 0x00')
  }
  return CID.decode(bytes2.subarray(1))
}
var decodeOptions = {
  allowIndefinite: false,
  coerceUndefinedToNull: true,
  allowNaN: false,
  allowInfinity: false,
  allowBigInt: true,
  strict: true,
  useMaps: false,
  tags: [],
}
decodeOptions.tags[CID_CBOR_TAG] = cidDecoder
var encode5 = (node) => encode4(node, encodeOptions)
var decode6 = (data) => decode5(data, decodeOptions)

// node_modules/@ipld/car/esm/lib/decoder.js
var CIDV0_BYTES = {
  SHA2_256: 18,
  LENGTH: 32,
  DAG_PB: 112,
}
async function readVarint(reader) {
  const bytes2 = await reader.upTo(8)
  const i = import_varint2.default.decode(bytes2)
  reader.seek(import_varint2.default.decode.bytes)
  return i
}
async function readHeader(reader) {
  const length2 = await readVarint(reader)
  if (length2 === 0) {
    throw new Error('Invalid CAR header (zero length)')
  }
  const header = await reader.exactly(length2)
  reader.seek(length2)
  const block = decode6(header)
  if (block == null || Array.isArray(block) || typeof block !== 'object') {
    throw new Error('Invalid CAR header format')
  }
  if (block.version !== 1) {
    if (typeof block.version === 'string') {
      throw new Error(`Invalid CAR version: "${block.version}"`)
    }
    throw new Error(`Invalid CAR version: ${block.version}`)
  }
  if (!Array.isArray(block.roots)) {
    throw new Error('Invalid CAR header format')
  }
  if (
    Object.keys(block).filter((p) => p !== 'roots' && p !== 'version').length
  ) {
    throw new Error('Invalid CAR header format')
  }
  return block
}
async function readMultihash(reader) {
  const bytes2 = await reader.upTo(8)
  import_varint2.default.decode(bytes2)
  const codeLength = import_varint2.default.decode.bytes
  const length2 = import_varint2.default.decode(
    bytes2.subarray(import_varint2.default.decode.bytes)
  )
  const lengthLength = import_varint2.default.decode.bytes
  const mhLength = codeLength + lengthLength + length2
  const multihash = await reader.exactly(mhLength)
  reader.seek(mhLength)
  return multihash
}
async function readCid(reader) {
  const first = await reader.exactly(2)
  if (first[0] === CIDV0_BYTES.SHA2_256 && first[1] === CIDV0_BYTES.LENGTH) {
    const bytes3 = await reader.exactly(34)
    reader.seek(34)
    const multihash2 = decode4(bytes3)
    return CID.create(0, CIDV0_BYTES.DAG_PB, multihash2)
  }
  const version2 = await readVarint(reader)
  if (version2 !== 1) {
    throw new Error(`Unexpected CID version (${version2})`)
  }
  const codec = await readVarint(reader)
  const bytes2 = await readMultihash(reader)
  const multihash = decode4(bytes2)
  return CID.create(version2, codec, multihash)
}
async function readBlockHead(reader) {
  const start = reader.pos
  let length2 = await readVarint(reader)
  if (length2 === 0) {
    throw new Error('Invalid CAR section (zero length)')
  }
  length2 += reader.pos - start
  const cid = await readCid(reader)
  const blockLength = length2 - (reader.pos - start)
  return {
    cid,
    length: length2,
    blockLength,
  }
}
async function readBlock(reader) {
  const { cid, blockLength } = await readBlockHead(reader)
  const bytes2 = await reader.exactly(blockLength)
  reader.seek(blockLength)
  return {
    bytes: bytes2,
    cid,
  }
}
async function readBlockIndex(reader) {
  const offset = reader.pos
  const { cid, length: length2, blockLength } = await readBlockHead(reader)
  const index = {
    cid,
    length: length2,
    blockLength,
    offset,
    blockOffset: reader.pos,
  }
  reader.seek(index.blockLength)
  return index
}
function createDecoder(reader) {
  const headerPromise = readHeader(reader)
  return {
    header: () => headerPromise,
    async *blocks() {
      await headerPromise
      while ((await reader.upTo(8)).length > 0) {
        yield await readBlock(reader)
      }
    },
    async *blocksIndex() {
      await headerPromise
      while ((await reader.upTo(8)).length > 0) {
        yield await readBlockIndex(reader)
      }
    },
  }
}
function bytesReader(bytes2) {
  let pos = 0
  return {
    async upTo(length2) {
      return bytes2.subarray(pos, pos + Math.min(length2, bytes2.length - pos))
    },
    async exactly(length2) {
      if (length2 > bytes2.length - pos) {
        throw new Error('Unexpected end of data')
      }
      return bytes2.subarray(pos, pos + length2)
    },
    seek(length2) {
      pos += length2
    },
    get pos() {
      return pos
    },
  }
}
function chunkReader(readChunk) {
  let pos = 0
  let have = 0
  let offset = 0
  let currentChunk = new Uint8Array(0)
  const read2 = async (length2) => {
    have = currentChunk.length - offset
    const bufa = [currentChunk.subarray(offset)]
    while (have < length2) {
      const chunk = await readChunk()
      if (chunk == null) {
        break
      }
      if (have < 0) {
        if (chunk.length > have) {
          bufa.push(chunk.subarray(-have))
        }
      } else {
        bufa.push(chunk)
      }
      have += chunk.length
    }
    currentChunk = new Uint8Array(bufa.reduce((p, c) => p + c.length, 0))
    let off = 0
    for (const b of bufa) {
      currentChunk.set(b, off)
      off += b.length
    }
    offset = 0
  }
  return {
    async upTo(length2) {
      if (currentChunk.length - offset < length2) {
        await read2(length2)
      }
      return currentChunk.subarray(
        offset,
        offset + Math.min(currentChunk.length - offset, length2)
      )
    },
    async exactly(length2) {
      if (currentChunk.length - offset < length2) {
        await read2(length2)
      }
      if (currentChunk.length - offset < length2) {
        throw new Error('Unexpected end of data')
      }
      return currentChunk.subarray(offset, offset + length2)
    },
    seek(length2) {
      pos += length2
      offset += length2
    },
    get pos() {
      return pos
    },
  }
}
function asyncIterableReader(asyncIterable) {
  const iterator = asyncIterable[Symbol.asyncIterator]()
  async function readChunk() {
    const next = await iterator.next()
    if (next.done) {
      return null
    }
    return next.value
  }
  return chunkReader(readChunk)
}

// node_modules/@ipld/car/esm/lib/reader-browser.js
var CarReader = class {
  constructor(version2, roots, blocks) {
    this._version = version2
    this._roots = roots
    this._blocks = blocks
    this._keys = blocks.map((b) => b.cid.toString())
  }
  get version() {
    return this._version
  }
  async getRoots() {
    return this._roots
  }
  async has(key) {
    return this._keys.indexOf(key.toString()) > -1
  }
  async get(key) {
    const index = this._keys.indexOf(key.toString())
    return index > -1 ? this._blocks[index] : void 0
  }
  async *blocks() {
    for (const block of this._blocks) {
      yield block
    }
  }
  async *cids() {
    for (const block of this._blocks) {
      yield block.cid
    }
  }
  static async fromBytes(bytes2) {
    if (!(bytes2 instanceof Uint8Array)) {
      throw new TypeError('fromBytes() requires a Uint8Array')
    }
    return decodeReaderComplete(bytesReader(bytes2))
  }
  static async fromIterable(asyncIterable) {
    if (
      !asyncIterable ||
      !(typeof asyncIterable[Symbol.asyncIterator] === 'function')
    ) {
      throw new TypeError('fromIterable() requires an async iterable')
    }
    return decodeReaderComplete(asyncIterableReader(asyncIterable))
  }
}
async function decodeReaderComplete(reader) {
  const decoder = createDecoder(reader)
  const { version: version2, roots } = await decoder.header()
  const blocks = []
  for await (const block of decoder.blocks()) {
    blocks.push(block)
  }
  return new CarReader(version2, roots, blocks)
}

// node_modules/@ipld/car/esm/lib/indexer.js
var CarIndexer = class {
  constructor(version2, roots, iterator) {
    this._version = version2
    this._roots = roots
    this._iterator = iterator
  }
  get version() {
    return this._version
  }
  async getRoots() {
    return this._roots
  }
  [Symbol.asyncIterator]() {
    return this._iterator
  }
  static async fromBytes(bytes2) {
    if (!(bytes2 instanceof Uint8Array)) {
      throw new TypeError('fromBytes() requires a Uint8Array')
    }
    return decodeIndexerComplete(bytesReader(bytes2))
  }
  static async fromIterable(asyncIterable) {
    if (
      !asyncIterable ||
      !(typeof asyncIterable[Symbol.asyncIterator] === 'function')
    ) {
      throw new TypeError('fromIterable() requires an async iterable')
    }
    return decodeIndexerComplete(asyncIterableReader(asyncIterable))
  }
}
async function decodeIndexerComplete(reader) {
  const decoder = createDecoder(reader)
  const { version: version2, roots } = await decoder.header()
  return new CarIndexer(version2, roots, decoder.blocksIndex())
}

// node_modules/@ipld/car/esm/lib/iterator.js
var CarIteratorBase = class {
  constructor(version2, roots, iterable) {
    this._version = version2
    this._roots = roots
    this._iterable = iterable
    this._decoded = false
  }
  get version() {
    return this._version
  }
  async getRoots() {
    return this._roots
  }
}
var CarBlockIterator = class extends CarIteratorBase {
  [Symbol.asyncIterator]() {
    if (this._decoded) {
      throw new Error('Cannot decode more than once')
    }
    if (!this._iterable) {
      throw new Error('Block iterable not found')
    }
    this._decoded = true
    return this._iterable[Symbol.asyncIterator]()
  }
  static async fromBytes(bytes2) {
    const { version: version2, roots, iterator } = await fromBytes(bytes2)
    return new CarBlockIterator(version2, roots, iterator)
  }
  static async fromIterable(asyncIterable) {
    const {
      version: version2,
      roots,
      iterator,
    } = await fromIterable(asyncIterable)
    return new CarBlockIterator(version2, roots, iterator)
  }
}
var CarCIDIterator = class extends CarIteratorBase {
  [Symbol.asyncIterator]() {
    if (this._decoded) {
      throw new Error('Cannot decode more than once')
    }
    if (!this._iterable) {
      throw new Error('Block iterable not found')
    }
    this._decoded = true
    const iterable = this._iterable[Symbol.asyncIterator]()
    return {
      async next() {
        const next = await iterable.next()
        if (next.done) {
          return next
        }
        return {
          done: false,
          value: next.value.cid,
        }
      },
    }
  }
  static async fromBytes(bytes2) {
    const { version: version2, roots, iterator } = await fromBytes(bytes2)
    return new CarCIDIterator(version2, roots, iterator)
  }
  static async fromIterable(asyncIterable) {
    const {
      version: version2,
      roots,
      iterator,
    } = await fromIterable(asyncIterable)
    return new CarCIDIterator(version2, roots, iterator)
  }
}
async function fromBytes(bytes2) {
  if (!(bytes2 instanceof Uint8Array)) {
    throw new TypeError('fromBytes() requires a Uint8Array')
  }
  return decodeIterator(bytesReader(bytes2))
}
async function fromIterable(asyncIterable) {
  if (
    !asyncIterable ||
    !(typeof asyncIterable[Symbol.asyncIterator] === 'function')
  ) {
    throw new TypeError('fromIterable() requires an async iterable')
  }
  return decodeIterator(asyncIterableReader(asyncIterable))
}
async function decodeIterator(reader) {
  const decoder = createDecoder(reader)
  const { version: version2, roots } = await decoder.header()
  return {
    version: version2,
    roots,
    iterator: decoder.blocks(),
  }
}

// node_modules/@ipld/car/esm/lib/writer-browser.js
init_cid()

// node_modules/@ipld/car/esm/lib/encoder.js
var import_varint3 = __toModule(require_varint())
function createHeader(roots) {
  const headerBytes = encode5({
    version: 1,
    roots,
  })
  const varintBytes = import_varint3.default.encode(headerBytes.length)
  const header = new Uint8Array(varintBytes.length + headerBytes.length)
  header.set(varintBytes, 0)
  header.set(headerBytes, varintBytes.length)
  return header
}
function createEncoder(writer) {
  return {
    async setRoots(roots) {
      const bytes2 = createHeader(roots)
      await writer.write(bytes2)
    },
    async writeBlock(block) {
      const { cid, bytes: bytes2 } = block
      await writer.write(
        new Uint8Array(
          import_varint3.default.encode(cid.bytes.length + bytes2.length)
        )
      )
      await writer.write(cid.bytes)
      if (bytes2.length) {
        await writer.write(bytes2)
      }
    },
    async close() {
      return writer.end()
    },
  }
}

// node_modules/@ipld/car/esm/lib/iterator-channel.js
function noop() {}
function create2() {
  const chunkQueue = []
  let drainer = null
  let drainerResolver = noop
  let ended = false
  let outWait = null
  let outWaitResolver = noop
  const makeDrainer = () => {
    if (!drainer) {
      drainer = new Promise((resolve) => {
        drainerResolver = () => {
          drainer = null
          drainerResolver = noop
          resolve()
        }
      })
    }
    return drainer
  }
  const writer = {
    write(chunk) {
      chunkQueue.push(chunk)
      const drainer2 = makeDrainer()
      outWaitResolver()
      return drainer2
    },
    async end() {
      ended = true
      const drainer2 = makeDrainer()
      outWaitResolver()
      return drainer2
    },
  }
  const iterator = {
    async next() {
      const chunk = chunkQueue.shift()
      if (chunk) {
        if (chunkQueue.length === 0) {
          drainerResolver()
        }
        return {
          done: false,
          value: chunk,
        }
      }
      if (ended) {
        drainerResolver()
        return {
          done: true,
          value: void 0,
        }
      }
      if (!outWait) {
        outWait = new Promise((resolve) => {
          outWaitResolver = () => {
            outWait = null
            outWaitResolver = noop
            return resolve(iterator.next())
          }
        })
      }
      return outWait
    },
  }
  return {
    writer,
    iterator,
  }
}

// node_modules/@ipld/car/esm/lib/writer-browser.js
var CarWriter = class {
  constructor(roots, encoder) {
    this._encoder = encoder
    this._mutex = encoder.setRoots(roots)
    this._ended = false
  }
  async put(block) {
    if (!(block.bytes instanceof Uint8Array) || !block.cid) {
      throw new TypeError('Can only write {cid, bytes} objects')
    }
    if (this._ended) {
      throw new Error('Already closed')
    }
    const cid = CID.asCID(block.cid)
    if (!cid) {
      throw new TypeError('Can only write {cid, bytes} objects')
    }
    this._mutex = this._mutex.then(() =>
      this._encoder.writeBlock({
        cid,
        bytes: block.bytes,
      })
    )
    return this._mutex
  }
  async close() {
    if (this._ended) {
      throw new Error('Already closed')
    }
    await this._mutex
    this._ended = true
    return this._encoder.close()
  }
  static create(roots) {
    roots = toRoots(roots)
    const { encoder, iterator } = encodeWriter()
    const writer = new CarWriter(roots, encoder)
    const out = new CarWriterOut(iterator)
    return {
      writer,
      out,
    }
  }
  static createAppender() {
    const { encoder, iterator } = encodeWriter()
    encoder.setRoots = () => Promise.resolve()
    const writer = new CarWriter([], encoder)
    const out = new CarWriterOut(iterator)
    return {
      writer,
      out,
    }
  }
  static async updateRootsInBytes(bytes2, roots) {
    const reader = bytesReader(bytes2)
    await readHeader(reader)
    const newHeader = createHeader(roots)
    if (reader.pos !== newHeader.length) {
      throw new Error(
        `updateRoots() can only overwrite a header of the same length (old header is ${reader.pos} bytes, new header is ${newHeader.length} bytes)`
      )
    }
    bytes2.set(newHeader, 0)
    return bytes2
  }
}
var CarWriterOut = class {
  constructor(iterator) {
    this._iterator = iterator
  }
  [Symbol.asyncIterator]() {
    if (this._iterating) {
      throw new Error('Multiple iterator not supported')
    }
    this._iterating = true
    return this._iterator
  }
}
function encodeWriter() {
  const iw = create2()
  const { writer, iterator } = iw
  const encoder = createEncoder(writer)
  return {
    encoder,
    iterator,
  }
}
function toRoots(roots) {
  if (roots === void 0) {
    return []
  }
  if (!Array.isArray(roots)) {
    const cid = CID.asCID(roots)
    if (!cid) {
      throw new TypeError('roots must be a single CID or an array of CIDs')
    }
    return [cid]
  }
  const _roots = []
  for (const root of roots) {
    const _root = CID.asCID(root)
    if (!_root) {
      throw new TypeError('roots must be a single CID or an array of CIDs')
    }
    _roots.push(_root)
  }
  return _roots
}

// node_modules/multiformats/esm/src/block.js
init_src()
var readonly2 = ({ enumerable = true, configurable = false } = {}) => ({
  enumerable,
  configurable,
  writable: false,
})
var links = function* (source, base3) {
  if (source == null) return
  if (source instanceof Uint8Array) return
  for (const [key, value] of Object.entries(source)) {
    const path = [...base3, key]
    if (value != null && typeof value === 'object') {
      if (Array.isArray(value)) {
        for (const [index, element] of value.entries()) {
          const elementPath = [...path, index]
          const cid = CID.asCID(element)
          if (cid) {
            yield [elementPath.join('/'), cid]
          } else if (typeof element === 'object') {
            yield* links(element, elementPath)
          }
        }
      } else {
        const cid = CID.asCID(value)
        if (cid) {
          yield [path.join('/'), cid]
        } else {
          yield* links(value, path)
        }
      }
    }
  }
}
var tree = function* (source, base3) {
  if (source == null) return
  for (const [key, value] of Object.entries(source)) {
    const path = [...base3, key]
    yield path.join('/')
    if (
      value != null &&
      !(value instanceof Uint8Array) &&
      typeof value === 'object' &&
      !CID.asCID(value)
    ) {
      if (Array.isArray(value)) {
        for (const [index, element] of value.entries()) {
          const elementPath = [...path, index]
          yield elementPath.join('/')
          if (typeof element === 'object' && !CID.asCID(element)) {
            yield* tree(element, elementPath)
          }
        }
      } else {
        yield* tree(value, path)
      }
    }
  }
}
var get = (source, path) => {
  let node = source
  for (const [index, key] of path.entries()) {
    node = node[key]
    if (node == null) {
      throw new Error(
        `Object has no property at ${path
          .slice(0, index + 1)
          .map((part) => `[${JSON.stringify(part)}]`)
          .join('')}`
      )
    }
    const cid = CID.asCID(node)
    if (cid) {
      return {
        value: cid,
        remaining: path.slice(index + 1).join('/'),
      }
    }
  }
  return { value: node }
}
var Block = class {
  constructor({ cid, bytes: bytes2, value }) {
    if (!cid || !bytes2 || typeof value === 'undefined')
      throw new Error('Missing required argument')
    this.cid = cid
    this.bytes = bytes2
    this.value = value
    this.asBlock = this
    Object.defineProperties(this, {
      cid: readonly2(),
      bytes: readonly2(),
      value: readonly2(),
      asBlock: readonly2(),
    })
  }
  links() {
    return links(this.value, [])
  }
  tree() {
    return tree(this.value, [])
  }
  get(path = '/') {
    return get(this.value, path.split('/').filter(Boolean))
  }
}
var encode6 = async ({ value, codec, hasher }) => {
  if (typeof value === 'undefined')
    throw new Error('Missing required argument "value"')
  if (!codec || !hasher)
    throw new Error('Missing required argument: codec or hasher')
  const bytes2 = codec.encode(value)
  const hash = await hasher.digest(bytes2)
  const cid = CID.create(1, codec.code, hash)
  return new Block({
    value,
    bytes: bytes2,
    cid,
  })
}

// node_modules/carbites/esm/lib/treewalk/splitter.js
init_raw()

// node_modules/carbites/node_modules/@ipld/dag-cbor/esm/index.js
var esm_exports = {}
__export(esm_exports, {
  code: () => code2,
  decode: () => decode8,
  encode: () => encode8,
  name: () => name2,
})
init_cid()
var CID_CBOR_TAG2 = 42
function cidEncoder2(obj) {
  if (obj.asCID !== obj) {
    return null
  }
  const cid = CID.asCID(obj)
  if (!cid) {
    return null
  }
  const bytes2 = new Uint8Array(cid.bytes.byteLength + 1)
  bytes2.set(cid.bytes, 1)
  return [new Token(Type.tag, CID_CBOR_TAG2), new Token(Type.bytes, bytes2)]
}
function undefinedEncoder2() {
  throw new Error(
    '`undefined` is not supported by the IPLD Data Model and cannot be encoded'
  )
}
function numberEncoder2(num) {
  if (Number.isNaN(num)) {
    throw new Error(
      '`NaN` is not supported by the IPLD Data Model and cannot be encoded'
    )
  }
  if (num === Infinity || num === -Infinity) {
    throw new Error(
      '`Infinity` and `-Infinity` is not supported by the IPLD Data Model and cannot be encoded'
    )
  }
  return null
}
var encodeOptions2 = {
  float64: true,
  typeEncoders: {
    Object: cidEncoder2,
    undefined: undefinedEncoder2,
    number: numberEncoder2,
  },
}
function cidDecoder2(bytes2) {
  if (bytes2[0] !== 0) {
    throw new Error('Invalid CID for CBOR tag 42; expected leading 0x00')
  }
  return CID.decode(bytes2.subarray(1))
}
var decodeOptions2 = {
  allowIndefinite: false,
  allowUndefined: false,
  allowNaN: false,
  allowInfinity: false,
  allowBigInt: true,
  strict: true,
  useMaps: false,
  tags: [],
}
decodeOptions2.tags[CID_CBOR_TAG2] = cidDecoder2
var name2 = 'dag-cbor'
var code2 = 113
var encode8 = (node) => encode4(node, encodeOptions2)
var decode8 = (data) => decode5(data, decodeOptions2)

// node_modules/@ipld/dag-pb/esm/src/index.js
var src_exports = {}
__export(src_exports, {
  code: () => code3,
  createLink: () => createLink,
  createNode: () => createNode,
  decode: () => decode9,
  encode: () => encode9,
  name: () => name3,
  prepare: () => prepare,
  validate: () => validate,
})
init_cid()

// node_modules/@ipld/dag-pb/esm/src/pb-decode.js
var textDecoder2 = new TextDecoder()
function decodeVarint(bytes2, offset) {
  let v = 0
  for (let shift = 0; ; shift += 7) {
    if (shift >= 64) {
      throw new Error('protobuf: varint overflow')
    }
    if (offset >= bytes2.length) {
      throw new Error('protobuf: unexpected end of data')
    }
    const b = bytes2[offset++]
    v += shift < 28 ? (b & 127) << shift : (b & 127) * 2 ** shift
    if (b < 128) {
      break
    }
  }
  return [v, offset]
}
function decodeBytes(bytes2, offset) {
  let byteLen
  ;[byteLen, offset] = decodeVarint(bytes2, offset)
  const postOffset = offset + byteLen
  if (byteLen < 0 || postOffset < 0) {
    throw new Error('protobuf: invalid length')
  }
  if (postOffset > bytes2.length) {
    throw new Error('protobuf: unexpected end of data')
  }
  return [bytes2.subarray(offset, postOffset), postOffset]
}
function decodeKey(bytes2, index) {
  let wire
  ;[wire, index] = decodeVarint(bytes2, index)
  return [wire & 7, wire >> 3, index]
}
function decodeLink(bytes2) {
  const link = {}
  const l = bytes2.length
  let index = 0
  while (index < l) {
    let wireType, fieldNum
    ;[wireType, fieldNum, index] = decodeKey(bytes2, index)
    if (fieldNum === 1) {
      if (link.Hash) {
        throw new Error('protobuf: (PBLink) duplicate Hash section')
      }
      if (wireType !== 2) {
        throw new Error(
          `protobuf: (PBLink) wrong wireType (${wireType}) for Hash`
        )
      }
      if (link.Name !== void 0) {
        throw new Error(
          'protobuf: (PBLink) invalid order, found Name before Hash'
        )
      }
      if (link.Tsize !== void 0) {
        throw new Error(
          'protobuf: (PBLink) invalid order, found Tsize before Hash'
        )
      }
      ;[link.Hash, index] = decodeBytes(bytes2, index)
    } else if (fieldNum === 2) {
      if (link.Name !== void 0) {
        throw new Error('protobuf: (PBLink) duplicate Name section')
      }
      if (wireType !== 2) {
        throw new Error(
          `protobuf: (PBLink) wrong wireType (${wireType}) for Name`
        )
      }
      if (link.Tsize !== void 0) {
        throw new Error(
          'protobuf: (PBLink) invalid order, found Tsize before Name'
        )
      }
      let byts
      ;[byts, index] = decodeBytes(bytes2, index)
      link.Name = textDecoder2.decode(byts)
    } else if (fieldNum === 3) {
      if (link.Tsize !== void 0) {
        throw new Error('protobuf: (PBLink) duplicate Tsize section')
      }
      if (wireType !== 0) {
        throw new Error(
          `protobuf: (PBLink) wrong wireType (${wireType}) for Tsize`
        )
      }
      ;[link.Tsize, index] = decodeVarint(bytes2, index)
    } else {
      throw new Error(
        `protobuf: (PBLink) invalid fieldNumber, expected 1, 2 or 3, got ${fieldNum}`
      )
    }
  }
  if (index > l) {
    throw new Error('protobuf: (PBLink) unexpected end of data')
  }
  return link
}
function decodeNode(bytes2) {
  const l = bytes2.length
  let index = 0
  let links2
  let linksBeforeData = false
  let data
  while (index < l) {
    let wireType, fieldNum
    ;[wireType, fieldNum, index] = decodeKey(bytes2, index)
    if (wireType !== 2) {
      throw new Error(
        `protobuf: (PBNode) invalid wireType, expected 2, got ${wireType}`
      )
    }
    if (fieldNum === 1) {
      if (data) {
        throw new Error('protobuf: (PBNode) duplicate Data section')
      }
      ;[data, index] = decodeBytes(bytes2, index)
      if (links2) {
        linksBeforeData = true
      }
    } else if (fieldNum === 2) {
      if (linksBeforeData) {
        throw new Error('protobuf: (PBNode) duplicate Links section')
      } else if (!links2) {
        links2 = []
      }
      let byts
      ;[byts, index] = decodeBytes(bytes2, index)
      links2.push(decodeLink(byts))
    } else {
      throw new Error(
        `protobuf: (PBNode) invalid fieldNumber, expected 1 or 2, got ${fieldNum}`
      )
    }
  }
  if (index > l) {
    throw new Error('protobuf: (PBNode) unexpected end of data')
  }
  const node = {}
  if (data) {
    node.Data = data
  }
  node.Links = links2 || []
  return node
}

// node_modules/@ipld/dag-pb/esm/src/pb-encode.js
var textEncoder2 = new TextEncoder()
var maxInt32 = 2 ** 32
var maxUInt32 = 2 ** 31
function encodeLink(link, bytes2) {
  let i = bytes2.length
  if (typeof link.Tsize === 'number') {
    if (link.Tsize < 0) {
      throw new Error('Tsize cannot be negative')
    }
    if (!Number.isSafeInteger(link.Tsize)) {
      throw new Error('Tsize too large for encoding')
    }
    i = encodeVarint(bytes2, i, link.Tsize) - 1
    bytes2[i] = 24
  }
  if (typeof link.Name === 'string') {
    const nameBytes = textEncoder2.encode(link.Name)
    i -= nameBytes.length
    bytes2.set(nameBytes, i)
    i = encodeVarint(bytes2, i, nameBytes.length) - 1
    bytes2[i] = 18
  }
  if (link.Hash) {
    i -= link.Hash.length
    bytes2.set(link.Hash, i)
    i = encodeVarint(bytes2, i, link.Hash.length) - 1
    bytes2[i] = 10
  }
  return bytes2.length - i
}
function encodeNode(node) {
  const size = sizeNode(node)
  const bytes2 = new Uint8Array(size)
  let i = size
  if (node.Data) {
    i -= node.Data.length
    bytes2.set(node.Data, i)
    i = encodeVarint(bytes2, i, node.Data.length) - 1
    bytes2[i] = 10
  }
  if (node.Links) {
    for (let index = node.Links.length - 1; index >= 0; index--) {
      const size2 = encodeLink(node.Links[index], bytes2.subarray(0, i))
      i -= size2
      i = encodeVarint(bytes2, i, size2) - 1
      bytes2[i] = 18
    }
  }
  return bytes2
}
function sizeLink(link) {
  let n = 0
  if (link.Hash) {
    const l = link.Hash.length
    n += 1 + l + sov(l)
  }
  if (typeof link.Name === 'string') {
    const l = textEncoder2.encode(link.Name).length
    n += 1 + l + sov(l)
  }
  if (typeof link.Tsize === 'number') {
    n += 1 + sov(link.Tsize)
  }
  return n
}
function sizeNode(node) {
  let n = 0
  if (node.Data) {
    const l = node.Data.length
    n += 1 + l + sov(l)
  }
  if (node.Links) {
    for (const link of node.Links) {
      const l = sizeLink(link)
      n += 1 + l + sov(l)
    }
  }
  return n
}
function encodeVarint(bytes2, offset, v) {
  offset -= sov(v)
  const base3 = offset
  while (v >= maxUInt32) {
    bytes2[offset++] = (v & 127) | 128
    v /= 128
  }
  while (v >= 128) {
    bytes2[offset++] = (v & 127) | 128
    v >>>= 7
  }
  bytes2[offset] = v
  return base3
}
function sov(x) {
  if (x % 2 === 0) {
    x++
  }
  return Math.floor((len64(x) + 6) / 7)
}
function len64(x) {
  let n = 0
  if (x >= maxInt32) {
    x = Math.floor(x / maxInt32)
    n = 32
  }
  if (x >= 1 << 16) {
    x >>>= 16
    n += 16
  }
  if (x >= 1 << 8) {
    x >>>= 8
    n += 8
  }
  return n + len8tab[x]
}
var len8tab = [
  0, 1, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
  5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
  6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
  7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
  7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8, 8,
  8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
  8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
  8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
  8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
  8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
]

// node_modules/@ipld/dag-pb/esm/src/util.js
init_cid()
var pbNodeProperties = ['Data', 'Links']
var pbLinkProperties = ['Hash', 'Name', 'Tsize']
var textEncoder3 = new TextEncoder()
function linkComparator(a, b) {
  if (a === b) {
    return 0
  }
  const abuf = a.Name ? textEncoder3.encode(a.Name) : []
  const bbuf = b.Name ? textEncoder3.encode(b.Name) : []
  let x = abuf.length
  let y = bbuf.length
  for (let i = 0, len = Math.min(x, y); i < len; ++i) {
    if (abuf[i] !== bbuf[i]) {
      x = abuf[i]
      y = bbuf[i]
      break
    }
  }
  return x < y ? -1 : y < x ? 1 : 0
}
function hasOnlyProperties(node, properties) {
  return !Object.keys(node).some((p) => !properties.includes(p))
}
function asLink(link) {
  if (typeof link.asCID === 'object') {
    const Hash = CID.asCID(link)
    if (!Hash) {
      throw new TypeError('Invalid DAG-PB form')
    }
    return { Hash }
  }
  if (typeof link !== 'object' || Array.isArray(link)) {
    throw new TypeError('Invalid DAG-PB form')
  }
  const pbl = {}
  if (link.Hash) {
    let cid = CID.asCID(link.Hash)
    try {
      if (!cid) {
        if (typeof link.Hash === 'string') {
          cid = CID.parse(link.Hash)
        } else if (link.Hash instanceof Uint8Array) {
          cid = CID.decode(link.Hash)
        }
      }
    } catch (e) {
      throw new TypeError(`Invalid DAG-PB form: ${e.message}`)
    }
    if (cid) {
      pbl.Hash = cid
    }
  }
  if (!pbl.Hash) {
    throw new TypeError('Invalid DAG-PB form')
  }
  if (typeof link.Name === 'string') {
    pbl.Name = link.Name
  }
  if (typeof link.Tsize === 'number') {
    pbl.Tsize = link.Tsize
  }
  return pbl
}
function prepare(node) {
  if (node instanceof Uint8Array || typeof node === 'string') {
    node = { Data: node }
  }
  if (typeof node !== 'object' || Array.isArray(node)) {
    throw new TypeError('Invalid DAG-PB form')
  }
  const pbn = {}
  if (node.Data !== void 0) {
    if (typeof node.Data === 'string') {
      pbn.Data = textEncoder3.encode(node.Data)
    } else if (node.Data instanceof Uint8Array) {
      pbn.Data = node.Data
    } else {
      throw new TypeError('Invalid DAG-PB form')
    }
  }
  if (node.Links !== void 0) {
    if (Array.isArray(node.Links)) {
      pbn.Links = node.Links.map(asLink)
      pbn.Links.sort(linkComparator)
    } else {
      throw new TypeError('Invalid DAG-PB form')
    }
  } else {
    pbn.Links = []
  }
  return pbn
}
function validate(node) {
  if (!node || typeof node !== 'object' || Array.isArray(node)) {
    throw new TypeError('Invalid DAG-PB form')
  }
  if (!hasOnlyProperties(node, pbNodeProperties)) {
    throw new TypeError('Invalid DAG-PB form (extraneous properties)')
  }
  if (node.Data !== void 0 && !(node.Data instanceof Uint8Array)) {
    throw new TypeError('Invalid DAG-PB form (Data must be a Uint8Array)')
  }
  if (!Array.isArray(node.Links)) {
    throw new TypeError('Invalid DAG-PB form (Links must be an array)')
  }
  for (let i = 0; i < node.Links.length; i++) {
    const link = node.Links[i]
    if (!link || typeof link !== 'object' || Array.isArray(link)) {
      throw new TypeError('Invalid DAG-PB form (bad link object)')
    }
    if (!hasOnlyProperties(link, pbLinkProperties)) {
      throw new TypeError(
        'Invalid DAG-PB form (extraneous properties on link object)'
      )
    }
    if (!link.Hash) {
      throw new TypeError('Invalid DAG-PB form (link must have a Hash)')
    }
    if (link.Hash.asCID !== link.Hash) {
      throw new TypeError('Invalid DAG-PB form (link Hash must be a CID)')
    }
    if (link.Name !== void 0 && typeof link.Name !== 'string') {
      throw new TypeError('Invalid DAG-PB form (link Name must be a string)')
    }
    if (
      link.Tsize !== void 0 &&
      (typeof link.Tsize !== 'number' || link.Tsize % 1 !== 0)
    ) {
      throw new TypeError('Invalid DAG-PB form (link Tsize must be an integer)')
    }
    if (i > 0 && linkComparator(link, node.Links[i - 1]) === -1) {
      throw new TypeError(
        'Invalid DAG-PB form (links must be sorted by Name bytes)'
      )
    }
  }
}
function createNode(data, links2 = []) {
  return prepare({
    Data: data,
    Links: links2,
  })
}
function createLink(name6, size, cid) {
  return asLink({
    Hash: cid,
    Name: name6,
    Tsize: size,
  })
}

// node_modules/@ipld/dag-pb/esm/src/index.js
var name3 = 'dag-pb'
var code3 = 112
function encode9(node) {
  validate(node)
  const pbn = {}
  if (node.Links) {
    pbn.Links = node.Links.map((l) => {
      const link = {}
      if (l.Hash) {
        link.Hash = l.Hash.bytes
      }
      if (l.Name !== void 0) {
        link.Name = l.Name
      }
      if (l.Tsize !== void 0) {
        link.Tsize = l.Tsize
      }
      return link
    })
  }
  if (node.Data) {
    pbn.Data = node.Data
  }
  return encodeNode(pbn)
}
function decode9(bytes2) {
  const pbn = decodeNode(bytes2)
  const node = {}
  if (pbn.Data) {
    node.Data = pbn.Data
  }
  if (pbn.Links) {
    node.Links = pbn.Links.map((l) => {
      const link = {}
      try {
        link.Hash = CID.decode(l.Hash)
      } catch (e) {}
      if (!link.Hash) {
        throw new Error('Invalid Hash field found in link, expected CID')
      }
      if (l.Name !== void 0) {
        link.Name = l.Name
      }
      if (l.Tsize !== void 0) {
        link.Tsize = l.Tsize
      }
      return link
    })
  }
  return node
}

// node_modules/carbites/esm/lib/treewalk/splitter.js
var TreewalkCarSplitter = class {
  constructor(reader, targetSize, options = {}) {
    if (typeof targetSize !== 'number' || targetSize <= 0) {
      throw new Error('invalid target chunk size')
    }
    this._reader = reader
    this._targetSize = targetSize
    this._decoders = [
      src_exports,
      raw_exports,
      esm_exports,
      ...(options.decoders || []),
    ]
  }
  async *cars() {
    const roots = await this._reader.getRoots()
    if (roots.length !== 1)
      throw new Error(`unexpected number of roots: ${roots.length}`)
    let channel
    for await (const val of this._cars(roots[0])) {
      channel = val.channel
      if (val.out) yield val.out
    }
    if (!channel) {
      throw new Error('missing CAR writer channel')
    }
    channel.writer.close()
    yield channel.out
  }
  async _get(cid) {
    const rawBlock = await this._reader.get(cid)
    if (!rawBlock) throw new Error(`missing block for ${cid}`)
    const { bytes: bytes2 } = rawBlock
    const decoder = this._decoders.find((d) => d.code === cid.code)
    if (!decoder) throw new Error(`missing decoder for ${cid.code}`)
    return new Block({
      cid,
      bytes: bytes2,
      value: decoder.decode(bytes2),
    })
  }
  async *_cars(cid, parents = [], channel = void 0) {
    const block = await this._get(cid)
    channel = channel || Object.assign(CarWriter.create(cid), { size: 0 })
    if (
      channel.size > 0 &&
      channel.size + block.bytes.byteLength >= this._targetSize
    ) {
      channel.writer.close()
      const { out } = channel
      channel = newCar(parents)
      yield {
        channel,
        out,
      }
    }
    parents = parents.concat(block)
    channel.size += block.bytes.byteLength
    channel.writer.put(block)
    for (const [, cid2] of block.links()) {
      for await (const val of this._cars(cid2, parents, channel)) {
        channel = val.channel
        yield val
      }
    }
    if (!channel) {
      throw new Error('missing CAR writer channel')
    }
    yield { channel }
  }
  static async fromIterable(iterable, targetSize, options) {
    const reader = await CarReader.fromIterable(iterable)
    return new TreewalkCarSplitter(reader, targetSize, options)
  }
  static async fromBlob(blob2, targetSize, options) {
    const buffer2 = await blob2.arrayBuffer()
    const reader = await CarReader.fromBytes(new Uint8Array(buffer2))
    return new TreewalkCarSplitter(reader, targetSize, options)
  }
}
function newCar(parents) {
  const ch = Object.assign(CarWriter.create(parents[0].cid), {
    size: parents.reduce((size, b) => size + b.bytes.byteLength, 0),
  })
  for (const b of parents) {
    ch.writer.put(b)
  }
  return ch
}

// node_modules/ipfs-car/dist/esm/pack/index.js
var import_it_last = __toModule(require_it_last())
var import_it_pipe = __toModule(require_it_pipe())

// node_modules/ipfs-unixfs-importer/esm/src/index.js
var import_it_parallel_batch2 = __toModule(require_it_parallel_batch())

// node_modules/merge-options/index.mjs
var import_index2 = __toModule(require_merge_options())
var merge_options_default = import_index2.default

// node_modules/ipfs-unixfs-importer/esm/src/options.js
init_sha2_browser()

// node_modules/@multiformats/murmur3/esm/index.js
init_hasher()
init_src()
var import_murmurhash3js_revisited = __toModule(
  require_murmurhash3js_revisited()
)
function fromNumberTo32BitBuf(number) {
  const bytes2 = new Array(4)
  for (let i = 0; i < 4; i++) {
    bytes2[i] = number & 255
    number = number >> 8
  }
  return new Uint8Array(bytes2)
}
var murmur332 = from2({
  name: 'murmur3-32',
  code: 35,
  encode: (input) =>
    fromNumberTo32BitBuf(
      import_murmurhash3js_revisited.default.x86.hash32(input)
    ),
})
var murmur3128 = from2({
  name: 'murmur3-128',
  code: 34,
  encode: (input) =>
    bytes_exports.fromHex(
      import_murmurhash3js_revisited.default.x64.hash128(input)
    ),
})

// node_modules/ipfs-unixfs-importer/esm/src/options.js
async function hamtHashFn(buf2) {
  return (await murmur3128.encode(buf2)).slice(0, 8).reverse()
}
var defaultOptions = {
  chunker: 'fixed',
  strategy: 'balanced',
  rawLeaves: false,
  onlyHash: false,
  reduceSingleLeafToSelf: true,
  hasher: sha256,
  leafType: 'file',
  cidVersion: 0,
  progress: () => () => {},
  shardSplitThreshold: 1e3,
  fileImportConcurrency: 50,
  blockWriteConcurrency: 10,
  minChunkSize: 262144,
  maxChunkSize: 262144,
  avgChunkSize: 262144,
  window: 16,
  polynomial: 17437180132763652,
  maxChildrenPerNode: 174,
  layerRepeat: 4,
  wrapWithDirectory: false,
  recursive: false,
  hidden: false,
  timeout: void 0,
  hamtHashFn,
  hamtHashCode: 34,
  hamtBucketBits: 8,
}
var options_default = (options = {}) => {
  const defaults = merge_options_default.bind({ ignoreUndefined: true })
  return defaults(defaultOptions, options)
}

// node_modules/ipfs-unixfs/esm/src/index.js
var import_err_code = __toModule(require_err_code())

// node_modules/ipfs-unixfs/esm/src/unixfs.js
var import_minimal = __toModule(require_minimal2())
var $Reader = import_minimal.default.Reader
var $Writer = import_minimal.default.Writer
var $util = import_minimal.default.util
var $root =
  import_minimal.default.roots['ipfs-unixfs'] ||
  (import_minimal.default.roots['ipfs-unixfs'] = {})
var Data = ($root.Data = (() => {
  function Data2(p) {
    this.blocksizes = []
    if (p) {
      for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
        if (p[ks[i]] != null) this[ks[i]] = p[ks[i]]
    }
  }
  Data2.prototype.Type = 0
  Data2.prototype.Data = $util.newBuffer([])
  Data2.prototype.filesize = $util.Long ? $util.Long.fromBits(0, 0, true) : 0
  Data2.prototype.blocksizes = $util.emptyArray
  Data2.prototype.hashType = $util.Long ? $util.Long.fromBits(0, 0, true) : 0
  Data2.prototype.fanout = $util.Long ? $util.Long.fromBits(0, 0, true) : 0
  Data2.prototype.mode = 0
  Data2.prototype.mtime = null
  Data2.encode = function encode12(m, w) {
    if (!w) w = $Writer.create()
    w.uint32(8).int32(m.Type)
    if (m.Data != null && Object.hasOwnProperty.call(m, 'Data'))
      w.uint32(18).bytes(m.Data)
    if (m.filesize != null && Object.hasOwnProperty.call(m, 'filesize'))
      w.uint32(24).uint64(m.filesize)
    if (m.blocksizes != null && m.blocksizes.length) {
      for (var i = 0; i < m.blocksizes.length; ++i)
        w.uint32(32).uint64(m.blocksizes[i])
    }
    if (m.hashType != null && Object.hasOwnProperty.call(m, 'hashType'))
      w.uint32(40).uint64(m.hashType)
    if (m.fanout != null && Object.hasOwnProperty.call(m, 'fanout'))
      w.uint32(48).uint64(m.fanout)
    if (m.mode != null && Object.hasOwnProperty.call(m, 'mode'))
      w.uint32(56).uint32(m.mode)
    if (m.mtime != null && Object.hasOwnProperty.call(m, 'mtime'))
      $root.UnixTime.encode(m.mtime, w.uint32(66).fork()).ldelim()
    return w
  }
  Data2.decode = function decode11(r, l) {
    if (!(r instanceof $Reader)) r = $Reader.create(r)
    var c = l === void 0 ? r.len : r.pos + l,
      m = new $root.Data()
    while (r.pos < c) {
      var t = r.uint32()
      switch (t >>> 3) {
        case 1:
          m.Type = r.int32()
          break
        case 2:
          m.Data = r.bytes()
          break
        case 3:
          m.filesize = r.uint64()
          break
        case 4:
          if (!(m.blocksizes && m.blocksizes.length)) m.blocksizes = []
          if ((t & 7) === 2) {
            var c2 = r.uint32() + r.pos
            while (r.pos < c2) m.blocksizes.push(r.uint64())
          } else m.blocksizes.push(r.uint64())
          break
        case 5:
          m.hashType = r.uint64()
          break
        case 6:
          m.fanout = r.uint64()
          break
        case 7:
          m.mode = r.uint32()
          break
        case 8:
          m.mtime = $root.UnixTime.decode(r, r.uint32())
          break
        default:
          r.skipType(t & 7)
          break
      }
    }
    if (!m.hasOwnProperty('Type'))
      throw $util.ProtocolError("missing required 'Type'", { instance: m })
    return m
  }
  Data2.fromObject = function fromObject(d) {
    if (d instanceof $root.Data) return d
    var m = new $root.Data()
    switch (d.Type) {
      case 'Raw':
      case 0:
        m.Type = 0
        break
      case 'Directory':
      case 1:
        m.Type = 1
        break
      case 'File':
      case 2:
        m.Type = 2
        break
      case 'Metadata':
      case 3:
        m.Type = 3
        break
      case 'Symlink':
      case 4:
        m.Type = 4
        break
      case 'HAMTShard':
      case 5:
        m.Type = 5
        break
    }
    if (d.Data != null) {
      if (typeof d.Data === 'string')
        $util.base64.decode(
          d.Data,
          (m.Data = $util.newBuffer($util.base64.length(d.Data))),
          0
        )
      else if (d.Data.length) m.Data = d.Data
    }
    if (d.filesize != null) {
      if ($util.Long)
        (m.filesize = $util.Long.fromValue(d.filesize)).unsigned = true
      else if (typeof d.filesize === 'string')
        m.filesize = parseInt(d.filesize, 10)
      else if (typeof d.filesize === 'number') m.filesize = d.filesize
      else if (typeof d.filesize === 'object')
        m.filesize = new $util.LongBits(
          d.filesize.low >>> 0,
          d.filesize.high >>> 0
        ).toNumber(true)
    }
    if (d.blocksizes) {
      if (!Array.isArray(d.blocksizes))
        throw TypeError('.Data.blocksizes: array expected')
      m.blocksizes = []
      for (var i = 0; i < d.blocksizes.length; ++i) {
        if ($util.Long)
          (m.blocksizes[i] = $util.Long.fromValue(
            d.blocksizes[i]
          )).unsigned = true
        else if (typeof d.blocksizes[i] === 'string')
          m.blocksizes[i] = parseInt(d.blocksizes[i], 10)
        else if (typeof d.blocksizes[i] === 'number')
          m.blocksizes[i] = d.blocksizes[i]
        else if (typeof d.blocksizes[i] === 'object')
          m.blocksizes[i] = new $util.LongBits(
            d.blocksizes[i].low >>> 0,
            d.blocksizes[i].high >>> 0
          ).toNumber(true)
      }
    }
    if (d.hashType != null) {
      if ($util.Long)
        (m.hashType = $util.Long.fromValue(d.hashType)).unsigned = true
      else if (typeof d.hashType === 'string')
        m.hashType = parseInt(d.hashType, 10)
      else if (typeof d.hashType === 'number') m.hashType = d.hashType
      else if (typeof d.hashType === 'object')
        m.hashType = new $util.LongBits(
          d.hashType.low >>> 0,
          d.hashType.high >>> 0
        ).toNumber(true)
    }
    if (d.fanout != null) {
      if ($util.Long)
        (m.fanout = $util.Long.fromValue(d.fanout)).unsigned = true
      else if (typeof d.fanout === 'string') m.fanout = parseInt(d.fanout, 10)
      else if (typeof d.fanout === 'number') m.fanout = d.fanout
      else if (typeof d.fanout === 'object')
        m.fanout = new $util.LongBits(
          d.fanout.low >>> 0,
          d.fanout.high >>> 0
        ).toNumber(true)
    }
    if (d.mode != null) {
      m.mode = d.mode >>> 0
    }
    if (d.mtime != null) {
      if (typeof d.mtime !== 'object')
        throw TypeError('.Data.mtime: object expected')
      m.mtime = $root.UnixTime.fromObject(d.mtime)
    }
    return m
  }
  Data2.toObject = function toObject(m, o) {
    if (!o) o = {}
    var d = {}
    if (o.arrays || o.defaults) {
      d.blocksizes = []
    }
    if (o.defaults) {
      d.Type = o.enums === String ? 'Raw' : 0
      if (o.bytes === String) d.Data = ''
      else {
        d.Data = []
        if (o.bytes !== Array) d.Data = $util.newBuffer(d.Data)
      }
      if ($util.Long) {
        var n = new $util.Long(0, 0, true)
        d.filesize =
          o.longs === String
            ? n.toString()
            : o.longs === Number
            ? n.toNumber()
            : n
      } else d.filesize = o.longs === String ? '0' : 0
      if ($util.Long) {
        var n = new $util.Long(0, 0, true)
        d.hashType =
          o.longs === String
            ? n.toString()
            : o.longs === Number
            ? n.toNumber()
            : n
      } else d.hashType = o.longs === String ? '0' : 0
      if ($util.Long) {
        var n = new $util.Long(0, 0, true)
        d.fanout =
          o.longs === String
            ? n.toString()
            : o.longs === Number
            ? n.toNumber()
            : n
      } else d.fanout = o.longs === String ? '0' : 0
      d.mode = 0
      d.mtime = null
    }
    if (m.Type != null && m.hasOwnProperty('Type')) {
      d.Type = o.enums === String ? $root.Data.DataType[m.Type] : m.Type
    }
    if (m.Data != null && m.hasOwnProperty('Data')) {
      d.Data =
        o.bytes === String
          ? $util.base64.encode(m.Data, 0, m.Data.length)
          : o.bytes === Array
          ? Array.prototype.slice.call(m.Data)
          : m.Data
    }
    if (m.filesize != null && m.hasOwnProperty('filesize')) {
      if (typeof m.filesize === 'number')
        d.filesize = o.longs === String ? String(m.filesize) : m.filesize
      else
        d.filesize =
          o.longs === String
            ? $util.Long.prototype.toString.call(m.filesize)
            : o.longs === Number
            ? new $util.LongBits(
                m.filesize.low >>> 0,
                m.filesize.high >>> 0
              ).toNumber(true)
            : m.filesize
    }
    if (m.blocksizes && m.blocksizes.length) {
      d.blocksizes = []
      for (var j = 0; j < m.blocksizes.length; ++j) {
        if (typeof m.blocksizes[j] === 'number')
          d.blocksizes[j] =
            o.longs === String ? String(m.blocksizes[j]) : m.blocksizes[j]
        else
          d.blocksizes[j] =
            o.longs === String
              ? $util.Long.prototype.toString.call(m.blocksizes[j])
              : o.longs === Number
              ? new $util.LongBits(
                  m.blocksizes[j].low >>> 0,
                  m.blocksizes[j].high >>> 0
                ).toNumber(true)
              : m.blocksizes[j]
      }
    }
    if (m.hashType != null && m.hasOwnProperty('hashType')) {
      if (typeof m.hashType === 'number')
        d.hashType = o.longs === String ? String(m.hashType) : m.hashType
      else
        d.hashType =
          o.longs === String
            ? $util.Long.prototype.toString.call(m.hashType)
            : o.longs === Number
            ? new $util.LongBits(
                m.hashType.low >>> 0,
                m.hashType.high >>> 0
              ).toNumber(true)
            : m.hashType
    }
    if (m.fanout != null && m.hasOwnProperty('fanout')) {
      if (typeof m.fanout === 'number')
        d.fanout = o.longs === String ? String(m.fanout) : m.fanout
      else
        d.fanout =
          o.longs === String
            ? $util.Long.prototype.toString.call(m.fanout)
            : o.longs === Number
            ? new $util.LongBits(
                m.fanout.low >>> 0,
                m.fanout.high >>> 0
              ).toNumber(true)
            : m.fanout
    }
    if (m.mode != null && m.hasOwnProperty('mode')) {
      d.mode = m.mode
    }
    if (m.mtime != null && m.hasOwnProperty('mtime')) {
      d.mtime = $root.UnixTime.toObject(m.mtime, o)
    }
    return d
  }
  Data2.prototype.toJSON = function toJSON() {
    return this.constructor.toObject(
      this,
      import_minimal.default.util.toJSONOptions
    )
  }
  Data2.DataType = (function () {
    const valuesById = {},
      values = Object.create(valuesById)
    values[(valuesById[0] = 'Raw')] = 0
    values[(valuesById[1] = 'Directory')] = 1
    values[(valuesById[2] = 'File')] = 2
    values[(valuesById[3] = 'Metadata')] = 3
    values[(valuesById[4] = 'Symlink')] = 4
    values[(valuesById[5] = 'HAMTShard')] = 5
    return values
  })()
  return Data2
})())
var UnixTime = ($root.UnixTime = (() => {
  function UnixTime2(p) {
    if (p) {
      for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
        if (p[ks[i]] != null) this[ks[i]] = p[ks[i]]
    }
  }
  UnixTime2.prototype.Seconds = $util.Long
    ? $util.Long.fromBits(0, 0, false)
    : 0
  UnixTime2.prototype.FractionalNanoseconds = 0
  UnixTime2.encode = function encode12(m, w) {
    if (!w) w = $Writer.create()
    w.uint32(8).int64(m.Seconds)
    if (
      m.FractionalNanoseconds != null &&
      Object.hasOwnProperty.call(m, 'FractionalNanoseconds')
    )
      w.uint32(21).fixed32(m.FractionalNanoseconds)
    return w
  }
  UnixTime2.decode = function decode11(r, l) {
    if (!(r instanceof $Reader)) r = $Reader.create(r)
    var c = l === void 0 ? r.len : r.pos + l,
      m = new $root.UnixTime()
    while (r.pos < c) {
      var t = r.uint32()
      switch (t >>> 3) {
        case 1:
          m.Seconds = r.int64()
          break
        case 2:
          m.FractionalNanoseconds = r.fixed32()
          break
        default:
          r.skipType(t & 7)
          break
      }
    }
    if (!m.hasOwnProperty('Seconds'))
      throw $util.ProtocolError("missing required 'Seconds'", { instance: m })
    return m
  }
  UnixTime2.fromObject = function fromObject(d) {
    if (d instanceof $root.UnixTime) return d
    var m = new $root.UnixTime()
    if (d.Seconds != null) {
      if ($util.Long)
        (m.Seconds = $util.Long.fromValue(d.Seconds)).unsigned = false
      else if (typeof d.Seconds === 'string')
        m.Seconds = parseInt(d.Seconds, 10)
      else if (typeof d.Seconds === 'number') m.Seconds = d.Seconds
      else if (typeof d.Seconds === 'object')
        m.Seconds = new $util.LongBits(
          d.Seconds.low >>> 0,
          d.Seconds.high >>> 0
        ).toNumber()
    }
    if (d.FractionalNanoseconds != null) {
      m.FractionalNanoseconds = d.FractionalNanoseconds >>> 0
    }
    return m
  }
  UnixTime2.toObject = function toObject(m, o) {
    if (!o) o = {}
    var d = {}
    if (o.defaults) {
      if ($util.Long) {
        var n = new $util.Long(0, 0, false)
        d.Seconds =
          o.longs === String
            ? n.toString()
            : o.longs === Number
            ? n.toNumber()
            : n
      } else d.Seconds = o.longs === String ? '0' : 0
      d.FractionalNanoseconds = 0
    }
    if (m.Seconds != null && m.hasOwnProperty('Seconds')) {
      if (typeof m.Seconds === 'number')
        d.Seconds = o.longs === String ? String(m.Seconds) : m.Seconds
      else
        d.Seconds =
          o.longs === String
            ? $util.Long.prototype.toString.call(m.Seconds)
            : o.longs === Number
            ? new $util.LongBits(
                m.Seconds.low >>> 0,
                m.Seconds.high >>> 0
              ).toNumber()
            : m.Seconds
    }
    if (
      m.FractionalNanoseconds != null &&
      m.hasOwnProperty('FractionalNanoseconds')
    ) {
      d.FractionalNanoseconds = m.FractionalNanoseconds
    }
    return d
  }
  UnixTime2.prototype.toJSON = function toJSON() {
    return this.constructor.toObject(
      this,
      import_minimal.default.util.toJSONOptions
    )
  }
  return UnixTime2
})())
var Metadata = ($root.Metadata = (() => {
  function Metadata2(p) {
    if (p) {
      for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
        if (p[ks[i]] != null) this[ks[i]] = p[ks[i]]
    }
  }
  Metadata2.prototype.MimeType = ''
  Metadata2.encode = function encode12(m, w) {
    if (!w) w = $Writer.create()
    if (m.MimeType != null && Object.hasOwnProperty.call(m, 'MimeType'))
      w.uint32(10).string(m.MimeType)
    return w
  }
  Metadata2.decode = function decode11(r, l) {
    if (!(r instanceof $Reader)) r = $Reader.create(r)
    var c = l === void 0 ? r.len : r.pos + l,
      m = new $root.Metadata()
    while (r.pos < c) {
      var t = r.uint32()
      switch (t >>> 3) {
        case 1:
          m.MimeType = r.string()
          break
        default:
          r.skipType(t & 7)
          break
      }
    }
    return m
  }
  Metadata2.fromObject = function fromObject(d) {
    if (d instanceof $root.Metadata) return d
    var m = new $root.Metadata()
    if (d.MimeType != null) {
      m.MimeType = String(d.MimeType)
    }
    return m
  }
  Metadata2.toObject = function toObject(m, o) {
    if (!o) o = {}
    var d = {}
    if (o.defaults) {
      d.MimeType = ''
    }
    if (m.MimeType != null && m.hasOwnProperty('MimeType')) {
      d.MimeType = m.MimeType
    }
    return d
  }
  Metadata2.prototype.toJSON = function toJSON() {
    return this.constructor.toObject(
      this,
      import_minimal.default.util.toJSONOptions
    )
  }
  return Metadata2
})())

// node_modules/ipfs-unixfs/esm/src/index.js
var PBData = Data
var types = [
  'raw',
  'directory',
  'file',
  'metadata',
  'symlink',
  'hamt-sharded-directory',
]
var dirTypes = ['directory', 'hamt-sharded-directory']
var DEFAULT_FILE_MODE = parseInt('0644', 8)
var DEFAULT_DIRECTORY_MODE = parseInt('0755', 8)
function parseMode(mode) {
  if (mode == null) {
    return void 0
  }
  if (typeof mode === 'number') {
    return mode & 4095
  }
  mode = mode.toString()
  if (mode.substring(0, 1) === '0') {
    return parseInt(mode, 8) & 4095
  }
  return parseInt(mode, 10) & 4095
}
function parseMtime(input) {
  if (input == null) {
    return void 0
  }
  let mtime
  if (input.secs != null) {
    mtime = {
      secs: input.secs,
      nsecs: input.nsecs,
    }
  }
  if (input.Seconds != null) {
    mtime = {
      secs: input.Seconds,
      nsecs: input.FractionalNanoseconds,
    }
  }
  if (Array.isArray(input)) {
    mtime = {
      secs: input[0],
      nsecs: input[1],
    }
  }
  if (input instanceof Date) {
    const ms = input.getTime()
    const secs = Math.floor(ms / 1e3)
    mtime = {
      secs,
      nsecs: (ms - secs * 1e3) * 1e3,
    }
  }
  if (!Object.prototype.hasOwnProperty.call(mtime, 'secs')) {
    return void 0
  }
  if (
    mtime != null &&
    mtime.nsecs != null &&
    (mtime.nsecs < 0 || mtime.nsecs > 999999999)
  ) {
    throw (0, import_err_code.default)(
      new Error('mtime-nsecs must be within the range [0,999999999]'),
      'ERR_INVALID_MTIME_NSECS'
    )
  }
  return mtime
}
var UnixFS = class {
  static unmarshal(marshaled) {
    const message = PBData.decode(marshaled)
    const decoded = PBData.toObject(message, {
      defaults: false,
      arrays: true,
      longs: Number,
      objects: false,
    })
    const data = new UnixFS({
      type: types[decoded.Type],
      data: decoded.Data,
      blockSizes: decoded.blocksizes,
      mode: decoded.mode,
      mtime: decoded.mtime
        ? {
            secs: decoded.mtime.Seconds,
            nsecs: decoded.mtime.FractionalNanoseconds,
          }
        : void 0,
    })
    data._originalMode = decoded.mode || 0
    return data
  }
  constructor(options = { type: 'file' }) {
    const { type, data, blockSizes, hashType, fanout, mtime, mode } = options
    if (type && !types.includes(type)) {
      throw (0, import_err_code.default)(
        new Error('Type: ' + type + ' is not valid'),
        'ERR_INVALID_TYPE'
      )
    }
    this.type = type || 'file'
    this.data = data
    this.hashType = hashType
    this.fanout = fanout
    this.blockSizes = blockSizes || []
    this._originalMode = 0
    this.mode = parseMode(mode)
    if (mtime) {
      this.mtime = parseMtime(mtime)
      if (this.mtime && !this.mtime.nsecs) {
        this.mtime.nsecs = 0
      }
    }
  }
  set mode(mode) {
    this._mode = this.isDirectory() ? DEFAULT_DIRECTORY_MODE : DEFAULT_FILE_MODE
    const parsedMode = parseMode(mode)
    if (parsedMode !== void 0) {
      this._mode = parsedMode
    }
  }
  get mode() {
    return this._mode
  }
  isDirectory() {
    return Boolean(this.type && dirTypes.includes(this.type))
  }
  addBlockSize(size) {
    this.blockSizes.push(size)
  }
  removeBlockSize(index) {
    this.blockSizes.splice(index, 1)
  }
  fileSize() {
    if (this.isDirectory()) {
      return 0
    }
    let sum = 0
    this.blockSizes.forEach((size) => {
      sum += size
    })
    if (this.data) {
      sum += this.data.length
    }
    return sum
  }
  marshal() {
    let type
    switch (this.type) {
      case 'raw':
        type = PBData.DataType.Raw
        break
      case 'directory':
        type = PBData.DataType.Directory
        break
      case 'file':
        type = PBData.DataType.File
        break
      case 'metadata':
        type = PBData.DataType.Metadata
        break
      case 'symlink':
        type = PBData.DataType.Symlink
        break
      case 'hamt-sharded-directory':
        type = PBData.DataType.HAMTShard
        break
      default:
        throw (0, import_err_code.default)(
          new Error('Type: ' + type + ' is not valid'),
          'ERR_INVALID_TYPE'
        )
    }
    let data = this.data
    if (!this.data || !this.data.length) {
      data = void 0
    }
    let mode
    if (this.mode != null) {
      mode = (this._originalMode & 4294963200) | (parseMode(this.mode) || 0)
      if (mode === DEFAULT_FILE_MODE && !this.isDirectory()) {
        mode = void 0
      }
      if (mode === DEFAULT_DIRECTORY_MODE && this.isDirectory()) {
        mode = void 0
      }
    }
    let mtime
    if (this.mtime != null) {
      const parsed = parseMtime(this.mtime)
      if (parsed) {
        mtime = {
          Seconds: parsed.secs,
          FractionalNanoseconds: parsed.nsecs,
        }
        if (mtime.FractionalNanoseconds === 0) {
          delete mtime.FractionalNanoseconds
        }
      }
    }
    const pbData = {
      Type: type,
      Data: data,
      filesize: this.isDirectory() ? void 0 : this.fileSize(),
      blocksizes: this.blockSizes,
      hashType: this.hashType,
      fanout: this.fanout,
      mode,
      mtime,
    }
    return PBData.encode(pbData).finish()
  }
}

// node_modules/ipfs-unixfs-importer/esm/src/utils/persist.js
init_cid()
init_sha2_browser()
var persist = async (buffer2, blockstore, options) => {
  if (!options.codec) {
    options.codec = src_exports
  }
  if (!options.hasher) {
    options.hasher = sha256
  }
  if (options.cidVersion === void 0) {
    options.cidVersion = 1
  }
  if (options.codec === src_exports && options.hasher !== sha256) {
    options.cidVersion = 1
  }
  const multihash = await options.hasher.digest(buffer2)
  const cid = CID.create(options.cidVersion, options.codec.code, multihash)
  if (!options.onlyHash) {
    await blockstore.put(cid, buffer2, { signal: options.signal })
  }
  return cid
}
var persist_default = persist

// node_modules/ipfs-unixfs-importer/esm/src/dag-builder/dir.js
var dirBuilder = async (item, blockstore, options) => {
  const unixfs = new UnixFS({
    type: 'directory',
    mtime: item.mtime,
    mode: item.mode,
  })
  const buffer2 = encode9(prepare({ Data: unixfs.marshal() }))
  const cid = await persist_default(buffer2, blockstore, options)
  const path = item.path
  return {
    cid,
    path,
    unixfs,
    size: buffer2.length,
  }
}
var dir_default = dirBuilder

// node_modules/ipfs-unixfs-importer/esm/src/dag-builder/file/index.js
var import_err_code2 = __toModule(require_err_code())
var import_it_parallel_batch = __toModule(require_it_parallel_batch())
init_raw()

// node_modules/ipfs-unixfs-importer/esm/src/dag-builder/file/flat.js
var import_it_all = __toModule(require_it_all())
async function flat(source, reduce2) {
  return reduce2(await (0, import_it_all.default)(source))
}
var flat_default = flat

// node_modules/ipfs-unixfs-importer/esm/src/dag-builder/file/balanced.js
var import_it_batch = __toModule(require_it_batch())
function balanced(source, reduce2, options) {
  return reduceToParents(source, reduce2, options)
}
async function reduceToParents(source, reduce2, options) {
  const roots = []
  for await (const chunked of (0, import_it_batch.default)(
    source,
    options.maxChildrenPerNode
  )) {
    roots.push(await reduce2(chunked))
  }
  if (roots.length > 1) {
    return reduceToParents(roots, reduce2, options)
  }
  return roots[0]
}
var balanced_default = balanced

// node_modules/ipfs-unixfs-importer/esm/src/dag-builder/file/trickle.js
var import_it_batch2 = __toModule(require_it_batch())
async function trickleStream(source, reduce2, options) {
  const root = new Root(options.layerRepeat)
  let iteration = 0
  let maxDepth = 1
  let subTree = root
  for await (const layer of (0, import_it_batch2.default)(
    source,
    options.maxChildrenPerNode
  )) {
    if (subTree.isFull()) {
      if (subTree !== root) {
        root.addChild(await subTree.reduce(reduce2))
      }
      if (iteration && iteration % options.layerRepeat === 0) {
        maxDepth++
      }
      subTree = new SubTree(maxDepth, options.layerRepeat, iteration)
      iteration++
    }
    subTree.append(layer)
  }
  if (subTree && subTree !== root) {
    root.addChild(await subTree.reduce(reduce2))
  }
  return root.reduce(reduce2)
}
var trickle_default = trickleStream
var SubTree = class {
  constructor(maxDepth, layerRepeat, iteration = 0) {
    this.maxDepth = maxDepth
    this.layerRepeat = layerRepeat
    this.currentDepth = 1
    this.iteration = iteration
    this.root =
      this.node =
      this.parent =
        {
          children: [],
          depth: this.currentDepth,
          maxDepth,
          maxChildren: (this.maxDepth - this.currentDepth) * this.layerRepeat,
        }
  }
  isFull() {
    if (!this.root.data) {
      return false
    }
    if (this.currentDepth < this.maxDepth && this.node.maxChildren) {
      this._addNextNodeToParent(this.node)
      return false
    }
    const distantRelative = this._findParent(this.node, this.currentDepth)
    if (distantRelative) {
      this._addNextNodeToParent(distantRelative)
      return false
    }
    return true
  }
  _addNextNodeToParent(parent) {
    this.parent = parent
    const nextNode = {
      children: [],
      depth: parent.depth + 1,
      parent,
      maxDepth: this.maxDepth,
      maxChildren:
        Math.floor(parent.children.length / this.layerRepeat) *
        this.layerRepeat,
    }
    parent.children.push(nextNode)
    this.currentDepth = nextNode.depth
    this.node = nextNode
  }
  append(layer) {
    this.node.data = layer
  }
  reduce(reduce2) {
    return this._reduce(this.root, reduce2)
  }
  async _reduce(node, reduce2) {
    let children = []
    if (node.children.length) {
      children = await Promise.all(
        node.children
          .filter((child) => child.data)
          .map((child) => this._reduce(child, reduce2))
      )
    }
    return reduce2((node.data || []).concat(children))
  }
  _findParent(node, depth) {
    const parent = node.parent
    if (!parent || parent.depth === 0) {
      return
    }
    if (parent.children.length === parent.maxChildren || !parent.maxChildren) {
      return this._findParent(parent, depth)
    }
    return parent
  }
}
var Root = class extends SubTree {
  constructor(layerRepeat) {
    super(0, layerRepeat)
    this.root.depth = 0
    this.currentDepth = 1
  }
  addChild(child) {
    this.root.children.push(child)
  }
  reduce(reduce2) {
    return reduce2((this.root.data || []).concat(this.root.children))
  }
}

// node_modules/ipfs-unixfs-importer/esm/src/dag-builder/file/buffer-importer.js
init_raw()
async function* bufferImporter(file2, block, options) {
  for await (let buffer2 of file2.content) {
    yield async () => {
      options.progress(buffer2.length, file2.path)
      let unixfs
      const opts = {
        codec: src_exports,
        cidVersion: options.cidVersion,
        hasher: options.hasher,
        onlyHash: options.onlyHash,
      }
      if (options.rawLeaves) {
        opts.codec = raw_exports
        opts.cidVersion = 1
      } else {
        unixfs = new UnixFS({
          type: options.leafType,
          data: buffer2,
          mtime: file2.mtime,
          mode: file2.mode,
        })
        buffer2 = encode9({
          Data: unixfs.marshal(),
          Links: [],
        })
      }
      return {
        cid: await persist_default(buffer2, block, opts),
        unixfs,
        size: buffer2.length,
      }
    }
  }
}
var buffer_importer_default = bufferImporter

// node_modules/ipfs-unixfs-importer/esm/src/dag-builder/file/index.js
var dagBuilders = {
  flat: flat_default,
  balanced: balanced_default,
  trickle: trickle_default,
}
async function* buildFileBatch(file2, blockstore, options) {
  let count = -1
  let previous
  let bufferImporter2
  if (typeof options.bufferImporter === 'function') {
    bufferImporter2 = options.bufferImporter
  } else {
    bufferImporter2 = buffer_importer_default
  }
  for await (const entry of (0, import_it_parallel_batch.default)(
    bufferImporter2(file2, blockstore, options),
    options.blockWriteConcurrency
  )) {
    count++
    if (count === 0) {
      previous = entry
      continue
    } else if (count === 1 && previous) {
      yield previous
      previous = null
    }
    yield entry
  }
  if (previous) {
    previous.single = true
    yield previous
  }
}
var reduce = (file2, blockstore, options) => {
  async function reducer(leaves) {
    if (
      leaves.length === 1 &&
      leaves[0].single &&
      options.reduceSingleLeafToSelf
    ) {
      const leaf = leaves[0]
      if (
        leaf.cid.code === code &&
        (file2.mtime !== void 0 || file2.mode !== void 0)
      ) {
        let buffer3 = await blockstore.get(leaf.cid)
        leaf.unixfs = new UnixFS({
          type: 'file',
          mtime: file2.mtime,
          mode: file2.mode,
          data: buffer3,
        })
        buffer3 = encode9(prepare({ Data: leaf.unixfs.marshal() }))
        leaf.cid = await persist_default(buffer3, blockstore, {
          ...options,
          codec: src_exports,
          hasher: options.hasher,
          cidVersion: options.cidVersion,
        })
        leaf.size = buffer3.length
      }
      return {
        cid: leaf.cid,
        path: file2.path,
        unixfs: leaf.unixfs,
        size: leaf.size,
      }
    }
    const f = new UnixFS({
      type: 'file',
      mtime: file2.mtime,
      mode: file2.mode,
    })
    const links2 = leaves
      .filter((leaf) => {
        if (leaf.cid.code === code && leaf.size) {
          return true
        }
        if (leaf.unixfs && !leaf.unixfs.data && leaf.unixfs.fileSize()) {
          return true
        }
        return Boolean(
          leaf.unixfs && leaf.unixfs.data && leaf.unixfs.data.length
        )
      })
      .map((leaf) => {
        if (leaf.cid.code === code) {
          f.addBlockSize(leaf.size)
          return {
            Name: '',
            Tsize: leaf.size,
            Hash: leaf.cid,
          }
        }
        if (!leaf.unixfs || !leaf.unixfs.data) {
          f.addBlockSize((leaf.unixfs && leaf.unixfs.fileSize()) || 0)
        } else {
          f.addBlockSize(leaf.unixfs.data.length)
        }
        return {
          Name: '',
          Tsize: leaf.size,
          Hash: leaf.cid,
        }
      })
    const node = {
      Data: f.marshal(),
      Links: links2,
    }
    const buffer2 = encode9(prepare(node))
    const cid = await persist_default(buffer2, blockstore, options)
    return {
      cid,
      path: file2.path,
      unixfs: f,
      size:
        buffer2.length + node.Links.reduce((acc, curr) => acc + curr.Tsize, 0),
    }
  }
  return reducer
}
function fileBuilder(file2, block, options) {
  const dagBuilder2 = dagBuilders[options.strategy]
  if (!dagBuilder2) {
    throw (0, import_err_code2.default)(
      new Error(`Unknown importer build strategy name: ${options.strategy}`),
      'ERR_BAD_STRATEGY'
    )
  }
  return dagBuilder2(
    buildFileBatch(file2, block, options),
    reduce(file2, block, options),
    options
  )
}
var file_default = fileBuilder

// node_modules/ipfs-unixfs-importer/esm/src/dag-builder/index.js
var import_err_code5 = __toModule(require_err_code())

// node_modules/ipfs-unixfs-importer/esm/src/chunker/rabin.js
var import_BufferList = __toModule(require_BufferList())
var import_rabin_wasm = __toModule(require_src())
var import_err_code3 = __toModule(require_err_code())
async function* rabinChunker(source, options) {
  let min, max, avg
  if (options.minChunkSize && options.maxChunkSize && options.avgChunkSize) {
    avg = options.avgChunkSize
    min = options.minChunkSize
    max = options.maxChunkSize
  } else if (!options.avgChunkSize) {
    throw (0, import_err_code3.default)(
      new Error('please specify an average chunk size'),
      'ERR_INVALID_AVG_CHUNK_SIZE'
    )
  } else {
    avg = options.avgChunkSize
    min = avg / 3
    max = avg + avg / 2
  }
  if (min < 16) {
    throw (0, import_err_code3.default)(
      new Error('rabin min must be greater than 16'),
      'ERR_INVALID_MIN_CHUNK_SIZE'
    )
  }
  if (max < min) {
    max = min
  }
  if (avg < min) {
    avg = min
  }
  const sizepow = Math.floor(Math.log2(avg))
  for await (const chunk of rabin(source, {
    min,
    max,
    bits: sizepow,
    window: options.window,
    polynomial: options.polynomial,
  })) {
    yield chunk
  }
}
var rabin_default = rabinChunker
async function* rabin(source, options) {
  const r = await (0, import_rabin_wasm.create)(
    options.bits,
    options.min,
    options.max,
    options.window
  )
  const buffers = new import_BufferList.default()
  for await (const chunk of source) {
    buffers.append(chunk)
    const sizes = r.fingerprint(chunk)
    for (let i = 0; i < sizes.length; i++) {
      const size = sizes[i]
      const buf2 = buffers.slice(0, size)
      buffers.consume(size)
      yield buf2
    }
  }
  if (buffers.length) {
    yield buffers.slice(0)
  }
}

// node_modules/ipfs-unixfs-importer/esm/src/chunker/fixed-size.js
var import_BufferList2 = __toModule(require_BufferList())
async function* fixedSizeChunker(source, options) {
  let bl = new import_BufferList2.default()
  let currentLength = 0
  let emitted = false
  const maxChunkSize = options.maxChunkSize
  for await (const buffer2 of source) {
    bl.append(buffer2)
    currentLength += buffer2.length
    while (currentLength >= maxChunkSize) {
      yield bl.slice(0, maxChunkSize)
      emitted = true
      if (maxChunkSize === bl.length) {
        bl = new import_BufferList2.default()
        currentLength = 0
      } else {
        const newBl = new import_BufferList2.default()
        newBl.append(bl.shallowSlice(maxChunkSize))
        bl = newBl
        currentLength -= maxChunkSize
      }
    }
  }
  if (!emitted || currentLength) {
    yield bl.slice(0, currentLength)
  }
}
var fixed_size_default = fixedSizeChunker

// node_modules/ipfs-unixfs-importer/esm/src/dag-builder/validate-chunks.js
var import_err_code4 = __toModule(require_err_code())
init_from_string()
async function* validateChunks(source) {
  for await (const content of source) {
    if (content.length === void 0) {
      throw (0, import_err_code4.default)(
        new Error('Content was invalid'),
        'ERR_INVALID_CONTENT'
      )
    }
    if (typeof content === 'string' || content instanceof String) {
      yield fromString3(content.toString())
    } else if (Array.isArray(content)) {
      yield Uint8Array.from(content)
    } else if (content instanceof Uint8Array) {
      yield content
    } else {
      throw (0, import_err_code4.default)(
        new Error('Content was invalid'),
        'ERR_INVALID_CONTENT'
      )
    }
  }
}
var validate_chunks_default = validateChunks

// node_modules/ipfs-unixfs-importer/esm/src/dag-builder/index.js
function isIterable(thing) {
  return Symbol.iterator in thing
}
function isAsyncIterable(thing) {
  return Symbol.asyncIterator in thing
}
function contentAsAsyncIterable(content) {
  try {
    if (content instanceof Uint8Array) {
      return (async function* () {
        yield content
      })()
    } else if (isIterable(content)) {
      return (async function* () {
        yield* content
      })()
    } else if (isAsyncIterable(content)) {
      return content
    }
  } catch (e) {
    throw (0, import_err_code5.default)(
      new Error('Content was invalid'),
      'ERR_INVALID_CONTENT'
    )
  }
  throw (0, import_err_code5.default)(
    new Error('Content was invalid'),
    'ERR_INVALID_CONTENT'
  )
}
async function* dagBuilder(source, blockstore, options) {
  for await (const entry of source) {
    if (entry.path) {
      if (entry.path.substring(0, 2) === './') {
        options.wrapWithDirectory = true
      }
      entry.path = entry.path
        .split('/')
        .filter((path) => path && path !== '.')
        .join('/')
    }
    if (entry.content) {
      let chunker
      if (typeof options.chunker === 'function') {
        chunker = options.chunker
      } else if (options.chunker === 'rabin') {
        chunker = rabin_default
      } else {
        chunker = fixed_size_default
      }
      let chunkValidator
      if (typeof options.chunkValidator === 'function') {
        chunkValidator = options.chunkValidator
      } else {
        chunkValidator = validate_chunks_default
      }
      const file2 = {
        path: entry.path,
        mtime: entry.mtime,
        mode: entry.mode,
        content: chunker(
          chunkValidator(contentAsAsyncIterable(entry.content), options),
          options
        ),
      }
      yield () => file_default(file2, blockstore, options)
    } else if (entry.path) {
      const dir = {
        path: entry.path,
        mtime: entry.mtime,
        mode: entry.mode,
      }
      yield () => dir_default(dir, blockstore, options)
    } else {
      throw new Error('Import candidate must have content or path or both')
    }
  }
}
var dag_builder_default = dagBuilder

// node_modules/ipfs-unixfs-importer/esm/src/dir.js
var Dir = class {
  constructor(props, options) {
    this.options = options || {}
    this.root = props.root
    this.dir = props.dir
    this.path = props.path
    this.dirty = props.dirty
    this.flat = props.flat
    this.parent = props.parent
    this.parentKey = props.parentKey
    this.unixfs = props.unixfs
    this.mode = props.mode
    this.mtime = props.mtime
    this.cid = void 0
    this.size = void 0
  }
  async put(name6, value) {}
  get(name6) {
    return Promise.resolve(this)
  }
  async *eachChildSeries() {}
  async *flush(blockstore) {}
}
var dir_default2 = Dir

// node_modules/ipfs-unixfs-importer/esm/src/dir-flat.js
var DirFlat = class extends dir_default2 {
  constructor(props, options) {
    super(props, options)
    this._children = {}
  }
  async put(name6, value) {
    this.cid = void 0
    this.size = void 0
    this._children[name6] = value
  }
  get(name6) {
    return Promise.resolve(this._children[name6])
  }
  childCount() {
    return Object.keys(this._children).length
  }
  directChildrenCount() {
    return this.childCount()
  }
  onlyChild() {
    return this._children[Object.keys(this._children)[0]]
  }
  async *eachChildSeries() {
    const keys = Object.keys(this._children)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      yield {
        key,
        child: this._children[key],
      }
    }
  }
  async *flush(block) {
    const children = Object.keys(this._children)
    const links2 = []
    for (let i = 0; i < children.length; i++) {
      let child = this._children[children[i]]
      if (child instanceof dir_default2) {
        for await (const entry of child.flush(block)) {
          child = entry
          yield child
        }
      }
      if (child.size != null && child.cid) {
        links2.push({
          Name: children[i],
          Tsize: child.size,
          Hash: child.cid,
        })
      }
    }
    const unixfs = new UnixFS({
      type: 'directory',
      mtime: this.mtime,
      mode: this.mode,
    })
    const node = {
      Data: unixfs.marshal(),
      Links: links2,
    }
    const buffer2 = encode9(prepare(node))
    const cid = await persist_default(buffer2, block, this.options)
    const size =
      buffer2.length +
      node.Links.reduce(
        (acc, curr) => acc + (curr.Tsize == null ? 0 : curr.Tsize),
        0
      )
    this.cid = cid
    this.size = size
    yield {
      cid,
      unixfs,
      path: this.path,
      size,
    }
  }
}
var dir_flat_default = DirFlat

// node_modules/ipfs-unixfs-importer/esm/src/dir-sharded.js
var import_hamt_sharding = __toModule(require_src2())
var DirSharded = class extends dir_default2 {
  constructor(props, options) {
    super(props, options)
    this._bucket = (0, import_hamt_sharding.createHAMT)({
      hashFn: options.hamtHashFn,
      bits: options.hamtBucketBits,
    })
  }
  async put(name6, value) {
    await this._bucket.put(name6, value)
  }
  get(name6) {
    return this._bucket.get(name6)
  }
  childCount() {
    return this._bucket.leafCount()
  }
  directChildrenCount() {
    return this._bucket.childrenCount()
  }
  onlyChild() {
    return this._bucket.onlyChild()
  }
  async *eachChildSeries() {
    for await (const { key, value } of this._bucket.eachLeafSeries()) {
      yield {
        key,
        child: value,
      }
    }
  }
  async *flush(blockstore) {
    for await (const entry of flush(
      this._bucket,
      blockstore,
      this,
      this.options
    )) {
      yield {
        ...entry,
        path: this.path,
      }
    }
  }
}
var dir_sharded_default = DirSharded
async function* flush(bucket, blockstore, shardRoot, options) {
  const children = bucket._children
  const links2 = []
  let childrenSize = 0
  for (let i = 0; i < children.length; i++) {
    const child = children.get(i)
    if (!child) {
      continue
    }
    const labelPrefix = i.toString(16).toUpperCase().padStart(2, '0')
    if (child instanceof import_hamt_sharding.Bucket) {
      let shard
      for await (const subShard of await flush(
        child,
        blockstore,
        null,
        options
      )) {
        shard = subShard
      }
      if (!shard) {
        throw new Error('Could not flush sharded directory, no subshard found')
      }
      links2.push({
        Name: labelPrefix,
        Tsize: shard.size,
        Hash: shard.cid,
      })
      childrenSize += shard.size
    } else if (typeof child.value.flush === 'function') {
      const dir2 = child.value
      let flushedDir
      for await (const entry of dir2.flush(blockstore)) {
        flushedDir = entry
        yield flushedDir
      }
      const label = labelPrefix + child.key
      links2.push({
        Name: label,
        Tsize: flushedDir.size,
        Hash: flushedDir.cid,
      })
      childrenSize += flushedDir.size
    } else {
      const value = child.value
      if (!value.cid) {
        continue
      }
      const label = labelPrefix + child.key
      const size2 = value.size
      links2.push({
        Name: label,
        Tsize: size2,
        Hash: value.cid,
      })
      childrenSize += size2
    }
  }
  const data = Uint8Array.from(children.bitField().reverse())
  const dir = new UnixFS({
    type: 'hamt-sharded-directory',
    data,
    fanout: bucket.tableSize(),
    hashType: options.hamtHashCode,
    mtime: shardRoot && shardRoot.mtime,
    mode: shardRoot && shardRoot.mode,
  })
  const node = {
    Data: dir.marshal(),
    Links: links2,
  }
  const buffer2 = encode9(prepare(node))
  const cid = await persist_default(buffer2, blockstore, options)
  const size = buffer2.length + childrenSize
  yield {
    cid,
    unixfs: dir,
    size,
  }
}

// node_modules/ipfs-unixfs-importer/esm/src/flat-to-shard.js
async function flatToShard(child, dir, threshold, options) {
  let newDir = dir
  if (
    dir instanceof dir_flat_default &&
    dir.directChildrenCount() >= threshold
  ) {
    newDir = await convertToShard(dir, options)
  }
  const parent = newDir.parent
  if (parent) {
    if (newDir !== dir) {
      if (child) {
        child.parent = newDir
      }
      if (!newDir.parentKey) {
        throw new Error('No parent key found')
      }
      await parent.put(newDir.parentKey, newDir)
    }
    return flatToShard(newDir, parent, threshold, options)
  }
  return newDir
}
async function convertToShard(oldDir, options) {
  const newDir = new dir_sharded_default(
    {
      root: oldDir.root,
      dir: true,
      parent: oldDir.parent,
      parentKey: oldDir.parentKey,
      path: oldDir.path,
      dirty: oldDir.dirty,
      flat: false,
      mtime: oldDir.mtime,
      mode: oldDir.mode,
    },
    options
  )
  for await (const { key, child } of oldDir.eachChildSeries()) {
    await newDir.put(key, child)
  }
  return newDir
}
var flat_to_shard_default = flatToShard

// node_modules/ipfs-unixfs-importer/esm/src/utils/to-path-components.js
var toPathComponents = (path = '') => {
  return (path.trim().match(/([^\\^/]|\\\/)+/g) || []).filter(Boolean)
}
var to_path_components_default = toPathComponents

// node_modules/ipfs-unixfs-importer/esm/src/tree-builder.js
async function addToTree(elem, tree2, options) {
  const pathElems = to_path_components_default(elem.path || '')
  const lastIndex = pathElems.length - 1
  let parent = tree2
  let currentPath = ''
  for (let i = 0; i < pathElems.length; i++) {
    const pathElem = pathElems[i]
    currentPath += `${currentPath ? '/' : ''}${pathElem}`
    const last2 = i === lastIndex
    parent.dirty = true
    parent.cid = void 0
    parent.size = void 0
    if (last2) {
      await parent.put(pathElem, elem)
      tree2 = await flat_to_shard_default(
        null,
        parent,
        options.shardSplitThreshold,
        options
      )
    } else {
      let dir = await parent.get(pathElem)
      if (!dir || !(dir instanceof dir_default2)) {
        dir = new dir_flat_default(
          {
            root: false,
            dir: true,
            parent,
            parentKey: pathElem,
            path: currentPath,
            dirty: true,
            flat: true,
            mtime: dir && dir.unixfs && dir.unixfs.mtime,
            mode: dir && dir.unixfs && dir.unixfs.mode,
          },
          options
        )
      }
      await parent.put(pathElem, dir)
      parent = dir
    }
  }
  return tree2
}
async function* flushAndYield(tree2, blockstore) {
  if (!(tree2 instanceof dir_default2)) {
    if (tree2 && tree2.unixfs && tree2.unixfs.isDirectory()) {
      yield tree2
    }
    return
  }
  yield* tree2.flush(blockstore)
}
async function* treeBuilder(source, block, options) {
  let tree2 = new dir_flat_default(
    {
      root: true,
      dir: true,
      path: '',
      dirty: true,
      flat: true,
    },
    options
  )
  for await (const entry of source) {
    if (!entry) {
      continue
    }
    tree2 = await addToTree(entry, tree2, options)
    if (!entry.unixfs || !entry.unixfs.isDirectory()) {
      yield entry
    }
  }
  if (options.wrapWithDirectory) {
    yield* flushAndYield(tree2, block)
  } else {
    for await (const unwrapped of tree2.eachChildSeries()) {
      if (!unwrapped) {
        continue
      }
      yield* flushAndYield(unwrapped.child, block)
    }
  }
}
var tree_builder_default = treeBuilder

// node_modules/ipfs-unixfs-importer/esm/src/index.js
async function* importer(source, blockstore, options = {}) {
  const opts = options_default(options)
  let dagBuilder2
  if (typeof options.dagBuilder === 'function') {
    dagBuilder2 = options.dagBuilder
  } else {
    dagBuilder2 = dag_builder_default
  }
  let treeBuilder2
  if (typeof options.treeBuilder === 'function') {
    treeBuilder2 = options.treeBuilder
  } else {
    treeBuilder2 = tree_builder_default
  }
  let candidates
  if (Symbol.asyncIterator in source || Symbol.iterator in source) {
    candidates = source
  } else {
    candidates = [source]
  }
  for await (const entry of treeBuilder2(
    (0, import_it_parallel_batch2.default)(
      dagBuilder2(candidates, blockstore, opts),
      opts.fileImportConcurrency
    ),
    blockstore,
    opts
  )) {
    yield {
      cid: entry.cid,
      path: entry.path,
      unixfs: entry.unixfs,
      size: entry.size,
    }
  }
}

// node_modules/ipfs-core-utils/esm/src/files/normalise-content.js
var import_err_code6 = __toModule(require_err_code())
init_from_string()
var import_browser_readablestream_to_it = __toModule(
  require_browser_readablestream_to_it()
)
var import_blob_to_it = __toModule(require_blob_to_it())
var import_it_peekable = __toModule(require_it_peekable())
var import_it_all2 = __toModule(require_it_all())
var import_it_map = __toModule(require_it_map())

// node_modules/ipfs-core-utils/esm/src/files/utils.js
function isBytes(obj) {
  return ArrayBuffer.isView(obj) || obj instanceof ArrayBuffer
}
function isBlob(obj) {
  return (
    obj.constructor &&
    (obj.constructor.name === 'Blob' || obj.constructor.name === 'File') &&
    typeof obj.stream === 'function'
  )
}
function isFileObject(obj) {
  return typeof obj === 'object' && (obj.path || obj.content)
}
var isReadableStream = (value) => value && typeof value.getReader === 'function'

// node_modules/ipfs-core-utils/esm/src/files/normalise-content.js
async function* toAsyncIterable(thing) {
  yield thing
}
async function normaliseContent(input) {
  if (isBytes(input)) {
    return toAsyncIterable(toBytes(input))
  }
  if (typeof input === 'string' || input instanceof String) {
    return toAsyncIterable(toBytes(input.toString()))
  }
  if (isBlob(input)) {
    return (0, import_blob_to_it.default)(input)
  }
  if (isReadableStream(input)) {
    input = (0, import_browser_readablestream_to_it.default)(input)
  }
  if (Symbol.iterator in input || Symbol.asyncIterator in input) {
    const peekable = (0, import_it_peekable.default)(input)
    const { value, done } = await peekable.peek()
    if (done) {
      return toAsyncIterable(new Uint8Array(0))
    }
    peekable.push(value)
    if (Number.isInteger(value)) {
      return toAsyncIterable(
        Uint8Array.from(await (0, import_it_all2.default)(peekable))
      )
    }
    if (
      isBytes(value) ||
      typeof value === 'string' ||
      value instanceof String
    ) {
      return (0, import_it_map.default)(peekable, toBytes)
    }
  }
  throw (0, import_err_code6.default)(
    new Error(`Unexpected input: ${input}`),
    'ERR_UNEXPECTED_INPUT'
  )
}
function toBytes(chunk) {
  if (chunk instanceof Uint8Array) {
    return chunk
  }
  if (ArrayBuffer.isView(chunk)) {
    return new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength)
  }
  if (chunk instanceof ArrayBuffer) {
    return new Uint8Array(chunk)
  }
  if (Array.isArray(chunk)) {
    return Uint8Array.from(chunk)
  }
  return fromString3(chunk.toString())
}

// node_modules/ipfs-core-utils/esm/src/files/normalise-candidate-single.js
var import_err_code7 = __toModule(require_err_code())
var import_browser_readablestream_to_it2 = __toModule(
  require_browser_readablestream_to_it()
)
var import_it_peekable2 = __toModule(require_it_peekable())
async function* normaliseCandidateSingle(input, normaliseContent2) {
  if (input === null || input === void 0) {
    throw (0, import_err_code7.default)(
      new Error(`Unexpected input: ${input}`),
      'ERR_UNEXPECTED_INPUT'
    )
  }
  if (typeof input === 'string' || input instanceof String) {
    yield toFileObject(input.toString(), normaliseContent2)
    return
  }
  if (isBytes(input) || isBlob(input)) {
    yield toFileObject(input, normaliseContent2)
    return
  }
  if (isReadableStream(input)) {
    input = (0, import_browser_readablestream_to_it2.default)(input)
  }
  if (Symbol.iterator in input || Symbol.asyncIterator in input) {
    const peekable = (0, import_it_peekable2.default)(input)
    const { value, done } = await peekable.peek()
    if (done) {
      yield { content: [] }
      return
    }
    peekable.push(value)
    if (
      Number.isInteger(value) ||
      isBytes(value) ||
      typeof value === 'string' ||
      value instanceof String
    ) {
      yield toFileObject(peekable, normaliseContent2)
      return
    }
    throw (0, import_err_code7.default)(
      new Error(
        'Unexpected input: multiple items passed - if you are using ipfs.add, please use ipfs.addAll instead'
      ),
      'ERR_UNEXPECTED_INPUT'
    )
  }
  if (isFileObject(input)) {
    yield toFileObject(input, normaliseContent2)
    return
  }
  throw (0, import_err_code7.default)(
    new Error(
      'Unexpected input: cannot convert "' +
        typeof input +
        '" into ImportCandidate'
    ),
    'ERR_UNEXPECTED_INPUT'
  )
}
async function toFileObject(input, normaliseContent2) {
  const { path, mode, mtime, content } = input
  const file2 = {
    path: path || '',
    mode: parseMode(mode),
    mtime: parseMtime(mtime),
  }
  if (content) {
    file2.content = await normaliseContent2(content)
  } else if (!path) {
    file2.content = await normaliseContent2(input)
  }
  return file2
}

// node_modules/ipfs-core-utils/esm/src/files/normalise-input-single.js
function normaliseInput(input) {
  return normaliseCandidateSingle(input, normaliseContent)
}

// node_modules/ipfs-core-utils/esm/src/files/normalise-candidate-multiple.js
var import_err_code8 = __toModule(require_err_code())
var import_browser_readablestream_to_it3 = __toModule(
  require_browser_readablestream_to_it()
)
var import_it_peekable3 = __toModule(require_it_peekable())
var import_it_map2 = __toModule(require_it_map())
async function* normaliseCandidateMultiple(input, normaliseContent2) {
  if (
    typeof input === 'string' ||
    input instanceof String ||
    isBytes(input) ||
    isBlob(input) ||
    input._readableState
  ) {
    throw (0, import_err_code8.default)(
      new Error(
        'Unexpected input: single item passed - if you are using ipfs.addAll, please use ipfs.add instead'
      ),
      'ERR_UNEXPECTED_INPUT'
    )
  }
  if (isReadableStream(input)) {
    input = (0, import_browser_readablestream_to_it3.default)(input)
  }
  if (Symbol.iterator in input || Symbol.asyncIterator in input) {
    const peekable = (0, import_it_peekable3.default)(input)
    const { value, done } = await peekable.peek()
    if (done) {
      yield* []
      return
    }
    peekable.push(value)
    if (Number.isInteger(value)) {
      throw (0, import_err_code8.default)(
        new Error(
          'Unexpected input: single item passed - if you are using ipfs.addAll, please use ipfs.add instead'
        ),
        'ERR_UNEXPECTED_INPUT'
      )
    }
    if (value._readableState) {
      yield* (0, import_it_map2.default)(peekable, (value2) =>
        toFileObject2({ content: value2 }, normaliseContent2)
      )
      return
    }
    if (isBytes(value)) {
      yield toFileObject2({ content: peekable }, normaliseContent2)
      return
    }
    if (
      isFileObject(value) ||
      value[Symbol.iterator] ||
      value[Symbol.asyncIterator] ||
      isReadableStream(value) ||
      isBlob(value)
    ) {
      yield* (0, import_it_map2.default)(peekable, (value2) =>
        toFileObject2(value2, normaliseContent2)
      )
      return
    }
  }
  if (isFileObject(input)) {
    throw (0, import_err_code8.default)(
      new Error(
        'Unexpected input: single item passed - if you are using ipfs.addAll, please use ipfs.add instead'
      ),
      'ERR_UNEXPECTED_INPUT'
    )
  }
  throw (0, import_err_code8.default)(
    new Error('Unexpected input: ' + typeof input),
    'ERR_UNEXPECTED_INPUT'
  )
}
async function toFileObject2(input, normaliseContent2) {
  const { path, mode, mtime, content } = input
  const file2 = {
    path: path || '',
    mode: parseMode(mode),
    mtime: parseMtime(mtime),
  }
  if (content) {
    file2.content = await normaliseContent2(content)
  } else if (!path) {
    file2.content = await normaliseContent2(input)
  }
  return file2
}

// node_modules/ipfs-core-utils/esm/src/files/normalise-input-multiple.js
function normaliseInput2(input) {
  return normaliseCandidateMultiple(input, normaliseContent)
}

// node_modules/ipfs-car/dist/esm/pack/utils/normalise-input.js
function isBytes2(obj) {
  return ArrayBuffer.isView(obj) || obj instanceof ArrayBuffer
}
function isBlob2(obj) {
  return (
    Boolean(obj.constructor) &&
    (obj.constructor.name === 'Blob' || obj.constructor.name === 'File') &&
    typeof obj.stream === 'function'
  )
}
function isSingle(input) {
  return (
    typeof input === 'string' ||
    input instanceof String ||
    isBytes2(input) ||
    isBlob2(input) ||
    '_readableState' in input
  )
}
function getNormaliser(input) {
  if (isSingle(input)) {
    return normaliseInput(input)
  } else {
    return normaliseInput2(input)
  }
}

// node_modules/ipfs-car/dist/esm/blockstore/memory.js
init_src()

// node_modules/blockstore-core/esm/src/errors.js
var errors_exports = {}
__export(errors_exports, {
  abortedError: () => abortedError,
  notFoundError: () => notFoundError,
})
var import_err_code9 = __toModule(require_err_code())
function notFoundError(err) {
  err = err || new Error('Not Found')
  return (0, import_err_code9.default)(err, 'ERR_NOT_FOUND')
}
function abortedError(err) {
  err = err || new Error('Aborted')
  return (0, import_err_code9.default)(err, 'ERR_ABORTED')
}

// node_modules/blockstore-core/esm/src/base.js
var import_it_drain = __toModule(require_it_drain())
var import_it_filter = __toModule(require_it_filter())
var import_it_take = __toModule(require_it_take())
var import_it_all3 = __toModule(require_it_all())
var sortAll = (iterable, sorter) => {
  return (async function* () {
    const values = await (0, import_it_all3.default)(iterable)
    yield* values.sort(sorter)
  })()
}
var BaseBlockstore = class {
  open() {
    return Promise.reject(new Error('.open is not implemented'))
  }
  close() {
    return Promise.reject(new Error('.close is not implemented'))
  }
  put(key, val, options) {
    return Promise.reject(new Error('.put is not implemented'))
  }
  get(key, options) {
    return Promise.reject(new Error('.get is not implemented'))
  }
  has(key, options) {
    return Promise.reject(new Error('.has is not implemented'))
  }
  delete(key, options) {
    return Promise.reject(new Error('.delete is not implemented'))
  }
  async *putMany(source, options = {}) {
    for await (const { key, value } of source) {
      await this.put(key, value, options)
      yield {
        key,
        value,
      }
    }
  }
  async *getMany(source, options = {}) {
    for await (const key of source) {
      yield this.get(key, options)
    }
  }
  async *deleteMany(source, options = {}) {
    for await (const key of source) {
      await this.delete(key, options)
      yield key
    }
  }
  batch() {
    let puts = []
    let dels = []
    return {
      put(key, value) {
        puts.push({
          key,
          value,
        })
      },
      delete(key) {
        dels.push(key)
      },
      commit: async (options) => {
        await (0, import_it_drain.default)(this.putMany(puts, options))
        puts = []
        await (0, import_it_drain.default)(this.deleteMany(dels, options))
        dels = []
      },
    }
  }
  async *_all(q, options) {
    throw new Error('._all is not implemented')
  }
  async *_allKeys(q, options) {
    throw new Error('._allKeys is not implemented')
  }
  query(q, options) {
    let it = this._all(q, options)
    if (q.prefix != null) {
      it = (0, import_it_filter.default)(it, (e) =>
        e.key.toString().startsWith(q.prefix || '')
      )
    }
    if (Array.isArray(q.filters)) {
      it = q.filters.reduce(
        (it2, f) => (0, import_it_filter.default)(it2, f),
        it
      )
    }
    if (Array.isArray(q.orders)) {
      it = q.orders.reduce((it2, f) => sortAll(it2, f), it)
    }
    if (q.offset != null) {
      let i = 0
      it = (0, import_it_filter.default)(it, () => i++ >= (q.offset || 0))
    }
    if (q.limit != null) {
      it = (0, import_it_take.default)(it, q.limit)
    }
    return it
  }
  queryKeys(q, options) {
    let it = this._allKeys(q, options)
    if (q.prefix != null) {
      it = (0, import_it_filter.default)(it, (cid) =>
        cid.toString().startsWith(q.prefix || '')
      )
    }
    if (Array.isArray(q.filters)) {
      it = q.filters.reduce(
        (it2, f) => (0, import_it_filter.default)(it2, f),
        it
      )
    }
    if (Array.isArray(q.orders)) {
      it = q.orders.reduce((it2, f) => sortAll(it2, f), it)
    }
    if (q.offset != null) {
      let i = 0
      it = (0, import_it_filter.default)(it, () => i++ >= q.offset)
    }
    if (q.limit != null) {
      it = (0, import_it_take.default)(it, q.limit)
    }
    return it
  }
}

// node_modules/blockstore-core/esm/src/memory.js
init_base32()
init_raw()
init_cid()
init_digest()

// node_modules/blockstore-core/esm/src/index.js
var Errors2 = { ...errors_exports }

// node_modules/ipfs-car/dist/esm/blockstore/memory.js
var MemoryBlockStore = class extends BaseBlockstore {
  constructor() {
    super()
    this.store = new Map()
  }
  async *blocks() {
    for (const [cidStr, bytes2] of this.store.entries()) {
      yield { cid: CID.parse(cidStr), bytes: bytes2 }
    }
  }
  put(cid, bytes2) {
    this.store.set(cid.toString(), bytes2)
    return Promise.resolve()
  }
  get(cid) {
    const bytes2 = this.store.get(cid.toString())
    if (!bytes2) {
      throw new Error(`block with cid ${cid.toString()} no found`)
    }
    return Promise.resolve(bytes2)
  }
  has(cid) {
    return Promise.resolve(this.store.has(cid.toString()))
  }
  close() {
    this.store.clear()
    return Promise.resolve()
  }
}

// node_modules/ipfs-car/dist/esm/pack/constants.js
init_sha2_browser()
var unixfsImporterOptionsDefault = {
  cidVersion: 1,
  chunker: 'fixed',
  maxChunkSize: 262144,
  hasher: sha256,
  rawLeaves: true,
  wrapWithDirectory: true,
  maxChildrenPerNode: 174,
}

// node_modules/ipfs-car/dist/esm/pack/index.js
async function pack({
  input,
  blockstore: userBlockstore,
  hasher,
  maxChunkSize,
  maxChildrenPerNode,
  wrapWithDirectory,
  rawLeaves,
}) {
  if (!input || (Array.isArray(input) && !input.length)) {
    throw new Error('missing input file(s)')
  }
  const blockstore = userBlockstore ? userBlockstore : new MemoryBlockStore()
  const rootEntry = await (0, import_it_last.default)(
    (0, import_it_pipe.default)(getNormaliser(input), (source) =>
      importer(source, blockstore, {
        ...unixfsImporterOptionsDefault,
        hasher: hasher || unixfsImporterOptionsDefault.hasher,
        maxChunkSize: maxChunkSize || unixfsImporterOptionsDefault.maxChunkSize,
        maxChildrenPerNode:
          maxChildrenPerNode || unixfsImporterOptionsDefault.maxChildrenPerNode,
        wrapWithDirectory:
          wrapWithDirectory === false
            ? false
            : unixfsImporterOptionsDefault.wrapWithDirectory,
        rawLeaves:
          rawLeaves == null
            ? unixfsImporterOptionsDefault.rawLeaves
            : rawLeaves,
      })
    )
  )
  if (!rootEntry || !rootEntry.cid) {
    throw new Error('given input could not be parsed correctly')
  }
  const root = rootEntry.cid
  const { writer, out: carOut } = await CarWriter.create([root])
  const carOutIter = carOut[Symbol.asyncIterator]()
  let writingPromise
  const writeAll = async () => {
    for await (const block of blockstore.blocks()) {
      await writer.put(block)
    }
    await writer.close()
    if (!userBlockstore) {
      await blockstore.close()
    }
  }
  const out = {
    [Symbol.asyncIterator]() {
      if (writingPromise != null) {
        throw new Error('Multiple iterator not supported')
      }
      writingPromise = writeAll()
      return {
        async next() {
          const result = await carOutIter.next()
          if (result.done) {
            await writingPromise
          }
          return result
        },
      }
    },
  }
  return { root, out }
}

// node_modules/nft.storage/src/lib.js
init_cid()

// node_modules/nft.storage/src/token.js
init_cid()
init_sha2_browser()

// node_modules/nft.storage/node_modules/@ipld/dag-cbor/esm/index.js
var esm_exports2 = {}
__export(esm_exports2, {
  code: () => code5,
  decode: () => decode10,
  encode: () => encode11,
  name: () => name5,
})
init_cid()
var CID_CBOR_TAG3 = 42
function cidEncoder3(obj) {
  if (obj.asCID !== obj) {
    return null
  }
  const cid = CID.asCID(obj)
  if (!cid) {
    return null
  }
  const bytes2 = new Uint8Array(cid.bytes.byteLength + 1)
  bytes2.set(cid.bytes, 1)
  return [new Token(Type.tag, CID_CBOR_TAG3), new Token(Type.bytes, bytes2)]
}
function undefinedEncoder3() {
  throw new Error(
    '`undefined` is not supported by the IPLD Data Model and cannot be encoded'
  )
}
function numberEncoder3(num) {
  if (Number.isNaN(num)) {
    throw new Error(
      '`NaN` is not supported by the IPLD Data Model and cannot be encoded'
    )
  }
  if (num === Infinity || num === -Infinity) {
    throw new Error(
      '`Infinity` and `-Infinity` is not supported by the IPLD Data Model and cannot be encoded'
    )
  }
  return null
}
var encodeOptions3 = {
  float64: true,
  typeEncoders: {
    Object: cidEncoder3,
    undefined: undefinedEncoder3,
    number: numberEncoder3,
  },
}
function cidDecoder3(bytes2) {
  if (bytes2[0] !== 0) {
    throw new Error('Invalid CID for CBOR tag 42; expected leading 0x00')
  }
  return CID.decode(bytes2.subarray(1))
}
var decodeOptions3 = {
  allowIndefinite: false,
  allowUndefined: false,
  allowNaN: false,
  allowInfinity: false,
  allowBigInt: true,
  strict: true,
  useMaps: false,
  tags: [],
}
decodeOptions3.tags[CID_CBOR_TAG3] = cidDecoder3
var name5 = 'dag-cbor'
var code5 = 113
var encode11 = (node) => encode4(node, encodeOptions3)
var decode10 = (data) => decode5(data, decodeOptions3)

// node_modules/nft.storage/src/platform.web.js
var fetch2 = globalThis.fetch
var FormData = globalThis.FormData
var Headers = globalThis.Headers
var Request = globalThis.Request
var Response2 = globalThis.Response
var Blob2 = globalThis.Blob
var File2 = globalThis.File
var ReadableStream = globalThis.ReadableStream
var Blockstore = MemoryBlockStore

// node_modules/nft.storage/src/gateway.js
var GATEWAY = new URL('https://dweb.link/')
var toGatewayURL = (url, options = {}) => {
  const gateway = options.gateway || GATEWAY
  url = new URL(String(url))
  return url.protocol === 'ipfs:'
    ? new URL(`/ipfs/${url.href.slice('ipfs://'.length)}`, gateway)
    : url
}

// node_modules/nft.storage/src/bs-car-reader.js
var BlockstoreCarReader = class {
  constructor(version2, roots, blockstore) {
    this._version = version2
    this._roots = roots
    this._blockstore = blockstore
  }
  get version() {
    return this._version
  }
  get blockstore() {
    return this._blockstore
  }
  async getRoots() {
    return this._roots
  }
  has(cid) {
    return this._blockstore.has(cid)
  }
  async get(cid) {
    const bytes2 = await this._blockstore.get(cid)
    return { cid, bytes: bytes2 }
  }
  blocks() {
    return this._blockstore.blocks()
  }
  async *cids() {
    for await (const b of this.blocks()) {
      yield b.cid
    }
  }
}

// node_modules/nft.storage/src/token.js
var Token2 = class {
  constructor(ipnft, url, data) {
    this.ipnft = ipnft
    this.url = url
    this.data = data
    Object.defineProperties(this, {
      ipnft: { enumerable: true, writable: false },
      url: { enumerable: true, writable: false },
      data: { enumerable: false, writable: false },
    })
  }
  embed() {
    return Token2.embed(this)
  }
  static embed({ data }) {
    return embed(data, { gateway: GATEWAY })
  }
  static async encode(input) {
    const blockstore = new Blockstore()
    const [blobs, meta] = mapTokenInputBlobs(input)
    const data = JSON.parse(JSON.stringify(meta))
    const dag = JSON.parse(JSON.stringify(meta))
    for (const [dotPath, blob2] of blobs.entries()) {
      const name6 = blob2.name || 'blob'
      const content = blob2.stream()
      const { root: cid } = await pack({
        input: [{ path: name6, content }],
        blockstore,
        wrapWithDirectory: true,
      })
      const href = new URL(`ipfs://${cid}/${name6}`)
      const path = dotPath.split('.')
      setIn(data, path, href)
      setIn(dag, path, cid)
    }
    const { root: metadataJsonCid } = await pack({
      input: [{ path: 'metadata.json', content: JSON.stringify(data) }],
      blockstore,
      wrapWithDirectory: false,
    })
    const block = await encode6({
      value: {
        ...dag,
        'metadata.json': metadataJsonCid,
        type: 'nft',
      },
      codec: esm_exports2,
      hasher: sha256,
    })
    await blockstore.put(block.cid, block.bytes)
    return {
      cid: block.cid,
      token: new Token2(
        block.cid.toString(),
        `ipfs://${block.cid}/metadata.json`,
        data
      ),
      car: new BlockstoreCarReader(1, [block.cid], blockstore),
    }
  }
}
var embed = (input, options) => mapWith(input, isURL, embedURL, options)
var isURL = (value) => value instanceof URL
var embedURL = (context, url) => [context, toGatewayURL(url, context)]
var isObject = (value) => typeof value === 'object' && value != null
var encodeBlob = (data, blob2, path) => {
  data.set(path.join('.'), blob2)
  return [data, void 0]
}
var isBlob3 = (value) => value instanceof Blob2
var mapTokenInputBlobs = (input) => {
  return mapValueWith(input, isBlob3, encodeBlob, new Map(), [])
}
var mapWith = (input, p, f, state) => {
  const [, output] = mapValueWith(input, p, f, state, [])
  return output
}
var mapValueWith = (input, p, f, state, path) =>
  p(input, state, path)
    ? f(state, input, path)
    : Array.isArray(input)
    ? mapArrayWith(input, p, f, state, path)
    : isObject(input)
    ? mapObjectWith(input, p, f, state, path)
    : [state, input]
var mapObjectWith = (input, p, f, init, path) => {
  let state = init
  const output = {}
  for (const [key, value] of Object.entries(input)) {
    const [next, out] = mapValueWith(value, p, f, state, [...path, key])
    output[key] = out
    state = next
  }
  return [state, output]
}
var mapArrayWith = (input, p, f, init, path) => {
  const output = []
  let state = init
  for (const [index, element] of input.entries()) {
    const [next, out] = mapValueWith(element, p, f, state, [...path, index])
    output[index] = out
    state = next
  }
  return [state, output]
}
var setIn = (object, path, value) => {
  const n = path.length - 1
  let target = object
  for (let [index, key] of path.entries()) {
    if (index === n) {
      target[key] = value
    } else {
      target = target[key]
    }
  }
}

// node_modules/nft.storage/src/lib.js
var MAX_STORE_RETRIES = 5
var MAX_CONCURRENT_UPLOADS = 3
var MAX_CHUNK_SIZE = 1024 * 1024 * 10
var NFTStorage = class {
  constructor({ token, endpoint = new URL('https://api.nft.storage') }) {
    this.token = token
    this.endpoint = endpoint
  }
  static auth(token) {
    if (!token) throw new Error('missing token')
    return { Authorization: `Bearer ${token}`, 'X-Client': 'nft.storage/js' }
  }
  static async storeBlob(service, blob2) {
    const blockstore = new Blockstore()
    let cidString
    try {
      const { cid, car } = await NFTStorage.encodeBlob(blob2, { blockstore })
      await NFTStorage.storeCar(service, car)
      cidString = cid.toString()
    } finally {
      await blockstore.close()
    }
    return cidString
  }
  static async storeCar(
    { endpoint, token },
    car,
    { onStoredChunk, maxRetries, decoders } = {}
  ) {
    const url = new URL('upload/', endpoint)
    const headers = NFTStorage.auth(token)
    const targetSize = MAX_CHUNK_SIZE
    const splitter =
      car instanceof Blob2
        ? await TreewalkCarSplitter.fromBlob(car, targetSize, { decoders })
        : new TreewalkCarSplitter(car, targetSize, { decoders })
    const upload = transform(MAX_CONCURRENT_UPLOADS, async function (car2) {
      const carParts = []
      for await (const part of car2) {
        carParts.push(part)
      }
      const carFile = new Blob2(carParts, { type: 'application/car' })
      const cid = await (0, import_p_retry.default)(
        async () => {
          const response = await fetch2(url.toString(), {
            method: 'POST',
            headers,
            body: carFile,
          })
          const result = await response.json()
          if (!result.ok) {
            if (response.status === 401) {
              throw new import_p_retry.AbortError(result.error.message)
            }
            throw new Error(result.error.message)
          }
          return result.value.cid
        },
        {
          retries: maxRetries == null ? MAX_STORE_RETRIES : maxRetries,
        }
      )
      onStoredChunk && onStoredChunk(carFile.size)
      return cid
    })
    let root
    for await (const cid of upload(splitter.cars())) {
      root = cid
    }
    return root
  }
  static async storeDirectory(service, files) {
    const blockstore = new Blockstore()
    let cidString
    try {
      const { cid, car } = await NFTStorage.encodeDirectory(files, {
        blockstore,
      })
      await NFTStorage.storeCar(service, car)
      cidString = cid.toString()
    } finally {
      await blockstore.close()
    }
    return cidString
  }
  static async store(service, metadata) {
    const { token, car } = await NFTStorage.encodeNFT(metadata)
    await NFTStorage.storeCar(service, car)
    return token
  }
  static async status({ endpoint, token }, cid) {
    const url = new URL(`${cid}/`, endpoint)
    const response = await fetch2(url.toString(), {
      method: 'GET',
      headers: NFTStorage.auth(token),
    })
    const result = await response.json()
    if (result.ok) {
      return {
        cid: result.value.cid,
        deals: decodeDeals(result.value.deals),
        size: result.value.size,
        pin: decodePin(result.value.pin),
        created: new Date(result.value.created),
      }
    } else {
      throw new Error(result.error.message)
    }
  }
  static async check({ endpoint }, cid) {
    const url = new URL(`check/${cid}/`, endpoint)
    const response = await fetch2(url.toString())
    const result = await response.json()
    if (result.ok) {
      return {
        cid: result.value.cid,
        deals: decodeDeals(result.value.deals),
        pin: result.value.pin,
      }
    } else {
      throw new Error(result.error.message)
    }
  }
  static async delete({ endpoint, token }, cid) {
    const url = new URL(`${cid}/`, endpoint)
    const response = await fetch2(url.toString(), {
      method: 'DELETE',
      headers: NFTStorage.auth(token),
    })
    const result = await response.json()
    if (!result.ok) {
      throw new Error(result.error.message)
    }
  }
  static async encodeNFT(input) {
    validateERC1155(input)
    return Token2.encode(input)
  }
  static async encodeBlob(blob2, { blockstore } = {}) {
    if (blob2.size === 0) {
      throw new Error('Content size is 0, make sure to provide some content')
    }
    return packCar([{ path: 'blob', content: blob2.stream() }], {
      blockstore,
      wrapWithDirectory: false,
    })
  }
  static async encodeDirectory(files, { blockstore } = {}) {
    const input = []
    let size = 0
    for (const file2 of files) {
      input.push({ path: file2.name, content: file2.stream() })
      size += file2.size
    }
    if (size === 0) {
      throw new Error(
        'Total size of files should exceed 0, make sure to provide some content'
      )
    }
    return packCar(input, {
      blockstore,
      wrapWithDirectory: true,
    })
  }
  storeBlob(blob2) {
    return NFTStorage.storeBlob(this, blob2)
  }
  storeCar(car, options) {
    return NFTStorage.storeCar(this, car, options)
  }
  storeDirectory(files) {
    return NFTStorage.storeDirectory(this, files)
  }
  status(cid) {
    return NFTStorage.status(this, cid)
  }
  delete(cid) {
    return NFTStorage.delete(this, cid)
  }
  check(cid) {
    return NFTStorage.check(this, cid)
  }
  store(token) {
    return NFTStorage.store(this, token)
  }
}
var validateERC1155 = ({ name: name6, description, image, decimals }) => {
  if (typeof name6 !== 'string') {
    throw new TypeError(
      'string property `name` identifying the asset is required'
    )
  }
  if (typeof description !== 'string') {
    throw new TypeError(
      'string property `description` describing asset is required'
    )
  }
  if (!(image instanceof Blob2)) {
    throw new TypeError('property `image` must be a Blob or File object')
  } else if (!image.type.startsWith('image/')) {
    console.warn(`According to ERC721 Metadata JSON Schema 'image' must have 'image/*' mime type.

For better interoperability we would highly recommend storing content with different mime type under 'properties' namespace e.g. \`properties: { video: file }\` and using 'image' field for storing a preview image for it instead.

For more context please see ERC-721 specification https://eips.ethereum.org/EIPS/eip-721`)
  }
  if (typeof decimals !== 'undefined' && typeof decimals !== 'number') {
    throw new TypeError('property `decimals` must be an integer value')
  }
}
var packCar = async (input, { blockstore, wrapWithDirectory } = {}) => {
  blockstore = blockstore || new Blockstore()
  const { root: cid } = await pack({ input, blockstore, wrapWithDirectory })
  const car = new BlockstoreCarReader(1, [cid], blockstore)
  return { cid, car }
}
var decodeDeals = (deals) =>
  deals.map((deal) => {
    const { dealActivation, dealExpiration, lastChanged } = {
      dealExpiration: null,
      dealActivation: null,
      ...deal,
    }
    return {
      ...deal,
      lastChanged: new Date(lastChanged),
      ...(dealActivation && { dealActivation: new Date(dealActivation) }),
      ...(dealExpiration && { dealExpiration: new Date(dealExpiration) }),
    }
  })
var decodePin = (pin) => ({ ...pin, created: new Date(pin.created) })

// src/platform.browser.js
var import_path_browserify = __toModule(require_path_browserify())
var file = File
var blob = Blob
var textEncoder5 = TextEncoder
var dummyFS = {
  promises: {
    readFile() {
      throw new Error('not implemented in browser')
    },
    stat() {
      throw new Error('not implemented in browser')
    },
    readdir() {
      throw new Error('not implemented in browser')
    },
  },
}

// src/metadata/schema.ts
var fileSchema = {
  type: 'object',
  properties: {
    uri: { type: 'string' },
    type: { type: 'string' },
    cdn: { type: 'boolean', nullable: true },
  },
  required: ['uri', 'type'],
}
var attributeSchema = {
  type: 'object',
  properties: {
    trait_type: { type: 'string' },
    value: {
      anyOf: [{ type: 'string' }, { type: 'number' }],
    },
    display_type: {
      type: 'string',
      nullable: true,
    },
    max_value: {
      type: 'number',
      nullable: true,
    },
    trait_count: {
      type: 'number',
      nullable: true,
    },
  },
  required: ['trait_type', 'value'],
}
var creatorSchema = {
  type: 'object',
  properties: {
    address: { type: 'string' },
    share: { type: 'number' },
  },
  required: ['address', 'share'],
}
var metadataSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    symbol: { type: 'string', nullable: true },
    description: { type: 'string', nullable: true },
    seller_fee_basis_points: { type: 'number', nullable: true },
    image: { type: 'string' },
    animation_url: { type: 'string', nullable: true },
    external_url: { type: 'string', nullable: true },
    attributes: {
      type: 'array',
      nullable: true,
      items: attributeSchema,
    },
    properties: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: fileSchema,
        },
        category: { type: 'string', nullable: true },
        creators: {
          type: 'array',
          items: creatorSchema,
          nullable: true,
        },
      },
      additionalProperties: true,
      required: ['files'],
    },
    collection: {
      type: 'object',
      nullable: true,
      properties: {
        name: { type: 'string' },
        family: { type: 'string' },
      },
      required: ['name', 'family'],
    },
  },
  required: ['name', 'image', 'properties'],
}

// src/metadata/validate.ts
var import_ajv = __toModule(require_ajv())
var ajv = new import_ajv.default()
var validateMetadata = ajv.compile(metadataSchema)
function ensureValidMetadata(m) {
  if (!validateMetadata(m)) {
    throw new ValidationError(validateMetadata.errors)
  }
  return m
}
var ValidationError = class extends Error {
  constructor(errors) {
    const messages = []
    for (const err of errors) {
      switch (err.keyword) {
        case 'required':
          messages.push(
            `- required property ${err.params.missingProperty} missing`
          )
          break
        case 'propertyNames':
          messages.push(`- invalid property name: ${err.params.propertyName}`)
          break
        default:
          messages.push(err.message || 'unknown error')
      }
    }
    const message = 'metadata had validation errors: \n' + messages.join('\n')
    super(message)
    this.errors = errors
  }
}

// src/utils.ts
var DEFAULT_GATEWAY_HOST = 'https://nftstorage.link'
var isBrowser =
  typeof window !== 'undefined' && typeof window.document !== 'undefined'
function makeGatewayURL(cid, path, host = DEFAULT_GATEWAY_HOST) {
  let pathPrefix = `/ipfs/${cid}`
  if (path) {
    pathPrefix += '/'
  }
  host = host || DEFAULT_GATEWAY_HOST
  const base3 = new URL(pathPrefix, host)
  const u = new URL(path, base3)
  return u.toString()
}
function makeIPFSURI(cid, path) {
  const u = new URL(path, `ipfs://${cid}/`)
  return u.toString()
}

// src/nft/prepare.ts
async function prepareMetaplexNFT(metadata, imageFile, opts = {}) {
  const metaplexMetadata = opts.validateSchema
    ? ensureValidMetadata(metadata)
    : metadata
  const additionalAssetFiles = opts.additionalAssetFiles || []
  const blockstore = opts.blockstore || new MemoryBlockStore()
  const assetFiles = [imageFile, ...additionalAssetFiles]
  const encodedAssets = await NFTStorage.encodeDirectory(assetFiles, {
    blockstore,
  })
  const imageFilename = imageFile.name || 'image.png'
  const additionalFilenames = additionalAssetFiles.map((f) => f.name)
  const linkedMetadata = replaceFileRefsWithIPFSLinks(
    metaplexMetadata,
    imageFilename,
    additionalFilenames,
    encodedAssets.cid.toString(),
    opts.gatewayHost
  )
  const metadataFile = new file(
    [JSON.stringify(linkedMetadata)],
    'metadata.json'
  )
  const encodedMetadata = await NFTStorage.encodeDirectory([metadataFile], {
    blockstore,
  })
  const metadataGatewayURL = makeGatewayURL(
    encodedMetadata.cid.toString(),
    'metadata.json',
    opts.gatewayHost
  )
  const metadataURI = makeIPFSURI(
    encodedMetadata.cid.toString(),
    'metadata.json'
  )
  return {
    metadata: linkedMetadata,
    encodedMetadata,
    encodedAssets,
    metadataGatewayURL,
    metadataURI,
    blockstore,
  }
}
function replaceFileRefsWithIPFSLinks(
  metadata,
  imageFilename,
  additionalFilenames,
  assetRootCID,
  gatewayHost
) {
  const imageGatewayURL = makeGatewayURL(
    assetRootCID,
    imageFilename,
    gatewayHost
  )
  const properties = metadata.properties || {}
  const originalFiles = properties.files || []
  const files = originalFiles.flatMap((f) => {
    if (f.uri === imageFilename || additionalFilenames.includes(f.uri)) {
      return [
        {
          ...f,
          uri: makeGatewayURL(assetRootCID, f.uri, gatewayHost),
          cdn: true,
        },
        {
          ...f,
          uri: makeIPFSURI(assetRootCID, f.uri),
          cdn: false,
        },
      ]
    }
    return [f]
  })
  let animation_url = metadata.animation_url
  if (animation_url && additionalFilenames.includes(animation_url)) {
    animation_url = makeGatewayURL(assetRootCID, animation_url, gatewayHost)
  }
  return {
    ...metadata,
    image: imageGatewayURL,
    animation_url,
    properties: {
      ...metadata.properties,
      files,
    },
  }
}

// src/nft/load.ts
async function loadNFTFromFilesystem(
  metadataFilePath,
  imageFilePath,
  opts = {}
) {
  if (isBrowser) {
    throw new Error('loadNFTFromFilesystem is only supported on node.js')
  }
  const metadataContent = await dummyFS.promises.readFile(metadataFilePath, {
    encoding: 'utf-8',
  })
  const metadataJSON = JSON.parse(metadataContent)
  const metadata = opts.validateSchema
    ? ensureValidMetadata(metadataJSON)
    : metadataJSON
  const parentDir = import_path_browserify.default.dirname(metadataFilePath)
  if (!imageFilePath) {
    const pathFromMetadata = import_path_browserify.default.resolve(
      parentDir,
      metadata.image
    )
    if (metadata.image && (await fileExists(pathFromMetadata))) {
      imageFilePath = pathFromMetadata
    } else {
      const basename = import_path_browserify.default.basename(
        metadataFilePath,
        '.json'
      )
      const pathFromMetadataFilename = import_path_browserify.default.resolve(
        parentDir,
        basename + '.png'
      )
      if (await fileExists(pathFromMetadataFilename)) {
        imageFilePath = pathFromMetadataFilename
      }
    }
  }
  if (!imageFilePath) {
    throw new Error(`unable to determine path to image.`)
  }
  const imageFile = await fileFromPath(imageFilePath, parentDir)
  const additionalFilePaths = new Set()
  const properties = metadata.properties || {}
  const files = properties.files || []
  for (const f of files) {
    const filepath = import_path_browserify.default.resolve(parentDir, f.uri)
    if (await fileExists(filepath)) {
      additionalFilePaths.add(filepath)
    }
  }
  additionalFilePaths.delete(
    import_path_browserify.default.basename(imageFilePath)
  )
  const additionalFilePromises = [...additionalFilePaths].map((p) =>
    fileFromPath(p, parentDir)
  )
  const additionalAssetFiles = await Promise.all(additionalFilePromises)
  return prepareMetaplexNFT(metadata, imageFile, {
    additionalAssetFiles,
    blockstore: opts.blockstore,
    gatewayHost: opts.gatewayHost,
    validateSchema: opts.validateSchema,
  })
}
async function* loadAllNFTsFromDirectory(directoryPath, opts = {}) {
  for await (const filename of walk(directoryPath)) {
    if (!filename.endsWith('.json')) {
      continue
    }
    const nft = await loadNFTFromFilesystem(filename, void 0, opts)
    yield nft
  }
}
async function fileFromPath(filepath, rootDir = '') {
  const content = await dummyFS.promises.readFile(filepath)
  const filename = import_path_browserify.default.relative(rootDir, filepath)
  return new File2([content], filename)
}
async function fileExists(filepath) {
  if (isBrowser) {
    return false
  }
  try {
    await dummyFS.promises.stat(filepath)
    return true
  } catch (e) {
    return false
  }
}
async function* walk(dir) {
  if (isBrowser) {
    return
  }
  const files = await dummyFS.promises.readdir(dir)
  for (const file2 of files) {
    const stat = await dummyFS.promises.stat(
      import_path_browserify.default.join(dir, file2)
    )
    if (stat.isDirectory()) {
      for await (const filename of walk(
        import_path_browserify.default.join(dir, file2)
      )) {
        yield filename
      }
    } else {
      yield import_path_browserify.default.join(dir, file2)
    }
  }
}

// src/nft/bundle.ts
init_sha2_browser()

// src/nft/bs-car-reader.js
var BlockstoreCarReader2 = class {
  constructor(version2, roots, blockstore) {
    this._version = version2
    this._roots = roots
    this._blockstore = blockstore
  }
  get version() {
    return this._version
  }
  get blockstore() {
    return this._blockstore
  }
  async getRoots() {
    return this._roots
  }
  has(cid) {
    return this._blockstore.has(cid)
  }
  async get(cid) {
    const bytes2 = await this._blockstore.get(cid)
    return { cid, bytes: bytes2 }
  }
  blocks() {
    return this._blockstore.blocks()
  }
  async *cids() {
    for await (const b of this.blocks()) {
      yield b.cid
    }
  }
}

// src/nft/bundle.ts
var _NFTBundle = class {
  constructor(opts = {}) {
    this._blockstore = opts.blockstore || new MemoryBlockStore()
    this._nfts = {}
  }
  async addNFT(id, metadata, imageFile, opts = {}) {
    this._enforceMaxEntries()
    this._enforceMaxIdLength(id)
    const nft = await prepareMetaplexNFT(metadata, imageFile, {
      ...opts,
      blockstore: this._blockstore,
    })
    this._addManifestEntry(id, nft)
    return nft
  }
  async addNFTFromFileSystem(metadataFilePath, imageFilePath, opts = {}) {
    this._enforceMaxEntries()
    let id = opts.id
    if (!id) {
      id = import_path_browserify.default.basename(metadataFilePath, '.json')
    }
    this._enforceMaxIdLength(id)
    const nft = await loadNFTFromFilesystem(metadataFilePath, imageFilePath, {
      ...opts,
      blockstore: this._blockstore,
    })
    this._addManifestEntry(id, nft)
    return nft
  }
  _enforceMaxEntries() {
    if (Object.keys(this._nfts).length >= _NFTBundle.MAX_ENTRIES) {
      throw new Error(
        `unable to add more than ${_NFTBundle.MAX_ENTRIES} to a bundle.`
      )
    }
  }
  _enforceMaxIdLength(id) {
    const len = new textEncoder5().encode(id).byteLength
    if (len > _NFTBundle.MAX_ID_LEN) {
      throw new Error(
        `NFT id exceeds max length (${_NFTBundle.MAX_ID_LEN} bytes): ${id}`
      )
    }
  }
  _addManifestEntry(id, nft) {
    if (id in this._nfts) {
      throw new Error(
        `duplicate id in bundle: an entry with id "${id}" has already been added.`
      )
    }
    this._nfts[id] = nft
  }
  manifest() {
    return { ...this._nfts }
  }
  async makeRootBlock() {
    let links2 = []
    for (const [id, nft] of Object.entries(this._nfts)) {
      const dir = await wrapperDirForNFT(nft)
      const link = createLink(id, dir.bytes.byteLength, dir.cid)
      await this._blockstore.put(dir.cid, dir.bytes)
      links2.push(link)
    }
    return makeDirectoryBlock(links2)
  }
  async getRawSize() {
    let size = 0
    for await (const block of this._blockstore.blocks()) {
      size += block.bytes.byteLength
    }
    return size
  }
  async asCAR() {
    const rootBlock = await this.makeRootBlock()
    await this._blockstore.put(rootBlock.cid, rootBlock.bytes)
    const car = new BlockstoreCarReader2(1, [rootBlock.cid], this._blockstore)
    const cid = rootBlock.cid
    return { car, cid }
  }
}
var NFTBundle = _NFTBundle
NFTBundle.MAX_ENTRIES = 2200
NFTBundle.MAX_ID_LEN = 64
async function wrapperDirForNFT(nft) {
  const metadataBlock = await nft.encodedMetadata.car.get(
    nft.encodedMetadata.cid
  )
  const assetsBlock = await nft.encodedAssets.car.get(nft.encodedAssets.cid)
  if (!metadataBlock || !assetsBlock) {
    throw new Error(`invalid PackagedNFT: missing root blocks`)
  }
  const metadataLink = createLink(
    'metadata',
    metadataBlock.bytes.byteLength,
    nft.encodedMetadata.cid
  )
  const assetsLink = createLink(
    'assets',
    assetsBlock.bytes.byteLength,
    nft.encodedAssets.cid
  )
  return makeDirectoryBlock([assetsLink, metadataLink])
}
async function makeDirectoryBlock(links2) {
  const data = new UnixFS({ type: 'directory' }).marshal()
  const value = createNode(data, links2)
  return encode6({ value, codec: src_exports, hasher: sha256 })
}

// src/upload.ts
var DEFAULT_ENDPOINT = new URL('https://api.nft.storage')
var NFTStorageMetaplexor = class {
  static init() {
    if (this._initialized) {
      return
    }
    NFTStorage.auth = (token) => ({
      'x-web3auth': `Metaplex ${token}`,
    })
    this._initialized = true
  }
  constructor({ auth, endpoint }) {
    this.auth = auth
    this.endpoint = endpoint || DEFAULT_ENDPOINT
  }
  static withSecretKey(key, opts) {
    const { solanaCluster, mintingAgent, agentVersion, endpoint } = opts
    const auth = MetaplexAuthWithSecretKey(key, {
      solanaCluster,
      mintingAgent,
      agentVersion,
    })
    return new NFTStorageMetaplexor({ auth, endpoint })
  }
  static withSigner(signMessage, publicKey, opts) {
    const { solanaCluster, mintingAgent, agentVersion, endpoint } = opts
    const auth = MetaplexAuthWithSigner(signMessage, publicKey, {
      solanaCluster,
      mintingAgent,
      agentVersion,
    })
    return new NFTStorageMetaplexor({ auth, endpoint })
  }
  static async storeBlob(context, blob2) {
    this.init()
    const { cid, car } = await NFTStorage.encodeBlob(blob2)
    return this.storeCar(context, cid, car)
  }
  static async storeDirectory(context, files) {
    this.init()
    const { cid, car } = await NFTStorage.encodeDirectory(files)
    return this.storeCar(context, cid, car)
  }
  static async storeCar(context, cid, car, opts) {
    this.init()
    const { auth } = context
    const baseEndpoint = context.endpoint || DEFAULT_ENDPOINT
    const endpoint = new URL('/metaplex/', baseEndpoint)
    const token = await makeMetaplexUploadToken(auth, cid.toString())
    return NFTStorage.storeCar({ endpoint, token }, car, opts)
  }
  static async storePreparedNFT(context, nft, opts) {
    this.init()
    const metadataRootCID = await this.storeCar(
      context,
      nft.encodedMetadata.cid,
      nft.encodedMetadata.car,
      opts
    )
    const assetRootCID = await this.storeCar(
      context,
      nft.encodedAssets.cid,
      nft.encodedAssets.car,
      opts
    )
    const { metadataGatewayURL, metadataURI } = nft
    return {
      metadataRootCID,
      assetRootCID,
      metadataGatewayURL,
      metadataURI,
      metadata: nft.metadata,
    }
  }
  static async storeNFTFromFilesystem(
    context,
    metadataFilePath,
    imageFilePath,
    opts = {}
  ) {
    if (isBrowser) {
      throw new Error(`storeNFTFromFilesystem is only available on node.js`)
    }
    const nft = await loadNFTFromFilesystem(
      metadataFilePath,
      imageFilePath,
      opts
    )
    return this.storePreparedNFT(context, nft, opts.storeCarOptions)
  }
  async storeBlob(blob2) {
    const { cid, car } = await NFTStorage.encodeBlob(blob2)
    return NFTStorageMetaplexor.storeCar(this, cid, car)
  }
  async storeCar(cid, car, opts) {
    return NFTStorageMetaplexor.storeCar(this, cid, car, opts)
  }
  async storeDirectory(files) {
    return NFTStorageMetaplexor.storeDirectory(this, files)
  }
  async storePreparedNFT(nft, opts) {
    return NFTStorageMetaplexor.storePreparedNFT(this, nft, opts)
  }
  async storeNFTFromFilesystem(metadataFilePath, imageFilePath, opts = {}) {
    return NFTStorageMetaplexor.storeNFTFromFilesystem(
      this,
      metadataFilePath,
      imageFilePath,
      opts
    )
  }
}
export {
  blob as Blob,
  file as File,
  MetaplexAuthWithSecretKey,
  MetaplexAuthWithSigner,
  NFTBundle,
  NFTStorageMetaplexor,
  TagChain,
  TagMintingAgent,
  TagMintingAgentVersion,
  TagSolanaCluster,
  ValidationError,
  ensureValidMetadata,
  keyDID,
  loadAllNFTsFromDirectory,
  loadNFTFromFilesystem,
  makeMetaplexUploadToken,
  metadataSchema,
  prepareMetaplexNFT,
  validateMetadata,
}
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
/** @license URI.js v4.4.1 (c) 2011 Gary Court. License: http://github.com/garycourt/uri-js */
