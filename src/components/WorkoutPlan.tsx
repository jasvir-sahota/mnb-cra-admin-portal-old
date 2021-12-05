import { observer } from "mobx-react";
import {
  useAutocomplete,
  AutocompleteGetTagProps,
  createFilterOptions,
} from "@mui/core/AutocompleteUnstyled";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import Header from "./Header";
import { useStore } from "../App";
import { toJS } from "mobx";
import MuiTable from "@mui/material/Table";
import MuiTableBody from "@mui/material/TableBody";
import MuiTableCell from "@mui/material/TableCell";
import MuiTableHead from "@mui/material/TableHead";
import MuiTableRow from "@mui/material/TableRow";
import {
  Backdrop,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Theme,
  Tooltip,
  Typography,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { useEffect, useState } from "react";
import { days, removeSubElement, reorder, updateCell } from "../utility/Util";
import { useExpanded, useFilters, useTable } from "react-table";
import training_item_cols from "../utility/TrainingCols.js";
import _ from "lodash";
import { makeStyles } from "@mui/styles";
import Alert from "@mui/lab/Alert";
import { NetworkStatus } from "../domain/Customer";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateAdapter from "@mui/lab/AdapterMoment";
import moment from "moment";
import { TimePicker } from "@mui/lab";
import RbfDnd from "./React-bf-Dnd";
import AddSuperset from "./AddSuperset";
import SearchExercise from "./SearchExercise";
import { v4 as uuidv4 } from 'uuid';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FilterBar from "./FilterExercise";

const useStyles = makeStyles((theme: Theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  container: {
    textAlign: "left",
    padding: "2% 10% 2% 10%",
  },
  profile: {
    display: "flex",

    padding: "0 0% 2% 0",
  },
  info: {},
  fieldWrapper: {
    display: "flex",
    padding: "0 0 3% 0",
    [theme.breakpoints.down("md")]: {
      display: "block",
    },
  },
  field: {
    padding: "0 5% 0 0",
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
  fieldRoot: {
    margin: "0 1% 0 1%",
  },
  selectField: {
    padding: "0 5% 0 0",
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      padding: "0 5% 10% 0",
    },
  },
  action: {
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
  },
  reset: {
    margin: "0 5% 0 0 ",
    width: "200px",
  },
  submit: {
    width: "200px",
  },
  saveBtn: {
    margin: "0 5% 0 0 ",
    width: "200px",
  },
  deleteBtn: {
    width: "200px",
  },
  error: {
    margin: "0 0 2% 0",
  },
  zindex: {
    zIndex: 0,
  },
  thumb: {
    position: "relative",
    display: "inline-flex",
    marginBottom: 8,
    marginRight: 8,
    width: 60,
    height: 60,
    padding: 4,
    boxSizing: "border-box",
    cursor: 'pointer'
  },
  thumbInner: {
    display: "flex",
    minWidth: 0,
    overflow: "hidden"
  },
  img: {
    display: "block",
    width: "auto",
    height: "100%"
  },
}));

const Root = styled("div")(
  ({ theme }) => `
  color: ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,.85)"
    };
  font-size: 14px;
`
);

const DaySelector = (props: { onChange: any }) => {
  const { onChange } = props;

  return (
    <form>
      <TextField
        id="standard-select-day"
        select
        label="Day"
        variant="outlined"
        fullWidth={true}
        onChange={onChange}
      >
        {days.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </form>
  );
};

const RenderCell = ({
  value,
  mode,
  callback,
  field,
}: {
  value: any;
  mode: any;
  callback: Function;
  field?: any;
}) => {
  const classes = useStyles();
  const [val, setValue] = useState(value);

  const onChange = (e: any) => {
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    callback(val);
  };

  useEffect(() => {
    setValue(value);
  }, [value, mode]);

  if (mode === "editable" && field === undefined) {
    return (
      <TextField
        className={classes.field}
        variant="standard"
        value={val}
        required
        onChange={onChange}
        onBlur={onBlur}
      />
    );
  } else if (mode === "editable" && field === "date") {
    return (
      <LocalizationProvider dateAdapter={DateAdapter}>
        <TimePicker
          value={moment.unix(val)}
          onChange={(value) => {
            setValue(String(moment(value).unix()));
            callback(val);
          }}
          renderInput={(params) => (
            <TextField
              variant="standard"
              className={classes.field}
              {...params}
            />
          )}
        />
      </LocalizationProvider>
    );
  } else if (field === 'image') {
    return (
      <div className={classes.thumb}>
        <div className={classes.thumbInner}>
          {
            val !== null && val !== undefined ?
              <img className={classes.img} src={val} alt={'thumbnail'} />
              :
              <div>
                <Tooltip title={"Exercise doesn't have an image. Upload one."}>
                  <CloudUploadIcon
                    style={{ width: '100%', height: '100%' }}
                    color={'success'}
                  />
                </Tooltip>
              </div>
          }
        </div>
      </div>
    )
  }
  else {
    return (
      <span>
        {field === "date" ? moment.unix(value).format("hh:mm a") : value}
      </span>
    );
  }
};

const RenderWorkouts = (props: { workouts: any; callback: Function }) => {
  const { workouts, callback } = props;

  const [workout_items, setWorkoutItems] = useState<any>(workouts);
  const [cell_mode, setCellMode] = useState<any>("default");
  const [openSubset, toggleSubset] = useState(false);
  const [selectedRow, setSelectedRow] = useState<number | undefined>();
  const [filteredColumn, setFilteredColumn] = useState<string | undefined>();

  useEffect(() => {
    setWorkoutItems(workouts);
  }, [workouts]);

  const supersetCallback = (rowId: number, exercise: string) => {
    const localItemscopy = _.cloneDeep(workout_items);
    const item = localItemscopy[rowId];
    const superset = uuidv4();

    if (item !== undefined) {
      item.superset = item.superset ? item.superset : superset;

      item.subRows.push({
        item_id: item.subRows.length + 1,
        superset_seq: item.subRows.length + 1,
        superset: item.superset,
        day: item.day,
        rep: 5,
        excercise: exercise
      });
    }
    setWorkoutItems(localItemscopy);
    callback(localItemscopy);
  };

  const { headerGroups, rows, prepareRow, setFilter } = useTable(
    {
      columns: training_item_cols,
      data: workout_items,
      expandSubRows: true,
      autoResetFilters: false
    },
    useExpanded,
    useFilters
  );

  const handleCellClick = (cell: any) => {
    if (cell.column.id === "remove") {
      const items = removeSubElement(workout_items, cell.row.id);
      callback(items);
      setWorkoutItems(items);
    } else if (cell.column.id === "add") {
      toggleSubset(true);
      setSelectedRow(cell.row.index);
    }
  };

  const updateChangedCell = (value: any, cell: any) => {
    const localItemscopy = updateCell(workout_items, cell.row.id, cell.column.id, value)

    callback(localItemscopy);
    setWorkoutItems(localItemscopy);
  };

  const handleDivBlur = (event: any) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setCellMode("default");
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      workout_items,
      result.source.index,
      result.destination.index
    );

    callback(items);
    setWorkoutItems(items);
  };

  const onFilter = (e : any, column_id: string) => {
    const value = e.target.value || undefined;
    
    if(filteredColumn !== column_id && filteredColumn !== undefined) {
      setFilter(filteredColumn, undefined);  
    }

    setFilter(column_id, value);
    setFilteredColumn(column_id);
  };

  return (
    <div>
      <div style={{ margin: '2% 0 0 0'}}>
        <FilterBar
          label={'Filter Exercises'}
          onChange={onFilter}
          columns={training_item_cols}
          defaultFilter={training_item_cols.find(tr => tr.accessor === 'excercise') as {Header : string, accessor : string}}
        />
      </div>
      <div tabIndex={0} onBlur={handleDivBlur}>
        {workout_items.length > 0 ? (
          <Paper elevation={3} style={{margin: '2% 0 0 0'}}>
            <TableContainer>
              <MuiTable>
                <MuiTableHead>
                  {headerGroups.map((headerGroup) => (
                    <TableRow {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <TableCell {...column.getHeaderProps()}>
                          {column.render("Header")}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </MuiTableHead>
                <RbfDnd
                  rows={rows}
                  prepareRow={prepareRow}
                  setCellMode={setCellMode}
                  handleCellClick={handleCellClick}
                  cell_mode={cell_mode}
                  updateChangedCell={updateChangedCell}
                  onDragEnd={onDragEnd}
                />
              </MuiTable>
            </TableContainer>
          </Paper>
        ) : null}
        <Dialog
          open={openSubset}
          onClose={() => toggleSubset(false)}
          maxWidth={"lg"}
          fullWidth={true}
        >
          <DialogTitle>Add excercise to the Superset</DialogTitle>
          <DialogContent
            style={{
              minHeight: '500px'
            }}
          >
            <br />
            {
              selectedRow !== undefined ?
                <AddSuperset
                  rowId={selectedRow}
                  callback={supersetCallback}
                /> : null
            }
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

const AddWorkout = observer(
  (props: { workouts: any; callback: any; items?: any }) => {
    const { callback, items } = props;

    const [workout_items, setWorkoutItems] = useState<any>(items ? items : []);

    const [openDaySelector, toggleDaySelector] = useState(false);
    const [selectedExercise, setExercise] = useState<string>("");

    useEffect(() => {
      setWorkoutItems(items);
    }, [items]);

    const onSearchExercise = (exercise: string) => {
      setExercise(exercise);
      toggleDaySelector(true);
    };

    return (
      <Root>
        <div>
          <SearchExercise callback={onSearchExercise} />
        </div>
        <Dialog open={openDaySelector} onClose={() => toggleDaySelector(false)}>
          <DialogTitle>Select a Day for workout</DialogTitle>
          <DialogContent>
            <br />
            <DaySelector
              onChange={(event: any) => {
                const workout_item: any = {
                  excercise: selectedExercise,
                  day: event.target.value,
                  set: "5",
                  rep: "5",
                  tempo: "1:2",
                  stretching: "N/A",
                  rest: "60 seconds",
                  instructions: "None",
                  expanded: true,
                  superset: uuidv4(),
                  item_id: workout_items.length,
                  subRows: []
                };

                const copyItems = _.cloneDeep(workout_items);
                copyItems.push(workout_item);

                setWorkoutItems(copyItems);
                callback(copyItems);
              }}
            />
          </DialogContent>
        </Dialog>
        <RenderWorkouts
          workouts={workout_items}
          callback={(workout_items: any) => {
            setWorkoutItems(workout_items);
            callback(workout_items);
          }}
        />
      </Root>
    );
  }
);

type alertType = {
  severity: any;
  message: string;
};

const WorkoutPlan = observer((props: { plan?: any }) => {
  const { plan } = props;
  const { workoutStore } = useStore();
  const workouts = toJS(workoutStore.workouts);
  const classes = useStyles();
  const [alert, setAlert] = useState<alertType | null>();

  const [workout_items, setWorkoutItems] = useState<any>(plan ? plan.items : []);
  const [notes, setNotes] = useState<any>(plan ? plan.notes.join("\n").toString() : "");
  const [workout_name, setWorkoutName] = useState<any>(plan ? plan.name : '');

  const navigate = useNavigate();

  useEffect(() => {
    switch (workoutStore.plan_status) {
      case NetworkStatus.Updated:
        setAlert({
          severity: "success",
          message: "Sucessufully saved the workout plan in the system",
        });
        break;

      case NetworkStatus.UpdateFailed:
        setAlert({
          severity: "error",
          message: "Failed to save the workout in system",
        });
        break;

      default:
        setAlert(null);
        break;
    }
  }, [workoutStore.plan_status]);

  const savePlan = () => {
    if (workout_items.length === 0) {
      setAlert({
        severity: `error`,
        message: "Plan cannot have zero workout items",
      });
    } else if (notes === "") {
      setAlert({
        severity: `error`,
        message: "Plan should have notes",
      });
    } else if (workout_name === "") {
      setAlert({
        severity: `error`,
        message: "Plan name is required!",
      });
    } else {
      const plan_obj = {
        name: workout_name,
        workouts: workout_items,
        notes: JSON.stringify(notes.split("\n")),
      };
      workoutStore.savePlan(plan_obj);
    }
  };

  return (
    <div>
      <Header />
      <div className={classes.container}>
        <Stack
          style={{ margin: "0 0 2% 0" }}
          direction="row"
          spacing={1}
          onClick={() => navigate(-1)}
        >
          <Chip icon={<ArrowBackIosIcon />} label="Back to the Plans" />
        </Stack>
        {alert !== null && alert !== undefined ? (
          <Alert className={classes.error} severity={alert.severity}>
            {alert.message}
          </Alert>
        ) : null}
        <section className={classes.fieldWrapper}>
          <TextField
            className={classes.fullWidth}
            label="Plan Name"
            variant="filled"
            required
            value={workout_name}
            onChange={(event: any) => setWorkoutName(event.target.value)}
          />
        </section>

        <AddWorkout
          items={workout_items}
          workouts={workouts}
          callback={setWorkoutItems}
        />
        <form>
          <Backdrop
            className={classes.backdrop}
            open={workoutStore.plan_status === NetworkStatus.Updating}
          >
            <CircularProgress color="inherit" />
          </Backdrop>

          <section className={classes.fieldWrapper}>
            <TextField
              style={{ marginTop: "2%" }}
              className={classes.fullWidth}
              label="Notes"
              variant="outlined"
              required
              multiline
              value={notes}
              onChange={(event: any) => setNotes(event.target.value)}
              rows={6}
              classes={{
                root: classes.zindex,
              }}
            />
          </section>

          <div className={classes.action}>
            <Button
              variant="contained"
              className={classes.saveBtn}
              color="success"
              onClick={() => savePlan()}
            >
              Save Workout Plan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default WorkoutPlan;

export { RenderWorkouts, RenderCell, DaySelector };
