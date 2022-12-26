const { InternalServerError } = require("../../helpers/errors");
const { db } = require("../providers");

class Report {
  static defaults = {
    START_DATE: "1970-01-01",
    END_DATE: new Date().toISOString().split("T")[0],
  };

  // Only retrieves products that were orders within the start date and end date
  static async getSalesReportData(startDate, endDate) {
    const topProducts = await Report.retrieveProductPerformance({
      startDate,
      endDate,
      limit: 5,
      desc: true,
    });
    const bottomProducts = await Report.retrieveProductPerformance({ startDate, endDate, limit: 5 });
    const allProducts = await Report.retrieveProductPerformance({ startDate, endDate, desc: true });

    const columns = [
      { label: "Product", value: "name" },
      { label: "Quantity Sold", value: "total_sales", format: '###,###,###.# "items"' },
      { label: "Total Revenue", value: "total_revenue", format: "₱###,###,###.00" },
    ];

    return [
      { sheet: "Top 5 Selling Products", columns, content: topProducts },
      { sheet: "Least 5 Selling Products", columns, content: bottomProducts },
      { sheet: "Product Statistics", columns, content: allProducts },
    ];
  }

  static async getEmployeeReportData() {
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
          role,
          CASE WHEN is_active = '1' THEN 'ACTIVE' ELSE 'INACTIVE' END AS status
        FROM employee 
        ORDER BY date_employed DESC`
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
          { label: "First Name", value: "first_name" },
          { label: "Last Name", value: "last_name" },
          { label: "Contact Number", value: "contact_no", format: '"+63"###########' },
          { label: "Email", value: "email" },
          { label: "Date Employed", value: "date_employed", format: "d-mmm-yy" },
          { label: "Role", value: "role" },
          { label: "Status", value: "status" },
        ],
        content,
      },
    ];
  }

  static async getInventoryReportData(startDate, endDate) {
    const content = await Report.retrieveInventory({ startDate, endDate });

    return [
      {
        sheet: "Monthly Inventory",
        columns: [
          { label: "Product	Name", value: "product_name" },
          { label: "Status", value: "status" },
          { label: "Beginning Inventory (Qty)", value: "beginning_inventory" },
          {
            label: "Beginning Inventory (Avg Price)",
            value: "avg_price_of_beginning_inventory",
            format: "₱###,###,###.##",
          },
          { label: "Stock In (Qty)", value: "purchases" },
          {
            label: "Stock In (Avg Price)",
            value: "avg_price_of_purchases",
            format: "₱###,###,###.##",
          },
          { label: "Goods Sold (Qty)", value: "number_of_goods_sold" },
          {
            label: "Goods Sold (Avg Price)",
            value: "avg_price_of_goods_sold",
            format: "₱###,###,###.##",
          },
          { label: "Ending Inventory (Qty)", value: "ending_inventory" },
          {
            label: "Ending Inventory (Avg Price)",
            value: "avg_price_of_ending_inventory",
            format: "₱###,###,###.##",
          },
          { label: "Cost of Goods Sold", value: "cost_of_goods_sold", format: "₱###,###,###.00" },
          { label: "Total Sold", value: "total_sold", format: "₱###,###,###.00" },
          { label: "Gross Profit", value: "gross_profit", format: "₱###,###,###.00" },
        ],
        content,
      },
    ];
  }

  static async retrieveInventory({ startDate, endDate }) {
    let retVal = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.execute(
        `SELECT
          p.name AS product_name,
          CASE WHEN p.is_available = '1' THEN 'Shown' ELSE 'Hidden' END AS status,
          
          -- Beginning Inventory, which is the ending inventory of the previous month
          COALESCE(prev_inv.ending_inventory, 0) AS beginning_inventory,
          CAST(ROUND(COALESCE(prev_inv.avg_price_of_ending_inventory, 0), 2) AS DECIMAL(10,2)) AS avg_price_of_beginning_inventory,
          
          -- Stock purchased for this month
          COALESCE(s.purchases, 0) AS purchases,
          CAST(ROUND(COALESCE(s.avg_price_of_purchases, 0), 2) AS DECIMAL(10,2)) AS avg_price_of_purchases,
          
          -- Number of Goods Sold
          COALESCE(ol.number_of_goods_sold, 0) AS number_of_goods_sold,
          CAST(ROUND(COALESCE(ol.avg_price_of_goods_sold, 0), 2) AS DECIMAL(10,2)) AS avg_price_of_goods_sold,
          
          -- Ending inventory which is beginning inventory + purchased stock this month - number of goods sold
          COALESCE(prev_inv.ending_inventory, 0) + COALESCE(purchases, 0) - COALESCE(number_of_goods_sold, 0) AS ending_inventory,
          CAST(ROUND(CASE
            WHEN ISNULL(prev_inv.avg_price_of_ending_inventory) THEN COALESCE(avg_price_of_purchases, 0)
            WHEN ISNULL(avg_price_of_purchases) THEN COALESCE(prev_inv.avg_price_of_ending_inventory, 0)
            ELSE (COALESCE(prev_inv.avg_price_of_ending_inventory, 0) + COALESCE(avg_price_of_purchases, 0)) / 2
          END, 2) AS DECIMAL(10, 2)) AS avg_price_of_ending_inventory,
          
          -- Cost of Goods Sold = number of goods sold times avg price of ending inventory
          CAST(ROUND(COALESCE(ol.number_of_goods_sold, 0) * (CASE
            WHEN ISNULL(prev_inv.avg_price_of_ending_inventory) THEN COALESCE(avg_price_of_purchases, 0)
            WHEN ISNULL(avg_price_of_purchases) THEN COALESCE(prev_inv.avg_price_of_ending_inventory, 0)
            ELSE (COALESCE(prev_inv.avg_price_of_ending_inventory, 0) + COALESCE(avg_price_of_purchases, 0)) / 2
          END), 2) AS DECIMAL(15, 2)) AS cost_of_goods_sold,
          
          -- Total sold = total revenue from the product
          CAST(ROUND(COALESCE(ol.total_sold, 0), 2) AS DECIMAL(15,2)) AS total_sold,

          -- Gross Profit = Total Sold - Cost of Goods Sold
          CAST(ROUND(COALESCE(total_sold, 0) - (COALESCE(ol.number_of_goods_sold, 0) * CASE
            WHEN ISNULL(prev_inv.avg_price_of_ending_inventory) THEN COALESCE(avg_price_of_purchases, 0)
            WHEN ISNULL(avg_price_of_purchases) THEN COALESCE(prev_inv.avg_price_of_ending_inventory, 0)
            ELSE (COALESCE(prev_inv.avg_price_of_ending_inventory, 0) + COALESCE(avg_price_of_purchases, 0)) / 2
          END), 2) AS DECIMAL(15,2)) AS gross_profit
        FROM product p

        -- query unused stock from previous dates
        LEFT JOIN (SELECT 
                      COALESCE(s.purchases, 0) - COALESCE(ol.number_of_goods_sold, 0) AS ending_inventory,
                      s.avg_price_of_purchases AS avg_price_of_ending_inventory,
                      p.product_id
                  FROM product p
                  LEFT JOIN (SELECT 
                                SUM(quantity) AS purchases,
                                AVG(unit_price) AS avg_price_of_purchases,
                              product_id
                              FROM stock
                              WHERE date_supplied <= DATE_FORMAT(LAST_DAY(:endDate - INTERVAL 1 MONTH), '%Y-%m-%d')
                              GROUP BY product_id) s ON s.product_id = p.product_id
                  LEFT JOIN (SELECT
                                SUM(ol.quantity) AS number_of_goods_sold,
                                ol.product_id
                              FROM order_line ol
                              INNER JOIN ${"`order`"} o ON o.order_id = ol.order_id
                              WHERE o.date_placed <= DATE_FORMAT(LAST_DAY(:endDate - INTERVAL 1 MONTH), '%Y-%m-%d')
                              GROUP BY ol.product_id) ol on ol.product_id = p.product_id) prev_inv ON prev_inv.product_id = p.product_id
        
        -- query purchases / stocks from stock
        LEFT JOIN (SELECT 
                    SUM(quantity) AS purchases,
                    AVG(unit_price) AS avg_price_of_purchases,
                    product_id
                  FROM stock
                  WHERE date_supplied BETWEEN :startDate AND :endDate
                  GROUP BY product_id) s ON s.product_id = p.product_id 
        
        -- query orders
        LEFT JOIN (SELECT
                    SUM(ol.quantity) AS number_of_goods_sold,
                    AVG(ol.selling_price) AS avg_price_of_goods_sold,
                    SUM(ol.selling_price * ol.quantity) AS total_sold,
                    ol.product_id
                  FROM order_line ol
                  INNER JOIN ${"`order`"} o ON o.order_id = ol.order_id
                  WHERE o.date_placed BETWEEN :startDate AND :endDate
                  GROUP BY ol.product_id) ol on ol.product_id = p.product_id
        ORDER BY gross_profit DESC, product_name ASC`,
        {
          startDate: startDate || Report.defaults.START_DATE,
          endDate: endDate || Report.defaults.END_DATE,
        }
      );

      await conn.end();
      retVal = data;
    } catch (err) {
      console.log("[INVENTORY REPORT]", err.message);
      throw new InternalServerError(err);
    }

    return retVal;
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
        ${limit ? `LIMIT ${limit}` : ""}`,
        {
          startDate: startDate || Report.defaults.START_DATE,
          endDate: endDate || Report.defaults.END_DATE,
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
