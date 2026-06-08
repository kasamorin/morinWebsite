// include.js

(async function () {
  const MAX_DEPTH = 20;

  function toAbsoluteUrl(url, baseUrl) {
    if (!url || /^(?:[a-z]+:|\/\/|#)/i.test(url)) {
      return url;
    }

    return new URL(url, baseUrl).href;
  }

  function rewriteResourceUrls(fragment, baseUrl) {
    for (const el of fragment.querySelectorAll("[src], [href]")) {
      if (el.hasAttribute("src")) {
        el.setAttribute("src", toAbsoluteUrl(el.getAttribute("src"), baseUrl));
      }

      if (el.hasAttribute("href")) {
        el.setAttribute("href", toAbsoluteUrl(el.getAttribute("href"), baseUrl));
      }
    }
  }

  function reactivateScripts(fragment) {
    for (const oldScript of fragment.querySelectorAll("script")) {
      const newScript = document.createElement("script");

      for (const { name, value } of oldScript.attributes) {
        newScript.setAttribute(name, value);
      }

      newScript.textContent = oldScript.textContent;
      oldScript.replaceWith(newScript);
    }
  }

  async function loadIncludes(root = document, depth = 0, baseUrl = document.baseURI) {
    if (depth > MAX_DEPTH) {
      console.warn("[include.js] include 嵌套层级过深，已停止处理");
      return;
    }

    const includes = root.querySelectorAll("include[src]");

    for (const el of includes) {
      const src = el.getAttribute("src");

      if (!src) continue;

      try {
        const resolvedSrc = toAbsoluteUrl(src, baseUrl);
        const res = await fetch(resolvedSrc);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const html = await res.text();
        const nextBaseUrl = new URL(resolvedSrc, document.baseURI).href;

        const fragment = document.createDocumentFragment();
        const temp = document.createElement("template");

        temp.innerHTML = html;
        rewriteResourceUrls(temp.content, nextBaseUrl);
        reactivateScripts(temp.content);
        fragment.appendChild(temp.content);

        const parent = el.parentNode;

        el.replaceWith(fragment);

        // 继续处理被引入内容里的 include
        if (parent) {
          await loadIncludes(parent, depth + 1, nextBaseUrl);
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
