import { useMemo, useState } from 'react'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import InvoicePreview from './InvoicePreview'
import ShareLinkCard from './ShareLinkCard'

const emptyItem = { description: '', quantity: 1, unit_price: 0 }

export default function InvoiceForm({ onCreated }) {
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_address: '',
    invoice_number: '',
    issue_date: new Date().toISOString().slice(0,10),
    due_date: '',
    currency: 'USD',
    items: [ { ...emptyItem } ],
    notes: '',
    tax: 0,
    discount: 0,
  })
  const [loading, setLoading] = useState(false)
  const [sharePath, setSharePath] = useState(null)

  const subtotal = useMemo(() => form.items.reduce((sum, it) => sum + (Number(it.quantity || 0) * Number(it.unit_price || 0)), 0), [form.items])
  const total = useMemo(() => Math.max(subtotal + Number(form.tax || 0) - Number(form.discount || 0), 0), [subtotal, form.tax, form.discount])

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const updateItem = (idx, key, value) => {
    setForm(prev => {
      const items = prev.items.map((it, i) => i === idx ? { ...it, [key]: value } : it)
      return { ...prev, items }
    })
  }

  const addItem = () => setForm(prev => ({ ...prev, items: [...prev.items, { ...emptyItem }] }))
  const removeItem = (idx) => setForm(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSharePath(null)

    const payload = {
      ...form,
      items: form.items.filter(it => it.description.trim() !== ''),
      subtotal: Number(subtotal.toFixed(2)),
      tax: Number(Number(form.tax || 0).toFixed(2)),
      discount: Number(Number(form.discount || 0).toFixed(2)),
      total: Number(total.toFixed(2))
    }

    try {
      const base = import.meta.env.VITE_BACKEND_URL
      const res = await fetch(`${base}/api/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Failed to create invoice')
      const data = await res.json()
      setSharePath(data.share_url)
      onCreated?.(data)
    } catch (e) {
      alert(e.message || 'Error creating invoice')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <form onSubmit={submit} className="rounded-lg border bg-white p-4 space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Create Invoice</h3>
          <p className="text-sm text-gray-500">Fill details and generate a shareable link</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-700">Customer name</label>
            <input value={form.customer_name} onChange={e => update('customer_name', e.target.value)} className="w-full rounded border px-3 py-2" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-700">Customer email</label>
            <input type="email" value={form.customer_email} onChange={e => update('customer_email', e.target.value)} className="w-full rounded border px-3 py-2" required />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm text-gray-700">Customer address</label>
            <textarea value={form.customer_address} onChange={e => update('customer_address', e.target.value)} className="w-full rounded border px-3 py-2" rows={2} placeholder="Street, City, Country" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-700">Invoice number (optional)</label>
            <input value={form.invoice_number} onChange={e => update('invoice_number', e.target.value)} className="w-full rounded border px-3 py-2" placeholder="e.g. INV-2025-001" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-700">Currency</label>
            <input value={form.currency} onChange={e => update('currency', e.target.value)} className="w-full rounded border px-3 py-2" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-700">Issue date</label>
            <input type="date" value={form.issue_date} onChange={e => update('issue_date', e.target.value)} className="w-full rounded border px-3 py-2" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-700">Due date</label>
            <input type="date" value={form.due_date} onChange={e => update('due_date', e.target.value)} className="w-full rounded border px-3 py-2" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-700">Items</label>
          <div className="space-y-3">
            {form.items.map((it, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2">
                <input className="col-span-6 rounded border px-3 py-2" placeholder="Description" value={it.description} onChange={e => updateItem(idx, 'description', e.target.value)} />
                <input type="number" min={0} step="0.01" className="col-span-2 rounded border px-3 py-2" placeholder="Qty" value={it.quantity} onChange={e => updateItem(idx, 'quantity', e.target.value)} />
                <input type="number" min={0} step="0.01" className="col-span-3 rounded border px-3 py-2" placeholder="Unit price" value={it.unit_price} onChange={e => updateItem(idx, 'unit_price', e.target.value)} />
                <button type="button" onClick={() => removeItem(idx)} className="col-span-1 inline-flex items-center justify-center rounded border text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>
              </div>
            ))}
            <button type="button" onClick={addItem} className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded border hover:bg-gray-50"><Plus size={16} /> Add item</button>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-700">Tax</label>
            <input type="number" min={0} step="0.01" value={form.tax} onChange={e => update('tax', e.target.value)} className="w-full rounded border px-3 py-2" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-700">Discount</label>
            <input type="number" min={0} step="0.01" value={form.discount} onChange={e => update('discount', e.target.value)} className="w-full rounded border px-3 py-2" />
          </div>
          <div className="flex items-end">
            <div className="w-full rounded border bg-gray-50 px-3 py-2 text-sm flex justify-between"><span>Total</span><span>{form.currency} {total.toFixed(2)}</span></div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-700">Notes</label>
          <textarea value={form.notes} onChange={e => update('notes', e.target.value)} className="w-full rounded border px-3 py-2" rows={3} placeholder="Payment terms, bank details, etc." />
        </div>

        <button disabled={loading} className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60">
          {loading && <Loader2 className="animate-spin" size={16} />} Create invoice link
        </button>

        {sharePath && <ShareLinkCard sharePath={sharePath} />}
      </form>

      <div>
        <InvoicePreview data={{ ...form, subtotal, total }} />
      </div>
    </div>
  )
}
