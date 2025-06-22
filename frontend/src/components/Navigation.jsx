import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Navigation = ({ currentStep, stepsLength, prevStep, nextStep, handleSubmit }) => (
  <div className="navigation mt-6 flex justify-between items-center">
    <button
      type="button"
      onClick={prevStep}
      disabled={currentStep === 0}
      className={`nav-button prev inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <ChevronLeft size={16} className="nav-icon mr-2" />
      Previous
    </button>
    <span className="step-counter text-sm text-gray-600">
      Step {currentStep + 1} of {stepsLength}
    </span>
    {currentStep === stepsLength - 1 ? (
      <button
        type="button"
        onClick={handleSubmit}
        className="nav-button submit inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Create Profile
      </button>
    ) : (
      <button
        type="button"
        onClick={nextStep}
        className="nav-button next inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Next
        <ChevronRight size={16} className="nav-icon ml-2" />
      </button>
    )}
  </div>
);

export default Navigation;