'use client';

export default function Toast({ message, type = 'success', onClose }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className={`px-4 py-3 rounded-lg shadow-lg backdrop-blur-xl flex items-center gap-2 ${
        type === 'success' ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'
      }`}>
        <svg
          className={`w-5 h-5 ${type === 'success' ? 'text-green-400' : 'text-red-400'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {type === 'success' ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          )}
        </svg>
        <p className={`text-sm ${type === 'success' ? 'text-green-100' : 'text-red-100'}`}>
          {message}
        </p>
        <button
          onClick={onClose}
          className="ml-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}