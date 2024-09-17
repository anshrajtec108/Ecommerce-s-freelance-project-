import React, { useEffect, useState } from 'react';
import { makeGetRequest } from '../../services/api'; // Import the API request function
import Charts from './Charts'; // Import the Charts component

const Dashboard = () => {
    const [logData, setLogData] = useState({ labels: [], values: [] });
    const [errorData, setErrorData] = useState({ labels: [], values: [] });
    const [report, setReport] = useState([]);
    const [totalUser, setTotalUser] = useState('');

    const fetchReport = async () => {
        try {
            const result = await makeGetRequest('/api/v1/admin/sales-report');
            const { data } = result;

            // Ensure report is an array with default values if needed
            const reportData = [
                { date: 'Total Orders', sales: data.totalOrders || 0 },
                { date: 'Total Sales', sales: data.totalSales || 0 }
            ];

            setReport(reportData);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchTotalUser = async () => {
        try {
            const result = await makeGetRequest('/api/v1/admin/totalUser');
            const { data } = result;
            setTotalUser(data || 0); // Default to 0 if no data is received
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const fetchLogStats = async () => {
            try {
                const logResult = await makeGetRequest('/api/v1/admin/log-statistics');
                const logStats = logResult.data;
                setLogData({
                    labels: logStats.map(stat => stat._id), // Assuming _id contains the source
                    values: logStats.map(stat => stat.count),
                });
            } catch (error) {
                console.error('Failed to fetch log statistics:', error);
            }
        };

        const fetchErrorStats = async () => {
            try {
                const errorResult = await makeGetRequest('/api/v1/admin/error-statistics');
                const errorStats = errorResult.data;
                setErrorData({
                    labels: errorStats.map(stat => stat._id), // Assuming _id contains the level
                    values: errorStats.map(stat => stat.count),
                });
            } catch (error) {
                console.error('Failed to fetch error statistics:', error);
            }
        };

        fetchReport();
        fetchTotalUser();
        fetchLogStats();
        fetchErrorStats();
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <header className="bg-white shadow-md p-4 rounded-lg mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome to the admin panel. Here an overview of key metrics and activities.</p>
            </header>
            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Total Users</h2>
                    <p className="text-3xl font-bold text-blue-600">{totalUser}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Total Sales</h2>
                    <p className="text-3xl font-bold text-green-600">{report[1]?.sales ?? 0}</p> {/* Default to 0 if data is missing */}
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Total Orders</h2>
                    <p className="text-3xl font-bold text-red-600">{report[0]?.sales ?? 0}</p> {/* Default to 0 if data is missing */}
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">System Health</h2>
                    <p className="text-3xl font-bold text-green-600">Good</p>
                </div>
                {/* Chart for Logs and Errors */}
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    <Charts logData={logData} errorData={errorData} />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
