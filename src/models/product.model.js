const {
    model,
    Schema,
} = require('mongoose');
const slugify = require("slugify")
const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products'

const productSchema = new Schema({
    product_name: {
        type: String,
        require: true
    },
    product_thumb: {
        type: String,
        require: true
    },
    product_description: String,
    product_slug: String,
    product_price: {
        type: String,
        require: true
    },
    product_quantity: {
        type: String,
        require: true
    },
    product_type: {
        type: String,
        require: true
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    product_attributes: {
        type: Schema.Types.Mixed,
        required: true
    },
    product_ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be about above 1.0'],
        max: [5, 'Rating must be about above 5.0'],
        set: (val) => Math.round(val * 10) / 10
    },
    product_variations: {
        type: Array,
        default: []
    },
    isDraft: {
        type: Boolean,
        default: true,
        index: true,
        select: false
    },
    isPublished: {
        type: Boolean,
        default: false,
        index: true,
        select: false
    }

}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

// TODO Document middleware: runs efore .save() and create()
productSchema.index({ product_name: 'text', product_description: 'text' })
productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next()
})

// denfine the product type = clothing

const clothingSchema = new Schema({
    brand: {
        type: String,
        require: true
    },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
}, {
    collection: 'clothes',
    timestamps: true
})

const electronicSchema = new Schema({
    manufacturer: {
        type: String,
        require: true
    },
    model: String,
    color: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
}, {
    collection: 'electronic',
    timestamps: true
})
const furnitureSchema = new Schema({
    brand: {
        type: String,
        require: true
    },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
}, {
    collection: 'furniture',
    timestamps: true
})
module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    electronic: model('electronics', electronicSchema),
    clothing: model('clothing', clothingSchema),
    furniture: model('furniture', furnitureSchema),
}