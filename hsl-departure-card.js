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
      this.innerHTML = `<div class="card">Error: sensor \"${this.config.entity}\" not found.</div>`;
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
          padding: 1em 1.1em;
          border-radius: 1em;
          color: var(--primary-text-color, #000);
          font-size: clamp(0.78rem, 2.1vw, 1rem);
          overflow: hidden;
          box-sizing: border-box;
          max-width: 100%;
          position: relative;
          z-index: 0;
          line-height: 1.2;
        }
        .title {
          font-size: 1.8em;
          font-weight: bold;
          text-align: left;
          padding-bottom: 0.45em;
          padding-top: 0.1em;
        }
        .header, .departure {
          display: grid;
          grid-template-columns: 5.2em minmax(0, 1fr) 5.5em;
          column-gap: 0.9em;
          align-items: center;
          padding: 0.7em 0;
        }
        .header {
          font-weight: bold;
          border-bottom: 2px solid rgba(0, 0, 0, 0.18);
          color: rgba(0, 0, 0, 0.72);
          font-size: 0.8em;
          padding-bottom: 0.45em;
          padding-top: 0.2em;
          text-align: left;
        }
        .departure {
          border-bottom: 1px solid rgba(0, 0, 0, 0.12);
        }
        .departure:first-of-type {
          border-top: none;
        }
        .departure:last-child {
          border-bottom: none;
        }
        .route {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 2.1em;
          padding: 0.1em 0.55em;
          font-size: 0.98em;
          font-weight: bold;
          text-align: center;
          border-radius: 0.35em;
          background: #007ac9;
          color: #fff;
          width: fit-content;
          min-width: 2.9em;
          box-sizing: border-box;
        }
        .headsign {
          text-align: left;
          font-size: 1em;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .time {
          text-align: right;
          font-size: 1em;
          font-weight: bold;
          justify-self: end;
          white-space: nowrap;
        }
          @media (max-width: 480px) {
            .card {
              padding: 0.85em 0.8em;
              font-size: 0.72rem;
            }
            .title {
              font-size: 1.45em;
              padding-bottom: 0.35em;
            }
            .header, .departure {
              grid-template-columns: 3.9em minmax(0, 1fr) 4.7em;
              column-gap: 0.55em;
              padding: 0.58em 0;
            }
            .header {
              font-size: 0.66em;
            }
            .route {
              min-width: 2.75em;
              min-height: 2em;
              padding: 0.08em 0.45em;
              font-size: 0.95em;
            }
            .headsign {
              font-size: 0.96em;
            }
            .time {
              font-size: 0.95em;
            }
          }
      </style>
    `;

    const title = this.config.title ? `<div class="title">${this.config.title}</div>` : '';

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
        ${title}
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
