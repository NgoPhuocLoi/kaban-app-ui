import { ArrowBackIosNew, DeleteOutline } from '@mui/icons-material';
import {
  Backdrop,
  Divider,
  Fade,
  IconButton,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import taskApi from '../../api/taskApi';
import { Task } from '../../interface';

interface Props {
  task: Task | undefined;
  boardId: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdate?: any;
  onDelete?: any;
}

const modalStyle = {
  outline: 'none',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '100%', sm: '80%' },
  bgcolor: 'background.paper',
  border: '0px solid #000',
  boxShadow: 24,
  p: 1,
  height: { xs: '100%', sm: '80%' },
};

let timer: ReturnType<typeof setTimeout>;
const timeout = 500;

const TaskModal = (props: Props) => {
  const [task, setTask] = useState<Task>();
  const ref = useRef<HTMLDivElement>(null);
  console.log(ref.current?.clientWidth);

  useEffect(() => {
    setTask(props.task);
  }, [props.task]);

  const handleClose = () => {
    props.onUpdate(task);
    props.setOpen(false);
  };

  const handleUpdate = async (field: string, newValue: string) => {
    clearTimeout(timer);
    setTask({ ...task, [field]: newValue } as Task);

    try {
      timer = setTimeout(async () => {
        await taskApi.update(props.boardId, task!._id, {
          [field]: newValue,
        });
      }, timeout);
    } catch (error) {
      alert(error);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await taskApi.delete(props.boardId, task!._id);
      props.onDelete(task);
      props.setOpen(false);
    } catch (error) {
      alert(error);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    handleUpdate(e.target.name, e.target.value);
  };
  return (
    <Modal
      open={props.open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={props.open}>
        <Box sx={modalStyle} ref={ref}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <IconButton onClick={handleClose}>
              <ArrowBackIosNew />
            </IconButton>
            <IconButton color="error" onClick={handleDeleteTask}>
              <DeleteOutline />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: 'flex',
              height: '100%',
              flexDirection: 'column',
              padding: '1.6rem 2.2rem 5rem',
            }}
          >
            <TextField
              value={task?.title || ''}
              name="title"
              onChange={handleInputChange}
              placeholder="Untitled"
              variant="outlined"
              fullWidth
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-input': { padding: 0 },
                '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
                '& .MuiOutlinedInput-root': {
                  fontSize: '2.5rem',
                  fontWeight: '700',
                },
                marginBottom: '10px',
              }}
            />
            <Typography variant="body2" fontWeight="700">
              {task !== undefined
                ? moment(task.createdAt).format('YYYY-MM-DD')
                : ''}
            </Typography>
            <Divider sx={{ margin: '1.5rem 0' }} />
            <TextField
              value={task?.content || ''}
              placeholder="Add content here"
              multiline
              variant="outlined"
              fullWidth
              sx={{
                height: { xs: '60vh', sm: '40vh' },
                '& .MuiOutlinedInput-input': { padding: 0 },
                '& .MuiOutlinedInput-notchedOutline': { border: 'unset' },
                '& .MuiOutlinedInput-root': {
                  fontSize: '1rem',
                  fontWeight: '700',
                  padding: 0,
                  overflowY: 'auto',
                  maxHeight: '100%',
                  alignItems: 'flex-start',
                },
              }}
              name="content"
              onChange={handleInputChange}
            />
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default TaskModal;
