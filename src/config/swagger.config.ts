import { DocumentBuilder } from "@nestjs/swagger";

export const swaggerConfig = new DocumentBuilder()
  .setTitle("Ascthem APIs")
  .setDescription("The Ascthem API description")
  .setVersion("1.0")
  .addTag("Ascthem")
  .build();
