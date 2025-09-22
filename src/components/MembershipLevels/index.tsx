import React from "react";
import CommonButton from "../Common/CommonButton";
import { Link } from "@/i18n/navigation";

interface MembershipTier {
  title: string;
  subtitle: string;
  pricing: string;
  pricingNote: string;
  benefits: string[];
  featured?: boolean;
}

const membershipTiers: MembershipTier[] = [
  {
    title: "Strategic",
    subtitle: "Member",
    pricing: "$10,000 - $50,000",
    pricingNote: "(Based on corporate revenue)",
    benefits: [
      "Critical to their organization's future",
      "Invest significant resources",
      "Committees participation",
      "Voting rights, high-level governance, influence roadmap",
    ],
    featured: true,
  },
  {
    title: "Enterprise",
    subtitle: "Member",
    pricing: "$12,000 - $32,000",
    pricingNote: "(Based on corporate revenue)",
    benefits: [
      "Critical to business operations",
      "Influence the direction of the ecosystem",
    ],
  },
  {
    title: "Participant",
    subtitle: "Member",
    pricing: "$0 - $15,000",
    pricingNote: "(Based on corporate revenue)",
    benefits: [
      "Adopts or builds on Adoptium technology",
      "Ensures alignment with their needs",
    ],
  },
];

interface MembershipLevelsProps {
  title?: string;
  description?: string;
}

export default function MembershipLevels({
  title = "Membership Levels",
  description = "Choose the membership level that best fits your organization's needs and engagement with the Adoptium community.",
}: MembershipLevelsProps) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-lg text-grey max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Membership Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {membershipTiers.map((tier, index) => (
            <div
              key={index}
              className={`relative bg-gradient-to-b from-[#1a0b2e] to-[#2d1b4e] rounded-2xl p-8 border transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                tier.featured
                  ? "border-rose-600 shadow-lg shadow-rose-600/20"
                  : "border-purple-600/30 hover:border-rose-600/50"
              }`}
            >
              {/* Tier Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-1">
                  {tier.title}
                </h3>
                <p className="text-lg text-rose-600 font-medium">
                  {tier.subtitle}
                </p>
              </div>

              {/* Pricing */}
              <div className="text-center mb-8">
                <div className="text-3xl font-bold text-white mb-2">
                  {tier.pricing}
                </div>
                <p className="text-sm text-grey">{tier.pricingNote}</p>
              </div>

              {/* Benefits */}
              <div className="space-y-4">
                {tier.benefits.map((benefit, benefitIndex) => (
                  <div key={benefitIndex} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-rose-500 to-rose-600 rounded-full flex items-center justify-center mt-0.5">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-white text-sm leading-relaxed">
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-grey mb-6">
            Questions about membership levels? We're here to help you choose the
            right tier.
          </p>
          <Link href="https://www.eclipse.org/org/workinggroups/adoptium-charter.php">
            <CommonButton>Learn More</CommonButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
