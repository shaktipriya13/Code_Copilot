export function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function createHighlightedPageHtml(
  code = "",
  {
    title = "Code Snippet",
    language = "text",
    filename = "snippet.txt",
    theme = "okaidia",
    screenshotUrl = null,
  } = {}
) {
  const raw = String(code || "");
  const escaped = escapeHtml(raw);

  const fontUrl = `https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap`;
  const prismCss = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-${theme}.min.css`;
  const prismCore = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js`;
  const prismLang = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-${language}.min.js`;

  const localFaviconPath = "/mnt/data/af80e4c9-2d38-418d-8a0d-1bb8755efa01.png";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${escapeHtml(title)}</title>

<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${fontUrl}">

<link rel="icon" href="${localFaviconPath}">

<link rel="stylesheet" href="${prismCss}">
<style>
  :root{
    --deep-orange: #FF5722;
    --deep-orange-accent: #FF8A2E;
    --bg-dark: #111111;
    --bg-light: #1A1A1A;
    --text-primary: #E8E8E8;
    --text-secondary: #AAAAAA;
    --border-light: rgba(255, 255, 255, 0.15);
  }
  html,body{height:100%; margin:0; font-family:'Inter', sans-serif; box-sizing: border-box;}
  *, *::before, *::after {box-sizing: inherit;}
  body{
    background-color: var(--bg-dark);
    color: var(--text-primary);
    display:flex;
    flex-direction:column;
    min-height:100vh;
    -webkit-font-smoothing:antialiased;
    -moz-osx-font-smoothing:grayscale;
  }

  .topbar{
    display:flex;
    align-items:center;
    justify-content:space-between;
    padding: 16px 40px;
    background-color: var(--bg-light);
    border-bottom: 1px solid var(--border-light);
  }
  .brand{
    display:flex;
    gap:10px;
    align-items:center;
  }

  .logo{
    width:40px;
    height:40px;
    border-radius:8px;
    display:inline-grid;
    place-items:center;
    font-family: 'Inter', system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    font-weight:800;
    font-size:18px;
    line-height:1;
    letter-spacing:0.2px;
    color:#000000;
    background: linear-gradient(135deg, rgb(204,78,0) 0%, rgb(255,112,40) 55%, #1f1f1f 100%);
    border: 1px solid #ffffff;
    box-shadow: 0 6px 12px rgba(0,0,0,0.25), 0 2px 4px rgba(255,123,0,0.08);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    text-transform: none;
  }

  .title .main{
    font-weight:700;
    font-size:18px;
    color: var(--text-primary);
  }
  .title .sub{
    font-size:12px;
    color: var(--text-secondary);
    margin-top:2px;
  }
  .controls{display:flex; gap:8px; align-items:center;}
  .btn{
    display:inline-flex;
    align-items:center;
    gap:8px;
    padding: 8px 14px;
    border-radius: 8px;
    border: none;
    color: var(--bg-dark);
    font-weight:600;
    cursor:pointer;
    text-decoration:none;
    transition: opacity 0.2s;
    background: linear-gradient(90deg, var(--deep-orange), var(--deep-orange-accent));
  }
  .btn:hover{opacity: 0.9;}
  .btn.secondary{
    background-color: transparent;
    color: var(--text-primary);
    border:1px solid var(--border-light);
    font-weight:500;
  }
  .btn.secondary:hover{border-color: var(--deep-orange); opacity: 0.9;}

  .container{
    padding:40px;
    flex:1;
    display:flex;
    gap:40px;
    align-items:flex-start;
    max-width:1400px;
    margin: 0 auto;
    width: 100%;
  }
  .main{
    flex:1;
    display:flex;
    flex-direction:column;
    gap:16px;
    min-width: 0;
  }
  .code-wrapper{
    border-radius:12px;
    overflow:hidden;
    background-color: #000000;
    border: 1px solid var(--border-light);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    display:flex;
    flex-direction:column;
  }
  .filename{
    font-size:13px;
    color: var(--text-secondary);
    padding:12px 20px;
    display:flex;
    justify-content:space-between;
    align-items:center;
    background-color: #1F1F1F;
    border-bottom:1px solid var(--border-light);
  }
  .filename .left{display:flex; gap:12px; align-items:center;}
  .file-pill{
    padding:4px 8px;
    border-radius:4px;
    background-color: rgba(255, 87, 34, 0.1);
    border: 1px solid var(--deep-orange);
    color: var(--deep-orange);
    font-weight:600;
    font-size:12px;
  }
  pre{
    margin:0;
    padding:20px;
    font-size:14px;
    line-height:1.5;
    background: transparent;
    white-space:pre;
    overflow:auto;
    max-height: calc(100vh - 200px);
  }
  .meta{color: var(--text-secondary); font-size:13px;}

  .sidebar{
    width:300px;
    flex-shrink: 0;
    display:flex;
    flex-direction:column;
    gap:20px;
  }
  .side-card{
    padding:16px;
    border-radius:12px;
    background-color: #1F1F1F;
    border:1px solid var(--border-light);
    color: var(--text-secondary);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  .side-card h4{margin:0 0 10px 0; color: var(--deep-orange); font-weight:700; font-size:16px; border-bottom:1px solid rgba(255, 87, 34, 0.2); padding-bottom: 8px;}
  .side-row{display:flex; justify-content:space-between; gap:8px; margin-top:8px; font-size:14px;}
  .side-row strong{color: var(--text-primary); font-weight: 600;}
  .action-row{display:flex; gap:8px; margin-top:12px;}
  .badge{
    padding:4px 8px;
    border-radius:6px;
    background-color: var(--bg-dark);
    border:1px solid var(--border-light);
    color: var(--text-secondary);
    font-weight:500;
    font-size:12px;
  }

  .footer{
    padding:14px 40px;
    text-align:center;
    color:var(--text-secondary);
    font-size:12px;
    border-top:1px solid var(--border-light);
    background-color: var(--bg-light);
  }
  a,button{outline:none;}

  @media (max-width:1080px){
    .container{flex-direction:column; gap:20px; padding:20px; max-width: 100%;}
    .sidebar{width:100%;}
    pre{max-height: calc(100vh - 300px);}
  }
</style>
</head>
<body>
  <div class="topbar">
    <div class="brand">
      <div class="logo">CC</div>
      <div class="title">
        <div class="main">${escapeHtml(title)}</div>
        <div class="sub">History Generation</div>
      </div>
    </div>
    <div class="controls">
      <button id="copyBtn" class="btn">Copy</button>
      <a id="downloadLink" class="btn secondary" download="${escapeHtml(
        filename
      )}" href="#">Download</a>
      <a id="openRaw" class="btn secondary" target="_blank" rel="noopener">Raw</a>
    </div>
  </div>

  <div class="container">
    <div class="main">
      <div class="code-wrapper" role="region" aria-label="Code content">
        <div class="filename">
          <div class="left">
            <div class="file-pill">${escapeHtml(filename)}</div>
            <div class="meta">Language: <strong style="color:var(--deep-orange); margin-left:6px;">${escapeHtml(
              language
            )}</strong></div>
          </div>
          <div class="meta"><span id="linesCount">${
            (raw.match(/\n/g) || []).length + 1
          }</span> lines</div>
        </div>
        <pre class="language-${escapeHtml(
          language
        )}"><code id="codeBlock" class="language-${escapeHtml(
    language
  )}">${escaped}</code></pre>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; margin-top:4px;">
        <div style="display:flex; gap:8px;">
        </div>
      </div>
    </div>

    <div class="sidebar" aria-hidden="true">
      <div class="side-card">
        <h4>Snippet Info</h4>
        <div class="side-row"><div>Filename</div><div><strong>${escapeHtml(
          filename
        )}</strong></div></div>
        <div class="side-row"><div>Language</div><div><strong>${escapeHtml(
          language
        )}</strong></div></div>
        <div class="side-row"><div>Lines</div><div><strong>${
          (raw.match(/\n/g) || []).length + 1
        }</strong></div></div>
        <div class="action-row">
          <div class="badge">Read-only</div>
        </div>
      </div>

      <div class="side-card">
        <h4>Snippet Guide</h4>
        <div style="color:var(--text-secondary); font-size:13px; line-height:1.5;">
          This page shows your generated code in read-only mode. Use Copy to copy the raw text, Download to save it, and Raw to view the plain file in a new tab.
        </div>
      </div>
    </div>
  </div>

  <div class="footer">Designed & Created by Shakti Priya 🧡</div>

  <script>
    (function() {
      const rawText = ${JSON.stringify(raw)};
      const copyBtn = document.getElementById('copyBtn');
      const downloadLink = document.getElementById('downloadLink');
      const openRaw = document.getElementById('openRaw');
      const blob = new Blob([rawText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      downloadLink.href = url;
      openRaw.href = url;
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(rawText);
          const prev = copyBtn.textContent;
          copyBtn.textContent = 'Copied!';
          setTimeout(() => copyBtn.textContent = prev, 1200);
        } catch (e) {
          alert('Copy failed');
        }
      });
      function tryHighlight() {
        if (window.Prism && Prism.highlightAll) {
          Prism.highlightAll();
        } else {
          let tries = 0;
          const id = setInterval(() => {
            tries++;
            if (window.Prism && Prism.highlightAll) {
              clearInterval(id);
              Prism.highlightAll();
            } else if (tries > 20) {
              clearInterval(id);
            }
          }, 100);
        }
      }
      window.addEventListener('unload', () => {
        URL.revokeObjectURL(url);
      });
      window.__tryPrism = tryHighlight;
    })();
  </script>

  <script src="${prismCore}"></script>
  <script src="${prismLang}"></script>
  <script>window.__tryPrism && window.__tryPrism();</script>
</body>
</html>`;
}
