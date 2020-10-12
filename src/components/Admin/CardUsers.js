import React from "react";
import { connect } from "react-redux";

import { deleteUser } from "../../redux/actions/action_admin";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";

const UserAdmin = (props) => {
  const classes = useStyles();
  const { userId, username, status, userRole } = props.data;
  const deleteUserAdmin = (userId) => {
    const data = {
      userRole,
      userId,
    };
    const confirmCourse = window.confirm(
      "Apakah kamu yakin menghapus user ini"
    );
    if (confirmCourse) {
      props.deleteUser(data);
    }
  };

  return (
    <div className={classes.root}>
      <div>
        <Typography variant="subtitle2">{userId}</Typography>
      </div>
      <div>
        <Typography variant="subtitle2">{username}</Typography>
      </div>
      <div>
        <Typography variant="subtitle2">{status}</Typography>
      </div>
      <div onClick={() => deleteUserAdmin(userId)}>
        <Typography variant="subtitle2">Delete</Typography>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  admin: state.admin,
});

const useStyles = makeStyles({
  root: {
    display: "grid",
    gridTemplateColumns: "0.5fr 1fr 0.5fr 0.5fr",
    textAlign: "center",
    padding: "10px 0",
    borderBottom: "1px solid gray",
    "&:nth-child(odd)": {
      background: "white",
      color: "var(--mainColor)",
    },
    "&:nth-child(even)": {
      background: "gray",
      color: "white",
    },
    "& div:nth-child(4)": {
      "&:hover": {
        color: "red",
        cursor: "pointer",
      },
    },
  },
});

export default connect(mapStateToProps, { deleteUser })(UserAdmin);
