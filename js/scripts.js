

window.addEventListener('DOMContentLoaded', () => {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    window.addEventListener('beforeunload', () => window.scrollTo(0, 0));
    window.addEventListener('pageshow', () => window.scrollTo(0, 0));

    const mainNav = document.querySelector('#mainNav');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navLinks = Array.from(document.querySelectorAll('#navbarResponsive .nav-link'));
    const navItems = Array.from(document.querySelectorAll('#mainNav .nav-item'));
    const portfolioItems = Array.from(document.querySelectorAll('.portfolio-item'));
    const sectionBlocks = Array.from(document.querySelectorAll('header.masthead, #portfolio, #about, #contact'));
    const dividerBlocks = Array.from(document.querySelectorAll('.divider-custom'));

    const navbarShrink = () => {
        if (!mainNav) {
            return;
        }
        mainNav.classList.toggle('navbar-shrink', window.scrollY > 0);
    };

    navbarShrink();
    document.addEventListener('scroll', navbarShrink);

    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (navbarToggler && window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    if (typeof gsap === 'undefined') {
        return;
    }

    const hasScrollTrigger = typeof ScrollTrigger !== 'undefined';
    if (hasScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    const splitTargets = Array.from(document.querySelectorAll(
        '.masthead-heading, #portfolio .page-section-heading, #about .page-section-heading, #contact .page-section-heading'
    ));
    const shouldSplitText = window.innerWidth >= 768;

    const splitToChars = (element) => {
        if (!element || element.dataset.splitReady === '1') {
            return;
        }
        const frag = document.createDocumentFragment();
        element.textContent.split('').forEach((char) => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char === ' ' ? '\u00A0' : char;
            frag.appendChild(span);
        });
        element.textContent = '';
        element.appendChild(frag);
        element.dataset.splitReady = '1';
    };

    if (shouldSplitText) {
        splitTargets.forEach(splitToChars);
    }

    gsap.set(
        '.masthead-heading, .masthead-subheading, .page-section-heading, .divider-custom, .lead, .contact-social-icon, .footer',
        { autoAlpha: 1 }
    );
    gsap.set('.portfolio-item', { transformOrigin: 'center center' });

    const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    heroTl
        .from(navItems, { y: -20, autoAlpha: 0, stagger: 0.06, duration: 0.38 })
        .fromTo(
            '.masthead-avatar',
            { autoAlpha: 0, scale: 0.75, filter: 'blur(10px)' },
            { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 1.05, clearProps: 'filter,transform,opacity' },
            '-=0.1'
        )
        .from(shouldSplitText ? '.masthead-heading .char' : '.masthead-heading', {
            autoAlpha: 0,
            y: 64,
            rotationX: -70,
            stagger: shouldSplitText ? 0.03 : 0,
            duration: 0.58,
            ease: 'back.out(1.8)',
        }, '-=0.72')
        .from('.masthead .divider-custom', { autoAlpha: 0, y: 30, scaleX: 0.6, duration: 0.62 }, '-=0.45')
        .from('.masthead-subheading', { autoAlpha: 0, y: 26, filter: 'blur(6px)', duration: 0.66 }, '-=0.38');

    gsap.to('.masthead-avatar', {
        y: -10,
        duration: 2.3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
    });

    if (hasScrollTrigger) {
        sectionBlocks.forEach((section) => {
            gsap.from(section, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 85%',
                    once: true,
                },
                y: 56,
                autoAlpha: 0,
                scale: 0.985,
                filter: 'blur(6px)',
                duration: 0.8,
                ease: 'power3.out',
                clearProps: 'opacity,transform,filter',
            });
        });

        dividerBlocks.forEach((divider) => {
            gsap.from(divider, {
                scrollTrigger: {
                    trigger: divider,
                    start: 'top 92%',
                    once: true,
                },
                scaleX: 0.2,
                autoAlpha: 0,
                transformOrigin: 'center center',
                duration: 0.7,
                ease: 'back.out(1.4)',
                clearProps: 'opacity,transform',
            });
        });

        gsap.from(shouldSplitText ? '#portfolio .page-section-heading .char' : '#portfolio .page-section-heading', {
            scrollTrigger: { trigger: '#portfolio', start: 'top 80%', once: true },
            autoAlpha: 0,
            y: 38,
            rotation: () => gsap.utils.random(-14, 14),
            stagger: shouldSplitText ? 0.026 : 0,
            duration: 0.55,
            ease: 'power3.out',
        });

        gsap.from(shouldSplitText ? '#about .page-section-heading .char' : '#about .page-section-heading', {
            scrollTrigger: { trigger: '#about', start: 'top 82%', once: true },
            autoAlpha: 0,
            x: -22,
            rotationY: 70,
            stagger: shouldSplitText ? 0.028 : 0,
            duration: 0.52,
            ease: 'power2.out',
        });

        gsap.from(shouldSplitText ? '#contact .page-section-heading .char' : '#contact .page-section-heading', {
            scrollTrigger: { trigger: '#contact', start: 'top 84%', once: true },
            autoAlpha: 0,
            scale: 0.35,
            y: 18,
            stagger: shouldSplitText ? 0.022 : 0,
            duration: 0.48,
            ease: 'elastic.out(1, 0.62)',
        });

        if (portfolioItems.length >= 5) {
            ScrollTrigger.create({
                trigger: '#portfolio',
                start: 'top 90%',
                once: true,
                onEnter: () => {
                    const off = Math.max(window.innerWidth * 0.92, 1100);
                    const [top1, top2, top3, bottom1, bottom2] = portfolioItems;

                    portfolioItems.forEach((item) => item.classList.add('portfolio-item-animating'));

                    gsap.killTweensOf(portfolioItems);
                    gsap.set(portfolioItems, { autoAlpha: 0, x: 0, y: 0, rotation: 0, scale: 1, filter: 'blur(0px)' });

                    gsap.set(top1, { x: -off, y: -56, scale: 0.88, filter: 'blur(8px)' });
                    gsap.set(top2, { x: off, y: -46, scale: 0.88, filter: 'blur(8px)' });
                    gsap.set(top3, { x: off, y: -56, scale: 0.88, filter: 'blur(8px)' });
                    gsap.set(bottom1, { x: off, y: 54, scale: 0.88, filter: 'blur(8px)' });
                    gsap.set(bottom2, { x: -off, y: 44, scale: 0.88, filter: 'blur(8px)' });

                    const tl = gsap.timeline({
                        onComplete: () => {
                            gsap.set(portfolioItems, {
                                autoAlpha: 1,
                                x: 0,
                                y: 0,
                                rotation: 0,
                                rotationX: 0,
                                rotationY: 0,
                                scale: 1,
                                filter: 'blur(0px)',
                                clearProps: 'transform,opacity,filter',
                            });
                            portfolioItems.forEach((item) => item.classList.remove('portfolio-item-animating'));
                        },
                    });

                    tl.to(top1, { autoAlpha: 1, x: 24, y: 0, scale: 1.01, filter: 'blur(0px)', duration: 0.76, ease: 'expo.out' }, 0)
                      .to(top2, { autoAlpha: 1, x: -24, y: 0, scale: 1.01, filter: 'blur(0px)', duration: 0.76, ease: 'expo.out' }, 0)
                      .to([top1, top2], { x: 0, scale: 1, duration: 0.18, ease: 'back.out(2.1)' })
                      .to(top3, { autoAlpha: 1, x: -22, y: 0, scale: 1.01, filter: 'blur(0px)', duration: 0.56, ease: 'power4.out' }, '-=0.06')
                      .to(top2, { x: -10, duration: 0.08, ease: 'power2.out' }, '<')
                      .to([top2, top3], { x: 0, scale: 1, duration: 0.16, ease: 'back.out(2.2)' })

                      .to(bottom1, { autoAlpha: 1, x: -26, y: 0, scale: 1.01, filter: 'blur(0px)', duration: 0.78, ease: 'expo.out' }, '-=0.16')
                      .to(bottom2, { autoAlpha: 1, x: 26, y: 0, scale: 1.01, filter: 'blur(0px)', duration: 0.78, ease: 'expo.out' }, '<')
                      .to([bottom1, bottom2], { x: 0, scale: 1, duration: 0.2, ease: 'back.out(2.2)' });
                },
            });
        } else if (portfolioItems.length) {
            gsap.fromTo(
                portfolioItems,
                { autoAlpha: 0, y: 70, scale: 0.9, filter: 'blur(8px)' },
                {
                    scrollTrigger: { trigger: '#portfolio', start: 'top 90%', once: true },
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    filter: 'blur(0px)',
                    duration: 0.72,
                    stagger: 0.11,
                    ease: 'expo.out',
                    clearProps: 'opacity,transform,filter',
                }
            );
        }

        gsap.to('.masthead-avatar', {
            yPercent: -16,
            ease: 'none',
            scrollTrigger: { trigger: '.masthead', start: 'top top', end: 'bottom top', scrub: 1 },
        });
        gsap.to('.masthead-heading', {
            yPercent: -12,
            ease: 'none',
            scrollTrigger: { trigger: '.masthead', start: 'top top', end: 'bottom top', scrub: 0.9 },
        });
        gsap.to('#portfolio .page-section-heading', {
            yPercent: -8,
            ease: 'none',
            scrollTrigger: { trigger: '#portfolio', start: 'top bottom', end: 'bottom top', scrub: 0.8 },
        });
        gsap.to('#about .container', {
            yPercent: -10,
            ease: 'none',
            scrollTrigger: { trigger: '#about', start: 'top bottom', end: 'bottom top', scrub: 0.85 },
        });
        gsap.to('#contact .container', {
            yPercent: -12,
            ease: 'none',
            scrollTrigger: { trigger: '#contact', start: 'top bottom', end: 'bottom top', scrub: 0.9 },
        });
    }

    const navBg = typeof gsap.quickTo === 'function'
        ? gsap.quickTo('#mainNav', 'backgroundColor', { duration: 0.25, ease: 'power2.out' })
        : (value) => gsap.to('#mainNav', { backgroundColor: value, duration: 0.25, ease: 'power2.out', overwrite: true });

    const updateNav = () => {
        if (!mainNav) {
            return;
        }
        if (window.scrollY > 10) {
            navBg('rgba(25, 35, 44, 0.96)');
            gsap.to(mainNav, {
                paddingTop: '0.48rem',
                paddingBottom: '0.48rem',
                boxShadow: '0 10px 28px rgba(0,0,0,0.35)',
                duration: 0.25,
                overwrite: true,
            });
        } else {
            navBg('rgba(44, 62, 80, 1)');
            gsap.to(mainNav, {
                paddingTop: '',
                paddingBottom: '',
                boxShadow: 'none',
                duration: 0.25,
                overwrite: true,
            });
        }
    };

    updateNav();
    document.addEventListener('scroll', updateNav);

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const href = anchor.getAttribute('href');
            if (!href || href === '#') {
                return;
            }
            const target = document.querySelector(href);
            if (!target) {
                return;
            }
            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    portfolioItems.forEach((item) => {
        const image = item.querySelector('img');
        const caption = item.querySelector('.portfolio-item-caption');
        const icon = item.querySelector('.portfolio-item-caption-content i');
        const label = item.querySelector('.caption-label');

        item.addEventListener('mouseenter', () => {
            if (item.classList.contains('portfolio-item-animating')) {
                return;
            }

            gsap.to(item, { y: -10, scale: 1.03, duration: 0.3, ease: 'power3.out', overwrite: true });
            if (image) {
                gsap.to(image, { scale: 1.08, duration: 0.34, ease: 'power3.out', overwrite: true });
            }
            if (caption) {
                gsap.to(caption, { autoAlpha: 1, duration: 0.2, overwrite: true });
            }
            if (icon) {
                gsap.fromTo(icon, { autoAlpha: 0, scale: 0.4, y: 14 }, { autoAlpha: 1, scale: 1.08, y: 0, duration: 0.3, ease: 'back.out(1.9)', overwrite: true });
            }
            if (label) {
                gsap.fromTo(label, { autoAlpha: 0, y: 12, letterSpacing: '0.14em' }, { autoAlpha: 1, y: 0, letterSpacing: '0.04em', duration: 0.32, ease: 'power3.out', overwrite: true });
            }
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(item, { y: 0, scale: 1, duration: 0.36, ease: 'power3.out', overwrite: true });
            if (image) {
                gsap.to(image, { scale: 1, duration: 0.34, ease: 'power3.out', overwrite: true });
            }
            if (caption) {
                gsap.to(caption, { autoAlpha: '', duration: 0.18, overwrite: true });
            }
            if (icon) {
                gsap.to(icon, { autoAlpha: 0, scale: 0.85, y: 8, duration: 0.18, overwrite: true });
            }
            if (label) {
                gsap.to(label, { autoAlpha: 0, y: 8, duration: 0.18, overwrite: true });
            }
        });
    });
});

