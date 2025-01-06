import { useState, useEffect } from 'react';

export function useFormValidation(initialValues = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    const checks = {
      length: password.length >= 6,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*]/.test(password)
    };

    return {
      isValid: Object.values(checks).every(Boolean),
      checks
    };
  };

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    const newErrors = { ...errors };
    
    if (name === 'email') {
      if (!validateEmail(value)) {
        newErrors.email = 'Email invalide';
      } else {
        delete newErrors.email;
      }
    }

    if (name === 'password') {
      const validation = validatePassword(value);
      if (!validation.isValid) {
        newErrors.password = {
          message: 'Le mot de passe doit contenir :',
          checks: validation.checks
        };
      } else {
        delete newErrors.password;
      }
    }

    setErrors(newErrors);
  };

  useEffect(() => {
    setIsValid(Object.keys(errors).length === 0);
  }, [errors]);

  return {
    values,
    errors,
    isValid,
    handleChange
  };
} 