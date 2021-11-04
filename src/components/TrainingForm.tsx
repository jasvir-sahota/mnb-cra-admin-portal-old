import { TrainingSchedule } from "../domain/TrainingSchedule";
import { makeStyles, withStyles } from "@mui/styles";
import { Button, TextField, Theme, Backdrop, CircularProgress, MenuItem, Checkbox, FormControlLabel, FormGroup, FormControl, Select, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import _ from 'lodash';
import Alert from '@mui/lab/Alert';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateAdapter from '@mui/lab/AdapterMoment';
import moment from 'moment';
import LabelledOutline from "./LabelledOutline";
import DeleteIcon from "@material-ui/icons/Delete";
import DatePicker from '@mui/lab/DatePicker';
import axios from 'axios';
import httpstatus from 'http-status';
import { observer } from "mobx-react";
import { useStore } from "../App";

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
  },
  selectLabel: {
    display: "flex",
    width: "95%",
  },
  formControl: {
    width: "100%",
    margin: "0 0 3% 0",
  },
}));

type alertType = {
  severity: any,
  message: string
}

const TrainingForm = observer((props : {schedule : TrainingSchedule, customer_id: string}) => {
  const classes = useStyles();
  const { schedule } = props;
  const { workoutStore } = useStore();

  const {
    id,
    start_date, 
    end_date, 
    plan_id,
    is_active
  } = schedule;

  const [alert, setAlert] = useState<alertType | null>(null);
  const [updating, setUpdating] = useState<any>();
  const [localSchedule, setSechedule] = useState<any>(schedule);
  const [isActive, setActive] = useState<boolean>(schedule.is_active);
  const [planId, setPlanId] = useState<any>(schedule.plan_id);

  useEffect(() => {
    const scheduleObj : any = {
      id,
      start_date: isNaN(Number(schedule.start_date)) ? String(moment().unix()) : start_date,
      end_date :  isNaN(Number(schedule.end_date)) === true ? String(moment().add(15, 'days').unix()) : end_date,
      plan_id,
      is_active: is_active
    };

    setSechedule(scheduleObj);
    setAlert(null);
    setActive(scheduleObj.is_active);
    setPlanId(schedule.plan_id);
  }, [schedule]);

  let { REACT_APP_API_HOST } = process.env;

  if(!REACT_APP_API_HOST) {
    console.log('api host not set');
    REACT_APP_API_HOST = 'https://api.mnbfitness.ca/';
  }
  const config = { 
    headers: { 
      "Content-Type": "application/json" ,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin' : '*'
    } 
  };

  useEffect(() => {
    if(updating) {
      const defaultAlert = {
        severity: "error",
        message: 'Failed to save the schedule in the system'
      };
      
      axios.put(
        `${REACT_APP_API_HOST}api/v1/admin/customers/training_schedules/${props.customer_id}`,
        localSchedule,
        config
        ).then(res => {
          setUpdating(false);
          if(res.status === httpstatus.OK) {
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
  },[updating])

  const saveSchedule = () => {
    const scheduleCopy : TrainingSchedule = _.cloneDeep(localSchedule);
    scheduleCopy.plan_id = planId;
    scheduleCopy.is_active = isActive;

    const result = _.values(scheduleCopy).find(value => {
      if (typeof value !== 'number' && typeof value !== 'boolean') {
        return _.isEmpty(value);
      } else {
        return value === undefined ? value : undefined
      }
    });
    
    if(result !== undefined) {
      setAlert({
        severity: "error",
        message: 'Required values cannot be empty. Please make sure there aren`t any such fields.'
      });
    } else {
      setSechedule(scheduleCopy);
      setUpdating(true);
    }
  }

  const deleteSchedule = () => {
    const id = schedule.id;
    console.log(schedule);
    const defaultAlert = {
      severity: "error",
      message: 'Failed to delete the schedule in the system'
    };

    axios.post(
      `${REACT_APP_API_HOST}api/v1/admin/customers/training_schedules/archive-schedule`,
      {
        id
      },
      config
      ).then(res => {
        setUpdating(false);
        if(res.status === httpstatus.OK) {
          setAlert({
            severity: "success",
            message: 'Sucessfully deleted the schedule'
          });
        } else { 
          setAlert(defaultAlert);
        }
      }).catch(err => {
        setUpdating(false);
        setAlert(defaultAlert);
      })
  }

  const updateScheduleObj = (value: any, field: string) => {
    type key = keyof typeof schedule;
    const updatedObj : any = _.cloneDeep(localSchedule);
    updatedObj[field as key]  = value;
    setSechedule(updatedObj);
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
            <span style={{opacity: 0}}> '     '</span>
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
        <div>
        <FormControl variant="outlined" className={classes.formControl}>
        <Select
          value={planId}
          onChange={(event: any) => setPlanId(event.target.value)}
        >
          {workoutStore.plans.map((plan) => (
            <MenuItem value={plan.id}>
              {
                <div className={classes.selectLabel}>
                  <Typography
                    variant={"body2"}
                  >
                    {plan.name}
                  </Typography>
                </div>
              }
            </MenuItem>
          ))}
        </Select>
      </FormControl>
        </div>
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
            <span style={{opacity: 0}}> '     '</span>
          }
          {
            localSchedule.id !== 'new_sch' ?
            <Button
            variant="contained"
            color="error"
            className={classes.deleteBtn}
            onClick={() => deleteSchedule()}
          >
            Delete Schedule
          </Button>
          : null
          }
        </div>
      </form>
    </div>
  );
});


export default TrainingForm;