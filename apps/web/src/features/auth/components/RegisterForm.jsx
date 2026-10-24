import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../useAuth';
import FormField from '../../../components/ui/FormField';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { STATES, ROUTES } from '../../../lib/constants';

export default function RegisterForm() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    aicteId: '',
    name: '',
    state: STATES[0],
    contactPerson: '',
    email: '',
    phone: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.aicteId.trim()) errs.aicteId = 'AICTE permanent ID is required';
    else if (!/^1-\d{9,11}$/.test(formData.aicteId.trim())) {
      errs.aicteId = 'ID must be in format 1-XXXXXXXXXX (e.g. 1-4821937561)';
    }

    if (!formData.name.trim()) errs.name = 'Full legal institution name is required';
    if (!formData.contactPerson.trim()) errs.contactPerson = 'Authorized contact person is required';
    if (!formData.email.trim()) errs.email = 'Official email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Enter a valid email address';

    if (!formData.phone.trim()) errs.phone = 'Contact telephone or mobile is required';
    if (!formData.password || formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await register(formData);
      navigate(ROUTES.INSTITUTION_DASHBOARD);
    } catch (err) {
      setErrors({ form: err.message || 'Registration failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.form && (
        <div className="p-3 bg-red-50 border border-status-red rounded text-xs text-status-red">
          {errors.form}
        </div>
      )}

      <FormField
        label="AICTE permanent institute ID"
        required
        error={errors.aicteId}
        helperText="Format: 1-XXXXXXXXXX as assigned in AICTE portal"
      >
        <Input
          value={formData.aicteId}
          onChange={(e) => handleChange('aicteId', e.target.value)}
          placeholder="1-4821937561"
          error={Boolean(errors.aicteId)}
        />
      </FormField>

      <FormField label="Full institution name" required error={errors.name}>
        <Input
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g. Government Engineering College, Raipur"
          error={Boolean(errors.name)}
        />
      </FormField>

      <FormField label="State / Union Territory" required>
        <Select
          value={formData.state}
          onChange={(val) => handleChange('state', val)}
          options={STATES.map((s) => ({ value: s, label: s }))}
        />
      </FormField>

      <FormField label="Designated contact person / Principal" required error={errors.contactPerson}>
        <Input
          value={formData.contactPerson}
          onChange={(e) => handleChange('contactPerson', e.target.value)}
          placeholder="Dr. Full Name"
          error={Boolean(errors.contactPerson)}
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Official email" required error={errors.email}>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="principal@institution.edu.in"
            error={Boolean(errors.email)}
          />
        </FormField>

        <FormField label="Contact telephone" required error={errors.phone}>
          <Input
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="0771-2254100"
            error={Boolean(errors.phone)}
          />
        </FormField>
      </div>

      <FormField label="Portal password" required error={errors.password}>
        <Input
          type="password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          placeholder="••••••••"
          error={Boolean(errors.password)}
        />
      </FormField>

      <Button type="submit" variant="primary" className="w-full mt-2" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Complete institution onboarding'}
      </Button>
    </form>
  );
}
