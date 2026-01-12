const nameDisplay = document.getElementById('nameDisplay');
const emailDisplay = document.getElementById('emailDisplay');
const educationDisplay = document.getElementById('educationDisplay');
const skillsDisplay = document.getElementById('skillsDisplay');
const projectsDisplay = document.getElementById('projectsDisplay');
const linksDisplay = document.getElementById('linksDisplay');
const healthStatus = document.getElementById('healthStatus');
const profileForm = document.getElementById('profileForm');
const statusEl = document.getElementById('status');

async function checkHealth() {
  try {
    const res = await fetch('/health');
    if (!res.ok) throw new Error('Health check failed');
    const data = await res.json();
    healthStatus.classList.remove('offline');
    healthStatus.innerHTML =
      '<span class="badge-dot"></span><span>API healthy at ' + data.timestamp + '</span>';
  } catch (e) {
    healthStatus.classList.add('offline');
    healthStatus.innerHTML =
      '<span class="badge-dot"></span><span>API not reachable (check server)</span>';
  }
}

function renderProfile(p) {
  if (!p) return;
  nameDisplay.textContent = p.name || 'Unknown';
  emailDisplay.textContent = p.email || '';
  educationDisplay.textContent = p.education || '';

  skillsDisplay.innerHTML = '';
  (p.skills || []).forEach((s) => {
    const span = document.createElement('span');
    span.textContent = s;
    skillsDisplay.appendChild(span);
  });

  projectsDisplay.innerHTML = '';
  (p.projects || []).forEach((proj) => {
    const div = document.createElement('div');
    div.style.marginBottom = '6px';
    div.innerHTML =
      '<strong>' +
      (proj.title || '') +
      ':</strong> ' +
      (proj.description || '') +
      (proj.links && proj.links.length
        ? ' — ' +
          proj.links
            .map(
              (l) =>
                '<a href="' +
                l +
                '" target="_blank" rel="noreferrer">' +
                (new URL(l).hostname || 'link') +
                '</a>'
            )
            .join(' · ')
        : '');
    projectsDisplay.appendChild(div);
  });

  linksDisplay.innerHTML = '';
  if (p.workLinks?.github) {
    linksDisplay.innerHTML +=
      '<p><a href="' + p.workLinks.github + '" target="_blank">GitHub</a></p>';
  }
  if (p.workLinks?.linkedin) {
    linksDisplay.innerHTML +=
      '<p><a href="' + p.workLinks.linkedin + '" target="_blank">LinkedIn</a></p>';
  }
  if (p.workLinks?.portfolio) {
    linksDisplay.innerHTML +=
      '<p><a href="' + p.workLinks.portfolio + '" target="_blank">Portfolio</a></p>';
  }

  // Prefill form
  profileForm.name.value = p.name || '';
  profileForm.email.value = p.email || '';
  profileForm.education.value = p.education || '';
  profileForm.skills.value = (p.skills || []).join(', ');
  profileForm.projects.value = JSON.stringify(p.projects || [], null, 2);
  profileForm.github.value = p.workLinks?.github || '';
  profileForm.linkedin.value = p.workLinks?.linkedin || '';
  profileForm.portfolio.value = p.workLinks?.portfolio || '';
}

async function loadProfile() {
  try {
    const res = await fetch('/api/profile');
    if (!res.ok) throw new Error('Profile not found');
    const data = await res.json();
    renderProfile(data);
  } catch (e) {
    statusEl.textContent = 'No profile yet. Fill the form and save to create one.';
  }
}

profileForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusEl.textContent = 'Saving...';
  const projectsRaw = profileForm.projects.value.trim();
  let projects = [];
  if (projectsRaw) {
    try {
      projects = JSON.parse(projectsRaw);
    } catch (err) {
      statusEl.textContent = 'Projects must be valid JSON.';
      return;
    }
  }
  const payload = {
    name: profileForm.name.value.trim(),
    email: profileForm.email.value.trim(),
    education: profileForm.education.value.trim(),
    skills: profileForm.skills.value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    projects,
    workLinks: {
      github: profileForm.github.value.trim(),
      linkedin: profileForm.linkedin.value.trim(),
      portfolio: profileForm.portfolio.value.trim()
    }
  };

  try {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to save profile');
    }
    statusEl.textContent = 'Saved successfully.';
    renderProfile(data);
  } catch (err) {
    statusEl.textContent = err.message;
  }
});

checkHealth();
loadProfile();
