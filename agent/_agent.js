(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function e(o) {
  null != o && (console.log(Object.getOwnPropertyNames(o).join("\n")), e(Object.getPrototypeOf(o)));
}

function o(e) {
  send({
    log: e
  }), console.log(e);
}

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.send_log = exports.logAllProperties = void 0, exports.logAllProperties = e, 
exports.send_log = o;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.GetAllMessageCls = exports.wrapJavaPerform = void 0;

const e = require("./wire/generate"), a = require("./common"), s = e => new Promise(((a, s) => {
  Java.perform((() => {
    try {
      a(e());
    } catch (e) {
      s(e);
    }
  }));
}));

exports.wrapJavaPerform = s;

const t = (s, t) => exports.wrapJavaPerform((() => {
  let l = t.split(","), r = new Set, n = new Set, o = Java.use("com.squareup.wire.Message").class, u = Java.use("java.lang.Enum").class, i = Java.use("dalvik.system.DexFile"), c = Java.use("dalvik.system.BaseDexClassLoader"), d = Java.use("dalvik.system.DexPathList");
  Java.enumerateClassLoaders({
    onMatch: function(t) {
      if ("java.lang.BootClassLoader" == t.$className) return;
      let m = Java.cast(t, c).pathList.value, v = Java.cast(m, d).dexElements.value;
      for (let t = 0; t < v.length; t++) {
        let c = v[t];
        try {
          let t = c.dexFile.value, d = `${t}`;
          if (!t || n.has(`${d}`)) continue;
          if (d.includes("/system")) continue;
          n.add(`${d}`), a.send_log(`[-] start enumerate ${d} dexfile_name include /system => ${d.includes("/system")}`);
          let m = Java.cast(t, i).entries();
          for (;m.hasMoreElements(); ) {
            let t = m.nextElement().toString(), n = !1;
            for (let e = 0; e < l.length; e++) if (t.includes(l[e])) {
              n = !0;
              break;
            }
            if (!n) continue;
            let i = null;
            try {
              i = Java.use(t);
            } catch (e) {}
            if (!i) continue;
            let c = i.class.getSuperclass();
            c && (o.equals(c) ? (r.add(t), a.send_log(`[+] ${`${r.size}`.padStart(5, " ")} ${t}`), 
            send(e.generate_message(i, s))) : u.equals(c) && (r.add(t), a.send_log(`[+] ${`${r.size}`.padStart(5, " ")} ${t}`), 
            send(e.generate_enum(i))));
          }
          a.send_log(`[+] enumerate ${t} end`);
        } catch (e) {
          console.trace(e);
        }
      }
    },
    onComplete: function() {
      console.log("[*] enumerateClassLoaders complete !");
    }
  });
}));

exports.GetAllMessageCls = t, rpc.exports = {
  dump: exports.GetAllMessageCls
};

},{"./common":1,"./wire/generate":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.generate_enum = exports.generate_message = void 0;

const e = require("../common");

function t(e, t) {
  let a = {};
  return Java.perform((function() {
    a.type = "message", a.package = n(e), a.cls_name = `${e.class.getSimpleName()}`, 
    a.fields_config = r(e, t);
  })), a;
}

function n(e) {
  let t = `${e.class.getName()}`;
  return t.substring(0, t.lastIndexOf("."));
}

function r(t, n) {
  let r = [], a = Java.use("com.squareup.wire.WireField");
  return Java.perform((function() {
    t.class.getDeclaredFields().forEach((function(t) {
      let o = t.getAnnotation(a.class);
      if (!o) return;
      let u = function(t, r) {
        function o(t) {
          let r = !1, a = "";
          if (t.includes("#")) {
            let o = t.split("#");
            "com.squareup.wire.ProtoAdapter" == o[0] ? a = o[1].toLowerCase() : "ADAPTER" == o[1] ? (a = o[0].split(".").pop(), 
            n && "Any" == a && (a = "google.protobuf.Any"), r = !0) : e.send_log(`[*] unhandled adapter => ${t}`);
          }
          return {
            need_import: r,
            type: a
          };
        }
        let u = Java.cast(r, a), s = t.getName(), l = function(e) {
          return `${e.label()}`.toLowerCase();
        }(u), i = function(e) {
          return e.tag();
        }(u), c = function(e) {
          return e.adapter();
        }(u), f = function(e) {
          return e.keyAdapter();
        }(u), p = null, m = null;
        return f ? (l = "", p = f, m = c) : (p = c, m = f), {
          label: l,
          type_1: o(p),
          type_2: o(m),
          name: s,
          tag: i
        };
      }(t, o);
      r.push(u);
    }));
  })), r;
}

function a(e) {
  let t = {};
  return Java.perform((function() {
    Java.perform((function() {
      t.type = "enum", t.package = n(e), t.cls_name = `${e.class.getSimpleName()}`, t.fields_config = o(e);
    }));
  })), t;
}

function o(e) {
  let t = {};
  return Java.perform((function() {
    e.values().forEach((function(e) {
      t[`${e}`] = e.getValue();
    }));
  })), t;
}

exports.generate_message = t, exports.generate_enum = a;

},{"../common":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29tbW9uLnRzIiwic3JjL2luZGV4LnRzIiwic3JjL3dpcmUvZ2VuZXJhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLFNBQWdCLEVBQWlCO0VBQ2xCLFFBQVAsTUFDSixRQUFRLElBQUksT0FBTyxvQkFBb0IsR0FBSyxLQUFLLFFBQ2pELEVBQWlCLE9BQU8sZUFBZTs7O0FBRzNDLFNBQWdCLEVBQVM7RUFDckIsS0FBSztJQUFDLEtBQU87TUFDYixRQUFRLElBQUk7Ozs7OzBEQVJoQixRQUFBLG1CQUFBO0FBTUEsUUFBQSxXQUFBOzs7Ozs7Ozs7QUNOQSxNQUFBLElBQUEsUUFBQSxvQkFDQSxJQUFBLFFBQUEsYUFFYSxJQUFtQixLQUNyQixJQUFJLFNBQVEsQ0FBQyxHQUFTO0VBQ3pCLEtBQUssU0FBUTtJQUNUO01BQ0ksRUFBUTtNQUNWLE9BQU87TUFDTCxFQUFPOzs7OztBQU5WLFFBQUEsa0JBQWU7O0FBWXJCLE1BQU0sSUFBbUIsQ0FBQyxHQUEwQixNQUNoRCxRQUFBLGlCQUFnQjtFQUNuQixJQUFJLElBQVcsRUFBaUIsTUFBTSxNQUNsQyxJQUFVLElBQUksS0FDZCxJQUFhLElBQUksS0FDakIsSUFBaUIsS0FBSyxJQUFJLDZCQUE2QixPQUN2RCxJQUFVLEtBQUssSUFBSSxrQkFBa0IsT0FDckMsSUFBYSxLQUFLLElBQUksMEJBQ3RCLElBQXdCLEtBQUssSUFBSSxxQ0FDakMsSUFBaUIsS0FBSyxJQUFJO0VBQzlCLEtBQUssc0JBQXNCO0lBQ3ZCLFNBQVMsU0FBVTtNQUNmLElBQTRCLCtCQUF4QixFQUFVLFlBQTJDO01BQ3pELElBQ0ksSUFEZSxLQUFLLEtBQUssR0FBVyxHQUNULFNBQVMsT0FFcEMsSUFEaUIsS0FBSyxLQUFLLEdBQWEsR0FDUixZQUFZO01BQ2hELEtBQUssSUFBSSxJQUFRLEdBQUcsSUFBUSxFQUFlLFFBQVEsS0FBUztRQUN4RCxJQUFJLElBQWEsRUFBZTtRQUNoQztVQUNJLElBQUksSUFBVSxFQUFXLFFBQVEsT0FDN0IsSUFBZSxHQUFHO1VBQ3RCLEtBQUssS0FBVyxFQUFXLElBQUksR0FBRyxNQUU5QjtVQUVKLElBQUksRUFBYSxTQUFTLFlBQVk7VUFDdEMsRUFBVyxJQUFJLEdBQUcsTUFDbEIsRUFBQSxTQUFTLHVCQUF1QixxQ0FBZ0QsRUFBYSxTQUFTO1VBQ3RHLElBQ0ksSUFEYSxLQUFLLEtBQUssR0FBUyxHQUNYO1VBQ3pCLE1BQU8sRUFBUSxxQkFBbUI7WUFDOUIsSUFBSSxJQUFZLEVBQVEsY0FBYyxZQUVsQyxLQUFlO1lBQ25CLEtBQUssSUFBSSxJQUFJLEdBQUcsSUFBSSxFQUFTLFFBQVEsS0FDakMsSUFBSSxFQUFVLFNBQVMsRUFBUyxLQUFJO2NBQ2hDLEtBQWU7Y0FDZjs7WUFHUixLQUFLLEdBQWM7WUFDbkIsSUFBSSxJQUFNO1lBQ1Y7Y0FDSSxJQUFNLEtBQUssSUFBSTtjQUVuQixPQUFPO1lBRVAsS0FBSyxHQUNEO1lBRUosSUFBSSxJQUFZLEVBQUksTUFBTTtZQUNyQixNQUlELEVBQWUsT0FBTyxNQUN0QixFQUFRLElBQUksSUFDWixFQUFBLFNBQVMsT0FBTyxHQUFHLEVBQVEsT0FBTyxTQUFTLEdBQUcsUUFBUTtZQUN0RCxLQUFLLEVBQUEsaUJBQWlCLEdBQUssT0FFdEIsRUFBUSxPQUFPLE9BRXBCLEVBQVEsSUFBSSxJQUNaLEVBQUEsU0FBUyxPQUFPLEdBQUcsRUFBUSxPQUFPLFNBQVMsR0FBRyxRQUFRO1lBQ3RELEtBQUssRUFBQSxjQUFjOztVQUczQixFQUFBLFNBQVMsaUJBQWlCO1VBQzVCLE9BQU87VUFDTCxRQUFRLE1BQU07Ozs7SUFJMUIsWUFBWTtNQUNSLFFBQVEsSUFBSTs7Ozs7QUEzRWYsUUFBQSxtQkFBZ0IsR0FrRjdCLElBQUksVUFBVTtFQUNWLE1BQU0sUUFBQTs7OztBQ2xHVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIn0=
