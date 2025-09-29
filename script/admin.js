// Sample patient data for reports
const reportsData = [
    { name: "Jane Doe", age: 28, gender: "Female", isPWD: false, isPregnant: true },
    { name: "John Smith", age: 65, gender: "Male", isPWD: true, isPregnant: false },
    { name: "Emily Clark", age: 34, gender: "Female", isPWD: false, isPregnant: false },
    { name: "Mike Johnson", age: 22, gender: "Male", isPWD: false, isPregnant: false },
    { name: "Anna Rivera", age: 45, gender: "Female", isPWD: true, isPregnant: false },
    { name: "Lucy Lopez", age: 30, gender: "Female", isPWD: false, isPregnant: true },
    { name: "kirk iglesia", age: 25, gender: "Male", isPWD: false, isPregnant: false },
    { name: "hannah", age: 20, gender: "Female", isPWD: false, isPregnant: false },
    { name: "jane", age: 25, gender: "Female", isPWD: false, isPregnant: false },
  ];
  
  // Default users synced with your data
  const defaultUsers = {
    admin: { password: "123", role: "admin" },
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
  
  // Logout elements
  const logoutItem = document.getElementById('logout-item');
  const logoutLink = document.getElementById('logout-link');
  
  // Helper: Capitalize first letter of a word
  function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
  
  // Generate report HTML (includes placeholders for charts)
  function generateReportHTML(data) {
    const totalFiles = data.length;
  
    return `
      <div class="report-summary">
        <h1>Check-Up Reports Summary</h1>
        <p><strong>Total Check-Up Records:</strong> ${totalFiles}</p>
  
        <div class="report-section">
          <h3>Gender Distribution</h3>
          <canvas id="genderChart"></canvas>
        </div>
  
        <div class="report-section">
          <h3>Age Groups</h3>
          <canvas id="ageGroupChart"></canvas>
        </div>
  
        <div class="report-section">
          <h3>Other Stats</h3>
          <canvas id="otherStatsChart" width="250" height="250"></canvas>
        </div>
  
        <div class="report-section">
          <h3>Raw Data</h3>
          <div class="table-container">
            <table class="report-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>PWD</th>
                  <th>Pregnant</th>
                </tr>
              </thead>
              <tbody>
                ${data.map(p => `
                  <tr>
                    <td>${p.name}</td>
                    <td>${p.age}</td>
                    <td>${p.gender}</td>
                    <td>${p.isPWD ? "Yes" : "No"}</td>
                    <td>${p.isPregnant ? "Yes" : "No"}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }
  
  // Render charts using Chart.js after report HTML injection
  function renderCharts(data) {
    // Gender distribution counts
    const genderCount = data.reduce((acc, p) => {
      acc[p.gender] = (acc[p.gender] || 0) + 1;
      return acc;
    }, {});
  
    // Gender Chart (doughnut)
    const genderCtx = document.getElementById('genderChart').getContext('2d');
    new Chart(genderCtx, {
      type: 'doughnut',
      data: {
        labels: ['Male', 'Female'],
        datasets: [{
          label: 'Gender Distribution',
          data: [genderCount["Male"] || 0, genderCount["Female"] || 0],
          backgroundColor: ['#36A2EB', '#FF6384'],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Gender Distribution' }
        }
      }
    });
  
    // Age groups counts
    const ageGroups = { "0-18": 0, "19-35": 0, "36-60": 0, "61+": 0 };
    data.forEach(p => {
      if (p.age <= 18) ageGroups["0-18"]++;
      else if (p.age <= 35) ageGroups["19-35"]++;
      else if (p.age <= 60) ageGroups["36-60"]++;
      else ageGroups["61+"]++;
    });
  
    // Age Group Chart (bar)
    const ageCtx = document.getElementById('ageGroupChart').getContext('2d');
    new Chart(ageCtx, {
      type: 'bar',
      data: {
        labels: Object.keys(ageGroups),
        datasets: [{
          label: 'Number of Patients',
          data: Object.values(ageGroups),
          backgroundColor: '#4BC0C0',
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Age Group Distribution' }
        },
        scales: {
          y: { beginAtZero: true, precision: 0 }
        }
      }
    });
  
    // Other Stats Pie Chart (PWDs, Pregnant, Others)
    const otherStatsCtx = document.getElementById('otherStatsChart').getContext('2d');
    new Chart(otherStatsCtx, {
      type: 'pie',
      data: {
        labels: ['PWDs', 'Pregnant Patients', 'Others'],
        datasets: [{
          label: 'Other Stats',
          data: [
            data.filter(p => p.isPWD).length,
            data.filter(p => p.isPregnant).length,
            data.length - data.filter(p => p.isPWD).length - data.filter(p => p.isPregnant).length
          ],
          backgroundColor: ['#FFCE56', '#FF6384', '#36A2EB'],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Other Stats Distribution' }
        }
      }
    });
  }
  
  // Content map for sidebar navigation
  const contentMap = {
    "manage-users": `
      <div class="section-content">
        <h1>Manage Users</h1>
        <p>Here you can add, edit, or delete users from the system.</p>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="user-list"></tbody>
        </table>
      </div>
    `,
    "view-reports": generateReportHTML(reportsData),
    "view-appointments": `
      <div class="section-content">
        <h1>View Appointments</h1>
        <p>Appointments functionality coming soon!</p>
      </div>
    `,
    "system-settings": `
      <div class="section-content">
        <h1>System Settings</h1>
        <p>Adjust system preferences and configurations here.</p>
        <form class="settings-form">
          <div class="form-group">
            <label>Site Title</label>
            <input type="text" value="MASS">
          </div>
          <div class="form-group">
            <label>Notification Email</label>
            <input type="email" value="admin@mass.com">
          </div>
          <button type="submit">Save Settings</button>
        </form>
      </div>
    `
  };
  
  // Populate the Manage Users table
  function populateUserTable(users) {
    const userList = document.getElementById("user-list");
    if (!userList) return;
  
    userList.innerHTML = '';
    Object.entries(users).forEach(([username, info]) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${username}</td>
        <td>${username}@mass.com</td>
        <td><span class="role-tag ${info.role.toLowerCase()}">${capitalize(info.role)}</span></td>
        <td>
          <button class="edit-btn" data-user="${username}">Edit</button>
          <button class="delete-btn" data-user="${username}">Delete</button>
        </td>
      `;
      userList.appendChild(row);
    });
  }
  
  // Sidebar navigation event listeners
  document.querySelectorAll('aside a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.getAttribute('data-section');
      const main = document.getElementById('main-content');
  
      main.innerHTML = contentMap[section] || "<h1>Section Not Found</h1>";
  
      // After content is injected:
      if (section === 'manage-users') {
        populateUserTable(defaultUsers);
      }
  
      if (section === 'view-reports') {
        // Render charts after a small delay to ensure canvas elements exist
        setTimeout(() => renderCharts(reportsData), 100);
      }
    });
  });
  
  // Logout event listener
  if (logoutLink) {
    logoutLink.addEventListener('click', function (e) {
      e.preventDefault();
      // Clear only relevant keys to preserve any other localStorage data
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
      window.location.href = 'login.html';
    });
  }
  
  // Show logout button if logged in; redirect if not logged in
  document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('loggedIn');
  
    if (isLoggedIn === 'true') {
      if (logoutItem) {
        logoutItem.style.display = 'inline'; // Or 'block' based on your layout
      }
    } else {
      // Redirect to login if not logged in
      window.location.href = 'login.html';
    }
  });
  