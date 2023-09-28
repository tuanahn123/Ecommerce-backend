const { filter } = require("lodash")
const keytokenModel = require("../models/keytoken.model")
const { Types } = require('mongoose')
class KeyTokenService {
    static createKeyToken = async ({
        userId,
        publicKey,
        privateKey,
        refreshToken
    }) => {
        try {
            const filter = { user: userId }, update = {
                publicKey, privateKey, refreshTokenUsed: [], refreshToken
            }, options = { upsert: true, new: true }
            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey : null
        } catch (error) {
            return {
                code: "xxx",
                message: error.message,
                status: 'error'
            }
        }
    }
    static findByUserId = async (userId) => {
        return await keytokenModel.findOne({ user: new Types.ObjectId(userId) }).lean()

    }
    static removeKeyById = async (id) => {
        return await keytokenModel.deleteOne(id);
    }
    static findByRefreshTokenUsed = async (refeshToken) => {
        return await keytokenModel.findOne({ refreshTokenUsed: refeshToken }).lean();
    }
    static findByRefreshToken = async (refeshToken) => {
        return await keytokenModel.findOne({ refreshToken: refeshToken });
    }
    static deleteKeyById = async (userId) => {
        return await keytokenModel.deleteOne({ user: userId });
    }
}
module.exports = KeyTokenService