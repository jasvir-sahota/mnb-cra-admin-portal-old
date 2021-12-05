import { Backdrop, Button, CircularProgress, MenuItem, TextField, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import _ from 'lodash';
import { useStore } from "../App";
import { NetworkStatus } from "../domain/Customer";
import Alert from '@mui/lab/Alert';
import { LocalizationProvider, TimePicker } from "@mui/lab";
import moment from "moment";
import { days } from "../utility/Util";
import DateAdapter from '@mui/lab/AdapterMoment';

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

const AddDiet = observer((props: { name: any }) => {
  const { name } = props;
  const { dietStore } = useStore();

  const itemObj : any = {
    food_item: '',
    instructions: '',
    time: ''
  };

  type alertType = {
    severity: any,
    message: string
  }
  
  const [item, setItem] = useState(itemObj);
  const [alert, setAlert] = useState<alertType | null>();

  const classes = useStyles();

  useEffect(() => {
    switch (dietStore.diet_status) {
      case NetworkStatus.Updated:
        setAlert({
          severity: "success",
          message: 'Sucessufully saved the diet in the system'
        })
        break;

      case NetworkStatus.UpdateFailed:
        setAlert({
          severity: "error",
          message: 'Failed to save the diet in system'
        })
        break;

      default:
        setAlert(null);
        break;
    }
  }, [dietStore.diet_status])

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
      const diet_obj = _.cloneDeep(item);
      diet_obj.name = name;
      dietStore.saveDiet(diet_obj);
    }
  }

  return (
    <div>
      <Backdrop 
        className={classes.backdrop} 
        open={dietStore.diet_status === NetworkStatus.Updating}
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
              label="Food Item"
              variant="outlined"
              value={item.food_item}
              required
              onChange={(event) => updateItem(event.target.value, "food_item")}
            />
            {
              <span style={{ opacity: 0 }}> '     '</span>
            }
            <LocalizationProvider dateAdapter={DateAdapter}>
              <TimePicker
                label="Time of Day"
                className={classes.field}
                value={moment.unix(item.time)}
                onChange={(value) => updateItem(String(moment(value).unix()), "time")}
                renderInput={(params) => <TextField variant="standard" className={classes.field}  {...params} />}
              />
            </LocalizationProvider>

          </section>

          <section className={classes.fieldWrapper}>
            <TextField
              className={classes.fullWidth}
              label="Instructions"
              value={item.instructions}
              variant="outlined"
              onChange={(event) => updateItem(event.target.value, "instructions")}
            />
          </section>

        <div className={classes.action}>
          <Button
            variant="contained"
            className={classes.saveBtn}
            color="success"
            onClick={() => saveItem()}
          >
            Save Diet
          </Button>
        </div>
    </div>
  )
});

export default AddDiet;