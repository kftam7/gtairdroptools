#!/bin/bash
# pull from Git
cd /home/ubuntu/github/gtairdroptools
git pull

# update version file
version=`git tag | tail -n1`
echo $version
echo -e "{\n\t\"version_no\": \"$version\"\n}" >  /home/ubuntu/github/gtairdroptools/Dapp/Airdrop/src/utils/version.json

# Airdrop
cd /home/ubuntu/github/gtairdroptools/Dapp/Airdrop
npm install
cp /home/ubuntu/github/gtairdroptools/deploy/config/production/airdropbaseUrl.json.production /home/ubuntu/github/gtairdroptools/Dapp/Airdrop/src/utils/baseUrl.json
cp /home/ubuntu/github/gtairdroptools/deploy/config/production/Airdrop.json.production /home/ubuntu/github/gtairdroptools/Dapp/Airdrop/src/utils/Airdrop.json
cp /home/ubuntu/github/gtairdroptools/deploy/config/production/airdropcrypto_address.json.production /home/ubuntu/github/gtairdroptools/Dapp/Airdrop/src/utils/crypto_address.json
cp /home/ubuntu/github/gtairdroptools/deploy/config/production/parameter_config.json.production /home/ubuntu/github/gtairdroptools/Dapp/Airdrop/src/utils/parameter_config.json
cp /home/ubuntu/github/gtairdroptools/deploy/config/production/token.json.production /home/ubuntu/github/gtairdroptools/Dapp/Airdrop/src/utils/token.json
rm -rf /home/ubuntu/github/gtairdroptools/Dapp/Airdrop/dist
npm run build
sudo cp -R /home/ubuntu/github/gtairdroptools/Dapp/Airdrop/dist/* /var/www/vhosts/Airdrop/
sudo chown -R www-data:www-data /var/www/vhosts/Airdrop

# UpdateWallet
cd /home/ubuntu/github/gtairdroptools/Dapp/UpdateWallet
npm install
cp /home/ubuntu/github/gtairdroptools/deploy/config/production/updatewalletbaseUrl.json.production /home/ubuntu/github/gtairdroptools/Dapp/UpdateWallet/src/utils/baseUrl.json
cp /home/ubuntu/github/gtairdroptools/deploy/config/production/updatewalletcrypto_address.json.production /home/ubuntu/github/gtairdroptools/Dapp/UpdateWallet/src/utils/crypto_address.json
rm -rf /home/ubuntu/github/gtairdroptools/Dapp/UpdateWallet/dist
npm run build
sudo cp -R /home/ubuntu/github/gtairdroptools/Dapp/UpdateWallet/dist/* /var/www/vhosts/UpdateWallet/
sudo chown -R www-data:www-data /var/www/vhosts/UpdateWallet

# restart apache
sudo systemctl restart apache2

# GTAPI
cd /home/ubuntu/github/gtairdroptools/gtapi
npm install
cp -R /home/ubuntu/github/gtairdroptools/gtapi/* /home/ubuntu/airdroptool/gtapi/
cp /home/ubuntu/github/gtairdroptools/deploy/config/production/emailContents.json.production /home/ubuntu/airdroptool/gtapi/emailContents.json
cp /home/ubuntu/github/gtairdroptools/deploy/config/production/.env_gtapi_production /home/ubuntu/airdroptool/gtapi/.env
cp /home/ubuntu/github/gtairdroptools/deploy/config/production/gtapi_config.js.production /home/ubuntu/airdroptool/gtapi/config.js
pm2 restart gtapi

# UpdateKYCResult
cd /home/ubuntu/github/gtairdroptools/ScheduleJob/UpdateKYCResult
npm install
cp -R /home/ubuntu/github/gtairdroptools/ScheduleJob/UpdateKYCResult/* /home/ubuntu/airdroptool/ScheduleJob/UpdateKYCResult/
cp /home/ubuntu/github/deploy_gt/UpdateKYCResult_config.js.production /home/ubuntu/airdroptool/ScheduleJob/UpdateKYCResult/config.js
pm2 restart UpdateKYCResult

# UpdateTokenSent
cd /home/ubuntu/github/gtairdroptools/ScheduleJob/UpdateTokenSent
npm install
cp -R /home/ubuntu/github/gtairdroptools/ScheduleJob/UpdateTokenSent/* /home/ubuntu/airdroptool/ScheduleJob/UpdateTokenSent/
cp /home/ubuntu/github/deploy_gt/UpdateTokenSent_config.js.production /home/ubuntu/airdroptool/ScheduleJob/UpdateTokenSent/config.js
pm2 restart UpdateTokenSent

# SelfClaim Frontend
# 1. Modify `config.ts:L9` with exact config from `generator/config.json`
pm2 stop SelfClaim
cd /home/ubuntu/github/gtairdroptools/SelfClaim/frontend
cp .env.production .env.local
npm install
npm run build
pm2 start SelfClaim