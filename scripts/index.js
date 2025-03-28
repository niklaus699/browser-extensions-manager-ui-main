// We'll store our extensions data here after fetch
let extensionsData = [];

// Keep track of the current filter
let currentFilter = 'all';

document.addEventListener("DOMContentLoaded", function () {
  // Fetch JSON data
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      extensionsData = data;
      displayTools(data, currentFilter);
    })
    .catch((error) => console.error("Error loading JSON:", error));

  // Filter buttons
  const allBtn = document.getElementById('allBtn');
  const activeBtn = document.getElementById('activeBtn');
  const inactiveBtn = document.getElementById('inactiveBtn');

  allBtn.addEventListener('click', () => {
    currentFilter = 'all';
    setActiveFilterBtn(allBtn);
    displayTools(extensionsData, 'all');
  });

  activeBtn.addEventListener('click', () => {
    currentFilter = 'active';
    setActiveFilterBtn(activeBtn);
    displayTools(extensionsData, 'active');
  });

  inactiveBtn.addEventListener('click', () => {
    currentFilter = 'inactive';
    setActiveFilterBtn(inactiveBtn);
    displayTools(extensionsData, 'inactive');
  });

  // Theme toggle
  const themeToggleBtn = document.getElementById('themeToggle');
  themeToggleBtn.addEventListener('click', toggleTheme);
});

/**
 * Displays tools in #tools-container according to the specified filter
 * @param {Array} data - The array of extensions
 * @param {String} filter - 'all', 'active', or 'inactive'
 */
function displayTools(data, filter) {
  const container = document.getElementById("tools-container");
  container.innerHTML = "";

  data.forEach((tool, index) => {
    // Decide if this tool should be displayed
    if (
      filter === "all" ||
      (filter === "active" && tool.isActive) ||
      (filter === "inactive" && !tool.isActive)
    ) {
      const toolCard = document.createElement("div");
      toolCard.classList.add("tool-card");

      toolCard.innerHTML = `
        <div class="tool-header">
        <img src="${tool.logo}" alt="${tool.name}" class="tool-logo" />
        <div class="tool-info">
        <h2 class="tool-name">${tool.name}</h2>
        <p class="tool-description">${tool.description}</p></div></div>
        <div class="card-actions">
          <!-- Remove Button -->
          <button class="remove-btn">Remove</button>
          <!-- Active Toggle -->
          <label class="switch">
            <input type="checkbox" ${tool.isActive ? "checked" : ""} data-index="${index}" />
            <span class="slider"></span>
          </label>
        </div>
      `;

      // Attach event listeners
      const removeBtn = toolCard.querySelector(".remove-btn");
      removeBtn.addEventListener("click", () => {
        // Option 1: Remove from DOM only
        container.removeChild(toolCard);

        // Option 2 (optional): Also remove from data array if you want to fully remove it
        // data.splice(index, 1);
      });

      const toggleInput = toolCard.querySelector('input[type="checkbox"]');
      toggleInput.addEventListener("change", (e) => {
        const idx = e.target.dataset.index;
        // Update the isActive property in the original data
        extensionsData[idx].isActive = e.target.checked;

        // If we want to immediately re-filter on toggle to hide or show the card
        // according to the current filter:
        if (currentFilter === 'active' && !e.target.checked) {
          // card was active but is toggled off
          container.removeChild(toolCard);
        } else if (currentFilter === 'inactive' && e.target.checked) {
          // card was inactive but is toggled on
          container.removeChild(toolCard);
        }
      });

      container.appendChild(toolCard);
    }
  });
}

/**
 * Sets the clicked filter button as active (highlighted)
 * and clears the others.
 */
function setActiveFilterBtn(btn) {
  document.querySelectorAll('.filter-btn').forEach(button => {
    button.classList.remove('active');
  });
  btn.classList.add('active');
}

/**
 * Toggles between light and dark themes
 */
function toggleTheme() {
  const body = document.body;
  const currentTheme = body.getAttribute('data-theme');
  const themeToggleIcon = document.getElementById('themeToggleIcon');

  if (currentTheme === 'light') {
    body.setAttribute('data-theme', 'dark');
    themeToggleIcon.src = './assets/images/icon-sun.svg';
    themeToggleIcon.alt = 'Switch to light mode';
  } else {
    body.setAttribute('data-theme', 'light');
    themeToggleIcon.src = './assets/images/icon-moon.svg';
    themeToggleIcon.alt = 'Switch to dark mode';
  }
}
