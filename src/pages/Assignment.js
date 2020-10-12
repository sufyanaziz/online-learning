import React, { useState, useEffect } from "react";

import { connect } from "react-redux";
import { clearMessage } from "../redux/actions/action_ui";
import axios from "../config/axios";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Alert from "@material-ui/lab/Alert";
import AssginmetComponent from "../components/Assignment/Assignment";

const Assignment = (props) => {
  const [quizStudent, setQuizStudent] = useState([]);
  const [quizLecturer, setQuizLecturer] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id, role } = props.user.credentials;

  useEffect(() => {
    document.title = "Assignment";
    setLoading(true);
    if (role === "Lecturer") {
      axios
        .get(`/iati/upload-file/getAllAssignment/answer`)
        .then((res) => {
          setLoading(false);
          setQuizLecturer(res.data);
        })
        .catch((err) => {
          setLoading(false);
        });
    } else if (role === "Student") {
      axios
        .get(`/iati/material/info/quiz/${id}`)
        .then((res) => {
          setLoading(false);
          setQuizStudent(res.data);
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  }, []);

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <h1>Assignment</h1>
      </div>

      {props.ui.flash && props.ui.status === "assignment" && (
        <div style={{ margin: "14px 0", width: "100%" }}>
          <Alert
            severity="success"
            onClose={() => props.clearMessage()}
            variant="filled"
          >{`${props.ui.flash}`}</Alert>
        </div>
      )}

      {/* Idividual Assignment */}
      <div className={classes.assignment}>
        {role === "Student" ? (
          <div className={classes.header}>
            <h4>Individual Assignment</h4>
          </div>
        ) : (
          <div className={classes.header}>
            <h4>Submitted Assignment</h4>
          </div>
        )}
        <div className={classes.assignmentTable}>
          {role === "Student" ? (
            <div className={classes.assignmentHeaderTable}>
              <div>
                <h4>Course Id</h4>
              </div>
              <div>
                <h4>Title</h4>
              </div>
              <div>
                <h4>Action</h4>
              </div>
            </div>
          ) : (
            <div className={classes.assignmentHeaderTableLecturer}>
              <div>
                <h4>User Id</h4>
              </div>
              <div>
                <h4>Course Id</h4>
              </div>
              <div>
                <h4>Name</h4>
              </div>
              <div>
                <h4>Course Name</h4>
              </div>
              <div>
                <h4>Material Name</h4>
              </div>
              <div>
                <h4>Action</h4>
              </div>
            </div>
          )}

          {loading ? (
            <p>Loading</p>
          ) : role === "Student" ? (
            quizStudent.length === 0 ? (
              <p style={{ padding: "0 0 20px 0", textAlign: "center" }}>
                No Individual assignment have been uploaded yet
              </p>
            ) : (
              quizStudent.map((quiz, index) => {
                return <AssginmetComponent key={index} data={quiz} student />;
              })
            )
          ) : quizLecturer.length === 0 ? (
            <p style={{ padding: "0 0 20px 0", textAlign: "center" }}>
              No Student assignment have been uploaded yet
            </p>
          ) : (
            quizLecturer.map((quiz, index) => {
              return <AssginmetComponent key={index} data={quiz} />;
            })
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  ui: state.ui,
});

const useStyles = makeStyles({
  root: {
    marginTop: "10px",
    minHeight: "350px",
    textAlign: "justify",
    padding: "0 7rem",
    marginBottom: "2rem",
  },
  header: {
    marginBottom: "10px",
  },
  assignment: {
    padding: "1.2em",
  },
  assignmentTable: {
    boxShadow: "0 0 2px gray",
  },
  assignmentHeaderTable: {
    marginTop: "1em",
    display: "grid",
    gridTemplateColumns: "1fr 2fr 1fr",
    padding: "1em 0",
    background: "rgb(235,235,235)",
    justifyItems: "center",
    fontWeight: "bold",
  },
  assignmentHeaderTableLecturer: {
    marginTop: "1em",
    display: "grid",
    gridTemplateColumns: "0.5fr 0.5fr 1fr 1fr 1fr 1fr",
    padding: "1em 0",
    background: "rgb(235,235,235)",
    justifyItems: "center",
    fontWeight: "bold",
  },
});

export default connect(mapStateToProps, { clearMessage })(Assignment);
