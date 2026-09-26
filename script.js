/* ==========================================================================
   SCRIPT.JS - CONSULTORIA PERSONAL APOLLO (SISTEMA COMPLETO)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------------------------
       1. CONTROLE DE NAVEGAÇÃO E HEADER DINÂMICO
       ---------------------------------------------------------------------- */
    const header = document.querySelector('.site-header');
    let lastScrollY = window.pageYOffset;

    const handleHeaderScroll = () => {
        const currentScrollY = window.pageYOffset;

        // Adiciona classe para estilar header fixo após rolar
        if (currentScrollY > 50) {
            header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.8)';
            header.style.background = 'rgba(8, 8, 8, 0.98)';
            header.style.backdropFilter = 'blur(15px)';
        } else {
            header.style.boxShadow = 'none';
            header.style.background = 'rgba(8, 8, 8, 0.95)';
        }

        // Esconde ao rolar para baixo, revela ao rolar para cima
        if (currentScrollY > 400 && currentScrollY > lastScrollY) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        header.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease, box-shadow 0.3s ease';
        lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });


    /* ----------------------------------------------------------------------
       2. SCROLL REVEAL OBSERVER (ANIMAÇÕES DE ENTRADA SUAVE)
       ---------------------------------------------------------------------- */
    const revealOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.12
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Anima apenas uma vez
            }
        });
    }, revealOptions);

    // Mapeia e observa elementos relevantes da página
    const selectorsToAnimate = [
        '.hero-title', '.hero-lead', '.hero-actions',
        '.step-card', '.obj-card', '.brand-card',
        '.sobre-content', '.planos-banner', '.pillar-item'
    ];

    selectorsToAnimate.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.classList.add('reveal-on-scroll');
            // Adiciona atraso escalonado (stagger) para itens em sequências
            el.style.transitionDelay = `${(index % 4) * 0.15}s`;
            revealObserver.observe(el);
        });
    });


    /* ----------------------------------------------------------------------
       3. HIGHLIGHT ATIVO NO MENU & SMOOTH SCROLL OTIMIZADO
       ---------------------------------------------------------------------- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    // Destaque dinâmico do item de menu via IntersectionObserver
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(section => navObserver.observe(section));

    // Rolagem suave para links de navegação interna
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId) return;

            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                e.preventDefault();
                const headerHeight = 80;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    /* ----------------------------------------------------------------------
       4. EFEITO TILT 3D INTERATIVO NOS CARDS (LUXO / PREMIUM)
       ---------------------------------------------------------------------- */
    const tiltCards = document.querySelectorAll('.obj-card, .step-card, .brand-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -8; // Máximo 8 graus
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            card.style.transition = 'transform 0.1s ease-out';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            card.style.transition = 'transform 0.5s ease-in-out';
        });
    });


    /* ----------------------------------------------------------------------
       5. AVISO E ESCONDER BOTOES FLUTUANTES NO FOOTER
       ---------------------------------------------------------------------- */
    const floatingSocials = document.querySelector('.floating-socials');
    
    if (floatingSocials) {
        window.addEventListener('scroll', () => {
            const scrollBottom = window.innerHeight + window.pageYOffset;
            const pageHeight = document.documentElement.scrollHeight;

            // Oculta levemente se estiver quase no fim da página para não cobrir o rodapé
            if (pageHeight - scrollBottom < 100) {
                floatingSocials.style.opacity = '0.3';
                floatingSocials.style.pointerEvents = 'none';
            } else {
                floatingSocials.style.opacity = '1';
                floatingSocials.style.pointerEvents = 'all';
            }
            floatingSocials.style.transition = 'opacity 0.3s ease';
        });
    }

    /* ----------------------------------------------------------------------
       6. RASTREAMENTO DE CLIQUES NOS BOTÕES CTA (ANALYTICS / CONVERSÃO)
       ---------------------------------------------------------------------- */
    const ctaButtons = document.querySelectorAll('a[href*="wa.me"], a[href*="instagram.com"]');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const destination = button.href.includes('wa.me') ? 'WhatsApp' : 'Instagram';
            console.log(`[Conversão] Clique registrado para o destino: ${destination}`);
            // Exemplo: se usar Google Analytics / Meta Pixel no futuro, dispara o evento aqui:
            // if (typeof gtag === 'function') { gtag('event', 'click', { 'event_category': 'CTA', 'event_label': destination }); }
        });
    });

});