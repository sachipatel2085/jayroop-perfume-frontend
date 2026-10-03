import React from "react";
import { Link } from "react-router-dom";
import logoImg from "../../assets/jayroop-logo.webp";

export const BrandLogo = ({
  size = "normal",
  showTagline = true,
  isWhite = false,
}) => {
  const isLarge = size === "large";
  const isSmall = size === "small";

  return (
    <Link
      to="/"
      className="group inline-flex flex-col items-center select-none text-center"
    >
      <div className="flex items-center gap-3">
        {/* Actual uploaded logo crest */}
        <div
          className={`relative overflow-hidden rounded-full border border-gold/40 shadow-gold-glow ${
            isSmall ? "w-8 h-8" : isLarge ? "w-16 h-16" : "w-10 h-10"
          }`}
        >
          <img
            src={logoImg}
            alt="Jayrup Royal House"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Brand Typography */}
        <div className="flex flex-col items-start text-left">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-serif tracking-[0.25em] font-bold uppercase transition-colors duration-300 ${
                isLarge ? "text-2xl" : isSmall ? "text-sm" : "text-lg"
              } ${isWhite ? "text-white" : "text-zinc-100 group-hover:text-gold-light"}`}
            >
              JAYRUP
            </span>
            <span className="text-[10px] tracking-widest text-gold font-sans font-semibold border border-gold/40 px-1 py-0.5 rounded">
              JR
            </span>
          </div>
          <span className="text-[9px] uppercase tracking-[0.35em] text-gold/80 font-sans font-medium -mt-0.5">
            Luxury Perfum
          </span>
        </div>
      </div>

      {showTagline && (
        <div className="mt-1 flex items-center gap-2">
          <span className="inline-block bg-gradient-to-r from-gold-amber via-gold to-gold-amber text-black text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider shadow-sm">
            Marwad ka Pahla Luxury Perfume
          </span>
        </div>
      )}
    </Link>
  );
};
