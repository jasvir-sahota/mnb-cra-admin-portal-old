import { observer } from "mobx-react";
import { styled } from "@mui/material/styles";
import Header from "./Header";
import { useStore } from "../App";
import { toJS } from "mobx";
import MuiTable from "@mui/material/Table";
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
import { Cell, useExpanded, useFilters, useTable } from "react-table";
import _ from "lodash";
import AddNewDiet from "./AddDiet";
import { makeStyles } from "@mui/styles";
import Alert from "@mui/lab/Alert";
import { NetworkStatus } from "../domain/Customer";
import { Delete } from "@material-ui/icons";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import diet_item_cols from "../utility/DietCols.js";
import moment from "moment";
import RbfDnd from "./React-bf-Dnd";
import FilterBar from "./FilterExercise";
import SearchFoodItem from "./SearchFoodItem";


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
    padding: "0 0 0 0",
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

const RenderDiets = (props: { diets: any; callback: Function }) => {
  const { diets, callback } = props;

  const [workout_items, setWorkoutItems] = useState<any>([]);
  const [cell_mode, setCellMode] = useState<any>("default");
  const [filteredColumn, setFilteredColumn] = useState<string | undefined>();

  useEffect(() => {
    setWorkoutItems(diets);
  }, [diets]);

  const { headerGroups, rows, prepareRow, setFilter } = useTable(
    {
      columns: diet_item_cols,
      data: workout_items,
      autoResetFilters: false
    },
    useExpanded,
    useFilters
  );

  const handleCellClick = (cell: any) => {
    if (cell.column.id === "remove") {
      const localItemscopy = _.cloneDeep(workout_items);
      localItemscopy.splice(cell.row.index, 1);
      localItemscopy.map((item: any, index: number) => item.item_id = index + 1);
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

  const onFilter = (e: any, column_id: string) => {
    const value = e.target.value || undefined;

    if (filteredColumn !== column_id && filteredColumn !== undefined) {
      setFilter(filteredColumn, undefined);
    }

    setFilter(column_id, value);
    setFilteredColumn(column_id);
  };

  return (
    <div>
      <div style={{ margin: '2% 0 0 0' }}>
        <FilterBar
          label={'Filter Diets'}
          onChange={onFilter}
          columns={diet_item_cols}
          defaultFilter={diet_item_cols.find((tr: any) => tr.accessor === 'food_item') as { Header: string, accessor: string }}
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
      </div>
    </div>
  );
};

const AddDiet = observer((props: { diets: any; callback: any, items?: any }) => {
  const { callback, items } = props;

  const [diet_items, setDietItems] = useState<any>(items ? items : []);

  const [openDaySelector, toggleDaySelector] = useState(false);
  const [selectedFoodItem, setFoodItem] = useState<string>("");

  const [openNewDiet, toggleNewDiet] = useState(false);

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

  const onSearch = (foodItem: string) => {
    setFoodItem(foodItem);
    toggleDaySelector(true);
  };

  return (
    <Root>
      <div>
        <SearchFoodItem callback={onSearch} />
      </div>
      <Dialog open={openDaySelector} onClose={() => toggleDaySelector(false)}>
        <DialogTitle>Select a Day for diet</DialogTitle>
        <DialogContent>
          <br />
          <DaySelector
            onChange={(event: any) => {
              const diet_item: any = {
                food_item: selectedFoodItem,
                day: event.target.value,
                item_id: diet_items.length,
                instructions: 'none',
                time: moment().unix()
              };

              const copyItems = _.cloneDeep(diet_items);
              copyItems.push(diet_item);

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
    if (plan) {
      setDietItems(plan.items);
      setNotes(plan.notes.join('\n').toString());
      setDietName(plan.name);
    }
  }, [plan])

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