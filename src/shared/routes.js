import Home from './Home';
import About from './About';
import User from './User';


export default [
    {
        path: '/',
        component: Home,
        exact: true,
    },
    {
        path: '/about',
        component: About,
        exact: true,
    },
    {
        path: '/user',
        component: User,
        exact: true,
    },
];
