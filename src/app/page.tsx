"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

const Home = () => {
  const router = useRouter()

  useEffect(() => {
    router.push("/absen")
  }, [router])

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-xl">Redirecting...</p>
    </div>
  )
}

export default Home