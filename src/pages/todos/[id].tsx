import { Button, FormControl, FormErrorMessage, FormLabel, Heading, Input, Select, useToast } from '@chakra-ui/react';
import axios, { AxiosError } from 'axios';
import type { NextPage, GetServerSidePropsContext } from 'next';
import { getCookie } from 'cookies-next';
import { useState } from 'react';
import Header from '../../components/Header';
import { getAPIURL } from '../../utils/api-url';
import { requiredAuthentication } from '../../utils/auth/required';
import type { ITodo } from '../../types/api';
import styles from '../../styles/pages/User.module.scss';
import formatSQLDate from '../../utils/format-sql-date';

interface IProps {
  todo: ITodo;
}

const User: NextPage<IProps> = ({ todo }) => {
  const toast = useToast();
  const [ title, setTitle ] = useState<string>(todo.title);
  const [ description, setDescription ] = useState<string>(todo.description);
  const [ status, setStatus ] = useState<string>(todo.status);
  const [ isValid, setValidity ] = useState<boolean>(true);
  const [ isUpdating, setUpdateState ] = useState<boolean>(false);
  const [ errorMessage, setErrorMessage ] = useState<string>('An error has occured. Please try again.');
  const statusList: string[] = ['not started', 'in progress', 'done'];

  const updateTodo = async (): Promise<void> => {
    setUpdateState(true);
    try {
      await axios.put(getAPIURL(`/todos/${todo.id}`), {
        title,
        description,
        status,
        user_id: todo.user_id,
        due_time: formatSQLDate(todo.due_time)
      }, {
        headers: {
          authorization: `Bearer ${getCookie('token')}`
        }
      });

      setUpdateState(false);
      toast({
        title: 'Todo Updated.',
        status: 'success',
        description: `Todo has been updated.`,
        isClosable: true
      });
      setValidity(true);
    } catch (e: unknown) {
      const error = e as AxiosError<{ msg: string }>;

      console.log(error);
      setErrorMessage(error.response?.data?.msg || 'An error has occured. Please try again.');
      setValidity(false);
    }
    setUpdateState(false);
  }

  const deleteTodo: () => Promise<void> = async () => {
    setUpdateState(true);

    try {
      await axios.delete(getAPIURL(`/todos/${todo.id}`), {
        headers: {
          authorization: `Bearer ${getCookie('token')}`
        }
      });
      toast({
        title: 'Todo Deleted.',
        status: 'success',
        description: `Todo n°${todo.id} has been updated.`,
        isClosable: true
      });
    } catch (e: unknown) {
      const error = e as AxiosError<{ msg: string }>;

      setErrorMessage(error.response?.data?.msg || 'An error has occured. Please try again.');
      setValidity(false);
    }
    setUpdateState(false);
  };

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <Heading className={styles.title}>Todo n°{todo.id}</Heading>
        <form className={styles.user}>
          <FormControl isInvalid={!isValid}>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input
              id="title"
              type="title"
              placeholder="Title"
              value={title}
              onInput={e => setTitle((e.target as HTMLInputElement).value)}
            />
            <FormLabel htmlFor="description">Description</FormLabel>
            <Input
              id="description"
              type="text"
              placeholder="Description"
              value={description}
              onInput={e => setDescription((e.target as HTMLInputElement).value)}
            />
            <FormLabel htmlFor="description">Status</FormLabel>
            <Select className={styles.status} defaultValue={todo.status} onChange={e => setStatus(e.target.value)}>
              {statusList && statusList.map(e => (
                <option key={e} value={e}>{e}</option>
              ))}
            </Select>
            <div className={styles.buttons}>
              <Button className={styles.button} variant="ghost" colorScheme="red" onClick={deleteTodo}>
                Delete Todo
              </Button>
              <Button className={styles.button} isLoading={isUpdating} loadingText="Updating..." onClick={updateTodo}>
                Update Todo
              </Button>
            </div>
            <FormErrorMessage>{errorMessage}</FormErrorMessage>
          </FormControl>
        </form>
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
    const id = ctx.params?.id;
    const { data: todo } = await axios.get(getAPIURL(`/todos/${id}`), {
      headers: {
        authorization: `Bearer ${token}`
      }
    });

    console.log(todo);

    return {
      props: {
        todo
      }
    };
  } catch (e) {
    console.error(e);

    return {
      props: {}
    }
  }
}

export default User;
