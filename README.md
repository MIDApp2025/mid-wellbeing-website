# MID Wellbeing — Webflowista Next.js:ään

Responsiivinen monisivuinen prototyyppi, joka perustuu sivustoon `ai.midwellbeing.com`. Projektissa on yksi Navbar, yksi Footer, scroll-in-animaatiot sekä kielitiedostorakenne kielille `fi`, `en`, `sv`, `de`, `fr` ja `es`.

Etusivu on tarkennettu käyttäjän toimittaman alkuperäisen Webflow-HTML:n ja resurssi-ZIP:n pohjalta. Se sisältää alkuperäiset tekstit, ikonit, hero-kuvan, parallax-kuvan, sivukohtaisen slogan-osan sekä MID-tuoteperheen vaaleansiniset tehostevärit.

## Paikallinen käyttö

```bash
npm install
npm run dev
```

Avaa selaimessa `http://localhost:3000`.

## Rakenne

- `components/WebflowSite.tsx` — yhteinen sivurakenne, sisältö ja animaatiot
- `app/` — etusivu ja kuusi sisältöreittiä
- `app/globals.css` — ulkoasu, responsiivisuus ja animaatiot
- `messages/` — kuuden kielen tekstit
- `public/` — MID-kuvat ja sovellusnäkymät

## Sivut

- `/`
- `/miksi-mid`
- `/mita-mid-tarjoaa`
- `/testaa-hyvinvointisi`
- `/meista`
- `/ukk`
- `/yhteydenotto`

Tuotantoversion voi tarkistaa komennolla `npm run build`.
