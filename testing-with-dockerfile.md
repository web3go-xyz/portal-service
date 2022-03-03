## Preparation

Setup a MySQL database and map the "mysqlConnection" property in the template appConfig.js to database's connection endpoint. Take a note of the path to the appConfig.js you created.

## Dependencies

```bash
$ yarn install
$ sh linkcommon.sh
```

## Building

```bash
$ yarn build
```

## Create docker image
```bash
$ docker build -t portal-service:v1
```

## Run the image
```bash
$ docker run -d -p 10000:10000 -v [Your appConfig.js path]:/app/common/setting/appConfig.js --name tryport portal-service:v1
```
