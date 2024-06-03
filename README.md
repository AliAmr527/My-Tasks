
# My Tasks

This project includes a fully working RESTful APIs developed using NodeJs and express to make a fully functioning Task Managing Back end App working with a presistent DB with no UI.

# Some functionalities include:
- Signing up as a new user with a profile picture
- A mail confirmation system
- Managing user information and status
- Adding tasks
- Managing tasks and add attachments

# Application Structure
- NodeJs as a backend language using the ExpressJs library
- Mongo Atlas as a DataBase

To get this project up and running you need to have both NodeJs and mongoDB if you are using a local database installed and run the following command to install all the needed dependencies.

```bash
  npm i
```

* Make a cloudinary account if you don't have one already

* Enable App Password in your gmail account

* Make a .env file to include all the needed environment variables

* (Optional) for running on a local database simply paste the localhost link in the env variable. otherwise past the mongo atlas URL in the env variable.

Then, to start the project simply type.

```bash
  node index.js
```

or
```bash
  npm start
```
