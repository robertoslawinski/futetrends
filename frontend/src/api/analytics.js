const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;

const metaEventMap = {
  page_view: "PageView",
  market_opened: "ViewContent",
  vote_submitted: "SubmitApplication",
  login_completed: "Login",
  sign_up_completed: "CompleteRegistration"
};

export function trackEvent(name, params = {}) {
  if (window.gtag && GA_ID) {
    window.gtag("event", name, params);
  }

  if (window.fbq && META_PIXEL_ID) {
    const metaName = metaEventMap[name] || name;
    if (metaName === "PageView") {
      window.fbq("track", "PageView");
    } else {
      window.fbq("trackCustom", metaName, params);
    }
  }
}

function installGoogleAnalytics() {
  if (!GA_ID || window.gtag) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { send_page_view: false });
}

function installMetaPixel() {
  if (!META_PIXEL_ID || window.fbq) return;

  window._fbq = window._fbq || undefined;
  window.fbq = function fbq() {
    window.fbq.callMethod
      ? window.fbq.callMethod(...arguments)
      : window.fbq.queue.push(arguments);
  };
  window.fbq.push = window.fbq;
  window.fbq.loaded = true;
  window.fbq.version = "2.0";
  window.fbq.queue = [];

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  window.fbq("init", META_PIXEL_ID);
}

export function installAnalytics() {
  installGoogleAnalytics();
  installMetaPixel();
}
