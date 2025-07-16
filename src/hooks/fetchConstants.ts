import { useEffect, useState } from "react";
import axios from "axios";
import { capitalize } from "@/utils/capitalize";

const baseUrl = "https://api.adoptium.net/v3";

export function useOses(isVisible: boolean): OperatingSystem[] {
  const [oses, setOses] = useState<OperatingSystem[]>([]);

  useEffect(() => {
    let isMounted = true;
    const cancelToken = axios.CancelToken.source();

    if (isVisible) {
      (async () => {
        const url = `${baseUrl}/types/operating_systems`;

        axios
          .get(url, { cancelToken: cancelToken.token })
          .then(function (response) {
            if (!isMounted) return;

            const newOses = response.data
              .map((s: string) => {
                const o: OperatingSystem = {
                  name: capitalize(s),
                  value: s.toLowerCase(),
                };
                return o;
              })
              .sort((o1: OperatingSystem, o2: OperatingSystem) =>
                o1.name.localeCompare(o2.name)
              );

            setOses(newOses);
          })
          .catch(function (error) {
            if (!isMounted || axios.isCancel(error)) return;
            setOses([]);
          });
      })();
    }

    return () => {
      isMounted = false;
      cancelToken.cancel("Component unmounted");
    };
  }, [isVisible]);

  return oses;
}

export function useArches(isVisible: boolean): Architecture[] {
  const [arches, setArches] = useState<Architecture[]>([]);

  useEffect(() => {
    let isMounted = true;
    const cancelToken = axios.CancelToken.source();

    if (isVisible) {
      (async () => {
        const url = `${baseUrl}/types/architectures`;

        axios
          .get(url, { cancelToken: cancelToken.token })
          .then(function (response) {
            if (!isMounted) return;

            const newArches = response.data
              .map((s: string) => {
                const a: Architecture = { name: s, value: s.toLowerCase() };
                if (a.name === "x32") a.name = "x86";
                return a;
              })
              .sort((a1: Architecture, a2: Architecture) =>
                a1.name.localeCompare(a2.name)
              );

            setArches(newArches);
          })
          .catch(function (error) {
            if (!isMounted || axios.isCancel(error)) return;
            setArches([]);
          });
      })();
    }

    return () => {
      isMounted = false;
      cancelToken.cancel("Component unmounted");
    };
  }, [isVisible]);

  return arches;
}

export interface OperatingSystem {
  name: string;
  value: string;
}

export interface Architecture {
  name: string;
  value: string;
}
