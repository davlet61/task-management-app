import type { ParsedUrlQuery } from 'node:querystring';
import { Routes } from 'types';

const navigation = [
  {
    title: 'Home',
    path: '/',
    id: '',
  },
  {
    title: 'Inbox',
    path: '/projects/1ce88c26-9e9a-44ea-b5e2-9ea6f8f1fb07',
    id: '1ce88c26-9e9a-44ea-b5e2-9ea6f8f1fb07',
  },
];

export const matchRoute = (route: Routes, path: string, q: ParsedUrlQuery) => path
  === route.path || route.id === q.id;

export default navigation;

export type NavigationType = typeof navigation;
