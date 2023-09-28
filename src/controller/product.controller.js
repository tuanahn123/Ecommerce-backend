const ProductService = require("../services/product.services")
const ProductServiceV2 = require("../services/product.services.xxx")
const { SuccessRespone } = require('../core/success.response')
class ProductController {
    createProduct = async (req, res, next) => {
        new SuccessRespone({
            message: 'Create new Product success',
            metadata: await ProductService.createProduct(req.body.product_type,
                {
                    ...req.body,
                    product_shop: req.user.userId
                })
        }).send(res)
    }
    updateProduct = async (req, res, next) => {
        new SuccessRespone({
            message: 'Update Product success',
            metadata: await ProductService.updateProduct(req.body.product_type, req.params.product_id, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    publishProductShop = async (req, res, next) => {
        new SuccessRespone({
            message: 'Publish Product Shop success',
            metadata: await ProductService.publishProductByShop({ product_shop: req.user.userId, product_id: req.params.id })
        }).send(res)
    }
    unPublishProductShop = async (req, res, next) => {
        new SuccessRespone({
            message: 'Publish Product Shop success',
            metadata: await ProductService.unPublishProductByShop({ product_shop: req.user.userId, product_id: req.params.id })
        }).send(res)
    }
    // TODO QUERY
    /**
     * @desc Get all draft for shop
     * @param {Number} limit 
     * @param {Number} skip 
     * @return {JSON}
     */
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessRespone({
            message: 'Get list Draft success!',
            metadata: await ProductService.findAllDraftsForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }
    // TODO End QUERY
    getAllPublishForShop = async (req, res, next) => {
        new SuccessRespone({
            message: 'Get list Draft success!',
            metadata: await ProductService.findAllPublishForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }
    getAllPublishForShop = async (req, res, next) => {
        new SuccessRespone({
            message: 'Get list Draft success!',
            metadata: await ProductService.findAllPublishForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }
    getListSearchProduct = async (req, res, next) => {
        new SuccessRespone({
            message: 'Get list Search Product success!',
            metadata: await ProductService.getListSearchProduct(req.params)
        }).send(res)
    }
    findAllProducts = async (req, res, next) => {
        new SuccessRespone({
            message: 'Get All Product success!',
            metadata: await ProductService.findAllProducts(req.query)
        }).send(res)
    }
    findProduct = async (req, res, next) => {
        new SuccessRespone({
            message: 'Get Product success!',
            metadata: await ProductService.findProduct({ product_id: req.params.product_id })
        }).send(res)
    }

}

module.exports = new ProductController