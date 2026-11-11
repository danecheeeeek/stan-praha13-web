# Starostové Praha 13

Statický responzivní web inspirovaný novým vizuálním stylem webu STAN Praha 5 a přizpůsobený pro Prahu 13.

## Náhled

Pro správné načtení písem, obrázků a všech odkazů spusťte v rozbalené složce lokální server:

```bash
python3 -m http.server 8080
```

Poté otevřete `http://localhost:8080`. Program je na adrese `http://localhost:8080/program.html`.

Alternativně lze použít `npm install` a `npm run dev`; náhled pak běží na `http://localhost:4173`.

## Stránky

- `index.html` – úvodní carousel ovládaný tečkami, klávesnicí nebo tažením, představení týmu, programu a možností zapojení
- `tym.html` – šest profilů týmu s fotografiemi, aktuálními funkcemi v bublinách a medailonky
- `program.html` – interaktivní programová mapa s devíti body, Korzem Hůrka a Radlickou radiálou
- `aktuality.html` – aktuality a události s volitelnými fotografiemi a rozbalovacími podrobnostmi
- `kontakt.html` – kontaktní údaje a sociální sítě
- `zapojte-se.html` – pět možností zapojení včetně kampaně, podnětů a Mladých Starostů

Texty, fotografie a odkazy běžných stránek lze před nasazením upravit přímo v HTML souborech. Aktuality a události pro carousel se spravují podle návodu níže.

## Funkce na stránce Náš tým

V Pages CMS otevřete **Náš tým** a u konkrétního člověka upravte seznam **Funkce v samosprávě**. Každá položka vytvoří jednu bublinu; pořadí položek určuje pořadí bublin pod jménem. Prázdný seznam nezobrazí žádnou bublinu. Původní profesní údaje zůstaly uchované v poli **Povolání (archiv)** a na stránce se nezobrazují.

Data jsou v `src/_data/candidates.json`, šablona v `src/tym.njk` a vzhled bublin ve `styles.css`. Po změně zdrojů sestavte web pomocí `npm run build`; výsledek je ve složce `_site`. Přiložený kořenový `tym.html` už obsahuje aktuální úpravu a lze ho nahrát spolu s `styles.css`. Ostatní kořenové stránky mají pouze obnovený odkaz na verzi stylů.

Funkce odpovídají výpisu zastupitelstva Prahy 13 dodanému 5. 11. 2026. U Vojtěcha Ludvíka je na přání uvedena pouze funkce místostarosty. U Daniela Adamova je nejprve výbor pro výchovu a vzdělávání, poté výbor pro Agendu 21. Bubliny mají písmo 17 px na počítači a 16 px na mobilu. Mezera pod jménem je 10 px, mezi bublinami 5 px a před medailonkem 12 px.

## Aktuality, fotografie a úvodní carousel přes Pages CMS

Repozitář obsahuje soubor `.pages.yml`, takže po připojení repozitáře na [Pages CMS](https://pagescms.org/) uvidíte editor aktualit, carouselu, kandidátů, programu a úvodních karet. Každá položka programu obsahuje číslo (u bodů), nadpis, žluté bubliny a popis.

- **Adresa aktuality** je krátký jedinečný název bez mezer a diakritiky, například `prochazka-prahou-13`. Po zveřejnění ji neměňte, aby zůstaly funkční odkazy.
- **Hlavní fotografie** je volitelná. U nejnovější aktuality se na počítači zobrazí vpravo od textu, na mobilu pod textem. U ostatních aktualit se zobrazí v kartách podle jejich rozložení. Bez fotografie zabere text celou šířku.
- **Podrobnosti** a **další fotografie** jsou volitelné. Pokud něco vyplníte, web automaticky přidá tlačítko „Zobrazit podrobnosti“.
- **Externí odkaz** může vést například na Facebook nebo Instagram.
- Přepínač **Zobrazit také v carouselu na úvodní stránce** vytvoří z aktuality další okno carouselu. Tlačítko v tomto okně vede přímo na danou aktualitu a případné podrobnosti se po otevření automaticky rozbalí.
- Pole začínající slovem **Carousel** umožňují pro úvodní okno použít kratší text nebo jinou fotografii. Když je necháte prázdná, převezmou se hlavní údaje aktuality.

Samotná data jsou uložená v `data/aktuality.json` a nahrané obrázky v `assets/images/aktuality`. Tyto soubory lze v případě potřeby upravit také ručně na GitHubu.

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

## Jak funguje carousel

První týmové okno zůstává napevno v `index.html`. Další okna se automaticky vytvářejí z aktualit, u kterých je v Pages CMS zapnutý přepínač pro carousel. JavaScript sám doplní správný počet teček, popisky, šipky, automatický posun i tažení na mobilu; při přidání události proto není potřeba programovat.
