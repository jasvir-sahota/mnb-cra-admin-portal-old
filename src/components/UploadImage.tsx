import { Alert, Backdrop, Button, CircularProgress, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import _ from 'lodash';
import { NetworkStatus } from '../domain/Customer';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    textAlign: 'center'
  },
  dropzone: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: "2px",
    borderRadius: "2px",
    borderColor: "#eeeeee",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out"
  },
  thumbsContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
    padding: 20
  },
  thumb: {
    position: "relative",
    display: "inline-flex",
    borderRadius: 2,
    border: "1px solid #eaeaea",
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: "border-box"
  },
  thumbInner: {
    display: "flex",
    minWidth: 0,
    overflow: "hidden"
  },
  img: {
    display: "block",
    width: "auto",
    height: "100%"
  },
  thumbButton: {
    position: "absolute",
    right: 10,
    bottom: 10,
    background: "rgba(0,0,0,.8)",
    color: "#fff",
    border: 0,
    borderRadius: ".325em",
    cursor: "pointer"
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  alert: {
    margin: "0 0 2% 0",
  },
}));

type alertType = {
  severity: any;
  message: string;
};

const UploadImage = (props: {
  upload: Function,
  upload_status: NetworkStatus,
  multiple?: boolean
}) => {
  const classes = useStyles();
  const { multiple, upload, upload_status } = props;
  const [alert, setAlert] = useState<alertType | null>();

  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    switch (upload_status) {
      case NetworkStatus.Updated:
        setAlert({
          severity: "success",
          message: "Sucessufully uploaded the image to the system",
        });
        break;

      case NetworkStatus.UpdateFailed:
        setAlert({
          severity: "error",
          message: "Failed to upload the image",
        });
        break;

      default:
        setAlert(null);
        break;
    }
  }, [upload_status]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    multiple,
    onDrop: (acceptedFiles) => {
      let files_local: any = [];

      if (multiple) {
        files_local = [...files];
      }
      files_local.push(...acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      ));

      setFiles(files_local);
    }
  });

  const thumbs = files.map((file, index) => (
    <div className={classes.thumb} key={file.name}>
      <div className={classes.thumbInner}>
        <img src={file.preview} className={classes.img} alt="" />
      </div>
      <button
        className={classes.thumbButton}
        onClick={() => {
          setFiles([]);
        }}
      >
        Remove
      </button>
    </div>
  ));

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <section className={classes.container}>
      <Backdrop 
        className={classes.backdrop} 
        open={upload_status ===  NetworkStatus.Updating}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {alert !== null && alert !== undefined ? (
          <Alert className={classes.alert} severity={alert.severity}>
            {alert.message}
          </Alert>
        ) : null}
      <div {...getRootProps({ className: classes.dropzone })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside className={classes.thumbsContainer}>{thumbs}</aside>
      <Button 
        variant="contained"
        color="success"
        disabled={files.length === 0}
        onClick={() => upload(files)}
      >
        Upload Image
      </Button>
    </section>
  );
};

export default UploadImage;