import functions from "firebase-functions"
import express from 'express'
import cors from 'cors'
import { login, signup } from './src/users/js'
import { validToken , isAdmin } from "./src/middleware"



const app = express()
app.use(cors({ origin: [
    'http://localhost',
    'https://bocacode.com'
]})) // allows only website to talk to api

app.post('/login', login)
app.post('/signup', signup) 

app.get('/secretinfo', validToken, (req,res)  => res.send({ message: "You made it"}))
app.get('supersecretinfo', validToken, isAdmin, (req, res) => res.send({ message: "You made it here too!"}))

app.listen(3030, () => console.log('listening on port 3030...')) // for testing

export const api = functions.https.onRequest(app) // for deploying