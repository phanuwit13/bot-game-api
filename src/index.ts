import { ApiException, fromHono } from 'chanfana'
import { Hono } from 'hono'
import { ContentfulStatusCode } from 'hono/utils/http-status'
import { game } from './services/game'

// CORS headers configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Start a Hono app
const app = new Hono<{ Bindings: Env }>()

// Add CORS middleware
app.use('*', async (c, next) => {
  c.header(
    'Access-Control-Allow-Origin',
    corsHeaders['Access-Control-Allow-Origin']
  )
  c.header(
    'Access-Control-Allow-Methods',
    corsHeaders['Access-Control-Allow-Methods']
  )
  c.header(
    'Access-Control-Allow-Headers',
    corsHeaders['Access-Control-Allow-Headers']
  )

  // Handle preflight requests
  if (c.req.method === 'OPTIONS') {
    return c.text('')
  }

  await next()
})

app.onError((err, c) => {
  if (err instanceof ApiException) {
    // If it's a Chanfana ApiException, let Chanfana handle the response
    return c.json(
      { success: false, errors: err.buildResponse() },
      err.status as ContentfulStatusCode
    )
  }

  console.error('Global error handler caught:', err) // Log the error if it's not known

  // For other errors, return a generic 500 response
  return c.json(
    {
      success: false,
      errors: [{ code: 7000, message: 'Internal Server Error' }],
    },
    500
  )
})

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: '/',
  schema: {
    info: {
      title: 'My Game API',
      version: '2.0.0',
      description: 'This is the documentation for my Game API.',
    },
  },
})

// Register Tasks Sub router

openapi.post('/game', game)

// Export the Hono app
export default app
