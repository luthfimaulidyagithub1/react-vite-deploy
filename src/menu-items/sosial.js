// assets
import { IconHeart } from '@tabler/icons-react';

const icons = { IconHeart };

const sosial = {
  id: 'sosial',
  title: 'Sosial & Kesejahteraan',
  type: 'group',
  children: [
    {
      id: 'sosial-collapse',
      title: 'Sosial & Kesejahteraan',
      type: 'collapse',
      icon: icons.IconHeart,
      children: [
        { id: 'pendidikan', title: 'Pendidikan', type: 'item', url: '/statistik/pendidikan', icon: icons.IconHeart },
        { id: 'kesehatan', title: 'Kesehatan', type: 'item', url: '/statistik/kesehatan', icon: icons.IconHeart },
        {
          id: 'agama-or',
          title: 'Agama & Olahraga',
          caption: 'Agama & Olahraga',
          type: 'item',
          url: '/statistik/agama-or',
          icon: icons.IconHeart
        },
        {
          id: 'perumahan',
          title: 'Perumahan & Lingkungan',
          caption: 'Perumahan & Lingkungan',
          type: 'item',
          url: '/statistik/perumahan',
          icon: icons.IconHeart
        },
        { id: 'kemiskinan', title: 'Kemiskinan', type: 'item', url: '/statistik/kemiskinan', icon: icons.IconHeart },
        { id: 'bencana', title: 'Bencana Alam', type: 'item', url: '/statistik/bencana', icon: icons.IconHeart }
      ]
    }
  ]
};

export default sosial;
