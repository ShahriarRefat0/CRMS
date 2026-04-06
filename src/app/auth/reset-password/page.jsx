import ResetPasswordForm from './ResetPasswordForm'

export default function ResetPasswordPage({ searchParams }) {
  const email = searchParams?.email || ''
  return <ResetPasswordForm email={email} />
}
