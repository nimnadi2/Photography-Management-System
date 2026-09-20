-- Photography Management System
-- Database schema for Laragon (MySQL)

CREATE DATABASE IF NOT EXISTS photography_mgmt CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE photography_mgmt;

-- ---------------------------------------------------------
-- Users (photographers / studio staff who log in to the admin)
-- ---------------------------------------------------------
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','photographer') NOT NULL DEFAULT 'photographer',
    avatar VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Auth sessions (simple bearer-token auth, no external libs needed)
-- ---------------------------------------------------------
CREATE TABLE sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Clients
-- ---------------------------------------------------------
CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) DEFAULT NULL,
    phone VARCHAR(40) DEFAULT NULL,
    address VARCHAR(255) DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Packages (pricing plans offered by the studio)
-- ---------------------------------------------------------
CREATE TABLE packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    description TEXT DEFAULT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    duration_hours DECIMAL(4,1) NOT NULL DEFAULT 1,
    photo_count INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Bookings (photo shoots / sessions / events)
-- ---------------------------------------------------------
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    package_id INT DEFAULT NULL,
    title VARCHAR(150) NOT NULL,
    shoot_type VARCHAR(80) DEFAULT NULL,
    event_date DATETIME NOT NULL,
    location VARCHAR(255) DEFAULT NULL,
    status ENUM('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
    amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Galleries (one per booking, holds delivered photos)
-- ---------------------------------------------------------
CREATE TABLE galleries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    is_public TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE gallery_photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gallery_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) DEFAULT NULL,
    is_cover TINYINT(1) NOT NULL DEFAULT 0,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (gallery_id) REFERENCES galleries(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Invoices
-- ---------------------------------------------------------
CREATE TABLE invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    invoice_number VARCHAR(40) NOT NULL UNIQUE,
    amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    status ENUM('unpaid','paid','overdue') NOT NULL DEFAULT 'unpaid',
    issued_date DATE NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Seed data
-- ---------------------------------------------------------

-- Default admin login -> email: admin@studio.com / password: admin123
INSERT INTO users (name, email, password, role) VALUES
('Studio Admin', 'admin@studio.com', '$2b$10$hgjyGhoGVJtIS41FbQzNhOhXVd5BdwJ0U2oGLX0yp.YREm4.qlqHe', 'admin');

INSERT INTO packages (name, description, price, duration_hours, photo_count) VALUES
('Portrait Essential', 'A relaxed one-hour portrait session, perfect for headshots and personal branding.', 15000.00, 1, 20),
('Wedding Signature', 'Full day wedding coverage including ceremony, reception and a curated highlight gallery.', 150000.00, 8, 400),
('Event Coverage', 'Coverage for corporate events, parties and gatherings with same-week delivery.', 45000.00, 4, 150),
('Product & Brand', 'Studio product photography for e-commerce and marketing campaigns.', 25000.00, 2, 40);

INSERT INTO clients (name, email, phone, address) VALUES
('Nimali Perera', 'nimali.perera@example.com', '+94 71 234 5678', '24 Galle Road, Colombo 03'),
('Kasun Fernando', 'kasun.f@example.com', '+94 77 987 6543', '11 Lake Drive, Kandy'),
('Studio Vera (Pvt) Ltd', 'hello@studiovera.lk', '+94 11 456 7890', '5 Marine Parade, Negombo');

INSERT INTO bookings (client_id, package_id, title, shoot_type, event_date, location, status, amount, notes) VALUES
(1, 1, 'Nimali - Personal Branding Shoot', 'Portrait', DATE_ADD(NOW(), INTERVAL 5 DAY), 'Studio A, Colombo', 'confirmed', 15000.00, 'Bring 3 outfit changes.'),
(2, 2, 'Kasun & Amaya Wedding', 'Wedding', DATE_ADD(NOW(), INTERVAL 20 DAY), 'Cinnamon Grand, Colombo', 'pending', 150000.00, 'Second shooter required.'),
(3, 3, 'Studio Vera Product Launch', 'Event', DATE_SUB(NOW(), INTERVAL 4 DAY), 'Negombo Beach Hotel', 'completed', 45000.00, 'Delivered via online gallery.');

INSERT INTO galleries (booking_id, title, is_public) VALUES
(3, 'Studio Vera Product Launch - Highlights', 1);

INSERT INTO invoices (booking_id, invoice_number, amount, status, issued_date, due_date, paid_date) VALUES
(3, 'INV-2026-0001', 45000.00, 'paid', CURDATE(), CURDATE(), CURDATE()),
(1, 'INV-2026-0002', 15000.00, 'unpaid', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY), NULL);