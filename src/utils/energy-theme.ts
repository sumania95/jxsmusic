// utils/energy-theme.ts

export function getEnergyTheme(
  energy: number | null,
) {
  if (energy === null) {
    return {
      label: "Unknown",
      barClass: "bg-zinc-500",
      glowClass: "",
      valueClass: "text-zinc-400",
      filterClass:
        "border-zinc-400/20 bg-zinc-400/[0.06] text-zinc-400",
    };
  }

  if (energy <= 2) {
    return {
      label: "Ambient",
      barClass: "bg-sky-400",
      glowClass:
        "shadow-[0_0_6px_rgba(56,189,248,0.4)]",
      valueClass: "text-sky-400",
      filterClass:
        "border-sky-400/20 bg-sky-400/[0.06] text-sky-400",
    };
  }

  if (energy <= 4) {
    return {
      label: "Chill",
      barClass: "bg-cyan-400",
      glowClass:
        "shadow-[0_0_6px_rgba(34,211,238,0.4)]",
      valueClass: "text-cyan-400",
      filterClass:
        "border-cyan-400/20 bg-cyan-400/[0.06] text-cyan-400",
    };
  }

  if (energy === 5) {
    return {
      label: "Underground",
      barClass: "bg-emerald-400",
      glowClass:
        "shadow-[0_0_6px_rgba(52,211,153,0.4)]",
      valueClass: "text-emerald-400",
      filterClass:
        "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-400",
    };
  }

  if (energy === 6) {
    return {
      label: "Groovy",
      barClass: "bg-[#B9FF00]",
      glowClass:
        "shadow-[0_0_6px_rgba(185,255,0,0.4)]",
      valueClass: "text-[#B9FF00]",
      filterClass:
        "border-[#B9FF00]/20 bg-[#B9FF00]/[0.06] text-[#B9FF00]",
    };
  }

  if (energy === 7) {
    return {
      label: "Party",
      barClass: "bg-yellow-400",
      glowClass:
        "shadow-[0_0_6px_rgba(250,204,21,0.4)]",
      valueClass: "text-yellow-400",
      filterClass:
        "border-yellow-400/20 bg-yellow-400/[0.06] text-yellow-400",
    };
  }

  if (energy === 8) {
    return {
      label: "Peak Time",
      barClass: "bg-orange-400",
      glowClass:
        "shadow-[0_0_6px_rgba(251,146,60,0.4)]",
      valueClass: "text-orange-400",
      filterClass:
        "border-orange-400/20 bg-orange-400/[0.06] text-orange-400",
    };
  }

  if (energy === 9) {
    return {
      label: "Climax",
      barClass: "bg-red-500",
      glowClass:
        "shadow-[0_0_6px_rgba(239,68,68,0.45)]",
      valueClass: "text-red-400",
      filterClass:
        "border-red-400/20 bg-red-400/[0.06] text-red-400",
    };
  }

  return {
    label: "Monster",
    barClass: "bg-fuchsia-500",
    glowClass:
      "shadow-[0_0_7px_rgba(217,70,239,0.5)]",
    valueClass: "text-fuchsia-400",
    filterClass:
      "border-fuchsia-400/20 bg-fuchsia-400/[0.06] text-fuchsia-400",
  };
}