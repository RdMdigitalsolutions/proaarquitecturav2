(() => {
  'use strict';

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  // Header state
  const header = qs('[data-header]');
  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  // Mobile navigation
  const menuToggle = qs('[data-menu-toggle]');
  const nav = qs('[data-nav]');

  const closeMenu = () => {
    if (!menuToggle || !nav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    document.body.classList.remove('nav-open');
  };

  const openMenu = () => {
    if (!menuToggle || !nav) return;
    menuToggle.setAttribute('aria-expanded', 'true');
    nav.classList.add('is-open');
    document.body.classList.add('nav-open');
  };

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMenu() : openMenu();
    });

    qsa('a', nav).forEach((link) => link.addEventListener('click', closeMenu));

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1080) closeMenu();
    });
  }

  // Reveal on scroll
  const revealItems = qsa('[data-reveal]');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -55px' });

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  // FAQ accordion
  qsa('[data-faq-button]').forEach((button) => {
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isExpanded));
    });
  });

  // Image fallback for offline preview or temporary image failure
  qsa('img[data-fallback]').forEach((image) => {
    image.addEventListener('error', () => {
      if (image.dataset.fallbackApplied === 'true') return;
      image.dataset.fallbackApplied = 'true';
      image.src = image.dataset.fallback;
    });
  });

  // WhatsApp assistant
  const chatLauncher = qs('[data-chat-launcher]');
  const chatPanel = qs('[data-chat-panel]');
  const chatClose = qs('[data-chat-close]');
  const whatsappNumber = '34692601849';

  const setChat = (open) => {
    if (!chatLauncher || !chatPanel) return;
    chatPanel.classList.toggle('is-open', open);
    chatPanel.setAttribute('aria-hidden', String(!open));
    chatLauncher.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('chat-open', open && window.innerWidth <= 640);
    if (open) {
      window.setTimeout(() => qs('.chat-option', chatPanel)?.focus(), 120);
    }
  };

  if (chatLauncher && chatPanel) {
    chatLauncher.addEventListener('click', () => {
      setChat(!chatPanel.classList.contains('is-open'));
    });

    chatClose?.addEventListener('click', () => setChat(false));

    qsa('[data-chat-message]', chatPanel).forEach((option) => {
      option.addEventListener('click', () => {
        const message = option.dataset.chatMessage || 'Hola, me gustaría pedir información sobre los servicios de PROA Arquitectura.';
        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      });
    });
  }

  // Close overlays with Escape
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    closeMenu();
    setChat(false);
  });

  document.addEventListener('click', (event) => {
    if (!chatPanel || !chatLauncher || !chatPanel.classList.contains('is-open')) return;
    const clickedInside = chatPanel.contains(event.target) || chatLauncher.contains(event.target);
    if (!clickedInside) setChat(false);
  });

  // Contact form: static-site workflow that prepares a complete email.
  const contactForm = qs('[data-contact-form]');
  if (contactForm) {
    const status = qs('[data-form-status]', contactForm);
    const submitButton = qs('button[type="submit"]', contactForm);

    const setFieldError = (field, message = '') => {
      field.setAttribute('aria-invalid', message ? 'true' : 'false');
      const error = qs(`[data-error-for="${field.name}"]`, contactForm);
      if (error) error.textContent = message;
    };

    const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    const validate = () => {
      const data = new FormData(contactForm);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const phone = String(data.get('phone') || '').trim();
      const service = String(data.get('service') || '').trim();
      const message = String(data.get('message') || '').trim();
      const privacy = data.get('privacy');
      let valid = true;

      const nameField = contactForm.elements.name;
      const emailField = contactForm.elements.email;
      const phoneField = contactForm.elements.phone;
      const serviceField = contactForm.elements.service;
      const messageField = contactForm.elements.message;
      const privacyField = contactForm.elements.privacy;

      setFieldError(nameField, name.length >= 2 ? '' : 'Indica tu nombre o el de la comunidad.');
      if (name.length < 2) valid = false;

      if (!email && !phone) {
        setFieldError(emailField, 'Indica un email o un teléfono.');
        setFieldError(phoneField, 'Indica un teléfono o un email.');
        valid = false;
      } else {
        setFieldError(phoneField, '');
        if (email && !validEmail(email)) {
          setFieldError(emailField, 'Revisa el formato del email.');
          valid = false;
        } else {
          setFieldError(emailField, '');
        }
      }

      setFieldError(serviceField, service ? '' : 'Selecciona el tipo de consulta.');
      if (!service) valid = false;

      setFieldError(messageField, message.length >= 15 ? '' : 'Cuéntanos brevemente el caso (mínimo 15 caracteres).');
      if (message.length < 15) valid = false;

      setFieldError(privacyField, privacy ? '' : 'Debes aceptar la política de privacidad.');
      if (!privacy) valid = false;

      return { valid, data, name, email, phone, service, message };
    };

    qsa('input, select, textarea', contactForm).forEach((field) => {
      field.addEventListener('input', () => {
        if (field.getAttribute('aria-invalid') === 'true') setFieldError(field, '');
      });
    });

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const result = validate();

      if (!result.valid) {
        const firstInvalid = qs('[aria-invalid="true"]', contactForm);
        firstInvalid?.focus();
        if (status) {
          status.classList.remove('is-visible');
          status.textContent = '';
        }
        return;
      }

      const company = String(result.data.get('company') || '').trim();
      const subject = `Consulta web: ${result.service} — ${result.name}`;
      const body = [
        'Hola equipo de PROA Arquitectura,',
        '',
        `Nombre: ${result.name}`,
        company ? `Empresa / comunidad: ${company}` : '',
        result.email ? `Email: ${result.email}` : '',
        result.phone ? `Teléfono: ${result.phone}` : '',
        `Servicio: ${result.service}`,
        '',
        'Consulta:',
        result.message,
        '',
        'Mensaje preparado desde la web de PROA Arquitectura.'
      ].filter(Boolean).join('\n');

      const mailto = `mailto:administracio@proarquitectura.cat?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      const whatsapp = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hola, soy ${result.name}. Mi consulta es sobre ${result.service}: ${result.message}`)}`;

      if (status) {
        status.innerHTML = `Consulta preparada. Se abrirá tu aplicación de correo. También puedes <a href="${whatsapp}" target="_blank" rel="noopener noreferrer">enviarla por WhatsApp</a>.`;
        status.classList.add('is-visible');
      }

      if (submitButton) {
        const originalText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.textContent = 'Consulta preparada';
        window.setTimeout(() => {
          submitButton.disabled = false;
          submitButton.innerHTML = originalText;
        }, 2500);
      }

      window.setTimeout(() => {
        window.location.href = mailto;
      }, 250);
    });
  }

  // Dynamic year
  qsa('[data-current-year]').forEach((node) => {
    node.textContent = new Date().getFullYear();
  });
})();
