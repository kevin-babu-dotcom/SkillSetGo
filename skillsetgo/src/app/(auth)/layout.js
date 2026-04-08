export const metadata = {
  title: 'Authentication - SkillSetGo',
  description: 'Login or signup to SkillSetGo',
}

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
