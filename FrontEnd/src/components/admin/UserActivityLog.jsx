import React, { useEffect, useState } from 'react';
import { makeGetRequest } from '../../services/api.js';
import { useParams } from 'react-router-dom';

const UserActivityLog = () => {
    const { id } = useParams();
    const [log, setLog] = useState([]);
    const [filteredLog, setFilteredLog] = useState([]);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        status: '',
        actionType: '',
    });

    useEffect(() => {
        const fetchLog = async () => {
            const result = await makeGetRequest(`/api/v1/admin/user-activity-log`);
            setLog(result.data);
            setFilteredLog(result.data);
        };
        fetchLog();
    }, []);

    useEffect(() => {
        // Apply filters to the log data
        let filtered = log;

        if (filters.startDate && filters.endDate) {
            filtered = filtered.filter(entry =>
                new Date(entry.timestamp) >= new Date(filters.startDate) &&
                new Date(entry.timestamp) <= new Date(filters.endDate)
            );
        }

        if (filters.status) {
            filtered = filtered.filter(entry => entry.status === filters.status);
        }

        if (filters.actionType) {
            filtered = filtered.filter(entry => entry.action === filters.actionType);
        }

        setFilteredLog(filtered);
    }, [filters, log]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <header className="bg-white shadow-md p-4 rounded-lg mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">User Activity Log</h1>
            </header>
            <div className="bg-white p-6 rounded-lg shadow-md">
                {/* Filters */}
                <div className="mb-4">
                    <input
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                        className="p-2 border rounded-md"
                    />
                    <input
                        type="date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                        className="p-2 border rounded-md ml-4"
                    />
                </div>
                {/* Table */}
                {filteredLog.length > 0 ? (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="border-b p-4 text-left">Timestamp</th>
                                <th className="border-b p-4 text-left">Action</th>
                                <th className="border-b p-4 text-left">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLog.map((entry, index) => (
                                <tr key={index}>
                                    <td className="border-b p-4">{new Date(entry.timestamp).toLocaleString()}</td>
                                    <td className="border-b p-4">{entry.action}</td>
                                    <td className="border-b p-4">
                                        {JSON.stringify({
                                            ipAddress: entry.ipAddress,
                                            source: entry.source,
                                            status: entry.status
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-600 text-center">No activity logs found for this user.</p>
                )}
            </div>
        </div>
    );
};

export default UserActivityLog;
