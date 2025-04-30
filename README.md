
# 🚌 HSL Departure Card for Home Assistant

This custom card displays upcoming HSL (Helsinki Region Transport) departures using a specified `sensor` in a clean, HSL(ish) style layout.

## 🔧 Features

- Uses any sensor with a `departures` attribute from [Digitransit Custom Component](https://github.com/Mallonbacka/custom-component-digitransit)
- Displays 5 next departures.

## 📦 Installation

1. **Save the JavaScript file**

   Save the hsl-departure-card.js file to your Home Assistant public folder:
   ```
   /config/www/hsl-departure-card.js
   ```

2. **Add it to your resources**

   In Home Assistant, go to:

   **Settings → Dashboards → Resources tab**  
   Click **Add Resource** and fill in:

   - **URL**: `/local/hsl-departure-card.js`
   - **Type**: `JavaScript Module`

3. **Reload your browser** (clear cache if needed).

## 🧾 YAML Configuration

Example Lovelace YAML to add the card:

```yaml
type: custom:hsl-departure-card
entity: sensor.kamppi_h1248_next_departure
```

Replace the `entity` with the name of your actual sensor.

## 🔍 Requirements

You must have [Digitransit Custom Component](https://github.com/Mallonbacka/custom-component-digitransit) installed.

## 🖼️ Example

![image](https://github.com/user-attachments/assets/f46a097c-9e19-4fcd-b065-65cfd61934e3)


## 👏 Credits

Credits to [@Mallonbacka](https://github.com/Mallonbacka) for awesome [Digitransit Custom Component](https://github.com/Mallonbacka/custom-component-digitransit)
