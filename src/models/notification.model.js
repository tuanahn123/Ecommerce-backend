const {
    model,
    Schema,
} = require('mongoose');
const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'notifications'
// TODO ORDER-001: order successfully
// TODO ORDER-002: order failed
// TODO PROMOTION-001: new PROMOTION
// TODO SHOP-001: new product by User following
const NotificationSchema = new Schema({
    noti_type: {
        type: String,
        enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'],
        require: true
    },
    noti_senderId: {
        type: Schema.Types.ObjectId,
        ref : "Shop",
        require: true
    },
    noti_receivedId: {
        type: String,
        require: true
    },
    noti_content: {
        type: String,
        require: true
    },
    noti_options: {
        type: Object,
        default: {}
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})


module.exports = {
    "notification": model(DOCUMENT_NAME, NotificationSchema),
}