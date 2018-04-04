import 'babel-polyfill'
import fetch from 'node-fetch'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { weaveSchemas } from 'graphql-weaver'

if (!process.browser) global.fetch = fetch

const PORT = 3010
const app = express()

const PRIMARY_API = 'https://api.graphcms.com/simple/v1/cjfipt3m23x9i0190pgetwf8c'
const SECONDARY_API = 'https://api.graphcms.com/simple/v1/cjfipwwve7vl901427mf2vkog'
const ALL_ENDPOINTS = [PRIMARY_API, SECONDARY_API]

async function run() {
  const schema = await weaveSchemas({
    endpoints: [
      {
        namespace: 'primary',
        typePrefix: 'Primary',
        url: PRIMARY_API
      },
      {
        namespace: 'secondary',
        typePrefix: 'Secondary',
        url: SECONDARY_API
      }
    ]
  })

  app.use(cors({ allow: '*' }))
  app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }))
  app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))
  app.post('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

  app.listen(PORT, () => {
    console.log(`server running on ${PORT}`)
  })
}

try {
  run()
} catch (e) {
  console.log(e, e.message, e.stack)
}