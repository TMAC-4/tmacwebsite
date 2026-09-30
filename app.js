(() => {
  'use strict';

  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#primary-nav');
  if (menuButton && navigation) {
    const closeMenu = () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
      navigation.classList.remove('is-open');
    };
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      navigation.classList.toggle('is-open', open);
    });
    navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  }

  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = document.querySelectorAll('.service-card, .industry-card, .solution, .method-steps li, .research-list li, .technology-groups > div, .proof-items span');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    revealItems.forEach(item => item.classList.add('reveal'));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
    revealItems.forEach(item => observer.observe(item));
  }

  // There is no enquiry backend attached. Prepare a truthful email handoff instead of simulating submission.
  const form = document.querySelector('#enquiry-form');
  const status = document.querySelector('#form-status');
  if (form && status) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const services = data.getAll('services');
      const body = [
        `Name: ${data.get('name')}`,
        `Organization: ${data.get('organization')}`,
        `Email: ${data.get('email')}`,
        `Phone: ${data.get('phone') || 'Not provided'}`,
        `Industry: ${data.get('industry')}`,
        `Indicative budget: ${data.get('budget') || 'Not provided'}`,
        `Service interests: ${services.length ? services.join(', ') : 'Not selected'}`,
        `How they heard about TMAC: ${data.get('source') || 'Not provided'}`,
        '',
        'Brief:',
        data.get('description')
      ].join('\n');
      const subject = `TMAC enquiry — ${data.get('organization')}`;
      const mailto = `mailto:tamanalyticsconsulting@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.replaceChildren();
      const notice = document.createElement('p');
      notice.textContent = 'TMAC does not receive this form directly. Your device may open an email draft; review it and press Send in your email app.';
      const fallbackLink = document.createElement('a');
      fallbackLink.href = mailto;
      fallbackLink.textContent = 'Open the prepared enquiry email';
      fallbackLink.className = 'form-email-link';
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      summary.textContent = 'If no email draft opens, view and copy your enquiry';
      const draft = document.createElement('textarea');
      draft.value = body;
      draft.readOnly = true;
      draft.rows = 9;
      draft.setAttribute('aria-label', 'Prepared enquiry text to copy into an email');
      details.append(summary, draft);
      status.append(notice, fallbackLink, details);
      window.location.href = mailto;
    });
  }
})();

