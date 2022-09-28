import { Box, Container } from '@mui/system';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import assets from '../assets';
import Loading from '../components/common/Loading';
import authUtils from '../utils/authUtils';

const AuthLayout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authUtils.isAuthenticated();

      if (!isAuth) {
        setLoading(false);
      } else {
        navigate('/');
      }
    };
    checkAuth();
  }, [navigate]);
  return loading ? (
    <Loading fullHeight />
  ) : (
    <Container component={'main'} maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img src={assets.images.logoDark} width="100px" alt="Logo" />
        <Outlet />
      </Box>
    </Container>
  );
};

export default AuthLayout;
