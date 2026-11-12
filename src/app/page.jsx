import { ZaryaLogo } from "@/components/zarya-logo";

// Главная: только логотип по центру экрана.
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <ZaryaLogo className="h-10 w-auto sm:h-14" />
    </main>
  );
}
