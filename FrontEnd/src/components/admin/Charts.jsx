import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { useDebounce } from 'use-debounce'; // For debounce on input changes

ChartJS.register(LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Charts = ({ logData, errorData }) => {
    const [selectedData, setSelectedData] = useState('logs');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [debouncedDateRange] = useDebounce(dateRange, 300);

    // Function to handle data change based on selection
    const getChartData = () => {
        const data = selectedData === 'logs' ? logData : errorData;
        return {
            labels: data.labels,
            datasets: [
                {
                    label: selectedData === 'logs' ? 'Log Statistics' : 'Error Statistics',
                    data: data.values,
                    borderColor: selectedData === 'logs' ? 'rgba(75,192,192,1)' : 'rgba(255,99,132,1)',
                    backgroundColor: selectedData === 'logs' ? 'rgba(75,192,192,0.2)' : 'rgba(255,99,132,0.2)',
                },
            ],
        };
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <header className="bg-white shadow-md p-4 rounded-lg mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Log and Error Statistics</h1>
            </header>
            <div className="bg-white p-6 rounded-lg shadow-md">
                {/* Controls */}
                <div className="mb-4 flex flex-col md:flex-row gap-4">
                    <select
                        value={selectedData}
                        onChange={(e) => setSelectedData(e.target.value)}
                        className="p-2 border rounded-md"
                    >
                        <option value="logs">Logs</option>
                        <option value="errors">Errors</option>
                    </select>
                    <div className="flex gap-4">
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            className="p-2 border rounded-md"
                        />
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            className="p-2 border rounded-md"
                        />
                    </div>
                </div>
                {/* Chart */}
                <div className="relative">
                    <Line data={getChartData()} options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        return `${context.dataset.label}: ${context.parsed.y}`;
                                    }
                                }
                            }
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Date'
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Count'
                                }
                            }
                        }
                    }} />
                </div>
            </div>
        </div>
    );
};

export default Charts;
