FROM ubuntu:20.04

WORKDIR /var/git

RUN apt-get update && apt-get install -y locales && rm -rf /var/lib/apt/lists/* \
    && localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8

ENV LANG en_US.utf8

ARG DEBIAN_FRONTEND=noninteractive

ENV TZ=Europe/Budapest

RUN apt-get update && apt-get install -y tzdata

RUN apt-get update && apt-get install -y git

RUN addgroup git

RUN useradd -p $(openssl passwd -1 1234) -g git git

RUN mkhomedir_helper git

RUN chown git:git /var/git

RUN apt-get update && apt-get install -y openssh-server

RUN mkdir /var/git/home.git

RUN git init /var/git/home.git --bare

RUN git clone https://github.com/samerbahri98/dodecahedron.git /var/git/dodecahedron.git --bare

RUN apt-get update && apt-get install -y apache2

RUN apt-get update && apt-get install -y apache2-utils

RUN rm /etc/apache2/apache2.conf

COPY apache2.conf /etc/apache2/

RUN a2enmod cgi alias env

RUN chgrp -R www-data /var/git

RUN htpasswd -b -c /var/git/.htpasswd git git

RUN service apache2 restart

RUN service ssh start

EXPOSE 22

CMD ["/usr/sbin/sshd","-D"]