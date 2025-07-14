import { JSX } from "solid-js";

type ButtonProps = {
  children: JSX.Element;
  type?: "button" | "submit" ;
  class?: string;
  onClick?: () => void;
  variant?: "default" | "teal" | "pink" | "danger" | "gradient" // 👈 Tambah "gradient"
};

export default function Button(props: ButtonProps) {
  const baseStyle = "font-semibold py-2 px-4 rounded-xl shadow-md transition-all duration-200";

  const variantStyle = {
    default: "bg-[#b5e0dc] hover:bg-[#a2d5d0] text-white",
    teal: "bg-teal-400 hover:bg-teal-300 text-white",
    pink: "bg-pink-400 hover:bg-pink-300 text-white",
    danger: "bg-red-500 hover:bg-red-400 text-white",
    gradient: "bg-gradient-to-r from-teal-400 to-teal-300 hover:from-teal-300 hover:to-teal-200 text-white", // ✨ Gradient dreamy
  };

  return (
    <button
      type={props.type || "button"}
      class={`${baseStyle} ${variantStyle[props.variant || "default"]} ${props.class || ""}`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
