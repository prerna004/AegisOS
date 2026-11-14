// ============================================================================
// AegisOS: Persistent Generative UI (GenUI) Copilot Drawer
// Capable of streaming interactive React/HTML cards:
// - Level 3 Mandatory HITL Approval Cards
// - Dynamic Forms & Inline Charts
// - Model Router & Token Cost Telemetry
// ============================================================================

const Copilot = {
    isOpen: true,
    activeAgent: 'agent-lead-enrichment',

    init() {
        this.renderDrawer();
        this.bindEvents();
    },

    toggle() {
        this.isOpen = !this.isOpen;
        const drawer = document.getElementById('copilot-drawer');
        if (drawer) {
            drawer.style.transform = this.isOpen ? 'translateX(0)' : 'translateX(100%)';
        }
        const appContainer = document.getElementById('main-workspace');
        if (appContainer) {
            appContainer.style.marginRight = this.isOpen ? '380px' : '0px';
        }
    },

    renderDrawer() {
        let drawer = document.getElementById('copilot-drawer');
        if (!drawer) {
            drawer = document.createElement('div');
            drawer.id = 'copilot-drawer';
            drawer.style.cssText = `
                position: fixed; top: 0; right: 0; bottom: 0; width: 380px;
                background: #0b1120; border-left: 1px solid var(--border-subtle);
                box-shadow: -10px 0 30px rgba(0,0,0,0.5); z-index: 1000;
                display: flex; flex-direction: column; transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
            `;
            document.body.appendChild(drawer);
        }

        drawer.innerHTML = `
            <!-- Copilot Header -->
            <div style="padding: 14px 18px; border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.01);">
                <div style="display:flex; align-items:center; gap:8px;">
                    <span class="pulse-dot thinking"></span>
                    <div>
                        <div style="font-size:13px; font-weight:600; color:var(--text-primary);">Aegis Copilot (GenUI)</div>
                        <div style="font-size:11px; color:var(--text-muted);">LiteLLM Router • 26 Agents Active</div>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <select id="copilot-model-select" style="background:#070b14; color:var(--text-secondary); border:1px solid var(--border-subtle); border-radius:6px; font-size:11px; padding:2px 6px;">
                        <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                        <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                        <option value="llama-3.3-70b-local">Llama 3.3 (Local Ollama)</option>
                    </select>
                    <button class="btn-secondary" onclick="Copilot.toggle()" style="padding:2px 6px; font-size:11px;">✕</button>
                </div>
            </div>

            <!-- Agent Selector Quick Bar -->
            <div style="padding: 8px 14px; background: rgba(0,0,0,0.2); border-bottom:1px solid var(--border-subtle); display:flex; gap:6px; overflow-x:auto;">
                <button class="btn-secondary copilot-agent-chip active" onclick="Copilot.selectAgent('agent-lead-enrichment', this)" style="padding:3px 8px; font-size:11px; white-space:nowrap;">
                    Lead Enrichment
                </button>
                <button class="btn-secondary copilot-agent-chip" onclick="Copilot.selectAgent('agent-deal-desk', this)" style="padding:3px 8px; font-size:11px; white-space:nowrap;">
                    Deal Desk (HITL)
                </button>
                <button class="btn-secondary copilot-agent-chip" onclick="Copilot.selectAgent('agent-it-helpdesk', this)" style="padding:3px 8px; font-size:11px; white-space:nowrap;">
                    IT Helpdesk (HITL)
                </button>
                <button class="btn-secondary copilot-agent-chip" onclick="Copilot.selectAgent('agent-data-scientist', this)" style="padding:3px 8px; font-size:11px; white-space:nowrap;">
                    NL to SQL
                </button>
            </div>

            <!-- Messages Stream Area -->
            <div id="copilot-messages" style="flex:1; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:14px;">
                <!-- Initial Welcome Greeting -->
                <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); border-radius:10px; padding:12px; font-size:12px; line-height:1.5;">
                    <div style="font-weight:600; color:#818cf8; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                        <span>✦</span> Welcome to Aegis Enterprise Copilot
                    </div>
                    I have full read/write visibility across your 9 modules with <strong>Level 3 HITL safety gates</strong>. Click a shortcut below or prompt any agent:
                    <div style="margin-top:10px; display:flex; flex-direction:column; gap:6px;">
                        <button class="btn-secondary" style="font-size:11px; text-align:left; justify-content:flex-start;" onclick="Copilot.sendQuickPrompt('Enrich Elena Dynamics Robotics and calculate ICP fit score', 'agent-lead-enrichment')">
                            ⚡ "Enrich Elena Dynamics & calculate ICP score"
                        </button>
                        <button class="btn-secondary" style="font-size:11px; text-align:left; justify-content:flex-start;" onclick="Copilot.sendQuickPrompt('Check Deal Desk margin for $480,000 Nordic quote with 12% discount', 'agent-deal-desk')">
                            🔒 "Check Deal Desk margin for Nordic quote (Triggers HITL)"
                        </button>
                        <button class="btn-secondary" style="font-size:11px; text-align:left; justify-content:flex-start;" onclick="Copilot.sendQuickPrompt('Diagnose disk usage alert on fleet-gw-nordic-418.iot and prepare clean script', 'agent-it-helpdesk')">
                            🛡️ "Diagnose disk pressure on endpoint (Triggers HITL)"
                        </button>
                        <button class="btn-secondary" style="font-size:11px; text-align:left; justify-content:flex-start;" onclick="Copilot.sendQuickPrompt('Show revenue breakdown by deal pipeline stages', 'agent-data-scientist')">
                            📊 "Show revenue breakdown by deal pipeline stages"
                        </button>
                    </div>
                </div>
            </div>

            <!-- Input Box -->
            <div style="padding: 12px; border-top: 1px solid var(--border-subtle); background: #070b14;">
                <form id="copilot-input-form" onsubmit="Copilot.handleSubmit(event)" style="display:flex; flex-direction:column; gap:8px;">
                    <div style="position:relative;">
                        <textarea id="copilot-input" placeholder="Ask any of the 26 agents or execute cross-suite commands..." 
                            rows="2" style="width:100%; background:rgba(255,255,255,0.04); border:1px solid var(--border-strong); border-radius:8px; padding:8px 10px; color:var(--text-primary); font-size:12px; resize:none; font-family:inherit;"></textarea>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span id="copilot-token-ticker" style="font-size:10px; color:var(--text-muted); font-family:var(--font-mono);">Session: ~4,120 tok ($0.006)</span>
                        <button type="submit" class="btn-primary" style="padding:5px 12px; font-size:12px;">Send ↵</button>
                    </div>
                </form>
            </div>
        `;

        const appContainer = document.getElementById('main-workspace');
        if (appContainer) {
            appContainer.style.marginRight = '380px';
        }
    },

    bindEvents() {
        const input = document.getElementById('copilot-input');
        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSubmit(e);
                }
            });
        }
    },

    selectAgent(agentId, btnElem) {
        this.activeAgent = agentId;
        document.querySelectorAll('.copilot-agent-chip').forEach(b => {
            b.style.borderColor = 'var(--border-subtle)';
            b.style.color = 'var(--text-primary)';
        });
        if (btnElem) {
            btnElem.style.borderColor = 'var(--accent-primary)';
            btnElem.style.color = '#818cf8';
        }
    },

    sendQuickPrompt(promptText, agentId = null) {
        if (agentId) this.activeAgent = agentId;
        const input = document.getElementById('copilot-input');
        if (input) {
            input.value = promptText;
            this.handleSubmit(new Event('submit'));
        }
    },

    async handleSubmit(e) {
        if (e && e.preventDefault) e.preventDefault();
        const input = document.getElementById('copilot-input');
        if (!input) return;
        const text = input.value.trim();
        if (!text) return;

        input.value = '';
        this.appendUserMessage(text);

        // Show thinking indicator
        const thinkingId = 'think-' + Date.now();
        this.appendThinkingIndicator(thinkingId, this.activeAgent);

        try {
            const res = await fetch('/api/agents/invoke', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    agentId: this.activeAgent,
                    prompt: text,
                    context: {
                        client: text.includes('Nordic') ? 'Nordic Logistics Global' : undefined,
                        amount: text.includes('480,000') ? 480000 : undefined,
                        discountPercent: text.includes('12%') ? 12.0 : undefined
                    }
                })
            });

            const data = await res.json();
            const thinkElem = document.getElementById(thinkingId);
            if (thinkElem) thinkElem.remove();

            this.renderAgentResponse(data);
        } catch (err) {
            const thinkElem = document.getElementById(thinkingId);
            if (thinkElem) thinkElem.remove();
            this.appendErrorMessage(`Agent execution failed: ${err.message}`);
        }
    },

    appendUserMessage(text) {
        const container = document.getElementById('copilot-messages');
        const div = document.createElement('div');
        div.style.cssText = `
            align-self: flex-end; max-width: 85%; background: var(--accent-primary);
            color: #ffffff; padding: 10px 14px; border-radius: 12px 12px 2px 12px;
            font-size: 12px; line-height: 1.4; word-break: break-word;
        `;
        div.textContent = text;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    },

    appendThinkingIndicator(id, agentId) {
        const container = document.getElementById('copilot-messages');
        const div = document.createElement('div');
        div.id = id;
        div.style.cssText = `
            align-self: flex-start; max-width: 90%; background: rgba(255,255,255,0.03);
            border: 1px solid var(--border-subtle); padding: 10px 12px; border-radius: 12px 12px 12px 2px;
            font-size: 12px; color: var(--text-secondary); display:flex; align-items:center; gap:8px;
        `;
        div.innerHTML = `
            <span class="pulse-dot thinking"></span>
            <span>Agent <strong>${agentId}</strong> is reasoning & calling MCP tools...</span>
        `;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    },

    renderAgentResponse(data) {
        const container = document.getElementById('copilot-messages');
        const div = document.createElement('div');
        div.style.cssText = `
            align-self: flex-start; width: 100%; display:flex; flex-direction:column; gap:10px;
        `;

        let hitlCardHtml = '';
        if (data.requiresHitl && data.hitlRecord) {
            const h = data.hitlRecord;
            hitlCardHtml = `
                <div class="hitl-approval-card">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span class="badge badge-rose">Mandatory Level 3 HITL Gate</span>
                        <span style="font-size:11px; font-family:var(--font-mono); color:#f59e0b;">${h.id}</span>
                    </div>
                    <div style="font-weight:600; font-size:13px; color:var(--text-primary); margin-top:8px;">
                        ${h.actionType}
                    </div>
                    <p style="font-size:11px; color:var(--text-secondary); margin-top:4px;">
                        ${h.description}
                    </p>
                    <div style="margin-top:10px; background:#070b14; padding:8px 10px; border-radius:6px; font-size:10px; font-family:var(--font-mono); color:#a5b4fc;">
                        ${JSON.stringify(h.payload, null, 2)}
                    </div>
                    <div style="display:flex; gap:8px; margin-top:12px;">
                        <button class="btn-primary" style="flex:1; background:#10b981; padding:6px 10px; font-size:11px; justify-content:center;" onclick="HitlManager.resolve('${h.id}', 'approved')">
                            ✓ Approve & Execute
                        </button>
                        <button class="btn-secondary" style="flex:1; border-color:#f43f5e; color:#f43f5e; padding:6px 10px; font-size:11px; justify-content:center;" onclick="HitlManager.resolve('${h.id}', 'rejected')">
                            ✕ Reject
                        </button>
                    </div>
                </div>
            `;
        }

        let chartHtml = '';
        if (data.executionResult && data.executionResult.data && data.executionResult.generatedSql) {
            chartHtml = `
                <div style="background:#070b14; border:1px solid var(--border-subtle); border-radius:8px; padding:10px; margin-top:8px;">
                    <div style="font-size:10px; color:var(--accent-cyan); font-family:var(--font-mono); margin-bottom:6px;">
                        SQL: ${data.executionResult.generatedSql}
                    </div>
                    <div style="display:flex; flex-direction:column; gap:4px;">
                        ${data.executionResult.data.map(d => `
                            <div style="display:flex; justify-content:space-between; font-size:11px; border-bottom:1px solid rgba(255,255,255,0.04); padding:3px 0;">
                                <span style="color:var(--text-secondary);">${d.stage || d.status || d.priority}</span>
                                <strong style="color:var(--text-primary); font-family:var(--font-mono);">${d.total_value ? '$' + Number(d.total_value).toLocaleString() : d.count}</strong>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        div.innerHTML = `
            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 12px; font-size: 12px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <span style="font-weight:600; color:var(--text-primary);">${data.agentName}</span>
                    <span class="badge ${data.riskLevel === 3 ? 'badge-rose' : (data.riskLevel === 2 ? 'badge-amber' : 'badge-emerald')}">
                        Level ${data.riskLevel} ${data.riskLevel === 3 ? 'HITL' : (data.riskLevel === 2 ? 'Undoable' : 'Auto')}
                    </span>
                </div>
                <div style="color:var(--text-secondary); line-height:1.4; font-size:11px; border-left:2px solid var(--accent-primary); padding-left:8px; margin:6px 0;">
                    ${data.reasoningTrace}
                </div>
                ${data.toolsCalled && data.toolsCalled.length ? `
                    <div style="display:flex; gap:4px; margin-top:6px; flex-wrap:wrap;">
                        ${data.toolsCalled.map(t => `<span class="badge badge-indigo" style="font-size:9px;">${t}</span>`).join('')}
                    </div>
                ` : ''}
                ${chartHtml}
            </div>
            ${hitlCardHtml}
        `;

        container.appendChild(div);
        container.scrollTop = container.scrollHeight;

        if (data.undoAvailable) {
            HitlManager.showLevel2UndoToast(data.agentName, 'undo-' + Date.now());
        }
    },

    appendErrorMessage(msg) {
        const container = document.getElementById('copilot-messages');
        const div = document.createElement('div');
        div.style.cssText = `
            align-self: flex-start; max-width: 90%; background: rgba(244,63,94,0.1);
            border: 1px solid rgba(244,63,94,0.3); color: #fb7185; padding: 10px 12px;
            border-radius: 8px; font-size: 12px;
        `;
        div.textContent = msg;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }
};

window.Copilot = Copilot;
