import { useState, useCallback } from "react";

const LANGUAGES = [
  { code: "auto", label: "Auto Detect" },
  { code: "English", label: "English" },
  { code: "French", label: "French" },
  { code: "Spanish", label: "Spanish" },
  { code: "Arabic", label: "Arabic" },
  { code: "Hausa", label: "Hausa" },
  { code: "Yoruba", label: "Yoruba" },
  { code: "Igbo", label: "Igbo" },
  { code: "Swahili", label: "Swahili" },
  { code: "German", label: "German" },
  { code: "Portuguese", label: "Portuguese" },
  { code: "Chinese (Simplified)", label: "Chinese" },
  { code: "Japanese", label: "Japanese" },
  { code: "Hindi", label: "Hindi" },
  { code: "Russian", label: "Russian" },
  { code: "Italian", label: "Italian" },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .app {
    min-height: 100vh;
    background: #0a0a0f;
    color: #e8e8e0;
    font-family: 'DM Mono', monospace;
    padding: 0;
    overflow-x: hidden;
    position: relative;
  }

  .noise {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.4;
  }

  .glow-orb {
    position: fixed;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,230,150,0.06) 0%, transparent 70%);
    top: -100px; left: -100px;
    pointer-events: none; z-index: 0;
    animation: drift 12s ease-in-out infinite alternate;
  }

  @keyframes drift {
    from { transform: translate(0,0); }
    to { transform: translate(80px, 60px); }
  }

  .container {
    max-width: 900px;
    margin: 0 auto;
    padding: 40px 24px;
    position: relative; z-index: 1;
  }

  .header {
    margin-bottom: 48px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    padding-bottom: 28px;
  }

  .badge {
    display: inline-block;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #00e696;
    border: 1px solid rgba(0,230,150,0.3);
    padding: 4px 12px;
    border-radius: 2px;
    margin-bottom: 16px;
  }

  .title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(32px, 5vw, 56px);
    font-weight: 800;
    line-height: 1.0;
    letter-spacing: -0.02em;
    color: #f0f0e8;
  }

  .title span { color: #00e696; }

  .subtitle {
    margin-top: 10px;
    font-size: 12px;
    color: rgba(255,255,255,0.35);
    letter-spacing: 0.05em;
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .lang-select {
    flex: 1;
    min-width: 140px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    color: #e8e8e0;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    padding: 10px 14px;
    border-radius: 4px;
    outline: none;
    cursor: pointer;
    transition: border-color 0.2s;
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2300e696' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 32px;
  }

  .lang-select:focus { border-color: #00e696; }
  .lang-select option { background: #16161f; }

  .swap-btn {
    width: 40px; height: 40px;
    background: rgba(0,230,150,0.08);
    border: 1px solid rgba(0,230,150,0.25);
    border-radius: 4px;
    color: #00e696;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .swap-btn:hover {
    background: rgba(0,230,150,0.15);
    transform: rotate(180deg);
  }

  .panels {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  @media (max-width: 600px) {
    .panels { grid-template-columns: 1fr; }
  }

  .panel {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 6px;
    overflow: hidden;
    transition: border-color 0.2s;
  }

  .panel:focus-within { border-color: rgba(0,230,150,0.3); }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.3);
  }

  .panel-header .dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #00e696;
    opacity: 0.5;
  }

  .textarea {
    width: 100%;
    min-height: 220px;
    background: transparent;
    border: none;
    color: #e8e8e0;
    font-family: 'DM Mono', monospace;
    font-size: 14px;
    line-height: 1.7;
    padding: 18px;
    resize: vertical;
    outline: none;
  }

  .textarea::placeholder { color: rgba(255,255,255,0.2); }

  .output-text {
    min-height: 220px;
    padding: 18px;
    font-size: 14px;
    line-height: 1.7;
    color: #e8e8e0;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .output-empty {
    color: rgba(255,255,255,0.18);
    font-style: italic;
  }

  .loading-dots {
    display: inline-flex;
    gap: 4px;
    align-items: center;
    padding: 18px;
  }

  .loading-dots span {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #00e696;
    animation: bounce 1.2s infinite;
  }

  .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
  .loading-dots span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes bounce {
    0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
    40% { opacity: 1; transform: scale(1.1); }
  }

  .action-bar {
    display: flex;
    gap: 10px;
    margin-top: 20px;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: wrap;
  }

  .char-count {
    font-size: 11px;
    color: rgba(255,255,255,0.25);
    flex: 1;
    letter-spacing: 0.05em;
  }

  .btn {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 10px 20px;
    border-radius: 3px;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
  }

  .btn-primary {
    background: #00e696;
    color: #0a0a0f;
    font-weight: 600;
  }

  .btn-primary:hover:not(:disabled) {
    background: #00ffaa;
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(0,230,150,0.3);
  }

  .btn-primary:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .btn-ghost {
    background: transparent;
    color: rgba(255,255,255,0.5);
    border: 1px solid rgba(255,255,255,0.12);
  }

  .btn-ghost:hover {
    background: rgba(255,255,255,0.05);
    color: #e8e8e0;
    border-color: rgba(255,255,255,0.2);
  }

  .btn-copy {
    background: transparent;
    border: 1px solid rgba(0,230,150,0.25);
    color: #00e696;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    padding: 4px 10px;
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-copy:hover { background: rgba(0,230,150,0.1); }

  .error-bar {
    margin-top: 16px;
    padding: 12px 16px;
    background: rgba(255,80,80,0.07);
    border: 1px solid rgba(255,80,80,0.2);
    border-radius: 4px;
    font-size: 12px;
    color: #ff6b6b;
    letter-spacing: 0.03em;
  }

  .divider {
    height: 1px;
    background: rgba(255,255,255,0.06);
    margin: 32px 0;
  }

  .footer {
    font-size: 10px;
    color: rgba(255,255,255,0.18);
    text-align: center;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .copied-toast {
    position: fixed;
    bottom: 32px;
    right: 32px;
    background: #00e696;
    color: #0a0a0f;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.1em;
    padding: 10px 20px;
    border-radius: 4px;
    z-index: 100;
    animation: slideIn 0.3s ease;
    text-transform: uppercase;
  }

  @keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

export default function TranslationTool() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("French");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const translate = useCallback(async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setError("");
    setOutputText("");

    const sourceLabel =
      sourceLang === "auto" ? "auto-detected language" : sourceLang;

    const prompt = `Translate the following text from ${sourceLabel} to ${targetLang}. 
Return ONLY the translated text — no explanations, no notes, no extra formatting. Just the translation.

Text to translate:
${inputText}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await res.json();
      if (data?.content?.[0]?.text) {
        setOutputText(data.content[0].text.trim());
      } else {
        setError("Translation failed. Check your connection and try again.");
      }
    } catch (e) {
      setError("Network error. Please try again.");
    }

    setLoading(false);
  }, [inputText, sourceLang, targetLang]);

  const handleSwap = () => {
    if (sourceLang === "auto") return;
    const tmp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tmp);
    setInputText(outputText);
    setOutputText(inputText);
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setError("");
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="noise" />
        <div className="glow-orb" />

        <div className="container">
          <div className="header">
            <div className="badge">CodeAlpha AI Internship — Task 01</div>
            <h1 className="title">
              Language<br /><span>Translation</span>
            </h1>
            <p className="subtitle">
              Powered by Claude AI &nbsp;·&nbsp; 15 Languages Supported
            </p>
          </div>

          {/* Language Controls */}
          <div className="controls">
            <select
              className="lang-select"
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>

            <button className="swap-btn" onClick={handleSwap} title="Swap languages">
              ⇄
            </button>

            <select
              className="lang-select"
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
            >
              {LANGUAGES.filter((l) => l.code !== "auto").map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Text Panels */}
          <div className="panels">
            <div className="panel">
              <div className="panel-header">
                <span>Source</span>
                <div className="dot" />
              </div>
              <textarea
                className="textarea"
                placeholder="Enter text to translate..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.ctrlKey && e.key === "Enter") translate();
                }}
              />
            </div>

            <div className="panel">
              <div className="panel-header">
                <span>Translation</span>
                {outputText && (
                  <button className="btn-copy" onClick={handleCopy}>
                    Copy
                  </button>
                )}
              </div>
              {loading ? (
                <div className="loading-dots">
                  <span /><span /><span />
                </div>
              ) : outputText ? (
                <div className="output-text">{outputText}</div>
              ) : (
                <div className="output-text output-empty">
                  Translation will appear here...
                </div>
              )}
            </div>
          </div>

          {error && <div className="error-bar">⚠ {error}</div>}

          {/* Actions */}
          <div className="action-bar">
            <span className="char-count">{inputText.length} chars</span>
            <button className="btn btn-ghost" onClick={handleClear}>
              Clear
            </button>
            <button
              className="btn btn-primary"
              onClick={translate}
              disabled={loading || !inputText.trim()}
            >
              {loading ? "Translating..." : "Translate ↵"}
            </button>
          </div>

          <div className="divider" />
          <p className="footer">
            CodeAlpha · AI Internship · Built by Dibbson · {new Date().getFullYear()}
          </p>
        </div>

        {copied && <div className="copied-toast">Copied ✓</div>}
      </div>
    </>
  );
}
