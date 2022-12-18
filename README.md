# Pan
![Last Update](https://img.shields.io/github/last-commit/LaplaceXD/Cosette?color=blue&label=Last%20Update) ![Activity](https://img.shields.io/badge/Activity-InProgress-green)

Pan is an inventory management system made for Pan. This system was made with the use of [MySQL](https://www.mysql.com/), [React](https://beta.reactjs.org/), [Express](https://expressjs.com/), and [Node.js](https://nodejs.org/en/).

## Setup

1. Clone this project to your local machine.
2. Import `server/pan_db.sql` into your local MySQL database.
3. Create a redis instance locally or through [Redis Labs](https://app.redislabs.com/).
4. Create `.env` files in the `client directory` and `server directory.`
> The environment variables should contain the following:
```
# server/.env should contain the following variables

DB_HOST           = localhost
DB_USER           = root
DB_DATABASE       = pan_db
DB_PASSWORD       = 
JWT_SECRET        = superdupersecuresecret
JWT_ISSUER        = http://localhost:3000/auth
JWT_AUDIENCE      = http://localhost:3000
JWT_ACCESS_EXP    = 15m
JWT_REFRESH_EXP   = 1d
REDIS_HOST        = <<your redis host here>>
REDIS_USERNAME    = <<your redis user name>>
REDIS_PASSWORD    = <<your redis password>>
REDIS_PORT        = <<your redis port>>

# client/.env should contain the following variables

VITE_SERVER_URL   = http://localhost:3000
```
 5. Run the following scripts in two different terminals.
```bash
cd client
npm run dev
```
```bash
cd server
npm start
```
6. You should be able to login through the login portal using the following credentials.
```
email: jonh.buot@gmail.com
password: 1SecretPassword!
```
7. ...
8. Profit!

## Contributing

Unfortunately, we are not accepting pull requests, since this is a one-time project. However, feel free to fork this project, and improve on it!

## Roadmap

We are planning to deploy this over [Vercel](https://vercel.com/), so stay tuned to that.

## License

[MIT](https://github.com/LaplaceXD/Pan/blob/master/LICENSE)
