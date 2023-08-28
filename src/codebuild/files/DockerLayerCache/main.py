from datetime import datetime
from urllib.request import Request, urlopen

from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root() -> dict[str, str]:
    req = Request("http://ifconfig.me")
    global_ip: str = ""
    with urlopen(req) as res:
        global_ip = res.read().decode("utf8")

    response = {
        "timestamp": datetime.utcnow().isoformat(),
        "global_ip": global_ip,
    }
    return response
