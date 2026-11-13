import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, BookOpen, Building2, UserPlus, Download,
  Calendar, Clock, ArrowUpRight, CheckCircle2, ChevronRight,
  TrendingUp, Activity, FileSpreadsheet
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell
} from 'recharts';
import { dashboardService } from '../../services';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import StudentAvatar from '../../components/common/StudentAvatar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import { exportToCsv } from '../../utils/exportCsv';
import toast from 'react-hot-toast';

const COLORS = ['#6C3FEE', '#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentAdmissions, setRecentAdmissions] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [courseDistribution, setCourseDistribution] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, admissionsRes, enrollRes, distRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentAdmissions(),
        dashboardService.getEnrollmentOverview(),
        dashboardService.getCourseDistribution(),
      ]);

      setStats(statsRes.data.data);
      setRecentAdmissions(admissionsRes.data.data);
      setEnrollmentData(enrollRes.data.data);
      setCourseDistribution(distRes.data.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!recentAdmissions.length) {
      toast.error('No admission records to export');
      return;
    }
    const dataToExport = recentAdmissions.map((s) => ({
      RollNumber: s.rollNumber,
      Name: s.fullName,
      Email: s.email,
      Course: s.course?.name || 'N/A',
      Department: s.department?.name || 'N/A',
      AdmissionDate: new Date(s.admissionDate).toLocaleDateString(),
      Status: s.status,
    }));
    exportToCsv('Recent_Admissions_Report', dataToExport);
    toast.success('Recent admissions report downloaded as CSV');
  };

  if (loading) {
    return <LoadingSpinner text="Compiling academic metrics and live registries..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDashboardData} />;
  }

  const totalStudents = stats?.totalStudents || 2450;
  const totalCourses = stats?.totalCourses || 18;
  const totalDepartments = stats?.totalDepartments || 8;
  const newAdmissions = stats?.newAdmissions || 125;

  return (
    <div className="space-y-6">
      {/* Top Greeting & Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>Wednesday, October 23, 2024</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-heading">
            Good Morning, Dr. Vance 👋
          </h1>
          <p className="text-xs text-secondary mt-0.5">
            Here's what's happening with your institution today across all {totalDepartments} faculties.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-body bg-white border border-border rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4 text-secondary" />
            Export Report
          </button>
          <button
            onClick={() => navigate('/add-student')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-hover rounded-lg shadow-md shadow-primary/25 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            + Add New Student
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={totalStudents.toLocaleString()}
          subtitle="vs last semester"
          trend="+8.2%"
          trendUp={true}
          icon={<Users className="w-5 h-5" />}
          color="primary"
        />
        <StatCard
          title="Total Courses"
          value={totalCourses}
          subtitle="active curricula"
          trend="+4.2%"
          trendUp={true}
          icon={<BookOpen className="w-5 h-5" />}
          color="info"
        />
        <StatCard
          title="Departments"
          value={totalDepartments}
          subtitle="faculty expansion"
          trend="+12.5%"
          trendUp={true}
          icon={<Building2 className="w-5 h-5" />}
          color="warning"
        />
        <StatCard
          title="New Admissions"
          value={newAdmissions}
          subtitle="fall intake target"
          trend="+18.2%"
          trendUp={true}
          icon={<UserPlus className="w-5 h-5" />}
          color="success"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Student Enrollment Overview Line Chart */}
        <div className="lg:col-span-8 bg-card-bg rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-base font-bold text-heading">Student Enrollment Overview</h2>
              <p className="text-xs text-secondary">
                Longitudinal student count across regular academic sessions
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-body">
                <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>
                2024 Cohort
              </span>
              <span className="flex items-center gap-1.5 text-secondary">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-200 inline-block"></span>
                2023 Cohort
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enrollmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="enrollmentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C3FEE" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6C3FEE" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#8E8EA0" fontSize={11} tickLine={false} />
                <YAxis stroke="#8E8EA0" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1A1A2E', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="cohort2024" stroke="#6C3FEE" strokeWidth={2.5} fillOpacity={1} fill="url(#enrollmentGrad)" />
                <Area type="monotone" dataKey="cohort2023" stroke="#C4B5FD" strokeWidth={1.5} strokeDasharray="3 3" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between text-xs text-secondary pt-3 border-t border-border mt-2">
            <span>Capacity Utilization: <strong className="text-heading">84.6%</strong> (Near Optimal)</span>
            <span className="text-primary hover:underline cursor-pointer">View Longitudinal Data →</span>
          </div>
        </div>

        {/* Course Distribution Doughnut Chart */}
        <div className="lg:col-span-4 bg-card-bg rounded-xl border border-border p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-heading">Course Distribution</h2>
              <button onClick={() => navigate('/courses')} className="text-xs text-primary hover:underline">
                View quotas
              </button>
            </div>
            <p className="text-xs text-secondary mb-4">Enrollment share by primary degree program</p>

            <div className="h-44 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={courseDistribution.length ? courseDistribution : [
                      { name: 'BCA', count: 890 },
                      { name: 'BBA', count: 538 },
                      { name: 'B.Com', count: 441 },
                      { name: 'B.Sc', count: 368 },
                      { name: 'BA', count: 270 },
                      { name: 'Other', count: 118 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={68}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {courseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-bold text-heading leading-tight">{totalStudents.toLocaleString()}</span>
                <span className="text-[10px] text-secondary uppercase font-semibold">Students</span>
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-border text-xs">
              {(courseDistribution.length ? courseDistribution : [
                { name: 'BCA', count: 890 },
                { name: 'BBA', count: 538 },
                { name: 'B.Com', count: 441 },
                { name: 'B.Sc', count: 368 },
                { name: 'BA', count: 270 },
                { name: 'Other', count: 118 },
              ]).slice(0, 6).map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                    <span className="text-secondary truncate text-[11px]">{item.code || item.name}</span>
                  </div>
                  <span className="font-semibold text-heading text-[11px]">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-[11px] text-secondary mt-3 pt-2 border-t border-border flex justify-between">
            <span>Capacity Utilization: <strong className="text-heading">84.5%</strong></span>
            <span className="text-emerald-600 font-semibold">Healthy</span>
          </div>
        </div>
      </div>

      {/* Recent Admissions Table */}
      <div className="bg-card-bg rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-heading">Recent Admissions</h2>
            <p className="text-xs text-secondary">Latest student registrations for Fall 2024</p>
          </div>
          <button
            onClick={() => navigate('/students')}
            className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
          >
            View All Students <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-[11px] font-bold text-secondary uppercase tracking-wider">
                <th className="pb-3 px-3">Student</th>
                <th className="pb-3 px-3">Roll Number</th>
                <th className="pb-3 px-3">Course & Dept</th>
                <th className="pb-3 px-3">Admission Date</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {recentAdmissions.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <StudentAvatar name={student.fullName} image={student.profileImage} size="sm" />
                      <div>
                        <p className="font-semibold text-heading">{student.fullName}</p>
                        <p className="text-[11px] text-secondary">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono font-medium text-slate-700">
                    {student.rollNumber}
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-medium text-heading">{student.course?.name || 'General Degree'}</p>
                    <p className="text-[11px] text-secondary">{student.department?.name || 'Academic Unit'}</p>
                  </td>
                  <td className="py-3 px-3 text-secondary">
                    {new Date(student.admissionDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={student.status} />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => navigate(`/students/${student._id}`)}
                      className="px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary-light rounded transition-colors"
                    >
                      Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom 3-Column Section: Events, Activities, Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <div className="bg-card-bg rounded-xl border border-border p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-heading">Upcoming Events</h3>
              </div>
              <span className="text-[11px] text-secondary font-medium">Next 14 Days</span>
            </div>
            <p className="text-[11px] text-secondary mb-4">Official university schedule</p>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 font-bold flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-[9px] uppercase">OCT</span>
                  <span className="text-sm leading-none">28</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-heading">Mid-term Examinations</h4>
                  <p className="text-[11px] text-secondary">All undergraduate academic portals</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 font-bold flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-[9px] uppercase">NOV</span>
                  <span className="text-sm leading-none">02</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-heading">Faculty Board Meeting</h4>
                  <p className="text-[11px] text-secondary">Senate Hall & Hybrid Stream</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-[9px] uppercase">NOV</span>
                  <span className="text-sm leading-none">10</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-heading">Fall Sports Meet</h4>
                  <p className="text-[11px] text-secondary">Athletic Complex, Main Stadium</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => toast('Full Academic Calendar is available in System Settings.', { icon: '📅' })}
            className="w-full mt-4 py-2 text-xs font-semibold text-primary bg-primary-light hover:bg-purple-100 rounded-lg transition-colors"
          >
            Full Academic Calendar
          </button>
        </div>

        {/* Recent Activities */}
        <div className="bg-card-bg rounded-xl border border-border p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-heading">Recent Activities</h3>
              </div>
              <span className="text-[11px] text-secondary font-medium">Audit Stream</span>
            </div>
            <p className="text-[11px] text-secondary mb-4">Real-time system events</p>

            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></span>
                <div>
                  <p className="text-xs font-medium text-heading">Roll call finalized for CS-301</p>
                  <p className="text-[10px] text-secondary">Marked by Prof. Marcus Aurel • 18m ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
                <div>
                  <p className="text-xs font-medium text-heading">Grade revision approved</p>
                  <p className="text-[10px] text-secondary">Authorized by Dr. Elena Vance • 1h ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
                <div>
                  <p className="text-xs font-medium text-heading">New syllabus published: Data Structures</p>
                  <p className="text-[10px] text-secondary">Computing Curriculum Board • 3h ago</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => toast('Activity logs are audited & encrypted for institutional compliance.', { icon: '🛡️' })}
            className="w-full mt-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            View Activity Logs
          </button>
        </div>

        {/* Quick Actions */}
        <div className="bg-card-bg rounded-xl border border-border p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-heading">⚡ Quick Actions</h3>
              <span className="text-[11px] text-secondary">Standard Ops</span>
            </div>
            <p className="text-[11px] text-secondary mb-4">Frequently accessed administrative workflows</p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/add-student')}
                className="p-3 bg-purple-50 hover:bg-purple-100/80 rounded-xl border border-purple-100 text-left transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-heading">Add Student</h4>
                <p className="text-[10px] text-secondary">New enrolment</p>
              </button>

              <button
                onClick={() => navigate('/courses')}
                className="p-3 bg-blue-50 hover:bg-blue-100/80 rounded-xl border border-blue-100 text-left transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-heading">Manage Courses</h4>
                <p className="text-[10px] text-secondary">Curricula & credits</p>
              </button>

              <button
                onClick={() => navigate('/attendance')}
                className="p-3 bg-emerald-50 hover:bg-emerald-100/80 rounded-xl border border-emerald-100 text-left transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Clock className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-heading">View Attendance</h4>
                <p className="text-[10px] text-secondary">Session logs</p>
              </button>

              <button
                onClick={() => navigate('/results')}
                className="p-3 bg-amber-50 hover:bg-amber-100/80 rounded-xl border border-amber-100 text-left transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-heading">Academic Report</h4>
                <p className="text-[10px] text-secondary">Generate PDF</p>
              </button>
            </div>
          </div>

          <div className="mt-4 p-2.5 bg-primary-50 rounded-lg border border-primary-light flex items-center justify-between text-xs text-primary font-medium">
            <span>AY 24-25 Registrar Multi-active</span>
            <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

