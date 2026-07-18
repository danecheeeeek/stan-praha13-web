# STAN Praha 13

Web `stanpraha13.cz` běží jako statický web na Cloudflare Pages. Obsah se spravuje přes Pages CMS a při každém uložení se automaticky znovu sestaví z datových souborů.

## Správa obsahu bez kódování

1. Otevřete [Pages CMS](https://app.pagescms.org/).
2. Přihlaste se přes GitHub.
3. Vyberte repozitář `danecheeeeek/stan-praha13-web` a požadovanou větev.
4. V levém menu vyberte carousel, aktuality, kandidáty, program nebo další sekci.
5. Uložte změnu. Pages CMS vytvoří commit v GitHubu a Cloudflare Pages následně web automaticky nasadí.

Konfigurace formulářů je v souboru `.pages.yml`. Fotografie nahrané přes administraci se ukládají do `assets/images`.

## Obsah

- `src/_data/carousel.json` – úvodní carousel;
- `src/_data/news.json` – aktuality;
- `src/_data/candidates.json` – kandidáti 1–35;
- `src/_data/program.json` – programové priority;
- `src/_data/homeCards.json` – karty na úvodní stránce;
- `src/_data/contact.json` – kontaktní možnosti;
- `src/_data/join.json` – možnosti zapojení;
- `src/_data/site.json` – obecné údaje, sociální sítě a MailerLite.

## Lokální spuštění

```bash
npm install
npm run serve
```

Produkční sestavení:

```bash
npm run build
```

Hotový web se vytvoří ve složce `_site`.

## Cloudflare Pages

Nastavení projektu:

- Framework preset: `None`
- Build command: `npm run build`
- Build output directory: `_site`
- Root directory: `/`
- Production branch: `main`

Větev `cms-migration` slouží pro bezpečné náhledy. Do `main` se změny slučují až po kontrole preview nasazení.

## MailerLite

Na všech stránkách je použit účet `2428393` a formulář `n7DU5l`. Automatické otevření po pěti sekundách zůstává pouze na úvodní stránce; ruční tlačítko je dostupné všude.

## Původní HTML soubory

Kořenové soubory `index.html`, `tym.html`, `program.html`, `aktuality.html`, `kontakt.html` a `zapojte-se.html` jsou původní záloha. Cloudflare po přepnutí nastavení publikuje pouze sestavený obsah složky `_site`; běžný obsah se proto upravuje výhradně přes Pages CMS.
