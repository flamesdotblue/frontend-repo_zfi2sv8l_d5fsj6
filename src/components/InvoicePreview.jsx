export default function InvoicePreview({ data }) {
  if (!data) return null
  const { customer_name, customer_email, customer_address, invoice_number, issue_date, due_date, currency, items = [], notes, subtotal = 0, tax = 0, discount = 0, total = 0 } = data

  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Preview</h3>
          <p className="text-sm text-gray-500">This is what your customer will see</p>
        </div>
        {invoice_number && <span className="text-sm text-gray-600">#{invoice_number}</span>}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-medium">Bill To</p>
          <p className="text-gray-800">{customer_name || '-'} </p>
          <p className="text-gray-600">{customer_email || '-'}</p>
          {customer_address && <p className="text-gray-600 whitespace-pre-wrap">{customer_address}</p>}
        </div>
        <div className="sm:text-right">
          <p><span className="text-gray-500">Issue:</span> {issue_date || '-'}</p>
          <p><span className="text-gray-500">Due:</span> {due_date || '-'}</p>
          <p><span className="text-gray-500">Currency:</span> {currency || 'USD'}</p>
        </div>
      </div>

      <div className="mt-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2">Description</th>
              <th className="py-2">Qty</th>
              <th className="py-2">Unit</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={4} className="py-4 text-center text-gray-400">No items</td></tr>
            ) : (
              items.map((it, idx) => (
                <tr key={idx} className="border-b last:border-none">
                  <td className="py-2">{it.description}</td>
                  <td className="py-2">{Number(it.quantity || 0)}</td>
                  <td className="py-2">{Number(it.unit_price || 0).toFixed(2)}</td>
                  <td className="py-2 text-right">{currency} {(Number(it.quantity || 0) * Number(it.unit_price || 0)).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col items-end gap-1 text-sm">
        <div className="flex w-full sm:w-auto justify-between gap-8"><span className="text-gray-600">Subtotal</span><span>{currency} {Number(subtotal || 0).toFixed(2)}</span></div>
        <div className="flex w-full sm:w-auto justify-between gap-8"><span className="text-gray-600">Tax</span><span>{currency} {Number(tax || 0).toFixed(2)}</span></div>
        <div className="flex w-full sm:w-auto justify-between gap-8"><span className="text-gray-600">Discount</span><span>- {currency} {Number(discount || 0).toFixed(2)}</span></div>
        <div className="flex w-full sm:w-auto justify-between gap-8 font-semibold border-t pt-2 mt-1"><span>Total</span><span>{currency} {Number(total || 0).toFixed(2)}</span></div>
      </div>

      {notes && <p className="mt-4 text-sm text-gray-600 whitespace-pre-wrap">{notes}</p>}
    </div>
  )
}
