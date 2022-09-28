import { Box, ListItem, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import boardApi from '../../api/boardApi';
import { Board } from '../../interface';
import { setFavouriteBoards } from '../../redux/features/boardSlice';
import BoardListDraggable from './BoardListDraggable';

interface Props {
  setOpenMobileSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const FavouriteBoards = ({ setOpenMobileSidebar }: Props) => {
  const dispatch = useDispatch();
  const { favourites } = useSelector((state: any) => state.board);
  const { boardId } = useParams();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const getFavouriteBoards = async () => {
      try {
        const res = await boardApi.getFavourites();
        dispatch(setFavouriteBoards(res.data.favourites));
      } catch (error) {
        alert(error);
      }
    };
    getFavouriteBoards();
  }, [boardId]);

  useEffect(() => {
    const activeItem = favourites.findIndex(
      (item: Board) => item._id === boardId,
    );
    setActiveIndex(activeItem);
  }, [boardId, favourites]);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    const newList = [...favourites];
    const [removed] = newList.splice(source.index, 1);
    newList.splice(destination!.index, 0, removed);
    dispatch(setFavouriteBoards(newList));

    try {
      await boardApi.updateFavouritePosition({ boards: newList });
    } catch (error) {
      alert(error);
    }
  };
  return (
    <>
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
            Favorites
          </Typography>
        </Box>
      </ListItem>

      <BoardListDraggable
        boards={favourites}
        activeIndex={activeIndex}
        onDragEnd={onDragEnd}
        setOpenMobileSidebar={setOpenMobileSidebar}
      />
    </>
  );
};

export default FavouriteBoards;
