import React, { useState } from 'react';
import { User, GraduationCap, Briefcase, FolderOpen, Award, Trophy } from 'lucide-react';
import api from '@/api/axios';
import ProgressBar from '../components/ProgressBar';
import FormHeader from '../components/FormHeader';
import BasicDetailsForm from '../components/BasicDetailsForm';
import EducationForm from '../components/EducationForm';
import ExperienceForm from '../components/ExperienceForm';
import SkillsForm from '../components/SkillsForm';
import ProjectsForm from '../components/ProjectsForm';
import CertificationsForm from '../components/CertifactionsForm';
import AchievementsForm from '../components/AchievementsForm';
import Navigation from '../components/Navigation';
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
    achievements: [{ title: '', description: '', achieved_at: '' }],
  });
  const [errors, setErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [currentSkill, setCurrentSkill] = useState('');

  const industries = [
    { value: 'tech', label: 'Technology' },
    { value: 'health', label: 'Healthcare' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'finance', label: 'Finance' },
    { value: '', label: 'Other' },
  ];

  const skillSuggestions = {
    tech: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'TypeScript', 'Git', 'GraphQL'],
    health: ['Patient Care', 'Medical Coding', 'EMR Systems', 'Clinical Research', 'HIPAA Compliance', 'Nursing', 'Pharmacy Operations', 'Medical Billing'],
    engineering: ['CAD', 'AutoCAD', 'SolidWorks', 'Structural Analysis', 'Project Management', 'MATLAB', 'Finite Element Analysis', 'Lean Manufacturing'],
    finance: ['Financial Modeling', 'Risk Management', 'Accounting', 'Excel', 'QuickBooks', 'Financial Analysis', 'Budgeting', 'Tax Preparation'],
    '': ['Communication', 'Teamwork', 'Problem Solving', 'Leadership', 'Time Management'],
  };

  const steps = [
    { id: 0, title: 'Basic Details', icon: User, description: 'Personal information' },
    { id: 1, title: 'Education', icon: GraduationCap, description: 'Academic background' },
    { id: 2, title: 'Experience', icon: Briefcase, description: 'Work history' },
    { id: 3, title: 'Skills', icon: Award, description: 'Technical and professional skills' },
    { id: 4, title: 'Projects', icon: FolderOpen, description: 'Portfolio projects' },
    { id: 5, title: 'Certifications', icon: Award, description: 'Professional certifications' },
    { id: 6, title: 'Achievements', icon: Trophy, description: 'Notable accomplishments' },
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

    if (value.includes(',')) {
      const newSkills = value
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill);
      if (newSkills.length > 0) {
        setFormData(prev => ({
          ...prev,
          skills: [...prev.skills, ...newSkills].slice(0, 20),
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
      skills: prev.skills.filter((_, i) => i !== index),
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
      achievements: { title: '', description: '', achieved_at: '' },
    };

    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], templates[field]],
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
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
              Object.entries(item).filter(([_, v]) => v !== ''),
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

  const skipStep = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [],
    }));
    setErrors({});
    nextStep();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <BasicDetailsForm formData={formData} errors={errors} handleInputChange={handleInputChange} industries={industries} />;
      case 1:
        return <EducationForm education={formData.education} errors={errors} handleInputChange={handleInputChange} addArrayItem={addArrayItem} removeArrayItem={removeArrayItem} />;
      case 2:
        return <ExperienceForm experience={formData.experience} errors={errors} handleInputChange={handleInputChange} addArrayItem={addArrayItem} removeArrayItem={removeArrayItem} />;
      case 3:
        return (
          <SkillsForm
            formData={formData}
            errors={errors}
            currentSkill={currentSkill}
            setCurrentSkill={setCurrentSkill}
            handleSkillInput={handleSkillInput}
            removeSkill={removeSkill}
            skillSuggestions={skillSuggestions}
          />
        );
      case 4:
        return (
          <ProjectsForm
            projects={formData.projects}
            errors={errors}
            handleInputChange={handleInputChange}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
            skipStep={() => skipStep('projects')}
          />
        );
      case 5:
        return (
          <CertificationsForm
            certifications={formData.certifications}
            errors={errors}
            handleInputChange={handleInputChange}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
            skipStep={() => skipStep('certifications')}
          />
        );
      case 6:
        return (
          <AchievementsForm
            achievements={formData.achievements}
            errors={errors}
            handleInputChange={handleInputChange}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
            skipStep={() => skipStep('achievements')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <ProgressBar steps={steps} currentStep={currentStep} />
      <div className="form-container bg-white p-6 rounded-lg shadow-md">
        <FormHeader title={steps[currentStep].title} description={steps[currentStep].description} />
        {renderStepContent()}
        {submissionStatus && (
          <div className={`mt-4 p-4 rounded-md ${submissionStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {submissionStatus.message}
          </div>
        )}
      </div>
      <Navigation
        currentStep={currentStep}
        stepsLength={steps.length}
        prevStep={prevStep}
        nextStep={nextStep}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default ProfileCreationForm;