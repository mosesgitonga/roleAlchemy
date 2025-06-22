import React from 'react';
import { Trash2, Plus, SkipForward } from 'lucide-react';

const CertificationsForm = ({ certifications, errors, handleInputChange, addArrayItem, removeArrayItem, skipStep }) => (
  <div className="form-section space-y-6">
    <button
      type="button"
      onClick={skipStep}
      className="skip-button inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-md text-white bg-yellow-500 hover:bg-yellow-600 shadow-xl uppercase"
    >
      <SkipForward size={20} className="mr-2" />
      Skip Certifications
    </button>
    {certifications.map((cert, index) => (
      <div key={index} className="card p-6 border border-gray-200 rounded-lg shadow-sm">
        <div className="card-header flex justify-between items-center">
          <h4 className="card-title text-lg font-semibold">Certification #{index + 1}</h4>
          {certifications.length > 1 && (
            <button
              type="button"
              onClick={() => removeArrayItem('certifications', index)}
              className="delete-button text-red-600 hover:text-red-800"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
        <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="form-label block text-sm font-medium text-gray-700">Certification Title</label>
            <input
              type="text"
              className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={cert.title}
              onChange={(e) => handleInputChange('certifications', { title: e.target.value }, index)}
              placeholder="AWS Certified Developer"
            />
          </div>
          <div>
            <label className="form-label block text-sm font-medium text-gray-700">Issuer</label>
            <input
              type="text"
              className={`form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors[`certifications_${index}_issuer`] ? 'border-red-500' : ''}`}
              value={cert.issuer}
              onChange={(e) => handleInputChange('certifications', { issuer: e.target.value }, index)}
              placeholder="Amazon Web Services"
            />
            {errors[`certifications_${index}_issuer`] && (
              <p className="error-message mt-1 text-sm text-red-500">{errors[`certifications_${index}_issuer`]}</p>
            )}
          </div>
        </div>
        <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="form-label block text-sm font-medium text-gray-700">Issue Date</label>
            <input
              type="date"
              className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={cert.issue_date}
              onChange={(e) => handleInputChange('certifications', { issue_date: e.target.value }, index)}
            />
          </div>
          <div>
            <label className="form-label block text-sm font-medium text-gray-700">Expiration Date</label>
            <input
              type="date"
              className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={cert.expiration_date}
              onChange={(e) => handleInputChange('certifications', { expiration_date: e.target.value }, index)}
            />
          </div>
        </div>
      </div>
    ))}
    <button
      type="button"
      onClick={() => addArrayItem('certifications')}
      className="add-button inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
    >
      <Plus size={16} className="add-icon mr-2" />
      Add Certification
    </button>
  </div>
);

export default CertificationsForm;