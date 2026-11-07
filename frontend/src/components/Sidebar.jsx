import { FileText, Upload, MessageSquare } from 'lucide-react'

export default function Sidebar({ docs, activeDoc, onDocSelect, onUploadClick }) {
  return (
    <aside className="w-64 flex-shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <MessageSquare size={20} className="text-blue-400" />
          <span className="font-semibold text-white text-sm">PDF RAG QA</span>
        </div>
      </div>

      {/* Doc list */}
      <div className="flex-1 overflow-y-auto p-3">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 px-1">Documents</p>
        {docs.length === 0 ? (
          <p className="text-xs text-gray-600 px-1">No documents indexed yet.</p>
        ) : (
          <ul className="space-y-1">
            {docs.map((doc) => {
              const isActive = activeDoc?.collection_name === doc.collection_name
              return (
                <li key={doc.collection_name}>
                  <button
                    onClick={() => onDocSelect(doc)}
                    className={`w-full text-left flex items-start gap-2 px-2 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-300 border border-blue-600/30'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                    }`}
                  >
                    <FileText size={14} className="mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{doc.filename}</p>
                      {doc.num_chunks && (
                        <p className="text-xs text-gray-500">{doc.num_chunks} chunks</p>
                      )}
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Upload button */}
      <div className="p-3 border-t border-gray-800">
        <button
          onClick={onUploadClick}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
        >
          <Upload size={14} />
          Upload PDF
        </button>
      </div>
    </aside>
  )
}