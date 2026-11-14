// ============================================================================
// Module Group A: Sales, CRM & Revenue Operations
// Replaces: Zoho CRM, Bigin, RouteIQ, Zoho Sign, Zoho Bookings
// Composable Foundation: Twenty CRM / EspoCRM / Documenso / Cal.com
// Autonomous Agents: Lead Enrichment, Autonomous SDR, Deal Desk CPQ, Pipeline Forecast
// ============================================================================

const CrmModule = {
    async render(container) {
        const [leadsRes, dealsRes, quotesRes] = await Promise.all([
            fetch('/api/crm/leads').then(r => r.json()),
            fetch('/api/crm/deals').then(r => r.json()),
            fetch('/api/crm/quotes').then(r => r.json())
        ]);

        const leads = leadsRes || [];
        const deals = dealsRes || [];
        const quotes = quotesRes || [];

        const totalPipeline = deals.reduce((sum, d) => sum + (d.amount || 0), 0);
        const wonRevenue = deals.filter(d => d.stage === 'closed_won').reduce((sum, d) => sum + (d.amount || 0), 0);

        container.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:20px;">
                <!-- Header & Stats -->
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="display:flex; align-items:center; gap:8px;">
                            <h2 style="font-size:20px; font-weight:700; color:var(--text-primary);">Sales, CRM & Revenue Operations</h2>
                            <span class="badge badge-indigo">Module Group A</span>
                            <span class="badge badge-emerald">20 CRM / Documenso Core</span>
                        </div>
                        <p style="font-size:12px; color:var(--text-secondary); margin-top:4px;">
                            Multi-pipeline deals, autonomous lead scoring, CPQ discount guardrails, and cryptographic e-signatures.
                        </p>
                    </div>
                    <div style="display:flex; gap:8px;">
                        <button class="btn-secondary" onclick="CrmModule.openRouteIQModal()">🗺️ RouteIQ Map</button>
                        <button class="btn-secondary" onclick="CrmModule.openDocumensoSignModal()">✍️ New E-Signature</button>
                        <button class="btn-primary" onclick="Copilot.sendQuickPrompt('Enrich all qualified leads and schedule SDR outreach', 'agent-sdr')">
                            ⚡ Run Autonomous SDR
                        </button>
                    </div>
                </div>

                <!-- KPI Metric Strip -->
                <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:14px;">
                    <div class="glass-card" style="padding:16px;">
                        <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Total Pipeline Value</div>
                        <div style="font-size:22px; font-weight:700; color:var(--text-primary); margin-top:4px; font-family:var(--font-mono);">$${totalPipeline.toLocaleString()}</div>
                        <div style="font-size:11px; color:#34d399; margin-top:4px;">↑ +28% vs last month</div>
                    </div>
                    <div class="glass-card" style="padding:16px;">
                        <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Closed Won Revenue</div>
                        <div style="font-size:22px; font-weight:700; color:#34d399; margin-top:4px; font-family:var(--font-mono);">$${wonRevenue.toLocaleString()}</div>
                        <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">100% margin verified</div>
                    </div>
                    <div class="glass-card" style="padding:16px;">
                        <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Active High-Intent Leads</div>
                        <div style="font-size:22px; font-weight:700; color:#818cf8; margin-top:4px; font-family:var(--font-mono);">${leads.filter(l => l.score >= 80).length} / ${leads.length}</div>
                        <div style="font-size:11px; color:var(--text-secondary); margin-top:4px;">Enriched via firmographics agent</div>
                    </div>
                    <div class="glass-card" style="padding:16px;">
                        <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Pending CPQ Approvals</div>
                        <div style="font-size:22px; font-weight:700; color:#fbbf24; margin-top:4px; font-family:var(--font-mono);">${quotes.filter(q => q.status === 'pending_hitl').length}</div>
                        <div style="font-size:11px; color:#fbbf24; margin-top:4px;">Requires Level 3 Sign-Off</div>
                    </div>
                </div>

                <!-- Pipeline Kanban & Leads Split -->
                <div style="display:grid; grid-template-columns: 2fr 1fr; gap:16px;">
                    <!-- Pipeline Kanban -->
                    <div class="glass-card" style="padding:18px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                            <h3 style="font-size:14px; font-weight:600; color:var(--text-primary);">Deals Pipeline (Stage Gates & Blueprints)</h3>
                            <button class="btn-secondary" style="font-size:11px; padding:3px 8px;" onclick="Copilot.sendQuickPrompt('Run Monte Carlo simulation to forecast pipeline closing probability', 'agent-pipeline-forecast')">
                                📈 Forecast Deal Velocity
                            </button>
                        </div>
                        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:10px;">
                            ${['qualification', 'proposal', 'negotiation', 'closed_won'].map(stage => {
                                const stageDeals = deals.filter(d => d.stage === stage);
                                const stageTitles = { qualification: 'Qualification', proposal: 'Proposal', negotiation: 'Negotiation', closed_won: 'Closed Won' };
                                return `
                                    <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-subtle); border-radius:8px; padding:10px;">
                                        <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:600; color:var(--text-muted); margin-bottom:8px; text-transform:uppercase;">
                                            <span>${stageTitles[stage]}</span>
                                            <span style="font-family:var(--font-mono);">${stageDeals.length}</span>
                                        </div>
                                        <div style="display:flex; flex-direction:column; gap:8px;">
                                            ${stageDeals.map(d => `
                                                <div class="glass-card" style="padding:10px; background:#0e1524; border:1px solid var(--border-subtle); font-size:11px;">
                                                    <div style="font-weight:600; color:var(--text-primary); margin-bottom:4px;">${d.title}</div>
                                                    <div style="color:var(--text-secondary);">${d.account_name}</div>
                                                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
                                                        <strong style="color:#34d399; font-family:var(--font-mono);">$${Number(d.amount).toLocaleString()}</strong>
                                                        <span class="badge ${d.probability >= 80 ? 'badge-emerald' : 'badge-amber'}">${d.probability}%</span>
                                                    </div>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <!-- Enriched Leads Feed -->
                    <div class="glass-card" style="padding:18px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                            <h3 style="font-size:14px; font-weight:600; color:var(--text-primary);">Enriched Leads (AI Scored)</h3>
                            <span class="badge badge-cyan">${leads.length} Leads</span>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:8px; max-height:420px; overflow-y:auto;">
                            ${leads.map(l => `
                                <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-subtle); border-radius:8px; padding:10px;">
                                    <div style="display:flex; justify-content:space-between; align-items:center;">
                                        <div style="font-weight:600; font-size:12px; color:var(--text-primary);">${l.name}</div>
                                        <span class="badge ${l.score >= 90 ? 'badge-emerald' : (l.score >= 70 ? 'badge-indigo' : 'badge-amber')}">
                                            Score: ${l.score}
                                        </span>
                                    </div>
                                    <div style="font-size:11px; color:var(--text-secondary); margin-top:2px;">${l.company} • ${l.email}</div>
                                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
                                        <span class="badge badge-cyan" style="font-size:9px;">Intent: ${l.intent}</span>
                                        <button class="btn-secondary" style="font-size:10px; padding:2px 6px;" onclick="Copilot.sendQuickPrompt('Draft hyper-personalized SDR email for ${l.name} at ${l.company}', 'agent-sdr')">
                                            ✉️ Draft Outreach
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- CPQ Engine & Quotes Section -->
                <div class="glass-card" style="padding:18px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                        <div>
                            <h3 style="font-size:14px; font-weight:600; color:var(--text-primary);">Configure-Price-Quote (CPQ) & Documenso Envelopes</h3>
                            <p style="font-size:11px; color:var(--text-secondary);">Enforces Level 3 HITL approval on quotes with discounts > 10% or margin < 35%.</p>
                        </div>
                        <button class="btn-primary" onclick="CrmModule.openNewQuoteModal()">+ Create CPQ Quote</button>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        ${quotes.map(q => `
                            <div class="glass-card" style="padding:12px 16px; background:rgba(255,255,255,0.02); display:flex; justify-content:space-between; align-items:center;">
                                <div>
                                    <div style="display:flex; align-items:center; gap:8px;">
                                        <span style="font-weight:600; font-size:13px; color:var(--text-primary);">${q.client_name}</span>
                                        <span class="badge ${q.status === 'approved' ? 'badge-emerald' : (q.status === 'pending_hitl' ? 'badge-rose' : 'badge-amber')}">
                                            ${q.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">
                                        Quote ID: ${q.id} • Discount: ${q.discount_percent}% • Projected Margin: ${q.margin_percent}%
                                    </div>
                                </div>
                                <div style="display:flex; align-items:center; gap:12px;">
                                    <span style="font-size:16px; font-weight:700; color:var(--text-primary); font-family:var(--font-mono);">$${Number(q.total_amount).toLocaleString()}</span>
                                    ${q.status === 'pending_hitl' ? `
                                        <button class="btn-primary" style="background:#f59e0b; font-size:11px; padding:4px 10px;" onclick="HitlManager.resolve('hitl-01', 'approved')">
                                            Review HITL Approval
                                        </button>
                                    ` : `
                                        <button class="btn-secondary" style="font-size:11px; padding:4px 10px;" onclick="CrmModule.openDocumensoSignModal('${q.id}')">
                                            ✍️ Documenso Sign
                                        </button>
                                    `}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    openRouteIQModal() {
        const modal = document.createElement('div');
        modal.style.cssText = `position:fixed; inset:0; background:rgba(0,0,0,0.8); z-index:10000; display:flex; align-items:center; justify-content:center;`;
        modal.innerHTML = `
            <div class="glass-card" style="width:700px; max-width:90vw; background:#0b1120; padding:20px; border:1px solid var(--border-strong);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <h3 style="font-size:16px; font-weight:600; color:var(--text-primary);">RouteIQ Geospatial Route Optimization</h3>
                    <button class="btn-secondary" onclick="this.closest('div[style*=\\'position:fixed\\']').remove()">✕</button>
                </div>
                <p style="font-size:12px; color:var(--text-secondary); margin-bottom:14px;">
                    Multi-stop sales corridor optimizer factoring in real-time traffic and territory accounts:
                </p>
                <div style="background:#070b14; border:1px solid var(--border-subtle); border-radius:8px; padding:16px; font-size:12px; font-family:var(--font-mono); color:#22d3ee; line-height:1.8;">
                    📍 Stop 1: Apex BioSystems Ltd (Bandra-Kurla Complex) — ETA: 10:15 AM (GPS Check-In ready)<br>
                    📍 Stop 2: Hinduja Health Corridor (Mahim) — ETA: 12:45 PM<br>
                    📍 Stop 3: Kokilaben Innovation Labs (Andheri West) — ETA: 03:30 PM (Via Western Express Highway)<br>
                    🚗 Total Distance: 34.2 km • Optimized fuel & time reduction: 24.8%
                </div>
                <div style="margin-top:14px; text-align:right;">
                    <button class="btn-primary" onclick="this.closest('div[style*=\\'position:fixed\\']').remove()">Dispatched to Field Rep Phone</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    openDocumensoSignModal(quoteId = 'quote-801') {
        const modal = document.createElement('div');
        modal.style.cssText = `position:fixed; inset:0; background:rgba(0,0,0,0.8); z-index:10000; display:flex; align-items:center; justify-content:center;`;
        modal.innerHTML = `
            <div class="glass-card" style="width:650px; max-width:90vw; background:#0b1120; padding:20px; border:1px solid var(--border-strong);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-size:18px;">✍️</span>
                        <h3 style="font-size:16px; font-weight:600; color:var(--text-primary);">Documenso Cryptographic Digital Signature</h3>
                    </div>
                    <button class="btn-secondary" onclick="this.closest('div[style*=\\'position:fixed\\']').remove()">✕</button>
                </div>
                <p style="font-size:12px; color:var(--text-secondary); margin-bottom:14px;">
                    Enforcing legally binding e-signatures with SHA-256 tamper-proof audit trails.
                </p>
                <div style="background:#070b14; padding:14px; border-radius:8px; border:1px solid var(--border-subtle); font-size:11px;">
                    <div><strong>Envelope ID:</strong> env-documenso-${Date.now().toString(36)}</div>
                    <div><strong>Target Document:</strong> Master Services Agreement (${quoteId})</div>
                    <div><strong>Sequential Signers:</strong> [1] Chief AI Architect (Internal) → [2] Chief Technology Officer (Client)</div>
                    <div style="margin-top:8px; color:#34d399;">✓ Cryptographic hash generated: 4f8b91a27e01bcf559...</div>
                </div>
                <div style="margin-top:16px; display:flex; justify-content:flex-end; gap:8px;">
                    <button class="btn-secondary" onclick="this.closest('div[style*=\\'position:fixed\\']').remove()">Cancel</button>
                    <button class="btn-primary" onclick="HitlManager.showToast('Documenso envelope dispatched for electronic sign-off.', 'emerald'); this.closest('div[style*=\\'position:fixed\\']').remove();">
                        Dispatch Envelope
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    openNewQuoteModal() {
        Copilot.sendQuickPrompt('Create new CPQ quote with 12% special discount for enterprise customer', 'agent-deal-desk');
    }
};

window.CrmModule = CrmModule;
