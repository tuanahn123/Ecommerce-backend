const { getSelectData, UngetSelectData } = require("../../utils")


const findAllDiscountCodeUnselect = async ({
    limit = 50, page = 1, sort = 'ctime', filter, unSelect, model
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const documents = await model.find(filter)
        .sort(sortBy) //TODO sort theo ctime
        .skip(skip) //TODO skip
        .limit(limit) //TODO limit
        .select(UngetSelectData(unSelect)).lean() // TODO select fields

    return documents
}
const findAllDiscountCodeselect = async ({
    limit = 50, page = 1, sort = 'ctime', filter, select, model
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const documents = await model.find(filter)
        .sort(sortBy) //TODO sort theo ctime
        .skip(skip) //TODO skip
        .limit(limit) //TODO limit
        .select(getSelectData(select)).lean() // TODO select fields

    return documents
}
const checkDiscountExists = async ({model, filter}) => {
    return await model.findOne(filter).lean()
}
module.exports = {
    findAllDiscountCodeUnselect,
    findAllDiscountCodeselect,
    checkDiscountExists
}