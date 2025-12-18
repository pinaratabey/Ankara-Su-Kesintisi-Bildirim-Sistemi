import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Bell, BarChart3, ChevronRight, Droplets, MapPin, Clock } from 'lucide-react';
import { outageApi, statisticsApi } from '../services/api';

const HomePage = () => {
    const [recentOutages, setRecentOutages] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [outagesRes, statsRes] = await Promise.all([
                    outageApi.getRecent(),
                    statisticsApi.getStats()
                ]);
                setRecentOutages(outagesRes.data?.data || []);
                setStats(statsRes.data?.data || null);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 px-4">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
                <div className="max-w-7xl mx-auto relative">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse-slow">
                                <Droplets className="h-12 w-12 text-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            <span className="gradient-text">ASKİ Water Outage</span>
                            <br />
                            <span className="text-white">Notification System</span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            Stay informed about water outages in your neighborhood.
                            Subscribe to receive instant email notifications when ASKİ announces a water cut in your area.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/subscribe"
                                className="btn-gradient px-8 py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
                            >
                                <Bell className="h-5 w-5" />
                                Subscribe Now
                            </Link>
                            <Link
                                to="/outages"
                                className="glass px-8 py-4 rounded-xl font-semibold text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                            >
                                <AlertTriangle className="h-5 w-5" />
                                View Outages
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { label: 'Total Outages', value: stats?.totalOutages || 0, icon: AlertTriangle, color: 'from-red-500 to-orange-500' },
                            { label: 'Last 7 Days', value: stats?.outagesLast7Days || 0, icon: Clock, color: 'from-yellow-500 to-amber-500' },
                            { label: 'Last 30 Days', value: stats?.outagesLast30Days || 0, icon: BarChart3, color: 'from-blue-500 to-cyan-500' },
                            { label: 'Subscribers', value: stats?.totalActiveSubscriptions || 0, icon: Bell, color: 'from-purple-500 to-pink-500' },
                        ].map((stat, index) => (
                            <div key={index} className="glass rounded-2xl p-6 card-hover">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4`}>
                                    <stat.icon className="h-6 w-6 text-white" />
                                </div>
                                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                                <p className="text-gray-400">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Recent Outages Section */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-white">Recent Outages</h2>
                        <Link
                            to="/outages"
                            className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                        >
                            View All <ChevronRight className="h-5 w-5" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="spinner" />
                        </div>
                    ) : recentOutages.length === 0 ? (
                        <div className="glass rounded-2xl p-12 text-center">
                            <Droplets className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                            <p className="text-xl text-gray-300">No recent outages found</p>
                            <p className="text-gray-500 mt-2">Good news! There are no current water outages.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recentOutages.slice(0, 6).map((outage) => (
                                <div key={outage.id} className="glass rounded-2xl p-6 card-hover warning-card">
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="p-2 rounded-lg bg-yellow-500/20">
                                            <AlertTriangle className="h-5 w-5 text-yellow-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white line-clamp-2">{outage.title}</h3>
                                            <p className="text-sm text-gray-400 mt-1">{formatDate(outage.publishedAt)}</p>
                                        </div>
                                    </div>
                                    {outage.affectedLocations && outage.affectedLocations.length > 0 && (
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <MapPin className="h-4 w-4" />
                                            <span>
                                                {outage.affectedLocations.map(loc => loc.districtName).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="glass rounded-3xl p-8 md:p-12 text-center bg-gradient-to-r from-blue-600/20 to-purple-600/20">
                        <Bell className="h-16 w-16 text-blue-400 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Never Miss a Water Outage Again
                        </h2>
                        <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                            Subscribe to receive instant email notifications when ASKİ announces water cuts in your neighborhood.
                        </p>
                        <Link
                            to="/subscribe"
                            className="btn-gradient inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white"
                        >
                            <Bell className="h-5 w-5" />
                            Get Notifications
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
