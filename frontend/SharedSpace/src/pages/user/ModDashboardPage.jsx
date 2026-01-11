import React, { useState } from 'react';
import SampleImg from '../../assets/arts/ukiyo.jpg';
import SampleImg2 from '../../assets/arts/almondtree.jpg';
import './ModDashboardPage.css';

export function ModDashboardPage() {
  const [activeTab, setActiveTab] = useState('users');

  const users = [
    { id: 1, username: "Feesha", email: "feesha@example.com", type: "Artist", date: "2024-01-01" },
    { id: 2, username: "Angus", email: "angus@example.com", type: "Artist", date: "2024-01-10" },
    { id: 3, username: "Elisha", email: "elisha@example.com", type: "Artist", date: "2024-02-15" },
    { id: 4, username: "Francis", email: "francis@example.com", type: "Artist", date: "2024-03-01" },
    { id: 5, username: "James", email: "james@example.com", type: "Artist", date: "2024-03-05" },
    { id: 6, username: "Nathan", email: "nathan@example.com", type: "Viewer", date: "2024-03-12" },
    { id: 7, username: "Shamel", email: "shamel@example.com", type: "Viewer", date: "2024-03-15" },
    { id: 8, username: "Vince", email: "vince@example.com", type: "Artist", date: "2024-03-18" },
    { id: 9, username: "Yvan", email: "yvan@example.com", type: "Artist", date: "2024-03-20" },
  ];

  const reports = [
    { id: "0001", preview: SampleImg, reason: "AI", date: "2024-03-20" },
    { id: "0002", preview: SampleImg2, reason: "Spam", date: "2024-03-21" },
    { id: "0003", preview: SampleImg, reason: "Copyright", date: "2024-03-22" },
  ];

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
          </div>
        </div>

        <div className="mod-main">
          <div className="card-shadow content-card">
            {/* Moderating users */}
            {activeTab === 'users' ? (
              <>
                {/* Users header */}
                <div className="table-header">
                  <span>Username</span>
                  <span>Email</span>
                  <span>Account Type</span>
                  <span>Creation Date</span>
                  <span>Action</span>
                </div>

                {/* Users body */}
                <div className="table-body">
                  {users.map(user => (
                    <div key={user.id} className="table-row">
                      <span>{user.username}</span>
                      <span>{user.email}</span>
                      <span>{user.type}</span>
                      <span>{user.date}</span>

                      {/* Dropdown */}
                      <select className="action-select">
                        <option value="">Select</option>
                        <option value="ban">Ban User</option>
                        <option value="delete">Ignore</option>
                      </select>

                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Moderating posts */}
                {/* Posts Header */}
                <div className="table-header">
                  <span>Report ID</span>
                  <span>Preview</span>
                  <span>Reason</span>
                  <span>Posted Date</span>
                  <span>Action</span>
                </div>

                {/* Posts Body */}
                <div className="table-body">
                  {reports.map(report => (
                    <div key={report.id} className="table-row">
                      <span>{report.id}</span>
                      <div className="preview-container">
                        <img src={report.preview} alt="Report Preview" className="report-preview-img" />
                      </div>
                      <span>{report.reason}</span>
                      <span>{report.date}</span>

                      {/* Dropdown */}
                      <select className="action-select">
                        <option value="">Select</option>
                        <option value="ignore">Remove Content</option>
                        <option value="remove">Ban User</option>
                        <option value="ban">Ignore</option>
                      </select>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
