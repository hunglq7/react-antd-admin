import {
	ProForm,
	ProFormDigit,
	ProFormText,
	ProFormTextArea,
} from "@ant-design/pro-components";
import { Form, Input } from "antd";
import { BasicContent } from "#src/components/basic-content";

import { FormAvatarItem } from "#src/components/basic-form";
import { useUserStore } from "#src/store/user";

export default function Profile() {
	const currentUser = useUserStore();
	const getAvatarURL = () => {
		if (currentUser) {
			if (currentUser.avatar) {
				return currentUser.avatar;
			}
			const url = "https://avatar.vercel.sh/blur.svg?text=2";
			return url;
		}
		return "";
	};

	const handleFinish = async () => {
		window.$message?.success("Lưu thành công");
	};

	return (
		<BasicContent className="max-w-md ml-10">
			<h3>Thông tin cá nhân</h3>
			<ProForm
				layout="vertical"
				onFinish={handleFinish}
				initialValues={{
					...currentUser,
					avatar: getAvatarURL(),
				}}
				requiredMark
			>
				<Form.Item
					name="avatar"
					label="Ảnh đại diện"
					rules={[
						{
							required: true,
							message: "Ảnh đại diện không được để trống",
						},
					]}
				>
					<FormAvatarItem />
				</Form.Item>
				<ProFormText
					name="username"
					label="Tên người dùng"
					rules={[
						{
							required: true,
							message: "Vui lòng nhập tên người dùng của bạn!",
						},
					]}
				/>
				<ProFormText
					name="email"
					label="Email"
					rules={[
						{
							required: true,
							message: "Vui lòng nhập email của bạn!",
						},
					]}
				/>
				<ProFormDigit
					name="phoneNumber"
					label="Số điện thoại"
					rules={[
						{
							required: true,
							message: "Vui lòng nhập số điện thoại của bạn!",
						},
					]}
				>
					<Input type="tel" allowClear />
				</ProFormDigit>
				<ProFormTextArea
					allowClear
					name="description"
					label="Giới thiệu bản thân"
					placeholder="Giới thiệu bản thân"
				/>
			</ProForm>
		</BasicContent>
	);
};
