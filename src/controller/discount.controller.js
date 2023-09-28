const { SuccessRespone } = require('../core/success.response')
const DiscountServices = require('../services/discount.services')

class DiscountController {
    createDiscountCode = async (req, res, nex) => {
        new SuccessRespone({
            message: 'Success Code Generations',
            metadata: await DiscountServices.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }
    updateDiscountCode = async (req, res, nex) => {
        console.log(req.params)
        new SuccessRespone({
            message: 'Success Code Generations',
            metadata: await DiscountServices.updateDiscountCode({
                discount_code: req.params.code,
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }
    getAllDiscountCode = async (req, res, nex) => {
        new SuccessRespone({
            message: 'Get All Discount Code Success',
            metadata: await DiscountServices.getAllDiscountCodesByShop({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res)
    }
    getDiscountAmount = async (req, res, nex) => {
        new SuccessRespone({
            message: 'Get Discount Amount Success',
            metadata: await DiscountServices.getDiscountAmount({
                ...req.body,
            })
        }).send(res)
    }
    getAllDiscountCodesWithProduct = async (req, res, nex) => {
        new SuccessRespone({
            message: 'Get All Discount Codes With Product Success',
            metadata: await DiscountServices.getAllDiscountCodesWithProduct({
                ...req.query,
            })
        }).send(res)
    }
}

module.exports = new DiscountController()