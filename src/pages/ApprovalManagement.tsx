import { useState, useMemo } from 'react'
import '../css/UserManagement.css'

type ApprovalStatus = 'pending' | 'approved' | 'rejected'

interface KycDocument {
  id: string
  type: string
  filename: string
  url?: string
  uploadedAt: string
}

interface VerificationRequest {
  id: string
  name: string
  email: string
  status: ApprovalStatus
  submittedAt: string
  documents: KycDocument[]
}

// Mock data - KYC Verification Requests
const mockRequests: VerificationRequest[] = [
  {
    id: 'ver-1',
    name: 'Mimi',
    email: 'mimi@example.com',
    submittedAt: '2025-11-10 09:12',
    status: 'pending',
    documents: [
      { id: 'd1', type: 'Identity Card (IC)', filename: 'mimi-ic.jpg', url: '', uploadedAt: '2025-11-10 09:10' },
      { id: 'd2', type: 'Proof of Address', filename: 'mimi-utility.pdf', url: '', uploadedAt: '2025-11-10 09:11' },
    ]
  },
  {
    id: 'ver-2',
    name: 'Syafiq',
    email: 'syafiq@example.com',
    submittedAt: '2025-11-08 14:05',
    status: 'pending',
    documents: [
      { id: 'd3', type: 'Identity Card (IC)', filename: 'syafiq-ic.png', url: '', uploadedAt: '2025-11-08 14:03' },
      { id: 'd4', type: 'Bank Statement', filename: 'syafiq-bank.pdf', url: '', uploadedAt: '2025-11-08 14:04' }
    ]
  },
  { 
    id: 'ver-3', 
    name: 'Abu', 
    email: 'abu@example.com', 
    submittedAt: '2025-10-29 11:22', 
    status: 'approved', 
    documents: [
      { id: 'd5', type: 'Identity Card (IC)', filename: 'abu-ic.jpg', url: '', uploadedAt: '2025-10-29 11:20' }
    ]
  },
  { 
    id: 'ver-4', 
    name: 'Danish', 
    email: 'danish@example.com', 
    submittedAt: '2025-11-01 16:40', 
    status: 'rejected', 
    documents: [
      { id: 'd6', type: 'Identity Card (IC)', filename: 'danish-ic.jpg', url: '', uploadedAt: '2025-11-01 16:38' }
    ]
  },
  {
    id: 'ver-5',
    name: 'Charles',
    email: 'charles@example.com',
    submittedAt: '2025-11-12 08:03',
    status: 'pending',
    documents: [
      { id: 'd7', type: 'Identity Card (IC)', filename: 'charles-ic.jpg', url: '', uploadedAt: '2025-11-12 08:00' },
      { id: 'd8', type: 'Proof of Address', filename: 'charles-utility.pdf', url: '', uploadedAt: '2025-11-12 08:02' }
    ]
  },
]

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const XIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function ApprovalManagement() {
  const [requests, setRequests] = useState<VerificationRequest[]>(mockRequests)
  const [filter, setFilter] = useState<'all' | ApprovalStatus>('all')
  const [selected, setSelected] = useState<VerificationRequest | null>(null)
  const [docStatuses, setDocStatuses] = useState<Record<string, 'pending' | 'verified' | 'rejected'>>({})

  const filtered = useMemo(() => {
    if (filter === 'all') return requests
    return requests.filter(r => r.status === filter)
  }, [requests, filter])

  const updateStatus = (id: string, status: ApprovalStatus) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r))
  }

  const closeRequest = () => setSelected(null)
  const approveSelected = () => {
    if (!selected) return
    updateStatus(selected.id, 'approved')
    closeRequest()
  }
  const rejectSelected = () => {
    if (!selected) return
    updateStatus(selected.id, 'rejected')
    closeRequest()
  }

  const initDocStatuses = (r: VerificationRequest | null) => {
    if (!r || !r.documents) {
      setDocStatuses({})
      return
    }
    const map: Record<string, 'pending' | 'verified' | 'rejected'> = {}
    r.documents.forEach((d: KycDocument) => (map[d.id] = 'pending'))
    setDocStatuses(map)
  }

  // openRequest should init doc statuses
  const openRequestWithInit = (r: VerificationRequest) => {
    initDocStatuses(r)
    setSelected(r)
  }

  const verifyDoc = (docId: string) => setDocStatuses(s => ({ ...s, [docId]: 'verified' }))
  const rejectDoc = (docId: string) => setDocStatuses(s => ({ ...s, [docId]: 'rejected' }))

  return (
    <div className="user-management">
      <div className="page-header">
        <div className="page-title-group">
          <h1 className="page-title">Account Verification</h1>
          <p className="page-subtitle">Review KYC and account verification submissions</p>
        </div>
      </div>

      <div className="filters-card card" style={{ marginBottom: '12px' }}>
        <div className="card-body">
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <label style={{ marginRight: 8 }}>Status:</label>
            <select className="select" value={filter} onChange={(e) => setFilter(e.target.value as any)}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <div style={{ marginLeft: 'auto', color: 'var(--muted)' }}>
              Showing {filtered.length} of {requests.length}
            </div>
          </div>
        </div>
      </div>

      <div className="users-card card">
        <div className="card-body">
          <div className="users-table-header">
            <h3 className="table-title">Verification Requests</h3>
          </div>

          <div className="table-wrapper">
            <table>
              <colgroup>
                <col style={{ width: '28%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '18%' }} />
                <col style={{ width: '16%' }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Submitted</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <button className="link" onClick={() => openRequestWithInit(r)} style={{ fontWeight: 600 }}>{r.name}</button>
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: 13 }}>
                      {r.email}
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: 13 }}>{r.submittedAt}</td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <button
                          className={`action-btn ${r.status === 'approved' ? 'disabled' : ''}`}
                          onClick={() => updateStatus(r.id, 'approved')}
                          title="Approve"
                        >
                          <CheckIcon />
                        </button>
                        <button
                          className={`action-btn ${r.status === 'rejected' ? 'disabled' : ''}`}
                          onClick={() => updateStatus(r.id, 'rejected')}
                          title="Reject"
                        >
                          <XIcon />
                        </button>
                        <button className="action-btn" title="View Details" onClick={() => openRequestWithInit(r)}>
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {selected && (
        <div className="modal-overlay" onClick={closeRequest}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
                  <h2 className="modal-title">Account Verification — {selected.name}</h2>
                  <button className="modal-close" onClick={closeRequest}>&times;</button>
                </div>
            <div className="modal-body">
              <div style={{ marginBottom: 12 }}>
                <strong>Email:</strong> {selected.email}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>Submitted:</strong> {selected.submittedAt}
              </div>
              <div>
                <strong>Documents</strong>
                <div style={{ display: 'grid', gap: 12, marginTop: 8 }}>
                  {selected.documents && selected.documents.length > 0 ? (
                    selected.documents.map((doc: KycDocument) => {
                      const status = docStatuses[doc.id] ?? 'pending'
                      return (
                        <div key={doc.id} style={{ padding: 8, border: '1px solid var(--muted)', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 700 }}>{doc.type}</div>
                            <div style={{ color: 'var(--muted)', fontSize: 13 }}>{doc.filename}</div>
                            <div style={{ color: 'var(--muted)', fontSize: 12 }}>{doc.uploadedAt}</div>
                          </div>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <span style={{ textTransform: 'capitalize', fontSize: 13, color: status === 'verified' ? 'var(--brand)' : status === 'rejected' ? 'crimson' : 'var(--muted)' }}>{status}</span>
                            <button className="btn btn-sm" onClick={() => verifyDoc(doc.id)} disabled={status === 'verified'}>Verify</button>
                            <button className="btn btn-sm btn-danger" onClick={() => rejectDoc(doc.id)} disabled={status === 'rejected'}>Reject</button>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div style={{ color: 'var(--muted)' }}>No documents submitted</div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeRequest}>Close</button>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                <button className="btn btn-danger" onClick={rejectSelected}><XIcon /> Reject</button>
                <button className="btn btn-primary" onClick={approveSelected}><CheckIcon /> Approve</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
