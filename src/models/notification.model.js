const {
    model,
    Schema,
} = require('mongoose');
const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'Notifications'
// ORDER-001: order Success
// ORDER-002: order Failed
// PROMOTION-001: new PROMOTION
// SHOP-001: new Product by USer following
const notificationSchema = new Schema({
    noti_type: {
        type: String,
        enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'],
        require: true
    },
    noti_senderId: { type: String, required: true },
    noti_receiverId: { type: String, required: true },
    noti_content: { type: String, required: true },
    noti_options: { type: Object, default: {} },

}, {
    timestamps: true,
    collection: COLLECTION_NAME
})


module.exports = {
    Notification: model(DOCUMENT_NAME, notificationSchema),
}