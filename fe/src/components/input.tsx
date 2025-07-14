import { JSX } from "solid-js";

type InputProps = {
  type?: string;
  id?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  required?: boolean;
  onInput?: (e: Event) => void;
  class?: string;
};

export default function Input(props: InputProps) {
  return (
    <input
      type={props.type || "text"}
      id={props.id}
      name={props.name}
      value={props.value}
      placeholder={props.placeholder}
      required={props.required}
      onInput={props.onInput}
      class={`w-full px-4 py-3 border border-[#90d9c7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a7ede7] ${props.class || ""}`}
    />
  );
}
