import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#F5F8FF] flex items-center justify-center px-6">
      <div className="text-center max-w-lg">

        {/* Big 404 */}
        <div className="relative mb-8">
          <p className="font-display text-[10rem] font-bold text-[#EBF2FF]
                        leading-none select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-[#0A1F5C] rounded-2xl flex items-center
                            justify-center shadow-xl">
              <span className="text-4xl">🏠</span>
            </div>
          </div>
        </div>

        <h1 className="font-display text-3xl font-bold text-[#0A1F5C] mb-3">
          Page Not Found
        </h1>
        <p className="text-gray-500 leading-relaxed mb-8">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back to finding your perfect stay.
        </p>

        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => navigate('/')}
            className="bg-[#1A56DB] text-white px-8 py-3.5 rounded-xl font-semibold
                       hover:bg-[#0A1F5C] transition-colors shadow-sm">
            Back to Home
          </button>
          <button onClick={() => navigate('/properties')}
            className="border-2 border-[#1A56DB] text-[#1A56DB] px-8 py-3.5
                       rounded-xl font-semibold hover:bg-[#EBF2FF] transition-colors">
            Browse Properties
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-[#EBF2FF]">
          <p className="text-gray-400 text-sm">
            Need help?{' '}
            <a href="tel:0748939050"
              className="text-[#1A56DB] font-medium hover:underline">
              Call us on 0748 939 050
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}