import { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Clock, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { outageApi, locationApi } from '../services/api';

const OutagesPage = () => {
    const [outages, setOutages] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchDistricts = async () => {
            try {
                const res = await locationApi.getDistricts();
                setDistricts(res.data?.data || []);
            } catch (error) {
                console.error('Error fetching districts:', error);
            }
        };
        fetchDistricts();
    }, []);

    useEffect(() => {
        const fetchOutages = async () => {
            setLoading(true);
            try {
                let res;
                if (selectedDistrict) {
                    res = await outageApi.getByDistrict(selectedDistrict, currentPage);
                } else {
                    res = await outageApi.getAll(currentPage);
                }
                const pageData = res.data?.data || {};
                setOutages(pageData.content || []);
                setTotalPages(pageData.totalPages || 0);
            } catch (error) {
                console.error('Error fetching outages:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOutages();
    }, [currentPage, selectedDistrict]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatTimeRange = (start, end) => {
        if (!start && !end) return null;
        const startStr = start ? new Date(start).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '??:??';
        const endStr = end ? new Date(end).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '??:??';
        return `${startStr} - ${endStr}`;
    };

    const filteredOutages = outages.filter(outage =>
        searchQuery === '' ||
        outage.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        outage.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="py-12 px-4 animate-fade-in">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4">Water Outages</h1>
                    <p className="text-gray-400">Browse all recorded water outage announcements from ASKİ</p>
                </div>

                {/* Filters */}
                <div className="glass rounded-2xl p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search outages..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* District Filter */}
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <select
                                value={selectedDistrict}
                                onChange={(e) => {
                                    setSelectedDistrict(e.target.value);
                                    setCurrentPage(0);
                                }}
                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:border-blue-500"
                            >
                                <option value="">All Districts</option>
                                {districts.map((district) => (
                                    <option key={district.id} value={district.id}>
                                        {district.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Outages List */}
                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="spinner" />
                    </div>
                ) : filteredOutages.length === 0 ? (
                    <div className="glass rounded-2xl p-16 text-center">
                        <AlertTriangle className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                        <p className="text-xl text-gray-300">No outages found</p>
                        <p className="text-gray-500 mt-2">Try adjusting your filters</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOutages.map((outage) => (
                            <div key={outage.id} className="glass rounded-2xl p-6 card-hover">
                                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                                    <div className="p-3 rounded-xl bg-yellow-500/20 self-start">
                                        <AlertTriangle className="h-6 w-6 text-yellow-400" />
                                    </div>

                                    <div className="flex-grow">
                                        <h3 className="text-xl font-semibold text-white mb-2">{outage.title}</h3>

                                        {outage.description && (
                                            <p className="text-gray-400 mb-4 line-clamp-3">{outage.description}</p>
                                        )}

                                        <div className="flex flex-wrap gap-4 text-sm">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Clock className="h-4 w-4" />
                                                <span>{formatDate(outage.publishedAt)}</span>
                                            </div>

                                            {formatTimeRange(outage.startTime, outage.endTime) && (
                                                <div className="flex items-center gap-2 text-blue-400">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{formatTimeRange(outage.startTime, outage.endTime)}</span>
                                                </div>
                                            )}

                                            {outage.affectedLocations && outage.affectedLocations.length > 0 && (
                                                <div className="flex items-center gap-2 text-purple-400">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>
                                                        {outage.affectedLocations
                                                            .map(loc => `${loc.neighborhoodName} (${loc.districtName})`)
                                                            .slice(0, 3)
                                                            .join(', ')}
                                                        {outage.affectedLocations.length > 3 && ` +${outage.affectedLocations.length - 3} more`}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {outage.sourceUrl && (
                                        <a
                                            href={outage.sourceUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300 text-sm whitespace-nowrap"
                                        >
                                            View Source →
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                            disabled={currentPage === 0}
                            className="p-2 rounded-lg glass hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="h-5 w-5 text-white" />
                        </button>

                        <span className="text-gray-400">
                            Page {currentPage + 1} of {totalPages}
                        </span>

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={currentPage === totalPages - 1}
                            className="p-2 rounded-lg glass hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="h-5 w-5 text-white" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OutagesPage;
