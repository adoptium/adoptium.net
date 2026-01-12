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
 * Fetches attestations for a given release and exposes them as a normalized
 * lookup keyed by `target_checksum`.
 *
 * IMPORTANT:
 * - Does NOT mutate Binary or ReleaseAsset
 * - Uses checksum as the join key
 * - Caches results for the hook lifecycle
 *
 * CACHE INVARIANT:
 * - Every checksum passed to this hook is eventually written to the cache.
 * - If no attestation exists, the checksum is intentionally stored with
 *   value `undefined` to cache negative lookups.
 *
 * This design:
 * - avoids refetching the same checksum multiple times
 * - distinguishes "not yet resolved" from "resolved but not attested"
 *
 * Consumers must therefore check VALUE presence (not just key presence)
 * when determining whether an attestation exists.
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

    const unresolvedChecksums = uniqueChecksums.filter(
      (checksum) => !(checksum in cacheRef.current)
    );

    if (unresolvedChecksums.length === 0) {
      return;
    }

    let cancelled = false;

    async function fetchAttestations(releaseName: string) {
      setIsLoading(true);
      setError(undefined);

      try {
        const response = await axios.get<Attestation[]>(
          `${BASE_URL}/attestations/release_name/${encodeURIComponent(
            releaseName
          )}`,
          { params: { project: "jdk" } }
        );

        if (cancelled) return;

        const attestationMap: AttestationLookup = {};

        for (const attestation of response.data) {
          attestationMap[attestation.target_checksum] = attestation;
        }

        unresolvedChecksums.forEach((checksum) => {
          cacheRef.current[checksum] = attestationMap[checksum] ?? undefined;
        });
      } catch (err: any) {
        if (cancelled) return;

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

    fetchAttestations(releaseName);

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
