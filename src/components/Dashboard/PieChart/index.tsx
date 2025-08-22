"use client"

import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface PieChartProps {
    data?: Array<{ name: string; y: number }>;
    name?: string;
    showInLegend?: boolean;
    dataLabels?: boolean;
    colors?: string[] | undefined;
}

const PieChart: React.FC<PieChartProps> = ({ data, name, showInLegend = false, dataLabels = false, colors = undefined }) => {
    if (!data) return null;

    const options = {
        chart: {
            type: 'pie',
            backgroundColor: 'transparent',
            style: { fontFamily: 'inherit' },
            animation: process.env.NODE_ENV !== "test"
        },
        title: {
            text: name,
            style: { color: '#fff', fontWeight: 'bold', fontSize: '1.25rem' }
        },
        subtitle: {
            text: 'Data is from: <a href="https://api.adoptium.net/v3/stats/downloads/total" target="_blank" rel="noopener noreferrer">api.adoptium.net/v3/stats/downloads/total</a>',
            useHTML: true,
            style: { color: '#bdbdbd' }
        },
        accessibility: { enabled: false },
        tooltip: {
            backgroundColor: '#2c225a',
            borderColor: '#6ba4e7',
            style: { color: '#fff', fontWeight: 'bold' },
            formatter: function (this: unknown) {
                const ctx = this as { y?: number; point?: { name: string; percentage: number } };
                if (!ctx || !ctx.y) return '';
                const nbDownloads = Highcharts.numberFormat(ctx.y, 0, '.', ' ');
                return ctx.point?.name + '<b> ' + ctx.point?.percentage.toFixed(2) + '% </b><br/><b> ' + nbDownloads + '</b> downloads';
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 2,
                dataLabels: {
                    enabled: dataLabels,
                    format: '<b>{point.name}</b>: {point.percentage:.2f} %',
                    style: { color: '#fff', fontWeight: 'bold', textOutline: 'none', fontSize: '1rem' }
                },
                colors,
                shadow: false,
                showInLegend,
            }
        },
        legend: {
            itemStyle: { color: '#fff', fontWeight: 'bold' },
            itemHoverStyle: { color: '#6ba4e7' },
        },
        series: [{
            name,
            colorByPoint: true,
            data
        }]
    };

    return (
        <div className="chart">
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};

export default PieChart;
