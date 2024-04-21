#!/bin/sh

# Create db or update it
npx prisma migrate deploy
# Generate the client for the bot
npx prisma generate
npm start