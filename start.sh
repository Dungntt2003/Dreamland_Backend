#!/bin/bash

echo "✅ Installing dependencies..."
npm install

echo "📦 Running Sequelize commands..."
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
node handleSeedData.js

echo "🚀 Starting the server..."
npm start
