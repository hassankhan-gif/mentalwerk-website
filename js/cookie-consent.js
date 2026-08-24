/*
 * Cookie-Consent für MentalWerk.
 * Kategorien: "necessary" (immer aktiv) und "marketing" (Meta/Instagram Pixel, opt-in).
 * Consent wird lokal in localStorage gespeichert, es fliesst nichts an Dritte,
 * bevor der Nutzer aktiv zugestimmt hat.
 *
 * WICHTIG: Trage deine echte Meta-Pixel-ID unten bei META_PIXEL_ID ein, sobald sie
 * vorliegt. Solange das Feld leer ist, wird der Pixel nie geladen (auch nicht bei
 * erteilter Einwilligung) – so passiert nichts Kaputtes, bevor du sie einträgst.
 */
(function () {
  var META_PIXEL_ID = ''; // <- hier die echte Meta-Pixel-ID eintragen, z. B. '1234567890123456'

  var STORAGE_KEY = 'mw_cookie_consent';

  var banner = document.getElementById('cookieBanner');
  var modal = document.getElementById('cookieModal');
  var modalBackdrop = document.getElementById('cookieModalBackdrop');
  var marketingToggle = document.getElementById('cookieMarketingToggle');

  function getConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function setConsent(marketing) {
    var consent = {
      necessary: true,
      marketing: !!marketing,
      timestamp: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch (e) {
      /* localStorage nicht verfügbar (z. B. Privatmodus) – Consent gilt dann nur für diese Sitzung */
    }
    applyConsent(consent);
    return consent;
  }

  function applyConsent(consent) {
    if (consent && consent.marketing) {
      loadMetaPixel();
    }
  }

  function loadMetaPixel() {
    if (!META_PIXEL_ID || window.fbq) return;

    /* eslint-disable */
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */

    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  function showBanner() {
    if (banner) banner.hidden = false;
  }

  function hideBanner() {
    if (banner) banner.hidden = true;
  }

  function openModal() {
    var consent = getConsent();
    if (marketingToggle) {
      setToggleState(marketingToggle, !!(consent && consent.marketing));
    }
    if (modal) modal.hidden = false;
  }

  function closeModal() {
    if (modal) modal.hidden = true;
  }

  function setToggleState(toggle, on) {
    toggle.setAttribute('aria-checked', String(on));
    toggle.classList.toggle('is-on', on);
  }

  function init() {
    var consent = getConsent();

    if (!consent) {
      showBanner();
    } else {
      applyConsent(consent);
    }

    var acceptAllBtn = document.getElementById('cookieAcceptAll');
    var rejectAllBtn = document.getElementById('cookieRejectAll');
    var openSettingsBtn = document.getElementById('cookieOpenSettings');
    var footerSettingsBtn = document.getElementById('openCookieSettings');
    var modalRejectAllBtn = document.getElementById('cookieModalRejectAll');
    var modalSaveBtn = document.getElementById('cookieModalSave');

    if (acceptAllBtn) {
      acceptAllBtn.addEventListener('click', function () {
        setConsent(true);
        hideBanner();
      });
    }
    if (rejectAllBtn) {
      rejectAllBtn.addEventListener('click', function () {
        setConsent(false);
        hideBanner();
      });
    }
    if (openSettingsBtn) {
      openSettingsBtn.addEventListener('click', openModal);
    }
    if (footerSettingsBtn) {
      footerSettingsBtn.addEventListener('click', openModal);
    }
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', closeModal);
    }
    if (marketingToggle) {
      marketingToggle.addEventListener('click', function () {
        setToggleState(marketingToggle, marketingToggle.getAttribute('aria-checked') !== 'true');
      });
    }
    if (modalRejectAllBtn) {
      modalRejectAllBtn.addEventListener('click', function () {
        setConsent(false);
        closeModal();
        hideBanner();
      });
    }
    if (modalSaveBtn) {
      modalSaveBtn.addEventListener('click', function () {
        var marketingOn = marketingToggle && marketingToggle.getAttribute('aria-checked') === 'true';
        setConsent(marketingOn);
        closeModal();
        hideBanner();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
