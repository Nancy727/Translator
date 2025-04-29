export default function AnswerPopup({ isCorrect, message, points, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className={`relative transform overflow-hidden rounded-2xl shadow-2xl transition-all max-w-lg w-full ${
        isCorrect ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10' : 'bg-gradient-to-br from-red-500/10 to-pink-500/10'
      }`}>
        <div className="p-8 backdrop-blur-xl border border-white/10">
          <div className="flex justify-center mb-4">
            {isCorrect ? (
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>
          
          <h3 className={`text-2xl font-bold text-center mb-2 ${
            isCorrect ? 'text-green-400' : 'text-red-400'
          }`}>
            {isCorrect ? 'Excellent!' : 'Not Quite'}
          </h3>
          
          <p className="text-gray-300 text-center mb-4">{message}</p>
          
          {isCorrect && points && (
            <div className="flex justify-center items-center gap-2 mb-6">
              <div className="px-4 py-2 bg-green-500/20 rounded-lg border border-green-500/30">
                <span className="text-green-400 font-semibold">+{points} points</span>
              </div>
            </div>
          )}
          
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}