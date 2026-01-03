import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import type { Attestation, AttestationLookup } from "@/types/temurin";

const BASE_URL = "https://api.adoptium.net/v3";

interface UseAttestationsResult {
  attestations: AttestationLookup;
  isLoading: boolean;
  error?: Error;
}

/**
 * Fetches attestations for a given release and exposes them
 * as a normalized lookup keyed by target_checksum.
 *
 * IMPORTANT:
 * - Does NOT mutate Binary or ReleaseAsset
 * - Uses checksum as the join key
 * - Caches results for the hook lifecycle
 */
export function useAttestations(
  releaseName: string | undefined,
  checksums: string[]
): UseAttestationsResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  /**
   * Cache persists across renders but does not trigger rerenders.
   * This avoids refetching the same checksum repeatedly.
   */
  const cacheRef = useRef<AttestationLookup>({});

  /**
   * Deduplicate checksums early to:
   * - reduce processing
   * - avoid redundant joins
   * - make batching predictable
   */
  const uniqueChecksums = useMemo(() => {
    return Array.from(new Set(checksums)).filter(Boolean);
  }, [checksums]);

  useEffect(() => {
    if (!releaseName || uniqueChecksums.length === 0) {
      return;
    }

    /**
     * Determine which checksums we have not yet resolved.
     * A checksum explicitly cached as `undefined` means:
     * "fetched and no attestation exists".
     */
    const unresolvedChecksums = uniqueChecksums.filter(
      (checksum) => !(checksum in cacheRef.current)
    );

    if (unresolvedChecksums.length === 0) {
      return;
    }

    let cancelled = false;

    async function fetchAttestations() {
      setIsLoading(true);
      setError(undefined);

      try {
        const response = await axios.get<Attestation[]>(
          `${BASE_URL}/attestations/release_name/${encodeURIComponent(
            releaseName
          )}`,
          {
            params: { project: "jdk" },
          }
        );

        if (cancelled) return;

        const attestationMap: AttestationLookup = {};

        // Normalize response by checksum
        for (const attestation of response.data) {
          attestationMap[attestation.target_checksum] = attestation;
        }

        // Populate cache for requested checksums
        unresolvedChecksums.forEach((checksum) => {
          cacheRef.current[checksum] = attestationMap[checksum] ?? undefined;
        });
      } catch (err: any) {
        if (cancelled) return;

        /**
         * 404 means:
         * - No attestations for this release
         * - This is a VALID state, not an error
         */
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          unresolvedChecksums.forEach((checksum) => {
            cacheRef.current[checksum] = undefined;
          });
        } else {
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchAttestations();

    return () => {
      cancelled = true;
    };
  }, [releaseName, uniqueChecksums]);

  return {
    attestations: cacheRef.current,
    isLoading,
    error,
  };
}
