import React from 'react';
import { Trash2, Plus, SkipForward } from 'lucide-react';

const AchievementsForm = ({ achievements, errors, handleInputChange, addArrayItem, removeArrayItem, skipStep }) => (
  <div className="form-section space-y-6">
    <button
      type="button"
      onClick={skipStep}
      className="skip-button inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-md text-white bg-yellow-500 hover:bg-yellow-600 shadow-xl uppercase"
    >
      <SkipForward size={20} className="mr-2" />
      Skip Achievements
    </button>
    {achievements.map((achievement, index) => (
      <div key={index} className="card p-6 border border-gray-200 rounded-lg shadow-sm">
        <div className="card-header flex justify-between items-center">
          <h4 className="card-title text-lg font-semibold">Achievement #{index + 1}</h4>
          {achievements.length > 1 && (
            <button
              type="button"
              onClick={() => removeArrayItem('achievements', index)}
              className="delete-button text-red-600 hover:text-red-800"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
        <div className="mt-4">
          <label className="form-label block text-sm font-medium text-gray-700">Achievement Title</label>
          <input
            type="text"
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={achievement.title}
            onChange={(e) => handleInputChange('achievements', { title: e.target.value }, index)}
            placeholder="Award or recognition title"
          />
        </div>
        <div className="mt-4">
          <label className="form-label block text-sm font-medium text-gray-700">Description</label>
          <textarea
            className="form-textarea mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            rows="3"
            value={achievement.description}
            onChange={(e) => handleInputChange('achievements', { description: e.target.value }, index)}
            placeholder="Describe your achievement..."
          />
        </div>
        <div className="mt-4">
          <label className="form-label block text-sm font-medium text-gray-700">Date Achieved</label>
          <input
            type="date"
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={achievement.achieved_at}
            onChange={(e) => handleInputChange('achievements', { achieved_at: e.target.value }, index)}
          />
        </div>
      </div>
    ))}
    <button
      type="button"
      onClick={() => addArrayItem('achievements')}
      className="add-button inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
    >
      <Plus size={16} className="add-icon mr-2" />
      Add Achievement
    </button>
  </div>
);

export default AchievementsForm;