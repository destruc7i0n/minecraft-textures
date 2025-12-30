// 1.21.11 textures
import { updatePropertiesOfItems } from '../lib/util';
import { headers } from '../lib/constants';
import type { TexturesType } from '../lib/types';

import Prev from './1.21.9';

const PrevItems = updatePropertiesOfItems({}, Prev.items);

const Textures: TexturesType = {
  ...headers,
  'items': [
    ...PrevItems,
    {
      'readable': 'Camel Husk Spawn Egg',
      'id': 'minecraft:camel_husk_spawn_egg',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAB6ElEQVRYhc2XS08CMRSFP40iYlCJxCcSX5io0bjyL7j2T7t0YeLGRzRG8REICjogLnQxnAy9zqAkJvRspjNt7/Sc+2g7RJ/YWCl89eq/vLkb6sfecL8L+G+MqGGZWSbqz+cmACjMTwPQaAQAvL63OyPDcUnzrf3BK6CV7W8t2T5nxWK+VpwFoN1uO4OlSNcXZ36S/cEroMbd4wsQMcmkR8PneAqA7dJyrIFs1n23SgRNVyn9J2i2AB8UUDQGzbzjs6D1CcDm6mzsRBsDgrJCqNQaQKTkbbkKQPmp4kkWqKEV0YnO4uIMAJPWyR2kUiEjq0Q2mwGiupDPhfMtc8EfBYTMeBqIy2sXlrn1fWQvVIpavB1/FLAVMcn3rY8P4Cdj+T5JCcUCnRjzLwv+imo1rGTR7ofzPjWRip2XFAv+KiBfp8fGAKg3wopmmVv81m/hnwKrxTALrm/vgSjfz6+fgS5fJsDufhqvuqKKKPinwOnZBQB7OyUgUkK7o3a3rrx2vquS2rOjzgEW/ikg5lJCWC/kgCjKK7V3p98qItiTlncx8OMWoz3h6PAAgGqtDsB9+ckZ91B5izVoo144PrkCPDwPJN7jpIROr7ulhZ6GFBuqA8oKwTIX/FXAYnEu3/NWbJHE2GLgCnwDNlvSc+1KDmUAAAAASUVORK5CYII=',
    },
    {
      'readable': 'Copper Nautilus Armor',
      'id': 'minecraft:copper_nautilus_armor',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABbUlEQVRYhe2XvUoDQRSFv4idoAiJoBBMK8YilkoawYCWNiZgl2cQLCzT+Qx2FnkCBQWboKUWCrYBIYIGgoJ1LMwR5yabcdliR/Q0u7Pzs/d8c+/+wF9XJukCp3vl/vf29kkr1poTSQNIqsm4E6zjSnnT7YdYRMIn4HOcWd9y2hU730MkPAJxHfevzsb2WyKNTtdZPzwCUqkw77TlzOfY9ksvj/cArC5kAbjpdIEQCSgy7b0ip/l5zOWLQDQRSfNu209jAwiPgJV1UNLJgMhcdR+A5+bRyPFSYXbKaYeXA42NJac+tYeK9GC3BsB56wIYrhLr3Dpu995HBpA+ATm39Xl8fQdAfW0FGCYiArYK5Nw6Dj8HFJFISCIRpa8n4SA35Pz35MDh5YPzfrbVsLO86EywTn6aA5JI677pE7AXLBHMF42I9F7fAMjl3cHWuRxHrR8eASsfkfrMtNPpc2yVOoHEf0a2anyOrVIn8K8PCKiknCTianYAAAAASUVORK5CYII=',
    },
    {
      'readable': 'Copper Spear',
      'id': 'minecraft:copper_spear',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABY0lEQVRYhdWXsUvDQBSHv5MiqFuLREVQukUc1CGLDoIodtHBrYtOdRA3JzcXHfwbtLi4O7mpiKtFwSHQRTSDCtXFDlIwDuURmqZoi9dLfuORd5fve8ddouhS1idH/ajxnm69QKsoXROHiY+2C/UFZ3MALC4vATEwkPqvicLEh/lVANIZCwjIb/a3GuqSayBMvLPgAGBPTAHwXnkFmsn3rssAXHgfCpJsQCLkljXcMJ5Z2QAC8vJnLbI+uQZOHjw5Q3wIdn2450J+WnoEgt5LkmtA8tb/BQQ9L+4W2qo3bqDjuyDnDPoAY0N9AFzdVQAY+e4FID8zDrTuvcS4gbb3gJDPT6cBKJ57ALhPVQXgUpVHI+//cIwb+PMe+I2808TfgC5ySXwN6CaXGDfQdA5s2gM+QFYzuSQ+BoR8zbEBODi7B8B9qWn7d4AYGFBCPpetf78f3z4DcKmZXGLcQMoUucS4gR+xIHW4Nca+zAAAAABJRU5ErkJggg==',
    },
    {
      'readable': 'Diamond Nautilus Armor',
      'id': 'minecraft:diamond_nautilus_armor',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABZklEQVRYhe2XvUsDQRDFn5I01kJQDGJrIzaidewt7UIaWy1sDkELi2BjYW0TrrO0117sbASxkHiiBPwPFLS4fdF5l+SyXHEb9DXHfsxk3u929gjw1zVVNMHc+dnX7/Hbzp5XzumiBRRVxTdAHZ+0ts16BHgRCZ9AnuNmpWYDPImER8DXcfzZG7muRPaTnskfHgFqubFuxnSW51jX+/NJFwBQraf7P5J0X3gEWFmzvgjgp/IYXTM/jAjFuPvrm5EFhEdApQ7ihns6IldLawCAzafbgfup6sK8GYd3BmaPDkx/8h2y0tPDXQBA1LkAkO0SdZ5x/PI6sIDyCdC59udd5xIAsNLaApAlQmkX0Lk6Dv8MsCKSoEhimHgfRMzjnE/OGXg/bpvvs3bDzMaqCVAn456Bfrwjzd8tn4BOjEvk8eE5nXDfBkqda9do/tIJeP8vUCK8J3gT5jlWTR4BlRLJc6wqncC/vgG1Iqb2wdfyLwAAAABJRU5ErkJggg==',
    },
    {
      'readable': 'Diamond Spear',
      'id': 'minecraft:diamond_spear',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABaUlEQVRYhdXXsWsTUQCA8d+VgBHRITSxi0SiKWTUIaAtqODSpUspDs7i7CL4F9itU10EMwsBcRIc2kKXglTaQQhkMLQdSqsuIgoO6dJHSNLS1ni5yzc+eI/7vvfuHRcZElfuVdvHjY8N6wFOIopr4V7jV8sfwezYZVCYvIEUFMj8r4V6jcv1JfAsV0bH/MG3z13zRrdAr/G1hefgRfUhWPzRRL/5l7vz4E+zFTHKBQLBPHuz2DW+Mn4bHfODWv3Y+YkXGPgeCGchnPpgfmf9Hfi59gnsv36Lzt4HEi8w8BmY+v0VPD5633vNTyPxAv98Bmaq+TYUJy6C1c3voHUhDwpPHuHkvQ+MXoFgfv9WDtQ+7ILG9q+utbLl61035egXOKv5eUl/gbjMA+ktELd5IPECfd+Cp5VLbSjFbB5IT4FgPletgJfvt0Bj729s/w6koEAUzKdLV8GbjR2wErN5IPECmaTMA4kXOATrqXgkdXNz7wAAAABJRU5ErkJggg==',
    },
    {
      'readable': 'Golden Nautilus Armor',
      'id': 'minecraft:golden_nautilus_armor',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABbklEQVRYhe2XP0sDQRDFn4m2SgIi2qQTUoWDg1Q2RoQUKQ/7dH4ALVNYmg+Qzj6kTCEE/ABCIKQS7FKJCAnaGy0uj2Tmcq7HFrtiXnPM3e7evN/O3B/gv2vLdoGHVuFrNa7dzDKtmbNNwFbbWSdox0HzXF7HIBMR5wSM+2VyvFcqifh9MhHx6G4gYk3EPwK2jk3Xu1f3InZOILULKo1QxHSW1TE1f5sCAI7LeQDA89MnAB8JMLOgWQSwzHy2OOb24/NpRCjOG/eHPybgHwEt7YC1QSKFMIjj4WjteOrgUHr1rwY60a7of+4hM71o1wEsn2y6S7Rz7fj1Zb42AfcE6Fz3Z+/2EQAQXVcBJIlUGvECugvoXDv2vwaYEUlQJJEm/SSk879TA5e9D/FG1N1wcrojJmgnv60BiqR5X+cEjF9EJiJH9TMAyS8fio4pTdw5AeO7IFEjkESicCrGmxxrOSdg/Weka8TkWMs5gY2+AQ8uqFYkPveYAAAAAElFTkSuQmCC',
    },
    {
      'readable': 'Golden Spear',
      'id': 'minecraft:golden_spear',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABa0lEQVRYhdWXPUvDUBSGn9Q6lICKaOsmlC4VVETpJNhVBZe6CopDnbsKGVzEf+Cigv4CHXRwUAcRBMGPpUInP6AUXJTiUDAO6SEktqjV25u827lwD3mee3JDDNqUtYW43Wg90q4HaBZDVWM/8eruIgARNgDIjnbXa82J/lcjP3HBGgcglhoGXPJqacazT7uBlmfAT5yfd8q+uSUA3kt3AJipQ8Aln82dA3B2+2pAAAz8eQaE3Bya8Kz7ycvHlw33h9eAtVepz48zCwXLqWTaKwdxAN6ePwBY3qwB7tlLwmtAcnHvzIC8737y76LdQMv3wHSm3wYYHIgBcHr9AkCipwOArZVOoPnZS8JnQMizY70A7Bw9AVB8qHp6TY10eW7K8Bv4KflvE3wDqsglwTWgmlyi3cCXb0E+bdoAScXkkuAYEPJcJg3A+v4NAMVyTdm/AwTAgCHkk8kEANtXjwCcKCaXaDcQ1UUu0W7gE1iBe9we58GPAAAAAElFTkSuQmCC',
    },
    {
      'readable': 'Iron Nautilus Armor',
      'id': 'minecraft:iron_nautilus_armor',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABOklEQVRYhe2XMW6DMBiFX6vegI2NiQmxwDWYkG/CpSwmrsGEmJi8sXGGdnpq/RJwEAOu2rcgY8f5vy+/QwL89bxd3cAY8/lzbK09tef71QKu5uPsC5S4bVtdcspI/AZCxGVZhrY4NBKfgbPE0zQdzmucc97+8RlgiqLwxiQLEes8sywLACDLMgCAcw5AjAZYGT97Vs5rnucA9o0wXD/P82EB8RnQ7BGQ0BgDALDWHq5PksQbx9cDdV1755OErLTrOgBA3/cAHk+Jkivxtm1PC7jfAMn1fA7DAABomgbAoxEa0FNAciWOvwdYEU0wNLEXfh+wN0j+e3pgHEf9xeKdhqqqvEklebUHGJrm+95vQG+8amRdVwDfzwZGyUm8t398BjQhI2maepMhYs3tBi7/M9JnSIhYc7uB/3wByaOlgKM+LRgAAAAASUVORK5CYII=',
    },
    {
      'readable': 'Iron Spear',
      'id': 'minecraft:iron_spear',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABTElEQVRYhdWXsUrDUBSGv0gdRF0EMZkKXUIgi0ungg1kcckSBH0Cl+Q5fIHM+gQZnFwCKrg6uDWrOkRQEMFFhzjIISRtwYC3yf2XCxfOId934FxisKL4vl8uul9b1Qcsi6GqcZM4SRIAbNsGwLIsoAcGBv/VqEkcxzFQEcsZRVGtTl8DTWLP8wAIwxCAPM+BefI0TQEoisIAnQ1IhNx13dp9EARARf7y+rawXl8DWZbJDimhMtCcuZDf3d4A1ewl+hqQrH88ANXMj45PWtXra+BwvFsCDM0NAJzhFgDvX9sATA6mwPLZSzo30Po1FPLp/g4AF1fPAMweP2u9TNOsbUr9DfyVvG36b0AVuaS/BlSTSzo3MLcJT53NEmCkmFzSHwNCHo4dAM4uf1+5WfGt7N8BemDAEPLJaA+A8/snAK4Vk0s6NzDoilzSuYEf/ltzgMmfJuYAAAAASUVORK5CYII=',
    },
    {
      'readable': 'Nautilus Spawn Egg',
      'id': 'minecraft:nautilus_spawn_egg',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAACXElEQVRYhc2WTWgTQRiGn2iJioRS0BoxCq0ItQfFnxyK0FsrBQXBgqhU8SZYlB4i/hAICHrIQS314qWHQmKhguDNXlQUBRXRQxEUFZs21aqhBpUthfUw83XdTbO7gULmvSQz38638z4z3+xEqFGZIx22b3z0WaSWfCtqncByK/RsxfmebxYAbRsbXfF3xTkAXjWvUs+HJFF3Ag1BD4jzjv09rn6rfS8Ape+TALSs2wxAdOKlGgc2BJOoO4Gqs/Ou+YH2Vlf8Q+mHb+Kwe6LuBAL3gDjY0X/R1W/NfQWcPdCk98DiuOtXAJj++ds3v3kEZO17B9IAxBo3ADCc6QfgVGbIN+GYdi5VU54uSMgGuD3+1rUXzCMgEidex1uGrgFOFcQDXvDg0XPfuDkEUtu22gDHV64GIDurHIpj0ZOeLsDZ9RVVoMnNj9xzvaF78g8A5cQmGyBfmIqASQTW7m4GwDqbUh3pCwB8kfrXVRBW0b5D6k9+DIDY+RPqV7cpTAEmEZATa1A7vzw4DEBZn3gSj+fuuBJ4q8B78h0+2gvAXXHuUd0JRHZ2XbIBuj+PAtCZUDed+w0LSw7oO3cGqF4FQtCrgwsKdu69Ijqx/SRgAIGKk1Duem26Ld91ITJy81aoxOI4SOYQeJg8DUBnMQ/8R8JDJEhCzCur+Atw1l5kDgFRNjkAQKy1BYAbj9OhElVzLvn+FmYAiOr++dkSYACBxduJnAfR9U0ArEmoM05IxHftWzLBzOunrri0yx8/AY5zkTh/M37VjK9hxV09eSxrgzPT5ZKQfZFLmXUn/AfPWMo3rfd3swAAAABJRU5ErkJggg==',
    },
    {
      'readable': 'Netherite Horse Armor',
      'id': 'minecraft:netherite_horse_armor',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABHklEQVRYhWNgGAWjYBTQCMSGxf6PDYv9T0gdEz0cgw8w0spgdN+/efyIgYGBgWH78YModg6/EED3+eJVixmRxdFDYsBDgIVaBgW6+P1nYGBgkBSRZGBgYGB4/uY5ijguMHxCgEeIn4GBAeFzWFy/fPcCouAxdn2DLwTKsspQ4gzmo+hfi/EatBRKo/v83M2beHPa4AkBmM9v37qBouDH148MDAwMDJIu+A26uuoUWQ4YPCEAi2sYgPkcnoph6i5DaEldVD4MyMuqMzAwIHKFvKz6fwYGBob1ezZhTQuDJwS+vIP4mFyfwwBMPy4+Ohg8IYDuUnEhCRT+nZv3oTRxBsPM4+Dmx6tuwEMAnjKN1NUJtt8oAbhKxAEPgVEwCgDpRHDEyQNPggAAAABJRU5ErkJggg==',
    },
    {
      'readable': 'Netherite Nautilus Armor',
      'id': 'minecraft:netherite_nautilus_armor',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABVElEQVRYhe2Xv0vDQBzFnyI6SCpB0KHYSAudSiaLo/8/3UKnQqVp6VIohw0ddNGheeC9/DhDhpzoW0Lukm++73Pfby4B/rrO2gaIB4+f38+T9apRzPO2CbTVRdMb1PFoHOsljYj4T8DlOBoNXSFqifhHoKnjdPlaO68yxljx/SNABf2+dU5nLsc6T+2OewBAGIYAAGMMAB8JMDOuPTPfJafj3fUtgGoiFO/LttvaBPwjoCo4yEuDRKbxFAAwS2bl1+e67PXsAe9q4CG4sfqTa8iaeHp+AQAsFwmAYpeoc3X8cTiUJtA9ATrX/lzP5wCAwWQCoEiEBLQL6Fwd+18DdEYSFElUie8D1gad/54a2GRv+sVidcN9FFmT6uSnNUCRNJ/bPQEdKBBJ01Ii71l2Gsj3Bkqd03FVfP8IqFxEroLAmnY5VnVOoPWfke4hLseqzgn86wubrqk17kIHNAAAAABJRU5ErkJggg==',
    },
    {
      'readable': 'Netherite Spear',
      'id': 'minecraft:netherite_spear',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABO0lEQVRYhdWVO0vDUBhAT6Q+Bm3FSh+DSK0dMsTH3sFBHPxtro5uboo46Q9wdGi3LipBkHYSEcQUhzqUj5A0gcZ6892e8YZ7yTn3I3HIiVP3aJS0vpDXC6ThmDo4blz2tgBwWy4AF+dngAUFCv91UNy42KoAsLiyDITmd/fXkX3zWyBu7FSWANioVgH4CYbApHn/xQfg+ePdgXkuIIj5Wmk9sr7nHQCh+dd3kLhfvcDM3wGZBZn6NPPP/gAI715QLzDzDLwFrwC0vRMArm4uM+1XL/DnGdhv7IwADsvj6X948iPPi/UakH73gnqBzDMg5se7DQBuHzvApGETEv//cdQLTD0D05pnxf4CpswFewuYNhfsK5CXuWBPATHf3B6b+12z5oJ+ATFfrdUBGPR6gHlzQb1AQctcUC/wCyGWcbG3TSpjAAAAAElFTkSuQmCC',
    },
    {
      'readable': 'Parched Spawn Egg',
      'id': 'minecraft:parched_spawn_egg',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAB9klEQVRYhe2WQYtSURTHf0VDpjMm5iLQkqZMdEKIRipIiGjbIlrMbhbNF+ij9AVmO9QuCGIYZlHMYmgCkRgMrUxNZSDHFFEGJnizuB7tPZ/vKQXvQf1X7917znn3/O695x3413VqVodnaw81q/nn69szxTw96wL+tqZerWS++uSBbvzVm3cA5A9UqMj5X8D0JBwncMbOwJh5qVoHYCv7E4BapQ9AMp4A4E5yTlw1sCfhXgLGzDc2ywDkC590dk8fpwBYvBw2jZMrdjSAtzsfTEm4l0Cu2FEGg8zLjSowyjgUOAuA3x/S+ckZebH9FYB+r2e5AMcJjO2L7P29dByAm0tXLQN8r9cAyFU8ANTqTWBErN9VBJo/DgHYy+Z133ScgG0d6HSPdO/GOtBqtQC4lUyZ+nsXfOphQMAo9xEYnn7fMQCfG20AzvmUaa2uxv2eeeUQ/LMFuI+A6EIgAMC3A3XKhxkbJOOH7bbpfDCoEFVLVdN59xLYeb8LQOb2XeD3M9C0DCjkRPLvuBJWt2Evq7d3L4FI9BIwIiGSey17K5J6YPxbLse8ABQq+noicpzAxG7lfiatAVxPxIDxWyC1XpS8qJrl1I1rAHzc/wJAoaLIvHzt0n7AtnNdeaRIxKNqzyXDSZo2c5H7CYiExLSyy1zkOIH/OgEw+6IBNQgl6AAAAABJRU5ErkJggg==',
    },
    {
      'readable': 'Stone Spear',
      'id': 'minecraft:stone_spear',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABSElEQVRYhdWXP0vDQBiHn0gdRLoIaii0lmwdQ6WTg0OWDg7iZyhF/CB+A5EO7SfI4KRIQL+ARLdOGdQhiyCCSx3iIC9ysYH+8XqX33jkXu557r074rCiBEGQTRtfW9UCiuLoKpwnPj7qAtBoegD0+qeABQYq/1WoiFgi5De3kTJu3MDCPZAn3m+3AajXdpTv8uRhGAKQpqkDFhhYugdmJU+SZOr88hqIokj6JwOo19RznieP4xj43XtJeQ1I1j+eAGg0zwC4uBzMNd+4gYXvgW5nOwPYczcAuH98A+B9UgXA932geO8l5TMg5If+FgCj61cAxs+fSi3XdZWbsvwGZiWfN/Yb0EUusdeAbnKJcQN/3oJ+azMD8DSTS+wxIOQnnRYA51c/r9w4/dL27wAWGHCE/MDbBWD48ALAnWZyiXEDFVPkEuMGvgHY6HRCt8Y7RAAAAABJRU5ErkJggg==',
    },
    {
      'readable': 'Wooden Spear',
      'id': 'minecraft:wooden_spear',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABRklEQVRYhdWXQUsCQRiGnw2NJAJXEEWCYG97Ci92iejauR/RT+k/dNDfIB06VtClQ5Cn9BbWwYJKiEQ02A7bhzjtgKuNM77HYWfY55lvvtn1WFL2wnyUNL62rBfQxTO1sEp8sOsD4G9lATg7fwYcMJD5r4V0xBIhv269T41bNzB3DajEQSUHwHZxY+o5lbzTHQDw2Bt44ICBhWtgVvL+53fi/NU1cPvQl/qJYGJAR/7yMQImey9ZXQOSwi+xkDdvXlPNt25g7j5wVCtGADvl+BRc3b8BMBzF7aHkrwP6vZdYN5C6BnTk7e6XSph4/6uxbmDmGkhBniruGxDyw2oBgMZF/CWzKLnEXQOmySXWDfzpAyfhZgQQGCaXuGNAyI9rIQCnzRYA7d7Y2L8DOGDAE/L9oARA/e4JgEvD5BLrBjK2yCXWDfwA2LNwalDlF9kAAAAASUVORK5CYII=',
    },
    {
      'readable': 'Zombie Nautilus Spawn Egg',
      'id': 'minecraft:zombie_nautilus_spawn_egg',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAACYUlEQVRYhc2WT0hUURTGfxMRhkikI0kEkQuZapFFuXCcTdFiFgVtCqIWuc7aZEroqiE0W2WroD/QH6jNtDLQZU4LLdJFo01gNbSQ5zOxSZvaTIvjmcd9M2+aAeG9b3PfPffe8+73nXPPvSFqRN/leKHS+PC916Fa/G2pdQObja3VTlTm7Z1RAI4clda2lwDIfs3IPChA9UoEXwE389iJUwCMTZ0x5mXzokR7Z5+sq1KJ4CrgZv4xPwxADFGgIddt2MfWcwBc7Iqafv6jRHAVUMy8TQHQMzhp2PUUjIwL897GRNl1lmVV9O+7AiVx0dh3X7kOQP2ORgBGb/YD0DM4BMDa6g/AqQPhcDMAD+/eBpzcyX6aA2B+bh6ARy/fG//0XQHPHFAmylihzJ9MngYgHnlg9KHLmK/MvRAcBdyxHxq4VnaBw9TEwTqpgDOkyo5H9kcAuHRW6oLmQnAU8ILG3A2tfPGNvtYFPf+JzFMAOqiv6D84Cow+mwbAsiT2/Yk7gBNzy2oDYHa9fOVTFCtfWJqpA2vykZbT8GLimzHffwUOnbxRAPj87j4AbxbyMlI8BW3Ggj+2ZHPClhgPcAFwKqGiI23Gvuh3A/pf/xVwG5qa6gBIr0p/eVl2HmsVu5vZeDop7aukYXcz9oLvCoQ0FtuadwKwknkMOErUClXMjV8/xb5r7znD7rsCJTmw+7jc+w2t+wCwk1ercuTFXP39/r5o2P8urQABUKD4OnHnwvY9LYCjRMvhaMligMUPKWNc+7mFL4A389mJW8G4DUvehMfOjxTA2elmQZWdft4brDfhP3Jm3IQ9YS/tAAAAAElFTkSuQmCC',
    },
  ],
};

export default Textures;
