(function () {
  var $ = function (i) {
    return document.getElementById(i);
  };
  // Khách mời: thêm ?khach=Tên vào đường dẫn
  try {
    var g = new URLSearchParams(location.search).get("khach");
    $("guestName").textContent = g || "Quý khách";
  } catch (e) {
    $("guestName").textContent = "Quý khách";
  }

  $("openBtn").addEventListener("click", function () {
    $("cover").classList.add("open");
    document.body.classList.remove("locked");
    setTimeout(function () {
      window.scrollTo(0, 0);
    }, 50);
  });

  // Hiệu ứng hiện dần khi cuộn
  var io = new IntersectionObserver(
    function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  document.querySelectorAll(".reveal").forEach(function (el) {
    io.observe(el);
  });

  // Hai album trượt ngang độc lập; ảnh hiện tại nằm ở giữa và được nhấn sáng.
  document.querySelectorAll(".album-carousel").forEach(function (carousel) {
    var viewport = carousel.querySelector(".album-viewport");
    var track = carousel.querySelector(".album-track");
    var slides = Array.from(track.children);
    var current = 0;
    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === current);
        slide.classList.toggle(
          "prev-slide",
          i === (current - 1 + slides.length) % slides.length,
        );
        slide.classList.toggle(
          "next-slide",
          i === (current + 1) % slides.length,
        );
      });
    }
    carousel.querySelector(".previous").addEventListener("click", function () {
      show(current - 1);
    });
    carousel.querySelector(".next").addEventListener("click", function () {
      show(current + 1);
    });
    viewport.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        show(current - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        show(current + 1);
      }
    });
    window.addEventListener("resize", function () {
      show(current);
    });
    show(0);
    window.setInterval(function () {
      show(current + 1);
    }, 2500);
  });

  // Đếm ngược tới 19/12/2026 10:00
  var target = new Date(2026, 11, 19, 10, 0, 0).getTime();
  function pad(n) {
    return String(n).padStart(2, "0");
  }
  function tick() {
    var t = Math.max(0, target - Date.now());
    $("d").textContent = pad(Math.floor(t / 864e5));
    $("h").textContent = pad(Math.floor((t % 864e5) / 36e5));
    $("m").textContent = pad(Math.floor((t % 36e5) / 6e4));
    $("s").textContent = pad(Math.floor((t % 6e4) / 1e3));
  }
  tick();
  setInterval(tick, 1000);

  // Lời chúc (lưu cục bộ trên trình duyệt)
  var list = [];
  try {
    list = JSON.parse(localStorage.getItem("wishes") || "[]");
  } catch (e) {}
  function esc(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c];
    });
  }
  function render() {
    $("wishes").innerHTML = list
      .slice()
      .reverse()
      .map(function (w) {
        return (
          '<div class="wish"><b>' +
          esc(w.n) +
          "</b> · <small>" +
          esc(w.a) +
          "</small><br>" +
          esc(w.m) +
          "</div>"
        );
      })
      .join("");
  }
  function toast(t) {
    var el = $("toast");
    el.textContent = t;
    el.classList.add("show");
    setTimeout(function () {
      el.classList.remove("show");
    }, 2400);
  }
  $("send").addEventListener("click", function () {
    var n = $("fName").value.trim(),
      m = $("fMsg").value.trim();
    if (!n) {
      toast("Bạn vui lòng nhập tên nhé");
      return;
    }
    list.push({
      n: n,
      m: m || "Chúc hai bạn trăm năm hạnh phúc!",
      a: $("fAtt").value,
    });
    try {
      localStorage.setItem("wishes", JSON.stringify(list));
    } catch (e) {}
    $("fName").value = "";
    $("fMsg").value = "";
    render();
    toast("Cảm ơn lời chúc của bạn ♡");
  });
  render();
})();
