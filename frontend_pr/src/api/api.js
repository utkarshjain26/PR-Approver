import { Axios } from "axios";
import { useUserStore } from "../store/UserStore";

export const BASE_URL = "http://localhost:4000";

export const adminAxios = new Axios({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  responseType: "json",
});

//intercepter logout
// adminAxios.interceptors.response.use(
//   (response) => {
//     if (response.status === 401) {
//       useUserStore.getState().logout();
//       return location.replace("/login");
//     }
//     return response;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

const request = async (options) => {
  const authToken = useUserStore.getState().authToken;

  const onSuccess = (response) => {
    console.log("response in api request", response);
    if (response.status >= 200 && response.status < 300) {
      return JSON.parse(response?.data);
    } else {
      // If the status is not a success, reject with an error
      return Promise.reject(JSON.parse(response?.data));
    }
  };

  const onError = (error) => {
    console.log("error in api request", error);
    // toast.error(error?.message || "some error occured"); //if i remove it then success toast is showing
    return Promise.reject(error?.response?.data || error?.message);
  };

  return adminAxios
    .request({ headers: { Authorization: `Bearer ${authToken}` }, ...options })
    .then(onSuccess)
    .catch(onError);
};

const ApiRequests = {
  // auth apis
  getLogin: async ({ payload }) =>
    request({
      url: `/auth/login`,
      method: "POST",
      data: JSON.stringify(payload),
    }),
  getSignup: async ({ payload }) =>
    request({
      url: `/auth/signUp`,
      method: "POST",
      data: JSON.stringify(payload),
    }),

  // user apis
  getUsers: async () =>
    request({
      url: `/user`,
      method: "GET",
    }),
  updateLastCheckTime: async ({ id, payload }) =>
    request({
      url: `/user/${id}`,
      method: "PUT",
      data: JSON.stringify(payload),
    }),
  // notification apis
  getNotifications: async () =>
    request({
      url: `/notification/`,
      method: "GET",
    }),
  getNewNotification: async ({id}) =>
    request({
      url: `/notification/${id}/new`,
      method: "GET",
    }),
  updateNotificationStatus: async ({ id }) =>
    request({
      url: `/notification/${id}`,
      method: "PUT",
    }),
  // request apis
  getRequests: async () =>
    request({
      url: `/request`,
      method: "GET",
    }),
  getRequestById: async ({ id }) =>
    request({
      url: `/request/${id}`,
      method: "GET",
    }),
  createRequest: async ({ payload }) =>
    request({
      url: `/request`,
      method: "POST",
      data: JSON.stringify(payload),
    }),
  deleteRequestById: async ({ id }) =>
    request({
      url: `/request/${id}`,
      method: "DELETE",
    }),
  updateRequestById: async ({ id, payload }) =>
    request({
      url: `/request/${id}`,
      method: "PUT",
      data: JSON.stringify(payload),
    }),
  postCommentToRequestById: async ({ id, payload }) =>
    request({
      url: `/request/${id}/comment`,
      method: "POST",
      data: JSON.stringify(payload),
    }),
  postApprovalToRequestById: async ({ id, payload }) =>
    request({
      url: `/request/${id}/approval`,
      method: "POST",
      data: JSON.stringify(payload),
    }),
};

export default ApiRequests;
