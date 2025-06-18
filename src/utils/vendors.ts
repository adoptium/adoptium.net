import type { Vendor } from "@/components/Marketplace/VendorSelector"

export default function getVendorIdentifier(vendor: Vendor) {
    return vendor.name.toLocaleLowerCase().replace(/\s+/g, "")
}
