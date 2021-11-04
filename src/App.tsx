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
import DietPlans from "./components/DietPlans";
import DietPlan from "./components/DietPlan";

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

const FacadeApp = observer(() => {
  const store = useStore();
  store.customerStore.fetchCustomers();
  store.workoutStore.fetchPlans();
  store.dietStore.fetchPlans();
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

const FacadeDietPlan = () => {
  const { state } = useLocation();
  const { plan } : any = state;

  return (
    <div>
      {
        plan !== null ?
        <div>
          <DietPlan plan = {plan} />
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
                <Route path="/" element={<FacadeApp />} />
                <Route path="/workout-plans" element={<WorkoutPlans />} />
                <Route path="/workout-plan" element={<FacadeWorkoutPlan />} />
                <Route path="/diet-plan" element={<FacadeDietPlan />} />
                <Route path="/add-workout-plan" element={<WorkoutPlan />} />
                <Route path="/add-diet-plan" element={<DietPlan />} />
                <Route path="/diet-plans" element={<DietPlans />} />
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
