from typing import Any
from pydantic import BaseModel
from starlite import CORSConfig, Starlite, get, post

from maia_lib.inference_models import models
from maia_lib.leela_board import LeelaBoard


# Describes a problem instance
class GameData(BaseModel):
    start_fen: str
    moves: list[str]


def get_leela_board(data: GameData):
    b = LeelaBoard(data.start_fen)
    for m in data.moves:
        b.push_uci(m)
    return b


@post("/get_pol")
def get_pol(data: GameData) -> tuple[dict[str, float], float]:
    b = get_leela_board(data)
    m19 = models.maia_kdd_1900
    pol = m19.eval_board(b, include_draw=True)
    return pol


@post("/get_val")
def get_val(data: GameData) -> tuple[dict[str, float], float]:
    b = get_leela_board(data)
    m19 = models.maia_kdd_1900
    val = m19.eval_board_val(b)
    return val


# For development, allows CORS requests.
cors_config = CORSConfig(
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app = Starlite(
    route_handlers=[
        get_pol,
        get_val,
    ],
    cors_config=cors_config,
)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=8801, reload=True)
