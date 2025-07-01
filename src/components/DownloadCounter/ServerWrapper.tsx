import DownloadCounter from ".";
import { fetchDownloadCount } from "@/utils/fetchDownloadCount";

export default async function DownloadCounterServerWrapper() {
    let total = 1000000000;
    try {
        total = await fetchDownloadCount();
    } catch { }
    return <DownloadCounter total={total} />;
}
