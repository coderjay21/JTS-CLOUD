"use client";

import * as React from "react";
import { useState, useEffect, ChangeEvent, FormEvent, useRef } from "react";
import { Loader2, ArrowRight, ShieldCheck, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

// --- ULTRA-MINIMAL TYPEWRITER ---
function Typewriter({ text, speed = 40 }: { text: string; speed?: number }) {
    const [displayText, setDisplayText] = useState("");
    const [index, setIndex] = useState(0);

    useEffect(() => {
        setDisplayText("");
        setIndex(0);
    }, [text]);

    useEffect(() => {
        if (index < text.length) {
            const timeout = setTimeout(() => {
                setDisplayText((prev) => prev + text[index]);
                setIndex((prev) => prev + 1);
            }, speed);
            return () => clearTimeout(timeout);
        }
    }, [index, text, speed]);

    return (
        <span className="text-zinc-400 font-mono text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-orange-500" />
            {displayText}
            <span className="animate-pulse text-orange-500">_</span>
        </span>
    );
}

// --- APPLE-STYLE FLOATING LABEL INPUT COMPONENT ---
const FloatingInput = ({ label, icon, value, onChange, disabled, type = "text", ...props }: any) => {
    const [isFocused, setIsFocused] = useState(false);
    const isActive = isFocused || value.length > 0;
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div 
            className="relative w-full cursor-text group" 
            onClick={() => inputRef.current?.focus()}
        >
            {/* Shinny Center Glow Effect */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/0 via-orange-500/30 to-orange-500/0 blur-md opacity-0 transition-opacity duration-500 pointer-events-none ${isFocused ? 'opacity-100' : ''}`}></div>
            
            {/* Input Container */}
            <div className={`relative w-full h-[64px] bg-[#0c0c0e] rounded-2xl border transition-all duration-300 flex items-center ${isFocused ? 'border-orange-500/80 shadow-[0_0_20px_rgba(249,115,22,0.15)]' : 'border-zinc-800 group-hover:border-zinc-700'}`}>
                
                {/* Prefix Icon/Text (+91) */}
                {icon && (
                    <div className="pl-4 pr-1 flex items-center h-full z-10 pointer-events-none">
                        {icon}
                        <div className="h-6 w-[1px] bg-zinc-700 ml-3"></div>
                    </div>
                )}
                
                {/* Input Workspace */}
                <div className="relative flex-1 h-full flex flex-col justify-center px-4 overflow-hidden">
                    
                    {/* The Apple-Style Floating Label */}
                    <motion.label
                        initial={false}
                        animate={{
                            y: isActive ? -12 : 0, 
                            scale: isActive ? 0.75 : 1,
                            color: isActive ? "#f97316" : "#71717a",
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="absolute left-4 origin-top-left pointer-events-none font-medium select-none tracking-wide"
                    >
                        {label}
                    </motion.label>

                    {/* Native Input (Bulletproof Anti-Border System) */}
                    <input
                        ref={inputRef}
                        type={type}
                        inputMode={type === 'tel' || type === 'number' ? 'numeric' : undefined}
                        value={value}
                        onChange={onChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        disabled={disabled}
                        autoComplete="off"
                        /* 🚨 YE HAI BRAHMASTRA: Inline style se zabardasti browser defaults band kar diye */
                        style={{ 
                            boxShadow: 'none', 
                            outline: 'none', 
                            border: 'none',
                            background: 'transparent'
                        }}
                        /* 🚨 Tailwind ki !important classes laga di focus ko kill karne ke liye */
                        className={`w-full text-zinc-100 text-[15px] font-medium tracking-wide z-10 transition-all duration-200 border-none outline-none focus:outline-none focus:ring-0 focus:border-transparent focus:shadow-none active:outline-none ${isActive ? 'mt-5 opacity-100' : 'mt-0 opacity-0'} ${props.className || ''}`}
                        {...props}
                    />
                </div>
            </div>
        </div>
    );
};

// --- LUXURY 6-BOX OTP COMPONENT (With Auto-Focus) ---
const OTPInput = ({ otp, setOtp, onComplete, disabled, autoFocus }: any) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (autoFocus && inputRefs.current[0]) {
            setTimeout(() => inputRefs.current[0]?.focus(), 400); // Slight delay so animation finishes first
        }
    }, [autoFocus]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const val = e.target.value;
        if (/[^0-9]/.test(val)) return;

        const newOtp = [...otp];
        newOtp[index] = val.substring(val.length - 1);
        setOtp(newOtp);

        if (val && index < 5) inputRefs.current[index + 1]?.focus();

        if (val && index === 5 && newOtp.every(v => v !== "")) {
            onComplete(newOtp.join(""));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6).replace(/[^0-9]/g, '');
        if (pastedData) {
            const newOtp = [...otp];
            pastedData.split('').forEach((char, i) => { if (i < 6) newOtp[i] = char; });
            setOtp(newOtp);
            inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
            if (pastedData.length === 6) onComplete(pastedData);
        }
    };

    return (
        <div className="flex justify-between gap-2">
            {otp.map((digit: string, i: number) => (
                <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    onPaste={handlePaste}
                    disabled={disabled}
                    className="w-11 h-14 bg-zinc-950/80 border border-zinc-800 rounded-xl text-center text-xl font-mono text-orange-500 focus:outline-none focus:border-orange-500 focus:shadow-[0_0_15px_-3px_rgba(249,115,22,0.4)] transition-all cursor-text"
                />
            ))}
        </div>
    );
};

export function AuthUI() {
    // step: 1 (Phone), 2 (OTP), 3 (Success Animation)
    const [step, setStep] = useState<number>(1);
    const [formData, setFormData] = useState({ name: '', phone: '' });
    const [otpArray, setOtpArray] = useState(Array(6).fill(""));
    const [loading, setLoading] = useState<boolean>(false);
    const [status, setStatus] = useState({ type: '', msg: '' });

    const BACKEND_URL = 'http://localhost:8000/api/v1/auth';

    const handleSendOTP = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.phone.length < 10) return setStatus({ type: 'error', msg: 'Enter a valid 10-digit number.' });
        setLoading(true);
        setStatus({ type: '', msg: '' });

        try {
            const response = await axios.post(`${BACKEND_URL}/send-otp`,
                { phone: formData.phone, name: formData.name },
                { withCredentials: true }
            );
            if (response.data.success) {
                setStatus({ type: 'success', msg: 'Routing to Gateway...' });
                setTimeout(() => { setStep(2); setStatus({ type: '', msg: '' }); }, 1000);
            }
        } catch (err: any) {
            setStatus({ type: 'error', msg: err.response?.data?.message || 'Connection failed.' });
        } finally {
            setLoading(false);
        }
    };

    const handleAutoSubmitOTP = async (fullOtp: string) => {
        setLoading(true);
        setStatus({ type: '', msg: '' });

        try {
            const response = await axios.post(`${BACKEND_URL}/verify-otp`,
                { phone: formData.phone, otp: fullOtp },
                { withCredentials: true }
            );
            if (response.data.success) {
                // Trigger Success Step
                setStep(3);
                localStorage.setItem('jts_user', JSON.stringify(response.data.user));
                // TODO: Redirect to Dashboard after 1.5 seconds so user sees the green check
            }
        } catch (err: any) {
            setStatus({ type: 'error', msg: err.response?.data?.message || 'Invalid security code.' });
            setOtpArray(Array(6).fill(""));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-[#050505] flex items-center justify-center p-4 font-sans overflow-hidden selection:bg-orange-500/30">

            {/* --- DEEP BACKGROUND ART --- */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-orange-600/15 rounded-full blur-[150px] animate-[pulse_10s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-900/20 rounded-full blur-[150px] animate-[pulse_12s_ease-in-out_infinite_reverse]"></div>

            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(255,255,255,0.05) 50px), repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(255,255,255,0.05) 50px)`, backgroundSize: '50px 50px' }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]"></div>

            <div className="relative w-full max-w-[400px] z-10">
                {/* LOGO */}
                <div className="flex flex-col items-center mb-8">
                    <img src="/logo.png" alt="JTS Cloud" className="w-16 h-16 mb-4 drop-shadow-[0_0_15px_rgba(249,115,22,0.2)]" />
                    <h1 className="text-2xl font-semibold text-white tracking-tight">JTS<span className="text-zinc-500 font-light">Cloud</span></h1>
                </div>

                {/* --- 🚥 UX: PROGRESS INDICATOR --- */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <motion.div
                        animate={{ backgroundColor: step >= 2 ? '#22c55e' : '#f97316', scale: step === 1 ? 1.1 : 1 }}
                        className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold text-white shadow-[0_0_15px_-3px_rgba(249,115,22,0.5)]"
                    >
                        {step === 1 ? '1' : <Check className="w-4 h-4" strokeWidth={3} />}
                    </motion.div>

                    {/* Glowing Flowing Line */}
                    <div className="relative h-[2px] w-16 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: step >= 2 ? '100%' : '0%' }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            className="absolute top-0 left-0 h-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]"
                        />
                    </div>

                    <motion.div
                        animate={{
                            backgroundColor: step === 3 ? '#22c55e' : (step === 2 ? '#f97316' : 'transparent'),
                            borderColor: step === 3 ? '#22c55e' : (step === 2 ? '#f97316' : '#27272a'),
                            color: step >= 2 ? '#fff' : '#71717a',
                            scale: step === 2 ? 1.1 : 1
                        }}
                        className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold border transition-all duration-500 ${step === 2 ? 'shadow-[0_0_15px_-3px_rgba(249,115,22,0.5)]' : ''}`}
                    >
                        {step === 3 ? <Check className="w-4 h-4" strokeWidth={3} /> : '2'}
                    </motion.div>
                </div>

                {/* STATUS MESSAGE */}
                <AnimatePresence>
                    {status.msg && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className={`mb-6 p-3 rounded-xl flex items-center justify-center gap-2 text-[13px] tracking-wide font-medium border backdrop-blur-md ${status.type === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}
                        >
                            {status.type === 'success' && <ShieldCheck className="w-4 h-4" />}
                            {status.msg}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* --- FORMS WRAPPER --- */}
                <div className="relative bg-zinc-900/40 backdrop-blur-3xl border border-zinc-800/60 rounded-3xl p-6 shadow-2xl overflow-hidden min-h-[250px] flex items-center justify-center">

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.form
                                key="step1"
                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                                onSubmit={handleSendOTP}
                                className="space-y-4 w-full"
                            >
                                <FloatingInput
                                    label="Enter your name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                                    disabled={loading}
                                />

                                <FloatingInput
                                    icon={<span className="text-sm font-semibold text-zinc-500">+91</span>}
                                    label="Enter your mobile number"
                                    name="phone"
                                    type="numeric"
                                    required
                                    maxLength={10}
                                    value={formData.phone}
                                    onChange={(e: any) => setFormData({ ...formData, phone: e.target.value })}
                                    disabled={loading}
                                    className="font-mono tracking-wider"
                                />

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group relative cursor-pointer w-full bg-zinc-100 hover:bg-white text-black font-bold py-4 rounded-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2 mt-5 shadow-[0_0_20px_-5px_rgba(255,255,255,0.2)] active:scale-[0.98] overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        <>Get OTP <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                                    )}
                                </button>
                            </motion.form>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}
                                className="space-y-6 w-full"
                            >
                                <div className="text-center space-y-1">
                                    <h3 className="text-zinc-100 font-medium">Verify Identity</h3>
                                    <p className="text-xs text-zinc-500">
                                        We sent a SMS with your OTP to <br />
                                        <span className="text-zinc-300 font-mono tracking-wider">+91 {formData.phone}</span>
                                    </p>
                                </div>

                                <OTPInput
                                    otp={otpArray}
                                    setOtp={setOtpArray}
                                    onComplete={handleAutoSubmitOTP}
                                    disabled={loading}
                                    autoFocus={true}
                                />

                                <div className="flex justify-center mt-4">
                                    {loading ? (
                                        <span className="flex items-center gap-2 text-xs text-orange-500 animate-pulse"><Loader2 className="w-3 h-3 animate-spin" /> Verifying OTP...</span>
                                    ) : (
                                        <button type="button" onClick={() => { setStep(1); setOtpArray(Array(6).fill("")); setStatus({ type: '', msg: '' }) }} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
                                            Wrong Number? Go Back
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-4 space-y-4 w-full"
                            >
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center animate-pulse">
                                    <ShieldCheck className="w-8 h-8 text-green-500" />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-white mb-1">Access Granted</h3>
                                    <p className="text-sm text-zinc-400">Initializing JTS - Cloud Dashboard...</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}