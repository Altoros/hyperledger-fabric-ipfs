import {HomePage, LoginPage} from '../_pages';

export const publicRoutes = [{
  component: HomePage,
  path: '/'
}, {
  component: LoginPage,
  path: '/login'
}];

export const privateRoutes = [];
