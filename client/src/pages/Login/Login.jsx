import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, ShieldCheck, Database, Award, Lock,
  Eye, EyeOff, CheckCircle2, Star, Calendar, ExternalLink, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [activeTab, setActiveTab] = useState('staff');
  const [email, setEmail] = useState('admin@kathmandu.edu');
  const [password, setPassword] = useState('adminpassword123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Successfully authenticated. Welcome back!');
      navigate('/');
    } catch (err) {
      let msg = err.response?.data?.message;
      if (!msg) {
        if (!err.response) {
          msg = 'Unable to reach backend server. Please verify your backend server is running and reachable.';
        } else {
          msg = 'Authentication failed. Please verify credentials.';
        }
      }
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col justify-between p-4 md:p-8 text-white relative">
      {/* Top Banner Header */}
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between pb-6 border-b border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="font-medium text-slate-300">System Status: All Core Services Operational</span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="hidden sm:inline">v4.18.2-prod</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            FERPA & SOC-2 TYPE II CERTIFIED
          </span>
          <a href="#help" className="hover:text-white transition-colors flex items-center gap-1">
            Campus IT Helpline <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Two-Column Box */}
      <div className="max-w-7xl w-full mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch py-8">
        {/* Left Column: Branding & Features */}
        <div className="lg:col-span-7 bg-gradient-to-br from-[#0F172A] via-[#1E3A5F] to-[#0F172A] rounded-2xl p-8 lg:p-12 border border-slate-800 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            {/* Header Badge */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg tracking-tight text-white">EduManage SMS</span>
                  <span className="text-[10px] font-semibold bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded border border-teal-500/30 uppercase tracking-wider">
                    Enterprise
                  </span>
                </div>
                <p className="text-xs text-slate-400">STUDENT ADMINISTRATION & ACADEMIC GOVERNANCE</p>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight mb-4">
              Empowering institutional excellence through unified intelligence.
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed mb-8 max-w-xl">
              Consolidated lifecycle governance for registrars, academic deans, and financial controllers across multi-campus university networks.
            </p>

            {/* Feature Highlights */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3.5 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
                <div className="p-2 bg-teal-950/80 rounded-lg text-teal-300 border border-teal-800/40">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Real-Time Student Roster & 360° Academic Records</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Audit degree paths, clinical rotations, transcripts, and demographic profiles with zero data latency.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
                <div className="p-2 bg-indigo-950/80 rounded-lg text-indigo-400 border border-indigo-800/40">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Automated Grading Engine & Board Tabulation</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Algorithmic curve modeling, weighted GPA computations, and tamper-evident grade locking.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
                <div className="p-2 bg-emerald-950/80 rounded-lg text-emerald-400 border border-emerald-800/40">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Role-Tiered Access & Compliance Enclaves</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Granular faculty permissions with cryptographic audit trails satisfying NAAC/ISO guidelines.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1 text-amber-400 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
              <span className="text-[10px] text-slate-400 font-mono ml-2">AUDIT ID: 5524-KMUT</span>
            </div>
            <p className="text-xs text-slate-300 italic mb-3">
              "EduManage reduced our end-of-term transcript reconciliation window by 82% across all 9 collegiate faculties. The automated degree audit is flawless."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white">
                JC
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Dr. Julian Caldwell, Ph.D.</p>
                <p className="text-[10px] text-slate-400">Dean of Academic Registrations • Metropolitan State University</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sign In Card */}
        <div className="lg:col-span-5 bg-white text-slate-900 rounded-2xl p-8 lg:p-10 shadow-2xl flex flex-col justify-between border border-slate-100">
          <div>
            {/* Designated Gateway Header */}
            <div className="bg-teal-50 text-primary border border-teal-200/60 rounded-lg px-3 py-2 text-xs font-medium flex items-center justify-between mb-6">
              <span>DESIGNATED GATEWAY: EduManage Metropolitan University</span>
              <span className="text-[10px] bg-primary text-white px-1.5 py-0.5 rounded">KMU-7419</span>
            </div>

            <h2 className="text-2xl font-bold text-heading">Welcome Back</h2>
            <p className="text-xs text-secondary mt-1 mb-6">
              Enter your verified institutional credentials to access your administrative workspace.
            </p>

            {/* Login Tabs */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('staff')}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'staff'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Staff / Faculty / Admin
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('student')}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'student'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Student / Guardian
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Institutional Email / Staff ID <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Format: @kathmandu.edu</span>
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@kathmandu.edu"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 placeholder:text-slate-400 transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Directory Password <span className="text-red-500">*</span>
                  </label>
                  <a href="#forgot" className="text-xs text-primary hover:underline font-medium">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter administrative password"
                    className="w-full pl-3.5 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 placeholder:text-slate-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="text-xs text-slate-600">Remember device for 30 days</span>
                </label>
                <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  PROD | SP8 protected
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg shadow-lg shadow-teal-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Authenticating...' : 'Sign in to Academic Workspace →'}
              </button>
            </form>

            {/* Single-Sign-On Section */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <p className="text-[11px] text-center text-slate-400 uppercase tracking-wider mb-3">
                OR AUTHENTICATE VIA INSTITUTIONAL FEDERATION
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => toast('Institutional Google SSO is pre-configured for production.', { icon: 'ℹ️' })}
                  className="flex items-center justify-center gap-2 py-2 px-3 border border-slate-200 rounded-lg hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
                >
                  <span className="font-bold text-red-500">G</span> Google Workspace
                </button>
                <button
                  type="button"
                  onClick={() => toast('Microsoft Azure AD SSO is pre-configured for production.', { icon: 'ℹ️' })}
                  className="flex items-center justify-center gap-2 py-2 px-3 border border-slate-200 rounded-lg hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
                >
                  <span className="font-bold text-blue-500">⊞</span> Microsoft Azure AD
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Need assistance? Contact your department registrar or{' '}
              <a href="#faq" className="text-primary hover:underline font-medium">
                View Access FAQs
              </a>
            </p>
            <p className="text-[10px] text-slate-400 mt-2">
              Protected by 256-bit AES cipher & TLS 1.3 Encryption • NAAC Compliant
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Alert Banner */}
      <div className="max-w-7xl w-full mx-auto bg-slate-900/80 border border-teal-500/30 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-teal-100 shadow-lg mt-4">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-4 h-4 text-teal-400 flex-shrink-0" />
          <span>
            <strong>Fall Semester Grading Window Closes Oct 31, 23:59 EST.</strong> Deans and department heads are requested to complete grade rosters prior to the automated registrar freeze.
          </span>
        </div>
        <button
          onClick={() => toast('Academic Calendar is integrated in Dashboard & Help Center.', { icon: '📅' })}
          className="whitespace-nowrap px-3 py-1 bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 border border-teal-400/30 rounded-lg text-xs font-medium transition-colors"
        >
          Academic Calendar
        </button>
      </div>

      {/* Footer Copyright */}
      <div className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between pt-6 text-[11px] text-slate-500 gap-2">
        <span>© 2024-2025 EduManage Systems Inc. Precision Institutional Architecture.</span>
        <div className="flex items-center gap-4">
          <a href="#privacy" className="hover:text-slate-400">Privacy Policy</a>
          <a href="#terms" className="hover:text-slate-400">Terms of Service</a>
          <a href="#compliance" className="hover:text-slate-400">Institutional Compliance</a>
          <a href="#support" className="hover:text-slate-400">Support</a>
        </div>
      </div>
    </div>
  );
};

export default Login;

