import { useEffect, useState } from "react";
import { capitalize } from "@/utils/capitalize";
import type { components } from "@/types/adoptiumApiTypes";
import {
  fetchOperatingSystems,
  fetchArchitectures,
} from "@/services/adoptiumApi";

export function useOses(isVisible: boolean): OperatingSystem[] {
  const [oses, setOses] = useState<OperatingSystem[]>([]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    if (isVisible) {
      fetchOperatingSystems(controller.signal)
        .then((data: string[]) => {
          if (!isMounted) return;
          const newOses = data
            .map((s: string) => {
              const o: OperatingSystem = {
                name: capitalize(s),
                value:
                  s.toLowerCase() as components["schemas"]["OperatingSystem"],
              };
              return o;
            })
            .sort((o1: OperatingSystem, o2: OperatingSystem) =>
              o1.name.localeCompare(o2.name),
            );
          setOses(newOses);
        })
        .catch(() => {
          if (!isMounted) return;
          setOses([]);
        });
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [isVisible]);

  return oses;
}

export function useArches(isVisible: boolean): Architecture[] {
  const [arches, setArches] = useState<Architecture[]>([]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    if (isVisible) {
      fetchArchitectures(controller.signal)
        .then((data: string[]) => {
          if (!isMounted) return;
          const newArches = data
            .map((s: string) => {
              const a: Architecture = {
                name: s,
                value: s.toLowerCase() as components["schemas"]["Architecture"],
              };
              if (a.name === "x32") a.name = "x86";
              return a;
            })
            .sort((a1: Architecture, a2: Architecture) =>
              a1.name.localeCompare(a2.name),
            );
          setArches(newArches);
        })
        .catch(() => {
          if (!isMounted) return;
          setArches([]);
        });
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [isVisible]);

  return arches;
}

export interface OperatingSystem {
  name: string;
  value: components["schemas"]["OperatingSystem"];
}

export interface Architecture {
  name: string;
  value: components["schemas"]["Architecture"];
}
