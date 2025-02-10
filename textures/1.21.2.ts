// 1.21.2 textures
import { updatePropertiesOfItems } from '../lib/util';
import { headers } from '../lib/constants';
import type { TexturesType } from '../lib/types';

import Prev from './1.21';

const PrevItems = updatePropertiesOfItems(
  {
    'minecraft:creeper_banner_pattern': {
      'readable': 'Creeper Charge Banner Pattern',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABa0lEQVRYhWNgGOmAEZfEpmUt/6lpkV9UDVa7mKhpCTkAw1XTunP+MzAwMIQm1FNk8PvnF1H4e3ZuYGBgYGDIKp2CYueAhwALjFHgYkjVOBeU1GdgYMAMCZg9E/acZ2RgGEwh8PrjJwhj51EGBgYGhuPSMxkYGBgYNHQsKLLgxpUTDAwMDAy3oObC7YGCAQ8BjFwQbar8n4GBgcE6zBOrBhlpCaIMfvL0BQr/6KrtDAwMDAxLT98dpLkABmAu1HR8+p+BgYEhLCabgYEBkaoJAViq19CB8FctmYpiLjoYfCGADmA+r0gORxHvmLsShY8uX95SRZQDBl8ItJQF/mdgYGDQMzCmiwMGXwjAAHoJSCjO0eVhQEhUGq8DBm8I4AL7t67HK+7oHYgiDis5YWmrpmv9IC8JCYGd61bgFUcPAVhaunThLFZ9Qy8EYIBQriAWDN4QwFX74crvuMQJgcEbAjO70+jigAEPgVEAALKUZLljua/sAAAAAElFTkSuQmCC',
    },
    'minecraft:flower_banner_pattern': {
      'readable': 'Flower Charge Banner Pattern',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABkklEQVRYhe2VzytEURTHPyP/gB2Nnc3Q5EeTUrKYUpJSlCEslB0WNn6kKZtJfmwsUBZ2iFkgG01mO42S/MhCys5EWYh/4FnMHHrnzWOaGc0tPqt7z+udc8/3nHsu/HU8bh+OdyNWMQN1D4azxiorZpB8cJxqY2XCAugbmS/I8evTtW0fjx0BMDa1ZotZcgXKZTHZ3lTUmldUNQBOJSTOavzSAyYp8PL2nl7EEgAkvZsA+PwtBQW4uz0D4D7j9zNOhpIr4LgFQ801FkBrqDPrD9XeypwcP6aebftE9ASAnfMHQ2+BICesDaYsgNDwOPDV1cLsaD8Ai1v7Nrt0vc+f3ke3121+NeYpoJHMJWON2Dt6BwCIHewBMBOZy+kA5ikQme6xAOobAza7zlDX3k2hnzBPAUFPQJ25zljbl8ILAATa6r49gLkKCPnWVhRJnqbfFOmt8PKh4ZNQo2vrNgH1PBCkl26uLrL6N18BjWTo1htyW4JdPTn5M1cB/frpmkuGbj2RKyVXwPFGy339LYybA/98AEVKfXHTTfT1AAAAAElFTkSuQmCC',
    },
    'minecraft:globe_banner_pattern': {
      'readable': 'Globe Banner Pattern',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABjUlEQVRYhe2VzytEURiGn5F/gFI0VmxGTYyRUlZTSlJqlCEslLLAwoakKZtZyGwsUBZ2iFkYKWlqymqiJD+ykLIzURbiH7gWMx/dc+fO3MxkjnhW59f9vu+85z3nwl/HZTdxuBMxSpmobzicM1dFKZN8B0tV69FpA2BgbLGowK9P16Z+MnEAwOTsqiln2RWolMZMV2tJz7yqrgWwKiF5VpKXLtBJgZe390wjkQLg1L0BgMfbUVSCu9szAO6zcT/zZCm7ApZbMNLeaAB0hnpyflDvrnUU+DH9bOqnYscAbJ8/aHoLBKmwKZA2AEKjU8CXqwshrvd4M/3Y1poprop+CqjIzk+O4gAk9nfzru/uHwLA529wVIB+CkTmggZAs6/NNC47X9rcA2B+fNA0r477/AuOCtBPAcHuBbTbuXhEEO9U17jzFqCvAnaIywO9QcCqiIq8nOKt8HJc85ewELJzQfWA+k6Il26uLnLG+z0KyNkXOnNZ5xR9FVD/fnL2qgeKRV8FNqITP1JA2RX45wPsJ2xDiSE4xQAAAABJRU5ErkJggg==',
    },
    'minecraft:mojang_banner_pattern': {
      'readable': 'Thing Banner Pattern',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABhElEQVRYhe2VTStEURjHfyNfgFI0djajJi9JKaspJSk1yhAWSllgYeMlTdlMwmwsUBZ2KLMZKWlqymqiJC9ZSNmZKAvxBa7FzEP33Hvdm5nMEb/Vee6593n5n+c8F/46PqeNg92YUcxAPYNR21hlxQzyHSxZbcQnDYC+kYWCHL88XpnsdGofgPHpNVPMkitQLoupjuainnlFTSNgVULirKYvfKCTAs+vb7lFKgPAiX8TgECwraAAtzenANzl/X7EyVNyBSy3YKi1zgBoj3TZflDrr/bk+CH7ZLIziSMAds7uNb0FgmRYH8oaAJHhCeCzq92Qrg8Ec3Zie93kV0U/BVTUyudG+23fW9raA2A5ugjAbGzeUwL6KRCbCRsADU0tpudOlav7ooQ6AZ3QTwHBbQJ29g4AEOoOA3B8mASsSlRW+b/0o68CbkjlTrYgk1N6K7qS1HwSekU9a0FVQnrp+vLc1s/vUUAqVeeB22R0Q18FnP5+Xivzir4KbMbHfiSBkivwzzshiGq5r4aWwgAAAABJRU5ErkJggg==',
    },
    'minecraft:skull_banner_pattern': {
      'readable': 'Skull Charge Banner Pattern',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABgUlEQVRYhe2VzyuDcRzHX5N/gFI0N5ep5UdSymmlJKWmjHBQygEHFz/SymUH2cUBtYMbYgeTkp5aOS1K8iMHKTeLchD/wOOwfazn+2w29rR9xeuy57vt+Xw+e+39/T7w13Hl+uBwJ2Q62ahvOJi1V4WTTX6CbaqN8LQJMDC2VFTh16dryzpuHAAwObtm6Vl2A5VyMdPV6uh/XlXXDNhNSJ/V+KULdDLw8vaeujASAJy6IwB4vB1FNbi7PQPgPl33s0+ashuw7YKR9gYToDPQk/WGendtQYUfk8+WdSJ6DMD2+YOmu0CQCRt9SRMgMDoFZFKdD0m9x5taR7fWLXVV9DOgIr98YXzwW4XnQ4sFfU8/A6E5vwnQ1NJWkgH0MyCoJ2B3/xAAvl4/YM/E8uYeACdHMSCTneoa95cD6GtAxdjftbyKEUE1Iqbk5JRsBVdimp+EuVAzoCLvSwYEydLN1UXW+36PATUD+chlSkVfA+rTT/a50+hrIBKeKMkAZTfwzweRPGYw5XhOBgAAAABJRU5ErkJggg==',
    },
    'minecraft:piglin_banner_pattern': {
      'readable': 'Snout Banner Pattern',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABgklEQVRYhe2VzytEURTHPyP/AKVorNiMmhiklNWUkqbUKENYKGWBhQ1ZTNnMymwsUPaIWRgpaWrKaqIkP7KQsjNRFuIfeBYzh959740x8zJXfDbv3nPvPefc7z33PvjreJwGDrZjhpuBBkajtrGq3AxSCpas1uOzBsDQxFJZjl8er0z9dGofgOn5VVPMiitQLY253nZXz7ymoQ2wKiFxVtIXHtBJgefXt1wjlQHgxLsBgM/fXVaA25tTAO7yfj/i5Km4ApZbMNbVbAD0RPptFzR664ty/JB9MvUziSMAts7uNb0FgmTYEswaAJHxGeCzqr9Cqt7nz/UTm2smvyr6KaBS7M7V+er9d0I/BWILYQOgNdBpsh8fJgFI7e0UdNg3OAJAoKOpqAT0U0BQX0DZuexQVUK1B0O7ANTWeQsmoK8CTgRDYcCqgJNdXk6prehyUvOX0Ak548XJYdtxscs8QWrp+vLcdt3vUUDOWL5uoa8C3/0HlIq+CmzEp34kgYor8M87nBNnTawPW8QAAAAASUVORK5CYII=',
    },
    'minecraft:flow_banner_pattern': {
      'readable': 'Flow Banner Pattern',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABeklEQVRYhe2Wu0oDQRSGv0heQEFQYieIhXhBBCGVEFhEECMYRRtBsLZSkQWbRbw0thaWilqYIIgsBKwCgoiXUrAzKAQM+gJrkZyEXXfNJAQzol81M7tzLv+eObPw1wkFPTg7tJx6OhqfNX19NdXTSS2UolqKDTgAXUYUgKn59bo4yL/cA5C2UwA82hkAdtO3IdBAgbAMcu8fhUExwrxRiLy5va8mw5K5IJmX/BRpuAJfKnNuqNMBiCZGfTd0RNqUDD9nX13zzMkFAAfXTy6fDVcg7F2QCKMJHChn3N0zXKXpKwAe7m5cdr3op4DwlssCEDMmANgyN6oyvGKtAWUFgtBXAcHbB4zJGQBGxuKu9cvzJAD26VFVAeingLUcdwB6+wd9N0jm3ow3949dc1X0U0AIOverC9NKhqV2Wloj376nrwJe5BsHITXhRTqp1Ja5ndT8LlBFtRakloI64u9VQAjqjKroq0Clf8FKp0IVfRXY21n8kQAarsA/n+TqY3BtAggVAAAAAElFTkSuQmCC',
    },
    'minecraft:guster_banner_pattern': {
      'readable': 'Guster Banner Pattern',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABeUlEQVRYhe2VPUvDUBSGn0r/gIKg1ElBHESrIgidhEIQQaxgFV0EwdlJHAouHUQXVwdHRR2sFEQCBaeCIOLHKLhZFAoW/QNxaE9LbhOblGCv6LPkfiTn482558JfJ+S2kT1KW0E6mllKOfpqC9JJM1SjWo+PWAD9RgyA+ZWtQByUXh8AyJnnADyZeQD2cnch0ECBsAyKH5/lQSXCklGOvL17uCnDkrkgmVf9VGi5AnWVuTzeZwHEklOOH/REujwZfim82eb500sADm+ebT5brkBYXZAIY0ksqGU8MDjh0/Q1AI/3tza7KvopILwXCwDEjVmg/jRsri7Y5tsHJ0Ct+kUxUcANfRUQ/PYBeV/tA27op0B6I2EBDEXHbOtXFxkAzLNjR0NSE8bcIgDR0V5PAeingKCe+8nphO3plY7OyLf7+irghlstyL9XFZJOKrWV2slofhc0wm8tNOqIv08Bwe0u8Iu+CjS6A5rNWEVfBfZ3134kgJYr8M8XWdVl4VJ8an4AAAAASUVORK5CYII=',
    },
  },
  Prev.items
);

const Textures: TexturesType = {
  ...headers,
  'items': [
    ...PrevItems,
    {
      'readable': 'Bordure Indented Banner Pattern',
      'id': 'minecraft:bordure_indented_banner_pattern',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABWUlEQVRYhWNgGOmAEZfEpmUt/6lpkV9UDVa7mKhpCTkAw1XTunP+MzAwMIQm1FNk8PvnF1H4e3ZuYGBgYGDIKp2CYueAhwALjFHgYkjVOBeU1GdgYMAMCZg9E/acZ2RgGEwh8PrjJwhj51EGBgYGhuPSMxkYGBgYNHQsKLLgxpUTDAwMDAy3oObC7YGCAQ8BjFwQbar8n4GBgcE6zBOrBhlpCaIMfvL0BQr/6KrtDAwMDAxLT98dpLkABmAu1HR8+p+BgYEhLCabgYEBkaphoCI5HIXfMXclAwMDItVr6EDEVy2ZimIuOhh8IYAOCPkcXRw9JAiBwRcCLWWB/xkYGBj0DIyxaoD5EFcaIBUMvhCAAVwlILFpAJZ2ECG5Hqu+wRsCuACpaQAWkrC0VdO1fpCXhIQAsWkABtDLEXQw9EJg5JQDhOKOXB+jg8EbAjO70+jigAEPgVEAAOZlavFl7iDRAAAAAElFTkSuQmCC',
    },
    {
      'readable': 'Field Masoned Banner Pattern',
      'id': 'minecraft:field_masoned_banner_pattern',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABe0lEQVRYhWNgGOmAEZfEpmUt/6lpkV9UDVa7mKhpCTkAw1XTunP+MzAwMIQm1FNk8PvnF1H4e3ZuYGBgYGDIKp2CYueAhwALjFHgYkjVOBeU1GdgYMAMCZg9E/acZ2RgGEwh8PrjJwhj51EGBgYGhuPSMxkYGBgYNHQsKLLgxpUTDAwMDAy3oObC7YGCAQ8BjFwQbar8n4GBgcE6zBOrBhlpCaIMfvL0BQr/6KrtDAwMDAxLT98dpLkABmAu1HR8+p+BgYEhLCabgYEBkaoJAViq19CB8FctmYpiLjoYfCGADmA+r0gOJ8pA96AIBgYGBgYDIyWi1A++EGgpC/zPwMDAoGdgjCLeMXclCh8WIujiMIBeAuICgy8EYIDSEhCWdhAhuR6rusEbAjCwfyvE5TvXrcAqjyt3IHIDJCRhaauma/0gLwnRgaN3IAMDAyIEcKV6QrkCFxj8IUAsgMU5qWDwhgB67UcobmFphVQweENgZncaXRww4CEwCgC7x2P4XyqSkgAAAABJRU5ErkJggg==',
    },
    {
      'readable': 'Black Bundle',
      'id': 'minecraft:black_bundle',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABoklEQVRYhe2WwS4DQRjHf0TSNqIqRLUX1QutIBK8ABcvwDs4eQPpyckjeABewMkL4IIoLlWRNNq06arI1kHqsPup2Rq7Fcluw/+yMzvz7c73m++bb+Cvq69bg6nUcutz/7XZUMZLj7ddfbO/2wX8tjyvVjyPjycBKFdKABjGvTIvEh5R+mazDkDdqHz5L98JDPzUcDazCMDVtdUXEuJxIjEPQMiMikkLOkn0DoG74qm9cjULhES1llTmS4y4yXcCnrMgt7HUAlhZXQBga/cCgEhkGADTfFLmy/kQ+CxwJZDNrCl7vjlnAG0SM9ksADf5PAAnx+eK/c7h2bf/CC4B8Tw6NAjA2GhcGS8UCwDsbU8Cbc8PLmMAGPUHoAdioOMccPNclE6l7dab8l6yIRS2TkAhoFPwCHhVtVYGILdv9ddT1tN5LnxUx1iv1AJZucSATs7YOCpi26nznDcmp4JHQNR4frFb1l7rssFNbtkQPAL6PSt7+qCQc1ZHnXwnoK0FyYlppQrKXkqeO6XzWO6Kga0Fnm9ETiI6OaNd57nIdwL/egcTMZUHhb/YngAAAABJRU5ErkJggg==',
    },
    {
      'readable': 'Blue Bundle',
      'id': 'minecraft:blue_bundle',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABp0lEQVRYhe2XsUvDQBSHv0pBSnSrQxEUMogURASpUgoixdHVQVdXQRxcHETExUEE/4Yurrpal1JEBFGhiIODS4dmELQUQajD9bW9pGdaEZqgvyW53l1yv+/du5fCX1ek1wnp5Vy9vV17r2j9t5ebPT1zoNcF/La6Xq04tyZsAKpPzwC8VkrauMHYiNb+qClCpauDju/qO4HoTyeOp+fUTVFdhIQ4HrWzAFTfygAk53fq4CURHgLFs7UIeLNASFiOrY2XPeKn8BDYW5mtA6SyeQD2zxsd5RrQirVIzofAZ4HvObC0mtdinvncBiCVnQZgMpkE4LGksuD64k6bv3t68+07gkug6TwRAyAe10845+EFgK2FHNByXogeqv7yPRCCPeDJAj/novjUWMffJRtiQ2qeEDApeAS6leMoZ0fOOgAZNgCwhhNAi4RUx/DUAlm5lbA9g9vl3hsFTrS2hSLh/mJyK3gEmmqc8Q7KgSkb/OSXDcEj4I6ZxFJI+MpQHU3qOwFjLZhZPNaqoMRS8twtk2P5VgxsLej6f4GbiEnu3W5yLuo7gX99AQ9MmDkeDeh0AAAAAElFTkSuQmCC',
    },
    {
      'readable': 'Brown Bundle',
      'id': 'minecraft:brown_bundle',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABoklEQVRYhe2WO0vDUBiGH6UIDoIgVBvB1rqUIihavA4igq5OUhf/g5ubuDn7JwQ3RwcHh1IUWxS0KIJawbQVhIKIi1CH9iOe0yZpRUiKvktycq7fk+9y4K+ro9UJexszle9ts/Si9O8e3be0ZmerB/htNX1asXxhdBiAk6sHANK3pjIu3BtQ2vnyJwD7p08N9/KcQMB9SGMll+drbynAIiEWJ+dGADBeP2RKBepJeE7gx1EgvhAyDAAKpuoL4iMiIdS+BHbWEhWAqaUxAO5S1wCE+7oByFv/GrDyg++jwJXA4eaikvkunt8Ai0QsHgfgJpcD4Oz4Upm/fXDuuId/CYjlkdAAYHm7KJ3JAtAViwKW5eODPdX+XB5oAx+oy4RulotmJycAyLyXle8SDUZ/sNouq/lBl/8INCvJfDofPS9IdVyfHvJnLagjICePhJwn6r6xmtBHFAEwS87r+I+A6LFQVNp20eAmt2jwHwHrlhusPYv6EEcJOb062slzAra1YGslqlRB+ZcS57rsLLa7CYn8S0CXTsROUv1EdpaLPCfwry+Wapfx/bsYoQAAAABJRU5ErkJggg==',
    },
    {
      'readable': 'Cyan Bundle',
      'id': 'minecraft:cyan_bundle',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABoklEQVRYhe2Wv0vDQBTHP211EIQoWCi4FpQuLuIg3VwEJ6GIg4rgooPg2E39DwoOuggO4iBdBRcHoTiIixRKCwXXgg4KbtLGIXkNd/FMK0Ku6HdJ7riX3Pvc+3Hw15Xo18ApFl1l4u1VHR6f9PXNZL8b+G31vFvxfDifB+CjUgGg3Wwq61LpCWXcfn4B4L1c/vJfsRMY+qlhanPLezk7BQIS4rGQwmkBMFoouBAmETuBH2eBeNjJTgGQbDaUdRIjIiE0uAQOV2ZdgLmFGQBWn9IAJDMZADqtlmrg1wfrsyCSwHippFS+vbtzICAxncsBUK/VALi/eVTs9y8fvv2HvQTE81Q2CwTRLnKvrwC4GKkCgeel+TVvfaMODEAMhCphlOeixOKS93JbVea72eCMeU+fgEn2EehVUvnWJ5cB2MWLAb0uSHe0theECHR37seASXpsHG0ceHb6Ou3GpMs+AiLpXuKRKRsiFZENFhLwz6yjTetna5KQC3VHg2InYOwFzs62ev/3z1LyXJfJY9NNSGQvAV0hIga1tWg3eS6KncC/PgFhp5fo+P68FQAAAABJRU5ErkJggg==',
    },
    {
      'readable': 'Gray Bundle',
      'id': 'minecraft:gray_bundle',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABp0lEQVRYhe2Wvy8DYRjHP6SDdtLS2EQUoYMulMSgiQETMUhq8AeI/0H8C/4Mg1gkDJIaJIqFoRrCeImUq3RoDU1quD4579Xbu4rkTvhM9977497n+36f9zn463R1OmE5u9H43K7W3pX+s8ODjtbs7nQDP43n3UrkieEJAB6f7gComKYyLhSOKO16rQrA+cnxl9/yXYHQdydOz2QAuMrnAFsJiXgwMQLAW9l6P7e41IBWJXxX4NtZIF6IxQcAMEvPyjjxiCAKBU4Bzx7YXZ9qAKQzYQD2claEr2UrcjlrQe6HwGeBqweyW9vKzTf+cgFAeiFltZNJAIqFAgCXpzfK/J3967bfCK4CEnlf1HK5uF14uL8FYDNVA+zIi/2zABiGAfwCD7RkgVvkwujYZPMpr7yXbIiEewCoNBXQETwFvCI33xFDAMSxPNAbjQG2ElIdA1sLWhSQnYsHdDi9UWLFmucYV60ZbdcJngKC3PGCLhvccMuG4Clg/+Wazi5P6KqjDt8V0NaC+dU1pQrKWUqeO9FFrPsTEoKrgBOnIjrqDrfrIhd8V+CfD6Cjnn5JwsQsAAAAAElFTkSuQmCC',
    },
    {
      'readable': 'Green Bundle',
      'id': 'minecraft:green_bundle',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABq0lEQVRYhe2WTUtCQRSGn0pEiqIPsCCQWgRhWBDRMiFpU7QKahv4Q8Lf0No/EASt3IRBLSWCkiRwYQhBXSglaVOaLcaDzdX7IQT3Rr2by9yZM3Ped87HwF9HX68Gm8mJ5vfxW1Ubcn780tOe/b068NNw7a0wj60FAchfvAPwWPrQ1g2PBbRxrVIH4OrstetZnisQcF7SHYmkMs2m1ViUEMaL8RAARlkRX14faUKnEr9HgUz6ueV5KxZQsSBKGMWgtl5ixAmeK+A6C1K7K02A1cQSAIe5EwDCkQEAjHJDWy/1wfdZ4KjAfiqslbrZ2wjQVmI+GgXgrlAAIJe91uwPji5tz/CvAsJ8ckbdcXjuU5vPnyph9qa2gTbz0kJZfW/U3fs+BjrqgBNzQWyjRSiv/5dsGBpV87WKvQP+U8AtjKLy3QhlABhkGuisC9Idf08vEM8lBqxgjg1j60HZoduVqnXbffyngODpXmq7fTY4wSkb/KeAdDGDhmnGPiYEopy5O1rBcwUse0F8Z1zrgnKXkudmWDGWt6Jve4HrF5FZEStI9xNYMRd4rsA/vgBG7Jd0jYSbagAAAABJRU5ErkJggg==',
    },
    {
      'readable': 'Light Blue Bundle',
      'id': 'minecraft:light_blue_bundle',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABsUlEQVRYhe2WPUsDQRBAn1+IRkREBCFFLBRJI0IQBQshpYVJI4r+AQtLC7EQbSwsBP0LEcTGCFqKKQRFgiJCEAsNEhBBgkhSSCKxSMa4e14uCcJd0Nft3e7dzdudmYO/Tl2lCzzLh7nv4/e3lHL/aXu6omfWV/oBv03ZXyuRd/iGAHiNXgGQjd8o8z46e5VxQ/IBgMTO0o/vst1AY7ULAwE/AOFwfiwmJOIW3wgAmfY2ANyz6zkwmrDdQNVZIGdh3N0JQCSRVObJGRHEUO0aWJ3y5QCG/YMAzD8GAWjqcgGQeUkr86U+OD4LLA30bZ4olW/ubBEomhjwegG4jcUAuDi+Vtav7EVLvsO5BiRyl6cfKJ524ej0HICt1hBQjDw0ugFA6v4ZqIEzYKiEVpELE2P5SsdlSLku2dBcqIBZtTwYcJ6BcpHKF+leAyDIJGCsC9IdHdsLDAa+Kpqn9EL9bOzPHADgKozT3AHGPyYd5xkQ0vF8BBFKZ4MVVtngPAP6nsleigkrxJzeHc2w3YBpL+hZ2FW6oOyl5LmOWcRmf0KCcw3o6EbMkO4nmEUu2G7gn08ib5qVeSy99wAAAABJRU5ErkJggg==',
    },
    {
      'readable': 'Light Gray Bundle',
      'id': 'minecraft:light_gray_bundle',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABqElEQVRYhe2WTS8DQRjHfxWuJaH4BNL0oA6tC4cmQnAQB2kcGmcJiU8gQnwEEmfpQcQBEYRIHLjgUpKm6iIh4u3Q9gusQ/fpmqm1W5HsNvxvszOzM8/veRv46wrUumFmdtr4PC6WCsp8en2jpn821HqB35br24rlQ4k+AI5OzwF4eLxX1gWDLcq4ZBLa3T788izPCTT+dGNqYhSA9NY+YJEQi2OxOAAvz28AjI0PG1BNon4IrK6syc2VWBASr+9FZb3EiJM8J+A6CxaTMQOgdyAKwN5NEwAdnSHA8rVI6oPvs8CRwNLyvFL5jOsDwCIRjkQAyGWzAFycZJT9C5tX357hXwJieTTcBUB7W7Myf3x2CUA89ARYlge6RwDI5++AOoiBqjrgZLlosL9c6Qq3O8p3yYZmsyeUtG6py38E3KpS+VoT5pdyDOh1Qbpj/fSCSkUzY8BOemz0JOeUsVQD/cWky38ERJlcHnDOBic5ZYP/COg+E19GHWKist4kp3dHO3lOwLYXpKYmlS4ovpQ812VnsbwVfdsLXL+IdCJ20qPdznKR5wT+9QHSt5pIdBVCowAAAABJRU5ErkJggg==',
    },
    {
      'readable': 'Lime Bundle',
      'id': 'minecraft:lime_bundle',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABrUlEQVRYhe2WO0vDUBTHfz4otJMUCz4Qau0gXVys0KWDhS6uKo6u4gfQTdz0A4iLiLN7HYSim/gAEUoR0VrwsVgKLi261CE5rTfpbZsiJKL/Jbk3Offe88t5BP66epwaLOwN1b6PK6VP5XlmvexozV6nB/hpdXxa8TydGgfgOPsIwPP1u/JecMyvjMtPVQDOdqpN93KdQH+3hstLKQAOyAINEuJxcn4AgMKgD4DEKjWwk3CdQNdZILEwEooA8PpWUN6TGBEJod9LYHNxugYwk5oCYL8vA0Bkwlii8KCUh3p98HwWtCWwdjKsuBbYHQUaJCZjMQBu83kALrI3iv3G4VXLPVwnoK0D4nk0HAYa0U7cuJxeHhk3huN1zysrLwDkzj8ASIT8TfNf5D0CWs8tSsZnjZs7dV6yIWBWQMkCnbxHoFPVK1/anDBagq0uSHf0bC+wEZCTR8OtDW2xsS29QAyLAORKrdfxHgHRfbGojHXZ0E7tssF7BKSLFfCZM0VHCwo5a3fUyXUC2k41txVUu6D5LSXPrdJ5rPsTEnmXgFVWIjpZo13nuch1Av/6ApI/lx7O0NsdAAAAAElFTkSuQmCC',
    },
    {
      'readable': 'Magenta Bundle',
      'id': 'minecraft:magenta_bundle',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABoklEQVRYhe2Wv0tCURiGn0KXIFAiSgejJnOLIqiWwLHdubFNgoamoCBoCMqt/oNoitZobIkEI7gFQUGS1SBeHJoKG44fdo4dr0pwr9Sz6Pml53vP+53vwF+nr9MFh8n92vf22/urNr7xtNPRb/Z3uoHfpu3dSuTT45MA5B9vAXCqd9q8oVBEa5c/XABypYMf/8t3BULdLkwvzKsvF+pDlJCI02OLALxUlEeyrNSgWQnfFeg6C8QLkXgUALdU0eaJRwRRKHAKtO2BzcxMDSCRvgEgv6f6Y+4o0DhrQe6H3s+C07kjdfMVVfvyfBeA2VXVTqY+AQg7Tn38WlufO75q6TPfFbDuTiKPR5TLxe2C4zwAEF4+AxqRTxXXACg8F4Be9IBX5EIqNQHAvdEv2TAyoLKjXHVbbiB4CrSL3HzDJxnVMag8EIvq94JUx2w8oLWgSQHZuXjAhumNpdJ2fUCfZ76YTIKngFBy9epmywYvvLIheAp4nZkXopxZHW34roC1Fmwl1rX3v5yl5LmJLWLbS0gIrgImpiI2pPoJtsgF3xX45wuqspxOMS6EkAAAAABJRU5ErkJggg==',
    },
    {
      'readable': 'Orange Bundle',
      'id': 'minecraft:orange_bundle',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABqElEQVRYhe2WP0sCYRzHP5VQRCFCFDpUg0G4RBANDi421RIUglvvwL0legm+g4YgEBprE6pBSBpqOQQbMiixJYSEQNMG/XU9dz2eSnAn9V3ujrvnuef7eX5/HvjrGul3wGVyvPX9uVL9UN4nzht9zTna7wJ+Wz2vVpxHo0EAcrkyALdPdeW74JTqqfzWBCB11fzxX64T8A06MJbcad+cnAImCXG8vToNwMPLOwDpWL0FdhKuExg4CyQWfAtRABqlnPKdxIhICA0vgcPEWgtgPb4CwOTFMQCLsxOAudciqQ+ezwJHAqWUX6l8R+UlwCSxHIkAUDAMAPLZO2X8Qeam6z+8S0Cch8IBwIx20WP2DAAjsguYzveCRQCuizVgCGLAVgmdnIvm41sAGGq6f2XDnH8MMAno5D0CvUoq30bnOc8MYK8L0h3TMbzZC2wEZOWhsMNAS2zsI70g0Lm+AlCp1rrO4z0Couf7toNQx5kuG5zklA3eI2CecqW7qSScJOSs3VEn1wloe0Fm06d0QdlLyXOrdI51JyGRdwlYZSWikzXadc5FrhP41ydn/Z/bA5y9VAAAAABJRU5ErkJggg==',
    },
    {
      'readable': 'Pink Bundle',
      'id': 'minecraft:pink_bundle',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABu0lEQVRYhe2Xu0sDQRDGf1ERRNQyvpDDRpNSLC2MFtHOykILUbARsQpYiVgKqURsLATBv0FTaIgIYhBFBRMbOQRN0gpBCEgsNkPc081DhOTQr9mb3dm7mW/nsQd/HZ5qNzwubuc/y/aTra2PRcJVvbOhWgN+GxVbK553B3wAvEQTABwlzjW9wdYuTU5mUwAsnR18+62aM9D0043W/CgAE3tKFibE47lAUOmlLQB2IA9fmXAPA/27yx6ARyQW1LwwsWD7NH2JkXJwDwMb08N5gIfhazURVYO38xmATPpV05f64P4syK7ta5UvfLylHsbV4PH7AXi4vwcgfnyjFjrUsB65LFlras6A0TrxvNHXA0Cz5dXW3w6vADjtjQFFz0MDKwBcxG8BN8ZAOc8FLZND6uEups1LNlh9FgDJRKqkAfXHQKXI2RkAAm0zAMRRMeDtbAeKTEh33BmZdUkvEMu7CzFggjM2Vqc2NVlW7afSBtQfA4L3hKrxuYJsyoZyKJcN9cdA8ZZrAcWzzDkVDRDmnN3RhJozYOwFJ8GQ1gXlLCXPnTB5LHfFuu0FFf8XOBkxQbqfwOS5oOYM/OMDC3OWnZuJSe0AAAAASUVORK5CYII=',
    },
    {
      'readable': 'Purple Bundle',
      'id': 'minecraft:purple_bundle',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABtklEQVRYhe2WPUhCURTHf2aUkURDFGhk2BIStFS0OIV7UzS0By5BYxERQWPg4h40RFPQGC1NUUEEJS1FRj4oHESMPqBseJ70+ny+ZwTvSf2X++7Xu/f8zj33XPjr8jQ6IR7aKVbW8x+PSv/2w0JD/2xpdAO/Ldu7FcsjnWEAUs+3AGgvV8o4f1uPUi+8ZwHYe1qvuZbjBFp/OjEWigJwkNbrQkIsjvhiAOQ6NACme1eKYCTRPASS6VkPGKNASGSyYWW8nBErOU7AdhSszYwVASamRgHY39B93F0MAJDzaMp4uR9cHwWWBJYGjhSft08uAmUSw5EIANepFAAnhxfK/NXds7pruJeAWB7w+wAI9gSV/tO7GwCiy1tA2fK3400A7j/PgSY4A4Z7wMpy0fjgUM12iYYubx8ABbJ1N+A+AnaVyWb0j8S8Xo7EAeO9INmxeXKB7DxA2DC4UoazcZnUS3+pXtBJ5FFfTNVyHwGRVngtfem+NosGK1lFg/sIfL9yvaWGki+FhJWEXHV2NJPjBExzwVx/QsmC4kuJ82qZWSxvRdfmAtsvomoiZpLsJzKzXOQ4gX99ASyRkmqKag8ZAAAAAElFTkSuQmCC',
    },
    {
      'readable': 'Red Bundle',
      'id': 'minecraft:red_bundle',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABsUlEQVRYhe2Xy0oCURjHf0kXMihMqPBSIQTlJiJJaNs6ok1vUPQI7aJVPUMu2rcP2vQAphERSBBIZEUkKglNhIEt5nzaGZtGI3Ck/qsz5zJzvt/5Lmfgr6ur1QWJyWD183PhXR/furtv6Z2eVjfw22p6t2J5fMwPQPKxAECq/KrNi3j7teesYY7vF4tffqvtBLp/unA5EjYb2RxQJyEWr0yMAuAvyYrhKjSS6BwC6zemdydA+YLZLyTihqHNFx9xUucQ2FmLVQFCS7MAJHePAQj4KgA8lMrafMkPro8CxzxwNDejZb701AAAC4rEdDQKwFUmA8DpyYW2fvsw/e033EtALA/39QAw4vVq42elZwA8m4tA3fLY9QsAl3nTJ1zvAw1R4GS5aN43BMC5pV+iwa/enHXYgPsINKsnlfmCBymzY7wXgIBvEKiTkOq40TG1QHYeVnXfTlbfWL1VtUD5DopEIa9nSKvcR0CUe6uolmmZXTQ4ySka3EegdsuV6qbOUkg4SchZq6Od2k7AthbshfT7v5xloEZEl53Fcld0bS1o+r/ASsROUv1EdpaL2k7gXx+8lZHY6+a+LAAAAABJRU5ErkJggg==',
    },
    {
      'readable': 'White Bundle',
      'id': 'minecraft:white_bundle',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABj0lEQVRYhe2XP0/CQBiHH4wrSRMHZWAmdJHBwAfQVRIWF5Nu+gnYWDCGDRNnR0ZHJgaYmCAk4lLCzNA6kJAwOsAAb+oVz1Ji0jb6bNe7a9/3d++fK/x1UmE3dAeD1dfxeDpV5quWFeqdR2EN+G32tlY8N7NZAOzZDIBOt6usO9vOC+52XbNW+/ZbkStwfOjGy2JRGYsS4vFtpQLAPJeTJSvYVSI5ClyVSinYzQJRwvSdvcRIEMlR4OHmYgXwOX4BwOYegI/FAoD5cqmsl/qQ/Cx4s23lzNt1C4AiGyUM0wTAtW0Ahr13ZX/zdfRjrYlcAa114vmpYQCQyWSU+fFkAoDbfwI8z8v1FgC90Wgzn7gYCPJcKOTzAHT66nPJhsK2AnYC6kH8FNgXx3EAOL9+BGDYKwNwkk4DnhLSHauNRkJ6gVguMaDDHxt3z+2DDIifAoLUeEGXDUEEZUP8FJAuVvBuMqHQdUcdkSug7QXNVkvpgqKI5LkfncdyV4xtL9j7v8CviA7XF+06z4XIFfhnDbOQla5iFvA7AAAAAElFTkSuQmCC',
    },
    {
      'readable': 'Yellow Bundle',
      'id': 'minecraft:yellow_bundle',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABp0lEQVRYhe2WvUtCURiHn6KxLLBAGqSlwYpaQoJGiZrKqTFoqqHFpTWCJheXhloa+g+ShiKcCwkh6MNBMBziggV9bUI2HN/sXDv3qgT3Sv2mczgf932f+34c+OvqavXA+c5g9fv83dLX53YfW7qzu1UDfltNWyuej8deALjJ9ANwkdWvmAhrgLguqfVEuvzjtzwn0NPuwZnVtdpoH6iTEI/j8Q8AekNqV4qhKjSS8JxA21kgsdAX3gTgrZTU9kmMiIRQ5xLYXp6uAkRjUwAMlI8ACA2rqLce9KukPnR+FhQPgrXELgJweKJm0dgSAKHRMQCeK7cAZDNX2vmt9KUjZc8JGK0Tz4ORV6Ae7aL70z0A8pU4UPd8ZUGRKuT0utA5MeDmuWhkfh2A/LHeDiUbpAJScjbAfwSalVS+2Uk1z2ZUfbDXBemOqUWf9oIGAmJ5MOJ80B4biUTStiMAQMFyLrb+IyB6ugvURsozUza4yS0b/EdAupj1VSR1Em4ScvbuaJLnBIxmnm3o73/5l5Lndpk8Nr2ERP4lYJediEnS/UQmz0WeE/jXJy5+i87647LWAAAAAElFTkSuQmCC',
    },
  ],
};

export default Textures;
