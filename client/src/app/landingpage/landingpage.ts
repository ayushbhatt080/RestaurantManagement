import {
    Component,
    OnInit,
    OnDestroy,
    AfterViewInit,
    HostListener,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-tableflow-landing',
    templateUrl: './landingpage.component.html',
    styleUrls: ['./landingpage.component.scss']
})

export class LandingComponent implements OnInit, AfterViewInit, OnDestroy {
    constructor(private router: Router) { }

    isDarkMode = false;
    isScrolled = false;
    mobileMenuOpen = false;
    currentYear = new Date().getFullYear();

    carouselItems = [
        {
            label: 'Italian Cuisine',
            emoji: '🍝',
            color: '#8b1a1a',
            sub: 'Handcrafted Pasta',
        },
        {
            label: 'Japanese Omakase',
            emoji: '🍣',
            color: '#1a3a4a',
            sub: 'Precision & Art',
        },
        {
            label: 'Indian Spice Trail',
            emoji: '🍛',
            color: '#5c3317',
            sub: 'Rich Aromatics',
        },
        {
            label: 'French Bistro',
            emoji: '🥐',
            color: '#2c2c1a',
            sub: 'Classical Elegance',
        },
        {
            label: 'Grill & Steakhouse',
            emoji: '🥩',
            color: '#2a1a0a',
            sub: 'Prime Cuts',
        },
        {
            label: 'Asian Fusion',
            emoji: '🍜',
            color: '#1a2a1a',
            sub: 'East Meets West',
        },
    ];

    secondCuisineItems = [
        { emoji: '🍕', label: 'Wood-fired Pizza' },
        { emoji: '🥟', label: 'Dim Sum' },
        { emoji: '🫕', label: 'Tagine' },
        { emoji: '🍤', label: 'Tempura' },
        { emoji: '🥗', label: 'Farm to Table' },
        { emoji: '🍷', label: 'Wine Pairing' },
        { emoji: '🧆', label: 'Middle Eastern' },
        { emoji: '🫔', label: 'Mexican Street' },
    ];

    features = [
        {
            icon: '⚡',
            title: 'Real-Time Order Tracking',
            desc: 'Live order status updates from kitchen to table. Zero lag, full visibility across every station.',
        },
        {
            icon: '📋',
            title: 'Menu Management',
            desc: 'Create, update, and schedule menus dynamically. Seasonal changes in seconds, not hours.',
        },
        {
            icon: '🔐',
            title: 'Role-Based Access',
            desc: 'Granular permissions for Admins, Managers, and Customers. Everyone sees exactly what they need.',
        },
        {
            icon: '💬',
            title: 'Feedback System',
            desc: 'Collect, analyze, and act on guest feedback in real time. Turn reviews into revenue.',
        },
        {
            icon: '📊',
            title: 'Analytics Dashboard',
            desc: 'Deep insights into sales, peak hours, and staff performance. Data-driven dining excellence.',
        },
        {
            icon: '🔒',
            title: 'JWT Authentication',
            desc: 'Enterprise-grade security with token-based auth. Your data stays yours, always.',
        },
    ];

    roles = [
        {
            role: 'Customer',
            icon: '👤',
            tagline: 'Effortless Dining',
            color: '#c19a4c',
            points: [
                'Browse live menus & specials',
                'Place and track orders in real time',
                'Submit feedback & ratings',
                'View order history & receipts',
            ],
        },
        {
            role: 'Manager',
            icon: '🧑‍💼',
            tagline: 'Command & Control',
            color: '#d4af6a',
            points: [
                'Monitor floor and kitchen status',
                'Manage staff shifts & roles',
                'Edit menus and pricing live',
                'Access sales & performance reports',
            ],
        },
        {
            role: 'Administrator',
            icon: '⚙️',
            tagline: 'Total Oversight',
            color: '#e8c87a',
            points: [
                'Full system configuration',
                'User & role management',
                'Integration & API controls',
                'Audit logs & security settings',
            ],
        },
    ];

    private observer!: IntersectionObserver;

    @HostListener('window:scroll')
    onScroll(): void {
        this.isScrolled = window.scrollY > 60;
    }


    ngOnInit(): void {
        const savedTheme = localStorage.getItem('theme');
        this.isDarkMode = savedTheme === 'dark';
        this.applyTheme();
    }

    ngAfterViewInit(): void {
        this.initScrollReveal();
    }

    ngOnDestroy(): void {
        if (this.observer) {
            this.observer.disconnect();
        }
    }

    toggleMobileMenu(): void {
        this.mobileMenuOpen = !this.mobileMenuOpen;
    }

    scrollTo(id: string): void {
        const el = document.getElementById(id);

        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }

        this.mobileMenuOpen = false;
    }

    goToLogin(): void {
        this.mobileMenuOpen = false;
        this.router.navigateByUrl('/login');
    }

    goToRegister(): void {
        this.mobileMenuOpen = false;
        this.router.navigateByUrl('/register');
    }

    private initScrollReveal(): void {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );

        setTimeout(() => {
            const elements = document.querySelectorAll('[data-reveal]');
            elements.forEach((el) => this.observer.observe(el));
        }, 100);
    }

    toggleTheme(): void {
        this.isDarkMode = !this.isDarkMode;
        localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
        this.applyTheme();
    }

    applyTheme(): void {
        document.body.classList.toggle('dark-mode', this.isDarkMode);
    }

}
