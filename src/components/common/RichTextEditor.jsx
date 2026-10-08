import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Quote,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link2,
  Unlink,
  Undo,
  Redo,
  Eraser,
  Code2,
  Eye,
  Edit3,
  Sparkles,
  X,
} from 'lucide-react';

export const RichTextEditor = ({
  value = '',
  onChange,
  label = 'Detailed Content (HTML Supported)',
  placeholder = 'Craft your rich luxury description or article content here...',
  minHeight = '240px',
  hint = 'Supports rich headings, bullet lists, blockquotes, and HTML formatting.',
  required = false,
}) => {
  const [activeTab, setActiveTab] = useState('visual'); // 'visual' | 'code' | 'preview'
  const [htmlContent, setHtmlContent] = useState(value || '');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [openInNewTab, setOpenInNewTab] = useState(true);

  const editorRef = useRef(null);
  const savedSelectionRef = useRef(null);

  // Synchronize when value prop updates from parent (e.g., initial open or edit modal load)
  useEffect(() => {
    const nextVal = value || '';
    setHtmlContent(nextVal);
    if (editorRef.current && editorRef.current.innerHTML !== nextVal) {
      editorRef.current.innerHTML = nextVal;
    }
  }, [value]);

  // Synchronize visual editor typing to state and parent onChange
  const handleVisualInput = useCallback(() => {
    if (!editorRef.current) return;
    let html = editorRef.current.innerHTML;
    // Treat empty breaks as empty string
    if (html === '<br>' || html === '<p><br></p>' || html.trim() === '') {
      html = '';
    }
    setHtmlContent(html);
    if (onChange) onChange(html);
  }, [onChange]);

  // Direct editing inside HTML Code tab
  const handleCodeChange = (e) => {
    const nextHtml = e.target.value;
    setHtmlContent(nextHtml);
    if (onChange) onChange(nextHtml);
    if (editorRef.current) {
      editorRef.current.innerHTML = nextHtml;
    }
  };

  // Safe tab switching ensuring no content is ever lost
  const handleTabSwitch = (newTab) => {
    if (activeTab === 'visual') {
      // Immediately commit whatever was typed in the visual editor
      if (editorRef.current) {
        let html = editorRef.current.innerHTML;
        if (html === '<br>' || html === '<p><br></p>' || html.trim() === '') {
          html = '';
        }
        setHtmlContent(html);
        if (onChange) onChange(html);
      }
    } else if (activeTab === 'code' && newTab === 'visual') {
      // Sync latest HTML changes into the visual editor DOM
      if (editorRef.current) {
        editorRef.current.innerHTML = htmlContent || '';
      }
    }
    setActiveTab(newTab);
  };

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (savedSelectionRef.current) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedSelectionRef.current);
    }
  };

  const exec = (command, valueArg = null) => {
    if (activeTab !== 'visual') return;
    editorRef.current?.focus();
    document.execCommand(command, false, valueArg);
    handleVisualInput();
  };

  const handleFormatBlock = (tag) => {
    if (activeTab !== 'visual') return;
    editorRef.current?.focus();
    document.execCommand('formatBlock', false, tag);
    handleVisualInput();
  };

  const handleInsertGoldSpan = () => {
    if (activeTab !== 'visual') return;
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
      const selectedText = sel.toString();
      document.execCommand(
        'insertHTML',
        false,
        `<span style="color: #D4AF37; font-weight: 600;">${selectedText}</span>`
      );
    } else {
      document.execCommand(
        'insertHTML',
        false,
        `<span style="color: #D4AF37; font-weight: 600;">Royal Luxury</span>`
      );
    }
    handleVisualInput();
  };

  const handleOpenLinkModal = () => {
    saveSelection();
    const sel = window.getSelection();
    setLinkText(sel ? sel.toString() : '');
    setLinkUrl('');
    setShowLinkModal(true);
  };

  const handleApplyLink = (e) => {
    e.preventDefault();
    if (!linkUrl) {
      setShowLinkModal(false);
      return;
    }

    restoreSelection();
    editorRef.current?.focus();

    const formattedUrl =
      linkUrl.startsWith('http://') || linkUrl.startsWith('https://') || linkUrl.startsWith('/')
        ? linkUrl
        : `https://${linkUrl}`;

    if (linkText && savedSelectionRef.current?.collapsed) {
      const targetAttr = openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
      document.execCommand(
        'insertHTML',
        false,
        `<a href="${formattedUrl}"${targetAttr} style="color: #D4AF37; text-decoration: underline;">${linkText}</a>`
      );
    } else {
      document.execCommand('createLink', false, formattedUrl);
      if (openInNewTab && editorRef.current) {
        const anchors = editorRef.current.querySelectorAll(`a[href="${formattedUrl}"]`);
        anchors.forEach((a) => {
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
          a.style.color = '#D4AF37';
          a.style.textDecoration = 'underline';
        });
      }
    }

    setShowLinkModal(false);
    handleVisualInput();
  };

  const handleCleanFormatting = () => {
    exec('removeFormat');
    handleFormatBlock('<p>');
  };

  return (
    <div className="space-y-1.5 w-full">
      {/* Header & Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="block text-zinc-300 uppercase tracking-wider text-[10px] font-medium">
          {label} {required && <span className="text-gold">*</span>}
        </label>

        <div className="flex items-center bg-noir border border-zinc-800 p-0.5 rounded text-[10px]">
          <button
            type="button"
            onClick={() => handleTabSwitch('visual')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
              activeTab === 'visual'
                ? 'bg-gold/20 text-gold-light font-semibold border border-gold/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Edit3 className="w-3 h-3" />
            <span>Visual</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('code')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
              activeTab === 'code'
                ? 'bg-gold/20 text-gold-light font-semibold border border-gold/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3 h-3" />
            <span>HTML Code</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('preview')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
              activeTab === 'preview'
                ? 'bg-gold/20 text-gold-light font-semibold border border-gold/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="border border-zinc-800 focus-within:border-gold bg-noir-card transition-colors relative">
        {/* Toolbar (Only visible in Visual Mode) */}
        {activeTab === 'visual' && (
          <div className="flex flex-wrap items-center gap-1 p-2 bg-[#0c1017] border-b border-zinc-850 select-none text-zinc-300">
            {/* Paragraph / Headings */}
            <div className="flex items-center gap-0.5 border-r border-zinc-800 pr-1.5 mr-1">
              <button
                type="button"
                onClick={() => handleFormatBlock('<p>')}
                title="Normal Paragraph"
                className="px-2 py-1 text-[11px] font-sans rounded hover:bg-zinc-800 hover:text-gold"
              >
                P
              </button>
              <button
                type="button"
                onClick={() => handleFormatBlock('<h2>')}
                title="Heading 2 (Major Section)"
                className="p-1 rounded hover:bg-zinc-800 hover:text-gold"
              >
                <Heading2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleFormatBlock('<h3>')}
                title="Heading 3 (Sub-heading)"
                className="p-1 rounded hover:bg-zinc-800 hover:text-gold"
              >
                <Heading3 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleFormatBlock('<h4>')}
                title="Heading 4 (Minor heading)"
                className="p-1 rounded hover:bg-zinc-800 hover:text-gold"
              >
                <Heading4 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Inline Styles */}
            <div className="flex items-center gap-0.5 border-r border-zinc-800 pr-1.5 mr-1">
              <button
                type="button"
                onClick={() => exec('bold')}
                title="Bold (Ctrl+B)"
                className="p-1 rounded hover:bg-zinc-800 hover:text-gold"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => exec('italic')}
                title="Italic (Ctrl+I)"
                className="p-1 rounded hover:bg-zinc-800 hover:text-gold"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => exec('underline')}
                title="Underline (Ctrl+U)"
                className="p-1 rounded hover:bg-zinc-800 hover:text-gold"
              >
                <Underline className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => exec('strikeThrough')}
                title="Strikethrough"
                className="p-1 rounded hover:bg-zinc-800 hover:text-gold"
              >
                <Strikethrough className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleInsertGoldSpan}
                title="Gold Luxury Highlight"
                className="p-1 rounded hover:bg-zinc-800 text-gold flex items-center gap-0.5 text-[10px]"
              >
                <Sparkles className="w-3 h-3" />
              </button>
            </div>

            {/* Lists */}
            <div className="flex items-center gap-0.5 border-r border-zinc-800 pr-1.5 mr-1">
              <button
                type="button"
                onClick={() => exec('insertUnorderedList')}
                title="Bullet List"
                className="p-1 rounded hover:bg-zinc-800 hover:text-gold"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => exec('insertOrderedList')}
                title="Numbered List"
                className="p-1 rounded hover:bg-zinc-800 hover:text-gold"
              >
                <ListOrdered className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Alignment */}
            <div className="flex items-center gap-0.5 border-r border-zinc-800 pr-1.5 mr-1">
              <button
                type="button"
                onClick={() => exec('justifyLeft')}
                title="Align Left"
                className="p-1 rounded hover:bg-zinc-800 hover:text-gold"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => exec('justifyCenter')}
                title="Align Center"
                className="p-1 rounded hover:bg-zinc-800 hover:text-gold"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => exec('justifyRight')}
                title="Align Right"
                className="p-1 rounded hover:bg-zinc-800 hover:text-gold"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quote & Horizontal Line */}
            <div className="flex items-center gap-0.5 border-r border-zinc-800 pr-1.5 mr-1">
              <button
                type="button"
                onClick={() => handleFormatBlock('<blockquote>')}
                title="Blockquote"
                className="p-1 rounded hover:bg-zinc-800 hover:text-gold"
              >
                <Quote className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => exec('insertHorizontalRule')}
                title="Horizontal Divider"
                className="p-1 rounded hover:bg-zinc-800 hover:text-gold"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Links */}
            <div className="flex items-center gap-0.5 border-r border-zinc-800 pr-1.5 mr-1">
              <button
                type="button"
                onClick={handleOpenLinkModal}
                title="Insert Link"
                className="p-1 rounded hover:bg-zinc-800 hover:text-gold"
              >
                <Link2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => exec('unlink')}
                title="Remove Link"
                className="p-1 rounded hover:bg-zinc-800 hover:text-gold"
              >
                <Unlink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Clean & History */}
            <div className="flex items-center gap-0.5 ml-auto">
              <button
                type="button"
                onClick={() => exec('undo')}
                title="Undo (Ctrl+Z)"
                className="p-1 rounded hover:bg-zinc-800 hover:text-gold"
              >
                <Undo className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => exec('redo')}
                title="Redo (Ctrl+Y)"
                className="p-1 rounded hover:bg-zinc-800 hover:text-gold"
              >
                <Redo className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleCleanFormatting}
                title="Clear Formatting"
                className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-red-400"
              >
                <Eraser className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: Visual Editable Area - Kept continuously mounted in DOM to prevent text loss */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleVisualInput}
          onBlur={handleVisualInput}
          style={{ minHeight }}
          data-placeholder={placeholder}
          className={`p-4 text-zinc-100 text-xs sm:text-sm font-sans leading-relaxed focus:outline-none overflow-y-auto max-h-[500px] prose prose-invert max-w-none empty:before:content-[attr(data-placeholder)] empty:before:text-zinc-600 empty:before:pointer-events-none ${
            activeTab === 'visual' ? 'block' : 'hidden'
          }`}
        />

        {/* Tab 2: Raw HTML Source Code Mode */}
        <div className={activeTab === 'code' ? 'block' : 'hidden'}>
          <div className="bg-[#06090e] px-3 py-1.5 border-b border-zinc-850 text-[10px] text-zinc-500 font-mono flex justify-between items-center">
            <span>Raw HTML Source Mode</span>
            <span className="text-gold">Live Synced HTML</span>
          </div>
          <textarea
            value={htmlContent}
            onChange={handleCodeChange}
            style={{ minHeight }}
            placeholder="<p>Enter raw HTML tags here...</p>"
            className="w-full bg-[#080c12] text-amber-100 font-mono text-xs p-4 leading-relaxed focus:outline-none resize-y max-h-[500px]"
          />
        </div>

        {/* Tab 3: Live Preview Mode */}
        <div className={activeTab === 'preview' ? 'block' : 'hidden'}>
          <div className="bg-[#06090e] px-3 py-1.5 border-b border-zinc-850 text-[10px] text-zinc-500 flex justify-between items-center">
            <span>Live Storefront Render Preview</span>
            <span className="text-gold">Actual Visual Appearance</span>
          </div>
          <div
            style={{ minHeight }}
            className="p-5 text-zinc-200 text-xs sm:text-sm leading-relaxed overflow-y-auto max-h-[500px] prose prose-invert max-w-none bg-noir/50"
          >
            {htmlContent ? (
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            ) : (
              <div className="text-zinc-600 italic">No content to preview yet.</div>
            )}
          </div>
        </div>
      </div>

      {hint && <p className="text-[10px] text-zinc-500">{hint}</p>}

      {/* Insert Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-noir-card border border-gold/40 p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="font-serif text-xs uppercase tracking-wider text-gold font-semibold flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-gold" /> Insert Royal Link
              </span>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplyLink} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                  Destination URL *
                </label>
                <input
                  type="text"
                  required
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com or /shop"
                  className="w-full bg-noir border border-zinc-800 p-2 text-zinc-100 focus:outline-none focus:border-gold"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
                  Anchor / Display Text (Optional)
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Click here"
                  className="w-full bg-noir border border-zinc-800 p-2 text-zinc-100 focus:outline-none focus:border-gold"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-zinc-300 pt-1">
                <input
                  type="checkbox"
                  checked={openInNewTab}
                  onChange={(e) => setOpenInNewTab(e.target.checked)}
                  className="accent-gold w-3.5 h-3.5"
                />
                <span className="text-[11px]">Open link in new browser tab</span>
              </label>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="px-3 py-1.5 border border-zinc-800 text-zinc-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-gold py-1.5 px-4 text-xs">
                  Apply Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
