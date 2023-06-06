import Cookies from 'js-cookie';
import NodeFetch from 'node-fetch';

const COOKIE_KEY = 'inleads-event-key';
const COOKIE_EMAIL_KEY = 'inleads-event-email';
const COOKIE_NAME_KEY = 'inleads-event-name';
const COOKIE_OPTIONS_KEY = 'inleads-event-options';
const COOKIE_LENGTH = 365;

let Fetch: any = fetch;

if (typeof fetch === 'undefined') {
  Fetch = NodeFetch;
}

export async function init(apiKey: string) {
  try {
    Cookies.remove(COOKIE_KEY);
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
}

export async function track(eventName: string, options: any = {}) {
  const eventCookie = Cookies.get(COOKIE_KEY);
  const email = Cookies.get(COOKIE_EMAIL_KEY);
  const name = Cookies.get(COOKIE_NAME_KEY);
  const userOptions = Cookies.get(COOKIE_OPTIONS_KEY);
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
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (e) {
    throw new Error('Issue saving information, please reload and try again');
  }
}
