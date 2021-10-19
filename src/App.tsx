import { ThemeProvider, makeStyles, Theme } from "@material-ui/core";
import theme from "./theme";
import React, { createContext } from "react";
import { RootStore } from "./store/RootStore";
import { observer } from "mobx-react-lite";
import { BrowserRouter, Route } from "react-router-dom";
import CustomersView, { Customers } from "./components/Customers";

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
  const classes = useStyles();
  const store = useStore();
  store.customerStore.fetchCustomers();
  console.log('called fetchcustomers')
  return (
    <div>
      <CustomersView />
    </div>
  )
});

function App() {
  return (
    <div className="App">
      <div>
        <StoreProvider>
          <ThemeProvider theme={theme}>
            <BrowserRouter>
              <Route exact path="/" component={FacadeApp} />
            </BrowserRouter>
          </ThemeProvider>
        </StoreProvider>
      </div>
    </div>
  );
}

export default App;
export { useStore };
