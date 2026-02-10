# 🚀 Email Agent Deployment Guide

## 📋 What's Been Created

This setup allows you to deploy **ONLY the Email Agent** to Railway while keeping other agents local.

### Files Created:
- ✅ `app/main_email.py` - Email-only entry point
- ✅ `Procfile` - Railway deployment config
- ✅ `railway.json` - Railway settings

---

## 🎯 Deployment Architecture

```
Production:
Frontend (Netlify) → Email Agent (Railway) ✅ Deployed
                   → Other Agents (Local) ❌ Not deployed

Development:
Frontend (Local) → Email Agent (Local) ✅
                → Other Agents (Local) ✅
```

---

## 🚀 Deploy to Railway

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add email agent deployment"
git push origin main
```

### Step 2: Deploy on Railway
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will auto-detect and deploy!

### Step 3: Add Environment Variables
In Railway dashboard, add these variables:
```
OPENAI_API_KEY=sk-...
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
CORS_ORIGINS=https://your-frontend.netlify.app,http://localhost:5173
```

### Step 4: Get Your URL
After deployment, Railway will give you a URL like:
```
https://your-app.railway.app
```

---

## 🧪 Test Deployment

### Test Health Check:
```bash
curl https://your-app.railway.app/health
```

Expected response:
```json
{
  "service": "email_agent",
  "status": "healthy",
  "deployed": true
}
```

### Test Email API:
```bash
curl -X POST https://your-app.railway.app/api/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test from Railway",
    "body": "Hello from deployed email agent!"
  }'
```

---

## 🔧 Local Development

### Run Full App (All Agents):
```bash
uvicorn app.main:app --reload --port 8000
```

### Run Email Agent Only:
```bash
uvicorn app.main_email:app --reload --port 8000
```

---

## 📝 What Gets Deployed

### ✅ Deployed to Railway:
- Email API (`/api/email/send`)
- Email runner
- Health check endpoint
- API documentation

### ❌ NOT Deployed:
- Flow API
- Code API
- Other agents
- Database (unless you add Railway PostgreSQL)

---

## 🌐 Frontend Integration

Update your frontend to use the deployed email agent:

```javascript
// config.js
const config = {
  emailAgentUrl: process.env.NODE_ENV === 'production'
    ? 'https://your-app.railway.app'
    : 'http://localhost:8000',
};

// Usage
fetch(`${config.emailAgentUrl}/api/email/send`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'client@example.com',
    subject: 'Hello',
    body: 'Email content here'
  })
});
```

---

## 💰 Cost

**Railway Free Tier:**
- 500 hours/month
- $5 credit/month
- Sleeps after inactivity

**Paid Plan:**
- $5/month for always-on
- No sleep
- Better performance

---

## ⚠️ Important Notes

1. **SMTP Credentials**: Make sure to add Gmail App Password, not regular password
2. **CORS**: Add your frontend URL to `CORS_ORIGINS`
3. **Database**: Email agent doesn't need database, but if you add flows, you'll need Railway PostgreSQL
4. **Logs**: Check Railway logs for debugging

---

## 🐛 Troubleshooting

### Issue: "Module not found"
**Solution:** Make sure `requirements.txt` has all dependencies

### Issue: "SMTP authentication failed"
**Solution:** Use Gmail App Password, enable 2-Step Verification

### Issue: "CORS error"
**Solution:** Add frontend URL to `CORS_ORIGINS` environment variable

### Issue: "Port already in use"
**Solution:** Railway automatically sets `$PORT`, no need to change

---

## ✅ Deployment Checklist

Before deploying:
- [ ] Code pushed to GitHub
- [ ] `main_email.py` created
- [ ] `Procfile` created
- [ ] `railway.json` created
- [ ] SMTP credentials ready
- [ ] OpenAI API key ready

After deploying:
- [ ] Environment variables added
- [ ] Health check works
- [ ] Email sending works
- [ ] Frontend connected
- [ ] CORS configured

---

## 🎉 Success!

Your email agent is now deployed and accessible from anywhere!

**Deployed URL:** `https://your-app.railway.app`

**API Docs:** `https://your-app.railway.app/docs`

**Health Check:** `https://your-app.railway.app/health`
