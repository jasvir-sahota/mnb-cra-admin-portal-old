import React from 'react';
import { Dialog } from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.common.black,
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6" color="primary">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const useStyles = makeStyles((theme) => ({
  dialog: {
    textAlign: 'center'
  },
  link: {
    color: theme.palette.secondary.dark,
    '&:hover': {
      color: theme.palette.secondary.main,
      'text-decoration': 'none',
      cursor: 'pointer'
    },
    paddingRight: '5px'
  }
}));

const withDialog = (
  Component, 
  {
   open,
   setOpen,
   title,
   fullWidth,
   maxWidth
  }
  ) => ({ ...props }) => {
  const classes = useStyles();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
      className={classes.dialog}
      maxWidth={maxWidth ? maxWidth : 'lg'}
      fullWidth={fullWidth}
    >
      <DialogTitle id="responsive-dialog-title" onClose={handleClose}>
        <Typography variant="subtitle1" color="primary">
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Component {...props} />
      </DialogContent>
    </Dialog>
  );
};

export default withDialog;