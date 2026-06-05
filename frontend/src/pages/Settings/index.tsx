import { SaveOutlined } from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Switch,
  Spin,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { configApi } from '@/services/api';

const SettingsPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await configApi.getConfig();
      if (res) {
        form.setFieldsValue({
          maxBorrowDays: res.maxBorrowDays,
          lateFeePerDay: res.finePerDay,
          allowBorrowWhenDebt: res.allowBorrowWhenDebt,
          adminEmail: res.adminEmail,
        });
      }
    } catch (error) {
      message.error('Không thể tải cấu hình hệ thống');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, [form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const updateData = {
        maxBorrowDays: values.maxBorrowDays,
        finePerDay: values.lateFeePerDay,
        allowBorrowWhenDebt: values.allowBorrowWhenDebt,
        adminEmail: values.adminEmail,
      };

      await configApi.updateConfig(updateData);
      message.success('Đã lưu tất cả thay đổi cấu hình hệ thống!');
      fetchConfig();
    } catch (error) {
      message.error('Lỗi khi lưu cấu hình');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      title="Cấu hình tham số hệ thống"
      subTitle="Quản lý và tùy chỉnh các quy định mượn trả, tiền phạt và thông tin liên hệ"
    >
      <Spin spinning={loading}>
        <ProCard
          bordered
          style={{
            maxWidth: 800,
            margin: '0 auto',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          <Form form={form} layout="vertical" size="large">
            <Divider orientation="left" style={{ marginTop: 0 }}>
              Quy định mượn trả thiết bị
            </Divider>

            <Form.Item
              name="maxBorrowDays"
              label="Số ngày mượn tối đa"
              rules={[{ required: true, message: 'Không được để trống!' }]}
            >
              <InputNumber
                min={1}
                max={30}
                style={{ width: '100%' }}
                addonAfter="Ngày"
              />
            </Form.Item>

            <Form.Item
              name="lateFeePerDay"
              label="Tiền phạt trả muộn"
              rules={[{ required: true, message: 'Không được để trống!' }]}
            >
              <InputNumber
                min={0}
                step={5000}
                style={{ width: '100%' }}
                addonAfter="VNĐ / Ngày"
              />
            </Form.Item>

            <Form.Item
              name="allowBorrowWhenDebt"
              label="Cho phép mượn tiếp khi đang nợ đồ hoặc chưa nộp phạt?"
              valuePropName="checked"
            >
              <Switch checkedChildren="Cho phép" unCheckedChildren="Chặn lại" />
            </Form.Item>

            <Divider orientation="left">Thông tin liên hệ & Cảnh báo</Divider>

            <Form.Item
              name="adminEmail"
              label="Email nhận thông báo hệ thống"
              rules={[
                { type: 'email', message: 'Định dạng email không hợp lệ!' },
              ]}
            >
              <Input placeholder="Nhập email quản trị..." />
            </Form.Item>

            <Form.Item style={{ marginTop: 40, marginBottom: 0 }}>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSave}
                block
                loading={loading}
              >
                Lưu tất cả thay đổi
              </Button>
            </Form.Item>
          </Form>
        </ProCard>
      </Spin>
    </PageContainer>
  );
};

export default SettingsPage;
