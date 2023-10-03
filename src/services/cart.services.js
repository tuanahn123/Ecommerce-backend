const { cart } = require("../models/cart.model")
const { BadRequestError, NotFoundError } = require("../core/error.response")
const { getProductById } = require("../models/repositories/product.repo")

/*
    TODO 1. Add product to cart [User]
    TODO 2. Reduce product quantity [User]
    TODO 3. Increase product quantity [User]
    TODO 4. Get list to cart [User]
    TODO 5. Delete cart [User]
    TODO 6. Delete cart item [User]
 */
class CartService {
    //! Start REPO CART
    static async createUserCart({ userId, product }) {
        const query =
        {
            cart_userId: userId,
            cart_state: 'active'
        },
            updateOrInsert = {
                $addToSet: {
                    cart_products: product
                }
            },
            options = { upsert: true, new: true }
        return await cart.findOneAndUpdate(query, updateOrInsert, options)

    }
    static async updateUserCartQuantity({ userId, product }) {
        const { productId, quantity } = product
        const query = {
            cart_userId: userId,
            'cart_products.productId': productId,
            cart_state: 'active'
        };
        const updateSet = {
            $inc: {
                'cart_products.$.quantity': quantity
            }
        };
        const updateOrInsert = {
            $addToSet: {
                cart_products: product
            }
        };
        const options = { upsert: true, new: true };

        return await cart.findOneAndUpdate(query, updateSet, options)

    }
    //! END REPO CART
    static async addToCart({ userId, product = {} }) {
        // TODO Check cart ton tai hay khong
        const userCart = await cart.findOne({ cart_userId: userId })
        if (!userCart) {
            // TODO Create cart for User
            return await CartService.createUserCart({ userId, product })
        }
        // TODO Nếu có giỏ hàng rồi nhưng chưa có sản phẩm
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save()
        }
        // TODO Nếu sản phẩm tồn tại, thì update quantity
        return await CartService.updateUserCartQuantity({ userId, product })

    }
    // ! Update cart
    static async addToCartV2({ userId, shop_order_ids = {} }) {
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]
        const foundProduct = await getProductById(productId)
        if (!foundProduct) throw new NotFoundError('Product not exist')
        // TODO Compare
        if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId)
            throw new NotFoundError('Product do not belong to the shop')
        if (quantity == 0) {
            // TODO DELETE
            return CartService.deleteUserCart({ userId, productId })
        }
        return await CartService.updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity
            }
        })

    }
    static async deleteUserCart({ userId, productId }) {
        const query = { cart_userId: userId, cart_state: 'active' },
            updateSet = {
                $pull: {
                    cart_products: {
                        productId
                    }
                }
            }
        const deleteCart = await cart.updateOne(query, updateSet)

        return deleteCart
    }
    static async getListUserCart({ userId }) {
        return await cart.findOne({
            cart_userId: userId
        }).lean()
    }
}

module.exports = CartService
