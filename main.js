// ...existing code...

// Initialize UI from constants
document.addEventListener('DOMContentLoaded', () => {
  // Header
  document.getElementById('nav-name').textContent = PROFILE.name;
  document.getElementById('footer-name').textContent = PROFILE.name;
  document.getElementById('footer-year').textContent = new Date().getFullYear();

  // Hero
  document.getElementById('hero-title').textContent = `${PROFILE.name} — ${PROFILE.title}`;
  document.getElementById('hero-intro').textContent = PROFILE.shortIntro;
  const heroTag = document.getElementById('hero-tagline');
  if (heroTag) heroTag.textContent = PROFILE.tagline || '';

  // Resume
  const resumeBtn = document.getElementById('download-resume');
  const introResumeBtn = document.getElementById('intro-download-resume');
  if (resumeBtn) {
    resumeBtn.setAttribute('href', PROFILE.resumeUrl);
    resumeBtn.setAttribute('download', 'resume.pdf');
    resumeBtn.setAttribute('target', '_blank');
    resumeBtn.setAttribute('rel', 'noopener noreferrer');
    resumeBtn.setAttribute('aria-label', 'Download resume');
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }
  if (introResumeBtn) {
    introResumeBtn.setAttribute('href', PROFILE.resumeUrl);
    introResumeBtn.setAttribute('download', 'resume.pdf');
    introResumeBtn.setAttribute('target', '_blank');
    introResumeBtn.setAttribute('rel', 'noopener noreferrer');
  }

  // Contact info
  const contactInfo = document.getElementById('contact-info');
  const contactDetails = document.getElementById('contact-details');
  contactInfo && (contactInfo.textContent = `${PROFILE.contact.location} • ${PROFILE.contact.email} `);
  if (contactDetails) {
    contactDetails.innerHTML = `
      <div>Email: <a href="mailto:${PROFILE.contact.email}" id="contact-email-link">${PROFILE.contact.email}</a> <button id="copy-email" class="btn btn-sm btn-outline-secondary ms-2">Copy</button></div>
      <div class="mt-1">Phone: <a href="tel:${PROFILE.contact.phone}" id="contact-phone-link">${PROFILE.contact.phone}</a></div>
    `;
    const copyBtn = document.getElementById('copy-email');
    copyBtn && copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(PROFILE.contact.email);
        copyBtn.textContent = 'Copied';
        setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
      } catch (err) {
        alert('Copy failed.');
      }
    });
  }
  const contactList = document.getElementById('contact-list');
  if (contactList) {
    PROFILE.contact.links.forEach(link => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="${link.url}" target="_blank" rel="noreferrer" class="text-decoration-none">${link.label}</a>`;
      contactList.appendChild(li);
    });
  }

  // Experience cards (detailed rendering happens later)
  const expList = document.getElementById('experience-list');


  // Timeline render inside Experience
  const timelineList = document.getElementById('timeline-list');
  if (timelineList && PROFILE.timeline) {
    PROFILE.timeline.forEach((t, idx) => {
      const item = document.createElement('div');
      // alternate left/right
      const side = (idx % 2 === 0) ? 'left' : 'right';
      item.className = `timeline-item ${side} bg-white shadow-sm work`;
      item.setAttribute('data-idx', idx);
      item.style.opacity = '0';
      item.style.transform = 'translateY(10px)';

      // briefcase icon for work timeline
      const iconSVG = `
        <div class="icon" role="img" aria-label="Work experience">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M6 7V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 11v2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15 11v2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      `;

      item.innerHTML = `
        ${iconSVG}
        <span class="date-badge">${t.date}</span>
        <h3 class="h6 fw-semibold mb-1">${t.title}</h3>
        <p class="mb-0">${t.details}</p>
      `;
      timelineList.appendChild(item);
    });
  }

  function revealItem(item) {
    if (item.dataset.revealed) return;
    const rect = item.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      item.dataset.revealed = '1';
      item.style.transition = 'opacity .45s ease, transform .45s ease';
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({behavior:'smooth', block:'start'});
        history.replaceState(null, '', href);
      }
    });
  });

  // Highlight nav on scroll
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('nav .nav-link');
  function onScroll() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollPos && (sec.offsetTop + sec.offsetHeight) > scrollPos) {
        navLinks.forEach(l => l.classList.remove('active'));
        const link = document.querySelector(`nav a[href="#${sec.id}"]`);
        if (link) link.classList.add('active');
      }
    });

    // Reveal timeline items when visible
    document.querySelectorAll('.timeline-item').forEach(item => {
      revealItem(item);
    });
  }

  window.addEventListener('scroll', onScroll);
  onScroll();

  // Contact form
  const form = document.getElementById('contact-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      alert('Please fill all fields.');
      return;
    }

    // If Google Form configured, send to it
    if (PROFILE.googleForm && PROFILE.googleForm.action) {
      const formData = new URLSearchParams();
      formData.append(PROFILE.googleForm.fields.name, name);
      formData.append(PROFILE.googleForm.fields.email, email);
      formData.append(PROFILE.googleForm.fields.message, message);

      fetch(PROFILE.googleForm.action, { method: 'POST', mode: 'no-cors', body: formData })
        .then(() => alert('Thank you — your message was recorded.'))
        .catch(() => alert('Submission recorded (or blocked by CORS).'));
      form.reset();
      return;
    }

    // Fallback: open mailto with prefilled content
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(message + '\n\n' + `From: ${name} <${email}>`);
    window.location.href = `mailto:${PROFILE.contact.email}?subject=${subject}&body=${body}`;
  });

  // Set up View Summary button and modal (content pre-populated above)
  // No additional click handler necessary because Bootstrap opens the modal and content is set.

  // Render Skills
  const skillsList = document.getElementById('skills-list');
  if (skillsList && PROFILE.skills) {
    PROFILE.skills.forEach(skill => {
      const span = document.createElement('span');
      span.className = 'badge skill-badge px-3 py-2 mb-1 fw-semibold';
      span.textContent = skill;
      span.setAttribute('tabindex', '0');
      span.setAttribute('role', 'button');
      span.setAttribute('aria-label', `Skill: ${skill}`);
      span.title = skill;
      skillsList.appendChild(span);
    });
  }

  // Skill filter behavior
  let activeSkill = null;
  function filterExperiencesBySkill(skill) {
    const cols = document.querySelectorAll('#experience-list [data-exp-idx]');
    cols.forEach(col => {
      const idx = Number(col.getAttribute('data-exp-idx'));
      const exp = PROFILE.experiences[idx];
      const hay = (exp.summary + ' ' + exp.details.join(' ') + ' ' + exp.company + ' ' + exp.role).toLowerCase();
      if (!skill) {
        col.style.display = '';
        col.classList.remove('highlight');
        return;
      }
      const match = hay.indexOf(skill.toLowerCase()) !== -1;
      col.style.display = match ? '' : 'none';
      if (match) col.classList.add('highlight'); else col.classList.remove('highlight');
    });
  }

  // Attach click handlers to skill badges (delegated)
  document.getElementById('skills-list')?.addEventListener('click', (e) => {
    const target = e.target.closest('.skill-badge');
    if (!target) return;
    const skill = target.textContent.trim();
    if (activeSkill === skill) {
      // clear
      activeSkill = null;
      document.querySelectorAll('.skill-badge.active').forEach(b => b.classList.remove('active'));
      filterExperiencesBySkill(null);
    } else {
      activeSkill = skill;
      document.querySelectorAll('.skill-badge.active').forEach(b => b.classList.remove('active'));
      target.classList.add('active');
      filterExperiencesBySkill(skill);
    }
  });

  // Render Education Timeline
  const eduTimelineList = document.getElementById('education-timeline-list');
  if (eduTimelineList && PROFILE.education) {
    PROFILE.education.forEach((edu, idx) => {
      const item = document.createElement('div');
      const side = (idx % 2 === 0) ? 'left' : 'right';
      item.className = `timeline-item ${side} bg-white shadow-sm`;

      const gradIcon = `
        <div class="icon" role="img" aria-label="Education">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 3L1 9l11 6 9-4.91V17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 8v6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      `;

      // show percentage if available
      const percentageHtml = edu.percentage ? `
        <div class="mt-2 d-flex align-items-center gap-2">
          <div class="edu-percentage small text-muted">${edu.percentage}</div>
          ${/\d+(\.\d+)?%/.test(String(edu.percentage)) ? `<div class="edu-progress" aria-hidden="true"><div class="edu-progress-fill" style="width:${String(edu.percentage).replace('%','')}%;"></div></div>` : ''}
        </div>
      ` : '';

      item.innerHTML = `
        ${gradIcon}
        <span class="date-badge">${edu.period}</span>
        <h3 class="h6 fw-semibold mb-1">${edu.degree}</h3>
        <p class="mb-0">${edu.school}</p>
        ${percentageHtml}
      `;
      eduTimelineList.appendChild(item);
    });
  }

  // Enhanced Experience cards with details
  expList.innerHTML = '';
  PROFILE.experiences.forEach((exp, expIdx) => {
    const col = document.createElement('div');
    col.className = 'col-md-12';
    col.setAttribute('data-exp-idx', String(expIdx));

    // Build details list with collapse for long lists
    const visibleCount = 3;
    const hasMore = exp.details && exp.details.length > visibleCount;
    const detailsHtml = exp.details.map((d, i) => `
        <li class="exp-detail-item" ${i >= visibleCount ? 'data-hidden="1" style="display:none"' : ''}>${d}</li>
      `).join('');

    col.innerHTML = `
      <div class="card p-4 h-100 mb-3">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h3 class="h5 fw-bold mb-0">${exp.role} <a target="_blank" href="${exp.link}"><span class="text-primary">@ ${exp.company}</span></a></h3>
          <span class="text-muted small">${exp.period}</span>
        </div>
        <div class="mb-2 text-secondary small">${exp.location}</div>
        <div class="mb-2">${exp.summary}</div>
        <ul class="mb-0 ps-3 exp-details-list">
          ${detailsHtml}
        </ul>
        ${hasMore ? '<div class="mt-3"><button class="btn btn-sm btn-outline-primary show-more-btn" type="button">Show more</button></div>' : ''}
      </div>
    `;
    expList.appendChild(col);
    // Toggle logic for show more
    if (hasMore) {
      const btn = col.querySelector('.show-more-btn');
      const hiddenItems = col.querySelectorAll('.exp-detail-item[data-hidden="1"]');
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('data-expanded') === '1';
        hiddenItems.forEach(it => { it.style.display = expanded ? 'none' : 'list-item'; });
        btn.textContent = expanded ? 'Show more' : 'Show less';
        btn.setAttribute('data-expanded', expanded ? '0' : '1');
      });
    }
  });
});
