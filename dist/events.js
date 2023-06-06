"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.track = exports.setUser = exports.init = void 0;
const js_cookie_1 = __importDefault(require("js-cookie"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const COOKIE_KEY = 'inleads-event-key';
const COOKIE_EMAIL_KEY = 'inleads-event-email';
const COOKIE_NAME_KEY = 'inleads-event-name';
const COOKIE_OPTIONS_KEY = 'inleads-event-options';
const COOKIE_LENGTH = 365;
let Fetch = fetch;
if (typeof fetch === 'undefined') {
    Fetch = node_fetch_1.default;
}
function init(apiKey) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            js_cookie_1.default.remove(COOKIE_KEY);
            js_cookie_1.default.set(COOKIE_KEY, apiKey, {
                expires: COOKIE_LENGTH,
            });
            yield Fetch('https://server.inleads.ai/events/validate/key', {
                method: 'POST',
                body: JSON.stringify({ apiKey }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
        catch (e) {
            js_cookie_1.default.remove(COOKIE_KEY);
            throw new Error('Invalid Api key');
        }
    });
}
exports.init = init;
function setUser(email, name, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        js_cookie_1.default.remove(COOKIE_EMAIL_KEY);
        js_cookie_1.default.remove(COOKIE_NAME_KEY);
        js_cookie_1.default.remove(COOKIE_OPTIONS_KEY);
        js_cookie_1.default.set(COOKIE_EMAIL_KEY, email, {
            expires: COOKIE_LENGTH,
        });
        js_cookie_1.default.set(COOKIE_OPTIONS_KEY, options, {
            expires: COOKIE_LENGTH,
        });
        if (name) {
            js_cookie_1.default.remove(COOKIE_NAME_KEY);
            js_cookie_1.default.set(COOKIE_NAME_KEY, name, {
                expires: COOKIE_LENGTH,
            });
        }
    });
}
exports.setUser = setUser;
function track(eventName, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const eventCookie = js_cookie_1.default.get(COOKIE_KEY);
        const email = js_cookie_1.default.get(COOKIE_EMAIL_KEY);
        const name = js_cookie_1.default.get(COOKIE_NAME_KEY);
        const userOptions = js_cookie_1.default.get(COOKIE_OPTIONS_KEY);
        if (!eventCookie) {
            throw new Error(`uh oh!, looks like you haven't called the init method`);
        }
        if (!email) {
            throw new Error(`uh oh!, looks like you haven't called the setUser method`);
        }
        if (!eventName) {
            throw new Error(`Missing required information.`);
        }
        try {
            yield Fetch('https://server.inleads.ai/events/track', {
                method: 'POST',
                body: JSON.stringify({
                    eventName,
                    email,
                    name,
                    options,
                    userOptions,
                    apiKey: eventCookie,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
        catch (e) {
            throw new Error('Issue saving information, please reload and try again');
        }
    });
}
exports.track = track;
