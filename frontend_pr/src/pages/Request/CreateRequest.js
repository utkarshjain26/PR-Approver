import { useContext, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext";
import { Dropdown, FormControl } from "react-bootstrap";
import {
  Box,
  Checkbox,
  Chip,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { ApiMutations, ApiQueries } from "../../api/query";

const { io } = require("socket.io-client");
const socket = io("http://localhost:4000");
// stopPropagation is used for default closing of dropdown
// i put the key to math.random(), it just make the page run on every state change(doubt)

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
];

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 150,
      width: 250,
    },
  },
};

const CreateRequest = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [flag, setFlag] = useState(false);
  const { setSock } = useContext(UserContext);
  const [processed, setProcessed] = useState("");
  const [users, setUsers] = useState([]);
  const [selectUsers, setSelectUsers] = useState([]);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectUsers(
      typeof value === "string" ? value.split(",") : value
    );
  };

  console.log(selectUsers);
  const {
    data: userData,
    isFetched: isUserDataFetched,
    isLoading: isUserDataLoading,
  } = ApiQueries.useGetUsers();

  useEffect(() => {
    if (userData && isUserDataFetched) {
      setUsers(userData);
    }
  }, [userData]);


  const { mutate: createRequest } = ApiMutations.useCreateRequest();

  
  const handlePost = async (e) => {
    e.preventDefault();
    const payload = {
      title: title,
      content: content,
      checker: selectUsers,
      processed: processed,
    };
    createRequest(
      { payload },
      {
        onSuccess: () => {
          navigate(`/pull-request`);
        },
        onError: () => {
          alert(`Failed to create request`);
        },
      }
    );
    //     const response = await fetch("http://localhost:4000/pull-request", {
    //       method: "POST",
    //       body: JSON.stringify({ title, content, checker, processed }),
    //       headers: { "Content-Type": "application/json" },
    //       credentials: "include",
    //     });
    //     if (response.ok) {
    //       setRedirect(true);
    //     }
  };

  return (
    <div className="newPost-body">
      <form className="newPost" onSubmit={handlePost}>
        <h1 className="newPost-head">Create Request</h1>
        <div className="input-group newpost">
          <input
            type="text"
            className="form-control"
            placeholder="Title"
            aria-label="Title"
            aria-describedby="addon-wrapping"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <ReactQuill
          id="floatingTextarea1"
          placeholder="Write a description of request"
          color="white"
          value={content}
          onChange={(newValue) => setContent(newValue)}
          modules={modules}
          formats={formats}
        ></ReactQuill>

        {/** dropdown */}
        <Box
          sx={{
            marginTop: "10px",
            width: "100%",
            height: "8rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* <form className="newpost select"> */}
          <InputLabel
            id="demo-multiple-checkbox-label"
            sx={{ color: "white", marginBottom: "10px" }}
          >
            Select Approvers
          </InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={selectUsers}
            onChange={handleChange}
            input={<OutlinedInput label="Select Approvers" />}
            renderValue={(selected) =>
              `${selected.length}  ${
                selected.length > 1 ? "approvers" : "approver"
              } selected`
            }
            sx={{ width: "20rem", backgroundColor: "#2d333b", color: "white" }}
            MenuProps={MenuProps}
          >
            {users &&
              users.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  <Checkbox checked={selectUsers.indexOf(user._id) > -1} />
                  <ListItemText primary={user.username} />
                </MenuItem>
              ))}
          </Select>
          {/* </form> */}
        </Box>

        {/** selecters */}
        <div className="processed">
          <label htmlFor="parallel">
            Parallel
            <input
              style={{ marginRight: "20px", marginLeft: "5px" }}
              type="radio"
              id="parallel"
              name="1"
              value="parallel"
              onChange={(e) => setProcessed(e.target.value)}
            />
          </label>
          <label htmlFor="sequential">
            Sequential
            <input
              style={{ marginRight: "20px", marginLeft: "5px" }}
              type="radio"
              id="sequential"
              name="1"
              value="sequential"
              onChange={(e) => setProcessed(e.target.value)}
            />
          </label>
        </div>

        <div className="newpost">
          <button
            className="btn btn-outline-secondary newPost-btn"
            type="submit"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRequest;
