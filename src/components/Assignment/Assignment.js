import React, { useState } from "react";
import { Link } from "react-router-dom";

import axios from "../../config/axios";
import { connect } from "react-redux";
import { setMessage } from "../../redux/actions/action_ui";
import makeStyles from "@material-ui/core/styles/makeStyles";

const AssignmentComponent = (props) => {
  const [download, setDownload] = useState(false);
  const [upload, setUpload] = useState(false);
  const [file, setFile] = useState("");

  const { role } = props.user.credentials;

  const handleDownload = () => {
    setDownload(true);
    let materialId;
    let userId;
    if (role === "Student") {
      materialId = props.data.id;
      userId = props.user.credentials.id;
    } else if (role === "Lecturer") {
      materialId = props.data.materialId;
      userId = props.data.userId;
    }
    axios
      .get(
        `/iati/upload-file/assignment/getAnswer?userId=${userId}&materialId=${materialId}`
      )
      .then((res) => {
        if (res.data === "") {
          setFile("");
          setDownload(false);
          alert("Soal belum ada");
        } else {
          setFile(res.data);
          setDownload(false);
          const linkSource = `data:application/pdf;base64,${res.data}`;
          const downloadLink = document.createElement("a");
          const fileName = `Soal_${materialId}.pdf`;
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        }
      })
      .catch((err) => {
        setDownload(false);
        console.log(err);
      });
  };

  const handleUpload = (file) => {
    setUpload(true);
    axios
      .post(`/iati/upload-file/request/answer/quiz`, file)
      .then(() => {
        setUpload(false);
        if (role === "Lecturer") {
          props.setMessage({
            payload: `File berhasil diupload pada course id ${props.data.courseId}`,
            status: "assignment",
          });
        } else if (role === "Student") {
          props.setMessage({
            payload: `File berhasil diupload pada course id ${props.data.course.id}`,
            status: "assignment",
          });
        }
      })
      .catch((err) => {
        setUpload(false);
      });
  };

  const handleChangeFile = (e) => {
    const file = e.target.files[0];
    let extension;
    let materialId;
    let userId;

    if (role === "Student") {
      materialId = props.data.id;
      userId = props.user.credentials.id;
    } else if (role === "Lecturer") {
      materialId = props.data.materialId;
      userId = props.data.userId;
    }

    if (file === "" || file === undefined) {
      return alert("File tidak boleh kosong");
    } else {
      extension = file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2);
      if (extension === "pdf") {
        if (file.size > 20000000) {
          alert("File terlalu besar");
        } else {
          const formData = new FormData();
          formData.append("file", file, file.name);
          formData.append("userId", userId);
          formData.append("materialId", materialId);
          handleUpload(formData);
        }
      } else {
        alert(
          "Hanya bisa mengupload file pdf , harap mengubah file kedalam bentuk pdf terlebih dahulu terimakasih"
        );
      }
    }
  };

  const handleUploadFile = (id) => {
    const input = document.getElementById(id);
    if (upload) {
      alert("Masih dalam proses upload");
    } else {
      input.click();
    }
  };

  const classes = useStyles();
  return (
    <>
      {role === "Student" ? (
        props.data.length !== 0 ? (
          <div className={classes.root}>
            <div>
              <Link to={`/course/my_course/details?id=${props.data.course.id}`}>
                {props.data.course.id}
              </Link>
            </div>
            <div>
              <h4>{props.data.materialName}</h4>
            </div>
            <div className={classes.action}>
              <h5 onClick={handleDownload}>
                {download ? "Downloading..." : "Download Soal"}
              </h5>
              <h5 onClick={() => handleUploadFile(props.data.id)}>
                {upload ? "Uploading..." : "Upload Jawaban"}
              </h5>
              <input
                type="file"
                id={props.data.id}
                hidden="hidden"
                onChange={(e) => handleChangeFile(e)}
              />
            </div>
          </div>
        ) : (
          <div className={classes.emptyData}>
            <h5>{props.emptyTitle}</h5>
          </div>
        )
      ) : props.data.length !== 0 ? (
        <div className={classes.rootLecturer}>
          <div>
            <h5>{props.data.userId}</h5>
          </div>
          <div>
            <Link to={`/course`}>{props.data.courseId}</Link>
          </div>
          <div>
            <h5>{props.data.userName}</h5>
          </div>
          <div>
            <h5>{props.data.courseName}</h5>
          </div>
          <div>
            <h5>{props.data.materialName}</h5>
          </div>
          <div className={classes.action}>
            <h5 onClick={handleDownload}>
              {download ? "Downloading..." : "Download Jawaban"}
            </h5>
            <input
              type="file"
              id={props.data.courseId}
              hidden="hidden"
              onChange={(e) => handleChangeFile(e)}
            />
          </div>
        </div>
      ) : (
        <div className={classes.emptyData}>
          <h5>{props.emptyTitle}</h5>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const useStyles = makeStyles({
  root: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr 1fr",
    padding: "12px 0",
    background: "rgb(245,245,245)",
    justifyItems: "center",
    border: "1px solid rgb(235,235,235)",
    "& a": {
      color: "var(--mainColor)",
      textDecoration: "none",
      "&:hover": {
        textDecoration: "underline",
      },
    },
    "&:nth-child(odd)": {
      background: "rgb(235,235,235)",
    },
  },
  rootLecturer: {
    display: "grid",
    gridTemplateColumns: "0.5fr 0.5fr 1fr 1fr 1fr 1fr",
    padding: "12px 0",
    background: "rgb(245,245,245)",
    justifyItems: "center",
    border: "1px solid rgb(235,235,235)",
    "& a": {
      color: "var(--mainColor)",
      textDecoration: "none",
      "&:hover": {
        textDecoration: "underline",
      },
    },
    "&:nth-child(odd)": {
      background: "rgb(235,235,235)",
    },
  },
  emptyData: {
    display: "grid",
    gridTemplateColumns: "1fr",
    padding: "1.5rem 0",
    background: "rgb(245,245,245)",
    justifyItems: "center",
  },
  action: {
    display: "flex",
    color: "var(--mainColor)",
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

export default connect(mapStateToProps, { setMessage })(AssignmentComponent);
