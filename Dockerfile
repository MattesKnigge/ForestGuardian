FROM node:latest

EXPOSE 3000

WORKDIR /usr/src/app

COPY frontend .
RUN npm install --progress=false
RUN npm run build


CMD [ "npm", "start" ]

FROM python:latest

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

WORKDIR /usr/src/app

COPY django_server .
RUN pip install --no-cache-dir -r requirements.txt

CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000" ]

