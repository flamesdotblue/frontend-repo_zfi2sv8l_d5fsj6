import { Receipt, Send } from 'lucide-react'

export default function Header() {
  return (
    <header className="w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-indigo-600 text-white">
            <Receipt size={20} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Link Invoices</h1>
            <p className="text-xs text-gray-500">Create, store, and share invoice links</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
          <Send size={16} />
          <span>No more printing — just share a link</span>
        </div>
      </div>
    </header>
  )
}
