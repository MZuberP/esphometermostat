    async function update() {
      const r = await fetch('/climate/termostat_salon');
      const d = await r.json();

      document.body.innerHTML = `
        <h1>Termostat</h1>
        <h2>${d.current_temperature} °C</h2>
        <h3>SET: ${d.target_temperature}</h3>
        <button onclick="setTemp(-0.5)">-</button>
        <button onclick="setTemp(0.5)">+</button>
      `;
    }

    async function setTemp(delta) {
      const r = await fetch('/climate/termostat_salon');
      const d = await r.json();

      await fetch('/climate/termostat_salon/set', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          target_temperature: d.target_temperature + delta
        })
      });

      update();
    }

    setInterval(update, 2000);
    update();
