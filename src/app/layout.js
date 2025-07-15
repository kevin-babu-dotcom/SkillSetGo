import "@app/styles/globals.css";

export const metadata = {
  title: "SkillsetGo",
  description: "SkillsetGo - Your Path to Skill Mastery",
};

const RootLayout = ({children}) => {
  return (
    <html lang="en">
      <body>
        <div className="main">
          <div className="gradient" />
        </div>
        <main className="app">
          {children}
        </main>
      </body>
    </html>
  )
}

export default RootLayout;