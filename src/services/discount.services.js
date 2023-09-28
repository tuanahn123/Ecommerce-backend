/* 
    TODO 1. Genertor discount Code [Shop/ Admin]
    TODO 2. Get discount amount [User]
    TODO 3. GetAll discount code [User/Shop]
    TODO 4. Verify discount code [User]
    TODO 5. Delete discount Code [Admin/Shop]
    TODO 6.Cancel discount code [User]
*/

const { BadRequestError, NotFoundError } = require("../core/error.response")
const { discount } = require("../models/discount.model")
const { product } = require("../models/product.model")
const { findAllDiscountCodeUnselect, checkDiscountExists } = require("../models/repositories/discount.repo")
const { findAllProducts } = require("../models/repositories/product.repo")
const { convertToObjectIdMongodb, removeUndefinedObject } = require("../utils")

class DiscountServices {
    static async createDiscountCode(payload) {
        const {
            code, start_date, end_date, is_active,
            shopId, min_order_value, product_ids, applies_to, name, description,
            type, value, max_value, max_uses, uses_count, users_used, max_uses_per_user
        } = payload
        // TODO kiem tra
        if (new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError("Start date must be before end date")
        }
        // TODO Create index for discount code
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }).lean()
        if (foundDiscount && foundDiscount.discount_is_active == true) {
            throw new BadRequestError('Discount exists')
        }
        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_users_used: users_used,
            discount_max_uses_per_user: max_uses_per_user,
            discount_min_order_value: min_order_value || 0,
            discount_max_value: max_value,
            discount_shopId: shopId,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids,
        })
        return newDiscount
    }
    static async updateDiscountCode(payload) {
        const {
            discount_code, discount_start_date, discount_end_date,shopId
        } = payload

        // TODO kiem tra

        // TODO Create index for discount code
        const foundDiscount = await discount.findOne({
            discount_code: discount_code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }).lean()
        if (!foundDiscount && foundDiscount.discount_is_active == true) {
            throw new BadRequestError('Discount not exists')
        }
        if (new Date(discount_start_date) >= new Date(discount_end_date)) {
            throw new BadRequestError("Start date must be before end date")
        }
        return await discount.findOneAndUpdate(
            { discount_code: discount_code, discount_shopId: convertToObjectIdMongodb(shopId) },
            removeUndefinedObject(payload),
            { new: true })
    }
    // TODO 3. GetAll discount code [User/Shop]

    static async getAllDiscountCodesWithProduct({
        code, shopId, userId, limit, page
    }) {
        // Create index for disocunt_code
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }).lean()

        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundError('Discount not exists')
        }
        const { discount_applies_to, discount_product_ids } = foundDiscount
        let products
        if (discount_applies_to === 'all') {
            // TODO Get all product
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        if (discount_applies_to === 'specific') {
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        return products
    }

    //TODO Get list discount_code by shopId
    static async getAllDiscountCodesByShop({
        limit, page, shopId
    }) {
        const discounts = await findAllDiscountCodeUnselect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: shopId,
                discount_is_active: true
            },
            unSelect: ['__v', 'discount_shopId'],
            model: discount
        })
        return discounts
    }
    /*
    Applly Discout Code
*/
    static async getDiscountAmount({ codeId, userId, shopId, products }) {
        const foundDiscount = await checkDiscountExists(
            {
                model: discount,
                filter: {
                    discount_code: codeId,
                    discount_shopId: convertToObjectIdMongodb(shopId)
                }
            }
        )
        if (!foundDiscount) {
            throw new BadRequestError(`Discount doens't exists`)
        }
        const {
            discount_is_active,
            discount_max_uses,
            discount_type,
            discount_max_uses_per_user,
            discount_min_order_value,
            discount_end_date,
            discount_start_date,
            discount_users_used,
            discount_value
        } = foundDiscount
        if (!discount_is_active) throw new NotFoundError(`Discount expried`)
        if (!discount_max_uses) throw new NotFoundError(`Discount are out!`)

        if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
            throw new NotFoundError(`Discount ecode has expried`)
        }
        //Check xem cos gia tri toi thieu hay khong?
        let totalOrder = 0
        if (discount_min_order_value > 0) {
            // get total
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            if (totalOrder < discount_min_order_value) {
                throw new NotFoundError(`Discount requires a minium order value of ${discount_min_order_value}!`)
            }
            if (discount_max_uses_per_user > 0) {
                const userUserDiscount = discount_users_used.find(user => user.userId === userId)
                if (userUserDiscount) {
                    throw new NotFoundError(`User used discount`)
                }
            }
            //TODO Check xem discount nay la fixed_amount
            const amount = discount_type == 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)
            return {
                totalOrder,
                discount: amount,
                totalPrice: totalOrder - amount
            }
        }
    }

    //TODO Delete
    static async deleteDiscount({ shopId, codeId }) {
        const deleted = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: convertToObjectIdMongodb(shopId)
        })
        return deleted
    }

    //TODO Cancel Disocunt Code
    static async cancelDiscount({ shopId, codeId, userId }) {
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId)
            }
        })
        if (!foundDiscount) {
            throw new NotFoundError(`Discount doesn't exist`)
        }

        const result = await discount.findByIdAndUpdate(fountDiscount._id, {
            $pull: {
                discount_users_used: userId,
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1
            }
        })
        return result
    }
}

module.exports = DiscountServices