-- Thêm dữ liệu mẫu vào bảng quotes
INSERT INTO quotes (id, created_at, guest_name, email, phone, check_in, check_out, nights, adults, children, room_type, price_per_night, additional_fees, notes, booking_id, children_details, special_requests, additional_services) 
VALUES 
  ('51b89f6c-e0de-4d6a-8a2d-91e2a7fe3e5c', '2023-12-05T08:30:00Z', 'John Smith', 'john.smith@example.com', '+84901234567', '2023-12-15', '2023-12-18', 3, 2, 1, 'Deluxe Double Room', 2200000, 100000, 'Guest is a repeat customer, VIP treatment recommended.', 'BKK-001', '1 child (5 years old)', 'Early check-in if possible, room with sea view', '1 children''s buffet ticket'),
  
  ('a2b7c8d9-e0f1-42a2-83b4-5a6b7c8d9e0f', '2023-12-06T10:15:00Z', 'Maria Garcia', 'maria.garcia@example.com', '+84912345678', '2023-12-20', '2023-12-25', 5, 2, 2, 'Family Suite', 3500000, 150000, 'Family celebrating anniversary.', 'BKK-002', '2 children (3 and 7 years old)', 'Celebration cake for anniversary on Dec 21st', '2 children''s buffet tickets, 1 bottle of champagne'),
  
  ('c3d4e5f6-a7b8-49c0-91d2-3e4f5a6b7c8d', '2023-12-07T14:45:00Z', 'Robert Johnson', 'robert.johnson@example.com', '+84923456789', '2023-12-18', '2023-12-21', 3, 1, 0, 'Junior Suite', 2800000, 0, 'Business traveler, needs quiet room.', 'BKK-003', '', 'Quiet room away from elevator, late checkout', ''),
  
  ('d9e0f1a2-b3c4-45d6-87e8-9f0a1b2c3d4e', '2023-12-08T09:20:00Z', 'Tran Thi Minh', 'minh.tran@example.com', '+84934567890', '2023-12-22', '2023-12-24', 2, 2, 1, 'Premium Ocean View', 2600000, 100000, 'Local guest, speaks Vietnamese.', 'BKK-004', '1 child (4 years old)', 'Room on high floor with good view', '1 children''s buffet ticket'),
  
  ('e5f6a7b8-c9d0-41e2-93f4-a5b6c7d8e9f0', '2023-12-09T11:30:00Z', 'Kim Min-ji', 'minji.kim@example.com', '+84945678901', '2023-12-25', '2023-12-30', 5, 2, 0, 'Luxury Beachfront Villa', 4200000, 200000, 'Korean guest, prefers Korean-speaking staff if available.', 'BKK-005', '', 'Korean TV channels, additional pillows', 'Welcome fruit basket, airport transfer');

-- Tắt tạm thời chính sách RLS để có thể xem tất cả dữ liệu mà không cần đăng nhập
ALTER TABLE quotes DISABLE ROW LEVEL SECURITY;

-- Lưu ý: Sau khi mọi thứ đã hoạt động, bạn có thể bật lại RLS bằng câu lệnh:
-- ALTER TABLE quotes ENABLE ROW LEVEL SECURITY; 