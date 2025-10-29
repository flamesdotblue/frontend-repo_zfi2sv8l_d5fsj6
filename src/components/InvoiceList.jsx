import { useEffect, useState } from 'react'
import { ExternalLink, RefreshCcw } from 'lucide-react'

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const base = import.meta.env.VITE_BACKEND_URL
      const res = await fetch(`${base}/api/invoices`)
      const data = await res.json()
      setInvoices(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const copy = async (id) => {
    const base = import.meta.env.VITE_BACKEND_URL || ''
    const url = `${base}/public/invoices/${id}`
    await navigator.clipboard.writeText(url)
    alert('Share link copied to clipboard')
  }

  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold">Recent Invoices</h3>
          <p className="text-sm text-gray-500">Stored securely and ready to share</p>
        </div>
        <button onClick={load} className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded border hover:bg-gray-50"><RefreshCcw size={14} /> Refresh</button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : invoices.length === 0 ? (
        <p className="text-sm text-gray-500">No invoices yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2">Customer</th>
                <th className="py-2">Issue</th>
                <th className="py-2">Total</th>
                <th className="py-2">Status</th>
                <th className="py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} className="border-b last:border-none">
                  <td className="py-2">{inv.customer_name}</td>
                  <td className="py-2">{inv.issue_date?.slice(0,10)}</td>
                  <td className="py-2">{inv.currency} {Number(inv.total || 0).toFixed(2)}</td>
                  <td className="py-2 capitalize">{inv.status}</td>
                  <td className="py-2 text-right">
                    <button onClick={() => copy(inv.id)} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded border hover:bg-gray-50">
                      Copy link
                    </button>
                    <a href={`${import.meta.env.VITE_BACKEND_URL || ''}/public/invoices/${inv.id}`} target="_blank" className="inline-flex items-center gap-1 ml-2 px-2 py-1 text-xs rounded border hover:bg-gray-50">
                      Open <ExternalLink size={12} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
