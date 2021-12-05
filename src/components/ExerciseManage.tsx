import { Chip, Stack, TableContainer, TableRow, Theme } from "@mui/material";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import { HeaderGroup, Row, useFilters, useTable } from "react-table";
import { useStore } from "../App";
import exercise_cols from "../utility/ExerciseCols.js";
import MuiTable from "@mui/material/Table";
import MuiTableBody from "@mui/material/TableBody";
import MuiTableHead from "@mui/material/TableHead";
import { TableCell, Dialog, DialogContent, DialogTitle } from "@mui/material";
import Header from "./Header";
import { RenderCell } from "./WorkoutPlan";
import { useEffect, useState } from 'react';
import UploadImage from "./UploadImage";
import moment from "moment";
import { makeStyles } from "@mui/styles";
import { Add } from "@mui/icons-material";
import FilterBar from "./FilterExercise";
import { useNavigate } from "react-router";
import { updateCell } from "../utility/Util";


const useStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: '2%'
  },
  fieldWrapper: {
    display: "flex",
    padding: "0 0 3% 0",
    [theme.breakpoints.down("md")]: {
      display: "block",
    },
  },
  field: {
    padding: "2% 5% 0 0 !important",
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      padding: "0 5% 10% 0",
    },
  },
  fullWidth: {
    width: "100%",
    padding: "0 0 0 0",
    [theme.breakpoints.down("xs")]: {
      padding: "0 0 10% 0",
    },
  },
}));

enum CellMode {
  Default,
  Editable
}

const RenderExercises = observer((props: {
  headerGroups: HeaderGroup[];
  rows: Row[];
  prepareRow: any;
  cell_mode: any;
  updateExercise: Function,
  setCellMode: Function
}) => {
  const { headerGroups, rows, prepareRow, cell_mode, updateExercise, setCellMode } = props;
  const { workoutStore } = useStore();
  const [openImageUpload, toggleImageUpload] = useState<boolean>(false);
  const [selectedEx, setSelectedEx] = useState<string | undefined>();

  const uploadImage = (files: File[]) => {
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);

    reader.onload = () => {
      const base64_image = reader.result;
      if (selectedEx){
        workoutStore.uploadExerciseImage(base64_image, selectedEx)
      }
    };
  };

  const handleImage = (exercise_id : string) => {
    setSelectedEx(exercise_id);
    toggleImageUpload(true);
  }

  return (
    <div style={{marginTop: '3%'}}>
      <TableContainer>
        <MuiTable>
          <MuiTableHead>
            {headerGroups.map((headergroup) => (
              <TableRow {...headergroup.getHeaderGroupProps()}>
                {headergroup.headers.map((column) => (
                  <TableCell {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </MuiTableHead>
          <MuiTableBody>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <TableRow 
                  {...row.getRowProps()} 
                  key={row.id} 
                  onClick={() => setCellMode('editable')}
                >
                  {row.cells.map((cell : any) => {
                    if (cell.column.id === "image") {
                      return (
                        <TableCell onClick={() => handleImage(cell.row.original.id)}>
                          {
                            <RenderCell
                              value={cell.value}
                              mode={cell_mode}
                              callback={(val: any) => {}}
                              field={"image"}
                            />
                          }
                        </TableCell>
                      );
                    } else if (cell.column.id === "excercise") {
                      return (
                        <TableCell>
                          {
                            <RenderCell
                              value={cell.value}
                              mode={cell_mode}
                              callback={(val: any) => updateExercise(val, cell)}
                            />
                          }
                        </TableCell>
                      );
                    } else {
                      return <TableCell>{cell.render("Cell")}</TableCell>;
                    }
                  })}
                </TableRow>
              )
            })}
          </MuiTableBody>
        </MuiTable>
      </TableContainer>

      <Dialog
        open={openImageUpload}
        onClose={() => toggleImageUpload(false)}
        maxWidth={"lg"}
        fullWidth={true}
      >
        <DialogTitle>Attach Image to the exercise</DialogTitle>
        <DialogContent
          style={{
            minHeight: '500px'
          }}
        >
          <UploadImage
            upload={uploadImage}
            upload_status={workoutStore.upload_status}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
});

const ExerciseManage = observer(() => {
  const { workoutStore } = useStore();

  const classes = useStyles();
  const [filteredColumn, setFilteredColumn] = useState<string | undefined>();
  const [cell_mode, setCellMode] = useState<string>('default');
  const [workout_items, setWorkoutItems] = useState<any>([]);

  useEffect(() => {
    const workouts = toJS(workoutStore.workouts);
    workouts.forEach((workout: any) => workout.date = moment.unix(Number(workout.date)).format("MMMM Do YYYY"))

    setWorkoutItems(workouts);
  }, [workoutStore.workouts])

  const { headerGroups, rows, prepareRow, setFilter, } = useTable(
    {
      columns: exercise_cols,
      data: workout_items,
      autoResetFilters: false
    },
    useFilters
  );

  const onFilter = (e : any, column_id: string) => {
    const value = e.target.value || undefined;

    if(filteredColumn !== column_id && filteredColumn !== undefined) {
      setFilter(filteredColumn, undefined);  
    }
    setFilter(column_id, value);
    setFilteredColumn(column_id);
  };

  const handleDivBlur = (event: any) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setCellMode('default');
    }
  };

  const updateExercise = (value: any, cell: any) => {
    const localItemscopy = updateCell(workout_items, cell.row.id, cell.column.id, value)

    workoutStore.saveWorkout({
      excercise: value,
      id: cell.row.original.id
    });
    setWorkoutItems(localItemscopy);
  }

  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <div className={classes.container}>
        <Stack style={{ margin: '0 0 2% 0' }} direction="row" spacing={1} onClick={() => navigate('/exercises/add-new')}>
            <Chip style={{ cursor: "pointer"}} icon={<Add />} label="Add new Exercise" />
        </Stack>
        <FilterBar 
          label={'Filter Exercises'}
          onChange={onFilter}
          columns={exercise_cols}
          defaultFilter={exercise_cols.find(ex => ex.accessor === 'excercise')}
        />
        <div tabIndex={0} onBlur={handleDivBlur}>
          <RenderExercises
            headerGroups={headerGroups}
            rows={rows}
            prepareRow={prepareRow}
            cell_mode={cell_mode}
            updateExercise={updateExercise}
            setCellMode={setCellMode}
          />
        </div>
      </div>
    </div>
  );
});

export default ExerciseManage;

export { ExerciseManage };
