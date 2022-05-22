import axios from 'axios';
import Router from 'next/router';
import type { NextPage, GetServerSidePropsContext } from 'next';
import { getCookie, removeCookies } from 'cookies-next';
import Todos from '../components/Todos';
import { getAPIURL } from '../utils/api-url';
import { requiredAuthentication } from '../utils/auth/required';
import { Button } from '@chakra-ui/react'
import type { ITodos } from '../types/api';
import styles from '../styles/pages/Index.module.scss';

interface IProps {
  todos: ITodos[];
}

const Home: NextPage<IProps> = ({ todos }) => {
  return (
    <div className={styles.wrapper}>
      <Todos name="All Todos" todos={todos} />
      <Button onClick={() => {
        removeCookies('token');
        Router.push('/auth/login');
      }}>
        Logout
      </Button>
    </div>
  )
}

export async function getServerSideProps<GetServerSideProps>(ctx: GetServerSidePropsContext) {
  const auth = await requiredAuthentication(ctx);

  if (auth)
    return auth;
  const token = getCookie('token', { req: ctx.req, res: ctx.res });

  console.log(token);

  try {
    const { data: todos } = await axios.get(getAPIURL('/todos'), {
      headers: {
        authorization: `Bearer ${token}`
      }
    });

    return {
      props: {
        todos
      }
    };
  } catch (e) {
    console.error(e);

    return {
      props: {}
    }
  }
}

export default Home
