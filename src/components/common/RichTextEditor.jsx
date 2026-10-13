import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { Node, mergeAttributes } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { TableKit } from '@tiptap/extension-table';
import { TextStyle, Color } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Youtube from '@tiptap/extension-youtube';
import { TaskList, TaskItem } from '@tiptap/extension-list';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { Placeholder, CharacterCount } from '@tiptap/extensions';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  Heading4,
  Pilcrow,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link2,
  Unlink,
  Undo2,
  Redo2,
  Eraser,
  Code,
  Code2,
  Image as ImageIcon,
  Video as YoutubeIcon,
  Table as TableIcon,
  Highlighter,
  Palette,
  Maximize2,
  Minimize2,
  FileCode2,
  Eye,
  PenLine,
  Info,
  Lightbulb,
  AlertTriangle,
  Subscript as SubIcon,
  Superscript as SupIcon,
  Rows3,
  Columns3,
  Trash2,
  X,
  Loader2,
} from 'lucide-react';
import { adminService } from '../../services/adminService.js';
import { sanitizeHtml } from '../../utils/sanitizeHtml.js';

// ───────────── Custom "Callout" block (Tip / Info / Warning boxes, like Notion) ─────────────
const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',
  defining: true,
  addAttributes() {
    return { variant: { default: 'tip', parseHTML: (el) => el.getAttribute('data-callout') || 'tip' } };
  },
  parseHTML() {
    return [{ tag: 'div[data-callout]' }];
  },
  renderHTML({ node, HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-callout': node.attrs.variant, class: `callout callout-${node.attrs.variant}` }), 0];
  },
  addCommands() {
    return {
      toggleCallout:
        (variant = 'tip') =>
        ({ commands, editor }) =>
          editor.isActive('callout') ? commands.lift('callout') : commands.wrapIn('callout', { variant }),
    };
  },
});

const COLORS = ['#D4AF37', '#F5D77F', '#EF4444', '#F97316', '#22C55E', '#0EA5E9', '#A855F7', '#E4E4E7', '#71717A'];
const HIGHLIGHTS = ['#FDE68A', '#BBF7D0', '#BAE6FD', '#FBCFE8', '#FED7AA'];

const SLASH_ITEMS = [
  { key: 'h2', label: 'Heading 2', hint: 'Section title', icon: Heading2, run: (e) => e.chain().focus().setHeading({ level: 2 }).run() },
  { key: 'h3', label: 'Heading 3', hint: 'Sub-section', icon: Heading3, run: (e) => e.chain().focus().setHeading({ level: 3 }).run() },
  { key: 'p', label: 'Paragraph', hint: 'Plain text', icon: Pilcrow, run: (e) => e.chain().focus().setParagraph().run() },
  { key: 'bullet', label: 'Bullet list', hint: '• Benefits, features', icon: List, run: (e) => e.chain().focus().toggleBulletList().run() },
  { key: 'number', label: 'Numbered list', hint: '1. Step by step', icon: ListOrdered, run: (e) => e.chain().focus().toggleOrderedList().run() },
  { key: 'todo', label: 'Checklist', hint: '☑ How to use', icon: ListChecks, run: (e) => e.chain().focus().toggleTaskList().run() },
  { key: 'quote', label: 'Quote', hint: 'Testimonial / highlight', icon: Quote, run: (e) => e.chain().focus().toggleBlockquote().run() },
  { key: 'tip', label: 'Tip box', hint: 'Green callout', icon: Lightbulb, run: (e) => e.chain().focus().toggleCallout('tip').run() },
  { key: 'info', label: 'Info box', hint: 'Blue callout', icon: Info, run: (e) => e.chain().focus().toggleCallout('info').run() },
  { key: 'warning', label: 'Warning box', hint: 'Precautions', icon: AlertTriangle, run: (e) => e.chain().focus().toggleCallout('warning').run() },
  { key: 'table', label: 'Table', hint: '3 × 3 grid', icon: TableIcon, run: (e) => e.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
  { key: 'divider', label: 'Divider', hint: 'Horizontal line', icon: Minus, run: (e) => e.chain().focus().setHorizontalRule().run() },
  { key: 'code', label: 'Code block', hint: 'Monospace', icon: Code2, run: (e) => e.chain().focus().toggleCodeBlock().run() },
  { key: 'image', label: 'Image', hint: 'Upload or URL', icon: ImageIcon, run: (e, api) => api.openImage() },
  { key: 'youtube', label: 'YouTube video', hint: 'Embed a video', icon: YoutubeIcon, run: (e, api) => api.openVideo() },
];

const Btn = ({ onClick, active, disabled, title, children }) => (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    disabled={disabled}
    title={title}
    aria-label={title}
    aria-pressed={active || undefined}
    className={`p-1.5 rounded-md transition-colors flex-shrink-0 ${
      active ? 'bg-gold text-black' : 'text-zinc-400 hover:text-gold hover:bg-white/5'
    } disabled:opacity-30 disabled:cursor-not-allowed`}
  >
    {children}
  </button>
);

const Sep = () => <span className="w-px h-5 bg-zinc-800 mx-1 flex-shrink-0" aria-hidden="true" />;

export const RichTextEditor = ({
  value = '',
  onChange,
  label = 'Detailed Content',
  placeholder = 'Start writing… type “/” for headings, lists, tables, images, videos and more',
  minHeight = '320px',
  hint = 'Type “/” for blocks · Select text for quick formatting · Drag & drop or paste images',
  required = false,
  uploadFolder = 'editor',
}) => {
  const [mode, setMode] = useState('write'); // write | html | preview
  const [html, setHtml] = useState(value || '');
  const [fullscreen, setFullscreen] = useState(false);
  const [modal, setModal] = useState(null); // { type: 'link' | 'image' | 'video', ... }
  const [uploading, setUploading] = useState(false);
  const [slash, setSlash] = useState(null); // { query, from, to, top, left, index }
  const slashRef = useRef(null);
  const fileRef = useRef(null);
  const lastEmitted = useRef(value || '');
  // Always call the latest onChange (avoids stale parent state inside TipTap callbacks)
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const emit = (v) => onChangeRef.current?.(v);
  const detectSlashRef = useRef(null);

  const uploadImage = useCallback(
    async (file) => {
      if (!file || !file.type.startsWith('image/')) return null;
      if (file.size > 10 * 1024 * 1024) {
        alert('Image must be smaller than 10 MB');
        return null;
      }
      setUploading(true);
      try {
        const res = await adminService.uploadMedia(file, uploadFolder);
        return res?.url || res?.data?.url || null;
      } catch (err) {
        alert(`Upload failed: ${err.message}`);
        return null;
      } finally {
        setUploading(false);
      }
    },
    [uploadFolder]
  );

  // ── Editor options MUST stay referentially stable ──
  // TipTap compares its options on every render and re-applies them when anything changed. New
  // extension objects / editorProps / content on each render made it reconfigure itself on every
  // keystroke, which fed back into React ("Maximum update depth exceeded"). Everything below is
  // created once; event handlers are read through a ref so they always use the latest state.
  const initialContent = useRef(value || '').current;
  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer' } },
      }),
      Image.configure({ HTMLAttributes: { loading: 'lazy', decoding: 'async' } }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TableKit.configure({ table: { resizable: false, HTMLAttributes: { class: 'rc-table' } } }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Youtube.configure({ nocookie: true, width: 640, height: 360, HTMLAttributes: { class: 'rc-video' } }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Subscript,
      Superscript,
      Callout,
      Placeholder.configure({ placeholder }),
      CharacterCount,
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleKeyDown = (view, event) => {
    const s = slashRef.current;
    if (!s) return false;
    const items = filterSlash(s.query);
    if (event.key === 'ArrowDown') {
      setSlash((p) => p && { ...p, index: (p.index + 1) % Math.max(items.length, 1) });
      return true;
    }
    if (event.key === 'ArrowUp') {
      setSlash((p) => p && { ...p, index: (p.index - 1 + items.length) % Math.max(items.length, 1) });
      return true;
    }
    if (event.key === 'Enter') {
      if (items[s.index]) {
        runSlash(items[s.index]);
        return true;
      }
    }
    if (event.key === 'Escape') {
      setSlash(null);
      return true;
    }
    return false;
  };

  const handleDrop = (view, event, slice, moved) => {
    if (moved || !event.dataTransfer?.files?.length) return false;
    const file = event.dataTransfer.files[0];
    if (!file.type.startsWith('image/')) return false;
    event.preventDefault();
    const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
    uploadImage(file).then((url) => {
      if (url && editorRef.current) editorRef.current.chain().focus().insertContentAt(pos ?? editorRef.current.state.selection.from, { type: 'image', attrs: { src: url, alt: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ') } }).run();
    });
    return true;
  };

  const handlePaste = (view, event) => {
    const file = [...(event.clipboardData?.files || [])].find((f) => f.type.startsWith('image/'));
    if (!file) return false;
    event.preventDefault();
    uploadImage(file).then((url) => {
      if (url && editorRef.current) editorRef.current.chain().focus().setImage({ src: url, alt: '' }).run();
    });
    return true;
  };

  const handlersRef = useRef({});
  handlersRef.current = { handleKeyDown, handleDrop, handlePaste };

  const editorProps = useMemo(
    () => ({
      attributes: { class: 'rich-content rich-editor focus:outline-none', spellcheck: 'true' },
      handleKeyDown: (...args) => handlersRef.current.handleKeyDown(...args),
      handleDrop: (...args) => handlersRef.current.handleDrop(...args),
      handlePaste: (...args) => handlersRef.current.handlePaste(...args),
    }),
    []
  );

  // BubbleMenu re-sends its options (one editor transaction) whenever `shouldShow` changes identity.
  // An inline arrow function is new on every render → transaction → re-render → loop. Keep it stable.
  const bubbleShouldShow = useCallback(
    ({ editor: ed, state }) => !state.selection.empty && !ed.isActive('image') && !ed.isActive('codeBlock'),
    []
  );

  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    immediatelyRender: true,
    extensions,
    content: initialContent,
    editorProps,
    onUpdate: ({ editor: ed }) => {
      const out = ed.isEmpty ? '' : ed.getHTML();
      lastEmitted.current = out;
      setHtml(out);
      emit(out);
      detectSlashRef.current?.(ed);
    },
    onSelectionUpdate: ({ editor: ed }) => detectSlashRef.current?.(ed),
  });

  const editorRef = useRef(null);
  editorRef.current = editor;

  // ── slash menu helpers ──
  const filterSlash = (q) => {
    const query = (q || '').toLowerCase();
    return SLASH_ITEMS.filter((i) => !query || i.label.toLowerCase().includes(query) || i.key.includes(query));
  };

  function detectSlash(ed) {
    const { $from, empty } = ed.state.selection;
    if (!empty || !$from.parent.isTextblock) {
      slashRef.current = null;
      setSlash(null);
      return;
    }
    const textBefore = $from.parent.textBetween(0, $from.parentOffset, undefined, '￼');
    const m = /(?:^|\s)\/([a-z0-9 ]{0,20})$/i.exec(textBefore);
    if (!m) {
      slashRef.current = null;
      setSlash(null);
      return;
    }
    const from = $from.pos - m[1].length - 1;
    const coords = ed.view.coordsAtPos($from.pos);
    const box = ed.view.dom.closest('[data-editor-shell]')?.getBoundingClientRect();
    const next = {
      query: m[1],
      from,
      to: $from.pos,
      top: coords.bottom - (box?.top || 0) + 6,
      left: Math.max(8, coords.left - (box?.left || 0)),
      index: slashRef.current?.query === m[1] ? slashRef.current.index : 0,
    };
    slashRef.current = next;
    setSlash(next);
  }

  detectSlashRef.current = detectSlash;

  const api = useMemo(
    () => ({
      openImage: () => setModal({ type: 'image', url: '', alt: '' }),
      openVideo: () => setModal({ type: 'video', url: '' }),
    }),
    []
  );

  function runSlash(item) {
    const ed = editorRef.current;
    const s = slashRef.current;
    if (!ed || !s) return;
    ed.chain().focus().deleteRange({ from: s.from, to: s.to }).run();
    slashRef.current = null;
    setSlash(null);
    item.run(ed, api);
  }

  // Sync external value changes (e.g. opening another product in the modal)
  useEffect(() => {
    if (!editor) return;
    const incoming = value || '';
    if (incoming !== lastEmitted.current) {
      editor.commands.setContent(incoming, { emitUpdate: false });
      lastEmitted.current = incoming;
      setHtml(incoming);
    }
  }, [value, editor]);

  useEffect(() => {
    if (!fullscreen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setFullscreen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [fullscreen]);

  if (!editor) return null;

  const switchMode = (next) => {
    if (mode === 'html' && next !== 'html') {
      const clean = sanitizeHtml(html);
      editor.commands.setContent(clean, { emitUpdate: false });
      lastEmitted.current = clean;
      emit(clean);
    }
    setMode(next);
  };

  const blockValue = editor.isActive('heading', { level: 2 })
    ? 'h2'
    : editor.isActive('heading', { level: 3 })
      ? 'h3'
      : editor.isActive('heading', { level: 4 })
        ? 'h4'
        : 'p';

  const words = editor.storage.characterCount?.words?.() || 0;
  const chars = editor.storage.characterCount?.characters?.() || 0;
  const inTable = editor.isActive('table');
  const slashItems = slash ? filterSlash(slash.query) : [];

  const applyLink = (e) => {
    e.preventDefault();
    const url = modal.url.trim();
    if (!url) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      const href = /^(https?:|mailto:|tel:|\/)/i.test(url) ? url : `https://${url}`;
      const attrs = { href, target: modal.newTab ? '_blank' : null, rel: modal.newTab ? 'noopener noreferrer' : null };
      if (editor.state.selection.empty && modal.text) {
        editor.chain().focus().insertContent({ type: 'text', text: modal.text, marks: [{ type: 'link', attrs }] }).run();
      } else {
        editor.chain().focus().extendMarkRange('link').setLink(attrs).run();
      }
    }
    setModal(null);
  };

  const applyImage = (e) => {
    e.preventDefault();
    if (modal.url) editor.chain().focus().setImage({ src: modal.url.trim(), alt: modal.alt?.trim() || '', title: modal.alt?.trim() || undefined }).run();
    setModal(null);
  };

  const applyVideo = (e) => {
    e.preventDefault();
    if (modal.url) editor.chain().focus().setYoutubeVideo({ src: modal.url.trim() }).run();
    setModal(null);
  };

  return (
    <div className={fullscreen ? 'fixed inset-0 z-[80] bg-noir p-4 sm:p-8 overflow-y-auto' : ''}>
      <div className={fullscreen ? 'max-w-4xl mx-auto' : ''}>
        {label && (
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
              {label}
              {required && <span className="text-gold ml-0.5">*</span>}
            </span>
            <div className="flex items-center gap-1 text-[11px]">
              {[
                ['write', 'Write', PenLine],
                ['preview', 'Preview', Eye],
                ['html', 'HTML', FileCode2],
              ].map(([k, l, Icon]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => switchMode(k)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md ${mode === k ? 'bg-gold/15 text-gold' : 'text-zinc-500 hover:text-zinc-200'}`}
                >
                  <Icon className="w-3.5 h-3.5" /> {l}
                </button>
              ))}
              <button type="button" onClick={() => setFullscreen((f) => !f)} className="ml-1 p-1 rounded-md text-zinc-500 hover:text-gold" title={fullscreen ? 'Exit full screen (Esc)' : 'Full screen'}>
                {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        <div data-editor-shell className="relative border border-zinc-800 rounded-xl bg-noir focus-within:border-gold/60 transition-colors">
          {mode === 'write' && (
            <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-zinc-800 bg-noir-card/95 backdrop-blur rounded-t-xl">
              <Btn title="Undo (Ctrl+Z)" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}><Undo2 className="w-4 h-4" /></Btn>
              <Btn title="Redo (Ctrl+Shift+Z)" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}><Redo2 className="w-4 h-4" /></Btn>
              <Sep />
              <select
                value={blockValue}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === 'p') editor.chain().focus().setParagraph().run();
                  else editor.chain().focus().setHeading({ level: Number(v.slice(1)) }).run();
                }}
                className="bg-noir border border-zinc-800 rounded-md text-xs text-zinc-300 px-2 py-1 focus:outline-none focus:border-gold"
                aria-label="Text style"
              >
                <option value="p">Paragraph</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
                <option value="h4">Heading 4</option>
              </select>
              <Sep />
              <Btn title="Bold (Ctrl+B)" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="w-4 h-4" /></Btn>
              <Btn title="Italic (Ctrl+I)" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="w-4 h-4" /></Btn>
              <Btn title="Underline (Ctrl+U)" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon className="w-4 h-4" /></Btn>
              <Btn title="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough className="w-4 h-4" /></Btn>
              <Btn title="Inline code" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}><Code className="w-4 h-4" /></Btn>
              <Btn title="Subscript" active={editor.isActive('subscript')} onClick={() => editor.chain().focus().toggleSubscript().run()}><SubIcon className="w-4 h-4" /></Btn>
              <Btn title="Superscript" active={editor.isActive('superscript')} onClick={() => editor.chain().focus().toggleSuperscript().run()}><SupIcon className="w-4 h-4" /></Btn>

              <div className="relative group">
                <Btn title="Text colour"><Palette className="w-4 h-4" /></Btn>
                <div className="absolute left-0 top-full mt-1 hidden group-hover:flex group-focus-within:flex gap-1 p-2 bg-noir-card border border-zinc-800 rounded-lg shadow-xl z-20">
                  {COLORS.map((c) => (
                    <button key={c} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().setColor(c).run()} className="w-5 h-5 rounded-full border border-white/10" style={{ background: c }} aria-label={`Colour ${c}`} />
                  ))}
                  <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().unsetColor().run()} className="w-5 h-5 rounded-full border border-zinc-600 text-[9px] text-zinc-400" aria-label="Remove colour">✕</button>
                </div>
              </div>
              <div className="relative group">
                <Btn title="Highlight" active={editor.isActive('highlight')}><Highlighter className="w-4 h-4" /></Btn>
                <div className="absolute left-0 top-full mt-1 hidden group-hover:flex group-focus-within:flex gap-1 p-2 bg-noir-card border border-zinc-800 rounded-lg shadow-xl z-20">
                  {HIGHLIGHTS.map((c) => (
                    <button key={c} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleHighlight({ color: c }).run()} className="w-5 h-5 rounded border border-white/10" style={{ background: c }} aria-label={`Highlight ${c}`} />
                  ))}
                  <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().unsetHighlight().run()} className="w-5 h-5 rounded border border-zinc-600 text-[9px] text-zinc-400" aria-label="Remove highlight">✕</button>
                </div>
              </div>
              <Sep />
              <Btn title="Align left" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}><AlignLeft className="w-4 h-4" /></Btn>
              <Btn title="Align centre" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}><AlignCenter className="w-4 h-4" /></Btn>
              <Btn title="Align right" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}><AlignRight className="w-4 h-4" /></Btn>
              <Btn title="Justify" active={editor.isActive({ textAlign: 'justify' })} onClick={() => editor.chain().focus().setTextAlign('justify').run()}><AlignJustify className="w-4 h-4" /></Btn>
              <Sep />
              <Btn title="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="w-4 h-4" /></Btn>
              <Btn title="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="w-4 h-4" /></Btn>
              <Btn title="Checklist" active={editor.isActive('taskList')} onClick={() => editor.chain().focus().toggleTaskList().run()}><ListChecks className="w-4 h-4" /></Btn>
              <Btn title="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="w-4 h-4" /></Btn>
              <Btn title="Tip box" active={editor.isActive('callout')} onClick={() => editor.chain().focus().toggleCallout('tip').run()}><Lightbulb className="w-4 h-4" /></Btn>
              <Btn title="Code block" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code2 className="w-4 h-4" /></Btn>
              <Btn title="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus className="w-4 h-4" /></Btn>
              <Sep />
              <Btn
                title="Link (Ctrl+K)"
                active={editor.isActive('link')}
                onClick={() =>
                  setModal({
                    type: 'link',
                    url: editor.getAttributes('link').href || '',
                    newTab: editor.getAttributes('link').target === '_blank',
                    text: '',
                    needsText: editor.state.selection.empty && !editor.isActive('link'),
                  })
                }
              >
                <Link2 className="w-4 h-4" />
              </Btn>
              <Btn title="Remove link" disabled={!editor.isActive('link')} onClick={() => editor.chain().focus().extendMarkRange('link').unsetLink().run()}><Unlink className="w-4 h-4" /></Btn>
              <Btn title="Image" onClick={api.openImage}>{uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}</Btn>
              <Btn title="YouTube video" onClick={api.openVideo}><YoutubeIcon className="w-4 h-4" /></Btn>
              <Btn title="Insert table" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><TableIcon className="w-4 h-4" /></Btn>
              <Sep />
              <Btn title="Clear formatting" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}><Eraser className="w-4 h-4" /></Btn>

              {inTable && (
                <div className="w-full flex flex-wrap items-center gap-1 pt-1.5 mt-1 border-t border-zinc-800 text-[11px] text-zinc-400">
                  <span className="mr-1 uppercase tracking-wider">Table:</span>
                  <Btn title="Add row below" onClick={() => editor.chain().focus().addRowAfter().run()}><Rows3 className="w-4 h-4" /></Btn>
                  <Btn title="Add column right" onClick={() => editor.chain().focus().addColumnAfter().run()}><Columns3 className="w-4 h-4" /></Btn>
                  <button type="button" className="px-2 py-1 rounded hover:text-gold" onClick={() => editor.chain().focus().deleteRow().run()}>− row</button>
                  <button type="button" className="px-2 py-1 rounded hover:text-gold" onClick={() => editor.chain().focus().deleteColumn().run()}>− column</button>
                  <button type="button" className="px-2 py-1 rounded hover:text-gold" onClick={() => editor.chain().focus().toggleHeaderRow().run()}>header row</button>
                  <button type="button" className="px-2 py-1 rounded hover:text-gold" onClick={() => editor.chain().focus().mergeOrSplit().run()}>merge/split</button>
                  <Btn title="Delete table" onClick={() => editor.chain().focus().deleteTable().run()}><Trash2 className="w-4 h-4" /></Btn>
                </div>
              )}
            </div>
          )}

          {mode === 'write' && (
            <BubbleMenu editor={editor} shouldShow={bubbleShouldShow}>
              <div className="flex items-center gap-0.5 p-1 bg-noir-card border border-gold/30 rounded-lg shadow-2xl">
                <Btn title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="w-4 h-4" /></Btn>
                <Btn title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="w-4 h-4" /></Btn>
                <Btn title="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon className="w-4 h-4" /></Btn>
                <Btn title="Highlight" active={editor.isActive('highlight')} onClick={() => editor.chain().focus().toggleHighlight({ color: HIGHLIGHTS[0] }).run()}><Highlighter className="w-4 h-4" /></Btn>
                <Btn title="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="w-4 h-4" /></Btn>
                <Btn title="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="w-4 h-4" /></Btn>
                <Btn title="Heading 4" active={editor.isActive('heading', { level: 4 })} onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}><Heading4 className="w-4 h-4" /></Btn>
                <Btn
                  title="Link"
                  active={editor.isActive('link')}
                  onClick={() => setModal({ type: 'link', url: editor.getAttributes('link').href || '', newTab: editor.getAttributes('link').target === '_blank' })}
                >
                  <Link2 className="w-4 h-4" />
                </Btn>
              </div>
            </BubbleMenu>
          )}

          {mode === 'write' && (
            <div className="px-5 py-4 overflow-y-auto" style={{ minHeight, maxHeight: fullscreen ? 'none' : '70vh' }} onClick={() => editor.chain().focus().run()}>
              <EditorContent editor={editor} />
            </div>
          )}

          {mode === 'preview' && (
            <div className="px-5 py-4 rich-content" style={{ minHeight }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) || '<p style="opacity:.5">Nothing to preview yet.</p>' }} />
          )}

          {mode === 'html' && (
            <textarea
              value={html}
              onChange={(e) => {
                setHtml(e.target.value);
                lastEmitted.current = e.target.value;
                emit(e.target.value);
              }}
              spellCheck={false}
              className="w-full bg-transparent px-5 py-4 font-mono text-xs text-emerald-200/90 leading-relaxed focus:outline-none rounded-xl"
              style={{ minHeight }}
              aria-label="HTML source"
            />
          )}

          {slash && mode === 'write' && slashItems.length > 0 && (
            <div className="absolute z-30 w-64 max-h-72 overflow-y-auto bg-noir-card border border-gold/30 rounded-xl shadow-2xl p-1" style={{ top: slash.top, left: Math.min(slash.left, 9999) }} role="listbox">
              <p className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-widest text-zinc-500">Insert block</p>
              {slashItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    type="button"
                    role="option"
                    aria-selected={i === slash.index}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      runSlash(item);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${i === slash.index ? 'bg-gold/15' : 'hover:bg-white/5'}`}
                  >
                    <span className="w-8 h-8 rounded-md bg-noir border border-zinc-800 flex items-center justify-center text-gold"><Icon className="w-4 h-4" /></span>
                    <span>
                      <span className="block text-sm text-zinc-100">{item.label}</span>
                      <span className="block text-[11px] text-zinc-500">{item.hint}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 border-t border-zinc-800 text-[10px] text-zinc-500">
            <span>{hint}</span>
            <span>
              {words} words · {chars} characters · ~{Math.max(1, Math.round(words / 200))} min read
            </span>
          </div>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          const url = await uploadImage(file);
          if (url) setModal((m) => ({ ...(m || { type: 'image' }), type: 'image', url, alt: m?.alt || file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ') }));
        }}
      />

      {modal && (
        <div className="fixed inset-0 z-[90] bg-black/70 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <form
            onSubmit={modal.type === 'link' ? applyLink : modal.type === 'image' ? applyImage : applyVideo}
            className="w-full max-w-md bg-noir-card border border-gold/30 rounded-2xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-serif text-sm uppercase tracking-[0.2em] text-gold">
                {modal.type === 'link' ? 'Insert link' : modal.type === 'image' ? 'Insert image' : 'Embed YouTube video'}
              </h4>
              <button type="button" onClick={() => setModal(null)} aria-label="Close"><X className="w-4 h-4 text-zinc-400" /></button>
            </div>

            {modal.type === 'link' && (
              <>
                {modal.needsText && (
                  <input autoFocus value={modal.text} onChange={(e) => setModal({ ...modal, text: e.target.value })} placeholder="Link text" className="w-full bg-noir border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold" />
                )}
                <input autoFocus={!modal.needsText} value={modal.url} onChange={(e) => setModal({ ...modal, url: e.target.value })} placeholder="https://… or /products/slug" className="w-full bg-noir border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold" />
                <label className="flex items-center gap-2 text-xs text-zinc-400">
                  <input type="checkbox" className="accent-[#D4AF37]" checked={Boolean(modal.newTab)} onChange={(e) => setModal({ ...modal, newTab: e.target.checked })} />
                  Open in new tab
                </label>
                <p className="text-[11px] text-zinc-500">Tip: link to your own products & articles (e.g. /products/your-product-slug) for better SEO.</p>
              </>
            )}

            {modal.type === 'image' && (
              <>
                <button type="button" onClick={() => fileRef.current?.click()} className="w-full border border-dashed border-gold/40 rounded-xl py-6 text-sm text-gold hover:bg-gold/5 flex items-center justify-center gap-2">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                  {uploading ? 'Uploading…' : 'Upload from computer'}
                </button>
                <input value={modal.url} onChange={(e) => setModal({ ...modal, url: e.target.value })} placeholder="…or paste image URL" className="w-full bg-noir border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold" />
                {modal.url && <img src={modal.url} alt="" className="max-h-40 mx-auto rounded-lg border border-zinc-800" />}
                <input value={modal.alt} onChange={(e) => setModal({ ...modal, alt: e.target.value })} placeholder="Alt text (describe the image for SEO & accessibility)" className="w-full bg-noir border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold" />
              </>
            )}

            {modal.type === 'video' && (
              <input autoFocus value={modal.url} onChange={(e) => setModal({ ...modal, url: e.target.value })} placeholder="https://www.youtube.com/watch?v=…" className="w-full bg-noir border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold" />
            )}

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setModal(null)} className="px-4 py-2 rounded-lg border border-zinc-700 text-xs text-zinc-300">Cancel</button>
              <button type="submit" className="btn-gold rounded-lg !py-2">Insert</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
