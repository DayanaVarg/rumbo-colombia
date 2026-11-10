'use strict';

document.addEventListener('DOMContentLoaded', () => {
  /* ===== 1. Menú hamburguesa (móvil) ===== */
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('menuPrincipal');

  const closeMenu = () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  /* ===== 2. Filtro de destinos ===== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('#gridDestinos .card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filtro = btn.dataset.filter;
      cards.forEach(card => {
        const categoria = card.dataset.category;
        card.classList.toggle('hide', filtro !== 'todos' && categoria !== filtro);
      });
    });
  });

  /* ===== 3. Preseleccionar paquete desde las tarjetas ===== */
  const selectPaquete = document.getElementById('paquete');
  document.querySelectorAll('[data-paquete]').forEach(link => {
    link.addEventListener('click', () => {
      selectPaquete.value = link.dataset.paquete;
    });
  });

  /* ===== 4. Galería con visor ampliado ===== */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeLightbox = () => { lightbox.hidden = true; };

  document.querySelectorAll('#gallery figure').forEach(fig => {
    fig.addEventListener('click', () => {
      const img = fig.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.hidden = false;
    });
  });
  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  /* ===== 5. Validación del formulario ===== */
  const form = document.getElementById('formCotizacion');
  const status = document.getElementById('formStatus');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const mostrarError = (campo, mensaje) => {
    const wrapper = campo.closest('.field');
    wrapper.classList.toggle('invalid', Boolean(mensaje));
    wrapper.querySelector('.error').textContent = mensaje;
    return !mensaje;
  };

  const validarCampo = campo => {
    const valor = campo.value.trim();
    switch (campo.id) {
      case 'nombre':
        return mostrarError(campo, valor.length < 3 ? 'Ingresa tu nombre completo.' : '');
      case 'email':
        return mostrarError(campo, !emailRegex.test(valor) ? 'Ingresa un correo válido.' : '');
      case 'destino':
      case 'paquete':
        return mostrarError(campo, !valor ? 'Selecciona una opción.' : '');
      case 'personas': {
        const n = Number(valor);
        return mostrarError(campo, !(n >= 1 && n <= 20) ? 'Entre 1 y 20 personas.' : '');
      }
      default:
        return true;
    }
  };

  const camposRequeridos = form.querySelectorAll('[required]');
  camposRequeridos.forEach(c => c.addEventListener('blur', () => validarCampo(c)));

  form.addEventListener('submit', e => {
    e.preventDefault();
    status.textContent = '';
    let valido = true;
    camposRequeridos.forEach(c => { if (!validarCampo(c)) valido = false; });

    if (valido) {
      const nombre = form.nombre.value.trim().split(' ')[0];
      status.textContent = `¡Gracias, ${nombre}! Recibimos tu solicitud y te contactaremos pronto.`;
      form.reset();
      form.personas.value = 2;
    } else {
      const primero = form.querySelector('.invalid input, .invalid select');
      if (primero) primero.focus();
    }
  });
});
