// =====================================================
// 1. THEME TOGGLE
// =====================================================
const themeBtn = document.getElementById('themeBtn');
const html = document.documentElement;

if (localStorage.getItem('theme') === 'dark') {
  html.setAttribute('data-theme', 'dark');
  themeBtn.textContent = '☀️';
}

themeBtn.addEventListener('click', () => {
  const isDark = html.getAttribute('data-theme') === 'dark';
  if (isDark) {
    html.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
    themeBtn.textContent = '🌙';
  } else {
    html.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    themeBtn.textContent = '☀️';
  }
});

// =====================================================
// 2. MOBILE MENU
// =====================================================
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');

burger.addEventListener('click', () => {
  menu.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('open');
  });
});

// =====================================================
// 3. ACTIVE NAV LINK
// =====================================================
window.addEventListener('scroll', () => {
  let current = '';
  document.querySelectorAll('section').forEach(section => {
    const sectionTop = section.offsetTop;
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').slice(1) === current) {
      link.classList.add('active');
    }
  });
});

// =====================================================
// 4. TYPING EFFECT
// =====================================================
const typingElement = document.getElementById('typing');
const texts = [
  'Web Developer',
  'UI/UX Enthusiast',
  'Problem Solver',
  'Tech Lover'
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
  const currentText = texts[textIndex];
  
  if (!isDeleting && charIndex < currentText.length) {
    typingElement.textContent += currentText.charAt(charIndex);
    charIndex++;
    setTimeout(type, 100);
  } else if (isDeleting && charIndex > 0) {
    typingElement.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;
    setTimeout(type, 50);
  } else if (!isDeleting && charIndex === currentText.length) {
    isDeleting = true;
    setTimeout(type, 2000);
  } else if (isDeleting && charIndex === 0) {
    textIndex = (textIndex + 1) % texts.length;
    isDeleting = false;
    setTimeout(type, 500);
  }
}

type();

// =====================================================
// 5. SCROLL ANIMATION (REVEAL)
// =====================================================
const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.15 });

reveals.forEach(reveal => observer.observe(reveal));

// =====================================================
// 6. TOP BUTTON
// =====================================================
const topBtn = document.getElementById('top');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    topBtn.classList.add('show');
  } else {
    topBtn.classList.remove('show');
  }
});

topBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// =====================================================
// 7. TASK MANAGER
// =====================================================
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const emptyMsg = document.getElementById('emptyMsg');
const msg = document.getElementById('msg');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  updateStats();
  renderTasks();
}

function updateStats() {
  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;
  const pending = tasks.filter(t => !t.completed).length;
  const late = tasks.filter(t => !t.completed && new Date(t.deadline) < new Date()).length;

  document.getElementById('total').textContent = total;
  document.getElementById('selesai').textContent = done;
  document.getElementById('proses').textContent = pending;
  document.getElementById('tunda').textContent = late;

  const progress = total > 0 ? (done / total) * 100 : 0;
  document.getElementById('progBar').style.width = progress + '%';
}

function getDeadlineClass(deadline) {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffTime < 0) return 'late';
  if (diffDays <= 3) return 'soon';
  return '';
}

function renderTasks() {
  taskList.innerHTML = '';
  
  if (tasks.length === 0) {
    emptyMsg.style.display = 'block';
    return;
  }
  
  emptyMsg.style.display = 'none';

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = task.completed ? 'done' : '';
    
    const deadlineClass = getDeadlineClass(task.deadline);
    const deadlineDate = new Date(task.deadline).toLocaleDateString('id-ID');
    
    li.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''} 
        onchange="toggleTask(${index})">
      <div class="meta">
        <b>${task.name}</b>
        <span class="badge ${task.priority}">${task.priority}</span>
        <div class="cat">${task.course}</div>
        <div class="dl ${deadlineClass}">${deadlineDate}</div>
      </div>
      <div class="acts">
        <button onclick="deleteTask(${index})">Hapus</button>
      </div>
    `;
    
    taskList.appendChild(li);
  });
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
}

function deleteTask(index) {
  if (confirm('Hapus tugas ini?')) {
    tasks.splice(index, 1);
    saveTasks();
  }
}

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const taskName = document.getElementById('taskName').value.trim();
  const taskCourse = document.getElementById('taskCourse').value.trim();
  const taskDesc = document.getElementById('taskDesc').value.trim();
  const taskDeadline = document.getElementById('taskDeadline').value;
  const taskPriority = document.getElementById('taskPriority').value;
  
  if (!taskName || !taskCourse || !taskDeadline) {
    showMsg('Isi semua field yang diperlukan!', 'err');
    return;
  }
  
  const newTask = {
    name: taskName,
    course: taskCourse,
    desc: taskDesc,
    deadline: taskDeadline,
    priority: taskPriority,
    completed: false,
    createdAt: new Date().toISOString()
  };
  
  tasks.push(newTask);
  saveTasks();
  
  taskForm.reset();
  showMsg('Tugas berhasil ditambahkan!', 'ok');
});

function showMsg(text, type) {
  msg.textContent = text;
  msg.className = 'msg ' + type;
  setTimeout(() => {
    msg.textContent = '';
    msg.className = 'msg';
  }, 3000);
}

// Initialize
updateStats();
renderTasks();

// =====================================================
// 8. SKILL BAR ANIMATION
// =====================================================
const bars = document.querySelectorAll('.bar i');

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const width = entry.target.style.width;
      entry.target.style.width = '0';
      setTimeout(() => {
        entry.target.style.width = width;
      }, 100);
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

bars.forEach(bar => barObserver.observe(bar));

// =====================================================
// 9. SMOOTH SCROLL
// =====================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

console.log('Script loaded successfully!');
