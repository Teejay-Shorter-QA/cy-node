import cors from 'cors'
import express, { json } from 'express'

const server = express()
server.use(
  cors({
    origin: 'http://localhost:3000'
  })
)
server.use(json())

server.get('/', (_req, res) => {
  res.status(200).json({ message: 'Server is running!' })
})

server.post(
  '/auth/fake-token',
  (
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const token = `Bearer ${new Date().toISOString()}`
      res.status(200).json({ token, status: 200 })
      return
    } catch (error) {
      next(error)
    }
  }
)

export { server }
