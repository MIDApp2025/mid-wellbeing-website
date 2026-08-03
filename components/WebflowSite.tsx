"use client";

import { useEffect, useRef, useState } from "react";
import { tr } from "./i18n.generated";

type PageKey = "home" | "miksi" | "tarjoaa" | "testaa" | "meista" | "ukk" | "yhteys";
export type Locale = "fi" | "en" | "sv" | "de" | "fr" | "es";
type Card = { title: string; text: string; icon?: string; iconSrc?: string };
type ContactFormKind = "page" | "footer";
type ContactState = { kind: "idle" | "sending" | "success" | "error"; message?: string };

const contactEndpoint = process.env.NEXT_PUBLIC_CONTACT_API_URL || "https://www.midconsulting.io/api/contactWebPage";
const contactMessages: Record<Locale,{sending:string;success:string;invalid:string;error:string}> = {
  fi:{sending:"Lähetetään…",success:"Kiitos! Viestisi on lähetetty.",invalid:"Tarkista sähköpostiosoite.",error:"Viestin lähetys epäonnistui. Yritä hetken kuluttua uudelleen."},
  en:{sending:"Sending…",success:"Thank you! Your message has been sent.",invalid:"Please check your email address.",error:"The message could not be sent. Please try again shortly."},
  sv:{sending:"Skickar…",success:"Tack! Ditt meddelande har skickats.",invalid:"Kontrollera din e-postadress.",error:"Meddelandet kunde inte skickas. Försök igen om en stund."},
  de:{sending:"Wird gesendet…",success:"Vielen Dank! Ihre Nachricht wurde gesendet.",invalid:"Bitte überprüfen Sie Ihre E-Mail-Adresse.",error:"Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut."},
  fr:{sending:"Envoi…",success:"Merci ! Votre message a été envoyé.",invalid:"Veuillez vérifier votre adresse e-mail.",error:"Le message n’a pas pu être envoyé. Veuillez réessayer dans un instant."},
  es:{sending:"Enviando…",success:"¡Gracias! Tu mensaje ha sido enviado.",invalid:"Comprueba tu dirección de correo electrónico.",error:"No se pudo enviar el mensaje. Inténtalo de nuevo en unos instantes."}
};
const legalLabels: Record<Locale,{privacy:string;terms:string}> = {
  fi:{privacy:"Tietosuojaseloste",terms:"Käyttöehdot"},en:{privacy:"Privacy Policy",terms:"Terms of Use"},
  sv:{privacy:"Integritetspolicy",terms:"Användarvillkor"},de:{privacy:"Datenschutzerklärung",terms:"Nutzungsbedingungen"},
  fr:{privacy:"Politique de confidentialité",terms:"Conditions d’utilisation"},es:{privacy:"Política de privacidad",terms:"Términos de uso"}
};

const pages: Record<PageKey, { eyebrow?: string; title: string; sub: string; image: string; cards: Card[]; cta?: string }> = {
  home: {
    title: "Tekoälyä työhyvinvoinnin tueksi",
    sub: '"Because great ideas deserve great engines"',
    image: "/home-assets/hero.png",
    cards: [
      { iconSrc: "/home-assets/ai-data.png", title: "Tekoäly ja data", text: "Tarjoamme älykästä dataa. Hyödynnämme tekoälyä työhyvinvoinnin mittaamiseen ja kehittämiseen uudella tavalla, jossa tunne ja tieto yhdistyvät. Jokainen ajatus lähtee tunteesta ja jokaisella tunteella on tarina. MID tunnistaa tarinan ytimen – miksi motivaatio on vahva tai miksi uupumus hiipii.\nMID on työntekijän inhimillinen kumppani, kaveri joka ei väsy – ja on aina valmiina kuuntelemaan. Annamme työnantajille arvokasta anonyymisti kerättyä tietoa reaaliajassa – tietoa jonka avulla voidaan tehdä parempia päätöksiä hyvinvoinnin, työnilon ja tuottavuuden tueksi." },
      { iconSrc: "/home-assets/innovation.png", title: "Innovaatio", text: "Tavoitteemme on rakentaa työelämä, jossa ihmiset loistavat ja organisaatiot säästävät. Visiomme on vähentää sairauspoissaoloja, lisätä työtyytyväisyyttä ja tuoda organisaatioihin aito, ennakoiva työhyvinvointikulttuuri. MID ei vain mittaa hyvinvointia, vaan myös parantaa sitä.\nMID ei ole vain järjestelmä – se on muutoksen mahdollistaja. Kun ihminen voi hyvin, syntyy uusia ideoita ja uskallusta kasvaa. MID tukee työntekijöiden omaa kehitystä ja antaa organisaatiolle välineet nähdä kasvun esteet ajoissa – ennen kuin ne hidastavat kasvun suuntaa." },
      { iconSrc: "/home-assets/sustainable.png", title: "Kestävä kehitys", text: "MID on mahdollisuuksien moottori, joka vie ihmiset kohti positiivista muutosta. MID ei ole vain teknologinen työkalu – se on innovaatio, joka muuttaa työhyvinvoinnin ja kasvun käsitteen. Yhdistämme tekoälyn ja inhimillisen näkökulman, jotta hyvinvoinnista tulee jatkuvaa, ei hetkellistä. Tarjoamme jokaiselle työntekijälle henkilökohtaisen mentorin, joka tukee, kannustaa ja auttaa heitä saavuttamaan täyden potentiaalinsa.\nTyöyhteisö, joka voi hyvin, on kestävä ja tuottava. Kestävä kehitys ei ole vain tavoite – se on osa jokapäiväistä työelämää. Kestävyyden ytimessä on ihminen – ja hänen mahdollisuutensa vaikuttaa ja kasvaa työssään." },
      { iconSrc: "/home-assets/responsibility.png", title: "Vastuullisuus", text: "Hyvinvoivat työntekijät ja eettinen johtaminen luovat perustan pitkän aikavälin kestävälle liiketoiminnalle. MID Wellbeing auttaa organisaatiota rakentamaan vastuullista yrityskulttuuria, joka huomioi sekä työntekijöiden, organisaation että yhteiskunnan tarpeet. Todellinen vastuullisuus näkyy arjessa – siinä, miten työntekijöitä kuunnellaan ja miten heidän hyvinvointinsa huomioidaan. MID Wellbeing auttaa rakentamaan kulttuuria, jossa vastuu ihmisistä ei ole strategia, vaan valinta. Kun ihmiset voivat hyvin, he luottavat työnantajaansa – ja se on kestävyyden perusta." }
    ], cta: "Try AI"
  },
  miksi: {
    eyebrow: "Miksi MID?", title: "MID tekee näkymättömästä näkyvää", sub: "Tunne kertoo usein enemmän kuin numero. MID auttaa näkemään sen, mikä muuten jäisi piiloon.", image: "/webflow/team-coffee.jpg",
    cards: [
      { icon: "01", title: "Askeleen edellä", text: "Tunnista hyvinvoinnin muutokset ennen kuin ne muuttuvat poissaoloiksi, vaihtuvuudeksi tai menetetyksi potentiaaliksi." },
      { icon: "02", title: "Piilotetut ajatukset", text: "Kaikkea tärkeää ei sanota ääneen. MID tarjoaa turvallisen kanavan tulla kuulluksi ja tuo anonyymit ilmiöt organisaation nähtäväksi." },
      { icon: "03", title: "Kustannukset kuriin", text: "Ennaltaehkäisevä tuki vähentää korjaavien toimenpiteiden tarvetta ja auttaa kohdentamaan hyvinvointityön oikein." },
      { icon: "04", title: "Kulttuuri, joka kantaa", text: "Kun ihmiset tulevat kuulluiksi, luottamus vahvistuu. Luottamus synnyttää sitoutumista, innovaatioita ja kestävää kasvua." }
    ]
  },
  tarjoaa: {
    eyebrow: "Mitä MID tarjoaa", title: "Hyvinvointi on investointi – MID tuo tuotot näkyviksi", sub: "Yksi ratkaisu työntekijän henkilökohtaiseen tukeen ja organisaation reaaliaikaiseen ymmärrykseen.", image: "/webflow/mid8.png",
    cards: [
      { icon: "✦", title: "Kumppani joka ei väsy", text: "Henkilökohtainen tekoälymentori kuuntelee, tukee ja auttaa työntekijää ympäri vuorokauden." },
      { icon: "◎", title: "Älä navigoi sokkona", text: "Reaaliaikainen ja anonyymi tieto näyttää, missä organisaatio voi hyvin ja missä tarvitaan huomiota." },
      { icon: "↗", title: "Tieto muuttuu teoiksi", text: "MID yhdistää havainnot selkeiksi oivalluksiksi ja ohjaa kehittämistä oikeaan suuntaan." },
      { icon: "◌", title: "Live valmennus", text: "Digitaalinen tuki voidaan yhdistää asiantuntijavalmennuksiin ja organisaation omiin hyvinvointiohjelmiin." }
    ]
  },
  testaa: {
    eyebrow: "Testaa hyvinvointisi", title: "Aika päivittää hyvinvoinnin mittarit älykkäästi", sub: "MID ei kysy vain kerran vuodessa. Se kuuntelee kevyesti, oppii jatkuvasti ja auttaa toimimaan heti.", image: "/webflow/girl.jpg",
    cards: [
      { icon: "?", title: "Mikä on MID Wellbeing -testi?", text: "Helppo ja luottamuksellinen tapa pysähtyä oman työhyvinvoinnin äärelle ja saada henkilökohtainen tulkinta." },
      { icon: "✓", title: "MID on ketterä kysely", text: "Lyhyet kysymykset mukautuvat vastausten mukaan. Kokemus on kevyt käyttäjälle mutta tieto arvokasta." },
      { icon: "24/7", title: "Kehitys käynnissä 24/7", text: "Hyvinvointi muuttuu päivittäin. MID auttaa seuraamaan kehitystä ja tunnistamaan oikean hetken toimia." }
    ], cta: "Testaa hyvinvointisi"
  },
  meista: {
    eyebrow: "Meistä", title: "MID sai alkunsa tarpeesta löytää uusi suunta", sub: "Tunne edeltää tulosta – ei toisinpäin.", image: "/webflow/portrait.jpeg",
    cards: [
      { icon: "01", title: "MID syntyi tarpeesta", text: "Halusimme ymmärtää, miksi ihmiset voivat työssä niin kuin voivat – ennen kuin vaikutukset näkyvät luvuissa." },
      { icon: "02", title: "Tunne edeltää tulosta", text: "Motivaatio, luottamus ja kuormitus muuttuvat ensin. Kun ne tunnistetaan ajoissa, suuntaa voidaan vielä muuttaa." },
      { icon: "03", title: "Uudenlaista tietoa", text: "Annamme työnantajalle inhimillistä, anonyymiä ja ajantasaista tietoa päätöksenteon tueksi." }
    ]
  },
  ukk: {
    eyebrow: "UKK", title: "Kysymyksiä ja vastauksia", sub: "Täältä löydät vastaukset yleisimpiin MID Wellbeing -ratkaisua koskeviin kysymyksiin.", image: "/webflow/mid6.png",
    cards: [
      { title: "Mikä MID Wellbeing on?", text: "Tekoälypohjainen työhyvinvointiratkaisu, joka yhdistää työntekijän henkilökohtaisen tuen ja organisaation anonyymin tilannekuvan." },
      { title: "Ovatko keskustelut luottamuksellisia?", text: "Kyllä. Työnantaja ei näe yksittäisen työntekijän vastauksia tai keskustelujen sisältöä." },
      { title: "Mitä työnantaja näkee?", text: "Organisaatio saa anonyymiä, koottua tietoa hyvinvoinnin ilmiöistä ja niiden kehityksestä." },
      { title: "Kuinka nopeasti MID voidaan ottaa käyttöön?", text: "Käyttöönotto on kevyt. Ratkaisu toimii selaimessa ja mobiilissa ilman raskasta IT-projektia." }
    ]
  },
  yhteys: { eyebrow: "Ota yhteyttä", title: "Muutos alkaa hyvinvoinnista", sub: "Kerro meille, mitä organisaatiosi tarvitsee. Rakennetaan yhdessä parempaa työelämää.", image: "/webflow/office-team.jpg", cards: [] }
};

const nav = [
  ["Etusivu", "/"], ["Miksi MID", "/miksi-mid"], ["Mitä MID tarjoaa", "/mita-mid-tarjoaa"], ["Testaa hyvinvointisi", "/testaa-hyvinvointisi"], ["Meistä", "/meista"], ["UKK", "/ukk"]
];

const pageSlugs: Record<PageKey,string> = {home:"",miksi:"miksi-mid",tarjoaa:"mita-mid-tarjoaa",testaa:"testaa-hyvinvointisi",meista:"meista",ukk:"ukk",yhteys:"yhteydenotto"};
const locales: {code:Locale;label:string}[] = [{code:"fi",label:"FI"},{code:"en",label:"EN"},{code:"sv",label:"SV"},{code:"de",label:"DE"},{code:"fr",label:"FR"},{code:"es",label:"ES"}];
const localePath = (locale:Locale, slug:string) => `${locale==="fi"?"":`/${locale}`}${slug?`/${slug}`:"/"}`;

const miksiBlocks = [
  {
    title: "Askeleen edellä",
    text: "Jos nykyiset keinot riittäisivät, et etsisi parempaa. Mutta koska luet tätä, olet jo askeleen edellä. MID ei vain mittaa mennyttä – se auttaa näkemään reaaliajassa sen, mitä ei aiemmin nähty. Tunnistamme hiljaiset signaalit ennen kuin ne muuttuvat ongelmiksi.\n\nOngelmat voidaan ratkaista vasta, kun niiden olemassaolo on tiedostettu ja on ymmärretty, kuinka ne ovat muodostuneet. MID auttaa työntekijöitä oivaltamaan ja työnantajia ymmärtämään, miksi ja miten hyvinvointia kannattaa kehittää todellisten tunteiden pohjalta.",
    image: "/miksi-assets/quiet-thoughts.jpg",
    alt: "Kollegat keskustelevat yhdessä"
  },
  {
    title: "Ennakoi, älä paikkaa",
    text: "Toimi reaaliajassa. Ongelmat eivät synny yhdessä yössä, mutta ne ehtivät kasvaa nopeasti. MID auttaa tunnistamaan muutoksen varhaisessa vaiheessa – kun signaalit ovat vielä sanoja, eivät prosentteja. Reaaliaikainen tieto mahdollistaa aidon ennakoinnin ja fiksummat toimenpiteet.\n\nPoissaolot, vaihtuvuus ja tuottavuuden lasku alkavat tunteista. MID tuo näkyväksi ne tekijät, jotka vaikuttavat työssä jaksamiseen ja sitoutumiseen. Kun hyvinvointi vahvistuu, myös tulokset paranevat ja kustannukset laskevat.",
    image: "/miksi-assets/mid-ai.png",
    alt: "Tekoälyä kuvaava mikrosiru"
  },
  {
    title: "Piilotetut ajatukset",
    text: "Työntekijät eivät aina sano ääneen, mitä he ajattelevat – eikä johto aina osaa kysyä oikeita kysymyksiä. MID kuuntelee niitä sanoja, joita ei sanota ääneen. Tekoäly analysoi keskustelujen sävyjä, sanoituksia ja tunnetiloja ja muodostaa kokonaiskuvan työyhteisön tilasta.\n\nMID on työntekijälle turvallinen ja anonyymi väylä reflektoida omia ajatuksia ja saada oivalluksia. Se tekee näkymättömästä näkyvää: ymmärrettävää ja uudenlaista tietoa, jota organisaatiot tarvitsevat hyvien tulosten saavuttamiseen.",
    image: "/miksi-assets/leadership.jpeg",
    alt: "Johtaja tarkastelee työhyvinvoinnin tietoa"
  }
];

const tarjoaaBlocks = [
  {
    title: "Kumppani joka ei väsy",
    text: "Hyvä työpäivä ei synny yksin. MID-mentori on älykäs, tunteita ymmärtävä keskustelija, joka kuuntelee, sparraa ja pohtii yhdessä työntekijän kanssa – mihin vuorokauden aikaan tahansa ja missä tahansa, vaikka työmatkalla.\n\nTyöntekijä tarvitsee kumppanin, joka ei katoa, kun tarvitaan. MID ei vain auta vaikeina hetkinä, vaan vahvistaa myös silloin, kun kaikki sujuu – ja tekee hyvästä vielä parempaa.",
    image: "/tarjoaa-assets/mobile-mentor.png",
    alt: "Nainen keskustelee puhelimella työmatkalla"
  },
  {
    title: "Älä navigoi sokkona",
    text: "Nykytyöelämässä dataa kyllä riittää – mutta ymmärrystä ei aina. MID analysoi työntekijöiden tunteita ja palautetta anonyymisti. Se tarjoaa johdolle helpon ja nopean reaaliaikaisen näkymän siihen, mitä työyhteisössä todella tapahtuu – ei pelkkää dataa, vaan uudenlaista tietoa.\n\nKun tunneymmärrys yhdistyy älykkääseen analyysiin, päätöksenteosta tulee kirkasta ja tehokasta.",
    image: "/tarjoaa-assets/leadership.png",
    alt: "Esihenkilö esittelee tietoa työryhmälle"
  },
  {
    title: "Tieto muuttuu teoiksi",
    text: "Hyvä johtaminen on taitolaji, jota voi treenata joka päivä. MID tarjoaa esihenkilöille pienen mutta merkityksellisen lisän arkeen: joka kuukausi vaihtuvan teeman, joka auttaa ymmärtämään tiimiä paremmin.\n\nPoimimme parhaat opit tunnetuista johtamiskirjoista ja peilaamme niitä oikean elämän esimerkkeihin. Saat selkeitä ajatuksia siitä, miten tukea ihmisiä ja vahvistaa hyvää fiilistä – silloinkin, kun arki on kiireistä.",
    image: "/tarjoaa-assets/team-success.jpg",
    alt: "Mies ja nainen juhlistavat onnistumista työpaikalla"
  }
];

const faqItems = [
  {
    question: "Miten MID eroaa HR-kyselyistä?",
    answer: "Perinteiset HR-kyselyt toteutetaan yleensä muutaman kerran vuodessa ja ne keskittyvät yleisiin mittareihin. MID analysoi työyhteisön ajatuksia jatkuvasti ja muodostaa johdolle anonyymin, reaaliaikaisen koosteen työntekijöiden tunteista ja ajatuksista.\n\nMID tarjoaa työntekijälle myös yksilöllistä tukea, päivittäistä reflektiota ja mahdollisuuden seurata omaa kehitystään. Palautetta ei tarvitse odottaa viikkoja, vaan työntekijä saa vastauksen heti."
  },
  {
    question: "Missä tietoni säilytetään?",
    answer: "Data säilytetään turvallisesti luotettavissa pilvipalveluissa ja käsitellään GDPR:n eli tietosuoja-asetuksen mukaisesti. Yksityisyys ja anonymiteetti ovat meille ensisijaisen tärkeitä."
  },
  {
    question: "Miten MID toimii?",
    answer: "MID on hyvinvointisovellus, jossa työntekijä saa yksilöllistä tukea, oivalluksia ja arjen sparrausta tekoälypohjaisen vuorovaikutuksen avulla. MID ei tarjoa valmiita vastauksia, vaan auttaa käyttäjää jäsentämään omia ajatuksiaan ja löytämään uusia näkökulmia.\n\nTyönantajalle MID muodostaa henkilöstön tunteista ja ajatuksista anonyymin kokonaiskuvan työyhteisön hyvinvoinnista."
  },
  {
    question: "Pitääkö työntekijän ladata jotain?",
    answer: "Ei. MID toimii selaimessa eikä vaadi asentamista. Halutessaan työntekijä voi ladata MID-sovelluksen Google Playsta tai App Storesta. Työntekijä voi valita itselleen sopivimman tavan käyttää MIDiä."
  },
  {
    question: "Näkeekö työnantaja, mitä kirjoitan?",
    answer: "Ei. MID on anonyymi ja työntekijän henkilökohtainen kanava ajatusten reflektointiin, oivalluksiin ja tukeen. Työnantaja saa vain anonyymejä yhteenvetoja ja organisaatiotason analytiikkaa.\n\nTyöntekijä voi halutessaan lähettää johdolle anonyymin viestin. Myös sen näyttäminen ajastetaan niin, ettei lähettäjää voida tunnistaa."
  },
  {
    question: "Kenelle MID sopii?",
    answer: "MID sopii työyhteisöille, jotka haluavat parantaa vuorovaikutusta, itseohjautuvuutta ja psykologista turvallisuutta. Se on suunnattu organisaatioille, jotka haluavat hyödyntää modernia teknologiaa työhyvinvoinnin tukena."
  },
  {
    question: "Tarjoaako MID valmennusta?",
    answer: "MID tarjoaa jatkuvaa arjen tukea työntekijöille ja esihenkilöille. Se auttaa kehittämään ajattelua, vuorovaikutusta ja hyvinvointia päivittäisten oivallusten, tekoälypohjaisen tuen ja käytännön näkökulmien avulla.\n\nMID toimii itsenäisenä ratkaisuna, mutta sitä voidaan käyttää myös osana valmennuksia, koulutuksia ja työhyvinvointiohjelmia yhdessä yrityksen omien tai ulkopuolisten asiantuntijoiden kanssa."
  }
];

function Reveal({children, delay=0, className=""}:{children:React.ReactNode;delay?:number;className?:string}){
  return <div className={`wf-reveal ${className}`} style={{"--d":`${delay}ms`} as React.CSSProperties}>{children}</div>;
}

function localizeValue<T>(value:T, locale:Locale):T {
  if(typeof value === "string") return tr(locale,value) as T;
  if(Array.isArray(value)) return value.map(item=>localizeValue(item,locale)) as T;
  if(value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,localizeValue(item,locale)])) as T;
  return value;
}

export default function WebflowSite({ page, locale="fi" }: { page: PageKey; locale?: Locale }) {
  const [menu, setMenu] = useState(false);
  const [contactStates,setContactStates] = useState<Record<ContactFormKind,ContactState>>({page:{kind:"idle"},footer:{kind:"idle"}});
  const siteRef = useRef<HTMLElement>(null);
  const data = localizeValue(pages[page],locale);
  const localizedNav = localizeValue(nav,locale);
  const localizedMiksiBlocks = localizeValue(miksiBlocks,locale);
  const localizedTarjoaaBlocks = localizeValue(tarjoaaBlocks,locale);
  const localizedFaqItems = localizeValue(faqItems,locale);
  const submitContact = async (event:React.FormEvent<HTMLFormElement>,formKind:ContactFormKind) => {
    event.preventDefault();
    const form=event.currentTarget;
    const values=new FormData(form);
    const email=String(values.get("email")||"").trim();
    const name=String(values.get("name")||"").trim();
    const message=String(values.get("message")||"").trim();
    if(!/^\S+@\S+\.\S+$/.test(email)){
      setContactStates(states=>({...states,[formKind]:{kind:"error",message:contactMessages[locale].invalid}}));
      return;
    }
    setContactStates(states=>({...states,[formKind]:{kind:"sending"}}));
    try{
      const response=await fetch(contactEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,email,message})});
      if(!response.ok) throw new Error("Contact request failed");
      form.reset();
      setContactStates(states=>({...states,[formKind]:{kind:"success"}}));
    }catch{
      setContactStates(states=>({...states,[formKind]:{kind:"error",message:contactMessages[locale].error}}));
    }
  };
  useEffect(()=>{ const o=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add("is-visible")),{threshold:.08}); document.querySelectorAll(".wf-reveal").forEach(e=>o.observe(e)); return()=>o.disconnect(); },[page]);
  useEffect(()=>{
    if(locale==="fi" || !siteRef.current) return;
    const walker=document.createTreeWalker(siteRef.current,NodeFilter.SHOW_TEXT);
    let node:Node|null;
    while((node=walker.nextNode())){
      const original=node.nodeValue||""; const value=original.trim();
      if(!value) continue;
      const translated=tr(locale,value);
      if(translated!==value) node.nodeValue=original.replace(value,translated);
    }
    siteRef.current.querySelectorAll<HTMLElement>("[aria-label],[alt],[placeholder],[title]").forEach(element=>{
      ["aria-label","alt","placeholder","title"].forEach(attribute=>{
        const value=element.getAttribute(attribute); if(value) element.setAttribute(attribute,tr(locale,value));
      });
    });
  },[locale,page,menu]);
  return <main className="wf-site" ref={siteRef}>
    <header className="wf-header">
      <a className="wf-logo wf-wordmark" href={localePath(locale,"")} aria-label="MID Wellbeing"><span><b>MID</b><small>Wellbeing</small></span></a>
      <button className="wf-menu" onClick={()=>setMenu(!menu)} aria-label="Avaa valikko">☰</button>
      <nav className={menu?"is-open":""}>{localizedNav.map(([label,href],i)=>{const key=(['home','miksi','tarjoaa','testaa','meista','ukk'] as PageKey[])[i];return <a key={href} className={page===key?"active":""} href={localePath(locale,href.slice(1))}>{label}</a>})}<label className="wf-lang"><span className="wf-sr-only">Kieli</span><select value={locale} onChange={e=>{window.location.href=localePath(e.target.value as Locale,pageSlugs[page])}}>{locales.map(l=><option value={l.code} key={l.code}>{l.label}</option>)}</select></label><a className="wf-contact" href={localePath(locale,"yhteydenotto")}>ota yhteyttä</a></nav>
    </header>
    {page==="home" ? <section className="wf-home-hero">
      <img src={data.image} alt="Mietteliäs nainen vihreässä paidassa"/>
      <Reveal className="wf-home-copy"><h1>{data.title}</h1><p>{data.sub}</p><a href="https://dashboard.midwellbeing.com/startPage">Aloita</a></Reveal>
    </section> : page==="miksi" ? <>
      <section className="wf-miksi-hero"><Reveal><h1>MID tekee<br/>näkymättömästä<br/>näkyvää</h1><p>“Because great ideas deserve great engines”</p><a href="https://dashboard.midwellbeing.com/startPage">Aloita</a></Reveal></section>
      <section className="wf-miksi-parallax" aria-label="Tekoäly ja ihmisten välinen yhteys"/>
      <section className="wf-miksi-grid">{localizedMiksiBlocks.flatMap((block,i)=>[
        <Reveal className={`wf-miksi-text wf-miksi-text-${i+1}`} delay={i*70} key={`${block.title}-text`}><span>0{i+1}</span><h2>{block.title}</h2><p>{block.text}</p></Reveal>,
        <Reveal className={`wf-miksi-image wf-miksi-image-${i+1}`} delay={i*70+70} key={`${block.title}-image`}><img src={block.image} alt={block.alt}/></Reveal>
      ])}</section>
    </> : page==="tarjoaa" ? <>
      <section className="wf-tarjoaa-hero"><Reveal><h1>Hyvinvointi on investointi –<br/>MID tuo tuotot näkyviksi</h1><p>“Because great ideas deserve great engines”</p><a href="https://dashboard.midwellbeing.com/startPage">Aloita</a></Reveal></section>
      <section className="wf-tarjoaa-parallax" aria-label="Tekoäly auttaa näkemään hyvinvoinnin kokonaisuuden"/>
      <section className="wf-tarjoaa-grid">{localizedTarjoaaBlocks.flatMap((block,i)=>[
        <Reveal className={`wf-tarjoaa-text wf-tarjoaa-text-${i+1}`} delay={i*70} key={`${block.title}-text`}><span>0{i+1}</span><h2>{block.title}</h2><p>{block.text}</p></Reveal>,
        <Reveal className={`wf-tarjoaa-image wf-tarjoaa-image-${i+1}`} delay={i*70+70} key={`${block.title}-image`}><img src={block.image} alt={block.alt}/></Reveal>
      ])}</section>
    </> : page==="testaa" ? <>
      <section className="wf-testaa-hero">
        <img src="/testaa-assets/paper-chaos.png" alt="Mies vanhanaikaisten paperiraporttien keskellä"/>
        <Reveal className="wf-testaa-hero-copy"><span>TESTAA HYVINVOINTISI</span><h1>Vieläkö mittaat<br/>hyvinvointia näin?</h1><p>Aika päivittää hyvinvoinnin mittarit älykkäästi.</p><a href="https://mid-demo-73dezblnk-midc-onsulting.vercel.app/">Tee testi</a></Reveal>
      </section>
      <section className="wf-testaa-intro"><Reveal><p className="wf-testaa-kicker">Ei enää raskaita kysymyspatteristoja ja kuukausien odottelua.</p><h2>Pysähdy hetkeksi – ja tunnista, missä olet nyt.</h2><p>MID Wellbeing -testi yhdistää tekoälyn ja ihmislähtöisen ajattelun. Se kartoittaa työn kuormittavuutta, palautumista, merkityksellisyyttä ja yhteisöllisyyttä – ja antaa henkilökohtaisen palautteen heti.</p></Reveal></section>
      <section className="wf-testaa-story">
        <Reveal className="wf-testaa-story-image"><img src="/testaa-assets/sleeping-at-desk.png" alt="Väsynyt työntekijä on nukahtanut työpöydälle"/></Reveal>
        <Reveal className="wf-testaa-story-copy" delay={80}><span>01</span><h2>Testi, joka ei nukuta</h2><p>MID ei ole pelkkä kysymyspatteristo, vaan pieni oivalluttava hetki itsellesi. Vastattuasi tekoäly analysoi vastauksesi ja nostaa esiin vahvuutesi, mahdolliset kehityskohteet sekä konkreettiset askeleet hyvinvointisi tueksi.</p><a href="https://mid-demo-73dezblnk-midc-onsulting.vercel.app/">Kokeile itse</a></Reveal>
        <Reveal className="wf-testaa-story-copy wf-testaa-story-blue" delay={80}><span>02</span><h2>MID on ketterä kysely</h2><p>Työntekijä saa henkilökohtaista palautetta heti. Samalla organisaatio saa anonyymin yhteenvedon voimavaroista, kuormitustekijöistä ja kehittämismahdollisuuksista – ilman koontiraporttien odottelua.</p></Reveal>
        <Reveal className="wf-testaa-story-image"><img src="/testaa-assets/test-insight.png" alt="Iloinen nainen saa testistä oivalluksen"/></Reveal>
      </section>
      <section className="wf-testaa-continuous"><div className="wf-testaa-continuous-image"><img src="/testaa-assets/team.png" alt="Hyvinvoiva ja iloinen työtiimi"/></div><Reveal className="wf-testaa-continuous-copy"><span>03</span><h2>Hyvinvointi ei ole kertaluonteinen mittaus</h2><p>Työntekijä voi tehdä testejä silloin, kun niille on tarvetta. Tulokset tallentuvat omaan kehitysnäkymään, ja oivalluksia voi syventää keskustelemalla MID Wellbeing -älymentorin kanssa. Organisaatio saa ajankohtaista tietoa ja selkeitä kehityspolkuja – silloin, kun työ ja elämä oikeasti tapahtuvat.</p><a href="https://mid-demo-73dezblnk-midc-onsulting.vercel.app/">Testaa hyvinvointisi</a></Reveal></section>
    </> : page==="meista" ? <>
      <section className="wf-meista-hero"><Reveal><span>MEISTÄ</span><h1>MID syntyi tarpeesta<br/>löytää uusi suunta</h1><p>“Because great ideas deserve great engines”</p></Reveal></section>
      <section className="wf-meista-origin">
        <Reveal className="wf-meista-origin-copy"><span>MIDIN TARINA</span><h2>Tunne edeltää tulosta<br/>– ei toisinpäin</h2><p>MID syntyi todellisesta elämästä – oivalluksesta siitä, kuinka hiljaa työelämän ongelmat voivat kasvaa liian suuriksi.</p><p>Kun hyvinvointi katoaa, yrityksille syntyy kustannuksia, mutta usein ihminen maksaa vielä suuremman hinnan omalla jaksamisellaan, terveydellään ja elämänlaadullaan. Työhyvinvointi ei ole luksusta – se on kaiken perusta.</p><p>Kun ihminen kokee turvaa, tulee kuulluksi ja saa oikeanlaista tukea, hän jaksaa enemmän, ajattelee kirkkaammin ja uskaltaa olla oma itsensä myös työssä.</p><p>Jokainen ajatus kumpuaa tunteesta, ja jokaisella tunteella on syy. Siksi ihmiset tarvitsevat enemmän kuin järjestelmiä – he tarvitsevat ymmärrystä, sparrausta ja tunteen siitä, että joku todella kuuntelee.</p></Reveal>
        <Reveal className="wf-meista-founder" delay={100}><img src="/meista-assets/maikki-founder.png" alt="Maria Bremer, MID Wellbeingin perustaja"/><div><h3>Maria Bremer</h3><p>MID Wellbeingin perustaja</p></div></Reveal>
      </section>
      <section className="wf-meista-purpose">
        <Reveal className="wf-meista-purpose-image"><img src="/meista-assets/employer-dashboard.png" alt="MID Wellbeingin työnantajanäkymä työhyvinvoinnin johtamisen tukena"/></Reveal>
        <Reveal className="wf-meista-purpose-copy" delay={100}><span>MIKSI MID ON OLEMASSA</span><h2>Uudenlaista tietoa työnantajalle</h2><p>Yritykset etsivät ratkaisuja. Kaikki haluavat hyvinvointia ja motivoituneita työntekijöitä – mutta myös tuloksia.</p><p>MID yhdistää tunteet, kokemukset ja tekoälyn ymmärrykseksi, joka ei perustu arvailuun vaan aitoon tietoon. Se syntyi yhtä paljon työnantajien kuin työntekijöiden tarpeesta. Molemmat tarvitsevat työkalun, joka auttaa ymmärtämään – ei vain suorittamaan.</p><p>MID näyttää, mikä oikeasti vaikuttaa työssä jaksamiseen, ilmapiiriin ja sitoutumiseen. Johtaminen muuttuu vaikuttavammaksi, kun päätöksenteko perustuu siihen, mitä työyhteisössä tunnetaan – ei vain siihen, mitä näkyy.</p><strong>MID auttaa tekemään näkymättömästä näkyvää. Ja silloin kaikki voittavat.</strong></Reveal>
      </section>
      <section className="wf-meista-ai"><Reveal><p>MID syntyi tuomaan enemmän inhimillisyyttä työelämään.</p><h2>Tekoäly ja ihminen muodostavat vahvan tiimin.</h2></Reveal></section>
    </> : page==="ukk" ? <>
      <section className="wf-ukk-hero"><Reveal><span>UKK</span><h1>Kysymyksiä<br/>ja vastauksia</h1><p>Täältä löydät vastaukset yleisimpiin MID Wellbeing -ratkaisua koskeviin kysymyksiin.</p></Reveal></section>
      <section className="wf-ukk-list" aria-label="Usein kysytyt kysymykset">{localizedFaqItems.map((item,i)=><Reveal delay={(i%2)*70} key={item.question}><details className="wf-ukk-item"><summary><span>{item.question}</span><i aria-hidden="true">+</i></summary><p>{item.answer}</p></details></Reveal>)}</section>
      <section className="wf-ukk-help"><Reveal><span>ETKÖ LÖYTÄNYT VASTAUSTA?</span><h2>Jatketaan keskustelua.</h2><p>Kerro meille, mitä haluat tietää MID Wellbeingistä.</p><a href={localePath(locale,"yhteydenotto")}>Ota yhteyttä</a></Reveal></section>
    </> : <section className={`wf-subhero wf-subhero-${page}`}>
      <div className="wf-subcopy"><Reveal><span>{data.eyebrow}</span><h1>{data.title}</h1><p>{data.sub}</p>{data.cta&&<a className="wf-blue-button" href="https://dashboard.midwellbeing.com/startPage">{data.cta}</a>}</Reveal></div><Reveal delay={120} className="wf-subimage"><img src={data.image} alt=""/></Reveal>
    </section>}
    {page!=="miksi" && page!=="tarjoaa" && page!=="testaa" && page!=="meista" && page!=="ukk" && data.cards.length>0 && <section className="wf-cards">{data.cards.map((c,i)=><Reveal className="wf-card" delay={i*80} key={c.title}><div className="wf-card-title">{c.iconSrc&&<img src={c.iconSrc} alt=""/>}{c.icon&&<span>{c.icon}</span>}<h2>{c.title}</h2></div><p>{c.text}</p></Reveal>)}</section>}
    {page==="home" && <section className="wf-parallax" aria-label="Yhteistyö ja hyvinvointi"><div className="wf-parallax-shade"/></section>}
    {page==="yhteys" && <section className="wf-form"><Reveal><h2>Jätä yhteystietosi</h2><form onSubmit={event=>submitContact(event,"page")}><input aria-label="Nimi" placeholder="Nimi" name="name" autoComplete="name" maxLength={120}/><input aria-label="Sähköposti" placeholder="Sähköposti" name="email" type="email" autoComplete="email" maxLength={254} required/><textarea aria-label="Viesti" placeholder="Miten voimme auttaa?" name="message" maxLength={4000}/><button disabled={contactStates.page.kind==="sending"}>{contactStates.page.kind==="sending"?contactMessages[locale].sending:"OTA YHTEYTTÄ"}</button><p className={`wf-form-status ${contactStates.page.kind}`} aria-live="polite">{contactStates.page.kind==="success"?contactMessages[locale].success:contactStates.page.message||""}</p></form></Reveal></section>}
    {page==="miksi" ? <section className="wf-miksi-quote"><Reveal className="wf-slogan-reveal"><blockquote>“Jokainen ajatus syntyy tunteesta – jokaisen tunteen takana on tarina”</blockquote><p>— MID Wellbeingin ydinajatus</p><a href="https://dashboard.midwellbeing.com/startPage">Aloita</a></Reveal></section> : page==="tarjoaa" ? <section className="wf-tarjoaa-quote"><Reveal className="wf-slogan-reveal"><blockquote>“Oivallus ohjaa kehitystä”</blockquote><p>Kehitys syntyy uskalluksesta pysähtyä, kokeilla ja oppia.</p><a href="https://dashboard.midwellbeing.com/startPage">Aloita</a></Reveal></section> : page==="testaa" ? <section className="wf-testaa-quote"><Reveal className="wf-slogan-reveal"><blockquote>“Hyvinvointi alkaa oivalluksesta – ja jokainen oivallus alkaa uteliaisuudesta”</blockquote><a href="https://mid-demo-73dezblnk-midc-onsulting.vercel.app/">Tee testi</a></Reveal></section> : page==="meista" || page==="ukk" ? null : <section className="wf-end"><Reveal className="wf-slogan-reveal"><h2>Muutos alkaa hyvinvoinnista – hyvinvointi alkaa oivalluksesta</h2><a href="https://dashboard.midwellbeing.com/startPage">Aloita</a></Reveal></section>}
    <footer><div className="wf-footer-left"><a href={localePath(locale,"")} className="wf-footer-logo wf-wordmark"><span><b>MID</b><small>Wellbeing</small></span></a><nav className="wf-footer-links" aria-label="Footer-navigaatio">{localizedNav.map(([l,h])=><a key={h} href={localePath(locale,h.slice(1))}>{l}</a>)}</nav></div><div className="wf-footer-action"><h3>Ollaan yhteydessä</h3><form onSubmit={event=>submitContact(event,"footer")}><input aria-label="Kirjoita sähköpostiosoitteesi" placeholder="Sähköpostiosoitteesi" name="email" type="email" autoComplete="email" maxLength={254} required/><button disabled={contactStates.footer.kind==="sending"}>{contactStates.footer.kind==="sending"?contactMessages[locale].sending:"Ota yhteyttä"}</button></form><p className={`wf-form-status ${contactStates.footer.kind}`} aria-live="polite">{contactStates.footer.kind==="success"?contactMessages[locale].success:contactStates.footer.message||""}</p><div className="wf-footer-note"><img className="wf-qr" src="/home-assets/qr-code.png" alt="QR-koodi MID Wellbeing -testiin"/><p>Älykkäämpää ja inhimillisempää työhyvinvointia.</p></div></div><small>© 2026 MID Wellbeing <span className="wf-legal-links"><a href={`/privacy-employer-${locale}.html`}>{legalLabels[locale].privacy}</a><a href={`/terms-employer-${locale}.html`}>{legalLabels[locale].terms}</a></span></small></footer>
  </main>;
}
