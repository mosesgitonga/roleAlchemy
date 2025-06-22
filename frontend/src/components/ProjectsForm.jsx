import React from 'react';
import { Trash2, Plus, SkipForward } from 'lucide-react';

const ProjectsForm = ({ projects, errors, handleInputChange, addArrayItem, removeArrayItem, skipStep }) => (
  <div className="form-section space-y-6">
    <button
      type="button"
      onClick={skipStep}
      className="skip-button inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-md text-white bg-yellow-500 hover:bg-yellow-600 shadow-xl uppercase"
    >
      <SkipForward size={20} className="mr-2" />
      Skip Projects
    </button>
    {projects.map((project, index) => (
      <div key={index} className="card p-6 border border-gray-200 rounded-lg shadow-sm">
        <div className="card-header flex justify-between items-center">
          <h4 className="card-title text-lg font-semibold">Project #{index + 1}</h4>
          {projects.length > 1 && (
            <button
              type="button"
              onClick={() => removeArrayItem('projects', index)}
              className="delete-button text-red-600 hover:text-red-800"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
        <div className="mt-4">
          <label className="form-label block text-sm font-medium text-gray-700">Project Title</label>
          <input
            type="text"
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={project.title}
            onChange={(e) => handleInputChange('projects', { title: e.target.value }, index)}
            placeholder="Project name"
          />
        </div>
        <div className="mt-4">
          <label className="form-label block text-sm font-medium text-gray-700">Description</label>
          <textarea
            className={`form-textarea mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors[`projects_${index}_description`] ? 'border-red-500' : ''}`}
            rows="3"
            value={project.description}
            onChange={(e) => handleInputChange('projects', { description: e.target.value }, index)}
            placeholder="Describe your project and technologies used..."
          />
          {errors[`projects_${index}_description`] && (
            <p className="error-message mt-1 text-sm text-red-500">{errors[`projects_${index}_description`]}</p>
          )}
        </div>
        <div className="mt-4">
          <label className="form-label block text-sm font-medium text-gray-700">Project Link</label>
          <input
            type="url"
            className={`form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors[`projects_${index}_link`] ? 'border-red-500' : ''}`}
            value={project.link}
            onChange={(e) => handleInputChange('projects', { link: e.target.value }, index)}
            placeholder="https://github.com/username/project"
          />
          {errors[`projects_${index}_link`] && (
            <p className="error-message mt-1 text-sm text-red-500">{errors[`projects_${index}_link`]}</p>
          )}
        </div>
      </div>
    ))}
    <button
      type="button"
      onClick={() => addArrayItem('projects')}
      className="add-button inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
    >
      <Plus size={16} className="add-icon mr-2" />
      Add Project
    </button>
  </div>
);

export default ProjectsForm;