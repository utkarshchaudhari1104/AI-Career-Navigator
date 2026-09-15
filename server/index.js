import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

dotenv.config()

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai-career'

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json())

const profileSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    college: String,
    degree: String,
    branch: String,
    currentYear: String,
    graduationYear: Number,
    cgpa: Number,
    location: String,
    skills: Array,
    interests: Array,
    careerPreferences: Object,
  },
  { timestamps: true },
)

const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'AI Career Navigator API is running' })
})

app.get('/api/profile', async (_req, res) => {
  try {
    const profile = await Profile.findOne().sort({ createdAt: -1 })
    if (!profile) {
      return res.status(404).json({ message: 'No profile found' })
    }
    return res.json(profile)
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch profile', error: String(error) })
  }
})

app.post('/api/profile', async (req, res) => {
  try {
    const profile = await Profile.create(req.body)
    return res.status(201).json(profile)
  } catch (error) {
    return res.status(500).json({ message: 'Failed to save profile', error: String(error) })
  }
})

app.get('/api/careers', async (_req, res) => {
  try {
    const careers = [
      { id: 'ai-ml-engineer', title: 'AI/ML Engineer', match: 92 },
      { id: 'data-scientist', title: 'Data Scientist', match: 87 },
      { id: 'frontend-developer', title: 'Frontend Developer', match: 81 },
    ]
    return res.json(careers)
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch careers', error: String(error) })
  }
})

app.get('/api/recommendations', async (_req, res) => {
  try {
    return res.json({
      recommended: [
        { careerId: 'ai-ml-engineer', score: 92 },
        { careerId: 'data-scientist', score: 87 },
      ],
    })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch recommendations', error: String(error) })
  }
})

const serveFrontend = () => {
  const distPath = path.resolve(__dirname, '../dist')
  app.use(express.static(distPath))
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
      return next()
    }
    return res.sendFile(path.join(distPath, 'index.html'))
  })
}

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 3000 })
    console.log('MongoDB connected successfully')
    serveFrontend()
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('MongoDB connection failed:', error)
    console.log('Starting API without MongoDB connection for local demo mode')
    serveFrontend()
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT} in demo mode`)
    })
  }
}

startServer()
