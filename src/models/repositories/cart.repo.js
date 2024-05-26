const { convertToObjectIdMongodb } = require('../../utils')
const { cart } = require('../cart.model')

const findCartById = async (cartId) => {
    return await cart.findOne({ _id: convertToObjectIdMongodb(cartId), cart_status: "active" }).lean()
}

module.exports = { findCartById }