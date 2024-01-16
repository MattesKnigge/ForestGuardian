FROM python:latest

EXPOSE 8000

WORKDIR /usr/src/app

COPY django_server .
RUN pip install --no-cache-dir -r requirements.txt

CMD [ "gunicorn", "django_server.wsgi:application", "--bind", "0.0.0.0:8000" ]

