# vidly
Node.js express API connected to a MongoDB

This is a little project that use 
  - Express.js to routes all endpoints 
  - JsonWebToken to handle authentication and authorization in middlewares 
  - Bcrypt to hashing passwords
  - Mongoose for modeling schemas and the connection to a MongoDB instance
  - Fawn library to perform an atomic complex operation in MongoDB
  - Config module for all environments configurations including a secret-key
  - Joi package for the inputs validation

