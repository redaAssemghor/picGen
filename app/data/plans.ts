import { IconType } from "react-icons";
import { BsBookmarkPlusFill } from "react-icons/bs";
import { FaCrown } from "react-icons/fa6";
import { GiAngelWings } from "react-icons/gi";

export type Plan = {
  name: string;
  description: string;
  features: string[];
  prevPrice: string;
  price: string;
  discount: string;
  isPrimuim?: boolean;
  icon: IconType;
  paymentLink: string;
};

export const premiumPlan: Plan = {
  name: "Premium",
  description:
    "Full access to all the premium features across all platforms with a generous amount of AI credits.",
  features: ["Ad-Free", "Unlimited saves", "100 monthly AI Credits"],
  prevPrice: "$19.99",
  price: "$9.99",
  discount: "50% off",
  isPrimuim: true,
  icon: FaCrown,
  paymentLink: "https://buy.stripe.com/test_6oE3gc82Q6vy9lSfYY",
};

export const plusPlan: Plan = {
  name: "Plus",
  description:
    "Access to most premium features with a substantial amount of AI credits.",
  features: ["Ad-Free", "Unlimited saves", "80 monthly AI Credits"],
  prevPrice: "$14.99",
  price: "$6.99",
  discount: "53% off",
  isPrimuim: false,
  icon: BsBookmarkPlusFill,
  paymentLink: "https://buy.stripe.com/test_fZebMI0AodY0cy45km",
};

export const basicPlan: Plan = {
  name: "Basic",
  description:
    "Essential features for getting started, with a basic amount of AI credits.",
  features: ["Ad-Free", "Unlimited saves", "40 monthly AI Credits"],
  prevPrice: "$9.99",
  price: "$3.99",
  discount: "60% off",
  isPrimuim: false,
  icon: GiAngelWings,
  paymentLink: "https://buy.stripe.com/test_28oeYU96UdY00PmaEF",
};
