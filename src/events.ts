import Cookies from 'js-cookie';
import NodeFetch from 'node-fetch';
import Parser from 'ua-parser-js';
import { getAllInfoByISO } from 'iso-country-currency';

const COOKIE_KEY = 'inleads-event-key';
const COOKIE_EMAIL_KEY = 'inleads-event-email';
const COOKIE_NAME_KEY = 'inleads-event-name';
const COOKIE_OPTIONS_KEY = 'inleads-event-options';
const COOKIE_USER_CONTEXT = 'inleads-event-context';
const COOKIE_LENGTH = 365;
const BIG_DATA_CLOUD_ENDPOINT = 'https://api.bigdatacloud.net/data';

let Fetch: any = fetch;

if (typeof fetch === 'undefined') {
  Fetch = NodeFetch;
}

async function generateMeta() {
  try {
    var ua = Parser(navigator.userAgent);
    const clientResp = await Fetch(`${BIG_DATA_CLOUD_ENDPOINT}/client-info`, {
      method: 'get',
    });
    const res = await Fetch(
      `${BIG_DATA_CLOUD_ENDPOINT}/reverse-geocode-client`,
      { method: 'get' },
    );
    const currency = getAllInfoByISO(res.data?.countryCode);
    return {
      ip: clientResp.data?.ipString,
      country: res.data?.countryName,
      countryCode: res.data?.countryCode,
      continent: res.data?.continent,
      continentCode: res.data?.continentCode,
      currency: currency?.currency,
      currencySymbol: currency?.symbol,
      city: res.data?.city,
      localityName: res.data?.locality,
      postcode: res.data?.postcode,
      latitude: res.data?.latitude,
      longitude: res.data?.longitude,
      localityInfo: res.data?.localityInfo,
      browser: ua.browser?.name,
      browserVersion: ua.browser?.version,
      os: ua.os?.name,
      osVersion: ua.os?.version,
      cpuArchitecture: ua.cpu?.architecture,
      deviceVendor: ua.device?.vendor,
      deviceModel: ua.device?.model,
      deviceType: ua.device?.type || clientResp.data?.device,
      isMobile: clientResp.data?.isMobile,
      isSpider: clientResp.data?.isSpider,
      userAgentDisplay: clientResp.data?.userAgentDisplay,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  } catch (err) {
    return false;
  }
}

export async function init(apiKey: string) {
  try {
    Cookies.remove(COOKIE_KEY);
    Cookies.remove(COOKIE_USER_CONTEXT);
    Cookies.set(COOKIE_KEY, apiKey, {
      expires: COOKIE_LENGTH,
    });
    await Fetch('https://server.inleads.ai/events/validate/key', {
      method: 'POST',
      body: JSON.stringify({ apiKey }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const userMeta = generateMeta();
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
  Cookies.set(COOKIE_OPTIONS_KEY, options, {
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
  let userMeta = {};
  if (Cookies.get(COOKIE_USER_CONTEXT)) {
    userMeta = JSON.parse(Cookies.get(COOKIE_USER_CONTEXT)!);
  }
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
    await Fetch('https://server.inleads.ai/events/track', {
      method: 'POST',
      body: JSON.stringify({
        eventName,
        email,
        name,
        options,
        userOptions,
        apiKey: eventCookie,
        meta: userMeta,
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
  } catch (e) {
    throw new Error('Something went wrong, please try again');
  }
}
