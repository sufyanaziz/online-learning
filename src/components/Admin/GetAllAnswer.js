import React, { useState, useEffect } from "react";

import axios from "../../config/axios";
import makeStyles from "@material-ui/core/styles/makeStyles";

const GetAllAnswer = (props) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [download, setDownload] = useState(false);

  const { userId, courseId, courseName, userName } = props.data;

  const downloadLsp = (userId) => {
    setDownload(true);
    axios
      .get(`/iati/upload-file/getAnswer/${userId}`)
      .then((res) => {
        const linkSource = `data:application/pdf;base64,${res.data}`;
        const downloadLink = document.createElement("a");
        const fileName = `${userId}_Answer.pdf`;
        setDownload(false);
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={classes.root}>
      <div className={classes.table}>
        <div className={classes.header}>
          {loading ? (
            <h4>Loading...</h4>
          ) : (
            <>
              <h4>{userId}</h4>
              <h4>{courseId}</h4>
              <h4>{userName}</h4>
              <h4>{courseName}</h4>
            </>
          )}
          {loading ? (
            <h5 className={classes.download}>...</h5>
          ) : download ? (
            <h5 className={classes.download}>Downloading File ....</h5>
          ) : (
            <h5
              onClick={() => downloadLsp(userId)}
              className={classes.download}
            >
              Download Answer
            </h5>
          )}
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles({
  root: {
    height: "100%",
    color: "white",
    padding: "14px 0",
    "&:nth-child(odd)": {
      background: "var(--mainColor)",
    },
    "&:nth-child(even)": {
      background: "var(--darkColor)",
    },
  },
  header: {
    display: "grid",
    gridTemplateColumns: "0.5fr 0.5fr 1fr 1fr 1fr",
    alignItems: "center",
    textAlign: "center",
    justifyItems: "center",
  },
  download: {
    background: "white",
    border: "1px solid var(--mainColor)",
    color: "var(--mainColor)",
    borderRadius: "6px",
    cursor: "pointer",
    outline: "none",
    width: "50%",
    padding: "10px",
  },
});

export default GetAllAnswer;
