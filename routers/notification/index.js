const express = require("express");
const asyncHandler = require("../../src/helpers/asyncHandler");
const { authentication } = require("../../src/auth/authUtils");
const NotificationController = require("../../src/controller/notification.controller")
const router = express.Router()
// Not login

//TODO authentication
router.use(authentication)

router.get('/',NotificationController.listNotiByUser)
module.exports = router
