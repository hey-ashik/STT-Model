<?php
// index.php
// MythBrain Main Portal - SPA Container and Shell
session_start();

$baseDir = dirname($_SERVER['SCRIPT_NAME']);
if (substr($baseDir, -1) !== '/') {
    $baseDir .= '/';
}

require_once __DIR__ . '/db.php';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>MythBrain | AI-Powered Meeting Recorder</title>
    <meta name="description"
        content="MythBrain combines hardware and software to record, transcribe, and summarize meetings in real-time, backed by premium AI.">

    <!-- Google Fonts: Cormorant Garamond & Instrument Sans -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&display=swap"
        rel="stylesheet">

    <!-- FontAwesome for premium icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Custom Style Sheet -->
    <link rel="stylesheet" href="<?php echo htmlspecialchars($baseDir); ?>assets/css/style.css?v=7.9.3">
</head>

<body>

    <!-- Mobile Slide-over Drawer Menu -->
    <nav class="nav-menu" id="nav-menu" onclick="toggleMobileMenu(event)">
        <div class="nav-menu-content" onclick="event.stopPropagation()">
            <div class="mobile-menu-header">
                <div class="logo" onclick="navigateTo('home')">
                    <span style="color: var(--text-primary) !important;">Myth<span
                            style="color: var(--color-charcoal-3) !important;">Brain</span></span>
                </div>
                <button class="mobile-menu-close" onclick="toggleMobileMenu()">&times;</button>
            </div>
            <div class="mobile-menu-links">
                <a href="<?php echo htmlspecialchars($baseDir); ?>home" class="nav-link active"
                    onclick="navigateTo('home'); return false;">Home</a>
                <span id="mobile-auth-links-mount">
                    <!-- Dynamic authenticated/guest links for mobile will be injected here -->
                </span>
            </div>
        </div>
    </nav>

    <!-- Capsule Floating Header -->
    <div class="header-wrapper">
        <header class="main-header">
            <div class="logo" onclick="navigateTo('home')">
                <span style="color: var(--text-primary) !important;">Myth<span
                        style="color: var(--color-charcoal-3) !important;">Brain</span></span>
            </div>

            <!-- Hamburger Button for Mobile -->
            <button class="hamburger" id="hamburger-btn" onclick="toggleMobileMenu()">
                <span></span>
                <span></span>
                <span></span>
            </button>

            <!-- Desktop Links -->
            <nav class="desktop-nav-menu">
                <a href="<?php echo htmlspecialchars($baseDir); ?>home" class="nav-link active"
                    onclick="navigateTo('home'); return false;">Home</a>
                <span id="auth-nav-links">
                    <!-- Dynamic navigation buttons injected here -->
                </span>
            </nav>
        </header>
    </div>

    <!-- Main Container -->
    <main id="app">
        <div id="app-content">
            <!-- Skeleton Loader / Initial State -->
            <div class="page-section skeleton-section" style="pointer-events: none; padding-top: 40px;">
                <div class="hero-section" style="margin-bottom: 60px;">
                    <div class="hero-content" style="max-width: 720px;">
                        <div class="skeleton-shimmer"
                            style="width: 85%; height: 42px; border-radius: 6px; margin-bottom: 12px; margin-left: auto; margin-right: auto;">
                        </div>
                        <div class="skeleton-shimmer"
                            style="width: 60%; height: 42px; border-radius: 6px; margin-bottom: 24px; margin-left: auto; margin-right: auto;">
                        </div>
                        <div class="skeleton-shimmer"
                            style="width: 100%; height: 16px; border-radius: 4px; margin-bottom: 8px;"></div>
                        <div class="skeleton-shimmer"
                            style="width: 70%; height: 16px; border-radius: 4px; margin-bottom: 30px; margin-left: auto; margin-right: auto;">
                        </div>
                        <div class="skeleton-shimmer"
                            style="width: 100%; max-width: 480px; height: 50px; border-radius: var(--radius-full); margin-bottom: 40px; margin-left: auto; margin-right: auto;">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="site-footer" id="site-footer" style="display:none;">
        <div class="footer-inner">
            <div class="footer-grid">
                <div class="footer-col footer-brand">
                    <div class="footer-logo">
                        <span>MythBrain</span>
                    </div>
                    <p class="footer-desc">AI-powered meeting recorder combining hardware & software. Record audio
                        chunks locally, sync in real-time, and get summaries instantly.</p>
                    <div class="footer-social">
                        <a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
                        <a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                        <a href="#" aria-label="Twitter"><i class="fa-brands fa-twitter"></i></a>
                        <a href="#" aria-label="Github"><i class="fa-brands fa-github"></i></a>
                    </div>
                </div>
                <div class="footer-col">
                    <h4>Quick Links</h4>
                    <ul class="footer-links">
                        <li><a href="<?php echo htmlspecialchars($baseDir); ?>home"
                                onclick="navigateTo('home');return false;">Home</a></li>
                        <li><a href="<?php echo htmlspecialchars($baseDir); ?>dashboard"
                                onclick="navigateTo('dashboard');return false;">Dashboard</a></li>
                        <li><a href="<?php echo htmlspecialchars($baseDir); ?>memory"
                                onclick="navigateTo('memory');return false;">Memory</a></li>
                        <li><a href="<?php echo htmlspecialchars($baseDir); ?>space"
                                onclick="navigateTo('space');return false;">Space</a></li>
                        <li><a href="<?php echo htmlspecialchars($baseDir); ?>assistant"
                                onclick="navigateTo('assistant');return false;">Assistant</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Technology</h4>
                    <ul class="footer-links">
                        <li><a href="#">ESP32 Development</a></li>
                        <li><a href="#">Redis Caching</a></li>
                        <li><a href="#">STT MOdel</a></li>
                        <li><a href="#">LLM Model</a></li>

                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Contact Support</h4>
                    <ul class="footer-links footer-contact">
                        <li><i class="fa-solid fa-envelope"></i> ashikulislam2070@gmail.com</li>
                        <li><i class="fa-solid fa-phone"></i> +880 1792250709</li>
                        <li><i class="fa-solid fa-location-dot"></i> Dhaka, Bangladesh</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; <?php echo date('Y'); ?> MythBrain. All rights reserved.</p>
            <p style="margin-top: 6px; font-size: 0.85rem; color: var(--text-secondary);">Developed By <a
                    href="https://wa.me/8801792250709" target="_blank" rel="noopener"
                    style="color: var(--color-charcoal-3); text-decoration: none; font-weight: 600;">Ashikul Islam</a>
            </p>
        </div>
    </footer>

    <!-- Global Modal Overlay (Regular Center Modal) -->
    <div class="modal-overlay" id="global-modal" onclick="closeModal(event)">
        <div class="modal-content" onclick="event.stopPropagation()">
            <button class="modal-close" onclick="closeModal(null)">&times;</button>
            <div id="modal-body-content">
                <!-- Dynamically populated settings, calendar and chat inputs -->
            </div>
        </div>
    </div>

    <!-- Auth Bottom Drawer Modal (Facebook-style Slide Up for Small Screen, normal box for Big Screen) -->
    <div class="modal-overlay" id="auth-modal" onclick="toggleAuthModal(event)">
        <div class="modal-content auth-drawer-content" onclick="event.stopPropagation()">
            <!-- Mobile pull-down indicator pill -->
            <div class="mobile-drawer-handle"></div>
            <button class="modal-close" onclick="toggleAuthModal(null)">&times;</button>
            <div id="auth-modal-body">
                <!-- Dynamically injected login, registration, and forget forms -->
            </div>
        </div>
    </div>

    <!-- Edit Title Modal (Slide Up for Small Screen, normal box for Big Screen) -->
    <div class="modal-overlay" id="edit-title-modal" onclick="toggleEditTitleModal(event)">
        <div class="modal-content auth-drawer-content" onclick="event.stopPropagation()">
            <!-- Mobile pull-down indicator pill -->
            <div class="mobile-drawer-handle"></div>
            <button class="modal-close" onclick="toggleEditTitleModal(null)">&times;</button>
            <div id="edit-title-modal-body">
                <!-- Dynamically injected edit title form -->
            </div>
        </div>
    </div>

    <!-- Space Action Modal (Slide Up for Small Screen, normal box for Big Screen) -->
    <div class="modal-overlay" id="space-action-modal" onclick="toggleSpaceActionModal(event)">
        <div class="modal-content auth-drawer-content" onclick="event.stopPropagation()">
            <!-- Mobile pull-down indicator pill -->
            <div class="mobile-drawer-handle"></div>
            <button class="modal-close" onclick="toggleSpaceActionModal(null)">&times;</button>
            <div id="space-action-modal-body">
                <!-- Dynamically injected space forms -->
            </div>
        </div>
    </div>

    <!-- SPA Application Engine Scripts -->
    <script>
        window.basePath = '<?php echo htmlspecialchars($baseDir); ?>';
    </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="<?php echo htmlspecialchars($baseDir); ?>assets/js/app.js?v=7.9.3"></script>
</body>

</html>