import DOMPurify from "isomorphic-dompurify";

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ADD_TAGS: ["iframe", "video"],
    ADD_ATTR: [
      "allow",
      "allowfullscreen",
      "frameborder",
      "controls",
      "src",
      "target",
      "rel",
      "width",
      "height",
    ],
  });
}
