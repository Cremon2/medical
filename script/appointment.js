// AUTH CHECK
const username = localStorage.getItem('username');
const role = localStorage.getItem('role');
const isLoggedIn = localStorage.getItem('loggedIn') === 'true';

if (!isLoggedIn || role !== 'patient') {
  alert("Access denied. Only patients can book appointments.");
  window.location.href = 'login.html';
}

// DOM ELEMENTS
const appointmentKind = document.getElementById('appointment-kind');
const newForm = document.getElementById('new-patient-form');
const followForm = document.getElementById('follow-up-form');

const newSpecialty = document.getElementById('new-specialty');
const newDoctor = document.getElementById('new-doctor');
const newDate = document.getElementById('new-date');
const newTime = document.getElementById('new-time');
const newAck = document.getElementById('new-acknowledgment');
const newMessage = document.getElementById('new-message');

const followSpecialty = document.getElementById('follow-specialty');
const followDoctor = document.getElementById('follow-doctor');
const followDate = document.getElementById('follow-date');
const followTime = document.getElementById('follow-time');
const followMessage = document.getElementById('follow-message');

const appointmentList = document.getElementById('appointment-list');

// LOGOUT
document.getElementById('logout').addEventListener('click', e => {
  e.preventDefault();
  localStorage.clear();
  window.location.href = 'login.html';
});

// DOCTORS BY SPECIALTY
const doctorsBySpecialty = {
  "Ear, Nose, and Throat": ["Dr. John", "Dr. Emily"],
  "Family Medicine": ["Dr. Smith", "Dr. John"],
  "Geriatric Medicine": ["Dr. Emily"],
  "Internal Medicine": ["Dr. Smith"],
  "Ophthalmology": ["Dr. Emily"],
  "Pediatric Primary Care": ["Dr. John"],
  "Dermatology": ["Dr. Smith"],
  "Endocrinology": ["Dr. Emily"],
  "Nutrition": ["Dr. John"],
  "Palliative Medicine": ["Dr. Smith"]
};

// Populate Specialty Dropdowns
function populateSpecialties(select) {
  select.innerHTML = `<option value="">-- Choose Specialty --</option>`;
  Object.keys(doctorsBySpecialty).forEach(specialty => {
    const option = document.createElement('option');
    option.value = specialty;
    option.textContent = specialty;
    select.appendChild(option);
  });
}

// Populate Doctors
function updateDoctors(specialtySelect, doctorSelect) {
  const specialty = specialtySelect.value;
  doctorSelect.innerHTML = '<option value="">-- Choose Doctor --</option>';
  if (doctorsBySpecialty[specialty]) {
    doctorsBySpecialty[specialty].forEach(doc => {
      const option = document.createElement('option');
      option.value = doc;
      option.textContent = doc;
      doctorSelect.appendChild(option);
    });
  }
}

// Load Appointments
function loadAppointments() {
  const allAppointments = JSON.parse(localStorage.getItem('appointments')) || [];
  const userAppointments = allAppointments.filter(app => app.username === username);
  appointmentList.innerHTML = '';
  if (userAppointments.length === 0) {
    appointmentList.innerHTML = '<li>No appointments yet.</li>';
  } else {
    userAppointments.forEach(app => {
      const li = document.createElement('li');
      li.textContent = `${app.date} at ${app.time} with ${app.doctor} (${app.specialty}) - ${app.type}`;
      appointmentList.appendChild(li);
    });
  }
}

// Form Switching
appointmentKind.addEventListener('change', () => {
  const kind = appointmentKind.value;
  newForm.style.display = kind === 'new' ? 'block' : 'none';
  followForm.style.display = kind === 'follow-up' ? 'block' : 'none';
});

// Event Listeners
newSpecialty.addEventListener('change', () => updateDoctors(newSpecialty, newDoctor));
followSpecialty.addEventListener('change', () => updateDoctors(followSpecialty, followDoctor));

// Booking New Appointment
newForm.addEventListener('submit', e => {
  e.preventDefault();
  if (!newAck.checked) {
    newMessage.style.color = 'red';
    newMessage.textContent = 'You must acknowledge the disclosure.';
    return;
  }

  const appointment = {
    username,
    type: 'New Patient',
    specialty: newSpecialty.value,
    doctor: newDoctor.value,
    date: newDate.value,
    time: newTime.value
  };

  saveAppointment(appointment);
  newForm.reset();
  newDoctor.innerHTML = '<option value="">-- Choose Doctor --</option>';
  newMessage.style.color = 'green';
  newMessage.textContent = 'New patient appointment booked.';
  loadAppointments();
});

// Booking Follow-Up Appointment
followForm.addEventListener('submit', e => {
  e.preventDefault();

  const appointment = {
    username,
    type: 'Follow-Up',
    specialty: followSpecialty.value,
    doctor: followDoctor.value,
    date: followDate.value,
    time: followTime.value
  };

  saveAppointment(appointment);
  followForm.reset();
  followDoctor.innerHTML = '<option value="">-- Choose Doctor --</option>';
  followMessage.style.color = 'green';
  followMessage.textContent = 'Follow-up appointment booked.';
  loadAppointments();
});

// Save to localStorage
function saveAppointment(appointment) {
  const allAppointments = JSON.parse(localStorage.getItem('appointments')) || [];
  allAppointments.push(appointment);
  localStorage.setItem('appointments', JSON.stringify(allAppointments));
}

// INIT
populateSpecialties(newSpecialty);
populateSpecialties(followSpecialty);
loadAppointments();
