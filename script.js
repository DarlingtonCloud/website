/* ============================================
   NEBO DARLINGTON PORTFOLIO — script.js
   Interactions: scroll, cursor, counters, nav
============================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ─── Custom Cursor ─── */
  const cursor = document.getElementById("cursor");
  const follower = document.getElementById("cursorFollower");

  if (cursor && follower) {
    let mx = 0, my = 0, fx = 0, fy = 0;

    document.addEventListener("mousemove", e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + "px";
      cursor.style.top = my + "px";
    });

    const followMouse = () => {
      fx += (mx - fx) * 0.12;
      fy += (my - fy) * 0.12;
      follower.style.left = fx + "px";
      follower.style.top = fy + "px";
      requestAnimationFrame(followMouse);
    };
    followMouse();

    document.querySelectorAll("a, button, .pill, .info-card, .project-card, .edu-card").forEach(el => {
      el.addEventListener("mouseenter", () => {
        follower.style.width = "60px";
        follower.style.height = "60px";
        follower.style.borderColor = "rgba(0,217,192,0.8)";
        cursor.style.transform = "translate(-50%,-50%) scale(1.5)";
      });
      el.addEventListener("mouseleave", () => {
        follower.style.width = "36px";
        follower.style.height = "36px";
        follower.style.borderColor = "rgba(0,217,192,0.5)";
        cursor.style.transform = "translate(-50%,-50%) scale(1)";
      });
    });
  }

  /* ─── Navbar scroll state ─── */
  const navbar = document.getElementById("navbar");
  const onScroll = () => {
    if (window.scrollY > 60) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ─── Smooth nav scroll ─── */
  document.querySelectorAll("a[href^='#']").forEach(a => {
    a.addEventListener("click", e => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
        // close mobile menu if open
        mobileMenu.classList.remove("open");
        hamburger.classList.remove("open");
      }
    });
  });

  /* ─── Mobile Menu ─── */
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.createElement("div");
  mobileMenu.className = "mobile-menu";

  const mobileLinks = ["About", "Experience", "Skills", "Projects", "Contact"];
  mobileLinks.forEach(label => {
    const a = document.createElement("a");
    a.href = "#" + label.toLowerCase();
    a.textContent = label;
    mobileMenu.appendChild(a);
  });
  document.body.appendChild(mobileMenu);

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mobileMenu.classList.toggle("open");
  });

  /* ─── Intersection Observer: Reveal ─── */
  const revealEls = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger siblings
        const siblings = Array.from(entry.target.parentElement.querySelectorAll(".reveal"));
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = (idx * 80) + "ms";
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ─── Animated Counters ─── */
  const counters = document.querySelectorAll(".stat-number[data-target]");
  let countersStarted = false;

  const startCounters = () => {
    if (countersStarted) return;
    const statsEl = document.querySelector(".hero-stats");
    if (!statsEl) return;
    const rect = statsEl.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      countersStarted = true;
      counters.forEach(counter => {
        const target = parseInt(counter.dataset.target, 10);
        const duration = 1800;
        const start = performance.now();

        const tick = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // easeOutExpo
          const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          counter.textContent = Math.round(ease * target);
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }
  };
  window.addEventListener("scroll", startCounters, { passive: true });
  startCounters();

  /* ─── Skill bar fill on scroll ─── */
  const skillFills = document.querySelectorAll(".skill-fill");

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.dataset.width;
        entry.target.style.width = width + "%";
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  skillFills.forEach(fill => skillObserver.observe(fill));

  /* ─── Active nav link highlight ─── */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const activateNavLink = () => {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) current = section.id;
    });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute("href") === "#" + current
        ? "var(--teal)"
        : "";
    });
  };
  window.addEventListener("scroll", activateNavLink, { passive: true });

  /* ─── Parallax orbs on mousemove ─── */
  const orbs = document.querySelectorAll(".hero-orb");
  document.addEventListener("mousemove", e => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 12;
      orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });
  });

  /* ─── Project card tilt ─── */
  document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -5;
      const rotY = ((x - cx) / cx) * 5;
      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  /* ─── Pill hover ripple ─── */
  document.querySelectorAll(".pill").forEach(pill => {
    pill.addEventListener("click", e => {
      pill.style.transform = "scale(0.92)";
      setTimeout(() => { pill.style.transform = ""; }, 150);
    });
  });

});
