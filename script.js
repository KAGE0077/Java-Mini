/* =============================================================================
   CampusShield — script.js
   Shared front-end behavior for every page in the app.

   Every block below checks that the elements it needs actually exist on the
   current page before wiring anything up. That means this single file is
   safe to include on every page — a block simply does nothing on pages
   where its markup isn't present.

   Contents:
     1.  Sample Incident Data
     2.  Toast Notifications
     3.  Sidebar Toggle / Responsive Menu
     4.  Password Show / Hide
     5.  Form Validation
     6.  Image Preview (upload boxes)
     7.  Fake Dashboard Statistics (stat cards, bar chart, donut chart)
     8.  Search Tables
     9.  Filter Tables
     10. Delete Confirmation Modal
     11. Smooth Animations (fade-in on load / on scroll)
   ============================================================================= */

(function () {
  "use strict";

  /* ===========================================================================
     1. SAMPLE INCIDENT DATA
     A single in-memory dataset used to power every table, stat card, and
     chart across the app. In a real app this would come from a server.
     =========================================================================== */
  const sampleIncidents = [
    { id: "INC-1071", title: "Fire alarm triggered by burnt popcorn", student: "Neha Iyer", category: "Fire & Electrical", location: "Hostel Block D, 3rd Floor Kitchen", department: "Facilities & Maintenance", description: "The fire alarm on the 3rd floor went off around dinner time after someone burned popcorn in the shared kitchen. No actual fire, but the corridor filled with smoke and the alarm was very loud. Facilities should check if the smoke detector is overly sensitive.", priority: "Low", status: "Resolved", assignedTo: "Ramesh Gupta", date: "2026-08-23", time: "19:42", image: "" },
    { id: "INC-1070", title: "Two students in a physical altercation outside gym", student: "Arjun Rao", category: "Safety & Security", location: "Sports Complex, Main Entrance", department: "Campus Security", description: "Witnessed two students shoving each other and shouting near the gym entrance after a basketball match. A small crowd gathered. Security was not immediately visible in the area.", priority: "High", status: "In Progress", assignedTo: "Officer D. Singh", date: "2026-08-23", time: "17:10", image: "" },
    { id: "INC-1069", title: "Mold growing in hostel bathroom ceiling", student: "Sneha Kulkarni", category: "Infrastructure", location: "Hostel Block A, 2nd Floor Bathroom", department: "Facilities & Maintenance", description: "Noticed a large patch of black mold spreading across the bathroom ceiling, likely from a leak above. Smell is getting stronger and a few students have complained of headaches.", priority: "Medium", status: "Assigned", assignedTo: "Ramesh Gupta", date: "2026-08-22", time: "09:15", image: "" },
    { id: "INC-1068", title: "Wallet stolen from gym locker", student: "Vikram Chandra", category: "Theft", location: "Sports Complex, Locker Room", department: "Campus Security", description: "Left my wallet in a locker while playing badminton for about 45 minutes. Came back and the lock was tampered with and the wallet, along with cash and my ID card, was gone.", priority: "Medium", status: "Reported", assignedTo: "", date: "2026-08-22", time: "18:05", image: "" },
    { id: "INC-1067", title: "Inappropriate comments from senior in mess hall", student: "Ananya Das", category: "Harassment", location: "Main Mess Hall", department: "Student Affairs", description: "A senior student has repeatedly made unwelcome comments about my appearance while I was in line for dinner over the past week. It's making me uncomfortable eating there.", priority: "High", status: "Assigned", assignedTo: "Dr. Meena Pillai", date: "2026-08-21", time: "20:30", image: "" },
    { id: "INC-1066", title: "Exposed electrical wiring near water fountain", student: "Rohit Malhotra", category: "Fire & Electrical", location: "Academic Block B, Ground Floor", department: "Facilities & Maintenance", description: "There's a bundle of exposed wires hanging near the drinking water fountain outside room 108. Very dangerous given how close it is to water, especially during monsoon leaks.", priority: "Critical", status: "In Progress", assignedTo: "Suresh Yadav", date: "2026-08-21", time: "11:20", image: "" },
    { id: "INC-1065", title: "Student collapsed during morning run", student: "Priya Nair", category: "Health & Medical", location: "Campus Running Track", department: "Health Center", description: "A student fainted while jogging on the track early morning, possibly due to dehydration. Campus ambulance was called and the student was taken to the Health Center.", priority: "Critical", status: "Resolved", assignedTo: "Dr. Anil Kapoor", date: "2026-08-20", time: "06:45", image: "" },
    { id: "INC-1064", title: "Broken streetlight near Block C", student: "Riya Sharma", category: "Infrastructure", location: "Block C, Main Path", department: "Facilities & Maintenance", description: "The streetlight near the walkway between Block C and the parking lot has been out for over a week, making the path very dark and unsafe at night.", priority: "Medium", status: "In Progress", assignedTo: "Ramesh Gupta", date: "2026-08-20", time: "21:00", image: "" },
    { id: "INC-1063", title: "Suspicious person near hostel gate", student: "Riya Sharma", category: "Safety & Security", location: "Hostel Block B Gate", department: "Campus Security", description: "An unfamiliar man was seen loitering near the hostel gate for over 30 minutes, asking passing students questions about their room numbers. Felt unsafe and reported to the gate guard.", priority: "Critical", status: "Assigned", assignedTo: "Officer D. Singh", date: "2026-08-19", time: "22:15", image: "" },
    { id: "INC-1062", title: "Wi-Fi router sparking in common room", student: "Karan Mehta", category: "Fire & Electrical", location: "Hostel Block B Common Room", department: "IT Support", description: "The Wi-Fi router in the common room started sparking and gave off a burning smell. Unplugged it immediately and informed the warden.", priority: "Low", status: "Reported", assignedTo: "", date: "2026-08-19", time: "14:50", image: "" },
    { id: "INC-1061", title: "Laptop stolen from library", student: "Aman Verma", category: "Theft", location: "Central Library, 2nd Floor", department: "Campus Security", description: "Stepped away from my study desk for less than 10 minutes to return a book and my laptop was gone when I got back. No one at the nearby desks noticed anything unusual.", priority: "High", status: "Reported", assignedTo: "", date: "2026-08-18", time: "16:30", image: "" },
    { id: "INC-1060", title: "Elevator stuck between floors in Academic Block A", student: "Divya Menon", category: "Infrastructure", location: "Academic Block A, Elevator 2", department: "Facilities & Maintenance", description: "The elevator got stuck between the 2nd and 3rd floors with three students inside for about 15 minutes before maintenance arrived. It needs to be inspected before someone gets hurt.", priority: "High", status: "Resolved", assignedTo: "Suresh Yadav", date: "2026-08-17", time: "10:05", image: "" },
    { id: "INC-1059", title: "Short circuit in Lab 3", student: "Priya Nair", category: "Fire & Electrical", location: "Engineering Block, Lab 3", department: "Facilities & Maintenance", description: "A short circuit occurred at one of the workstations during a practical session, causing sparks and a brief power outage in the lab. No injuries, but equipment may be damaged.", priority: "Critical", status: "Resolved", assignedTo: "Suresh Yadav", date: "2026-08-16", time: "13:40", image: "" },
    { id: "INC-1058", title: "Harassment complaint in canteen", student: "Aman Verma", category: "Harassment", location: "Main Canteen", department: "Student Affairs", description: "Another student has been following me around the canteen and making unwanted remarks despite being asked to stop. Would like this addressed formally.", priority: "High", status: "In Progress", assignedTo: "Dr. Meena Pillai", date: "2026-08-15", time: "12:55", image: "" },
    { id: "INC-1057", title: "Water leak damaging hostel corridor ceiling", student: "Sneha Kulkarni", category: "Infrastructure", location: "Hostel Block C, 4th Floor", department: "Facilities & Maintenance", description: "Ceiling in the corridor is sagging and dripping water, likely from a burst pipe upstairs. Paint is peeling and a section of the floor is slippery.", priority: "Medium", status: "Assigned", assignedTo: "Ramesh Gupta", date: "2026-08-14", time: "08:20", image: "" },
    { id: "INC-1056", title: "Student fainted during lecture", student: "Priya Nair", category: "Health & Medical", location: "Lecture Hall 4", department: "Health Center", description: "A classmate suddenly fainted during a 90-minute lecture, possibly from low blood sugar. Health Center staff arrived quickly and took her for observation.", priority: "High", status: "Resolved", assignedTo: "Dr. Anil Kapoor", date: "2026-08-13", time: "11:15", image: "" },
    { id: "INC-1055", title: "Bike theft attempt caught on CCTV", student: "Vikram Chandra", category: "Theft", location: "North Parking Lot", department: "Campus Security", description: "Noticed someone trying to break the lock on my bicycle in the parking lot. They ran off when I shouted. Requesting security review the CCTV footage from that area.", priority: "Medium", status: "Assigned", assignedTo: "Officer D. Singh", date: "2026-08-12", time: "19:30", image: "" },
    { id: "INC-1054", title: "Gas smell near chemistry lab", student: "Rohit Malhotra", category: "Fire & Electrical", location: "Science Block, Chemistry Lab 1", department: "Facilities & Maintenance", description: "A strong gas smell was noticed in the corridor outside the chemistry lab before classes began. Lab was evacuated as a precaution while maintenance checked the lines.", priority: "Critical", status: "Resolved", assignedTo: "Suresh Yadav", date: "2026-08-11", time: "08:50", image: "" },
    { id: "INC-1053", title: "Leaking pipe flooding corridor", student: "Riya Sharma", category: "Infrastructure", location: "Hostel Block A, Ground Floor", department: "Facilities & Maintenance", description: "A burst pipe flooded the ground floor corridor overnight, soaking several students' shoes and bags left outside their rooms. Water has since been shut off.", priority: "Medium", status: "Resolved", assignedTo: "Ramesh Gupta", date: "2026-08-10", time: "07:00", image: "" },
    { id: "INC-1052", title: "Unknown person photographing students near library", student: "Ananya Das", category: "Safety & Security", location: "Central Library Entrance", department: "Campus Security", description: "A man not affiliated with the college was seen taking photos of students entering the library. He left when approached by a librarian. Several students felt uneasy.", priority: "High", status: "In Progress", assignedTo: "Officer D. Singh", date: "2026-08-09", time: "15:40", image: "" },
    { id: "INC-1051", title: "Bicycle stolen from parking lot", student: "Karan Mehta", category: "Theft", location: "North Parking Lot", department: "Campus Security", description: "My bicycle was stolen from the designated parking area overnight despite being locked. This is the third bike theft reported from this lot this month.", priority: "Medium", status: "Assigned", assignedTo: "Officer D. Singh", date: "2026-08-05", time: "07:30", image: "" },
    { id: "INC-1050", title: "Ragging incident reported by first-year student", student: "Aditya Joshi", category: "Harassment", location: "Hostel Block D, 1st Floor", department: "Student Affairs", description: "A first-year student reported being forced to do humiliating tasks by seniors in the hostel common area. This needs urgent attention as per anti-ragging policy.", priority: "Critical", status: "In Progress", assignedTo: "Dr. Meena Pillai", date: "2026-08-04", time: "23:10", image: "" },
    { id: "INC-1049", title: "Ceiling fan fell in classroom", student: "Divya Menon", category: "Infrastructure", location: "Academic Block C, Room 210", department: "Facilities & Maintenance", description: "A ceiling fan detached and fell during a break, luckily when the room was empty. The mounting appeared rusted. Other fans in the building should be inspected too.", priority: "High", status: "Resolved", assignedTo: "Suresh Yadav", date: "2026-08-03", time: "13:00", image: "" },
    { id: "INC-1048", title: "Unattended bag near main gate", student: "Aman Verma", category: "Safety & Security", location: "Main Gate", department: "Campus Security", description: "Spotted an unattended backpack near the security checkpoint at the main gate for over 20 minutes with no owner in sight. Reported to the gate guard immediately.", priority: "Critical", status: "Resolved", assignedTo: "Officer D. Singh", date: "2026-08-02", time: "09:05", image: "" },
    { id: "INC-1047", title: "Allergic reaction after cafeteria meal", student: "Sneha Kulkarni", category: "Health & Medical", location: "Main Canteen", department: "Health Center", description: "Broke out in hives and had difficulty breathing shortly after eating a dish that likely contained peanuts despite it not being labeled. Needed emergency treatment at the Health Center.", priority: "Critical", status: "Resolved", assignedTo: "Dr. Anil Kapoor", date: "2026-08-01", time: "13:25", image: "" },
    { id: "INC-1046", title: "Projector smoking in Seminar Hall 2", student: "Rohit Malhotra", category: "Fire & Electrical", location: "Academic Block A, Seminar Hall 2", department: "IT Support", description: "The ceiling-mounted projector started smoking mid-presentation and had to be switched off. Room was evacuated briefly as a precaution.", priority: "High", status: "Resolved", assignedTo: "Suresh Yadav", date: "2026-07-30", time: "10:40", image: "" },
    { id: "INC-1045", title: "Phone snatched near back gate", student: "Vikram Chandra", category: "Theft", location: "Back Gate, Near Bus Stop", department: "Campus Security", description: "A person on a motorbike snatched my phone while I was walking near the back gate around dusk. Did not get a clear look at the rider or the bike number.", priority: "High", status: "Assigned", assignedTo: "Officer D. Singh", date: "2026-07-29", time: "18:50", image: "" },
    { id: "INC-1044", title: "Broken glass panel in stairwell", student: "Neha Iyer", category: "Infrastructure", location: "Hostel Block D, Stairwell 2", department: "Facilities & Maintenance", description: "A glass panel in the stairwell railing is cracked and sharp edges are exposed. Students use these stairs constantly and it poses an injury risk.", priority: "Medium", status: "Reported", assignedTo: "", date: "2026-07-28", time: "16:15", image: "" },
    { id: "INC-1043", title: "Verbal altercation escalating outside admin block", student: "Arjun Rao", category: "Safety & Security", location: "Administrative Block, Entrance", department: "Campus Security", description: "A heated argument between two students over a parking spot escalated to shouting and shoving near the admin block entrance. Security intervened and separated them.", priority: "Medium", status: "Resolved", assignedTo: "Officer D. Singh", date: "2026-07-27", time: "14:20", image: "" },
    { id: "INC-1042", title: "Persistent burning smell in server room", student: "Aditya Joshi", category: "Fire & Electrical", location: "IT Building, Server Room", department: "IT Support", description: "Noticed a faint but persistent burning smell coming from the server room vents over the past two days. Concerned it could be an overheating unit.", priority: "High", status: "In Progress", assignedTo: "Suresh Yadav", date: "2026-07-26", time: "17:05", image: "" },
    { id: "INC-1041", title: "Missing textbooks from study room shelf", student: "Ananya Das", category: "Theft", location: "Central Library, Group Study Room 3", department: "Campus Security", description: "Left a set of three textbooks on the shelf in the group study room overnight for an exam the next morning, and they were gone when I returned.", priority: "Low", status: "Reported", assignedTo: "", date: "2026-07-25", time: "09:40", image: "" }
  ];

  /* ===========================================================================
     2. TOAST NOTIFICATIONS
     Small slide-in messages used across the app to confirm actions.
     =========================================================================== */
  const toastStack = document.getElementById("toastStack");

  function showToast(message, type) {
    if (!toastStack) return;
    type = type || "primary"; // primary | success | warning | danger

    const toast = document.createElement("div");
    toast.className = "toast " + type;
    toast.innerHTML =
      '<i class="fa-solid fa-circle-info"></i><span>' + message + "</span>";

    toastStack.appendChild(toast);

    // Auto-dismiss after a few seconds
    setTimeout(function () {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(24px)";
      setTimeout(function () { toast.remove(); }, 250);
    }, 3200);
  }

  /* ===========================================================================
     3. SIDEBAR TOGGLE / RESPONSIVE MENU
     Opens/closes the sidebar as an off-canvas menu on small screens.
     =========================================================================== */
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

  // Close the mobile menu automatically once a nav link is tapped
  if (sidebar) {
    sidebar.querySelectorAll(".nav-item").forEach(function (link) {
      link.addEventListener("click", closeMobileSidebar);
    });
  }

  /* ===========================================================================
     4. PASSWORD SHOW / HIDE
     Works for any password field wrapped with a toggle button that has a
     [data-target] attribute pointing at the input's id (see profile.html).
     =========================================================================== */
  document.querySelectorAll(".password-toggle-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const targetId = btn.getAttribute("data-target");
      const input = document.getElementById(targetId);
      if (!input) return;

      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";

      const icon = btn.querySelector("i");
      if (icon) icon.className = isHidden ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
      btn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
    });
  });

  /* ===========================================================================
     5. FORM VALIDATION
     Generic validators reused across the Report Incident form and the
     Profile forms. Each field's error message shows/hides via a
     ".form-error" element that already sits in the markup, toggled by an
     "error" class on the field's wrapper.
     =========================================================================== */

  function setFieldError(inputEl, hasError, wrapperEl) {
    const wrapper = wrapperEl || inputEl.closest(".form-group") || inputEl.closest(".field");
    if (wrapper) wrapper.classList.toggle("error", hasError);
  }

  function isNotEmpty(value) {
    return value.trim().length > 0;
  }

  function minLength(value, length) {
    return value.trim().length >= length;
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  // ---- Report Incident form ----
  const incidentForm = document.getElementById("incidentForm");
  if (incidentForm) {
    const titleInput = document.getElementById("incidentTitle");
    const categoryInput = document.getElementById("incidentCategory");
    const priorityInput = document.getElementById("incidentPriority");
    const descriptionInput = document.getElementById("incidentDescription");
    const locationInput = document.getElementById("incidentLocation");
    const dateInput = document.getElementById("incidentDate");
    const timeInput = document.getElementById("incidentTime");

    const incidentValidators = [
      { input: titleInput, check: function (v) { return minLength(v, 5); } },
      { input: categoryInput, check: isNotEmpty },
      { input: priorityInput, check: isNotEmpty },
      { input: descriptionInput, check: function (v) { return minLength(v, 15); } },
      { input: locationInput, check: isNotEmpty },
      { input: dateInput, check: isNotEmpty },
      { input: timeInput, check: isNotEmpty }
    ];

    // Re-validate a field live once it's already been flagged invalid once
    // (avoids nagging the user before they've even finished typing)
    incidentValidators.forEach(function (rule) {
      if (!rule.input) return;
      rule.input.addEventListener("input", function () {
        const wrapper = rule.input.closest(".form-group");
        if (wrapper && wrapper.classList.contains("error")) {
          setFieldError(rule.input, !rule.check(rule.input.value));
        }
      });
    });

    incidentForm.addEventListener("submit", function (e) {
      e.preventDefault();

      let formIsValid = true;
      incidentValidators.forEach(function (rule) {
        if (!rule.input) return;
        const valid = rule.check(rule.input.value);
        setFieldError(rule.input, !valid);
        if (!valid) formIsValid = false;
      });

      if (!formIsValid) {
        showToast("Please fix the highlighted fields.", "danger");
        return;
      }

      // Simulate submission and show the success popup with a generated ID
      const newId = "INC-" + (1000 + Math.floor(Math.random() * 9000));
      const successModal = document.getElementById("successModal");
      const successIncidentId = document.getElementById("successIncidentId");
      if (successIncidentId) successIncidentId.textContent = newId;
      if (successModal) successModal.classList.add("active");

      showToast("Incident report submitted successfully.", "success");
    });
  }

  // ---- Profile forms (Personal Info + Change Password) ----
  const personalInfoForm = document.getElementById("personalInfoForm");
  if (personalInfoForm) {
    const nameInput = document.getElementById("profileName");
    const emailInput = document.getElementById("profileEmail");
    const phoneInput = document.getElementById("profilePhone");
    const deptInput = document.getElementById("profileDepartment");

    const profileValidators = [
      { input: nameInput, check: function (v) { return minLength(v, 3); } },
      { input: emailInput, check: isValidEmail },
      { input: phoneInput, check: function (v) { return v.trim().replace(/\D/g, "").length >= 10; } },
      { input: deptInput, check: isNotEmpty }
    ];

    profileValidators.forEach(function (rule) {
      if (!rule.input) return;
      rule.input.addEventListener("input", function () {
        const wrapper = rule.input.closest(".form-group");
        if (wrapper && wrapper.classList.contains("error")) {
          setFieldError(rule.input, !rule.check(rule.input.value));
        }
      });
    });

    const saveProfileBtn = document.getElementById("saveProfileBtn");
    if (saveProfileBtn) {
      saveProfileBtn.addEventListener("click", function () {
        let formIsValid = true;

        profileValidators.forEach(function (rule) {
          if (!rule.input) return;
          const valid = rule.check(rule.input.value);
          setFieldError(rule.input, !valid);
          if (!valid) formIsValid = false;
        });

        // Password fields are optional — only validate if the user typed one
        const currentPassword = document.getElementById("currentPassword");
        const newPassword = document.getElementById("newPassword");
        const confirmPassword = document.getElementById("confirmPassword");

        if (newPassword && newPassword.value.trim().length > 0) {
          const currentValid = currentPassword && isNotEmpty(currentPassword.value);
          const newValid = minLength(newPassword.value, 8);
          const confirmValid = confirmPassword && confirmPassword.value === newPassword.value;

          if (currentPassword) setFieldError(currentPassword, !currentValid);
          setFieldError(newPassword, !newValid);
          if (confirmPassword) setFieldError(confirmPassword, !confirmValid);

          if (!currentValid || !newValid || !confirmValid) formIsValid = false;
        }

        if (!formIsValid) {
          showToast("Please fix the highlighted fields.", "danger");
          return;
        }

        showToast("Profile updated successfully.", "success");
      });
    }

    const cancelProfileBtn = document.getElementById("cancelProfileBtn");
    if (cancelProfileBtn) {
      cancelProfileBtn.addEventListener("click", function () {
        personalInfoForm.reset();
        const passwordForm = document.getElementById("passwordForm");
        if (passwordForm) passwordForm.reset();
        document.querySelectorAll(".form-group.error").forEach(function (el) {
          el.classList.remove("error");
        });
        showToast("Changes discarded.", "primary");
      });
    }
  }

  /* ===========================================================================
     6. IMAGE PREVIEW
     Drag/click-to-upload boxes that show a live preview of the chosen image.
     Used on the Report Incident page and the Profile photo uploader.
     =========================================================================== */

  // ---- Report Incident: evidence photo ----
  const incidentImageInput = document.getElementById("incidentImage");
  if (incidentImageInput) {
    const imagePreview = document.getElementById("imagePreview");
    const imagePlaceholder = document.getElementById("imagePlaceholder");
    const removeImageBtn = document.getElementById("removeImageBtn");

    incidentImageInput.addEventListener("change", function () {
      const file = incidentImageInput.files && incidentImageInput.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (e) {
        if (imagePreview) {
          imagePreview.src = e.target.result;
          imagePreview.style.display = "block";
        }
        if (imagePlaceholder) imagePlaceholder.style.display = "none";
        if (removeImageBtn) removeImageBtn.style.display = "flex";
      };
      reader.readAsDataURL(file);
    });

    if (removeImageBtn) {
      removeImageBtn.addEventListener("click", function () {
        incidentImageInput.value = "";
        if (imagePreview) {
          imagePreview.src = "";
          imagePreview.style.display = "none";
        }
        if (imagePlaceholder) imagePlaceholder.style.display = "flex";
        removeImageBtn.style.display = "none";
      });
    }
  }

  // ---- Profile photo ----
  const profilePhotoInput = document.getElementById("profilePhotoInput");
  if (profilePhotoInput) {
    const profilePhotoImg = document.getElementById("profilePhotoImg");
    const profilePhotoInitials = document.getElementById("profilePhotoInitials");
    const removePhotoBtn = document.getElementById("removePhotoBtn");

    profilePhotoInput.addEventListener("change", function () {
      const file = profilePhotoInput.files && profilePhotoInput.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (e) {
        if (profilePhotoImg) {
          profilePhotoImg.src = e.target.result;
          profilePhotoImg.style.display = "block";
        }
        if (profilePhotoInitials) profilePhotoInitials.style.display = "none";
        if (removePhotoBtn) removePhotoBtn.style.display = "inline-flex";
      };
      reader.readAsDataURL(file);
    });

    if (removePhotoBtn) {
      removePhotoBtn.addEventListener("click", function () {
        profilePhotoInput.value = "";
        if (profilePhotoImg) {
          profilePhotoImg.src = "";
          profilePhotoImg.style.display = "none";
        }
        if (profilePhotoInitials) profilePhotoInitials.style.display = "block";
        removePhotoBtn.style.display = "none";
        showToast("Profile photo removed.", "primary");
      });
    }
  }

  /* ===========================================================================
     7. FAKE DASHBOARD STATISTICS
     Computes stat-card numbers, a category bar chart, and a status donut
     chart from the sample data, then renders them into whichever dashboard
     the current page has.
     =========================================================================== */

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  // Counts up from 0 to the target number for a livelier stat card reveal.
  function animateCount(id, target) {
    const el = document.getElementById(id);
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

  function renderStatCards() {
    const total = sampleIncidents.length;
    const reported = sampleIncidents.filter(function (i) { return i.status === "Reported"; }).length;
    const assigned = sampleIncidents.filter(function (i) { return i.status === "Assigned"; }).length;
    const inProgress = sampleIncidents.filter(function (i) { return i.status === "In Progress"; }).length;
    const resolved = sampleIncidents.filter(function (i) { return i.status === "Resolved"; }).length;
    const critical = sampleIncidents.filter(function (i) { return i.priority === "Critical"; }).length;

    animateCount("statTotal", total);
    animateCount("statReported", reported);
    animateCount("statAssigned", assigned);
    animateCount("statInProgress", inProgress);
    animateCount("statResolved", resolved);
    animateCount("statCritical", critical);
    setText("openIncidentsBadge", reported + assigned + inProgress);
  }

  function renderBarChart() {
    const barChart = document.getElementById("barChart");
    if (!barChart) return;

    const counts = {};
    sampleIncidents.forEach(function (i) {
      counts[i.category] = (counts[i.category] || 0) + 1;
    });

    const shortLabels = {
      "Safety & Security": "Safety",
      "Harassment": "Harass.",
      "Theft": "Theft",
      "Infrastructure": "Infra.",
      "Fire & Electrical": "Fire",
      "Health & Medical": "Health"
    };

    const maxCount = Math.max.apply(null, Object.values(counts));
    barChart.innerHTML = "";

    Object.keys(counts).forEach(function (category) {
      const count = counts[category];
      const heightPct = Math.max(10, Math.round((count / maxCount) * 100));

      const col = document.createElement("div");
      col.className = "bar-col";
      col.innerHTML =
        "<strong>" + count + "</strong>" +
        '<div class="bar" style="height:' + heightPct + '%;" title="' + category + ": " + count + '"></div>' +
        "<span>" + (shortLabels[category] || category) + "</span>";
      barChart.appendChild(col);
    });
  }

  function renderStatusDonut() {
    const donut = document.getElementById("statusDonut");
    const donutLegend = document.getElementById("donutLegend");
    const donutTotal = document.getElementById("donutTotal");
    if (!donut || !donutLegend) return;

    // Order + colors match the --seg-1/--seg-2/--seg-3 stops defined on
    // the .donut class in style.css (Reported, In Progress, Assigned, then
    // Resolved fills the remainder).
    const order = ["Reported", "In Progress", "Assigned", "Resolved"];
    const colorVar = {
      "Reported": "var(--color-primary)",
      "In Progress": "var(--color-warning)",
      "Assigned": "var(--color-danger)",
      "Resolved": "var(--color-success)"
    };

    const total = sampleIncidents.length;
    let runningPct = 0;
    const segStops = [];

    order.forEach(function (status) {
      const count = sampleIncidents.filter(function (i) { return i.status === status; }).length;
      runningPct += (count / total) * 100;
      segStops.push(runningPct);
    });

    donut.style.setProperty("--seg-1", segStops[0] + "%");
    donut.style.setProperty("--seg-2", segStops[1] + "%");
    donut.style.setProperty("--seg-3", segStops[2] + "%");
    if (donutTotal) donutTotal.textContent = total;

    donutLegend.innerHTML = "";
    order.forEach(function (status) {
      const count = sampleIncidents.filter(function (i) { return i.status === status; }).length;
      const row = document.createElement("div");
      row.className = "legend-item";
      row.innerHTML =
        '<span class="legend-dot" style="background:' + colorVar[status] + ';"></span>' +
        "<span>" + status + "</span>" +
        "<strong>" + count + "</strong>";
      donutLegend.appendChild(row);
    });
  }

  function renderActivityFeed() {
    const activityFeed = document.getElementById("activityFeed");
    if (!activityFeed) return;

    const iconMap = {
      "Reported": { icon: "fa-flag", cls: "reported" },
      "Assigned": { icon: "fa-user-tag", cls: "assigned" },
      "In Progress": { icon: "fa-hourglass-half", cls: "progress" },
      "Resolved": { icon: "fa-circle-check", cls: "resolved" }
    };
    const verbMap = {
      "Reported": "reported a new incident",
      "Assigned": "was assigned an incident",
      "In Progress": "is investigating an incident",
      "Resolved": "resolved an incident"
    };

    activityFeed.innerHTML = "";

    sampleIncidents.slice(0, 6).forEach(function (incident) {
      const meta = iconMap[incident.status] || iconMap["Reported"];
      const row = document.createElement("div");
      row.className = "activity-item";
      row.innerHTML =
        '<div class="activity-icon ' + meta.cls + '"><i class="fa-solid ' + meta.icon + '"></i></div>' +
        '<div class="activity-content">' +
          "<p><strong>" + incident.student + "</strong> " + verbMap[incident.status] + " — " + incident.title + "</p>" +
          "<time>" + incident.id + " · " + formatDate(incident.date) + "</time>" +
        "</div>";
      activityFeed.appendChild(row);
    });
  }

  function formatDate(isoDate) {
    const d = new Date(isoDate + "T00:00:00");
    return d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
  }

  // Render whichever dashboard widgets exist on the current page
  renderStatCards();
  renderBarChart();
  renderStatusDonut();
  renderActivityFeed();

  /* ===========================================================================
     8 & 9. SEARCH TABLES + FILTER TABLES
     One reusable engine: pass it a table body, the dataset, a row-render
     function, plus optional search/filter element ids — it wires them
     together so search and filters combine correctly.
     =========================================================================== */

  function setupIncidentTable(config) {
    const tableBody = document.getElementById(config.tableBodyId);
    if (!tableBody) return;

    const searchInput = config.searchInputId ? document.getElementById(config.searchInputId) : null;
    const filters = (config.filterIds || []).map(function (id) { return document.getElementById(id); }).filter(Boolean);
    const summaryEl = config.summaryId ? document.getElementById(config.summaryId) : null;

    function guessFieldFromId(id) {
      if (id.toLowerCase().indexOf("status") !== -1) return "status";
      if (id.toLowerCase().indexOf("priority") !== -1) return "priority";
      if (id.toLowerCase().indexOf("department") !== -1) return "department";
      return "status";
    }

    function getFilteredData() {
      const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

      return config.data.filter(function (incident) {
        // Text search across id/title/location/category/student
        const searchable = [incident.id, incident.title, incident.location, incident.category, incident.student]
          .join(" ").toLowerCase();
        if (query && searchable.indexOf(query) === -1) return false;

        // Every active filter dropdown must match its corresponding field
        for (let i = 0; i < filters.length; i++) {
          const filterEl = filters[i];
          const field = guessFieldFromId(filterEl.id);
          if (filterEl.value && incident[field] !== filterEl.value) return false;
        }
        return true;
      });
    }

    function render() {
      const rows = getFilteredData();
      tableBody.innerHTML = "";

      if (rows.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding:24px; color:var(--color-text-muted);">No incidents match your search.</td></tr>';
      } else {
        rows.forEach(function (incident) {
          tableBody.appendChild(config.renderRow(incident));
        });
      }

      if (summaryEl) {
        summaryEl.textContent = "Showing " + rows.length + " of " + config.data.length + " incidents";
      }

      animateNewRows(tableBody);
    }

    if (searchInput) searchInput.addEventListener("input", render);
    filters.forEach(function (filterEl) { filterEl.addEventListener("change", render); });

    // Expose the render function so other features (like delete) can
    // trigger a refresh after the underlying data changes.
    config._render = render;
    tableRefreshers.push(render);

    render();
  }

  // Every table's render() function gets pushed here so we can refresh
  // all tables at once (e.g. after a delete).
  const tableRefreshers = [];

  function priorityBadgeClass(priority) {
    return { Low: "badge-gray", Medium: "badge-blue", High: "badge-orange", Critical: "badge-danger" }[priority] || "badge-gray";
  }

  function statusBadgeClass(status) {
    return { Reported: "badge-gray", Assigned: "badge-blue", "In Progress": "badge-orange", Resolved: "badge-success" }[status] || "badge-gray";
  }

  // ---- Student Dashboard: Recent Incidents table ----
  setupIncidentTable({
    tableBodyId: "incidentsTableBody",
    searchInputId: "searchInput",
    summaryId: "tableSummary",
    data: sampleIncidents,
    renderRow: function (incident) {
      const tr = document.createElement("tr");
      tr.innerHTML =
        "<td>" + incident.id + "</td>" +
        "<td>" + incident.title + "</td>" +
        "<td>" + incident.location + "</td>" +
        '<td><span class="badge ' + priorityBadgeClass(incident.priority) + '">' + incident.priority + "</span></td>" +
        '<td><span class="badge ' + statusBadgeClass(incident.status) + '">' + incident.status + "</span></td>" +
        "<td>" + formatDate(incident.date) + "</td>";
      return tr;
    }
  });

  // ---- My Incidents (student) ----
  setupIncidentTable({
    tableBodyId: "myIncidentsTableBody",
    searchInputId: "myIncidentsSearch",
    filterIds: ["priorityFilter", "statusFilter"],
    summaryId: "myIncidentsSummary",
    data: sampleIncidents,
    renderRow: function (incident) {
      const tr = document.createElement("tr");
      tr.innerHTML =
        "<td>" + incident.id + "</td>" +
        "<td>" + incident.title + "</td>" +
        "<td>" + incident.category + "</td>" +
        "<td>" + incident.location + "</td>" +
        '<td><span class="badge ' + priorityBadgeClass(incident.priority) + '">' + incident.priority + "</span></td>" +
        '<td><span class="badge ' + statusBadgeClass(incident.status) + '">' + incident.status + "</span></td>" +
        "<td>" + formatDate(incident.date) + "</td>" +
        '<td><button class="btn btn-outline btn-sm view-incident-btn" data-id="' + incident.id + '">View</button></td>';
      return tr;
    }
  });

  // ---- Manage Incidents (admin) ----
  setupIncidentTable({
    tableBodyId: "manageIncidentsTableBody",
    searchInputId: "manageSearch",
    filterIds: ["statusFilter", "priorityFilter", "departmentFilter"],
    summaryId: "manageTableSummary",
    data: sampleIncidents,
    renderRow: function (incident) {
      const tr = document.createElement("tr");
      tr.innerHTML =
        "<td>" + incident.id + "</td>" +
        "<td>" + incident.student + "</td>" +
        "<td>" + incident.title + "</td>" +
        "<td>" + incident.location + "</td>" +
        '<td><span class="badge ' + priorityBadgeClass(incident.priority) + '">' + incident.priority + "</span></td>" +
        '<td><span class="badge ' + statusBadgeClass(incident.status) + '">' + incident.status + "</span></td>" +
        "<td>" + (incident.assignedTo || "Unassigned") + "</td>" +
        "<td>" + formatDate(incident.date) + "</td>" +
        '<td>' +
          '<button class="action-btn view view-incident-btn" data-id="' + incident.id + '" title="View" aria-label="View"><i class="fa-solid fa-eye"></i></button> ' +
          '<button class="action-btn delete delete-incident-btn" data-id="' + incident.id + '" title="Delete" aria-label="Delete"><i class="fa-solid fa-trash-can"></i></button>' +
        "</td>";
      return tr;
    }
  });

  // ---- Admin Dashboard: Latest Incidents (read-only preview table) ----
  setupIncidentTable({
    tableBodyId: "adminIncidentsTableBody",
    summaryId: "adminTableSummary",
    data: sampleIncidents.slice(0, 6),
    renderRow: function (incident) {
      const tr = document.createElement("tr");
      tr.innerHTML =
        "<td>" + incident.id + "</td>" +
        "<td>" + incident.title + "</td>" +
        "<td>" + incident.student + "</td>" +
        '<td><span class="badge ' + priorityBadgeClass(incident.priority) + '">' + incident.priority + "</span></td>" +
        '<td><span class="badge ' + statusBadgeClass(incident.status) + '">' + incident.status + "</span></td>" +
        "<td>" + formatDate(incident.date) + "</td>";
      return tr;
    }
  });

  /* ===========================================================================
     10. DELETE CONFIRMATION MODAL
     A single reusable confirm-delete flow. Any button with the class
     "delete-incident-btn" and a [data-id] attribute opens it.
     =========================================================================== */
  const deleteConfirmModal = document.getElementById("deleteConfirmModal");
  const deleteIncidentLabel = document.getElementById("deleteIncidentLabel");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
  let pendingDeleteId = null;

  function openDeleteModal(incidentId) {
    if (!deleteConfirmModal) return;
    pendingDeleteId = incidentId;
    if (deleteIncidentLabel) deleteIncidentLabel.textContent = incidentId;
    deleteConfirmModal.classList.add("active");
  }

  function closeDeleteModal() {
    if (deleteConfirmModal) deleteConfirmModal.classList.remove("active");
    pendingDeleteId = null;
  }

  document.addEventListener("click", function (e) {
    const deleteBtn = e.target.closest(".delete-incident-btn");
    if (deleteBtn) openDeleteModal(deleteBtn.dataset.id);
  });

  if (cancelDeleteBtn) cancelDeleteBtn.addEventListener("click", closeDeleteModal);
  if (deleteConfirmModal) {
    deleteConfirmModal.addEventListener("click", function (e) {
      if (e.target === deleteConfirmModal) closeDeleteModal();
    });
  }

  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", function () {
      if (!pendingDeleteId) return;

      const index = sampleIncidents.findIndex(function (i) { return i.id === pendingDeleteId; });
      if (index !== -1) sampleIncidents.splice(index, 1);

      showToast(pendingDeleteId + " was deleted.", "danger");
      closeDeleteModal();

      // Refresh every table + the stat cards so the deleted row disappears
      tableRefreshers.forEach(function (render) { render(); });
      renderStatCards();
      renderBarChart();
      renderStatusDonut();
      renderActivityFeed();
    });
  }

  /* ===========================================================================
     VIEW INCIDENT MODAL
     Populates the shared "view details" modal (My Incidents / Manage
     Incidents) whenever a ".view-incident-btn" is clicked.
     =========================================================================== */
  const viewIncidentModal = document.getElementById("viewIncidentModal");
  if (viewIncidentModal) {
    document.addEventListener("click", function (e) {
      const viewBtn = e.target.closest(".view-incident-btn");
      if (!viewBtn) return;

      const incident = sampleIncidents.find(function (i) { return i.id === viewBtn.dataset.id; });
      if (!incident) return;

      setText("viewModalId", incident.id);
      setText("viewModalTitle", incident.title);
      setText("viewModalCategory", incident.category);
      setText("viewModalLocation", incident.location);
      setText("viewModalDate", formatDate(incident.date));
      setText("viewModalDescription", incident.description || "No additional description provided.");
      if (document.getElementById("viewModalStudent")) setText("viewModalStudent", incident.student);
      if (document.getElementById("viewModalDepartment")) setText("viewModalDepartment", incident.department);
      if (document.getElementById("viewModalAssignedTo")) setText("viewModalAssignedTo", incident.assignedTo || "Unassigned");

      const priorityBadge = document.getElementById("viewModalPriority");
      if (priorityBadge) {
        priorityBadge.textContent = incident.priority;
        priorityBadge.className = "badge " + priorityBadgeClass(incident.priority);
      }
      const statusBadge = document.getElementById("viewModalStatus");
      if (statusBadge) {
        statusBadge.textContent = incident.status;
        statusBadge.className = "badge " + statusBadgeClass(incident.status);
      }

      const fullDetailsLink = document.getElementById("viewModalFullDetailsLink");
      if (fullDetailsLink) fullDetailsLink.href = "incidents-detail.html?id=" + encodeURIComponent(incident.id);

      viewIncidentModal.classList.add("active");
    });

    const closeViewModal = function () { viewIncidentModal.classList.remove("active"); };
    const closeViewModalBtn = document.getElementById("closeViewModal");
    const viewModalCloseFooterBtn = document.getElementById("viewModalCloseFooterBtn");
    if (closeViewModalBtn) closeViewModalBtn.addEventListener("click", closeViewModal);
    if (viewModalCloseFooterBtn) viewModalCloseFooterBtn.addEventListener("click", closeViewModal);
    viewIncidentModal.addEventListener("click", function (e) {
      if (e.target === viewIncidentModal) closeViewModal();
    });
  }

  /* ===========================================================================
     11. SMOOTH ANIMATIONS
     style.css already fades ".fade-in" sections in via a CSS keyframe on
     page load. Two things script.js adds on top of that:
       - a slight stagger, so sections cascade in one after another instead
         of all animating at once
       - a fade-in for table rows injected dynamically by search/filter,
         which otherwise pop into place instantly with no animation
     =========================================================================== */
  document.querySelectorAll(".fade-in").forEach(function (el, index) {
    el.style.animationDelay = (index * 70) + "ms";
  });

  function animateNewRows(tableBody) {
    Array.from(tableBody.children).forEach(function (row, index) {
      row.style.animation = "fadeIn var(--transition-base) both";
      row.style.animationDelay = (index * 35) + "ms";
    });
  }

  /* ===========================================================================
     SHARED NAV WIRING
     Small odds and ends every page relies on: the "Report Incident"
     shortcut button, logout, the notification bell, and the success-modal
     buttons on the Report Incident page.
     =========================================================================== */
  const newIncidentBtn = document.getElementById("newIncidentBtn");
  if (newIncidentBtn) {
    newIncidentBtn.addEventListener("click", function () {
      window.location.href = "report-incident.html";
    });
  }

  const logoutLink = document.getElementById("logoutLink");
  if (logoutLink) {
    logoutLink.addEventListener("click", function (e) {
      e.preventDefault();
      showToast("Signing you out...", "warning");
      setTimeout(function () { window.location.href = "index.html"; }, 900);
    });
  }

  const notificationBtn = document.getElementById("notificationBtn");
  const notificationDot = document.getElementById("notificationDot");
  if (notificationBtn) {
    notificationBtn.addEventListener("click", function () {
      if (notificationDot) notificationDot.style.display = "none";
      showToast("Your incident INC-1041 was assigned to campus security.", "primary");
    });
  }

  const successModal = document.getElementById("successModal");
  if (successModal) {
    const successModalOkBtn = document.getElementById("successModalOkBtn");
    const closeSuccessModal = document.getElementById("closeSuccessModal");
    if (successModalOkBtn) {
      successModalOkBtn.addEventListener("click", function () {
        window.location.href = "student-dashboard.html";
      });
    }
    if (closeSuccessModal) {
      closeSuccessModal.addEventListener("click", function () {
        successModal.classList.remove("active");
      });
    }
  }

  // Placeholder nav links (sections not built yet, e.g. Assignments, Users,
  // Reports) get a friendly toast instead of doing nothing when clicked.
  const comingSoonSelector =
    '.nav-item[href="#"]:not(#reportIncidentLink):not(#logoutLink), .bottom-nav-item[href="#"]';
  document.querySelectorAll(comingSoonSelector).forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const label = link.querySelector(".nav-label");
      const name = label ? label.textContent.trim() : link.textContent.trim();
      showToast(name + " is coming soon.", "primary");
    });
  });

})();