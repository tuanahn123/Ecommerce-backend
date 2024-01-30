const { notification } = require("../models/notification.model")

class NotificationService {
    static async pushNotiToSystem({
        type = "SHOP-001",
        receivedId = 1,
        senderId = 1,
        option = {}
    }) {
        let noti_content
        if (type == 'SHOP-001') {
            noti_content = `@@@ Vua them mot san pham @@@@`
        } else if (type == 'PROMOTION-002') {
            noti_content = `@@@ Vua them mot voucher @@@@`
        }
        const newNoti = await notification.create({
            noti_type: type,
            noti_content,
            noti_senderId: senderId,
            noti_receivedId: receivedId,
            noti_options: option
        })

        return newNoti
    }

    static async listNotiByUser({
        userId = "1",
        type = 'ALL',
        isRead = 0
    }) {
        const match = { noti_receivedId: userId }
        if (type != 'ALL') {
            match['noti_type'] = type
        }
        return await notification.aggregate([
            {
                $match: match
            }, {
                $project: {
                    noti_type: 1,
                    noti_senderId: 1,
                    noti_receivedId: 1,
                    noti_content: {
                        $concat: [
                            {
                                $substr: ['$noti_options.shop_name', 0, -1]
                            },
                            "Vừa thêm một sản phẩm mới: ",
                            {
                                $substr: ['$noti_options.product_name', 0, -1]
                            },
                        ]
                    },
                    noti_options: 1,

                    createdAt: 1
                }
            }
        ])
    }
}

module.exports = NotificationService
