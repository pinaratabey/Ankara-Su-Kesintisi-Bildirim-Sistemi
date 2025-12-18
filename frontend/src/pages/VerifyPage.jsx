import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Home, Bell } from 'lucide-react';
import { subscriptionApi } from '../services/api';

const VerifyPage = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setStatus('error');
            setMessage('No verification token provided');
            return;
        }

        const verify = async () => {
            try {
                await subscriptionApi.verify(token);
                setStatus('success');
                setMessage('Your email has been verified! You will now receive notifications about water outages in your area.');
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.error?.message || 'Failed to verify email. The link may be invalid or expired.');
            }
        };

        verify();
    }, [searchParams]);

    return (
        <div className="py-20 px-4 animate-fade-in">
            <div className="max-w-xl mx-auto text-center">
                <div className="glass rounded-3xl p-12">
                    {status === 'loading' && (
                        <>
                            <Loader2 className="h-16 w-16 text-blue-400 mx-auto mb-6 animate-spin" />
                            <h1 className="text-2xl font-bold text-white mb-4">Verifying...</h1>
                            <p className="text-gray-400">Please wait while we verify your email.</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6 success-pulse">
                                <CheckCircle className="h-10 w-10 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-4">Email Verified!</h1>
                            <p className="text-gray-400 mb-8">{message}</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/"
                                    className="inline-flex items-center gap-2 glass px-6 py-3 rounded-xl font-semibold text-white hover:bg-white/10 transition-colors"
                                >
                                    <Home className="h-5 w-5" />
                                    Return Home
                                </Link>
                                <Link
                                    to="/outages"
                                    className="inline-flex items-center gap-2 btn-gradient px-6 py-3 rounded-xl font-semibold text-white"
                                >
                                    <Bell className="h-5 w-5" />
                                    View Outages
                                </Link>
                            </div>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center mx-auto mb-6">
                                <XCircle className="h-10 w-10 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-4">Verification Failed</h1>
                            <p className="text-gray-400 mb-8">{message}</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/"
                                    className="inline-flex items-center gap-2 glass px-6 py-3 rounded-xl font-semibold text-white hover:bg-white/10 transition-colors"
                                >
                                    <Home className="h-5 w-5" />
                                    Return Home
                                </Link>
                                <Link
                                    to="/subscribe"
                                    className="inline-flex items-center gap-2 btn-gradient px-6 py-3 rounded-xl font-semibold text-white"
                                >
                                    <Bell className="h-5 w-5" />
                                    Try Again
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyPage;
