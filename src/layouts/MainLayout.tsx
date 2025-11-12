// src/layouts/MainLayout.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Dashboard from '../pages/Dashboard';
import UserManagement from '../pages/UserManagement';
import ClientManagement from '../pages/ClientManagement';

type Route = 'dashboard' | 'usermanagement' | 'clients' | 'approval' | 'ticketing' | 'reports' | 'settings';

export default function MainLayout() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [route, setRoute] = useState<Route>('dashboard');
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <header className="header-bar">
        <a className="brand" href="#">
          <span className="brand-fp">FP</span><span className="brand-markets">Markets</span>
        </a>
        <div className="header-right">
          <div className="profile-wrapper" style={{ position: 'relative' }}>
            <button
              className="avatar"
              onClick={() => setProfileOpen(o => !o)}
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              title={user?.name}
            >
              {user?.name.charAt(0).toUpperCase()}
            </button>
            {profileOpen && (
              <div
                className="profile-menu"
                role="menu"
                onMouseEnter={() => setProfileOpen(true)}
                onMouseLeave={() => setProfileOpen(false)}
              >
                <div className="profile-header">
                  <div className="profile-name">{user?.name}</div>
                  <div className="profile-email">{user?.email}</div>
                  <div style={{
                    marginTop: '8px',
                    padding: '4px 8px',
                    background: 'rgba(99, 102, 241, 0.1)',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: 'var(--brand)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'inline-block'
                  }}>
                    {user?.role}
                  </div>
                </div>
                <div className="profile-sep" />
                <button className="profile-item danger" role="menuitem" onClick={handleLogout}>
                  <span className="pi-ico">
                    <svg className="ico" viewBox="0 0 24 24">
                      <path d="M10 12h8"></path>
                      <path d="M15 7l5 5-5 5"></path>
                      <path d="M4 4h7v16H4z"></path>
                    </svg>
                  </span>
                  <span className="pi-label">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <aside 
        className={`sidebar ${sidebarExpanded ? 'expanded' : 'collapsed'}`}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      >
        <nav className="nav">
          {/* Overview Section */}
          <div className="nav-section">
            <div className="nav-section-title">Overview</div>
            <button
              className={`nav-item ${route === 'dashboard' ? 'active' : ''}`}
              onClick={() => setRoute('dashboard')}
              aria-current={route === 'dashboard' ? 'page' : undefined}
            >
              <span className="nav-ico">
                <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1"></rect>
                  <rect x="14" y="3" width="7" height="7" rx="1"></rect>
                  <rect x="3" y="14" width="7" height="7" rx="1"></rect>
                  <rect x="14" y="14" width="7" height="7" rx="1"></rect>
                </svg>
              </span>
              <span className="nav-label">Dashboard</span>
            </button>
          </div>

          {/* Management Section */}
          <div className="nav-section">
            <div className="nav-section-title">Management</div>
            
            <button
              className={`nav-item ${route === 'clients' ? 'active' : ''}`}
              onClick={() => setRoute('clients')}
              aria-current={route === 'clients' ? 'page' : undefined}
            >
              <span className="nav-ico">
                <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </span>
              <span className="nav-label">Client Management</span>
            </button>

            <button
              className={`nav-item ${route === 'approval' ? 'active' : ''}`}
              onClick={() => setRoute('approval')}
              aria-current={route === 'approval' ? 'page' : undefined}
            >
              <span className="nav-ico">
                <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3L22 4"></path>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
              </span>
              <span className="nav-label">Approval Management</span>
            </button>

            <button
              className={`nav-item ${route === 'ticketing' ? 'active' : ''}`}
              onClick={() => setRoute('ticketing')}
              aria-current={route === 'ticketing' ? 'page' : undefined}
            >
              <span className="nav-ico">
                <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="12" y1="18" x2="12" y2="12"></line>
                  <line x1="9" y1="15" x2="15" y2="15"></line>
                </svg>
              </span>
              <span className="nav-label">Ticket Management</span>
            </button>

            <button
              className={`nav-item ${route === 'usermanagement' ? 'active' : ''}`}
              onClick={() => setRoute('usermanagement')}
              aria-current={route === 'usermanagement' ? 'page' : undefined}
            >
              <span className="nav-ico">
                <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  <line x1="12" y1="8" x2="12" y2="8"></line>
                </svg>
              </span>
              <span className="nav-label">Admin Management</span>
            </button>
          </div>

          {/* Analytics & Settings Section */}
          <div className="nav-section">
            <div className="nav-section-title">Analytics & System</div>
            
            <button
              className={`nav-item ${route === 'reports' ? 'active' : ''}`}
              onClick={() => setRoute('reports')}
              aria-current={route === 'reports' ? 'page' : undefined}
            >
              <span className="nav-ico">
                <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
              </span>
              <span className="nav-label">Reports</span>
            </button>

            <button
              className={`nav-item ${route === 'settings' ? 'active' : ''}`}
              onClick={() => setRoute('settings')}
              aria-current={route === 'settings' ? 'page' : undefined}
            >
              <span className="nav-ico">
                <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3"></path>
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              </span>
              <span className="nav-label">Settings</span>
            </button>
          </div>
        </nav>
      </aside>

      <main className="main">
        <div className="container">
          {route === 'dashboard' && <Dashboard />}
          {route === 'usermanagement' && <UserManagement />}
          {route === 'clients' && <ClientManagement />}

          {route === 'approval' && (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="title">Approval Management</div>
                  <div className="muted">Review and approve user requests</div>
                </div>
              </div>
              <div className="card-body">
                <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 20px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '2px solid rgba(16, 185, 129, 0.2)',
                    display: 'grid',
                    placeItems: 'center'
                  }}>
                    <svg style={{ width: '40px', height: '40px', stroke: '#10b981', opacity: 0.7 }} viewBox="0 0 24 24" fill="none" strokeWidth="2">
                      <path d="M9 11l3 3L22 4"></path>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text)', marginBottom: '8px' }}>
                    Approval Management Coming Soon
                  </h3>
                  <p className="muted">This feature is under development</p>
                </div>
              </div>
            </div>
          )}

          {route === 'ticketing' && (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="title">Ticket Management</div>
                  <div className="muted">Manage and resolve support tickets</div>
                </div>
              </div>
              <div className="card-body">
                <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 20px',
                    borderRadius: '50%',
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '2px solid rgba(245, 158, 11, 0.2)',
                    display: 'grid',
                    placeItems: 'center'
                  }}>
                    <svg style={{ width: '40px', height: '40px', stroke: '#f59e0b', opacity: 0.7 }} viewBox="0 0 24 24" fill="none" strokeWidth="2">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="12" y1="18" x2="12" y2="12"></line>
                      <line x1="9" y1="15" x2="15" y2="15"></line>
                    </svg>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text)', marginBottom: '8px' }}>
                    Ticket Management Coming Soon
                  </h3>
                  <p className="muted">This feature is under development</p>
                </div>
              </div>
            </div>
          )}

          {route === 'reports' && (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="title">Reports</div>
                  <div className="muted">Generate and view platform reports</div>
                </div>
              </div>
              <div className="card-body">
                <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 20px',
                    borderRadius: '50%',
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '2px solid rgba(99, 102, 241, 0.2)',
                    display: 'grid',
                    placeItems: 'center'
                  }}>
                    <svg style={{ width: '40px', height: '40px', stroke: 'var(--brand)', opacity: 0.7 }} viewBox="0 0 24 24" fill="none" strokeWidth="2">
                      <line x1="18" y1="20" x2="18" y2="10"></line>
                      <line x1="12" y1="20" x2="12" y2="4"></line>
                      <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text)', marginBottom: '8px' }}>
                    Reports Coming Soon
                  </h3>
                  <p className="muted">This feature is under development</p>
                </div>
              </div>
            </div>
          )}

          {route === 'settings' && (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="title">Settings</div>
                  <div className="muted">Configure platform settings and preferences</div>
                </div>
              </div>
              <div className="card-body">
                <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 20px',
                    borderRadius: '50%',
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '2px solid rgba(139, 92, 246, 0.2)',
                    display: 'grid',
                    placeItems: 'center'
                  }}>
                    <svg style={{ width: '40px', height: '40px', stroke: '#8b5cf6', opacity: 0.7 }} viewBox="0 0 24 24" fill="none" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3"></path>
                      <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text)', marginBottom: '8px' }}>
                    Settings Coming Soon
                  </h3>
                  <p className="muted">This feature is under development</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}