"use client"

import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export interface LineChartProps {
    series?: Highcharts.SeriesOptionsType[];
    categories?: string[];
    name?: string;
}

const LineChart: React.FC<LineChartProps> = ({ series, categories, name }) => {
    if (!series) return null;

    const options: Highcharts.Options = {
        chart: {
            type: 'line',
            backgroundColor: 'transparent',
            style: { fontFamily: 'inherit' },
        },
        title: {
            text: name,
            style: { color: '#fff', fontWeight: 'bold', fontSize: '1.25rem' },
        },
        subtitle: {
            text: 'Data is from: <a href="https://api.adoptium.net/v3/stats/downloads/tracking" target="_blank" rel="noopener noreferrer" style="color:#fff;text-decoration:underline;">api.adoptium.net/v3/stats/downloads/tracking</a>',
            useHTML: true,
            style: { color: '#bdbdbd' },
        },
        xAxis: {
            categories,
            labels: { style: { color: '#fff', fontWeight: 'bold', fontSize: '1rem' } },
            lineColor: 'rgba(255,255,255,0.2)',
            tickColor: 'rgba(255,255,255,0.2)',
        },
        yAxis: {
            title: {
                text: 'Downloads',
                style: { color: '#fff', fontWeight: 'bold', fontSize: '1rem' },
            },
            labels: { style: { color: '#fff', fontWeight: 'bold', fontSize: '1rem' } },
            gridLineColor: 'rgba(255,255,255,0.1)',
        },
        accessibility: { enabled: false },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true,
            backgroundColor: '#2c225a',
            borderColor: '#6ba4e7',
            style: { color: '#fff', fontWeight: 'bold' },
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true,
                    style: { color: '#fff', fontWeight: 'bold', textOutline: 'none' },
                },
                marker: {
                    enabled: true,
                    fillColor: '#fff',
                    lineColor: '#6ba4e7',
                },
            },
        },
        series,
    };

    return (
        <div className="chart">
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};

export default LineChart;
