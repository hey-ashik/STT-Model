// assets/js/app.js
// MythBrain SPA Frontend Engine

// Global helper for temperature UI updates
window.updateTemperatureLabel = function(val) {
    const numericVal = parseFloat(val);
    const label = document.getElementById('temperature-val');
    if (label) {
        label.innerText = numericVal.toFixed(1);
    }
    const descEl = document.getElementById('temperature-desc');
    if (descEl) {
        let desc = "";
        if (numericVal === 0) {
            desc = "<strong>Temperature = 0 (Very focused, predictable, consistent)</strong><br>Best for facts, coding, math. Same question often gives similar answers.";
        } else if (numericVal > 0 && numericVal < 0.3) {
            desc = "<strong>Temperature = " + numericVal.toFixed(1) + " (Mostly focused)</strong><br>Reduced creativity, higher consistency.";
        } else if (numericVal >= 0.3 && numericVal <= 0.7) {
            desc = "<strong>Temperature = " + numericVal.toFixed(1) + " (Balanced)</strong><br>Good mix of accuracy + natural variation. Common for assistants.";
        } else if (numericVal > 0.7 && numericVal < 1.0) {
            desc = "<strong>Temperature = " + numericVal.toFixed(1) + " (Balanced / Creative)</strong><br>Enhanced vocabulary variation with decent accuracy.";
        } else if (numericVal === 1.0) {
            desc = "<strong>Temperature = 1.0 (More creative and diverse)</strong><br>More varied wording and ideas. Can be less predictable.";
        } else { // > 1.0
            desc = "<strong>Temperature = " + numericVal.toFixed(1) + " (Very experimental)</strong><br>More imaginative, but higher chance of mistakes or weird outputs.";
        }
        descEl.innerHTML = desc;
    }
};

window.updateMaxTokensLabel = function(val) {
    const values = [128, 512, 1024, 2048];
    const numericVal = values[parseInt(val)] || 1024;
    const label = document.getElementById('max-tokens-val');
    if (label) {
        label.innerText = numericVal;
    }
    const descEl = document.getElementById('max-tokens-desc');
    if (descEl) {
        let desc = "";
        if (numericVal === 128) {
            desc = "<strong>Max Response Size = 128 Tokens (Approx. 96 words)</strong><br>Optimized for brief replies, short chats, and conserving API tokens.";
        } else if (numericVal === 512) {
            desc = "<strong>Max Response Size = 512 Tokens (Approx. 384 words)</strong><br>Moderate length replies. Suitable for most regular conversational interactions.";
        } else if (numericVal === 1024) {
            desc = "<strong>Max Response Size = 1024 Tokens (Approx. 768 words)</strong><br>Detailed responses, good for longer explanations.";
        } else if (numericVal === 2048) {
            desc = "<strong>Max Response Size = 2048 Tokens (Approx. 1536 words)</strong><br>Maximum output token length. Ideal for deep analysis, essays, and maximum text generation.";
        }
        descEl.innerHTML = desc;
    }
};

window.updateSummaryTokensLabel = function(val) {
    const values = [64, 128, 512];
    const numericVal = values[parseInt(val)] || 128;
    const label = document.getElementById('summary-tokens-val');
    if (label) {
        label.innerText = numericVal;
    }
    const descEl = document.getElementById('summary-tokens-desc');
    if (descEl) {
        let desc = "";
        if (numericVal === 64) {
            desc = "<strong>AI Summary = 64 Tokens (Approx. 48 words)</strong><br>Concise and brief summary highlighting the key points.";
        } else if (numericVal === 128) {
            desc = "<strong>AI Summary = 128 Tokens (Approx. 96 words)</strong><br>Balanced summary layout. Suitable for quick meetings.";
        } else if (numericVal === 512) {
            desc = "<strong>AI Summary = 512 Tokens (Approx. 384 words)</strong><br>Detailed summary including comprehensive action points.";
        }
        descEl.innerHTML = desc;
    }
};

window.updateMeetingChatTokensLabel = function(val) {
    const values = [128, 512, 1024, 2048];
    const numericVal = values[parseInt(val)] || 128;
    const label = document.getElementById('meeting-chat-tokens-val');
    if (label) {
        label.innerText = numericVal;
    }
    const descEl = document.getElementById('meeting-chat-tokens-desc');
    if (descEl) {
        let desc = "";
        if (numericVal === 128) {
            desc = "<strong>Meeting Chat = 128 Tokens (Approx. 96 words)</strong><br>Short responses when querying single meeting details.";
        } else if (numericVal === 512) {
            desc = "<strong>Meeting Chat = 512 Tokens (Approx. 384 words)</strong><br>Standard chat length. Good for most questions about meetings.";
        } else if (numericVal === 1024) {
            desc = "<strong>Meeting Chat = 1024 Tokens (Approx. 768 words)</strong><br>Detailed answers with rich explanations from the transcript.";
        } else if (numericVal === 2048) {
            desc = "<strong>Meeting Chat = 2048 Tokens (Approx. 1536 words)</strong><br>Long detailed responses, ideal for extensive questions.";
        }
        descEl.innerHTML = desc;
    }
};

window.updateAssistantChatTokensLabel = function(val) {
    const values = [128, 512, 1024, 2048];
    const numericVal = values[parseInt(val)] || 512;
    const label = document.getElementById('assistant-chat-tokens-val');
    if (label) {
        label.innerText = numericVal;
    }
    const descEl = document.getElementById('assistant-chat-tokens-desc');
    if (descEl) {
        let desc = "";
        if (numericVal === 128) {
            desc = "<strong>Assistant Chat = 128 Tokens (Approx. 96 words)</strong><br>Short universal responses to save context window tokens.";
        } else if (numericVal === 512) {
            desc = "<strong>Assistant Chat = 512 Tokens (Approx. 384 words)</strong><br>Standard ChatGPT style replies, balanced length and detail.";
        } else if (numericVal === 1024) {
            desc = "<strong>Assistant Chat = 1024 Tokens (Approx. 768 words)</strong><br>Long detailed analytical reasoning across multiple meetings.";
        } else if (numericVal === 2048) {
            desc = "<strong>Assistant Chat = 2048 Tokens (Approx. 1536 words)</strong><br>Maximum depth answers, perfect for comprehensive synthesis.";
        }
        descEl.innerHTML = desc;
    }
};

// Global State
const state = {
    authenticated: false,
    user: null,
    activeRoute: 'home',
    devices: [],
    recordings: [],
    activeRecording: null,
    pollingInterval: null,
    elapsedInterval: null,
    calendarDate: new Date(),
    selectedDate: null,
    redisActive: false,
    cacheStatus: ''
};

// ==========================================
// SPA ROUTER
// ==========================================
const routes = {
    'home': { title: 'Home', render: renderHome, auth: false },
    'dashboard': { title: 'Dashboard Workspace', render: renderDashboard, auth: true },
    'memory': { title: 'Memory', render: renderBrain, auth: true },
    'space': { title: 'Spaces', render: renderSpace, auth: true },
    'assistant': { title: 'Assistant', render: renderMyth, auth: true },
    'settings': { title: 'Settings & API Keys', render: renderSettings, auth: true }
};

// App Initialization
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initial Authentication Check
    await checkAuthState();

    // 2. Setup Router Interceptor
    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.getAttribute('href') && !link.getAttribute('target') && !link.href.includes('mailto:') && !link.href.includes('tel:')) {
            const url = new URL(link.href);
            if (url.origin === window.location.origin) {
                e.preventDefault();
                // Extract path relative to base path
                let path = url.pathname.replace(window.basePath, '');
                path = path.replace(/^\/|\/$/g, ''); // Trim slashes
                if (path === '') path = 'home';
                navigateTo(path);
            }
        }
    });

    // 3. Monitor browser Back/Forward navigation
    window.addEventListener('popstate', () => {
        let path = window.location.pathname.replace(window.basePath, '');
        path = path.replace(/^\/|\/$/g, '');
        if (path === '') path = 'home';
        loadRoute(path, false);
    });

    // 4. Initial Route Load
    let initialPath = window.location.pathname.replace(window.basePath, '');
    initialPath = initialPath.replace(/^\/|\/$/g, '');
    if (initialPath === '' || !routes[initialPath]) initialPath = 'home';
    loadRoute(initialPath, true);

    // Ensure footer is visible only on home page
    const footer = document.getElementById('site-footer');
    if (footer) {
        footer.style.display = (initialPath === 'home') ? 'block' : 'none';
    }
});

async function checkAuthState() {
    try {
        const res = await fetch(`${window.basePath}api.php?action=check_auth`);
        const data = await res.json();
        if (data.status === 'success' && data.authenticated) {
            state.authenticated = true;
            state.user = data.user;
        } else {
            state.authenticated = false;
            state.user = null;
        }
        state.redisActive = data.redis_active || false;
        state.cacheStatus = data.cache_status || '';
        updateHeaderLinks();
    } catch (e) {
        console.error("Auth state fetch failed", e);
    }
}

function navigateTo(route) {
    if (!routes[route]) route = 'home';

    // Auth Protection
    if (routes[route].auth && !state.authenticated) {
        loadRoute('home', true);
        toggleAuthModal(null, 'login');
        return;
    }

    loadRoute(route, true);
}

function loadRoute(route, pushState = true) {
    // Stop any active polling from prior views
    stopActivePolling();

    // Check Auth restrictions
    if (routes[route].auth && !state.authenticated) {
        route = 'home';
    }

    state.activeRoute = route;

    if (pushState) {
        const path = route === 'home' ? '' : route;
        window.history.pushState(null, '', window.basePath + path);
    }

    // Set active link style in header
    document.querySelectorAll('.nav-link').forEach(link => {
        const hrefAttr = link.getAttribute('href');
        if (hrefAttr && (hrefAttr.endsWith(route) || (route === 'home' && hrefAttr.endsWith('home')))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Close Mobile Drawer menu if open
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger-btn');
    if (navMenu) navMenu.classList.remove('open');
    if (hamburger) hamburger.classList.remove('open');

    // Show/hide footer depending on the route (Home page only)
    const footer = document.getElementById('site-footer');
    if (footer) {
        footer.style.display = (route === 'home') ? 'block' : 'none';
    }

    // Render Content
    const title = routes[route].title;
    document.title = `MythBrain | ${title}`;

    const container = document.getElementById('app-content');
    container.innerHTML = getSkeletonHtml(route); // Skeleton Loading State

    setTimeout(() => {
        routes[route].render(container);
    }, 500); // Premium Transition Delay
}

function getSkeletonHtml(route) {
    if (route === 'home') {
        return `
            <div class="page-section skeleton-section">
                <div style="max-width: 800px; margin: 0 auto; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 15px; margin-bottom: 40px;">
                    <div class="skeleton-shimmer" style="width: 80%; height: 50px; border-radius: 8px;"></div>
                    <div class="skeleton-shimmer" style="width: 60%; height: 20px; border-radius: 6px;"></div>
                    <div class="skeleton-shimmer" style="width: 140px; height: 45px; border-radius: 30px; margin-top: 10px;"></div>
                </div>
                <div class="hero-stats" style="margin-bottom: 40px;">
                    <div class="stat-item">
                        <div class="skeleton-shimmer" style="width: 80px; height: 35px; border-radius: 6px; margin: 0 auto 8px;"></div>
                        <div class="skeleton-shimmer" style="width: 120px; height: 14px; border-radius: 4px; margin: 0 auto;"></div>
                    </div>
                    <div class="stat-item border-left-desktop">
                        <div class="skeleton-shimmer" style="width: 80px; height: 35px; border-radius: 6px; margin: 0 auto 8px;"></div>
                        <div class="skeleton-shimmer" style="width: 120px; height: 14px; border-radius: 4px; margin: 0 auto;"></div>
                    </div>
                    <div class="stat-item border-left-desktop">
                        <div class="skeleton-shimmer" style="width: 80px; height: 35px; border-radius: 6px; margin: 0 auto 8px;"></div>
                        <div class="skeleton-shimmer" style="width: 120px; height: 14px; border-radius: 4px; margin: 0 auto;"></div>
                    </div>
                </div>
                <div class="skeleton-shimmer" style="width: 100%; max-width: 1000px; height: 400px; border-radius: 14px; margin: 0 auto;"></div>
            </div>
        `;
    }

    if (route === 'space') {
        return `
            <div class="page-section skeleton-section">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; flex-wrap: wrap; gap: 20px;">
                    <div>
                        <div class="skeleton-shimmer" style="width: 150px; height: 35px; border-radius: 8px; margin-bottom: 10px;"></div>
                        <div class="skeleton-shimmer" style="width: 250px; height: 16px; border-radius: 6px;"></div>
                    </div>
                    <div class="skeleton-shimmer" style="width: 140px; height: 40px; border-radius: var(--radius-full);"></div>
                </div>
                <div class="skeleton-shimmer" style="width: 100%; max-width: 400px; height: 45px; border-radius: var(--radius-full); margin-bottom: 30px;"></div>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;">
                    <div class="skeleton-shimmer" style="height: 120px; border-radius: 14px;"></div>
                    <div class="skeleton-shimmer" style="height: 120px; border-radius: 14px;"></div>
                    <div class="skeleton-shimmer" style="height: 120px; border-radius: 14px;"></div>
                </div>
            </div>
        `;
    }

    if (route === 'memory') {
        return `
            <div class="page-section skeleton-section">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; flex-wrap: wrap; gap: 20px;">
                    <div>
                        <div class="skeleton-shimmer" style="width: 180px; height: 35px; border-radius: 8px; margin-bottom: 10px;"></div>
                        <div class="skeleton-shimmer" style="width: 350px; height: 16px; border-radius: 6px;"></div>
                    </div>
                    <div class="skeleton-shimmer" style="width: 300px; height: 45px; border-radius: 30px;"></div>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;">
                    <div class="skeleton-shimmer" style="height: 220px; border-radius: 14px;"></div>
                    <div class="skeleton-shimmer" style="height: 220px; border-radius: 14px;"></div>
                    <div class="skeleton-shimmer" style="height: 220px; border-radius: 14px;"></div>
                </div>
            </div>
        `;
    }

    if (route === 'assistant') {
        return `
            <div class="page-section assistant-page-section skeleton-section">
                <div style="margin-bottom: 25px;" class="assistant-page-header">
                    <div class="skeleton-shimmer" style="width: 220px; height: 35px; border-radius: 8px; margin-bottom: 10px;"></div>
                    <div class="skeleton-shimmer" style="width: 400px; height: 16px; border-radius: 6px;"></div>
                </div>
                <div style="border: 1px solid var(--border-color); border-radius: 14px; padding: 20px; display: flex; flex-direction: column; gap: 20px; height: 500px; background: var(--bg-surface-solid); max-width: 1200px; margin: 0 auto;" class="myth-chat-container">
                    <div style="display: flex; gap: 12px; align-items: flex-start; border-bottom: 1px solid var(--border-color); padding-bottom: 15px;">
                        <div class="skeleton-shimmer" style="width: 150px; height: 25px; border-radius: 6px;"></div>
                    </div>
                    <div style="flex: 1; display: flex; flex-direction: column; gap: 15px; justify-content: flex-end;">
                        <div class="skeleton-shimmer" style="width: 60%; height: 50px; border-radius: 12px;"></div>
                        <div class="skeleton-shimmer" style="width: 45%; height: 40px; border-radius: 12px; align-self: flex-end;"></div>
                        <div class="skeleton-shimmer" style="width: 70%; height: 60px; border-radius: 12px;"></div>
                    </div>
                    <div class="skeleton-shimmer" style="width: 100%; height: 50px; border-radius: 30px;"></div>
                </div>
            </div>
        `;
    }

    if (route === 'dashboard') {
        return `
            <div class="page-section skeleton-section">
                <div style="margin-bottom: 30px;">
                    <div class="skeleton-shimmer" style="width: 240px; height: 35px; border-radius: 8px; margin-bottom: 10px;"></div>
                    <div class="skeleton-shimmer" style="width: 320px; height: 16px; border-radius: 6px;"></div>
                </div>
                <div class="dashboard-grid">
                    <div style="display: flex; flex-direction: column; gap: 24px;">
                        <div class="skeleton-shimmer" style="height: 180px; border-radius: 14px;"></div>
                        <div class="skeleton-shimmer" style="height: 240px; border-radius: 14px;"></div>
                    </div>
                    <div class="skeleton-shimmer" style="height: 440px; border-radius: 14px;"></div>
                </div>
            </div>
        `;
    }

    if (route === 'settings') {
        return `
            <div class="page-section skeleton-section">
                <div style="margin-bottom: 30px;">
                    <div class="skeleton-shimmer" style="width: 180px; height: 35px; border-radius: 8px; margin-bottom: 10px;"></div>
                    <div class="skeleton-shimmer" style="width: 280px; height: 16px; border-radius: 6px;"></div>
                </div>
                <div style="display: flex; gap: 15px; margin-bottom: 25px; flex-wrap: wrap;">
                    <div class="skeleton-shimmer" style="width: 120px; height: 40px; border-radius: 8px;"></div>
                    <div class="skeleton-shimmer" style="width: 120px; height: 40px; border-radius: 8px;"></div>
                    <div class="skeleton-shimmer" style="width: 120px; height: 40px; border-radius: 8px;"></div>
                </div>
                <div class="skeleton-shimmer" style="width: 100%; height: 350px; border-radius: 14px;"></div>
            </div>
        `;
    }

    // Default fallback skeleton
    return `
        <div class="page-section skeleton-section">
            <div style="margin-bottom: 24px;">
                <div class="skeleton-shimmer" style="width: 250px; height: 35px; border-radius: 6px; margin-bottom: 12px;"></div>
                <div class="skeleton-shimmer" style="width: 450px; height: 16px; border-radius: 4px;"></div>
            </div>
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 30px; margin-top: 20px;">
                <div class="skeleton-shimmer" style="height: 300px; border-radius: 14px;"></div>
                <div class="skeleton-shimmer" style="height: 300px; border-radius: 14px;"></div>
            </div>
        </div>
    `;
}

function showInternetIssueBanner(container, retryCallback) {
    if (document.getElementById('internet-issue-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'internet-issue-banner';
    banner.style.cssText = `
        background: rgba(220, 38, 38, 0.95);
        color: #fff;
        padding: 12px 24px;
        text-align: center;
        position: fixed;
        top: 90px;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 30px;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.2);
        font-family: var(--font-instrument-sans);
        font-size: 0.9rem;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
        animation: slideDownBanner 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    `;
    banner.innerHTML = `
        <i class="fa-solid fa-circle-exclamation"></i>
        <span>No internet connection. Please check your network.</span>
        <button id="internet-issue-retry-btn" style="background: #fff; color: #dc2626; border: none; padding: 6px 14px; border-radius: 20px; font-weight: 600; cursor: pointer; font-size: 0.8rem; transition: all 0.2s; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">Retry</button>
    `;
    document.body.appendChild(banner);

    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
        @keyframes slideDownBanner {
            from { transform: translate(-50%, -20px); opacity: 0; }
            to { transform: translate(-50%, 0); opacity: 1; }
        }
    `;
    document.head.appendChild(styleTag);

    const retryBtn = banner.querySelector('#internet-issue-retry-btn');
    retryBtn.addEventListener('click', () => {
        banner.remove();
        retryCallback();
    });
}

// Header Actions
function updateHeaderLinks() {
    const desktopMount = document.getElementById('auth-nav-links');
    const mobileMount = document.getElementById('mobile-auth-links-mount');

    if (state.authenticated) {
        const desktopHtml = `
            <a href="${window.basePath}dashboard" class="nav-link" onclick="navigateTo('dashboard'); return false;">Dashboard</a>
            <a href="${window.basePath}memory" class="nav-link" onclick="navigateTo('memory'); return false;">Memory</a>
            <a href="${window.basePath}space" class="nav-link" onclick="navigateTo('space'); return false;">Space</a>
            <a href="${window.basePath}assistant" class="nav-link" onclick="navigateTo('assistant'); return false;">Assistant</a>
            <a href="${window.basePath}settings" class="nav-link" onclick="navigateTo('settings'); return false;"><i class="fa-solid fa-gear"></i> Settings</a>
            <button class="nav-btn-secondary" onclick="handleLogout()" style="margin-left: 8px;">Logout</button>
        `;
        const mobileHtml = `
            <a href="${window.basePath}dashboard" class="nav-link" onclick="navigateTo('dashboard'); return false;">Dashboard</a>
            <a href="${window.basePath}memory" class="nav-link" onclick="navigateTo('memory'); return false;">Memory</a>
            <a href="${window.basePath}space" class="nav-link" onclick="navigateTo('space'); return false;">Space</a>
            <a href="${window.basePath}assistant" class="nav-link" onclick="navigateTo('assistant'); return false;">Assistant</a>
            <a href="${window.basePath}settings" class="nav-link" onclick="navigateTo('settings'); return false;">Settings</a>
            <button class="nav-btn" onclick="handleLogout()" style="width: 100%; margin-top: 15px;"><i class="fa-solid fa-right-from-bracket"></i> Logout</button>
        `;
        if (desktopMount) desktopMount.innerHTML = desktopHtml;
        if (mobileMount) mobileMount.innerHTML = mobileHtml;
    } else {
        const desktopHtml = `
            <button class="nav-btn-secondary" onclick="toggleAuthModal(null, 'login')">Login</button>
            <button class="nav-btn" onclick="toggleAuthModal(null, 'register')" style="margin-left: 8px;">Sign Up</button>
        `;
        const mobileHtml = `
            <button class="nav-btn-secondary" onclick="toggleAuthModal(null, 'login')" style="width: 100%; margin-bottom: 10px;"><i class="fa-solid fa-user"></i> Login</button>
            <button class="nav-btn" onclick="toggleAuthModal(null, 'register')" style="width: 100%;"><i class="fa-solid fa-user-plus"></i> Register</button>
        `;
        if (desktopMount) desktopMount.innerHTML = desktopHtml;
        if (mobileMount) mobileMount.innerHTML = mobileHtml;
    }
}

async function handleLogout() {
    const res = await fetch(`${window.basePath}api.php?action=logout`);
    const data = await res.json();
    if (data.status === 'success') {
        state.authenticated = false;
        state.user = null;
        updateHeaderLinks();
        navigateTo('home');
    }
}

// Mobile Menu toggles
function toggleMobileMenu(e) {
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger-btn');
    if (navMenu && hamburger) {
        navMenu.classList.toggle('open');
        hamburger.classList.toggle('open');
    }
}

// ==========================================
// VIEW RENDERING FUNCTIONS
// ==========================================

// --- VIEW: HOME ---
function renderHome(container) {
    container.innerHTML = `
        <div class="page-section">
            <div class="hero-section">
                <div class="hero-content" style="max-width: 800px; margin: 0 auto;">
                    <h1 class="type-h1" style="font-size: 2.8rem; line-height: 1.25;"><span style="font-size: 1.1rem; text-transform: uppercase; letter-spacing: 0.1em; color: #493728; font-family: var(--font-instrument-sans); font-weight: 600; display: block; margin-bottom: 12px;">✦ AI Powered Meeting Intelligence</span>Every Meeting. Stored in Your Second Brain.</h1>
                    <p class="type-body" style="max-width: 650px; margin: 0 auto 30px; font-size: 1.1rem; line-height: 1.6; color: var(--text-secondary);">
                        MythBrain captures audio with real hardware, syncs to the cloud, and lets you chat with any meeting using AI — so nothing is ever forgotten.
                    </p>
                    <div style="display: flex; gap: 16px; justify-content: center; margin-bottom: 40px;">
                        ${state.authenticated
            ? `<button class="nav-btn" onclick="navigateTo('dashboard')">Go to Workspace <i class="fa-solid fa-arrow-right"></i></button>`
            : `<button class="nav-btn" onclick="toggleAuthModal(null, 'register')">Get Started Free <i class="fa-solid fa-arrow-right"></i></button>
                               <button class="nav-btn-secondary" onclick="toggleAuthModal(null, 'login')">Watch Demo</button>`
        }
                    </div>
                </div>
                
                <div class="hero-stats">
                    <div class="stat-item">
                        <h3>15s</h3>
                        <p>Sync Windows</p>
                    </div>
                    <div class="stat-item border-left-desktop">
                        <h3>99.4%</h3>
                        <p>STT Accuracy</p>
                    </div>
                    <div class="stat-item border-left-desktop">
                        <h3>&lt; 1s</h3>
                        <p>Latency</p>
                    </div>
                </div>
            </div>

            <!-- Video Player Section -->
            <div class="video-section">
                <div class="video-wrapper">
                    <div class="video-thumbnail" id="home-video-thumb" style="background-image: url('${window.basePath}IMG/videohero1.jpg');">
                        <button class="video-play-btn" onclick="playHomeVideo()" aria-label="Play video">
                            <i class="fa-solid fa-play" style="margin-left: 4px;"></i>
                        </button>
                    </div>
                    <div class="video-iframe" id="home-video-frame" style="display: none;">
                        <iframe id="home-video-iframe" src="" data-src="https://www.youtube.com/embed/uXByFFJVfc8?autoplay=1&rel=0&showinfo=0&controls=1&modestbranding=1&playsinline=1" allowfullscreen allow="autoplay"></iframe>
                    </div>
                </div>
            </div>

            <!-- Feature Section -->
            <div class="section-header" style="margin-top: 80px;">
                <h2>Hardware Meets Cloud Intelligence</h2>
                <p>Experience real-time billing-free transcription using bilingual language engines and Groq models.</p>
            </div>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon"><i class="fa-solid fa-microchip"></i></div>
                    <h3>ESP32 Firmware</h3>
                    <p>Runs on ESP32 Dev Kit V1 connected to INMP441 Microphone. Features smart buffer fallback to local storage if Wi-Fi is disrupted.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon"><i class="fa-solid fa-clock-rotate-left"></i></div>
                    <h3>Bilingual Real-Time Sync</h3>
                    <p>Deepgram auto-detects language outputs in Bengali or English. Uploads chunks every 15 seconds to display conversations instantly.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon"><i class="fa-solid fa-bolt"></i></div>
                    <h3>Supercharged with Redis</h3>
                    <p>Integrated Redis database caching handles live transcript rendering. Polls return in milliseconds, maintaining low server CPU load.</p>
                </div>
            </div>

            <!-- Why Choose Section -->
            <div class="section-header" style="margin-top: 80px;">
                <h2>Why Choose MythBrain</h2>
                <p>Designed for individuals and businesses who value absolute security, speed, and intelligence.</p>
            </div>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon"><i class="fa-solid fa-shield-halved"></i></div>
                    <h3>Absolute Confidentiality</h3>
                    <p>Everything runs securely. Your API keys are saved locally in your own browser's storage and never sent to central servers.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon"><i class="fa-solid fa-language"></i></div>
                    <h3>Bilingual Focus</h3>
                    <p>Built explicitly with Bengali-English transition detection in mind, accommodating local corporate/education environments.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon"><i class="fa-solid fa-piggy-bank"></i></div>
                    <h3>Cost-Effective Design</h3>
                    <p>Utilize your own Deepgram and Groq client-side API keys with generous free tiers, ensuring practically zero operating costs.</p>
                </div>
            </div>

            <!-- Frequently Asked Questions -->
            <div class="section-header" style="margin-top: 80px;">
                <h2>Frequently Asked Questions</h2>
                <p>Everything you need to know about MythBrain and hardware sync.</p>
            </div>
            <div class="faq-accordion">
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFaq(this)">
                        <span>How does the ESP32 connect to MythBrain?</span>
                        <i class="fa-solid fa-chevron-down faq-icon"></i>
                    </div>
                    <div class="faq-answer">
                        The ESP32 microphone recorder connects to your local Wi-Fi and pushes 15-second WAV audio chunks directly to the backend sync API.
                    </div>
                </div>
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFaq(this)">
                        <span>Is there a limit to the length of the meetings?</span>
                        <i class="fa-solid fa-chevron-down faq-icon"></i>
                    </div>
                    <div class="faq-answer">
                        No! Since recordings are uploaded in 15-second intervals and processed incrementally, you can record meetings for as long as your host server resources allow.
                    </div>
                </div>
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFaq(this)">
                        <span>How does the offline fallback cache work?</span>
                        <i class="fa-solid fa-chevron-down faq-icon"></i>
                    </div>
                    <div class="faq-answer">
                        If your local Wi-Fi gets disconnected temporarily during a meeting, the ESP32 automatically buffers audio data in its RAM and uploads it sequentially once the connection is restored.
                    </div>
                </div>
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFaq(this)">
                        <span>Where can I configure my personal API keys?</span>
                        <i class="fa-solid fa-chevron-down faq-icon"></i>
                    </div>
                    <div class="faq-answer">
                        Navigate to the Settings tab in your workspace dashboard to enter your Deepgram and Groq API keys securely.
                    </div>
                </div>
            </div>
        </div>
    `;
}

// --- VIEW: DASHBOARD WORKSPACE ---
async function renderDashboard(container) {
    container.innerHTML = `
        <div class="page-section">
            <div style="margin-bottom: 25px;">
                <h1 class="type-h3">Dashboard Workspace</h1>
                <p class="type-body-14" style="color: var(--text-secondary);">Manage your connected hardware voice mic recorder and observe live synchronizations.</p>
            </div>
            
            <div class="dashboard-grid">
                <!-- Left Main Panel: Active Recording Box -->
                <div class="dashboard-card" id="recording-panel-mount">
                    <div class="skeleton-shimmer" style="height: 250px; border-radius: var(--radius-md);"></div>
                </div>
                
                <!-- Right Side Panel: Calendar & Recent list -->
                <div class="dashboard-sidebar">
                    <!-- Connected Device Settings Card -->
                    <div class="dashboard-card" id="device-capsule-mount">
                        <div class="skeleton-shimmer" style="height: 120px; border-radius: var(--radius-md);"></div>
                    </div>
                    
                    <!-- Calendar Picker -->
                    <div class="dashboard-card" id="calendar-card-mount">
                        <div class="calendar-widget">
                            <div class="calendar-header">
                                <h3 class="type-heading-16" id="calendar-month-year">June 2026</h3>
                                <div style="display:flex; gap: 8px;">
                                    <button class="action-btn-small" onclick="shiftCalendar(-1)"><i class="fa-solid fa-chevron-left"></i></button>
                                    <button class="action-btn-small" onclick="shiftCalendar(1)"><i class="fa-solid fa-chevron-right"></i></button>
                                </div>
                            </div>
                            <div class="calendar-grid" id="calendar-days-mount">
                                <!-- Calendar days injected here -->
                            </div>
                        </div>
                    </div>
                    
                    <!-- Recent completed recordings -->
                    <div class="dashboard-card" id="recent-recordings-card-mount">
                        <h3 class="type-heading-16" style="margin-bottom: 15px;">Recent Completed Meetings</h3>
                        <div class="recent-list" id="recent-recordings-mount">
                            <div class="skeleton-shimmer" style="height: 50px; border-radius: 6px; margin-bottom: 8px;"></div>
                            <div class="skeleton-shimmer" style="height: 50px; border-radius: 6px;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Fetch dashboard components data parallelly
    loadDashboardData();
}

async function loadDashboardData() {
    try {
        const devRes = await fetch(`${window.basePath}api.php?action=get_devices`);
        const devData = await devRes.json();
        state.devices = devData.devices || [];

        const recRes = await fetch(`${window.basePath}api.php?action=get_recordings`);
        const recData = await recRes.json();
        state.recordings = recData.recordings || [];
        state.allRecordings = state.recordings;

        // Check if there is an active recording session
        const activeRes = await fetch(`${window.basePath}api.php?action=get_active_recording`);
        const activeData = await activeRes.json();
        if (activeData.status === 'success' && activeData.active) {
            state.activeRecording = activeData.recording;
            startActivePolling();
        } else {
            state.activeRecording = null;
        }

        renderDeviceCapsule();
        renderRecordingPanel();
        renderCalendar();
        renderRecentRecordings();
    } catch (e) {
        console.error("Dashboard data load failure", e);
        showInternetIssueBanner(document.getElementById('app-content'), () => loadDashboardData());
    }
}

function renderDeviceCapsule() {
    const mount = document.getElementById('device-capsule-mount');
    if (!mount) return;

    if (state.devices.length === 0) {
        mount.innerHTML = `
            <div class="dashboard-card-title">
                <span class="type-heading-16">No Linked Device</span>
            </div>
            <p class="type-body-14" style="color: var(--text-secondary); margin-bottom: 15px;">Link a pre-seeded hardware device token to start recording meetings.</p>
            <button class="nav-btn" onclick="openAddDeviceModal()" style="width: 100%;"><i class="fa-solid fa-plus"></i> Link Device Token</button>
        `;
        return;
    }

    const activeDevice = state.devices[0]; // Active Device

    // Online check logic: if last ping was within 60 seconds, show online
    const isOnline = activeDevice.last_ping && (new Date() - new Date(activeDevice.last_ping.replace(/-/g, '/'))) < 60000;

    mount.innerHTML = `
        <div class="dashboard-card-title" style="margin-bottom: 10px;">
            <span class="type-heading-16">Connected Hardware</span>
            <span class="recording-status-indicator" style="position:static;">
                <span class="${isOnline ? 'status-dot-active' : ''}" style="background-color: ${isOnline ? 'var(--color-lime-green)' : 'var(--color-tomato)'}; box-shadow: 0 0 10px ${isOnline ? 'var(--color-lime-green)' : 'var(--color-tomato)'};"></span>
                <span style="font-weight: 700; color: ${isOnline ? 'var(--color-lime-green)' : 'var(--color-tomato)'};">${isOnline ? 'ONLINE' : 'OFFLINE'}</span>
            </span>
        </div>
        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 12px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div>
                <p class="type-caption" style="text-transform:uppercase; color: var(--text-muted);">Activation Token</p>
                <p class="type-heading-16" style="font-weight:800; font-family: monospace;">${activeDevice.token}</p>
            </div>
            <button class="action-btn-small" onclick="navigateTo('settings')" title="Manage Wi-Fi & Device Configuration"><i class="fa-solid fa-gear"></i></button>
        </div>
        <p class="type-caption-12" style="color: var(--text-muted);">Last Pinged: ${activeDevice.last_ping ? activeDevice.last_ping : 'Never'}</p>
    `;
}

function renderRecordingPanel() {
    const mount = document.getElementById('recording-panel-mount');
    if (!mount) return;

    if (state.devices.length === 0) {
        mount.innerHTML = `
            <div style="text-align: center; padding: 40px 10px; color: var(--text-secondary);">
                <i class="fa-solid fa-microphone-slash" style="font-size: 2.5rem; color: var(--text-muted); margin-bottom: 15px; display:block;"></i>
                <h3 class="type-h3-20" style="margin-bottom:8px;">No Voice Hardware Configured</h3>
                <p class="type-body-14" style="max-width: 320px; margin: 0 auto;">Link a device from the configuration portal on the right to use the recording controls.</p>
            </div>
        `;
        return;
    }

    const device = state.devices[0];
    const isRecording = device.recording_state == 1;
    const isFinishing = state.activeRecording && state.activeRecording.status === 'finishing';

    let statsHtml = '';
    let liveText = '';

    if ((isRecording || isFinishing) && state.activeRecording) {
        const formattedTime = formatElapsedTime(state.activeRecording.elapsed_seconds || 0);
        const initialWordCount = state.activeRecording.transcript ? state.activeRecording.transcript.trim().split(/\s+/).filter(Boolean).length : 0;
        statsHtml = `
            <div class="stats-capsule-grid">
                <div class="stat-capsule">
                    <div class="stat-capsule-icon"><i class="fa-solid fa-cubes"></i></div>
                    <div class="stat-capsule-info">
                        <h4 id="stat-chunks-count">${state.activeRecording.chunk_count || 0}</h4>
                        <p>Chunks Sent</p>
                    </div>
                </div>
                <div class="stat-capsule">
                    <div class="stat-capsule-icon"><i class="fa-solid fa-font"></i></div>
                    <div class="stat-capsule-info">
                        <h4 id="stat-word-count">${initialWordCount}</h4>
                        <p>Word Count</p>
                    </div>
                </div>
                <div class="stat-capsule">
                    <div class="stat-capsule-icon"><i class="fa-solid fa-clock"></i></div>
                    <div class="stat-capsule-info">
                        <h4 id="stat-elapsed-time">${formattedTime}</h4>
                        <p>Elapsed Time</p>
                    </div>
                </div>
            </div>
        `;
        liveText = state.activeRecording.transcript || '';
    } else {
        statsHtml = `
            <div class="stats-capsule-grid" style="opacity: 0.65;">
                <div class="stat-capsule">
                    <div class="stat-capsule-icon"><i class="fa-solid fa-cubes"></i></div>
                    <div class="stat-capsule-info">
                        <h4>0</h4>
                        <p>Chunks Sent</p>
                    </div>
                </div>
                <div class="stat-capsule">
                    <div class="stat-capsule-icon"><i class="fa-solid fa-font"></i></div>
                    <div class="stat-capsule-info">
                        <h4>0</h4>
                        <p>Word Count</p>
                    </div>
                </div>
                <div class="stat-capsule">
                    <div class="stat-capsule-icon"><i class="fa-solid fa-clock"></i></div>
                    <div class="stat-capsule-info">
                        <h4>00:00</h4>
                        <p>Elapsed Time</p>
                    </div>
                </div>
            </div>
        `;
    }

    mount.innerHTML = `
        <div class="dashboard-card-title">
            <span class="type-heading-16">${isRecording ? 'Meeting Recorder Active' : (isFinishing ? 'Meeting Saving' : 'Meeting Recorder Standby')}</span>
            ${isRecording ? `
                <span class="recording-status-indicator" style="position:static;">
                    <span class="status-dot-active"></span>
                    <span style="color: var(--color-lime-green); font-weight:700;">REC</span>
                </span>
            ` : (isFinishing ? `
                <span class="recording-status-indicator" style="position:static; background: rgba(245, 158, 11, 0.1);">
                    <span class="status-dot-active" style="background: #f59e0b; box-shadow: 0 0 8px #f59e0b;"></span>
                    <span style="color: #f59e0b; font-weight:700;">SAVING</span>
                </span>
            ` : '')}
        </div>
        
        <!-- Animated Soundwave box -->
        <div class="soundwave-box ${isRecording ? 'active' : ''}">
            <div class="soundwave-bar"></div>
            <div class="soundwave-bar"></div>
            <div class="soundwave-bar"></div>
            <div class="soundwave-bar"></div>
            <div class="soundwave-bar"></div>
            <div class="soundwave-bar"></div>
            <div class="soundwave-bar"></div>
            <div class="soundwave-bar"></div>
        </div>
        
        <!-- Live Counters -->
        ${statsHtml}
        
        <!-- Live Transcript Streams -->
        <div style="margin-bottom: 24px;">
            <p class="form-label">Live Speech Output</p>
            <div class="live-transcript-box" id="live-transcript-mount">${liveText}</div>
        </div>
        
        <!-- Toggle button -->
        ${isFinishing ? `
            <div style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
                <button class="btn-record-toggle on" style="opacity: 0.8; cursor: default; background: linear-gradient(135deg, #f59e0b, #d97706); width: 100%; margin-bottom: 0;" disabled>
                    <i class="fa-solid fa-circle-notch fa-spin"></i>
                    <span>Finalizing & Summarizing...</span>
                </button>
                <button onclick="forceCompleteRecording(${device.id})" class="action-btn-small" style="width: 100%; border: 1px solid var(--border-color); background: var(--bg-surface-solid); color: var(--text-secondary); padding: 10px; border-radius: var(--radius-md); font-size: 0.85rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: background 0.2s;">
                    <i class="fa-solid fa-square-check"></i> Force Complete (Bypass Sync)
                </button>
            </div>
        ` : `
            <button class="btn-record-toggle ${isRecording ? 'on' : 'off'}" onclick="toggleDeviceRecording(${device.id}, this)">
                <i class="fa-solid ${isRecording ? 'fa-circle-stop' : 'fa-microphone'}"></i>
                <span>${isRecording ? 'Stop & Complete Meeting' : 'Start Recording Now'}</span>
            </button>
        `}
        
        ${state.redisActive ? `
            <div style="margin-top: 15px; font-size: 0.75rem; color: var(--color-cadet-blue); text-align: center;">
                <i class="fa-solid fa-bolt"></i> Live transcript backed by active Redis cache server
            </div>
        ` : ''}
    `;

    // Autoscroll transcript box to bottom
    const txMount = document.getElementById('live-transcript-mount');
    if (txMount) txMount.scrollTop = txMount.scrollHeight;
}

async function forceCompleteRecording(deviceId) {
    if (!confirm("Are you sure you want to force complete this meeting and stop syncing? This will save all current data and reset the recorder immediately.")) {
        return;
    }
    try {
        const res = await fetch(`${window.basePath}api.php?action=force_complete_recording`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ device_id: deviceId })
        });
        const data = await res.json();
        if (data.status === 'success') {
            stopActivePolling();
            showCustomToast("Meeting completed successfully!", "success");
            await loadDashboardData();
        } else {
            showCustomToast("Error: " + data.message, "error");
        }
    } catch (e) {
        console.error(e);
        showCustomToast("Request failed. Please try again.", "error");
    }
}

async function autoForceCompleteRecording(recordingId) {
    const deviceId = state.devices && state.devices[0] ? state.devices[0].id : 0;
    try {
        const res = await fetch(`${window.basePath}api.php?action=force_complete_recording`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ device_id: deviceId, recording_id: recordingId })
        });
        const data = await res.json();
        if (data.status === 'success') {
            stopActivePolling();
            showCustomToast("Sync completed. Session finalized automatically.", "success");
            await loadDashboardData();
        }
    } catch (e) {
        console.error("Auto force-complete error", e);
    }
}

async function toggleDeviceRecording(deviceId, btn) {
    if (btn) {
        btn.disabled = true;
        const isCurrentlyRecording = btn.classList.contains('on');
        if (isCurrentlyRecording) {
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> <span>Stopping recorder...</span>';
        } else {
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> <span>Initializing device...</span>';
        }
    }
    try {
        const res = await fetch(`${window.basePath}api.php?action=toggle_recording`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ device_id: deviceId })
        });
        const data = await res.json();
        if (data.status === 'success') {
            // Re-fetch state
            await loadDashboardData();
        } else {
            showCustomToast("Error toggling recorder: " + data.message, "error");
            if (btn) {
                btn.disabled = false;
                const isCurrentlyRecording = btn.classList.contains('on');
                btn.innerHTML = `<i class="fa-solid ${isCurrentlyRecording ? 'fa-circle-stop' : 'fa-microphone'}"></i> <span>${isCurrentlyRecording ? 'Stop & Complete Meeting' : 'Start Recording Now'}</span>`;
            }
        }
    } catch (e) {
        console.error(e);
        if (btn) {
            btn.disabled = false;
        }
    }
}

// Active Recording Real-time Polling Engine
function startActivePolling() {
    stopActivePolling();

    // Poll the active recording details every 2 seconds
    state.pollingInterval = setInterval(async () => {
        try {
            const res = await fetch(`${window.basePath}api.php?action=get_active_recording`);
            const data = await res.json();
            if (data.status === 'success' && data.active) {
                state.activeRecording = data.recording;

                // Fail-safe automatic completion check for finishing state:
                const isFinishing = data.recording.status === 'finishing';
                if (isFinishing) {
                    const now = Date.now();
                    if (!state.finishingStartedAt) {
                        state.finishingStartedAt = now;
                        state.lastChangeAt = now;
                        state.lastChunkCount = data.recording.chunk_count || 0;
                    }
                    
                    const currentChunks = data.recording.chunk_count || 0;
                    if (currentChunks !== state.lastChunkCount) {
                        state.lastChunkCount = currentChunks;
                        state.lastChangeAt = now;
                    }
                    
                    const elapsedFinishingSeconds = (now - state.finishingStartedAt) / 1000;
                    const idleSeconds = (now - state.lastChangeAt) / 1000;
                    
                    // 1. Hard limit: 120 seconds (2 minutes)
                    // 2. Inactivity limit: 30 seconds without any new chunk uploads
                    if (elapsedFinishingSeconds >= 120 || idleSeconds >= 30) {
                        console.warn(`Auto-completing session. Elapsed finishing time: ${elapsedFinishingSeconds}s, Idle time: ${idleSeconds}s`);
                        autoForceCompleteRecording(data.recording.id);
                        return;
                    }
                } else {
                    // Reset timers if state transitions out of finishing
                    state.finishingStartedAt = null;
                    state.lastChangeAt = null;
                    state.lastChunkCount = null;
                }

                // Update specific DOM nodes directly to prevent complete page re-renders
                const chunkCountNode = document.getElementById('stat-chunks-count');
                const transcriptNode = document.getElementById('live-transcript-mount');

                if (chunkCountNode) chunkCountNode.innerText = data.recording.chunk_count || 0;
                if (transcriptNode) {
                    const previousText = transcriptNode.innerText;
                    const newText = data.recording.transcript || '';
                    if (previousText !== newText) {
                        transcriptNode.innerText = newText;
                        transcriptNode.scrollTop = transcriptNode.scrollHeight;

                        // Update word count dynamically in real time
                        const wordCountNode = document.getElementById('stat-word-count');
                        if (wordCountNode) {
                            const wordCount = newText.trim().split(/\s+/).filter(Boolean).length;
                            wordCountNode.innerText = wordCount;
                        }
                    }
                }
            } else {
                // If it is no longer active, stop polling and reload dashboard
                stopActivePolling();
                showCustomToast("Meeting completed and summarized successfully!", "success");
                loadDashboardData();
            }
        } catch (e) {
            console.error("Polling transcript failure", e);
        }
    }, 2000);

    // Increment timer counter locally every 1 second
    state.elapsedInterval = setInterval(() => {
        if (state.activeRecording) {
            state.activeRecording.elapsed_seconds = (state.activeRecording.elapsed_seconds || 0) + 1;
            const timeNode = document.getElementById('stat-elapsed-time');
            if (timeNode) {
                timeNode.innerText = formatElapsedTime(state.activeRecording.elapsed_seconds);
            }
        }
    }, 1000);
}

function stopActivePolling() {
    if (state.pollingInterval) {
        clearInterval(state.pollingInterval);
        state.pollingInterval = null;
    }
    if (state.elapsedInterval) {
        clearInterval(state.elapsedInterval);
        state.elapsedInterval = null;
    }
}

function formatElapsedTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Calendar Generator
function renderCalendar() {
    const monthYearNode = document.getElementById('calendar-month-year');
    const daysMount = document.getElementById('calendar-days-mount');
    if (!monthYearNode || !daysMount) return;

    const year = state.calendarDate.getFullYear();
    const month = state.calendarDate.getMonth();

    // Set Header Month text
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthYearNode.innerText = `${months[month]} ${year}`;

    // Build days with meeting lookup map
    const datesWithRecordings = new Set();
    const sourceRecordings = state.allRecordings || state.recordings || [];
    sourceRecordings.forEach(rec => {
        if (!rec.date) return;
        const parts = rec.date.split('-');
        if (parts.length < 3) return;
        const recYear = parseInt(parts[0], 10);
        const recMonth = parseInt(parts[1], 10) - 1; // 0-indexed month
        const recDay = parseInt(parts[2], 10);
        if (recYear === year && recMonth === month) {
            datesWithRecordings.add(recDay);
        }
    });

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    let html = '';

    // Day headers
    const daysShort = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    daysShort.forEach(d => {
        html += `<div class="calendar-day-header">${d}</div>`;
    });

    // Empty spacers for starting days offset
    for (let i = 0; i < firstDayIndex; i++) {
        html += `<div></div>`;
    }

    // Calendar days
    for (let day = 1; day <= totalDays; day++) {
        const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const hasRecs = datesWithRecordings.has(day);
        const isSelected = state.selectedDate === dateStr;

        html += `
            <div class="calendar-cell ${isSelected ? 'active' : ''} ${hasRecs ? 'has-recordings' : ''}" 
                 style="position:relative;"
                 onclick="selectCalendarDate('${dateStr}')">
                 ${day}
            </div>
        `;
    }

    daysMount.innerHTML = html;
}

function shiftCalendar(offset) {
    state.calendarDate.setMonth(state.calendarDate.getMonth() + offset);
    renderCalendar();
}

async function selectCalendarDate(dateStr) {
    if (state.selectedDate === dateStr) {
        state.selectedDate = null; // Toggle off filter
    } else {
        state.selectedDate = dateStr;
    }

    renderCalendar();

    // Show skeleton loading effect inside the mount container first
    const mount = document.getElementById('recent-recordings-mount');
    if (mount) {
        mount.innerHTML = `
            <div class="skeleton-shimmer" style="height: 56px; border-radius: var(--radius-sm); margin-bottom: 12px; opacity: 0.85;"></div>
            <div class="skeleton-shimmer" style="height: 56px; border-radius: var(--radius-sm); margin-bottom: 12px; opacity: 0.85;"></div>
            <div class="skeleton-shimmer" style="height: 56px; border-radius: var(--radius-sm); opacity: 0.85;"></div>
        `;
    }

    // Fetch filtered recordings
    const url = state.selectedDate
        ? `${window.basePath}api.php?action=get_recordings&date=${state.selectedDate}`
        : `${window.basePath}api.php?action=get_recordings`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        state.recordings = data.recordings || [];
    } catch (e) {
        console.error(e);
    }

    // Wait 600ms before rendering the results to make the loading effect smooth and visible
    await new Promise(resolve => setTimeout(resolve, 600));

    renderRecentRecordings();
}

function renderRecentRecordings() {
    const mount = document.getElementById('recent-recordings-mount');
    if (!mount) return;

    const completed = state.recordings.filter(r => r.status === 'completed');

    if (completed.length === 0) {
        mount.innerHTML = `
            <div style="text-align:center; padding: 20px 10px; color: var(--text-muted); font-style:italic; font-size:0.85rem;">
                No meetings found on this date selection.
            </div>
        `;
        return;
    }

    // Take up to 5 items
    const recent = completed.slice(0, 5);
    let html = '';

    recent.forEach(rec => {
        html += `
            <div class="recent-item" onclick="openRecordingDetailModal(${rec.id})">
                <div class="recent-item-info">
                    <h4>${escapeHtml(rec.title)}</h4>
                    <p><i class="fa-regular fa-calendar-days"></i> ${rec.date_formatted} &bull; <i class="fa-regular fa-clock"></i> ${rec.start_time_formatted}</p>
                </div>
                <div class="recent-item-meta">
                    ${rec.duration_minutes || 0}m
                </div>
            </div>
        `;
    });

    mount.innerHTML = html;
}

// --- VIEW: BRAIN / SEARCH MEETINGS ---
async function renderBrain(container) {
    container.innerHTML = `
        <div class="page-section">
            <div class="brain-header-bar">
                <div>
                    <h1 class="type-h3">Memory</h1>
                    <p class="type-body-14" style="color: var(--text-secondary);">Query transcripts, download notes, and perform analytical reasoning on previous meetings.</p>
                </div>
                
                <!-- Debounced Search bar -->
                <div class="search-box-wrapper">
                    <i class="fa-solid fa-magnifying-glass search-box-icon"></i>
                    <input type="text" class="search-box-input" placeholder="Search title or meeting transcript keywords..." id="brain-search-input" oninput="handleBrainSearch(this.value)">
                </div>
            </div>
            
            <div class="recording-card-grid" id="brain-recordings-mount">
                <div class="skeleton-shimmer" style="height: 200px; border-radius: var(--radius-md);"></div>
                <div class="skeleton-shimmer" style="height: 200px; border-radius: var(--radius-md);"></div>
                <div class="skeleton-shimmer" style="height: 200px; border-radius: var(--radius-md);"></div>
            </div>
        </div>
    `;

    // Fetch and load complete list
    fetchBrainRecordings();
}

let searchDebounceTimeout = null;
function handleBrainSearch(val) {
    clearTimeout(searchDebounceTimeout);
    searchDebounceTimeout = setTimeout(() => {
        fetchBrainRecordings(val);
    }, 300); // 300ms debounce window
}

async function fetchBrainRecordings(searchVal = '') {
    const mount = document.getElementById('brain-recordings-mount');
    if (!mount) return;

    mount.innerHTML = `
        <div class="skeleton-shimmer" style="height: 200px; border-radius: var(--radius-md);"></div>
        <div class="skeleton-shimmer" style="height: 200px; border-radius: var(--radius-md);"></div>
        <div class="skeleton-shimmer" style="height: 200px; border-radius: var(--radius-md);"></div>
    `;

    try {
        const url = searchVal
            ? `${window.basePath}api.php?action=get_recordings&search=${encodeURIComponent(searchVal)}`
            : `${window.basePath}api.php?action=get_recordings`;

        const res = await fetch(url);
        const data = await res.json();
        const records = data.recordings || [];

        const completed = records.filter(r => r.status === 'completed');

        if (completed.length === 0) {
            mount.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px 10px; color: var(--text-secondary);">
                    <i class="fa-regular fa-folder-open" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 20px; display:block;"></i>
                    <h3 class="type-h3-20" style="margin-bottom:8px;">No Completed Meetings Found</h3>
                    <p class="type-body-14" style="max-width: 380px; margin: 0 auto;">Completed recordings will appear here. If searching, verify your keywords query details.</p>
                </div>
            `;
            return;
        }

        let html = '';
        completed.forEach(rec => {
            const transcriptSnippet = rec.transcript
                ? escapeHtml(rec.transcript)
                : '<span style="color: var(--text-muted); font-style:italic;">No spoken voice transcribed in this session.</span>';

            html += `
                <div class="recording-box">
                    <div>
                        <div class="recording-box-header">
                            <h3 class="recording-box-title" onclick="openRecordingDetailModal(${rec.id})" style="cursor:pointer; text-decoration:underline;">${escapeHtml(rec.title)}</h3>
                            <div class="recording-box-actions">
                                <button onclick="showDownloadOptions(event, ${rec.id})" class="action-btn-small" title="Download as PDF"><i class="fa-solid fa-download"></i></button>
                                <button class="action-btn-small" onclick="openAskAIModal(${rec.id})" title="Ask AI about this meeting"><i class="fa-solid fa-wand-magic-sparkles"></i></button>
                                <button class="action-btn-small delete" onclick="handleDeleteRecording(${rec.id})" title="Delete Recording"><i class="fa-solid fa-trash-can"></i></button>
                            </div>
                        </div>
                        <div class="recording-box-body" onclick="openRecordingDetailModal(${rec.id})" style="cursor:pointer;">
                            ${transcriptSnippet}
                        </div>
                    </div>
                    
                    <div class="recording-box-footer">
                        <span><i class="fa-regular fa-calendar-days"></i> ${rec.date_formatted}</span>
                        <span><i class="fa-solid fa-list-check"></i> ${rec.word_count || 0} words</span>
                        <span><i class="fa-solid fa-clock"></i> ${rec.duration_minutes || 0} mins</span>
                    </div>
                </div>
            `;
        });

        mount.innerHTML = html;
    } catch (e) {
        console.error(e);
        mount.innerHTML = `<div style="grid-column:1/-1; color: var(--color-tomato);">Failed to retrieve recording records.</div>`;
        showInternetIssueBanner(document.getElementById('app-content'), () => fetchBrainRecordings(searchVal));
    }
}

async function handleDeleteRecording(id) {
    showCustomConfirm(
        "Delete Recording?",
        "Are you sure you want to permanently delete this meeting recording and its summary? This action cannot be undone.",
        async () => {
            try {
                const res = await fetch(`${window.basePath}api.php?action=delete_recording`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ recording_id: id })
                });
                const data = await res.json();
                if (data.status === 'success') {
                    showCustomToast("Recording deleted successfully.");
                    fetchBrainRecordings(); // reload list
                } else {
                    showCustomToast("Error: " + data.message, "error");
                }
            } catch (e) {
                console.error(e);
                showCustomToast("An error occurred during deletion.", "error");
            }
        }
    );
}

// --- VIEW: SPACES PAGE ---
async function renderSpace(container) {
    container.innerHTML = `
        <div class="page-section">
            <div class="brain-header-bar" style="margin-bottom: 20px;">
                <div>
                    <h1 class="type-h3">Spaces</h1>
                    <p class="type-body-14" style="color: var(--text-secondary);">Organize and group your meeting recordings into custom spaces.</p>
                </div>
                
                <div>
                    <button class="nav-btn" onclick="openCreateSpaceModal()" style="display: flex; align-items: center; gap: 8px;">
                        <i class="fa-solid fa-folder-plus"></i> Create Space
                    </button>
                </div>
            </div>

            <!-- Search Bar for Spaces -->
            <div style="margin-bottom: 30px;">
                <div class="search-box-wrapper" style="max-width: 100%;">
                    <i class="fa-solid fa-magnifying-glass search-box-icon"></i>
                    <input type="text" class="search-box-input" placeholder="Search spaces by name..." id="space-search-input" oninput="handleSpaceSearch(this.value)">
                </div>
            </div>
            
            <div class="recording-card-grid" id="spaces-list-mount">
                <div class="skeleton-shimmer" style="height: 140px; border-radius: var(--radius-md);"></div>
                <div class="skeleton-shimmer" style="height: 140px; border-radius: var(--radius-md);"></div>
                <div class="skeleton-shimmer" style="height: 140px; border-radius: var(--radius-md);"></div>
            </div>
        </div>
    `;

    fetchSpaces();
}

let spaceSearchVal = '';
let spaceSearchTimeout = null;
window.handleSpaceSearch = function(val) {
    spaceSearchVal = val.toLowerCase();
    
    const mount = document.getElementById('spaces-list-mount');
    if (mount) {
        mount.innerHTML = `
            <div class="skeleton-shimmer" style="height: 140px; border-radius: var(--radius-md);"></div>
            <div class="skeleton-shimmer" style="height: 140px; border-radius: var(--radius-md);"></div>
            <div class="skeleton-shimmer" style="height: 140px; border-radius: var(--radius-md);"></div>
        `;
    }

    clearTimeout(spaceSearchTimeout);
    spaceSearchTimeout = setTimeout(() => {
        filterAndRenderSpaces();
    }, 300);
};

let loadedSpaces = [];
async function fetchSpaces() {
    const mount = document.getElementById('spaces-list-mount');
    if (!mount) return;

    try {
        const res = await fetch(`${window.basePath}api.php?action=get_spaces`);
        const data = await res.json();
        if (data.status === 'success') {
            loadedSpaces = data.spaces || [];
            filterAndRenderSpaces();
        } else {
            mount.innerHTML = `<div style="grid-column: 1 / -1; color: var(--color-tomato);">Failed to load spaces: ${data.message}</div>`;
        }
    } catch (e) {
        console.error(e);
        mount.innerHTML = `<div style="grid-column: 1 / -1; color: var(--color-tomato);">An error occurred while fetching spaces.</div>`;
    }
}

function filterAndRenderSpaces() {
    const mount = document.getElementById('spaces-list-mount');
    if (!mount) return;

    const filtered = loadedSpaces.filter(space => space.name.toLowerCase().includes(spaceSearchVal));

    if (filtered.length === 0) {
        mount.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 10px; color: var(--text-secondary);">
                <i class="fa-regular fa-folder" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 20px; display:block;"></i>
                <h3 class="type-h3-20" style="margin-bottom:8px;">No Spaces Found</h3>
                <p class="type-body-14" style="max-width: 380px; margin: 0 auto;">Create a space to organize your recordings, or try a different search term.</p>
            </div>
        `;
        return;
    }

    let html = '';
    filtered.forEach(space => {
        const recCount = space.recordings ? space.recordings.length : 0;
        
        html += `
            <div class="space-card-wrapper" id="space-card-${space.id}" style="background: var(--bg-surface-solid); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 24px; display: flex; flex-direction: column; gap: 15px; transition: var(--transition-smooth); position: relative; box-shadow: var(--shadow-sm);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 15px;">
                    <div>
                        <h3 class="type-h3-20" style="font-family: var(--font-cormorant-garamond); font-size: 1.4rem; font-weight: 700; color: var(--text-primary); margin: 0 0 4px;">${escapeHtml(space.name)}</h3>
                        <p style="font-size: 0.8rem; color: var(--text-secondary); margin:0;"><i class="fa-regular fa-file-audio"></i> ${recCount} ${recCount === 1 ? 'meeting' : 'meetings'} added</p>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button onclick="openAddMeetingToSpaceModal(${space.id})" class="action-btn-small" title="Add Meeting"><i class="fa-solid fa-plus"></i></button>
                        <button onclick="openEditSpaceModal(${space.id}, \`${escapeHtml(space.name).replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)" class="action-btn-small" title="Edit Space"><i class="fa-solid fa-pen"></i></button>
                        <button onclick="toggleSpaceDropdown(${space.id})" class="action-btn-small dropdown-toggle-btn" id="space-dropdown-btn-${space.id}" title="Toggle Recordings"><i class="fa-solid fa-chevron-down"></i></button>
                    </div>
                </div>

                <!-- Dropdown list of recordings -->
                <div id="space-recordings-dropdown-${space.id}" class="space-recordings-dropdown">
                    ${renderSpaceDropdownRecordings(space)}
                </div>
            </div>
        `;
    });

    mount.innerHTML = html;
}

function renderSpaceDropdownRecordings(space) {
    if (!space.recordings || space.recordings.length === 0) {
        return `<div style="font-size: 0.85rem; color: var(--text-muted); font-style: italic; padding: 5px 0;">No meetings added to this space yet. Click the + icon to add some.</div>`;
    }

    let html = '';
    space.recordings.forEach(rec => {
        html += `
            <div class="space-recording-item" style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: var(--bg-card); transition: var(--transition-fast); cursor: pointer;" onclick="openRecordingDetailModal(${rec.id})">
                <div style="min-width: 0; flex: 1;">
                    <h4 style="font-size: 0.95rem; font-weight: 600; color: var(--text-primary); margin: 0 0 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(rec.title)}</h4>
                    <div style="font-size: 0.75rem; color: var(--text-muted); display: flex; gap: 12px;">
                        <span><i class="fa-regular fa-calendar-days"></i> ${rec.date_formatted}</span>
                        <span><i class="fa-solid fa-clock"></i> ${rec.duration_minutes || 0} mins</span>
                    </div>
                </div>
                <div style="display: flex; gap: 8px;" onclick="event.stopPropagation()">
                    <button onclick="handleRemoveFromSpace(${space.id}, ${rec.id})" class="action-btn-small delete" title="Remove from Space" style="width:28px; height:28px;"><i class="fa-solid fa-xmark"></i></button>
                </div>
            </div>
        `;
    });
    return html;
}

window.toggleSpaceDropdown = function(spaceId) {
    const dropdown = document.getElementById(`space-recordings-dropdown-${spaceId}`);
    const btn = document.getElementById(`space-dropdown-btn-${spaceId}`);
    const card = document.getElementById(`space-card-${spaceId}`);
    if (!dropdown || !btn) return;

    const isCurrentlyClosed = dropdown.style.display === 'none' || !dropdown.style.display;

    // Close all other dropdowns
    document.querySelectorAll('.space-recordings-dropdown').forEach(el => {
        el.style.display = 'none';
    });
    document.querySelectorAll('.dropdown-toggle-btn i').forEach(i => {
        i.className = 'fa-solid fa-chevron-down';
    });
    document.querySelectorAll('.space-card-wrapper').forEach(c => {
        c.classList.remove('dropdown-open');
    });

    if (isCurrentlyClosed) {
        dropdown.style.display = 'flex';
        btn.querySelector('i').className = 'fa-solid fa-chevron-up';
        if (card) {
            card.classList.add('dropdown-open');
        }
    } else {
        dropdown.style.display = 'none';
        btn.querySelector('i').className = 'fa-solid fa-chevron-down';
        if (card) {
            card.classList.remove('dropdown-open');
        }
    }
};

window.handleRemoveFromSpace = async function(spaceId, recId) {
    showCustomConfirm(
        "Remove from Space?",
        "Are you sure you want to remove this meeting recording from this space?",
        async () => {
            try {
                const res = await fetch(`${window.basePath}api.php?action=remove_recording_from_space`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ space_id: spaceId, recording_id: recId })
                });
                const data = await res.json();
                if (data.status === 'success') {
                    showCustomToast("Recording removed from space.");
                    fetchSpaces();
                } else {
                    showCustomToast(data.message, "error");
                }
            } catch (e) {
                console.error(e);
                showCustomToast("Connection error", "error");
            }
        }
    );
};

window.openCreateSpaceModal = function() {
    const html = `
        <div style="margin-bottom: 20px;">
            <h3 class="type-h3-20" style="margin-bottom: 6px;">Create New Space</h3>
            <p class="type-body-14" style="color: var(--text-secondary);">Organize your recordings in a dedicated workspace space.</p>
        </div>
        
        <form onsubmit="submitCreateSpace(event)">
            <div class="form-group">
                <label class="form-label">Space Name</label>
                <input type="text" class="form-control" id="create-space-name" required placeholder="e.g. Work Projects">
            </div>
            
            <div id="create-space-error" style="color:var(--color-crimson); font-size:0.85rem; margin-bottom:15px; display:none;"></div>
            
            <button type="submit" id="create-space-submit-btn" class="nav-btn" style="width:100%; padding:12px;">Create Space</button>
        </form>
    `;
    openSpaceActionModal(html);
};

window.submitCreateSpace = async function(e) {
    e.preventDefault();
    const errNode = document.getElementById('create-space-error');
    if (errNode) errNode.style.display = 'none';
    
    const nameInput = document.getElementById('create-space-name');
    const name = nameInput.value.trim();
    if (!name) return;

    const btn = document.getElementById('create-space-submit-btn');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Creating...';
    }

    try {
        const res = await fetch(`${window.basePath}api.php?action=create_space`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name })
        });
        const data = await res.json();
        if (data.status === 'success') {
            toggleSpaceActionModal(null);
            showCustomToast("Space created successfully.");
            fetchSpaces();
        } else {
            if (errNode) {
                errNode.innerText = data.message;
                errNode.style.display = 'block';
            }
        }
    } catch (ex) {
        console.error(ex);
        if (errNode) {
            errNode.innerText = "Failed to connect to server.";
            errNode.style.display = 'block';
        }
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = 'Create Space';
        }
    }
};

window.openEditSpaceModal = function(spaceId, currentName) {
    const html = `
        <div style="margin-bottom: 20px;">
            <h3 class="type-h3-20" style="margin-bottom: 6px;">Manage Space</h3>
            <p class="type-body-14" style="color: var(--text-secondary);">Update name or delete this space.</p>
        </div>
        
        <form onsubmit="submitEditSpace(event, ${spaceId})">
            <div class="form-group">
                <label class="form-label">Space Name</label>
                <input type="text" class="form-control" id="edit-space-name" value="${escapeHtml(currentName)}" required placeholder="e.g. Work Projects">
            </div>
            
            <div id="edit-space-error" style="color:var(--color-crimson); font-size:0.85rem; margin-bottom:15px; display:none;"></div>
            
            <div style="display: flex; gap: 12px; margin-top: 20px;">
                <button type="button" class="nav-btn-secondary" style="flex: 1; border-color: var(--color-tomato); color: var(--color-tomato); padding:12px;" onclick="handleDeleteSpace(${spaceId})">Delete Space</button>
                <button type="submit" id="edit-space-submit-btn" class="nav-btn" style="flex: 2; padding:12px;">Save Changes</button>
            </div>
        </form>
    `;
    openSpaceActionModal(html);
};

window.submitEditSpace = async function(e, spaceId) {
    e.preventDefault();
    const errNode = document.getElementById('edit-space-error');
    if (errNode) errNode.style.display = 'none';
    
    const nameInput = document.getElementById('edit-space-name');
    const name = nameInput.value.trim();
    if (!name) return;

    const btn = document.getElementById('edit-space-submit-btn');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Saving...';
    }

    try {
        const res = await fetch(`${window.basePath}api.php?action=update_space`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ space_id: spaceId, name: name })
        });
        const data = await res.json();
        if (data.status === 'success') {
            toggleSpaceActionModal(null);
            showCustomToast("Space updated successfully.");
            fetchSpaces();
        } else {
            if (errNode) {
                errNode.innerText = data.message;
                errNode.style.display = 'block';
            }
        }
    } catch (ex) {
        console.error(ex);
        if (errNode) {
            errNode.innerText = "Failed to connect to server.";
            errNode.style.display = 'block';
        }
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = 'Save Changes';
        }
    }
};

window.handleDeleteSpace = async function(spaceId) {
    toggleSpaceActionModal(null);
    
    showCustomConfirm(
        "Delete Space?",
        "Are you sure you want to permanently delete this space? Added meetings will not be deleted from your memory.",
        async () => {
            try {
                const res = await fetch(`${window.basePath}api.php?action=delete_space`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ space_id: spaceId })
                });
                const data = await res.json();
                if (data.status === 'success') {
                    showCustomToast("Space deleted successfully.");
                    fetchSpaces();
                } else {
                    showCustomToast(data.message, "error");
                }
            } catch (e) {
                console.error(e);
                showCustomToast("Connection error", "error");
            }
        },
        () => {
            const spaceObj = loadedSpaces.find(s => s.id === spaceId);
            if (spaceObj) {
                openEditSpaceModal(spaceId, spaceObj.name);
            }
        }
    );
};

window.openAddMeetingToSpaceModal = function(spaceId) {
    const html = `
        <div style="margin-bottom: 15px;">
            <h3 class="type-h3-20" style="margin-bottom: 6px;">Add Meeting to Space</h3>
            <p class="type-body-14" style="color: var(--text-secondary);">Search for recorded meetings in your Memory to add them to this space.</p>
        </div>
        
        <div class="search-box-wrapper" style="max-width: 100%; margin-bottom: 15px;">
            <i class="fa-solid fa-magnifying-glass search-box-icon" style="left:12px;"></i>
            <input type="text" class="search-box-input" style="padding: 10px 15px 10px 35px;" placeholder="Search by title..." id="space-meeting-search-input" oninput="handleSpaceMeetingSearch(this.value, ${spaceId})">
        </div>
        
        <div id="space-meeting-search-results" style="max-height: 250px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; padding-right: 5px;">
            <!-- Render list initially -->
        </div>
    `;
    openSpaceActionModal(html);
    handleSpaceMeetingSearch('', spaceId);
};

let spaceMeetingSearchTimeout = null;
window.handleSpaceMeetingSearch = function(query, spaceId) {
    const resultsContainer = document.getElementById('space-meeting-search-results');
    if (!resultsContainer) return;

    resultsContainer.innerHTML = `
        <div class="skeleton-shimmer" style="height: 55px; border-radius: 6px;"></div>
        <div class="skeleton-shimmer" style="height: 55px; border-radius: 6px;"></div>
        <div class="skeleton-shimmer" style="height: 55px; border-radius: 6px;"></div>
    `;

    clearTimeout(spaceMeetingSearchTimeout);
    spaceMeetingSearchTimeout = setTimeout(async () => {
        try {
            const url = query
                ? `${window.basePath}api.php?action=get_recordings&search=${encodeURIComponent(query)}`
                : `${window.basePath}api.php?action=get_recordings`;

            const res = await fetch(url);
            const data = await res.json();
            const recordings = data.recordings || [];
            const completed = recordings.filter(r => r.status === 'completed');

            const currentSpace = loadedSpaces.find(s => s.id === spaceId);
            const addedIds = currentSpace && currentSpace.recordings ? currentSpace.recordings.map(r => parseInt(r.id)) : [];

            if (completed.length === 0) {
                resultsContainer.innerHTML = `<div style="text-align: center; padding: 20px; color: var(--text-secondary); font-size: 0.9rem;">No completed meetings found matching "${escapeHtml(query)}"</div>`;
                return;
            }

            let html = '';
            completed.forEach(rec => {
                const isAlreadyAdded = addedIds.includes(parseInt(rec.id));
                html += `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-card);">
                        <div style="min-width: 0; flex: 1; margin-right: 10px;">
                            <h4 style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary); margin: 0 0 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(rec.title)}</h4>
                            <p style="font-size: 0.7rem; color: var(--text-muted); margin:0;">${rec.date}</p>
                        </div>
                        ${isAlreadyAdded 
                            ? `<span style="font-size: 0.75rem; color: var(--color-cadet-blue); font-weight: 600; padding: 6px 12px; display: flex; align-items: center; gap: 4px;"><i class="fa-solid fa-circle-check"></i> Added</span>`
                            : `<button class="nav-btn-secondary" style="padding: 6px 12px; font-size: 0.75rem;" onclick="confirmAddRecordingToSpace(${spaceId}, ${rec.id}, \`${escapeHtml(rec.title).replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)">Add</button>`
                        }
                    </div>
                `;
            });
            resultsContainer.innerHTML = html;
        } catch (e) {
            console.error(e);
            resultsContainer.innerHTML = `<div style="color: var(--color-tomato); text-align: center; padding: 20px; font-size: 0.85rem;">Failed to fetch search results.</div>`;
        }
    }, 400); 
};

window.confirmAddRecordingToSpace = function(spaceId, recId, title) {
    const modal = document.getElementById('space-action-modal');
    if (modal) modal.classList.remove('open');

    showCustomConfirm(
        "Add Meeting to Space?",
        `Do you want to add the meeting "${title}" to this space?`,
        async () => {
            try {
                const res = await fetch(`${window.basePath}api.php?action=add_recording_to_space`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ space_id: spaceId, recording_id: recId })
                });
                const data = await res.json();
                if (data.status === 'success') {
                    showCustomToast("Meeting added to space.");
                    fetchSpaces();
                } else {
                    showCustomToast(data.message, "error");
                    if (modal) modal.classList.add('open');
                }
            } catch (e) {
                console.error(e);
                showCustomToast("Connection error", "error");
                if (modal) modal.classList.add('open');
            }
        },
        {
            confirmText: 'Add',
            confirmBg: 'var(--color-primary)',
            iconClass: 'fa-solid fa-folder-plus',
            iconColor: 'var(--color-primary)',
            iconBg: 'rgba(106, 80, 58, 0.1)'
        },
        () => {
            if (modal) modal.classList.add('open');
        }
    );
};

window.openAddToSpacePopup = async function(recId, recTitle) {
    const skeleton = `
        <div style="margin-bottom: 20px;">
            <h3 class="type-h3-20" style="margin-bottom: 6px;">Add to Space</h3>
            <p class="type-body-14" style="color: var(--text-secondary);">Select a space to add the meeting "${escapeHtml(recTitle)}".</p>
        </div>
        <div style="max-height: 250px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; padding-right: 5px;">
            <div class="skeleton-shimmer" style="height: 50px; border-radius: 8px;"></div>
            <div class="skeleton-shimmer" style="height: 50px; border-radius: 8px;"></div>
        </div>
    `;
    openSpaceActionModal(skeleton);

    try {
        const res = await fetch(`${window.basePath}api.php?action=get_spaces`);
        const data = await res.json();
        if (data.status === 'success') {
            const spaces = data.spaces || [];
            
            if (spaces.length === 0) {
                const emptyHtml = `
                    <div style="margin-bottom: 20px;">
                        <h3 class="type-h3-20" style="margin-bottom: 6px;">Add to Space</h3>
                        <p class="type-body-14" style="color: var(--text-secondary);">Select a space to add the meeting "${escapeHtml(recTitle)}".</p>
                    </div>
                    <div style="text-align: center; padding: 25px 10px; color: var(--text-secondary);">
                        <i class="fa-regular fa-folder" style="font-size: 2.5rem; color: var(--text-muted); margin-bottom: 12px; display:block;"></i>
                        <p style="font-size: 0.9rem; margin-bottom: 15px;">No spaces created yet.</p>
                        <button class="nav-btn" onclick="toggleSpaceActionModal(null); navigateTo('space'); setTimeout(openCreateSpaceModal, 600);">Create a Space</button>
                    </div>
                `;
                openSpaceActionModal(emptyHtml);
                return;
            }

            let listHtml = '';
            spaces.forEach(space => {
                const isAlreadyAdded = space.recordings && space.recordings.some(r => parseInt(r.id) === parseInt(recId));
                listHtml += `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-card); gap: 15px;">
                        <span style="font-size: 0.95rem; font-weight: 600; color: var(--text-primary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${escapeHtml(space.name)}</span>
                        ${isAlreadyAdded 
                            ? `<span style="font-size: 0.8rem; color: var(--color-cadet-blue); font-weight: 600; display: flex; align-items: center; gap: 4px;"><i class="fa-solid fa-circle-check"></i> Added</span>`
                            : `<button class="nav-btn-secondary" style="padding: 6px 12px; font-size: 0.75rem; flex-shrink: 0;" onclick="submitAddFromDetailsModal(${space.id}, ${recId}, \`${escapeHtml(recTitle).replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)">Add to Space</button>`
                        }
                    </div>
                `;
            });

            const html = `
                <div style="margin-bottom: 20px;">
                    <h3 class="type-h3-20" style="margin-bottom: 6px;">Add to Space</h3>
                    <p class="type-body-14" style="color: var(--text-secondary);">Select a space to add the meeting "${escapeHtml(recTitle)}".</p>
                </div>
                <div style="max-height: 280px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; padding-right: 5px;">
                    ${listHtml}
                </div>
            `;
            openSpaceActionModal(html);
        } else {
            openSpaceActionModal(`<div style="color: var(--color-tomato); padding: 20px;">Failed to load spaces: ${data.message}</div>`);
        }
    } catch (e) {
        console.error(e);
        openSpaceActionModal(`<div style="color: var(--color-tomato); padding: 20px;">Error occurred while fetching spaces.</div>`);
    }
};

window.submitAddFromDetailsModal = async function(spaceId, recId, recTitle) {
    const spaceModal = document.getElementById('space-action-modal');
    if (spaceModal) spaceModal.classList.remove('open');

    showCustomConfirm(
        "Confirm Add?",
        `Do you want to add the meeting recording to this space?`,
        async () => {
            try {
                const res = await fetch(`${window.basePath}api.php?action=add_recording_to_space`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ space_id: spaceId, recording_id: recId })
                });
                const data = await res.json();
                if (data.status === 'success') {
                    showCustomToast("Added to space successfully.");
                    openAddToSpacePopup(recId, recTitle);
                } else {
                    showCustomToast(data.message, "error");
                    if (spaceModal) spaceModal.classList.add('open');
                }
            } catch (e) {
                console.error(e);
                showCustomToast("Connection failed", "error");
                if (spaceModal) spaceModal.classList.add('open');
            }
        },
        {
            confirmText: 'Add',
            confirmBg: 'var(--color-primary)',
            iconClass: 'fa-solid fa-folder-plus',
            iconColor: 'var(--color-primary)',
            iconBg: 'rgba(106, 80, 58, 0.1)'
        },
        () => {
            if (spaceModal) spaceModal.classList.add('open');
        }
    );
};

// --- VIEW: MYTH GLOBAL CHAT ---
function renderMyth(container) {
    container.innerHTML = `
        <div class="page-section assistant-page-section">
            <div class="myth-chat-container">
                <!-- Clean, professional top header banner -->
                <div style="padding: 16px 20px; border-bottom: 1px solid var(--border-color); background: var(--bg-surface-solid);" class="myth-chat-top-banner">
                    <h3 style="font-family: var(--font-cormorant-garamond); font-size: 1.4rem; font-weight: 700; color: var(--text-primary); margin: 0 0 4px;">Universal Assistant</h3>
                    <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0;">Query transcripts, download notes, and perform analytical reasoning on previous meetings.</p>
                </div>

                <!-- Chat message history -->
                <div class="chat-message-list" id="myth-chat-history">
                    <div class="chat-message system">
                        Hello! I am MythBrain AI. I have reviewed all your meeting recordings. Ask me anything.
                    </div>
                    
                    <!-- Chat typing loader bubble inside history container -->
                    <div id="myth-typing-indicator" style="display:none; padding: 10px 0 0;">
                        <div class="typing-indicator">
                            <div class="typing-dot"></div>
                            <div class="typing-dot"></div>
                            <div class="typing-dot"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Chat Input forms -->
                <form class="chat-input-bar" onsubmit="handleMythSubmit(event)">
                    <input type="text" class="chat-input-field" placeholder="Ask anything" id="myth-chat-input" required autocomplete="off">
                    <button type="submit" class="chat-send-btn"><i class="fa-solid fa-paper-plane"></i></button>
                </form>
            </div>
        </div>
    `;
}

async function handleMythSubmit(e) {
    e.preventDefault();
    const inputNode = document.getElementById('myth-chat-input');
    const historyNode = document.getElementById('myth-chat-history');
    const loaderNode = document.getElementById('myth-typing-indicator');
    if (!inputNode || !historyNode || !loaderNode) return;

    const msg = inputNode.value.trim();
    if (msg === '') return;

    // Append user message
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'chat-message user';
    userMsgDiv.innerText = msg;
    historyNode.insertBefore(userMsgDiv, loaderNode);

    inputNode.value = '';
    historyNode.scrollTop = historyNode.scrollHeight;

    // Show typing loader
    loaderNode.style.display = 'block';

    try {
        const res = await fetch(`${window.basePath}api.php?action=myth_chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg })
        });
        const data = await res.json();

        loaderNode.style.display = 'none';

        const systemMsgDiv = document.createElement('div');
        systemMsgDiv.className = 'chat-message system';
        historyNode.insertBefore(systemMsgDiv, loaderNode);

        if (data.status === 'success') {
            typewriteHTML(systemMsgDiv, formatMarkdown(data.response));
        } else {
            systemMsgDiv.innerText = "Error: " + data.message;
            systemMsgDiv.style.color = 'var(--color-crimson)';
            historyNode.scrollTop = historyNode.scrollHeight;
        }
    } catch (err) {
        loaderNode.style.display = 'none';
        console.error(err);
    }
}

// --- VIEW: SETTINGS & CONFIGURATION ---
async function renderSettings(container) {
    container.innerHTML = `
        <div class="page-section">
            <div style="margin-bottom: 25px;">
                <h1 class="type-h3">Settings & API Configurations</h1>
                <p class="type-body-14" style="color: var(--text-secondary);">Manage your connected hardware tokens, Wi-Fi parameters, and customize personal LLM client-side keys.</p>
            </div>
            
            <div class="settings-grid">
                <!-- Column Left -->
                <div class="settings-col">
                    <!-- Section: Hardware Configuration -->
                    <div class="dashboard-card section-hardware">
                        <h3 class="type-heading-16" style="margin-bottom: 20px;"><i class="fa-solid fa-microchip"></i> Hardware Configuration</h3>
                        
                        <div id="settings-device-mount">
                            <!-- Loaded dynamically -->
                            <div class="skeleton-shimmer" style="height: 150px; border-radius: var(--radius-sm);"></div>
                        </div>
                    </div>
                    
                    <!-- Section: Device Wi-Fi Provisioning -->
                    <div class="dashboard-card section-wifi">
                        <h3 class="type-heading-16" style="margin-bottom: 20px;"><i class="fa-solid fa-wifi"></i> Device Wi-Fi Provisioning</h3>
                        
                        <form id="settings-wifi-form" onsubmit="handleWifiSave(event)">
                            <input type="hidden" id="wifi-device-id">
                            
                            <div class="form-group">
                                <label class="form-label">Network 1 SSID (Compulsory)</label>
                                <input type="text" class="form-control" id="wifi-ssid-1" required placeholder="Primary Wi-Fi Name">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Network 1 Password</label>
                                <input type="password" class="form-control" id="wifi-pass-1" placeholder="Primary Wi-Fi Password">
                            </div>
                            
                            <!-- Add Network 2 Trigger -->
                            <div id="wifi-trigger-2" style="display: flex; align-items: center; gap: 8px; margin-top: 15px; margin-bottom: 15px; cursor: pointer;" onclick="showWifiGroup(2)">
                                <button type="button" class="action-btn-small" style="width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--bg-surface-solid); border: 1px solid var(--border-color); color: var(--text-primary); cursor: pointer;"><i class="fa-solid fa-plus" style="font-size: 0.8rem;"></i></button>
                                <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary);">Add Optional Network</span>
                            </div>

                            <!-- Network 2 Group -->
                            <div id="wifi-group-2" style="display:none; margin-bottom: 15px;">
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
                                    <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary);">Network 2 (Optional)</span>
                                    <button type="button" class="action-btn-small" style="width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--bg-surface-solid); border: 1px solid var(--border-color); color: var(--text-primary); cursor: pointer;" onclick="hideWifiGroup(2)" title="Remove Network 2"><i class="fa-solid fa-minus" style="font-size: 0.75rem;"></i></button>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Network 2 SSID</label>
                                    <input type="text" class="form-control" id="wifi-ssid-2" placeholder="Secondary Wi-Fi SSID">
                                </div>
                                <div class="form-group" style="margin-bottom: 15px;">
                                    <label class="form-label">Network 2 Password</label>
                                    <input type="password" class="form-control" id="wifi-pass-2" placeholder="Secondary Password">
                                </div>
                                <!-- Add Network 3 Trigger -->
                                <div id="wifi-trigger-3" style="display: flex; align-items: center; gap: 8px; margin-top: 10px; cursor: pointer;" onclick="showWifiGroup(3)">
                                    <button type="button" class="action-btn-small" style="width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--bg-surface-solid); border: 1px solid var(--border-color); color: var(--text-primary); cursor: pointer;"><i class="fa-solid fa-plus" style="font-size: 0.8rem;"></i></button>
                                    <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary);">Add Optional Network</span>
                                </div>
                            </div>

                            <!-- Network 3 Group -->
                            <div id="wifi-group-3" style="display:none; margin-bottom: 15px;">
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
                                    <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary);">Network 3 (Optional)</span>
                                    <button type="button" class="action-btn-small" style="width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--bg-surface-solid); border: 1px solid var(--border-color); color: var(--text-primary); cursor: pointer;" onclick="hideWifiGroup(3)" title="Remove Network 3"><i class="fa-solid fa-minus" style="font-size: 0.75rem;"></i></button>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Network 3 SSID</label>
                                    <input type="text" class="form-control" id="wifi-ssid-3" placeholder="Network 3 SSID">
                                </div>
                                <div class="form-group" style="margin-bottom: 15px;">
                                    <label class="form-label">Network 3 Password</label>
                                    <input type="password" class="form-control" id="wifi-pass-3" placeholder="Network 3 Password">
                                </div>
                                <!-- Add Network 4 Trigger -->
                                <div id="wifi-trigger-4" style="display: flex; align-items: center; gap: 8px; margin-top: 10px; cursor: pointer;" onclick="showWifiGroup(4)">
                                    <button type="button" class="action-btn-small" style="width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--bg-surface-solid); border: 1px solid var(--border-color); color: var(--text-primary); cursor: pointer;"><i class="fa-solid fa-plus" style="font-size: 0.8rem;"></i></button>
                                    <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary);">Add Optional Network</span>
                                </div>
                            </div>

                            <!-- Network 4 Group -->
                            <div id="wifi-group-4" style="display:none; margin-bottom: 15px;">
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
                                    <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary);">Network 4 (Optional)</span>
                                    <button type="button" class="action-btn-small" style="width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--bg-surface-solid); border: 1px solid var(--border-color); color: var(--text-primary); cursor: pointer;" onclick="hideWifiGroup(4)" title="Remove Network 4"><i class="fa-solid fa-minus" style="font-size: 0.75rem;"></i></button>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Network 4 SSID</label>
                                    <input type="text" class="form-control" id="wifi-ssid-4" placeholder="Network 4 SSID">
                                </div>
                                <div class="form-group" style="margin-bottom: 15px;">
                                    <label class="form-label">Network 4 Password</label>
                                    <input type="password" class="form-control" id="wifi-pass-4" placeholder="Network 4 Password">
                                </div>
                                <!-- Add Network 5 Trigger -->
                                <div id="wifi-trigger-5" style="display: flex; align-items: center; gap: 8px; margin-top: 10px; cursor: pointer;" onclick="showWifiGroup(5)">
                                    <button type="button" class="action-btn-small" style="width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--bg-surface-solid); border: 1px solid var(--border-color); color: var(--text-primary); cursor: pointer;"><i class="fa-solid fa-plus" style="font-size: 0.8rem;"></i></button>
                                    <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary);">Add Optional Network</span>
                                </div>
                            </div>

                            <!-- Network 5 Group -->
                            <div id="wifi-group-5" style="display:none; margin-bottom: 15px;">
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
                                    <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary);">Network 5 (Optional)</span>
                                    <button type="button" class="action-btn-small" style="width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--bg-surface-solid); border: 1px solid var(--border-color); color: var(--text-primary); cursor: pointer;" onclick="hideWifiGroup(5)" title="Remove Network 5"><i class="fa-solid fa-minus" style="font-size: 0.75rem;"></i></button>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Network 5 SSID</label>
                                    <input type="text" class="form-control" id="wifi-ssid-5" placeholder="Network 5 SSID">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Network 5 Password</label>
                                    <input type="password" class="form-control" id="wifi-pass-5" placeholder="Network 5 Password">
                                </div>
                            </div>
                            
                            <button type="submit" id="settings-wifi-btn" class="nav-btn" style="width:100%; margin-top: 15px;">Save Wi-Fi Configuration</button>
                        </form>
                    </div>
                </div>
                
                <!-- Column Right -->
                <div class="settings-col">
                    <!-- Section: Custom API Credentials -->
                    <div class="dashboard-card section-api">
                        <h3 class="type-heading-16" style="margin-bottom: 20px;"><i class="fa-solid fa-key"></i> Custom API Credentials</h3>
                        
                        <form id="settings-api-form" onsubmit="handleApiKeysSave(event)">
                            <div class="form-group">
                                <label class="form-label">Deepgram API Key (Speech-To-Text)</label>
                                <div class="password-input-container">
                                    <input type="password" class="form-control" id="settings-dg-key" placeholder="Enter Deepgram Token">
                                    <button type="button" class="password-toggle-btn" onclick="togglePasswordVisibility('settings-dg-key', this)" aria-label="Toggle Deepgram API Key Visibility">
                                        <i class="fa-solid fa-eye"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Transcription Language (STT Mode)</label>
                                <select class="form-control" id="settings-transcription-lang">
                                    <option value="bn">Bangla (Bengali) Only</option>
                                    <option value="multi">Bangla + English (Mixed / Code-Switching)</option>
                                    <option value="en">English Only</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Groq API Key (AI Reasoning/Summaries)</label>
                                <div class="password-input-container">
                                    <input type="password" class="form-control" id="settings-groq-key" placeholder="Enter Groq Cloud Token">
                                    <button type="button" class="password-toggle-btn" onclick="togglePasswordVisibility('settings-groq-key', this)" aria-label="Toggle Groq API Key Visibility">
                                        <i class="fa-solid fa-eye"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Groq AI LLM Model</label>
                                <select class="form-control" id="settings-groq-model">
                                    <option value="openai/gpt-oss-120b">openai/gpt-oss-120b (Default)</option>
                                    <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile</option>
                                    <option value="mixtral-8x7b-32768">mixtral-8x7b-32768</option>
                                    <option value="gemma2-9b-it">gemma2-9b-it</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">AI Summary (Completion Tokens)</label>
                                <div style="display: flex; align-items: center; gap: 12px; background: rgba(73, 55, 40, 0.02); padding: 8px 12px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); margin-bottom: 6px;">
                                    <input type="range" id="settings-summary-tokens" min="0" max="2" step="1" style="flex: 1; accent-color: var(--color-primary); cursor: pointer; height: 6px; -webkit-appearance: none; background: var(--border-color); border-radius: 3px; outline: none;" oninput="window.updateSummaryTokensLabel(this.value)">
                                    <span id="summary-tokens-val" style="font-weight: 700; width: 45px; text-align: right; color: var(--text-primary); font-size: 0.95rem;">128</span>
                                </div>
                                <p id="summary-tokens-desc" style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4; margin: 0; min-height: 32px; transition: color 0.2s ease;"></p>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Meeting Chat (Completion Tokens)</label>
                                <div style="display: flex; align-items: center; gap: 12px; background: rgba(73, 55, 40, 0.02); padding: 8px 12px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); margin-bottom: 6px;">
                                    <input type="range" id="settings-meeting-chat-tokens" min="0" max="3" step="1" style="flex: 1; accent-color: var(--color-primary); cursor: pointer; height: 6px; -webkit-appearance: none; background: var(--border-color); border-radius: 3px; outline: none;" oninput="window.updateMeetingChatTokensLabel(this.value)">
                                    <span id="meeting-chat-tokens-val" style="font-weight: 700; width: 45px; text-align: right; color: var(--text-primary); font-size: 0.95rem;">128</span>
                                </div>
                                <p id="meeting-chat-tokens-desc" style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4; margin: 0; min-height: 32px; transition: color 0.2s ease;"></p>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Assistant Chat (Completion Tokens)</label>
                                <div style="display: flex; align-items: center; gap: 12px; background: rgba(73, 55, 40, 0.02); padding: 8px 12px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); margin-bottom: 6px;">
                                    <input type="range" id="settings-assistant-chat-tokens" min="0" max="3" step="1" style="flex: 1; accent-color: var(--color-primary); cursor: pointer; height: 6px; -webkit-appearance: none; background: var(--border-color); border-radius: 3px; outline: none;" oninput="window.updateAssistantChatTokensLabel(this.value)">
                                    <span id="assistant-chat-tokens-val" style="font-weight: 700; width: 45px; text-align: right; color: var(--text-primary); font-size: 0.95rem;">512</span>
                                </div>
                                <p id="assistant-chat-tokens-desc" style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4; margin: 0; min-height: 32px; transition: color 0.2s ease;"></p>
                            </div>
                            <div class="form-group">
                                <label class="form-label">AI Chat Temperature</label>
                                <div style="display: flex; align-items: center; gap: 12px; background: rgba(73, 55, 40, 0.02); padding: 8px 12px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); margin-bottom: 6px;">
                                    <input type="range" id="settings-temperature" min="0" max="1.5" step="0.1" style="flex: 1; accent-color: var(--color-primary); cursor: pointer; height: 6px; -webkit-appearance: none; background: var(--border-color); border-radius: 3px; outline: none;" oninput="window.updateTemperatureLabel(this.value)">
                                    <span id="temperature-val" style="font-weight: 700; width: 30px; text-align: right; color: var(--text-primary); font-size: 0.95rem;">0.7</span>
                                </div>
                                <p id="temperature-desc" style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4; margin: 0; min-height: 32px; transition: color 0.2s ease;">Balanced. Good mix of accuracy + natural variation. Common for assistants.</p>
                            </div>
                            <button type="submit" id="settings-api-btn" class="nav-btn" style="width:100%;">Update API Keys</button>
                        </form>
                    </div>
                    
                    <!-- Section: AI Resource Consumptions -->
                    <div class="dashboard-card section-usage">
                        <h3 class="type-heading-16" style="margin-bottom: 20px;"><i class="fa-solid fa-chart-simple"></i> AI Resource Consumptions</h3>
                        <div class="usage-stats-grid" id="settings-usage-mount">
                            <!-- usage stats cards -->
                            <div class="skeleton-shimmer" style="height: 80px; border-radius: 8px;"></div>
                            <div class="skeleton-shimmer" style="height: 80px; border-radius: 8px;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Fetch details
    loadSettingsData();
}

async function loadSettingsData() {
    const devMount = document.getElementById('settings-device-mount');
    const usageMount = document.getElementById('settings-usage-mount');
    if (!devMount || !usageMount) return;

    try {
        // Fetch devices
        const devRes = await fetch(`${window.basePath}api.php?action=get_devices`);
        const devData = await devRes.json();
        const devices = devData.devices || [];

        if (devices.length === 0) {
            devMount.innerHTML = `
                <div style="background: var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:16px; text-align:center;">
                    <p class="type-body-14" style="color:var(--text-muted); margin-bottom:12px;">No hardware linked yet.</p>
                    <button class="nav-btn" onclick="openAddDeviceModal()"><i class="fa-solid fa-plus"></i> Link Device Token</button>
                </div>
            `;
            document.getElementById('settings-wifi-form').style.display = 'none';
        } else {
            const dev = devices[0];
            devMount.innerHTML = `
                <div style="background: var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:20px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                        <span class="type-heading-16">Active Device</span>
                        <button class="action-btn-small delete" onclick="handleUnlinkDevice(${dev.id})" title="Unlink hardware"><i class="fa-solid fa-link-slash"></i></button>
                    </div>
                    
                    <div class="form-group" style="margin-bottom:10px;">
                        <label class="form-label" style="margin:0 0 4px;">Hardware ID Token</label>
                        <div style="display:flex; gap:10px;">
                            <input type="text" class="form-control" style="font-family:monospace; font-weight:700;" value="${dev.token}" id="settings-device-token-input">
                            <button class="nav-btn-secondary" style="padding:10px 15px;" onclick="handleChangeDeviceToken(${dev.id}, this)">Update</button>
                        </div>
                        <span class="type-caption-12" style="color:var(--text-muted);">Change device token if resetting your physical ESP32.</span>
                    </div>
                </div>
            `;

            // Populate Wi-Fi forms
            document.getElementById('wifi-device-id').value = dev.id;

            const wifiFields = [
                { ssid: dev.wifi_1_ssid || '', pass: dev.wifi_1_password || '' },
                { ssid: dev.wifi_2_ssid || '', pass: dev.wifi_2_password || '' },
                { ssid: dev.wifi_3_ssid || '', pass: dev.wifi_3_password || '' },
                { ssid: dev.wifi_4_ssid || '', pass: dev.wifi_4_password || '' },
                { ssid: dev.wifi_5_ssid || '', pass: dev.wifi_5_password || '' }
            ];

            for (let i = 1; i <= 5; i++) {
                document.getElementById(`wifi-ssid-${i}`).value = wifiFields[i - 1].ssid;
                document.getElementById(`wifi-pass-${i}`).value = wifiFields[i - 1].pass;
            }

            // Initialize display state:
            // First hide all optional groups (2 to 5) and their triggers
            for (let i = 2; i <= 5; i++) {
                const group = document.getElementById(`wifi-group-${i}`);
                const trigger = document.getElementById(`wifi-trigger-${i}`);
                if (group) group.style.display = 'none';
                if (trigger) trigger.style.display = 'flex';
            }
            const firstTrigger = document.getElementById('wifi-trigger-2');
            if (firstTrigger) firstTrigger.style.display = 'flex';

            // Now recursively show groups that already have values saved
            if (wifiFields[1].ssid) {
                showWifiGroup(2);
                if (wifiFields[2].ssid) {
                    showWifiGroup(3);
                    if (wifiFields[3].ssid) {
                        showWifiGroup(4);
                        if (wifiFields[4].ssid) {
                            showWifiGroup(5);
                        }
                    }
                }
            }
        }

        // Fetch API settings keys
        const settingsRes = await fetch(`${window.basePath}api.php?action=get_user_settings`);
        const settingsData = await settingsRes.json();
        if (settingsData.status === 'success') {
            const set = settingsData.settings;
            document.getElementById('settings-dg-key').value = set.deepgram_api_key || '';
            document.getElementById('settings-groq-key').value = set.groq_api_key || '';
            document.getElementById('settings-groq-model').value = set.groq_model || 'openai/gpt-oss-120b';
            
            const summaryTokensVal = set.summary_tokens !== undefined ? parseInt(set.summary_tokens) : 128;
            const summaryTokensIdx = [64, 128, 512].indexOf(summaryTokensVal);
            document.getElementById('settings-summary-tokens').value = summaryTokensIdx !== -1 ? summaryTokensIdx : 1;
            if (window.updateSummaryTokensLabel) window.updateSummaryTokensLabel(summaryTokensIdx !== -1 ? summaryTokensIdx : 1);

            const meetingChatTokensVal = set.meeting_chat_tokens !== undefined ? parseInt(set.meeting_chat_tokens) : 128;
            const meetingChatTokensIdx = [128, 512, 1024, 2048].indexOf(meetingChatTokensVal);
            document.getElementById('settings-meeting-chat-tokens').value = meetingChatTokensIdx !== -1 ? meetingChatTokensIdx : 0;
            if (window.updateMeetingChatTokensLabel) window.updateMeetingChatTokensLabel(meetingChatTokensIdx !== -1 ? meetingChatTokensIdx : 0);

            const assistantChatTokensVal = set.assistant_chat_tokens !== undefined ? parseInt(set.assistant_chat_tokens) : 512;
            const assistantChatTokensIdx = [128, 512, 1024, 2048].indexOf(assistantChatTokensVal);
            document.getElementById('settings-assistant-chat-tokens').value = assistantChatTokensIdx !== -1 ? assistantChatTokensIdx : 1;
            if (window.updateAssistantChatTokensLabel) window.updateAssistantChatTokensLabel(assistantChatTokensIdx !== -1 ? assistantChatTokensIdx : 1);

            document.getElementById('settings-transcription-lang').value = set.transcription_language || 'bn';

            const tempVal = set.temperature !== undefined ? parseFloat(set.temperature) : 0.7;
            document.getElementById('settings-temperature').value = tempVal;
            if (window.updateTemperatureLabel) {
                window.updateTemperatureLabel(tempVal);
            } else {
                document.getElementById('temperature-val').innerText = tempVal.toFixed(1);
            }

            // Render usage cards
            usageMount.innerHTML = `
                <div class="usage-card">
                    <h3>${set.tokens_used || 0}</h3>
                    <p>Groq Tokens</p>
                </div>
                <div class="usage-card">
                    <h3>${set.words_transcribed || 0}</h3>
                    <p>Words Synced</p>
                </div>
                <div class="usage-card" style="grid-column: 1 / -1;">
                    <h3>${set.chunks_sent || 0}</h3>
                    <p>Total WAV Chunks Processed</p>
                </div>
            `;
        }
    } catch (e) {
        console.error(e);
        showInternetIssueBanner(document.getElementById('app-content'), () => loadSettingsData());
    }
}

function showWifiGroup(index) {
    const group = document.getElementById(`wifi-group-${index}`);
    const trigger = document.getElementById(`wifi-trigger-${index}`);
    if (group) group.style.display = 'block';
    if (trigger) trigger.style.display = 'none';
}

function hideWifiGroup(index) {
    const group = document.getElementById(`wifi-group-${index}`);
    const trigger = document.getElementById(`wifi-trigger-${index}`);
    if (group) group.style.display = 'none';
    if (trigger) trigger.style.display = 'flex';

    // Clear fields
    const ssidInput = document.getElementById(`wifi-ssid-${index}`);
    const passInput = document.getElementById(`wifi-pass-${index}`);
    if (ssidInput) ssidInput.value = '';
    if (passInput) passInput.value = '';

    // Recursively hide and clear any subsequent groups
    for (let i = index + 1; i <= 5; i++) {
        const subGroup = document.getElementById(`wifi-group-${i}`);
        const subTrigger = document.getElementById(`wifi-trigger-${i}`);
        if (subGroup) subGroup.style.display = 'none';
        if (subTrigger) subTrigger.style.display = 'flex';

        const subSsid = document.getElementById(`wifi-ssid-${i}`);
        const subPass = document.getElementById(`wifi-pass-${i}`);
        if (subSsid) subSsid.value = '';
        if (subPass) subPass.value = '';
    }
}

async function handleWifiSave(e) {
    e.preventDefault();
    const btn = document.getElementById('settings-wifi-btn');
    let originalHtml = "";
    if (btn) {
        originalHtml = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Saving...';
    }

    const deviceId = document.getElementById('wifi-device-id').value;
    const payload = {
        device_id: deviceId,
        wifi_1_ssid: document.getElementById('wifi-ssid-1').value,
        wifi_1_password: document.getElementById('wifi-pass-1').value,
        wifi_2_ssid: document.getElementById('wifi-ssid-2').value,
        wifi_2_password: document.getElementById('wifi-pass-2').value,
        wifi_3_ssid: document.getElementById('wifi-ssid-3').value,
        wifi_3_password: document.getElementById('wifi-pass-3').value,
        wifi_4_ssid: document.getElementById('wifi-ssid-4').value,
        wifi_4_password: document.getElementById('wifi-pass-4').value,
        wifi_5_ssid: document.getElementById('wifi-ssid-5').value,
        wifi_5_password: document.getElementById('wifi-pass-5').value
    };

    try {
        const res = await fetch(`${window.basePath}api.php?action=update_device_wifi`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.status === 'success') {
            showCustomToast(data.message, "success");
            loadSettingsData();
        } else {
            showCustomToast("Error: " + data.message, "error");
        }
    } catch (err) {
        console.error(err);
        showCustomToast("Failed to connect to server.", "error");
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalHtml;
        }
    }
}

async function handleChangeDeviceToken(deviceId, btn) {
    const newToken = document.getElementById('settings-device-token-input').value.trim();
    if (newToken.length !== 5) {
        showCustomToast("Token must be exactly 5 characters long!", "error");
        return;
    }

    let originalHtml = "";
    if (btn) {
        originalHtml = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';
    }

    try {
        const res = await fetch(`${window.basePath}api.php?action=change_device_token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ device_id: deviceId, new_token: newToken })
        });
        const data = await res.json();
        if (data.status === 'success') {
            showCustomToast(data.message, "success");
            loadSettingsData();
        } else {
            showCustomToast("Error: " + data.message, "error");
        }
    } catch (err) {
        console.error(err);
        showCustomToast("Failed to connect to server.", "error");
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalHtml;
        }
    }
}

async function handleUnlinkDevice(deviceId) {
    showCustomConfirm(
        "Unlink Hardware Recorder?",
        "Are you sure you want to unlink this hardware recorder? It will stop synching to this account.",
        async () => {
            try {
                const res = await fetch(`${window.basePath}api.php?action=remove_device`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ device_id: deviceId })
                });
                const data = await res.json();
                if (data.status === 'success') {
                    showCustomToast("Device unlinked successfully.", "success");
                    loadSettingsData();
                } else {
                    showCustomToast("Error: " + data.message, "error");
                }
            } catch (e) {
                console.error(e);
                showCustomToast("An error occurred during unlinking.", "error");
            }
        },
        {
            confirmText: 'Unlink',
            confirmBg: '#dc3545',
            iconClass: 'fa-solid fa-link-slash',
            iconColor: '#dc3545',
            iconBg: 'rgba(220, 80, 80, 0.1)'
        }
    );
}

async function handleApiKeysSave(e) {
    e.preventDefault();
    const btn = document.getElementById('settings-api-btn');
    let originalHtml = "";
    if (btn) {
        originalHtml = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Updating...';
    }

    const summaryTokensIdx = parseInt(document.getElementById('settings-summary-tokens').value);
    const summaryTokens = [64, 128, 512][summaryTokensIdx] || 128;

    const meetingChatTokensIdx = parseInt(document.getElementById('settings-meeting-chat-tokens').value);
    const meetingChatTokens = [128, 512, 1024, 2048][meetingChatTokensIdx] || 128;

    const assistantChatTokensIdx = parseInt(document.getElementById('settings-assistant-chat-tokens').value);
    const assistantChatTokens = [128, 512, 1024, 2048][assistantChatTokensIdx] || 512;

    const payload = {
        deepgram_api_key: document.getElementById('settings-dg-key').value,
        groq_api_key: document.getElementById('settings-groq-key').value,
        groq_model: document.getElementById('settings-groq-model').value,
        max_response_tokens: 1024,
        temperature: parseFloat(document.getElementById('settings-temperature').value),
        transcription_language: document.getElementById('settings-transcription-lang').value,
        summary_tokens: summaryTokens,
        meeting_chat_tokens: meetingChatTokens,
        assistant_chat_tokens: assistantChatTokens
    };

    try {
        const res = await fetch(`${window.basePath}api.php?action=update_user_settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.status === 'success') {
            showCustomToast(data.message, "success");
            loadSettingsData();
        } else {
            showCustomToast("Error updating keys: " + data.message, "error");
        }
    } catch (err) {
        console.error(err);
        showCustomToast("Failed to connect to server.", "error");
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalHtml;
        }
    }
}


// ==========================================
// AUTHENTICATION MODAL SUBMISSIONS & DRAWER
// ==========================================
function toggleAuthModal(e, view = 'login') {
    if (e) e.stopPropagation();

    const modal = document.getElementById('auth-modal');
    if (!modal) return;

    if (modal.classList.contains('open')) {
        modal.classList.remove('open');
    } else {
        renderAuthModalForm(view);
        modal.classList.add('open');

        // Auto-close mobile menu when auth modal opens
        const navMenu = document.getElementById('nav-menu');
        const hamburger = document.getElementById('hamburger-btn');
        if (navMenu && hamburger) {
            navMenu.classList.remove('open');
            hamburger.classList.remove('open');
        }
    }
}

function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function renderAuthModalForm(view) {
    const mount = document.getElementById('auth-modal-body');
    if (!mount) return;

    if (view === 'login') {
        mount.innerHTML = `
            <div style="margin-bottom: 25px;">
                <h3 class="type-h3-20" style="margin-bottom: 6px;">Login to MythBrain</h3>
                <p class="type-body-14" style="color: var(--text-secondary);">Access your recordings dashboard panel</p>
            </div>
            
            <form id="auth-login-form" onsubmit="submitLoginForm(event)">
                <div class="form-group">
                    <label class="form-label">Email Address</label>
                    <input type="email" class="form-control" id="login-email" required placeholder="">
                </div>
                <div class="form-group">
                    <label class="form-label">Password</label>
                    <div class="password-input-container">
                        <input type="password" class="form-control" id="login-pass" required placeholder="">
                        <button type="button" class="password-toggle-btn" onclick="togglePasswordVisibility('login-pass', this)" aria-label="Toggle Password Visibility">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                    </div>
                </div>
                
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
                    <a href="#" class="type-link-13" onclick="renderAuthModalForm('forgot'); return false;" style="color:var(--color-primary);">Forgot Password?</a>
                    <span class="type-small-body-14" style="color:var(--text-secondary);">New user? <a href="#" onclick="renderAuthModalForm('register'); return false;" style="color:var(--color-pastel-orange); font-weight:700;">Sign Up</a></span>
                </div>
                
                <div id="login-feedback-error" style="color:var(--color-crimson); font-size:0.85rem; margin-bottom:15px; display:none;"></div>
                
                <button type="submit" class="nav-btn" style="width:100%; padding:12px;">Login Securely</button>
            </form>
        `;
    } else if (view === 'register') {
        mount.innerHTML = `
            <div style="margin-bottom: 25px;">
                <h3 class="type-h3-20" style="margin-bottom: 6px;">Create Workspace Account</h3>
                <p class="type-body-14" style="color: var(--text-secondary);">Start recording and transcribing instantly</p>
            </div>
            
            <form id="auth-register-form" onsubmit="submitRegisterForm(event)">
                <div class="form-group">
                    <label class="form-label">Full Name</label>
                    <input type="text" class="form-control" id="reg-name" required placeholder="">
                </div>
                <div class="form-group">
                    <label class="form-label">Email Address</label>
                    <input type="email" class="form-control" id="reg-email" required placeholder="">
                </div>
                <div class="form-group">
                    <label class="form-label">Password</label>
                    <div class="password-input-container">
                        <input type="password" class="form-control" id="reg-pass" required placeholder="">
                        <button type="button" class="password-toggle-btn" onclick="togglePasswordVisibility('reg-pass', this)" aria-label="Toggle Password Visibility">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                    </div>
                </div>
                
                <div style="margin-bottom: 20px; text-align:right;">
                    <span class="type-small-body-14" style="color:var(--text-secondary);">Already registered? <a href="#" onclick="renderAuthModalForm('login'); return false;" style="color:var(--color-pastel-orange); font-weight:700;">Login</a></span>
                </div>
                
                <div id="register-feedback-error" style="color:var(--color-crimson); font-size:0.85rem; margin-bottom:15px; display:none;"></div>
                
                <button type="submit" class="nav-btn" style="width:100%; padding:12px;">Sign Up Workspace</button>
            </form>
        `;
    } else if (view === 'forgot') {
        mount.innerHTML = `
            <div style="margin-bottom: 25px;">
                <h3 class="type-h3-20" style="margin-bottom: 6px;">Reset Password</h3>
                <p class="type-body-14" style="color: var(--text-secondary);">Request a temporary recovery password token</p>
            </div>
            
            <form id="auth-forgot-form" onsubmit="submitForgotForm(event)">
                <div class="form-group">
                    <label class="form-label">Email Address</label>
                    <input type="email" class="form-control" id="forgot-email" required placeholder="name@domain.com">
                </div>
                
                <div style="margin-bottom: 20px; text-align:left;">
                    <a href="#" class="type-link-13" onclick="renderAuthModalForm('login'); return false;" style="color:var(--color-primary);"><i class="fa-solid fa-arrow-left-long"></i> Back to Login</a>
                </div>
                
                <div id="forgot-feedback" style="font-size:0.85rem; margin-bottom:15px;"></div>
                
                <button type="submit" class="nav-btn" style="width:100%; padding:12px;">Send Password Token</button>
            </form>
        `;
    }
}

async function submitLoginForm(e) {
    e.preventDefault();
    const errNode = document.getElementById('login-feedback-error');
    errNode.style.display = 'none';

    const form = document.getElementById('auth-login-form');
    const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
    let originalText = '';
    if (submitBtn) {
        originalText = submitBtn.innerText;
        submitBtn.innerText = 'Logging...';
        submitBtn.disabled = true;
    }

    const payload = {
        email: document.getElementById('login-email').value,
        password: document.getElementById('login-pass').value
    };

    try {
        const res = await fetch(`${window.basePath}api.php?action=login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (data.status === 'success') {
            state.authenticated = true;
            state.user = data.user;
            updateHeaderLinks();
            toggleAuthModal(); // Close modal
            navigateTo('dashboard');
        } else {
            errNode.innerText = data.message;
            errNode.style.display = 'block';
            if (submitBtn) {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        }
    } catch (err) {
        console.error(err);
        if (submitBtn) {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }
    }
}

async function submitRegisterForm(e) {
    e.preventDefault();
    const errNode = document.getElementById('register-feedback-error');
    errNode.style.display = 'none';

    const form = document.getElementById('auth-register-form');
    const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
    let originalText = '';
    if (submitBtn) {
        originalText = submitBtn.innerText;
        submitBtn.innerText = 'Registering...';
        submitBtn.disabled = true;
    }

    const payload = {
        name: document.getElementById('reg-name').value,
        email: document.getElementById('reg-email').value,
        password: document.getElementById('reg-pass').value
    };

    try {
        const res = await fetch(`${window.basePath}api.php?action=register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (data.status === 'success') {
            showCustomToast("Account created successfully! Logging you in...", "success");

            // Auto login after registration
            const loginRes = await fetch(`${window.basePath}api.php?action=login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: payload.email, password: payload.password })
            });
            const loginData = await loginRes.json();
            if (loginData.status === 'success') {
                state.authenticated = true;
                state.user = loginData.user;
                updateHeaderLinks();
                toggleAuthModal();
                navigateTo('dashboard');
            }
        } else {
            errNode.innerText = data.message;
            errNode.style.display = 'block';
            if (submitBtn) {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        }
    } catch (err) {
        console.error(err);
        if (submitBtn) {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }
    }
}

async function submitForgotForm(e) {
    e.preventDefault();
    const feed = document.getElementById('forgot-feedback');
    feed.innerText = 'Sending...';
    feed.style.color = 'var(--text-secondary)';

    const form = document.getElementById('auth-forgot-form');
    const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
    let originalText = '';
    if (submitBtn) {
        originalText = submitBtn.innerText;
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;
    }

    const payload = { email: document.getElementById('forgot-email').value };

    try {
        const res = await fetch(`${window.basePath}api.php?action=forgot`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.status === 'success') {
            feed.innerText = data.message;
            feed.style.color = 'var(--color-cadet-blue)';
        } else {
            feed.innerText = "Error: " + data.message;
            feed.style.color = 'var(--color-crimson)';
        }
        if (submitBtn) {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }
    } catch (err) {
        console.error(err);
        if (submitBtn) {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }
    }
}

// ==========================================
// DETAILS & ASK AI MODAL OVERLAY SYSTEMS
// ==========================================
function openModal(html, isChat = false) {
    const modal = document.getElementById('global-modal');
    const body = document.getElementById('modal-body-content');
    if (!modal || !body) return;

    if (isChat) {
        modal.classList.add('chat-modal-layout');
    } else {
        modal.classList.remove('chat-modal-layout');
    }

    body.innerHTML = html;

    // Add dynamic class based on whether it is recording details or ask ai modal to make it wide on desktop
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        if (body.querySelector('.recording-details-view') || body.querySelector('.ask-ai-chat-view') || isChat) {
            modalContent.classList.add('modal-large');
        } else {
            modalContent.classList.remove('modal-large');
        }
    }

    modal.classList.add('open');
}

function closeModal(e) {
    if (e) {
        if (e.target.id === 'global-modal') {
            return;
        }
        e.stopPropagation();
    }
    const modal = document.getElementById('global-modal');
    if (modal) {
        modal.classList.remove('open');
        modal.classList.remove('chat-modal-layout');
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.classList.remove('modal-large');
        }
    }
}

// Modal: Add Device
function openAddDeviceModal() {
    const html = `
        <div style="margin-bottom: 20px;">
            <h3 class="type-h3-20" style="margin-bottom: 6px;">Link Voice Mic Hardware</h3>
            <p class="type-body-14" style="color: var(--text-secondary);">Enter the pre-seeded 5-character token printed/defined on your ESP32 board.</p>
        </div>
        
        <form onsubmit="submitLinkDevice(event)">
            <div class="form-group">
                <label class="form-label">Device Token</label>
                <input type="text" class="form-control" style="font-family:monospace; font-weight:700; text-transform:uppercase;" id="add-device-token" maxlength="5" required placeholder="e.g. MB101">
            </div>
            
            <div id="add-device-error" style="color:var(--color-crimson); font-size:0.85rem; margin-bottom:15px; display:none;"></div>
            
            <button type="submit" id="add-device-submit-btn" class="nav-btn" style="width:100%; padding:12px;">Link Device</button>
        </form>
    `;
    openModal(html);
}

async function submitLinkDevice(e) {
    e.preventDefault();
    const errNode = document.getElementById('add-device-error');
    if (errNode) errNode.style.display = 'none';
    const token = document.getElementById('add-device-token').value.trim().toUpperCase();

    const btn = document.getElementById('add-device-submit-btn');
    let originalHtml = "";
    if (btn) {
        originalHtml = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Linking...';
    }

    try {
        const res = await fetch(`${window.basePath}api.php?action=add_device`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: token })
        });
        const data = await res.json();
        if (data.status === 'success') {
            closeModal();
            loadDashboardData();
            location.reload();
        } else {
            if (errNode) {
                errNode.innerText = data.message;
                errNode.style.display = 'block';
            }
        }
    } catch (ex) {
        console.error(ex);
        if (errNode) {
            errNode.innerText = "Failed to connect to server.";
            errNode.style.display = 'block';
        }
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalHtml;
        }
    }
}

let currentRecordingMetadata = null;

// Modal: Recording detail transcript + summary
async function openRecordingDetailModal(recId) {
    // Open loading skeleton first
    openModal(`
        <div class="mobile-drawer-handle"></div>
        <div style="padding: 10px;" class="recording-details-view">
            <div class="skeleton-shimmer" style="width: 250px; height: 30px; border-radius:4px; margin-bottom: 15px;"></div>
            <div class="skeleton-shimmer" style="height: 120px; border-radius:8px; margin-bottom: 20px;"></div>
            <div class="skeleton-shimmer" style="height: 200px; border-radius:8px;"></div>
        </div>
    `);

    try {
        const res = await fetch(`${window.basePath}api.php?action=get_recording_details&id=${recId}`);
        const data = await res.json();
        if (data.status === 'success') {
            const rec = data.recording;

            currentRecordingMetadata = {
                date_formatted: rec.date_formatted,
                start_time_formatted: rec.start_time_formatted,
                duration_minutes: rec.duration_minutes || 0
            };

            const summaryText = rec.summary
                ? formatMarkdown(rec.summary.trim())
                : `<span style="color: var(--text-muted); font-style:italic;">No summary generated yet. Ask AI or click 'Regenerate Summary' to calculate.</span>`;

            const transcriptText = rec.transcript
                ? escapeHtml(rec.transcript.trim())
                : `<span style="color: var(--text-muted); font-style:italic;">No voice transcription recorded in this session.</span>`;

            const html = `
                <div class="recording-details-view" style="max-height:80vh; overflow-y:auto; padding-right:5px; padding-bottom:30px;">
                    <div class="mobile-drawer-handle"></div>
                    <div style="margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 15px; display:flex; justify-content:space-between; align-items:center; padding-right: 30px; gap: 15px;">
                        <div id="details-title-container" style="flex: 1; min-width: 0;">
                            <h3 class="type-h3-20" id="details-title-text" style="margin-bottom:4px; font-family: var(--font-cormorant-garamond); font-size: 1.6rem; font-weight: 700; color: var(--text-primary);">${escapeHtml(rec.title)}</h3>
                            <p class="type-caption-12" style="color: var(--text-secondary); font-size: 0.85rem;">
                                Date: ${rec.date_formatted} &bull; Time: ${rec.start_time_formatted} &bull; Duration: ${rec.duration_minutes || 0} mins
                            </p>
                        </div>
                        <div style="display: flex; gap: 8px; flex-shrink: 0;">
                            <button onclick="openAskAIModal(${rec.id})" class="download-capsule-btn">
                                <i class="fa-solid fa-wand-magic-sparkles"></i>
                                <span>Ask AI</span>
                            </button>
                            <button onclick="openEditTitleModal(${rec.id}, \`${escapeHtml(rec.title).replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)" class="download-capsule-btn">
                                <i class="fa-solid fa-pen-to-square"></i>
                                <span>Edit</span>
                            </button>
                            <button onclick="openAddToSpacePopup(${rec.id}, \`${escapeHtml(rec.title).replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)" class="download-capsule-btn">
                                <i class="fa-solid fa-folder-plus"></i>
                                <span>Add to Space</span>
                            </button>
                        </div>
                    </div>
                    <div class="recording-details-grid">
                        <div class="summary-section-wrapper" style="margin-bottom: 18px; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px 16px; background: var(--bg-card);">
                            <div class="accordion-header" style="display:flex; justify-content:space-between; align-items:center; cursor: pointer;" onclick="toggleAccordionSection('summary', ${rec.id})">
                                <h4 class="type-heading-16" style="color: var(--text-primary); font-weight: 700; display: flex; align-items: center; gap: 8px; font-size: 1.1rem; margin:0;"><i class="fa-solid fa-wand-magic-sparkles"></i> AI Summary</h4>
                                <div style="display:flex; align-items:center; gap:12px;">
                                    <button class="action-btn-small" onclick="event.stopPropagation(); handleRegenerateSummary(${rec.id})" title="Regenerate summary" style="border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-color); background: var(--bg-surface-solid); cursor: pointer;"><i class="fa-solid fa-rotate"></i></button>
                                    <i class="fa-solid fa-chevron-down accordion-chevron" id="summary-accordion-icon" style="transition: transform 0.2s; font-size: 0.95rem; color: var(--text-secondary); transform: rotate(0deg); margin-right: 5px;"></i>
                                </div>
                            </div>
                            <div class="accordion-content" style="background: #FAF6F0; border: 1px solid #E8DFD0; border-radius: var(--radius-md); font-size: 0.95rem; line-height: 1.6; color: var(--text-secondary); max-height: 380px; overflow-y: auto; margin-top: 12px; display: none;" id="modal-summary-content">
                                <div style="padding: 20px;">${summaryText}</div>
                            </div>
                        </div>
                        
                        <div class="transcript-section-wrapper open-section" style="border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px 16px; background: var(--bg-card);">
                            <div class="accordion-header" style="display:flex; justify-content:space-between; align-items:center; cursor: pointer;" onclick="toggleAccordionSection('transcript', ${rec.id})">
                                <h4 class="type-heading-16" style="font-weight: 700; display: flex; align-items: center; gap: 8px; font-size: 1.1rem; margin:0; color: var(--text-primary);"><i class="fa-solid fa-align-left"></i> Full Text Transcript</h4>
                                <i class="fa-solid fa-chevron-down accordion-chevron" id="transcript-accordion-icon" style="transition: transform 0.2s; font-size: 0.95rem; color: var(--text-secondary); transform: rotate(180deg); margin-right: 5px;"></i>
                            </div>
                            <div class="transcript-content-box accordion-content" style="background: rgba(73, 55, 40, 0.01); border: 1px solid var(--border-color); border-radius: var(--radius-md); font-size: 0.95rem; line-height: 1.6; max-height: 380px; overflow-y: auto; color: var(--text-secondary); margin-top: 12px; display: block;" id="modal-transcript-content">
                                <div style="padding: 12px 20px 20px 20px; white-space: pre-wrap;">${transcriptText}</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            openModal(html);

            // Auto-trigger summary generation on desktop if the summary is currently empty/placeholder
            if (window.innerWidth >= 1025) {
                const isPlaceholder = summaryText.includes("No summary generated yet");
                const isEmpty = !rec.summary || rec.summary.trim() === "";
                if (isPlaceholder || isEmpty) {
                    handleRegenerateSummary(rec.id);
                }
            }
        }
    } catch (e) {
        console.error(e);
    }
}

window.toggleAccordionSection = function(sectionType, recId) {
    const summaryContent = document.getElementById('modal-summary-content');
    const transcriptContent = document.getElementById('modal-transcript-content');
    const summaryIcon = document.getElementById('summary-accordion-icon');
    const transcriptIcon = document.getElementById('transcript-accordion-icon');
    const summaryWrapper = document.querySelector('.summary-section-wrapper');
    const transcriptWrapper = document.querySelector('.transcript-section-wrapper');

    if (sectionType === 'summary') {
        const isCurrentlyOpen = summaryContent.style.display !== 'none';
        if (isCurrentlyOpen) {
            summaryContent.style.display = 'none';
            if (summaryIcon) summaryIcon.style.transform = 'rotate(0deg)';
            if (summaryWrapper) summaryWrapper.classList.remove('open-section');
            
            // Auto open transcript when minimizing/closing summary
            if (transcriptContent) transcriptContent.style.display = 'block';
            if (transcriptIcon) transcriptIcon.style.transform = 'rotate(180deg)';
            if (transcriptWrapper) transcriptWrapper.classList.add('open-section');
        } else {
            summaryContent.style.display = 'block';
            if (summaryIcon) summaryIcon.style.transform = 'rotate(180deg)';
            if (summaryWrapper) summaryWrapper.classList.add('open-section');
            
            if (transcriptContent) transcriptContent.style.display = 'none';
            if (transcriptIcon) transcriptIcon.style.transform = 'rotate(0deg)';
            if (transcriptWrapper) transcriptWrapper.classList.remove('open-section');
            
            // Auto-trigger summary generation if it's currently empty or has the placeholder
            const summaryInner = summaryContent.innerHTML || "";
            const isPlaceholder = summaryInner.includes("No summary generated yet") || summaryContent.innerText.includes("No summary generated yet");
            const isEmpty = summaryContent.innerText.trim() === "";
            if (isPlaceholder || isEmpty) {
                handleRegenerateSummary(recId);
            }
        }
    } else if (sectionType === 'transcript') {
        const isCurrentlyOpen = transcriptContent && transcriptContent.style.display !== 'none';
        if (isCurrentlyOpen) {
            if (transcriptContent) transcriptContent.style.display = 'none';
            if (transcriptIcon) transcriptIcon.style.transform = 'rotate(0deg)';
            if (transcriptWrapper) transcriptWrapper.classList.remove('open-section');
            
            // Auto open summary when minimizing/closing transcript
            if (summaryContent) {
                summaryContent.style.display = 'block';
                if (summaryIcon) summaryIcon.style.transform = 'rotate(180deg)';
                if (summaryWrapper) summaryWrapper.classList.add('open-section');
                
                // Auto-trigger summary generation if it's currently empty or has the placeholder
                const summaryInner = summaryContent.innerHTML || "";
                const isPlaceholder = summaryInner.includes("No summary generated yet") || summaryContent.innerText.includes("No summary generated yet");
                const isEmpty = summaryContent.innerText.trim() === "";
                if (isPlaceholder || isEmpty) {
                    handleRegenerateSummary(recId);
                }
            }
        } else {
            if (transcriptContent) transcriptContent.style.display = 'block';
            if (transcriptIcon) transcriptIcon.style.transform = 'rotate(180deg)';
            if (transcriptWrapper) transcriptWrapper.classList.add('open-section');
            
            if (summaryContent) summaryContent.style.display = 'none';
            if (summaryIcon) summaryIcon.style.transform = 'rotate(0deg)';
            if (summaryWrapper) summaryWrapper.classList.remove('open-section');
        }
    }
};

function toggleEditTitleModal(e) {
    if (e) {
        if (e.target.id === 'edit-title-modal') {
            return;
        }
        e.stopPropagation();
    }
    const modal = document.getElementById('edit-title-modal');
    if (!modal) return;

    if (modal.classList.contains('open')) {
        modal.classList.remove('open');
    } else {
        modal.classList.add('open');
    }
}

window.toggleSpaceActionModal = function(e) {
    if (e) {
        if (e.target.id === 'space-action-modal') {
            return;
        }
        e.stopPropagation();
    }
    const modal = document.getElementById('space-action-modal');
    if (!modal) return;

    if (modal.classList.contains('open')) {
        modal.classList.remove('open');
    } else {
        modal.classList.add('open');
    }
};

window.openSpaceActionModal = function(html) {
    const body = document.getElementById('space-action-modal-body');
    if (!body) return;
    body.innerHTML = html;
    const modal = document.getElementById('space-action-modal');
    if (modal) {
        modal.classList.add('open');
    }
};

function openEditTitleModal(recId, currentTitle) {
    renderEditTitleForm(recId, currentTitle);
    const modal = document.getElementById('edit-title-modal');
    if (modal) {
        modal.classList.add('open');
    }
}

function renderEditTitleForm(recId, currentTitle) {
    const mount = document.getElementById('edit-title-modal-body');
    if (!mount) return;

    mount.innerHTML = `
        <div style="margin-bottom: 25px;">
            <h3 class="type-h3-20" style="margin-bottom: 6px;">Edit Meeting Title</h3>
            <p class="type-body-14" style="color: var(--text-secondary);">Update the title of your recording session</p>
        </div>
        
        <form id="edit-title-form" onsubmit="submitTitleForm(event, ${recId})">
            <div class="form-group">
                <label class="form-label">Meeting Title</label>
                <input type="text" class="form-control" id="edit-rec-title-input" value="${escapeHtml(currentTitle)}" required placeholder="Enter meeting title">
            </div>
            
            <div id="edit-title-feedback-error" style="color:var(--color-crimson); font-size:0.85rem; margin-top:10px; display:none;"></div>
            
            <button type="submit" class="nav-btn" style="width:100%; padding:12px; margin-top:20px;">Save Changes</button>
        </form>
    `;

    // Autofocus and select text
    setTimeout(() => {
        const input = document.getElementById('edit-rec-title-input');
        if (input) {
            input.focus();
            input.select();
        }
    }, 150);
}

async function submitTitleForm(event, recId) {
    event.preventDefault();
    const input = document.getElementById('edit-rec-title-input');
    const err = document.getElementById('edit-title-feedback-error');
    const form = document.getElementById('edit-title-form');
    if (!input || !err || !form) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : 'Save Changes';

    const newTitle = input.value.trim();
    if (!newTitle) {
        err.innerText = 'Title cannot be empty.';
        err.style.display = 'block';
        return;
    }

    // Show saving animation and disable fields
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="margin-right: 8px;"></i> Saving...`;
    }
    input.disabled = true;

    try {
        const res = await fetch(`${window.basePath}api.php?action=update_recording_title`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recording_id: recId, title: newTitle })
        });
        const data = await res.json();
        if (data.status === 'success') {
            // Close edit modal
            toggleEditTitleModal(null);

            // Update the details view modal header
            const detailsTitleText = document.getElementById('details-title-text');
            if (detailsTitleText) {
                detailsTitleText.textContent = newTitle;
            }
            // Update Edit button onclick attributes in details modal
            const editBtn = document.querySelector('.recording-details-view button[onclick^="openEditTitleModal"]');
            if (editBtn) {
                editBtn.setAttribute('onclick', `openEditTitleModal(${recId}, \`${escapeHtml(newTitle).replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)`);
            }
            const addSpaceBtn = document.querySelector('.recording-details-view button[onclick^="openAddToSpacePopup"]');
            if (addSpaceBtn) {
                addSpaceBtn.setAttribute('onclick', `openAddToSpacePopup(${recId}, \`${escapeHtml(newTitle).replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)`);
            }

            // Refresh underlying page data
            if (state.activeRoute === 'memory') {
                fetchBrainRecordings();
            } else if (state.activeRoute === 'dashboard') {
                loadDashboardData();
            }
        } else {
            err.innerText = data.message;
            err.style.display = 'block';
            // Restore button and input state
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;
            }
            input.disabled = false;
        }
    } catch (e) {
        console.error(e);
        err.innerText = 'Failed to update title. Please try again.';
        err.style.display = 'block';
        // Restore button and input state
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
        }
        input.disabled = false;
    }
}

async function handleRegenerateSummary(recId) {
    const sumBox = document.getElementById('modal-summary-content');
    if (sumBox) sumBox.innerHTML = '<div style="text-align:center;"><i class="fa-solid fa-spinner fa-spin" style="margin-right:8px;"></i> Regenerating summary using Groq LLM...</div>';

    try {
        const res = await fetch(`${window.basePath}api.php?action=regenerate_summary`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recording_id: recId })
        });
        const data = await res.json();
        if (data.status === 'success') {
            if (sumBox) sumBox.innerHTML = formatMarkdown(data.summary);
            // Refresh list
            if (state.activeRoute === 'memory') fetchBrainRecordings();
        } else {
            showCustomToast("Error: " + data.message, "error");
        }
    } catch (e) {
        console.error(e);
    }
}

// Modal: Ask AI questions about single meeting
async function openAskAIModal(recId) {
    // Open skeleton modal first
    openModal(`
        <div style="display: flex; flex-direction: column; height: 100%; flex: 1;">
            <div style="margin-bottom: 15px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
                <div class="skeleton-shimmer" style="width: 200px; height: 24px; border-radius: 4px; margin-bottom: 8px;"></div>
                <div class="skeleton-shimmer" style="width: 300px; height: 16px; border-radius: 4px;"></div>
            </div>
            <div class="skeleton-shimmer" style="flex: 1; border-radius: 8px; margin-bottom: 15px; height: 250px;"></div>
            <div class="skeleton-shimmer" style="height: 50px; border-radius: 25px;"></div>
        </div>
    `, true);

    try {
        const res = await fetch(`${window.basePath}api.php?action=get_recording_details&id=${recId}`);
        const data = await res.json();
        if (data.status === 'success') {
            const rec = data.recording;
            const html = `
                <div style="display: flex; flex-direction: column; height: 100%; flex: 1;" class="ask-ai-chat-view">
                    <div style="margin-bottom: 15px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; padding-right: 35px;">
                        <h3 class="type-h3-20" style="margin-bottom: 4px; font-family: var(--font-cormorant-garamond); font-size: 1.5rem; font-weight: 700; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Ask AI: ${escapeHtml(rec.title)}</h3>
                        <p class="type-caption-12" style="color: var(--text-secondary); font-size: 0.85rem;">Answering questions strictly based on this meeting context.</p>
                    </div>
                    
                    <div class="chat-message-list" id="ask-chat-history" style="flex: 1; overflow-y: auto; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 20px; margin-bottom: 15px; background: rgba(73, 55, 40, 0.01); min-height: 0;">
                        <div class="chat-message system" style="font-size: 0.95rem; line-height: 1.6;">
                            Hello! I’ve reviewed this meeting recording. Ask me anything about it.
                        </div>
                        
                        <!-- Chat typing loader bubble inside history container -->
                        <div id="ask-typing-indicator" style="display: none; padding: 10px 0 0;">
                            <div class="typing-indicator">
                                <div class="typing-dot"></div>
                                <div class="typing-dot"></div>
                                <div class="typing-dot"></div>
                            </div>
                        </div>
                    </div>
                    
                    <form onsubmit="submitAskAIQuery(event, ${rec.id})" style="display: flex; gap: 10px; align-items: center; background: var(--bg-surface-solid); border: 1px solid var(--border-color); border-radius: 30px; padding: 6px 12px; margin-bottom: 10px;">
                        <input type="text" class="chat-input-field" style="border: none; background: transparent; flex: 1; outline: none; padding: 8px 12px; font-size: 0.95rem; color: var(--text-primary);" id="ask-chat-input" placeholder="Ask anything about this meeting" required autocomplete="off">
                        <button type="submit" style="width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: var(--color-primary); color: var(--color-white); border: none; cursor: pointer;"><i class="fa-solid fa-paper-plane" style="font-size: 0.95rem;"></i></button>
                    </form>
                </div>
            `;
            openModal(html, true);
        }
    } catch (e) {
        console.error(e);
    }
}

async function submitAskAIQuery(e, recId) {
    e.preventDefault();
    const inputNode = document.getElementById('ask-chat-input');
    const historyNode = document.getElementById('ask-chat-history');
    const loaderNode = document.getElementById('ask-typing-indicator');
    if (!inputNode || !historyNode || !loaderNode) return;

    const msg = inputNode.value.trim();
    if (msg === '') return;

    // Append User text
    const uDiv = document.createElement('div');
    uDiv.className = 'chat-message user';
    uDiv.style.fontSize = '0.9rem';
    uDiv.innerText = msg;
    historyNode.insertBefore(uDiv, loaderNode);

    inputNode.value = '';
    historyNode.scrollTop = historyNode.scrollHeight;

    loaderNode.style.display = 'block';

    try {
        const res = await fetch(`${window.basePath}api.php?action=ask_ai`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recording_id: recId, message: msg })
        });
        const data = await res.json();

        loaderNode.style.display = 'none';

        const sDiv = document.createElement('div');
        sDiv.className = 'chat-message system';
        sDiv.style.fontSize = '0.9rem';
        historyNode.insertBefore(sDiv, loaderNode);

        if (data.status === 'success') {
            typewriteHTML(sDiv, formatMarkdown(data.response));
        } else {
            sDiv.innerText = "Error: " + data.message;
            sDiv.style.color = 'var(--color-crimson)';
            historyNode.scrollTop = historyNode.scrollHeight;
        }
    } catch (err) {
        loaderNode.style.display = 'none';
        console.error(err);
    }
}


// ==========================================
// UTILITIES HELPERS
// ==========================================
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.toString().replace(/[&<>"']/g, function (m) { return map[m]; });
}

// Basic markdown format parsing helper
function formatMarkdown(text) {
    if (!text) return '';
    let html = escapeHtml(text);

    // Convert escaped <br> tags back to newlines first
    html = html.replace(/&lt;br\s*\/?&gt;/gi, '\n');

    // Remove horizontal rule markers (dashes/underscores/equals like ---, ____, ===)
    html = html.replace(/^[-\s_=]{3,}$/gm, '');

    // Bold first
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert headers (e.g. ### Header) into styled inline h4 headers
    html = html.replace(/^(?:###|##|#)\s+(.+)$/gm, '<h4 style="font-weight: 700; margin-top: 15px; margin-bottom: 8px; color: var(--text-primary); font-size: 1.05rem;">$1</h4>');

    // Strip table separator lines (e.g. |---|---|)
    html = html.replace(/^\|[\-\s|:]+\|$/gm, '');
    
    // Replace remaining pipes with space
    html = html.replace(/\|/g, ' ');

    // Clean-strip any remaining raw emphasis asterisks (e.g. *word*)
    html = html.replace(/\*(.*?)\*/g, '$1');

    let lines = html.split('\n');
    let processed = [];
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (line === "") continue;
        
        let listMatch = line.match(/^[-*+]\s+(.+)$/);

        if (listMatch) {
            if (!inList) {
                processed.push('<ul style="margin-top: 8px; margin-bottom: 8px; padding-left: 20px; list-style-type: disc;">');
                inList = true;
            }
            processed.push('<li style="margin-bottom: 6px; line-height: 1.5; color: var(--text-secondary);">' + listMatch[1] + '</li>');
        } else {
            if (inList) {
                processed.push('</ul>');
                inList = false;
            }
            if (line.startsWith('<h4')) {
                processed.push(line);
            } else {
                processed.push('<p style="margin-bottom: 12px; line-height: 1.6; color: var(--text-secondary);">' + line + '</p>');
            }
        }
    }
    if (inList) {
        processed.push('</ul>');
    }

    return processed.join('');
}

// Play homepage hero video
function playHomeVideo() {
    const thumb = document.getElementById('home-video-thumb');
    const frame = document.getElementById('home-video-frame');
    const iframe = document.getElementById('home-video-iframe');
    if (!thumb || !frame || !iframe) return;
    thumb.classList.add('hidden');
    frame.style.display = 'block';
    iframe.src = iframe.getAttribute('data-src');
}

// Toggle FAQ item expansion
function toggleFaq(el) {
    const parent = el.parentElement;
    parent.classList.toggle('active');
}

// Show PDF download choices (Summary vs Transcript)
function showDownloadOptions(event, recId) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    // Create download choice dialog overlay
    const overlay = document.createElement('div');
    overlay.className = 'download-choice-overlay';
    overlay.style = `
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
        opacity: 0;
        transition: opacity 0.2s ease;
    `;

    overlay.innerHTML = `
        <div class="download-choice-card" style="
            position: relative;
            background: var(--bg-surface-solid);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-lg);
            padding: 30px;
            max-width: 400px;
            width: 90%;
            text-align: center;
            box-shadow: var(--shadow-lg);
            transform: scale(0.9);
            transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        ">
            <button onclick="closeDownloadChoice(event)" aria-label="Close" style="
                position: absolute;
                top: 15px;
                right: 15px;
                background: none;
                border: none;
                color: var(--text-secondary);
                font-size: 1.25rem;
                cursor: pointer;
                padding: 5px;
                line-height: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: color 0.2s ease;
            " onmouseover="this.style.color='var(--text-primary)'" onmouseout="this.style.color='var(--text-secondary)'">
                <i class="fa-solid fa-xmark"></i>
            </button>
            <h4 style="margin-bottom: 10px; font-family: var(--font-cormorant-garamond); font-size: 1.6rem; font-weight: 700; color: var(--text-primary);">Download Options</h4>
            <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 0.95rem;">Please choose which content you would like to download in PDF format.</p>
            
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <button class="nav-btn" onclick="triggerPDFDownload(event, ${recId}, 'summary')" style="width: 100%; padding: 12px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 0.95rem; cursor: pointer; border-radius: 8px;">
                    <i class="fa-solid fa-file-pdf"></i> AI Summary (PDF)
                </button>
                <button class="nav-btn-secondary" onclick="triggerPDFDownload(event, ${recId}, 'transcript')" style="width: 100%; padding: 12px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 0.95rem; cursor: pointer; border-radius: 8px;">
                    <i class="fa-solid fa-file-invoice"></i> Full Transcript (PDF)
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Animate in
    setTimeout(() => {
        overlay.style.opacity = '1';
        overlay.classList.add('open-choice');
        overlay.querySelector('.download-choice-card').style.transform = 'scale(1)';
    }, 10);

    window.closeDownloadChoice = function (e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        overlay.style.opacity = '0';
        overlay.classList.remove('open-choice');
        overlay.querySelector('.download-choice-card').style.transform = 'scale(0.9)';
        setTimeout(() => {
            overlay.remove();
        }, 300);
    };
}

// Client-side PDF Generation with Line-wrapping and Pagination
async function triggerPDFDownload(event, recId, type) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    const btn = event ? event.currentTarget : null;
    let oldHTML = '';
    if (btn) {
        oldHTML = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating PDF...';
    }

    try {
        const res = await fetch(`${window.basePath}api.php?action=get_recording_details&id=${recId}`);
        const data = await res.json();
        if (data.status === 'success') {
            const rec = data.recording;
            const title = rec.title || `Meeting ${recId}`;
            const date = rec.date_formatted || '';
            const time = rec.start_time_formatted || '';
            const duration = rec.duration_minutes ? `${rec.duration_minutes} mins` : '0 mins';

            // Get content based on selected type
            let headingText = '';
            let contentText = '';

            if (type === 'summary') {
                headingText = 'AI Summary';
                contentText = rec.summary || 'No summary generated yet.';
            } else {
                headingText = 'Full Text Transcript';
                contentText = rec.transcript || 'No transcript text recorded.';
            }

            // Detect if the content contains Bengali characters (which require complex ligature rendering not supported by jsPDF)
            const hasBengali = /[\u0980-\u09FF]/.test(contentText);
            if (hasBengali) {
                showCustomToast('Opening print preview. Please select "Save as PDF" to download.', 'info');

                let formattedContentHTML = '';
                if (type === 'summary') {
                    formattedContentHTML = formatMarkdown(contentText)
                        .replace(/var\(--text-secondary\)/g, '#333333')
                        .replace(/var\(--text-primary\)/g, '#111111');
                } else {
                    formattedContentHTML = contentText.split('\n')
                        .map(line => line.trim())
                        .filter(line => line !== '')
                        .map(line => `<p style="margin-bottom: 12px; line-height: 1.65; color: #333333;">${escapeHtml(line)}</p>`)
                        .join('');
                }

                // Create a temporary print element
                const printContainer = document.createElement('div');
                printContainer.id = 'mythbrain-print-section';
                printContainer.innerHTML = `
                    <div style="max-width: 800px; margin: 0 auto; background: #fff; padding: 30px; box-sizing: border-box; font-family: 'Instrument Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #111111;">
                        <!-- Header -->
                        <div style="border-bottom: 2px solid #E8DFD0; padding-bottom: 15px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end;">
                            <div>
                                <div style="font-size: 28px; font-weight: 700; color: #493728; font-family: 'Cormorant Garamond', Georgia, serif; line-height: 1.1;">MythBrain AI</div>
                                <div style="font-size: 10px; color: #888888; text-transform: uppercase; letter-spacing: 1.5px; font-family: 'Instrument Sans', sans-serif; margin-top: 4px;">AI-Powered Meeting Recorder & Intelligence</div>
                            </div>
                            <div style="font-size: 11px; color: #888888; font-family: 'Instrument Sans', sans-serif; text-align: right;">
                                Generated via MythBrain
                            </div>
                        </div>
                        
                        <!-- Meeting Details -->
                        <h1 style="font-size: 26px; font-weight: 700; color: #111111; margin: 0 0 10px 0; line-height: 1.25; font-family: 'Cormorant Garamond', Georgia, serif;">${escapeHtml(title)}</h1>
                        <div style="font-size: 12px; color: #666666; margin-bottom: 30px; border-bottom: 1px solid #FAF6F0; padding-bottom: 15px; font-family: 'Instrument Sans', sans-serif; display: flex; gap: 20px; flex-wrap: wrap;">
                            <span><strong>Date:</strong> ${escapeHtml(date)}</span>
                            <span><strong>Time:</strong> ${escapeHtml(time)}</span>
                            <span><strong>Duration:</strong> ${escapeHtml(duration)}</span>
                        </div>
                        
                        <!-- Type -->
                        <h2 style="font-size: 15px; font-weight: 700; color: #493728; border-bottom: 1px solid #E8DFD0; padding-bottom: 8px; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px; font-family: 'Instrument Sans', sans-serif;">${escapeHtml(headingText)}</h2>
                        
                        <!-- Content -->
                        <div style="font-size: 14.5px; color: #333333; line-height: 1.65; font-family: 'Instrument Sans', sans-serif;">
                            ${formattedContentHTML}
                        </div>
                    </div>
                `;

                document.body.appendChild(printContainer);

                // Add print-specific styles dynamically
                const styleEl = document.createElement('style');
                styleEl.id = 'mythbrain-print-styles';
                styleEl.textContent = `
                    @media print {
                        body > * {
                            display: none !important;
                        }
                        #mythbrain-print-section {
                            display: block !important;
                            position: absolute !important;
                            left: 0 !important;
                            top: 0 !important;
                            width: 100% !important;
                            background: #fff !important;
                            padding: 0 !important;
                            margin: 0 !important;
                        }
                        p, li, h1, h2, h3, h4, ul {
                            page-break-inside: avoid;
                        }
                        @page {
                            margin: 15mm 20mm;
                        }
                    }
                    @media screen {
                        #mythbrain-print-section {
                            display: none !important;
                        }
                    }
                `;
                document.head.appendChild(styleEl);

                // Trigger print
                setTimeout(() => {
                    window.print();
                    
                    // Cleanup
                    document.body.removeChild(printContainer);
                    document.head.removeChild(styleEl);
                    if (window.closeDownloadChoice) window.closeDownloadChoice();
                }, 300);

                return;
            }

            // Generate PDF using jsPDF
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Styling constants
            const margin = 20;
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const contentWidth = pageWidth - (margin * 2);
            let y = 25;

            // Header: App Title
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(22);
            doc.setTextColor(73, 55, 40); // Charcoal brand color
            doc.text('MythBrain AI', margin, y);
            y += 8;

            // Subtitle
            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(120, 120, 120);
            doc.text('AI-Powered Meeting Recorder & Intelligence', margin, y);
            y += 5;

            // Line separator
            doc.setDrawColor(220, 215, 205);
            doc.setLineWidth(0.5);
            doc.line(margin, y, pageWidth - margin, y);
            y += 12;

            // Meeting Title
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(16);
            doc.setTextColor(40, 40, 40);

            // Split title if too long
            const splitTitle = doc.splitTextToSize(title, contentWidth);
            doc.text(splitTitle, margin, y);
            y += (splitTitle.length * 6) + 4;

            // Metadata
            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(`Date: ${date}   |   Time: ${time}   |   Duration: ${duration}`, margin, y);
            y += 8;

            // Type Heading
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(13);
            doc.setTextColor(73, 55, 40);
            doc.text(headingText, margin, y);
            y += 8;

            // Line separator
            doc.setDrawColor(240, 235, 225);
            doc.line(margin, y - 4, pageWidth - margin, y - 4);

            // Clean up and normalize text to fix the letter stretching bug in jsPDF
            const cleanText = contentText
                .replace(/\r/g, '') // remove carriage returns
                .replace(/\u00A0/g, ' ') // replace non-breaking spaces with normal spaces
                .replace(/\u200B/g, '') // remove zero-width spaces
                .replace(/[\u2018\u2019]/g, "'") // replace curly single quotes
                .replace(/[\u201C\u201D]/g, '"') // replace curly double quotes
                .replace(/[\u2013\u2014]/g, '-') // replace en/em dashes
                .replace(/\u2026/g, '...'); // replace ellipses
            
            // Split by newline, trim each line, and collapse consecutive empty lines
            const rawLines = [];
            let lastWasEmpty = false;
            cleanText.split('\n').forEach(l => {
                const trimmed = l.trim();
                if (trimmed === '') {
                    if (!lastWasEmpty) {
                        rawLines.push('');
                        lastWasEmpty = true;
                    }
                } else {
                    rawLines.push(trimmed);
                    lastWasEmpty = false;
                }
            });

            const checkPageOverflow = (heightNeeded) => {
                if (y + heightNeeded > pageHeight - margin) {
                    doc.addPage();
                    y = 20; // reset y for new page

                    // Add small page header
                    doc.setFont('Helvetica', 'italic');
                    doc.setFontSize(8);
                    doc.setTextColor(150, 150, 150);
                    doc.text(`MythBrain - ${title} - ${headingText}`, margin, y - 5);
                    doc.setDrawColor(240, 235, 225);
                    doc.line(margin, y - 3, pageWidth - margin, y - 3);
                }
            };

            for (let i = 0; i < rawLines.length; i++) {
                let line = rawLines[i];
                if (line === '') {
                    checkPageOverflow(4);
                    y += 4; // Spacing for empty line
                    continue;
                }

                // Check if the line is a heading
                const isHeading = line.startsWith('###') || line.startsWith('##') || line.startsWith('#') || (line.startsWith('**') && line.endsWith('**') && line.length < 100);
                
                // Check if bullet point
                const isBullet = line.startsWith('-') || line.startsWith('*') || line.startsWith('•');

                if (isHeading) {
                    const headingClean = line.replace(/^(###|##|#|\*\*)\s*/, '').replace(/\*\*$/, '');
                    
                    checkPageOverflow(12);
                    
                    doc.setFont('Helvetica', 'bold');
                    doc.setFontSize(12);
                    doc.setTextColor(73, 55, 40);
                    doc.text(headingClean, margin, y);
                    y += 7;
                } else if (isBullet) {
                    const bulletText = line.replace(/^([-*•])\s*/, '');
                    
                    // Wrap text for bullets with indented width
                    const wrappedBullet = doc.splitTextToSize(bulletText, contentWidth - 8);
                    
                    doc.setFont('Helvetica', 'normal');
                    doc.setFontSize(10);
                    doc.setTextColor(60, 60, 60);
                    
                    // Draw wrapped bullet lines line-by-line
                    for (let j = 0; j < wrappedBullet.length; j++) {
                        checkPageOverflow(5.5);
                        if (j === 0) {
                            // Draw bullet symbol
                            doc.text('•', margin + 2, y);
                        }
                        doc.text(wrappedBullet[j], margin + 8, y);
                        y += 5.5;
                    }
                    y += 2; // Small gap between list items
                } else {
                    // Regular paragraph text
                    const paragraphText = line.replace(/\*\*/g, '');
                    const wrappedParagraph = doc.splitTextToSize(paragraphText, contentWidth);
                    
                    doc.setFont('Helvetica', 'normal');
                    doc.setFontSize(10);
                    doc.setTextColor(60, 60, 60);
                    
                    for (let j = 0; j < wrappedParagraph.length; j++) {
                        checkPageOverflow(5.5);
                        doc.text(wrappedParagraph[j], margin, y);
                        y += 5.5;
                    }
                    y += 3; // Gap between paragraphs
                }
            }

            // Save PDF
            const sanitizedTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_');
            doc.save(`${sanitizedTitle}_${type}.pdf`);

            // Close selection modal
            if (window.closeDownloadChoice) window.closeDownloadChoice();
        } else {
            showCustomToast('Error fetching recording data: ' + data.message, 'error');
        }
    } catch (err) {
        console.error(err);
        showCustomToast('An error occurred during PDF generation.', 'error');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = oldHTML;
        }
    }
}

// Custom confirmation overlay
function showCustomConfirm(title, message, onConfirm, options = {}, onCancel = null) {
    if (typeof options === 'function') {
        onCancel = options;
        options = {};
    }

    const confirmText = options.confirmText || 'Delete';
    const confirmBg = options.confirmBg || '#dc3545';
    const iconClass = options.iconClass || 'fa-solid fa-trash-can';
    const iconColor = options.iconColor || '#dc3545';
    const iconBg = options.iconBg || 'rgba(220, 80, 80, 0.1)';

    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    overlay.style = `
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 4000;
        opacity: 0;
        transition: opacity 0.2s ease;
    `;

    overlay.innerHTML = `
        <div class="confirm-card" style="
            background: var(--bg-surface-solid);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-lg);
            padding: 24px;
            max-width: 400px;
            width: 90%;
            text-align: center;
            box-shadow: var(--shadow-lg);
            transform: scale(0.9);
            transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        ">
            <div style="width: 50px; height: 50px; border-radius: 50%; background: ${iconBg}; color: ${iconColor}; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 1.5rem;">
                <i class="${iconClass}"></i>
            </div>
            <h4 style="margin-bottom: 8px; font-family: var(--font-cormorant-garamond); font-size: 1.5rem; font-weight: 700; color: var(--text-primary);">${title}</h4>
            <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 0.95rem; line-height: 1.5;">${message}</p>
            
            <div style="display: flex; gap: 12px; justify-content: center;">
                <button class="nav-btn-secondary" onclick="closeConfirm(false)" style="padding: 10px 20px; font-weight: 600; cursor: pointer; border-radius: 8px; border: 1px solid var(--border-color); background: transparent; font-size: 0.9rem;">Cancel</button>
                <button class="nav-btn" onclick="closeConfirm(true)" style="padding: 10px 20px; font-weight: 600; cursor: pointer; border-radius: 8px; background: ${confirmBg}; color: white; border: none; font-size: 0.9rem;">${confirmText}</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    setTimeout(() => {
        overlay.style.opacity = '1';
        overlay.querySelector('.confirm-card').style.transform = 'scale(1)';
    }, 10);

    window.closeConfirm = function (approved) {
        overlay.style.opacity = '0';
        overlay.querySelector('.confirm-card').style.transform = 'scale(0.9)';
        setTimeout(() => {
            overlay.remove();
            if (approved) {
                onConfirm();
            } else if (onCancel) {
                onCancel();
            }
        }, 200);
    };
}

// Custom Toast notification
function showCustomToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `custom-toast ${type}`;
    toast.style = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: var(--bg-surface-solid);
        border: 1px solid var(--border-color);
        border-left: 4px solid ${type === 'success' ? 'var(--color-primary)' : '#dc3545'};
        border-radius: var(--radius-md);
        padding: 16px 20px;
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 5000;
        transform: translateY(20px);
        opacity: 0;
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
    `;

    const icon = type === 'success'
        ? '<i class="fa-solid fa-circle-check" style="color: var(--color-primary); font-size: 1.25rem;"></i>'
        : '<i class="fa-solid fa-circle-exclamation" style="color: #dc3545; font-size: 1.25rem;"></i>';

    toast.innerHTML = `
        ${icon}
        <div style="font-size: 0.95rem; font-weight: 500; color: var(--text-primary);">${message}</div>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    }, 10);

    setTimeout(() => {
        toast.style.transform = 'translateY(20px)';
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// DOM-based HTML typewriter effect
function typewriteHTML(element, html, onComplete) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    const totalChars = temp.textContent ? temp.textContent.length : 0;
    if (totalChars === 0) {
        element.innerHTML = html;
        if (onComplete) onComplete();
        return;
    }

    let charsShown = 0;
    element.innerHTML = "";

    function cloneNodeUpTo(node, charsToShow) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.nodeValue;
            if (text.length <= charsToShow) {
                return {
                    node: document.createTextNode(text),
                    charsLeft: charsToShow - text.length
                };
            } else {
                return {
                    node: document.createTextNode(text.substring(0, charsToShow)),
                    charsLeft: 0
                };
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const clone = node.cloneNode(false);
            let currentChars = charsToShow;
            let hasClonedText = false;
            for (let child of node.childNodes) {
                if (currentChars <= 0) {
                    continue;
                }
                const res = cloneNodeUpTo(child, currentChars);
                if (res.node) {
                    clone.appendChild(res.node);
                    if (res.node.textContent && res.node.textContent.length > 0) {
                        hasClonedText = true;
                    }
                }
                currentChars = res.charsLeft;
            }
            
            // If this element originally contains text, but none of its text was cloned, do not render it yet
            if (node.textContent && node.textContent.trim() !== "" && !hasClonedText) {
                return { node: null, charsLeft: charsToShow };
            }
            
            return {
                node: clone,
                charsLeft: currentChars
            };
        }
        return { node: null, charsLeft: charsToShow };
    }

    function tick() {
        if (charsShown > totalChars) {
            element.innerHTML = html;
            if (onComplete) onComplete();
            return;
        }

        const res = cloneNodeUpTo(temp, charsShown);
        if (res.node) {
            element.innerHTML = "";
            while (res.node.firstChild) {
                element.appendChild(res.node.firstChild);
            }
        }

        const historyNode = element.closest('.chat-message-list');
        if (historyNode) {
            historyNode.scrollTop = historyNode.scrollHeight;
        }

        charsShown += 2;
        setTimeout(tick, 12);
    }

    tick();
}