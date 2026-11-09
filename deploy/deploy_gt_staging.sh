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
cp /home/ubuntu/github/deploy_gt/airdropbaseUrl.json.staging /home/ubuntu/github/gtairdroptools/Dapp/Airdrop/src/utils/baseUrl.json
cp /home/ubuntu/github/deploy_gt/Airdrop.json.staging /home/ubuntu/github/gtairdroptools/Dapp/Airdrop/src/utils/Airdrop.json
cp /home/ubuntu/github/deploy_gt/token.json.staging /home/ubuntu/github/gtairdroptools/Dapp/Airdrop/src/utils/token.json
cp /home/ubuntu/github/deploy_gt/airdropcrypto_address.json.staging /home/ubuntu/github/gtairdroptools/Dapp/Airdrop/src/utils/crypto_address.json
cp /home/ubuntu/github/deploy_gt/parameter_config.json.staging /home/ubuntu/github/gtairdroptools/Dapp/Airdrop/src/utils/parameter_config.json
rm -rf /home/ubuntu/github/gtairdroptools/Dapp/Airdrop/dist
npm run build
sudo rm -rf /var/www/vhosts/Airdrop/*
sudo cp -R /home/ubuntu/github/gtairdroptools/Dapp/Airdrop/dist/* /var/www/vhosts/Airdrop/
sudo chown -R www-data:www-data /var/www/vhosts/Airdrop

# UpdateWallet
cd /home/ubuntu/github/gtairdroptools/Dapp/UpdateWallet
npm install
cp /home/ubuntu/github/deploy_gt/updatewalletbaseUrl.json.staging /home/ubuntu/github/gtairdroptools/Dapp/UpdateWallet/src/utils/baseUrl.json
cp /home/ubuntu/github/deploy_gt/updatewalletcrypto_address.json.staging /home/ubuntu/github/gtairdroptools/Dapp/UpdateWallet/src/utils/crypto_address.json
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
cp /home/ubuntu/github/deploy_gt/emailContents.json.staging /home/ubuntu/airdroptool/gtapi/emailContents.json
cp /home/ubuntu/github/deploy_gt/.env_staging /home/ubuntu/airdroptool/gtapi/.env
cp /home/ubuntu/github/deploy_gt/gtapi_config.js.staging /home/ubuntu/airdroptool/gtapi/config.js
pm2 restart gtapi

# UpdateKYCResult
cd /home/ubuntu/github/gtairdroptools/ScheduleJob/UpdateKYCResult
npm install
cp -R /home/ubuntu/github/gtairdroptools/ScheduleJob/UpdateKYCResult/* /home/ubuntu/airdroptool/ScheduleJob/UpdateKYCResult/
cp /home/ubuntu/github/deploy_gt/UpdateKYCResult_config.js.staging /home/ubuntu/airdroptool/ScheduleJob/UpdateKYCResult/config.js
pm2 restart UpdateKYCResult

# UpdateTokenSent
cd /home/ubuntu/github/gtairdroptools/ScheduleJob/UpdateTokenSent
npm install
cp -R /home/ubuntu/github/gtairdroptools/ScheduleJob/UpdateTokenSent/* /home/ubuntu/airdroptool/ScheduleJob/UpdateTokenSent/
cp /home/ubuntu/github/deploy_gt/UpdateTokenSent_config.js.staging /home/ubuntu/airdroptool/ScheduleJob/UpdateTokenSent/config.js
pm2 restart UpdateTokenSent
