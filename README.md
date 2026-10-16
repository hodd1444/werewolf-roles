# Werwolf – Rollenverteilung

Mobile Web-App zum Verteilen der Rollen für „Die Werwölfe von Düsterwald“ (und eigene Varianten).

- Spielerzahl & Rollen frei wählbar, Schnellstart-Presets passend zur Gruppengröße
- Spielernamen werden gespeichert und lassen sich in jeder Runde wieder einfügen
- Handy herumgeben, Karte aufdecken, verdecken – reihum
- Spielleiter-Übersicht (tot/lebendig, Hauptmann, Verliebte, Silencer) und geführter Nacht-Guide
- Eigene Rollen inkl. Nachtaktion erstellen
- Deutsch & Englisch (`src/i18n.ts`, Rollentexte in `src/data/roles.ts`)

Alle Daten liegen im `localStorage` des Geräts – kein Server nötig.

```bash
npm install
npm run dev      # Entwicklung
npm run build    # statische Dateien in dist/ (z. B. auf Vercel/GitHub Pages hosten)
```

## SEO / Social Previews

Meta-Tags, Open Graph, JSON-LD und `robots.txt` sind eingebaut. Für Link-Vorschauen (WhatsApp, Facebook usw.)
muss das Vorschaubild eine absolute URL haben – trage dazu vor dem Build die Domain in `.env` ein:

```bash
VITE_SITE_URL=https://deine-domain.de
```
