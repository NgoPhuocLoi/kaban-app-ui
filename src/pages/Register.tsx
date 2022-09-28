import { LoadingButton } from '@mui/lab';
import { Button, TextField } from '@mui/material';
import { Box } from '@mui/system';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authApi from '../api/authApi';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let err = false;

    const data = new FormData(e.target as HTMLFormElement);
    const username = (data.get('username') as string).trim();
    const password = (data.get('password') as string).trim();
    const confirmPassword = (data.get('confirmPassword') as string).trim();

    if (username === '') {
      err = true;
      setErrorText((prev) => ({ ...prev, username: 'Please fill this field' }));
    }
    if (password === '') {
      err = true;
      setErrorText((prev) => ({ ...prev, password: 'Please fill this field' }));
    }
    if (confirmPassword === '') {
      err = true;
      setErrorText((prev) => ({
        ...prev,
        confirmPassword: 'Please fill this field',
      }));
    }
    if (password !== confirmPassword) {
      err = true;
      setErrorText((prev) => ({
        ...prev,
        confirmPassword: 'Confirm Password not match',
      }));
    }
    if (err) return;

    setLoading(true);

    try {
      const res = await authApi.register({
        username,
        password,
        confirmPassword,
      });

      setLoading(false);
      navigate('/');
    } catch (error: any) {
      const errors = error.data.errors;
      console.log({ errors });
      errors.forEach((err: any) => {
        setErrorText((prev) => ({ ...prev, [err.param]: err.msg }));
      });
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.trim() !== '') {
      setErrorText((prev) => ({ ...prev, [e.target.name]: '' }));
    }
  };
  return (
    <Box
      component={'form'}
      sx={{
        mt: 1,
      }}
      onSubmit={handleSubmit}
      noValidate
    >
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        disabled={loading}
        error={errorText.username !== ''}
        helperText={errorText.username}
        onChange={handleInputChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="password"
        label="Password"
        name="password"
        type={'password'}
        disabled={loading}
        error={errorText.password !== ''}
        helperText={errorText.password}
        onChange={handleInputChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="confirmPassword"
        label="Confirm Password"
        name="confirmPassword"
        disabled={loading}
        type={'password'}
        error={errorText.confirmPassword !== ''}
        helperText={errorText.confirmPassword}
        onChange={handleInputChange}
      />

      <LoadingButton
        sx={{ mt: 3, mb: 2 }}
        variant="outlined"
        fullWidth
        color="success"
        type="submit"
        loading={loading}
      >
        Register
      </LoadingButton>
      <Button
        component={Link}
        to="/login"
        sx={{ textTransform: 'none', textAlign: 'center', display: 'block' }}
      >
        Already have an account? Login now!
      </Button>
    </Box>
  );
};

export default Register;
