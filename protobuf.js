(function (c, d) {
  if (typeof define === "function" && (define.amd || define.cmd)) {
    define(d);
  } else {
    if (
      typeof require === "function" &&
      typeof module === "object" &&
      module &&
      module.exports
    ) {
      module.exports = d(true);
    } else {
      c.RongIMLib = c.RongIMLib || {
        RongIMClient: {}
      };
      c.RongIMLib.RongIMClient.Protobuf = d();
    }
  }
})(window, function (a) {
  var d = (function () {
    function E(an, ap, ao) {
      this.low = an | 0;
      this.high = ap | 0;
      this.unsigned = !!ao;
    }
    E.prototype.__isLong__;
    Object.defineProperty(E.prototype, "__isLong__", {
      value: true,
      enumerable: false,
      configurable: false,
    });

    function k(an) {
      return (an && an.__isLong__) === true;
    }
    E.isLong = k;
    var aa = {};
    var M = {};

    function ah(ap, ao) {
      var aq, ar, an;
      if (ao) {
        ap >>>= 0;
        if ((an = 0 <= ap && ap < 256)) {
          ar = M[ap];
          if (ar) {
            return ar;
          }
        }
        aq = S(ap, (ap | 0) < 0 ? -1 : 0, true);
        if (an) {
          M[ap] = aq;
        }
        return aq;
      } else {
        ap |= 0;
        if ((an = -128 <= ap && ap < 128)) {
          ar = aa[ap];
          if (ar) {
            return ar;
          }
        }
        aq = S(ap, ap < 0 ? -1 : 0, false);
        if (an) {
          aa[ap] = aq;
        }
        return aq;
      }
    }
    E.fromInt = ah;

    function q(ao, an) {
      if (isNaN(ao) || !isFinite(ao)) {
        return an ? m : F;
      }
      if (an) {
        if (ao < 0) {
          return m;
        }
        if (ao >= h) {
          return D;
        }
      } else {
        if (ao <= -C) {
          return T;
        }
        if (ao + 1 >= C) {
          return b;
        }
      }
      if (ao < 0) {
        return q(-ao, an).neg();
      }
      return S(ao % i | 0, (ao / i) | 0, an);
    }
    E.fromNumber = q;

    function S(an, ap, ao) {
      return new E(an, ap, ao);
    }
    E.fromBits = S;
    var B = Math.pow;

    function L(ar, ap, at) {
      if (ar.length === 0) {
        throw Error("empty string");
      }
      if (
        ar === "NaN" ||
        ar === "Infinity" ||
        ar === "+Infinity" ||
        ar === "-Infinity"
      ) {
        return F;
      }
      if (typeof ap === "number") {
        (at = ap), (ap = false);
      } else {
        ap = !!ap;
      }
      at = at || 10;
      if (at < 2 || 36 < at) {
        throw RangeError("radix");
      }
      var ao;
      if ((ao = ar.indexOf("-")) > 0) {
        throw Error("interior hyphen");
      } else {
        if (ao === 0) {
          return L(ar.substring(1), ap, at).neg();
        }
      }
      var av = q(B(at, 8));
      var ax = F;
      for (var aq = 0; aq < ar.length; aq += 8) {
        var aw = Math.min(8, ar.length - aq),
          au = parseInt(ar.substring(aq, aq + aw), at);
        if (aw < 8) {
          var an = q(B(at, aw));
          ax = ax.mul(an).add(q(au));
        } else {
          ax = ax.mul(av);
          ax = ax.add(q(au));
        }
      }
      ax.unsigned = ap;
      return ax;
    }
    E.fromString = L;

    function K(an) {
      if (an instanceof E) {
        return an;
      }
      if (typeof an === "number") {
        return q(an);
      }
      if (typeof an === "string") {
        return L(an);
      }
      return S(an.low, an.high, an.unsigned);
    }
    E.fromValue = K;
    var ai = 1 << 16;
    var al = 1 << 24;
    var i = ai * ai;
    var h = i * i;
    var C = h / 2;
    var u = ah(al);
    var F = ah(0);
    E.ZERO = F;
    var m = ah(0, true);
    E.UZERO = m;
    var W = ah(1);
    E.ONE = W;
    var O = ah(1, true);
    E.UONE = O;
    var f = ah(-1);
    E.NEG_ONE = f;
    var b = S(4294967295 | 0, 2147483647 | 0, false);
    E.MAX_VALUE = b;
    var D = S(4294967295 | 0, 4294967295 | 0, true);
    E.MAX_UNSIGNED_VALUE = D;
    var T = S(0, 2147483648 | 0, false);
    E.MIN_VALUE = T;
    var z = E.prototype;
    z.toInt = function v() {
      return this.unsigned ? this.low >>> 0 : this.low;
    };
    z.toNumber = function ae() {
      if (this.unsigned) {
        return (this.high >>> 0) * i + (this.low >>> 0);
      }
      return this.high * i + (this.low >>> 0);
    };
    z.toString = function n(at) {
      at = at || 10;
      if (at < 2 || 36 < at) {
        throw RangeError("radix");
      }
      if (this.isZero()) {
        return "0";
      }
      if (this.isNegative()) {
        if (this.eq(T)) {
          var aq = q(at),
            an = this.div(aq),
            ap = an.mul(aq).sub(this);
          return an.toString(at) + ap.toInt().toString(at);
        } else {
          return "-" + this.neg().toString(at);
        }
      }
      var aw = q(B(at, 6), this.unsigned),
        av = this;
      var ax = "";
      while (true) {
        var au = av.div(aw),
          ar = av.sub(au.mul(aw)).toInt() >>> 0,
          ao = ar.toString(at);
        av = au;
        if (av.isZero()) {
          return ao + ax;
        } else {
          while (ao.length < 6) {
            ao = "0" + ao;
          }
          ax = "" + ao + ax;
        }
      }
    };
    z.getHighBits = function af() {
      return this.high;
    };
    z.getHighBitsUnsigned = function p() {
      return this.high >>> 0;
    };
    z.getLowBits = function y() {
      return this.low;
    };
    z.getLowBitsUnsigned = function U() {
      return this.low >>> 0;
    };
    z.getNumBitsAbs = function aj() {
      if (this.isNegative()) {
        return this.eq(T) ? 64 : this.neg().getNumBitsAbs();
      }
      var ao = this.high != 0 ? this.high : this.low;
      for (var an = 31; an > 0; an--) {
        if ((ao & (1 << an)) != 0) {
          break;
        }
      }
      return this.high != 0 ? an + 33 : an + 1;
    };
    z.isZero = function R() {
      return this.high === 0 && this.low === 0;
    };
    z.isNegative = function X() {
      return !this.unsigned && this.high < 0;
    };
    z.isPositive = function ad() {
      return this.unsigned || this.high >= 0;
    };
    z.isOdd = function V() {
      return (this.low & 1) === 1;
    };
    z.isEven = function x() {
      return (this.low & 1) === 0;
    };
    z.equals = function N(an) {
      if (!k(an)) {
        an = K(an);
      }
      if (
        this.unsigned !== an.unsigned &&
        this.high >>> 31 === 1 &&
        an.high >>> 31 === 1
      ) {
        return false;
      }
      return this.high === an.high && this.low === an.low;
    };
    z.eq = z.equals;
    z.notEquals = function ag(an) {
      return !this.eq(an);
    };
    z.neq = z.notEquals;
    z.lessThan = function t(an) {
      return this.comp(an) < 0;
    };
    z.lt = z.lessThan;
    z.lessThanOrEqual = function Z(an) {
      return this.comp(an) <= 0;
    };
    z.lte = z.lessThanOrEqual;
    z.greaterThan = function o(an) {
      return this.comp(an) > 0;
    };
    z.gt = z.greaterThan;
    z.greaterThanOrEqual = function Q(an) {
      return this.comp(an) >= 0;
    };
    z.gte = z.greaterThanOrEqual;
    z.compare = function s(ao) {
      if (!k(ao)) {
        ao = K(ao);
      }
      if (this.eq(ao)) {
        return 0;
      }
      var an = this.isNegative(),
        ap = ao.isNegative();
      if (an && !ap) {
        return -1;
      }
      if (!an && ap) {
        return 1;
      }
      if (!this.unsigned) {
        return this.sub(ao).isNegative() ? -1 : 1;
      }
      return ao.high >>> 0 > this.high >>> 0 ||
        (ao.high === this.high && ao.low >>> 0 > this.low >>> 0) ?
        -1 :
        1;
    };
    z.comp = z.compare;
    z.negate = function w() {
      if (!this.unsigned && this.eq(T)) {
        return T;
      }
      return this.not().add(W);
    };
    z.neg = z.negate;
    z.add = function j(aq) {
      if (!k(aq)) {
        aq = K(aq);
      }
      var au = this.high >>> 16;
      var ao = this.high & 65535;
      var aw = this.low >>> 16;
      var ap = this.low & 65535;
      var ay = aq.high >>> 16;
      var ar = aq.high & 65535;
      var az = aq.low >>> 16;
      var at = aq.low & 65535;
      var aA = 0,
        av = 0,
        an = 0,
        ax = 0;
      ax += ap + at;
      an += ax >>> 16;
      ax &= 65535;
      an += aw + az;
      av += an >>> 16;
      an &= 65535;
      av += ao + ar;
      aA += av >>> 16;
      av &= 65535;
      aA += au + ay;
      aA &= 65535;
      return S((an << 16) | ax, (aA << 16) | av, this.unsigned);
    };
    z.subtract = function r(an) {
      if (!k(an)) {
        an = K(an);
      }
      return this.add(an.neg());
    };
    z.sub = z.subtract;
    z.multiply = function I(az) {
      if (this.isZero()) {
        return F;
      }
      if (!k(az)) {
        az = K(az);
      }
      if (az.isZero()) {
        return F;
      }
      if (this.eq(T)) {
        return az.isOdd() ? T : F;
      }
      if (az.eq(T)) {
        return this.isOdd() ? T : F;
      }
      if (this.isNegative()) {
        if (az.isNegative()) {
          return this.neg().mul(az.neg());
        } else {
          return this.neg()
            .mul(az)
            .neg();
        }
      } else {
        if (az.isNegative()) {
          return this.mul(az.neg()).neg();
        }
      }
      if (this.lt(u) && az.lt(u)) {
        return q(this.toNumber() * az.toNumber(), this.unsigned);
      }
      var at = this.high >>> 16;
      var ao = this.high & 65535;
      var av = this.low >>> 16;
      var ap = this.low & 65535;
      var ax = az.high >>> 16;
      var aq = az.high & 65535;
      var ay = az.low >>> 16;
      var ar = az.low & 65535;
      var aA = 0,
        au = 0,
        an = 0,
        aw = 0;
      aw += ap * ar;
      an += aw >>> 16;
      aw &= 65535;
      an += av * ar;
      au += an >>> 16;
      an &= 65535;
      an += ap * ay;
      au += an >>> 16;
      an &= 65535;
      au += ao * ar;
      aA += au >>> 16;
      au &= 65535;
      au += av * ay;
      aA += au >>> 16;
      au &= 65535;
      au += ap * aq;
      aA += au >>> 16;
      au &= 65535;
      aA += at * ar + ao * ay + av * aq + ap * ax;
      aA &= 65535;
      return S((an << 16) | aw, (aA << 16) | au, this.unsigned);
    };
    z.mul = z.multiply;
    z.divide = function J(an) {
      if (!k(an)) {
        an = K(an);
      }
      if (an.isZero()) {
        throw Error("division by zero");
      }
      if (this.isZero()) {
        return this.unsigned ? m : F;
      }
      var at, av, aq;
      if (!this.unsigned) {
        if (this.eq(T)) {
          if (an.eq(W) || an.eq(f)) {
            return T;
          } else {
            if (an.eq(T)) {
              return W;
            } else {
              var ao = this.shr(1);
              at = ao.div(an).shl(1);
              if (at.eq(F)) {
                return an.isNegative() ? W : f;
              } else {
                av = this.sub(an.mul(at));
                aq = at.add(av.div(an));
                return aq;
              }
            }
          }
        } else {
          if (an.eq(T)) {
            return this.unsigned ? m : F;
          }
        }
        if (this.isNegative()) {
          if (an.isNegative()) {
            return this.neg().div(an.neg());
          }
          return this.neg()
            .div(an)
            .neg();
        } else {
          if (an.isNegative()) {
            return this.div(an.neg()).neg();
          }
        }
        aq = F;
      } else {
        if (!an.unsigned) {
          an = an.toUnsigned();
        }
        if (an.gt(this)) {
          return m;
        }
        if (an.gt(this.shru(1))) {
          return O;
        }
        aq = m;
      }
      av = this;
      while (av.gte(an)) {
        at = Math.max(1, Math.floor(av.toNumber() / an.toNumber()));
        var aw = Math.ceil(Math.log(at) / Math.LN2),
          au = aw <= 48 ? 1 : B(2, aw - 48),
          ap = q(at),
          ar = ap.mul(an);
        while (ar.isNegative() || ar.gt(av)) {
          at -= au;
          ap = q(at, this.unsigned);
          ar = ap.mul(an);
        }
        if (ap.isZero()) {
          ap = W;
        }
        aq = aq.add(ap);
        av = av.sub(ar);
      }
      return aq;
    };
    z.div = z.divide;
    z.modulo = function ak(an) {
      if (!k(an)) {
        an = K(an);
      }
      return this.sub(this.div(an).mul(an));
    };
    z.mod = z.modulo;
    z.not = function ac() {
      return S(~this.low, ~this.high, this.unsigned);
    };
    z.and = function ab(an) {
      if (!k(an)) {
        an = K(an);
      }
      return S(this.low & an.low, this.high & an.high, this.unsigned);
    };
    z.or = function P(an) {
      if (!k(an)) {
        an = K(an);
      }
      return S(this.low | an.low, this.high | an.high, this.unsigned);
    };
    z.xor = function Y(an) {
      if (!k(an)) {
        an = K(an);
      }
      return S(this.low ^ an.low, this.high ^ an.high, this.unsigned);
    };
    z.shiftLeft = function A(an) {
      if (k(an)) {
        an = an.toInt();
      }
      if ((an &= 63) === 0) {
        return this;
      } else {
        if (an < 32) {
          return S(
            this.low << an,
            (this.high << an) | (this.low >>> (32 - an)),
            this.unsigned
          );
        } else {
          return S(0, this.low << (an - 32), this.unsigned);
        }
      }
    };
    z.shl = z.shiftLeft;
    z.shiftRight = function l(an) {
      if (k(an)) {
        an = an.toInt();
      }
      if ((an &= 63) === 0) {
        return this;
      } else {
        if (an < 32) {
          return S(
            (this.low >>> an) | (this.high << (32 - an)),
            this.high >> an,
            this.unsigned
          );
        } else {
          return S(
            this.high >> (an - 32),
            this.high >= 0 ? 0 : -1,
            this.unsigned
          );
        }
      }
    };
    z.shr = z.shiftRight;
    z.shiftRightUnsigned = function G(ap) {
      if (k(ap)) {
        ap = ap.toInt();
      }
      ap &= 63;
      if (ap === 0) {
        return this;
      } else {
        var ao = this.high;
        if (ap < 32) {
          var an = this.low;
          return S((an >>> ap) | (ao << (32 - ap)), ao >>> ap, this.unsigned);
        } else {
          if (ap === 32) {
            return S(ao, 0, this.unsigned);
          } else {
            return S(ao >>> (ap - 32), 0, this.unsigned);
          }
        }
      }
    };
    z.shru = z.shiftRightUnsigned;
    z.toSigned = function am() {
      if (!this.unsigned) {
        return this;
      }
      return S(this.low, this.high, false);
    };
    z.toUnsigned = function H() {
      if (this.unsigned) {
        return this;
      }
      return S(this.low, this.high, true);
    };
    z.toBytes = function (an) {
      return an ? this.toBytesLE() : this.toBytesBE();
    };
    z.toBytesLE = function () {
      var an = this.high,
        ao = this.low;
      return [
        ao & 255,
        (ao >>> 8) & 255,
        (ao >>> 16) & 255,
        (ao >>> 24) & 255,
        an & 255,
        (an >>> 8) & 255,
        (an >>> 16) & 255,
        (an >>> 24) & 255,
      ];
    };
    z.toBytesBE = function () {
      var an = this.high,
        ao = this.low;
      return [
        (an >>> 24) & 255,
        (an >>> 16) & 255,
        (an >>> 8) & 255,
        an & 255,
        (ao >>> 24) & 255,
        (ao >>> 16) & 255,
        (ao >>> 8) & 255,
        ao & 255,
      ];
    };
    return E;
  })();
  var c = (function (k) {
    var n = function (q, s, r) {
      if (typeof q === "undefined") {
        q = n.DEFAULT_CAPACITY;
      }
      if (typeof s === "undefined") {
        s = n.DEFAULT_ENDIAN;
      }
      if (typeof r === "undefined") {
        r = n.DEFAULT_NOASSERT;
      }
      if (!r) {
        q = q | 0;
        if (q < 0) {
          throw RangeError("Illegal capacity");
        }
        s = !!s;
        r = !!r;
      }
      this.buffer = q === 0 ? p : new ArrayBuffer(q);
      this.view = q === 0 ? null : new Uint8Array(this.buffer);
      this.offset = 0;
      this.markedOffset = -1;
      this.limit = q;
      this.littleEndian = s;
      this.noAssert = r;
    };
    n.VERSION = "5.0.1";
    n.LITTLE_ENDIAN = true;
    n.BIG_ENDIAN = false;
    n.DEFAULT_CAPACITY = 16;
    n.DEFAULT_ENDIAN = n.BIG_ENDIAN;
    n.DEFAULT_NOASSERT = false;
    n.Long = k || null;
    var l = n.prototype;
    l.__isByteBuffer__;
    Object.defineProperty(l, "__isByteBuffer__", {
      value: true,
      enumerable: false,
      configurable: false,
    });
    var p = new ArrayBuffer(0);
    var m = String.fromCharCode;

    function b(r) {
      var q = 0;
      return function () {
        return q < r.length ? r.charCodeAt(q++) : null;
      };
    }

    function f() {
      var q = [],
        r = [];
      return function () {
        if (arguments.length === 0) {
          return r.join("") + m.apply(String, q);
        }
        if (q.length + arguments.length > 1024) {
          r.push(m.apply(String, q)), (q.length = 0);
        }
        Array.prototype.push.apply(q, arguments);
      };
    }
    n.accessor = function () {
      return Uint8Array;
    };
    n.allocate = function (q, s, r) {
      return new n(q, s, r);
    };
    n.concat = function (z, s, r, y) {
      if (typeof s === "boolean" || typeof s !== "string") {
        y = r;
        r = s;
        s = undefined;
      }
      var q = 0;
      for (var w = 0, v = z.length, t; w < v; ++w) {
        if (!n.isByteBuffer(z[w])) {
          z[w] = n.wrap(z[w], s);
        }
        t = z[w].limit - z[w].offset;
        if (t > 0) {
          q += t;
        }
      }
      if (q === 0) {
        return new n(0, r, y);
      }
      var x = new n(q, r, y),
        u;
      w = 0;
      while (w < v) {
        u = z[w++];
        t = u.limit - u.offset;
        if (t <= 0) {
          continue;
        }
        x.view.set(u.view.subarray(u.offset, u.limit), x.offset);
        x.offset += t;
      }
      x.limit = x.offset;
      x.offset = 0;
      return x;
    };
    n.isByteBuffer = function (q) {
      return (q && q.__isByteBuffer__) === true;
    };
    n.type = function () {
      return ArrayBuffer;
    };
    n.wrap = function (q, s, u, t) {
      if (typeof s !== "string") {
        t = u;
        u = s;
        s = undefined;
      }
      if (typeof q === "string") {
        if (typeof s === "undefined") {
          s = "utf8";
        }
        switch (s) {
          case "base64":
            return n.fromBase64(q, u);
          case "hex":
            return n.fromHex(q, u);
          case "binary":
            return n.fromBinary(q, u);
          case "utf8":
            return n.fromUTF8(q, u);
          case "debug":
            return n.fromDebug(q, u);
          default:
            throw Error("Unsupported encoding: " + s);
        }
      }
      if (q === null || typeof q !== "object") {
        throw TypeError("Illegal buffer");
      }
      var v;
      if (n.isByteBuffer(q)) {
        v = l.clone.call(q);
        v.markedOffset = -1;
        return v;
      }
      if (q instanceof Uint8Array) {
        v = new n(0, u, t);
        if (q.length > 0) {
          v.buffer = q.buffer;
          v.offset = q.byteOffset;
          v.limit = q.byteOffset + q.byteLength;
          v.view = new Uint8Array(q.buffer);
        }
      } else {
        if (q instanceof ArrayBuffer) {
          v = new n(0, u, t);
          if (q.byteLength > 0) {
            v.buffer = q;
            v.offset = 0;
            v.limit = q.byteLength;
            v.view = q.byteLength > 0 ? new Uint8Array(q) : null;
          }
        } else {
          if (Object.prototype.toString.call(q) === "[object Array]") {
            v = new n(q.length, u, t);
            v.limit = q.length;
            for (var r = 0; r < q.length; ++r) {
              v.view[r] = q[r];
            }
          } else {
            throw TypeError("Illegal buffer");
          }
        }
      }
      return v;
    };
    l.writeBitSet = function (w, u) {
      var q = typeof u === "undefined";
      if (q) {
        u = this.offset;
      }
      if (!this.noAssert) {
        if (!(w instanceof Array)) {
          throw TypeError("Illegal BitSet: Not an array");
        }
        if (typeof u !== "number" || u % 1 !== 0) {
          throw TypeError("Illegal offset: " + u + " (not an integer)");
        }
        u >>>= 0;
        if (u < 0 || u + 0 > this.buffer.byteLength) {
          throw RangeError(
            "Illegal offset: 0 <= " +
            u +
            " (+" +
            0 +
            ") <= " +
            this.buffer.byteLength
          );
        }
      }
      var r = u,
        x = w.length,
        y = x >> 3,
        v = 0,
        t;
      u += this.writeVarint32(x, u);
      while (y--) {
        t =
          (!!w[v++] & 1) |
          ((!!w[v++] & 1) << 1) |
          ((!!w[v++] & 1) << 2) |
          ((!!w[v++] & 1) << 3) |
          ((!!w[v++] & 1) << 4) |
          ((!!w[v++] & 1) << 5) |
          ((!!w[v++] & 1) << 6) |
          ((!!w[v++] & 1) << 7);
        this.writeByte(t, u++);
      }
      if (v < x) {
        var s = 0;
        t = 0;
        while (v < x) {
          t = t | ((!!w[v++] & 1) << s++);
        }
        this.writeByte(t, u++);
      }
      if (q) {
        this.offset = u;
        return this;
      }
      return u - r;
    };
    l.readBitSet = function (t) {
      var q = typeof t === "undefined";
      if (q) {
        t = this.offset;
      }
      var u = this.readVarint32(t),
        x = u.value,
        y = x >> 3,
        v = 0,
        w = [],
        s;
      t += u.length;
      while (y--) {
        s = this.readByte(t++);
        w[v++] = !!(s & 1);
        w[v++] = !!(s & 2);
        w[v++] = !!(s & 4);
        w[v++] = !!(s & 8);
        w[v++] = !!(s & 16);
        w[v++] = !!(s & 32);
        w[v++] = !!(s & 64);
        w[v++] = !!(s & 128);
      }
      if (v < x) {
        var r = 0;
        s = this.readByte(t++);
        while (v < x) {
          w[v++] = !!((s >> r++) & 1);
        }
      }
      if (q) {
        this.offset = t;
      }
      return w;
    };
    l.readBytes = function (q, t) {
      var r = typeof t === "undefined";
      if (r) {
        t = this.offset;
      }
      if (!this.noAssert) {
        if (typeof t !== "number" || t % 1 !== 0) {
          throw TypeError("Illegal offset: " + t + " (not an integer)");
        }
        t >>>= 0;
        if (t < 0 || t + q > this.buffer.byteLength) {
          throw RangeError(
            "Illegal offset: 0 <= " +
            t +
            " (+" +
            q +
            ") <= " +
            this.buffer.byteLength
          );
        }
      }
      var s = this.slice(t, t + q);
      if (r) {
        this.offset += q;
      }
      return s;
    };
    l.writeBytes = l.append;
    l.writeInt8 = function (s, t) {
      var r = typeof t === "undefined";
      if (r) {
        t = this.offset;
      }
      if (!this.noAssert) {
        if (typeof s !== "number" || s % 1 !== 0) {
          throw TypeError("Illegal value: " + s + " (not an integer)");
        }
        s |= 0;
        if (typeof t !== "number" || t % 1 !== 0) {
          throw TypeError("Illegal offset: " + t + " (not an integer)");
        }
        t >>>= 0;
        if (t < 0 || t + 0 > this.buffer.byteLength) {
          throw RangeError(
            "Illegal offset: 0 <= " +
            t +
            " (+" +
            0 +
            ") <= " +
            this.buffer.byteLength
          );
        }
      }
      t += 1;
      var q = this.buffer.byteLength;
      if (t > q) {
        this.resize((q *= 2) > t ? q : t);
      }
      t -= 1;
      this.view[t] = s;
      if (r) {
        this.offset += 1;
      }
      return this;
    };
    l.writeByte = l.writeInt8;
    l.readInt8 = function (s) {
      var r = typeof s === "undefined";
      if (r) {
        s = this.offset;
      }
      if (!this.noAssert) {
        if (typeof s !== "number" || s % 1 !== 0) {
          throw TypeError("Illegal offset: " + s + " (not an integer)");
        }
        s >>>= 0;
        if (s < 0 || s + 1 > this.buffer.byteLength) {
          throw RangeError(
            "Illegal offset: 0 <= " +
            s +
            " (+" +
            1 +
            ") <= " +
            this.buffer.byteLength
          );
        }
      }
      var q = this.view[s];
      if ((q & 128) === 128) {
        q = -(255 - q + 1);
      }
      if (r) {
        this.offset += 1;
      }
      return q;
    };
    l.readByte = l.readInt8;
    l.writeUint8 = function (s, t) {
      var r = typeof t === "undefined";
      if (r) {
        t = this.offset;
      }
      if (!this.noAssert) {
        if (typeof s !== "number" || s % 1 !== 0) {
          throw TypeError("Illegal value: " + s + " (not an integer)");
        }
        s >>>= 0;
        if (typeof t !== "number" || t % 1 !== 0) {
          throw TypeError("Illegal offset: " + t + " (not an integer)");
        }
        t >>>= 0;
        if (t < 0 || t + 0 > this.buffer.byteLength) {
          throw RangeError(
            "Illegal offset: 0 <= " +
            t +
            " (+" +
            0 +
            ") <= " +
            this.buffer.byteLength
          );
        }
      }
      t += 1;
      var q = this.buffer.byteLength;
      if (t > q) {
        this.resize((q *= 2) > t ? q : t);
      }
      t -= 1;
      this.view[t] = s;
      if (r) {
        this.offset += 1;
      }
      return this;
    };
    l.writeUInt8 = l.writeUint8;
    l.readUint8 = function (s) {
      var r = typeof s === "undefined";
      if (r) {
        s = this.offset;
      }
      if (!this.noAssert) {
        if (typeof s !== "number" || s % 1 !== 0) {
          throw TypeError("Illegal offset: " + s + " (not an integer)");
        }
        s >>>= 0;
        if (s < 0 || s + 1 > this.buffer.byteLength) {
          throw RangeError(
            "Illegal offset: 0 <= " +
            s +
            " (+" +
            1 +
            ") <= " +
            this.buffer.byteLength
          );
        }
      }
      var q = this.view[s];
      if (r) {
        this.offset += 1;
      }
      return q;
    };
    l.readUInt8 = l.readUint8;
    l.writeInt16 = function (s, t) {
      var r = typeof t === "undefined";
      if (r) {
        t = this.offset;
      }
      if (!this.noAssert) {
        if (typeof s !== "number" || s % 1 !== 0) {
          throw TypeError("Illegal value: " + s + " (not an integer)");
        }
        s |= 0;
        if (typeof t !== "number" || t % 1 !== 0) {
          throw TypeError("Illegal offset: " + t + " (not an integer)");
        }
        t >>>= 0;
        if (t < 0 || t + 0 > this.buffer.byteLength) {
          throw RangeError(
            "Illegal offset: 0 <= " +
            t +
            " (+" +
            0 +
            ") <= " +
            this.buffer.byteLength
          );
        }
      }
      t += 2;
      var q = this.buffer.byteLength;
      if (t > q) {
        this.resize((q *= 2) > t ? q : t);
      }
      t -= 2;
      if (this.littleEndian) {
        this.view[t + 1] = (s & 65280) >>> 8;
        this.view[t] = s & 255;
      } else {
        this.view[t] = (s & 65280) >>> 8;
        this.view[t + 1] = s & 255;
      }
      if (r) {
        this.offset += 2;
      }
      return this;
    };
    l.writeShort = l.writeInt16;
    l.readInt16 = function (s) {
      var r = typeof s === "undefined";
      if (r) {
        s = this.offset;
      }
      if (!this.noAssert) {
        if (typeof s !== "number" || s % 1 !== 0) {
          throw TypeError("Illegal offset: " + s + " (not an integer)");
        }
        s >>>= 0;
        if (s < 0 || s + 2 > this.buffer.byteLength) {
          throw RangeError(
            "Illegal offset: 0 <= " +
            s +
            " (+" +
            2 +
            ") <= " +
            this.buffer.byteLength
          );
        }
      }
      var q = 0;
      if (this.littleEndian) {
        q = this.view[s];
        q |= this.view[s + 1] << 8;
      } else {
        q = this.view[s] << 8;
        q |= this.view[s + 1];
      }
      if ((q & 32768) === 32768) {
        q = -(65535 - q + 1);
      }
      if (r) {
        this.offset += 2;
      }
      return q;
    };
    l.readShort = l.readInt16;
    l.writeUint16 = function (s, t) {
      var r = typeof t === "undefined";
      if (r) {
        t = this.offset;
      }
      if (!this.noAssert) {
        if (typeof s !== "number" || s % 1 !== 0) {
          throw TypeError("Illegal value: " + s + " (not an integer)");
        }
        s >>>= 0;
        if (typeof t !== "number" || t % 1 !== 0) {
          throw TypeError("Illegal offset: " + t + " (not an integer)");
        }
        t >>>= 0;
        if (t < 0 || t + 0 > this.buffer.byteLength) {
          throw RangeError(
            "Illegal offset: 0 <= " +
            t +
            " (+" +
            0 +
            ") <= " +
            this.buffer.byteLength
          );
        }
      }
      t += 2;
      var q = this.buffer.byteLength;
      if (t > q) {
        this.resize((q *= 2) > t ? q : t);
      }
      t -= 2;
      if (this.littleEndian) {
        this.view[t + 1] = (s & 65280) >>> 8;
        this.view[t] = s & 255;
      } else {
        this.view[t] = (s & 65280) >>> 8;
        this.view[t + 1] = s & 255;
      }
      if (r) {
        this.offset += 2;
      }
      return this;
    };
    l.writeUInt16 = l.writeUint16;
    l.readUint16 = function (s) {
      var r = typeof s === "undefined";
      if (r) {
        s = this.offset;
      }
      if (!this.noAssert) {
        if (typeof s !== "number" || s % 1 !== 0) {
          throw TypeError("Illegal offset: " + s + " (not an integer)");
        }
        s >>>= 0;
        if (s < 0 || s + 2 > this.buffer.byteLength) {
          throw RangeError(
            "Illegal offset: 0 <= " +
            s +
            " (+" +
            2 +
            ") <= " +
            this.buffer.byteLength
          );
        }
      }
      var q = 0;
      if (this.littleEndian) {
        q = this.view[s];
        q |= this.view[s + 1] << 8;
      } else {
        q = this.view[s] << 8;
        q |= this.view[s + 1];
      }
      if (r) {
        this.offset += 2;
      }
      return q;
    };
    l.readUInt16 = l.readUint16;
    l.writeInt32 = function (s, t) {
      var r = typeof t === "undefined";
      if (r) {
        t = this.offset;
      }
      if (!this.noAssert) {
        if (typeof s !== "number" || s % 1 !== 0) {
          throw TypeError("Illegal value: " + s + " (not an integer)");
        }
        s |= 0;
        if (typeof t !== "number" || t % 1 !== 0) {
          throw TypeError("Illegal offset: " + t + " (not an integer)");
        }
        t >>>= 0;
        if (t < 0 || t + 0 > this.buffer.byteLength) {
          throw RangeError(
            "Illegal offset: 0 <= " +
            t +
            " (+" +
            0 +
            ") <= " +
            this.buffer.byteLength
          );
        }
      }
      t += 4;
      var q = this.buffer.byteLength;
      if (t > q) {
        this.resize((q *= 2) > t ? q : t);
      }
      t -= 4;
      if (this.littleEndian) {
        this.view[t + 3] = (s >>> 24) & 255;
        this.view[t + 2] = (s >>> 16) & 255;
        this.view[t + 1] = (s >>> 8) & 255;
        this.view[t] = s & 255;
      } else {
        this.view[t] = (s >>> 24) & 255;
        this.view[t + 1] = (s >>> 16) & 255;
        this.view[t + 2] = (s >>> 8) & 255;
        this.view[t + 3] = s & 255;
      }
      if (r) {
        this.offset += 4;
      }
      return this;
    };
    l.writeInt = l.writeInt32;
    l.readInt32 = function (s) {
      var r = typeof s === "undefined";
      if (r) {
        s = this.offset;
      }
      if (!this.noAssert) {
        if (typeof s !== "number" || s % 1 !== 0) {
          throw TypeError("Illegal offset: " + s + " (not an integer)");
        }
        s >>>= 0;
        if (s < 0 || s + 4 > this.buffer.byteLength) {
          throw RangeError(
            "Illegal offset: 0 <= " +
            s +
            " (+" +
            4 +
            ") <= " +
            this.buffer.byteLength
          );
        }
      }
      var q = 0;
      if (this.littleEndian) {
        q = this.view[s + 2] << 16;
        q |= this.view[s + 1] << 8;
        q |= this.view[s];
        q += (this.view[s + 3] << 24) >>> 0;
      } else {
        q = this.view[s + 1] << 16;
        q |= this.view[s + 2] << 8;
        q |= this.view[s + 3];
        q += (this.view[s] << 24) >>> 0;
      }
      q |= 0;
      if (r) {
        this.offset += 4;
      }
      return q;
    };
    l.readInt = l.readInt32;
    l.writeUint32 = function (s, t) {
      var r = typeof t === "undefined";
      if (r) {
        t = this.offset;
      }
      if (!this.noAssert) {
        if (typeof s !== "number" || s % 1 !== 0) {
          throw TypeError("Illegal value: " + s + " (not an integer)");
        }
        s >>>= 0;
        if (typeof t !== "number" || t % 1 !== 0) {
          throw TypeError("Illegal offset: " + t + " (not an integer)");
        }
        t >>>= 0;
        if (t < 0 || t + 0 > this.buffer.byteLength) {
          throw RangeError(
            "Illegal offset: 0 <= " +
            t +
            " (+" +
            0 +
            ") <= " +
            this.buffer.byteLength
          );
        }
      }
      t += 4;
      var q = this.buffer.byteLength;
      if (t > q) {
        this.resize((q *= 2) > t ? q : t);
      }
      t -= 4;
      if (this.littleEndian) {
        this.view[t + 3] = (s >>> 24) & 255;
        this.view[t + 2] = (s >>> 16) & 255;
        this.view[t + 1] = (s >>> 8) & 255;
        this.view[t] = s & 255;
      } else {
        this.view[t] = (s >>> 24) & 255;
        this.view[t + 1] = (s >>> 16) & 255;
        this.view[t + 2] = (s >>> 8) & 255;
        this.view[t + 3] = s & 255;
      }
      if (r) {
        this.offset += 4;
      }
      return this;
    };
    l.writeUInt32 = l.writeUint32;
    l.readUint32 = function (s) {
      var r = typeof s === "undefined";
      if (r) {
        s = this.offset;
      }
      if (!this.noAssert) {
        if (typeof s !== "number" || s % 1 !== 0) {
          throw TypeError("Illegal offset: " + s + " (not an integer)");
        }
        s >>>= 0;
        if (s < 0 || s + 4 > this.buffer.byteLength) {
          throw RangeError(
            "Illegal offset: 0 <= " +
            s +
            " (+" +
            4 +
            ") <= " +
            this.buffer.byteLength
          );
        }
      }
      var q = 0;
      if (this.littleEndian) {
        q = this.view[s + 2] << 16;
        q |= this.view[s + 1] << 8;
        q |= this.view[s];
        q += (this.view[s + 3] << 24) >>> 0;
      } else {
        q = this.view[s + 1] << 16;
        q |= this.view[s + 2] << 8;
        q |= this.view[s + 3];
        q += (this.view[s] << 24) >>> 0;
      }
      if (r) {
        this.offset += 4;
      }
      return q;
    };
    l.readUInt32 = l.readUint32;
    if (k) {
      l.writeInt64 = function (t, u) {
        var s = typeof u === "undefined";
        if (s) {
          u = this.offset;
        }
        if (!this.noAssert) {
          if (typeof t === "number") {
            t = k.fromNumber(t);
          } else {
            if (typeof t === "string") {
              t = k.fromString(t);
            } else {
              if (!(t && t instanceof k)) {
                throw TypeError(
                  "Illegal value: " + t + " (not an integer or Long)"
                );
              }
            }
          }
          if (typeof u !== "number" || u % 1 !== 0) {
            throw TypeError("Illegal offset: " + u + " (not an integer)");
          }
          u >>>= 0;
          if (u < 0 || u + 0 > this.buffer.byteLength) {
            throw RangeError(
              "Illegal offset: 0 <= " +
              u +
              " (+" +
              0 +
              ") <= " +
              this.buffer.byteLength
            );
          }
        }
        if (typeof t === "number") {
          t = k.fromNumber(t);
        } else {
          if (typeof t === "string") {
            t = k.fromString(t);
          }
        }
        u += 8;
        var v = this.buffer.byteLength;
        if (u > v) {
          this.resize((v *= 2) > u ? v : u);
        }
        u -= 8;
        var r = t.low,
          q = t.high;
        if (this.littleEndian) {
          this.view[u + 3] = (r >>> 24) & 255;
          this.view[u + 2] = (r >>> 16) & 255;
          this.view[u + 1] = (r >>> 8) & 255;
          this.view[u] = r & 255;
          u += 4;
          this.view[u + 3] = (q >>> 24) & 255;
          this.view[u + 2] = (q >>> 16) & 255;
          this.view[u + 1] = (q >>> 8) & 255;
          this.view[u] = q & 255;
        } else {
          this.view[u] = (q >>> 24) & 255;
          this.view[u + 1] = (q >>> 16) & 255;
          this.view[u + 2] = (q >>> 8) & 255;
          this.view[u + 3] = q & 255;
          u += 4;
          this.view[u] = (r >>> 24) & 255;
          this.view[u + 1] = (r >>> 16) & 255;
          this.view[u + 2] = (r >>> 8) & 255;
          this.view[u + 3] = r & 255;
        }
        if (s) {
          this.offset += 8;
        }
        return this;
      };
      l.writeLong = l.writeInt64;
      l.readInt64 = function (u) {
        var t = typeof u === "undefined";
        if (t) {
          u = this.offset;
        }
        if (!this.noAssert) {
          if (typeof u !== "number" || u % 1 !== 0) {
            throw TypeError("Illegal offset: " + u + " (not an integer)");
          }
          u >>>= 0;
          if (u < 0 || u + 8 > this.buffer.byteLength) {
            throw RangeError(
              "Illegal offset: 0 <= " +
              u +
              " (+" +
              8 +
              ") <= " +
              this.buffer.byteLength
            );
          }
        }
        var r = 0,
          q = 0;
        if (this.littleEndian) {
          r = this.view[u + 2] << 16;
          r |= this.view[u + 1] << 8;
          r |= this.view[u];
          r += (this.view[u + 3] << 24) >>> 0;
          u += 4;
          q = this.view[u + 2] << 16;
          q |= this.view[u + 1] << 8;
          q |= this.view[u];
          q += (this.view[u + 3] << 24) >>> 0;
        } else {
          q = this.view[u + 1] << 16;
          q |= this.view[u + 2] << 8;
          q |= this.view[u + 3];
          q += (this.view[u] << 24) >>> 0;
          u += 4;
          r = this.view[u + 1] << 16;
          r |= this.view[u + 2] << 8;
          r |= this.view[u + 3];
          r += (this.view[u] << 24) >>> 0;
        }
        var s = new k(r, q, false);
        if (t) {
          this.offset += 8;
        }
        return s;
      };
      l.readLong = l.readInt64;
      l.writeUint64 = function (t, v) {
        var s = typeof v === "undefined";
        if (s) {
          v = this.offset;
        }
        if (!this.noAssert) {
          if (typeof t === "number") {
            t = k.fromNumber(t);
          } else {
            if (typeof t === "string") {
              t = k.fromString(t);
            } else {
              if (!(t && t instanceof k)) {
                throw TypeError(
                  "Illegal value: " + t + " (not an integer or Long)"
                );
              }
            }
          }
          if (typeof v !== "number" || v % 1 !== 0) {
            throw TypeError("Illegal offset: " + v + " (not an integer)");
          }
          v >>>= 0;
          if (v < 0 || v + 0 > this.buffer.byteLength) {
            throw RangeError(
              "Illegal offset: 0 <= " +
              v +
              " (+" +
              0 +
              ") <= " +
              this.buffer.byteLength
            );
          }
        }
        if (typeof t === "number") {
          t = k.fromNumber(t);
        } else {
          if (typeof t === "string") {
            t = k.fromString(t);
          }
        }
        v += 8;
        var u = this.buffer.byteLength;
        if (v > u) {
          this.resize((u *= 2) > v ? u : v);
        }
        v -= 8;
        var r = t.low,
          q = t.high;
        if (this.littleEndian) {
          this.view[v + 3] = (r >>> 24) & 255;
          this.view[v + 2] = (r >>> 16) & 255;
          this.view[v + 1] = (r >>> 8) & 255;
          this.view[v] = r & 255;
          v += 4;
          this.view[v + 3] = (q >>> 24) & 255;
          this.view[v + 2] = (q >>> 16) & 255;
          this.view[v + 1] = (q >>> 8) & 255;
          this.view[v] = q & 255;
        } else {
          this.view[v] = (q >>> 24) & 255;
          this.view[v + 1] = (q >>> 16) & 255;
          this.view[v + 2] = (q >>> 8) & 255;
          this.view[v + 3] = q & 255;
          v += 4;
          this.view[v] = (r >>> 24) & 255;
          this.view[v + 1] = (r >>> 16) & 255;
          this.view[v + 2] = (r >>> 8) & 255;
          this.view[v + 3] = r & 255;
        }
        if (s) {
          this.offset += 8;
        }
        return this;
      };
      l.writeUInt64 = l.writeUint64;
      l.readUint64 = function (u) {
        var t = typeof u === "undefined";
        if (t) {
          u = this.offset;
        }
        if (!this.noAssert) {
          if (typeof u !== "number" || u % 1 !== 0) {
            throw TypeError("Illegal offset: " + u + " (not an integer)");
          }
          u >>>= 0;
          if (u < 0 || u + 8 > this.buffer.byteLength) {
            throw RangeError(
              "Illegal offset: 0 <= " +
              u +
              " (+" +
              8 +
              ") <= " +
              this.buffer.byteLength
            );
          }
        }
        var r = 0,
          q = 0;
        if (this.littleEndian) {
          r = this.view[u + 2] << 16;
          r |= this.view[u + 1] << 8;
          r |= this.view[u];
          r += (this.view[u + 3] << 24) >>> 0;
          u += 4;
          q = this.view[u + 2] << 16;
          q |= this.view[u + 1] << 8;
          q |= this.view[u];
          q += (this.view[u + 3] << 24) >>> 0;
        } else {
          q = this.view[u + 1] << 16;
          q |= this.view[u + 2] << 8;
          q |= this.view[u + 3];
          q += (this.view[u] << 24) >>> 0;
          u += 4;
          r = this.view[u + 1] << 16;
          r |= this.view[u + 2] << 8;
          r |= this.view[u + 3];
          r += (this.view[u] << 24) >>> 0;
        }
        var s = new k(r, q, true);
        if (t) {
          this.offset += 8;
        }
        return s;
      };
      l.readUInt64 = l.readUint64;
    }

    function i(x, w, t, r, A) {
      var B,
        v,
        u = A * 8 - r - 1,
        z = (1 << u) - 1,
        q = z >> 1,
        D = -7,
        y = t ? A - 1 : 0,
        C = t ? -1 : 1,
        E = x[w + y];
      y += C;
      B = E & ((1 << -D) - 1);
      E >>= -D;
      D += u;
      for (; D > 0; B = B * 256 + x[w + y], y += C, D -= 8) {}
      v = B & ((1 << -D) - 1);
      B >>= -D;
      D += r;
      for (; D > 0; v = v * 256 + x[w + y], y += C, D -= 8) {}
      if (B === 0) {
        B = 1 - q;
      } else {
        if (B === z) {
          return v ? NaN : (E ? -1 : 1) * Infinity;
        } else {
          v = v + Math.pow(2, r);
          B = B - q;
        }
      }
      return (E ? -1 : 1) * v * Math.pow(2, B - r);
    }

    function j(y, F, x, t, r, B) {
      var C,
        v,
        E,
        u = B * 8 - r - 1,
        A = (1 << u) - 1,
        q = A >> 1,
        w = r === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
        z = t ? 0 : B - 1,
        D = t ? 1 : -1,
        G = F < 0 || (F === 0 && 1 / F < 0) ? 1 : 0;
      F = Math.abs(F);
      if (isNaN(F) || F === Infinity) {
        v = isNaN(F) ? 1 : 0;
        C = A;
      } else {
        C = Math.floor(Math.log(F) / Math.LN2);
        if (F * (E = Math.pow(2, -C)) < 1) {
          C--;
          E *= 2;
        }
        if (C + q >= 1) {
          F += w / E;
        } else {
          F += w * Math.pow(2, 1 - q);
        }
        if (F * E >= 2) {
          C++;
          E /= 2;
        }
        if (C + q >= A) {
          v = 0;
          C = A;
        } else {
          if (C + q >= 1) {
            v = (F * E - 1) * Math.pow(2, r);
            C = C + q;
          } else {
            v = F * Math.pow(2, q - 1) * Math.pow(2, r);
            C = 0;
          }
        }
      }
      for (; r >= 8; y[x + z] = v & 255, z += D, v /= 256, r -= 8) {}
      C = (C << r) | v;
      u += r;
      for (; u > 0; y[x + z] = C & 255, z += D, C /= 256, u -= 8) {}
      y[x + z - D] |= G * 128;
    }
    l.writeFloat32 = function (r, t) {
      var q = typeof t === "undefined";
      if (q) {
        t = this.offset;
      }
      if (!this.noAssert) {
        if (typeof r !== "number") {
          throw TypeError("Illegal value: " + r + " (not a number)");
        }
        if (typeof t !== "number" || t % 1 !== 0) {
          throw TypeError("Illegal offset: " + t + " (not an integer)");
        }
        t >>>= 0;
        if (t < 0 || t + 0 > this.buffer.byteLength) {
          throw RangeError(
            "Illegal offset: 0 <= " +
            t +
            " (+" +
            0 +
            ") <= " +
            this.buffer.byteLength
          );
        }
      }
      t += 4;
      var s = this.buffer.byteLength;
      if (t > s) {
        this.resize((s *= 2) > t ? s : t);
      }
      t -= 4;
      j(this.view, r, t, this.littleEndian, 23, 4);
      if (q) {
        this.offset += 4;
      }
      return this;
    };
    l.writeFloat = l.writeFloat32;
    l.readFloat32 = function (s) {
      var r = typeof s === "undefined";
      if (r) {
        s = this.offset;
      }
      if (!this.noAssert) {
        if (typeof s !== "number" || s % 1 !== 0) {
          throw TypeError("Illegal offset: " + s + " (not an integer)");
        }
        s >>>= 0;
        if (s < 0 || s + 4 > this.buffer.byteLength) {
          throw RangeError(
            "Illegal offset: 0 <= " +
            s +
            " (+" +
            4 +
            ") <= " +
            this.buffer.byteLength
          );
        }
      }
      var q = i(this.view, s, this.littleEndian, 23, 4);
      if (r) {
        this.offset += 4;
      }
      return q;
    };
    l.readFloat = l.readFloat32;
    l.writeFloat64 = function (s, t) {
      var r = typeof t === "undefined";
      if (r) {
        t = this.offset;
      }
      if (!this.noAssert) {
        if (typeof s !== "number") {
          throw TypeError("Illegal value: " + s + " (not a number)");
        }
        if (typeof t !== "number" || t % 1 !== 0) {
          throw TypeError("Illegal offset: " + t + " (not an integer)");
        }
        t >>>= 0;
        if (t < 0 || t + 0 > this.buffer.byteLength) {
          throw RangeError(
            "Illegal offset: 0 <= " +
            t +
            " (+" +
            0 +
            ") <= " +
            this.buffer.byteLength
          );
        }
      }
      t += 8;
      var q = this.buffer.byteLength;
      if (t > q) {
        this.resize((q *= 2) > t ? q : t);
      }
      t -= 8;
      j(this.view, s, t, this.littleEndian, 52, 8);
      if (r) {
        this.offset += 8;
      }
      return this;
    };
    l.writeDouble = l.writeFloat64;
    l.readFloat64 = function (s) {
      var r = typeof s === "undefined";
      if (r) {
        s = this.offset;
      }
      if (!this.noAssert) {
        if (typeof s !== "number" || s % 1 !== 0) {
          throw TypeError("Illegal offset: " + s + " (not an integer)");
        }
        s >>>= 0;
        if (s < 0 || s + 8 > this.buffer.byteLength) {
          throw RangeError(
            "Illegal offset: 0 <= " +
            s +
            " (+" +
            8 +
            ") <= " +
            this.buffer.byteLength
          );
        }
      }
      var q = i(this.view, s, this.littleEndian, 52, 8);
      if (r) {
        this.offset += 8;
      }
      return q;
    };
    l.readDouble = l.readFloat64;
    n.MAX_VARINT32_BYTES = 5;
    n.calculateVarint32 = function (q) {
      q = q >>> 0;
      if (q < 1 << 7) {
        return 1;
      } else {
        if (q < 1 << 14) {
          return 2;
        } else {
          if (q < 1 << 21) {
            return 3;
          } else {
            if (q < 1 << 28) {
              return 4;
            } else {
              return 5;
            }
          }
        }
      }
    };
    n.zigZagEncode32 = function (q) {
      return (((q |= 0) << 1) ^ (q >> 31)) >>> 0;
    };
    n.zigZagDecode32 = function (q) {
      return ((q >>> 1) ^ -(q & 1)) | 0;
    };
    l.writeVarint32 = function (u, v) {
      var t = typeof v === "undefined";
      if (t) {
        v = this.offset;
      }
      if (!this.noAssert) {
        if (typeof u !== "number" || u % 1 !== 0) {
          throw TypeError("Illegal value: " + u + " (not an integer)");
        }
        u |= 0;
        if (typeof v !== "number" || v % 1 !== 0) {
          throw TypeError("Illegal offset: " + v + " (not an integer)");
        }
        v >>>= 0;
        if (v < 0 || v + 0 > this.buffer.byteLength) {
          throw RangeError(
            "Illegal offset: 0 <= " +
            v +
            " (+" +
            0 +
            ") <= " +
            this.buffer.byteLength
          );
        }
      }
      var r = n.calculateVarint32(u),
        q;
      v += r;
      var s = this.buffer.byteLength;
      if (v > s) {
        this.resize((s *= 2) > v ? s : v);
      }
      v -= r;
      u >>>= 0;
      while (u >= 128) {
        q = (u & 127) | 128;
        this.view[v++] = q;
        u >>>= 7;
      }
      this.view[v++] = u;
      if (t) {
        this.offset = v;
        return this;
      }
      return r;
    };
    l.writeVarint32ZigZag = function (q, r) {
      return this.writeVarint32(n.zigZagEncode32(q), r);
    };
    l.readVarint32 = function (u) {
      var t = typeof u === "undefined";
      if (t) {
        u = this.offset;
      }
      if (!this.noAssert) {
        if (typeof u !== "number" || u % 1 !== 0) {
          throw TypeError("Illegal offset: " + u + " (not an integer)");
        }
        u >>>= 0;
        if (u < 0 || u + 1 > this.buffer.byteLength) {
          throw RangeError(
            "Illegal offset: 0 <= " +
            u +
            " (+" +
            1 +
            ") <= " +
            this.buffer.byteLength
          );
        }
      }
      var v = 0,
        s = 0 >>> 0,
        q;
      do {
        if (!this.noAssert && u > this.limit) {
          var r = Error("Truncated");
          r.truncated = true;
          throw r;
        }
        q = this.view[u++];
        if (v < 5) {
          s |= (q & 127) << (7 * v);
        }
        ++v;
      } while ((q & 128) !== 0);
      s |= 0;
      if (t) {
        this.offset = u;
        return s;
      }
      return {
        value: s,
        length: v
      };
    };
    l.readVarint32ZigZag = function (r) {
      var q = this.readVarint32(r);
      if (typeof q === "object") {
        q.value = n.zigZagDecode32(q.value);
      } else {
        q = n.zigZagDecode32(q);
      }
      return q;
    };
    if (k) {
      n.MAX_VARINT64_BYTES = 10;
      n.calculateVarint64 = function (r) {
        if (typeof r === "number") {
          r = k.fromNumber(r);
        } else {
          if (typeof r === "string") {
            r = k.fromString(r);
          }
        }
        var t = r.toInt() >>> 0,
          s = r.shiftRightUnsigned(28).toInt() >>> 0,
          q = r.shiftRightUnsigned(56).toInt() >>> 0;
        if (q == 0) {
          if (s == 0) {
            if (t < 1 << 14) {
              return t < 1 << 7 ? 1 : 2;
            } else {
              return t < 1 << 21 ? 3 : 4;
            }
          } else {
            if (s < 1 << 14) {
              return s < 1 << 7 ? 5 : 6;
            } else {
              return s < 1 << 21 ? 7 : 8;
            }
          }
        } else {
          return q < 1 << 7 ? 9 : 10;
        }
      };
      n.zigZagEncode64 = function (q) {
        if (typeof q === "number") {
          q = k.fromNumber(q, false);
        } else {
          if (typeof q === "string") {
            q = k.fromString(q, false);
          } else {
            if (q.unsigned !== false) {
              q = q.toSigned();
            }
          }
        }
        return q
          .shiftLeft(1)
          .xor(q.shiftRight(63))
          .toUnsigned();
      };
      n.zigZagDecode64 = function (q) {
        if (typeof q === "number") {
          q = k.fromNumber(q, false);
        } else {
          if (typeof q === "string") {
            q = k.fromString(q, false);
          } else {
            if (q.unsigned !== false) {
              q = q.toSigned();
            }
          }
        }
        return q
          .shiftRightUnsigned(1)
          .xor(
            q
            .and(k.ONE)
            .toSigned()
            .negate()
          )
          .toSigned();
      };
      l.writeVarint64 = function (u, x) {
        var t = typeof x === "undefined";
        if (t) {
          x = this.offset;
        }
        if (!this.noAssert) {
          if (typeof u === "number") {
            u = k.fromNumber(u);
          } else {
            if (typeof u === "string") {
              u = k.fromString(u);
            } else {
              if (!(u && u instanceof k)) {
                throw TypeError(
                  "Illegal value: " + u + " (not an integer or Long)"
                );
              }
            }
          }
          if (typeof x !== "number" || x % 1 !== 0) {
            throw TypeError("Illegal offset: " + x + " (not an integer)");
          }
          x >>>= 0;
          if (x < 0 || x + 0 > this.buffer.byteLength) {
            throw RangeError(
              "Illegal offset: 0 <= " +
              x +
              " (+" +
              0 +
              ") <= " +
              this.buffer.byteLength
            );
          }
        }
        if (typeof u === "number") {
          u = k.fromNumber(u, false);
        } else {
          if (typeof u === "string") {
            u = k.fromString(u, false);
          } else {
            if (u.unsigned !== false) {
              u = u.toSigned();
            }
          }
        }
        var q = n.calculateVarint64(u),
          w = u.toInt() >>> 0,
          v = u.shiftRightUnsigned(28).toInt() >>> 0,
          s = u.shiftRightUnsigned(56).toInt() >>> 0;
        x += q;
        var r = this.buffer.byteLength;
        if (x > r) {
          this.resize((r *= 2) > x ? r : x);
        }
        x -= q;
        switch (q) {
          case 10:
            this.view[x + 9] = (s >>> 7) & 1;
          case 9:
            this.view[x + 8] = q !== 9 ? s | 128 : s & 127;
          case 8:
            this.view[x + 7] = q !== 8 ? (v >>> 21) | 128 : (v >>> 21) & 127;
          case 7:
            this.view[x + 6] = q !== 7 ? (v >>> 14) | 128 : (v >>> 14) & 127;
          case 6:
            this.view[x + 5] = q !== 6 ? (v >>> 7) | 128 : (v >>> 7) & 127;
          case 5:
            this.view[x + 4] = q !== 5 ? v | 128 : v & 127;
          case 4:
            this.view[x + 3] = q !== 4 ? (w >>> 21) | 128 : (w >>> 21) & 127;
          case 3:
            this.view[x + 2] = q !== 3 ? (w >>> 14) | 128 : (w >>> 14) & 127;
          case 2:
            this.view[x + 1] = q !== 2 ? (w >>> 7) | 128 : (w >>> 7) & 127;
          case 1:
            this.view[x] = q !== 1 ? w | 128 : w & 127;
        }
        if (t) {
          this.offset += q;
          return this;
        } else {
          return q;
        }
      };
      l.writeVarint64ZigZag = function (q, r) {
        return this.writeVarint64(n.zigZagEncode64(q), r);
      };
      l.readVarint64 = function (w) {
        var t = typeof w === "undefined";
        if (t) {
          w = this.offset;
        }
        if (!this.noAssert) {
          if (typeof w !== "number" || w % 1 !== 0) {
            throw TypeError("Illegal offset: " + w + " (not an integer)");
          }
          w >>>= 0;
          if (w < 0 || w + 1 > this.buffer.byteLength) {
            throw RangeError(
              "Illegal offset: 0 <= " +
              w +
              " (+" +
              1 +
              ") <= " +
              this.buffer.byteLength
            );
          }
        }
        var x = w,
          v = 0,
          u = 0,
          s = 0,
          q = 0;
        q = this.view[w++];
        v = q & 127;
        if (q & 128) {
          q = this.view[w++];
          v |= (q & 127) << 7;
          if (q & 128 || (this.noAssert && typeof q === "undefined")) {
            q = this.view[w++];
            v |= (q & 127) << 14;
            if (q & 128 || (this.noAssert && typeof q === "undefined")) {
              q = this.view[w++];
              v |= (q & 127) << 21;
              if (q & 128 || (this.noAssert && typeof q === "undefined")) {
                q = this.view[w++];
                u = q & 127;
                if (q & 128 || (this.noAssert && typeof q === "undefined")) {
                  q = this.view[w++];
                  u |= (q & 127) << 7;
                  if (q & 128 || (this.noAssert && typeof q === "undefined")) {
                    q = this.view[w++];
                    u |= (q & 127) << 14;
                    if (
                      q & 128 ||
                      (this.noAssert && typeof q === "undefined")
                    ) {
                      q = this.view[w++];
                      u |= (q & 127) << 21;
                      if (
                        q & 128 ||
                        (this.noAssert && typeof q === "undefined")
                      ) {
                        q = this.view[w++];
                        s = q & 127;
                        if (
                          q & 128 ||
                          (this.noAssert && typeof q === "undefined")
                        ) {
                          q = this.view[w++];
                          s |= (q & 127) << 7;
                          if (
                            q & 128 ||
                            (this.noAssert && typeof q === "undefined")
                          ) {
                            throw Error("Buffer overrun");
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        var r = k.fromBits(v | (u << 28), (u >>> 4) | (s << 24), false);
        if (t) {
          this.offset = w;
          return r;
        } else {
          return {
            value: r,
            length: w - x
          };
        }
      };
      l.readVarint64ZigZag = function (r) {
        var q = this.readVarint64(r);
        if (q && q.value instanceof k) {
          q.value = n.zigZagDecode64(q.value);
        } else {
          q = n.zigZagDecode64(q);
        }
        return q;
      };
    }
    l.writeCString = function (v, u) {
      var t = typeof u === "undefined";
      if (t) {
        u = this.offset;
      }
      var r,
        q = v.length;
      if (!this.noAssert) {
        if (typeof v !== "string") {
          throw TypeError("Illegal str: Not a string");
        }
        for (r = 0; r < q; ++r) {
          if (v.charCodeAt(r) === 0) {
            throw RangeError("Illegal str: Contains NULL-characters");
          }
        }
        if (typeof u !== "number" || u % 1 !== 0) {
          throw TypeError("Illegal offset: " + u + " (not an integer)");
        }
        u >>>= 0;
        if (u < 0 || u + 0 > this.buffer.byteLength) {
          throw RangeError(
            "Illegal offset: 0 <= " +
            u +
            " (+" +
            0 +
            ") <= " +
            this.buffer.byteLength
          );
        }
      }
      q = o.calculateUTF16asUTF8(b(v))[1];
      u += q + 1;
      var s = this.buffer.byteLength;
      if (u > s) {
        this.resize((s *= 2) > u ? s : u);
      }
      u -= q + 1;
      o.encodeUTF16toUTF8(
        b(v),
        function (w) {
          this.view[u++] = w;
        }.bind(this)
      );
      this.view[u++] = 0;
      if (t) {
        this.offset = u;
        return this;
      }
      return q;
    };
    l.readCString = function (u) {
      var s = typeof u === "undefined";
      if (s) {
        u = this.offset;
      }
      if (!this.noAssert) {
        if (typeof u !== "number" || u % 1 !== 0) {
          throw TypeError("Illegal offset: " + u + " (not an integer)");
        }
        u >>>= 0;
        if (u < 0 || u + 1 > this.buffer.byteLength) {
          throw RangeError(
            "Illegal offset: 0 <= " +
            u +
            " (+" +
            1 +
            ") <= " +
            this.buffer.byteLength
          );
        }
      }
      var v = u,
        r;
      var t,
        q = -1;
      o.decodeUTF8toUTF16(
        function () {
          if (q === 0) {
            return null;
          }
          if (u >= this.limit) {
            throw RangeError(
              "Illegal range: Truncated data, " + u + " < " + this.limit
            );
          }
          q = this.view[u++];
          return q === 0 ? null : q;
        }.bind(this),
        (t = f()),
        true
      );
      if (s) {
        this.offset = u;
        return t();
      } else {
        return {
          string: t(),
          length: u - v
        };
      }
    };
    l.writeIString = function (u, t) {
      var s = typeof t === "undefined";
      if (s) {
        t = this.offset;
      }
      if (!this.noAssert) {
        if (typeof u !== "string") {
          throw TypeError("Illegal str: Not a string");
        }
        if (typeof t !== "number" || t % 1 !== 0) {
          throw TypeError("Illegal offset: " + t + " (not an integer)");
        }
        t >>>= 0;
        if (t < 0 || t + 0 > this.buffer.byteLength) {
          throw RangeError(
            "Illegal offset: 0 <= " +
            t +
            " (+" +
            0 +
            ") <= " +
            this.buffer.byteLength
          );
        }
      }
      var v = t,
        q;
      q = o.calculateUTF16asUTF8(b(u), this.noAssert)[1];
      t += 4 + q;
      var r = this.buffer.byteLength;
      if (t > r) {
        this.resize((r *= 2) > t ? r : t);
      }
      t -= 4 + q;
      if (this.littleEndian) {
        this.view[t + 3] = (q >>> 24) & 255;
        this.view[t + 2] = (q >>> 16) & 255;
        this.view[t + 1] = (q >>> 8) & 255;
        this.view[t] = q & 255;
      } else {
        this.view[t] = (q >>> 24) & 255;
        this.view[t + 1] = (q >>> 16) & 255;
        this.view[t + 2] = (q >>> 8) & 255;
        this.view[t + 3] = q & 255;
      }
      t += 4;
      o.encodeUTF16toUTF8(
        b(u),
        function (w) {
          this.view[t++] = w;
        }.bind(this)
      );
      if (t !== v + 4 + q) {
        throw RangeError(
          "Illegal range: Truncated data, " + t + " == " + (t + 4 + q)
        );
      }
      if (s) {
        this.offset = t;
        return this;
      }
      return t - v;
    };
    l.readIString = function (t) {
      var r = typeof t === "undefined";
      if (r) {
        t = this.offset;
      }
      if (!this.noAssert) {
        if (typeof t !== "number" || t % 1 !== 0) {
          throw TypeError("Illegal offset: " + t + " (not an integer)");
        }
        t >>>= 0;
        if (t < 0 || t + 4 > this.buffer.byteLength) {
          throw RangeError(
            "Illegal offset: 0 <= " +
            t +
            " (+" +
            4 +
            ") <= " +
            this.buffer.byteLength
          );
        }
      }
      var u = t;
      var q = this.readUint32(t);
      var s = this.readUTF8String(q, n.METRICS_BYTES, (t += 4));
      t += s.length;
      if (r) {
        this.offset = t;
        return s.string;
      } else {
        return {
          string: s.string,
          length: t - u
        };
      }
    };
    n.METRICS_CHARS = "c";
    n.METRICS_BYTES = "b";
    l.writeUTF8String = function (u, t) {
      var s = typeof t === "undefined";
      if (s) {
        t = this.offset;
      }
      if (!this.noAssert) {
        if (typeof t !== "number" || t % 1 !== 0) {
          throw TypeError("Illegal offset: " + t + " (not an integer)");
        }
        t >>>= 0;
        if (t < 0 || t + 0 > this.buffer.byteLength) {
          throw RangeError(
            "Illegal offset: 0 <= " +
            t +
            " (+" +
            0 +
            ") <= " +
            this.buffer.byteLength
          );
        }
      }
      var q;
      var v = t;
      q = o.calculateUTF16asUTF8(b(u))[1];
      t += q;
      var r = this.buffer.byteLength;
      if (t > r) {
        this.resize((r *= 2) > t ? r : t);
      }
      t -= q;
      o.encodeUTF16toUTF8(
        b(u),
        function (w) {
          this.view[t++] = w;
        }.bind(this)
      );
      if (s) {
        this.offset = t;
        return this;
      }
      return t - v;
    };
    l.writeString = l.writeUTF8String;
    n.calculateUTF8Chars = function (q) {
      return o.calculateUTF16asUTF8(b(q))[0];
    };
    n.calculateUTF8Bytes = function (q) {
      return o.calculateUTF16asUTF8(b(q))[1];
    };
    n.calculateString = n.calculateUTF8Bytes;
    l.readUTF8String = function (t, s, w) {
      if (typeof s === "number") {
        w = s;
        s = undefined;
      }
      var u = typeof w === "undefined";
      if (u) {
        w = this.offset;
      }
      if (typeof s === "undefined") {
        s = n.METRICS_CHARS;
      }
      if (!this.noAssert) {
        if (typeof t !== "number" || t % 1 !== 0) {
          throw TypeError("Illegal length: " + t + " (not an integer)");
        }
        t |= 0;
        if (typeof w !== "number" || w % 1 !== 0) {
          throw TypeError("Illegal offset: " + w + " (not an integer)");
        }
        w >>>= 0;
        if (w < 0 || w + 0 > this.buffer.byteLength) {
          throw RangeError(
            "Illegal offset: 0 <= " +
            w +
            " (+" +
            0 +
            ") <= " +
            this.buffer.byteLength
          );
        }
      }
      var r = 0,
        x = w,
        v;
      if (s === n.METRICS_CHARS) {
        v = f();
        o.decodeUTF8(
          function () {
            return r < t && w < this.limit ? this.view[w++] : null;
          }.bind(this),
          function (y) {
            ++r;
            o.UTF8toUTF16(y, v);
          }
        );
        if (r !== t) {
          throw RangeError("Illegal range: Truncated data, " + r + " == " + t);
        }
        if (u) {
          this.offset = w;
          return v();
        } else {
          return {
            string: v(),
            length: w - x
          };
        }
      } else {
        if (s === n.METRICS_BYTES) {
          if (!this.noAssert) {
            if (typeof w !== "number" || w % 1 !== 0) {
              throw TypeError("Illegal offset: " + w + " (not an integer)");
            }
            w >>>= 0;
            if (w < 0 || w + t > this.buffer.byteLength) {
              throw RangeError(
                "Illegal offset: 0 <= " +
                w +
                " (+" +
                t +
                ") <= " +
                this.buffer.byteLength
              );
            }
          }
          var q = w + t;
          o.decodeUTF8toUTF16(
            function () {
              return w < q ? this.view[w++] : null;
            }.bind(this),
            (v = f()),
            this.noAssert
          );
          if (w !== q) {
            throw RangeError(
              "Illegal range: Truncated data, " + w + " == " + q
            );
          }
          if (u) {
            this.offset = w;
            return v();
          } else {
            return {
              string: v(),
              length: w - x
            };
          }
        } else {
          throw TypeError("Unsupported metrics: " + s);
        }
      }
    };
    l.readString = l.readUTF8String;
    l.writeVString = function (v, u) {
      var t = typeof u === "undefined";
      if (t) {
        u = this.offset;
      }
      if (!this.noAssert) {
        if (typeof v !== "string") {
          throw TypeError("Illegal str: Not a string");
        }
        if (typeof u !== "number" || u % 1 !== 0) {
          throw TypeError("Illegal offset: " + u + " (not an integer)");
        }
        u >>>= 0;
        if (u < 0 || u + 0 > this.buffer.byteLength) {
          throw RangeError(
            "Illegal offset: 0 <= " +
            u +
            " (+" +
            0 +
            ") <= " +
            this.buffer.byteLength
          );
        }
      }
      var w = u,
        s,
        q;
      s = o.calculateUTF16asUTF8(b(v), this.noAssert)[1];
      q = n.calculateVarint32(s);
      u += q + s;
      var r = this.buffer.byteLength;
      if (u > r) {
        this.resize((r *= 2) > u ? r : u);
      }
      u -= q + s;
      u += this.writeVarint32(s, u);
      o.encodeUTF16toUTF8(
        b(v),
        function (x) {
          this.view[u++] = x;
        }.bind(this)
      );
      if (u !== w + s + q) {
        throw RangeError(
          "Illegal range: Truncated data, " + u + " == " + (u + s + q)
        );
      }
      if (t) {
        this.offset = u;
        return this;
      }
      return u - w;
    };
    l.readVString = function (t) {
      var r = typeof t === "undefined";
      if (r) {
        t = this.offset;
      }
      if (!this.noAssert) {
        if (typeof t !== "number" || t % 1 !== 0) {
          throw TypeError("Illegal offset: " + t + " (not an integer)");
        }
        t >>>= 0;
        if (t < 0 || t + 1 > this.buffer.byteLength) {
          throw RangeError(
            "Illegal offset: 0 <= " +
            t +
            " (+" +
            1 +
            ") <= " +
            this.buffer.byteLength
          );
        }
      }
      var u = t;
      var q = this.readVarint32(t);
      var s = this.readUTF8String(q.value, n.METRICS_BYTES, (t += q.length));
      t += s.length;
      if (r) {
        this.offset = t;
        return s.string;
      } else {
        return {
          string: s.string,
          length: t - u
        };
      }
    };
    l.append = function (u, s, v) {
      if (typeof s === "number" || typeof s !== "string") {
        v = s;
        s = undefined;
      }
      var t = typeof v === "undefined";
      if (t) {
        v = this.offset;
      }
      if (!this.noAssert) {
        if (typeof v !== "number" || v % 1 !== 0) {
          throw TypeError("Illegal offset: " + v + " (not an integer)");
        }
        v >>>= 0;
        if (v < 0 || v + 0 > this.buffer.byteLength) {
          throw RangeError(
            "Illegal offset: 0 <= " +
            v +
            " (+" +
            0 +
            ") <= " +
            this.buffer.byteLength
          );
        }
      }
      if (!(u instanceof n)) {
        u = n.wrap(u, s);
      }
      var r = u.limit - u.offset;
      if (r <= 0) {
        return this;
      }
      v += r;
      var q = this.buffer.byteLength;
      if (v > q) {
        this.resize((q *= 2) > v ? q : v);
      }
      v -= r;
      this.view.set(u.view.subarray(u.offset, u.limit), v);
      u.offset += r;
      if (t) {
        this.offset += r;
      }
      return this;
    };
    l.appendTo = function (q, r) {
      q.append(this, r);
      return this;
    };
    l.assert = function (q) {
      this.noAssert = !q;
      return this;
    };
    l.capacity = function () {
      return this.buffer.byteLength;
    };
    l.clear = function () {
      this.offset = 0;
      this.limit = this.buffer.byteLength;
      this.markedOffset = -1;
      return this;
    };
    l.clone = function (r) {
      var q = new n(0, this.littleEndian, this.noAssert);
      if (r) {
        q.buffer = new ArrayBuffer(this.buffer.byteLength);
        q.view = new Uint8Array(q.buffer);
      } else {
        q.buffer = this.buffer;
        q.view = this.view;
      }
      q.offset = this.offset;
      q.markedOffset = this.markedOffset;
      q.limit = this.limit;
      return q;
    };
    l.compact = function (u, t) {
      if (typeof u === "undefined") {
        u = this.offset;
      }
      if (typeof t === "undefined") {
        t = this.limit;
      }
      if (!this.noAssert) {
        if (typeof u !== "number" || u % 1 !== 0) {
          throw TypeError("Illegal begin: Not an integer");
        }
        u >>>= 0;
        if (typeof t !== "number" || t % 1 !== 0) {
          throw TypeError("Illegal end: Not an integer");
        }
        t >>>= 0;
        if (u < 0 || u > t || t > this.buffer.byteLength) {
          throw RangeError(
            "Illegal range: 0 <= " +
            u +
            " <= " +
            t +
            " <= " +
            this.buffer.byteLength
          );
        }
      }
      if (u === 0 && t === this.buffer.byteLength) {
        return this;
      }
      var q = t - u;
      if (q === 0) {
        this.buffer = p;
        this.view = null;
        if (this.markedOffset >= 0) {
          this.markedOffset -= u;
        }
        this.offset = 0;
        this.limit = 0;
        return this;
      }
      var s = new ArrayBuffer(q);
      var r = new Uint8Array(s);
      r.set(this.view.subarray(u, t));
      this.buffer = s;
      this.view = r;
      if (this.markedOffset >= 0) {
        this.markedOffset -= u;
      }
      this.offset = 0;
      this.limit = q;
      return this;
    };
    l.copy = function (s, q) {
      if (typeof s === "undefined") {
        s = this.offset;
      }
      if (typeof q === "undefined") {
        q = this.limit;
      }
      if (!this.noAssert) {
        if (typeof s !== "number" || s % 1 !== 0) {
          throw TypeError("Illegal begin: Not an integer");
        }
        s >>>= 0;
        if (typeof q !== "number" || q % 1 !== 0) {
          throw TypeError("Illegal end: Not an integer");
        }
        q >>>= 0;
        if (s < 0 || s > q || q > this.buffer.byteLength) {
          throw RangeError(
            "Illegal range: 0 <= " +
            s +
            " <= " +
            q +
            " <= " +
            this.buffer.byteLength
          );
        }
      }
      if (s === q) {
        return new n(0, this.littleEndian, this.noAssert);
      }
      var r = q - s,
        t = new n(r, this.littleEndian, this.noAssert);
      t.offset = 0;
      t.limit = r;
      if (t.markedOffset >= 0) {
        t.markedOffset -= s;
      }
      this.copyTo(t, 0, s, q);
      return t;
    };
    l.copyTo = function (u, w, s, v) {
      var t, r;
      if (!this.noAssert) {
        if (!n.isByteBuffer(u)) {
          throw TypeError("Illegal target: Not a ByteBuffer");
        }
      }
      w = (r = typeof w === "undefined") ? u.offset : w | 0;
      s = (t = typeof s === "undefined") ? this.offset : s | 0;
      v = typeof v === "undefined" ? this.limit : v | 0;
      if (w < 0 || w > u.buffer.byteLength) {
        throw RangeError(
          "Illegal target range: 0 <= " + w + " <= " + u.buffer.byteLength
        );
      }
      if (s < 0 || v > this.buffer.byteLength) {
        throw RangeError(
          "Illegal source range: 0 <= " + s + " <= " + this.buffer.byteLength
        );
      }
      var q = v - s;
      if (q === 0) {
        return u;
      }
      u.ensureCapacity(w + q);
      u.view.set(this.view.subarray(s, v), w);
      if (t) {
        this.offset += q;
      }
      if (r) {
        u.offset += q;
      }
      return this;
    };
    l.ensureCapacity = function (q) {
      var r = this.buffer.byteLength;
      if (r < q) {
        return this.resize((r *= 2) > q ? r : q);
      }
      return this;
    };
    l.fill = function (t, r, q) {
      var s = typeof r === "undefined";
      if (s) {
        r = this.offset;
      }
      if (typeof t === "string" && t.length > 0) {
        t = t.charCodeAt(0);
      }
      if (typeof r === "undefined") {
        r = this.offset;
      }
      if (typeof q === "undefined") {
        q = this.limit;
      }
      if (!this.noAssert) {
        if (typeof t !== "number" || t % 1 !== 0) {
          throw TypeError("Illegal value: " + t + " (not an integer)");
        }
        t |= 0;
        if (typeof r !== "number" || r % 1 !== 0) {
          throw TypeError("Illegal begin: Not an integer");
        }
        r >>>= 0;
        if (typeof q !== "number" || q % 1 !== 0) {
          throw TypeError("Illegal end: Not an integer");
        }
        q >>>= 0;
        if (r < 0 || r > q || q > this.buffer.byteLength) {
          throw RangeError(
            "Illegal range: 0 <= " +
            r +
            " <= " +
            q +
            " <= " +
            this.buffer.byteLength
          );
        }
      }
      if (r >= q) {
        return this;
      }
      while (r < q) {
        this.view[r++] = t;
      }
      if (s) {
        this.offset = r;
      }
      return this;
    };
    l.flip = function () {
      this.limit = this.offset;
      this.offset = 0;
      return this;
    };
    l.mark = function (q) {
      q = typeof q === "undefined" ? this.offset : q;
      if (!this.noAssert) {
        if (typeof q !== "number" || q % 1 !== 0) {
          throw TypeError("Illegal offset: " + q + " (not an integer)");
        }
        q >>>= 0;
        if (q < 0 || q + 0 > this.buffer.byteLength) {
          throw RangeError(
            "Illegal offset: 0 <= " +
            q +
            " (+" +
            0 +
            ") <= " +
            this.buffer.byteLength
          );
        }
      }
      this.markedOffset = q;
      return this;
    };
    l.order = function (q) {
      if (!this.noAssert) {
        if (typeof q !== "boolean") {
          throw TypeError("Illegal littleEndian: Not a boolean");
        }
      }
      this.littleEndian = !!q;
      return this;
    };
    l.LE = function (q) {
      this.littleEndian = typeof q !== "undefined" ? !!q : true;
      return this;
    };
    l.BE = function (q) {
      this.littleEndian = typeof q !== "undefined" ? !q : false;
      return this;
    };
    l.prepend = function (q, s, t) {
      if (typeof s === "number" || typeof s !== "string") {
        t = s;
        s = undefined;
      }
      var r = typeof t === "undefined";
      if (r) {
        t = this.offset;
      }
      if (!this.noAssert) {
        if (typeof t !== "number" || t % 1 !== 0) {
          throw TypeError("Illegal offset: " + t + " (not an integer)");
        }
        t >>>= 0;
        if (t < 0 || t + 0 > this.buffer.byteLength) {
          throw RangeError(
            "Illegal offset: 0 <= " +
            t +
            " (+" +
            0 +
            ") <= " +
            this.buffer.byteLength
          );
        }
      }
      if (!(q instanceof n)) {
        q = n.wrap(q, s);
      }
      var v = q.limit - q.offset;
      if (v <= 0) {
        return this;
      }
      var y = v - t;
      if (y > 0) {
        var u = new ArrayBuffer(this.buffer.byteLength + y);
        var x = new Uint8Array(u);
        x.set(this.view.subarray(t, this.buffer.byteLength), v);
        this.buffer = u;
        this.view = x;
        this.offset += y;
        if (this.markedOffset >= 0) {
          this.markedOffset += y;
        }
        this.limit += y;
        t += y;
      } else {
        var w = new Uint8Array(this.buffer);
      }
      this.view.set(q.view.subarray(q.offset, q.limit), t - v);
      q.offset = q.limit;
      if (r) {
        this.offset -= v;
      }
      return this;
    };
    l.prependTo = function (q, r) {
      q.prepend(this, r);
      return this;
    };
    l.printDebug = function (q) {
      if (typeof q !== "function") {
        q = console.log.bind(console);
      }
      q(
        this.toString() +
        "\n-------------------------------------------------------------------\n" +
        this.toDebug(true)
      );
    };
    l.remaining = function () {
      return this.limit - this.offset;
    };
    l.reset = function () {
      if (this.markedOffset >= 0) {
        this.offset = this.markedOffset;
        this.markedOffset = -1;
      } else {
        this.offset = 0;
      }
      return this;
    };
    l.resize = function (s) {
      if (!this.noAssert) {
        if (typeof s !== "number" || s % 1 !== 0) {
          throw TypeError("Illegal capacity: " + s + " (not an integer)");
        }
        s |= 0;
        if (s < 0) {
          throw RangeError("Illegal capacity: 0 <= " + s);
        }
      }
      if (this.buffer.byteLength < s) {
        var r = new ArrayBuffer(s);
        var q = new Uint8Array(r);
        q.set(this.view);
        this.buffer = r;
        this.view = q;
      }
      return this;
    };
    l.reverse = function (r, q) {
      if (typeof r === "undefined") {
        r = this.offset;
      }
      if (typeof q === "undefined") {
        q = this.limit;
      }
      if (!this.noAssert) {
        if (typeof r !== "number" || r % 1 !== 0) {
          throw TypeError("Illegal begin: Not an integer");
        }
        r >>>= 0;
        if (typeof q !== "number" || q % 1 !== 0) {
          throw TypeError("Illegal end: Not an integer");
        }
        q >>>= 0;
        if (r < 0 || r > q || q > this.buffer.byteLength) {
          throw RangeError(
            "Illegal range: 0 <= " +
            r +
            " <= " +
            q +
            " <= " +
            this.buffer.byteLength
          );
        }
      }
      if (r === q) {
        return this;
      }
      Array.prototype.reverse.call(this.view.subarray(r, q));
      return this;
    };
    l.skip = function (q) {
      if (!this.noAssert) {
        if (typeof q !== "number" || q % 1 !== 0) {
          throw TypeError("Illegal length: " + q + " (not an integer)");
        }
        q |= 0;
      }
      var r = this.offset + q;
      if (!this.noAssert) {
        if (r < 0 || r > this.buffer.byteLength) {
          throw RangeError(
            "Illegal length: 0 <= " +
            this.offset +
            " + " +
            q +
            " <= " +
            this.buffer.byteLength
          );
        }
      }
      this.offset = r;
      return this;
    };
    l.slice = function (r, q) {
      if (typeof r === "undefined") {
        r = this.offset;
      }
      if (typeof q === "undefined") {
        q = this.limit;
      }
      if (!this.noAssert) {
        if (typeof r !== "number" || r % 1 !== 0) {
          throw TypeError("Illegal begin: Not an integer");
        }
        r >>>= 0;
        if (typeof q !== "number" || q % 1 !== 0) {
          throw TypeError("Illegal end: Not an integer");
        }
        q >>>= 0;
        if (r < 0 || r > q || q > this.buffer.byteLength) {
          throw RangeError(
            "Illegal range: 0 <= " +
            r +
            " <= " +
            q +
            " <= " +
            this.buffer.byteLength
          );
        }
      }
      var s = this.clone();
      s.offset = r;
      s.limit = q;
      return s;
    };
    l.toBuffer = function (q) {
      var t = this.offset,
        s = this.limit;
      if (!this.noAssert) {
        if (typeof t !== "number" || t % 1 !== 0) {
          throw TypeError("Illegal offset: Not an integer");
        }
        t >>>= 0;
        if (typeof s !== "number" || s % 1 !== 0) {
          throw TypeError("Illegal limit: Not an integer");
        }
        s >>>= 0;
        if (t < 0 || t > s || s > this.buffer.byteLength) {
          throw RangeError(
            "Illegal range: 0 <= " +
            t +
            " <= " +
            s +
            " <= " +
            this.buffer.byteLength
          );
        }
      }
      if (!q && t === 0 && s === this.buffer.byteLength) {
        return this.buffer;
      }
      if (t === s) {
        return p;
      }
      var r = new ArrayBuffer(s - t);
      new Uint8Array(r).set(new Uint8Array(this.buffer).subarray(t, s), 0);
      return r;
    };
    l.toArrayBuffer = l.toBuffer;
    l.toString = function (s, r, q) {
      if (typeof s === "undefined") {
        return (
          "ByteBufferAB(offset=" +
          this.offset +
          ",markedOffset=" +
          this.markedOffset +
          ",limit=" +
          this.limit +
          ",capacity=" +
          this.capacity() +
          ")"
        );
      }
      if (typeof s === "number") {
        (s = "utf8"), (r = s), (q = r);
      }
      switch (s) {
        case "utf8":
          return this.toUTF8(r, q);
        case "base64":
          return this.toBase64(r, q);
        case "hex":
          return this.toHex(r, q);
        case "binary":
          return this.toBinary(r, q);
        case "debug":
          return this.toDebug();
        case "columns":
          return this.toColumns();
        default:
          throw Error("Unsupported encoding: " + s);
      }
    };
    var h = (function () {
      var r = {};
      var u = [
        65,
        66,
        67,
        68,
        69,
        70,
        71,
        72,
        73,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        82,
        83,
        84,
        85,
        86,
        87,
        88,
        89,
        90,
        97,
        98,
        99,
        100,
        101,
        102,
        103,
        104,
        105,
        106,
        107,
        108,
        109,
        110,
        111,
        112,
        113,
        114,
        115,
        116,
        117,
        118,
        119,
        120,
        121,
        122,
        48,
        49,
        50,
        51,
        52,
        53,
        54,
        55,
        56,
        57,
        43,
        47,
      ];
      var t = [];
      for (var s = 0, q = u.length; s < q; ++s) {
        t[u[s]] = s;
      }
      r.encode = function (x, y) {
        var v, w;
        while ((v = x()) !== null) {
          y(u[(v >> 2) & 63]);
          w = (v & 3) << 4;
          if ((v = x()) !== null) {
            w |= (v >> 4) & 15;
            y(u[(w | ((v >> 4) & 15)) & 63]);
            w = (v & 15) << 2;
            if ((v = x()) !== null) {
              y(u[(w | ((v >> 6) & 3)) & 63]), y(u[v & 63]);
            } else {
              y(u[w & 63]), y(61);
            }
          } else {
            y(u[w & 63]), y(61), y(61);
          }
        }
      };
      r.decode = function (y, A) {
        var z, x, w;

        function v(B) {
          throw Error("Illegal character code: " + B);
        }
        while ((z = y()) !== null) {
          x = t[z];
          if (typeof x === "undefined") {
            v(z);
          }
          if ((z = y()) !== null) {
            w = t[z];
            if (typeof w === "undefined") {
              v(z);
            }
            A(((x << 2) >>> 0) | ((w & 48) >> 4));
            if ((z = y()) !== null) {
              x = t[z];
              if (typeof x === "undefined") {
                if (z === 61) {
                  break;
                } else {
                  v(z);
                }
              }
              A((((w & 15) << 4) >>> 0) | ((x & 60) >> 2));
              if ((z = y()) !== null) {
                w = t[z];
                if (typeof w === "undefined") {
                  if (z === 61) {
                    break;
                  } else {
                    v(z);
                  }
                }
                A((((x & 3) << 6) >>> 0) | w);
              }
            }
          }
        }
      };
      r.test = function (v) {
        return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
          v
        );
      };
      return r;
    })();
    l.toBase64 = function (r, q) {
      if (typeof r === "undefined") {
        r = this.offset;
      }
      if (typeof q === "undefined") {
        q = this.limit;
      }
      r = r | 0;
      q = q | 0;
      if (r < 0 || q > this.capacity || r > q) {
        throw RangeError("begin, end");
      }
      var s;
      h.encode(
        function () {
          return r < q ? this.view[r++] : null;
        }.bind(this),
        (s = f())
      );
      return s();
    };
    n.fromBase64 = function (t, r) {
      if (typeof t !== "string") {
        throw TypeError("str");
      }
      var s = new n((t.length / 4) * 3, r),
        q = 0;
      h.decode(b(t), function (u) {
        s.view[q++] = u;
      });
      s.limit = q;
      return s;
    };
    n.btoa = function (q) {
      return n.fromBinary(q).toBase64();
    };
    n.atob = function (q) {
      return n.fromBase64(q).toBinary();
    };
    l.toBinary = function (r, q) {
      if (typeof r === "undefined") {
        r = this.offset;
      }
      if (typeof q === "undefined") {
        q = this.limit;
      }
      r |= 0;
      q |= 0;
      if (r < 0 || q > this.capacity() || r > q) {
        throw RangeError("begin, end");
      }
      if (r === q) {
        return "";
      }
      var s = [],
        t = [];
      while (r < q) {
        s.push(this.view[r++]);
        if (s.length >= 1024) {
          t.push(String.fromCharCode.apply(String, s)), (s = []);
        }
      }
      return t.join("") + String.fromCharCode.apply(String, s);
    };
    n.fromBinary = function (v, t) {
      if (typeof v !== "string") {
        throw TypeError("str");
      }
      var s = 0,
        r = v.length,
        q,
        u = new n(r, t);
      while (s < r) {
        q = v.charCodeAt(s);
        if (q > 255) {
          throw RangeError("illegal char code: " + q);
        }
        u.view[s++] = q;
      }
      u.limit = r;
      return u;
    };
    l.toDebug = function (u) {
      var t = -1,
        r = this.buffer.byteLength,
        q,
        w = "",
        v = "",
        s = "";
      while (t < r) {
        if (t !== -1) {
          q = this.view[t];
          if (q < 16) {
            w += "0" + q.toString(16).toUpperCase();
          } else {
            w += q.toString(16).toUpperCase();
          }
          if (u) {
            v += q > 32 && q < 127 ? String.fromCharCode(q) : ".";
          }
        }
        ++t;
        if (u) {
          if (t > 0 && t % 16 === 0 && t !== r) {
            while (w.length < 3 * 16 + 3) {
              w += " ";
            }
            s += w + v + "\n";
            w = v = "";
          }
        }
        if (t === this.offset && t === this.limit) {
          w += t === this.markedOffset ? "!" : "|";
        } else {
          if (t === this.offset) {
            w += t === this.markedOffset ? "[" : "<";
          } else {
            if (t === this.limit) {
              w += t === this.markedOffset ? "]" : ">";
            } else {
              w +=
                t === this.markedOffset ?
                "'" :
                u || (t !== 0 && t !== r) ?
                " " :
                "";
            }
          }
        }
      }
      if (u && w !== " ") {
        while (w.length < 3 * 16 + 3) {
          w += " ";
        }
        s += w + v + "\n";
      }
      return u ? s : w;
    };
    n.fromDebug = function (A, s, C) {
      var w = A.length,
        z = new n(((w + 1) / 3) | 0, s, C);
      var y = 0,
        x = 0,
        q,
        B,
        v = false,
        D = false,
        r = false,
        t = false,
        u = false;
      while (y < w) {
        switch ((q = A.charAt(y++))) {
          case "!":
            if (!C) {
              if (D || r || t) {
                u = true;
                break;
              }
              D = r = t = true;
            }
            z.offset = z.markedOffset = z.limit = x;
            v = false;
            break;
          case "|":
            if (!C) {
              if (D || t) {
                u = true;
                break;
              }
              D = t = true;
            }
            z.offset = z.limit = x;
            v = false;
            break;
          case "[":
            if (!C) {
              if (D || r) {
                u = true;
                break;
              }
              D = r = true;
            }
            z.offset = z.markedOffset = x;
            v = false;
            break;
          case "<":
            if (!C) {
              if (D) {
                u = true;
                break;
              }
              D = true;
            }
            z.offset = x;
            v = false;
            break;
          case "]":
            if (!C) {
              if (t || r) {
                u = true;
                break;
              }
              t = r = true;
            }
            z.limit = z.markedOffset = x;
            v = false;
            break;
          case ">":
            if (!C) {
              if (t) {
                u = true;
                break;
              }
              t = true;
            }
            z.limit = x;
            v = false;
            break;
          case "'":
            if (!C) {
              if (r) {
                u = true;
                break;
              }
              r = true;
            }
            z.markedOffset = x;
            v = false;
            break;
          case " ":
            v = false;
            break;
          default:
            if (!C) {
              if (v) {
                u = true;
                break;
              }
            }
            B = parseInt(q + A.charAt(y++), 16);
            if (!C) {
              if (isNaN(B) || B < 0 || B > 255) {
                throw TypeError("Illegal str: Not a debug encoded string");
              }
            }
            z.view[x++] = B;
            v = true;
        }
        if (u) {
          throw TypeError("Illegal str: Invalid symbol at " + y);
        }
      }
      if (!C) {
        if (!D || !t) {
          throw TypeError("Illegal str: Missing offset or limit");
        }
        if (x < z.buffer.byteLength) {
          throw TypeError(
            "Illegal str: Not a debug encoded string (is it hex?) " +
            x +
            " < " +
            w
          );
        }
      }
      return z;
    };
    l.toHex = function (t, r) {
      t = typeof t === "undefined" ? this.offset : t;
      r = typeof r === "undefined" ? this.limit : r;
      if (!this.noAssert) {
        if (typeof t !== "number" || t % 1 !== 0) {
          throw TypeError("Illegal begin: Not an integer");
        }
        t >>>= 0;
        if (typeof r !== "number" || r % 1 !== 0) {
          throw TypeError("Illegal end: Not an integer");
        }
        r >>>= 0;
        if (t < 0 || t > r || r > this.buffer.byteLength) {
          throw RangeError(
            "Illegal range: 0 <= " +
            t +
            " <= " +
            r +
            " <= " +
            this.buffer.byteLength
          );
        }
      }
      var s = new Array(r - t),
        q;
      while (t < r) {
        q = this.view[t++];
        if (q < 16) {
          s.push("0", q.toString(16));
        } else {
          s.push(q.toString(16));
        }
      }
      return s.join("");
    };
    n.fromHex = function (x, v, u) {
      if (!u) {
        if (typeof x !== "string") {
          throw TypeError("Illegal str: Not a string");
        }
        if (x.length % 2 !== 0) {
          throw TypeError("Illegal str: Length not a multiple of 2");
        }
      }
      var r = x.length,
        w = new n((r / 2) | 0, v),
        q;
      for (var t = 0, s = 0; t < r; t += 2) {
        q = parseInt(x.substring(t, t + 2), 16);
        if (!u) {
          if (!isFinite(q) || q < 0 || q > 255) {
            throw TypeError("Illegal str: Contains non-hex characters");
          }
        }
        w.view[s++] = q;
      }
      w.limit = s;
      return w;
    };
    var o = (function () {
      var q = {};
      q.MAX_CODEPOINT = 1114111;
      q.encodeUTF8 = function (s, t) {
        var r = null;
        if (typeof s === "number") {
          (r = s),
          (s = function () {
            return null;
          });
        }
        while (r !== null || (r = s()) !== null) {
          if (r < 128) {
            t(r & 127);
          } else {
            if (r < 2048) {
              t(((r >> 6) & 31) | 192), t((r & 63) | 128);
            } else {
              if (r < 65536) {
                t(((r >> 12) & 15) | 224),
                  t(((r >> 6) & 63) | 128),
                  t((r & 63) | 128);
              } else {
                t(((r >> 18) & 7) | 240),
                  t(((r >> 12) & 63) | 128),
                  t(((r >> 6) & 63) | 128),
                  t((r & 63) | 128);
              }
            }
          }
          r = null;
        }
      };
      q.decodeUTF8 = function (v, x) {
        var t,
          r,
          w,
          u,
          s = function (y) {
            y = y.slice(0, y.indexOf(null));
            var z = Error(y.toString());
            z.name = "TruncatedError";
            z.bytes = y;
            throw z;
          };
        while ((t = v()) !== null) {
          if ((t & 128) === 0) {
            x(t);
          } else {
            if ((t & 224) === 192) {
              (r = v()) === null && s([t, r]), x(((t & 31) << 6) | (r & 63));
            } else {
              if ((t & 240) === 224) {
                ((r = v()) === null || (w = v()) === null) && s([t, r, w]),
                  x(((t & 15) << 12) | ((r & 63) << 6) | (w & 63));
              } else {
                if ((t & 248) === 240) {
                  ((r = v()) === null ||
                    (w = v()) === null ||
                    (u = v()) === null) &&
                  s([t, r, w, u]),
                    x(
                      ((t & 7) << 18) |
                      ((r & 63) << 12) |
                      ((w & 63) << 6) |
                      (u & 63)
                    );
                } else {
                  throw RangeError("Illegal starting byte: " + t);
                }
              }
            }
          }
        }
      };
      q.UTF16toUTF8 = function (t, u) {
        var s,
          r = null;
        while (true) {
          if ((s = r !== null ? r : t()) === null) {
            break;
          }
          if (s >= 55296 && s <= 57343) {
            if ((r = t()) !== null) {
              if (r >= 56320 && r <= 57343) {
                u((s - 55296) * 1024 + r - 56320 + 65536);
                r = null;
                continue;
              }
            }
          }
          u(s);
        }
        if (r !== null) {
          u(r);
        }
      };
      q.UTF8toUTF16 = function (s, t) {
        var r = null;
        if (typeof s === "number") {
          (r = s),
          (s = function () {
            return null;
          });
        }
        while (r !== null || (r = s()) !== null) {
          if (r <= 65535) {
            t(r);
          } else {
            (r -= 65536), t((r >> 10) + 55296), t((r % 1024) + 56320);
          }
          r = null;
        }
      };
      q.encodeUTF16toUTF8 = function (r, s) {
        q.UTF16toUTF8(r, function (t) {
          q.encodeUTF8(t, s);
        });
      };
      q.decodeUTF8toUTF16 = function (r, s) {
        q.decodeUTF8(r, function (t) {
          q.UTF8toUTF16(t, s);
        });
      };
      q.calculateCodePoint = function (r) {
        return r < 128 ? 1 : r < 2048 ? 2 : r < 65536 ? 3 : 4;
      };
      q.calculateUTF8 = function (t) {
        var s,
          r = 0;
        while ((s = t()) !== null) {
          r += s < 128 ? 1 : s < 2048 ? 2 : s < 65536 ? 3 : 4;
        }
        return r;
      };
      q.calculateUTF16asUTF8 = function (s) {
        var t = 0,
          r = 0;
        q.UTF16toUTF8(s, function (u) {
          ++t;
          r += u < 128 ? 1 : u < 2048 ? 2 : u < 65536 ? 3 : 4;
        });
        return [t, r];
      };
      return q;
    })();
    l.toUTF8 = function (r, q) {
      if (typeof r === "undefined") {
        r = this.offset;
      }
      if (typeof q === "undefined") {
        q = this.limit;
      }
      if (!this.noAssert) {
        if (typeof r !== "number" || r % 1 !== 0) {
          throw TypeError("Illegal begin: Not an integer");
        }
        r >>>= 0;
        if (typeof q !== "number" || q % 1 !== 0) {
          throw TypeError("Illegal end: Not an integer");
        }
        q >>>= 0;
        if (r < 0 || r > q || q > this.buffer.byteLength) {
          throw RangeError(
            "Illegal range: 0 <= " +
            r +
            " <= " +
            q +
            " <= " +
            this.buffer.byteLength
          );
        }
      }
      var t;
      try {
        o.decodeUTF8toUTF16(
          function () {
            return r < q ? this.view[r++] : null;
          }.bind(this),
          (t = f())
        );
      } catch (s) {
        if (r !== q) {
          throw RangeError("Illegal range: Truncated data, " + r + " != " + q);
        }
      }
      return t();
    };
    n.fromUTF8 = function (u, s, r) {
      if (!r) {
        if (typeof u !== "string") {
          throw TypeError("Illegal str: Not a string");
        }
      }
      var t = new n(o.calculateUTF16asUTF8(b(u), true)[1], s, r),
        q = 0;
      o.encodeUTF16toUTF8(b(u), function (v) {
        t.view[q++] = v;
      });
      t.limit = q;
      return t;
    };
    return n;
  })(d);
  var e = (function (j, k, f) {
    var l = {};
    l.ByteBuffer = j;
    l.c = j;
    var n = j;
    l.Long = k || null;
    l.VERSION = "5.0.1";
    l.WIRE_TYPES = {};
    l.WIRE_TYPES.VARINT = 0;
    l.WIRE_TYPES.BITS64 = 1;
    l.WIRE_TYPES.LDELIM = 2;
    l.WIRE_TYPES.STARTGROUP = 3;
    l.WIRE_TYPES.ENDGROUP = 4;
    l.WIRE_TYPES.BITS32 = 5;
    l.PACKABLE_WIRE_TYPES = [
      l.WIRE_TYPES.VARINT,
      l.WIRE_TYPES.BITS64,
      l.WIRE_TYPES.BITS32,
    ];
    l.TYPES = {
      int32: {
        name: "int32",
        wireType: l.WIRE_TYPES.VARINT,
        defaultValue: 0
      },
      uint32: {
        name: "uint32",
        wireType: l.WIRE_TYPES.VARINT,
        defaultValue: 0,
      },
      sint32: {
        name: "sint32",
        wireType: l.WIRE_TYPES.VARINT,
        defaultValue: 0,
      },
      int64: {
        name: "int64",
        wireType: l.WIRE_TYPES.VARINT,
        defaultValue: l.Long ? l.Long.ZERO : undefined,
      },
      uint64: {
        name: "uint64",
        wireType: l.WIRE_TYPES.VARINT,
        defaultValue: l.Long ? l.Long.UZERO : undefined,
      },
      sint64: {
        name: "sint64",
        wireType: l.WIRE_TYPES.VARINT,
        defaultValue: l.Long ? l.Long.ZERO : undefined,
      },
      bool: {
        name: "bool",
        wireType: l.WIRE_TYPES.VARINT,
        defaultValue: false,
      },
      double: {
        name: "double",
        wireType: l.WIRE_TYPES.BITS64,
        defaultValue: 0,
      },
      string: {
        name: "string",
        wireType: l.WIRE_TYPES.LDELIM,
        defaultValue: "",
      },
      bytes: {
        name: "bytes",
        wireType: l.WIRE_TYPES.LDELIM,
        defaultValue: null,
      },
      fixed32: {
        name: "fixed32",
        wireType: l.WIRE_TYPES.BITS32,
        defaultValue: 0,
      },
      sfixed32: {
        name: "sfixed32",
        wireType: l.WIRE_TYPES.BITS32,
        defaultValue: 0,
      },
      fixed64: {
        name: "fixed64",
        wireType: l.WIRE_TYPES.BITS64,
        defaultValue: l.Long ? l.Long.UZERO : undefined,
      },
      sfixed64: {
        name: "sfixed64",
        wireType: l.WIRE_TYPES.BITS64,
        defaultValue: l.Long ? l.Long.ZERO : undefined,
      },
      float: {
        name: "float",
        wireType: l.WIRE_TYPES.BITS32,
        defaultValue: 0
      },
      enum: {
        name: "enum",
        wireType: l.WIRE_TYPES.VARINT,
        defaultValue: 0
      },
      message: {
        name: "message",
        wireType: l.WIRE_TYPES.LDELIM,
        defaultValue: null,
      },
      group: {
        name: "group",
        wireType: l.WIRE_TYPES.STARTGROUP,
        defaultValue: null,
      },
    };
    l.MAP_KEY_TYPES = [
      l.TYPES.int32,
      l.TYPES.sint32,
      l.TYPES.sfixed32,
      l.TYPES.uint32,
      l.TYPES.fixed32,
      l.TYPES.int64,
      l.TYPES.sint64,
      l.TYPES.sfixed64,
      l.TYPES.uint64,
      l.TYPES.fixed64,
      l.TYPES.bool,
      l.TYPES.string,
      l.TYPES.bytes,
    ];
    l.ID_MIN = 1;
    l.ID_MAX = 536870911;
    l.convertFieldsToCamelCase = false;
    l.populateAccessors = true;
    l.populateDefaults = true;
    l.Util = (function () {
      var b = {};
      b.IS_NODE = !!(
        typeof process === "object" &&
        process + "" === "[object process]" &&
        !process.browser
      );
      b.XHR = function () {
        var r = [
          function () {
            return new XMLHttpRequest();
          },
          function () {
            return new ActiveXObject("Msxml2.XMLHTTP");
          },
          function () {
            return new ActiveXObject("Msxml3.XMLHTTP");
          },
          function () {
            return new ActiveXObject("Microsoft.XMLHTTP");
          },
        ];
        var o = null;
        for (var q = 0; q < r.length; q++) {
          try {
            o = r[q]();
          } catch (p) {
            continue;
          }
          break;
        }
        if (!o) {
          throw Error("XMLHttpRequest is not supported");
        }
        return o;
      };
      b.fetch = function (q, o) {
        if (o && typeof o != "function") {
          o = null;
        }
        if (b.IS_NODE) {
          if (o) {
            g.readFile(q, function (t, s) {
              if (t) {
                o(null);
              } else {
                o("" + s);
              }
            });
          } else {
            try {
              return g.readFileSync(q);
            } catch (r) {
              return null;
            }
          }
        } else {
          var p = b.XHR();
          p.open("GET", q, o ? true : false);
          p.setRequestHeader("Accept", "text/plain");
          if (typeof p.overrideMimeType === "function") {
            p.overrideMimeType("text/plain");
          }
          if (o) {
            p.onreadystatechange = function () {
              if (p.readyState != 4) {
                return;
              }
              if (
                p.status == 200 ||
                (p.status == 0 && typeof p.responseText === "string")
              ) {
                o(p.responseText);
              } else {
                o(null);
              }
            };
            if (p.readyState == 4) {
              return;
            }
            p.send(null);
          } else {
            p.send(null);
            if (
              p.status == 200 ||
              (p.status == 0 && typeof p.responseText === "string")
            ) {
              return p.responseText;
            }
            return null;
          }
        }
      };
      b.toCamelCase = function (o) {
        return o.replace(/_([a-zA-Z])/g, function (p, q) {
          return q.toUpperCase();
        });
      };
      return b;
    })();
    l.Lang = {
      DELIM: /[\s\{\}=;:\[\],'"\(\)<>]/g,
      RULE: /^(?:required|optional|repeated|map)$/,
      TYPE: /^(?:double|float|int32|uint32|sint32|int64|uint64|sint64|fixed32|sfixed32|fixed64|sfixed64|bool|string|bytes)$/,
      NAME: /^[a-zA-Z_][a-zA-Z_0-9]*$/,
      TYPEDEF: /^[a-zA-Z][a-zA-Z_0-9]*$/,
      TYPEREF: /^(?:\.?[a-zA-Z_][a-zA-Z_0-9]*)+$/,
      FQTYPEREF: /^(?:\.[a-zA-Z][a-zA-Z_0-9]*)+$/,
      NUMBER: /^-?(?:[1-9][0-9]*|0|0[xX][0-9a-fA-F]+|0[0-7]+|([0-9]*(\.[0-9]*)?([Ee][+-]?[0-9]+)?)|inf|nan)$/,
      NUMBER_DEC: /^(?:[1-9][0-9]*|0)$/,
      NUMBER_HEX: /^0[xX][0-9a-fA-F]+$/,
      NUMBER_OCT: /^0[0-7]+$/,
      NUMBER_FLT: /^([0-9]*(\.[0-9]*)?([Ee][+-]?[0-9]+)?|inf|nan)$/,
      BOOL: /^(?:true|false)$/i,
      ID: /^(?:[1-9][0-9]*|0|0[xX][0-9a-fA-F]+|0[0-7]+)$/,
      NEGID: /^\-?(?:[1-9][0-9]*|0|0[xX][0-9a-fA-F]+|0[0-7]+)$/,
      WHITESPACE: /\s/,
      STRING: /(?:"([^"\\]*(?:\\.[^"\\]*)*)")|(?:'([^'\\]*(?:\\.[^'\\]*)*)')/g,
      STRING_DQ: /(?:"([^"\\]*(?:\\.[^"\\]*)*)")/g,
      STRING_SQ: /(?:'([^'\\]*(?:\\.[^'\\]*)*)')/g,
    };
    l.DotProto = (function (s, t) {
      var q = {};
      var r = function (o) {
        this.source = o + "";
        this.index = 0;
        this.line = 1;
        this.stack = [];
        this._stringOpen = null;
      };
      var b = r.prototype;
      b._readString = function () {
        var o = this._stringOpen === '"' ? t.STRING_DQ : t.STRING_SQ;
        o.lastIndex = this.index - 1;
        var y = o.exec(this.source);
        if (!y) {
          throw Error("unterminated string");
        }
        this.index = o.lastIndex;
        this.stack.push(this._stringOpen);
        this._stringOpen = null;
        return y[1];
      };
      b.next = function () {
        if (this.stack.length > 0) {
          return this.stack.shift();
        }
        if (this.index >= this.source.length) {
          return null;
        }
        if (this._stringOpen !== null) {
          return this._readString();
        }
        var y, z, A;
        do {
          y = false;
          while (t.WHITESPACE.test((A = this.source.charAt(this.index)))) {
            if (A === "\n") {
              ++this.line;
            }
            if (++this.index === this.source.length) {
              return null;
            }
          }
          if (this.source.charAt(this.index) === "/") {
            ++this.index;
            if (this.source.charAt(this.index) === "/") {
              while (this.source.charAt(++this.index) !== "\n") {
                if (this.index == this.source.length) {
                  return null;
                }
              }
              ++this.index;
              ++this.line;
              y = true;
            } else {
              if ((A = this.source.charAt(this.index)) === "*") {
                do {
                  if (A === "\n") {
                    ++this.line;
                  }
                  if (++this.index === this.source.length) {
                    return null;
                  }
                  z = A;
                  A = this.source.charAt(this.index);
                } while (z !== "*" || A !== "/");
                ++this.index;
                y = true;
              } else {
                return "/";
              }
            }
          }
        } while (y);
        if (this.index === this.source.length) {
          return null;
        }
        var C = this.index;
        t.DELIM.lastIndex = 0;
        var o = t.DELIM.test(this.source.charAt(C++));
        if (!o) {
          while (
            C < this.source.length &&
            !t.DELIM.test(this.source.charAt(C))
          ) {
            ++C;
          }
        }
        var B = this.source.substring(this.index, (this.index = C));
        if (B === '"' || B === "'") {
          this._stringOpen = B;
        }
        return B;
      };
      b.peek = function () {
        if (this.stack.length === 0) {
          var o = this.next();
          if (o === null) {
            return null;
          }
          this.stack.push(o);
        }
        return this.stack[0];
      };
      b.skip = function (y) {
        var o = this.next();
        if (o !== y) {
          throw Error("illegal '" + o + "', '" + y + "' expected");
        }
      };
      b.omit = function (o) {
        if (this.peek() === o) {
          this.next();
          return true;
        }
        return false;
      };
      b.toString = function () {
        return (
          "Tokenizer (" +
          this.index +
          "/" +
          this.source.length +
          " at line " +
          this.line +
          ")"
        );
      };
      q.Tokenizer = r;
      var u = function (o) {
        this.tn = new r(o);
        this.proto3 = false;
      };
      var w = u.prototype;
      w.parse = function () {
        var A = {
          name: "[ROOT]",
          package: null,
          messages: [],
          enums: [],
          imports: [],
          options: {},
          services: [],
        };
        var y,
          z = true;
        try {
          while ((y = this.tn.next())) {
            switch (y) {
              case "package":
                if (!z || A["package"] !== null) {
                  throw Error("unexpected 'package'");
                }
                y = this.tn.next();
                if (!t.TYPEREF.test(y)) {
                  throw Error("illegal package name: " + y);
                }
                this.tn.skip(";");
                A["package"] = y;
                break;
              case "import":
                if (!z) {
                  throw Error("unexpected 'import'");
                }
                y = this.tn.peek();
                if (y === "public") {
                  this.tn.next();
                }
                y = this._readString();
                this.tn.skip(";");
                A.imports.push(y);
                break;
              case "syntax":
                if (!z) {
                  throw Error("unexpected 'syntax'");
                }
                this.tn.skip("=");
                if ((A.syntax = this._readString()) === "proto3") {
                  this.proto3 = true;
                }
                this.tn.skip(";");
                break;
              case "message":
                this._parseMessage(A, null);
                z = false;
                break;
              case "enum":
                this._parseEnum(A);
                z = false;
                break;
              case "option":
                this._parseOption(A);
                break;
              case "service":
                this._parseService(A);
                break;
              case "extend":
                this._parseExtend(A);
                break;
              default:
                throw Error("unexpected '" + y + "'");
            }
          }
        } catch (o) {
          o.message = "Parse error at line " + this.tn.line + ": " + o.message;
          throw o;
        }
        delete A.name;
        return A;
      };
      u.parse = function (o) {
        return new u(o).parse();
      };

      function x(y, z) {
        var o = -1,
          A = 1;
        if (y.charAt(0) == "-") {
          A = -1;
          y = y.substring(1);
        }
        if (t.NUMBER_DEC.test(y)) {
          o = parseInt(y);
        } else {
          if (t.NUMBER_HEX.test(y)) {
            o = parseInt(y.substring(2), 16);
          } else {
            if (t.NUMBER_OCT.test(y)) {
              o = parseInt(y.substring(1), 8);
            } else {
              throw Error("illegal id value: " + (A < 0 ? "-" : "") + y);
            }
          }
        }
        o = (A * o) | 0;
        if (!z && o < 0) {
          throw Error("illegal id value: " + (A < 0 ? "-" : "") + y);
        }
        return o;
      }

      function p(o) {
        var y = 1;
        if (o.charAt(0) == "-") {
          y = -1;
          o = o.substring(1);
        }
        if (t.NUMBER_DEC.test(o)) {
          return y * parseInt(o, 10);
        } else {
          if (t.NUMBER_HEX.test(o)) {
            return y * parseInt(o.substring(2), 16);
          } else {
            if (t.NUMBER_OCT.test(o)) {
              return y * parseInt(o.substring(1), 8);
            } else {
              if (o === "inf") {
                return y * Infinity;
              } else {
                if (o === "nan") {
                  return NaN;
                } else {
                  if (t.NUMBER_FLT.test(o)) {
                    return y * parseFloat(o);
                  }
                }
              }
            }
          }
        }
        throw Error("illegal number value: " + (y < 0 ? "-" : "") + o);
      }
      w._readString = function () {
        var y = "",
          z,
          o;
        do {
          o = this.tn.next();
          if (o !== "'" && o !== '"') {
            throw Error("illegal string delimiter: " + o);
          }
          y += this.tn.next();
          this.tn.skip(o);
          z = this.tn.peek();
        } while (z === '"' || z === '"');
        return y;
      };
      w._readValue = function (z) {
        var y = this.tn.peek(),
          o;
        if (y === '"' || y === "'") {
          return this._readString();
        }
        this.tn.next();
        if (t.NUMBER.test(y)) {
          return p(y);
        }
        if (t.BOOL.test(y)) {
          return y.toLowerCase() === "true";
        }
        if (z && t.TYPEREF.test(y)) {
          return y;
        }
        throw Error("illegal value: " + y);
      };
      w._parseOption = function (z, o) {
        var A = this.tn.next(),
          y = false;
        if (A === "(") {
          y = true;
          A = this.tn.next();
        }
        if (!t.TYPEREF.test(A)) {
          throw Error("illegal option name: " + A);
        }
        var B = A;
        if (y) {
          this.tn.skip(")");
          B = "(" + B + ")";
          A = this.tn.peek();
          if (t.FQTYPEREF.test(A)) {
            B += A;
            this.tn.next();
          }
        }
        this.tn.skip("=");
        this._parseOptionValue(z, B);
        if (!o) {
          this.tn.skip(";");
        }
      };

      function v(y, z, o) {
        if (typeof y[z] === "undefined") {
          y[z] = o;
        } else {
          if (!Array.isArray(y[z])) {
            y[z] = [y[z]];
          }
          y[z].push(o);
        }
      }
      w._parseOptionValue = function (o, z) {
        var y = this.tn.peek();
        if (y !== "{") {
          v(o.options, z, this._readValue(true));
        } else {
          this.tn.skip("{");
          while ((y = this.tn.next()) !== "}") {
            if (!t.NAME.test(y)) {
              throw Error("illegal option name: " + z + "." + y);
            }
            if (this.tn.omit(":")) {
              v(o.options, z + "." + y, this._readValue(true));
            } else {
              this._parseOptionValue(o, z + "." + y);
            }
          }
        }
      };
      w._parseService = function (y) {
        var z = this.tn.next();
        if (!t.NAME.test(z)) {
          throw Error(
            "illegal service name at line " + this.tn.line + ": " + z
          );
        }
        var A = z;
        var o = {
          name: A,
          rpc: {},
          options: {}
        };
        this.tn.skip("{");
        while ((z = this.tn.next()) !== "}") {
          if (z === "option") {
            this._parseOption(o);
          } else {
            if (z === "rpc") {
              this._parseServiceRPC(o);
            } else {
              throw Error("illegal service token: " + z);
            }
          }
        }
        this.tn.omit(";");
        y.services.push(o);
      };
      w._parseServiceRPC = function (y) {
        var z = "rpc",
          A = this.tn.next();
        if (!t.NAME.test(A)) {
          throw Error("illegal rpc service method name: " + A);
        }
        var B = A;
        var o = {
          request: null,
          response: null,
          request_stream: false,
          response_stream: false,
          options: {},
        };
        this.tn.skip("(");
        A = this.tn.next();
        if (A.toLowerCase() === "stream") {
          o.request_stream = true;
          A = this.tn.next();
        }
        if (!t.TYPEREF.test(A)) {
          throw Error("illegal rpc service request type: " + A);
        }
        o.request = A;
        this.tn.skip(")");
        A = this.tn.next();
        if (A.toLowerCase() !== "returns") {
          throw Error("illegal rpc service request type delimiter: " + A);
        }
        this.tn.skip("(");
        A = this.tn.next();
        if (A.toLowerCase() === "stream") {
          o.response_stream = true;
          A = this.tn.next();
        }
        o.response = A;
        this.tn.skip(")");
        A = this.tn.peek();
        if (A === "{") {
          this.tn.next();
          while ((A = this.tn.next()) !== "}") {
            if (A === "option") {
              this._parseOption(o);
            } else {
              throw Error("illegal rpc service token: " + A);
            }
          }
          this.tn.omit(";");
        } else {
          this.tn.skip(";");
        }
        if (typeof y[z] === "undefined") {
          y[z] = {};
        }
        y[z][B] = o;
      };
      w._parseMessage = function (z, A) {
        var o = !!A,
          B = this.tn.next();
        var y = {
          name: "",
          fields: [],
          enums: [],
          messages: [],
          options: {},
          services: [],
          oneofs: {},
        };
        if (!t.NAME.test(B)) {
          throw Error("illegal " + (o ? "group" : "message") + " name: " + B);
        }
        y.name = B;
        if (o) {
          this.tn.skip("=");
          A.id = x(this.tn.next());
          y.isGroup = true;
        }
        B = this.tn.peek();
        if (B === "[" && A) {
          this._parseFieldOptions(A);
        }
        this.tn.skip("{");
        while ((B = this.tn.next()) !== "}") {
          if (t.RULE.test(B)) {
            this._parseMessageField(y, B);
          } else {
            if (B === "oneof") {
              this._parseMessageOneOf(y);
            } else {
              if (B === "enum") {
                this._parseEnum(y);
              } else {
                if (B === "message") {
                  this._parseMessage(y);
                } else {
                  if (B === "option") {
                    this._parseOption(y);
                  } else {
                    if (B === "service") {
                      this._parseService(y);
                    } else {
                      if (B === "extensions") {
                        y.extensions = this._parseExtensionRanges();
                      } else {
                        if (B === "reserved") {
                          this._parseIgnored();
                        } else {
                          if (B === "extend") {
                            this._parseExtend(y);
                          } else {
                            if (t.TYPEREF.test(B)) {
                              if (!this.proto3) {
                                throw Error("illegal field rule: " + B);
                              }
                              this._parseMessageField(y, "optional", B);
                            } else {
                              throw Error("illegal message token: " + B);
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        this.tn.omit(";");
        z.messages.push(y);
        return y;
      };
      w._parseIgnored = function () {
        while (this.tn.peek() !== ";") {
          this.tn.next();
        }
        this.tn.skip(";");
      };
      w._parseMessageField = function (o, y, z) {
        if (!t.RULE.test(y)) {
          throw Error("illegal message field rule: " + y);
        }
        var A = {
          rule: y,
          type: "",
          name: "",
          options: {},
          id: 0
        };
        var B;
        if (y === "map") {
          if (z) {
            throw Error("illegal type: " + z);
          }
          this.tn.skip("<");
          B = this.tn.next();
          if (!t.TYPE.test(B) && !t.TYPEREF.test(B)) {
            throw Error("illegal message field type: " + B);
          }
          A.keytype = B;
          this.tn.skip(",");
          B = this.tn.next();
          if (!t.TYPE.test(B) && !t.TYPEREF.test(B)) {
            throw Error("illegal message field: " + B);
          }
          A.type = B;
          this.tn.skip(">");
          B = this.tn.next();
          if (!t.NAME.test(B)) {
            throw Error("illegal message field name: " + B);
          }
          A.name = B;
          this.tn.skip("=");
          A.id = x(this.tn.next());
          B = this.tn.peek();
          if (B === "[") {
            this._parseFieldOptions(A);
          }
          this.tn.skip(";");
        } else {
          z = typeof z !== "undefined" ? z : this.tn.next();
          if (z === "group") {
            var C = this._parseMessage(o, A);
            if (!/^[A-Z]/.test(C.name)) {
              throw Error("illegal group name: " + C.name);
            }
            A.type = C.name;
            A.name = C.name.toLowerCase();
            this.tn.omit(";");
          } else {
            if (!t.TYPE.test(z) && !t.TYPEREF.test(z)) {
              throw Error("illegal message field type: " + z);
            }
            A.type = z;
            B = this.tn.next();
            if (!t.NAME.test(B)) {
              throw Error("illegal message field name: " + B);
            }
            A.name = B;
            this.tn.skip("=");
            A.id = x(this.tn.next());
            B = this.tn.peek();
            if (B === "[") {
              this._parseFieldOptions(A);
            }
            this.tn.skip(";");
          }
        }
        o.fields.push(A);
        return A;
      };
      w._parseMessageOneOf = function (o) {
        var y = this.tn.next();
        if (!t.NAME.test(y)) {
          throw Error("illegal oneof name: " + y);
        }
        var A = y,
          z;
        var B = [];
        this.tn.skip("{");
        while ((y = this.tn.next()) !== "}") {
          z = this._parseMessageField(o, "optional", y);
          z.oneof = A;
          B.push(z.id);
        }
        this.tn.omit(";");
        o.oneofs[A] = B;
      };
      w._parseFieldOptions = function (y) {
        this.tn.skip("[");
        var z,
          o = true;
        while ((z = this.tn.peek()) !== "]") {
          if (!o) {
            this.tn.skip(",");
          }
          this._parseOption(y, true);
          o = false;
        }
        this.tn.next();
      };
      w._parseEnum = function (o) {
        var A = {
          name: "",
          values: [],
          options: {}
        };
        var z = this.tn.next();
        if (!t.NAME.test(z)) {
          throw Error("illegal name: " + z);
        }
        A.name = z;
        this.tn.skip("{");
        while ((z = this.tn.next()) !== "}") {
          if (z === "option") {
            this._parseOption(A);
          } else {
            if (!t.NAME.test(z)) {
              throw Error("illegal name: " + z);
            }
            this.tn.skip("=");
            var y = {
              name: z,
              id: x(this.tn.next(), true)
            };
            z = this.tn.peek();
            if (z === "[") {
              this._parseFieldOptions({
                options: {}
              });
            }
            this.tn.skip(";");
            A.values.push(y);
          }
        }
        this.tn.omit(";");
        o.enums.push(A);
      };
      w._parseExtensionRanges = function () {
        var A = [];
        var y, z, o;
        do {
          z = [];
          while (true) {
            y = this.tn.next();
            switch (y) {
              case "min":
                o = s.ID_MIN;
                break;
              case "max":
                o = s.ID_MAX;
                break;
              default:
                o = p(y);
                break;
            }
            z.push(o);
            if (z.length === 2) {
              break;
            }
            if (this.tn.peek() !== "to") {
              z.push(o);
              break;
            }
            this.tn.next();
          }
          A.push(z);
        } while (this.tn.omit(","));
        this.tn.skip(";");
        return A;
      };
      w._parseExtend = function (o) {
        var z = this.tn.next();
        if (!t.TYPEREF.test(z)) {
          throw Error("illegal extend reference: " + z);
        }
        var y = {
          ref: z,
          fields: []
        };
        this.tn.skip("{");
        while ((z = this.tn.next()) !== "}") {
          if (t.RULE.test(z)) {
            this._parseMessageField(y, z);
          } else {
            if (t.TYPEREF.test(z)) {
              if (!this.proto3) {
                throw Error("illegal field rule: " + z);
              }
              this._parseMessageField(y, "optional", z);
            } else {
              throw Error("illegal extend token: " + z);
            }
          }
        }
        this.tn.omit(";");
        o.messages.push(y);
        return y;
      };
      w.toString = function () {
        return "Parser at line " + this.tn.line;
      };
      q.Parser = u;
      return q;
    })(l, l.Lang);
    l.Reflect = (function (V) {
      var aa = {};
      var Z = function (q, o, p) {
        this.builder = q;
        this.parent = o;
        this.name = p;
        this.className;
      };
      var ab = Z.prototype;
      ab.fqn = function () {
        var p = this.name,
          o = this;
        do {
          o = o.parent;
          if (o == null) {
            break;
          }
          p = o.name + "." + p;
        } while (true);
        return p;
      };
      ab.toString = function (o) {
        return (o ? this.className + " " : "") + this.fqn();
      };
      ab.build = function () {
        throw Error(this.toString(true) + " cannot be built directly");
      };
      aa.T = Z;
      var P = function (r, o, p, q, s) {
        Z.call(this, r, o, p);
        this.className = "Namespace";
        this.children = [];
        this.options = q || {};
        this.syntax = s || "proto2";
      };
      var H = (P.prototype = Object.create(Z.prototype));
      H.getChildren = function (o) {
        o = o || null;
        if (o == null) {
          return this.children.slice();
        }
        var p = [];
        for (var q = 0, r = this.children.length; q < r; ++q) {
          if (this.children[q] instanceof o) {
            p.push(this.children[q]);
          }
        }
        return p;
      };
      H.addChild = function (o) {
        var p;
        if ((p = this.getChild(o.name))) {
          if (
            p instanceof ad.Field &&
            p.name !== p.originalName &&
            this.getChild(p.originalName) === null
          ) {
            p.name = p.originalName;
          } else {
            if (
              o instanceof ad.Field &&
              o.name !== o.originalName &&
              this.getChild(o.originalName) === null
            ) {
              o.name = o.originalName;
            } else {
              throw Error(
                "Duplicate name in namespace " +
                this.toString(true) +
                ": " +
                o.name
              );
            }
          }
        }
        this.children.push(o);
      };
      H.getChild = function (o) {
        var p = typeof o === "number" ? "id" : "name";
        for (var q = 0, r = this.children.length; q < r; ++q) {
          if (this.children[q][p] === o) {
            return this.children[q];
          }
        }
        return null;
      };
      H.resolve = function (q, t) {
        var s = typeof q === "string" ? q.split(".") : q,
          o = this,
          r = 0;
        if (s[r] === "") {
          while (o.parent !== null) {
            o = o.parent;
          }
          r++;
        }
        var p;
        do {
          do {
            if (!(o instanceof aa.Namespace)) {
              o = null;
              break;
            }
            p = o.getChild(s[r]);
            if (
              !p ||
              !(p instanceof aa.T) ||
              (t && !(p instanceof aa.Namespace))
            ) {
              o = null;
              break;
            }
            o = p;
            r++;
          } while (r < s.length);
          if (o != null) {
            break;
          }
          if (this.parent !== null) {
            return this.parent.resolve(q, t);
          }
        } while (o != null);
        return o;
      };
      H.qn = function (q) {
        var r = [],
          o = q;
        do {
          r.unshift(o.name);
          o = o.parent;
        } while (o !== null);
        for (var s = 1; s <= r.length; s++) {
          var p = r.slice(r.length - s);
          if (q === this.resolve(p, q instanceof aa.Namespace)) {
            return p.join(".");
          }
        }
        return q.fqn();
      };
      H.build = function () {
        var p = {};
        var q = this.children;
        for (var r = 0, s = q.length, o; r < s; ++r) {
          o = q[r];
          if (o instanceof P) {
            p[o.name] = o.build();
          }
        }
        if (Object.defineProperty) {
          Object.defineProperty(p, "$options", {
            value: this.buildOpt()
          });
        }
        return p;
      };
      H.buildOpt = function () {
        var q = {},
          p = Object.keys(this.options);
        for (var r = 0, t = p.length; r < t; ++r) {
          var s = p[r],
            o = this.options[p[r]];
          q[s] = o;
        }
        return q;
      };
      H.getOption = function (o) {
        if (typeof o === "undefined") {
          return this.options;
        }
        return typeof this.options[o] !== "undefined" ? this.options[o] : null;
      };
      aa.Namespace = P;
      var J = function (o, q, p, r) {
        this.type = o;
        this.resolvedType = q;
        this.isMapKey = p;
        this.syntax = r;
        if (p && V.MAP_KEY_TYPES.indexOf(o) < 0) {
          throw Error("Invalid map key type: " + o.name);
        }
      };
      var b = J.prototype;

      function F(o) {
        if (typeof o === "string") {
          o = V.TYPES[o];
        }
        if (typeof o.defaultValue === "undefined") {
          throw Error("default value for type " + o.name + " is not supported");
        }
        if (o == V.TYPES.bytes) {
          return new n(0);
        }
        return o.defaultValue;
      }
      J.defaultFieldValue = F;

      function W(o, p) {
        if (
          o &&
          typeof o.low === "number" &&
          typeof o.high === "number" &&
          typeof o.unsigned === "boolean" &&
          o.low === o.low &&
          o.high === o.high
        ) {
          return new V.Long(
            o.low,
            o.high,
            typeof p === "undefined" ? o.unsigned : p
          );
        }
        if (typeof o === "string") {
          return V.Long.fromString(o, p || false, 10);
        }
        if (typeof o === "number") {
          return V.Long.fromNumber(o, p || false);
        }
        throw Error("not convertible to Long");
      }
      b.verifyValue = function (q) {
        var t = function (v, u) {
          throw Error(
            "Illegal value for " +
            this.toString(true) +
            " of type " +
            this.type.name +
            ": " +
            v +
            " (" +
            u +
            ")"
          );
        }.bind(this);
        switch (this.type) {
          case V.TYPES.int32:
          case V.TYPES.sint32:
          case V.TYPES.sfixed32:
            if (typeof q !== "number" || (q === q && q % 1 !== 0)) {
              t(typeof q, "not an integer");
            }
            return q > 4294967295 ? q | 0 : q;
          case V.TYPES.uint32:
          case V.TYPES.fixed32:
            if (typeof q !== "number" || (q === q && q % 1 !== 0)) {
              t(typeof q, "not an integer");
            }
            return q < 0 ? q >>> 0 : q;
          case V.TYPES.int64:
          case V.TYPES.sint64:
          case V.TYPES.sfixed64:
            if (V.Long) {
              try {
                return W(q, false);
              } catch (o) {
                t(typeof q, o.message);
              }
            } else {
              t(typeof q, "requires Long.js");
            }
            case V.TYPES.uint64:
            case V.TYPES.fixed64:
              if (V.Long) {
                try {
                  return W(q, true);
                } catch (o) {
                  t(typeof q, o.message);
                }
              } else {
                t(typeof q, "requires Long.js");
              }
              case V.TYPES.bool:
                if (typeof q !== "boolean") {
                  t(typeof q, "not a boolean");
                }
                return q;
              case V.TYPES["float"]:
              case V.TYPES["double"]:
                if (typeof q !== "number") {
                  t(typeof q, "not a number");
                }
                return q;
              case V.TYPES.string:
                if (typeof q !== "string" && !(q && q instanceof String)) {
                  t(typeof q, "not a string");
                }
                return "" + q;
              case V.TYPES.bytes:
                if (j.isByteBuffer(q)) {
                  return q;
                }
                return j.wrap(q);
              case V.TYPES["enum"]:
                var s = this.resolvedType.getChildren(V.Reflect.Enum.Value);
                for (r = 0; r < s.length; r++) {
                  if (s[r].name == q) {
                    return s[r].id;
                  } else {
                    if (s[r].id == q) {
                      return s[r].id;
                    }
                  }
                }
                if (this.syntax === "proto3") {
                  if (typeof q !== "number" || (q === q && q % 1 !== 0)) {
                    t(typeof q, "not an integer");
                  }
                  if (q > 4294967295 || q < 0) {
                    t(typeof q, "not in range for uint32");
                  }
                  return q;
                } else {
                  t(q, "not a valid enum value");
                }
                case V.TYPES.group:
                case V.TYPES.message:
                  if (!q || typeof q !== "object") {
                    t(typeof q, "object expected");
                  }
                  if (q instanceof this.resolvedType.clazz) {
                    return q;
                  }
                  if (q instanceof V.Builder.Message) {
                    var p = {};
                    for (var r in q) {
                      if (q.hasOwnProperty(r)) {
                        p[r] = q[r];
                      }
                    }
                    q = p;
                  }
                  return new this.resolvedType.clazz(q);
        }
        throw Error(
          "[INTERNAL] Illegal value for " +
          this.toString(true) +
          ": " +
          q +
          " (undefined type " +
          this.type +
          ")"
        );
      };
      b.calculateLength = function (o, q) {
        if (q === null) {
          return 0;
        }
        var p;
        switch (this.type) {
          case V.TYPES.int32:
            return q < 0 ? n.calculateVarint64(q) : n.calculateVarint32(q);
          case V.TYPES.uint32:
            return n.calculateVarint32(q);
          case V.TYPES.sint32:
            return n.calculateVarint32(n.zigZagEncode32(q));
          case V.TYPES.fixed32:
          case V.TYPES.sfixed32:
          case V.TYPES["float"]:
            return 4;
          case V.TYPES.int64:
          case V.TYPES.uint64:
            return n.calculateVarint64(q);
          case V.TYPES.sint64:
            return n.calculateVarint64(n.zigZagEncode64(q));
          case V.TYPES.fixed64:
          case V.TYPES.sfixed64:
            return 8;
          case V.TYPES.bool:
            return 1;
          case V.TYPES["enum"]:
            return n.calculateVarint32(q);
          case V.TYPES["double"]:
            return 8;
          case V.TYPES.string:
            p = n.calculateUTF8Bytes(q);
            return n.calculateVarint32(p) + p;
          case V.TYPES.bytes:
            if (q.remaining() < 0) {
              throw Error(
                "Illegal value for " +
                this.toString(true) +
                ": " +
                q.remaining() +
                " bytes remaining"
              );
            }
            return n.calculateVarint32(q.remaining()) + q.remaining();
          case V.TYPES.message:
            p = this.resolvedType.calculate(q);
            return n.calculateVarint32(p) + p;
          case V.TYPES.group:
            p = this.resolvedType.calculate(q);
            return p + n.calculateVarint32((o << 3) | V.WIRE_TYPES.ENDGROUP);
        }
        throw Error(
          "[INTERNAL] Illegal value to encode in " +
          this.toString(true) +
          ": " +
          q +
          " (unknown type)"
        );
      };
      b.encodeValue = function (o, r, s) {
        if (r === null) {
          return s;
        }
        switch (this.type) {
          case V.TYPES.int32:
            if (r < 0) {
              s.writeVarint64(r);
            } else {
              s.writeVarint32(r);
            }
            break;
          case V.TYPES.uint32:
            s.writeVarint32(r);
            break;
          case V.TYPES.sint32:
            s.writeVarint32ZigZag(r);
            break;
          case V.TYPES.fixed32:
            s.writeUint32(r);
            break;
          case V.TYPES.sfixed32:
            s.writeInt32(r);
            break;
          case V.TYPES.int64:
          case V.TYPES.uint64:
            s.writeVarint64(r);
            break;
          case V.TYPES.sint64:
            s.writeVarint64ZigZag(r);
            break;
          case V.TYPES.fixed64:
            s.writeUint64(r);
            break;
          case V.TYPES.sfixed64:
            s.writeInt64(r);
            break;
          case V.TYPES.bool:
            if (typeof r === "string") {
              s.writeVarint32(r.toLowerCase() === "false" ? 0 : !!r);
            } else {
              s.writeVarint32(r ? 1 : 0);
            }
            break;
          case V.TYPES["enum"]:
            s.writeVarint32(r);
            break;
          case V.TYPES["float"]:
            s.writeFloat32(r);
            break;
          case V.TYPES["double"]:
            s.writeFloat64(r);
            break;
          case V.TYPES.string:
            s.writeVString(r);
            break;
          case V.TYPES.bytes:
            if (r.remaining() < 0) {
              throw Error(
                "Illegal value for " +
                this.toString(true) +
                ": " +
                r.remaining() +
                " bytes remaining"
              );
            }
            var q = r.offset;
            s.writeVarint32(r.remaining());
            s.append(r);
            r.offset = q;
            break;
          case V.TYPES.message:
            var p = new n().LE();
            this.resolvedType.encode(r, p);
            s.writeVarint32(p.offset);
            s.append(p.flip());
            break;
          case V.TYPES.group:
            this.resolvedType.encode(r, s);
            s.writeVarint32((o << 3) | V.WIRE_TYPES.ENDGROUP);
            break;
          default:
            throw Error(
              "[INTERNAL] Illegal value to encode in " +
              this.toString(true) +
              ": " +
              r +
              " (unknown type)"
            );
        }
        return s;
      };
      b.decode = function (r, s, o) {
        if (s != this.type.wireType) {
          throw Error("Unexpected wire type for element");
        }
        var q, p;
        switch (this.type) {
          case V.TYPES.int32:
            return r.readVarint32() | 0;
          case V.TYPES.uint32:
            return r.readVarint32() >>> 0;
          case V.TYPES.sint32:
            return r.readVarint32ZigZag() | 0;
          case V.TYPES.fixed32:
            return r.readUint32() >>> 0;
          case V.TYPES.sfixed32:
            return r.readInt32() | 0;
          case V.TYPES.int64:
            return r.readVarint64();
          case V.TYPES.uint64:
            return r.readVarint64().toUnsigned();
          case V.TYPES.sint64:
            return r.readVarint64ZigZag();
          case V.TYPES.fixed64:
            return r.readUint64();
          case V.TYPES.sfixed64:
            return r.readInt64();
          case V.TYPES.bool:
            return !!r.readVarint32();
          case V.TYPES["enum"]:
            return r.readVarint32();
          case V.TYPES["float"]:
            return r.readFloat();
          case V.TYPES["double"]:
            return r.readDouble();
          case V.TYPES.string:
            return r.readVString();
          case V.TYPES.bytes:
            p = r.readVarint32();
            if (r.remaining() < p) {
              throw Error(
                "Illegal number of bytes for " +
                this.toString(true) +
                ": " +
                p +
                " required but got only " +
                r.remaining()
              );
            }
            q = r.clone();
            q.limit = q.offset + p;
            r.offset += p;
            return q;
          case V.TYPES.message:
            p = r.readVarint32();
            return this.resolvedType.decode(r, p);
          case V.TYPES.group:
            return this.resolvedType.decode(r, -1, o);
        }
        throw Error("[INTERNAL] Illegal decode type");
      };
      b.valueFromString = function (o) {
        if (!this.isMapKey) {
          throw Error("valueFromString() called on non-map-key element");
        }
        switch (this.type) {
          case V.TYPES.int32:
          case V.TYPES.sint32:
          case V.TYPES.sfixed32:
          case V.TYPES.uint32:
          case V.TYPES.fixed32:
            return this.verifyValue(parseInt(o));
          case V.TYPES.int64:
          case V.TYPES.sint64:
          case V.TYPES.sfixed64:
          case V.TYPES.uint64:
          case V.TYPES.fixed64:
            return this.verifyValue(o);
          case V.TYPES.bool:
            return o === "true";
          case V.TYPES.string:
            return this.verifyValue(o);
          case V.TYPES.bytes:
            return n.fromBinary(o);
        }
      };
      b.valueToString = function (o) {
        if (!this.isMapKey) {
          throw Error("valueToString() called on non-map-key element");
        }
        if (this.type === V.TYPES.bytes) {
          return o.toString("binary");
        } else {
          return o.toString();
        }
      };
      aa.Element = J;
      var ad = function (s, p, q, r, o, t) {
        P.call(this, s, p, q, r, t);
        this.className = "Message";
        this.extensions = undefined;
        this.clazz = null;
        this.isGroup = !!o;
        this._fields = null;
        this._fieldsById = null;
        this._fieldsByName = null;
      };
      var L = (ad.prototype = Object.create(P.prototype));
      L.build = function (s) {
        if (this.clazz && !s) {
          return this.clazz;
        }
        var q = (function (y, E) {
          var A = E.getChildren(y.Reflect.Message.Field),
            v = E.getChildren(y.Reflect.Message.OneOf);
          var x = function (ak, ag) {
            y.Builder.Message.call(this);
            for (var aj = 0, af = v.length; aj < af; ++aj) {
              this[v[aj].name] = null;
            }
            for (aj = 0, af = A.length; aj < af; ++aj) {
              var ah = A[aj];
              this[ah.name] = ah.repeated ? [] : ah.map ? new y.Map(ah) : null;
              if (
                (ah.required || E.syntax === "proto3") &&
                ah.defaultValue !== null
              ) {
                this[ah.name] = ah.defaultValue;
              }
            }
            if (arguments.length > 0) {
              var ai;
              if (
                arguments.length === 1 &&
                ak !== null &&
                typeof ak === "object" &&
                (typeof ak.encode !== "function" || ak instanceof x) &&
                !Array.isArray(ak) &&
                !(ak instanceof y.Map) &&
                !n.isByteBuffer(ak) &&
                !(ak instanceof ArrayBuffer) &&
                !(y.Long && ak instanceof y.Long)
              ) {
                this.$set(ak);
              } else {
                for (aj = 0, af = arguments.length; aj < af; ++aj) {
                  if (typeof (ai = arguments[aj]) !== "undefined") {
                    this.$set(A[aj].name, ai);
                  }
                }
              }
            }
          };
          var B = (x.prototype = Object.create(y.Builder.Message.prototype));
          B.add = function (af, ai, ah) {
            var ag = E._fieldsByName[af];
            if (!ah) {
              if (!ag) {
                throw Error(this + "#" + af + " is undefined");
              }
              if (!(ag instanceof y.Reflect.Message.Field)) {
                throw Error(
                  this + "#" + af + " is not a field: " + ag.toString(true)
                );
              }
              if (!ag.repeated) {
                throw Error(this + "#" + af + " is not a repeated field");
              }
              ai = ag.verifyValue(ai, true);
            }
            if (this[af] === null) {
              this[af] = [];
            }
            this[af].push(ai);
            return this;
          };
          B.$add = B.add;
          B.set = function (ag, ak, ah) {
            if (ag && typeof ag === "object") {
              ah = ak;
              for (var aj in ag) {
                if (
                  ag.hasOwnProperty(aj) &&
                  typeof (ak = ag[aj]) !== "undefined"
                ) {
                  this.$set(aj, ak, ah);
                }
              }
              return this;
            }
            var ai = E._fieldsByName[ag];
            if (!ah) {
              if (!ai) {
                throw Error(this + "#" + ag + " is not a field: undefined");
              }
              if (!(ai instanceof y.Reflect.Message.Field)) {
                throw Error(
                  this + "#" + ag + " is not a field: " + ai.toString(true)
                );
              }
              this[ai.name] = ak = ai.verifyValue(ak);
            } else {
              this[ag] = ak;
            }
            if (ai && ai.oneof) {
              var af = this[ai.oneof.name];
              if (ak !== null) {
                if (af !== null && af !== ai.name) {
                  this[af] = null;
                }
                this[ai.oneof.name] = ai.name;
              } else {
                if (af === ag) {
                  this[ai.oneof.name] = null;
                }
              }
            }
            return this;
          };
          B.$set = B.set;
          B.get = function (af, ag) {
            if (ag) {
              return this[af];
            }
            var ah = E._fieldsByName[af];
            if (!ah || !(ah instanceof y.Reflect.Message.Field)) {
              throw Error(this + "#" + af + " is not a field: undefined");
            }
            if (!(ah instanceof y.Reflect.Message.Field)) {
              throw Error(
                this + "#" + af + " is not a field: " + ah.toString(true)
              );
            }
            return this[ah.name];
          };
          B.$get = B.get;
          for (var D = 0; D < A.length; D++) {
            var w = A[D];
            if (w instanceof y.Reflect.Message.ExtensionField) {
              continue;
            }
            if (E.builder.options.populateAccessors) {
              (function (ai) {
                var aj = ai.originalName.replace(/(_[a-zA-Z])/g, function (ak) {
                  return ak.toUpperCase().replace("_", "");
                });
                aj = aj.substring(0, 1).toUpperCase() + aj.substring(1);
                var ah = ai.originalName.replace(/([A-Z])/g, function (ak) {
                  return "_" + ak;
                });
                var ag = function (al, ak) {
                  this[ai.name] = ak ? al : ai.verifyValue(al);
                  return this;
                };
                var af = function () {
                  return this[ai.name];
                };
                if (E.getChild("set" + aj) === null) {
                  B["set" + aj] = ag;
                }
                if (E.getChild("set_" + ah) === null) {
                  B["set_" + ah] = ag;
                }
                if (E.getChild("get" + aj) === null) {
                  B["get" + aj] = af;
                }
                if (E.getChild("get_" + ah) === null) {
                  B["get_" + ah] = af;
                }
              })(w);
            }
          }
          B.encode = function (aj, ai) {
            if (typeof aj === "boolean") {
              (ai = aj), (aj = undefined);
            }
            var af = false;
            if (!aj) {
              (aj = new j()), (af = true);
            }
            var ah = aj.littleEndian;
            try {
              E.encode(this, aj.LE(), ai);
              return (af ? aj.flip() : aj).LE(ah);
            } catch (ag) {
              aj.LE(ah);
              throw ag;
            }
          };
          x.encode = function (ag, af, ah) {
            return new x(ag).encode(af, ah);
          };
          B.calculate = function () {
            return E.calculate(this);
          };
          B.encodeDelimited = function (ah) {
            var af = false;
            if (!ah) {
              (ah = new n()), (af = true);
            }
            var ag = new n().LE();
            E.encode(this, ag).flip();
            ah.writeVarint32(ag.remaining());
            ah.append(ag);
            return af ? ah.flip() : ah;
          };
          B.encodeAB = function () {
            try {
              return this.encode().toArrayBuffer();
            } catch (af) {
              if (af.encoded) {
                af.encoded = af.encoded.toArrayBuffer();
              }
              throw af;
            }
          };
          B.toArrayBuffer = B.encodeAB;
          B.encodeNB = function () {
            try {
              return this.encode().toBuffer();
            } catch (af) {
              if (af.encoded) {
                af.encoded = af.encoded.toBuffer();
              }
              throw af;
            }
          };
          B.toBuffer = B.encodeNB;
          B.encode64 = function () {
            try {
              return this.encode().toBase64();
            } catch (af) {
              if (af.encoded) {
                af.encoded = af.encoded.toBase64();
              }
              throw af;
            }
          };
          B.toBase64 = B.encode64;
          B.encodeHex = function () {
            try {
              return this.encode().toHex();
            } catch (af) {
              if (af.encoded) {
                af.encoded = af.encoded.toHex();
              }
              throw af;
            }
          };
          B.toHex = B.encodeHex;

          function u(aj, aq, at, am) {
            if (aj === null || typeof aj !== "object") {
              if (am && am instanceof y.Reflect.Enum) {
                var al = y.Reflect.Enum.getName(am.object, aj);
                if (al !== null) {
                  return al;
                }
              }
              return aj;
            }
            if (n.isByteBuffer(aj)) {
              return aq ? aj.toBase64() : aj.toBuffer();
            }
            if (y.Long.isLong(aj)) {
              return at ? aj.toString() : y.Long.fromValue(aj);
            }
            var ao;
            if (Array.isArray(aj)) {
              ao = [];
              aj.forEach(function (ag, af) {
                ao[af] = u(ag, aq, at, am);
              });
              return ao;
            }
            ao = {};
            if (aj instanceof y.Map) {
              var ai = aj.entries();
              for (var ar = ai.next(); !ar.done; ar = ai.next()) {
                ao[aj.keyElem.valueToString(ar.value[0])] = u(
                  ar.value[1],
                  aq,
                  at,
                  aj.valueElem.resolvedType
                );
              }
              return ao;
            }
            var ap = aj.$type,
              an = undefined;
            for (var ak in aj) {
              if (aj.hasOwnProperty(ak)) {
                if (ap && (an = ap.getChild(ak))) {
                  ao[ak] = u(aj[ak], aq, at, an.resolvedType);
                } else {
                  ao[ak] = u(aj[ak], aq, at);
                }
              }
            }
            return ao;
          }
          B.toRaw = function (af, ag) {
            return u(this, !!af, !!ag, this.$type);
          };
          B.encodeJSON = function () {
            return JSON.stringify(u(this, true, true, this.$type));
          };
          x.decode = function (af, aj) {
            if (typeof af === "string") {
              af = n.wrap(af, aj ? aj : "base64");
            }
            af = n.isByteBuffer(af) ? af : n.wrap(af);
            var ai = af.littleEndian;
            try {
              var ag = E.decode(af.LE());
              af.LE(ai);
              return ag;
            } catch (ah) {
              af.LE(ai);
              throw ah;
            }
          };
          x.decodeDelimited = function (ak, aj) {
            if (typeof ak === "string") {
              ak = n.wrap(ak, aj ? aj : "base64");
            }
            ak = n.isByteBuffer(ak) ? ak : n.wrap(ak);
            if (ak.remaining() < 1) {
              return null;
            }
            var ag = ak.offset,
              af = ak.readVarint32();
            if (ak.remaining() < af) {
              ak.offset = ag;
              return null;
            }
            try {
              var ah = E.decode(ak.slice(ak.offset, ak.offset + af).LE());
              ak.offset += af;
              return ah;
            } catch (ai) {
              ak.offset += af;
              throw ai;
            }
          };
          x.decode64 = function (af) {
            return x.decode(af, "base64");
          };
          x.decodeHex = function (af) {
            return x.decode(af, "hex");
          };
          x.decodeJSON = function (af) {
            return new x(JSON.parse(af));
          };
          B.toString = function () {
            return E.toString();
          };
          var ae;
          var C;
          var t;
          var z;
          if (Object.defineProperty) {
            Object.defineProperty(x, "$options", {
                value: E.buildOpt()
              }),
              Object.defineProperty(B, "$options", {
                value: x["$options"]
              }),
              Object.defineProperty(x, "$type", {
                value: E
              }),
              Object.defineProperty(B, "$type", {
                value: E
              });
          }
          return x;
        })(V, this);
        this._fields = [];
        this._fieldsById = {};
        this._fieldsByName = {};
        for (var p = 0, r = this.children.length, o; p < r; p++) {
          o = this.children[p];
          if (o instanceof M || o instanceof ad || o instanceof Q) {
            if (q.hasOwnProperty(o.name)) {
              throw Error(
                "Illegal reflect child of " +
                this.toString(true) +
                ": " +
                o.toString(true) +
                " cannot override static property '" +
                o.name +
                "'"
              );
            }
            q[o.name] = o.build();
          } else {
            if (o instanceof ad.Field) {
              o.build(),
                this._fields.push(o),
                (this._fieldsById[o.id] = o),
                (this._fieldsByName[o.name] = o);
            } else {
              if (!(o instanceof ad.OneOf) && !(o instanceof T)) {
                throw Error(
                  "Illegal reflect child of " +
                  this.toString(true) +
                  ": " +
                  this.children[p].toString(true)
                );
              }
            }
          }
        }
        return (this.clazz = q);
      };
      L.encode = function (o, s, r) {
        var w = null,
          p;
        for (var q = 0, t = this._fields.length, v; q < t; ++q) {
          p = this._fields[q];
          v = o[p.name];
          if (p.required && v === null) {
            if (w === null) {
              w = p;
            }
          } else {
            p.encode(r ? v : p.verifyValue(v), s, o);
          }
        }
        if (w !== null) {
          var u = Error(
            "Missing at least one required field for " +
            this.toString(true) +
            ": " +
            w
          );
          u.encoded = s;
          throw u;
        }
        return s;
      };
      L.calculate = function (r) {
        for (var o = 0, s = 0, t = this._fields.length, q, p; s < t; ++s) {
          q = this._fields[s];
          p = r[q.name];
          if (q.required && p === null) {
            throw Error(
              "Missing at least one required field for " +
              this.toString(true) +
              ": " +
              q
            );
          } else {
            o += q.calculate(p, r);
          }
        }
        return o;
      };

      function O(p, q) {
        var r = q.readVarint32(),
          s = r & 7,
          o = r >>> 3;
        switch (s) {
          case V.WIRE_TYPES.VARINT:
            do {
              r = q.readUint8();
            } while ((r & 128) === 128);
            break;
          case V.WIRE_TYPES.BITS64:
            q.offset += 8;
            break;
          case V.WIRE_TYPES.LDELIM:
            r = q.readVarint32();
            q.offset += r;
            break;
          case V.WIRE_TYPES.STARTGROUP:
            O(o, q);
            break;
          case V.WIRE_TYPES.ENDGROUP:
            if (o === p) {
              return false;
            } else {
              throw Error(
                "Illegal GROUPEND after unknown group: " +
                o +
                " (" +
                p +
                " expected)"
              );
            }
            case V.WIRE_TYPES.BITS32:
              q.offset += 4;
              break;
            default:
              throw Error("Illegal wire type in unknown group " + p + ": " + s);
        }
        return true;
      }
      L.decode = function (w, A, u) {
        A = typeof A === "number" ? A : -1;
        var C = w.offset,
          z = new this.clazz(),
          o,
          p,
          B,
          r;
        while (w.offset < C + A || (A === -1 && w.remaining() > 0)) {
          o = w.readVarint32();
          p = o & 7;
          B = o >>> 3;
          if (p === V.WIRE_TYPES.ENDGROUP) {
            if (B !== u) {
              throw Error(
                "Illegal group end indicator for " +
                this.toString(true) +
                ": " +
                B +
                " (" +
                (u ? u + " expected" : "not a group") +
                ")"
              );
            }
            break;
          }
          if (!(r = this._fieldsById[B])) {
            switch (p) {
              case V.WIRE_TYPES.VARINT:
                w.readVarint32();
                break;
              case V.WIRE_TYPES.BITS32:
                w.offset += 4;
                break;
              case V.WIRE_TYPES.BITS64:
                w.offset += 8;
                break;
              case V.WIRE_TYPES.LDELIM:
                var t = w.readVarint32();
                w.offset += t;
                break;
              case V.WIRE_TYPES.STARTGROUP:
                while (O(B, w)) {}
                break;
              default:
                throw Error(
                  "Illegal wire type for unknown field " +
                  B +
                  " in " +
                  this.toString(true) +
                  "#decode: " +
                  p
                );
            }
            continue;
          }
          if (r.repeated && !r.options.packed) {
            z[r.name].push(r.decode(p, w));
          } else {
            if (r.map) {
              var s = r.decode(p, w);
              z[r.name].set(s[0], s[1]);
            } else {
              z[r.name] = r.decode(p, w);
              if (r.oneof) {
                var q = z[r.oneof.name];
                if (q !== null && q !== r.name) {
                  z[q] = null;
                }
                z[r.oneof.name] = r.name;
              }
            }
          }
        }
        for (var v = 0, x = this._fields.length; v < x; ++v) {
          r = this._fields[v];
          if (z[r.name] === null) {
            if (this.syntax === "proto3") {
              z[r.name] = r.defaultValue;
            } else {
              if (r.required) {
                var y = Error(
                  "Missing at least one required field for " +
                  this.toString(true) +
                  ": " +
                  r.name
                );
                y.decoded = z;
                throw y;
              } else {
                if (V.populateDefaults && r.defaultValue !== null) {
                  z[r.name] = r.defaultValue;
                }
              }
            }
          }
        }
        return z;
      };
      aa.Message = ad;
      var X = function (t, p, q, v, r, x, w, o, s, u) {
        Z.call(this, t, p, x);
        this.className = "Message.Field";
        this.required = q === "required";
        this.repeated = q === "repeated";
        this.map = q === "map";
        this.keyType = v || null;
        this.type = r;
        this.resolvedType = null;
        this.id = w;
        this.options = o || {};
        this.defaultValue = null;
        this.oneof = s || null;
        this.syntax = u || "proto2";
        this.originalName = this.name;
        this.element = null;
        this.keyElement = null;
        if (
          this.builder.options.convertFieldsToCamelCase &&
          !(this instanceof ad.ExtensionField)
        ) {
          this.name = V.Util.toCamelCase(this.name);
        }
      };
      var N = (X.prototype = Object.create(Z.prototype));
      N.build = function () {
        this.element = new J(this.type, this.resolvedType, false, this.syntax);
        if (this.map) {
          this.keyElement = new J(this.keyType, undefined, true, this.syntax);
        }
        if (this.syntax === "proto3" && !this.repeated && !this.map) {
          this.defaultValue = J.defaultFieldValue(this.type);
        } else {
          if (typeof this.options["default"] !== "undefined") {
            this.defaultValue = this.verifyValue(this.options["default"]);
          }
        }
      };
      N.verifyValue = function (o, r) {
        r = r || false;
        var s = function (t, u) {
          throw Error(
            "Illegal value for " +
            this.toString(true) +
            " of type " +
            this.type.name +
            ": " +
            t +
            " (" +
            u +
            ")"
          );
        }.bind(this);
        if (o === null) {
          if (this.required) {
            s(typeof o, "required");
          }
          if (this.syntax === "proto3" && this.type !== V.TYPES.message) {
            s(typeof o, "proto3 field without field presence cannot be null");
          }
          return null;
        }
        var p;
        if (this.repeated && !r) {
          if (!Array.isArray(o)) {
            o = [o];
          }
          var q = [];
          for (p = 0; p < o.length; p++) {
            q.push(this.element.verifyValue(o[p]));
          }
          return q;
        }
        if (this.map && !r) {
          if (!(o instanceof V.Map)) {
            if (!(o instanceof Object)) {
              s(typeof o, "expected ProtoBuf.Map or raw object for map field");
            }
            return new V.Map(this, o);
          } else {
            return o;
          }
        }
        if (!this.repeated && Array.isArray(o)) {
          s(typeof o, "no array expected");
        }
        return this.element.verifyValue(o);
      };
      N.hasWirePresence = function (o, p) {
        if (this.syntax !== "proto3") {
          return o !== null;
        }
        if (this.oneof && p[this.oneof.name] === this.name) {
          return true;
        }
        switch (this.type) {
          case V.TYPES.int32:
          case V.TYPES.sint32:
          case V.TYPES.sfixed32:
          case V.TYPES.uint32:
          case V.TYPES.fixed32:
            return o !== 0;
          case V.TYPES.int64:
          case V.TYPES.sint64:
          case V.TYPES.sfixed64:
          case V.TYPES.uint64:
          case V.TYPES.fixed64:
            return o.low !== 0 || o.high !== 0;
          case V.TYPES.bool:
            return o;
          case V.TYPES["float"]:
          case V.TYPES["double"]:
            return o !== 0;
          case V.TYPES.string:
            return o.length > 0;
          case V.TYPES.bytes:
            return o.remaining() > 0;
          case V.TYPES["enum"]:
            return o !== 0;
          case V.TYPES.message:
            return o !== null;
          default:
            return true;
        }
      };
      N.encode = function (p, t, o) {
        if (this.type === null || typeof this.type !== "object") {
          throw Error(
            "[INTERNAL] Unresolved type in " +
            this.toString(true) +
            ": " +
            this.type
          );
        }
        if (p === null || (this.repeated && p.length == 0)) {
          return t;
        }
        try {
          if (this.repeated) {
            var s;
            if (
              this.options.packed &&
              V.PACKABLE_WIRE_TYPES.indexOf(this.type.wireType) >= 0
            ) {
              t.writeVarint32((this.id << 3) | V.WIRE_TYPES.LDELIM);
              t.ensureCapacity((t.offset += 1));
              var w = t.offset;
              for (s = 0; s < p.length; s++) {
                this.element.encodeValue(this.id, p[s], t);
              }
              var r = t.offset - w,
                u = n.calculateVarint32(r);
              if (u > 1) {
                var v = t.slice(w, t.offset);
                w += u - 1;
                t.offset = w;
                t.append(v);
              }
              t.writeVarint32(r, w - u);
            } else {
              for (s = 0; s < p.length; s++) {
                t.writeVarint32((this.id << 3) | this.type.wireType),
                  this.element.encodeValue(this.id, p[s], t);
              }
            }
          } else {
            if (this.map) {
              p.forEach(function (x, z, A) {
                var y =
                  n.calculateVarint32((1 << 3) | this.keyType.wireType) +
                  this.keyElement.calculateLength(1, z) +
                  n.calculateVarint32((2 << 3) | this.type.wireType) +
                  this.element.calculateLength(2, x);
                t.writeVarint32((this.id << 3) | V.WIRE_TYPES.LDELIM);
                t.writeVarint32(y);
                t.writeVarint32((1 << 3) | this.keyType.wireType);
                this.keyElement.encodeValue(1, z, t);
                t.writeVarint32((2 << 3) | this.type.wireType);
                this.element.encodeValue(2, x, t);
              }, this);
            } else {
              if (this.hasWirePresence(p, o)) {
                t.writeVarint32((this.id << 3) | this.type.wireType);
                this.element.encodeValue(this.id, p, t);
              }
            }
          }
        } catch (q) {
          throw Error(
            "Illegal value for " +
            this.toString(true) +
            ": " +
            p +
            " (" +
            q +
            ")"
          );
        }
        return t;
      };
      N.calculate = function (q, r) {
        q = this.verifyValue(q);
        if (this.type === null || typeof this.type !== "object") {
          throw Error(
            "[INTERNAL] Unresolved type in " +
            this.toString(true) +
            ": " +
            this.type
          );
        }
        if (q === null || (this.repeated && q.length == 0)) {
          return 0;
        }
        var o = 0;
        try {
          if (this.repeated) {
            var s, t;
            if (
              this.options.packed &&
              V.PACKABLE_WIRE_TYPES.indexOf(this.type.wireType) >= 0
            ) {
              o += n.calculateVarint32((this.id << 3) | V.WIRE_TYPES.LDELIM);
              t = 0;
              for (s = 0; s < q.length; s++) {
                t += this.element.calculateLength(this.id, q[s]);
              }
              o += n.calculateVarint32(t);
              o += t;
            } else {
              for (s = 0; s < q.length; s++) {
                (o += n.calculateVarint32((this.id << 3) | this.type.wireType)),
                (o += this.element.calculateLength(this.id, q[s]));
              }
            }
          } else {
            if (this.map) {
              q.forEach(function (v, x, u) {
                var w =
                  n.calculateVarint32((1 << 3) | this.keyType.wireType) +
                  this.keyElement.calculateLength(1, x) +
                  n.calculateVarint32((2 << 3) | this.type.wireType) +
                  this.element.calculateLength(2, v);
                o += n.calculateVarint32((this.id << 3) | V.WIRE_TYPES.LDELIM);
                o += n.calculateVarint32(w);
                o += w;
              }, this);
            } else {
              if (this.hasWirePresence(q, r)) {
                o += n.calculateVarint32((this.id << 3) | this.type.wireType);
                o += this.element.calculateLength(this.id, q);
              }
            }
          }
        } catch (p) {
          throw Error(
            "Illegal value for " +
            this.toString(true) +
            ": " +
            q +
            " (" +
            p +
            ")"
          );
        }
        return o;
      };
      N.decode = function (s, x, v) {
        var t, w;
        var p =
          (!this.map && s == this.type.wireType) ||
          (!v &&
            this.repeated &&
            this.options.packed &&
            s == V.WIRE_TYPES.LDELIM) ||
          (this.map && s == V.WIRE_TYPES.LDELIM);
        if (!p) {
          throw Error(
            "Illegal wire type for field " +
            this.toString(true) +
            ": " +
            s +
            " (" +
            this.type.wireType +
            " expected)"
          );
        }
        if (
          s == V.WIRE_TYPES.LDELIM &&
          this.repeated &&
          this.options.packed &&
          V.PACKABLE_WIRE_TYPES.indexOf(this.type.wireType) >= 0
        ) {
          if (!v) {
            w = x.readVarint32();
            w = x.offset + w;
            var q = [];
            while (x.offset < w) {
              q.push(this.decode(this.type.wireType, x, true));
            }
            return q;
          }
        }
        if (this.map) {
          var r = J.defaultFieldValue(this.keyType);
          t = J.defaultFieldValue(this.type);
          w = x.readVarint32();
          if (x.remaining() < w) {
            throw Error(
              "Illegal number of bytes for " +
              this.toString(true) +
              ": " +
              w +
              " required but got only " +
              x.remaining()
            );
          }
          var u = x.clone();
          u.limit = u.offset + w;
          x.offset += w;
          while (u.remaining() > 0) {
            var o = u.readVarint32();
            s = o & 7;
            var y = o >>> 3;
            if (y === 1) {
              r = this.keyElement.decode(u, s, y);
            } else {
              if (y === 2) {
                t = this.element.decode(u, s, y);
              } else {
                throw Error("Unexpected tag in map field key/value submessage");
              }
            }
          }
          return [r, t];
        }
        return this.element.decode(x, s, this.id);
      };
      aa.Message.Field = X;
      var I = function (u, q, p, r, s, o, t) {
        X.call(this, u, q, p, null, r, s, o, t);
        this.extension;
      };
      I.prototype = Object.create(X.prototype);
      aa.Message.ExtensionField = I;
      var G = function (q, o, p) {
        Z.call(this, q, o, p);
        this.fields = [];
      };
      aa.Message.OneOf = G;
      var M = function (r, o, p, q, s) {
        P.call(this, r, o, p, q, s);
        this.className = "Enum";
        this.object = null;
      };
      M.getName = function (s, o) {
        var p = Object.keys(s);
        for (var q = 0, r; q < p.length; ++q) {
          if (s[(r = p[q])] === o) {
            return r;
          }
        }
        return null;
      };
      var Y = (M.prototype = Object.create(P.prototype));
      Y.build = function (s) {
        if (this.object && !s) {
          return this.object;
        }
        var p = new V.Builder.Enum(),
          q = this.getChildren(M.Value);
        for (var o = 0, r = q.length; o < r; ++o) {
          p[q[o]["name"]] = q[o]["id"];
        }
        if (Object.defineProperty) {
          Object.defineProperty(p, "$options", {
            value: this.buildOpt(),
            enumerable: false,
          });
        }
        return (this.object = p);
      };
      aa.Enum = M;
      var R = function (r, p, q, o) {
        Z.call(this, r, p, q);
        this.className = "Enum.Value";
        this.id = o;
      };
      R.prototype = Object.create(Z.prototype);
      aa.Enum.Value = R;
      var T = function (r, p, q, o) {
        Z.call(this, r, p, q);
        this.field = o;
      };
      T.prototype = Object.create(Z.prototype);
      aa.Extension = T;
      var Q = function (q, r, o, p) {
        P.call(this, q, r, o, p);
        this.className = "Service";
        this.clazz = null;
      };
      var S = (Q.prototype = Object.create(P.prototype));
      S.build = function (o) {
        if (this.clazz && !o) {
          return this.clazz;
        }
        return (this.clazz = (function (r, w) {
          var x = function (z) {
            r.Builder.Service.call(this);
            this.rpcImpl =
              z ||
              function (C, B, A) {
                setTimeout(
                  A.bind(
                    this,
                    Error(
                      "Not implemented, see: https://github.com/dcodeIO/ProtoBuf.js/wiki/Services"
                    )
                  ),
                  0
                );
              };
          };
          var q = (x.prototype = Object.create(r.Builder.Service.prototype));
          var t = w.getChildren(r.Reflect.Service.RPCMethod);
          for (var v = 0; v < t.length; v++) {
            (function (z) {
              q[z.name] = function (B, A) {
                try {
                  try {
                    B = z.resolvedRequestType.clazz.decode(n.wrap(B));
                  } catch (C) {
                    if (!(C instanceof TypeError)) {
                      throw C;
                    }
                  }
                  if (B === null || typeof B !== "object") {
                    throw Error("Illegal arguments");
                  }
                  if (!(B instanceof z.resolvedRequestType.clazz)) {
                    B = new z.resolvedRequestType.clazz(B);
                  }
                  this.rpcImpl(z.fqn(), B, function (E, ae) {
                    if (E) {
                      A(E);
                      return;
                    }
                    try {
                      ae = z.resolvedResponseType.clazz.decode(ae);
                    } catch (D) {}
                    if (!ae || !(ae instanceof z.resolvedResponseType.clazz)) {
                      A(
                        Error(
                          "Illegal response type received in service method " +
                          w.name +
                          "#" +
                          z.name
                        )
                      );
                      return;
                    }
                    A(null, ae);
                  });
                } catch (C) {
                  setTimeout(A.bind(this, C), 0);
                }
              };
              x[z.name] = function (C, B, A) {
                new x(C)[z.name](B, A);
              };
              if (Object.defineProperty) {
                Object.defineProperty(x[z.name], "$options", {
                    value: z.buildOpt(),
                  }),
                  Object.defineProperty(q[z.name], "$options", {
                    value: x[z.name]["$options"],
                  });
              }
            })(t[v]);
          }
          var y;
          var u;
          var p;
          var s;
          if (Object.defineProperty) {
            Object.defineProperty(x, "$options", {
                value: w.buildOpt()
              }),
              Object.defineProperty(q, "$options", {
                value: x["$options"]
              }),
              Object.defineProperty(x, "$type", {
                value: w
              }),
              Object.defineProperty(q, "$type", {
                value: w
              });
          }
          return x;
        })(V, this));
      };
      aa.Service = Q;
      var ac = function (r, o, p, q) {
        Z.call(this, r, o, p);
        this.className = "Service.Method";
        this.options = q || {};
      };
      var U = (ac.prototype = Object.create(Z.prototype));
      U.buildOpt = H.buildOpt;
      aa.Service.Method = ac;
      var K = function (s, v, p, o, t, q, u, r) {
        ac.call(this, s, v, p, r);
        this.className = "Service.RPCMethod";
        this.requestName = o;
        this.responseName = t;
        this.requestStream = q;
        this.responseStream = u;
        this.resolvedRequestType = null;
        this.resolvedResponseType = null;
      };
      K.prototype = Object.create(ac.prototype);
      aa.Service.RPCMethod = K;
      return aa;
    })(l);
    l.Builder = (function (p, q, b) {
      var o = function (t) {
        this.ns = new b.Namespace(this, null, "");
        this.ptr = this.ns;
        this.resolved = false;
        this.result = null;
        this.files = {};
        this.importRoot = null;
        this.options = t || {};
      };
      var s = o.prototype;
      o.isMessage = function (t) {
        if (typeof t.name !== "string") {
          return false;
        }
        if (typeof t.values !== "undefined" || typeof t.rpc !== "undefined") {
          return false;
        }
        return true;
      };
      o.isMessageField = function (t) {
        if (
          typeof t.rule !== "string" ||
          typeof t.name !== "string" ||
          typeof t.type !== "string" ||
          typeof t.id === "undefined"
        ) {
          return false;
        }
        return true;
      };
      o.isEnum = function (t) {
        if (typeof t.name !== "string") {
          return false;
        }
        if (
          typeof t.values === "undefined" ||
          !Array.isArray(t.values) ||
          t.values.length === 0
        ) {
          return false;
        }
        return true;
      };
      o.isService = function (t) {
        if (typeof t.name !== "string" || typeof t.rpc !== "object" || !t.rpc) {
          return false;
        }
        return true;
      };
      o.isExtend = function (t) {
        if (typeof t.ref !== "string") {
          return false;
        }
        return true;
      };
      s.reset = function () {
        this.ptr = this.ns;
        return this;
      };
      s.define = function (t) {
        if (typeof t !== "string" || !q.TYPEREF.test(t)) {
          throw Error("illegal namespace: " + t);
        }
        t.split(".").forEach(function (u) {
          var v = this.ptr.getChild(u);
          if (v === null) {
            this.ptr.addChild((v = new b.Namespace(this, this.ptr, u)));
          }
          this.ptr = v;
        }, this);
        return this;
      };
      s.create = function (t) {
        if (!t) {
          return this;
        }
        if (!Array.isArray(t)) {
          t = [t];
        } else {
          if (t.length === 0) {
            return this;
          }
          t = t.slice();
        }
        var u = [t];
        while (u.length > 0) {
          t = u.pop();
          if (!Array.isArray(t)) {
            throw Error("not a valid namespace: " + JSON.stringify(t));
          }
          while (t.length > 0) {
            var w = t.shift();
            if (o.isMessage(w)) {
              var v = new b.Message(
                this,
                this.ptr,
                w.name,
                w.options,
                w.isGroup,
                w.syntax
              );
              var x = {};
              if (w.oneofs) {
                Object.keys(w.oneofs).forEach(function (z) {
                  v.addChild((x[z] = new b.Message.OneOf(this, v, z)));
                }, this);
              }
              if (w.fields) {
                w.fields.forEach(function (A) {
                  if (v.getChild(A.id | 0) !== null) {
                    throw Error(
                      "duplicate or invalid field id in " + v.name + ": " + A.id
                    );
                  }
                  if (A.options && typeof A.options !== "object") {
                    throw Error(
                      "illegal field options in " + v.name + "#" + A.name
                    );
                  }
                  var z = null;
                  if (typeof A.oneof === "string" && !(z = x[A.oneof])) {
                    throw Error(
                      "illegal oneof in " +
                      v.name +
                      "#" +
                      A.name +
                      ": " +
                      A.oneof
                    );
                  }
                  A = new b.Message.Field(
                    this,
                    v,
                    A.rule,
                    A.keytype,
                    A.type,
                    A.name,
                    A.id,
                    A.options,
                    z,
                    w.syntax
                  );
                  if (z) {
                    z.fields.push(A);
                  }
                  v.addChild(A);
                }, this);
              }
              var y = [];
              if (w.enums) {
                w.enums.forEach(function (z) {
                  y.push(z);
                });
              }
              if (w.messages) {
                w.messages.forEach(function (z) {
                  y.push(z);
                });
              }
              if (w.services) {
                w.services.forEach(function (z) {
                  y.push(z);
                });
              }
              if (w.extensions) {
                if (typeof w.extensions[0] === "number") {
                  v.extensions = [w.extensions];
                } else {
                  v.extensions = w.extensions;
                }
              }
              this.ptr.addChild(v);
              if (y.length > 0) {
                u.push(t);
                t = y;
                y = null;
                this.ptr = v;
                v = null;
                continue;
              }
              y = null;
            } else {
              if (o.isEnum(w)) {
                v = new b.Enum(this, this.ptr, w.name, w.options, w.syntax);
                w.values.forEach(function (z) {
                  v.addChild(new b.Enum.Value(this, v, z.name, z.id));
                }, this);
                this.ptr.addChild(v);
              } else {
                if (o.isService(w)) {
                  v = new b.Service(this, this.ptr, w.name, w.options);
                  Object.keys(w.rpc).forEach(function (z) {
                    var A = w.rpc[z];
                    v.addChild(
                      new b.Service.RPCMethod(
                        this,
                        v,
                        z,
                        A.request,
                        A.response,
                        !!A.request_stream,
                        !!A.response_stream,
                        A.options
                      )
                    );
                  }, this);
                  this.ptr.addChild(v);
                } else {
                  if (o.isExtend(w)) {
                    v = this.ptr.resolve(w.ref, true);
                    if (v) {
                      w.fields.forEach(function (C) {
                        if (v.getChild(C.id | 0) !== null) {
                          throw Error(
                            "duplicate extended field id in " +
                            v.name +
                            ": " +
                            C.id
                          );
                        }
                        if (v.extensions) {
                          var A = false;
                          v.extensions.forEach(function (E) {
                            if (C.id >= E[0] && C.id <= E[1]) {
                              A = true;
                            }
                          });
                          if (!A) {
                            throw Error(
                              "illegal extended field id in " +
                              v.name +
                              ": " +
                              C.id +
                              " (not within valid ranges)"
                            );
                          }
                        }
                        var D = C.name;
                        if (this.options.convertFieldsToCamelCase) {
                          D = p.Util.toCamelCase(D);
                        }
                        var z = new b.Message.ExtensionField(
                          this,
                          v,
                          C.rule,
                          C.type,
                          this.ptr.fqn() + "." + D,
                          C.id,
                          C.options
                        );
                        var B = new b.Extension(this, this.ptr, C.name, z);
                        z.extension = B;
                        this.ptr.addChild(B);
                        v.addChild(z);
                      }, this);
                    } else {
                      if (!/\.?google\.protobuf\./.test(w.ref)) {
                        throw Error(
                          "extended message " + w.ref + " is not defined"
                        );
                      }
                    }
                  } else {
                    throw Error("not a valid definition: " + JSON.stringify(w));
                  }
                }
              }
            }
            w = null;
            v = null;
          }
          t = null;
          this.ptr = this.ptr.parent;
        }
        this.resolved = false;
        this.result = null;
        return this;
      };

      function r(t) {
        if (t.messages) {
          t.messages.forEach(function (u) {
            u.syntax = t.syntax;
            r(u);
          });
        }
        if (t.enums) {
          t.enums.forEach(function (u) {
            u.syntax = t.syntax;
          });
        }
      }
      s["import"] = function (D, C) {
        var A = "/";
        if (typeof C === "string") {
          if (p.Util.IS_NODE) {}
          if (this.files[C] === true) {
            return this.reset();
          }
          this.files[C] = true;
        } else {
          if (typeof C === "object") {
            var F = C.root;
            if (p.Util.IS_NODE) {}
            if (F.indexOf("\\") >= 0 || C.file.indexOf("\\") >= 0) {
              A = "\\";
            }
            var z = F + A + C.file;
            if (this.files[z] === true) {
              return this.reset();
            }
            this.files[z] = true;
          }
        }
        if (D.imports && D.imports.length > 0) {
          var x,
            G = false;
          if (typeof C === "object") {
            this.importRoot = C.root;
            G = true;
            x = this.importRoot;
            C = C.file;
            if (x.indexOf("\\") >= 0 || C.indexOf("\\") >= 0) {
              A = "\\";
            }
          } else {
            if (typeof C === "string") {
              if (this.importRoot) {
                x = this.importRoot;
              } else {
                if (C.indexOf("/") >= 0) {
                  x = C.replace(/\/[^\/]*$/, "");
                  if (x === "") {
                    x = "/";
                  }
                } else {
                  if (C.indexOf("\\") >= 0) {
                    x = C.replace(/\\[^\\]*$/, "");
                    A = "\\";
                  } else {
                    x = ".";
                  }
                }
              }
            } else {
              x = null;
            }
          }
          for (var w = 0; w < D.imports.length; w++) {
            if (typeof D.imports[w] === "string") {
              if (!x) {
                throw Error("cannot determine import root");
              }
              var E = D.imports[w];
              if (E === "google/protobuf/descriptor.proto") {
                continue;
              }
              E = x + A + E;
              if (this.files[E] === true) {
                continue;
              }
              if (/\.proto$/i.test(E) && !p.DotProto) {
                E = E.replace(/\.proto$/, ".json");
              }
              var y = p.Util.fetch(E);
              if (y === null) {
                throw Error(
                  "failed to import '" + E + "' in '" + C + "': file not found"
                );
              }
              if (/\.json$/i.test(E)) {
                this["import"](JSON.parse(y + ""), E);
              } else {
                this["import"](p.DotProto.Parser.parse(y), E);
              }
            } else {
              if (!C) {
                this["import"](D.imports[w]);
              } else {
                if (/\.(\w+)$/.test(C)) {
                  this["import"](
                    D.imports[w],
                    C.replace(/^(.+)\.(\w+)$/, function (t, u, v) {
                      return u + "_import" + w + "." + v;
                    })
                  );
                } else {
                  this["import"](D.imports[w], C + "_import" + w);
                }
              }
            }
          }
          if (G) {
            this.importRoot = null;
          }
        }
        if (D["package"]) {
          this.define(D["package"]);
        }
        if (D.syntax) {
          r(D);
        }
        var B = this.ptr;
        if (D.options) {
          Object.keys(D.options).forEach(function (t) {
            B.options[t] = D.options[t];
          });
        }
        if (D.messages) {
          this.create(D.messages), (this.ptr = B);
        }
        if (D.enums) {
          this.create(D.enums), (this.ptr = B);
        }
        if (D.services) {
          this.create(D.services), (this.ptr = B);
        }
        if (D["extends"]) {
          this.create(D["extends"]);
        }
        return this.reset();
      };
      s.resolveAll = function () {
        var t;
        if (this.ptr == null || typeof this.ptr.type === "object") {
          return this;
        }
        if (this.ptr instanceof b.Namespace) {
          this.ptr.children.forEach(function (u) {
            this.ptr = u;
            this.resolveAll();
          }, this);
        } else {
          if (this.ptr instanceof b.Message.Field) {
            if (!q.TYPE.test(this.ptr.type)) {
              if (!q.TYPEREF.test(this.ptr.type)) {
                throw Error(
                  "illegal type reference in " +
                  this.ptr.toString(true) +
                  ": " +
                  this.ptr.type
                );
              }
              t = (this.ptr instanceof b.Message.ExtensionField ?
                this.ptr.extension.parent :
                this.ptr.parent
              ).resolve(this.ptr.type, true);
              if (!t) {
                throw Error(
                  "unresolvable type reference in " +
                  this.ptr.toString(true) +
                  ": " +
                  this.ptr.type
                );
              }
              this.ptr.resolvedType = t;
              if (t instanceof b.Enum) {
                this.ptr.type = p.TYPES["enum"];
                if (this.ptr.syntax === "proto3" && t.syntax !== "proto3") {
                  throw Error("proto3 message cannot reference proto2 enum");
                }
              } else {
                if (t instanceof b.Message) {
                  this.ptr.type = t.isGroup ? p.TYPES.group : p.TYPES.message;
                } else {
                  throw Error(
                    "illegal type reference in " +
                    this.ptr.toString(true) +
                    ": " +
                    this.ptr.type
                  );
                }
              }
            } else {
              this.ptr.type = p.TYPES[this.ptr.type];
            }
            if (this.ptr.map) {
              if (!q.TYPE.test(this.ptr.keyType)) {
                throw Error(
                  "illegal key type for map field in " +
                  this.ptr.toString(true) +
                  ": " +
                  this.ptr.keyType
                );
              }
              this.ptr.keyType = p.TYPES[this.ptr.keyType];
            }
          } else {
            if (this.ptr instanceof p.Reflect.Service.Method) {
              if (this.ptr instanceof p.Reflect.Service.RPCMethod) {
                t = this.ptr.parent.resolve(this.ptr.requestName, true);
                if (!t || !(t instanceof p.Reflect.Message)) {
                  throw Error(
                    "Illegal type reference in " +
                    this.ptr.toString(true) +
                    ": " +
                    this.ptr.requestName
                  );
                }
                this.ptr.resolvedRequestType = t;
                t = this.ptr.parent.resolve(this.ptr.responseName, true);
                if (!t || !(t instanceof p.Reflect.Message)) {
                  throw Error(
                    "Illegal type reference in " +
                    this.ptr.toString(true) +
                    ": " +
                    this.ptr.responseName
                  );
                }
                this.ptr.resolvedResponseType = t;
              } else {
                throw Error(
                  "illegal service type in " + this.ptr.toString(true)
                );
              }
            } else {
              if (
                !(this.ptr instanceof p.Reflect.Message.OneOf) &&
                !(this.ptr instanceof p.Reflect.Extension) &&
                !(this.ptr instanceof p.Reflect.Enum.Value)
              ) {
                throw Error(
                  "illegal object in namespace: " +
                  typeof this.ptr +
                  ": " +
                  this.ptr
                );
              }
            }
          }
        }
        return this.reset();
      };
      s.build = function (w) {
        this.reset();
        if (!this.resolved) {
          this.resolveAll(), (this.resolved = true), (this.result = null);
        }
        if (this.result === null) {
          this.result = this.ns.build();
        }
        if (!w) {
          return this.result;
        }
        var u = typeof w === "string" ? w.split(".") : w,
          v = this.result;
        for (var t = 0; t < u.length; t++) {
          if (v[u[t]]) {
            v = v[u[t]];
          } else {
            v = null;
            break;
          }
        }
        return v;
      };
      s.lookup = function (t, u) {
        return t ? this.ns.resolve(t, u) : this.ns;
      };
      s.toString = function () {
        return "Builder";
      };
      o.Message = function () {};
      o.Enum = function () {};
      o.Service = function () {};
      return o;
    })(l, l.Lang, l.Reflect);
    l.Map = (function (q, b) {
      var r = function (w, x) {
        if (!w.map) {
          throw Error("field is not a map");
        }
        this.field = w;
        this.keyElem = new b.Element(w.keyType, null, true, w.syntax);
        this.valueElem = new b.Element(w.type, w.resolvedType, false, w.syntax);
        this.map = {};
        Object.defineProperty(this, "size", {
          get: function () {
            return Object.keys(this.map).length;
          },
        });
        if (x) {
          var s = Object.keys(x);
          for (var t = 0; t < s.length; t++) {
            var u = this.keyElem.valueFromString(s[t]);
            var v = this.valueElem.verifyValue(x[s[t]]);
            this.map[this.keyElem.valueToString(u)] = {
              key: u,
              value: v
            };
          }
        }
      };
      var p = r.prototype;

      function o(s) {
        var t = 0;
        return {
          next: function () {
            if (t < s.length) {
              return {
                done: false,
                value: s[t++]
              };
            }
            return {
              done: true
            };
          },
        };
      }
      p.clear = function () {
        this.map = {};
      };
      p["delete"] = function (t) {
        var s = this.keyElem.valueToString(this.keyElem.verifyValue(t));
        var u = s in this.map;
        delete this.map[s];
        return u;
      };
      p.entries = function () {
        var u = [];
        var v = Object.keys(this.map);
        for (var t = 0, s; t < v.length; t++) {
          u.push([(s = this.map[v[t]]).key, s.value]);
        }
        return o(u);
      };
      p.keys = function () {
        var t = [];
        var s = Object.keys(this.map);
        for (var u = 0; u < s.length; u++) {
          t.push(this.map[s[u]].key);
        }
        return o(t);
      };
      p.values = function () {
        var u = [];
        var s = Object.keys(this.map);
        for (var t = 0; t < s.length; t++) {
          u.push(this.map[s[t]].value);
        }
        return o(u);
      };
      p.forEach = function (u, t) {
        var v = Object.keys(this.map);
        for (var s = 0, w; s < v.length; s++) {
          u.call(t, (w = this.map[v[s]]).value, w.key, this);
        }
      };
      p.set = function (u, s) {
        var v = this.keyElem.verifyValue(u);
        var t = this.valueElem.verifyValue(s);
        this.map[this.keyElem.valueToString(v)] = {
          key: v,
          value: t
        };
        return this;
      };
      p.get = function (t) {
        var s = this.keyElem.valueToString(this.keyElem.verifyValue(t));
        if (!(s in this.map)) {
          return undefined;
        }
        return this.map[s].value;
      };
      p.has = function (t) {
        var s = this.keyElem.valueToString(this.keyElem.verifyValue(t));
        return s in this.map;
      };
      return r;
    })(l, l.Reflect);
    l.loadProto = function (b, o, p) {
      if (
        typeof o === "string" ||
        (o && typeof o.file === "string" && typeof o.root === "string")
      ) {
        (p = o), (o = undefined);
      }
      return l.loadJson(l.DotProto.Parser.parse(b), o, p);
    };
    l.protoFromString = l.loadProto;
    l.loadProtoFile = function (p, b, q) {
      if (b && typeof b === "object") {
        (q = b), (b = null);
      } else {
        if (!b || typeof b !== "function") {
          b = null;
        }
      }
      if (b) {
        return l.Util.fetch(
          typeof p === "string" ? p : p.root + "/" + p.file,
          function (s) {
            if (s === null) {
              b(Error("Failed to fetch file"));
              return;
            }
            try {
              b(null, l.loadProto(s, q, p));
            } catch (r) {
              b(r);
            }
          }
        );
      }
      var o = l.Util.fetch(typeof p === "object" ? p.root + "/" + p.file : p);
      return o === null ? null : l.loadProto(o, q, p);
    };
    l.protoFromFile = l.loadProtoFile;
    l.newBuilder = function (b) {
      b = b || {};
      if (typeof b.convertFieldsToCamelCase === "undefined") {
        b.convertFieldsToCamelCase = l.convertFieldsToCamelCase;
      }
      if (typeof b.populateAccessors === "undefined") {
        b.populateAccessors = l.populateAccessors;
      }
      return new l.Builder(b);
    };
    l.loadJson = function (b, o, p) {
      if (
        typeof o === "string" ||
        (o && typeof o.file === "string" && typeof o.root === "string")
      ) {
        (p = o), (o = null);
      }
      if (!o || typeof o !== "object") {
        o = l.newBuilder();
      }
      if (typeof b === "string") {
        b = JSON.parse(b);
      }
      o["import"](b, p);
      o.resolveAll();
      return o;
    };
    l.loadJsonFile = function (p, b, q) {
      if (b && typeof b === "object") {
        (q = b), (b = null);
      } else {
        if (!b || typeof b !== "function") {
          b = null;
        }
      }
      if (b) {
        return l.Util.fetch(
          typeof p === "string" ? p : p.root + "/" + p.file,
          function (s) {
            if (s === null) {
              b(Error("Failed to fetch file"));
              return;
            }
            try {
              b(null, l.loadJson(JSON.parse(s), q, p));
            } catch (r) {
              b(r);
            }
          }
        );
      }
      var o = l.Util.fetch(typeof p === "object" ? p.root + "/" + p.file : p);
      return o === null ? null : l.loadJson(JSON.parse(o), q, p);
    };
    var m = function (b) {
      var s,
        u,
        v,
        w,
        r,
        p,
        t,
        q = new Array(
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          62,
          -1,
          -1,
          -1,
          63,
          52,
          53,
          54,
          55,
          56,
          57,
          58,
          59,
          60,
          61,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20,
          21,
          22,
          23,
          24,
          25,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          26,
          27,
          28,
          29,
          30,
          31,
          32,
          33,
          34,
          35,
          36,
          37,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          46,
          47,
          48,
          49,
          50,
          51,
          -1,
          -1,
          -1,
          -1,
          -1
        );
      p = b.length;
      r = 0;
      t = "";
      while (r < p) {
        do {
          s = q[b.charCodeAt(r++) & 255];
        } while (r < p && s == -1);
        if (s == -1) {
          break;
        }
        do {
          u = q[b.charCodeAt(r++) & 255];
        } while (r < p && u == -1);
        if (u == -1) {
          break;
        }
        t += String.fromCharCode((s << 2) | ((u & 48) >> 4));
        do {
          v = b.charCodeAt(r++) & 255;
          if (v == 61) {
            return t;
          }
          v = q[v];
        } while (r < p && v == -1);
        if (v == -1) {
          break;
        }
        t += String.fromCharCode(((u & 15) << 4) | ((v & 60) >> 2));
        do {
          w = b.charCodeAt(r++) & 255;
          if (w == 61) {
            return t;
          }
          w = q[w];
        } while (r < p && w == -1);
        if (w == -1) {
          break;
        }
        t += String.fromCharCode(((v & 3) << 6) | w);
      }
      return t;
    };
    var h = m(
      "cGFja2FnZSBNb2R1bGVzOwptZXNzYWdlIHByb2J1ZiB7CiAgICBtZXNzYWdlIFNldFVzZXJTdGF0dXNJbnB1dAogICAgewogICAgICAgIG9wdGlvbmFsIGludDMyIHN0YXR1cz0xOwogICAgfQoKICAgIG1lc3NhZ2UgU2V0VXNlclN0YXR1c091dHB1dAogICAgewogICAgICAgIG9wdGlvbmFsIGludDMyIG5vdGhpbmc9MTsKICAgIH0KCiAgICBtZXNzYWdlIEdldFVzZXJTdGF0dXNJbnB1dAogICAgewogICAgICAgIG9wdGlvbmFsIGludDMyIG5vdGhpbmc9MTsKICAgIH0KCiAgICBtZXNzYWdlIEdldFVzZXJTdGF0dXNPdXRwdXQKICAgIHsKICAgICAgICBvcHRpb25hbCBzdHJpbmcgc3RhdHVzPTE7CiAgICAgICAgb3B0aW9uYWwgc3RyaW5nIHN1YlVzZXJJZD0yOwogICAgfQoKICAgIG1lc3NhZ2UgU3ViVXNlclN0YXR1c0lucHV0CiAgICB7CiAgICAgICAgcmVwZWF0ZWQgc3RyaW5nIHVzZXJpZCA9MTsgCiAgICB9CgogICAgbWVzc2FnZSBTdWJVc2VyU3RhdHVzT3V0cHV0CiAgICB7CiAgICAgICAgb3B0aW9uYWwgaW50MzIgbm90aGluZz0xOyAgIAogICAgfQogICAgbWVzc2FnZSBWb2lwRHluYW1pY0lucHV0CiAgICB7CiAgICAgICAgcmVxdWlyZWQgaW50MzIgIGVuZ2luZVR5cGUgPSAxOwogICAgICAgIHJlcXVpcmVkIHN0cmluZyBjaGFubmVsTmFtZSA9IDI7CiAgICAgICAgb3B0aW9uYWwgc3RyaW5nIGNoYW5uZWxFeHRyYSA9IDM7CiAgICB9CgogICAgbWVzc2FnZSBWb2lwRHluYW1pY091dHB1dAogICAgewogICAgICAgICByZXF1aXJlZCBzdHJpbmcgZHluYW1pY0tleT0xOwogICAgfQogICAgbWVzc2FnZSBOb3RpZnlNc2cgewogICAgICAgIHJlcXVpcmVkIGludDMyIHR5cGUgPSAxOwogICAgICAgIG9wdGlvbmFsIGludDY0IHRpbWUgPSAyOwogICAgICAgIG9wdGlvbmFsIHN0cmluZyBjaHJtSWQ9MzsKICAgIH0KICAgIG1lc3NhZ2UgU3luY1JlcXVlc3RNc2cgewogICAgICAgIHJlcXVpcmVkIGludDY0IHN5bmNUaW1lID0gMTsKICAgICAgICByZXF1aXJlZCBib29sIGlzcG9sbGluZyA9IDI7CiAgICAgICAgb3B0aW9uYWwgYm9vbCBpc3dlYj0zOwogICAgICAgIG9wdGlvbmFsIGJvb2wgaXNQdWxsU2VuZD00OwogICAgICAgIG9wdGlvbmFsIGJvb2wgaXNLZWVwaW5nPTU7CiAgICAgICAgb3B0aW9uYWwgaW50NjQgc2VuZEJveFN5bmNUaW1lPTY7CiAgICB9CiAgICBtZXNzYWdlIFVwU3RyZWFtTWVzc2FnZSB7CiAgICAgICAgcmVxdWlyZWQgaW50MzIgc2Vzc2lvbklkID0gMTsKICAgICAgICByZXF1aXJlZCBzdHJpbmcgY2xhc3NuYW1lID0gMjsKICAgICAgICByZXF1aXJlZCBieXRlcyBjb250ZW50ID0gMzsKICAgICAgICBvcHRpb25hbCBzdHJpbmcgcHVzaFRleHQgPSA0OwogICAgICAgIG9wdGlvbmFsIHN0cmluZyBhcHBEYXRhID0gNTsKICAgICAgICByZXBlYXRlZCBzdHJpbmcgdXNlcklkID0gNjsKICAgICAgICBvcHRpb25hbCBpbnQ2NCBkZWxNc2dUaW1lID0gNzsgLy/liKDpmaTnirbmgIHnsbvlkb3ku6Tmtojmga/nmoTml7bpl7QKICAgICAgICBvcHRpb25hbCBzdHJpbmcgZGVsTXNnSWQgPSA4OyAgLy/liKDpmaTnirbmgIHnsbvlkb3ku6Tmtojmga8gSWQKICAgICAgICBvcHRpb25hbCBpbnQzMiBjb25maWdGbGFnID0gOTsgLy/moIforrDkvY3phY3nva7lj4LmlbDvvIznrKzkuIDkvY3vvIjmnIDlkI7kuIDkvY3vvInkuLp2b2lwUHVzaAogICAgfQogICAgbWVzc2FnZSBEb3duU3RyZWFtTWVzc2FnZXMgewogICAgICAgIHJlcGVhdGVkIERvd25TdHJlYW1NZXNzYWdlIGxpc3QgPSAxOwogICAgICAgIHJlcXVpcmVkIGludDY0IHN5bmNUaW1lID0gMjsKICAgICAgICBvcHRpb25hbCBib29sIGZpbmlzaGVkID0gMzsKICAgIH0KICAgIG1lc3NhZ2UgRG93blN0cmVhbU1lc3NhZ2UgewogICAgICAgIHJlcXVpcmVkIHN0cmluZyBmcm9tVXNlcklkID0gMTsKICAgICAgICByZXF1aXJlZCBDaGFubmVsVHlwZSB0eXBlID0gMjsKICAgICAgICBvcHRpb25hbCBzdHJpbmcgZ3JvdXBJZCA9IDM7CiAgICAgICAgcmVxdWlyZWQgc3RyaW5nIGNsYXNzbmFtZSA9IDQ7CiAgICAgICAgcmVxdWlyZWQgYnl0ZXMgY29udGVudCA9IDU7CiAgICAgICAgcmVxdWlyZWQgaW50NjQgZGF0YVRpbWUgPSA2OwogICAgICAgIHJlcXVpcmVkIGludDY0IHN0YXR1cyA9IDc7CiAgICAgICAgb3B0aW9uYWwgaW50NjQgZXh0cmEgPSA4OwogICAgICAgIG9wdGlvbmFsIHN0cmluZyBtc2dJZCA9IDk7CiAgICAgICAgb3B0aW9uYWwgaW50MzIgZGlyZWN0aW9uID0gMTA7IAogICAgfQogICAgZW51bSBDaGFubmVsVHlwZSB7CiAgICAgICAgUEVSU09OID0gMTsKICAgICAgICBQRVJTT05TID0gMjsKICAgICAgICBHUk9VUCA9IDM7CiAgICAgICAgVEVNUEdST1VQID0gNDsKICAgICAgICBDVVNUT01FUlNFUlZJQ0UgPSA1OwogICAgICAgIE5PVElGWSA9IDY7CiAgICAgICAgTUM9NzsKICAgICAgICBNUD04OwogICAgfQogICAgbWVzc2FnZSBDcmVhdGVEaXNjdXNzaW9uSW5wdXQgewogICAgICAgIG9wdGlvbmFsIHN0cmluZyBuYW1lID0gMTsKICAgIH0KICAgIG1lc3NhZ2UgQ3JlYXRlRGlzY3Vzc2lvbk91dHB1dCB7CiAgICAgICAgcmVxdWlyZWQgc3RyaW5nIGlkID0gMTsKICAgIH0KICAgIG1lc3NhZ2UgQ2hhbm5lbEludml0YXRpb25JbnB1dCB7CiAgICAgICAgcmVwZWF0ZWQgc3RyaW5nIHVzZXJzID0gMTsKICAgIH0KICAgIG1lc3NhZ2UgTGVhdmVDaGFubmVsSW5wdXQgewogICAgICAgIHJlcXVpcmVkIGludDMyIG5vdGhpbmcgPSAxOwogICAgfQogICAgbWVzc2FnZSBDaGFubmVsRXZpY3Rpb25JbnB1dCB7CiAgICAgICAgcmVxdWlyZWQgc3RyaW5nIHVzZXIgPSAxOwogICAgfQogICAgbWVzc2FnZSBSZW5hbWVDaGFubmVsSW5wdXQgewogICAgICAgIHJlcXVpcmVkIHN0cmluZyBuYW1lID0gMTsKICAgIH0KICAgIG1lc3NhZ2UgQ2hhbm5lbEluZm9JbnB1dCB7CiAgICAgICAgcmVxdWlyZWQgaW50MzIgbm90aGluZyA9IDE7CiAgICB9CiAgICBtZXNzYWdlIENoYW5uZWxJbmZvT3V0cHV0IHsKICAgICAgICByZXF1aXJlZCBDaGFubmVsVHlwZSB0eXBlID0gMTsKICAgICAgICByZXF1aXJlZCBzdHJpbmcgY2hhbm5lbElkID0gMjsKICAgICAgICByZXF1aXJlZCBzdHJpbmcgY2hhbm5lbE5hbWUgPSAzOwogICAgICAgIHJlcXVpcmVkIHN0cmluZyBhZG1pblVzZXJJZCA9IDQ7CiAgICAgICAgcmVwZWF0ZWQgc3RyaW5nIGZpcnN0VGVuVXNlcklkcyA9IDU7CiAgICAgICAgcmVxdWlyZWQgaW50MzIgb3BlblN0YXR1cyA9IDY7CiAgICB9CiAgICBtZXNzYWdlIENoYW5uZWxJbmZvc0lucHV0IHsKICAgICAgICByZXF1aXJlZCBpbnQzMiBwYWdlID0gMTsKICAgICAgICBvcHRpb25hbCBpbnQzMiBudW1iZXIgPSAyOwogICAgfQogICAgbWVzc2FnZSBDaGFubmVsSW5mb3NPdXRwdXQgewogICAgICAgIHJlcGVhdGVkIENoYW5uZWxJbmZvT3V0cHV0IGNoYW5uZWxzID0gMTsKICAgICAgICByZXF1aXJlZCBpbnQzMiB0b3RhbCA9IDI7CiAgICB9CiAgICBtZXNzYWdlIE1lbWJlckluZm8gewogICAgICAgIHJlcXVpcmVkIHN0cmluZyB1c2VySWQgPSAxOwogICAgICAgIHJlcXVpcmVkIHN0cmluZyB1c2VyTmFtZSA9IDI7CiAgICAgICAgcmVxdWlyZWQgc3RyaW5nIHVzZXJQb3J0cmFpdCA9IDM7CiAgICAgICAgcmVxdWlyZWQgc3RyaW5nIGV4dGVuc2lvbiA9IDQ7CiAgICB9CiAgICBtZXNzYWdlIEdyb3VwTWVtYmVyc0lucHV0IHsKICAgICAgICByZXF1aXJlZCBpbnQzMiBwYWdlID0gMTsKICAgICAgICBvcHRpb25hbCBpbnQzMiBudW1iZXIgPSAyOwogICAgfQogICAgbWVzc2FnZSBHcm91cE1lbWJlcnNPdXRwdXQgewogICAgICAgIHJlcGVhdGVkIE1lbWJlckluZm8gbWVtYmVycyA9IDE7CiAgICAgICAgcmVxdWlyZWQgaW50MzIgdG90YWwgPSAyOwogICAgfQogICAgbWVzc2FnZSBHZXRVc2VySW5mb0lucHV0IHsKICAgICAgICByZXF1aXJlZCBpbnQzMiBub3RoaW5nID0gMTsKICAgIH0KICAgIG1lc3NhZ2UgR2V0VXNlckluZm9PdXRwdXQgewogICAgICAgIHJlcXVpcmVkIHN0cmluZyB1c2VySWQgPSAxOwogICAgICAgIHJlcXVpcmVkIHN0cmluZyB1c2VyTmFtZSA9IDI7CiAgICAgICAgcmVxdWlyZWQgc3RyaW5nIHVzZXJQb3J0cmFpdCA9IDM7CiAgICB9CiAgICBtZXNzYWdlIEdldFNlc3Npb25JZElucHV0IHsKICAgICAgICByZXF1aXJlZCBpbnQzMiBub3RoaW5nID0gMTsKICAgIH0KICAgIG1lc3NhZ2UgR2V0U2Vzc2lvbklkT3V0cHV0IHsKICAgICAgICByZXF1aXJlZCBpbnQzMiBzZXNzaW9uSWQgPSAxOwogICAgfQogICAgZW51bSBGaWxlVHlwZSB7CiAgICAgICAgaW1hZ2UgPSAxOwogICAgICAgIGF1ZGlvID0gMjsKICAgICAgICB2aWRlbyA9IDM7CiAgICAgICAgZmlsZSA9IDQ7CiAgICB9CiAgICBtZXNzYWdlIEdldFFOdXBUb2tlbklucHV0IHsKICAgICAgICByZXF1aXJlZCBGaWxlVHlwZSB0eXBlID0gMTsKICAgIH0KICAgIG1lc3NhZ2UgR2V0UU5kb3dubG9hZFVybElucHV0IHsKICAgICAgICByZXF1aXJlZCBGaWxlVHlwZSB0eXBlID0gMTsKICAgICAgICByZXF1aXJlZCBzdHJpbmcga2V5ID0gMjsKICAgICAgICBvcHRpb25hbCBzdHJpbmcgIGZpbGVOYW1lID0gMzsKICAgIH0KICAgIG1lc3NhZ2UgR2V0UU51cFRva2VuT3V0cHV0IHsKICAgICAgICByZXF1aXJlZCBpbnQ2NCBkZWFkbGluZSA9IDE7CiAgICAgICAgcmVxdWlyZWQgc3RyaW5nIHRva2VuID0gMjsKICAgIH0KICAgIG1lc3NhZ2UgR2V0UU5kb3dubG9hZFVybE91dHB1dCB7CiAgICAgICAgcmVxdWlyZWQgc3RyaW5nIGRvd25sb2FkVXJsID0gMTsKICAgIH0KICAgIG1lc3NhZ2UgQWRkMkJsYWNrTGlzdElucHV0IHsKICAgICAgICByZXF1aXJlZCBzdHJpbmcgdXNlcklkID0gMTsKICAgIH0KICAgIG1lc3NhZ2UgUmVtb3ZlRnJvbUJsYWNrTGlzdElucHV0IHsKICAgICAgICByZXF1aXJlZCBzdHJpbmcgdXNlcklkID0gMTsKICAgIH0KICAgIG1lc3NhZ2UgUXVlcnlCbGFja0xpc3RJbnB1dCB7CiAgICAgICAgcmVxdWlyZWQgaW50MzIgbm90aGluZyA9IDE7CiAgICB9CiAgICBtZXNzYWdlIFF1ZXJ5QmxhY2tMaXN0T3V0cHV0IHsKICAgICAgICByZXBlYXRlZCBzdHJpbmcgdXNlcklkcyA9IDE7CiAgICB9CiAgICBtZXNzYWdlIEJsYWNrTGlzdFN0YXR1c0lucHV0IHsKICAgICAgICByZXF1aXJlZCBzdHJpbmcgdXNlcklkID0gMTsKICAgIH0KICAgIG1lc3NhZ2UgQmxvY2tQdXNoSW5wdXQgewogICAgICAgIHJlcXVpcmVkIHN0cmluZyBibG9ja2VlSWQgPSAxOwogICAgfQogICAgbWVzc2FnZSBNb2RpZnlQZXJtaXNzaW9uSW5wdXQgewogICAgICAgIHJlcXVpcmVkIGludDMyIG9wZW5TdGF0dXMgPSAxOwogICAgfQogICAgbWVzc2FnZSBHcm91cElucHV0IHsKICAgICAgICByZXBlYXRlZCBHcm91cEluZm8gZ3JvdXBJbmZvID0gMTsKICAgIH0KICAgIG1lc3NhZ2UgR3JvdXBPdXRwdXQgewogICAgICAgIHJlcXVpcmVkIGludDMyIG5vdGhpbmcgPSAxOwogICAgfQogICAgbWVzc2FnZSBHcm91cEluZm8gewogICAgICAgIHJlcXVpcmVkIHN0cmluZyBpZCA9IDE7CiAgICAgICAgcmVxdWlyZWQgc3RyaW5nIG5hbWUgPSAyOwogICAgfQogICAgbWVzc2FnZSBHcm91cEhhc2hJbnB1dCB7CiAgICAgICAgcmVxdWlyZWQgc3RyaW5nIHVzZXJJZCA9IDE7CiAgICAgICAgcmVxdWlyZWQgc3RyaW5nIGdyb3VwSGFzaENvZGUgPSAyOwogICAgfQogICAgbWVzc2FnZSBHcm91cEhhc2hPdXRwdXQgewogICAgICAgIHJlcXVpcmVkIEdyb3VwSGFzaFR5cGUgcmVzdWx0ID0gMTsKICAgIH0KICAgIGVudW0gR3JvdXBIYXNoVHlwZSB7CiAgICAgICAgZ3JvdXBfc3VjY2VzcyA9IDB4MDA7CiAgICAgICAgZ3JvdXBfZmFpbHVyZSA9IDB4MDE7CiAgICB9CiAgICBtZXNzYWdlIENocm1JbnB1dCB7CiAgICAgICAgcmVxdWlyZWQgaW50MzIgbm90aGluZyA9IDE7CiAgICB9CiAgICBtZXNzYWdlIENocm1PdXRwdXQgewogICAgICAgIHJlcXVpcmVkIGludDMyIG5vdGhpbmcgPSAxOwogICAgfQogICAgbWVzc2FnZSBDaHJtUHVsbE1zZyB7CiAgICAgICAgcmVxdWlyZWQgaW50NjQgc3luY1RpbWUgPSAxOwogICAgICAgIHJlcXVpcmVkIGludDMyIGNvdW50ID0gMjsKICAgIH0KICAgIAogICAgbWVzc2FnZSBDaHJtUHVsbE1zZ05ldyAKICAgIHsKICAgICByZXF1aXJlZCBpbnQzMiBjb3VudCA9IDE7CiAgICAgcmVxdWlyZWQgaW50NjQgc3luY1RpbWUgPSAyOwogICAgIG9wdGlvbmFsIHN0cmluZyBjaHJtSWQ9MzsKICAgIH0KICAgIAogICAgbWVzc2FnZSBSZWxhdGlvbnNJbnB1dAogICAgewogICAgICAgIHJlcXVpcmVkIENoYW5uZWxUeXBlIHR5cGUgPSAxOwogICAgICAgIG9wdGlvbmFsIERvd25TdHJlYW1NZXNzYWdlIG1zZyA9MjsKICAgICAgICBvcHRpb25hbCBpbnQzMiBjb3VudCA9IDM7CiAgICAgICAgb3B0aW9uYWwgaW50MzIgb2Zmc2V0ID0gNDsKICAgICAgICBvcHRpb25hbCBpbnQ2NCBzdGFydFRpbWUgPSA1OwogICAgICAgIG9wdGlvbmFsIGludDY0IGVuZFRpbWUgPSA2OwogICAgfQogICAgbWVzc2FnZSBSZWxhdGlvbnNPdXRwdXQKICAgIHsKICAgICAgICByZXBlYXRlZCBSZWxhdGlvbkluZm8gaW5mbyA9IDE7CiAgICB9CiAgICBtZXNzYWdlIFJlbGF0aW9uSW5mbwogICAgewogICAgICAgIHJlcXVpcmVkIENoYW5uZWxUeXBlIHR5cGUgPSAxOwogICAgICAgIHJlcXVpcmVkIHN0cmluZyB1c2VySWQgPSAyOwogICAgICAgIG9wdGlvbmFsIERvd25TdHJlYW1NZXNzYWdlIG1zZyA9MzsKICAgICAgICBvcHRpb25hbCBpbnQ2NCByZWFkTXNnVGltZT0gNDsKICAgIH0KICAgIG1lc3NhZ2UgUmVsYXRpb25JbmZvUmVhZFRpbWUKICAgIHsKICAgICAgICByZXF1aXJlZCBDaGFubmVsVHlwZSB0eXBlID0gMTsKICAgICAgICByZXF1aXJlZCBpbnQ2NCByZWFkTXNnVGltZT0gMjsKICAgICAgICByZXF1aXJlZCBzdHJpbmcgdGFyZ2V0SWQgPSAzOwogICAgfQogICAgbWVzc2FnZSBDbGVhbkhpc01zZ0lucHV0CiAgICB7CiAgICAgICAgIHJlcXVpcmVkIHN0cmluZyB0YXJnZXRJZCA9IDE7CiAgICAgICAgIHJlcXVpcmVkIGludDY0IGRhdGFUaW1lID0gMjsKICAgICAgICAgb3B0aW9uYWwgaW50MzIgY29udmVyc2F0aW9uVHlwZT0gMzsKICAgIH0KICAgIG1lc3NhZ2UgSGlzdG9yeU1lc3NhZ2VJbnB1dAogICAgewogICAgICAgIHJlcXVpcmVkIHN0cmluZyB0YXJnZXRJZCA9IDE7CiAgICAgICAgcmVxdWlyZWQgaW50NjQgZGF0YVRpbWUgPTI7CiAgICAgICAgcmVxdWlyZWQgaW50MzIgc2l6ZSAgPSAzOwogICAgfQoKICAgIG1lc3NhZ2UgSGlzdG9yeU1lc3NhZ2VzT3VwdXQKICAgIHsKICAgICAgICByZXBlYXRlZCBEb3duU3RyZWFtTWVzc2FnZSBsaXN0ID0gMTsKICAgICAgICByZXF1aXJlZCBpbnQ2NCBzeW5jVGltZSA9IDI7CiAgICAgICAgcmVxdWlyZWQgaW50MzIgaGFzTXNnID0gMzsKICAgIH0KICAgIG1lc3NhZ2UgUXVlcnlDaGF0cm9vbUluZm9JbnB1dAogICAgewogICAgIHJlcXVpcmVkIGludDMyIGNvdW50PSAxOwogICAgIG9wdGlvbmFsIGludDMyIG9yZGVyPSAyOwogICAgfQoKICAgIG1lc3NhZ2UgUXVlcnlDaGF0cm9vbUluZm9PdXRwdXQKICAgIHsKICAgICBvcHRpb25hbCBpbnQzMiB1c2VyVG90YWxOdW1zID0gMTsKICAgICByZXBlYXRlZCBDaHJtTWVtYmVyIHVzZXJJbmZvcyA9IDI7CiAgICB9CiAgICBtZXNzYWdlIENocm1NZW1iZXIKICAgIHsKICAgICByZXF1aXJlZCBpbnQ2NCB0aW1lID0gMTsKICAgICByZXF1aXJlZCBzdHJpbmcgaWQgPSAyOwogICAgfQogICAgbWVzc2FnZSBNUEZvbGxvd0lucHV0CiAgICB7CiAgICAgICAgcmVxdWlyZWQgc3RyaW5nIGlkID0gMTsKICAgIH0KCiAgICBtZXNzYWdlIE1QRm9sbG93T3V0cHV0CiAgICB7CiAgICAgICAgcmVxdWlyZWQgaW50MzIgbm90aGluZyA9IDE7CiAgICAgICAgb3B0aW9uYWwgTXBJbmZvIGluZm8gPTI7CiAgICB9CgogICAgbWVzc2FnZSBNQ0ZvbGxvd0lucHV0CiAgICB7CiAgICAgICAgcmVxdWlyZWQgc3RyaW5nIGlkID0gMTsKICAgIH0KCiAgICBtZXNzYWdlIE1DRm9sbG93T3V0cHV0CiAgICB7CiAgICAgICAgcmVxdWlyZWQgaW50MzIgbm90aGluZyA9IDE7CiAgICAgICAgb3B0aW9uYWwgTXBJbmZvIGluZm8gPTI7CiAgICB9CgogICAgbWVzc2FnZSBNcEluZm8gIAogICAgewogICAgICAgIHJlcXVpcmVkIHN0cmluZyBtcGlkPTE7CiAgICAgICAgcmVxdWlyZWQgc3RyaW5nIG5hbWUgPSAyOwogICAgICAgIHJlcXVpcmVkIHN0cmluZyB0eXBlID0gMzsKICAgICAgICByZXF1aXJlZCBpbnQ2NCB0aW1lPTQ7CiAgICAgICAgb3B0aW9uYWwgc3RyaW5nIHBvcnRyYWl0VXJsPTU7CiAgICAgICAgb3B0aW9uYWwgc3RyaW5nIGV4dHJhID02OwogICAgfQoKICAgIG1lc3NhZ2UgU2VhcmNoTXBJbnB1dAogICAgewogICAgICAgIHJlcXVpcmVkIGludDMyIHR5cGU9MTsKICAgICAgICByZXF1aXJlZCBzdHJpbmcgaWQ9MjsKICAgIH0KCiAgICBtZXNzYWdlIFNlYXJjaE1wT3V0cHV0CiAgICB7CiAgICAgICAgcmVxdWlyZWQgaW50MzIgbm90aGluZz0xOwogICAgICAgIHJlcGVhdGVkIE1wSW5mbyBpbmZvID0gMjsKICAgIH0KCiAgICBtZXNzYWdlIFB1bGxNcElucHV0CiAgICB7CiAgICAgICAgcmVxdWlyZWQgaW50NjQgdGltZT0xOwogICAgICAgIHJlcXVpcmVkIHN0cmluZyBtcGlkPTI7CiAgICB9CgogICAgbWVzc2FnZSBQdWxsTXBPdXRwdXQKICAgIHsKICAgICAgICByZXF1aXJlZCBpbnQzMiBzdGF0dXM9MTsKICAgICAgICByZXBlYXRlZCBNcEluZm8gaW5mbyA9IDI7CiAgICB9CiAgICBtZXNzYWdlIEhpc3RvcnlNc2dJbnB1dCAgCiAgICB7CiAgICAgICAgb3B0aW9uYWwgc3RyaW5nIHRhcmdldElkID0gMTsKICAgICAgICBvcHRpb25hbCBpbnQ2NCB0aW1lID0gMjsKICAgICAgICBvcHRpb25hbCBpbnQzMiBjb3VudCAgPSAzOwogICAgICAgIG9wdGlvbmFsIGludDMyIG9yZGVyID0gNDsKICAgIH0KCiAgICBtZXNzYWdlIEhpc3RvcnlNc2dPdXB1dCAKICAgIHsKICAgICAgICByZXBlYXRlZCBEb3duU3RyZWFtTWVzc2FnZSBsaXN0PTE7CiAgICAgICAgcmVxdWlyZWQgaW50NjQgc3luY1RpbWU9MjsKICAgICAgICByZXF1aXJlZCBpbnQzMiBoYXNNc2c9MzsKICAgIH0KICAgIG1lc3NhZ2UgUnRjUXVlcnlMaXN0SW5wdXR7CiAgICAgIG9wdGlvbmFsIGludDMyIG9yZGVyPTE7CiAgICB9CgogICAgbWVzc2FnZSBSdGNLZXlEZWxldGVJbnB1dHsKICAgICAgcmVwZWF0ZWQgc3RyaW5nIGtleT0xOwogICAgfQoKICAgIG1lc3NhZ2UgUnRjVmFsdWVJbmZvewogICAgICByZXF1aXJlZCBzdHJpbmcga2V5PTE7CiAgICAgIHJlcXVpcmVkIHN0cmluZyB2YWx1ZT0yOwogICAgfQoKICAgIG1lc3NhZ2UgUnRjVXNlckluZm97CiAgICAgIHJlcXVpcmVkIHN0cmluZyB1c2VySWQ9MTsKICAgICAgcmVwZWF0ZWQgUnRjVmFsdWVJbmZvIHVzZXJEYXRhPTI7CiAgICB9CgogICAgbWVzc2FnZSBSdGNVc2VyTGlzdE91dHB1dHsKICAgICAgcmVwZWF0ZWQgUnRjVXNlckluZm8gbGlzdD0xOwogICAgICBvcHRpb25hbCBzdHJpbmcgdG9rZW49MjsKICAgIH0KICAgIG1lc3NhZ2UgUnRjUm9vbUluZm9PdXRwdXR7CiAgICAgICAgb3B0aW9uYWwgc3RyaW5nIHJvb21JZCA9IDE7CiAgICAgICAgcmVwZWF0ZWQgUnRjVmFsdWVJbmZvIHJvb21EYXRhID0gMjsKICAgICAgICBvcHRpb25hbCBpbnQzMiB1c2VyQ291bnQgPSAzOwogICAgICAgIHJlcGVhdGVkIFJ0Y1VzZXJJbmZvIGxpc3Q9NDsKICAgIH0KICAgIG1lc3NhZ2UgUnRjSW5wdXR7CiAgICAgIHJlcXVpcmVkIGludDMyIHJvb21UeXBlPTE7CiAgICAgIG9wdGlvbmFsIGludDMyIGJyb2FkY2FzdFR5cGU9MjsKICAgIH0KICAgIG1lc3NhZ2UgUnRjUXJ5SW5wdXR7IAogICAgICByZXF1aXJlZCBib29sIGlzSW50ZXJpb3I9MTsKICAgICAgcmVxdWlyZWQgdGFyZ2V0VHlwZSB0YXJnZXQ9MjsKICAgICAgcmVwZWF0ZWQgc3RyaW5nIGtleT0zOwogICAgfQogICAgbWVzc2FnZSBSdGNRcnlPdXRwdXR7CiAgICAgIHJlcGVhdGVkIFJ0Y1ZhbHVlSW5mbyBvdXRJbmZvPTE7CiAgICB9CiAgICBtZXNzYWdlIFJ0Y0RlbERhdGFJbnB1dHsKICAgICAgcmVwZWF0ZWQgc3RyaW5nIGtleT0xOwogICAgICByZXF1aXJlZCBib29sIGlzSW50ZXJpb3I9MjsKICAgICAgcmVxdWlyZWQgdGFyZ2V0VHlwZSB0YXJnZXQ9MzsKICAgIH0KICAgIG1lc3NhZ2UgUnRjRGF0YUlucHV0eyAKICAgICAgcmVxdWlyZWQgYm9vbCBpbnRlcmlvcj0xOwogICAgICByZXF1aXJlZCB0YXJnZXRUeXBlIHRhcmdldD0yOwogICAgICByZXBlYXRlZCBzdHJpbmcga2V5PTM7CiAgICAgIG9wdGlvbmFsIHN0cmluZyBvYmplY3ROYW1lPTQ7CiAgICAgIG9wdGlvbmFsIHN0cmluZyBjb250ZW50PTU7CiAgICB9CiAgICBtZXNzYWdlIFJ0Y1NldERhdGFJbnB1dHsKICAgICAgcmVxdWlyZWQgYm9vbCBpbnRlcmlvcj0xOwogICAgICByZXF1aXJlZCB0YXJnZXRUeXBlIHRhcmdldD0yOwogICAgICByZXF1aXJlZCBzdHJpbmcga2V5PTM7CiAgICAgIHJlcXVpcmVkIHN0cmluZyB2YWx1ZT00OwogICAgICBvcHRpb25hbCBzdHJpbmcgb2JqZWN0TmFtZT01OwogICAgICBvcHRpb25hbCBzdHJpbmcgY29udGVudD02OwogICAgfQogICAgbWVzc2FnZSBSdGNPdXRwdXQKICAgIHsKICAgICAgICBvcHRpb25hbCBpbnQzMiBub3RoaW5nPTE7ICAgCiAgICB9CiAgICBtZXNzYWdlIFJ0Y1Rva2VuT3V0cHV0ewogICAgICByZXF1aXJlZCBzdHJpbmcgcnRjVG9rZW49MTsKICAgIH0KICAgIGVudW0gdGFyZ2V0VHlwZSB7CiAgICAgIFJPT00gPTEgOwogICAgICBQRVJTT04gPSAyOwogICAgfQogICAgbWVzc2FnZSBSdGNTZXRPdXREYXRhSW5wdXR7CiAgICAgIHJlcXVpcmVkIHRhcmdldFR5cGUgdGFyZ2V0PTE7CiAgICAgIHJlcGVhdGVkIFJ0Y1ZhbHVlSW5mbyB2YWx1ZUluZm89MjsKICAgICAgb3B0aW9uYWwgc3RyaW5nIG9iamVjdE5hbWU9MzsKICAgICAgb3B0aW9uYWwgc3RyaW5nIGNvbnRlbnQ9NDsKICAgIH0KICAgIG1lc3NhZ2UgUnRjUXJ5VXNlck91dERhdGFJbnB1dHsKICAgICAgcmVwZWF0ZWQgc3RyaW5nIHVzZXJJZCA9IDE7CiAgICB9CiAgICBtZXNzYWdlIFJ0Y1VzZXJPdXREYXRhT3V0cHV0ewogICAgICByZXBlYXRlZCBSdGNVc2VySW5mbyB1c2VyID0gMTsKICAgIH0KfQ=="
    );
    var i = l.loadProto(h, undefined, "").build("Modules").probuf;
    return i;
  })(c, d, a);
  return e;
});