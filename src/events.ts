import Cookies from 'js-cookie';
import fetch from 'node-fetch';

const COOKIE_KEY = 'inleads-event-key';
const COOKIE_DOMAIN = 'inleads.ai';
const COOKIE_LENGTH = 365;

export async function init(apiKey: string) {
  try {
    await fetch('http://localhost:8081/events/validate/key', {
      method: 'POST',
      body: JSON.stringify({ apiKey }),
    });
    Cookies.remove(COOKIE_KEY, { domain: COOKIE_DOMAIN });
    Cookies.set(COOKIE_KEY, apiKey, {
      expires: COOKIE_LENGTH,
      domain: COOKIE_DOMAIN,
    });
  } catch (e) {
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
    await fetch('http://localhost:8081/events/track', {
      method: 'POST',
      body: JSON.stringify({
        eventName,
        email,
        name,
        apiKey: eventCookie,
      }),
    });
  } catch (e) {
    throw new Error('Issue saving information, please reload and try again');
  }
}
