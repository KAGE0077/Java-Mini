/* =========================================================================
   CampusShield — script.js
   Shared behavior across pages: dashboard rendering, sidebar/nav,
   toasts, and the incident report form (validation + image preview + popup)
   Runs safely on any page — every block checks that its elements exist
   before wiring up, so one script.js file works across the whole app.
   ========================================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     TOAST NOTIFICATIONS (used across pages)
     --------------------------------------------------------------------- */
  const toastStack = document.getElementById("toastStack");

  function showToast(message, type) {
    if (!toastStack) return;
    type = type || "primary";
    const toast = document.createElement("div");
    toast.className = "toast " + type;
    toast.innerHTML =
      '<i class="fa-solid fa-circle-info"></i><span>' + message + "</span>";

    toastStack.appendChild(toast);

    setTimeout(function () {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(24px)";
      setTimeout(function () { toast.remove(); }, 250);
    }, 3200);
  }

  /* ---------------------------------------------------------------------
     MOBILE SIDEBAR TOGGLE (used across pages with a sidebar)
     --------------------------------------------------------------------- */
  const sidebar = document.getElementById("sidebar");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileOverlay = document.getElementById("mobileOverlay");

  function openMobileSidebar() {
    if (sidebar) sidebar.classList.add("mobile-open");
    if (mobileOverlay) mobileOverlay.classList.add("active");
  }

  function closeMobileSidebar() {
    if (sidebar) sidebar.classList.remove("mobile-open");
    if (mobileOverlay) mobileOverlay.classList.remove("active");
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener("click", openMobileSidebar);
  if (mobileOverlay) mobileOverlay.addEventListener("click", closeMobileSidebar);

  /* ---------------------------------------------------------------------
     NOTIFICATION BELL (used across pages with a navbar)
     --------------------------------------------------------------------- */
  const notificationBtn = document.getElementById("notificationBtn");
  const notificationDot = document.getElementById("notificationDot");

  if (notificationBtn) {
    notificationBtn.addEventListener("click", function () {
      if (notificationDot) notificationDot.style.display = "none";
      showToast("Your incident INC-1041 was assigned to campus security.", "primary");
    });
  }

  /* ---------------------------------------------------------------------
     SIDEBAR NAV LINKS (Report Incident / Logout — used across pages)
     --------------------------------------------------------------------- */
  const newIncidentBtn = document.getElementById("newIncidentBtn");
  const reportIncidentLink = document.getElementById("reportIncidentLink");
  const logoutLink = document.getElementById("logoutLink");

  if (newIncidentBtn) {
    newIncidentBtn.addEventListener("click", function () {
      window.location.href = "report-incident.html";
    });
  }

  if (reportIncidentLink) {
    reportIncidentLink.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "report-incident.html";
    });
  }

  if (logoutLink) {
    logoutLink.addEventListener("click", function (e) {
      e.preventDefault();
      showToast("Signing you out...", "warning");
      setTimeout(function () {
        window.location.href = "index.html";
      }, 900);
    });
  }

  /* =======================================================================
     DASHBOARD PAGE — sample data, stat cards, incidents table, search
     ======================================================================= */
  const tableBody = document.getElementById("incidentsTableBody");

  if (tableBody) {
    const incidents = [
      { id: "INC-1042", title: "Broken streetlight near Block C", location: "Block C, Parking Lot", priority: "Low", status: "Resolved", date: "2026-08-18" },
      { id: "INC-1041", title: "Suspicious person near library entrance", location: "Central Library", priority: "High", status: "In Progress", date: "2026-08-19" },
      { id: "INC-1040", title: "Fire alarm malfunction", location: "Hostel Block B, 2nd Floor", priority: "Critical", status: "Assigned", date: "2026-08-20" },
      { id: "INC-1039", title: "Bicycle theft reported", location: "Bike Stand, Gate 2", priority: "Medium", status: "Reported", date: "2026-08-20" },
      { id: "INC-1038", title: "Water leakage in corridor", location: "Academic Block A", priority: "Low", status: "Resolved", date: "2026-08-17" },
      { id: "INC-1037", title: "Unauthorized vehicle in no-parking zone", location: "Main Gate", priority: "Medium", status: "In Progress", date: "2026-08-21" },
      { id: "INC-1036", title: "Harassment complaint", location: "Sports Complex", priority: "Critical", status: "Assigned", date: "2026-08-21" },
      { id: "INC-1035", title: "Damaged CCTV camera", location: "Parking Lot, Block D", priority: "High", status: "Reported", date: "2026-08-22" }
    ];

    const priorityBadgeMap = {
      "Low": "badge-success",
      "Medium": "badge-yellow",
      "High": "badge-orange",
      "Critical": "badge-danger"
    };

    const statusBadgeMap = {
      "Reported": "badge-gray",
      "Assigned": "badge-blue",
      "In Progress": "badge-orange",
      "Resolved": "badge-success"
    };

    const tableSummary = document.getElementById("tableSummary");
    const searchInput = document.getElementById("searchInput");

    const statTotal = document.getElementById("statTotal");
    const statReported = document.getElementById("statReported");
    const statInProgress = document.getElementById("statInProgress");
    const statResolved = document.getElementById("statResolved");

    function formatDate(isoDate) {
      const d = new Date(isoDate + "T00:00:00");
      return d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
    }

    function renderTable(data) {
      tableBody.innerHTML = "";

      if (data.length === 0) {
        tableBody.innerHTML =
          '<tr><td colspan="6" style="text-align:center; padding:32px; color:var(--color-text-muted);">No incidents found.</td></tr>';
        if (tableSummary) tableSummary.textContent = "Showing 0 of " + incidents.length + " incidents";
        return;
      }

      data.forEach(function (item) {
        const priorityClass = priorityBadgeMap[item.priority] || "badge-gray";
        const statusClass = statusBadgeMap[item.status] || "badge-gray";

        const row = document.createElement("tr");
        row.innerHTML =
          "<td><strong>" + item.id + "</strong></td>" +
          "<td>" + item.title + "</td>" +
          "<td>" + item.location + "</td>" +
          '<td><span class="badge ' + priorityClass + '">' + item.priority + "</span></td>" +
          '<td><span class="badge ' + statusClass + '">' + item.status + "</span></td>" +
          "<td>" + formatDate(item.date) + "</td>";

        tableBody.appendChild(row);
      });

      if (tableSummary) {
        tableSummary.textContent = "Showing " + data.length + " of " + incidents.length + " incidents";
      }
    }

    function animateCount(el, target) {
      if (!el) return;
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 20));
      const interval = setInterval(function () {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        el.textContent = current;
      }, 30);
    }

    function renderStats() {
      const total = incidents.length;
      const reported = incidents.filter(function (i) { return i.status === "Reported"; }).length;
      const inProgress = incidents.filter(function (i) {
        return i.status === "In Progress" || i.status === "Assigned";
      }).length;
      const resolved = incidents.filter(function (i) { return i.status === "Resolved"; }).length;

      animateCount(statTotal, total);
      animateCount(statReported, reported);
      animateCount(statInProgress, inProgress);
      animateCount(statResolved, resolved);
    }

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        const query = searchInput.value.trim().toLowerCase();
        const filtered = incidents.filter(function (item) {
          return (
            item.id.toLowerCase().includes(query) ||
            item.title.toLowerCase().includes(query) ||
            item.location.toLowerCase().includes(query) ||
            item.priority.toLowerCase().includes(query) ||
            item.status.toLowerCase().includes(query)
          );
        });
        renderTable(filtered);
      });
    }

    renderStats();
    renderTable(incidents);
  }

  /* =======================================================================
     REPORT INCIDENT PAGE — validation, image preview, success popup
     ======================================================================= */
  const incidentForm = document.getElementById("incidentForm");

  if (incidentForm) {
    const titleInput = document.getElementById("incidentTitle");
    const categoryInput = document.getElementById("incidentCategory");
    const descriptionInput = document.getElementById("incidentDescription");
    const locationInput = document.getElementById("incidentLocation");
    const dateInput = document.getElementById("incidentDate");
    const timeInput = document.getElementById("incidentTime");
    const priorityInput = document.getElementById("incidentPriority");
    const imageInput = document.getElementById("incidentImage");

    const imagePreviewWrap = document.getElementById("imagePreviewWrap");
    const imagePreview = document.getElementById("imagePreview");
    const imagePlaceholder = document.getElementById("imagePlaceholder");
    const removeImageBtn = document.getElementById("removeImageBtn");

    const resetBtn = document.getElementById("resetFormBtn");
    const successModal = document.getElementById("successModal");
    const closeSuccessModalBtn = document.getElementById("closeSuccessModal");
    const successModalOkBtn = document.getElementById("successModalOkBtn");
    const successIncidentId = document.getElementById("successIncidentId");

    // Set default date to today, and cap it so future dates aren't picked
    if (dateInput) {
      const today = new Date().toISOString().split("T")[0];
      dateInput.max = today;
    }

    /* --- Field-level validation helpers --- */
    function setFieldError(inputEl, hasError, message) {
      if (!inputEl) return;
      const group = inputEl.closest(".form-group");
      inputEl.classList.toggle("is-invalid", hasError);
      if (group) {
        const errorEl = group.querySelector(".form-error");
        if (errorEl) {
          errorEl.style.display = hasError ? "flex" : "none";
          if (hasError && message) {
            errorEl.querySelector("span") ? (errorEl.querySelector("span").textContent = message) : (errorEl.textContent = message);
          }
        }
      }
    }

    function validateField(inputEl) {
      if (!inputEl) return true;
      const value = inputEl.value.trim();

      if (inputEl === titleInput) {
        const valid = value.length >= 5;
        setFieldError(inputEl, !valid, "Title must be at least 5 characters.");
        return valid;
      }
      if (inputEl === categoryInput) {
        const valid = value !== "";
        setFieldError(inputEl, !valid, "Please select a category.");
        return valid;
      }
      if (inputEl === descriptionInput) {
        const valid = value.length >= 15;
        setFieldError(inputEl, !valid, "Description must be at least 15 characters.");
        return valid;
      }
      if (inputEl === locationInput) {
        const valid = value.length >= 3;
        setFieldError(inputEl, !valid, "Please enter a valid location.");
        return valid;
      }
      if (inputEl === dateInput) {
        const valid = value !== "";
        setFieldError(inputEl, !valid, "Please select a date.");
        return valid;
      }
      if (inputEl === timeInput) {
        const valid = value !== "";
        setFieldError(inputEl, !valid, "Please select a time.");
        return valid;
      }
      if (inputEl === priorityInput) {
        const valid = value !== "";
        setFieldError(inputEl, !valid, "Please select a priority level.");
        return valid;
      }
      return true;
    }

    [titleInput, categoryInput, descriptionInput, locationInput, dateInput, timeInput, priorityInput]
      .forEach(function (field) {
        if (!field) return;
        field.addEventListener("blur", function () { validateField(field); });
        field.addEventListener("input", function () {
          if (field.classList.contains("is-invalid")) validateField(field);
        });
        field.addEventListener("change", function () {
          if (field.classList.contains("is-invalid")) validateField(field);
        });
      });

    /* --- Image upload + preview --- */
    if (imageInput) {
      imageInput.addEventListener("change", function () {
        const file = imageInput.files && imageInput.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
          showToast("Please upload a valid image file.", "danger");
          imageInput.value = "";
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          showToast("Image must be smaller than 5MB.", "warning");
          imageInput.value = "";
          return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
          if (imagePreview) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = "block";
          }
          if (imagePlaceholder) imagePlaceholder.style.display = "none";
          if (removeImageBtn) removeImageBtn.style.display = "inline-flex";
        };
        reader.readAsDataURL(file);
      });
    }

    if (removeImageBtn) {
      removeImageBtn.addEventListener("click", function () {
        if (imageInput) imageInput.value = "";
        if (imagePreview) {
          imagePreview.src = "";
          imagePreview.style.display = "none";
        }
        if (imagePlaceholder) imagePlaceholder.style.display = "flex";
        removeImageBtn.style.display = "none";
      });
    }

    /* --- Success modal helpers --- */
    function openSuccessModal(incidentId) {
      if (!successModal) return;
      if (successIncidentId) successIncidentId.textContent = incidentId;
      successModal.classList.add("active");
    }

    function closeSuccessModal() {
      if (!successModal) return;
      successModal.classList.remove("active");
    }

    if (closeSuccessModalBtn) closeSuccessModalBtn.addEventListener("click", closeSuccessModal);
    if (successModalOkBtn) {
      successModalOkBtn.addEventListener("click", function () {
        closeSuccessModal();
        window.location.href = "student-dashboard.html";
      });
    }
    if (successModal) {
      successModal.addEventListener("click", function (e) {
        if (e.target === successModal) closeSuccessModal();
      });
    }

    /* --- Reset form --- */
    function resetForm() {
      incidentForm.reset();
      [titleInput, categoryInput, descriptionInput, locationInput, dateInput, timeInput, priorityInput]
        .forEach(function (field) { setFieldError(field, false); });

      if (imagePreview) {
        imagePreview.src = "";
        imagePreview.style.display = "none";
      }
      if (imagePlaceholder) imagePlaceholder.style.display = "flex";
      if (removeImageBtn) removeImageBtn.style.display = "none";
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        resetForm();
        showToast("Form has been reset.", "primary");
      });
    }

    /* --- Submit handling --- */
    incidentForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const fieldsToValidate = [titleInput, categoryInput, descriptionInput, locationInput, dateInput, timeInput, priorityInput];
      const results = fieldsToValidate.map(validateField);
      const allValid = results.every(Boolean);

      if (!allValid) {
        showToast("Please fix the highlighted fields.", "danger");
        const firstInvalid = incidentForm.querySelector(".is-invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const submitBtn = document.getElementById("submitIncidentBtn");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Submitting...';
      }

      setTimeout(function () {
        const generatedId = "INC-" + Math.floor(1000 + Math.random() * 9000);

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit Report';
        }

        openSuccessModal(generatedId);
        resetForm();
      }, 1200);
    });
  }

  /* =======================================================================
     MY INCIDENTS PAGE — sample data, search, filters, pagination, view modal
     ======================================================================= */
  const myIncidentsTableBody = document.getElementById("myIncidentsTableBody");

  if (myIncidentsTableBody) {
    const allIncidents = [
      { id: "INC-1042", title: "Broken streetlight near Block C", category: "Infrastructure", location: "Block C, Parking Lot", priority: "Low", status: "Resolved", date: "2026-08-18", description: "Streetlight has been flickering and went out completely two nights ago, making the parking lot unsafe after dark." },
      { id: "INC-1041", title: "Suspicious person near library entrance", category: "Safety & Security", location: "Central Library", priority: "High", status: "In Progress", date: "2026-08-19", description: "An unidentified individual was seen loitering near the library entrance for over an hour, approaching students." },
      { id: "INC-1040", title: "Fire alarm malfunction", category: "Fire & Electrical", location: "Hostel Block B, 2nd Floor", priority: "Critical", status: "Assigned", date: "2026-08-20", description: "Fire alarm on the 2nd floor is triggering randomly at night, causing unnecessary evacuations." },
      { id: "INC-1039", title: "Bicycle theft reported", category: "Theft", location: "Bike Stand, Gate 2", priority: "Medium", status: "Reported", date: "2026-08-20", description: "A red mountain bike was stolen from the bike stand near Gate 2 between 2 PM and 5 PM." },
      { id: "INC-1038", title: "Water leakage in corridor", category: "Infrastructure", location: "Academic Block A", priority: "Low", status: "Resolved", date: "2026-08-17", description: "Ceiling leak causing water to pool in the main corridor of Academic Block A, first floor." },
      { id: "INC-1037", title: "Unauthorized vehicle in no-parking zone", category: "Safety & Security", location: "Main Gate", priority: "Medium", status: "In Progress", date: "2026-08-21", description: "A delivery van has been repeatedly parking in the fire lane near the main gate, blocking access." },
      { id: "INC-1036", title: "Harassment complaint", category: "Harassment", location: "Sports Complex", priority: "Critical", status: "Assigned", date: "2026-08-21", description: "A student reported being verbally harassed by a group near the sports complex changing rooms." },
      { id: "INC-1035", title: "Damaged CCTV camera", category: "Infrastructure", location: "Parking Lot, Block D", priority: "High", status: "Reported", date: "2026-08-22", description: "CCTV camera covering the Block D parking lot appears to be physically damaged and non-functional." },
      { id: "INC-1034", title: "Food poisoning cases reported", category: "Health & Medical", location: "Main Canteen", priority: "High", status: "In Progress", date: "2026-08-16", description: "Multiple students reported nausea and stomach pain after eating lunch at the main canteen." },
      { id: "INC-1033", title: "Laptop stolen from library", category: "Theft", location: "Central Library, 3rd Floor", priority: "Medium", status: "Resolved", date: "2026-08-14", description: "A student's laptop was stolen from a study desk on the 3rd floor while they stepped away briefly." },
      { id: "INC-1032", title: "Exposed electrical wiring", category: "Fire & Electrical", location: "Workshop Building", priority: "Critical", status: "Assigned", date: "2026-08-15", description: "Exposed wiring near the workshop entrance poses an electrocution risk, especially during rain." },
      { id: "INC-1031", title: "Elevator stuck between floors", category: "Infrastructure", location: "Hostel Block A", priority: "High", status: "Resolved", date: "2026-08-12", description: "Elevator in Hostel Block A got stuck between the 3rd and 4th floors with two students inside." },
      { id: "INC-1030", title: "Verbal altercation in cafeteria", category: "Safety & Security", location: "Student Cafeteria", priority: "Low", status: "Resolved", date: "2026-08-10", description: "A minor verbal dispute broke out between two students during lunch hours, resolved by staff." },
      { id: "INC-1029", title: "Missing ID card reported as stolen", category: "Theft", location: "Admin Block", priority: "Low", status: "Reported", date: "2026-08-22", description: "Student reports their ID card was taken from their bag while in the admin block waiting area." },
      { id: "INC-1028", title: "Gas smell near chemistry lab", category: "Fire & Electrical", location: "Science Block, Lab 3", priority: "Critical", status: "In Progress", date: "2026-08-13", description: "A strong gas odor was detected near Lab 3 in the science block; area has been cordoned off." }
    ];

    const priorityBadgeMap = {
      "Low": "badge-success",
      "Medium": "badge-yellow",
      "High": "badge-orange",
      "Critical": "badge-danger"
    };

    const statusBadgeMap = {
      "Reported": "badge-gray",
      "Assigned": "badge-blue",
      "In Progress": "badge-orange",
      "Resolved": "badge-success"
    };

    const searchInput = document.getElementById("myIncidentsSearch");
    const priorityFilter = document.getElementById("priorityFilter");
    const statusFilter = document.getElementById("statusFilter");
    const tableSummary = document.getElementById("myIncidentsSummary");
    const paginationControls = document.getElementById("paginationControls");

    const viewModal = document.getElementById("viewIncidentModal");
    const closeViewModalBtn = document.getElementById("closeViewModal");
    const viewModalCloseFooterBtn = document.getElementById("viewModalCloseFooterBtn");

    const PAGE_SIZE = 5;
    let currentPage = 1;

    function formatDate(isoDate) {
      const d = new Date(isoDate + "T00:00:00");
      return d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
    }

    function getFilteredIncidents() {
      const query = (searchInput ? searchInput.value.trim().toLowerCase() : "");
      const priorityValue = priorityFilter ? priorityFilter.value : "";
      const statusValue = statusFilter ? statusFilter.value : "";

      return allIncidents.filter(function (item) {
        const matchesQuery =
          !query ||
          item.id.toLowerCase().includes(query) ||
          item.title.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query);

        const matchesPriority = !priorityValue || item.priority === priorityValue;
        const matchesStatus = !statusValue || item.status === statusValue;

        return matchesQuery && matchesPriority && matchesStatus;
      });
    }

    function renderPagination(filteredCount) {
      if (!paginationControls) return;
      const totalPages = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE));
      if (currentPage > totalPages) currentPage = totalPages;

      paginationControls.innerHTML = "";

      const prevBtn = document.createElement("button");
      prevBtn.className = "page-btn";
      prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
      prevBtn.disabled = currentPage === 1;
      prevBtn.addEventListener("click", function () {
        if (currentPage > 1) { currentPage--; renderAll(); }
      });
      paginationControls.appendChild(prevBtn);

      for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.className = "page-btn" + (i === currentPage ? " active" : "");
        pageBtn.textContent = i;
        pageBtn.addEventListener("click", function () {
          currentPage = i;
          renderAll();
        });
        paginationControls.appendChild(pageBtn);
      }

      const nextBtn = document.createElement("button");
      nextBtn.className = "page-btn";
      nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
      nextBtn.disabled = currentPage === totalPages;
      nextBtn.addEventListener("click", function () {
        if (currentPage < totalPages) { currentPage++; renderAll(); }
      });
      paginationControls.appendChild(nextBtn);
    }

    function openViewModal(item) {
      if (!viewModal) return;
      document.getElementById("viewModalId").textContent = item.id;
      document.getElementById("viewModalTitle").textContent = item.title;
      document.getElementById("viewModalCategory").textContent = item.category;
      document.getElementById("viewModalLocation").textContent = item.location;
      document.getElementById("viewModalDate").textContent = formatDate(item.date);
      document.getElementById("viewModalDescription").textContent = item.description;

      const priorityBadge = document.getElementById("viewModalPriority");
      priorityBadge.textContent = item.priority;
      priorityBadge.className = "badge " + (priorityBadgeMap[item.priority] || "badge-gray");

      const statusBadge = document.getElementById("viewModalStatus");
      statusBadge.textContent = item.status;
      statusBadge.className = "badge " + (statusBadgeMap[item.status] || "badge-gray");

      viewModal.classList.add("active");
    }

    function closeViewModal() {
      if (viewModal) viewModal.classList.remove("active");
    }

    if (closeViewModalBtn) closeViewModalBtn.addEventListener("click", closeViewModal);
    if (viewModalCloseFooterBtn) viewModalCloseFooterBtn.addEventListener("click", closeViewModal);
    if (viewModal) {
      viewModal.addEventListener("click", function (e) {
        if (e.target === viewModal) closeViewModal();
      });
    }

    function renderTable(filtered) {
      myIncidentsTableBody.innerHTML = "";

      if (filtered.length === 0) {
        myIncidentsTableBody.innerHTML =
          '<tr><td colspan="8" style="text-align:center; padding:32px; color:var(--color-text-muted);">No incidents match your filters.</td></tr>';
        if (tableSummary) tableSummary.textContent = "Showing 0 of " + allIncidents.length + " incidents";
        return;
      }

      const startIndex = (currentPage - 1) * PAGE_SIZE;
      const pageItems = filtered.slice(startIndex, startIndex + PAGE_SIZE);

      pageItems.forEach(function (item) {
        const priorityClass = priorityBadgeMap[item.priority] || "badge-gray";
        const statusClass = statusBadgeMap[item.status] || "badge-gray";

        const row = document.createElement("tr");
        row.innerHTML =
          "<td><strong>" + item.id + "</strong></td>" +
          "<td>" + item.title + "</td>" +
          "<td>" + item.category + "</td>" +
          "<td>" + item.location + "</td>" +
          '<td><span class="badge ' + priorityClass + '">' + item.priority + "</span></td>" +
          '<td><span class="badge ' + statusClass + '">' + item.status + "</span></td>" +
          "<td>" + formatDate(item.date) + "</td>" +
          '<td><button class="btn btn-outline btn-sm view-btn" type="button"><i class="fa-solid fa-eye"></i> View</button></td>';

        row.querySelector(".view-btn").addEventListener("click", function () {
          openViewModal(item);
        });

        myIncidentsTableBody.appendChild(row);
      });

      if (tableSummary) {
        const startDisplay = startIndex + 1;
        const endDisplay = startIndex + pageItems.length;
        tableSummary.textContent =
          "Showing " + startDisplay + "–" + endDisplay + " of " + filtered.length + " incidents";
      }
    }

    function renderAll() {
      const filtered = getFilteredIncidents();
      renderTable(filtered);
      renderPagination(filtered.length);
    }

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        currentPage = 1;
        renderAll();
      });
    }
    if (priorityFilter) {
      priorityFilter.addEventListener("change", function () {
        currentPage = 1;
        renderAll();
      });
    }
    if (statusFilter) {
      statusFilter.addEventListener("change", function () {
        currentPage = 1;
        renderAll();
      });
    }

    renderAll();
  }
})();