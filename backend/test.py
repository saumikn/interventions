from time import perf_counter

import maia_lib
from maia_lib.inference_models import models
from maia_lib.leela_board import LeelaBoard

print(models.model_list)
m19 = models.maia_kdd_1900

b = LeelaBoard()

print('Eval Policy')
st = perf_counter()
print(m19.eval_board(b, include_draw=True))
print(perf_counter() - st)


print('Eval Val')
st = perf_counter()
print(m19.eval_board_val(b))
print(perf_counter() - st)