const {
    model,
    Schema,
} = require('mongoose');
const slugify = require("slugify")
const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'discounts'

const discountSchema = new Schema({
    discount_name: {
        type: String,
        require: true
    },
    discount_description: {
        type: String,
        require: true
    },
    discount_type: {
        type: String,
        default: "fixed_amount", //percentage
    },
    discount_value: {
        type: Number,
        require: true
    },
    //TODO Discount Code
    discount_code: {
        type: String,
        require: true
    },
    //TODO Start date discount
    discount_start_date: {
        type: Date,
        require: true
    },
    //TODO End date discount
    discount_end_date: {
        type: Date,
        require: true
    },
    //TODO max uses discount
    discount_max_uses: {
        type: Number,
        require: true
    },
    //TODO so discount da su dung
    discount_uses_count: {
        type: Number,
        require: true
    },
    //TODO User da su dung
    discount_users_used: {
        type: Array,
        default: []
    },
    //TODO Toi da cho phep su dung
    discount_max_uses_per_user: {
        type: Number,
        require: true
    },
    // TODO order toi thieu bao nhieu
    discount_min_order_value: {
        type: Number,
        require: true
    },
    //TODO
    discount_shopId: {
        type: Schema.Types.ObjectId,
        ref: "Shop"
    },
    discount_is_active: {
        type: Boolean,
        default: true
    },
    discount_applies_to: {
        type: String,
        require: true,
        enum: ['all', 'specific']
    },
    //TODO product duoc ap dung
    discount_product_ids: {
        type: Array,
        default: []
    },

}, {
    timestamps: true,
    collection: COLLECTION_NAME
})


module.exports = {
    discount: model(DOCUMENT_NAME, discountSchema),
}