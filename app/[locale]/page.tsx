import WebflowSite, { Locale } from "../../components/WebflowSite";

const supported = new Set(["en","sv","de","fr","es"]);
export default async function Page({params}:{params:Promise<{locale:string}>}){
  const { locale: requestedLocale } = await params;
  const locale = (supported.has(requestedLocale) ? requestedLocale : "en") as Locale;
  return <WebflowSite page="home" locale={locale}/>;
}
