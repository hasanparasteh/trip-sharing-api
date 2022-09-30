# Trip Accounting API

Imagine you are in a great great trip with your friends and some other families. you are just a alone programmer who can't make enough money
and you don't want to be expenses manager as usual. people won't pay you back and bully you! what should you do? Change your strategy!

With this `API` you can achieve what you are missing in your trips! an easy accounting api which everybody pay their share and every family can pay for anything along the trip!

## How this works?

First we need an expenses manager that should create an account! then you just hit the login and insert your friends or families(there's no friend in this api. there's only single family mode where you set family crowd to 1) data!

Next you need to create the trip and specify each family in trip with you! Now you need to add payments of each family. when a family pay for something you just insert a new payment item for that family.

When you arrived home you just get share of each person! and can calculate debtors or creditors!

## Setup Project

Please ensure that you have successfully installed these programs: `node.js`, `npm`, `postman`, `mysql`! Then you need to import database schema into your `mysql` database..After that you create an `.env` file (there's an `.env.sample` to help you create it) based on your own data.

Finally just run `npm i && npm start` commands to install required packages and run `dev` server.

### Setup Database

```console
foo@bar:~$ cd <PROJECT_ROOT>
foo@bar:~$ mysql -u root -p
> create database accounting; use accounting;
> source database.sql;
```

### Run Server

```console
foo@bar:~$ cd <PROJECT_ROOT>
foo@bar:~$ cp .env.sample .env
foo@bar:~$ nano .env # you need to enter your credential and data here!
foo@bar:~$ npm install
foo@bar:~$ npm start 
```

### Import Postman data

You can learn this section from official postman documentations: [Importing data into Postman](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman)

There's no further documentations and you can use postman as it is to learn how to call API. There's examples and nothing to worry about... but if there was something I'd be happy to help!
