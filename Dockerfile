FROM ghcr.io/cirruslabs/flutter:stable AS builder
WORKDIR /app
# Copy only dependency files first so pub get is cached unless pubspec changes
COPY pubspec.yaml pubspec.lock ./
RUN flutter pub get
# Copy remaining source and build
COPY . .
# Replace api_key.dart with empty strings so no secrets are compiled into the web bundle
RUN printf 'const String wapi_Key = "";\nconst String access_key = "";\nconst String timezonedbKey = "";\n' > lib/api_key.dart
RUN flutter build web --release

FROM nginx:alpine
COPY --from=builder /app/build/web /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
