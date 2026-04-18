// =============================================
// Navigation
// =============================================
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.content-section');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const menuToggle = document.getElementById('menuToggle');

function navigateTo(sectionId) {
    // Pause all slider videos when navigating away
    document.querySelectorAll('#sliderTrack video').forEach(v => v.pause());

    // Update sections
    sections.forEach(s => {
        s.classList.remove('active');
        s.classList.add('hidden');
    });
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    }

    // Update nav links
    navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === sectionId);
    });

    // Close mobile sidebar
    closeSidebar();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(link.dataset.section);
    });
});

// Hero buttons navigation
document.querySelectorAll('[onclick]').forEach(el => {
    const match = el.getAttribute('onclick').match(/navigateTo\('(\w+)'\)/);
    if (match) {
        el.removeAttribute('onclick');
        el.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(match[1]);
        });
    }
});

// =============================================
// Mobile Sidebar Toggle
// =============================================
function openSidebar() {
    sidebar.classList.add('active');
    overlay.classList.remove('hidden');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
}

menuToggle.addEventListener('click', () => {
    sidebar.classList.contains('active') ? closeSidebar() : openSidebar();
});

overlay.addEventListener('click', closeSidebar);

// Close sidebar on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSidebar();
});

// =============================================
// GitHub Contribution Graph
// =============================================
function generateContributionGraph() {
    const graph = document.getElementById('contributionGraph');
    if (!graph) return;

    const weeks = 52;
    const days = 7;

    for (let w = 0; w < weeks; w++) {
        for (let d = 0; d < days; d++) {
            const cell = document.createElement('div');
            cell.className = 'contrib-cell';

            // Generate weighted random contribution levels
            const rand = Math.random();
            let level;
            if (rand < 0.35) level = 0;
            else if (rand < 0.55) level = 1;
            else if (rand < 0.75) level = 2;
            else if (rand < 0.9) level = 3;
            else level = 4;

            cell.setAttribute('data-level', level);
            graph.appendChild(cell);
        }
    }
}

// =============================================
// Weekly Activity Chart
// =============================================
function generateActivityChart() {
    const chart = document.getElementById('activityChart');
    if (!chart) return;

    const hours = [5.2, 7.1, 3.8, 6.5, 8.3, 2.1, 1.5];
    const maxHours = Math.max(...hours);

    hours.forEach(h => {
        const bar = document.createElement('div');
        bar.className = 'activity-bar';
        bar.style.height = `${(h / maxHours) * 100}%`;
        bar.setAttribute('data-hours', `${h}h`);
        chart.appendChild(bar);
    });
}

// =============================================
// Initialize
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    generateContributionGraph();
    generateActivityChart();
    initCareerCollapse();
    initProjectDetail();
    initMixItUp();
});

// =============================================
// Career Experience Collapse
// =============================================
function initCareerCollapse() {
    document.querySelectorAll('.career-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const details = btn.nextElementSibling;
            const chevron = btn.querySelector('.career-chevron');
            const label = btn.querySelector('.career-toggle-label');
            const isOpen = !details.classList.contains('hidden');

            if (isOpen) {
                details.classList.add('hidden');
                chevron.style.transform = '';
                btn.setAttribute('aria-expanded', 'false');
                if (label) label.textContent = 'Show Details';
            } else {
                details.classList.remove('hidden');
                chevron.style.transform = 'rotate(180deg)';
                btn.setAttribute('aria-expanded', 'true');
                if (label) label.textContent = 'Hide Details';
            }
        });
    });
}

// =============================================
// Project Detail View
// =============================================
let previousSection = 'home';
let sliderIndex = 0;
let sliderMedia = [];
const VIDEO_EXTENSIONS = /\.(mp4|webm|ogg|mov)$/i;

const projectsData = {
    'My Portal App': {
        images: [
            './src/assets/img/projects/myportal.png',
            './src/assets/img/projects/myportal2.png',
        ],
        description: 'Full-featured e-commerce platform with payment integration, inventory management, and real-time analytics dashboard.',
        overview: 'MyPortal is a web-based vendor management and invoice processing platform designed to support corporate procurement operations. The system provides two separate interfaces: an admin portal for internal staff to manage vendors, purchase orders, invoices, and payments; and a self-service portal for external vendors to register, submit invoices, upload documents, and monitor payment status in real time. The system also supports multiple branches with data access restrictions based on user roles.',
        features: [
            'Vendor management: registration, email verification, profile & bank account management',
            'Purchase Order (PO) management with support for data import from Excel files (.xlsx)',
            'Submission and management of invoices by vendors along with uploading supporting documents',
            'Multi-status invoice lifecycle: Submitted → Accepted / Rejected → Payment Process → Paid',
            'URL parameter encryption (AES-256) to prevent ID enumeration on the client side',
            'Automatic email notification via SMTP (PHPMailer) for invoice verification and status updates'
        ],
        tech: [
            { name: 'PHP', badge: 'badge-red', icon: 'devicon-php-plain' },
            { name: 'CodeIgniter', badge: 'badge-orange', icon: 'devicon-codeigniter-plain' },
            { name: 'MySQL', badge: 'badge-slate', icon: 'devicon-mysql-plain' },
            { name: 'SMTP', badge: 'badge-yellow', icon: 'devicon-mailchimp-plain' },
        ],
        github: '#',
        demo: '#'
    },
    'C-Mobile (Migration Project)': {
        images: [
            './src/assets/img/projects/cmobile_before.png',
            './src/assets/img/projects/link_before.png',
            './src/assets/img/projects/cmobile_after.png',
            './src/assets/img/projects/link_after1.png',
            './src/assets/img/projects/link_after2.png',
        ],
        description: 'Collaborative task management tool with real-time updates, drag-and-drop Kanban board, and team productivity tracking.',
        overview: 'C-Mobile is an internal web-based management system built for a training and education company. Originally built on CodeIgniter 3, the entire platform has been rebuilt from the ground up using Laravel 12. The move was driven by the need for a more maintainable, secure, and modern codebase. Functionally, it covers everything the old system did from HR management, leave and work permit approvals, student course registration, payment tracking, and training scheduling — but now with significantly better security, a more consistent UI built on the Edudash Bootstrap 5 template, and a codebase that is actually scalable going forward.',
        features: [
            'User & Group Management — Manage user accounts with group-based role access; each group can be configured with granular view/add/edit/delete permissions per menu',
            'Dynamic Menu Access Control — Sidebar menus are dynamically rendered based on what each group is allowed to see, with per-action permission checks on every route',
            'UX polish — Skeleton loaders on page load, spinner on form submit, SweetAlert2 delete confirmations, flatpickr date pickers, scroll-to-error on validation failure',
            'Leave Request (Pengajuan Cuti) — Multi-level approval flow (HRD → Manager → Director) with rejection reasons; only fully approved when the Director signs off',
            'Student Registration — Register students into one or multiple courses at once, supporting custom course entries and multi-tier discounts',
            'Encrypted IDs — All URL parameters are AES-256-CBC encrypted to prevent ID enumeration'
        ],
        tech: [
            { name: 'Laravel', badge: 'badge-red', icon: 'devicon-laravel-original' },
            { name: 'Bootstrap', badge: 'badge-green', icon: 'devicon-bootstrap-plain' },
            { name: 'TailwindCSS', badge: 'badge-blue', icon: 'devicon-tailwindcss-original' },
            { name: 'MySQL', badge: 'badge-slate', icon: 'devicon-mysql-plain' },
        ],
        github: '#',
        demo: '#'
    },
    'Uki Education': {
        images: [
            './src/assets/img/projects/ukiedu3.png',
            './src/assets/img/projects/ukiedu2.png',
            './src/assets/img/projects/ukiedu1.png',
        ],
        description: 'Internal management system built for UKI Education — a tutoring/education center that operates across multiple branches.',
        overview: 'Internal management system built for UKI Education — a tutoring/education center that operates across multiple branches. It is basically a one-stop platform that handles two main worlds: the academic/student side (enrollments, payments, subjects, tutors, schools) and the HR/employee side (attendance leave, overtime, payroll, performance tracking). The system supports two separate user roles with their own login portals — admins who manage everything, and employees (karyawan) who have their own dashboard to handle personal matters.',
        features: [
            'Dynamic role-based menu — menus and access are controlled per role, making it easy to fine-tune what each user sees',
            'Account switching — users with dual roles (admin + karyawan) can switch between accounts without logging out',
            'Bulk data import — supports Excel import for students, schools, employees, and performance data',
            'Student management — register and track students with full personal and family data, class schedules, and enrollment status',
            'Payment tracking — record and monitor student payment history, including school-level billing',
            'School & branch management — manage partner schools and multi-branch operations',
        ],
        tech: [
            { name: 'Laravel', badge: 'badge-red', icon: 'devicon-laravel-original' },
            { name: 'Bootstrap', badge: 'badge-green', icon: 'devicon-bootstrap-plain' },
            { name: 'TailwindCSS', badge: 'badge-blue', icon: 'devicon-tailwindcss-original' },
            { name: 'MySQL', badge: 'badge-slate', icon: 'devicon-mysql-plain' },
        ],
        github: '#',
        demo: ''
    },
    'Invoice System': {
        images: [
            './src/assets/img/projects/invoice2.png',
        ],
        description: 'Invoice System is an internal business management system built for Creative Media, a company based in Surabaya.',
        overview: 'Invoice System is an internal business management system built for Creative Media, a company based in Surabaya. It handles the full lifecycle of client orders — from capturing company and service data, building orders, generating professional PDF invoices, to tracking payments and maintenance contracts. The system supports multi-role access (admin and super admin) and is designed to keep billing, reporting, and client communication all in one place.',
        features: [
            'Email notifications — sends maintenance reminder emails automatically',
            'Multi-role access — separate dashboards and permissions for admin and super admin',
            'Reports & exports — exportable reports for invoices, orders, customers, and maintenance to Excel',
            'Invoice management — support for installment payments (termin 1–4), PPN/PPH tax, and stream invoices as PDF',
            'Order & cart system — build orders by selecting services and packages, with a cart-style flow before finalizing',
            'Payment status tracking — automatically calculates remaining balance based on termin history, marks orders as LUNAS when fully paid',  
        ],
        tech: [
             { name: 'Laravel', badge: 'badge-red', icon: 'devicon-laravel-original' },
            { name: 'Bootstrap', badge: 'badge-green', icon: 'devicon-bootstrap-plain' },
            { name: 'MySQL', badge: 'badge-slate', icon: 'devicon-mysql-plain' },
            { name: 'Chart.js', badge: 'badge-yellow', icon: 'devicon-chartjs-plain' },
        ],
        github: '#',
        demo: '#'
    },
    'Masjid Baiturrahiim': {
        images: [
            './src/assets/img/projects/masjid1.png',
            './src/assets/img/projects/masjid2.png',
            './src/assets/img/projects/masjid3.png',
            './src/assets/img/projects/masjid4.png',
        ],
        description: 'The Masjid Baiturrahiim website is a landing page built for a mosque located in Perumahan Griya Candramas, Sidoarjo, Indonesia.',
        overview: 'The Masjid Baiturrahiim website is a landing page built for a mosque located in Perumahan Griya Candramas, Sidoarjo, Indonesia. It was designed to give the local community and visitors a clean, informative online presence — covering the mosque\'s history, activities, and location. The site has a warm, community-driven feel with content like congregational prayers, Quranic education, regular Islamic study sessions, and the annual Qurban event. There is even a blog section with articles on topics like Fiqih, Tauhid, Akhlak, and Islamic history.',
        features: [
            'SEO-ready with Open Graph and Twitter Card meta tags',
            'Auto-playing hero carousel showcasing mosque footage with caption text',
            'Responsive navigation with mobile menu toggle',
            'Embedded Google Maps for location and directions',
            'Swiper-powered image gallery of mosque activities',
            'Blog section with 6 articles covering various Islamic topics',
        ],
        tech: [
            { name: 'HTML5', badge: 'badge-red', icon: 'devicon-html5-plain' },
            { name: 'CSS', badge: 'badge-blue', icon: 'devicon-css3-plain' },
            { name: 'Bootstrap', badge: 'badge-blue', icon: 'devicon-bootstrap-plain' },
            { name: 'Swiper', badge: 'badge-indigo', icon: 'devicon-swiper-plain' },
        ],
        github: '#',
        demo: '#'
    },
    'Smart PJU (Device Monitoring System)': {
        images: [
            './src/assets/img/projects/smartpju3.png',
            './src/assets/img/projects/smartpju1.png',
            './src/assets/img/projects/smartpju2.png',
        ],
        description: 'Smart PJU is a device monitoring system project focused on providing real-time data and analytics for public lighting management.',
        overview: 'SmartPJU is a web-based smart public devices management system built to help operators monitor, manage, and track the health of many hardware devices across multiple regions in Indonesia. It bridges IoT hardware with a web dashboard — devices push real-time sensor readings through an API, and the system takes care of the rest: storing records, visualizing data on a map, and flagging devices that go silent.',
        features: [
            'Device registry with full metadata — brand, lamp type, wattage, input power, and equipment checklist',
            'Real-time electrical monitoring — tracks source/load voltage, current, and power for each device',
            'Interactive map view showing all georeferenced devices with operation time and remaining lifetime',
            'Automated status checker that marks devices as offline if no data is received for 30+ minutes',
            'REST API with Laravel Sanctum authentication for IoT devices to push sensor data',
            'Detailed monitoring page per device with QR code generation for quick field access',
        ],
        tech: [
             { name: 'Laravel', badge: 'badge-red', icon: 'devicon-laravel-original' },
            { name: 'Bootstrap', badge: 'badge-green', icon: 'devicon-bootstrap-plain' },
            { name: 'MySQL', badge: 'badge-slate', icon: 'devicon-mysql-plain' },
            { name: 'Chart.js', badge: 'badge-yellow', icon: 'devicon-chartjs-plain' },
        ],
        github: '#',
        demo: '#'
    },
    'QHSE': {
        images: [
            './src/assets/img/projects/qhse1.png',
            './src/assets/img/projects/qhse2.png',
            './src/assets/img/projects/qhse3.png',
        ],
        description: 'QHSE is a quality, health, safety, and environment management system project focused on providing real-time data and analytics for organizational compliance.',
        overview: 'Quality, Health, Safety, and Environment (QHSE) management platform built for construction or project-based companies. It centralizes everything from project tracking and daily work reports to equipment inspections and safety observations — all in one place with proper approval workflows, real-time dashboards, and role-based access so the right people see and do the right things.',
        features: [
            'Notification System — in-app notifications for inspections, reports, and surveys',
            'Role & Permission Management — granular access control via role-based permissions',
            'Daily Work Reports (Laporan Harian) — structured daily reports with multi-level approval chain (QHSE Officer → Project Manager → Holding)',
            'Survey Module — location/site surveys with a full status lifecycle (pending → assessed → VP approval → approved/rejected)',
            'K3 Safety Observation — log and monitor occupational health and safety field observations',
            'Dashboard with Charts — project status doughnut chart, QHSE activity bar chart, and latest data widgets',
        ],
        tech: [
             { name: 'Laravel', badge: 'badge-red', icon: 'devicon-laravel-original' },
            { name: 'Bootstrap', badge: 'badge-green', icon: 'devicon-bootstrap-plain' },
            { name: 'MySQL', badge: 'badge-slate', icon: 'devicon-mysql-plain' },
            { name: 'Chart.js', badge: 'badge-yellow', icon: 'devicon-chartjs-plain' },
        ],
        github: '#',
        demo: '#'
    },
    'UW Open (Tennis Match System)': {
        images: [
            './src/assets/img/projects/uwopen4.png',
            './src/assets/img/projects/uwopen1.png',
            './src/assets/img/projects/uwopen2.png',
            './src/assets/img/projects/uwopen3.png',
        ],
        description: 'UW Open is a real-time tennis match management system designed to streamline tournament organization and player management.',
        overview: 'An application designed to meet customer needs in providing a Real-Time integrated tennis match system application that is capable of handling the tennis tournaments includes matches, scoreboard, and standings held by Urban Wagyu in collaboration with Tennis Rek and BRImo as the main sponsors.',
        features: [
            'Scoreboard & Match Management — real-time match updates from referee devices, automatic score calculations, and dynamic standings based on match results with tie-breaking rules',
            'Standings — dynamic ranking of teams based on points and score differentials.',
            'MVP Selection — post-tournament MVP selection with criteria-based scoring and voting system',
            'Data Master Management — including Game Levels, Courts, Team, and Players.',
        ],
        tech: [
             { name: 'Laravel', badge: 'badge-red', icon: 'devicon-laravel-original' },
            { name: 'Bootstrap', badge: 'badge-green', icon: 'devicon-bootstrap-plain' },
            { name: 'MySQL', badge: 'badge-slate', icon: 'devicon-mysql-plain' },
            { name: 'Chart.js', badge: 'badge-yellow', icon: 'devicon-chartjs-plain' },
        ],
        github: '#',
        demo: '#'
    },
    'SR-Rental': {
        images: [
            './src/assets/img/projects/srrental1.png',
            './src/assets/img/projects/srrental2.png',
        ],
        description: 'SR-Rental is a real-time rental management system designed to streamline rental operations and customer management.',
        overview: 'An application designed to simplify customer needs in determining car rental options with various services such as various car types, affordable rental packages and ease in making car rental reservations in the Surabaya area.',
        features: [
            'Booking & Reservation System — real-time booking management with  automated email confirmations',
            'Reporting & Analytics — exportable reports for rentals, customers, and revenue to Excel',
            'Master Data Management — including Car Types, Rental Packages, and Customer Profiles',
        ],
        tech: [
             { name: 'Codeigniter', badge: 'badge-red', icon: 'devicon-codeigniter-plain' },
            { name: 'Bootstrap', badge: 'badge-green', icon: 'devicon-bootstrap-plain' },
            { name: 'MySQL', badge: 'badge-slate', icon: 'devicon-mysql-plain' },
            { name: 'Chart.js', badge: 'badge-yellow', icon: 'devicon-chartjs-plain' },
        ],
        github: '#',
        demo: '#'
    },
    'Library App': {
        images: [
            './src/assets/img/projects/libraryapp1.png',
            './src/assets/img/projects/libraryapp2.png',
        ],
        description: 'Library App is a personal project built to manage book collections, track borrowing and returns, and generate reports for a personal or small library collection.',
        overview: 'An application designed to simplify library operations by providing features such as book cataloging, member management, and real-time tracking of borrowed and returned books. This app bulit with Laravel and Filament Admin Panel to provide a user-friendly interface for managing library resources and activities.',
        features: [
            'REST API — Sanctum-authenticated endpoints for auth (login/register/logout), browsing books & categories, and creating loan requests',
            'Book Lending & Return Management — real-time tracking of borrowed and returned books',
            'Role-based access control — two roles (Super Admin and Member) with full policy enforcement across both the admin panel and API',
            'Overdue fine/fee tracking — a dedicated monetary table keeps tabs on late fees per loan, displayed in IDR currency',
            'Master Data Management — including Book Categories, Authors, and Member Profiles',
        ],
        tech: [
             { name: 'Laravel', badge: 'badge-red', icon: 'devicon-laravel-plain' },
            { name: 'Filament', badge: 'badge-green', icon: 'devicon-filamentphp-original' },
            { name: 'TailwindCSS', badge: 'badge-blue', icon: 'devicon-tailwindcss-plain' },
            { name: 'MySQL', badge: 'badge-slate', icon: 'devicon-mysql-plain' },
            { name: 'Chart.js', badge: 'badge-yellow', icon: 'devicon-chartjs-plain' },
        ],
        github: '#',
        demo: '#'
    },
    'Wyndham Room Service': {
        images: [
            './src/assets/img/design/wyndham_mockup1.png',
            './src/assets/img/design/wyndham_mockup2.png',
        ],
        description: 'Wyndham Room Service is a prototype application designed to streamline the room service experience for guests at Wyndham hotels.',
        overview: 'Wyndham Room Service is a prototype application designed to streamline the room service experience for guests at Wyndham hotels. The app allows guests to easily browse the menu, place orders, and track their delivery status in real time. It also provides a user-friendly interface for hotel staff to manage incoming orders, update order statuses, and ensure timely delivery to guest rooms.',
        features: [
            'Room Access - Lock and Unlock room doors directly from the app for seamless entry during room service deliveries',
            'Real-time Order Tracking - Guests can track the status of their room service orders in real time, from preparation to delivery',
            'Room Service - An interactive menu with detailed descriptions and images of each item to help guests make informed choices',
            'Cart & Checkout - A simple cart system that allows guests to review their order before checkout, with multiple payment options available',
        ],
        tech: [
             { name: 'Figma', badge: 'badge-red', icon: 'devicon-figma-plain' },
        ],
        github: '#',
        demo: '#'
    },
    'Mitra Tani 27': {
        images: [
            './src/assets/img/design/mitratani_mockup.png',
        ],
        description: 'Mitra Tani 27 is a partnership application system designed to connect farmers with suppliers and buyers.',
        overview: 'Partnership application system built in web and mobile versions for Mitra Tani 27 — a local agricultural cooperative that connects farmers with suppliers and buyers. The system includes a web-based admin panel for cooperative staff to manage farmer profiles, product listings, orders, and payments; and a mobile app for farmers to browse available products, place orders, and track deliveries.',
        features: [
            'Quality Control - Implement a quality control system to ensure that all products meet the cooperative\'s standards before being listed on the platform',
            'Planting Management - A feature that allows farmers to track their planting schedules, receive reminders for watering and fertilizing, and access best practices for crop care',
            'Approved Supplier List - A curated list of approved suppliers that farmers can choose from when placing orders, ensuring reliability and quality of products',
        ],
        tech: [
             { name: 'Figma', badge: 'badge-red', icon: 'devicon-figma-plain' },
        ],
        github: '#',
        demo: '#'
    },
    'Visitor Management System': {
        images: [
            './src/assets/img/design/visitor_mockup.png',
        ],
        description: 'Visitor Management System is a web and mobile application designed to streamline the check-in process for visitors at corporate offices.',
        overview: 'Visitor Management System is a web application designed to streamline the check-in process for visitors at on site project. The system includes a web-based admin panel for reception staff to manage visitor profiles, appointments, and access permissions, using RFID tags for quick check-ins.',
        features: [
            'RFID Check-in - Scan RFID tags for visitors to quickly check in upon arrival',
            'Real-time Updates - Provide real-time updates on appointment status to both visitors and reception staff',
            'Monitoring visitor traffic - Generate reports on visitor traffic patterns, peak hours, and frequent visitors to help optimize staffing and security measures',
        ],
        tech: [
             { name: 'Figma', badge: 'badge-red', icon: 'devicon-figma-plain' },
        ],
        github: '#',
        demo: '#'
    },
    'Basic Programming Course': {
        images: [
            './src/assets/img/teaching/teaching.mp4',
        ],
        description: 'Basic Programming Course is a web and mobile application designed to teach beginners the fundamentals of programming.',
        overview: 'Teaching basic programming concepts to beginners using python programming language for 10 meetings. Each meeting lasts for 2 hours. The course covers fundamental topics such as variables, data types, control structures, functions, and object-oriented programming, using a user-friendly interface and real-time code execution to enhance the learning experience.',
        features: [
            'Learning Modules - Structured modules covering fundamental programming concepts with interactive examples and exercises',
            'Final project to apply student knowledge by building a simple application or game using the concepts learned throughout the course',
        ],
        tech: [
             { name: 'Python', badge: 'badge-orange', icon: 'devicon-python-plain' },
             { name: 'Google Collab', badge: 'yellow', icon: 'devicon-google-plain' },
        ],
        github: '#',
        demo: '#'
    },
};

function showProjectDetail(title) {
    const data = projectsData[title];
    if (!data) return;

    // Track previous section
    const activeSection = document.querySelector('.content-section.active');
    if (activeSection && activeSection.id !== 'project-detail') {
        previousSection = activeSection.id;
    }

    // Update back button text
    const backText = document.getElementById('projectDetailBackText');
    if (backText) {
        backText.textContent = previousSection === 'home' ? 'Back to Home' : 'Back to Projects';
    }

    // Hero slider (supports images & videos)
    const sliderTrack = document.getElementById('sliderTrack');
    const sliderDotsEl = document.getElementById('sliderDots');
    sliderTrack.innerHTML = '';
    sliderDotsEl.innerHTML = '';
    sliderIndex = 0;

    // Normalize media: accept strings or { src, poster, type } objects
    const rawMedia = Array.isArray(data.images) ? data.images : [data.image || ''];
    sliderMedia = rawMedia.map(item => {
        if (typeof item === 'string') {
            return { src: item, type: VIDEO_EXTENSIONS.test(item) ? 'video' : 'image' };
        }
        return {
            src: item.src,
            poster: item.poster || '',
            type: item.type || (VIDEO_EXTENSIONS.test(item.src) ? 'video' : 'image')
        };
    });

    sliderMedia.forEach((media, i) => {
        const slide = document.createElement('div');
        slide.className = 'slider-slide';

        if (media.type === 'video') {
            const wrapper = document.createElement('div');
            wrapper.className = 'slider-video-wrapper';

            const video = document.createElement('video');
            video.className = 'slider-video';
            video.preload = 'metadata';
            video.playsInline = true;
            video.controls = true;
            video.muted = true;
            video.setAttribute('controlsList', 'nodownload');
            if (media.poster) video.poster = media.poster;

            const source = document.createElement('source');
            source.src = media.src;
            const ext = media.src.split('.').pop().toLowerCase();
            const mimeMap = { mp4: 'video/mp4', webm: 'video/webm', ogg: 'video/ogg', mov: 'video/mp4' };
            source.type = mimeMap[ext] || 'video/mp4';
            video.appendChild(source);

            // Play indicator overlay
            const overlay = document.createElement('div');
            overlay.className = 'slider-video-overlay';
            overlay.innerHTML = '<svg width="48" height="48" viewBox="0 0 24 24" fill="white" opacity="0.85"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
            overlay.addEventListener('click', () => {
                video.play();
                overlay.classList.add('hidden');
            });

            video.addEventListener('play', () => overlay.classList.add('hidden'));
            video.addEventListener('pause', () => { if (!video.ended) overlay.classList.remove('hidden'); });
            video.addEventListener('ended', () => overlay.classList.remove('hidden'));

            wrapper.appendChild(video);
            wrapper.appendChild(overlay);
            slide.appendChild(wrapper);
        } else {
            const img = document.createElement('img');
            img.src = media.src;
            img.alt = `${title} — screenshot ${i + 1}`;
            img.loading = 'lazy';
            slide.appendChild(img);
        }

        sliderTrack.appendChild(slide);

        const dot = document.createElement('button');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        sliderDotsEl.appendChild(dot);
    });
    sliderTrack.style.transform = 'translateX(0)';
    const showNav = sliderMedia.length > 1;
    document.getElementById('sliderPrev').style.display = showNav ? '' : 'none';
    document.getElementById('sliderNext').style.display = showNav ? '' : 'none';
    sliderDotsEl.style.display = showNav ? '' : 'none';

    // Title & description
    document.getElementById('projectDetailTitle').textContent = title;
    // document.getElementById('projectDetailDesc').textContent = data.description;

    // Overview
    document.getElementById('projectDetailOverview').textContent = data.overview;

    // Features
    const featuresList = document.getElementById('projectDetailFeatures');
    featuresList.innerHTML = '';
    data.features.forEach(feature => {
        const li = document.createElement('li');
        li.className = 'flex items-start gap-3.5 text-[1.05rem] text-gray-400';
        const dot = document.createElement('span');
        dot.className = 'shrink-0 w-1.5 h-1.5 rounded-full bg-accent mt-[10px]';
        li.appendChild(dot);
        li.appendChild(document.createTextNode(' ' + feature));
        featuresList.appendChild(li);
    });

    // Tech stack
    const techDiv = document.getElementById('projectDetailTech');
    techDiv.innerHTML = '';
    data.tech.forEach(t => {
        const span = document.createElement('span');
        span.className = 'badge ' + t.badge;
        if (t.icon) {
            const icon = document.createElement('i');
            icon.className = t.icon;
            span.appendChild(icon);
        }
        span.appendChild(document.createTextNode(t.name));
        techDiv.appendChild(span);
    });

    // Links
    // const linksDiv = document.getElementById('projectDetailLinks');
    // linksDiv.innerHTML = '';
    // if (data.github) {
    //     const a = document.createElement('a');
    //     a.href = data.github;
    //     a.target = '_blank';
    //     a.rel = 'noopener noreferrer';
    //     a.className = 'inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-dark-card border border-border text-gray-300 hover:border-accent hover:text-accent transition-all duration-300';
    //     a.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> Source Code';
    //     linksDiv.appendChild(a);
    // }
    // if (data.demo) {
    //     const a = document.createElement('a');
    //     a.href = data.demo;
    //     a.target = '_blank';
    //     a.rel = 'noopener noreferrer';
    //     a.className = 'inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-accent text-white hover:bg-accent-hover transition-all duration-300';
    //     a.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg> Live Demo';
    //     linksDiv.appendChild(a);
    // }

    // Navigate to detail section
    navigateTo('project-detail');
}

function goToSlide(index) {
    const track = document.getElementById('sliderTrack');
    if (!track) return;
    const count = sliderMedia.length;
    sliderIndex = (index + count) % count;
    track.style.transform = `translateX(-${sliderIndex * 100}%)`;
    document.querySelectorAll('.slider-dot').forEach((d, i) => d.classList.toggle('active', i === sliderIndex));

    // Pause all videos except the current slide
    track.querySelectorAll('video').forEach(v => {
        v.pause();
    });
}

function initProjectDetail() {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('a')) return;
            const titleEl = card.querySelector('h3');
            if (!titleEl) return;
            showProjectDetail(titleEl.textContent.trim());
        });
    });

    const backBtn = document.getElementById('projectDetailBack');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            navigateTo(previousSection);
        });
    }

    document.getElementById('sliderPrev')?.addEventListener('click', () => goToSlide(sliderIndex - 1));
    document.getElementById('sliderNext')?.addEventListener('click', () => goToSlide(sliderIndex + 1));
}

// =============================================
// MixItUp Project Filter
// =============================================
function initMixItUp() {
    const container = document.getElementById('mixContainer');
    if (!container || typeof mixitup === 'undefined') return;

    const mixer = mixitup(container, {
        selectors: {
            target: '.mix'
        },
        animation: {
            duration: 300,
            easing: 'ease-out',
            effects: 'fade',
            nudge: false
        }
    });

    const filterBtns = document.querySelectorAll('#projectFilters .filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');
            mixer.filter(filterValue === 'all' ? 'all' : filterValue);
        });
    });
}
