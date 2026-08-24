import wacot from "@/assets/logos/wacot.jpg";
import cocacola from "@/assets/logos/cocacola.jpg";
import tetrapak from "@/assets/logos/tetrapak.png";
import fanmilk from "@/assets/logos/fanmilk.jpg";

import casePowerAudit from "@/assets/case-power-audit.jpg";
import caseEnergyManagement from "@/assets/case-energy-management.jpg";
import casePackagingAudit from "@/assets/case-packaging-audit.jpg";
import caseCalibration from "@/assets/case-calibration.jpg";

export type CaseStudySection = { heading: string; body: string; bullets?: string[] };

export type CaseStudy = {
  slug: string;
  client: string;
  logo: string;
  title: string;
  summary: string;
  hero: string;
  heroAlt: string;
  sector: string;
  location: string;
  period: string;
  scopeLines: string[];
  challenge: string;
  sections: CaseStudySection[];
  outcomes: string[];
  gallery?: { src: string; alt: string; caption: string }[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "wacot-power-system-audit",
    client: "WACOT Ltd",
    logo: wacot,
    title: "Plant-wide power system audit",
    summary:
      "Full power system audit of the WACOT Katsina processing plant, identifying distribution constraints and efficiency gains across the facility.",
    hero: casePowerAudit,
    heroAlt: "Engineers measuring power quality at a plant switchgear panel",
    sector: "Agro-processing",
    location: "Katsina, Nigeria",
    period: "Multi-phase engagement",
    scopeLines: [
      "Power system audit",
      "Load profiling & harmonics study",
      "Distribution reliability review",
    ],
    challenge:
      "The Katsina processing plant had grown in stages, and the electrical distribution network had grown with it — without a single consolidated view of loading, protection coordination or power quality. Production teams were seeing nuisance trips and unexplained losses, but no one could point to where the network was actually constrained.",
    sections: [
      {
        heading: "What we did",
        body: "We audited the plant end to end, from the incoming supply and generation sets through the LV distribution boards to the final process loads. Every board was traced, labelled and captured in an as-built single-line diagram, and instrumentation was installed to record real behaviour rather than nameplate assumptions.",
        bullets: [
          "As-built single-line diagram of the full distribution network",
          "Logging of voltage, current, power factor and harmonics at key boards",
          "Thermographic inspection of switchgear, busbars and terminations",
          "Protection settings and coordination review",
          "Cable and breaker sizing verification against measured load",
        ],
      },
      {
        heading: "What we found",
        body: "Measured demand differed sharply from the assumed load allocation. Several feeders were running close to their thermal limit while others were barely loaded, power factor was low enough to attract penalty on the utility bill, and harmonic distortion from drives was heating transformers and neutral conductors.",
      },
      {
        heading: "Recommendations delivered",
        body: "The audit closed with a prioritised remediation plan — quick wins that could be executed during a normal shift change, and capital items scoped with budget figures so the plant could plan them into the next maintenance window.",
        bullets: [
          "Load rebalancing across feeders to remove thermal constraints",
          "Power factor correction sizing to eliminate utility penalties",
          "Harmonic mitigation at the largest drive groups",
          "Retermination and replacement schedule for hot joints found on survey",
        ],
      },
    ],
    outcomes: [
      "Single verified view of plant electrical loading",
      "Prioritised, costed remediation roadmap",
      "Identified power factor penalty removal on the utility bill",
      "Reduced risk of unplanned distribution failure",
    ],
    gallery: [
      {
        src: casePowerAudit,
        alt: "Power quality analyser connected to a distribution panel",
        caption: "Instrumented logging at plant distribution boards during the audit window.",
      },
    ],
  },
  {
    slug: "nbc-energy-management",
    client: "Nigeria Bottling Company (Coca-Cola)",
    logo: cocacola,
    title: "Energy management across three plants",
    summary:
      "Energy management systems for Ikeja Plant 1 & 2 and Asejire, plus occupancy sensors, photocell security lighting, UPS design and nationwide UPS maintenance.",
    hero: caseEnergyManagement,
    heroAlt: "Energy monitoring instrumentation beside a beverage bottling line",
    sector: "Beverage manufacturing",
    location: "Ikeja & Asejire, Nigeria",
    period: "Multi-site programme",
    scopeLines: [
      "Energy management systems",
      "Lighting control & occupancy sensing",
      "UPS design and nationwide maintenance",
    ],
    challenge:
      "Energy was one of the largest controllable costs across the bottling operation, but consumption was only visible at the plant meter. Without line-level and utility-level breakdown, there was no way to attribute cost to a process, prove the effect of an efficiency measure or catch drift when a line started consuming more than it should.",
    sections: [
      {
        heading: "Metering and visibility",
        body: "We deployed energy management systems at Ikeja Plant 1, Ikeja Plant 2 and Asejire, instrumenting incomers, major feeders and utility plant so that consumption could be resolved down to the process that caused it. Data was aggregated into dashboards that operations and engineering could read without a specialist.",
        bullets: [
          "Sub-metering of incomers, feeders and major utility plant",
          "Consumption dashboards with per-line and per-shift breakdown",
          "Baseline setting and drift alerting against expected consumption",
        ],
      },
      {
        heading: "Lighting and passive savings",
        body: "Lighting was an easy, permanent saving. Occupancy sensors were installed in intermittently-used areas so lighting follows presence rather than shift patterns, and photocell control was applied to security lighting so external circuits track daylight rather than a timer that drifts through the year.",
        bullets: [
          "Occupancy-sensed lighting in warehouses, plant rooms and amenity areas",
          "Photocell-controlled perimeter and security lighting",
        ],
      },
      {
        heading: "Secure power",
        body: "We designed the UPS provision protecting control systems and IT infrastructure, then took on scheduled UPS maintenance nationwide — battery testing, load-bank verification and replacement planning — so that backup power is a known quantity rather than an assumption.",
        bullets: [
          "UPS sizing and design for control and IT loads",
          "Nationwide preventive maintenance and battery replacement programme",
        ],
      },
    ],
    outcomes: [
      "Per-line and per-utility energy visibility across three plants",
      "Permanent lighting load reduction through occupancy and daylight control",
      "Verified, maintained backup power for critical control systems",
      "Consumption baselines that make future savings measurable",
    ],
    gallery: [
      {
        src: caseEnergyManagement,
        alt: "Energy monitoring display on a bottling line",
        caption: "Line-level energy monitoring feeding the plant consumption dashboards.",
      },
    ],
  },
  {
    slug: "tetra-pak-packaging-network-audit",
    client: "Tetra Pak",
    logo: tetrapak,
    title: "Packaging network power audit",
    summary:
      "Power system audit of the Chivita packaging systems distribution network, covering load profiling and reliability of the distribution infrastructure.",
    hero: casePackagingAudit,
    heroAlt: "Engineer reviewing a packaging plant electrical distribution room",
    sector: "Packaging systems",
    location: "Nigeria",
    period: "Audit engagement",
    scopeLines: [
      "Distribution network audit",
      "Load profiling",
      "Reliability and continuity assessment",
    ],
    challenge:
      "Packaging lines are unforgiving: a voltage dip or a protection mis-trip stops the line and scraps product in process. Tetra Pak needed an independent view of whether the distribution infrastructure feeding the Chivita packaging systems could support the installed equipment reliably.",
    sections: [
      {
        heading: "Audit approach",
        body: "We profiled the distribution network under real production conditions rather than at idle, capturing start-up transients, steady-state loading and the interaction between the filling and packaging equipment and the rest of the site.",
        bullets: [
          "Load profiling across a full production cycle",
          "Voltage stability and dip capture at line supply points",
          "Earthing and bonding verification at machine level",
          "Protection discrimination review from incomer to machine",
        ],
      },
      {
        heading: "Findings and remediation",
        body: "The audit isolated the supply points most exposed to disturbance and the protection settings that would drop more of the plant than necessary on a downstream fault. Each finding was written up with a specific corrective action and a risk rating so the plant could sequence the work.",
      },
    ],
    outcomes: [
      "Independent verification of distribution adequacy for the packaging lines",
      "Protection discrimination corrections to limit fault impact",
      "Documented load profile for future line expansion",
      "Reduced exposure to disturbance-driven line stoppages",
    ],
    gallery: [
      {
        src: casePackagingAudit,
        alt: "Distribution switchboards and cable management in a packaging plant",
        caption: "Distribution infrastructure surveyed during the packaging network audit.",
      },
    ],
  },
  {
    slug: "fanmilk-calibration-access-control",
    client: "FanMilk",
    logo: fanmilk,
    title: "Calibration and access control",
    summary:
      "Calibration of weighing scales and 12 production tanks for billing and process accuracy, followed by a site-wide access control implementation.",
    hero: caseCalibration,
    heroAlt: "Technician calibrating instrumentation on a stainless steel production tank",
    sector: "Dairy manufacturing",
    location: "Nigeria",
    period: "2023 – 2024",
    scopeLines: [
      "Weighing scale calibration",
      "Calibration of 12 production tanks",
      "Site-wide access control",
    ],
    challenge:
      "Measurement accuracy sits directly on top of both product quality and money: an out-of-tolerance scale distorts batch recipes and goods-received reconciliation, and uncalibrated tank level measurement makes yield accounting unreliable. Separately, site access was managed manually with no auditable record of who entered production areas.",
    sections: [
      {
        heading: "Calibration programme",
        body: "We calibrated the plant weighing scales and all twelve production tanks against traceable references, documenting as-found and as-left values so the plant has evidence of drift over time rather than a single pass/fail certificate.",
        bullets: [
          "Traceable calibration of weighing scales used for batching and receipt",
          "Level and volume calibration across 12 production tanks",
          "As-found / as-left recording to establish drift rates",
          "Recalibration interval recommendations per instrument",
        ],
      },
      {
        heading: "Access control implementation",
        body: "We then implemented access control across the site, mapping doors to zones and zones to roles so that production, cold chain and administrative areas are separately controlled. Every event is logged, which gives the plant both a security record and an attendance record from the same infrastructure.",
        bullets: [
          "Zone-based door controllers and readers",
          "Role-based access rights per department",
          "Full event logging with time & attendance reporting",
          "Anti-passback and controlled visitor access at main entries",
        ],
      },
    ],
    outcomes: [
      "Traceable measurement accuracy for batching and yield accounting",
      "Documented drift history supporting the plant quality system",
      "Auditable, role-based control of production area access",
      "Attendance reporting derived from existing access infrastructure",
    ],
    gallery: [
      {
        src: caseCalibration,
        alt: "Instrument calibration on dairy production tanks",
        caption: "Calibration of production tank instrumentation against traceable references.",
      },
    ],
  },
];
