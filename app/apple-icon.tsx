import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #006241 0%, #1e3932 100%)",
          color: "#f2f0eb",
          fontSize: 100,
          fontWeight: 700,
          letterSpacing: "-0.06em",
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontStyle: "italic",
        }}
      >
        S
        <span style={{ color: "#cba258" }}>.</span>
      </div>
    ),
    size,
  );
}
