/* ==========================================================
   Pathway Counseling — site interactivity (vanilla JS)
   ========================================================== */
(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const escapeHTML = (s) => String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // localStorage can be unavailable (private mode, file://), so fail gracefully
  const store = {
    get(key, fallback) {
      try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
    }
  };

  /* ---------------- Common: nav, footer year, back-to-top ---------------- */
  function initCommon() {
    const toggle = $(".nav-toggle");
    const links = $("#nav-links");
    if (toggle && links) {
      toggle.addEventListener("click", () => {
        const open = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!open));
        links.classList.toggle("open", !open);
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && links.classList.contains("open")) {
          toggle.setAttribute("aria-expanded", "false");
          links.classList.remove("open");
          toggle.focus();
        }
      });
    }
    $$(".year").forEach((el) => (el.textContent = new Date().getFullYear()));

    const topBtn = $(".to-top");
    if (topBtn) {
      window.addEventListener("scroll", () => topBtn.classList.toggle("show", window.scrollY > 400), { passive: true });
      topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }
  }

  /* ---------------- Home: countdown, dates, counters ---------------- */
  function initHome() {
    const countdown = $("#countdown");
    if (!countdown || typeof IMPORTANT_DATES === "undefined") return;

    const fmt = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" });
    const now = Date.now();
    const next = IMPORTANT_DATES.find((d) => new Date(d.date).getTime() > now);

    const grid = $("#dates-grid");
    grid.innerHTML = IMPORTANT_DATES.map((d) => {
      const past = new Date(d.date).getTime() <= now;
      return `<article class="card"${past ? ' style="opacity:.6"' : ""}>
          <span class="faq-cat">${past ? "Completed" : d === next ? "Up next" : "Upcoming"}</span>
          <h3>${escapeHTML(d.title)}</h3>
          <p><strong>${fmt.format(new Date(d.date))}</strong><br>${escapeHTML(d.note)}</p>
        </article>`;
    }).join("");

    if (!next) {
      $("#deadline-name").textContent = "This session's schedule is complete";
      $("#deadline-date").textContent = "Watch this space for the next session's dates.";
      return;
    }
    $("#deadline-name").textContent = next.title;
    $("#deadline-date").textContent = fmt.format(new Date(next.date));

    const units = Object.fromEntries($$("[data-unit]", countdown).map((el) => [el.dataset.unit, el]));
    const tick = () => {
      const diff = Math.max(0, new Date(next.date).getTime() - Date.now());
      units.days.textContent = Math.floor(diff / 86400000);
      units.hours.textContent = Math.floor((diff / 3600000) % 24);
      units.minutes.textContent = Math.floor((diff / 60000) % 60);
      units.seconds.textContent = Math.floor((diff / 1000) % 60);
    };
    tick();
    setInterval(tick, 1000);

    // Animated counters, started when they scroll into view
    const counters = $$(".counter");
    const animate = (el) => {
      const target = +el.dataset.target;
      const start = performance.now();
      const step = (t) => {
        const p = Math.min(1, (t - start) / 1200);
        el.textContent = Math.round(target * p).toLocaleString("en-IN") + (p === 1 && target > 100 ? "+" : "");
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => entries.forEach((e) => {
        if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); }
      }), { threshold: 0.5 });
      counters.forEach((c) => io.observe(c));
    } else {
      counters.forEach(animate);
    }
  }

  /* ---------------- Steps: render timeline + progress tracker ---------------- */
  function initSteps() {
    const list = $("#steps-list");
    if (!list || typeof STEPS === "undefined") return;
    const KEY = "pathway-steps-done";
    let done = new Set(store.get(KEY, []));

    list.innerHTML = STEPS.map((s, i) => `
      <li class="step card" data-index="${i}">
        <span class="step-num" aria-hidden="true">${i + 1}</span>
        <div class="step-head">
          <h3>${escapeHTML(s.title)}</h3>
          <span class="badge">⏱ ${escapeHTML(s.time)}</span>
        </div>
        <p>${escapeHTML(s.summary)}</p>
        <details>
          <summary>What you need to know</summary>
          <ul>${s.details.map((d) => `<li>${escapeHTML(d)}</li>`).join("")}</ul>
        </details>
        <label><input type="checkbox" data-step="${i}"> Mark step ${i + 1} as done</label>
      </li>`).join("");

    const render = () => {
      $$(".step", list).forEach((li) => {
        const i = +li.dataset.index;
        li.classList.toggle("done", done.has(i));
        $("input", li).checked = done.has(i);
        $(".step-num", li).textContent = done.has(i) ? "✓" : i + 1;
      });
      const pct = Math.round((done.size / STEPS.length) * 100);
      $("#progress-fill").style.width = pct + "%";
      $(".progress-bar").setAttribute("aria-valuenow", pct);
      $("#progress-text").textContent = done.size === STEPS.length
        ? "🎉 All steps completed! Your admission is confirmed."
        : `${done.size} of ${STEPS.length} steps completed (${pct}%)`;
    };

    list.addEventListener("change", (e) => {
      if (!e.target.matches("input[data-step]")) return;
      const i = +e.target.dataset.step;
      e.target.checked ? done.add(i) : done.delete(i);
      store.set(KEY, [...done]);
      render();
    });
    $("#reset-progress").addEventListener("click", () => {
      done = new Set();
      store.set(KEY, []);
      render();
    });
    render();
  }

  /* ---------------- FAQs: render, accordion, search, filter ---------------- */
  function initFaqs() {
    const list = $("#faq-list");
    if (!list || typeof FAQS === "undefined") return;
    const search = $("#faq-search");
    const filters = $("#faq-filters");
    const empty = $("#faq-empty");
    const cats = ["All", ...new Set(FAQS.map((f) => f.cat))];
    let activeCat = "All";

    filters.innerHTML = cats.map((c) =>
      `<button type="button" class="chip" data-cat="${escapeHTML(c)}" aria-pressed="${c === "All"}">${escapeHTML(c)}</button>`
    ).join("");

    const highlight = (text, term) => {
      const safe = escapeHTML(text);
      if (!term) return safe;
      const re = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
      return safe.replace(re, "<mark>$1</mark>");
    };

    const render = () => {
      const term = search.value.trim();
      const t = term.toLowerCase();
      const items = FAQS.filter((f) =>
        (activeCat === "All" || f.cat === activeCat) &&
        (!t || f.q.toLowerCase().includes(t) || f.a.toLowerCase().includes(t)));

      list.innerHTML = items.map((f, i) => `
        <div class="faq-item">
          <button class="faq-q" aria-expanded="${term ? "true" : "false"}" aria-controls="faq-a-${i}" id="faq-q-${i}">
            <span class="faq-cat">${escapeHTML(f.cat)}</span>${highlight(f.q, term)}
          </button>
          <div class="faq-a" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}" ${term ? "" : "hidden"}>
            ${highlight(f.a, term)}
          </div>
        </div>`).join("");
      empty.hidden = items.length > 0;
    };

    list.addEventListener("click", (e) => {
      const btn = e.target.closest(".faq-q");
      if (!btn) return;
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      $("#" + btn.getAttribute("aria-controls")).hidden = open;
    });
    filters.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      activeCat = chip.dataset.cat;
      $$(".chip", filters).forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
      render();
    });
    search.addEventListener("input", render);
    render();
  }

  /* ---------------- Contact: form validation ---------------- */
  const validators = {
    name: (v) => !v ? "Please enter your name."
      : !/^[A-Za-z][A-Za-z .'-]{1,59}$/.test(v) ? "Name should contain only letters (min 2 characters)." : "",
    email: (v) => !v ? "Please enter your email."
      : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "Please enter a valid email address." : "",
    phone: (v) => !v ? "Please enter your mobile number."
      : !/^[6-9]\d{9}$/.test(v) ? "Enter a valid 10-digit mobile number starting with 6–9." : "",
    course: (v) => (!v ? "Please select a course." : ""),
    topic: (v) => (!v ? "Please select a topic." : ""),
    message: (v) => !v ? "Please write your question."
      : v.length < 20 ? `Please add a little more detail (${20 - v.length} more characters).` : ""
  };

  function initContact() {
    const form = $("#contact-form");
    if (!form) return;
    const alertBox = $("#form-alert");
    const message = $("#message");

    const validateField = (name) => {
      const input = form.elements[name];
      const error = validators[name](input.value.trim());
      input.closest(".field").classList.toggle("invalid", !!error);
      input.setAttribute("aria-invalid", String(!!error));
      input.setAttribute("aria-describedby", `${name}-error`);
      $(`#${name}-error`).textContent = error;
      return !error;
    };

    Object.keys(validators).forEach((name) => {
      const input = form.elements[name];
      input.addEventListener("blur", () => validateField(name));
      input.addEventListener("input", () => {
        if (input.closest(".field").classList.contains("invalid")) validateField(name);
      });
    });
    form.elements.phone.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
    });
    message.addEventListener("input", () => ($("#char-count").textContent = message.value.length));

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alertBox.innerHTML = "";
      const results = Object.keys(validators).map(validateField);
      if (results.includes(false)) {
        form.querySelector(".invalid input, .invalid select, .invalid textarea").focus();
        return;
      }
      const btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      btn.textContent = "Sending…";

      // Demo only: no backend. Store the query locally and show a confirmation.
      setTimeout(() => {
        const data = Object.fromEntries(new FormData(form));
        const ticket = "PC" + Date.now().toString().slice(-6);
        const saved = store.get("pathway-queries", []);
        saved.push({ ...data, ticket, at: new Date().toISOString() });
        store.set("pathway-queries", saved);

        alertBox.innerHTML = `<div class="alert alert-success">✅ Thank you, <strong>${escapeHTML(data.name)}</strong>!
          Your query about <strong>${escapeHTML(data.topic)}</strong> has been received.
          Reference no. <strong>${ticket}</strong>. We'll reply to ${escapeHTML(data.email)} within 24 hours.</div>`;
        form.reset();
        $("#char-count").textContent = "0";
        btn.disabled = false;
        btn.textContent = "Send query";
        alertBox.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 700);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initCommon();
    initHome();
    initSteps();
    initFaqs();
    initContact();
  });
})();
