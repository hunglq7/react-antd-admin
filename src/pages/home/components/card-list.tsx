import type { ColProps } from "antd"

import { MessageOutlined, MoneyCollectOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons"
import { Button, Card, Col, Row } from "antd"
import CountUp from "react-countup"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

const wrapperCol: ColProps = {
	xs: 24,
	sm: 24,
	md: 12,
	lg: 12,
	xl: 12,
	xxl: 6,
}

export default function CardList() {
	const { t } = useTranslation()
	const navigate = useNavigate()

	const CARD_LIST = [
		{
			key: "bienap",
			title: t("home.bienap"),
			data: 9982,
			icon: <UserOutlined />,
			path: "/bienap/tonghop",
		},
		{
			key: "mayxuc",
			title: t("home.mayxuc"),
			data: 81212,
			icon: <MessageOutlined />,
			path: "/mayxuc/tonghop",
		},
		{
			key: "role",
			title: t("home.role"),
			data: 9280,
			icon: <MoneyCollectOutlined />,
			path: "/role/tonghop",
		},
		{
			key: "maycao",
			title: t("home.maycao"),
			data: 13600,
			icon: <ShoppingCartOutlined />,
			path: "/maycao/tonghop",
		},
	]

	const handleCardClick = (path: string) => {
		if (path) {
			navigate(path) // Điều hướng URL -> React Router sẽ gỡ (unmount) Component Home hiện tại
		}
	}

	return (
		<div>
			<Row justify="space-between" gutter={[20, 20]}>
				{CARD_LIST.map((cardItem) => {
					return (
						<Col {...wrapperCol} key={cardItem.key}>
							<Card
								onClick={() => {
									handleCardClick(cardItem.path)
								}}
								className={`cursor-pointer transition duration-300 hover:-translate-y-2 hover:shadow-xl `}
							>
								<div className="flex justify-between items-center">
									<div className="flex flex-col">
										<h3 className="text-xl">{cardItem.title}</h3>
										<CountUp className="text-red-500" end={cardItem.data} separator="," />
									</div>
									<Button className="text-3xl pointer-events-none" icon={cardItem.icon} type="text" />
								</div>
							</Card>
						</Col>
					)
				})}
			</Row>
		</div>
	)
}
