document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     1) 모바일 햄버거 메뉴
     ========================= */
  const menuButton = document.querySelector(".nav-menu-button");
  const navLinks = document.querySelector(".nav-links");

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
      navLinks.classList.toggle("nav-links-open");
    });

    // 링크 클릭 시 메뉴 닫기
    navLinks.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("nav-links-open");
      });
    });
  }

  /* =========================
     2) Intro 모바일 슬라이드 인디케이터
     ========================= */
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

  /* =========================
     3) 섹션 스크롤에 따른 nav 하이라이트
     ========================= */
  const page = document.getElementById("page");
  const sections = document.querySelectorAll("main .section[id]");
  const navItems = document.querySelectorAll(".nav-link");

  function setActiveNav(targetId) {
    navItems.forEach((link) => {
      const href = link.getAttribute("href") || "";
      const hash = href.startsWith("#") ? href.slice(1) : null;
      link.classList.toggle("nav-link-active", hash === targetId);
    });
  }

  function updateActiveOnScroll() {
    let closestId = null;
    let closestOffset = Infinity;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const offset = Math.abs(rect.top - 80); // 헤더 높이 기준

      if (offset < closestOffset) {
        closestOffset = offset;
        closestId = section.id;
      }
    });

    if (closestId) {
      setActiveNav(closestId);
    }
  }

  if (page) {
    page.addEventListener("scroll", updateActiveOnScroll);
  } else {
    window.addEventListener("scroll", updateActiveOnScroll);
  }

  // nav 클릭 시 즉시 하이라이트
  navItems.forEach((link) => {
    link.addEventListener("click", () => {
      const href = link.getAttribute("href") || "";
      const hash = href.startsWith("#") ? href.slice(1) : null;
      if (hash) setActiveNav(hash);
    });
  });

  // 초기 한 번 계산
  updateActiveOnScroll();

  /* =========================
   4) Projects 캐러셀
   ========================= */
  const projectTrack = document.querySelector(".project-track");
  const projectCards = projectTrack
    ? Array.from(projectTrack.querySelectorAll(".project-card"))
    : [];

  if (projectTrack && projectCards.length) {
    const prevBtn = document.querySelector(".project-carousel-btn-prev");
    const nextBtn = document.querySelector(".project-carousel-btn-next");

    let currentProjectIndex = 0;

    const CARD_GAP = 24; // styles.css의 .project-track gap과 동일해야 함

    function getCardWidth() {
      if (!projectCards.length) return 0;
      const cardRect = projectCards[0].getBoundingClientRect();
      return cardRect.width + CARD_GAP;
    }

    function updateProjectCarousel() {
      const width = getCardWidth();
      projectTrack.style.transform = `translateX(-${currentProjectIndex * width
        }px)`;
    }

    function goToNext() {
      currentProjectIndex =
        (currentProjectIndex + 1) % projectCards.length; // 끝 → 처음 루프
      updateProjectCarousel();
    }

    function goToPrev() {
      currentProjectIndex =
        (currentProjectIndex - 1 + projectCards.length) %
        projectCards.length; // 처음 → 끝 루프
      updateProjectCarousel();
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", goToNext);
    }
    if (prevBtn) {
      prevBtn.addEventListener("click", goToPrev);
    }

    // 창 크기 변경 시 위치 재계산
    window.addEventListener("resize", () => {
      updateProjectCarousel();
    });

    // 초기 1회 계산
    updateProjectCarousel();
  }
});
