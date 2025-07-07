# Node.js App Command Summary

## 1. Install Dependencies
```bash
npm install
```

## 2. Development Mode (Auto-reload)
```bash
npm run dev
```

## 3. Production Mode
```bash
npm start
```

## 4. Custom Production Script (if configured)
```bash
npm run prod
```

## 5. Health Check
```bash
curl http://localhost:3000/
```

## 6. Environment Variables Setup
Create a `.env` file in your project root:
```bash
echo "PORT=4000" >> .env
echo "DATABASE_URL=your-db-connection-string" >> .env
echo "NODE_ENV=development" >> .env
```
