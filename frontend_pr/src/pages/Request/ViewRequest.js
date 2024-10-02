import { useEffect, useState, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext";
import ReactQuill from "react-quill";
import { useUserStore } from "../../store/UserStore";
import { ApiMutations, ApiQueries } from "../../api/query";

const { io } = require("socket.io-client");
const socket = io("http://localhost:4000");

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
    ["link", "image"],
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
  "image",
];

const ViewRequest = () => {
  const [postInfo, setPostInfo] = useState({});
  const [comment, setComment] = useState("");
  const [flag, setFlag] = useState(false);

  const [redirect, setRedirect] = useState(false);
  const [like, setLike] = useState(false);

  const navigate = useNavigate();

  const userInfo = useUserStore((state) => state.user);
  const authToken = useUserStore((state) => state.authToken);

  const [approver, setApprover] = useState(false);
  const { id } = useParams();

  const {
    data: requestData,
    isFetched: isRequestDataFetched,
    isLoading: isRequestDataLoading,
  } = ApiQueries.useGetRequestsById({ id });

  useEffect(() => {
    if (requestData && isRequestDataFetched) {
      setPostInfo(requestData);
    }
  }, [requestData]);

  // For checking is current user an approver or not (parallel case)
  useEffect(() => {
    if (postInfo && postInfo.approvers && postInfo.processed === "parallel") {
      const isUserApprover = postInfo.approvers.some(
        (item) => item.approverId._id === userInfo.userId
      );
      setApprover(isUserApprover);
    }
  }, [postInfo, userInfo]);

  // For checking is current user an approver or not (sequential case)
  useEffect(() => {
    if (
      postInfo?.approvers?.[postInfo.counter]?.approverId._id ===
      userInfo?.userId
    ) {
      console.log(postInfo?.approvers?.[postInfo.counter]?.approverId._id);
      console.log(userInfo.userId);
      const isApprover = true;
      setApprover(isApprover);
    }
  }, [postInfo, userInfo]);

  const { mutate: postCommentToRequestById } =
    ApiMutations.usePostCommentToRequestById();

  const handleComment = async (e) => {
    e.preventDefault();
    const payload = {
      comment: comment,
    };
    postCommentToRequestById(
      { id, payload },
      {
        onSuccess: () => {
          setComment("");
        },
        onError: () => {
          alert("Error in posting comment, try again!");
        },
      }
    );
  };

  const { mutate: postApprovalToRequestById } =
    ApiMutations.usePostApprovalToRequestById();

  const handleApprove = async (e, approval) => {
    e.preventDefault();
    const payload = {
      approval: approval,
    };
    postApprovalToRequestById(
      { id, payload },
      {
        onSuccess: () => {
          alert("Request sent!");
        },
        onError: () => {
          alert("Failed to sent request");
        },
      }
    );
  };

  const { mutate: deleteRequestById } = ApiMutations.useDeleteRequestById();

  const handleDelete = async (e) => {
    e.preventDefault();
    deleteRequestById(
      { id },
      {
        onSuccess: () => {
          navigate(`/pull-request`);
        },
        onError: () => {
          alert(`Can't delete request, Try again!`);
        },
      }
    );
  };

  const user = postInfo?.requesterId?.username;
  const length = postInfo?.approvers?.length;

  return (
    <div className="new-format">
      <div className="new-pull-request">
        <div className="new-pull-request-title">{postInfo.title}</div>
        <div className="new-pull-request-details">
          <div dangerouslySetInnerHTML={{ __html: postInfo.description }}></div>
        </div>

        <div class="boxer middle-box">
          <div class="box middle-box-left">
            <div class="heading" style={{ fontWeight: "bold" }}>
              Approved By
            </div>
            {length > 0 &&
              postInfo.approvers.map((approver) => {
                if (approver.status === "Approved") {
                  return <div>{approver.approverId.username}</div>;
                }
              })}
          </div>

          <div class="box middle-box-middle">
            <div class="heading" style={{ fontWeight: "bold" }}>
              Rejected By
            </div>
            {length > 0 &&
              postInfo.approvers.map((approver) => {
                if (approver.status === "Rejected") {
                  return <div>{approver.approverId.username}</div>;
                }
              })}
          </div>

          <div class="box middle-box-right">
            <div class="heading" style={{ fontWeight: "bold" }}>
              Pending
            </div>
            {length > 0 &&
              postInfo.approvers.map((approver) => (
                <div>
                  {approver.status === "Pending" && (
                    <div>{approver.approverId.username}</div>
                  )}
                </div>
              ))}
          </div>
        </div>

        <div className="new-status-tab">Status: {postInfo.status}</div>

        <div className="comment-box">
          {postInfo.comments &&
            postInfo.comments.map((comment) => (
              <div>
                <div>
                  {comment.reviewerId.username.toUpperCase()}:
                  <div
                    dangerouslySetInnerHTML={{ __html: comment.comments }}
                  ></div>
                </div>
              </div>
            ))}
        </div>
        <form onSubmit={handleComment}>
          <ReactQuill
            className="form-control-format"
            placeholder="Leave a comment here"
            id="floatingTextarea"
            value={comment}
            onChange={(newValue) => setComment(newValue)}
            modules={modules}
            formats={formats}
          ></ReactQuill>

          <div className="form-btn">
            <button
              className="btn btn-primary"
              id="comment-btn"
              style={{ marginBottom: "10px" }}
            >
              Comment
            </button>
          </div>
        </form>
        <div id="requestedBy">
          Requested By: {user ? <p>{user}</p> : <p>anonymous</p>}
        </div>
        <div>Requested At: {postInfo.createdAt}</div>

        <div class="button-container">
          {approver && (
            <div>
              <button
                onClick={(e) => handleApprove(e, "Approved")}
                class="button"
                style={{ backgroundColor: "green" }}
              >
                Approve
              </button>
              <button
                onClick={(e) => handleApprove(e, "Rejected")}
                class="button"
                style={{ backgroundColor: "#D2042D" }}
              >
                Reject
              </button>
            </div>
          )}

          {userInfo?.userId === postInfo.requesterId?._id && (
            <div>
              <Link to={`/edit-pull-request/${postInfo._id}`}>
                <button class="button">Edit</button>
              </Link>
              <button onClick={handleDelete} class="button">
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewRequest;
