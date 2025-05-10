"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { SimpleQuoteExport } from "@/components/simple-quote-export";

interface QuoteData {
  bookingId: string;
  customerName: string;
  phone: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  roomType: string;
  adults: number;
  children: number;
  childrenDetails: string;
  specialRequests: string;
  pricePerNight: string;
  totalRoomCost: string;
  additionalFees: string;
  additionalServices: string;
  grandTotal: string;
}

export function QuoteDisplay() {
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);

  useEffect(() => {
    // Lắng nghe sự kiện cập nhật báo giá
    const handleUpdateQuote = (event: CustomEvent<QuoteData>) => {
      setQuoteData(event.detail);
    };

    window.addEventListener("updateQuote", handleUpdateQuote as EventListener);

    return () => {
      window.removeEventListener(
        "updateQuote",
        handleUpdateQuote as EventListener
      );
    };
  }, []);

  if (!quoteData) {
    return (
      <div className="border border-dashed border-sky-300 rounded-lg p-8 text-center bg-sky-50">
        <p className="text-sky-800 mb-2">Chưa có dữ liệu báo giá</p>
        <p className="text-sm text-sky-600">
          Vui lòng nhập thông tin hoặc dán dữ liệu mẫu để xem báo giá
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SimpleQuoteExport
        quoteElementId="quote-card"
        bookingId={quoteData.bookingId}
      />

      <Card className="overflow-hidden" id="quote-card">
        <div className="bg-sky-800 text-white p-4 text-center">
          <h3 className="text-xl font-bold">Asteria Mũi Né Resort</h3>
          <p className="text-sky-200 text-sm">Báo Giá Đặt Phòng</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b">
            <div>
              <p className="text-sm text-muted-foreground">Mã Đặt Phòng</p>
              <p className="font-semibold">{quoteData.bookingId}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Ngày Tạo</p>
              <p className="font-semibold">
                {new Date().toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sky-800 mb-2">
                Thông Tin Khách Hàng
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Tên Khách Hàng
                  </p>
                  <p>{quoteData.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Số Điện Thoại</p>
                  <p>{quoteData.phone}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sky-800 mb-2">
                Chi Tiết Đặt Phòng
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Ngày Nhận Phòng
                  </p>
                  <p>{quoteData.checkInDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Ngày Trả Phòng
                  </p>
                  <p>{quoteData.checkOutDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Số Đêm</p>
                  <p>{quoteData.nights}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Loại Phòng</p>
                  <p>{quoteData.roomType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Số Người Lớn</p>
                  <p>{quoteData.adults}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Số Trẻ Em</p>
                  <p>
                    {quoteData.children} ({quoteData.childrenDetails})
                  </p>
                </div>
              </div>
            </div>

            {quoteData.specialRequests && (
              <div>
                <h4 className="font-semibold text-sky-800 mb-2">
                  Yêu Cầu Đặc Biệt
                </h4>
                <p className="bg-sky-50 p-3 rounded-md text-sky-900">
                  {quoteData.specialRequests}
                </p>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-sky-800 mb-2">
                Chi Tiết Thanh Toán
              </h4>
              <div className="space-y-2 border-t pt-2">
                <div className="flex justify-between">
                  <span>Giá phòng mỗi đêm</span>
                  <span>{quoteData.pricePerNight}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tổng tiền phòng ({quoteData.nights} đêm)</span>
                  <span>{quoteData.totalRoomCost}</span>
                </div>
                {quoteData.additionalServices && (
                  <div className="flex justify-between">
                    <span>
                      Dịch vụ bổ sung ({quoteData.additionalServices})
                    </span>
                    <span>{quoteData.additionalFees}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Tổng Cộng</span>
                  <span className="text-sky-800">{quoteData.grandTotal}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-sky-50 p-4 rounded-md mt-6">
            <h4 className="font-semibold text-sky-800 mb-2">
              Điều Khoản & Lưu Ý
            </h4>
            <ul className="text-sm space-y-1 text-sky-900">
              <li>• Giá trên đã bao gồm thuế và phí dịch vụ.</li>
              <li>
                • Báo giá có hiệu lực trong vòng 24 giờ kể từ thời điểm tạo.
              </li>
              <li>• Vui lòng thanh toán đặt cọc 50% để xác nhận đặt phòng.</li>
              <li>
                • Chính sách hủy: Miễn phí hủy trước 7 ngày, sau đó phí 50% tổng
                giá trị đặt phòng.
              </li>
              <li>• Giờ nhận phòng: 14:00, giờ trả phòng: 12:00.</li>
            </ul>
          </div>
        </div>

        <div className="bg-sky-50 p-4 text-center border-t">
          <p className="text-sm text-sky-800">
            Cảm ơn quý khách đã lựa chọn Asteria Mũi Né Resort!
          </p>
          <p className="text-xs text-sky-600 mt-1">
            Mọi thắc mắc vui lòng liên hệ: 0123 456 789 |
            info@asteriamuineresort.com
          </p>
        </div>
      </Card>
    </div>
  );
}
