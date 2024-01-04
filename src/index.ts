import 'module-alias/register'

import bodyParser from 'body-parser'
import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

import routes from '@/routes/index'

import '@/database/connections'
import cors from 'cors'


const PORT = process.env.PORT || 8080;

const app = express()
app.use(bodyParser.json());
app.use(cors());
app.use(routes);
app.listen(PORT, () => {
  console.log(`server running in port ${PORT}`);
})


