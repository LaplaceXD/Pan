const Joi = require("joi");
let xlsx = require("json-as-xlsx")

const { InternalServerError } = require("../../helpers/errors");

const { db } = require("../providers");
const { availability } = require("../constants/product");

const Category = require("../models/categories.model");

class Report{

  static async productReport(startDate, endDate){

    let query1 = null;
    let query2 = null;
    let query3 = null;
    //3 queries for top selling, least selling, all product info

    try {
      const conn = await db.connect();
      const [data] = await conn.execute(
        `SELECT p.name, SUM(ol.quantity) AS total_sales, SUM(ol.quantity * p.unit_price) AS total_revenue 
        FROM product p 
        JOIN order_line ol ON p.product_id = ol.product_id 
        JOIN ${'`order`'} o ON ol.order_id = o.order_id 
        WHERE o.date_placed BETWEEN :startDate AND :endDate 
        GROUP BY p.product_id 
        ORDER BY total_sales 
        DESC LIMIT 5;`, 
        { startDate, endDate }
      );
      
      await conn.end();

      query1 = data;
    } catch (err) {
      console.log("[TOP SELLING PRODUCT QUERY ERROR]", err.message);
      throw new InternalServerError(err);
    }

    try {
      const conn = await db.connect();
      const [data] = await conn.execute(
        `SELECT p.name, SUM(ol.quantity) AS total_sales, SUM(ol.quantity * p.unit_price) AS total_revenue 
        FROM product p 
        JOIN order_line ol ON p.product_id = ol.product_id 
        JOIN ${'`order`'} o ON ol.order_id = o.order_id 
        WHERE o.date_placed BETWEEN :startDate AND :endDate 
        GROUP BY p.product_id 
        ORDER BY total_sales 
        ASC LIMIT 5;`, 
        { startDate, endDate }
      );
      await conn.end();

      query2 = data;
    } catch (err) {
      console.log("[LEAST SELLING PRODUCT QUERY ERROR]", err.message);
      throw new InternalServerError(err);
    }

    try {
      const conn = await db.connect();
      const [data] = await conn.execute("SELECT p.name, SUM(ol.quantity) AS total_sales, SUM(ol.quantity * p.unit_price) AS total_revenue FROM product p JOIN order_line ol ON p.product_id = ol.product_id JOIN `order` o ON ol.order_id = o.order_id GROUP BY p.product_id ORDER BY total_sales DESC;");
      await conn.end();

      query3 = data;
      console.log(query3);
    } catch (err) {
      console.log("[ALL PRODUCT QUERY ERROR]", err.message);
      throw new InternalServerError(err);
    }

    let data = [
      {
        sheet: "Top Selling Products",
        columns: [
          { label: "Product", value: "name" }, 
          { label: "Quantity Sold", value: "total_sales" }, 
          { label: "Total Revenue", value: "total_revenue" },
        ],
        content: query1
      },
      {
        sheet: "Least Selling Products",
        columns: [
          { label: "Product", value: "name" }, 
          { label: "Quantity Sold", value: "total_sales" }, 
          { label: "Total Revenue", value: "total_revenue" }, 
        ],
        content: query2
      },
      {
        sheet: "Products Statistics",
        columns: [
          { label: "Product", value: "name" },
          { label: "Quantity Sold", value: "total_sales" }, 
          { label: "Total Revenue", value: "total_revenue" },
        ],
        content: query3
      },
    ]
    
    const settings = {
      writeOptions: {
        type: "buffer",
        bookType: "xlsx",
      },
    }


    return xlsx(data, settings);
  }
  static async emplyReport(){

    let query1 = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.execute("SELECT first_name, last_name, contact_no, email, date_employed, role FROM employee");
      
      await conn.end();

      query1 = data;
    } catch (err) {
      console.log("[EMPLOYEE FETCH ERROR]", err.message);
      throw new InternalServerError(err);
    }

    let data = [
      {
        sheet: "Employee List",
        columns: [
          { label: "First Name", value: "first_name" }, 
          { label: "Last Name", value: "last_name" }, 
          { label: "Contact Number", value: "contact_no" },
          { label: "Email", value: "email" }, 
          { label: "Date Employed", value: "date_employed" },
          { label: "Role", value: "role" },
        ],
        content: query1
      }
    ]
    
    const settings = {
      writeOptions: {
        type: "buffer",
        bookType: "xlsx",
      },
    }
    return xlsx(data, settings);
  }
  static async inventoryReport(){

    let query1 = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.execute(
        `SELECT product.name AS product_name, 
        COUNT(stock.product_id) AS times_stocked, 
        SUM(order_line.quantity) AS quantity_used, 
        SUM(stock.quantity) - SUM(order_line.quantity) AS quantity_unused, 
        SUM(order_line.quantity * stock.unit_price) AS cost_of_goods_sold, 
        SUM(order_line.quantity * order_line.selling_price) - SUM(order_line.quantity * stock.unit_price) AS gross_profit 
        FROM product 
        JOIN stock ON product.product_id = stock.product_id 
        JOIN order_line ON product.product_id = order_line.product_id 
        GROUP BY product.product_id, product.name;`
      );
      
      await conn.end();

      query1 = data;
    } catch (err) {
      console.log("[INVENTORY REPORT]", err.message);
      throw new InternalServerError(err);
    }


    let data = [
      {
        sheet: "Top Selling Products",
        columns: [
          { label: "Product	Name", value: "product_name" }, 
          { label: "Number of Times Stocked", value: "times_stocked" }, 
          { label: "Quantity Used", value: "quantity_used" },
          { label: "Quantity Unused", value: "quantity_unused" }, 
          { label: "Cost of Goods Sold", value: "cost_of_goods_sold" }, 
          { label: "Gross Profit", value: "gross_profit" },
        ],
        content: query1
      },
    ]
    
    const settings = {
      writeOptions: {
        type: "buffer",
        bookType: "xlsx",
      },
    }


    return xlsx(data, settings);
  }
}

module.exports = Report;
