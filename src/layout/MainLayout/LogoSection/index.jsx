// import { Link as RouterLink } from 'react-router-dom';

// // material-ui
// import Link from '@mui/material/Link';

// // project imports
// import { DASHBOARD_PATH } from 'config';
// import Logo from 'ui-component/Logo';

// // ==============================|| MAIN LOGO ||============================== //

// export default function LogoSection() {
//   return (
//     <Link component={RouterLink} to={DASHBOARD_PATH} aria-label="theme-logo">
//       <Logo />
//     </Link>
//   );
// }

import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import { DASHBOARD_PATH } from 'config';
import sipadaIcon from '../../../assets/icons/sipadaicon_full.svg';

export default function LogoSection() {
  return (
    <Link component={RouterLink} to={DASHBOARD_PATH} aria-label="theme-logo">
      <img src={sipadaIcon} alt="SIPADA Logo" style={{ height: 43 }} />
    </Link>
  );
}
