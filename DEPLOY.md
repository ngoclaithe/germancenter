# Deploy Lingua German lên VPS

## 1. Trỏ DNS (tại nhà cung cấp tên miền)

Thêm 2 record **A** trỏ về IP VPS:

```
Type    Host    Value           TTL
A       @       YOUR_VPS_IP     300
A       www     YOUR_VPS_IP     300
```

## 2. Cài đặt trên VPS (Ubuntu/Debian)

```bash
# Cài Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx certbot python3-certbot-nginx git

# Clone source
cd /var/www
git clone https://github.com/ngoclaithe/germancenter.git linguagerman
cd linguagerman

# Cài dependencies & build
npm install
npm run build

# Tạo file .env.local
cat > .env.local << 'EOF'
GEMINI_API_KEY=your_gemini_api_key_here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
ADMIN_SECRET=your_secret_key
NEXT_PUBLIC_SITE_URL=https://linguagerman.com
EOF
```

## 3. Cấu hình Nginx

```bash
# Copy config
sudo cp linguagerman.com.conf /etc/nginx/sites-available/linguagerman.com.conf
sudo ln -s /etc/nginx/sites-available/linguagerman.com.conf /etc/nginx/sites-enabled/

# Tạm thời comment block SSL để xin cert trước
# (Hoặc dùng bước 4a bên dưới)

sudo nginx -t
sudo systemctl reload nginx
```

## 4. Xin SSL Certificate (Certbot)

### 4a. Cách nhanh (Certbot tự cấu hình)
```bash
# Tạo config tạm chỉ có HTTP
sudo tee /etc/nginx/sites-available/linguagerman.com.conf << 'EOF'
server {
    listen 80;
    server_name linguagerman.com www.linguagerman.com;
    root /var/www/linguagerman;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 200 "waiting for ssl";
    }
}
EOF

sudo mkdir -p /var/www/certbot
sudo nginx -t && sudo systemctl reload nginx

# Xin cert
sudo certbot certonly --webroot -w /var/www/certbot \
    -d linguagerman.com \
    -d www.linguagerman.com \
    --email your@email.com \
    --agree-tos \
    --no-eff-email

# Sau khi cert thành công, copy config đầy đủ về
sudo cp /var/www/linguagerman/linguagerman.com.conf /etc/nginx/sites-available/linguagerman.com.conf
sudo nginx -t && sudo systemctl reload nginx
```

### 4b. Hoặc dùng certbot nginx plugin (đơn giản hơn)
```bash
sudo certbot --nginx -d linguagerman.com -d www.linguagerman.com
```

## 5. Chạy Next.js với PM2

```bash
# Cài PM2
sudo npm install -g pm2

# Start app
cd /var/www/linguagerman
pm2 start npm --name "linguagerman" -- start
pm2 save
pm2 startup

# Kiểm tra
pm2 status
pm2 logs linguagerman
```

## 6. Auto-renew SSL

```bash
# Certbot tự đăng ký cron, kiểm tra:
sudo certbot renew --dry-run
```

## 7. Cập nhật code

```bash
cd /var/www/linguagerman
git pull
npm install
npm run build
pm2 restart linguagerman
```
