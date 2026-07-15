# Starostové Praha 13

Statický responzivní web inspirovaný novým vizuálním stylem webu STAN Praha 5 a přizpůsobený pro Prahu 13.

## Náhled

Web lze otevřít přímo přes `index.html` nebo spustit lokální server:

```bash
python3 -m http.server 8080
```

Poté otevřete `http://localhost:8080`.

## Stránky

- `index.html` – úvodní carousel ovládaný tečkami, klávesnicí nebo tažením, představení týmu, programu a možností zapojení
- `tym.html` – kandidátka: 7 velkých profilů s fotografiemi a kompaktní seznam kandidátů 8–35
- `program.html` – šest průběžně rozšiřitelných programových priorit
- `aktuality.html` – aktuality a události
- `kontakt.html` – kontaktní údaje a sociální sítě
- `zapojte-se.html` – pět možností zapojení včetně kampaně, podnětů a Mladých Starostů

Texty, fotografie a odkazy lze před nasazením upravit přímo v HTML souborech. Na všech stránkách je vložený MailerLite Universal kód pro automatické zobrazení aktivního pop-up formuláře podle nastavení v účtu MailerLite.

## Důležité názvy souborů

Cloudflare očekává v kořenové složce soubor `index.html`. Odkazy webu dále používají přesně názvy `tym.html`, `program.html`, `aktuality.html`, `kontakt.html` a `zapojte-se.html`. Hlavní vzhled musí zůstat v `styles.css` a chování menu a carouselu v `script.js`. Tyto soubory při nahrávání nepřejmenovávejte a nevytvářejte varianty typu `index-2.html`.

## Jak později upravit carousel

Obě okna jsou v `index.html` uvnitř prvku s atributem `data-hero-slider`. Jedno okno odpovídá jednomu prvku `article` s atributem `data-hero-slide`. Při přidání dalšího okna je potřeba přidat také jedno tlačítko `data-slider-dot` a navýšit pořadí v popisku `aria-label`. JavaScript už přepínání, šipky, tečky, automatický posun i tažení na mobilu obslouží.
