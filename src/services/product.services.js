const { product, clothing, electronic, furniture } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')
const {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductsByUser,
    findAllProducts,
    findProduct,
    updateProductById
} = require('../models/repositories/product.repo')
const { removeUndefinedObject, updateNestedObjectParser } = require('../utils')
const insertInventory = require('../models/repositories/inventory.repo')
// defince Factory class to create product

class ProductFactory {
    /*
        ! type: 'Clothing',
        !payload
     */
    static productRegistry = {} // key-class
    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }
    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)
        return new productClass(payload).createProduct()
    }
    static async updateProduct(type, product_id, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)
        return new productClass(payload).updateProduct(product_id)
    }

    // TODO Publish,unPublish a product by a seller
    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id })
    }
    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id })
    }
    // TODO END
    // TODO Get a list of the seller's draft
    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })
    }
    // TODO END
    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true }
        return await findAllPublishForShop({ query, limit, skip })
    }
    // TODO Search
    static async getListSearchProduct({ keySearch }) {
        return await searchProductsByUser({ keySearch })
    }
    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
        return await findAllProducts({ limit, sort, page, filter, select: ['product_name', 'product_price', 'product_thumb','product_shop'] })
    }
    static async findProduct({ product_id }) {
        return await findProduct({ product_id, unSelect: ['__v'] })
    }
}

// denfine base product class
class Product {
    constructor({
        product_name, product_thumb, product_description, product_price,
        product_quantity, product_type, product_shop, product_attributes
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }
    //TODO Create new product
    async createProduct(product_id) {
        const newProduct = await product.create({ ...this, _id: product_id })
        if (newProduct) {
            // TODO add product_Stock in inventory collection
            await insertInventory({
                productId: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity
            })
        }
        return newProduct
    }
    //TODO Update Product
    async updateProduct(product_id, payload) {
        return await updateProductById({ product_id, payload, model: product })
    }
}
// TODO Define sub-clss for different product types Clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newClothing) throw new BadRequestError('Create new Clothing error')

        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError('Create new Product error')

        return newProduct
    }
    async updateProduct(product_id) {
        //TODO 1. Remove attr has null,undefined
        const objectParams = removeUndefinedObject(this);

        //TODO 2. Check xem update o cho nao?
        if (objectParams.product_attributes) {
            // TODO Update child
            await updateProductById({ product_id, payload: updateNestedObjectParser(objectParams.product_attributes), model: clothing })
        }
        const updateProduct = await super.updateProduct(product_id, objectParams)
        return updateProduct
    }
}
// TODO Define sub-clss for different product types Electronic

class Electronics extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronic) throw new BadRequestError('Create new Electronics error')
        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) throw new BadRequestError('Create new Product error')

        return newProduct
    }
    async updateProduct(product_id) {
        //TODO 1. Remove attr has null,undefined
        const objectParams = removeUndefinedObject(this);

        //TODO 2. Check xem update o cho nao?
        if (objectParams.product_attributes) {
            // TODO Update child
            await updateProductById({ product_id, payload: updateNestedObjectParser(objectParams.product_attributes), model: electronic })
        }
        const updateProduct = await super.updateProduct(product_id, objectParams)
        return updateProduct
    }
}
class Furnitures extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newFurniture) throw new BadRequestError('Create new Electronics error')

        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) throw new BadRequestError('Create new Product error')

        return newProduct
    }
    async updateProduct(product_id) {
        //TODO 1. Remove attr has null,undefined
        const objectParams = removeUndefinedObject(this);
        //TODO 2. Check xem update o cho nao?
        if (objectParams.product_attributes) {
            // TODO Update child
            await updateProductById({ product_id, payload: updateNestedObjectParser(objectParams.product_attributes), model: furniture })
        }
        const updateProduct = await super.updateProduct(product_id, objectParams)
        return updateProduct
    }
}
// TODO Register product types
ProductFactory.registerProductType('Electronics', Electronics)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furnitures)

module.exports = ProductFactory