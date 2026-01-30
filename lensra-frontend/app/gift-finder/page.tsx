"use client"

import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

interface Answer {
  recipient: string;
  occasion: string;
  preferences: string[];
  priceRange: string;
}

interface Option {
  value: string;
  label: string;
  icon: string;
  color: string;
  range?: string;
}

interface Step {
  id: keyof Answer;
  question: string;
  subtitle: string;
  multiSelect?: boolean;
  options: Option[];
}

interface Product {
  id: number;
  name: string;
  base_price: number;
  image_url?: string;
}

const GiftFinder = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answer>({
    recipient: '',
    occasion: '',
    preferences: [],
    priceRange: ''
  });
  const [results, setResults] = useState<Product[] | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";

  const steps: Step[] = [
    {
      id: 'recipient',
      question: 'Who are you shopping for?',
      subtitle: 'Choose the lucky recipient',
      options: [
        { value: 'him', label: 'For Him', icon: '👨', color: 'from-blue-600/20 to-blue-800/20' },
        { value: 'her', label: 'For Her', icon: '👩', color: 'from-pink-600/20 to-pink-800/20' },
        { value: 'kids', label: 'For Kids', icon: '👶', color: 'from-yellow-600/20 to-yellow-800/20' },
        { value: 'parent', label: 'For Parents', icon: '👴', color: 'from-purple-600/20 to-purple-800/20' },
        { value: 'self', label: 'For Myself', icon: '🎁', color: 'from-green-600/20 to-green-800/20' },
        { value: 'couple', label: 'For Couples', icon: '💑', color: 'from-red-600/20 to-red-800/20' }
      ]
    },
    {
      id: 'occasion',
      question: "What's the occasion?",
      subtitle: 'Make it memorable',
      options: [
        { value: 'birthday', label: 'Birthday', icon: '🎂', color: 'from-orange-600/20 to-orange-800/20' },
        { value: 'anniversary', label: 'Anniversary', icon: '💝', color: 'from-red-600/20 to-red-800/20' },
        { value: 'wedding', label: 'Wedding', icon: '💒', color: 'from-pink-600/20 to-pink-800/20' },
        { value: 'graduation', label: 'Graduation', icon: '🎓', color: 'from-blue-600/20 to-blue-800/20' },
        { value: 'christmas', label: 'Christmas', icon: '🎄', color: 'from-green-600/20 to-green-800/20' },
        { value: 'valentines', label: "Valentine's", icon: '❤️', color: 'from-red-600/20 to-red-800/20' },
        { value: 'justbecause', label: 'Just Because', icon: '✨', color: 'from-purple-600/20 to-purple-800/20' },
        { value: 'other', label: 'Other', icon: '🎉', color: 'from-zinc-600/20 to-zinc-800/20' }
      ]
    },
    {
      id: 'preferences',
      question: 'What would they like?',
      subtitle: 'Select all that apply',
      multiSelect: true,
      options: [
        { value: 'fashion', label: 'Fashion', icon: '👔', color: 'from-pink-600/20 to-pink-800/20' },
        { value: 'gadgets', label: 'Gadgets', icon: '📱', color: 'from-blue-600/20 to-blue-800/20' },
        { value: 'sports', label: 'Sports', icon: '⚽', color: 'from-green-600/20 to-green-800/20' },
        { value: 'art', label: 'Art & Design', icon: '🎨', color: 'from-purple-600/20 to-purple-800/20' },
        { value: 'books', label: 'Books', icon: '📚', color: 'from-orange-600/20 to-orange-800/20' },
        { value: 'music', label: 'Music', icon: '🎵', color: 'from-red-600/20 to-red-800/20' },
        { value: 'gaming', label: 'Gaming', icon: '🎮', color: 'from-cyan-600/20 to-cyan-800/20' },
        { value: 'travel', label: 'Travel', icon: '✈️', color: 'from-yellow-600/20 to-yellow-800/20' },
        { value: 'home', label: 'Home Decor', icon: '🏠', color: 'from-emerald-600/20 to-emerald-800/20' },
        { value: 'fitness', label: 'Fitness', icon: '💪', color: 'from-lime-600/20 to-lime-800/20' },
        { value: 'beauty', label: 'Beauty', icon: '💄', color: 'from-rose-600/20 to-rose-800/20' },
        { value: 'food', label: 'Food & Drink', icon: '🍕', color: 'from-amber-600/20 to-amber-800/20' }
      ]
    },
    {
      id: 'priceRange',
      question: "What's your budget?",
      subtitle: 'We have something for every budget',
      options: [
        { value: 'budget', label: 'Budget Friendly', range: '₦5,000 - ₦15,000', icon: '💵', color: 'from-green-600/20 to-green-800/20' },
        { value: 'moderate', label: 'Moderate', range: '₦15,000 - ₦35,000', icon: '💰', color: 'from-blue-600/20 to-blue-800/20' },
        { value: 'premium', label: 'Premium', range: '₦35,000 - ₦75,000', icon: '💎', color: 'from-purple-600/20 to-purple-800/20' },
        { value: 'luxury', label: 'Luxury', range: '₦75,000+', icon: '👑', color: 'from-red-600/20 to-red-800/20' }
      ]
    }
  ];

  const currentStep = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  const priceMap: { [key: string]: string } = {
    budget: 'low',
    moderate: 'mid',
    premium: 'high',
    luxury: 'high'
  };

  const handleSelect = (value: string) => {
    const stepId = currentStep.id;
    
    if (currentStep.multiSelect) {
      setAnswers(prev => {
        const currentPrefs = prev.preferences || [];
        const newPrefs = currentPrefs.includes(value)
          ? currentPrefs.filter(p => p !== value)
          : [...currentPrefs, value];
        return { ...prev, preferences: newPrefs };
      });
    } else {
      setAnswers(prev => ({ ...prev, [stepId]: value }));
      // Auto-advance for single select
      setTimeout(() => {
        if (step < steps.length - 1) {
          setStep(step + 1);
        }
      }, 300);
    }
  };

  const isSelected = (value: string) => {
    const stepId = currentStep.id;
    if (currentStep.multiSelect) {
      return answers.preferences.includes(value);
    }
    return answers[stepId] === value;
  };

  const canProceed = () => {
    const stepId = currentStep.id;
    if (currentStep.multiSelect) {
      return true; // Allow proceeding even with zero selections for preferences
    }
    return !!answers[stepId];
  };

  const handleNext = () => {
    if (step < steps.length - 1 && canProceed()) {
      setStep(step + 1);
    } else if (step === steps.length - 1 && canProceed()) {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    const budgetTag = answers.priceRange ? `budget-${priceMap[answers.priceRange]}` : '';
    const tags = [
      answers.recipient,
      answers.occasion,
      ...answers.preferences,
      budgetTag
    ].filter(t => t).join(',');

    fetch(`${BaseUrl}api/products/gift-finder/recommendations/?tags=${tags}`)
      .then(response => response.json())
      .then(data => {
        setResults(data.results || []);
        setIsCompleted(true);
      })
      .catch(error => {
        console.error('Error fetching recommendations:', error);
        alert('Failed to fetch recommendations. Please try again.');
      });
  };

  if (isCompleted) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8">Recommended Gifts</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          {results?.map((product) => (
            <div key={product.id} className="bg-zinc-900 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-red-600/20">
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-40 md:h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-sm md:text-base text-white mb-1">{product.name}</h3>
                <p className="text-red-500 font-semibold text-sm">₦{product.base_price.toLocaleString()}</p>
              </div>
            </div>
          ))}
          {(!results || results.length === 0) && (
            <p className="col-span-full text-center text-zinc-400 text-lg">No recommendations found. Try different options!</p>
          )}
        </div>
        <button 
          onClick={() => {
            setIsCompleted(false);
            setResults(null);
            setStep(0);
            setAnswers({
              recipient: '',
              occasion: '',
              preferences: [],
              priceRange: ''
            });
          }} 
          className="px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 mx-auto block"
        >
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-zinc-400">
            Step {step + 1} of {steps.length}
          </span>
          <span className="text-sm font-medium text-zinc-400">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
          {currentStep.question}
        </h2>
        <p className="text-lg text-zinc-400">
          {currentStep.subtitle}
        </p>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {currentStep.options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`
              relative group overflow-hidden rounded-xl p-4 transition-all duration-300
              ${isSelected(option.value) 
                ? 'bg-gradient-to-br from-red-600/30 to-red-800/30 border border-red-600 shadow-lg shadow-red-600/20' 
                : 'bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800'
              }
            `}
          >
            {/* Animated Background Gradient */}
            <div className={`
              absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-50 transition-opacity duration-300
            `} />
            
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-2">
              <div className={`
                text-3xl transition-transform duration-300
                ${isSelected(option.value) ? 'scale-105' : 'group-hover:scale-105'}
              `}>
                {option.icon}
              </div>
              <div>
                <div className={`
                  font-bold text-sm md:text-base transition-colors
                  ${isSelected(option.value) ? 'text-white' : 'text-zinc-300 group-hover:text-white'}
                `}>
                  {option.label}
                </div>
                {option.range && (
                  <div className="text-xs text-zinc-500 mt-1">
                    {option.range}
                  </div>
                )}
              </div>
            </div>

            {/* Selection Indicator */}
            {isSelected(option.value) && (
              <div className="absolute top-2 right-2 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Multi-select hint */}
      {currentStep.multiSelect && (
        <div className="text-center mb-6">
          <p className="text-sm text-zinc-500">
            {answers.preferences.length > 0 
              ? `${answers.preferences.length} interest${answers.preferences.length > 1 ? 's' : ''} selected`
              : 'Select any that apply'
            }
          </p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-8">
        {step > 0 && (
          <button
            onClick={handleBack}
            className="flex-1 px-6 py-4 bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold rounded-xl hover:bg-zinc-800 hover:border-zinc-700 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            BACK
          </button>
        )}
        
        {(currentStep.multiSelect || step === steps.length - 1) && (
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`
              flex-1 px-6 py-4 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wide
              ${canProceed()
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg shadow-red-600/30'
                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
              }
            `}
          >
            {step === steps.length - 1 ? (
              <>
                <Sparkles className="w-5 h-5" />
                Find My Gift
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default GiftFinder;