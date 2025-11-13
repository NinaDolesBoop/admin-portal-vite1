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

interface ApprovalRequest {
  id: string
  requester: string
  email: string
  requestType: string
  amount?: number
  submittedAt: string
  status: ApprovalStatus
  kyc?: KycDocument[]
}

// Mock data
const mockRequests: ApprovalRequest[] = [
  {
    id: 'req-1',
    requester: 'Mimi',
    email: 'mimi@example.com',
    requestType: 'Withdrawal',
    amount: 5000,
    submittedAt: '2025-11-10 09:12',
    status: 'pending',
    kyc: [
      { id: 'd1', type: 'ID Card', filename: 'alice-id.jpg', url: '', uploadedAt: '2025-11-10 09:10' },
      { id: 'd2', type: 'Proof of Address', filename: 'alice-utility.pdf', url: '', uploadedAt: '2025-11-10 09:11' },
    ]
  },
  {
    id: 'req-2',
    requester: 'Syafiq',
    email: 'syafiq@example.com',
    requestType: 'KYC Update',
    submittedAt: '2025-11-08 14:05',
    status: 'pending',
    kyc: [
      { id: 'd3', type: 'ID Card', filename: 'bob-id.png', url: '', uploadedAt: '2025-11-08 14:03' }
    ]
  },
  { id: 'req-3', requester: 'Abu', email: 'abu@example.com', requestType: 'Account Closure', submittedAt: '2025-10-29 11:22', status: 'approved', kyc: [] },
  { id: 'req-4', requester: 'Danish', email: 'danish@example.com', requestType: 'Large Transfer', amount: 25000, submittedAt: '2025-11-01 16:40', status: 'rejected', kyc: [] },
  {
    id: 'req-5',
    requester: 'Charles',
    email: 'charles@example.com',
    requestType: 'Withdrawal',
    amount: 1200,
    submittedAt: '2025-11-12 08:03',
    status: 'pending',
    kyc: [
      { id: 'd4', type: 'ID Card', filename: 'eva-id.jpg', url: '', uploadedAt: '2025-11-12 08:00' }
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
  const [requests, setRequests] = useState<ApprovalRequest[]>(mockRequests)
  const [filter, setFilter] = useState<'all' | ApprovalStatus>('all')
  const [selected, setSelected] = useState<ApprovalRequest | null>(null)
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

  const initDocStatuses = (r: ApprovalRequest | null) => {
    if (!r || !r.kyc) {
      setDocStatuses({})
      return
    }
    const map: Record<string, 'pending' | 'verified' | 'rejected'> = {}
    r.kyc.forEach(d => (map[d.id] = 'pending'))
    setDocStatuses(map)
  }

  // openRequest should init doc statuses
  const openRequestWithInit = (r: ApprovalRequest) => {
    initDocStatuses(r)
    setSelected(r)
  }

  const verifyDoc = (docId: string) => setDocStatuses(s => ({ ...s, [docId]: 'verified' }))
  const rejectDoc = (docId: string) => setDocStatuses(s => ({ ...s, [docId]: 'rejected' }))

  return (
    <div className="user-management">
      <div className="page-header">
        <div className="page-title-group">
          <h1 className="page-title">Approval Management</h1>
          <p className="page-subtitle">Review and process incoming approval requests</p>
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
            <h3 className="table-title">Requests</h3>
          </div>

          <div className="table-wrapper">
            <table>
              <colgroup>
                <col style={{ width: '28%' }} />
                <col style={{ width: '18%' }} />
                <col style={{ width: '14%' }} />
                <col style={{ width: '18%' }} />
                <col style={{ width: '12%' }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Requester</th>
                  <th>Request</th>
                  <th>Amount</th>
                  <th>Submitted</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div>
                        <button className="link" onClick={() => openRequestWithInit(r)} style={{ fontWeight: 600 }}>{r.requester}</button>
                        <div style={{ color: 'var(--muted)', fontSize: 13 }}>{r.email}</div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{r.requestType}</div>
                    </td>
                    <td>
                      {r.amount ? `$${r.amount.toLocaleString()}` : '-' }
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
                        <button className="action-btn" title="Check Submission" onClick={() => openRequestWithInit(r)}>
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
                  <h2 className="modal-title">Details — {selected.requester}</h2>
                  <button className="modal-close" onClick={closeRequest}>&times;</button>
                </div>
            <div className="modal-body">
              <div style={{ marginBottom: 12 }}>
                <strong>Request:</strong> {selected.requestType}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>Submitted:</strong> {selected.submittedAt}
              </div>
              <div>
                <strong>Documents</strong>
                <div style={{ display: 'grid', gap: 12, marginTop: 8 }}>
                  {selected.kyc && selected.kyc.length > 0 ? (
                    selected.kyc.map(doc => {
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
