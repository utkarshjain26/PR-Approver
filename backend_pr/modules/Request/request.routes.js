const router = require('express').Router();
const { verifyToken } = require('../../middleware/verifyToken');
const { requestController } = require('./request.controller');

router.get("/", requestController.getRequests);

router.get("/:id", verifyToken, requestController.getRequestById);

router.post("/", verifyToken, requestController.createRequest);

router.delete("/:id", verifyToken, requestController.deleteRequestById);

router.put("/:id", verifyToken, requestController.updateRequestById);

router.post("/:id/comment", verifyToken, requestController.postCommentToRequestById);

router.post("/:id/approval", verifyToken, requestController.postApprovalToRequestById);

exports.requestRouter = router;