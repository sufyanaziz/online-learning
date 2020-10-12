import React, { useState, useEffect } from "react";
import Counting from "../components/Counting/Counting";
import Courses from "../components/AllCourse/Courses";
import Article from "../components/Article/Article";
import EditProfile from "../components/EditProfile/EditProfile";
import Tooltip from "@material-ui/core/Tooltip";

import makeStyles from "@material-ui/core/styles/makeStyles";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import { Link } from "react-router-dom";

import { connect } from "react-redux";
import { getMyCourse } from "../redux/actions/action_data";
import { getCourseAdmin } from "../redux/actions/action_admin";
import { getImageUser, uploadImage } from "../redux/actions/action_user";
import EditIcon from "@material-ui/icons/Edit";

import { Typography } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";

const Home = (props) => {
  const classes = useStyles();
  let token;
  let userId;

  const [open, setOpen] = useState(false);
  const [jam, setJam] = useState("");
  const today = new Date().getHours();

  if (localStorage.length !== 0) {
    token = JSON.parse(localStorage.iatiToken);
    userId = token.userId;
  }

  useEffect(() => {
    if (role === "Lecturer") {
      props.getCourseAdmin();
    } else if (role === "Student") {
      props.getMyCourse(userId);
    }
    document.title = "Home";

    if (today < 12) {
      setJam("Selamat Pagi");
    } else if (today < 15) {
      setJam("Selamat Siang");
    } else if (today < 19) {
      setJam("Selamat Sore");
    } else {
      setJam("Selamat Malam");
    }
  }, [today]);

  useEffect(() => {}, []);

  const { username, email, id, role } = props.user.credentials;

  const { imgProfile, loading, loading_img } = props.user;
  const { my_course, loading_my_course } = props.data;
  const { course_admin, loading_course } = props.admin;

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeImage = (e) => {
    const image = e.target.files[0];
    const extension = image.name.slice(
      ((image.name.lastIndexOf(".") - 1) >>> 0) + 2
    );
    if (image !== undefined) {
      if (extension === "jpg" || extension === "jpeg" || extension === "png")
        if (image.size > 1000000) {
          alert("Image terlalu besar");
        } else {
          const formData = new FormData();
          formData.append("file", image, image.name);
          props.uploadImage(formData, id);
        }
      else alert("Hanya menerima image");
    }
  };

  const handleEditPictures = () => {
    const input = document.getElementById("inputFile");
    input.click();
  };

  let dialogEditProfile = (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <EditProfile onClose={handleClose} />
    </Dialog>
  );

  return (
    <>
      <div className={classes.root}>
        {dialogEditProfile}
        <div className={classes.profile}>
          <Paper className={classes.paper}>
            <div style={{ textAlign: "center" }}>
              <h3>HI, {jam} </h3>
              <h3 style={{ marginTop: "5px", color: "var(--mainColor)" }}>
                {username}
              </h3>
            </div>
          </Paper>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Paper className={classes.paper}>
              {loading_img ? (
                <p>......</p>
              ) : imgProfile &&
                (imgProfile.status === 406 || imgProfile.status === 404) ? (
                <div>
                  <Avatar
                    style={{ width: "100px", height: "100px" }}
                    alt="Remy Sharp"
                    src="/img/user.png"
                  />
                  <Tooltip
                    onClick={handleEditPictures}
                    title="Edit Profile Picture"
                  >
                    <EditIcon className={classes.icon} />
                  </Tooltip>
                  <input
                    type="file"
                    id="inputFile"
                    hidden="hidden"
                    onChange={(e) => handleChangeImage(e)}
                  />
                </div>
              ) : (
                <div>
                  <Avatar
                    style={{ width: "100px", height: "100px" }}
                    alt="Remy Sharp"
                    src={`data:image/png;base64, ${imgProfile}`}
                  />
                  <Tooltip
                    onClick={handleEditPictures}
                    title="Edit Profile Picture"
                  >
                    <EditIcon className={classes.icon} />
                  </Tooltip>
                  <input
                    type="file"
                    id="inputFile"
                    hidden="hidden"
                    onChange={(e) => handleChangeImage(e)}
                  />
                </div>
              )}

              <Typography
                variant="h5"
                style={{ fontWeight: "bold", margin: "10px" }}
              >
                {username}
              </Typography>
              <Typography variant="h6">{email}</Typography>
              <Typography variant="h6">{id}</Typography>
              <Typography variant="h6">{role}</Typography>
              <button
                className={classes.button}
                onClick={() => handleClickOpen()}
              >
                Edit Profile
              </button>
            </Paper>
          )}
        </div>
        <div className={classes.data}>
          {role === "Lecturer" ? (
            loading_course ? (
              <Counting header="All Course" loading />
            ) : course_admin.length === 0 ? (
              <Counting header="All Course" count="0" />
            ) : (
              <Counting header="All Course" count={course_admin.length} />
            )
          ) : loading_my_course ? (
            <Counting header="My Course" loading />
          ) : my_course.length === 0 ? (
            <Counting header="My Course" count="0" />
          ) : (
            <Counting header="My Course" count={my_course.length} />
          )}

          {role === "Lecturer" ? (
            loading_course ? (
              <p>Loading...</p>
            ) : (
              <div className={classes.paperLecture}>
                {course_admin.map((course, index) => {
                  return (
                    <Link key={index} to="/course">
                      <Paper className={classes.newPaper}>
                        <div className={classes.card}>
                          <h4 className="nomor_mycourses">
                            Course {index + 1}
                          </h4>
                          <h4 className="desc_mycourses">
                            {course.courseName}
                          </h4>
                        </div>
                      </Paper>
                    </Link>
                  );
                })}
              </div>
            )
          ) : my_course && loading_my_course ? (
            <Courses datamycourse={my_course} loading mycourse />
          ) : (
            <Courses datamycourse={my_course} mycourse />
          )}
          <Article />
        </div>
      </div>
    </>
  );
};
const mapStateToProps = (state) => ({
  user: state.user,
  data: state.data,
  admin: state.admin,
});

const mapActionToProps = {
  getImageUser,
  getMyCourse,
  uploadImage,
  getCourseAdmin,
};

const useStyles = makeStyles({
  span: {
    marginLeft: "4px",
    cursor: "pointer",
    textDecoration: "underline",
  },
  root: {
    display: "flex",
    color: "var(--mainBlack)",
    minHeight: "400px",
    padding: "0 7rem",
    "& ::-webkit-scrollbar": {
      width: "10px",
    },
    "& ::-webkit-scrollbar-track": {
      background: "#f1f1f1",
      borderRadius: "5px",
    },
    "& ::-webkit-scrollbar-thumb": {
      background: "var(--mainColor)",
      borderRadius: "5px",
    },
    "& ::-webkit-scrollbar-thumb:hover": {
      background: "#555",
    },
  },
  profile: {
    flex: 1,
    padding: "0 2rem 0 0",
  },
  data: {
    flex: 1.8,
    padding: "0 0 0 2rem",
  },
  paper: {
    padding: "1rem",
    display: "flex",
    justifyContent: "center",
    "&:nth-child(2)": {
      marginTop: "10px",
      alignItems: "center",
      flexDirection: "column",
      justifyContent: "center",
      position: "sticky",
      top: "14vh",
    },
  },
  button: {
    background: "var(--mainColor)",
    border: "1px solid var(--mainColor)",
    padding: "6px 10px",
    marginTop: "10px",
    color: "white",
    width: "80%",
    borderRadius: "4px",
    cursor: "pointer",
    "&:hover": {
      background: "#304866",
      border: "1px solid #304866",
    },
  },
  icon: {
    position: "absolute",
    right: 110,
    top: 90,
    cursor: "pointer",
    color: "var(--mainColor)",
  },
  newPaper: {
    marginBottom: "5px",
    cursor: "pointer",
  },
  card: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",

    "& .nomor_courses": {
      flex: 0.3,
      background: "var(--darkColor)",
      padding: "1.5rem 0",
      color: "white",
      height: "100%",
    },
    "& .nomor_mycourses": {
      flex: 0.3,
      background: "var(--mainColor)",
      padding: "1.5rem 0",
      color: "white",
      height: "100%",
    },
    "& .desc_mycourses": {
      flex: 1,
      color: "var(--mainColor)",
      padding: "1.5rem 0",
      height: "100%",
    },
    "& .desc_courses": {
      flex: 1,
      color: "white",
      background: "var(--mainColor)",
      padding: "1.5rem 0",
      height: "100%",
    },
  },
  paperLecture: {
    marginTop: "1rem",
    height: "350px",
    overflow: "auto",
    paddingRight: "10px",
    "& a": {
      textDecoration: "none",
    },
  },
});

export default connect(mapStateToProps, mapActionToProps)(Home);
