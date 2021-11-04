import { useState } from "react";
import axios from 'axios';
import withDialog from "../HOC/withDialog";
import { makeStyles } from "@mui/styles";
import { Tabs, Tab, Typography, Theme } from "@mui/material";
import { a11yProps, TabPanel } from "./TabPanel";
import clsx from "clsx";
import React from "react";
import { Dashboard, Person, Schedule, Payment, ContactSupport, Settings } from "@material-ui/icons";
import Training from "./Training";
import Diet from "./Diet";
import { TrainingSchedule } from "../domain/TrainingSchedule";
import { DietSchedule } from "../domain/DietSchedule";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    overflow: 'none',

  },
  tabs: {
    overflow: 'initial'
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  tab: {
    textTransform: 'none',
    fontSize: '1.2em',
    margin: '0 10px 0 0',
  },
  labelCtr: {
    width: '100%'
  },
  label: {
    padding: '0 0 0 5%'
  },
  indicator: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white
  },
  workoutSection: {
    flexGrow: 2
  }
}));

const TabLabels = [
  {
    label: "Training Schedules",
    icon: React.createElement(Dashboard)
  },
  {
    label: "Diet Schedules",
    icon: React.createElement(Person)
  },
]

const Schedules = (props: { schedules: TrainingSchedule[], customer_id: string, dietSchedules: DietSchedule[] }) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const { schedules, dietSchedules, customer_id } = props;

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  }

  return (
    <div className={classes.root}>
      <Tabs
        orientation="horizontal"
        value={value}
        onChange={handleChange}
        aria-label="side navigation"
        variant="fullWidth"
        className=""
        classes={{ root: classes.tabs }}
        centered
      >
        {
          TabLabels.map((tab, index) => (
            <Tab
              {...a11yProps(index)}
              classes={{ root: classes.tab }}
              style={
                {
                  backgroundColor: index === value ? '#6246e4' : 'white',
                  color: index === value ? 'white' : 'black'
                }
              }
              label={
                <div
                  className={clsx(classes.flexContainer, classes.labelCtr)}
                >
                  {
                    tab.icon
                  }
                  <Typography className={classes.label} variant="body1"> {tab.label} </Typography>
                </div>
              }
            />
          ))
        }
      </Tabs>
      <TabPanel value={value} index={0}>
        {
          schedules !== undefined ?
            <Training schedules={schedules} customer_id={props.customer_id} />
            : null
        }
      </TabPanel>
      <TabPanel value={value} index={1}>
        {
          dietSchedules !== undefined ?
            <Diet
              schedules={dietSchedules}
              customer_id={props.customer_id} />
            : null
        }
      </TabPanel>
    </div>
  );
}

const EditProfile = (props: { id: any }) => {
  const classes = useStyles();
  const [schedules, setSchedules] = useState<any>();
  const [dietSchedules, setDietSchedules] = useState<any>();
  let { REACT_APP_API_HOST } = process.env;

  if(!REACT_APP_API_HOST) {
    console.log('api host not set');
    REACT_APP_API_HOST = 'https://api.mnbfitness.ca/';
  } 

  if (!schedules) {
    axios({
      method: 'get',
      url: `${REACT_APP_API_HOST}api/v1/admin/customers/training_schedules/${props.id}`,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin' : '*',
      },
      withCredentials: true,
    }).then(schedules => {
      setSchedules(schedules.data);
    })
  }

  if (!dietSchedules) {
    axios({
      method: 'get',
      url: `${REACT_APP_API_HOST}api/v1/admin/customers/diet_schedules/${props.id}`,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin' : '*',
      },
      withCredentials: true,
    }).then(schedules => {
      setDietSchedules(schedules.data);
    })
  }

  return (
    <div className={classes.root}>
      <Schedules
        schedules={schedules}
        customer_id={props.id}
        dietSchedules={dietSchedules}
      />
    </div>
  );
}

const EditProfileWithDialog = (props: {
  open: any;
  setOpen: Function;
  title: string;
  maxWidth: any;
  fullWidth: boolean;
  id: any
}) => {
  const { open, setOpen, title, maxWidth, fullWidth, id } = props;

  const EditWithDialog = withDialog(EditProfile, {
    open,
    setOpen,
    title,
    maxWidth,
    fullWidth,
  });
  return <EditWithDialog id={id} />;
};

export default EditProfile;
export { EditProfileWithDialog };