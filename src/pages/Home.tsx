import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import boardApi from '../api/boardApi';
import { setBoards } from '../redux/features/boardSlice';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleCreateBoard = async () => {
    setLoading(true);
    try {
      const res = await boardApi.create();
      dispatch(setBoards([res.data.board]));
      navigate(`/boards/${res.data.board._id}`);
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <LoadingButton
        variant="outlined"
        onClick={handleCreateBoard}
        color="success"
      >
        Click here to create your first board
      </LoadingButton>
    </Box>
  );
};

export default Home;
