function applyEmailAuth() {
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.textContent.trim() === 'Career Assessment') link.textContent = 'Weekly Assessment'
  })

  const form = document.getElementById('authForm')
  if (!form) return

  const isRegister = location.hash === '#/register'
  const oldUsername = form.querySelector('[name="username"]')
  if (isRegister && oldUsername) oldUsername.closest('.col-md-6')?.remove()
  if (!isRegister) {
    const emailInput = oldUsername
    if (emailInput) {
      emailInput.name = 'email'
      emailInput.type = 'email'
      emailInput.placeholder = 'you@example.com'
      emailInput.closest('label').firstChild.textContent = 'Email'
    }
  }

  const sideCopy = [...document.querySelectorAll('p')].find(item => item.textContent.includes('return with your username'))
  if (sideCopy) sideCopy.textContent = 'Create your account once, then return with your email and password.'
  document.querySelectorAll('.text-muted-custom').forEach(item => {
    if (item.textContent.includes('username and password')) item.textContent = 'Use the email and password you saved during registration.'
  })
  document.querySelectorAll('*').forEach(item => {
    if (item.childElementCount === 0 && item.textContent.includes('username and password')) item.textContent = 'Use the email and password you saved during registration.'
  })

  form.querySelectorAll('[required]').forEach(field => { field.required = false })
  form.onsubmit = event => {
    event.preventDefault()
    const formData = new FormData(form)
    const error = document.getElementById('authError')
    const accounts = get('acn-accounts', [])
    const email = String(formData.get('email') || '').trim().toLowerCase()
    const password = String(formData.get('password') || '')

    if (!isRegister) {
      const account = accounts.find(item => (item.email || item.profile?.email || '').toLowerCase() === email && item.password === password)
      if (!account) {
        error.textContent = 'No email and password found. Please register first.'
        return
      }
      profile = account.profile
      set('acn-profile', profile)
      set('acn-user', profile.name)
      set('acn-new-user', false)
      location.hash = '#/dashboard'
      return
    }

    const data = profileFromForm(form)
    const invalidOther = [...form.querySelectorAll('.required-choice')].some(select => select.value === 'Other' && !String(formData.get(`${select.name}Other`) || '').trim())
    const missing = Object.entries(data).some(([, value]) => !value) || invalidOther || !email || !password || !formData.get('degree') || !formData.get('branch') || !formData.get('location') || !formData.get('role') || !formData.get('industry') || !form.querySelector('.register-skill:checked')
    if (missing) {
      error.textContent = 'Please enter the complete data and select at least one skill.'
      return
    }
    if (accounts.some(item => (item.email || item.profile?.email || '').toLowerCase() === email)) {
      error.textContent = 'This email is already registered. Please log in.'
      return
    }

    const valueOrOther = name => formData.get(name) === 'Other' ? String(formData.get(`${name}Other`) || '').trim() : String(formData.get(name) || '').trim()
    const skills = [...form.querySelectorAll('.register-skill:checked')].map(check => ({
      name: check.value,
      proficiency: form.querySelector(`[data-skill="${CSS.escape(check.value)}"]`).value,
    }))
    profile = {
      ...defaultProfile,
      id: `student-${Date.now()}`,
      name: data.name,
      age: Number(data.age),
      email,
      college: data.college,
      degree: valueOrOther('degree'),
      branch: valueOrOther('branch'),
      location: valueOrOther('location'),
      currentYear: data.currentYear,
      graduationYear: Number(data.graduationYear),
      cgpa: Number(data.cgpa),
      skills,
      interests: [],
      experience: [],
      careerPreferences: {
        preferredRole: valueOrOther('role'),
        preferredIndustry: valueOrOther('industry'),
        preferredLocation: data.preferredLocation,
        workMode: 'Hybrid',
        salaryRange: '',
        companySize: 'Mid-size',
        higherStudiesOrJob: 'Job',
      },
    }
    set('acn-accounts', [...accounts, { email, password, profile }])
    set('acn-profile', profile)
    set('acn-user', profile.name)
    set('acn-new-user', true)
    location.hash = '#/dashboard'
  }
}

applyEmailAuth()
window.addEventListener('hashchange', () => setTimeout(applyEmailAuth, 0))
