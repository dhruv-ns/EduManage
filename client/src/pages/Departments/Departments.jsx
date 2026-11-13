import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Users, Award, Plus, Download, Filter, Search,
  Edit3, Trash2, ExternalLink, Mail, MapPin, GraduationCap,
  Sparkles, CheckCircle2, ChevronRight
} from 'lucide-react';
import { departmentService } from '../../services';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import SearchBar from '../../components/common/SearchBar';
import Modal from '../../components/common/Modal';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import { exportToCsv } from '../../utils/exportCsv';
import toast from 'react-hot-toast';

const Departments = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    departmentHead: '',
    headTitle: 'Head of Department',
    headCredentials: '',
    location: '',
    facultyCount: 12,
    studentsCount: 300,
    programsCount: 3,
    budget: 1000000,
    researchGrants: '$500,000',
    description: '',
    email: '',
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await departmentService.getAll();
      setDepartments(res.data.data || []);
    } catch (err) {
      console.error('Failed to load departments:', err);
      setError(err.response?.data?.message || 'Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await departmentService.create(formData);
      toast.success('Department created successfully!');
      setIsAddModalOpen(false);
      setFormData({
        name: '', code: '', departmentHead: '', headTitle: 'Head of Department',
        headCredentials: '', location: '', facultyCount: 12, studentsCount: 300,
        programsCount: 3, budget: 1000000, researchGrants: '$500,000', description: '', email: '',
      });
      fetchDepartments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create department');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDept) return;
    try {
      await departmentService.update(selectedDept._id, formData);
      toast.success('Department settings updated successfully!');
      setIsEditModalOpen(false);
      setSelectedDept(null);
      fetchDepartments();
    } catch (err) {
      toast.error('Failed to update department');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await departmentService.delete(deleteId);
      toast.success('Department deleted successfully');
      setDeleteId(null);
      fetchDepartments();
    } catch (err) {
      toast.error('Failed to delete department');
    }
  };

  const openEditModal = (dept) => {
    setSelectedDept(dept);
    setFormData({
      name: dept.name,
      code: dept.code,
      departmentHead: dept.departmentHead,
      headTitle: dept.headTitle || 'Head of Department',
      headCredentials: dept.headCredentials || '',
      location: dept.location || '',
      facultyCount: dept.facultyCount || 0,
      studentsCount: dept.studentsCount || 0,
      programsCount: dept.programsCount || 0,
      budget: dept.budget || 0,
      researchGrants: dept.researchGrants || '$0',
      description: dept.description || '',
      email: dept.email || '',
    });
    setIsEditModalOpen(true);
  };

  const handleExportCSV = () => {
    if (!departments.length) return;
    const dataToExport = departments.map((d) => ({
      Code: d.code,
      DepartmentName: d.name,
      Head: d.departmentHead,
      Location: d.location,
      Students: d.studentsCount,
      Faculty: d.facultyCount,
      Budget: `$${d.budget.toLocaleString()}`,
      ResearchGrants: d.researchGrants,
    }));
    exportToCsv('Departments_Resource_Allocation', dataToExport);
    toast.success('Department resource allocation exported to CSV');
  };

  const filteredDepts = departments.filter((d) => {
    const q = search.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.code.toLowerCase().includes(q) ||
      d.departmentHead.toLowerCase().includes(q)
    );
  });

  const totalEnrolled = departments.reduce((acc, cur) => acc + (cur.studentsCount || 0), 0);
  const totalFaculty = departments.reduce((acc, cur) => acc + (cur.facultyCount || 0), 0);
  const totalBudget = departments.reduce((acc, cur) => acc + (cur.budget || 0), 0);

  if (loading) {
    return <LoadingSpinner text="Retrieving faculty divisions and budget allocations..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDepartments} />;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-primary bg-primary-light px-2.5 py-0.5 rounded uppercase tracking-wider mb-1.5 inline-block">
            FACULTY ADMINISTRATION PORTAL
          </span>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-heading">Academic Departments</h1>
          <p className="text-xs text-secondary mt-0.5">
            Overview faculty divisions, department leadership, enrolled students, and resource allocation across university disciplines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => toast('Faculty Directory view opened with 61 chairs.', { icon: '👥' })}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-body bg-white border border-border rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
          >
            <Users className="w-4 h-4 text-secondary" />
            Faculty Directory
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-hover rounded-lg shadow-md shadow-primary/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            + Add Department
          </button>
        </div>
      </div>

      {/* 3 Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Active Academic Units"
          value={`${departments.length} Divisions`}
          subtitle="100% Operational Status"
          icon={<Building2 className="w-5 h-5" />}
          color="primary"
        />
        <StatCard
          title="Total Enrolled Body"
          value={totalEnrolled > 0 ? totalEnrolled.toLocaleString() : '2,450'}
          subtitle="+4.4% YoY Expansion"
          trend="+4.4%"
          trendUp={true}
          icon={<Users className="w-5 h-5" />}
          color="info"
        />
        <StatCard
          title="Faculty & Research"
          value={`${totalFaculty > 0 ? totalFaculty : 61} Chairs`}
          subtitle="Avg. Ratio 1:40.2 Across Campus"
          icon={<Award className="w-5 h-5" />}
          color="warning"
        />
      </div>

      {/* Search Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={(val) => setSearch(val)}
          placeholder="Search departments or codes..."
          className="max-w-md w-full"
        />
      </div>

      {/* 6 Department Cards Grid (matching reference screen) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepts.map((dept, index) => (
          <div
            key={dept._id}
            className="bg-card-bg rounded-xl border border-border p-5 flex flex-col justify-between hover:shadow-lg transition-shadow relative"
          >
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold text-primary bg-primary-light px-2 py-0.5 rounded">
                  {dept.code}
                </span>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  Tier {index % 2 === 0 ? '1' : '2'}
                </span>
              </div>

              <h2 className="text-base font-bold text-heading mb-3">{dept.name}</h2>

              {/* Department Head */}
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                  {dept.departmentHead.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="text-xs font-bold text-heading">{dept.departmentHead}</p>
                  <p className="text-[10px] text-secondary">
                    {dept.headCredentials || 'PhD Stanford • 14 yrs tenure'}
                  </p>
                  <span className="text-[9px] font-semibold text-primary uppercase">
                    {dept.headTitle || 'Head of Department'}
                  </span>
                </div>
              </div>

              {/* Counts Grid */}
              <div className="grid grid-cols-3 gap-2 text-center py-2 border-y border-border mb-3 text-xs">
                <div>
                  <p className="font-bold text-heading text-sm">{dept.studentsCount || 824}</p>
                  <p className="text-[10px] text-secondary">Students</p>
                </div>
                <div>
                  <p className="font-bold text-heading text-sm">{dept.facultyCount || 16}</p>
                  <p className="text-[10px] text-secondary">Faculty</p>
                </div>
                <div>
                  <p className="font-bold text-heading text-sm">{dept.programsCount || 4}</p>
                  <p className="text-[10px] text-secondary">Programs</p>
                </div>
              </div>

              {/* Extra details */}
              <div className="space-y-1.5 text-xs text-secondary mb-4">
                <p className="text-[11px] text-body line-clamp-1">
                  🔬 {dept.description || 'Specialized Computing Labs, AI Media Lab'}
                </p>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <Mail className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                  <span className="truncate">{dept.email || `${dept.code.toLowerCase()}@edumanage.edu`}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                  <span>{dept.location || 'Building B, Floor 3'}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-3 border-t border-border">
              <button
                onClick={() => toast(`Viewing detailed prospectus for ${dept.name}`, { icon: '🏛️' })}
                className="flex-1 py-1.5 text-xs font-semibold text-primary bg-primary-light hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
              >
                View Department
              </button>
              <button
                onClick={() => openEditModal(dept)}
                className="px-3 py-1.5 text-xs font-semibold text-body border border-border hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              >
                Edit Settings
              </button>
              <button
                onClick={() => setDeleteId(dept._id)}
                className="p-1.5 text-secondary hover:text-danger hover:bg-danger-light rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* 6th Card: Charter New Division Card */}
        <div
          onClick={() => setIsAddModalOpen(true)}
          className="bg-card-bg rounded-xl border-2 border-dashed border-purple-200 p-6 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-purple-50/20 transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-heading mb-1">Charter New Division</h3>
          <p className="text-xs text-secondary max-w-xs mb-4">
            Initiate formal proposal for new departmental creation, curriculum design, and budget assignment.
          </p>
          <button className="px-4 py-2 text-xs font-semibold text-primary bg-white border border-primary/30 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
            Create Academic Division
          </button>
        </div>
      </div>

      {/* Resource Allocation Summary Table */}
      <div className="bg-card-bg rounded-xl border border-border p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-heading">Department Resource Allocation Summary</h3>
            <p className="text-xs text-secondary">
              Annual operating fiscal year AY 24-25, teaching ratios, and dedicated research grants.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-body border border-border rounded-lg hover:bg-gray-50"
            >
              <Download className="w-3.5 h-3.5 text-secondary" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-[11px] font-bold text-secondary uppercase tracking-wider">
                <th className="pb-3 px-3">Department Name</th>
                <th className="pb-3 px-3">Budget AY 24-25</th>
                <th className="pb-3 px-3">Faculty-to-Student</th>
                <th className="pb-3 px-3">Research Grants</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {departments.map((dept) => (
                <tr key={dept._id} className="hover:bg-gray-50/60">
                  <td className="py-3 px-3">
                    <p className="font-semibold text-heading">{dept.name}</p>
                    <span className="text-[10px] text-secondary font-mono">{dept.code}</span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-heading">
                    ${dept.budget?.toLocaleString() || '1,850,000'}
                  </td>
                  <td className="py-3 px-3 text-secondary">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
                      1:{Math.round((dept.studentsCount || 800) / (dept.facultyCount || 16))}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-primary">
                    {dept.researchGrants || '$870,000 (NSF / DARPA)'}
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status="Active" />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => openEditModal(dept)}
                      className="p-1.5 text-secondary hover:text-primary rounded"
                      title="Edit Department"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-secondary pt-4 border-t border-border mt-3 gap-2">
          <span>Showing all {departments.length} board departments • Total Operating Budget: <strong>${totalBudget > 0 ? totalBudget.toLocaleString() : '5,850,000'}</strong></span>
          <span className="font-medium text-slate-500">Next Academic Audit: Dec 15, 2024</span>
        </div>
      </div>

      {/* Add Department Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Academic Department"
        size="md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Department Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Faculty of Architecture"
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Department Code *</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. ARCH-01"
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Department Head *</label>
              <input
                type="text"
                required
                value={formData.departmentHead}
                onChange={(e) => setFormData({ ...formData, departmentHead: e.target.value })}
                placeholder="e.g. Prof. David Miller"
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Head Credentials</label>
              <input
                type="text"
                value={formData.headCredentials}
                onChange={(e) => setFormData({ ...formData, headCredentials: e.target.value })}
                placeholder="e.g. PhD MIT • 10 yrs tenure"
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Campus Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Tower D, Floor 2"
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Operating Budget ($)</label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-heading mb-1">Description / Key Labs</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. 4 Design Studios, Virtual Reality Prototyping Unit"
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
              Charter Department
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Department Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Department: ${selectedDept?.name}`}
        size="md"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Department Head</label>
              <input
                type="text"
                required
                value={formData.departmentHead}
                onChange={(e) => setFormData({ ...formData, departmentHead: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Head Credentials</label>
              <input
                type="text"
                value={formData.headCredentials}
                onChange={(e) => setFormData({ ...formData, headCredentials: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Faculty Count</label>
              <input
                type="number"
                value={formData.facultyCount}
                onChange={(e) => setFormData({ ...formData, facultyCount: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Students Count</label>
              <input
                type="number"
                value={formData.studentsCount}
                onChange={(e) => setFormData({ ...formData, studentsCount: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Budget ($)</label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-heading mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
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
              Update Department
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Academic Department"
        message="Are you sure you want to delete this department? All associated curricula linkages will need reassignment."
        confirmText="Confirm Delete"
      />
    </div>
  );
};

export default Departments;

