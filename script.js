const header = document.querySelector(".site-header");

const updateHeader = () => {
  header.dataset.scrolled = window.scrollY > 12 ? "true" : "false";
};

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
