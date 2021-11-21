import { useDrag, useDrop } from 'react-dnd'
import { useRef } from 'react';
import { RenderCell } from './WorkoutPlan';
import { TableCell, TableRow } from '@mui/material';

const DND_ITEM_TYPE = 'row'

const Row = ({ row, index, moveRow, cell_mode, setCellMode, handleCellClick, updateChangedCell }) => {
  const dropRef = useRef(null)
  const dragRef = useRef(null)

  const [, drop] = useDrop({
    accept: DND_ITEM_TYPE,
    hover(item, monitor) {
      if (!dropRef.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      // Determine rectangle on screen
      const hoverBoundingRect = dropRef.current.getBoundingClientRect()
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      // Determine mouse position
      const clientOffset = monitor.getClientOffset()
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      // Time to actually perform the action
      moveRow(dragIndex, hoverIndex)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: DND_ITEM_TYPE, index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  })

  console.log(isDragging)

  const opacity = isDragging ? 0 : 1

  preview(drop(dropRef))
  drag(dragRef)

  return (
    <TableRow
      {...row.getRowProps()}
      key={row.original.id}
      onClick={() => setCellMode("editable")}
      ref={dropRef}
      style={{ opacity }}
    >
    {row.cells.map((cell) => {
      if (cell.column.id === 'move') {
        return (
          <TableCell
          {...cell.getCellProps()}
          ref={dragRef}
        >
        {cell.render("Cell")}
        </TableCell>
        );
      }
      return (
        <TableCell
          {...cell.getCellProps()}
          onClick={() => handleCellClick(cell)}
        >
          {cell.column.id === "remove" ||
          cell.column.id === "excercise" ||
          cell.column.id === "move"
          ? (
            cell.render("Cell")
          ) : (
            <RenderCell
              value={cell.value}
              mode={cell_mode}
              callback={(val) =>
                updateChangedCell(val, cell)
              }
            />
          )}
        </TableCell>
      );
    })}
  </TableRow>
  )
}

export {
  Row
}