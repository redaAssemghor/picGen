import { CREDIT_PACKS, PackId } from "@/lib/plans";
import PricingCard from "./PricingCard";
export default function Pricing() {
  return <main className="shell pricing-section"><div className="section-heading text-center"><span className="eyebrow">MAKE ROOM FOR MORE IDEAS</span><h1>Your creativity.<br />Your pace.</h1><p>Start with 50 welcome credits. Top up when inspiration strikes.<br />One image uses 5 credits. No subscription.</p></div><div className="pricing-grid">{(Object.keys(CREDIT_PACKS) as PackId[]).map(id => <PricingCard key={id} id={id} />)}</div><p className="pricing-note">One-time credit packs · No recurring charges · Failed generations are refunded</p></main>;
}
