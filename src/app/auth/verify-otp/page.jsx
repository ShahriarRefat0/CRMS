import VerifyOtpForm from './VerifyOtpForm'

export default async function VerifyOtpPage(props) {
  const searchParams = await props.searchParams;
  const email = searchParams?.email || '';

  return <VerifyOtpForm email={email} />;
}
