class HSLDepartureCard extends HTMLElement {
  setConfig(config) {
    if (!config.entity) {
      throw new Error("Entity is required (e.g. sensor.kamppi_h1248_next_departure)");
    }
    this.config = config;
  }

  set hass(hass) {
    const sensor = hass.states[this.config.entity];

    if (!sensor) {
      this.innerHTML = `<div class="card">Error: sensor "${this.config.entity}" not found.</div>`;
      return;
    }

    const data = sensor.attributes.departures || [];
    const now = new Date();
	

    const style = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700&display=swap');
        .card {
          font-family: 'Roboto Condensed', sans-serif;
          background-color: var(--ha-card-background, var(--card-background-color, #fff));
          padding: 1em;
          border-radius: 1em;
          color: var(--primary-text-color, #000);
		  font-size: clamp(0.8em, 1.2vw, 1.2em);
        }
        .header, .departure {
          display: grid;
          grid-template-columns: 10% auto 10%;
          align-items: left;
      
          padding: 0.8em 0.1em 0.8em 0.1em;
        }
        .header {
          font-weight: bold;
          border-bottom: 2.5px solid var(--primary-text-color, #000);
          font-size: 0.8em;
          padding-bottom: 0.5em;
		  padding-top: 0.5em;
          text-align: left;
        }
        .departure {
          border-bottom: 0.3vh dotted var(--primary-text-color, #000);
        }
        .departure:first-of-type {
          border-top: 2.5px solid var(--primary-text-color, #000);
        }
        .departure:last-child {
          border-bottom: none;
        }
        .route {
          font-size: 1em;
          font-weight: bold;
          text-align: left;
          border-radius: 0.3em;
        }
        .headsign {
          text-align: left;
		  font-size: 1em;
        }
        .time {
          text-align: right;
		  font-size: 1em;
          font-weight: bold;
          padding-right: 0.1em;
          justify-self: end;
        }
      </style>
    `;

    const header = `
      <div class="header">
        <div>Linja</div>
        <div>Määränpää</div>
        <div class="time">Aika/min</div>
      </div>
    `;

    const content = data.slice(0, 5).map(dep => {
      const route = dep.route;
      const headsign = dep.headsign;
      const realtime = dep.realtimeDeparture || dep.scheduledDeparture;
      const depTime = new Date(realtime);
      const diff = Math.round((depTime - now) / 60000);
      const timeStr = diff < 5 && diff >= 0 ? `${diff}` : `~${depTime.toLocaleTimeString('fi-FI', {hour: '2-digit',minute: '2-digit',hour12: false}).replace('.', ':')}`;
      return `
        <div class="departure">
          <div class="route">${route}</div>
          <div class="headsign">${headsign}</div>
          <div class="time">${timeStr}</div>
        </div>
      `;
    }).join('');

    this.innerHTML = `
      ${style}
      <div class="card">
        ${header}
        ${content || '<p>Ei lähtöjä saatavilla</p>'}
      </div>
    `;
  }

  getCardSize() {
    return 5;
  }
}

customElements.define('hsl-departure-card', HSLDepartureCard);
