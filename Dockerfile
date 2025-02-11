###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine As development

WORKDIR /usr/src/orders

COPY --chown=node:node package*.json ./

RUN npm install --force

COPY --chown=node:node . .

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine As build

WORKDIR /usr/src/orders

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/orders/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production

RUN npm install --only=production && npm cache clean --force

USER node

###################
# PRODUCTION
###################

FROM node:18-alpine As production

WORKDIR /usr/src/orders

COPY --chown=node:node --from=build /usr/src/orders/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/orders/dist ./dist

CMD [ "node", "dist/main.js" ]
