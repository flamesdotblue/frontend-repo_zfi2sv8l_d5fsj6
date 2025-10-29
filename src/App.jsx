import Header from './components/Header'
import InvoiceForm from './components/InvoiceForm'
import InvoiceList from './components/InvoiceList'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Send invoices as links, not printouts</h2>
          <p className="text-gray-600 mt-1">Create a bill, store it securely, and share a link your customer can open on any device.</p>
        </div>

        <InvoiceForm />
        <InvoiceList />
      </main>
      <footer className="py-8 text-center text-xs text-gray-500">Built for easy digital billing</footer>
    </div>
  )
}

export default App
