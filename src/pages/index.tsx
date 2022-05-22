import axios from 'axios';
import type { NextPage, GetServerSidePropsContext } from 'next';
import { getCookie } from 'cookies-next';
import Header from '../components/Header';
import Todos from '../components/Todos';
import { getAPIURL } from '../utils/api-url';
import { requiredAuthentication } from '../utils/auth/required';
import type { ITodo } from '../types/api';
import styles from '../styles/pages/Index.module.scss';

interface IProps {
  todos: ITodo[];
}

const Home: NextPage<IProps> = ({ todos }) => {
  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <Todos name="All Todos" todos={todos} />
      </div>
    </>
  )
}

export async function getServerSideProps<GetServerSideProps>(ctx: GetServerSidePropsContext) {
  const auth = await requiredAuthentication(ctx);
  if (auth)
    return auth;
  const token = getCookie('token', { req: ctx.req, res: ctx.res });
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
