const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require("./keyToken.services");
const ShopServices = require("./shop.services")
const {
    createTokenPair, verifyJWT
} = require("../auth/authUtils");
const {
    getInfoData
} = require("../utils");
const {
    BadRequestError,
    ConflictRequestError,
    AuthFailureError,
    ForBidenError
} = require("../core/error.response");
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: 'ADMIN'
}
class AccessService {
    static handlerRefreshToken = async (refreshToken) => {
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
        if (foundToken) {
            const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey)
            // TODO Xóa tất cả token trong keys
            await KeyTokenService.deleteKeyById(userId)
            throw new ForBidenError('Something waring happend !! Please relogin')
        }
        // TODO Chưa có
        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
        if (!holderToken) throw new AuthFailureError('Shop not register')
        // TODO verifyToken
        const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)
        // TODO check UserId
        const foundShop = ShopServices.findByEmail({ email })
        if (!foundShop) throw new AuthFailureError('Shop not register')

        const tokens = await createTokenPair({ userId: foundShop._id, email }, holderToken.publicKey, holderToken.privateKey)

        await holderToken.updateOne(
            {
                $set: {
                    refreshToken: tokens.refreshToken
                },
                $addToSet: {
                    refreshTokenUsed: refreshToken // Da duoc su dung de lay token moi roi
                }
            }
        )
        return {
            user: { userId, email },
            tokens
        }

    }

    static logout = async (keyStore) => {
        console.log("keyStore:", keyStore)
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        return delKey
    }
    /*
        TODO 1-Check email 
        TODO 2-Match password 
        TODO 3-Create AT vs RT and save
        TODO 4-generate tokens
        TODO 5-get data return login 
    */
    static login = async ({ email, password, refreshToken = null }) => {
        // 1
        const foundShop = await ShopServices.findByEmail({ email })
        if (!foundShop) throw new BadRequestError('Shop not registerd')
        // 2
        const match = bcrypt.compare(password, foundShop.password)
        if (!match) throw new AuthFailureError('Authentication Error !!')
        // 3
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')
        // 4
        const tokens = await createTokenPair({ userId: foundShop._id, email }, publicKey, privateKey)
        await KeyTokenService.createKeyToken({
            userId: foundShop._id,
            refreshToken: tokens.refreshToken,
            privateKey, publicKey
        })
        return {
            shop: getInfoData({
                fileds: ['_id', 'name', 'email'],
                object: foundShop
            }),
            tokens
        }
    }

    static signUp = async ({
        name,
        email,
        password
    }) => {
        try {
            // TODO step1 Check email exits;
            const holderShop = await shopModel.findOne({
                email
            }).lean();
            if (holderShop) {
                throw new BadRequestError('Error: Shop already rigistered!')
            }
            const passwordHash = await bcrypt.hash(password, 10);
            const newShop = await shopModel.create({
                name,
                email,
                password: passwordHash,
                roles: [RoleShop.SHOP]
            })
            if (newShop) {
                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')
                //Save coileection KeyStore
                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })
                if (!keyStore) {
                    throw new BadRequestError('Error: Key Store Error!')

                }
                // create token pair
                const tokens = await createTokenPair({
                    userId: newShop._id,
                    email
                }, publicKey, privateKey)
                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({
                            fileds: ['_id', 'name', 'email'],
                            object: newShop
                        }),
                        tokens
                    }
                }
            }
            return {
                code: 200,
                metadata: null
            }
        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService