"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { useRef, useState } from "react";
import { VideoExtension } from "@/components/admin/editor/VideoExtension";

const buttonClass =
  "cursor-pointer rounded-md px-2.5 py-1.5 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted";
const activeButtonClass = "bg-muted text-accent";

function ToolbarButton({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`${buttonClass} ${active ? activeButtonClass : ""}`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error ?? "Yükleme başarısız oldu.");
        return;
      }

      if (data.type.startsWith("image/")) {
        editor.chain().focus().setImage({ src: data.url }).run();
      } else if (data.type.startsWith("video/")) {
        editor.chain().focus().setVideo(data.url).run();
      } else if (data.type === "application/pdf") {
        editor
          .chain()
          .focus()
          .insertContent(
            `<p><a href="${data.url}" target="_blank" rel="noopener noreferrer">PDF: ${data.name}</a></p>`
          )
          .run();
      } else if (
        data.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        editor
          .chain()
          .focus()
          .insertContent(
            `<p><a href="${data.url}" target="_blank" rel="noopener noreferrer">Word: ${data.name}</a></p>`
          )
          .run();
      } else if (data.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        editor
          .chain()
          .focus()
          .insertContent(
            `<p><a href="${data.url}" target="_blank" rel="noopener noreferrer">Excel: ${data.name}</a></p>`
          )
          .run();
      }
      // Inserted media leaves a NodeSelection on the atom; collapse it to a
      // text cursor at the end so the next insertion doesn't replace it.
      editor.commands.setTextSelection(editor.state.doc.content.size);
    } catch {
      setUploadError("Yükleme sırasında bir hata oluştu.");
    } finally {
      setUploading(false);
    }
  }

  function addYoutube() {
    const url = window.prompt("YouTube video linkini yapıştırın:");
    if (url) {
      editor.commands.setYoutubeVideo({ src: url });
      editor.commands.setTextSelection(editor.state.doc.content.size);
    }
  }

  function addLink() {
    const url = window.prompt("Bağlantı (URL):");
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  }

  function addTable() {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }

  return (
    <div className="border-b border-border">
      <div className="flex flex-wrap items-center gap-1 p-2">
        <ToolbarButton title="Kalın" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <span className="font-bold">B</span>
        </ToolbarButton>
        <ToolbarButton title="İtalik" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <span className="italic">I</span>
        </ToolbarButton>
        <ToolbarButton title="Başlık 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </ToolbarButton>
        <ToolbarButton title="Başlık 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </ToolbarButton>
        <ToolbarButton title="Madde Listesi" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • Liste
        </ToolbarButton>
        <ToolbarButton title="Numaralı Liste" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1. Liste
        </ToolbarButton>
        <ToolbarButton title="Alıntı" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          Alıntı
        </ToolbarButton>
        <ToolbarButton title="Bağlantı Ekle" active={editor.isActive("link")} onClick={addLink}>
          Bağlantı
        </ToolbarButton>
        <ToolbarButton title="YouTube Video Ekle" onClick={addYoutube}>
          YouTube
        </ToolbarButton>
        <ToolbarButton title="Tablo Ekle (Excel'den kopyala-yapıştır da yapabilirsiniz)" active={editor.isActive("table")} onClick={addTable}>
          Tablo
        </ToolbarButton>
        {editor.isActive("table") && (
          <>
            <ToolbarButton title="Satır Ekle" onClick={() => editor.chain().focus().addRowAfter().run()}>
              +Satır
            </ToolbarButton>
            <ToolbarButton title="Sütun Ekle" onClick={() => editor.chain().focus().addColumnAfter().run()}>
              +Sütun
            </ToolbarButton>
            <ToolbarButton title="Satır Sil" onClick={() => editor.chain().focus().deleteRow().run()}>
              -Satır
            </ToolbarButton>
            <ToolbarButton title="Sütun Sil" onClick={() => editor.chain().focus().deleteColumn().run()}>
              -Sütun
            </ToolbarButton>
            <ToolbarButton title="Tabloyu Sil" onClick={() => editor.chain().focus().deleteTable().run()}>
              Tabloyu Sil
            </ToolbarButton>
          </>
        )}
        <ToolbarButton title="PDF, Word, Excel, Video veya Görsel Yükle" onClick={() => fileInputRef.current?.click()}>
          {uploading ? "Yükleniyor..." : "Dosya Ekle"}
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,video/mp4,video/webm,image/png,image/jpeg,image/webp,image/gif,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          onChange={handleFileChange}
          className="hidden"
        />
        <ToolbarButton title="Geri Al" onClick={() => editor.chain().focus().undo().run()}>
          Geri Al
        </ToolbarButton>
        <ToolbarButton title="Yinele" onClick={() => editor.chain().focus().redo().run()}>
          Yinele
        </ToolbarButton>
      </div>
      {uploadError && <p className="px-2 pb-2 text-sm text-red-600">{uploadError}</p>}
    </div>
  );
}

export function RichTextEditor({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string;
}) {
  const [html, setHtml] = useState(defaultValue ?? "");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
      Youtube.configure({ width: 640, height: 360 }),
      VideoExtension,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: defaultValue ?? "",
    editorProps: {
      attributes: {
        class: "prose-erasmus min-h-[220px] px-3.5 py-3 outline-none text-foreground",
      },
    },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  if (!editor) {
    return (
      <div className="rounded-lg border border-border bg-background min-h-[260px] animate-pulse" />
    );
  }

  return (
    <div className="rounded-lg border border-border bg-background overflow-hidden transition-colors duration-200 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={html} />
    </div>
  );
}
