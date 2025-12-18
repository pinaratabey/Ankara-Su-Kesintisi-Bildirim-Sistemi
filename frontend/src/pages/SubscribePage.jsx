import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Bell, Mail, MapPin, CheckCircle, Loader2 } from 'lucide-react';
import { subscriptionApi, locationApi } from '../services/api';

const SubscribePage = () => {
    const [email, setEmail] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
    const [districts, setDistricts] = useState([]);
    const [neighborhoods, setNeighborhoods] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

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
        if (selectedDistrict) {
            const fetchNeighborhoods = async () => {
                try {
                    const res = await locationApi.getNeighborhoods(selectedDistrict);
                    setNeighborhoods(res.data?.data || []);
                    setSelectedNeighborhood('');
                } catch (error) {
                    console.error('Error fetching neighborhoods:', error);
                }
            };
            fetchNeighborhoods();
        } else {
            setNeighborhoods([]);
            setSelectedNeighborhood('');
        }
    }, [selectedDistrict]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !selectedNeighborhood) {
            toast.error('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await subscriptionApi.create({
                email,
                neighborhoodId: parseInt(selectedNeighborhood)
            });
            setSuccess(true);
            toast.success('Subscription created! Please check your email to verify.');
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Failed to create subscription';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="py-20 px-4 animate-fade-in">
                <div className="max-w-xl mx-auto text-center">
                    <div className="glass rounded-3xl p-12">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6 success-pulse">
                            <CheckCircle className="h-10 w-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-4">Subscription Created!</h1>
                        <p className="text-gray-400 mb-8">
                            We've sent a confirmation email to <span className="text-white font-medium">{email}</span>.
                            Please check your inbox and click the verification link to activate your subscription.
                        </p>
                        <p className="text-gray-500 text-sm">
                            Can't find the email? Check your spam folder.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-12 px-4 animate-fade-in">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-6">
                        <Bell className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">Subscribe to Notifications</h1>
                    <p className="text-gray-400">
                        Get instant email alerts when ASKİ announces water outages in your neighborhood
                    </p>
                </div>

                {/* Form */}
                <div className="glass rounded-3xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-white font-medium mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        {/* District */}
                        <div>
                            <label className="block text-white font-medium mb-2">
                                District
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <select
                                    value={selectedDistrict}
                                    onChange={(e) => setSelectedDistrict(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:border-blue-500 transition-colors"
                                    required
                                >
                                    <option value="">Select a district</option>
                                    {districts.map((district) => (
                                        <option key={district.id} value={district.id}>
                                            {district.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Neighborhood */}
                        <div>
                            <label className="block text-white font-medium mb-2">
                                Neighborhood
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <select
                                    value={selectedNeighborhood}
                                    onChange={(e) => setSelectedNeighborhood(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
                                    disabled={!selectedDistrict}
                                    required
                                >
                                    <option value="">
                                        {selectedDistrict ? 'Select a neighborhood' : 'First select a district'}
                                    </option>
                                    {neighborhoods.map((neighborhood) => (
                                        <option key={neighborhood.id} value={neighborhood.id}>
                                            {neighborhood.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-gradient py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Creating Subscription...
                                </>
                            ) : (
                                <>
                                    <Bell className="h-5 w-5" />
                                    Subscribe
                                </>
                            )}
                        </button>
                    </form>

                    {/* Info */}
                    <div className="mt-8 pt-8 border-t border-white/10">
                        <h3 className="text-white font-medium mb-4">How it works</h3>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li className="flex items-start gap-3">
                                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 text-xs">1</span>
                                <span>Enter your email and select your location</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 text-xs">2</span>
                                <span>Verify your email by clicking the link we send</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 text-xs">3</span>
                                <span>Receive instant notifications when water outages are announced</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscribePage;
