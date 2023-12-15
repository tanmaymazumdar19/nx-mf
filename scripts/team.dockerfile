# Use an official Node runtime as a parent image
FROM node:20-alpine3.19 as node

ENV NODE_VERSION 20.10.0
ENV YARN_VERSION 4.0.2

RUN mkdir -p /react-monorepo/apps/web/npm-logs

# Set the working directory in the container
WORKDIR /react-monorepo

# Copy the local source files to the working directory
COPY . .

# Install app dependencies and build
RUN yarn && yarn team:build:prod
# yarn && yarn web:build && yarn web:serve:prod

# Expose port 4203 to the outside world
EXPOSE 4203

# Command to run the application
CMD ["yarn", "run", "prod"]
