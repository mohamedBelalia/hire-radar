FROM python:3.10-slim

WORKDIR /app

# copy only requirements first
COPY requirements.txt .

# install python packages
RUN pip install --no-cache-dir -r requirements.txt

# copy everything else
COPY . .

ENV FLASK_APP=api.server:app
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5000

EXPOSE 5000

CMD ["python", "-m", "api.server"]
