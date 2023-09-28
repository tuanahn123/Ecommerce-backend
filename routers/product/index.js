const express = require("express");
const asyncHandler = require("../../src/helpers/asyncHandler");
const { authentication } = require("../../src/auth/authUtils");
const ProductController = require("../../src/controller/product.controller");

const router = express.Router()

router.get('/search/:keySearch', asyncHandler(ProductController.getListSearchProduct))
router.get('', asyncHandler(ProductController.findAllProducts))
router.get('/:product_id', asyncHandler(ProductController.findProduct))

//TODO authentication
router.use(authentication)

router.post("/", asyncHandler(ProductController.createProduct))
router.post("/publish/:id", asyncHandler(ProductController.publishProductShop))
router.post("/unPublish/:id", asyncHandler(ProductController.unPublishProductShop))

router.patch("/:product_id", asyncHandler(ProductController.updateProduct))


// TODO QUERY
router.get('/drafts/all', asyncHandler(ProductController.getAllDraftsForShop))
router.get('/published/all', asyncHandler(ProductController.getAllPublishForShop))
module.exports = router