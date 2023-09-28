const express = require("express");
const accessController = require("../../src/controller/access.controller");
const asyncHandler = require("../../src/helpers/asyncHandler");
const { authentication } = require("../../src/auth/authUtils");

const router = express.Router()

router.post("/shop/signup", asyncHandler(accessController.signUp))
router.post("/shop/login", asyncHandler(accessController.login))

//TODO authentication
router.use(authentication)
router.post("/shop/handlerRefeshToken", asyncHandler(accessController.handlerRefeshToken))
router.post("/shop/logout", asyncHandler(accessController.logout))
module.exports = router