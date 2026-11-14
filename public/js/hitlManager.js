// ============================================================================
// AegisOS: Human-in-the-Loop (HITL) & Level 2 Undo Manager
// Enforces mandatory approval cards for Level 3 mutations and 1-click undo for Level 2
// ============================================================================

const HitlManager = {
    pendingApprovals: [],

    init() {
        this.fetchPending();
        // Poll for pending HITL items every 10 seconds
        setInterval(() => this.fetchPending(), 10000);
    },

    async fetchPending() {
        try {
            const res = await fetch('/api/hitl/pending');
            const data = await res.json();
            this.pendingApprovals = data.items || [];
            this.updateBadge();
        } catch (e) {
            console.error('[HITL] Failed to fetch pending queue:', e);
        }
    },

    updateBadge() {
        const badge = document.getElementById('hitl-badge');
        if (badge) {
            if (this.pendingApprovals.length > 0) {
                badge.textContent = this.pendingApprovals.length;
                badge.style.display = 'inline-flex';
            } else {
                badge.style.display = 'none';
            }
        }
    },

    async resolve(hitlId, decision) {
        try {
            const res = await fetch('/api/hitl/resolve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ hitlId, decision, reviewer: 'usr_admin' })
            });
            const data = await res.json();
            this.showToast(`Level 3 Action [${hitlId}] ${decision.toUpperCase()} successfully.`, decision === 'approved' ? 'emerald' : 'amber');
            await this.fetchPending();
            
            // Reload active module view to reflect changes
            if (window.AegisApp && window.AegisApp.refreshCurrentView) {
                window.AegisApp.refreshCurrentView();
            }
            return data;
        } catch (err) {
            this.showToast(`Failed to resolve HITL action: ${err.message}`, 'rose');
        }
    },

    showLevel2UndoToast(actionKey, undoId) {
        const toast = document.createElement('div');
        toast.className = 'level2-undo-toast';
        toast.id = `undo-toast-${undoId}`;
        toast.innerHTML = `
            <div style="display:flex; align-items:center; gap:8px;">
                <span class="badge badge-indigo">Level 2 Mutation</span>
                <span style="font-size:13px; color:var(--text-primary);">Executed: <strong>${actionKey}</strong></span>
            </div>
            <button class="btn-secondary" style="padding:4px 10px; font-size:12px; border-color:var(--accent-amber); color:var(--accent-amber);" onclick="HitlManager.triggerUndo('${undoId}')">
                ↺ 1-Click Revert (10s)
            </button>
        `;
        document.body.appendChild(toast);

        // Auto remove after 10 seconds
        setTimeout(() => {
            if (document.getElementById(`undo-toast-${undoId}`)) {
                toast.remove();
            }
        }, 10000);
    },

    async triggerUndo(undoId) {
        try {
            const res = await fetch('/api/undo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ undoId })
            });
            const data = await res.json();
            const elem = document.getElementById(`undo-toast-${undoId}`);
            if (elem) elem.remove();
            this.showToast(data.message, 'amber');
            if (window.AegisApp && window.AegisApp.refreshCurrentView) {
                window.AegisApp.refreshCurrentView();
            }
        } catch (e) {
            this.showToast('Undo failed', 'rose');
        }
    },

    showToast(message, color = 'emerald') {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; top: 24px; right: 24px; z-index: 99999;
            background: var(--bg-surface-elevated); border: 1px solid var(--border-strong);
            padding: 12px 20px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            font-size: 13px; color: var(--text-primary); display: flex; align-items: center; gap: 10px;
            animation: slideInRight 0.25s ease;
        `;
        const borderCol = color === 'emerald' ? '#10b981' : color === 'amber' ? '#f59e0b' : '#f43f5e';
        toast.style.borderLeft = `4px solid ${borderCol}`;
        toast.innerHTML = `<span>${message}</span>`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    }
};

window.HitlManager = HitlManager;
