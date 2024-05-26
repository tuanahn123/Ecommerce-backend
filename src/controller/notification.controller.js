const { SuccessResponse } = require('../core/success.response')
const NotificationService = require('../services/notification.service')

class NotificationController {
    listNotiByUser = async (req, res, nex) => {
        new SuccessResponse({
            message: 'Get list notification success',
            metadata: await NotificationService.listNotiByUser(req.query)
        }).send(res)
    }

}

module.exports = new NotificationController()