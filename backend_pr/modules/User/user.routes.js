const router = require('express').Router();
const { userController } = require('./user.controller');

router.get("/", userController.getUsers);

router.put("/:id",userController.updateLastCheckTime);

exports.userRouter = router;