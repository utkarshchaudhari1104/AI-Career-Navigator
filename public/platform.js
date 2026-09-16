const weeklyQuestions = [
  ['Which sequence comes next: 2, 4, 8, 16?', ['24', '32', '30', '20'], '32'],
  ['If all developers solve problems and Maya is a developer, what follows?', ['Maya solves problems', 'Maya is a manager', 'Nothing', 'Maya is a designer'], 'Maya solves problems'],
  ['Which skill best supports logical reasoning?', ['Memorization', 'Pattern recognition', 'Guessing', 'Copying'], 'Pattern recognition'],
  ['A project has 5 tasks and each takes 2 days. How long sequentially?', ['5 days', '7 days', '10 days', '12 days'], '10 days'],
  ['Which data structure follows first-in, first-out?', ['Stack', 'Queue', 'Tree', 'Graph'], 'Queue'],
  ['What is the best first step when debugging?', ['Rewrite everything', 'Reproduce the issue', 'Ignore the error', 'Deploy immediately'], 'Reproduce the issue'],
  ['If a condition is false, an if block will usually:', ['Run twice', 'Not run', 'Crash always', 'Loop forever'], 'Not run'],
  ['Which is an example of decomposition?', ['Breaking a problem into smaller tasks', 'Deleting requirements', 'Avoiding tests', 'Adding random features'], 'Breaking a problem into smaller tasks'],
  ['What does an algorithm provide?', ['A repeatable solution method', 'Only visual design', 'A password', 'A company policy'], 'A repeatable solution method'],
  ['Which number is prime?', ['21', '27', '29', '33'], '29'],
  ['When comparing two solutions, what matters most?', ['Evidence and trade-offs', 'The newest logo', 'The longest name', 'Guesswork'], 'Evidence and trade-offs'],
  ['What is a useful way to validate an assumption?', ['Test it with evidence', 'Hide it', 'Repeat it louder', 'Remove all data'], 'Test it with evidence'],
  ['Which approach reduces repeated code?', ['Abstraction', 'Duplication', 'Manual copying', 'Ignoring functions'], 'Abstraction'],
  ['What does a loop help you do?', ['Repeat a process', 'Encrypt a screen', 'Choose a college', 'Remove logic'], 'Repeat a process'],
  ['A good technical decision should be:', ['Explainable', 'Random', 'Secret', 'Unchangeable'], 'Explainable'],
  ['What does binary search require?', ['Sorted data', 'No data', 'Only images', 'A password'], 'Sorted data'],
  ['Which question improves problem understanding?', ['What is the expected output?', 'Who is to blame?', 'Can we skip it?', 'Why test?'], 'What is the expected output?'],
  ['What is the most reliable way to improve a solution?', ['Measure and iterate', 'Guess once', 'Avoid feedback', 'Delete the result'], 'Measure and iterate'],
  ['Which is a logical operator?', ['AND', 'Paint', 'Folder', 'Screen'], 'AND'],
  ['What should a clear solution communicate?', ['Inputs, process, and outcome', 'Only its color', 'Nothing', 'A slogan'], 'Inputs, process, and outcome']
]

function currentWeek() {
  const date = new Date()
  const first = new Date(date.getFullYear(), 0, 1)
  return `${date.getFullYear()}-${Math.ceil((((date - first) / 86400000) + first.getDay() + 1) / 7)}`
}

function weeklyQuestionSet() {
  const offset = Number(currentWeek().split('-')[1]) % weeklyQuestions.length
  return weeklyQuestions.slice(offset).concat(weeklyQuestions.slice(0, offset))
}

function selectWithOther(name, label, options, value = '') {
  return `<div class="col-md-6"><label class="form-label">${label}<select name="${name}" class="form-select required-choice"><option value="">Select ${label.toLowerCase()}</option>${options.map(option => `<option ${value === option ? 'selected' : ''}>${option}</option>`).join('')}<option value="Other">Other</option></select><input name="${name}Other" class="form-control mt-2 d-none" placeholder="Enter ${label.toLowerCase()}" value=""></label></div>`
}

function platformSidebar() {
  const links = [['dashboard', 'Dashboard'], ['profile', 'My Profile'], ['assessment', 'Career Assessment'], ['careers', 'Career Explorer'], ['skill-gap', 'Skill Gap'], ['roadmap', 'Learning Roadmap'], ['companies', 'Companies'], ['progress', 'Progress'], ['settings', 'Settings']]
  const path = location.hash.slice(2).split('/')[0] || 'dashboard'
  return `<aside class="sidebar d-none d-lg-flex flex-column p-4" style="width:270px"><div class="d-flex align-items-center gap-3 mb-4"><div class="brand-mark">✦</div><div><div class="fw-bold fs-5">AI Career</div><div class="small text-muted-custom">Navigator</div></div></div><nav class="nav flex-column">${links.map(([id, label]) => `<a class="nav-link ${path === id ? 'active' : ''} px-3 py-2" href="#/${id}">${label}</a>`).join('')}</nav><div class="mt-auto border-top pt-3" style="border-color:var(--line)!important"><div class="d-flex align-items-center gap-2 mb-3"><div class="brand-mark" style="width:34px;height:34px;border-radius:50%">${h((profile.name || 'S')[0])}</div><div><div class="small fw-semibold">${h(profile.name || 'Student')}</div><div class="small text-muted-custom">Career profile</div></div></div><button class="btn btn-outline-light btn-sm w-100" data-action="logout">Log out</button></div></aside>`
}

function platformShell(content) {
  return `<div class="app-shell d-flex"><div class="d-lg-none fixed-top p-3"><button class="btn btn-dark" data-bs-toggle="offcanvas" data-bs-target="#mobileNav">☰</button></div><div class="offcanvas offcanvas-start bg-dark text-white" id="mobileNav"><div class="offcanvas-header"><h5>AI Career Navigator</h5><button class="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button></div><div class="offcanvas-body">${platformSidebar().replace('d-none d-lg-flex', 'd-flex w-100')}</div></div>${platformSidebar()}<main class="content flex-grow-1 p-3 p-md-5"><div class="container-fluid">${content}</div></main></div>`
}

function platformLanding() {
  return `<div class="app-shell min-vh-100"><header class="container py-4 d-flex justify-content-between align-items-center"><div class="d-flex align-items-center gap-3"><div class="brand-mark">✦</div><strong class="fs-5">AI Career Navigator</strong></div><div class="d-flex gap-2"><a href="#/" data-scroll-platform class="btn btn-outline-light">View platform information</a><a href="#/login" class="btn btn-gradient px-4">Get started</a></div></header><main class="container py-5"><div class="row align-items-center g-5"><div class="col-lg-6"><div class="kicker mb-3">AI-powered career planning</div><h1 class="display-3 fw-bold">Navigate your career with AI</h1><p class="lead text-muted-custom mt-4">Discover the right career path, identify the skills you need, and build a personalized roadmap to reach your dream job.</p><div class="d-flex gap-3 mt-4"><a href="#/login" class="btn btn-gradient btn-lg px-4">Get started</a><a href="#/" data-scroll-platform class="btn btn-outline-light btn-lg">View platform information</a></div></div><div class="col-lg-6"><div class="hero-preview rounded-5 p-4 p-md-5"><div class="d-flex justify-content-between"><div><div class="small text-muted-custom">Top career match</div><div class="display-4 fw-bold">92%</div></div><span class="badge badge-green rounded-pill align-self-start p-2">On track</span></div>${['AI/ML Engineer', 'Data Scientist', 'Python Developer'].map((x, i) => `<div class="panel rounded-3 p-3 mt-4"><div class="d-flex justify-content-between"><span>${x}</span><span class="text-cyan">${[92, 87, 81][i]}%</span></div><div class="progress mt-2" style="height:8px"><div class="progress-bar" style="width:${[92, 87, 81][i]}%"></div></div></div>`).join('')}</div></div></div><section id="platform" class="py-5 mt-5"><div class="text-center mb-4"><div class="kicker">Platform information</div><h2 class="fw-bold">Everything you need to plan your future</h2><p class="text-muted-custom">Scroll here to see what the platform does.</p></div><div class="row g-4">${['AI career recommendations', 'Skill gap analysis', 'Personalized learning roadmap', 'Company recommendations', '20-question weekly assessment', 'Career progress tracking'].map(x => `<div class="col-md-4"><div class="panel card-link rounded-4 p-4 h-100"><div class="text-cyan fs-3">✦</div><h3 class="h5 mt-3">${x}</h3><p class="text-muted-custom small mt-2 mb-0">Use your profile and goals to turn uncertainty into a clear next step.</p></div></div>`).join('')}</div></section></main></div>`
}

function platformAuth(register) {
  const profileData = register ? profile : null
  return `<div class="app-shell min-vh-100 d-flex align-items-center py-5"><div class="container"><div class="row justify-content-center"><div class="col-xl-${register ? '11' : '7'}"><div class="panel rounded-5 overflow-hidden"><div class="row g-0"><div class="col-lg-4 p-5 d-none d-lg-flex flex-column justify-content-between" style="background:linear-gradient(145deg,rgba(34,180,200,.22),rgba(50,76,180,.18))"><div class="brand-mark">✦</div><div><div class="display-6 fw-bold">Plan a smarter future.</div><p class="text-muted-custom mt-3">Create your account once, then return with your username and password.</p></div></div><div class="col-lg-8 p-4 p-md-5"><div class="kicker">${register ? 'Create account' : 'Welcome back'}</div><h1 class="h2 fw-bold mt-2">${register ? 'Register as a student' : 'Login to your account'}</h1><form id="authForm" class="row g-3 mt-2">${register ? `<div class="col-md-6"><label class="form-label">Username<input name="username" class="form-control" required></label></div><div class="col-md-6"><label class="form-label">Full name<input name="name" class="form-control" required></label></div><div class="col-md-6"><label class="form-label">Email<input name="email" type="email" class="form-control" required></label></div><div class="col-md-6"><label class="form-label">Password<input name="password" type="password" class="form-control" required></label></div><div class="col-md-6"><label class="form-label">Age<input name="age" type="number" min="13" class="form-control" required></label></div><div class="col-md-6"><label class="form-label">College<input name="college" class="form-control" required></label></div><div class="col-md-6"><label class="form-label">Degree<select name="degree" class="form-select required-choice" required><option value="">Select degree</option><option>B.Tech</option><option>B.E.</option><option>B.Sc</option><option>M.Sc</option><option>Diploma</option><option value="Other">Other</option></select><input name="degreeOther" class="form-control mt-2 d-none" placeholder="Enter degree"></label></div><div class="col-md-6"><label class="form-label">Branch<select name="branch" class="form-select required-choice" required><option value="">Select branch</option><option>Computer Science</option><option>Information Technology</option><option>Electronics</option><option>Mechanical</option><option>Commerce</option><option>Arts</option><option value="Other">Other</option></select><input name="branchOther" class="form-control mt-2 d-none" placeholder="Enter branch"></label></div><div class="col-md-6"><label class="form-label">Current year<input name="currentYear" class="form-control" placeholder="3rd Year" required></label></div><div class="col-md-6"><label class="form-label">Graduation year<input name="graduationYear" type="number" class="form-control" required></label></div><div class="col-md-6"><label class="form-label">CGPA / percentage<input name="cgpa" type="number" step="0.1" class="form-control" required></label></div><div class="col-md-6"><label class="form-label">Location<select name="location" class="form-select required-choice" required><option value="">Select location</option><option>Bengaluru</option><option>Hyderabad</option><option>Pune</option><option>Mumbai</option><option>Delhi NCR</option><option>Chennai</option><option>Remote</option><option value="Other">Other</option></select><input name="locationOther" class="form-control mt-2 d-none" placeholder="Enter location"></label></div><div class="col-md-6"><label class="form-label">Target role<select name="role" class="form-select required-choice" required><option value="">Select target role</option>${careers.map(c => `<option>${c.title}</option>`).join('')}<option value="Other">Other</option></select><input name="roleOther" class="form-control mt-2 d-none" placeholder="Enter target role"></label></div><div class="col-md-6"><label class="form-label">Preferred job location<input name="preferredLocation" class="form-control" required></label></div><div class="col-md-6"><label class="form-label">Interested industry<select name="industry" class="form-select required-choice" required><option value="">Select industry</option>${[...new Set(companies.map(c => c.industry))].map(x => `<option>${x}</option>`).join('')}<option value="Other">Other</option></select><input name="industryOther" class="form-control mt-2 d-none" placeholder="Enter industry"></label></div><div class="col-12"><h2 class="h5 mt-2">Skills and proficiency</h2><p class="small text-muted-custom">Select the skills you have and choose a level for each one.</p><div class="row g-2">${skillOptions.map(skill => `<div class="col-md-6"><div class="border rounded-3 p-2" style="border-color:var(--line)!important"><div class="form-check"><input class="form-check-input register-skill" type="checkbox" value="${skill}" id="skill-${skill.replace(/[^a-z0-9]/gi, '')}"><label class="form-check-label" for="skill-${skill.replace(/[^a-z0-9]/gi, '')}">${skill}</label></div><select class="form-select form-select-sm mt-2 skill-proficiency" data-skill="${skill}" disabled><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div></div>`).join('')}</div></div>` : `<div class="col-12"><label class="form-label">Username<input name="username" class="form-control" required></label></div><div class="col-12"><label class="form-label">Password<input name="password" type="password" class="form-control" required></label></div><div class="col-12 small text-muted-custom">Use the username and password you saved during registration.</div>`}<div class="col-12"><div id="authError" class="text-danger small" role="alert"></div><button class="btn btn-gradient w-100 py-2" type="submit">${register ? 'Create account and open dashboard' : 'Login'}</button></div></form><div class="text-center small text-muted-custom mt-3">${register ? 'Already have an account?' : 'New user?'} <a class="text-cyan" href="#/${register ? 'login' : 'register'}">${register ? 'Login here' : 'Register here'}</a></div></div></div></div></div></div></div>`
}

function selectedCareerId() {
  return location.hash.slice(2).split('/')[1] || recommendations()[0]?.id || careers[0].id
}

function platformAssessment() {
  const questionSet = weeklyQuestionSet()
  const week = currentWeek()
  if (get('acn-assessment-week', '') !== week) {
    set('acn-assessment-week', week)
    set('acn-assessment-index', 0)
    set('acn-assessment-answers', {})
  }
  const index = Number(get('acn-assessment-index', 0))
  if (index >= questionSet.length) {
    const answersForWeek = get('acn-assessment-answers', {})
    const correct = questionSet.filter((question, i) => answersForWeek[i] === question[2]).length
    return `<div class="panel rounded-4 p-5"><div class="kicker">Weekly assessment complete</div><h1 class="h2 fw-bold mt-2">Your score: ${Math.round(correct / questionSet.length * 100)}%</h1><p class="text-muted-custom mt-3">Your score is based on this week's logical reasoning questions. New questions will appear next week.</p><a class="btn btn-gradient" href="#/dashboard">Go to dashboard</a></div>`
  }
  const question = questionSet[index]
  return `<div class="panel rounded-4 p-4 p-md-5 mx-auto" style="max-width:850px"><div class="d-flex justify-content-between small text-muted-custom"><span>Weekly question ${index + 1} of ${questionSet.length}</span><span>${Math.round((index + 1) / questionSet.length * 100)}%</span></div><div class="progress mt-2" style="height:9px"><div class="progress-bar" style="width:${(index + 1) / questionSet.length * 100}%"></div></div><div class="kicker mt-5">Logical reasoning assessment</div><h1 class="display-6 fw-bold mt-2">${question[0]}</h1><div class="row g-3 mt-4">${question[1].map(option => `<div class="col-md-6"><button class="btn btn-outline-light w-100 text-start p-3" data-assessment-answer="${h(option)}">${h(option)}</button></div>`).join('')}</div></div>`
}

function platformSkillGap() {
  const career = careers.find(c => c.id === selectedCareerId()) || careers[0]
  const items = career.skills.map(name => { const skill = profile.skills.find(item => item.name === name); return { name, current: skill?.proficiency || 'Missing', pct: skill?.proficiency === 'Advanced' ? 100 : skill?.proficiency === 'Intermediate' ? 70 : skill ? 45 : 15 } })
  const strong = items.filter(item => item.current === 'Advanced')
  return `<div class="d-flex justify-content-between align-items-start gap-3 mb-4"><div><div class="kicker">Skill gap analysis</div><h1 class="h2 fw-bold mt-2">Compare your profile with ${h(career.title)}</h1><p class="text-muted-custom">This view follows the career you selected.</p></div><span class="badge badge-green rounded-pill p-3">${Math.round(strong.length / career.skills.length * 100)}% ready</span></div><div class="row g-4 mb-4">${[['Strong skills', strong], ['Skills to improve', items.filter(item => item.current === 'Beginner' || item.current === 'Intermediate')], ['Missing skills', items.filter(item => item.current === 'Missing')]].map(([title, data]) => `<div class="col-md-4"><div class="panel rounded-4 p-4"><h2 class="h5">${title}</h2>${list(data.length ? data.map(item => item.name) : ['None yet'])}</div></div>`).join('')}</div><div class="panel rounded-4 p-4"><h2 class="h5">Skill gap comparison</h2>${items.map(item => `<div class="mt-4"><div class="d-flex justify-content-between small"><span>${h(item.name)}</span><span>${item.current} → Advanced</span></div><div class="progress mt-2" style="height:10px"><div class="progress-bar" style="width:${item.pct}%"></div></div></div>`).join('')}</div>`
}

function platformCareerMatch(id) {
  const career = careers.find(item => item.id === id) || careers[0]
  const items = career.skills.map(name => {
    const skill = profile.skills.find(item => item.name === name)
    return { name, current: skill?.proficiency || 'Missing', pct: skill?.proficiency === 'Advanced' ? 100 : skill?.proficiency === 'Intermediate' ? 70 : skill ? 45 : 15 }
  })
  const strong = items.filter(item => item.current === 'Advanced')
  const improving = items.filter(item => item.current === 'Beginner' || item.current === 'Intermediate')
  const missing = items.filter(item => item.current === 'Missing')
  const readiness = Math.round(strong.length / Math.max(1, career.skills.length) * 100)
  return `<a href="#/careers/${career.id}" class="text-muted-custom">← Back to ${h(career.title)}</a><div class="panel rounded-4 p-4 p-md-5 mt-3"><div class="kicker">Personalized career match</div><div class="d-flex justify-content-between align-items-start gap-3 flex-wrap"><div><h1 class="display-6 fw-bold mt-2">Your ${h(career.title)} match</h1><p class="lead text-muted-custom mt-3">${h(career.description)}</p></div><span class="badge badge-green rounded-pill p-3">${readiness}% ready</span></div><div class="progress mt-4" style="height:12px"><div class="progress-bar" style="width:${readiness}%"></div></div></div><div class="row g-4 mt-1"><div class="col-md-4"><div class="panel rounded-4 p-4"><h2 class="h5">Strong skills</h2>${list(strong.length ? strong.map(item => item.name) : ['Build your first advanced skill'])}</div></div><div class="col-md-4"><div class="panel rounded-4 p-4"><h2 class="h5">Skills to improve</h2>${list(improving.length ? improving.map(item => `${item.name} (${item.current})`) : ['No improvement areas yet'])}</div></div><div class="col-md-4"><div class="panel rounded-4 p-4"><h2 class="h5">Missing skills</h2>${list(missing.length ? missing.map(item => item.name) : ['No missing skills'])}</div></div></div><div class="panel rounded-4 p-4 mt-4"><h2 class="h5">${h(career.title)} skill comparison</h2>${items.map(item => `<div class="mt-4"><div class="d-flex justify-content-between small"><span>${h(item.name)}</span><span>${item.current} → Advanced</span></div><div class="progress mt-2" style="height:10px"><div class="progress-bar" style="width:${item.pct}%"></div></div></div>`).join('')}</div><div class="panel rounded-4 p-4 mt-4"><h2 class="h5">Why this career fits</h2><p class="text-muted-custom mb-0">Your profile currently matches ${h(career.title)} through ${strong.length} advanced skill${strong.length === 1 ? '' : 's'}, ${improving.length} skill${improving.length === 1 ? '' : 's'} to develop, and ${missing.length} missing requirement${missing.length === 1 ? '' : 's'}.</p></div>`
}

function platformCareerPage(id) {
  if (!id) return careerPage(id)
  const career = careers.find(item => item.id === id) || careers[0]
  return `<a href="#/careers" class="text-muted-custom">← Back to careers</a><div class="panel rounded-4 p-4 p-md-5 mt-3"><div class="kicker">Career details</div><div class="d-flex justify-content-between gap-3 flex-wrap"><h1 class="display-6 fw-bold mt-2">${h(career.title)}</h1><span class="badge badge-soft rounded-pill h-100 p-3">${matchCareer(career)}% match</span></div><p class="lead text-muted-custom mt-3">${h(career.description)}</p><div class="d-flex gap-2 mt-4"><a class="btn btn-gradient" href="#/career-match/${career.id}">Check my match</a></div></div><div class="row g-4 mt-1"><div class="col-lg-6"><div class="panel rounded-4 p-4"><h2 class="h5">What this professional does</h2>${list(career.responsibilities)}</div></div><div class="col-lg-6"><div class="panel rounded-4 p-4"><h2 class="h5">Required skills</h2><div class="d-flex flex-wrap gap-2 mt-3">${career.skills.map(skill => `<span class="badge badge-soft rounded-pill p-2">${h(skill)}</span>`).join('')}</div></div></div><div class="col-md-4"><div class="panel rounded-4 p-4"><h2 class="h5">Popular tools</h2>${list(career.tools)}</div></div><div class="col-md-4"><div class="panel rounded-4 p-4"><h2 class="h5">Related roles</h2>${list(['Specialist', `Senior ${career.title}`, `Lead ${career.title}`])}</div></div><div class="col-md-4"><div class="panel rounded-4 p-4"><h2 class="h5">Recommended companies</h2>${list(career.companies)}</div></div></div>`
}

function platformRoadmap() {
  const career = careers.find(c => c.id === selectedCareerId()) || careers[0]
  const phases = [...career.roadmap.beginner, ...career.roadmap.intermediate, ...career.roadmap.advanced].map((title, index) => ({ title, phase: `Phase ${index + 1}` }))
  const completed = phases.filter(phase => roadmapState[`${career.id}:${phase.phase}`]).length
  return `<div class="mb-4"><div class="kicker">Personalized learning roadmap</div><h1 class="h2 fw-bold mt-2">${h(career.title)} learning track</h1><p class="text-muted-custom">${completed} of ${phases.length} phases completed (${Math.round(completed / phases.length * 100)}%). All phases start unticked.</p></div>${phases.map(phase => `<div class="panel rounded-4 p-4 mb-3"><div class="d-flex justify-content-between align-items-center"><div><div class="kicker">${phase.phase}</div><h2 class="h5 mt-2">${h(phase.title)}</h2></div><label class="form-check"><input class="form-check-input roadmap-check" type="checkbox" data-career="${career.id}" data-phase="${phase.phase}" ${roadmapState[`${career.id}:${phase.phase}`] ? 'checked' : ''}> <span class="form-check-label">Completed</span></label></div><div class="row mt-3 small text-muted-custom"><div class="col-md-6">Topics and guided practice for ${h(phase.title)}.</div><div class="col-md-6">Project milestone: build a small portfolio piece.</div></div></div>`).join('')}`
}

function platformCompanies(id) {
  if (id) {
    const company = companies.find(item => item.id === id) || companies[0]
    return `<a href="#/companies" class="text-muted-custom">← Back to companies</a><div class="panel rounded-4 p-4 p-md-5 mt-3"><div class="kicker">Company profile</div><h1 class="display-6 fw-bold mt-2">${h(company.name)}</h1><p class="text-muted-custom">${h(company.industry)} · ${h(company.location)}</p><p class="lead text-muted-custom mt-4">${h(company.description)}</p><div class="row g-3 mt-3"><div class="col-md-4">${metric('Profile match', `${company.match}%`, 'recommended fit')}</div><div class="col-md-4">${metric('Expected CTC', company.ctc, 'typical range')}</div><div class="col-md-4">${metric('Experience', company.experience[1], 'role dependent')}</div></div></div><div class="row g-4 mt-1"><div class="col-md-6"><div class="panel rounded-4 p-4"><h2 class="h5">Hiring positions</h2>${list(company.roles)}</div></div><div class="col-md-6"><div class="panel rounded-4 p-4"><h2 class="h5">Skills this company hires for</h2>${list(company.skills)}</div></div><div class="col-md-6"><div class="panel rounded-4 p-4 h-100"><h2 class="h5">Fresher eligibility criteria</h2><p class="small text-muted-custom">Academic thresholds and entry requirements</p>${list(company.eligibility)}</div></div><div class="col-md-6"><div class="panel rounded-4 p-4 h-100"><h2 class="h5">Experience requirements</h2><p class="small text-muted-custom">Requirements vary by role and hiring track</p>${list(company.experience)}</div></div><div class="col-md-6"><div class="panel rounded-4 p-4"><h2 class="h5">Company bond</h2><p class="text-muted-custom">Bond terms vary by role and offer. Always review the official offer letter before accepting.</p></div></div><div class="col-md-6"><div class="panel rounded-4 p-4"><h2 class="h5">Hiring process</h2>${list(company.rounds)}</div></div></div><div class="panel rounded-4 p-5 mt-4 text-center"><div class="kicker">Ready to apply?</div><h2 class="h4 mt-2">Start your ${h(company.name)} application</h2><p class="text-muted-custom">Continue to the official ${h(company.name)} careers website to view current openings and apply.</p><a class="btn btn-gradient btn-lg px-5 mt-2" href="${company.url}" target="_blank" rel="noreferrer">Apply to ${h(company.name)}</a></div>`
  }
  return `<div class="mb-4"><div class="kicker">Companies</div><h1 class="h2 fw-bold mt-2">Explore companies hiring for technology roles</h1><p class="text-muted-custom">Open any company to view positions, skills, eligibility, experience, and bond guidance.</p></div><div class="row g-4">${companies.map(company => `<div class="col-md-6 col-xl-4"><a class="panel card-link rounded-4 p-4 d-block h-100" href="#/companies/${company.id}"><div class="d-flex justify-content-between"><h2 class="h5">${h(company.name)}</h2><span class="badge badge-green rounded-pill">${company.match}% fit</span></div><div class="small text-muted-custom">${h(company.industry)} · ${h(company.location)}</div><p class="small mt-3">Positions: ${h(company.roles.join(', '))}</p><p class="small text-muted-custom">Skills: ${h(company.skills.join(', '))}</p><span class="text-cyan small">View company details →</span></a></div>`).join('')}</div>`
}

function platformProgress() {
  const data = dashboard()
  const career = careers.find(c => c.id === selectedCareerId()) || careers[0]
  const phaseCount = [...career.roadmap.beginner, ...career.roadmap.intermediate, ...career.roadmap.advanced].length
  const completed = Object.keys(roadmapState).filter(key => key.startsWith(`${career.id}:`) && roadmapState[key]).length
  const roadmapPercent = Math.round(completed / phaseCount * 100)
  const projectPercent = Math.min(100, profile.experience.length * 25)
  const assessmentIndex = Number(get('acn-assessment-index', 0))
  const assessmentPercent = assessmentIndex >= weeklyQuestions.length ? 100 : Math.round(assessmentIndex / weeklyQuestions.length * 100)
  return `<div class="mb-4"><div class="kicker">Progress tracking</div><h1 class="h2 fw-bold mt-2">Track your development journey</h1></div><div class="row g-3">${metric('Overall readiness', `${data.readiness}%`, 'profile health')}${metric('Profile completion', `${data.completion}%`, 'registration data')}${metric('Roadmap progress', `${roadmapPercent}%`, `${completed} of ${phaseCount} phases`)}${metric('Assessment progress', `${assessmentPercent}%`, 'weekly score')}</div><div class="panel rounded-4 p-4 mt-4"><h2 class="h5">Progress overview</h2>${[['Career readiness', data.readiness], ['Profile completion', data.completion], ['Roadmap progress', roadmapPercent], ['Projects and experience', projectPercent], ['Assessment progress', assessmentPercent]].map(([name, value]) => `<div class="mt-4"><div class="d-flex justify-content-between small"><span>${name}</span><span>${value}%</span></div><div class="progress mt-2" style="height:10px"><div class="progress-bar" style="width:${value}%"></div></div></div>`).join('')}</div>`
}

function platformDashboard() {
  const data = dashboard()
  const rec = recommendations()
  const greeting = get('acn-new-user', false) ? `Welcome ${h(profile.name)}!` : `Welcome back, ${h(profile.name.split(' ')[0])}.`
  return `<div class="d-flex justify-content-between align-items-start mb-4"><div><div class="kicker">Dashboard</div><h1 class="h2 fw-bold mt-2">${greeting}</h1></div><a href="#/assessment" class="btn btn-outline-light">Start weekly assessment</a></div><div class="row g-3 mb-4"><div class="col-md-6 col-xl-3">${metric('Career readiness', `${data.readiness}%`, 'overall score')}</div><div class="col-md-6 col-xl-3">${metric('Top career match', `${data.top.match}%`, data.top.title)}</div><div class="col-md-6 col-xl-3">${metric('Skills', profile.skills.length, 'tracked skills')}</div><div class="col-md-6 col-xl-3">${metric('Learning progress', `${data.learning}%`, 'advanced skills')}</div></div><div class="row g-4"><div class="col-xl-7"><div class="panel rounded-4 p-4"><div class="d-flex justify-content-between"><h2 class="h5">Career match comparison</h2><span class="small text-muted-custom">Current ranking</span></div>${rec.map(c => `<div class="mt-4"><div class="d-flex justify-content-between small"><span>${h(c.title)}</span><span class="text-cyan">${c.match}%</span></div><div class="progress mt-2" style="height:10px"><div class="progress-bar" style="width:${c.match}%"></div></div></div>`).join('')}</div></div><div class="col-xl-5"><div class="panel rounded-4 p-4 h-100"><h2 class="h5">Skill proficiency</h2>${profile.skills.map(s => `<div class="mt-4"><div class="d-flex justify-content-between small"><span>${h(s.name)}</span><span>${score[s.proficiency] * 33}%</span></div><div class="progress mt-2" style="height:8px"><div class="progress-bar" style="width:${score[s.proficiency] * 33}%"></div></div></div>`).join('')}</div></div></div><div class="panel rounded-4 p-4 mt-4"><h2 class="h5">Top recommendations</h2>${rec.map(c => `<a href="#/careers/${c.id}" class="d-block border-bottom py-3" style="border-color:var(--line)!important"><div class="d-flex justify-content-between"><strong>${h(c.title)}</strong><span class="text-cyan">${c.match}%</span></div><div class="small text-muted-custom mt-1">Open the career page to check this specific match and skill gap.</div></a>`).join('')}</div></div>`
}

function platformRender() {
  if (location.hash === '#platform') {
    document.getElementById('app').innerHTML = platformLanding()
    platformBind()
    requestAnimationFrame(() => document.getElementById('platform')?.scrollIntoView({ behavior: 'smooth' }))
    return
  }
  const route = location.hash.slice(2) || ''
  const parts = route.split('/')
  let page
  if (!route) page = platformLanding()
  else if (parts[0] === 'login') page = platformAuth(false)
  else if (parts[0] === 'register') page = platformAuth(true)
  else {
    const pages = { dashboard: platformDashboard, profile: profilePage, assessment: platformAssessment, careers: () => platformCareerPage(parts[1]), 'career-match': () => platformCareerMatch(parts[1]), 'skill-gap': platformSkillGap, roadmap: platformRoadmap, companies: () => platformCompanies(parts[1]), progress: platformProgress, settings: settingsPage }
    page = platformShell((pages[parts[0]] || platformDashboard)())
  }
  document.getElementById('app').innerHTML = page
  platformBind()
}

function profileFromForm(form) {
  const formData = new FormData(form)
  const read = name => String(formData.get(name) || '').trim()
  return { name: read('name'), email: read('email'), college: read('college'), degree: read('degree'), branch: read('branch'), location: read('location'), age: read('age'), currentYear: read('currentYear'), graduationYear: read('graduationYear'), cgpa: read('cgpa'), role: read('role'), preferredLocation: read('preferredLocation'), industry: read('industry') }
}

function platformBind() {
  document.querySelectorAll('[data-scroll-platform]').forEach(link => link.onclick = event => { event.preventDefault(); document.getElementById('platform')?.scrollIntoView({ behavior: 'smooth' }) })
  document.querySelectorAll('[data-action="logout"]').forEach(button => button.onclick = () => { localStorage.removeItem('acn-user'); localStorage.removeItem('acn-new-user'); location.hash = '#/login' })
  document.querySelectorAll('.required-choice').forEach(select => select.onchange = () => { const other = document.querySelector(`[name="${select.name}Other"]`); if (other) other.classList.toggle('d-none', select.value !== 'Other'); if (other) other.required = select.value === 'Other' })
  document.querySelectorAll('.register-skill').forEach(check => check.onchange = () => { const level = document.querySelector(`[data-skill="${CSS.escape(check.value)}"]`); if (level) { level.disabled = !check.checked; level.required = check.checked } })
  document.querySelectorAll('[data-assessment-answer]').forEach(button => button.onclick = () => { const index = Number(get('acn-assessment-index', 0)); const answersForWeek = get('acn-assessment-answers', {}); answersForWeek[index] = button.dataset.assessmentAnswer; set('acn-assessment-answers', answersForWeek); set('acn-assessment-index', index + 1); platformRender() })
  document.querySelectorAll('.roadmap-check').forEach(check => check.onchange = () => { roadmapState[`${check.dataset.career}:${check.dataset.phase}`] = check.checked; set('acn-roadmap', roadmapState); platformRender() })
  const authForm = document.getElementById('authForm')
  if (authForm) authForm.querySelectorAll('[required]').forEach(field => { field.required = false })
  if (authForm) authForm.onsubmit = event => {
    event.preventDefault()
    const data = profileFromForm(authForm)
    const accounts = get('acn-accounts', [])
    const error = document.getElementById('authError')
    if (location.hash === '#/login') {
      const username = String(new FormData(authForm).get('username') || '').trim().toLowerCase()
      const password = String(new FormData(authForm).get('password') || '')
      const account = accounts.find(item => item.username === username && item.password === password)
      if (!account) { error.textContent = 'No username and password found. Please register first.'; return }
      profile = account.profile; set('acn-profile', profile); set('acn-user', profile.name); set('acn-new-user', false); location.hash = '#/dashboard'; return
    }
    const formData = new FormData(authForm)
    const username = String(formData.get('username') || '').trim().toLowerCase()
    const password = String(formData.get('password') || '')
    const invalidOther = [...document.querySelectorAll('.required-choice')].some(select => select.value === 'Other' && !String(formData.get(`${select.name}Other`) || '').trim())
    const missing = Object.entries(data).some(([, value]) => !value) || invalidOther || !formData.get('degree') || !formData.get('branch') || !formData.get('location') || !formData.get('role') || !formData.get('industry') || !document.querySelector('.register-skill:checked')
    if (missing) { error.textContent = 'Please enter the complete data and select at least one skill.'; return }
    if (accounts.some(item => item.username === username)) { error.textContent = 'This username is already registered. Please log in.'; return }
    const valueOrOther = name => formData.get(name) === 'Other' ? String(formData.get(`${name}Other`) || '').trim() : String(formData.get(name) || '').trim()
    const skills = [...document.querySelectorAll('.register-skill:checked')].map(check => ({ name: check.value, proficiency: document.querySelector(`[data-skill="${CSS.escape(check.value)}"]`).value }))
    profile = { ...defaultProfile, id: `student-${Date.now()}`, name: data.name, age: Number(data.age), email: data.email, college: data.college, degree: valueOrOther('degree'), branch: valueOrOther('branch'), location: valueOrOther('location'), currentYear: data.currentYear, graduationYear: Number(data.graduationYear), cgpa: Number(data.cgpa), skills, interests: [], experience: [], careerPreferences: { preferredRole: valueOrOther('role'), preferredIndustry: valueOrOther('industry'), preferredLocation: data.preferredLocation, workMode: 'Hybrid', salaryRange: '', companySize: 'Mid-size', higherStudiesOrJob: 'Job' } }
    set('acn-accounts', [...accounts, { username, password, profile }]); set('acn-profile', profile); set('acn-user', profile.name); set('acn-new-user', true); location.hash = '#/dashboard'
  }
}

window.removeEventListener('hashchange', render)
window.addEventListener('hashchange', platformRender)
platformRender()
