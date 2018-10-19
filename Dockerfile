FROM node:boron

COPY . /code

ENTRYPOINT [ "node", "/code/index.js" ]