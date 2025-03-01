import { useState } from "react"
import Head from "next/head"
import CodeEditor from "../components/CodeEditor"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Online Python Interpreter</title>
        <meta name="description" content="Run Python code in your browser" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="py-10 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Online Python Interpreter
        </h1>
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <CodeEditor />
        </div>
      </main>

      <footer className="py-6 text-center text-gray-500">
        <p>Built with Next.js and FastAPI</p>
      </footer>
    </div>
  )
}
