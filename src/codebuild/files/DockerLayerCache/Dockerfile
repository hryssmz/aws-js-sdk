FROM ubuntu:22.04

# Install Python dependencies
ENV LANG C.UTF-8
RUN ln -fs /usr/share/zoneinfo/Etc/UTC /etc/localtime
RUN apt-get update -y && apt-get upgrade -y \
  && apt-get install -y --no-install-recommends \
    build-essential \
    ca-certificates \
    curl \
    gdb \
    lcov \
    pkg-config \
    libbz2-dev \
    libffi-dev \
    libgdbm-dev \
    libgdbm-compat-dev \
    liblzma-dev \
    libncurses5-dev \
    libreadline6-dev \
    libsqlite3-dev \
    libssl-dev \
    lzma \
    lzma-dev \
    tk-dev \
    uuid-dev \
    zlib1g-dev

# Install Python 3.9
ENV PYTHON_VERSION 3.9.17
WORKDIR /tmp
RUN curl -sSL https://www.python.org/ftp/python/${PYTHON_VERSION}/Python-${PYTHON_VERSION}.tgz | tar zxf -

WORKDIR /tmp/Python-${PYTHON_VERSION}
RUN ./configure --enable-optimizations && make && make install

WORKDIR /usr/local/bin
RUN rm -rf /tmp/Python-${PYTHON_VERSION} \
  && ln -sf python3 python \
  && ln -sf pip3 pip \
  && pip install --upgrade pip

# Install Python libraries and app
WORKDIR /app
COPY ./requirements.txt ./requirements.txt
RUN pip install -r ./requirements.txt
COPY . .

WORKDIR /
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
