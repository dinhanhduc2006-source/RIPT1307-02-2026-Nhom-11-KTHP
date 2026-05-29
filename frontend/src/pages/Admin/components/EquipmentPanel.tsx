import { ProCard, ProTable } from '@ant-design/pro-components';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import React, { useMemo, useState } from 'react';
import { Equipment, LoanRequest } from '../data';

type Props = {
  equipment: Equipment[];
  requests: LoanRequest[];
  onSaveEquipment: (eq: Partial<Equipment> & { id?: number }) => void;
  onDeleteEquipment: (id: number) => void;
};
const { Paragraph, Title, Text } = Typography;

const EquipmentPanel: React.FC<Props> = ({
  equipment,
  requests,
  onSaveEquipment,
  onDeleteEquipment,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEq, setEditingEq] = useState<Equipment | null>(null);
  const [borrowersModalVisible, setBorrowersModalVisible] = useState(false);
  const [selectedEqForBorrowers, setSelectedEqForBorrowers] =
    useState<Equipment | null>(null);
  const [form] = Form.useForm();

  const topEquipment = useMemo(() => {
    const counts: Record<string, number> = {};
    requests.forEach((r) => {
      if (r.status === 'Approved' || r.status === 'Returned') {
        const name = r.equipment.name;
        counts[name] = (counts[name] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
  }, [requests]);

  const activeBorrowers = useMemo(() => {
    if (!selectedEqForBorrowers) return [];
    return requests.filter(
      (req) =>
        req.equipment.name === selectedEqForBorrowers.name && req.status === 'Approved',
    );
  }, [requests, selectedEqForBorrowers]);

  const openModal = (record?: Equipment) => {
    setEditingEq(record || null);
    form.setFieldsValue(
      record || { total: 1, available: 1, status: 'Available' },
    );
    setModalVisible(true);
  };

  // SỬA LỖI 1: Chặn không cho nhập số Sẵn có lớn hơn Tổng
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (values.available > values.total) {
        message.error(
          'Lỗi: Số lượng "Sẵn có" không được vượt quá "Tổng số lượng"!',
        );
        return;
      }
      onSaveEquipment({ ...values, id: editingEq?.id });
      setModalVisible(false);
      form.resetFields();
    } catch (e) {
      console.error(e);
    }
  };

  // SỬA LỖI 2: Chặn xóa thiết bị nếu đang có người mượn
  const handleDelete = (record: Equipment) => {
    const isBeingBorrowed = requests.some(
      (req) => req.equipment.name === record.name && req.status === 'Approved',
    );
    if (isBeingBorrowed) {
      message.error(
        `Không thể xóa! "${record.name}" đang có sinh viên mượn bên ngoài.`,
      );
      return;
    }
    onDeleteEquipment(record.id);
  };

  return (
    <ProCard title="Kho thiết bị" gutter={[16, 16]} split="vertical" bordered>
      <ProCard colSpan="70%" layout="center">
        <Button
          type="primary"
          style={{ marginBottom: 16 }}
          onClick={() => openModal()}
        >
          + Thêm thiết bị mới
        </Button>
        <ProTable<Equipment>
          columns={[
            { title: 'Thiết bị', dataIndex: 'name' },
            { title: 'Loại', dataIndex: 'category', width: 120 },
            {
              title: 'Sẵn có',
              dataIndex: 'available',
              width: 90,
              render: (t, r) => (
                <span
                  style={{
                    color: r.available === 0 ? 'red' : 'inherit',
                    fontWeight: r.available === 0 ? 'bold' : 'normal',
                  }}
                >
                  {t} {r.available === 0 && '⚠️'}
                </span>
              ),
            },
            { title: 'Tổng', dataIndex: 'total', width: 90 },
            {
              title: 'Trạng thái',
              dataIndex: 'status',
              width: 120,
              render: (_, r) => (
                <Tag
                  color={
                    r.status === 'Available'
                      ? 'success'
                      : r.status === 'Out of Stock'
                      ? 'error'
                      : 'warning'
                  }
                >
                  {r.status === 'Available'
                    ? 'Sẵn sàng'
                    : r.status === 'Out of Stock'
                    ? 'Hết hàng'
                    : 'Bảo trì'}
                </Tag>
              ),
            },
            {
              title: 'Hành động',
              valueType: 'option',
              width: 250,
              render: (_, record) => (
                <Space wrap>
                  <a
                    onClick={() => {
                      setSelectedEqForBorrowers(record);
                      setBorrowersModalVisible(true);
                    }}
                  >
                    Chi tiết mượn
                  </a>
                  <a onClick={() => openModal(record)}>Sửa</a>
                  <Popconfirm
                    title="Chắc chắn xóa thiết bị này?"
                    onConfirm={() => handleDelete(record)}
                  >
                    <a style={{ color: 'red' }}>Xóa</a>
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
          dataSource={equipment}
          rowKey="id"
          search={false}
          pagination={{ pageSize: 5 }}
        />
      </ProCard>

      <ProCard colSpan="30%">
        <Title level={5}>Top thiết bị mượn nhiều</Title>
        {topEquipment.map(([name, count]) => (
          <Paragraph key={name}>
            <Tag color="blue">{name}</Tag> {count} lượt
          </Paragraph>
        ))}
      </ProCard>

      <Modal
        title={editingEq ? 'Sửa thiết bị' : 'Thêm thiết bị'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên thiết bị"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Space align="start" style={{ width: '100%', gap: 16 }}>
            <Form.Item
              name="total"
              label="Tổng số lượng"
              rules={[{ required: true }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="available"
              label="Sẵn có"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Space>
          <Form.Item name="status" label="Trạng thái">
            <Select>
              <Select.Option value="Available">Sẵn sàng</Select.Option>
              <Select.Option value="Out of Stock">Hết hàng</Select.Option>
              <Select.Option value="Maintenance">Bảo trì</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={
          <span>
            Đang mượn:{' '}
            <Text type="success">{selectedEqForBorrowers?.name}</Text>
          </span>
        }
        open={borrowersModalVisible}
        footer={[
          <Button key="close" onClick={() => setBorrowersModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        onCancel={() => setBorrowersModalVisible(false)}
        width={600}
      >
        <Table
          dataSource={activeBorrowers}
          rowKey="id"
          pagination={false}
          columns={[
            {
              title: 'Người mượn',
              dataIndex: 'requester',
              render: (requester) => requester.username,
            },
            { title: 'Ngày mượn', dataIndex: 'borrowDate' },
            {
              title: 'Ngày phải trả',
              dataIndex: 'returnDate',
              render: (text) => {
                const isOverdue = new Date(text) < new Date();
                return (
                  <span style={{ color: isOverdue ? 'red' : 'inherit' }}>
                    {text} {isOverdue && '⚠️ (Quá hạn)'}
                  </span>
                );
              },
            },
          ]}
          locale={{ emptyText: 'Chưa có ai đang mượn.' }}
        />
      </Modal>
    </ProCard>
  );
};
export default EquipmentPanel;
