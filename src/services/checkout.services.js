const { findCartById } = require("../models/repositories/cart.repo")
const { BadRequestError, NotFoundError } = require("../core/error.response")

class CheckoutService {
    /*
    {
        catId,
        userId,
        shop_order_ids: [
            {
                shopId,
                shop_discount: [],
                item_products:[
                    {
                    price,
                    quantity,
                    productId
                    }
                ]
            }
            
        ]
    }
     
    */
    static async checkoutReview({
        cartId, userId, shop_order_ids
    }) {
        // TODO Check cartID ton tai khong?
        const foundCart = await findCartById(cartId)
    }
}

module.exports = CheckoutService