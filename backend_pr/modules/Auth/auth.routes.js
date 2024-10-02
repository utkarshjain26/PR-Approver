const router = require('express').Router();
const { authContoller } = require('./auth.controller');

router.post("/login", authContoller.login);

router.post("/signUp", authContoller.signUp);


exports.authRouter = router;