/* Small page interactions. jQuery is kept locally in assets/vendor for offline/static hosting. */
$(function () {
  const $menuButton = $(".menu-toggle");
  const $nav = $(".site-nav");
  $menuButton.on("click", function () {
    const open = !$nav.hasClass("open");
    $nav.toggleClass("open", open);
    $(this)
      .attr("aria-expanded", String(open))
      .attr("aria-label", open ? "Close menu" : "Open menu");
  });
  $nav.find("a").on("click", function () {
    $nav.removeClass("open");
    $menuButton.attr("aria-expanded", "false").attr("aria-label", "Open menu");
  });
  $(document).on("keydown", function (event) {
    if (event.key === "Escape" && $nav.hasClass("open")) {
      $nav.removeClass("open");
      $menuButton
        .attr("aria-expanded", "false")
        .attr("aria-label", "Open menu")
        .trigger("focus");
    }
  });
  if (
    "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.09 },
    );
    $(
      ".story-grid, .feature-card, .records-section, .notes-section, .bottom-cta",
    ).each(function () {
      this.classList.add("reveal");
      observer.observe(this);
    });
  }
});
