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
import { days, reorder } from "../utility/Util";
import withDialog from "../HOC/withDialog";
import { Cell, useExpanded, useSortBy, useTable } from "react-table";
import _, { last } from "lodash";
import AddNewDiet from "./AddDiet";
import { makeStyles } from "@mui/styles";
import Alert from "@mui/lab/Alert";
import { NetworkStatus } from "../domain/Customer";
import { Delete } from "@material-ui/icons";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import diet_item_cols from "../utility/DietCols";
import { RenderCell } from "./WorkoutPlan";
import moment from "moment";
import RbfDnd from "./React-bf-Dnd";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';


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

const RenderDiets = (props: { diets: any; callback: Function }) => {
  const { diets, callback } = props;

  const [workout_items, setWorkoutItems] = useState<any>([]);
  const [cell_mode, setCellMode] = useState<any>("default");

  useEffect(() => {
    setWorkoutItems(diets);
  }, [diets]);

  const { headerGroups, rows, prepareRow } = useTable(
    {
      columns: diet_item_cols,
      data: workout_items,
    },
    useSortBy,
    useExpanded
  );

  const rm = diet_item_cols.find((tr: any) => tr.id === "remove");
  const mv = diet_item_cols.find((tr: any) => tr.id === "move");


  if (!rm) {
    diet_item_cols.unshift(deleteRowColumn());
  }

  if (!mv) {
    diet_item_cols.unshift(moveRowColumn());
  }

  const handleCellClick = (cell: any) => {
    if (cell.column.id === "remove") {
      const localItemscopy = _.cloneDeep(workout_items);
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
                    <TableCell {...column.getHeaderProps(column.getSortByToggleProps())}>
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

const AddDiet = observer((props: { diets: any; callback: any, items?: any })  => {
  const { diets, callback, items } = props;

  const filter = createFilterOptions<typeof diets>();
  const [optionValue, setOptionValue] = useState<any>([]);
  const [diet_items, setDietItems] = useState<any>(items ? items : []);

  const [openDaySelector, toggleDaySelector] = useState(false);
  const [openNewDiet, toggleNewDiet] = useState(false);

  const { dietStore } = useStore();

  useEffect(() => {
    setDietItems(items);
  }, [items])

  const handleClose = () => {
    setDialogValue({
      name: "",
    });
    toggleNewDiet(false);
  };

  const [dialogValue, setDialogValue] = useState({
    name: "",
  });

  const onChange = (event: any, newValue: any) => {
    if (newValue.find((el: any) => el.food_item.startsWith("Add"))) {
      // timeout to avoid instant validation of the dialog's form.
      const el = newValue[newValue.length - 1].inputValue;
      const obj = {
        food_item: el.replace('Add','')
      }
      dietStore.saveDiet(obj); 
    } else if (newValue && newValue.inputValue) {
      toggleNewDiet(true);
      setDialogValue({
        name: newValue.inputValue,
      });
    } else if (newValue.length < optionValue.length) {
      setOptionValue(newValue);
      const copyItems = _.cloneDeep(diet_items);
      const removedEl = copyItems.find((el: any) => !newValue.includes(el));
      console.log(removedEl);
      const index = copyItems.findIndex(
        (item: any) => item.name === removedEl.name
      );
      copyItems.splice(index, 1);
      setDietItems(copyItems);
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
    options: diets,
    value: optionValue,
    getOptionLabel: (option: any) => option.food_item,
    filterOptions: (options, params) => {
      const filtered = filter(options, params);

      if (params.inputValue !== "") {
        filtered.push({
          inputValue: params.inputValue,
          food_item: `Add "${params.inputValue}"`,
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
          {value.map((option: typeof diets, index: number) => (
            <StyledTag label={option.food_item} {...getTagProps({ index })} />
          ))}
          <input {...getInputProps()} placeholder={"Search Food Item"} />
        </InputWrapper>
      </div>
      {groupedOptions.length > 0 ? (
        <Listbox {...getListboxProps()}>
          <TableContainer component={Paper}>
            <MuiTable>
              <MuiTableBody>
                {(groupedOptions as typeof diets).map(
                  (option: any, index: any) => (
                    <MuiTableRow key={index}>
                      <MuiTableCell>
                        <li {...getOptionProps({ option, index })}>
                          {" "}
                          {option.food_item}
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
        <DialogTitle>Select a Day for diet</DialogTitle>
        <DialogContent>
          <br />
          <DaySelector
            onChange={(event: any) => {
              let options = _.cloneDeep(optionValue);
              let last_option = options[options.length - 1];
              last_option = {
                ...last_option,
                day: event.target.value,
                instructions: "None",
                item_id: diet_items.length,
                time: moment().unix()
              };
              const copyItems = _.cloneDeep(diet_items);
              copyItems.push(last_option);
              setDietItems(copyItems);
              callback(copyItems);
            }}
          />
        </DialogContent>
      </Dialog>
      <Dialog
        open={openNewDiet}
        onClose={handleClose}
        maxWidth={"lg"}
        fullWidth={true}
      >
        <DialogTitle>Create a new Diet </DialogTitle>
        <DialogContent>
          <br />
          <AddNewDiet name={dialogValue.name} />
        </DialogContent>
      </Dialog>
      <RenderDiets
        diets={diet_items}
        callback={(diet_items: any) => {
          setDietItems(diet_items);
          callback(diet_items);
        }}
      />
    </Root>
  );
});

type alertType = {
  severity: any;
  message: string;
};

const DietPlan = observer((props: { plan?: any }) => {
  const { plan } = props;
  const { dietStore } = useStore();
  const diets = toJS(dietStore.diets);
  const classes = useStyles();
  const [alert, setAlert] = useState<alertType | null>();

  const [diet_items, setDietItems] = useState<any>([]);
  const [notes, setNotes] = useState<any>("");
  const [diet_name, setDietName] = useState<any>("");

  const navigate = useNavigate();
  
  console.log(diet_items);

  useEffect(() => {
    switch (dietStore.plan_status) {
      case NetworkStatus.Updated:
        setAlert({
          severity: "success",
          message: "Sucessufully saved the diet plan in the system",
        });
        break;

      case NetworkStatus.UpdateFailed:
        setAlert({
          severity: "error",
          message: "Failed to save the diet in system",
        });
        break;

      default:
        setAlert(null);
        break;
    }
  }, [dietStore.plan_status]);

  useEffect(() => {
    if(plan) {
      setDietItems(plan.items);
      setNotes(plan.notes.join('\n').toString());
      setDietName(plan.name);
    }
  },[plan])

  const savePlan = () => {
    if (diet_items.length === 0) {
      setAlert({
        severity: `error`,
        message: "Plan cannot have zero diet items",
      });
    } else if (notes === "") {
      setAlert({
        severity: `error`,
        message: "Plan should have notes",
      });
    } else if (diet_name === "") {
      setAlert({
        severity: `error`,
        message: "Plan name is required!",
      });
    } else {
      const plan_obj = {
        name: diet_name,
        items: diet_items,
        notes: JSON.stringify(notes.split("\n")),
      };

      dietStore.savePlan(plan_obj);
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
            value={diet_name}
            onChange={(event: any) => setDietName(event.target.value)}
          />
        </section>

        <AddDiet items={diet_items} diets={diets} callback={setDietItems} />
        <form>
          <Backdrop
            className={classes.backdrop}
            open={dietStore.plan_status === NetworkStatus.Updating}
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
              Save Diet Plan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default DietPlan;

export {
  RenderDiets
}