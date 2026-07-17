import { LitElement, html, css } from "https://unpkg.com/lit?module";

class BandeauCard extends LitElement {

  static properties = {
    hass: {},
    config: {},
    graphEntity: {},
    historyData: {}
  };

  setConfig(config) {
    this.config = config;
  }

  static styles = css`

    ha-card {
      border-radius: 20px;
      overflow: hidden;
      border: 1px rgba(0,0,0,0.4) outset;
      box-shadow: 2px 2px 4px 0px rgba(0,0,0,0.5) !important;
    }


    .screen {
      position: relative;
      max-width: 500px;
      margin: 0 auto;
      padding: 5px;
      border-radius: 20px;
      background: linear-gradient(#a8c8e8 0%, #dfeaf5 55%, #7fb3d5 100%);
      box-shadow: rgba(50, 50, 93, 0) 0px 50px 100px -20px, rgba(0, 0, 0, 0) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset !important;
    }

    /* ===== TEMP STYLE ===== */
    :host {
      --temp-color: #111;

    }

    .temp-cold { --temp-color: #00BFFF; }
    .temp-good { --temp-color: #008000; }
    .temp-warm { --temp-color: #FF8C00; }
    .temp-hot  { --temp-color: #FF0000; }

  
    .big {
      display: grid;
      place-items: center;

      font-family: 'DSEG7', monospace;
      font-size: 50px;
      cursor: pointer;

      color: var(--temp-color);
    }

    /* couche fond */
    .big::before {
      content: attr(data-bg);
      grid-area: 1 / 1;
      color: rgba(0,0,0,0.03);
    }
 
    /* couche valeur */
    .big span {
      grid-area: 1 / 1;
    }

    /* ===== ROWS ===== */
    .row {
      display: grid;
      padding: 0px 5px;
      gap: 10px;
    }


    .title {
      font-family: 'DSEG14_B_I', monospace;
      font-size: 23px;
      opacity: 0.9;
      text-align: center;
    }

    /* ===== ICON ===== */
    .row.title {
      position: relative;
      grid-template-columns: 1fr;
    }

    /* ===== ICON ===== */
    .row.top {
      position: relative;
      grid-template-columns: 1fr 1fr 1fr;
      align-items: center;
    }

    .icon {
      font-family: 'DSEGWeather', monospace !important;
      position: relative;
      text-align: center;
      font-size: 70px;
      line-height: 1;
    }

    /* ===== MIN MAX ===== */
    .tempbox {
      display: grid;
      text-align: center;
      align-items: center;
      align-self: center;
      font-family: 'DSEG7', monospace;
      font-size: 11px;
      background: linear-gradient(.25turn, rgba(0,0,255,0.55) 0%, rgba(255,255,255,1) 50%, rgba(255,0,0,0.55) 100%);
      border-radius: 12px;
      padding: 8px;
      border: 1px dashed black;
      grid-template-columns: 1fr 1fr 1fr;
    }

    .cursor {
      position: absolute;
      top: -3px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: white;
      border: 2px solid black;
      transform: translateX(-50%);
    }

    .row.infos {
      position: relative;
      grid-template-columns: 1fr 1fr 1fr;
      align-items: center;
    }

    .infos {
      font-family: 'DSEG14_B_I', monospace;
      font-size: 14px;
      opacity: 0.7;
      text-align: center;
    }
    
    .icon-small {
      text-align: center;
      line-height: 1;
    }

    .icon-small ha-icon {
      --mdc-icon-size: 34px;
      color: gold;
    }
  `;

  getState(e) {
    const state = this.hass.states[e]?.state;

    if (
      state === undefined ||
      state === null ||
      state === "unknown" ||
      state === "unavailable"
    ) {
      return "888";
    }

    return state;
  }

  getTempClass(temp) {
    const t = parseFloat(temp);
    if (t <= 10) return "temp-cold";
    if (t <= 23) return "temp-good";
    if (t <= 28) return "temp-warm";
    return "temp-hot";
  }


  getWeatherIcon(state) {
    const map = {
      clear: "1",
      "clear-night": "1",
      cloudy: "2",
      fog: "☁",
      hail: "4",
      lightning: "8",
      "lightning-rainy": "6",
      partlycloudy: "9",
      pouring: "4",
      rainy: "3",
      snowy: "5",
      "snowy-rainy": "5",
      sunny: "1",
      windy: "B",
      "windy-variant": "B",
      exceptional: "C",

    };
    return map[state] || "C";
  }

  getMoonIcon(state) {
    const map = {
      "new_moon": "mdi:moon-new",
      "waxing_crescent": "mdi:moon-waxing-crescent",
      "first_quarter": "mdi:moon-first-quarter",
      "waxing_gibbous": "mdi:moon-waxing-gibbous",
      "full_moon": "mdi:moon-full",
      "waning_gibbous": "mdi:moon-waning-gibbous",
      "last_quarter": "mdi:moon-last-quarter",
      "waning_crescent": "mdi:moon-waning-crescent"
    };
    return map[state] || "mdi:moon";
  }



  render() {

    const c = this.config;
    const temp = this.getState(c.temperature);
    const min = parseFloat(this.getState(c.temp_min));
    const max = parseFloat(this.getState(c.temp_max));

    const percent = ((temp - min) / (max - min || 1)) * 100;

    return html`
      <ha-card>
        <div class="screen">

          <!-- LIGNE TITLE -->
          <div class="row title">
            
            <!-- TITLE -->
            <div class="title">
              <div>
                ${c.title}
              </div>
            </div>
          </div>
          
          <!-- LIGNE INFOS -->
          <div class="row infos">
            
            <!-- DATE -->
            <div class="infos">
              <div>
                ${this.getState(c.date)}
              </div>
            </div>

            <!-- LUNE -->
            <div class="icon-small">
              <ha-icon icon="${this.getMoonIcon(this.hass.states[c.moon]?.state)}"></ha-icon>
            </div>

            <!-- EPHEMERIDE -->
            <div class="infos">
              <div>
                ${this.getState(c.saint)}
              </div>
            </div>

          </div>



          <!-- LIGNE TEMP & ICON -->
          <div class="row top">
            
            <!-- TEMP -->
            <div class="big ${this.getTempClass(temp)}"
                 data-bg="88.8°"
                 style="cursor:pointer"
                 @click=${() => this.handleTapAction(c.temperature_action || { action: "more-info", entity: c.temperature })}>

              <span>${temp}°</span>
            </div>

            <!-- ICON -->
            <div class="icon"
                style="cursor:pointer"
                @click=${() => this.handleTapAction(c.weather_action || { action: "more-info", entity: c.weather })}>
              ${this.getWeatherIcon(this.hass.states[c.weather]?.state)}
            </div>

            <!-- MIN/MAX -->
            <div class="tempbox">
              <div>${min}°</div>
              <div>/</div>
              <div>${max}°</div>
            </div>

          </div>







        </div>
      </ha-card>
    `;
  }

  handleTapAction(actionConfig) {
    if (!actionConfig) return;
  
    // Si l'action est configurée sous forme de chaîne (compatibilité ou raccourci)
    const action = typeof actionConfig === 'string' ? { action: "more-info", entity: actionConfig } : actionConfig;
  
    switch (action.action) {
      case "more-info":
        // Utilise l'entité spécifiée dans l'action, ou celle par défaut
        const entityId = action.entity || action.entity_id;
        if (!entityId) return;
        
        this.dispatchEvent(new CustomEvent("hass-more-info", {
          detail: { entityId: entityId },
          bubbles: true,
          composed: true
        }));
        break;
  
      case "navigate":
        if (action.navigation_path) {
          window.history.pushState(null, "", action.navigation_path);
          window.dispatchEvent(new Event("location-changed"));
        }
        break;
  
      case "call-service":
      case "perform-action": // HA a renommé call-service en perform-action récemment
        const serviceName = action.service || action.action;
        if (!serviceName) return;
        const [domain, service] = serviceName.split(".");
        this.hass.callService(domain, service, action.service_data || action.data || {});
        break;
    }
  }
}

customElements.define('bandeau-card', BandeauCard);
