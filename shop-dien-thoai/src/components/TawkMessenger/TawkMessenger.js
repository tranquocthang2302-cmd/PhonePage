import { useEffect } from "react";

const TawkMessenger = () => {
  useEffect(() => {
    // 1. Khởi tạo API và ép ngôn ngữ sang tiếng Việt
    window.Tawk_API = window.Tawk_API || {};

    // Thêm dòng này để khung chat tự động hiểu là tiếng Việt
    window.Tawk_API.onLoad = function () {
      window.Tawk_API.setAttributes(
        {
          language: "vi",
        },
        function (error) {},
      );
    };

    window.Tawk_LoadStart = new Date();

    // 2. Chèn script Tawk.to
    (function () {
      const s1 = document.createElement("script");
      const s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = "https://embed.tawk.to/69dddd7c9ef2731c3237afd6/1jm5aicie";
      s1.charset = "UTF-8";
      s1.setAttribute("crossorigin", "*");
      s0.parentNode.insertBefore(s1, s0);
    })();

    // 3. Cleanup
    return () => {
      const scripts = document.querySelectorAll(
        'script[src^="https://embed.tawk.to"]',
      );
      scripts.forEach((script) => script.remove());
      // Xóa các khung chat thừa khi chuyển trang hoặc unmount
      const tawkContainer = document.querySelector(".tawk-main-container");
      if (tawkContainer) tawkContainer.remove();
    };
  }, []);

  return null;
};

export default TawkMessenger;
