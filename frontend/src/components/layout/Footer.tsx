import { Link } from 'react-router-dom';
import { Lightbulb, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube, CircleHelp, Shield, Cookie, FileText } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        company: [
            { name: 'About Us', path: '/about' },
            { name: 'Careers', path: '/careers' },
            { name: 'Blog', path: '/blog' },
            { name: 'Press', path: '/press' },
        ],
        resources: [
            { name: 'Help Center', path: '/help-center', icon: CircleHelp },
            { name: 'FAQs', path: '/faqs', icon: FileText },
            { name: 'Contact Us', path: '/contact', icon: Mail },
            { name: 'Community', path: '/community' },
        ],
        legal: [
            { name: 'Privacy Policy', path: '/privacy-policy', icon: Shield },
            { name: 'Cookie Policy', path: '/cookie-policy', icon: Cookie },
            { name: 'Terms of Service', path: '/terms' },
            { name: 'Accessibility', path: '/accessibility' },
        ],
        teaching: [
            { name: 'Become an Instructor', path: '/instructor/apply' },
            { name: 'Teaching Center', path: '/teaching-center' },
            { name: 'Instructor Dashboard', path: '/instructor' },
        ],
    };

    const socialLinks = [
        { name: 'Facebook', icon: Facebook, url: 'https://facebook.com/isooko' },
        { name: 'Twitter', icon: Twitter, url: 'https://twitter.com/isooko' },
        { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/company/isooko' },
        { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/isooko' },
        { name: 'YouTube', icon: Youtube, url: 'https://youtube.com/isooko' },
    ];

    return (
        <footer className="bg-gradient-to-br from-[#0A2540] via-[#0f2d4d] to-[#1a3a5a] text-white">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-3 mb-6 group">
                            <div className="h-12 w-12 rounded-2xl bg-yellow-500 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                <Lightbulb className="h-7 w-7 text-[#0A2540]" />
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-2xl font-black tracking-tight">
                                    <span className="text-yellow-500">i</span>SooKO
                                </span>
                                <span className="text-[0.6rem] font-bold uppercase tracking-widest text-blue-200">
                                    Learning Platform
                                </span>
                            </div>
                        </Link>
                        <p className="text-sm text-blue-200 mb-6 leading-relaxed">
                            Empowering learners worldwide with quality education and innovative learning experiences.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <a href="mailto:support@isooko.com" className="flex items-center gap-2 text-sm text-blue-200 hover:text-yellow-500 transition-colors group">
                                <Mail className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                support@isooko.com
                            </a>
                            <a href="tel:+1234567890" className="flex items-center gap-2 text-sm text-blue-200 hover:text-yellow-500 transition-colors group">
                                <Phone className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                +1 (234) 567-890
                            </a>
                            <div className="flex items-start gap-2 text-sm text-blue-200">
                                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>123 Learning Street<br />Education City, EC 12345</span>
                            </div>
                        </div>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-wider text-yellow-500 mb-4">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-sm text-blue-200 hover:text-white hover:translate-x-1 transition-all inline-block"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-wider text-yellow-500 mb-4">Resources</h3>
                        <ul className="space-y-3">
                            {footerLinks.resources.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-sm text-blue-200 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2 group"
                                    >
                                        {link.icon && <link.icon className="h-4 w-4 group-hover:scale-110 transition-transform" />}
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-wider text-yellow-500 mb-4">Legal</h3>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-sm text-blue-200 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2 group"
                                    >
                                        {link.icon && <link.icon className="h-4 w-4 group-hover:scale-110 transition-transform" />}
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Teaching Links */}
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-wider text-yellow-500 mb-4">Teaching</h3>
                        <ul className="space-y-3">
                            {footerLinks.teaching.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-sm text-blue-200 hover:text-white hover:translate-x-1 transition-all inline-block"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* CTA Button */}
                        <Link
                            to="/register"
                            className="mt-6 inline-block w-full rounded-xl bg-yellow-500 px-4 py-2.5 text-center text-sm font-bold text-[#0A2540] shadow-lg hover:bg-yellow-400 transition-all transform hover:scale-105 active:scale-95"
                        >
                            Join for Free
                        </Link>
                    </div>
                </div>

                {/* Social Media Links */}
                <div className="mt-12 pt-8 border-t border-white/10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-blue-200 hover:bg-yellow-500 hover:text-[#0A2540] transition-all transform hover:scale-110"
                                    aria-label={social.name}
                                >
                                    <social.icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>

                        {/* Language Selector */}
                        <select className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-medium border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
                            <option value="en">🌐 English</option>
                            <option value="es">🌐 Español</option>
                            <option value="fr">🌐 Français</option>
                            <option value="de">🌐 Deutsch</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10 bg-[#0A2540]/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-blue-300">
                        <p>© {currentYear} iSooKO. All rights reserved.</p>
                        <p className="text-center md:text-right">
                            Made with <span className="text-red-500">love</span> for learners worldwide
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

