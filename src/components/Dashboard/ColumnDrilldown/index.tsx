"use client"

import React, { useEffect, useState, useRef } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { capitalize } from '@/utils/capitalize';

// Helper to split drilldown series by artifacts
type DrilldownEntry = { name: string; y: number; drilldown: string };
const splitDrilldownSeriesByArtifacts = (data: DrilldownEntry[]) => {
    const mArtifacts = new Map<string, { name: string; id: string; data: DrilldownEntry[] }>();
    data.forEach((entry) => {
        const { artifact, name } = getArtifactAndFormattedName(entry);
        if (artifact !== undefined && name !== undefined) {
            entry.name = name;
            if (!mArtifacts.has(artifact)) mArtifacts.set(artifact, { name: artifact, id: artifact, data: [] });
            mArtifacts.get(artifact)!.data.push(entry);
        }
    });
    return {
        artifacts: Object.fromEntries(mArtifacts)
    };
};

const getArtifactAndFormattedName = (entry: { name: string }) => {
    const tokens = entry.name.split('_');
    if (tokens.length > 0 && tokens[0].endsWith('sources')) {
        return { artifact: 'sources', name: 'sources' };
    } else if (tokens.length >= 5) {
        const artifact = tokens[0].slice(tokens[0].indexOf('-') + 1);
        const name = (entry.name.endsWith('.msi') || entry.name.endsWith('.pkg'))
            ? `${capitalize(tokens[2])} (${capitalize(tokens[1])} / installer)`
            : `${capitalize(tokens[2])} (${capitalize(tokens[1])})`;
        return { artifact, name };
    } else {
        return { artifact: undefined, name: undefined };
    }
};

interface ColumnDrilldownProps {
    name: string;
    availableReleases: { available_releases: string[] };
}

interface DrilldownData {
    name: string;
    y: number;
    drilldown: string;
}

interface DrilldownSeries {
    name: string;
    id: string;
    data: DrilldownData[];
}

const fetchDownloadStats = async (release: string, subpath = ''): Promise<Record<string, number> | null> => {
    const url = `https://api.adoptium.net/v3/stats/downloads/total/${release}${subpath ? '/' + subpath : ''}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.json();
};

const ColumnDrilldown: React.FC<ColumnDrilldownProps> = ({ name, availableReleases }) => {
    const [seriesData, setSeriesData] = useState<DrilldownData[]>([]);
    const [drilldownSeries, setDrilldownSeries] = useState<DrilldownSeries[]>([]);
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

    // Dynamically load drilldown module on client only
    useEffect(() => {
        if (typeof window !== 'undefined') {
            import('highcharts/modules/drilldown').then((mod) => {
                const drilldown = (mod as unknown as { default?: (h: typeof Highcharts) => void } | ((h: typeof Highcharts) => void));
                if (typeof drilldown === 'function') {
                    (drilldown as (h: typeof Highcharts) => void)(Highcharts);
                } else if (typeof (drilldown as { default?: (h: typeof Highcharts) => void }).default === 'function') {
                    ((drilldown as { default: (h: typeof Highcharts) => void }).default)(Highcharts);
                }
            });
        }
    }, []);

    useEffect(() => {
        const updateData = async () => {
            if (!availableReleases.available_releases) return;
            const drilldownSeriesArr: DrilldownSeries[] = [];
            const archLevelDrilldownSeries: DrilldownSeries[] = [];
            const seriesDataPromises = availableReleases.available_releases.map(async key => {
                const apiData: Record<string, number> | null = await fetchDownloadStats(key);
                if (!apiData) return null;
                const drilldownDataPromises = Object.keys(apiData).map(async apiDataKey => {
                    const secondLevelApiData = await fetchDownloadStats(key, apiDataKey);
                    if (!secondLevelApiData) return null;
                    const secondLevelDrilldownSeriesData: DrilldownEntry[] = Object.keys(secondLevelApiData).map(secondLevelApiKey => ({
                        name: secondLevelApiKey,
                        y: secondLevelApiData[secondLevelApiKey],
                        drilldown: secondLevelApiKey,
                    }));
                    const r = splitDrilldownSeriesByArtifacts(secondLevelDrilldownSeriesData);
                    archLevelDrilldownSeries.push({
                        name: apiDataKey,
                        id: apiDataKey,
                        data: Object.keys(r.artifacts).sort((a, b) => a.localeCompare(b)).map(val => ({
                            name: val,
                            y: r.artifacts[val].data.reduce((a: number, b: DrilldownEntry) => a + b.y || 0, 0),
                            drilldown: `${apiDataKey}-${val}`
                        }))
                    });
                    Object.keys(r.artifacts).forEach(val => {
                        archLevelDrilldownSeries.push({
                            name: `${apiDataKey}-${val}`,
                            id: `${apiDataKey}-${val}`,
                            data: r.artifacts[val].data.sort((a: DrilldownEntry, b: DrilldownEntry) => a.name.localeCompare(b.name))
                        });
                    });
                    return {
                        name: apiDataKey,
                        y: secondLevelDrilldownSeriesData.reduce((a, b) => a + b.y || 0, 0),
                        drilldown: apiDataKey,
                    };
                });
                const drilldownSeriesData = await Promise.all(drilldownDataPromises);
                drilldownSeriesArr.push({
                    name: `JDK${key}`,
                    id: key,
                    data: drilldownSeriesData as DrilldownEntry[],
                });
                return {
                    name: `JDK${key}`,
                    y: (drilldownSeriesData as DrilldownEntry[]).reduce((a, b) => a + b.y || 0, 0),
                    drilldown: key,
                };
            });
            const seriesData = (await Promise.all(seriesDataPromises)).filter(Boolean) as DrilldownEntry[];
            drilldownSeriesArr.push(...archLevelDrilldownSeries);
            setSeriesData(seriesData);
            setDrilldownSeries([...drilldownSeriesArr, ...archLevelDrilldownSeries]);
        };
        updateData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(availableReleases)]);

    if (!seriesData.length || !drilldownSeries.length) return null;

    const options: Highcharts.Options = {
        colors: [
            "#2caffe", "#6c6de3", "#feae62", "#a259f7", "#f67280", "#43e97b"
        ],
        chart: {
            type: 'column',
            backgroundColor: 'transparent',
            style: { fontFamily: 'inherit' },
            animation: process.env.NODE_ENV !== "test"
        },
        title: { text: name, style: { color: '#fff', fontWeight: 'bold', fontSize: '1.25rem' } },
        subtitle: {
            text: 'Click the columns to view the version specific data. Data is from: <a href="https://api.adoptium.net/" target="_blank" rel="noopener noreferrer" style="color:#fff;text-decoration:underline;">api.adoptium.net</a>',
            useHTML: true,
            style: { color: '#bdbdbd' }
        },
        xAxis: {
            type: 'category',
            labels: {
                autoRotation: [-10, -20, -30, -45],
                style: { color: '#fff', fontWeight: 'bold', fontSize: '1rem' },
                useHTML: true,
                formatter: function (this: Highcharts.AxisLabelsFormatterContextObject) {
                    if (typeof this.value === 'string' && this.value.startsWith('http')) {
                        return `<a href="${this.value}" target="_blank" style="color:#fff;text-decoration:underline;">${this.value}</a>`;
                    }
                    return String(this.value);
                }
            },
            lineColor: 'rgba(255,255,255,0.2)',
            tickColor: 'rgba(255,255,255,0.2)',
        },
        yAxis: {
            title: { text: 'Downloads', style: { color: '#fff', fontWeight: 'bold', fontSize: '1rem' } },
            labels: { style: { color: '#fff', fontWeight: 'bold', fontSize: '1rem' } },
            gridLineColor: 'rgba(255,255,255,0.1)'
        },
        legend: {
            itemStyle: { color: '#fff', fontWeight: 'bold' },
            itemHoverStyle: { color: '#6ba4e7' },
        },
        accessibility: {
            enabled: false,
        },
        tooltip: {
            backgroundColor: '#2c225a',
            borderColor: '#6ba4e7',
            style: { color: '#fff', fontWeight: 'bold' },
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                borderRadius: 6,
                dataLabels: {
                    enabled: true,
                    style: { color: '#fff', fontWeight: 'bold', textOutline: 'none' },
                    formatter: function (this: Highcharts.Point) {
                        if (!this || typeof this.y !== 'number') return '';
                        return Highcharts.numberFormat(this.y, 0, '.', ' ');
                    }
                },
                pointPadding: 0.2,
                borderWidth: 0,
                minPointLength: 10,
                shadow: false
            }
        },
        series: [
            {
                name: 'JDK Versions',
                data: seriesData,
                type: 'column',
            } as Highcharts.SeriesColumnOptions
        ],
        drilldown: {
            series: drilldownSeries as Highcharts.SeriesOptionsType[]
        }
    };

    return (
        <div className='chart' style={{ position: 'relative' }}>
            <style>{`
                .highcharts-drilldown-axis-label {
                    color: #fff !important;
                    text-decoration: underline;
                }
                .highcharts-drilldown-data-label text {
                    fill: #fff !important;
                    text-decoration: underline;
                }
                .highcharts-breadcrumbs text {
                    fill: #fff !important;
                }
                .highcharts-breadcrumbs-button text {
                    fill: #fff !important;
                }
            `}</style>
            <HighchartsReact
                ref={chartComponentRef}
                highcharts={Highcharts}
                options={options}
            />
        </div>
    );
};

export default ColumnDrilldown;