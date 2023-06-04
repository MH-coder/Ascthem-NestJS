import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from "helmet";
import { Logger } from "nestjs-pino";
import { swaggerConfig } from "./config/swagger.config";
import { SwaggerModule } from "@nestjs/swagger";
import * as dotenv from "dotenv";

dotenv.config();

const { SERVER_PORT } = process.env;
const {ORIGIN_URL} = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // app.enableCors({
  //   origin: function (origin, callback) {
  //     const allowedOrigins = ['https://dashboard.ascthem.com/', 'http://54.211.170.108:3000/', 'http://localhost:3000']; // list of allowed domains
  //     if (!origin || allowedOrigins.includes(origin)) {
  //       callback(null, true);
  //     } else {
  //       callback(new Error('Not allowed by CORS'));
  //     }
  //   },
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  // });


  app.enableCors({
    origin: '*',
    allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization', 'X-Requested-With'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'PATCH'],
  });
  
  //swagger
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api", app, document);

  //Pine Logger
  app.useLogger(app.get(Logger));

  //helmet
  app.use(helmet());

  //Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );

  await app.listen(SERVER_PORT);
}
bootstrap();
