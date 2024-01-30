const JWT = require('jsonwebtoken')
const asyncHandler = require('../helpers/asyncHandler')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const KeyTokenService = require('../services/keyToken.services')


const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
}
const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // accessToken
        console.log(publicKey)
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days'
        })
        //refeshToken
        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days'
        })

        // Verify
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.err('error verify', err)
            }
            else {
                console.log(`decode verify`, decode)
            }
        })
        return { accessToken, refreshToken }
    } catch (error) {
        console.log(error)
    }
}
const authentication = asyncHandler(async (req, res, next) => {
    /*
        ! 1- Check userId missing ?
        ! 2- get accessToken
        ! 3- verifyToken
        ! 4- check user in dbs
        !5- check keyStore with this UserId
        !6- Ok all => return next
     */
    //!1
    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) throw new AuthFailureError('Invalid Request')
    //!2
    const keyStore = await KeyTokenService.findByUserId(userId)
    if (!keyStore) throw new NotFoundError('Not found keyStore')
    //!3
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new AuthFailureError('Invalid Request')
    //!4
    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId')
        req.keyStore = keyStore
        req.user = decodeUser
        return next()
    } catch (error) {
        throw error
    }
})

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)
}
module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
}