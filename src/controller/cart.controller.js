const { SuccessRespone } = require('../core/success.response')
const CartService = require('../services/cart.services')

class CartController {
    addToCart = async (req, res, next) => {
        new SuccessRespone({
            message: 'Add to cart success',
            metadata: await CartService.addToCart({
                ...req.body,
            })
        }).send(res)
    }
    // !Update
    update = async (req, res, next) => {
        new SuccessRespone({
            message: 'Update cart success',
            metadata: await CartService.addToCartV2({
                ...req.body,
            })
        }).send(res)
    }
    delete = async (req, res, next) => {
        new SuccessRespone({
            message: 'Delete cart success',
            metadata: await CartService.deleteUserCart({
                ...req.body,
            })
        }).send(res)
    }
    listToCart = async (req, res, next) => {
        new SuccessRespone({
            message: 'List to cart success',
            metadata: await CartService.getListUserCart(req.query)
        }).send(res)
    }
}

module.exports = new CartController()