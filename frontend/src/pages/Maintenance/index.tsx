import { PlusOutlined, ToolOutlined } from '@ant-design/icons';
import { PageContainer, ProCard, ProTable } from '@ant-design/pro-components';
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Space,
  Tag,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { maintenanceApi, equipmentApi, getUser } from '@/services/api';

const MaintenancePage: React.FC = () => {
  const [data, setData] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [maintRes, eqRes] = await Promise.all([
        maintenanceApi.getAll(),
        equipmentApi.getAll()
      ]);
      setData(maintRes || []);
      setEquipments(eqRes || []);
    } catch (error) {
      message.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      await equipmentApi.setMaintenance(values.equipmentId, values.issue);
      message.success('Đã tạo phiếu bảo trì thành công');
      setIsModalOpen(false);
      form.resetFields();
      fetchData();
    } catch (e) {
      console.error(e);
      message.error('Không thể tạo phiếu bảo trì');
    }
  };

  const updateStatus = async (id: number, newStatus: string, cost?: number) => {
    try {
      await maintenanceApi.updateStatus(id, newStatus, cost);
      message.success(`Đã cập nhật tiến độ thành công`);
      fetchData();
    } catch (error) {
      message.error('Cập nhật thất bại');
    }
  };

  return (
    <PageContainer
      title="Quản lý Bảo trì & Sửa chữa"
      subTitle="Theo dõi chi phí và tiến độ sửa chữa thiết bị hỏng"
    >
      <ProCard bordered>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          style={{ marginBottom: 16 }}
        >
          Tạo phiếu bảo trì
        </Button>
        <ProTable
          loading={loading}
          dataSource={data}
          rowKey="id"
          search={false}
          columns={[
            { title: 'Mã phiếu', dataIndex: 'id', width: 100 },
            {
              title: 'Tên thiết bị',
              dataIndex: 'equipment',
              render: (_, record: any) => <strong>{record.equipment?.name || 'N/A'}</strong>,
            },
            { title: 'Tình trạng lỗi', dataIndex: 'issue' },
            {
              title: 'Chi phí dự kiến (VNĐ)',
              dataIndex: 'cost',
              render: (v) => v ? v.toLocaleString() + ' đ' : '0 đ',
            },
            { 
              title: 'Ngày báo hỏng', 
              dataIndex: 'date',
              render: (v: any) => v || '-'
            },
            {
              title: 'Tiến độ',
              dataIndex: 'status',
              render: (s) => {
                const statusMap: Record<string, string> = {
                  'AwaitingApproval': 'Chờ duyệt',
                  'UnderRepair': 'Đang sửa',
                  'Completed': 'Đã xong'
                };
                return (
                  <Tag
                    color={
                      s === 'AwaitingApproval'
                        ? 'orange'
                        : s === 'UnderRepair'
                        ? 'blue'
                        : 'green'
                    }
                  >
                    {statusMap[s] || s}
                  </Tag>
                );
              },
            },
            {
              title: 'Cập nhật',
              render: (_, record: any) => (
                <Space>
                  {record.status === 'AwaitingApproval' && (
                    <a onClick={() => updateStatus(record.id, 'UnderRepair')}>
                      Bắt đầu sửa
                    </a>
                  )}
                  {record.status !== 'Completed' && (
                    <a
                      style={{ color: 'green' }}
                      onClick={() => updateStatus(record.id, 'Completed')}
                    >
                      Hoàn thành
                    </a>
                  )}
                </Space>
              ),
            },
          ]}
        />
      </ProCard>

      <Modal
        title={
          <span>
            <ToolOutlined /> Lập phiếu bảo trì mới
          </span>
        }
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        destroyOnClose
        okText="Tạo phiếu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="equipmentId"
            label="Chọn thiết bị hỏng"
            rules={[{ required: true }]}
          >
            <Select placeholder="Chọn thiết bị...">
              {equipments.map((eq: any) => (
                <Select.Option key={eq.id} value={eq.id}>
                  {eq.name} (Sẵn có: {eq.available}/{eq.total})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="issue"
            label="Mô tả lỗi"
            rules={[{ required: true }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Nhập mô tả tình trạng lỗi..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};
export default MaintenancePage;
