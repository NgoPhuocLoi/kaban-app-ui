import { ListItemButton, Typography } from '@mui/material';
import React from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import { Link } from 'react-router-dom';
import { Board } from '../../interface';

interface Props {
  boards: Board[];
  activeIndex: number;
  onDragEnd: (result: DropResult) => Promise<void>;
  setOpenMobileSidebar?: React.Dispatch<React.SetStateAction<boolean>>;
}

const BoardListDraggable = ({
  boards,
  activeIndex = 0,
  onDragEnd,
  setOpenMobileSidebar,
}: Props) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable key="list-board-droppable" droppableId="list-board-droppable">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {boards.map((item: Board, index: number) => (
              <Draggable key={item._id} draggableId={item._id} index={index}>
                {(provided, snapshot) => (
                  <ListItemButton
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    selected={index === activeIndex}
                    component={Link}
                    to={`/boards/${item._id}`}
                    sx={{
                      pl: '20px',
                      cursor: snapshot.isDragging
                        ? 'grap'
                        : 'pointer!important',
                    }}
                    onClick={() => setOpenMobileSidebar!(false)}
                  >
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.icon} {item.title}
                    </Typography>
                  </ListItemButton>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default BoardListDraggable;
