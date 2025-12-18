import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, Bell, MapPin } from 'lucide-react';
import { statisticsApi } from '../services/api';

const StatisticsPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await statisticsApi.getStats();
                setStats(res.data?.data || null);
            } catch (error) {
                console.error('Error fetching statistics:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="py-20 flex justify-center">
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div className="py-12 px-4 animate-fade-in">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Statistics</h1>
                    <p className="text-gray-400">Overview of water outage data and trends in Ankara</p>
                </div>

                {/* Main Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="glass rounded-2xl p-6 card-hover">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center mb-4">
                            <AlertTriangle className="h-7 w-7 text-white" />
                        </div>
                        <p className="text-4xl font-bold text-white mb-2">{stats?.totalOutages || 0}</p>
                        <p className="text-gray-400">Total Outages Recorded</p>
                    </div>

                    <div className="glass rounded-2xl p-6 card-hover">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 flex items-center justify-center mb-4">
                            <TrendingUp className="h-7 w-7 text-white" />
                        </div>
                        <p className="text-4xl font-bold text-white mb-2">{stats?.outagesLast7Days || 0}</p>
                        <p className="text-gray-400">Outages This Week</p>
                    </div>

                    <div className="glass rounded-2xl p-6 card-hover">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                            <BarChart3 className="h-7 w-7 text-white" />
                        </div>
                        <p className="text-4xl font-bold text-white mb-2">{stats?.outagesLast30Days || 0}</p>
                        <p className="text-gray-400">Outages This Month</p>
                    </div>

                    <div className="glass rounded-2xl p-6 card-hover">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                            <Bell className="h-7 w-7 text-white" />
                        </div>
                        <p className="text-4xl font-bold text-white mb-2">{stats?.totalActiveSubscriptions || 0}</p>
                        <p className="text-gray-400">Active Subscribers</p>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Outages by District */}
                    <div className="glass rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <MapPin className="h-6 w-6 text-purple-400" />
                            Outages by District
                        </h2>
                        {stats?.outagesByDistrict && stats.outagesByDistrict.length > 0 ? (
                            <div className="space-y-4">
                                {stats.outagesByDistrict.map((district, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-300">{district.districtName}</span>
                                            <span className="text-gray-400">{district.outageCount} outages</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                                style={{
                                                    width: `${Math.min((district.outageCount / Math.max(...stats.outagesByDistrict.map(d => d.outageCount))) * 100, 100)}%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <BarChart3 className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                                <p className="text-gray-500">No district data available yet</p>
                            </div>
                        )}
                    </div>

                    {/* Monthly Trend */}
                    <div className="glass rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <TrendingUp className="h-6 w-6 text-blue-400" />
                            Monthly Trend
                        </h2>
                        {stats?.monthlyTrend && stats.monthlyTrend.length > 0 ? (
                            <div className="space-y-4">
                                {stats.monthlyTrend.map((month, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-300">{month.month}</span>
                                            <span className="text-gray-400">{month.outageCount} outages</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full"
                                                style={{
                                                    width: `${Math.min((month.outageCount / Math.max(...stats.monthlyTrend.map(m => m.outageCount))) * 100, 100)}%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <TrendingUp className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                                <p className="text-gray-500">No trend data available yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Card */}
                <div className="mt-12 glass rounded-2xl p-8 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
                    <h3 className="text-xl font-semibold text-white mb-4">About This Data</h3>
                    <p className="text-gray-400">
                        Statistics are automatically collected from ASKİ's official announcements.
                        Data is updated every 30 minutes to ensure you have the most current information
                        about water outages in Ankara. Historical data helps identify patterns and
                        prepare for potential future outages in specific areas.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StatisticsPage;
