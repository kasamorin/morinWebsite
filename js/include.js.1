/**
 * include.js
 * 提供一个自定义 <include> 标签，将外部 HTML 文件的内容原地引入。
 *
 * 用法:
 *   <include src="path/to/file.html"></include>
 *
 * 注意:
 *   1. 需要在本地服务器环境下运行（如 Live Server、http-server），
 *      直接双击打开 HTML 文件会因 fetch 跨域限制而失败。
 *   2. 被包含的文件可以继续使用 <include>，支持嵌套。
 *   3. <include> 标签应放在 <body> 内，避免浏览器解析时将其移出 <head>。
 */

(function () {
  // DOM 加载完成后执行
  function whenReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  async function processAll() {
    // 一直循环直到页面中不再有 <include> 标签
    let includes = document.querySelectorAll('include');
    while (includes.length > 0) {
      for (const el of includes) {
        await replaceInclude(el);
      }
      includes = document.querySelectorAll('include');
    }
  }

  async function replaceInclude(el) {
    const src = el.getAttribute('src');
    if (!src) {
      console.warn('<include> 缺少 src 属性', el);
      return;
    }

    try {
      const response = await fetch(src);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const html = await response.text();

      // 用 template 安全解析 HTML 字符串
      const template = document.createElement('template');
      template.innerHTML = html.trim();

      const parent = el.parentNode;
      if (parent) {
        // 将解析后的所有子节点插入到 <include> 之前
        while (template.content.firstChild) {
          parent.insertBefore(template.content.firstChild, el);
        }
        // 移除 <include> 占位标签
        parent.removeChild(el);
      }
    } catch (err) {
      console.error(`加载包含文件失败: ${src}`, err);
      el.insertAdjacentHTML('afterend', `<!-- 包含失败: ${src} -->`);
    }
  }

  whenReady(processAll);
})();