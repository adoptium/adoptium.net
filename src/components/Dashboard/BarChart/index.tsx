"use client"

import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import startCase from 'lodash/startCase'

interface BarChartProps {
    data?: { [key: string]: number };
    name: string;
    startCaseKeys?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({ data, name, startCaseKeys }) => {
    if (!data) return null

    const options = {
        chart: {
            type: 'column',
            backgroundColor: 'transparent',
            style: { fontFamily: 'inherit' },
            animation: process.env.NODE_ENV !== "test"
        },
        colors: [
            "#2caffe", "#6c6de3", "#feae62", "#a259f7", "#f67280", "#43e97b"
        ],
        accessibility: {
            enabled: false,
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
        xAxis: {
            categories: Object.keys(data).map(v => startCaseKeys ? startCase(v) : v),
            crosshair: true,
            labels: { style: { color: '#fff', fontWeight: 'bold', fontSize: '1rem' } },
            lineColor: 'rgba(255,255,255,0.2)',
            tickColor: 'rgba(255,255,255,0.2)',
        },
        yAxis: {
            title: {
                text: 'Downloads',
                style: { color: '#fff', fontWeight: 'bold', fontSize: '1rem' }
            },
            labels: { style: { color: '#fff', fontWeight: 'bold', fontSize: '1rem' } },
            gridLineColor: 'rgba(255,255,255,0.1)'
        },
        legend: {
            itemStyle: { color: '#fff', fontWeight: 'bold' },
            itemHoverStyle: { color: '#6ba4e7' },
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
        series: [{
            name,
            data: Object.values(data)
        }]
    }

    return (
        <div className='chart'>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        </div>
    )
}

export default BarChart
