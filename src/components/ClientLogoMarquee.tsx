import Image from "next/image";

function logoName(src: string) {
  const file = decodeURIComponent(src.split("/").pop() ?? "");
  return file.replace(/\.[^.]+$/, "").replace(/[_\s-]?logo$/i, "").trim();
}

// A continuous right-to-left carousel; hovering pauses it and lifts the hovered logo.
export function ClientLogoMarquee({ logos }: { logos: string[] }) {
  const track = [...logos, ...logos];

  return (
    <div className="logo-marquee relative overflow-hidden pt-3 pb-6" dir="ltr">
      <ul className="logo-marquee__track flex w-max items-center">
        {track.map((src, i) => {
          const name = logoName(src);
          const duplicate = i >= logos.length;
          return (
            <li
              key={`${src}-${i}`}
              aria-hidden={duplicate || undefined}
              className="logo-marquee__item relative flex w-36 shrink-0 flex-col items-center px-5 sm:w-48 sm:px-7"
            >
              <Image
                src={src}
                alt={duplicate ? "" : name}
                width={220}
                height={140}
                unoptimized
                className="logo-marquee__img h-12 w-full object-contain sm:h-16"
              />
              <span
                className="logo-marquee__name pointer-events-none absolute -bottom-5 whitespace-nowrap text-[0.7rem] font-semibold text-fg/60 sm:text-xs"
                dir="auto"
              >
                {name}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
