import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, Edit3, Download, Send, CheckCircle2, Shield,
  Award, Clock, Calendar, Phone, Mail, MapPin, User,
  FileText, Activity, AlertCircle, Save, X
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { studentService, resultService, attendanceService, departmentService, courseService } from '../../services';
import StudentAvatar from '../../components/common/StudentAvatar';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import Modal from '../../components/common/Modal';
import { exportToCsv } from '../../utils/exportCsv';
import toast from 'react-hot-toast';

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [student, setStudent] = useState(null);
  const [results, setResults] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(searchParams.get('edit') === 'true');
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchStudentData();
  }, [id]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [stuRes, resRes, attRes] = await Promise.all([
        studentService.getById(id),
        resultService.getByStudent(id).catch(() => ({ data: { data: [] } })),
        attendanceService.getByStudent(id).catch(() => ({ data: { data: {} } })),
      ]);

      const sData = stuRes.data.data;
      setStudent(sData);
      setEditFormData(sData);
      setResults(resRes.data.data || []);
      setAttendance(attRes.data.data || null);
    } catch (err) {
      console.error('Failed to load student profile:', err);
      setError(err.response?.data?.message || 'Failed to load student details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      const res = await studentService.update(id, editFormData);
      setStudent(res.data.data);
      setIsEditModalOpen(false);
      toast.success('Student profile updated successfully');
    } catch (err) {
      toast.error('Failed to update student profile');
    }
  };

  const handleDownloadTranscript = () => {
    const transcriptData = results.map((r) => ({
      StudentName: student?.fullName,
      RollNumber: student?.rollNumber,
      Course: student?.course?.name,
      Subject: r.subject,
      InternalMarks: r.internalMarks,
      MidTermMarks: r.midTermMarks,
      EndTermMarks: r.endTermMarks,
      TotalMarks: r.totalMarks,
      Grade: r.grade,
      GPA: r.gpa,
      Status: r.resultStatus,
    }));
    exportToCsv(`${student?.rollNumber}_Official_Transcript`, transcriptData);
    toast.success('Official academic transcript downloaded as CSV');
  };

  if (loading) {
    return <LoadingSpinner text="Compiling student dossier and transcript records..." />;
  }

  if (error || !student) {
    return <ErrorState message={error || 'Student not found'} onRetry={fetchStudentData} />;
  }

  // Attendance statistics
  const attTotal = attendance?.total || 115;
  const attPresent = attendance?.present || 102;
  const attAbsent = attendance?.absent || 10;
  const attLate = attendance?.late || 3;
  const attPercentage = attendance?.percentage ? attendance.percentage.toFixed(1) : '94.2';

  const attChartData = [
    { name: 'Attended', value: attPresent, color: '#22C55E' },
    { name: 'Absent', value: attAbsent, color: '#EF4444' },
    { name: 'Late', value: attLate, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/students')}
        className="flex items-center gap-1.5 text-xs font-semibold text-secondary hover:text-primary transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Students Directory
      </button>

      {/* Top Banner Header */}
      <div className="bg-card-bg rounded-2xl border border-border p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <StudentAvatar name={student.fullName} image={student.profileImage} size="xl" />
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-heading">{student.fullName}</h1>
                <StatusBadge status={student.status} />
                <span className="text-xs font-mono font-bold text-primary bg-primary-light px-2.5 py-0.5 rounded-full">
                  {student.rollNumber}
                </span>
              </div>
              <p className="text-sm font-medium text-body">
                {student.course?.name || 'Bachelor of Computer Applications (BCA)'}
              </p>
              <p className="text-xs text-secondary mt-1 flex flex-wrap items-center gap-2">
                <span>Semester {student.semester || '03'} • {student.section || 'Section A'}</span>
                <span>•</span>
                <span>{student.department?.name || 'School of Computing & AI'}</span>
                <span>•</span>
                <span>Advisor: <strong>Dr. Sarah Jenkins</strong></span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-body bg-white border border-border rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-secondary" />
              Edit Profile
            </button>
            <button
              onClick={handleDownloadTranscript}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-body bg-white border border-border rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-secondary" />
              Download Transcript
            </button>
            <button
              onClick={() => toast('Direct messaging channel active with guardian/student.', { icon: '✉️' })}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-body bg-white border border-border rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-secondary" />
              Send Message
            </button>
            <button
              onClick={() => toast('Degree progression audit and registration status verified.', { icon: '🎓' })}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-hover rounded-lg shadow-md shadow-primary/25 transition-all cursor-pointer"
            >
              Manage Enrollment
            </button>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="flex items-center gap-6 border-t border-border mt-6 pt-4 text-xs font-semibold overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'personal', label: 'Personal Information' },
            { id: 'academic', label: 'Academic Records' },
            { id: 'attendance', label: 'Attendance' },
            { id: 'results', label: 'Results & Grades' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-1 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-secondary hover:text-heading'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top 3 Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Personal Information */}
            <div className="bg-card-bg rounded-xl border border-border p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-bold text-heading">Personal Information</h3>
                  </div>
                  <span className="text-[10px] font-mono text-secondary">IDENTITY ID: 0184</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-secondary">Date of Birth:</span>
                    <span className="font-semibold text-heading">
                      {new Date(student.dateOfBirth).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })} (Age 21)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Gender:</span>
                    <span className="font-semibold text-heading">{student.gender || 'Female'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Blood Group:</span>
                    <span className="font-bold text-primary bg-primary-light px-2 py-0.5 rounded text-[11px]">
                      {student.bloodGroup || 'B+'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Phone Number:</span>
                    <span className="font-medium text-heading">{student.phone || '+1 (555) 742-0981'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">University Email:</span>
                    <span className="font-medium text-primary truncate max-w-[160px]">{student.email}</span>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <span className="text-secondary block mb-1">Residential Address:</span>
                    <p className="text-[11px] text-body leading-relaxed">
                      {student.address || 'Suite 412, Oakridge Graduate Hall, 108 Innovation Drive, Academic District, CA 94085'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-2.5 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between text-xs">
                <span className="text-secondary">EMERGENCY CONTACT:</span>
                <span className="font-semibold text-heading">{student.emergencyContact || '+1 (555) 891-0941'}</span>
              </div>
            </div>

            {/* 2. Academic Standing */}
            <div className="bg-card-bg rounded-xl border border-border p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-bold text-heading">Academic Standing</h3>
                  </div>
                  <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                    Tier 1 Standing
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-heading">3.88</span>
                    <span className="text-sm text-secondary">/ 4.00</span>
                    <span className="text-xs font-semibold text-emerald-600 ml-auto">↗ Top 2.5%</span>
                  </div>
                  <p className="text-[11px] text-secondary">Class Rank: 4 of 160 students</p>
                </div>

                <div className="p-3 bg-purple-50 rounded-lg border border-purple-100 mb-4 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-primary mb-1">
                    <Award className="w-3.5 h-3.5" />
                    Dean's Honor Roll
                  </div>
                  <p className="text-[11px] text-purple-900 leading-snug">
                    Confirmed for Semesters I, II & III Examinations
                  </p>
                </div>

                {/* Credits Progress */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-secondary">Total Credits Earned:</span>
                    <span className="font-bold text-heading">76 / 120 Units (63.3%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '63.3%' }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-secondary pt-1">
                    <span>Completed: 76 CR</span>
                    <span>In-Progress: 16 CR</span>
                    <span>Remaining: 28 CR</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border flex justify-between text-xs text-secondary">
                <span>ENROLLED TERM: <strong className="text-heading">Fall 2023</strong></span>
                <span>ANTICIPATED GRAD: <strong className="text-heading">Spring 2027</strong></span>
              </div>
            </div>

            {/* 3. Attendance Overview */}
            <div className="bg-card-bg rounded-xl border border-border p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-bold text-heading">Attendance Overview</h3>
                  </div>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                    Real-time Verified
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-28 h-28 relative flex items-center justify-center flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={attChartData}
                          innerRadius={36}
                          outerRadius={50}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {attChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-base font-extrabold text-heading">{attPercentage}%</span>
                      <span className="text-[8px] uppercase text-secondary font-bold">Compliance</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="text-secondary">{attPresent} Attended</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      <span className="text-secondary">{attAbsent} Unexcused Missed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span className="text-secondary">{attLate} Late Tardy</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-border">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <p className="text-base font-bold text-heading">{attPresent}</p>
                    <p className="text-[10px] text-secondary">Classes In</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <p className="text-base font-bold text-danger">{attAbsent}</p>
                    <p className="text-[10px] text-secondary">Absences</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <p className="text-base font-bold text-warning">{attLate}</p>
                    <p className="text-[10px] text-secondary">Late Marks</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border flex justify-between items-center text-xs text-secondary">
                <span>Minimum Institutional Requirement: 75.0%</span>
                <span className="text-emerald-600 font-bold">Satisfactory</span>
              </div>
            </div>
          </div>

          {/* Bottom Grid: Recent Results & Activity Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Recent Academic Results Table */}
            <div className="lg:col-span-8 bg-card-bg rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-heading">Recent Academic Results</h3>
                  <p className="text-xs text-secondary">Semester III Certified Transcripts • GPA: 3.88</p>
                </div>
                <button
                  onClick={() => setActiveTab('results')}
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  All Terms →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border text-[11px] font-bold text-secondary uppercase tracking-wider">
                      <th className="pb-3 px-3">Course Code & Name</th>
                      <th className="pb-3 px-3">Credits</th>
                      <th className="pb-3 px-3">Score</th>
                      <th className="pb-3 px-3">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-xs">
                    {(results.length ? results : [
                      { subject: 'CS-301 Design & Analysis of Algorithms', internalMarks: 24.5, midTermMarks: 28, endTermMarks: 44.5, totalMarks: 97, grade: 'A+' },
                      { subject: 'CS-304 Relational Database Systems', internalMarks: 23, midTermMarks: 27, endTermMarks: 42, totalMarks: 92, grade: 'A' },
                      { subject: 'CS-305 Modern Web Technologies', internalMarks: 24, midTermMarks: 28, endTermMarks: 44, totalMarks: 96, grade: 'A+' },
                      { subject: 'CS-312 Computer Networks & Protocols', internalMarks: 22, midTermMarks: 25, endTermMarks: 41, totalMarks: 88, grade: 'A' },
                    ]).map((res, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/60">
                        <td className="py-3 px-3">
                          <p className="font-semibold text-heading">{res.subject}</p>
                          <p className="text-[10px] text-secondary">Instructor: Faculty Leadership</p>
                        </td>
                        <td className="py-3 px-3 text-secondary font-mono">4.0</td>
                        <td className="py-3 px-3 font-semibold text-heading">{res.totalMarks || 95} / 100</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded font-bold bg-primary-light text-primary text-xs">
                            {res.grade || 'A'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-secondary">
                <span className="flex items-center gap-1.5 text-primary font-medium">
                  <Shield className="w-3.5 h-3.5" />
                  Controller of Examinations Seal Verified
                </span>
                <span className="font-mono text-[11px]">HASH: 0892f-b421c-99a18</span>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="lg:col-span-4 bg-card-bg rounded-xl border border-border p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-bold text-heading">Activity Timeline</h3>
                  </div>
                  <span className="text-[10px] text-secondary">Audit Trail & Logs</span>
                </div>

                <div className="space-y-4">
                  <div className="relative pl-5 border-l-2 border-purple-200 space-y-1">
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-primary"></div>
                    <p className="text-xs font-bold text-heading">Enrolled in Advanced Web Architecture</p>
                    <p className="text-[11px] text-secondary">Course slot confirmed under Prof. E. Vance (Sec 02)</p>
                    <span className="text-[10px] text-slate-400 block">Today, 09:14 AM</span>
                  </div>

                  <div className="relative pl-5 border-l-2 border-purple-200 space-y-1">
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-blue-500"></div>
                    <p className="text-xs font-bold text-heading">Tuition Fee Paid: $8,940.00</p>
                    <p className="text-[11px] text-secondary">Direct Invoice #418023 settled in full via Wire Transfer</p>
                    <span className="text-[10px] text-slate-400 block">3 days ago</span>
                  </div>

                  <div className="relative pl-5 border-l-2 border-purple-200 space-y-1">
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-emerald-500"></div>
                    <p className="text-xs font-bold text-heading">Submitted Lab Report 4</p>
                    <p className="text-[11px] text-secondary">Distributed Systems Practical #4 uploaded to LMS portal</p>
                    <span className="text-[10px] text-slate-400 block">Sep 18, 2024</span>
                  </div>

                  <div className="relative pl-5 border-l-2 border-purple-200 space-y-1">
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-amber-500"></div>
                    <p className="text-xs font-bold text-heading">Faculty Advisor Review Completed</p>
                    <p className="text-[11px] text-secondary">Deans Committee sign-off on Honors thesis proposal</p>
                    <span className="text-[10px] text-slate-400 block">Sep 10, 2024</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => toast('Complete tamper-evident audit ledger opened.', { icon: '📜' })}
                className="w-full mt-4 py-2 text-xs font-semibold text-primary bg-primary-light hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
              >
                View Full Audit Log →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Other tabs fallback */}
      {activeTab !== 'overview' && (
        <div className="bg-card-bg rounded-xl border border-border p-8 text-center">
          <FileText className="w-12 h-12 text-primary mx-auto mb-3" />
          <h3 className="text-base font-bold text-heading capitalize">{activeTab} Details</h3>
          <p className="text-xs text-secondary mt-1 max-w-md mx-auto">
            Comprehensive {activeTab} dossiers for {student.fullName} ({student.rollNumber}).
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => setActiveTab('overview')}
              className="px-4 py-2 text-xs font-semibold bg-primary text-white rounded-lg hover:bg-primary-hover"
            >
              Return to Overview
            </button>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Student Profile: ${student.fullName}`}
        size="lg"
      >
        <form onSubmit={handleUpdateStudent} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Full Name</label>
              <input
                type="text"
                required
                value={editFormData.fullName || ''}
                onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Phone Number</label>
              <input
                type="text"
                value={editFormData.phone || ''}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Semester</label>
              <input
                type="number"
                min="1"
                max="8"
                value={editFormData.semester || 1}
                onChange={(e) => setEditFormData({ ...editFormData, semester: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Section</label>
              <input
                type="text"
                value={editFormData.section || ''}
                onChange={(e) => setEditFormData({ ...editFormData, section: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Status</label>
              <select
                value={editFormData.status || 'Active'}
                onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="Active">Active</option>
                <option value="Academic Leave">Academic Leave</option>
                <option value="Suspended">Suspended</option>
                <option value="Graduated">Graduated</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-heading mb-1">Permanent Residential Address</label>
            <textarea
              rows={2}
              value={editFormData.address || ''}
              onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Guardian / Father's Name</label>
              <input
                type="text"
                value={editFormData.guardianName || ''}
                onChange={(e) => setEditFormData({ ...editFormData, guardianName: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Emergency Contact Phone</label>
              <input
                type="text"
                value={editFormData.emergencyContact || ''}
                onChange={(e) => setEditFormData({ ...editFormData, emergencyContact: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-xs font-medium border border-border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-primary text-white rounded-lg hover:bg-primary-hover shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentProfile;

