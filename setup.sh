#!/bin/bash

# Update system
sudo dnf update -y

# Install required packages
sudo dnf install python39 python39-pip nginx fail2ban -y

# Create application user
sudo useradd -r -s /bin/false pythonapp

# Create application directory
sudo mkdir -p /opt/python-interpreter
cd /opt/python-interpreter

# Clone repository
sudo git clone https://github.com/getGit789/python-interpreter-online.git .

# Set up virtual environment
python3.9 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
sudo tee /etc/environment << EOF
MAX_WORKERS=4
MAX_CODE_SIZE=10000
REQUESTS_LIMIT=10
TIME_WINDOW=60
ALLOWED_ORIGINS=https://getgit789.github.io,http://localhost:3002
EOF

# Configure fail2ban for additional security
sudo tee /etc/fail2ban/jail.local << EOF
[nginx-req-limit]
enabled = true
filter = nginx-req-limit
action = iptables-multiport[name=ReqLimit, port="http,https"]
logpath = /var/log/nginx/error.log
findtime = 600
bantime = 7200
maxretry = 10
EOF

# Set proper permissions
sudo chown -R pythonapp:pythonapp /opt/python-interpreter
sudo chmod -R 755 /opt/python-interpreter

# Install systemd service
sudo cp backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable backend
sudo systemctl start backend

# Configure and start nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Start fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban 