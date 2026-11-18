import { useState, useEffect } from 'react';
import {
  Award, FileSpreadsheet, Download, Sliders, CheckCircle2,
  AlertCircle, Shield, Edit3, Save, Check, RefreshCw,
  Search, Users, Star, Lock
} from 'lucide-react';
import { resultService, courseService, studentService } from '../../services';
import StatCard from '../../components/common/StatCard';
import StudentAvatar from '../../components/common/StudentAvatar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import Modal from '../../components/common/Modal';
import { exportToCsv } from '../../utils/exportCsv';
import toast from 'react-hot-toast';

const Results = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSemester, setSelectedSemester] = useState(3);
  const [selectedExamType, setSelectedExamType] = useState('End Term');
  const [selectedSubject, setSelectedSubject] = useState('CS-301 Design & Analysis of Algorithms');

  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [search, setSearch] = useState('');

  // Editable rows map
  const [editState, setEditState] = useState({});
  const [showCurveTool, setShowCurveTool] = useState(false);
  const [curveAdjustment, setCurveAdjustment] = useState(2);

  const subjects = [
    'CS-301 Design & Analysis of Algorithms',
    'CS-304 Relational Database Systems',
    'CS-305 Modern Web Technologies',
    'CS-312 Computer Networks & Protocols',
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      loadResults();
    }
  }, [selectedCourse, selectedSemester, selectedSubject, selectedExamType]);

  const fetchCourses = async () => {
    try {
      const res = await courseService.getAll();
      const list = res.data.data || [];
      setCourses(list);
      if (list.length > 0) {
        setSelectedCourse(list[0]._id);
      }
    } catch (err) {
      console.error('Failed to load courses:', err);
    }
  };

  const loadResults = async () => {
    try {
      setLoading(true);
      const [resRes, stuRes] = await Promise.all([
        resultService.getAll({
          course: selectedCourse,
          semester: selectedSemester,
          subject: selectedSubject,
        }),
        studentService.getAll({ course: selectedCourse, limit: 50 }),
      ]);

      const fetchedResults = resRes.data.data || [];
      const fetchedStudents = stuRes.data.data || [];
      setStudents(fetchedStudents);

      // Merge results with student roster
      const merged = fetchedStudents.map((s) => {
        const found = fetchedResults.find((r) => (r.student?._id || r.student) === s._id);
        if (found) {
          return found;
        }
        // Initialize default record
        return {
          _id: `temp-${s._id}`,
          student: s,
          course: selectedCourse,
          subject: selectedSubject,
          semester: selectedSemester,
          internalMarks: 22,
          midTermMarks: 26,
          endTermMarks: 40,
          totalMarks: 88,
          percentage: 88,
          grade: 'A',
          gpa: 4.0,
          resultStatus: 'Published',
        };
      });

      // Sort by total marks descending for rank
      merged.sort((a, b) => (b.totalMarks || 0) - (a.totalMarks || 0));
      setResults(merged);

      // Init edit map
      const eMap = {};
      merged.forEach((r) => {
        eMap[r.student._id] = {
          internalMarks: r.internalMarks || 20,
          midTermMarks: r.midTermMarks || 25,
          endTermMarks: r.endTermMarks || 40,
        };
      });
      setEditState(eMap);
    } catch (err) {
      console.error('Failed to load results:', err);
      toast.error('Failed to load examination tabulation');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (internal, mid, end) => {
    const total = Number(internal) + Number(mid) + Number(end);
    let grade = 'F';
    let gpa = 0;
    let classification = 'Backlog Review';

    if (total >= 90) {
      grade = 'A+';
      gpa = 4.0;
      classification = 'Passed with Distinction';
    } else if (total >= 80) {
      grade = 'A';
      gpa = 4.0;
      classification = 'Passed with Distinction';
    } else if (total >= 70) {
      grade = 'B+';
      gpa = 3.5;
      classification = 'Passed';
    } else if (total >= 60) {
      grade = 'B';
      gpa = 3.0;
      classification = 'Passed';
    } else if (total >= 50) {
      grade = 'C+';
      gpa = 2.5;
      classification = 'Passed';
    } else if (total >= 40) {
      grade = 'C';
      gpa = 2.0;
      classification = 'Passed';
    } else {
      grade = 'F';
      gpa = 0;
      classification = 'Backlog Review';
    }

    return { total, grade, gpa, classification };
  };

  const handleMarkChange = (studentId, field, value) => {
    setEditState((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: Number(value) || 0,
      },
    }));
  };

  const handleSaveRow = async (item) => {
    const studentId = item.student._id;
    const marks = editState[studentId];
    const { total, grade, gpa } = calculateTotal(
      marks.internalMarks,
      marks.midTermMarks,
      marks.endTermMarks
    );

    try {
      const payload = {
        student: studentId,
        course: selectedCourse,
        subject: selectedSubject,
        semester: selectedSemester,
        examType: selectedExamType,
        internalMarks: marks.internalMarks,
        midTermMarks: marks.midTermMarks,
        endTermMarks: marks.endTermMarks,
        totalMarks: total,
        percentage: total,
        grade,
        gpa,
        resultStatus: total >= 40 ? 'Pass' : 'Fail',
      };

      await resultService.create([payload]);
      toast.success(`Grades saved for ${item.student.fullName}`);
      loadResults();
    } catch (err) {
      toast.error('Failed to save grade modification');
    }
  };

  const handlePublishResults = async () => {
    try {
      setPublishing(true);
      await resultService.publish({
        course: selectedCourse,
        semester: selectedSemester,
        subject: selectedSubject,
      });
      toast.success('Examination board results digitally signed & published to student portals!');
      loadResults();
    } catch (err) {
      toast.error('Failed to publish results');
    } finally {
      setPublishing(false);
    }
  };

  const applyCurveTool = () => {
    const updated = { ...editState };
    Object.keys(updated).forEach((id) => {
      updated[id].endTermMarks = Math.min(45, updated[id].endTermMarks + Number(curveAdjustment));
    });
    setEditState(updated);
    setShowCurveTool(false);
    toast.success(`Applied +${curveAdjustment} marks moderation curve across cohort.`);
  };

  const handleExportCSV = () => {
    if (!results.length) return;
    const dataToExport = results.map((r, idx) => {
      const marks = editState[r.student?._id] || r;
      const { total, grade, gpa, classification } = calculateTotal(
        marks.internalMarks,
        marks.midTermMarks,
        marks.endTermMarks
      );
      return {
        Rank: `#${idx + 1}`,
        RollNumber: r.student?.rollNumber,
        StudentName: r.student?.fullName,
        Subject: selectedSubject,
        Internal_25: marks.internalMarks,
        MidTerm_30: marks.midTermMarks,
        EndTerm_45: marks.endTermMarks,
        Total_100: total,
        Grade: grade,
        GPA: gpa,
        Classification: classification,
      };
    });
    exportToCsv(`Tabulation_Register_${selectedSubject.split(' ')[0]}`, dataToExport);
    toast.success('Official Tabulation Register exported as CSV');
  };

  const filteredResults = results.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.student?.fullName?.toLowerCase().includes(q) ||
      r.student?.rollNumber?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-primary bg-primary-light px-2.5 py-0.5 rounded uppercase tracking-wider mb-1.5 inline-block">
            OFFICIAL EXAMINATION BOARD EVALUATION
          </span>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-heading">
            Results & Examination Grading
          </h1>
          <p className="text-xs text-secondary mt-0.5">
            Enter examination scores, compute GPA/CGPA weights, evaluate semester transcripts, and publish official grades.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-body bg-white border border-border rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4 text-secondary" />
            Export Tabulation (CSV)
          </button>
          <button
            onClick={() => setShowCurveTool(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-primary bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
            Grade Curve Tool
          </button>
          <button
            onClick={handlePublishResults}
            disabled={publishing}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-hover rounded-lg shadow-md shadow-primary/25 transition-all cursor-pointer disabled:opacity-50"
          >
            <Award className="w-4 h-4" />
            {publishing ? 'Publishing...' : 'Publish Results'}
          </button>
        </div>
      </div>

      {/* Evaluation Context & Cohort Scope Filter */}
      <div className="bg-card-bg rounded-xl border border-border p-4 space-y-3">
        <p className="text-[11px] font-bold text-secondary uppercase tracking-wider">
          EVALUATION CONTEXT & COHORT SCOPE
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-secondary uppercase mb-1">Degree Program</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold text-heading bg-slate-50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {courses.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-secondary uppercase mb-1">Academic Term</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs font-semibold text-heading bg-slate-50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {[1, 2, 3, 4, 5, 6].map((s) => (
                <option key={s} value={s}>Semester {s} (Fall Examination)</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-secondary uppercase mb-1">Evaluation Mode</label>
            <select
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold text-heading bg-slate-50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="End Term">End-Term Examination (100 Marks)</option>
              <option value="Mid Term">Mid-Term Assessment (50 Marks)</option>
              <option value="Internal">Internal Continuous Evaluation (25 Marks)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-secondary uppercase mb-1">Module / Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold text-heading bg-slate-50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {subjects.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Class Average GPA"
          value="3.42 / 4.00"
          subtitle="+0.18 vs Semester 2"
          trend="+0.18"
          trendUp={true}
          icon={<Award className="w-5 h-5" />}
          color="primary"
        />
        <StatCard
          title="Passing Clearance"
          value="96.4% (155 / 160)"
          subtitle="8 Online Backlogs Pending Remedial"
          icon={<CheckCircle2 className="w-5 h-5" />}
          color="info"
        />
        <StatCard
          title="Cohort Benchmark"
          value="99 / 100"
          subtitle="Top Performer: Sophia Patel"
          icon={<Star className="w-5 h-5" />}
          color="warning"
        />
        <div className="bg-card-bg rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-secondary uppercase tracking-wide">Grade Spectrum</p>
            <span className="text-[10px] text-secondary font-bold">160 Enrolled</span>
          </div>
          <div className="flex items-center gap-1 h-3 rounded-full overflow-hidden bg-slate-100 my-2">
            <div className="bg-primary h-full" style={{ width: '18%' }} title="A+ (18%)"></div>
            <div className="bg-blue-500 h-full" style={{ width: '32%' }} title="A (32%)"></div>
            <div className="bg-emerald-500 h-full" style={{ width: '28%' }} title="B+ (28%)"></div>
            <div className="bg-amber-500 h-full" style={{ width: '14%' }} title="B (14%)"></div>
            <div className="bg-red-500 h-full" style={{ width: '8%' }} title="C/F (8%)"></div>
          </div>
          <div className="flex justify-between text-[10px] text-secondary">
            <span>A+ 18%</span>
            <span>A 32%</span>
            <span>B+ 28%</span>
            <span>B 14%</span>
            <span>C/F 8%</span>
          </div>
        </div>
      </div>

      {/* Student Grade Tabulation Register Table */}
      <div className="bg-card-bg rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-heading">Student Grade Tabulation Register</h3>
            <p className="text-xs text-secondary">Displaying cohort ranks & weighted grade breakdown</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter roll or name..."
              className="px-3 py-1.5 text-xs border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-body"
            />
            <span className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-bold">
              Standard: By Rank
            </span>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="Calculating weighted grades and class distribution..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-border text-[11px] font-bold text-secondary uppercase tracking-wider">
                  <th className="py-3 px-4">Rank & ID</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Internal (25)</th>
                  <th className="py-3 px-4">Mid-Term (30)</th>
                  <th className="py-3 px-4">End-Term (45)</th>
                  <th className="py-3 px-4">Total (100)</th>
                  <th className="py-3 px-4">Grade</th>
                  <th className="py-3 px-4">GPA</th>
                  <th className="py-3 px-4">Classification</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {filteredResults.map((item, idx) => {
                  const sId = item.student._id;
                  const marks = editState[sId] || {
                    internalMarks: item.internalMarks || 20,
                    midTermMarks: item.midTermMarks || 25,
                    endTermMarks: item.endTermMarks || 40,
                  };

                  const { total, grade, gpa, classification } = calculateTotal(
                    marks.internalMarks,
                    marks.midTermMarks,
                    marks.endTermMarks
                  );

                  const isFailing = total < 40;

                  return (
                    <tr key={sId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-primary font-mono">#{idx + 1}</span>
                          <span className="text-[11px] text-secondary font-mono">{item.student.rollNumber}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <StudentAvatar name={item.student.fullName} image={item.student.profileImage} size="sm" />
                          <div>
                            <p className="font-bold text-heading">{item.student.fullName}</p>
                            <p className="text-[10px] text-secondary">{item.student.section || 'Section A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          min="0"
                          max="25"
                          step="0.5"
                          value={marks.internalMarks}
                          onChange={(e) => handleMarkChange(sId, 'internalMarks', e.target.value)}
                          className="w-16 px-2 py-1 border border-border rounded text-center text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          min="0"
                          max="30"
                          step="0.5"
                          value={marks.midTermMarks}
                          onChange={(e) => handleMarkChange(sId, 'midTermMarks', e.target.value)}
                          className="w-16 px-2 py-1 border border-border rounded text-center text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          min="0"
                          max="45"
                          step="0.5"
                          value={marks.endTermMarks}
                          onChange={(e) => handleMarkChange(sId, 'endTermMarks', e.target.value)}
                          className="w-16 px-2 py-1 border border-border rounded text-center text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-black font-mono text-sm ${isFailing ? 'text-danger' : 'text-slate-800'}`}>
                          {total}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                          grade.startsWith('A')
                            ? 'bg-teal-100 text-teal-800'
                            : grade.startsWith('B')
                            ? 'bg-blue-100 text-blue-700'
                            : isFailing
                            ? 'bg-red-100 text-red-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {grade}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-heading">
                        {gpa.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          classification.includes('Distinction')
                            ? 'bg-teal-50 text-primary border border-teal-200'
                            : isFailing
                            ? 'bg-red-50 text-danger border border-red-200'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {classification}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleSaveRow(item)}
                          title="Save this record"
                          className="p-1.5 text-primary hover:bg-primary-light rounded transition-colors"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Verification & Digital Signature Footer */}
        <div className="p-4 bg-teal-50/50 border-t border-teal-100 flex flex-col md:flex-row md:items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-heading">
                Dean of Academic Affairs Approval Status: <span className="text-emerald-700">Verified & Digitally Signed ✓</span>
              </p>
              <p className="text-[11px] text-secondary">
                Signatory: <strong>Dr. Elena Vance</strong> • SHA-256 Checksum: 0x4f4C...8914B1 • Timestamp: Oct 28, 2024 at 18:42:01 UTC
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded">
              LOCK STATUS: ENROLLED AUDIT CLOSED
            </span>
          </div>
        </div>
      </div>

      {/* Grade Curve Moderation Modal */}
      <Modal
        isOpen={showCurveTool}
        onClose={() => setShowCurveTool(false)}
        title="Grade Curve & Moderation Tool"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-secondary">
            Apply automated grade moderation curve across the entire cohort ({results.length} students).
          </p>
          <div>
            <label className="block text-xs font-semibold text-heading mb-1">
              End-Term Curve Moderation (+Marks)
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={curveAdjustment}
              onChange={(e) => setCurveAdjustment(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setShowCurveTool(false)}
              className="px-3.5 py-2 text-xs font-medium border border-border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={applyCurveTool}
              className="px-4 py-2 text-xs font-semibold bg-primary text-white rounded-lg hover:bg-primary-hover shadow-sm"
            >
              Apply Moderation
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Results;

