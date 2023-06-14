!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.inleadsEvents=t():e.inleadsEvents=t()}(this,(()=>(()=>{var e={646:function(e){e.exports=function(){"use strict";function e(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)e[r]=n[r]}return e}return function t(n,r){function o(t,o,i){if("undefined"!=typeof document){"number"==typeof(i=e({},r,i)).expires&&(i.expires=new Date(Date.now()+864e5*i.expires)),i.expires&&(i.expires=i.expires.toUTCString()),t=encodeURIComponent(t).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape);var s="";for(var a in i)i[a]&&(s+="; "+a,!0!==i[a]&&(s+="="+i[a].split(";")[0]));return document.cookie=t+"="+n.write(o,t)+s}}return Object.create({set:o,get:function(e){if("undefined"!=typeof document&&(!arguments.length||e)){for(var t=document.cookie?document.cookie.split("; "):[],r={},o=0;o<t.length;o++){var i=t[o].split("="),s=i.slice(1).join("=");try{var a=decodeURIComponent(i[0]);if(r[a]=n.read(s,a),e===a)break}catch(e){}}return e?r[e]:r}},remove:function(t,n){o(t,"",e({},n,{expires:-1}))},withAttributes:function(n){return t(this.converter,e({},this.attributes,n))},withConverter:function(n){return t(e({},this.converter,n),this.attributes)}},{attributes:{value:Object.freeze(r)},converter:{value:Object.freeze(n)}})}({read:function(e){return'"'===e[0]&&(e=e.slice(1,-1)),e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(e){return encodeURIComponent(e).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}},{path:"/"})}()},300:(e,t,n)=>{"use strict";var r=function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if(void 0!==n.g)return n.g;throw new Error("unable to locate global object")}();e.exports=t=r.fetch,r.fetch&&(t.default=r.fetch.bind(r)),t.Headers=r.Headers,t.Request=r.Request,t.Response=r.Response},242:function(e,t,n){"use strict";var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function s(e){try{u(r.next(e))}catch(e){i(e)}}function a(e){try{u(r.throw(e))}catch(e){i(e)}}function u(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,a)}u((r=r.apply(e,t||[])).next())}))},o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.track=t.setUser=t.init=void 0;const i=o(n(646)),s=o(n(300)),a="inleads-event-key",u="inleads-event-email",c="inleads-event-name",f="inleads-event-options",d=365;let l=fetch;function p(e,t={}){return r(this,void 0,void 0,(function*(){const n=i.default.get(a),r=i.default.get(u),o=i.default.get(c),s=i.default.get(f);if(!n)throw new Error("uh oh!, looks like you haven't called the init method");if(!r)throw new Error("uh oh!, looks like you haven't called the setUser method");if(!e)throw new Error("Missing required information.");try{yield l("https://server.inleads.ai/events/track",{method:"POST",body:JSON.stringify({eventName:e,email:r,name:o,options:t,userOptions:s,apiKey:n}),headers:{"Content-Type":"application/json"}})}catch(e){throw new Error("Issue saving information, please reload and try again")}}))}"undefined"==typeof fetch&&(l=s.default),t.init=function(e){return r(this,void 0,void 0,(function*(){try{i.default.remove(a),i.default.set(a,e,{expires:d}),yield l("https://server.inleads.ai/events/validate/key",{method:"POST",body:JSON.stringify({apiKey:e}),headers:{"Content-Type":"application/json"}})}catch(e){throw i.default.remove(a),new Error("Invalid Api key")}}))},t.setUser=function(e,t,n={}){return r(this,void 0,void 0,(function*(){i.default.remove(u),i.default.remove(f),i.default.set(u,e,{expires:d}),i.default.set(f,n,{expires:d}),t&&(i.default.remove(c),i.default.set(c,t,{expires:d})),p("INIT")}))},t.track=p}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var i=t[r]={exports:{}};return e[r].call(i.exports,i,i.exports,n),i.exports}return n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n(242)})()));