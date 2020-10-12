import React, { useState } from "react";

import axios from "../../config/axios";
import { connect } from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";

const ScoringComponent = (props) => {
  const classes = useStyles();
  const {
    userId,
    courseId,
    courseName,
    courseID,
    score,
    userName,
  } = props.score;

  const [loading, setLoading] = useState(false);
  const [download, setDownload] = useState(false);
  const [nilai, setNilai] = useState(false);
  const isInt = (value) => {
    let er = /^-?[0-9]+$/;
    return er.test(value);
  };
  const giveScore = () => {
    const score = window.prompt("Masukan nilai yang diinginkan");

    if (!isInt(score) && score !== null) {
      alert("Harus angka");
    } else if (score < 0 && score !== null) {
      alert("Score tidak boleh negatif");
    } else if (score >= 0 && score <= 100 && score !== null) {
      const data = {
        userId,
        courseID: courseId,
        score,
      };
      setLoading(true);
      axios
        .post(`/iati/score/v1/submit`, data)
        .then(() => {
          setLoading(false);
          alert("Course berhasil di nilai");
        })
        .catch((err) => {
          alert("Something went wrong!");
        });
    } else if (score > 100 && score !== null) {
      alert("Score maksimal 100");
    }
  };

  const handleDownload = () => {
    setDownload(true);
    setNilai(false);
    axios
      .get(`/iati/upload-file/getAnswer/${userId}?courseId=${courseId}`)
      .then((res) => {
        if (res.data === "") {
          setDownload(false);
          setNilai(false);
          alert("User belum memasukan jawaban");
        } else {
          setDownload(false);
          setNilai(true);
          const linkSource = `data:application/pdf;base64,${res.data}`;
          const downloadLink = document.createElement("a");
          const fileName = `Jawaban_${userId}_${courseId}.pdf`;
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        }
      })
      .catch((err) => {
        setDownload(false);
      });
  };

  return (
    <React.Fragment>
      {props.lecturer ? (
        <div className={classes.root}>
          <h4>{userId}</h4>
          <h4>{courseId}</h4>
          <h4>{userName}</h4>
          <h4>{courseName}</h4>
          <div className={classes.action}>
            {download ? (
              <h5 onClick={() => alert("Still downloading")}>Downloading...</h5>
            ) : (
              <h5 onClick={handleDownload}>Download Jawaban</h5>
            )}

            {!nilai ? null : (
              <h5 onClick={giveScore}>
                {loading ? "Submiting..." : "Submit Nilai"}
              </h5>
            )}
          </div>
        </div>
      ) : (
        <div className={classes.rootStudent}>
          <h4>{userId}</h4>
          <h4>{courseID}</h4>
          <h4>{courseName}</h4>
          <h4>{score === null ? "N/A" : score}</h4>
        </div>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const useStyles = makeStyles({
  root: {
    display: "grid",
    gridTemplateColumns: "0.5fr 0.5fr 1fr 1fr 1fr",
    padding: "14px 0",
    borderBottom: "2px solid rgb(210,210,210)",
    background: "white",
  },
  rootStudent: {
    display: "grid",
    gridTemplateColumns: "0.5fr 0.5fr 1fr 1fr",
    padding: "14px 0",
    borderBottom: "2px solid rgb(210,210,210)",
    background: "white",
  },
  action: {
    display: "flex",
    color: "var(--mainColor)",
    width: "100%",
    justifyContent: "center",
    "& h5": {
      margin: "0 4px",
      cursor: "pointer",
      borderRadius: "4px",
      padding: "6px",
    },
    "& h5:nth-child(1)": {
      background: "var(--mainColor)",
      color: "white",
      border: "1px solid var(--mainColor)",
    },
    "& h5:nth-child(2)": {
      background: "white",
      color: "var(--mainColor)",
      border: "1px solid var(--mainColor)",
    },
  },
});

export default connect(mapStateToProps)(ScoringComponent);
