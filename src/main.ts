import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { FunctionExt } from 'src/common/utility/functionExt';
import { INestApplication } from '@nestjs/common';
import { buildSchema } from 'graphql';
import { graphqlHTTP } from 'express-graphql';
import { join } from 'path';
import { GraphQLResolver } from './graphql/graphql-resolver';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('portal-service')
    .setDescription('portal service for UI and user data provider')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api', app, document);

  // setupGraphQL(app);

  await app.listen(10000);
}
bootstrap();
async function setupGraphQL(app: INestApplication) {
  // Construct a schema, using GraphQL schema language
  let fs = require('fs');
  // console.log(process.env);

  let path = join(__dirname, './graphql/schema.gql');
  console.log("graphql schema source:", path);

  let schemaSource = fs.readFileSync(path).toString();
  console.log("read schema.gpl: " + schemaSource);

  var schema = buildSchema(schemaSource);

  // The root provides a resolver function for each API endpoint
  var resolver = app.get(GraphQLResolver);

  var root = resolver.getGraphqlResolverRoot();

  app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  }));
}

