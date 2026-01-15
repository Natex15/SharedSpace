import React, { useState, useEffect } from 'react';
import SampleImg from '../../assets/arts/ukiyo.jpg';
import './ModDashboardPage.css';
import API_BASE_URL from '../../apiConfig';
import { SuccessPopup } from '../../components/SuccessPopup';
import toast from 'react-hot-toast';

export function ModDashboardPage() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Challenge Form State
  const [challengeForm, setChallengeForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    criteriaTags: []
  });
  const [newTag, setNewTag] = useState({ name: '', points: 1 });

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    try {
      // Fetch users
      const usersResponse = await fetch(`${API_BASE_URL}/api/users/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        const formattedUsers = usersData.users
          .filter(user => user.userType !== 'admin')
          .map(user => ({
            id: user._id,
            username: user.username,
            email: user.email,
            type: user.userType === 'blocked' ? 'Blocked' : 'User',
            date: new Date(parseInt(user._id.substring(0, 8), 16) * 1000).toISOString().split('T')[0]
          }));
        setUsers(formattedUsers);
      }

      // Fetch reports
      const reportsResponse = await fetch(`${API_BASE_URL}/api/reports/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (reportsResponse.ok) {
        const reportsData = await reportsResponse.json();
        const formattedReports = reportsData.map(report => ({
          id: report._id,
          preview: report.artworkID?.imageURL || SampleImg,
          reason: report.reason,
          date: new Date(parseInt(report._id.substring(0, 8), 16) * 1000).toISOString().split('T')[0]
        }));
        setReports(formattedReports);
      }

      // Fetch challenges
      const challengesResponse = await fetch(`${API_BASE_URL}/api/challenges/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (challengesResponse.ok) {
        const challengesData = await challengesResponse.json();
        setChallenges(challengesData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddTag = () => {
    if (newTag.name) {
      setChallengeForm({
        ...challengeForm,
        criteriaTags: [...challengeForm.criteriaTags, newTag]
      });
      setNewTag({ name: '', points: 1 });
    }
  };

  const codeRemoveTag = (index) => {
    const updatedTags = challengeForm.criteriaTags.filter((_, i) => i !== index);
    setChallengeForm({ ...challengeForm, criteriaTags: updatedTags });
  };

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/challenges/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(challengeForm)
      });

      if (response.ok) {
        toast.success('New challenge published! 🏆');
        setChallengeForm({
          title: '',
          description: '',
          startDate: '',
          endDate: '',
          criteriaTags: []
        });
        fetchData();
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error creating challenge:', error);
      toast.error('Failed to create challenge');
    }
  };

  const handleUserAction = (userId, action) => {
    if (!action || action === 'ignore') {
      if (action === 'ignore') toast('Action dismissed');
      return;
    }

    toast((t) => (
      <span className="confirmation-toast">
        Are you sure you want to <b>{action}</b> this user?
        <div className="confirmation-buttons">
          <button
            className="confirm-yes"
            onClick={async () => {
              toast.dismiss(t.id);
              await executeUserAction(userId, action);
            }}
          >
            Yes
          </button>
          <button
            className="confirm-no"
            onClick={() => toast.dismiss(t.id)}
          >
            No
          </button>
        </div>
      </span>
    ), { duration: 5000, position: 'top-center' });
  };

  const executeUserAction = async (userId, action) => {
    const token = localStorage.getItem('token');
    try {
      if (action === 'ban') {
        const response = await fetch(`${API_BASE_URL}/api/users/ban/${userId}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          toast.success('User has been blocked 🚫');
          fetchData();
        } else {
          toast.error('Failed to ban user');
        }
      }
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const handleReportAction = (reportId, action) => {
    if (!action) return;

    if (action === 'ignore') {
      executeReportAction(reportId, action);
      return;
    }

    toast((t) => (
      <span className="confirmation-toast">
        Confirm <b>{action.replace('_', ' ')}</b>?
        <div className="confirmation-buttons">
          <button
            className="confirm-yes"
            onClick={async () => {
              toast.dismiss(t.id);
              await executeReportAction(reportId, action);
            }}
          >
            Yes
          </button>
          <button
            className="confirm-no"
            onClick={() => toast.dismiss(t.id)}
          >
            No
          </button>
        </div>
      </span>
    ), { duration: 5000, position: 'top-center' });
  };

  const executeReportAction = async (reportId, action) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports/action/${reportId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: action })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || 'Action completed');
        fetchData();
      } else {
        toast.error('Action failed');
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  return (
    <div className="mod-dashboard-page">
      <div className="mod-layout">
        <div className="mod-sidebar">
          <div className="card-shadow sidebar-panel">
            <div className="panel-header">Panel</div>
            <button
              className={`mod-nav-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
            <button
              className={`mod-nav-btn ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              Reports
            </button>
            <button
              className={`mod-nav-btn ${activeTab === 'challenges' ? 'active' : ''}`}
              onClick={() => setActiveTab('challenges')}
            >
              Challenges
            </button>
          </div>
        </div>

        <div className="mod-main">
          <div className="card-shadow content-card">
            {loading ? (
              <div className="mod-loading">
                <div className="spinner"></div>
                <p>Retrieving database records...</p>
              </div>
            ) : activeTab === 'users' ? (
              <>
                <div className="table-header">
                  <span>Username</span>
                  <span>Email</span>
                  <span>Account Type</span>
                  <span>Creation Date</span>
                  <span>Action</span>
                </div>

                <div className="table-body">
                  {users.length === 0 ? (
                    <p className="empty-state">No users found in records.</p>
                  ) : users.map(user => (
                    <div key={user.id} className="table-row">
                      <span className="username-cell">{user.username}</span>
                      <span className="email-cell">{user.email}</span>
                      <span className="type-cell">{user.type}</span>
                      <span>{user.date}</span>

                      <div className="select-wrapper">
                        <select
                          className="action-select"
                          onChange={(e) => handleUserAction(user.id, e.target.value)}
                          value=""
                        >
                          <option value="">Select</option>
                          <option value="ban" disabled={user.type === 'Blocked'}>Ban User</option>
                          <option value="ignore">Dismiss</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : activeTab === 'reports' ? (
              <>
                <div className="table-header">
                  <span>Report ID</span>
                  <span>Preview</span>
                  <span>Reason</span>
                  <span>Posted Date</span>
                  <span>Action</span>
                </div>

                <div className="table-body">
                  {reports.length === 0 ? (
                    <p className="empty-state">No reports to display.</p>
                  ) : reports.map(report => (
                    <div key={report.id} className="table-row">
                      <span className="report-id-cell">{report.id.substring(18)}</span>
                      <div className="preview-container">
                        <img src={report.preview} alt="Report Preview" className="report-preview-img" />
                      </div>
                      <span className="reason-cell">{report.reason}</span>
                      <span>{report.date}</span>

                      <div className="select-wrapper">
                        <select
                          className="action-select"
                          onChange={(e) => handleReportAction(report.id, e.target.value)}
                          value=""
                        >
                          <option value="">Select</option>
                          <option value="remove_content">Remove Art</option>
                          <option value="ban_user">Ban Owner</option>
                          <option value="ignore">Dismiss Report</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="challenges-tab">
                <div className="challenge-form-wrapper">
                  <h2 className="section-title">Create New Challenge</h2>
                  <form onSubmit={handleCreateChallenge} className="challenge-form-aesthetic">
                    <div className="form-grid">
                      <div className="form-group main-group">
                        <label>Challenge Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Midnight Sketches"
                          value={challengeForm.title}
                          onChange={(e) => setChallengeForm({ ...challengeForm, title: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group main-group">
                        <label>Description</label>
                        <textarea
                          placeholder="Describe the challenge rules and inspiration..."
                          value={challengeForm.description}
                          onChange={(e) => setChallengeForm({ ...challengeForm, description: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Start Date</label>
                          <input
                            type="date"
                            value={challengeForm.startDate}
                            onChange={(e) => setChallengeForm({ ...challengeForm, startDate: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>End Date</label>
                          <input
                            type="date"
                            value={challengeForm.endDate}
                            onChange={(e) => setChallengeForm({ ...challengeForm, endDate: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group criteria-section">
                        <label>Engagement Tags & Rewards</label>
                        <div className="tag-input-row-modern">
                          <input
                            type="text"
                            placeholder="Tag name (e.g. #Inktober)"
                            value={newTag.name}
                            onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                          />
                          <input
                            type="number"
                            placeholder="Pts"
                            value={newTag.points}
                            onChange={(e) => setNewTag({ ...newTag, points: parseInt(e.target.value) })}
                          />
                          <button type="button" onClick={handleAddTag} className="add-tag-v2">Add</button>
                        </div>
                        <div className="tags-container-modern">
                          {challengeForm.criteriaTags.map((tag, index) => (
                            <div key={index} className="tag-pill-modern">
                              <span>{tag.name}</span>
                              <span className="pts">+{tag.points}</span>
                              <button type="button" onClick={() => codeRemoveTag(index)} className="remove-tag">×</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="publish-challenge-btn">Publish Challenge</button>
                  </form>
                </div>

                <div className="existing-challenges-wrapper">
                  <h2 className="section-title">Active Challenges</h2>
                  <div className="challenges-grid-modern">
                    {challenges.length === 0 ? (
                      <p className="empty-list">No active challenges found.</p>
                    ) : challenges.map(challenge => (
                      <div key={challenge._id} className="challenge-item-card">
                        <div className="challenge-icon-box">🏆</div>
                        <div className="challenge-details">
                          <h4 className="challenge-item-title">{challenge.title}</h4>
                          <p className="challenge-item-dates">
                            {new Date(challenge.startDate).toLocaleDateString()} — {new Date(challenge.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showSuccessPopup && <SuccessPopup message={successMessage} onClose={() => setShowSuccessPopup(false)} />}
    </div>
  );
}
