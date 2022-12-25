const { InternalServerError } = require("../../helpers/errors");
const { db } = require("../providers");

class Report {
  static defaults = {
    START_DATE: "1970-01-01",
    END_DATE: new Date().toISOString().split("T")[0],
    LIMIT: 5,
  };

  static async productReport(startDate, endDate) {
    const topProducts = await Report.retrieveProductPerformance({
      startDate,
      endDate,
      limit: 5,
      desc: true,
    });
    const bottomProducts = await Report.retrieveProductPerformance({ startDate, endDate, limit: 5 });
    const allProducts = await Report.retrieveProductPerformance({ startDate, endDate });

    const columns = [
      { label: "Product", value: "name"},
      { label: "Quantity Sold", value: "total_sales", format: '###,###,###.# "items"'},
      { label: "Total Revenue", value: "total_revenue", format: '₱###,###,###.00' },
    ];

    return [
      { sheet: "Top Selling Products", columns, content: topProducts },
      { sheet: "Least Selling Products", columns, content: bottomProducts },
      { sheet: "Product Statistucs", columns, content: allProducts },
    ];
  }

  static async employeeReport(startDate, endDate) {
    let content = [];

    try {
      const conn = await db.connect();
      const [data] = await conn.execute(
        `SELECT 
          first_name, 
          last_name, 
          contact_no, 
          email, 
          date_employed, 
          role 
        FROM employee 
        WHERE date_employed BETWEEN :startDate AND :endDate
        ORDER BY date_employed DESC`,
        {
          startDate: startDate || Report.defaults.START_DATE,
          endDate: endDate || Report.defaults.END_DATE,
        }
      );
      await conn.end();
      content = data;
    } catch (err) {
      console.log("[EMPLOYEE QUERY ERROR]", err.message);
      throw new InternalServerError(err);
    }

    return [
      {
        sheet: "Employee List",
        columns: [
          { label: "First Name", value: "first_name"},
          { label: "Last Name", value: "last_name" },
          { label: "Contact Number", value: "contact_no" , format:'"+63"###########'},
          { label: "Email", value: "email" },
          { label: "Date Employed", value: "date_employed", format: "d-mmm-yy" },
          { label: "Role", value: "role" },
        ],
        content,
      },
    ];
  }

  static async inventoryReport(startDate, endDate) {
    let content = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.execute(
        `SELECT 
          p.name AS product_name, 
          s.times_stocked, 
          SUM(ol.quantity) AS quantity_used, 
          s.total_stock - SUM(ol.quantity) AS quantity_unused, 
          SUM(ol.quantity * s.average_price) AS cost_of_goods_sold,
          SUM(ol.quantity * ol.selling_price) AS gross_profit,
          SUM(ol.quantity * ol.selling_price) - s.total_price AS net_profit 
        FROM product p
        LEFT JOIN (SELECT
                    COUNT(product_id) AS times_stocked, 
                    SUM(quantity) AS total_stock,
                    AVG(unit_price) AS average_price,
                    SUM(quantity * unit_price) AS total_price,
                    product_id
                  FROM stock
                  WHERE date_supplied BETWEEN :startDate AND :endDate
                  GROUP BY product_id) s ON s.product_id = p.product_id
        LEFT JOIN order_line ol ON p.product_id = ol.product_id
        GROUP BY p.product_id
        ORDER BY gross_profit DESC, times_stocked DESC, product_name ASC`,
        {
          startDate: startDate || Report.defaults.START_DATE,
          endDate: endDate || Report.defaults.END_DATE,
        }
      );

      await conn.end();
      content = data;
    } catch (err) {
      console.log("[INVENTORY REPORT]", err.message);
      throw new InternalServerError(err);
    }

    return [
      {
        sheet: "Top Selling Products",
        columns: [
          { label: "Product	Name", value: "product_name" },
          { label: "Number of Times Stocked", value: "times_stocked" },
          { label: "Quantity Used", value: "quantity_used", format: '###,###,###.# "items"' },
          { label: "Quantity Unused", value: "quantity_unused", format: '###,###,###.# "items"' },
          { label: "Cost of Goods Sold", value: "cost_of_goods_sold", format: '₱###,###,###.00' },
          { label: "Gross Profit", value: "gross_profit", format: '₱###,###,###.00' },
          { label: "Net Profit", value: "net_profit", format: '₱###,###,###.00' },
        ],
        content,
      },
    ];
  }

  static async retrieveProductPerformance({ startDate, endDate, limit, desc = false }) {
    let retVal = [];

    try {
      const conn = await db.connect();
      const [data] = await conn.execute(
        `SELECT 
          p.name, 
          SUM(ol.quantity) AS total_sales,
          SUM(ol.quantity * ol.selling_price) AS total_revenue 
        FROM product p 
        INNER JOIN order_line ol ON p.product_id = ol.product_id 
        INNER JOIN ${"`order`"} o ON ol.order_id = o.order_id 
        WHERE o.date_placed BETWEEN :startDate AND :endDate 
        GROUP BY p.product_id 
        ORDER BY total_sales ${desc ? "DESC" : "ASC"}
        ${limit ? "LIMIT :limit" : ""}`,
        {
          startDate: startDate || Report.defaults.START_DATE,
          endDate: endDate || Report.defaults.END_DATE,
          limit: limit || Report.defaults.LIMIT,
        }
      );

      await conn.end();

      retVal = data;
    } catch (err) {
      console.log("[PRODUCT PERFORMANCE QUERY ERROR]", err.message);
      throw new InternalServerError(err);
    }

    return retVal;
  }
}

module.exports = Report;
