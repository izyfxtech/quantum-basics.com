import abb from "@/assets/logos/abb.jpg";
import netvendor from "@/assets/logos/netvendor.jpg";
import hms from "@/assets/logos/hms.jpg";
import schneider from "@/assets/logos/schneider.jpg";
import huawei from "@/assets/logos/huawei.jpg";
import nokia from "@/assets/logos/nokia.jpg";
import airtel from "@/assets/logos/airtel.jpg";
import zte from "@/assets/logos/zte.jpg";
import moov from "@/assets/logos/moov.jpg";
import cocacola from "@/assets/logos/cocacola.jpg";
import frieslandcampina from "@/assets/logos/frieslandcampina.jpg";
import fmn from "@/assets/logos/fmn.jpg";
import honeywell from "@/assets/logos/honeywell.jpg";
import fanmilk from "@/assets/logos/fanmilk.jpg";
import bagco from "@/assets/logos/bagco.jpg";
import wacot from "@/assets/logos/wacot.jpg";
import solarmate from "@/assets/logos/solarmate.jpg";
import eauxwell from "@/assets/logos/eauxwell.jpg";
import aircom from "@/assets/logos/aircom.jpg";
import konexa from "@/assets/logos/konexa.jpg";
import zipline from "@/assets/logos/zipline.jpg";
import ericsson from "@/assets/logos/ericsson.jpg";
import tetrapak from "@/assets/logos/tetrapak.png";

export type Brand = { name: string; logo: string };

export const partners: Brand[] = [
  { name: "ABB", logo: abb },
  { name: "Schneider Electric", logo: schneider },
  { name: "HMS Networks", logo: hms },
  { name: "netVendor", logo: netvendor },
];

export const customers: Brand[] = [
  { name: "Huawei", logo: huawei },
  { name: "Nokia", logo: nokia },
  { name: "Ericsson", logo: ericsson },
  { name: "Airtel", logo: airtel },
  { name: "ZTE", logo: zte },
  { name: "Moov", logo: moov },
  { name: "Coca-Cola (NBC)", logo: cocacola },
  { name: "FrieslandCampina", logo: frieslandcampina },
  { name: "Flour Mills of Nigeria", logo: fmn },
  { name: "Honeywell Flour Mills", logo: honeywell },
  { name: "FanMilk", logo: fanmilk },
  { name: "BAGCO", logo: bagco },
  { name: "Tetra Pak", logo: tetrapak },
  { name: "WACOT Ltd", logo: wacot },
  { name: "Solarmate Engineering", logo: solarmate },
  { name: "Eauxwell", logo: eauxwell },
  { name: "Aircom International", logo: aircom },
  { name: "Konexa", logo: konexa },
  { name: "Zipline", logo: zipline },
];
