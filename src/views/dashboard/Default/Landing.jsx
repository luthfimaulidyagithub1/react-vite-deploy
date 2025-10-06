// import AuthWrapper1 from './AuthWrapper1';
import AuthWrapper1 from '../../pages/authentication/AuthWrapper1';

import IntroPopup from '../../../ui-component/IntroPopup';

export default function Beranda() {
  return (
    <AuthWrapper1>
      <IntroPopup />
    </AuthWrapper1>
  );
}
