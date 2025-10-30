lucide.createIcons();

// --- MODIFIED: Set default tickets ---
let totalTickets = 50;
let availableTickets = 50;
// ------------------------------------

let readers = 0;
let writers = 0;
let userId = 1;

// Get references to all interactive elements
// const initScreen = document.getElementById("initScreen"); // <-- Removed
const mainScreen = document.getElementById("mainScreen");
const logContainer = document.getElementById("logContainer");
const emptyLog = document.querySelector("#logContainer .empty");

const viewBtn = document.getElementById("viewBtn");
const bookBtn = document.getElementById("bookBtn");
const bookCountInput = document.getElementById("bookCount");
const restockBtn = document.getElementById("restockBtn");
const restockCountInput = document.getElementById("restockCount");

// --- Helper functions to lock/unlock UI ---
function lockWriters() {
  bookBtn.disabled = true;
  bookCountInput.disabled = true;
  restockBtn.disabled = true;
  restockCountInput.disabled = true;
}

function unlockWriters() {
  bookBtn.disabled = false;
  bookCountInput.disabled = false;
  restockBtn.disabled = false;
  restockCountInput.disabled = false;
}

function lockReaders() {
  viewBtn.disabled = true;
}

function unlockReaders() {
  viewBtn.disabled = false;
}
// ------------------------------------------

function addLog(type, message, uid = 0) {
  if (emptyLog && emptyLog.style.display !== "none") {
    emptyLog.style.display = "none";
  }

  const log = document.createElement("div");
  log.className = `log-entry ${type}`;
  const time = new Date().toLocaleTimeString();
  log.innerHTML = `<strong>${type.toUpperCase()} ${uid ? uid : ""}</strong> — ${message} <span>(${time})</span>`;
  logContainer.prepend(log);
}

// --- REMOVED 'initBtn.onclick' handler ---

// --- NEW: Function to run on page load ---
function initializeSystem() {
  updateDisplay();
  addLog("system", `System initialized with ${totalTickets} tickets`);
}
// ------------------------------------------

document.getElementById("viewBtn").onclick = async () => {
  const id = userId++;
  readers++;
  updateDisplay();

  lockWriters();

  addLog("reader", `Checking tickets... Available = ${availableTickets}`, id);
  await delay(1000); 

  readers--;
  updateDisplay();

  if (readers === 0) {
    unlockWriters();
  }

  addLog("system", `Reader ${id} finished`, id);
};

document.getElementById("bookBtn").onclick = async () => {
  const count = parseInt(bookCountInput.value);
  
  if (!count || count <= 0) {
    addLog("error", "Please enter a positive number of tickets to book.");
    return; 
  }

  const id = userId++;
  writers++;
  updateDisplay();

  lockWriters();
  lockReaders();

  addLog("writer", `Attempting to book...`, id);
  await delay(500); 

  if (availableTickets >= count) {
    addLog("writer", `Booking ${count} ticket(s)...`, id);
    await delay(1000); 
    availableTickets -= count;
    updateDisplay();
    addLog("success", `Booking successful! Remaining = ${availableTickets}`, id);
  } else if (availableTickets > 0) {
    addLog("error", `Only ${availableTickets} left! Cannot book ${count}.`, id);
  } else {
    addLog("error", `No tickets available!`, id);
  }

  writers--;
  updateDisplay();

  unlockReaders();
  if (readers === 0) {
    unlockWriters();
  }
  
  bookCountInput.value = "";
};

document.getElementById("restockBtn").onclick = async () => {
  const count = parseInt(restockCountInput.value);

  if (!count || count <= 0) {
    addLog("error", "Please enter a positive number of tickets to add.");
    return;
  }

  const id = userId++;
  writers++; 
  updateDisplay();

  lockWriters();
  lockReaders();

  addLog("system", `Restocking ${count} ticket(s)...`, id);
  await delay(1000); 

  availableTickets += count;
  totalTickets += count; 
  updateDisplay();
  addLog("success", `Restock successful! New total = ${availableTickets}`, id);

  writers--;
  updateDisplay();

  unlockReaders();
  if (readers === 0) {
    unlockWriters();
  }

  restockCountInput.value = "";
};

function updateDisplay() {
  document.getElementById("availableTickets").textContent = availableTickets;
  document.getElementById("activeReaders").textContent = readers;
  document.getElementById("activeWriters").textContent = writers;
  document.getElementById("ticketsBooked").textContent = totalTickets - availableTickets;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// --- NEW: Call the initialization function ---
initializeSystem();
// -------------------------------------------