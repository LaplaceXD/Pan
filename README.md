# Pan

![Last Update](https://img.shields.io/github/last-commit/LaplaceXD/Pan?color=blue&label=Last%20Update)
![Activity](https://img.shields.io/badge/Activity-Completed-blue)

[Pan](https://pan-laplace.vercel.app/) is an inventory management system made for Pan. This system was made
with the use of [MySQL](https://www.mysql.com/), [React](https://beta.reactjs.org/),
[Express](https://expressjs.com/), and [Node.js](https://nodejs.org/en/).

## Functionalities
- Generate reports, such as:
  * `Inventory Report`, which contains the beginning and ending stocks, the number of goods sold, and the gross profit of each product within a month.
  * `Sales Report` contains the top performing, least performing, and various statistics of the different products in the system.
  * `Supplier Stock Report`, which contains the 'stock in' of the different suppliers within a month.
  * `Employee Details Report`
  * `Daily Sales Report`
- Manage company resources such as employees, products, stocks, and suppliers.
- Track, manage, and place orders based on the available products, and stocks in the system.
- Filter data within the system.
- Role-based authorization on different functionalities.
- Authentication using [JWT tokens](https://jwt.io/).

## Setup

1. Clone this project to your local machine.
2. Import `pan_db.sql` into your local MySQL database, and run your MySQL database.
3. Create a Redis instance locally or through [Redis Labs](https://app.redislabs.com/).
4. Create a [SendGrid](https://sendgrid.com/) account.
5. Create `.env` files in the `client directory` and `server directory.`
   > The environment variables should contain the following:

```
# server/.env should contain the following variables

SENDGRID_API_KEY  = <<your sendgrid api key here>>
REDIS_HOST        = <<your redis host here>>
REDIS_USERNAME    = <<your redis user name>>
REDIS_PASSWORD    = <<your redis password>>
REDIS_PORT        = <<your redis port>>

# client/.env should contain the following variables

VITE_SERVER_URL   = http://localhost:3000/api/v1
```

6.  Run the following script in a terminal.

```bash
cd client
npm i
npm run dev

cd ../server
npm i
npm run dev
```

7. You should be able to login through the login portal using the following credentials.
> Employee

```
email: employee@pan.com
password: pan@employee123!
```
> Manager

```
email: manager@pan.com
password: pan@manager123!
```

8. ...
9. Profit!

## Contributing

Unfortunately, we are not accepting pull requests, since this is a one-time project. However, feel free to
fork this project, and improve on it!

## Authors and Acknowledgement
- [Jonh Alexis Buot](https://github.com/LaplaceXD) [Team Lead, Project Manager]
- [Sherly Jao](https://github.com/jaosherlyr) [Web Designer, Front-End Developer]
- [Nathan Arriesgado](https://github.com/n-e-t-a-n) [Back-End Developer]
- [Erwin Antepuesto](https://github.com/cham0m1le) [Back-End Developer]

## License

[MIT](https://github.com/LaplaceXD/Pan/blob/master/LICENSE)
