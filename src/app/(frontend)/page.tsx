import Image from 'next/image'
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="holding">
      <Image
        src="/brand/pise-logo.png"
        alt="Agence PISE"
        width={200}
        height={60}
        priority
      />
      <div className="holding__text">
        <p className="eyebrow">Nouveau site en préparation</p>
        <h1>Mobilier et luminaires européens pour les lieux qui reçoivent.</h1>
      </div>
      <Link className="btn" href="/admin">
        Back-office
      </Link>
    </main>
  )
}
