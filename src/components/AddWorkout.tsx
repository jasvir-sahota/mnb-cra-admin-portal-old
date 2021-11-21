import { Backdrop, Button, CircularProgress, TextField, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import _ from 'lodash';
import { useStore } from "../App";
import { NetworkStatus } from "../domain/Customer";
import Alert from '@mui/lab/Alert';

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

const AddWorkout = observer((props: { name: any }) => {
  const { name } = props;
  const { workoutStore } = useStore();

  const itemObj : any = {
    excercise: '',
    stretching: '',
    set: '',
    rep: '',
    tempo: '',
    rest: ''
  };

  type alertType = {
    severity: any,
    message: string
  }
  
  const [item, setItem] = useState(itemObj);
  const [alert, setAlert] = useState<alertType | null>();

  const classes = useStyles();

  useEffect(() => {
    switch (workoutStore.workout_status) {
      case NetworkStatus.Updated:
        setAlert({
          severity: "success",
          message: 'Sucessufully saved the workout in the system'
        })
        break;

      case NetworkStatus.UpdateFailed:
        setAlert({
          severity: "error",
          message: 'Failed to save the workout in system'
        })
        break;

      default:
        setAlert(null);
        break;
    }
  }, [workoutStore.workout_status])

  const updateItem = (value: string, field: string) => {
    type key = keyof typeof itemObj;
    const updatedObj = _.cloneDeep(item);
    updatedObj[field as key]  = value;
    setItem(updatedObj);
  }

  const saveItem = () => {
    const result = _.values(item).find(value => value === undefined || value === null || value === "");

    if(result !== undefined) {
      setAlert({
        severity: "error",
        message: 'Required values cannot be empty. Please make sure there aren`t any such fields.'
      });
    } else {
      setAlert(null);
      setItem(itemObj);
      const workout_obj = _.cloneDeep(item);
      workout_obj.name = name;
      workoutStore.saveWorkout(workout_obj);
    }
  }

  return (
    <div>
      <Backdrop 
        className={classes.backdrop} 
        open={workoutStore.workout_status === NetworkStatus.Updating}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {
        alert !== null && alert !== undefined ?
        <Alert className={classes.error} severity={alert.severity}>{alert.message}</Alert>
        : null
      }
      <section className={classes.fieldWrapper}>
          <TextField
            className={classes.field}
            label="Excercise"
            variant="outlined"
            value={item.excercise}
            required
            onChange={(event) => updateItem(event.target.value, "excercise")}
          />
          {
            <span style={{opacity: 0}}> '     '</span>
          }
          <TextField
            className={classes.field}
            label="Set"
            type="number"
            variant="outlined"
            value={item.set}
            required
            onChange={(event) => updateItem(event.target.value, "set")}
          />
        </section>

        <section className={classes.fieldWrapper}>
        <TextField
            className={classes.field}
            label="Rep"
            type="number"
            variant="outlined"
            value={item.rep}
            required
            onChange={(event) => updateItem(event.target.value, "rep")}
          />
          {
            <span style={{opacity: 0}}> '     '</span>
          }
          <TextField
            className={classes.field}
            label="Tempo"
            variant="outlined"
            value={item.tempo}
            onChange={(event) => updateItem(event.target.value, "tempo")}
            required
          />
        </section>

        <section className={classes.fieldWrapper}>
          <TextField
            className={classes.field}
            label="Stretching"
            variant="outlined"
            value={item.stretching}
            required
            onChange={(event) => updateItem(event.target.value, "stretching")}
          />
          {
            <span style={{opacity: 0}}> '     '</span>
          }
          <TextField
            className={classes.field}
            label="Rest"
            variant="outlined"
            value={item.rest}
            onChange={(event) => updateItem(event.target.value, "rest")}
            required
          />
        </section>

        <div className={classes.action}>
          <Button
            variant="contained"
            className={classes.saveBtn}
            color="success"
            onClick={() => saveItem()}
          >
            Save Workout
          </Button>
        </div>
    </div>
  )
});

export default AddWorkout;