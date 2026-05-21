import { useEffect, useMemo, useRef, useState } from "react";
import type { CdxaLookup } from "@/types/temurin";
import { fetchCdxas } from "@/services/adoptiumApi";

interface UseAttestationsResult {
  attestations: CdxaLookup;
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
  checksums: string[],
): UseAttestationsResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  /**
   * Cache persists across renders but does not trigger rerenders.
   * This avoids refetching the same checksum repeatedly.
   */
  const cacheRef = useRef<CdxaLookup>({});

  /**
   * Deduplicate checksums early to:
   * - reduce processing
   * - avoid redundant joins
   * - make batching predictable
   *
   * We serialise the array to a string key so that useMemo produces
   * a stable reference even when callers pass a new array literal
   * on every render. Without this, the effect dependency would change
   * every render and cause an infinite fetch loop on errors.
   */
  const checksumKey = checksums.join("\0");
  const uniqueChecksums = useMemo(() => {
    return Array.from(new Set(checksums)).filter(Boolean);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checksumKey]);

  useEffect(() => {
    if (!releaseName || uniqueChecksums.length === 0) {
      return;
    }

    const unresolvedChecksums = uniqueChecksums.filter(
      (checksum) => !(checksum in cacheRef.current),
    );

    if (unresolvedChecksums.length === 0) {
      return;
    }

    let cancelled = false;

    async function fetchReleaseCdxas(releaseName: string) {
      setIsLoading(true);
      setError(undefined);

      try {
        const cdxas = await fetchCdxas(releaseName);

        if (cancelled) return;

        const cdxaMap: CdxaLookup = {};

        for (const cdxa of cdxas) {
          if (cdxa.target_checksum) {
            // Normalize checksum to uppercase for case-insensitive matching
            const normalizedChecksum = cdxa.target_checksum.toUpperCase();
            cdxaMap[normalizedChecksum] = cdxa;
          }
        }

        unresolvedChecksums.forEach((checksum) => {
          // Normalize checksum to uppercase for case-insensitive matching
          const normalizedChecksum = checksum.toUpperCase();
          cacheRef.current[normalizedChecksum] = cdxaMap[normalizedChecksum] ?? undefined;
        });
      } catch (err: unknown) {
        if (cancelled) return;

        // openapi-fetch throws on non-2xx; treat 404 as "no CDXAs".
        // The API layer should already handle 404 (returns []), but we guard
        // here as a safety net for any future refactoring.
        const status =
          err instanceof Response
            ? err.status
            : ((err as { response?: { status?: number }; status?: number })
                ?.response?.status ?? (err as { status?: number })?.status);
        if (status === 404) {
          unresolvedChecksums.forEach((checksum) => {
            cacheRef.current[checksum] = undefined;
          });
        } else {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchReleaseCdxas(releaseName);

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
