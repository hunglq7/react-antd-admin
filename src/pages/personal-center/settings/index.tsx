import { changeUserPassword } from "#src/api/user"
import { BasicContent } from "#src/components/basic-content"
import { PASSWORD_RULES } from "#src/constants/rules"
import { useUserStore } from "#src/store/user"
import { Button, Form, Input } from "antd"
import { useTranslation } from "react-i18next"

export default function Settings() {
	const { t } = useTranslation()
	const currentUser = useUserStore()
	const [form] = Form.useForm()

	const handleFinish = async (values: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
		try {
			const result = await changeUserPassword({
				userId: currentUser.id,
				currentPassword: values.currentPassword,
				newPassword: values.newPassword,
			})

			if (!result.isSuccessed) {
				throw new Error(result.message || "Đổi mật khẩu không thành công")
			}

			window.$message?.success("Đổi mật khẩu thành công")
			form.resetFields()
		} catch (error: any) {
			window.$message?.error(error?.message || "Không thể đổi mật khẩu")
		}
	}

	return (
		<BasicContent className="max-w-lg">
			<h3>Đổi mật khẩu</h3>
			<Form form={form} layout="vertical" onFinish={handleFinish}>
				<Form.Item
					label="Mật khẩu hiện tại"
					name="currentPassword"
					rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại" }]}
				>
					<Input.Password placeholder="Nhập mật khẩu hiện tại" />
				</Form.Item>

				<Form.Item label="Mật khẩu mới" name="newPassword" rules={PASSWORD_RULES(t)}>
					<Input.Password placeholder="Nhập mật khẩu mới" />
				</Form.Item>

				<Form.Item
					label="Xác nhận mật khẩu mới"
					name="confirmPassword"
					dependencies={["newPassword"]}
					rules={[
						{ required: true, message: "Vui lòng xác nhận mật khẩu mới" },
						({ getFieldValue }) => ({
							validator(_, value) {
								if (!value || getFieldValue("newPassword") === value) {
									return Promise.resolve()
								}
								return Promise.reject(new Error("Mật khẩu xác nhận không khớp"))
							},
						}),
					]}
				>
					<Input.Password placeholder="Nhập lại mật khẩu mới" />
				</Form.Item>

				<Form.Item>
					<Button type="primary" htmlType="submit">
						Cập nhật mật khẩu
					</Button>
				</Form.Item>
			</Form>
		</BasicContent>
	)
}
