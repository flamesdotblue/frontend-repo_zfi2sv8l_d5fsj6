import { useEffect, useState } from 'react'
import { Copy, Link as LinkIcon, CheckCircle } from 'lucide-react'

export default function ShareLinkCard({ sharePath, onClose }) {
  const [copied, setCopied] = useState(false)

  const base = import.meta.env.VITE_BACKEND_URL || ''
  const fullUrl = `${base}${sharePath}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (e) {
      console.error('Copy failed', e)
    }
  }

  return (
    <div className="rounded-lg border bg-green-50 p-4">
      <div className="flex items-start gap-3">
        <div className="text-green-600 mt-0.5"><CheckCircle size={20} /></div>
        <div className="flex-1">
          <p className="font-medium text-green-800">Invoice created</p>
          <p className="text-sm text-green-700">Share this link with your customer:</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white border rounded px-3 py-2 text-sm w-full">
              <LinkIcon size={16} className="text-gray-500" />
              <span className="truncate">{fullUrl}</span>
            </div>
            <button onClick={copyLink} className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded bg-green-600 text-white hover:bg-green-700">
              <Copy size={16} /> {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
