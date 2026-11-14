// ============================================================================
// AegisOS: Three-Tier Memory Architecture Explorer
// Displays:
// - Tier 1: Working Memory (active session, tenant, UI state)
// - Tier 2: Episodic Memory (past agent executions & user feedback)
// - Tier 3: Semantic Memory (Hybrid Vector + Keyword RAG Knowledge Graph)
// ============================================================================

const MemoryViewer = {
    async openModal() {
        let modal = document.getElementById('memory-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'memory-modal';
            modal.style.cssText = `
                position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px);
                z-index: 10000; display: flex; align-items: center; justify-content: center;
            `;
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="glass-card" style="width: 840px; max-width: 92vw; max-height: 85vh; display: flex; flex-direction: column; overflow: hidden; background: #0b1120; border: 1px solid var(--border-strong);">
                <div style="padding: 18px 24px; border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span style="font-size:20px;">🧠</span>
                        <div>
                            <h3 style="font-size:16px; font-weight:600; color:var(--text-primary);">Three-Tier Agent Memory Architecture</h3>
                            <p style="font-size:12px; color:var(--text-secondary);">Working (Short-Term), Episodic (Execution History), Semantic (Enterprise RAG)</p>
                        </div>
                    </div>
                    <button class="btn-secondary" onclick="document.getElementById('memory-modal').remove()" style="padding:4px 10px;">✕</button>
                </div>

                <div style="display:flex; border-bottom:1px solid var(--border-subtle); background: rgba(255,255,255,0.02);">
                    <button id="mem-tab-btn-working" class="mem-tab-btn active" onclick="MemoryViewer.switchTab('working')" style="flex:1; padding:12px; background:transparent; border:none; color:var(--accent-primary); border-bottom:2px solid var(--accent-primary); font-weight:600; font-size:13px; cursor:pointer;">
                        1. Working Memory (Short-Term)
                    </button>
                    <button id="mem-tab-btn-episodic" class="mem-tab-btn" onclick="MemoryViewer.switchTab('episodic')" style="flex:1; padding:12px; background:transparent; border:none; color:var(--text-muted); font-size:13px; cursor:pointer;">
                        2. Episodic Memory (History)
                    </button>
                    <button id="mem-tab-btn-semantic" class="mem-tab-btn" onclick="MemoryViewer.switchTab('semantic')" style="flex:1; padding:12px; background:transparent; border:none; color:var(--text-muted); font-size:13px; cursor:pointer;">
                        3. Semantic Memory (RAG Vector)
                    </button>
                </div>

                <div id="memory-tab-content" style="padding: 24px; overflow-y: auto; flex: 1;">
                    <div style="text-align:center; padding:30px; color:var(--text-muted);">Loading memory telemetry...</div>
                </div>
            </div>
        `;

        this.switchTab('working');
    },

    async switchTab(tab) {
        document.querySelectorAll('.mem-tab-btn').forEach(b => {
            b.style.color = 'var(--text-muted)';
            b.style.borderBottom = 'none';
        });
        const activeBtn = document.getElementById(`mem-tab-btn-${tab}`);
        if (activeBtn) {
            activeBtn.style.color = 'var(--accent-primary)';
            activeBtn.style.borderBottom = '2px solid var(--accent-primary)';
        }

        const container = document.getElementById('memory-tab-content');
        if (!container) return;

        if (tab === 'working') {
            const res = await fetch('/api/memory/working');
            const data = await res.json();
            container.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:16px;">
                    <div class="glass-card" style="padding:16px; background:rgba(255,255,255,0.02);">
                        <span class="badge badge-indigo">Active Session State</span>
                        <pre style="margin-top:12px; font-size:12px; color:#a5b4fc; background:#070b14; padding:14px; border-radius:8px; overflow-x:auto;">${JSON.stringify(data, null, 2)}</pre>
                    </div>
                    <div style="font-size:12px; color:var(--text-secondary); line-height:1.5;">
                        Working Memory tracks the active tenant, currently authenticated user persona, current module view, and active prompt draft. It resets per session or persists across hot tab reloads.
                    </div>
                </div>
            `;
        } else if (tab === 'episodic') {
            const res = await fetch('/api/audit/logs?limit=8');
            const data = await res.json();
            const logs = data.logs || [];
            container.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:12px;">
                    <div style="font-size:12px; color:var(--text-secondary);">
                        Episodic memory captures recent multi-agent decisions, user approval actions, and tool-calling histories:
                    </div>
                    ${logs.map(l => `
                        <div class="glass-card" style="padding:12px 16px; background:rgba(255,255,255,0.02); display:flex; justify-content:space-between; align-items:center;">
                            <div>
                                <div style="font-size:13px; font-weight:600; color:var(--text-primary);">${l.agent_name}</div>
                                <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">Event: ${l.trigger_event} | Trace: ${l.reasoning_trace.substring(0, 75)}...</div>
                            </div>
                            <span class="badge ${l.risk_level === 3 ? 'badge-rose' : (l.risk_level === 2 ? 'badge-amber' : 'badge-emerald')}">
                                Level ${l.risk_level}
                            </span>
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (tab === 'semantic') {
            container.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:16px;">
                    <div style="display:flex; gap:10px;">
                        <input id="semantic-search-input" type="text" placeholder="Query enterprise knowledge graph (e.g. 'discount policy', 'SLA tier', 'reconciliation')..." 
                            style="flex:1; background:rgba(255,255,255,0.05); border:1px solid var(--border-strong); border-radius:8px; padding:10px 14px; color:var(--text-primary); font-size:13px;" />
                        <button class="btn-primary" onclick="MemoryViewer.runSemanticQuery()">Search RAG</button>
                    </div>
                    <div id="semantic-results-box" style="display:flex; flex-direction:column; gap:10px;">
                        <div style="text-align:center; padding:20px; color:var(--text-muted); font-size:12px;">
                            Enter a search query above to perform hybrid vector + keyword retrieval across enterprise SOPs.
                        </div>
                    </div>
                </div>
            `;
        }
    },

    async runSemanticQuery() {
        const input = document.getElementById('semantic-search-input');
        const box = document.getElementById('semantic-results-box');
        if (!input || !box) return;

        const query = input.value.trim();
        if (!query) return;

        box.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-muted);">Querying vector store...</div>`;
        const res = await fetch('/api/memory/semantic/query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        const data = await res.json();
        const matches = data.matches || [];

        if (matches.length === 0) {
            box.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-muted);">No semantic documents matched.</div>`;
            return;
        }

        box.innerHTML = matches.map(m => `
            <div class="glass-card" style="padding:14px; background:rgba(255,255,255,0.02); border-left:3px solid var(--accent-cyan);">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong style="font-size:13px; color:var(--text-primary);">${m.key}</strong>
                    <span class="badge badge-cyan">Relevance: ${(m.relevanceScore * 100).toFixed(0)}%</span>
                </div>
                <p style="font-size:12px; color:var(--text-secondary); margin-top:6px; line-height:1.4;">${m.content}</p>
            </div>
        `).join('');
    }
};

window.MemoryViewer = MemoryViewer;
