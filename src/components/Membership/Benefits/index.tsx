"use client";

import { useState } from "react";
import Image from "next/image";
import { LuPlus } from "react-icons/lu";

type RichLabel = {
  bold: string; // bold prefix (fontWeight 700)
  rest: string; // regular suffix (fontWeight 400)
};

type ExpandedItem = {
  label: RichLabel;
  strategic: boolean;
  enterprise: boolean;
  participant: boolean;
};

type Row = {
  title: string;
  items: ExpandedItem[];
};

const rows: Row[] = [
  {
    title: "Governance",
    items: [
      {
        label: {
          bold: "One guaranteed seat & one alternate representative",
          rest: " on each of the Adoptium Steering, Specification & Marketing Committees",
        },
        strategic: true,
        enterprise: false,
        participant: false,
      },
      {
        label: {
          bold: "Eligible to participate in elections for",
          rest: "1 member-level seats on each of Adoptium's Steering, Specification and Marketing Committees",
        },
        strategic: false,
        enterprise: true,
        participant: true,
      },
    ],
  },
  {
    title: "Technical and infrastructure sharing",
    items: [
      {
        label: {
          bold: "",
          rest: "Opportunity to list verified binaries on the high-visibility Adoptium marketplace",
        },
        strategic: true,
        enterprise: true,
        participant: true,
      },
      {
        label: {
          bold: "",
          rest: "Access to build/test resources for OpenJDK feature work, especially for hard to resource platforms (upcoming via Trestle)",
        },
        strategic: true,
        enterprise: true,
        participant: false,
      },
      {
        label: {
          bold: "",
          rest: "Access to public test results and shared triage efforts",
        },
        strategic: true,
        enterprise: true,
        participant: true,
      },
      {
        label: {
          bold: "",
          rest: "Cross-enterprise collaboration via the Incubator projects",
        },
        strategic: true,
        enterprise: true,
        participant: true,
      },
    ],
  },
  {
    title: "Visibility",
    items: [
      {
        label: {
          bold: "Logo placement on Adoptium website",
          rest: " and marketing collateral",
        },
        strategic: true,
        enterprise: true,
        participant: false,
      },
      {
        label: {
          bold: "Speaking opportunities",
          rest: " at Adoptium-sponsored events and conferences",
        },
        strategic: true,
        enterprise: false,
        participant: false,
      },
    ],
  },
  {
    title: "Content & thought leadership",
    items: [
      {
        label: {
          bold: "",
          rest: "Option to issue a joint press release upon joining",
        },
        strategic: true,
        enterprise: false,
        participant: false,
      },
      {
        label: {
          bold: "",
          rest: "Opportunity to appoint a spokesperson to participate in analyst briefings and media outreach",
        },
        strategic: true,
        enterprise: true,
        participant: false,
      },
      {
        label: {
          bold: "",
          rest: "Featured participation in success stories, case studies, or blog series",
        },
        strategic: true,
        enterprise: true,
        participant: true,
      },
      {
        label: {
          bold: "",
          rest: "Submit content to Adoptium community news",
        },
        strategic: true,
        enterprise: true,
        participant: true,
      },
      {
        label: {
          bold: "",
          rest: "Amplification of your Adoptium-related news and announcements across Adoptium channels",
        },
        strategic: true,
        enterprise: true,
        participant: true,
      },
      {
        label: {
          bold: "",
          rest: "Opportunity for co-branded marketing materials in the community booths at industry events or digital assets at virtual events",
        },
        strategic: true,
        enterprise: false,
        participant: false,
      },
      {
        label: {
          bold: "",
          rest: "Priority keynote session at Adoptium Summit events",
        },
        strategic: true,
        enterprise: true,
        participant: false,
      },
      {
        label: {
          bold: "",
          rest: "Priority keynote session at Adoptium Summit events",
        },
        strategic: true,
        enterprise: true,
        participant: false,
      },
      {
        label: {
          bold: "",
          rest: "Amplification of your Adoptium-related events across Adoptium channels",
        },
        strategic: true,
        enterprise: true,
        participant: true,
      },
      {
        label: {
          bold: "",
          rest: "Participation in Adoptium or EF community booths at industry events",
        },
        strategic: true,
        enterprise: true,
        participant: true,
      },
      {
        label: {
          bold: "",
          rest: "Opportunity to host open community meetups or Adoptium Summit webinar series",
        },
        strategic: true,
        enterprise: true,
        participant: true,
      },
    ],
  },
];

export default function MemberBenefitsTable() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) =>
    setOpenIndex((prev) => (prev === index ? null : index));

  return (
    <section className="max-w-[1264px] mx-auto px-6 py-18">
      {/* Section heading */}
      <h2 className="text-center text-5xl font-semibold leading-[56px] text-white mb-12">
        Compare Membership Levels
      </h2>

      {/* Table card */}
      <div className="bg-white/5 p-8 rounded-3xl overflow-hidden mb-12">
        {/* Header row */}
        <div
          className="grid items-center px-8 py-6 border-b border-[#3E3355]"
          style={{ gridTemplateColumns: "1fr 220px 220px 220px 48px" }}
        >
          <div className="text-[#C4BFCE] text-xl font-semibold leading-7">
            Benefit Category
          </div>
          {["Strategic", "Enterprise", "Participant"].map((col) => (
            <div
              key={col}
              className="text-[#C4BFCE] text-xl font-semibold leading-7 text-center"
            >
              {col}
            </div>
          ))}
          <div /> {/* spacer */}
        </div>

        {/* Accordion rows */}
        {rows.map((row, index) => {
          const isOpen = openIndex === index;
          const isLast = index === rows.length - 1;

          return (
            <div key={index}>
              {/* Row trigger */}
              <div
                className={`grid items-center px-8 py-8 cursor-pointer ${
                  !isLast && !isOpen ? "border-b border-[#3E3355]" : ""
                }`}
                style={{ gridTemplateColumns: "1fr 220px 220px 220px 48px" }}
                onClick={() => toggle(index)}
              >
                {/* Title spans first 4 columns */}
                <div className="text-white text-2xl font-semibold leading-8 col-span-4">
                  {row.title}
                </div>

                {/* Toggle button */}
                <div className="flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle(index);
                    }}
                    aria-label={isOpen ? "Collapse section" : "Expand section"}
                    className="w-12 h-12 flex-shrink-0 rounded-full border-2 border-[#3E3355] bg-transparent flex items-center justify-center cursor-pointer transition-colors duration-200"
                  >
                    <LuPlus
                      size={24}
                      className={`${isOpen ? "rotate-45" : ""}`}
                    />
                  </button>
                </div>
              </div>

              {/* Expanded content */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div
                    className={`pb-6 flex flex-col gap-2 ${
                      !isLast ? "border-b border-[#3E3355]" : ""
                    }`}
                  >
                    {row.items.map((item, i) => (
                      <div
                        key={i}
                        className="grid items-center odd:bg-white/5 even:bg-transparent rounded-3xl px-6 py-4"
                        style={{
                          gridTemplateColumns: "1fr 220px 220px 220px 48px",
                        }}
                      >
                        {/* Label */}
                        <div className="text-white text-base leading-6 pr-4">
                          <strong className="font-bold">
                            {item.label.bold}
                          </strong>
                          <span className="font-normal">{item.label.rest}</span>
                        </div>

                        {/* Strategic */}
                        <div className="flex justify-center items-center">
                          {item.strategic ? (
                            <RenderIcon icon="tick" />
                          ) : (
                            <RenderIcon className="text-[#FF1464]" />
                          )}
                        </div>

                        {/* Enterprise */}
                        <div className="flex justify-center items-center">
                          {item.enterprise ? (
                            <RenderIcon icon="tick" />
                          ) : (
                            <RenderIcon className="text-[#FF1464]" />
                          )}
                        </div>

                        {/* Participant */}
                        <div className="flex justify-center items-center">
                          {item.participant ? (
                            <RenderIcon icon="tick" />
                          ) : (
                            <RenderIcon className="text-[#FF1464]" />
                          )}
                        </div>

                        {/* Spacer for toggle column alignment */}
                        <div />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function RenderIcon({
  icon,
  className,
}: {
  icon?: string;
  className?: string;
}) {
  if (icon === "tick") {
    return (
      <Image
        src="/images/icons/tick.svg"
        alt="tick"
        width={24}
        height={24}
        className={className}
      />
    );
  } else {
    return <LuPlus size={24} className={`rotate-45 ${className}`} />;
  }
}
