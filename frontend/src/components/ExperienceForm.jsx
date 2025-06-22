import React from 'react';
import { Trash2, Plus } from 'lucide-react';

const ExperienceForm = ({ experience, errors, handleInputChange, addArrayItem, removeArrayItem }) => (
  <div className="form-section space-y-6">
    {experience.map((exp, index) => (
      <div key={index} className="card p-6 border border-gray-200 rounded-lg shadow-sm">
        <div className="card-header flex justify-between items-center">
          <h4 className="card-title text-lg font-semibold">Experience #{index + 1}</h4>
          {experience.length > 1 && (
            <button
              type="button"
              onClick={() => removeArrayItem('experience', index)}
              className="delete-button text-red-600 hover:text-red-800"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
        <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="form-label block text-sm font-medium text-gray-700">Job Title</label>
            <input
              type="text"
              className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={exp.title}
              onChange={(e) => handleInputChange('experience', { title: e.target.value }, index)}
              placeholder="Software Engineer"
            />
          </div>
          <div>
            <label className="form-label block text-sm font-medium text-gray-700">Position</label>
            <input
              type="text"
              className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={exp.position}
              onChange={(e) => handleInputChange('experience', { position: e.target.value }, index)}
              placeholder="Senior, Junior, Lead, etc."
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="form-label block text-sm font-medium text-gray-700">Company</label>
          <input
            type="text"
            className={`form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors[`experience_${index}_company`] ? 'border-red-500' : ''}`}
            value={exp.company}
            onChange={(e) => handleInputChange('experience', { company: e.target.value }, index)}
            placeholder="Company name"
          />
          {errors[`experience_${index}_company`] && (
            <p className="error-message mt-1 text-sm text-red-500">{errors[`experience_${index}_company`]}</p>
          )}
        </div>
        <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="form-label block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={exp.start_date}
              onChange={(e) => handleInputChange('experience', { start_date: e.target.value }, index)}
            />
          </div>
          <div>
            <label className="form-label block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              className={`form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors[`experience_${index}_end_date`] ? 'border-red-500' : ''}`}
              value={exp.end_date}
              onChange={(e) => handleInputChange('experience', { end_date: e.target.value }, index)}
            />
            {errors[`experience_${index}_end_date`] && (
              <p className="error-message mt-1 text-sm text-red-500">{errors[`experience_${index}_end_date`]}</p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <label className="form-label block text-sm font-medium text-gray-700">Description</label>
          <textarea
            className="form-textarea mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            rows="3"
            value={exp.description}
            onChange={(e) => handleInputChange('experience', { description: e.target.value }, index)}
            placeholder="Describe your role and achievements..."
          />
        </div>
      </div>
    ))}
    <button
      type="button"
      onClick={() => addArrayItem('experience')}
      className="add-button inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
    >
      <Plus size={16} className="add-icon mr-2" />
      Add Experience
    </button>
  </div>
);

export default ExperienceForm;