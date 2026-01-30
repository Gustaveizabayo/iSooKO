import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LandingPreloaderProps {
    onComplete: () => void;
}

const LandingPreloader = ({ onComplete }: LandingPreloaderProps) => {
    const [currentLetter, setCurrentLetter] = useState(0);
    const letters = ['i', 'S', 'o', 'o', 'K', 'O'];

    useEffect(() => {
        const letterInterval = setInterval(() => {
            setCurrentLetter((prev) => {
                if (prev < letters.length - 1) {
                    return prev + 1;
                }
                return prev;
            });
        }, 200);

        const completeTimer = setTimeout(() => {
            clearInterval(letterInterval);
            onComplete();
        }, 3000);

        return () => {
            clearInterval(letterInterval);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#0f2238] via-[#1a3a5c] to-[#0f2238]"
            >
                {/* Animated Background Particles */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute h-2 w-2 rounded-full bg-yellow-400/20"
                            initial={{
                                x: Math.random() * window.innerWidth,
                                y: Math.random() * window.innerHeight,
                            }}
                            animate={{
                                y: [null, Math.random() * window.innerHeight],
                                opacity: [0.2, 0.5, 0.2],
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                repeat: Infinity,
                                ease: 'linear',
                            }}
                        />
                    ))}
                </div>

                {/* Logo Container */}
                <div className="relative z-10 flex items-center justify-center">
                    {/* Letters Animation */}
                    <div className="flex items-center gap-1">
                        {letters.map((letter, index) => (
                            <motion.div
                                key={index}
                                initial={{ y: -100, opacity: 0, scale: 0 }}
                                animate={
                                    index <= currentLetter
                                        ? {
                                            y: [null, 0, -10, 0],
                                            opacity: 1,
                                            scale: [0, 1.2, 1],
                                        }
                                        : { y: -100, opacity: 0, scale: 0 }
                                }
                                transition={{
                                    duration: 0.5,
                                    ease: 'easeOut',
                                }}
                                className="relative"
                            >
                                {/* Letter with glow effect */}
                                <motion.span
                                    animate={
                                        index <= currentLetter
                                            ? {
                                                textShadow: [
                                                    '0 0 10px rgba(251, 191, 36, 0.5)',
                                                    '0 0 20px rgba(251, 191, 36, 0.8)',
                                                    '0 0 10px rgba(251, 191, 36, 0.5)',
                                                ],
                                            }
                                            : {}
                                    }
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                    className={`text-6xl md:text-8xl font-black ${index === 0 ? 'text-yellow-400' : 'text-white'
                                        }`}
                                >
                                    {letter}
                                </motion.span>

                                {/* Pulsing dot effect */}
                                {index <= currentLetter && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: [0, 1.5, 0] }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            ease: 'easeInOut',
                                        }}
                                        className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-yellow-400"
                                    />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Tagline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: currentLetter === letters.length - 1 ? 1 : 0, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="absolute bottom-32 text-center"
                >
                    <p className="text-xl md:text-2xl font-bold text-white/80">
                        Learning Management System
                    </p>
                    <motion.div
                        animate={{ width: ['0%', '100%'] }}
                        transition={{ delay: 1, duration: 1 }}
                        className="mt-4 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
                    />
                </motion.div>

                {/* Loading Progress */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: currentLetter === letters.length - 1 ? 1 : 0 }}
                    className="absolute bottom-16 flex flex-col items-center gap-4"
                >
                    <div className="flex gap-2">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                }}
                                className="h-3 w-3 rounded-full bg-yellow-400"
                            />
                        ))}
                    </div>
                    <p className="text-sm font-medium text-white/60">Loading your experience...</p>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LandingPreloader;
