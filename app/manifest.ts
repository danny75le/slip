import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Slip — your usual, on a card",
    short_name: "Slip",
    description:
      "Save your favorite customized drinks and food, then show your slip across the counter.",
    start_url: "/",
    display: "standalone",
    background_color: "#f2f0eb",
    theme_color: "#006241",
    orientation: "portrait",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
