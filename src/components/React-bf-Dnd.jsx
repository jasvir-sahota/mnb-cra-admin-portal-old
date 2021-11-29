import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { TableCell, TableRow } from "@mui/material";
import { RenderCell } from "./WorkoutPlan";
import MuiTableBody from "@mui/material/TableBody";
import { useEffect, useState } from "react";

const getItemStyle = (isDragging, draggableStyle) => ({
  // styles we need to apply on draggables
  ...draggableStyle,

  ...(isDragging && {
    background: "rgb(235,235,235)"
  })
});


const RbfDnd = ({ rows, prepareRow, setCellMode, handleCellClick, cell_mode, updateChangedCell, onDragEnd }) => {
  const [rowsLocal, setRows] = useState(rows);
  
  useEffect(() => {
    console.log(rows);
    setRows(rows);
  }, [rows])

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
            <MuiTableBody
              ContainerProps={{ ref: provided.innerRef }}
              ref={provided.innerRef}
            >
            {
              rowsLocal.map((row) => {
                prepareRow(row);
                return (
                  <Draggable key={`draggable-${row.id}`} draggableId={row.id} index={row.id}>
                    {(provided, snapshot) => (
                      <TableRow
                        {...row.getRowProps()}
                        key={row.original.item_id}
                        onClick={() => setCellMode("editable")}
                        ContainerComponent="row"
                        ContainerProps={{ ref: provided.innerRef }}
                        ref={provided.innerRef}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.styles
                        ), {
                          backgroundColor: `${row.depth > 0 ? '#ccdaf0' : null}`,
                        }}
                      >
                        {
                          row.cells.map(cell => {
                            if (cell.column.id === 'move') {
                              return (
                                <span
                                  style = {{
                                    marginLeft: `${row.depth * 1}rem`
                                  }}
                                >
                                  <TableCell
                                    {...cell.getCellProps()}
                                    {...provided.dragHandleProps}
                                    {...provided.draggableProps}
                                  >
                                    {cell.render("Cell")}
                                  </TableCell>
                                </span>
                              );
                            }
                            return (
                              <TableCell
                                {...cell.getCellProps()}
                                onClick={() => handleCellClick(cell)}
                              >
                                {cell.column.id === "remove" ||
                                  cell.column.id === "excercise" ||
                                  cell.column.id === "move" || 
                                  cell.column.id === "add" || 
                                  (
                                    (cell.row.depth > 0 && cell.column.id === 'rest') ||
                                    (cell.row.depth > 0 && cell.column.id === 'tempo') || 
                                    (cell.row.depth > 0 && cell.column.id === 'instructions') ||
                                    (cell.row.depth > 0 && cell.column.id === 'day') ||
                                    (cell.row.depth > 0 && cell.column.id === 'stretching') ||
                                    (cell.row.depth > 0 && cell.column.id === 'set')
                                  )
                                  ? (
                                    cell.render("Cell")
                                  ) : (
                                    <RenderCell
                                      value={cell.value}
                                      mode={cell_mode}
                                      callback={(val) =>
                                        updateChangedCell(val, cell)
                                      }
                                      field={cell.column.id ==='time' ? 'date' : undefined}
                                    />
                                  )}
                              </TableCell>
                            );
                          })
                        }
                      </TableRow>
                    )}
                  </Draggable>
                )
              })
            }
            </MuiTableBody>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default RbfDnd;