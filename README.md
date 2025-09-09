Happyhourspot
Discover the best happy hour deals in your city.  
Happy Hour Spot is a web app that makes it easy to find, and favorite local happy hour deals.  
Built with React, Express, MongoDB, and AWS, it’s designed to be fast, mobile-friendly, and community-powered.  

App can:
Browse happy hours by city
Save favorites (requires login)
Submit feedback or new venues
Mobile-first design
Deployed on AWS EC2 with Docker

Frontend: React + Vite
Backend: Node.js + Express
Database: MongoDB Atlas
Hosting: AWS EC2 (Docker & Nginx)
Auth: JWT + Cookies

git clone https://github.com/yourusername/happyhourspot.git
cd happyhourspot

# Install dependencies
npm install

# Start client
cd client && npm run dev

# Start server
cd server && npm run dev