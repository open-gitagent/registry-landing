import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = 'ca4891ab0aaa4a469a7c0656233cead5';

let initialized = false;

export function initAnalytics() {
  if (initialized) return;
  mixpanel.init(MIXPANEL_TOKEN, {
    track_pageview: true,
    persistence: 'localStorage',
  });
  initialized = true;
}

export function track(event: string, properties?: Record<string, unknown>) {
  if (!initialized) return;
  mixpanel.track(event, properties);
}

export function trackPageView(path: string) {
  track('page_view', {
    path,
    url: window.location.href,
    referrer: document.referrer,
  });
}
