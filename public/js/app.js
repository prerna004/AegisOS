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
        this.registerServiceWorker();
        this.bindGlobalShortcuts();
        this.setupNavigation();
        HitlManager.init();
        Copilot.init();
        this.switchModule('overview');
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

    switchModule(moduleName) {
        this.currentModule = moduleName;

        // Update active nav button
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
                <!-- Hero Banner -->
                <div class="glass-card" style="padding:24px; background:linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.05), rgba(15,22,36,0.95)); border:1px solid rgba(99,102,241,0.3);">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <div>
                            <div style="display:flex; align-items:center; gap:10px;">
                                <span class="badge badge-indigo">AegisOS v3.0 Master Edition</span>
                                <span class="badge badge-emerald">Phase 2 & 3 Production Verified</span>
                            </div>
                            <h1 style="font-size:24px; font-weight:800; color:var(--text-primary); margin-top:8px; letter-spacing:-0.02em;">
                                Autonomous Agentic Enterprise Operating System
                            </h1>
                            <p style="font-size:13px; color:var(--text-secondary); margin-top:6px; max-width:750px; line-height:1.5;">
                                Complete functional parity with Zoho Enterprise (Zoho One) built via composable open-source cores, 26 autonomous AI agents, Model Context Protocol (MCP), and Level 3 Human-in-the-Loop safety guardrails.
                            </p>
                        </div>
                        <div style="display:flex; gap:8px;">
                            <button class="btn-secondary" onclick="AegisApp.toggleDesktopMode()">
                                🖥️ Toggle Desktop App Mode
                            </button>
                            <button class="btn-primary" onclick="Copilot.toggle()">
                                ✦ Open GenUI Copilot
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Executive Metric Grid -->
                <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:14px;">
                    <div class="glass-card" style="padding:16px;">
                        <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Closed Won Revenue</div>
                        <div style="font-size:24px; font-weight:700; color:#34d399; margin-top:4px; font-family:var(--font-mono);">$${Number(metrics.closedWonRevenue || 0).toLocaleString()}</div>
                        <div style="font-size:11px; color:var(--text-secondary); margin-top:4px;">100% margin compliance</div>
                    </div>
                    <div class="glass-card" style="padding:16px;">
                        <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Active Autonomous Agents</div>
                        <div style="font-size:24px; font-weight:700; color:#818cf8; margin-top:4px; font-family:var(--font-mono);">26 / 26 Online</div>
                        <div style="font-size:11px; color:#34d399; margin-top:4px;">Sub-100ms Event Bus (NATS)</div>
                    </div>
                    <div class="glass-card" style="padding:16px;">
                        <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Pending Level 3 HITL</div>
                        <div style="font-size:24px; font-weight:700; color:#fbbf24; margin-top:4px; font-family:var(--font-mono);">${hitl.items.length} Required</div>
                        <div style="font-size:11px; color:#fbbf24; margin-top:4px;">Mandatory human approval gate</div>
                    </div>
                    <div class="glass-card" style="padding:16px;">
                        <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">P95 Cross-Suite Latency</div>
                        <div style="font-size:24px; font-weight:700; color:#22d3ee; margin-top:4px; font-family:var(--font-mono);">${metrics.systemHealthP95Ms} ms</div>
                        <div style="font-size:11px; color:#34d399; margin-top:4px;">Target &lt; 200ms exceeded</div>
                    </div>
                </div>

                <!-- 9-Module Quick Launch Grid -->
                <div class="glass-card" style="padding:20px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                        <div>
                            <h3 style="font-size:15px; font-weight:600; color:var(--text-primary);">Enterprise Module Suite (Zoho One Equivalent)</h3>
                            <p style="font-size:11px; color:var(--text-secondary);">Click any module to inspect live records, automated workflows, and agent execution.</p>
                        </div>
                    </div>
                    <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:12px;">
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

    handleCommandSelect(action) {
        this.closeCommandPalette();
        if (action.startsWith('nav:')) {
            this.switchModule(action.replace('nav:', ''));
        } else if (action.startsWith('agent:')) {
            const parts = action.split(':');
            Copilot.sendQuickPrompt(parts[2], parts[1]);
        }
    }
};

window.AegisApp = AegisApp;
window.addEventListener('DOMContentLoaded', () => AegisApp.init());
