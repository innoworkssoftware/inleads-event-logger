import Cookies from 'js-cookie';
import NodeFetch from 'node-fetch';

const COOKIE_KEY = 'inleads-event-key';
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

export async function track(eventName: string, email: string, name?: string) {
  const eventCookie = Cookies.get(COOKIE_KEY);
  if (!eventCookie) {
    throw new Error(`uh oh!, looks like you haven't called the init method`);
  }
  if (!eventName || !email) {
    throw new Error(`Missing required information.`);
  }
  try {
    await Fetch('https://server.inleads.ai/events/track', {
      method: 'POST',
      body: JSON.stringify({
        eventName,
        email,
        name,
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
