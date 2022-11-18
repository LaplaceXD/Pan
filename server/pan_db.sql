CREATE DATABASE IF NOT EXISTS pan_db;

USE pan_db;

CREATE TABLE IF NOT EXISTS `Employee` (
    employee_id	    INT	                        NOT NULL AUTO_INCREMENT,
    first_name	    VARCHAR(300)	            NOT NULL,
    last_name	    VARCHAR(300)	            NOT NULL,
    password	    VARCHAR(280)	            NOT NULL,
    contact_no	    VARCHAR(11)	                NOT NULL,
    email	        VARCHAR(300)	            NOT NULL,
    date_employed	DATE	                    NOT NULL,
    image_src	    VARCHAR(128)	            NOT NULL,
    role	        ENUM('manager', 'employee')	NOT NULL DEFAULT 'employee',	
    is_active	    TINYINT	                    NOT NULL DEFAULT 1,
    CONSTRAINT PK_Employee PRIMARY KEY (employee_id),
    CONSTRAINT UC_Employee_Email UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS `Promo` (
    promo_id	    INT	            NOT NULL AUTO_INCREMENT,	
    promo_code	    VARCHAR(100)	NOT NULL,
    discount	    DECIMAL(5,4)	NOT NULL,	
    date_start	    DATE,
    date_end	    DATE,
    available_count	INT	NOT NULL,
    description	    TEXT,
    CONSTRAINT PK_Promo PRIMARY KEY (promo_id)
);

CREATE TABLE IF NOT EXISTS `Order` (
    order_id	    INT	                            NOT NULL AUTO_INCREMENT,	
    employee_id	    INT	                            NOT NULL,	
    promo_id        INT,
    date_placed	    DATETIME	                    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_completed	DATETIME,
    status	        ENUM('pending', 'completed')	NOT NULL DEFAULT 'pending',
    CONSTRAINT PK_Order PRIMARY KEY (order_id),
    CONSTRAINT FK_Order_Employee FOREIGN KEY (employee_id) REFERENCES Employee(employee_id),
    CONSTRAINT FK_Order_Promo FOREIGN KEY (promo_id) REFERENCES Promo(promo_id)	
);

CREATE TABLE IF NOT EXISTS `Category`	(
    category_id	    INT	            NOT NULL AUTO_INCREMENT,
    name	        VARCHAR(100)	NOT NULL,	
    image_src	    VARCHAR(128)	NOT NULL,	
    is_available	TINYINT	        NOT NULL DEFAULT 1,
    CONSTRAINT PK_Category PRIMARY KEY (category_id)	
);

CREATE TABLE IF NOT EXISTS `Product` (
    product_id	    INT	            NOT NULL AUTO_INCREMENT,	
    category_id	    INT	            NOT NULL,
    creator_id	    INT	            NOT NULL,
    date_created	DATETIME	    NOT NULL DEFAULT CURRENT_TIMESTAMP,	
    name	        VARCHAR(100)	NOT NULL,
    description	    TEXT,
    unit_price	    DECIMAL(7, 2)	NOT NULL,	
    image_src	    VARCHAR(128)	NOT NULL,
    is_available	TINYINT	        NOT NULL DEFAULT 1,
    CONSTRAINT PK_Product PRIMARY KEY (product_id),
    CONSTRAINT FK_Product_Category FOREIGN KEY (category_id) REFERENCES Category(category_id),
    CONSTRAINT FK_Product_Employee FOREIGN KEY (creator_id) REFERENCES Employee(employee_id)    
);

CREATE TABLE IF NOT EXISTS `Order_Line` (
    order_id	    INT	    NOT NULL,	
    product_id  	INT	    NOT NULL,
    quantity	    INT	    NOT NULL,
    notes	        TEXT,
    CONSTRAINT PK_OrderLine PRIMARY KEY (order_id, product_id),
    CONSTRAINT FK_OrderLine_Order FOREIGN KEY (order_id) REFERENCES `Order`(order_id),
    CONSTRAINT FK_OrderLine_Product FOREIGN KEY (product_id) REFERENCES Product(product_id)	
);

CREATE TABLE IF NOT EXISTS `Supplier` (
    supplier_id	    INT	            NOT NULL AUTO_INCREMENT,	
    name            VARCHAR(300)    NOT NULL,
    building	    VARCHAR(150),
    street_no	    VARCHAR(10),	
    street_name	    VARCHAR(150),		
    city	        VARCHAR(150)	NOT NULL,	
    zip_code	    VARCHAR(10)	    NOT NULL,	
    contact_no	    VARCHAR(11)	    NOT NULL,
    email	        VARCHAR(300)	NOT NULL,	
    is_active	    TINYINT	        NOT NULL DEFAULT 1,
    CONSTRAINT PK_Supplier PRIMARY KEY (supplier_id)
);

CREATE TABLE IF NOT EXISTS `Stock` (
    stock_id	    INT	            NOT NULL AUTO_INCREMENT,
    product_id	    INT	            NOT NULL,	
    supplier_id	    INT	            NOT NULL,	
    date_supplied	DATETIME	    NOT NULL,
    quantity	    INT	            NOT NULL DEFAULT 0,	
    unit	        VARCHAR(5)	    NOT NULL,	
    unit_price	    DECIMAL(7, 2)	NOT NULL,	
    notes	        TEXT,
    CONSTRAINT PK_Stock PRIMARY KEY (stock_id),
    CONSTRAINT FK_Stock_Product FOREIGN KEY (product_id) REFERENCES Product(product_id),
    CONSTRAINT FK_Stock_Supplier FOREIGN KEY (supplier_id) REFERENCES Supplier(supplier_id)
);