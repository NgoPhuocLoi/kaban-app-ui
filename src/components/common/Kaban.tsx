import { AddOutlined, DeleteOutline } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import sectionApi from '../../api/sectionApi';
import taskApi from '../../api/taskApi';
import { Section, Task } from '../../interface';
import TaskModal from './TaskModal';

interface Props {
  boardId: string;
  data: Section[];
}

let timer: ReturnType<typeof setTimeout>;
const timeout = 500;

const Kaban = (props: Props) => {
  const boardId = props.boardId;
  const [data, setData] = useState<Section[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [openTaskModal, setOpenTaskModal] = useState(false);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceSectionIndex = data.findIndex(
      (section) => section._id === source.droppableId,
    );
    const destinationSectionIndex = data.findIndex(
      (section) => section._id === destination!.droppableId,
    );
    const sourceTasks = [...data[sourceSectionIndex].tasks];
    const destinationTasks = [...data[destinationSectionIndex].tasks];

    if (source.droppableId !== destination.droppableId) {
      const [removed] = sourceTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, removed);
      data[sourceSectionIndex].tasks = sourceTasks;
      data[destinationSectionIndex].tasks = destinationTasks;
    } else {
      const [removed] = destinationTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, removed);
      data[destinationSectionIndex].tasks = destinationTasks;
    }

    try {
      await taskApi.updatePosition(boardId, {
        sourceList: sourceTasks,
        desList: destinationTasks,
        sourceSectionId: source.droppableId,
        desSectionId: destination.droppableId,
      });
    } catch (error) {
      alert(error);
    }
    setData(data);
  };

  const createSection = async () => {
    try {
      const res = await sectionApi.create(boardId);
      setData([...data, res.data.section]);
    } catch (error) {
      alert(error);
    }
  };

  const deleteSection = async (sectionId: string) => {
    try {
      await sectionApi.delete(boardId, sectionId);
      setData(data.filter((section) => section._id !== sectionId));
    } catch (error) {
      alert(error);
    }
  };

  const handleUpdateTitle = async (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    sectionId: string,
  ) => {
    clearTimeout(timer);
    const newData = [...data];
    const currentSectionIndex = newData.findIndex(
      (section) => section._id === sectionId,
    );
    newData[currentSectionIndex].title = e.target.value;
    setData(newData);
    timer = setTimeout(async () => {
      try {
        await sectionApi.update(boardId, sectionId, { title: e.target.value });
      } catch (error) {
        alert(error);
      }
    }, timeout);
  };

  const createTask = async (sectionId: string) => {
    try {
      const res = await taskApi.create(boardId, sectionId);
      const newData = [...data];
      const currentSectionIndex = newData.findIndex(
        (section) => section._id === sectionId,
      );
      newData[currentSectionIndex].tasks.unshift(res.data.task);
      setData(newData);
    } catch (error) {
      alert(error);
    }
  };

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    setOpenTaskModal(true);
  };

  const onUpdate = (task: Task) => {
    const newData = [...data];
    const sectionIndex = newData.findIndex(
      (section) => section._id === task.section._id,
    );
    const taskIndex = newData[sectionIndex].tasks.findIndex(
      (item) => item._id === task._id,
    );
    newData[sectionIndex].tasks[taskIndex] = task;
    setData(newData);
  };

  const onDelete = (task: Task) => {
    const newData = [...data];
    const sectionIndex = newData.findIndex(
      (section) => section._id === task.section._id,
    );
    const taskIndex = newData[sectionIndex].tasks.findIndex(
      (item) => item._id === task._id,
    );
    newData[sectionIndex].tasks.splice(taskIndex, 1);
    setData(newData);
  };
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Button onClick={createSection}>Add secton</Button>
        <Typography variant="body2" fontWeight={'700'}>
          {data?.length} sections
        </Typography>
      </Box>
      <Divider sx={{ margin: '10px 0' }} />

      <DragDropContext onDragEnd={onDragEnd}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            width: { xs: 'calc(100vw - 42px)', sm: 'calc(100vw - 400px)' },
            overflow: 'auto',
          }}
        >
          {data?.map((section) => (
            <Box key={section._id} sx={{ width: '300px' }}>
              <Droppable key={section._id} droppableId={section._id}>
                {(provided) => (
                  <>
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{
                        width: '300px',
                        padding: '10px',
                        marginRight: '10px',
                      }}
                    >
                      <>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '10px',
                          }}
                        >
                          <TextField
                            value={section.title}
                            onChange={(e) => handleUpdateTitle(e, section._id)}
                            placeholder="Untitled"
                            variant="outlined"
                            sx={{
                              flexGrow: 1,
                              '& .MuiOutlinedInput-input': { padding: 0 },
                              '& .MuiOutlinedInput-notchedOutline': {
                                border: 'unset ',
                              },
                              '& .MuiOutlinedInput-root': {
                                fontSize: '1rem',
                                fontWeight: '700',
                              },
                            }}
                          />
                          <IconButton
                            // variant='outlined'
                            size="small"
                            sx={{
                              color: 'gray',
                              '&:hover': { color: 'green' },
                            }}
                            onClick={() => createTask(section._id)}
                          >
                            <AddOutlined />
                          </IconButton>
                          <IconButton
                            // variant='outlined'
                            size="small"
                            sx={{
                              color: 'gray',
                              '&:hover': { color: 'red' },
                            }}
                            onClick={() => deleteSection(section._id)}
                          >
                            <DeleteOutline />
                          </IconButton>
                        </Box>
                        {/* tasks */}
                        {section.tasks.map((task, index) => (
                          <Draggable
                            key={task._id}
                            draggableId={task._id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{
                                  padding: '10px',
                                  marginBottom: '10px',
                                  cursor: snapshot.isDragging
                                    ? 'grab'
                                    : 'pointer!important',
                                }}
                                onClick={() => handleSelectTask(task)}
                              >
                                <Typography>
                                  {task.title === '' ? 'Untitled' : task.title}
                                </Typography>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                      </>
                    </Box>
                    {provided.placeholder}
                  </>
                )}
              </Droppable>
            </Box>
          ))}
        </Box>
      </DragDropContext>

      <TaskModal
        boardId={boardId}
        task={selectedTask}
        open={openTaskModal}
        setOpen={setOpenTaskModal}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </>
  );
};

export default Kaban;
