# Hướng dẫn thiết lập Database Supabase

Thư mục này chứa các tệp SQL để thiết lập cơ sở dữ liệu cho ứng dụng Resort Quote Generator.

## Thiết lập cơ sở dữ liệu

### 1. Tạo bảng Users

Sử dụng file `create_users_table_final.sql` để tạo bảng users. File này sẽ:

- Tạo bảng users với cấu trúc phù hợp
- Tạo các chỉ mục để tối ưu hóa truy vấn
- Thêm hai người dùng mẫu (admin và staff)

### 2. Tạo bảng Quotes

Sử dụng file `create_quotes_table.sql` để tạo bảng quotes. File này sẽ:

- Tạo bảng quotes với cấu trúc đầy đủ
- Thiết lập các chính sách bảo mật Row Level Security (RLS)

### 3. Thêm dữ liệu mẫu

Sau khi đã tạo các bảng, sử dụng file `insert_sample_quotes.sql` để thêm dữ liệu mẫu vào bảng quotes.

## Cách thực hiện

1. Đăng nhập vào Supabase dashboard
2. Điều hướng đến phần SQL Editor
3. Mở từng file SQL và chạy theo thứ tự sau:
   - `create_users_table_final.sql`
   - `create_quotes_table.sql`
   - `insert_sample_quotes.sql`

## Lưu ý quan trọng

- File `insert_sample_quotes.sql` tạm thời tắt Row Level Security (RLS) để dễ dàng xem dữ liệu mà không cần đăng nhập
- Khi ứng dụng đã sẵn sàng cho môi trường production, bạn nên bật lại RLS với lệnh:
  ```sql
  ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
  ```

## Cấu hình môi trường

Đảm bảo rằng file `.env.local` của bạn đã được cấu hình đúng với các biến môi trường Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXTAUTH_SECRET=your_nextauth_secret_here
```
