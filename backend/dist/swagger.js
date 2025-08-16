"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const package_json_1 = require("../package.json");
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Guess The Number API",
            version: package_json_1.version,
            description: "API documentation for the Guess The Number MERN project.",
            contact: {
                name: "API Support",
                url: "https://github.com/your-repo",
            },
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Enter JWT token",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
        servers: [
            {
                url: "http://localhost:4000",
                description: "Development server",
            },
        ],
    },
    apis: ["./src/docs/*.yaml"],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
const setupSwagger = (app) => {
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    app.get("/api-docs.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
    console.log(`📄 API Docs available at http://localhost:4000/api-docs`);
};
exports.setupSwagger = setupSwagger;
//# sourceMappingURL=swagger.js.map