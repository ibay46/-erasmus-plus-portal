import sanitize from "sanitize-html";

export function sanitizeHtml(html: string): string {
  return sanitize(html, {
    allowedTags: sanitize.defaults.allowedTags.concat(["img", "iframe", "video", "h1", "h2"]),
    allowedAttributes: {
      ...sanitize.defaults.allowedAttributes,
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "width", "height"],
      iframe: ["src", "allow", "allowfullscreen", "frameborder", "width", "height"],
      video: ["src", "controls", "width", "height"],
    },
    allowedIframeHostnames: ["www.youtube.com", "youtube.com", "player.vimeo.com"],
  });
}
