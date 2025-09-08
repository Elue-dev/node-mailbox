"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DevMailUI;
function DevMailUI({ path }) {
    return `
  <!DOCTYPE html>
  <html lang="en" data-theme="dark">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="icon" type="image/png" href="${path}/assets/logo.png">
      <title>Node Dev Mailbox</title>
      <style>
          :root {
              --bg-primary: #ffffff;
              --bg-secondary: #f8f9fa;
              --bg-tertiary: #e9ecef;
              --text-primary: #212529;
              --text-secondary: #6c757d;
              --text-muted: #adb5bd;
              --border-color: #f0f0f0;
              --accent-color: #26577f;
              --accent-hover: #0b5ed7;
              --danger-color: #dc3545;
              --danger-hover: #bb2d3b;
              --shadow: 0 2px 4px rgba(0,0,0,0.1);
          }

          [data-theme="dark"] {
              --bg-primary: #0a0a0a;
              --bg-secondary: #0e0e0e;
              --bg-tertiary: #1f1e1e;
              --text-primary: #ffffff;
              --text-secondary: #b3b3b3;
              --text-muted: #666666;
              --border-color: #1b1b1b;
              --accent-color: #26577f;
              --accent-hover: #339af0;
              --danger-color: #fa5252;
              --danger-hover: #e03131;
              --shadow: 0 2px 8px rgba(0,0,0,0.3);
          }

          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }

          body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: var(--bg-primary);
              color: var(--text-primary);
              height: 100vh;
              display: flex;
              flex-direction: column;
              transition: all 0.3s ease;
          }

          .header {
              background: var(--bg-secondary);
              border-bottom: 1px solid var(--border-color);
              padding: 1rem 1.5rem;
              display: flex;
              justify-content: space-between;
              align-items: center;
              box-shadow: var(--shadow);
          }

          .header-left {
              display: flex;
              align-items: center;
              gap: 1rem;
          }

          .header h1 {
              font-size: 1.25rem;
              font-weight: 600;
              color: var(--text-primary);
          }

          .logo-wrapper {
              display: flex;
              justify-content: center;
              align-items: center;
          }

          .search-box {
              position: relative;
              transition: all 0.2s ease-in-out;
          }

          .search-input {
              background: var(--bg-primary);
              border: 1px solid var(--border-color);
              border-radius: 8px;
              padding: 0.5rem 1rem 0.5rem 2.5rem;
              font-size: 0.875rem;
              color: var(--text-primary);
              width: 300px;
              transition: all 0.2s ease-in-out;
          }

          .search-input:focus {
              outline: none;
              border-color: var(--accent-color);
              box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.25);
          }

          .search-icon {
              position: absolute;
              left: 0.75rem;
              top: 50%;
              transform: translateY(-50%);
              color: var(--text-muted);
              font-size: 0.875rem;
          }

          .header-actions {
              display: flex;
              gap: 0.75rem;
              align-items: center;
          }

          .theme-toggle {
              background: var(--bg-primary);
              border: 1px solid var(--border-color);
              border-radius: 6px;
              padding: 0.5rem;
              cursor: pointer;
              color: var(--text-secondary);
              transition: all 0.2s;
          }

          .theme-toggle:hover {
              background: var(--bg-tertiary);
              border-color: var(--accent-color);
          }

          .btn {
              padding: 0.5rem 1rem;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-size: 0.875rem;
              font-weight: 500;
              transition: all 0.2s;
          }

          .btn-danger {
              background: var(--danger-color);
              color: white;
          }

          .btn-danger:hover {
              background: var(--danger-hover);
          }

          .email-count {
              font-size: 0.875rem;
              color: var(--text-muted);
              font-weight: 500;
          }

          .main-container {
              flex: 1;
              display: flex;
              height: calc(100vh - 73px);
          }

          .sidebar {
              width: 380px;
              background: var(--bg-secondary);
              border-right: 1px solid var(--border-color);
              display: flex;
              flex-direction: column;
          }

          .email-list {
              flex: 1;
              overflow-y: auto;
          }

          .email-item {
              padding: 1rem 1.5rem;
              border-bottom: 1px solid var(--border-color);
              cursor: pointer;
              transition: all 0.2s;
              position: relative;
          }

          .email-item:hover {
              background: var(--bg-tertiary);
          }

          .email-item.active {
              background: var(--accent-color);
              color: white;
          }

          .email-item.active * {
              color: white !important;
          }

          .email-header-info {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 0.5rem;
          }

          .email-from {
              font-weight: 600;
              font-size: 0.9rem;
              color: var(--text-primary);
          }

          .email-time {
              font-size: 0.75rem;
              color: var(--text-muted);
              white-space: nowrap;
          }

          .email-subject {
              font-weight: 500;
              margin-bottom: 0.25rem;
              color: var(--text-primary);
              font-size: 0.875rem;
          }

          .email-to {
              font-size: 0.75rem;
              color: var(--text-secondary);
          }

          .content-area {
              flex: 1;
              display: flex;
              flex-direction: column;
              background: var(--bg-primary);
          }

          .email-detail-header {
              padding: 1.5rem;
              border-bottom: 1px solid var(--border-color);
              background: var(--bg-secondary);
          }

          .email-detail-header h2 {
              font-size: 1.25rem;
              margin-bottom: 1rem;
              color: var(--text-primary);
          }

          .email-meta-row {
              display: flex;
              margin-bottom: 0.5rem;
              font-size: 0.875rem;
          }

          .email-meta-label {
              color: var(--text-secondary);
              font-weight: 500;
              min-width: 60px;
          }

          .email-meta-value {
              color: var(--text-primary);
          }

          .email-actions {
              display: flex;
              gap: 0.5rem;
              margin-top: 1rem;
          }

          .btn-outline {
              background: transparent;
              border: 1px solid var(--border-color);
              color: var(--text-secondary);
          }

          .btn-outline:hover {
              background: var(--bg-tertiary);
              border-color: var(--accent-color);
              color: var(--text-primary);
          }

          .email-preview {
              flex: 1;
              overflow: hidden;
              background: var(--bg-primary);
          }

          .email-preview iframe {
              width: 100%;
              height: 100%;
              border: none;
          }

          .empty-state {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100%;
              color: var(--text-muted);
          }

          .empty-state-icon {
              font-size: 4rem;
              margin-bottom: 1rem;
              opacity: 0.5;
          }

          .empty-state h3 {
              margin-bottom: 0.5rem;
              color: var(--text-secondary);
          }

          .sidebar-empty {
              display: flex;
              height: 100%;
              color: var(--text-muted);
              text-align: center;
              padding: 2rem;
          }

          .sidebar-empty p {
              font-size: 0.9rem;
              color: var(--text-secondary);
          }

          .loading {
              text-align: center;
              padding: 2rem;
              color: var(--text-muted);
          }

          .unread-dot {
              width: 8px;
              height: 8px;
              background: var(--accent-color);
              border-radius: 50%;
              position: absolute;
              left: 0.75rem;
              top: 50%;
              transform: translateY(-50%);
          }

          .modal-overlay {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.5);
              display: none;
              align-items: center;
              justify-content: center;
              z-index: 1000;
              backdrop-filter: blur(2px);
              transition all .6s ease-in-out
          }

          .modal-overlay.show {
              display: flex;
          }

          .modal {
              background: var(--bg-primary);
              border: 1px solid var(--border-color);
              border-radius: 12px;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
              max-width: 420px;
              width: 90%;
              max-height: 90vh;
              overflow: hidden;
              transform: scale(0.9);
              transition: transform 0.2s ease;
              transition all .6s ease-in-out
          }

          .modal-overlay.show .modal {
              transform: scale(1);
          }

          .modal-header {
              padding: 1.5rem 1.5rem 1rem;
              border-bottom: 1px solid var(--border-color);
          }

          .modal-icon {
              width: 48px;
              height: 48px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 1.5rem;
              margin-bottom: 1rem;
          }

          .modal-icon.danger {
              background: #92bee2;
          }

          .modal-title {
              font-size: 1.125rem;
              font-weight: 600;
              color: var(--text-primary);
              margin-bottom: 0.5rem;
          }

          .modal-message {
              color: var(--text-secondary);
              line-height: 1.5;
              font-size: 0.9rem;
          }

          .modal-body {
              padding: 1rem 1.5rem 1.5rem;
          }

          .modal-actions {
              display: flex;
              gap: 0.75rem;
              justify-content: flex-end;
          }

          .btn-secondary {
              background: var(--bg-tertiary);
              color: var(--text-primary);
              border: 1px solid var(--border-color);
          }

          .btn-secondary:hover {
              background: var(--bg-secondary);
          }

          body.modal-open {
              overflow: hidden;
          }


          .animate-slideUp {
            animation: slideUp 0.3s ease-in-out;
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
      </style>
  </head>

  <body class="animate-slideUp">
      <div class="header">
          <div class="header-left">
              <div class='logo-wrapper'>
                <img src='${path}/assets/logo.png' alt='Dev Mailbox Logo' style='height: 40px' />
                <h2 style='font-size: 20px'>Dev Mailbox</h2>
              </div>
              <div class="search-box">
                  <input type="text" class="search-input" placeholder="Search emails..." id="search-input">
                  <span class="search-icon">🔍</span>
              </div>
          </div>
          <div class="header-actions">
              <span class="email-count" id="email-count">Loading...</span>
              <button class="theme-toggle" onclick="toggleTheme()" title="Toggle theme">
                  <span id="theme-icon">🌙</span>
              </button>
              <button id='clear-all-btn' class="btn btn-danger" onclick="clearAllEmails()">Clear All</button>
          </div>
      </div>

      <div class="main-container">
          <div class="sidebar">
              <div class="email-list" id="email-list">
                  <div class="loading">Loading emails...</div>
              </div>
          </div>

          <div class="content-area">
              <div class="empty-state" id="empty-state">
                  <img src='${path}/assets/mail.svg' style='width: 75px; height: 100px;' />
                  <h3>No email selected</h3>
                  <p>Choose an email from the list to view its content</p>
              </div>

              <div class="email-detail-header" id="email-detail-header" style="display: none;">
                  <h2 id="email-title"></h2>
                  <div class="email-meta-row">
                      <span class="email-meta-label">From:</span>
                      <span class="email-meta-value" id="email-from-detail"></span>
                  </div>
                  <div class="email-meta-row">
                      <span class="email-meta-label">To:</span>
                      <span class="email-meta-value" id="email-to-detail"></span>
                  </div>
                  <div class="email-meta-row">
                      <span class="email-meta-label">Date:</span>
                      <span class="email-meta-value" id="email-date-detail"></span>
                  </div>
                  <div class="email-actions">
                      <button class="btn btn-outline" onclick="deleteCurrentEmail()">🗑️ Delete</button>
                  </div>
              </div>
              <div class="email-preview" id="email-preview" style="display: none;"></div>
          </div>
      </div>


      <div class="modal-overlay" id="confirmation-modal">
          <div class="modal">
              <div class="modal-header">
                  <div class="modal-icon danger" id="modal-icon">
                  <img src='${path}/assets/warn.svg' style='width: 35px; height: 100px;' />
                  </div>
                  <div class="modal-title" id="modal-title">Confirm Action</div>
                  <div class="modal-message" id="modal-message">Are you sure you want to proceed?</div>
              </div>
              <div class="modal-body">
                  <div class="modal-actions">
                      <button class="btn btn-secondary" onclick="closeConfirmationModal()">Cancel</button>
                      <button class="btn btn-danger" id="confirm-action-btn" onclick="confirmAction()">Confirm</button>
                  </div>
              </div>
          </div>
      </div>

      <script>
          let emails = [];
          let selectedEmailId = null;
          let filteredEmails = [];
          let pendingAction = null;

          function toggleTheme() {
              const html = document.documentElement;
              const currentTheme = html.getAttribute('data-theme');
              const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

              html.setAttribute('data-theme', newTheme);
              localStorage.setItem('theme', newTheme);

              document.getElementById('theme-icon').textContent = newTheme === 'dark' ? '☀️' : '🌙';
          }

          const savedTheme = localStorage.getItem('theme') || 'dark';
          document.documentElement.setAttribute('data-theme', savedTheme);
          document.getElementById('theme-icon').textContent = savedTheme === 'dark' ? '☀️' : '🌙';

          function showConfirmationModal(title, message, confirmText, action) {
              const modal = document.getElementById('confirmation-modal');
              const modalTitle = document.getElementById('modal-title');
              const modalMessage = document.getElementById('modal-message');
              const confirmBtn = document.getElementById('confirm-action-btn');

              modalTitle.textContent = title;
              modalMessage.textContent = message;
              confirmBtn.textContent = confirmText;
              pendingAction = action;

              modal.classList.add('show');
              document.body.classList.add('modal-open');
          }

          function closeConfirmationModal() {
              const modal = document.getElementById('confirmation-modal');
              modal.classList.remove('show');
              document.body.classList.remove('modal-open');
              pendingAction = null;
          }

          function confirmAction() {
              if (pendingAction) {
                  pendingAction();
              }
              closeConfirmationModal();
          }


          document.getElementById('confirmation-modal').addEventListener('click', function(e) {
              if (e.target === this) {
                  closeConfirmationModal();
              }
          });


          document.addEventListener('keydown', function(e) {
              if (e.key === 'Escape' && document.getElementById('confirmation-modal').classList.contains('show')) {
                  closeConfirmationModal();
              }
          });

          async function loadEmails() {
              try {
                  const response = await fetch('${path}/api/emails');
                  const data = await response.json();
                  emails = data.emails;
                  filteredEmails = [...emails];
                  renderEmailList();
                  updateEmailCount();

                  if (emails.length === 0) {
                    document.getElementById('empty-state').style.display = 'flex';
                    document.getElementById('email-detail-header').style.display = 'none';
                    document.getElementById('email-preview').style.display = 'none';
                  }
              } catch (error) {
                  console.error('Failed to load emails:', error);
              }
          }

          function filterEmails() {
              const searchTerm = document.getElementById('search-input').value.toLowerCase();
              filteredEmails = emails.filter(email =>
                  email.subject.toLowerCase().includes(searchTerm) ||
                  email.from.toLowerCase().includes(searchTerm) ||
                  (Array.isArray(email.to) ? email.to.join(' ') : email.to).toLowerCase().includes(searchTerm)
              );
              renderEmailList();
          }

          function renderEmailList() {
              const listElement = document.getElementById('email-list');

              if (filteredEmails.length === 0) {
                  if (emails.length === 0) {
                      listElement.innerHTML = \`
                          <div class="sidebar-empty">
                              <div>
                                  <h3 style='font-weight: 500'>No emails yet</h3>
                                  <p style='margin-top: 3px'>Start sending emails by calling <code>sendEmail()</code> in your app.</p>
                              </div>
                          </div>
                      \`;
                  } else {
                      listElement.innerHTML = \`
                          <div class="sidebar-empty">
                              <div>
                                  <h3>No emails match your search</h3>
                              </div>
                          </div>
                      \`;
                  }
                  document.getElementById('clear-all-btn').style.display = 'none';
                  return;
              } else {
                  document.getElementById('clear-all-btn').style.display = 'block';
              }

              listElement.innerHTML = filteredEmails.map(email => \`
                  <div class="email-item \${email.id === selectedEmailId ? 'active' : ''}" onclick="selectEmail('\${email.id}')">
                      <div class="email-header-info">
                          <div class="email-from">\${escapeHtml(email.from)}</div>
                          <div class="email-time">\${formatTime(email.timestamp)}</div>
                      </div>
                      <div class="email-subject">\${escapeHtml(email.subject)}</div>
                      <div class="email-to">To: \${escapeHtml(Array.isArray(email.to) ? email.to.join(', ') : email.to)}</div>
                  </div>
              \`).join('');
          }

          function formatTime(timestamp) {
              const date = new Date(timestamp);
              const now = new Date();
              const diffTime = now - date;
              const diffHours = diffTime / (1000 * 60 * 60);

              if (diffHours < 24) {
                  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              } else if (diffHours < 24 * 7) {
                  return date.toLocaleDateString([], { weekday: 'short' });
              } else {
                  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
              }
          }

          function updateEmailCount() {
              const count = filteredEmails.length;
              const total = emails.length;
              document.getElementById('email-count').textContent =
                  count === total ? \`\${count} \${count === 1 ? 'email' : 'emails'}\` : \`\${count} of \${total} emails\`;
          }

          async function selectEmail(emailId) {
              selectedEmailId = emailId;
              renderEmailList();

              try {
                  const response = await fetch(\`${path}/api/emails/\${emailId}\`);
                  const email = await response.json();
                  showEmailPreview(email);
              } catch (error) {
                  console.error('Failed to load email:', error);
              }
          }

          function showEmailPreview(email) {
              const emptyState = document.getElementById('empty-state');
              const emailHeader = document.getElementById('email-detail-header');
              const emailPreview = document.getElementById('email-preview');

              emptyState.style.display = 'none';
              emailHeader.style.display = 'block';
              emailPreview.style.display = 'block';

              document.getElementById('email-title').textContent = email.subject;
              document.getElementById('email-from-detail').textContent = email.from;
              document.getElementById('email-to-detail').textContent = Array.isArray(email.to) ? email.to.join(', ') : email.to;
              document.getElementById('email-date-detail').textContent = new Date(email.timestamp).toLocaleString();

              const iframe = document.createElement('iframe');
              iframe.srcdoc = email.html;
              iframe.style.width = '100%';
              iframe.style.height = '100%';
              iframe.style.border = 'none';

              iframe.addEventListener("load", () => {
                 try {
                   const links = iframe.contentDocument.querySelectorAll("a[href]");
                   links.forEach(link => {
                     link.setAttribute("target", "_blank");
                     link.setAttribute("rel", "noopener noreferrer");
                   });
                 } catch (err) {
                   console.warn("Could not adjust links in iframe:", err);
                 }
               });

              emailPreview.innerHTML = '';
              emailPreview.appendChild(iframe);
          }

          async function deleteCurrentEmail() {
              if (!selectedEmailId) return;

              const currentEmail = emails.find(e => e.id === selectedEmailId);
              const emailSubject = currentEmail ? currentEmail.subject : 'this email';

              showConfirmationModal(
                  'Delete Email',
                  \`Are you sure you want to delete "\${emailSubject}"? This action cannot be undone.\`,
                  'Delete Email',
                  async function() {
                      try {
                          await fetch(\`${path}/api/emails/\${selectedEmailId}\`, { method: 'DELETE' });

                          // Remove from local arrays
                          emails = emails.filter(e => e.id !== selectedEmailId);
                          filteredEmails = filteredEmails.filter(e => e.id !== selectedEmailId);

                          selectedEmailId = null;
                          renderEmailList();
                          updateEmailCount();

                          // Show empty state
                          document.getElementById('empty-state').style.display = 'flex';
                          document.getElementById('email-detail-header').style.display = 'none';
                          document.getElementById('email-preview').style.display = 'none';
                      } catch (error) {
                          console.error('Failed to delete email:', error);
                          alert('Failed to delete email');
                      }
                  }
              );
          }

          async function clearAllEmails() {
              const emailCount = emails.length;

              showConfirmationModal(
                  'Clear All Emails',
                  \`Are you sure you want to permanently delete all emails (\${emailCount})? This action cannot be undone and will remove all emails from your mailbox.\`,
                  'Clear All',
                  async function() {
                      try {
                          await fetch('${path}/api/emails', { method: 'DELETE' });
                          emails = [];
                          filteredEmails = [];
                          selectedEmailId = null;
                          renderEmailList();
                          updateEmailCount();

                          document.getElementById('empty-state').style.display = 'flex';
                          document.getElementById('email-detail-header').style.display = 'none';
                          document.getElementById('email-preview').style.display = 'none';
                      } catch (error) {
                          console.error('Failed to clear emails:', error);
                          alert('Failed to clear emails');
                      }
                  }
              );
          }

          function escapeHtml(text) {
              const div = document.createElement('div');
              div.textContent = text;
              return div.innerHTML;
          }

          document.getElementById('search-input').addEventListener('input', filterEmails);

          setInterval(loadEmails, 5000);

          loadEmails();
      </script>
  </body>
  </html>
      `;
}
//# sourceMappingURL=dev-mail-ui.js.map