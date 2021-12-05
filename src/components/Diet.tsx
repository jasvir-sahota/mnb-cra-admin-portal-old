import { makeStyles } from "@mui/styles";
import {
  Typography,
  MenuItem,
  Theme,
  Select,
  FormControl,
} from "@mui/material";
import { useState } from 'react';
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import moment from "moment";
import clsx from "clsx";
import DietScheduleForm from "./DietScheduleForm";
import { DietSchedule } from "../domain/DietSchedule";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    padding: "1px",
  },
  container: {
  },
  flex: {
    display: "flex",
    flexFlow: "wrap",
    [theme.breakpoints.down("xs")]: {
      justifyContent: "center",
    },
  },
  tab: {
    textTransform: "none",
    fontSize: "0.8em",
    borderRadius: "15px",
    margin: "0 10px 0 0",
  },
  selectLabel: {
    display: "flex",
    width: "95%",
  },
  formControl: {
    width: "100%",
    margin: "0 0 3% 0",
  },
  scheduleTime: {
    flexGrow: 1,
  },
  excercise: {
    margin: "0 5% 5% 0",
    minWidth: "350px",
  },
  activeStatus: {},
}));

const getSchedule = (id: string, schedules: DietSchedule[]) => {
  return schedules.find((schedule) => schedule.id === id);
};

const getActiveSchedule = (schedules: DietSchedule[]) => {
  return schedules.find((schedule) => schedule.is_active === true);
};

const renderScheduleLabel = (start_date: any, end_date: any) => {
  return (
    <span>
      {moment.unix(Number(start_date)).format("MMMM Do YYYY")} - {" "}
      {moment.unix(Number(end_date)).format("MMMM Do YYYY")}
    </span>
  )
}

const Diet = (props: { schedules: DietSchedule[], customer_id: string }) => {
  const classes = useStyles();
  const { schedules } = props;

  const activeSchedule = getActiveSchedule(schedules);
  const new_sch = schedules.find(schedule => schedule.id === 'new_sch');

  if(!new_sch) {
    schedules.unshift({
      id: 'new_sch',
      start_date: 'a',
      end_date: 'a',
      is_active: false,
      items: [],
      notes: []
    })
  }

  const [schedule, setSchedule] = useState(activeSchedule || schedules[0]);

  return (
    <div className={classes.container}>
      <FormControl variant="outlined" className={classes.formControl}>
        <Select
          value={schedule.id}
          onChange={(event) => {
            const schedule = getSchedule(
              event.target.value as string,
              schedules
            );
            if (schedule !== undefined) {
              setSchedule(schedule);
            }
          }}
        >
          {schedules.map((schedule) => (
            <MenuItem value={schedule.id}>
              {
                <div className={classes.selectLabel}>
                  <Typography
                    className={classes.scheduleTime}
                    variant={"body2"}
                  >
                    {
                      schedule.id === 'new_sch' ?
                        "Add new Schedule" :
                      renderScheduleLabel(schedule.start_date, schedule.end_date)
                    }
                  </Typography>
                  {schedule.is_active ? (
                    <span className={clsx(classes.flex, classes.activeStatus)}>
                      <FiberManualRecordIcon
                        style={{ color: "green", fontSize: "1.2em" }}
                      />
                      <Typography variant="body2">Active</Typography>
                    </span>
                  ) : null}
                </div>
              }
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {
         <DietScheduleForm schedule={schedule} customer_id={props.customer_id}/>
      }
    </div>
  );
}

export default Diet;