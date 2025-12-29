import { Metadata } from "next";
import PageHeader from "@/components/Common/PageHeader";
import UsingTemurin from "@/components/About/UsingTemurin";
import Logos, { LogoType } from "@/components/Logos";
import Testimonials from "@/components/Testimonials";
import ImageText from "@/components/ImageText";
import ContactUs from "@/components/ContactUs";

export const metadata: Metadata = {
  title: "Business Benefits",
  description:
    "Learn how Eclipse Temurin can benefit your business with high-performance, cross-platform, open-source Java runtime binaries that are enterprise-ready and Java SE TCK-tested.",
};

export default function BusinessBenefitsPage() {
  return (
    <div>
      <PageHeader
        title="How Temurin can benefit your business"
        subtitle="Business Benefits"
        description="Eclipse Temurin offers high-performance, cross-platform, open-source Java runtime binaries that are enterprise-ready and Java SE TCK-tested for general use in the Java ecosystem."
      />
      <UsingTemurin />
      <Logos
        members={LogoType.ADOPTERS}
        title="Eclipse Temurin® Adopters"
        description="Companies that use Eclipse Temurin in production."
      />
      <Testimonials type="member" />
      <ImageText
        title="Need support with Temurin?"
        description="Eclipse Temurin is supported by a vibrant community of developers and users. If you need help, please reach out to us."
        linkText="Get Support"
        link="/support"
      />
      <ContactUs
        title="Contact us about how Temurin can help your business"
        buttontitle="Contact Us"
        linkTo="/join"
      />
    </div>
  );
}
