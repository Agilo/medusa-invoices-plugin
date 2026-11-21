// External packages
import { Button, clx, DropdownMenu, IconButton, Input } from "@medusajs/ui";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Heading from "@tiptap/extension-heading";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Strike from "@tiptap/extension-strike";
import TextAlign from "@tiptap/extension-text-align";
import { Color, TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { Placeholder } from "@tiptap/extensions";
import { Editor, EditorContent, JSONContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold as BoldIcon,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Italic as ItalicIcon,
  Link as LinkIcon,
  List,
  ListOrdered,
  Paintbrush,
  Redo,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo,
} from "lucide-react";
import * as React from "react";

const getHeadingStyle = (level: number): string => {
  const styles = {
    1: "font-size: 2.25rem; font-weight: 700; line-height: 1.2; margin-bottom: 1rem;",
    2: "font-size: 1.875rem; font-weight: 600; line-height: 1.3; margin-bottom: 0.75rem;",
    3: "font-size: 1.5rem; font-weight: 600; line-height: 1.4; margin-bottom: 0.5rem;",
    4: "font-size: 1.25rem; font-weight: 500; line-height: 1.4; margin-bottom: 0.5rem;",
    5: "font-size: 1.125rem; font-weight: 500; line-height: 1.5; margin-bottom: 0.375rem;",
    6: "font-size: 1rem; font-weight: 500; line-height: 1.5; margin-bottom: 0.25rem;",
  };
  return styles[level as keyof typeof styles] || styles[1];
};

interface TiptapEditorProps {
  initialContent?: JSONContent | null;
  onChange?: (content: JSONContent) => void;
  placeholder?: string;
  className?: string;
  isInvalid?: boolean;
  disabled?: boolean;
}

const EMPTY_TIPTAP_DOCUMENT: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

const normalizeTiptapContent = (content?: JSONContent | null): JSONContent => {
  return content?.type === "doc" ? content : EMPTY_TIPTAP_DOCUMENT;
};

export type TiptapEditorFieldProps = {
  editorProps?: Omit<TiptapEditorProps, "content" | "onChange">;
};

const MenuBar: React.FC<{ editor: Editor }> = ({ editor }) => {
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const [showLinkDialog, setShowLinkDialog] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState("");

  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive("bold") ?? false,
        isItalic: ctx.editor.isActive("italic") ?? false,
        isUnderline: ctx.editor.isActive("underline") ?? false,
        isStrike: ctx.editor.isActive("strike") ?? false,
        isLink: ctx.editor.isActive("link") ?? false,
        isBulletList: ctx.editor.isActive("bulletList") ?? false,
        isOrderedList: ctx.editor.isActive("orderedList") ?? false,
        isLeftAligned: ctx.editor.isActive({ textAlign: "left" }) ?? false,
        isCenterAligned: ctx.editor.isActive({ textAlign: "center" }) ?? false,
        isRightAligned: ctx.editor.isActive({ textAlign: "right" }) ?? false,
        isJustified: ctx.editor.isActive({ textAlign: "justify" }) ?? false,
        isParagraph: ctx.editor.isActive("paragraph") ?? false,
        isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
        isHeading4: ctx.editor.isActive("heading", { level: 4 }) ?? false,
        isHeading5: ctx.editor.isActive("heading", { level: 5 }) ?? false,
        isHeading6: ctx.editor.isActive("heading", { level: 6 }) ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
      };
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl("");
      setShowLinkDialog(false);
    }
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  const setColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
    setShowColorPicker(false);
  };

  return (
    <div className="p-2 flex flex-wrap gap-1">
      {/* Undo */}
      <IconButton
        className="size-7"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editorState.canUndo}
      >
        <Undo size={16} />
      </IconButton>

      {/* Redo */}
      <IconButton
        className="size-7"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editorState.canRedo}
      >
        <Redo size={16} />
      </IconButton>

      <div className="w-px h-8 bg-ui-bg-base-pressed mx-1" />

      {/* Bold */}
      <IconButton
        className={clx(
          "size-7",
          editorState.isBold && "bg-ui-bg-interactive hover:bg-ui-bg-interactive text-ui-bg-base",
        )}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <BoldIcon size={16} />
      </IconButton>

      {/* Italic */}
      <IconButton
        className={clx(
          "size-7",
          editorState.isItalic && "bg-ui-bg-interactive hover:bg-ui-bg-interactive text-ui-bg-base",
        )}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <ItalicIcon size={16} />
      </IconButton>

      {/* Underline */}
      <IconButton
        className={clx(
          "size-7",
          editorState.isUnderline &&
            "bg-ui-bg-interactive hover:bg-ui-bg-interactive text-ui-bg-base",
        )}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon size={16} />
      </IconButton>

      {/* Strike */}
      <IconButton
        className={clx(
          "size-7",
          editorState.isStrike && "bg-ui-bg-interactive hover:bg-ui-bg-interactive text-ui-bg-base",
        )}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough size={16} />
      </IconButton>

      <div className="w-px h-8 bg-ui-bg-base-pressed mx-1" />

      {/* Link */}
      <DropdownMenu open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DropdownMenu.Trigger asChild>
          <IconButton
            className={clx(
              "size-7",
              editorState.isLink &&
                "bg-ui-bg-interactive hover:bg-ui-bg-interactive text-ui-bg-base",
            )}
            onClick={() => {
              if (editorState.isLink) {
                removeLink();
              } else {
                setShowLinkDialog(!showLinkDialog);
              }
            }}
          >
            <LinkIcon size={16} />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <Input
            type="url"
            placeholder="Enter URL..."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addLink();
              } else if (e.key === "Escape") {
                setShowLinkDialog(false);
                setLinkUrl("");
              }
            }}
            autoFocus
            className="mb-4"
          />
          <Button onClick={addLink} className="w-full mb-2">
            Add
          </Button>
          <Button
            onClick={() => {
              removeLink();
              setShowLinkDialog(false);
              setLinkUrl("");
            }}
            className="w-full"
          >
            Remove link
          </Button>
          <DropdownMenu.Separator />
          <Button
            variant="transparent"
            onClick={() => {
              setShowLinkDialog(false);
              setLinkUrl("");
            }}
            className="w-full"
          >
            Cancel
          </Button>
        </DropdownMenu.Content>
      </DropdownMenu>

      {/* Color Picker */}
      <DropdownMenu open={showColorPicker} onOpenChange={setShowColorPicker}>
        <DropdownMenu.Trigger asChild>
          <IconButton
            className="size-7"
            onClick={() => setShowColorPicker(!showColorPicker)}
            style={{
              color: editor.isActive("textStyle")
                ? editor.getAttributes("textStyle").color || undefined
                : undefined,
            }}
          >
            <Paintbrush size={16} />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <div
            className="grid gap-2 mb-4"
            style={{ gridTemplateColumns: "repeat(6, minmax(0, 1fr))" }}
          >
            {[
              "#000000",
              "#374151",
              "#6B7280",
              "#EF4444",
              "#F97316",
              "#EAB308",
              "#22C55E",
              "#10B981",
              "#06B6D4",
              "#3B82F6",
              "#6366F1",
              "#8B5CF6",
              "#EC4899",
              "#F43F5E",
              "#64748B",
              "#78716C",
              "#DC2626",
              "#EA580C",
              "#CA8A04",
              "#16A34A",
              "#059669",
              "#0891B2",
              "#2563EB",
              "#4F46E5",
              "#7C3AED",
              "#C026D3",
              "#BE185D",
              "#E11D48",
            ].map((color) => (
              <button
                key={color}
                onClick={() => setColor(color)}
                className="w-6 h-6 rounded hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          <Button
            onClick={() => {
              editor.chain().focus().unsetColor().run();
              setColor("");
              setShowColorPicker(false);
            }}
            className="w-full"
          >
            Remove Color
          </Button>
        </DropdownMenu.Content>
      </DropdownMenu>

      <div className="w-px h-8 bg-ui-bg-base-pressed mx-1" />

      {/* Bullet List */}
      <IconButton
        className={clx(
          "size-7",
          editorState.isBulletList &&
            "bg-ui-bg-interactive hover:bg-ui-bg-interactive text-ui-bg-base",
        )}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={16} />
      </IconButton>

      {/* Ordered List */}
      <IconButton
        className={clx(
          "size-7",
          editorState.isOrderedList &&
            "bg-ui-bg-interactive hover:bg-ui-bg-interactive text-ui-bg-base",
        )}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={16} />
      </IconButton>

      <div className="w-px h-8 bg-ui-bg-base-pressed mx-1" />

      {/* Text Alignment */}
      <IconButton
        className={clx(
          "size-7",
          editorState.isLeftAligned &&
            "bg-ui-bg-interactive hover:bg-ui-bg-interactive text-ui-bg-base",
        )}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft size={16} />
      </IconButton>

      <IconButton
        className={clx(
          "size-7",
          editorState.isCenterAligned &&
            "bg-ui-bg-interactive hover:bg-ui-bg-interactive text-ui-bg-base",
        )}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter size={16} />
      </IconButton>

      <IconButton
        className={clx(
          "size-7",
          editorState.isRightAligned &&
            "bg-ui-bg-interactive hover:bg-ui-bg-interactive text-ui-bg-base",
        )}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight size={16} />
      </IconButton>

      <IconButton
        className={clx(
          "size-7",
          editorState.isJustified &&
            "bg-ui-bg-interactive hover:bg-ui-bg-interactive text-ui-bg-base",
        )}
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
      >
        <AlignJustify size={16} />
      </IconButton>

      <div className="w-px h-8 bg-ui-bg-base-pressed mx-1" />

      {/* Headings */}
      <IconButton
        className={clx(
          "size-7",
          editorState.isHeading1 &&
            "bg-ui-bg-interactive hover:bg-ui-bg-interactive text-ui-bg-base",
        )}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 size={16} />
      </IconButton>

      <IconButton
        className={clx(
          "size-7",
          editorState.isHeading2 &&
            "bg-ui-bg-interactive hover:bg-ui-bg-interactive text-ui-bg-base",
        )}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 size={16} />
      </IconButton>

      <IconButton
        className={clx(
          "size-7",
          editorState.isHeading3 &&
            "bg-ui-bg-interactive hover:bg-ui-bg-interactive text-ui-bg-base",
        )}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 size={16} />
      </IconButton>

      <IconButton
        className={clx(
          "size-7",
          editorState.isHeading4 &&
            "bg-ui-bg-interactive hover:bg-ui-bg-interactive text-ui-bg-base",
        )}
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
      >
        <Heading4 size={16} />
      </IconButton>

      <IconButton
        className={clx(
          "size-7",
          editorState.isHeading5 &&
            "bg-ui-bg-interactive hover:bg-ui-bg-interactive text-ui-bg-base",
        )}
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
      >
        <Heading5 size={16} />
      </IconButton>

      <IconButton
        className={clx(
          "size-7",
          editorState.isHeading6 &&
            "bg-ui-bg-interactive hover:bg-ui-bg-interactive text-ui-bg-base",
        )}
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
      >
        <Heading6 size={16} />
      </IconButton>
    </div>
  );
};

export const TiptapEditor: React.FC<TiptapEditorProps> = ({
  initialContent,
  onChange,
  className,
  placeholder,
  isInvalid = false,
  disabled = false,
}) => {
  const editorContent = normalizeTiptapContent(initialContent);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
        bold: false,
        italic: false,
        strike: false,
        heading: false,
        underline: false,
        link: false,
      }),
      Bold,
      Italic,
      Underline,
      Strike,
      BulletList.configure({
        HTMLAttributes: {
          style: "list-style-type: disc; padding-left: 1.5rem;",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          style: "list-style-type: decimal; padding-left: 1.5rem;",
        },
      }),
      ListItem,
      Heading.extend({
        renderHTML({ node, HTMLAttributes }) {
          const level = node.attrs.level;
          const baseStyle = getHeadingStyle(level);

          const existingStyle = HTMLAttributes.style || "";
          const combinedStyle = existingStyle ? `${baseStyle} ${existingStyle}` : baseStyle;

          return [`h${level}`, { ...HTMLAttributes, style: combinedStyle }, 0];
        },
      }).configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          style: "text-decoration: underline; cursor: pointer; color: #3b82f6;",
        },
      }),
      TextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: placeholder,
      }),
    ],
    content: editorContent,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
    },
    editorProps: {
      attributes: {
        style: "max-height: 10rem; min-height: 3.75rem;",
        class: clx(
          "overflow-y-auto focus:outline-hidden caret-ui-fg-base bg-ui-bg-field hover:bg-ui-bg-field-hover shadow-borders-base placeholder-ui-fg-muted text-ui-fg-base transition-fg relative w-full appearance-none rounded-md outline-hidden focus-visible:shadow-borders-interactive-with-active disabled:text-ui-fg-disabled disabled:!bg-ui-bg-disabled disabled:placeholder-ui-fg-disabled disabled:cursor-not-allowed aria-[invalid=true]:!shadow-borders-error invalid:!shadow-borders-error [&::--webkit-search-cancel-button]:hidden [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden px-2 py-1.5",
        ),
      },
    },
  });

  const editorClasses = clx(
    "rounded-md shadow-borders-base",
    isInvalid && "border-red-600",
    className,
  );

  React.useEffect(() => {
    if (editor && !editor.isDestroyed) {
      const currentContent = editor.getJSON();
      if (JSON.stringify(currentContent) !== JSON.stringify(editorContent)) {
        editor.commands.setContent(editorContent);
      }
    }
  }, [editor, editorContent]);

  return (
    <div className={editorClasses}>
      {!disabled && <MenuBar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
