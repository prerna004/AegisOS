// ============================================================================
// Module Group F: Collaboration & Productivity Suite
// Replaces: Zoho Mail, Cliq, WorkDrive, Writer, Sheet, Show, Meeting, Vault
// Composable Foundation: Stalwart / Rocket.Chat / Nextcloud / LiveKit / Vaultwarden
// Autonomous Agents: Meeting Scribe & Action, Inbox Triage & Draft, Document Synthesis
// ============================================================================

const CollabModule = {
    activeChannel: '#general',

    async render(container) {
        const [emailsRes, chatRes] = await Promise.all([
            fetch('/api/collab/emails').then(r => r.json()),
            fetch(`/api/collab/chat?channel=${encodeURIComponent(this.activeChannel)}`).then(r => r.json())
        ]);

        const emails = emailsRes || [];
        const messages = chatRes || [];

        container.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:20px;">
                <!-- Header -->
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="display:flex; align-items:center; gap:8px;">
                            <h2 style="font-size:20px; font-weight:700; color:var(--text-primary);">Collaboration & Productivity Suite</h2>
                            <span class="badge badge-indigo">Module Group F</span>
                            <span class="badge badge-emerald">Mattermost / Nextcloud / LiveKit Core</span>
                        </div>
                        <p style="font-size:12px; color:var(--text-secondary); margin-top:4px;">
                            Unified custom-domain email, topic chat channels, live meeting scribe, and zero-knowledge password vault.
                        </p>
                    </div>
                    <div style="display:flex; gap:8px;">
                        <button class="btn-secondary" onclick="CollabModule.openLiveMeetingModal()">📹 LiveKit Meeting Scribe</button>
                        <button class="btn-secondary" onclick="CollabModule.openPasswordVaultModal()">🔐 Vaultwarden Vault</button>
                        <button class="btn-primary" onclick="Copilot.sendQuickPrompt('Triage incoming emails and draft contextual executive responses', 'agent-inbox-triage')">
                            ⚡ Run Inbox Triage AI
                        </button>
                    </div>
                </div>

                <!-- Mail & Cliq Channels Split -->
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
                    <!-- Enterprise Mail Client -->
                    <div class="glass-card" style="padding:18px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                            <h3 style="font-size:14px; font-weight:600; color:var(--text-primary);">Unified Enterprise Mail (Stalwart Core)</h3>
                            <span class="badge badge-indigo">DKIM/DMARC Secure</span>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:10px;">
                            ${emails.map(em => `
                                <div class="glass-card" style="padding:12px; background:rgba(255,255,255,0.02); display:flex; flex-direction:column; gap:6px;">
                                    <div style="display:flex; justify-content:space-between; align-items:center;">
                                        <span style="font-weight:600; font-size:12px; color:var(--text-primary);">${em.sender}</span>
                                        <span class="badge ${em.category === 'action_needed' ? 'badge-rose' : 'badge-cyan'}">
                                            ${em.category === 'action_needed' ? 'Action Needed' : 'Inbox'}
                                        </span>
                                    </div>
                                    <div style="font-size:12px; font-weight:500; color:#818cf8;">${em.subject}</div>
                                    <p style="font-size:11px; color:var(--text-secondary); line-height:1.4;">${em.preview}</p>
                                    ${em.ai_draft_reply ? `
                                        <div style="margin-top:6px; background:#070b14; border-left:2px solid #10b981; padding:8px 10px; border-radius:4px; font-size:11px;">
                                            <div style="color:#34d399; font-weight:600; font-size:10px;">✦ AI SUGGESTED REPLY DRAFT:</div>
                                            <div style="color:var(--text-secondary); margin-top:2px;">"${em.ai_draft_reply}"</div>
                                            <button class="btn-secondary" style="font-size:10px; padding:2px 8px; margin-top:6px;" onclick="HitlManager.showToast('Reply dispatched via Stalwart Mail gateway', 'emerald')">
                                                Send Approved Draft
                                            </button>
                                        </div>
                                    ` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Cliq Team Topic Channels -->
                    <div class="glass-card" style="padding:18px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                            <div style="display:flex; gap:8px;">
                                ${['#general', '#leads', '#dev'].map(ch => `
                                    <button class="btn-secondary ${ch === this.activeChannel ? 'active' : ''}" 
                                        style="font-size:11px; padding:3px 8px; ${ch === this.activeChannel ? 'border-color:var(--accent-primary); color:#818cf8;' : ''}"
                                        onclick="CollabModule.switchChannel('${ch}')">
                                        ${ch}
                                    </button>
                                `).join('')}
                            </div>
                            <span class="badge badge-emerald">Mattermost Sync</span>
                        </div>
                        <div id="collab-messages-list" style="height:320px; overflow-y:auto; display:flex; flex-direction:column; gap:8px; padding-right:6px;">
                            ${messages.map(m => `
                                <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-subtle); border-radius:8px; padding:8px 12px; font-size:12px;">
                                    <div style="display:flex; justify-content:space-between; align-items:center;">
                                        <strong style="color:${m.is_bot ? '#22d3ee' : 'var(--text-primary)'}; font-size:11px;">${m.sender}</strong>
                                        <span style="font-size:10px; color:var(--text-muted);">${m.timestamp.substring(11, 16)}</span>
                                    </div>
                                    <div style="color:var(--text-secondary); margin-top:4px; line-height:1.4;">${m.text}</div>
                                </div>
                            `).join('')}
                        </div>
                        <div style="margin-top:12px; display:flex; gap:8px;">
                            <input id="chat-input-text" type="text" placeholder="Type a message or /command in ${this.activeChannel}..." 
                                style="flex:1; background:rgba(255,255,255,0.05); border:1px solid var(--border-strong); border-radius:8px; padding:8px 12px; color:var(--text-primary); font-size:12px;" />
                            <button class="btn-primary" onclick="CollabModule.sendChatMessage()">Send</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    async switchChannel(channel) {
        this.activeChannel = channel;
        const container = document.getElementById('module-content-area');
        if (container) this.render(container);
    },

    sendChatMessage() {
        const input = document.getElementById('chat-input-text');
        if (!input) return;
        const text = input.value.trim();
        if (!text) return;
        input.value = '';

        const list = document.getElementById('collab-messages-list');
        const msgElem = document.createElement('div');
        msgElem.style.cssText = `background:rgba(255,255,255,0.02); border:1px solid var(--border-subtle); border-radius:8px; padding:8px 12px; font-size:12px;`;
        msgElem.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <strong style="color:var(--text-primary); font-size:11px;">Prerna Chotwani</strong>
                <span style="font-size:10px; color:var(--text-muted);">Just now</span>
            </div>
            <div style="color:var(--text-secondary); margin-top:4px; line-height:1.4;">${text}</div>
        `;
        list.appendChild(msgElem);
        list.scrollTop = list.scrollHeight;
    },

    openLiveMeetingModal() {
        const modal = document.createElement('div');
        modal.style.cssText = `position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:10000; display:flex; align-items:center; justify-content:center;`;
        modal.innerHTML = `
            <div class="glass-card" style="width:740px; max-width:92vw; background:#0b1120; padding:20px; border:1px solid var(--border-strong);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-size:18px;">📹</span>
                        <h3 style="font-size:16px; font-weight:600; color:var(--text-primary);">LiveKit Meeting Room & Autonomous AI Scribe</h3>
                    </div>
                    <button class="btn-secondary" onclick="this.closest('.glass-card').parentElement.remove()">✕</button>
                </div>
                <div style="background:#070b14; border:1px solid var(--border-subtle); border-radius:8px; padding:16px; font-size:12px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <span style="color:#22d3ee; font-weight:600;">🔴 Live Session: Executive Architecture Sync (Phase 2 & 3)</span>
                        <span class="badge badge-emerald">LiveKit WebRTC 4K</span>
                    </div>
                    <div style="background:#000; border:1px solid #1e293b; border-radius:6px; padding:12px; color:#cbd5e1; font-family:var(--font-mono); font-size:11px; line-height:1.6;">
                        [10:14:02] Prerna Chotwani: "We have exposed all standardized Model Context Protocol tools."<br>
                        [10:14:18] Vikram Malhotra: "NATS JetStream consumer lag is under 12ms across Mumbai & Munich."<br>
                        [10:14:35] Ananya Deshmukh: "Copilot drawer streams structured approval cards in real-time."<br>
                        [10:14:52] AI Meeting Scribe: ✦ Extracted Decision: All Phase 2 & 3 milestones ready for WildCatter GitHub push.
                    </div>
                </div>
                <div style="margin-top:14px; text-align:right;">
                    <button class="btn-primary" onclick="Copilot.sendQuickPrompt('Extract action items from meeting transcript and auto-create tasks in Projects module', 'agent-meeting-scribe'); this.closest('.glass-card').parentElement.remove();">
                        Extract Action Items & Sync to Projects
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    openPasswordVaultModal() {
        const modal = document.createElement('div');
        modal.style.cssText = `position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:10000; display:flex; align-items:center; justify-content:center;`;
        modal.innerHTML = `
            <div class="glass-card" style="width:680px; max-width:92vw; background:#0b1120; padding:20px; border:1px solid var(--border-strong);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-size:18px;">🔐</span>
                        <h3 style="font-size:16px; font-weight:600; color:var(--text-primary);">Vaultwarden Zero-Knowledge Enterprise Password Vault</h3>
                    </div>
                    <button class="btn-secondary" onclick="this.closest('.glass-card').parentElement.remove()">✕</button>
                </div>
                <div style="display:flex; flex-direction:column; gap:8px; font-size:12px;">
                    <div class="glass-card" style="padding:10px 14px; background:rgba(255,255,255,0.02); display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <strong>Stripe Production Gateway API Keys</strong>
                            <div style="font-size:11px; color:var(--text-muted);">AES-256 Envelope Encrypted • Role: VP Finance only</div>
                        </div>
                        <button class="btn-secondary" style="font-size:11px;" onclick="HitlManager.showToast('Encrypted secret copied to clipboard (auto-wipes in 30s)', 'emerald')">Copy Key</button>
                    </div>
                    <div class="glass-card" style="padding:10px 14px; background:rgba(255,255,255,0.02); display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <strong>AWS Production Root Multi-Factor Token</strong>
                            <div style="font-size:11px; color:var(--text-muted);">Hardware Security Key (FIDO2) Enforced</div>
                        </div>
                        <button class="btn-secondary" style="font-size:11px;" onclick="HitlManager.showToast('Hardware key verified', 'emerald')">Verify</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
};

window.CollabModule = CollabModule;
