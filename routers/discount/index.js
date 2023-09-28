const express = require("express");
const asyncHandler = require("../../src/helpers/asyncHandler");
const { authentication } = require("../../src/auth/authUtils");
const discountController = require("../../src/controller/discount.controller");

const router = express.Router()



//Get amount a discount
router.post('/amount', asyncHandler(discountController.getDiscountAmount))

router.get('/list_product_code', asyncHandler(discountController.getAllDiscountCodesWithProduct))

//TODO authentication
router.use(authentication)
router.post('', asyncHandler(discountController.createDiscountCode))
router.patch('/:code', asyncHandler(discountController.updateDiscountCode))
router.get('', asyncHandler(discountController.getAllDiscountCode))

module.exports = router
