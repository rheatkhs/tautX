import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Clipboard, RefreshCcw } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface HomeProps {
    expandedUrl?: string;
}

export default function Home({ expandedUrl = '' }: HomeProps) {
    const { data, setData, post, processing } = useForm({
        url: '',
        length: 100, // Default to 100
    });

    const [copied, setCopied] = useState(false);
    const [currentExpandedUrl, setCurrentExpandedUrl] = useState(expandedUrl);
    const [error, setError] = useState('');
    const [resetting, setResetting] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError('');

        post('/expand-url', {
            preserveScroll: true,
            onSuccess: (response) => {
                const newExpandedUrl = response.props.expandedUrl;
                if (newExpandedUrl) {
                    setCurrentExpandedUrl(newExpandedUrl);
                    setCopied(false);
                } else {
                    setError('Failed to generate expanded URL. Please try again.');
                }
            },
            onError: () => {
                setError('An error occurred while generating the URL.');
            },
        });
    };

    const handleCopy = () => {
        if (currentExpandedUrl) {
            navigator.clipboard.writeText(currentExpandedUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleReset = () => {
        setResetting(true); // Start animation
        setTimeout(() => {
            setCurrentExpandedUrl('');
            setData({ url: '', length: 100 }); // Reset input fields
            setCopied(false);
            setResetting(false); // Stop animation after reset
        }, 500);
    };

    return (
        <>
            <Head title="Expand Your URLs" />
            <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-800 to-black px-4 py-8 font-sans text-white sm:px-6">
                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6 text-center text-3xl font-bold sm:text-4xl"
                >
                    tautX—Links in a Snap
                </motion.h1>

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md rounded-2xl bg-gray-900 p-6 text-center shadow-lg sm:max-w-lg"
                >
                    <p className="mb-4 text-sm text-gray-300 sm:text-base">Effortless Link Expansion at Your Fingertips.</p>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Short URL Input */}
                        <motion.input
                            type="text"
                            placeholder="Paste a short URL..."
                            value={data.url}
                            onChange={(e) => setData('url', e.target.value)}
                            whileFocus={{ scale: 1.02 }}
                            className="w-full rounded-lg bg-gray-800 p-3 text-sm text-white transition focus:ring-2 focus:ring-orange-500 focus:outline-none sm:text-base"
                        />

                        {/* Custom Length Input */}
                        <div className="flex flex-col items-center gap-3 text-white sm:flex-row">
                            <label className="text-sm font-semibold sm:text-base">Custom Length:</label>
                            <motion.input
                                type="number"
                                min="5"
                                max="1000"
                                value={data.length}
                                onChange={(e) => setData('length', Math.min(1000, Math.max(5, Number(e.target.value))))}
                                className="w-24 rounded-lg bg-gray-800 p-3 text-center text-white transition focus:ring-2 focus:ring-orange-500 focus:outline-none sm:text-lg"
                            />
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={processing}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center justify-center gap-2 rounded-lg bg-orange-500 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-orange-600 disabled:opacity-50 sm:text-base"
                        >
                            {processing ? 'Generating...' : 'Generate'}
                            <RefreshCcw size={20} className={processing ? 'animate-spin' : ''} />
                        </motion.button>
                    </form>

                    {/* Error Message */}
                    {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                </motion.div>

                {/* Expanded URL Result */}
                {currentExpandedUrl && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mt-6 w-full max-w-md rounded-2xl bg-gray-900 p-6 text-center shadow-lg sm:max-w-lg"
                    >
                        <p className="text-sm font-semibold text-gray-300 sm:text-base">Your Secure Expanded URL:</p>

                        {/* Scrollable Textarea (Hides Scrollbar) */}
                        <textarea
                            className="mt-3 h-24 max-h-40 w-full resize-y overflow-hidden rounded-lg border-2 border-gray-700 bg-gray-800 p-3 text-sm text-white focus:ring-2 focus:ring-orange-500 focus:outline-none sm:text-base"
                            readOnly
                            value={currentExpandedUrl}
                            style={{
                                overflowY: 'auto', // Allow scrolling
                                scrollbarWidth: 'none', // Hide scrollbar for Firefox
                                msOverflowStyle: 'none', // Hide scrollbar for IE/Edge
                            }}
                            onFocus={(e) => (e.target.style.overflowY = 'scroll')} // Show on focus
                            onBlur={(e) => (e.target.style.overflowY = 'hidden')} // Hide on blur
                        />

                        {/* Copy & Reset Buttons */}
                        <div className="mt-4 flex items-center justify-center gap-3">
                            {/* Copy Button */}
                            <motion.button
                                onClick={handleCopy}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-3 text-white shadow-md transition-all hover:bg-gray-700"
                            >
                                <Clipboard size={20} />
                                {copied ? 'Copied!' : 'Copy'}
                            </motion.button>

                            {/* Reset Button */}
                            <motion.button
                                onClick={handleReset}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-3 text-white shadow-md transition-all hover:bg-orange-600"
                            >
                                <RefreshCcw size={20} className={resetting ? 'animate-spin' : ''} />
                                {resetting ? 'Resetting...' : 'Reset'}
                            </motion.button>
                        </div>
                    </motion.div>
                )}
                {/* Footer */}
                <motion.footer
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-12 text-center text-sm text-gray-400 sm:text-base"
                >
                    Made with <span className="text-orange-500">🔥</span> by{' '}
                    <motion.a
                        href="https://github.com/rheatkhs"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, color: '#ffffff' }}
                        transition={{ duration: 0.2 }}
                        className="font-semibold text-gray-300 hover:text-white"
                    >
                        Rhea Takahashi
                    </motion.a>
                </motion.footer>
            </div>
        </>
    );
}
