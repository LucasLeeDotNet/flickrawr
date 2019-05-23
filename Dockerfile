# Create image based on code-server
FROM codercom/code-server:1.939

RUN sudo apt-get -y update

RUN sudo apt-get -y upgrade

RUN sudo apt-get -y install gnupg2

RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -

RUN sudo apt-get -y update

RUN sudo apt-get -y install npm nodejs

# Install npx
RUN sudo npm install -g n npx

# Install yarn
RUN sudo apt-get install -y yarn

# Copy settings into visual studio code
COPY ./code-server-settings /home/coder/.local/share/code-server

RUN sudo chown coder:coder -R /home/coder/.local/share/code-server

EXPOSE 8443 8080