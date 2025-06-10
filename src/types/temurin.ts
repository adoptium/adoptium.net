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
