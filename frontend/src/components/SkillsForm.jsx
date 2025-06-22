import React from 'react';
import { Trash2 } from 'lucide-react';

const SkillsForm = ({ formData, errors, currentSkill, setCurrentSkill, handleSkillInput, removeSkill, skillSuggestions }) => (
  <div className="form-section space-y-6">
    <div>
      <label className="form-label block text-sm font-medium text-gray-700">Skills *</label>
      <input
        type="text"
        list="skill-suggestions"
        className={`form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.skills_error ? 'border-red-500' : ''}`}
        value={currentSkill}
        onChange={handleSkillInput}
        placeholder={formData.industry ? `Type skills separated by commas, e.g., ${skillSuggestions[formData.industry][0] || 'Communication'}` : 'Type skills separated by commas'}
        aria-describedby="skills-error"
      />
      <datalist id="skill-suggestions">
        {skillSuggestions[formData.industry || ''].map((skill, index) => (
          <option key={index} value={skill} />
        ))}
      </datalist>
      {errors.skills_error && <p id="skills-error" className="error-message mt-1 text-sm text-red-500">{errors.skills_error}</p>}
    </div>
    <div className="flex flex-wrap gap-2 mt-2">
      {formData.skills.map((skill, index) => (
        <div
          key={index}
          className="skill-item inline-flex items-center bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full"
        >
          <span>{skill}</span>
          <button
            type="button"
            onClick={() => removeSkill(index)}
            className="ml-2 text-red-600 hover:text-red-800"
            aria-label={`Remove ${skill}`}
          >
            <Trash2 size={14} />
          </button>
          {errors[`skills_${index}`] && (
            <p className="error-message mt-1 text-sm text-red-500 w-full">{errors[`skills_${index}`]}</p>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default SkillsForm;