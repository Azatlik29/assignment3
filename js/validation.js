// GameHub forms: one script shared by all task pages.
// Each block runs only if its form exists on the current page.

function showResult(type, text) {
  const box = document.getElementById("result");
  if (!box) return;
  box.className = "mt-3 alert alert-" + type;
  box.textContent = text;
}

/* ---------- Task 0 and Task 1: plain forms ---------- */
// Task 1 uses native HTML5 validation: the browser blocks invalid submits itself,
// so this handler only runs when every constraint is satisfied.
["plainForm", "html5Form"].forEach(function (id) {
  const form = document.getElementById(id);
  if (!form) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    showResult("success", "Message sent. Thanks, " + form.elements["name"].value.trim() + "!");
    form.reset();
  });
});

/* ---------- Task 2: Bootstrap form (styling only) ---------- */
const bsForm = document.getElementById("bsForm");
if (bsForm) {
  bsForm.addEventListener("submit", function (e) {
    e.preventDefault();
    showResult("success", "Message sent. We will reply to your email soon.");
    bsForm.reset();
  });
}

/* ---------- Task 3: Bootstrap validation classes ---------- */
const feedbackForm = document.getElementById("feedbackForm");
if (feedbackForm) {
  const messages = {
    name: { valueMissing: "Name is required.", tooShort: "Name must have at least 2 characters." },
    email: { valueMissing: "Email is required.", typeMismatch: "Enter a valid email, for example player@gamehub.kz." },
    message: { valueMissing: "Message is required.", tooShort: "Message must have at least 10 characters." }
  };

  function checkField(input) {
    const feedback = input.parentElement.querySelector(".invalid-feedback");
    if (input.checkValidity()) {
      input.classList.remove("is-invalid");
      input.classList.add("is-valid");
      return true;
    }
    const v = input.validity;
    const set = messages[input.name];
    let text = "Please check this field.";
    for (const key in set) { if (v[key]) { text = set[key]; break; } }
    feedback.textContent = text;
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }

  const fields = feedbackForm.querySelectorAll("input, textarea");
  fields.forEach(function (f) {
    f.addEventListener("blur", function () { checkField(f); });
    f.addEventListener("input", function () {
      if (f.classList.contains("is-valid") || f.classList.contains("is-invalid")) checkField(f);
    });
  });

  feedbackForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let ok = true;
    fields.forEach(function (f) { if (!checkField(f)) ok = false; });
    if (ok) {
      showResult("success", "Message sent. Thanks for your feedback!");
      feedbackForm.reset();
      fields.forEach(function (f) { f.classList.remove("is-valid", "is-invalid"); });
    } else {
      showResult("danger", "Please fix the highlighted fields.");
    }
  });

  feedbackForm.addEventListener("reset", function () {
    fields.forEach(function (f) { f.classList.remove("is-valid", "is-invalid"); });
    const box = document.getElementById("result");
    box.className = "mt-3"; box.textContent = "";
  });
}

/* ---------- Task 4: registration form ---------- */
const regForm = document.getElementById("regForm");
if (regForm) {
  const pw = regForm.elements["password"];
  const confirmPw = regForm.elements["confirmPassword"];
  const confirmFeedback = document.getElementById("confirmFeedback");
  const genderRadios = regForm.querySelectorAll('input[name="gender"]');
  const genderFeedback = document.getElementById("genderFeedback");
  const hobbies = regForm.querySelectorAll(".hobby");
  const hobbyFeedback = document.getElementById("hobbyFeedback");
  const textFields = regForm.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], select');

  function markField(el) {
    if (el === confirmPw) {
      if (confirmPw.value === "") {
        confirmPw.setCustomValidity("Required");
        confirmFeedback.textContent = "Repeat your password.";
      } else if (confirmPw.value !== pw.value) {
        confirmPw.setCustomValidity("Mismatch");
        confirmFeedback.textContent = "Passwords do not match.";
      } else {
        confirmPw.setCustomValidity("");
      }
    }
    const ok = el.checkValidity();
    el.classList.toggle("is-valid", ok);
    el.classList.toggle("is-invalid", !ok);
    return ok;
  }

  function markGender() {
    const ok = Array.from(genderRadios).some(function (r) { return r.checked; });
    genderRadios.forEach(function (r) { r.classList.toggle("is-invalid", !ok); r.classList.toggle("is-valid", ok); });
    genderFeedback.classList.toggle("d-block", !ok);
    return ok;
  }

  function markHobbies() {
    const ok = Array.from(hobbies).some(function (h) { return h.checked; });
    hobbies.forEach(function (h) { h.classList.toggle("is-invalid", !ok); });
    hobbyFeedback.classList.toggle("d-block", !ok);
    return ok;
  }

  textFields.forEach(function (el) {
    el.addEventListener("blur", function () { markField(el); });
    el.addEventListener("input", function () {
      if (el.classList.contains("is-valid") || el.classList.contains("is-invalid")) markField(el);
      // keep confirm field in sync when the main password changes
      if (el === pw && confirmPw.value !== "") markField(confirmPw);
    });
  });
  genderRadios.forEach(function (r) { r.addEventListener("change", markGender); });
  hobbies.forEach(function (h) { h.addEventListener("change", markHobbies); });

  regForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let ok = true;
    textFields.forEach(function (el) { if (!markField(el)) ok = false; });
    if (!markGender()) ok = false;
    if (!markHobbies()) ok = false;
    if (ok) {
      const name = regForm.elements["firstName"].value.trim();
      showResult("success", "Account created. Welcome to GameHub, " + name + "!");
      regForm.reset();
      clearMarks();
    } else {
      showResult("danger", "Registration failed. Please fix the highlighted fields.");
    }
  });

  function clearMarks() {
    regForm.querySelectorAll(".is-valid, .is-invalid").forEach(function (el) { el.classList.remove("is-valid", "is-invalid"); });
    genderFeedback.classList.remove("d-block");
    hobbyFeedback.classList.remove("d-block");
    confirmPw.setCustomValidity("");
  }

  regForm.addEventListener("reset", function () {
    clearMarks();
    const box = document.getElementById("result");
    box.className = "mt-3"; box.textContent = "";
  });
}
