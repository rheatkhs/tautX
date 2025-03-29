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
    });

    const [copied, setCopied] = useState(false);
    const [currentExpandedUrl, setCurrentExpandedUrl] = useState(expandedUrl);
    const [error, setError] = useState('');

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
                    // ❌ Removed reset() to keep the input value
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

    return (
        <>
            <Head title="Expand Your URLs" />
            <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-black px-4 py-8 font-sans text-white sm:px-6">
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
                    className="w-full max-w-md rounded-xl bg-gray-900 p-6 text-center shadow-xl sm:max-w-lg"
                >
                    <p className="mb-4 text-sm text-gray-400 sm:text-base">Effortless Link Expansion at Your Fingertips.</p>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Input Field */}
                        <motion.input
                            type="text"
                            placeholder="Paste a short URL..."
                            value={data.url} // ✅ Input value remains
                            onChange={(e) => setData('url', e.target.value)}
                            whileFocus={{ scale: 1.02 }}
                            className="w-full rounded-md bg-gray-800 p-3 text-sm text-white transition focus:ring-2 focus:ring-orange-500 focus:outline-none sm:text-base"
                        />

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={processing}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center justify-center gap-2 rounded-md bg-orange-500 py-3 text-sm font-semibold text-white transition-all disabled:opacity-50 sm:text-base"
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
                        className="mt-6 w-full max-w-md rounded-xl bg-gray-900 p-6 text-center shadow-md sm:max-w-lg"
                    >
                        <p className="text-sm text-gray-400 sm:text-base">Your Secure Expanded URL:</p>
                        <div className="mt-2 flex flex-col items-center justify-between gap-3 sm:flex-row">
                            <span className="w-full text-center text-sm font-semibold break-all text-orange-400 sm:text-left sm:text-base">
                                {currentExpandedUrl}
                            </span>
                            <motion.button
                                onClick={handleCopy}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="rounded-md bg-gray-800 p-2 text-white"
                            >
                                <Clipboard size={20} />
                            </motion.button>
                        </div>
                        {copied && <p className="mt-2 text-sm text-green-400">Copied to clipboard! ✅</p>}
                    </motion.div>
                )}
            </div>
        </>
    );
}
