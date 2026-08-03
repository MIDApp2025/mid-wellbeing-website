import WebflowSite, { Locale } from "../../components/WebflowSite";

const supported = new Set(["en","sv","de","fr","es"]);
export default function Page({params}:{params:{locale:string}}){
  const locale = (supported.has(params.locale) ? params.locale : "en") as Locale;
  return <WebflowSite page="home" locale={locale}/>;
}
