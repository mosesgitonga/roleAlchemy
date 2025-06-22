import React from 'react';

const ProgressBar = ({ steps, currentStep }) => (
  <div className="progress-section mb-8">
    <div className="steps-container flex flex-wrap justify-between gap-2">
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <div key={step.id} className="step-item flex items-center space-x-2">
            <div
              className={`step-icon p-2 rounded-full ${index <= currentStep ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              <Icon size={20} />
            </div>
            <div className="step-text">
              <div className={`step-title font-medium ${index <= currentStep ? 'text-indigo-600' : 'text-gray-600'}`}>
                {step.title}
              </div>
              <div className="step-description text-sm text-gray-500">
                {step.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
    <div className="progress-bar mt-4 h-2 bg-gray-200 rounded-full">
      <div
        className="progress-fill h-2 bg-indigo-600 rounded-full transition-all duration-300"
        style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
      />
    </div>
  </div>
);

export default ProgressBar;