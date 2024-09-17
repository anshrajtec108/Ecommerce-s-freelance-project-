import React, { useEffect, useState } from 'react';
import { makeGetRequest } from '../../services/api.js';

const ErrorLogs = () => {
    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [filter, setFilter] = useState({ level: 'ERROR', source: ""});
    const [searchTerm, setSearchTerm] = useState('');
    
    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const params = {
                    level: filter.level || undefined,
                    source: filter.source || undefined,
                    searchTerm: searchTerm || undefined
                };
                const result = await makeGetRequest('/api/v1/admin/error-logs', params);
                setLogs(result.data);
                setFilteredLogs(result.data);
            } catch (error) {
                console.error('Failed to fetch logs:', error);
            }
        };
        fetchLogs();
    }, [filter, searchTerm]);

    useEffect(() => {
        // Filter and search logs based on filter and searchTerm
        const applyFilters = () => {
            let filtered = logs;

            if (filter.level) {
                filtered = filtered.filter(log => log.level === filter.level);
            }

            if (filter.source) {
                filtered = filtered.filter(log => log.source === filter.source);
            }

            if (searchTerm) {
                filtered = filtered.filter(log =>
                    log.message.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            setFilteredLogs(filtered);
        };

        applyFilters();
    }, [filter, searchTerm, logs]);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <header className="bg-white shadow-md p-4 rounded-lg mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Error Logs</h1>
            </header>
            <div className="bg-white p-6 rounded-lg shadow-md">
                {/* Filter and Search Section */}
                <div className="mb-4 flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Search logs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border rounded-md w-full md:w-1/2"
                    />
                    <div className="flex gap-4">
                        <select
                            value={filter.level}
                            onChange={(e) => setFilter(prev => ({ ...prev, level: e.target.value }))}
                            className="p-2 border rounded-md"
                        >
                            <option value="">All Levels</option>
                            <option value="INFO">INFO</option>
                            <option value="ERROR">ERROR</option>
                            <option value="SECURITY">SECURITY</option>
                            <option value="DEBUG">DEBUG</option>
                        </select>
                        <select
                            value={filter.source}
                            onChange={(e) => setFilter(prev => ({ ...prev, source: e.target.value }))}
                            className="p-2 border rounded-md"
                        >
                            <option value="">All Sources</option>
                            <option value="USER">USER</option>
                            <option value="SELLER">SELLER</option>
                            <option value="SYSTEM">SYSTEM</option>
                            <option value="PRODUCT">PRODUCT</option>
                            <option value="PAYMENT">PAYMENT</option>
                            <option value="ORDER">ORDER</option>
                        </select>
                    </div>
                </div>

                {/* Display Logs */}
                <div>
                    {filteredLogs.length === 0 ? (
                        <p>No logs found</p>
                    ) : (
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                            <thead className="bg-gray-200 text-gray-600">
                                <tr>
                                    <th className="p-2 border-b">Timestamp</th>
                                    <th className="p-2 border-b">Level</th>
                                    <th className="p-2 border-b">Source</th>
                                    <th className="p-2 border-b">Message</th>
                                    <th className="p-2 border-b">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.map((log, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="p-2 border-b">{new Date(log.timestamp).toLocaleString()}</td>
                                        <td className="p-2 border-b">{log.level}</td>
                                        <td className="p-2 border-b">{log.source}</td>
                                        <td className="p-2 border-b">{log.message}</td>
                                        <td className="p-2 border-b">
                                            <button
                                                className="text-blue-500 hover:underline"
                                                onClick={() => alert(JSON.stringify(log, null, 2))}
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ErrorLogs;
