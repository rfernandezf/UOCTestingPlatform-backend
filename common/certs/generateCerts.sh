#!/bin/bash

openssl req -x509 -newkey rsa:4096 -keyout server.key -out server.crt -sha256 -days 3650 -nodes -subj "/C=XX/ST=Spain/L=Barcelona/O=UOC/OU=UOC/CN=localhost"
