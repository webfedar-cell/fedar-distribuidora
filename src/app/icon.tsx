import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 22,
          background: "linear-gradient(135deg, #0E58AA 0%, #08376B 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFFFFF",
          borderRadius: "7px",
          fontWeight: 900,
          fontFamily: "Arial, sans-serif",
          position: "relative",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.25)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 3,
            right: 3,
            width: 4,
            height: 4,
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
            transform: "translateY(-0.5px)",
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
