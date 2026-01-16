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
  /* =========================
   4) Projects 캐러셀 (무한 루프)
   ========================= */
  const projectTrack = document.querySelector(".project-track");
  const originalCards = projectTrack
    ? Array.from(projectTrack.querySelectorAll(".project-card"))
    : [];

  if (projectTrack && originalCards.length) {
    const prevBtn = document.querySelector(".project-carousel-btn-prev");
    const nextBtn = document.querySelector(".project-carousel-btn-next");

    // 1) 양 끝에 클론 추가: [lastClone, 1, 2, 3, ..., N, firstClone]
    const firstClone = originalCards[0].cloneNode(true);
    const lastClone = originalCards[originalCards.length - 1].cloneNode(true);

    projectTrack.insertBefore(lastClone, originalCards[0]); // 맨 앞
    projectTrack.appendChild(firstClone); // 맨 뒤

    const slides = Array.from(projectTrack.querySelectorAll(".project-card"));
    const CARD_GAP = 24; // styles.css .project-track gap과 동일하게 유지

    // 2) 실제 시작 위치는 index = 1 (원본 1번 카드)
    let currentProjectIndex = 1;

    function getCardWidth() {
      if (!slides.length) return 0;
      const rect = slides[0].getBoundingClientRect();
      return rect.width + CARD_GAP;
    }

    function setTrackTransition(enabled) {
      projectTrack.style.transition = enabled ? "transform 0.35s ease" : "none";
    }

    function updateProjectCarousel() {
      const width = getCardWidth();
      projectTrack.style.transform = `translateX(-${currentProjectIndex * width
        }px)`;
    }

    function goToNext() {
      setTrackTransition(true);
      currentProjectIndex += 1;
      updateProjectCarousel();
    }

    function goToPrev() {
      setTrackTransition(true);
      currentProjectIndex -= 1;
      updateProjectCarousel();
    }

    // 3) 양쪽 클론에 도달하면 transition 끝난 뒤 진짜 카드 위치로 순간이동
    projectTrack.addEventListener("transitionend", () => {
      // 슬라이드 인덱스 기준:
      // 0            : lastClone
      // 1..N         : 실제 카드들
      // slides.length-1 : firstClone
      if (currentProjectIndex === slides.length - 1) {
        // 맨 뒤 firstClone → 실제 1번 카드로 점프
        setTrackTransition(false);
        currentProjectIndex = 1;
        updateProjectCarousel();
        // 다음 프레임부터 다시 transition 켜기
        requestAnimationFrame(() => setTrackTransition(true));
      } else if (currentProjectIndex === 0) {
        // 맨 앞 lastClone → 실제 마지막 카드로 점프
        setTrackTransition(false);
        currentProjectIndex = slides.length - 2;
        updateProjectCarousel();
        requestAnimationFrame(() => setTrackTransition(true));
      }
    });

    if (nextBtn) nextBtn.addEventListener("click", goToNext);
    if (prevBtn) prevBtn.addEventListener("click", goToPrev);

    // 4) 창 크기 변경 시에도 현재 인덱스 기준으로 위치 재계산
    window.addEventListener("resize", () => {
      setTrackTransition(false);
      updateProjectCarousel();
      requestAnimationFrame(() => setTrackTransition(true));
    });

    // 5) 초기 위치 설정 (1번 카드가 가운데 오도록)
    setTrackTransition(false);
    updateProjectCarousel();
    requestAnimationFrame(() => setTrackTransition(true));
  }
});
