const { InternalServerError } = require("../../helpers/errors");
const { db } = require("../providers");

class Report {
  static defaults = {
    START_DATE: "1970-01-01",
    END_DATE: new Date().toISOString().split("T")[0],
  };

  static async getSupplierStocksReportData(startDate, endDate) {
    const suppliers = await Report.retrieveAvailableSuppliers();
    const stocks = await Promise.all(
      suppliers.map(({ supplier_id }) => Report.retrieveSupplierStocks(supplier_id, startDate, endDate))
    );

    const columns = [
      { label: "Product Name", value: "product_name" },
      { label: "Date Supplied", value: "date_supplied" },
      { label: "Stock In", value: "stock_in" },
      { label: "Stock Price", value: "stock_price", format: "₱###,###,###.00" },
      { label: "Total Cost", value: "total_cost", format: "₱###,###,###.00" },
      { label: "Notes", value: "notes" },
    ];

    return suppliers.map(({ name }, idx) => ({
      sheet: name,
      columns,
      content: stocks[idx],
    }));
  }

  static async getSalesReportData(startDate, endDate, empId) {
    const sales = await Report.retrieveDailySales(startDate, endDate, empId);

    const columns = [
      { label: "Date Placed", value: "date_placed" },
      { label: "Employee Name", value: "employee_name" },
      { label: "Order ID", value: "order_id" },
      { label: "Placed On", value: "time_placed" },
      { label: "Product ID", value: "product_id" },
      { label: "Product Name", value: "product_name" },
      { label: "Quantity Sold", value: "quantity" },
      { label: "Product Price", value: "selling_price" },
      { label: "Total Revenue", value: "total_sold" },
    ];

    const grandTotalRow = columns.reduce((acc, { value }) => ({ ...acc, [value]: null }), {});
    grandTotalRow["selling_price"] = "GRAND TOTAL";
    grandTotalRow["total_sold"] = dailySales
      .reduce((acc, { total_sold }) => acc + parseFloat(total_sold), 0)
      .toFixed(2);

    return [
      {
        sheet: "Daily Sales",
        columns,
        content: [...sales, grandTotalRow],
      },
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
      const [data] = await conn.query(
        `SET @start_date = DATE_FORMAT(:startDate, '%Y-%m-%d 00:00:00');
        SET @end_date = DATE_FORMAT(:endDate, '%Y-%m-%d 23:59:59');
        SET @prev_month_end_date = DATE_FORMAT(LAST_DAY(@end_date - INTERVAL 1 MONTH), '%Y-%m-%d 23:59:59');

        CREATE TEMPORARY TABLE prev_month_inventory
        SELECT
          COALESCE(s.purchases, 0) - COALESCE(ol.number_of_goods_sold, 0) AS ending_inventory,
          s.avg_price_of_purchases AS avg_price_of_ending_inventory,
          p.product_id
        FROM product p
        LEFT JOIN (SELECT
                    SUM(quantity) AS purchases,
                    SUM(unit_price * quantity) / SUM(quantity) AS avg_price_of_purchases,
                    product_id
                  FROM stock
                  WHERE date_supplied <= @prev_month_end_date
                  GROUP BY product_id) s ON s.product_id = p.product_id
        LEFT JOIN (SELECT
                    SUM(ol.quantity) AS number_of_goods_sold,
                    ol.product_id
                    FROM order_line ol
                  INNER JOIN ${"`order`"} o ON o.order_id = ol.order_id
                  WHERE o.date_placed <= @prev_month_end_date
                  GROUP BY ol.product_id) ol on ol.product_id = p.product_id;
                  
        CREATE TEMPORARY TABLE current_month_inventory
        SELECT
          p.name AS product_name,
          CASE WHEN p.is_available = '1' THEN 'Shown' ELSE 'Hidden' END AS status,

          -- Beginning Inventory, which is the ending inventory of the previous month
          COALESCE(pi.ending_inventory, 0) AS beginning_inventory,
          CAST(ROUND(COALESCE(pi.avg_price_of_ending_inventory, 0), 2) AS DECIMAL(10,2)) AS avg_price_of_beginning_inventory,

          -- Stock purchased for this month
          COALESCE(s.purchases, 0) AS purchases,
          CAST(ROUND(COALESCE(s.avg_price_of_purchases, 0), 2) AS DECIMAL(10,2)) AS avg_price_of_purchases,

          -- Number of Goods Sold
          COALESCE(ol.number_of_goods_sold, 0) AS number_of_goods_sold,
          CAST(ROUND(COALESCE(ol.avg_price_of_goods_sold, 0), 2) AS DECIMAL(10,2)) AS avg_price_of_goods_sold,

          -- Ending inventory which is beginning inventory + purchased stock this month - number of goods sold
          COALESCE(pi.ending_inventory, 0) + COALESCE(purchases, 0) - COALESCE(number_of_goods_sold, 0) AS ending_inventory,
          CAST(ROUND(CASE
                      WHEN ISNULL(pi.avg_price_of_ending_inventory) THEN COALESCE(avg_price_of_purchases, 0)
                      WHEN ISNULL(avg_price_of_purchases) THEN COALESCE(pi.avg_price_of_ending_inventory, 0)
                      ELSE (COALESCE(pi.avg_price_of_ending_inventory, 0) * COALESCE(pi.ending_inventory, 0) 
                            + COALESCE(avg_price_of_purchases, 0) * COALESCE(purchases, 0))
                            / (COALESCE(purchases, 0) + COALESCE(pi.ending_inventory, 0))
                    END, 2) AS DECIMAL(10, 2)) AS avg_price_of_ending_inventory,
          
          -- Total sold = total revenue from the product     
          CAST(ROUND(COALESCE(ol.total_sold, 0), 2) AS DECIMAL(15,2)) AS total_sold
        FROM product p
        LEFT JOIN prev_month_inventory pi ON pi.product_id = p.product_id
        LEFT JOIN (SELECT
                    SUM(quantity) AS purchases,
                    SUM(quantity * unit_price) / SUM(quantity) AS avg_price_of_purchases,
                    product_id
                  FROM stock
                  WHERE date_supplied BETWEEN @start_date AND @end_date
                  GROUP BY product_id) s ON s.product_id = p.product_id
        LEFT JOIN (SELECT
                    SUM(ol.quantity) AS number_of_goods_sold,
                    SUM(ol.selling_price * ol.quantity) AS total_sold,
                    SUM(ol.selling_price * ol.quantity) / SUM(ol.quantity) AS avg_price_of_goods_sold,
                    ol.product_id
                  FROM order_line ol
                  INNER JOIN ${"`order`"} o ON o.order_id = ol.order_id
                  WHERE o.date_placed BETWEEN @start_date AND @end_date
                  GROUP BY ol.product_id) ol on ol.product_id = p.product_id;
                          
        SELECT 
          *,
          number_of_goods_sold * avg_price_of_ending_inventory AS cost_of_goods_sold,
          total_sold - (number_of_goods_sold * avg_price_of_ending_inventory) AS gross_profit
        FROM current_month_inventory
        ORDER BY gross_profit DESC, product_name ASC;`,
        {
          startDate: startDate || Report.defaults.START_DATE,
          endDate: endDate || Report.defaults.END_DATE,
        }
      );

      await conn.end();
      retVal = data[data.length - 1];
    } catch (err) {
      console.log("[INVENTORY REPORT]", err.message);
      throw new InternalServerError(err);
    }

    return retVal;
  }

  static async retrieveAvailableSuppliers() {
    let retVal = [];

    try {
      const conn = await db.connect();
      const [data] = await conn.execute(
        `SELECT
          name,
          supplier_id
        FROM supplier
        WHERE is_active = '1'`
      );
      await conn.end();
      retVal = data;
    } catch (err) {
      console.log("[AVAILABLE SUPPLIER QUERY ERROR]", err.message);
      throw new InternalServerError(err);
    }

    return retVal;
  }

  static async retrieveSupplierStocks(supplierId, startDate, endDate) {
    let retVal = [];

    try {
      const conn = await db.connect();
      const [data] = await conn.execute(
        `SELECT
          p.name AS product_name,
          s.date_supplied,
          CONCAT(s.quantity, ' ', s.unit) AS stock_in,
          s.unit_price AS stock_price,
          s.quantity * s.unit_price AS total_cost,
          s.notes
        FROM stock s
        INNER JOIN supplier sp ON sp.supplier_id = s.supplier_id
        INNER JOIN product p on p.product_id = s.product_id
        WHERE s.date_supplied BETWEEN :startDate AND :endDate
          AND sp.supplier_id = :supplierId
        GROUP BY p.product_id
        ORDER BY s.date_supplied DESC, s.stock_id DESC`,
        {
          startDate: startDate || Report.defaults.START_DATE,
          endDate: endDate || Report.defaults.END_DATE,
          supplierId,
        }
      );
      await conn.end();
      retVal = data;
    } catch (err) {
      console.log("[SUPPLIER STOCKS QUERY ERROR]", err.message);
      throw new InternalServerError(err);
    }

    return retVal;
  }

  static async retrieveSales(startDate, endDate, empId = null) {
    let retVal = [];

    try {
      const conn = await db.connect();
      const [data] = await conn.execute(
        `SELECT 
          DATE_FORMAT(o.date_placed, '%Y-%m-%d') AS date_placed,
          CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
          o.order_id,
          DATE_FORMAT(o.date_placed, '%h:%i:%s %p') AS time_placed,
          p.product_id,
          p.name AS product_name,
          ol.quantity,
          ol.selling_price,
          ol.quantity * ol.selling_price AS total_sold
        FROM ${"`order`"} o
        INNER JOIN employee e ON e.employee_id = o.employee_id
        INNER JOIN order_line ol ON ol.order_id = o.order_id
        INNER JOIN product p ON p.product_id = ol.product_id
        WHERE o.date_placed 
          BETWEEN DATE_FORMAT(:startDate, '%Y-%m-%d 00:00:00') 
          AND DATE_FORMAT(:endDate, '%Y-%m-%d 23:59:59')
          ${empId ? "AND e.employee_id = :empId" : ""}
        ORDER BY o.date_placed ASC;`,
        {
          startDate: startDate || Report.defaults.START_DATE,
          endDate: endDate || Report.defaults.END_DATE,
          empId,
        }
      );

      await conn.end();
      retVal = data;
    } catch (err) {
      console.log("[DAILY SALES QUERY ERROR]", err.message);
      throw new InternalServerError(err);
    }

    return retVal;
  }
}

module.exports = Report;
