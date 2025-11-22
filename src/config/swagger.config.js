import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "UMC Week7 API",
      version: "1.0.0",
      description: "UMC 7기 Week7 미션 API 문서",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "로컬 서버",
      },
    ],
    components: {
      schemas: {
        SuccessResponse: {
          type: "object",
          properties: {
            isSuccess: {
              type: "boolean",
              example: true,
            },
            code: {
              type: "integer",
              example: 200,
            },
            message: {
              type: "string",
              example: "success",
            },
            result: {
              type: "object",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            isSuccess: {
              type: "boolean",
              example: false,
            },
            code: {
              type: "integer",
              example: 400,
            },
            message: {
              type: "string",
              example: "에러 메시지",
            },
          },
        },
      },
    },
  },
  apis: ["./src/controllers/*.js"],
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
