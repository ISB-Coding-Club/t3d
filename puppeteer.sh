#!/bin/bash

ARCH="$(dpkg --print-architecture)"

MAIN_PACKAGES="\
    ca-certificates:${ARCH} fonts-liberation:${ARCH} libappindicator3-1:${ARCH} \
    libasound2:${ARCH} libatk-bridge2.0-0:${ARCH} libatk1.0-0:${ARCH} libc6:${ARCH} \
    libcairo2:${ARCH} libcups2:${ARCH} libdbus-1-3:${ARCH} libexpat1:${ARCH} \
    libfontconfig1:${ARCH} libgbm1:${ARCH} libgcc1:${ARCH} libglib2.0-0:${ARCH} \
    libgtk-3-0:${ARCH} libnspr4:${ARCH} libnss3:${ARCH} libpango-1.0-0:${ARCH} \
    libpangocairo-1.0-0:${ARCH} libstdc++6:${ARCH} libx11-6:${ARCH} libx11-xcb1:${ARCH} \
    libxcb1:${ARCH} libxcomposite1:${ARCH} libxcursor1:${ARCH} libxdamage1:${ARCH} \
    libxext6:${ARCH} libxfixes3:${ARCH} libxi6:${ARCH} libxrandr2:${ARCH} libxrender1:${ARCH} \
    libxss1:${ARCH} libxtst6:${ARCH} lsb-release:${ARCH} wget:${ARCH} xdg-utils:${ARCH} \
"

sudo apt -y install \
    ${MAIN_PACKAGES}

node node_modules/puppeteer/install.js
