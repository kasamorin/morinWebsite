// include.js

(async function () {
  const MAX_DEPTH = 20;

  async function loadIncludes(root = document, depth = 0) {
    if (depth > MAX_DEPTH) {
      console.warn("[include.js] include 嵌套层级过深，已停止处理");
      return;
    }

    const includes = root.querySelectorAll("include[src]");

    for (const el of includes) {
      const src = el.getAttribute("src");

      if (!src) continue;

      try {
        const res = await fetch(src);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const html = await res.text();

        const fragment = document.createDocumentFragment();
        const temp = document.createElement("template");

        temp.innerHTML = html;
        fragment.appendChild(temp.content);

        const parent = el.parentNode;

        el.replaceWith(fragment);

        // 继续处理被引入内容里的 include
        if (parent) {
          await loadIncludes(parent, depth + 1);
        }
      } catch (err) {
        console.error(`[include.js] 加载失败：${src}`, err);

        el.replaceWith(
          document.createComment(`include failed: ${src}`)
        );
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      loadIncludes();
    });
  } else {
    loadIncludes();
  }
})();
