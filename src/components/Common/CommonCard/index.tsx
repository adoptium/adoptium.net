import { Link } from "@/i18n/navigation"
import "./styles.css"

interface CommonCardData {
  title: string
  description: string
  href: string
  button: string
}

interface CommonCardProps {
  data: CommonCardData
}

const CommonCard: React.FC<CommonCardProps> = ({ data }) => {
  return (
    <div className="p-10 flex flex-col max-w-[400px] common-card h-[440px] md:h-[480px] bg-[#200E46]">
      <div className="grow">
        <h3 className="text-white text-[30px] font-semibold whitespace-nowrap md:whitespace-normal leading-[120%] md:text-[40px]">
          {data.title}
        </h3>
        <p className="mt-6 text-xl text-grey font-normal">{data.description}</p>
      </div>
      <Link href={data.href}>
        <button className="bg-transparent border-2 border-pink-500/0 text-white text-base leading-6 font-normal w-[180px] h-[48px] rounded-[80px] gradient-border">
          {data.button}
        </button>
      </Link>
    </div>
  )
}

export default CommonCard
