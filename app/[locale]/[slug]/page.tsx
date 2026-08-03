import WebflowSite, { Locale } from "../../../components/WebflowSite";

const supported = new Set(["en","sv","de","fr","es"]);
const pages = {"miksi-mid":"miksi","mita-mid-tarjoaa":"tarjoaa","testaa-hyvinvointisi":"testaa","meista":"meista","ukk":"ukk","yhteydenotto":"yhteys"} as const;
export default function Page({params}:{params:{locale:string;slug:string}}){
  const locale = (supported.has(params.locale) ? params.locale : "en") as Locale;
  const page = pages[params.slug as keyof typeof pages] ?? "home";
  return <WebflowSite page={page} locale={locale}/>;
}
