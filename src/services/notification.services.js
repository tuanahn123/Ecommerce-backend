const { BadRequestError, NotFoundError } = require("../core/error.response")
const { Notification } = require("../models/notification.model")

class NotificationService {
    //! Start REPO CART
    static async pushNotiToSystem({
        type = 'SHOP-001',
        receivedId = 1,
        senderId = 1,
        options = {}
    }) {
        let noti_content
        if (type == 'SHOP-001') {
            noti_content = `@@@ vua moi them mot san pham: @@@@`
        }
        else if (type == 'SHOP-002') {
            noti_content = `@@@ vua them ot voucher: @@@@@`
        }
        const newNoti = Notification.create({
            noti_type: type,
            noti_content: noti_content,
            noti_received_id: receivedId,
            noti_sender_id: senderId,
            noti_options: options
        })
        return newNoti
    }

}

module.exports = NotificationService
