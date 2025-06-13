import { useTranslations, useLocale } from "next-intl";
import { capitalize } from "@/utils/capitalize"
import { TemurinReleases } from "@/hooks"

const TemurinNightlyTable = ({ results, openModalWithChecksum }: { results: { releases: TemurinReleases[] }, openModalWithChecksum: (checksum: string) => void }) => {
  const t = useTranslations("Temurin.Nightly");
  const locale = useLocale();
  if (!results || !results.releases || results.releases.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">{t("no-results")}</div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-xl bg-[#1B1132]">
      <table className="min-w-full divide-y divide-[#3E3355]">
        <thead className="bg-[#26193F]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t("platform")}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t("type")}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t("build-tag")}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t("date")}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t("binary")}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t("installer")}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">SHA256</th>
          </tr>
        </thead>
        <tbody className="bg-[#1B1132] divide-y divide-[#3E3355]">
          {results.releases.map(
            (release: TemurinReleases) =>
              release &&
              Object.keys(release.platforms).map(function (key: string) {
                return release.platforms[key].assets.map(
                  (asset, idx) => (
                    <tr key={release.release_name + key + asset.type + idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{capitalize(asset.os)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{capitalize(asset.type)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{release.release_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{release.timestamp instanceof Date ? release.timestamp.toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" }) : new Date(release.timestamp).toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" })}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-pink">
                        <a href={asset.link.toString()} target="_blank" rel="noopener noreferrer">{asset.extension}</a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-pink">
                        {asset.installer_link ? (
                          <a href={asset.installer_link.toString()} target="_blank" rel="noopener noreferrer">{asset.installer_extension}</a>
                        ) : (
                          <span className="text-gray-500">{t("download-not-available")}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <button className="text-pink" onClick={() => openModalWithChecksum(asset.checksum)}>{t("checksum")}</button>
                      </td>
                    </tr>
                  )
                );
              })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TemurinNightlyTable
