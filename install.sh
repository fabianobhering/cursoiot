echo "ATUALIZANDO..."
sudo apt -y update
sudo apt -y upgrade

echo "INSTALANDO O NODEJS..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
echo "REINICIAR O SERVIDOR"
nvm install 20
npm install pm2 -g

echo "INSTALANDO O MONGODB..."
sudo apt-get install gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg \
   --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo service mongod start

echo "INSTALANDO O MOSQUITTO..."
sudo apt -y install mosquitto
sudo apt -y install mosquitto-clients
sudo bash -c 'cat << EOF > /etc/mosquitto/mosquitto.conf
listener 1883
protocol mqtt
allow_anonymous true
EOF'

echo "INSTALANDO O Grafana..."
sudo apt-get install -y apt-transport-https software-properties-common wget
sudo mkdir -p /etc/apt/keyrings/
wget -q -O - https://apt.grafana.com/gpg.key | gpg --dearmor | sudo tee /etc/apt/keyrings/grafana.gpg > /dev/null
echo "deb [signed-by=/etc/apt/keyrings/grafana.gpg] https://apt.grafana.com stable main" | sudo tee -a /etc/apt/sources.list.d/grafana.list
sudo apt-get update
sudo apt-get install grafana
sudo service grafana-server start
