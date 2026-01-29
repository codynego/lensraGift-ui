'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Defined Types
type GiftOption = {
  label: string;
  tag: string;
  icon?: string;
  price?: number;
  description?: string;
};

type Question = {
  id: string;
  text: string;
  subtext?: string;
  options: GiftOption[];
};

const questions: Question[] = [
  {
    id: 'recipient',
    text: "Let's start with who you're gifting to",
    subtext: "This helps me understand the relationship and find something meaningful",
    options: [
      { label: 'My Partner', tag: 'romance', icon: '❤️', description: 'Someone special' },
      { label: 'A Friend', tag: 'friendship', icon: '🤝', description: 'Close companion' },
      { label: 'A Colleague', tag: 'corporate', icon: '💼', description: 'Professional connection' },
      { label: 'Family Member', tag: 'family', icon: '👨‍👩‍👧', description: 'Someone dear' },
    ],
  },
  {
    id: 'occasion',
    text: "What's the special occasion?",
    subtext: "Every moment deserves the perfect gift",
    options: [
      { label: 'Birthday', tag: 'birthday', icon: '🎂', description: 'Celebrate their day' },
      { label: 'Anniversary', tag: 'anniversary', icon: '💍', description: 'Mark the milestone' },
      { label: 'Just Because', tag: 'surprise', icon: '✨', description: 'Spontaneous joy' },
      { label: 'Appreciation', tag: 'thankyou', icon: '🙏', description: 'Show gratitude' },
    ],
  },
  {
    id: 'budget',
    text: 'What budget feels comfortable?',
    subtext: "Don't worry, every range has amazing options",
    options: [
      { label: 'Thoughtful', tag: 'budget-low', price: 15000, description: 'Under ₦15k' },
      { label: 'Generous', tag: 'budget-mid', price: 50000, description: '₦15k - ₦50k' },
      { label: 'Luxury', tag: 'budget-high', price: 200000, description: '₦50k+' },
    ],
  },
  {
    id: 'personality',
    text: 'How would you describe them?',
    subtext: "Let's match their vibe",
    options: [
      { label: 'Classic & Elegant', tag: 'classic', icon: '👔', description: 'Timeless style' },
      { label: 'Fun & Playful', tag: 'playful', icon: '🎨', description: 'Vibrant personality' },
      { label: 'Minimalist', tag: 'minimal', icon: '⚪', description: 'Clean & simple' },
      { label: 'Trendy', tag: 'trendy', icon: '✨', description: 'Fashion-forward' },
    ],
  },
];

export default function GiftFinder() {
  const [step, setStep] = useState(-1); // Start at -1 for welcome screen
  const [selections, setSelections] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  const startQuiz = () => {
    setStep(0);
  };

  const handleNext = async (tag: string) => {
    const updatedSelections = [...selections, tag];
   
    if (step < questions.length - 1) {
      setSelections(updatedSelections);
      setStep(step + 1);
    } else {
      setLoading(true);
      setError(null);
      setStep(step + 1);
     
      try {
        const tagsParam = updatedSelections.join(',');
        const response = await fetch(`https://api.lensra.com/api/products/gift-finder/recommendations/?tags=${tagsParam}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setResults(data.results || []);
      } catch (error) {
        console.error("Failed to fetch recommendations", error);
        setError("I couldn't load the recommendations right now. Let's try that again?");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      setSelections(selections.slice(0, -1));
    } else if (step === 0) {
      setStep(-1);
      setSelections([]);
    }
  };

  const resetQuiz = () => {
    setStep(-1);
    setSelections([]);
    setResults([]);
    setError(null);
  };

  // Welcome Screen
  if (step === -1) {
    return (
      <div className="max-w-5xl mx-auto p-6 md:p-12 min-h-[600px] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-8 flex items-center justify-center"
          >
            <span className="text-4xl">🎁</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent leading-tight">
            Your Personal Gift Concierge
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-4 leading-relaxed">
            Hi there! I'm here to help you find the perfect gift.
          </p>
          
          <p className="text-lg text-gray-500 mb-12 max-w-xl mx-auto">
            Just answer a few quick questions, and I'll handpick personalized recommendations from Lensra's collection that'll make your gift truly memorable.
          </p>
          
          <motion.button
            onClick={startQuiz}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-5 bg-black text-white text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
          >
            <span className="relative z-10">Let's Find Your Perfect Gift</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
              initial={{ x: '100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
          
          <p className="text-sm text-gray-400 mt-8">✨ Takes less than 2 minutes</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12 min-h-[600px]">
      {/* Header with Progress */}
      {step <= questions.length - 1 && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back</span>
            </button>
            
            <div className="text-sm font-medium text-gray-400">
              Question {step + 1} of {questions.length}
            </div>
          </div>
          
          {/* Progress Dots */}
          <div className="flex gap-2 justify-center">
            {questions.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === step ? 'w-12 bg-black' : idx < step ? 'w-2 bg-black' : 'w-2 bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step < questions.length ? (
          <motion.div
            key={step}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            {/* Question Header */}
            <div className="mb-12 text-center">
              <motion.h2
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 leading-tight"
              >
                {questions[step].text}
              </motion.h2>
              {questions[step].subtext && (
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg text-gray-500"
                >
                  {questions[step].subtext}
                </motion.p>
              )}
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {questions[step].options.map((opt, idx) => (
                <motion.button
                  key={opt.tag}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => handleNext(opt.tag)}
                  onMouseEnter={() => setHoveredOption(opt.tag)}
                  onMouseLeave={() => setHoveredOption(null)}
                  className="relative flex items-start gap-5 p-6 border-2 rounded-2xl transition-all duration-300 bg-white text-left group hover:shadow-xl hover:-translate-y-1"
                  style={{
                    borderColor: hoveredOption === opt.tag ? '#000' : '#f3f4f6',
                  }}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-3xl">{opt.icon ?? '₦'}</span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {opt.label}
                    </h3>
                    {opt.description && (
                      <p className="text-sm text-gray-500">
                        {opt.description}
                      </p>
                    )}
                  </div>
                  
                  {/* Arrow */}
                  <svg
                    className="w-6 h-6 text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full"
          >
            {loading ? (
              <div className="text-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-gray-100 border-t-black rounded-full mx-auto mb-6"
                />
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl text-gray-600 font-medium mb-2"
                >
                  Curating your perfect gifts...
                </motion.p>
                <p className="text-sm text-gray-400">This won't take long</p>
              </div>
            ) : error ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-20 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-100"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-3xl">😔</span>
                </div>
                <p className="text-gray-700 text-lg mb-6 max-w-md mx-auto">{error}</p>
                <button
                  onClick={resetQuiz}
                  className="px-8 py-3 bg-black text-white rounded-full font-semibold hover:shadow-lg transition-all"
                >
                  Start Over
                </button>
              </motion.div>
            ) : (
              <div>
                {/* Results Header */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="mb-12"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Here's what I found for you
                      </h2>
                      <p className="text-gray-500">
                        {results.length} carefully selected {results.length === 1 ? 'gift' : 'gifts'} based on your preferences
                      </p>
                    </div>
                    <button
                      onClick={resetQuiz}
                      className="px-6 py-3 border-2 border-gray-200 rounded-full font-semibold text-gray-700 hover:border-black hover:text-black transition-all"
                    >
                      Start New Search
                    </button>
                  </div>
                  
                  {/* Selection Summary */}
                  <div className="flex flex-wrap gap-2">
                    {selections.map((sel, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700"
                      >
                        {sel}
                      </span>
                    ))}
                  </div>
                </motion.div>

                {results.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((product, idx) => (
                      <motion.div
                        key={product.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100"
                      >
                        {/* Product Image */}
                        <div className="aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        
                        {/* Product Info */}
                        <div className="p-6">
                          <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-2xl font-bold text-gray-900 mb-4">
                            ₦{Number(product.base_price).toLocaleString()}
                          </p>
                          <button className="w-full py-3 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-900 transition-colors relative overflow-hidden group">
                            <span className="relative z-10">Personalize & Order</span>
                          </button>
                        </div>
                        
                        {/* Recommended Badge */}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
                          Recommended
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-20 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-100"
                  >
                    <div className="w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <span className="text-3xl">🔍</span>
                    </div>
                    <p className="text-gray-700 text-lg mb-2 font-medium">No exact matches found</p>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      Let's try adjusting your preferences to find more options
                    </p>
                    <button
                      onClick={resetQuiz}
                      className="px-8 py-3 bg-black text-white rounded-full font-semibold hover:shadow-lg transition-all"
                    >
                      Start New Search
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}