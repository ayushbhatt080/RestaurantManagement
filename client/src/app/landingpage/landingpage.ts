import {
    Component,
    OnInit,
    OnDestroy,
    AfterViewInit,
    HostListener,
    ChangeDetectorRef,
} from '@angular/core';

import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FloatingChatbotComponent } from '../component/chat-bot/chatbot.component';

// ─── Interfaces ────────────────────────────────────────────────────────────────

interface CuisineItem {
    name: string;
    category: string;
    image: string;
}

interface Feature {
    icon: string;
    title: string;
    description: string;
    tag: string;
}

interface Role {
    icon: string;
    title: string;
    badge: string;
    description: string;
    perks: string[];
}

interface Particle {
    left: string;
    top: string;
    delay: string;
}

interface FloatingHeroImage {
    src: string;
    alt: string;
    objectClass: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

@Component({
    selector: 'app-landingpage',
    standalone: true,
    imports: [
        CommonModule,
        FloatingChatbotComponent
    ],
    templateUrl: './landingpage.component.html',
    styleUrls: ['./landingpage.component.scss'],
})
export class LandingpageComponent implements OnInit, AfterViewInit, OnDestroy {
    // ── State ────────────────────────────────────────────────────────────────────
    isDark = false;
    isScrolled = false;
    mobileMenuOpen = false;
    isLoading = true;
    showBackToTop = false;
    activeSection = 'home';

    // ── Typing Animation ─────────────────────────────────────────────────────────
    typingText = '';

    private typingPhrases = [
        'more people.',
        'less effort.',
        'every order.',
        'your team.',
    ];

    private typingIndex = 0;
    private charIndex = 0;
    private typingTimer: ReturnType<typeof setTimeout> | null = null;
    private isDeleting = false;

    // ── 3D Parallax State ────────────────────────────────────────────────────────
    private parallaxFrame: number | null = null;
    private latestMouseEvent: MouseEvent | null = null;

    private readonly isTouchDevice =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(pointer: coarse)').matches;

    // ── Floating 3D Hero Images ──────────────────────────────────────────────────
    floatingHeroImages: FloatingHeroImage[] = [
        {
            src: 'https://b.zmtcdn.com/data/o2_assets/110a09a9d81f0e5305041c1b507d0f391743058910.png',
            alt: 'A delicious cheeseburger',
            objectClass: 'obj-1',
        },
        {
            src: 'https://b.zmtcdn.com/data/o2_assets/b4f62434088b0ddfa9b370991f58ca601743060218.png',
            alt: 'A bamboo steamer with dumplings',
            objectClass: 'obj-2',
        },
        {
            src: 'https://b.zmtcdn.com/data/o2_assets/316495f4ba2a9c9d9aa97fed9fe61cf71743059024.png',
            alt: 'A slice of pizza',
            objectClass: 'obj-3',
        },
        {
            src: 'https://b.zmtcdn.com/data/o2_assets/70b50e1a48a82437bfa2bed925b862701742892555.png',
            alt: 'A basil leaf',
            objectClass: 'obj-4',
        },
        {
            src: 'https://b.zmtcdn.com/data/o2_assets/9ef1cc6ecf1d92798507ffad71e9492d1742892584.png',
            alt: 'A slice of tomato',
            objectClass: 'obj-5',
        },
        {
            src: 'https://b.zmtcdn.com/data/o2_assets/9ef1cc6ecf1d92798507ffad71e9492d1742892584.png',
            alt: 'A slice of tomato',
            objectClass: 'obj-6',
        },
    ];

    // ── Particles ────────────────────────────────────────────────────────────────
    particles: Particle[] = Array.from({ length: 14 }, (_, i) => ({
        left: `${Math.random() * 90 + 5}%`,
        top: `${Math.random() * 70 + 5}%`,
        delay: `${i * 0.4}s`,
    }));

    // ── Observer refs ────────────────────────────────────────────────────────────
    private counterObserver: IntersectionObserver | null = null;
    private revealObserver: IntersectionObserver | null = null;
    private sectionObserver: IntersectionObserver | null = null;
    private countersAnimated = false;

    // ─── Data Arrays ─────────────────────────────────────────────────────────────

    carouselItems: CuisineItem[] = [
        {
            name: 'Margherita Pizza',
            category: 'Italian',
            image:
                'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop&q=80',
        },
        {
            name: 'Classic Burger',
            category: 'American',
            image:
                'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80',
        },
        {
            name: 'Salmon Sushi',
            category: 'Japanese',
            image:
                'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&auto=format&fit=crop&q=80',
        },
        {
            name: 'Creamy Pasta',
            category: 'Italian',
            image:
                'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&auto=format&fit=crop&q=80',
        },
        {
            name: 'Crispy Fries',
            category: 'Snacks',
            image:
                'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&auto=format&fit=crop&q=80',
        },
        {
            name: 'Tacos',
            category: 'Mexican',
            image:
                'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&auto=format&fit=crop&q=80',
        },
    ];

    secondCuisineItems: CuisineItem[] = [
        {
            name: 'Pad Thai',
            category: 'Thai',
            image:
                'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&auto=format&fit=crop&q=80',
        },
        {
            name: 'Ramen',
            category: 'Japanese',
            image:
                'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&auto=format&fit=crop&q=80',
        },
        {
            name: 'Mezze Platter',
            category: 'Mediterranean',
            image:
                'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&auto=format&fit=crop&q=80',
        },
        {
            name: 'Smoothie Bowl',
            category: 'Healthy',
            image:
                'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop&q=80',
        },
        {
            name: 'Craft Cocktail',
            category: 'Drinks',
            image:
                'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&auto=format&fit=crop&q=80',
        },
        {
            name: 'Cheesecake',
            category: 'Dessert',
            image:
                'https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=400&auto=format&fit=crop&q=80',
        },
    ];

    features: Feature[] = [
        {
            icon: '🛒',
            title: 'Smart Order Management',
            description:
                'Real-time order tracking, status updates, and seamless kitchen routing for frictionless service.',
            tag: 'Core',
        },
        {
            icon: '📋',
            title: 'Dynamic Menu Builder',
            description:
                'Create, edit, and publish menus instantly with rich media, pricing tiers, and availability controls.',
            tag: 'Manager',
        },
        {
            icon: '🔐',
            title: 'JWT Auth & RBAC',
            description:
                'Enterprise-grade security with role-based access control ensuring every user sees only what they need.',
            tag: 'Security',
        },
        {
            icon: '📊',
            title: 'Analytics Dashboard',
            description:
                'Deep business insights — revenue trends, top dishes, customer behavior, and operational metrics.',
            tag: 'Analytics',
        },
        {
            icon: '🏪',
            title: 'Multi-Restaurant Admin',
            description:
                'Centralized control panel for administrators to onboard restaurants, manage users, and audit activity.',
            tag: 'Admin',
        },
        {
            icon: '🔔',
            title: 'Real-time Notifications',
            description:
                'Instant push alerts for order status, kitchen delays, low inventory, and platform events.',
            tag: 'Live',
        },
    ];

    roles: Role[] = [
        {
            icon: '👤',
            title: 'Customer',
            badge: 'End User',
            description:
                'Discover restaurants, browse menus, place orders and track them in real time — all in one place.',
            perks: [
                'Browse restaurant listings',
                'Place & track orders live',
                'View order history',
                'Manage personal profile',
            ],
        },
        {
            icon: '🧑‍🍳',
            title: 'Restaurant Manager',
            badge: 'Operator',
            description:
                'Full control of your restaurant — from menu management to order fulfillment and staff coordination.',
            perks: [
                'Manage menus & pricing',
                'Accept / reject orders',
                'View revenue analytics',
                'Configure restaurant profile',
            ],
        },
        {
            icon: '🛡️',
            title: 'Administrator',
            badge: 'Platform Admin',
            description:
                'Platform-wide oversight — onboard restaurants, manage all users, and maintain system health.',
            perks: [
                'Add & manage restaurants',
                'Oversee all users',
                'Platform activity audit',
                'System configuration',
            ],
        },
    ];

    // ─── Constructor ─────────────────────────────────────────────────────────────

    constructor(
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    // ─── Lifecycle ───────────────────────────────────────────────────────────────

    ngOnInit(): void {
        this.loadTheme();
        this.startTypingAnimation();

        setTimeout(() => {
            this.isLoading = false;
            this.cdr.markForCheck();
        }, 1400);
    }

    ngAfterViewInit(): void {
        this.initRevealObserver();
        this.initCounterObserver();
        this.initSectionObserver();
    }

    ngOnDestroy(): void {
        this.revealObserver?.disconnect();
        this.counterObserver?.disconnect();
        this.sectionObserver?.disconnect();

        if (this.typingTimer) {
            clearTimeout(this.typingTimer);
        }

        if (this.parallaxFrame) {
            cancelAnimationFrame(this.parallaxFrame);
        }
    }

    // ─── Routing Methods ─────────────────────────────────────────────────────────

    goToLogin(): void {
        this.router.navigateByUrl('/login');
    }

    goToRegister(): void {
        this.router.navigateByUrl('/register');
    }

    // ─── Scroll Methods ───────────────────────────────────────────────────────────

    scrollTo(sectionId: string): void {
        this.mobileMenuOpen = false;

        const el = document.getElementById(sectionId);

        if (el) {
            const offset = 80;
            const top = el.getBoundingClientRect().top + window.scrollY - offset;

            window.scrollTo({
                top,
                behavior: 'smooth',
            });
        }
    }

    scrollToTop(): void {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    // ─── Theme Methods ────────────────────────────────────────────────────────────

    private loadTheme(): void {
        const savedTheme = localStorage.getItem('irwoms-theme');

        if (savedTheme === 'dark') {
            this.isDark = true;
        } else if (savedTheme === 'light') {
            this.isDark = false;
        } else {
            this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }

        this.applyTheme();
    }

    toggleTheme(): void {
        this.isDark = !this.isDark;

        localStorage.setItem('irwoms-theme', this.isDark ? 'dark' : 'light');

        this.applyTheme();
        this.cdr.markForCheck();
    }

    private applyTheme(): void {
        const root = document.documentElement;

        root.classList.toggle('dark-root', this.isDark);
        root.classList.toggle('dark', this.isDark);
    }

    // ─── Mobile Menu ─────────────────────────────────────────────────────────────

    toggleMobileMenu(): void {
        this.mobileMenuOpen = !this.mobileMenuOpen;
    }

    // ─── Host Listeners ───────────────────────────────────────────────────────────

    @HostListener('window:scroll')
    onWindowScroll(): void {
        this.isScrolled = window.scrollY > 40;
        this.showBackToTop = window.scrollY > 500;
    }

    @HostListener('window:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        if (this.isTouchDevice) {
            return;
        }

        const hero = document.querySelector<HTMLElement>('.hero-section');

        if (!hero) {
            return;
        }

        const rect = hero.getBoundingClientRect();

        const isInsideHero =
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom;

        if (!isInsideHero) {
            return;
        }

        this.latestMouseEvent = event;

        if (this.parallaxFrame) {
            return;
        }

        this.parallaxFrame = requestAnimationFrame(() => {
            this.updateFloatingParallax();
            this.parallaxFrame = null;
        });
    }

    @HostListener('window:mouseleave')
    onWindowMouseLeave(): void {
        this.resetFloatingParallax();
    }

    // ─── Floating 3D Parallax ────────────────────────────────────────────────────

    private updateFloatingParallax(): void {
        if (!this.latestMouseEvent) {
            return;
        }

        const hero = document.querySelector<HTMLElement>('.hero-section');

        if (!hero) {
            return;
        }

        const rect = hero.getBoundingClientRect();

        const normalizedX =
            (this.latestMouseEvent.clientX - rect.left) / rect.width - 0.5;

        const normalizedY =
            (this.latestMouseEvent.clientY - rect.top) / rect.height - 0.5;

        const floatingObjects =
            document.querySelectorAll<HTMLElement>('.float-3d');

        floatingObjects.forEach((el, index) => {
            const depth = index + 1;

            const moveX = normalizedX * depth * 10;
            const moveY = normalizedY * depth * 8;

            const rotateX = normalizedY * -10;
            const rotateY = normalizedX * 14;

            el.style.setProperty('--tx', `${moveX}px`);
            el.style.setProperty('--ty', `${moveY}px`);
            el.style.setProperty('--mouse-rx', `${rotateX}deg`);
            el.style.setProperty('--mouse-ry', `${rotateY}deg`);
        });
    }

    private resetFloatingParallax(): void {
        const floatingObjects =
            document.querySelectorAll<HTMLElement>('.float-3d');

        floatingObjects.forEach((el) => {
            el.style.setProperty('--tx', '0px');
            el.style.setProperty('--ty', '0px');
            el.style.setProperty('--mouse-rx', '0deg');
            el.style.setProperty('--mouse-ry', '0deg');
        });
    }

    // ─── Typing Animation ─────────────────────────────────────────────────────────

    private startTypingAnimation(): void {
        const phrase = this.typingPhrases[this.typingIndex];
        const speed = this.isDeleting ? 60 : 100;
        const pauseDelay = 1800;

        if (!this.isDeleting && this.charIndex <= phrase.length) {
            this.typingText = phrase.slice(0, this.charIndex++);
            this.typingTimer = setTimeout(() => this.startTypingAnimation(), speed);
        } else if (this.isDeleting && this.charIndex >= 0) {
            this.typingText = phrase.slice(0, this.charIndex--);
            this.typingTimer = setTimeout(() => this.startTypingAnimation(), 50);
        } else if (!this.isDeleting && this.charIndex > phrase.length) {
            this.isDeleting = true;
            this.typingTimer = setTimeout(
                () => this.startTypingAnimation(),
                pauseDelay
            );
        } else {
            this.isDeleting = false;
            this.typingIndex = (this.typingIndex + 1) % this.typingPhrases.length;
            this.typingTimer = setTimeout(() => this.startTypingAnimation(), 300);
        }

        this.cdr.markForCheck();
    }

    // ─── Intersection Observers ───────────────────────────────────────────────────

    private initRevealObserver(): void {
        this.revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: '0px 0px -40px 0px',
            }
        );

        document.querySelectorAll('[data-reveal]').forEach((el) => {
            this.revealObserver?.observe(el);
        });
    }

    private initCounterObserver(): void {
        this.counterObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !this.countersAnimated) {
                        this.countersAnimated = true;
                        this.animateCounters();
                    }
                });
            },
            {
                threshold: 0.5,
            }
        );

        const statsEl = document.querySelector('.hero-stats');

        if (statsEl) {
            this.counterObserver.observe(statsEl);
        }
    }

    private initSectionObserver(): void {
        const sections = ['home', 'about', 'features', 'roles', 'gallery', 'contact'];

        this.sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this.activeSection = entry.target.id;
                        this.cdr.markForCheck();
                    }
                });
            },
            {
                threshold: 0.35,
            }
        );

        sections.forEach((id) => {
            const el = document.getElementById(id);

            if (el) {
                this.sectionObserver?.observe(el);
            }
        });
    }

    // ─── Counter Animation ────────────────────────────────────────────────────────

    private animateCounters(): void {
        const counters =
            document.querySelectorAll<HTMLElement>('.stat-number[data-count]');

        counters.forEach((counter) => {
            const target = parseInt(counter.getAttribute('data-count') || '0', 10);
            const duration = 1800;
            const step = target / (duration / 16);
            let current = 0;

            const tick = () => {
                current += step;

                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(tick);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };

            requestAnimationFrame(tick);
        });
    }
}