const express = require("express");
const asyncHandler = require("../../src/helpers/asyncHandler");
const cartController = require("../../src/controller/cart.controller");
const router = express.Router()



router.post('', asyncHandler(cartController.addToCart))
router.delete('', asyncHandler(cartController.delete))
router.post('/update', asyncHandler(cartController.update))
router.get('', asyncHandler(cartController.listToCart))

module.exports = router