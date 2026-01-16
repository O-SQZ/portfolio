// 모바일 햄버거 메뉴 토글
const menuButton = document.querySelector(".nav-menu-button");
const navLinks = document.querySelector(".nav-links");

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    navLinks.classList.toggle("nav-links-open");
    menuButton.classList.toggle("nav-menu-button-open");
  });

  // 섹션 링크 클릭 시 메뉴 닫기
  navLinks.addEventListener("click", (e) => {
    if (e.target.classList.contains("nav-link")) {
      navLinks.classList.remove("nav-links-open");
      menuButton.classList.remove("nav-menu-button-open");
    }
  });
}

// Intro 모바일 슬라이드 인디케이터
const introLayout = document.querySelector(".intro-layout");
const indicatorDots = document.querySelectorAll(
  ".intro-mobile-indicator .indicator-dot"
);

if (introLayout && indicatorDots.length) {
  introLayout.addEventListener("scroll", () => {
    const width = introLayout.clientWidth || 1;
    const index = Math.round(introLayout.scrollLeft / width);

    indicatorDots.forEach((dot, i) => {
      dot.classList.toggle("indicator-dot-active", i === index);
    });
  });
}
