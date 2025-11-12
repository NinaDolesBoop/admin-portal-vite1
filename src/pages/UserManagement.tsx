import { useState, useMemo } from 'react'
import '../css/UserManagement.css'  // Add this line

// Types
interface Admin {
  id: string
  name: string
  email: string
  role: 'Super Admin' | 'Admin' | 'Moderator'
  status: 'active' | 'inactive'
  createdAt: string
  lastLogin: string
}

type ModalType = 'add' | 'edit' | 'deactivate' | 'reactivate' | null

interface FormData {
  name: string
  email: string
  role: 'Super Admin' | 'Admin' | 'Moderator'
}

interface FormErrors {
  name?: string
  email?: string
  role?: string
}

// Mock Data
const mockAdmins: Admin[] = [
  {
    id: '1',
    name: 'Nina',
    email: 'nina@fpmarkets.com',
    role: 'Super Admin',
    status: 'active',
    createdAt: '2024-01-15',
    lastLogin: '2024-11-12 09:30'
  },
  {
    id: '2',
    name: 'Aca',
    email: 'aca@fpmarkets.com',
    role: 'Admin',
    status: 'active',
    createdAt: '2024-02-20',
    lastLogin: '2024-11-12 08:15'
  },
  {
    id: '3',
    name: 'Ampiya',
    email: 'ampiya@fpmarkets.com',
    role: 'Admin',
    status: 'active',
    createdAt: '2024-03-10',
    lastLogin: '2024-11-11 16:45'
  },

  {
    id: '6',
    name: 'Danish',
    email: 'danish@fpmarkets.com',
    role: 'Admin',
    status: 'inactive',
    createdAt: '2024-06-18',
    lastLogin: '2024-10-15 10:30'
  }
]

// Icon Components
const PlusIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
)

const SearchIcon = () => (
  <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
)

const FilterIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
)

const EditIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
)

const TrashIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
)

const CheckIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
)

const XIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
)

const AlertIcon = () => (
  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
)

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
)

const CrownIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7l3.5 7 5.5-9 5.5 9L21 7v12H3V7z" />
    </svg>
  );
  

const UserCheckIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M17 11l2 2 4-4"/></svg>
)

const UsersIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
)

const RotateCcwIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>
)

// Utility Functions
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getAvatarColor = (index: number) => {
  const colors = ['avatar-purple', 'avatar-green', 'avatar-blue', 'avatar-amber', 'avatar-pink', 'avatar-red']
  return colors[index % colors.length]
}

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'Super Admin':
      return <CrownIcon />
    case 'Admin':
      return <ShieldIcon />
    case 'Moderator':
      return <UserCheckIcon />
    default:
      return null
  }
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export default function UserManagement() {
  const [admins, setAdmins] = useState<Admin[]>(mockAdmins)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [modalType, setModalType] = useState<ModalType>(null)
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    role: 'Admin'
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({})

  // Filtered and searched admins
  const filteredAdmins = useMemo(() => {
    return admins.filter(admin => {
      const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          admin.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = roleFilter === 'all' || admin.role === roleFilter
      const matchesStatus = statusFilter === 'all' || admin.status === statusFilter
      
      return matchesSearch && matchesRole && matchesStatus
    })
  }, [admins, searchTerm, roleFilter, statusFilter])

  // Stats
  const stats = useMemo(() => {
    const activeCount = admins.filter(a => a.status === 'active').length
    const superAdminCount = admins.filter(a => a.role === 'Super Admin' && a.status === 'active').length
    
    return {
      total: admins.length,
      active: activeCount,
      superAdmins: superAdminCount
    }
  }, [admins])

  // Modal Handlers
  const openAddModal = () => {
    setFormData({ name: '', email: '', role: 'Admin' })
    setFormErrors({})
    setModalType('add')
  }

  const openEditModal = (admin: Admin) => {
    setSelectedAdmin(admin)
    setFormData({ name: admin.name, email: admin.email, role: admin.role })
    setFormErrors({})
    setModalType('edit')
  }

  const openDeactivateModal = (admin: Admin) => {
    setSelectedAdmin(admin)
    setModalType('deactivate')
  }

  const openReactivateModal = (admin: Admin) => {
    setSelectedAdmin(admin)
    setModalType('reactivate')
  }

  const closeModal = () => {
    setModalType(null)
    setSelectedAdmin(null)
    setFormData({ name: '', email: '', role: 'Admin' })
    setFormErrors({})
  }

  // Form Validation
  const validateForm = (): boolean => {
    const errors: FormErrors = {}

    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!formData.role) {
      errors.role = 'Role is required'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // CRUD Operations (UI Only)
  const handleAddAdmin = () => {
    if (!validateForm()) return

    const newAdmin: Admin = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Never'
    }

    setAdmins([...admins, newAdmin])
    closeModal()
  }

  const handleEditAdmin = () => {
    if (!validateForm() || !selectedAdmin) return

    setAdmins(admins.map(admin =>
      admin.id === selectedAdmin.id
        ? { ...admin, name: formData.name.trim(), email: formData.email.trim(), role: formData.role }
        : admin
    ))
    closeModal()
  }

  const handleDeactivateAdmin = () => {
    if (!selectedAdmin) return

    setAdmins(admins.map(admin =>
      admin.id === selectedAdmin.id
        ? { ...admin, status: 'inactive' }
        : admin
    ))
    closeModal()
  }

  const handleReactivateAdmin = () => {
    if (!selectedAdmin) return

    setAdmins(admins.map(admin =>
      admin.id === selectedAdmin.id
        ? { ...admin, status: 'active' }
        : admin
    ))
    closeModal()
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setRoleFilter('all')
    setStatusFilter('all')
  }

  return (
    <div className="user-management">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">
            Manage admin accounts, roles, and permissions
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={openAddModal}>
            <PlusIcon />
            <span>Add New Admin</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="kpi-card card">
          <div className="kpi-content" style={{ padding: '20px' }}>
            <div className="kpi-header" style={{ marginBottom: '8px' }}>
              <div className="kpi-icon" style={{ width: '40px', height: '40px' }}>
                <UsersIcon />
              </div>
            </div>
            <div className="kpi-body" style={{ marginBottom: 0 }}>
              <span className="kpi-label">Total Admins</span>
              <div className="kpi-value" style={{ fontSize: '28px' }}>{stats.total}</div>
            </div>
          </div>
        </div>

        <div className="kpi-card card variant-green">
          <div className="kpi-content" style={{ padding: '20px' }}>
            <div className="kpi-header" style={{ marginBottom: '8px' }}>
              <div className="kpi-icon" style={{ width: '40px', height: '40px' }}>
                <UserCheckIcon />
              </div>
            </div>
            <div className="kpi-body" style={{ marginBottom: 0 }}>
              <span className="kpi-label">Active Admins</span>
              <div className="kpi-value" style={{ fontSize: '28px' }}>{stats.active}</div>
            </div>
          </div>
        </div>

        <div className="kpi-card card variant-amber">
          <div className="kpi-content" style={{ padding: '20px' }}>
            <div className="kpi-header" style={{ marginBottom: '8px' }}>
              <div className="kpi-icon" style={{ width: '40px', height: '40px' }}>
                <CrownIcon />
              </div>
            </div>
            <div className="kpi-body" style={{ marginBottom: 0 }}>
              <span className="kpi-label">Super Admins</span>
              <div className="kpi-value" style={{ fontSize: '28px' }}>{stats.superAdmins}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-card card">
        <div className="card-body">
          <div className="filters-wrapper">
            <div className="filter-group">
              <label className="filter-label">Search</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="input"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '44px' }}
                />
                <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <SearchIcon />
                </div>
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Role</label>
              <select
                className="select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Status</label>
              <select
                className="select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label" style={{ opacity: 0 }}>Actions</label>
              <div className="filter-actions">
                <button className="btn btn-secondary btn-sm" onClick={handleClearFilters}>
                  <FilterIcon />
                  <span>Clear Filters</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Table */}
      <div className="users-card card">
        <div className="card-body">
          <div className="users-table-header">
            <h3 className="table-title">Admin Accounts</h3>
            <span className="table-count">
              Showing {filteredAdmins.length} of {admins.length} admins
            </span>
          </div>

          {filteredAdmins.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <UsersIcon />
              </div>
              <h3 className="empty-title">No admins found</h3>
              <p className="empty-message">
                {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Get started by adding your first admin'}
              </p>
              {!searchTerm && roleFilter === 'all' && statusFilter === 'all' && (
                <button className="btn btn-primary" onClick={openAddModal}>
                  <PlusIcon />
                  <span>Add New Admin</span>
                </button>
              )}
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <colgroup>
                  <col style={{ width: '30%' }} />
                  <col style={{ width: '18%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '18%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '10%' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>Admin</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Created</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.map((admin, index) => (
                    <tr key={admin.id}>
                      <td>
                        <div className="user-info">
                          <div className={`user-avatar ${getAvatarColor(index)}`}>
                            {getInitials(admin.name)}
                          </div>
                          <div className="user-details">
                            <div className="user-name">{admin.name}</div>
                            <div className="user-email">{admin.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={`role-badge role-${admin.role.toLowerCase().replace(' ', '-')}`}>
                          {getRoleIcon(admin.role)}
                          <span>{admin.role}</span>
                        </div>
                      </td>
                      <td>
                        <div className={`status-${admin.status}`}>
                          <div className="status-dot"></div>
                          <span style={{ textTransform: 'capitalize' }}>{admin.status}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                        {admin.lastLogin}
                      </td>
                      <td style={{ color: 'var(--muted)', fontSize: '13px' }}>
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn"
                            onClick={() => openEditModal(admin)}
                            title="Edit Admin"
                          >
                            <EditIcon />
                          </button>
                          {admin.status === 'active' ? (
                            <button
                              className="action-btn danger"
                              onClick={() => openDeactivateModal(admin)}
                              title="Deactivate Admin"
                            >
                              <TrashIcon />
                            </button>
                          ) : (
                            <button
                              className="action-btn"
                              onClick={() => openReactivateModal(admin)}
                              title="Reactivate Admin"
                            >
                              <RotateCcwIcon />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {(modalType === 'add' || modalType === 'edit') && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {modalType === 'add' ? 'Add New Admin' : 'Edit Admin'}
              </h2>
              <button className="modal-close" onClick={closeModal}>
                <XIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-input ${formErrors.name ? 'error' : ''}`}
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {formErrors.name && (
                    <div className="form-error">
                      <AlertIcon />
                      <span>{formErrors.name}</span>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Email Address <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    className={`form-input ${formErrors.email ? 'error' : ''}`}
                    placeholder="admin@fpmarkets.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  {formErrors.email && (
                    <div className="form-error">
                      <AlertIcon />
                      <span>{formErrors.email}</span>
                    </div>
                  )}
                  {!formErrors.email && (
                    <div className="form-help">
                      Use company email address only
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Role <span className="required">*</span>
                  </label>
                  <select
                    className={`form-select ${formErrors.role ? 'error' : ''}`}
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin">Admin</option>
                  </select>
                  {formErrors.role && (
                    <div className="form-error">
                      <AlertIcon />
                      <span>{formErrors.role}</span>
                    </div>
                  )}
                  {!formErrors.role && (
                    <div className="form-help">
                      Select appropriate role based on responsibilities
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={modalType === 'add' ? handleAddAdmin : handleEditAdmin}
              >
                <CheckIcon />
                <span>{modalType === 'add' ? 'Add Admin' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {modalType === 'deactivate' && selectedAdmin && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Deactivate Admin</h2>
              <button className="modal-close" onClick={closeModal}>
                <XIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="confirm-icon">
                <AlertIcon />
              </div>
              <div className="confirm-content">
                <h3 className="confirm-title">Are you sure?</h3>
                <p className="confirm-message">
                  You are about to deactivate <strong>{selectedAdmin.name}</strong>.
                  They will lose access to the admin panel immediately.
                </p>
                <p className="confirm-warning">
                  You can reactivate this account later if needed.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeactivateAdmin}>
                <TrashIcon />
                <span>Deactivate Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {modalType === 'reactivate' && selectedAdmin && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Reactivate Admin</h2>
              <button className="modal-close" onClick={closeModal}>
                <XIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="confirm-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                <UserCheckIcon />
              </div>
              <div className="confirm-content">
                <h3 className="confirm-title">Reactivate Admin Account</h3>
                <p className="confirm-message">
                  You are about to reactivate <strong>{selectedAdmin.name}</strong>.
                  They will regain access to the admin panel.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleReactivateAdmin}>
                <RotateCcwIcon />
                <span>Reactivate Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}