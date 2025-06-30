// 1.21.7 textures
import { updatePropertiesOfItems } from '../lib/util';
import { headers } from '../lib/constants';
import type { TexturesType } from '../lib/types';

import Prev from './1.21.6';

const PrevItems = updatePropertiesOfItems({}, Prev.items);

const Textures: TexturesType = {
  ...headers,
  'items': [
    ...PrevItems,
    {
      'readable': 'Lava Chicken Disc',
      'id': 'minecraft:music_disc_lava_chicken',
      'texture':
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABTUlEQVRYhe2Wv0rDUBSHv4pLxkARJ0NoF6FjhzyAg+QBfADJ0AdwECFTFiEv0CEIHVx8gC71AbJbkEJLwEmkkLFjXHrE3OaS6yCJmG/Jv3MO+X25hAsdHf+dnmmh67qFSV2WZcYzAY5+UvwbHKs3dEkdxzGdWdmvM9MeA5K8Lqlt2wDkeV66NqCAQxPNG9AlV5NJ4sfxGADr7gaA+fwZgDiOK/ul79v8konmDag31DcXHjYbAN73x8vZDIDV6qVUJybUNaLOExo30Lvq9wuAj9Go9KDOhHA6mQDgLxalPkHtP1kuAXjabtuxBr4M3FsWANeDQWWhLlndNxbE3O1uB7TJgJyoJoTX6RSAJEkAfVIxEQQBAOf7tSGoyYX2GBDEhPA2HAIQhiEAvn9ROUj+iFEUAXC2Xpeeq8mF9hnQ4Xme0Y4oTdO/tSPq6Oj4BDTzehOndxmMAAAAAElFTkSuQmCC',
    },
  ],
};

export default Textures;
