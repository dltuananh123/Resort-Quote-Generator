import Image from "next/image";
import Link from "next/link";

export function ResortHeader() {
  return (
    <header className="bg-sky-900 text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-12 h-12 md:w-16 md:h-16">
              <Image
                src="/logo.svg"
                alt="Asteria Mũi Né Resort Logo"
                fill
                className="object-contain bg-white rounded"
                priority
              />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Asteria</h1>
              <p className="text-xs md:text-sm text-sky-200">Mũi Né Resort</p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#" className="hover:text-sky-200 transition-colors">
              Trang Chủ
            </Link>
            <Link href="#" className="hover:text-sky-200 transition-colors">
              Phòng Nghỉ
            </Link>
            <Link href="#" className="hover:text-sky-200 transition-colors">
              Dịch Vụ
            </Link>
            <Link href="#" className="hover:text-sky-200 transition-colors">
              Liên Hệ
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
