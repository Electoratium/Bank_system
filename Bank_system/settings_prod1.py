DEBUG = False
ALLOWED_HOSTS = ['*']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'db1',
        'USER' : 'bank_system',
        'PASSWORD' : 'bank_system',
        'HOST' : 'localhost',
        'PORT' : '',
    }
}