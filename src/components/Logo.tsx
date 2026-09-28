import React from "react";

interface LogoProps {
  variant?: "blue" | "white";
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = "blue", className = "" }) => {
  const isWhite = variant === "white";
  const mainColor = isWhite ? "#FFFFFF" : "#0B4A90";
  const subColor = isWhite ? "#E0A93B" : "#0B4A90";

  return (
    <div className={`flex flex-col select-none leading-none tracking-tight ${className}`}>
      {/* FEDAR (Heavy Bold Condensed Typography) */}
      <span
        className="font-heading font-black text-[36px] sm:text-[44px] leading-[0.85] tracking-tight uppercase"
        style={{ color: mainColor }}
      >
        FEDAR
      </span>
      {/* DISTRIBUIDORA */}
      <span
        className="font-sans font-extrabold text-[8.5px] sm:text-[10px] tracking-[0.27em] uppercase leading-none mt-1"
        style={{ color: subColor }}
      >
        DISTRIBUIDORA
      </span>
    </div>
  );
};
