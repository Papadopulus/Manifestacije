# Use the official Node.js 18 image as the base
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm i -f

# Copy the rest of the app's source code to the container
COPY . .

# Build the React app
RUN npm run build

# Expose the desired port (e.g., 3000)
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]