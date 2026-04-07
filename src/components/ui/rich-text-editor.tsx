import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { useState, useRef, useEffect, useCallback } from "react";
import { Bold, Italic, Strikethrough, List, ListOrdered, Smile } from "lucide-react";
import { cn } from "@/lib/utils";

const EMOJI_GROUPS = [
  {
    label: "Smileys",
    emojis: ["😊", "😂", "🥰", "😍", "🤩", "😘", "😜", "😎", "🤗", "🥳", "😏", "😢", "😤", "🤔", "🙄", "😴"],
  },
  {
    label: "Gestures",
    emojis: ["👋", "👍", "👎", "👏", "🙌", "🤝", "💪", "✌️", "🤞", "👀", "💅", "🫶", "❤️", "🔥", "💯", "✨"],
  },
  {
    label: "Fun",
    emojis: ["🎉", "🎊", "🎈", "💃", "🕺", "🌹", "🌸", "💋", "💖", "💕", "💗", "🦋", "⭐", "🌟", "💎", "🎀"],
  },
];

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  minHeight?: string;
  variant?: "full" | "compact";
}

function ToolbarButton({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "p-1.5 rounded-md transition-colors",
        active
          ? "bg-primary/15 text-primary"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function EmojiPicker({ onSelect, onClose }: { onSelect: (emoji: string) => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute bottom-full mb-2 right-0 z-50 bg-popover border border-border rounded-xl shadow-lg p-3 w-72"
    >
      {EMOJI_GROUPS.map((group) => (
        <div key={group.label} className="mb-2 last:mb-0">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            {group.label}
          </p>
          <div className="flex flex-wrap gap-1">
            {group.emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => onSelect(emoji)}
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-accent text-lg transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Toolbar({ editor, variant }: { editor: Editor; variant: "full" | "compact" }) {
  const [showEmoji, setShowEmoji] = useState(false);
  const iconSize = variant === "compact" ? "h-3.5 w-3.5" : "h-4 w-4";

  const insertEmoji = useCallback(
    (emoji: string) => {
      editor.chain().focus().insertContent(emoji).run();
      setShowEmoji(false);
    },
    [editor]
  );

  return (
    <div className="flex items-center gap-0.5 relative">
      <ToolbarButton
        title="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className={iconSize} />
      </ToolbarButton>
      <ToolbarButton
        title="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className={iconSize} />
      </ToolbarButton>
      <ToolbarButton
        title="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className={iconSize} />
      </ToolbarButton>

      {variant === "full" && (
        <>
          <div className="w-px h-4 bg-border mx-1" />
          <ToolbarButton
            title="Bullet List"
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className={iconSize} />
          </ToolbarButton>
          <ToolbarButton
            title="Numbered List"
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className={iconSize} />
          </ToolbarButton>
        </>
      )}

      <div className="w-px h-4 bg-border mx-1" />
      <ToolbarButton title="Emoji" onClick={() => setShowEmoji(!showEmoji)}>
        <Smile className={iconSize} />
      </ToolbarButton>

      {showEmoji && <EmojiPicker onSelect={insertEmoji} onClose={() => setShowEmoji(false)} />}
    </div>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "",
  maxLength,
  className,
  minHeight = "120px",
  variant = "full",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      ...(maxLength ? [CharacterCount.configure({ limit: maxLength })] : []),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm dark:prose-invert max-w-none focus:outline-none px-4 py-3 text-sm text-foreground",
          "[&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0"
        ),
        style: `min-height:${minHeight}`,
      },
    },
  });

  // Sync external value changes into editor
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current && !(value === "" && current === "<p></p>")) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  if (!editor) return null;

  const charCount = editor.storage.characterCount?.characters() ?? 0;

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-shadow",
        className
      )}
    >
      <EditorContent editor={editor} />
      <div className="flex items-center justify-between border-t border-border px-3 py-1.5 bg-muted/30">
        <Toolbar editor={editor} variant={variant} />
        {maxLength && (
          <span
            className={cn(
              "text-xs tabular-nums",
              charCount > maxLength * 0.9 ? "text-red-500" : "text-muted-foreground"
            )}
          >
            {charCount}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}

/** Compact inline variant for chat inputs — single-line feel with formatting */
export function RichTextChat({
  onSend,
  placeholder = "Type a message...",
  disabled,
  className,
}: {
  onSend: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) {
  const [showEmoji, setShowEmoji] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false, blockquote: false, codeBlock: false, horizontalRule: false }),
      Placeholder.configure({ placeholder }),
    ],
    editorProps: {
      attributes: {
        class: "prose prose-sm dark:prose-invert max-w-none focus:outline-none px-3 py-2.5 text-sm text-foreground [&_p]:my-0",
        style: "min-height:20px;max-height:120px;overflow-y:auto",
      },
      handleKeyDown: (_view, event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          handleSend();
          return true;
        }
        return false;
      },
    },
  });

  const handleSend = useCallback(() => {
    if (!editor) return;
    const html = editor.getHTML();
    const text = editor.getText().trim();
    if (!text) return;
    onSend(html);
    editor.commands.clearContent();
  }, [editor, onSend]);

  const insertEmoji = useCallback(
    (emoji: string) => {
      editor?.chain().focus().insertContent(emoji).run();
      setShowEmoji(false);
    },
    [editor]
  );

  if (!editor) return null;

  return (
    <div
      className={cn(
        "flex items-end gap-2 rounded-xl border border-border bg-card overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-shadow",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      <div className="flex-1 relative">
        <EditorContent editor={editor} />
      </div>
      <div className="flex items-center gap-0.5 px-2 pb-2 relative">
        <ToolbarButton
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Emoji" onClick={() => setShowEmoji(!showEmoji)}>
          <Smile className="h-3.5 w-3.5" />
        </ToolbarButton>
        {showEmoji && <EmojiPicker onSelect={insertEmoji} onClose={() => setShowEmoji(false)} />}
      </div>
    </div>
  );
}
