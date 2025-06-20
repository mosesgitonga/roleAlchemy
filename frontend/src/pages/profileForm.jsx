import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, User, GraduationCap, Briefcase, FolderOpen, Award, Trophy, Plus, Trash2 } from 'lucide-react';
import api from '@/api/axios';
import './profileForm.css';

const ProfileCreationForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    linkedin: '',
    github: '',
    website: '',
    country: '',
    city: '',
    industry: '',
    education: [{ institution: '', certificate_level: '', start_year: '', end_year: '' }],
    experience: [{ title: '', position: '', company: '', start_date: '', end_date: '', description: '' }],
    skills: [],
    projects: [{ title: '', description: '', link: '' }],
    certifications: [{ title: '', issuer: '', issue_date: '', expiration_date: '' }],
    achievements: [{ title: '', description: '', achieved_at: '' }]
  });
  const [errors, setErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [currentSkill, setCurrentSkill] = useState('');

  const industries = [
    { value: 'tech', label: 'Technology' },
    { value: 'health', label: 'Healthcare' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'finance', label: 'Finance' },
    { value: '', label: 'Other' }
  ];

  const skillSuggestions = {
    tech: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'TypeScript', 'Git', 'GraphQL'],
    health: ['Patient Care', 'Medical Coding', 'EMR Systems', 'Clinical Research', 'HIPAA Compliance', 'Nursing', 'Pharmacy Operations', 'Medical Billing'],
    engineering: ['CAD', 'AutoCAD', 'SolidWorks', 'Structural Analysis', 'Project Management', 'MATLAB', 'Finite Element Analysis', 'Lean Manufacturing'],
    finance: ['Financial Modeling', 'Risk Management', 'Accounting', 'Excel', 'QuickBooks', 'Financial Analysis', 'Budgeting', 'Tax Preparation'],
    '': ['Communication', 'Teamwork', 'Problem Solving', 'Leadership', 'Time Management'] // General skills for 'Other'
  };

  const steps = [
    { id: 0, title: 'Basic Details', icon: User, description: 'Personal information' },
    { id: 1, title: 'Education', icon: GraduationCap, description: 'Academic background' },
    { id: 2, title: 'Experience', icon: Briefcase, description: 'Work history' },
    { id: 3, title: 'Skills', icon: Award, description: 'Technical and professional skills' },
    { id: 4, title: 'Projects', icon: FolderOpen, description: 'Portfolio projects' },
    { id: 5, title: 'Certifications', icon: Award, description: 'Professional certifications' },
    { id: 6, title: 'Achievements', icon: Trophy, description: 'Notable accomplishments' }
  ];

  const validateBasicDetails = () => {
    const newErrors = {};
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?\d{10,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Invalid phone number format';
    }
    if (formData.linkedin && !/^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(formData.linkedin)) {
      newErrors.linkedin = 'Invalid LinkedIn URL';
    }
    if (formData.github && !/^https?:\/\/(www\.)?github\.com\/.*$/.test(formData.github)) {
      newErrors.github = 'Invalid GitHub URL';
    }
    if (formData.website && !/^https?:\/\/.*$/.test(formData.website)) {
      newErrors.website = 'Invalid website URL';
    }
    return newErrors;
  };

  const validateArrayField = (field, items) => {
    const newErrors = {};
    items.forEach((item, index) => {
      if (field === 'education') {
        if (item.institution && !item.certificate_level) {
          newErrors[`education_${index}_certificate_level`] = 'Degree is required if institution is provided';
        }
        if (item.start_year && item.end_year && parseInt(item.end_year) < parseInt(item.start_year)) {
          newErrors[`education_${index}_end_year`] = 'End year cannot be before start year';
        }
      } else if (field === 'experience') {
        if (item.title && !item.company) {
          newErrors[`experience_${index}_company`] = 'Company is required if job title is provided';
        }
        if (item.start_date && item.end_date && new Date(item.end_date) < new Date(item.start_date)) {
          newErrors[`experience_${index}_end_date`] = 'End date cannot be before start date';
        }
      } else if (field === 'projects') {
        if (item.title && !item.description) {
          newErrors[`projects_${index}_description`] = 'Description is required if project title is provided';
        }
        if (item.link && !/^https?:\/\/.*$/.test(item.link)) {
          newErrors[`projects_${index}_link`] = 'Invalid project URL';
        }
      } else if (field === 'certifications') {
        if (item.title && !item.issuer) {
          newErrors[`certifications_${index}_issuer`] = 'Issuer is required if certification title is provided';
        }
      }
    });
    return newErrors;
  };

  const validateSkills = () => {
    const newErrors = {};
    if (formData.skills.length === 0 || formData.skills.every(skill => !skill.trim())) {
      newErrors.skills_error = 'At least one skill is required';
    }
    formData.skills.forEach((skill, index) => {
      if (skill.trim().toLowerCase() === 'skills' || skill.trim().length < 2) {
        newErrors[`skills_${index}`] = 'Skill is too generic or short; please be more specific';
      }
    });
    return newErrors;
  };

  const validateCurrentStep = () => {
    let newErrors = {};
    if (currentStep === 0) {
      newErrors = validateBasicDetails();
    } else if (currentStep === 1) {
      newErrors = validateArrayField('education', formData.education);
    } else if (currentStep === 2) {
      newErrors = validateArrayField('experience', formData.experience);
    } else if (currentStep === 3) {
      newErrors = validateSkills();
    } else if (currentStep === 4) {
      newErrors = validateArrayField('projects', formData.projects);
    } else if (currentStep === 5) {
      newErrors = validateArrayField('certifications', formData.certifications);
    }
    return newErrors;
  };

  const handleInputChange = (field, value, index = null) => {
    setFormData(prev => {
      if (index !== null) {
        const newArray = [...prev[field]];
        newArray[index] = { ...newArray[index], ...value };
        return { ...prev, [field]: newArray };
      }
      return { ...prev, [field]: value };
    });

    setErrors(prev => {
      const newErrors = { ...prev };
      if (index !== null) {
        Object.keys(prev).forEach(key => {
          if (key.startsWith(`${field}_${index}`)) {
            delete newErrors[key];
          }
        });
      } else {
        delete newErrors[field];
      }
      return newErrors;
    });
  };

  const handleSkillInput = (e) => {
    const value = e.target.value;
    setCurrentSkill(value);

    if (value.includes(',') || value.includes(' ')) {
      const newSkills = value
        .split(/[, ]+/)
        .map(skill => skill.trim())
        .filter(skill => skill);
      if (newSkills.length > 0) {
        setFormData(prev => ({
          ...prev,
          skills: [...prev.skills, ...newSkills].slice(0, 20) // Limit to 20 skills
        }));
        setCurrentSkill('');
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.skills_error;
          Object.keys(prev).forEach(key => {
            if (key.startsWith('skills_')) {
              delete newErrors[key];
            }
          });
          return newErrors;
        });
      }
    }
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`skills_${index}`];
      delete newErrors.skills_error;
      return newErrors;
    });
  };

  const addArrayItem = (field) => {
    const templates = {
      education: { institution: '', certificate_level: '', start_year: '', end_year: '' },
      experience: { title: '', position: '', company: '', start_date: '', end_date: '', description: '' },
      projects: { title: '', description: '', link: '' },
      certifications: { title: '', issuer: '', issue_date: '', expiration_date: '' },
      achievements: { title: '', description: '', achieved_at: '' }
    };

    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], templates[field]]
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
    setErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(prev).forEach(key => {
        if (key.startsWith(`${field}_${index}`)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  const cleanProfileData = (data) => {
    const cleanList = (list, isObj = false) => {
      if (!Array.isArray(list)) return [];
      return list
        .map(item => {
          if (isObj) {
            const cleaned = Object.fromEntries(
              Object.entries(item).filter(([_, v]) => v !== '')
            );
            return Object.keys(cleaned).length > 0 ? cleaned : null;
          }
          return item.trim() !== '' ? item.trim() : null;
        })
        .filter(item => item !== null);
    };

    return {
      ...data,
      skills: cleanList(data.skills),
      education: cleanList(data.education, true),
      experience: cleanList(data.experience, true),
      certifications: cleanList(data.certifications, true),
      achievements: cleanList(data.achievements, true),
      projects: cleanList(data.projects, true),
    };
  };

  const handleSubmit = async () => {
    setSubmissionStatus(null);
    const newErrors = validateBasicDetails();
    
    ['education', 'experience', 'projects', 'certifications'].forEach(field => {
      Object.assign(newErrors, validateArrayField(field, formData[field]));
    });
    Object.assign(newErrors, validateSkills());

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = cleanProfileData(formData);
      const response = await api.post('/profile', payload);
      if (response.status === 201 || response.status === 200) {
        setSubmissionStatus({ type: 'success', message: 'Profile created successfully!' });
      } else {
        setSubmissionStatus({ 
          type: 'error', 
          message: response.data?.message || 'Failed to create profile. Please try again.' 
        });
      }
    } catch (error) {
      setSubmissionStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'An error occurred while creating the profile. Please try again.' 
      });
      console.error('Error submitting profile:', error);
    }
  };

  const nextStep = () => {
    const newErrors = validateCurrentStep();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setErrors({});
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const renderBasicDetails = () => (
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
          {errors.full_name && <p className="error-message mt-1 text-sm text-red-600">{errors.full_name}</p>}
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
          {errors.phone && <p className="error-message mt-1 text-sm text-red-600">{errors.phone}</p>}
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
          {errors.linkedin && <p className="error-message mt-1 text-sm text-red-600">{errors.linkedin}</p>}
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
          {errors.github && <p className="error-message mt-1 text-sm text-red-600">{errors.github}</p>}
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
        {errors.website && <p className="error-message mt-1 text-sm text-red-600">{errors.website}</p>}
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="form-section space-y-6">
      {formData.education.map((edu, index) => (
        <div key={index} className="card p-6 border border-gray-200 rounded-lg shadow-sm">
          <div className="card-header flex justify-between items-center">
            <h4 className="card-title text-lg font-semibold">Education #{index + 1}</h4>
            {formData.education.length > 1 && (
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
                <p className="error-message mt-1 text-sm text-red-600">{errors[`education_${index}_certificate_level`]}</p>
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
                <p className="error-message mt-1 text-sm text-red-600">{errors[`education_${index}_end_year`]}</p>
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

  const renderExperience = () => (
    <div className="form-section space-y-6">
      {formData.experience.map((exp, index) => (
        <div key={index} className="card p-6 border border-gray-200 rounded-lg shadow-sm">
          <div className="card-header flex justify-between items-center">
            <h4 className="card-title text-lg font-semibold">Experience #{index + 1}</h4>
            {formData.experience.length > 1 && (
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
              <p className="error-message mt-1 text-sm text-red-600">{errors[`experience_${index}_company`]}</p>
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
                <p className="error-message mt-1 text-sm text-red-600">{errors[`experience_${index}_end_date`]}</p>
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

  const renderSkills = () => (
    <div className="form-section space-y-6">
      <div>
        <label className="form-label block text-sm font-medium text-gray-700">Skills *</label>
        <input
          type="text"
          list="skill-suggestions"
          className={`form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.skills_error ? 'border-red-500' : ''}`}
          value={currentSkill}
          onChange={handleSkillInput}
          placeholder={formData.industry ? `Type skills like ${skillSuggestions[formData.industry][0] || 'Communication'}` : 'Type skills separated by commas or spaces'}
          aria-describedby="skills-error"
        />
        <datalist id="skill-suggestions">
          {skillSuggestions[formData.industry || ''].map((skill, index) => (
            <option key={index} value={skill} />
          ))}
        </datalist>
        {errors.skills_error && <p id="skills-error" className="error-message mt-1 text-sm text-red-600">{errors.skills_error}</p>}
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
              <p className="error-message mt-1 text-sm text-red-600 w-full">{errors[`skills_${index}`]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="form-section space-y-6">
      {formData.projects.map((project, index) => (
        <div key={index} className="card p-6 border border-gray-200 rounded-lg shadow-sm">
          <div className="card-header flex justify-between items-center">
            <h4 className="card-title text-lg font-semibold">Project #{index + 1}</h4>
            {formData.projects.length > 1 && (
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
              <p className="error-message mt-1 text-sm text-red-600">{errors[`projects_${index}_description`]}</p>
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
              <p className="error-message mt-1 text-sm text-red-600">{errors[`projects_${index}_link`]}</p>
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

  const renderCertifications = () => (
    <div className="form-section space-y-6">
      {formData.certifications.map((cert, index) => (
        <div key={index} className="card p-6 border border-gray-200 rounded-lg shadow-sm">
          <div className="card-header flex justify-between items-center">
            <h4 className="card-title text-lg font-semibold">Certification #{index + 1}</h4>
            {formData.certifications.length > 1 && (
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
                <p className="error-message mt-1 text-sm text-red-600">{errors[`certifications_${index}_issuer`]}</p>
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

  const renderAchievements = () => (
    <div className="form-section space-y-6">
      {formData.achievements.map((achievement, index) => (
        <div key={index} className="card p-6 border border-gray-200 rounded-lg shadow-sm">
          <div className="card-header flex justify-between items-center">
            <h4 className="card-title text-lg font-semibold">Achievement #{index + 1}</h4>
            {formData.achievements.length > 1 && (
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return renderBasicDetails();
      case 1: return renderEducation();
      case 2: return renderExperience();
      case 3: return renderSkills();
      case 4: return renderProjects();
      case 5: return renderCertifications();
      case 6: return renderAchievements();
      default: return null;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
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

      <div className="form-container bg-white p-6 rounded-lg shadow-md">
        <div className="form-header mb-6">
          <h2 className="form-title text-2xl font-bold">{steps[currentStep].title}</h2>
          <p className="form-description text-gray-600">{steps[currentStep].description}</p>
        </div>

        {renderStepContent()}

        {submissionStatus && (
          <div className={`mt-4 p-4 rounded-md ${submissionStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {submissionStatus.message}
          </div>
        )}
      </div>

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
          Step {currentStep + 1} of {steps.length}
        </span>

        {currentStep === steps.length - 1 ? (
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
    </div>
  );
};

export default ProfileCreationForm;