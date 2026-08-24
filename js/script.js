// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');

if (navToggle && primaryNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  primaryNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      primaryNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Accordion
document.querySelectorAll('.accordion-trigger').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';

    trigger.setAttribute('aria-expanded', String(!isOpen));

    if (isOpen) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
  });
});

// Scroll-reveal for sections
const revealTargets = document.querySelectorAll('.reveal');
if (revealTargets.length && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealTargets.forEach((el) => revealObserver.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add('is-visible'));
}

// Sticky mobile CTA: visible once past the hero, hidden while the Kontakt
// section is in view or the cookie banner is showing.
(function () {
  const stickyCta = document.getElementById('stickyCta');
  const hero = document.getElementById('top');
  const kontakt = document.getElementById('kontakt');
  const cookieBanner = document.getElementById('cookieBanner');
  if (!stickyCta || !hero || !kontakt) return;

  let pastHero = false;
  let kontaktInView = false;

  function refresh() {
    const bannerVisible = cookieBanner && !cookieBanner.hidden;
    const shouldShow = pastHero && !kontaktInView && !bannerVisible;
    stickyCta.classList.toggle('is-visible', shouldShow);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          pastHero = !entry.isIntersecting;
        });
        refresh();
      },
      { threshold: 0 }
    ).observe(hero);

    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          kontaktInView = entry.isIntersecting;
        });
        refresh();
      },
      { threshold: 0.15 }
    ).observe(kontakt);
  }

  if (cookieBanner) {
    new MutationObserver(refresh).observe(cookieBanner, { attributes: true, attributeFilter: ['hidden'] });
  }
})();
