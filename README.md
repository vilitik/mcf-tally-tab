# Tally Tab Plugin

A MyCashflow plugin that adds a "Hotjar" style tab to left or right side of the screen, and displays a Tally.so form on click. Form and Tally library are lazy-loaded.

## Features

- Fixed tab positioned on the right (or left) side of the screen
- Lazy loading of Tally form, only loads when clicked
- Smooth slide-out animations from tab position (like Hotjar)
- Responsive design with mobile support
- Keyboard accessibility (ESC to close)
- Configurable appearance and behavior
- TODO: Support Tally dynamic height

## Installation

1. Add the plugin files to your MyCashflow theme:

   - `scripts/plugins/tally-tab.js`
   - `styles/components/tally-tab.css`

2. Include the plugin in your helpers/scripts.html MinifyJS:

   ```html
   scripts/plugins/tally-tab.js|
   ```

3. Include the CSS in your helpers/styles.html MinifyCSS:

   ```html
   styles/components/tally-tab.css|
   ```

4. Initialize the plugin helpers/scripts.html (avoid initializing in JS files as they may be aggressively cached by MinifyJS -> users may see wrong form for long time):
   ```html
   <!-- Add to helpers/scripts.html -->
   <script>
     $(document).ready(function () {
       if (typeof MCF !== "undefined" && MCF.TallyTab) {
         MCF.TallyTab.init({
           tallyUrl: "https://tally.so/embed/YOUR_FORM_ID",
           height: 584, // <- copy-paste height from Tally embed settings
         });
       }
     });
   </script>
   ```

## Advanced Configuration

```javascript
MCF.TallyTab.init({
  tallyUrl: "https://tally.so/embed/abc123",
  height: 584,
  position: "right", // 'right' or 'left'
  tabText: "Contact",
  backgroundColor: "var(--color-accent)",
  textColor: "var(--color-text-on-accent)",
  zIndex: 9999,
  tabWidth: 40,
  tabHeight: 80,
  animationDuration: 300,
});
```

## Configuration Options

| Option              | Type   | Default                       | Description                            |
| ------------------- | ------ | ----------------------------- | -------------------------------------- |
| `tallyUrl`          | string | **Required**                  | Your Tally form URL                    |
| `height`            | number | **Required**                  | Height of the form in px               |
| `position`          | string | 'right'                       | Position of the tab: 'right' or 'left' |
| `tabText`           | string | 'Palaute'                     | Text displayed on the tab              |
| `backgroundColor`   | string | 'var(--color-accent)'         | Background color of the tab            |
| `textColor`         | string | 'var(--color-text-on-accent)' | Text color of the tab                  |
| `zIndex`            | number | 9999                          | Z-index of the tab and form            |
| `tabWidth`          | number | 40                            | Width of the tab in pixels             |
| `tabHeight`         | number | 80                            | Height of the tab in pixels            |
| `animationDuration` | number | 300                           | Animation duration in milliseconds     |

## Theme Integration

The plugin automatically uses your theme's CSS variables:

- **Colors**: `--color-accent`, `--color-text-on-accent`, `--background-color`, etc.
- **Typography**: `--font-size-regular`, `--font-heading-weight`, `--line-height`
- **Spacing**: `--margin`, `--border-radius`, `--transition-fast`
- **Layout**: `--border-radius-drawers`, `--box-shadow`

## Public Methods

### updateConfig(newConfig)

Update the plugin configuration after initialization:

```javascript
MCF.TallyTab.updateConfig({
  tabText: "New Text",
  backgroundColor: "#ff0000",
});
```

### destroy()

Remove the tab and form from the page:

```javascript
MCF.TallyTab.destroy();
```

## Tally Form Integration

The plugin automatically adds these parameters to your Tally URL for optimal integration:

- `alignLeft=1`
- `hideTitle=1`
- `transparentBackground=1`
- `dynamicHeight=1`

So if your original URL is:

```
https://tally.so/embed/abc123
```

It becomes:

```
https://tally.so/embed/abc123?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1
```

## Requirements

- Theme based on the new MCF default theme ("Fluid")
- jQuery (included in default MyCashflow themes)

## License

Copyright [c] 2025 Vili Tikkanen. Kaikki oikeudet pidätetään.

Jokaiselle tämän ohjelmiston hallussapitäjälle myönnetään täten maksutta oikeus käyttää tätä ohjelmistoa rajatta mukaanlukien oikeus käyttää, kopioida, muokata, yhdistää, julkaista, levittää, alilisensoida ja/tai myydä tämän ohjelmiston kopioita, ja myöntää samat oikeudet niille, joille tätä ohjelmistoa on levitetty, seuraavilla ehdoilla:

Yllä oleva tekijänoikeushuomautus ja nämä ehdot on sisällytettävä kaikkiin tämän ohjelmiston osittaisiin tai kokonaisiin kopioihin.

OHJELMISTO TARJOTAAN "SELLAISENAAN", ILMAN MINKÄÄNLAISTA ILMAISTUA TAI OLETETTUA TAKUUTA MUKAANLUKIEN TAKUUTA JÄLLEENMYYNTIKELPOISUUDESTA TAI SOPIVUUDESTA MIHINKÄÄN TIETTYYN TARKOITUKSEEN. OHJELMISTON TEKIJÖITÄ ÄLKÖÖN MISSÄÄN TILANTEESSA PIDETTÄKÖ VASTUULLISINA MIHINKÄÄN OHJELMISTON AIHEUTTAMAAN VAHINKOON. MIKSIKÖHÄN TÄMÄ TEKSTI KIRJOITETAAN ISOLLA ENGLANNINKIELISISSÄ LISENSSEISSÄ? SE ON VAIKEAMPI LUKEA NIIN... JOKA TAPAUKSESSA OHJELMA ON PURKKAA EIKÄ LUULTAVASTI TOIMI. KÄYTÄ OMALLA VASTUULLA.

## Changelog

### v1.0.0

- Initial release
