// Dummy users (for reference, not used in logic)
const defaultUsers = {
    "admin": { password: "123", role: "admin" },
    "dr.john": { password: "456", role: "doctor" },
    "dr.smith": { password: "654", role: "doctor" },
    "dr.emily": { password: "321", role: "doctor" },
    "jane": { password: "789", role: "patient" },
    "hannah": { password: "bakit", role: "patient" },
    "jane.doe": { password: "password123", role: "patient" },
    "john.smith": { password: "password123", role: "patient" },
    "emily.clark": { password: "password123", role: "patient" },
    "mike.johnson": { password: "password123", role: "patient" },
    "anna.rivera": { password: "password123", role: "patient" },
    "lucy.lopez": { password: "password123", role: "patient" },
    "kirk": { password: "kirk", role: "patient" }
  };
  
  // Check login and role
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  
  if (!isLoggedIn || role !== 'doctor') {
    alert("Access denied. Doctors only.");
    window.location.href = 'login.html';
  }
  
  // Map usernames to display names
  const doctorMap = {
    "dr.john": "Dr. John",
    "dr.smith": "Dr. Smith",
    "dr.emily": "Dr. Emily"
  };
  
  const doctorName = doctorMap[username] || "Unknown Doctor";
  
  // Set doctor welcome header
  const heading = document.querySelector('h1');
  if (heading) heading.textContent = `Welcome, ${doctorName}`;
  
  // Reference to tbody
  const tbody = document.getElementById('all-appointments-body');
  
  // Load all appointments from localStorage (or dummy if none)
  let allAppointments = JSON.parse(localStorage.getItem('appointments')) || [];
  
  // If no appointments stored, create some dummy ones for demo:
  if (allAppointments.length === 0) {
    allAppointments = [
      { username: 'jane.doe', doctor: 'Dr. John', date: '2025-10-10', time: '10:00' },
      { username: 'mike.johnson', doctor: 'Dr. John', date: '2025-10-11', time: '11:00' },
      { username: 'anna.rivera', doctor: 'Dr. Smith', date: '2025-10-12', time: '09:00' },
      { username: 'lucy.lopez', doctor: 'Dr. Emily', date: '2025-10-13', time: '14:00' }
    ];
    localStorage.setItem('appointments', JSON.stringify(allAppointments));
  }
  
  // Filter appointments for this doctor
  const doctorAppointments = allAppointments.filter(app => app.doctor === doctorName);
  
  // Clear table body first
  tbody.innerHTML = '';
  
  if (doctorAppointments.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 4;
    td.style.textAlign = 'center';
    td.textContent = "No appointments assigned.";
    tr.appendChild(td);
    tbody.appendChild(tr);
  } else {
    doctorAppointments.forEach(app => {
      const tr = document.createElement('tr');
  
      const patientTd = document.createElement('td');
      patientTd.textContent = app.username || "Unknown Patient";
      tr.appendChild(patientTd);
  
      const doctorTd = document.createElement('td');
      doctorTd.textContent = app.doctor;
      tr.appendChild(doctorTd);
  
      const dateTd = document.createElement('td');
      dateTd.textContent = app.date;
      tr.appendChild(dateTd);
  
      const timeTd = document.createElement('td');
      timeTd.textContent = app.time;
      tr.appendChild(timeTd);
  
      tbody.appendChild(tr);
    });
  }
  
  // Logout button handler
  const logoutBtn = document.getElementById('logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.clear();
      window.location.href = 'login.html';
    });
  }
  