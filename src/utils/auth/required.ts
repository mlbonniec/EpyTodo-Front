import type { GetServerSidePropsContext } from 'next';
import { checkCookies } from 'cookies-next';

export async function requiredAuthentication<GetServerSideProps>(ctx: GetServerSidePropsContext) {
  const hasToken: boolean = checkCookies('token', { req: ctx.req, res: ctx.res });

  if (hasToken)
    return null;
  return {
    redirect: {
      permanent: false,
      destination: '/auth/login',
    }
  }
}
