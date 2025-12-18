import { Droplets, Github, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="glass mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                                <Droplets className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-lg font-bold gradient-text">ASKİ Takip</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Ankara ASKİ water outage notification system. Stay informed about water cuts in your area.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="space-y-4">
                        <h3 className="text-white font-semibold">Quick Links</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>
                                <a href="/" className="hover:text-white transition-colors">Home</a>
                            </li>
                            <li>
                                <a href="/outages" className="hover:text-white transition-colors">Active Outages</a>
                            </li>
                            <li>
                                <a href="/statistics" className="hover:text-white transition-colors">Statistics</a>
                            </li>
                            <li>
                                <a href="/subscribe" className="hover:text-white transition-colors">Subscribe</a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h3 className="text-white font-semibold">Contact</h3>
                        <div className="space-y-2 text-gray-400 text-sm">
                            <a href="mailto:info@askitakip.com" className="flex items-center space-x-2 hover:text-white transition-colors">
                                <Mail className="h-4 w-4" />
                                <span>info@askitakip.com</span>
                            </a>
                            <a href="https://github.com" className="flex items-center space-x-2 hover:text-white transition-colors">
                                <Github className="h-4 w-4" />
                                <span>GitHub</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} ASKİ Takip. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
