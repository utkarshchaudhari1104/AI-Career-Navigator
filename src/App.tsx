import { useEffect, useMemo, useState } from 'react'
import {
  BrowserRouter,
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom'
import {
  BarChart3,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronRight,
  Compass,
  Cpu,
  Bell,
  Eye,
  HelpCircle,
  Mail,
  LayoutDashboard,
  LogOut,
  Menu,
  Rocket,
  Settings,
  Sparkles,
  ShieldCheck,
  Target,
  TrendingUp,
  User,
  Users,
  X,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
} from 'recharts'
import { allCareers, assessmentQuestions, companies } from './data/sampleData'
import {
  analyzeCareerProfile,
  analyzeSkillGap,
  generateLearningRoadmap,
  recommendCareers,
  recommendCompanies,
} from './services/aiService'
import type { Proficiency, StudentProfile } from './types'

const defaultProfile: StudentProfile = {
  id: 'student-1',
  name: 'Aarav Sharma',
  age: 20,
  location: 'Bengaluru, India',
  email: 'aarav@student.com',
  college: 'VIT Vellore',
  degree: 'B.Tech',
  branch: 'Computer Science',
  currentYear: '3rd Year',
  graduationYear: 2027,
  cgpa: 8.9,
  skills: [
    { name: 'Python', proficiency: 'Advanced' },
    { name: 'JavaScript', proficiency: 'Intermediate' },
    { name: 'React', proficiency: 'Intermediate' },
    { name: 'SQL', proficiency: 'Intermediate' },
    { name: 'Node.js', proficiency: 'Beginner' },
    { name: 'Machine Learning', proficiency: 'Beginner' },
  ],
  interests: ['Artificial Intelligence', 'Web Development', 'Data Science'],
  experience: [
    { type: 'Project', title: 'Campus Placement Portal', summary: 'Built a student dashboard application using React and Node.js.' },
    { type: 'Certification', title: 'Google Data Analytics', summary: 'Completed foundations in analytics and data handling.' },
  ],
  careerPreferences: {
    preferredRole: 'AI/ML Engineer',
    preferredIndustry: 'Technology',
    preferredLocation: 'Bengaluru',
    workMode: 'Hybrid',
    salaryRange: '₹8L - ₹15L',
    companySize: 'Mid-size',
    higherStudiesOrJob: 'Job',
  },
}

const storageKeys = {
  user: 'acn-user',
  profile: 'acn-profile',
  accounts: 'acn-accounts',
  welcomeMode: 'acn-welcome-mode',
  answers: 'acn-assessment-answers',
  roadmap: 'acn-roadmap',
}

type StoredAccount = {
  email: string
  password: string
  profile: StudentProfile
}

const skillOptions = [
  'Python',
  'Java',
  'C++',
  'JavaScript',
  'React',
  'Node.js',
  'SQL',
  'MongoDB',
  'Machine Learning',
  'Artificial Intelligence',
  'Data Science',
  'Data Analytics',
  'Cloud Computing',
  'Cybersecurity',
  'DevOps',
  'UI/UX',
  'Other',
]

const interestOptions = [
  'Artificial Intelligence',
  'Machine Learning',
  'Web Development',
  'Software Development',
  'Data Science',
  'Data Analytics',
  'Cybersecurity',
  'Cloud',
  'Robotics',
  'Business/Management',
  'Research',
]

function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  const value = window.localStorage.getItem(key)
  return value ? (JSON.parse(value) as T) : fallback
}

function saveToStorage<T>(key: string, value: T) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, JSON.stringify(value))
  }
}

function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  )
}

function MainApp() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState<string | null>(() => getFromStorage(storageKeys.user, null))
  const [isNewUser, setIsNewUser] = useState(() => getFromStorage<string>(storageKeys.welcomeMode, 'returning') === 'new')
  const [profile, setProfile] = useState<StudentProfile>(() => getFromStorage(storageKeys.profile, defaultProfile))
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, string | number>>(() => getFromStorage(storageKeys.answers, {}))
  const [roadmapState, setRoadmapState] = useState<Record<string, boolean>>(
    () => getFromStorage(storageKeys.roadmap, { 'Phase 1': false, 'Phase 2': false, 'Phase 3': false }),
  )

  const recommendations = useMemo(() => recommendCareers(profile), [profile])
  const dashboard = useMemo(() => analyzeCareerProfile(profile), [profile])
  const skillGap = useMemo(() => analyzeSkillGap(profile, recommendations[0]?.careerId ?? 'ai-ml-engineer'), [profile, recommendations])

  const updateProfile = (nextProfile: StudentProfile) => {
    setProfile(nextProfile)
    setCurrentUser(nextProfile.name)
    saveToStorage(storageKeys.profile, nextProfile)
    saveToStorage(storageKeys.user, nextProfile.name)
    const accounts = getFromStorage<StoredAccount[]>(storageKeys.accounts, [])
    saveToStorage(storageKeys.accounts, accounts.map((account) => account.email === profile.email.trim().toLowerCase() ? { ...account, email: nextProfile.email.trim().toLowerCase(), profile: nextProfile } : account))
  }

  const handleAuth = (nextProfile: StudentProfile, password?: string) => {
    setProfile(nextProfile)
    setCurrentUser(nextProfile.name)
    setIsNewUser(Boolean(password))
    saveToStorage(storageKeys.profile, nextProfile)
    saveToStorage(storageKeys.user, nextProfile.name)
    saveToStorage(storageKeys.welcomeMode, password ? 'new' : 'returning')
    if (password) {
      const accounts = getFromStorage<StoredAccount[]>(storageKeys.accounts, [])
      const nextAccount = { email: nextProfile.email.trim().toLowerCase(), password, profile: nextProfile }
      saveToStorage(storageKeys.accounts, [...accounts.filter((account) => account.email !== nextAccount.email), nextAccount])
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setIsNewUser(false)
    window.localStorage.removeItem(storageKeys.user)
    window.localStorage.removeItem(storageKeys.welcomeMode)
    navigate('/login')
  }

  const updateRoadmap = (phaseId: string, value: boolean) => {
    const next = { ...roadmapState, [phaseId]: value }
    setRoadmapState(next)
    saveToStorage(storageKeys.roadmap, next)
  }

  const routeShell = (page: React.ReactNode) => (
    <div className="h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="page-shell mx-auto flex h-screen max-w-[1520px] overflow-hidden">
        <Sidebar currentUser={currentUser} onLogout={handleLogout} />
        <main className="min-w-0 flex-1 overflow-y-auto bg-slate-900/50 p-4 md:p-8">{page}</main>
      </div>
    </div>
  )

  return (
    <Routes>
      <Route path="/" element={<LandingPage currentUser={currentUser} />} />
      <Route path="/login" element={<AuthPage mode="login" onAuth={handleAuth} currentUser={currentUser} />} />
      <Route path="/register" element={<AuthPage mode="register" onAuth={handleAuth} currentUser={currentUser} />} />
      <Route path="/profile" element={routeShell(<ProfileSetupPage profile={profile} updateProfile={updateProfile} />)} />
      <Route path="/assessment" element={routeShell(<AssessmentPage answers={assessmentAnswers} setAnswers={setAssessmentAnswers} />)} />
      <Route path="/dashboard" element={routeShell(<DashboardPage profile={profile} dashboard={dashboard} recommendations={recommendations} isNewUser={isNewUser} />)} />
      <Route path="/careers" element={routeShell(<CareerExplorerPage />)} />
      <Route path="/careers/:careerId" element={routeShell(<CareerDetailPage profile={profile} />)} />
      <Route path="/skill-gap" element={routeShell(<SkillGapPage skillGap={skillGap} />)} />
      <Route path="/roadmap" element={routeShell(<RoadmapPage careerId={recommendations[0]?.careerId ?? 'ai-ml-engineer'} roadmapState={roadmapState} updateRoadmap={updateRoadmap} />)} />
      <Route path="/companies" element={routeShell(<CompaniesPage profile={profile} />)} />
      <Route path="/companies/:companyId" element={routeShell(<CompanyDetailPage />)} />
      <Route path="/hiring-map" element={routeShell(<HiringMapPage profile={profile} />)} />
      <Route path="/progress" element={routeShell(<ProgressPage profile={profile} dashboard={dashboard} />)} />
      <Route path="/resume" element={routeShell(<ResumePage profile={profile} />)} />
      <Route path="/settings" element={routeShell(<SettingsPage />)} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function Sidebar({ currentUser, onLogout }: { currentUser: string | null; onLogout: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/profile', label: 'My Profile', icon: User },
    { to: '/assessment', label: 'Career Assessment', icon: Target },
    { to: '/careers', label: 'Career Explorer', icon: Compass },
    { to: '/skill-gap', label: 'Skill Gap', icon: BarChart3 },
    { to: '/roadmap', label: 'Learning Roadmap', icon: Rocket },
    { to: '/companies', label: 'Companies', icon: Users },
    { to: '/progress', label: 'Progress', icon: TrendingUp },
    { to: '/settings', label: 'Settings', icon: Settings },
  ]

  const sideContent = (
    <aside className="flex h-full w-full flex-col border-r border-slate-700/80 bg-slate-950/80 p-5">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 p-2.5 shadow-lg shadow-cyan-500/20"><Sparkles className="h-5 w-5 text-white" /></div>
        <div><p className="text-xl font-bold text-white">AI Career</p><p className="text-xs text-slate-400">Navigator</p></div>
      </div>
      <nav className="space-y-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${isActive ? 'bg-cyan-500/15 text-cyan-300' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`} onClick={() => setMobileOpen(false)}>
            <Icon className="h-4 w-4" />{label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto border-t border-slate-700 pt-5">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-800/60 p-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/20 text-sm font-semibold text-cyan-200">{currentUser?.charAt(0)?.toUpperCase() ?? 'S'}</div><div><p className="text-sm font-medium text-white">{currentUser ?? 'Student'}</p><p className="text-xs text-slate-400">Career profile</p></div></div>
        <button type="button" onClick={onLogout} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 transition hover:border-red-500 hover:text-red-300"><LogOut className="h-4 w-4" />Logout</button>
      </div>
    </aside>
  )

  return (
    <>
      <div className="sticky top-0 hidden h-screen w-72 shrink-0 lg:block">{sideContent}</div>
      <div className="lg:hidden">
        <button
          type="button"
          className="fixed left-4 top-4 z-50 rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-200"
          onClick={() => setMobileOpen((value) => !value)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        {mobileOpen && <div className="fixed inset-0 z-40 bg-slate-950/90 p-4 pt-20">{sideContent}</div>}
      </div>
    </>
  )
}

function LandingPage({ currentUser }: { currentUser: string | null }) {
  const stats = [
    { label: 'Career matches', value: '92%' },
    { label: 'Students guided', value: '24k+' },
    { label: 'Skill gaps tracked', value: '16k' },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 p-2.5 shadow-lg shadow-cyan-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-xl font-bold text-white">AI Career Navigator</p>
          </div>
        </div>
        <nav className="hidden items-center gap-8 text-sm text-slate-200 md:flex">
          <Link to="/">Home</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/dashboard">Features</Link>
          <Link to="/companies">Companies</Link>
          <Link to="/resume">About</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link to={currentUser ? '/dashboard' : '/login'} className="rounded-full border border-slate-700/80 bg-slate-900/60 px-4 py-2 text-sm text-slate-200 hover:border-cyan-500 hover:text-white">
            {currentUser ? 'Dashboard' : 'Login'}
          </Link>
          <Link to="/login" className="premium-button rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-cyan-500/20">
            Login
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-16 pt-10">
        <section className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <div className="premium-pill mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-cyan-200">
              <Target className="h-3.5 w-3.5" />
              AI-powered career planning
            </div>
            <h1 className="max-w-xl text-5xl font-black tracking-tight text-white md:text-6xl">
              Navigate Your Career with AI
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-300">
              Discover the right career path, identify the skills you need, and build a personalized roadmap to reach your dream job.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/login" className="premium-button rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 font-medium text-white shadow-lg shadow-cyan-500/20">
                Login
              </Link>
              <a href="#platform" className="rounded-full border border-slate-700/80 bg-slate-900/60 px-5 py-3 font-medium text-slate-200 hover:border-slate-500 hover:text-white">
                View Platform
              </a>
            </div>
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-4">
              {stats.map((item) => (
                <div key={item.label} className="glass-card rounded-2xl p-4">
                  <p className="text-2xl font-bold text-white">{item.value}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-cyan-500/20 to-blue-600/20 blur-3xl" />
            <div className="glass-card rounded-[2rem] p-6 shadow-2xl shadow-slate-950/40">
              <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Career Match</p>
                    <p className="text-3xl font-bold text-white">92%</p>
                  </div>
                  <div className="rounded-xl bg-emerald-500/15 p-2 text-emerald-300">
                    <TrendingUp className="h-7 w-7" />
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    ['AI/ML Engineer', '92%'],
                    ['Data Scientist', '87%'],
                    ['Python Developer', '81%'],
                  ].map(([job, score]) => (
                    <div key={job} className="rounded-xl border border-slate-700/80 bg-slate-800/70 p-3">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-white">{job}</span>
                        <span className="text-cyan-300">{score}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-700">
                        <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600" style={{ width: score }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="platform" className="mt-20 scroll-mt-8">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Features</p>
            <h2 className="mt-3 text-3xl font-bold text-white">Everything you need to plan your future</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ['AI Career Recommendations', 'Get tailored career suggestions based on your profile and interests.'],
              ['Skill Gap Analysis', 'Compare your current skills to dream roles and focus on the right learning areas.'],
              ['Personalized Learning Roadmap', 'Follow a guided plan with projects, phases, and milestones.'],
              ['Company Recommendations', 'Discover employers that match your strengths and career goals.'],
              ['Job & Internship Discovery', 'Explore realistic sample opportunities to build experience early.'],
              ['Career Progress Tracking', 'Track readiness, skills learned, and roadmap completion in one place.'],
            ].map(([title, text], index) => (
              <div key={title} className="glass-card rounded-2xl p-5 shadow-lg shadow-slate-950/20 transition hover:-translate-y-1 hover:border-cyan-500/40">
                <div className="mb-4 inline-flex rounded-xl bg-cyan-500/10 p-3 text-cyan-300">
                  {index % 2 === 0 ? <Cpu className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                </div>
                <h3 className="text-xl font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">How it works</p>
            <h2 className="mt-3 text-3xl font-bold text-white">A simple 4-step career growth system</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-4">
            {[
              'Build Your Profile',
              'Complete Career Assessment',
              'Get AI Recommendations',
              'Follow Your Career Roadmap',
            ].map((step, index) => (
              <div key={step} className="glass-card rounded-2xl p-5 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/15 text-lg font-bold text-cyan-200">
                  {index + 1}
                </div>
                <p className="text-lg font-semibold text-white">{step}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

function AuthPage({ mode, onAuth, currentUser }: { mode: 'login' | 'register'; onAuth: (profile: StudentProfile, password?: string) => void; currentUser: string | null }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', password: '', age: '', location: '', college: '', degree: 'B.Tech', branch: 'Computer Science',
    currentYear: '3rd Year', graduationYear: '2027', cgpa: '', preferredRole: '', preferredIndustry: '', preferredLocation: '',
    workMode: 'Hybrid' as 'Remote' | 'Hybrid' | 'On-site', salaryRange: '', companySize: 'Mid-size', higherStudiesOrJob: 'Job' as 'Job' | 'Higher Studies' | 'Both',
  })
  const [skills, setSkills] = useState<string[]>([])
  const [skillLevels, setSkillLevels] = useState<Record<string, Proficiency>>({})
  const [interests, setInterests] = useState<string[]>([])
  const [targetRoleChoice, setTargetRoleChoice] = useState('')
  const [preferredIndustryChoice, setPreferredIndustryChoice] = useState('')
  const [locationChoice, setLocationChoice] = useState('')
  const [authError, setAuthError] = useState('')

  const isRegister = mode === 'register'

  useEffect(() => {
    setAuthError('')
    if (mode === 'register') {
      setForm((current) => ({ ...current, email: '', password: '' }))
    }
  }, [mode])

  if (currentUser && !isRegister) {
    return <Navigate to="/dashboard" replace />
  }

  const updateForm = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }))

  const toggleSkill = (skill: string) => {
    setSkills((current) => current.includes(skill) ? current.filter((item) => item !== skill) : [...current, skill])
    setSkillLevels((current) => current[skill] ? current : { ...current, [skill]: 'Beginner' })
  }
  const toggleInterest = (interest: string) => setInterests((current) => current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isRegister) {
      const email = form.email.trim().toLowerCase()
      const accounts = getFromStorage<StoredAccount[]>(storageKeys.accounts, [])
      const account = accounts.find((item) => item.email === email)
      if (!account) {
        setAuthError('No user found with this email. Please create a new account below.')
        return
      }
      if (account.password !== form.password) {
        setAuthError('The password is incorrect. Please try again.')
        return
      }
      setAuthError('')
      onAuth(account.profile)
      navigate('/dashboard')
      return
    }
    const email = form.email.trim().toLowerCase()
    const accounts = getFromStorage<StoredAccount[]>(storageKeys.accounts, [])
    if (accounts.some((account) => account.email === email)) {
      setAuthError('An account already exists for this email. Please log in instead.')
      return
    }
    const nextProfile: StudentProfile = {
      id: `student-${Date.now()}`,
      name: form.name.trim() || 'Student User',
      age: Number(form.age) || 18,
      location: locationChoice === 'Other' ? form.location : locationChoice,
      email: form.email,
      college: form.college,
      degree: form.degree,
      branch: form.branch,
      currentYear: form.currentYear,
      graduationYear: Number(form.graduationYear) || new Date().getFullYear() + 1,
      cgpa: Number(form.cgpa) || 0,
      skills: skills.map((name) => ({ name, proficiency: skillLevels[name] ?? 'Beginner' })),
      interests,
      experience: [],
      careerPreferences: {
        preferredRole: targetRoleChoice === 'Other' ? form.preferredRole : targetRoleChoice,
        preferredIndustry: preferredIndustryChoice === 'Other' ? form.preferredIndustry : preferredIndustryChoice,
        preferredLocation: form.preferredLocation || form.location,
        workMode: form.workMode,
        salaryRange: form.salaryRange,
        companySize: form.companySize,
        higherStudiesOrJob: form.higherStudiesOrJob,
      },
    }
    onAuth(nextProfile, form.password)
    navigate('/dashboard')
  }

  const fieldClass = 'w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-3 py-2.5 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10'
  const labelClass = 'space-y-2 text-sm text-slate-300'

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <div className={`glass-card grid w-full overflow-hidden rounded-[2rem] shadow-2xl shadow-slate-950/60 ${isRegister ? 'max-w-6xl' : 'max-w-5xl lg:grid-cols-2'}`}>
        <div className="hidden bg-gradient-to-br from-cyan-500/20 via-blue-600/10 to-slate-900 p-8 lg:block">
          <div className="flex h-full flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 p-2.5 shadow-lg shadow-cyan-500/20">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <p className="text-xl font-bold text-white">AI Career Navigator</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">Plan a smarter future</p>
              <p className="mt-3 max-w-sm text-slate-300">
                Build your profile, discover the right roles, and turn your skills into a career roadmap.
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">{isRegister ? 'Create account' : 'Welcome back'}</p>
            <h2 className="mt-3 text-3xl font-bold text-white">{isRegister ? 'Register as a student' : 'Login to your account'}</h2>
          </div>

          <form className="space-y-6" onSubmit={submit}>
            {isRegister ? (
              <>
                <section>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">01 / About you</p>
                  <div className="grid gap-4 md:grid-cols-3">
                    <label className={labelClass}><span>Full name</span><input value={form.name} onChange={(e) => updateForm('name', e.target.value)} className={fieldClass} placeholder="Your name" required /></label>
                    <label className={labelClass}><span>Email address</span><input type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} className={fieldClass} placeholder="you@example.com" required /></label>
                    <label className={labelClass}><span>Password</span><input type="password" value={form.password} onChange={(e) => updateForm('password', e.target.value)} className={fieldClass} placeholder="Create a password" required /></label>
                    <label className={labelClass}><span>Age</span><input type="number" min="13" value={form.age} onChange={(e) => updateForm('age', e.target.value)} className={fieldClass} placeholder="20" required /></label>
                    <label className={labelClass}><span>City / location</span><select value={locationChoice} onChange={(e) => { setLocationChoice(e.target.value); if (e.target.value !== 'Other') updateForm('location', e.target.value) }} className={fieldClass} required><option value="">Select your city or location</option><option>Bengaluru</option><option>Hyderabad</option><option>Pune</option><option>Mumbai</option><option>Delhi NCR</option><option>Chennai</option><option>Kolkata</option><option>Remote</option><option value="Other">Other</option></select>{locationChoice === 'Other' && <input value={form.location} onChange={(e) => updateForm('location', e.target.value)} className={fieldClass} placeholder="Type your city or location" required />}</label>
                    <label className={labelClass}><span>College or school</span><input value={form.college} onChange={(e) => updateForm('college', e.target.value)} className={fieldClass} placeholder="Institution name" required /></label>
                  </div>
                </section>

                <section>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">02 / Education</p>
                  <div className="grid gap-4 md:grid-cols-3">
                    <label className={labelClass}><span>Degree / level</span><select value={form.degree} onChange={(e) => updateForm('degree', e.target.value)} className={fieldClass}><option>B.Tech</option><option>B.E.</option><option>B.Sc</option><option>M.Sc</option><option>School</option><option>Other</option></select></label>
                    <label className={labelClass}><span>Branch / stream</span><input value={form.branch} onChange={(e) => updateForm('branch', e.target.value)} className={fieldClass} placeholder="Computer Science" required /></label>
                    <label className={labelClass}><span>Current year</span><input value={form.currentYear} onChange={(e) => updateForm('currentYear', e.target.value)} className={fieldClass} placeholder="3rd Year" required /></label>
                    <label className={labelClass}><span>Graduation year</span><input type="number" value={form.graduationYear} onChange={(e) => updateForm('graduationYear', e.target.value)} className={fieldClass} required /></label>
                    <label className={labelClass}><span>CGPA / percentage</span><input type="number" step="0.1" value={form.cgpa} onChange={(e) => updateForm('cgpa', e.target.value)} className={fieldClass} placeholder="8.5" required /></label>
                  </div>
                </section>

                <section>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">03 / Skills and interests</p>
                  <div className="grid gap-5 lg:grid-cols-2">
                    <div><span className="mb-2 block text-sm text-slate-300">Skills you already have</span><div className="flex flex-wrap gap-2">{skillOptions.filter((skill) => skill !== 'Other').map((skill) => <button key={skill} type="button" onClick={() => toggleSkill(skill)} className={`rounded-full px-3 py-1.5 text-xs ${skills.includes(skill) ? 'bg-cyan-400 text-slate-950' : 'border border-slate-700 bg-slate-950 text-slate-300'}`}>{skill}</button>)}</div>{skills.length > 0 && <div className="mt-4 space-y-2"><p className="text-xs text-slate-400">Set proficiency for each selected skill</p>{skills.map((skill) => <div key={skill} className="flex items-center justify-between gap-3 rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2"><span className="text-sm text-white">{skill}</span><select value={skillLevels[skill] ?? 'Beginner'} onChange={(e) => setSkillLevels((current) => ({ ...current, [skill]: e.target.value as Proficiency }))} className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div>)}</div>}</div>
                    <div><span className="mb-2 block text-sm text-slate-300">Industries and topics that interest you</span><div className="flex flex-wrap gap-2">{interestOptions.map((interest) => <button key={interest} type="button" onClick={() => toggleInterest(interest)} className={`rounded-full px-3 py-1.5 text-xs ${interests.includes(interest) ? 'bg-blue-500 text-white' : 'border border-slate-700 bg-slate-950 text-slate-300'}`}>{interest}</button>)}</div></div>
                  </div>
                </section>

                <section>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">04 / Career direction</p>
                  <div className="grid gap-4 md:grid-cols-3">
                    <label className={labelClass}><span>Target role</span><select value={targetRoleChoice} onChange={(e) => { setTargetRoleChoice(e.target.value); if (e.target.value !== 'Other') updateForm('preferredRole', e.target.value) }} className={fieldClass} required><option value="">Select a target role</option>{allCareers.map((career) => <option key={career.id} value={career.title}>{career.title}</option>)}<option value="Other">Other</option></select>{targetRoleChoice === 'Other' && <input value={form.preferredRole} onChange={(e) => updateForm('preferredRole', e.target.value)} className={fieldClass} placeholder="Type your target role" required />}</label>
                    <label className={labelClass}><span>Preferred industry</span><select value={preferredIndustryChoice} onChange={(e) => { setPreferredIndustryChoice(e.target.value); if (e.target.value !== 'Other') updateForm('preferredIndustry', e.target.value) }} className={fieldClass} required><option value="">Select an industry</option>{Array.from(new Set(companies.map((company) => company.industry))).map((industry) => <option key={industry} value={industry}>{industry}</option>)}<option value="Other">Other</option></select>{preferredIndustryChoice === 'Other' && <input value={form.preferredIndustry} onChange={(e) => updateForm('preferredIndustry', e.target.value)} className={fieldClass} placeholder="Type your preferred industry" required />}</label>
                    <label className={labelClass}><span>Preferred work location</span><input value={form.preferredLocation} onChange={(e) => updateForm('preferredLocation', e.target.value)} className={fieldClass} placeholder="Bengaluru or remote" /></label>
                    <label className={labelClass}><span>Work mode</span><select value={form.workMode} onChange={(e) => updateForm('workMode', e.target.value)} className={fieldClass}><option>Remote</option><option>Hybrid</option><option>On-site</option></select></label>
                    <label className={labelClass}><span>Expected salary</span><input value={form.salaryRange} onChange={(e) => updateForm('salaryRange', e.target.value)} className={fieldClass} placeholder="₹8L - ₹15L" /></label>
                    <label className={labelClass}><span>Next step</span><select value={form.higherStudiesOrJob} onChange={(e) => updateForm('higherStudiesOrJob', e.target.value)} className={fieldClass}><option>Job</option><option>Higher Studies</option><option>Both</option></select></label>
                  </div>
                </section>
              </>
            ) : (
              <>
                <label className={labelClass}><span>Email address</span><input type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} className={fieldClass} placeholder="you@example.com" required /></label>
                <label className={labelClass}><span>Password</span><input type="password" value={form.password} onChange={(e) => updateForm('password', e.target.value)} className={fieldClass} placeholder="Your password" required /></label>
                <p className="text-sm text-slate-400">For this local demo, login restores the profile already saved in this browser.</p>
              </>
            )}

            {authError && <p role="alert" className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-200">{authError}</p>}

            <button type="submit" className="premium-button w-full rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 px-4 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 hover:opacity-95">
              {isRegister ? 'Create profile and open dashboard' : 'Login'}
            </button>
            <div className="mt-3 text-center text-sm text-slate-400">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <Link to={isRegister ? '/login' : '/register'} className="font-medium text-cyan-300 hover:text-cyan-200">
                {isRegister ? 'Login' : 'Register'}
              </Link>
            </div>
            {!isRegister && <button type="button" className="w-full rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-300 hover:border-slate-500">Forgot Password?</button>}
          </form>
        </div>
      </div>
    </div>
  )
}

function ProfileSetupPage({ profile, updateProfile }: { profile: StudentProfile; updateProfile: (next: StudentProfile) => void }) {
  const [draft, setDraft] = useState<StudentProfile>(profile)
  const [selectedSkill, setSelectedSkill] = useState<Proficiency>('Beginner')

  const addSkill = (skill: string) => {
    if (!draft.skills.some((item) => item.name === skill)) {
      setDraft({
        ...draft,
        skills: [...draft.skills, { name: skill, proficiency: selectedSkill }],
      })
    }
  }

  const updateSkillProficiency = (name: string, value: Proficiency) => {
    setDraft({
      ...draft,
      skills: draft.skills.map((skill) => (skill.name === name ? { ...skill, proficiency: value } : skill)),
    })
  }

  const save = () => updateProfile(draft)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Profile setup</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Build your student profile</h1>
        </div>
        <button type="button" onClick={save} className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-medium text-white">Save profile</button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <h2 className="mb-4 text-lg font-semibold text-white">Personal information</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" placeholder="Full name" />
            <input value={draft.age} onChange={(e) => setDraft({ ...draft, age: Number(e.target.value) })} type="number" className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" placeholder="Age" />
            <input value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white md:col-span-2" placeholder="Location" />
            <input value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white md:col-span-2" placeholder="Email" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <h2 className="mb-4 text-lg font-semibold text-white">Education</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <input value={draft.college} onChange={(e) => setDraft({ ...draft, college: e.target.value })} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white md:col-span-2" placeholder="College" />
            <input value={draft.degree} onChange={(e) => setDraft({ ...draft, degree: e.target.value })} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" placeholder="Degree" />
            <input value={draft.branch} onChange={(e) => setDraft({ ...draft, branch: e.target.value })} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" placeholder="Branch" />
            <input value={draft.currentYear} onChange={(e) => setDraft({ ...draft, currentYear: e.target.value })} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" placeholder="Current year" />
            <input value={draft.graduationYear} onChange={(e) => setDraft({ ...draft, graduationYear: Number(e.target.value) })} type="number" className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" placeholder="Graduation year" />
            <input value={draft.cgpa} onChange={(e) => setDraft({ ...draft, cgpa: Number(e.target.value) })} type="number" step="0.1" className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" placeholder="CGPA/Percentage" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <h2 className="mb-4 text-lg font-semibold text-white">Technical skills</h2>
        <div className="mb-4 flex flex-wrap gap-3">
          {skillOptions.map((skill) => (
            <button key={skill} type="button" onClick={() => addSkill(skill)} className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 hover:border-cyan-500">
              + {skill}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-300">Default proficiency</label>
          <select value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value as Proficiency)} className="rounded-xl border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm text-white">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {draft.skills.map((skill) => (
            <div key={skill.name} className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-950 p-3">
              <span className="text-sm font-medium text-white">{skill.name}</span>
              <select value={skill.proficiency} onChange={(e) => updateSkillProficiency(skill.name, e.target.value as Proficiency)} className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200">
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <h2 className="mb-4 text-lg font-semibold text-white">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {interestOptions.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => {
                  const exists = draft.interests.includes(interest)
                  setDraft({ ...draft, interests: exists ? draft.interests.filter((item) => item !== interest) : [...draft.interests, interest] })
                }}
                className={`rounded-full px-3 py-1.5 text-xs ${draft.interests.includes(interest) ? 'bg-cyan-500 text-white' : 'border border-slate-700 bg-slate-950 text-slate-300'}`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <h2 className="mb-4 text-lg font-semibold text-white">Career preferences</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <input value={draft.careerPreferences.preferredRole} onChange={(e) => setDraft({ ...draft, careerPreferences: { ...draft.careerPreferences, preferredRole: e.target.value } })} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" placeholder="Preferred role" />
            <input value={draft.careerPreferences.preferredIndustry} onChange={(e) => setDraft({ ...draft, careerPreferences: { ...draft.careerPreferences, preferredIndustry: e.target.value } })} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" placeholder="Preferred industry" />
            <input value={draft.careerPreferences.preferredLocation} onChange={(e) => setDraft({ ...draft, careerPreferences: { ...draft.careerPreferences, preferredLocation: e.target.value } })} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" placeholder="Location" />
            <select value={draft.careerPreferences.workMode} onChange={(e) => setDraft({ ...draft, careerPreferences: { ...draft.careerPreferences, workMode: e.target.value as 'Remote' | 'Hybrid' | 'On-site' } })} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white">
              <option>Remote</option>
              <option>Hybrid</option>
              <option>On-site</option>
            </select>
            <input value={draft.careerPreferences.salaryRange} onChange={(e) => setDraft({ ...draft, careerPreferences: { ...draft.careerPreferences, salaryRange: e.target.value } })} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" placeholder="Expected salary" />
            <input value={draft.careerPreferences.companySize} onChange={(e) => setDraft({ ...draft, careerPreferences: { ...draft.careerPreferences, companySize: e.target.value } })} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" placeholder="Company size" />
          </div>
        </div>
      </div>
    </div>
  )
}

function AssessmentPage({ answers, setAnswers }: { answers: Record<string, string | number>; setAnswers: (value: Record<string, string | number>) => void }) {
  const [index, setIndex] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const question = assessmentQuestions[index]

  const answerQuestion = (answer: string | number) => {
    const next = { ...answers, [question.id]: answer }
    setAnswers(next)
    saveToStorage(storageKeys.answers, next)
    if (index < assessmentQuestions.length - 1) {
      setIndex((value) => value + 1)
    } else {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Assessment complete</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Your career profile has been created</h1>
        <p className="mt-3 max-w-2xl text-slate-300">
          Based on your answers, the system will guide recommendations and highlight the best roles aligned with your preferences.
        </p>
        <div className="mt-6 flex gap-4">
          <Link to="/dashboard" className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 font-medium text-white">Go to dashboard</Link>
          <Link to="/careers" className="rounded-xl border border-slate-700 px-4 py-2.5 text-slate-200">Explore careers</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20">
      <div className="mb-6 flex items-center justify-between text-sm text-slate-300">
        <span>Question {index + 1} of {assessmentQuestions.length}</span>
        <span>{Math.round(((index + 1) / assessmentQuestions.length) * 100)}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
        <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600" style={{ width: `${((index + 1) / assessmentQuestions.length) * 100}%` }} />
      </div>

      <div className="mt-8">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Career assessment</p>
        <h2 className="mt-3 text-3xl font-bold text-white">{question.text}</h2>
      </div>

      <div className="mt-8 grid gap-3">
        {question.type === 'multiple' && question.options?.map((option) => (
          <button key={option} type="button" onClick={() => answerQuestion(option)} className="rounded-2xl border border-slate-700 bg-slate-950 p-4 text-left text-slate-200 transition hover:border-cyan-500 hover:bg-slate-800">
            {option}
          </button>
        ))}

        {question.type === 'rating' && (
          <div className="grid grid-cols-5 gap-3">
            {Array.from({ length: Number(question.max) ?? 5 }, (_, i) => i + 1).map((value) => (
              <button key={value} type="button" onClick={() => answerQuestion(value)} className="rounded-2xl border border-slate-700 bg-slate-950 p-4 text-center text-lg font-semibold text-slate-200 hover:border-cyan-500 hover:bg-slate-800">
                {value}
              </button>
            ))}
          </div>
        )}

        {question.type === 'skill' && question.options?.map((option) => (
          <button key={option} type="button" onClick={() => answerQuestion(option)} className="rounded-2xl border border-slate-700 bg-slate-950 p-4 text-left text-slate-200 transition hover:border-cyan-500 hover:bg-slate-800">
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

function DashboardPage({ profile, dashboard, recommendations, isNewUser }: { profile: StudentProfile; dashboard: ReturnType<typeof analyzeCareerProfile>; recommendations: ReturnType<typeof recommendCareers>; isNewUser: boolean }) {
  const skillChartData = profile.skills.map((skill) => ({ name: skill.name, value: skill.proficiency === 'Beginner' ? 35 : skill.proficiency === 'Intermediate' ? 65 : 90 }))
  const matchChartData = recommendations.map((career) => ({ name: career.careerName, match: career.match }))
  const learningProgressData = [
    { name: 'Completed', value: dashboard.learningProgress },
    { name: 'Remaining', value: 100 - dashboard.learningProgress },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Dashboard</p>
          <h1 className="mt-2 text-3xl font-bold text-white">{isNewUser ? 'Welcome' : 'Welcome back'} {profile.name.split(' ')[0]}!</h1>
        </div>
        <Link to="/assessment" className="rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm text-slate-200 hover:border-cyan-500">Update assessment</Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Career readiness" value={`${dashboard.readinessScore}%`} hint="Overall score" icon={<Target className="h-5 w-5 text-cyan-200" />} />
        <MetricCard label="Top career match" value={`${dashboard.topMatch}%`} hint={dashboard.topCareer} icon={<Sparkles className="h-5 w-5 text-violet-200" />} />
        <MetricCard label="Skills" value={`${dashboard.skillCount}`} hint="Tracked skills" icon={<Cpu className="h-5 w-5 text-emerald-200" />} />
        <MetricCard label="Learning progress" value={`${dashboard.learningProgress}%`} hint="Roadmap completion" icon={<TrendingUp className="h-5 w-5 text-amber-200" />} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Career match comparison</h2>
            <span className="text-sm text-slate-400">Current ranking</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={matchChartData}>
                <Bar dataKey="match" radius={[8, 8, 0, 0]} fill="#22d3ee" />
                <Line type="monotone" dataKey="match" stroke="#60a5fa" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <h2 className="mb-4 text-xl font-semibold text-white">Skill proficiency</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={learningProgressData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80}>
                  <Cell fill="#22d3ee" />
                  <Cell fill="#334155" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Top recommendations</h2>
            <Link to="/careers" className="text-sm text-cyan-300">View all</Link>
          </div>
          <div className="space-y-4">
            {recommendations.map((career) => (
              <div key={career.careerId} className="rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-white">{career.careerName}</p>
                    <p className="mt-1 text-sm text-slate-400">{career.match}% match</p>
                  </div>
                  <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-medium text-cyan-200">Recommended</span>
                </div>
                <p className="mt-3 text-sm text-slate-300">{career.whyItMatches}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <h2 className="mb-4 text-xl font-semibold text-white">Skill overview</h2>
          <div className="space-y-4">
            {skillChartData.map((skill) => (
              <div key={skill.name}>
                <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
                  <span>{skill.name}</span>
                  <span>{skill.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600" style={{ width: `${skill.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CareerExplorerPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Career explorer</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Explore career paths</h1>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {allCareers.map((career) => (
          <Link key={career.id} to={`/careers/${career.id}`} className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-5 transition hover:-translate-y-1 hover:border-cyan-500/60">
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-200">{career.category}</span>
              <span className="text-xs text-slate-400">{career.difficulty}</span>
            </div>
            <h3 className="text-xl font-semibold text-white">{career.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">{career.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {career.requiredSkills.slice(0, 3).map((skill) => (
                <span key={skill} className="rounded-full border border-slate-700 px-2 py-1 text-[10px] uppercase tracking-wide text-slate-300">{skill}</span>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between text-sm text-slate-300">
              <span>{career.salaryRange}</span>
              <span className="flex items-center gap-1 text-cyan-300">
                View <ChevronRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function CareerDetailPage({ profile }: { profile: StudentProfile }) {
  const { careerId } = useParams()
  const career = allCareers.find((item) => item.id === careerId) ?? allCareers[0]
  const recommendedScore = recommendCareers(profile).find((item) => item.careerId === career.id)?.match ?? 85

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Career details</p>
            <h1 className="mt-2 text-3xl font-bold text-white">{career.title}</h1>
          </div>
          <div className="rounded-xl bg-cyan-500/15 px-4 py-2 text-lg font-semibold text-cyan-200">{recommendedScore}% match</div>
        </div>
        <p className="mt-4 text-slate-300">{career.description}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/skill-gap" className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white">Check My Match</Link>
          <Link to="/careers" className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-200">Back to explorer</Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <h2 className="mb-4 text-xl font-semibold text-white">What this professional does</h2>
          <ul className="space-y-3 text-slate-300">
            {career.responsibilities.map((item) => (
              <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-cyan-300" />{item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <h2 className="mb-4 text-xl font-semibold text-white">Required skills</h2>
          <div className="flex flex-wrap gap-2">
            {career.requiredSkills.map((skill) => (
              <span key={skill} className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-200">{skill}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <InfoCard title="Soft skills" items={career.softSkills} />
        <InfoCard title="Popular tools" items={career.tools} />
        <InfoCard title="Related roles" items={career.relatedRoles} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <InfoCard title="Certifications" items={career.certifications} />
        <InfoCard title="Projects" items={career.projects} />
        <InfoCard title="Recommended companies" items={career.companies} />
      </div>
    </div>
  )
}

function SkillGapPage({ skillGap }: { skillGap: ReturnType<typeof analyzeSkillGap> }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Skill gap analysis</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Compare your profile against your target role</h1>
        </div>
        <div className="rounded-2xl bg-emerald-500/15 px-4 py-2 text-lg font-semibold text-emerald-200">Career readiness: {skillGap.score}%</div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <h2 className="text-lg font-semibold text-white">Strong skills</h2>
          <ul className="mt-4 space-y-2 text-slate-300">
            {skillGap.strongSkills.length ? skillGap.strongSkills.map((skill) => <li key={skill}>• {skill}</li>) : <li>No strong skills yet</li>}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <h2 className="text-lg font-semibold text-white">Skills to improve</h2>
          <ul className="mt-4 space-y-2 text-slate-300">
            {skillGap.improvingSkills.length ? skillGap.improvingSkills.map((skill) => <li key={skill}>• {skill}</li>) : <li>None of the required skills need attention</li>}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <h2 className="text-lg font-semibold text-white">Missing skills</h2>
          <ul className="mt-4 space-y-2 text-slate-300">
            {skillGap.missingSkills.length ? skillGap.missingSkills.map((skill) => <li key={skill}>• {skill}</li>) : <li>No missing skills</li>}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <h2 className="mb-3 text-xl font-semibold text-white">Skill gap comparison</h2>
        <div className="space-y-4">
          {skillGap.gapItems.map((item) => (
            <div key={item.name}>
              <div className="mb-1 flex items-center justify-between text-sm text-slate-300">
                <span>{item.name}</span>
                <span>{item.current} → {item.required}</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600" style={{ width: item.status === 'Strong' ? '100%' : item.status === 'Good' ? '70%' : item.status === 'Needs Improvement' ? '45%' : '15%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RoadmapPage({ careerId, roadmapState, updateRoadmap }: { careerId: string; roadmapState: Record<string, boolean>; updateRoadmap: (phaseId: string, value: boolean) => void }) {
  const roadmap = generateLearningRoadmap(careerId)

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Personalized learning roadmap</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Build your learning track</h1>
      </div>
      <div className="space-y-4">
        {roadmap.map((phase) => (
          <div key={phase.phase} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">{phase.phase}</p>
                <h3 className="mt-2 text-xl font-semibold text-white">{phase.title}</h3>
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" checked={Boolean(roadmapState[phase.phase])} onChange={(e) => updateRoadmap(phase.phase, e.target.checked)} className="h-4 w-4 accent-cyan-500" />
                Completed
              </label>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-medium text-slate-200">Topics</p>
                <ul className="space-y-1 text-sm text-slate-300">
                  {phase.topics.map((topic) => <li key={topic}>• {topic}</li>)}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-slate-200">Recommended resources</p>
                <ul className="space-y-1 text-sm text-slate-300">
                  {phase.resources.map((resource) => <li key={resource}>• {resource}</li>)}
                </ul>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
              <span>{phase.time}</span>
              <span>{phase.projects.length} project ideas</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CompaniesPage({ profile }: { profile: StudentProfile }) {
  const companiesForProfile = recommendCompanies(profile, 'ai-ml-engineer')

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Company recommendations</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Good-fit companies for your profile</h1>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {companiesForProfile.map((company) => (
          <Link key={company.id} to={`/companies/${company.id}`} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 transition hover:-translate-y-1 hover:border-cyan-500/60">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{company.name}</h3>
              <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs text-emerald-200">{company.match}% match</span>
            </div>
            <p className="mt-2 text-sm text-slate-400">{company.industry}</p>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <p><span className="text-slate-400">Roles:</span> {company.roles.join(', ')}</p>
              <p><span className="text-slate-400">Skills:</span> {company.requiredSkills.join(', ')}</p>
              <p><span className="text-slate-400">Location:</span> {company.location}</p>
            </div>
            <div className="mt-5 flex items-center justify-between text-sm text-cyan-300"><span>View company details</span><ChevronRight className="h-4 w-4" /></div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function CompanyDetailPage() {
  const { companyId } = useParams()
  const company = companies.find((item) => item.id === companyId) ?? companies[0]

  return (
    <div className="space-y-6">
      <Link to="/companies" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-300">Back to companies</Link>
      <section className="glass-card rounded-3xl p-6 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Company profile</p>
            <h1 className="mt-2 text-4xl font-bold text-white">{company.name}</h1>
            <p className="mt-2 text-slate-400">{company.industry} · {company.location}</p>
          </div>
          <div className="rounded-2xl bg-emerald-500/15 px-4 py-3 text-right"><p className="text-xs uppercase tracking-wide text-emerald-300">Profile match</p><p className="mt-1 text-2xl font-bold text-emerald-200">{company.match}%</p></div>
        </div>
        <p className="mt-6 max-w-4xl text-base leading-7 text-slate-300">{company.description}</p>
      </section>

      <div className="grid gap-5 md:grid-cols-3">
        <DetailStat label="Expected CTC" value={company.ctc} />
        <DetailStat label="Experience" value={company.experienceLevel} />
        <DetailStat label="Work location" value={company.location} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DetailList title="Roles you can target" items={company.roles} />
        <DetailList title="Skills companies look for" items={company.requiredSkills} />
        <DetailList title="Hiring process" items={company.hiringRounds} numbered />
        <DetailList title="Employee benefits" items={company.benefits} />
      </div>

      <section className="glass-card rounded-3xl p-6 text-center md:p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Ready to take the next step?</p>
        <h2 className="mt-2 text-2xl font-bold text-white">Apply to {company.name}</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">Open the company&apos;s official careers page to review live openings and submit your application.</p>
        <a href={company.applicationUrl} target="_blank" rel="noreferrer" className="premium-button mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 px-6 py-3 font-semibold text-white">Apply to company <ChevronRight className="h-4 w-4" /></a>
      </section>
    </div>
  )
}

function DetailStat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5"><p className="text-xs uppercase tracking-wide text-slate-400">{label}</p><p className="mt-2 text-lg font-semibold text-white">{value}</p></div>
}

function DetailList({ title, items, numbered = false }: { title: string; items: string[]; numbered?: boolean }) {
  return <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5"><h2 className="text-xl font-semibold text-white">{title}</h2><ul className="mt-4 space-y-3 text-sm text-slate-300">{items.map((item, index) => <li key={item} className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/15 text-xs text-cyan-200">{numbered ? index + 1 : '•'}</span><span>{item}</span></li>)}</ul></section>
}

function HiringMapPage({ profile }: { profile: StudentProfile }) {
  const [selectedSkill, setSelectedSkill] = useState('All skills')
  const skills = ['All skills', ...Array.from(new Set(companies.flatMap((company) => company.requiredSkills))).sort()]
  const matchingCompanies = selectedSkill === 'All skills'
    ? companies
    : companies.filter((company) => company.requiredSkills.some((skill) => skill.toLowerCase().includes(selectedSkill.toLowerCase()) || selectedSkill.toLowerCase().includes(skill.toLowerCase())))

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-3xl p-6 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Skill-to-company map</p>
            <h1 className="mt-2 text-3xl font-bold text-white">See who hires for your skills</h1>
            <p className="mt-3 max-w-2xl text-slate-300">Explore the companies, roles, and skill signals connected to your career direction.</p>
          </div>
          <div className="min-w-56">
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-400">Filter by skill</label>
            <select value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:border-cyan-400">
              {skills.map((skill) => <option key={skill}>{skill}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-sm text-cyan-100">
        <span className="font-semibold">Your current focus:</span> {profile.careerPreferences.preferredRole || 'Choose a target role'} in {profile.careerPreferences.preferredIndustry || 'your preferred industry'} · {profile.skills.length} tracked skills
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {matchingCompanies.map((company) => (
          <div key={company.id} className="glass-card rounded-2xl p-5 transition hover:-translate-y-1 hover:border-cyan-400/50">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-200"><Building2 className="h-5 w-5" /></div>
                <div><h3 className="font-semibold text-white">{company.name}</h3><p className="text-xs text-slate-400">{company.industry}</p></div>
              </div>
              <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-medium text-emerald-200">{company.match}% fit</span>
            </div>
            <p className="text-sm text-slate-400">Hiring signals</p>
            <div className="mt-2 flex flex-wrap gap-2">{company.requiredSkills.map((skill) => <span key={skill} className={`rounded-full border px-2.5 py-1 text-xs ${selectedSkill !== 'All skills' && skill.toLowerCase().includes(selectedSkill.toLowerCase()) ? 'border-cyan-400 bg-cyan-400/15 text-cyan-100' : 'border-slate-700 text-slate-300'}`}>{skill}</span>)}</div>
            <div className="mt-5 border-t border-slate-800 pt-4 text-sm text-slate-300"><p><span className="text-slate-500">Roles:</span> {company.roles.join(' · ')}</p><p className="mt-2"><span className="text-slate-500">Experience:</span> {company.experienceLevel} · {company.location}</p></div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProgressPage({ profile, dashboard }: { profile: StudentProfile; dashboard: ReturnType<typeof analyzeCareerProfile> }) {
  const progressData = [
    { name: 'Career readiness', value: dashboard.readinessScore },
    { name: 'Roadmap progress', value: dashboard.learningProgress },
    { name: 'Projects', value: 72 },
    { name: 'Certifications', value: 68 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Progress tracking</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Track your development journey</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Overall readiness" value={`${dashboard.readinessScore}%`} hint="Profile health" icon={<Target className="h-5 w-5 text-cyan-200" />} />
        <MetricCard label="Skills learned" value={`${profile.skills.length}`} hint="Active skills" icon={<CheckCircle2 className="h-5 w-5 text-emerald-200" />} />
        <MetricCard label="Roadmap done" value={`${dashboard.learningProgress}%`} hint="Milestones" icon={<Rocket className="h-5 w-5 text-violet-200" />} />
        <MetricCard label="Applications" value="08" hint="Saved tracks" icon={<Briefcase className="h-5 w-5 text-amber-200" />} />
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <h2 className="mb-4 text-xl font-semibold text-white">Career progress overview</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressData}>
              <Line type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function ResumePage({ profile }: { profile: StudentProfile }) {
  const resumeScore = Math.min(100, Math.round((profile.skills.length * 8 + profile.experience.length * 10 + profile.interests.length * 5 + (profile.cgpa > 7 ? 15 : 8))))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">My career profile</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Resume readiness: {resumeScore}%</h1>
        </div>
        <button type="button" className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-medium text-white">Download resume</button>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <h2 className="mb-4 text-xl font-semibold text-white">Personal details</h2>
          <ul className="space-y-2 text-slate-300">
            <li><strong className="text-white">Name:</strong> {profile.name}</li>
            <li><strong className="text-white">Email:</strong> {profile.email}</li>
            <li><strong className="text-white">College:</strong> {profile.college}</li>
            <li><strong className="text-white">Degree:</strong> {profile.degree} in {profile.branch}</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <h2 className="mb-4 text-xl font-semibold text-white">Career goal</h2>
          <p className="text-slate-300">To become a {profile.careerPreferences.preferredRole} by building strong technical fundamentals, project experience, and a focused learning roadmap.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <h2 className="mb-4 text-xl font-semibold text-white">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill) => (
            <span key={skill.name} className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-200">{skill.name}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [emailUpdates, setEmailUpdates] = useState(true)
  const [profileVisible, setProfileVisible] = useState(true)

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Settings</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Account preferences</h1>
        <p className="mt-2 max-w-2xl text-slate-400">Control your workspace appearance, alerts, privacy, and support preferences.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <SettingsSection title="Notifications" description="Choose which updates reach you while you build your roadmap.">
          <SettingToggle icon={<Bell className="h-5 w-5" />} label="In-app notifications" description="Roadmap reminders and progress updates." enabled={notifications} onChange={setNotifications} />
          <SettingToggle icon={<Mail className="h-5 w-5" />} label="Email updates" description="Occasional career and learning recommendations." enabled={emailUpdates} onChange={setEmailUpdates} />
        </SettingsSection>

        <SettingsSection title="Privacy" description="Decide how your profile can be used for guidance.">
          <SettingToggle icon={<Eye className="h-5 w-5" />} label="Mentor visibility" description="Allow mentors to view your career profile." enabled={profileVisible} onChange={setProfileVisible} />
        </SettingsSection>

        <SettingsSection title="Support" description="Find answers or contact the AI Career Navigator team.">
          <div className="grid gap-3 sm:grid-cols-2">
            <a href="mailto:support@aicareernavigator.com" className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950/60 p-3 text-sm text-slate-200 transition hover:border-cyan-400 hover:text-cyan-200"><Mail className="h-5 w-5 text-cyan-300" /><span><strong className="block text-white">Contact us</strong><span className="text-xs text-slate-400">Email the support team</span></span></a>
            <a href="mailto:support@aicareernavigator.com?subject=AI%20Career%20Navigator%20help" className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950/60 p-3 text-sm text-slate-200 transition hover:border-cyan-400 hover:text-cyan-200"><HelpCircle className="h-5 w-5 text-cyan-300" /><span><strong className="block text-white">Help center</strong><span className="text-xs text-slate-400">Ask a product question</span></span></a>
          </div>
        </SettingsSection>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-300"><ShieldCheck className="h-5 w-5 text-emerald-300" /><span>Your preferences are stored securely in this browser for this local workspace.</span></div>
    </div>
  )
}

function SettingsSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="glass-card rounded-2xl p-5">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mt-1 text-sm text-slate-400">{description}</p>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  )
}

function SettingToggle({ icon, label, description, enabled, onChange }: { icon: React.ReactNode; label: string; description: string; enabled: boolean; onChange: (value: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-700/70 bg-slate-950/50 p-3">
      <div className="flex items-center gap-3"><div className="rounded-lg bg-cyan-400/10 p-2 text-cyan-300">{icon}</div><div><p className="font-medium text-white">{label}</p><p className="mt-0.5 text-xs text-slate-400">{description}</p></div></div>
      <button type="button" role="switch" aria-checked={enabled} aria-label={`Toggle ${label}`} onClick={() => onChange(!enabled)} className={`relative h-7 w-12 shrink-0 rounded-full p-1 ${enabled ? 'bg-cyan-500' : 'bg-slate-700'}`}><span className={`block h-5 w-5 rounded-full bg-white shadow transition ${enabled ? 'translate-x-5' : 'translate-x-0'}`} /></button>
    </div>
  )
}

function MetricCard({ label, value, hint = '', icon }: { label: string; value: string; hint?: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-300">{label}</p>
        <div className="rounded-xl bg-slate-950 p-2">{icon}</div>
      </div>
      <p className="mt-4 text-3xl font-bold text-white">{value}</p>
      <p className="mt-2 text-xs text-slate-400">{hint}</p>
    </div>
  )
}

function InfoCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
      <h2 className="mb-4 text-xl font-semibold text-white">{title}</h2>
      <ul className="space-y-2 text-sm text-slate-300">
        {items.map((item) => <li key={item}>• {item}</li>)}
      </ul>
    </div>
  )
}

export default App
