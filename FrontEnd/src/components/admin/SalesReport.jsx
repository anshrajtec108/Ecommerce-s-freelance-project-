import React, { useEffect, useState } from 'react';
import { makeGetRequest } from '../../services/api.js';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import 'chart.js/auto';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const SalesReport = () => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const result = await makeGetRequest('/api/v1/admin/sales-report');
                console.log(result);

                // Handle the structure of the response data
                const { data } = result;

                // You might need to adjust based on actual response format
                const reportData = [
                    { date: 'Total Orders', sales: data.totalOrders },
                    { date: 'Total Sales', sales: data.totalSales }
                ];

                setReport(reportData);
                setLoading(false);
            } catch (err) {
                console.log(err);

                setError('Failed to fetch sales report');
                setLoading(false);
            }
        };
        fetchReport();
    }, []);

    const chartData = {
        labels: report ? report.map(item => item.date) : [], // Dates are Total Orders and Total Sales
        datasets: [
            {
                label: 'Sales',
                data: report ? report.map(item => item.sales) : [], // Sales data
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <header className="bg-white shadow-md p-4 rounded-lg mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Sales Report</h1>
            </header>
            <div className="bg-white p-6 rounded-lg shadow-md">
                {loading ? (
                    <p>Loading report...</p>
                ) : error ? (
                    <p className="text-red-600">{error}</p>
                ) : (
                    <div>
                        <Bar data={chartData} />
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold text-gray-800">Sales Overview</h2>
                            <ul className="list-disc pl-5 mt-2">
                                {report.map((item, index) => (
                                    <li key={index} className="text-gray-700">
                                        <span className="font-semibold">{item.date}: </span>
                                        {item.sales.toFixed(2)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalesReport;
