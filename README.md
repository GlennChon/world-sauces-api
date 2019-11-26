# API for World Sauces

## Available Scripts

## Endpoints

- "/api/docs"
- "/api/users"
- "/api/recipes"
- "/api/countries"
- "/api/tasteprofiles"

## Deployment

### Install MongoDB

Required: MongoDB ^5.6.10
https://docs.mongodb.com/manual/installation/

Run cmd: mongod

### Install Dependencies

From the project folder:

npm i

Will install the following dependencies

- "bcrypt": "^3.0.6",
- "config": "^3.2.2",
- "express": "^4.17.1",
- "helmet": "^3.20.0",
- "@hapi/joi": "^16.1.4",
- "jsonwebtoken": "^8.5.1",
- "lodash": "^4.17.15",
- "mongoose": "^5.6.10",
- "morgan": "^1.9.1",
- "winston": "^3.2.1"

### Start the Server

    node app.js

This launches the Node server on port 3333.
If that port is busy, you may set a different port in config/default.json

### Optional Environment Variables

mail_server_password : Self explanatory

Windows Powershell:

    $env:mail_server_password="yourMailServerPassword"

Windows CMD:

    set mail_server_password=yourMailServerPassword

Mac:

    export mail_server_password=yourMailServerPassword

jwt_private_key : Key used to encrypt JSON web tokens, DO NOT CHECK INTO SOURCE CONTROL IF YOU ARE FORKING THIS. SET A SEPARATE ENV VARIABLE ON YOUR HOST MACHINE.
Default value is for testing, do not use in production.

Windows Powershell:

    $env:jwt_private_key="YourPrivateKey"

Windows CMD:

    set jwt_private_key=yourPrivateKey

Mac:

    export jwt_private_key=yourPrivateKey

## Additional Notes
