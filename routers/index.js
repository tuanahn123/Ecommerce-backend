const express = require("express");
const { apiKey, permission } = require("../src/auth/checkAuth");
const router = express.Router()

// TODO Check apiKey
router.use(apiKey)
router.use(permission('0000'))

// TODO check permission


router.use("/v1/api/product", require('./product'))
router.use("/v1/api/discount", require('./discount'))
router.use("/v1/api/notification", require('./notification'))
router.use("/v1/api/cart", require('./cart'))
router.use("/v1/api", require('./access'))


module.exports = router