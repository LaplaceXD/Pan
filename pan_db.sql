CREATE DATABASE IF NOT EXISTS pan_db;

USE pan_db;

CREATE TABLE
    IF NOT EXISTS `employee` (
        employee_id INT NOT NULL AUTO_INCREMENT,
        first_name VARCHAR(300) NOT NULL,
        last_name VARCHAR(300) NOT NULL,
        password VARCHAR(280) NOT NULL,
        contact_no VARCHAR(11) NOT NULL,
        email VARCHAR(300) NOT NULL,
        date_employed DATE NOT NULL,
        role ENUM ('manager', 'employee') NOT NULL DEFAULT 'employee',
        is_active ENUM ('0', '1') NOT NULL DEFAULT '1',
        CONSTRAINT PK_Employee PRIMARY KEY (employee_id),
        CONSTRAINT UC_Employee_Email UNIQUE (email)
    );

CREATE TABLE
    IF NOT EXISTS `order` (
        order_id INT NOT NULL AUTO_INCREMENT,
        employee_id INT NOT NULL,
        date_placed DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT PK_Order PRIMARY KEY (order_id),
        CONSTRAINT FK_Order_Employee FOREIGN KEY (employee_id) REFERENCES employee (employee_id)
    );

CREATE TABLE
    IF NOT EXISTS `category` (
        category_id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        CONSTRAINT PK_Category PRIMARY KEY (category_id)
    );

CREATE TABLE
    IF NOT EXISTS `product` (
        product_id INT NOT NULL AUTO_INCREMENT,
        category_id INT DEFAULT NULL,
        creator_id INT NOT NULL,
        date_created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        unit_price DECIMAL(7, 2) NOT NULL,
        is_available ENUM ('0', '1') NOT NULL DEFAULT '1',
        CONSTRAINT PK_Product PRIMARY KEY (product_id),
        CONSTRAINT FK_Product_Category FOREIGN KEY (category_id) REFERENCES category (category_id) ON DELETE SET NULL,
        CONSTRAINT FK_Product_Employee FOREIGN KEY (creator_id) REFERENCES employee (employee_id)
    );

CREATE TABLE
    IF NOT EXISTS `order_line` (
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        selling_price DECIMAL(7, 2) NOT NULL,
        CONSTRAINT PK_OrderLine PRIMARY KEY (order_id, product_id),
        CONSTRAINT FK_OrderLine_Order FOREIGN KEY (order_id) REFERENCES `order` (order_id) ON DELETE CASCADE,
        CONSTRAINT FK_OrderLine_Product FOREIGN KEY (product_id) REFERENCES product (product_id)
    );

CREATE TABLE
    IF NOT EXISTS `supplier` (
        supplier_id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(300) NOT NULL,
        building VARCHAR(150),
        street_no VARCHAR(10),
        street_name VARCHAR(150),
        city VARCHAR(150) NOT NULL,
        zip_code VARCHAR(10) NOT NULL,
        contact_no VARCHAR(11) NOT NULL,
        email VARCHAR(300) NOT NULL,
        is_active ENUM ('0', '1') NOT NULL DEFAULT '1',
        CONSTRAINT PK_Supplier PRIMARY KEY (supplier_id)
    );

CREATE TABLE
    IF NOT EXISTS `stock` (
        stock_id INT NOT NULL AUTO_INCREMENT,
        product_id INT NOT NULL,
        supplier_id INT NOT NULL,
        date_supplied DATE NOT NULL,
        quantity INT NOT NULL DEFAULT 0,
        unit VARCHAR(5) NOT NULL,
        unit_price DECIMAL(7, 2) NOT NULL,
        notes TEXT,
        CONSTRAINT PK_Stock PRIMARY KEY (stock_id),
        CONSTRAINT FK_Stock_Product FOREIGN KEY (product_id) REFERENCES product (product_id),
        CONSTRAINT FK_Stock_Supplier FOREIGN KEY (supplier_id) REFERENCES supplier (supplier_id)
    );

-- SAMPLE DATA FOR CATEGORY TABLE -- 
INSERT INTO
    `category` (
        `category_id`,
        `name`
    )
VALUES
    (
        '1',
        'Bread'
    ), (
        '2',
        'Cakes'
    ), (
        '3',
        'Pies'
    ), (
        '4',
        'Muffins'
    ), (
        '5',
        'Cookies'
    ), (
        '6',
        'Doughnuts'
    );

-- SAMPLE DATA FOR EMPLOYEE TABLE -- 
INSERT INTO
    `employee` (
        `employee_id`,
        `first_name`,
        `last_name`,
        `password`,
        `contact_no`,
        `email`,
        `date_employed`,
        `role`,
        `is_active`
    )
VALUES
    (
        1,
        'Jonh',
        'Buot',
        '$2b$10$qcPZ9U16R5ynxV4kyQ1RAekhPqAtrM6qKhSH0OMFTsMCXbP54WVcS',
        '09345678910',
        'jonh.buot@gmail.com',
        CURRENT_DATE(),
        'manager',
        '1'
    ), (
        2,
        'Nathan',
        'Arriesgado',
        '$2b$10$aFfQ6N.gAMrH/fOUPnrSyeVzeIiTyOCrcJu3Pz0ttoJm0j/ZYKEWe',
        '09987654321',
        'nathan.arriesgado@gmail.com',
        CURRENT_DATE(),
        'employee',
        '1'
    ), (
        3,
        'Erwin',
        'Antepuesto',
        '$2b$10$aFfQ6N.gAMrH/fOUPnrSyeVzeIiTyOCrcJu3Pz0ttoJm0j/ZYKEWe',
        '09223344556',
        'erwin.antepuesto@gmail.com',
        CURRENT_DATE(),
        'employee',
        '1'
    ), (
        4,
        'Sherly',
        'Jao',
        '$2b$10$aFfQ6N.gAMrH/fOUPnrSyeVzeIiTyOCrcJu3Pz0ttoJm0j/ZYKEWe',
        '09263748596',
        'sherly.jao@gmail.com',
        CURRENT_DATE(),
        'employee',
        '1'
    ), (
        5,
        'Manager',
        'User',
        '$2b$10$qcPZ9U16R5ynxV4kyQ1RAekhPqAtrM6qKhSH0OMFTsMCXbP54WVcS',
        '09823782938',
        'manager@pan.com',
        CURRENT_DATE(),
        'manager',
        '1'
    ), (
        6,
        'Employee',
        'User',
        '$2b$10$aFfQ6N.gAMrH/fOUPnrSyeVzeIiTyOCrcJu3Pz0ttoJm0j/ZYKEWe',
        '09278197382',
        'employee@pan.com',
        CURRENT_DATE(),
        'employee',
        '1'
    );

-- SAMPLE DATA FOR ORDER TABLE -- 
INSERT INTO
    `order` (`employee_id`, `date_placed`)
VALUES
    ('4', '2022-12-26'),
    ('3', '2022-12-30'),
    ('3', '2022-12-30'),
    ('2', '2022-12-31'),
    ('1', '2023-1-2'),
    ('4', '2023-1-4'),
    ('3', '2023-1-6'),
    ('1', '2023-1-9'),
    ('2', '2023-1-17'),
    ('2', '2023-1-17'),
    ('4', '2023-1-29'),
    ('4', '2023-1-29'),
    ('4', '2023-1-30'),
    ('4', '2023-1-30'),
    ('2', '2023-2-4'),
    ('1', '2023-2-8'),
    ('1', '2023-2-8'),
    ('3', '2023-2-9'),
    ('3', '2023-2-12'),
    ('3', '2023-2-12'),
    ('3', '2023-2-26'),
    ('2', '2023-3-4'),
    ('1', '2023-3-4'),
    ('1', '2023-3-18'),
    ('1', '2023-3-18'),
    ('4', '2023-3-19'),
    ('3', '2023-3-27'),
    ('1', '2023-3-30'),
    ('1', '2023-3-30'),
    ('1', '2023-4-1'),
    ('1', '2023-4-1'),
    ('2', '2023-4-10'),
    ('2', '2023-4-10');

-- SAMPLE DATA FOR PRODUCT TABLE --
INSERT INTO
    `product` (
        `product_id`,
        `category_id`,
        `creator_id`,
        `date_created`,
        `name`,
        `description`,
        `unit_price`,
        `is_available`
    )
VALUES
    (
        1,
        '1',
        '2',
        current_timestamp(),
        'Pain au Chocolat',
        'Almost like a crispy, buttery, airy, and simply irresistibly delicious French Croissant, but filled with chocolate!',
        '9.99',
        '0'
    ), (
        2,
        '1',
        '2',
        current_timestamp(),
        'French Toast',
        'A dish of sliced bread soaked in beaten eggs and often milk or cream, then pan fried.',
        '7.99',
        '1'
    ), (
        3,
        '3',
        '3',
        current_timestamp(),
        'Raspberry Pie',
        'A type of pie with a raspberry filling',
        '19.99',
        '0'
    ), (
        4,
        '5',
        '4',
        current_timestamp(),
        'Macademia Nut Cookie',
        'White chocolate cookies with brown sugar, almonds, and macademia nuts.',
        '2.99',
        '1'
    ), (
        5,
        '2',
        '3',
        current_timestamp(),
        'Cheese Cake',
        'Soft spongy yellow goodness in a box.',
        '49.99',
        '1'
    ), (
        6,
        '2',
        '1',
        current_timestamp(),
        'Chocolate Cake',
        'A classic delight with an incredibly filling belgian chocolate center!',
        '49.99',
        '1'
    ), (
        7,
        '4',
        '4',
        current_timestamp(),
        'Chocolate Chip Muffin',
        'Light and Fluffy, the right texture, and all the right taste. Packed into a simple and elegant design!',
        '14.99',
        '1'
    ), (
        8,
        '6',
        '5',
        current_timestamp(),
        'Glazed Doughnuts',
        'Classic golden baked doughnuts covered in sweet glaze for your satisfaction.',
        '8.99',
        '0'
    ), ( 
        9,
        NULL,
        '2',
        current_timestamp(),
        'Snowy Surprise',
        'A mysterious treat prepared by our employees. Available only in Christmas season.',
        '19.99',
        '1'
    );

-- SAMPLE DATA FOR ORDERLINE TABLE -- 
-- SAMPLE DATA FOR ORDERLINE TABLE -- 
INSERT INTO
    `order_line` (`order_id`, `product_id`, `quantity`, `selling_price`)
VALUES
    ('1', '1', '4', '39.96'),
    ('1', '9', '2', '39.98'),
    ('2', '5', '2', '99.98'),
    ('3', '7', '1', '14.99'),
    ('3', '9', '2', '39.98'),
    ('3', '1', '2', '19.98'),
    ('4', '9', '1', '19.99'),
    ('5', '4', '6', '17.94'),
    ('6', '5', '1', '49.99'),
    ('7', '5', '2', '99.98'),
    ('7', '6', '1', '49.99'),
    ('8', '1', '1', '9.99'),
    ('9', '1', '4', '39.96'),
    ('10', '2', '2', '15.98'),
    ('11', '2', '1', '7.99'),
    ('11', '3', '2', '39.98'),
    ('12', '4', '4', '11.96'),
    ('13', '7', '2', '29.98'),
    ('14', '1', '2', '19.98'),
    ('15', '1', '8', '79.92'),
    ('16', '6', '1', '49.99'),
    ('17', '8', '2', '53.94'),
    ('18', '8', '12', '107.88'),
    ('19', '8', '2', '17.98'),
    ('20', '4', '1', '2.99'),
    ('21', '6', '2', '99.98'),
    ('22', '2', '1', '31.96'),
    ('23', '5', '1', '49.99'),
    ('24', '5', '1', '49.99'),
    ('24', '6', '2', '99.98'),
    ('25', '1', '2', '19.98'),
    ('25', '3', '1', '19.99');

-- SAMPLE DATA FOR SUPPLIER TABLE --
INSERT INTO
    `supplier` (
        `supplier_id`,
        `name`,
        `building`,
        `street_no`,
        `street_name`,
        `city`,
        `zip_code`,
        `contact_no`,
        `email`,
        `is_active`
    )
VALUES
    (
        1,
        'Wheat and Goods Co.',
        'Quarry House',
        '42',
        'Main Road',
        'Manila City',
        '1000',
        '83726192874',
        'wheatandgoodsco@gmail.com',
        '1'
    ), (
        2,
        'Bread Express',
        'Daytona Apartment',
        '21',
        'Half Street',
        'Lapu-Lapu City',
        '6015',
        '18572940192',
        'breadexpress@gmail.com',
        '1'
    ), (
        3,
        'House of Sweets',
        'Bunzel',
        '69',
        'Park Road',
        'Quezon City',
        '1008',
        '02938746172',
        'houseofsweets@gmail.com',
        '1'
    );

-- SAMPLE DATA FOR STOCK TABLE -- 
INSERT INTO
    `stock` (
        `stock_id`,
        `product_id`,
        `supplier_id`,
        `date_supplied`,
        `quantity`,
        `unit`,
        `unit_price`,
        `notes`
    )
VALUES
    (
        1,
        '1',
        '2',
        CURRENT_DATE(),
        '10',
        'pcs',
        '49.95',
        'N/A'
    ), (
        2,
        '2',
        '1',
        CURRENT_DATE(),
        '10',
        'pcs',
        '79.90',
        'N/A'
    ), (
        3,
        '3',
        '1',
        CURRENT_DATE(),
        '20',
        'pcs',
        '19.99',
        'N/A'
    ), (
        4,
        '4',
        '3',
        CURRENT_DATE(),
        '3',
        'pcs',
        '149.50',
        'N/A'
    );