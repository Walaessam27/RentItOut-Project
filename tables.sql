-- user table 
-- id (primary key)
-- name 
-- phone-num
-- address city/street
-- rating (average score)
-- passward
-- visa num


-- item table 
-- name
-- description
-- id (primary key)
-- price 
-- availability 
-- rating
-- category
-- location
-- owner id (foreign key from user table)
-- quantity


-- rental table 
-- rental id (primary key)
-- item id (foreign key from item table)
-- renter id (foreign key from user table)
-- owner id (foreign key from user table)
-- total price 
-- quantity 
-- date from 
-- date to 
-- location
-- state (arrived, pending etc)


-- payment table
-- id (primary key)
-- rental id (foreign key from the rental table)
-- renter id (foreign key from rental table which is on the same row with the rental id which was added above)
-- payment method




CREATE TABLE users ( 
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone_num VARCHAR(15) NOT NULL,
    address VARCHAR(255) NOT NULL,
    rating DECIMAL(2, 1),
    password VARCHAR(255) NOT NULL,
    visa_num VARCHAR(16) NOT NULL,
    email VARCHAR(100) NOT NULL DEFAULT 'no-email@example.com'
);


INSERT INTO users (name, phone_num, address, rating, password, visa_num) VALUES
('Walaa', '123-456-7890', '123 Main St, Cityville', 4.5, 'password123', '4111111111111111'),
('Sami', '234-567-8901', '456 Oak St, Townville', 4.2, 'password234', '4222222222222222'),
('Qamar', '345-678-9012', '789 Pine St, Villageville', 4.8, 'password345', '4333333333333333'),
('Hiba', '456-789-0123', '321 Maple St, Hamletville', 3.9, 'password456', '4444444444444444'),
('Eva', '567-890-1234', '654 Birch St, Hamletville', 4.7, 'password567', '4555555555555555'),
('Tala', '678-901-2345', '987 Cedar St, Suburbia', 4.1, 'password678', '4666666666666666'),
('Khaled', '789-012-3456', '321 Spruce St, Metropolis', 4.4, 'password789', '4777777777777777'),
('Haya', '890-123-4567', '654 Aspen St, Ruralville', 3.7, 'password890', '4888888888888888'),
('Omar', '901-234-5678', '987 Fir St, Urbantown', 4.3, 'password901', '4999999999999999'),
('Hala', '012-345-6789', '123 Sycamore St, Countryside', 4.6, 'password012', '4000000000000000');


CREATE TABLE item (
    item_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    availability BOOLEAN DEFAULT TRUE,
    rating DECIMAL(2, 1),
    category VARCHAR(50),
    location VARCHAR(255),
    owner_id INT REFERENCES users(user_id), 
    quantity INT NOT NULL
);


INSERT INTO item (name, description, price, availability, rating, category, location, owner_id, quantity) VALUES
('Electric Drill', 'A powerful cordless drill', 49.99, TRUE, 4.5, 'Tools', '123 Main St, Cityville', 1, 5),
('Mountain Bike', 'A sturdy bike for off-road adventures', 150.00, TRUE, 4.7, 'Outdoor', '456 Oak St, Townville', 2, 2),
('Tent', 'A 2-person tent perfect for camping', 75.00, TRUE, 4.6, 'Outdoor', '789 Pine St, Villageville', 3, 3),
('Ladder', 'An extendable ladder for home use', 35.00, TRUE, 4.3, 'Tools', '321 Maple St, Hamletville', 4, 1),
('Projector', 'A 1080p projector for home cinema', 200.00, TRUE, 4.9, 'Electronics', '654 Birch St, Hamletville', 5, 4),
('Camera', 'A DSLR camera for photography', 300.00, TRUE, 4.8, 'Electronics', '987 Cedar St, Suburbia', 6, 2),
('Chainsaw', 'A high-powered chainsaw for heavy duty', 100.00, TRUE, 4.2, 'Tools', '321 Spruce St, Metropolis', 7, 1),
('Kayak', 'A lightweight kayak for lakes and rivers', 125.00, TRUE, 4.4, 'Outdoor', '654 Aspen St, Ruralville', 8, 1),
('Laptop', 'A high-performance laptop for work and play', 500.00, TRUE, 4.8, 'Electronics', '987 Fir St, Urbantown', 9, 3),
('Lawnmower', 'A push lawnmower for small lawns', 60.00, TRUE, 4.1, 'Tools', '123 Sycamore St, Countryside', 10, 1);

CREATE TABLE rental (
    rental_id SERIAL PRIMARY KEY,
    item_id INT REFERENCES item(item_id),
    renter_id INT REFERENCES users(user_id), 
    owner_id INT REFERENCES users(user_id), 
    total_price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    date_from DATE NOT NULL,
    date_to DATE NOT NULL,
    location VARCHAR(255),
    state VARCHAR(50) NOT NULL
);


INSERT INTO rental (item_id, renter_id, owner_id, total_price, quantity, date_from, date_to, location, state) VALUES
(1, 2, 1, 99.98, 2, '2024-09-10', '2024-09-12', '123 Main St, Cityville', 'active'),
(2, 3, 2, 150.00, 1, '2024-09-15', '2024-09-17', '456 Oak St, Townville', 'active'),
(3, 4, 3, 75.00, 1, '2024-09-18', '2024-09-20', '789 Pine St, Villageville', 'active'),
(4, 5, 4, 35.00, 1, '2024-09-22', '2024-09-24', '321 Maple St, Hamletville', 'completed'),
(5, 6, 5, 200.00, 1, '2024-09-25', '2024-09-27', '654 Birch St, Hamletville', 'completed'),
(6, 7, 6, 600.00, 2, '2024-09-28', '2024-09-30', '987 Cedar St, Suburbia', 'cancelled'),
(7, 8, 7, 100.00, 1, '2024-10-01', '2024-10-03', '321 Spruce St, Metropolis', 'completed'),
(8, 9, 8, 125.00, 1, '2024-10-04', '2024-10-06', '654 Aspen St, Ruralville', 'active'),
(9, 10, 9, 1500.00, 3, '2024-10-07', '2024-10-09', '987 Fir St, Urbantown', 'completed'),
(10, 1, 10, 60.00, 1, '2024-10-10', '2024-10-12', '123 Sycamore St, Countryside', 'active');


CREATE TABLE payment (
    payment_id SERIAL PRIMARY KEY,
    rental_id INT REFERENCES rental(rental_id),
    renter_id INT REFERENCES users(user_id), 
    payment_method VARCHAR(50) NOT NULL
);



INSERT INTO payment (rental_id, renter_id, payment_method) VALUES
(1, 2, 'Visa'),
(2, 3, 'Mastercard'),
(3, 4, 'PayPal'),
(4, 5, 'Visa'),
(5, 6, 'PayPal'),
(6, 7, 'Mastercard'),
(7, 8, 'Visa'),
(8, 9, 'PayPal'),
(9, 10, 'Visa'),
(10, 1, 'Mastercard');
