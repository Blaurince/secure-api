import jwt from "jsonwebtoken"
import { secretKey } from "../service_account.js"

export function validToken(req, res, next) {
    if(!req.headres || !req.headers.authorization){
    res.status(400).send({ message: "security token required"})
}

const decodedToken = jwt.verify(req.headers.authorization, secretKey)
if(!decodedToken){
    res.status(401).send({ message: "invalid security token."})
    return
}
req.decoded = decodedToken
next()

}
export function isAdmin(req, res, next) {
    if(!req.decoded || !req.decoded.userType || req.decoded.userType !== 'admin') {
        res.status(400).send({ message: "Admin access required."})
    }
    next()
}