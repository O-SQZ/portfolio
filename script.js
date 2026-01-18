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
     4) Projects 캐러셀 (끝에서 반대쪽으로 점프)
     ========================= */
  const projectTrack = document.querySelector(".project-track");
  const projectCards = projectTrack
    ? Array.from(projectTrack.querySelectorAll(".project-card"))
    : [];

  if (projectTrack && projectCards.length) {
    const prevBtn = document.querySelector(".project-carousel-btn-prev");
    const nextBtn = document.querySelector(".project-carousel-btn-next");
    const projectWindow = document.querySelector(".project-window");

    const CARD_GAP = 24; // styles.css의 .project-track gap과 동일해야 함

    let currentIndex = 0; // "왼쪽에 보이는 카드"의 인덱스
    let maxIndex = 0;     // 마지막으로 갈 수 있는 인덱스 (예: 3 4 5 상태의 3에 해당)

    function getCardWidth() {
      if (!projectCards.length) return 0;
      const rect = projectCards[0].getBoundingClientRect();
      return rect.width + CARD_GAP;
    }

    function recalcBounds() {
      const cardWidth = getCardWidth();
      if (!cardWidth) {
        maxIndex = 0;
        return;
      }

      const containerWidth = projectWindow
        ? projectWindow.getBoundingClientRect().width
        : cardWidth;

      const visibleCount = Math.max(
        1,
        Math.round(containerWidth / cardWidth)
      );

      maxIndex = Math.max(0, projectCards.length - visibleCount);

      if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
      }
    }

    function updateProjectCarousel() {
      const cardWidth = getCardWidth();
      projectTrack.style.transform = `translateX(-${currentIndex * cardWidth
        }px)`;
    }

    function goToNext() {
      if (currentIndex >= maxIndex) {
        // 우측 끝(3 4 5)에서 한 번 더 → 다시 처음(1 2 3)
        currentIndex = 0;
      } else {
        currentIndex += 1;
      }
      updateProjectCarousel();
    }

    function goToPrev() {
      if (currentIndex <= 0) {
        // 맨 앞(1 2 3)에서 왼쪽 → 마지막(3 4 5) 상태로
        currentIndex = maxIndex;
      } else {
        currentIndex -= 1;
      }
      updateProjectCarousel();
    }

    // 버튼 이벤트
    if (nextBtn) nextBtn.addEventListener("click", goToNext);
    if (prevBtn) prevBtn.addEventListener("click", goToPrev);

    // 초기 계산 + 반응형 대응
    recalcBounds();
    updateProjectCarousel();

    window.addEventListener("resize", () => {
      recalcBounds();
      updateProjectCarousel();
    });
  }

  // Learning 섹션 슬라이더 + 필터/정렬
  (function () {
    const track = document.querySelector(".learning-track");
    if (!track) return;

    const allCards = Array.from(track.children);
    let filteredCards = allCards.slice();

    const tagSelect = document.getElementById("learningTagFilter");
    const sortSelect = document.getElementById("learningSort");
    const prevBtn = document.querySelector(".learning-carousel-btn-prev");
    const nextBtn = document.querySelector(".learning-carousel-btn-next");

    let currentIndex = 0;

    function getCardsPerView() {
      return window.innerWidth < 768 ? 1 : 2;
    }

    function applyFilterAndSort() {
      const tag = tagSelect ? tagSelect.value : "all";
      const sort = sortSelect ? sortSelect.value : "recent";

      filteredCards = allCards.filter((card) => {
        if (tag === "all") return true;
        const tags = (card.dataset.tags || "")
          .split(",")
          .map((t) => t.trim());
        return tags.includes(tag);
      });

      filteredCards.sort((a, b) => {
        const aDate = new Date(a.dataset.start || "1970-01-01");
        const bDate = new Date(b.dataset.start || "1970-01-01");
        return sort === "recent" ? bDate - aDate : aDate - bDate;
      });

      // 트랙 재구성
      track.innerHTML = "";
      filteredCards.forEach((card) => track.appendChild(card));
      currentIndex = 0;
      updateTransform();
    }

    function updateTransform() {
      const cardsPerView = getCardsPerView();
      const firstCard = track.querySelector(".learning-card");
      if (!firstCard) return;

      const cardWidth = firstCard.getBoundingClientRect().width;
      const gap = 20; // CSS의 gap 값과 맞춤
      const slideWidth = cardWidth + gap;

      const maxIndex = Math.max(0, filteredCards.length - cardsPerView);
      if (currentIndex < 0) currentIndex = 0;
      if (currentIndex > maxIndex) currentIndex = maxIndex;

      track.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
    }

    function moveNext() {
      currentIndex += getCardsPerView();
      updateTransform();
    }

    function movePrev() {
      currentIndex -= getCardsPerView();
      updateTransform();
    }

    if (tagSelect) {
      tagSelect.addEventListener("change", applyFilterAndSort);
    }
    if (sortSelect) {
      sortSelect.addEventListener("change", applyFilterAndSort);
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", moveNext);
    }
    if (prevBtn) {
      prevBtn.addEventListener("click", movePrev);
    }

    window.addEventListener("resize", updateTransform);

    // 초기 렌더
    applyFilterAndSort();
  })();
});