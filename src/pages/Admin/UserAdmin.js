import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  viewAllStudent,
  viewAllLecturer,
} from "../../redux/actions/action_admin";
import CardUsers from "../../components/Admin/CardUsers";
import RegisterUser from "../../components/Admin/RegisterUser";

import Dialog from "@material-ui/core/Dialog";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

const UserAdmin = (props) => {
  const classes = useStyles();

  const { loading_student, loading_lectur, students, lecturers } = props.admin;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    props.viewAllStudent();
    document.title = "User";
  }, []);

  useEffect(() => {
    props.viewAllLecturer();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  let dialogAddUser = (
    <Dialog open={open}>
      <RegisterUser close={handleClose} />
    </Dialog>
  );

  return (
    <div className={classes.root}>
      {dialogAddUser}
      <div className={classes.header}>
        <Typography variant="h4">All Users</Typography>
      </div>
      <button className={classes.button} onClick={handleOpen}>
        Add New User
      </button>
      <div className={classes.allUser}>
        <div className={classes.student}>
          <Paper className={classes.cardHeader}>
            <Typography variant="h6">STUDENT</Typography>
            <Typography variant="h6">{students.length}</Typography>
          </Paper>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "0.5fr 1fr 0.5fr 0.5fr",
              textAlign: "center",
              padding: "10px 0",
              background: "var(--mainColor)",
              color: "white",
              borderRadius: "6px 6px 0 0",
            }}
          >
            <Typography variant="subtitle1">User Id</Typography>
            <Typography variant="subtitle1">Username</Typography>
            <Typography variant="subtitle1">Status</Typography>
            <Typography variant="subtitle1">Action</Typography>
          </div>
          <div style={{ maxHeight: "300px", overflow: "auto" }}>
            {loading_student ? (
              <Typography variant="subtitle1">Loading...</Typography>
            ) : students.length === 0 ? (
              <Typography variant="subtitle1">Tidak ada student</Typography>
            ) : (
              students.map((student, index) => {
                return <CardUsers key={index} data={student} />;
              })
            )}
          </div>
        </div>
        <div className={classes.lecturer}>
          <Paper className={classes.cardHeader}>
            <Typography variant="h6">LECTURER</Typography>
            <Typography variant="h6">{lecturers.length}</Typography>
          </Paper>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "0.5fr 1fr 0.5fr 0.5fr",
              textAlign: "center",
              padding: "10px 0",
              background: "var(--mainColor)",
              color: "white",
              borderRadius: "6px 6px 0 0",
            }}
          >
            <Typography variant="subtitle1">User Id</Typography>
            <Typography variant="subtitle1">Username</Typography>
            <Typography variant="subtitle1">Status</Typography>
            <Typography variant="subtitle1">Action</Typography>
          </div>
          <div style={{ maxHeight: "300px", overflow: "auto" }}>
            <Paper>
              {loading_lectur ? (
                <Typography variant="subtitle1">Loading...</Typography>
              ) : lecturers.length === 0 ? (
                <Typography variant="subtitle1">Tidak ada lecturer</Typography>
              ) : (
                lecturers.map((lecturer, index) => {
                  return <CardUsers key={index} data={lecturer} />;
                })
              )}
            </Paper>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  admin: state.admin,
});

const useStyles = makeStyles({
  root: {
    padding: "0 7rem",
    marginBottom: "1rem",
  },
  header: {
    color: "var(--mainColor)",
    marginBottom: "10px",
  },
  allUser: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gridColumnGap: "20px",
  },
  student: {},
  lecturer: {},
  cardHeader: {
    textAlign: "center",
    padding: "10px 0",
    marginBottom: "10px",
  },
  button: {
    background: "white",
    border: "1px solid var(--mainColor)",
    padding: "10px 20px",
    borderRadius: "4px",
    color: "var(--mainColor)",
    cursor: "pointer",
    outline: "none",
    marginBottom: "10px",
    "&:hover": {
      background: "var(--mainColor)",
      border: "1px solid var(--mainColor)",
      color: "white",
    },
  },
});

export default connect(mapStateToProps, { viewAllStudent, viewAllLecturer })(
  UserAdmin
);
