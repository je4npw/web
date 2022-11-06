import Image from "next/image";
import appImagePreview from '../assets/app-nlw-copa-preview.png'
import iconCheck from '../assets/icon-check.png'
import appLogo from '../assets/logo.svg'
import usersAvatar from '../assets/users-avatar-example.png'
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";

interface HomeProps {
  poolCount: number,
  userCount: number,
  guessCount: number
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')
  async function createPool(event: FormEvent) {
    event.preventDefault()
    try {
      const response = await api.post('pools', {
        title: poolTitle
      })
      const { code } = response.data
      await navigator.clipboard.writeText(code)
      alert("Bolão " + code + " criado com sucesso")
      setPoolTitle('')
    } catch (err) {
      console.log(err)
      alert('System Faaaaaailure')
    }

  }
  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image
          src={appLogo}
          alt="Logo App"
        />
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>
        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatar} alt="exemplo de avatares" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.userCount} </span>
            {
              props.userCount <= 1 ? "pessoa já está usando!" : "pessoas já estão usando!"
            }  </strong>
        </div>
        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text"
            required
            placeholder="Qual nome do seu bolão?"
            onChange={event => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button className=" bg-nlwyellow-500 hover:bg-nlwyellow-700 py-4 px-6 rounded text-sm font-bold uppercase text-gray-900" type="submit" >Criar meu bolão</button>
        </form>
        <p className="text-gray-300 text-sm mt-4 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>
        <div className="mt-10 pt-10 border-t border-gray-600 items-center flex justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheck} alt="Icone check" />
            <div className=" flex flex-col">
              <span className="font-bold text-2xl">+{props.poolCount}</span>
              <span className="text-sm">
                {
                  props.poolCount <= 1 ? "Bolão criado" : "Bolões criados"
                }
              </span>
            </div>
          </div>
          <div className="w-px h-10 bg-gray-600" />
          <div className="flex items-center gap-6">
            <Image src={iconCheck} alt="Icone check" />
            <div className=" flex flex-col">
              <span className="font-bold text-2xl">+{props.guessCount}</span>
              <span className="text-sm">
                {
                  props.guessCount <= 1 ? "Palpite enviado" : "Palpites enviados"
                }
              </span>
            </div>
          </div>
        </div>
      </main>
      <Image
        src={appImagePreview}
        alt="Preview da imagem do app"
        quality={100}
      />
    </div>
  )
}

export const getServerSideProps = async () => {
  const [
    poolCountResponse,
    userCountResponse,
    guessCountResponse
  ] = await Promise.all([
    api.get('pools/count'),
    api.get('users/count'),
    api.get('guesses/count')
  ])
  return {
    props: {
      poolCount: poolCountResponse.data.count,
      userCount: userCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
    },
  }
}