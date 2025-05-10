import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export function ResortFooter() {
  return (
    <footer className="bg-sky-900 text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Asteria Mũi Né Resort
            </h3>
            <p className="text-sky-200 mb-4">
              Khu nghỉ dưỡng hiện đại nằm trên bờ biển đẹp nhất Việt Nam, trải
              dài bãi biển cát trắng dài 200m.
            </p>
            <div className="flex items-center gap-2 text-sky-200 mb-2">
              <MapPin size={16} />
              <span>Mũi Né, Phan Thiết, Bình Thuận</span>
            </div>
            <div className="flex items-center gap-2 text-sky-200 mb-2">
              <Phone size={16} />
              <span>+84 123 456 789</span>
            </div>
            <div className="flex items-center gap-2 text-sky-200">
              <Mail size={16} />
              <span>info@asteriamuineresort.com</span>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Tiện Nghi</h3>
            <ul className="space-y-2 text-sky-200">
              <li>Hồ bơi rộng</li>
              <li>Sân khấu hoạt náo A'rena</li>
              <li>Nhà hàng Parosa</li>
              <li>Shoreline Snack</li>
              <li>Stellar Spa</li>
              <li>Trung tâm thể dục Fit Sphere</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Liên Kết Nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sky-200 hover:text-white transition-colors"
                >
                  Đặt Phòng
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sky-200 hover:text-white transition-colors"
                >
                  Khuyến Mãi
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sky-200 hover:text-white transition-colors"
                >
                  Phòng & Giá
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sky-200 hover:text-white transition-colors"
                >
                  Dịch Vụ Spa
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sky-200 hover:text-white transition-colors"
                >
                  Nhà Hàng
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sky-200 hover:text-white transition-colors"
                >
                  Liên Hệ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sky-800 mt-8 pt-6 text-center text-sky-300 text-sm">
          <p>
            © {new Date().getFullYear()} Made by{" "}
            <a
              href="https://github.com/dltuananh123"
              className="underline hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              dltuananh123
            </a>{" "}
            and{" "}
            <a
              href="https://github.com/bechovang"
              className="underline hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              bechovang
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
