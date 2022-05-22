import { Button, FormControl, FormErrorMessage, FormLabel, Heading, Input, useToast } from '@chakra-ui/react';
import axios, { AxiosError } from 'axios';
import type { NextPage, GetServerSidePropsContext } from 'next';
import { getCookie, removeCookies } from 'cookies-next';
import Router from 'next/router';
import { useState } from 'react';
import Header from '../components/Header';
import { getAPIURL } from '../utils/api-url';
import { requiredAuthentication } from '../utils/auth/required';
import type { IUser } from '../types/api';
import styles from '../styles/pages/User.module.scss';

interface IProps {
  user: IUser;
}

const User: NextPage<IProps> = ({ user }) => {
  const toast = useToast();
  const [ email, setEmail ] = useState<string>(user.email);
  const [ password, setPassword ] = useState<string>("");
  const [ confirm, setConfirm ] = useState<string>("");
  const [ name, setName ] = useState<string>(user.name);
  const [ firstname, setFirstname ] = useState<string>(user.firstname);
  const [ isValid, setValidity ] = useState<boolean>(true);
  const [ isUpdating, setUpdateState ] = useState<boolean>(false);
  const [ errorMessage, setErrorMessage ] = useState<string>('An error has occured. Please try again.');

  const updateUser = async (): Promise<void> => {
    setUpdateState(true);
    if (password !== confirm) {
      setUpdateState(false);
      setValidity(false);
      setErrorMessage('Passwords doesn\'t match.');
      return;
    }
    try {
      await axios.put(getAPIURL(`/users/${user.id}`), {
        email, password, firstname, name
      }, {
        headers: {
          authorization: `Bearer ${getCookie('token')}`
        }
      });

      setUpdateState(false);
      toast({
        title: 'User Updated.',
        status: 'success',
        description: `User ${name} ${firstname} has been updated.`,
        isClosable: true
      });
      setValidity(true);
    } catch (e: unknown) {
      const error = e as AxiosError<{ msg: string }>;

      setErrorMessage(error.response?.data?.msg || 'An error has occured. Please try again.');
      setValidity(false);
    }
    setUpdateState(false);
  }

  const deleteUser: () => Promise<void> = async () => {
    setUpdateState(true);

    try {
      await axios.delete(getAPIURL(`/users/${user.id}`), {
        headers: {
          authorization: `Bearer ${getCookie('token')}`
        }
      });
      removeCookies('token');
      await Router.push('/auth/register');
      toast({
        title: 'User Deleted.',
        status: 'success',
        description: `User ${name} ${firstname} has been updated.`,
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
        <Heading className={styles.title}>User Data</Heading>
        <form className={styles.user}>
          <FormControl isInvalid={!isValid}>
            <FormLabel htmlFor="firstname">Firstname</FormLabel>
            <Input
              id="firstname"
              type="firstname"
              placeholder="John"
              value={firstname}
              onInput={e => setFirstname((e.target as HTMLInputElement).value)}
            />
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
              id="name"
              type="name"
              placeholder="Doe"
              value={name}
              onInput={e => setName((e.target as HTMLInputElement).value)}
            />
            <FormLabel htmlFor="email">Email Address</FormLabel>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@email.com"
              value={email}
              onInput={e => setEmail((e.target as HTMLInputElement).value)}
            />
            <div className={styles.passwords}>
              <div>
                <FormLabel htmlFor="email">Password</FormLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="password"
                  value={password}
                  onInput={e => setPassword((e.target as HTMLInputElement).value)}
                />
              </div>
              <div>
                <FormLabel htmlFor="confirm">Confirm</FormLabel>
                <Input
                  id="confirm"
                  type="password"
                  placeholder="password"
                  value={confirm}
                  onInput={e => setConfirm((e.target as HTMLInputElement).value)}
                />
              </div>
            </div>
            <div className={styles.buttons}>
              <Button className={styles.button} variant="ghost" colorScheme="red" onClick={deleteUser}>
                Delete User
              </Button>
              <Button className={styles.button} isLoading={isUpdating} loadingText="Updating..." onClick={updateUser}>
                Update User
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
    const { data: user } = await axios.get(getAPIURL('/user'), {
      headers: {
        authorization: `Bearer ${token}`
      }
    });

    return {
      props: {
        user
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
