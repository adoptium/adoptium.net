// Common types for Temurin releases across the application
export interface VersionMetaData {
  major: number;
  minor: number;
  security: number;
  pre?: string;
  patch?: number;
  build: number;
  optional?: string;
  adopt_build_number?: number;
  openjdk_version: string;
  semver: string;
}

export interface Binary {
  type: string;
  link: string;
  checksum: string;
  size: number;
  extension: string;
  release_name: string;
  installer_link?: string;
  installer_checksum?: string;
  installer_size?: number;
  installer_extension?: string;
}

export interface ReleaseAsset {
  platform_name: string;
  os: string;
  architecture: string;
  release_name: string;
  release_link: string;
  release_date: string;
  version: VersionMetaData;
  binaries: Array<Binary>;
}

export interface Attestation {
  id: string;
  filename: string;
  featureVersion: number;
  release_name: string | null;
  os: string;
  architecture: string;
  image_type: string;
  jvm_impl: string;
  vendor: string;
  committedDate: string | null;

  /**
   * SHA256 checksum of the binary this attestation applies to.
   * This is the JOIN KEY between Binary and Attestation.
   */
  target_checksum: string;

  assessor_org: string | null;
  assessor_affirmation: string | null;
  assessor_claim_predicate: string | null;

  attestation_link: string | null;
  attestation_public_signing_key_link: string | null;
}

export type AttestationLookup = Record<string, Attestation | undefined>;
