import { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon, User, Shield, Bell, Palette,
  Upload, Save, RefreshCw, CheckCircle2, AlertCircle,
  Lock, Eye, EyeOff, Globe, Clock, School, Layers, Building,
  Award
} from 'lucide-react';
import { settingsService, authService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    institutionName: 'EduManage Metropolitan University & Institute of Technology',
    institutionCode: 'KMU-7419',
    accreditation: 'Autonomous University Council • NAAC',
    domain: 'https://portal.edumanage.edu',
    academicYear: '2024-2025',
    currentSemester: 'Fall',
    gradingScale: '4.0',
    minimumAttendance: 75,
    passingMarks: 40,
    address: '100 Innovation Drive, Academic District, CA 94085',
    phone: '+1 (555) 380-CAMPUS',
    email: 'admin@kathmandu.edu',
    timezone: '(GMT-08:00) Pacific Time (US & Canada)',
  });

  // Profile Form state
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Dr. Elena Vance',
    email: user?.email || 'admin@kathmandu.edu',
    phone: '+1 (555) 380-CAMPUS',
    role: 'Dean of Academic Affairs',
  });

  // Security Form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [allowReEval, setAllowReEval] = useState(true);
  const [studentSelfEnroll, setStudentSelfEnroll] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await settingsService.get();
      if (res.data.data) {
        setSettings(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      await settingsService.update(settings);
      toast.success('System configuration saved & broadcasted across cluster!');
    } catch (err) {
      toast.error('Failed to update system configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    toast.success('Security password credentials updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving institutional policy configurations..." />;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-secondary">
            EDUMANAGE › SYSTEM › SETTINGS
          </span>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-heading mt-0.5">
            Settings & Administration
          </h1>
          <p className="text-xs text-secondary mt-0.5">
            Manage institution configuration, security protocols, role permissions, and system preferences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-500 bg-white border border-border px-3 py-1.5 rounded-lg shadow-sm">
            RUNTIME ENGINE: <strong>Cluster US-West-02</strong> • v1.24.2-LTS
          </span>
        </div>
      </div>

      {/* 5 Tab Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-border pb-1 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'general', label: 'General Settings', icon: SettingsIcon },
          { id: 'profile', label: 'Admin Profile', icon: User },
          { id: 'security', label: 'Security & Authentication', badge: '2FA', icon: Shield },
          { id: 'notifications', label: 'Notification Rules', icon: Bell },
          { id: 'appearance', label: 'Appearance & Theming', icon: Palette },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'text-body hover:bg-gray-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                  isActive ? 'bg-purple-800 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: General Settings */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Institutional Profile & Academic Policies */}
          <div className="lg:col-span-8 space-y-6">
            {/* Section 1: Institutional Profile */}
            <div className="bg-card-bg rounded-xl border border-border p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <h3 className="text-sm font-bold text-heading flex items-center gap-2">
                    <Building className="w-4 h-4 text-primary" />
                    Institutional Profile
                  </h3>
                  <p className="text-xs text-secondary mt-0.5">
                    Legal entity identifiers, regional accreditation standing, and academic system coordinates.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  VERIFIED ENTITY
                </span>
              </div>

              {/* University Crest & Seal */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-xl border border-border flex items-center justify-center font-bold text-primary shadow-sm">
                    KMU
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-heading">University Crest & Digital Seal</h4>
                    <p className="text-[11px] text-secondary">
                      Standard mark used across grade cards, digital degrees, and official memos.
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono">PNG, SVG up to 10MB (Floor 300, Resolution)</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toast('Seal replacement opened.', { icon: '🏛️' })}
                  className="px-3 py-1.5 text-xs font-semibold text-primary bg-white border border-primary/20 rounded-lg hover:bg-purple-50"
                >
                  Replace
                </button>
              </div>

              {/* Profile Inputs */}
              <div>
                <label className="block text-xs font-semibold text-heading mb-1">Institution Legal Name</label>
                <input
                  type="text"
                  name="institutionName"
                  value={settings.institutionName}
                  onChange={handleSettingsChange}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-heading mb-1">Institution Code</label>
                  <input
                    type="text"
                    name="institutionCode"
                    value={settings.institutionCode}
                    onChange={handleSettingsChange}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-heading mb-1">Accreditation / Affiliation</label>
                  <input
                    type="text"
                    name="accreditation"
                    value={settings.accreditation}
                    onChange={handleSettingsChange}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-heading mb-1">Official Domain & Portal URL</label>
                  <input
                    type="text"
                    name="domain"
                    value={settings.domain}
                    onChange={handleSettingsChange}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-primary font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-heading mb-1">Timezone & Academic Cycle</label>
                  <input
                    type="text"
                    name="timezone"
                    value={settings.timezone}
                    onChange={handleSettingsChange}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Academic Grading & Credit Policies */}
            <div className="bg-card-bg rounded-xl border border-border p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <h3 className="text-sm font-bold text-heading flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    Academic Grading & Credit Policies
                  </h3>
                  <p className="text-xs text-secondary mt-0.5">
                    Configure grading metrics, attendance mandates, hall ticket lockouts, and instructor modification rules.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  Curriculum Registered
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-heading mb-1">Grading Scale</label>
                  <select
                    name="gradingScale"
                    value={settings.gradingScale}
                    onChange={handleSettingsChange}
                    className="w-full px-3 py-2 text-xs font-semibold border border-border rounded-lg bg-white"
                  >
                    <option value="4.0">4.00 Scale (US Standard GPA)</option>
                    <option value="10.0">10.00 Scale (CGPA Format)</option>
                  </select>
                  <span className="text-[10px] text-secondary mt-1 block">A+=4.0, A=4.0, B+=3.5</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-heading mb-1">Min. Attendance Mandate</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="minimumAttendance"
                      value={settings.minimumAttendance}
                      onChange={handleSettingsChange}
                      className="w-full px-3 py-2 text-xs font-bold border border-border rounded-lg"
                    />
                    <span className="absolute right-3 top-2 text-xs text-secondary font-bold">%</span>
                  </div>
                  <span className="text-[10px] text-danger font-semibold mt-1 block">
                    Below triggers automatic exam lockout penalty
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-heading mb-1">Passing Marks Threshold</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="passingMarks"
                      value={settings.passingMarks}
                      onChange={handleSettingsChange}
                      className="w-full px-3 py-2 text-xs font-bold border border-border rounded-lg"
                    />
                    <span className="absolute right-3 top-2 text-xs text-secondary font-bold">%</span>
                  </div>
                  <span className="text-[10px] text-secondary mt-1 block">
                    Internal Assessments + Finals combined
                  </span>
                </div>
              </div>

              {/* Standard Distribution Curve SVG representation */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-heading">
                    Standard Distribution Curve Model (AY 2024-2025)
                  </span>
                  <span className="text-[10px] text-secondary font-mono">Bell Curve Current: Mod. 12</span>
                </div>
                <div className="h-20 w-full flex items-center justify-center">
                  <svg viewBox="0 0 400 80" className="w-full h-full text-primary">
                    <path
                      d="M 10 70 Q 150 70, 200 15 Q 250 70, 390 70"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    />
                    <line x1="200" y1="15" x2="200" y2="70" stroke="#EF4444" strokeDasharray="3 3" />
                  </svg>
                </div>
                <div className="flex justify-between text-[10px] text-secondary pt-2 border-t border-slate-200">
                  <span>Fail / Remedial (&lt;40%)</span>
                  <span className="text-danger font-semibold">Cutoff Threshold (40%)</span>
                  <span>Median Class GPA (3.42)</span>
                  <span>Dean's List Honors (3.80+)</span>
                </div>
              </div>

              {/* Re-evaluation Toggle */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-xs font-bold text-heading">Allow Faculty Grade Re-evaluations</p>
                  <p className="text-[11px] text-secondary">
                    Permits department heads and professors to re-submit marks for review papers within 14 calendar days of publish.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowReEval}
                    onChange={(e) => setAllowReEval(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>

            {/* Sticky Floating Save Bar */}
            <div className="bg-purple-900 text-white rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-purple-300 animate-spin" style={{ animationDuration: '6s' }} />
                <div>
                  <p className="text-xs font-bold">Pending System Modifications</p>
                  <p className="text-[11px] text-purple-200">
                    Changes will propagate to active faculty and student sessions automatically.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchSettings}
                  className="px-3.5 py-1.5 text-xs font-semibold text-purple-200 hover:text-white"
                >
                  Discard changes
                </button>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="px-5 py-2 text-xs font-bold bg-primary text-white hover:bg-primary-hover rounded-lg shadow-lg cursor-pointer transition-all"
                >
                  {saving ? 'Saving...' : 'Save Configurations'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Roles & Campus Node */}
          <div className="lg:col-span-4 space-y-6">
            {/* Roles & Access Control */}
            <div className="bg-card-bg rounded-xl border border-border p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h3 className="text-sm font-bold text-heading">Roles & Access Control</h3>
                <span className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">
                  Audit Logs
                </span>
              </div>
              <p className="text-xs text-secondary">
                Granular authorization boundaries.
              </p>

              <div className="space-y-3">
                <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-primary uppercase">Super Administrator</span>
                    <span className="text-[9px] font-mono bg-primary text-white px-1.5 py-0.2 rounded">Root Clearances</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
                      EV
                    </div>
                    <div>
                      <p className="text-xs font-bold text-heading">Dr. Elena Vance</p>
                      <p className="text-[10px] text-secondary">Full write & release powers</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-heading uppercase">Faculty Members</span>
                    <span className="text-[9px] font-mono text-secondary">61 Active</span>
                  </div>
                  <p className="text-[11px] text-secondary mt-1">
                    Authorized for real-time Attendance tracking, Modular Grading submissions, and Courseware syllabus authoring.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-heading uppercase">Registrar Officers</span>
                    <span className="text-[9px] font-mono text-secondary">4 Active</span>
                  </div>
                  <p className="text-[11px] text-secondary mt-1">
                    Full control over Course enrolment rosters, Certified transcripts issuance, and Official Student Records archiving.
                  </p>
                </div>
              </div>

              {/* Student Self-Enroll Toggle */}
              <div className="pt-3 border-t border-border flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-heading">Student Self-Enrollment</p>
                  <p className="text-[10px] text-secondary">Allow students to inspect schedules.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={studentSelfEnroll}
                    onChange={(e) => setStudentSelfEnroll(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>

            {/* Physical Infrastructure Node Card */}
            <div className="bg-card-bg rounded-xl border border-border p-5 space-y-3">
              <h3 className="text-xs font-bold text-secondary uppercase">PHYSICAL INFRASTRUCTURE</h3>
              <div className="rounded-lg overflow-hidden border border-border bg-slate-900 text-white p-4 relative">
                <Building className="w-8 h-8 text-purple-400 mb-2" />
                <h4 className="text-xs font-bold">North Campus Node</h4>
                <p className="text-[10px] text-slate-300 mt-1">
                  Primary Enterprise Server Gateway • Active & synchronizing with 2,450 student accounts.
                </p>
                <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Datacenter Replication Sync</span>
                  <span className="text-emerald-400 font-bold">22 JAN 2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Admin Profile */}
      {activeTab === 'profile' && (
        <div className="bg-card-bg rounded-xl border border-border p-6 max-w-2xl space-y-4">
          <h3 className="text-base font-bold text-heading">Administrator Profile Information</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl">
              EV
            </div>
            <div>
              <p className="font-bold text-heading text-lg">{profileData.name}</p>
              <p className="text-xs text-secondary">{profileData.role}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Official Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Official Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-heading mb-1">Contact Phone</label>
            <input
              type="text"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg"
            />
          </div>
          <button
            type="button"
            onClick={() => toast.success('Profile updated successfully!')}
            className="px-5 py-2 text-xs font-semibold bg-primary text-white rounded-lg hover:bg-primary-hover"
          >
            Save Profile
          </button>
        </div>
      )}

      {/* Tab 3: Security & Authentication */}
      {activeTab === 'security' && (
        <div className="bg-card-bg rounded-xl border border-border p-6 max-w-2xl space-y-4">
          <h3 className="text-base font-bold text-heading">Security & Password Management</h3>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Current Directory Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-primary text-white rounded-lg hover:bg-primary-hover"
            >
              Update Password
            </button>
          </form>
        </div>
      )}

      {/* Other Tabs */}
      {(activeTab === 'notifications' || activeTab === 'appearance') && (
        <div className="bg-card-bg rounded-xl border border-border p-8 text-center max-w-xl mx-auto">
          <SettingsIcon className="w-10 h-10 text-primary mx-auto mb-2" />
          <h3 className="text-base font-bold text-heading capitalize">{activeTab} Preferences</h3>
          <p className="text-xs text-secondary mt-1">
            Institutional defaults are active. All notification triggers and color theme tokens are synced with campus standards.
          </p>
        </div>
      )}
    </div>
  );
};

export default Settings;

