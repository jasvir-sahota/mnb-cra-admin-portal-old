import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { TableCell, TableRow } from "@mui/material";
import { RenderCell } from "./WorkoutPlan";
import MuiTableBody from "@mui/material/TableBody";

const getItemStyle = (isDragging, draggableStyle) => ({
  // styles we need to apply on draggables
  ...draggableStyle,

  ...(isDragging && {
    background: "rgb(235,235,235)"
  })
});


const RbfDnd = ({ rows, prepareRow, setCellMode, handleCellClick, cell_mode, updateChangedCell, onDragEnd }) => {

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
            <MuiTableBody
              ContainerProps={{ ref: provided.innerRef }}
              ref={provided.innerRef}
            >
            {
              rows.map((row, index) => {
                prepareRow(row);
                return (
                  <Draggable key={`draggable-${row.id}`} draggableId={`draggable-${row.id}`} index={index}>
                    {(provided, snapshot) => (
                      <TableRow
                        {...row.getRowProps()}
                        key={row.id}
                        onClick={() => setCellMode("editable")}
                        ContainerComponent="row"
                        ContainerProps={{ ref: provided.innerRef }}
                        ref={provided.innerRef}

                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.styles
                        )}
                      >
                        {
                          row.cells.map(cell => {
                            if (cell.column.id === 'move') {
                              return (
                                <TableCell
                                  {...cell.getCellProps()}
                                  {...provided.dragHandleProps}
                                  {...provided.draggableProps}
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