FROM busybox:1.36.1

WORKDIR /theme

COPY dist_keycloak/*.jar /theme/

CMD ["cp", "-r", "/theme/.", "/providers/"]
