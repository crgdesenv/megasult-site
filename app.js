document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll shadow ───────────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Hamburger menu ─────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Active nav link ────────────────────────────────────────
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').replace(/\/$/, '') || '/';
    if (href !== '/' && path.endsWith(href)) {
      a.classList.add('active');
    }
  });

  // ── Scroll reveal ──────────────────────────────────────────
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('vis');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    reveals.forEach(el => io.observe(el));
  }

  // ── Footer year ────────────────────────────────────────────
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Tab system (sistemas page) ─────────────────────────────
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  if (tabBtns.length && tabPanes.length) {
    let autoInterval;
    let userInteracted = false;
    let cardHovered = false;
    let current = 0;

    document.querySelectorAll('.segment-card').forEach(card => {
      card.addEventListener('mouseenter', () => { cardHovered = true; });
      card.addEventListener('mouseleave', () => { cardHovered = false; });
      // Ao abrir o modal de detalhe de qualquer card, para de vez a troca
      // automática de abas (não é só uma pausa por hover).
      card.addEventListener('click', () => {
        userInteracted = true;
        clearInterval(autoInterval);
      });
    });

    const activateTab = (idx) => {
      tabBtns.forEach((b, i) => {
        b.classList.toggle('active', i === idx);
        b.setAttribute('aria-selected', i === idx);
      });
      tabPanes.forEach((p, i) => p.classList.toggle('active', i === idx));
      current = idx;
    };

    tabBtns.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        userInteracted = true;
        clearInterval(autoInterval);
        activateTab(idx);
      });
    });

    activateTab(current);

    autoInterval = setInterval(() => {
      if (!userInteracted && !cardHovered) {
        activateTab((current + 1) % tabBtns.length);
      }
    }, 9000);
  }

  // ── Diagrama do ERP (Sistemas): abre em modal grande ────────
  const diagramCard = document.getElementById('diagramCardBtn');
  if (diagramCard) {
    if (!document.getElementById('diagramModal')) {
      document.body.insertAdjacentHTML(
        'beforeend',
        '<div class="modal-overlay" id="diagramModal" role="dialog" aria-modal="true" aria-labelledby="diagramModalTitle">' +
          '<div class="modal-box diagram-modal-box">' +
            '<button class="modal-x" id="diagramModalCloseBtn" aria-label="Fechar">&times;</button>' +
            '<h3 id="diagramModalTitle" class="sr-only">Diagrama dos módulos do ERP Megasult</h3>' +
            '<img src="' + diagramCard.querySelector('img').src + '" alt="' + diagramCard.querySelector('img').alt + '" />' +
          '</div>' +
        '</div>'
      );
    }

    const diagramModal = document.getElementById('diagramModal');
    const diagramCloseBtn = document.getElementById('diagramModalCloseBtn');

    const openDiagramModal = () => {
      diagramModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    const closeDiagramModal = () => {
      diagramModal.classList.remove('open');
      document.body.style.overflow = '';
    };

    diagramCard.addEventListener('click', openDiagramModal);
    diagramCloseBtn.addEventListener('click', closeDiagramModal);
    diagramModal.addEventListener('click', (e) => {
      if (e.target === diagramModal) closeDiagramModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDiagramModal();
    });
  }

  // ── Offices carousel (footer) ──────────────────────
  const officesCarousel = document.getElementById('offices-carousel');
  const officesTrack = document.getElementById('offices-track');
  if (officesCarousel && officesTrack) {
    const originalCards = Array.from(officesTrack.children);

    // Duplica o conjunto para o loop ficar contínuo (sem "salto" visível)
    originalCards.forEach(card => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      officesTrack.appendChild(clone);
    });

    const SPEED = 40; // pixels por segundo
    const setDuration = () => {
      const setWidth = originalCards.reduce((total, card) => {
        const styles = getComputedStyle(card);
        return total + card.getBoundingClientRect().width + parseFloat(styles.marginRight || 0);
      }, 0);
      if (setWidth > 0) {
        officesTrack.style.animationDuration = `${setWidth / SPEED}s`;
      }
    };

    setDuration();
    window.addEventListener('resize', setDuration);
  }

  // ── Cursor-follow zoom (soluções diagram) ──────────────────
  const diagramWrap = document.querySelector('.solucoes-diagram');
  const diagramImg = diagramWrap ? diagramWrap.querySelector('img') : null;
  if (diagramWrap && diagramImg) {
    diagramWrap.addEventListener('mousemove', (e) => {
      const rect = diagramWrap.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      diagramImg.style.transformOrigin = `${x}% ${y}%`;
    });
  }

  // ── Demo float dismiss (sistemas page) ─────────────────────
  const demoFloatWrap = document.getElementById('demoFloatWrap');
  const demoFloatClose = document.getElementById('demoFloatClose');
  if (demoFloatWrap && demoFloatClose) {
    demoFloatClose.addEventListener('click', () => {
      demoFloatWrap.style.display = 'none';
    });
  }

});
