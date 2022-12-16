CREATE DATABASE IF NOT EXISTS pan_db;

USE pan_db;

CREATE TABLE
    IF NOT EXISTS `Employee` (
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
    IF NOT EXISTS `Order` (
        order_id INT NOT NULL AUTO_INCREMENT,
        employee_id INT NOT NULL,
        date_placed DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT PK_Order PRIMARY KEY (order_id),
        CONSTRAINT FK_Order_Employee FOREIGN KEY (employee_id) REFERENCES Employee (employee_id)
    );

CREATE TABLE
    IF NOT EXISTS `Category` (
        category_id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        image_src VARCHAR(128) NOT NULL DEFAULT '',
        is_available ENUM ('0', '1') NOT NULL DEFAULT '1',
        CONSTRAINT PK_Category PRIMARY KEY (category_id)
    );

CREATE TABLE
    IF NOT EXISTS `Product` (
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
        CONSTRAINT FK_Product_Category FOREIGN KEY (category_id) REFERENCES Category (category_id) ON DELETE SET NULL,
        CONSTRAINT FK_Product_Employee FOREIGN KEY (creator_id) REFERENCES Employee (employee_id)
    );

CREATE TABLE
    IF NOT EXISTS `Order_Line` (
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        notes TEXT,
        CONSTRAINT PK_OrderLine PRIMARY KEY (order_id, product_id),
        CONSTRAINT FK_OrderLine_Order FOREIGN KEY (order_id) REFERENCES `Order` (order_id),
        CONSTRAINT FK_OrderLine_Product FOREIGN KEY (product_id) REFERENCES Product (product_id)
    );

CREATE TABLE
    IF NOT EXISTS `Supplier` (
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
    IF NOT EXISTS `Stock` (
        stock_id INT NOT NULL AUTO_INCREMENT,
        product_id INT NOT NULL,
        supplier_id INT NOT NULL,
        date_supplied DATETIME NOT NULL,
        quantity INT NOT NULL DEFAULT 0,
        unit VARCHAR(5) NOT NULL,
        unit_price DECIMAL(7, 2) NOT NULL,
        notes TEXT,
        CONSTRAINT PK_Stock PRIMARY KEY (stock_id),
        CONSTRAINT FK_Stock_Product FOREIGN KEY (product_id) REFERENCES Product (product_id),
        CONSTRAINT FK_Stock_Supplier FOREIGN KEY (supplier_id) REFERENCES Supplier (supplier_id)
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
    ),
    (
        '2',
        'Cakes',
        '../../images/category/cakes.jpg',
        '1'
    ),
    (
        '3',
        'Pies',
        '../../images/category/pies.jpg',
        '1'
    ),
    (
        '4',
        'Muffins',
        '../../images/category/muffins.jpg',
        '1'
    ),
    (
        '5',
        'Cookies',
        '../../images/category/cookies.jpg',
        '1'
    ),
    (
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
        'superdupersecretpassword',
        '12345678910',
        'jonh.buot@gmail.com',
        CURRENT_DATE(),
        '../../images/employee/jonhbuot.jpg',
        'manager',
        '1'
    ),
    (
        2,
        'Nathan',
        'Arriesgado',
        'superdupersecretpassword',
        '10987654321',
        'nathan.arriesgado@gmail.com',
        CURRENT_DATE(),
        '../../images/employee/nathanarriesgado.jpg',
        'employee',
        '1'
    ),
    (
        3,
        'Erwin',
        'Antepuesto',
        'superdupersecretpassword',
        '11223344556',
        'erwin.antepuesto@gmail.com',
        CURRENT_DATE(),
        '../../images/employee/nathanarriesgado.jpg',
        'employee',
        '1'
    ),
    (
        4,
        'Sherly',
        'Jao',
        'superdupersecretpassword',
        '15263748596',
        'sherly.jao@gmail.com',
        CURRENT_DATE(),
        '../../images/employee/nathanarriesgado.jpg',
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
    ),
    (
        2,
        '1',
        '2',
        current_timestamp(),
        'French Toast',
        'A dish of sliced bread soaked in beaten eggs and often milk or cream, then pan fried.',
        '7.99',
        '../../images/product/frenchtoast.jpg',
        '1'
    ),
    (
        3,
        '3',
        '3',
        current_timestamp(),
        'Raspberry Pie',
        'A type of pie with a raspberry filling',
        '19.99',
        '../../images/product/raspberrypie.jpg',
        '1'
    ),
    (
        4,
        '5',
        '4',
        current_timestamp(),
        'Macademia Nut Cookie',
        'White chocolate cookies with brown sugar, almonds, and macademia nuts.',
        '2.99',
        '../../images/product/macademiacookies.jpg',
        '1'
    );

-- SAMPLE DATA FOR ORDERLINE TABLE -- 
INSERT INTO
    `order_line` (`order_id`, `product_id`, `quantity`, `notes`)
VALUES
    ('1', '4', '4', 'Extra warm'),
    ('2', '1', '2', 'N/A'),
    ('2', '2', '2', 'Less butter'),
    ('3', '3', '1', 'Crispy crust');

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
    ),
    (
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
    ),
    (
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
        '2',
        '2',
        CURRENT_DATE(),
        '50',
        '',
        '49.99',
        'N/A'
    ),
    (
        2,
        '4',
        '3',
        CURRENT_DATE(),
        '30',
        '',
        '99.99',
        'N/A'
    );