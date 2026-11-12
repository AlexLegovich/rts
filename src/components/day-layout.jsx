import Image from "next/image";
import Link from "next/link";
import { ZaryaLogo } from "@/components/zarya-logo";

// Общий каркас страницы дня.
// Десктоп: слева логотип, заголовок и форма, справа фото на всю высоту.
// Мобильный: логотип, фото-баннер, заголовок, форма — в одну колонку.
export function DayLayout({
  eyebrow = "Потерянная душа: возвращение к себе",
  title,
  image,
  mobileImage = image, // отдельное фото для мобильного (по умолчанию то же, что на десктопе)
  children,
}) {
  return (
    // Сетка на всю ширину: фото тянется до края экрана,
    // а левая половина прижата к центру и не шире половины контейнера 1440px.
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      <div className="px-4 pt-4 pb-8 sm:px-8 lg:ml-auto lg:w-full lg:max-w-180 lg:px-16 lg:py-8 xl:px-24">
        <Link href="/" aria-label="ZARYA">
          <ZaryaLogo className="h-4.5 w-auto lg:h-6.25" />
        </Link>

        <div className="max-w-115">
          {/* Фото-баннер только на мобильном */}
          {mobileImage && (
            <div className="relative mt-6 aspect-37/21 overflow-hidden rounded-2xl bg-[#1c1a14] lg:hidden">
              <Image
                src={mobileImage}
                alt=""
                fill
                priority
                quality={80}
                sizes="(min-width: 1024px) 1px, (min-width: 640px) 460px, 100vw"
                className="object-cover"
              />
            </div>
          )}

          <p className="mt-8 text-xs font-medium uppercase tracking-wide lg:mt-16">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-5xl">{title}</h1>
          <div className="mt-8">{children}</div>
        </div>
      </div>

      {/* Фото на десктопе: Next.js сам сжимает его и отдаёт размер под экран. Пока грузится — тёмный фон. */}
      <div className="hidden lg:sticky lg:top-0 lg:block lg:h-screen lg:p-8">
        <div className="relative h-full overflow-hidden rounded-[32px] bg-[#1c1a14]">
          {image && (
            <Image
              src={image}
              alt=""
              fill
              priority
              quality={80}
              sizes="(min-width: 1024px) 50vw, 1px"
              className="object-cover"
            />
          )}
        </div>
      </div>
    </div>
  );
}
