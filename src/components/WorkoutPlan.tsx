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
  Avatar,
  Backdrop,
  Breadcrumbs,
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
  Typography,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { useEffect, useState } from "react";
import { days } from "../utility/Util";
import withDialog from "../HOC/withDialog";
import { useExpanded, useTable } from "react-table";
import training_item_cols from "../utility/TrainingCols";
import _, { last } from "lodash";
import AddNewWorkout from "./AddWorkout";
import { makeStyles } from "@mui/styles";
import Alert from "@mui/lab/Alert";
import { NetworkStatus } from "../domain/Customer";
import { Delete } from "@material-ui/icons";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

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
    width: "50%",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      padding: "0 5% 10% 0",
    },
  },
  fullWidth: {
    width: "100%",
    padding: "0 5% 0 0",
    [theme.breakpoints.down("xs")]: {
      padding: "0 5% 10% 0",
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
}));

const Root = styled("div")(
  ({ theme }) => `
  color: ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,.85)"
  };
  font-size: 14px;
`
);

const Label = styled("label")`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;

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

const DaySelectorWithDialog = (props: {
  onChange: any;
  open: any;
  setOpen: any;
  fullWidth: boolean;
  maxWidth: any;
  title: any;
}) => {
  const { open, setOpen, title, maxWidth, fullWidth, onChange } = props;

  const DayWithDialog = withDialog(DaySelector, {
    open,
    setOpen,
    title,
    maxWidth,
    fullWidth,
  });
  return <DayWithDialog onChange={onChange} />;
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

const RenderWorkouts = (props: { workouts: any; callback: Function }) => {
  const { workouts, callback } = props;

  const [workout_items, setWorkoutItems] = useState<any>(workouts);

  useEffect(() => {
    console.log("setting workout items");
    setWorkoutItems(workouts);
  }, [workouts]);

  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    { columns: training_item_cols, data: workout_items },
    useExpanded
  );

  const rm = training_item_cols.find((tr: any) => tr.id === "remove");
  if (!rm) {
    training_item_cols.unshift(deleteRowColumn());
  }

  const handleCellClick = (cell: any) => {
    if (cell.column.id === "remove") {  
      const localItemscopy = _.cloneDeep(workout_items);
      //console.log(localItems, foundIndex)
      //console.log(cell.row);
      localItemscopy.splice(cell.row.index, 1);
      callback(localItemscopy);
      setWorkoutItems(localItemscopy);
    }
  };

  return (
    <div>
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
            <MuiTableBody>
              {rows.map((row: any, i: any) => {
                prepareRow(row);
                return (
                  <TableRow {...row.getRowProps()} key={row.original.day}>
                    {row.cells.map((cell: any) => {
                      return (
                        <TableCell
                          {...cell.getCellProps()}
                          onClick={() => handleCellClick(cell)}
                        >
                          {cell.render("Cell")}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </MuiTableBody>
          </MuiTable>
        </TableContainer>
      ) : null}
    </div>
  );
};

function AddWorkout(props: { workouts: any; callback: any, items?: any }) {
  const { workouts, callback, items } = props;

  const filter = createFilterOptions<typeof workouts>();
  const [optionValue, setOptionValue] = useState<any>([]);
  const [workout_items, setWorkoutItems] = useState<any>(items ? items : []);

  const [openDaySelector, toggleDaySelector] = useState(false);
  const [openNewWorkout, toggleNewWorkout] = useState(false);

  useEffect(() => {
    setWorkoutItems(items);
  }, [items])

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
    if (newValue.find((el: any) => el.name.startsWith("Add"))) {
      // timeout to avoid instant validation of the dialog's form.
      setTimeout(() => {
        toggleNewWorkout(true);
        setDialogValue({
          name: newValue[newValue.length - 1].inputValue,
        });
      });
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
    getInputLabelProps,
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
    getOptionLabel: (option: any) => option.name,
    filterOptions: (options, params) => {
      const filtered = filter(options, params);

      if (params.inputValue !== "") {
        filtered.push({
          inputValue: params.inputValue,
          name: `Add "${params.inputValue}"`,
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
            <StyledTag label={option.name} {...getTagProps({ index })} />
          ))}
          <input {...getInputProps()} />
        </InputWrapper>
      </div>
      {groupedOptions.length > 0 ? (
        <Listbox {...getListboxProps()}>
          <TableContainer component={Paper}>
            <MuiTable>
              <MuiTableHead>
                <MuiTableRow>
                  <MuiTableCell>Workout Name</MuiTableCell>
                  <MuiTableCell>Excercise</MuiTableCell>
                  <MuiTableCell>Set</MuiTableCell>
                  <MuiTableCell>Rep</MuiTableCell>
                  <MuiTableCell>Tempo</MuiTableCell>
                  <MuiTableCell>Rest</MuiTableCell>
                  <MuiTableCell>Stretching</MuiTableCell>
                </MuiTableRow>
              </MuiTableHead>
              <MuiTableBody>
                {(groupedOptions as typeof workouts).map(
                  (option: any, index: any) => (
                    <MuiTableRow key={index}>
                      <MuiTableCell>
                        <li {...getOptionProps({ option, index })}>
                          {" "}
                          {option.name}
                        </li>
                      </MuiTableCell>
                      <MuiTableCell>{option.excercise}</MuiTableCell>
                      <MuiTableCell>{option.set}</MuiTableCell>
                      <MuiTableCell>{option.rep}</MuiTableCell>
                      <MuiTableCell>{option.tempo}</MuiTableCell>
                      <MuiTableCell>{option.rest}</MuiTableCell>
                      <MuiTableCell>{option.stretching}</MuiTableCell>
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
              const last_option = options[options.length - 1];
              last_option.day = event.target.value;
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
}

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
    if(plan) {
      setWorkoutItems(plan.items);
      setNotes(plan.notes.join('\n').toString());
      setWorkoutName(plan.name);
    }
  },[plan])

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
        <Stack style={{ margin: '0 0 2% 0' }} direction="row" spacing={1} onClick={() => navigate(-1)}>
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

        <AddWorkout items={workout_items} workouts={workouts} callback={setWorkoutItems} />
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
