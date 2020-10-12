import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { connect } from "react-redux";
import { login } from "../redux/actions/action_user";
import store from "../redux/store";
import { CLEAR_ERRORS, UNSET_FLASH_MESSAGE } from "../redux/types";

import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import FormStart from "../components/FormStart/FormStart";

const Login = (props) => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const { loading, flash } = props.ui;
  const { status } = props.user.credentials;

  useEffect(() => {
    document.title = "Login";
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const dataLogin = {
      email,
      password,
      role,
    };
    if (role === "") {
      if (email === "admin") {
        props.login(dataLogin, props.history);
      } else {
        alert("Silahkan pilih role terlebih dahulu");
      }
    } else {
      props.login(dataLogin, props.history);
    }
  };

  let error = {};
  const emailOnChange = (e) => {
    setEmail(e.target.value);

    if (Object.keys(error).length !== 0) {
      props.ui.error.email = "";
    }
  };
  const passwordOnChange = (e) => {
    setPassword(e.target.value);
    if (Object.keys(error).length !== 0) {
      props.ui.error.password = "";
    }
  };

  if (props.ui.error !== "") {
    error = { ...props.ui.error };
  }

  const onChangeRole = (e) => {
    setRole(e.target.value);
  };

  return (
    <>
      <FormStart>
        <div className={classes.header}>
          {status === "NOTVERIFIED" && (
            <Alert style={{ marginBottom: "1rem" }} severity="warning">
              Your email has not been verified,
              <Link to="/verify" className={classes.span}>
                click here to verify your email!
              </Link>
            </Alert>
          )}
          <h1>Login</h1>
          {flash && props.ui.status === "register" && (
            <div style={{ marginTop: "14px" }}>
              <Alert
                severity="success"
                onClose={() => store.dispatch({ type: UNSET_FLASH_MESSAGE })}
                variant="outlined"
              >{`${flash}`}</Alert>
            </div>
          )}
        </div>
        <form onSubmit={onSubmit}>
          <TextField
            id="outlined-basic-email"
            label="Email"
            variant="outlined"
            className={classes.email}
            onChange={(e) => emailOnChange(e)}
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
            onChange={(e) => passwordOnChange(e)}
            value={password}
            error={error.password ? true : false}
            helperText={error.password}
          />
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
          >
            <Typography variant="subtitle1" style={{ marginRight: "10px" }}>
              Login as
            </Typography>
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
                labelPlacement="end"
              />
              <FormControlLabel
                value="Lecturer"
                control={<Radio color="primary" />}
                label="Lecturer"
                labelPlacement="end"
              />
            </RadioGroup>
          </div>
          {error.global && (
            <div
              style={{ color: "red", marginTop: "10px", textAlign: "center" }}
            >
              <small>{error.global}</small>
            </div>
          )}
          {loading ? (
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <CircularProgress style={{ color: "var(--mainColor)" }} />
            </div>
          ) : (
            <input type="submit" className={classes.submit} value="Login" />
          )}
        </form>
        <p>
          You don't have an account?{" "}
          <Link
            to="/register"
            className={classes.Link}
            onClick={() => store.dispatch({ type: CLEAR_ERRORS })}
          >
            Regis Here
          </Link>
        </p>
      </FormStart>
    </>
  );
};

const useStyles = makeStyles({
  header: {
    width: "100%",
    color: "var(--mainColor)",
  },
  email: {
    width: "100%",
    margin: "1.2rem 0",
  },
  password: {
    width: "100%",
  },
  submit: {
    margin: "1rem 0 5px 0",
    background: "var(--mainColor)",
    border: "1px solid var(--mainColor)",
    padding: "6px 10px",
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
  Link: {
    color: "var(--mainColor)",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  span: {
    color: "inherit",
  },
});

const mapStateToProps = (state) => ({
  user: state.user,
  ui: state.ui,
});

const mapActionToProps = {
  login,
};

export default connect(mapStateToProps, mapActionToProps)(Login);
