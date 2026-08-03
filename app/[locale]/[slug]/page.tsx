import WebflowSite, { Locale } from "../../../components/WebflowSite";

const supported = new Set(["en","sv","de","fr","es"]);
const pages = {"miksi-mid":"miksi","mita-mid-tarjoaa":"tarjoaa","testaa-hyvinvointisi":"testaa","meista":"meista","ukk":"ukk","yhteydenotto":"yhteys"} as const;
export default async function Page({params}:{params:Promise<{locale:string;slug:string}>}){
  const { locale: requestedLocale, slug } = await params;
  const locale = (supported.has(requestedLocale) ? requestedLocale : "en") as Locale;
  const page = pages[slug as keyof typeof pages] ?? "home";
  return <WebflowSite page={page} locale={locale}/>;
}
