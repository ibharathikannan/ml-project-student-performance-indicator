# 1. Use a supported Debian version with Python 3.8
FROM python:3.8-slim-bullseye

# 2. Set the working directory
WORKDIR /app

# 3. Copy the project files
COPY . /app

# 4. Install Gunicorn along with your project dependencies
RUN pip install --no-cache-dir gunicorn -r requirements.txt

# 5. Production-ready entry point binding to all interfaces on port 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]