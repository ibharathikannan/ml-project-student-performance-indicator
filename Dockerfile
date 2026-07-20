# 1. Use a supported Debian version with Python 3.8
FROM python:3.8-slim-bullseye

# 2. Set the working directory
WORKDIR /app

# 3. Copy the project files
COPY . /app

# 4. Install Python dependencies cleanly
RUN pip install --no-cache-dir -r requirements.txt

# 5. Define your entry point (e.g., CMD ["python", "app.py"])
CMD ["python", "app.py"]