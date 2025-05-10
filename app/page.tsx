import { QuoteForm } from "@/components/quote-form";
import { QuoteDisplay } from "@/components/quote-display";
import { ResortHeader } from "@/components/resort-header";
import { ResortFooter } from "@/components/resort-footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white">
      <ResortHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-sky-900 mb-8">
            Báo Giá Đặt Phòng
          </h1>
          <div className="flex flex-col md:grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-sky-800 mb-4">
                Nhập Thông Tin Đặt Phòng
              </h2>
              <QuoteForm />
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-sky-800 mb-4">
                Xem Trước Báo Giá
              </h2>
              <QuoteDisplay />
            </div>
          </div>
        </div>
      </main>
      <ResortFooter />
    </div>
  );
}
