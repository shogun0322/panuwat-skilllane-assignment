import { useEffect } from "react";
import {
  useEditor,
  EditorContent,
  Editor as TiptapEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";

// MUI
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import { Box, Tooltip, IconButton, Typography } from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";

import TitleIcon from "@mui/icons-material/Title";

interface MenuBarProps {
  editor: TiptapEditor | null;
}

function MenuBar({ editor }: MenuBarProps) {
  if (!editor) return null;

  return (
    <Box
      sx={{
        mb: 1,
        gap: 1,
        display: "flex",
        flexWrap: "wrap",
        borderBottom: "1px solid #eee",
      }}
    >
      <Tooltip title="Bold">
        <IconButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          color={editor.isActive("bold") ? "primary" : "default"}
        >
          <FormatBoldIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Italic">
        <IconButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          color={editor.isActive("italic") ? "primary" : "default"}
        >
          <FormatItalicIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Heading 1">
        <IconButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          color={
            editor.isActive("heading", { level: 1 }) ? "primary" : "default"
          }
        >
          <TitleIcon fontSize="small" />
          <Typography variant="caption">1</Typography>
        </IconButton>
      </Tooltip>
      <Tooltip title="Heading 2">
        <IconButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          color={
            editor.isActive("heading", { level: 2 }) ? "primary" : "default"
          }
        >
          <TitleIcon fontSize="small" />
          <Typography variant="caption">2</Typography>
        </IconButton>
      </Tooltip>
      <Tooltip title="Bullet List">
        <IconButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          color={editor.isActive("bulletList") ? "primary" : "default"}
        >
          <FormatListBulletedIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Number List">
        <IconButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          color={editor.isActive("orderedList") ? "primary" : "default"}
        >
          <FormatListNumberedIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

function cleanHtml(html: string) {
  if (!html) return "";
  const cleaned = html
    .replace(/<p><br><\/p>/gi, "")
    .replace(/<p>\s*<\/p>/gi, "")
    .trim();
  return cleaned === "" ? "" : html;
}

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  error: boolean;
  helperText?: string;
  placeholder?: string;
}

function RichTextEditor({
  value,
  onChange,
  placeholder,
  error,
  helperText,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Heading.configure({ levels: [1, 2, 3] }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      const html = editor.getHTML();
      onChange(cleanHtml(html));
    },
    editorProps: {
      attributes: {
        class: "rich-text-editor",
      },
    },
  });

  useEffect(() => {
    if (editor) editor.commands.setContent(value || "");
  }, [value, editor]);

  return (
    <>
      <Box
        sx={{
          border: 1,
          borderColor: error ? "red" : "rgba(0, 0, 0, 0.23)",
          borderRadius: 1,
          "&:hover": {
            borderColor: error ? "red" : "primary.main",
          },

          "& .ProseMirror": {
            outline: "none",
            minHeight: "80px",
            "& p.is-editor-empty:first-of-type::before": {
              content: `"${placeholder || ""}"`,
              float: "left",
              pointerEvents: "none",
              height: 0,
            },
          },
        }}
      >
        <MenuBar editor={editor} />
        <Box p={2}>
          <EditorContent editor={editor} />
        </Box>
      </Box>
      {error && (
        <Typography color="error" variant="caption" px={"14px"}>
          {helperText}
        </Typography>
      )}
    </>
  );
}

export default RichTextEditor;
