'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Defined Types
type GiftOption = {
  label: string;
  tag: string;
  icon?: string;
  price?: number;
};

type Question = {
  id: string;
  text: string;
  options: GiftOption[];
};

const questions: Question[] = [
  {
    id: 'recipient',
    text: 'Who are you shopping for?',
    options: [
      { label: 'Partner', tag: 'romance', icon: '❤️' },
      { label: 'Friend', tag: 'friendship', icon: '🤝' },
      { label: 'Colleague', tag: 'corporate', icon: '💼' },
    ],
  },
  {
    id: 'occasion',
    text: 'What is the occasion?',
    options: [
      { label: 'Birthday', tag: 'birthday', icon: '🎂' },
      { label: 'Anniversary', tag: 'anniversary', icon: '💍' },
      { label: 'Just Because', tag: 'surprise', icon: '✨' },
    ],
  },
  {
    id: 'budget',
    text: 'Select your budget range',
    options: [
      { label: 'Under ₦15k', tag: 'budget-low', price: 15000 },
      { label: '₦15k - ₦50k', tag: 'budget-mid', price: 50000 },
      { label: 'Luxury (₦50k+)', tag: 'budget-high', price: 200000 },
    ],
  },
];

export default function GiftFinder() {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = async (tag: string) => {
    const updatedSelections = [...selections, tag];
   
    if (step < questions.length - 1) {
      setSelections(updatedSelections);
      setStep(step + 1);
    } else {
      setLoading(true);
      setError(null); // Reset error
      setStep(step + 1);
     
      try {
        const tagsParam = updatedSelections.join(',');

        const response = await fetch(`https://api.lensra.com/api/products/gift-recommendations/?tags=${tagsParam}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setResults(data.results || []);
      } catch (error) {
        console.error("Failed to fetch recommendations", error);
        setError('Sorry, we couldn’t load recommendations right now. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetQuiz = () => {
    setStep(0);
    setSelections([]);
    setResults([]);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 min-h-[500px] flex flex-col justify-center bg-white">
      {/* Progress Bar */}
      {step <= questions.length - 1 && (
        <div className="w-full bg-gray-100 h-2 rounded-full mb-8">
          <div
            className="bg-black h-2 rounded-full transition-all duration-300"
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
          />
        </div>
      )}
      <AnimatePresence mode="wait">
        {step < questions.length ? (
          <motion.div
            key={step}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="text-center"
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-10 text-gray-900 leading-tight">
              {questions[step].text}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {questions[step].options.map((opt) => (
                <button
                  key={opt.tag}
                  onClick={() => handleNext(opt.tag)}
                  className="flex flex-col items-center justify-center p-8 border-2 border-gray-100 rounded-3xl hover:border-black hover:shadow-xl transition-all duration-300 bg-white group"
                >
                  <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                    {opt.icon ?? '₦'}
                  </span>
                  <span className="text-lg font-bold text-gray-800">{opt.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
            {loading ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-6"></div>
                <p className="text-xl text-gray-500 font-medium">Curating your perfect Lensra gifts...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20 bg-gray-50 rounded-3xl">
                <p className="text-red-500 text-lg mb-4">{error}</p>
                <button onClick={resetQuiz} className="px-8 py-3 bg-black text-white rounded-full font-bold">Try Again</button>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-3xl font-bold">Recommended for You</h2>
                  <button onClick={resetQuiz} className="text-sm font-semibold underline text-gray-500 hover:text-black">
                    Start Over
                  </button>
                </div>
               
                {results.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {results.map((product) => (
                      <div key={product.id} className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow">
                        <div className="aspect-square overflow-hidden bg-gray-100">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-gray-900 text-lg mb-1">{product.name}</h3>
                          <p className="text-gray-900 font-bold">₦{Number(product.price).toLocaleString()}</p>
                          <button className="w-full mt-5 py-3 bg-black text-white text-sm font-bold rounded-xl hover:opacity-90 transition-opacity">
                            Personalize & Order
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-gray-50 rounded-3xl">
                    <p className="text-gray-500 text-lg">No exact matches found. Try widening your filters!</p>
                    <button onClick={resetQuiz} className="mt-4 px-8 py-3 bg-black text-white rounded-full font-bold">Try Again</button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}