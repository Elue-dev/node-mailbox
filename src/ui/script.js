const PATH = window.DEV_MAILBOX_PATH;

class EmailDatabase {
  constructor() {
    this.dbName = "DevMailboxDB";
    this.version = 1;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("emails")) {
          const emailStore = db.createObjectStore("emails", { keyPath: "id" });
          emailStore.createIndex("timestamp", "timestamp", { unique: false });
        }
      };
    });
  }

  async saveEmail(email) {
    const transaction = this.db.transaction(["emails"], "readwrite");
    const store = transaction.objectStore("emails");
    return store.put(email);
  }

  async getAllEmails() {
    const transaction = this.db.transaction(["emails"], "readonly");
    const store = transaction.objectStore("emails");
    const index = store.index("timestamp");
    return new Promise((resolve, reject) => {
      const request = index.getAll();
      request.onsuccess = () => resolve(request.result.reverse());
      request.onerror = () => reject(request.error);
    });
  }

  async getEmail(id) {
    const transaction = this.db.transaction(["emails"], "readonly");
    const store = transaction.objectStore("emails");
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteEmail(id) {
    const transaction = this.db.transaction(["emails"], "readwrite");
    const store = transaction.objectStore("emails");
    return store.delete(id);
  }

  async clearAllEmails() {
    const transaction = this.db.transaction(["emails"], "readwrite");
    const store = transaction.objectStore("emails");
    return store.clear();
  }

  async syncWithServer(serverEmails) {
    const localEmails = await this.getAllEmails();
    const localEmailIds = new Set(localEmails.map((e) => e.id));
    const serverEmailIds = new Set(serverEmails.map((e) => e.id));

    const newEmails = serverEmails.filter((e) => !localEmailIds.has(e.id));
    for (const email of newEmails) {
      await this.saveEmail(email);
    }

    if (serverEmails.length > 0) {
      const emailsToDelete = localEmails.filter(
        (e) => !serverEmailIds.has(e.id),
      );
      for (const email of emailsToDelete) {
        await this.deleteEmail(email.id);
      }
    }

    return this.getAllEmails();
  }
}

let emails = [];
let selectedEmailId = null;
let filteredEmails = [];
let pendingAction = null;
let emailDB = null;
let isOnline = navigator.onLine;
let syncInProgress = false;

async function initDatabase() {
  try {
    emailDB = new EmailDatabase();
    await emailDB.init();
  } catch (error) {
    console.error("Failed to initialize IndexedDB:", error);
  }
}

function updateSyncStatus(status, message = "") {
  // const syncStatusEl = document.getElementById('sync-status');
  // syncStatusEl.className = \`sync-status \${status}\`;
  // syncStatusEl.textContent = message;
}

function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

  document.getElementById("theme-icon").textContent =
    newTheme === "dark" ? "☀️" : "🌙";
}

const savedTheme = localStorage.getItem("theme") || "dark";
document.documentElement.setAttribute("data-theme", savedTheme);
document.getElementById("theme-icon").textContent =
  savedTheme === "dark" ? "☀️" : "🌙";

function showConfirmationModal(title, message, confirmText, action) {
  const modal = document.getElementById("confirmation-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalMessage = document.getElementById("modal-message");
  const confirmBtn = document.getElementById("confirm-action-btn");

  modalTitle.textContent = title;
  modalMessage.textContent = message;
  confirmBtn.textContent = confirmText;
  pendingAction = action;

  modal.classList.add("show");
  document.body.classList.add("modal-open");
}

function closeConfirmationModal() {
  const modal = document.getElementById("confirmation-modal");
  modal.classList.remove("show");
  document.body.classList.remove("modal-open");
  pendingAction = null;
}

function confirmAction() {
  if (pendingAction) {
    pendingAction();
  }
  closeConfirmationModal();
}

document
  .getElementById("confirmation-modal")
  .addEventListener("click", function (e) {
    if (e.target === this) {
      closeConfirmationModal();
    }
  });

document.addEventListener("keydown", function (e) {
  if (
    e.key === "Escape" &&
    document.getElementById("confirmation-modal").classList.contains("show")
  ) {
    closeConfirmationModal();
  }
});

async function loadEmails() {
  if (syncInProgress) return;
  syncInProgress = true;

  try {
    if (isOnline) {
      updateSyncStatus("syncing", "Syncing...");

      const response = await fetch(`${PATH}/api/emails`, {
        headers: { "Cache-Control": "no-cache" },
      });

      if (response.ok) {
        const data = await response.json();
        const serverEmails = data.emails || [];

        if (emailDB) {
          emails = await emailDB.syncWithServer(serverEmails);
        } else {
          emails = serverEmails;
        }
        updateSyncStatus("", "");
      } else {
        throw new Error("Server response not ok");
      }
    } else {
      if (emailDB) {
        emails = await emailDB.getAllEmails();
        updateSyncStatus("error", "Offline");
      }
    }

    filteredEmails = [...emails];
    renderEmailList();
    updateEmailCount();

    if (emails.length === 0) {
      document.getElementById("empty-state").style.display = "flex";
      document.getElementById("email-detail-header").style.display = "none";
      document.getElementById("email-preview").style.display = "none";
    }
  } catch (error) {
    console.error("Failed to load emails:", error);

    if (emailDB) {
      try {
        emails = await emailDB.getAllEmails();
        filteredEmails = [...emails];
        renderEmailList();
        updateEmailCount();
        updateSyncStatus("error", "Server error");
      } catch (dbError) {
        console.error("Failed to load from IndexedDB:", dbError);
        updateSyncStatus("error", "Error");
      }
    }
  } finally {
    syncInProgress = false;
  }
}

function filterEmails() {
  const searchTerm = document
    .getElementById("search-input")
    .value.toLowerCase();
  filteredEmails = emails.filter(
    (email) =>
      email.subject.toLowerCase().includes(searchTerm) ||
      email.from.toLowerCase().includes(searchTerm) ||
      (Array.isArray(email.to) ? email.to.join(" ") : email.to)
        .toLowerCase()
        .includes(searchTerm),
  );
  renderEmailList();
}

function renderEmailList() {
  const listElement = document.getElementById("email-list");

  if (filteredEmails.length === 0) {
    if (emails.length === 0) {
      listElement.innerHTML = `
                     <div class="sidebar-empty">
                         <div>
                             <h3 style='font-weight: 500'>No emails yet</h3>
                             <p style='margin-top: 3px'>Start sending emails by calling <code>sendEmail()</code> in your app.</p>
                         </div>
                     </div>
                 `;
    } else {
      listElement.innerHTML = `
                     <div class="sidebar-empty">
                         <div>
                             <h3>No emails match your search</h3>
                         </div>
                     </div>
                 `;
    }
    document.getElementById("clear-all-btn").style.display = "none";
    return;
  } else {
    document.getElementById("clear-all-btn").style.display = "block";
  }

  listElement.innerHTML = filteredEmails
    .map(
      (email) => `
             <div class="email-item ${email.id === selectedEmailId ? "active" : ""}" onclick="selectEmail('${email.id}')">
                 <div class="email-header-info">
                     <div class="email-from">${escapeHtml(email.from)}</div>
                     <div class="email-time">${formatTime(email.timestamp)}</div>
                 </div>
                 <div class="email-subject">${escapeHtml(email.subject)}</div>
                 <div class="email-to">To: ${escapeHtml(Array.isArray(email.to) ? email.to.join(", ") : email.to)}</div>
             </div>
         `,
    )
    .join("");
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffTime = now - date;
  const diffHours = diffTime / (1000 * 60 * 60);

  if (diffHours < 24) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (diffHours < 24 * 7) {
    return date.toLocaleDateString([], { weekday: "short" });
  } else {
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  }
}

function updateEmailCount() {
  const count = filteredEmails.length;
  const total = emails.length;
  document.getElementById("email-count").textContent =
    count === total
      ? `${count} ${count === 1 ? "Email" : "Emails"}`
      : `${count} of ${total} emails`;
}

async function selectEmail(emailId) {
  selectedEmailId = emailId;
  renderEmailList();

  try {
    let email = null;

    if (isOnline) {
      try {
        const response = await fetch(`${PATH}/api/emails/${emailId}`);
        if (response.ok) {
          email = await response.json();
        }
      } catch (error) {
        console.log("Server request failed, trying IndexedDB");
      }
    }

    if (!email && emailDB) {
      email = await emailDB.getEmail(emailId);
    }

    if (email) {
      showEmailPreview(email);
    } else {
      console.error("Email not found");
    }
  } catch (error) {
    console.error("Failed to load email:", error);
  }
}

function showEmailPreview(email) {
  const emptyState = document.getElementById("empty-state");
  const emailHeader = document.getElementById("email-detail-header");
  const emailPreview = document.getElementById("email-preview");

  emptyState.style.display = "none";
  emailHeader.style.display = "block";
  emailPreview.style.display = "block";

  document.getElementById("email-title").textContent = email.subject;
  document.getElementById("email-from-detail").textContent = email.from;
  document.getElementById("email-to-detail").textContent = Array.isArray(
    email.to,
  )
    ? email.to.join(", ")
    : email.to;
  document.getElementById("email-date-detail").textContent = new Date(
    email.timestamp,
  ).toLocaleString();

  const iframe = document.createElement("iframe");
  iframe.srcdoc = email.html;
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";

  iframe.addEventListener("load", () => {
    try {
      const links = iframe.contentDocument.querySelectorAll("a[href]");
      links.forEach((link) => {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      });
    } catch (err) {
      console.warn("Could not adjust links in iframe:", err);
    }
  });

  emailPreview.innerHTML = "";
  emailPreview.appendChild(iframe);
}

async function deleteCurrentEmail() {
  if (!selectedEmailId) return;

  const currentEmail = emails.find((e) => e.id === selectedEmailId);
  const emailSubject = currentEmail ? currentEmail.subject : "this email";

  showConfirmationModal(
    "Delete Email",
    `Are you sure you want to delete "${emailSubject}"? This action cannot be undone.`,
    "Delete Email",
    async function () {
      try {
        if (isOnline) {
          try {
            await fetch(`${PATH}/api/emails/${selectedEmailId}`, {
              method: "DELETE",
            });
          } catch (error) {
            console.log("Server delete failed, continuing with local delete");
          }
        }

        if (emailDB) {
          await emailDB.deleteEmail(selectedEmailId);
        }

        emails = emails.filter((e) => e.id !== selectedEmailId);
        filteredEmails = filteredEmails.filter((e) => e.id !== selectedEmailId);

        selectedEmailId = null;
        renderEmailList();
        updateEmailCount();

        document.getElementById("empty-state").style.display = "flex";
        document.getElementById("email-detail-header").style.display = "none";
        document.getElementById("email-preview").style.display = "none";
      } catch (error) {
        console.error("Failed to delete email:", error);
        alert("Failed to delete email");
      }
    },
  );
}

async function clearAllEmails() {
  const emailCount = emails.length;

  showConfirmationModal(
    "Clear All Emails",
    `Are you sure you want to permanently delete all emails (${emailCount})? This action cannot be undone and will remove all emails from your mailbox.`,
    "Clear All",
    async function () {
      try {
        if (isOnline) {
          try {
            await fetch(`${PATH}/api/emails`, {
              method: "DELETE",
            });
          } catch (error) {
            console.log("Server clear failed, continuing with local clear");
          }
        }

        if (emailDB) {
          await emailDB.clearAllEmails();
        }

        emails = [];
        filteredEmails = [];
        selectedEmailId = null;
        renderEmailList();
        updateEmailCount();

        document.getElementById("empty-state").style.display = "flex";
        document.getElementById("email-detail-header").style.display = "none";
        document.getElementById("email-preview").style.display = "none";
      } catch (error) {
        console.error("Failed to clear emails:", error);
        alert("Failed to clear emails");
      }
    },
  );
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function refreshInbox() {
  loadEmails();
}

window.addEventListener("online", () => {
  isOnline = true;
  updateSyncStatus("syncing", "Back online");
  loadEmails();
});

window.addEventListener("offline", () => {
  isOnline = false;
  updateSyncStatus("error", "Offline");
});

document.getElementById("search-input").addEventListener("input", filterEmails);

async function init() {
  await initDatabase();

  if (emailDB) {
    try {
      emails = await emailDB.getAllEmails();
      filteredEmails = [...emails];
      renderEmailList();
      updateEmailCount();

      if (emails.length > 0) {
        updateSyncStatus("", "Loaded from cache");
      }
    } catch (error) {
      console.error("Failed to load from IndexedDB on init:", error);
    }
  }

  await loadEmails();
}

init();
