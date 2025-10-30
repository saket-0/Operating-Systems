lucide.createIcons();

let totalTickets = 0;
let availableTickets = 0;
let readers = 0;
let writers = 0;
let userId = 1;

// Get references to all interactive elements
const initScreen = document.getElementById("initScreen");
const mainScreen = document.getElementById("mainScreen");
const logContainer = document.getElementById("logContainer");
const emptyLog = document.querySelector("#logContainer .empty");

const viewBtn = document.getElementById("viewBtn");
const bookBtn = document.getElementById("bookBtn");
const bookCountInput = document.getElementById("bookCount");

function addLog(type, message, uid = 0) {
  // Hide the "empty" message on the first log
  if (emptyLog) {
    emptyLog.style.display = "none";
  }

  const log = document.createElement("div");
  log.className = `log-entry ${type}`;
  const time = new Date().toLocaleTimeString();
  log.innerHTML = `<strong>${type.toUpperCase()} ${uid ? uid : ""}</strong> — ${message} <span>(${time})</span>`;
  logContainer.prepend(log);
}

document.getElementById("initBtn").onclick = () => {
  totalTickets = parseInt(document.getElementById("totalTickets").value);
  if (totalTickets > 0) {
    availableTickets = totalTickets;
    initScreen.classList.add("hidden");
    mainScreen.classList.remove("hidden");
    updateDisplay();
    addLog("system", `System initialized with ${totalTickets} tickets`);
  }
};

document.getElementById("viewBtn").onclick = async () => {
  const id = userId++;
  readers++;
  updateDisplay();

  // --- SIMULATION LOCK ---
  // Lock out writers while readers are active
  bookBtn.disabled = true;
  bookCountInput.disabled = true;
  // --- END LOCK ---

  addLog("reader", `Checking tickets... Available = ${availableTickets}`, id);
  await delay(1000); // Simulate read time

  readers--;
  updateDisplay();

  // --- SIMULATION UNLOCK ---
  // If this is the last reader, unlock writers
  if (readers === 0) {
    bookBtn.disabled = false;
    bookCountInput.disabled = false;
  }
  // --- END UNLOCK ---

  addLog("system", `Reader ${id} finished`, id);
};

document.getElementById("bookBtn").onclick = async () => {
  const count = parseInt(bookCountInput.value);
  
  // Added validation feedback
  if (!count || count <= 0) {
    addLog("error", "Please enter a positive number of tickets to book.");
    return; 
  }

  const id = userId++;
  writers++;
  updateDisplay();

  // --- SIMULATION LOCK ---
  // Lock out ALL other operations (readers and writers)
  bookBtn.disabled = true;
  viewBtn.disabled = true;
  bookCountInput.disabled = true;
  // --- END LOCK ---

  addLog("writer", `Attempting to book...`, id);
  await delay(500); // Simulate time to acquire lock

  if (availableTickets >= count) {
    addLog("writer", `Booking ${count} ticket(s)...`, id);
    await delay(1000); // Simulate booking time
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

  // --- SIMULATION UNLOCK ---
  // Unlock all operations
  // (We check 'readers' in case a reader task was queued, though with this logic it can't be)
  if (readers === 0) {
    bookBtn.disabled = false;
    bookCountInput.disabled = false;
  }
  viewBtn.disabled = false;
  // --- END UNLOCK ---
  
  // Clear input field for good UX
  bookCountInput.value = "";
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