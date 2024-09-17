import React, { useEffect, useState } from 'react';
import { makeGetRequest, makePutRequest } from '../../services/api.js';

const SystemSettings = () => {
    const [settings, setSettings] = useState({
        siteName: '',
        adminEmail: '',
        maintenanceMode: false,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const result = await makeGetRequest('/api/v1/admin/system-settings');
                setSettings(result);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch settings');
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings({
            ...settings,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await makePutRequest('/api/v1/admin/system-settings', {}, settings);
            alert('Settings updated successfully');
        } catch (err) {
            setError('Failed to update settings');
        }
    };

    if (loading) return <p>Loading settings...</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <header className="bg-white shadow-md p-4 rounded-lg mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">System Settings</h1>
            </header>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="siteName" className="block text-gray-700">Site Name</label>
                        <input
                            type="text"
                            id="siteName"
                            name="siteName"
                            value={settings.siteName}
                            onChange={handleChange}
                            className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor="adminEmail" className="block text-gray-700">Admin Email</label>
                        <input
                            type="email"
                            id="adminEmail"
                            name="adminEmail"
                            value={settings.adminEmail}
                            onChange={handleChange}
                            className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor="maintenanceMode" className="inline-flex items-center">
                            <input
                                type="checkbox"
                                id="maintenanceMode"
                                name="maintenanceMode"
                                checked={settings.maintenanceMode}
                                onChange={handleChange}
                                className="form-checkbox"
                            />
                            <span className="ml-2 text-gray-700">Maintenance Mode</span>
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="mt-4 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SystemSettings;
