import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.4",
    info: {
      title: "URL Shortening API",
      version: "1.0.0",
    },
  },
  apis: ["./src/api/docs/swagger.yml"],
};

const specs = swaggerJsdoc(options);
export default specs;
