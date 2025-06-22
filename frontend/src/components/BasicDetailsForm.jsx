import React from 'react';

const BasicDetailsForm = ({ formData, errors, handleInputChange, industries }) => (
  <div className="form-section space-y-6">
    <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="form-label block text-sm font-medium text-gray-700">Full Name *</label>
        <input
          type="text"
          className={`form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.full_name ? 'border-red-500' : ''}`}
          value={formData.full_name}
          onChange={(e) => handleInputChange('full_name', e.target.value)}
          placeholder="Enter your full name"
        />
        {errors.full_name && <p className="error-message mt-1 text-sm text-red-500">{errors.full_name}</p>}
      </div>
      <div>
        <label className="form-label block text-sm font-medium text-gray-700">Phone Number *</label>
        <input
          type="tel"
          className={`form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.phone ? 'border-red-500' : ''}`}
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          placeholder="+1 (555) 123-4567"
        />
        {errors.phone && <p className="error-message mt-1 text-sm text-red-500">{errors.phone}</p>}
      </div>
    </div>
    <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="form-label block text-sm font-medium text-gray-700">Industry</label>
        <select
          className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={formData.industry}
          onChange={(e) => handleInputChange('industry', e.target.value)}
        >
          {industries.map(industry => (
            <option key={industry.value} value={industry.value}>{industry.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="form-label block text-sm font-medium text-gray-700">City</label>
        <input
          type="text"
          className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={formData.city}
          onChange={(e) => handleInputChange('city', e.target.value)}
          placeholder="New York"
        />
      </div>
    </div>
    <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="form-label block text-sm font-medium text-gray-700">LinkedIn Profile (optional)</label>
        <input
          type="url"
          className={`form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.linkedin ? 'border-red-500' : ''}`}
          value={formData.linkedin}
          onChange={(e) => handleInputChange('linkedin', e.target.value)}
          placeholder="https://linkedin.com/in/username"
        />
        {errors.linkedin && <p className="error-message mt-1 text-sm text-red-500">{errors.linkedin}</p>}
      </div>
      <div>
        <label className="form-label block text-sm font-medium text-gray-700">GitHub Profile (optional)</label>
        <input
          type="url"
          className={`form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.github ? 'border-red-500' : ''}`}
          value={formData.github}
          onChange={(e) => handleInputChange('github', e.target.value)}
          placeholder="https://github.com/username"
        />
        {errors.github && <p className="error-message mt-1 text-sm text-red-500">{errors.github}</p>}
      </div>
    </div>
    <div>
      <label className="form-label block text-sm font-medium text-gray-700">Personal Website (optional)</label>
      <input
        type="url"
        className={`form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.website ? 'border-red-500' : ''}`}
        value={formData.website}
        onChange={(e) => handleInputChange('website', e.target.value)}
        placeholder="https://yourwebsite.com"
      />
      {errors.website && <p className="error-message mt-1 text-sm text-red-500">{errors.website}</p>}
    </div>
  </div>
);

export default BasicDetailsForm;