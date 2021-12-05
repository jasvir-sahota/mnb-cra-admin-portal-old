import { ArrowBackIos } from "@mui/icons-material";
import { Alert, Button, Chip, Stack, TextField, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../App";
import { NetworkStatus } from "../domain/Customer";
import Header from "./Header";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: "2%",
  },
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
  saveBtn: {
    margin: "0 5% 0 0 ",
    width: "200px",
  },
  action: {
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
  },
  error: {
    margin: "0 0 2% 0",
  },
}));

type alertType = {
  severity: any;
  message: string;
};

const AddExercise = observer(() => {
  const { workoutStore } = useStore();
  const classes = useStyles();

  const [exercise, setExercise] = useState<string | undefined>();
  const [alert, setAlert] = useState<alertType | null>();

  useEffect(() => {
    switch (workoutStore.workout_status) {
      case NetworkStatus.Updated:
        setAlert({
          severity: "success",
          message: "Sucessufully saved the exercise in the system",
        });
        break;

      case NetworkStatus.UpdateFailed:
        setAlert({
          severity: "error",
          message: "Failed to save the exercise in system",
        });
        break;

      default:
        setAlert(null);
        break;
    }
  }, [workoutStore.workout_status]);

  const saveExercise = () => {
    workoutStore.saveWorkout({
      excercise: exercise
    });
  };
  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <div className={classes.container}>
        <Stack style={{ margin: '0 0 2% 0' }} direction="row" spacing={1} onClick={() => navigate('/exercises/')}>
          <Chip icon={<ArrowBackIos />} label="Back to Exercises" />
        </Stack>
        {alert !== null && alert !== undefined ? (
          <Alert className={classes.error} severity={alert.severity}>
            {alert.message}
          </Alert>
        ) : null}
        <section className={classes.fieldWrapper}>
          <TextField
            className={classes.fullWidth}
            label="Exercise Name"
            variant="filled"
            required
            value={exercise}
            onChange={(event: any) => setExercise(event.target.value)}
          />
        </section>
        <div className={classes.action}>
          <Button
            variant="contained"
            className={classes.saveBtn}
            color="success"
            onClick={() => saveExercise()}
          >
            Save Exercise
          </Button>
        </div>
      </div>
    </div>
  );
});

export default AddExercise;
