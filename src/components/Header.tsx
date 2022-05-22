import { Button, useToast } from '@chakra-ui/react';
import { removeCookies } from 'cookies-next';
import Link from 'next/link';
import Router from 'next/router';
import type { FC } from 'react';
import styles from '../styles/components/Header.module.scss';

const Header: FC = () => {
  const toast = useToast();

  const logout: () => Promise<void> = async () => {
    removeCookies('token');
    await Router.push('/auth/login');
    toast({
      title: 'Logout',
      description: 'User successfully logged out.',
      status: 'success',
    })
  }

  return (
    <header className={styles.header}>
      <nav>
        <Link href="/">
          <a>All Todos</a>
        </Link>
        <Link href="/todos/new">
          <a>New Todo</a>
        </Link>
      </nav>
      <div className={styles.buttons}>
        <Button variant="ghost" onClick={() => logout()}>
          Logout
        </Button>
        <Link href="/user">
          <a>
            <Button>
              Account
            </Button>
          </a>
        </Link>
      </div>
    </header>
  );
}

export default Header;
