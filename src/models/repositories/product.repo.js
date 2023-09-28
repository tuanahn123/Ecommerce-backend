const { product, electronic, furniture, clothing } = require('../../models/product.model')
const { Types } = require("mongoose")
const { getSelectData, UngetSelectData } = require('../../utils')
const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}
const findAllPublishForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}
const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if (!foundShop) return null
    foundShop.isDraft = false;
    foundShop.isPublished = true;
    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}
const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if (!foundShop) return null
    foundShop.isDraft = true;
    foundShop.isPublished = false;
    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}
const queryProduct = async ({ query, limit, skip }) => {
    return await product.find(query).populate('product_shop', 'name email -_id').sort({ updateAt: -1 }).skip(skip).limit(limit).lean().exec()
}
const searchProductsByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch)
    const results = await product.find({
        isPublished: true,
        $text: { $search: regexSearch },
    }, {
        score: { $meta: 'textScore' }
    }).sort({ score: { $meta: 'textScore' } }).lean()
    return results
}
const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const products = await product.find(filter)
        .sort(sortBy) //TODO sort theo ctime
        .skip(skip) //TODO skip
        .limit(limit) //TODO limit
        .select(getSelectData(select)).lean() // TODO select fields
    return products
}
const findProduct = async ({ product_id, unSelect }) => {
    return await product.findById(product_id).select(UngetSelectData(unSelect))
}
const updateProductById = async ({ product_id, payload, model, isNew = true }) => {
    return await model.findByIdAndUpdate(product_id, payload, { new: isNew })
}
module.exports = {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductsByUser,
    findAllProducts,
    findProduct,
    updateProductById
}