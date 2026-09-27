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
    "More room to explore your most ambitious ideas.",
  features: ["Ad-free experience", "Unlimited saves", "100 monthly credits"],
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
    "For a regular creative practice and fresh inspiration.",
  features: ["Ad-free experience", "Unlimited saves", "80 monthly credits"],
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
    "A simple starting point for your next creative idea.",
  features: ["Ad-free experience", "Unlimited saves", "40 monthly credits"],
  prevPrice: "$9.99",
  price: "$3.99",
  discount: "60% off",
  isPrimuim: false,
  icon: GiAngelWings,
  paymentLink: "https://buy.stripe.com/test_28oeYU96UdY00PmaEF",
};
