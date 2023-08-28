import './globals.css'

export const metadata = {
  title: 'Web ChatBot',
  description: 'Created by @devsakae',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
