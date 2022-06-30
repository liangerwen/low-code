import Error404 from "@/assets/404.svg";

export default function NotFind() {
  return (
    <div className="mt-[100px] text-center">
      <img src={Error404} className="w-[400px] h-[300px]" />
      <h1 className="mb-0 color-[var(--color-text-2)]">页面找不到了</h1>
    </div>
  );
}
