import {
  DeleteOutline,
  MenuOutlined,
  StarBorderOutlined,
  StarOutlined,
} from '@mui/icons-material';
import { IconButton, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import boardApi from '../api/boardApi';
import EmojiPicker from '../components/common/EmojiPicker';
import Kaban from '../components/common/Kaban';
import { Board } from '../interface';
import { setBoards, setFavouriteBoards } from '../redux/features/boardSlice';

let timer: ReturnType<typeof setTimeout>;
const timeout = 500;

const SingleBoard = () => {
  const [openMobileSidebar, setOpenMobileSidebar] =
    useOutletContext<
      [boolean, React.Dispatch<React.SetStateAction<boolean>>]
    >();
  const { boardId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { boards, favourites } = useSelector((state: any) => state.board);
  const [board, setBoard] = useState<Board>(
    boards.find((board: Board) => board._id === boardId),
  );

  useEffect(() => {
    const getBoard = async () => {
      try {
        const res = await boardApi.getOne(boardId!);
        setBoard(res.data.board);
      } catch (error) {
        alert(error);
      }
    };
    getBoard();
  }, [boardId]);

  const handleUpdate = (field: string, newValue: string | boolean) => {
    clearTimeout(timer);
    const newBoard = { ...board, [field]: newValue } as Board;

    // update board state
    setBoard(newBoard);

    // update boards in redux
    const boardsTemp = [...boards];
    const indexInBoards = boardsTemp.findIndex((item) => item._id === boardId);
    boardsTemp[indexInBoards] = newBoard;
    dispatch(setBoards(boardsTemp));

    // update favourites in redux ( if current board has in favourites)
    const favouritesTemp = [...favourites];
    const indexInFavourites = favouritesTemp.findIndex(
      (item) => item._id === boardId,
    );
    if (indexInFavourites >= 0) {
      favouritesTemp[indexInFavourites] = newBoard;
      dispatch(setFavouriteBoards(favouritesTemp));
    }

    timer = setTimeout(async () => {
      try {
        await boardApi.update(boardId!, { [field]: newValue });
      } catch (error) {
        alert(error);
      }
    }, timeout);
  };

  const handleDelete = async () => {
    try {
      await boardApi.delete(boardId!);
      if (board!.favourite) {
        const newFavouriteBoards = favourites.filter(
          (board: Board) => board._id !== boardId,
        );
        dispatch(setFavouriteBoards(newFavouriteBoards));
      }

      const newBoards = boards.filter((board: Board) => board._id !== boardId);
      dispatch(setBoards(newBoards));
      if (newBoards.length === 0) {
        navigate('/boards');
      } else {
        navigate(`/boards/${newBoards[0]._id}`);
      }
      setBoards(newBoards);
    } catch (error) {}
  };

  const onIconChange = async (icon: string) => {
    handleUpdate('icon', icon);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleUpdate(e.target.name, e.target.value);
  };

  const toggleFavoutire = () => {
    handleUpdate('favourite', !board!.favourite);
    if (board!.favourite) {
      // unfavourite
      dispatch(
        setFavouriteBoards(
          favourites.filter((board: Board) => board._id !== boardId),
        ),
      );
    } else {
      dispatch(setFavouriteBoards([board, ...favourites]));
    }
  };
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'flex-end', sm: 'space-between' },
          width: '100%',
        }}
      >
        <IconButton
          sx={{ marginRight: 'auto' }}
          onClick={() => setOpenMobileSidebar(true)}
        >
          <MenuOutlined />
        </IconButton>
        <IconButton onClick={toggleFavoutire}>
          {board?.favourite ? (
            <StarOutlined color="warning" />
          ) : (
            <StarBorderOutlined />
          )}
        </IconButton>

        <IconButton color="error" onClick={handleDelete}>
          <DeleteOutline />
        </IconButton>
      </Box>

      <Box
        sx={{
          padding: { xs: ' 20px 10px 10px', sm: '10px 50px' },
        }}
      >
        <Box>
          {/* <EmojiPicker /> */}
          <EmojiPicker icon={board?.icon} onIconChange={onIconChange} />

          <TextField
            value={board?.title || ''}
            placeholder={'Untitled'}
            variant="outlined"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-input': { padding: 0 },
              '& .MuiOutlinedInput-notchedOutline': { border: 'unset' },
              '& .MuiOutlinedInput-root': {
                fontSize: '2rem',
                fontWeight: '700',
              },
            }}
            name="title"
            onChange={handleInputChange}
          />
          <TextField
            value={board?.description}
            placeholder="Add a description"
            multiline
            variant="outlined"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-input': { padding: 0 },
              '& .MuiOutlinedInput-notchedOutline': { border: 'unset' },
              '& .MuiOutlinedInput-root': {
                fontSize: '1rem',
                fontWeight: '700',
              },
            }}
            name="description"
            onChange={handleInputChange}
          />
        </Box>
        <Box>
          <Kaban data={board?.sections} boardId={boardId!} />
        </Box>
      </Box>
    </>
  );
};

export default SingleBoard;
