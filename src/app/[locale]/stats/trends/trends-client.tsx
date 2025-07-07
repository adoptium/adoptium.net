"use client"

import React, { useEffect, useState } from "react";
import PageHeader from "@/components/Common/PageHeader";
import { fetchAvailableReleases } from "@/utils/fetchAvailableReleases";
import BarChart from "@/components/Dashboard/BarChart";
import LineChart from "@/components/Dashboard/LineChart";
import StatsNav from "@/components/Dashboard/Nav";

interface SeriesType {
    name: string;
    data: (number | null)[];
    visible: boolean;
    type?: string;
}

type ArgsType = {
    visible: boolean;
    type: 'daily' | 'total';
    source?: string;
    feature_version: string;
    jvm_impl?: string;
};

type MonthlyArgsType = {
    type: 'monthly' | 'total';
    source?: string;
    feature_version: string;
    jvm_impl?: string;
};

const defaultArgs: ArgsType = { visible: true, type: 'daily', feature_version: '' };
const defaultArgs2: ArgsType = { visible: false, type: 'daily', feature_version: '' };
const defaultMonthlyArgs: MonthlyArgsType = { type: 'monthly', feature_version: '' };

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parseMonth(month: string) {
    const b = month.split('-');
    return monthNames[Number(b[1]) - 1] + ' ' + b[0];
}

function processData(
    data: Array<{ daily: number; total: number }>,
    type: 'daily' | 'total',
    visible: boolean,
    name: string
): SeriesType {
    let typeData: (number | null)[] = [];
    switch (type) {
        case 'daily':
            typeData = data.map(({ daily }) => daily);
            break;
        case 'total':
            typeData = data.map(({ total }) => total);
            break;
    }
    return {
        name,
        data: typeData,
        visible: data.length !== 0 && visible,
        type: 'line',
    };
}

function max(arr1: string[] = [], arr2: string[] = []) {
    return arr1.length > arr2.length ? arr1 : arr2;
}

function padArray(state: SeriesType, diff: number): SeriesType {
    return {
        ...state,
        data: Array(diff).fill(null).concat(state.data),
    };
}

function createSeries(series: SeriesType, series2: SeriesType): Highcharts.SeriesOptionsType[] {
    const s1 = { ...series, data: [...series.data] };
    const s2 = { ...series2, data: [...series2.data] };
    s1.data.splice(0, s1.data.lastIndexOf(null) + 1);
    s2.data.splice(0, s2.data.lastIndexOf(null) + 1);
    const diff = s1.data.length - s2.data.length;
    const arr: SeriesType[] = diff > 0 ? [s1, padArray(s2, diff)] : diff < 0 ? [padArray(s1, -diff), s2] : [s1, s2];
    return arr.map(s => ({
        type: 'line',
        name: s.name,
        data: s.data,
        visible: s.visible,
    })) as Highcharts.SeriesOptionsType[];
}

const sourceOptions = [
    { label: 'All', value: '' },
    { label: 'Github', value: 'github' },
    { label: 'Docker', value: 'dockerhub' },
];

const typeOptions = [
    { label: 'Daily', value: 'daily' },
    { label: 'Total', value: 'total' },
];

const monthlyTypeOptions = [
    { label: 'Monthly', value: 'monthly' },
    { label: 'Total', value: 'total' },
];

function NativeRadioGroup<T extends string | number | undefined>({ name, value, options, onChange }: { name: string, value: T, options: { label: string, value: T }[], onChange: (v: T) => void }) {
    const checkedValue = value ?? "";
    return (
        <div className="flex flex-row gap-3 flex-wrap">
            {options.map(opt => (
                <label key={String(opt.value)} className="flex items-center gap-1 cursor-pointer text-gray-200 text-sm">
                    <input
                        type="radio"
                        name={name}
                        value={String(opt.value)}
                        checked={checkedValue === opt.value}
                        onChange={() => onChange(opt.value)}
                        className="accent-blue-500 w-4 h-4"
                    />
                    <span>{opt.label}</span>
                </label>
            ))}
        </div>
    );
}

function NativeCheckbox({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) {
    return (
        <input type="checkbox" checked={checked} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.checked)} className="accent-blue-500 w-4 h-4" />
    );
}

function NativeSlider({ value, min, max, onChange, onAfterChange }: { value: number, min: number, max: number, onChange: (v: number) => void, onAfterChange: () => void }) {
    return (
        <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value))}
            onMouseUp={onAfterChange}
            onTouchEnd={onAfterChange}
            className="w-full accent-blue-500 h-2 rounded-lg bg-gray-700"
        />
    );
}

function NativeSpinner() {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <svg className="animate-spin h-8 w-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span className="ml-2 text-blue-300">Loading...</span>
        </div>
    );
}

interface FiltersBoxProps<T extends ArgsType | MonthlyArgsType> {
    argsObj: T;
    setArgsObj: React.Dispatch<React.SetStateAction<T>>;
    versions: number[] | undefined;
    isMonthly?: boolean;
    groupId: string;
}

function FiltersBox<T extends ArgsType | MonthlyArgsType>({
    argsObj,
    setArgsObj,
    versions,
    isMonthly = false,
    groupId,
}: FiltersBoxProps<T>) {
    const generateVersions = () => {
        const versionOpts: { label: string; value: string }[] = [{ label: 'All', value: '' }];
        if (versions) {
            for (const version of versions) {
                versionOpts.push({ label: 'JDK ' + version, value: String(version) });
            }
        }
        return versionOpts;
    };

    function hasVisible(obj: ArgsType | MonthlyArgsType): obj is ArgsType {
        return Object.prototype.hasOwnProperty.call(obj, 'visible');
    }

    return (
        <div className="filters bg-white/10 border border-white/10 rounded-xl p-4 flex flex-col gap-3 shadow-sm">
            <div className="text-sm font-semibold text-gray-200 mb-1">Filters</div>
            <div className="flex flex-col gap-2 md:flex-row md:gap-6">
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-300 font-medium mb-1">Source</label>
                    <NativeRadioGroup
                        name={`source-${groupId}`}
                        value={argsObj.source ?? ''}
                        options={sourceOptions}
                        onChange={(v: string) =>
                            setArgsObj(prev => ({
                                ...prev,
                                source: v === '' ? undefined : v,
                            }))
                        }
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-300 font-medium mb-1">Feature Version*</label>
                    <NativeRadioGroup
                        name={`feature_version-${groupId}`}
                        value={argsObj.feature_version}
                        options={generateVersions()}
                        onChange={(v: string) =>
                            setArgsObj(prev => ({
                                ...prev,
                                feature_version: v,
                            }))
                        }
                    />
                </div>
                {hasVisible(argsObj) && (
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-300 font-medium mb-1">Visible</label>
                        <NativeCheckbox
                            checked={argsObj.visible}
                            onChange={(v: boolean) =>
                                setArgsObj(prev => ({
                                    ...prev,
                                    visible: v,
                                }))
                            }
                        />
                    </div>
                )}
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-300 font-medium mb-1">Type</label>
                    <NativeRadioGroup
                        name={`type-${groupId}`}
                        value={argsObj.type}
                        options={isMonthly ? monthlyTypeOptions : typeOptions}
                        onChange={(v: string) =>
                            setArgsObj(prev => ({
                                ...prev,
                                type: v,
                            }))
                        }
                    />
                </div>
            </div>
        </div>
    );
}

const DownloadTrendsPage: React.FC = () => {
    const [series, setSeries] = useState<SeriesType | undefined>();
    const [series2, setSeries2] = useState<SeriesType | undefined>();
    const [monthlyData, setMonthlyData] = useState<Record<string, number> | undefined>();
    const [categories, setCategories] = useState<string[] | undefined>();
    const [categories2, setCategories2] = useState<string[] | undefined>();
    const [args, setArgs] = useState<ArgsType>({ ...defaultArgs });
    const [args2, setArgs2] = useState<ArgsType>({ ...defaultArgs2 });
    const [monthlyArgs, setMonthlyArgs] = useState<MonthlyArgsType>({ ...defaultMonthlyArgs });
    const [days, setDays] = useState<number>(30);
    const [versions, setVersions] = useState<number[] | undefined>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const releases = await fetchAvailableReleases();
            setVersions(releases.available_releases);
            await updateData(1, args);
            await updateData(2, args2);
            await updateMonthlyData(monthlyArgs);
            setLoading(false);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!loading) updateData(1, args);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [args]);

    useEffect(() => {
        if (!loading) updateData(2, args2);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [args2]);

    useEffect(() => {
        if (!loading) updateMonthlyData(monthlyArgs);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [monthlyArgs]);

    async function updateData(seriesID: number, argsObj: ArgsType) {
        const params = generateParams(argsObj);
        const data = await fetchTracking(params);
        if (!data) return;
        if (seriesID === 1) {
            setSeries(processData(data, argsObj.type, argsObj.visible, 'Series 1'));
            setCategories(data.map(({ date }: { date: string }) => formatDate(date)));
        } else {
            setSeries2(processData(data, argsObj.type, argsObj.visible, 'Series 2'));
            setCategories2(data.map(({ date }: { date: string }) => formatDate(date)));
        }
    }

    async function updateMonthlyData(argsObj: MonthlyArgsType) {
        const params = generateParams(argsObj);
        const data: Array<{ month: string; monthly: number; total: number }> = await fetchMonthly(params);
        if (!data) return;
        const monthly: Record<string, number> = {};
        data.forEach((d) => {
            monthly[parseMonth(d.month)] = argsObj.type === 'monthly' ? d.monthly : d.total;
        });
        setMonthlyData(monthly);
    }

    function generateParams(argsObj: ArgsType | MonthlyArgsType) {
        return {
            source: argsObj.source || undefined,
            feature_version: argsObj.feature_version !== '' ? Number(argsObj.feature_version) : undefined,
            jvm_impl: argsObj.jvm_impl || undefined,
            days,
        };
    }

    function formatDate(date: string) {
        const d = new Date(date);
        return d.toLocaleDateString('en-GB');
    }

    async function fetchTracking(params: Record<string, string | number | undefined>) {
        const url = new URL('https://api.adoptium.net/v3/stats/downloads/tracking/');
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) url.searchParams.append(key, String(value));
        });
        const res = await fetch(url.toString());
        if (!res.ok) return [];
        return res.json() as Promise<Array<{ date: string; daily: number; total: number }>>;
    }
    async function fetchMonthly(params: Record<string, string | number | undefined>) {
        const url = new URL('https://api.adoptium.net/v3/stats/downloads/monthly/');
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) url.searchParams.append(key, String(value));
        });
        const res = await fetch(url.toString());
        if (!res.ok) return [];
        return res.json() as Promise<Array<{ month: string; monthly: number; total: number }>>;
    }

    if (loading) {
        return <NativeSpinner />;
    }

    return (
        <div>
            <PageHeader
                title="Adoptium Download Trends"
                subtitle="Live download and Docker pull statistics for all Adoptium releases."
                className="max-w-3xl text-center mb-8"
            />
            <StatsNav />
            <div className="flex flex-col items-center min-h-screen py-8 px-2 w-full">
                <div className="w-full bg-white/5 rounded-2xl shadow-lg p-6 mb-8" style={{ maxWidth: '1800px' }}>
                    <LineChart
                        series={series && series2 ? createSeries(series, series2) : []}
                        categories={max(categories, categories2)}
                        name="Tracking Trends"
                    />
                    <div className="filters-box mt-6 flex flex-col gap-8 w-full max-w-4xl mx-auto">
                        <FiltersBox argsObj={args} setArgsObj={setArgs} versions={versions} groupId="1" />
                        <FiltersBox argsObj={args2} setArgsObj={setArgs2} versions={versions} groupId="2" />
                        <div className="column days mt-2">
                            <div>Days</div>
                            <NativeSlider
                                value={days}
                                max={180}
                                min={1}
                                onChange={setDays}
                                onAfterChange={() => { updateData(1, args); updateData(2, args2); }}
                            />
                        </div>
                    </div>
                </div>
                <div className="w-full bg-white/5 rounded-2xl shadow-lg p-6 mt-8" style={{ maxWidth: '1800px' }}>
                    <BarChart data={monthlyData || {}} name="Monthly Trends" />
                    <div className="filters-box mt-6 flex flex-col gap-8 w-full max-w-4xl mx-auto">
                        <FiltersBox argsObj={monthlyArgs} setArgsObj={setMonthlyArgs} versions={versions} isMonthly groupId="monthly" />
                    </div>
                </div>
                <p className="text-gray-400 mt-4">*Does not include results from the Official Docker Repo</p>
            </div>
        </div>
    );
};

export default DownloadTrendsPage;
