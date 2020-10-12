import React, { useState } from "react";
import { connect } from "react-redux";
import { register } from "../../redux/actions/action_user";
import { clearError } from "../../redux/actions/action_ui";

import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";

const UserAdmin = (props) => {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  let error = {};
  const { loading } = props.ui;

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
    if (Object.keys(error).length !== 0) {
      props.ui.error.fullName = "";
    }
  };
  const onChangeEmail = (e) => {
    setEmail(e.target.value);
    if (Object.keys(error).length !== 0) {
      props.ui.error.email = "";
    }
  };
  const onChangePassword = (e) => {
    setPassword(e.target.value);
    if (Object.keys(error).length !== 0) {
      props.ui.error.password = "";
    }
  };
  const onChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    if (Object.keys(error).length !== 0) {
      props.ui.error.confirmPassword = "";
    }
  };
  const onChangeRole = (e) => {
    setRole(e.target.value);
  };

  if (props.ui.error !== "") {
    error = { ...props.ui.error };
  }

  const onSubmit = (e) => {
    e.preventDefault();

    if (role === "") {
      alert("Harap pilih user role terlebih dahulu");
    } else {
      const dataRegister = {
        username,
        email,
        password,
        confirmPassword,
        role,
        close: () => props.close(),
      };
      props.register(dataRegister);
    }
  };

  const onClose = () => {
    props.close();
    props.clearError();
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h5">Add New Users</Typography>
        <div onClick={onClose}>
          <Typography variant="h6">X</Typography>
        </div>
      </div>
      <form onSubmit={onSubmit}>
        <TextField
          id="outlined-basic-fullName"
          label="Full Name"
          variant="outlined"
          className={classes.fullName}
          onChange={(e) => onChangeUsername(e)}
          value={username}
          error={error.fullName ? true : false}
          helperText={error.fullName}
        />
        <TextField
          id="outlined-basic-email"
          label="Email"
          variant="outlined"
          type="text"
          className={classes.email}
          onChange={(e) => onChangeEmail(e)}
          value={email}
          error={error.email ? true : false}
          helperText={error.email}
        />
        <TextField
          id="outlined-basic-password"
          label="Password"
          variant="outlined"
          type="password"
          className={classes.password}
          onChange={(e) => onChangePassword(e)}
          value={password}
          error={error.password ? true : false}
          helperText={error.password}
        />
        <TextField
          id="outlined-basic-confirmPassword"
          label="Confirm Password"
          variant="outlined"
          type="password"
          className={classes.confirmPassword}
          onChange={(e) => onChangeConfirmPassword(e)}
          value={confirmPassword}
          error={error.confirmPassword ? true : false}
          helperText={error.confirmPassword}
        />
        <FormLabel component="legend" style={{ margin: "10px 0" }}>
          User Role
        </FormLabel>
        <RadioGroup
          onChange={onChangeRole}
          row
          aria-label="position"
          name="position"
        >
          <FormControlLabel
            value="Student"
            control={<Radio color="primary" />}
            label="Student"
            labelPlacement="top"
          />
          <FormControlLabel
            value="Lecturer"
            control={<Radio color="primary" />}
            label="Lecturer"
            labelPlacement="top"
          />
        </RadioGroup>

        {error.global && (
          <div style={{ color: "red", marginTop: "10px", textAlign: "center" }}>
            <small>{error.global}</small>
          </div>
        )}
        {loading ? (
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <CircularProgress style={{ color: "var(--mainColor)" }} />
          </div>
        ) : (
          <input type="submit" className={classes.submit} value="Registrasi" />
        )}
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  admin: state.admin,
  ui: state.ui,
});

const useStyles = makeStyles({
  root: {
    padding: "1rem",
  },
  header: {
    display: "flex",
    alignItems: "center",
    "& h5": {
      marginRight: "auto",
    },
    "& h6": {
      cursor: "pointer",
    },
  },
  fullName: {
    width: "100%",
    margin: "14px 0",
  },
  email: {
    width: "100%",
    marginBottom: "14px",
  },
  password: {
    width: "100%",
    marginBottom: "14px",
  },
  confirmPassword: {
    width: "100%",
    marginBottom: "14px",
  },
  submit: {
    margin: "1rem 0 5px 0",
    background: "var(--mainColor)",
    border: "1px solid var(--mainColor)",
    padding: "12px 10px",
    width: "100%",
    borderRadius: "4px",
    color: "white",
    cursor: "pointer",
    outline: "none",
    "&:hover": {
      background: "var(--darkColor)",
      border: "1px solid var(--darkColor)",
    },
  },
});

export default connect(mapStateToProps, { register, clearError })(UserAdmin);
