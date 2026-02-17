# Using 1.51.1 playwright image for consistency/compatibility
FROM mcr.microsoft.com/playwright:v1.51.1

# Install display tools (Xvfb, Window Manager, VNC), Supervisor
RUN apt-get update && apt-get install -y \
    xvfb \
    fluxbox \
    x11vnc \
    supervisor \
    novnc \
    websockify \
    && rm -rf /var/lib/apt/lists/*

# Create noVNC symlink for easier access
RUN ln -s /usr/share/novnc/vnc.html /usr/share/novnc/index.html

# Copy Supervisor config
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Set display env var
ENV DISPLAY=:99

# Set working dir
WORKDIR /app

# Copy deps
COPY package*.json ./

# Install deps
RUN npm install

# Expose noVNC port
EXPOSE 6080

# Start Supervisor
CMD ["/usr/bin/supervisord"]