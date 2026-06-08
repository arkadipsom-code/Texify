# Step 1: Start with a lightweight, secure Linux image that has Node.js 20 pre-installed
FROM node:20-slim

# Step 2: Update the Linux package manager and install the TeX Live compiler + standard fonts
# This replaces your local MiKTeX installation entirely on the server
RUN apt-get update && apt-get install -y \
    texlive-latex-base \
    texlive-latex-recommended \
    texlive-latex-extra \
    texlive-fonts-recommended \
    && rm -rf /var/lib/apt/lists/*

# Step 3: Create the working directory inside the container
WORKDIR /app

# Step 4: Copy package files first to optimize Docker caching for dependencies
COPY package*.json ./

# Step 5: Install only production dependencies (skips nodemon, etc., to keep the container light)
RUN npm install --production

# Step 6: Copy the rest of your backend source code into the container
COPY . .

# Step 7: Expose the port your Express app listens on
EXPOSE 5000

# Step 8: Define the command to start your application
CMD ["npm", "start"]