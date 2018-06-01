openssl pkcs12 -in cert.p12 -out apns_cert_dev.pem -clcerts -nokeys
openssl pkcs12 -in key.p12 -out apns_key_dev.pem -nocerts -nodes
