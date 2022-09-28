import { LoadingButton } from '@mui/lab';
import { Button, TextField } from '@mui/material';
import { Box } from '@mui/system';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authApi from '../api/authApi';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let err = false;

    const data = new FormData(e.target as HTMLFormElement);
    const username = (data.get('username') as string).trim();
    const password = (data.get('password') as string).trim();

    if (username === '') {
      err = true;
      setErrorText((prev) => ({ ...prev, username: 'Please fill this field' }));
    }
    if (password === '') {
      err = true;
      setErrorText((prev) => ({ ...prev, password: 'Please fill this field' }));
    }

    if (err) return;

    setLoading(true);

    try {
      const res = await authApi.login({
        username,
        password,
      });
      localStorage.setItem('token', res.data.token);
      setLoading(false);
      navigate('/');
    } catch (error: any) {
      const errors = error.data.errors;
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
        type={'password'}
        id="password"
        label="Password"
        name="password"
        disabled={loading}
        error={errorText.password !== ''}
        helperText={errorText.password}
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
        Login
      </LoadingButton>
      <Button
        component={Link}
        to="/register"
        sx={{ textTransform: 'none', textAlign: 'center', display: 'block' }}
      >
        Don't have an account? Register now!
      </Button>
    </Box>
  );
};

export default Login;
