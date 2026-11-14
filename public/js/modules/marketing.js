// ============================================================================
// Module Group B: Marketing & Customer Experience
// Replaces: Zoho Marketing Plus, Campaigns, Social, PageSense, Forms, Backstage
// Composable Foundation: Mautic / PostHog / Formbricks
// Autonomous Agents: Campaign Orchestrator, CRO Analyst, Social Listening
// ============================================================================

const MarketingModule = {
    async render(container) {
        const [campRes, socRes] = await Promise.all([
            fetch('/api/marketing/campaigns').then(r => r.json()),
            fetch('/api/marketing/social').then(r => r.json())
        ]);

        const campaigns = campRes || [];
        const social = socRes || [];

        container.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:20px;">
                <!-- Header -->
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="display:flex; align-items:center; gap:8px;">
                            <h2 style="font-size:20px; font-weight:700; color:var(--text-primary);">Marketing & Customer Experience</h2>
                            <span class="badge badge-indigo">Module Group B</span>
                            <span class="badge badge-cyan">Mautic / PostHog Core</span>
                        </div>
                        <p style="font-size:12px; color:var(--text-secondary); margin-top:4px;">
                            Autonomous omnichannel campaigns, social brand sentiment listening, and PostHog CRO funnel heatmaps.
                        </p>
                    </div>
                    <div style="display:flex; gap:8px;">
                        <button class="btn-secondary" onclick="MarketingModule.openCroModal()">📊 PostHog Heatmaps</button>
                        <button class="btn-primary" onclick="Copilot.sendQuickPrompt('Generate multi-channel campaign brief for AI Agent Orchestration rollout', 'agent-campaign-orchestrator')">
                            ⚡ Run Campaign Orchestrator
                        </button>
                    </div>
                </div>

                <!-- Omnichannel Journeys & Active Campaigns -->
                <div style="display:grid; grid-template-columns: 2fr 1fr; gap:16px;">
                    <!-- Campaign Performance Table -->
                    <div class="glass-card" style="padding:18px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                            <h3 style="font-size:14px; font-weight:600; color:var(--text-primary);">Active Marketing Campaigns</h3>
                            <span class="badge badge-emerald">Mautic Automation Engine</span>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:10px;">
                            ${campaigns.map(c => `
                                <div class="glass-card" style="padding:14px; background:rgba(255,255,255,0.02); display:flex; justify-content:space-between; align-items:center;">
                                    <div>
                                        <div style="display:flex; align-items:center; gap:8px;">
                                            <span style="font-weight:600; font-size:13px; color:var(--text-primary);">${c.name}</span>
                                            <span class="badge badge-indigo">${c.type}</span>
                                        </div>
                                        <p style="font-size:11px; color:var(--text-secondary); margin-top:4px;">${c.generated_brief}</p>
                                        <div style="display:flex; gap:16px; margin-top:8px; font-size:11px; color:var(--text-muted);">
                                            <span>Audience: <strong>${c.audience_size.toLocaleString()}</strong></span>
                                            <span>Open Rate: <strong style="color:#34d399;">${c.open_rate}%</strong></span>
                                            <span>Click Rate: <strong style="color:#22d3ee;">${c.click_rate}%</strong></span>
                                            <span>Budget: <strong style="color:var(--text-primary);">$${c.budget.toLocaleString()}</strong></span>
                                        </div>
                                    </div>
                                    <button class="btn-secondary" style="font-size:11px; padding:4px 8px;" onclick="Copilot.sendQuickPrompt('Analyze conversion drop-offs for campaign ${c.name}', 'agent-cro-analyst')">
                                        Analyze CRO
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Social Sentiment Stream -->
                    <div class="glass-card" style="padding:18px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                            <h3 style="font-size:14px; font-weight:600; color:var(--text-primary);">Social Listening Stream</h3>
                            <button class="btn-secondary" style="font-size:11px; padding:3px 8px;" onclick="Copilot.sendQuickPrompt('Monitor social streams for brand sentiment spikes', 'agent-social-listening')">
                                🔄 Refresh
                            </button>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:10px;">
                            ${social.map(s => `
                                <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-subtle); border-radius:8px; padding:12px;">
                                    <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px;">
                                        <span class="badge badge-cyan">${s.platform}</span>
                                        <span class="badge badge-emerald">Sentiment: ${(s.sentiment_score * 100).toFixed(0)}% Positive</span>
                                    </div>
                                    <p style="font-size:12px; color:var(--text-primary); margin-top:8px; line-height:1.4;">${s.content}</p>
                                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; font-size:10px; color:var(--text-muted);">
                                        <span>Engagement: ${s.engagement_count} interactions</span>
                                        <span>${s.scheduled_time}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    openCroModal() {
        const modal = document.createElement('div');
        modal.style.cssText = `position:fixed; inset:0; background:rgba(0,0,0,0.8); z-index:10000; display:flex; align-items:center; justify-content:center;`;
        modal.innerHTML = `
            <div class="glass-card" style="width:720px; max-width:90vw; background:#0b1120; padding:20px; border:1px solid var(--border-strong);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <h3 style="font-size:16px; font-weight:600; color:var(--text-primary);">PostHog Privacy-First CRO Heatmaps & Funnels</h3>
                    <button class="btn-secondary" onclick="this.closest('div[style*=\\'position:fixed\\']').remove()">✕</button>
                </div>
                <div style="background:#070b14; padding:16px; border-radius:8px; border:1px solid var(--border-subtle); font-size:12px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                        <span>Step 1: Homepage Landing Visit</span>
                        <strong>14,200 (100%)</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                        <span>Step 2: Interactive Copilot Demo Interaction</span>
                        <strong>6,820 (48.0%)</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                        <span>Step 3: OpenAPI Specs & Docs Click</span>
                        <strong>2,450 (17.2%)</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between; color:#34d399; font-weight:700;">
                        <span>Step 4: Bookings Calendar Scheduled</span>
                        <strong>890 (6.2%)</strong>
                    </div>
                    <div style="margin-top:14px; padding-top:12px; border-top:1px solid var(--border-subtle); color:#fbbf24;">
                        ✦ AI CRO Recommendation: Reducing registration steps on Step 2 will increase conversion by an estimated +18.4%.
                    </div>
                </div>
                <div style="margin-top:14px; text-align:right;">
                    <button class="btn-primary" onclick="this.closest('div[style*=\\'position:fixed\\']').remove()">Apply A/B Test Variant</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
};

window.MarketingModule = MarketingModule;
