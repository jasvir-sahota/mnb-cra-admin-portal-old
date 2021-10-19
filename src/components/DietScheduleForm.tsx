import { makeStyles, withStyles } from "@material-ui/styles";
import { Button, TextField, Theme, Backdrop, CircularProgress, MenuItem, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useEffect, useState } from "react";
import _ from 'lodash';
import Alert from '@mui/lab/Alert';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateAdapter from '@mui/lab/AdapterMoment';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import LabelledOutline from "./LabelledOutline";
import { useTable, useExpanded } from 'react-table'
import MaUTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { days } from "../utility/Util";
import DeleteIcon from "@material-ui/icons/Delete";
import DatePicker from '@mui/lab/DatePicker';
import axios from 'axios';
import httpstatus from 'http-status';
import { DietSchedule } from "../domain/DietSchedule";
import TimePicker from '@mui/lab/TimePicker';
import diet_item_cols from "../utility/DietCols";

const useStyles = makeStyles((theme: Theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  container: {
    textAlign: 'left'
  },
  profile: {
    display: 'flex',

    padding: '0 0% 2% 0'
  },
  info: {

  },
  dp: {
    width: theme.spacing(25),
    height: theme.spacing(25),
    margin: '0 5% 0 0',
    [theme.breakpoints.down("xs")]: {
      width: theme.spacing(15),
      height: theme.spacing(15),
    }
  },
  fieldWrapper: {
    display: 'flex',
    padding: '0 0 3% 0',
    [theme.breakpoints.down("md")]: {
      display: 'block'
    }
  },
  field: {
    padding: '0 5% 0 0',
    width: '50%',
    [theme.breakpoints.down("xs")]: {
      width: '100%',
      padding: '0 5% 10% 0',
    }
  },
  fullWidth: {
    width: '100%',
    padding: '0 5% 0 0',
    [theme.breakpoints.down("xs")]: {
      padding: '0 5% 10% 0',
    }
  },
  fieldRoot: {
    margin: '0 1% 0 1%'
  },
  selectField: {
    padding: '0 5% 0 0',
    width: '100%',
    [theme.breakpoints.down("xs")]: {
      width: '100%',
      padding: '0 5% 10% 0',
    }
  },
  action: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
  },
  reset: {
    margin: '0 5% 0 0 ',
    width: '200px'
  },
  submit: {
    width: '200px',
  },
  saveBtn: {
    margin: '0 5% 0 0 ',
    width: '200px',
  },
  deleteBtn: {
    width: '200px',
  },
  error: {
    margin: '0 0 3% 0'
  }
}));

type alertType = {
  severity: any,
  message: string
}

const CustomColorLabelledOutline = withStyles({
  root: {
    "& $notchedOutline": {
      borderColor: "purple"
    },
    "&:hover $notchedOutline": {
      borderColor: "orange"
    },
    "& $inputLabel": {
      color: "green"
    },
    "&:hover $inputLabel": {
      color: "blue"
    },
    "& $content": {
      color: "black"
    },
    "&:hover $content": {
      color: "purple"
    },
    backgroundColor: 'aliceblue'
  },
  notchedOutline: {},
  inputLabel: {},
  content: {}
})(LabelledOutline);

const deleteRowColumn = () => {
  return {
    // Make an expander cell
    Header: () => null, // No header
    id: 'remove', // It needs an ID
    accessor: '',
    Cell: ({ row }: any) => (
      // Use Cell to render an expander for each row.
      // We can use the getToggleRowExpandedProps prop-getter
      // to build the expander.
      <span {...row.getToggleRowExpandedProps()}>
        <DeleteIcon style={{ color: 'red' }} />
      </span>
    )
  }
}

const DietScheduleForm = (props: { schedule: DietSchedule, customer_id: string }) => {
  const classes = useStyles();
  const { schedule } = props;
  const {
    id,
    start_date,
    end_date,
    items,
    notes,
    is_active
  } = schedule;

  const itemObj: any = {
    id: '',
    food_item: '',
    time: moment().unix(),
    day: '',
    instructions: '',
  };

  const [localItems, setItems] = useState<any>(schedule.items);
  const [item, setItem] = useState(itemObj);
  const [alert, setAlert] = useState<alertType | null>(null);
  const [updating, setUpdating] = useState<any>();
  const [localSchedule, setSechedule] = useState<any>(schedule);
  const [isActive, setActive] = useState<boolean>(schedule.is_active);

  useEffect(() => {
    const scheduleObj: any = {
      id,
      start_date: isNaN(Number(schedule.start_date)) ? String(moment().unix()) : start_date,
      end_date: isNaN(Number(schedule.end_date)) === true ? String(moment().add(15, 'days').unix()) : end_date,
      items,
      notes: notes.join('\n').toString(),
      is_active: is_active
    };

    setSechedule(scheduleObj);
    setItems(scheduleObj.items);
    setAlert(null);
    setActive(scheduleObj.is_active)
  }, [schedule]);

  if (updating) {
    const config = { 
      headers: { 
        "Content-Type": "application/json" ,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin' : '*'
      } 
    };
    const defaultAlert = {
      severity: "error",
      message: 'Failed to save the schedule in the system'
    };

    let { REACT_APP_API_HOST } = process.env;

    if(!REACT_APP_API_HOST) {
      console.log('api host not set');
      REACT_APP_API_HOST = 'https://api.mnbfitness.ca/';
    } 

    axios.put(
      `${REACT_APP_API_HOST}/api/v1/admin/customers/diet_schedules/${props.customer_id}`,
      localSchedule,
      config
    ).then(res => {
      setUpdating(false);
      if (res.status === httpstatus.OK) {
        setAlert({
          severity: "success",
          message: 'Sucessfully saved the schedule in system'
        });
      } else {
        setAlert(defaultAlert);
      }
    }).catch(err => {
      setUpdating(false);
      console.error(err);
      setAlert(defaultAlert);
    })
  }

  const rm = diet_item_cols.find((tr: any) => tr.id === 'remove');
  if (!rm) {
    diet_item_cols.unshift(deleteRowColumn());
  }

  const {
    getTableProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({ columns: diet_item_cols, data: localItems }, useExpanded);

  const updateItem = (value: string, field: string) => {
    type key = keyof typeof itemObj;
    const updatedObj = _.cloneDeep(item);
    updatedObj[field as key] = value;
    setItem(updatedObj);
  }

  const addItem = () => {
    item.id = uuidv4();
    const result = _.values(item).find(value => value === undefined || value === null || value === "");

    if (result !== undefined) {
      setAlert({
        severity: "error",
        message: 'Required values cannot be empty. Please make sure there aren`t any such fields.'
      });
    } else {
      setAlert(null);
      const updatedItems = [...localItems, item];
      setItems(updatedItems);
      setItem(itemObj);
    }
  }

  const saveSchedule = () => {
    item.id = uuidv4();
    const scheduleCopy = _.cloneDeep(localSchedule);
    scheduleCopy.items = localItems;
    scheduleCopy.is_active = isActive;

    const result = _.values(scheduleCopy).find(value => {
      //console.log(value, typeof value);
      if (typeof value !== 'number' && typeof value !== 'boolean') {
        return _.isEmpty(value);
      } else {
        return value === undefined ? value : undefined
      }
    });

    console.log(result, scheduleCopy);
    if (result !== undefined) {
      setAlert({
        severity: "error",
        message: 'Required values cannot be empty. Please make sure there aren`t any such fields.'
      });
    } else {
      scheduleCopy.notes = scheduleCopy.notes.split('\n');
      //console.log(scheduleCopy);
      setSechedule(scheduleCopy);
      setUpdating(true);
    }
  }

  const updateScheduleObj = (value: any, field: string) => {
    type key = keyof typeof schedule;
    const updatedObj: any = _.cloneDeep(localSchedule);
    updatedObj[field as key] = value;
    setSechedule(updatedObj);
  }

  const handleCellClick = (cell: any) => {
    if (cell.column.id === 'remove') {
      const localItemscopy = _.cloneDeep(localItems);
      const foundIndex = localItemscopy.findIndex((item: any) => item.id === cell.row.original.id);
      console.log(localItems, foundIndex)
      console.log(cell.row);
      localItemscopy.splice(foundIndex, 1);
      setItems(localItemscopy);
    }
  }

  return (
    <div className={classes.container}>
      <div className={classes.profile}>
        <Backdrop
          className={classes.backdrop}
          open={updating}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
      {
        alert !== null ?
          <Alert className={classes.error} severity={alert.severity}>{alert.message}</Alert>
          : null
      }
      <form>
        <section className={classes.fieldWrapper}>
          <LocalizationProvider dateAdapter={DateAdapter}>
            <DatePicker
              label="Start Date"
              inputFormat="MM/DD/yyyy"
              value={moment.unix(localSchedule.start_date)}
              onChange={(value) => updateScheduleObj(String(moment(value).unix()), "start_date")}
              renderInput={(params) => <TextField variant="standard" className={classes.field} {...params} />}
            />
            {
              <span style={{ opacity: 0 }}> '     '</span>
            }
            <DatePicker
              label="End Date"
              inputFormat="MM/DD/yyyy"
              value={moment.unix(localSchedule.end_date)}
              onChange={(value) => updateScheduleObj(String(moment(value).unix()), "end_date")}
              renderInput={(params) => <TextField variant="standard" className={classes.field}  {...params} />}
            />
          </LocalizationProvider>
        </section>
        <section style={{ padding: '0 0 2% 0' }}>
          {
            localItems.length > 0 ?
              <MaUTable {...getTableProps()} key={schedule.id}>
                <TableHead>
                  {headerGroups.map(headerGroup => (
                    <TableRow {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map(column => (
                        <TableCell {...column.getHeaderProps()}>
                          {column.render('Header')}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableHead>
                <TableBody>
                  {rows.map((row: any, i) => {
                    prepareRow(row)
                    return (
                      <TableRow {...row.getRowProps()}>
                        {row.cells.map((cell: any) => {
                          return (
                            <TableCell {...cell.getCellProps()} onClick={() => handleCellClick(cell)}>
                              {cell.render('Cell')}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </MaUTable>
              : null
          }
        </section>
        <CustomColorLabelledOutline id="myID" label="Add Training Item">

          <section className={classes.fieldWrapper}>
            <TextField
              className={classes.field}
              label="Food Item"
              variant="outlined"
              value={item.excercise}
              required
              onChange={(event) => updateItem(event.target.value, "food_item")}
            />
            {
              <span style={{ opacity: 0 }}> '     '</span>
            }
            <TextField
              className={classes.field}
              label="Instructions"
              value={item.stretching}
              variant="outlined"
              onChange={(event) => updateItem(event.target.value, "instructions")}
            />
          </section>

          <section className={classes.fieldWrapper}>
            <LocalizationProvider dateAdapter={DateAdapter}>
              <TimePicker
                label="Time of Day"
                value={moment.unix(item.time)}
                onChange={(value) => updateItem(String(moment(value).unix()), "time")}
                renderInput={(params) => <TextField variant="standard" className={classes.field}  {...params} />}
              />
            </LocalizationProvider>
            {
              <span style={{ opacity: 0 }}> '     '</span>
            }
            <TextField
              className={classes.field}
              id="standard-select-day"
              select
              label="Day"
              value={item.day}
              onChange={(event) => updateItem(event.target.value, "day")}
              variant="outlined"
            >
              {days.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </section>
          <div className={classes.action}>
            <Button
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() => addItem()}
            >
              Add Item
            </Button>
          </div>
        </CustomColorLabelledOutline>
        <section className={classes.fieldWrapper}>
          <TextField
            style={{ marginTop: '2%' }}
            className={classes.fullWidth}
            label="Notes"
            variant="outlined"
            required
            value={localSchedule.notes}
            onChange={(event) => updateScheduleObj(event.target.value, "notes")}
            multiline
            rows={6}
          />
        </section>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox
              onChange={(event) => setActive(event.target.checked)}
              checked={isActive}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            }
            label="Active (Making this active will make other schedules inactive)"
          />
        </FormGroup>

        <div className={classes.action}>
          <Button
            variant="contained"
            className={classes.saveBtn}
            color="success"
            onClick={() => saveSchedule()}
          >
            Save Schedule
          </Button>
          {
            <span style={{ opacity: 0 }}> '     '</span>
          }
          {
            localSchedule.id !== 'new_sch' ?
              <Button
                variant="contained"
                color="error"
                className={classes.deleteBtn}
                onClick={() => saveSchedule()}
              >
                Delete Schedule
              </Button>
              : null
          }
        </div>
      </form>
    </div>
  );
};


export default DietScheduleForm;