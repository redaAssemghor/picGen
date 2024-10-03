import Header from "../components/Header";
import { basicPlan, plusPlan, premiumPlan } from "../data/plans";
import PricingCard from "./PricingCard";

const Pricing = () => {
  return (
    <div className="relative">
      <div className="blur-3xl bg-image absolute h-full w-full z-10 bg-[--dark]"></div>
      <Header />
      <div className="p-10 z-50 relative text-[--light]">
        <ul className="flex h-full flex-col justify-center items-center gap-5">
          <li className="bg-[--dark] py-2 px-4">
            <h2 className="text-sm">Level up!</h2>
          </li>
          <li>
            <h1 className="lg:text-8xl text-4xl font-extrabold">
              We got a plan for you!
            </h1>
          </li>
          <li>
            <p className="text-xl font-semibold text-center">
              Pay monthly or yearly and enjoy a 7 day free trial. Cancel
              whenever you feel like it - no fuss and no hoops.
            </p>
          </li>
        </ul>
      </div>
      <div className="flex lg:flex-row flex-col items-end w-full justify-center">
        <PricingCard plan={plusPlan} />
        <PricingCard plan={premiumPlan} />
        <PricingCard plan={basicPlan} />
      </div>
    </div>
  );
};

export default Pricing;
