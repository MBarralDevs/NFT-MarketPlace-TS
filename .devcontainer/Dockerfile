FROM mcr.microsoft.com/devcontainers/javascript-node:1-22-bookworm

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
     && apt-get -y install --no-install-recommends git curl unzip ca-certificates libssl-dev libc-dev libstdc++6 ca-certificates lsof \
     && apt-get autoremove --yes \
     && apt-get clean --yes \
     && rm -rf /var/lib/apt/lists/*

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
ENV COREPACK_ENABLE_AUTO_PIN=0

# Install pnpm and node 22
RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install 22 && npm install -g npm@latest && npm install -g corepack@latest && corepack enable"

USER node

# Install foundry
RUN curl -L https://foundry.paradigm.xyz | bash
RUN /home/node/.foundry/bin/foundryup
RUN echo 'export PATH="$PATH:/home/node/.foundry/bin"' >> /home/node/.zshenv

# Install Rindexer - Updated installation method
RUN curl --proto '=https' --tlsv1.2 -LsSf https://rindexer.xyz/install.sh | sh
RUN echo 'export PATH="$PATH:/home/node/.rindexer/bin"' >> /home/node/.zshenv
RUN echo "alias rindexerup='bash /home/node/.rindexer/bin/rindexerup \$@'" >> /home/node/.zshenv
RUN echo "alias rindexerdown='bash /home/node/.rindexer/bin/rindexerdown'" >> /home/node/.zshenv

