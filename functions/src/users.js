import { hashSync } from 'bcrypt'
import jwt from "jsonwebtoken"
import { db } from './connect.js'
import { salt, secretKey} from '../service_account.js'

export async function login(req, res) {
   const { email, password } = req.body
   if(!email || !password) {
    res.status(400).send({ message: 'Email and password both required'})
   }

   const hashedPassword = hashSunc(password, salt)
   const userResults = await db.collection("users")
   .where("email", "==", email.toLowerCase())
   .where("password", "==", hashedPassword)
   .get()
   
   let user = userResults.docs.map(doc => ({ id: doc.id, ...doc.data() })) [0]
   if(!user){
    res.status(401).send({ mesage: "invalid email and password"})
    return
   }
   delete user.password
   const token = jwt.sign(user, secretKey)
   res.send({ user, token })
}

export async function signup(req,res) {
 const {email, password } = req.body
 if(!email || !password) {
    res.status(400).send({ message: 'Email and Password both required'})
    return
 }

 //check to see if email already exist
 const check = await db.collection("users").where("email", "==", email.toLowerCase()).get()
 if(check.exists) {
res.status(401).send({ message: "email already in use. Please try logging in instead"})
 }
 
 


 const hashedPassword = hashSync(password, salt)
 await db.collection("users")
 .add({ email: email.toLowerCase(), password: hashedPassword})
 login(req,res)
}