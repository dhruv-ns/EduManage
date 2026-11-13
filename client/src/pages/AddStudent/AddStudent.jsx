import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload, User, BookOpen, ShieldCheck, CheckCircle2,
  Calendar, AlertCircle, Sparkles, RefreshCw
} from 'lucide-react';
import { studentService, courseService, departmentService } from '../../services';
import FormInput from '../../components/common/FormInput';
import SelectInput from '../../components/common/SelectInput';
import toast from 'react-hot-toast';

const AddStudent = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Generate a random roll number
  const generateRoll = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `EM-2024-${randomNum}`;
  };

  const generateReg = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    return `REG-2024-BCA-${randomNum}`;
  };

  const [formData, setFormData] = useState({
    // Step 1: Personal
    fullName: '',
    dateOfBirth: '2004-05-19',
    gender: 'Male',
    phone: '',
    email: '',
    address: '',
    profileImage: '',

    // Step 2: Academic
    rollNumber: generateRoll(),
    registrationNumber: generateReg(),
    course: '',
    department: '',
    semester: 1,
    section: 'Section A',
    admissionDate: new Date().toISOString().split('T')[0],

    // Step 3: Guardian & Health
    guardianName: '',
    motherName: '',
    emergencyContact: '',
    previousQualification: 'High School Diploma / Grade 12 (GPA 3.8)',
    bloodGroup: 'O+',
    medicalInfo: 'No chronic restrictions. Verified vaccination certificate submitted.',
    hasMedicalCondition: false,
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const [cRes, dRes] = await Promise.all([
        courseService.getAll(),
        departmentService.getAll(),
      ]);
      const fetchedCourses = cRes.data.data || [];
      const fetchedDepts = dRes.data.data || [];
      setCourses(fetchedCourses);
      setDepartments(fetchedDepts);

      if (fetchedCourses.length > 0) {
        setFormData((prev) => ({
          ...prev,
          course: fetchedCourses[0]._id,
          department: fetchedDepts[0]?._id || '',
        }));
      }
    } catch (err) {
      console.error('Failed to load courses or departments:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be under 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.rollNumber) {
      toast.error('Please complete all required fields.');
      return;
    }

    try {
      setLoading(true);
      await studentService.create(formData);
      toast.success(`Student registered successfully! Roll: ${formData.rollNumber}`);
      navigate('/students');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to register student record.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem('student_form_draft', JSON.stringify(formData));
    toast.success('Registration form draft saved locally.');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-heading">Add New Student</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 uppercase tracking-wide">
              New Intake
            </span>
          </div>
          <p className="text-xs text-secondary mt-0.5">
            Enter the student's information to create a new record across registered academic departments.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-semibold text-secondary block">TARGET INTAKE</span>
          <span className="text-xs font-bold text-primary bg-primary-light px-3 py-1 rounded-lg">
            AY 2024-2025 • Fall
          </span>
        </div>
      </div>

      {/* 3-Column Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SECTION 1: Personal Information */}
          <div className="bg-card-bg rounded-xl border border-border p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  <h2 className="text-sm font-bold text-heading">Personal Information</h2>
                </div>
                <span className="text-[10px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded">
                  Step 01
                </span>
              </div>

              {/* Photo Upload Area */}
              <div className="mb-5 text-center">
                <div className="w-24 h-24 mx-auto rounded-full border-2 border-dashed border-primary/40 p-1 flex items-center justify-center relative overflow-hidden bg-slate-50 mb-2">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <div className="text-center p-2">
                      <Upload className="w-6 h-6 text-primary mx-auto mb-1 opacity-70" />
                      <span className="text-[9px] text-secondary block">Upload Photo</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-secondary">
                  PNG, JPG up to 2MB (Square ratio recommended)
                </p>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => { setImagePreview(null); setFormData((prev) => ({ ...prev, profileImage: '' })); }}
                    className="text-[10px] text-danger hover:underline mt-1 cursor-pointer"
                  >
                    Discard File
                  </button>
                )}
              </div>

              {/* Form Fields */}
              <FormInput
                label="Full Legal Name"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="e.g. Alexander Hubert Wright"
              />

              <FormInput
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={handleInputChange}
              />

              <div className="mb-4">
                <label className="block text-xs font-semibold text-heading mb-1.5">
                  Gender Identity <span className="text-danger">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['Male', 'Female', 'Non-Binary', 'Prefer not to say'].map((gen) => (
                    <label key={gen} className="flex items-center gap-2 p-2 border border-border rounded-lg cursor-pointer hover:bg-slate-50">
                      <input
                        type="radio"
                        name="gender"
                        value={gen}
                        checked={formData.gender === gen}
                        onChange={handleInputChange}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-body text-[11px]">{gen}</span>
                    </label>
                  ))}
                </div>
              </div>

              <FormInput
                label="Phone Number"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 234-5678"
              />

              <FormInput
                label="Institutional Email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="a.wright@edumanage.edu"
              />

              <FormInput
                label="Permanent Address"
                name="address"
                type="textarea"
                required
                value={formData.address}
                onChange={handleInputChange}
                placeholder="742 Evergreen Terrace, Springfield, OR 97477"
              />
            </div>
          </div>

          {/* SECTION 2: Academic Information */}
          <div className="bg-card-bg rounded-xl border border-border p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <h2 className="text-sm font-bold text-heading">Academic Information</h2>
                </div>
                <span className="text-[10px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded">
                  Step 02
                </span>
              </div>

              {/* Auto-Assigned Roll Box */}
              <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 mb-4 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wide">
                    ASSIGNED STUDENT ROLL
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, rollNumber: generateRoll() }))}
                      className="p-1 hover:bg-purple-200/50 rounded text-purple-700"
                      title="Regenerate"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[9px] font-bold bg-primary text-white px-1.5 py-0.5 rounded">
                      Auto-assigned
                    </span>
                  </div>
                </div>
                <p className="text-2xl font-black text-primary font-mono mt-1 tracking-tight">
                  {formData.rollNumber}
                </p>
                <p className="text-[10px] text-purple-700 mt-1">
                  System identifier will lock all transcript matrices.
                </p>
              </div>

              <FormInput
                label="Registration Number"
                name="registrationNumber"
                required
                value={formData.registrationNumber}
                onChange={handleInputChange}
                placeholder="REG-2024-BCA-002"
              />

              <SelectInput
                label="Enrolling Program / Course"
                name="course"
                required
                value={formData.course}
                onChange={handleInputChange}
                options={courses.map((c) => ({ value: c._id, label: c.name }))}
              />

              <SelectInput
                label="Academic Department"
                name="department"
                required
                value={formData.department}
                onChange={handleInputChange}
                options={departments.map((d) => ({ value: d._id, label: d.name }))}
              />

              <div className="grid grid-cols-2 gap-3">
                <SelectInput
                  label="Starting Term"
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  options={[
                    { value: 1, label: 'Semester 1 (Fall)' },
                    { value: 2, label: 'Semester 2 (Spring)' },
                    { value: 3, label: 'Semester 3 (Fall)' },
                  ]}
                />
                <FormInput
                  label="Academic Year"
                  name="academicYear"
                  value="AY 2024-2025"
                  disabled
                />
              </div>

              <FormInput
                label="Official Admission Date"
                name="admissionDate"
                type="date"
                required
                value={formData.admissionDate}
                onChange={handleInputChange}
              />
            </div>

            <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs text-secondary leading-relaxed">
              ℹ Departmental curriculum and semester credits will be provisioned directly upon submission.
            </div>
          </div>

          {/* SECTION 3: Guardian & Health Information */}
          <div className="bg-card-bg rounded-xl border border-border p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <h2 className="text-sm font-bold text-heading">Guardian & Health</h2>
                </div>
                <span className="text-[10px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded">
                  Step 03
                </span>
              </div>

              <FormInput
                label="Father / Primary Guardian Name"
                name="guardianName"
                required
                value={formData.guardianName}
                onChange={handleInputChange}
                placeholder="e.g. Robert Wright"
              />

              <FormInput
                label="Mother's Legal Name"
                name="motherName"
                value={formData.motherName}
                onChange={handleInputChange}
                placeholder="e.g. Eleanor Wright"
              />

              <FormInput
                label="Emergency Contact Phone"
                name="emergencyContact"
                required
                value={formData.emergencyContact}
                onChange={handleInputChange}
                placeholder="+1 (555) 891-3041"
              />

              <FormInput
                label="Previous Qualification"
                name="previousQualification"
                value={formData.previousQualification}
                onChange={handleInputChange}
                placeholder="High School Diploma / Grade 12 (GPA 3.8)"
              />

              <div className="grid grid-cols-2 gap-3">
                <SelectInput
                  label="Blood Group"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']}
                />
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-heading mb-1.5">
                    Medical Attention
                  </label>
                  <label className="flex items-center gap-2 p-2.5 border border-border rounded-lg text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      name="hasMedicalCondition"
                      checked={formData.hasMedicalCondition}
                      onChange={handleInputChange}
                      className="text-primary rounded focus:ring-primary"
                    />
                    <span className="text-secondary text-[11px]">Asthma / Allergies</span>
                  </label>
                </div>
              </div>

              <FormInput
                label="Medical & Special Accommodations"
                name="medicalInfo"
                type="textarea"
                value={formData.medicalInfo}
                onChange={handleInputChange}
                placeholder="No chronic restrictions. Verified vaccination certificate submitted."
              />
            </div>

            {/* Academic Audit Pass Banner */}
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  <strong>Academic Audit Pass:</strong> Prerequisites certified by Registrar
                </span>
              </div>
              <span className="font-bold text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Ready
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Submission Actions Bar */}
        <div className="bg-card-bg rounded-xl border border-border p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-secondary">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>All mandatory fields marked with an asterisk (*) are validated across mutation actions.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => navigate('/students')}
              className="px-4 py-2 text-xs font-semibold text-body border border-border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-4 py-2 text-xs font-semibold text-primary bg-primary-light hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-lg shadow-md shadow-primary/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Register Student'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;

