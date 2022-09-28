import { AddBoxOutlined, LogoutOutlined } from '@mui/icons-material';
import { Drawer, IconButton, List, ListItem, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import boardApi from '../../api/boardApi';
import assets from '../../assets';
import { Board } from '../../interface';
import { setBoards } from '../../redux/features/boardSlice';
import BoardListDraggable from './BoardListDraggable';
import FavouriteBoards from './FavouriteBoards';

interface Props {
  openInMobile: boolean;
  setOpenInMobile: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ openInMobile, setOpenInMobile }: Props) => {
  const sidebarWidth = 250;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { boards } = useSelector((state: any) => state.board);
  const user = useSelector((state: any) => state.user.value);
  const { boardId } = useParams();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await boardApi.getAll();
        dispatch(setBoards(res.data.boards));

        if (res.data.boards.length > 0 && !boardId) {
          navigate(`/boards/${res.data.boards[0]._id}`);
        }
      } catch (error) {
        alert(error);
      }
    };
    fetchBoards();
  }, []);

  useEffect(() => {
    const activeItem = boards.findIndex((item: Board) => item._id === boardId);
    setActiveIndex(activeItem);
  }, [boardId, boards]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    const newList = [...boards];
    const [removed] = newList.splice(source.index, 1);
    newList.splice(destination!.index, 0, removed);
    dispatch(setBoards(newList));

    try {
      await boardApi.updatePosition({ boards: newList });
    } catch (error) {
      alert(error);
    }
  };

  const handleCreateBoard = async () => {
    try {
      const res = await boardApi.create();
      const newList = [res.data.board, ...boards];
      dispatch(setBoards(newList));
    } catch (error) {
      alert(error);
    }
  };

  const drawer = (
    <List
      disablePadding
      sx={{
        width: sidebarWidth,
        height: '100vh',
        backgroundColor: assets.colors.secondary,
      }}
    >
      <ListItem>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="body2" fontWeight={'700'}>
            {user.username}
          </Typography>
          <IconButton onClick={handleLogout}>
            <LogoutOutlined fontSize="small" />
          </IconButton>
        </Box>
      </ListItem>

      <Box sx={{ paddingTop: '10px' }}></Box>
      <FavouriteBoards setOpenMobileSidebar={setOpenInMobile} />

      <ListItem>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="body2" fontWeight={'700'}>
            Private
          </Typography>
          <IconButton onClick={handleCreateBoard}>
            <AddBoxOutlined fontSize="small" />
          </IconButton>
        </Box>
      </ListItem>

      <BoardListDraggable
        boards={boards}
        activeIndex={activeIndex}
        onDragEnd={onDragEnd}
        setOpenMobileSidebar={setOpenInMobile}
      />
    </List>
  );
  return (
    <>
      <Drawer
        components={
          window.document.body as unknown as {
            Root?: React.ElementType;
            Backdrop?: React.ElementType;
          }
        }
        variant="permanent"
        open={true}
        sx={{
          width: sidebarWidth,
          height: '100vh',
          '& > div': { borderRight: 'none' },
          display: { xs: 'none', sm: 'block' },
        }}
      >
        {drawer}
      </Drawer>

      {/* mobile sidebar */}
      <Drawer
        components={
          window.document.body as unknown as {
            Root?: React.ElementType;
            Backdrop?: React.ElementType;
          }
        }
        variant="temporary"
        open={openInMobile}
        onClose={() => setOpenInMobile(false)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          // '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Sidebar;
