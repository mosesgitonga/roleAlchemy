import React from 'react';

const FormHeader = ({ title, description }) => (
  <div className="form-header mb-6">
    <h2 className="form-title text-2xl font-bold">{title}</h2>
    <p className="form-description text-gray-600">{description}</p>
  </div>
);

export default FormHeader;