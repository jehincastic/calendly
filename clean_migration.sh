#!/bin/bash

rm -rf prisma/migrations
yarn migrate --name $1
yarn generate
