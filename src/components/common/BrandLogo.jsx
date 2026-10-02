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
      className="group inline-flex flex-col items-center select-none text-center max-w-full"
    >
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Actual uploaded logo crest */}
        <div
          className={`relative overflow-hidden rounded-full border border-gold/40 shadow-gold-glow flex-shrink-0 ${
            isSmall
              ? "w-7 h-7 sm:w-8 sm:h-8"
              : isLarge
              ? "w-14 h-14 sm:w-16 sm:h-16"
              : "w-8 h-8 sm:w-10 sm:h-10"
          }`}
        >
          <img
            src={logoImg}
            alt="Jayroop Royal House"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Brand Typography */}
        <div className="flex flex-col items-start text-left min-w-0">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span
              className={`font-serif tracking-[0.18em] sm:tracking-[0.25em] font-bold uppercase transition-colors duration-300 ${
                isLarge
                  ? "text-xl sm:text-2xl"
                  : isSmall
                  ? "text-xs sm:text-sm"
                  : "text-sm sm:text-base md:text-lg"
              } ${isWhite ? "text-white" : "text-zinc-100 group-hover:text-gold-light"}`}
            >
              JAYROOP
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-wider text-gold font-sans font-semibold border border-gold/40 px-1 py-0.5 rounded leading-none">
              JR
            </span>
          </div>
          <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.35em] text-gold/80 font-sans font-medium -mt-0.5 truncate max-w-[150px] sm:max-w-none">
            ROYAL FRAGRANCE & SKINCARE
          </span>
        </div>
      </div>

      {showTagline && (
        <div className="mt-1 hidden sm:flex items-center gap-2">
          <span className="inline-block bg-gradient-to-r from-gold-amber via-gold to-gold-amber text-black text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider shadow-sm">
            पिंपल्स भागे, आत्मविश्वास जागे
          </span>
        </div>
      )}
    </Link>
  );
};
