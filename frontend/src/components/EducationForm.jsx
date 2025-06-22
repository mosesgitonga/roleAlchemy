import React from 'react';
import { Trash2, Plus } from 'lucide-react';

const EducationForm = ({ education, errors, handleInputChange, addArrayItem, removeArrayItem }) => (
  <div className="form-section space-y-6">
    {education.map((edu, index) => (
      <div key={index} className="card p-6 border border-gray-200 rounded-lg shadow-sm">
        <div className="card-header flex justify-between items-center">
          <h4 className="card-title text-lg font-semibold">Education #{index + 1}</h4>
          {education.length > 1 && (
            <button
              type="button"
              onClick={() => removeArrayItem('education', index)}
              className="delete-button text-red-600 hover:text-red-800"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
        <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="form-label block text-sm font-medium text-gray-700">Institution</label>
            <input
              type="text"
              className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={edu.institution}
              onChange={(e) => handleInputChange('education', { institution: e.target.value }, index)}
              placeholder="University name"
            />
          </div>
          <div>
            <label className="form-label block text-sm font-medium text-gray-700">Degree/Certificate</label>
            <input
              type="text"
              className={`form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors[`education_${index}_certificate_level`] ? 'border-red-500' : ''}`}
              value={edu.certificate_level}
              onChange={(e) => handleInputChange('education', { certificate_level: e.target.value }, index)}
              placeholder="Bachelor's, Master's, etc."
            />
            {errors[`education_${index}_certificate_level`] && (
              <p className="error-message mt-1 text-sm text-red-500">{errors[`education_${index}_certificate_level`]}</p>
            )}
          </div>
        </div>
        <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="form-label block text-sm font-medium text-gray-700">Start Year</label>
            <input
              type="number"
              className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={edu.start_year}
              onChange={(e) => handleInputChange('education', { start_year: e.target.value }, index)}
              placeholder="2020"
            />
          </div>
          <div>
            <label className="form-label block text-sm font-medium text-gray-700">End Year</label>
            <input
              type="number"
              className={`form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors[`education_${index}_end_year`] ? 'border-red-500' : ''}`}
              value={edu.end_year}
              onChange={(e) => handleInputChange('education', { end_year: e.target.value }, index)}
              placeholder="2024"
            />
            {errors[`education_${index}_end_year`] && (
              <p className="error-message mt-1 text-sm text-red-500">{errors[`education_${index}_end_year`]}</p>
            )}
          </div>
        </div>
      </div>
    ))}
    <button
      type="button"
      onClick={() => addArrayItem('education')}
      className="add-button inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
    >
      <Plus size={16} className="add-icon mr-2" />
      Add Education
    </button>
  </div>
);

export default EducationForm;