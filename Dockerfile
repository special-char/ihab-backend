FROM node:alpine As development

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
# COPY prisma ./prisma/

RUN apk --no-cache --virtual build-dependencies add \
        python3 \
        make \
        g++ \
&& yarn add glob rimraf \
&& yarn install --development \
&& apk del build-dependencies

COPY . .

RUN yarn build

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
# COPY prisma ./prisma/

RUN apk --no-cache --virtual build-dependencies add \
        python3 \
        make \
        g++ \
&& yarn add glob rimraf \
&& yarn install --production \
&& apk del build-dependencies

COPY . .

EXPOSE 3000

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]