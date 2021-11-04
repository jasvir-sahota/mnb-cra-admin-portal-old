import { ThemeProvider, Theme, Breadcrumbs, Typography } from "@mui/material";
import theme from "./theme";
import React, { createContext } from "react";
import { RootStore } from "./store/RootStore";
import { observer } from "mobx-react-lite";
import { BrowserRouter as Router, Route, useLocation, Routes } from "react-router-dom";
import CustomersView from "./components/Customers";
import Header from "./components/Header";
import { ActiveComponent } from "./domain/App";
import WorkoutPlans from "./components/WorkoutPlans";
import WorkoutPlan from "./components/WorkoutPlan";
import { makeStyles } from "@mui/styles";

const StoreContext = createContext<RootStore | null>(null);
const rootStore = new RootStore();

const StoreProvider = ({ children }: { children: React.ReactElement }) => {
  return (
    <StoreContext.Provider value={rootStore}>{children} </StoreContext.Provider>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  sideNav: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  }, 
  hzNav: {
    display: "none",
    [theme.breakpoints.down("xs")]: {
      display: "block",
    },
  },
  header: {
    [theme.breakpoints.down("xs")]: {
      display: "block",
    },
  },
}));

const useStore = () => {
  const store = React.useContext(StoreContext);

  if (!store) {
    throw new Error("useStore must be used within a store provider");
  }

  return store;
};

const ComponentRendrer = observer(() => {
  const store = useStore();
  const component = store.appStore.active_component;

  switch (component) {
    case ActiveComponent.Dashboard:
      return <WorkoutPlan plan={{name: 'Lada Plan', notes: ["1", "2"], items: [{
        "workout_id": "1",
        "day": "Monday",
          "name": "Chest Workout",
          "excercise": "Chest",
          "stretching": "none",
          "set": "1",
          "rep": "1",
          "tempo": "1",
          "rest": "60 sec",
          "instructions": "",
          "notes": "note"
      },]}}/>
  
    case ActiveComponent.WorkoutPlans:
      return <WorkoutPlans />

    default:
      return <FacadeApp />
  }

});

const FacadeApp = observer(() => {
  const store = useStore();
  store.customerStore.fetchCustomers();
  store.workoutStore.fetchPlans();
  console.log('called fetchcustomers')
  return (
    <div>
      <Header />
      <CustomersView />
    </div>
  )
});

const FacadeWorkoutPlan = () => {
  const { state } = useLocation();
  const { plan } : any = state;

  return (
    <div>
      {
        plan !== null ?
        <div>
          <WorkoutPlan plan = {plan} />
        </div>
        : null
      }
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <div>
        <StoreProvider>
          <ThemeProvider theme={theme}>
            <Router>
              <Routes>
                <Route path="/" element={<ComponentRendrer />} />
                <Route path="/workout-plan" element={<FacadeWorkoutPlan />} />
                <Route path="/add-workout-plan" element={<WorkoutPlan />} />
              </Routes>
            </Router>
          </ThemeProvider>
        </StoreProvider>
      </div>
    </div>
  );
}

export default App;
export { useStore };
