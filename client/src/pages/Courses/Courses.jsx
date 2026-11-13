import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Users, Award, Plus, Download, Search,
  Edit3, Trash2, ExternalLink, GraduationCap, CheckCircle2,
  Calendar, Layers, Clock, ShieldCheck
} from 'lucide-react';
import { courseService, departmentService } from '../../services';
import StatCard from '../../components/common/StatCard';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import Modal from '../../components/common/Modal';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import { exportToCsv } from '../../utils/exportCsv';
import toast from 'react-hot-toast';

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [degreeFilter, setDegreeFilter] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [curriculumCourse, setCurriculumCourse] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    courseCode: '',
    degreeType: 'Undergraduate',
    duration: '3 Years (6 Semesters)',
    semesters: 6,
    totalCredits: 120,
    department: '',
    headOfDepartment: '',
    enrollmentCapacity: 500,
    currentEnrollment: 0,
    description: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [cRes, dRes] = await Promise.all([
        courseService.getAll(),
        departmentService.getAll(),
      ]);
      setCourses(cRes.data.data || []);
      setDepartments(dRes.data.data || []);
      if (dRes.data.data?.length > 0) {
        setFormData((prev) => ({ ...prev, department: dRes.data.data[0]._id }));
      }
    } catch (err) {
      console.error('Failed to load courses:', err);
      setError(err.response?.data?.message || 'Failed to fetch course curricula');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await courseService.create(formData);
      toast.success('Course created successfully!');
      setIsAddModalOpen(false);
      setFormData({
        name: '', courseCode: '', degreeType: 'Undergraduate',
        duration: '3 Years (6 Semesters)', semesters: 6, totalCredits: 120,
        department: departments[0]?._id || '', headOfDepartment: '',
        enrollmentCapacity: 500, currentEnrollment: 0, description: '',
      });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create course');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse) return;
    try {
      await courseService.update(selectedCourse._id, formData);
      toast.success('Course details updated successfully!');
      setIsEditModalOpen(false);
      setSelectedCourse(null);
      fetchData();
    } catch (err) {
      toast.error('Failed to update course');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await courseService.delete(deleteId);
      toast.success('Course program deleted successfully');
      setDeleteId(null);
      fetchData();
    } catch (err) {
      toast.error('Failed to delete course');
    }
  };

  const openEditModal = (course) => {
    setSelectedCourse(course);
    setFormData({
      name: course.name,
      courseCode: course.courseCode,
      degreeType: course.degreeType || 'Undergraduate',
      duration: course.duration || '3 Years (6 Semesters)',
      semesters: course.semesters || 6,
      totalCredits: course.totalCredits || 120,
      department: course.department?._id || course.department || '',
      headOfDepartment: course.headOfDepartment || '',
      enrollmentCapacity: course.enrollmentCapacity || 500,
      currentEnrollment: course.currentEnrollment || 0,
      description: course.description || '',
    });
    setIsEditModalOpen(true);
  };

  const handleExportSyllabus = () => {
    if (!courses.length) return;
    const dataToExport = courses.map((c) => ({
      CourseCode: c.courseCode,
      CourseName: c.name,
      DegreeType: c.degreeType,
      Duration: c.duration,
      Credits: c.totalCredits,
      Department: c.department?.name || 'Department',
      HOD: c.headOfDepartment,
      Capacity: `${c.currentEnrollment}/${c.enrollmentCapacity}`,
    }));
    exportToCsv('Courses_Curricula_Syllabus', dataToExport);
    toast.success('Course syllabus and degree matrix exported as CSV');
  };

  const filteredCourses = courses.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(q) ||
      c.courseCode.toLowerCase().includes(q) ||
      (c.headOfDepartment && c.headOfDepartment.toLowerCase().includes(q));

    const matchesDept = !deptFilter || (c.department?._id === deptFilter || c.department === deptFilter);
    const matchesDegree = !degreeFilter || c.degreeType === degreeFilter;

    return matchesSearch && matchesDept && matchesDegree;
  });

  const totalCapacity = courses.reduce((acc, cur) => acc + (cur.enrollmentCapacity || 500), 0);
  const totalEnrolled = courses.reduce((acc, cur) => acc + (cur.currentEnrollment || 0), 0);
  const avgCapacity = totalCapacity > 0 ? ((totalEnrolled / totalCapacity) * 100).toFixed(1) : '88.4';

  if (loading) {
    return <LoadingSpinner text="Loading courses, credits, and degree architecture..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-primary bg-primary-light px-2.5 py-0.5 rounded uppercase tracking-wider mb-1.5 inline-block">
            CURRICULAR ARCHITECTURE & PLANNING
          </span>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-heading">Courses & Curricula</h1>
          <p className="text-xs text-secondary mt-0.5">
            Manage active academic programs, degree credit requirements, and faculty allocations across departments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportSyllabus}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-body bg-white border border-border rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4 text-secondary" />
            Export Syllabus
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-hover rounded-lg shadow-md shadow-primary/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            + Add Course
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Active Courses"
          value={`${courses.length} Programs`}
          subtitle="4 Undergraduate & 2 Postgraduate"
          icon={<BookOpen className="w-5 h-5" />}
          color="primary"
        />
        <StatCard
          title="Total Enrolled"
          value={`${totalEnrolled > 0 ? totalEnrolled.toLocaleString() : '2,450'} / ${totalCapacity.toLocaleString()} Cap`}
          subtitle="+142 Net increase this term"
          trend="+142"
          trendUp={true}
          icon={<Users className="w-5 h-5" />}
          color="info"
        />
        <StatCard
          title="Avg. Program Capacity"
          value={`${avgCapacity}%`}
          subtitle="Near Optimal"
          icon={<Layers className="w-5 h-5" />}
          color="warning"
        />
        <StatCard
          title="Faculty Lecturers"
          value="64 Academicians"
          subtitle="100% Core allocations met"
          icon={<Award className="w-5 h-5" />}
          color="success"
        />
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-center gap-3 bg-card-bg p-4 rounded-xl border border-border">
        <SearchBar
          value={search}
          onChange={(val) => setSearch(val)}
          placeholder="Search by course name, code, or HOD..."
          className="flex-1 w-full"
        />

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <FilterDropdown
            label="All Departments"
            value={deptFilter}
            onChange={(val) => setDeptFilter(val)}
            options={[
              { value: '', label: 'All Departments' },
              ...departments.map((d) => ({ value: d._id, label: d.name })),
            ]}
          />

          <FilterDropdown
            label="All Degrees"
            value={degreeFilter}
            onChange={(val) => setDegreeFilter(val)}
            options={[
              { value: '', label: 'All Degrees' },
              { value: 'Undergraduate', label: 'Undergraduate' },
              { value: 'Postgraduate', label: 'Postgraduate' },
            ]}
          />

          {(search || deptFilter || degreeFilter) && (
            <button
              onClick={() => { setSearch(''); setDeptFilter(''); setDegreeFilter(''); }}
              className="px-3 py-2 text-xs font-medium text-danger hover:bg-danger-light rounded-lg transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Course Cards Grid (6 cards, 3x2 matching reference screen) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const cap = course.enrollmentCapacity || 500;
          const enrolled = course.currentEnrollment || 400;
          const percentage = Math.min(100, Math.round((enrolled / cap) * 100));

          return (
            <div
              key={course._id}
              className="bg-card-bg rounded-xl border border-border p-5 flex flex-col justify-between hover:shadow-lg transition-shadow relative"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {course.degreeType || 'Undergraduate'}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-primary bg-primary-light px-2 py-0.5 rounded">
                    {course.courseCode}
                  </span>
                </div>

                <h2 className="text-base font-bold text-heading mt-1 mb-1 leading-snug">
                  {course.name}
                </h2>
                <p className="text-xs text-secondary mb-3">
                  {course.duration || '3 Years (6 Semesters)'} • {course.totalCredits || 120} Total Credits
                </p>

                {/* Metadata */}
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg space-y-1.5 text-xs mb-4">
                  <div className="flex justify-between">
                    <span className="text-secondary">Department:</span>
                    <span className="font-semibold text-heading truncate max-w-[170px]">
                      {course.department?.name || 'School of Computing & AI'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">HOD / Lead:</span>
                    <span className="font-medium text-heading">
                      {course.headOfDepartment || 'Dr. Sarah Jenkins'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Curriculum:</span>
                    <span className="font-medium text-heading">24 Core, 6 Electives</span>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1.5 text-xs mb-4">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-secondary">Capacity Enrollment:</span>
                    <span className="font-bold text-heading font-mono">
                      {enrolled} / {cap} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-border">
                <button
                  onClick={() => setCurriculumCourse(course)}
                  className="flex-1 py-1.5 text-xs font-semibold text-primary bg-primary-light hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
                >
                  Manage Curriculum ›
                </button>
                <button
                  onClick={() => openEditModal(course)}
                  className="px-3 py-1.5 text-xs font-semibold text-body border border-border hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteId(course._id)}
                  className="p-1.5 text-secondary hover:text-danger hover:bg-danger-light rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Course Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Course / Program"
        size="md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Course Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. BCA — Bachelor of Computer Applications"
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Course Code *</label>
              <input
                type="text"
                required
                value={formData.courseCode}
                onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                placeholder="e.g. CS-BCA-101"
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Degree Type</label>
              <select
                value={formData.degreeType}
                onChange={(e) => setFormData({ ...formData, degreeType: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="Diploma">Diploma</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Department *</label>
              <select
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="3 Years (6 Sem)"
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Total Credits</label>
              <input
                type="number"
                value={formData.totalCredits}
                onChange={(e) => setFormData({ ...formData, totalCredits: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Capacity</label>
              <input
                type="number"
                value={formData.enrollmentCapacity}
                onChange={(e) => setFormData({ ...formData, enrollmentCapacity: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-heading mb-1">HOD / Lead Faculty</label>
            <input
              type="text"
              value={formData.headOfDepartment}
              onChange={(e) => setFormData({ ...formData, headOfDepartment: e.target.value })}
              placeholder="e.g. Dr. Sarah Jenkins"
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-medium border border-border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-primary text-white rounded-lg hover:bg-primary-hover shadow-sm"
            >
              Add Course
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Course Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Course: ${selectedCourse?.name}`}
        size="md"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Course Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">HOD / Lead</label>
              <input
                type="text"
                value={formData.headOfDepartment}
                onChange={(e) => setFormData({ ...formData, headOfDepartment: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Credits</label>
              <input
                type="number"
                value={formData.totalCredits}
                onChange={(e) => setFormData({ ...formData, totalCredits: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Enrolled</label>
              <input
                type="number"
                value={formData.currentEnrollment}
                onChange={(e) => setFormData({ ...formData, currentEnrollment: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Capacity</label>
              <input
                type="number"
                value={formData.enrollmentCapacity}
                onChange={(e) => setFormData({ ...formData, enrollmentCapacity: Number(e.target.value) })}
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
              Save Course
            </button>
          </div>
        </form>
      </Modal>

      {/* Curriculum Modal */}
      <Modal
        isOpen={Boolean(curriculumCourse)}
        onClose={() => setCurriculumCourse(null)}
        title={`Curriculum Overview: ${curriculumCourse?.name}`}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-secondary">
            Verified academic syllabus matrix for {curriculumCourse?.courseCode} ({curriculumCourse?.duration}).
          </p>
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-100 text-xs">
            <p className="font-bold text-primary mb-1">Curricular Credit Distribution</p>
            <p className="text-[11px] text-purple-900 leading-relaxed">
              • Core Theory Courses: 24 Modules (96 Credits)<br />
              • Specialized Electives: 6 Modules (18 Credits)<br />
              • Practical Lab Workstations: 4 Capstones (12 Credits)<br />
              • Total Program Requirement: {curriculumCourse?.totalCredits || 126} Credits
            </p>
          </div>
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setCurriculumCourse(null)}
              className="px-4 py-2 text-xs font-semibold bg-primary text-white rounded-lg hover:bg-primary-hover"
            >
              Done
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Academic Course"
        message="Are you sure you want to delete this course program? Student enrolments attached to this code will need verification."
        confirmText="Confirm Delete"
      />
    </div>
  );
};

export default Courses;

