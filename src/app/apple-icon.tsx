import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 120,
          background: "linear-gradient(135deg, #0E58AA 0%, #08376B 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFFFFF",
          borderRadius: "40px",
          fontWeight: 900,
          fontFamily: "Arial, sans-serif",
          position: "relative",
          boxShadow: "inset 0 0 0 4px rgba(255,255,255,0.25)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            width: 20,
            height: 20,
            borderRadius: "50%",
            backgroundColor: "#E0A93B",
          }}
        />
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
            fontWeight: 900,
            transform: "translateY(-4px)",
          }}
        >
          F
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
