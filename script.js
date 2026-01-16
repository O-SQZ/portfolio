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

  /* =========================
   5) Blog – Tistory RSS 최신 4개 불러오기
   ========================= */
  const blogGrid = document.getElementById("blog-grid");

  if (blogGrid) {
    const RSS_URL = "https://o-sqz.tistory.com/rss";

    function stripHtml(html) {
      const tmp = document.createElement("div");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    }

    function extractFirstImageSrc(html) {
      const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
      return match ? match[1] : null;
    }

    function createBlogCard(post) {
      const card = document.createElement("article");
      card.className = "blog-card";

      const hasThumb = !!post.thumbnail;

      card.innerHTML = `
        <div class="blog-thumb ${hasThumb ? "" : "blog-thumb-placeholder"}">
          ${hasThumb
          ? `<img src="${post.thumbnail}" alt="${post.title} 썸네일" />`
          : ""
        }
        </div>
        <div class="blog-body">
          <div class="blog-meta">
            <span class="blog-date">${post.date}</span>
          </div>
          <h3 class="blog-title">
            <a href="${post.link}" target="_blank" rel="noreferrer">
              ${post.title}
            </a>
          </h3>
          <p class="blog-excerpt">
            ${post.excerpt}
          </p>
        </div>
      `;

      return card;
    }

    async function loadBlogPosts() {
      try {
        const res = await fetch(RSS_URL);
        if (!res.ok) throw new Error("RSS fetch failed");

        const text = await res.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "application/xml");

        const items = Array.from(xml.querySelectorAll("item")).slice(0, 4);

        if (!items.length) {
          throw new Error("No RSS items");
        }

        // 기존 로딩 카드 제거
        blogGrid.innerHTML = "";

        items.forEach((item) => {
          const title = item.querySelector("title")?.textContent?.trim() || "";
          const link = item.querySelector("link")?.textContent?.trim() || "#";
          const pubDate =
            item.querySelector("pubDate")?.textContent?.trim() || "";
          const descRaw =
            item.querySelector("description")?.textContent || "";

          const thumb = extractFirstImageSrc(descRaw);
          const plain = stripHtml(descRaw).replace(/\s+/g, " ").trim();
          const excerpt =
            plain.length > 80 ? `${plain.slice(0, 80)}...` : plain;

          const post = {
            title,
            link,
            date: pubDate ? new Date(pubDate).toISOString().slice(0, 10) : "",
            excerpt,
            thumbnail: thumb,
          };

          blogGrid.appendChild(createBlogCard(post));
        });
      } catch (err) {
        console.error("Blog RSS load error:", err);
        blogGrid.innerHTML = `
          <article class="blog-card blog-card-loading">
            <div class="blog-thumb blog-thumb-placeholder"></div>
            <div class="blog-body">
              <div class="blog-meta">
                <span class="blog-date">Error</span>
              </div>
              <h3 class="blog-title">
                <a href="https://o-sqz.tistory.com/" target="_blank" rel="noreferrer">
                  블로그를 불러오지 못했습니다.
                </a>
              </h3>
              <p class="blog-excerpt">
                직접 블로그에서 최신 포스팅을 확인해 주세요.
              </p>
            </div>
          </article>
        `;
      }
    }

    loadBlogPosts();
  }
});