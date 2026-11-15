// ============================================================================
// AegisOS: Core Application Shell & Router
// Manages:
// - Navigation across all 9 Modules (A through I)
// - Global Command Palette (Cmd+K / Ctrl+K)
// - Desktop Mode Frame Toggle (Window Controls, Titlebar)
// - PWA Installation & Service Worker registration
// ============================================================================

const AegisApp = {
    currentModule: 'overview',
    isDesktopMode: false,

    init() {
        console.log('[AegisOS] Booting Single-Pane Enterprise UI Shell...');
        this.initTheme();
        this.registerServiceWorker();

        // Enforce Enterprise Zero-Trust Admin Authentication Gate
        if (window.AegisSecurity) {
            const isAuthed = window.AegisSecurity.init();
            if (!isAuthed) {
                console.log('[AegisOS] Waiting for Administrator Authentication...');
                return;
            }
        }

        this.bindGlobalShortcuts();
        this.setupNavigation();
        this.bindTopBarsScrolling();
        HitlManager.init();
        Copilot.init();
        this.switchModule('overview');
    },

    scrollEvaluatorBar(offset) {
        const bar = document.getElementById('evaluator-top-bar');
        if (bar) {
            bar.scrollBy({ left: offset, behavior: 'smooth' });
        }
    },

    bindTopBarsScrolling() {
        // Enable mouse wheel horizontal scrolling on Evaluator Bar
        const evalBar = document.getElementById('evaluator-top-bar');
        if (evalBar && !evalBar.dataset.wheelBound) {
            evalBar.dataset.wheelBound = 'true';
            evalBar.addEventListener('wheel', (e) => {
                if (e.deltaY !== 0) {
                    e.preventDefault();
                    evalBar.scrollBy({ left: e.deltaY * 1.5, behavior: 'auto' });
                }
            }, { passive: false });
        }

        // Enable mouse wheel horizontal scrolling on Header Actions
        const headerActions = document.getElementById('header-actions');
        if (headerActions && !headerActions.dataset.wheelBound) {
            headerActions.dataset.wheelBound = 'true';
            headerActions.addEventListener('wheel', (e) => {
                if (e.deltaY !== 0) {
                    e.preventDefault();
                    headerActions.scrollBy({ left: e.deltaY * 1.5, behavior: 'auto' });
                }
            }, { passive: false });
        }
    },

    initTheme() {
        const saved = localStorage.getItem('aegis-theme') || 'dark';
        document.documentElement.setAttribute('data-theme', saved);
        const btn = document.getElementById('theme-toggle-btn');
        if (btn) btn.innerHTML = saved === 'dark' ? '☀️ Mode' : '🌙 Mode';
    },

    toggleTheme() {
        const html = document.documentElement;
        const current = html.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('aegis-theme', next);
        const btn = document.getElementById('theme-toggle-btn');
        if (btn) btn.innerHTML = next === 'dark' ? '☀️ Mode' : '🌙 Mode';
        HitlManager.showToast(`Switched to ${next.toUpperCase()} theme`, 'indigo');
    },

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(() => console.log('[PWA] Service Worker active for Desktop Installability.'))
                .catch(err => console.warn('[PWA] Service Worker registration failed:', err));
        }
    },

    bindGlobalShortcuts() {
        window.addEventListener('keydown', (e) => {
            // Cmd+K or Ctrl+K triggers command palette
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                this.toggleCommandPalette();
            }
            // Escape closes modals
            if (e.key === 'Escape') {
                this.closeCommandPalette();
                const memModal = document.getElementById('memory-modal');
                if (memModal) memModal.remove();
            }
        });
    },

    setupNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const mod = item.dataset.module;
                if (mod) this.switchModule(mod);
            });
        });
    },

    toggleMobileSidebar() {
        const sidebar = document.getElementById('app-sidebar');
        const backdrop = document.getElementById('sidebar-backdrop');
        if (sidebar && backdrop) {
            const isOpen = sidebar.classList.toggle('mobile-open');
            backdrop.classList.toggle('active', isOpen);
        }
    },

    closeMobileSidebar() {
        const sidebar = document.getElementById('app-sidebar');
        const backdrop = document.getElementById('sidebar-backdrop');
        if (sidebar) sidebar.classList.remove('mobile-open');
        if (backdrop) backdrop.classList.remove('active');
    },

    switchModule(moduleName) {
        this.currentModule = moduleName;
        this.closeMobileSidebar();

        // Update active bottom nav button (Mobile)
        document.querySelectorAll('.mob-nav-item').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.module === moduleName);
        });

        // Update active nav button (Desktop Sidebar)
        document.querySelectorAll('.nav-item').forEach(item => {
            if (item.dataset.module === moduleName) {
                item.classList.add('active');
                item.style.backgroundColor = 'rgba(99, 102, 241, 0.15)';
                item.style.color = '#818cf8';
                item.style.borderLeft = '3px solid #6366f1';
            } else {
                item.classList.remove('active');
                item.style.backgroundColor = 'transparent';
                item.style.color = 'var(--text-secondary)';
                item.style.borderLeft = '3px solid transparent';
            }
        });

        const container = document.getElementById('module-content-area');
        if (!container) return;
        container.innerHTML = `<div style="text-align:center; padding:50px; color:var(--text-muted);">Loading ${moduleName}...</div>`;

        switch (moduleName) {
            case 'overview':
                this.renderOverview(container);
                break;
            case 'crm':
                CrmModule.render(container);
                break;
            case 'marketing':
                MarketingModule.render(container);
                break;
            case 'support':
                SupportModule.render(container);
                break;
            case 'finance':
                FinanceModule.render(container);
                break;
            case 'hr':
                HrModule.render(container);
                break;
            case 'collab':
                CollabModule.render(container);
                break;
            case 'projects':
                ProjectsModule.render(container);
                break;
            case 'itsm':
                ItsmModule.render(container);
                break;
            case 'analytics':
                AnalyticsModule.render(container);
                break;
            case 'agents':
                AgentsViewModule.render(container);
                break;
            case 'developer':
                DeveloperModule.render(container);
                break;
            default:
                this.renderOverview(container);
        }
    },

    refreshCurrentView() {
        this.switchModule(this.currentModule);
    },

    async renderOverview(container) {
        const [metricsRes, pendingHitlRes, auditStatsRes] = await Promise.all([
            fetch('/api/bi/metrics').then(r => r.json()),
            fetch('/api/hitl/pending').then(r => r.json()),
            fetch('/api/audit/stats').then(r => r.json())
        ]);

        const metrics = metricsRes || {};
        const hitl = pendingHitlRes || { items: [] };
        const audit = auditStatsRes || {};

        container.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:20px;">
                <!-- 1. Friendly Hero Banner -->
                <div class="glass-card" style="padding:24px; background:linear-gradient(135deg, rgba(99,102,241,0.12), rgba(6,182,212,0.06), rgba(15,22,36,0.98)); border:1px solid rgba(99,102,241,0.35);">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px;">
                        <div>
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span class="badge badge-indigo">AegisOS Enterprise 3.0</span>
                                <span class="badge badge-emerald">All-in-One Business Operating System</span>
                            </div>
                            <h1 style="font-size:24px; font-weight:800; color:#ffffff; margin-top:8px; letter-spacing:-0.02em;">
                                One Central Control Room for Your Entire Business
                            </h1>
                            <p style="font-size:13px; color:#cbd5e1; margin-top:6px; max-width:820px; line-height:1.6;">
                                We replaced <strong>45 separate expensive applications (like Zoho CRM, Invoices, and HR)</strong> with <strong>ONE single system and ONE shared database</strong>. <strong>26 autonomous AI robot helpers</strong> handle all your repetitive sales research, invoice matching, customer tickets, and project tracking automatically!
                            </p>
                        </div>
                        <div style="display:flex; gap:10px; align-items:center;">
                            <button class="btn-secondary" style="background:rgba(245,158,11,0.12); border-color:rgba(245,158,11,0.4); color:#fbbf24; font-weight:700;" onclick="AegisApp.toggleExplainerModal()">
                                💡 Explain This Screen
                            </button>
                            <button id="hero-copilot-btn" class="btn-primary" onclick="Copilot.toggle()">
                                ✦ Open AI Assistant
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 2. Plain-English "What is Zoho & What Are We Doing?" Explainer Card -->
                <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 18px 22px;">
                    <div style="font-size: 11px; font-weight: 700; color: #818cf8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">
                        📖 First-Time Evaluator Guide: What is this project & what is Zoho?
                    </div>
                    <div class="cards-grid-3" style="margin-top:10px;">
                        <div style="background:rgba(255,255,255,0.02); padding:12px; border-radius:8px; border-left:3px solid #f59e0b;">
                            <strong style="color:#fbbf24; font-size:13px;">1. What is Zoho?</strong>
                            <p style="font-size:12px; color:#94a3b8; margin-top:4px; line-height:1.5;">
                                <strong>Zoho</strong> is a tech giant that sells 45+ separate business apps (Zoho CRM for sales, Zoho Books for invoices, Zoho Desk for support). Companies pay <strong>$100k+/year</strong>, and workers waste half their day copy-pasting numbers between 45 tabs.
                            </p>
                        </div>
                        <div style="background:rgba(255,255,255,0.02); padding:12px; border-radius:8px; border-left:3px solid #34d399;">
                            <strong style="color:#34d399; font-size:13px;">2. What is AegisOS Doing?</strong>
                            <p style="font-size:12px; color:#94a3b8; margin-top:4px; line-height:1.5;">
                                We took all 45 apps and united them into <strong>ONE single application with ONE database</strong>. When a sales deal is won, the invoice and project tasks are created automatically in 15 milliseconds.
                            </p>
                        </div>
                        <div style="background:rgba(255,255,255,0.02); padding:12px; border-radius:8px; border-left:3px solid #38bdf8;">
                            <strong style="color:#38bdf8; font-size:13px;">3. What Are We Saving?</strong>
                            <p style="font-size:12px; color:#94a3b8; margin-top:4px; line-height:1.5;">
                                • <strong>Saving Money:</strong> $0 subscription costs.<br>
                                • <strong>Saving Time:</strong> AI automates 40% of manual data entry.<br>
                                • <strong>Saving Safety:</strong> Level 3 safety brakes stop unauthorized discounts.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- 3. The 4 Figures Explained in Crystal-Clear Plain English -->
                <div>
                    <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">
                        📊 What Do These 4 Figures Mean? (Live Company Metrics)
                    </div>
                    <div class="kpi-grid">
                        <!-- Figure 1: Revenue -->
                        <div class="glass-card" style="padding:16px; border-top: 3px solid #34d399;">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span style="font-size:10px; color:#34d399; font-weight:700; text-transform:uppercase;">Confirmed Sales Revenue</span>
                                <span style="font-size:14px;">💰</span>
                            </div>
                            <div style="font-size:24px; font-weight:800; color:#34d399; margin-top:6px; font-family:var(--font-mono);">$${Number(metrics.closedWonRevenue || 0).toLocaleString()}</div>
                            <div style="font-size:11px; color:#e2e8f0; margin-top:4px; font-weight:600;">Client contracts won this month</div>
                            <div style="font-size:10px; color:var(--text-muted); margin-top:4px; line-height:1.4;">
                                3 enterprise deals closed. The AI automatically created invoices & contracts without human typing!
                            </div>
                        </div>

                        <!-- Figure 2: Active Agents -->
                        <div class="glass-card" style="padding:16px; border-top: 3px solid #818cf8;">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span style="font-size:10px; color:#818cf8; font-weight:700; text-transform:uppercase;">AI Robot Helpers</span>
                                <span style="font-size:14px;">🤖</span>
                            </div>
                            <div style="font-size:24px; font-weight:800; color:#818cf8; margin-top:6px; font-family:var(--font-mono);">26 / 26 Active</div>
                            <div style="font-size:11px; color:#e2e8f0; margin-top:4px; font-weight:600;">Autonomous agents online</div>
                            <div style="font-size:10px; color:var(--text-muted); margin-top:4px; line-height:1.4;">
                                26 specialized digital workers handling sales research, invoice matching, support, and HR 24/7.
                            </div>
                        </div>

                        <!-- Figure 3: Safety Approvals -->
                        <div class="glass-card" style="padding:16px; border-top: 3px solid #fbbf24;">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span style="font-size:10px; color:#fbbf24; font-weight:700; text-transform:uppercase;">Safety Brake (HITL)</span>
                                <span style="font-size:14px;">🛡️</span>
                            </div>
                            <div style="font-size:24px; font-weight:800; color:#fbbf24; margin-top:6px; font-family:var(--font-mono);">${hitl.items.length} Deal Paused</div>
                            <div style="font-size:11px; color:#e2e8f0; margin-top:4px; font-weight:600;">Needs manager approval</div>
                            <div style="font-size:10px; color:var(--text-muted); margin-top:4px; line-height:1.4;">
                                A quote requested a 12% discount. The AI stopped the deal until a human manager clicks 'Approve'!
                            </div>
                        </div>

                        <!-- Figure 4: System Speed -->
                        <div class="glass-card" style="padding:16px; border-top: 3px solid #22d3ee;">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span style="font-size:10px; color:#22d3ee; font-weight:700; text-transform:uppercase;">System Response Speed</span>
                                <span style="font-size:14px;">⚡</span>
                            </div>
                            <div style="font-size:24px; font-weight:800; color:#22d3ee; margin-top:6px; font-family:var(--font-mono);">${metrics.systemHealthP95Ms} ms</div>
                            <div style="font-size:11px; color:#e2e8f0; margin-top:4px; font-weight:600;">Sub-100ms real-time sync</div>
                            <div style="font-size:10px; color:var(--text-muted); margin-top:4px; line-height:1.4;">
                                Faster than a heartbeat. When a sales deal closes, the invoice and project update in 38ms!
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 4. Quick 3-Step Guided Tour -->
                <div style="background: rgba(99, 102, 241, 0.05); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 12px; padding: 18px 22px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                        <div>
                            <strong style="color:#ffffff; font-size:14px;">🎯 Try AegisOS in 3 Quick Clicks:</strong>
                            <p style="font-size:11px; color:var(--text-secondary); margin-top:2px;">Anyone can test the entire system without technical knowledge.</p>
                        </div>
                    </div>
                    <div class="cards-grid-3">
                        <div class="glass-card" style="padding:14px; cursor:pointer; background:rgba(255,255,255,0.03);" onclick="AegisApp.switchModule('crm')">
                            <div style="font-size:11px; color:#818cf8; font-weight:700;">STEP 1: SEE SALES & DEALS</div>
                            <div style="font-weight:700; font-size:13px; color:#fff; margin-top:4px;">💼 Click: A: Sales & CRM</div>
                            <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">
                                View potential clients, deal pipelines, travel route maps, and digital contracts.
                            </div>
                        </div>

                        <div class="glass-card" style="padding:14px; cursor:pointer; background:rgba(255,255,255,0.03);" onclick="Copilot.toggle()">
                            <div style="font-size:11px; color:#38bdf8; font-weight:700;">STEP 2: TALK TO THE AI</div>
                            <div style="font-weight:700; font-size:13px; color:#fff; margin-top:4px;">✦ Click: Copilot Drawer</div>
                            <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">
                                Ask the AI: <em>"What is Zoho?"</em> or click <em>"Enrich Elena Dynamics"</em> to watch it research a company!
                            </div>
                        </div>

                        <div class="glass-card" style="padding:14px; cursor:pointer; background:rgba(255,255,255,0.03);" onclick="AegisApp.switchModule('crm')">
                            <div style="font-size:11px; color:#fbbf24; font-weight:700;">STEP 3: TEST SAFETY BRAKE</div>
                            <div style="font-weight:700; font-size:13px; color:#fff; margin-top:4px;">🔔 Click: Review HITL Approval</div>
                            <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">
                                Experience how human managers approve or deny high-risk discounts to protect company money.
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 5. 9-Module Quick Launch Grid -->
                <div class="glass-card" style="padding:20px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                        <div>
                            <h3 style="font-size:15px; font-weight:700; color:var(--text-primary);">The 9 Enterprise Departments Replaced</h3>
                            <p style="font-size:11px; color:var(--text-secondary);">Click any department below to view its records, automated workflows, and active AI agents.</p>
                        </div>
                    </div>
                    <div class="cards-grid-3">
                        <div class="glass-card" style="padding:14px; background:rgba(255,255,255,0.02); cursor:pointer;" onclick="AegisApp.switchModule('crm')">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <strong style="color:var(--text-primary); font-size:13px;">💼 Sales, CRM & Revenue</strong>
                                <span class="badge badge-indigo">Group A</span>
                            </div>
                            <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">Replaces: Zoho CRM, Bigin, RouteIQ, Sign, Bookings</div>
                            <div style="font-size:10px; color:#34d399; margin-top:8px;">4 Agents: Lead Scoring, SDR, CPQ, Pipeline Forecast</div>
                        </div>

                        <div class="glass-card" style="padding:14px; background:rgba(255,255,255,0.02); cursor:pointer;" onclick="AegisApp.switchModule('marketing')">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <strong style="color:var(--text-primary); font-size:13px;">📣 Marketing & Customer Exp.</strong>
                                <span class="badge badge-indigo">Group B</span>
                            </div>
                            <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">Replaces: Campaigns, Social, PageSense, Forms</div>
                            <div style="font-size:10px; color:#34d399; margin-top:8px;">3 Agents: Campaign Orchestrator, CRO, Social Listening</div>
                        </div>

                        <div class="glass-card" style="padding:14px; background:rgba(255,255,255,0.02); cursor:pointer;" onclick="AegisApp.switchModule('support')">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <strong style="color:var(--text-primary); font-size:13px;">🎧 Service & Support</strong>
                                <span class="badge badge-indigo">Group C</span>
                            </div>
                            <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">Replaces: Zoho Desk, SalesIQ, Assist, Lens</div>
                            <div style="font-size:10px; color:#34d399; margin-top:8px;">3 Agents: Tier-1/2 Resolver, Churn Escalation, Auto-KB</div>
                        </div>

                        <div class="glass-card" style="padding:14px; background:rgba(255,255,255,0.02); cursor:pointer;" onclick="AegisApp.switchModule('finance')">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <strong style="color:var(--text-primary); font-size:13px;">💰 Finance, ERP & Supply Chain</strong>
                                <span class="badge badge-indigo">Group D</span>
                            </div>
                            <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">Replaces: Books, Invoice, Inventory, Expense</div>
                            <div style="font-size:10px; color:#34d399; margin-top:8px;">3 Agents: Bookkeeper, Receipt OCR, Demand Forecast</div>
                        </div>

                        <div class="glass-card" style="padding:14px; background:rgba(255,255,255,0.02); cursor:pointer;" onclick="AegisApp.switchModule('hr')">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <strong style="color:var(--text-primary); font-size:13px;">👥 HR & Workplace Culture</strong>
                                <span class="badge badge-indigo">Group E</span>
                            </div>
                            <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">Replaces: Zoho People, Recruit, Connect</div>
                            <div style="font-size:10px; color:#34d399; margin-top:8px;">3 Agents: AI Recruiter, HR Concierge, Provisioning</div>
                        </div>

                        <div class="glass-card" style="padding:14px; background:rgba(255,255,255,0.02); cursor:pointer;" onclick="AegisApp.switchModule('collab')">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <strong style="color:var(--text-primary); font-size:13px;">💬 Collaboration Suite</strong>
                                <span class="badge badge-indigo">Group F</span>
                            </div>
                            <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">Replaces: Mail, Cliq, WorkDrive, Meeting, Vault</div>
                            <div style="font-size:10px; color:#34d399; margin-top:8px;">3 Agents: Meeting Scribe, Inbox Triage, Doc Synthesis</div>
                        </div>

                        <div class="glass-card" style="padding:14px; background:rgba(255,255,255,0.02); cursor:pointer;" onclick="AegisApp.switchModule('projects')">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <strong style="color:var(--text-primary); font-size:13px;">🎯 Project Management</strong>
                                <span class="badge badge-indigo">Group G</span>
                            </div>
                            <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">Replaces: Zoho Projects, Sprints, BugTracker</div>
                            <div style="font-size:10px; color:#34d399; margin-top:8px;">3 Agents: Scrum Master, Blocker Predictor, Standup Digest</div>
                        </div>

                        <div class="glass-card" style="padding:14px; background:rgba(255,255,255,0.02); cursor:pointer;" onclick="AegisApp.switchModule('itsm')">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <strong style="color:var(--text-primary); font-size:13px;">🛡️ ITSM & Endpoint MDM</strong>
                                <span class="badge badge-indigo">Group H</span>
                            </div>
                            <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">Replaces: ServiceDesk Plus, Endpoint Central</div>
                            <div style="font-size:10px; color:#34d399; margin-top:8px;">2 Agents: Autonomous Helpdesk, License Optimizer</div>
                        </div>

                        <div class="glass-card" style="padding:14px; background:rgba(255,255,255,0.02); cursor:pointer;" onclick="AegisApp.switchModule('analytics')">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <strong style="color:var(--text-primary); font-size:13px;">📊 BI & Low-Code iPaaS</strong>
                                <span class="badge badge-indigo">Group I</span>
                            </div>
                            <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">Replaces: Zoho Analytics, Creator, Flow</div>
                            <div style="font-size:10px; color:#34d399; margin-top:8px;">2 Agents: Conversational Data Scientist, Workflow Builder</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (window.Copilot && window.Copilot.updateButtonStates) {
            window.Copilot.updateButtonStates();
        }
    },

    toggleDesktopMode() {
        this.isDesktopMode = !this.isDesktopMode;
        const titlebar = document.getElementById('desktop-titlebar');
        if (titlebar) {
            titlebar.classList.toggle('active', this.isDesktopMode);
        }
        HitlManager.showToast(`Desktop Mode Frame ${this.isDesktopMode ? 'Enabled' : 'Disabled'}`, 'cyan');
    },

    toggleCommandPalette() {
        const box = document.getElementById('command-palette-backdrop');
        if (box) {
            box.classList.toggle('active');
            if (box.classList.contains('active')) {
                const input = document.getElementById('cmd-input');
                if (input) {
                    input.value = '';
                    input.focus();
                }
            }
        }
    },

    closeCommandPalette() {
        const box = document.getElementById('command-palette-backdrop');
        if (box) box.classList.remove('active');
    },

    toggleExplainerModal() {
        if (window.Explainer) {
            window.Explainer.openWhatAmILookingAt(this.currentModule);
        }
    },

    toggleInterviewerGuide() {
        if (window.Explainer) {
            window.Explainer.openInterviewerMode();
        }
    },

    handleCommandSelect(action) {
        this.closeCommandPalette();
        if (action === 'action:explainer') {
            this.toggleExplainerModal();
        } else if (action === 'action:interview') {
            this.toggleInterviewerGuide();
        } else if (action.startsWith('nav:')) {
            this.switchModule(action.replace('nav:', ''));
        } else if (action.startsWith('agent:')) {
            const parts = action.split(':');
            Copilot.sendQuickPrompt(parts[2], parts[1]);
        }
    }
};

window.AegisApp = AegisApp;
window.addEventListener('DOMContentLoaded', () => AegisApp.init());
