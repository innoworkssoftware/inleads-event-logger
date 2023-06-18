import Cookies from 'js-cookie';
import NodeFetch from 'node-fetch';
import Parser from 'ua-parser-js';
import { getAllInfoByISO } from 'iso-country-currency';

const COOKIE_SESSION_KEY = 'inleads-event-session-key';
const COOKIE_KEY = 'inleads-event-key';
const COOKIE_EMAIL_KEY = 'inleads-event-email';
const COOKIE_NAME_KEY = 'inleads-event-name';
const COOKIE_OPTIONS_KEY = 'inleads-event-options';
const COOKIE_USER_CONTEXT = 'inleads-event-context';
const COOKIE_LENGTH = 365;
const BIG_DATA_CLOUD_ENDPOINT = 'https://api.bigdatacloud.net/data';
const BASE_URL = 'https://server.inleads.ai';

let Fetch: any = fetch;

if (typeof fetch === 'undefined') {
  Fetch = NodeFetch;
}

function generateUUID() {
  var d = new Date().getTime();
  var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16;//random number between 0 and 16
    if(d > 0){//Use timestamp until depleted
      r = (d + r)%16 | 0;
      d = Math.floor(d/16);
    } else {
      r = (d2 + r)%16 | 0;
      d2 = Math.floor(d2/16);
    }
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

async function generateMeta() {
  try {
    var ua = Parser(navigator.userAgent);
    const clientResponse = await Fetch(`${BIG_DATA_CLOUD_ENDPOINT}/client-info`, {
      method: 'get',
    });
    const response = await Fetch(
      `${BIG_DATA_CLOUD_ENDPOINT}/reverse-geocode-client`,
      { method: 'get' },
    );
    const res = await response.json();
    const clientResp = await clientResponse.json();
    const currency = getAllInfoByISO(res?.countryCode);
    return {
      ip: clientResp?.ipString,
      country: res?.countryName,
      countryCode: res?.countryCode,
      continent: res?.continent,
      continentCode: res?.continentCode,
      currency: currency?.currency,
      currencySymbol: currency?.symbol,
      city: res?.city,
      localityName: res?.locality,
      postcode: res?.postcode,
      latitude: res?.latitude,
      longitude: res?.longitude,
      localityInfo: res?.localityInfo,
      browser: ua.browser?.name,
      browserVersion: ua.browser?.version,
      os: ua.os?.name,
      osVersion: ua.os?.version,
      cpuArchitecture: ua.cpu?.architecture,
      deviceVendor: ua.device?.vendor,
      deviceModel: ua.device?.model,
      deviceType: ua.device?.type || clientResp?.device,
      isMobile: clientResp?.isMobile,
      isSpider: clientResp?.isSpider,
      userAgentDisplay: clientResp?.userAgentDisplay,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  } catch (err) {
    return false;
  }
}

export async function init(apiKey: string) {
  try {
    Cookies.remove(COOKIE_KEY);
    Cookies.remove(COOKIE_SESSION_KEY);
    Cookies.remove(COOKIE_USER_CONTEXT);
    Cookies.set(COOKIE_KEY, apiKey, {
      expires: COOKIE_LENGTH,
    });
    const sessionKey = generateUUID();
    const userMeta = await generateMeta();
    const response = await Fetch(`${BASE_URL}/events/validate/key`, {
      method: 'POST',
      body: JSON.stringify({ apiKey, sessionKey, userMeta }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const resp = await response.json();
    Cookies.set(COOKIE_SESSION_KEY, resp.result, {
      expires: COOKIE_LENGTH,
    });
    Cookies.set(COOKIE_USER_CONTEXT, JSON.stringify(userMeta), {
      expires: COOKIE_LENGTH,
    });
  } catch (e) {
    Cookies.remove(COOKIE_KEY);
    throw new Error('Invalid Api key');
  }
}

export async function setUser(email: string, name?: string, options: any = {}) {
  Cookies.remove(COOKIE_EMAIL_KEY);
  Cookies.remove(COOKIE_OPTIONS_KEY);

  Cookies.set(COOKIE_EMAIL_KEY, email, {
    expires: COOKIE_LENGTH,
  });
  Cookies.set(COOKIE_OPTIONS_KEY, JSON.stringify(options), {
    expires: COOKIE_LENGTH,
  });
  if (name) {
    Cookies.remove(COOKIE_NAME_KEY);
    Cookies.set(COOKIE_NAME_KEY, name, {
      expires: COOKIE_LENGTH,
    });
  }
  //trigger init event when setuser called
  track('INIT');
}

export async function track(eventName: string, options: any = {}) {
  const eventCookie = Cookies.get(COOKIE_KEY);
  const email = Cookies.get(COOKIE_EMAIL_KEY);
  const name = Cookies.get(COOKIE_NAME_KEY);
  const userOptions = Cookies.get(COOKIE_OPTIONS_KEY);
  const sessionKey = Cookies.get(COOKIE_SESSION_KEY);
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
    await Fetch(`${BASE_URL}/events/track`, {
      method: 'POST',
      body: JSON.stringify({
        eventName,
        email,
        name,
        options,
        userOptions: userOptions ? JSON.parse(userOptions) : {},
        apiKey: eventCookie,
        sessionKey
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (e) {
    throw new Error('Issue saving information, please reload and try again');
  }
}

export function unset() {
  try {
    Cookies.remove(COOKIE_KEY);
    Cookies.remove(COOKIE_EMAIL_KEY);
    Cookies.remove(COOKIE_NAME_KEY);
    Cookies.remove(COOKIE_OPTIONS_KEY);
    Cookies.remove(COOKIE_USER_CONTEXT);
    Cookies.remove(COOKIE_SESSION_KEY);
  } catch (e) {
    throw new Error('Something went wrong, please try again');
  }
}
