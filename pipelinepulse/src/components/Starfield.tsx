"use client";
import { useEffect, useState } from "react";

export default function Starfield() {
  const [stars1, setStars1] = useState("");
  const [stars2, setStars2] = useState("");
  const [stars3, setStars3] = useState("");

  useEffect(() => {
    // Generates a random box-shadow string to create stars
    const generateStars = (count: number) => {
      let shadow = "";
      for (let i = 0; i < count; i++) {
        shadow += `${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px #FFF, `;
      }
      return shadow.slice(0, -2);
    };

    setStars1(generateStars(400));
    setStars2(generateStars(150));
    setStars3(generateStars(50));
  }, []);

  if (!stars1) return null;

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#05050f] pointer-events-none">
      {/* Milky way glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vh] bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.15)_0%,rgba(5,5,15,0)_60%)] opacity-70 rotate-12 blur-3xl"></div>
      
      {/* Star Layers (using pseudo elements to loop the animation seamlessly) */}
      <div className="animate-stars-slow absolute w-[1px] h-[1px] rounded-full opacity-50" style={{ boxShadow: stars1 }}>
        <div className="absolute top-[2000px] w-[1px] h-[1px] rounded-full" style={{ boxShadow: stars1 }}></div>
      </div>
      
      <div className="animate-stars-medium absolute w-[2px] h-[2px] rounded-full opacity-70" style={{ boxShadow: stars2 }}>
        <div className="absolute top-[2000px] w-[2px] h-[2px] rounded-full" style={{ boxShadow: stars2 }}></div>
      </div>
      
      <div className="animate-stars-fast absolute w-[3px] h-[3px] rounded-full opacity-100" style={{ boxShadow: stars3 }}>
        <div className="absolute top-[2000px] w-[3px] h-[3px] rounded-full" style={{ boxShadow: stars3 }}></div>
      </div>
    </div>
  );
}
