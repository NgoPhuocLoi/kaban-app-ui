import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Loading from '../components/common/Loading';
import Sidebar from '../components/common/Sidebar';
import authUtils from '../utils/authUtils';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/features/userSlice';

const AppLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [openMobileSidebar, setOpenMobileSidebar] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await authUtils.isAuthenticated();

      if (!user) {
        navigate('/login');
      } else {
        // save user to redux
        dispatch(setUser(user));
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);
  return loading ? (
    <Loading fullHeight />
  ) : (
    <Box
      sx={{
        display: 'flex',
      }}
    >
      <Sidebar
        openInMobile={openMobileSidebar}
        setOpenInMobile={setOpenMobileSidebar}
      />
      <Box
        sx={{
          flexGrow: 1,
          p: 1,
          width: 'max-content',
        }}
      >
        <Outlet context={[openMobileSidebar, setOpenMobileSidebar]} />
      </Box>
    </Box>
  );
};

export default AppLayout;
