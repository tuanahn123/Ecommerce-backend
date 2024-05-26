const { filter } = require("lodash")
const keyTokenSchema = require("../models/keytoken.model")
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
            const tokens = await keyTokenSchema.findOneAndUpdate(filter, update, options)
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
        return await keyTokenSchema.findOne({ user: new Types.ObjectId(userId) }).lean()

    }
    static removeKeyById = async (id) => {
        return await keyTokenSchema.deleteOne(id);
    }
    static findByRefreshTokenUsed = async (refeshToken) => {
        return await keyTokenSchema.findOne({ refreshTokenUsed: refeshToken }).lean();
    }
    static findByRefreshToken = async (refeshToken) => {
        return await keyTokenSchema.findOne({ refreshToken: refeshToken });
    }
    static deleteKeyById = async (userId) => {
        return await keyTokenSchema.deleteOne({ user: userId });
    }
}
module.exports = KeyTokenService