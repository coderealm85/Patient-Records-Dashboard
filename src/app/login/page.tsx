"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, UserPlus, LogIn, ShieldCheck, Activity, ChevronRight, Zap, KeyRound } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("Male");
  const [dateOfBirth, setDateOfBirth] = useState("");
  
  // OTP State
  const [otpRequested, setOtpRequested] = useState(false);
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError("Invalid email or password. Please try again.");
        } else {
          setSuccess("Authentication successful. Redirecting...");
          setTimeout(() => {
            router.push("/");
            router.refresh();
          }, 800);
        }
      } else {
        if (!otpRequested) {
          // Request OTP
          const res = await fetch("/api/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
          const data = await res.json();
          if (res.ok) {
            setOtpRequested(true);
            setSuccess("Verification code sent to your email!");
          } else {
            setError(data.error || "Failed to send verification code.");
          }
        } else {
          // Register with OTP
          const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, firstName, lastName, gender, dateOfBirth, otp }),
          });

          const data = await res.json();
          if (res.ok) {
            setSuccess("Account verified and created! Please log in.");
            setTimeout(() => {
              setIsLogin(true);
              setOtpRequested(false);
              setOtp("");
              setSuccess("");
              setPassword("");
            }, 1500);
          } else {
            setError(data.error || "Failed to verify account.");
          }
        }
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#031119] relative font-sans selection:bg-[#01F0D0] selection:text-[#072635] p-4 sm:p-8">
      <div className="fixed top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#01F0D0]/10 via-[#01F0D0]/5 to-transparent rounded-full pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-blue-500/5 to-transparent rounded-full pointer-events-none" />

      <motion.div 
        layout
        className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-3xl sm:rounded-[2.5rem] shadow-2xl shadow-[#01F0D0]/5 overflow-hidden relative z-10 bg-white/5 backdrop-blur-xl border border-white/10"
      >
        
        {/* Left Side: Visual / Brand */}
        <div className="hidden md:flex flex-col justify-between p-10 lg:p-14 relative overflow-hidden bg-gradient-to-br from-[#072635] to-[#04151e]">
          <div className="absolute top-20 right-10 w-32 h-32 bg-[#01F0D0] rounded-full mix-blend-overlay filter blur-[50px] opacity-40" />
          <div className="absolute bottom-20 left-10 w-48 h-48 bg-blue-500 rounded-full mix-blend-overlay filter blur-[60px] opacity-30" />

          <div className="relative z-10">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <Image src="/TestLogo.png" alt="Coalition Technologies" width={180} height={36} className="mb-16 w-auto h-auto max-h-12" priority />
            </motion.div>
            
            <div className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                <h2 className="text-4xl lg:text-5xl font-black leading-[1.1] text-white">
                  Intelligent <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#01F0D0] to-blue-400">
                    Healthcare
                  </span> <br/>
                  Dashboard.
                </h2>
              </motion.div>
              <motion.p 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base lg:text-lg text-gray-300 max-w-md font-medium leading-relaxed"
              >
                Experience the next generation of medical data management. Seamless, secure, and blazingly fast.
              </motion.p>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="relative z-10 grid grid-cols-2 gap-3 mt-10"
          >
            <div className="flex items-center space-x-3 bg-white/5 p-4 rounded-2xl backdrop-blur-md border border-white/5">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-[#01F0D0]/20 to-transparent flex items-center justify-center text-[#01F0D0]">
                <ShieldCheck size={20} />
              </div>
              <div>
                <span className="block text-sm font-bold text-white">Bank-grade</span>
                <span className="block text-xs text-gray-400">Security</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-white/5 p-4 rounded-2xl backdrop-blur-md border border-white/5">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-[#01F0D0]/20 to-transparent flex items-center justify-center text-[#01F0D0]">
                <Zap size={20} />
              </div>
              <div>
                <span className="block text-sm font-bold text-white">Real-time</span>
                <span className="block text-xs text-gray-400">Updates</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Form */}
        <div className="p-6 sm:p-10 lg:p-14 flex flex-col justify-center bg-white relative">
          <div className="absolute top-0 right-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#01F0D0] to-transparent opacity-50" />
          
          <div className="mb-8">
            <div className="md:hidden flex justify-center mb-6 bg-[#072635] p-4 rounded-2xl">
              <Image src="/TestLogo.png" alt="Logo" width={140} height={28} className="w-auto h-auto max-h-8" priority />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#072635] mb-2 tracking-tight">
              {isLogin ? "Welcome Back" : (otpRequested ? "Verify Email" : "Create Account")}
            </h1>
            <p className="text-sm sm:text-base text-gray-500 font-medium">
              {isLogin ? "Securely login to your portal" : (otpRequested ? "Enter the 6-digit code sent to your email" : "Join our network of professionals")}
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex p-1 bg-gray-100/80 rounded-xl mb-6 relative">
            <motion.div
              className="absolute inset-y-1 bg-white rounded-lg shadow-sm border border-gray-200/50"
              initial={false}
              animate={{
                left: isLogin ? "0.25rem" : "50%",
                width: "calc(50% - 0.25rem)"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
            <button
              onClick={() => { setError(""); setSuccess(""); setIsLogin(true); setOtpRequested(false); }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-colors relative z-10 flex items-center justify-center space-x-2 ${
                isLogin ? "text-[#072635]" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <LogIn size={16} />
              <span>Login</span>
            </button>
            <button
              onClick={() => { setError(""); setSuccess(""); setIsLogin(false); }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-colors relative z-10 flex items-center justify-center space-x-2 ${
                !isLogin ? "text-[#072635]" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <UserPlus size={16} />
              <span>Signup</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : (otpRequested ? "otp" : "signup")}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <form onSubmit={handleAuth} className="space-y-4 sm:space-y-5">
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      className="p-3.5 bg-red-50 text-red-600 border border-red-100 text-sm font-bold rounded-xl flex items-center space-x-2"
                    >
                      <Activity size={16} className="shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                  {success && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      className="p-3.5 bg-[#01F0D0]/10 text-[#072635] border border-[#01F0D0]/30 text-sm font-bold rounded-xl flex items-center space-x-2"
                    >
                      <ShieldCheck size={16} className="shrink-0 text-[#01F0D0]" />
                      <span>{success}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {(!isLogin && !otpRequested) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">First Name</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#01F0D0]/50 focus:border-[#01F0D0] outline-none transition-all font-semibold text-[#072635] text-sm"
                        placeholder="John"
                        required={!isLogin && !otpRequested}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Last Name</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#01F0D0]/50 focus:border-[#01F0D0] outline-none transition-all font-semibold text-[#072635] text-sm"
                        placeholder="Doe"
                        required={!isLogin && !otpRequested}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Gender</label>
                      <div className="relative">
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#01F0D0]/50 focus:border-[#01F0D0] outline-none transition-all font-semibold text-[#072635] text-sm appearance-none"
                          required={!isLogin && !otpRequested}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" size={14} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Date of Birth</label>
                      <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#01F0D0]/50 focus:border-[#01F0D0] outline-none transition-all font-semibold text-[#072635] text-sm"
                        required={!isLogin && !otpRequested}
                      />
                    </div>
                  </div>
                )}

                {(!isLogin && otpRequested) ? (
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Verification Code</label>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-md flex items-center justify-center shadow-sm border border-gray-100 group-focus-within:border-[#01F0D0]/50 transition-colors">
                        <KeyRound className="text-gray-400 group-focus-within:text-[#01F0D0] transition-colors" size={14} />
                      </div>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#01F0D0]/50 focus:border-[#01F0D0] outline-none transition-all font-bold text-[#072635] tracking-[0.5em]"
                        placeholder="123456"
                        required={!isLogin && otpRequested}
                        maxLength={6}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Email Address</label>
                      <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-md flex items-center justify-center shadow-sm border border-gray-100 group-focus-within:border-[#01F0D0]/50 transition-colors">
                          <Mail className="text-gray-400 group-focus-within:text-[#01F0D0] transition-colors" size={14} />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#01F0D0]/50 focus:border-[#01F0D0] outline-none transition-all font-semibold text-[#072635] text-sm placeholder:text-gray-400"
                          placeholder="name@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center pl-1 pr-1">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Password</label>
                        {isLogin && <button type="button" className="text-[10px] font-bold text-[#01F0D0] hover:text-[#072635] transition-colors">Forgot?</button>}
                      </div>
                      <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-md flex items-center justify-center shadow-sm border border-gray-100 group-focus-within:border-[#01F0D0]/50 transition-colors">
                          <Lock className="text-gray-400 group-focus-within:text-[#01F0D0] transition-colors" size={14} />
                        </div>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#01F0D0]/50 focus:border-[#01F0D0] outline-none transition-all font-semibold text-[#072635] text-sm placeholder:text-gray-400 tracking-widest"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 mt-2 bg-[#072635] hover:bg-[#0a354a] active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-[#072635]/10 transition-all flex items-center justify-center space-x-2 disabled:opacity-70 group"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="text-sm">
                        {isLogin ? "Access Dashboard" : (otpRequested ? "Verify & Create Account" : "Get Verification Code")}
                      </span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                {(!isLogin && otpRequested) && (
                  <button
                    type="button"
                    onClick={() => { setOtpRequested(false); setSuccess(""); setError(""); }}
                    className="w-full text-[11px] font-bold text-gray-500 hover:text-[#072635] mt-2 transition-colors text-center"
                  >
                    Change Email or Edit Details
                  </button>
                )}
              </form>

              <div className="relative my-6 flex items-center justify-center">
                <div className="absolute w-full border-t border-gray-200"></div>
                <span className="relative bg-white px-3 text-[9px] font-black uppercase tracking-wider text-gray-400">
                  Or continue with
                </span>
              </div>

              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="w-full py-3.5 bg-white border border-gray-200 text-[#072635] font-bold text-sm rounded-xl hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9194 17.5885 17.2025 16.344 18.0182V21.0182H20.1803C22.433 18.9273 23.766 15.8921 23.766 12.2764Z" fill="#4285F4"/>
                  <path d="M12.24 24.0008C15.4765 24.0008 18.2059 22.9382 20.1845 21.0182L16.3482 18.0182C15.2817 18.7444 13.8841 19.1398 12.2442 19.1398C9.11746 19.1398 6.47194 17.0316 5.51897 14.1953H1.54541V17.2718C3.51897 21.2182 7.58434 24.0008 12.24 24.0008Z" fill="#34A853"/>
                  <path d="M5.51474 14.1953C5.00002 12.6591 5.00002 10.9816 5.51474 9.44534V6.36884H1.54541C-0.158371 9.82711 -0.158371 13.8136 1.54541 17.2718L5.51474 14.1953Z" fill="#FBBC04"/>
                  <path d="M12.24 4.85966C13.9514 4.83238 15.602 5.48238 16.8327 6.67151L20.2604 3.24382C18.0874 1.19655 15.2158 -0.0145805 12.24 -5.53428e-05C7.58434 -5.53428e-05 3.51897 2.78267 1.54541 6.72911L5.51897 9.80561C6.46771 6.96925 9.11322 4.85966 12.24 4.85966Z" fill="#EA4335"/>
                </svg>
                <span>Continue with Google</span>
              </button>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 text-center">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
              © 2024 Coalition Technologies Healthcare
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
