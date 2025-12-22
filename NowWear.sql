-- Bảng Users
CREATE DATABASE nowwear;
USE nowwear;
-- Bảng users
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng password_reset_tokens
CREATE TABLE password_reset_tokens (
    token_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expiration TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Bảng roles
CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL
);

-- Bảng User_Role (N-N)
CREATE TABLE user_role (
    user_id INT,
    role_id INT,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
);

-- Bảng Categories: nhóm khách hàng (Men, Women, Kids)
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL
);

-- Bảng SubCategories: loại sản phẩm (Topwear, Bottomwear, Winterwear)
CREATE TABLE sub_categories (
    sub_category_id INT AUTO_INCREMENT PRIMARY KEY,
    sub_category_name VARCHAR(100) UNIQUE NOT NULL
);

-- Bảng Products
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255) UNIQUE NOT NULL,
    product_description TEXT,
    category_id INT,
    sub_category_id INT,
    price DECIMAL(10,2) NOT NULL,
    best_seller BOOLEAN DEFAULT FALSE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE,
    FOREIGN KEY (sub_category_id) REFERENCES sub_categories(sub_category_id) ON DELETE CASCADE
);


-- Bảng Product_inventory
CREATE TABLE product_inventory (
    product_inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    size VARCHAR(50) NOT NULL,
    stock_quantity INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    UNIQUE (product_id, size)
);


-- Bảng Product_Images
CREATE TABLE product_images (
    product_image_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    url VARCHAR(255) NOT NULL,
    display_order INT,
    UNIQUE (product_id, url),
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- Bảng Carts
CREATE TABLE carts (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Bảng Cart_Items
CREATE TABLE cart_items (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_inventory_id INT NOT NULL,
    quantity INT NOT NULL,
    UNIQUE (cart_id, product_inventory_id),
    FOREIGN KEY (cart_id) REFERENCES carts(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (product_inventory_id) REFERENCES product_inventory(product_inventory_id) ON DELETE CASCADE
);

-- Bảng Addresses
CREATE TABLE addresses (
    address_id INT AUTO_INCREMENT PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    street VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL
);

-- Bảng Orders
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    address_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    shipping_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Chưa thanh toán',
    payment_method VARCHAR(50) NOT NULL DEFAULT 'Tiền mặt',
    order_process VARCHAR(50) NOT NULL DEFAULT 'Chờ xử lý',

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (address_id) REFERENCES addresses(address_id) ON DELETE CASCADE,

    CHECK (status IN ('Chưa thanh toán', 'Đã thanh toán')),
    CHECK (payment_method IN ('Tiền mặt', 'vnpay')),
    CHECK (order_process IN ('Chờ xử lý', 'Đang giao', 'Hoàn tất', 'Đã hủy'))
);


-- Bảng Order_Items
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_inventory_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    UNIQUE (order_id, product_inventory_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_inventory_id) REFERENCES product_inventory(product_inventory_id) ON DELETE CASCADE
);

CREATE TABLE revenue (
    revenue_id INT AUTO_INCREMENT PRIMARY KEY,
    revenue_month INT CHECK (revenue_month BETWEEN 1 AND 12),
    revenue_year INT,
    income DECIMAL(12,2) DEFAULT 0,
    outcome DECIMAL(12,2) DEFAULT 0,
    UNIQUE (revenue_month, revenue_year)
);

-- Bảng Expenses
CREATE TABLE expenses (
    expense_id INT AUTO_INCREMENT PRIMARY KEY,
    expense_month INT CHECK (expense_month BETWEEN 1 AND 12),
    expense_year INT,
    expense_amount DECIMAL(12,2) NOT NULL,
    description VARCHAR(255) NOT NULL, -- Thêm cột mô tả
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INSERT data

-- Bảng Categories
INSERT INTO categories (category_name) 
VALUES  
('Nam'),
('Nữ'),
('Trẻ em');

-- Bảng sub_categories
INSERT INTO sub_categories (sub_category_name)
VALUES 
('Áo'),
('Quần'),
('Đồ mùa đông');

INSERT INTO products (
    product_name, 
    product_description, 
    category_id, 
    sub_category_id, 
    price, 
    best_seller,
    created_at
) 
VALUES
('Áo thun cổ tròn cotton nữ – Basic Fit', 'Chiếc áo nhẹ, thường được dệt kim, ôm sát, cổ tròn và tay ngắn, có thể mặc lót hoặc mặc ngoài.', 2, 1, 100.00, TRUE, '2024-01-15 10:20:00'),
('Áo thun cổ tròn cotton nam – Regular Fit', 'Chiếc áo nhẹ, thường được dệt kim, ôm sát, cổ tròn và tay ngắn, có thể mặc lót hoặc mặc ngoài.', 1, 1, 200.00, TRUE, '2024-02-10 14:33:00'),
('Áo thun cổ tròn cotton bé gái – Basic', 'Chiếc áo nhẹ, thường được dệt kim, ôm sát, cổ tròn và tay ngắn, có thể mặc lót hoặc mặc ngoài.', 3, 1, 220.00, TRUE, '2024-03-05 09:21:00'),
('Áo thun cổ tròn cotton nam – Classic Wear', 'Chiếc áo nhẹ, thường được dệt kim, ôm sát, cổ tròn và tay ngắn, có thể mặc lót hoặc mặc ngoài.', 1, 1, 110.00, TRUE, '2024-03-28 16:40:00'),
('Áo thun cổ tròn cotton nữ – Daily Wear', 'Chiếc áo nhẹ, thường được dệt kim, ôm sát, cổ tròn và tay ngắn, có thể mặc lót hoặc mặc ngoài.', 2, 1, 130.00, TRUE, '2024-04-12 08:55:00'),
('Áo thun cổ tròn cotton bé gái – Casual', 'Chiếc áo nhẹ, thường được dệt kim, ôm sát, cổ tròn và tay ngắn, có thể mặc lót hoặc mặc ngoài.', 3, 1, 140.00, TRUE, '2024-04-20 11:42:00'),
('Quần tây dáng ôm nam – Form Slim', 'Chiếc quần may gọn gàng, chất liệu nhẹ, thích hợp cho phong cách công sở hoặc thường ngày.', 1, 2, 190.00, FALSE, '2024-05-01 13:10:00'),
('Áo thun cổ tròn cotton nam – Active Style', 'Chiếc áo nhẹ, thường được dệt kim, ôm sát, cổ tròn và tay ngắn, có thể mặc lót hoặc mặc ngoài.', 1, 1, 140.00, FALSE, '2024-05-22 09:33:00'),
('Áo thun cổ tròn cotton bé gái – Easy Wear', 'Chiếc áo nhẹ, thường được dệt kim, ôm sát, cổ tròn và tay ngắn, có thể mặc lót hoặc mặc ngoài.', 3, 1, 100.00, FALSE, '2024-06-02 17:28:00'),
('Quần tây dáng ôm nam – Office Fit', 'Chiếc quần may gọn gàng, chất liệu nhẹ, thích hợp cho phong cách công sở hoặc thường ngày.', 1, 2, 110.00, FALSE, '2024-06-15 15:01:00'),
('Áo thun cổ tròn cotton nam – Essential Tee', 'Chiếc áo nhẹ, thường được dệt kim, ôm sát, cổ tròn và tay ngắn, có thể mặc lót hoặc mặc ngoài.', 1, 1, 120.00, FALSE, '2024-07-01 11:14:00'),
('Áo thun cổ tròn cotton nam – Comfort Fit', 'Chiếc áo nhẹ, thường được dệt kim, ôm sát, cổ tròn và tay ngắn, có thể mặc lót hoặc mặc ngoài.', 1, 1, 150.00, FALSE, '2024-07-20 19:44:00'),
('Áo thun cổ tròn cotton nữ – Soft Touch', 'Chiếc áo nhẹ, thường được dệt kim, ôm sát, cổ tròn và tay ngắn, có thể mặc lót hoặc mặc ngoài.', 2, 1, 130.00, FALSE, '2024-08-03 09:20:00'),
('Áo thun cổ tròn cotton bé trai – Basic', 'Chiếc áo nhẹ, thường được dệt kim, ôm sát, cổ tròn và tay ngắn, có thể mặc lót hoặc mặc ngoài.', 3, 1, 160.00, FALSE, '2024-08-17 13:39:00'),
('Quần tây dáng ôm nam – Smart Wear', 'Chiếc quần may gọn gàng, chất liệu nhẹ, thích hợp cho phong cách công sở hoặc thường ngày.', 1, 2, 140.00, FALSE, '2024-09-01 10:55:00'),
('Áo thun cổ tròn cotton bé gái – Soft', 'Chiếc áo nhẹ, thường được dệt kim, ôm sát, cổ tròn và tay ngắn, có thể mặc lót hoặc mặc ngoài.', 3, 1, 170.00, FALSE, '2024-09-20 15:12:00'),
('Quần tây dáng ôm nam – Form Classic', 'Chiếc quần may gọn gàng, chất liệu nhẹ, thích hợp cho phong cách công sở hoặc thường ngày.', 1, 2, 150.00, FALSE, '2024-10-04 08:22:00'),
('Áo thun cổ tròn cotton bé trai – Sporty', 'Chiếc áo nhẹ, thường được dệt kim, ôm sát, cổ tròn và tay ngắn, có thể mặc lót hoặc mặc ngoài.', 3, 1, 180.00, FALSE, '2024-10-18 11:50:00'),
('Áo thun cổ tròn cotton bé trai – Daily', 'Chiếc áo nhẹ, thường được dệt kim, ôm sát, cổ tròn và tay ngắn, có thể mặc lót hoặc mặc ngoài.', 3, 1, 160.00, FALSE, '2024-11-03 14:45:00'),
('Quần palazzo nữ – Classic Wide', 'Chiếc quần ống rộng, vải nhẹ, mang phong cách thời trang hiện đại và thoải mái.', 2, 2, 190.00, FALSE, '2024-11-22 16:08:00'),
('Áo khoác nữ khóa kéo dáng rộng – Classic Zip', 'Áo khoác nhẹ, có khóa kéo phía trước, phù hợp với thời tiết se lạnh.', 2, 3, 170.00, FALSE, '2024-12-01 09:32:00'),
('Quần palazzo nữ – Modern Wide', 'Chiếc quần ống rộng, vải nhẹ, mang phong cách thời trang hiện đại và thoải mái.', 2, 2, 200.00, FALSE, '2024-12-17 19:22:00'),
('Áo thun cổ tròn cotton bé trai – Ultra Soft', 'Chiếc áo nhẹ, thường được dệt kim, ôm sát, cổ tròn và tay ngắn, có thể mặc lót hoặc mặc ngoài.', 3, 1, 180.00, FALSE, '2025-01-08 08:44:00'),
('Áo thun cổ tròn cotton bé trai – Flex Wear', 'Chiếc áo nhẹ, thường được dệt kim, ôm sát, cổ tròn và tay ngắn, có thể mặc lót hoặc mặc ngoài.', 3, 1, 210.00, FALSE, '2025-01-22 10:31:00'),
('Áo thun cổ tròn cotton bé gái – Playful', 'Chiếc áo nhẹ, thường được dệt kim, ôm sát, cổ tròn và tay ngắn, có thể mặc lót hoặc mặc ngoài.', 3, 1, 190.00, FALSE, '2025-02-10 14:18:00'),
('Áo khoác nữ khóa kéo dáng rộng – Urban Zip', 'Áo khoác nhẹ, có khóa kéo phía trước, phù hợp với thời tiết se lạnh.', 2, 3, 220.00, FALSE, '2025-02-25 11:59:00'),
('Áo thun cổ tròn cotton bé gái – Cute Style', 'Chiếc áo nhẹ, thường được dệt kim, ôm sát, cổ tròn và tay ngắn, có thể mặc lót hoặc mặc ngoài.', 3, 1, 200.00, FALSE, '2025-03-05 17:04:00'),
('Áo khoác denim dáng ôm nam – Urban Fit', 'Áo khoác denim trẻ trung, vừa vặn cơ thể, thích hợp cho phong cách năng động.', 1, 3, 230.00, FALSE, '2025-03-21 13:17:00'),
('Áo thun cổ tròn cotton nữ – Classic Style', 'Chiếc áo nhẹ, thường được dệt kim, ôm sát, cổ tròn và tay ngắn, có thể mặc lót hoặc mặc ngoài.', 2, 1, 210.00, FALSE, '2025-04-02 09:50:00'),
('Áo thun cổ tròn cotton bé gái – Sweet Soft', 'Chiếc áo nhẹ, thường được dệt kim, ôm sát, cổ tròn và tay ngắn, có thể mặc lót hoặc mặc ngoài.', 3, 1, 240.00, FALSE, '2025-04-18 15:44:00'),
('Áo thun cổ tròn cotton nam – Flex Soft', 'Chiếc áo nhẹ, thường được dệt kim, ôm sát, cổ tròn và tay ngắn, có thể mặc lót hoặc mặc ngoài.', 1, 1, 220.00, FALSE, '2025-05-01 12:11:00'),
('Áo thun cổ tròn cotton nam – Ultra Cotton', 'Chiếc áo nhẹ, thường được dệt kim, ôm sát, cổ tròn và tay ngắn, có thể mặc lót hoặc mặc ngoài.', 1, 1, 250.00, FALSE, '2025-05-20 10:10:00'),
('Áo thun cổ tròn cotton bé gái – Cute Soft', 'Chiếc áo nhẹ, thường được dệt kim, ôm sát, cổ tròn và tay ngắn, có thể mặc lót hoặc mặc ngoài.', 3, 1, 230.00, FALSE, '2025-06-02 18:22:00'),
('Áo thun cổ tròn cotton nữ – Premium Soft', 'Chiếc áo nhẹ, thường được dệt kim, ôm sát, cổ tròn và tay ngắn, có thể mặc lót hoặc mặc ngoài.', 2, 1, 260.00, FALSE, '2025-06-19 16:31:00'),
('Áo khoác nữ khóa kéo dáng rộng – Daily Zip', 'Áo khoác nhẹ, có khóa kéo phía trước, phù hợp với thời tiết se lạnh.', 2, 3, 240.00, FALSE, '2025-07-05 14:14:00'),
('Áo khoác nữ khóa kéo dáng rộng – Active Zip', 'Áo khoác nhẹ, có khóa kéo phía trước, phù hợp với thời tiết se lạnh.', 2, 3, 270.00, FALSE, '2025-07-21 09:46:00'),
('Áo thun cổ tròn cotton nữ – Essential Wear', 'Chiếc áo nhẹ, thường được dệt kim, ôm sát, cổ tròn và tay ngắn, có thể mặc lót hoặc mặc ngoài.', 2, 1, 250.00, FALSE, '2025-08-08 11:24:00'),
('Áo thun cổ tròn cotton nam – Everyday Tee', 'Chiếc áo nhẹ, thường được dệt kim, ôm sát, cổ tròn và tay ngắn, có thể mặc lót hoặc mặc ngoài.', 1, 1, 280.00, FALSE, '2025-08-25 08:50:00'),
('Áo sơ mi cotton trơn nam – Essential Shirt', 'Áo sơ mi vải cotton thoáng mát, kiểu dáng cổ điển, dễ phối đồ.', 1, 1, 260.00, FALSE, '2025-09-08 15:30:00'),
('Áo khoác denim dáng ôm nam – Street Fit', 'Áo khoác denim trẻ trung, vừa vặn cơ thể, thích hợp cho phong cách năng động.', 1, 3, 290.00, FALSE, '2025-09-23 14:48:00'),
('Áo thun cổ tròn cotton nam – Premium Cotton', 'Chiếc áo nhẹ, thường được dệt kim, ôm sát, cổ tròn và tay ngắn, có thể mặc lót hoặc mặc ngoài.', 1, 1, 270.00, FALSE, '2025-10-02 19:19:00'),
('Áo thun cổ tròn cotton bé trai – Active', 'Chiếc áo nhẹ, thường được dệt kim, ôm sát, cổ tròn và tay ngắn, có thể mặc lót hoặc mặc ngoài.', 3, 1, 300.00, FALSE, '2025-10-19 09:12:00'),
('Quần ôm dáng trẻ em – Basic Fit', 'Chiếc quần vải mềm, co giãn, phù hợp cho trẻ em hoạt động.', 3, 2, 280.00, FALSE, '2025-11-03 13:55:00'),
('Áo khoác nữ khóa kéo dáng rộng – Warm Zip', 'Áo khoác nhẹ, có khóa kéo phía trước, phù hợp với thời tiết se lạnh.', 2, 3, 310.00, FALSE, '2025-11-22 10:44:00'),
('Áo khoác denim dáng ôm nam – Trendy Fit', 'Áo khoác denim trẻ trung, vừa vặn cơ thể, thích hợp cho phong cách năng động.', 1, 3, 290.00, FALSE, '2025-12-02 17:33:00'),
('Áo khoác denim dáng ôm nam – Modern Fit', 'Áo khoác denim trẻ trung, vừa vặn cơ thể, thích hợp cho phong cách năng động.', 1, 3, 320.00, FALSE, '2025-12-18 11:29:00'),
('Quần ôm dáng trẻ em – Easy Stretch', 'Chiếc quần vải mềm, co giãn, phù hợp cho trẻ em hoạt động.', 3, 2, 300.00, FALSE, '2025-12-29 09:18:00'),
('Áo khoác denim dáng ôm nam – Daily Fit', 'Áo khoác denim trẻ trung, vừa vặn cơ thể, thích hợp cho phong cách năng động.', 1, 3, 330.00, FALSE, '2025-12-30 16:55:00'),
('Quần ôm dáng trẻ em – Flex Fit', 'Chiếc quần vải mềm, co giãn, phù hợp cho trẻ em hoạt động.', 3, 2, 310.00, FALSE, '2025-12-31 10:20:00'),
('Quần ôm dáng trẻ em – Soft Stretch', 'Chiếc quần vải mềm, co giãn, phù hợp cho trẻ em hoạt động.', 3, 2, 340.00, FALSE, '2025-12-31 11:55:00'),
('Áo khoác nữ khóa kéo dáng rộng – Soft Zip', 'Áo khoác nhẹ, có khóa kéo phía trước, phù hợp với thời tiết se lạnh.', 2, 3, 320.00, FALSE, '2025-12-31 14:02:00'),
('Áo khoác denim dáng ôm nam – Heist Fit', 'Áo khoác denim trẻ trung, vừa vặn cơ thể, thích hợp cho phong cách năng động.', 1, 3, 350.00, FALSE, '2025-12-31 15:50:00');

-- Bảng product_inventory
INSERT INTO product_inventory (product_id, size, stock_quantity)
VALUES
-- Product 1: ["S", "M", "L"]
(1, 'S', 58),
(1, 'M', 23),
(1, 'L', 91),
-- Product 2: ["M", "L", "XL"]
(2, 'M', 44),
(2, 'L', 67),
(2, 'XL', 12),
-- Product 3: ["S", "L", "XL"]
(3, 'S', 88),
(3, 'L', 34),
(3, 'XL', 72),
-- Product 4: ["S", "M", "XXL"]
(4, 'S', 50),
(4, 'M', 19),
(4, 'XXL', 63),
-- Product 5: ["M", "L", "XL"]
(5, 'M', 29),
(5, 'L', 81),
(5, 'XL', 47),
-- Product 6: ["S", "L", "XL"]
(6, 'S', 95),
(6, 'L', 15),
(6, 'XL', 38),
-- Product 7: ["S", "L", "XL"]
(7, 'S', 77),
(7, 'L', 53),
(7, 'XL', 22),
-- Product 8: ["S", "M", "L", "XL"]
(8, 'S', 61),
(8, 'M', 40),
(8, 'L', 84),
(8, 'XL', 18),
-- Product 9: ["M", "L", "XL"]
(9, 'M', 33),
(9, 'L', 70),
(9, 'XL', 56),
-- Product 10: ["S", "L", "XL"]
(10, 'S', 28),
(10, 'L', 92),
(10, 'XL', 49),
-- Product 11: ["S", "M", "L"]
(11, 'S', 65),
(11, 'M', 13),
(11, 'L', 78),
-- Products 12-52: All have ["S", "M", "L", "XL"]
(12, 'S', 36),
(12, 'M', 89),
(12, 'L', 25),
(12, 'XL', 51),
(13, 'S', 99),
(13, 'M', 11),
(13, 'L', 68),
(13, 'XL', 43),
(14, 'S', 73),
(14, 'M', 30),
(14, 'L', 57),
(14, 'XL', 82),
(15, 'S', 20),
(15, 'M', 66),
(15, 'L', 93),
(15, 'XL', 37),
(16, 'S', 85),
(16, 'M', 14),
(16, 'L', 48),
(16, 'XL', 79),
(17, 'S', 27),
(17, 'M', 96),
(17, 'L', 52),
(17, 'XL', 32),
(18, 'S', 69),
(18, 'M', 21),
(18, 'L', 87),
(18, 'XL', 45),
(19, 'S', 90),
(19, 'M', 35),
(19, 'L', 59),
(19, 'XL', 16),
(20, 'S', 75),
(20, 'M', 41),
(20, 'L', 24),
(20, 'XL', 80),
(21, 'S', 54),
(21, 'M', 97),
(21, 'L', 31),
(21, 'XL', 62),
(22, 'S', 17),
(22, 'M', 74),
(22, 'L', 46),
(22, 'XL', 94),
(23, 'S', 83),
(23, 'M', 26),
(23, 'L', 60),
(23, 'XL', 39),
(24, 'S', 55),
(24, 'M', 10),
(24, 'L', 71),
(24, 'XL', 98),
(25, 'S', 42),
(25, 'M', 86),
(25, 'L', 20),
(25, 'XL', 64),
(26, 'S', 38),
(26, 'M', 76),
(26, 'L', 19),
(26, 'XL', 53),
(27, 'S', 92),
(27, 'M', 29),
(27, 'L', 67),
(27, 'XL', 11),
(28, 'S', 48),
(28, 'M', 84),
(28, 'L', 33),
(28, 'XL', 70),
(29, 'S', 15),
(29, 'M', 61),
(29, 'L', 97),
(29, 'XL', 25),
(30, 'S', 79),
(30, 'M', 36),
(30, 'L', 50),
(30, 'XL', 88),
(31, 'S', 22),
(31, 'M', 69),
(31, 'L', 13),
(31, 'XL', 44),
(32, 'S', 81),
(32, 'M', 40),
(32, 'L', 75),
(32, 'XL', 18),
(33, 'S', 31),
(33, 'M', 95),
(33, 'L', 58),
(33, 'XL', 27),
(34, 'S', 63),
(34, 'M', 16),
(34, 'L', 82),
(34, 'XL', 49),
(35, 'S', 90),
(35, 'M', 34),
(35, 'L', 72),
(35, 'XL', 21),
(36, 'S', 56),
(36, 'M', 87),
(36, 'L', 41),
(36, 'XL', 12),
(37, 'S', 77),
(37, 'M', 24),
(37, 'L', 65),
(37, 'XL', 39),
(38, 'S', 10),
(38, 'M', 52),
(38, 'L', 94),
(38, 'XL', 28),
(39, 'S', 85),
(39, 'M', 43),
(39, 'L', 17),
(39, 'XL', 60),
(40, 'S', 37),
(40, 'M', 99),
(40, 'L', 51),
(40, 'XL', 23),
(41, 'S', 73),
(41, 'M', 14),
(41, 'L', 68),
(41, 'XL', 46),
(42, 'S', 96),
(42, 'M', 30),
(42, 'L', 83),
(42, 'XL', 57),
(43, 'S', 26),
(43, 'M', 71),
(43, 'L', 42),
(43, 'XL', 91),
(44, 'S', 66),
(44, 'M', 35),
(44, 'L', 100),
(44, 'XL', 54),
(45, 'S', 89),
(45, 'M', 20),
(45, 'L', 74),
(45, 'XL', 47),
(46, 'S', 19),
(46, 'M', 62),
(46, 'L', 32),
(46, 'XL', 93),
(47, 'S', 78),
(47, 'M', 45),
(47, 'L', 80),
(47, 'XL', 22),
(48, 'S', 59),
(48, 'M', 98),
(48, 'L', 38),
(48, 'XL', 64),
(49, 'S', 30),
(49, 'M', 86),
(49, 'L', 51),
(49, 'XL', 16),
(50, 'S', 76),
(50, 'M', 27),
(50, 'L', 92),
(50, 'XL', 43),
(51, 'S', 14),
(51, 'M', 69),
(51, 'L', 37),
(51, 'XL', 84),
(52, 'S', 42),
(52, 'M', 79),
(52, 'L', 18),
(52, 'XL', 55);

-- Bảng product_image
INSERT INTO product_images (product_id,url,display_order)
VALUES 
(1, "/images/Women/p_img1.png", 1),
(2, "/images/Men/p_img2_1.png", 1),
(2, "/images/Men/p_img2_2.png", 2),
(2, "/images/Men/p_img2_3.png", 3),
(2, "/images/Men/p_img2_4.png", 4),
(3, "/images/Kids/p_img3.png", 1),
(4, "/images/Men/p_img4.png", 1),
(5, "/images/Women/p_img5.png", 1),
(6, "/images/Kids/p_img6.png", 1),
(7, "/images/Men/p_img7.png", 1),
(8, "/images/Men/p_img8.png", 1),
(9, "/images/Kids/p_img9.png", 1),
(10, "/images/Men/p_img10.png", 1),
(11, "/images/Men/p_img11.png", 1), 
(12, "/images/Men/p_img12.png", 1),
(13, "/images/Women/p_img13.png", 1),
(14, "/images/Kids/p_img14.png", 1),
(15, "/images/Men/p_img15.png", 1),
(16, "/images/Kids/p_img16.png", 1),
(17, "/images/Men/p_img17.png", 1),
(18, "/images/Kids/p_img18.png", 1),
(19, "/images/Kids/p_img19.png", 1),
(20, "/images/Women/p_img20.png", 1),
(21, "/images/Women/p_img21.png", 1),
(22, "/images/Women/p_img22.png", 1),
(23, "/images/Kids/p_img23.png", 1),
(24, "/images/Kids/p_img24.png", 1),
(25, "/images/Kids/p_img25.png", 1),
(26, "/images/Women/p_img26.png", 1),
(27, "/images/Kids/p_img27.png", 1),
(28, "/images/Men/p_img28.png", 1),
(29, "/images/Women/p_img29.png", 1),
(30, "/images/Kids/p_img30.png", 1),
(31, "/images/Men/p_img31.png", 1),
(32, "/images/Men/p_img32.png", 1),
(33, "/images/Kids/p_img33.png", 1),
(34, "/images/Women/p_img34.png", 1),
(35, "/images/Women/p_img35.png", 1),
(36, "/images/Women/p_img36.png", 1),
(37, "/images/Women/p_img37.png", 1),
(38, "/images/Men/p_img38.png", 1),
(39, "/images/Men/p_img39.png", 1),
(40, "/images/Men/p_img40.png", 1),
(41, "/images/Men/p_img41.png", 1),
(42, "/images/Kids/p_img42.png", 1),
(43, "/images/Kids/p_img43.png", 1),
(44, "/images/Women/p_img44.png", 1),
(45, "/images/Men/p_img45.png", 1),
(46, "/images/Men/p_img46.png", 1),
(47, "/images/Kids/p_img47.png", 1),
(48, "/images/Men/p_img48.png", 1),
(49, "/images/Kids/p_img49.png", 1),
(50, "/images/Kids/p_img50.png", 1),
(51, "/images/Women/p_img51.png", 1),
(52, "/images/Men/p_img52.png", 1);

-- Bang roles

INSERT INTO roles (role_name) VALUES ('ADMIN');
INSERT INTO roles (role_name) VALUES ('CUSTOMER');

SELECT*FROM revenue;

UPDATE  revenue
SET income=500000000
WHERE revenue_id=24;
INSERT INTO revenue (revenue_month, revenue_year, income, outcome)
SELECT
    revenue_month,
    revenue_year,
    0 AS income,
    outcome
FROM (
    SELECT 
        MONTH(p.created_at) AS revenue_month,
        YEAR(p.created_at) AS revenue_year,
        0 AS income,
        SUM(p.price * pi.stock_quantity) AS outcome
    FROM products p
    JOIN product_inventory pi ON p.product_id = pi.product_id
    GROUP BY YEAR(p.created_at), MONTH(p.created_at)
) AS newval
ON DUPLICATE KEY UPDATE 
    outcome = newval.outcome;


INSERT INTO expenses (expense_month, expense_year, expense_amount, description)
SELECT
    MONTH(p.created_at) AS expense_month,
    YEAR(p.created_at) AS expense_year,
    SUM(p.price * pi.stock_quantity) AS expense_amount,
    CONCAT('Nhập hàng: ', p.product_name) AS description
FROM products p
JOIN product_inventory pi ON p.product_id = pi.product_id
GROUP BY p.product_id, p.product_name, MONTH(p.created_at), YEAR(p.created_at);


TRUNCATE TABLE expenses;














