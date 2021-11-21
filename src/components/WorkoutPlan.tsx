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
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { useEffect, useState } from "react";
import { days, reorder } from "../utility/Util";
import {
  useExpanded,
  useTable,
} from "react-table";
import training_item_cols from "../utility/TrainingCols";
import _ from "lodash";
import AddNewWorkout from "./AddWorkout";
import { makeStyles } from "@mui/styles";
import Alert from "@mui/lab/Alert";
import { NetworkStatus } from "../domain/Customer";
import { Delete } from "@material-ui/icons";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateAdapter from '@mui/lab/AdapterMoment';
import moment from 'moment';
import { TimePicker } from "@mui/lab";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import RbfDnd from "./React-bf-Dnd";

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
}));

const Root = styled("div")(
  ({ theme }) => `
  color: ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,.85)"
  };
  font-size: 14px;
`
);

const InputWrapper = styled("div")(
  ({ theme }) => `
  width: 100%;
  border: 1px solid grey;
  background-color: ${theme.palette.mode === "dark" ? "#141414" : "#fff"};
  border-radius: 1px;
  padding: 1px;
  display: flex;
  flex-wrap: wrap;

  &:hover {
    border-color: ${theme.palette.mode === "dark" ? "#177ddc" : "#40a9ff"};
  }

  &.focused {
    border-color: grey;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  & input {
    background-color: ${theme.palette.mode === "dark" ? "#141414" : "#fff"};
    color: ${
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.65)"
        : "rgba(0,0,0,.85)"
    };
    height: 30px;
    box-sizing: border-box;
    padding: 4px 6px;
    width: 0;
    min-width: 30px;
    flex-grow: 1;
    border: 0;
    margin: 0;
    outline: 0;
  }
`
);

interface TagProps extends ReturnType<AutocompleteGetTagProps> {
  label: string;
}

function Tag(props: TagProps) {
  const { label, onDelete, ...other } = props;
  return (
    <div {...other}>
      <span>{label}</span>
      <CloseIcon onClick={onDelete} />
    </div>
  );
}

const StyledTag = styled(Tag)<TagProps>(
  ({ theme }) => `
  display: flex;
  align-items: center;
  height: 24px;
  margin: 2px;
  line-height: 22px;

  border: 1px solid ${theme.palette.mode === "dark" ? "#303030" : "#e8e8e8"};
  border-radius: 2px;
  box-sizing: content-box;
  padding: 0 4px 0 10px;
  outline: 0;
  overflow: hidden;

  &:focus {
    border-color: ${theme.palette.mode === "dark" ? "#177ddc" : "#40a9ff"};
    background-color: ${theme.palette.mode === "dark" ? "#003b57" : "#e6f7ff"};
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & svg {
    font-size: 12px;
    cursor: pointer;
    padding: 4px;
  }
`
);

const Listbox = styled("ul")(
  ({ theme }) => `
  width: 80%;
  margin: 2px 0 0;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color: ${theme.palette.mode === "dark" ? "#141414" : "#fff"};
  overflow: auto;
  max-height: 800px;
  border-radius: 1px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }

    & svg {
      color: transparent;
    }
  }

  & li[aria-selected='true'] {
    background-color: ${theme.palette.mode === "dark" ? "#2b2b2b" : "#fafafa"};
    font-weight: 600;

    & svg {
      color: #1890ff;
    }
  }

  & li[data-focus='true'] {
    background-color: ${theme.palette.mode === "dark" ? "#003b57" : "#e6f7ff"};
    cursor: pointer;

    & svg {
      color: currentColor;
    }
  }
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

const deleteRowColumn = () => {
  return {
    // Make an expander cell
    Header: () => null, // No header
    id: "remove", // It needs an ID
    accessor: "",
    Cell: ({ row }: any) => (
      // Use Cell to render an expander for each row.
      // We can use the getToggleRowExpandedProps prop-getter
      // to build the expander.
      <span {...row.getToggleRowExpandedProps()}>
        <Delete style={{ color: "red" }} />
      </span>
    ),
  };
};

const moveRowColumn = () => {
  return {
    // Make an expander cell
    Header: () => null, // No header
    id: "move", // It needs an ID
    accessor: "",
    Cell: ({ row }: any) => (
      // Use Cell to render an expander for each row.
      // We can use the getToggleRowExpandedProps prop-getter
      // to build the expander.
      <span {...row.getToggleRowExpandedProps()}>
        <DragIndicatorIcon />
      </span>
    ),
  };
};

const RenderCell = ({
  value,
  mode,
  callback,
  field
}: {
  value: any;
  mode: any;
  callback: Function;
  field?: any
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
  } else if (mode === "editable" && field === 'date') {
    return (
      <LocalizationProvider dateAdapter={DateAdapter}>
      <TimePicker
        value={moment.unix(val)}
        onChange={(value) => {
          console.log(value)
          setValue(String(moment(value).unix()));
          callback(val);
        }}
        renderInput={(params) => <TextField variant="standard" className={classes.field} {...params} />}
      />
    </LocalizationProvider>
    )
  } else {
    return <span>{field === "date" ? moment.unix(value).format("hh:mm a") : value}</span>;
  }
};

const RenderWorkouts = (props: { workouts: any; callback: Function }) => {
  const { workouts, callback } = props;

  const [workout_items, setWorkoutItems] = useState<any>([]);
  const [cell_mode, setCellMode] = useState<any>("default");

  useEffect(() => {
    setWorkoutItems(workouts);
  }, [workouts]);

  const { headerGroups, rows, prepareRow } = useTable(
    {
      columns: training_item_cols,
      data: workout_items,
    },
    useExpanded
  );

  const rm = training_item_cols.find((tr: any) => tr.id === "remove");
  const mv = training_item_cols.find((tr: any) => tr.id === "move");

  if (!rm) {
    training_item_cols.unshift(deleteRowColumn());
  }

  if (!mv) {
    training_item_cols.unshift(moveRowColumn());
  }

  const handleCellClick = (cell: any) => {
    if (cell.column.id === "remove") {
      const localItemscopy = _.cloneDeep(workout_items);
      localItemscopy.splice(cell.row.index, 1);
      localItemscopy.map((item: any, index: number) => item.item_id = index +  1);
      callback(localItemscopy);
      setWorkoutItems(localItemscopy);
    }
  };

  const updateChangedCell = (value: any, cell: any) => {
    const localItemscopy = _.cloneDeep(workout_items);

    localItemscopy[cell.row.index][cell.column.id] = value;
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
  }

  return (
    <div tabIndex={0} onBlur={handleDivBlur}>
      {workout_items.length > 0 ? (
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
      ) : null}
    </div>
  );
};

const AddWorkout = observer((props: { workouts: any; callback: any; items?: any }) => {
  const { workouts, callback, items } = props;

  const filter = createFilterOptions<typeof workouts>();
  const [optionValue, setOptionValue] = useState<any>([]);
  const [workout_items, setWorkoutItems] = useState<any>(items ? items : []);

  const [openDaySelector, toggleDaySelector] = useState(false);
  const [openNewWorkout, toggleNewWorkout] = useState(false);

  const { workoutStore } = useStore();

  useEffect(() => {
    setWorkoutItems(items);
  }, [items]);

  const handleClose = () => {
    setDialogValue({
      name: "",
    });
    toggleNewWorkout(false);
  };

  const [dialogValue, setDialogValue] = useState({
    name: "",
  });

  const onChange = (event: any, newValue: any) => {
    if (newValue.find((el: any) => el.excercise.startsWith("Add"))) {
      // timeout to avoid instant validation of the dialog's form.
      const el = newValue[newValue.length - 1].inputValue;
      const obj = {
        excercise: el.replace('Add','')
      }
      workoutStore.saveWorkout(obj); 
    } else if (newValue && newValue.inputValue) {
      toggleNewWorkout(true);
      setDialogValue({
        name: newValue.inputValue,
      });
    } else if (newValue.length < optionValue.length) {
      setOptionValue(newValue);
      const copyItems = _.cloneDeep(workout_items);
      const removedEl = copyItems.find((el: any) => !newValue.includes(el));
      console.log(removedEl);
      const index = copyItems.findIndex(
        (item: any) => item.name === removedEl.name
      );
      copyItems.splice(index, 1);
      setWorkoutItems(copyItems);
      callback(copyItems);
    } else {
      toggleDaySelector(true);
      setOptionValue(newValue);
    }
  };

  const {
    getRootProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: "customized-hook-demo",
    //defaultValue: [top100Films[1]],
    multiple: true,
    options: workouts,
    value: optionValue,
    getOptionLabel: (option: any) => option.excercise,
    filterOptions: (options, params) => {
      const filtered = filter(options, params);

      if (params.inputValue !== "") {
        filtered.push({
          inputValue: params.inputValue,
          excercise: `Add "${params.inputValue}"`,
        });
      }

      return filtered;
    },
    onChange: onChange,
  });

  return (
    <Root>
      <div {...getRootProps()}>
        <InputWrapper ref={setAnchorEl} className={focused ? "focused" : ""}>
          {value.map((option: typeof workouts, index: number) => (
            <StyledTag label={option.excercise} {...getTagProps({ index })} />
          ))}
          <input {...getInputProps()} placeholder={"Search Exercise"} />
        </InputWrapper>
      </div>
      {groupedOptions.length > 0 ? (
        <Listbox {...getListboxProps()}>
          <TableContainer component={Paper}>
            <MuiTable>
              <MuiTableBody>
                {(groupedOptions as typeof workouts).map(
                  (option: any, index: any) => (
                    <MuiTableRow key={index}>
                      <MuiTableCell>
                        <li {...getOptionProps({ option, index })}>
                          {" "}
                          {option.excercise}
                        </li>
                      </MuiTableCell>
                    </MuiTableRow>
                  )
                )}
              </MuiTableBody>
            </MuiTable>
          </TableContainer>
        </Listbox>
      ) : null}
      <Dialog open={openDaySelector} onClose={() => toggleDaySelector(false)}>
        <DialogTitle>Select a Day for workout</DialogTitle>
        <DialogContent>
          <br />
          <DaySelector
            onChange={(event: any) => {
              let options = _.cloneDeep(optionValue);
              let last_option = options[options.length - 1];

              last_option = {
                ...last_option,
                day: event.target.value,
                set: "5",
                rep: "5",
                tempo: "1:2",
                stretching: "N/A",
                rest: "60 seconds",
                instructions: "None",
                item_id: workout_items.length
              };

              const copyItems = _.cloneDeep(workout_items);
              copyItems.push(last_option);
              setWorkoutItems(copyItems);
              callback(copyItems);
            }}
          />
        </DialogContent>
      </Dialog>
      <Dialog
        open={openNewWorkout}
        onClose={handleClose}
        maxWidth={"lg"}
        fullWidth={true}
      >
        <DialogTitle>Create a new Workout </DialogTitle>
        <DialogContent>
          <br />
          <AddNewWorkout name={dialogValue.name} />
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
});

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

  const [workout_items, setWorkoutItems] = useState<any>([]);
  const [notes, setNotes] = useState<any>("");
  const [workout_name, setWorkoutName] = useState<any>("");

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

  useEffect(() => {
    if (plan) {
      setWorkoutItems(plan.items);
      setNotes(plan.notes.join("\n").toString());
      setWorkoutName(plan.name);
    }
  }, [plan]);

  const savePlan = () => {
    console.log(workout_items);
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

export { RenderWorkouts, RenderCell };
