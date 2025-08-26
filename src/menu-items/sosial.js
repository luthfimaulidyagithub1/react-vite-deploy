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
      title: 'SosKes',
      type: 'collapse',
      icon: icons.IconHeart,
      children: [
        { id: 'pendidikan', title: 'Pendidikan', type: 'item', url: '/statistik/pendidikan' },
        { id: 'kesehatan', title: 'Kesehatan', type: 'item', url: '/statistik/kesehatan' },
        {
          id: 'agama-or',
          title: 'Agama & OR',
          caption: 'Agama & Olahraga',
          type: 'item',
          url: '/statistik/agama-or'
        },
        {
          id: 'perumahan',
          title: 'Perumahan',
          caption: 'Perumahan & Lingkungan',
          type: 'item',
          url: '/statistik/perumahan'
        },
        { id: 'kemiskinan', title: 'Kemiskinan', type: 'item', url: '/statistik/kemiskinan' },
        { id: 'bencana', title: 'Bencana', type: 'item', url: '/statistik/bencana' }
      ]
    }
  ]
};

export default sosial;
