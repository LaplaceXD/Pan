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
        image_src VARCHAR(128) NOT NULL DEFAULT '',
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
        image_src VARCHAR(128) NOT NULL DEFAULT '',
        is_available ENUM ('0', '1') NOT NULL DEFAULT '1',
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
        image_src VARCHAR(128) NOT NULL DEFAULT '',
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
        `name`,
        `image_src`,
        `is_available`
    )
VALUES
    (
        '1',
        'Bread',
        '../../images/category/bread.jpg',
        '1'
    ), (
        '2',
        'Cakes',
        '../../images/category/cakes.jpg',
        '1'
    ), (
        '3',
        'Pies',
        '../../images/category/pies.jpg',
        '1'
    ), (
        '4',
        'Muffins',
        '../../images/category/muffins.jpg',
        '1'
    ), (
        '5',
        'Cookies',
        '../../images/category/cookies.jpg',
        '1'
    ), (
        '6',
        'Doughnuts',
        '../../images/category/doughnuts.jpg',
        '1'
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
        `image_src`,
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
        '../../images/employee/jonhbuot.jpg',
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
        '../../images/employee/nathanarriesgado.jpg',
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
        '../../images/employee/nathanarriesgado.jpg',
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
        '../../images/employee/nathanarriesgado.jpg',
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
        '',
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
        '',
        'employee',
        '1'
    );

-- SAMPLE DATA FOR ORDER TABLE -- 
INSERT INTO
    `order` (`order_id`, `employee_id`, `date_placed`)
VALUES
    (1, '2', current_timestamp()),
    (2, '3', current_timestamp()),
    (3, '4', current_timestamp());

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
        `image_src`,
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
        '../../images/product/painauchocolat.jpg',
        '1'
    ), (
        2,
        '1',
        '2',
        current_timestamp(),
        'French Toast',
        'A dish of sliced bread soaked in beaten eggs and often milk or cream, then pan fried.',
        '7.99',
        '../../images/product/frenchtoast.jpg',
        '1'
    ), (
        3,
        '3',
        '3',
        current_timestamp(),
        'Raspberry Pie',
        'A type of pie with a raspberry filling',
        '19.99',
        '../../images/product/raspberrypie.jpg',
        '1'
    ), (
        4,
        '5',
        '4',
        current_timestamp(),
        'Macademia Nut Cookie',
        'White chocolate cookies with brown sugar, almonds, and macademia nuts.',
        '2.99',
        '../../images/product/macademiacookie.jpg',
        '1'
    );

-- SAMPLE DATA FOR ORDERLINE TABLE -- 
INSERT INTO
    `order_line` (`order_id`, `product_id`, `quantity`, `selling_price`)
VALUES
    ('1', '4', '4', '2.99'),
    ('2', '1', '2', '9.99'),
    ('2', '2', '2', '7.99'),
    ('3', '3', '1', '19.99');

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