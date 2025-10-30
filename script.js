lucide.createIcons();

let totalTickets = 0;
let availableTickets = 0;
let readers = 0;
let writers = 0;
let userId = 1;

const initScreen = document.getElementById("initScreen");
const mainScreen = document.getElementById("mainScreen");
const logContainer = document.getElementById("logContainer");

function addLog(type, message, uid = 0) {
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
  addLog("reader", `Checking tickets... Available = ${availableTickets}`, id);
  await delay(1000);
  readers--;
  updateDisplay();
  addLog("system", `Reader ${id} finished`, id);
};

document.getElementById("bookBtn").onclick = async () => {
  const count = parseInt(document.getElementById("bookCount").value);
  if (!count || count <= 0) return;
  const id = userId++;
  writers++;
  updateDisplay();
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
