import { useState, useEffect } from 'react';
import {
  HelpCircle, Search, BookOpen, Video, Ticket, Shield,
  MessageSquare, Phone, Mail, AlertTriangle, ChevronDown,
  ChevronUp, ExternalLink, Plus, CheckCircle2, Clock
} from 'lucide-react';
import { supportService } from '../../services';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const HelpSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const [ticketForm, setTicketForm] = useState({
    title: '',
    description: '',
    category: 'Technical',
    priority: 'Medium',
  });

  const faqs = [
    {
      q: 'How do I reverse an erroneously locked semester grade tabulation?',
      a: 'Semester grade locks are cryptographically recorded once the dean authorizes digital signing. To request a retroactive unlock, submit a formal re-evaluation memo from your Faculty Department Head. Once approved, the Super Administrator can enable a 48-hour temporary unlock window under Settings > Academic Grading & Credit Policies.',
    },
    {
      q: 'How are weighted GPA and CGPA calculated under the Autonomous University format?',
      a: 'GPA is computed using a 4.00 standard credit weight: Grade Points = (Credits × Course Point Value). The semester GPA equals Total Grade Points divided by Total Enrolled Credits. Scores of 90%+ receive an A+ (4.0), 80-89% receive an A (4.0), 70-79% receive a B+ (3.5), down to C (2.0 at 40%), with sub-40% marked as Backlog / F.',
    },
    {
      q: 'Can I assign custom permission roles to Assistant Registrars?',
      a: 'Yes. In Settings > Roles & Access Control, select Registrar Officers and click Edit Permissions. You can configure granular access grants for Transcript Verification, Roll Call Auditing, and Admissions Processing without granting examination lock release privileges.',
    },
    {
      q: 'How do I configure automated 75% attendance warning notifications for students?',
      a: 'Attendance compliance monitoring runs automatically at 23:59 daily. Any student whose cumulative lecture attendance drops below 75.0% receives an automated alert email and SMS, and a corresponding warning notice is attached to the Guardian contact dossier.',
    },
  ];

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await supportService.getTickets();
      setTickets(res.data.data || []);
    } catch (err) {
      console.error('Failed to load tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!ticketForm.title || !ticketForm.description) {
      toast.error('Please enter ticket title and description.');
      return;
    }
    try {
      await supportService.createTicket(ticketForm);
      toast.success('Support ticket submitted to Campus IT Desk!');
      setIsTicketModalOpen(false);
      setTicketForm({ title: '', description: '', category: 'Technical', priority: 'Medium' });
      fetchTickets();
    } catch (err) {
      toast.error('Failed to submit ticket');
    }
  };

  const pendingCount = tickets.filter((t) => t.status === 'Open' || t.status === 'In Progress').length;
  const resolvedCount = tickets.filter((t) => t.status === 'Resolved' || t.status === 'Closed').length;

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-primary bg-primary-light px-2.5 py-0.5 rounded uppercase tracking-wider mb-1.5 inline-block">
            SYSTEM HELP & SUPPORT HUB
          </span>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-heading">Help & Support Center</h1>
          <p className="text-xs text-secondary mt-0.5">
            Access system-wide documentation, video walkthroughs, monitor active IT service tickets, and communicate directly with academic engineers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Status: 99.98% Operational
          </div>
          <button
            onClick={() => setIsTicketModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-hover rounded-lg shadow-md shadow-primary/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            + SUBMIT IT TICKET
          </button>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="bg-card-bg rounded-xl border border-border p-5 text-center space-y-3">
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guides, formula syntax, API endpoints, error codes... (Press '/' to focus)"
            className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-body placeholder:text-secondary shadow-sm"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-secondary font-medium">SUGGESTED:</span>
          {['Student Admissions', 'Grading Formulas', 'Attendance Sync', 'FERPA & Security', 'User Permissions'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearch(tag)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-teal-50 hover:text-primary rounded-lg text-secondary text-[11px] font-medium transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Knowledge / Resource Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card-bg rounded-xl border border-border p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-primary flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-secondary uppercase">150+ ARTICLES</span>
            <h3 className="text-sm font-bold text-heading mt-1 mb-1">Knowledge Base & Guides</h3>
            <p className="text-xs text-secondary leading-relaxed mb-4">
              Step-by-step institutional blueprints for registrars, faculty, and IT admins.
            </p>
          </div>
          <button
            onClick={() => toast('Knowledge Base repository opened.', { icon: '📚' })}
            className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
          >
            Explore Library →
          </button>
        </div>

        <div className="bg-card-bg rounded-xl border border-border p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
              <Video className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-secondary uppercase">24 MASTERCLASSES</span>
            <h3 className="text-sm font-bold text-heading mt-1 mb-1">Video Walkthroughs</h3>
            <p className="text-xs text-secondary leading-relaxed mb-4">
              Screen-recorded workflows: semester curve modeling, audit locking, and attendance devices.
            </p>
          </div>
          <button
            onClick={() => toast('Video walkthrough library loaded.', { icon: '🎥' })}
            className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
          >
            Watch sessions →
          </button>
        </div>

        <div className="bg-card-bg rounded-xl border border-border p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
              <Ticket className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-secondary uppercase">LIVE QUEUE</span>
            <h3 className="text-sm font-bold text-heading mt-1 mb-1">Ticketing & Support</h3>
            <p className="text-xs text-secondary leading-relaxed mb-4">
              Dispatch infrastructure errors, query synchronization bugs, and database migrations.
            </p>
          </div>
          <button
            onClick={() => setIsTicketModalOpen(true)}
            className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
          >
            Manage Inquiries →
          </button>
        </div>

        <div className="bg-card-bg rounded-xl border border-border p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-secondary uppercase">ISO & FERPA</span>
            <h3 className="text-sm font-bold text-heading mt-1 mb-1">Compliance Enclave</h3>
            <p className="text-xs text-secondary leading-relaxed mb-4">
              Audit logging requirements, student record retention policies, and data export agreements.
            </p>
          </div>
          <button
            onClick={() => toast('Compliance enclave policies certified for NAAC.', { icon: '🛡️' })}
            className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
          >
            Review policies →
          </button>
        </div>
      </div>

      {/* Main Grid: Active Tickets (Left) + Direct Assistance & Emergency (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Administrative Tickets */}
        <div className="lg:col-span-8 bg-card-bg rounded-xl border border-border p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <div>
                <h3 className="text-sm font-bold text-heading flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                  Active Administrative Tickets
                </h3>
                <p className="text-xs text-secondary">
                  Logged service incidents attributed to Dean of Academic Affairs (Dr. Elena Vance)
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                  {pendingCount} Pending
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {resolvedCount} Resolved
                </span>
              </div>
            </div>

            {loading ? (
              <LoadingSpinner text="Querying active IT dispatch queue..." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border text-[11px] font-bold text-secondary uppercase tracking-wider">
                      <th className="pb-3 px-3">Ticket ID</th>
                      <th className="pb-3 px-3">Subject & Service Scope</th>
                      <th className="pb-3 px-3">Priority</th>
                      <th className="pb-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-xs">
                    {(tickets.length ? tickets : [
                      { _id: '1', title: 'Grading server timeout on large batch (+500 students)', description: 'Auto-batch marks ingestion engine failed during bulk computation for CS-301', priority: 'High', status: 'Open' },
                      { _id: '2', title: 'App faculty SSO provisioning sync with Google Workspace', description: 'Identity provider directory integration is returning authentication mismatch', priority: 'Medium', status: 'In Progress' },
                      { _id: '3', title: 'Automated attendance scanner hardware integration query', description: 'RFID barcode scanner gate driver needs firmware update for semester session', priority: 'Low', status: 'Resolved' },
                    ]).map((t, idx) => (
                      <tr key={t._id} className="hover:bg-gray-50/60">
                        <td className="py-3 px-3 font-mono font-bold text-primary">
                          #TK-0{182 + idx * 75}
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-semibold text-heading">{t.title}</p>
                          <p className="text-[11px] text-secondary line-clamp-1">{t.description}</p>
                        </td>
                        <td className="py-3 px-3">
                          <StatusBadge status={t.priority} />
                        </td>
                        <td className="py-3 px-3">
                          <StatusBadge status={t.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-border mt-3 flex items-center justify-between text-xs text-secondary">
            <span>Showing {tickets.length} of 18 reports in dispatch queue</span>
            <button
              onClick={() => toast('Displaying entire campus ticket ledger.', { icon: '📋' })}
              className="text-primary font-semibold hover:underline"
            >
              View complete ticket registry →
            </button>
          </div>
        </div>

        {/* Right Column: Direct Assistance & Emergency Escalation */}
        <div className="lg:col-span-4 space-y-6">
          {/* Direct Assistance */}
          <div className="bg-card-bg rounded-xl border border-border p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-sm font-bold text-heading">Direct Assistance</h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                &lt; 2m SLA
              </span>
            </div>
            <p className="text-xs text-secondary">
              Connect immediately with senior academic systems architects and IT dispatch officers.
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => toast('Academic Chat session connected to Staff Support.', { icon: '💬' })}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-teal-50/70 border border-teal-100 hover:bg-teal-100/70 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-heading">Live Academic Chat</h4>
                    <p className="text-[10px] text-secondary">4 Support Engineers online</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-white bg-primary px-2 py-0.5 rounded">
                  Start
                </span>
              </button>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-heading">+1 (800) 555-CAMPUS</h4>
                  <p className="text-[10px] text-secondary">24/7 IT Infrastructure Desk</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-heading">it@edumanage-ops.metro</h4>
                  <p className="text-[10px] text-secondary">Priority Slack Channel Integration</p>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Escalation */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Emergency Escalation
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              For exam portal downtimes, grading lock failures, or mission-critical SIS outages, alert the registrar's dedicated incident response team.
            </p>
            <button
              onClick={() => toast.error('Emergency incident dispatch signal transmitted to on-call engineers.')}
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              Trigger Incident Page
            </button>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="bg-card-bg rounded-xl border border-border p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border gap-2">
          <div>
            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
              INSTITUTIONAL FAQS
            </span>
            <h3 className="text-base font-bold text-heading">Standard Operating Procedures</h3>
            <p className="text-xs text-secondary mt-0.5">
              Frequently queried issues and configuration guidelines for faculty leadership.
            </p>
          </div>
          <button
            onClick={() => toast('Full 64-topic SOP knowledge index loaded.', { icon: '📖' })}
            className="text-xs text-primary font-bold hover:underline"
          >
            Browse complete 64-topic index →
          </button>
        </div>

        <div className="space-y-3 pt-2">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="border border-border rounded-xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-4 bg-slate-50/60 hover:bg-slate-100/70 transition-colors text-left"
                >
                  <span className="text-xs font-bold text-heading">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-secondary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-secondary flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 bg-white border-t border-border text-xs text-body leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit Ticket Modal */}
      <Modal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        title="Submit New IT Service Ticket"
        size="md"
      >
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-heading mb-1">Issue Summary *</label>
            <input
              type="text"
              required
              value={ticketForm.title}
              onChange={(e) => setTicketForm({ ...ticketForm, title: e.target.value })}
              placeholder="e.g. Student attendance device failing RFID sync"
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Category</label>
              <select
                value={ticketForm.category}
                onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Technical">Technical</option>
                <option value="Academic">Academic</option>
                <option value="Administrative">Administrative</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Priority</label>
              <select
                value={ticketForm.priority}
                onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-heading mb-1">Detailed Description *</label>
            <textarea
              rows={4}
              required
              value={ticketForm.description}
              onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
              placeholder="Provide exact error code, affected student roll numbers, or reproduction steps..."
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setIsTicketModalOpen(false)}
              className="px-4 py-2 text-xs font-medium border border-border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-primary text-white rounded-lg hover:bg-primary-hover shadow-sm"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default HelpSupport;

