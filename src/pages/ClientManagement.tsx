// src/pages/ClientManagement.tsx
import { useMemo, useState } from 'react';
import { clients as seedClients, type ClientRecord } from '../data/clients';

type StatusFilter = 'All' | ClientRecord['status'];

function formatCurrency(n: number): string {
  const sign = n < 0 ? '-' : '';
  const val = Math.abs(n);
  return `${sign}$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function statusClass(status: ClientRecord['status'] | 'Verified'): string {
  if (status === 'Suspended') return 'badge danger';
  if (status === 'Pending') return 'badge warning';
  return 'badge success';
}

function displayStatus(status: ClientRecord['status']): string {
  if (status === 'Suspended') return 'Suspended';
  if (status === 'Pending') return 'Pending';
  return 'Verified';
}

export default function ClientManagement() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('All');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sort, setSort] = useState<{ key: keyof ClientRecord; dir: 'asc' | 'desc' } | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = seedClients.filter(c => {
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.status.toLowerCase().includes(q) ||
        c.balance.toString().includes(q) ||
        c.registrationDate.includes(q);
      const matchesStatus = status === 'All' || c.status === status;
      return matchesQuery && matchesStatus;
    });

    if (sort) {
      const { key, dir } = sort;
      out = [...out].sort((a, b) => {
        const av = a[key];
        const bv = b[key];
        if (typeof av === 'number' && typeof bv === 'number') {
          return dir === 'asc' ? av - bv : bv - av;
        }
        return dir === 'asc'
          ? String(av).localeCompare(String(bv))
          : String(bv).localeCompare(String(av));
      });
    }
    return out;
  }, [query, status, sort]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const currentPage = Math.min(page, totalPages);
  const paged = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, currentPage, perPage]);

  function setSortKey(key: keyof ClientRecord) {
    setSort(prev => {
      if (!prev || prev.key !== key) return { key, dir: 'asc' };
      if (prev.dir === 'asc') return { key, dir: 'desc' };
      return null;
    });
  }

  function headerSortClass(key: keyof ClientRecord): string {
    const base = 'sortable';
    if (!sort || sort.key !== key) return base;
    return `${base} ${sort.dir === 'asc' ? 'sorted-asc' : 'sorted-desc'}`;
  }

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="title">Client Management</div>
          <div className="muted">View, search, and filter platform clients</div>
        </div>
        <div className="controls">
          <input
            className="input"
            type="search"
            placeholder="Search by name or email"
            value={query}
            onChange={(e) => { setPage(1); setQuery(e.target.value); }}
          />
          <select
            className="select"
            value={status}
            onChange={(e) => { setPage(1); setStatus(e.target.value as StatusFilter); }}
          >
            <option value="All">All Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>
          <select
            className="select"
            value={perPage}
            onChange={(e) => { setPage(1); setPerPage(parseInt(e.target.value, 10)); }}
          >
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>
      <div className="card-body">
        <div className="table-wrapper">
          <table>
            <colgroup>
              <col style={{ width: '22%' }} />
              <col style={{ width: '28%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '12%' }} />
            </colgroup>
            <thead>
              <tr>
                <th className={headerSortClass('name')} onClick={() => setSortKey('name')}>Client Name</th>
                <th className={headerSortClass('email')} onClick={() => setSortKey('email')}>Email</th>
                <th className={headerSortClass('status')} onClick={() => setSortKey('status')}>Status</th>
                <th className={headerSortClass('balance')} onClick={() => setSortKey('balance')}>Balance</th>
                <th className={headerSortClass('registrationDate')} onClick={() => setSortKey('registrationDate')}>Registration Date</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td className="muted">{c.email}</td>
                  <td><span className={statusClass(c.status)}>{displayStatus(c.status)}</span></td>
                  <td className="number">{formatCurrency(c.balance)}</td>
                  <td className="muted">{c.registrationDate}</td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={5} className="muted">No clients match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <div>
            Showing <strong>{paged.length}</strong> of <strong>{total}</strong> clients
            {query && <> — search "{query}"</>}
          </div>
          <div className="pagination">
            <button className="page-btn" aria-label="First page" onClick={() => setPage(1)} disabled={currentPage === 1}>{'<<'}</button>
            <button className="page-btn" aria-label="Previous page" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>{'<'}</button>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const half = 2;
              let start = Math.max(1, currentPage - half);
              let end = Math.min(totalPages, currentPage + half);
              if (end - start < 4) {
                if (start === 1) end = Math.min(totalPages, start + 4);
                else if (end === totalPages) start = Math.max(1, end - 4);
              }
              const pageNum = start + i;
              if (pageNum > end) return null;
              return (
                <button
                  key={pageNum}
                  className={`page-btn ${pageNum === currentPage ? 'active' : ''}`}
                  onClick={() => setPage(pageNum)}
                  aria-current={pageNum === currentPage ? 'page' : undefined}
                  aria-label={`Page ${pageNum}`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button className="page-btn" aria-label="Next page" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>{'>'}</button>
            <button className="page-btn" aria-label="Last page" onClick={() => setPage(totalPages)} disabled={currentPage === totalPages}>{'>>'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}