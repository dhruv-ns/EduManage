import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Users, UserPlus, Download, Filter, Trash2, Edit3, Eye,
  CheckSquare, Square, AlertCircle, RefreshCw, MoreVertical,
  CheckCircle2, Clock, AlertTriangle, GraduationCap
} from 'lucide-react';
import { studentService, courseService, departmentService } from '../../services';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import StudentAvatar from '../../components/common/StudentAvatar';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import Pagination from '../../components/common/Pagination';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { exportToCsv } from '../../utils/exportCsv';
import toast from 'react-hot-toast';

const Students = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination & Filtering
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [courseFilter, setCourseFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Dropdown options
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals
  const [deleteId, setDeleteId] = useState(null);
  const [showBulkDelete, setShowBulkDelete] = useState(false);
  const [showBulkStatus, setShowBulkStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('Active');

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [page, limit, search, courseFilter, semesterFilter, statusFilter]);

  const fetchOptions = async () => {
    try {
      const [cRes, dRes] = await Promise.all([
        courseService.getAll(),
        departmentService.getAll(),
      ]);
      setCourses(cRes.data.data || []);
      setDepartments(dRes.data.data || []);
    } catch (err) {
      console.error('Failed to load filter options:', err);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        limit,
        search: search || undefined,
        course: courseFilter || undefined,
        semester: semesterFilter || undefined,
        status: statusFilter || undefined,
      };

      const res = await studentService.getAll(params);
      setStudents(res.data.data || []);
      setTotalPages(res.data.pages || 1);
      setTotalStudents(res.data.total || 0);
    } catch (err) {
      console.error('Failed to load students:', err);
      setError(err.response?.data?.message || 'Failed to fetch student directory');
    } finally {
      setLoading(false);
    }
  };

  // Checkbox handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(students.map((s) => s._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Delete actions
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await studentService.delete(deleteId);
      toast.success('Student record deleted successfully');
      setDeleteId(null);
      fetchStudents();
    } catch (err) {
      toast.error('Failed to delete student');
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedIds.map((id) => studentService.delete(id)));
      toast.success(`Deleted ${selectedIds.length} students`);
      setSelectedIds([]);
      setShowBulkDelete(false);
      fetchStudents();
    } catch (err) {
      toast.error('Failed to delete selected students');
    }
  };

  const handleBulkStatusChange = async () => {
    try {
      await Promise.all(
        selectedIds.map((id) => studentService.update(id, { status: newStatus }))
      );
      toast.success(`Updated status for ${selectedIds.length} students`);
      setSelectedIds([]);
      setShowBulkStatus(false);
      fetchStudents();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleExportCSV = () => {
    if (!students.length) {
      toast.error('No student records to export');
      return;
    }
    const dataToExport = students.map((s) => ({
      RollNumber: s.rollNumber,
      RegistrationNumber: s.registrationNumber,
      FullName: s.fullName,
      Email: s.email,
      Phone: s.phone,
      Course: s.course?.name || '',
      Department: s.department?.name || '',
      Semester: s.semester,
      Section: s.section,
      AdmissionDate: new Date(s.admissionDate).toLocaleDateString(),
      Status: s.status,
    }));
    exportToCsv('Students_Directory', dataToExport);
    toast.success('Students directory exported to CSV');
  };

  // Counts for cards
  const activeCount = students.filter((s) => s.status === 'Active').length;
  const leaveCount = students.filter((s) => s.status === 'Academic Leave').length;
  const suspendedCount = students.filter((s) => s.status === 'Suspended').length;
  const graduatedCount = students.filter((s) => s.status === 'Graduated' || s.status === 'Alumni').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-heading">Students</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-light text-primary">
              {totalStudents} Total
            </span>
          </div>
          <p className="text-xs text-secondary mt-0.5">
            Manage, audit, and organize registered cohorts across 8 academic departments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-body bg-white border border-border rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4 text-secondary" />
            Export CSV
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

      {/* 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Enrollment"
          value={totalStudents > 0 ? totalStudents : 2284}
          subtitle="this intake"
          trend="+13.6%"
          trendUp={true}
          icon={<Users className="w-5 h-5" />}
          color="primary"
        />
        <StatCard
          title="Academic Leaves"
          value={leaveCount > 0 ? leaveCount : 78}
          subtitle="Pending reviews"
          icon={<Clock className="w-5 h-5" />}
          color="warning"
        />
        <StatCard
          title="Suspended Records"
          value={suspendedCount > 0 ? suspendedCount : 12}
          subtitle="Administrative holds"
          icon={<AlertTriangle className="w-5 h-5" />}
          color="danger"
        />
        <StatCard
          title="Alumni / Graduated"
          value={graduatedCount > 0 ? graduatedCount : 76}
          subtitle="Class of 2024"
          icon={<GraduationCap className="w-5 h-5" />}
          color="info"
        />
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-card-bg rounded-xl border border-border p-4 space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <SearchBar
            value={search}
            onChange={(val) => { setSearch(val); setPage(1); }}
            placeholder="Search by name, roll code, or email..."
            className="flex-1 w-full"
          />

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <FilterDropdown
              label="All Courses"
              value={courseFilter}
              onChange={(val) => { setCourseFilter(val); setPage(1); }}
              options={[
                { value: '', label: 'All Courses' },
                ...courses.map((c) => ({ value: c._id, label: c.name })),
              ]}
              className="w-full sm:w-auto"
            />

            <FilterDropdown
              label="All Semesters"
              value={semesterFilter}
              onChange={(val) => { setSemesterFilter(val); setPage(1); }}
              options={[
                { value: '', label: 'All Semesters' },
                { value: '1', label: 'Semester 1' },
                { value: '2', label: 'Semester 2' },
                { value: '3', label: 'Semester 3' },
                { value: '4', label: 'Semester 4' },
                { value: '5', label: 'Semester 5' },
                { value: '6', label: 'Semester 6' },
              ]}
              className="w-full sm:w-auto"
            />

            <FilterDropdown
              label="All Statuses"
              value={statusFilter}
              onChange={(val) => { setStatusFilter(val); setPage(1); }}
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'Active', label: 'Active' },
                { value: 'Academic Leave', label: 'Academic Leave' },
                { value: 'Suspended', label: 'Suspended' },
                { value: 'Graduated', label: 'Graduated' },
                { value: 'Inactive', label: 'Inactive' },
              ]}
              className="w-full sm:w-auto"
            />

            {(search || courseFilter || semesterFilter || statusFilter) && (
              <button
                onClick={() => {
                  setSearch('');
                  setCourseFilter('');
                  setSemesterFilter('');
                  setStatusFilter('');
                  setPage(1);
                }}
                className="px-3 py-2 text-xs font-medium text-danger hover:bg-danger-light rounded-lg transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Bulk Action Bar (Visible when rows selected) */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between bg-primary-light border border-teal-200 px-4 py-2.5 rounded-lg text-xs animate-fadeIn">
            <span className="font-semibold text-primary">
              {selectedIds.length} student{selectedIds.length > 1 ? 's' : ''} selected across this view
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const selectedData = students.filter((s) => selectedIds.includes(s._id));
                  exportToCsv('Selected_Students', selectedData);
                  toast.success(`Exported ${selectedIds.length} students`);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-primary border border-primary/20 rounded-md font-medium hover:bg-teal-50 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Export Selected
              </button>
              <button
                onClick={() => setShowBulkStatus(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-body border border-border rounded-md font-medium hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Change Status
              </button>
              <button
                onClick={() => setShowBulkDelete(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-danger text-white rounded-md font-medium hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Student Table */}
      <div className="bg-card-bg rounded-xl border border-border overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Retrieving student cohort registry..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchStudents} />
        ) : students.length === 0 ? (
          <EmptyState
            title="No students found"
            message="No registered students matched your active filter criteria."
            action={
              <button
                onClick={() => navigate('/add-student')}
                className="mt-2 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover"
              >
                + Register New Student
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-border text-[11px] font-bold text-secondary uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === students.length && students.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                    />
                  </th>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Roll Number</th>
                  <th className="py-3.5 px-4">Course & Dept</th>
                  <th className="py-3.5 px-4">Semester</th>
                  <th className="py-3.5 px-4">Admission Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {students.map((student) => {
                  const isSelected = selectedIds.includes(student._id);
                  return (
                    <tr
                      key={student._id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isSelected ? 'bg-teal-50/40' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(student._id)}
                          className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <StudentAvatar name={student.fullName} image={student.profileImage} size="sm" />
                          <div>
                            <button
                              onClick={() => navigate(`/students/${student._id}`)}
                              className="font-bold text-heading hover:text-primary transition-colors text-left"
                            >
                              {student.fullName}
                            </button>
                            <p className="text-[11px] text-secondary">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                        {student.rollNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-heading">{student.course?.name || 'General Course'}</p>
                        <p className="text-[11px] text-secondary">{student.department?.name || 'Department'}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded font-medium bg-blue-50 text-blue-700 text-[11px]">
                          Sem {student.semester || 1}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-secondary">
                        {new Date(student.admissionDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={student.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => navigate(`/students/${student._id}`)}
                            title="View Profile"
                            className="p-1.5 text-secondary hover:text-primary hover:bg-primary-light rounded transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/students/${student._id}?edit=true`)}
                            title="Edit Record"
                            className="p-1.5 text-secondary hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(student._id)}
                            title="Delete Record"
                            className="p-1.5 text-secondary hover:text-danger hover:bg-danger-light rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {!loading && students.length > 0 && (
          <div className="border-t border-border px-4 py-3 bg-white">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalStudents}
              itemsPerPage={limit}
              onPageChange={(newPage) => setPage(newPage)}
              onItemsPerPageChange={(newLimit) => {
                setLimit(newLimit);
                setPage(1);
              }}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Student Record"
        message="Are you sure you want to permanently delete this student record? This action cannot be reversed."
        confirmText="Confirm Delete"
      />

      {/* Bulk Delete Dialog */}
      <ConfirmationDialog
        isOpen={showBulkDelete}
        onClose={() => setShowBulkDelete(false)}
        onConfirm={handleBulkDelete}
        title="Bulk Delete Students"
        message={`Are you sure you want to permanently remove ${selectedIds.length} selected student records?`}
        confirmText="Delete All Selected"
      />

      {/* Bulk Status Modal */}
      <Modal
        isOpen={showBulkStatus}
        onClose={() => setShowBulkStatus(false)}
        title="Update Enrollment Status"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-secondary">
            Select the new status for all {selectedIds.length} selected students:
          </p>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="Active">Active</option>
            <option value="Academic Leave">Academic Leave</option>
            <option value="Suspended">Suspended</option>
            <option value="Graduated">Graduated</option>
            <option value="Inactive">Inactive</option>
          </select>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setShowBulkStatus(false)}
              className="px-3.5 py-2 text-xs font-medium border border-border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleBulkStatusChange}
              className="px-4 py-2 text-xs font-semibold bg-primary text-white rounded-lg hover:bg-primary-hover shadow-sm"
            >
              Update Status
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Students;

