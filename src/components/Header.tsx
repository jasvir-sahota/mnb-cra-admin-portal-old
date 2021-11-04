import { observer } from "mobx-react-lite";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { List, ListItem, ListItemIcon, ListItemText, Drawer, Theme } from '@mui/material'
import { Settings, ContactSupport, Home } from '@mui/icons-material'
import { useStore } from "../App";
import { makeStyles } from "@mui/styles";
import { ActiveComponent } from "../domain/App";
import { useState } from "react";
import { Person } from "@material-ui/icons";
import { useNavigate } from "react-router";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: 0
  },
  listItem: {
    width: "initial",
    padding: "0"
  },
  listItemGutters: {
    paddingTop: "0",
    paddingBottom: "0",
    paddingLeft: "10px",
    paddingRight: "10px",
  },
  listItemRoot: {
    minWidth: '30px',
  },
  listItemTextRoot: {
    minWidth: '60px'
  },
}))

const NavList = observer(() => {
  const store = useStore();
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <Box
      sx={{ width: 250 }}
    >
    <List>
      <span onClick={() => {
        store.appStore.active_component = ActiveComponent.Customer;
        navigate('/');
      }}>
        <ListItem button key={"home"}>
            <ListItemIcon classes = { { root: classes.listItemRoot}}>
              <Home />
            </ListItemIcon>
            <ListItemText  primary={"Home"}  classes = { { root: classes.listItemTextRoot}}/>
        </ListItem>
      </span>
      <span onClick={() => {
        store.appStore.active_component = ActiveComponent.Customer;
        navigate('/');
      }}>
        <ListItem button key={"customer-view"}>
            <ListItemIcon classes = { { root: classes.listItemRoot}}>
              <Person />
            </ListItemIcon>
            <ListItemText primary={"Customers"} classes = { { root: classes.listItemTextRoot}}/>
        </ListItem>
      </span>
      <span onClick={() => {
        store.appStore.active_component = ActiveComponent.Customer;
        navigate('/workout-plans');
      }}>
        <ListItem button key={"workout-plans"}>
            <ListItemIcon classes = { { root: classes.listItemRoot}}>
              <Settings />
            </ListItemIcon>
            <ListItemText primary={"Workout Plans"} classes = { { root: classes.listItemTextRoot}}/>
        </ListItem>
      </span>
      <span onClick={() => {
        store.appStore.active_component = ActiveComponent.Customer
        navigate('/diet-plans')
      }}>
      <ListItem button key={"diet-plans"}>
          <ListItemIcon classes = { { root: classes.listItemRoot}}>
            <ContactSupport />
          </ListItemIcon>
          <ListItemText primary={"Diet Plans"} classes = { { root: classes.listItemTextRoot}}/>
      </ListItem>
      </span>
    </List>
  </Box>
  )
});

const Header = observer(() => {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon 
              onClick={() => setOpen(true)}
            />
            <Drawer
              open={open}
              anchor="left"
              onClose={() => setOpen(!open)}
            >
              <NavList />
            </Drawer>
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Portal
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
})

export default Header;