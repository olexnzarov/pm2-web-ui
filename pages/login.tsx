
import LoginPage from '../client/components/LoginPage';

import { withRedux } from '../client/middlewares/redux';
import { withAuth } from '../client/middlewares/auth'; 

export default withRedux(withAuth(LoginPage));