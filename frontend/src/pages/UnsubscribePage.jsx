import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { XCircle, CheckCircle, Loader2, Home } from 'lucide-react';
import { subscriptionApi } from '../services/api';

const UnsubscribePage = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setStatus('error');
            setMessage('No unsubscribe token provided');
            return;
        }

        const unsubscribe = async () => {
            try {
                await subscriptionApi.unsubscribe(token);
                setStatus('success');
                setMessage('You have been successfully unsubscribed from notifications.');
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.error?.message || 'Failed to unsubscribe. The link may be invalid or expired.');
            }
        };

        unsubscribe();
    }, [searchParams]);

    return (
        <div className="py-20 px-4 animate-fade-in">
            <div className="max-w-xl mx-auto text-center">
                <div className="glass rounded-3xl p-12">
                    {status === 'loading' && (
                        <>
                            <Loader2 className="h-16 w-16 text-blue-400 mx-auto mb-6 animate-spin" />
                            <h1 className="text-2xl font-bold text-white mb-4">Processing...</h1>
                            <p className="text-gray-400">Please wait while we process your request.</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="h-10 w-10 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-4">Unsubscribed</h1>
                            <p className="text-gray-400 mb-8">{message}</p>
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 btn-gradient px-6 py-3 rounded-xl font-semibold text-white"
                            >
                                <Home className="h-5 w-5" />
                                Return Home
                            </Link>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center mx-auto mb-6">
                                <XCircle className="h-10 w-10 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-4">Error</h1>
                            <p className="text-gray-400 mb-8">{message}</p>
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 btn-gradient px-6 py-3 rounded-xl font-semibold text-white"
                            >
                                <Home className="h-5 w-5" />
                                Return Home
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UnsubscribePage;
