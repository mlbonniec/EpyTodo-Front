import { checkCookies, setCookies } from 'cookies-next';
import type { NextPage, GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import Router from 'next/router';
import axios, { AxiosError } from 'axios';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Heading, Text
} from '@chakra-ui/react';
import { useState } from 'react';
import styles from '../../styles/pages/Auth.module.scss';
import { getAPIURL } from '../../utils/api-url';

const Login: NextPage = () => {
  const [ email, setEmail ] = useState<string>("");
  const [ password, setPassword ] = useState<string>("");
  const [ isValid, setValidity ] = useState<boolean>(true);
  const [ isSigningIn, setSigningState ] = useState<boolean>(false);
  const [ errorMessage, setErrorMessage ] = useState<string>('An error has occured. Please try again.');

  const signIn = async (): Promise<void> => {
    setSigningState(true);
    try {
      const { data } = await axios.post(getAPIURL('/login'), {
        email, password
      });

      if (!data.token)
        return setValidity(false);
      setCookies('token', data.token);
      await Router.push('/');
    } catch (e: unknown) {
      const error = e as AxiosError<{ msg: string }>;

      setErrorMessage(error.response?.data?.msg || 'An error has occured. Please try again.');
      setValidity(false);
    }
    setSigningState(false);
  }

  return (
    <div className={styles.wrapper}>
      <Heading className={styles.title}>Sign-In</Heading>
      <form className={styles.auth}>
        <FormControl isInvalid={!isValid}>
          <FormLabel htmlFor="email">Email Address</FormLabel>
          <Input
            id="email"
            type="email"
            placeholder="john.doe@email.com"
            value={email}
            onInput={e => setEmail((e.target as HTMLInputElement).value)}
          />
          <FormLabel htmlFor="email">Password</FormLabel>
          <Input
            id="password"
            type="password"
            placeholder="password"
            value={password}
            onInput={e => setPassword((e.target as HTMLInputElement).value)}
          />
          <Button className={styles.button} isLoading={isSigningIn} loadingText="Signing In..." onClick={signIn}>
            Sign In
          </Button>
          <FormErrorMessage>{errorMessage}</FormErrorMessage>
          <Text className={styles.redirect}>Don&apos;t have an account? <Link href="/auth/register">Sign-Up</Link></Text>
        </FormControl>
      </form>
    </div>
  );
}

export async function getServerSideProps<GetServerSideProps>(ctx: GetServerSidePropsContext) {
  const hasToken: boolean = checkCookies('token', { req: ctx.req, res: ctx.res });

  if (hasToken)
    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    }

  return {
    props: {}
  };
}


export default Login;
