FROM node:12 as build

WORKDIR /usr/build

COPY ./src /usr/build/src/
COPY cdk.json package.json package-lock.json tsconfig.json tsconfig.webpack.json webpack.config.ts /usr/build/

RUN npm install -g aws-cdk@1.35.0 && cdk --version \
    && npm install \
    && cdk synth
