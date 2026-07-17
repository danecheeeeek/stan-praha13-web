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

Texty, fotografie a odkazy lze před nasazením upravit přímo v HTML souborech.

## Newsletter (MailerLite)

Na všech šesti stránkách je právě jednou vložený MailerLite Universal kód účtu `2428393` a pevná bublina **Odebírat novinky**. Bublina otevírá formulář `n7DU5l`. Na počítači je vpravo, na mobilu vpravo dole nad ovládáním prohlížeče.

Pouze na úvodní stránce `index.html` se formulář otevře automaticky po 5 sekundách. V rámci jedné relace prohlížeče se automaticky zobrazí nejvýše jednou. Ruční otevření pomocí bubliny zůstává dostupné na každé stránce.

Vzhled vnitřku pop-upu se spravuje přímo v editoru MailerLite, nikoli v `styles.css`. Pro jednotný vzhled nastavte:

- pozadí `#FFED00`, hlavní růžovou `#CE0F68` a krémovou `#FCF7E0`;
- nadpis písmem Oldschool Grotesk a běžný text písmem Feature Text;
- na počítači fotografii vlevo a formulář vpravo;
- děkovací obrazovku ve stejných rozměrech, bez fotografie.

Doporučený text děkovací obrazovky:

> **Díky!**
>
> Přihlášení proběhlo úspěšně. Odteď vám neuniknou naše novinky, pozvánky ani dění na Třináctce.
>
> Mezitím nás sledujte také na sociálních sítích.

Pod text vložte stejně velké ikony s odkazy na [Facebook](https://www.facebook.com/STANpraha13) a [Instagram](https://www.instagram.com/starostove.praha13/).

## Důležité názvy souborů

Cloudflare očekává v kořenové složce soubor `index.html`. Odkazy webu dále používají přesně názvy `tym.html`, `program.html`, `aktuality.html`, `kontakt.html` a `zapojte-se.html`. Hlavní vzhled musí zůstat v `styles.css` a chování menu a carouselu v `script.js`. Tyto soubory při nahrávání nepřejmenovávejte a nevytvářejte varianty typu `index-2.html`.

## Jak později upravit carousel

Obě okna jsou v `index.html` uvnitř prvku s atributem `data-hero-slider`. Jedno okno odpovídá jednomu prvku `article` s atributem `data-hero-slide`. Při přidání dalšího okna je potřeba přidat také jedno tlačítko `data-slider-dot` a navýšit pořadí v popisku `aria-label`. JavaScript už přepínání, šipky, tečky, automatický posun i tažení na mobilu obslouží.
