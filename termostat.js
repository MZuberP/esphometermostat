let appInitialized = false;

function createUI() {
  if (appInitialized) return;

  const container = document.createElement("div");
  container.id = "custom-thermostat";
  container.style.margin = "20px";
  container.style.padding = "20px";
  container.style.background = "#222";
  container.style.borderRadius = "15px";
  container.style.textAlign = "center";
  container.style.color = "#fff";

  container.innerHTML = `
    <h1>Termostat</h1>
    <h2 id="temp">--</h2>
    <h3 id="target">--</h3>
    <button onclick="setTemp(-0.5)">-</button>
    <button onclick="setTemp(0.5)">+</button>
  `;

  document.body.appendChild(container);
  appInitialized = true;
}

async function update() {
  try {
    const r = await fetch('/climate/termostat_salon');
    const d = await r.json();

    document.getElementById('temp').innerText =
      d.current_temperature.toFixed(1) + " °C";

    document.getElementById('target').innerText =
      "SET: " + d.target_temperature.toFixed(1);
  } catch (e) {
    console.log("API error:", e);
  }
}

async function setTemp(delta) {
  try {
    const r = await fetch('/climate/termostat_salon');
    const d = await r.json();

    await fetch('/climate/termostat_salon/set', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target_temperature: d.target_temperature + delta
      })
    });

    update();
  } catch (e) {
    console.log("SET error:", e);
  }
}

// 🔥 najważniejsze – czekamy aż ESPHome UI się załaduje
window.addEventListener("load", () => {
  setTimeout(() => {
    createUI();
    update();
    setInterval(update, 3000);
  }, 1000); // opóźnienie żeby nie walczyć z UI ESPHome
});
