import { PageContainer, ProCard } from '@ant-design/pro-components';
import React from 'react';
// ĐÃ SỬA: Thêm chữ Tag vào dòng import dưới đây
import { InfoCircleOutlined } from '@ant-design/icons';
import { Alert, Collapse, Tag, Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const HelpPage: React.FC = () => {
  return (
    <PageContainer
      title="Hướng dẫn sử dụng & Câu hỏi thường gặp"
      subTitle="Tài liệu trợ giúp người dùng trên hệ thống mượn trả"
    >
      <ProCard bordered>
        <Alert
          message="Hỗ trợ kỹ thuật"
          description="Nếu bạn gặp lỗi hệ thống hoặc cần cấp lại mật khẩu, vui lòng liên hệ Admin qua email: clb.thietbi@school.edu.vn"
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          style={{ marginBottom: 24 }}
        />

        <Title level={4}>📌 Các câu hỏi thường gặp (FAQ)</Title>
        <Collapse defaultActiveKey={['1']} size="large">
          <Panel header="1. Làm thế nào để mượn thiết bị?" key="1">
            <Paragraph>
              Bạn truy cập vào tab <strong>Dịch vụ thiết bị</strong>, tìm kiếm
              tên thiết bị cần mượn trong kho. Nếu trạng thái là{' '}
              <Text type="success">Sẵn sàng</Text>, bạn bấm nút{' '}
              <strong>Đăng ký mượn</strong>, chọn khoảng thời gian và chờ Admin
              phê duyệt.
            </Paragraph>
          </Panel>
          <Panel header="2. Tôi có thể mượn tối đa bao nhiêu ngày?" key="2">
            <Paragraph>
              Theo quy định hiện tại, sinh viên được mượn thiết bị tối đa{' '}
              <strong>7 ngày</strong>. Trong trường hợp cần mượn lâu hơn phục vụ
              nghiên cứu khoa học, vui lòng tới phòng kho gặp trực tiếp Admin để
              gia hạn thủ công.
            </Paragraph>
          </Panel>
          <Panel header="3. Mức phạt khi trả đồ quá hạn là bao nhiêu?" key="3">
            <Paragraph>
              Hệ thống sẽ tính phí phạt <strong>20,000đ/ngày</strong> cho mỗi
              thiết bị bị trả quá hạn. Lưu ý: Khi bạn đang có thiết bị bị quá
              hạn, hệ thống sẽ tự động khóa quyền đăng ký mượn thiết bị mới của
              bạn.
            </Paragraph>
          </Panel>
          <Panel
            header="4. Làm sao để biết yêu cầu mượn của tôi đã được duyệt?"
            key="4"
          >
            <Paragraph>
              Trạng thái đơn mượn của bạn sẽ được cập nhật liên tục trong bảng{' '}
              <strong>Lịch sử mượn toàn hệ thống</strong>. Khi trạng thái chuyển
              sang <Tag color="blue">Đang mượn</Tag>, bạn có thể lên kho để nhận
              đồ.
            </Paragraph>
          </Panel>
        </Collapse>
      </ProCard>
    </PageContainer>
  );
};

export default HelpPage;
