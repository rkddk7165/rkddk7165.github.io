(function () {
  const inSub = /\/html\//.test(location.pathname);
  const toRoot = inSub ? "../" : "";
  const toHtml = inSub ? "" : "html/";

  const CONTACT = {
    email: "rkddk7165@naver.com",
    github: "github.com/rkddk7165",
    blog: "velog.io/@rkddk7165/posts",
  };

  const nav = document.createElement("nav");
  nav.className = "nav";
  const home = inSub ? `${toRoot}index.html` : "";
  nav.innerHTML = `
    <a class="nav-brand" href="${home}#about">
      <span class="nav-mark"><span>HM</span></span>
      <span>강현민 · Backend Developer</span>
    </a>
    <button class="nav-toggle" type="button" aria-label="메뉴 열기" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
    <div class="nav-links">
      <a class="nav-link" href="${home}#about">소개</a>
      <a class="nav-link" href="${home}#experience">경험</a>
      <a class="nav-link" href="${home}#projects">프로젝트</a>
      <a class="nav-link" href="${home}#contact">연락처</a>
    </div>
  `;
  document.body.prepend(nav);

  const navToggle = nav.querySelector(".nav-toggle");
  const navLinks = nav.querySelector(".nav-links");
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open.toString());
  });
  navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }));

  const setNavScrolled = () => nav.classList.toggle("scrolled", window.scrollY > 12);
  window.addEventListener("scroll", setNavScrolled, { passive: true });
  setNavScrolled();

  if (!document.body.hasAttribute("data-no-footer")) {
    const footer = document.createElement("footer");
    footer.className = "footer";
    footer.innerHTML = `
      <div class="wrap footer-top">
        <div class="f-brand">
          <div class="ft">
            <div class="nm">강현민<span>Kang Hyun Min</span></div>
            <div class="tl">성능 병목을 추적하고 개선하는 Java Spring 백엔드 개발자</div>
          </div>
        </div>
        <div class="f-social">
          <a class="f-soc" href="https://${CONTACT.github}" target="_blank" rel="noopener" aria-label="GitHub">G</a>
          <a class="f-soc" href="https://${CONTACT.blog}" target="_blank" rel="noopener" aria-label="Blog">B</a>
          <a class="f-soc" href="mailto:${CONTACT.email}" aria-label="Email">M</a>
        </div>
      </div>
      <div class="wrap footer-bottom">
        <span>© 2026 Kang Hyun Min · Backend Developer Portfolio</span>
        <a href="${toRoot}index.html#about">맨 위로</a>
      </div>
    `;
    document.body.appendChild(footer);
  }

  const reveals = Array.from(document.querySelectorAll(".reveal"));
  const showEl = (el) => el.classList.add("in");
  const inView = (el) => {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.96 && rect.bottom > 0;
  };
  reveals.forEach((el) => { if (inView(el)) showEl(el); });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      showEl(entry.target);
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  reveals.forEach((el) => { if (!el.classList.contains("in")) revealObserver.observe(el); });

  const sections = Array.from(document.querySelectorAll("header[id], section[id]"));
  const links = Array.from(nav.querySelectorAll(".nav-link"));
  const activeObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    links.forEach((link) => {
      const hash = new URL(link.href).hash;
      link.classList.toggle("active", hash === `#${visible.target.id}`);
    });
  }, { threshold: 0.45 });
  sections.forEach((section) => activeObserver.observe(section));

  const counters = document.querySelectorAll("[data-count]");
  const fmt = (value, dec) => dec > 0 ? value.toFixed(dec) : Math.round(value).toString();
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const to = parseFloat(el.dataset.to);
      const dec = parseInt(el.dataset.dec || "0", 10);
      const pre = el.dataset.pre || "";
      const suf = el.dataset.suf || "";
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / 1200, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = pre + fmt(to * eased, dec) + suf;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = pre + fmt(to, dec) + suf;
      };
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach((counter) => countObserver.observe(counter));

  document.querySelectorAll(".ss-frame").forEach((frame) => {
    frame.addEventListener("click", () => {
      const img = frame.querySelector("img");
      if (!img) return;
      window.open(img.src, "_blank", "noopener");
    });
  });

  document.body.classList.add("page-ready");
})();
